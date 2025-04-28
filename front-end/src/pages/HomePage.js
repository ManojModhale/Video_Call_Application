// HomePage.js
//import React from 'react';
import React, { useEffect, useState } from "react";
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import VideoCall from '../video-Call/videocall';
import LiveStream from '../live-stream/livestream';
import Swal from "sweetalert2";

const HomePage = () => {
  const [activePage, setActivePage] = useState("home-content");
  //const [meetingsOpen, setMeetingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "home", label: "Home", icon: "ri-home-line", route: "/home/home-content" },
    { id: "meetings", label: "Meetings", icon: "ri-video-line", route: "/home/call" },
    { id: "live-Stream", label: "Live Stream", icon: "ri-live-line", route: "/home/live" },
    { id: "settings", label: "Settings", icon: "ri-settings-3-line", route: "/home/settings" },
    { id: "logout", label: "Logout", icon: "ri-logout-box-line", route: "/home/logout" }
  ];

  const handleNavigation = (page, route) => {
    setActivePage(page);
    navigate(route);
    
  };

  // Determine the initial active page based on the current URL
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith('/home/live')) {
      setActivePage('live-stream');
    } else if (path.startsWith('/home/call')) {
      setActivePage('meeting');
    } else if (path.startsWith('/home/settings')) {
      setActivePage('settings');
    } else if (path.startsWith('/home/logout')) {
      setActivePage('logout');
    } else {
      setActivePage('home-content');
    }
  }, [location]);

  // Handle logout logic when the activePage is "logout"
  useEffect(() => {
    if (activePage === "logout") {
      Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out of the application!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, logout!"
      }).then((result) => {
        if (result.isConfirmed) {
          // Clear session or authentication token
          localStorage.removeItem("authToken"); // Example
          Swal.fire("Logged Out!", "You have been logged out.", "success").then(
            () => {
              navigate("/login"); // Redirect to login page
            }
          );
        } else {
          // Navigate back to home-content if the user cancels
          navigate("/home/home-content");
          setActivePage("home-content");
        }
      });
    }
  }, [activePage, navigate]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-primary">Video Calling</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => (
            item.submenu ? (
              <div key={item.id} className="flex flex-col">
                <div
                  className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer justify-between ${activePage === item.id ? "bg-gray-100" : ""}`}
                  onClick={() => handleNavigation(item.id, item.route)}
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 flex items-center justify-center mr-3">
                      <i className={`${item.icon} text-lg`}></i>
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <i className="ri-arrow-down-s-line"></i>
                </div>
              </div>
            ) : (
              <div
                key={item.id}
                onClick={() => handleNavigation(item.id, item.route)}
                className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer ${activePage === item.id ? "bg-gray-100" : ""}`}
              >
                <div className="w-6 h-6 flex items-center justify-center mr-3">
                  <i className={`${item.icon} text-lg`}></i>
                </div>
                <span>{item.label}</span>
              </div>
            )
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="text-lg font-semibold capitalize">{activePage}</div>
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => setIsProfileOpen(true)}
          >
            <img
              src="https://via.placeholder.com/32"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <i className="ri-arrow-down-s-line"></i>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <Routes>
            <Route path='/call' element={<VideoCall />} />
            <Route path='/live' element={<LiveStream />} />
            <Route path="/home-content" element={<div>Welcome to the Home Page</div>} />
            <Route path="/webinar" element={<div>Host or Join a Webinar</div>} />
            <Route path="/settings" element={<div>Adjust your Settings</div>} />
            <Route path="/logout" element={<div>You have logged out</div>} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
            <p className="mb-6 text-gray-600">Manage your account information.</p>
            <button
              onClick={() => setIsProfileOpen(false)}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );

};
export default HomePage;
