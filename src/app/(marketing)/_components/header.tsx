'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { FileText, Menu, X } from 'lucide-react';

import { GitHubIcon } from '@/components/icons/github';
import { Button } from '@/components/ui/button';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image width={40} height={32} src="logo.svg" alt="OpenIndoorMaps" className="h-10 w-8" />
          <span className="font-semibold tracking-tight text-xl">OpenIndoorMaps</span>
        </Link>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 sm:flex">
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              Docs
            </a>
          </Button>
          <Button asChild>
            <a
              href="https://github.com/openindoormaps/openindoormaps"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5"
            >
              <GitHubIcon className="h-3.5 w-3.5 fill-current" />
              GitHub
            </a>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-border/50 bg-background/95 px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="justify-start text-muted-foreground"
            >
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Documentation
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="justify-start text-muted-foreground"
            >
              <a
                href="https://github.com/openindoormaps/openindoormaps"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <GitHubIcon className="h-4 w-4 fill-current" />
                GitHub Repository
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
