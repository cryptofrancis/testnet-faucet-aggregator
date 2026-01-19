import React from 'react';
import { Search } from 'lucide-react';

export const HeroSearch = ({ searchTerm, onSearchChange, isDark, faucetsCount }) => {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className={`text-3xl font-bold tracking-tight mb-2 ${
          isDark ? 'text-slate-100' : 'text-slate-900'
        }`}>
          Find testnet faucets across {faucetsCount} sources
        </h2>
        <p className={`text-sm mb-3 ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Verified badges • Safety filters • Address-only options
        </p>
        <p className={`text-sm leading-relaxed max-w-3xl ${
          isDark ? 'text-slate-300' : 'text-slate-700'
        }`}>
          Find working blockchain testnet faucets in one place. Filter by chain, testnet, and asset. Supports Ethereum, Solana, Polygon, Arbitrum, Optimism, Base, Avalanche, zkSync, Starknet, Scroll, and other testnets.
        </p>
      </div>

      <div className={`relative max-w-2xl border rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:shadow-lg ${
        isDark
          ? 'bg-slate-900/50 border-slate-800 focus-within:border-blue-500/50 focus-within:ring-blue-500/20'
          : 'bg-white border-slate-200 focus-within:border-blue-500 focus-within:ring-blue-500/10'
      }`}>
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
          isDark ? 'text-slate-500' : 'text-slate-400'
        }`} />
        <input
          type="text"
          placeholder="Search by faucet, chain, testnet, or asset..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none text-sm transition-colors duration-150 ${
            isDark 
              ? 'text-slate-100 placeholder-slate-500' 
              : 'text-slate-900 placeholder-slate-400'
          }`}
        />
      </div>
    </div>
  );
};
