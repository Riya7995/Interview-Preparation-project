import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import {
  FiArrowRight,
  FiBarChart2,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiPlay,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

import Navbar from "../../components/user/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalAttempts: 0,
    completedAttempts: 0,
    pendingAttempts: 0,
    averageScore: 0,
  });
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dashboard Data
  const getDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const [profile, stats, activity] = await Promise.allSettled([
        api.get("/users/profile", config),
        api.get("/attempts/analytics/my-analytics", config),
        api.get("/attempts/my-attempts", config),
      ]);

      if (profile.status === "fulfilled") {
        setUser(profile.value.data.user);
      }

      if (stats.status === "fulfilled") {
        setAnalytics(stats.value.data.analytics);
      }

      if (activity.status === "fulfilled") {
        setAttempts(activity.value.data.attempts || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
      </div>
    );
  }

  const averageScore = Math.round(analytics.averageScore || 0);
  const latestAttempt = attempts[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}

        <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-medium text-indigo-400">
              Welcome back, {user.fullName}👋
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to ace your next interview?
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Practice interviews, improve your skills and track your
              performance with AI-powered insights.
            </p>
          </div>

          <button
            className="group flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold hover:bg-indigo-500"
            onClick={() => navigate("/interviews")}
          >
            <FiPlay size={16} />
            Start Interview
            <FiArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </section>

        {/* Stats */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Interviews */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <FiTarget />
            </div>

            <p className="mt-5 text-xs text-slate-500">Total Interviews</p>

            <p className="mt-1 text-2xl font-bold">{analytics.totalAttempts}</p>
          </div>

          {/* Completed */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <FiCheckCircle />
            </div>

            <p className="mt-5 text-xs text-slate-500">Completed</p>

            <p className="mt-1 text-2xl font-bold">
              {analytics.completedAttempts}
            </p>
          </div>

          {/* Average Score */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <FiTrendingUp />
            </div>

            <p className="mt-5 text-xs text-slate-500">Average Score</p>

            <p className="mt-1 text-2xl font-bold">{averageScore}%</p>
          </div>

          {/* Pending */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <FiClock />
            </div>

            <p className="mt-5 text-xs text-slate-500">Pending</p>

            <p className="mt-1 text-2xl font-bold">
              {analytics.pendingAttempts}
            </p>
          </div>
        </section>

        {/* Main */}

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Performance */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Performance Overview</h2>

                <p className="mt-1 text-xs text-slate-600">
                  Your interview performance
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <FiBarChart2 />
              </div>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-8 border-indigo-500/20">
                <div
                  className="absolute inset-1 rounded-full border-4 border-indigo-500/70 border-r-transparent"
                  style={{
                    transform: `rotate(${averageScore * 1.8 - 45}deg)`,
                  }}
                />

                <div className="relative text-center">
                  <p className="text-3xl font-bold">{averageScore}%</p>

                  <p className="text-[10px] text-slate-600">Average</p>
                </div>
              </div>

              <div>
                <p className="text-lg font-semibold">Keep practicing!</p>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Keep practicing interviews and improve your score with
                  AI-powered feedback.
                </p>

                <button
                  className="mt-4 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                  onClick={() => navigate("/performance")}
                >
                  View performance →
                </button>
              </div>
            </div>
          </div>

          {/* Practice */}

          <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-linear-to-br from-indigo-600/20 via-violet-600/10 to-slate-900 p-6">
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                <FiZap size={21} />
              </div>

              <h2 className="mt-5 text-xl font-bold">Practice Interview</h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Start a mock interview and improve your interview skills.
              </p>

              <button
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold hover:bg-indigo-500"
                onClick={() => navigate("/practice")}
              >
                Start Practice
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>

        {/* Recent Activity */}

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Recent Activity</h2>

              <p className="mt-1 text-xs text-slate-600">
                Your latest interview activity
              </p>
            </div>

            <button
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              onClick={() => navigate("/history")}
            >
              View all
            </button>
          </div>

          {latestAttempt ? (
            <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <FiCheckCircle />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {latestAttempt.interviewId.title || "Interview"}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {latestAttempt.status}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:gap-6">
                <span className="text-xs text-slate-600">
                  {latestAttempt.interviewId.difficulty || "Practice"}
                </span>

                <span className="text-sm font-semibold text-emerald-400">
                  {latestAttempt.score || 0}%
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center">
              <p className="text-sm text-slate-500">
                No interview attempts yet.
              </p>

              <button
                onClick={() => navigate("/interviews")}
                className="mt-3 text-xs font-semibold text-indigo-400"
              >
                Start your first interview →
              </button>
            </div>
          )}
        </section>

        {/* Quick Links */}

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {/* Mock Interview */}

          <button
            className="group flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-left hover:border-indigo-500/30"
            onClick={() => navigate("/interviews")}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <FiPlay />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold">Mock Interview</p>

              <p className="mt-1 text-xs text-slate-600">
                Practice a real interview
              </p>
            </div>

            <FiArrowRight className="text-slate-700 group-hover:text-indigo-400" />
          </button>

          {/* Practice Questions */}

          <button
            className="group flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-left hover:border-indigo-500/30"
            onClick={() => navigate("/practice")}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <FiBookOpen />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold">Practice Questions</p>

              <p className="mt-1 text-xs text-slate-600">Improve your skills</p>
            </div>

            <FiArrowRight className="text-slate-700 group-hover:text-indigo-400" />
          </button>

          {/* Performance */}
          <button
            className="group flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-left hover:border-indigo-500/30"
            onClick={() => navigate("/performance")}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <FiBarChart2 />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold">Performance</p>

              <p className="mt-1 text-xs text-slate-600">
                Analyze your progress
              </p>
            </div>

            <FiArrowRight className="text-slate-700 group-hover:text-indigo-400" />
          </button>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
