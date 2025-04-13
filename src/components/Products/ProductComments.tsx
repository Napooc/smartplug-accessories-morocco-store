
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Define comment type
interface Comment {
  id: string;
  name: string;
  email: string;
  comment: string;
  rating: number | null;
  created_at: string;
}

// Props for the component
interface ProductCommentsProps {
  productId: string;
}

// Form validation schema
const commentFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  comment: z.string().min(5, { message: 'Comment must be at least 5 characters' }),
  rating: z.number().min(1).max(5)
});

type CommentFormValues = z.infer<typeof commentFormSchema>;

const ProductComments = ({ productId }: ProductCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { products } = useStore();
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      name: '',
      email: '',
      comment: '',
      rating: 5
    }
  });

  useEffect(() => {
    if (productId) {
      fetchComments();
    }
  }, [productId]);

  const fetchComments = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('product_comments')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching comments:', error);
        toast.error('Could not load comments');
        return;
      }

      setComments(data || []);
    } catch (error) {
      console.error('Error in fetchComments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: CommentFormValues) => {
    try {
      setSubmitting(true);
      
      // Verify product exists in our store first
      const storeProduct = products.find(p => p.id === productId);
      if (!storeProduct) {
        toast.error('Product not found. Cannot submit comment.');
        return;
      }
      
      // Submit comment
      const { error } = await supabase
        .from('product_comments')
        .insert({
          product_id: productId,
          name: values.name,
          email: values.email,
          comment: values.comment,
          rating: values.rating
        });

      if (error) {
        console.error('Error submitting comment:', error);
        
        // Handle specific error cases
        if (error.code === '23503') { // Foreign key violation
          toast.error('Cannot comment on this product - it may have been removed');
        } else if (error.code === '42501' || error.code === '401') { // Permission denied
          toast.error('Permission denied. Please try again later.');
        } else {
          toast.error('Could not submit your comment. Please try again later.');
        }
        return;
      }

      toast.success('Your comment has been submitted!');
      
      // Reset form
      form.reset({
        name: '',
        email: '',
        comment: '',
        rating: 5
      });
      
      // Refresh comments
      fetchComments();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('An error occurred while submitting your comment');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Star rating component
  const StarRating = ({ value, onChange }: { value: number, onChange: (value: number) => void }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="text-2xl focus:outline-none transition-colors duration-200"
            onClick={() => onChange(star)}
            aria-label={`Rate ${star} stars out of 5`}
          >
            <span className={star <= value ? "text-yellow-400" : "text-gray-300 hover:text-gray-400"}>
              ★
            </span>
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Comment Item component
  const CommentItem = ({ comment }: { comment: Comment }) => (
    <div key={comment.id} className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h5 className="font-semibold">{comment.name}</h5>
          <div className="text-sm text-gray-500">
            {formatDate(comment.created_at)}
          </div>
        </div>
        {comment.rating && (
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-lg ${i < comment.rating! ? "text-yellow-400" : "text-gray-300"}`}>
                ★
              </span>
            ))}
          </div>
        )}
      </div>
      <p className="text-gray-700 mt-2">{comment.comment}</p>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No comments yet</h3>
      <p className="mt-1 text-sm text-gray-500">Be the first to leave a comment on this product.</p>
    </div>
  );

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <MessageCircle className="mr-2" size={20} />
        Product Comments
      </h3>

      {/* Comment Form */}
      <div className="bg-white rounded-lg p-6 border mb-8 shadow-sm">
        <h4 className="text-lg font-semibold mb-4">Leave a Comment</h4>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Your name" />
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
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="your.email@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment *</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Share your thoughts about this product..."
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <StarRating 
                      value={field.value} 
                      onChange={(value) => field.onChange(value)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="bg-smartplug-blue hover:bg-smartplug-lightblue"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Comment'
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Comments List */}
      <div>
        <h4 className="text-lg font-semibold mb-4">
          {comments.length > 0 
            ? `${comments.length} Comment${comments.length > 1 ? 's' : ''}` 
            : 'No Comments Yet'}
        </h4>
        
        {loading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-smartplug-blue" />
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default ProductComments;
