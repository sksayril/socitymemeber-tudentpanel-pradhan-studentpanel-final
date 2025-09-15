// API Service for handling HTTP requests
const API_BASE_URL = 'https://api.padyai.co.in/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface StudentSignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department: string;
  year: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  profilePicture?: string;
  interests?: string[];
}

export interface SocietyMemberSignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  societyName: string;
  position: string;
  department: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  profilePicture?: string;
  skills?: string[];
  responsibilities?: string[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isVerified: boolean;
  // Student specific fields
  department?: string;
  year?: string;
  // Society member specific fields
  societyName?: string;
  position?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  userType: 'student' | 'societyMember';
}

export interface DashboardStats {
  enrolledSocieties?: number;
  eventsAttended?: number;
  achievements?: number;
  eventsOrganized?: number;
  membersManaged?: number;
  upcomingEvents?: number;
}

export interface KYCData {
  id: string;
  aadharNumber: string;
  panNumber?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  remarks?: string;
  reviewedBy?: string;
}

export interface KYCStatusResponse {
  kycStatus: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  kyc?: KYCData;
}

// Course-related interfaces
export interface Course {
  _id: string;
  title: string;
  description: string;
  type: 'online' | 'offline';
  category: string;
  instructor: {
    name: string;
    email?: string;
  };
  price: number;
  currency: string;
  thumbnail?: string;
  rating: {
    average: number;
    count: number;
  };
}

export interface CourseBatch {
  _id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  timeSlots: {
    date: string;
    startTime: string;
    endTime: string;
    duration?: number;
  }[];
}

export interface CourseEnrollment {
  _id: string;
  studentId: string;
  courseId: Course;
  batchId: CourseBatch;
  status: 'enrolled' | 'completed' | 'dropped';
  paymentStatus: 'pending' | 'paid' | 'failed';
  enrolledAt: string;
}

export interface CourseFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'online' | 'offline';
  category?: string;
  sortBy?: 'createdAt' | 'price' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface CoursePagination {
  currentPage: number;
  totalPages: number;
  totalCourses: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CourseListResponse {
  courses: Course[];
  pagination: CoursePagination;
}

export interface CourseDetailResponse {
  course: Course;
  availableBatches: CourseBatch[];
}

export interface CourseEnrollmentResponse {
  enrolledCourses: CourseEnrollment[];
}

export interface EnrollCourseData {
  courseId: string;
  batchId: string;
}

// Fee-related interfaces
export interface FeeRequest {
  _id: string;
  studentId: string;
  courseId: {
    _id: string;
    title: string;
    category: string;
    type: 'online' | 'offline';
    price: number;
    currency: string;
    duration: number;
    durationUnit: string;
    instructor: string;
  };
  batchId: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
    maxStudents: number;
    price: number;
    currency: string;
    timeSlots: Array<{
      date: string;
      startTime: string;
      endTime: string;
      duration: number;
      isActive: boolean;
    }>;
  };
  totalAmount: number;
  currency: string;
  paymentMethod: 'online' | 'cash' | 'bank_transfer' | 'cheque';
  status: 'pending' | 'overdue' | 'partial' | 'paid';
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  requestDate: string;
  notes: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  urgency?: 'overdue' | 'urgent' | 'soon' | 'normal';
  daysUntilDue?: number;
}

