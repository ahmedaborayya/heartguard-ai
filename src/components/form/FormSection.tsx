import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormSectionProps {
  title: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'red';
  children: React.ReactNode;
  visible: boolean;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  icon: Icon,
  color,
  children,
  visible
}) => {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-500/5',
      border: 'border-blue-500/10',
      text: 'text-blue-600',
      gradient: 'from-blue-500/20 to-blue-600/20',
      shadow: 'shadow-blue-500/5'
    },
    green: {
      bg: 'bg-green-500/5',
      border: 'border-green-500/10',
      text: 'text-green-600',
      gradient: 'from-green-500/20 to-green-600/20',
      shadow: 'shadow-green-500/5'
    },
    purple: {
      bg: 'bg-purple-500/5',
      border: 'border-purple-500/10',
      text: 'text-purple-600',
      gradient: 'from-purple-500/20 to-purple-600/20',
      shadow: 'shadow-purple-500/5'
    },
    red: {
      bg: 'bg-red-500/5',
      border: 'border-red-500/10',
      text: 'text-red-600',
      gradient: 'from-red-500/20 to-red-600/20',
      shadow: 'shadow-red-500/5'
    }
  };

  const styles = colorStyles[color];

  return (
    <div
      className={`
        transform transition-all duration-500 ease-in-out
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 absolute pointer-events-none'}
      `}
    >
      <div className={`
        relative overflow-hidden
        bg-white/70 backdrop-blur-sm
        border border-gray-100
        rounded-2xl shadow-xl ${styles.shadow}
        p-8 mb-6
      `}>
        {/* Decorative Elements */}
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${styles.gradient} rounded-full blur-3xl -z-10 opacity-30`} />
        <div className={`absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr ${styles.gradient} rounded-full blur-3xl -z-10 opacity-30`} />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2.5 rounded-xl ${styles.bg} ${styles.border} ${styles.text} backdrop-blur-sm`}>
              <Icon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {title}
            </h2>
          </div>
          <div className={`h-1 w-20 rounded-full bg-gradient-to-r ${styles.gradient}`} />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormSection; 