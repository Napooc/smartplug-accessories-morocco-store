
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Mail, Trash2, RefreshCw } from 'lucide-react';
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
  const { contactMessages, deleteContactMessage, loadContactMessages } = useStore();
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const toggleMessage = (messageId: string) => {
    if (expandedMessage === messageId) {
      setExpandedMessage(null);
    } else {
      setExpandedMessage(messageId);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadContactMessages();
      toast.success('Messages refreshed successfully');
    } catch (error) {
      console.error('Error refreshing messages:', error);
      toast.error('Failed to refresh messages');
    } finally {
      setIsRefreshing(false);
    }
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
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="font-medium">Contact Messages ({contactMessages.length})</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-1 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <ul className="divide-y">
        {contactMessages.map((message) => (
          <li key={message.id} className="p-0">
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
                      <span className="mx-2">•</span>
                      <span>{message.date}</span>
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
                        onClick={async () => {
                          try {
                            await deleteContactMessage(message.id);
                            toast.success("Message deleted successfully");
                          } catch (error) {
                            console.error('Error deleting message:', error);
                            toast.error('Failed to delete message');
                          }
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

export default AdminMessages;
