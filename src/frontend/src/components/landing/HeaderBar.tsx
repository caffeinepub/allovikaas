import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from '@tanstack/react-router';
import { useI18n, SupportedState } from '../i18n/I18nProvider';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function HeaderBar() {
  const navigate = useNavigate();
  const { selectedState, setSelectedState, t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const appName = t('app.name');

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-card/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate({ to: '/' })}
            className="text-xl md:text-2xl font-bold tracking-tight text-primary hover:opacity-80 transition-opacity"
          >
            {appName.en}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Select value={selectedState} onValueChange={(value) => setSelectedState(value as SupportedState)}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEFAULT">English</SelectItem>
                <SelectItem value="TN">Tamil Nadu</SelectItem>
                <SelectItem value="KA">Karnataka</SelectItem>
                <SelectItem value="KL">Kerala</SelectItem>
                <SelectItem value="AP">Andhra Pradesh</SelectItem>
                <SelectItem value="TS">Telangana</SelectItem>
                <SelectItem value="NORTH">North India</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => navigate({ to: '/search' })}
              variant="ghost"
              size="sm"
              className="text-foreground hover:text-primary"
            >
              Browse Workers
            </Button>

            <Button
              onClick={() => navigate({ to: '/post-job' })}
              variant="ghost"
              size="sm"
              className="text-foreground hover:text-primary"
            >
              I Need a Worker
            </Button>

            <Button
              onClick={() => navigate({ to: '/register-worker' })}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Register as Worker
            </Button>

            <Button
              onClick={() => navigate({ to: '/admin' })}
              variant="outline"
              size="sm"
            >
              Admin
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-border pt-4">
            <Select value={selectedState} onValueChange={(value) => setSelectedState(value as SupportedState)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEFAULT">English</SelectItem>
                <SelectItem value="TN">Tamil Nadu</SelectItem>
                <SelectItem value="KA">Karnataka</SelectItem>
                <SelectItem value="KL">Kerala</SelectItem>
                <SelectItem value="AP">Andhra Pradesh</SelectItem>
                <SelectItem value="TS">Telangana</SelectItem>
                <SelectItem value="NORTH">North India</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => {
                navigate({ to: '/search' });
                setMobileMenuOpen(false);
              }}
              variant="ghost"
              className="w-full justify-start"
            >
              Browse Workers
            </Button>

            <Button
              onClick={() => {
                navigate({ to: '/post-job' });
                setMobileMenuOpen(false);
              }}
              variant="ghost"
              className="w-full justify-start"
            >
              I Need a Worker
            </Button>

            <Button
              onClick={() => {
                navigate({ to: '/register-worker' });
                setMobileMenuOpen(false);
              }}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Register as Worker
            </Button>

            <Button
              onClick={() => {
                navigate({ to: '/admin' });
                setMobileMenuOpen(false);
              }}
              variant="outline"
              className="w-full"
            >
              Admin
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
