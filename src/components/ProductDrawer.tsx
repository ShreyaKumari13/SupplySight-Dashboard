import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_DEMAND, TRANSFER_STOCK } from '../apollo-client';
import { Product, Warehouse } from '../types';

interface ProductDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  warehouses: Warehouse[];
}

const ProductDrawer: React.FC<ProductDrawerProps> = ({ 
  product, 
  isOpen, 
  onClose, 
  onUpdate,
  warehouses 
}) => {
  const [updateDemand] = useMutation(UPDATE_DEMAND);
  const [transferStock] = useMutation(TRANSFER_STOCK);
  
  const [demandValue, setDemandValue] = useState('');
  const [transferQty, setTransferQty] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  React.useEffect(() => {
    if (product) {
      setDemandValue(product.demand.toString());
      setTransferQty('');
      setTransferTo('');
    }
  }, [product]);

  const handleUpdateDemand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !demandValue) return;

    setIsUpdating(true);
    try {
      await updateDemand({
        variables: {
          id: product.id,
          demand: parseInt(demandValue)
        }
      });
      onUpdate();
      alert('Demand updated successfully!');
    } catch (error) {
      console.error('Error updating demand:', error);
      alert('Failed to update demand');
    }
    setIsUpdating(false);
  };

  const handleTransferStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !transferQty || !transferTo) return;

    const qty = parseInt(transferQty);
    if (qty > product.stock) {
      alert('Transfer quantity cannot exceed current stock');
      return;
    }

    setIsUpdating(true);
    try {
      await transferStock({
        variables: {
          id: product.id,
          from: product.warehouse,
          to: transferTo,
          qty: qty
        }
      });
      onUpdate();
      alert('Stock transferred successfully!');
      setTransferQty('');
      setTransferTo('');
    } catch (error) {
      console.error('Error transferring stock:', error);
      alert('Failed to transfer stock');
    }
    setIsUpdating(false);
  };

  const getStatusColor = () => {
    if (!product) return 'text-gray-500';
    if (product.stock > product.demand) return 'text-green-600';
    if (product.stock === product.demand) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusText = () => {
    if (!product) return 'Unknown';
    if (product.stock > product.demand) return 'Healthy';
    if (product.stock === product.demand) return 'Low';
    return 'Critical';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {product && (
            <div className="flex-1 overflow-y-auto p-6">
              {/* Product Info */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">ID:</span> {product.id}</div>
                  <div><span className="font-medium">SKU:</span> {product.sku}</div>
                  <div><span className="font-medium">Warehouse:</span> {product.warehouse}</div>
                  <div><span className="font-medium">Stock:</span> {product.stock.toLocaleString()}</div>
                  <div><span className="font-medium">Demand:</span> {product.demand.toLocaleString()}</div>
                  <div>
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-2 font-semibold ${getStatusColor()}`}>
                      {getStatusText()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Update Demand Form */}
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Update Demand</h4>
                <form onSubmit={handleUpdateDemand}>
                  <div className="mb-4">
                    <label htmlFor="demand" className="block text-sm font-medium text-gray-700 mb-2">
                      New Demand
                    </label>
                    <input
                      type="number"
                      id="demand"
                      value={demandValue}
                      onChange={(e) => setDemandValue(e.target.value)}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isUpdating ? 'Updating...' : 'Update Demand'}
                  </button>
                </form>
              </div>

              {/* Transfer Stock Form */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Transfer Stock</h4>
                <form onSubmit={handleTransferStock}>
                  <div className="mb-4">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      value={transferQty}
                      onChange={(e) => setTransferQty(e.target.value)}
                      min="1"
                      max={product.stock}
                      placeholder={`Max: ${product.stock}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="transferTo" className="block text-sm font-medium text-gray-700 mb-2">
                      Transfer To
                    </label>
                    <select
                      id="transferTo"
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select warehouse...</option>
                      {warehouses
                        .filter(w => w.code !== product.warehouse)
                        .map((warehouse) => (
                          <option key={warehouse.code} value={warehouse.code}>
                            {warehouse.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isUpdating || !transferQty || !transferTo}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isUpdating ? 'Transferring...' : 'Transfer Stock'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDrawer;