import React, { useEffect, useState } from 'react';
import { Heart, Plus, Github } from 'lucide-react';

export const HeaderBar = ({ 
  isDark, 
  onToggleDarkMode, 
  onOpenDonate, 
  chainFilter,
  assetFilter
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? isDark
            ? 'bg-slate-950/95 backdrop-blur-sm border-b border-slate-800/50'
            : 'bg-white/95 backdrop-blur-sm border-b border-slate-200/50'
          : isDark
          ? 'bg-slate-950/0'
          : 'bg-white/0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <h1 className={`text-lg font-semibold tracking-tight transition-colors duration-200 ${
          isDark ? 'text-slate-100' : 'text-slate-900'
        }`}>
          Testnet Faucets
        </h1>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/cryptofrancis/testnet-faucet-aggregator"
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-md transition-all duration-150 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDark
                ? 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 focus:ring-blue-500/50 focus:ring-offset-slate-950'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-blue-500 focus:ring-offset-white'
            }`}
            aria-label="View on GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <button
            onClick={onOpenDonate}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDark
                ? 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 focus:ring-blue-500/50 focus:ring-offset-slate-950'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-blue-500 focus:ring-offset-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 inline mr-1.5" />
            Donate
          </button>
          <button
            onClick={() => {
              const pageUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : 'xxxxx';
              const chain = chainFilter.length === 1 ? encodeURIComponent(chainFilter[0]) : 'xxxxx';
              const testnet = 'xxxxx';
              const asset = assetFilter.length === 1 ? encodeURIComponent(assetFilter[0]) : 'xxxxx';
              const faucetUrl = 'xxxxx';
              const formUrl = `https://form.typeform.com/to/x479092r#pageurl=${pageUrl}&chain=${chain}&testnet=${testnet}&asset=${asset}&fauceturl=${faucetUrl}`;
              window.open(formUrl, '_blank', 'noopener,noreferrer');
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
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
            <Plus className="w-3.5 h-3.5 inline mr-1.5" />
            Request / Report
          </button>
        </div>
      </div>
    </header>
  );
};
