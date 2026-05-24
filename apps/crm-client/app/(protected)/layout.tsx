import { AuthProvider } from '../../provider/AuthProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
        <AuthProvider>
          {children}
        </AuthProvider>
  )
}