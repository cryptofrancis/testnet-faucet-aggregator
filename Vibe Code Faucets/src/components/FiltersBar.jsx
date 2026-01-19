import React from 'react';
import { FilterDropdown } from './FilterDropdown';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const FiltersBar = ({
  isDark,
  chains,
  assets,
  chainFilter,
  setChainFilter,
  assetFilter,
  setAssetFilter,
  amountFilter,
  setAmountFilter,
  availableAmounts,
  typeFilter,
  setTypeFilter,
  types,
  toggleFilter,
  getChainLogo,
  getAssetLogo,
  walletConnectionFilter,
  setWalletConnectionFilter
}) => {
  return (
    <div className="mb-6 space-y-4">
      {/* Compact data controls */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Chain"
          options={chains}
          selected={chainFilter}
          onSelect={setChainFilter}
          getLogo={getChainLogo}
          placeholder="All Chains"
          isDark={isDark}
        />
        
        <FilterDropdown
          label="Asset"
          options={assets}
          selected={assetFilter}
          onSelect={(selected) => {
            setAssetFilter(selected);
          }}
          getLogo={getAssetLogo}
          placeholder="All Tokens"
          isDark={isDark}
        />
        
        {availableAmounts.length > 0 && (
          <FilterDropdown
            label="Amount"
            options={availableAmounts}
            selected={amountFilter}
            onSelect={setAmountFilter}
            getLogo={null}
            placeholder="All Amounts"
            isDark={isDark}
          />
        )}
      </div>

      {/* Safety Filter */}
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium uppercase tracking-wider mr-1 ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>Safety:</span>
        <div className={`inline-flex p-0.5 rounded-lg border ${
          isDark
            ? 'bg-slate-900/50 border-slate-800'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            onClick={() => setWalletConnectionFilter([])}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 tabular-nums ${
              walletConnectionFilter.length === 0
                ? isDark
                  ? 'bg-slate-800 text-slate-100 shadow-sm'
                  : 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => toggleFilter('address-only', setWalletConnectionFilter)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 tabular-nums ${
              walletConnectionFilter.includes('address-only')
                ? isDark
                  ? 'bg-green-600/90 text-white shadow-sm'
                  : 'bg-green-600 text-white shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            Address Only
          </button>
          <button
            onClick={() => toggleFilter('wallet-required', setWalletConnectionFilter)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 tabular-nums ${
              walletConnectionFilter.includes('wallet-required')
                ? isDark
                  ? 'bg-amber-600/90 text-white shadow-sm'
                  : 'bg-amber-600 text-white shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertCircle className="w-3 h-3" />
            Wallet Required
          </button>
        </div>
      </div>
    </div>
  );
};
