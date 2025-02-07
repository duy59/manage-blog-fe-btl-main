"use client"
import React from 'react';
import { useLocation } from 'react-router-dom';

const EditManyUser = () => {
    const location = useLocation();
    const { selectedUsers } = location.state || {};

    console.log(selectedUsers);

    return (
        <div>
            <h1>Edit Many User</h1>
            <p>Selected users: {selectedUsers.join(', ')}</p>
        </div>
    );
};

export default EditManyUser;