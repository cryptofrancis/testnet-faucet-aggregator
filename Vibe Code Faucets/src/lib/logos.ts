// Logo sources (in priority order):
// 1. CoinGecko: https://assets.coingecko.com/coins/images/{id}/small/{name}.png
// 2. Uniswap Assets: https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/{chain}/info/logo.png
// 3. TrustWallet Assets: https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/{chain}/info/logo.png
// 4. CoinMarketCap: https://s2.coinmarketcap.com/static/img/coins/128x128/{id}.png
// 5. CryptoIcons API: https://cryptoicons.org/api/icon/{symbol}/200
// 6. Simplr-sh/coin-logos (via jsDelivr): https://cdn.jsdelivr.net/gh/simplr-sh/coin-logos@main/{symbol}.png

// Chain logos with primary source and backups
const CHAIN_LOGO_MAP = {
  'Ethereum': [
    'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/info/logo.png',
    'https://cryptoicons.org/api/icon/eth/200',
  ],
  'Solana': [
    'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
    'https://cryptoicons.org/api/icon/sol/200',
  ],
  'TRON': [
    'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/128x128/1958.png',
    'https://cryptoicons.org/api/icon/trx/200',
  ],
  'Polygon': [
    'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/polygon/info/logo.png',
    'https://cryptoicons.org/api/icon/matic/200',
  ],
  'Arbitrum': [
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/arbitrum/info/logo.png',
    'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
    'https://cryptoicons.org/api/icon/arb/200',
  ],
  'Optimism': [
    'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/optimism/info/logo.png',
    'https://cryptoicons.org/api/icon/op/200',
  ],
  'Base': [
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/base/info/logo.png',
    'https://assets.coingecko.com/coins/images/27508/small/base.png',
    'https://cryptoicons.org/api/icon/base/200',
  ],
  'BSC': [
    'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/smartchain/info/logo.png',
    'https://cryptoicons.org/api/icon/bnb/200',
  ],
  'Avalanche': [
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/avalanchec/info/logo.png',
    'https://assets.coingecko.com/coins/images/12559/small/avalanche-avax-logo.png',
    'https://cryptoicons.org/api/icon/avax/200',
  ],
  'zkSync': [
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/zksync/info/logo.png',
    'https://assets.coingecko.com/coins/images/25784/small/zksync.png',
    'https://cryptoicons.org/api/icon/zksync/200',
  ],
  'Starknet': [
    'https://assets.coingecko.com/coins/images/26433/small/starknet.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/starknet/info/logo.png',
    'https://cryptoicons.org/api/icon/strk/200',
  ],
  'Scroll': [
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/scroll/info/logo.png',
    'https://assets.coingecko.com/coins/images/31031/small/scroll_logo.png',
    'https://cryptoicons.org/api/icon/scroll/200',
  ],
  'Linea': [
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/linea/info/logo.png',
    'https://assets.coingecko.com/coins/images/31011/small/linea.png',
    'https://cryptoicons.org/api/icon/linea/200',
  ],
  'Mantle': [
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/mantle/info/logo.png',
    'https://assets.coingecko.com/coins/images/30980/small/mantle.png',
    'https://cryptoicons.org/api/icon/mnt/200',
  ],
  'Blast': [
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/blast/info/logo.png',
    'https://assets.coingecko.com/coins/images/35481/small/blast.png',
    'https://cryptoicons.org/api/icon/blast/200',
  ],
  'Sui': [
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/sui/info/logo.png',
    'https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg',
    'https://cryptoicons.org/api/icon/sui/200',
  ],
  'Aptos': [
    'https://assets.coingecko.com/coins/images/26455/small/aptos_round.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/aptos/info/logo.png',
    'https://cryptoicons.org/api/icon/apt/200',
  ],
  'Near': [
    'https://assets.coingecko.com/coins/images/10365/small/near_icon.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/near/info/logo.png',
    'https://cryptoicons.org/api/icon/near/200',
  ],
  'Cosmos': [
    'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/cosmos/info/logo.png',
    'https://cryptoicons.org/api/icon/atom/200',
  ],
  'Polkadot': [
    'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/polkadot/info/logo.png',
    'https://cryptoicons.org/api/icon/dot/200',
  ],
  'Fantom': [
    'https://assets.coingecko.com/coins/images/4001/small/Fantom.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/fantom/info/logo.png',
    'https://cryptoicons.org/api/icon/ftm/200',
  ],
  'Algorand': [
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/algorand/info/logo.png',
    'https://assets.coingecko.com/coins/images/4380/small/algorand-algo-logo.png',
    'https://cryptoicons.org/api/icon/algo/200',
  ],
  'XRP Ledger': [
    'https://s2.coinmarketcap.com/static/img/coins/128x128/52.png',
    'https://assets.coingecko.com/coins/images/11044/small/1200px-XRP_symbol_logo_2016.svg.png',
    'https://cryptoicons.org/api/icon/xrp/200',
  ],
  'Injective': [
    'https://assets.coingecko.com/coins/images/12882/small/injective-logo.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/injective/info/logo.png',
    'https://cryptoicons.org/api/icon/inj/200',
  ],
  'MANTRA': [
    'https://assets.coingecko.com/coins/images/12151/small/OM_Token.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/mantra/info/logo.png',
    'https://cryptoicons.org/api/icon/om/200',
  ],
  'Celo': [
    'https://assets.coingecko.com/coins/images/11090/small/icon-celo-CELO-color-500.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/celo/info/logo.png',
    'https://cryptoicons.org/api/icon/celo/200',
  ],
  '0g': [
    'https://s2.coinmarketcap.com/static/img/coins/128x128/27974.png',
    'https://assets.coingecko.com/coins/images/35639/small/0G.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/0g/info/logo.png',
    'https://cryptoicons.org/api/icon/0g/200',
  ],
  'Movement': [
    'https://cdn.brandfetch.io/id4ID9WeGz/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1762011710826',
    'https://s2.coinmarketcap.com/static/img/coins/128x128/27939.png',
    'https://assets.coingecko.com/coins/images/39168/small/movement.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/movement/info/logo.png',
    'https://cryptoicons.org/api/icon/move/200',
  ],
  'Somnia': [
    'https://s2.coinmarketcap.com/static/img/coins/128x128/31517.png',
    'https://assets.coingecko.com/coins/images/39169/small/somnia.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/somnia/info/logo.png',
    'https://cryptoicons.org/api/icon/stt/200',
  ],
  'TON': [
    'https://cryptologos.cc/logos/toncoin-ton-logo.svg?v=040',
    'https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png',
    'https://s2.coinmarketcap.com/static/img/coins/128x128/11419.png',
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ton/info/logo.png',
    'https://cryptoicons.org/api/icon/ton/200',
  ],
  'Zcash': [
    'https://assets.coingecko.com/coins/images/486/small/zcash.png',
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/zcash/info/logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/128x128/1437.png',
    'https://cryptoicons.org/api/icon/zec/200',
  ],
  'ZetaChain': [
    'https://assets.coingecko.com/coins/images/31271/small/ZetaChain.png',
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/zetachain/info/logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/128x128/31271.png',
    'https://cryptoicons.org/api/icon/zeta/200',
  ],
  'Bitcoin': [
    'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/128x128/1.png',
    'https://cryptoicons.org/api/icon/btc/200',
  ],
  // Chainlink is a token, not a chain, but adding for completeness
  'Chainlink': [
    'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png',
    'https://cryptoicons.org/api/icon/link/200',
  ],
};

