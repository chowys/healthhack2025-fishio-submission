'use client';

import React from 'react'
import { FaBell } from "react-icons/fa6";
import { FaEnvelope } from "react-icons/fa";
import SidePanel from '../component/dashboardSidePanel/sidePanel';
import DashBoardContainer from './mainDashboard/dashboardContainer';
import AppointmentDashboardContainer from './appointmentDashboard/appointmentDashBoardContainer';
import ExcerciseDashboard from './excerciseDashboard/excerciseDashboard';
import { useState, useEffect, createContext } from 'react';
import { useAuth } from '../authContext/authContext';
import { AppointmentType } from '../interface/interface';
import { useRouter } from 'next/navigation';

export type Top5Excercise = {
  exerciseName: string,
  count: number,
}

interface AppointmentsContextProps {
  top5ExcerciseList: Top5Excercise[],
  sidePanelButton: string,
  acceptedAppointments: AppointmentType[] | undefined,
  pendingAppointments: AppointmentType[] | undefined,
  CompletedAppointments: AppointmentType[] | undefined
}

export const AppointmentsContext = createContext<AppointmentsContextProps | undefined>(undefined)

const Dashboard = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [pendingAppointments, setPendingAppointments] = useState<AppointmentType[] | undefined> (undefined)
  const [acceptedAppointments, setAcceptedAppointments] = useState<AppointmentType[] | undefined> (undefined)
  const [CompletedAppointments, setCompletedAppointments] = useState<AppointmentType[] | undefined> (undefined)
  const [sidePanelButton , setSidePanelButton] = useState('Dashboard')
  const [top5ExcerciseList, setTop5ExcerciseList] = useState<Top5Excercise[]>([])

  const handleSidePanelButton = (dashboardNavigation : any) => {
    setSidePanelButton(dashboardNavigation)
  }
  
    useEffect(() => {
      const fetchData = async () => {
        if (!user) return
        console.log(user)
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/appointments/getAppointmentByPhysioTherapist?physioTherapist_id=${user?.uid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'default',
        })
        const responseTop5 = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/exercisePlans/getTopExercises/${user?.uid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'default',
        })
        const dataTop5 = await responseTop5.json()
        const data = await response.json()
        const pendingResult : AppointmentType[] = [] 
        const acceptedResult : AppointmentType[] = []
        const completedResult : AppointmentType[] = []
        const appointments = data.appointments
        console.log(data)
        if (response.status !== 200) {
          console.log('Error fetching data')
        }
        else{
          appointments.forEach((appointment : AppointmentType) => {
            // console.log(appointment)
            if (appointment.appointment_status === 'pending') {
              pendingResult.push(appointment)
            } else if (appointment.appointment_status === 'accepted') {
              acceptedResult.push(appointment)
            } else if (appointment.appointment_status === 'completed' || appointment.appointment_status === 'cancelled') {
              completedResult.push(appointment)
            }
          })
        }
        console.log(dataTop5.topExercises)
        setTop5ExcerciseList(dataTop5.topExercises)
        setCompletedAppointments(completedResult)
        setPendingAppointments(pendingResult)
        setAcceptedAppointments(acceptedResult)
  
      }
      fetchData()
    }, [user, sidePanelButton])

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-60% from-white to-(--primary) p-5 flex gap-5'>
        <SidePanel navigateFunction={handleSidePanelButton}  />
        <div className='w-full h-full flex flex-col gap-5 bg-black/20 rounded-lg p-5'>
          <div className='w-full h-fit flex justify-between items-center p-5 bg-white rounded-lg'>
              <h1 className='customH1'>{sidePanelButton}</h1>
              <div className='flex gap-5 text-xl'>
                  <FaBell />
                  <div onClick={() => router.push('/chat')}>
                    <FaEnvelope />
                  </div>
              </div>
          </div>
          <AppointmentsContext.Provider value={{ top5ExcerciseList , sidePanelButton,  acceptedAppointments, pendingAppointments, CompletedAppointments}}>
          <div className={`${sidePanelButton === 'Dashboard' ? 'block' : 'hidden'} w-full h-full`}>
            <DashBoardContainer key="dashboard"/>
          </div>
          <div className={`${sidePanelButton === 'Appointments' ? 'block' : 'hidden'} w-full h-full`}>
            <AppointmentDashboardContainer key="appointments"/>
          </div>
          <div className={`${sidePanelButton === 'Excercise Bank' ? 'block' : 'hidden'} w-full h-full`}>
            <ExcerciseDashboard key="excercise"/>
          </div>
          </AppointmentsContext.Provider>
        </div>
    </div>
  )
}

export default Dashboard

