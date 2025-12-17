import React, { useContext } from "react";
import { AdminDataContext } from "../../context/Admincontext";
import Sidebar from '../../components/admin/AdminSidebar'
import { useNavigate, Link } from 'react-router-dom';
import { Edit,  Brain, Youtube, LogOut, MapPinned, User, BookOpenCheck } from "lucide-react"


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

const ProfilePage = () => {


    const navigate = useNavigate();

        const { admin } = useContext(AdminDataContext);
    

    const handleEditProfile = () => {
        navigate('/admin/editprofile')

    }

    const handleMyRoadmap = () => {
        navigate('/admin/roadmaps')
    }
    const Lessons = () => {
        navigate('/admin/explore-lessons')
    }
    const Tutorials = () => {
        navigate('/admin/tutorials')
    }
    const Quizzes = () => {
        navigate('/admin/quizzes')
    }

   

    const handleLogout = () => {
        navigate('/admin/logout')

    }

    return (
        <div className='flex h-screen'>
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                {/* Header */}
                <header className="flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6">
                    <div className="flex items-center w-full bg-green-500-600 justify-between gap-2 ml-12 lg:ml-0">
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
                        </div>
                        {/* <Link to='/profile' className="bg-blue-700 flex items-center text-white w-8 h-8 rounded-full">
                            <User size={16} className="ml-[9px]" />
                        </Link> */}
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    <div className="max-w-7xl mx-auto space-y-8">


                        <div className="mx-auto max-w-2xl">
                            <div className="bg-white rounded-sm shadow-lg p-6 transform transition-all duration-500 hover:shadow-xl">
                                {/* Profile Section */}
                                <div className="flex flex-col items-center mb-6">
                                    <div className="relative mb-4 group">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
                                            <User className="h-12 w-12 text-white" />
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-800">{admin.name}</h2>
                                    <p className="text-gray-500 text-sm">{admin.email}</p>
                                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mt-2">Admin</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

                                    <ProfileButton
                                        icon={<MapPinned className="w-5 h-5" />}
                                        label="Roadmaps"
                                        onClick={handleMyRoadmap}
                                    />

                                    <ProfileButton icon={<BookOpenCheck className="w-5 h-5" />} label="Lessons" onClick={Lessons} />
                                    <ProfileButton icon={<Youtube className="w-5 h-5" />} label="Tutorials" onClick={Tutorials} />
                                    <ProfileButton icon={<Brain className="w-5 h-5" />} label="Quizzes" onClick={Quizzes} />




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
                </main>

            </div>
        </div>
    )
}

export default ProfilePage
