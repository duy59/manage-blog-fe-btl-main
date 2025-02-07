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


const Thongke = () => {
    const isDark = useSelector(
        (state) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode
    );
    const isRtl = useSelector((state) => state.themeConfig.rtlClass) === 'rtl';
    const [isMounted, setIsMounted] = useState(false);
    const [startDay , setStartDay] = useState(new Date());
    const [data , setData] = useState([]);

    const fetchData = async (date) => {
        try {
            const id = sessionStorage.getItem("userId")
            const url = `${process.env.domainApi}/api/statistic/statisticsCTV/${id}`; 
            const response = await fetch(url , {
                method: 'GET',
                headers: {
                    'authorization': `${sessionStorage.getItem('token')}`
                    }
            });
            const data = await response.json();
            console.log(data);
            setData(data.data);
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
 

    const role = sessionStorage.getItem('role');
  
    return (
        <div>
            {role === "2" ? (
                <div className="pt-5">
                    <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="panel h-full lg:col-span-1" style={{width : "1000px"}}>
                            <div className="mb-5 flex justify-between dark:text-white-light" >
                                <h5 className="text-lg font-semibold">Statistics</h5>
                            </div>
                            <div className="grid gap-8 text-sm font-bold text-[#515365] sm:grid-cols-2" >
                                <div>
                                    <div>
                                        <div>Đã duyệt</div>
                                        <div className="text-lg text-[#f8538d]">{data.totalPublished}</div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <div>Chưa duyệt</div>
                                        <div className="text-lg text-[#f8538d]">{data.totalDraft}</div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <div>Gen AI</div>
                                        <div className="text-lg text-[#f8538d]">{data.totalAI}</div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <div>Tổng số bài</div>
                                        <div className="text-lg text-[#f8538d]">{data.totalManaged}</div>
                                    </div>
                                </div>
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

export default Thongke;
