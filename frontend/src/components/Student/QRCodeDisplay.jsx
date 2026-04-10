import React, { useCallback, useEffect, useState } from 'react';
import { eventService } from '../../services/eventService';
import { toast } from 'react-toastify';

const QRCodeDisplay = ({ registration, onClose }) => {
    const [qrCodes, setQrCodes] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchQRCode = useCallback(async () => {
        try {
            const response = await eventService.getQRCode(registration.regId);
            const data = response.data;
            let normalized = [];

            if (Array.isArray(data)) {
                normalized = data.map((item) => ({
                    ...item,
                    subEvent: item?.subEvent ?? 'NA'
                }));
            } else if (data && typeof data === 'object') {
                normalized = [{ subEvent: 'NA', ...data }];
            } else {
                normalized = [];
            }

            setQrCodes(normalized);
            setSelectedIndex(0);
        } catch (error) {
            toast.error('Failed to load QR code');
        } finally {
            setLoading(false);
        }
    }, [registration.regId]);

    useEffect(() => {
        fetchQRCode();
    }, [fetchQRCode]);

    const selectedQr = qrCodes[selectedIndex];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

                <div className="qr-display">
                    <h2>Event Entry Pass</h2>
                    <p className="event-title">{registration.event.title}</p>

                    {loading ? (
                        <div className="loading-spinner">Loading QR Code...</div>
                    ) : (
                        <>
                            {qrCodes.length === 0 ? (
                                <div className="empty-state">
                                    <h3>No QR codes found</h3>
                                    <p>Please try again in a moment.</p>
                                </div>
                            ) : (
                                <>
                                    {qrCodes.length > 1 && (
                                        <div className="qr-selector">
                                            <label htmlFor="qr-select" className="qr-selector__label">Select pass</label>
                                            <select
                                                id="qr-select"
                                                value={selectedIndex}
                                                onChange={(e) => setSelectedIndex(Number(e.target.value))}
                                                className="qr-selector__select"
                                            >
                                                {qrCodes.map((qr, index) => (
                                                    <option key={`${registration.regId}-${qr.subEvent || 'NA'}-${index}`} value={index}>
                                                        {qr.subEvent && qr.subEvent.toUpperCase() !== 'NA'
                                                            ? `Sub-Event: ${qr.subEvent}`
                                                            : 'Main Event Pass'}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {selectedQr && (
                                        <div className="qr-code-container">
                                            <p style={{ textAlign: 'center', marginBottom: '0.75rem', fontWeight: 700 }}>
                                                {selectedQr.subEvent && selectedQr.subEvent.toUpperCase() !== 'NA'
                                                    ? `Sub-Event: ${selectedQr.subEvent}`
                                                    : 'Main Event Pass'}
                                            </p>
                                            <img
                                                src={`data:image/png;base64,${selectedQr.qrImageBase64}`}
                                                alt="QR Code"
                                                className="qr-image"
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="qr-info">
                                <p><strong>Registration ID:</strong> #{registration.regId}</p>
                                <p><strong>Name:</strong> {registration.user?.fullName || registration.studentName || 'N/A'}</p>
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
