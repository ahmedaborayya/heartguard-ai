import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import type { ExtendedProfile } from '../../types';
import Button from '../ui/Button';
import { User, Calendar, Phone, UserCircle, Save, Loader2 } from 'lucide-react';
import { notify } from '../../utils/notifications';
import { notifyProfileUpdate } from '../../utils/notificationUtils';

interface ProfileFormProps {
  onComplete?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onComplete }) => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ExtendedProfile>({
    id: user?.id || '',
    full_name: '',
    date_of_birth: '',
    gender: null,
    phone_number: '',
    created_at: '',
    updated_at: ''
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      // This would be replaced with your actual API call
      // const response = await fetch(`/api/profile/${user?.id}`);
      // const data = await response.json();
      
      // Using mock data for now
      setTimeout(() => {
        setProfile({
          id: user?.id || '',
          full_name: 'John Doe',
          date_of_birth: '1990-01-01',
          gender: 'Male',
          phone_number: '555-123-4567',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading profile:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // This would be replaced with your actual API call
      // const response = await fetch(`/api/profile/${user?.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(profile),
      // });
      
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        notify.success('Profile updated successfully');
        notifyProfileUpdate();
        onComplete?.();
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      notify.error('Failed to update profile');
      setLoading(false);
    }
  };

  const FormField: React.FC<{
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }> = ({ label, icon, children }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Full Name" icon={<User className="w-4 h-4" />}>
          <input
            type="text"
            value={profile.full_name || ''}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            className="
              w-full px-4 py-2 rounded-lg border border-gray-300
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              placeholder-gray-400
            "
            placeholder="Enter your full name"
          />
        </FormField>

        <FormField label="Date of Birth" icon={<Calendar className="w-4 h-4" />}>
          <input
            type="date"
            value={profile.date_of_birth || ''}
            onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
            className="
              w-full px-4 py-2 rounded-lg border border-gray-300
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
            "
          />
        </FormField>

        <FormField label="Gender" icon={<UserCircle className="w-4 h-4" />}>
          <select
            value={profile.gender || ''}
            onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
            className="
              w-full px-4 py-2 rounded-lg border border-gray-300
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              bg-white
            "
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </FormField>

        <FormField label="Phone Number" icon={<Phone className="w-4 h-4" />}>
          <input
            type="tel"
            value={profile.phone_number || ''}
            onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
            className="
              w-full px-4 py-2 rounded-lg border border-gray-300
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              placeholder-gray-400
            "
            placeholder="Enter your phone number"
          />
        </FormField>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onComplete}
          className="text-gray-600 hover:text-gray-900"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="
            flex items-center gap-2 px-6
            bg-gradient-to-r from-blue-600 to-blue-700
            hover:from-blue-700 hover:to-blue-800
            text-white font-medium py-2.5 rounded-lg
            shadow-sm hover:shadow
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;