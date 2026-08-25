import { useEffect, useState } from "react";
import { FiArrowLeft, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const Interviews = () => {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    difficulty: "medium",
    duration: 30,
  });

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const loadData = async () => {
    try {
      const [interviewRes, categoryRes] = await Promise.all([
        api.get("/interview/all-interviews?limit=20", config),
        api.get("/categories/all-categories", config),
      ]);

      setInterviews(interviewRes.data.interviews || []);
      setCategories(categoryRes.data.categories || []);
    } catch (error) {
      toast.error(error.response.data.msg || "Unable to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const save = async (e) => {
    e.preventDefault();

    try {
      if (editing) {
        await api.put(`/interview/update/${editing}`, form, config);
        toast.success("Interview updated");
      } else {
        await api.post("/interview/add-interview", form, config);
        toast.success("Interview added");
      }

      setEditing(null);

      setForm({
        title: "",
        description: "",
        categoryId: "",
        difficulty: "medium",
        duration: 30,
      });

      loadData();
    } catch (error) {
      toast.error(error.response.data.msg || "Operation failed");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this interview?")) return;

    try {
      await api.delete(`/interview/delete/${id}`, config);
      toast.success("Interview deleted");
      loadData();
    } catch (error) {
      toast.error(error.response.data.msg || "Delete failed");
    }
  };

  const edit = (item) => {
    setEditing(item._id);

    setForm({
      title: item.title || "",
      description: item.description || "",
      categoryId: item.categoryId?._id || item.categoryId || "",
      difficulty: item.difficulty || "medium",
      duration: item.duration || 30,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <FiArrowLeft /> Dashboard
        </button>

        <div className="mb-7">
          <h1 className="text-3xl font-bold">Manage Interviews</h1>
          <p className="mt-2 text-sm text-slate-500">
            Create and manage mock interviews.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={save}
          className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="title"
              value={form.title}
              onChange={change}
              placeholder="Interview title"
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            />

            <select
              name="categoryId"
              value={form.categoryId}
              onChange={change}
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            >
              <option value="">Select category</option>

              {categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.categoryName}
                </option>
              ))}
            </select>

            <select
              name="difficulty"
              value={form.difficulty}
              onChange={change}
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={change}
              placeholder="Duration"
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={change}
              placeholder="Description"
              rows="3"
              className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold hover:bg-indigo-500">
              <FiPlus />
              {editing ? "Update Interview" : "Add Interview"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm({
                    title: "",
                    description: "",
                    categoryId: "",
                    difficulty: "medium",
                    duration: 30,
                  });
                }}
                className="rounded-xl border border-slate-800 px-5 py-3 text-sm text-slate-400"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* List */}
        <div className="grid gap-5 md:grid-cols-2">
          {interviews.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold">{item.title}</h2>

                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs capitalize text-indigo-400">
                  {item.difficulty}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {item.description}
              </p>

              <p className="mt-3 text-xs text-slate-600">
                {item.categoryId?.categoryName || "General"} • {item.duration}{" "}
                min
              </p>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => edit(item)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-sm hover:bg-slate-700"
                >
                  <FiEdit2 /> Edit
                </button>

                <button
                  onClick={() => remove(item._id)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Interviews;
