import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { PostHogProvider } from 'posthog-js/react'
import FaucetAggregator from '../FaucetAggregator.jsx'
import { trackVisitAndRetention, trackBookmarkDetection, trackSessionEngagement } from './lib/analytics'
import './index.css'

const posthogOptions = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
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

    return () => {
      clearTimeout(timer)
      cleanupEngagement()
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
