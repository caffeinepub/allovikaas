import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VoiceSearchButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
  className?: string;
}

export default function VoiceSearchButton({
  isListening,
  isSupported,
  onStart,
  onStop,
  className = '',
}: VoiceSearchButtonProps) {
  if (!isSupported) {
    return null; // Hide button if not supported
  }

  const handleClick = () => {
    if (isListening) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClick}
            className={`absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full hover:bg-primary/10 ${className}`}
            aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
          >
            {isListening ? (
              <MicOff className="h-5 w-5 text-destructive animate-pulse" />
            ) : (
              <Mic className="h-5 w-5 text-primary" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isListening ? 'Listening...' : 'Voice search (Tamil/English)'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
