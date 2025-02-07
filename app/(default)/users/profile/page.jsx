"use client"
import IconCalendar from '@/components/icon/icon-calendar';
import IconClock from '@/components/icon/icon-clock';
import IconCoffee from '@/components/icon/icon-coffee';
import IconCreditCard from '@/components/icon/icon-credit-card';
import IconDribbble from '@/components/icon/icon-dribbble';
import IconGithub from '@/components/icon/icon-github';
import IconMail from '@/components/icon/icon-mail';
import IconMapPin from '@/components/icon/icon-map-pin';
import IconPencilPaper from '@/components/icon/icon-pencil-paper';
import IconPhone from '@/components/icon/icon-phone';
import IconShoppingBag from '@/components/icon/icon-shopping-bag';
import IconTag from '@/components/icon/icon-tag';
import IconTwitter from '@/components/icon/icon-twitter';
import Link from 'next/link';
import React, { useState , useEffect } from 'react';


const Profile = () => {
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
                    setData(result);
                } else {
                    setError('Failed to fetch data');
                }
            } catch (error) {
                setError('An error occurred: ' + error.message);
            }
        };

        fetchData();
    }, []);
    

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }
    const role = data.role_id
    const name = data.username
    const mail = data.email
    const birthday = data.birthday
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="#" className="text-primary hover:underline">
                        Users
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Profile</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-4">
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Profile</h5>
                            <Link
                                href="/users/user-account-settings"
                                className="btn btn-primary rounded-full p-2 ltr:ml-auto rtl:mr-auto">
                                <IconPencilPaper />
                            </Link>
                        </div>
                        <div className="mb-5">
                            <div className="flex flex-col items-center justify-center">
                                <img
                                    src="/assets/images/avatar.jpg"
                                    alt="img"
                                    className="mb-5 h-24 w-24 rounded-full  object-cover" />
                                <p className="text-xl font-semibold text-primary">{name}</p>
                            </div>
                            <ul
                                className="m-auto mt-5 flex max-w-[160px] flex-col space-y-4 font-semibold text-white-dark">
                                <li className="flex items-center gap-2">
                                    <IconCoffee className="shrink-0" /> {role}
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCalendar className="shrink-0" />
                                    {birthday}
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconMapPin className="shrink-0" />
                                    Việt Nam
                                </li>
                                <li>
                                    <button className="flex items-center gap-2">
                                        <IconMail className="h-5 w-5 shrink-0" />
                                        <span className="truncate text-primary">{mail}</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="panel lg:col-span-2 xl:col-span-3">
                        <div className="mb-5">
                            <h5 className="text-lg font-semibold dark:text-white-light">Task</h5>
                        </div>
                        <div className="mb-5">
                            <div
                                className="table-responsive font-semibold text-[#515365] dark:text-white-light">
                                <table className="whitespace-nowrap">
                                    <thead>
                                        <tr>
                                            <th>Projects</th>
                                            <th>Progress</th>
                                            <th>Task Done</th>
                                            <th className="text-center">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="dark:text-white-dark">
                                        <tr>
                                            <td>Figma Design</td>
                                            <td>
                                                <div className="flex h-1.5 w-full rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                                    <div className="w-[29.56%] rounded-full bg-danger"></div>
                                                </div>
                                            </td>
                                            <td className="text-danger">29.56%</td>
                                            <td className="text-center">2 mins ago</td>
                                        </tr>
                                        <tr>
                                            <td>Vue Migration</td>
                                            <td>
                                                <div className="flex h-1.5 w-full rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                                    <div className="w-1/2 rounded-full bg-info"></div>
                                                </div>
                                            </td>
                                            <td className="text-success">50%</td>
                                            <td className="text-center">4 hrs ago</td>
                                        </tr>
                                        <tr>
                                            <td>Flutter App</td>
                                            <td>
                                                <div className="flex h-1.5 w-full rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                                    <div className="w-[39%] rounded-full  bg-warning"></div>
                                                </div>
                                            </td>
                                            <td className="text-danger">39%</td>
                                            <td className="text-center">a min ago</td>
                                        </tr>
                                        <tr>
                                            <td>API Integration</td>
                                            <td>
                                                <div className="flex h-1.5 w-full rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                                    <div className="w-[78.03%] rounded-full  bg-success"></div>
                                                </div>
                                            </td>
                                            <td className="text-success">78.03%</td>
                                            <td className="text-center">2 weeks ago</td>
                                        </tr>

                                        <tr>
                                            <td>Blog Update</td>
                                            <td>
                                                <div className="flex h-1.5 w-full rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                                    <div className="w-full  rounded-full  bg-secondary"></div>
                                                </div>
                                            </td>
                                            <td className="text-success">100%</td>
                                            <td className="text-center">18 hrs ago</td>
                                        </tr>
                                        <tr>
                                            <td>Landing Page</td>
                                            <td>
                                                <div className="flex h-1.5 w-full rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                                    <div className="w-[19.15%] rounded-full  bg-danger"></div>
                                                </div>
                                            </td>
                                            <td className="text-danger">19.15%</td>
                                            <td className="text-center">5 days ago</td>
                                        </tr>
                                        <tr>
                                            <td>Shopify Dev</td>
                                            <td>
                                                <div className="flex h-1.5 w-full rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                                    <div className="w-[60.55%] rounded-full bg-primary"></div>
                                                </div>
                                            </td>
                                            <td className="text-success">60.55%</td>
                                            <td className="text-center">8 days ago</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
