// Token utility functions for debugging and testing

export const checkTokenStatus = () => {
  const token = localStorage.getItem('authToken');
  const userType = localStorage.getItem('userType');
  
  console.log('=== Token Status Check ===');
  console.log('Token exists:', !!token);
  console.log('Token value:', token);
  console.log('User type:', userType);
  console.log('========================');
  
  return {
    hasToken: !!token,
    token,
    userType,
  };
};

export const clearAllAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userType');
  console.log('All auth data cleared from localStorage');
};

export const simulateTokenStorage = (token: string, userType: string) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('userType', userType);
  console.log('Simulated token storage:', { token, userType });
};
