import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, CreditCard, User, LogOut, GraduationCap, Search, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';

const StudentSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };
  const menuItems = [
    { path: ROUTES.STUDENT.DASHBOARD, label: 'Dashboard', icon: Home },
    { path: ROUTES.STUDENT.COURSES, label: 'Browse Courses', icon: Search },
    { path: ROUTES.STUDENT.MY_COURSES, label: 'My Courses', icon: GraduationCap },
    { path: ROUTES.STUDENT.MARKSHEETS, label: 'Marksheets', icon: FileText },
    { path: ROUTES.STUDENT.FEES, label: 'Fees', icon: CreditCard },
    { path: ROUTES.STUDENT.ATTENDANCE, label: 'Attendance', icon: Calendar },
    { path: ROUTES.STUDENT.PROFILE, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-sm shadow-xl border-r border-white/20">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200/50">
          <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
          <span className="text-xl font-bold text-gray-900">Student Portal</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;