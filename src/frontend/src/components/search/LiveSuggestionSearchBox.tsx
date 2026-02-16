import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLiveSearchSuggestions } from '@/hooks/useLiveSearchSuggestions';
import { getCategoryLabel } from '@/utils/categoryLabels';
import { displayName } from '@/utils/displayName';
import { cn } from '@/lib/utils';

interface LiveSuggestionSearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (query: string) => void;
  onSuggestionSelect: (suggestion: string) => void;
  placeholder?: string;
  className?: string;
}

export default function LiveSuggestionSearchBox({
  value,
  onChange,
  onSubmit,
  onSuggestionSelect,
  placeholder = 'Search for workers, skills, or services...',
  className,
}: LiveSuggestionSearchBoxProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: suggestions = [], isLoading } = useLiveSearchSuggestions(value);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show suggestions when input changes
  useEffect(() => {
    if (value.length >= 3) {
      setShowSuggestions(true);
      setHighlightedIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      setShowSuggestions(false);
      onSubmit(value.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    onSuggestionSelect(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          e.preventDefault();
          handleSuggestionClick(suggestions[highlightedIndex].text);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Format suggestion display text based on source
  const formatSuggestionText = (suggestion: { text: string; source: string }): string => {
    // For categories, use the centralized category label mapping
    if (suggestion.source === 'category') {
      return getCategoryLabel(suggestion.text);
    }
    
    // For other types, use displayName formatter
    return displayName(suggestion.text);
  };

  const getSuggestionIcon = (source: string): string => {
    switch (source) {
      case 'category':
        return '📂';
      case 'subcategory':
        return '📋';
      case 'area':
        return '📍';
      case 'workerName':
        return '👤';
      case 'skill':
        return '⚡';
      default:
        return '🔍';
    }
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="pl-12 pr-24 h-14 text-base rounded-full border-2 focus:border-primary"
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6"
            disabled={!value.trim()}
          >
            Search
          </Button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (value.length >= 3) && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {isLoading ? (
            <div className="p-4 flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading suggestions...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto">
              {suggestions.map((suggestion, index) => {
                const displayText = formatSuggestionText(suggestion);
                
                return (
                  <li key={`${suggestion.source}-${suggestion.text}-${index}`}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className={cn(
                        'w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3',
                        highlightedIndex === index && 'bg-accent'
                      )}
                    >
                      <span className="text-xl">{getSuggestionIcon(suggestion.source)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground truncate">
                          {displayText}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {suggestion.source.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
