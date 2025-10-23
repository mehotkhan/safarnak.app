import { sql } from 'drizzle-orm';

export default {
  '0000_slippery_mongu': sql`
    CREATE TABLE \`users\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`name\` text NOT NULL,
      \`email\` text NOT NULL
    );
    --> statement-breakpoint
    CREATE UNIQUE INDEX \`users_email_unique\` ON \`users\` (\`email\`);
  `,
};
