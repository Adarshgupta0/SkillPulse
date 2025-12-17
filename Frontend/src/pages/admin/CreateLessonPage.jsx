import React, { useState } from 'react'
import Sidebar from '../../components/admin/AdminSidebar'
import { Link, useNavigate } from "react-router-dom";
import { User, } from "lucide-react"
import { useForm } from "react-hook-form"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useContext } from "react";
import { AdminLessonDataContext } from "../../context/AdminLesson";


const CreateLessonPage = () => {

    const { adminaesson, setAdminLesson } = useContext(AdminLessonDataContext);


    const navigate = useNavigate();
    const [toastId, setToastId] = useState(null); // Store toast ID
    const [loading, setloading] = useState(false);


    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm()


    const onSubmit = async (data) => {
        setloading(true);
        try {
            const formData = new FormData();

            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("thumbnail", data.thumbnail[0]);
            formData.append("lesson_category", data.lesson_category);
            formData.append("lessonlink", data.lessonlink);

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/admin/lesson-create`,
                formData,
                { withCredentials: true }
            );

            if (response.data.success) {
                reset();
                setAdminLesson([response.data.lesson, ...adminaesson]);
                navigate("/admin/explore-lessons");
            }
        } catch (error) {
            if (toastId) {
                toast.dismiss(toastId);
            }

            const newToastId = toast.error(error.response.data.message, {
                position: "top-center",
                autoClose: 5000,
                theme: "dark",
            });
            setToastId(newToastId);
        } finally {
            setloading(false)
        }
    }

    return (
        <>
            <ToastContainer />

            <div className='flex h-screen'>
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                    {/* Header */}
                    <header className="flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6">
                        <div className="flex items-center w-full bg-green-500-600 justify-between gap-2 ml-12 lg:ml-0">
                            <div className=''>
                                <h1 className="text-2xl font-bold text-gray-900 ">Create Lesson</h1>
                            </div>
                            <Link to='/admin' className="bg-blue-700 flex items-center text-white w-8 h-8 rounded-full">
                                <User size={16} className="ml-[9px]" />
                            </Link>
                        </div>
                    </header>
                    <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                        <div className="max-w-7xl mx-auto space-y-8">


                            <div className="flex-1 ">
                                <div className="max-w-2xl mx-auto">

                                    <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4 sm:p-8">
                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                            {/* Title Field */}
                                            <div>
                                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Title
                                                </label>
                                                <input
                                                    type="text"
                                                    id="title"
                                                    required
                                                    name="title"
                                                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-sm outline-none "
                                                    placeholder="Enter title"
                                                    {...register("title", { required: { value: true, message: "title is required" } })}

                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                                    description
                                                </label>
                                                <input
                                                    type="text"
                                                    id="description"
                                                    required
                                                    name="description"
                                                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-sm outline-none "
                                                    placeholder="Enter description"
                                                    {...register("description", { required: { value: true, message: "description is required" } })}

                                                />
                                            </div>
                                            {/* channelname */}
                                            <div>
                                                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                                                    thumbnail
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id="thumbnail"
                                                    required
                                                    name="thumbnail"
                                                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-sm outline-none "
                                                    placeholder="Enter channel name"
                                                    {...register("thumbnail", { required: { value: true, message: "thumbnail is required" } })}

                                                />
                                            </div>

                                            {/* Link Field */}
                                            <div>
                                                <label htmlFor="lessonlink" className="block text-sm font-medium text-gray-700 mb-2">
                                                    link
                                                </label>
                                                <input
                                                    type="url"
                                                    required
                                                    id="lessonlink"
                                                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-sm outline-none"
                                                    placeholder="https://example.com"
                                                    {...register("lessonlink", { required: { value: true, message: "lessonlink is required" } })}
                                                />
                                            </div>

                                            {/* Roadmap Type Field */}
                                            <div>
                                                <label htmlFor="roadmapType" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Lesson Type
                                                </label>
                                                <select
                                                    id="roadmapType"
                                                    required
                                                    defaultValue=""
                                                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-sm outline-none"
                                                    {...register("lesson_category", { required: { value: true, message: "lesson_category is required" } })}

                                                >
                                                    <option value="" disabled hidden>
                                                        Select Category
                                                    </option>
                                                    <option value="DSA">DSA</option>
                                                    <option value="AI/ML">AI/ML</option>
                                                    <option value="Data science">Data science</option>
                                                    <option value="Web development">Web development</option>
                                                    <option value="Programming language">Programming language</option>
                                                </select>
                                                <div className=' flex items-center justify-end'>
                                                    {errors.lesson_category && <span className='text-red-600  text-sm '>{errors.lesson_category.message}</span>}
                                                </div>
                                            </div>

                                            {/* Icon Field */}


                                            {/* Submit Button */}
                                            <div className="pt-4 flex flex-col sm:flex-row gap-3">
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className={`px-6 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700  ${loading ? "bg-blue-800 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"} font-medium`}
                                                >
                                                    {loading ? "Creating..." : "Create Lesson"}
                                                </button>
                                                <Link
                                                    to="/admin/explore-lessons"
                                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-sm font-medium text-center"
                                                >
                                                    Cancel
                                                </Link>


                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>


                        </div>

                    </main>




                </div>
            </div>
        </>
    )
}

export default CreateLessonPage
