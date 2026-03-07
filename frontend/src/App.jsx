import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import StudentDashboard from './components/Student/Dashboard';
import EventsList from './components/Student/EventsList';
import MyRegistrations from './components/Student/MyRegistrations';
import AdminDashboard from './components/Admin/AdminDashboard';
import CreateEvent from './components/Admin/CreateEvent';
import EventManagement from './components/Admin/EventManagement';
import QRScanner from './components/Admin/QRScanner';
import Analytics from './components/Admin/Analytics';
import PaymentGateway from './components/Payment/PaymentGateway';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import Profile from './components/Profile/Profile';
import RefundPolicy from './components/Common/RefundPolicy';

const PrivateRoute = ({ children, adminOnly = false }) => {
    const { user } = useAuth();
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    if (adminOnly && user.role !== 'ADMIN') {
        return <Navigate to="/dashboard" />;
    }
    
    return children;
};

function AppRoutes() {
    const { user } = useAuth();
    
    return (
        <div className="app-container">
            <Navbar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<EventsList />} />
                    <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
                    <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
                    
                    {/* Student Routes */}
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            {user?.role === 'ADMIN' ? <AdminDashboard /> : <StudentDashboard />}
                        </PrivateRoute>
                    } />
                    <Route path="/events" element={<EventsList />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/my-registrations" element={
                        <PrivateRoute><MyRegistrations /></PrivateRoute>
                    } />
                    <Route path="/profile" element={
                        <PrivateRoute><Profile /></PrivateRoute>
                    } />
                    <Route path="/payment/:regId" element={
                        <PrivateRoute><PaymentGateway /></PrivateRoute>
                    } />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/create-event" element={
                        <PrivateRoute adminOnly><CreateEvent /></PrivateRoute>
                    } />
                    <Route path="/admin/manage-events" element={
                        <PrivateRoute adminOnly><EventManagement /></PrivateRoute>
                    } />
                    <Route path="/admin/scanner" element={
                        <PrivateRoute adminOnly><QRScanner /></PrivateRoute>
                    } />
                    <Route path="/admin/analytics/:eventId" element={
                        <PrivateRoute adminOnly><Analytics /></PrivateRoute>
                    } />
                </Routes>
            </main>
            <Footer />
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
