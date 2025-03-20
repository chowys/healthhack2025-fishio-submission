"use client"

import React from 'react'
import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebase/firebase';
import { setCookie, deleteCookie } from 'cookies-next';

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children } : { children: ReactNode}) => {
    const auth = FIREBASE_AUTH
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false)
            const currentUserToken = currentUser?.getIdToken()
            if (currentUserToken) {
                setCookie('physiotoken', currentUserToken)
            } else {
                deleteCookie('physiotoken')
            }
        })

        return () => unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}


