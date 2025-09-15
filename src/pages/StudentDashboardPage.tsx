import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StudentSidebar from '../components/student/StudentSidebar';
import StudentBottomNav from '../components/student/StudentBottomNav';
import StudentHeader from '../components/student/StudentHeader';
import DashboardContent from '../components/student/DashboardContent';
import CoursesContent from '../components/student/CoursesContent';
import MyCoursesContent from '../components/student/MyCoursesContent';
import FeesContent from '../components/student/FeesContent';
import AttendanceContent from '../components/student/AttendanceContent';
import ProfileContent from '../components/student/ProfileContent';
import ErrorBoundary from '../components/ErrorBoundary';
import { ROUTES } from '../constants/routes';

const StudentDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <StudentSidebar />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <StudentHeader />
        <main className="p-4 lg:p-8 pb-20 lg:pb-8">
          <Routes>
            <Route path="/" element={<Navigate to={ROUTES.STUDENT.DASHBOARD} replace />} />
            <Route path="dashboard" element={<DashboardContent />} />
            <Route path="courses" element={<CoursesContent />} />
            <Route path="my-courses" element={
              <ErrorBoundary>
                <MyCoursesContent />
              </ErrorBoundary>
            } />
            <Route path="fees" element={<FeesContent />} />
            <Route path="attendance" element={<AttendanceContent />} />
            <Route path="profile" element={<ProfileContent />} />
            <Route path="*" element={<Navigate to={ROUTES.STUDENT.DASHBOARD} replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <StudentBottomNav />
      </div>
    </div>
  );
};

export default StudentDashboardPage;
