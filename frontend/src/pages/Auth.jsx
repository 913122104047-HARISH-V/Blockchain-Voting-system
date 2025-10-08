import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("login");
  const [aadhar, setAadhar] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false); // New state
  const [adminForm, setAdminForm] = useState({ name: "", password: "" });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/auth/send-otp", {
        aadharNumber: aadhar,
      });
      alert(res.data.message);
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/auth/verify-otp", {
        aadharNumber: aadhar,
        otp,
      });
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert(`Admin logged in..`);
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full text-2xl">
            🗳️
          </div>
          <h1 className="text-2xl font-bold">Blockchain Voting System</h1>
          <p className="text-gray-600 text-sm">
            Secure, Transparent, Tamper-Proof Elections
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            className={`flex-1 py-2 text-center ${
              tab === "login"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              tab === "adminlogin"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setTab("adminlogin")}
          >
            Admin Login
          </button>
        </div>

        {/* Aadhaar Login */}
        {tab === "login" && (
          <form
            onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium">
                Aadhaar Number
              </label>
              <input
                type="text"
                value={aadhar}
                onChange={(e) => (setAadhar(e.target.value))}
                required
                disabled={otpSent}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
              />
            </div>

            {otpSent && (
              <div>
                <label className="block text-sm font-medium">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => (setOtp(e.target.value))}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {loading
                ? "Processing..."
                : otpSent
                ? "Verify OTP"
                : "Send OTP"}
            </button>
          </form>
        )}

        {/* Admin Login */}
        {tab === "adminlogin" && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                value={adminForm.name}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, name: e.target.value })
                }
                required
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={adminForm.password}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, password: e.target.value })
                }
                required
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
          <span className="text-blue-600">🔒</span>
          <span>Secured by Blockchain Technology</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
