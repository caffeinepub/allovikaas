import { Component, ReactNode } from 'react';
import { getErrorMessage } from '@/utils/errors';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class RouteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Route rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error 
        ? getErrorMessage(this.state.error)
        : 'An unexpected error occurred';

      return (
        <div className="min-h-[50vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Something went wrong
            </h2>
            <p className="text-muted-foreground">
              {errorMessage}
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
