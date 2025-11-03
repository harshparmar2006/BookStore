import React, { useEffect, useState } from "react";
import API_URL from "../config";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  AlertCircle,
  CheckCircle,
  X,
  Save,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    description: "",
    language: "",
    image: "",
  });

  useEffect(() => {
    checkAdminAndFetchBooks();
  }, []);

  const checkAdminAndFetchBooks = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");

    if (!token || !userId) {
      navigate("/login");
      return;
    }

    if (userRole !== "admin") {
      navigate("/");
      return;
    }

    fetchBooks();
  };

  const fetchBooks = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/book/get-all-book`);
      const data = await response.json();
      if (response.ok) {
        setBooks(data.data || []);
      } else {
        setError("Failed to fetch books");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching books");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      url: "",
      title: "",
      author: "",
      price: "",
      description: "",
      language: "",
      image: "",
    });
    setShowAddForm(false);
    setEditingBook(null);
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch(`${API_URL}/add-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          id: userId,
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Book added successfully!");
        resetForm();
        fetchBooks();
      } else {
        setMessage(data.message || "Failed to add book");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error adding book");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setFormData({
      url: book.url || "",
      title: book.title || "",
      author: book.author || "",
      price: book.price || "",
      description: book.description || "",
      language: book.language || "",
      image: book.image || "",
    });
    setShowAddForm(true);
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch(`${API_URL}/update-book`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          id: userId,
          bookid: editingBook._id,
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Book updated successfully!");
        resetForm();
        fetchBooks();
      } else {
        setMessage(data.message || "Failed to update book");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error updating book");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch(`${API_URL}/delete-book`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          id: userId,
          bookid: bookId,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Book deleted successfully!");
        fetchBooks();
      } else {
        setMessage(data.message || "Failed to delete book");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error deleting book");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-yellow-400 text-xl">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400 flex items-center gap-3">
              <BookOpen size={32} />
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Manage books in the store</p>
          </div>
          {!showAddForm && (
            <button
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              className="bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Book
            </button>
          )}
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

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                {editingBook ? "Edit Book" : "Add New Book"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={editingBook ? handleUpdateBook : handleAddBook}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Author *</label>
                <input
                  type="text"
                  name="author"
                  required
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Language *</label>
                <input
                  type="text"
                  name="language"
                  required
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Book Purchase URL * <span className="text-xs text-gray-400">(e.g., Amazon link)</span>
                </label>
                <input
                  type="url"
                  name="url"
                  required
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://www.amazon.in/book-title/dp/123456789"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter the URL where users can purchase this book (e.g., Amazon, Flipkart, etc.)
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                />
                {/* Image Preview */}
                {formData.image && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-2">Preview:</p>
                    <div className="w-full max-w-xs bg-gray-700 rounded-lg p-2 relative">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-auto rounded-lg max-h-64 object-contain"
                        onError={(e) => {
                          e.target.style.display = "none";
                          const errorDiv = e.target.parentElement.querySelector(".preview-error");
                          if (errorDiv) {
                            errorDiv.style.display = "block";
                          }
                        }}
                      />
                      <div className="preview-error hidden text-red-400 text-sm text-center py-4">
                        Invalid image URL
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                />
              </div>

              <div className="md:col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {editingBook ? "Update Book" : "Add Book"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Books List */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">All Books ({books.length})</h2>
          {error && (
            <div className="mb-4 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {books.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No books found. Add your first book!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300">Image</th>
                    <th className="text-left py-3 px-4 text-gray-300">Title</th>
                    <th className="text-left py-3 px-4 text-gray-300">Author</th>
                    <th className="text-left py-3 px-4 text-gray-300">Price</th>
                    <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="py-3 px-4">
                        {book.image ? (
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-16 h-20 object-cover rounded"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-16 h-20 bg-gray-700 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-400">No Image</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-white font-semibold">{book.title}</td>
                      <td className="py-3 px-4 text-gray-300">{book.author}</td>
                      <td className="py-3 px-4 text-yellow-400 font-bold">₹{book.price}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditBook(book)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 transition-colors flex items-center gap-1"
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

