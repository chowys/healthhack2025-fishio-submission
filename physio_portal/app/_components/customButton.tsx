import React from 'react';

interface CustomButtonProps {
    label: string;
    isSelected: boolean;
    onClick: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ label, isSelected, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 
                ${isSelected ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'} 
                hover:bg-green-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-black-800`}
        >
            {label}
        </button>
    );
};

export default CustomButton;