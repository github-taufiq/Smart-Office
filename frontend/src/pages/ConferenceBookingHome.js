import React, { useState } from 'react';

const ConferenceBookingHome = () => {
    const [offices] = useState([
        { id: 1, name: 'Bangalore EC' },
        { id: 2, name: 'Chennai Taramani' },
        { id: 3, name: 'Pune' },
        { id: 4, name: 'Jaipur World' },
        { id: 5, name: 'Noida' },
    ]);
    const [selectedOfficeId, setSelectedOfficeId] = useState('');
    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleOfficeSelect = async () => {
        const availableRes = await fetch('http://localhost:8083/api/bookings/available-rooms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ officeId: selectedOfficeId, date, startTime, endTime })
        });
        if (availableRes.ok) {
            const availableRooms = await availableRes.json();
            setRooms(availableRooms);
        } else {
            setRooms([]);
            alert('Failed to fetch available rooms.');
        }
    };

    const handleBookRoom = async () => {
        const bookingRequest = {
            roomId: selectedRoomId,
            officeId: selectedOfficeId,
            date,
            startTime,
            endTime
        };

        const res = await fetch('http://localhost:8083/api/bookings/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingRequest)
        });

        if (res.ok) {
            alert('Room successfully booked!');
        } else {
            alert('Booking failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
                <h1 className="text-3xl font-bold text-center text-blue-700">Conference Room Booking</h1>

                {/* Office Selection */}
                <div className="space-y-2">
                    <label className="block text-gray-700 font-semibold">Select Office</label>
                    <select
                        value={selectedOfficeId}
                        onChange={e => setSelectedOfficeId(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">-- Select Office --</option>
                        {offices.map(office => (
                            <option key={office.id} value={office.id}>{office.name}</option>
                        ))}
                    </select>
                </div>

                {/* Date and Time Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Start Time</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={e => setStartTime(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">End Time</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={e => setEndTime(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>

                {/* Get Rooms Button */}
                <div className="text-center">
                    <button
                        onClick={handleOfficeSelect}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow-md transition duration-200"
                    >
                        Get Available Rooms
                    </button>
                </div>

                {/* Room Selection */}
                {rooms.length > 0 && (
                    <div className="pt-4 border-t border-gray-300 space-y-4">
                        <label className="block text-gray-700 font-semibold">Select Room</label>
                        <select
                            value={selectedRoomId}
                            onChange={e => setSelectedRoomId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            <option value="">-- Select Room --</option>
                            {rooms.map(room => (
                                <option key={room.id} value={room.id}>
                                    {room.name} (Capacity: {room.capacity})
                                </option>
                            ))}
                        </select>

                        <div className="text-center">
                            <button
                                onClick={handleBookRoom}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md shadow-md transition duration-200"
                            >
                                Book Room
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConferenceBookingHome;