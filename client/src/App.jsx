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

import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/interview/:id" element={<Interview />} />
          <Route path="/result" element={<Result />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;