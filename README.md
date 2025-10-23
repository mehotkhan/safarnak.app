# Safarnak App

A full-stack application with a Cloudflare Worker backend and Expo React Native client.

## Project Structure

- `worker/` - Cloudflare Worker backend with GraphQL API
- `client/` - Expo React Native mobile application

## Development

### Start both services
```bash
yarn dev
```

### Individual services

#### Worker (Backend)
```bash
yarn worker:dev          # Start development server
yarn worker:deploy       # Deploy to Cloudflare
yarn worker:db:generate  # Generate database migrations
yarn worker:db:migrate   # Run local migrations
yarn worker:db:studio    # Open database studio
```

#### Client (Mobile App)
```bash
yarn client:start    # Start Expo development server
yarn client:android  # Run on Android
yarn client:ios      # Run on iOS
yarn client:web      # Run on web
```

## Setup

1. Install dependencies:
```bash
yarn install:all
```

2. Start development:
```bash
yarn dev
```
