import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Building2, Phone, Calendar, MapPin, Award, Users, Camera } from 'lucide-react';
import FileUpload from '../FileUpload';

interface SocietyMemberSignupFormProps {
  onSubmit: (data: any, profilePicture?: File) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
}

const SocietyMemberSignupForm: React.FC<SocietyMemberSignupFormProps> = ({
  onSubmit,
  onBack,
  isLoading,
  error,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    societyName: '',
    position: '',
    department: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
    },
    skills: [] as string[],
    responsibilities: [] as string[],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [skillsInput, setSkillsInput] = useState('');
  const [responsibilitiesInput, setResponsibilitiesInput] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'phoneNumber':
        // Basic phone number validation - should be 10 digits
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value.replace(/\D/g, ''))) {
          return 'Please provide a valid 10-digit phone number';
        }
        return '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return 'Please provide a valid email address';
        }
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Validate field
    const error = validateField(name, value);
    if (error) {
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillsInput(e.target.value);
  };

  const addSkill = () => {
    if (skillsInput.trim() && !formData.skills.includes(skillsInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillsInput.trim()],
      }));
      setSkillsInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const handleResponsibilitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResponsibilitiesInput(e.target.value);
  };

  const addResponsibility = () => {
    if (responsibilitiesInput.trim() && !formData.responsibilities.includes(responsibilitiesInput.trim())) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, responsibilitiesInput.trim()],
      }));
      setResponsibilitiesInput('');
    }
  };

  const removeResponsibility = (responsibility: string) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter(r => r !== responsibility),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    // Clear any existing field errors before submission
    setFieldErrors({});

    const { confirmPassword, ...submitData } = formData;
    await onSubmit(submitData, profilePicture || undefined);
  };

  const isFormValid = () => {
    return (
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.firstName &&
      formData.lastName &&
      formData.societyName &&
      formData.position &&
      formData.department &&
      formData.phoneNumber &&
      formData.dateOfBirth &&
      formData.address.street &&
      formData.address.city &&
      formData.address.state &&
      formData.address.zipCode &&
      formData.password === formData.confirmPassword &&
      Object.keys(fieldErrors).length === 0
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Society Member Registration</h2>
        <p className="text-gray-600">Create your society member account to get started</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Validation Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
            required
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p className="text-red-600 text-sm">Passwords do not match</p>
        )}

        {/* Society Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4 inline mr-2" />
              Society Name *
            </label>
            <input
              type="text"
              name="societyName"
              value={formData.societyName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Award className="w-4 h-4 inline mr-2" />
              Position *
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select Position</option>
              <option value="President">President</option>
              <option value="Vice President">Vice President</option>
              <option value="Secretary">Secretary</option>
              <option value="Treasurer">Treasurer</option>
              <option value="Event Coordinator">Event Coordinator</option>
              <option value="Member">Member</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department *
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Engineering">Engineering</option>
            <option value="Business">Business</option>
            <option value="Medicine">Medicine</option>
            <option value="Arts">Arts</option>
            <option value="Science">Science</option>
          </select>
        </div>

        {/* Contact Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                fieldErrors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter 10-digit phone number"
              required
            />
            {fieldErrors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.phoneNumber}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date of Birth *
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Address Information
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Award className="w-4 h-4 inline mr-2" />
            Skills (Optional)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillsInput}
              onChange={handleSkillsChange}
              placeholder="Add a skill"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Add
            </button>
          </div>
          {formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Responsibilities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-2" />
            Responsibilities (Optional)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={responsibilitiesInput}
              onChange={handleResponsibilitiesChange}
              placeholder="Add a responsibility"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addResponsibility}
              className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Add
            </button>
          </div>
          {formData.responsibilities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.responsibilities.map((responsibility, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {responsibility}
                  <button
                    type="button"
                    onClick={() => removeResponsibility(responsibility)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Profile Picture Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Camera className="w-4 h-4 inline mr-2" />
            Profile Picture (Optional)
          </label>
          <FileUpload
            onFileSelect={setProfilePicture}
            accept="image/jpeg,image/jpg,image/png,image/gif"
            maxSize={5}
            label=""
            required={false}
          />
          {profilePicture && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    File selected: {profilePicture.name}
                  </p>
                  <p className="text-sm text-green-700">
                    Size: {(profilePicture.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Login
          </button>
          <button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocietyMemberSignupForm;
