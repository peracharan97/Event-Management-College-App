import React, { useEffect, useState } from 'react';
import { eventService } from '../../services/eventService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import QRCodeDisplay from './QRCodeDisplay';

const MyRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReg, setSelectedReg] = useState(null);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const response = await eventService.getMyRegistrations();
            setRegistrations(response.data);
        } catch (error) {
            toast.error('Failed to load registrations');
        } finally {
            setLoading(false);
        }
    };

    const loadRazorpayScript = () => new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

    const handlePayment = async (registration) => {
        try {
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toast.error('Razorpay SDK failed to load');
                return;
            }

            const response = await eventService.initiatePayment(
                registration.regId,
                registration.registrationFee ?? registration.event.price
            );
            const order = response.data;

            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: 'PVPSIT Events',
                description: `Payment for ${registration.event.title}`,
                order_id: order.orderId,
                prefill: {
                    name: registration.user?.fullName || '',
                    email: registration.user?.email || '',
                    contact: registration.user?.phoneNumber || ''
                },
                handler: async (razorpayResponse) => {
                    try {
                        await eventService.verifyPayment({
                            regId: registration.regId,
                            razorpayOrderId: razorpayResponse.razorpay_order_id,
                            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                            razorpaySignature: razorpayResponse.razorpay_signature
                        });
                        toast.success('Payment successful');
                        fetchRegistrations();
                    } catch (error) {
                        toast.error(error.response?.data?.message || 'Payment verification failed');
                    }
                },
                modal: {
                    ondismiss: () => {
                        toast.info('Payment was cancelled');
                    }
                },
                theme: {
                    color: '#0f172a'
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', () => {
                toast.error('Payment failed');
            });
            razorpay.open();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Payment initiation failed');
        }
    };

    if (loading) {
        return <div className="loading-spinner">Loading registrations...</div>;
    }

    return (
        <div className="registrations-container">
            <div className="page-header">
                <h1>My Registrations</h1>
                <p>View and manage your event registrations</p>
            </div>

            <div className="registrations-list">
                {registrations.map((reg) => (
                    <div key={reg.regId} className="registration-card">
                        <div className="reg-header">
                            <h3>{reg.event.title}</h3>
                            <span className={`status-badge ${reg.paymentStatus.toLowerCase()}`}>
                                {reg.paymentStatus}
                            </span>
                        </div>

                        <div className="reg-details">
                            <p><strong>Date:</strong> {format(new Date(reg.event.eventDate), 'dd MMM yyyy')}</p>
                            <p><strong>Time:</strong> {reg.event.eventTime}</p>
                            <p><strong>Venue:</strong> {reg.event.venue}</p>
                            <p><strong>Sub-Events:</strong> {reg.selectedSubEvents?.join(', ') || 'NA'}</p>
                            <p><strong>Registration ID:</strong> #{reg.regId}</p>
                        </div>

                        <div className="reg-actions">
                            {reg.paymentStatus === 'PENDING' && (
                                <button
                                    onClick={() => handlePayment(reg)}
                                    className="btn btn-primary"
                                >
                                    Pay Rs. {reg.registrationFee ?? reg.event.price}
                                </button>
                            )}

                            {reg.paymentStatus === 'PAID' && (
                                <button
                                    onClick={() => setSelectedReg(reg)}
                                    className="btn btn-success"
                                >
                                    View QR Code
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {registrations.length === 0 && (
                <div className="empty-state">
                    <h3>No registrations yet</h3>
                    <p>Browse events and register!</p>
                </div>
            )}

            {selectedReg && (
                <QRCodeDisplay
                    registration={selectedReg}
                    onClose={() => setSelectedReg(null)}
                />
            )}
        </div>
    );
};

export default MyRegistrations;
