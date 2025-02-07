'use client';;
import Dropdown from '@/components/dropdown';
import IconCaretsDown from '@/components/icon/icon-carets-down';
import IconChatDots from '@/components/icon/icon-chat-dots';
import IconChecks from '@/components/icon/icon-checks';
import IconChrome from '@/components/icon/icon-chrome';
import IconClock from '@/components/icon/icon-clock';
import IconCreditCard from '@/components/icon/icon-credit-card';
import IconFile from '@/components/icon/icon-file';
import IconGlobe from '@/components/icon/icon-globe';
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots';
import IconLink from '@/components/icon/icon-link';
import IconMail from '@/components/icon/icon-mail';
import IconPlus from '@/components/icon/icon-plus';
import IconSafari from '@/components/icon/icon-safari';
import IconServer from '@/components/icon/icon-server';
import IconSquareCheck from '@/components/icon/icon-square-check';
import IconThumbUp from '@/components/icon/icon-thumb-up';
import IconTrendingUp from '@/components/icon/icon-trending-up';
import IconUsersGroup from '@/components/icon/icon-users-group';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector , useDispatch} from 'react-redux';
import { startOfToday, endOfYesterday, startOfWeek, startOfMonth } from 'date-fns';


const ComponentsDashboardAnalytics = () => {
    const isDark = useSelector(
        (state) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode
    );
    const isRtl = useSelector((state) => state.themeConfig.rtlClass) === 'rtl';
    const [isMounted, setIsMounted] = useState(false);
    const [startDay , setStartDay] = useState(new Date());
    const [data , setData] = useState([]);
    const [displayDay , setDisplayDay] = useState('Hôm nay');

    const fetchData = async (date) => {
        try {
            const url = `${process.env.domainApi}/api/statistic?startDate=${date.toISOString().split('T')[0]}`; 
            const response = await fetch(url , {
                method: 'GET',
                headers: {
                    'authorization': `${sessionStorage.getItem('token')}`
                    }
            });
            const data = await response.json();
            console.log(data);
            setData(data);
        } catch (error) {
            console.error('Error fetching blog:', error);
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        fetchData(startDay); // Fetch data for the selected date
    }, [startDay]);
    const handleSetStartday = (day) => {
        let date;
        let display;
        switch (day) {
            case 'Hôm nay':
                display = 'Hôm nay';
                date = new Date();
                break;
            case 'Hôm qua':
                display = 'Hôm qua';
                date = endOfYesterday();
                break;
            case 'Tuần này':
                display = 'Tuần này';
                date = startOfWeek(new Date(), { weekStartsOn: 1 });
                date.setHours(0, 0, 0, 0);
                break;
            case 'Tháng này':
                display = 'Tháng này';
                date = startOfMonth(new Date());
                break;
            default:
                date = new Date();
        }
        setStartDay(date);
        setDisplayDay(display);
    };
    
    useEffect(() => {
        fetchData(startDay); // Fetch data for the selected date
    }, [startDay]);
    


   
 

    const role = sessionStorage.getItem('role');
  
    return (
        <div>
            {role === "1" ? (
                <div className="pt-5">
                    <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" style={{ width: "1800px" }}>
                        <div className="panel h-full lg:col-span-1">
                            {/* statistics */}
                            <div className="mb-5 flex justify-between dark:text-white-light">
                                <h5 className="text-lg font-semibold">Statistics</h5>
                                <div className="dropdown">
                                    <Dropdown
                                        offset={[0, 5]}
                                        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                        btnClassName="hover:text-primary"
                                        button={<IconHorizontalDots className="text-black/70 hover:!text-primary dark:text-white/70" />}
                                    >
                                        <ul>
                                            <li>
                                                <button type="button" onClick={() => handleSetStartday('Hôm nay')}>Hôm nay</button>
                                            </li>
                                            <li>
                                                <button type="button" onClick={() => handleSetStartday('Hôm qua')}>Hôm qua</button>
                                            </li>
                                            <li>
                                                <button type="button" onClick={() => handleSetStartday('Tuần này')}>Tuần này</button>
                                            </li>
                                            <li>
                                                <button type="button" onClick={() => handleSetStartday('Tháng này')}>Tháng này</button>
                                            </li>
                                        </ul>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="grid gap-8 text-sm font-bold text-[#515365] sm:grid-cols-2">
                                <div>
                                    <div>
                                        <div>Đã duyệt</div>
                                        <div className="text-lg text-[#f8538d]">Web : {data.publishedCount}</div>
                                        <div className="text-lg text-[#f8538d]">FB : {data.publishedCountFb}</div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <div>Chưa duyệt</div>
                                        <div className="text-lg text-[#f8538d]">Web : {data.draftCount}</div>
                                        <div className="text-lg text-[#f8538d]">FB : {data.draftCountFb}</div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <div>Lấy về</div>
                                        <div className="text-lg text-[#f8538d]">Web : {data.totalCount}</div>
                                        <div className="text-lg text-[#f8538d]">FB : {data.totalCountFb}</div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <div>Gen AI</div>
                                        <div className="text-lg text-[#f8538d]">Web : {data.aiCount}</div>
                                        <div className="text-lg text-[#f8538d]">FB : {data.aiCountFb}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <div className="panel h-full" style={{width : "350px"}}>
                            <div className="mb-5 flex justify-between dark:text-white-light">
                                <h5 className="text-lg font-semibold">Tổng số bài</h5>
                            </div>
                            <div className="my-10 text-3xl font-bold text-[#e95f2b]">
                                <span>Web : {data.allPostsCount} </span>
                                <IconTrendingUp className="inline text-success" />
                            </div>
                            <div className="my-10 text-3xl font-bold text-[#e95f2b]">
                                <span>ChatGPT : {data.allBlogGPT} </span>
                                <IconTrendingUp className="inline text-success" />
                            </div>
                            <div className="my-10 text-3xl font-bold text-[#e95f2b]">
                                <span>FB : {data.allPostsCountFb} </span>
                                <IconTrendingUp className="inline text-success" />
                            </div>
                        </div>
                        <div className="panel h-full" style={{width : "350px" , marginLeft : "-230px"}}>
                            <div className="mb-5 flex justify-between dark:text-white-light">
                                <h5 className="text-lg font-semibold">Tổng bài đã đăng lên Web</h5>
                            </div>
                            <div className="my-10 text-3xl font-bold text-[#e95f2b]">
                                <span>Web : {data.allPublishedCount} </span>
                                <IconTrendingUp className="inline text-success" />
                            </div>
                            <div className="my-10 text-3xl font-bold text-[#e95f2b]">
                                <span>FB : {data.allPublishedFbCount} </span>
                                <IconTrendingUp className="inline text-success" />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="no-access">
                    <h2>Không phận sự</h2>
                </div>
            )}
        </div>
    );
};

export default ComponentsDashboardAnalytics;
