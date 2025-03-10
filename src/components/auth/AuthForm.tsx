import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, UserRole } from '../../stores/authStore';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Calendar, Phone, UserCircle } from 'lucide-react';

type AuthMode = 'signin' | 'signup';

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  role?: UserRole;
}

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuthStore();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    role: 'patient'
  });

  const validateField = (name: string, value: string) => {
    if (!value) {
      switch (name) {
        case 'gender':
          return 'Please select your gender';
        case 'dateOfBirth':
          return 'Please enter your date of birth';
        case 'phoneNumber':
          return 'Please enter your phone number';
        default:
          return 'This field is required';
      }
    }
    
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'phoneNumber':
        if (value.length < 11) {
          return 'Phone number must be at least 11 digits';
        }
        const phoneRegex = /^01[0125][0-9]{8}$/;
        if (!phoneRegex.test(value)) {
          return 'Please enter a valid Egyptian phone number (e.g., 01XXXXXXXXX)';
        }
        break;
      case 'password':
        if (value.length < 6) {
          return 'Password must be at least 6 characters';
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          return 'Passwords do not match';
        }
        break;
      case 'dateOfBirth':
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (birthDate > today) {
          return 'Date of birth cannot be in the future';
        }
        
        if (age > 100 || (age === 100 && monthDiff > 0)) {
          return 'Please enter a valid date of birth';
        }
        
        if (age < 18 || (age === 18 && monthDiff < 0)) {
          return 'You must be at least 18 years old';
        }
        break;
    }
    return '';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, formData[name as keyof FormData] as string);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      if (touched[name]) {
        const error = validateField(name, value);
        if (error) {
          setErrors(prev => ({ ...prev, [name]: error }));
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
        }
      }
      
      // Additional validation for confirm password
      if (name === 'password' && touched.confirmPassword) {
        const confirmError = validateField('confirmPassword', newData.confirmPassword || '');
        if (confirmError) {
          setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.confirmPassword;
            return newErrors;
          });
        }
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (mode === 'signup') {
      if (!formData.confirmPassword || !formData.fullName || !formData.dateOfBirth || 
          !formData.gender || !formData.phoneNumber || !formData.role) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      const phoneRegex = /^\+?[\d\s-]{8,}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        toast.error('Please enter a valid phone number');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        await signUp({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName || '',
          dateOfBirth: formData.dateOfBirth || '',
          gender: formData.gender || '',
          phoneNumber: formData.phoneNumber || '',
          role: formData.role || 'patient'
        });
        toast.success('Account created successfully!');
      } else {
        await signIn(formData.email, formData.password);
        toast.success('Welcome back!');
      }

      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update the input fields to include error handling
  const renderInput = (
    name: keyof FormData,
    label: string,
    type: string,
    icon: React.ReactNode,
    placeholder: string = `Enter your ${label.toLowerCase()}`
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <div className="flex items-center gap-2">
          {icon}
          {label}
          <span className="text-red-500">*</span>
        </div>
      </label>
      <input
        type={type}
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
          errors[name] && touched[name]
            ? 'border-red-300 focus:border-red-500'
            : 'border-gray-300 focus:border-blue-500'
        }`}
        placeholder={placeholder}
      />
      {errors[name] && touched[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  const renderSelect = (
    name: keyof FormData,
    label: string,
    icon: React.ReactNode,
    options: { value: string; label: string }[]
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <div className="flex items-center gap-2">
          {icon}
          {label}
          <span className="text-red-500">*</span>
        </div>
      </label>
      <select
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
          errors[name] && touched[name]
            ? 'border-red-300 focus:border-red-500'
            : 'border-gray-300 focus:border-blue-500'
        }`}
      >
        <option value="">{`Select ${label.toLowerCase()}`}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && touched[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <UserCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setErrors({});
                setTouched({});
              }}
              className="ml-1 text-blue-600 hover:text-blue-500 font-medium"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderInput('email', 'Email', 'email', <Mail className="w-4 h-4 text-gray-500" />)}
          {renderInput('password', 'Password', 'password', <Lock className="w-4 h-4 text-gray-500" />)}

          {mode === 'signup' && (
            <>
              {renderInput('confirmPassword', 'Confirm Password', 'password', <Lock className="w-4 h-4 text-gray-500" />)}
              {renderSelect('role', 'I am a', <User className="w-4 h-4 text-gray-500" />, [
                { value: 'patient', label: 'Patient' },
                { value: 'doctor', label: 'Doctor' }
              ])}
              {renderInput('fullName', 'Full Name', 'text', <User className="w-4 h-4 text-gray-500" />)}
              {renderInput('dateOfBirth', 'Date of Birth', 'date', <Calendar className="w-4 h-4 text-gray-500" />)}
              {renderSelect('gender', 'Gender', <User className="w-4 h-4 text-gray-500" />, [
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' }
              ])}
              {renderInput('phoneNumber', 'Phone Number', 'tel', <Phone className="w-4 h-4 text-gray-500" />)}
            </>
          )}

          <button
            type="submit"
            disabled={loading || (mode === 'signup' && Object.keys(errors).length > 0)}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;