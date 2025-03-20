import React, { useState, useRef } from "react";
import { Review } from "../types";

const Carousel = ({ reviews }: { reviews: Review[] }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (carouselRef.current) {
      e.preventDefault();
      setIsDragging(true);
      setStartX(e.pageX - carouselRef.current.offsetLeft);
      setScrollLeft(carouselRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const move = (x - startX) * 1.8; // Adjust drag sensitivity
    carouselRef.current.scrollLeft = scrollLeft - move;
  };

  return (
    <section className="relative h-[60vh] bg-[#075540] flex items-center justify-center">
      <div
        ref={carouselRef}
        className="relative w-full max-w-[80vw] overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing flex justify-start scroll-pl-[40px]"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="inline-flex gap-6 px-5 min-w-max h-[40vh] pl-[50px]">
          {reviews.map((review, index) => (
            <ReviewCard review={review} key={index} />
          ))}
        </div>
      </div>
    </section>

  );
};

const ReviewCard = ({ review }: { review: any }) => {
  return (
    <div className="w-[500px] p-8 bg-white rounded-lg shadow-lg overflow-hidden">
      <p className="text-gray-800 text-2xl italic break-words">
        "{review.review_description}"
      </p>
      <p className="text-gray-600 text-md font-medium mt-2 truncate">
        - {review.user_id}
      </p>
      <p className="text-yellow-300 font-semibold text-2xl">⭐ {review.review_rating}</p>
    </div>
  );
};

export default Carousel;
