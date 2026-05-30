import React, { useContext, useEffect, useState } from 'react';
import { GeneralContext } from '../../context/GeneralContext';
import axios from 'axios';

const Profile = () => {
  const { logout } = useContext(GeneralContext);

  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/orders/fetch-orders');
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.orders)
        ? res.data.orders
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];
      setOrders(data.slice().reverse());
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!orderId) return alert('Order ID is required');

    try {
      const { data } = await axios.put('http://localhost:3000/api/orders/cancel-order', { orderId });
      alert('Order cancelled successfully!');

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? { ...order, orderStatus: 'Cancelled' } : order))
      );
    } catch (error) {
      console.error('Cancel order error:', error);
      alert(error.response?.data?.message || 'Error cancelling order');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-10 px-4">
      {/* PROFILE HEADER CARD */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-200 p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
          {username ? username.charAt(0).toUpperCase() : 'U'}
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          <div className="bg-gray-50 p-4 rounded-xl border flex flex-col">
            <span className="text-xs text-gray-500">USERNAME</span>
            <span className="text-lg font-semibold text-gray-900">{username}</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border flex flex-col">
            <span className="text-xs text-gray-500">EMAIL</span>
            <span className="text-lg font-semibold text-gray-900">{email}</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border flex flex-col">
            <span className="text-xs text-gray-500">TOTAL ORDERS</span>
            <span className="text-lg font-semibold text-gray-900">{orders.length}</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-md transition"
        >
          Logout
        </button>
      </div>

      {/* ORDERS LIST */}
      <div className="max-w-6xl mx-auto mt-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h3>

        {orders.length === 0 ? (
          <div className="bg-white border rounded-xl p-8 text-center text-gray-500 shadow-sm">
            You have no orders yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => {
              const discountedPrice = parseInt(
                order.price - (order.price * order.discount) / 100
              );

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* LEFT SIDE: DETAILS */}
                    <div className="flex-1 space-y-2">
                      <h4 className="text-xl font-semibold text-gray-900">{order.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{order.description}</p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <span className="block font-medium">{order.size}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Qty:</span>
                          <span className="block font-medium">{order.quantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <span className="block font-semibold text-gray-900">₹{discountedPrice * order.quantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Payment:</span>
                          <span className="block font-medium">{order.paymentMethod || '-'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                        <div>
                          <span className="text-gray-500 block">Address</span>
                          <span className="text-gray-800">{order.address}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Pincode</span>
                          <span className="text-gray-800">{order.pincode}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Ordered on</span>
                          <span className="text-gray-800">{order.orderDate?.slice(0, 10)}</span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT SIDE: STATUS + ACTION */}
                    <div className="flex flex-col items-start md:items-end gap-3">
                      <span
                        className={`px-3 py-1 text-sm rounded-lg font-semibold shadow-sm
                          ${order.orderStatus === 'Cancelled'
                            ? 'bg-red-100 text-red-700'
                            : order.orderStatus === 'Delivered'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'}`}
                      >
                        {order.orderStatus}
                      </span>

                      {(order.orderStatus === 'order placed' || order.orderStatus === 'In-transit') ? (
                        <button
                          onClick={() => cancelOrder(order._id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md font-semibold"
                        >
                          Cancel Order
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg font-medium"
                        >
                          {order.orderStatus}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
