/**
 * Script to automatically remove faucet entries with 404 URLs
 * Run with: node scripts/remove-404-links.js
 * 
 * This will:
 * 1. Check all faucet URLs
 * 2. Identify those that return 404
 * 3. Remove them from faucets.ts
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read faucets data
const faucetsFilePath = join(__dirname, '../src/data/faucets.ts');
let faucetsContent = readFileSync(faucetsFilePath, 'utf-8');

// Extract faucets with their IDs and URLs
const lines = faucetsContent.split('\n');
const faucets = [];
let currentFaucet = null;
let braceDepth = 0;

lines.forEach((line, index) => {
  const idMatch = line.match(/^\s*\{\s*id:\s*([^,]+)/);
  const urlMatch = line.match(/url:\s*['"](https?:\/\/[^'"]+)['"]/);
  const closeBrace = line.includes('},') || line.includes('}');
  
  if (idMatch) {
    currentFaucet = {
      id: idMatch[1].trim(),
      startLine: index,
      url: null,
      fullLine: line,
      allLines: [line]
    };
  }
  
  if (currentFaucet && urlMatch) {
    currentFaucet.url = urlMatch[1];
  }
  
  if (currentFaucet) {
    if (index > currentFaucet.startLine) {
      currentFaucet.allLines.push(line);
    }
  }
  
  if (closeBrace && currentFaucet && line.includes('},')) {
    currentFaucet.endLine = index;
    if (currentFaucet.url) {
      faucets.push(currentFaucet);
    }
    currentFaucet = null;
  }
});

console.log(`\n🔍 Found ${faucets.length} faucet entries to check...\n`);

// Check URLs
const TIMEOUT = 10000;
const CONCURRENT = 5;

async function checkUrl(faucet) {
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    const response = await fetch(faucet.url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FaucetLinkChecker/1.0)'
      }
    });

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    const finalUrl = response.url;
    const urlPath = new URL(finalUrl).pathname.toLowerCase();
    const urlContains404 = urlPath.includes('/404') || urlPath.includes('/error') || urlPath.includes('/not-found');
    
    const is404 = response.status === 404 || urlContains404;
    
    return {
      ...faucet,
      is404,
      status: response.status,
      finalUrl,
      duration
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      ...faucet,
      is404: false,
      status: null,
      finalUrl: null,
      duration,
      error: error.name === 'AbortError' ? 'Timeout' : error.message
    };
  }
}

// Process URLs in batches
async function checkAllUrls() {
  const results = [];
  
  for (let i = 0; i < faucets.length; i += CONCURRENT) {
    const batch = faucets.slice(i, i + CONCURRENT);
    const batchResults = await Promise.all(batch.map(checkUrl));
    results.push(...batchResults);
    
    process.stdout.write(`\r✓ Checked ${Math.min(i + CONCURRENT, faucets.length)}/${faucets.length} URLs...`);
    
    if (i + CONCURRENT < faucets.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log('\n');
  return results;
}

// Run checks and remove 404s
checkAllUrls().then(results => {
  const four04s = results.filter(r => r.is404);
  const successful = results.filter(r => !r.is404);
  
  console.log(`\n📊 Results:`);
  console.log(`   ✅ Working: ${successful.length}`);
  console.log(`   ❌ 404 Not Found: ${four04s.length}`);
  
  if (four04s.length === 0) {
    console.log('\n🎉 No 404 links found! All links are working.');
    process.exit(0);
  }
  
  console.log(`\n🔴 Found ${four04s.length} 404 link(s) to remove:\n`);
  four04s.forEach(f => {
    console.log(`   • ${f.name} (${f.chain}) - ID: ${f.id}`);
    console.log(`     URL: ${f.url}`);
  });
  
  // Remove 404 entries from the file
  const linesToRemove = new Set();
  four04s.forEach(faucet => {
    // Find the line range for this faucet
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(`id: ${faucet.id}`)) {
        // Mark all lines until we find the closing brace
        let j = i;
        while (j < lines.length && !lines[j].trim().match(/^\},?\s*$/)) {
          linesToRemove.add(j);
          j++;
        }
        // Also remove the closing brace line
        if (j < lines.length && lines[j].includes('}')) {
          linesToRemove.add(j);
        }
        break;
      }
    }
  });
  
  // Create new content without 404 entries
  const newLines = lines.filter((line, index) => !linesToRemove.has(index));
  
  // Remove trailing comma from last entry before a removed entry
  let newContent = newLines.join('\n');
  
  // Clean up: remove commas before closing brackets
  newContent = newContent.replace(/,\s*\n\s*\];/g, '\n];');
  
  // Write back to file
  writeFileSync(faucetsFilePath, newContent, 'utf-8');
  
  console.log(`\n✅ Removed ${four04s.length} 404 link(s) from faucets.ts`);
  console.log(`\n⚠️  File updated. Please review the changes before committing.`);
  
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});
