import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AccessibilityProvider } from './context/AccessibilityContext.jsx'
import { JourneyProvider } from './context/JourneyContext.jsx'
import { LocationProvider } from './context/LocationContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AccessibilityProvider>
        <LocationProvider>
          <JourneyProvider>
            <App />
          </JourneyProvider>
        </LocationProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  </React.StrictMode>
)
