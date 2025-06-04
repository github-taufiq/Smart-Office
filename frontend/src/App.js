import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import {AllProvidersWrapper} from './components/AppProviders';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import ParkingDashboard from './pages/ParkingDashboard';
import BookingView from './components/BookingView';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import AttendanceDashboard from './pages/AttendanceDashboard';
import ConferenceBookingHome from './pages/ConferenceBookingHome';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <Navbar/>
                    <main>
                        <Routes>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/register" element={<Register/>}/>
                            <Route
                                path="/*"
                                element={
                                    <ProtectedRoute>
                                        <AllProvidersWrapper>
                                            <Routes>
                                                <Route path="/" element={<Dashboard/>}/>
                                                <Route path="/parking" element={<ParkingDashboard/>}/>
                                                <Route path="/conf-room" element={<BookingView/>}/>
                                                <Route path="/dashboard" element={<AdminDashboard/>}/>
                                                <Route path="/home" element={<Home/>}/>
                                                <Route path="/attendance" element={<AttendanceDashboard/>}/>
                                                <Route path="/conference-booking" element={<ConferenceBookingHome/>}/>
                                            </Routes>
                                        </AllProvidersWrapper>
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;