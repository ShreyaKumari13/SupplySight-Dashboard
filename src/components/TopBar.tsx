import React from 'react';

interface TopBarProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ dateRange, onDateRangeChange }) => {
  const dateRanges = ['7d', '14d', '30d'];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">SupplySight</h1>
        </div>
        
        <div className="flex items-center space-x-1">
          {dateRanges.map((range) => (
            <button
              key={range}
              onClick={() => onDateRangeChange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                dateRange === range
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopBar;