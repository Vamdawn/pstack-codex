import { spawnSync } from "node:child_process";
import { positiveInteger, sourceBranch, type Target } from "./remote.ts";

type Readiness = "READY" | "WAITING" | "BLOCKED" | "MERGED" | "CLOSED" | "UNKNOWN";
type Approval = "satisfied" | "not_required" | "pending" | "unknown";

export interface Observation {
  status: Readiness;
  reason: string;
  head?: string;
  mergeStatus?: string;
  pipeline?: { id: number; status: string } | null;
  approval?: Approval;
  unresolvedDiscussions?: number;
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Invalid ${label} response.`);
  }
  return Object.fromEntries(Object.entries(value));
}

function stringField(value: unknown, field: string): string {
  if (typeof value !== "string" || !value) throw new Error(`Missing GitLab field: ${field}.`);
  return value;
}

function arrayField(value: unknown, field: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`Missing GitLab list: ${field}.`);
  return value;
}

function decodeJson(output: string): unknown {
  try {
    return JSON.parse(output);
  } catch {
    throw new Error("GitLab returned invalid JSON.");
  }
}

export function gitlabClient(host: string, remaining: () => number) {
  const api = new URL(`https://${host}`);
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    GLAB_NO_PROMPT: "1",
    GLAB_DEBUG_HTTP: "false",
    GLAB_SEND_TELEMETRY: "false",
    GLAB_CHECK_UPDATE: "false",
  };
  // A process-wide API host can point at a different remote. Use host-specific
  // glab auth setup unless the selected HTTP remote pins a port itself.
  delete env.GITLAB_API_HOST;
  if (host !== api.hostname) env.GITLAB_API_HOST = host;
  if (host === "gitlab.com") env.GLAB_API_PROTOCOL = "https";
  return (endpoint: string, label: string, paginate = false): unknown => {
    const available = remaining();
    if (available <= 0) throw new Error("The watch deadline was reached.");
    const args = ["api", "--method", "GET", "--hostname", api.hostname, endpoint];
    if (paginate) args.push("--paginate", "--output", "ndjson");
    const result = spawnSync("glab", args, {
      encoding: "utf8",
      env,
      stdio: ["ignore", "pipe", "ignore"],
      timeout: Math.min(15_000, Math.ceil(available)),
      maxBuffer: 16 * 1024 * 1024,
    });
    if (result.error?.code === "ENOENT") throw new Error("glab is required to read this GitLab merge request.");
    if (result.status !== 0) {
      throw new Error(`Could not read ${label} from GitLab. Check glab authentication, connectivity and endpoint access.`);
    }
    const output = result.stdout.trim();
    if (!paginate) return decodeJson(output);
    // glab NDJSON emits each item separately. Accept full arrays emitted as a single line too.
    return output ? output.split("\n").flatMap((line) => {
      const value = decodeJson(line);
      return Array.isArray(value) ? value : [value];
    }) : [];
  };
}

type GitLabRead = ReturnType<typeof gitlabClient>;

export function detectMergeRequest(target: Target, read: GitLabRead): number {
  const branch = sourceBranch(target);
  const projectPath = `projects/${encodeURIComponent(target.project)}`;
  const project = record(read(projectPath, "source project"), "source project");
  const sourceId = positiveInteger(project.id);
  if (sourceId === undefined) throw new Error("Cannot verify this GitLab source project's identity. Pass the merge request URL.");
  const query = new URLSearchParams({ state: "opened", source_branch: branch, scope: "all", per_page: "100" });
  const values = arrayField(read(`${projectPath}/merge_requests?${query}`, "open merge requests", true), "open merge requests");
  const candidates = values.map((value) => record(value, "merge request")).filter((mr) =>
    mr.state === "opened" && mr.source_branch === branch && mr.source_project_id === sourceId && mr.target_project_id === sourceId
  );
  const number = candidates.length === 1 && positiveInteger(candidates[0].iid);
  if (number) return number;
  throw new Error("Cannot pick a single open merge request for this branch and project. Pass its URL or --mr.");
}

function pipelineFrom(value: unknown): Observation["pipeline"] {
  if (value === undefined || value === null) return null;
  const pipeline = record(value, "MR head pipeline");
  const id = positiveInteger(pipeline.id);
  if (id === undefined) throw new Error("Missing GitLab field: head_pipeline.id.");
  return { id, status: stringField(pipeline.status, "head_pipeline.status") };
}

function approvalFrom(value: unknown, mergeStatus: string): Approval {
  const approvals = record(value, "MR approvals");
  const left = approvals.approvals_left;
  if (left !== undefined) {
    if (typeof left !== "number" || !Number.isSafeInteger(left) || left < 0) return "unknown";
    if (left > 0) return "pending";
    return approvals.approved === true ? "satisfied" : "unknown";
  }
  if (approvals.approved === true) return "satisfied";
  if (approvals.approved !== false) return "unknown";
  // Community Edition can report false simply because no one has approved.
  if (mergeStatus === "not_approved") return "pending";
  return mergeStatus === "mergeable" ? "not_required" : "unknown";
}

