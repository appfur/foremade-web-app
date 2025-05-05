import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import db from '../db.json';
import Sidebar from '/src/profile/Sidebar';
import Spinner from '../components/common/Spinner';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [orderCount, setOrderCount] = useState(0);

  const mockWishlistCount = 3;
  const ORDER_HISTORY_KEY = 'orderHistory_1';

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setError('Please sign in to view your orders.');
        setLoading(false);
        return;
      }

      const storedUserData = localStorage.getItem('userData');
      let additionalData = {};
      if (storedUserData) {
        try {
          additionalData = JSON.parse(storedUserData);
          if (typeof additionalData.name !== 'string' || additionalData.name.includes('{')) {
            console.warn('Corrupted name field:', additionalData.name);
            additionalData.name = 'Emmanuel Chinecherem';
          }
          if (typeof additionalData.username !== 'string') {
            additionalData.username = 'emmaChi';
          }
        } catch (err) {
          console.error('Error parsing userData:', err);
          additionalData = {};
        }
      }

      setUserData({
        email: user.email || 'test@example.com',
        username: additionalData.username || user.displayName || 'emmaChi',
        name: additionalData.name || user.displayName || 'Emmanuel Chinecherem',
        profileImage: additionalData.profileImage || null,
        createdAt: additionalData.createdAt || '2025-05-04T23:28:48.857Z',
        address: additionalData.address || 'Not provided',
        country: additionalData.country || 'Nigeria',
        phone: additionalData.phone || '+234-8052975966',
        uid: user.uid,
      });

      const orderHistory = getOrderHistory();
      setOrderCount(orderHistory.length);
      setLoading(false);
    });

    const handleOrderPlaced = () => {
      const orderHistory = getOrderHistory();
      setOrderCount(orderHistory.length);
      loadOrders();
    };
    window.addEventListener('orderPlaced', handleOrderPlaced);
    return () => {
      unsubscribe();
      window.removeEventListener('orderPlaced', handleOrderPlaced);
    };
  }, []);

  const getOrderHistory = () => {
    try {
      const storedOrders = localStorage.getItem(ORDER_HISTORY_KEY);
      return storedOrders ? JSON.parse(storedOrders) : [];
    } catch (err) {
      console.error('Error getting order history:', err);
      return [];
    }
  };

  const loadOrders = () => {
    try {
      setLoading(true);
      const orderHistory = getOrderHistory();

      const validOrders = orderHistory
        .filter((order) => Array.isArray(order.items) && order.items.length > 0)
        .map((order, index) => ({
          orderId: order.orderId,
          date: order.date,
          status: index % 2 === 0 ? 'Delivered' : 'Shipped',
          items: order.items.filter((item) => {
            const productExists = db.products.some((p) => p.id === item.productId);
            if (!productExists) {
              console.log(`Product ID ${item.productId} not found in db.json`);
            }
            return productExists;
          }),
          total: calculateOrderTotal(order.items),
        }))
        .filter((order) => order.items.length > 0);

      const mockOrders = validOrders.length > 0
        ? validOrders
        : [
            {
              orderId: 'ORD001',
              date: '2025-04-20T10:30:00Z',
              status: 'Delivered',
              items: [
                {
                  productId: db.products[0]?.id || 'unknown',
                  quantity: 1,
                },
              ],
              total: calculateOrderTotal([
                {
                  productId: db.products[0]?.id || 'unknown',
                  quantity: 1,
                },
              ]),
            },
          ];

      setOrders(mockOrders);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const calculateOrderTotal = (items) => {
    const subtotal = items.reduce((total, item) => {
      const product = db.products.find((p) => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
    const tax = subtotal * 0.075;
    const shipping = subtotal > 0 ? 500 : 0;
    return subtotal + tax + shipping;
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Spinner />
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600">{error}</p>
        <Link to="/login" className="text-blue-600 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-gray-800">
      <div className="flex flex-col md:flex-row gap-6">
        <Sidebar userData={userData} orderCount={orderCount} wishlistCount={mockWishlistCount} />
        <div className="md:w-3/4">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h1>
          {orders.length === 0 ? (
            <p className="text-gray-600">
              You have no orders.{' '}
              <Link to="/products" className="text-blue-600 hover:underline">
                Start shopping
              </Link>
            </p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.orderId} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Order #{order.orderId}</h2>
                    <span
                      className={`text-sm ${
                        order.status === 'Delivered' ? 'text-green-600' : 'text-blue-600'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Placed on: {formatDate(order.date)}
                  </p>
                  <div className="space-y-4">
                    {order.items.map((item) => {
                      const product = db.products.find((p) => p.id === item.productId);
                      return (
                        <div
                          key={item.productId}
                          className="flex items-center gap-4 p-2 bg-gray-100 rounded-lg"
                        >
                          <Link to={`/product/${item.productId}`}>
                            <img
                              src={product?.image || 'https://via.placeholder.com/64'}
                              alt={product?.name || 'Product'}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => (e.target.src = 'https://via.placeholder.com/64')}
                            />
                          </Link>
                          <div className="flex-1">
                            <Link
                              to={`/product/${item.productId}`}
                              className="text-sm font-semibold text-gray-800 hover:underline"
                            >
                              {product?.name || 'Product Not Found'}
                            </Link>
                            <p className="text-xs text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-xs text-gray-600">
                              Unit Price: ₦
                              {product?.price.toLocaleString('en-NG', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }) || 'N/A'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mt-4">
                    Total: ₦
                    {order.total.toLocaleString('en-NG', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;