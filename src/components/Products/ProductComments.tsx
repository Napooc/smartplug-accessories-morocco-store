
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Rating } from '@/components/Products/Rating';
import { Loader2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';

interface Comment {
  id: string;
  name: string;
  email: string;
  comment: string;
  rating: number | null;
  created_at: string;
}

interface ProductCommentsProps {
  productId: string;
}

const ProductComments = ({ productId }: ProductCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    comment: '',
    rating: 5
  });
  const { products } = useStore();

  useEffect(() => {
    fetchComments();
  }, [productId]);

  // Verify if the product exists in our database
  const validateProductId = () => {
    // First check if the product exists in our local store
    const storeProduct = products.find(p => p.id === productId);
    if (storeProduct) {
      return true;
    }
    
    // If not in local store, we're likely dealing with a invalid product ID
    console.log("Product ID not found in store:", productId);
    return false;
  };

  const fetchComments = async () => {
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewComment(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (value: number) => {
    setNewComment(prev => ({ ...prev, rating: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.name.trim() || !newComment.email.trim() || !newComment.comment.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate product ID before attempting to submit
    if (!validateProductId()) {
      toast.error('Invalid product ID. Cannot submit comment.');
      return;
    }

    try {
      setSubmitting(true);
      
      // First check if this product actually exists in Supabase
      const { data: productExists, error: productCheckError } = await supabase
        .from('products')
        .select('id')
        .eq('id', productId)
        .single();
        
      if (productCheckError || !productExists) {
        console.error('Product does not exist in database:', productId);
        toast.error('Cannot comment on this product - it may have been removed');
        return;
      }
      
      const { error } = await supabase
        .from('product_comments')
        .insert({
          product_id: productId,
          name: newComment.name,
          email: newComment.email,
          comment: newComment.comment,
          rating: newComment.rating
        });

      if (error) {
        console.error('Error submitting comment:', error);
        toast.error('Could not submit your comment');
        return;
      }

      toast.success('Your comment has been submitted!');
      
      // Reset form
      setNewComment({
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <MessageCircle className="mr-2" size={20} />
        Product Comments
      </h3>

      {/* Comment Form */}
      <div className="bg-white rounded-lg p-6 border mb-8">
        <h4 className="text-lg font-semibold mb-4">Leave a Comment</h4>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name *
              </label>
              <Input
                id="name"
                name="name"
                value={newComment.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newComment.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium mb-1">
              Comment *
            </label>
            <Textarea
              id="comment"
              name="comment"
              rows={4}
              value={newComment.comment}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Rating
            </label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="text-2xl focus:outline-none"
                  onClick={() => handleRatingChange(star)}
                >
                  <span className={star <= newComment.rating ? "text-yellow-400" : "text-gray-300"}>
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>
          
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
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg p-4 border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-semibold">{comment.name}</h5>
                    <div className="text-sm text-gray-500">
                      {formatDate(comment.created_at)}
                    </div>
                  </div>
                  {comment.rating && (
                    <div className="flex items-center">
                      <Rating value={comment.rating} />
                    </div>
                  )}
                </div>
                <p className="text-gray-700 mt-2">{comment.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductComments;
