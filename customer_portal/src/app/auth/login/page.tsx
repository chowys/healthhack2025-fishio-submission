"use client";
import Container from '@/app/_components/container'
import React from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { FIREBASE_AUTH } from '@/firebase/firebase'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DefaultBg from '@/app/_components/defaultBg'

const Login = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)


    const handleLogin = async (e: any) => {
        e.preventDefault()
        try {
            setLoading(true)
            setError('')
            await signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
            router.push('/')
        } catch (error: any) {
            setError("Failed to login, please try again")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container>
            <div className='w-full h-[90vh] flex justify-center items-center'>
                <div className="w-full h-full relative overflow-hidden">
                    <DefaultBg />
                    <div className="w-full md:w-[75%] h-full absolute top-0 left-0 flex items-center px-4">
                        <h1 className="leading-tight text-left w-[50%] text-7xl xl:text-8xl font-bold text-primary p-5">
                            Start your recovery journey
                        </h1>
                    </div>
                </div>

                <div className="absolute top-0 right-[16%] bottom-0 flex pt-2 justify-center items-center">
                    <form className='flex flex-col items-center gap-4 w-[100%]'>
                        <input className='p-4 border-2 w-[100%]' type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
                        <input className='p-4 border-2 w-[100%]' type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                        {error != "" ?
                            <p className='text-red-500'>{error}</p> : null}
                        <div className='flex flex-row gap-5 justify-center items-center w-[50%]'>
                            <button type='button' onClick={handleLogin} className='bg-primary text-white py-2 px-6 rounded-md'>Login</button>
                            <button type='button' onClick={() => router.push('/auth/forgetPassword')} className='bg-primary text-white py-2 px-6 whitespace-nowrap rounded-md'>Forget Password?</button>
                        </div>
                        <p>Don't have an account?
                            <a className='underline ml-1 hover:text-blue-500' href='/auth/signUp'>
                                Sign up
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </Container >
    )
}

export default Login;