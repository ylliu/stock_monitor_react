import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import StockTable from './components/StockTable';
import StockConfig from './components/StockConfig';
import StockHistory from './components/StockHistory';
import StockCommand from './components/StockCommand';
import DatePicker from './components/DatePicker';
import CandlestickChart from './components/CandlestickChart';
import BacktestInterface from './components/BacktestInterface';
import { createGlobalStyle } from 'styled-components';
import ConfigList from './components/ConfigList';

const mockStockHistory = [
  { time: '2023-04-15 10:00:01', code: '000001', description: '5日线回踩预警' },
  { time: '2023-04-14 10:00:02', code: '000002', description: '5日线回踩预警' },
  { time: '2023-04-13 10:00:03', code: '000003', description: '10日线回踩预警' },
];

const GlobalStyle = createGlobalStyle`
  body {
    font-size: 14px; /* Set your desired font size */
  }
  
  .backtest-button {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .red-text {
    color: #dc3545;
  }
`;

const App = () => {
  const currentDate = new Date();
  const formattedCurrentDate = currentDate.toISOString().split('T')[0]; // 格式化为YYYY-MM-DD格式的日期字符串
  const [selectedDate, setSelectedDate] = useState(formattedCurrentDate);
  const [stocksData, setStocksData] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState('main'); // 管理选中的板块状态
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [currentView, setCurrentView] = useState('main'); // 新增：管理当前视图状态

  // Update the selected config when a user applies a configuration
  const onConfigSelected = (config) => {
    setSelectedConfig(config);
  };

  const handleStartStockSelection = (data) => {
    setStocksData(data);
  };

  // 处理板块切换
  const handleBoardChange = (board) => {
    setSelectedBoard(board); // 更新 selectedBoard
  };

  // 处理视图切换
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  useEffect(() => {
    // 在组件加载时从 localStorage 获取保存的板块选择
    const savedBoard = localStorage.getItem('selectedBoard');
    if (savedBoard) {
      setSelectedBoard(savedBoard); // 如果有保存的板块信息，就使用它
    }
  }, []);

  // 渲染主界面
  const renderMainView = () => (
    <>
      <div className="main-header">
        <h4 className="red-text">李季峰助手</h4>
        <button 
          className="btn btn-primary"
          onClick={() => handleViewChange('backtest')}
        >
          <i className="fas fa-chart-line me-2"></i>
          策略回测
        </button>
      </div>
      
      <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
      
      <div className="row">
        <div className="col-md-9">
          <StockConfig 
            selectedBoard={selectedBoard}
            onBoardChange={handleBoardChange}
            selectedConfig={selectedConfig} 
          />
        </div>
        <div className="col-md-3">
          <StockCommand 
            onStockDataUpdate={handleStartStockSelection} 
            selectedDate={selectedDate} 
            selectedBoard={selectedBoard} 
          />
          <ConfigList 
            board={selectedBoard} 
            onConfigSelected={onConfigSelected} 
          />
        </div>
      </div>
      
      <div className="row" style={{ marginBottom: '10%' }}>
        <div className="col-md-12">
          <div className="card h-100" style={{ minHeight: '200px' }}>
            <div className="card-body">
              <StockTable stocksData={stocksData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // 渲染回测界面
  const renderBacktestView = () => (
    <BacktestInterface onBack={() => handleViewChange('main')} />
  );

  return (
    <>
      <GlobalStyle />
      <div className="container-fluid">
        {currentView === 'main' && renderMainView()}
        {currentView === 'backtest' && renderBacktestView()}
      </div>
    </>
  );
};

export default App;