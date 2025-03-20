import React from 'react';

export interface MedicalHistoryData {
    primaryInjury: string;
    conditions: string;
    conditionDuration: string;
}

interface StepMedicalHistoryProps {
    data: MedicalHistoryData;
    onUpdate: (fields: Partial<MedicalHistoryData>) => void;
}

const StepMedicalHistory: React.FC<StepMedicalHistoryProps> = ({ data, onUpdate }) => {
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        onUpdate({ [name]: value });
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-lg p-2">
                <label className="block mb-1 font-small">
                    Primary Injury
                </label>
                <div className="relative mt-2 text-gray-500">
                    <select
                        name="conditionDuration"
                        value={data.primaryInjury}
                        onChange={handleChange}
                        className="w-full pt-2 pb-2 pl-3 appearance-none bg-transparent outline-none border focus:border-slate-600 shadow-sm rounded-lg"
                    >
                        <option value="" disabled>
                            Select Primary Injury
                        </option>
                        <option value="hand">Hand Injury</option>
                        <option value="foot">Foot Injury</option>
                        <option value="loser">PHeart Pain</option>
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
            <div className="bg-white rounded-lg p-2">
                <label className="block mb-1 font-small">
                    Duration of Condition
                </label>
                <div className="relative mt-2 text-gray-500">
                    <select
                        name="conditionDuration"
                        value={data.conditionDuration}
                        onChange={handleChange}
                        className="w-full pt-2 pb-2 pl-3 appearance-none bg-transparent outline-none border focus:border-slate-600 shadow-sm rounded-lg"
                    >
                        <option value="" disabled>
                            Select Duration of Condition
                        </option>
                        <option value="Long">Long-Term</option>
                        <option value="Short">Short-Term</option>
                        <option value="Recovery">Post-Recovery</option>
                        <option value="Other">Other</option>
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
            <div className="bg-white rounded-lg p-2">
                <label className="block mb-1 font-small">
                    Medical History
                </label>
                <textarea
                    name="conditions"
                    placeholder="Describe any relevant medical history, treatment or ongoing conditions."
                    value={data.conditions}
                    onChange={handleChange}
                    className="w-full min-w-[450px] border rounded p-2 bg-transparent outline-none border focus:border-slate-600 shadow-sm rounded-lg"
                    rows={4}
                />
            </div>
        </div>
    );
};

export default StepMedicalHistory;
