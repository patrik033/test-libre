import DashboardLayout from "./DashboardLayout";

const DashboardPage = () => {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Antal Användare</h2>
            <p className="mt-2 text-gray-600">345</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Sålda Fastigheter</h2>
            <p className="mt-2 text-gray-600">120</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Senaste Rapport</h2>
            <p className="mt-2 text-gray-600">23 November 2024</p>
          </div>
        </div>
      </DashboardLayout>
    );
  };

export default DashboardPage;
