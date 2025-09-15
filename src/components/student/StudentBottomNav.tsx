import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, CreditCard, User, GraduationCap, Calendar } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const StudentBottomNav: React.FC = () => {
  const menuItems = [
    { path: ROUTES.STUDENT.DASHBOARD, label: 'Dashboard', icon: Home },
    { path: ROUTES.STUDENT.COURSES, label: 'Courses', icon: BookOpen },
    { path: ROUTES.STUDENT.MY_COURSES, label: 'My Courses', icon: GraduationCap },
    { path: ROUTES.STUDENT.FEES, label: 'Fees', icon: CreditCard },
    { path: ROUTES.STUDENT.ATTENDANCE, label: 'Attendance', icon: Calendar },
    { path: ROUTES.STUDENT.PROFILE, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-t border-white/20 shadow-2xl">
      <div className="flex items-center justify-around px-4 py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : ''}`} />
                  <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default StudentBottomNav;