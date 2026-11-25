import { spawnSync } from "node:child_process";

type Provider = "github" | "gitlab";

export interface Target {
  provider: Provider;
  host: string;
  project: string;
  remote?: string;
  number?: number;
}

export interface Selection {
  remote?: string;
  url?: string;
}

export function git(args: string[]): string | undefined {
  const result = spawnSync("git", args, {
    encoding: "utf8",
    timeout: 5_000,
    stdio: ["ignore", "pipe", "ignore"],
  });
  return result.status === 0 ? result.stdout.trim() : undefined;
}

export function positiveInteger(value: unknown): number | undefined {
  if (typeof value === "string" && !/^[1-9]\d*$/.test(value)) return undefined;
  if (typeof value !== "string" && typeof value !== "number") return undefined;
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : undefined;
}

function providerFor(host: string): Provider {
  if (host === "github.com") return "github";
  if (host === "gitlab.com") return "gitlab";

  const providers = (["github", "gitlab"] satisfies Provider[]).filter((provider) => {
    const entries = git(["config", "--local", "--get-all", `pstack.${provider}Host`]);
    return entries?.split("\n").some((entry) => entry.trim().toLowerCase() === host);
  });
  if (providers.length === 1) return providers[0];
  if (providers.length > 1) throw new Error(`Host "${host}" is configured for both GitHub and GitLab.`);
  throw new Error(
    `Cannot identify the forge for "${host}". For a known self-managed host, add it to the local Git config with pstack.gitlabHost or pstack.githubHost.`,
  );
}

function cleanProject(segments: string[]): string {
  const parts = segments.map((segment) => decodeURIComponent(segment));
  if (parts.length < 2 || parts.some((part) => !/^[a-z0-9_.-]+$/i.test(part) || part === "." || part === "..")) {
    throw new Error("Expected a fully qualified GitHub or GitLab project path.");
  }
  return parts.join("/");
}

function parseTarget(value: string): Target {
  const scp = /^(?:[^\s/@:]+@)?([a-z0-9.-]+):([^\s].*)$/i.exec(value);
  const url = new URL(scp && !scp[2].startsWith("//") ? `ssh://${scp[1]}/${scp[2].replace(/^\/+/, "")}` : value);
  if (!["https:", "http:", "ssh:", "git:"].includes(url.protocol) || !url.hostname) {
    throw new Error("Expected an HTTPS or SSH Git remote or pull request URL.");
  }

  // An SSH port identifies the Git transport. glab uses the configured API port.
  const http = url.protocol === "https:" || url.protocol === "http:";
  const inputHost = (http ? url.host : url.hostname).toLowerCase();
  const host = inputHost === "altssh.gitlab.com" ? "gitlab.com"
    : inputHost === "ssh.github.com" ? "github.com"
    : inputHost;
  const provider = providerFor(host);
  const segments = url.pathname.replace(/^\/+|\/+$/g, "").split("/");
  const mrSeparator = segments.indexOf("-");
  const prLink = http && provider === "github" && segments[2] === "pull";
  const mrLink = http && provider === "gitlab" && mrSeparator >= 2 && segments[mrSeparator + 1] === "merge_requests";
  if (prLink || mrLink) {
    const number = positiveInteger(segments[prLink ? 3 : mrSeparator + 2]);
    if (number === undefined) throw new Error("Expected a positive PR or MR number in the URL.");
    const project = cleanProject(segments.slice(0, prLink ? 2 : mrSeparator));
    return { provider, host, project, number };
  }

  const repository = segments.at(-1)?.replace(/\.git$/i, "");
  const project = cleanProject([...segments.slice(0, -1), repository ?? ""]);
  if (provider === "github" && segments.length !== 2) {
    throw new Error("Expected a GitHub owner/repository remote or a PR link.");
  }
  if (provider === "gitlab" && segments.includes("-")) {
    throw new Error("Expected a GitLab namespace/project remote or an MR link.");
  }
  return { provider, host, project };
}

function validatedTarget(value: string): Target {
  try {
    return parseTarget(value);
  } catch (error) {
    // Native URL and decoding errors can echo the original URL, including userinfo.
    if (error instanceof TypeError || error instanceof URIError) {
      throw new Error("Invalid Git remote or PR/MR URL.");
    }
    throw error;
  }
}

function selectedRemote(remotes: string[]): string {
  const branch = git(["symbolic-ref", "--quiet", "--short", "HEAD"]);
  const tracked = branch && git(["config", "--get", `branch.${branch}.remote`]);
  if (tracked && tracked !== "." && remotes.includes(tracked)) return tracked;
  if (remotes.includes("origin")) return "origin";
  if (remotes.length === 1) return remotes[0];
  throw new Error(remotes.length
    ? "Multiple remotes match. Pass --remote or the intended PR/MR URL with --url."
    : "No Git remote found. Pass the intended PR/MR URL with --url.");
}

export function resolveTarget(selection: Selection): Target {
  if (selection.url !== undefined && selection.remote !== undefined) {
    throw new Error("Choose either --remote or --url.");
  }
  if (selection.url !== undefined) return validatedTarget(selection.url);

  const remotes = (git(["remote"]) ?? "").split("\n").filter(Boolean);
  const remote = selection.remote ?? selectedRemote(remotes);
  if (!remotes.includes(remote)) throw new Error("The selected Git remote does not exist.");
  const url = git(["remote", "get-url", "--", remote]);
  if (!url) throw new Error("The selected Git remote has no fetch URL.");
  return { ...validatedTarget(url), remote };
}

export function sourceBranch(target: Target): string {
  const branch = git(["symbolic-ref", "--quiet", "--short", "HEAD"]);
  if (!branch) throw new Error("Cannot infer the source branch. Pass --mr or the merge request URL.");
  const tracked = git(["config", "--get", `branch.${branch}.remote`]);
  const upstream = git(["config", "--get", `branch.${branch}.merge`]);
  if (tracked && tracked === target.remote && upstream?.startsWith("refs/heads/")) {
    return upstream.slice("refs/heads/".length);
  }
  return branch;
}
