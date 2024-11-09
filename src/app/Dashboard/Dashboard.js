import React, { useState, useEffect } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import Select from 'react-select';
import { Switch } from '@headlessui/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const Dashboard = () => {
  const [isClient, setIsClient] = useState(false);

  // Filter state
  const [selectedYears, setSelectedYears] = useState([{ label: '2023', value: '2023' }]);
  const [selectedSubjects, setSelectedSubjects] = useState([{ label: 'All', value: 'All' }]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([{ label: 'All', value: 'All' }]);
  const [isDescending, setIsDescending] = useState(true);

  // Original exempeldata för åren 2019-2024
  const propertySalesRawData = [
    { year: '2023', type: 'Lägenheter', sales: 150 },
    { year: '2023', type: 'Villor', sales: 90 },
    { year: '2023', type: 'Radhus', sales: 40 },
    { year: '2022', type: 'Lägenheter', sales: 140 },
    { year: '2022', type: 'Villor', sales: 85 },
    { year: '2022', type: 'Radhus', sales: 42 },
    { year: '2021', type: 'Lägenheter', sales: 130 },
    { year: '2021', type: 'Villor', sales: 80 },
    { year: '2021', type: 'Radhus', sales: 38 },
    { year: '2020', type: 'Lägenheter', sales: 125 },
    { year: '2020', type: 'Villor', sales: 77 },
    { year: '2020', type: 'Radhus', sales: 36 },
    { year: '2019', type: 'Lägenheter', sales: 120 },
    { year: '2019', type: 'Villor', sales: 75 },
    { year: '2019', type: 'Radhus', sales: 32 },

    // Fler datapunkter för åren 2019-2024 ...
  ];

  const lifeExpectancyRawData = [
    { year: '2023', male: 80, female: 85, total: 82.5 },
    { year: '2022', male: 79.8, female: 84.6, total: 82.2 },
    { year: '2021', male: 79.5, female: 84.3, total: 81.9 },
    { year: '2020', male: 79.2, female: 84.0, total: 81.6 },
    { year: '2019', male: 79.0, female: 83.8, total: 81.4 },

    // Fler datapunkter för åren 2019-2024 ...
  ];

  const crimeRawData = [
    { year: '2023', type: 'Stöld', cases: 400 },
    { year: '2023', type: 'Våldsbrott', cases: 200 },
    { year: '2022', type: 'Stöld', cases: 380 },
    { year: '2022', type: 'Våldsbrott', cases: 190 },
    { year: '2021', type: 'Stöld', cases: 360 },
    { year: '2021', type: 'Våldsbrott', cases: 180 },
    { year: '2020', type: 'Stöld', cases: 340 },
    { year: '2020', type: 'Våldsbrott', cases: 170 },
    { year: '2019', type: 'Stöld', cases: 320 },
    { year: '2019', type: 'Våldsbrott', cases: 160 },
  ];

  const schoolResultsRawData = [
    { year: '2023', school: 'Skola A', subject: 'Svenska', level: 'Year9', totalGrade: 14.2, femaleGrade: 15.3, maleGrade: 13.5 },
    { year: '2023', school: 'Skola A', subject: 'Matematik', level: 'Year9', totalGrade: 13.8, femaleGrade: 14.5, maleGrade: 13.0 },
    { year: '2022', school: 'Skola B', subject: 'Engelska', level: 'Year6', totalGrade: 16.0, femaleGrade: 16.8, maleGrade: 15.5 },
    { year: '2021', school: 'Skola A', subject: 'Svenska', level: 'Year6', totalGrade: 15.0, femaleGrade: 15.5, maleGrade: 14.5 },
    { year: '2020', school: 'Skola C', subject: 'Matematik', level: 'Year9', totalGrade: 14.5, femaleGrade: 15.1, maleGrade: 13.9 },
    { year: '2019', school: 'Skola D', subject: 'Engelska', level: 'Year6', totalGrade: 15.8, femaleGrade: 16.3, maleGrade: 15.3 },
  ];

  const avgPriceRawData = [
    { year: '2023', type: 'Lägenheter', price: 2900 },
    { year: '2023', type: 'Villor', price: 4000 },
    { year: '2023', type: 'Radhus', price: 3100 },
    { year: '2022', type: 'Lägenheter', price: 2800 },
    { year: '2022', type: 'Villor', price: 3900 },
    { year: '2022', type: 'Radhus', price: 3000 },
    { year: '2021', type: 'Lägenheter', price: 2700 },
    { year: '2021', type: 'Villor', price: 3800 },
    { year: '2021', type: 'Radhus', price: 2900 },
    { year: '2020', type: 'Lägenheter', price: 2500 },
    { year: '2020', type: 'Villor', price: 3700 },
    { year: '2020', type: 'Radhus', price: 2800 },
    { year: '2019', type: 'Lägenheter', price: 2400 },
    { year: '2019', type: 'Villor', price: 3600 },
    { year: '2019', type: 'Radhus', price: 2700 },
    // Fler datapunkter för genomsnittliga priser per år och typ ...
  ];

  const incomeRawData = [
    { year: '2023', income: 345 },
    { year: '2022', income: 335 },
    { year: '2021', income: 325 },
    { year: '2020', income: 323 },
    { year: '2019', income: 319 },
    // Fler datapunkter för inkomst per år ...
  ];

  // Filtrera data baserat på valda filter
  const filteredPropertySalesData = propertySalesRawData.filter(
    (item) =>
      (selectedYears.length === 0 || selectedYears.some((year) => year.value === item.year)) &&
      (selectedPropertyTypes.length === 0 || selectedPropertyTypes.some((type) => type.value === item.type || type.value === 'All'))
  );

  const filteredLifeExpectancyData = lifeExpectancyRawData.filter((item) =>
    selectedYears.length === 0 || selectedYears.some((year) => year.value === item.year)
  );

  const filteredCrimeData = crimeRawData.filter((item) =>
    selectedYears.length === 0 || selectedYears.some((year) => year.value === item.year)
  );

  const filteredAvgPriceData = avgPriceRawData.filter(
    (item) =>
      (selectedYears.length === 0 || selectedYears.some((year) => year.value === item.year)) &&
      (selectedPropertyTypes.length === 0 || selectedPropertyTypes.some((type) => type.value === item.type || type.value === 'All'))
  );

  const filteredIncomeData = incomeRawData.filter((item) =>
    selectedYears.length === 0 || selectedYears.some((year) => year.value === item.year)
  );

  const filteredSchoolResultsData = schoolResultsRawData.filter(
    (result) =>
      selectedYears.some((year) => year.value === result.year) &&
      selectedSubjects.some((subject) => subject.value === result.subject || subject.value === 'All')
  );

  

  // Skapa diagramdata
  const propertySalesChartData = {
    labels: [...new Set(filteredPropertySalesData.map((item) => item.type))],
    datasets: selectedYears.map((year) => ({
      label: `Antal Försäljningar ${year.value}`,
      data: filteredPropertySalesData
        .filter((item) => item.year === year.value)
        .map((item) => item.sales),
      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
    })),
  };

  const lifeExpectancyChartData = {
    labels: selectedYears.map((year) => year.value),
    datasets: [
      {
        label: 'Män',
        data: filteredLifeExpectancyData.map((item) => item.male),
        backgroundColor: '#36A2EB',
      },
      {
        label: 'Kvinnor',
        data: filteredLifeExpectancyData.map((item) => item.female),
        backgroundColor: '#FF6384',
      },
      {
        label: 'Totalt',
        data: filteredLifeExpectancyData.map((item) => item.total),
        backgroundColor: '#FFCE56',
      },
    ],
  };

  const crimeChartData = {
    labels: [...new Set(filteredCrimeData.map((item) => item.type))],
    datasets: selectedYears.map((year) => ({
      label: `Antal Brott ${year.value}`,
      data: filteredCrimeData
        .filter((item) => item.year === year.value)
        .map((item) => item.cases),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    })),
  };

  const avgPriceChartData = {
    labels: [...new Set(filteredAvgPriceData.map((item) => item.type))],
    datasets: selectedYears.map((year) => ({
      label: `Genomsnittligt Pris ${year.value} (tusentals kr)`,
      data: filteredAvgPriceData
        .filter((item) => item.year === year.value)
        .map((item) => item.price),
      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
    })),
  };

  const incomeChartData = {
    labels: selectedYears.map((year) => year.value),
    datasets: [
      {
        label: 'Genomsnittlig Inkomst (tusentals kr)',
        data: filteredIncomeData.map((item) => item.income),
        backgroundColor: '#4BC0C0',
      },
    ],
  };

  const schoolResultsChartData = {
    labels: filteredSchoolResultsData.map((data) => `${data.school} - ${data.subject} (${data.year})`),
    datasets: [
      {
        label: 'Totalt',
        data: filteredSchoolResultsData.map((data) => data.totalGrade),
        backgroundColor: '#36A2EB',
      },
      {
        label: 'Kvinnor',
        data: filteredSchoolResultsData.map((data) => data.femaleGrade),
        backgroundColor: '#FF6384',
      },
      {
        label: 'Män',
        data: filteredSchoolResultsData.map((data) => data.maleGrade),
        backgroundColor: '#FFCE56',
      },
    ],
  };

  const yearOptions = [
    { label: '2023', value: '2023' },
    { label: '2022', value: '2022' },
    { label: '2021', value: '2021' },
    { label: '2020', value: '2020' },
    { label: '2019', value: '2019' },
  ];

  const subjectOptions = [
    { label: 'Svenska', value: 'Svenska' },
    { label: 'Matematik', value: 'Matematik' },
    { label: 'Engelska', value: 'Engelska' },
    { label: 'All', value: 'All' },
  ];

  const propertyTypeOptions = [
    { label: 'Lägenheter', value: 'Lägenheter' },
    { label: 'Villor', value: 'Villor' },
    { label: 'Radhus', value: 'Radhus' },
    { label: 'All', value: 'All' },
  ];


  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleYearChange = (selectedOptions) => {
    const sortedOptions = selectedOptions.sort((a, b) =>
      isDescending ? b.value - a.value : a.value - b.value
    );
    setSelectedYears(sortedOptions);
  };

  const toggleSortOrder = () => {
    setIsDescending(!isDescending);
    handleYearChange(selectedYears);
  };


  if (!isClient) {
    return null;
  }

  return (
    <div className="dashboard-container p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Statistik Dashboard (Exempeldata)</h2>

      <div className="filters-container mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select options={yearOptions} isMulti placeholder="Välj år..." value={selectedYears} onChange={handleYearChange} />
        <Select options={subjectOptions} isMulti placeholder="Välj ämne..." value={selectedSubjects} onChange={setSelectedSubjects} />
        <Select options={propertyTypeOptions} isMulti placeholder="Välj bostadstyp..." value={selectedPropertyTypes} onChange={setSelectedPropertyTypes} />
      </div>
      <div className="sort-order-toggle mb-6 flex items-center space-x-2">
        <span>Stigande</span>
        <Switch
          checked={isDescending}
          onChange={toggleSortOrder}
          className={`${
            isDescending ? 'bg-blue-600' : 'bg-gray-300'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              isDescending ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
        <span>Fallande</span>
      </div>

      <div className="charts-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Diagram för bostadsförsäljningar */}
        <div className="chart bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Bostadsförsäljningar per Typ</h3>
          <Pie data={propertySalesChartData} />
        </div>

        {/* Diagram för genomsnittliga bostadspriser */}
        <div className="chart bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Genomsnittligt Pris över Tid</h3>
          <Bar data={avgPriceChartData} options={{ scales: { y: { beginAtZero: true } } }} />
        </div>

        {/* Diagram för brottsfördelning */}
        <div className="chart bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Brottsfördelning i Kommunen</h3>
          <Pie data={crimeChartData} />
        </div>

        <div className="chart bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Skolresultat</h3>
          <Bar data={schoolResultsChartData} options={{ scales: { y: { beginAtZero: true, max: 20 } } }} />
        </div>

        {/* Diagram för förväntad livslängd */}
        <div className="chart bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Förväntad Livslängd</h3>
          <Bar data={lifeExpectancyChartData} options={{ indexAxis: 'y', scales: { x: { beginAtZero: true, max: 100 } } }} />
        </div>

        {/* Diagram för inkomst över tid */}
        <div className="chart bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Genomsnittlig Inkomst över Tid</h3>
          <Line data={incomeChartData} options={{ scales: { y: { beginAtZero: true } } }} />
        </div>

        {/* Diagram för skolresultat */}
        <div className="chart bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Skolresultat (Årskurs 6 & 9)</h3>
          <Bar data={schoolResultsChartData} options={{ scales: { y: { beginAtZero: true, max: 20 } } }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
