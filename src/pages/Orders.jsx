import { useState, useEffect } from 'react';
import db from '../db.json';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage on mount
  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const orderItems = order.items.map((item) => {
              const product = db.products.find((p) => p.id === item.productId);
              return { ...item, product };
            });
            return (
              <div key={order.id} className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(order.date).toLocaleDateString()}
                </p>
                <div className="mt-2 space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.productId} className="flex items-center gap-4">
                      <img
                        src={item.product?.image}
                        alt={item.product?.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-800">{item.product?.name}</p>
                        <p className="text-xs text-gray-600">
                          Quantity: {item.quantity} | ₦{(item.product?.price * item.quantity).toLocaleString('en-NG', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm font-bold text-gray-800">
                  Total: ₦{order.total.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;