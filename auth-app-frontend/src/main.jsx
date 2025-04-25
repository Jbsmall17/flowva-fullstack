import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter as Router } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <GoogleOAuthProvider clientId="802601128189-sbi9g362su5l9rvjvc84rt3p5bcfht61.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </Router>
  </StrictMode>,
)
