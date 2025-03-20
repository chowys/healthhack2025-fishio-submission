import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = (currentStep / (totalSteps)) * 100;

  return (
    <div className="w-full bg-gray-200 h-2 rounded-md overflow-hidden mb-6">
      <div
        className="bg-green-500 h-2 transition-all duration-300"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
