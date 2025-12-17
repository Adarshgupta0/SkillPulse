import Sidebar from '../../components/user/App-sidebar'
import { Link, useNavigate } from "react-router-dom";
import LessonCard from "../../components/user/HomeLessonCart";
import RoadmapCard from "../../components/user/HomeRoadmapCart";
import TutorialCart from '../../components/user/HomeTutorialCart';
import React, { useContext } from "react";
import { HomeDataContext } from "../../context/HomeContext";


import { useState, useEffect } from "react"
import { Brain, BrainCircuit, DatabaseZap, Code, CodeXml, User, ChevronRight, Clock, Users, } from "lucide-react"

export const iconMap = {
  Brain,
  BrainCircuit,
  DatabaseZap,
  Code,
  CodeXml,
  User,
  ChevronRight,
  Clock,
  Users,
};


// Daily Quiz Card Component
const DailyQuizCard = () => {
  return (
    <div
      className="bg-gradient-to-r from-blue-800 to-blue-500 rounded-xl p-6 text-white cursor-pointer transform hover:scale-102
       transition-all duration-300 hover:shadow-md"
    // onClick={() => (window.location.href = "/dailyquiz")}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-2">Daily Quiz</h3>
          <p className="text-blue-100 mb-4">Test your knowledge with today's challenge!</p>
          <div className="flex items-center text-sm text-blue-100">
            <Clock size={16} className="mr-1" />
            <span>5 minutes</span>
            <Users size={16} className="ml-4 mr-1" />
            <span>1,234 participants</span>
          </div>
        </div>
        <div className="text-right">

          <ChevronRight size={20} className="ml-auto" />
        </div>
      </div>
    </div>
  )
}


const HomePage = () => {

  const { home, fetchHomeProfile } = useContext(HomeDataContext);


  useEffect(() => {
    fetchHomeProfile();
  }, []);

  const suggestedlessons = home.lessons;

  const roadmaps = home.roadmaps;

  const tutorial = home.tutorials;


  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6">
          <div className="flex items-center w-full bg-green-500-600 justify-between gap-2 ml-12 lg:ml-0">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Home</h1>
            </div>
            <Link to='/profile' className="bg-blue-700 flex items-center text-white w-8 h-8 rounded-full">
              <User size={16} className="ml-[9px]" />
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Daily Quiz Section */}
            <section>
              <Link to='/dailyquiz'>
                <DailyQuizCard />
              </Link>
            </section>

            {/* Suggested lesson Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Explore Lessons</h2>
                <Link to='/explore-lessons' className="text-blue-600 hover:text-blue-800 font-medium">View All</Link>
              </div>

              {suggestedlessons.length > 0 ? (
                <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                  {suggestedlessons.map((lesson, index) => (
                    <LessonCard key={index} Lesson={lesson} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-10">Lessons not exist</p>
              )}

            </section>

            {/* Roadmaps Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Roadmap</h2>
                <Link to='/roadmap' className="text-blue-600 hover:text-blue-800 font-medium">View All</Link>
              </div>

              {roadmaps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {roadmaps.map((roadmap) => (
                    <RoadmapCard key={roadmap._id} roadmap={roadmap} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-10">Roadmap not exist</p>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Tutorials</h2>
                <Link to='/tutorials' className="text-blue-600 hover:text-blue-800 font-medium">View All</Link>
              </div>

              {tutorial.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {tutorial.map((tutorial) => (
                    <TutorialCart key={tutorial._id} Tutorial={tutorial} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-10">Tutorials not exist</p>
              )}

            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default HomePage
