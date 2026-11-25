import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const audit = fileURLToPath(new URL(
  "../plugin/skills/poteto-mode/scripts/worktree-audit.sh",
  import.meta.url,
));

test("audits a worktree with spaces and distinguishes supplied history from unknown", () => {
  const temp = realpathSync(mkdtempSync(path.join(tmpdir(), "pstack-worktree-audit-")));
  try {
    const repo = path.join(temp, "repo");
    const worker = path.join(temp, "worker with spaces");
    const git = (...args) => execFileSync("git", args, { cwd: repo, stdio: "pipe" });
    execFileSync("git", ["init", "-b", "main", repo], { stdio: "pipe" });
    writeFileSync(path.join(repo, "shared.txt"), "baseline\n");
    git("add", "shared.txt");
    git("-c", "user.name=Fixture", "-c", "user.email=fixture@example.com",
        "commit", "-m", "fixture");
    git("worktree", "add", "-b", "fixture-worker", worker);
    const status = (...args) => {
      const output = execFileSync("bash", [audit, ...args, repo], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
      return output.trimEnd().split("\n").at(-1).split("\t");
    };

    let row = status();
    assert.equal(row[2], "YES");
    assert.equal(row[3], "clean");
    assert.equal(row[6], "unknown");
    assert.equal(row[7], "check-before-cleanup");
    assert.equal(row[8], worker);
    assert.equal(status("--recent-worktree", worker)[7], "verify-recent-use");

    git("config", "status.showUntrackedFiles", "no");
    writeFileSync(path.join(worker, "scratch.txt"), "keep this file\n");
    assert.equal(status()[3], "scratch:1");
    assert.equal(status()[7], "hold-local-edits");

    writeFileSync(path.join(worker, "shared.txt"), "worktree only\n");
    row = status();
    assert.equal(row[3], "wip:1");
    assert.equal(row[7], "hold-local-edits");
    assert.equal(execFileSync("git", ["status", "--short"], {
      cwd: repo,
      encoding: "utf8",
    }), "");
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
