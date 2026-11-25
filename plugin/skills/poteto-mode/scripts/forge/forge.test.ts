import { afterEach, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const forge = join(import.meta.dir, "forge");
const scratch: string[] = [];

afterEach(() => {
  for (const directory of scratch.splice(0)) rmSync(directory, { recursive: true, force: true });
});

function repository(): string {
  const cwd = mkdtempSync(join(tmpdir(), "pstack-forge-test-"));
  scratch.push(cwd);
  git(cwd, "init", "--initial-branch=feature");
  return cwd;
}

function git(cwd: string, ...args: string[]) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr);
}

function command(cwd: string, args: string[], env = process.env) {
  return spawnSync(process.execPath, [forge, ...args], { cwd, env, encoding: "utf8" });
}

test("resolves GitHub and GitLab remote forms without exposing credentials", () => {
  const cwd = repository();
  const inputs = [
    ["https://user:secret@github.com/team/project.git", { provider: "github", host: "github.com", project: "team/project" }],
    ["git@github.com:team/project.git", { provider: "github", host: "github.com", project: "team/project" }],
    ["ssh://git@ssh.github.com:443/team/project.git", { provider: "github", host: "github.com", project: "team/project" }],
    ["https://github.com/team/project/pull/7/files", { provider: "github", host: "github.com", project: "team/project", number: 7 }],
    ["https://gitlab.com/team/area/project/-/merge_requests/31/diffs", { provider: "gitlab", host: "gitlab.com", project: "team/area/project", number: 31 }],
    ["git@altssh.gitlab.com:team/area/project.git", { provider: "gitlab", host: "gitlab.com", project: "team/area/project" }],
  ];
  for (const [url, expected] of inputs) {
    if (typeof url !== "string") throw new Error("Invalid fixture");
    const result = command(cwd, ["resolve", "--url", url]);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual(expected);
    expect(result.stdout).not.toContain("secret");
  }
});

test("explicit choices override the tracked remote, which overrides origin", () => {
  const cwd = repository();
  git(cwd, "remote", "add", "origin", "git@github.com:team/project.git");
  git(cwd, "remote", "add", "tracked", "git@gitlab.com:team/area/project.git");
  git(cwd, "config", "branch.feature.remote", "tracked");
  git(cwd, "config", "branch.feature.merge", "refs/heads/feature");

  const tracked = command(cwd, ["resolve"]);
  expect(tracked.status).toBe(0);
  expect(JSON.parse(tracked.stdout)).toEqual({
    provider: "gitlab", host: "gitlab.com", project: "team/area/project", remote: "tracked",
  });

  const origin = command(cwd, ["resolve", "--remote", "origin"]);
  expect(origin.status).toBe(0);
  expect(JSON.parse(origin.stdout)).toEqual({
    provider: "github", host: "github.com", project: "team/project", remote: "origin",
  });
});

test("uses origin or a sole remote and rejects ambiguous or unrecognized remotes", () => {
  const cwd = repository();
  git(cwd, "remote", "add", "west", "git@github.com:team/project.git");
  const sole = command(cwd, ["resolve"]);
  expect(sole.status).toBe(0);
  expect(JSON.parse(sole.stdout).remote).toBe("west");
  git(cwd, "remote", "add", "east", "git@gitlab.com:team/project.git");
  expect(command(cwd, ["resolve"]).stderr).toContain("Multiple remotes");
  git(cwd, "remote", "rename", "east", "origin");
  expect(JSON.parse(command(cwd, ["resolve"]).stdout).remote).toBe("origin");

  const unknown = command(cwd, ["resolve", "--url", "https://user:secret@gitlab.invalid/team/project"]);
  expect(unknown.status).toBe(2);
  expect(unknown.stderr).toContain("Cannot identify the forge");
  expect(unknown.stderr).not.toContain("secret");
});

test("accepts a locally configured GitLab host and disregards SSH transport ports", () => {
  const cwd = repository();
  git(cwd, "config", "--local", "--add", "pstack.gitlabHost", "gitlab.example.net");
  const result = command(cwd, ["resolve", "--url", "ssh://git@gitlab.example.net:2222/team/area/project.git"]);
  expect(result.status).toBe(0);
  expect(JSON.parse(result.stdout)).toEqual({
    provider: "gitlab", host: "gitlab.example.net", project: "team/area/project",
  });
});

