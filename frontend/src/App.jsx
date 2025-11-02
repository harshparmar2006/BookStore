import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Hero from "./pages/Hero/Hero";
import Home from "./pages/Home";
import AllBooks from "./pages/AllBooks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BookDetails from "./pages/BookDetails";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<AllBooks />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
