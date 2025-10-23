# GitHub Actions Workflows

This repository includes comprehensive GitHub Actions workflows for building and deploying the Safarnak travel application.

## Workflows Overview

### 1. Build and Deploy (`build-and-deploy.yml`)

**Triggers:**
- Push to `master`/`main` branches
- Pull requests to `master`/`main` branches  
- Release publication

**Jobs:**

#### Android Build (`build-android`)
- Builds Android APK using EAS Build
- Publishes APK as GitHub release asset (on releases)
- Uploads APK as build artifact (on pushes)
- Uses efficient caching for dependencies

#### Worker Deploy (`deploy-worker`)
- Deploys Cloudflare Worker using Wrangler CLI
- Runs database migrations before deployment
- Uses efficient caching for dependencies

#### Testing (`test`)
- Runs TypeScript type checking
- Runs on pull requests only
- Prepares for future linting/testing integration

#### Build Summary (`build-summary`)
- Provides a summary of all build results
- Shows status of Android build and Worker deployment

## Required Secrets

Configure these secrets in your GitHub repository settings:

### For Android Builds
- `EXPO_TOKEN`: Your Expo access token
  - Get from: https://expo.dev/accounts/[username]/settings/access-tokens
  - Required for EAS Build authentication

### For Worker Deployment
- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
  - Get from: https://dash.cloudflare.com/profile/api-tokens
  - Required permissions: `Zone:Zone:Read`, `Zone:Zone Settings:Edit`, `Account:Cloudflare Workers:Edit`

## Caching Strategy

The workflows implement efficient caching for:

1. **Node.js dependencies**: Cached using `actions/setup-node` with yarn cache
2. **Yarn dependencies**: Cached using `actions/cache` with yarn.lock hash
3. **Build artifacts**: Cached between runs for faster subsequent builds

## Performance Optimizations

1. **Parallel Jobs**: Android build and Worker deploy run in parallel
2. **Conditional Execution**: Jobs only run on relevant branches/events
3. **Efficient Caching**: Multiple cache layers for different dependency types
4. **Minimal Checkout**: Uses `fetch-depth: 0` only when needed

## Build Artifacts

### Android APK
- **Release builds**: Attached to GitHub releases as downloadable assets
- **Development builds**: Available as GitHub Actions artifacts for 30 days
- **Naming**: `safarnak-android-{version}.apk`

### Worker Deployment
- **Production**: Deployed to Cloudflare Workers
- **Database**: Migrations applied automatically before deployment

## Monitoring and Debugging

### Build Status
- Check the Actions tab in GitHub for build status
- Build summary provides quick overview of all job results
- Failed builds include detailed error logs

### Common Issues

1. **EAS Build Timeout**: Increase wait time in workflow if builds take longer
2. **Cloudflare Auth**: Ensure API token has correct permissions
3. **Dependency Cache**: Clear cache if dependency issues persist

## Customization

### Adding New Jobs
1. Add job definition in workflow file
2. Update `build-summary` job dependencies
3. Add any required secrets to repository settings

### Modifying Build Profiles
- Update `eas.json` for different Android build configurations
- Modify `wrangler.toml` for Worker deployment settings

### Adding Tests
- Extend the `test` job with your testing framework
- Add test result reporting to build summary

## Security Considerations

- All secrets are properly scoped and only used where needed
- API tokens have minimal required permissions
- Build artifacts are only accessible to repository members
- No sensitive data is logged in workflow output

## Troubleshooting

### Android Build Issues
```bash
# Test EAS build locally
cd client
eas build --platform android --profile preview --local
```

### Worker Deployment Issues
```bash
# Test worker deployment locally
cd worker
wrangler dev
wrangler deploy --dry-run
```

### Cache Issues
- Clear GitHub Actions cache in repository settings
- Or modify cache key to force cache refresh

## Future Enhancements

- [ ] Add iOS build support
- [ ] Integrate automated testing
- [ ] Add performance monitoring
- [ ] Implement staging environment deployment
- [ ] Add security scanning
- [ ] Integrate with external monitoring services
