import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <section className="text-center py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-yellow-400">
        Discover Your Next Great Read
      </h1>
      <p className="text-gray-300 max-w-2xl mx-auto mb-8">
        Dive into a world of imagination, knowledge, and adventure with
        thousands of books available at your fingertips.
      </p>
      <Link
        to="/books"
        className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition"
      >
        Explore Books
      </Link>
    </section>
  );
};
export default Hero;
