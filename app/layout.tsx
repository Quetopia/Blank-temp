import './styles.css'
import './media.css'
import './rewards.css'
import RewardLayer from './RewardLayer'

export const metadata = {
  title: 'Quetopia Collab',
  description: 'AI-powered creative collaboration network',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}<RewardLayer/></body></html>
}
