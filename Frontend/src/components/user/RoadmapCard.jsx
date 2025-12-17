import React from "react"
import { useState, useEffect } from "react"
import {
  BookOpen, Heart, Download, Brain, BrainCircuit, DatabaseZap, Code, CodeXml,
  User, Settings, ChevronRight, Star, Clock, Users, MapPinned
} from "lucide-react"

import { UserDataContext } from "../../context/Usercontext";
import { useContext } from "react";

const iconMap = {
  BookOpen,
  Heart,
  Download,
  Brain,
  BrainCircuit,
  DatabaseZap,
  Code,
  CodeXml,
  User,
  Settings,
  ChevronRight,
  Star,
  Clock,
  Users,
};


const AllRoadmap = ({ roadmaps = [] }) => {


      const {user } = useContext(UserDataContext);


  const [filteredRoadmaps, setFilteredRoadmaps] = useState(roadmaps)
  const [selectedFilter, setSelectedFilter] = useState(user.userCategory || "ALL")
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

  const handleRoadmapClick = (roadmaplink) => {
    if (roadmaplink) {
      window.open(roadmaplink, "_blank", "noopener,noreferrer")
    }
  }


  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">All Roadmaps</h1>
       
        </div>
        <p className="text-gray-600">All learning roadmaps ({filteredRoadmaps.length} roadmaps)</p>
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


                  <div className="text-gray-500">
                    {React.createElement(iconMap[roadmap.icon], { size: 24 })}
                  </div>


                </div>

                <h3 className="text-lg font-semibold  mb-3 leading-tight text-blue-800 ">
                  {roadmap.title}
                </h3>
                <h3 className="text-sm font-semibold  mb-3 leading-tight text-gray-700 ">
                  {roadmap.description}
                </h3>

                <div className="space-y-2 mb-4">


                  <div className="flex items-center justify-end cursor-pointer text-sm font-semibold  text-blue-700"
                    onClick={() => handleRoadmapClick(roadmap.link)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    <span className="truncate">Path</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
             <MapPinned size={48} className="text-gray-400" />
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
