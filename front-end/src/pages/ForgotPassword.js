import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from "react-icons/fa";
import "./ForgotPassword.css";


const ChangePassword = () => {
  const [step, setStep] = useState(1);
  const [generatedOTP, setGeneratedOTP] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmpass: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  //const baseUrl = "http://localhost:8081/user";

  const validateFields = (fields) => {
    const newErrors = {};

    if (fields.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }
    if (
      fields.password &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}$/.test(formData.password)
    ) {
      newErrors.password = "Password must meet complexity requirements.";
    }
    if (fields.confirmpass && formData.password !== formData.confirmpass) {
      newErrors.confirmpass = "Passwords do not match.";
    }
    if (fields.otp && !/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = "OTP must be 6 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerifyEmail = async () => {
    if (!validateFields({ email: true })) return;
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/auth/forgot-password", { email: formData.email });
      setGeneratedOTP(response.data.otp); // Store the OTP for verification
      Swal.fire("Success", "OTP sent to your email!", "success");
      setStep(2);
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Error sending OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    if (formData.otp !== generatedOTP) {
      Swal.fire("Error", "Invalid OTP. Please try again.", "error");
      return;
    }
    Swal.fire("Success", "OTP verified!", "success");
    setStep(3);
  };

  const handleChangePassword = async () => {
    if (!validateFields({ password: true, confirmpass: true })) return;
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/auth/reset-password", {
        email: formData.email,
        password: formData.password,
      });
      Swal.fire("Success", "Password updated successfully!", "success");
      //window.location.href = "/login"; // Redirect to login page
      navigate('/login');
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Error updating password", "error");
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) handleVerifyEmail();
    if (step === 2) handleVerifyOtp();
    if (step === 3) handleChangePassword();
  };

  return (
    <div className="glass-form">
      <div className="progress-bar">
        <div className="step" data-active={step >= 1}></div>
        <div className="step" data-active={step >= 2}></div>
        <div className="step" data-active={step >= 3}></div>
      </div>

      <h2>
        {step === 1 && "Reset Password"}
        {step === 2 && "OTP Verification"}
        {step === 3 && "Create New Password"}
      </h2>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              <input name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
              {errors.email && <p className="error">{errors.email}</p>}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <input name="otp" placeholder="Enter OTP" value={formData.otp} onChange={handleInputChange} />
              {errors.otp && <p className="error">{errors.otp}</p>}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <input name="password" type="password" placeholder="New Password" value={formData.password} onChange={handleInputChange} />
              {errors.password && <p className="error">{errors.password}</p>}

              <input name="confirmpass" type="password" placeholder="Confirm Password" value={formData.confirmpass} onChange={handleInputChange} />
              {errors.confirmpass && <p className="error">{errors.confirmpass}</p>}
            </motion.div>
          )}
        </AnimatePresence>

        <button type="submit" disabled={loading}>
          {loading ? <FaSpinner className="spinner" /> : step === 1 ? "Verify Email" : step === 2 ? "Verify OTP" : "Update Password"}
        </button>
      </form>

      
    </div>
  );
};

export default ChangePassword;
