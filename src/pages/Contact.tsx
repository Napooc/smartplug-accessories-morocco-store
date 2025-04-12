
import { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';
import { useLanguage } from '@/lib/languageContext';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const ContactPage = () => {
  const { addContactMessage } = useStore();
  const { t, direction } = useLanguage();
  useScrollToTop();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  
  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() ? '' : t('nameRequired'),
      email: formData.email.trim() ? (
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? '' : t('validEmail')
      ) : t('emailRequired'),
      message: formData.message.trim() ? '' : t('messageRequired')
    };
    
    setErrors(newErrors);
    
    return !newErrors.name && !newErrors.email && !newErrors.message;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error(t('pleaseFixErrors', { default: 'Veuillez corriger les erreurs' }));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting contact form with data:", formData);
      
      // Make sure to trim all form fields
      await addContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim()
      });
      
      console.log("Message sent successfully");
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setMessageSent(true);
      toast.success(t('messageSent'));
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('messageFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">{t('contact')}</h1>
          <div className="flex items-center text-sm mt-2">
            <a href="/" className="text-gray-500 hover:text-smartplug-blue">{t('home')}</a>
            <span className="mx-2">/</span>
            <span className="font-medium">{t('contact')}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12" dir={direction}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-6">{t('getInTouch')}</h2>
            <p className="text-gray-600 mb-8">
              {t('contactIntro')}
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-full mr-4">
                  <Phone className="h-5 w-5 text-smartplug-blue" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{t('phoneTitle')}</h3>
                  <p className="text-gray-600">+212-691-772215</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 bg-green-100 rounded-full mr-4">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{t('emailTitle')}</h3>
                  <p className="text-gray-600">Bouzraranwar@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 bg-purple-100 rounded-full mr-4">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{t('addressTitle')}</h3>
                  <p className="text-gray-600">123 Techno Avenue</p>
                  <p className="text-gray-600">Casablanca, Morocco</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md border">
              {messageSent ? (
                <div className="text-center py-8">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">{t('thankYou')}</h2>
                  <p className="text-gray-600 mb-6">
                    {t('messageSent')}
                  </p>
                  <Button 
                    onClick={() => {
                      setMessageSent(false);
                    }}
                    className="bg-smartplug-blue hover:bg-smartplug-lightblue"
                  >
                    {t('sendAnotherMessage', { default: 'Envoyer un autre message' })}
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6">{t('sendMessage')}</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('fullName')}</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder={t('yourName')}
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('emailTitle')}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t('yourEmail')}
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">{t('subjectOptional')}</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder={t('subjectPlaceholder')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">{t('message', { default: 'Message' })}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t('messagePlaceholder')}
                        rows={5}
                        className={errors.message ? 'border-red-500' : ''}
                      />
                      {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-smartplug-blue hover:bg-smartplug-lightblue flex items-center"
                    >
                      {isSubmitting ? (
                        <span className="animate-pulse">{t('processing', { default: 'Envoi en cours...' })}</span>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {t('sendMessageButton')}
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
