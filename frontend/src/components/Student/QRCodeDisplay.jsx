import React, { useCallback, useEffect, useState } from 'react';
import { eventService } from '../../services/eventService';
import { toast } from 'react-toastify';

const QRCodeDisplay = ({ registration, onClose }) => {
    const [qrCode, setQrCode] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchQRCode = useCallback(async () => {
        try {
            const response = await eventService.getQRCode(registration.regId);
            setQrCode(response.data);
        } catch (error) {
            toast.error('Failed to load QR code');
        } finally {
            setLoading(false);
        }
    }, [registration.regId]);

    useEffect(() => {
        fetchQRCode();
    }, [fetchQRCode]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>
                
                <div className="qr-display">
                    <h2>Event Entry Pass</h2>
                    <p className="event-title">{registration.event.title}</p>

                    {loading ? (
                        <div className="loading-spinner">Loading QR Code...</div>
                    ) : (
                        <>
                            <div className="qr-code-container">
                                <img 
                                    src={`data:image/png;base64,${qrCode.qrImageBase64}`}
                                    alt="QR Code"
                                    className="qr-image"
                                />
                            </div>
                            
                            <div className="qr-info">
                                <p><strong>Registration ID:</strong> #{registration.regId}</p>
                                <p><strong>Name:</strong> {registration.studentName}</p>
                                <p className="warning">⚠️ Show this QR code at the event entrance</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QRCodeDisplay;
