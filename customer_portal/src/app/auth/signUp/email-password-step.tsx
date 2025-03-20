import { error } from 'console';
import React from 'react';

export interface EmailPasswordData {
    email: string;
    password: string;
    confirmPassword: string;
}

interface StepEmailPasswordProps {
    data: EmailPasswordData;
    onUpdate: (fields: Partial<EmailPasswordData>) => void;
}

const StepEmailPassword: React.FC<StepEmailPasswordProps> = ({ data, onUpdate }) => {
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        onUpdate({ [name]: value });
    };

    return (
        <div className="max-w-xl mx-auto grid grid-cols-1 gap-6">
            <div className="bg-white rounded-lg">
                <label className="block mb-1 font-small">
                    Email
                </label>
                <div className="relative mt-2 text-gray-500">
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={data.email}
                        onChange={handleChange}
                        className="w-full min-w-[450px] pt-2 pb-2 pl-3 appearance-none bg-transparent outline-none border focus:border-slate-600 shadow-sm rounded-lg"
                    />
                </div>
            </div>
            <div className="bg-white rounded-lg">
                <label className="block mb-1 font-small">
                    Password
                </label>
                <div className="relative mt-2 text-gray-500">
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={data.password}
                        onChange={handleChange}
                        className="w-full pt-2 pb-2 pl-3 appearance-none bg-transparent outline-none border focus:border-slate-600 shadow-sm rounded-lg"
                    />
                </div>
            </div>
            <div className="bg-white rounded-lg">
                <label className="block mb-1 font-small">
                    Confirm Password
                </label>
                <div className="relative mt-2 text-gray-500">
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Enter your password again"
                        value={data.confirmPassword}
                        onChange={handleChange}
                        className="w-full pt-2 pb-2 pl-3 appearance-none bg-transparent outline-none border focus:border-slate-600 shadow-sm rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default StepEmailPassword;
