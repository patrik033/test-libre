import React, { useState, useEffect, lazy, Suspense } from "react";
import SkeletonDashboard from "@/components/Dashboard/SkeletonDashboard";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, BarElement, PointElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, BarElement, PointElement);

// Lazy load KPI and Chart sections for better performance
const KPISection = lazy(() => import("@/components/Dashboard/KPISection"));
const ChartsSection = lazy(() => import("@/components/Dashboard/ChartsSection"));

const Dashboard = ({ kommun }) => {
  const [kpiData, setKpiData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loadingKPI, setLoadingKPI] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);

  useEffect(() => {
    if (!kommun) return;

    // Hämta KPI-data
    const fetchKPIData = async () => {
      try {
        const response = await fetch(`https://localhost:7150/api/dashboard/kpi?KommunId=${kommun.Kommun}`);
        const data = await response.json();
        setKpiData(data.data);
      } catch (error) {
        console.error("Error fetching KPI data:", error);
      } finally {
        setLoadingKPI(false);
      }
    };

    // Hämta Chart-data
    const fetchChartData = async () => {
      try {
        const response = await fetch(`https://localhost:7150/api/dashboard/charts?KommunId=${kommun.Kommun}`);
        const data = await response.json();
        setChartData(data.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoadingCharts(false);
      }
    };

    fetchKPIData();
    fetchChartData();
  }, [kommun]);

  return (
    <div className="dashboard-container p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Statistik Dashboard</h2>

      {/* KPI Section */}
      <div className="mb-8">
        <Suspense fallback={<SkeletonDashboard />}>
          {loadingKPI ? (
            <SkeletonDashboard />
          ) : (
            <KPISection data={kpiData} />
          )}
        </Suspense>
      </div>

      {/* Charts Section */}
      <div>
        <Suspense fallback={<SkeletonDashboard />}>
          {loadingCharts ? (
            <SkeletonDashboard />
          ) : (
            <ChartsSection data={chartData} />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