const mr = {
  iid: 7,
  state: "opened",
  sha: "a".repeat(40),
  has_conflicts: false,
  draft: false,
  detailed_merge_status: "mergeable",
  blocking_discussions_resolved: true,
  head_pipeline: { id: 11, status: "success" },
  pipeline: { id: 12, status: "failed" },
};
const endpoint = "projects/team%2Farea%2Fproject/merge_requests/7";
const target = ["--url", "https://gitlab.com/team/area/project/-/merge_requests/7"];
const approvals = { approved: true, approvals_left: 0 };
const glabScript = [
  "#!/usr/bin/env bun",
  'import { appendFileSync, existsSync, readFileSync } from "node:fs";',
  "const args = process.argv.slice(2);",
  "if (process.env.GLAB_SEND_TELEMETRY !== 'false' || process.env.GLAB_CHECK_UPDATE !== 'false') process.exit(65);",
  "if ((process.env.PSTACK_FORGE_GLAB_EXPECTED_API_HOST || undefined) !== process.env.GITLAB_API_HOST) process.exit(66);",
  "const ep = args[5];",
  "const log = process.env.PSTACK_FORGE_GLAB_LOG;",
  "const past = existsSync(log) ? readFileSync(log, 'utf8').trim().split('\\n').filter(Boolean).map(JSON.parse) : [];",
  "appendFileSync(log, JSON.stringify(args) + '\\n');",
  "const values = JSON.parse(readFileSync(process.env.PSTACK_FORGE_GLAB_FIXTURE, 'utf8'))[ep];",
  "if (!values || args[0] !== 'api' || args[1] !== '--method' || args[2] !== 'GET') process.exit(64);",
  "const count = past.filter((call) => call[5] === ep).length;",
  "const value = values[Math.min(count, values.length - 1)];",
  "if (value?.error) { process.stderr.write('private token and server response'); process.exit(1); }",
  "if (args.includes('--paginate') && Array.isArray(value)) { for (const row of value) console.log(JSON.stringify(row)); }",
  "else console.log(JSON.stringify(value));",
].join("\n") + "\n";

function mockGlab(cwd: string, responses: Record<string, unknown[]>) {
  const log = join(cwd, "glab.log");
  const fixture = join(cwd, "gitlab-fixture.json");
  writeFileSync(join(cwd, "glab"), glabScript, { mode: 0o755 });
  writeFileSync(fixture, JSON.stringify(responses));
  return {
    env: { ...process.env, PATH: `${cwd}:${process.env.PATH}`, PSTACK_FORGE_GLAB_FIXTURE: fixture, PSTACK_FORGE_GLAB_LOG: log },
    commands: () => readFileSync(log, "utf8").trim().split("\n").map((line) => JSON.parse(line)),
  };
}

function responseSet(overrides: Record<string, unknown[]> = {}) {
  return {
    [endpoint]: [mr],
    [`${endpoint}/approvals`]: [approvals],
    [`${endpoint}/discussions?per_page=100`]: [[]],
    ...overrides,
  };
}

test("reads only the pinned GitLab target, explicitly paginates discussions and uses the MR head pipeline", () => {
  const cwd = repository();
  git(cwd, "remote", "add", "origin", "git@github.com:other/project.git");
  const fixture = mockGlab(cwd, responseSet());
  const result = command(cwd, ["watch-mr", ...target, "--status-only"], fixture.env);
  expect(result.stderr).toBe("");
  expect(result.status).toBe(0);
  expect(JSON.parse(result.stdout)).toMatchObject({
    provider: "gitlab", host: "gitlab.com", project: "team/area/project", number: 7,
    status: "READY", head: mr.sha, pipeline: { id: 11, status: "success" },
    approval: "satisfied", unresolvedDiscussions: 0,
  });
  expect(fixture.commands()).toEqual([
    ["api", "--method", "GET", "--hostname", "gitlab.com", endpoint],
    ["api", "--method", "GET", "--hostname", "gitlab.com", endpoint + "/approvals"],
    ["api", "--method", "GET", "--hostname", "gitlab.com", endpoint + "/discussions?per_page=100", "--paginate", "--output", "ndjson"],
    ["api", "--method", "GET", "--hostname", "gitlab.com", endpoint],
  ]);
});

test("passes a self-managed port separately from the glab hostname and overrides unrelated API host variables", () => {
  const cwd = repository();
  git(cwd, "config", "--local", "--add", "pstack.gitlabHost", "gitlab.example.net:8443");
  const fixture = mockGlab(cwd, responseSet());
  const result = command(cwd, [
    "watch-mr", "--url", "https://gitlab.example.net:8443/team/area/project/-/merge_requests/7", "--status-only",
  ], {
    ...fixture.env,
    GITLAB_API_HOST: "unrelated.example.net",
    PSTACK_FORGE_GLAB_EXPECTED_API_HOST: "gitlab.example.net:8443",
  });
  expect(result.status).toBe(0);
  expect(JSON.parse(result.stdout)).toMatchObject({ host: "gitlab.example.net:8443", status: "READY" });
  expect(fixture.commands().map((args) => args[4])).toEqual(Array(4).fill("gitlab.example.net"));
});

