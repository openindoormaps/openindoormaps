import Image from 'next/image';

import { ArrowRight } from 'lucide-react';

import { GitHubIcon } from '@/components/icons/github';
import { Button } from '@/components/ui/button';

import { HeroBackground } from './hero-background';

function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16"
    >
      <HeroBackground />

      <div className="container relative z-10 mx-auto px-4 py-20 md:py-32">
        <div className="animate-fade-in mx-auto flex max-w-5xl flex-col items-center text-center">
          <Image
            src="/logo.svg"
            width={447}
            height={319}
            alt="OpenIndoorMaps"
            className="mb-4 h-26 w-26 animate-float md:h-32 md:w-32"
          />

          <h1 className="mb-2 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
            OpenIndoorMaps
          </h1>
          <h2 className="mb-4 bg-linear-to-r from-primary to-accent bg-clip-text text-2xl font-bold leading-tight text-transparent md:text-3xl lg:text-4xl">
            Open source that opens doors.
          </h2>

          <p className="mb-12 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl lg:text-2xl">
            The open-source platform that brings indoor navigation to everyone
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-auto px-8 py-3">
              Get Started
              <ArrowRight className="ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="h-auto px-8 py-3" asChild>
              <a
                href="https://github.com/openindoormaps/openindoormaps"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <GitHubIcon className="mr-2" />
                View on GitHub
              </a>
            </Button>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>Self-Hostable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span>Free</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
