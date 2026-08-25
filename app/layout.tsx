import './styles.css'

export const metadata = {
  title: 'Quetopia Collab',
  description: 'AI-powered creative collaboration network',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
