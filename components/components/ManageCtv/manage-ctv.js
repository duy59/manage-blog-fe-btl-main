"use client"
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../styles/manageCTV.css'; // Import file CSS

const ManageCtv = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // Thêm trạng thái loading
    const [selectedFromCtv, setSelectedFromCtv] = useState('');
    const [selectedToCtv, setSelectedToCtv] = useState('');

    const fetchData = async () => {
        try {
            const url = `${process.env.domainApi}/api/statistic/statisticsCTV`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'authorization': `${sessionStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setData(result.data);
            console.log(result.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Error fetching data', {
                className: 'toast-error',
                autoClose: 5000 
            });
        } finally {
            setLoading(false); // Đặt loading thành false sau khi dữ liệu đã được tải
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFromCtvChange = (e) => {
        setSelectedFromCtv(e.target.value);
    };

    const handleToCtvChange = (e) => {
        setSelectedToCtv(e.target.value);
    };

    const handleSubmit = async () => {
        if (!selectedFromCtv || !selectedToCtv) {
            toast.error('Please select both CTVs', {
                className: 'toast-error',
                autoClose: 5000 
            });
            return;
        }

        try {
            const url = `${process.env.domainApi}/api/blog/duybeo/chuyenCV`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({ userIdChuyen: selectedFromCtv, userIdNhan: selectedToCtv })
            });

            if (response.ok) {
                toast.success('Chuyển việc thành công', {
                    className: 'toast-success',
                    autoClose: 5000
                });
                setTimeout(() => {
                    fetchData(); // Refresh data after successful swap
                    setSelectedFromCtv('');
                    setSelectedToCtv('');
                }, 5000); // Đợi 5 giây trước khi làm mới dữ liệu
                const response2 = await fetch(`${process.env.domainApi}/api/blog/duybeo/laytenCtv`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "authorization" : `${sessionStorage.getItem('token')}`
                    },
                });
                if(response2.ok) {
                    console.log(await response2.json());
                } else {
                    console.error('Error fetching data from response2:', response2.statusText);
                }
            } else {
                toast.error('Error swapping tasks', {
                    className: 'toast-error',
                    autoClose: 5000 
                });
            }
        } catch (error) {
            console.error('Error swapping tasks:', error);
            toast.error('Error swapping tasks', {
                className: 'toast-error',
                autoClose: 5000 
            });
        }
    };

    if (loading) {
        return (
            <div>
                <h1 className="text-center">
                    <span className="animate-[spin_2s_linear_infinite] border-8 border-[#f1f2f3] border-l-primary border-r-primary rounded-full w-14 h-14 inline-block align-middle m-auto mb-10"></span>
                </h1>
            </div>
        ); // Render loading indicator
    }

    return (
        <>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Total Managed</th>
                            <th>Total Published</th>
                            <th>Total Draft</th>
                            <th>Total AI</th>
                            <th>Chuyên mục phụ trách</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.userId}>
                                    <td>{item.username}</td>
                                    <td>{item.totalManaged}</td>
                                    <td>{item.totalPublished}</td>
                                    <td>{item.totalDraft}</td>
                                    <td>{item.totalAI}</td>
                                    <td>
                                    <ul>
                                        {item.userInCategory.map((category, index) => (
                                            <li key={index}>{category}</li>
                                        ))}
                                    </ul>
                                </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="swap-container">
                <h2>Swap Tasks Between CTVs</h2>
                <div className="swap-select">
                    <label htmlFor="fromCtv">From CTV:</label>
                    <select id="fromCtv" value={selectedFromCtv} onChange={handleFromCtvChange}>
                        <option value="">Select CTV</option>
                        {data.map((item) => (
                            <option key={item.userId} value={item.userId}>{item.username}</option>
                        ))}
                    </select>
                </div>
                <div className="swap-select">
                    <label htmlFor="toCtv">To CTV:</label>
                    <select id="toCtv" value={selectedToCtv} onChange={handleToCtvChange}>
                        <option value="">Select CTV</option>
                        {data.map((item) => (
                            <option key={item.userId} value={item.userId}>{item.username}</option>
                        ))}
                    </select>
                </div>
                <button className="submit-button" onClick={handleSubmit}>Submit</button>
            </div>
            <ToastContainer />
        </>
    );
};

export default ManageCtv;