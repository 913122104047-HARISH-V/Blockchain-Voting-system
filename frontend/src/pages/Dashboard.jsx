import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from '../components/dashboard/AdminDashboard';
import VoterDashboard from '../components/dashboard/VoterDashboard';
import api from "../api/axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedRole = localStorage.getItem("role");
        const token = savedRole === "admin" ? localStorage.getItem("adminToken") : localStorage.getItem("token");
        if (!token) throw new Error("No token");

        let res;
        if (savedRole === "admin") {
          res = await api.get("/api/admin/dashboard", { headers: { Authorization: `Bearer ${token}` } });
        } else {
          res = await api.get("/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } });
        }

        setUser(res.data);
        setRole(savedRole);
        setLoading(false);
      } catch (err) {
        console.error(err);
        navigate("/auth");
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-xl font-semibold">Loading...</div></div>;
  if (!user) return null;

  if (role === "admin") return <AdminDashboard />;
  if (role === "voter") return <VoterDashboard />;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">No Role Assigned</h1>
        <p className="text-gray-600">Please contact an administrator to assign your role.</p>
      </div>
    </div>
  );
};

export default Dashboard;
