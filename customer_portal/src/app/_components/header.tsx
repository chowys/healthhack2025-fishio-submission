"use client";
import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "@/authContext/authContext";
import Image from "next/image";
import { FaUserCircle, FaComments } from "react-icons/fa";

const Header = () => {
  const { user, loading, logout } = useAuth();
  const [openSidebar, setOpenSidebar] = useState(false);

  if (loading) {
    return <div className="h-[10vh]"></div>;
  }

  return (
    <div className="flex justify-between items-center px-16 py-8 bg-white w-full h-[10vh]">

      {/* Hamburger Menu Button */}
      <button
        className="w-[6vw] h-[6vw] md:hidden cursor-pointer"
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        <GiHamburgerMenu className="w-full h-full" />
      </button>

      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center -ml-4">
          <img
            src="\assets\logo\logo.jpg"
            alt="Website Logo"
            className="h-full w-auto max-h-[10vh] object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex justify-between items-center w-fit gap-10 text-lg">
          <Link href="/">Home</Link>
          <Link href="/physio/find_physio">Find Physiotherapist</Link>
          <Link href="/appointment">Appointments</Link>
          {!user && (
            <Link href="/auth/login">
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Message Button */}
        <Link href="/message" className="px-4 py-2 flex items-center gap-2 rounded-lg cursor-pointer hover:bg-gray-300 transition">
          <FaComments className="w-[2rem] h-[2rem] text-gray-600" />
          <span className="text-gray-700 font-medium">Messages</span>
        </Link>

        {/* User Profile or Placeholder */}
        {user ? (
          <div className="flex items-center gap-6">
            <div className="h-[80%] aspect-square max-h-[8vh] rounded-full overflow-hidden">
              <Image
                src={user.photoURL || "/assets/media/default-profile.jpg"}
                alt="User Profile"
                width={100}
                height={100}
                className="h-full w-full object-cover"
              />
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          // Default grey profile icon
          <div className="h-full max-h-[10vh] flex items-center">
            <FaUserCircle className="w-[2rem] h-[2rem] text-gray-600" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;