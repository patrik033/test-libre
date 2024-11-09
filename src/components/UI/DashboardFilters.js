import React from 'react';

const DashboardFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="filters-container p-4 mb-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Filtrera data</h3>

      {/* Filter för år */}
      <label className="block mb-2">
        <span>Välj år:</span>
        <select
          className="mt-1 block w-full p-2 bg-gray-200 rounded"
          value={filters.year}
          onChange={(e) => onFilterChange({ ...filters, year: e.target.value })}
        >
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
        </select>
      </label>

      {/* Filter för bostadstyp */}
      <label className="block mb-2">
        <span>Välj bostadstyp:</span>
        <select
          className="mt-1 block w-full p-2 bg-gray-200 rounded"
          value={filters.propertyType}
          onChange={(e) => onFilterChange({ ...filters, propertyType: e.target.value })}
        >
          <option value="Alla">Alla</option>
          <option value="Lägenheter">Lägenheter</option>
          <option value="Villor">Villor</option>
          <option value="Radhus">Radhus</option>
        </select>
      </label>
    </div>
  );
};

export default DashboardFilters;
