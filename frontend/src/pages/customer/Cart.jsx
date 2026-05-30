import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GeneralContext } from "../../context/GeneralContext";
import { HiTrash, HiShoppingBag, HiShieldCheck, HiTruck } from "react-icons/hi";

const Cart = () => {
  const { cartCount, setCartCount } = useContext(GeneralContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:3000/api/cart";
  const token = localStorage.getItem("token");

  // Fetch cart items on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${BACKEND_URL}/fetch-cart`, config);
      const items = Array.isArray(response.data) ? response.data : [];
      setCartItems(items);

      // Update global cart count
      const count = items.reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);
      setCartCount(count);
    } catch (err) {
      console.error("Cart fetch failed:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${BACKEND_URL}/remove-item/${id}`, config);
      fetchCart();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  // Calculate totals
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = cartItems.reduce(
      (sum, item) => sum + ((item.price * item.discount) / 100) * item.quantity,
      0
    );

    setTotalPrice(total);
    setTotalDiscount(Math.floor(discount));
    setDeliveryCharges(total > 1000 || cartItems.length === 0 ? 0 : 50);
  }, [cartItems]);

  const handleCheckout = () => {
    const payload = { cartItems, totalPrice, totalDiscount, deliveryCharges };
    localStorage.setItem("checkoutPayload", JSON.stringify(payload));
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border">
          <HiShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">Start shopping to find amazing products!</p>
          <button
            onClick={() => navigate("/product")}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <HiShoppingBag className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const discountedPrice = parseInt(item.price - (item.price * item.discount) / 100);
              const totalItemPrice = discountedPrice * item.quantity;

              return (
                <div key={item._id} className="bg-white rounded-2xl p-6 shadow-sm border flex flex-col sm:flex-row gap-6">
                  <img
                    src={item.mainImg}
                    alt={item.title}
                    className="w-32 h-32 object-contain rounded-lg"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold">₹{totalItemPrice.toLocaleString()}</span>
                        {item.discount > 0 && (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                              Save ₹{((item.price * item.discount) / 100 * item.quantity).toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-red-600 hover:text-red-700 mt-4 sm:mt-0 flex items-center gap-2"
                    >
                      <HiTrash className="w-5 h-5" />
                      <span className="text-sm font-medium">Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between"><span>Total MRP</span><span>₹{totalPrice.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Discount</span><span className="text-green-600">-₹{totalDiscount.toLocaleString()}</span></div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className={deliveryCharges > 0 ? "text-red-600" : "text-green-600"}>
                    {deliveryCharges > 0 ? `+₹${deliveryCharges}` : "FREE"}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                  <span>Final Amount</span>
                  <span>₹{(totalPrice - totalDiscount + deliveryCharges).toLocaleString()}</span>
                </div>
              </div>

              {totalPrice > 1000 && (
                <div className="bg-green-50 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <HiTruck className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Free Delivery Unlocked!</p>
                    <p className="text-xs text-green-600">You've saved ₹50 on delivery</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <HiShieldCheck className="w-4 h-4 text-green-600" />
                Secure checkout · Safe & protected
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 flex justify-center"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
