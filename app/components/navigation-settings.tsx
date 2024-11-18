import { Building2, Map } from "lucide-react";
import { useState } from "react";

export default function NavigationSettings() {
  const [includeOutdoor, setIncludeOutdoor] = useState(false);

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white py-4">
      <span className="text-sm font-medium text-gray-700">Navigation Type</span>

      <div className="flex gap-2">
        <button
          onClick={() => {
            setIncludeOutdoor(false);
          }}
          className={`flex w-full items-center gap-2 rounded-l-md px-4 py-2 transition-colors ${"bg-blue-500 text-white"}`}
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
        >
          <Map size={18} />
          <span>Outdoor</span>
        </button>
      </div>
    </div>
  );
}
