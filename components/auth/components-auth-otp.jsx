'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const OTP = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('email'); 
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            console.error('Email not found');
        }
    }, [router]);

    const submitForm = async (e) => {
        console.log(email); 
        e.preventDefault();
        setErrorMessage(''); // Reset error message
        try {
            const response = await fetch(`${process.env.domainApi}/api/otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.code == 200) {   
                    sessionStorage.setItem('session_id', data.session_id);
                    router.push('/auth/boxed-reset-pass');
                } else {
                    setErrorMessage('OTP không đúng');
                    router.push('/auth/boxed-otp');
                    console.error('Login failed');
                }
            } 
        } catch (error) {
            setErrorMessage('An error occurred: ' + error.message);
            console.error('An error occurred:', error);
        }
    };

    return (
        <form className="" onSubmit={submitForm}>
            <div>
                <label htmlFor="Email" className="dark:text-white">
                </label>
                <div className="relative text-white-dark"
                    style={{ color: 'white', width: "50%", position: "relative", left: "30%", top: "30%" }}
                >
                    <input
                        placeholder="Enter OTP"
                        className="form-input ps-10 placeholder:text-white-dark"
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)}
                    />
                </div>
            </div>
            {errorMessage && (
                <div className="text-red-500" style={{ width: "50%", position: "relative", left: "30%", top: "30%" }}>
                    {errorMessage}
                </div>
            )}
            <button
                style={{ width: "50%", position: "relative", left: "30%", top: "30%" }}
                type="submit"
                className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                Xác nhận
            </button>
        </form>
    );
};

export default OTP;