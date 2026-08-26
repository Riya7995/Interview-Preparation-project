import { useEffect, useState } from "react";
import { FiArrowLeft, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const Categories = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    categoryName: "",
    description: "",
    status: "active",
  });
  const [editId, setEditId] = useState(null);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const getCategories = async () => {
    try {
      const res = await api.get("/categories/all-categories", {
        headers,
      });
      setCategories(res.data.categories || []);
    } catch (error) {
      toast.error(error.response.data.msg || "Failed to load categories");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.description.trim().length < 10) {
      return toast.error("Description must be at least 10 characters");
    }

    try {
      if (editId) {
        await api.put(`/categories/update/${editId}`, form, { headers });
        toast.success("Category Updated Successfully");
      } else {
        await api.post("/categories/add-category", form, { headers });
        toast.success("Category Added Successfully");
      }

      resetForm();
      getCategories();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Something went wrong");
    }
  };

  const editCategory = (item) => {
    setEditId(item._id);
    setForm({
      categoryName: item.categoryName,
      description: item.description,
      status: item.status,
    });
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/delete/${id}`, { headers });
      toast.success("Category Deleted Successfully");
      getCategories();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Delete failed");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      categoryName: "",
      description: "",
      status: "active",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-5xl px-4 py-8">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <FiArrowLeft /> Dashboard
        </button>

        <div className="mb-7">
          <h1 className="text-3xl font-bold">Manage Categories</h1>
          <p className="mt-2 text-sm text-slate-500">
            Add, update and manage interview categories.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="categoryName"
              value={form.categoryName}
              onChange={handleChange}
              placeholder="Category Name"
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description (minimum 10 characters)"
              rows="3"
              className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500">
              <FiPlus />
              {editId ? "Update Category" : "Add Category"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-800 px-5 py-3 text-slate-400"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold">{item.categoryName}</h2>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    item.status === "active"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {item.description}
              </p>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => editCategory(item)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-sm hover:bg-slate-700"
                >
                  <FiEdit2 /> Edit
                </button>

                <button
                  onClick={() => deleteCategory(item._id)}
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

export default Categories;
