'use client';
import IconLockDots from '@/components/icon/icon-lock-dots';
import { useRouter } from 'next/navigation';
import React  from 'react';

const ComponentsAuthUnlockForm = () => {
    const router = useRouter();
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    const submitForm = async (e) => {
        e.preventDefault();
        const email = sessionStorage.getItem('emailLockScreen');
        try {
            const response = await fetch(`${process.env.domainApi}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email , password }),
            });

            if (response.ok) {
                const data = await response.json();
                const expireAT = data.expiresAt;
                if (data.token) {
                    sessionStorage.setItem('emailLockScreen', email);
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('username', data.username);
                    sessionStorage.setItem('userId', data.id)
                    sessionStorage.setItem('loginTime', Math.floor(Date.now() / 1000));
                    sessionStorage.setItem('expireAT', expireAT);
                    router.push('/');
                } else {
                    setErrorMessage('Sai mật khẩu');
                    router.push('/auth/boxed-lockscreen');
                }
            } else {
                setErrorMessage('Sai mật khẩu');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <form className="space-y-5" onSubmit={submitForm}>
            <div>
                <label htmlFor="Password" className="dark:text-white">
                    Password
                </label>
                <div className="relative text-white-dark">
                    <input
                        id="Password"
                        type="password"
                        placeholder="Enter Password"
                        className="form-input ps-10 placeholder:text-white-dark"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconLockDots fill={true} />
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
                UNLOCK
            </button>
        </form>
    );
};

export default ComponentsAuthUnlockForm;
