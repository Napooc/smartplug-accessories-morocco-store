
import { ShoppingCart, Package, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { useStore } from '@/lib/store';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const AdminDashboard = () => {
  const { orders, products, fetchOrders } = useStore();
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
  
  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 mb-1">Total Orders</p>
              <h3 className="text-3xl font-bold">{totalOrders}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-md">
              <ShoppingCart size={24} className="text-smartplug-blue" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/orders" className="text-sm text-smartplug-blue hover:underline">
              View all orders
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 mb-1">Total Products</p>
              <h3 className="text-3xl font-bold">{totalProducts}</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-md">
              <Package size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/products" className="text-sm text-smartplug-blue hover:underline">
              View all products
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold">{totalRevenue.toFixed(2)} DH</h3>
            </div>
            <div className="p-2 bg-purple-100 rounded-md">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/orders" className="text-sm text-smartplug-blue hover:underline">
              View details
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-bold">Recent Orders</h3>
          </div>
          
          <div className="p-0">
            {orders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No orders yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left text-gray-600 text-sm">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="p-4 font-medium">{order.id}</td>
                        <td className="p-4">{order.customer.name}</td>
                        <td className="p-4">{order.date}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' 
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status === 'pending' ? 'Pending' : 
                             order.status === 'shipped' ? 'Shipped' : 
                             order.status === 'delivered' ? 'Delivered' : 
                             order.status === 'cancelled' ? 'Cancelled' : order.status}
                          </span>
                        </td>
                        <td className="p-4 font-medium">{order.total.toFixed(2)} DH</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t">
            <Link to="/admin/orders" className="text-smartplug-blue hover:underline text-sm">
              View all orders
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-bold">Order Status</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Pending Orders</span>
                  <span className="text-sm font-medium text-gray-500">{pendingOrders}/{totalOrders}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-yellow-400 h-2.5 rounded-full"
                    style={{ width: `${totalOrders ? (pendingOrders / totalOrders) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Shipped Orders</span>
                  <span className="text-sm font-medium text-gray-500">
                    {orders.filter(order => order.status === 'shipped').length}/{totalOrders}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${totalOrders ? (orders.filter(order => order.status === 'shipped').length / totalOrders) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Delivered Orders</span>
                  <span className="text-sm font-medium text-gray-500">
                    {orders.filter(order => order.status === 'delivered').length}/{totalOrders}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${totalOrders ? (orders.filter(order => order.status === 'delivered').length / totalOrders) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Cancelled Orders</span>
                  <span className="text-sm font-medium text-gray-500">
                    {orders.filter(order => order.status === 'cancelled').length}/{totalOrders}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-red-500 h-2.5 rounded-full"
                    style={{ width: `${totalOrders ? (orders.filter(order => order.status === 'cancelled').length / totalOrders) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
