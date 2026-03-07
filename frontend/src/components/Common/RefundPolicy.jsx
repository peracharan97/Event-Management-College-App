import React from 'react';

const RefundPolicy = () => {
    return (
        <div className="policy-container">
            <div className="page-header">
                <h1>Refund Policy</h1>
                <p>Please read before making any payment.</p>
            </div>

            <div className="policy-card">
                <h2>No Refunds</h2>
                <p>
                    All event registrations and payments made through PVPSIT Events are final.
                    No refunds will be provided under any circumstances, including cancellation
                    by participant, scheduling conflicts, or non-attendance.
                </p>
                <p>
                    By completing payment, you acknowledge and agree to this no-refund policy.
                </p>
            </div>
        </div>
    );
};

export default RefundPolicy;
