// API Service for handling HTTP requests
// const API_BASE_URL = 'http://localhost:3500/api';
const API_BASE_URL = 'https://api.padyai.co.in/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: string[];
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
  email?: string;
  password: string;
  studentId?: string;
  memberId?: string;
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

// Payment-related interfaces
export interface PaymentOrderRequest {
  investmentId: string;
  emiNumber?: number;
  amount: number;
  paymentMethod: 'upi' | 'net_banking' | 'credit_card' | 'debit_card' | 'wallet';
}

export interface PaymentOrderResponse {
  paymentId: string;
  transactionId: string;
  amount: number;
  paymentOrder: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    notes: {
      investmentId: string;
      memberId: string;
      emiNumber?: string;
      paymentFor: string;
    };
  };
  investmentDetails: {
    investmentId: string;
    planName: string;
    planType: string;
  };
}

export interface PaymentCallbackRequest {
  paymentId: string;
  transactionId: string;
  gatewayResponse: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    gatewayStatus: string;
  };
}

export interface PaymentCallbackResponse {
  paymentId: string;
  status: string;
  amount: number;
}

export interface CashPaymentRequest {
  investmentId: string;
  emiNumber?: number;
  amount: number;
  remarks?: string;
}

export interface CashPaymentResponse {
  paymentId: string;
  amount: number;
  paymentType: string;
  status: string;
  verificationStatus: string;
  investmentDetails: {
    investmentId: string;
    planName: string;
    planType: string;
  };
  nextSteps: string;
}

export interface PendingEMI {
  emiId: string;
  emiNumber: number;
  emiAmount: number;
  dueDate: string;
  status: string;
  paidAmount: number;
  penaltyAmount: number;
  totalPaidAmount: number;
  paidDate?: string;
  isOverdue: boolean;
  isInGracePeriod: boolean;
  remindersCount: number;
  paymentIds: string[];
  memberDetails: {
    name: string;
    memberId: string;
    email: string;
    phoneNumber: string;
  };
  investmentDetails: {
    investmentId: string;
    planName: string;
    planType: string;
  };
}

