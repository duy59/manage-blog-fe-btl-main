"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../../styles/editUser.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SuccessToast from '@/components/layouts/SuccessToast';
import ErrorToast from '@/components/layouts/ErrorToast';


const EditUser = () => {
    const router = useRouter();
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');
    const token = sessionStorage.getItem("token");

    const [initialData, setInitialData] = useState({
        username: '',
        password: '',
        email: '',
        status: '',
        role_id: ''
    });

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        status: '',
        role_id: ''
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const id = searchParams.get('id');
        setUserId(id);
    }, []);

    useEffect(() => {
        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${process.env.domainApi}/api/user/detail/${userId}`, {
                method: 'GET',
                headers: {
                    'authorization': `${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setInitialData({
                    username: data.username,
                    password: '', 
                    email: data.email,
                    status: data.status,
                    role_id: data.role_id
                });
                setFormData({
                    username: data.username,
                    password: '', 
                    email: data.email,
                    status: data.status,
                    role_id: data.role_id
                });
            } else {
                setError('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('An error occurred while fetching user data');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const validateFormData = (data) => {
        const errors = {};
    
        if (data.username && (typeof data.username !== 'string' || data.username.length < 3)) {
            errors.username = 'Username must be a string and at least 3 characters long';
        }
    
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = 'Invalid email format';
        }
    
        if (data.birthday && !/^\d{4}-\d{2}-\d{2}$/.test(data.birthday)) {
            errors.birthday = 'Invalid date format';
        }
    
        if (data.password) {
            if (data.password.length < 6) {
                errors.password = 'Password must be at least 6 characters long';
            }
            if (!/[a-z]/.test(data.password)) {
                errors.password = 'Password must contain at least one lowercase letter';
            }
            if (!/[A-Z]/.test(data.password)) {
                errors.password = 'Password must contain at least one uppercase letter';
            }
            if (!/\d/.test(data.password)) {
                errors.password = 'Password must contain at least one number';
            }
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
                errors.password = 'Password must contain at least one special character';
            }
        }
    
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();    

        const errors = validateFormData(formData);
        if (Object.keys(errors).length > 0) {
            ErrorToast({ message: "Validation errors: " + JSON.stringify(errors), time: 5000 });
            return;
        }

        const changes = {};
    
        Object.keys(formData).forEach(key => {
            if (formData[key] !== initialData[key]) {
                changes[key] = formData[key];
            }
        });
    
        if (Object.keys(changes).length === 0) {
            ErrorToast({ message: "No changes detected", time: 5000 });
            return;
        }
    
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${process.env.domainApi}/api/user/update/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${token}`,
                },
                body: JSON.stringify(changes),
            });
    
            if (response.ok) {
                SuccessToast({ message: 'Profile updated successfully', time: 2000 });
                setTimeout(() => {
                    router.push('/manageuser');
                }, 2000);
            } else {
                const errorData = await response.json();
                console.error('Failed to update profile:', errorData);
                ErrorToast({ message: "Failed to update profile: " + (errorData.message || 'Unknown error'), time: 5000 });
            }
        } catch (error) {
            console.error('An error occurred:', error);
            ErrorToast({ message: "An error occurred: " + error.message, time: 5000 });
        }
    };

    return (
        <div className='form-edit-user'>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        placeholder={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        placeholder={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Status:</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="">{formData.status}</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div>
                    <label>Role ID:</label>
                    <select
                        name="role_id"
                        value={formData.role_id}
                        onChange={handleChange}
                    >
                        <option value="">{formData.role_id}</option>
                        <option value="1">admin</option>
                        <option value="2">CTV</option>
                    </select>
                </div>
                <button type="submit">Submit</button>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </form>
            <ToastContainer />
        </div>
    );
};

export default EditUser;