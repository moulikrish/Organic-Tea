import React, { useContext, useState } from "react";
import { GeneralContext } from "../context/GeneralContext";

const Register = ({ setIsLogin }) => {
  const { setUsername, setEmail, setPassword, setUsertype, register } =
    useContext(GeneralContext);

  const [showPass, setShowPass] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    await register();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-200 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 tracking-wide">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Join us and explore your journey</p>
        </div>

        <form
          className="mt-6 space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
          onSubmit={handleRegister}
        >
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400
              focus:ring-2 focus:ring-gray-900/40 focus:border-gray-800 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400
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
                placeholder="Create password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400
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

          {/* User Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Type
            </label>
            <select
              required
              onChange={(e) => setUsertype(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white 
              focus:ring-2 focus:ring-gray-900/40 focus:border-gray-800 transition-all"
            >
              <option value="">Select Type</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white bg-gray-900 hover:bg-gray-800 
            focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-200"
          >
            Create Account
          </button>

          {/* Already Registered? */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              className="font-semibold text-gray-900 hover:underline"
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
          </p>
        </form>

        <p className="text-center text-xs text-gray-500 mt-3">
          By registering, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Register;
