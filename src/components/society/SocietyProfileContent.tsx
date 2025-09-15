import React from 'react';
import { Building2, Mail, Phone, MapPin, Calendar, Users, CreditCard, Edit } from 'lucide-react';

const SocietyProfileContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Society Profile</h2>
        <p className="text-gray-600">Manage society information and settings</p>
      </div>

      {/* Society Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Building2 className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Community Welfare Society</h3>
            <p className="text-gray-600 mb-2">Registered Credit Society</p>
            <p className="text-sm text-gray-500">Registration No: CWS2020001</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Society Information */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Society Information</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">info@communitywelfare.org</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-900">123 Society Street, Community Block, City - 560001</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Established</p>
                <p className="font-medium text-gray-900">January 15, 2020</p>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Details */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Operational Details</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">License Type</p>
                <p className="font-medium text-gray-900">Multi-State Cooperative Society</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Services</p>
                <p className="font-medium text-gray-900">Credit, Loans, Savings</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Operating Hours</p>
                <p className="font-medium text-gray-900">Mon-Fri: 9:00 AM - 5:00 PM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Building2 className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Branch Count</p>
                <p className="font-medium text-gray-900">5 Branches</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Society Statistics */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Society Statistics</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <p className="text-2xl font-bold text-purple-600">2,450</p>
            <p className="text-sm text-gray-600">Total Members</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-2xl font-bold text-green-600">₹12.5L</p>
            <p className="text-sm text-gray-600">Active Loans</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <p className="text-2xl font-bold text-blue-600">₹45.2L</p>
            <p className="text-sm text-gray-600">Total Deposits</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <p className="text-2xl font-bold text-yellow-600">98.5%</p>
            <p className="text-sm text-gray-600">Recovery Rate</p>
          </div>
        </div>
      </div>

      {/* Board Members */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Board of Directors</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Mr. Rajesh Gupta', position: 'Chairman', experience: '15 years' },
            { name: 'Mrs. Sunita Sharma', position: 'Vice Chairman', experience: '12 years' },
            { name: 'Mr. Amit Kumar', position: 'Secretary', experience: '8 years' },
            { name: 'Mrs. Priya Patel', position: 'Treasurer', experience: '10 years' },
            { name: 'Mr. Vikram Singh', position: 'Director', experience: '6 years' },
            { name: 'Mrs. Kavita Devi', position: 'Director', experience: '9 years' },
          ].map((member, index) => (
            <div key={index} className="p-4 border border-purple-100 rounded-lg bg-purple-50/50">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{member.name.split(' ').slice(0, 2).map(n => n[1] || n[0]).join('')}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-purple-600">{member.position}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Experience: {member.experience}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Certifications & Compliance</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 border border-green-100 rounded-lg bg-green-50/50">
            <h4 className="font-semibold text-green-900 mb-2">RBI Registration</h4>
            <p className="text-sm text-green-700">Valid until: December 2025</p>
          </div>
          <div className="p-4 border border-blue-100 rounded-lg bg-blue-50/50">
            <h4 className="font-semibold text-blue-900 mb-2">NABARD Compliance</h4>
            <p className="text-sm text-blue-700">Last audit: January 2024</p>
          </div>
          <div className="p-4 border border-purple-100 rounded-lg bg-purple-50/50">
            <h4 className="font-semibold text-purple-900 mb-2">State Registration</h4>
            <p className="text-sm text-purple-700">Registration No: CWS2020001</p>
          </div>
          <div className="p-4 border border-yellow-100 rounded-lg bg-yellow-50/50">
            <h4 className="font-semibold text-yellow-900 mb-2">Tax Compliance</h4>
            <p className="text-sm text-yellow-700">All returns filed up to date</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocietyProfileContent;