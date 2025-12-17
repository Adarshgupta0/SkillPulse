import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/admin/AdminSidebar'
import { Link, useParams, useNavigate } from "react-router-dom";
import { User, } from "lucide-react"
import { set, useForm } from "react-hook-form"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useContext } from "react";
import { AdminRoadmapDataContext } from "../../context/AdminRoadmap";


const EditRoadmapPage = () => {

    const navigate = useNavigate();

    const { adminroadmap, setAdminRoadmap } = useContext(AdminRoadmapDataContext);

    const { id } = useParams();
    const [toastId, setToastId] = useState(null); // Store toast ID
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false)


    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm()


    useEffect(() => {
        const found = adminroadmap.find((r) => r._id === id);
        if (found) {
            setRoadmap(found);
            reset(found);
        }
    }, [id, adminroadmap, reset]);


    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const roadmapData = {
                title: data.title,
                description: data.description,
                link: data.link,
                roadmap_category: data.roadmap_category,
                icon: data.icon,
            };

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/admin/roadmap-update/${id}`,
                roadmapData,
                { withCredentials: true }
            );

            if (response.data.success) {
                setAdminRoadmap(response.data.allroadmap);
                reset();
                navigate("/admin/roadmaps");
            }
        } catch (error) {
            if (toastId) toast.dismiss(toastId);

            // optional chaining se safe access
            const errorMessage = error.response?.data?.message || "Something went wrong!";

            const newToastId = toast.error(errorMessage, {
                position: "top-center",
                autoClose: 5000,
                theme: "dark",
            });
            setToastId(newToastId);
        } finally {
            setLoading(false);
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
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">Edit Roadmap</h1>
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
                                                    defaultValue={roadmap ? roadmap.title : ''}
                                                    required
                                                    name="title"
                                                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-sm outline-none "
                                                    placeholder="Enter roadmap title"
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
                                                    defaultValue={roadmap ? roadmap.description : ''}
                                                    name="description"
                                                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-sm outline-none "
                                                    placeholder="Enter roadmap description"
                                                    {...register("description", { required: { value: true, message: "description is required" } })}

                                                />
                                            </div>

                                            {/* Link Field */}
                                            <div>
                                                <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Link
                                                </label>
                                                <input
                                                    type="url"
                                                    required
                                                    id="link"
                                                    defaultValue={roadmap ? roadmap.link : ''}
                                                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-sm outline-none"
                                                    placeholder="https://example.com"
                                                    {...register("link", { required: { value: true, message: "link is required" } })}
                                                />
                                                <div className=' flex items-center justify-end'>
                                                    {errors.link && <span className='text-red-600  text-sm '>{errors.link.message}</span>}
                                                </div>
                                            </div>

                                            {/* Roadmap Type Field */}
                                            <div>
                                                <label htmlFor="roadmapType" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Roadmap Type
                                                </label>
                                                <select
                                                    id="roadmapType"
                                                    required
                                                    defaultValue={roadmap ? roadmap.roadmap_category : ''}
                                                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-sm outline-none"
                                                    {...register("roadmap_category", { required: { value: true, message: "roadmap_category is required" } })}

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
                                                    {errors.roadmap_category && <span className='text-red-600  text-sm '>{errors.roadmap_category.message}</span>}
                                                </div>
                                            </div>

                                            {/* Icon Field */}
                                            <div>
                                                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Icon
                                                </label>
                                                <select
                                                    id="icon"
                                                    required
                                                    defaultValue={roadmap ? roadmap.icon : ''}
                                                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-sm outline-none"
                                                    {...register("icon", { required: { value: true, message: "icon is required" } })}
                                                >
                                                    <option value="" disabled hidden>
                                                        Select Icon
                                                    </option>
                                                    <option value="Brain">Brain</option>
                                                    <option value="BrainCircuit">BrainCircuit</option>
                                                    <option value="DatabaseZap">DatabaseZap</option>
                                                    <option value="CodeXml">CodeXml</option>
                                                    <option value="Code">Code</option>
                                                </select>
                                                <div className=' flex items-center justify-end'>
                                                    {errors.icon && <span className='text-red-600  text-sm '>{errors.icon.message}</span>}
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <div className="pt-4 flex flex-col sm:flex-row gap-3">
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className={`px-6 py-2 ${loading ? "bg-blue-800 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"} text-white rounded-sm  font-medium`}
                                                >
                                                    {loading ? "Updating..." : "Update Roadmap"}
                                                </button>

                                                <Link
                                                    to="/admin/roadmaps"
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

export default EditRoadmapPage
