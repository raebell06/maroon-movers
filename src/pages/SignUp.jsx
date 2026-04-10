import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("rider");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateAamuEmail = (em) => {
    return /^[A-Za-z0-9._%+-]+@bulldogs\.aamu\.edu$/i.test(em.trim());
  };

  const handleSubmit = async (e) => {
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

    setLoading(true);

    try {
      // Extract first and last names
      const [firstName, ...lastNameParts] = fullName.trim().split(" ");
      const lastName = lastNameParts.join(" ") || "User";

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          password,
          role: userType
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      // Store user with role
      login({ email: data.user.email, name: data.user.name, role: userType }, data.token);
      navigate(userType === "driver" ? "/driver/rides" : "/rides");
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    }

    setLoading(false);
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

        {/* User Type Selection */}
        <div className="flex gap-3 bg-gray-100 p-1 rounded-lg mb-4">
          <button
            type="button"
            onClick={() => setUserType("rider")}
            className={`flex-1 py-2 px-3 rounded-md font-semibold transition-all text-sm ${
              userType === "rider"
                ? "bg-maroon-600 text-white"
                : "bg-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            🧑 Rider
          </button>
          <button
            type="button"
            onClick={() => setUserType("driver")}
            className={`flex-1 py-2 px-3 rounded-md font-semibold transition-all text-sm ${
              userType === "driver"
                ? "bg-maroon-600 text-white"
                : "bg-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            🚙 Driver
          </button>
        </div>

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

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-maroon-700 text-white font-semibold hover:bg-maroon-800 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
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
