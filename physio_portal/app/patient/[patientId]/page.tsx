"use client";
import React, { use, useEffect, useState } from "react";
import { FaCheckCircle, FaClock, FaCalendar, FaMapPin } from "react-icons/fa";
import Button from "../../_components/button";
import { useParams, useRouter } from "next/navigation";
import CustomButton from "../../_components/customButton"; // Adjust the path as necessary

    const AppointmentsPage = () => {
      const { patientId } = useParams()
       const userId = patientId;

      interface Appointment {
          weeklyPlan_id: null;
          appointment_id: string;
          appointment_title: string;
          start_datetime: { _seconds: number };
          location: string;
          appointment_status: string;
      }
  
      interface WeeklyPlan {
          user_id: string;
          weeklyProgram_weekNumber: number;
          weeklyProgram_description: string;
          weeklyProgram_completed: boolean;
          created_at: { _seconds: number };
          updated_at: { _seconds: number };
          recoveryPlan_id: string;
          program_id: string;
      }
  
      interface TimelineEvent {
          id: string;
          title: string;
          week: number;
          topic: string;
          status: string;
          description: string;
          [key: string]: any;
          weeklyPlan_id: string;
      }
  
  
      const [appointments, setAppointments] = useState<Appointment[]>([]);
      const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
      const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
      const [selectedWeeklyPlanId, setSelectedWeeklyPlanId] = useState<string | undefined>(undefined);
      const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
      // Filtered appointments based on the selected weeklyPlan_id
      const filteredAppointments = selectedWeeklyPlanId
          ? appointments.filter((appointment) => appointment.weeklyPlan_id === selectedWeeklyPlanId)
          : appointments;
  
      // Function to handle selecting a weekly plan by its ID
      const handlePlanSelection = (planId: string) => {
          setSelectedWeeklyPlanId(planId);
      };
  
      const [programDetails, setProgramDetails] = useState<TimelineEvent[]>([]);
  
  
      const calculateProgress = () => {
          if (appointments.length === 0) return 0; // Avoid division by zero
  
          const completed = appointments.filter(a => a.appointment_status === "completed").length;
          return (completed / appointments.length) * 100;
      };
  
      const progress = calculateProgress();
    
      useEffect(() => {
          const fetchAppointments = async () => {
              try {
                  const response = await fetch("http://localhost:3000/appointments");
                  if (!response.ok) {
                      throw new Error("Failed to fetch appointments");
                  }
                  const data = await response.json();
                  setAppointments(data.appointments);
              } catch (error) {
                  console.error("Error fetching appointments:", error);
              }
          };
  
          fetchAppointments();
      }, []);
  
      useEffect(() => {
  
          const fetchWeeklyPlans = async () => {
              try {
                  const response = await fetch(`http://localhost:3000/weeklyPlans/getWeeklyPlanByUser/${userId}`);
                  if (!response.ok) {
                      throw new Error("Failed to fetch weeklyPlans");
                  }
                  const data = await response.json();
                  const mappedProgramDetails = data.weeklyPlans.sort((a: { weeklyProgram_weekNumber: number; }, b: { weeklyProgram_weekNumber: number; }) => a.weeklyProgram_weekNumber - b.weeklyProgram_weekNumber).map((plan: {
                      program_id: any; recoveryPlan_id: any; weeklyProgram_weekNumber: any; weeklyProgram_description: any; weeklyProgram_completed: any;
                  }) => ({
                      id: plan.program_id,
                      title: `Week ${plan.weeklyProgram_weekNumber}`,
                      week: plan.weeklyProgram_weekNumber,
                      description: plan.weeklyProgram_description,
                      status: plan.weeklyProgram_completed ? "completed" : "upcoming"
                  }));
                  setProgramDetails(mappedProgramDetails);
                  setWeeklyPlans(data.weeklyPlans);
              } catch (error) {
                  console.error("Error fetching weeklyPlans:", error);
              }
          };
          fetchWeeklyPlans();
      }, []);
  
      const router = useRouter();
      const handleNavigation = (appointment_id: string) => {
          router.push(`/exercisePlan2/${appointment_id}`);
      };
      // to include the retrieving of the appointments and program details from the backend using userId
  
      useEffect(() => {
          console.log("selectedWeeklyPlanId>>>>", selectedWeeklyPlanId);
      }, [selectedWeeklyPlanId]); // This will log whenever selectedWeeklyPlanId changes
  
      return (
          <div className="flex h-screen bg-white">
  
              <main className="flex-1 p-8">
                  <div className="mb-6 flex-wrap justify-center space-x-4 space-y-4">
                  {weeklyPlans.map((plan) => (
                          <CustomButton
                              key={plan.weeklyProgram_weekNumber}
                              label={`Week ${plan.weeklyProgram_weekNumber}`}
                              isSelected={selectedWeeklyPlanId === plan.program_id}
                              onClick={() => handlePlanSelection(plan.program_id)}
                          />
                      ))}
                  </div>
  
                  <h1 className="text-2xl font-bold mb-6">Appointments</h1>
  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                      <div className="bg-[#075540] h-3 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
  
                  {/* Conditionally Render Appointments */}
                  <div>
                      {filteredAppointments.length > 0 ? (
                          filteredAppointments.map((session) => (
                              <div key={session.appointment_id} className="p-4 border-b border-gray-300">
                                  <h3 className="text-3xl font-semibold">{session.appointment_title}</h3>
                                  <p className="text-gray-600 text-2xl mt-1 flex items-center gap-2">
                                      <FaCalendar className="h-4 w-4 text-gray-500" />
                                      {new Date(session.start_datetime._seconds * 1000).toLocaleString()}
                                  </p>
                                  <p className="text-gray-600 text-xl mt-1 flex items-center gap-2">
                                      <FaMapPin className="h-4 w-4 text-gray-500" /> {session.location ? session.location : "NUS"}
                                  </p>
                                  <div className={`mt-2 text-xl font-semibold ${session.appointment_status === "completed" || session.appointment_status === "accepted" ? "text-green-600" : "text-gray-600"}`}>
                                      Status: {session.appointment_status.charAt(0).toUpperCase() + session.appointment_status.slice(1)}
                                  </div>
                                  <br />
                                  <Button className="mt-2 text-sm" onClick={() => handleNavigation(session.appointment_id)}>
                                      Check Exercise Plan
                                  </Button>
                              </div>
                          ))
                      ) : (
                          <p className="text-gray-500 text-lg">No appointments for this Weekly Plan.</p>
                      )}
                  </div>
              </main>
          </div>
      );
  };
  
  export default AppointmentsPage;
