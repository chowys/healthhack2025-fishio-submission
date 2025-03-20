import React from 'react'
import Link from 'next/link'
import { ImCross } from "react-icons/im";

interface SidebarProps {
    isOpen: boolean
    setOpenSidebar: (value: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setOpenSidebar }) => {
  return (
    <div className={`h-screen w-[100vw] fixed top-0 left-0 z-50 ${isOpen ? " visible" : " invisible"}`}>
        <div className='w-full h-full bg-customOverlay' onClick={() => setOpenSidebar(false)}></div>
        <div className={` ${isOpen ? "translate-x-0" : "-translate-x-[100vw]"} 
        flex flex-col justify-start items-center h-full w-[75%] bg-primary z-[55] transition-transform duration-300 ease-in-out delay-300 absolute top-0 left-0`}>
            <div className='w-full p-4'>
            <button className='w-5 h-5 text-white hover:text-black' onClick={() => setOpenSidebar(false)}>
                <ImCross className='w-full h-full' />
            </button>
            </div>
            <div className='flex flex-col justify-center items-start w-full gap-4 text-white text-3xl font-bold p-10'>
                <Link className='hover:text-black' href='/'>
                    Home
                </Link>
                <Link className='hover:text-black'  href='/about'>
                    About
                </Link>
                <Link className='hover:text-black' href='/contact'>
                    Contact
                </Link>
                <Link className='hover:text-black' href='/auth/login'>
                    Login
                </Link>
            </div>
        </div>
    </div>
  )
}

export default Sidebar
