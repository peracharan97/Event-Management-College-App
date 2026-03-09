import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const resolveEventPrice = (event, user) => {
    const pvpsitPrice = event?.pvpsitPrice ?? event?.price ?? 0;
    const otherCollegePrice = event?.otherCollegePrice ?? event?.price ?? pvpsitPrice;
    return user?.collegeType === 'PVPSIT' ? pvpsitPrice : otherCollegePrice;
};

const StudentDashboard = () => {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [myRegistrations, setMyRegistrations] = useState([]);
    const [stats, setStats] = useState({
        totalRegistrations: 0,
        upcomingEvents: 0,
        paidEvents: 0
    });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [eventsRes, regsRes] = await Promise.all([
                eventService.getUpcomingEvents(),
                eventService.getMyRegistrations()
            ]);

            setUpcomingEvents(eventsRes.data.slice(0, 3)); // Show only 3
            setMyRegistrations(regsRes.data.slice(0, 3)); // Show only 3

            setStats({
                totalRegistrations: regsRes.data.length,
                upcomingEvents: eventsRes.data.length,
                paidEvents: regsRes.data.filter(r => r.paymentStatus === 'PAID').length
            });
        } catch {
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-spinner">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard-container">
            {/* Welcome Section */}
            <div className="welcome-section">
                <h1>Welcome back, {user.fullName}! 👋</h1>
                <p>Here's what's happening with your events</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-value">{stats.totalRegistrations}</div>
                    <div className="stat-label">My Registrations</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🎉</div>
                    <div className="stat-value">{stats.upcomingEvents}</div>
                    <div className="stat-label">Upcoming Events</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">✓</div>
                    <div className="stat-value">{stats.paidEvents}</div>
                    <div className="stat-label">Confirmed Events</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                    <Link to="/events" className="action-btn">
                        <span className="action-icon">🔍</span>
                        <span>Browse Events</span>
                    </Link>
                    <Link to="/my-registrations" className="action-btn">
                        <span className="action-icon">📄</span>
                        <span>My Registrations</span>
                    </Link>
                </div>
            </div>

            {/* Upcoming Events Preview */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2>Upcoming Events</h2>
                    <Link to="/events" className="view-all-link">View All →</Link>
                </div>

                <div className="events-preview">
                    {upcomingEvents.length > 0 ? (
                        upcomingEvents.map(event => (
                            <div key={event.eventId} className="event-preview-card">
                                <div className="event-preview-header">
                                    <h3>{event.title}</h3>
                                    <span className="event-price">
                                        {resolveEventPrice(event, user) === 0 ? 'FREE' : `₹${resolveEventPrice(event, user)}`}
                                    </span>
                                </div>
                                <p className="event-preview-date">
                                    📅 {format(new Date(event.eventDate), 'dd MMM yyyy')} at {event.eventTime}
                                </p>
                                <p className="event-preview-venue">📍 {event.venue}</p>
                                <div className="event-preview-footer">
                                    <span className="seats-left">{event.availableSeats} seats left</span>
                                    <Link to="/events" className="btn btn-sm btn-primary">Register</Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="empty-message">No upcoming events available</p>
                    )}
                </div>
            </div>

            {/* My Recent Registrations */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2>My Recent Registrations</h2>
                    <Link to="/my-registrations" className="view-all-link">View All →</Link>
                </div>

                <div className="registrations-preview">
                    {myRegistrations.length > 0 ? (
                        myRegistrations.map(reg => (
                            <div key={reg.regId} className="registration-preview-card">
                                <div className="reg-preview-header">
                                    <h3>{reg.event.title}</h3>
                                    <span className={`status-badge ${reg.paymentStatus.toLowerCase()}`}>
                                        {reg.paymentStatus}
                                    </span>
                                </div>
                                <p className="reg-preview-date">
                                    📅 {format(new Date(reg.event.eventDate), 'dd MMM yyyy')}
                                </p>
                                <p className="reg-preview-id">Registration ID: #{reg.regId}</p>
                            </div>
                        ))
                    ) : (
                        <p className="empty-message">You haven't registered for any events yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
