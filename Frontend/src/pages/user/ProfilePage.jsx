import { Edit, ShoppingBag, Brain, LogOut, User, House } from "lucide-react"
import Sidebar from '../../components/user/App-sidebar'
import { useNavigate, Link } from 'react-router-dom';

import React, { useContext } from "react";
import { UserDataContext } from "../../context/Usercontext";


const ProfileButton = ({ icon, label, variant = "default", onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center gap-2 p-3 rounded-xl w-full
        transform transition-all duration-200 hover:scale-105 active:scale-95
        ${variant === "danger"
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
        }
      `}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  )
}

const StatItem = ({ value, label }) => {
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg font-bold text-gray-800">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  )
}

const ProfilePage = () => {

  const { user } = useContext(UserDataContext);





  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/editprofile')

  }

  const handleMyquiz = () => {
    navigate('/dailyquiz')
  }

  const handleBookmarks = () => {
    navigate('/')

  }

  const handleLogout = () => {
    navigate('/logout')

  }

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
              <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
            </div>
            <Link to='/' className="bg-blue-700 flex items-center text-white w-8 h-8 rounded-full">
              <House size={16} className="ml-[9px]" />
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="mx-auto max-w-2xl">
            <div className="bg-white rounded-sm shadow-lg p-6 transform transition-all duration-500 hover:shadow-xl">
              {/* Profile Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4 group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                </div>

                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mt-2">{user.userCategory}</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

                <ProfileButton icon={<House className="w-5 h-5" />} label="Home" onClick={handleBookmarks} />

                <ProfileButton
                  icon={<Brain className="w-5 h-5" />}
                  label="Daily quizzes"
                  onClick={handleMyquiz}
                />
                <ProfileButton icon={<Edit className="w-5 h-5" />} label="Edit Profile" onClick={handleEditProfile} />
                <ProfileButton
                  icon={<LogOut className="w-5 h-5" />}
                  label="Logout"
                  variant="danger"
                  onClick={handleLogout}
                />


              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
