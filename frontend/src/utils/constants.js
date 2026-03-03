// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
    TIMEOUT: 30000, // 30 seconds
};

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
    },
    
    // Events
    EVENTS: {
        LIST: '/events/list',
        UPCOMING: '/events/upcoming',
        CREATE: '/events',
        UPDATE: (id) => `/events/${id}`,
        DELETE: (id) => `/events/${id}`,
        GET_BY_ID: (id) => `/events/${id}`,
    },
    
    // Registrations
    REGISTRATIONS: {
        CREATE: '/registrations',
        MY_REGISTRATIONS: '/registrations/my-registrations',
        BY_EVENT: (eventId) => `/registrations/event/${eventId}`,
        GET_BY_ID: (id) => `/registrations/${id}`,
    },
    
    // Payments
    PAYMENTS: {
        INITIATE: '/payment/initiate',
        VERIFY: '/payment/verify',
    },
    
    // QR Code
    QR: {
        GET_BY_REGISTRATION: (regId) => `/qr/registration/${regId}`,
        VALIDATE: '/qr/validate',
    },
    
    // Attendance
    ATTENDANCE: {
        SCAN: '/attendance/scan',
        EVENT_COUNT: (eventId) => `/attendance/event/${eventId}/count`,
    },
    
    // Analytics
    ANALYTICS: {
        EVENT: (eventId) => `/analytics/event/${eventId}`,
    },
};

// User Roles
export const USER_ROLES = {
    ADMIN: 'ADMIN',
    STUDENT: 'STUDENT',
};

// Payment Status
export const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    FAILED: 'FAILED',
};

// Registration Status
export const REGISTRATION_STATUS = {
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED',
};

// Attendance Status
export const ATTENDANCE_STATUS = {
    PRESENT: 'PRESENT',
    ABSENT: 'ABSENT',
};

// Email Status
export const EMAIL_STATUS = {
    SENT: 'SENT',
    FAILED: 'FAILED',
};

// Local Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    THEME: 'theme',
};

// Toast Messages
export const TOAST_MESSAGES = {
    SUCCESS: {
        LOGIN: 'Login successful!',
        REGISTER: 'Registration successful!',
        EVENT_CREATED: 'Event created successfully!',
        EVENT_UPDATED: 'Event updated successfully!',
        EVENT_DELETED: 'Event deleted successfully!',
        REGISTRATION_SUCCESS: 'Registration successful!',
        PAYMENT_SUCCESS: 'Payment completed successfully!',
        QR_SCANNED: 'Attendance marked successfully!',
    },
    ERROR: {
        LOGIN_FAILED: 'Login failed. Please check your credentials.',
        REGISTER_FAILED: 'Registration failed. Please try again.',
        EVENT_LOAD_FAILED: 'Failed to load events.',
        EVENT_CREATE_FAILED: 'Failed to create event.',
        REGISTRATION_FAILED: 'Registration failed. Please try again.',
        PAYMENT_FAILED: 'Payment failed. Please try again.',
        QR_SCAN_FAILED: 'QR scan failed. Invalid code.',
        NETWORK_ERROR: 'Network error. Please check your connection.',
    },
    INFO: {
        LOADING: 'Loading...',
        PROCESSING: 'Processing...',
        REDIRECTING: 'Redirecting...',
    },
};

// Date & Time Formats
export const DATE_FORMATS = {
    DISPLAY: 'dd MMM yyyy',
    DISPLAY_LONG: 'dd MMMM yyyy',
    INPUT: 'yyyy-MM-dd',
    TIME_12H: 'hh:mm a',
    TIME_24H: 'HH:mm',
    DATETIME: 'dd MMM yyyy, hh:mm a',
};

// Validation Rules
export const VALIDATION = {
    USERNAME: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 50,
        PATTERN: /^[a-zA-Z0-9_]+$/,
        MESSAGE: 'Username must be 3-50 characters and contain only letters, numbers, and underscores',
    },
    PASSWORD: {
        MIN_LENGTH: 6,
        MAX_LENGTH: 100,
        MESSAGE: 'Password must be at least 6 characters long',
    },
    EMAIL: {
        PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        MESSAGE: 'Please enter a valid email address',
    },
    PHONE: {
        PATTERN: /^[6-9]\d{9}$/,
        MESSAGE: 'Please enter a valid 10-digit mobile number',
    },
    ROLL_NO: {
        PATTERN: /^[A-Z0-9]+$/,
        MESSAGE: 'Roll number should contain only uppercase letters and numbers',
    },
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
};

