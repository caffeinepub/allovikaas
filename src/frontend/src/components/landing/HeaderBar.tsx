import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Menu, X, UserPlus, Home, Search, Briefcase, Shield } from 'lucide-react';
import { useI18n } from '@/components/i18n/I18nProvider';
import { useIsCallerAdmin } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

export default function HeaderBar() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: isAdmin } = useIsCallerAdmin();
  const { identity } = useInternetIdentity();

  const navHome = t('nav.home');
  const navBrowse = t('nav.browse');
  const navRegisterWorker = t('nav.registerWorker');
  const navAdmin = t('nav.admin');

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavigation('/')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg">
              <Search className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg font-bold text-foreground leading-tight">AREA WORKARS</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Find Workers Near You</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/')}
              className="text-foreground hover:text-primary"
            >
              <Home className="h-4 w-4 mr-2" />
              {navHome.en}
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/search')}
              className="text-foreground hover:text-primary"
            >
              <Search className="h-4 w-4 mr-2" />
              {navBrowse.en}
            </Button>
            <Button
              variant="default"
              onClick={() => handleNavigation('/register')}
              className="bg-primary hover:bg-primary-dark text-primary-foreground ml-2"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {navRegisterWorker.en}
            </Button>
            {identity && isAdmin && (
              <Button
                variant="ghost"
                onClick={() => handleNavigation('/admin')}
                className="text-foreground hover:text-primary ml-2"
              >
                <Shield className="h-4 w-4 mr-2" />
                {navAdmin.en}
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/40">
            <nav className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                onClick={() => handleNavigation('/')}
                className="justify-start text-foreground hover:text-primary"
              >
                <Home className="h-4 w-4 mr-3" />
                {navHome.en}
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleNavigation('/search')}
                className="justify-start text-foreground hover:text-primary"
              >
                <Search className="h-4 w-4 mr-3" />
                {navBrowse.en}
              </Button>
              <Button
                variant="default"
                onClick={() => handleNavigation('/register')}
                className="justify-start bg-primary hover:bg-primary-dark text-primary-foreground"
              >
                <UserPlus className="h-4 w-4 mr-3" />
                {navRegisterWorker.en}
              </Button>
              {identity && isAdmin && (
                <Button
                  variant="ghost"
                  onClick={() => handleNavigation('/admin')}
                  className="justify-start text-foreground hover:text-primary"
                >
                  <Shield className="h-4 w-4 mr-3" />
                  {navAdmin.en}
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
