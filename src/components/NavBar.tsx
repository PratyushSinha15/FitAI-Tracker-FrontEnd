import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("authToken");
      setIsAuthenticated(!!token);
    };

    checkAuth(); // Check on mount
    const interval = setInterval(checkAuth, 1000); // Check every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handleLogout = () => {
    Cookies.remove("authToken");
    setIsAuthenticated(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-800 transition-all ${
        isScrolled ? "bg-black shadow-md" : "bg-black shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            Fit AI Trainer
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-white hover:text-gray-400">Home</a>
          <a href="#team" className="text-white hover:text-gray-400">About Us</a>
          <a href="#features" className="text-white hover:text-gray-400">Features</a>
          <a href="#team" className="text-white hover:text-gray-400">Team</a>
        </div>

        {/* Auth Button */}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="hidden md:block px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/auth"
            className="hidden md:block px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
          >
            Sign Up/Login
          </Link>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 py-4 bg-black border-t border-gray-800">
          <a href="#about" className="text-lg font-medium text-white">About Us</a>
          <a href="#features" className="text-lg font-medium text-white">Features</a>
          <a href="#pricing" className="text-lg font-medium text-white">Pricing</a>
          <a href="#team" className="text-lg font-medium text-white">Team</a>
          <a href="#contact" className="text-lg font-medium text-white">Contact</a>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-red-500 text-white rounded-full font-medium"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="px-5 py-2 bg-black text-white rounded-full font-medium"
            >
              Sign Up/Log In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
