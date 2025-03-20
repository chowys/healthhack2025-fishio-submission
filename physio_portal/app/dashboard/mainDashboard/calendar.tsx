"use client";

import React from 'react'
import { useEffect, useState, useCallback } from 'react'
import { enGB } from 'date-fns/locale';
import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay, Locale } from 'date-fns';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { AppointmentType, EventType } from '../../interface/interface';
import { useRouter } from 'next/navigation';

type CalendarProps = {
    apppointments: AppointmentType[] | undefined;
}


const CalendarComponent: React.FC<CalendarProps> = ({apppointments}) => {
    const [events, setEvents] = React.useState<EventType[]>([])
    const [openModal, setOpenModal] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<AppointmentType | undefined>(undefined)
    const [view, setView] = useState<View>(Views.MONTH)
    const [date, setDate] = useState(new Date())
    const onNavigate = useCallback(
      (newDate: Date) => {
        return setDate(newDate)
      },
      [setDate]
    )

    const handleOnChangeView = (selectedView: View) => {
        setView(selectedView)
    }
    const locales = { "en-GB": enGB };
    const localizer = dateFnsLocalizer({
    format: (date: Date, formatStr: string, options?: { locale?: Locale }) =>
        format(date, formatStr, { ...options, locale: locales["en-GB"] }),

    parse: (value: string, formatStr: string, options?: { locale?: Locale }) =>
        parse(value, formatStr, new Date(), { ...options, locale: locales["en-GB"] }),

    startOfWeek: (date: Date) => startOfWeek(date, { locale: locales["en-GB"] }),

    getDay: (date: Date) => getDay(date),

    locales,
    });
    // const timeZone = "Asia/Singapore"
    const convertToSGT = (date : number) => {
        return new Date(date * 1000)
    }

    useEffect(() => {
        if (apppointments === undefined) return
        const eventsArr :EventType[] = apppointments.map((appointment) => {
            return {
                appointment_id: appointment.appointment_id,
                title: appointment.appointment_title,
                start: convertToSGT(appointment.start_datetime._seconds),
                end: convertToSGT(appointment.end_datetime._seconds),
            }
        })
        console.log(eventsArr)
        setEvents(eventsArr)
    }, [apppointments])

    const handleSelectEvent = (event: any) => {
        setOpenModal(true)
        const selectedEvent = apppointments?.find((appointment) => appointment.appointment_id === event.appointment_id)
        setSelectedEvent(selectedEvent)
    }

    const handleViewAppointment = () => {
        if (selectedEvent === undefined) return
        const router = useRouter()
        router.push(`/appointment/${selectedEvent.appointment_id}`)
    }

    return (
        <div className='w-1/2 h-[380px] bg-white shadow-xl rounded-lg p-5'>
            <div className='p-5 rounded-lg'>
                <Calendar
                    date={date}
                    onNavigate={onNavigate}
                    localizer={localizer}
                    events={events}
                    view={view}
                    defaultView={Views.MONTH}
                    views={['month', 'week', 'day', 'agenda']}
                    showMultiDayTimes
                    style={{ height: 300 }}
                    popup
                    onSelectEvent={handleSelectEvent}
                    onView={handleOnChangeView}
                />
            </div>
            {openModal && selectedEvent && (
                <div className='fixed top-0 left-0 w-screen h-screen bg-(--customOverlay) z-50 flex justify-center items-center'>
                    <div className='bg-white p-5 rounded-lg'>
                        <h1 className='text-2xl text-white font-white rounded-lg bg-(--primary) p-5'>{selectedEvent.appointment_title}</h1>
                        <div className=' mt-5 flex flex-col gap-5'>
                            <p className='font-bold'>Start date:  
                                <span className=' font-medium'>{' ' + (convertToSGT(selectedEvent.start_datetime._seconds)).toString()}</span>
                            </p>
                            <p className='font-bold'>End date:  
                                <span className=' font-medium'>{' ' + (convertToSGT(selectedEvent.end_datetime._seconds)).toString()}</span>
                            </p>
                            <p className='font-bold'>Patient ID:  
                                <span className=' font-medium'>{' ' + selectedEvent.patient.user_name}</span>
                            </p>
                            <p className='font-bold'>Patient email:  
                                <span className=' font-medium'>{' ' + selectedEvent.patient.user_email}</span>
                            </p>
                            <div className='w-full'>
                                <p className='font-bold'>Description:</p>
                                <div className='bg-(--lightGrey) p-5 rounded-lg w-full h-min-[200px]'>
                                    <p>{selectedEvent.appointment_description}</p>
                                </div>
                            </div>
                        </div>
                        <div className=' mt-5 flex gap-5 justify-between items-center'>
                            <button onClick={() => setOpenModal(false)}>Close</button>
                            <button onClick={handleViewAppointment}>View appointment details</button>
                        </div>
                    </div>
                </div>
            )} 
        </div>
    )
}

export default CalendarComponent