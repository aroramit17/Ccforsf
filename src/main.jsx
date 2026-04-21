import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes.jsx'
import { injectSpeedInsights } from '@vercel/speed-insights'

injectSpeedInsights()

export const createRoot = ViteReactSSG({ routes })
