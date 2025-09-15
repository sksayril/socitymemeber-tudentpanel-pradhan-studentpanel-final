import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const StudentHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 lg:shadow-none">
      <div className="flex items-center justify-between px-4 py-4 lg:px-8">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">
            Welcome back, {user?.firstName || 'Student'}!
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          
          <button
            onClick={handleLogout}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;