'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/upload', label: 'Upload CSV' },
    { href: '/data', label: 'Data Analysis' },
  ];

  return (
    <nav aria-label="Primary navigation" className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-xl font-bold text-foreground hover:text-foreground/80 transition-colors"
              prefetch={true}
            >
              EDA Platform
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={item.href === '/data' ? false : true}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                    pathname === item.href
                      ? 'text-foreground underline decoration-2 underline-offset-8'
                      : 'text-foreground/60'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - Theme switcher */}
          <div className="flex items-center gap-1">
            <ThemeSwitcher />
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div id="mobile-navigation" hidden={!mobileMenuOpen} className="border-t border-border md:hidden">
          <div className="flex flex-col gap-1 py-3">
            {navItems.map((item) => (
              <Link
                  key={item.href}
                  href={item.href}
                  prefetch={item.href === '/data' ? false : true}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={pathname === item.href ? 'page' : undefined}
                className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  pathname === item.href
                    ? 'text-foreground bg-foreground/10'
                    : 'text-foreground/60'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
