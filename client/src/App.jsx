import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Signup";
import Dashboard from "./pages/user/Dashboard";
import Profile from "./pages/user/Profile";
import Interviews from "./pages/user/Interviews";
import Interview from "./pages/user/Interview";
import Result from "./pages/user/Result";
import Performance from "./pages/user/Performance";
import History from "./pages/user/History";
import Settings from "./pages/user/Settings";
import Practice from "./pages/user/Practice";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/Users";
import AdminCategory from "./pages/admin/Categories";
import AdminInterviews from "./pages/admin/Interviews";
import AdminReports from "./pages/admin/Reports";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/interview/:id" element={<Interview />} />
          <Route path="/result/:id" element={<Result />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/practice" element={<Practice />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/categories" element={<AdminCategory />} />
          <Route path="/admin/interviews" element={<AdminInterviews />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
