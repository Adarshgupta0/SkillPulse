
import React, { useContext } from "react";
import { QuizDataContext } from "../../context/QuizContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import Sidebar from '../../components/user/App-sidebar'



export default function DailyQuizPage() {

  const { quiz, fetchQuizProfile } = useContext(QuizDataContext);


  useEffect(() => {
    fetchQuizProfile();
  }, []);


  const [selectedAnswers, setSelectedAnswers] = useState(Array(quiz.length).fill(null))
  const [lockedQuizzes, setLockedQuizzes] = useState(Array(quiz.length).fill(false))



  const handleOptionClick = (quizIndex, optionIndex) => {
    // If quiz is already locked, do nothing
    if (lockedQuizzes[quizIndex]) return

    // Update selected answer
    const newSelectedAnswers = [...selectedAnswers]
    newSelectedAnswers[quizIndex] = optionIndex
    setSelectedAnswers(newSelectedAnswers)

    // Lock the quiz
    const newLockedQuizzes = [...lockedQuizzes]
    newLockedQuizzes[quizIndex] = true
    setLockedQuizzes(newLockedQuizzes)
  }

  const getOptionClassName = (quizIndex, optionIndex, option) => {
    const baseClasses = "w-full p-3 text-left rounded-lg border-2 transition-all duration-200 font-medium"

    // If quiz is not locked, show default styling
    if (!lockedQuizzes[quizIndex]) {
      return `${baseClasses} border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 cursor-pointer`
    }

    // Quiz is locked, show results
    const isSelected = selectedAnswers[quizIndex] === optionIndex
    const isCorrect = option.isCorrect

    if (isSelected && isCorrect) {
      // Selected and correct
      return `${baseClasses} border-green-400 bg-green-100 text-green-800 cursor-not-allowed`
    } else if (isSelected && !isCorrect) {
      // Selected but incorrect
      return `${baseClasses} border-red-400 bg-red-100 text-red-800 cursor-not-allowed`
    } else if (!isSelected && isCorrect) {
      // Not selected but correct (show correct answer)
      return `${baseClasses} border-green-400 bg-green-100 text-green-800 cursor-not-allowed`
    } else {
      // Not selected and not correct
      return `${baseClasses} border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed`
    }
  }

  return (
    <div className='flex h-screen'>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <header className="flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6">
          <div className="flex items-center w-full justify-between gap-2 ml-12 lg:ml-0">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Quizzes</h1>
            </div>
            <Link to='/profile' className="bg-blue-700 flex items-center text-white w-8 h-8 rounded-full">
              <User size={16} className="ml-[9px]" />
            </Link>
          </div>
        </header>


        {/* Quiz Content */}


        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">



          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Daily Quiz Challenge</h2>
              <p className="text-gray-600">Test your knowledge with these {quiz.length} questions!</p>
            </div>

            {quiz.map((quiz, quizIndex) => (
              <div key={quizIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Question {quizIndex + 1}
                    </span>
                    {lockedQuizzes[quizIndex] && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Completed
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900 leading-tight">
                    {quiz.quiz}
                  </h3>
                </div>

                <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                  {quiz.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      onClick={() => handleOptionClick(quizIndex, optionIndex)}
                      disabled={lockedQuizzes[quizIndex]}
                      className={getOptionClassName(quizIndex, optionIndex, option)}
                    >
                      <span className="flex items-center">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current mr-3 flex items-center justify-center text-xs font-bold">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span className="flex-1">{option.text}</span>
                      </span>
                    </button>
                  ))}
                </div>

                {lockedQuizzes[quizIndex] && (
                  <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm text-gray-600">
                      {quiz.options[selectedAnswers[quizIndex]].isCorrect ? (
                        <span className="text-green-700 font-medium">✓ Correct! Well done.</span>
                      ) : (
                        <span className="text-red-700 font-medium">✗ Incorrect. The correct answer is highlighted above.</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            ))}

            <div className="text-center py-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200">
                <span className="text-blue-700 font-medium">
                  Completed: {lockedQuizzes.filter(Boolean).length} / {quiz.length}
                </span>
              </div>
            </div>
          </div>



        </div>

      </div>
    </div>
  )
}
