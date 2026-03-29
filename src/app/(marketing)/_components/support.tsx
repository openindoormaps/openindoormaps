import { Button } from '@/components/ui/button';

function Support() {
  return (
    <div className="mb-16 p-8 rounded-2xl bg-linear-to-r from-primary/5 to-accent/5 border border-primary/20 mx-auto max-w-3xl">
      <h3 className="text-2xl font-bold mb-4 text-center">Support OpenIndoorMaps</h3>
      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
        Help me keep this project free and open source by supporting my development efforts.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="outline"
          size="lg"
          asChild
          className="bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20 hover:text-white"
        >
          <a
            href="https://buymeacoffee.com/knotzer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            Buy me a coffee
          </a>
        </Button>
        <Button
          variant="outline"
          size="lg"
          asChild
          className="bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 hover:text-white"
        >
          <a
            href="https://github.com/sponsors/openindoormaps"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            GitHub Sponsor
          </a>
        </Button>
      </div>
    </div>
  );
}
export default Support;
