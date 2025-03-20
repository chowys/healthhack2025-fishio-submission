"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ExercisePlanType, ExercisePlan_ExerciseType, ExerciseType } from '@/app/interface/interface'
const { useAuth } = require('@/app/authContext/authContext')
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { set } from 'date-fns'
import { stat } from 'fs'

const page  = () => {
    const { user } = useAuth()
    const { appointmentID } = useParams()
    const [exercisePlan, setExercisePlan] = useState<ExercisePlanType>()
    const [exercisePlan_name, setExercisePlan_name] = useState<string>('')
    const [exercisePlan_description, setExercisePlan_description] = useState<string>('')
    const [exercisePlan_startDate, setExercisePlan_startDate] = useState<Date>(new Date())
    const [exercisePlan_endDate, setExercisePlan_endDate] = useState<Date>(new Date())
    const [exerciseList, setExerciseList] = useState<ExerciseType[]>([])
    const [newExercise, setNewExercise] = useState<ExerciseType>()
    const [newExerciseDuration, setNewExerciseDuration] = useState<string>("")
    const [newExerciseReps, setNewExerciseReps] = useState<string>("")
    const [newExerciseSets, setNewExerciseSets] = useState<string>("")
    const [newExerciseDate, setNewExerciseDate] = useState<Date>(new Date())

    useEffect(() => {
        const fetchData = async () => {
            if (!appointmentID) return
            if (!user) return
            const exerciseListResponse = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/indivExercise/${user?.uid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'default',
            })
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/exercisePlans/getByAppointmentId/${appointmentID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'default',
            })
            const exerciseListData = await exerciseListResponse.json()
            console.log(exerciseListData.exercises)
            if (exerciseListResponse.status !== 200) {
                console.log('Error fetching data')
            }
            else {
                setExerciseList(exerciseListData.exercises)
            }
            const data = await response.json()
            console.log(data)
            if (response.status !== 200) {
                console.log('Error fetching data')
            }
            else {
                setExercisePlan(data)
            }

        }
        fetchData()
    }, [appointmentID, user])

    const createExercisePlan = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/exercisePlans/create3`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    appointment_id: appointmentID,
                    physioTherapist_id: user?.uid,
                    physioClinic_id: user?.clinic_id || ' ',
                    exercisePlan_name: exercisePlan_name,
                    exercisePlan_description: exercisePlan_description,
                    exercisePlan_startDate: exercisePlan_startDate,
                    exercisePlan_endDate: exercisePlan_endDate,
                    exercisePlan_status: 'active',
                    exercises: []
                }),
                cache: 'default',
            })
            const data = await response.json()
            setExercisePlan(data.exercisePlan)
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    const addExercise = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/exercises`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    exercise_name: newExercise?.exercise_name,
                    exercise_description : newExercise?.exercise_description,
                    exercise_endDate : newExerciseDate, 
                    exercise_sets : Number(newExerciseSets) || 0,
                    exercise_reps : Number(newExerciseReps) || 0,
                    exercise_duration_sec : Number(newExerciseDuration) || 0,
                    exercise_video_URL : newExercise?.exercise_video_URL,
                    exercise_picture_URL : newExercise?.exercise_image_URL,
                    exercise_status : 'incomplete',
                }),
                cache: 'default',
            })
            const data = await response.json()
            const exercisePlanResponse = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/exercisePlans/add-exercise`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    exercisePlan_id: exercisePlan?.exercisePlan_id,
                    date: newExerciseDate,
                    exercise_id: data.exercise_id,
                    status: 'incomplete'
                }),
                cache: 'default',
            })
            if (exercisePlanResponse.status !== 200) {
                console.log('Error fetching data')
            }
            const exercisePlanData = await exercisePlanResponse.json()
            console.log(exercisePlanData)
            setExercisePlan(exercisePlanData.exercisePlan)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex flex-col gap-8 p-8">
      {exercisePlan ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-4">
            {exercisePlan.exercisePlan_name}
          </h1>
          <p className="text-gray-600 text-center">{exercisePlan.exercisePlan_description}</p>

          {/* Exercise List */}
          <div className="mt-6">
            {exercisePlan.exercises &&
              Object.entries(exercisePlan.exercises).map(([date, exercises]) => (
                <div key={date} className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-700">📅 {new Date(date).toLocaleDateString()}</h2>
                  {Object.entries(exercises).map(([exercise_id, exercisedDetails]) => (
                    <div
                      key={exercise_id}
                      className="flex items-center gap-6 p-4 border rounded-lg shadow-sm bg-gray-100 mt-2"
                    >
                      {/* Image */}
                      <img
                        src={exercisedDetails.image || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAclBMVEX///8AAADJycnExMSbm5uLi4vY2NiFhYV8fHzd3d1ISEjAwMC+vr48PDzGxsa3t7f39/ft7e2Tk5Pk5ORNTU3Q0NAaGhpZWVlpaWlzc3MwMDCgoKCpqalSUlIMDAwpKSkzMzNjY2OwsLB3d3chISE5OTkMDnJpAAADS0lEQVR4nO2d63aiMBRGwXorraJVbHW0Fu28/yvOqogSSFA7CZwV9v7T1dKVz61ySQgnQQAAAAAAAAAAAAAAAAAAAAAAAAAAAPBfzOYzn3OT8XLzuV8ekybCCkzX0f7zazkaOs5JvsKc7xfHWUXi1SV34tRxHRZJm/qyzpZK7shd0i5UiebusgrM96XcD1dJ72GZiauoIrNNJdeRYr8SFIZHN1EKH5rcrYugoSYoDKcuohRibe7CQVKqTYocJKmUd8KMsf2ghTYoDHv2oxReDLn2P8Q3Q9LaepJK9fCW8cd60sSQtHF8UjTEhqntoLkpyck+fyUx5tp+Z/VH0h/cHk2fGjM0v5cHy0kqW2Pus+Uk83vZt5ykYjrA2f/uvLZkODDmPllOwtAVGP6Sebx96x+UXVm4YfaK772CTP7mjRyvPVzRhr3L2Mr4nj65MlIR538VbDhTOpC3R48itZ38AlewYemK+VbnuNKhPjck1zAtb6jfG6uXLivhhtUXtq9tMKq2dJBtqOnVxTXt6Try2TiFqavdtuGzZst7TXvaUR/Rhtq+R0172iv5hWRD7faak+JI9/9DyYZj3aaariOGGGKIIYYYYoghhhhiiOHvDQeT6OCl4SGaDH5+nqZUDTw0PPXno8vIxcI7w/OgU5xPVut7Z3iew7ULzvMaU+8M0+yXVT6dI/LOMB/7xfCm4TjpuSPRTUxs2rAtMMSwAIYtgSGGBTBsCQwxLIBhS2CIYQEMWwJDDAtg2BIYYlig8+Ol/o95yzf0/96T//cP/b8H7P99/A7MxSjgmaEGDDHEULJhWzUVMMQQQwwxxBBDDB83ND/LLdXw0We5zc/jSzV89Hl8c00FqYa6mgq7ugY1dTG2og11dTFqK8gZa5uINayWJPmub9FUn0asYZCWN9yqFmWoMSTX8NEaQ6Y6UYIN1TpRr3c0eq31tb6eWAQbBkHvUi36eGf97az6mVIQTbShtsLcowg3tACGrsDQHtOWDJurQet/HWH/a0H7X8/b/5rsHairL21tBAcLwKTaII/WtzAcTV1/hE2uUeL/OjMdWCuoA+s9dWDNrg6suxb4v3beCc/XPwQAAAAAAAAAAAAAAAAAAAAAAAAAAL/5B1pfWm2wxMrTAAAAAElFTkSuQmCC"} // Default image
                        alt={exercisedDetails.exercise_name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />

                      {/* Details */}
                      <div>
                        <p className="text-lg font-semibold">{exercisedDetails.exercise_name}</p>
                        <p className="text-gray-600">{exercisedDetails.exercise_description}</p>
                        <span
                          className={`text-sm font-medium ${
                            exercisedDetails.status === "completed"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {exercisedDetails.status === "completed" ? "✔️ Completed" : "❌ Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>

          {/* Add Exercise */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3">Add Exercise</h2>
            <div className="flex flex-col gap-4">
              <select
                className="border p-2 rounded-md"
                onChange={(e) => {
                  const exercise = exerciseList.find(
                    (exercise) => exercise.exercise_id === e.target.value
                  );
                  if (exercise) setNewExercise(exercise);
                }}
              >
                <option value="">Select an exercise</option>
                {exerciseList.map((exercise) => (
                  <option key={exercise.exercise_id} value={exercise.exercise_id}>
                    {exercise.exercise_name}
                  </option>
                ))}
              </select>

              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Sets"
                  className="border p-2 rounded-md w-full"
                  value={newExerciseSets}
                  onChange={(e) => setNewExerciseSets(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Reps"
                  className="border p-2 rounded-md w-full"
                  value={newExerciseReps}
                  onChange={(e) => setNewExerciseReps(e.target.value)}
                />
              </div>

              <input
                type="number"
                placeholder="Duration (mins)"
                className="border p-2 rounded-md w-full"
                value={newExerciseDuration}
                onChange={(e) => setNewExerciseDuration(e.target.value)}
              />

              <DatePicker
                className="border p-2 rounded-md w-full"
                dateFormat={"dd/MM/yyyy"}
                placeholderText="Exercise date"
                selected={newExerciseDate}
                onChange={(date) => setNewExerciseDate(date || new Date())}
              />

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                onClick={addExercise}
              >
                Add Exercise
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Create Exercise Plan */
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-4">Create an Exercise Plan</h1>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Exercise Plan Name"
              className="border p-2 rounded-md w-full"
              value={exercisePlan_name}
              onChange={(e) => setExercisePlan_name(e.target.value)}
            />
            <input
              type="text"
              placeholder="Exercise Plan Description"
              className="border p-2 rounded-md w-full"
              value={exercisePlan_description}
              onChange={(e) => setExercisePlan_description(e.target.value)}
            />

            <div className="flex gap-4">
              <DatePicker
                className="border p-2 rounded-md w-full"
                dateFormat={"dd/MM/yyyy"}
                placeholderText="Start Date"
                selected={exercisePlan_startDate}
                onChange={(date) => setExercisePlan_startDate(date || new Date())}
              />
              <DatePicker
                className="border p-2 rounded-md w-full"
                dateFormat={"dd/MM/yyyy"}
                placeholderText="End Date"
                selected={exercisePlan_endDate}
                onChange={(date) => setExercisePlan_endDate(date || new Date())}
              />
            </div>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              onClick={createExercisePlan}
            >
              Create Exercise Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default page
