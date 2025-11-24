import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HiTruck, HiShieldCheck } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const CompleteOrder = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [checkoutPayload, setCheckoutPayload] = useState({
    cartItems: [],
    totalPrice: 0,
    totalDiscount: 0,
    deliveryCharges: 0,
  });

  // User Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  // Load checkout payload
  useEffect(() => {
    const raw = localStorage.getItem('checkoutPayload');
    if (!raw) return navigate('/cart');
    try {
      const parsed = JSON.parse(raw);
      setCheckoutPayload(parsed);
    } catch (err) {
      console.error('Checkout payload parse error:', err);
      navigate('/cart');
    }
  }, []);

  const { cartItems, totalPrice, totalDiscount, deliveryCharges } = checkoutPayload;
  const finalAmount = totalPrice - totalDiscount + deliveryCharges;

  const placeOrder = async () => {
    if (!name || !mobile || !address || !paymentMethod) {
      return alert('Please fill all required fields');
    }

    setLoading(true);
    try {
      const orderPayload = {
        userId,
        name,
        email,
        mobile,
        address,
        pincode,
        paymentMethod,
        orderDate: new Date(),
        items: cartItems,
      };

      await axios.post('http://localhost:3000/api/orders/place-cart-order', orderPayload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      alert('Order placed successfully!');
      localStorage.removeItem('checkoutPayload');
      navigate('/profile');
    } catch (err) {
      console.error('Order error:', err);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xl font-bold tracking-wide text-gray-900">
            DELIVERY <span className="font-normal text-gray-700">INFORMATION</span>
          </h1>
        </div>
        <div className="h-px bg-gray-300 mb-5"></div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Complete Your Order</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <HiShieldCheck className="w-5 h-5 text-green-600" />
              <span>Secure Checkout</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Delivery Form */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold mb-3">Delivery Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>

              <input
                type="text"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-3"
              />
              
              <input
                type="text"
                placeholder="Street / Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-3"
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <input
                  type="text"
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <aside className="space-y-4">
              <h3 className="text-lg font-semibold mb-3">Cart Totals</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                {cartItems.map((item) => {
                  const discountedPrice = parseInt(item.price - (item.price * item.discount) / 100);
                  const totalItemPrice = discountedPrice * item.quantity;
                  return (
                    <div key={item._id} className="flex justify-between text-sm text-gray-700">
                      <span>{item.title} x {item.quantity}</span>
                      <span>₹{totalItemPrice.toLocaleString()}</span>
                    </div>
                  );
                })}

                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Subtotal</span>
                  <span>₹{totalPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={deliveryCharges > 0 ? "text-red-600" : "text-green-600"}>
                    {deliveryCharges > 0 ? `+₹${deliveryCharges}` : "Free"}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold pt-2 border-t mt-2">
                  <span>Total</span>
                  <span>₹{finalAmount.toLocaleString()}</span>
                </div>
              </div>

              <h4 className="text-sm font-semibold mt-4 mb-2">Payment Method</h4>
              <div className="space-y-2">
                {["cod", "stripe", "razorpay"].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center gap-3 p-2 border rounded-lg cursor-pointer ${
                      paymentMethod === method
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="text-sm font-medium">
                      {method === "cod" ? "Cash on Delivery" : method.toUpperCase()}
                    </span>
                  </label>
                ))}
              </div>

              <button
                onClick={placeOrder}
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition mt-4"
              >
                {loading ? "Placing Order..." : "PLACE ORDER"}
              </button>

              <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
                <HiTruck className="w-4 h-4 text-green-600" />
                <span>Delivery timelines may vary depending on location</span>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteOrder;
