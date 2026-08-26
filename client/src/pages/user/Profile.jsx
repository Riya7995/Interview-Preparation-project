import {
  FiArrowLeft,
  FiCamera,
  FiLock,
  FiMail,
  FiPhone,
  FiSave,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const Profile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    password: "",
  });

  const [profileImage, setProfileImage] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Get profile
  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const response = await api.get("/users/profile", config);

      const user = response.data.user;

      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        password: "",
      });

      setProfileImage(user.profileImage || "");
    } catch (error) {
      toast.error(error.response.data.msg || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const changeHandler = (e) => {
    let { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeImageHandler = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile Image must be less than 2MB");
      return;
    }

    let allowedTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, PNG and WEBP images are allowed");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Update Profile
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");
      const data = new FormData();

      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      data.append("fullName", form.fullName);
      data.append("email", form.email);
      data.append("phone", form.phone);
      data.append("bio", form.bio);

      if (form.password) {
        data.append("password", form.password);
      }

      if (image) {
        data.append("profileImage", image);
      }

      const response = await api.put("/users/update", data, config);

      toast.success(response.data.msg || "Profile updated");

      setForm({ ...form, password: "" });
      setImage(null);
      setPreview(null);

      getProfile();
    } catch (error) {
      toast.error(error.response.data.msg || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  // Delete Profile
  const deleteHandler = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const response = await api.delete("/users/delete", config);

      toast.success(response.data.msg || "Account deleted");
      console.log(response.data);

      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.msg || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
      </div>
    );
  }

  const imageUrl = profileImage
    ? `${import.meta.env.VITE_BASE_URL}/uploads/${profileImage}`
    : "";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Header */}

        <button
          className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          onClick={() => navigate("/dashboard")}
        >
          <FiArrowLeft />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-400">
            Account Settings
          </p>

          <h1 className="mt-1 text-3xl font-bold">My Profile</h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your personal information.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-slate-800 bg-indigo-600 text-4xl font-bold">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    form.fullName.charAt(0).toUpperCase() || "U"
                  )}
                </div>

                <label className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-slate-900 bg-indigo-600 hover:bg-indigo-500">
                  <FiCamera size={17} />

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={changeImageHandler}
                  />
                </label>
              </div>

              <h2 className="mt-5 text-xl font-bold">{form.fullName}</h2>

              <p className="mt-1 text-sm text-slate-500">{form.email}</p>
            </div>
          </div>

          {/* Form */}

          <form
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 lg:col-span-2"
            onSubmit={handleUpdate}
          >
            <h2 className="mb-6 text-lg font-semibold">Personal Information</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Full Name */}

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Full Name
                </label>

                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={changeHandler}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Email */}

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Email
                </label>

                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={changeHandler}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Phone */}

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Phone
                </label>

                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={changeHandler}
                    placeholder="Enter your phone"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  New Password
                </label>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={changeHandler}
                    placeholder="Leave blank to keep current"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3.5 pl-11 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}

            <div className="mt-4">
              <label className="mb-2 block text-sm text-slate-300">Bio</label>

              <textarea
                name="bio"
                rows="4"
                value={form.bio}
                onChange={changeHandler}
                placeholder="Tell us about yourself..."
                className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
              />
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold hover:bg-indigo-500"
              >
                <FiSave size={16} />
                {saving ? "Saving" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Delete */}

        <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-red-400">Delete Account</h2>

            <p className="mt-1 text-sm text-slate-500">
              Permanently delete your account and data.
            </p>
          </div>

          <button
            onClick={deleteHandler}
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10"
          >
            <FiTrash2 />
            Delete Account
          </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
