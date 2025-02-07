import React from 'react';
import { toast } from 'react-toastify';
import "../../styles/alertStyle.css";

const SuccessToast = ({ message , time }) => {
    toast.success(message, {
        className: 'toast-success',
        autoClose: time
    });
    return null;
};

export default SuccessToast;