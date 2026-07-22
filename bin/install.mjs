#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_SRC = join(__dirname, "..", "skill", "daily-knowledge.md");
const home = homedir();

const AGENT_TARGETS = [
  { name: "Claude Code", path: join(home, ".claude", "commands", "daily-knowledge.md") },
  { name: "QoderCLI", path: join(home, ".qoder-cn", "skills", "daily-knowledge.md") },
  { name: "Codex", path: join(home, ".codex", "instructions", "daily-knowledge.md") },
  { name: "pi", path: join(home, ".pi", "skills", "daily-knowledge.md") },
  { name: "Hermes", path: join(home, ".hermes", "skills", "daily-knowledge.md") },
  { name: "OpenCode", path: join(home, ".opencode", "skills", "daily-knowledge.md") },
];

const arg = process.argv[2];

if (arg === "--list") {
  console.log("Available agent targets:\n");
  for (const t of AGENT_TARGETS) {
    const status = existsSync(t.path) ? "installed" : "not installed";
    console.log(`  ${t.name.padEnd(12)} ${t.path}  [${status}]`);
  }
  process.exit(0);
}

if (arg === "--all") {
  for (const t of AGENT_TARGETS) {
    install(t);
  }
  process.exit(0);
}

if (arg && arg !== "--help") {
  const target = AGENT_TARGETS.find(
    (t) => t.name.toLowerCase() === arg.toLowerCase()
  );
  if (!target) {
    console.error(`Unknown agent: ${arg}`);
    console.error(`Available: ${AGENT_TARGETS.map((t) => t.name).join(", ")}`);
    process.exit(1);
  }
  install(target);
  process.exit(0);
}

console.log(`
daily-knowledge-skill installer

Usage:
  npx github:cyancity/daily-knowledge-skill <agent>    Install for one agent
  npx github:cyancity/daily-knowledge-skill --all      Install for all agents
  npx github:cyancity/daily-knowledge-skill --list     Show status

Agents: ${AGENT_TARGETS.map((t) => t.name).join(", ")}
`);

function install(target) {
  mkdirSync(dirname(target.path), { recursive: true });
  cpSync(SKILL_SRC, target.path);
  console.log(`  installed: ${target.name} -> ${target.path}`);
}
