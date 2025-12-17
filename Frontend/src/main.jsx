import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import UsersContext from './context/Usercontext.jsx'
import AdminsContext from './context/Admincontext.jsx'
import LessonsContext from './context/UserLessonContext.jsx'
import TutorialsContext from './context/UserTutorialContext.jsx'
import RoadmapsContext from './context/UserRoadmapContext.jsx'
import QuizsContext from './context/QuizContext.jsx'
import HomesContext from './context/HomeContext.jsx'
import AdminRoadmapsContext from './context/AdminRoadmap.jsx'
import AdminLessonsContext from './context/AdminLesson.jsx'
import AdminTutorialsContext from './context/AdminTutorial.jsx'
import AdminQuizsContext from './context/AdminQuiz.jsx'
import AdminUserContext from './context/AdminUser.jsx'

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UsersContext>
        <AdminsContext>
          <LessonsContext>
            <TutorialsContext>
              <RoadmapsContext>
                <QuizsContext>
                  <HomesContext>
                    <AdminRoadmapsContext>
                      <AdminLessonsContext>
                        <AdminTutorialsContext>
                          <AdminQuizsContext>
                            <AdminUserContext>
                              <App />
                            </AdminUserContext>
                          </AdminQuizsContext>
                        </AdminTutorialsContext>
                      </AdminLessonsContext>
                    </AdminRoadmapsContext>
                  </HomesContext>
                </QuizsContext>
              </RoadmapsContext>
            </TutorialsContext>
          </LessonsContext>
        </AdminsContext>
      </UsersContext>
    </BrowserRouter>
  </StrictMode>,
)
