import { ExerciseType } from '@/app/interface/interface'
import React from 'react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/app/authContext/authContext'

const excerciseDashboard = () => {
    const {user} = useAuth()
    const [exerciseList, setExerciseList] = useState<ExerciseType[]>([])
    const [newExerciseName, setNewExerciseName] = useState<string>('')
    const [newExerciseDescription, setNewExerciseDescription] = useState<string>('')
    const [newExerciseImageURL, setNewExerciseImageURL] = useState<string>('')
    const [newExerciseVideoURL, setNewExerciseVideoURL] = useState<string>('')

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/indivExercise/${user?.uid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'default',
            })
            const data = await response.json()
            console.log(data)
            if (response.status !== 200) {
                console.log('Error fetching data')
            }
            else{
                setExerciseList(data.exercises)
            }
        }
        fetchData()
    }, [user])

    const createNewExcercise = async () => {
        try{
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/indivExercise`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    physioTherapist_id: user?.uid,
                    exercise_name: newExerciseName,
                    exercise_description: newExerciseDescription,
                    exercise_image_URL: newExerciseImageURL,
                    exercise_video_URL: newExerciseVideoURL
                }),
                cache: 'default',
            })
            const data = await response.json()
            const createdExercise = {
                exercise_id: data.exercise_id,
                ...data.exercise
            }
            console.log(data)
            if (response.status !== 200) {
                console.log('Error fetching data')
            }
            else{
                setExerciseList([...exerciseList, createdExercise])
            }
        } catch (error) {
            console.log(error)
        }
    }
    
  return (
    <div className='w-full min-h-screen  rounded-lg'>
        <div className='w-full h-screen flex gap-5 bg-white rounded-lg p-5'>
            <div className='w-2/3 h-[90vh] bg-white p-5 border-r-2 border-(--lightGrey)'>
                <h1 className='customH1'>List of Excercises</h1>
                <div className='flex flex-col gap-5 p-5  overflow-y-auto h-full w-full '>
                    {exerciseList.map((exercise) => (
                        <div key={exercise.exercise_id} className='border-b-2 border-b-gray-300 p-5'>
                            <h1 className='font-bold text-2xl'>Exercise name: {exercise.exercise_name}</h1>
                            <p>{exercise.exercise_description}</p>
                            <p>{exercise.exercise_image_URL}</p>
                            <p>{exercise.exercise_video_URL}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className='w-1/3 h-full bg-white rounded-lg p-5'>
                <h1 className='customH1'>Create new excercise</h1>
                <div className='flex flex-col gap-5 mt-5'>
                    <input type="text" placeholder='Excercise Name' value={newExerciseName} onChange={(e) => setNewExerciseName(e.target.value)} className='w-full p-2 rounded-lg border border-(--primary)'/>
                    <input type="text" placeholder='Excercise Description' value={newExerciseDescription} onChange={(e) => setNewExerciseDescription(e.target.value)} className='w-full p-2 rounded-lg border border-(--primary)'/>
                    <input type="text" placeholder='Excercise Image URL' value={newExerciseImageURL} onChange={(e) => setNewExerciseImageURL(e.target.value)} className='w-full p-2 rounded-lg border border-(--primary)'/>
                    <input type="text" placeholder='Excercise Video URL' value={newExerciseVideoURL} onChange={(e) => setNewExerciseVideoURL(e.target.value)} className='w-full p-2 rounded-lg border border-(--primary)'/>
                </div>
                <button onClick={createNewExcercise} className='bg-(--lightGrey) text-white p-2 rounded-lg mt-5'>Create Excercise</button>
            </div>
        </div>
    </div>
  )
}

export default excerciseDashboard
