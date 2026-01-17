# Icon Coverage Report

## Logo Sources (in priority order)

1. **CoinGecko**: `https://assets.coingecko.com/coins/images/{id}/small/{name}.png`
   - High quality, official source
   - Good coverage for major cryptocurrencies

2. **Uniswap Assets**: `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/{chain}/info/logo.png`
   - Comprehensive coverage for EVM chains
   - Community-maintained

3. **TrustWallet Assets**: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/{chain}/info/logo.png`
   - Good coverage for non-EVM chains
   - Community-maintained

4. **CoinMarketCap**: `https://s2.coinmarketcap.com/static/img/coins/128x128/{id}.png`
   - Official source for major coins
   - Reliable CDN

5. **CryptoIcons API**: `https://cryptoicons.org/api/icon/{symbol}/200`
   - Fallback API for missing icons
   - Supports most major tokens

6. **Project-specific URLs**: Direct links to project websites
   - For newer/lesser-known chains (0g, Movement, Somnia)

## Implementation

All chains and assets now have:
- **Primary source**: First URL in the fallback array
- **Backup source 1**: Second URL (CoinGecko, Uniswap, or TrustWallet)
- **Backup source 2**: Third URL (CryptoIcons API or alternative CDN)

## Automatic Fallback

The application automatically tries fallback sources if the primary fails:
- Components use `LogoWithFallback` component
- On image load error, automatically tries next source
- Falls back to text initial if all sources fail

## Chain Coverage

All 29 chains have logo coverage:
- ✅ Ethereum, Solana, TRON, Polygon, Arbitrum, Optimism, Base
- ✅ BSC, Avalanche, zkSync, Starknet, Scroll, Linea, Mantle
- ✅ Blast, Sui, Aptos, Near, Cosmos, Polkadot, Fantom
- ✅ Algorand, XRP Ledger, Injective, MANTRA, Celo
- ✅ 0g, Movement, Somnia

## Asset Coverage

All 27 assets have logo coverage:
- ✅ ETH, SOL, TRX, MATIC, BNB, AVAX, MNT, SUI, APT
- ✅ NEAR, ATOM, WND, ROC, FTM, USDC, USDT, LINK
- ✅ ARB, OP, BASE, ZKSYNC, SCROLL, LINEA, BLAST, ALGO
- ✅ XRP, PYUSD, EIGEN, INJ, OM, CELO, OG, MOVE, STT

## Testing

To verify icon coverage, check the browser console for:
- Warnings when primary source fails
- Successful fallback to backup sources
- Final fallback to text initial if all fail

## Adding New Icons

When adding new chains/assets:
1. Add primary source to `CHAIN_LOGO_MAP` or `ASSET_LOGO_MAP`
2. Add at least one backup source (preferably 2-3)
3. Test in development to ensure sources load correctly
