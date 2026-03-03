import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { toast } from 'react-toastify';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DEPARTMENTS = ['ALL', 'CSE', 'ECE', 'EEE', 'IT', 'MECH', 'AIML', 'AIDS', 'MBS', 'CIVIL'];
const SEMESTERS = ['ALL', '1', '2', '3', '4', '5', '6', '7', '8'];

const Analytics = () => {
    const { eventId } = useParams();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState('ALL');
    const [selectedSemester, setSelectedSemester] = useState('ALL');
    const [students, setStudents] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(true);

    const fetchAnalytics = useCallback(async () => {
        try {
            const response = await eventService.getEventAnalytics(eventId);
            setAnalytics(response.data);
        } catch (error) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    const fetchStudents = useCallback(async () => {
        setStudentsLoading(true);
        try {
            const semesterParam = selectedSemester === 'ALL' ? null : Number(selectedSemester);
            const response = await eventService.getEventStudents(eventId, selectedDepartment, semesterParam);
            setStudents(response.data || []);
        } catch (error) {
            toast.error('Failed to load student list');
        } finally {
            setStudentsLoading(false);
        }
    }, [eventId, selectedDepartment, selectedSemester]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const handleDownload = async (type) => {
        try {
            const response = await eventService.downloadEventAnalyticsCsv(eventId, type);
            const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `event-${eventId}-analytics-${type}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error('Failed to download CSV');
        }
    };

    const handleDownloadStudentCsv = () => {
        const headers = ['Reg ID', 'Name', 'Email', 'Roll No', 'Department', 'Semester', 'Payment Status', 'Attendance Status'];
        const rows = students.map((s) => [
            s.regId,
            s.studentName,
            s.email,
            s.rollNo,
            s.department,
            s.semester,
            s.paymentStatus,
            s.attendanceStatus
        ]);
        const csv = [headers, ...rows]
            .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
            'download',
            `event-${eventId}-students-${selectedDepartment.toLowerCase()}-sem-${selectedSemester.toLowerCase()}.csv`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    const paymentChartData = useMemo(() => ({
        labels: ['Paid', 'Unpaid'],
        datasets: [{
            data: [analytics?.paidRegistrations || 0, analytics?.unpaidRegistrations || 0],
            backgroundColor: ['#10b981', '#ef4444']
        }]
    }), [analytics?.paidRegistrations, analytics?.unpaidRegistrations]);

    const attendanceData = useMemo(() => ({
        labels: ['Present', 'Absent'],
        datasets: [{
            data: [
                analytics?.totalAttendance || 0,
                (analytics?.totalRegistrations || 0) - (analytics?.totalAttendance || 0)
            ],
            backgroundColor: ['#3b82f6', '#9ca3af']
        }]
    }), [analytics?.totalAttendance, analytics?.totalRegistrations]);

    const branchRevenueData = useMemo(() => {
        const rows = (analytics?.branchAnalytics || []).slice(0, 8);
        return {
            labels: rows.map((row) => row.branch),
            datasets: [{
                label: 'Revenue',
                data: rows.map((row) => row.totalRevenue || 0),
                backgroundColor: '#6366f1'
            }]
        };
    }, [analytics?.branchAnalytics]);

    const semesterAttendanceData = useMemo(() => {
        const rows = analytics?.semesterAnalytics || [];
        return {
            labels: rows.map((row) => row.semester),
            datasets: [{
                label: 'Attendance %',
                data: rows.map((row) => row.attendanceRate || 0),
                backgroundColor: '#14b8a6'
            }]
        };
    }, [analytics?.semesterAnalytics]);

    if (loading) {
        return <div className="loading-spinner">Loading analytics...</div>;
    }

    if (!analytics) {
        return <div className="loading-spinner">No analytics data available.</div>;
    }

    return (
        <div className="analytics-container">
            <div className="page-header">
                <h1>Event Analytics</h1>
                <p>Branch and semester wise registrations, attendance, and collections</p>
            </div>

            <div className="analytics-download-actions">
                <button className="btn btn-secondary" onClick={() => handleDownload('all')}>Download Full CSV</button>
                <button className="btn btn-secondary" onClick={() => handleDownload('branch')}>Download Branch CSV</button>
                <button className="btn btn-secondary" onClick={() => handleDownload('semester')}>Download Semester CSV</button>
                <button className="btn btn-secondary" onClick={() => handleDownload('branch-semester')}>Download Branch+Semester CSV</button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">Students</div>
                    <div className="stat-value">{analytics.totalRegistrations}</div>
                    <div className="stat-label">Total Registrations</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">Present</div>
                    <div className="stat-value">{analytics.totalAttendance}</div>
                    <div className="stat-label">Attendance</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">Revenue</div>
                    <div className="stat-value">Rs.{(analytics.totalRevenue || 0).toFixed(2)}</div>
                    <div className="stat-label">Total Revenue</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">Rate</div>
                    <div className="stat-value">{(analytics.attendancePercentage || 0).toFixed(1)}%</div>
                    <div className="stat-label">Attendance Rate</div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Payment Status</h3>
                    <Pie data={paymentChartData} />
                </div>

                <div className="chart-card">
                    <h3>Attendance Status</h3>
                    <Pie data={attendanceData} />
                </div>

                <div className="chart-card">
                    <h3>Branch-wise Revenue</h3>
                    <Bar data={branchRevenueData} />
                </div>

                <div className="chart-card">
                    <h3>Semester-wise Attendance Rate</h3>
                    <Bar data={semesterAttendanceData} />
                </div>
            </div>

            <div className="analytics-table-section">
                <h3>Branch-wise Summary</h3>
                <div className="admin-events-table">
                    <table>
                        <thead>
                        <tr>
                            <th>Branch</th>
                            <th>Registrations</th>
                            <th>Paid</th>
                            <th>Attendance</th>
                            <th>Attendance %</th>
                            <th>Revenue</th>
                        </tr>
                        </thead>
                        <tbody>
                        {(analytics.branchAnalytics || []).map((row) => (
                            <tr key={row.branch}>
                                <td>{row.branch}</td>
                                <td>{row.totalRegistrations}</td>
                                <td>{row.paidRegistrations}</td>
                                <td>{row.attendanceCount}</td>
                                <td>{(row.attendanceRate || 0).toFixed(1)}%</td>
                                <td>Rs.{(row.totalRevenue || 0).toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="analytics-table-section">
                <h3>Semester-wise Summary</h3>
                <div className="admin-events-table">
                    <table>
                        <thead>
                        <tr>
                            <th>Semester</th>
                            <th>Registrations</th>
                            <th>Paid</th>
                            <th>Attendance</th>
                            <th>Attendance %</th>
                            <th>Revenue</th>
                        </tr>
                        </thead>
                        <tbody>
                        {(analytics.semesterAnalytics || []).map((row) => (
                            <tr key={row.semester}>
                                <td>{row.semester}</td>
                                <td>{row.totalRegistrations}</td>
                                <td>{row.paidRegistrations}</td>
                                <td>{row.attendanceCount}</td>
                                <td>{(row.attendanceRate || 0).toFixed(1)}%</td>
                                <td>Rs.{(row.totalRevenue || 0).toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="analytics-table-section">
                <h3>Branch + Semester Summary</h3>
                <div className="admin-events-table">
                    <table>
                        <thead>
                        <tr>
                            <th>Branch</th>
                            <th>Semester</th>
                            <th>Registrations</th>
                            <th>Paid</th>
                            <th>Attendance</th>
                            <th>Attendance %</th>
                            <th>Revenue</th>
                        </tr>
                        </thead>
                        <tbody>
                        {(analytics.branchSemesterAnalytics || []).map((row) => (
                            <tr key={`${row.branch}-${row.semester}`}>
                                <td>{row.branch}</td>
                                <td>{row.semester}</td>
                                <td>{row.totalRegistrations}</td>
                                <td>{row.paidRegistrations}</td>
                                <td>{row.attendanceCount}</td>
                                <td>{(row.attendanceRate || 0).toFixed(1)}%</td>
                                <td>Rs.{(row.totalRevenue || 0).toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="analytics-table-section">
                <div className="student-filter-header">
                    <h3>Student List By Department and Semester</h3>
                    <button className="btn btn-secondary" onClick={handleDownloadStudentCsv} disabled={students.length === 0}>
                        Download Filtered Students CSV
                    </button>
                </div>
                <div className="analytics-filters">
                    <div className="form-group">
                        <label>Department</label>
                        <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                            {DEPARTMENTS.map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Semester</label>
                        <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                            {SEMESTERS.map((sem) => (
                                <option key={sem} value={sem}>{sem}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="admin-events-table">
                    <table>
                        <thead>
                        <tr>
                            <th>Reg ID</th>
                            <th>Name</th>
                            <th>Roll No</th>
                            <th>Department</th>
                            <th>Semester</th>
                            <th>Payment</th>
                            <th>Attendance</th>
                        </tr>
                        </thead>
                        <tbody>
                        {studentsLoading && (
                            <tr>
                                <td colSpan="7">Loading filtered students...</td>
                            </tr>
                        )}
                        {!studentsLoading && students.length === 0 && (
                            <tr>
                                <td colSpan="7">No students found for selected filters.</td>
                            </tr>
                        )}
                        {!studentsLoading && students.map((student) => (
                            <tr key={student.regId}>
                                <td>{student.regId}</td>
                                <td>{student.studentName}</td>
                                <td>{student.rollNo}</td>
                                <td>{student.department}</td>
                                <td>{student.semester}</td>
                                <td>{student.paymentStatus}</td>
                                <td>{student.attendanceStatus}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
