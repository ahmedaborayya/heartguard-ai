import React from 'react';
import { Check } from 'lucide-react';

interface FormProgressProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const FormProgress: React.FC<FormProgressProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-4xl relative">
          {/* Decorative Elements */}
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-blue-500/10 rounded-full blur-xl" />
          <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-purple-500/10 rounded-full blur-xl" />

          <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            {/* Progress Bar */}
            <div className="absolute top-1/2 left-0 right-0 mx-8 -mt-px h-0.5 bg-gray-200" />
            <div
              className="absolute top-1/2 left-0 mx-8 -mt-px h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 rounded-full"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />

            {/* Steps */}
            <div className="relative flex justify-between px-6">
              {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                const isClickable = onStepClick && index <= currentStep;

                return (
                  <button
                    key={step}
                    onClick={() => isClickable && onStepClick(index)}
                    disabled={!isClickable}
                    className={`
                      flex flex-col items-center relative group
                      ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                    `}
                  >
                    {/* Step Circle */}
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        transition-all duration-300 relative z-10
                        ${isCompleted
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                          : isCurrent
                            ? 'bg-white border-2 border-blue-500 text-blue-500 shadow-lg'
                            : 'bg-white border-2 border-gray-200 text-gray-400'
                        }
                        group-hover:scale-110 group-hover:shadow-lg
                      `}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <span className="text-sm font-semibold">{index + 1}</span>
                      )}
                    </div>

                    {/* Step Label */}
                    <div
                      className={`
                        mt-3 text-sm font-medium transition-all duration-200
                        ${isCurrent 
                          ? 'text-blue-600 transform scale-105' 
                          : isCompleted
                            ? 'text-gray-700'
                            : 'text-gray-400'
                        }
                        group-hover:text-blue-600
                      `}
                    >
                      {step}
                    </div>

                    {/* Hover Effect */}
                    <div
                      className={`
                        absolute -inset-4 bg-blue-50 rounded-xl opacity-0
                        transition-all duration-300 -z-10
                        ${isClickable ? 'group-hover:opacity-100' : ''}
                      `}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormProgress; 