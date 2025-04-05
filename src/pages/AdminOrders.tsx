
import { useState, useEffect } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { OrderStatus } from '@/lib/types';

const AdminOrders = () => {
  const { orders, updateOrderStatus, fetchOrders } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Filter by status
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Filter by search query (order id, customer name, or phone)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.phone.includes(query)
      );
    }
    
    return true;
  });
  
  return (
    <AdminLayout title="Orders">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Filter and search */}
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search orders..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Orders table */}
        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No orders found
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-gray-600 text-sm">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{order.id}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-gray-500 text-sm">{order.customer.phone}</div>
                      </div>
                    </td>
                    <td className="p-4">{order.date}</td>
                    <td className="p-4">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </td>
                    <td className="p-4 font-medium">{order.total.toFixed(2)} DH</td>
                    <td className="p-4">
                      <Select 
                        value={order.status}
                        onValueChange={(value: OrderStatus) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye size={18} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Order Details - {order.id}</DialogTitle>
                            <DialogDescription>
                              Placed on {order.date}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            {/* Customer Info */}
                            <div className="space-y-4">
                              <h3 className="font-medium">Customer Information</h3>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-gray-500">Name:</span>{" "}
                                  <span className="font-medium">{order.customer.name}</span>
                                </div>
                                {order.customer.nickname && (
                                  <div>
                                    <span className="text-gray-500">Nickname:</span>{" "}
                                    <span className="font-medium">{order.customer.nickname}</span>
                                  </div>
                                )}
                                <div>
                                  <span className="text-gray-500">Phone:</span>{" "}
                                  <span className="font-medium">{order.customer.phone}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">City:</span>{" "}
                                  <span className="font-medium">{order.customer.city}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Order Status */}
                            <div className="space-y-4">
                              <h3 className="font-medium">Order Status</h3>
                              <div>
                                <Select 
                                  value={order.status}
                                  onValueChange={(value: OrderStatus) => updateOrderStatus(order.id, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          
                          {/* Order Items */}
                          <div className="mt-6">
                            <h3 className="font-medium mb-4">Order Items</h3>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gray-50 text-left text-gray-600 text-sm">
                                  <tr>
                                    <th className="p-3">Product</th>
                                    <th className="p-3">Price</th>
                                    <th className="p-3">Quantity</th>
                                    <th className="p-3 text-right">Total</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y">
                                  {order.items.map((item) => (
                                    <tr key={item.product.id} className="hover:bg-gray-50">
                                      <td className="p-3">
                                        <div className="flex items-center">
                                          <img 
                                            src={item.product.images[0]} 
                                            alt={item.product.name}
                                            className="w-10 h-10 object-cover rounded border mr-3"
                                            onError={(e) => {
                                              const target = e.target as HTMLImageElement;
                                              target.src = 'https://images.unsplash.com/photo-1611754349119-0a60420137a4?w=500&auto=format&fit=crop&q=80';
                                            }}
                                          />
                                          <span className="font-medium">{item.product.name}</span>
                                        </div>
                                      </td>
                                      <td className="p-3">{item.product.price} DH</td>
                                      <td className="p-3">{item.quantity}</td>
                                      <td className="p-3 text-right font-medium">
                                        {(item.product.price * item.quantity).toFixed(2)} DH
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                  <tr>
                                    <td colSpan={3} className="p-3 font-medium text-right">Total</td>
                                    <td className="p-3 font-bold text-right">{order.total.toFixed(2)} DH</td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
