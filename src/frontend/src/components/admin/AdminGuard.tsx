import { ReactNode } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin } from '@/hooks/useQueries';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BilingualText from '@/components/i18n/BilingualText';

interface AdminGuardProps {
  children: ReactNode;
}

function AccessDeniedScreen() {
  const { login, loginStatus } = useInternetIdentity();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-destructive/10 rounded-full p-4">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <BilingualText
            english={<h2 className="text-2xl font-bold text-foreground">Access Denied</h2>}
            regional={<p className="text-xl font-bold text-foreground">அணுகல் மறுக்கப்பட்டது</p>}
            regionalClassName="text-xl font-bold text-foreground mt-2"
          />
          <BilingualText
            english={<p className="text-muted-foreground">You need admin privileges to access this page.</p>}
            regional={<p className="text-sm text-muted-foreground">இந்தப் பக்கத்தை அணுக உங்களுக்கு நிர்வாக அனுமதிகள் தேவை.</p>}
            regionalClassName="text-sm text-muted-foreground mt-1"
          />
        </div>
        <Button
          onClick={() => login()}
          disabled={loginStatus === 'logging-in'}
          className="w-full"
        >
          {loginStatus === 'logging-in' ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Logging in...
            </>
          ) : (
            'Login with Internet Identity'
          )}
        </Button>
      </div>
    </div>
  );
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin, isFetched } = useIsCallerAdmin();

  // Show loading state while checking authentication and admin status
  if (isInitializing || isCheckingAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated
  if (!identity) {
    return <AccessDeniedScreen />;
  }

  // Only show access denied if we've actually fetched the admin status and it's false
  if (isFetched && !isAdmin) {
    return <AccessDeniedScreen />;
  }

  // User is authenticated and is admin (or admin check hasn't completed yet), show the protected content
  return <>{children}</>;
}
