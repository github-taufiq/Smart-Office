import React, { useEffect, useState } from 'react';

const AttendanceDashboard = () => {
    const [status, setStatus] = useState('');
    const [history, setHistory] = useState([]);

    const handleCheckIn = async () => {
        const res = await fetch('/attendance/checkin', { method: 'POST' });
        if (res.ok) setStatus('Checked In');
    };

    const handleCheckOut = async () => {
        const res = await fetch('/attendance/checkout', { method: 'POST' });
        if (res.ok) setStatus('Checked Out');
    };

    useEffect(() => {
        fetch('/attendance/history')
            .then(res => res.json())
            .then(data => setHistory(data));
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Attendance</h1>
            <div className="space-x-2">
                <button onClick={handleCheckIn} className="bg-green-500 px-4 py-2 text-white rounded">Check In</button>
                <button onClick={handleCheckOut} className="bg-red-500 px-4 py-2 text-white rounded">Check Out</button>
            </div>
            <p className="mt-2">Status: {status}</p>
            <h2 className="text-lg font-semibold mt-6">History</h2>
            <ul className="list-disc ml-6">
                {history.map((h, i) => <li key={i}>{h.date} - {h.status}</li>)}
            </ul>
        </div>
    );
};

export default AttendanceDashboard;