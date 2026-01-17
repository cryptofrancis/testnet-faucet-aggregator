import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { getChainLogoFallbacks, getAssetLogoFallbacks } from '../lib/logos';

export const FilterDropdown = ({ label, options, selected, onSelect, getLogo, placeholder = 'All', isDark = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const displayText = selected.length === 0 
    ? placeholder 
    : selected.length === 1 
    ? selected[0] 
    : `${selected.length} selected`;
  
  const showCount = selected.length > 0;

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onSelect(selected.filter(item => item !== option));
    } else {
      onSelect([...selected, option]);
    }
  };

  const LogoImage = ({ sources }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    if (!sources || sources.length === 0) return null;
    
    const handleError = useCallback((e) => {
      if (currentIndex < sources.length - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        e.target.src = sources[nextIndex];
        e.target.style.display = '';
      } else {
        e.target.style.display = 'none';
        const fallback = e.target.nextElementSibling;
        if (fallback) fallback.style.display = 'flex';
      }
    }, [currentIndex, sources]);

    const handleLoad = useCallback((e) => {
      const fallback = e.target.nextElementSibling;
      if (fallback) fallback.style.display = 'none';
    }, []);

    return (
      <>
        <img 
          src={sources[currentIndex]}
          alt=""
          className={`w-4 h-4 flex-shrink-0 rounded-full object-cover border ${
            isDark ? 'border-slate-700' : 'border-slate-200'
          }`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={handleError}
          onLoad={handleLoad}
        />
        <div 
          data-fallback=""
          className={`w-4 h-4 flex-shrink-0 rounded-full flex items-center justify-center text-[10px] font-semibold hidden ${
            isDark
              ? 'bg-slate-700 text-slate-300'
              : 'bg-slate-200 text-slate-500'
          }`}
        />
      </>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 border rounded-md text-xs font-medium transition-all duration-150 min-w-[140px] justify-between hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
          isDark
            ? 'bg-slate-900/50 border-slate-800 text-slate-200 hover:bg-slate-800/70 hover:border-slate-700 focus:ring-blue-500/50 focus:ring-offset-slate-950'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:ring-blue-500 focus:ring-offset-white'
        }`}
      >
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="truncate">{displayText}</span>
          {showCount && (
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium tabular-nums flex-shrink-0 ${
              isDark 
                ? 'bg-blue-500/20 text-blue-300' 
                : 'bg-blue-50 text-blue-600'
            }`}>
              {selected.length}
            </span>
          )}
        </div>
        <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-150 ${
          isDark ? 'text-slate-400' : 'text-slate-400'
        } ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-1.5 border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto min-w-[240px] ${
          isDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200'
        }`}>
          <div className="p-1">
            {options.map((option) => {
              let fallbackSources = [];
              if (getLogo) {
                const chainFallbacks = getChainLogoFallbacks(option);
                const assetFallbacks = getAssetLogoFallbacks(option);
                fallbackSources = chainFallbacks.length > 0 ? chainFallbacks : assetFallbacks;
              }
              
              const isSelected = selected.includes(option);
              
              return (
                <button
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 ${
                    isSelected
                      ? isDark
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-blue-50 text-blue-700'
                      : isDark
                      ? 'text-slate-300 hover:bg-slate-800/50'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {fallbackSources.length > 0 ? (
                    <LogoImage sources={fallbackSources} />
                  ) : (
                    <div 
                      className={`w-4 h-4 flex-shrink-0 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                        isDark
                          ? 'bg-slate-700 text-slate-300'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {option.charAt(0)}
                    </div>
                  )}
                  <span className="flex-1 text-left truncate">{option}</span>
                  {isSelected && (
                    <Check className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
