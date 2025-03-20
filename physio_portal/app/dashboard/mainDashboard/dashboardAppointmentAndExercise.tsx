"use client";
import React from 'react'
import { AppointmentType, PatientType } from '../../interface/interface'
import {useState, useEffect, useContext} from 'react'
import Loading from '../../component/loading/loading'
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { AppointmentsContext } from '../page';
import BarGraph from '@/app/component/charts/barChart';

type PatientListProps = {
    appointments: AppointmentType[] | undefined
}

const DashboardAppointmentAndExercise : React.FC<PatientListProps> = ({appointments}) => {
    const router = useRouter()
    const [appointmentsList, setAppointmentsList] = useState<AppointmentType[]>([])
    const [patientList, setPatientList] = useState<PatientType[]>([])
    const { top5ExcerciseList } = useContext(AppointmentsContext) || {}

    useEffect(() => {
        if (appointments === undefined) {
            return
        }
        appointments.sort((a, b) => {
            return a.start_datetime._seconds - b.start_datetime._seconds
        })
        const patientDict : Record<string, PatientType> = {}
        appointments.forEach((appointment) => {
            if (patientDict[appointment.patient.user_id] === undefined) {
                patientDict[appointment.patient.user_id] = appointment.patient
            }
        })
        const patients = Object.values(patientDict)
        setPatientList(patients)
        setAppointmentsList(appointments)
    }, [appointments])

    return (
            <div className=' w-full h-[400px] flex gap-5'>
                <div className='w-full h-full flex flex-col gap-5 bg-white p-5 rounded-lg'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-2xl font-bold'>Upcoming appointments</h1>
                        <FaArrowAltCircleRight className='text-2xl text-black' />
                    </div>
                    {appointments == undefined ? 
                        <Loading />
                    : 
                    <div className='w-full h-full flex flex-col bg-white overflow-y-auto rounded-xl gap-5'>
                        <table className='table-auto w-full'>
                            <thead className='h-[50px]'>
                                <tr className="text-xs font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-300">
                                    <th className='pl-2'>Patient Name</th>
                                    <th>Appointment Date</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointmentsList?.map((appointment, index) => {
                                    return (
                                        <tr key={index} className='bg-white text-black border-b-2 border-gray-200 text-sm'>
                                            <td className="px-4 py-3">{appointment.patient.user_name}</td>
                                            <td>{new Date(appointment.start_datetime._seconds * 1000).toDateString()}</td>
                                            <td>{new Date(appointment.start_datetime._seconds * 1000).toLocaleTimeString()}</td>
                                            <td>{new Date(appointment.end_datetime._seconds * 1000).toLocaleTimeString()}</td>
                                            <td className='p-2'>
                                                <button onClick={() => router.push(`/appointment/${appointment.appointment_id}`)} className=' rounded-lg'>View</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                }
                </div>
                <div className='w-full h-full flex flex-col gap-5 bg-white p-5 rounded-lg'>
                    <h1 className='text-2xl font-bold'>Top 5 completed exercises</h1>
                    {top5ExcerciseList == undefined ? 
                        <Loading />
                    :
                    <div className='w-full h-full'>
                        <BarGraph data={top5ExcerciseList} />
                    </div>
                }
                </div>
            </div>
        )
    }

export default DashboardAppointmentAndExercise
