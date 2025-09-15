import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';

// Pages
import HomePage from './pages/HomePage';
import StudentLoginPage from './pages/StudentLoginPage';
import StudentSignupPage from './pages/StudentSignupPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import SocietyLoginPage from './pages/SocietyLoginPage';
import SocietySignupPage from './pages/SocietySignupPage';
import SocietyDashboardPage from './pages/SocietyDashboardPage';
import KYCVerificationPage from './pages/KYCVerificationPage';
import StudentCourseDetailPage from './pages/StudentCourseDetailPage';
import StudentMyCoursesPage from './pages/StudentMyCoursesPage';
import ErrorBoundary from './components/ErrorBoundary';
// import DebugTokenStatus from './components/DebugTokenStatus';

// Route constants
import { ROUTES } from './constants/routes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.STUDENT.LOGIN} element={<StudentLoginPage />} />
          <Route path={ROUTES.STUDENT.SIGNUP} element={<StudentSignupPage />} />
          <Route path={ROUTES.SOCIETY.LOGIN} element={<SocietyLoginPage />} />
          <Route path={ROUTES.SOCIETY.SIGNUP} element={<SocietySignupPage />} />
          <Route path={ROUTES.KYC_VERIFICATION} element={<KYCVerificationPage />} />

          {/* Protected Student Routes */}
          <Route
            path="/student/courses/:courseId"
            element={
              <ProtectedRoute allowedUserTypes={['student']}>
                <StudentCourseDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/my-courses/:enrollmentId"
            element={
              <ProtectedRoute allowedUserTypes={['student']}>
                <ErrorBoundary>
                  <StudentMyCoursesPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path={`${ROUTES.STUDENT.BASE}/*`}
            element={
              <ProtectedRoute allowedUserTypes={['student']}>
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Society Routes */}
          <Route
            path={`${ROUTES.SOCIETY.BASE}/*`}
            element={
              <ProtectedRoute allowedUserTypes={['society']}>
                <SocietyDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Error Routes */}
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
          <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
        </Routes>
        
        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        
        {/* Debug Component - Remove in production */}
        {/* <DebugTokenStatus /> */}
      </Router>
    </AuthProvider>
  );
}

export default App;