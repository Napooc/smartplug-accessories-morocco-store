
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/lib/store';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/languageContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAdmin } = useStore();
  const { t, direction } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if there's a redirect destination
  const from = location.state?.from?.pathname || '/admin';
  
  // Get lock information from localStorage
  useEffect(() => {
    const lockedUntil = localStorage.getItem('adminLoginLocked');
    const attempts = localStorage.getItem('adminLoginAttempts');
    
    if (lockedUntil) {
      const lockUntilTime = parseInt(lockedUntil, 10);
      if (lockUntilTime > Date.now()) {
        setIsLocked(true);
        setLockTime(Math.ceil((lockUntilTime - Date.now()) / 1000));
      } else {
        localStorage.removeItem('adminLoginLocked');
        setIsLocked(false);
      }
    }
    
    if (attempts) {
      setLoginAttempts(parseInt(attempts, 10));
    }
  }, []);
  
  // Timer to update remaining lock time
  useEffect(() => {
    if (isLocked && lockTime > 0) {
      const timer = setTimeout(() => {
        setLockTime(prevTime => {
          if (prevTime <= 1) {
            setIsLocked(false);
            localStorage.removeItem('adminLoginLocked');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLocked, lockTime]);
  
  // If already logged in, redirect to admin dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate(from);
    }
  }, [isAdmin, navigate, from]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Check if account is locked
    if (isLocked) {
      setError(t('errorMessages.accountLocked', { default: 'Account temporarily locked. Please try again later.' }));
      return;
    }
    
    // Validate form
    if (!username.trim() || !password.trim()) {
      setError(t('requiredField', { default: 'Please enter both username and password' }));
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Add a small delay to prevent brute force attacks and to simulate server processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Attempt login
      const success = login(username, password);
      
      if (success) {
        toast.success(t('successMessages.login', { default: 'Login successful' }));
        // Reset login attempts on successful login
        setLoginAttempts(0);
        localStorage.removeItem('adminLoginAttempts');
        navigate(from);
      } else {
        // Increment login attempts
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('adminLoginAttempts', newAttempts.toString());
        
        // Lock account after 5 failed attempts for 3 minutes
        if (newAttempts >= 5) {
          const lockUntil = Date.now() + (3 * 60 * 1000); // 3 minutes
          localStorage.setItem('adminLoginLocked', lockUntil.toString());
          setIsLocked(true);
          setLockTime(3 * 60);
          setError(t('errorMessages.tooManyAttempts', { default: 'Too many failed attempts. Account locked for 3 minutes.' }));
        } else {
          setError(t('errorMessages.invalidCredentials', { default: 'Invalid username or password' }));
        }
        
        toast.error(t('errorMessages.invalidCredentials', { default: 'Invalid credentials' }));
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(t('errorMessages.loginFailed', { default: 'An error occurred during login' }));
      toast.error(t('errorMessages.loginFailed', { default: 'Login failed' }));
    } finally {
      setIsLoading(false);
    }
  };
  
  // If account is locked, show the remaining time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  if (isAdmin) {
    return null; // Avoid rendering while redirect happens
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
              <p className="text-gray-500 mt-2">{t('adminLoginInfo', { default: 'Secure access to admin dashboard' })}</p>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded mb-6">
                {error}
              </div>
            )}
            
            {isLocked ? (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded mb-6">
                <p className="font-medium">{t('accountLocked', { default: 'Account temporarily locked' })}</p>
                <p>{t('tryAgainIn', { default: 'Please try again in' })} {formatTime(lockTime)}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center">
                    <KeyRound size={16} className="mr-2" />
                    {t('username', { default: 'Username' })}
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('enterUsername', { default: 'Enter username' })}
                    autoComplete="username"
                    className="border-gray-300"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center">
                    <Lock size={16} className="mr-2" />
                    {t('password', { default: 'Password' })}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('enterPassword', { default: 'Enter password' })}
                      autoComplete="current-password"
                      className="pr-10 border-gray-300"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={toggleShowPassword}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-smartplug-blue hover:bg-smartplug-lightblue transition-colors"
                    disabled={isLoading || isLocked}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('processing', { default: 'Processing...' })}
                      </span>
                    ) : (
                      t('login')
                    )}
                  </Button>
                </div>
                
                <div className="text-sm text-center text-gray-500 mt-6">
                  <p>{t('secureConnection', { default: 'Secure connection' })} 🔒</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
