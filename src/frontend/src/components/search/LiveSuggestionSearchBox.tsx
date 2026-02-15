import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLiveSearchSuggestions } from '@/hooks/useLiveSearchSuggestions';
import { Suggestion } from '@/backend';

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
            className="h-12 pl-12 pr-24 rounded-xl border-2 border-border focus:border-primary"
            autoComplete="off"
          />
          <Button
            type="submit"
            size="lg"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 px-6 rounded-lg bg-primary hover:bg-primary-dark text-primary-foreground font-semibold"
          >
            Search
          </Button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showDropdown && value.trim().length >= 1 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-border rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
          {isLoading && (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              Loading suggestions...
            </div>
          )}
          
          {!isLoading && !hasSuggestions && (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              No suggestions found
            </div>
          )}
          
          {!isLoading && hasSuggestions && (
            <ul className="py-2">
              {suggestions.map((suggestion, index) => (
                <li key={`${suggestion.text}-${index}`}>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="w-full px-4 py-3 text-left hover:bg-accent/10 transition-colors flex items-center gap-3 group"
                  >
                    <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground group-hover:text-primary flex-1">
                      {suggestion.text}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize flex-shrink-0">
                      {getSuggestionSourceLabel(suggestion.source)}
                    </span>
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

function getSuggestionSourceLabel(source: Suggestion['source']): string {
  const sourceMap: Record<string, string> = {
    category: 'Category',
    subcategory: 'Type',
    area: 'Area',
    workerName: 'Worker',
    skill: 'Skill',
  };
  
  return sourceMap[source] || 'Result';
}
