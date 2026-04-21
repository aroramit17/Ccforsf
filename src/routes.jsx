import SalesPage from './SalesPage.jsx'
import PrivacyPolicy from './PrivacyPolicy.jsx'
import TermsOfService from './TermsOfService.jsx'
import RefundPolicy from './RefundPolicy.jsx'
import Blog from './pages/Blog.jsx'
import BlogPost, { getStaticPaths as blogPostStaticPaths } from './pages/BlogPost.jsx'
import About from './pages/About.jsx'

export const routes = [
  { path: '/', element: <SalesPage />, entry: 'src/SalesPage.jsx' },
  { path: '/privacy', element: <PrivacyPolicy />, entry: 'src/PrivacyPolicy.jsx' },
  { path: '/terms', element: <TermsOfService />, entry: 'src/TermsOfService.jsx' },
  { path: '/refund', element: <RefundPolicy />, entry: 'src/RefundPolicy.jsx' },
  { path: '/about', element: <About />, entry: 'src/pages/About.jsx' },
  { path: '/blog', element: <Blog />, entry: 'src/pages/Blog.jsx' },
  { path: '/blog/:slug', element: <BlogPost />, entry: 'src/pages/BlogPost.jsx', getStaticPaths: blogPostStaticPaths },
]
