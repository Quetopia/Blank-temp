import './styles.css'
import './media.css'
import SyncFX from './SyncFX'

export const metadata = {
  title: 'Quetopia Collab',
  description: 'AI-powered creative collaboration network',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}<SyncFX/></body></html>
}
