
import { useState, useEffect } from "react"
import { CircleUserRound } from "lucide-react"
import axios from "axios";
import { toast } from "react-toastify";


const Alluser = ({ users = [], setusers, setToastId, toastId }) => {
    // State management
    const [filteredUsers, setFilteredUsers] = useState(users)
    const [selectedFilter, setSelectedFilter] = useState("ALL")
    const [searchTerm, setSearchTerm] = useState("")


    // Filter options
    const filterOptions = ['ALL', 'AI/ML', 'Data science', 'Web development', 'Programming language', 'DSA']

    // Effect to handle filtering and searching
    useEffect(() => {
        let result = users

        // Apply type filter
        if (selectedFilter !== "ALL") {
            result = result.filter((user) => user.userCategory === selectedFilter)
        }

        // Apply search filter
        if (searchTerm.trim()) {
            result = result.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
        }

        setFilteredUsers(result)
    }, [users, selectedFilter, searchTerm])

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
            // Search is already handled by useEffect through searchTerm state
            e.target.blur() // Remove focus from input
        }
    }

    const handleDelete = async (user) => {
        const confirmDelete = window.confirm(`Do you want to delete "${user.name}" ?`);
        if (!confirmDelete) return;

        try {

            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/admin/delete-user/${user._id}`,
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
                setusers((prev) => prev.filter((u) => u._id !== user._id));
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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">All Users</h1>
                <p className="text-gray-600">Manage and view all registered users ({filteredUsers.length} users)</p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={handleSearchKeyPress}
                        aria-label="Search users"
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

            {/* User Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div
                            key={user._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 "
                        >
                            {/* Avatar and Basic Info */}
                            <div className="flex items-center mb-4">
                                <div className="relative">
                                    <CircleUserRound strokeWidth={1} className="w-11 h-11 rounded-full object-cover border-gray-200" />
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
                                    <span
                                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${user.userCategory === "AI/ML"
                                            ? "bg-purple-100 text-purple-800"
                                            : user.userCategory === "Data science"
                                                ? "bg-green-100 text-green-800"
                                                : user.userCategory === "Web development"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : user.userCategory === "DSA"
                                                        ? "bg-orange-100 text-orange-800"
                                                        : user.userCategory === "Programming language"
                                                            ? "bg-stone-100 text-stone-800"
                                                            : "bg-gray-100 text-gray-900"
                                            }`}
                                    >
                                        {user.userCategory}
                                    </span>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span className="truncate">{user.email}</span>
                                </div>

                            </div>

                            {/* Action Button */}
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <button
                                    className="w-full px-4 py-2 text-sm font-medium cursor-pointer text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                                    onClick={() => handleDelete(user)}
                                >
                                    Delete user
                                </button>
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
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-500 text-center max-w-sm">
                            {searchTerm ? `No users match "${searchTerm}"` : `No users found for ${selectedFilter} filter`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Alluser
