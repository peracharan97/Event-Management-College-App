import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await eventService.getAllEvents();
            setEvents(response.data);
        } catch (error) {
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await eventService.deleteEvent(eventId);
                toast.success('Event deleted successfully');
                fetchEvents();
            } catch (error) {
                toast.error('Failed to delete event');
            }
        }
    };

    const handleViewRegistrations = async (eventId) => {
        try {
            const response = await eventService.getEventRegistrations(eventId);
            // You can create a modal or new page to show registrations
            console.log('Registrations:', response.data);
            toast.info(`${response.data.length} registrations found`);
        } catch (error) {
            toast.error('Failed to load registrations');
        }
    };

    if (loading) {
        return <div className="loading-spinner">Loading events...</div>;
    }

    return (
        <div className="event-management-container">
            <div className="page-header">
                <h1>Event Management</h1>
                <Link to="/admin/create-event" className="btn btn-primary">
                    ➕ Create New Event
                </Link>
            </div>

            <div className="events-management-grid">
                {events.map(event => (
                    <div key={event.eventId} className="event-management-card">
                        <div className="event-card-header">
                            <h3>{event.title}</h3>
                            <span className={`event-status ${new Date(event.eventDate) >= new Date() ? 'upcoming' : 'past'}`}>
                                {new Date(event.eventDate) >= new Date() ? 'Upcoming' : 'Past'}
                            </span>
                        </div>

                        <div className="event-card-body">
                            <p className="event-description">{event.description}</p>
                            
                            <div className="event-info">
                                <div className="info-item">
                                    <span className="info-label">📅 Date:</span>
                                    <span>{format(new Date(event.eventDate), 'dd MMM yyyy')}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">🕐 Time:</span>
                                    <span>{event.eventTime}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">📍 Venue:</span>
                                    <span>{event.venue}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">💰 Price:</span>
                                    <span>₹{event.price}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">👥 Registrations:</span>
                                    <span>{event.totalRegistrations}/{event.maxSeats}</span>
                                </div>
                            </div>
                        </div>

                        <div className="event-card-actions">
                            <button 
                                onClick={() => handleViewRegistrations(event.eventId)}
                                className="btn btn-sm btn-secondary"
                            >
                                View Registrations
                            </button>
                            <Link 
                                to={`/admin/analytics/${event.eventId}`}
                                className="btn btn-sm btn-primary"
                            >
                                Analytics
                            </Link>
                            <button 
                                onClick={() => handleDelete(event.eventId)}
                                className="btn btn-sm btn-danger"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {events.length === 0 && (
                <div className="empty-state">
                    <h3>No events created yet</h3>
                    <p>Create your first event to get started!</p>
                    <Link to="/admin/create-event" className="btn btn-primary">
                        Create Event
                    </Link>
                </div>
            )}
        </div>
    );
};

export default EventManagement;
