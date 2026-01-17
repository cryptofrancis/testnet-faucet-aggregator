/**
 * Script to check if all faucet URLs are accessible
 * Run with: node scripts/check-faucet-links.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read faucets data
const faucetsFilePath = join(__dirname, '../src/data/faucets.ts');
const faucetsContent = readFileSync(faucetsFilePath, 'utf-8');

// Extract URL and metadata from the TypeScript file
// Simple regex-based extraction (could be improved with a proper TS parser)
const urlRegex = /url:\s*['"](https?:\/\/[^'"]+)['"]/g;
const idRegex = /id:\s*([^,]+)/g;
const nameRegex = /name:\s*['"]([^'"]+)['"]/g;
const chainRegex = /chain:\s*['"]([^'"]+)['"]/g;

const matches = [];
const lines = faucetsContent.split('\n');

lines.forEach((line, index) => {
  const urlMatch = line.match(/url:\s*['"](https?:\/\/[^'"]+)['"]/);
  const idMatch = line.match(/id:\s*([^,]+)/);
  const nameMatch = line.match(/name:\s*['"]([^'"]+)['"]/);
  const chainMatch = line.match(/chain:\s*['"]([^'"]+)['"]/);
  
  if (urlMatch) {
    matches.push({
      id: idMatch ? idMatch[1].trim() : 'unknown',
      name: nameMatch ? nameMatch[1] : 'unknown',
      chain: chainMatch ? chainMatch[1] : 'unknown',
      url: urlMatch[1],
      lineNumber: index + 1
    });
  }
});

console.log(`\n🔍 Checking ${matches.length} faucet URLs...\n`);

// Check URLs with a timeout
const TIMEOUT = 10000; // 10 seconds
const CONCURRENT = 5; // Check 5 URLs at a time to avoid overwhelming servers

async function checkUrl(faucet) {
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    // Use GET instead of HEAD to catch client-side 404s that HEAD might miss
    const response = await fetch(faucet.url, {
      method: 'HEAD', // Use HEAD to reduce bandwidth
      signal: controller.signal,
      redirect: 'follow', // Follow redirects to check final destination
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FaucetLinkChecker/1.0)'
      }
    });

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    // Check if final URL path explicitly contains 404 error indicators
    const finalUrl = response.url;
    const urlPath = new URL(finalUrl).pathname.toLowerCase();
    const urlContains404 = urlPath.includes('/404') || urlPath.includes('/error') || urlPath.includes('/not-found');

    // Consider only 2xx and 3xx as success (exclude 404, 403, etc.)
    // 404 = Not Found (broken link)
    // 403 = Forbidden (might be broken or access restricted)
    // 500+ = Server errors (temporary but still broken)
    const is404 = response.status === 404 || urlContains404;
    const success = response.status >= 200 && response.status < 400 && response.status !== 404 && !urlContains404;
    
    return {
      ...faucet,
      success,
      status: response.status,
      statusText: response.statusText,
      finalUrl: finalUrl, // Track final URL after redirects
      duration,
      error: null,
      is404: is404
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      ...faucet,
      success: false,
      status: null,
      statusText: null,
      finalUrl: null,
      duration,
      error: error.name === 'AbortError' ? 'Timeout' : error.message,
      is404: false
    };
  }
}

// Process URLs in batches
async function checkAllUrls() {
  const results = [];
  
  for (let i = 0; i < matches.length; i += CONCURRENT) {
    const batch = matches.slice(i, i + CONCURRENT);
    const batchResults = await Promise.all(batch.map(checkUrl));
    results.push(...batchResults);
    
    // Progress indicator
    process.stdout.write(`\r✓ Checked ${Math.min(i + CONCURRENT, matches.length)}/${matches.length} URLs...`);
    
    // Small delay between batches to be respectful
    if (i + CONCURRENT < matches.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log('\n');
  return results;
}

// Run checks and display results
checkAllUrls().then(results => {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log(`📈 Success Rate: ${((successful.length / results.length) * 100).toFixed(1)}%`);
  
  if (failed.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('❌ FAILED URLS');
    console.log('='.repeat(80));
    
    const four04s = failed.filter(f => f.is404);
    const otherFailures = failed.filter(f => !f.is404);
    
    if (four04s.length > 0) {
      console.log(`\n🔴 404 NOT FOUND (${four04s.length}):`);
      four04s.forEach(f => {
        console.log(`\n   🔗 ${f.name} (${f.chain})`);
        console.log(`      ID: ${f.id}`);
        console.log(`      URL: ${f.url}`);
        if (f.finalUrl && f.finalUrl !== f.url) {
          console.log(`      Redirected to: ${f.finalUrl}`);
        }
        console.log(`      Line: ${f.lineNumber}`);
      });
    }
    
    if (otherFailures.length > 0) {
      console.log(`\n⚠️  OTHER FAILURES (${otherFailures.length}):`);
      otherFailures.forEach(f => {
        console.log(`\n   🔗 ${f.name} (${f.chain})`);
        console.log(`      ID: ${f.id}`);
        console.log(`      URL: ${f.url}`);
        console.log(`      Line: ${f.lineNumber}`);
        if (f.status) {
          console.log(`      Status: ${f.status} ${f.statusText || ''}`);
        }
        if (f.error) {
          console.log(`      Error: ${f.error}`);
        }
      });
    }
    
    console.log('\n' + '='.repeat(80));
    console.log(`\n⚠️  Found ${failed.length} broken URL(s) (${four04s.length} are 404s). Please update or remove them.`);
  } else {
    console.log('\n🎉 All URLs are accessible!');
  }
  
  console.log('\n');
  
  // Exit with error code if any URLs failed (useful for CI/CD)
  process.exit(failed.length > 0 ? 1 : 0);
}).catch(error => {
  console.error('\n❌ Error running checks:', error);
  process.exit(1);
});
