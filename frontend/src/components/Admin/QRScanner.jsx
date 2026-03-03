import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { eventService } from '../../services/eventService';
import { toast } from 'react-toastify';

const QRScanner = () => {
    const [scanning, setScanning] = useState(false);
    const [scannedData, setScannedData] = useState(null);

    useEffect(() => {
        if (!scanning) {
            return undefined;
        }

        const scanner = new Html5QrcodeScanner(
            'qr-reader',
            { fps: 10, qrbox: 250 },
            false
        );

        scanner.render(onScanSuccess, onScanError);

        return () => {
            scanner.clear().catch(() => {});
        };
    }, [scanning]);

    const onScanSuccess = async (decodedText) => {
        try {
            const response = await eventService.scanQRCode(decodedText);
            setScannedData(response.data);
            toast.success('Attendance marked successfully!');
            setScanning(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid QR code');
        }
    };

    const onScanError = () => {
        // Ignore scan frame-level errors.
    };

    return (
        <div className="scanner-container">
            <div className="page-header">
                <h1>QR Code Scanner</h1>
                <p>Scan student QR codes to mark attendance</p>
            </div>

            <div className="scanner-card">
                {!scanning ? (
                    <button
                        onClick={() => setScanning(true)}
                        className="btn btn-primary btn-large"
                    >
                        Start Scanning
                    </button>
                ) : (
                    <>
                        <div id="qr-reader"></div>
                        <button
                            onClick={() => setScanning(false)}
                            className="btn btn-secondary"
                        >
                            Stop Scanning
                        </button>
                    </>
                )}

                {scannedData && (
                    <div className="scan-result">
                        <h3>Attendance Marked</h3>
                        <p><strong>Student:</strong> {scannedData.studentName || 'N/A'}</p>
                        <p><strong>Event:</strong> {scannedData.eventTitle || 'N/A'}</p>
                        <p><strong>Time:</strong> {new Date(scannedData.scannedAt).toLocaleString()}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QRScanner;
