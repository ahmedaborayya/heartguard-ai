import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { 
  LogOut, 
  LineChart as ChartLine, 
  History, 
  UserCircle, 
  Mail,
  Settings,
  X
} from 'lucide-react';
import ProfileForm from '../components/profile/ProfileForm';
import PredictionHistory from '../components/profile/PredictionHistory';
import HealthDashboard from '../components/profile/HealthDashboard';

type TabType = 'history' | 'health';

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('history');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const tabs = [
    { id: 'history' as TabType, label: 'History', icon: History },
    { id: 'health' as TabType, label: 'Health', icon: ChartLine }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Edit Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <ProfileForm onComplete={() => setIsProfileModalOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-xl shadow-md">
                <UserCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {user?.email?.split('@')[0] || 'User'}
                </h1>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsProfileModalOpen(true)}
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                onClick={handleSignOut}
                className="text-gray-700 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <Card className="bg-white shadow-sm overflow-hidden">
            <div className="flex border-b">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-4 px-4
                    text-sm font-medium transition-colors relative
                    ${activeTab === id
                      ? 'text-blue-600 bg-blue-50/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {activeTab === id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="p-6">
              {activeTab === 'history' && <PredictionHistory />}
              {activeTab === 'health' && <HealthDashboard />}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;