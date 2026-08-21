import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FiBarChart2,
  FiBookOpen,
  FiHome,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiUser,
  FiZap,
} from "react-icons/fi";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  //  Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: FiHome,
    },
    {
      name: "Practice",
      path: "/practice",
      icon: FiBookOpen,
    },
    {
      name: "Interviews",
      path: "/interviews",
      icon: FiZap,
    },
    {
      name: "Performance",
      path: "/performance",
      icon: FiBarChart2,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}

        <NavLink to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-sm font-bold shadow-lg shadow-indigo-500/20">
            IP
          </div>

          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-white">Interview Prep</h1>

            <p className="text-[10px] text-slate-500">AI Interview Platform</p>
          </div>
        </NavLink>

        {/* Desktop Navigation */}

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon size={16} />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Section */}

        <div className="flex items-center gap-2">
          {/* Profile */}

          <button className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 md:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold">
              U
            </div>

            <span className="text-sm font-medium text-slate-300">Profile</span>
          </button>

          {/* Settings */}

          <button
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-slate-700 hover:text-white md:flex"
            title="Settings"
          >
            <FiSettings size={17} />
          </button>

          {/* Logout UI */}

          <button
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 md:flex"
            title="Logout"
            onClick={handleLogout}
          >
            <FiLogOut size={17} />
          </button>

          {/* Mobile Menu UI */}

          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 lg:hidden">
            <FiMenu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
