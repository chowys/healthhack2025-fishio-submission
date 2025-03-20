import React from 'react';

export interface GoalsPreferencesData {
    treatmentGoals: string;
    sessionTypePreference: string;
}

interface StepGoalsPreferencesProps {
    data: GoalsPreferencesData;
    onUpdate: (fields: Partial<GoalsPreferencesData>) => void;
}

const StepGoalsPreferences: React.FC<StepGoalsPreferencesProps> = ({ data, onUpdate }) => {
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        onUpdate({ [name]: value });
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="mb-4">
                <label className="block mb-1 font-medium">Treatment Goals</label>
                <div className="relative mt-2 text-gray-500">
                    <select
                        name="treatmentGoals"
                        value={data.treatmentGoals}
                        onChange={handleChange}
                        className="w-full pt-2 pb-2 pl-3 appearance-none bg-transparent outline-none border focus:border-slate-600 shadow-sm rounded-lg"
                    >
                        <option value="" disabled>
                            What would you like to achieve?
                        </option>
                        <option value="hand">Pain Relief</option>
                        <option value="foot">Injury Recovery</option>
                        <option value="loser">Rehabilitation</option>
                        <option value="other">Others</option>
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
            <div>
                <label className="block mb-1 font-medium">Preferred Session Type</label>
                <textarea
                    name="sessionTypePreference"
                    placeholder="Any specific preferences for sessions?"
                    value={data.sessionTypePreference}
                    onChange={handleChange}
                    className="w-full min-w-[450px] border rounded p-2"
                    rows={3}
                />
            </div>
        </div>
    );
};

export default StepGoalsPreferences;
