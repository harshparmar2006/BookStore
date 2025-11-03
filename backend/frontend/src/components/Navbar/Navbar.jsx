import { BookOpen, ShoppingCart, User, Menu, X, LogOut, LogIn, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("userRole");
    
    if (token) {
      setIsAuthenticated(true);
      setUsername(storedUsername || "");
      setUserRole(storedRole || "");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername("");
    setUserRole("");
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left Logo Section */}
        <Link
          to="/"
          className="text-2xl font-bold text-yellow-400 flex items-center gap-2"
        >
          <BookOpen size={26} /> BookHeaven
        </Link>

        {/* Hamburger Button (Visible on small screens only) */}
        <button
          className="text-yellow-400 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="hover:text-yellow-400 transition-colors">
            Home
          </Link>
          <Link to="/books" className="hover:text-yellow-400 transition-colors">
            All Books
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link
                to="/cart"
                className="hover:text-yellow-400 flex items-center gap-1 transition-colors"
              >
                <ShoppingCart size={20} /> Cart
              </Link>
              {userRole === "admin" && (
                <Link
                  to="/admin"
                  className="hover:text-yellow-400 flex items-center gap-1 transition-colors"
                >
                  <Settings size={20} /> Admin
                </Link>
              )}
              <Link
                to="/profile"
                className="hover:text-yellow-400 flex items-center gap-1 transition-colors"
              >
                <User size={20} /> {username || "Profile"}
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-yellow-400 flex items-center gap-1 transition-colors"
              >
                <LogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="hover:text-yellow-400 flex items-center gap-1 transition-colors"
              >
                <LogIn size={20} /> Login
              </Link>
              <Link
                to="/signup"
                className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="flex flex-col items-center mt-4 space-y-3 md:hidden">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="hover:text-yellow-400 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/books"
            onClick={() => setIsOpen(false)}
            className="hover:text-yellow-400 transition-colors"
          >
            All Books
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="hover:text-yellow-400 flex items-center gap-1 transition-colors"
              >
                <ShoppingCart size={20} /> Cart
              </Link>
              {userRole === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="hover:text-yellow-400 flex items-center gap-1 transition-colors"
                >
                  <Settings size={20} /> Admin
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="hover:text-yellow-400 flex items-center gap-1 transition-colors"
              >
                <User size={20} /> {username || "Profile"}
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="hover:text-yellow-400 flex items-center gap-1 transition-colors"
              >
                <LogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="hover:text-yellow-400 flex items-center gap-1 transition-colors"
              >
                <LogIn size={20} /> Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
