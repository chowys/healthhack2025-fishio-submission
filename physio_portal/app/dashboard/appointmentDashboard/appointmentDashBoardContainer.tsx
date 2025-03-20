"use client"

import React, { use } from 'react'
import { useContext } from 'react'
import { AppointmentsContext } from '../page'
import { useEffect, useState } from 'react'
import { AppointmentType } from '../../interface/interface'
import Loading from '@/app/component/loading/loading'
import { useRouter } from 'next/navigation'

const AppointmentDashboardContainer = () => {
    const {sidePanelButton} = useContext(AppointmentsContext) || {}
    const { acceptedAppointments, pendingAppointments, CompletedAppointments } = useContext(AppointmentsContext) || {}
    const [allAppointments, setAllAppointments] = useState<AppointmentType[] | undefined> ([])
    const [searchAppointments, setSearchAppointments] = useState<AppointmentType[] | undefined> ([])
    const [advancedOptions, setAdvancedOptions] = useState(false)
    const statusOptions = ['accepted', 'pending', 'completed', 'cancelled']
    const [selectedStatus, setSelectedStatus] = useState(statusOptions)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const router = useRouter()

    useEffect(() => {
        if (acceptedAppointments && pendingAppointments && CompletedAppointments) {
            setAllAppointments([...acceptedAppointments, ...pendingAppointments, ...CompletedAppointments])
            setSearchAppointments([...acceptedAppointments, ...pendingAppointments, ...CompletedAppointments])
            setLoading(false)
        }
    }, [acceptedAppointments, pendingAppointments, CompletedAppointments])

    useEffect(() => {
        let filteredAppointments = allAppointments
        //fiter by status first
        filteredAppointments = filteredAppointments?.filter(appointment => selectedStatus.includes(appointment.appointment_status)) || []
        if (search != '') {
            filteredAppointments = filteredAppointments?.filter(appointment => 
                appointment.appointment_title?.toLowerCase().includes(search.toLowerCase()) || 
                appointment.appointment_id.toLowerCase().includes(search.toLowerCase()) ||
                appointment.patient.user_name.toLowerCase().includes(search.toLowerCase())) || []
        }
        setSearchAppointments(filteredAppointments)
    }  , [search, selectedStatus])

    const handleStatusChange = (status: string) => {
        setSelectedStatus((prev: string[]) => 
            prev.includes(status) 
                ? prev.filter((item) => item !== status) 
                : [...prev, status] 
        );
    };

    useEffect(() => {
        if (sidePanelButton !== 'Appointments') {
            setAdvancedOptions(false)
            setSelectedStatus(statusOptions)
            setSearch('')
        }
    }, [sidePanelButton])

    const handleSelectAllStatus = () => {
        setSelectedStatus(statusOptions)
    }

    return (
        <div className='w-full min-h-screen rounded-lg'>
            <div className='w-full h-full rounded-lg'>
                <div className='w-full h-[50px] flex mb-5 gap-5 relative'>
                    <div className='w-5/6 h-full mb-3 bg-white rounded-lg '>
                        <input value={search} onChange={(e) => setSearch(e.target.value)} type='text' placeholder='Search for appointments' className='w-full h-full p-2 focus:outline-0 ' />
                    </div>
                    <div onClick={() => setAdvancedOptions(!advancedOptions)} className='w-1/6 h-full customButton flex justify-center items-center '>
                        Advanced Options
                    </div>
                    <div className={`w-1/2 h-fit overflow-hidden absolute top-[110%] right-0 z-30 rounded-lg ${advancedOptions ? 'visible': ' invisible' } pb-10 px-5`}>
                        <div className={`w-full h-full flex gap-5 shadow-xl ${advancedOptions ? 'visible translate-y-0 opacity-100' : ' invisible opacity-0 -translate-y-full'} transition-all duration-500 ease-in-out`}>
                            <div className='w-full h-full bg-white border-4 border-(--primary) rounded-lg p-5 flex flex-col gap-5'>
                                <div className='w-full h-fit flex flex-col gap-5 justify-center'>
                                    <div className='w-full'>
                                        <span className='font-bold text-xl'>Filter by status:</span>
                                    </div>
                                    <div className='w-full'>
                                        <ul className='w-full flex gap-5 '>
                                            {statusOptions.map((status) => {
                                                return (
                                                    <div key={status} className='w-full flex gap-2 items-center text-lg'>   
                                                        <input type='checkbox' checked={selectedStatus.includes(status)} onChange={() => handleStatusChange(status)}
                                                        className="w-5 h-5 bg-gray-200 border-gray-300 rounded focus:ring focus:ring-(--primary) accent-(--primary) rounde-lg hover:accent-black" />
                                                        <span>{status.toUpperCase()}</span>
                                                    </div>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                    <div className='flex gap-5'>
                                        <div className='w-fit'>
                                            <div onClick={handleSelectAllStatus} className='w-full customButton'>Select All</div>
                                        </div>
                                        <div className='w-fit'>
                                            <div onClick={() => setSelectedStatus([])} className='w-full customButton'>Clear All</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {loading ? <Loading />
                :
                <div className='w-full min-h-screen flex flex-col gap-5 bg-white rounded-lg overflow-y-auto p-5'>
                    {searchAppointments?.map((appointment : AppointmentType) => {
                        return (
                            <div onClick={() => router.push(`/appointment/${appointment.appointment_id}`)} key={appointment.appointment_id} className='w-full h-fit p-5 bg-white border-2 border-(--primary) text-black rounded-lg shadow-xl hover:scale-[101%] hover:bg-(--primary) hover:text-white transition-all duration-500 ease-in-out cursor-pointer'>
                                <div className='w-full flex justify-between items-center gap-2'>
                                    <div className='w-full text-xl font-bold mb-2'>
                                        <span>{appointment.appointment_title}</span>
                                    </div>
                                    <div className='w-full text-end'>
                                        <span className='mr-2 font-bold'>Appointment ID:</span>
                                        <span>{appointment.appointment_id}</span>
                                    </div>
                                </div>
                                <div className='flex'>
                                    <div className='w-2/3'>
                                        <div className='w-full'>
                                            <span className='mr-2 font-bold'>Appointment start date:</span>
                                            <span>{(new Date(appointment.start_datetime._seconds * 1000)).toString()}</span>
                                        </div>
                                        <div className='w-full'>
                                            <span className='mr-2 font-bold'>Appointment end date:</span>
                                            <span>{(new Date(appointment.end_datetime._seconds * 1000)).toString()}</span>
                                        </div>
                                        <div className='w-full'>
                                            <span className='mr-2 font-bold'>Patient name:</span>
                                            <span>{appointment.patient.user_name}</span>
                                        </div>
                                    </div>
                                    <div className='w-1/3 flex justify-end items-center'>
                                        <div className={`w-fit rounded-lg p-2 text-black font-bold ${
                                            appointment.appointment_status === "accepted"
                                            ? "bg-green-500"
                                            : appointment.appointment_status === "pending"
                                            ? "bg-yellow-500"
                                            : appointment.appointment_status === "completed"
                                            ? "bg-blue-500"
                                            : "bg-red-500"
                                        }`}>
                                            <span>{(appointment.appointment_status).toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                }
            </div>
        </div>
    )
    }

export default AppointmentDashboardContainer
