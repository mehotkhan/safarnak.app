#!/usr/bin/env node

/**
 * Safarnak Version Manager
 * Manages semantic versioning, changelog generation, and release automation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Current version info
const CURRENT_VERSION = '0.5.0';
const TARGET_STABLE_VERSION = '1.0.0';

// Version progression stages
const VERSION_STAGES = {
  '0.5.0': { stage: 'alpha', description: 'Initial development version' },
  '0.6.0': { stage: 'alpha', description: 'Core features implementation' },
  '0.7.0': { stage: 'alpha', description: 'UI/UX improvements' },
  '0.8.0': { stage: 'beta', description: 'Feature completion' },
  '0.9.0': { stage: 'beta', description: 'Testing and bug fixes' },
  '1.0.0': { stage: 'stable', description: 'First stable release' },
};

function getCurrentVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return packageJson.version;
  } catch (error) {
    console.error('❌ Error reading package.json:', error.message);
    return CURRENT_VERSION;
  }
}

function getNextVersion(currentVersion, type = 'patch') {
  const [major, minor, patch] = currentVersion.split('.').map(Number);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    case 'prerelease':
      return `${major}.${minor}.${patch + 1}-alpha.1`;
    default:
      return `${major}.${minor}.${patch + 1}`;
  }
}

function getVersionStage(version) {
  const [major, minor] = version.split('.').map(Number);

  if (major === 0) {
    if (minor < 8) return 'alpha';
    if (minor < 9) return 'beta';
    return 'beta';
  }

  return 'stable';
}

function generateChangelogEntry(version, type, changes = []) {
  const stage = getVersionStage(version);
  const stageInfo = VERSION_STAGES[version] || {
    stage,
    description: 'Version update',
  };

  const date = new Date().toISOString().split('T')[0];
  const emoji =
    {
      feat: '✨',
      fix: '🐛',
      docs: '📚',
      style: '🎨',
      refactor: '♻️',
      perf: '⚡',
      test: '🧪',
      build: '🏗️',
      ci: '🔧',
      chore: '🔨',
    }[type] || '📝';

  let entry = `## [${version}] - ${date}\n\n`;
  entry += `### ${emoji} ${stageInfo.description}\n\n`;

  if (changes.length > 0) {
    entry += '#### Changes\n';
    changes.forEach(change => {
      entry += `- ${change}\n`;
    });
    entry += '\n';
  }

  entry += `#### Version Info\n`;
  entry += `- **Stage**: ${stageInfo.stage}\n`;
  entry += `- **Type**: ${type}\n`;
  entry += `- **APK Version**: ${version}\n`;
  entry += `- **Worker Version**: ${version}\n`;
  entry += `- **Target Stable**: ${TARGET_STABLE_VERSION}\n\n`;

  return entry;
}

function updateAppConfig(version) {
  try {
    const appConfigPath = 'app.config.js';
    let content = fs.readFileSync(appConfigPath, 'utf8');

    // Update version in app.config.js
    const versionRegex = /version:\s*["']([^"']+)["']/;
    if (versionRegex.test(content)) {
      content = content.replace(versionRegex, `version: "${version}"`);
    } else {
      // Add version if not found
      const nameRegex = /name:\s*["']([^"']+)["']/;
      const nameMatch = content.match(nameRegex);
      if (nameMatch) {
        content = content.replace(
          nameMatch[0],
          `${nameMatch[0]},\n  version: "${version}"`
        );
      }
    }

    fs.writeFileSync(appConfigPath, content, 'utf8');
    console.log(`✅ Updated app.config.js version to ${version}`);
  } catch (error) {
    console.error('❌ Error updating app.config.js:', error.message);
  }
}

function updatePackageJson(version) {
  try {
    const packageJsonPath = 'package.json';
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.version = version;
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n'
    );
    console.log(`✅ Updated package.json version to ${version}`);
  } catch (error) {
    console.error('❌ Error updating package.json:', error.message);
  }
}

function runPreReleaseChecks() {
  console.log('🔍 Running pre-release checks...\n');

  const checks = [
    { name: 'TypeScript Check', command: 'npx tsc --noEmit' },
    { name: 'ESLint Check', command: 'yarn lint' },
    { name: 'Prettier Check', command: 'yarn format --check' },
    { name: 'GraphQL Codegen', command: 'yarn codegen' },
    { name: 'Database Migration', command: 'yarn db:migrate' },
  ];

  for (const check of checks) {
    try {
      console.log(`⏳ Running ${check.name}...`);
      execSync(check.command, { stdio: 'pipe' });
      console.log(`✅ ${check.name} passed\n`);
    } catch (error) {
      console.error(`❌ ${check.name} failed:`, error.message);
      console.error('Please fix the issues before releasing.\n');
      process.exit(1);
    }
  }
}

function createRelease(version, type) {
  console.log(`🚀 Creating release ${version} (${type})\n`);

  // Run pre-release checks
  runPreReleaseChecks();

  // Update version files
  updatePackageJson(version);
  updateAppConfig(version);

  // Generate changelog entry
  const changelogEntry = generateChangelogEntry(version, type);

  // Append to CHANGELOG.md
  try {
    const changelogPath = 'CHANGELOG.md';
    let changelog = fs.readFileSync(changelogPath, 'utf8');

    // Insert new entry after the first heading
    const lines = changelog.split('\n');
    const insertIndex = lines.findIndex(line =>
      line.startsWith('## [Unreleased]')
    );
    if (insertIndex !== -1) {
      lines.splice(insertIndex + 1, 0, '', changelogEntry);
    } else {
      lines.splice(1, 0, '', changelogEntry);
    }

    fs.writeFileSync(changelogPath, lines.join('\n'));
    console.log(`✅ Updated CHANGELOG.md with ${version}`);
  } catch (error) {
    console.error('❌ Error updating CHANGELOG.md:', error.message);
  }

  console.log(`\n🎉 Release ${version} prepared successfully!`);
  console.log(`📱 APK version: ${version}`);
  console.log(`🌐 Worker version: ${version}`);
  console.log(`📋 Stage: ${getVersionStage(version)}`);
  console.log(`🎯 Target stable: ${TARGET_STABLE_VERSION}`);

  return version;
}

function showVersionInfo() {
  const currentVersion = getCurrentVersion();
  const stage = getVersionStage(currentVersion);
  const stageInfo = VERSION_STAGES[currentVersion] || {
    stage,
    description: 'Version update',
  };

  console.log('📋 Safarnak Version Information\n');
  console.log(`Current Version: ${currentVersion}`);
  console.log(`Stage: ${stageInfo.stage}`);
  console.log(`Description: ${stageInfo.description}`);
  console.log(`Target Stable: ${TARGET_STABLE_VERSION}`);
  console.log(`Progress: ${getProgressToStable(currentVersion)}%\n`);

  console.log('🔄 Available Commands:');
  console.log('  yarn version:patch     - Patch release (0.5.0 → 0.5.1)');
  console.log('  yarn version:minor     - Minor release (0.5.0 → 0.6.0)');
  console.log('  yarn version:major     - Major release (0.5.0 → 1.0.0)');
  console.log('  yarn version:prerelease - Prerelease (0.5.0 → 0.5.1-alpha.1)');
  console.log('  yarn changelog         - Generate changelog');
  console.log('  yarn commit            - Interactive commit');
}

function getProgressToStable(version) {
  const [major, minor] = version.split('.').map(Number);
  if (major >= 1) return 100;

  const totalSteps = 5; // 0.5 → 0.6 → 0.7 → 0.8 → 0.9 → 1.0
  const currentStep = minor - 5;
  return Math.max(0, Math.min(100, (currentStep / totalSteps) * 100));
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'info':
      showVersionInfo();
      break;
    case 'patch':
      createRelease(getNextVersion(getCurrentVersion(), 'patch'), 'patch');
      break;
    case 'minor':
      createRelease(getNextVersion(getCurrentVersion(), 'minor'), 'minor');
      break;
    case 'major':
      createRelease(getNextVersion(getCurrentVersion(), 'major'), 'major');
      break;
    case 'prerelease':
      createRelease(
        getNextVersion(getCurrentVersion(), 'prerelease'),
        'prerelease'
      );
      break;
    default:
      console.log('🤖 Safarnak Version Manager\n');
      console.log('Usage: node scripts/version-manager.js <command>');
      console.log('\nCommands:');
      console.log('  info        - Show version information');
      console.log('  patch       - Create patch release');
      console.log('  minor       - Create minor release');
      console.log('  major       - Create major release');
      console.log('  prerelease  - Create prerelease');
      showVersionInfo();
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  getCurrentVersion,
  getNextVersion,
  createRelease,
  showVersionInfo,
};
