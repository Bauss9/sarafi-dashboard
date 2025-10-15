import './globals.css'
import Sidebar from '@/components/SideBar'

export const metadata = {
  title: 'Admin Dashboard - DR. SARAFI',
  description: 'Buchen ollem',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className="bg-gray-50">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}