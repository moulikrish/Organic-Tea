import React, { useContext, useState } from "react";
import { GeneralContext } from "../context/GeneralContext";
import { Link } from "react-router-dom";

const Login = ({ setIsLogin }) => {
  const { setEmail, setPassword, login } = useContext(GeneralContext);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-200 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 tracking-wide">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to continue</p>
        </div>

        {/* Form */}
        <form
          className="mt-6 space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
          onSubmit={handleLogin}
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400
              focus:ring-2 focus:ring-gray-900/40 focus:border-gray-800 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400
                focus:ring-2 focus:ring-gray-900/40 focus:border-gray-800 transition-all"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-600"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Sign in Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white bg-gray-900 hover:bg-gray-800 
            focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-200"
          >
            Sign In
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            New user?{" "}
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className="text-gray-900 font-semibold hover:underline"
            >
              Create Account
            </button>
          </p>
        </form>

        {/* Info */}
        <p className="text-center text-xs text-gray-500 mt-3">
          Encrypted & secure authentication
        </p>
      </div>
    </div>
  );
};

export default Login;
