import React, { useState, useEffect,lazy,Suspense } from 'react';
import SkeletonDashboard from '@/components/Dashboard/SkeletonDashboard';
import { Pie, Bar, Line } from 'react-chartjs-2';
import ChartsSection from '@/components/Dashboard/ChartsSection';
import KPISection from '@/components/Dashboard/KPISection';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, BarElement, PointElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, BarElement, PointElement);

const Dashboard = ({ kommun }) => {

  const [kpiData, setKpiData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loadingKPI, setLoadingKPI] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);

  useEffect(() => {
    if (!kommun) return;

    // Hämta KPI-data
    fetch(`https://localhost:7150/api/Dashboard/kpi?kommun=${kommun.Kommun}`)
      .then((res) => res.json())
      .then((data) => {
        setKpiData(data);
        setLoadingKPI(false);
      });

    // Hämta Chart-data
    fetch(`https://localhost:7150/api/Dashboard/charts?kommun=${kommun.Kommun}`)
      .then((res) => res.json())
      .then((data) => {

        setChartData(data);
        setLoadingCharts(false);
      });
  }, [kommun]);

  return (
    <div className="dashboard-container p-3 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Statistik Dashboard</h2>

      {/* KPI Section */}
      <Suspense fallback={<SkeletonDashboard />}>
        {loadingKPI ? (
          <SkeletonDashboard />
        ) : (
          <KPISection data={kpiData} />
        )}
      </Suspense>

      {/* Charts Section */}
      <Suspense fallback={<SkeletonDashboard />}>
        {loadingCharts ? (
          <SkeletonDashboard />
        ) : (
          <ChartsSection data={chartData} />
        )}
      </Suspense>
    </div>
  );
};

export default Dashboard;