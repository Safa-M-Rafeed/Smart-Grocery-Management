import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ArrowTrendingUpIcon, ExclamationTriangleIcon, ExclamationCircleIcon, InformationCircleIcon, CubeIcon } from '@heroicons/react/24/outline';
import { Bar, Pie } from 'react-chartjs-2';
import { ArrowPathIcon } from "@heroicons/react/24/solid";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    } 
  },
  hover: { 
    scale: 1.02, 
    transition: { duration: 0.2 }
  }
};

const StatCard = ({ title, value, icon, gradient, trend }) => (
  <motion.div variants={cardVariants} whileHover="hover">
    <div className={`h-full ${gradient} text-white relative overflow-hidden rounded-lg shadow-md before:content-[''] before:absolute before:top-0 before:right-0 before:w-24 before:h-24 before:bg-white/10 before:rounded-full before:translate-x-[30px] before:-translate-y-[30px]`}>
      <div className="p-4 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-white/20 flex items-center justify-center">
            {icon}
          </div>
          {trend && (
            <div className="flex items-center gap-1">
              <ArrowTrendingUpIcon className="h-4 w-4" />
              <span className="text-xs">{trend}</span>
            </div>
          )}
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold mb-1">{value}</h3>
        <p className="opacity-90 text-sm">{title}</p>
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, lowStock: 0, expired: 0, nearExpired: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = () => {
    setLoading(true);
    setError(null);
    
    axios.get('http://localhost:5000/api/products/stats')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Axios error:', err);
        setError('Failed to fetch dashboard data. Please check your connection.');
        setLoading(false);
      });
  };

  const pieData = {
    labels: ['Low Stock', 'Expired', 'Near Expired', 'Normal'],
    datasets: [
      {
        data: [stats.lowStock, stats.expired, stats.nearExpired, stats.total - (stats.lowStock + stats.expired + stats.nearExpired)],
        backgroundColor: ['#ff9800', '#f44336', '#2196f3', '#4caf50'],
      },
    ],
  };

  const barData = {
    labels: ['Total', 'Low Stock', 'Expired', 'Near Expired'],
    datasets: [
      {
        label: 'Inventory',
        data: [stats.total, stats.lowStock, stats.expired, stats.nearExpired],
        backgroundColor: '#2563eb',
      },
    ],
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[calc(100vh-64px)]"><div className="animate-spin h-16 w-16 border-4 border-[#9EBC8A] border-t-transparent rounded-full"></div></div>;
  }

  if (error) {
    return <div className="rounded-lg bg-red-100 p-4 mb-6 shadow-md">{error} <button onClick={fetchStats} className="text-red-500">Retry</button></div>;
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 sm:p-6 md:p-8 bg-white">
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl sm:text-2xl font-bold">Dashboard Overview</h4>
          <button onClick={fetchStats} className="bg-gray-100 p-2 sm:p-3 rounded hover:bg-gray-200 shadow-md">
            <ArrowPathIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard title="Total Products" value={stats.total} icon={<CubeIcon className="h-6 w-6" />} gradient="bg-gradient-to-r from-[#667eea] to-[#764ba2]" trend="+12%" />
        <StatCard title="Low Stock Items" value={stats.lowStock} icon={<ExclamationTriangleIcon className="h-6 w-6" />} gradient="bg-gradient-to-r from-[#f093fb] to-[#f5576c]" />
        <StatCard title="Expired Items" value={stats.expired} icon={<ExclamationCircleIcon className="h-6 w-6" />} gradient="bg-gradient-to-r from-[#4facfe] to-[#00f2fe]" />
        <StatCard title="Near Expired" value={stats.nearExpired} icon={<InformationCircleIcon className="h-6 w-6" />} gradient="bg-gradient-to-r from-[#43e97b] to-[#38f9d7]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div variants={cardVariants} className="h-80 sm:h-96 p-4 sm:p-6 bg-white rounded-lg shadow-md">
          <h6 className="text-lg font-semibold mb-4">Inventory Distribution</h6>
          <div className="h-[calc(100%-2rem)]"><Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} /></div>
        </motion.div>
        <motion.div variants={cardVariants} className="h-80 sm:h-96 p-4 sm:p-6 bg-white rounded-lg shadow-md">
          <h6 className="text-lg font-semibold mb-4">Status Breakdown</h6>
          <div className="h-[calc(100%-2rem)]"><Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;