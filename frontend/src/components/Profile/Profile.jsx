import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        rollNo: user?.rollNo || '',
        department: user?.department || '',
        semester: user?.semester ?? '',
        phoneNumber: user?.phoneNumber || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile({
                ...formData,
                semester: formData.semester === '' ? null : Number(formData.semester)
            });
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="page-header">
                    <h1>My Profile</h1>
                    <p>Update your account details</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" value={user?.username || ''} disabled />
                        </div>

                        <div className="form-group">
                            <label>Role</label>
                            <input type="text" value={user?.role || ''} disabled />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>College</label>
                            <input type="text" value={user?.collegeType || 'OTHER'} disabled />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Roll Number</label>
                            <input
                                type="text"
                                value={formData.rollNo}
                                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Department</label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Semester</label>
                            <input
                                type="number"
                                min="1"
                                max="8"
                                value={formData.semester}
                                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
