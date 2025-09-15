import React, { useState } from 'react';
import { Shield, Upload, AlertCircle } from 'lucide-react';
import FileUpload from '../FileUpload';

interface StudentKYCFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
}

const StudentKYCForm: React.FC<StudentKYCFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  error,
}) => {
  const [formData, setFormData] = useState({
    aadharNumber: '',
  });
  const [aadharCardImage, setAadharCardImage] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const validateAadharNumber = (aadhar: string) => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: {[key: string]: string} = {};

    // Validate Aadhar number
    if (!formData.aadharNumber) {
      errors.aadharNumber = 'Aadhar number is required';
    } else if (!validateAadharNumber(formData.aadharNumber)) {
      errors.aadharNumber = 'Aadhar number must be exactly 12 digits';
    }

    // Validate Aadhar card image
    if (!aadharCardImage) {
      errors.aadharCardImage = 'Aadhar card image is required';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append('aadharNumber', formData.aadharNumber);
    if (aadharCardImage) {
      submitData.append('aadharCardImage', aadharCardImage);
    }

    await onSubmit(submitData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">KYC Verification</h2>
        <p className="text-gray-600">Complete your identity verification to access all features</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Aadhar Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aadhar Number *
          </label>
          <input
            type="text"
            name="aadharNumber"
            value={formData.aadharNumber}
            onChange={handleInputChange}
            placeholder="Enter 12-digit Aadhar number"
            maxLength={12}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              validationErrors.aadharNumber ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {validationErrors.aadharNumber && (
            <p className="mt-2 text-sm text-red-600">{validationErrors.aadharNumber}</p>
          )}
        </div>

        {/* Aadhar Card Image Upload */}
        <FileUpload
          onFileSelect={setAadharCardImage}
          accept="image/*"
          maxSize={5}
          label="Aadhar Card Image"
          required
          error={validationErrors.aadharCardImage}
        />

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Important Information</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Ensure the Aadhar card image is clear and readable</li>
            <li>• File size should not exceed 5MB</li>
            <li>• Accepted formats: JPG, PNG, PDF</li>
            <li>• Verification may take 1-2 business days</li>
          </ul>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? 'Submitting...' : 'Submit KYC'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentKYCForm;
