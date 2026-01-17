// ---- Sorting config (only these columns are sortable) ----
export const SORTABLE_KEYS = /** @type {const} */ (["faucet", "chain", "testnet", "asset"]);
/** @typedef {"faucet" | "chain" | "testnet" | "asset"} SortKey */
/** @typedef {"default" | "asc" | "desc"} SortMode */

// Market cap rank (lower rank = bigger market cap). Extend as needed.
// Unknown assets will fall to the bottom in default mode.
export const ASSET_MARKETCAP_RANK = {
  ETH: 1,
  USDC: 2,
  USDT: 3,
  SOL: 4,
  BNB: 5,
  XRP: 6,
  MATIC: 7,
  AVAX: 8,
  LINK: 9,
  NEAR: 10,
  APT: 11,
  SUI: 12,
  ALGO: 13,
  ATOM: 14,
  FTM: 15,
  MNT: 16,
  TRX: 17,
  WND: 18,
  ROC: 19,
  INJ: 20,
  CELO: 21,
  EIGEN: 22,
  PYUSD: 23,
};

function normStr(v) {
  return (typeof v === "string" ? v : "").trim().toLowerCase();
}

function cmpStr(a, b) {
  const A = normStr(a);
  const B = normStr(b);
  // empty/null always last
  if (!A && !B) return 0;
  if (!A) return 1;
  if (!B) return -1;
  return A.localeCompare(B);
}

function assetRank(asset) {
  const key = (asset ?? "").trim().toUpperCase();
  return ASSET_MARKETCAP_RANK[key] ?? Number.POSITIVE_INFINITY;
}

// Stable sort helper (decorate-sort-undecorate)
export function stableSort(rows, comparator) {
  return rows
    .map((r, i) => ({ r, i }))
    .sort((a, b) => {
      const c = comparator(a.r, b.r);
      return c !== 0 ? c : a.i - b.i;
    })
    .map(x => x.r);
}

function defaultComparator(a, b) {
  // Default: asset market cap (desc) -> chain -> testnet -> faucet -> asset
  const ar = assetRank(a.asset);
  const br = assetRank(b.asset);
  if (ar !== br) return ar - br; // smaller rank first (higher market cap)

  const c1 = cmpStr(a.chain, b.chain); if (c1) return c1;
  const c2 = cmpStr(a.testnet, b.testnet); if (c2) return c2;
  const c3 = cmpStr(a.faucet, b.faucet); if (c3) return c3;
  return cmpStr(a.asset, b.asset);
}

// Tie-breaker comparator: consistent order for secondary sorting
// Always uses ascending order regardless of primary sort direction
function tieBreakerComparator(a, b, excludeKey) {
  // Use default comparator, but skip the primary sort key if it's already been compared
  if (excludeKey !== "asset") {
    const ar = assetRank(a.asset);
    const br = assetRank(b.asset);
    if (ar !== br) return ar - br;
  }
  
  if (excludeKey !== "chain") {
    const c1 = cmpStr(a.chain, b.chain);
    if (c1) return c1;
  }
  
  if (excludeKey !== "testnet") {
    const c2 = cmpStr(a.testnet, b.testnet);
    if (c2) return c2;
  }
  
  if (excludeKey !== "faucet") {
    const c3 = cmpStr(a.faucet, b.faucet);
    if (c3) return c3;
  }
  
  if (excludeKey !== "asset") {
    return cmpStr(a.asset, b.asset);
  }
  
  // If all excluded or all equal, return 0
  return 0;
}

export function makeComparator(sortKey, sortMode) {
  // Validate inputs and return default comparator if invalid
  if (!sortKey || sortMode === "default" || !SORTABLE_KEYS.includes(sortKey)) {
    return defaultComparator;
  }

  const isDesc = sortMode === "desc";

  return (a, b) => {
    let primaryResult = 0;
    
    // Compare based on the sort key (always compare a to b in natural ascending order)
    if (sortKey === "faucet") {
      primaryResult = cmpStr(a.faucet, b.faucet);
    } else if (sortKey === "chain") {
      primaryResult = cmpStr(a.chain, b.chain);
    } else if (sortKey === "testnet") {
      primaryResult = cmpStr(a.testnet, b.testnet);
    } else if (sortKey === "asset") {
      // Sort by market cap rank first, then alphabetically for unranked assets
      const ar = assetRank(a.asset);
      const br = assetRank(b.asset);
      if (ar !== br) {
        primaryResult = ar - br; // smaller rank first (higher market cap)
      } else {
        primaryResult = cmpStr(a.asset, b.asset); // alphabetical for same rank or unranked
      }
    }

    // Apply sort direction
    // JavaScript sort: negative = a before b, positive = b before a, zero = equal
    // For descending: negate to reverse the ascending order
    // Example: ascending "Avalanche" < "zkSync" gives -1, descending gives 1 (zkSync before Avalanche)
    const result = isDesc ? -primaryResult : primaryResult;

    // If primary comparison is not equal, return it (this handles all different values)
    if (result !== 0) {
      return result;
    }

    // Tie-breaker: if primary comparison is equal (same chain/faucet/etc), use consistent secondary sort
    // Don't apply direction to tie-breaker - it should always use consistent ordering
    return tieBreakerComparator(a, b, sortKey);
  };
}
