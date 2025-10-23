rm -rf .wrangler
rm -rf drizzle
pnpm run db:generate
pnpm run db:migrate