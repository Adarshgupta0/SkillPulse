
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


const AllLesson = ({ lessons = [], setlessons, toastId, setToastId }) => {

    const navigate = useNavigate();


    // State management
    const [filteredlessons, setFilteredlessons] = useState(lessons)
    const [selectedFilter, setSelectedFilter] = useState("ALL")
    const [searchTerm, setSearchTerm] = useState("")

    // Filter options for lesson types
    const filterOptions = ['ALL', 'AI/ML', 'Data science', 'Web development', 'Programming language', 'DSA']

    // Effect to handle filtering and searching
    useEffect(() => {
        let result = lessons

        // Apply type filter
        if (selectedFilter !== "ALL") {
            result = result.filter((lesson) => lesson.lesson_category === selectedFilter)
        }

        // Apply search filter
        if (searchTerm.trim()) {
            result = result.filter(
                (lesson) =>
                    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lesson.description.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        setFilteredlessons(result)
    }, [lessons, selectedFilter, searchTerm])

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

    // Handle lesson link click
    const handlelessonClick = (lessonlink) => {
        if (lessonlink) {
            window.open(lessonlink, "_blank", "noopener,noreferrer")
        }
    }

    const handleEditlesson = (e, lessonId) => {
        e.stopPropagation() // Prevent card click
        // Add your edit logic here
        navigate(`/admin/edit-explore-lesson/${lessonId}`)
    }

    const handleDeletelesson = async (lessonId) => {
        const confirmDelete = window.confirm(`Do you want to delete this lesson ?`);
        if (!confirmDelete) return;

        try {

            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/admin/lesson-delete/${lessonId}`,
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
                setlessons((prev) => prev.filter((u) => u._id !== lessonId));
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
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">All lessons</h1>
                    <div>
                        <Link className="text-white font-semibold text-sm px-5 py-2 rounded-sm bg-blue-800" to='/admin/create-lesson'>Create</Link>
                    </div>
                </div>
                <p className="text-gray-600">Browse and manage all lessons ({filteredlessons.length} lessons)</p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Search lessons..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={handleSearchKeyPress}
                        aria-label="Search lessons"
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

            {/* lessons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredlessons.length > 0 ? (
                    filteredlessons.map((lesson) => (
                        <div
                            key={lesson._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 "
                        // onClick={() => handlelessonClick(lesson.lessonlink)}
                        >
                            {/* lesson Thumbnail */}
                            <div className="relative h-48 bg-gray-100">
                                <img
                                    src={
                                        lesson.thumbnail ||
                                        `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(lesson.title) || "/placeholder.svg"}`
                                    }
                                    alt={`${lesson.title} thumbnail`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3">
                                    <span
                                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${lesson.lesson_category === "AI/ML"
                                            ? "bg-purple-100 text-purple-800"
                                            : lesson.lesson_category === "Data science"
                                                ? "bg-green-100 text-green-800"
                                                : lesson.lesson_category === "Web development"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : lesson.lesson_category === "DSA"
                                                        ? "bg-orange-100 text-orange-800"
                                                        : lesson.lesson_category === "Programming language"
                                                            ? "bg-stone-100 text-stone-800"
                                                            : "bg-gray-100 text-gray-900"
                                            }`}
                                    >
                                        {lesson.lesson_category}
                                    </span>
                                </div>
                            </div>

                            {/* lesson Info */}
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{lesson.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{lesson.description}</p>



                                <div className="flex items-center justify-between">
                                    <div className="flex items-center cursor-pointer text-sm text-gray-500"
                                        onClick={() => handlelessonClick(lesson.lessonlink)}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                        <span className="truncate">Explore</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => handleEditlesson(e, lesson._id)}
                                            className="p-2 text-blue-600 hover:bg-blue-100 cursor-pointer rounded-lg transition-colors duration-200"
                                            title="Edit lesson"
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
                                            onClick={() => handleDeletelesson(lesson._id)}
                                            className="p-2 text-red-600 hover:bg-red-100 cursor-pointer rounded-lg transition-colors duration-200"
                                            title="Delete lesson"
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
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7h16"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
                        <p className="text-gray-500 text-center max-w-sm">
                            {searchTerm ? `No lessons match "${searchTerm}"` : `No lessons found for ${selectedFilter} filter`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AllLesson
