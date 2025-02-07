"use client"
import React, { useState, useEffect } from 'react';
import './ChiaviecCtv.css'; // Import file CSS
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../../styles/alertStyle.css";
const ChiaviecCtv = () => {
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [countCategory, setCountCategory] = useState(0);

    const fetchUsers = async () => {
        try {
            const url = `${process.env.domainApi}/api/user?role_id=2`
            const response = await fetch(url , {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization" : `${sessionStorage.getItem('token')}`
                }
            }); 
            const data = await response.json();
            setUsers(data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const url = `${process.env.domainApi}/api/category`
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization" : `${sessionStorage.getItem('token')}`
                }
            }); // Thay thế URL bằng API thực tế của bạn
            const data = await response.json();
            setCategories(data.data);
            setCountCategory(data.data.length);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchCategories();
    }, []);

    const handleUserChange = (userId) => {
        setSelectedUsers((prevSelectedUsers) =>
            prevSelectedUsers.includes(userId)
                ? prevSelectedUsers.filter((id) => id !== userId)
                : [...prevSelectedUsers, userId]
        );
    };

    const handleCategoryChange = (categorySlug) => {
        setSelectedCategories((prevSelectedCategories) =>
            prevSelectedCategories.includes(categorySlug)
                ? prevSelectedCategories.filter((slug) => slug !== categorySlug)
                : [...prevSelectedCategories, categorySlug]
        );
    };


    const handleDeleteCate = async () => {
        try {
            const response = await fetch(`${process.env.domainApi}/api/category/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization" : `${sessionStorage.getItem('token')}`
                },
            });
            if(response.ok) {
                toast.success('Xóa chia việc thành công', {
                    className: 'toast-success',
                    autoClose: 5000
                });
                fetchCategories();
            } else {
                toast.error('Lỗi', {
                    className: 'toast-error',
                    autoClose: 5000
                });
                console.error('Error fetching data from response:', response.statusText);
            }
        } catch (error) {
            console.error('Error during fetch operations:', error);
        }
    };

    const handleSubmit = async () => {
        console.log(selectedUsers);
        console.log(selectedCategories);
        try {
            const data = { slugs: selectedCategories, idsCtv: selectedUsers };
            const data1 = { slugs : selectedCategories};
            const url = `${process.env.domainApi}/api/category/update`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization" : `${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                toast.success('Chia việc thành công', {
                    className: 'toast-success',
                    autoClose: 5000 
                });
                setSelectedUsers([]);
                setSelectedCategories([]);
                fetchCategories();  
            } else {
                toast.error('Lỗi', {
                    className: 'toast-error',
                    autoClose: 5000 
                });
                console.error('Error fetching data from response:', response.statusText);
            }
        } catch (error) {
            console.error('Error during fetch operations:', error);
        }
    };

    return (
        <div className="container">
            <div className="list-container">
                <h2>Users</h2>
                <ul>
                    {users.map((user) => (
                        <li key={user._id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user._id)}
                                    onChange={() => handleUserChange(user._id)}
                                />
                                {user.username}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="list-container">
                <h2>Categories</h2>
                <p>Số lượng chuyên mục chưa được chia: {countCategory}</p>
                <ul>
                    {categories.map((category) => (
                        <li key={category._id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.slug)}
                                    onChange={() => handleCategoryChange(category.slug)}
                                />
                                {category.name}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='xoachiaviec'>
                <button className="submit-button" onClick={handleDeleteCate}>Xóa chia việc</button>
            </div>
            <div className="selected-container">
                <h2>Selected Users and Categories</h2>
                <table className="selected-table">
                    <thead>
                        <tr>
                            <th>Selected Users</th>
                            <th>Selected Categories</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    {selectedUsers.map((userId) => {
                                        const user = users.find((user) => user._id === userId);
                                        return <li key={userId}>{user?.username}</li>;
                                    })}
                                </ul>
                            </td>
                            <td>
                                <ul>
                                    {selectedCategories.map((categorySlug) => {
                                        const category = categories.find((category) => category.slug === categorySlug);
                                        return <li key={categorySlug}>{category?.name}</li>;
                                    })}
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {selectedUsers.length > 0 && selectedCategories.length > 0 && (
                <button className="submit-button" onClick={handleSubmit}>Submit</button>
            )}
            <ToastContainer />
        </div>
    );
};

export default ChiaviecCtv;