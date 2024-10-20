// StockTable.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import StockTable from './StockTable';

describe('StockTable', () => {
  test('renders stock table header', () => {
    render(<StockTable />);
    expect(screen.getByText('Stock Code')).toBeInTheDocument();
    expect(screen.getByText('Stock Name')).toBeInTheDocument();
    expect(screen.getByText('Current Price')).toBeInTheDocument();
  });

  test('renders stock data rows', () => {
    const mockStockData = [
      { id: 1, code: '000001', name: 'Tencent', price: 500.0 },
      { id: 2, code: '000002', name: 'Alibaba', price: 300.0 },
    ];
    render(<StockTable stocks={mockStockData} />);
    expect(screen.getByText('000001')).toBeInTheDocument();
    expect(screen.getByText('Tencent')).toBeInTheDocument();
    expect(screen.getByText('500.0')).toBeInTheDocument();
  });
});