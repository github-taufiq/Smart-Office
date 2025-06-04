import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="p-8 space-y-8">
            <div className="border rounded p-4 shadow">
                <h2 className="text-xl font-bold">Smart Parking</h2>
                <p className="text-gray-500">Coming soon</p>
            </div>
            <div
                className="border rounded p-4 shadow cursor-pointer bg-blue-100"
                onClick={() => navigate('/conference-booking')}
            >
                <h2 className="text-xl font-bold">Conference Room Booking</h2>
                <p className="text-green-600 font-semibold">Book Now</p>
            </div>
            <div
                className="border rounded p-4 shadow cursor-pointer bg-green-100"
                onClick={() => navigate('/attendance')}
            >
                <h2 className="text-xl font-bold">Attendance Sheet</h2>
                <p className="text-green-600 font-semibold">View & Mark Attendance</p>
            </div>
        </div>
    );
};

export default Home;