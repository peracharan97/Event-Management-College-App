import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { toast } from 'react-toastify';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventDate: '',
        eventTime: '',
        venue: '',
        price: 0,
        maxSeats: 100,
        subEvents: ['']
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubEventChange = (index, value) => {
        const nextSubEvents = [...formData.subEvents];
        nextSubEvents[index] = value;
        setFormData({ ...formData, subEvents: nextSubEvents });
    };

    const addSubEvent = () => {
        setFormData({ ...formData, subEvents: [...formData.subEvents, ''] });
    };

    const removeSubEvent = (index) => {
        const nextSubEvents = formData.subEvents.filter((_, idx) => idx !== index);
        setFormData({
            ...formData,
            subEvents: nextSubEvents.length > 0 ? nextSubEvents : ['']
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            subEvents: formData.subEvents
                .map((item) => item.trim())
                .filter((item) => item.length > 0)
        };

        try {
            await eventService.createEvent(payload);
            toast.success('Event created successfully!');
            navigate('/admin/manage-events');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <div className="page-header">
                <h1>Create New Event</h1>
                <p>Fill in the details to create an event</p>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Event Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter event title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter event description"
                            rows="4"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Event Date *</label>
                            <input
                                type="date"
                                value={formData.eventDate}
                                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Event Time *</label>
                            <input
                                type="time"
                                value={formData.eventTime}
                                onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Venue *</label>
                        <input
                            type="text"
                            value={formData.venue}
                            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                            placeholder="Enter venue location"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price (Rs) *</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value || '0') })}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Max Seats *</label>
                            <input
                                type="number"
                                value={formData.maxSeats}
                                onChange={(e) => setFormData({ ...formData, maxSeats: parseInt(e.target.value || '1', 10) })}
                                min="1"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Sub-Events (Optional)</label>
                        <p className="field-help">Examples: Coding, Mock Interview, Quiz</p>

                        <div className="sub-event-editor">
                            {formData.subEvents.map((subEvent, index) => (
                                <div className="sub-event-row" key={`sub-event-${index}`}>
                                    <input
                                        type="text"
                                        value={subEvent}
                                        placeholder={`Sub-event ${index + 1}`}
                                        onChange={(e) => handleSubEventChange(index, e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => removeSubEvent(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={addSubEvent}
                        >
                            Add Sub-Event
                        </button>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Creating Event...' : 'Create Event'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
