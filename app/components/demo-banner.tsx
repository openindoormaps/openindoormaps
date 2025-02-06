import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";

export default function DemoBanner() {
  return (
    <Alert className="inset-x-0 bottom-0 rounded-b-none border-t border-blue-300 bg-blue-100 px-4 py-2 dark:border-blue-700 dark:bg-blue-900">
      <AlertDescription className="flex items-center justify-between text-xs text-blue-700 dark:text-blue-300">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">
            Demo Release
            <span className="hidden sm:inline">: Indoor Map Viewer</span>
          </span>
          <span className="hidden sm:inline">
            Under Active Development - We welcome your bug reports and feature
            requests.
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            data-tally-open="3EZr0o"
            className="h-6 bg-blue-200 px-2 text-xs text-blue-800 hover:bg-blue-300 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700"
          >
            Provide Feedback
          </Button>
          <a
            href="https://github.com/openindoormap/openindoormaps"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <img
              src="https://img.shields.io/github/stars/openindoormap/openindoormaps"
              alt="GitHub stars"
              className="h-6"
            />
          </a>
        </div>
      </AlertDescription>
    </Alert>
  );
}
