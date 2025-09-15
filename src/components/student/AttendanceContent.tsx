import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  UserCheck,
  TrendingUp,
  Loader2,
  RefreshCw,
  Filter
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { toast } from 'react-toastify';
import { 
  apiService, 
  AttendanceReportResponse,
  AttendanceSummary,
  MonthlyAttendanceReport,
  AttendanceFilters
} from '../../services/api';

const AttendanceContent: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AttendanceFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAttendanceData();
  }, [filters]);

  const fetchAttendanceData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getMyAttendanceReport(filters);
      console.log('Attendance Report Response:', response);
      
      if (response.data) {
        setAttendanceData(response.data);
      } else {
        console.log('No attendance data received');
        setAttendanceData(null);
      }
    } catch (err) {
      console.error('Attendance Report Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance data');
      toast.error('Failed to fetch attendance data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return '#10B981'; // green
      case 'absent':
        return '#EF4444'; // red
      case 'late':
        return '#F59E0B'; // yellow
      case 'excused':
        return '#8B5CF6'; // purple
      default:
        return '#6B7280'; // gray
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4" />;
      case 'absent':
        return <XCircle className="w-4 h-4" />;
      case 'late':
        return <Clock className="w-4 h-4" />;
      case 'excused':
        return <UserCheck className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
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

  const prepareMonthlyChartData = (monthlyReport: MonthlyAttendanceReport[]) => {
    return monthlyReport.map(month => ({
      month: month.month.split(' ')[0], // Just the month name
      attendanceRate: month.attendanceRate,
      present: month.present,
      absent: month.absent,
      late: month.late,
      excused: month.excused,
    }));
  };

  const handleFilterChange = (key: keyof AttendanceFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Attendance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <input
              type="number"
              value={filters.year || ''}
              onChange={(e) => handleFilterChange('year', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 2024"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <select
              value={filters.month || ''}
              onChange={(e) => handleFilterChange('month', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear Filters
          </button>
          <button
            onClick={() => setShowFilters(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    );
  };

  const renderSummaryCards = (summary: AttendanceSummary) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Days</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalDays}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-600">{summary.present}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{summary.absent}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Late</p>
              <p className="text-2xl font-bold text-yellow-600">{summary.late}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-blue-600">{summary.overallAttendanceRate}%</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPieChart = (summary: AttendanceSummary) => {
    const data = preparePieChartData(summary);
    
    if (data.length === 0) {
      return (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Overview</h3>
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No attendance data available</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderMonthlyChart = (monthlyReport: MonthlyAttendanceReport[]) => {
    const data = prepareMonthlyChartData(monthlyReport);
    
    if (data.length === 0) {
      return null;
    }

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Attendance Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" stackId="a" fill="#10B981" name="Present" />
              <Bar dataKey="absent" stackId="a" fill="#EF4444" name="Absent" />
              <Bar dataKey="late" stackId="a" fill="#F59E0B" name="Late" />
              <Bar dataKey="excused" stackId="a" fill="#8B5CF6" name="Excused" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderMonthlyDetails = (monthlyReport: MonthlyAttendanceReport[]) => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Details</h3>
        {monthlyReport.map((month) => (
          <div key={month.monthKey} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">{month.month}</h4>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-600">Present: {month.present}</span>
                  <span className="text-red-600">Absent: {month.absent}</span>
                  <span className="text-yellow-600">Late: {month.late}</span>
                  <span className="text-purple-600">Excused: {month.excused}</span>
                  <span className="font-semibold text-blue-600">Rate: {month.attendanceRate}%</span>
                </div>
              </div>
            </div>
            
            {month.records.length > 0 && (
              <div className="p-6">
                <div className="space-y-3">
                  {month.records.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getStatusColor(record.status)} bg-opacity-20`}>
                          {getStatusIcon(record.status)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{formatDate(record.date)}</p>
                          <p className="text-sm text-gray-600">
                            {record.course.title} - {record.batch.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatTime(record.timeSlot.startTime)} - {formatTime(record.timeSlot.endTime)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          record.status === 'present' ? 'bg-green-100 text-green-800' :
                          record.status === 'absent' ? 'bg-red-100 text-red-800' :
                          record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {record.status}
                        </span>
                        {record.remarks && (
                          <p className="text-xs text-gray-500 mt-1">{record.remarks}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading attendance data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Attendance Data</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchAttendanceData}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  if (!attendanceData) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Attendance Data</h3>
        <p className="text-gray-600">No attendance records found for the selected period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Calendar className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Report</h1>
            <p className="text-gray-600">Track your attendance across all enrolled courses</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button
            onClick={fetchAttendanceData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      {renderFilters()}

      {/* Summary Cards */}
      {renderSummaryCards(attendanceData.summary)}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderPieChart(attendanceData.summary)}
        {renderMonthlyChart(attendanceData.monthlyReport)}
      </div>

      {/* Monthly Details */}
      {attendanceData.monthlyReport.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          {renderMonthlyDetails(attendanceData.monthlyReport)}
        </div>
      )}
    </div>
  );
};

export default AttendanceContent;
