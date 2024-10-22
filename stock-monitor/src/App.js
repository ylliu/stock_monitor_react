import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import StockTable from './components/StockTable';
import StockConfig from './components/StockConfig';
import StockHistory from './components/StockHistory';
import StockCommand from './components/StockCommand';


const mockStockData = [
  { id: 1, code: '000001', name: 'Tencent', price: 500.0 },
  { id: 2, code: '000002', name: 'Alibaba', price: 300.0 },
  { id: 3, code: '000003', name: 'Tencent', price: 500.0 },
  { id: 4, code: '000004', name: 'Alibaba', price: 300.0 },
  { id: 5, code: '000005', name: 'Tencent', price: 500.0 },
  { id: 6, code: '000006', name: 'Alibaba', price: 300.0 },
  { id: 7, code: '000007', name: 'Tencent', price: 500.0 },
  { id: 8, code: '000008', name: 'Alibaba', price: 300.0 },
  { id: 9, code: '000009', name: 'Tencent', price: 500.0 },
  { id: 10, code: '0000010', name: 'Alibaba', price: 300.0 },
];

const mockStockHistory = [
  { time: '2023-04-15 10:00:01', code: '000001', description: '5日线回踩预警' },
  { time: '2023-04-14 10:00:02', code: '000002', description: '5日线回踩预警' },
  { time: '2023-04-13 10:00:03', code: '000003', description: '10日线回踩预警' },
];

function App() {
  return (
    <div className="container-fluid">
      <h1 className="my-4">Stock Monitor</h1>
      <div className="row">
        <div className="col-md-9">
          <StockConfig />
        </div>
        <div className="col-md-3">
          <StockCommand />
        </div>
      </div>
      <div className="row" style={{ marginBottom: '10%' }}>
        <div className="col-md-8">
          <div className="card h-100">
            <div className="card-body">
              <StockTable stocks={mockStockData} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <StockHistory stockHistory={mockStockHistory} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;