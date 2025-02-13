import { Building2, Map as MapIcon } from "lucide-react";
import { useState } from "react";
import { Theme, useTheme } from "remix-themes/build/theme-provider";

export default function NavigationSettings() {
  const [includeOutdoor, setIncludeOutdoor] = useState(false);
  const [theme, setTheme] = useTheme();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value as "light" | "dark" | "system";
    if (selectedTheme === Theme.DARK || selectedTheme === Theme.LIGHT) {
      setTheme(selectedTheme as Theme);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2 rounded-lg bg-gray-100 p-4 dark:bg-gray-900">
      <span className="text-sm font-medium dark:text-gray-200">Theme</span>
      <select
        className="w-full rounded-md bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-gray-200"
        value={theme?.toString()}
        onChange={handleThemeChange}
      >
        <option value={Theme.LIGHT}>Light</option>
        <option value={Theme.DARK}>Dark</option>
      </select>
      <span className="text-sm font-medium dark:text-gray-200">
        Navigation Type
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => {
            setIncludeOutdoor(false);
          }}
          className="flex w-full items-center gap-2 rounded-l-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          title="Search only indoor locations"
        >
          <Building2 size={18} />
          <span>Indoor</span>
        </button>

        <button
          onClick={() => {
            setIncludeOutdoor(!includeOutdoor);
          }}
          className={`flex w-full items-center gap-2 rounded-r-md px-4 py-2 transition-colors ${
            includeOutdoor
              ? "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
          title="Include outdoor navigation"
          disabled
        >
          <MapIcon size={18} />
          <span>Outdoor</span>
        </button>
      </div>
      <span className="text-sm font-medium dark:text-gray-200">Language</span>
      <select
        className="w-full rounded-md bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-gray-200"
        disabled
      >
        <option value="en">English</option>
        <option value="de">Deutsch</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
}
