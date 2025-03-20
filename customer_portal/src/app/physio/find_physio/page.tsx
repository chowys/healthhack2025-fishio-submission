"use client";

import { useState, useEffect } from "react";
import PhysioCard from "../../_components/physioCard";
import { Physio } from "../../types";

export default function FindPhysios() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [physios, setPhysios] = useState<Physio[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [specializationFilter, setSpecializationFilter] = useState<string>("");
    const [ratingsFilter, setRatingsFilter] = useState<number | null>(null);

    useEffect(() => {
        const fetchPhysios = async () => {
            try {
                const res = await fetch("http://localhost:3000/physioTherapists");
                const data = await res.json();

                if (data && data.physioTherapists) {
                    setPhysios(
                        data.physioTherapists.map((physio: any) => ({
                            id: physio.physioTherapist_id,
                            name: physio.physioTherapist_name,
                            specialisation: physio.physioTherapist_specialisation,
                            ratings: physio.ratings,
                            profilePic_URL: physio.physioTherapist_profilePic_URL
                        }))
                    );
                } else {
                    setPhysios([]);
                }
            } catch (error) {
                console.error("Error fetching physios:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPhysios();
    }, []);

    // Filter physios based on search query, specialization, and ratings
    const filteredPhysios = physios.filter((physio) => {
        const matchesSearchQuery =
            physio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            physio.specialisation.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSpecializationFilter =
            specializationFilter
                ? physio.specialisation.toLowerCase().includes(specializationFilter.toLowerCase())
                : true;

        const matchesRatingsFilter =
            ratingsFilter !== null ? !isNaN(Number(physio.ratings)) && Number(physio.ratings) >= ratingsFilter : true;

        return matchesSearchQuery && matchesSpecializationFilter && matchesRatingsFilter;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-teal-500 to-[#075540] text-white p-12 rounded-xl mb-8">
                <h1 className="text-4xl md:text-6xl font-semibold text-center mb-6">
                    Our Physiotherapists
                </h1>
                <p className="text-lg text-center">
                    Find the best physiotherapists near you. Search by name, specialization, or rating.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filter */}
                <div className="md:w-1/4 bg-gray-100 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Filter Physiotherapists</h3>

                    {/* Specialization Filter */}
                    <div className="mb-4">
                        <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
                        <input
                            type="text"
                            id="specialization"
                            value={specializationFilter}
                            onChange={(e) => setSpecializationFilter(e.target.value)}
                            placeholder="Search specialization"
                            className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-[#075540]"
                        />
                    </div>

                    {/* Rating Filter */}
                    <div className="mb-4">
                        <label htmlFor="ratings" className="block text-sm font-medium text-gray-700">Minimum Rating</label>
                        <input
                            type="number"
                            id="ratings"
                            min="0"
                            max="5"
                            value={ratingsFilter || ""}
                            onChange={(e) => setRatingsFilter(e.target.value ? Number(e.target.value) : null)}
                            placeholder="Filter by rating"
                            className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-[#075540]"
                        />
                    </div>
                </div>

                {/* Search Results */}
                <div className="flex-1">
                    {/* Search Bar */}
                    <div className="flex justify-center mb-6 px-4">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search physiotherapist"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full p-3 pl-12 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#075540] focus:ring-opacity-75 shadow-lg transition-all duration-200"
                            />
                            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35" />
                            </svg>
                        </div>
                    </div>

                    {/* Loading and Results */}
                    {loading ? (
                        <div className="text-center">
                            <p className="text-xl font-medium text-gray-600 mb-4">Loading physiotherapists...</p>
                            <div className="mt-4 animate-spin h-8 w-8 border-t-2 border-[#075540] border-solid rounded-full mx-auto"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPhysios.length > 0 ? (
                                filteredPhysios.map((physio) => (
                                    <PhysioCard key={physio.id} {...physio} />
                                ))
                            ) : (
                                <p className="text-center text-xl text-gray-500 col-span-3">No physiotherapists found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
