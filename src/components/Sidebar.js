import React from 'react';

const Sidebar = ({
  isNoiseFilterChecked,
  setIsNoiseFilterChecked,
  isPropertyDataChecked,
  setIsPropertyDataChecked,
  loadSelectedDataType,
  showFilterOptions,
  setShowFilterOptions,
  roadFilter,
  toggleRoadFilter,
  showRailway,
  setShowRailway,
  showIndustry,
  setShowIndustry,
  showSchools,
  setShowSchools,
  goBackToCountryView,
}) => {
  return (
    <aside className="bg-gray-800 text-white p-4 space-y-4">
      <h2 className="text-xl font-semibold">Välj Data Typ</h2>

      {/* Checkboxar för datatyper */}
      <div className="space-y-2 space-x-2">
        <label>
          <input
            type="checkbox"
            checked={isNoiseFilterChecked}
            onChange={(e) => setIsNoiseFilterChecked(e.target.checked)}
          />
          <span className="ml-2">BullerFilter</span>
        </label>

        <label>
          <input
            type="checkbox"
            checked={isPropertyDataChecked}
            onChange={(e) => {
              setIsPropertyDataChecked(e.target.checked);
              if (e.target.checked) loadSelectedDataType("Fastighetsdata");
            }}
          />
          <span className="ml-2">Fastighetsdata</span>
        </label>
      </div>

      {/* Visa/Dölj filteralternativ */}
      <button
        onClick={() => setShowFilterOptions(!showFilterOptions)}
        className="w-full p-2 mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded"
      >
        {showFilterOptions ? "Dölj Filter" : "Visa Filter"}
      </button>

      {/* Filteralternativ om BullerFilter är valt */}
      {showFilterOptions && isNoiseFilterChecked && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Bullerfilter</h3>
          <div className="space-y-2">
            {Object.keys(roadFilter).map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={roadFilter[type]}
                  onChange={() => toggleRoadFilter(type)}
                />
                <span className="ml-2 capitalize">{type}</span>
              </label>
            ))}
            <label className="flex items-center">
              <input type="checkbox" checked={showRailway} onChange={() => setShowRailway(!showRailway)} />
              <span className="ml-2">Järnväg</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked={showIndustry} onChange={() => setShowIndustry(!showIndustry)} />
              <span className="ml-2">Industri</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked={showSchools} onChange={() => setShowSchools(!showSchools)} />
              <span className="ml-2">Skolor</span>
            </label>
          </div>
        </div>
      )}

      {/* Knapp för att återgå till Sverigekartan */}
      <button
        onClick={goBackToCountryView}
        className="w-full p-2 mt-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded"
      >
        Återgå till Sverigekartan
      </button>
    </aside>
  );
};

export default Sidebar;
