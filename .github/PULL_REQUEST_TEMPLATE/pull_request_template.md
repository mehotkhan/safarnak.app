---
name: 🚀 Pull Request
about: Submit a pull request to Safarnak
title: ''
labels: ['needs-review']
assignees: ''
---

## 🚀 Pull Request Description
A clear and concise description of what this PR does.

## 🔄 Changes Made
- [ ] **Client-side changes** (React Native, Expo, Redux, Apollo Client)
- [ ] **Server-side changes** (Cloudflare Worker, GraphQL resolvers)
- [ ] **Shared changes** (GraphQL schema, database schema, types)
- [ ] **Documentation updates** (README, .cursorrules, comments)
- [ ] **Configuration changes** (TypeScript, ESLint, Prettier, etc.)

## 📱 Platform Testing
- [ ] Android (Legacy Architecture)
- [ ] Android (New Architecture - Fabric + TurboModules)
- [ ] iOS
- [ ] Web
- [ ] All platforms

## 🌍 Internationalization Testing
- [ ] English language
- [ ] Persian (Farsi) language
- [ ] RTL layout
- [ ] Language switching

## 🔧 Technical Checklist
- [ ] **GraphQL Schema**: Updated `graphql/schema.graphql` if needed
- [ ] **GraphQL Operations**: Added/updated `.graphql` files in `graphql/queries/`
- [ ] **Codegen**: Ran `yarn codegen` to generate types and hooks
- [ ] **Database**: Updated `drizzle/schema.ts` if needed
- [ ] **Migrations**: Generated and applied migrations with `yarn db:migrate`
- [ ] **TypeScript**: No TypeScript errors (`npx tsc --noEmit`)
- [ ] **Linting**: Passed ESLint checks (`yarn lint`)
- [ ] **Formatting**: Code formatted with Prettier (`yarn format`)

## 🧪 Testing
- [ ] **Online functionality** works correctly
- [ ] **Offline functionality** works correctly
- [ ] **Authentication** works correctly
- [ ] **Real-time features** (subscriptions) work correctly
- [ ] **Dark/Light theme** switching works
- [ ] **Language switching** works
- [ ] **RTL layout** works for Persian

## 📋 Additional Context
Add any other context about the pull request here.

## 🔗 Related Issues
Closes #(issue number)

## 📸 Screenshots/Videos
If applicable, add screenshots or videos to demonstrate the changes.

## 🚨 Breaking Changes
- [ ] This PR contains breaking changes
- [ ] This PR does not contain breaking changes

If breaking changes, please describe them:

---

**Note**: Please ensure you've followed the [development guidelines](https://github.com/mehotkhan/safarnak.app#contributing) and tested thoroughly across all platforms and scenarios.
