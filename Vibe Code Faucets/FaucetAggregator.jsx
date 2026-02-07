import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { FAUCETS } from './src/data/faucets';
import { SORTABLE_KEYS, makeComparator, stableSort } from './src/lib/sortFaucets';
import { filterFaucets } from './src/lib/filterFaucets';
import { getChainLogo, getAssetLogo } from './src/lib/logos';
import { HeaderBar } from './src/components/HeaderBar';
import { HeroSearch } from './src/components/HeroSearch';
import { FiltersBar } from './src/components/FiltersBar';
import { FaucetsTable } from './src/components/FaucetsTable';
import { DonateModal } from './src/components/DonateModal';
import { FAQ } from './src/components/FAQ';
import { trackSearch, trackFilterChange, trackFiltersReset, trackSort, trackDonateModalOpen, trackDonateAddressCopied, trackDarkModeToggle } from './src/lib/analytics';

/** @typedef {"faucet" | "chain" | "testnet" | "asset"} SortKey */
/** @typedef {"default" | "asc" | "desc"} SortMode */

const DONATION = {
  label: 'Support this project',
  network: 'Ethereum (EVM)',
  address: '0x29135c0cCEaaA9Ef785f63f892922C887D3DbaDE',
};

const FaucetAggregator = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [chainFilter, setChainFilter] = useState([]);
  const [assetFilter, setAssetFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);
  const [amountFilter, setAmountFilter] = useState([]);
  const [walletConnectionFilter, setWalletConnectionFilter] = useState([]); // 'address-only' or 'wallet-required'
  const [sortConfig, setSortConfig] = useState(
    /** @type {{ key: SortKey | null, mode: SortMode }} */ ({ key: null, mode: "default" })
  );

  const [showDonateModal, setShowDonateModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef(null);
  const userSetDarkMode = useRef(false);
  const searchDebounceRef = useRef(null);

  // Debounced search tracking (fires 800ms after user stops typing)
  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (term.trim()) {
      searchDebounceRef.current = setTimeout(() => {
        const resultCount = filterFaucets(
          FAUCETS.map(f => ({ ...f, faucet: f.name || "" })),
          term, chainFilter, assetFilter, typeFilter, amountFilter, walletConnectionFilter
        ).length;
        trackSearch(term.trim(), resultCount);
      }, 800);
    }
  }, [chainFilter, assetFilter, typeFilter, amountFilter, walletConnectionFilter]);

  // Dark mode with localStorage persistence and system preference detection
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        userSetDarkMode.current = true;
        return saved === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Only listen to system preference if user hasn't manually set it
  useEffect(() => {
    if (userSetDarkMode.current) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!userSetDarkMode.current) {
        setIsDark(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply dark mode class and persist to localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', isDark.toString());
    }
  }, [isDark]);

  const chains = useMemo(() => [...new Set(FAUCETS.map(f => f.chain))].sort(), []);
  const assets = useMemo(() => [...new Set(FAUCETS.map(f => f.asset))].sort(), []);
  const types = ['official', 'community', 'third-party'];

  // Get available amounts for selected assets
  const availableAmounts = useMemo(() => {
    if (assetFilter.length === 0) return [];
    const amounts = FAUCETS
      .filter(f => assetFilter.includes(f.asset) && f.amount)
      .map(f => f.amount)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort();
    return amounts;
  }, [assetFilter]);

  // Clear invalid amount filter values when assets change
  useEffect(() => {
    setAmountFilter(prevAmountFilter => {
      if (prevAmountFilter.length === 0) {
        return prevAmountFilter;
      }
      
      if (assetFilter.length === 0) {
        return [];
      }
      
      const validAmounts = prevAmountFilter.filter(amount => availableAmounts.includes(amount));
      return validAmounts;
    });
  }, [assetFilter, availableAmounts]);

  // Tracked filter setters
  const setChainFilterTracked = useCallback((v) => {
    const val = typeof v === 'function' ? v(chainFilter) : v;
    setChainFilter(val);
    trackFilterChange('chain', val);
  }, [chainFilter]);

  const setAssetFilterTracked = useCallback((v) => {
    const val = typeof v === 'function' ? v(assetFilter) : v;
    setAssetFilter(val);
    trackFilterChange('asset', val);
  }, [assetFilter]);

  const setTypeFilterTracked = useCallback((v) => {
    const val = typeof v === 'function' ? v(typeFilter) : v;
    setTypeFilter(val);
    trackFilterChange('type', val);
  }, [typeFilter]);

  const setAmountFilterTracked = useCallback((v) => {
    const val = typeof v === 'function' ? v(amountFilter) : v;
    setAmountFilter(val);
    trackFilterChange('amount', val);
  }, [amountFilter]);

  const setWalletConnectionFilterTracked = useCallback((v) => {
    const val = typeof v === 'function' ? v(walletConnectionFilter) : v;
    setWalletConnectionFilter(val);
    trackFilterChange('safety', val);
  }, [walletConnectionFilter]);

  function handleSort(key) {
    if (!SORTABLE_KEYS.includes(key)) return;

    setSortConfig(prev => {
      let next;
      if (prev.key !== key) {
        next = { key, mode: "asc" };
      } else if (prev.mode === "asc") {
        next = { key, mode: "desc" };
      } else {
        next = { key: null, mode: "default" };
      }
      trackSort(next.key, next.mode);
      return next;
    });
  }

  // Normalize faucets to include 'faucet' field (from 'name')
  const FAUCETS_NORMALIZED = useMemo(
    () => FAUCETS.map(f => ({ ...f, faucet: f.name || "" })),
    []
  );

  const filteredAndSortedFaucets = useMemo(() => {
    const filtered = filterFaucets(
      FAUCETS_NORMALIZED,
      searchTerm,
      chainFilter,
      assetFilter,
      typeFilter,
      amountFilter,
      walletConnectionFilter
    );

    const comparator = makeComparator(sortConfig.key, sortConfig.mode);
    return stableSort(filtered, comparator);
  }, [searchTerm, chainFilter, assetFilter, typeFilter, amountFilter, walletConnectionFilter, sortConfig, FAUCETS_NORMALIZED]);

  const toggleFilter = (value, setFilter) => {
    setFilter(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const resetFilters = () => {
    setSearchTerm('');
    setChainFilter([]);
    setAssetFilter([]);
    setTypeFilter([]);
    setAmountFilter([]);
    setWalletConnectionFilter([]);
    setSortConfig({ key: null, mode: "default" });
    trackFiltersReset();
  };

  const copyDonationAddress = async () => {
    try {
      await navigator.clipboard.writeText(DONATION.address);
      setCopied(true);
      trackDonateAddressCopied();
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
        copyTimeoutRef.current = null;
      }, 1200);
    } catch {
      // noop
    }
  };

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  const closeDonateModal = () => {
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = null;
    }
    setCopied(false);
    setShowDonateModal(false);
  };

  const handleToggleDarkMode = () => {
    userSetDarkMode.current = true;
    setIsDark(!isDark);
    trackDarkModeToggle(!isDark);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark 
        ? 'bg-slate-950' 
        : 'bg-white'
    }`}>
      <HeaderBar
        isDark={isDark}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenDonate={() => { setShowDonateModal(true); trackDonateModalOpen(); }}
        chainFilter={chainFilter}
        assetFilter={assetFilter}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <HeroSearch
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          isDark={isDark}
          faucetsCount={FAUCETS.length}
        />

        <FiltersBar
          isDark={isDark}
          chains={chains}
          assets={assets}
          chainFilter={chainFilter}
          setChainFilter={setChainFilterTracked}
          assetFilter={assetFilter}
          setAssetFilter={setAssetFilterTracked}
          amountFilter={amountFilter}
          setAmountFilter={setAmountFilterTracked}
          availableAmounts={availableAmounts}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilterTracked}
          types={types}
          toggleFilter={toggleFilter}
          getChainLogo={getChainLogo}
          getAssetLogo={getAssetLogo}
          walletConnectionFilter={walletConnectionFilter}
          setWalletConnectionFilter={setWalletConnectionFilterTracked}
        />

        <div className="flex items-center justify-between mb-4">
          <p className={`text-xs font-medium tabular-nums ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Showing <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              {filteredAndSortedFaucets.length}
            </span> of{' '}
            <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              {FAUCETS.length}
            </span>
          </p>

          {(chainFilter.length > 0 || assetFilter.length > 0 || typeFilter.length > 0 || amountFilter.length > 0 || walletConnectionFilter.length > 0 || searchTerm) && (
            <button 
              onClick={resetFilters} 
              className={`text-xs font-medium transition-colors duration-150 hover:underline ${
                isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              Reset filters
            </button>
          )}
        </div>

        <FaucetsTable
          faucets={filteredAndSortedFaucets}
          sortConfig={sortConfig}
          onSort={handleSort}
          isDark={isDark}
          onResetFilters={resetFilters}
        />

        <FAQ isDark={isDark} />
      </main>

      <DonateModal
        isOpen={showDonateModal}
        onClose={closeDonateModal}
        donation={DONATION}
        copied={copied}
        onCopy={copyDonationAddress}
        isDark={isDark}
      />

      <footer className={`border-t mt-16 transition-colors duration-150 ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className={`text-xs font-medium ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Built for devs. Links only — no wallet connections, no token distribution.
          </div>
          <div className={`text-xs flex items-center gap-2 font-medium tabular-nums ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <span>Last updated:</span>
            <span className={`font-medium ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>2025-02-07</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FaucetAggregator;
