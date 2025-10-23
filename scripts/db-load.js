#!/usr/bin/env node

const { spawn } = require('child_process');

// Function to run a command
function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { 
      stdio: 'inherit',
      shell: true 
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

async function main() {
  try {
    console.log('🔄 Starting database load process...');
    
    // Generate worker migrations
    console.log('🔧 Generating worker migrations...');
    await runCommand('yarn', ['workspace', 'safarnak-worker', 'db:generate']);
    
    // Generate client migrations
    console.log('🔧 Generating client migrations...');
    console.log('⚠️  When prompted, select: ~ email › username rename column');
    await runCommand('yarn', ['workspace', 'safarnak', 'db:generate']);
    
    // Run migrations
    console.log('🚀 Running migrations...');
    await runCommand('yarn', ['db:migrate']);
    
    console.log('✅ Database load completed successfully!');
  } catch (error) {
    console.error('❌ Error during database load:', error.message);
    process.exit(1);
  }
}

main();
