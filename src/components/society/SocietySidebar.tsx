import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, CreditCard, User, LogOut, Building2, TrendingUp, Banknote } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';

const SocietySidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };
  const menuItems = [
    { path: ROUTES.SOCIETY.DASHBOARD, label: 'Dashboard', icon: Home },
    { path: ROUTES.SOCIETY.LOANS, label: 'Loans', icon: CreditCard },
    { path: ROUTES.SOCIETY.INVESTMENTS, label: 'Investments', icon: TrendingUp },
    { path: ROUTES.SOCIETY.CD_INVESTMENTS, label: 'CD Investment', icon: Banknote },
    { path: ROUTES.SOCIETY.PROFILE, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-sm shadow-xl border-r border-white/20">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200/50">
          <Building2 className="w-8 h-8 text-purple-600 mr-3" />
          <span className="text-xl font-bold text-gray-900">Society Portal</span>
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
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
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

export default SocietySidebar;