import { Physio } from "../types";
import { FaStar } from "react-icons/fa";
import { useRouter } from 'next/navigation';

export default function PhysioCard(physio: Physio) {
    const router = useRouter();

    return (
        <div
            className="max-w-lg rounded overflow-hidden shadow-lg p-4 cursor-pointer transform transition duration-300 hover:scale-105"
            onClick={() => 
                // passing the physio id, name, specialisation, ratings, and profilePic_URL as query params since its already retrieved
                router.push(`/physio/${physio.id}`)
            }  
        >
            <img className="w-full h-80 object-cover" src={physio.profilePic_URL} alt={physio.name} />
            <div className="px-6 py-4">
                <h2 className="text-xl font-semibold">{physio.name}</h2>
                <p className="text-gray-700 text-base">{physio.specialisation}</p>
                <div className="flex items-center text-gray-600">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span>{physio.ratings}</span>
                </div>
            </div>
        </div>
    );
}
