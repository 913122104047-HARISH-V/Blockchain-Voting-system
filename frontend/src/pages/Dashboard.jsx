import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from '../components/dashboard/AdminDashboard';
import VoterDashboard from '../components/dashboard/VoterDashboard';
const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // "admin" | "voter" | null

  // Fake auth simulation
  useEffect(() => {
    setTimeout(() => {
      // Change these values for testing
      setUser({ name: "John Doe", email: "john@example.com" });
      setRole("voter"); // change to "voter" or null
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (role === "admin") {
    return  <AdminDashboard />;
  }

  if (role === "voter") {
    return <VoterDashboard />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">No Role Assigned</h1>
        <p className="text-gray-600">
          Please contact an administrator to assign your role.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
