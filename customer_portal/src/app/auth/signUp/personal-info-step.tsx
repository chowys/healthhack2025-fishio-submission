import React from 'react';

export interface PersonalInfoData {
    firstName: string;
    lastName: string;
    address: string;
    gender: string;
}

interface StepPersonalInfoProps {
    data: PersonalInfoData;
    onUpdate: (fields: Partial<PersonalInfoData>) => void;
}

const StepPersonalInfo: React.FC<StepPersonalInfoProps> = ({ data, onUpdate }) => {
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        onUpdate({ [name]: value });
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg">
                    <label className="block mb-1 font-small">
                        First Name
                    </label>
                    <div className="relative mt-2 max-w-xs text-gray-500">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="Enter your first name"
                            value={data.firstName}
                            onChange={handleChange}
                            className="w-full p-2 appearance-none bg-transparent outline-none border focus:border-slate-600 shadow-sm rounded-lg"
                        />
                    </div>
                </div>
                <div className="bg-white rounded-lg">
                    <label className="block mb-1 font-small">
                        Last Name
                    </label>
                    <div className="relative mt-2 max-w-xs text-gray-500">
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Enter your last name"
                            value={data.lastName}
                            onChange={handleChange}
                            className="w-full pt-2 pb-2 pl-3 appearance-none bg-transparent outline-none border focus:border-slate-600 shadow-sm rounded-lg"
                        />
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="bg-white rounded-lg">
                        <label className="block mb-1 font-small">
                            Address
                        </label>
                        <div className="relative mt-2 text-gray-500">
                            <input
                                type="text"
                                name="address"
                                placeholder="Enter your address"
                                value={data.address}
                                onChange={handleChange}
                                className="w-full pt-2 pb-2 pl-3 appearance-none bg-transparent outline-none border focus:border-slate-600 shadow-sm rounded-lg"
                            />
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="bg-white rounded-lg">
                        <label className="block mb-1 font-small">
                            Gender
                        </label>
                        <div className="relative mt-2 text-gray-500">
                            <select
                                name="gender"
                                value={data.gender}
                                onChange={handleChange}
                                className="w-full pt-2 pb-2 pl-3 appearance-none bg-transparent outline-none border focus:border-slate-600 shadow-sm rounded-lg"
                            >
                                <option value="" disabled>
                                    Select Gender
                                </option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <svg
                                    className="h-4 w-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StepPersonalInfo;
