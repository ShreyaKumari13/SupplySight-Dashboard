import React from 'react';
import { Product } from '../types';

interface KPICardsProps {
  products: Product[];
}

const KPICards: React.FC<KPICardsProps> = ({ products }) => {
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalDemand = products.reduce((sum, product) => sum + product.demand, 0);
  
  const fillRate = totalDemand > 0 
    ? Math.round((products.reduce((sum, product) => sum + Math.min(product.stock, product.demand), 0) / totalDemand) * 100)
    : 0;

  const kpiData = [
    {
      title: 'Total Stock',
      value: totalStock.toLocaleString(),
      icon: '📦',
      color: 'text-blue-600'
    },
    {
      title: 'Total Demand',
      value: totalDemand.toLocaleString(),
      icon: '📊',
      color: 'text-purple-600'
    },
    {
      title: 'Fill Rate',
      value: `${fillRate}%`,
      icon: '📈',
      color: fillRate >= 80 ? 'text-green-600' : fillRate >= 60 ? 'text-yellow-600' : 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpiData.map((kpi, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
              <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
            </div>
            <div className="text-3xl">{kpi.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;