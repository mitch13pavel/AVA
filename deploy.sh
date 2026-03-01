#!/bin/bash

# Viral Architect - Quick Deployment Script
echo "🦠 Viral Architect Deployment Script"
echo "===================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project directory."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies."
    exit 1
fi

echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed."
    exit 1
fi

echo "✅ Build completed successfully!"
echo ""
echo "🚀 Deployment Options:"
echo ""
echo "1. Netlify Drop:"
echo "   - Go to https://app.netlify.com/drop"
echo "   - Drag and drop the entire project folder"
echo ""
echo "2. Netlify CLI (if installed):"
echo "   netlify deploy --prod --dir=build"
echo ""
echo "3. GitHub + Netlify:"
echo "   - Push this code to a GitHub repository"
echo "   - Connect the repository to Netlify"
echo ""
echo "📁 Build folder is ready at: ./build"
echo "🎉 Your Viral Architect Lab is ready to deploy!"
