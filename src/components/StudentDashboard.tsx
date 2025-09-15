import React from 'react';
import { StudentPage } from '../App';
import StudentSidebar from './student/StudentSidebar';
import StudentBottomNav from './student/StudentBottomNav';
import StudentHeader from './student/StudentHeader';
import DashboardContent from './student/DashboardContent';
import CoursesContent from './student/CoursesContent';
import FeesContent from './student/FeesContent';
import ProfileContent from './student/ProfileContent';

interface StudentDashboardProps {
  currentPage: StudentPage;
  setCurrentPage: (page: StudentPage) => void;
  onLogout: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentPage,
  setCurrentPage,
  onLogout,
}) => {
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardContent />;
      case 'courses':
        return <CoursesContent />;
      case 'fees':
        return <FeesContent />;
      case 'profile':
        return <ProfileContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <StudentSidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogout={onLogout}
        />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <StudentHeader onLogout={onLogout} />
        <main className="p-4 lg:p-8 pb-20 lg:pb-8">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <StudentBottomNav
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;