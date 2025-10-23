# Safarnak App - Simple Commands Reference

## 🚀 Development Commands
```bash
yarn dev              # Start both worker and client (full development)
yarn client:start      # Start Expo dev server only
yarn client:android    # Run on Android device/emulator
yarn client:ios        # Run on iOS device/simulator
yarn client:web        # Run in web browser
```

## 📱 Build Commands (Persian Apps)
```bash
yarn build:debug      # Build debug APK (تسفرناک)
yarn build:release     # Build release APK (سقرناک)
yarn build:debug:ios  # Build debug iOS (تسفرناک)
yarn build:release:ios # Build release iOS (سقرناک)
```

## 🔧 Worker Commands
```bash
yarn worker:dev       # Start Cloudflare Worker dev server
yarn worker:deploy    # Deploy worker to Cloudflare
```

## 🗄️ Database Commands
```bash
yarn db:generate      # Generate database migrations
yarn db:migrate       # Run database migrations
yarn db:studio        # Open Drizzle Studio
```

## 🧹 Utility Commands
```bash
yarn clean             # Clear databases, cache, and build artifacts
yarn clean:all          # Clear everything including global Gradle cache
```

## 📋 Quick Reference
- **Development**: `yarn dev` (starts everything)
- **Testing**: `yarn client:android` (run on device)
- **Debug App**: `yarn build:debug` (تسفرناک APK)
- **Release App**: `yarn build:release` (سقرناک APK)
