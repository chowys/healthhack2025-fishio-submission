"use client";

import React from 'react'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { FIREBASE_AUTH } from '@/app/firebase/firebase';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const Login = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)


    const handleLogin = async (e : any) => {
    e.preventDefault()
        try {
            setLoading(true)
            setError('')
            const userResponse = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/physioTherapists/email/${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (!userResponse.ok) {
                throw new Error('Failed to fetch user data')
            }
            const userDataJson = await userResponse.json();
            const userData = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
            console.log(userData)
            router.push('/')
            localStorage.setItem("user", userDataJson.physioTherapist_id);
            console.log("hiiii", localStorage.getItem('user'))
        } catch (error : any) {
            setError("Failed to login, please try again")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full min-h-screen p-5 flex justify-center items-center'>
            <h1 className=' leading-tight w-[50%] text-7xl xl:text-9xl  font-bold text-primary p-5'>Login to start your recovery journey</h1>
            <form className=' w-[50%] flex flex-col gap-5 justify-center items-center'>
                <input className='p-5 border-2 w-[100%] xl:w-1/2 ' type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
                <input className='p-5 border-2 w-[100%] xl:w-1/2' type='password' value={password} onChange={(e)=> setPassword(e.target.value)} placeholder='Password' />
                {error != "" ? 
                <p className='text-red-500'>{error}</p> : null}
                <div className='flex flex-row gap-5 justify-center items-center w-[50%]'>
                    <button type='button' onClick={handleLogin} className='bg-primary text-white p-2 rounded-md'>Login</button>
                    <button type='button' onClick={() => router.push('/auth/forgetPassword')} className='bg-primary text-white p-2 rounded-md'>Forget password</button>
                </div>
                <p>Don't have an account? 
                    <a className='underline ml-1' href='/auth/signUp'>
                        Sign up
                    </a>
                </p>
            </form>
        </div>
  )
}

export default Login