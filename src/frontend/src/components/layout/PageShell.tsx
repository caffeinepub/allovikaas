import { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'compact';
}

/**
 * Shared page wrapper providing consistent vibrant background and spacing
 */
export default function PageShell({ children, className = '', variant = 'default' }: PageShellProps) {
  const paddingClass = variant === 'compact' ? 'py-6 md:py-10' : 'py-8 md:py-12';
  
  return (
    <div className={`relative min-h-[calc(100vh-200px)] bg-gradient-to-br from-primary/5 via-background to-secondary/5 ${paddingClass}`}>
      <div className={`container mx-auto px-4 md:px-6 ${className}`}>
        {children}
      </div>
    </div>
  );
}