// Asset logos with primary source and backups
const ASSET_LOGO_MAP = {
  'ETH': [
    'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/info/logo.png',
    'https://cryptoicons.org/api/icon/eth/200',
  ],
  'SOL': [
    'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
    'https://cryptoicons.org/api/icon/sol/200',
  ],
  'TRX': [
    'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/128x128/1958.png',
    'https://cryptoicons.org/api/icon/trx/200',
  ],
  'MATIC': [
    'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/polygon/info/logo.png',
    'https://cryptoicons.org/api/icon/matic/200',
  ],
  'POL': [
    'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/polygon/info/logo.png',
    'https://cryptoicons.org/api/icon/matic/200',
  ],
  'BNB': [
    'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/smartchain/info/logo.png',
    'https://cryptoicons.org/api/icon/bnb/200',
  ],
  'AVAX': [
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/avalanchec/info/logo.png',
    'https://assets.coingecko.com/coins/images/12559/small/avalanche-avax-logo.png',
    'https://cryptoicons.org/api/icon/avax/200',
  ],
  'MNT': [
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/mantle/info/logo.png',
    'https://assets.coingecko.com/coins/images/30980/small/mantle.png',
    'https://cryptoicons.org/api/icon/mnt/200',
  ],
  'SUI': [
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/sui/info/logo.png',
    'https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg',
    'https://cryptoicons.org/api/icon/sui/200',
  ],
  'APT': [
    'https://assets.coingecko.com/coins/images/26455/small/aptos_round.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/aptos/info/logo.png',
    'https://cryptoicons.org/api/icon/apt/200',
  ],
  'NEAR': [
    'https://assets.coingecko.com/coins/images/10365/small/near_icon.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/near/info/logo.png',
    'https://cryptoicons.org/api/icon/near/200',
  ],
  'ATOM': [
    'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/cosmos/info/logo.png',
    'https://cryptoicons.org/api/icon/atom/200',
  ],
  'WND': [
    'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/polkadot/info/logo.png',
    'https://cryptoicons.org/api/icon/dot/200',
  ],
  'ROC': [
    'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/polkadot/info/logo.png',
    'https://cryptoicons.org/api/icon/dot/200',
  ],
  'FTM': [
    'https://assets.coingecko.com/coins/images/4001/small/Fantom.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/fantom/info/logo.png',
    'https://cryptoicons.org/api/icon/ftm/200',
  ],
  'USDC': [
    'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    'https://cryptoicons.org/api/icon/usdc/200',
  ],
  'USDT': [
    'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    'https://cryptoicons.org/api/icon/usdt/200',
  ],
  'WETH': [
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    'https://assets.coingecko.com/coins/images/2518/small/weth.png',
    'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    'https://cryptoicons.org/api/icon/weth/200',
  ],
  'LINK': [
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png',
    'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
    'https://cryptoicons.org/api/icon/link/200',
  ],
  // Additional chain-specific tokens (using chain logos as token logos)
  'ARB': [
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/arbitrum/info/logo.png',
    'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
    'https://cryptoicons.org/api/icon/arb/200',
  ],
  'OP': [
    'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/optimism/info/logo.png',
    'https://cryptoicons.org/api/icon/op/200',
  ],
  'BASE': [
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/base/info/logo.png',
    'https://assets.coingecko.com/coins/images/27508/small/base.png',
    'https://cryptoicons.org/api/icon/base/200',
  ],
  'ZKSYNC': [
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/zksync/info/logo.png',
    'https://assets.coingecko.com/coins/images/25784/small/zksync.png',
    'https://cryptoicons.org/api/icon/zksync/200',
  ],
  'SCROLL': [
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/scroll/info/logo.png',
    'https://assets.coingecko.com/coins/images/31031/small/scroll_logo.png',
    'https://cryptoicons.org/api/icon/scroll/200',
  ],
  'LINEA': [
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/linea/info/logo.png',
    'https://assets.coingecko.com/coins/images/31011/small/linea.png',
    'https://cryptoicons.org/api/icon/linea/200',
  ],
  'BLAST': [
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/blast/info/logo.png',
    'https://assets.coingecko.com/coins/images/35481/small/blast.png',
    'https://cryptoicons.org/api/icon/blast/200',
  ],
  'ALGO': [
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/algorand/info/logo.png',
    'https://assets.coingecko.com/coins/images/4380/small/algorand-algo-logo.png',
    'https://cryptoicons.org/api/icon/algo/200',
  ],
  'XRP': [
    'https://s2.coinmarketcap.com/static/img/coins/128x128/52.png',
    'https://assets.coingecko.com/coins/images/11044/small/1200px-XRP_symbol_logo_2016.svg.png',
    'https://cryptoicons.org/api/icon/xrp/200',
  ],
  'PYUSD': [
    '/pyusd-white-p.svg',
    'https://svgicons.com/img/213765/.svg',
    'https://cdn.cryptologos.cc/logos/paypal-usd-pyusd-logo.svg',
    'https://s2.coinmarketcap.com/static/img/coins/128x128/31917.png',
    'https://assets.coingecko.com/coins/images/31066/thumb/pyusd.png',
    'https://assets.coingecko.com/coins/images/31066/small/pyusd.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6c3ea9036406852006290770BEdFcAbA0e23A0e8/logo.png',
    'https://cryptoicons.org/api/icon/pyusd/200',
  ],
  'EIGEN': [
    '/eigenlayer-white-e.svg',
    'https://s2.coinmarketcap.com/static/img/coins/128x128/23430.png',
    'https://assets.coingecko.com/coins/images/38168/thumb/eigenlayer.png',
    'https://assets.coingecko.com/coins/images/38168/small/eigenlayer.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xd9F4420B68f31586D318Ab6a7e57383509a8F5C3/logo.png',
    'https://cryptoicons.org/api/icon/eigen/200',
  ],
  'INJ': [
    'https://assets.coingecko.com/coins/images/12882/small/injective-logo.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/injective/info/logo.png',
    'https://cryptoicons.org/api/icon/inj/200',
  ],
  'OM': [
    'https://assets.coingecko.com/coins/images/12151/small/OM_Token.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/mantra/info/logo.png',
    'https://cryptoicons.org/api/icon/om/200',
  ],
  'CELO': [
    'https://assets.coingecko.com/coins/images/11090/small/icon-celo-CELO-color-500.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/celo/info/logo.png',
    'https://cryptoicons.org/api/icon/celo/200',
  ],
  'OG': [
    'https://s2.coinmarketcap.com/static/img/coins/128x128/27974.png',
    'https://assets.coingecko.com/coins/images/35639/small/0G.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/0g/info/logo.png',
    'https://cryptoicons.org/api/icon/0g/200',
  ],
  'MOVE': [
    'https://cdn.brandfetch.io/id4ID9WeGz/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1762011710826',
    'https://s2.coinmarketcap.com/static/img/coins/128x128/27939.png',
    'https://assets.coingecko.com/coins/images/39168/small/movement.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/movement/info/logo.png',
    'https://cryptoicons.org/api/icon/move/200',
  ],
  'STT': [
    'https://s2.coinmarketcap.com/static/img/coins/128x128/31517.png',
    'https://assets.coingecko.com/coins/images/39169/small/somnia.png',
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/somnia/info/logo.png',
    'https://cryptoicons.org/api/icon/stt/200',
  ],
  'TON': [
    'https://cryptologos.cc/logos/toncoin-ton-logo.svg?v=040',
    'https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png',
    'https://s2.coinmarketcap.com/static/img/coins/128x128/11419.png',
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ton/info/logo.png',
    'https://cryptoicons.org/api/icon/ton/200',
  ],
  'TOS': [
    'https://cryptoicons.org/api/icon/tos/200',
    'https://s2.coinmarketcap.com/static/img/coins/128x128/11419.png',
  ],
  'ZEC': [
    'https://assets.coingecko.com/coins/images/486/small/zcash.png',
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/zcash/info/logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/128x128/1437.png',
    'https://cryptoicons.org/api/icon/zec/200',
  ],
  'ZETA': [
    'https://assets.coingecko.com/coins/images/31271/small/ZetaChain.png',
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/zetachain/info/logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/128x128/31271.png',
    'https://cryptoicons.org/api/icon/zeta/200',
  ],
  'BTC': [
    'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/128x128/1.png',
    'https://cryptoicons.org/api/icon/btc/200',
  ],
};

