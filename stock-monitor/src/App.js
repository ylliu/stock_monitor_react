import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import StockTable from './components/StockTable';
import StockConfig from './components/StockConfig';
import StockHistory from './components/StockHistory';
import StockCommand from './components/StockCommand';
import DatePicker from './components/DatePicker';
import CandlestickChart from './components/CandlestickChart'

const mockStockHistory = [
  { time: '2023-04-15 10:00:01', code: '000001', description: '5日线回踩预警' },
  { time: '2023-04-14 10:00:02', code: '000002', description: '5日线回踩预警' },
  { time: '2023-04-13 10:00:03', code: '000003', description: '10日线回踩预警' },
];

const App = () => {
  const [selectedDate, setSelectedDate] = useState('2024-10-23');
  const [stocksData, setStocksData] = useState([]);

  const handleStartStockSelection = (data) => {
    setStocksData(data);
  };

  return (
    <div className="container-fluid">
      <h1 className="my-4">Stock Monitor</h1>
      <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
      <div className="row">
        <div className="col-md-9">
          <StockConfig />
        </div>
        <div className="col-md-3">
          <StockCommand onStockDataUpdate={handleStartStockSelection} />
        </div>
      </div>
      <div className="row" style={{ marginBottom: '10%' }}>
        <div className="col-md-8">
          <div className="card h-100">
            <div className="card-body">
              <StockTable stocksData={stocksData} />
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
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <CandlestickChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;