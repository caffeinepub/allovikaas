import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLiveSearchSuggestions } from '@/hooks/useLiveSearchSuggestions';
import { Suggestion } from '@/backend';
import { getCategoryLabel } from '@/utils/categoryLabels';
import { displayName } from '@/utils/displayName';

interface LiveSuggestionSearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onSuggestionSelect: (suggestion: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Reusable search box with live suggestions dropdown
 * Mobile-friendly with safe close behaviors (outside click, Escape)
 * 
 * Displays formatted taxonomy labels using getCategoryLabel() for categories
 * and displayName() for other values, while preserving original suggestion
 * values for navigation/search execution.
 */
export default function LiveSuggestionSearchBox({
  value,
  onChange,
  onSubmit,
  onSuggestionSelect,
  placeholder = 'Search...',
  className = '',
}: LiveSuggestionSearchBoxProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce input for backend calls (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  // Fetch suggestions with debounced value
  const { data: suggestions = [], isLoading } = useLiveSearchSuggestions(
    debouncedValue,
    showDropdown && debouncedValue.trim().length >= 1
  );

  // Show dropdown when typing
  useEffect(() => {
    if (value.trim().length >= 1) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDropdown(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    onSubmit(value);
  };

  const handleSuggestionClick = (suggestionText: string) => {
    onChange(suggestionText);
    setShowDropdown(false);
    onSuggestionSelect(suggestionText);
  };

  // Format suggestion display text based on source type
  const formatSuggestionDisplay = (suggestion: Suggestion): string => {
    // Use strict category mapping for category suggestions
    if (suggestion.source === 'category') {
      return getCategoryLabel(suggestion.text);
    }
    
    // Use general displayName for other types
    return displayName(suggestion.text);
  };

  const hasSuggestions = suggestions && suggestions.length > 0;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
          <Input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="h-12 pl-12 pr-24 rounded-xl text-base shadow-md"
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-4 h-8"
          >
            Search
          </Button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading suggestions...
            </div>
          )}

          {!isLoading && !hasSuggestions && debouncedValue.trim().length >= 3 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No suggestions found
            </div>
          )}

          {!isLoading && hasSuggestions && (
            <ul className="py-2">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3"
                  >
                    <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">
                        {formatSuggestionDisplay(suggestion)}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {suggestion.source}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
