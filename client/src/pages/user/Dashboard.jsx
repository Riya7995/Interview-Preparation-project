import {
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiPlay,
  FiTarget,
  FiTrendingUp,
  FiZap,
  FiBookOpen,
} from "react-icons/fi";

import Navbar from "../../components/user/Navbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}

      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}

        <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-medium text-indigo-400">
              Welcome back 👋
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to ace your next interview?
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Practice interviews, improve your skills and track your
              performance with AI-powered insights.
            </p>
          </div>

          <button className="group flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500">
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
          <StatCard icon={<FiTarget />} title="Total Interviews" value="12" />

          <StatCard icon={<FiCheckCircle />} title="Completed" value="8" />

          <StatCard icon={<FiTrendingUp />} title="Average Score" value="78%" />

          <StatCard icon={<FiClock />} title="Practice Hours" value="14h" />
        </section>

        {/* Main Content */}

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Performance Card */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Performance Overview</h2>

                <p className="mt-1 text-xs text-slate-600">
                  Your interview performance
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <FiBarChart2 size={19} />
              </div>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {/* Score */}

              <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-8 border-indigo-500/20">
                <div className="absolute inset-1 rounded-full border-4 border-indigo-500/70 border-r-transparent" />

                <div className="relative text-center">
                  <p className="text-3xl font-bold">78%</p>

                  <p className="text-[10px] text-slate-600">Average</p>
                </div>
              </div>

              {/* Performance Info */}

              <div>
                <p className="text-lg font-semibold">Good progress!</p>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Your performance is improving. Keep practicing to reach your
                  target score.
                </p>

                <button className="mt-4 text-xs font-semibold text-indigo-400 transition hover:text-indigo-300">
                  View full performance →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Practice */}

          <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-linear-to-br from-indigo-600/20 via-violet-600/10 to-slate-900 p-6">
            {/* Glow */}

            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                <FiZap size={21} />
              </div>

              <h2 className="mt-5 text-xl font-bold">Practice Interview</h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Start a realistic mock interview and get AI-powered feedback on
                your answers.
              </p>

              <button className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold transition hover:bg-indigo-500">
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

            <button className="text-xs font-semibold text-indigo-400 transition hover:text-indigo-300">
              View all
            </button>
          </div>

          {/* Activity */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <FiCheckCircle />
              </div>

              <div>
                <p className="text-sm font-medium">Technical Interview</p>

                <p className="mt-1 text-xs text-slate-600">
                  Completed recently
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end sm:gap-6">
              <span className="text-xs text-slate-600">20 min</span>

              <span className="text-sm font-semibold text-emerald-400">
                82%
              </span>
            </div>
          </div>
        </section>

        {/* Bottom Quick Links */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickCard
            icon={<FiPlay />}
            title="Mock Interview"
            description="Practice a real interview"
          />

          <QuickCard
            icon={<FiBookOpen />}
            title="Practice Questions"
            description="Improve your technical skills"
          />

          <QuickCard
            icon={<FiBarChart2 />}
            title="Your Performance"
            description="Analyze your progress"
          />
        </section>
      </main>
    </div>
  );
};

// Stat Card

const StatCard = ({ icon, title, value }) => {
  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition hover:-translate-y-0.5 hover:border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
          {icon}
        </div>

        <FiArrowRight
          size={16}
          className="text-slate-700 transition group-hover:translate-x-1 group-hover:text-slate-500"
        />
      </div>

      <p className="mt-5 text-xs text-slate-500">{title}</p>

      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
};

// Quick Card

const QuickCard = ({ icon, title, description }) => {
  return (
    <button className="group flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-left transition hover:border-indigo-500/30 hover:bg-slate-900">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">{title}</p>

        <p className="mt-1 text-xs text-slate-600">{description}</p>
      </div>

      <FiArrowRight
        size={16}
        className="text-slate-700 transition group-hover:translate-x-1 group-hover:text-indigo-400"
      />
    </button>
  );
};

export default Dashboard;
