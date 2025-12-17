import React from 'react'
import { iconMap } from '../../pages/user/HomePage'

const RoadmapCard = ({ roadmap }) => {

  const handleRoadmapClick = (roadmaplink) => {
    if (roadmaplink) {
      window.open(roadmaplink, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden hover:transform hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-center justify-start mb-4">
         <div className='bg-blue-700 flex items-center justify-center  rounded-md p-2 mr-3'>
           <div className="text-gray-50 ">
            {React.createElement(iconMap[roadmap.icon], { size: 20 })}
          </div>
         </div>
          <div>
            <h4 className="font-semibold text-gray-800">{roadmap.title}</h4>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4">{roadmap.description}</p>
        <div className="flex items-center justify-end cursor-pointer font-semibold text-sm text-blue-600"
          onClick={() => handleRoadmapClick(roadmap.link)}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          <span className="truncate">Path</span>
        </div>
      </div>
    </div>
  )
}

export default RoadmapCard
