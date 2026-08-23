import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiChevronRight,
  FiClock,
} from "react-icons/fi";

const History = () => {
  const navigate = useNavigate();

  const attempts = [
    {
      id: 1,
      title: "MERN Stack Developer",
      date: "20 Aug 2026",
      score: 82,
      duration: "24 min",
    },
    {
      id: 2,
      title: "React Developer",
      date: "18 Aug 2026",
      score: 76,
      duration: "21 min",
    },
    {
      id: 3,
      title: "Node.js Developer",
      date: "15 Aug 2026",
      score: 88,
      duration: "27 min",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <FiArrowLeft />
            Dashboard
          </button>

          <h1 className="mt-6 text-3xl font-bold">Interview History</h1>

          <p className="mt-2 text-sm text-slate-500">
            Review your previous interview attempts and scores.
          </p>
        </div>

        {/* List */}
        <div className="space-y-4">
          {attempts.map((attempt) => (
            <div
              key={attempt.id}
              className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-indigo-500/30 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="font-semibold">{attempt.title}</h2>

                <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <FiCalendar />
                    {attempt.date}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <FiClock />
                    {attempt.duration}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end sm:gap-6">
                <div>
                  <p className="text-xl font-bold text-indigo-400">
                    {attempt.score}%
                  </p>

                  <p className="text-[11px] text-slate-600">Score</p>
                </div>

                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default History;
