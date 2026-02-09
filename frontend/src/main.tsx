import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { SettingsProvider } from './contexts/SettingsContext'
import { SavedSchemesProvider } from './contexts/SavedSchemesContext'
import { HistoryProvider } from './contexts/HistoryContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <SavedSchemesProvider>
          <HistoryProvider>
            <App />
          </HistoryProvider>
        </SavedSchemesProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>,
)
