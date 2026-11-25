import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const read = (file) => readFileSync(file, "utf8");
const readJson = (file) => JSON.parse(read(file));
const marketplace = readJson(path.join(repoRoot, ".agents/plugins/marketplace.json"));

assert.equal(marketplace.plugins.length, 1);
const entry = marketplace.plugins[0];
assert.equal(marketplace.name, "pstack-codex");
assert.equal(entry.name, "pstack-codex");
assert.equal(entry.source.source, "local");
assert.equal(entry.source.path, "./plugin");

const pluginRoot = path.resolve(repoRoot, entry.source.path);
assert.equal(existsSync(path.join(pluginRoot, ".git")), false);
assert.equal(read(path.join(pluginRoot, "LICENSE")), read(path.join(repoRoot, "LICENSE")));

const manifest = readJson(path.join(pluginRoot, ".codex-plugin/plugin.json"));
assert.equal(manifest.name, entry.name);
assert.match(manifest.version, /^\d+\.\d+\.\d+-codex\.(0|[1-9]\d*)$/);
assert.equal(manifest.hooks, undefined);
assert.equal(existsSync(path.join(pluginRoot, "hooks", "hooks.json")), false);
assert.ok(manifest.interface.shortDescription.length <= 30);
assert.ok(
  statSync(path.join(pluginRoot, manifest.interface.logo)).isFile(),
  "Missing icon file",
);

const skillsDir = path.resolve(pluginRoot, manifest.skills);
assert.equal(skillsDir, path.join(pluginRoot, "skills"));
const skills = readdirSync(skillsDir, { withFileTypes: true })
  .filter((item) => item.isDirectory())
  .map((item) => item.name)
  .sort();
assert.ok(skills.includes("poteto-mode") && skills.includes("reframe"));
assert.ok(!skills.includes("make-bot-ui"));

for (const skill of skills) {
  const folder = path.join(skillsDir, skill);
  const frontmatter = read(path.join(folder, "SKILL.md")).match(
    /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/,
  )?.[1];
  assert.ok(frontmatter, `${skill}: missing frontmatter`);
  assert.ok(
    frontmatter.split(/\r?\n/).includes(`name: ${skill}`),
    `${skill}: name must match its folder`,
  );
  assert.match(frontmatter, /^description:\s*\S/m, `${skill}: missing description`);
  assert.doesNotMatch(
    frontmatter,
    /^(?:disable-model-invocation|paths|mode|reminder|icon|color):/m,
    `${skill}: Cursor-only frontmatter`,
  );
  assert.match(
    read(path.join(folder, "agents/openai.yaml")),
    /^policy:\r?\n\s+allow_implicit_invocation: false\s*$/,
    `${skill}: invocation must be explicit`,
  );
}

const compatibility = read(path.join(pluginRoot, "docs/compatibility.md"));
const audited = Array.from(
  compatibility.matchAll(/^\| `([a-z0-9-]+)` \|/gm),
  (match) => match[1],
).sort();
assert.deepEqual(audited, [...skills, "make-bot-ui"].sort(), "Incomplete skill audit");

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((item) => {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) return item.name === "node_modules" ? [] : markdownFiles(file);
    return file.endsWith(".md") ? [file] : [];
  });
}

function checkLinks(file, packageBoundary) {
  const doc = read(file).replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, "");
  for (const match of doc.matchAll(/\]\(([^\s)]+)\)/g)) {
    const target = match[1];
    if (/^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(target)) continue;
    const localPath = decodeURIComponent(target.split(/[?#]/, 1)[0]);
    const resolved = path.resolve(path.dirname(file), localPath);
    assert.ok(
      existsSync(resolved),
      `${path.relative(repoRoot, file)}: broken relative link ${target}`,
    );
    assert.ok(
      resolved === packageBoundary || resolved.startsWith(`${packageBoundary}${path.sep}`),
      `${path.relative(repoRoot, file)}: link leaves its package ${target}`,
    );
  }
}

for (const directory of [skillsDir, path.join(pluginRoot, "docs")]) {
  for (const file of markdownFiles(directory)) checkLinks(file, pluginRoot);
}
checkLinks(path.join(repoRoot, "README.md"), repoRoot);

console.log(`Package checks passed for ${skills.length} skills and ${audited.length} upstream dispositions.`);
