import React, { useState } from 'react';
import StockTable from './StockTable';
const StockCommand = ({ onStockDataUpdate,selectedDate  }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [stocksData, setStocksData] = useState([]);
  const stockCode = '300001.sz'; // 你可以在这里设置默认的股票代码

  const handleStartStockSelection = () => {
    setIsSelecting(true); // Set isMonitoring to true when starting stock selection
    setIsMonitoring(false);
    clearInterval(intervalId);
    setIntervalId(null);
    fetch(`http://127.0.0.1:5000/monitor_records/${selectedDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      onStockDataUpdate(data); // Update stock data using the provided function
      setStocksData(data);
    })
    .catch(error => {
      console.error('Error:', error);
    })
    .finally(() => {
      setIsSelecting(false); // Set isMonitoring back to false after data is received
    });
  };


  const getStockCodes = () => {
    if (stocksData && stocksData.length > 0) {
      const codeArray = stocksData.map(stock => stock.stock_code); // 获取所有股票代码
      return codeArray.join(); // 用逗号连接所有股票代码
    }
    
    return ''; // 如果没有数据则返回空字符串
  };

  const fetchData = () => {
    
    fetch(`http://127.0.0.1:5000/stock_price`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      onStockDataUpdate(data); // 使用提供的函数更新股票数据
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleStartStockMonitoring = () => {
    setIsMonitoring(true);
    fetchData(); // 初始获取数据

    const id = setInterval(() => {
      fetchData(); // 每5秒获取数据
    }, 10000);
    setIntervalId(id);
  };

  const handleStopStockMonitoring = () => {
    setIsMonitoring(false);
    clearInterval(intervalId);
    setIntervalId(null);
  };


  return (
    <div className="my-3 d-flex flex-column">
      <button onClick={handleStartStockSelection} className="btn btn-success mb-2" disabled={isSelecting}>
        {isSelecting ? '选股中' : '开始选股'}
      </button>
      <button onClick={handleStartStockMonitoring} className="btn btn-success mb-2" disabled={isMonitoring}>
        {isMonitoring ? '监控中' : '开始监控'}
      </button>
      <button onClick={handleStopStockMonitoring} className="btn btn-danger mb-2" disabled={!isMonitoring}>
        结束监控
      </button>
      
    </div>
  );
};


export default StockCommand;