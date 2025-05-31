import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ParkingDashboard from './pages/ParkingDashboard'; // Import the actual component
import { ParkingProvider } from './context/ParkingContext'; // Import the context provider

const Home = () => (
  <div className="container mt-4">
    <h2>Parking Management System</h2>
    <p>Welcome to the parking management system!</p>
  </div>
);

const AddParking = () => (
  <div className="container mt-4">
    <h2>Add Parking</h2>
    <p>Add parking functionality coming soon...</p>
  </div>
);

const Reports = () => (
  <div className="container mt-4">
    <h2>Reports</h2>
    <p>This is the reports page.</p>
  </div>
);

const Navigation = () => (
  <div>
  <div className="text-center mb-4">
      <h1 className="display-4 text-primary mb-2">Smart Office</h1>
      <hr className="w-50 mx-auto mb-4" />
    </div>
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container">
      <a className="navbar-brand" href="/">Parking System</a>
      <div className="navbar-nav">
        <a className="nav-link" href="/">Home</a>
        <a className="nav-link" href="/parking">Parking</a>
        <a className="nav-link" href="/add-parking">Add Parking</a>
        <a className="nav-link" href="/reports">Reports</a>
      </div>
    </div>
  </nav>
  </div>
);

function App() {
  return (
    <ParkingProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/parking" element={<ParkingDashboard />} />
            <Route path="/add-parking" element={<AddParking />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </Router>
    </ParkingProvider>
  );
}

export default App;