import React, { useEffect, useState } from 'react';

const ConferenceBookingHome = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch('/conference/rooms')
      .then(res => res.json())
      .then(setRooms);

    fetch('/conference/bookings')
      .then(res => res.json())
      .then(setBookings);
  }, []);

  const handleBook = async (roomId) => {
    const res = await fetch('/conference/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, time: new Date().toISOString() })
    });
    if (res.ok) alert('Room booked!');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Conference Room Booking</h1>
      <h2 className="text-lg font-semibold">Available Rooms</h2>
      <ul className="list-disc ml-6 mb-6">
        {rooms.map(room => (
          <li key={room.id}>
            {room.name} - Capacity: {room.capacity}
            <button onClick={() => handleBook(room.id)} className="ml-4 bg-blue-500 px-2 py-1 text-white rounded">Book</button>
          </li>
        ))}
      </ul>
      <h2 className="text-lg font-semibold">Your Bookings</h2>
      <ul className="list-disc ml-6">
        {bookings.map(b => (
          <li key={b.id}>{b.roomName} at {b.time}</li>
        ))}
      </ul>
    </div>
  );
};

export default ConferenceBookingHome;