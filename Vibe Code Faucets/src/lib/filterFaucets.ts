/**
 * Filters faucets based on search term and filter criteria
 */
export function filterFaucets(
  faucets,
  searchTerm,
  chainFilter,
  assetFilter,
  typeFilter,
  amountFilter
) {
  const term = searchTerm.trim().toLowerCase();

  return faucets.filter(faucet => {
    const matchesSearch =
      !term ||
      (faucet.name && faucet.name.toLowerCase().includes(term)) ||
      faucet.chain.toLowerCase().includes(term) ||
      faucet.testnet.toLowerCase().includes(term) ||
      faucet.asset.toLowerCase().includes(term) ||
      (faucet.notes && faucet.notes.toLowerCase().includes(term));

    const matchesChain = chainFilter.length === 0 || chainFilter.includes(faucet.chain);
    const matchesAsset = assetFilter.length === 0 || assetFilter.includes(faucet.asset);
    
    // Handle type filter: 'wallet' is special - it checks walletConnectionRequired
    let matchesType = true;
    if (typeFilter.length > 0) {
      const walletFilter = typeFilter.includes('wallet');
      const typeFilters = typeFilter.filter(t => t !== 'wallet');
      
      const matchesWallet = !walletFilter || faucet.walletConnectionRequired === true;
      const matchesTypeFilters = typeFilters.length === 0 || typeFilters.includes(faucet.type);
      
      matchesType = matchesWallet && matchesTypeFilters;
    }
    
    // If amount filter is selected, only show faucets with that specific amount
    // If no filter is selected, show all faucets (including those without amounts)
    const matchesAmount = amountFilter.length === 0 || (faucet.amount && amountFilter.includes(faucet.amount));

    return matchesSearch && matchesChain && matchesAsset && matchesType && matchesAmount;
  });
}
