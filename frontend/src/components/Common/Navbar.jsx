import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <span className="logo-icon">🎓</span>
                    PVPSIT Events
                </Link>

                <div className="nav-menu">
                    <Link to="/events" className="nav-link">Events</Link>
                    
                    {user ? (
                        <>
                            {user.role === 'ADMIN' ? (
                                <>
                                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                                    <Link to="/admin/create-event" className="nav-link">Create Event</Link>
                                    <Link to="/admin/manage-events" className="nav-link">Manage Events</Link>
                                    <Link to="/admin/scanner" className="nav-link">Scanner</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/my-registrations" className="nav-link">My Registrations</Link>
                                </>
                            )}
                            
                            <div className="nav-user">
                                <span>{user.fullName}</span>
                                <button onClick={handleLogout} className="btn-logout">Logout</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
