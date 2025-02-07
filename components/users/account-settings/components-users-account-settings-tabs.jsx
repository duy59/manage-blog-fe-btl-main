'use client';
import IconDollarSignCircle from '@/components/icon/icon-dollar-sign-circle';
import IconFacebook from '@/components/icon/icon-facebook';
import IconGithub from '@/components/icon/icon-github';
import IconHome from '@/components/icon/icon-home';
import IconLinkedin from '@/components/icon/icon-linkedin';
import IconPhone from '@/components/icon/icon-phone';
import IconTwitter from '@/components/icon/icon-twitter';
import IconUser from '@/components/icon/icon-user';
import { set } from 'lodash';
import React, { useState , useEffect} from 'react';
import { useRouter } from 'next/navigation';
const ComponentsUsersAccountSettingsTabs = () => {
    const router = useRouter();
    const [tabs, setTabs] = useState('home');
    const [email , setEmail]  = useState("") ;
    const [password , setPassword] = useState("");
    const [fullName , setFullName] = useState("");
    const [userName , setUserName] = useState("")
    const toggleTabs = (name) => {
        setTabs(name);
    };
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const id = sessionStorage.getItem("userId");
                const response = await fetch(`${process.env.domainApi}/api/user/detail/${id}`, {
                    method: 'GET',
                    headers: {
                        'authorization': `${token}`, 
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    setUserName(result.username);
                    setFullName(result.fullName);
                    setPassword(result.password);
                    setEmail(result.email);
                    setData(result);
                } else {
                    setError('Failed to fetch data');
                }
            } catch (error) {
                setError('An error occurred: ' + error.message);
            }
        };

        fetchData();
    }, [router]);
    
    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }
    
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const changes = {};
        if (userName !== data.username) changes.username = userName;
        if (fullName !== data.fullName) changes.fullName = fullName;
        if (password !== data.password) changes.password = password;
        if (email !== data.email) changes.email = email;
             

        if (Object.keys(changes).length > 0) {
            console.log('Changes:', changes);
            try {
                const token = sessionStorage.getItem("token");
                const id = sessionStorage.getItem("userId");
                const response = await fetch(`${process.env.domainApi}/api/user/update/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `${token}`,
                    },
                    body: JSON.stringify(changes),
                });
    
                if (response.ok) {
                    alert('Profile updated successfully');
                    router.push('/users/profile');
                } else {
                    const errorData = await response.json();
                    console.error('Failed to update profile:', errorData);
                    alert('Failed to update profile: ' + (errorData.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('An error occurred:', error);
                alert('An error occurred: ' + error.message);
            }
        } else {
            alert('No changes to update');
        }
    };

    return (
        <div className="pt-5">
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">Settings</h5>
            </div>
            <div>
                <ul
                    className="mb-5 overflow-y-auto whitespace-nowrap border-b border-[#ebedf2] font-semibold dark:border-[#191e3a] sm:flex">
                    <li className="inline-block">
                        <button
                            onClick={() => toggleTabs('home')}
                            className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'home' ? '!border-primary text-primary' : ''}`}>
                            <IconHome />
                            Home
                        </button>
                    </li>
                </ul>
            </div>
            {tabs === 'home' ? (
                <div>
                    <form
                        className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black"
                        onSubmit={handleSubmitForm}
        
                        >
                        <h6 className="mb-5 text-lg font-bold">General Information</h6>
                        <div className="flex flex-col sm:flex-row">
                            <div className="mb-5 w-full sm:w-2/12 ltr:sm:mr-4 rtl:sm:ml-4">
                                <img
                                    src="/assets/images/avatar.jpg"
                                    alt="img"
                                    className="mx-auto h-20 w-20 rounded-full object-cover md:h-32 md:w-32" />
                            </div>
                            <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name">User Name</label>
                                    <input id="name" type="text" placeholder={data.username} className="form-input" 
                                    onChange={(e) => setUserName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="location">FullName</label>
                                    <input id="location" type="text" placeholder={data.fullName} className="form-input" 
                                    onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone">PassWord</label>
                                    <input
                                        id="phone"
                                        type="text"
                                        placeholder={data.password}
                                        className="form-input"
                                        onChange={(e) => setPassword(e.target.value)}
                                        />
                                </div>
                                <div>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder={data.email}
                                        className="form-input" 
                                        onChange={(e) => setEmail(e.target.value)}
                                        />
                                </div>
                                <div className="mt-3 sm:col-span-2">
                                    <button type="submit" className="btn btn-primary">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <form
                        className="rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                        <h6 className="mb-5 text-lg font-bold">Social</h6>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="flex">
                                <div
                                    className="flex items-center justify-center rounded bg-[#eee] px-3 font-semibold ltr:mr-2 rtl:ml-2 dark:bg-[#1b2e4b]">
                                    <IconLinkedin className="h-5 w-5" />
                                </div>
                                <input type="text" placeholder="jimmy_turner" className="form-input" />
                            </div>
                            <div className="flex">
                                <div
                                    className="flex items-center justify-center rounded bg-[#eee] px-3 font-semibold ltr:mr-2 rtl:ml-2 dark:bg-[#1b2e4b]">
                                    <IconTwitter className="h-5 w-5" />
                                </div>
                                <input type="text" placeholder="jimmy_turner" className="form-input" />
                            </div>
                            <div className="flex">
                                <div
                                    className="flex items-center justify-center rounded bg-[#eee] px-3 font-semibold ltr:mr-2 rtl:ml-2 dark:bg-[#1b2e4b]">
                                    <IconFacebook className="h-5 w-5" />
                                </div>
                                <input type="text" placeholder="jimmy_turner" className="form-input" />
                            </div>
                            <div className="flex">
                                <div
                                    className="flex items-center justify-center rounded bg-[#eee] px-3 font-semibold ltr:mr-2 rtl:ml-2 dark:bg-[#1b2e4b]">
                                    <IconGithub />
                                </div>
                                <input type="text" placeholder="jimmy_turner" className="form-input" />
                            </div>
                        </div>
                    </form>
                </div>
            ) : null}
        </div>
    );
};

export default ComponentsUsersAccountSettingsTabs;