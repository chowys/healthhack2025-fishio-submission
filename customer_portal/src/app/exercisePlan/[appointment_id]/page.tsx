
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter , useSearchParams} from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaArrowRight, FaArrowLeft, FaArrowUp, FaArrowDown } from "react-icons/fa";
import GaugeChart from "../../_components/gauge-chart";

interface Exercise {
    exercise_name: string;
    exercise_description?: string;
    exercise_sets?: number;
    exercise_reps?: number;
    exercise_duration_sec?: number;
    exercise_video_URL?: string;
    exercise_picture_URL?: string;
}

interface ExercisePlan {
    exercisePlan_id: string;
    exercisePlan_description: string;
    exercisePlan_startDate: { _seconds: number; _nanoseconds: number };
    exercisePlan_endDate: { _seconds: number; _nanoseconds: number };
    exercises: { [date: string]: { [exerciseName: string]: boolean } };
}

const ExercisePlan = () => {
    const [exercisePlan, setExercisePlan] = useState<ExercisePlan | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [completedExercises, setCompletedExercises] = useState<{ [key: string]: { [key: string]: string } }>({});
    const [allExercises, setAllExercises] = useState<Exercise[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [exerciseStates, setExerciseStates] = useState<{ [key: string]: boolean }>({}); // Store expand/collapse state
    const [isOpen, setIsOpen] = useState(false);

    const params = useParams();
    const appointment_id = params.appointment_id; // Get dynamic ID from URL
    const router = useRouter();

    useEffect(() => {
        const fetchExercisePlan = async () => {
            try {
                console.log("Fetching exercise plan for appointment ID:", appointment_id);
                const response = await fetch(`http://localhost:3000/exercisePlans/getByAppointmentId/${appointment_id}`);
                if (!response.ok) {
                    console.log("Failed to fetch exercise plan");
                } else {
                    const data: ExercisePlan = await response.json();
                    // console.log("Fetched Exercise Plan:", data);
                    setExercisePlan(data);
                }
            } catch (error) {
                console.error("Error fetching exercise plan:", error);
            }
        };
        fetchExercisePlan();
    }, [selectedDate]);

    useEffect(() => {
        const fetchAllExercises = async () => {
            try {
                const response = await fetch("http://localhost:3000/exercises");
                if (!response.ok) {
                    // If the response is not OK (status not in the range 200-299), throw an error
                    console.log(`Failed to fetch exercises: ${response.statusText}`);
                } else {
                    const data = await response.json();
                    setAllExercises(data.exercises);
                }
            } catch (error) {
                // Catch any errors that occur during fetch or processing
                if (error instanceof Error) {
                    // If the error is an instance of Error, log the message
                    console.error("Error fetching all exercises:", error.message);
                } else {
                    // In case the error is not an instance of Error
                    console.error("An unknown error occurred", error);
                }
            }
        };
        fetchAllExercises();
    }, [selectedDate]);

    useEffect(() => {
        if (!exercisePlan || !selectedDate) return;

        const formattedDate = selectedDate.toISOString().split("T")[0];

        // Get exercises for the selected date (or an empty object if not found)
        const exercisesForDate = exercisePlan.exercises[formattedDate] || {};

        // console.log("Exercises for date:", exercisesForDate);

        // Convert the object keys (exercise names) into an array of exercise objects
        const filteredExercises = allExercises
            .filter((exercise) => Object.keys(exercisesForDate).includes(exercise.exercise_name))
            .map((exercise) => ({
                ...exercise, // Keep full exercise details
                status: exercisesForDate[exercise.exercise_name] // Attach completion status
            }));

        // console.log("Filtered exercises:", filteredExercises);

        setExercises(filteredExercises);
    }, [selectedDate, exercisePlan]);

    useEffect(() => {
        if (!exercisePlan || !selectedDate) return;
    
        const formattedDate = selectedDate.toISOString().split("T")[0];
    
        console.log(exercisePlan.exercises[formattedDate]);
    
        const exercisesForDate = exercisePlan.exercises[formattedDate] || {};
    
        // Set initial statuses from the exercise plan
        const initialStatuses = {
            [formattedDate]: Object.fromEntries(
                Object.entries(exercisesForDate).map(([key, value]) => {
                    console.log("Key:", key); // Print the key (exercise name)
                    console.log("Value:", value); // Print the value (could be a boolean or string)
    
                    // Explicitly check if value is boolean or string
                    const status = typeof value === 'boolean' 
                        ? value ? "completed" : "uncompleted"
                        : value === "completed" ? "completed" : "uncompleted";
    
                    return [key, status];
                })
            )
        };
    
        console.log("exercisePlan:", exercisePlan);
        console.log("Initial statuses:", initialStatuses);
        setCompletedExercises(initialStatuses);
    
        console.log("Completed exercises in useEffect:", completedExercises);
    
    }, [exercisePlan, selectedDate]);

    const handleCheckboxChange = async (exercise_name: string, currentStatus: string) => {
        const newStatus = currentStatus === "completed" ? "uncompleted" : "completed";
        const formattedDate = selectedDate!.toISOString().split("T")[0]; // Format the date

        try {
            const response = await fetch("http://localhost:3000/exercisePlans/update-status", {
                method: "PUT", // HTTP method
                headers: {
                    "Content-Type": "application/json", // Content type is JSON
                },
                body: JSON.stringify({
                    exercisePlan_id: exercisePlan!.exercisePlan_id,
                    date: formattedDate,
                    exercise_name,
                    status: newStatus,
                }), // Sending the payload
            });

            // Update local state to reflect the change immediately
            setCompletedExercises((prevState) => ({
                ...prevState,
                [formattedDate]: {
                    ...prevState[formattedDate],
                    [exercise_name]: newStatus,
                },
            }));
        } catch (error) {
            console.error("Failed to update exercise status:", error);
        }
    };


    const convertTimestamp = (timestamp: { _seconds: number; _nanoseconds: number }) => {
        return new Date(timestamp._seconds * 1000);
    };

    const tileDisabled = ({ date }: { date: Date }) => {
        if (!exercisePlan) return false;

        // console.log(">>>>>>>>", exercisePlan.exercisePlan_startDate);
        // console.log(">>>>", exercisePlan.exercisePlan_startDate);
        // console.log(exercisePlan.exercisePlan_endDate);

        const startDate = convertTimestamp(exercisePlan.exercisePlan_startDate);
        const endDate = convertTimestamp(exercisePlan.exercisePlan_endDate);
        return date < startDate || date > endDate;
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    
    function calculateCompletionPercentage(): number {
        //iterate through completed exercise and count the number of completed exercises in total for all dates
        let totalCompletedExercises = 0;
        let totalExercises = 0;
        for (const date in completedExercises) {
            for (const exercise in completedExercises[date]) {
                totalExercises++;
                if (completedExercises[date][exercise] === "completed") {
                    totalCompletedExercises++;
                }
            }
        }

        if(totalExercises === 0) {
            return 0
        }
        return (totalCompletedExercises / totalExercises) * 100;
    } 
    
    
    return (
        <div className="flex h-screen">
            <main className="flex-1 p-8">
            {exercisePlan ? (
                <h1 className="text-2xl font-bold mb-6">Exercise Plan</h1>
            ) : (

                <><h1 className="text-l font-bold mb-6">No Exercise Plan Assigned, Please Contact Your Physiotherapist!</h1><div className="h-1/10"></div></>
            )}       
                <div className="flex flex-col items-center mb-8">
                    <Calendar
                        onChange={(value) => setSelectedDate(value as Date)}
                        value={selectedDate}
                        tileDisabled={tileDisabled}
                        className="w-200 h-auto text-lg rounded-lg shadow-md"
                    />
                </div>
                <div className="h-10/100"></div>
                <div className="flex flex-col items-center">
                    {exercisePlan && selectedDate && (
                        <GaugeChart
                            circleWidth={20}
                            gap={50}
                            progress={calculateCompletionPercentage()}
                            progressWidth={15}
                            rounded
                            showValue
                            size={200}
                        />
                    )}
                </div>
            </main>

            {exercisePlan && selectedDate && (
                <aside className={`transition-all duration-300 ${isSidebarOpen ? "w-2/3" : "w-16"} bg-gray-100 p-4 border-l h-screen overflow-y-auto`}>
                    <div className="flex items-center justify-between">
                        <button className="p-2 bg-gray-200 rounded-full" onClick={toggleSidebar}>
                            {isSidebarOpen ? <FaArrowLeft size={20} /> : <FaArrowRight size={20} />}
                        </button>
                    </div>
                    {isSidebarOpen && (
                        <>
                            <h2 className="text-xl font-semibold text-center">
                                Exercises for {selectedDate.toDateString()}
                            </h2>
                            <p className="text-gray-600 mb-4 text-center">{exercisePlan.exercisePlan_description}</p>
                            {exercises.length === 0 ? (
                                <p className="text-gray-600">No exercises scheduled for this plan.</p>
                            ) : (
                                <ul>
                                    {exercises.map((exercise) => (
                                        <li key={exercise.exercise_name} className="flex flex-col gap-4 p-4 border-b">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={completedExercises[selectedDate!.toISOString().split("T")[0]]?.[exercise.exercise_name] === "completed"}
                                                    onChange={() => {
                                                        const currentStatus = completedExercises[selectedDate!.toISOString().split("T")[0]]?.[exercise.exercise_name] || "uncompleted";
                                                        console.log("checked > ", completedExercises[selectedDate!.toISOString().split("T")[0]]?.[exercise.exercise_name] === "completed");
                                                        console.log("Current Status (Before Change):", currentStatus);
                                                        handleCheckboxChange(exercise.exercise_name, currentStatus);
                                                    }} className="h-5 w-5"
                                                />
                                                <span className="text-gray-700 font-semibold">{exercise.exercise_name}</span>
                                                <button
                                                    className="ml-auto p-2 bg-gray-200 rounded-full"
                                                    onClick={() => setExerciseStates((prev) => ({
                                                        ...prev,
                                                        [exercise.exercise_name]: !prev[exercise.exercise_name],
                                                    }))}
                                                >
                                                    {exerciseStates[exercise.exercise_name] ? <FaArrowUp size={20} /> : <FaArrowDown size={20} />}
                                                </button>
                                            </div>

                                            {exerciseStates[exercise.exercise_name] && (
                                                <div className="mt-4 p-6 bg-white rounded-lg shadow-lg border-2 border-green-600 flex">
                                                    {/* Left side for exercise details */}
                                                    <div className="flex-1 space-y-4">
                                                        <h4 className="text-xl font-semibold text-gray-800 mb-4">Exercise Details</h4>
                                                        <div>
                                                            <h5 className="text-md font-medium text-gray-700">Description:</h5>
                                                            <p className="text-gray-600">{exercise.exercise_description}</p>
                                                        </div>

                                                        <div className="flex space-x-6">
                                                            <div>
                                                                <h5 className="text-md font-medium text-gray-700">Sets:</h5>
                                                                <p className="text-gray-600">{exercise.exercise_sets}</p>
                                                            </div>
                                                            <div>
                                                                <h5 className="text-md font-medium text-gray-700">Reps:</h5>
                                                                <p className="text-gray-600">{exercise.exercise_reps}</p>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h5 className="text-md font-medium text-gray-700">Duration (sec):</h5>
                                                            <p className="text-gray-600">{exercise.exercise_duration_sec}</p>
                                                        </div>

                                                        <div>
                                                            <h5 className="text-md font-medium text-gray-700">Video:</h5>
                                                            <a href={exercise.exercise_video_URL} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                                                                Watch Video
                                                            </a>
                                                        </div>
                                                    </div>

                                                    {/* Right side for image */}
                                                    {exercise.exercise_picture_URL && (
                                                        <div className="ml-6 flex-shrink-0 w-64">
                                                            <h5 className="text-md font-medium text-gray-700 mb-2"></h5>
                                                            <img
                                                                src={exercise.exercise_picture_URL}
                                                                alt="Exercise"
                                                                className="w-full h-64 object-cover rounded-md shadow-sm"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </aside>
            )}
        </div>
    );
};  

export default ExercisePlan;