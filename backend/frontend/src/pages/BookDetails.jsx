import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/get-book-by-id/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch book details");
        }
        return res.json();
      })
      .then((data) => {
        setBook(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching book details");
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setMessage("Please login to add items to cart");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    setAddingToCart(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/v1/add-to-cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          id: userId,
          bookid: id,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Book added to cart successfully!");
      } else {
        setMessage(data.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error adding to cart");
    } finally {
      setAddingToCart(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setMessage("Please login to buy this item");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    // First add to cart, then redirect to cart page
    const response = await fetch("http://localhost:5000/api/v1/add-to-cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        id: userId,
        bookid: id,
      },
    });

    if (response.ok) {
      navigate("/cart");
    } else {
      const data = await response.json();
      setMessage(data.message || "Failed to add to cart");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-yellow-400 text-xl">Loading book details...</p>
      </div>
    );

  if (error || !book)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-red-400 text-xl">{error || "Book not found"}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6">
            {/* Book Image */}
            <div className="flex justify-center items-start">
              <div className="w-full max-w-xs">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-auto rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full bg-gray-700 rounded-lg shadow-lg flex items-center justify-center p-12">
                    <span className="text-gray-400">No Image Available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Book Details */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-3">
                  {book.title}
                </h1>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
                    Author
                  </span>
                  <p className="text-white text-base mt-1">{book.author}</p>
                </div>

                <div>
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
                    Price
                  </span>
                  <p className="text-yellow-400 text-2xl font-bold mt-1">
                    ₹{book.price}
                  </p>
                </div>

                <div>
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
                    Language
                  </span>
                  <p className="text-white text-sm mt-1">
                    {book.language || "English"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-2">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full bg-yellow-400 text-gray-900 font-semibold py-2.5 px-4 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gray-700 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-600 transition-colors border border-yellow-400"
                >
                  Buy Now
                </button>
              </div>

              {/* Message Display */}
              {message && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    message.includes("success")
                      ? "bg-green-900 text-green-200"
                      : "bg-red-900 text-red-200"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="border-t border-gray-700 p-4 md:p-6">
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">
              Description
            </h2>
            <p className="text-white text-sm leading-relaxed">
              {book.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
