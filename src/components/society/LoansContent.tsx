import React, { useState } from 'react';
import { Search, Filter, Eye, Check, X, Clock } from 'lucide-react';

const LoansContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const loans = [
    {
      id: 'L001',
      name: 'Rajesh Kumar',
      amount: '₹50,000',
      type: 'Education Loan',
      status: 'pending',
      appliedDate: '2024-03-10',
      purpose: 'Engineering Course Fees',
      documents: 'Complete'
    },
    {
      id: 'L002',
      name: 'Priya Sharma',
      amount: '₹25,000',
      type: 'Personal Loan',
      status: 'approved',
      appliedDate: '2024-03-08',
      purpose: 'Medical Emergency',
      documents: 'Complete'
    },
    {
      id: 'L003',
      name: 'Amit Patel',
      amount: '₹75,000',
      type: 'Business Loan',
      status: 'under_review',
      appliedDate: '2024-03-05',
      purpose: 'Shop Renovation',
      documents: 'Pending'
    },
    {
      id: 'L004',
      name: 'Sunita Devi',
      amount: '₹30,000',
      type: 'Emergency Loan',
      status: 'rejected',
      appliedDate: '2024-03-03',
      purpose: 'House Repairs',
      documents: 'Incomplete'
    },
    {
      id: 'L005',
      name: 'Vikram Singh',
      amount: '₹40,000',
      type: 'Education Loan',
      status: 'approved',
      appliedDate: '2024-03-01',
      purpose: 'Daughter\'s College Fees',
      documents: 'Complete'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <Check className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      case 'under_review': return <Eye className="w-4 h-4" />;
      default: return null;
    }
  };

  const filteredLoans = activeTab === 'all' ? loans : loans.filter(loan => loan.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Loan Management</h2>
        <p className="text-gray-600">Review and manage member loan applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Applications</h3>
          <p className="text-2xl font-bold text-gray-900">{loans.length}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">{loans.filter(l => l.status === 'pending').length}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Approved</h3>
          <p className="text-2xl font-bold text-green-600">{loans.filter(l => l.status === 'approved').length}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Rejected</h3>
          <p className="text-2xl font-bold text-red-600">{loans.filter(l => l.status === 'rejected').length}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Applications' },
              { key: 'pending', label: 'Pending' },
              { key: 'approved', label: 'Approved' },
              { key: 'rejected', label: 'Rejected' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  activeTab === tab.key
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search loans..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Loans Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-900">Loan ID</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-900">Applicant</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-900">Type</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-900">Applied Date</th>
                <th className="text-center py-3 px-2 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-purple-50/50">
                  <td className="py-4 px-2 font-medium text-gray-900">{loan.id}</td>
                  <td className="py-4 px-2">
                    <div>
                      <p className="font-medium text-gray-900">{loan.name}</p>
                      <p className="text-sm text-gray-500">{loan.purpose}</p>
                    </div>
                  </td>
                  <td className="py-4 px-2 font-semibold text-gray-900">{loan.amount}</td>
                  <td className="py-4 px-2 text-gray-600">{loan.type}</td>
                  <td className="py-4 px-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                      {getStatusIcon(loan.status)}
                      <span className="ml-1 capitalize">{loan.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="py-4 px-2 text-gray-600">{loan.appliedDate}</td>
                  <td className="py-4 px-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      {loan.status === 'pending' && (
                        <>
                          <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                            <Check className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoansContent;