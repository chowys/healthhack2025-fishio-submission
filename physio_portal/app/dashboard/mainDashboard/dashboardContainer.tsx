"use client";

import { useEffect, useState, useContext} from 'react'
import React from 'react'
import DashboardCard from './dashboardCard'
import { useAuth } from '../../authContext/authContext'
import CalendarComponent from './calendar';
import DashboardAppointmentAndExercise from './dashboardAppointmentAndExercise';
import { AppointmentType } from '../../interface/interface';
import { AppointmentsContext } from '../page';
import { PatientType } from '../../interface/interface';
import { useRouter } from 'next/navigation';

interface PatientProgress {
  [patientId: string]: number
}

const DashBoardContainer = () => {
  const { acceptedAppointments, pendingAppointments, CompletedAppointments } = useContext(AppointmentsContext) || {}
  const [appointmentsList, setAppointmentsList] = useState<AppointmentType[]>([])
  const [patientList, setPatientList] = useState<PatientType[]>([])
  const [patientProgress, setPatientProgress] = useState<PatientProgress>({})
  const router = useRouter()
  useEffect(() => {
      if (acceptedAppointments === undefined) {
          return
      }
      acceptedAppointments.sort((a, b) => {
          return a.start_datetime._seconds - b.start_datetime._seconds
      })
      const patientDict : Record<string, PatientType> = {}
      acceptedAppointments.forEach((appointment) => {
          if (patientDict[appointment.patient.user_id] === undefined) {
              patientDict[appointment.patient.user_id] = appointment.patient
          }
      })
      const patients = Object.values(patientDict)

      const fetchPatientProgress = async (patients : PatientType[]) => {
        const patientProgress = await Promise.all(patients.map(async (patient) => {
          const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL +`/exercisePlans/getExerciseProgress/${patient.user_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'default',
          })
          const data = await response.json()
          return data
        }))
        console.log(patientProgress)
        let patientProgressDictionary : Record<string, number> = {}
        patientProgress.forEach((progress) => {
          patientProgressDictionary[progress.patientId] = progress.percentage
        })
        setPatientProgress(patientProgressDictionary)
      }

      fetchPatientProgress(patients)
      setPatientList(patients)
      setAppointmentsList(acceptedAppointments)
  }, [acceptedAppointments])
  return (
    <div className='w-full h-full flex flex-col gap-5 rounded-lg'>
      <div className='w-full h-fit flex gap-5'>
        <DashboardCard infoType='pending_appointment' cardTitle='Pending appointment' infoNumber={pendingAppointments?.length}/>
        <DashboardCard infoType='accepted_appointment' cardTitle='Accepted appointment' infoNumber={acceptedAppointments?.length}/>
        <DashboardCard infoType='completed_appointment' cardTitle='Completed' infoNumber={(CompletedAppointments?.length)}/>
      </div>
      <div className='w-full h-full flex gap-5'>
        <CalendarComponent apppointments={acceptedAppointments} />
        <div className='w-1/2 h-[380px] flex flex-col gap-5 bg-white rounded-xl p-5'>
          <h1 className='text-2xl font-bold'>Patient Progress</h1>
          <div className='w-full h-full bg-white rounded-lg overflow-y-auto'>
            <table className=' table-auto w-full'>
              <thead className='h-[50px]'>
                <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-300">
                  <th className='text-left pl-2'>Patient</th>
                  <th className='text-left'>Progress</th>
                  <th className='text-left'></th>
                </tr>
              </thead>
              <tbody className='bg-white'>
                {patientList.map((patient, index) => {
                  const patientProgressPercentage = Math.round(patientProgress?.[patient.user_id] * 100 || 0)
                  return (
                  <tr key={index} className='text-gray-700 '>
                    <td className="px-4 py-3 border-b border-gray-300 w-2/5">
                      <div>
                        <p className='font-semibold'>{patient.user_name}</p>
                        <p className=' text-xs'>{patient.user_id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-300 w-2/5">
                      <div className='w-full flex items-center gap-2'>
                        <div className='w-full h-2 bg-gray-200 rounded-lg'>
                          <div className={`h-full ${patientProgressPercentage < 30 ? 'bg-red-300' : patientProgressPercentage < 65 ? 'bg-yellow-300' : 'bg-green-300'} rounded-lg`} style={{width: `${patientProgressPercentage}%`}}>
                          </div>
                        </div>
                        <p className=' w-fit text-xs font-semibold'>{patientProgressPercentage}%</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-300">
                      <button onClick={() => router.push(`/patient/${patient.user_id}`)}>View</button>
                    </td>
                  </tr>
                  )}
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <DashboardAppointmentAndExercise appointments={acceptedAppointments} />
    </div>
  )
}

export default DashBoardContainer
