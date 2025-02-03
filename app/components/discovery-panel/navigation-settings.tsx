import { Accessibility, Building2, Map } from "lucide-react";
import { useState } from "react";
import { Toggle } from "../ui/toggle";
//TODO: improve ui
export default function NavigationSettings() {
  const [includeOutdoor, setIncludeOutdoor] = useState(false);
  const [isAccessibleRoute, setIsAccessibleRoute] = useState(false);

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white py-4">
      <Toggle
        variant="outline"
        onClick={() => setIsAccessibleRoute(!isAccessibleRoute)}
        disabled
      >
        <Accessibility /> Accessibility
      </Toggle>
      <span className="text-sm font-medium text-gray-700">Navigation Type</span>
      <div className="flex gap-2">
        <button
          onClick={() => {
            setIncludeOutdoor(false);
          }}
          className="flex w-full items-center gap-2 rounded-l-md bg-blue-500 px-4 py-2 text-white transition-colors"
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
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          title="Include outdoor navigation"
          disabled
        >
          <Map size={18} />
          <span>Outdoor</span>
        </button>
      </div>
      <span className="text-sm font-medium text-gray-700">Language</span>
      <select
        className="w-full rounded-md bg-gray-100 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
        disabled
      >
        <option value="en">English</option>
        <option value="de">Deutsch</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
}
