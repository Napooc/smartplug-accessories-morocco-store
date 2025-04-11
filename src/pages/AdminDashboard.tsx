
import { ShoppingCart, Package, TrendingUp, MessageSquare } from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';
import AdminMessages from '@/components/Admin/AdminMessages';
import { useStore } from '@/lib/store';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const { orders, products, contactMessages, fetchOrders, fetchContactMessages } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();
  
  // Fetch orders and messages on component mount
  useEffect(() => {
    fetchOrders();
    fetchContactMessages();
  }, [fetchOrders, fetchContactMessages]);
  
  // Switch to messages tab if coming from contact page with messages
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('tab') === 'messages') {
      setActiveTab('messages');
    }
  }, [location]);
  
  // Calculate statistics
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
  const unreadMessages = contactMessages.length;
  
  return (
    <AdminLayout title="Tableau de bord">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 mb-1">Total Commandes</p>
              <h3 className="text-3xl font-bold">{totalOrders}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-md">
              <ShoppingCart size={24} className="text-smartplug-blue" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/orders" className="text-sm text-smartplug-blue hover:underline">
              Voir toutes les commandes
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 mb-1">Total Produits</p>
              <h3 className="text-3xl font-bold">{totalProducts}</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-md">
              <Package size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/products" className="text-sm text-smartplug-blue hover:underline">
              Voir tous les produits
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 mb-1">Revenus Totaux</p>
              <h3 className="text-3xl font-bold">{totalRevenue.toFixed(2)} DH</h3>
            </div>
            <div className="p-2 bg-purple-100 rounded-md">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/orders" className="text-sm text-smartplug-blue hover:underline">
              Voir détails
            </Link>
          </div>
        </div>
        
        <div className={`bg-white rounded-lg shadow-sm p-6 border ${unreadMessages > 0 ? 'ring-2 ring-yellow-300' : ''}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 mb-1">Messages</p>
              <h3 className="text-3xl font-bold">{contactMessages.length}</h3>
            </div>
            <div className="p-2 bg-yellow-100 rounded-md">
              <MessageSquare size={24} className="text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => setActiveTab('messages')}
              className="text-sm text-smartplug-blue hover:underline"
            >
              Voir messages
            </button>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="messages" className="relative">
            Messages
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold">Commandes Récentes</h3>
              </div>
              
              <div className="p-0">
                {orders.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    Pas encore de commandes
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 text-left text-gray-600 text-sm">
                        <tr>
                          <th className="p-4">ID Commande</th>
                          <th className="p-4">Client</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Statut</th>
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
                                {order.status === 'pending' ? 'En attente' : 
                                 order.status === 'shipped' ? 'Expédié' : 
                                 order.status === 'delivered' ? 'Livré' : 
                                 order.status === 'cancelled' ? 'Annulé' : order.status}
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
                  Voir toutes les commandes
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold">Statut des Commandes</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Commandes En Attente</span>
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
                      <span className="text-sm font-medium">Commandes Expédiées</span>
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
                      <span className="text-sm font-medium">Commandes Livrées</span>
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
                      <span className="text-sm font-medium">Commandes Annulées</span>
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
        </TabsContent>
        
        <TabsContent value="messages" id="messages">
          <AdminMessages />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminDashboard;
