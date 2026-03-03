import api from './api';

export const eventService = {
    getAllEvents: () => api.get('/events/list'),
    getUpcomingEvents: () => api.get('/events/upcoming'),
    getEventById: (id) => api.get(`/events/${id}`),
    createEvent: (eventData) => api.post('/events', eventData),
    updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
    deleteEvent: (id) => api.delete(`/events/${id}`),

    registerForEvent: (eventId, selectedSubEvents = []) =>
        api.post('/registrations', { eventId, selectedSubEvents }),
    getMyRegistrations: () => api.get('/registrations/my-registrations'),
    getEventRegistrations: (eventId) => api.get(`/registrations/event/${eventId}`),
    getRegistrationById: (id) => api.get(`/registrations/${id}`),

    initiatePayment: (regId, amount) => api.post('/payment/initiate', { regId, amount }),
    verifyPayment: (payload) => api.post('/payment/verify', payload),

    getQRCode: (regId) => api.get(`/qr/registration/${regId}`),
    scanQRCode: (qrData) => api.post('/attendance/scan', { qrData }),

    getEventAnalytics: (eventId) => api.get(`/analytics/event/${eventId}`),
    downloadEventAnalyticsCsv: (eventId, type = 'all') =>
        api.get(`/analytics/event/${eventId}/csv?type=${encodeURIComponent(type)}`, { responseType: 'blob' }),
    getEventStudents: (eventId, department = 'ALL', semester = null) => {
        const params = new URLSearchParams();
        params.set('department', department);
        if (semester !== null && semester !== '' && semester !== 'ALL') {
            params.set('semester', semester);
        }
        return api.get(`/analytics/event/${eventId}/students?${params.toString()}`);
    }
};
