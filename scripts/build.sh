#!/bin/bash

# Safarnak Development Build Script
# This script helps build different versions of the app for development and production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev         Build development version (Safarnak Dev)"
    echo "  preview     Build preview version (Safarnak Preview)"
    echo "  prod        Build production version (Safarnak)"
    echo "  local-dev   Start local development server"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev      # Build development APK"
    echo "  $0 prod     # Build production APK"
    echo "  $0 local-dev # Start local development server"
}

# Function to build development version
build_dev() {
    print_status "Building development version (Safarnak Dev)..."
    cd client
    npx expo prebuild --platform android --clean
    cd android
    ./gradlew assembleDebug
    print_success "Development APK built successfully!"
    print_status "APK location: client/android/app/build/outputs/apk/debug/app-debug.apk"
}

# Function to build preview version
build_preview() {
    print_status "Building preview version (Safarnak Preview)..."
    cd client
    npx expo prebuild --platform android --clean
    cd android
    ./gradlew assembleRelease
    print_success "Preview APK built successfully!"
    print_status "APK location: client/android/app/build/outputs/apk/release/app-release.apk"
}

# Function to build production version
build_prod() {
    print_status "Building production version (Safarnak)..."
    cd client
    npx expo prebuild --platform android --clean
    cd android
    ./gradlew assembleRelease
    print_success "Production APK built successfully!"
    print_status "APK location: client/android/app/build/outputs/apk/release/app-release.apk"
}

# Function to start local development server
start_local_dev() {
    print_status "Starting local development server..."
    print_warning "Make sure your worker is running on http://192.168.1.51:8787"
    cd client
    npx expo start --dev-client
}

# Main script logic
case "${1:-help}" in
    "dev")
        build_dev
        ;;
    "preview")
        build_preview
        ;;
    "prod")
        build_prod
        ;;
    "local-dev")
        start_local_dev
        ;;
    "help"|"--help"|"-h")
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac
