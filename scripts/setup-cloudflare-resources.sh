#!/bin/bash
# Safarnak Cloudflare Resources Setup Script
# This script creates all required Cloudflare resources for the worker

set -e  # Exit on error

echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                           ║"
echo "║         🌩️  Safarnak Cloudflare Resources Setup                          ║"
echo "║                                                                           ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found!"
    echo "Install it with: npm install -g wrangler"
    echo "Or use: npx wrangler <command>"
    exit 1
fi

echo "✓ Wrangler CLI found"
echo ""

# Check if logged in
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "❌ Not logged in to Cloudflare!"
    echo "Login with: wrangler login"
    exit 1
fi

echo "✓ Authenticated with Cloudflare"
echo ""

echo "════════════════════════════════════════════════════════════════════════════"
echo "📦 Creating Cloudflare Resources..."
echo "════════════════════════════════════════════════════════════════════════════"
echo ""

# 1. D1 Database
echo "1️⃣  D1 Database: my-d1-db"
echo "   Checking if database exists..."
if wrangler d1 list | grep -q "my-d1-db"; then
    echo "   ✓ D1 database already exists"
else
    echo "   Creating D1 database..."
    wrangler d1 create my-d1-db
    echo "   ✓ D1 database created"
    echo "   ⚠️  IMPORTANT: Update database_id in wrangler.jsonc with the ID shown above!"
fi
echo ""

# 2. KV Namespace
echo "2️⃣  KV Namespace"
echo "   Checking if KV namespace exists..."
if wrangler kv namespace list | grep -q "aaa95f080d984c5c854b08ff979a1643"; then
    echo "   ✓ KV namespace already exists (id: aaa95f080d984c5c854b08ff979a1643)"
else
    echo "   Creating KV namespace..."
    wrangler kv namespace create "KV"
    echo "   ✓ KV namespace created"
    echo "   ⚠️  IMPORTANT: Update 'id' in wrangler.jsonc kv_namespaces with the ID shown above!"
    echo ""
    echo "   Creating preview KV namespace..."
    wrangler kv namespace create "KV" --preview
    echo "   ✓ Preview KV namespace created"
    echo "   ⚠️  IMPORTANT: Update 'preview_id' in wrangler.jsonc kv_namespaces with the ID shown above!"
fi
echo ""

# 3. R2 Bucket
echo "3️⃣  R2 Bucket: safarnak-dev"
echo "   Checking if R2 bucket exists..."
if wrangler r2 bucket list | grep -q "safarnak-dev"; then
    echo "   ✓ R2 bucket already exists"
else
    echo "   Creating R2 bucket..."
    wrangler r2 bucket create safarnak-dev
    echo "   ✓ R2 bucket created"
fi
echo ""

# 4. Vectorize Index
echo "4️⃣  Vectorize Index: safarnak-embeddings"
echo "   Checking if Vectorize index exists..."
if wrangler vectorize list 2>/dev/null | grep -q "safarnak-embeddings"; then
    echo "   ✓ Vectorize index already exists"
else
    echo "   Creating Vectorize index..."
    # OpenAI text-embedding-3-small: 1536 dimensions, cosine similarity
    wrangler vectorize create safarnak-embeddings \
        --dimensions=1536 \
        --metric=cosine
    echo "   ✓ Vectorize index created (1536 dimensions, cosine similarity)"
fi
echo ""

# 5. Queue
echo "5️⃣  Queue: embed-queue"
echo "   Checking if queue exists..."
if wrangler queues list 2>/dev/null | grep -q "embed-queue"; then
    echo "   ✓ Queue already exists"
else
    echo "   Creating queue..."
    wrangler queues create embed-queue
    echo "   ✓ Queue created"
fi
echo ""

# 6. Apply D1 Migrations
echo "6️⃣  D1 Migrations"
echo "   Applying migrations to D1 database..."
if [ -d "migrations" ] && [ "$(ls -A migrations/*.sql 2>/dev/null)" ]; then
    wrangler d1 migrations apply my-d1-db --remote
    echo "   ✓ Migrations applied"
else
    echo "   ⚠️  No migrations found in migrations/ directory"
fi
echo ""

echo "════════════════════════════════════════════════════════════════════════════"
echo "✅ Resource Creation Complete!"
echo "════════════════════════════════════════════════════════════════════════════"
echo ""

echo "📝 Next Steps:"
echo ""
echo "1. Verify all resource IDs in wrangler.jsonc:"
echo "   • D1 database_id"
echo "   • KV namespace id and preview_id"
echo "   • R2 bucket_name"
echo "   • Vectorize index_name"
echo "   • Queue name"
echo ""
echo "2. Deploy Durable Objects & Workflows:"
echo "   $ wrangler deploy"
echo ""
echo "   This will deploy:"
echo "   • SubscriptionPool (Durable Object)"
echo "   • TrendingRollup (Durable Object)"
echo "   • TripCreationWorkflow"
echo "   • TripUpdateWorkflow"
echo ""
echo "3. Test your worker:"
echo "   $ wrangler dev"
echo ""
echo "4. Deploy to production:"
echo "   $ wrangler deploy --env production"
echo ""
echo "════════════════════════════════════════════════════════════════════════════"
echo "🔐 GitHub Actions Setup (Optional)"
echo "════════════════════════════════════════════════════════════════════════════"
echo ""
echo "To enable automatic worker deployment in CI/CD:"
echo ""
echo "1. Get your Cloudflare API Token:"
echo "   • Go to: https://dash.cloudflare.com/profile/api-tokens"
echo "   • Create token with 'Edit Cloudflare Workers' template"
echo "   • Copy the token"
echo ""
echo "2. Add secrets to GitHub:"
echo "   • Go to: https://github.com/YOUR_USERNAME/safarnak.app/settings/secrets/actions"
echo "   • Add: CLOUDFLARE_API_TOKEN (the token from step 1)"
echo "   • Add: CLOUDFLARE_ACCOUNT_ID (find at Cloudflare dashboard)"
echo ""
echo "3. The CI workflow will automatically deploy on push to master"
echo ""
echo "════════════════════════════════════════════════════════════════════════════"
echo ""
echo "✨ All done! Your Cloudflare resources are ready."
echo ""

