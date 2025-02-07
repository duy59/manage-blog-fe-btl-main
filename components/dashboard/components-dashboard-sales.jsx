'use client';;
import Dropdown from '@/components/dropdown';
import IconArrowLeft from '@/components/icon/icon-arrow-left';
import IconBolt from '@/components/icon/icon-bolt';
import IconCaretDown from '@/components/icon/icon-caret-down';
import IconCashBanknotes from '@/components/icon/icon-cash-banknotes';
import IconCreditCard from '@/components/icon/icon-credit-card';
import IconDollarSign from '@/components/icon/icon-dollar-sign';
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots';
import IconInbox from '@/components/icon/icon-inbox';
import IconMultipleForwardRight from '@/components/icon/icon-multiple-forward-right';
import IconNetflix from '@/components/icon/icon-netflix';
import IconPlus from '@/components/icon/icon-plus';
import IconShoppingCart from '@/components/icon/icon-shopping-cart';
import IconTag from '@/components/icon/icon-tag';
import IconUser from '@/components/icon/icon-user';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';

const ComponentsDashboardSales = () => {
    const isDark = useSelector(
        (state) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode
    );
    const isRtl = useSelector((state) => state.themeConfig.rtlClass) === 'rtl';





    return <>
        <>
            trang bắt đầu
        </>
    </>;
};

export default ComponentsDashboardSales;
