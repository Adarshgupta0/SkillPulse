import React, { useContext, useEffect } from "react";
import { RoadmapDataContext } from "../../context/UserRoadmapContext";
import Sidebar from '../../components/user/App-sidebar'
import Roadmapcart from "../../components/user/RoadmapCard";
import { Link } from "react-router-dom";
import { User, } from "lucide-react"

const RoadmapPage = () => {

    const { roadmap, fetchRoadmapProfile } = useContext(RoadmapDataContext);

      useEffect(() => {
          fetchRoadmapProfile();
      }, []);


    return (
        <div className='flex h-screen'>
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                {/* Header */}
                <header className="flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6">
                    <div className="flex items-center w-full bg-green-500-600 justify-between gap-2 ml-12 lg:ml-0">
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900">Roadmaps</h1>
                        </div>
                        <Link to='/profile' className="bg-blue-700 flex items-center text-white w-8 h-8 rounded-full">
                            <User size={16} className="ml-[9px]" />
                        </Link>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
                    <div className="max-w-7xl mx-auto space-y-8">


                           <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    <div className="max-w-7xl mx-auto space-y-8">

                        <section>

                            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                                <Roadmapcart roadmaps={roadmap} />
                            </div>
                        </section>

                    </div>
                </main>


                    </div>
                </main>

            </div>
        </div>
    )
}

export default RoadmapPage