function countUnresolved(value: unknown): number {
  return arrayField(value, "discussions").filter((item) => {
    const discussion = record(item, "discussion");
    const notes = arrayField(discussion.notes, "discussion.notes");
    const flags = notes.map((item) => {
      const note = record(item, "discussion note");
      if (note.resolvable === false) return false;
      if (note.resolvable !== true || typeof note.resolved !== "boolean") {
        throw new Error("Could not determine a GitLab discussion's resolved status.");
      }
      return !note.resolved;
    });
    return flags.includes(true);
  }).length;
}

const waitingMergeStates = new Set([
  "approvals_syncing", "checking", "ci_still_running", "discussions_not_resolved",
  "merge_time", "not_approved", "preparing", "unchecked",
]);
const blockedMergeStates = new Set([
  "ci_must_pass", "commits_status", "conflict", "draft_status", "jira_association_missing",
  "merge_request_blocked", "need_rebase", "not_open", "requested_changes", "security_policy_violations",
  "status_checks_must_pass", "title_regex", "external_status_checks", "merge_train",
]);
const waitingPipelines = new Set(["created", "waiting_for_resource", "preparing", "pending", "running", "scheduled"]);
const blockedPipelines = new Set(["failed", "canceled", "skipped", "manual"]);

export function readMergeRequest(target: Target, number: number, read: GitLabRead): Observation {
  const endpoint = `projects/${encodeURIComponent(target.project)}/merge_requests/${number}`;
  const mr = record(read(endpoint, "merge request"), "merge request");
  if (mr.iid !== number) throw new Error("GitLab returned a different merge request IID.");
  if (mr.state === "merged") return { status: "MERGED", reason: "merged" };
  if (mr.state === "closed") return { status: "CLOSED", reason: "closed" };
  if (mr.state === "locked") return { status: "WAITING", reason: "merge_request_locked" };
  if (mr.state !== "opened") return { status: "UNKNOWN", reason: "merge_request_state_unknown" };

  const head = stringField(mr.sha, "sha");
  const mergeStatus = stringField(mr.detailed_merge_status, "detailed_merge_status");
  const pipeline = pipelineFrom(mr.head_pipeline);
  const approval = approvalFrom(read(`${endpoint}/approvals`, "merge request approvals"), mergeStatus);
  const unresolvedDiscussions = countUnresolved(read(`${endpoint}/discussions?per_page=100`, "merge request discussions", true));
  const facts = { head, mergeStatus, pipeline, approval, unresolvedDiscussions };

  if (mr.has_conflicts === true || mergeStatus === "conflict") return { ...facts, status: "BLOCKED", reason: "merge_conflict" };
  if (mr.draft === true || mergeStatus === "draft_status") return { ...facts, status: "BLOCKED", reason: "draft" };
  if (typeof mr.has_conflicts !== "boolean" || typeof mr.draft !== "boolean") {
    return { ...facts, status: "UNKNOWN", reason: "draft_or_conflict_state_unknown" };
  }
  if (pipeline && blockedPipelines.has(pipeline.status)) return { ...facts, status: "BLOCKED", reason: "pipeline_" + pipeline.status };
  if (pipeline && waitingPipelines.has(pipeline.status)) return { ...facts, status: "WAITING", reason: "pipeline_" + pipeline.status };
  if (blockedMergeStates.has(mergeStatus)) return { ...facts, status: "BLOCKED", reason: mergeStatus };
  if (waitingMergeStates.has(mergeStatus)) return { ...facts, status: "WAITING", reason: mergeStatus };
  if (mergeStatus !== "mergeable") return { ...facts, status: "UNKNOWN", reason: "merge_status_unknown" };
  if (!pipeline || pipeline.status !== "success") return { ...facts, status: "UNKNOWN", reason: "successful_head_pipeline_not_confirmed" };
  if (approval === "unknown") return { ...facts, status: "UNKNOWN", reason: "approval_state_unknown" };
  if (approval === "pending") return { ...facts, status: "WAITING", reason: "approval_required" };
  if (unresolvedDiscussions || mr.blocking_discussions_resolved === false) {
    return { ...facts, status: "WAITING", reason: "unresolved_discussions" };
  }
  const latest = record(read(endpoint, "merge request confirmation"), "merge request");
  const latestPipeline = pipelineFrom(latest.head_pipeline);
  if (
    latest.iid !== number || latest.state !== "opened" || latest.sha !== head ||
    latest.detailed_merge_status !== "mergeable" || latest.draft !== false || latest.has_conflicts !== false ||
    latest.blocking_discussions_resolved === false ||
    latestPipeline?.id !== pipeline.id || latestPipeline?.status !== "success"
  ) {
    return { ...facts, status: "WAITING", reason: "merge_request_changed_during_query" };
  }
  return { ...facts, status: "READY", reason: "merge_requirements_met" };
}
