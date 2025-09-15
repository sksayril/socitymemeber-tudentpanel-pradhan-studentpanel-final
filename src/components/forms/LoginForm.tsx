import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface LoginFormProps {
  userType: 'student' | 'society';
  onSubmit: (email: string, password: string) => Promise<void>;
  onBack: () => void;
  onSwitchToSignup: () => void;
  isLoading: boolean;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({
  userType,
  onSubmit,
  onBack,
  onSwitchToSignup,
  isLoading,
  error,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData.email, formData.password);
  };

  const isFormValid = () => {
    return formData.email && formData.password;
  };

  const userTypeLabel = userType === 'student' ? 'Student' : 'Society Member';
  const userTypeColor = userType === 'student' ? 'blue' : 'purple';
  const gradientFrom = userType === 'student' ? 'from-blue-500' : 'from-purple-500';
  const gradientTo = userType === 'student' ? 'to-indigo-600' : 'to-pink-600';
  const hoverFrom = userType === 'student' ? 'hover:from-blue-600' : 'hover:from-purple-600';
  const hoverTo = userType === 'student' ? 'hover:to-indigo-700' : 'hover:to-pink-700';
  const focusRing = userType === 'student' ? 'focus:ring-blue-500' : 'focus:ring-purple-500';

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className={`w-16 h-16 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{userTypeLabel} Login</h2>
        <p className="text-gray-600">Sign in to your {userTypeLabel.toLowerCase()} account</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ${focusRing} focus:border-transparent`}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Lock className="w-4 h-4 inline mr-2" />
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 ${focusRing} focus:border-transparent`}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot password?
            </a>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className={`flex-1 px-6 py-3 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white rounded-lg ${hoverFrom} ${hoverTo} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Create one here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
