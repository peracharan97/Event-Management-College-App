import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const BRANCH_OPTIONS = ['IT', 'CSE', 'EEE', 'ECE', 'MECH', 'AIML', 'AIDS', 'CIVIL', 'MBA', 'OTHERS'];

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        rollNo: '',
        department: '',
        semester: '',
        phoneNumber: '',
        collegeType: 'PVPSIT',
        role: 'STUDENT'
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await register(formData);
            toast.success('Registration successful!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join PVPSIT Event Management</p>
                </div>
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                placeholder="Enter full name"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                placeholder="Choose username"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="Enter email"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                placeholder="Choose password"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Roll Number</label>
                            <input
                                type="text"
                                value={formData.rollNo}
                                onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                                placeholder="Enter roll number"
                                required={formData.collegeType === 'PVPSIT'}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Branch</label>
                            <select
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            >
                                <option value="">Select branch</option>
                                {BRANCH_OPTIONS.map((branch) => (
                                    <option key={branch} value={branch}>
                                        {branch}
                                    </option>
                                ))}
                            </select>
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
                                onChange={(e) => setFormData({...formData, semester: e.target.value === '' ? '' : Number(e.target.value)})}
                                placeholder="Enter semester (1-8)"
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                placeholder="Enter phone number"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>College *</label>
                            <select
                                value={formData.collegeType}
                                onChange={(e) => setFormData({ ...formData, collegeType: e.target.value })}
                                required
                            >
                                <option value="PVPSIT">PVPSIT</option>
                                <option value="OTHER">Other College</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Important Notice</label>
                            <p className="field-help">
                                If you select PVPSIT, your roll number will be verified at the venue.
                                Please provide genuine details.
                            </p>
                        </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