export interface PendingEMIsResponse {
  pendingEMIs: PendingEMI[];
  summary: {
    totalPendingEMIs: number;
    totalPendingAmount: number;
    totalPenaltyAmount: number;
    overdueEMIs: number;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPendingEMIs: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PendingEMIsByMonth {
  month: number;
  year: number;
  monthName: string;
  emiCount: number;
  totalAmount: number;
  totalPenalty: number;
  emis: PendingEMI[];
}

export interface PendingEMIsMonthlyResponse {
  pendingEMIsByMonth: PendingEMIsByMonth[];
  overallSummary: {
    totalPendingEMIs: number;
    totalPendingAmount: number;
    totalPenaltyAmount: number;
    monthsWithPendingEMIs: number;
  };
}

export interface PaymentOptionsResponse {
  emiDetails: {
    emiId: string;
    emiNumber: number;
    emiAmount: number;
    dueDate: string;
    status: string;
    penaltyAmount: number;
    totalPaidAmount: number;
  };
  paymentOptions: {
    cash: {
      available: boolean;
      amount: number;
      description: string;
      instructions: string;
    };
    online: {
      available: boolean;
      amount: number;
      description: string;
      supportedMethods: string[];
      instructions: string;
    };
  };
  memberDetails: {
    name: string;
    memberId: string;
    email: string;
  };
  investmentDetails: {
    investmentId: string;
    planName: string;
    planType: string;
  };
}

export interface PaymentHistoryEntry {
  paymentId: string;
  transactionId: string;
  amount: number;
  paymentType: string;
  paymentMethod: string;
  status: string;
  verificationStatus: string;
  paymentDate: string;
  paymentFor: string;
  emiNumber?: number;
  screenshots: number;
  remarks?: string;
}

export interface PaymentHistoryResponse {
  paymentHistory: PaymentHistoryEntry[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPayments: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaymentFilters {
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentType?: 'cash' | 'online' | 'cheque' | 'bank_transfer';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PendingEMIFilters {
  month?: number;
  year?: number;
  investmentId?: string;
  page?: number;
  limit?: number;
}

// Loan Request interfaces
export interface LoanRequestData {
  loanAmount: number;
  loanPurpose: string;
  loanDescription: string;
  tenureMonths: number;
  emiAmount: number;
  interestRate: number;
}

export interface LoanRequest {
  requestId: string;
  loanAmount: number;
  loanPurpose: string;
  loanDescription?: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'completed';
  emiOptions: {
    tenureMonths: number;
    emiAmount: number;
    interestRate: number;
  };
  documents?: LoanDocument[];
  createdAt: string;
  updatedAt?: string;
  approvedAt?: string;
  disbursedAt?: string;
  completedAt?: string;
  rejectionReason?: string;
  approvedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface LoanDocument {
  documentType: 'identity_proof' | 'address_proof' | 'income_proof' | 'bank_statement' | 'other';
  documentName: string;
  documentUrl: string;
  uploadedAt: string;
}

export interface LoanRequestResponse {
  requestId: string;
  loanAmount: number;
  loanPurpose: string;
  status: string;
  createdAt: string;
}

export interface LoanRequestsResponse {
  loanRequests: LoanRequest[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRequests: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface LoanRequestDetailsResponse {
  requestId: string;
  loanAmount: number;
  loanPurpose: string;
  loanDescription: string;
  status: string;
  emiOptions: {
    tenureMonths: number;
    emiAmount: number;
    interestRate: number;
  };
  documents: LoanDocument[];
  createdAt: string;
  updatedAt?: string;
  approvedAt?: string;
  disbursedAt?: string;
  completedAt?: string;
  rejectionReason?: string;
  approvedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface LoanDocumentUploadResponse {
  documentType: string;
  documentName: string;
  documentUrl: string;
}

export interface LoanRequestUpdateData {
  loanAmount?: number;
  loanDescription?: string;
  emiAmount?: number;
  tenureMonths?: number;
  interestRate?: number;
}

export interface LoanRequestFilters {
  status?: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'completed';
  page?: number;
  limit?: number;
}

// CD Investment interfaces
export interface CDInvestmentRequest {
  investmentAmount: number;
  tenureMonths: number;
  purpose: string;
  notes?: string;
}

export interface CDInvestment {
  _id: string;
  cdId: string;
  investmentAmount: number;
  tenureMonths: number;
  interestRate: number;
  maturityAmount: number;
  totalInterest: number;
  status: 'pending' | 'active' | 'matured' | 'cancelled';
  isMatured?: boolean;
  remainingTenure?: number;
  userDisplayName?: string;
  requestDate: string;
  approvalDate?: string;
  maturityDate?: string;
}

export interface CDInvestmentResponse {
  cdInvestment: CDInvestment;
}

export interface CDInvestmentsListResponse {
  investments: CDInvestment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  summary: {
    active: {
      count: number;
      totalAmount: number;
    };
    pending: {
      count: number;
      totalAmount: number;
    };
  };
}

export interface CDInvestmentDetailsResponse {
  investment: CDInvestment;
}

export interface CDInvestmentFilters {
  status?: 'pending' | 'active' | 'matured' | 'cancelled';
  page?: number;
  limit?: number;
}

// Comprehensive Dashboard interfaces
export interface DashboardMember {
  name: string;
  memberId: string;
  email: string;
  phoneNumber: string;
  societyName: string;
  position: string;
  isActive: boolean;
  isVerified: boolean;
  kycStatus: string;
  lastLogin: string;
}

export interface UpcomingEMI {
  emiId: string;
  emiNumber: number;
  emiAmount: number;
  dueDate: string;
  gracePeriodEndDate: string;
  penaltyAmount: number;
  status: string;
  isOverdue: boolean;
  daysUntilDue: number;
  type: string;
  loanRequestId?: string;
  loanPurpose?: string;
  investmentId?: string;
  planName?: string;
}

export interface LoanSummary {
  requestId: string;
  loanAmount: number;
  disbursedAmount: number;
  loanPurpose: string;
  status: string;
  createdAt: string;
  disbursedAt?: string;
  emiCount: number;
  paidEMIs: number;
  pendingEMIs: number;
  overdueEMIs: number;
}

export interface MyLoansData {
  totalLoans: number;
  totalLoanAmount: number;
  totalDisbursedAmount: number;
  statusBreakdown: {
    pending: number;
    approved: number;
    disbursed: number;
    completed: number;
    rejected: number;
  };
  recentLoans: LoanSummary[];
}

export interface InvestmentSummary {
  investmentId: string;
  principalAmount: number;
  monthlyInstallment: number;
  expectedMaturityAmount: number;
  investmentDate: string;
  maturityDate: string;
  status: string;
  planName: string;
  planType: string;
  interestRate: number;
}

export interface MyInvestmentsData {
  totalInvestments: number;
  totalInvestmentAmount: number;
  totalMaturityAmount: number;
  statusBreakdown: {
    active: number;
    completed: number;
    paused: number;
  };
  recentInvestments: InvestmentSummary[];
}

export interface RecentPayment {
  paymentId: string;
  amount: number;
  paymentType: string;
  paymentMethod: string;
  status: string;
  verificationStatus: string;
  paymentDate: string;
  emiNumber: number;
  remarks: string;
}

export interface DashboardStats {
  emiStats: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
    paymentRate: number;
  };
  paymentStats: {
    total: number;
    successful: number;
    pending: number;
    successRate: number;
  };
  amountStats: {
    totalPaid: number;
    totalPending: number;
  };
}

export interface DashboardNotification {
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  actionRequired: boolean;
  emiId?: string;
  amount?: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  available: boolean;
}

export interface ComprehensiveDashboardData {
  member: DashboardMember;
  upcomingEMIs: UpcomingEMI[];
  myLoans: MyLoansData;
  myInvestments: MyInvestmentsData;
  recentPayments: RecentPayment[];
  dashboardStats: DashboardStats;
  notifications: DashboardNotification[];
  quickActions: QuickAction[];
}

// Comprehensive Profile interfaces
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  memberId: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContact: string;
  emergencyPhone: string;
  profilePicture: string;
}

export interface SocietyInfo {
  societyName: string;
  societyCode: string;
  position: string;
  joiningDate: string;
  membershipType: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface KYCDocument {
  documentType: string;
  documentName: string;
  documentUrl: string;
  uploadedAt: string;
}

export interface KYCInfo {
  kycStatus: string;
  submittedAt: string;
  verifiedAt: string;
  kycDocuments: KYCDocument[];
  remarks: string;
}

export interface AccountSummary {
  loans: {
    totalLoans: number;
    totalLoanAmount: number;
    totalDisbursedAmount: number;
    pendingLoans: number;
    approvedLoans: number;
    disbursedLoans: number;
  };
  investments: {
    totalInvestments: number;
    totalInvestmentAmount: number;
    totalMaturityAmount: number;
    activeInvestments: number;
    completedInvestments: number;
  };
  emis: {
    totalEMIs: number;
    paidEMIs: number;
    pendingEMIs: number;
    overdueEMIs: number;
    totalEMIAmount: number;
    totalPaidAmount: number;
    totalPendingAmount: number;
    paymentRate: number;
  };
  payments: {
    totalPayments: number;
    successfulPayments: number;
    pendingPayments: number;
    totalPaidAmount: number;
    successRate: number;
  };
}

export interface RecentActivity {
  type: string;
  title: string;
  description: string;
  status: string;
  date: string;
  referenceId: string;
}

export interface ProfileCompleteness {
  percentage: number;
  completedFields: number;
  totalFields: number;
  missingFields: string[];
}

export interface MemberStatus {
  isActive: boolean;
  isVerified: boolean;
  kycStatus: string;
  hasProfilePicture: boolean;
  hasCompleteProfile: boolean;
  canApplyForLoan: boolean;
  canMakeInvestments: boolean;
  canMakePayments: boolean;
  overallStatus: string;
  statusMessage: string;
}

export interface ComprehensiveProfileData {
  personalInfo: PersonalInfo;
  societyInfo: SocietyInfo;
  kycInfo: KYCInfo;
  accountSummary: AccountSummary;
  recentActivity: RecentActivity[];
  profileCompleteness: ProfileCompleteness;
  memberStatus: MemberStatus;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

// Gallery/Thumbnails interfaces
export interface Thumbnail {
  _id: string;
  title: string;
  description: string;
  originalImageUrl: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  displayOrder: number;
  isFeatured: boolean;
  createdAt: string;
  thumbnailId: string;
}

export interface ThumbnailsPagination {
  currentPage: number;
  totalPages: number;
  totalThumbnails: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ThumbnailsResponse {
  thumbnails: Thumbnail[];
  pagination: ThumbnailsPagination;
}

// Marksheet interfaces
export interface Marksheet {
  marksheetNumber: string;
  studentId: string;
  courseId: string;
  batchId: string;
  academicYear: string;
  semester: string;
  examinationType: string;
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  cgpa: number;
  overallGrade: string;
  result: 'PASS' | 'FAIL';
  status: 'published' | 'draft' | 'pending';
  isVerified: boolean;
  verificationCode: string;
  course: {
    title: string;
    category: string;
  };
  batch: {
    name: string;
    startDate: string;
  };
}

export interface MarksheetFilters {
  page?: number;
  limit?: number;
  academicYear?: string;
  semester?: string;
  examinationType?: string;
  result?: 'PASS' | 'FAIL';
}

export interface MarksheetPagination {
  currentPage: number;
  totalPages: number;
  totalMarksheets: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface MarksheetListResponse {
  marksheets: Marksheet[];
  pagination: MarksheetPagination;
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
    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      // Create a custom error that preserves the full API response
      const error = new Error(data.message || `HTTP error! status: ${response.status}`);
      (error as any).apiResponse = data; // Attach the full API response to the error
      (error as any).status = response.status; // Attach status code
      throw error;
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

  // Marksheet API methods
  async getMarksheets(filters: MarksheetFilters = {}): Promise<ApiResponse<MarksheetListResponse>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${API_BASE_URL}/student/documents/marksheets${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Payment API methods for Society Members
  async generatePaymentOrder(data: PaymentOrderRequest): Promise<ApiResponse<PaymentOrderResponse>> {
    const response = await fetch(`${API_BASE_URL}/society-member-payments/generate-order`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async processPaymentCallback(data: PaymentCallbackRequest): Promise<ApiResponse<PaymentCallbackResponse>> {
    const response = await fetch(`${API_BASE_URL}/society-member-payments/callback`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async createCashPaymentRequest(data: CashPaymentRequest): Promise<ApiResponse<CashPaymentResponse>> {
    const response = await fetch(`${API_BASE_URL}/society-member-payments/cash-payment`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getPendingEMIs(filters: PendingEMIFilters = {}): Promise<ApiResponse<PendingEMIsResponse>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${API_BASE_URL}/society-member-payments/pending-emis${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getPendingEMIsByMonth(investmentId?: string): Promise<ApiResponse<PendingEMIsMonthlyResponse>> {
    const queryParams = new URLSearchParams();
    
    if (investmentId) {
      queryParams.append('investmentId', investmentId);
    }

    const url = `${API_BASE_URL}/society-member-payments/pending-emis/monthly${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getPaymentOptions(emiId: string): Promise<ApiResponse<PaymentOptionsResponse>> {
    const response = await fetch(`${API_BASE_URL}/society-member-payments/payment-options/${emiId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async uploadPaymentScreenshot(paymentId: string, formData: FormData): Promise<ApiResponse<{ paymentId: string; screenshotUrl: string; screenshotType: string }>> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/society-member-payments/${paymentId}/screenshot`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    return this.handleResponse(response);
  }

  async getPaymentHistory(filters: PaymentFilters = {}): Promise<ApiResponse<PaymentHistoryResponse>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${API_BASE_URL}/society-member-payments/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Additional payment API methods
  async getPaymentDetails(paymentId: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/society-member-payments/${paymentId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getEMIDetailsForInvestment(investmentId: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/society-member-payments/emi/${investmentId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getInvestmentPaymentSummary(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/society-member-payments/summary/investments`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Loan Request API methods for Society Members
  async createLoanRequest(data: LoanRequestData): Promise<ApiResponse<LoanRequestResponse>> {
    const response = await fetch(`${API_BASE_URL}/loan-requests`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getLoanRequests(filters: LoanRequestFilters = {}): Promise<ApiResponse<LoanRequestsResponse>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${API_BASE_URL}/loan-requests${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getLoanRequestDetails(requestId: string): Promise<ApiResponse<LoanRequestDetailsResponse>> {
    const response = await fetch(`${API_BASE_URL}/loan-requests/${requestId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async uploadLoanDocument(
    requestId: string, 
    formData: FormData
  ): Promise<ApiResponse<LoanDocumentUploadResponse>> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/loan-requests/${requestId}/documents`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    return this.handleResponse(response);
  }

  async updateLoanRequest(
    requestId: string, 
    data: LoanRequestUpdateData
  ): Promise<ApiResponse<LoanRequestResponse>> {
    const response = await fetch(`${API_BASE_URL}/loan-requests/${requestId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async cancelLoanRequest(requestId: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/loan-requests/${requestId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Comprehensive Dashboard API methods
  async getComprehensiveDashboard(): Promise<ApiResponse<ComprehensiveDashboardData>> {
    const response = await fetch(`${API_BASE_URL}/society-member/dashboard`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getUpcomingEMIs(): Promise<ApiResponse<UpcomingEMI[]>> {
    const response = await fetch(`${API_BASE_URL}/society-member/dashboard/upcoming-emis`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getMyLoansSummary(): Promise<ApiResponse<MyLoansData>> {
    const response = await fetch(`${API_BASE_URL}/society-member/dashboard/my-loans`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getMyInvestmentsSummary(): Promise<ApiResponse<MyInvestmentsData>> {
    const response = await fetch(`${API_BASE_URL}/society-member/dashboard/my-investments`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Comprehensive Profile API method
  async getComprehensiveProfile(): Promise<ApiResponse<ComprehensiveProfileData>> {
    const response = await fetch(`${API_BASE_URL}/society-member/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Gallery/Thumbnails API method
  async getThumbnails(page: number = 1, limit: number = 10): Promise<ApiResponse<ThumbnailsResponse>> {
    const response = await fetch(`${API_BASE_URL}/thumbnails?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Public Gallery/Thumbnails API method (no authentication required)
  async getPublicThumbnails(page: number = 1, limit: number = 10): Promise<ApiResponse<ThumbnailsResponse>> {
    const response = await fetch(`${API_BASE_URL}/thumbnails?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse(response);
  }

  // CD Investment API methods
  async requestCDInvestment(data: CDInvestmentRequest): Promise<ApiResponse<CDInvestmentResponse>> {
    const response = await fetch(`${API_BASE_URL}/cd-investment/request`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getMyCDInvestments(filters: CDInvestmentFilters = {}): Promise<ApiResponse<CDInvestmentsListResponse>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${API_BASE_URL}/cd-investment/my-investments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getCDInvestmentDetails(cdId: string): Promise<ApiResponse<CDInvestmentDetailsResponse>> {
    const response = await fetch(`${API_BASE_URL}/cd-investment/${cdId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
