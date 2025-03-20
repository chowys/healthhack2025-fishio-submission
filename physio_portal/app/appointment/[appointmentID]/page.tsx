'use client';

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { AppointmentType, PatientType, RecoveryPlanType, ExercisePlanType } from '@/app/interface/interface';
import { set } from 'date-fns';
import { FaCirclePlus } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";


type Status = "pending" | "accepted" | "completed" | "cancelled" 

const page = () => {
    const { appointmentID } = useParams()
    const router = useRouter()
    const [appointment, setAppointment] = useState<AppointmentType | undefined>(undefined)
    const [recoveryPlan, setRecoveryPlan] = useState<RecoveryPlanType>()
    const [excercisePlan, setExcercisePlan] = useState<ExercisePlanType | undefined>()
    const [openRecoveryPlanCreate, setOpenRecoveryPlanCreate] = useState<boolean>(false)    
    const [patient, setPatient] = useState<PatientType | undefined>(undefined)
    const [recoveryPlan_name, setRecoveryPlan_name] = useState<string>('')
    const [recoveryPlan_description, setRecoveryPlan_description] = useState<string>('')
    const [openPatientDetails, setOpenPatientDetails] = useState<boolean>(false)    

    useEffect(() => {
        const fetchData = async() => {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/appointments/getAppointmentById/${appointmentID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'default',
            })
            const userResponse = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/appointments/getUserByAppointment/${appointmentID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'default',
            })
            const exercisePlanResponse = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/exercisePlans/getByAppointmentId/${appointmentID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'default',
            })
            const exercisePlanData = await exercisePlanResponse.json()
            const data = await response.json()
            const userData = await userResponse.json()
            const recoveryPlanResponse = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/recoveryPlans/${data.recoveryPlan_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'default',
            })
            const recoveryPlanData = await recoveryPlanResponse.json()
            console.log(recoveryPlanData)
            data.patient = userData
            if (response.status !== 200 || userResponse.status !== 200) {
                console.log('Error fetching data')
            }
            else {
                setExcercisePlan(exercisePlanData)
                setAppointment(data)
                setPatient(userData.user)
                setRecoveryPlan(recoveryPlanData)
            }
        }
        fetchData()
    }, [])

    const handleAppointmentStatus = async(status: Status, recoveryPlan_name : string | undefined, recoveryPlan_description: string | undefined) => {
        try {
            let responseRecovery
            let recoveryData 
            if (status === 'accepted') {
                //create recovery plan and tag appointment to recovery plan
                responseRecovery = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/recoveryPlan/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: patient?.user_id,
                        physioTherapist_id: appointment?.physioTherapist_id,
                        physioClinic_id: appointment?.physioClinic_id,
                        recoveryPlan_name: recoveryPlan_name || 'Default Recovery Plan',
                        recoveryPlan_description: recoveryPlan_description || 'Default Recovery Plan',
                        appointment_status: 'accepted'
                    }),
                    cache: 'default',
                })
                if (responseRecovery.ok) {
                    recoveryData = await responseRecovery.json()
                }
            }
            console.log(recoveryPlan)
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/appointments/updateAppointmentStatus/${appointmentID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    appointment_status: status,
                    recoveryPlan_id: recoveryPlan?.recoveryPlan_id == undefined ? recoveryData?.recoveryPlan_id : recoveryPlan?.recoveryPlan_id
                }),
                cache: 'default',
            })

            if (response.status !== 200) {
                console.log('Error updating status')
            }
            else {
                if (appointment) {
                    setAppointment({
                        ...appointment,
                        appointment_status: status
                    });
                }
            }
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div className='w-full h-full overflow-x-hidden relative'>
            <div className={`flex flex-col ${openPatientDetails ? ` translate-x-0` : ` translate-x-[100%]`} w-1/3 h-fit bg-(--primary) p-5 rounded-lg rounded-tl-none gap-5 fixed right-0 top-1/4 transition-all duration-300 ease-in-out z-30`}>
                <div onClick={() => setOpenPatientDetails(!openPatientDetails)} className='absolute top-0 -left-[50px] bg-(--primary) w-[50px] h-[50px] text-white flex justify-center items-center cursor-pointer rounded-l-lg'>
                    <ImProfile className='text-3xl' />
                </div>
                <div className='bg-white text-black p-5 rounded-lg'>
                    <h1 className='text-4xl font-bold rounded-lg text-black mb-4'>{patient?.user_name}</h1>
                    <div className='flex flex-col gap-2'>
                        <div className='flex flex-row gap-2'>
                            <p className='font-bold'>Patient ID:</p>
                            <p>{patient?.user_id}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <p className='font-bold'>Patient Email:</p>
                            <p>{patient?.user_email}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <p className='font-bold'>Patient Phone:</p>
                            <p>{patient?.user_address}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <p className='font-bold'>Patient Address:</p>
                            <p>{patient?.user_goals}</p>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <button onClick={() => router.push(`/patient/${patient?.user_id}`)} className='bg-(--lightGrey) text-white p-2 rounded-lg'>View Patient</button>
                    </div>
                </div>
            </div>
            <div className='w-full h-full shadow-2xl'>
                <div className='w-full h-fit p-5'>
                    <div className='flex flex-col w-full h-fit p-5 gap-5 '>
                        <h1 className='text-5xl font-bold pl-2 border-b-4 border-(--primary)  text-(--primary)'>{appointment?.appointment_title}</h1>
                        <div className='flex flex-col gap-10'>
                            <div className='flex flex-row gap-2'>
                                <p className='font-bold'>Appointment ID:</p>
                                <p>{appointmentID}</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='font-bold'>Appointment description:</p>
                                <div className='p-5 bg-(--lightGrey) rounded-lg'>
                                    <p>{appointment?.appointment_description}</p>
                                </div>
                            </div>
                            <div className='flex flex-row gap-2'>
                                <p className='font-bold'>Appointment start date:</p>
                                <p>{appointment?.start_datetime._seconds 
                                    ? new Date(appointment.start_datetime._seconds * 1000).toString()
                                    : "N/A"}
                                </p>
                            </div>
                            <div className='flex flex-row gap-2'>
                                <p className='font-bold'>Appointment end date:</p>
                                <p>{appointment?.end_datetime._seconds 
                                    ? new Date(appointment.end_datetime._seconds * 1000).toString()
                                    : "N/A"}
                                </p>
                            </div>
                            <div className='flex flex-row gap-2'>
                                <p className='font-bold'>Appointment Status:</p>
                                <p>{(appointment?.appointment_status)?.toUpperCase()}</p>
                            </div>
                            <div className='flex flex-row gap-2'>
                                <p className='font-bold'>Week No:</p>
                                <p>1</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full h-full mt-5 p-10'>
                    {appointment?.appointment_status === 'pending' ? 
                        <div className='w-full'>
                            {openRecoveryPlanCreate ? 
                                <div className='flex flex-col gap-2 w-1/2'>
                                    <input type='text' placeholder='Recovery Plan Name' value={recoveryPlan_name} onChange={(e) => setRecoveryPlan_name(e.target.value)} className='p-2 rounded-lg border-2 border-gray-300' />
                                    <textarea placeholder='Recovery Plan Description' value={recoveryPlan_description} onChange={(e) => setRecoveryPlan_description(e.target.value)} className='p-2 rounded-lg border-2 border-gray-300' />
                                    <div className='flex flex-row gap-5'>
                                        <button onClick={() => handleAppointmentStatus('accepted', recoveryPlan_name, recoveryPlan_description)} className='bg-(--lightGrey) text-white p-2 rounded-lg w-fit'>Create Recovery Plan and accept booking</button>
                                        <button onClick={() => setOpenRecoveryPlanCreate(false)} className='bg-(--lightGrey) text-white p-2 rounded-lg w-fit'>Cancel</button>
                                    </div>
                                </div>
                                :
                                <div className='flex flex-row gap-5'>
                                    <button onClick={() => setOpenRecoveryPlanCreate(true)} className=' bg-(--lightGrey) shadow-2xl p-2 rounded-lg'>Approve</button>
                                    <button onClick={() => handleAppointmentStatus('cancelled', undefined, undefined)} className=' bg-(--lightGrey) shadow-2xl p-2 rounded-lg'>Reject</button>
                                </div>
                            }
                        </div>
                        :
                    appointment?.appointment_status === 'accepted' ?
                        <div className='flex flex-row gap-5'>
                            <button onClick={() => handleAppointmentStatus('completed', undefined, undefined)} className=' bg-(--lightGrey) shadow-2xl p-2 rounded-lg'>Mark as completed</button>
                            <button onClick={() => handleAppointmentStatus('cancelled', undefined, undefined)} className=' bg-(--lightGrey) shadow-2xl p-2 rounded-lg'>Cancel Appointment</button>   
                        </div>
                        :
                    appointment?.appointment_status === 'completed' ?
                        <button  className=' bg-(--lightGrey) shadow-2xl p-2 rounded-lg'>Book Next Appointment</button>
                        :
                    null
                    }
                </div>
            </div>
            {appointment?.appointment_status != "pending" &&
            <div className='w-full h-full flex flex-col gap-5 p-5'>
                <div className='flex flex-row justify-between items-center'>
                    <h1 className='text-5xl font-bold pt-5 text-(--primary)'>Exercise Plan</h1>
                    <FaCirclePlus className='text-5xl text-(--primary) cursor-pointer hover:text-(--lightGrey) transition-all duration-300 ease-in-out' onClick={() => router.push(`/appointment/${appointmentID}/exercisePlan/create`)}  />
                </div>
                {excercisePlan === undefined && 
                    <div className='flex flex-col gap-5 p-5 bg-(--lightGrey) rounded-lg'>
                        <h1 className='text-3xl font-bold'>No Exercise Plan</h1>
                        <p>There is no exercise plan for this appointment</p>
                    </div>
                }
                {excercisePlan && (
                <div className='flex gap-5 p-5 bg-lightGrey rounded-lg'>
                    {/* Image on the left */}
                    <div className="flex-shrink-0">
                    <img
                        src={false || "data:image/png;base64,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"} // Ensure the URL is correct
                        className="w-32 h-32 object-cover rounded-lg"
                    />
                    </div>

                    {/* Details on the right */}
                    <div className="flex flex-col justify-center gap-3">
                    <h1 className='text-3xl font-bold'>{excercisePlan.exercisePlan_name}</h1>
                    <p className='text-lg text-gray-700'>{excercisePlan.exercisePlan_description}</p>
                    <p className={`text-md ${excercisePlan.exercisePlan_status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                        {excercisePlan.exercisePlan_status}
                    </p>
                    </div>
                </div>
                )}
            </div>
        }
        </div>
        )
    }

export default page
