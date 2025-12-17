import { Route, Routes } from 'react-router-dom'
import Protect from './middlewares/Protect'
import OtpToken from './middlewares/OtpToken'
import ChangePassToken from './middlewares/ChangePassToken'
import StartPage from './pages/user/StartPage'
{/* user pages */ }
import LoginPage from './pages/user/LoginPage'
import RegisterPage from './pages/user/RegisterPage'
import HomePage from './pages/user/HomePage'
import Logout from './pages/user/Logout'
import ProfilePage from './pages/user/ProfilePage'
import LessonPage from './pages/user/LessonPage'
import DailyQuizPage from './pages/user/DailyQuizPage'
import EditProfile from './pages/user/EditProfile'
import RoadmapPage from './pages/user/RoadmapPage';
import ForgotPassword from './pages/user/ForgotPassword'
import OtpVarifyPage from './pages/user/OtpVarifyPage'
import ResetPassword from './pages/user/ResetPassword'
import TutorialPage from './pages/user/TutorialPage'
{/* admin pages */ }
import { ProtectAdmin, ChangePassTokenAdmin, OtpTokenAdmin } from "./middlewares/AdminProtect";
import AdminForgotPassword from './pages/admin/ForgotPassPage'
import AdminOtpVarifyPage from './pages/admin/OtpVarifyPage'
import AdminResetPassword from './pages/admin/ResetPassPage'
import Profile from './pages/admin/ProfilePage'
import AdminLoginPage from './pages/admin/LoginPage'
import AdminRegisterPage from './pages/admin/RegisterPage'
import AlluserPage from './pages/admin/AlluserPage'
import AllLessonPage from './pages/admin/AllLessonPage'
import AllquizPage from './pages/admin/AllquizPage'
import AllTutorialPage from './pages/admin/AllTutorialPage'
import AllRoadmapPage from './pages/admin/AllRoadmapPage'
import EditLessonPage from './pages/admin/EditLessonPage';
import EditQuizPage from './pages/admin/QuizEditPage';
import EditTutorialPage from './pages/admin/EditTutorialPage';
import EditRoadmapPage from './pages/admin/EditRoadmapPage';
import CreateLessonPage from './pages/admin/CreateLessonPage';
import CreateQuizPage from './pages/admin/CreateQuizPage';
import CreateTutorialPage from './pages/admin/CreateTutorialPage';
import CreateRoadmapPage from './pages/admin/CreateRoadmapPage';
import LogoutAdmin from './pages/admin/LogoutPage';
import EditProfileAdmin from './pages/admin/EditProfilePage';

function App() {

  return (
    <div>

      <Routes>

        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/otpvarify' element={<OtpToken> <OtpVarifyPage /> </OtpToken>} />
        <Route path='/resetpassword' element={<ChangePassToken> <ResetPassword /> </ChangePassToken>} />
        <Route path='/home' element={<StartPage />} />
        <Route path='/' element={<Protect> <HomePage /> </Protect>} />
        <Route path='/logout' element={<Protect> <Logout /> </Protect>} />
        <Route path='/profile' element={<Protect> <ProfilePage /> </Protect>} />
        <Route path='/explore-lessons' element={<Protect> <LessonPage /> </Protect>} />
        <Route path='/dailyquiz' element={<Protect> <DailyQuizPage /> </Protect>} />
        <Route path='/editprofile' element={<Protect> <EditProfile /> </Protect>} />
        <Route path='/roadmap' element={<Protect> <RoadmapPage /> </Protect>} />
        <Route path='/tutorials' element={<Protect> <TutorialPage /> </Protect>} />

        {/* admin route */}

        <Route path='/admin/login' element={<AdminLoginPage />} />
        <Route path='/admin/register' element={<AdminRegisterPage />} />
        <Route path='/admin/forgotpassword' element={<AdminForgotPassword />} />
        <Route path='/admin/otpvarify' element={<OtpTokenAdmin> <AdminOtpVarifyPage /> </OtpTokenAdmin>} />
        <Route path='/admin/resetpassword' element={<ChangePassTokenAdmin> <AdminResetPassword /> </ChangePassTokenAdmin>} />
        <Route path='/admin/users' element={<ProtectAdmin> <AlluserPage /> </ProtectAdmin>} />
        <Route path='/admin' element={<ProtectAdmin> <Profile /> </ProtectAdmin>} />
        <Route path='/admin/editprofile' element={<ProtectAdmin> <EditProfileAdmin /> </ProtectAdmin>} />
        <Route path='/admin/logout' element={<ProtectAdmin> <LogoutAdmin /> </ProtectAdmin>} />

        <Route path='/admin/explore-lessons' element={<ProtectAdmin> <AllLessonPage /> </ProtectAdmin>} />
        <Route path='/admin/tutorials' element={<ProtectAdmin> <AllTutorialPage /> </ProtectAdmin>} />
        <Route path='/admin/roadmaps' element={<ProtectAdmin> <AllRoadmapPage /> </ProtectAdmin>} />
        <Route path='/admin/quizzes' element={<ProtectAdmin> <AllquizPage /> </ProtectAdmin>} />

        <Route path='/admin/edit-explore-lesson/:id' element={<ProtectAdmin> <EditLessonPage /> </ProtectAdmin>} />
        <Route path='/admin/edit-tutorial/:id' element={<ProtectAdmin> <EditTutorialPage /> </ProtectAdmin>} />
        <Route path='/admin/edit-roadmap/:id' element={<ProtectAdmin> <EditRoadmapPage /> </ProtectAdmin>} />
        <Route path='/admin/edit-quiz/:id' element={<ProtectAdmin> <EditQuizPage /> </ProtectAdmin>} />

        <Route path='/admin/create-lesson' element={<ProtectAdmin> <CreateLessonPage /> </ProtectAdmin>} />
        <Route path='/admin/create-tutorial' element={<ProtectAdmin> <CreateTutorialPage /></ProtectAdmin>} />
        <Route path='/admin/create-roadmap' element={<ProtectAdmin> <CreateRoadmapPage /> </ProtectAdmin>} />
        <Route path='/admin/create-quiz' element={<ProtectAdmin> <CreateQuizPage /> </ProtectAdmin>} />

      </Routes>
    </div>
  )
}

export default App