test("identifies an MR by the tracked source branch, ignoring a same-named branch from a fork", () => {
  const cwd = repository();
  git(cwd, "remote", "add", "origin", "git@gitlab.com:team/area/project.git");
  git(cwd, "config", "branch.feature.remote", "origin");
  git(cwd, "config", "branch.feature.merge", "refs/heads/published");
  const fixture = mockGlab(cwd, responseSet({
    "projects/team%2Farea%2Fproject": [{ id: 10 }],
    "projects/team%2Farea%2Fproject/merge_requests?state=opened&source_branch=published&scope=all&per_page=100": [[
      { iid: 7, state: "opened", source_branch: "published", source_project_id: 10, target_project_id: 10 },
      { iid: 8, state: "opened", source_branch: "published", source_project_id: 22, target_project_id: 10 },
    ]],
  }));
  const result = command(cwd, ["watch-mr", "--status-only"], fixture.env);
  expect(result.stderr).toBe("");
  expect(result.status).toBe(0);
  expect(JSON.parse(result.stdout)).toMatchObject({ number: 7, status: "READY" });
});

test("reports missing approvals, unresolved discussions and merge conflicts without treating them as ready", () => {
  const fixtures = [
    { responses: { [`${endpoint}/approvals`]: [{ approved: false, approvals_left: 1 }] }, status: "WAITING", reason: "approval_required" },
    { responses: { [`${endpoint}/discussions?per_page=100`]: [[{ notes: [{ resolvable: true, resolved: false }] }]] }, status: "WAITING", reason: "unresolved_discussions" },
    { responses: { [endpoint]: [{ ...mr, has_conflicts: true }] }, status: "BLOCKED", reason: "merge_conflict" },
    { responses: { [endpoint]: [{ ...mr, head_pipeline: { id: 11, status: "failed" } }] }, status: "BLOCKED", reason: "pipeline_failed" },
    { responses: { [endpoint]: [{ ...mr, head_pipeline: null }] }, status: "UNKNOWN", reason: "successful_head_pipeline_not_confirmed" },
    { responses: { [endpoint]: [{ ...mr, detailed_merge_status: "future_status" }] }, status: "UNKNOWN", reason: "merge_status_unknown" },
    { responses: { [endpoint]: [mr, { ...mr, sha: "b".repeat(40) }] }, status: "WAITING", reason: "merge_request_changed_during_query" },
  ];
  for (const { responses, status, reason } of fixtures) {
    const cwd = repository();
    const fixture = mockGlab(cwd, responseSet(responses));
    const result = command(cwd, ["watch-mr", ...target, "--status-only"], fixture.env);
    expect(result.status).toBe(status === "UNKNOWN" ? 1 : 0);
    expect(JSON.parse(result.stdout)).toMatchObject({ status, reason });
  }
});

test("does not print credentials or raw external errors when a required query fails", () => {
  const cwd = repository();
  const fixture = mockGlab(cwd, responseSet({ [`${endpoint}/approvals`]: [{ error: true }] }));
  const result = command(cwd, ["watch-mr", ...target, "--status-only"], fixture.env);
  expect(result.status).toBe(1);
  expect(JSON.parse(result.stdout)).toMatchObject({ status: "UNKNOWN" });
  expect(result.stdout).not.toContain("private token");
  expect(result.stderr).toBe("");
});

test("polls pending pipelines and approvals until ready with a finite deadline", () => {
  const cwd = repository();
  const fixture = mockGlab(cwd, responseSet({
    [endpoint]: [{ ...mr, head_pipeline: { id: 11, status: "pending" } }, mr],
    [`${endpoint}/approvals`]: [{ approved: false, approvals_left: 1 }, { approved: false, approvals_left: 1 }, approvals],
  }));
  const result = command(cwd, ["watch-mr", ...target, "--interval", "0.01", "--timeout", "15"], fixture.env);
  expect(result.status).toBe(0);
  expect(result.stdout.trim().split("\n").map((line) => JSON.parse(line).reason)).toEqual([
    "pipeline_pending", "approval_required", "merge_requirements_met",
  ]);
}, 25_000);

test("ends a still-waiting watch when the requested deadline is reached", () => {
  const cwd = repository();
  const fixture = mockGlab(cwd, responseSet({
    [endpoint]: [{ ...mr, head_pipeline: { id: 11, status: "pending" } }],
  }));
  const result = command(cwd, ["watch-mr", ...target, "--interval", "1", "--timeout", "0.35"], fixture.env);
  expect(result.status).toBe(3);
  const events = result.stdout.trim().split("\n").map((line) => JSON.parse(line).status);
  expect(events.at(-1)).toBe("TIMEOUT");
  expect(events).not.toContain("READY");
});
