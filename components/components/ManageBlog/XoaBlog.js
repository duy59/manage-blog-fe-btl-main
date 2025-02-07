"use client"

import React, { useState } from 'react';
import './XoaBlog.css'; // Import the CSS file

function DeleteBlogs() {
    const [date, setDate] = useState('');
    const [result, setResult] = useState('');

    const handleSubmit = async () => {
        if (!date) {
            alert('Vui lòng chọn một ngày.');
            return;
        }

        try {
            const response = await fetch(`${process.env.domainApi}/api/blog/abcd/deletedate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({ date: date })
            });

            if (response.ok) {
                const data = await response.json();
                setResult(data.message);
            } else {
                const errorText = await response.text();
                console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                setResult('Đã xảy ra lỗi.');
            }
        } catch (error) {
            console.error('Error:', error);
            setResult('Đã xảy ra lỗi.');
        }
    };

    return (
        <div className="delete-blogs-container">
            <h1>Xóa Blog Trước Ngày Chọn</h1>
            <label htmlFor="dateInput">Chọn ngày:</label>
            <input
                type="date"
                id="dateInput"
                name="dateInput"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <button onClick={handleSubmit}>Xóa Blog</button>
            <p>{result}</p>
        </div>
    );
}

export default DeleteBlogs;