"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios"; 


const AllRoadmap = ({ roadmaps = [], setroadmaps, toastId, setToastId  }) => {

  const navigate = useNavigate();

  const [filteredRoadmaps, setFilteredRoadmaps] = useState(roadmaps)
  const [selectedFilter, setSelectedFilter] = useState("ALL")
  const [searchTerm, setSearchTerm] = useState("")

  // Filter options for roadmap types
  const filterOptions = ['ALL', 'AI/ML', 'Data science', 'Web development', 'Programming language', 'DSA']

  // Effect to handle filtering and searching
  useEffect(() => {
    let result = roadmaps

    // Apply type filter
    if (selectedFilter !== "ALL") {
      result = result.filter((roadmap) => roadmap.roadmap_category === selectedFilter)
    }

    // Apply search filter
    if (searchTerm.trim()) {
      result = result.filter((roadmap) => roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    setFilteredRoadmaps(result)
  }, [roadmaps, selectedFilter, searchTerm])

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

   const handleroadmapClick = (roadmaplink) => {
    if (roadmaplink) {
      window.open(roadmaplink, "_blank", "noopener,noreferrer")
    }
  }

  const handleEditRoadmap = (e, roadmapId) => {
    e.stopPropagation()
    navigate(`/admin/edit-roadmap/${roadmapId}`)
  }

  const handleDeleteRoadmap = async (roadmapId) => {
      const confirmDelete = window.confirm(`Do you want to delete this Roadmap ?`);
        if (!confirmDelete) return;

        try {

            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/admin/roadmap-delete/${roadmapId}`,
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
                setroadmaps((prev) => prev.filter((u) => u._id !== roadmapId));
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
         <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">All Roadmaps</h1>
         <div>
          <Link className="text-white font-semibold text-sm px-5 py-2 rounded-sm bg-blue-800" to='/admin/create-roadmap'>Create</Link>
         </div>
       </div>
        <p className="text-gray-600">Browse and manage all learning roadmaps ({filteredRoadmaps.length} roadmaps)</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search roadmaps..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            aria-label="Search roadmaps"
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

      {/* Roadmaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoadmaps.length > 0 ? (
          filteredRoadmaps.map((roadmap) => (
            <div
              key={roadmap._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300  group"
            >
              {/* Roadmap Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${roadmap.roadmap_category === "AI/ML"
                        ? "bg-purple-100 text-purple-800"
                        : roadmap.roadmap_category === "Data science"
                          ? "bg-green-100 text-green-800"
                          : roadmap.roadmap_category === "Web development"
                            ? "bg-blue-100 text-blue-800"
                            : roadmap.roadmap_category === "DSA"
                              ? "bg-orange-100 text-orange-800"
                              : roadmap.roadmap_category === "Programming language"
                                ? "bg-stone-100 text-stone-800"
                                : "bg-gray-100 text-gray-900"
                        }`}
                    >
                      {roadmap.roadmap_category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => handleEditRoadmap(e, roadmap._id)}
                      className="p-1.5 text-blue-600 cursor-pointer hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                      title="Edit roadmap"
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
                      onClick={() => handleDeleteRoadmap(roadmap._id)}
                      className="p-1.5 text-red-600 cursor-pointer hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                      title="Delete roadmap"
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
                  {roadmap.title}
                </h3>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 leading-tight group-hover:text-blue-900 transition-colors duration-200">
                  {roadmap.description}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-700 group-hover:text-gray-800 transition-colors duration-200">
                    <span className="font-medium">icon-</span> {roadmap.icon}
                  </div>

                   <div className="flex items-center cursor-pointer text-sm text-gray-500"
                    onClick={() => handleroadmapClick(roadmap.link)}
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
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No roadmaps found</h3>
            <p className="text-gray-500 text-center max-w-sm">
              {searchTerm ? `No roadmaps match "${searchTerm}"` : `No roadmaps found for ${selectedFilter} filter`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllRoadmap
