"use client"

import React from 'react'
import { useParams } from 'next/navigation'

const page = () => {
    const { appointmentID, recoveryPlanID } = useParams()
  return (
    <div>
        <h1>Appointment ID: {appointmentID}</h1>
        <h1>Recovery Plan ID: {recoveryPlanID}</h1>
    </div>
  )
}

export default page
