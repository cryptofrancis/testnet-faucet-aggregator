import React from 'react';
import { FilterDropdown } from './FilterDropdown';

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
  getAssetLogo
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

      {/* Segmented tabs for auth type */}
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium uppercase tracking-wider mr-1 ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>Auth:</span>
        <div className={`inline-flex p-0.5 rounded-lg border ${
          isDark
            ? 'bg-slate-900/50 border-slate-800'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            onClick={() => setTypeFilter([])}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 tabular-nums ${
              typeFilter.length === 0
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
          {types.map(t => {
            const displayName = t === 'official' ? 'Account' : 
                               t === 'community' ? 'None' : 
                               t === 'third-party' ? 'Social' : t;
            const isSelected = typeFilter.includes(t);
            
            return (
              <button
                key={t}
                onClick={() => toggleFilter(t, setTypeFilter)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 tabular-nums ${
                  isSelected
                    ? isDark
                      ? 'bg-slate-800 text-slate-100 shadow-sm'
                      : 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {displayName}
              </button>
            );
          })}
          <button
            onClick={() => toggleFilter('wallet', setTypeFilter)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 tabular-nums ${
              typeFilter.includes('wallet')
                ? isDark
                  ? 'bg-slate-800 text-slate-100 shadow-sm'
                  : 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Wallet
          </button>
        </div>
      </div>
    </div>
  );
};
