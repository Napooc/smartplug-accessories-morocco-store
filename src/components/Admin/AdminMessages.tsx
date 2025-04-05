
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Mail, Trash2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

const AdminMessages = () => {
  const { contactMessages, deleteContactMessage } = useStore();
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  
  // Group messages by date
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  const groupedMessages = {
    today: contactMessages.filter(message => message.date === today),
    yesterday: contactMessages.filter(message => message.date === yesterday),
    older: contactMessages.filter(message => message.date !== today && message.date !== yesterday)
  };
  
  const toggleMessage = (messageId: string) => {
    if (expandedMessage === messageId) {
      setExpandedMessage(null);
    } else {
      setExpandedMessage(messageId);
    }
  };
  
  const renderMessageGroup = (messages: typeof contactMessages, title: string) => {
    if (messages.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
        <ul className="divide-y border rounded-lg overflow-hidden">
          {messages.map((message) => (
            <li key={message.id} className="p-0 bg-white">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                onClick={() => toggleMessage(message.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h4 className="font-medium">{message.subject || 'No Subject'}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span>
                          From {message.name} ({message.email})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {expandedMessage === message.id ? 
                      <ChevronDown size={18} /> : 
                      <ChevronRight size={18} />
                    }
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete message</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this message? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() => {
                            deleteContactMessage(message.id);
                            toast.success("Message deleted successfully");
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              
              {expandedMessage === message.id && (
                <div className="px-4 pb-4 pt-1">
                  <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                    {message.message}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-smartplug-blue border-smartplug-blue flex items-center"
                      onClick={() => {
                        window.location.href = `mailto:${message.email}?subject=Re: ${message.subject || 'Your SmartPlug Inquiry'}`;
                      }}
                    >
                      <Mail size={16} className="mr-1" />
                      Reply by Email
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  if (contactMessages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
        <div className="p-4 flex flex-col items-center">
          <div className="p-3 bg-gray-100 rounded-full mb-4">
            <Mail className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="font-medium text-lg mb-1">No Messages Yet</h3>
          <p className="text-gray-500 mb-4">
            You haven't received any contact messages yet.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="font-medium">Contact Messages ({contactMessages.length})</h3>
      </div>
      
      <div className="p-4">
        {renderMessageGroup(groupedMessages.today, "Today")}
        {renderMessageGroup(groupedMessages.yesterday, "Yesterday")}
        {renderMessageGroup(groupedMessages.older, "Older")}
      </div>
    </div>
  );
};

export default AdminMessages;
