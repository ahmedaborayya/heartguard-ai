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
  X,
  Users,
  Calendar,
  Phone,
  Stethoscope,
  Building2
} from 'lucide-react';
import ProfileForm from '../components/profile/ProfileForm';
import PredictionHistory from '../components/profile/PredictionHistory';

type TabType = 'history' | 'patients';

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

  const doctorTabs = [
    { id: 'history' as TabType, label: 'Appointments', icon: History },
    { id: 'patients' as TabType, label: 'My Patients', icon: Users }
  ];

  const patientTabs = [
    { id: 'history' as TabType, label: 'History', icon: History }
  ];

  const tabs = user?.role === 'doctor' ? doctorTabs : patientTabs;

  // Mock doctor data
  const doctorInfo = {
    specialization: 'Cardiologist',
    licenseNumber: '123456',
    yearsOfExperience: '15',
    clinicAddress: '123 Medical Center, Cairo'
  };

  // Mock appointments data
  const appointments = [
    { id: 1, patientName: 'Ahmed Mohamed', date: '2024-03-25', time: '10:00 AM', status: 'upcoming' },
    { id: 2, patientName: 'Sara Ahmed', date: '2024-03-24', time: '2:30 PM', status: 'completed' },
    { id: 3, patientName: 'Omar Hassan', date: '2024-03-23', time: '11:15 AM', status: 'completed' }
  ];

  // Mock patients data
  const patients = [
    { id: 1, name: 'Ahmed Mohamed', age: 45, lastVisit: '2024-03-24', riskLevel: 'high' },
    { id: 2, name: 'Sara Ahmed', age: 32, lastVisit: '2024-03-20', riskLevel: 'low' },
    { id: 3, name: 'Omar Hassan', age: 58, lastVisit: '2024-03-15', riskLevel: 'medium' }
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-12 gap-8">
          {/* Profile Sidebar */}
          <div className="col-span-12 lg:col-span-4">
            <Card className="bg-white shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{user?.fullName || 'User'}</h2>
                    <p className="text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>

              {user?.role === 'doctor' && (
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Professional Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Stethoscope className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Specialization</p>
                        <p className="font-medium text-gray-900">{doctorInfo.specialization}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">License Number</p>
                        <p className="font-medium text-gray-900">{doctorInfo.licenseNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Years of Experience</p>
                        <p className="font-medium text-gray-900">{doctorInfo.yearsOfExperience} years</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Clinic Address</p>
                        <p className="font-medium text-gray-900">{doctorInfo.clinicAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="space-y-4">
                  <Button
                    onClick={() => setIsProfileModalOpen(true)}
                    variant="secondary"
                    className="w-full"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    onClick={handleSignOut}
                    variant="danger"
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8">
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
                {user?.role === 'doctor' ? (
                  // Doctor's view
                  activeTab === 'history' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
                        <Button variant="secondary">Schedule New</Button>
                      </div>
                      <div className="space-y-4">
                        {appointments.map(appointment => (
                          <div
                            key={appointment.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{appointment.patientName}</h4>
                                <p className="text-sm text-gray-500">
                                  {appointment.date} at {appointment.time}
                                </p>
                              </div>
                              <span className={`
                                px-3 py-1 rounded-full text-sm font-medium
                                ${appointment.status === 'upcoming' 
                                  ? 'bg-blue-50 text-blue-600' 
                                  : 'bg-green-50 text-green-600'}
                              `}>
                                {appointment.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Patients tab
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">My Patients</h3>
                        <Button variant="secondary">Add New Patient</Button>
                      </div>
                      <div className="space-y-4">
                        {patients.map(patient => (
                          <div
                            key={patient.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{patient.name}</h4>
                                <p className="text-sm text-gray-500">
                                  Age: {patient.age} | Last Visit: {patient.lastVisit}
                                </p>
                              </div>
                              <span className={`
                                px-3 py-1 rounded-full text-sm font-medium
                                ${patient.riskLevel === 'high' 
                                  ? 'bg-red-50 text-red-600' 
                                  : patient.riskLevel === 'medium'
                                  ? 'bg-yellow-50 text-yellow-600'
                                  : 'bg-green-50 text-green-600'}
                              `}>
                                {patient.riskLevel.charAt(0).toUpperCase() + patient.riskLevel.slice(1)} Risk
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ) : (
                  // Patient's view
                  <PredictionHistory />
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;