#!/usr/bin/env node

/**
 * AI Commit Message Generator for Safarnak
 * Analyzes git changes and generates conventional commit messages
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Conventional commit types with descriptions
const COMMIT_TYPES = {
  feat: {
    description: 'A new feature',
    emoji: '✨',
    examples: ['Add user authentication', 'Implement dark mode', 'Add Persian language support']
  },
  fix: {
    description: 'A bug fix',
    emoji: '🐛',
    examples: ['Fix login issue', 'Resolve offline sync bug', 'Fix RTL layout']
  },
  docs: {
    description: 'Documentation only changes',
    emoji: '📚',
    examples: ['Update README', 'Add API documentation', 'Fix typos in comments']
  },
  style: {
    description: 'Changes that do not affect the meaning of the code',
    emoji: '🎨',
    examples: ['Format code', 'Fix linting issues', 'Update code style']
  },
  refactor: {
    description: 'A code change that neither fixes a bug nor adds a feature',
    emoji: '♻️',
    examples: ['Refactor API structure', 'Reorganize components', 'Simplify code']
  },
  perf: {
    description: 'A code change that improves performance',
    emoji: '⚡',
    examples: ['Optimize database queries', 'Improve rendering performance', 'Reduce bundle size']
  },
  test: {
    description: 'Adding missing tests or correcting existing tests',
    emoji: '🧪',
    examples: ['Add unit tests', 'Fix test cases', 'Add integration tests']
  },
  build: {
    description: 'Changes that affect the build system or external dependencies',
    emoji: '🏗️',
    examples: ['Update dependencies', 'Fix build configuration', 'Add build scripts']
  },
  ci: {
    description: 'Changes to our CI configuration files and scripts',
    emoji: '🔧',
    examples: ['Update GitHub Actions', 'Fix CI pipeline', 'Add automated tests']
  },
  chore: {
    description: 'Other changes that don\'t modify src or test files',
    emoji: '🔨',
    examples: ['Update package.json', 'Clean up files', 'Update configuration']
  },
  revert: {
    description: 'Reverts a previous commit',
    emoji: '⏪',
    examples: ['Revert previous change', 'Undo feature', 'Rollback version']
  }
};

// Safarnak-specific scopes
const SCOPES = [
  'auth', 'api', 'worker', 'client', 'graphql', 'database', 'ui', 'i18n', 
  'theme', 'maps', 'offline', 'redux', 'expo', 'android', 'ios', 'web',
  'typescript', 'eslint', 'prettier', 'drizzle', 'apollo', 'cloudflare'
];

function getGitChanges() {
  try {
    // Get staged files
    const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(file => file.length > 0);
    
    // Get modified files
    const modifiedFiles = execSync('git diff --name-only', { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(file => file.length > 0);
    
    return { stagedFiles, modifiedFiles };
  } catch (error) {
    console.error('❌ Error getting git changes:', error.message);
    return { stagedFiles: [], modifiedFiles: [] };
  }
}

function analyzeChanges(files) {
  const analysis = {
    type: 'chore',
    scope: null,
    description: '',
    files: {
      added: [],
      modified: [],
      deleted: []
    }
  };
  
  files.forEach(file => {
    const filePath = path.parse(file);
    const extension = filePath.ext;
    const dir = filePath.dir.split('/')[0];
    
    // Categorize files
    if (file.includes('test') || file.includes('spec')) {
      analysis.type = 'test';
    } else if (file.includes('docs') || file.includes('README') || file.includes('.md')) {
      analysis.type = 'docs';
    } else if (file.includes('package.json') || file.includes('yarn.lock') || file.includes('node_modules')) {
      analysis.type = 'build';
    } else if (file.includes('.github') || file.includes('ci') || file.includes('workflow')) {
      analysis.type = 'ci';
    } else if (file.includes('worker') || file.includes('resolver')) {
      analysis.type = 'feat';
      analysis.scope = 'worker';
    } else if (file.includes('api') || file.includes('client')) {
      analysis.type = 'feat';
      analysis.scope = 'api';
    } else if (file.includes('graphql')) {
      analysis.type = 'feat';
      analysis.scope = 'graphql';
    } else if (file.includes('drizzle') || file.includes('schema')) {
      analysis.type = 'feat';
      analysis.scope = 'database';
    } else if (file.includes('components') || file.includes('ui')) {
      analysis.type = 'feat';
      analysis.scope = 'ui';
    } else if (file.includes('locales') || file.includes('i18n')) {
      analysis.type = 'feat';
      analysis.scope = 'i18n';
    } else if (file.includes('store') || file.includes('redux')) {
      analysis.type = 'feat';
      analysis.scope = 'redux';
    } else if (file.includes('app') || file.includes('expo')) {
      analysis.type = 'feat';
      analysis.scope = 'expo';
    }
    
    // Determine file operation
    if (file.includes('new') || file.includes('add')) {
      analysis.files.added.push(file);
    } else if (file.includes('delete') || file.includes('remove')) {
      analysis.files.deleted.push(file);
    } else {
      analysis.files.modified.push(file);
    }
  });
  
  return analysis;
}

function generateDescription(analysis) {
  const { type, scope, files } = analysis;
  
  let description = '';
  
  if (files.added.length > 0) {
    description += `Add ${files.added.length > 1 ? 'new features' : 'new feature'}`;
  } else if (files.modified.length > 0) {
    description += `Update ${files.modified.length > 1 ? 'components' : 'component'}`;
  } else if (files.deleted.length > 0) {
    description += `Remove ${files.deleted.length > 1 ? 'components' : 'component'}`;
  } else {
    description += 'Update code';
  }
  
  if (scope) {
    description += ` in ${scope}`;
  }
  
  return description.toLowerCase();
}

function generateCommitMessage(analysis) {
  const { type, scope } = analysis;
  const description = generateDescription(analysis);
  const typeInfo = COMMIT_TYPES[type];
  
  let message = `${type}`;
  
  if (scope) {
    message += `(${scope})`;
  }
  
  message += `: ${description}`;
  
  return {
    message,
    type,
    scope,
    description,
    emoji: typeInfo.emoji
  };
}

function main() {
  console.log('🤖 AI Commit Message Generator for Safarnak\n');
  
  const { stagedFiles, modifiedFiles } = getGitChanges();
  
  if (stagedFiles.length === 0 && modifiedFiles.length === 0) {
    console.log('❌ No changes detected. Please stage some files first.');
    process.exit(1);
  }
  
  const filesToAnalyze = stagedFiles.length > 0 ? stagedFiles : modifiedFiles;
  console.log(`📁 Analyzing ${filesToAnalyze.length} file(s):`);
  filesToAnalyze.forEach(file => console.log(`   ${file}`));
  console.log('');
  
  const analysis = analyzeChanges(filesToAnalyze);
  const commitInfo = generateCommitMessage(analysis);
  
  console.log('🎯 Generated Commit Message:');
  console.log(`   ${commitInfo.emoji} ${commitInfo.message}`);
  console.log('');
  console.log('📋 Analysis:');
  console.log(`   Type: ${commitInfo.type} (${COMMIT_TYPES[commitInfo.type].description})`);
  if (commitInfo.scope) {
    console.log(`   Scope: ${commitInfo.scope}`);
  }
  console.log(`   Description: ${commitInfo.description}`);
  console.log('');
  
  // Suggest additional options
  console.log('💡 Suggestions:');
  console.log('   • Use "yarn commit" for interactive commit');
  console.log('   • Use "yarn commit:check" to validate commit message');
  console.log('   • Use "yarn version:patch" for patch release');
  console.log('   • Use "yarn version:minor" for minor release');
  console.log('   • Use "yarn version:major" for major release');
  
  return commitInfo.message;
}

if (require.main === module) {
  main();
}

module.exports = { generateCommitMessage, analyzeChanges, getGitChanges };
