import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiFolder,
  FiBriefcase,
  FiBarChart2,
  FiArrowRight,
  FiLogOut,
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    users: 0,
    categories: 0,
    interviews: 0,
  });
  const [loading, setLoading] = useState(true);

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [users, categories, interviews] = await Promise.all([
          api.get("/users/all-users", config),
          api.get("/categories/all-categories", config),
          api.get("/interview/all-interviews?limit=20", config),
        ]);

        setData({
          users: users.data.users.length || 0,
          categories: categories.data.categories.length || 0,
          interviews: interviews.data.interviews.length || 0,
        });
      } catch (error) {
        toast.error(error.response.data.msg || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: data.users,
      icon: FiUsers,
      path: "/admin/users",
    },
    {
      title: "Categories",
      value: data.categories,
      icon: FiFolder,
      path: "/admin/categories",
    },
    {
      title: "Interviews",
      value: data.interviews,
      icon: FiBriefcase,
      path: "/admin/interviews",
    },
    {
      title: "Reports",
      value: "View",
      icon: FiBarChart2,
      path: "/admin/reports",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex mb-8 items-start justify-between gap-4">
          <div>
            <p className="text-sm text-indigo-400">Administration</p>
            <h1 className="mt-1 text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage your Interview Prep platform.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-red-500/10 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/15"
          >
            <FiLogOut />
            Logout
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <button
                  key={card.title}
                  onClick={() => navigate(card.path)}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-left transition hover:-translate-y-1 hover:border-indigo-500/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                      <Icon />
                    </div>

                    <FiArrowRight className="text-slate-600" />
                  </div>

                  <p className="mt-6 text-2xl font-bold">{card.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{card.title}</p>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
