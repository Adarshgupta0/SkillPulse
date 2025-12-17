import AllTutorial from "../../components/admin/AllTutorial"
import Sidebar from "../../components/admin/AdminSidebar"
import { Link } from "react-router-dom";
import { User, } from "lucide-react"
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useContext } from "react";
import { AdminTutorialDataContext } from "../../context/AdminTutorial";




export default function Page() {

  const { admintutorial, setAdminTutorial, fetchAdminTutorialProfile } = useContext(AdminTutorialDataContext);

  useEffect(() => {
    fetchAdminTutorialProfile();
  }, []);


  const [toastId, setToastId] = useState(null);




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
                <h1 className="text-lg font-semibold text-gray-900">Tutorials</h1>
              </div>
              <Link to='/admin' className="bg-blue-700 flex items-center text-white w-8 h-8 rounded-full">
                <User size={16} className="ml-[9px]" />
              </Link>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">


            <div className="max-w-7xl mx-auto  space-y-8">

              {/* content */}
              <AllTutorial tutorials={admintutorial} settutorials={setAdminTutorial} toastId={toastId} setToastId={setToastId} />

            </div>


          </main>

        </div>
      </div>
    </>
  )

}
