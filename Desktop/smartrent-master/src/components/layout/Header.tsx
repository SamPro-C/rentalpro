
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

export default function Header() {
  return (
    // Use styles consistent with the landing page's <nav>
    <header className="fixed top-0 left-0 right-0 z-[1000] py-4 transition-all duration-300 ease-in-out bg-[--bg-glass] backdrop-blur-md border-b border-[--border]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-12"> {/* Removed justify-between */}
          <Link href="/" className="logo flex items-center gap-3 text-2xl font-extrabold" style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundImage: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
            {/* Using styles directly for the gradient text */}
            <i className="fas fa-building text-xl" style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundImage: 'linear-gradient(135deg, var(--primary), var(--accent))' }}></i>
            SmartRent
          </Link>
          {/* Replaced nav with div and added ml-auto to push buttons to the right */}
          <div className="flex items-center space-x-2 ml-auto">
            <Button asChild variant="ghost" className="text-[--text-secondary] hover:text-[--text-primary] px-4 py-2 rounded-md">
              <Link href="/auth?tab=login">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Link>
            </Button>
            <Button
              asChild
              className="bg-[--accent] hover:bg-[--accent-light] text-white font-semibold px-4 py-2 rounded-md shadow-[var(--glow)] transition-transform duration-200 hover:scale-105"
            >
              <Link href="/auth?tab=register">
                <UserPlus className="mr-2 h-4 w-4" /> Register
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
