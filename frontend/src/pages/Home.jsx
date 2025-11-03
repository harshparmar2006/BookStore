import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "./Hero/Hero";
import { BookOpen, Loader } from "lucide-react";
import API_URL from "../config";

const Home = () => {
  const navigate = useNavigate();
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentBooks();
  }, []);

  const fetchRecentBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/get-recent-book`);
      const data = await response.json();
      if (response.ok) {
        setRecentBooks(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Hero />
      
      {/* Recent Books Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen size={32} className="text-yellow-400" />
            <h2 className="text-3xl font-bold text-yellow-400">Recently Added Books</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader size={32} className="text-yellow-400 animate-spin" />
            </div>
          ) : recentBooks.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No books available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentBooks.map((book) => (
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
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
