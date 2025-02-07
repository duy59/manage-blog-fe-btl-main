"use client"
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IconPencilPaper from '@/components/icon/icon-pencil-paper';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import "../../../styles/Manage.css";
import { useRouter } from 'next/navigation'; 
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SuccessToast from '@/components/layouts/SuccessToast';
import ErrorToast from '@/components/layouts/ErrorToast';

const ManageUser = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading , setLoading] = useState(false);
    const loggedInUserId = sessionStorage.getItem('userId');
    const role = sessionStorage.getItem('role');
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.domainApi}/api/user`);
                const data = await response.json();
                const filteredUsers = data.users.filter(user => user._id !== loggedInUserId);
                setUsers(filteredUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [loggedInUserId]);

    useEffect(() => {
    }, [users]);

    const handleOnClick = () => {
        router.push('/manageuser/create-user');
    };

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${process.env.domainApi}/api/user/delete/${userId}`, {
                method: 'DELETE',
                headers: { 'authorization': `${token}` }
            });
            if(response.ok) {
                SuccessToast({message: 'User deleted successfully', time: 2000});
                setUsers(users.filter(user => user._id !== userId));
            } else {
                ErrorToast({message: 'Failed to delete user', time: 2000});
            }
        }
    };
    const handleDeleteAssign = async (userId) => {
          const token = sessionStorage.getItem('token');
          const url = `${process.env.domainApi}/api/blog/deleteAssignBlogs/${userId}`;
          const response = await fetch(url, {
                method: 'DELETE',
                headers: { 'authorization': `${token}` }
            });
            if(response.ok) {
                const data = await response.json();
                if(data.code == 200) {
                    SuccessToast({message: 'Assign Blogs deleted successfully', time: 2000});
                }
            } else {
                ErrorToast({message: 'Failed to delete assign blogs', time: 2000});
            }
    };

    const handleCheckboxChange = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    }
    
    const handleEdit = (userId) => {
        router.push(`/manageuser/edit-user?id=${userId}`);
    }
    const handleCombinedClick = async (userId) => {
        setLoading(true); // Bắt đầu loading
        try {
            await handleDelete(userId);
            await handleDeleteAssign(userId);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };
    const handleDeleteMany = async (selectedUsers) => {
        const confirmDelete = window.confirm("Bạn có muốn xóa những người dùng này?");
        if (confirmDelete) {
            const token = sessionStorage.getItem('token');
            try {
                const response = await fetch(`${process.env.domainApi}/api/user/delete`, {
                    method: 'DELETE',
                    headers: { 
                        'authorization': `${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ids : selectedUsers })
                });
    
                if (!response.ok) {
                    ErrorToast({ message: 'Failed to delete users', time: 2000 });
                    return;
                }
                
                else {
                    const data = await response.json();
                    if(data.code == 200) 
                    {
                        SuccessToast({ message: 'Users deleted successfully', time: 2000 });
                        setUsers(users.filter(user => !selectedUsers.includes(user._id)));
                        setSelectedUsers([]);
                    } else {
                        ErrorToast({ message: data.message, time: 2000 });
                    }
                }
            } catch (error) {
                console.error('Error deleting users:', error);
                ErrorToast({ message: 'Failed to delete users', time: 2000 });
            }
        }
    };


    return (
        (role === '1') ? (
            <div className='box-manage-user'>
                <h1>Manage User</h1>
                <button style={{background : "blue" , color : "white"}} onClick={handleOnClick}>+ Add new User</button>
                {selectedUsers.length > 0 && (
                <div className="multi-action-buttons" 
                    style={{display : "flex" , position : "absolute" , right : "50px", top : "150px" , gap : "10px"}}
                >
                    <button className="btn-delete-selected" 
                    style={{background : "red" , color : "white"}}
                    onClick={() => {
                        handleDeleteMany(selectedUsers);
                    }}
                    >Delete Selected</button>
                    <button className="btn-edit-selected"
                    style={{background : "green" , color : "white"}}
                    >Edit Selected</button>
                </div>
                  )}
                <table>
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Serial No</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <td><input type="checkbox" onChange={() => handleCheckboxChange(user._id)}/></td>
                                <td>{index + 1}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role_id}</td>
                                <td>{user.status}</td>
                                <td style={{ display: 'flex', gap: '10px' }}>
                                    <button type="button" style={{ display: 'flex', alignItems: 'center'}}
                                     onClick = {() => handleEdit(user._id)}
                                    >
                                        <IconPencilPaper className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                        Edit
                                    </button>
                                    <button type="button" style={{ display: 'flex', alignItems: 'center' }}
                                    onClick={() => handleCombinedClick(user._id)}
                                    >
    
                                        {loading ? (
                                            <span className="animate-spin border-4 border-t-transparent border-white rounded-full w-5 h-5 inline-block"></span>
                                        ) : (
                                           <>
                                            <IconTrashLines className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                            Delete User
                                           </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div>
                <h1>Unauthorized</h1>
            </div>
        )
    );
};

export default ManageUser;
