import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaVideo,
  FaUsers,
  FaShieldAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef(null);

    // Function to toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target) &&
                !event.target.classList.contains("mobile-menu-button")
            ) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <header className="bg-blue-900 text-white py-4 shadow-md" id="navbar">
                <div className="container mx-auto flex justify-between items-center px-4">
                    <Link to="/" className="text-3xl font-bold text-yellow-400">
                        VideoCall.io
                    </Link>
                    <div className="flex items-center">
                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-white focus:outline-none mobile-menu-button"
                            onClick={toggleMobileMenu}
                            aria-label="Toggle Mobile Menu"
                        >
                            {isMobileMenuOpen ? (
                                <FaTimes className="h-6 w-6" />
                            ) : (
                                <FaBars className="h-6 w-6" />
                            )}
                        </button>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-6">
                            <Link
                                to="/"
                                className="hover:text-yellow-300 transition-colors"
                            >
                                Home
                            </Link>
                            <a
                                href="#features"
                                className="hover:text-yellow-300 transition-colors"
                            >
                                Features
                            </a>
                            <a
                                href="#about"
                                className="hover:text-yellow-300 transition-colors"
                            >
                                About
                            </a>
                            <a
                                href="#contact"
                                className="hover:text-yellow-300 transition-colors"
                            >
                                Contact
                            </a>
                            <Link
                                to="/register"
                                className="hover:text-yellow-300 transition-colors"
                            >
                                Sign Up
                            </Link>
                            <Link
                                to="/login"
                                className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors"
                            >
                                Log In
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div
                        ref={mobileMenuRef}
                        className="md:hidden bg-blue-900 text-white absolute top-full right-0 left-0 z-50"
                        aria-label="Mobile Menu"
                    >
                        <nav className="flex flex-col items-center py-4 space-y-4">
                            <Link
                                to="/"
                                className="hover:text-yellow-300 transition-colors block"
                                onClick={toggleMobileMenu}
                            >
                                Home
                            </Link>
                            <a
                                href="#features"
                                className="hover:text-yellow-300 transition-colors block"
                                onClick={toggleMobileMenu}
                            >
                                Features
                            </a>
                            <a
                                href="#about"
                                className="hover:text-yellow-300 transition-colors block"
                                onClick={toggleMobileMenu}
                            >
                                About
                            </a>
                            <a
                                href="#contact"
                                className="hover:text-yellow-300 transition-colors block"
                                onClick={toggleMobileMenu}
                            >
                                Contact
                            </a>
                            <Link
                                to="/register"
                                className="hover:text-yellow-300 transition-colors block"
                                onClick={toggleMobileMenu}
                            >
                                Sign Up
                            </Link>
                            <Link
                                to="/login"
                                className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors block"
                                onClick={toggleMobileMenu}
                            >
                                Log In
                            </Link>
                        </nav>
                    </div>
                )}
            </header>

      {/* Hero Section */}
      <section className="py-24">
        <div className="container mx-auto text-center md:text-left md:flex md:items-center md:justify-between px-4">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-6xl font-extrabold leading-tight mb-6 text-blue-900">
              Seamless Video Calls for Everyone
            </h2>
            <p className="text-lg mb-8 text-gray-700">
              Connect with friends, family, and colleagues anywhere in the world
              with our reliable and crystal-clear video conferencing platform.
            </p>
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-md shadow-md hover:bg-yellow-500 transition-colors inline-block"
              >
                Start for Free
              </Link>
              <a className="bg-gray-100 text-blue-900 px-6 py-3 rounded-md shadow-md hover:bg-gray-200 transition-colors inline-block"
                href="about">Learn More</a>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="images/video-call-laptop.jpg"
              alt="Video Call Illustration"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20" id="features">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-5xl font-extrabold leading-tight mb-6 text-blue-900">
            Features You'll Love
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 shadow-lg rounded-xl hover:shadow-xl transition-shadow bg-gray-50">
              <div className="w-12 h-12 rounded-full bg-blue-100 inline-flex items-center justify-center text-blue-600 mb-4">
                <FaVideo className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">One-on-One Calls</h3>
              <p className="text-gray-600">
                Have private and secure video calls with unmatched quality.
              </p>
            </div>

            <div className="p-8 shadow-lg rounded-xl hover:shadow-xl transition-shadow bg-gray-50">
              <div className="w-12 h-12 rounded-full bg-blue-100 inline-flex items-center justify-center text-blue-600 mb-4">
                <FaUsers className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Group Calls</h3>
              <p className="text-gray-600">
                Connect with your team or friends in a single call with up to 100 participants.
              </p>
            </div>

            <div className="p-8 shadow-lg rounded-xl hover:shadow-xl transition-shadow bg-gray-50">
              <div className="w-12 h-12 rounded-full bg-blue-100 inline-flex items-center justify-center text-blue-600 mb-4">
                <FaShieldAlt className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Live Stream</h3>
              <p className="text-gray-600">
                Enjoy peace of mind with advanced encryption for every call.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-blue-50 py-20" id="about">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-5xl font-extrabold leading-tight mb-6 text-blue-900">
            About Us
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            VideoCall.io is on a mission to bring people closer with easy-to-use,
            high-quality video conferencing. Whether for work or personal use, we
            ensure every connection is seamless, secure, and dependable.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white py-20">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-5xl font-extrabold leading-tight mb-6 text-blue-900">
            Contact Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 inline-flex items-center justify-center text-blue-600 mb-4">
                <FaPhoneAlt className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Call Us</h3>
              <p className="text-gray-600">+91 9871263540</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 inline-flex items-center justify-center text-blue-600 mb-4">
                <FaEnvelope className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Us</h3>
              <p className="text-gray-600">support@videocall.io</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 inline-flex items-center justify-center text-blue-600 mb-4">
                <FaUsers className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Office</h3>
              <p className="text-gray-600">Pune, MH India-411037</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div>
            <Link to="/" className="text-2xl font-bold text-yellow-400">
              VideoCall.io
            </Link>
            <p className="text-gray-400 mt-4">
              Connecting the world, one call at a time.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="text-white-400 space-y-2">
              <li><a href="#navbar" className="hover:text-yellow-300 transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-yellow-300 transition-colors">Features</a></li>
              <li><a href="#about" className="hover:text-yellow-300 transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-yellow-300 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://x.com" className="hover:text-yellow-400"><FaTwitter className="h-6 w-6" /></a>
              <a href="https://www.linkedin.com" className="hover:text-yellow-400"><FaLinkedin className="h-6 w-6" /></a>
              <a href="https://www.facebook.com" className="hover:text-yellow-400"><FaFacebook className="h-6 w-6" /></a>
              <a href="https://www.instagram.com" className="hover:text-yellow-400"><FaInstagram className="h-6 w-6" /></a>
            </div>
            <p className="text-gray-400 mt-4">&copy; 2025 VideoCall.io. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
