import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  MapPin,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCheckoutData();
  }, []);

  const fetchCheckoutData = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      navigate("/login");
      return;
    }

    try {
      // Fetch cart items
      const cartResponse = await fetch("http://localhost:5000/api/v1/get-user-cart", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          id: userId,
        },
      });

      const cartData = await cartResponse.json();
      if (cartResponse.ok) {
        setCartItems(cartData.data || []);
      } else {
        setError("Failed to fetch cart items");
      }

      // Fetch user data for address
      const userResponse = await fetch("http://localhost:5000/api/v1/get-user-information", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          id: userId,
        },
      });

      const userInfo = await userResponse.json();
      if (userResponse.ok) {
        setUserData(userInfo);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching checkout data");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      setMessage("Your cart is empty!");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    setPlacingOrder(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/v1/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          id: userId,
        },
        body: JSON.stringify({
          order: cartItems,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Order placed successfully!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setMessage(data.message || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error placing order");
    } finally {
      setPlacingOrder(false);
      setTimeout(() => {
        if (message.includes("successfully")) {
          setMessage("");
        }
      }, 3000);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-yellow-400 text-xl">Loading checkout...</p>
      </div>
    );

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <ShoppingCart size={64} className="mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some books to checkout!</p>
            <button
              onClick={() => navigate("/cart")}
              className="bg-yellow-400 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Go to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Cart</span>
          </button>
          <h1 className="text-3xl font-bold text-yellow-400 flex items-center gap-3">
            <CreditCard size={32} />
            Checkout
          </h1>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              message.includes("successfully")
                ? "bg-green-900/50 border border-green-700 text-green-200"
                : "bg-red-900/50 border border-red-700 text-red-200"
            }`}
          >
            {message.includes("successfully") ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{message}</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={24} className="text-yellow-400" />
                <h2 className="text-xl font-bold text-white">Delivery Address</h2>
              </div>
              {userData ? (
                <div className="space-y-2">
                  <p className="text-gray-300">{userData.address}</p>
                  <button
                    onClick={() => navigate("/profile")}
                    className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
                  >
                    Update Address
                  </button>
                </div>
              ) : (
                <p className="text-gray-400">Loading address...</p>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4">Order Items</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 pb-4 border-b border-gray-700 last:border-0"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-20 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-400">No Image</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">by {item.author}</p>
                      <p className="text-yellow-400 font-bold">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg sticky top-4">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Items ({cartItems.length})</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <span>₹0</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total</span>
                    <span className="text-yellow-400">₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder || cartItems.length === 0}
                className="w-full bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {placingOrder ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Place Order
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 mt-4 text-center">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

