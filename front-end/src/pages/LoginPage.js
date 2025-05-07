import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './LoginPage.css'; // Assuming you have some custom styles

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => {
    let newError = "";
    let valid = true;

    if (!password.trim()) {
      newError = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newError = "Password must be at least 6 characters";
      valid = false;
    } else if (!/(?=.*[a-z])/.test(password)) {
      newError = "Password must contain at least one lowercase letter";
      valid = false;
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newError = "Password must contain at least one uppercase letter";
      valid = false;
    } else if (!/(?=.*\d)/.test(password)) {
      newError = "Password must contain at least one number";
      valid = false;
    } else if (!/(?=.*[@$!%*?&])/.test(password)) {
      newError = "Password must contain at least one symbol (@$!%*?&)";
      valid = false;
    }
    return { valid, error: newError };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Email and password are required.');
      setLoading(false);
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Email and password are required.',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter a valid email address.',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    /*if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Password must be at least 6 characters long.',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }*/

    const passwordValidationResult = validatePassword(password);
    if (!passwordValidationResult.valid) {
      setError(passwordValidationResult.error);
      setLoading(false);
      return; // Stop submission, do NOT show a SweetAlert for password errors
    }

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      const user = data.user;

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Welcome back!',
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          // You can add navigation logic here if needed.
          console.log('Data : ', data);
          console.log('User : - ', user);
          sessionStorage.setItem('username', user.email);
          sessionStorage.setItem('user', JSON.stringify(user));
          navigate('/home');
        });
      } else {
        setError(data.message || 'Login failed. Invalid credentials.');
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: data.message || 'Invalid email or password.',
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      setError('An error occurred during login. Please try again later.');
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'An error occurred during login. Please try again later.',
        timer: 3000,
        showConfirmButton: false,
      });
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-fixed bg-cover bg-center bg-[url('https://readdy.ai/api/search-image?query=minimal%20abstract%20background%20with%20soft%20geometric%20patterns%2C%20very%20light%20and%20clean%20design%2C%20extremely%20subtle%20gradients%20in%20white%20and%20light%20blue%20tones%2C%20professional%20modern%20style%2C%20airy%20and%20spacious%20feel&width=1920&height=1080&seq=5&orientation=landscape')]">
      <div className="w-full max-w-[1000px] mx-auto mt-24">
        <div className="flex items-center justify-between gap-8 bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-gray-100 p-8">
          <div className="w-full max-w-[480px]">
            <div className="text-center mb-8">
              <h1 className="font-bold text-4xl text-primary mb-3">video call</h1>
              <p className="text-gray-600 text-lg font-light">Welcome to your secure video conference portal</p>
            </div>
            <div className="w-full">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sign in to your workspace</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <input
                    type="email"
                    className="form-input w-full px-4 py-3 rounded border border-gray-300 focus:outline-none"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => {
                      if (email && !isValidEmail(email)) setError('Please enter a valid email address');
                      else if (error && error.includes('valid email')) setError('');
                    }}

                  />
                  <label className="floating-label text-gray-500 px-1 ml-3 bg-white">Email address</label>
                  {error && error.includes('valid email') && <div className="error-message text-red-500 text-sm show">{error}</div>}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    className="form-input w-full px-4 py-3 rounded border border-gray-300 focus:outline-none"
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => {
                      const result = validatePassword(password);
                      if (!result.valid) {
                        setError(result.error);
                      } else if (error && !error.includes('valid email')) {
                        setError('');
                      }
                    }}
                  />
                  <label className="floating-label text-gray-500 px-1 ml-3 bg-white">Password</label>
                </div>
                {error && !error.includes('valid email') && <div className="error-message text-red-500 text-sm show">{error}</div>}
                <div className="flex items-center justify-end">
                  <a href="/changepass" className="text-primary text-sm font-medium link-hover">Forgot password?</a>
                </div>
                <button
                  type="submit"
                  className="login-btn w-full py-3 text-white font-medium rounded-button relative overflow-hidden"
                  disabled={loading}
                >
                  {!loading ? 'Sign in' : (
                    <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                </button>
              </form>
            </div>
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account? <a href="/register" className="text-primary font-medium link-hover">Sign up</a>
              </p>
            </div>
          </div>
          <div className="hidden lg:block w-full max-w-[480px]">
            <img
              src="https://readdy.ai/api/search-image?query=3d%20illustration%20of%20a%20young%20professional%20man%20sitting%20at%20desk%20with%20laptop%2C%20wearing%20headphones%20for%20video%20call%2C%20modern%20workspace%20setup%2C%20soft%20lighting%2C%20detailed%20render%2C%20clean%20minimal%20style%2C%20professional%20look%2C%20high%20quality%203d%20character&width=800&height=800&seq=1&orientation=squarish"
              alt="3D illustration of video call"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      {/* {error && !error.includes('valid email') && (
        <div className="fixed top-4 right-4 bg-red-50 text-red-800 px-4 py-3 rounded-lg shadow-lg flex items-center fade-in">
          <i className="ri-error-warning-line mr-2 text-red-600"></i>
          <span>{error}</span>
        </div>
      )} */}
    </div>
  );
};

export default LoginPage;
