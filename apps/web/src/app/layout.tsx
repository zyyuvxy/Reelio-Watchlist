import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../lib/auth-context';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Reelio - Personal Cinema Watchlist',
  description: 'Aplikasi web retro-pop indie cinema untuk mengelola daftar tontonan film dan serial Anda.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-[#FEFFE0] text-[#241B21] min-h-screen flex flex-col font-sans selection:bg-[#35C1C2] selection:text-[#241B21]">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>
          <footer className="w-full bg-[#FEFFE0] border-t-2 border-[#241B21] py-6 text-center text-xs font-mono text-[#62535E]">
            <p>© {new Date().getFullYear()} Reelio • Personal Cinema & TV Series Watchlist</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
