import { useState, useEffect, useCallback, useRef } from 'react';

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export interface UseSpeechRecognitionOptions {
  onTranscript?: (transcript: string) => void;
  onError?: (error: string) => void;
  language?: 'ta' | 'en' | 'ta-IN' | 'en-IN';
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const { onTranscript, onError, language = 'ta-IN' } = options;
  
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognitionAPI);

    if (SpeechRecognitionAPI && !recognitionRef.current) {
      try {
        const recognition = new SpeechRecognitionAPI();
        
        // Configure recognition for Tamil/English support
        recognition.continuous = false; // Stop after one result
        recognition.interimResults = false; // Only final results
        recognition.maxAlternatives = 1;
        
        // Set language based on option
        recognition.lang = language;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          setIsListening(false);
          
          // Handle errors gracefully
          const errorMessage = event.error || 'Unknown error';
          console.warn('Speech recognition error:', errorMessage);
          
          if (onError) {
            // Provide user-friendly error messages
            let friendlyMessage = 'Voice recognition failed';
            if (errorMessage === 'no-speech') {
              friendlyMessage = 'No speech detected. Please try again.';
            } else if (errorMessage === 'audio-capture') {
              friendlyMessage = 'Microphone not available';
            } else if (errorMessage === 'not-allowed') {
              friendlyMessage = 'Microphone permission denied';
            } else if (errorMessage === 'network') {
              friendlyMessage = 'Network error. Please check your connection.';
            }
            onError(friendlyMessage);
          }
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          try {
            const results = event.results;
            if (results.length > 0) {
              const result = results[event.resultIndex];
              if (result && result[0]) {
                const transcript = result[0].transcript;
                const trimmedTranscript = transcript.trim();
                
                // Only call callback if we have actual content
                if (trimmedTranscript && onTranscript) {
                  onTranscript(trimmedTranscript);
                }
              }
            }
          } catch (error) {
            console.error('Error processing speech result:', error);
            if (onError) {
              onError('Failed to process voice input');
            }
          }
        };

        recognitionRef.current = recognition;
      } catch (error) {
        console.error('Failed to initialize speech recognition:', error);
        setIsSupported(false);
      }
    }

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [language, onTranscript, onError]);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      if (onError) {
        onError('Voice search is not supported in this browser');
      }
      return;
    }

    try {
      // Stop any existing recognition
      if (isListening) {
        recognitionRef.current.stop();
      }
      
      // Start new recognition
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
      if (onError) {
        onError('Failed to start voice recognition');
      }
    }
  }, [isSupported, isListening, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Failed to stop speech recognition:', error);
      }
    }
  }, [isListening]);

  return {
    isSupported,
    isListening,
    startListening,
    stopListening,
  };
}