export interface Payment {
  _id: string;
  feeRequestId: string;
  studentId: string;
  courseId: {
    _id: string;
    title: string;
    category: string;
    type: 'online' | 'offline';
  };
  batchId: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  amount: number;
  currency: string;
  paymentMethod: 'cash' | 'online' | 'bank_transfer' | 'cheque';
  paymentStatus: 'completed' | 'pending' | 'failed';
  paymentDate: string;
  transactionId?: string;
  paymentReference?: string;
  receiptNumber?: string;
  notes?: string;
  collectedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface FeeSummary {
  feeRequests: {
    total: number;
    pending: number;
    overdue: number;
    partial: number;
    paid: number;
  };
  amounts: {
    totalRequested: number;
    totalPaid: number;
    totalRemaining: number;
  };
  payments: {
    total: number;
    totalAmount: number;
    byMethod: {
      cash: number;
      online: number;
      bank_transfer: number;
      cheque: number;
    };
  };
  urgency: {
    overdue: number;
    dueSoon: number;
  };
}

export interface FeeRequestsResponse {
  summary: {
    totalRequests: number;
    totalAmount: number;
    totalPaid: number;
    totalRemaining: number;
    pendingRequests: number;
    overdueRequests: number;
    paidRequests: number;
    partialRequests: number;
  };
  feeRequests: FeeRequest[];
}

export interface PaymentHistoryResponse {
  summary: {
    totalPayments: number;
    totalAmountPaid: number;
    cashPayments: number;
    onlinePayments: number;
    bankTransferPayments: number;
    chequePayments: number;
  };
  payments: Payment[];
}

export interface PendingFeesResponse {
  summary: {
    totalPendingRequests: number;
    totalAmountDue: number;
    overdueCount: number;
    pendingCount: number;
    partialCount: number;
    urgentCount: number;
  };
  pendingFees: FeeRequest[];
}

// Attendance-related interfaces
export interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  timeSlot: {
    startTime: string;
    endTime: string;
    duration: number;
  };
  remarks?: string;
  course: {
    _id: string;
    title: string;
    category: string;
    type: 'online' | 'offline';
  };
  batch: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  markedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

export interface MonthlyAttendanceReport {
  month: string;
  monthKey: string;
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
  records: AttendanceRecord[];
}

export interface AttendanceSummary {
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  overallAttendanceRate: number;
}

export interface AttendanceReportResponse {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentId: string;
    email: string;
    phoneNumber: string;
  };
  enrollments: Array<{
    id: string;
    course: {
      _id: string;
      title: string;
      category: string;
      type: 'online' | 'offline';
    };
    batch: {
      _id: string;
      name: string;
      startDate: string;
      endDate: string;
    };
    enrollmentDate: string;
    status: string;
    approvalStatus: string;
  }>;
  summary: AttendanceSummary;
  monthlyReport: MonthlyAttendanceReport[];
  filter: {
    year: string | null;
    month: number | null;
    startDate: string | null;
    endDate: string | null;
  };
}

export interface AttendanceFilters {
  year?: number;
  month?: number;
  startDate?: string;
  endDate?: string;
}

// Student Profile interfaces
export interface StudentAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
}

export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: StudentAddress;
  emergencyContact: EmergencyContact;
  profilePicture?: string;
  isActive: boolean;
  originalPassword: string;
  createdAt: string;
  updatedAt: string;
}

export interface KYCInfo {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  documents: {
    aadharCard?: string;
    aadharNumber?: string;
  };
}

export interface ProfileEnrollment {
  id: string;
  course: {
    _id: string;
    title: string;
    category: string;
    type: 'online' | 'offline';
    price: number;
    currency: string;
    duration: number;
    description: string;
    instructor: string;
  };
  batch: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
    maxStudents: number;
    timeSlots: Array<{
      date: string;
      startTime: string;
      endTime: string;
      duration: number;
      isActive: boolean;
    }>;
  };
  status: string;
  approvalStatus: string;
  enrollmentDate: string;
  paymentAmount: number;
  currency: string;
  paymentStatus: string;
  approvedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface ProfileAttendanceSummary {
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
}

export interface ProfileFeeSummary {
  totalRequested: number;
  totalPaid: number;
  totalPending: number;
  currency: string;
}

export interface ProfileFeeRequest {
  id: string;
  course: {
    _id: string;
    title: string;
    category: string;
    type: 'online' | 'offline';
  };
  batch: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  amount: number;
  currency: string;
  status: string;
  dueDate: string;
  description: string;
  createdAt: string;
}

export interface ProfilePayment {
  id: string;
  course: {
    _id: string;
    title: string;
    category: string;
    type: 'online' | 'offline';
  };
  batch: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentDate: string;
  transactionId?: string;
  status: string;
  createdAt: string;
}

export interface ProfileStatistics {
  totalEnrollments: number;
  activeEnrollments: number;
  pendingEnrollments: number;
  rejectedEnrollments: number;
  totalFeeRequests: number;
  totalFeePayments: number;
  attendanceRate: number;
}

export interface StudentProfileResponse {
  profile: StudentProfile;
  kyc: KYCInfo;
  enrollments: ProfileEnrollment[];
  attendance: {
    summary: ProfileAttendanceSummary;
  };
  fees: {
    summary: ProfileFeeSummary;
    requests: ProfileFeeRequest[];
    payments: ProfilePayment[];
  };
  statistics: ProfileStatistics;
}

// Investment Application Interfaces
export interface InvestmentApplicationFilters {
  status?: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  page?: number;
  limit?: number;
}

export interface InvestmentPlanFilters {
  planType?: 'FD' | 'RD' | 'CD';
  minAmount?: number;
  maxAmount?: number;
}