/**
 * Get chain logo with fallback support
 * @param {string} chain - Chain name
 * @param {number} fallbackIndex - Index of fallback source (0 = primary, 1 = first backup, etc.)
 * @returns {string|null} Logo URL or null if not found
 */
export const getChainLogo = (chain, fallbackIndex = 0) => {
  const sources = CHAIN_LOGO_MAP[chain];
  if (!sources) return null;
  return sources[fallbackIndex] || sources[0] || null;
};

/**
 * Get asset logo with fallback support
 * @param {string} asset - Asset symbol
 * @param {number} fallbackIndex - Index of fallback source (0 = primary, 1 = first backup, etc.)
 * @returns {string|null} Logo URL or null if not found
 */
export const getAssetLogo = (asset, fallbackIndex = 0) => {
  const sources = ASSET_LOGO_MAP[asset];
  if (!sources) return null;
  return sources[fallbackIndex] || sources[0] || null;
};

/**
 * Get all available fallback sources for a chain
 * @param {string} chain - Chain name
 * @returns {string[]} Array of logo URLs (empty if not found)
 */
export const getChainLogoFallbacks = (chain) => {
  return CHAIN_LOGO_MAP[chain] || [];
};

/**
 * Get all available fallback sources for an asset
 * @param {string} asset - Asset symbol
 * @returns {string[]} Array of logo URLs (empty if not found)
 */
export const getAssetLogoFallbacks = (asset) => {
  return ASSET_LOGO_MAP[asset] || [];
};
