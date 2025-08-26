import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_WAREHOUSES, GET_KPIS } from '../apollo-client';
import { Product, Warehouse, KPI, Filters } from '../types';
import TopBar from './TopBar';
import KPICards from './KPICards';
import StockChart from './StockChart';
import FiltersRow from './FiltersRow';
import ProductsTable from './ProductsTable';
import ProductDrawer from './ProductDrawer';

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [filters, setFilters] = useState<Filters>({
    search: '',
    warehouse: 'All',
    status: 'All'
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: productsData, loading: productsLoading, error: productsError, refetch: refetchProducts } = useQuery(GET_PRODUCTS, {
    variables: {
      search: filters.search || null,
      status: filters.status === 'All' ? null : filters.status,
      warehouse: filters.warehouse === 'All' ? null : filters.warehouse
    }
  });

  const { data: warehousesData } = useQuery(GET_WAREHOUSES);
  const { data: kpisData } = useQuery(GET_KPIS, {
    variables: { range: dateRange }
  });

  const products: Product[] = productsData?.products || [];
  const warehouses: Warehouse[] = warehousesData?.warehouses || [];
  const kpis: KPI[] = kpisData?.kpis || [];

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };

  const handleProductUpdate = () => {
    refetchProducts();
  };

  if (productsError) {
    return <div className="p-4 text-red-600">Error loading data: {productsError.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      
      <div className="p-6">
        <KPICards products={products} />
        
        <div className="mt-6">
          <StockChart kpis={kpis} />
        </div>
        
        <div className="mt-6">
          <FiltersRow
            filters={filters}
            onFiltersChange={setFilters}
            warehouses={warehouses}
          />
        </div>
        
        <div className="mt-6">
          <ProductsTable
            products={products}
            loading={productsLoading}
            onProductClick={handleProductClick}
          />
        </div>
      </div>

      <ProductDrawer
        product={selectedProduct}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onUpdate={handleProductUpdate}
        warehouses={warehouses}
      />
    </div>
  );
};

export default Dashboard;