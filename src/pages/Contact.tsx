
import { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';
import { useLanguage } from '@/lib/languageContext';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Define form schema with Zod for validation
const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().optional(),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactPage = () => {
  const { addContactMessage } = useStore();
  const { t, direction } = useLanguage();
  useScrollToTop();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting contact form with data:", data);
      
      // Try to add the contact message to the database
      await addContactMessage({
        name: data.name.trim(),
        email: data.email.trim(),
        subject: data.subject?.trim() || "",
        message: data.message.trim()
      });
      
      console.log("Message sent successfully");
      
      // Reset form after successful submission
      form.reset();
      
      setMessageSent(true);
      toast.success(t('messageSent'));
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('messageFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setMessageSent(false);
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
                  <p className="text-gray-600">Baydi 2</p>
                  <p className="text-gray-600">Berrechide, Morocco</p>
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
                    {t('messageSentLong', { default: "Thank you for your message. We'll get in touch with you as soon as possible." })}
                  </p>
                  <Button 
                    onClick={handleSendAnother}
                    className="bg-smartplug-blue hover:bg-smartplug-lightblue"
                  >
                    {t('sendAnotherMessage', { default: 'Send another message' })}
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6">{t('sendMessage')}</h2>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('fullName')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('yourName')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('emailTitle')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('yourEmail')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('subjectOptional')}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('subjectPlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('message', { default: 'Message' })}</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder={t('messagePlaceholder')} 
                                {...field} 
                                rows={5}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-smartplug-blue hover:bg-smartplug-lightblue flex items-center"
                      >
                        {isSubmitting ? (
                          <span className="animate-pulse">{t('processing', { default: 'Sending...' })}</span>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            {t('sendMessageButton')}
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
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
