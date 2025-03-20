"use client"

import React from 'react'
import { useState, useEffect } from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { FaCalendarAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { MdPayment } from "react-icons/md";
import { MdPerson } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { PiBankFill } from "react-icons/pi";

interface SidePanelProps {
    navigateFunction: (dashboardNavigation : any) => void
}

const SidePanel: React.FC<SidePanelProps> = ({navigateFunction}) => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div>
            <div className={`bg-white p-5 border-r-2 border-(--lightGrey) ${isOpen? 'w-[20vw]' : 'w-[70px]'} transition-all duration-500 ease-in-out h-full`}>
                <div onClick={() => setIsOpen(!isOpen)} className='text-2xl cursor-pointer mb-7 w-full flex justify-start items-center'>
                    {isOpen ? <ImCross/> : <GiHamburgerMenu/>}
                </div>
                <div className={`flex flex-col gap-3 ${isOpen? 'visible opacity-100 delay-500' : 'invisible opacity-0'} transition-opacity duration-500 ease-in-out`}>
                    <div onClick={() => navigateFunction('Dashboard')} className='customSidePanelButton'>
                        <MdDashboard/>
                        <span className=''>Dashboard</span>
                    </div>
                    <div onClick={() => navigateFunction('Appointments')} className='customSidePanelButton'>
                        <FaCalendarAlt/>
                        <span className=''>Appointments</span>
                    </div>
                    <div className='customSidePanelButton'>
                        <MdPayment/>
                        <span className=''>Payment</span>
                    </div>
                    <div onClick={() => navigateFunction('Excercise Bank')} className='customSidePanelButton'>
                        <PiBankFill/>
                        <span className=''>Excercise bank</span>
                    </div>
                    <div onClick={() => router.push('/profile')} className='customSidePanelButton'>
                        <MdPerson/>
                        <span className=''>Profile</span>
                    </div>
                </div>
            </div>
        </div>
    )
    }

export default SidePanel