export interface InvestmentPlan {
  _id: string;
  planId: string;
  planName: string;
  planType: 'FD' | 'RD' | 'CD';
  description: string;
  minimumAmount: number;
  maximumAmount: number;
  interestRate: number;
  tenureMonths: number;
  compoundingFrequency: string;
  emiCostStructure: {
    planType: string;
    costStructure: {
      minimumInvestment?: number;
      maximumInvestment?: number;
      investmentIncrements?: number;
      minimumMonthlyInstallment?: number;
      maximumMonthlyInstallment?: number;
      installmentIncrements?: number;
      gracePeriodDays?: number;
    };
    interestRate: number;
    tenureMonths: number;
    compoundingFrequency: string;
  };
  sampleEMICosts: Array<{
    planType: string;
    principalAmount?: number;
    monthlyInstallment?: number;
    totalInvestment?: number;
    maturityAmount: number;
    totalInterest: number;
    monthlyInterest: number;
    emiCost?: {
      monthlyInstallment?: number;
      totalInstallments?: number;
      totalInvestment?: number;
      monthlyInterestEarned: number;
      totalReturn: number;
      oneTimeInvestment?: number;
    };
    costBreakdown?: {
      monthlyEMI?: number;
      totalEMIs?: number;
      totalPaid?: number;
      interest: number;
      maturity: number;
      investment?: number;
    };
  }>;
}

export interface InvestmentPlansResponse {
  plans: InvestmentPlan[];
}

export interface InvestmentMember {
  firstName: string;
  lastName: string;
  email: string;
  memberId: string;
}

export interface EMISchedule {
  emiNumber: number;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  penaltyAmount: number;
  remarks?: string;
  isOverdue: boolean;
}

export interface PaymentHistory {
  date: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  emiNumber: number;
  status: 'success' | 'failed' | 'pending';
  remarks?: string;
}

export interface EMIProgress {
  total: number;
  paid: number;
  pending: number;
  overdue: number;
}

export interface InvestmentApplication {
  applicationId: string;
  plan?: InvestmentPlan;
  member?: InvestmentMember;
  investmentAmount: number;
  monthlyEMI: number;
  paymentMethod: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'partial' | 'completed';
  totalAmountPaid: number;
  remainingAmount: number;
  emiProgress?: EMIProgress;
  applicationDate: string;
  approvalDate?: string;
  emiSchedule?: EMISchedule[];
  paymentHistory?: PaymentHistory[];
  documents?: any[];
  notes?: any[];
  termsAccepted: boolean;
  termsAcceptedDate: string;
}

