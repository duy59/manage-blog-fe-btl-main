"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import "../../../../styles/resetpass.css";

const ResetPassword = () => {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [session_id, setSession_id] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const storedSession_id = sessionStorage.getItem('session_id');
        if (storedSession_id) {
            setSession_id(storedSession_id);
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message
        console.log(session_id);
        console.log(newPassword);
        if (newPassword === confirmPassword) {
           const response = await fetch(`${process.env.domainApi}/api/resetpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ session_id, password: newPassword }),
            });
            if(response.ok){
                const data = await response.json();
                console.log(data);
                if(data.code == 200)
                {
                    alert('Password reset successfully');
                    router.push('/auth/boxed-signin');
                }
                else {
                    setErrorMessage('Mật khẩu không đúng');
                    console.error('Login failed');
                }
            }
            else {
                setErrorMessage('Sai thông tin đăng nhập');
                console.error('Login failed');
            }
        } else {        
            setErrorMessage('Mật khẩu không khớp');
        }
    };

    return (
        <form className="form-boxed" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="newPassword">Mật khẩu mới:</label>
                <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu mới:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                />
            </div>
            {errorMessage && (
                <div className="error-message">
                    {errorMessage}
                </div>
            )}
            <button type="submit" className="form-button">Đặt lại mật khẩu</button>
        </form>
    );
};

export default ResetPassword;