import React from 'react'
import { iconMap } from '../../pages/user/HomePage'


const TutorialCard = ({ Tutorial }) => {

  const handleTutorialClick = (Tutoriallink) => {
    if (Tutoriallink) {
      window.open(Tutoriallink, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 hover:transform hover:-translate-y-1">
      <div className="flex items-start">
        <div className='bg-blue-700 flex items-center justify-center  rounded-md p-2 mr-3'>
          <div className="text-gray-50 ">
            {React.createElement(iconMap[Tutorial.icon], { size: 20 })}
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-gray-800 mb-1">{Tutorial.title}</h4>
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
            <span className="font-medium">{Tutorial.channelname}</span>
          </div>
          <p className="text-sm mt-2 text-gray-600 mb-2">{Tutorial.description}</p>
          <div className="flex items-center justify-end cursor-pointer font-semibold text-sm text-blue-600"
            onClick={() => handleTutorialClick(Tutorial.link)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            <span className="truncate">Watch</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorialCard