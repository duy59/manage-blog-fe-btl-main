"use client"

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WeelyPublished = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.domainApi}/api/statistic/weekly-ctv`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `${sessionStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                setChartData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    if (!chartData) {
        return <div>Loading...</div>;
    }

    const data = {
        labels: chartData.labels,
        datasets: chartData.datasets
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Weekly Published Data',
            },
        },
    };

    return (
        <div>
            <h1>Weekly Published Data</h1>
            <Bar data={data} options={options} />
        </div>
    );
};

export default WeelyPublished;