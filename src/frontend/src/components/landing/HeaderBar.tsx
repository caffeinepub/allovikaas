import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useI18n } from '@/components/i18n/I18nProvider';

export default function HeaderBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useI18n();

  const navHome = t('nav.home');
  const navBrowse = t('nav.browse');
  const navPostJob = t('nav.postJob');
  const navRegister = t('nav.register');
  const navAdmin = t('nav.admin');
  const navBlog = t('nav.blog');

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavigation('/')}
            className="text-xl md:text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            AREA WORKARS
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/')}
              className="text-foreground hover:text-primary"
            >
              {navHome.en}
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/search')}
              className="text-foreground hover:text-primary"
            >
              {navBrowse.en}
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/post-job')}
              className="text-foreground hover:text-primary"
            >
              {navPostJob.en}
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/blog')}
              className="text-foreground hover:text-primary"
            >
              {navBlog.en}
            </Button>
            <Button
              onClick={() => handleNavigation('/register')}
              className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold"
            >
              {navRegister.en}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNavigation('/admin')}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              {navAdmin.en}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/')}
              className="w-full justify-start text-foreground hover:text-primary"
            >
              {navHome.en}
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/search')}
              className="w-full justify-start text-foreground hover:text-primary"
            >
              {navBrowse.en}
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/post-job')}
              className="w-full justify-start text-foreground hover:text-primary"
            >
              {navPostJob.en}
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/blog')}
              className="w-full justify-start text-foreground hover:text-primary"
            >
              {navBlog.en}
            </Button>
            <Button
              onClick={() => handleNavigation('/register')}
              className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-semibold"
            >
              {navRegister.en}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNavigation('/admin')}
              className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              {navAdmin.en}
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
