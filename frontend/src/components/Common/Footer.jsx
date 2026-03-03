import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>PVPSIT Events</h3>
                    <p>QR-Based Event Management System</p>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/events">Events</Link></li>
                        <li><Link to="/my-registrations">My Registrations</Link></li>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Contact</h4>
                    <p>Email: events@pvpsit.ac.in</p>
                    <p>Phone: +91 123-456-7890</p>
                </div>

                <div className="footer-section">
                    <h4>Follow Us</h4>
                    <div className="social-links">
                        <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="social-icon">Facebook</a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon">Twitter</a>
                        <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="social-icon">Instagram</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2026 PVPSIT College. All rights reserved.</p>
                <p>Made by PVPSIT Students</p>
            </div>
        </footer>
    );
};

export default Footer;
