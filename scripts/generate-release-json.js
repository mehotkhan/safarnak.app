#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getCurrentVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  return pkg.version;
}

function getLastTag() {
  try {
    const tag = execSync('git describe --tags --abbrev=0', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    // verify tag exists locally
    try {
      execSync(`git rev-parse -q --verify ${tag}^{commit}`, { stdio: 'ignore' });
      return tag;
    } catch {
      return '';
    }
  } catch {
    // No tags yet
    return '';
  }
}

function getMergedCommitsSince(ref) {
  const range = ref ? `${ref}..HEAD` : '';
  const base = `git log --pretty=format:%H|%s`;
  let out = '';
  try {
    out = execSync(range ? `${base} ${range}` : base, { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
  } catch {
    // Fallback: all commits
    out = execSync(base, { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
  }
  const lines = out.split('\n').filter(Boolean);
  return lines.map(line => {
    const [hash, subject] = line.split('|');
    return { hash: hash.slice(0, 7), subject };
  });
}

function groupByType(commits) {
  const groups = { feat: [], fix: [], docs: [], refactor: [], chore: [], build: [], ci: [], perf: [], style: [], test: [], other: [] };
  for (const c of commits) {
    const m = c.subject.match(/^(\w+)(\([^)]*\))?:\s*(.*)$/);
    const type = m ? m[1] : 'other';
    const desc = m ? m[3] : c.subject;
    (groups[type] || groups.other).push({ hash: c.hash, subject: desc });
  }
  return groups;
}

function main() {
  const version = getCurrentVersion();
  const lastTag = getLastTag();
  const commits = getMergedCommitsSince(lastTag);
  const grouped = groupByType(commits);

  const release = {
    version,
    since: lastTag || null,
    generatedAt: new Date().toISOString(),
    commits,
    grouped,
  };

  const outDir = path.join(process.cwd(), 'worker', 'releases');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'latest.json'), JSON.stringify(release, null, 2));
  fs.writeFileSync(path.join(outDir, `${version}.json`), JSON.stringify(release, null, 2));
  console.log(`✅ Generated release JSON (since ${lastTag || 'initial'}) with ${commits.length} commits`);
}

if (require.main === module) {
  main();
}

module.exports = { main };


