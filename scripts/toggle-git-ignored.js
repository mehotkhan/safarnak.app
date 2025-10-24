#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SETTINGS_FILE = path.join(__dirname, '..', '.vscode', 'settings.json');
const BACKUP_FILE = path.join(
  __dirname,
  '..',
  '.vscode',
  'settings.backup.json'
);

// Git-ignored patterns to hide/show
const GIT_IGNORED_PATTERNS = {
  '**/node_modules': true,
  '**/.expo': true,
  '**/.wrangler': true,
  '**/android/build': true,
  '**/ios/build': true,
  '**/drizzle/migrations': true,
  '**/.git': true,
  '**/dist': true,
  '**/build': true,
  '**/.next': true,
  '**/coverage': true,
  '**/.nyc_output': true,
  '**/client/db.db*': true,
  '**/worker/.wrangler': true,
  '**/yarn-error.log': true,
  '**/npm-debug.log*': true,
  '**/.DS_Store': true,
  '**/Thumbs.db': true,
};

function loadSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading settings:', error.message);
  }
  return {};
}

function saveSettings(settings) {
  try {
    // Ensure .vscode directory exists
    const vscodeDir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(vscodeDir)) {
      fs.mkdirSync(vscodeDir, { recursive: true });
    }

    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    console.log('✅ Settings updated successfully');
  } catch (error) {
    console.error('Error saving settings:', error.message);
  }
}

function backupSettings(settings) {
  try {
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(settings, null, 2));
    console.log('📋 Settings backed up');
  } catch (error) {
    console.error('Error backing up settings:', error.message);
  }
}

function toggleGitIgnoredFiles() {
  const settings = loadSettings();

  // Check if git-ignored files are currently hidden
  const filesExclude = settings['files.exclude'] || {};
  const isCurrentlyHidden = Object.keys(GIT_IGNORED_PATTERNS).some(
    pattern => filesExclude[pattern] === true
  );

  if (isCurrentlyHidden) {
    // Show git-ignored files
    console.log('👁️  Showing git-ignored files...');

    // Remove git-ignored patterns from exclusions
    const newFilesExclude = { ...filesExclude };
    const newSearchExclude = { ...(settings['search.exclude'] || {}) };
    const newWatcherExclude = { ...(settings['files.watcherExclude'] || {}) };

    Object.keys(GIT_IGNORED_PATTERNS).forEach(pattern => {
      delete newFilesExclude[pattern];
      delete newSearchExclude[pattern];
      delete newWatcherExclude[pattern];
    });

    settings['files.exclude'] = newFilesExclude;
    settings['search.exclude'] = newSearchExclude;
    settings['files.watcherExclude'] = newWatcherExclude;
  } else {
    // Hide git-ignored files
    console.log('🙈 Hiding git-ignored files...');

    // Add git-ignored patterns to exclusions
    settings['files.exclude'] = {
      ...(settings['files.exclude'] || {}),
      ...GIT_IGNORED_PATTERNS,
    };
    settings['search.exclude'] = {
      ...(settings['search.exclude'] || {}),
      ...GIT_IGNORED_PATTERNS,
    };
    settings['files.watcherExclude'] = {
      ...(settings['files.watcherExclude'] || {}),
      ...GIT_IGNORED_PATTERNS,
    };
  }

  // Backup current settings before changing
  backupSettings(settings);

  // Save new settings
  saveSettings(settings);

  console.log(
    `\n${isCurrentlyHidden ? '👁️  Git-ignored files are now VISIBLE' : '🙈 Git-ignored files are now HIDDEN'}`
  );
  console.log('🔄 Please reload Cursor/VS Code window to see changes');
}

function showStatus() {
  const settings = loadSettings();
  const filesExclude = settings['files.exclude'] || {};

  const isHidden = Object.keys(GIT_IGNORED_PATTERNS).some(
    pattern => filesExclude[pattern] === true
  );

  console.log(`\n📊 Current Status:`);
  console.log(
    `Git-ignored files are: ${isHidden ? '🙈 HIDDEN' : '👁️  VISIBLE'}`
  );

  if (isHidden) {
    console.log('\nHidden patterns:');
    Object.keys(GIT_IGNORED_PATTERNS).forEach(pattern => {
      if (filesExclude[pattern]) {
        console.log(`  - ${pattern}`);
      }
    });
  }
}

function showHelp() {
  console.log(`
🎯 Git-Ignored Files Toggle Script

Usage:
  node scripts/toggle-git-ignored.js [command]

Commands:
  toggle    Toggle visibility of git-ignored files (default)
  show      Show git-ignored files
  hide      Hide git-ignored files
  status    Show current status
  help      Show this help message

Examples:
  node scripts/toggle-git-ignored.js toggle
  node scripts/toggle-git-ignored.js status
  node scripts/toggle-git-ignored.js hide
`);
}

// Main execution
const command = process.argv[2] || 'toggle';

switch (command.toLowerCase()) {
  case 'toggle':
    toggleGitIgnoredFiles();
    break;
  case 'show':
    console.log('👁️  Showing git-ignored files...');
    const settings = loadSettings();
    const filesExclude = { ...(settings['files.exclude'] || {}) };
    const searchExclude = { ...(settings['search.exclude'] || {}) };
    const watcherExclude = { ...(settings['files.watcherExclude'] || {}) };

    Object.keys(GIT_IGNORED_PATTERNS).forEach(pattern => {
      delete filesExclude[pattern];
      delete searchExclude[pattern];
      delete watcherExclude[pattern];
    });

    settings['files.exclude'] = filesExclude;
    settings['search.exclude'] = searchExclude;
    settings['files.watcherExclude'] = watcherExclude;

    backupSettings(settings);
    saveSettings(settings);
    console.log('✅ Git-ignored files are now VISIBLE');
    break;
  case 'hide':
    console.log('🙈 Hiding git-ignored files...');
    const hideSettings = loadSettings();
    hideSettings['files.exclude'] = {
      ...(hideSettings['files.exclude'] || {}),
      ...GIT_IGNORED_PATTERNS,
    };
    hideSettings['search.exclude'] = {
      ...(hideSettings['search.exclude'] || {}),
      ...GIT_IGNORED_PATTERNS,
    };
    hideSettings['files.watcherExclude'] = {
      ...(hideSettings['files.watcherExclude'] || {}),
      ...GIT_IGNORED_PATTERNS,
    };

    backupSettings(hideSettings);
    saveSettings(hideSettings);
    console.log('✅ Git-ignored files are now HIDDEN');
    break;
  case 'status':
    showStatus();
    break;
  case 'help':
    showHelp();
    break;
  default:
    console.log(`❌ Unknown command: ${command}`);
    showHelp();
}
