import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { eventService } from '../../services/eventService';

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('ACTIVE');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await eventService.getAllEventsForAdmin();
            setEvents(response.data || []);
        } catch (error) {
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (eventId) => {
        if (!window.confirm('Are you sure you want to archive this event?')) {
            return;
        }

        try {
            await eventService.deleteEvent(eventId);
            toast.success('Event archived successfully');
            fetchEvents();
        } catch (error) {
            toast.error('Failed to archive event');
        }
    };

    const handleViewRegistrations = async (eventId) => {
        try {
            const response = await eventService.getEventRegistrations(eventId);
            toast.info(`${response.data.length} registrations found`);
        } catch (error) {
            toast.error('Failed to load registrations');
        }
    };

    if (loading) {
        return <div className="loading-spinner">Loading events...</div>;
    }

    const normalizedEvents = events.map((event) => ({
        ...event,
        status: event.status || 'ACTIVE'
    }));

    const filteredEvents = normalizedEvents.filter((event) =>
        view === 'ACTIVE'
            ? event.status === 'ACTIVE'
            : event.status === 'ARCHIVED' || event.status === 'DELETED'
    );

    return (
        <div className="event-management-container">
            <div className="page-header">
                <h1>Event Management</h1>
                <Link to="/admin/create-event" className="btn btn-primary">
                    + Create New Event
                </Link>
            </div>

            <div className="event-view-toggle" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button
                    onClick={() => setView('ACTIVE')}
                    className={`btn btn-sm ${view === 'ACTIVE' ? 'btn-primary' : 'btn-secondary'}`}
                >
                    Active Events
                </button>
                <button
                    onClick={() => setView('INACTIVE')}
                    className={`btn btn-sm ${view === 'INACTIVE' ? 'btn-primary' : 'btn-secondary'}`}
                >
                    Archived/Deleted
                </button>
            </div>

            <div className="events-management-grid">
                {filteredEvents.map((event) => (
                    <div key={event.eventId} className="event-management-card">
                        <div className="event-card-header">
                            <h3>{event.title}</h3>
                            <span className={`event-status ${event.status === 'ACTIVE' && new Date(event.eventDate) >= new Date() ? 'upcoming' : 'past'}`}>
                                {event.status === 'ACTIVE'
                                    ? (new Date(event.eventDate) >= new Date() ? 'Upcoming' : 'Past')
                                    : event.status}
                            </span>
                        </div>

                        <div className="event-card-body">
                            <p className="event-description">{event.description}</p>

                            <div className="event-info">
                                <div className="info-item">
                                    <span className="info-label">Date:</span>
                                    <span>{format(new Date(event.eventDate), 'dd MMM yyyy')}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Time:</span>
                                    <span>{event.eventTime}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Venue:</span>
                                    <span>{event.venue}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Price:</span>
                                    <span>
                                        PVPSIT: Rs {event.pvpsitPrice ?? event.price ?? 0} | Other: Rs {event.otherCollegePrice ?? event.price ?? 0}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Registrations:</span>
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
                            {event.status === 'ACTIVE' && (
                                <button
                                    onClick={() => handleDelete(event.eventId)}
                                    className="btn btn-sm btn-danger"
                                >
                                    Archive
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="empty-state">
                    <h3>{view === 'ACTIVE' ? 'No active events' : 'No archived/deleted events'}</h3>
                    {view === 'ACTIVE' && (
                        <>
                            <p>Create your first event to get started!</p>
                            <Link to="/admin/create-event" className="btn btn-primary">
                                Create Event
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default EventManagement;
