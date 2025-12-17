

const LessonCard = ({ Lesson }) => {

const handleLessonClick = (Lessonlink) => {
    if (Lessonlink) {
      window.open(Lessonlink, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden min-w-[280px] flex-shrink-0">
      <div className="relative">
        <img src={Lesson.thumbnail || "/placeholder.svg"} alt={Lesson.title} className="w-full h-48 object-cover" />


      </div>
      <div className="p-4">
        <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">{Lesson.title}</h4>

        <h4 className=" text-gray-600 text-sm mb-2 w-[250px]  ">{Lesson.description}</h4>

        <div className="flex items-center justify-end cursor-pointer font-semibold text-sm text-blue-600"
          onClick={() => handleLessonClick(Lesson.link)}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          <span className="truncate">Explore</span>
        </div>

      </div>
    </div>
  )
}

export default LessonCard