import React, { useState } from "react";

const SignUp = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        bio: "",
        profileImage: "",
    });

    const changeHandler = (e) => {
        setFormData(
            {
                ...formData,
                [e.target.name]: e.target.value
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

                {/* Full Name */}
                <input
                    type="text"
                    name="fullName"
                    placeholder="Enter Your Full Name..."
                    value={formData.fullName}
                    onChange={changeHandler}
                    className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                />

                {/* Email */}
                <input
                    type="email"
                    name="email"
                    placeholder="Enter Your Email..."
                    value={formData.email}
                    onChange={changeHandler}
                    className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                />

                {/* Password */}
                <input
                    type="password"
                    name="password"
                    placeholder="Enter Your Password..."
                    value={formData.password}
                    onChange={changeHandler}
                    className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                />

                {/* Phone */}
                <input
                    type="text"
                    name="phone"
                    placeholder="Enter Your Phone Number..."
                    value={formData.phone}
                    onChange={changeHandler}
                    className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"

                />

                {/* Bio */}
                <textarea
                    name="bio"
                    placeholder="Enter Your Short Bio..."
                    value={formData.bio}
                    onChange={changeHandler}
                    className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                />

                {/* Profile Image */}
                <input
                    type="text"
                    name="profileImage"
                    placeholder="Profile Image URL"
                    value={formData.profileImage}
                    onChange={changeHandler}
                    className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                />

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUp;