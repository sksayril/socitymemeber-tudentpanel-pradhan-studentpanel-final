import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CreditCard, User, TrendingUp } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const SocietyBottomNav: React.FC = () => {
  const menuItems = [
    { path: ROUTES.SOCIETY.DASHBOARD, label: 'Dashboard', icon: Home },
    { path: ROUTES.SOCIETY.LOANS, label: 'Loans', icon: CreditCard },
    { path: ROUTES.SOCIETY.INVESTMENTS, label: 'Investments', icon: TrendingUp },
    { path: ROUTES.SOCIETY.PROFILE, label: 'Profile', icon: User },
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
                `flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-purple-600'
                    : 'text-gray-500 hover:text-purple-600'
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

export default SocietyBottomNav;