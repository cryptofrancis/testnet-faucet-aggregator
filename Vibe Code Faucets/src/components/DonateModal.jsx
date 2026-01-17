import React from 'react';
import { X, Copy, Check, Heart } from 'lucide-react';

export const DonateModal = ({ 
  isOpen, 
  onClose, 
  donation, 
  copied, 
  onCopy, 
  isDark 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" 
      onClick={onClose}
    >
      <div 
        className={`rounded-2xl max-w-lg w-full p-6 sm:p-8 border shadow-2xl transition-all duration-200 animate-in zoom-in-95 duration-200 ${
          isDark
            ? 'bg-slate-900/95 border-slate-700/50'
            : 'bg-white border-slate-200/50'
        }`}
        style={{
          boxShadow: isDark 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'
            }`}>
              <Heart className="w-5 h-5" fill="currentColor" />
            </div>
            <h3 className={`text-2xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Support the Project</h3>
          </div>
          <button 
            onClick={onClose} 
            className={`transition-all duration-150 p-2 rounded-lg hover:scale-110 ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <div className="mb-6 space-y-3">
          <p className={`text-base leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-gray-700'
          }`}>
            This is a free, open-source project built to help developers easily find testnet faucets across 75+ blockchain networks. Your support helps keep this resource running and improves the developer experience for everyone in the Web3 community.
          </p>
          <p className={`text-sm leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-gray-600'
          }`}>
            Any contribution, no matter how small, is deeply appreciated. 💙
          </p>
        </div>

        {/* Address Section */}
        <div className={`border-2 rounded-xl p-4 sm:p-5 mb-6 transition-all duration-200 ${
          isDark
            ? 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50'
            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-slate-400' : 'text-gray-600'
            }`}>
              {donation.network}
            </div>
            {copied && (
              <div className={`flex items-center gap-1.5 text-xs font-medium ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`}>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </div>
            )}
          </div>
          
          {/* Address display - clickable and formatted */}
          <div 
            onClick={onCopy}
            className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-150 ${
              isDark 
                ? 'bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50' 
                : 'bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-mono whitespace-nowrap leading-relaxed select-all ${
                  isDark ? 'text-slate-200' : 'text-gray-900'
                }`}>
                  {donation.address}
                </div>
              </div>
              <div className={`flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${
                isDark ? 'text-slate-400' : 'text-gray-500'
              }`}>
                <Copy className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCopy}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-white rounded-xl transition-all duration-150 text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] ${
              copied
                ? isDark
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-green-600 hover:bg-green-700'
                : isDark
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Address</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className={`px-5 py-3 rounded-xl transition-all duration-150 text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] ${
              isDark
                ? 'bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
