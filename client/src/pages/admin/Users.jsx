import { useEffect, useState } from "react";
import { FiArrowLeft, FiSearch, FiTrash2, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const loadUsers = async () => {
    try {
      const response = await api.get("/users/all-users", config);
      setUsers(response.data.users || []);
    } catch (error) {
      toast.error(error.response.data.msg || "Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/delete-user/${id}`, config);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      toast.error(error.response.data.msg || "Delete failed");
    }
  };

  const filtered = users.filter((user) =>
    `${user.fullName} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <FiArrowLeft /> Dashboard
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="mt-2 text-sm text-slate-500">
            View and manage registered users.
          </p>
        </div>

        <div className="relative mb-5">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">
              Loading users...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-500">
              No users found.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {filtered.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-indigo-600">
                      {user.profileImage ? (
                        <img
                          src={`${import.meta.env.VITE_BASE_URL}/uploads/${user.profileImage}`}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FiUser />
                      )}
                    </div>

                    <div>
                      <h2 className="font-semibold">
                        {user.fullName || "Unknown"}
                      </h2>

                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs capitalize text-indigo-400">
                      {user.role || "user"}
                    </span>

                    <button
                      onClick={() => deleteUser(user._id)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Users;
