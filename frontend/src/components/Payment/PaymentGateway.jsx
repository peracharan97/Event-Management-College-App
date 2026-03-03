import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { toast } from 'react-toastify';

const PaymentGateway = () => {
    const { regId } = useParams();
    const [registration, setRegistration] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    const fetchRegistrationDetails = useCallback(async () => {
        try {
            const response = await eventService.getRegistrationById(regId);
            setRegistration(response.data);
        } catch (error) {
            toast.error('Failed to load payment details');
            navigate('/my-registrations');
        } finally {
            setLoading(false);
        }
    }, [navigate, regId]);

    useEffect(() => {
        if (regId) {
            fetchRegistrationDetails();
        }
    }, [fetchRegistrationDetails, regId]);

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

    const handlePayment = async () => {
        if (!registration) {
            return;
        }
        setProcessing(true);

        try {
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toast.error('Razorpay SDK failed to load');
                setProcessing(false);
                return;
            }

            const response = await eventService.initiatePayment(
                registration.regId,
                registration.event.price
            );
            const order = response.data;

            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: 'PVPSIT Events',
                description: `Payment for ${registration.event.title}`,
                order_id: order.orderId,
                handler: async (razorpayResponse) => {
                    try {
                        await eventService.verifyPayment({
                            regId: registration.regId,
                            razorpayOrderId: razorpayResponse.razorpay_order_id,
                            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                            razorpaySignature: razorpayResponse.razorpay_signature
                        });
                        toast.success('Payment successful');
                        navigate('/my-registrations');
                    } catch (error) {
                        toast.error(error.response?.data?.message || 'Payment verification failed');
                    } finally {
                        setProcessing(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setProcessing(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', () => {
                toast.error('Payment failed');
                setProcessing(false);
            });
            razorpay.open();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Payment failed');
            setProcessing(false);
        }
    };

    if (loading) {
        return <div className="loading-spinner">Loading payment details...</div>;
    }

    if (!registration) {
        return (
            <div className="payment-error">
                <h2>Payment details not found</h2>
                <button onClick={() => navigate('/my-registrations')} className="btn btn-primary">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="payment-container">
            <div className="payment-card">
                <div className="payment-header">
                    <h1>Complete Your Payment</h1>
                    <p>Secure payment powered by Razorpay</p>
                </div>

                <div className="payment-summary">
                    <h2>Payment Summary</h2>
                    <div className="summary-row">
                        <span>Event:</span>
                        <span>{registration.event.title}</span>
                    </div>
                    <div className="summary-row">
                        <span>Amount:</span>
                        <span>Rs. {registration.event.price?.toFixed(2)}</span>
                    </div>
                </div>

                <div className="payment-actions">
                    <button
                        onClick={handlePayment}
                        disabled={processing}
                        className="btn btn-primary btn-large btn-block"
                    >
                        {processing ? 'Processing...' : `Pay Rs. ${registration.event.price?.toFixed(2)}`}
                    </button>
                    <button
                        onClick={() => navigate('/my-registrations')}
                        className="btn btn-secondary btn-block"
                        disabled={processing}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentGateway;
