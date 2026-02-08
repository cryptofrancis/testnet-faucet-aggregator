import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { PostHogProvider } from 'posthog-js/react'
import FaucetAggregator from '../FaucetAggregator.jsx'
import { trackVisitAndRetention, trackBookmarkDetection, trackBookmarkKeypress, trackSessionEngagement } from './lib/analytics'
import './index.css'

// Only track on the production domain — disable in dev and Vercel preview deployments
const isProduction = typeof window !== 'undefined' &&
  window.location.hostname === 'testnet-faucet-aggregator.vercel.app'

const posthogOptions = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2025-11-30',
  opt_out_capturing_by_default: !isProduction,
  disable_session_recording: !isProduction,
}

// Wrapper to run session-level tracking once PostHog is ready
const AppWithTracking = () => {
  useEffect(() => {
    // Small delay to ensure PostHog is initialized
    const timer = setTimeout(() => {
      trackVisitAndRetention()
      trackBookmarkDetection()
    }, 500)

    const cleanupEngagement = trackSessionEngagement()
    const cleanupBookmark = trackBookmarkKeypress()

    return () => {
      clearTimeout(timer)
      cleanupEngagement()
      cleanupBookmark()
    }
  }, [])

  return (
    <>
      <FaucetAggregator />
      <Analytics />
      <SpeedInsights />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={posthogOptions}>
      <AppWithTracking />
    </PostHogProvider>
  </React.StrictMode>,
)
