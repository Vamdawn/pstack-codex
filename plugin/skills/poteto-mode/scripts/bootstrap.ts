import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";

const scriptsDirectory = import.meta.dir;
const packageFile = join(scriptsDirectory, "package.json");
const lockFile = join(scriptsDirectory, "bun.lock");

export function ensureDependenciesInstalled(): void {
  const packageKey = createHash("sha256")
    .update(readFileSync(packageFile))
    .update("\0")
    .update(readFileSync(lockFile))
    .digest("hex");
  const uid = process.getuid?.();
  const cacheDirectory = join(tmpdir(), `pstack-codex-watch-pr-${uid ?? "local"}`);
  const dependencyDirectory = join(cacheDirectory, packageKey);
  const nodeModules = join(dependencyDirectory, "node_modules");
  const commanderPackage = join(nodeModules, "commander", "package.json");

  // Codex can read an installed plugin without allowing writes beside it.
  mkdirSync(cacheDirectory, { recursive: true, mode: 0o700 });
  const cacheStat = lstatSync(cacheDirectory);
  if (!cacheStat.isDirectory() || (uid !== undefined && (cacheStat.uid !== uid || (cacheStat.mode & 0o077) !== 0))) {
    throw new Error(`Watcher's dependency cache must be a private directory: ${cacheDirectory}`);
  }
  if (!existsSync(commanderPackage)) {
    const attempt = mkdtempSync(join(cacheDirectory, "install-"));
    try {
      copyFileSync(packageFile, join(attempt, "package.json"));
      copyFileSync(lockFile, join(attempt, "bun.lock"));
      const result = Bun.spawnSync(
        [process.execPath, "install", "--frozen-lockfile", "--production", "--ignore-scripts", "--cache-dir", join(cacheDirectory, "downloads")],
        { cwd: attempt },
      );
      if (result.exitCode !== 0) {
        process.stderr.write(result.stderr);
        throw new Error(`Bun could not install watch-pr dependencies (exit ${result.exitCode})`);
      }
      try {
        renameSync(attempt, dependencyDirectory);
      } catch (error) {
        // A concurrent invocation may already have published this lockfile's install.
        if (!existsSync(commanderPackage)) throw error;
      }
    } finally {
      rmSync(attempt, { recursive: true, force: true });
    }
  }

  if (!existsSync(commanderPackage)) {
    throw new Error("Bun did not install the watch-pr commander dependency");
  }
  if (process.env.PSTACK_CODEX_WATCH_PR_MODULES === nodeModules) return;

  const inheritedModulePaths = process.env.NODE_PATH;
  const result = Bun.spawnSync([process.execPath, ...process.argv.slice(1)], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PSTACK_CODEX_WATCH_PR_MODULES: nodeModules,
      NODE_PATH: inheritedModulePaths
        ? [nodeModules, inheritedModulePaths].join(delimiter)
        : nodeModules,
    },
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  if (result.error) throw result.error;
  process.exit(result.exitCode ?? 1);
}
