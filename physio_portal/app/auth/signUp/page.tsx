"use client";

import React from 'react'
import { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { FIREBASE_AUTH } from '@/app/firebase/firebase';
import { useRouter } from 'next/navigation'
import { text } from 'stream/consumers';

const SignUp = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userName, setUserName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e : any) => {
    e.preventDefault()
    if(password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      setLoading(true)
      setError('')
      const userCredentials = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
      await fetch (process.env.NEXT_PUBLIC_BACKEND_URL + '/physioTherapists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          physioTherapist_id : userCredentials.user.uid,
          physioTherapist_name : userName,
          physioTherapist_email : email,
          physioTherapist_profilePic_URL : '', 
          physioTherapist_cert_URL : '', 
          physioTherapist_specialisation : '', 
          ratings : 0, 
        })
      })
      router.push('/')
    } catch (error : any) {
      setError("Failed to sign up, please try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full h-[75vh] p-5 flex justify-center items-center'>
                <div className='w-1/2'>
                  <h1 className=' leading-tight text-8xl xl:text-9xl font-bold text-primary px-5'>Sign up to start your journey</h1>
                </div>
                <form className=' w-[50%] flex flex-col gap-5 justify-center items-center'>
                    <input className='p-5 border-2 w-[100%] xl:w-1/2' type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
                    <input className='p-5 border-2 w-[100%] xl:w-1/2' type='text' value={userName} onChange={(e) => setUserName(e.target.value)} placeholder='Display name' />
                    <input className='p-5 border-2 w-[100%] xl:w-1/2' type='password' value={password} onChange={(e)=> setPassword(e.target.value)} placeholder='Password' />
                    <input className='p-5 border-2 w-[100%] xl:w-1/2' type='password' value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} placeholder='Retype password' />
                    {error != "" ? 
                    <p className='text-red-500'>{error}</p> : null}
                    <div className='flex flex-row gap-5 justify-center items-center w-[50%]'>
                        <button type='button' onClick={handleSignUp} className='bg-primary text-white p-2 rounded-md'>Sign Up</button>
                    </div>
                    <p>Already have an account? 
                        <a className='underline ml-1' href='/auth/login'>
                            Login
                        </a>
                    </p>
                </form>
            </div>
  )
}

export default SignUp