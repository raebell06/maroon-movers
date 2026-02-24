import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateAamuEmail = (em) => {
    return /^[A-Za-z0-9._%+-]+@bulldogs\.aamu\.edu$/i.test(em.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      return setError("Please fill in all fields.");
    }
    if (!validateAamuEmail(email)) {
      return setError("Use your Alabama A&M email (example@bulldogs.aamu.edu).");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    const user = { email, name: fullName };
    login(user);
    navigate("/rides");
  };

  return (
    <div className="flex items-center justify-center min-h-full bg-maroon-50 px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-maroon-700 text-center">
          Create Account
        </h1>
        <p className="text-sm text-gray-600 text-center mb-4">
          Welcome to Maroon Moves!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
              className="mt-1 block w-full rounded-lg border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-maroon-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              AAMU Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@bulldogs.aamu.edu"
              className="mt-1 block w-full rounded-lg border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-maroon-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 block w-full rounded-lg border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-maroon-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 block w-full rounded-lg border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-maroon-600"
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-maroon-700 text-white font-semibold hover:bg-maroon-800 transition"
          >
            Sign Up
          </button>

          <div className="text-center text-sm text-gray-500 pt-2">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-maroon-700 font-medium"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
