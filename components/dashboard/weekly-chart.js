"use client"
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const WeeklyChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchWeeklyStatistics = async () => {
      try {
        const url = `${process.env.domainApi}/api/statistic/weekly-statistics`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            "authorization": sessionStorage.getItem("token"),
          },
        });

        const data = await response.json();
        console.log(data);

        if (data && Array.isArray(data.labels) && Array.isArray(data.datasets)) {
          setChartData({
            labels: data.labels,
            datasets: data.datasets
          });
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (error) {
        console.error('Error fetching weekly statistics:', error);
      }
    };

    fetchWeeklyStatistics();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê theo tuần bài lấy từ Web',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const role = sessionStorage.getItem('role');
  return (
    <div>
      {role === "1" ? (
        <>
           <h2>Weekly Statistics</h2>
           <Bar data={chartData} options={options} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WeeklyChart;