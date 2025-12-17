import React, { useContext } from "react";
import { TutorialDataContext } from "../../context/UserTutorialContext";
import Sidebar from '../../components/user/App-sidebar'
import TutorialCart from '../../components/user/TutorialCart';
import { User, } from "lucide-react"
import { useEffect } from "react";
import { Link } from "react-router-dom";
const TutorialPage = () => {

  const { tutorial, fetchTutorialProfile } = useContext(TutorialDataContext);


  useEffect(() => {
      fetchTutorialProfile();
  }, []);

  return (
    <div className='flex h-screen'>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6">
          <div className="flex items-center w-full bg-green-500-600 justify-between gap-2 ml-12 lg:ml-0">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Tutorials</h1>
            </div>
            <Link to='/profile' className="bg-blue-700 flex items-center text-white w-8 h-8 rounded-full">
              <User size={16} className="ml-[9px]" />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-8">

            <section>

              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                <TutorialCart tutorials={tutorial} />
              </div>
            </section>

          </div>
        </main>

      </div>
    </div>
  )
}

export default TutorialPage
