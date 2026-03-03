import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const NOT_APPLICABLE = 'NA';

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(null);
    const [selectedSubEventsByEvent, setSelectedSubEventsByEvent] = useState({});
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

    const toggleSubEventSelection = (eventId, subEventName) => {
        setSelectedSubEventsByEvent((previous) => {
            const currentSelection = previous[eventId] || [];

            if (subEventName === NOT_APPLICABLE) {
                const isAlreadySelected = currentSelection.includes(NOT_APPLICABLE);
                return {
                    ...previous,
                    [eventId]: isAlreadySelected ? [] : [NOT_APPLICABLE]
                };
            }

            const selectionWithoutNA = currentSelection.filter((item) => item !== NOT_APPLICABLE);
            const exists = selectionWithoutNA.includes(subEventName);
            const nextSelection = exists
                ? selectionWithoutNA.filter((item) => item !== subEventName)
                : [...selectionWithoutNA, subEventName];

            return {
                ...previous,
                [eventId]: nextSelection
            };
        });
    };

    const handleRegister = async (eventId) => {
        if (!user) {
            navigate('/login');
            return;
        }

        setRegistering(eventId);
        const selectedSubEvents = selectedSubEventsByEvent[eventId] || [];

        try {
            await eventService.registerForEvent(eventId, selectedSubEvents);
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
                {events.map((event) => {
                    const availableSubEvents = Array.isArray(event.subEvents) ? event.subEvents : [];
                    const selectedSubEvents = selectedSubEventsByEvent[event.eventId] || [];

                    return (
                        <div key={event.eventId} className="event-card">
                            <div className="event-badge">
                                {event.price === 0 ? 'FREE' : `Rs ${event.price}`}
                            </div>

                            <h3>{event.title}</h3>
                            <p className="event-description">{event.description}</p>

                            <div className="event-details">
                                <div className="detail-item">
                                    <span>Date:</span>
                                    <span>{format(new Date(event.eventDate), 'dd MMM yyyy')}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Time:</span>
                                    <span>{event.eventTime}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Venue:</span>
                                    <span>{event.venue}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Seats:</span>
                                    <span>{event.availableSeats} left</span>
                                </div>
                            </div>

                            <div className="sub-event-selector">
                                <h4>Select Sub-Events</h4>
                                {availableSubEvents.length > 0 ? (
                                    <div className="sub-event-options">
                                        {availableSubEvents.map((subEvent) => (
                                            <label key={`${event.eventId}-${subEvent}`} className="sub-event-option">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSubEvents.includes(subEvent)}
                                                    onChange={() => toggleSubEventSelection(event.eventId, subEvent)}
                                                />
                                                <span>{subEvent}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="sub-event-note">No specific sub-events for this event.</p>
                                )}

                                <label className="sub-event-option">
                                    <input
                                        type="checkbox"
                                        checked={selectedSubEvents.includes(NOT_APPLICABLE)}
                                        onChange={() => toggleSubEventSelection(event.eventId, NOT_APPLICABLE)}
                                    />
                                    <span>NA</span>
                                </label>
                            </div>

                            <button
                                onClick={() => handleRegister(event.eventId)}
                                disabled={registering === event.eventId || event.availableSeats === 0}
                                className="btn btn-primary"
                            >
                                {registering === event.eventId
                                    ? 'Registering...'
                                    : event.availableSeats === 0
                                        ? 'Event Full'
                                        : 'Register Now'}
                            </button>
                        </div>
                    );
                })}
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
