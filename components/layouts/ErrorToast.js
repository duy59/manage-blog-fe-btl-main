import React from 'react';
import { toast } from 'react-toastify';
import "../../styles/alertStyle.css";

const ErrorToast = ({ message  , time}) => {
    toast.error(message, {
        className: 'toast-error',
        autoClose: time // Set auto close time to 5 seconds
    });
    return null;
};

export default ErrorToast;