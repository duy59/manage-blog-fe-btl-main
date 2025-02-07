'use client';
import IconMail from '@/components/icon/icon-mail';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const ComponentsAuthResetPasswordForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const submitForm = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message
        try {
            const response = await fetch(`${process.env.domainApi}/api/forgotpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.code == 200) {
                    sessionStorage.setItem('email', data.email);
                    router.push('/auth/boxed-otp');
                } else {
                    setErrorMessage('Email không tồn tại');
                    router.push('/auth/boxed-password-reset');
                    console.error('Login failed');
                }
            } 
        } catch (error) {
            setErrorMessage('An error occurred: ' + error.message);
            console.error('An error occurred:', error);
        }
    };

    return (
        <form className="space-y-5" onSubmit={submitForm}>
            <div>
                <label htmlFor="Email" className="dark:text-white">
                    Email
                </label>
                <div className="relative text-white-dark">
                    <input
                        id="Email"
                        type="email"
                        placeholder="Enter Email"
                        className="form-input ps-10 placeholder:text-white-dark"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconMail fill={true} />
                    </span>
                </div>
            </div>
            {errorMessage && (
                <div className="text-red-500">
                    {errorMessage}
                </div>
            )}
            <button
                type="submit"
                className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                RECOVER
            </button>
        </form>
    );
};

export default ComponentsAuthResetPasswordForm;