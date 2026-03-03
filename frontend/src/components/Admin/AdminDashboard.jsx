import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { format } from 'date-fns';

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({
        totalEvents: 0,
        totalRegistrations: 0,
        totalRevenue: 0,
        upcomingEvents: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await eventService.getAllEvents();
            const eventsData = response.data;
            setEvents(eventsData.slice(0, 5)); // Show latest 5

            // Calculate stats
            const totalRegs = eventsData.reduce((sum, e) => sum + e.totalRegistrations, 0);
            const totalRev = eventsData.reduce((sum, e) => sum + (e.price * e.totalRegistrations), 0);
            const upcoming = eventsData.filter(e => new Date(e.eventDate) >= new Date()).length;

            setStats({
                totalEvents: eventsData.length,
                totalRegistrations: totalRegs,
                totalRevenue: totalRev,
                upcomingEvents: upcoming
            });
        } catch (error) {
            console.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-spinner">Loading admin dashboard...</div>;
    }

    return (
        <div className="admin-dashboard-container">
            {/* Admin Header */}
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Manage events and monitor system performance</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card admin-stat">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-value">{stats.totalEvents}</div>
                    <div className="stat-label">Total Events</div>
                </div>

                <div className="stat-card admin-stat">
                    <div className="stat-icon">👥</div>
                    <div className="stat-value">{stats.totalRegistrations}</div>
                    <div className="stat-label">Total Registrations</div>
                </div>

                <div className="stat-card admin-stat">
                    <div className="stat-icon">💰</div>
                    <div className="stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
                    <div className="stat-label">Total Revenue</div>
                </div>

                <div className="stat-card admin-stat">
                    <div className="stat-icon">📅</div>
                    <div className="stat-value">{stats.upcomingEvents}</div>
                    <div className="stat-label">Upcoming Events</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="admin-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                    <Link to="/admin/create-event" className="action-btn admin-action">
                        <span className="action-icon">➕</span>
                        <span>Create Event</span>
                    </Link>
                    <Link to="/admin/manage-events" className="action-btn admin-action">
                        <span className="action-icon">📋</span>
                        <span>Manage Events</span>
                    </Link>
                    <Link to="/admin/scanner" className="action-btn admin-action">
                        <span className="action-icon">📷</span>
                        <span>QR Scanner</span>
                    </Link>
                </div>
            </div>

            {/* Recent Events */}
            <div className="admin-section">
                <div className="section-header">
                    <h2>Recent Events</h2>
                    <Link to="/admin/manage-events" className="view-all-link">View All →</Link>
                </div>

                <div className="admin-events-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Date</th>
                                <th>Venue</th>
                                <th>Price</th>
                                <th>Registrations</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr key={event.eventId}>
                                    <td>{event.title}</td>
                                    <td>{format(new Date(event.eventDate), 'dd MMM yyyy')}</td>
                                    <td>{event.venue}</td>
                                    <td>₹{event.price}</td>
                                    <td>{event.totalRegistrations}/{event.maxSeats}</td>
                                    <td>
                                        <Link 
                                            to={`/admin/analytics/${event.eventId}`}
                                            className="btn btn-sm btn-primary"
                                        >
                                            View Analytics
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {events.length === 0 && (
                    <p className="empty-message">No events created yet</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;