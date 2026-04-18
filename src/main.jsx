import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SalesPage from './SalesPage.jsx'
import PrivacyPolicy from './PrivacyPolicy.jsx'
import TermsOfService from './TermsOfService.jsx'
import RefundPolicy from './RefundPolicy.jsx'

const path = window.location.pathname.replace(/\/+$/, '') || '/'

let Page = SalesPage
if (path === '/privacy') Page = PrivacyPolicy
else if (path === '/terms') Page = TermsOfService
else if (path === '/refund') Page = RefundPolicy

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
