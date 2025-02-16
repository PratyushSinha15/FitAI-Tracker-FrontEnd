"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-200 transition-all ${
        isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-sm"
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
          <a href="#about" className="hover:text-gray-600">About Us</a>
          <a href="#features" className="hover:text-gray-600">Features</a>
          <a href="#pricing" className="hover:text-gray-600">Pricing</a>
          <a href="#team" className="hover:text-gray-600">Team</a>
          <a href="#contact" className="hover:text-gray-600">Contact</a>
        </div>

        {/* Sign Up Button (Desktop) */}
        <Link to="/auth" className="hidden md:block px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition">
          Sign Up/Login
        </Link>
        
        

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-600"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 py-4 bg-white border-t border-gray-200">
          <a href="#about" className="text-lg font-medium">About Us</a>
          <a href="#features" className="text-lg font-medium">Features</a>
          <a href="#pricing" className="text-lg font-medium">Pricing</a>
          <a href="#team" className="text-lg font-medium">Team</a>
          <a href="#contact" className="text-lg font-medium">Contact</a>
          <Link
            to="/auth"
            className="px-5 py-2 bg-black text-white rounded-full font-medium"
          >
            Sign Up/Log In
          </Link>
          
        </div>
      )}
    </nav>
  );
};

export default Navbar;
