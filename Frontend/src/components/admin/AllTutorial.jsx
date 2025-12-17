
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


const AllTutorial = ({ tutorials = [], settutorials, toastId, setToastId }) => {

  const navigate = useNavigate();

  // State management
  const [filteredtutorials, setFilteredtutorials] = useState(tutorials)
  const [selectedFilter, setSelectedFilter] = useState("ALL")
  const [searchTerm, setSearchTerm] = useState("")

  // Filter options for tutorial types
  const filterOptions = ['ALL', 'AI/ML', 'Data science', 'Web development', 'Programming language', 'DSA']

  // Effect to handle filtering and searching
  useEffect(() => {
    let result = tutorials

    // Apply type filter
    if (selectedFilter !== "ALL") {
      result = result.filter((tutorial) => tutorial.tutorial_category === selectedFilter)
    }

    // Apply search filter
    if (searchTerm.trim()) {
      result = result.filter(
        (tutorial) =>
          tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tutorial.channelname.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredtutorials(result)
  }, [tutorials, selectedFilter, searchTerm])

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

  const handletutorialClick = (tutoriallink) => {
    if (tutoriallink) {
      window.open(tutoriallink, "_blank", "noopener,noreferrer")
    }
  }

  const handleEdittutorial = (e, tutorialId) => {
    e.stopPropagation()
    navigate(`/admin/edit-tutorial/${tutorialId}`);
  }

  const handleDeletetutorial = async (tutorialId) => {
    const confirmDelete = window.confirm(`Do you want to delete tutorials ?`);
        if (!confirmDelete) return;

        try {

            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/admin/tutorial-delete/${tutorialId}`,
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
                settutorials((prev) => prev.filter((u) => u._id !== tutorialId));
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">All  tutorials</h1>
          <div>
            <Link className="text-white font-semibold text-sm px-5 py-2 rounded-sm bg-blue-800" to='/admin/create-tutorial'>Create</Link>
          </div>
        </div>
        <p className="text-gray-600">Browse and manage all  tutorials ({filteredtutorials.length} tutorials)</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search tutorials..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            aria-label="Search tutorials"
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

      {/* tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredtutorials.length > 0 ? (
          filteredtutorials.map((tutorial) => (
            <div
              key={tutorial._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300  group"
            >
              {/* tutorial Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${tutorial.tutorial_category === "AI/ML"
                        ? "bg-purple-100 text-purple-800"
                        : tutorial.tutorial_category === "Data science"
                          ? "bg-green-100 text-green-800"
                          : tutorial.tutorial_category === "Web development"
                            ? "bg-blue-100 text-blue-800"
                            : tutorial.tutorial_category === "DSA"
                              ? "bg-orange-100 text-orange-800"
                              : tutorial.tutorial_category === "Programming language"
                                ? "bg-stone-100 text-stone-800"
                                : "bg-gray-100 text-gray-900"
                        }`}
                    >
                      {tutorial.tutorial_category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => handleEdittutorial(e, tutorial._id)}
                      className="p-1.5 text-blue-600 cursor-pointer hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110"
                      title="Edit tutorial"
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
                      onClick={() => handleDeletetutorial(tutorial._id)}
                      className="p-1.5 text-red-600 cursor-pointer hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110"
                      title="Delete tutorial"
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

                <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight group-hover:text-blue-900 transition-colors duration-200">
                  {tutorial.title}
                </h3>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 leading-tight group-hover:text-blue-900 transition-colors duration-200">
                  {tutorial.description}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                    <svg
                      className="w-4 h-4 mr-2 group-hover:text-blue-500 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="font-medium">{tutorial.channelname}</span>
                  </div>

                  <div className="text-sm text-gray-700 group-hover:text-gray-800 transition-colors duration-200">
                    <span className="font-medium">icon-</span> {tutorial.icon}
                  </div>

                  <div className="flex items-center cursor-pointer text-sm text-gray-500"
                    onClick={() => handletutorialClick(tutorial.link)}
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
                  d="M12 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tutorials found</h3>
            <p className="text-gray-500 text-center max-w-sm">
              {searchTerm ? `No tutorials match "${searchTerm}"` : `No tutorials found for ${selectedFilter} filter`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllTutorial
