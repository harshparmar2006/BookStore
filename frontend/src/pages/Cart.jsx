import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingItem, setRemovingItem] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/v1/get-user-cart", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          id: userId,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCartItems(data.data || []);
      } else {
        setError("Failed to fetch cart items");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching cart items");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (bookId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      navigate("/login");
      return;
    }

    setRemovingItem(bookId);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/v1/remove-book-from-cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          id: userId,
          bookid: bookId,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Item removed from cart");
        // Refresh cart items
        fetchCartItems();
      } else {
        setMessage(data.message || "Failed to remove item");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error removing item");
    } finally {
      setRemovingItem(null);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleBuyNow = () => {
    navigate("/checkout");
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-yellow-400 text-xl">Loading cart...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-3xl font-bold text-yellow-400 flex items-center gap-3">
            <ShoppingCart size={32} />
            My Cart
          </h1>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              message.includes("removed") || message.includes("success")
                ? "bg-green-900/50 border border-green-700 text-green-200"
                : "bg-red-900/50 border border-red-700 text-red-200"
            }`}
          >
            {message.includes("removed") || message.includes("success") ? (
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

        {/* Cart Content */}
        {cartItems.length === 0 ? (
          <div className="bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <ShoppingCart size={64} className="mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some books to get started!</p>
            <button
              onClick={() => navigate("/books")}
              className="bg-yellow-400 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Book Image */}
                    <div className="flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full sm:w-32 h-48 sm:h-40 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full sm:w-32 h-48 sm:h-40 bg-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-400">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Book Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-gray-400 mb-3">by {item.author}</p>
                        <p className="text-yellow-400 text-2xl font-bold">₹{item.price}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => navigate(`/book/${item._id}`)}
                          className="flex-1 bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          disabled={removingItem === item._id}
                          className="flex-1 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <Trash2 size={18} />
                          {removingItem === item._id ? "Removing..." : "Remove"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total</span>
                      <span className="text-yellow-400">₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-colors"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate("/books")}
                  className="w-full mt-3 bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

