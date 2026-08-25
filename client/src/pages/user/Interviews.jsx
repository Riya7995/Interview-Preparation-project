import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiArrowLeft,
  FiBriefcase,
  FiClock,
  FiCode,
  FiSearch,
  FiTarget,
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../services/api";

const Interviews = () => {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState("");

  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [interviewRes, categoryRes] = await Promise.all([
          api.get("/interview/all-interviews?limit=20", config),
          api.get("/categories/all-categories", config),
        ]);

        setInterviews(interviewRes.data.interviews || []);
        setCategories(categoryRes.data.categories || []);
      } catch (error) {
        toast.error(error.response.data.msg || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Start
  const startInterview = async (id) => {
    try {
      setStarting(id);

      const response = await api.post(
        `/attempts/start-interview/${id}`,
        {},
        config,
      );
      

      toast.success(response.data.msg || "Interview Started");

      navigate(`/interview/${response.data.attempt._id}`);
    } catch (error) {
      toast.error(error.response.data.msg || "Unable to start interview");
    } finally {
      setStarting("");
    }
  };

  const filtered = interviews.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(search.toLowerCase());

    const categoryMatch = !category || item.categoryId._id === category;

    const difficultyMatch = !difficulty || item.difficulty === difficulty;

    return titleMatch && categoryMatch && difficultyMatch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          onClick={() => navigate("/dashboard")}
        >
          <FiArrowLeft />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-400">
            Interview Practice
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Choose your interview
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Select an interview and start your AI-powered practice.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-7 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search interviews..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500"
          >
            <option value="">All Categories</option>

            {categories.map((item) => (
              <option key={item._id} value={item._id}>
                {item.categoryName}
              </option>
            ))}
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500"
          >
            <option value="">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 py-16 text-center">
            <FiTarget className="mx-auto text-3xl text-slate-700" />
            <p className="mt-3 text-sm text-slate-500">No interviews found.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition hover:-translate-y-1 hover:border-indigo-500/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    <FiBriefcase />
                  </div>

                  <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] capitalize text-indigo-400">
                    {item.difficulty}
                  </span>
                </div>

                <h2 className="mt-5 text-lg font-semibold">{item.title}</h2>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>

                <div className="mt-5 flex items-center gap-4 border-t border-slate-800 pt-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <FiClock />
                    {item.duration} min
                  </span>

                  <span className="flex items-center gap-1.5">
                    <FiCode />
                    {item.categoryId?.categoryName || "General"}
                  </span>
                </div>

                <button
                  disabled={starting === item._id}
                  onClick={() => startInterview(item._id)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold transition hover:bg-indigo-500 disabled:opacity-60"
                >
                  {starting === item._id ? "Starting..." : "Start Interview"}

                  {starting !== item._id && <FiArrowRight />}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Interviews;
