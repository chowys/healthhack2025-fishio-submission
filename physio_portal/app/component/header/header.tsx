import React from 'react'
import Link from 'next/link'
import ProfilePic from './profilePic'
import Navigation from './navigation'
import Image from 'next/image'

function Header() {
    return (
        <div className='w-full h-[10vh] bg-white flex justify-between items-center p-5'>
            <div className="flex items-center gap-8">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image src="/logo/logo.jpg" alt="logo" width={50} height={50} />
                </Link>

                {/* Navigation Links */}
                <Navigation />

            </div>
            <ProfilePic />
        </div>
    )
}

export default Header
