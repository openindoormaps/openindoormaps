import { POI } from "~/types/poi";
import { Button } from "../ui/button";

interface SuggestionsListProps {
  suggestions: POI[];
  searchQuery: string;
  onSuggestionClick: (suggestion: POI) => void;
}

export default function SuggestionsList({
  suggestions,
  searchQuery,
  onSuggestionClick,
}: SuggestionsListProps) {
  return (
    <div className="space-y-2">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.id}
          variant="ghost"
          className="w-full justify-start text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          onMouseDown={() => onSuggestionClick(suggestion)}
        >
          {suggestion.name}
        </Button>
      ))}
      {suggestions.length === 0 && searchQuery && (
        <p className="p-2 text-sm text-gray-500 dark:text-gray-300">
          No results found
        </p>
      )}
    </div>
  );
}
