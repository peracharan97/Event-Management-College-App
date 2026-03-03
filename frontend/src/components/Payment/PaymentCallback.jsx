import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentCallback = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('Processing your payment...');
    const navigate = useNavigate();

    useEffect(() => {
        processPaymentCallback();
    }, []);

    const processPaymentCallback = async () => {
        // Get payment status from URL parameters
        const paymentStatus = searchParams.get('status') || searchParams.get('code');
        const transactionId = searchParams.get('transactionId') || searchParams.get('merchantTransactionId');

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (paymentStatus === 'success' || paymentStatus === 'PAYMENT_SUCCESS') {
            setStatus('success');
            setMessage('Payment successful! Your registration is confirmed.');
            toast.success('Payment successful!');
            
            // Redirect to my registrations after 3 seconds
            setTimeout(() => {
                navigate('/my-registrations');
            }, 3000);
        } else if (paymentStatus === 'failed' || paymentStatus === 'PAYMENT_FAILED') {
            setStatus('failed');
            setMessage('Payment failed. Please try again.');
            toast.error('Payment failed!');
            
            setTimeout(() => {
                navigate('/my-registrations');
            }, 3000);
        } else if (paymentStatus === 'pending' || paymentStatus === 'PAYMENT_PENDING') {
            setStatus('pending');
            setMessage('Payment is pending. We will notify you once confirmed.');
            toast.info('Payment pending');
            
            setTimeout(() => {
                navigate('/my-registrations');
            }, 3000);
        } else {
            setStatus('error');
            setMessage('Unable to verify payment status.');
            toast.error('Payment verification failed');
            
            setTimeout(() => {
                navigate('/my-registrations');
            }, 3000);
        }
    };

    return (
        <div className="payment-callback-container">
            <div className="payment-callback-card">
                {status === 'processing' && (
                    <div className="callback-content">
                        <div className="callback-spinner"></div>
                        <h2>Processing Payment...</h2>
                        <p>Please wait while we verify your payment</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="callback-content success">
                        <div className="callback-icon success-icon">✓</div>
                        <h2>Payment Successful!</h2>
                        <p>{message}</p>
                        <div className="callback-info">
                            <p>📧 A confirmation email with QR code has been sent to your email</p>
                            <p>🎫 You can view your QR ticket in "My Registrations"</p>
                        </div>
                        <button 
                            onClick={() => navigate('/my-registrations')}
                            className="btn btn-primary"
                        >
                            View My Registrations
                        </button>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="callback-content failed">
                        <div className="callback-icon failed-icon">✕</div>
                        <h2>Payment Failed</h2>
                        <p>{message}</p>
                        <div className="callback-info">
                            <p>💡 Your registration is still active</p>
                            <p>🔄 You can retry the payment from "My Registrations"</p>
                        </div>
                        <button 
                            onClick={() => navigate('/my-registrations')}
                            className="btn btn-primary"
                        >
                            Back to Registrations
                        </button>
                    </div>
                )}

                {status === 'pending' && (
                    <div className="callback-content pending">
                        <div className="callback-icon pending-icon">⏳</div>
                        <h2>Payment Pending</h2>
                        <p>{message}</p>
                        <div className="callback-info">
                            <p>⏱️ Payment verification in progress</p>
                            <p>📬 We will email you once payment is confirmed</p>
                        </div>
                        <button 
                            onClick={() => navigate('/my-registrations')}
                            className="btn btn-primary"
                        >
                            View Registrations
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="callback-content error">
                        <div className="callback-icon error-icon">⚠️</div>
                        <h2>Verification Error</h2>
                        <p>{message}</p>
                        <div className="callback-info">
                            <p>🔍 Please check your registration status</p>
                            <p>📞 Contact support if payment was deducted</p>
                        </div>
                        <button 
                            onClick={() => navigate('/my-registrations')}
                            className="btn btn-primary"
                        >
                            Back to Registrations
                        </button>
                    </div>
                )}

                <p className="callback-redirect-note">
                    Redirecting automatically in 3 seconds...
                </p>
            </div>
        </div>
    );
};

export default PaymentCallback;