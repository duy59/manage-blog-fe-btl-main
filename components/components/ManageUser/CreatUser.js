"use client"
import React, { useState } from 'react';
import '../../../styles/createUser.css'; 
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SuccessToast from '@/components/layouts/SuccessToast';
import ErrorToast from '@/components/layouts/ErrorToast';
import { set } from 'lodash';

const CreateUser = () => {
    const router = useRouter();
    const [error , setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullName: '',
        birthday: '',
        role_id: '',
        status: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        const { username, email, password, birthday } = formData;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        const passwordRegex = {
            length: /.{6,}/,
            lowercase: /[a-z]/,
            uppercase: /[A-Z]/,
            number: /\d/,
            specialChar: /[!@#$%^&*(),.?":{}|<>]/
        };
    
        if (!username) {
            setError('Username is required');
            return false;
        }
        if (username.length > 255) {
            setError('Username must be at most 255 characters long');
            return false;
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            setError('Username must not contain special characters');
            return false;
        }
    
        if (!email) {
            setError('Email is required');
            return false;
        }
        if (!emailRegex.test(email)) {
            setError('Email must be a valid @gmail.com address');
            return false;
        }
    
        if (password) {
            if (!passwordRegex.length.test(password)) {
                setError('Password must be at least 6 characters long');
                return false;
            }
            if (!passwordRegex.lowercase.test(password)) {
                setError('Password must contain at least one lowercase letter');
                return false;
            }
            if (!passwordRegex.uppercase.test(password)) {
                setError('Password must contain at least one uppercase letter');
                return false;
            }
            if (!passwordRegex.number.test(password)) {
                setError('Password must contain at least one number');
                return false;
            }
            if (!passwordRegex.specialChar.test(password)) {
                setError('Password must contain at least one special character');
                return false;
            }
        }
    
        if (!birthday) {
            setError('Birthday is required');
            return false;
        }
        if (isNaN(Date.parse(birthday))) {
            setError('Birthday is not a valid date');
            return false;
        }
    
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        const token = sessionStorage.getItem('token');
        const data = {
            username: formData.username,
            password: formData.password,
            email: formData.email,
            fullName: formData.fullName,
            birthday: formData.birthday,
            role_id: formData.role_id,
            status: formData.status
        };
        console.log(data);
        const response = await fetch(`${process.env.domainApi}/api/user/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                        'authorization': `${token}`
             },
            body: JSON.stringify(data)
        });
        if(response.ok) {
            const data = await response.json();
            if(data.code == 200)
            {   
                SuccessToast({message: 'User created successfully', time: 2000});
                
                setTimeout(() => {
                    router.push('/manageuser');
                }, 2000);
            }
            else{
                if(data.message)
                {
                    setError( data.message);
                }
                else{
                    setError( data.message[0].msg);
                }
            }
        } else {
            console.log("failed to create user");
            ErrorToast({message: 'Failed to create user', time: 2000});
        }
    };

    return (
        <div className="box-create-user">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Full Name:</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Birthday:</label>
                    <input
                        type="date"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <select
                        name="role_id"
                        value={formData.role_id}
                        onChange={handleChange}
                    >
                        <option value="">Select Role</option>
                        <option value="2">CTV</option>
                        <option value="1">Admin</option>
                    </select>
                </div>
                <div>
                    <label>Status:</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="">Select Status</option>
                        <option value="đi làm">Active</option>
                        <option value="nghỉ làm">Inactive</option>
                    </select>
                </div>
                <button type="submit" style={{backgroundColor:"#0056b3"}}>Create User</button>
                <div>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default CreateUser;