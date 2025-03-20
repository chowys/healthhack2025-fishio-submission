"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface BookingModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  physioTherapistId: string;
}

const BookingModal = ({ isOpen, setIsOpen, physioTherapistId }: BookingModalProps) => {
  const [formData, setFormData] = useState({
    physioTherapist_id: physioTherapistId,
    user_id: "1ZRIipkHL1Nx3ZiQuk6W9kd2zx43",
    physioClinic_id: "",
    booking_description: "",
    booking_date: "",
    booking_status: "ongoing",
  });

  const [bookedDates, setBookedDates] = useState<string[]>([]);

  // Fetch booked dates for the physiotherapist to block out on the calender for booking
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const resAppts = await fetch(
          `http://localhost:3000/appointments/getBookedDatesByPhysio/${physioTherapistId}`
        );
        const data = await resAppts.json();
        console.log(data);
        
        if (Array.isArray(data.bookedDates)) {
          setBookedDates(data.bookedDates);
        }
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      }
    };

    if (physioTherapistId) {
      fetchBookedDates();
    }
  }, [physioTherapistId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.physioTherapist_id || !formData.user_id || !formData.booking_date) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/booking/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Booking successfully created!");
        setIsOpen(false);
      } else {
        alert("Failed to create booking.");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#075540] text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <h3 className="text-2xl font-bold text-center mb-4">Book a Session</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                name="booking_description"
                placeholder="Booking Description (optional)"
                value={formData.booking_description}
                onChange={handleChange}
                className="w-full p-2 rounded text-black"
              />
              <input
                type="date"
                name="booking_date"
                value={formData.booking_date}
                onChange={handleChange}
                required
                className="w-full p-2 rounded text-black"
                min={new Date().toISOString().split("T")[0]} // Restrict past dates
                onFocus={(e) => e.target.showPicker?.()} // Ensure calendar popup
              />
              <p className="text-red-500 text-sm">{bookedDates.includes(formData.booking_date) ? "This date is fully booked." : ""}</p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`w-full py-2 rounded font-semibold transition-opacity ${bookedDates.includes(formData.booking_date) ? "bg-gray-400 cursor-not-allowed" : "bg-white hover:opacity-90 text-[#075540]"}`}
                  disabled={bookedDates.includes(formData.booking_date)}
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
