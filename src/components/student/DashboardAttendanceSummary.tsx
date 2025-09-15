import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, UserCheck, TrendingUp, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { apiService, AttendanceSummary } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const DashboardAttendanceSummary: React.FC = () => {
  const navigate = useNavigate();
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAttendanceSummary();
  }, []);

  const fetchAttendanceSummary = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getMyAttendanceReport();
      console.log('Dashboard Attendance Summary Response:', response);
      
      if (response.data?.summary) {
        setAttendanceSummary(response.data.summary);
      } else {
        console.log('No attendance summary data received');
        setAttendanceSummary(null);
      }
    } catch (err) {
      console.error('Dashboard Attendance Summary Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance data');
    } finally {
      setIsLoading(false);
    }
  };

  const preparePieChartData = (summary: AttendanceSummary) => {
    return [
      { name: 'Present', value: summary.present, color: '#10B981' },
      { name: 'Absent', value: summary.absent, color: '#EF4444' },
      { name: 'Late', value: summary.late, color: '#F59E0B' },
      { name: 'Excused', value: summary.excused, color: '#8B5CF6' },
    ].filter(item => item.value > 0);
  };

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttendanceRateBgColor = (rate: number) => {
    if (rate >= 90) return 'bg-green-100';
    if (rate >= 75) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (isLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Attendance Overview</h3>
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !attendanceSummary) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Attendance Overview</h3>
          <button
            onClick={() => navigate(ROUTES.STUDENT.ATTENDANCE)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View Details
          </button>
        </div>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No attendance data available</p>
          <button
            onClick={() => navigate(ROUTES.STUDENT.ATTENDANCE)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Attendance
          </button>
        </div>
      </div>
    );
  }

  const pieData = preparePieChartData(attendanceSummary);

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Attendance Overview</h3>
        <button
          onClick={() => navigate(ROUTES.STUDENT.ATTENDANCE)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View Details
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="flex items-center justify-center">
          {pieData.length > 0 ? (
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">No attendance data</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="space-y-4">
          {/* Overall Attendance Rate */}
          <div className={`p-4 rounded-lg ${getAttendanceRateBgColor(attendanceSummary.overallAttendanceRate)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Attendance Rate</p>
                <p className={`text-2xl font-bold ${getAttendanceRateColor(attendanceSummary.overallAttendanceRate)}`}>
                  {attendanceSummary.overallAttendanceRate}%
                </p>
              </div>
              <div className="p-2 bg-white rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Individual Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-lg font-bold text-green-600">{attendanceSummary.present}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-lg font-bold text-red-600">{attendanceSummary.absent}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Late</p>
                <p className="text-lg font-bold text-yellow-600">{attendanceSummary.late}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserCheck className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Excused</p>
                <p className="text-lg font-bold text-purple-600">{attendanceSummary.excused}</p>
              </div>
            </div>
          </div>

          {/* Total Days */}
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Class Days</p>
            <p className="text-xl font-bold text-gray-900">{attendanceSummary.totalDays}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAttendanceSummary;
