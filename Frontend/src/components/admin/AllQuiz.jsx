
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


const AllQuiz = ({ quizzes = [], setquizs, toastId, setToastId }) => {

    const navigate = useNavigate();


    // State management
    const [filteredQuizzes, setFilteredQuizzes] = useState(quizzes)
    const [selectedFilter, setSelectedFilter] = useState("ALL")
    const [searchTerm, setSearchTerm] = useState("")

    // Filter options for quiz types
    const filterOptions = ["ALL", "AI/ML", "Data science", "Web development", "Programming language", "DSA"]
    //   ['ALL', 'AI/ML', 'Data science', 'Web development', 'Programming language', 'DSA']

    // Effect to handle filtering and searching
    useEffect(() => {
        let result = quizzes

        // Apply type filter
        if (selectedFilter !== "ALL") {
            result = result.filter((quiz) => quiz.quizCategory === selectedFilter)
        }

        // Apply search filter
        if (searchTerm.trim()) {
            result = result.filter((quiz) => quiz.quiz.toLowerCase().includes(searchTerm.toLowerCase()))
        }

        setFilteredQuizzes(result)
    }, [quizzes, selectedFilter, searchTerm])

    // Handle filter selection
    const handleFilterChange = (filter) => {
        setSelectedFilter(filter)
    }

    // Handle search input
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    // Handle search on Enter key
    const handleSearchKeyPress = (e) => {
        if (e.key === "Enter") {
            e.target.blur()
        }
    }

    const handleEditQuiz = (e, quizId) => {
        e.stopPropagation()

        navigate(`/admin/edit-quiz/${quizId}`)

    }

    const handleDeleteQuiz = async (quizId) => {
         const confirmDelete = window.confirm(`Do you want to delete quiz ?`);
        if (!confirmDelete) return;

        try {

            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/admin/quiz-delete/${quizId}`,
                { withCredentials: true }
            );
            if (response.data.success) {
                if (toastId) {
                    toast.dismiss(toastId);
                }

                const newToastId = toast.success(response.data.message, {
                    position: "top-center",
                    autoClose: 5000,
                    theme: "light",
                });
                setToastId(newToastId);
                setquizs((prev) => prev.filter((u) => u._id !== quizId));
            }
        } catch (error) {
            console.log(error.response.data.message)
            if (toastId) {
                toast.dismiss(toastId);
            }

            const newToastId = toast.error(error.response.data.message, {
                position: "top-center",
                autoClose: 5000,
                theme: "light", 
            });
            setToastId(newToastId);
        }
    }

    return (
        <div className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">All Quizzes</h1>
                    <div>
                        <Link className="text-white font-semibold text-sm px-5 py-2 rounded-sm bg-blue-800" to='/admin/create-quiz'>Create</Link>
                    </div>
                </div>
                <p className="text-gray-600">Browse and manage all quizzes ({filteredQuizzes.length} quizzes)</p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Search quizzes..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={handleSearchKeyPress}
                        aria-label="Search quizzes"
                        className="w-full px-4 py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="mb-8">
                <div className="flex flex-wrap gap-2 md:gap-3">
                    {filterOptions.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => handleFilterChange(filter)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedFilter === filter
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quizzes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.length > 0 ? (
                    filteredQuizzes.map((quiz) => (
                        <div
                            key={quiz._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 "
                        >
                            {/* Quiz Header */}
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-start justify-between mb-3">
                                    <span
                                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${quiz.quizCategory === "AI/ML"
                                            ? "bg-purple-100 text-purple-800"
                                            : quiz.quizCategory === "Data science"
                                                ? "bg-green-100 text-green-800"
                                                : quiz.quizCategory === "Web development"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : quiz.quizCategory === "DSA"
                                                        ? "bg-orange-100 text-orange-800"
                                                        : quiz.quizCategory === "Programming language"
                                                            ? "bg-stone-100 text-stone-800"
                                                            : "bg-gray-100 text-gray-900"
                                            }`}
                                    >
                                        {quiz.quizCategory}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => handleEditQuiz(e, quiz._id)}
                                            className="p-1.5 text-blue-600 cursor-pointer hover:bg-blue-100 rounded-lg transition-colors duration-200"
                                            title="Edit quiz"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteQuiz(quiz._id)}
                                            className="p-1.5 text-red-600 cursor-pointer hover:bg-red-100  rounded-lg transition-colors duration-200"
                                            title="Delete quiz"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 leading-tight">{quiz.quiz}</h3>
                            </div>

                            {/* Quiz Options */}
                            <div className="p-6">
                                <div className="space-y-3">
                                    {quiz.options.map((option, index) => (
                                        <div
                                            key={index}
                                            className={`p-3 rounded-lg border transition-all duration-200 ${option.isCorrect
                                                ? "bg-green-50 border-green-200 text-green-800"
                                                : "bg-gray-50 border-gray-200 text-gray-700"
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <span className="flex-shrink-0 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                                    {String.fromCharCode(65 + index)}
                                                </span>
                                                <span className="text-sm font-medium">{option.text}</span>
                                                {option.isCorrect && (
                                                    <svg className="w-4 h-4 ml-auto text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    /* Empty State */
                    <div className="col-span-full flex flex-col items-center justify-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
                        <p className="text-gray-500 text-center max-w-sm">
                            {searchTerm ? `No quizzes match "${searchTerm}"` : `No quizzes found for ${selectedFilter} filter`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AllQuiz
