
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertTriangle } from 'lucide-react';
import { useStore } from '@/lib/store';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/languageContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAdmin } = useStore();
  const { t, direction } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  
  // Check for stored login attempts
  useEffect(() => {
    const storedAttempts = sessionStorage.getItem('loginAttempts');
    const lockTime = sessionStorage.getItem('lockUntil');
    
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts));
    }
    
    if (lockTime && parseInt(lockTime) > Date.now()) {
      setIsLocked(true);
      const remainingTime = Math.ceil((parseInt(lockTime) - Date.now()) / 1000);
      setLockTimer(remainingTime);
      
      // Start countdown
      const interval = setInterval(() => {
        setLockTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsLocked(false);
            sessionStorage.removeItem('lockUntil');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, []);
  
  // If already logged in, redirect to admin dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Security: Check if account is temporarily locked
    if (isLocked) {
      setError(t('accountLocked', { default: `Account is locked. Try again in ${lockTimer} seconds.` }));
      return;
    }
    
    // Validate form
    if (!username.trim() || !password.trim()) {
      setError(t('requiredField', { default: 'Please enter both username and password' }));
      return;
    }
    
    // Prevent timing attacks by adding a small random delay
    const randomDelay = Math.floor(Math.random() * 500) + 500;
    setTimeout(() => {
      // Attempt login
      const success = login(username, password);
      
      if (success) {
        // Reset login attempts on successful login
        setLoginAttempts(0);
        sessionStorage.removeItem('loginAttempts');
        sessionStorage.removeItem('lockUntil');
        
        toast.success(t('successMessages.login', { default: 'Login successful' }));
        navigate('/admin');
      } else {
        // Increment login attempts
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        sessionStorage.setItem('loginAttempts', newAttempts.toString());
        
        // Lock account temporarily after 5 failed attempts
        if (newAttempts >= 5) {
          const lockDuration = 5 * 60 * 1000; // 5 minutes
          const lockUntil = Date.now() + lockDuration;
          sessionStorage.setItem('lockUntil', lockUntil.toString());
          setIsLocked(true);
          setLockTimer(300); // 5 minutes in seconds
          
          setError(t('accountLocked', { default: 'Too many failed attempts. Account locked for 5 minutes.' }));
          toast.error(t('errorMessages.accountLocked', { default: 'Account locked for 5 minutes' }));
          
          // Start countdown
          const interval = setInterval(() => {
            setLockTimer(prev => {
              if (prev <= 1) {
                clearInterval(interval);
                setIsLocked(false);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setError(t('errorMessages.invalidCredentials', { default: 'Invalid username or password' }));
          toast.error(t('errorMessages.invalidCredentials', { default: 'Invalid credentials' }));
        }
      }
    }, randomDelay);
  };
  
  // Format countdown timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (isAdmin) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12" dir={direction}>
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md border p-8">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
                <Lock size={24} className="text-smartplug-blue" />
              </div>
              <h1 className="text-2xl font-bold">{t('admin')} {t('login')}</h1>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded mb-6 flex items-start">
                <AlertTriangle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {isLocked && (
              <div className="bg-amber-50 border border-amber-200 text-amber-600 p-3 rounded mb-6 text-center">
                <p className="font-medium">{t('accountLocked', { default: 'Account temporarily locked' })}</p>
                <p>{t('tryAgainIn', { default: 'Try again in' })} {formatTime(lockTimer)}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">{t('username', { default: 'Username' })}</Label>
                  <Input
                    id="username"
                    name="username" // Using name to make it harder for password managers to recognize
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('enterUsername', { default: 'Enter username' })}
                    disabled={isLocked}
                    autoComplete="off" // Disable browser autofill
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">{t('password', { default: 'Password' })}</Label>
                  <Input
                    id="password"
                    name="admin-password" // Non-standard name to prevent autofill
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('enterPassword', { default: 'Enter password' })}
                    disabled={isLocked}
                    autoComplete="new-password" // Trick browsers to not autofill
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-smartplug-blue hover:bg-smartplug-lightblue"
                  disabled={isLocked}
                >
                  {isLocked ? formatTime(lockTimer) : t('login')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
