"use client"

import React from 'react'
import { useAuth } from '@/app/authContext/authContext'
import Image from 'next/image'
import { MdPerson } from "react-icons/md";
import { useRouter } from 'next/navigation';

const ProfilePic = () => {
    const { user } = useAuth()
    const router = useRouter()
    return (
        <div className='w-fit h-fit'>
            {user ? 
                <div onClick={() => router.push('/profile')} className='w-[40px] h-[40px] rounded-full overflow-hidden cursor-pointer'>
                    <MdPerson className='w-[40px] h-[40px]'/>
                </div> 
            :  
                null
            }
        </div>
    )
}

export default ProfilePic
