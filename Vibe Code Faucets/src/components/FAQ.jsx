import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { trackFAQOpen } from '../lib/analytics';

const FAQ_ITEMS = [
  {
    question: 'What is a testnet faucet aggregator?',
    answer:
      'A testnet faucet aggregator is a tool that collects every known blockchain faucet into a single, searchable directory. Instead of hunting through docs and Discord servers, you can filter by chain, token, and safety level to find the faucet you need in seconds. This site aggregates faucets for Ethereum, Solana, Polygon, Bitcoin, Arbitrum, Optimism, Base, Avalanche, and dozens of other networks — all in one place.',
  },
  {
    question: 'Where can I get Sepolia faucet ETH?',
    answer:
      'You can get Sepolia faucet ETH from several sources listed here, including Alchemy, QuickNode, Google Cloud Web3, Chainlink, Infura, PoW Faucet, Polygon Faucet, and Optimism Console. Use the Chain filter above to select "Ethereum" and the Asset filter to select "ETH" to see all available Sepolia faucet options with their amounts and requirements.',
  },
  {
    question: 'Where can I get Holesky faucet ETH?',
    answer:
      'Holesky is Ethereum\'s staking testnet. You can get Holesky faucet ETH from QuickNode (requires account and wallet connection). Filter by Chain → Ethereum and look for the "Holesky" testnet in the results. Holesky is primarily used for testing validator and staking operations.',
  },
  {
    question: 'Where can I find a Solana devnet faucet?',
    answer:
      'The official Solana devnet faucet is available at faucet.solana.com and requires GitHub authentication. You can also use Sol Faucet (solfaucet.com) which supports both Solana Devnet and Testnet without sign-up. Google Cloud Web3 also provides Solana Devnet PYUSD. Filter by Chain → Solana above to see all options.',
  },
  {
    question: 'Where can I get Polygon Amoy faucet tokens?',
    answer:
      'Polygon Amoy testnet tokens (POL, WETH, USDC) are available through the official Polygon Faucet (no wallet connection needed), Alchemy (account required), and QuickNode. The Polygon Faucet at faucet.polygon.technology is the easiest option — it only requires your wallet address. Use the Chain filter → Polygon to see all Amoy faucet sources.',
  },
  {
    question: 'How do I get testnet ETH?',
    answer:
      'Testnet ETH is available on multiple networks: Sepolia, Holesky, and Hoodi for Ethereum; plus L2 testnets like Arbitrum Sepolia, Optimism Sepolia, Base Sepolia, and more. The easiest way is to use the Asset filter above and select "ETH" to see every faucet across all chains. Faucets marked "Address Only" are the safest — they only need your wallet address, no signatures or approvals.',
  },
  {
    question: 'How do I get testnet USDC?',
    answer:
      'Testnet USDC is available through Circle\'s official faucet (faucet.circle.com) for Ethereum Sepolia, Arbitrum Sepolia, Optimism Sepolia, and Base Sepolia — all without wallet connection. The Polygon Faucet also provides USDC for Ethereum Sepolia and Polygon Amoy. Filter by Asset → USDC above to see every source and their rate limits.',
  },
  {
    question: 'What do "Address Only" and "Wallet Required" mean?',
    answer:
      'Faucets marked "Address Only" only need you to paste your wallet address — they never ask you to connect a wallet or sign transactions. These are the safest option. Faucets marked "Wallet Required" need you to connect your wallet (e.g. MetaMask), which means the site could potentially request signatures. The Safety filter above lets you quickly show only address-only faucets if you prefer the safest option.',
  },
  {
    question: 'What does the verified badge mean?',
    answer:
      'The green shield icon next to a faucet name indicates it\'s an official faucet — operated by the chain team, a major infrastructure provider (Alchemy, Infura, Google Cloud, Circle), or a well-known third party. Official faucets are generally more reliable and trustworthy. Community faucets are contributed by independent developers and may have different availability.',
  },
  {
    question: 'Is this site safe to use? Does it connect to my wallet?',
    answer:
      'This site is a directory of links only — it never connects to your wallet, never asks for signatures, and never distributes tokens directly. When you click "Open" on a faucet, it takes you to the external faucet site in a new tab. We recommend using the "Address Only" safety filter to find faucets that don\'t require wallet connections.',
  },
];

const FAQItem = ({ question, answer, isDark }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border-b last:border-b-0 ${
      isDark ? 'border-slate-800' : 'border-slate-200'
    }`}>
      <button
        onClick={() => { if (!isOpen) trackFAQOpen(question); setIsOpen(!isOpen); }}
        className={`w-full flex items-center justify-between gap-4 py-4 px-1 text-left transition-colors duration-150 ${
          isDark
            ? 'hover:text-slate-100'
            : 'hover:text-slate-900'
        }`}
      >
        <h3 className={`text-sm font-semibold ${
          isDark ? 'text-slate-200' : 'text-slate-800'
        }`}>
          {question}
        </h3>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        } ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${
        isOpen ? 'max-h-96 pb-4' : 'max-h-0'
      }`}>
        <p className={`text-sm leading-relaxed px-1 ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          {answer}
        </p>
      </div>
    </div>
  );
};

export const FAQ = ({ isDark }) => {
  return (
    <section id="faq" className="mt-16 mb-8">
      <h2 className={`text-xl font-bold tracking-tight mb-6 ${
        isDark ? 'text-slate-100' : 'text-slate-900'
      }`}>
        Frequently Asked Questions
      </h2>
      <div className={`rounded-lg border px-5 ${
        isDark
          ? 'bg-slate-900/50 border-slate-800'
          : 'bg-white border-slate-200'
      }`}>
        {FAQ_ITEMS.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            isDark={isDark}
          />
        ))}
      </div>
    </section>
  );
};
