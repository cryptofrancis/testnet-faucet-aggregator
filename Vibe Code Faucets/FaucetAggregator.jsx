import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FAUCETS } from './src/data/faucets';
import { SORTABLE_KEYS, makeComparator, stableSort } from './src/lib/sortFaucets';
import { filterFaucets } from './src/lib/filterFaucets';
import { getChainLogo, getAssetLogo } from './src/lib/logos';
import { HeaderBar } from './src/components/HeaderBar';
import { HeroSearch } from './src/components/HeroSearch';
import { FiltersBar } from './src/components/FiltersBar';
import { FaucetsTable } from './src/components/FaucetsTable';
import { DonateModal } from './src/components/DonateModal';

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

  function handleSort(key) {
    if (!SORTABLE_KEYS.includes(key)) return;

    setSortConfig(prev => {
      if (prev.key !== key) {
        return { key, mode: "asc" };
      }
      
      if (prev.mode === "asc") {
        return { key, mode: "desc" };
      }
      
      return { key: null, mode: "default" };
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
  };

  const copyDonationAddress = async () => {
    try {
      await navigator.clipboard.writeText(DONATION.address);
      setCopied(true);
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
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
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
        onOpenDonate={() => setShowDonateModal(true)}
        chainFilter={chainFilter}
        assetFilter={assetFilter}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <HeroSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isDark={isDark}
          faucetsCount={FAUCETS.length}
        />

        <FiltersBar
          isDark={isDark}
          chains={chains}
          assets={assets}
          chainFilter={chainFilter}
          setChainFilter={setChainFilter}
          assetFilter={assetFilter}
          setAssetFilter={setAssetFilter}
          amountFilter={amountFilter}
          setAmountFilter={setAmountFilter}
          availableAmounts={availableAmounts}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          types={types}
          toggleFilter={toggleFilter}
          getChainLogo={getChainLogo}
          getAssetLogo={getAssetLogo}
          walletConnectionFilter={walletConnectionFilter}
          setWalletConnectionFilter={setWalletConnectionFilter}
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
            }`}>2025-01-17</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FaucetAggregator;
