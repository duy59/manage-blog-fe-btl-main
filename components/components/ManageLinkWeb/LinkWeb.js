'use client';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LinkWeb = () => {
    const [links, setLinks] = useState([]);
    const [newLink, setNewLink] = useState('');

    const token = sessionStorage.getItem('token');

    const fetchLinks = async () => {
        try {
            const response = await fetch(`${process.env.domainApi}/api/linkweb/getlinks`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token
                }
            });
            const data = await response.json();
            setLinks(data.data);
        } catch (error) {
            console.error('Error fetching links:', error);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const handleAddLink = async () => {
        try {
            const response = await fetch(`${process.env.domainApi}/api/linkweb/addlink`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token
                },
                body: JSON.stringify({ link: newLink })
            });
            const data = await response.json();
            if (data.code === 200) {
                toast.success(data.message);
                setNewLink('');
                fetchLinks();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error adding link:', error);
            toast.error('Error adding link');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const response = await fetch(`${process.env.domainApi}/api/linkweb/togglestatus/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token
                }
            });
            const data = await response.json();
            if (data.code === 200) {
                toast.success(data.message);
                fetchLinks();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error toggling status:', error);
            toast.error('Error toggling status');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Quản lý link web</h1>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <input
                    type="text"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    placeholder="Thêm link mới"
                    style={{ width: '300px', marginRight: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button onClick={handleAddLink} style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer' }}>
                    Thêm link
                </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2' }}>Link</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {links.map((link) => (
                        <tr key={link._id}>
                            <td style={{ border: '1px solid #ddd', padding: '12px' }}>{link.link}</td>
                            <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                                <button onClick={() => handleToggleStatus(link._id)} style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: link.status ? '#f44336' : '#4CAF50', color: 'white', cursor: 'pointer' }}>
                                    {link.status ? 'Ngừng cào' : 'Bắt đầu cào'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
        </div>
    );
};

export default LinkWeb;