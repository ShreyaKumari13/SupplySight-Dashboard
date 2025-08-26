import React from 'react';
import { Filters, Warehouse } from '../types';

interface FiltersRowProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  warehouses: Warehouse[];
}

const FiltersRow: React.FC<FiltersRowProps> = ({ filters, onFiltersChange, warehouses }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, warehouse: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, status: e.target.value });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by name, SKU, or ID..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700 mb-2">
            Warehouse
          </label>
          <select
            id="warehouse"
            value={filters.warehouse}
            onChange={handleWarehouseChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Warehouses</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.code} value={warehouse.code}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Healthy">Healthy</option>
            <option value="Low">Low</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltersRow;