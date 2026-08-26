import { FiArrowLeft, FiLogOut, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Settings = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-7 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <FiArrowLeft />
          Dashboard
        </button>

        <div className="mb-8">
          <p className="text-sm text-indigo-400">Account</p>

          <h1 className="mt-1 text-3xl font-bold">Settings</h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your account settings.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <FiUser />
            </div>

            <div>
              <h2 className="font-semibold">Account</h2>

              <p className="text-sm text-slate-500">
                Manage your profile information.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="mt-5 w-full rounded-xl bg-slate-800 py-3 text-sm font-medium hover:bg-slate-700"
          >
            Go to Profile
          </button>
        </div>

        <button
          onClick={logout}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10"
        >
          <FiLogOut />
          Logout
        </button>
      </main>
    </div>
  );
};

export default Settings;