export interface InvestmentApplicationsResponse {
  applications: InvestmentApplication[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalApplications: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface InvestmentApplicationData {
  planId: string;
  investmentAmount: number;
  monthlyEMI: number;
  paymentMethod: string;
  termsAccepted: boolean;
}

export interface InvestmentPaymentData {
  amount: number;
  paymentMethod: string;
  emiNumber: number;
  transactionId: string;
  remarks?: string;
}

export interface InvestmentPaymentResponse {
  applicationId: string;
  amount: number;
  paymentMethod: string;
  totalAmountPaid: number;
  remainingAmount: number;
  paymentStatus: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    console.log('Retrieved token from localStorage:', token);
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    console.log('API Response:', data);
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  }

  // Student API methods
  async studentSignup(data: StudentSignupData): Promise<ApiResponse<{ student: User; token: string }>> {
    const response = await fetch(`${API_BASE_URL}/student/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async studentLogin(data: LoginData): Promise<ApiResponse<{ student: User; token: string }>> {
    const response = await fetch(`${API_BASE_URL}/student/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async getStudentProfile(): Promise<ApiResponse<{ user: User; userType: string }>> {
    const response = await fetch(`${API_BASE_URL}/student/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async getStudentDashboard(): Promise<ApiResponse<{ student: User; stats: DashboardStats }>> {
    const response = await fetch(`${API_BASE_URL}/student/dashboard`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async getStudentSocieties(): Promise<ApiResponse<{ societies: any[] }>> {
    const response = await fetch(`${API_BASE_URL}/student/societies`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async studentLogout(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/student/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Society Member API methods
  async societyMemberSignup(data: SocietyMemberSignupData): Promise<ApiResponse<{ member: User; token: string }>> {
    const response = await fetch(`${API_BASE_URL}/society-member/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async societyMemberLogin(data: LoginData): Promise<ApiResponse<{ member: User; token: string }>> {
    const response = await fetch(`${API_BASE_URL}/society-member/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async getSocietyMemberProfile(): Promise<ApiResponse<{ user: User; userType: string }>> {
    const response = await fetch(`${API_BASE_URL}/society-member/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async getSocietyMemberDashboard(): Promise<ApiResponse<{ member: User; stats: DashboardStats }>> {
    const response = await fetch(`${API_BASE_URL}/society-member/dashboard`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async societyMemberLogout(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/society-member/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Utility methods
  setAuthToken(token: string): void {
    try {
      console.log('Setting auth token in localStorage:', token);
      
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token provided');
      }
      
      localStorage.setItem('authToken', token);
      
      // Verify the token was stored correctly
      const storedToken = localStorage.getItem('authToken');
      if (storedToken === token) {
        console.log('Token stored successfully. Current token:', storedToken);
      } else {
        throw new Error('Token storage verification failed');
      }
    } catch (error) {
      console.error('Error storing auth token:', error);
      throw error;
    }
  }

  removeAuthToken(): void {
    localStorage.removeItem('authToken');
  }

  getAuthToken(): string | null {
    const token = localStorage.getItem('authToken');
    console.log('Retrieved token from localStorage:', token ? 'Token exists' : 'No token found');
    return token;
  }

  isTokenValid(): boolean {
    const token = this.getAuthToken();
    return token !== null && token.length > 0;
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // KYC API methods
  async submitStudentKYC(formData: FormData): Promise<ApiResponse<{ kyc: KYCData }>> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/kyc/student/submit`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    return this.handleResponse(response);
  }

  async getStudentKYCStatus(): Promise<ApiResponse<KYCStatusResponse>> {
    const response = await fetch(`${API_BASE_URL}/kyc/student/status`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async submitSocietyMemberKYC(formData: FormData): Promise<ApiResponse<{ kyc: KYCData }>> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/kyc/society-member/submit`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    return this.handleResponse(response);
  }

  async getSocietyMemberKYCStatus(): Promise<ApiResponse<KYCStatusResponse>> {
    const response = await fetch(`${API_BASE_URL}/kyc/society-member/status`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Course API methods
  async getCourses(filters: CourseFilters = {}): Promise<ApiResponse<CourseListResponse>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${API_BASE_URL}/student/courses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async getCourseDetails(courseId: string): Promise<ApiResponse<CourseDetailResponse>> {
    const response = await fetch(`${API_BASE_URL}/student/courses/${courseId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async enrollInCourse(enrollmentData: EnrollCourseData): Promise<ApiResponse<CourseEnrollment>> {
    const response = await fetch(`${API_BASE_URL}/student/courses/enroll`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(enrollmentData),
    });

    return this.handleResponse(response);
  }

  async getMyCourses(): Promise<ApiResponse<CourseEnrollmentResponse>> {
    const response = await fetch(`${API_BASE_URL}/student/courses/my-courses`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async getMyCourseDetails(enrollmentId: string): Promise<ApiResponse<{ enrollment: CourseEnrollment }>> {
    const response = await fetch(`${API_BASE_URL}/student/courses/my-courses/${enrollmentId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Fee-related API methods
  async getMyFeeRequests(): Promise<ApiResponse<FeeRequestsResponse>> {
    const response = await fetch(`${API_BASE_URL}/student/fees/requests`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getMyPaymentHistory(): Promise<ApiResponse<PaymentHistoryResponse>> {
    const response = await fetch(`${API_BASE_URL}/student/fees/payments/history`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getMyPendingFees(): Promise<ApiResponse<PendingFeesResponse>> {
    const response = await fetch(`${API_BASE_URL}/student/fees/pending`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getMyFeeSummary(): Promise<ApiResponse<{ summary: FeeSummary }>> {
    const response = await fetch(`${API_BASE_URL}/student/fees/summary`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Attendance-related API methods
  async getMyAttendanceReport(filters: AttendanceFilters = {}): Promise<ApiResponse<AttendanceReportResponse>> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const url = `${API_BASE_URL}/student/attendance/report${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Student Profile API methods
  async getStudentProfileDetails(): Promise<ApiResponse<StudentProfileResponse>> {
    const response = await fetch(`${API_BASE_URL}/student/attendance/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Investment Application API methods
  async getInvestmentApplications(filters: InvestmentApplicationFilters = {}): Promise<ApiResponse<InvestmentApplicationsResponse>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${API_BASE_URL}/society-member/investment-applications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getInvestmentPlans(filters: InvestmentPlanFilters = {}): Promise<ApiResponse<InvestmentPlansResponse>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${API_BASE_URL}/society-member/investment-applications/plans${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getInvestmentApplicationDetails(applicationId: string): Promise<ApiResponse<{ application: InvestmentApplication }>> {
    const response = await fetch(`${API_BASE_URL}/society-member/investment-applications/${applicationId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async applyForInvestment(data: InvestmentApplicationData): Promise<ApiResponse<{ application: InvestmentApplication }>> {
    console.log('API Service - applyForInvestment data:', data);
    console.log('API Service - termsAccepted:', data.termsAccepted);
    
    const response = await fetch(`${API_BASE_URL}/society-member/investment-applications/apply`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async cancelInvestmentApplication(applicationId: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/society-member/investment-applications/${applicationId}/cancel`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async makeInvestmentPayment(applicationId: string, data: InvestmentPaymentData): Promise<ApiResponse<InvestmentPaymentResponse>> {
    const response = await fetch(`${API_BASE_URL}/society-member/investment-applications/${applicationId}/payment`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
