
import { ShoppingCart, Package, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { useStore } from '@/lib/store';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useLanguage } from '@/lib/languageContext';

const AdminDashboard = () => {
  const { orders, products, fetchOrders } = useStore();
  const { t } = useLanguage();
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
  
  return (
    <AdminLayout title={t('dashboard')}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 mb-1">{t('adminDashboard.totalOrders')}</p>
              <h3 className="text-3xl font-bold">{totalOrders}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-md">
              <ShoppingCart size={24} className="text-smartplug-blue" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/orders" className="text-sm text-smartplug-blue hover:underline">
              {t('adminDashboard.viewAllOrders')}
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 mb-1">{t('adminDashboard.totalProducts')}</p>
              <h3 className="text-3xl font-bold">{totalProducts}</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-md">
              <Package size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/products" className="text-sm text-smartplug-blue hover:underline">
              {t('adminDashboard.viewAllProducts')}
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 mb-1">{t('adminDashboard.totalRevenue')}</p>
              <h3 className="text-3xl font-bold">{totalRevenue.toFixed(2)} DH</h3>
            </div>
            <div className="p-2 bg-purple-100 rounded-md">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/orders" className="text-sm text-smartplug-blue hover:underline">
              {t('adminDashboard.viewDetails')}
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-bold">{t('adminDashboard.recentOrders')}</h3>
          </div>
          
          <div className="p-0">
            {orders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {t('adminDashboard.noOrders')}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left text-gray-600 text-sm">
                    <tr>
                      <th className="p-4">{t('adminDashboard.orderId')}</th>
                      <th className="p-4">{t('adminDashboard.customer')}</th>
                      <th className="p-4">{t('adminDashboard.date')}</th>
                      <th className="p-4">{t('adminDashboard.status')}</th>
                      <th className="p-4">{t('adminDashboard.total')}</th>
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
                            {t(`orderStatus.${order.status}`)}
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
              {t('adminDashboard.viewAllOrders')}
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-bold">{t('adminDashboard.orderStatus')}</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{t('adminDashboard.pendingOrders')}</span>
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
                  <span className="text-sm font-medium">{t('adminDashboard.shippedOrders')}</span>
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
                  <span className="text-sm font-medium">{t('adminDashboard.deliveredOrders')}</span>
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
                  <span className="text-sm font-medium">{t('adminDashboard.cancelledOrders')}</span>
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
