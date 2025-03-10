import { useNotificationStore } from '../stores/notificationStore';

export const addSystemNotification = (
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) => {
  const { addNotification } = useNotificationStore.getState();
  addNotification({ message, type });
};

export const notifyHealthUpdate = () => {
  addSystemNotification(
    'Your health metrics have been updated. View your dashboard for details.',
    'info'
  );
};

export const notifyAssessmentComplete = (riskScore: number) => {
  const riskLevel = riskScore > 75 ? 'high' : riskScore > 50 ? 'moderate' : 'low';
  addSystemNotification(
    `Your heart health assessment is complete. Your risk level is ${riskLevel}.`,
    riskScore > 75 ? 'error' : riskScore > 50 ? 'warning' : 'success'
  );
};

export const notifyProfileUpdate = () => {
  addSystemNotification(
    'Your profile has been successfully updated.',
    'success'
  );
};

export const notifyNewFeature = () => {
  addSystemNotification(
    'New feature available: Track your daily heart health metrics!',
    'info'
  );
};

export const notifyReminder = () => {
  addSystemNotification(
    'Reminder: Schedule your next health assessment.',
    'warning'
  );
}; 