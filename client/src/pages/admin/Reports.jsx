import { useEffect, useState } from "react";
import { FiArrowLeft, FiBarChart2, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const Reports = () => {
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await api.get("/attempts/all-attempts", config);
        setAttempts(response.data.attempts || []);
      } catch (error) {
        toast.error(error.response.data.msg || "Unable to load reports");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const filtered = attempts.filter((item) => {
    const user = item.userId.fullName || "";
    const interview = item.interviewId.title || "";

    return `${user} ${interview}`.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <FiArrowLeft /> Dashboard
        </button>

        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-indigo-400">Analytics</p>

            <h1 className="mt-1 text-3xl font-bold">Interview Reports</h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor user interview performance.
            </p>
          </div>

          <FiBarChart2 className="hidden text-3xl text-indigo-400 sm:block" />
        </div>

        <div className="relative mb-5">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user or interview..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">
              Loading reports...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-500">
              No reports found.
            </div>
          ) : (
            <table className="w-full min-w-175 text-left text-sm">
              <thead className="border-b border-slate-800 text-xs text-slate-500">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Interview</th>
                  <th className="px-5 py-4">Score</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/30">
                    <td className="px-5 py-4">
                      <p className="font-medium">
                        {item.userId.fullName || "Unknown"}
                      </p>

                      <p className="text-xs text-slate-600">
                        {item.userId.email || ""}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-400">
                      {item.interviewId.title || "Interview"}
                    </td>

                    <td className="px-5 py-4 font-semibold text-indigo-400">
                      {item.status === "completed" ? `${item.score}%` : "--"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs capitalize text-slate-400">
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-500">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "--"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Reports;
