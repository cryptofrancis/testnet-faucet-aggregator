import { useState, useCallback } from 'react';
import { getChainLogoFallbacks, getAssetLogoFallbacks } from './logos';

/**
 * Hook to handle logo fallbacks
 * @param {string[]} fallbackSources - Array of logo URLs to try
 * @returns {[string|null, function]} - Current source URL and error handler
 */
export const useLogoFallback = (fallbackSources = []) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const currentSource = fallbackSources[currentIndex] || null;

  const handleError = useCallback((e) => {
    if (currentIndex < fallbackSources.length - 1) {
      // Try next fallback
      setCurrentIndex(prev => prev + 1);
      // Reset the image source to trigger reload
      e.target.src = fallbackSources[currentIndex + 1];
    } else {
      // All sources failed
      setHasError(true);
      e.target.style.display = 'none';
      console.warn(`All logo sources failed for:`, fallbackSources[0]);
    }
  }, [currentIndex, fallbackSources]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setHasError(false);
  }, []);

  return [currentSource, handleError, hasError, reset];
};

/**
 * Get fallback sources for a chain
 * @param {string} chain - Chain name
 * @returns {string[]} Array of logo URLs
 */
export const getChainFallbacks = (chain) => {
  return getChainLogoFallbacks(chain);
};

/**
 * Get fallback sources for an asset
 * @param {string} asset - Asset symbol
 * @returns {string[]} Array of logo URLs
 */
export const getAssetFallbacks = (asset) => {
  return getAssetLogoFallbacks(asset);
};
