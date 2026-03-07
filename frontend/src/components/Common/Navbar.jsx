import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import pvpsitLogo from '../../images/pvpsit.png';

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
                <div className="nav-top">
                    <Link to="/" className="nav-logo">
                        <img src={pvpsitLogo} alt="PVPSIT Logo" className="nav-logo-image" />
                        <div className="nav-logo-text">
                            <span className="nav-logo-title">Prasad V. Potluri Siddhartha Institute of Technology (Autonomous)</span>
                            <span className="nav-logo-subtitle">Approved by AICTE and Affiliated to JNTU Kakinada</span>
                            <span className="nav-logo-subtitle">Sponsored By: Siddhartha Academy of General and Technical Education, Vijayawada</span>
                        </div>
                    </Link>
                </div>

                <div className="nav-bottom">
                    <div className="nav-links">
                        <Link to="/events" className="nav-link">Events</Link>

                        {user?.role === 'ADMIN' ? (
                            <>
                                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                                <Link to="/profile" className="nav-link">Profile</Link>
                                <Link to="/admin/create-event" className="nav-link">Create Event</Link>
                                <Link to="/admin/manage-events" className="nav-link">Manage Events</Link>
                                <Link to="/admin/scanner" className="nav-link">Scanner</Link>
                            </>
                        ) : user ? (
                            <>
                                <Link to="/profile" className="nav-link">Profile</Link>
                                <Link to="/my-registrations" className="nav-link">My Registrations</Link>
                            </>
                        ) : null}
                    </div>

                    <div className="nav-user-area">
                        {user ? (
                            <div className="nav-user">
                                <span>{user.fullName}</span>
                                <button onClick={handleLogout} className="btn-logout">Logout</button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="nav-link">Login</Link>
                                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
