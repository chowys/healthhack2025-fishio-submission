"use client"

import React from 'react'
import { useAuth } from '@/app/authContext/authContext'
import { signOut } from 'firebase/auth'
import { FIREBASE_AUTH } from '@/app/firebase/firebase'
import Link from 'next/link'
import { deleteCookie } from 'cookies-next'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'


const Navigation = () => {
    const [showMenu, setShowMenu] = useState(false)
    const { user } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const auth = FIREBASE_AUTH
    const handleLogOut = async () => {
        try {
            await signOut(auth)
            deleteCookie('physiotoken')
            router.push('/')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setShowMenu(false)
    }, [pathname]);

    useEffect(() => {
        const handleResize = () => {
            if (window.matchMedia("(min-width: 768px)").matches) {
                setShowMenu(false);
            }
        };
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

  return (
    <div className="flex justify-center items-center gap-5 text-black">
        <Link href={'/'} className='p-5'>Home</Link>
        {user ? 
        <Link href={'/dashboard'} className='p-5'>Dashboard</Link> 
        : null}
        <Link href={''} className='p-5'>About</Link>
        <Link href={''} className='p-5'>Contact</Link>
        {!user ?
        <Link href={'auth/login'} className='p-5'>Login</Link>
        :
        <div className=' cursor-pointer p-5' onClick={handleLogOut}>Logout</div>
        }
    </div>
  )
}

export default Navigation
