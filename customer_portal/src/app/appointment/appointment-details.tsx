"use client";

import React, { useState } from "react";
import { FaCalendar, FaMapPin, FaCheckCircle } from "react-icons/fa";


const exercises = [
    { id: 1, name: "Dead Bug", description: "Core strengthening exercise to improve stability." },
    { id: 2, name: "Glute Bridge", description: "Strengthens the glutes and lower back." },
    { id: 3, name: "Cat-Cow Stretch", description: "Improves spinal flexibility and relieves tension." },
    { id: 4, name: "Skullcrushers", description: "Big big tricep." },
];

const AppointmentDetailsPage = ({ appointment, onBack }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Handle file selection
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    // Handle file upload
    const handleUpload = () => {
        if (!selectedFile) {
            alert("Please select a video file first.");
            return;
        }

        // Mock upload process
        alert(`Uploading ${selectedFile.name}...`);
        setSelectedFile(null);
    };

    return (
        <div className="flex h-screen">
            <aside className="w-[28%] bg-gray-100 pt-6 pl-6 border-r shadow-lg">
                <h2 className="text-xl font-bold mb-4">Appointment Details</h2>
                <p className="text-m text-gray-700 flex items-center gap-2">
                    <FaCalendar className="text-gray-500" />
                    <span><strong>Date:</strong> {appointment?.date || "March 10, 2025"}</span>
                </p>
                <p className="text-m text-gray-700 flex items-center gap-2 mt-2">
                    <FaMapPin className="text-gray-500" />
                    <span><strong>Location:</strong> {appointment?.location || "Rehab Center A"}</span>
                </p>
                <p className={`text-m font-semibold mt-4 flex items-center gap-2 ${appointment?.status === "completed" ? "text-green-600" : "text-gray-600"}`}>
                    <FaCheckCircle />
                    Status: {appointment?.status?.charAt(0).toUpperCase() + appointment?.status?.slice(1) || "Upcoming"}
                </p>

                <button
                    onClick={onBack}
                    className="mt-6 w-[80%] px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    ← Back to Appointments
                </button>
            </aside>

            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-6">Exercise List</h1>

                <div className="grid grid-cols-2 gap-6">
                    <div className="w-full max-w-lg">
                        <ul className="space-y-4">
                            {exercises.map((exercise) => (
                                <li key={exercise.id} className="p-4 border rounded-lg shadow-sm bg-white">
                                    <h3 className="text-lg font-bold">{exercise.name}</h3>
                                    <p className="text-gray-600">{exercise.description}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-6 w-full max-w-lg h-[50%] p-6 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Upload Exercise Video</h2>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="w-full border p-2 rounded-md cursor-pointer"
                        />
                        <button
                            onClick={handleUpload}
                            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                        >
                            Upload Video
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AppointmentDetailsPage;
