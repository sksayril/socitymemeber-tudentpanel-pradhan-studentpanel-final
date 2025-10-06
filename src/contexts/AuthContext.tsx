import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { apiService, User, KYCStatusResponse } from '../services/api';

interface AuthContextType {
  user: User | null;
  userType: 'student' | 'society' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  kycStatus: KYCStatusResponse | null;
  isKYCVerified: boolean;
  login: (email: string, password: string, id: string, loginMethod: 'email' | 'id', type: 'student' | 'society') => Promise<void>;
  signup: (data: any, type: 'student' | 'society', profilePicture?: File) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshKYCStatus: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'student' | 'society' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState<KYCStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!userType;
  const isKYCVerified = kycStatus?.kycStatus === 'approved';
  
  // Debug logging for KYC status
  console.log('AuthContext KYC Status:', {
    kycStatus,
    isKYCVerified,
    isAuthenticated,
    userType
  });

  const clearError = () => setError(null);

  const login = async (email: string, password: string, id: string, loginMethod: 'email' | 'id', type: 'student' | 'society') => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      if (type === 'student') {
        if (loginMethod === 'email') {
          response = await apiService.studentLogin({ email, password });
        } else {
          response = await apiService.studentLogin({ studentId: id, password });
        }
        if (response.data?.student) {
          setUser(response.data.student);
        }
        if (response.data?.token) {
          console.log('Storing student token:', response.data.token);
          apiService.setAuthToken(response.data.token);
          
          // Verify token was stored correctly
          if (apiService.isTokenValid()) {
            console.log('Token verification successful');
            setUserType(type);
            // Fetch KYC status after successful login
            await refreshKYCStatus();
            console.log('Student login successful - token stored and KYC status refreshed');
          } else {
            throw new Error('Token storage verification failed');
          }
        } else {
          console.error('No token received in student login response:', response);
          throw new Error('No authentication token received from server');
        }
        toast.success('Welcome back! Login successful.');
      } else {
        if (loginMethod === 'email') {
          response = await apiService.societyMemberLogin({ email, password });
        } else {
          response = await apiService.societyMemberLogin({ memberId: id, password });
        }
        console.log('Society member login response:', response);
        
        if (response.data?.member) {
          setUser(response.data.member);
          console.log('Society member user set:', response.data.member);
        }
        
        if (response.data?.token) {
          console.log('Storing society member token:', response.data.token);
          apiService.setAuthToken(response.data.token);
          
          // Verify token was stored correctly
          if (apiService.isTokenValid()) {
            console.log('Token verification successful');
            setUserType(type);
            // Fetch KYC status after successful login
            await refreshKYCStatus();
            console.log('Society member login successful - token stored and KYC status refreshed');
          } else {
            throw new Error('Token storage verification failed');
          }
        } else {
          console.error('No token received in society member login response:', response);
          throw new Error('No authentication token received from server');
        }
        toast.success('Welcome back! Login successful.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: any, type: 'student' | 'society', profilePicture?: File) => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      if (type === 'student') {
        response = await apiService.studentSignup(data, profilePicture);
        if (response.data?.student) {
          setUser(response.data.student);
        }
        if (response.data?.token) {
          console.log('Storing student signup token:', response.data.token);
          apiService.setAuthToken(response.data.token);
          
          // Verify token was stored correctly
          if (apiService.isTokenValid()) {
            console.log('Token verification successful');
            setUserType(type);
            // Set initial KYC status as not submitted for new users
            setKycStatus({ kycStatus: 'not_submitted' });
            console.log('Student signup successful - token stored and user type set');
          } else {
            throw new Error('Token storage verification failed');
          }
        } else {
          console.error('No token received in student signup response:', response);
          throw new Error('No authentication token received from server');
        }
        toast.success('Account created successfully! Welcome to EduPortal.');
      } else {
        response = await apiService.societyMemberSignup(data, profilePicture);
        console.log('Society member signup response:', response);
        
        if (response.data?.member) {
          setUser(response.data.member);
          console.log('Society member user set:', response.data.member);
        }
        
        if (response.data?.token) {
          console.log('Storing society member signup token:', response.data.token);
          apiService.setAuthToken(response.data.token);
          
          // Verify token was stored correctly
          if (apiService.isTokenValid()) {
            console.log('Token verification successful');
            setUserType(type);
            // Set initial KYC status as not submitted for new users
            setKycStatus({ kycStatus: 'not_submitted' });
            console.log('Society member signup successful - token stored and user type set');
          } else {
            throw new Error('Token storage verification failed');
          }
        } else {
          console.error('No token received in society member signup response:', response);
          throw new Error('No authentication token received from server');
        }
        toast.success('Account created successfully! Welcome to EduPortal.');
      }
    } catch (err) {
      let errorMessage = 'Signup failed';
      let validationErrors: string[] = [];
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Check if the error contains API response with validation errors
        if ((err as any).apiResponse?.errors && Array.isArray((err as any).apiResponse.errors)) {
          validationErrors = (err as any).apiResponse.errors;
          
          // Show each validation error as a separate toast
          validationErrors.forEach((validationError: string) => {
            toast.error(validationError);
          });
          
          // Set the first validation error as the main error message
          if (validationErrors.length > 0) {
            errorMessage = validationErrors[0];
          }
        } else {
          // Show the general error message
          toast.error(errorMessage);
        }
      } else {
        toast.error(errorMessage);
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (userType === 'student') {
        await apiService.studentLogout();
      } else if (userType === 'society') {
        await apiService.societyMemberLogout();
      }
      toast.success('Logged out successfully. See you soon!');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Logout failed. Please try again.');
    } finally {
      apiService.removeAuthToken();
      setUser(null);
      setUserType(null);
      setKycStatus(null);
      setError(null);
    }
  };

  const refreshUser = async () => {
    if (!apiService.isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      let response;
      
      if (userType === 'student') {
        response = await apiService.getStudentProfile();
      } else if (userType === 'society') {
        response = await apiService.getSocietyMemberProfile();
      }

      if (response?.data?.user) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
      // If token is invalid, logout user
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshKYCStatus = async () => {
    if (!apiService.isAuthenticated() || !userType) {
      return;
    }

    try {
      let response;
      if (userType === 'student') {
        // Try the new profile API first for students
        try {
          const profileResponse = await apiService.getStudentProfileDetails();
          if (profileResponse.data?.kyc) {
            // Convert new profile KYC format to old KYC status format
            const kycData = {
              kycStatus: profileResponse.data.kyc.status,
              kyc: {
                id: profileResponse.data.kyc.id,
                aadharNumber: profileResponse.data.kyc.documents.aadharNumber || '',
                status: profileResponse.data.kyc.status,
                submittedAt: profileResponse.data.kyc.submittedAt,
                reviewedAt: profileResponse.data.kyc.reviewedAt,
                rejectionReason: profileResponse.data.kyc.rejectionReason
              }
            };
            setKycStatus(kycData);
            return;
          }
        } catch (profileErr) {
          console.log('Profile API not available, falling back to KYC status API');
        }
        
        // Fallback to old KYC status API
        response = await apiService.getStudentKYCStatus();
      } else {
        response = await apiService.getSocietyMemberKYCStatus();
      }

      if (response.data) {
        setKycStatus(response.data);
      }
    } catch (err) {
      console.error('Failed to refresh KYC status:', err);
      // Don't throw error here to avoid infinite loops
    }
  };

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = apiService.getAuthToken();
      if (token) {
        // Try to determine user type from token or stored data
        const storedUserType = localStorage.getItem('userType') as 'student' | 'society' | null;
        if (storedUserType) {
          setUserType(storedUserType);
          await refreshUser();
        } else {
          // If no stored user type, clear token
          apiService.removeAuthToken();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Store user type when it changes
  useEffect(() => {
    if (userType) {
      localStorage.setItem('userType', userType);
    } else {
      localStorage.removeItem('userType');
    }
  }, [userType]);

  const value: AuthContextType = {
    user,
    userType,
    isAuthenticated,
    isLoading,
    kycStatus,
    isKYCVerified,
    login,
    signup,
    logout,
    refreshUser,
    refreshKYCStatus,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
