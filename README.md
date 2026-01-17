# Testnet Faucet Aggregator

A React web application for browsing and filtering testnet faucets across multiple blockchain networks.

## Prerequisites

You need to have Node.js installed (version 18 or higher). If you don't have it:

1. **Install Node.js**: Download from [nodejs.org](https://nodejs.org/) or use a package manager:
   - macOS: `brew install node`
   - Or download the installer from the website

## Setup & Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   The terminal will show a local URL (usually `http://localhost:5173`). Open it in your browser to preview the app.

## Build for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Features

- 🔍 Search faucets by chain, testnet, asset, or notes
- 🎯 Filter by chain, asset type, and faucet type (official/community/third-party)
- 📊 Sortable table columns
- 💝 Donation modal with copy-to-clipboard
- 📝 Request/Report modal for submitting new faucets or reporting issues
