import posthog from 'posthog-js';

// ── Faucet clicks ──────────────────────────────────────────────
export const trackFaucetOpen = (faucet) => {
  posthog.capture('faucet_opened', {
    faucet_name: faucet.name,
    faucet_chain: faucet.chain,
    faucet_testnet: faucet.testnet,
    faucet_asset: faucet.asset,
    faucet_type: faucet.type,
    faucet_url: faucet.url,
    wallet_required: faucet.walletConnectionRequired,
  });
};

// ── Search ─────────────────────────────────────────────────────
export const trackSearch = (term, resultCount) => {
  posthog.capture('search_performed', {
    search_term: term,
    result_count: resultCount,
  });
};

// ── Filters ────────────────────────────────────────────────────
export const trackFilterChange = (filterType, values) => {
  posthog.capture('filter_changed', {
    filter_type: filterType, // 'chain', 'asset', 'amount', 'type', 'safety'
    filter_values: values,
    filter_count: values.length,
  });
};

export const trackFiltersReset = () => {
  posthog.capture('filters_reset');
};

// ── Sort ───────────────────────────────────────────────────────
export const trackSort = (key, mode) => {
  posthog.capture('table_sorted', {
    sort_column: key,
    sort_direction: mode,
  });
};

// ── Navigation ─────────────────────────────────────────────────
export const trackNavClick = (item) => {
  posthog.capture('nav_clicked', {
    nav_item: item, // 'faq', 'github', 'donate', 'request_report'
  });
};

// ── FAQ ────────────────────────────────────────────────────────
export const trackFAQOpen = (question) => {
  posthog.capture('faq_opened', {
    faq_question: question,
  });
};

// ── Donate ─────────────────────────────────────────────────────
export const trackDonateModalOpen = () => {
  posthog.capture('donate_modal_opened');
};

export const trackDonateAddressCopied = () => {
  posthog.capture('donate_address_copied');
};

// ── Dark mode ──────────────────────────────────────────────────
export const trackDarkModeToggle = (isDark) => {
  posthog.capture('dark_mode_toggled', {
    dark_mode: isDark,
  });
};

// ── Returning users & bookmarks ────────────────────────────────
const VISIT_KEY = 'tfa_visits';
const FIRST_VISIT_KEY = 'tfa_first_visit';
const LAST_VISIT_KEY = 'tfa_last_visit';

export const trackVisitAndRetention = () => {
  const now = new Date().toISOString();
  const firstVisit = localStorage.getItem(FIRST_VISIT_KEY);
  const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
  const visitCount = parseInt(localStorage.getItem(VISIT_KEY) || '0', 10) + 1;

  localStorage.setItem(VISIT_KEY, visitCount.toString());
  localStorage.setItem(LAST_VISIT_KEY, now);

  if (!firstVisit) {
    // Brand new user
    localStorage.setItem(FIRST_VISIT_KEY, now);
    posthog.capture('user_first_visit', {
      visit_count: 1,
    });
  } else {
    // Returning user
    const daysSinceFirst = Math.floor(
      (Date.now() - new Date(firstVisit).getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysSinceLast = lastVisit
      ? Math.floor(
          (Date.now() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

    posthog.capture('user_returned', {
      visit_count: visitCount,
      days_since_first_visit: daysSinceFirst,
      days_since_last_visit: daysSinceLast,
    });
  }

  // Set person properties for cohort analysis
  posthog.people.set({
    visit_count: visitCount,
    first_visit: firstVisit || now,
    last_visit: now,
  });
};

export const trackBookmarkDetection = () => {
  // Detect likely bookmarked users:
  // 1. Direct navigation (no referrer, typed URL or bookmark)
  // 2. Navigation type === 'navigate' with no referrer typically = bookmark/typed
  const nav = performance.getEntriesByType('navigation')[0];
  const isDirectNavigation = !document.referrer;
  const isNavigationType = nav && nav.type === 'navigate';
  const visitCount = parseInt(localStorage.getItem(VISIT_KEY) || '1', 10);

  // High confidence bookmark: direct navigation + returning user (visited 2+ times)
  if (isDirectNavigation && isNavigationType && visitCount >= 2) {
    posthog.capture('likely_bookmarked_visit', {
      visit_count: visitCount,
      referrer: document.referrer || 'none',
      navigation_type: nav ? nav.type : 'unknown',
    });
  }

  // Always capture the entry method for analytics
  posthog.capture('page_entry', {
    referrer: document.referrer || 'none',
    navigation_type: nav ? nav.type : 'unknown',
    is_direct: isDirectNavigation,
    visit_count: visitCount,
  });
};

// ── Bookmark keyboard shortcut (Ctrl/Cmd + D) ─────────────────
export const trackBookmarkKeypress = () => {
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      posthog.capture('page_bookmarked', {
        page_url: window.location.href,
        page_title: document.title,
        timestamp: new Date().toISOString(),
      });
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
};

// ── Session engagement ─────────────────────────────────────────
export const trackSessionEngagement = () => {
  const startTime = Date.now();

  // Track time on page when user leaves
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      const duration = Math.round((Date.now() - startTime) / 1000);
      posthog.capture('session_engagement', {
        time_on_page_seconds: duration,
      });
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
};
