
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
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
  
  // If already logged in, redirect to admin dashboard
  if (isAdmin) {
    navigate('/admin');
    return null;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!username.trim() || !password.trim()) {
      setError(t('requiredField', { default: 'Please enter both username and password' }));
      return;
    }
    
    // Attempt login
    const success = login(username, password);
    
    if (success) {
      toast.success(t('successMessages.login', { default: 'Login successful' }));
      navigate('/admin');
    } else {
      setError(t('errorMessages.invalidCredentials', { default: 'Invalid username or password' }));
      toast.error(t('errorMessages.invalidCredentials', { default: 'Invalid credentials' }));
    }
  };
  
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
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">{t('username', { default: 'Username' })}</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('enterUsername', { default: 'Enter username' })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">{t('password', { default: 'Password' })}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('enterPassword', { default: 'Enter password' })}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-smartplug-blue hover:bg-smartplug-lightblue"
                >
                  {t('login')}
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
