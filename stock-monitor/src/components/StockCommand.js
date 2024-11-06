import React, { useState, useEffect } from 'react';
import StockTable from './StockTable';

const StockCommand = ({ onStockDataUpdate, selectedDate }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [stocksData, setStocksData] = useState([]);
  const [serverIp, setServerIp] = useState(null);

  // Load server IP and button states from localStorage
  useEffect(() => {
    const savedMonitoringState = localStorage.getItem('isMonitoring') === 'true';
    setIsMonitoring(savedMonitoringState);

    fetch('./server_ip.json')
      .then((response) => response.json())
      .then((data) => {
        console.log('response:',data.server_ip)
        setServerIp(data.server_ip);
        console.log('server_ip:',serverIp)
      })
      .catch((error) => {
        console.error('Error:', error);
      });

      console.log('ss:',savedMonitoringState,serverIp)
  
  }, []);

  useEffect(() => {
    console.log('Updated server IP:', serverIp);
    // 在这里可以使用更新后的 serverIp 值
    if (isMonitoring) {
      // Start the interval if monitoring is active
      console.log('ss1:',isMonitoring)
      handleStartStockMonitoring();
    }
  }, [serverIp]); // 注意这里的依赖数组包含了 serverIp
  

  const handleStartStockSelection = () => {
    setIsSelecting(true);
    setIsMonitoring(false);
    clearInterval(intervalId); // Stop the monitoring timer
    setIntervalId(null);

    fetch(`http://${serverIp}:5000/monitor_records/${selectedDate}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        onStockDataUpdate(data); // Update stock data using the provided function
        setStocksData(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        setIsSelecting(false);
      });
  };

  const fetchData = () => {
    fetch(`http://${serverIp}:5000/stock_price`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        onStockDataUpdate(data); // Update stock data using the provided function
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleStartStockMonitoring = () => {
    setIsMonitoring(true);
    localStorage.setItem('isMonitoring', 'true'); // Save the monitoring state to localStorage
    fetchData(); // Fetch initial data

    const id = setInterval(() => {
      fetchData(); // Fetch data every 10 seconds
    }, 10000);

    setIntervalId(id);
    localStorage.setItem('intervalId', id); // Save the intervalId to localStorage
  };

  const handleStopStockMonitoring = () => {
    setIsMonitoring(false);
    localStorage.setItem('isMonitoring', 'false'); // Save the monitoring state to localStorage
    clearInterval(intervalId);
    setIntervalId(null);
    localStorage.removeItem('intervalId'); // Remove the intervalId from localStorage
  };

  // Clean up the interval when the component unmounts
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        localStorage.removeItem('intervalId');
      }
    };
  }, [intervalId]);

  return (
    <div className="my-3 d-flex flex-column">
      <button
        onClick={handleStartStockSelection}
        className="btn btn-success mb-2"
        disabled={isSelecting}
      >
        {isSelecting ? '选股中' : '开始选股'}
      </button>
      <button
        onClick={handleStartStockMonitoring}
        className="btn btn-success mb-2"
        disabled={isMonitoring}
      >
        {isMonitoring ? '监控中' : '开始监控'}
      </button>
      <button
        onClick={handleStopStockMonitoring}
        className="btn btn-danger mb-2"
        disabled={!isMonitoring}
      >
        结束监控
      </button>
    </div>
  );
};

export default StockCommand;
