import { LucideProps } from "lucide-react";
import { Button } from "../ui/button";

interface location {
  name: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  colors: string;
}
interface TopLocationsListProps {
  locations: location[];
  onLocationClick: (name: string) => void;
}

export function TopLocationsList({
  locations,
  onLocationClick,
}: TopLocationsListProps) {
  return (
    <div className="hidden lg:grid lg:grid-cols-4 lg:justify-items-center lg:gap-1">
      {locations.map((location, index) => (
        <div className="flex flex-col items-center" key={index}>
          <Button
            className={`rounded-full shadow-sm ${location.colors} transition-shadow duration-200 hover:shadow-md`}
            variant="ghost"
            size="icon"
            title={location.name}
            onClick={() => onLocationClick(location.name)}
          >
            <location.icon size={16} />
          </Button>
          <span className="mt-1 max-w-[80px] hyphens-auto break-words text-center text-xs text-gray-600">
            {location.name}
          </span>
        </div>
      ))}
    </div>
  );
}
