import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/next'
import FaucetAggregator from '../FaucetAggregator.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FaucetAggregator />
    <Analytics />
  </React.StrictMode>,
)
