import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await eventService.getUpcomingEvents();
            setEvents(response.data);
        } catch (error) {
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (eventId) => {
        if (!user) {
            navigate('/login');
            return;
        }

        setRegistering(eventId);
        try {
            await eventService.registerForEvent(eventId);
            toast.success('Registration successful!');
            fetchEvents();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setRegistering(null);
        }
    };

    if (loading) {
        return <div className="loading-spinner">Loading events...</div>;
    }

    return (
        <div className="events-container">
            <div className="page-header">
                <h1>Upcoming Events</h1>
                <p>Register for exciting events at PVPSIT</p>
            </div>

            <div className="events-grid">
                {events.map(event => (
                    <div key={event.eventId} className="event-card">
                        <div className="event-badge">
                            {event.price === 0 ? 'FREE' : `₹${event.price}`}
                        </div>
                        
                        <h3>{event.title}</h3>
                        <p className="event-description">{event.description}</p>
                        
                        <div className="event-details">
                            <div className="detail-item">
                                <span className="icon">📅</span>
                                <span>{format(new Date(event.eventDate), 'dd MMM yyyy')}</span>
                            </div>
                            <div className="detail-item">
                                <span className="icon">🕐</span>
                                <span>{event.eventTime}</span>
                            </div>
                            <div className="detail-item">
                                <span className="icon">📍</span>
                                <span>{event.venue}</span>
                            </div>
                            <div className="detail-item">
                                <span className="icon">👥</span>
                                <span>{event.availableSeats} seats left</span>
                            </div>
                        </div>

                        <button
                            onClick={() => handleRegister(event.eventId)}
                            disabled={registering === event.eventId || event.availableSeats === 0}
                            className="btn btn-primary"
                        >
                            {registering === event.eventId ? 'Registering...' : 
                             event.availableSeats === 0 ? 'Event Full' : 'Register Now'}
                        </button>
                    </div>
                ))}
            </div>

            {events.length === 0 && (
                <div className="empty-state">
                    <h3>No upcoming events</h3>
                    <p>Check back later for new events!</p>
                </div>
            )}
        </div>
    );
};

export default EventsList;