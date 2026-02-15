import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useI18n } from '@/components/i18n/I18nProvider';
import BilingualText from '@/components/i18n/BilingualText';

export default function HeaderBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useI18n();

  const appName = t('app.name');
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
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavigation('/')}
            className="flex items-center space-x-2 group"
          >
            <div className="text-xl md:text-2xl font-bold text-primary group-hover:text-primary-dark transition-colors">
              {appName?.en || 'AREA WORKARS'}
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/search')}
              className="text-base hover:text-primary hover:bg-primary/10"
            >
              {navBrowse?.en || 'Browse'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/post-job')}
              className="text-base hover:text-primary hover:bg-primary/10"
            >
              {navPostJob?.en || 'Post Job'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/blog')}
              className="text-base hover:text-primary hover:bg-primary/10"
            >
              {navBlog?.en || 'Blog'}
            </Button>
            <Button
              onClick={() => handleNavigation('/register-worker')}
              className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold"
            >
              {navRegister?.en || 'Register'}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNavigation('/admin')}
              className="border-2 hover:border-primary hover:text-primary"
            >
              {navAdmin?.en || 'Admin'}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
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
          <div className="md:hidden py-4 space-y-2 border-t border-border/60">
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/search')}
              className="w-full justify-start text-base hover:bg-primary/10"
            >
              <BilingualText
                english={<span>{navBrowse?.en || 'Browse'}</span>}
                regional={<span className="text-sm">{navBrowse?.regional || ''}</span>}
                containerClassName="flex flex-col items-start"
                regionalClassName="text-sm opacity-80"
              />
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/post-job')}
              className="w-full justify-start text-base hover:bg-primary/10"
            >
              <BilingualText
                english={<span>{navPostJob?.en || 'Post Job'}</span>}
                regional={<span className="text-sm">{navPostJob?.regional || ''}</span>}
                containerClassName="flex flex-col items-start"
                regionalClassName="text-sm opacity-80"
              />
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/blog')}
              className="w-full justify-start text-base hover:bg-primary/10"
            >
              <BilingualText
                english={<span>{navBlog?.en || 'Blog'}</span>}
                regional={<span className="text-sm">{navBlog?.regional || ''}</span>}
                containerClassName="flex flex-col items-start"
                regionalClassName="text-sm opacity-80"
              />
            </Button>
            <Button
              onClick={() => handleNavigation('/register-worker')}
              className="w-full bg-primary hover:bg-primary-dark text-primary-foreground"
            >
              <BilingualText
                english={<span>{navRegister?.en || 'Register'}</span>}
                regional={<span className="text-sm">{navRegister?.regional || ''}</span>}
                containerClassName="flex flex-col"
                regionalClassName="text-sm"
              />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNavigation('/admin')}
              className="w-full border-2"
            >
              <BilingualText
                english={<span>{navAdmin?.en || 'Admin'}</span>}
                regional={<span className="text-sm">{navAdmin?.regional || ''}</span>}
                containerClassName="flex flex-col"
                regionalClassName="text-sm"
              />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
