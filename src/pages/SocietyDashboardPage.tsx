import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SocietySidebar from '../components/society/SocietySidebar';
import SocietyBottomNav from '../components/society/SocietyBottomNav';
import SocietyHeader from '../components/society/SocietyHeader';
import SocietyDashboardContent from '../components/society/SocietyDashboardContent';
import LoansPage from '../components/society/LoansPage';
import InvestmentsContent from '../components/society/InvestmentsContent';
import CDInvestmentsContent from '../components/society/CDInvestmentsContent';
import SocietyProfileContent from '../components/society/SocietyProfileContent';
import { ROUTES } from '../constants/routes';

const SocietyDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SocietySidebar />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <SocietyHeader />
        <main className="p-4 lg:p-8 pb-20 lg:pb-8">
          <Routes>
            <Route path="/" element={<Navigate to={ROUTES.SOCIETY.DASHBOARD} replace />} />
            <Route path="dashboard" element={<SocietyDashboardContent />} />
            <Route path="loans" element={<LoansPage />} />
            <Route path="investments" element={<InvestmentsContent />} />
            <Route path="cd-investments" element={<CDInvestmentsContent />} />
            <Route path="profile" element={<SocietyProfileContent />} />
            <Route path="*" element={<Navigate to={ROUTES.SOCIETY.DASHBOARD} replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <SocietyBottomNav />
      </div>
    </div>
  );
};

export default SocietyDashboardPage;
