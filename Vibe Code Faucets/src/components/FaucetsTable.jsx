import React, { useState, useCallback } from 'react';
import { ExternalLink, AlertCircle, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { getChainLogoFallbacks, getAssetLogoFallbacks } from '../lib/logos';

// Component to handle logo with fallbacks
const LogoWithFallback = ({ sources, alt, className, ...props }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!sources || sources.length === 0) return null;
  
  const currentSource = sources[currentIndex];
  
  const handleError = useCallback((e) => {
    if (currentIndex < sources.length - 1) {
      // Try next fallback
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      // Force reload with new source
      e.target.src = sources[nextIndex];
      e.target.style.display = '';
    } else {
      // All sources failed
      e.target.style.display = 'none';
      console.warn(`All logo sources failed for:`, sources[0]);
    }
  }, [currentIndex, sources]);

  return (
    <img
      src={currentSource}
      alt={alt}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={handleError}
      {...props}
    />
  );
};

export const FaucetsTable = ({ 
  faucets, 
  sortConfig, 
  onSort, 
  isDark,
  onResetFilters
}) => {
  if (faucets.length === 0) {
    return (
      <div className={`rounded-lg border p-12 text-center ${
        isDark
          ? 'bg-slate-900/50 border-slate-800'
          : 'bg-white border-slate-200'
      }`}>
        <AlertCircle className={`w-10 h-10 mx-auto mb-3 ${
          isDark ? 'text-slate-600' : 'text-slate-400'
        }`} />
        <h3 className={`text-base font-semibold mb-1.5 tracking-tight ${
          isDark ? 'text-slate-100' : 'text-slate-900'
        }`}>No faucets found</h3>
        <p className={`mb-4 text-sm ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>Try adjusting your filters or search terms.</p>
        <button
          onClick={onResetFilters}
          className={`px-4 py-2 rounded-md text-xs font-medium transition-all duration-150 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDark
              ? 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500/50 focus:ring-offset-slate-950'
              : 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500 focus:ring-offset-white'
          }`}
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border overflow-hidden ${
      isDark
        ? 'bg-slate-900/50 border-slate-800'
        : 'bg-white border-slate-200'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`sticky top-0 z-10 border-b ${
            isDark 
              ? 'bg-slate-900/95 backdrop-blur-sm border-slate-800' 
              : 'bg-white/95 backdrop-blur-sm border-slate-200'
          }`}>
            <tr>
              <th
                onClick={() => onSort("faucet")}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors duration-150 ${
                  isDark
                    ? 'text-slate-300 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  Faucet
                  {sortConfig.key === "faucet" && sortConfig.mode === "asc" && (
                    <ArrowUp className="w-3 h-3" />
                  )}
                  {sortConfig.key === "faucet" && sortConfig.mode === "desc" && (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  {sortConfig.key !== "faucet" && (
                    <ArrowUpDown className="w-3 h-3 opacity-30" />
                  )}
                </div>
              </th>
              <th
                onClick={() => onSort("chain")}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors duration-150 ${
                  isDark
                    ? 'text-slate-300 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  Chain
                  {sortConfig.key === "chain" && sortConfig.mode === "asc" && (
                    <ArrowUp className="w-3 h-3" />
                  )}
                  {sortConfig.key === "chain" && sortConfig.mode === "desc" && (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  {sortConfig.key !== "chain" && (
                    <ArrowUpDown className="w-3 h-3 opacity-30" />
                  )}
                </div>
              </th>
              <th
                onClick={() => onSort("testnet")}
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none transition-colors duration-150 ${
                  isDark
                    ? 'text-slate-400 hover:bg-slate-800/50'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  Testnet
                  {sortConfig.key === "testnet" && sortConfig.mode === "asc" && (
                    <ArrowUp className="w-3 h-3" />
                  )}
                  {sortConfig.key === "testnet" && sortConfig.mode === "desc" && (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  {sortConfig.key !== "testnet" && (
                    <ArrowUpDown className="w-3 h-3 opacity-30" />
                  )}
                </div>
              </th>
              <th
                onClick={() => onSort("asset")}
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none transition-colors duration-150 ${
                  isDark
                    ? 'text-slate-400 hover:bg-slate-800/50'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  Asset
                  {sortConfig.key === "asset" && sortConfig.mode === "asc" && (
                    <ArrowUp className="w-3 h-3" />
                  )}
                  {sortConfig.key === "asset" && sortConfig.mode === "desc" && (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  {sortConfig.key !== "asset" && (
                    <ArrowUpDown className="w-3 h-3 opacity-30" />
                  )}
                </div>
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Amount
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Type
              </th>
              <th className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Faucet
              </th>
            </tr>
          </thead>

          <tbody>
            {faucets.map((faucet, index) => (
              <tr 
                key={faucet.id} 
                className={`border-b transition-colors duration-150 ${
                  isDark
                    ? `border-slate-800/50 hover:bg-slate-800/30`
                    : `border-slate-100 hover:bg-slate-50/50`
                }`}
              >
                <td className={`px-4 py-3 text-sm font-medium ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  <div className="flex items-center gap-2">
                    <span>{faucet.name || '—'}</span>
                    {faucet.notes && (
                      <div className="relative group">
                        <AlertCircle className={`w-3.5 h-3.5 ${
                          isDark ? 'text-yellow-500' : 'text-yellow-600'
                        } cursor-help`} />
                        <div className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 rounded-md text-xs font-medium max-w-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 pointer-events-none ${
                          isDark
                            ? 'bg-slate-800 text-slate-200 border border-slate-700'
                            : 'bg-slate-900 text-slate-100 border border-slate-800'
                        }`}>
                          <div className="whitespace-normal break-words">{faucet.notes}</div>
                          <div className={`absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 ${
                            isDark
                              ? 'border-t-slate-800 border-l-transparent border-r-transparent'
                              : 'border-t-slate-900 border-l-transparent border-r-transparent'
                          }`}></div>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <LogoWithFallback
                      sources={getChainLogoFallbacks(faucet.chain)}
                      alt={`${faucet.chain} logo`}
                      className={`w-4 h-4 rounded-full object-cover flex-shrink-0 border ${
                        isDark ? 'border-slate-700' : 'border-slate-200'
                      }`}
                    />
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}>{faucet.chain}</span>
                  </div>
                </td>
                <td className={`px-4 py-3 text-sm ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>{faucet.testnet}</td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <LogoWithFallback
                      sources={getAssetLogoFallbacks(faucet.asset)}
                      alt={`${faucet.asset} logo`}
                      className={`w-4 h-4 rounded-full object-cover flex-shrink-0 border ${
                        isDark ? 'border-slate-700' : 'border-slate-200'
                      }`}
                    />
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium tabular-nums ${
                      isDark
                        ? 'bg-slate-800/50 text-slate-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {faucet.asset}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3">
                  {faucet.amount ? (
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium tabular-nums ${
                      isDark
                        ? 'bg-slate-800/50 text-slate-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {faucet.amount}
                    </span>
                  ) : (
                    <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>—</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium tabular-nums ${
                        faucet.type === 'official'
                          ? isDark
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-green-50 text-green-700 border border-green-200'
                          : faucet.type === 'community'
                          ? isDark
                            ? 'bg-slate-800/50 text-slate-300'
                            : 'bg-slate-100 text-slate-700'
                          : isDark
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {faucet.type.charAt(0).toUpperCase() + faucet.type.slice(1)}
                    </span>
                    {faucet.walletConnectionRequired && (
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium tabular-nums ${
                        isDark
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        Wallet
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => window.open(faucet.url, '_blank', 'noopener,noreferrer')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                      isDark
                        ? 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500/50 focus:ring-offset-slate-950'
                        : 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500 focus:ring-offset-white'
                    }`}
                    style={{
                      boxShadow: isDark 
                        ? '0 1px 3px rgba(59, 130, 246, 0.3)'
                        : '0 1px 3px rgba(59, 130, 246, 0.25)'
                    }}
                  >
                    Open <ExternalLink className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
