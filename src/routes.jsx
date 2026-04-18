import SalesPage from './SalesPage.jsx'
import PrivacyPolicy from './PrivacyPolicy.jsx'
import TermsOfService from './TermsOfService.jsx'
import RefundPolicy from './RefundPolicy.jsx'

export const routes = [
  { path: '/', element: <SalesPage />, entry: 'src/SalesPage.jsx' },
  { path: '/privacy', element: <PrivacyPolicy />, entry: 'src/PrivacyPolicy.jsx' },
  { path: '/terms', element: <TermsOfService />, entry: 'src/TermsOfService.jsx' },
  { path: '/refund', element: <RefundPolicy />, entry: 'src/RefundPolicy.jsx' },
]
