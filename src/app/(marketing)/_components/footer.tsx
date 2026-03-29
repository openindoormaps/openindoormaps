import Link from 'next/link';

import { GitHubIcon } from '@/components/icons/github';

import { siteConfig } from '@/config/site';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. Open source under the{' '}
          <Link
            href="https://github.com/openindoormaps/openindoormaps/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Apache 2.0 License
          </Link>
          .
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {/* TODO: update link */}
          <Link href="#" className="hover:text-foreground transition-colors">
            Docs
          </Link>
          <Link
            href={siteConfig.aboutMe.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <GitHubIcon className="h-4 w-4" />
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