// File Upload
export const FILE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: {
        IMAGES: ['image/jpeg', 'image/png', 'image/jpg'],
        DOCUMENTS: ['application/pdf'],
    },
};

// Razorpay Configuration (Frontend)
export const RAZORPAY_CONFIG = {
    CHECKOUT_URL: 'https://checkout.razorpay.com/v1/checkout.js',
};

// Chart Colors
export const CHART_COLORS = {
    PRIMARY: '#667eea',
    SECONDARY: '#764ba2',
    SUCCESS: '#10b981',
    DANGER: '#ef4444',
    WARNING: '#f59e0b',
    INFO: '#3b82f6',
    LIGHT: '#f7f9fc',
    DARK: '#1f2937',
};

// Chart Options (for Chart.js)
export const CHART_OPTIONS = {
    RESPONSIVE: true,
    MAINTAIN_ASPECT_RATIO: false,
    PLUGINS: {
        LEGEND: {
            DISPLAY: true,
            POSITION: 'bottom',
        },
    },
};

// Regular Expressions
export const REGEX = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PHONE: /^[6-9]\d{9}$/,
    URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
    NUMBERS_ONLY: /^\d+$/,
};

// Event Categories (if you want to add categories later)
export const EVENT_CATEGORIES = {
    TECHNICAL: 'Technical',
    CULTURAL: 'Cultural',
    SPORTS: 'Sports',
    WORKSHOP: 'Workshop',
    SEMINAR: 'Seminar',
    COMPETITION: 'Competition',
    OTHER: 'Other',
};

// Event Status
export const EVENT_STATUS = {
    UPCOMING: 'UPCOMING',
    ONGOING: 'ONGOING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
};

// Notification Types
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
};

// Theme Options
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
};

// Default Values
export const DEFAULTS = {
    EVENT: {
        PRICE: 0,
        MAX_SEATS: 100,
    },
    PAGINATION: {
        PAGE: 1,
        LIMIT: 10,
    },
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK: 'Network error. Please check your internet connection.',
    UNAUTHORIZED: 'Session expired. Please login again.',
    FORBIDDEN: 'You do not have permission to access this resource.',
    NOT_FOUND: 'Requested resource not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION_ERROR: 'Please check all fields and try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    DATA_SAVED: 'Data saved successfully!',
    DATA_UPDATED: 'Data updated successfully!',
    DATA_DELETED: 'Data deleted successfully!',
};

// QR Code Configuration
export const QR_CONFIG = {
    SIZE: 300,
    FORMAT: 'PNG',
    ERROR_CORRECTION_LEVEL: 'M',
};

// Scanner Configuration
export const SCANNER_CONFIG = {
    FPS: 10,
    QR_BOX_SIZE: 250,
    ASPECT_RATIO: 1,
};

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    EVENTS: '/events',
    MY_REGISTRATIONS: '/my-registrations',
    PAYMENT: (regId) => `/payment/${regId}`,
    
    // Admin Routes
    ADMIN: {
        DASHBOARD: '/admin/dashboard',
        CREATE_EVENT: '/admin/create-event',
        MANAGE_EVENTS: '/admin/manage-events',
        SCANNER: '/admin/scanner',
        ANALYTICS: (eventId) => `/admin/analytics/${eventId}`,
    },
};

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

// Debounce Delays (in milliseconds)
export const DEBOUNCE_DELAYS = {
    SEARCH: 500,
    INPUT: 300,
    RESIZE: 200,
};

// Animation Durations (in milliseconds)
export const ANIMATION_DURATIONS = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
};

// Breakpoints (for responsive design)
export const BREAKPOINTS = {
    XS: 320,
    SM: 576,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536,
};

export default {
    API_CONFIG,
    API_ENDPOINTS,
    USER_ROLES,
    PAYMENT_STATUS,
    REGISTRATION_STATUS,
    STORAGE_KEYS,
    TOAST_MESSAGES,
    DATE_FORMATS,
    VALIDATION,
    ROUTES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
};
