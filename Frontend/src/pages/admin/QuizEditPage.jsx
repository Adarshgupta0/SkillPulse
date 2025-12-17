import Sidebar from '../../components/admin/AdminSidebar'
import { User, Save } from "lucide-react"
import { useForm } from "react-hook-form";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import React, { useContext } from "react";
import { AdminQuizDataContext } from "../../context/AdminQuiz";
import { useState, useEffect } from "react"


const QuizEditPage = () => {

    const navigate = useNavigate();

    const { adminquiz, setAdminQuiz } = useContext(AdminQuizDataContext);

    const { id } = useParams();
    const [toastId, setToastId] = useState(null);
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            quiz: "",
            quizCategory: "",
            options: [
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
            ],
        },
    });

    useEffect(() => {
        const found = adminquiz.find((r) => r._id === id);
        if (found) {
            // setquiz(found);
            reset(found);
        }
    }, [id, adminquiz, reset]);

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const quizdata = {
                quiz: data.quiz,
                quizCategory: data.quizCategory,
                options: data.options,
            }

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/admin/quiz-update/${id}`,
                quizdata,
                { withCredentials: true }
            );
            if (response.data.success) {
                setAdminQuiz(response.data.allquizs);
                reset();
                navigate("/admin/quizzes");
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
            setLoading(false)
        }
    };



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
                                <h1 className="text-lg font-semibold text-gray-900">Edit quiz</h1>
                            </div>
                            <Link to='/admin' className="bg-blue-700 flex items-center text-white w-8 h-8 rounded-full">
                                <User size={16} className="ml-[9px]" />
                            </Link>
                        </div>
                    </header>
                    <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
                        <div className="max-w-7xl mx-auto space-y-8">


                            <div className="">
                                <div className="max-w-4xl mx-auto">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-900">Edit Quiz</h1>
                                            <p className="text-gray-600 mt-2">Create and customize your quiz questions and answers</p>
                                        </div>
                                        <div className='flex flex-col justify-center items-center gap-2'>
                                            <Link
                                                to="/admin/quizzes"
                                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-sm font-medium text-center"
                                            >
                                                Cancel
                                            </Link>
                                            <button
                                                onClick={handleSubmit(onSubmit)}
                                                disabled={loading}
                                                className={`flex items-center gap-2 ${loading ? "bg-blue-800 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"} text-white px-6 py-2 rounded-sm transition-colors`}
                                            >
                                                {loading ? 'Updating...' : 'Update'}
                                            </button>

                                        </div>


                                    </div>

                                    <div className="space-y-6">
                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                            {/* Quiz Info */}
                                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                                <div className="p-6 border-b border-gray-200">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Quiz Information
                                                    </h3>
                                                </div>
                                                <div className="p-6 space-y-4">
                                                    {/* Quiz */}
                                                    <div className="space-y-2">
                                                        <label
                                                            htmlFor="quiz"
                                                            className="block text-sm font-medium text-gray-700"
                                                        >
                                                            Quiz
                                                        </label>
                                                        <input
                                                            id="quiz"
                                                            placeholder="Enter question"
                                                            {...register("quiz", { required: "Quiz question is required" })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                                                        />
                                                        {errors.quiz && (
                                                            <p className="text-red-500 text-sm">{errors.quiz.message}</p>
                                                        )}
                                                    </div>

                                                    {/* Category */}
                                                    <div className="space-y-2">
                                                        <label
                                                            htmlFor="quizCategory"
                                                            className="block text-sm font-medium text-gray-700"
                                                        >
                                                            Quiz Category
                                                        </label>
                                                        <select
                                                            id="quizCategory"
                                                            {...register("quizCategory", {
                                                                required: "Please select a category",
                                                            })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                                                        >
                                                            <option value="" disabled hidden>
                                                                Select quiz Category
                                                            </option>
                                                            <option value="DSA">DSA</option>
                                                            <option value="AI/ML">AI/ML</option>
                                                            <option value="Data science">Data science</option>
                                                            <option value="Web development">Web development</option>
                                                            <option value="Programming language">
                                                                Programming language
                                                            </option>
                                                        </select>
                                                        {errors.quizCategory && (
                                                            <p className="text-red-500 text-sm">
                                                                {errors.quizCategory.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Options */}
                                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                                <div className="p-6 border-b border-gray-200">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Answer Options (4 Options)
                                                    </h3>
                                                </div>
                                                <div className="p-6 space-y-4">
                                                    {Array.from({ length: 4 }).map((_, index) => (
                                                        <div
                                                            key={index}
                                                            className="border border-gray-200 rounded-lg p-4 space-y-4"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="font-medium text-gray-900">
                                                                    Option {index + 1}
                                                                </h4>
                                                            </div>

                                                            {/* Option text */}
                                                            <input
                                                                placeholder="Enter option text"
                                                                {...register(`options.${index}.text`, {
                                                                    required: "Option text is required",
                                                                })}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                                                            />
                                                            {errors?.options?.[index]?.text && (
                                                                <p className="text-red-500 text-sm">
                                                                    {errors.options[index].text.message}
                                                                </p>
                                                            )}

                                                            {/* Correct checkbox */}
                                                            <div className="flex items-center space-x-2">

                                                                <input
                                                                    type="checkbox"
                                                                    id={`option-${index}`}
                                                                    {...register(`options.${index}.isCorrect`)}
                                                                    className="w-4 h-4 accent-blue-600 bg-gray-100 border-gray-300 rounded"
                                                                />
                                                                <label htmlFor={`option-${index}`} className="text-sm text-gray-700">
                                                                    This is the correct answer
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
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

export default QuizEditPage
