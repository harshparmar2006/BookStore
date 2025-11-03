import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

const AllBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Using centralized API URL
    fetch(`${API_URL}/book/get-all-book`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch books");
        }
        return res.json();
      })
      .then((data) => {
        setBooks(data.data); // backend sends { status: "Success", data: [...] }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching books");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <p className="text-center text-yellow-400 mt-10">Loading books...</p>
    );

  if (error) return <p className="text-center text-red-400 mt-10">{error}</p>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">
          All Books
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            onClick={() => navigate(`/book/${book._id}`)}
            className="bg-gray-800 rounded-lg shadow-md hover:shadow-xl p-4 hover:scale-105 transition-transform cursor-pointer flex flex-col"
          >
            <div className="flex-shrink-0">
              {book.image ? (
                <img
                  src={book.image}
                  alt={book.title || "Book cover"}
                  className="h-64 w-full object-cover rounded-md mb-4"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="h-64 w-full bg-gray-700 rounded-md mb-4 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-white line-clamp-2 mb-1">{book.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{book.author}</p>
              <p className="text-yellow-400 font-bold mt-auto">₹{book.price}</p>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default AllBooks;
