"use client";

import { Physio } from "../../types";
import { Review } from "../../types";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Button from "../../_components/button";
import Carousel from "../../_components/carousel";
import BookingModal from "../../_components/bookingModal";

const PhysioProfile = () => {
  const { physioTherapistId } = useParams();
  const [physio, setPhysio] = useState<Physio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchPhysio = async () => {
      try {
        const res = await fetch(`http://localhost:3000/physioTherapists/${physioTherapistId}`);
        const resReviews = await fetch(`http://localhost:3000/reviews/therapist/${physioTherapistId}`);

        const data = await res.json();
        const reviewData = await resReviews.json();

        if (data) {
          setPhysio({
            id: data.physioTherapist_id,
            name: data.physioTherapist_name,
            email: data.physioTherapist_email,
            profilePic_URL: data.physioTherapist_profilePic_URL,
            cert_URL: data.physioTherapist_cert_URL,
            specialisation: data.physioTherapist_specialisation,
            ratings: data.ratings,
            address: data.physioTherapist_address,
            about: data.physioTherapist_about,
            created_at: new Date(data.created_at),
            updated_at: new Date(data.updated_at),
          });
        }

        if (reviewData.reviews) {
          setReviews(reviewData.reviews);
        }
      } catch (error) {
        console.error("Error fetching physio details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (physioTherapistId) {
      fetchPhysio();
    }
  }, [physioTherapistId]);

  if (loading) return <p className="text-center text-xl">Loading profile...</p>;
  if (!physio) return <p className="text-center text-xl">Physiotherapist not found.</p>;

  return (
    <div className="max-w-full mx-auto p-4 space-y-6">
      {/* Profile Picture */}
      <div
        className="w-full h-[400px] bg-cover bg-center rounded-lg"
        style={{ backgroundImage: `url(${physio.profilePic_URL})`, objectFit: 'cover' }}>
      </div>

      {/* Details Section */}
      <div className="flex justify-between items-start px-20 mb-4">
        {/* Left Side - Header Details */}
        <div className="space-y-2">
          <h1 className="text-7xl font-bold">{physio.name}</h1>
          <p className="text-3xl text-gray-600">{physio.specialisation}</p>
          <p className="text-yellow-500 font-semibold text-2xl">⭐ {physio.ratings}</p>
        </div>

        {/* Right Side - CTA Button */}
        <div className="flex flex-col items-end space-y-7">
          <Button onClick={() => setIsOpen(true)}>Make Booking</Button>

          {/* Contact Info (now falls below the button) */}
          <div className="p-10 bg-gray-200 shadow-md rounded-lg">
            <div className="space-y-2">
              <p className="text-gray-700 text-xl font-medium">📧 {physio.email}</p>
              <p className="text-gray-700 text-xl font-medium">📍 {physio.address}</p>
            </div>
          </div>
        </div>
        <BookingModal isOpen={isOpen} setIsOpen={setIsOpen} physioTherapistId={physioTherapistId as string}/>
      </div>

      {/* About Section */}
      <div className="px-20">
        <h2 className="text-3xl font-semibold mb-4">About</h2>
        <p className="text-gray-800 text-xl">{physio.about}</p>
      </div>

      {/* Reviews Section */}
      <div className="p-20">
        <h2 className="text-2xl font-semibold mb-4">User Reviews</h2>
        {reviews.length > 0 ? (
          <Carousel reviews={reviews} />
        ) : (
          <p className="text-gray-500 text-center">No reviews yet.</p>
        )}
      </div>

    </div>
  );
};

export default PhysioProfile;
