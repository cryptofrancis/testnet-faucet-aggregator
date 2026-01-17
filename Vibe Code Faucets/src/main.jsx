import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import FaucetAggregator from '../FaucetAggregator.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FaucetAggregator />
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>,
)
