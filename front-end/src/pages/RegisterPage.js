import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert
import './RegisterPage.css'; 

const FloatingInput = ({ id, label, type = "text", value, onChange, toggleVisibility }) => (
  <div className="relative mb-8">
    <input
      id={id}
      type={type}
      placeholder=" "
      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-transparent bg-white/90 backdrop-blur-sm"
      value={value}
      onChange={onChange}
      autoComplete={type === "password" ? "new-password" : "off"}
    />
    <label
      htmlFor={id}
      className="absolute left-2 -top-3 text-gray-600 text-sm bg-white px-1 transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-sm"
    >
      {label}
    </label>
    {toggleVisibility && (
      <button
        type="button"
        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 w-6 h-6 flex items-center justify-center"
        onClick={toggleVisibility}
      >
        {type === "password" ? (
          <i className="ri-eye-line"></i>
        ) : (
          <i className="ri-eye-off-line"></i>
        )}
      </button>
    )}
  </div>
);

const FloatingSelect = ({ id, label, value, onChange }) => (
  <div className="relative mb-8">
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none pr-10 bg-white/90 backdrop-blur-sm"
    >
      <option value="" disabled hidden />
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
    <label
      htmlFor={id}
      className="absolute left-2 -top-3 text-gray-600 text-sm bg-white px-1 transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-sm"
    >
      {label}
    </label>
    <div className="absolute right-3 top-3 pointer-events-none text-gray-500">
      <i className="ri-arrow-down-s-line" />
    </div>
  </div>
);

const CreateAccount = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const toggleVisibility = (field) => {
    if (field === "password") setPasswordVisible(!passwordVisible);
    if (field === "confirmPassword")
      setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.id]: "" })); // Clear error on change
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
      valid = false;
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
      valid = false;
    }
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
      valid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^\S+@\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
      valid = false;
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
      valid = false;
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
      valid = false;
    } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one symbol (@$!%*?&)";
      valid = false;
    }

    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required";
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate an API call
      const response = await fetch("http://localhost:5000/auth/register", {
        // Replace with your API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful:", data);
        // Use SweetAlert for success
        Swal.fire({
          title: "Success",
          text: "Your account has been created successfully!",
          icon: "success",
          timer: 3000,
          confirmButtonText: "Continue",
        }).then(() => {
          // You can add navigation logic here if needed.
          navigate('/login');
        });
      } else {
        // Use SweetAlert for error
        Swal.fire({
          title: "Error",
          text: data.message || "Registration failed.",
          icon: "error",
          timer: 3000,
          confirmButtonText: "Try Again",
        });
        console.error("Registration error:", data);
        setErrors({ form: data.message || "Registration failed." }); // Set form-level error
      }
    } catch (error) {
      console.error("Signup Failed", error);
      Swal.fire({
        title: 'Server Error',
        text: "An error occurred during Registration. Please try again later.",
        icon: "error",
        timer: 3000,
        confirmButtonText: "Try Again",
      });
      setErrors({
        form: "An error occurred. Please try again later.",
      }); // Set form-level error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative font-inter bg-gradient-to-br from-gray-100 to-gray-50">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-blue-500/20 filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-52 h-52 rounded-full bg-green-500/20 filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-purple-500/20 filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6 border border-white/10"
      >
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-2">
            Video Call
          </h1>
          <p className="text-sm text-gray-500 tracking-wide">
            Create your secure video conference account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">
            Create your account
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <FloatingInput
              id="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1 col-span-2">
                {errors.firstName}
              </p>
            )}
            <FloatingInput
              id="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1 col-span-2">
                {errors.lastName}
              </p>
            )}
          </div>

          <FloatingSelect
            id="gender"
            label="Gender"
            value={formData.gender}
            onChange={handleChange}
          />
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
          )}

          <FloatingInput
            id="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}

          <FloatingInput
            id="password"
            label="Password"
            type={passwordVisible ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            toggleVisibility={() => toggleVisibility("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}

          <FloatingInput
            id="confirmPassword"
            label="Confirm Password"
            type={confirmPasswordVisible ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            toggleVisibility={() => toggleVisibility("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
          {errors.form && (
            <p className="text-red-500 text-sm mt-1">{errors.form}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-md shadow-md transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-sm text-gray-600 text-center mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-500 font-medium hover:text-blue-700 transition-colors link-hover"
            >
              Sign In
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateAccount;
