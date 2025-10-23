#!/usr/bin/env node

/**
 * Safarnak Database Management Script
 * Unified database operations for both worker and client schemas
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`${colors.cyan}${colors.bright}${msg}${colors.reset}`),
};

// Function to run a command
function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { 
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Database operations
const operations = {
  // Generate migrations for all schemas
  async generateAll() {
    log.header('🔄 Generating migrations for unified schema...');
    
    try {
      await runCommand('yarn', ['db:generate']);
      log.success('Unified schema migrations generated successfully!');
    } catch (error) {
      log.error(`Failed to generate migrations: ${error.message}`);
      throw error;
    }
  },

  // Generate migrations for worker only
  async generateWorker() {
    log.header('🔄 Generating worker migrations...');
    
    try {
      await runCommand('yarn', ['db:generate']);
      log.success('Worker migrations generated successfully!');
    } catch (error) {
      log.error(`Failed to generate worker migrations: ${error.message}`);
      throw error;
    }
  },

  // Generate migrations for client only
  async generateClient() {
    log.header('🔄 Generating client migrations...');
    
    try {
      await runCommand('yarn', ['db:generate']);
      log.success('Client migrations generated successfully!');
    } catch (error) {
      log.error(`Failed to generate client migrations: ${error.message}`);
      throw error;
    }
  },

  // Apply migrations to worker database
  async migrateWorker() {
    log.header('🚀 Applying worker migrations...');
    
    try {
      await runCommand('yarn', ['db:migrate']);
      log.success('Worker migrations applied successfully!');
    } catch (error) {
      log.error(`Failed to apply worker migrations: ${error.message}`);
      throw error;
    }
  },

  // Apply migrations to production worker database
  async migrateWorkerProd() {
    log.header('🚀 Applying worker migrations to production...');
    
    try {
      await runCommand('yarn', ['db:migrate:prod']);
      log.success('Production worker migrations applied successfully!');
    } catch (error) {
      log.error(`Failed to apply production worker migrations: ${error.message}`);
      throw error;
    }
  },

  // Open Drizzle Studio
  async openStudio(type = 'all') {
    log.header(`🎨 Opening Drizzle Studio...`);
    
    try {
      await runCommand('yarn', ['db:studio']);
    } catch (error) {
      log.error(`Failed to open Drizzle Studio: ${error.message}`);
      throw error;
    }
  },

  // Check database schema
  async checkSchema() {
    log.header('🔍 Checking database schema...');
    
    try {
      await runCommand('yarn', ['db:check']);
      log.success('Schema check completed!');
    } catch (error) {
      log.error(`Schema check failed: ${error.message}`);
      throw error;
    }
  },

  // Push schema changes
  async pushSchema() {
    log.header('📤 Pushing schema changes...');
    
    try {
      await runCommand('yarn', ['db:push']);
      log.success('Schema changes pushed successfully!');
    } catch (error) {
      log.error(`Failed to push schema changes: ${error.message}`);
      throw error;
    }
  },

  // Drop database
  async dropDatabase() {
    log.header('🗑️ Dropping database...');
    log.warning('This will permanently delete all data!');
    
    try {
      await runCommand('yarn', ['db:drop']);
      log.success('Database dropped successfully!');
    } catch (error) {
      log.error(`Failed to drop database: ${error.message}`);
      throw error;
    }
  },

  // Show help
  showHelp() {
    log.header('📚 Safarnak Database Management');
    console.log(`
Available commands:
  generate          Generate migrations for unified schema
  generate:worker   Generate migrations for worker (same as generate)
  generate:client   Generate migrations for client (same as generate)
  migrate           Apply migrations to worker database
  migrate:prod      Apply migrations to production worker database
  studio            Open Drizzle Studio for unified schema
  check             Check database schema
  push              Push schema changes
  drop              Drop database (DANGEROUS!)
  help              Show this help message

Examples:
  node db-manager.js generate
  node db-manager.js migrate
  node db-manager.js studio
    `);
  }
};

// Main function
async function main() {
  const command = process.argv[2] || 'help';
  
  try {
    switch (command) {
      case 'generate':
        await operations.generateAll();
        break;
      case 'generate:worker':
        await operations.generateWorker();
        break;
      case 'generate:client':
        await operations.generateClient();
        break;
      case 'migrate':
        await operations.migrateWorker();
        break;
      case 'migrate:prod':
        await operations.migrateWorkerProd();
        break;
      case 'studio':
        await operations.openStudio('all');
        break;
      case 'studio:worker':
        await operations.openStudio('worker');
        break;
      case 'studio:client':
        await operations.openStudio('client');
        break;
      case 'check':
        await operations.checkSchema();
        break;
      case 'push':
        await operations.pushSchema();
        break;
      case 'drop':
        await operations.dropDatabase();
        break;
      case 'help':
      case '--help':
      case '-h':
        operations.showHelp();
        break;
      default:
        log.error(`Unknown command: ${command}`);
        operations.showHelp();
        process.exit(1);
    }
  } catch (error) {
    log.error(`Operation failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = operations;
