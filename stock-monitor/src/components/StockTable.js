import React, { useState, useEffect } from 'react';
import './StockTable.css'; // 引入 CSS 文件
import CandlestickChart from './CandlestickChart'; // 自定义组件用于显示K线图
import axios from 'axios';

const StockTable = ({ stocksData }) => {
  const [stocks, setStocks] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedStockData, setSelectedStockData] = useState(null);

  fetch('../../ip_server.json')
  .then(response => response.json())
  .then(data => {
    const server_ip = data.server_ip;
    console.log(server_ip); // 打印从JSON中读取的IP地址
  })
  .catch(error => {
    console.error('Error:', error);
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleExpandRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!stocksData.length) {
    return null;
  }

  const sortedStocks = sortColumn
    ? [...stocksData].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      })
    : stocksData;

  const handleMouseOut = () => {
    setSelectedStock(null);
    setSelectedStockData(null);
  };

  const fetchStockKInfo = async (stockCode) => {
    try {
      const response = await axios.get(`http://${server_ip}:5000/stock_K_info/${stockCode}`);
      setSelectedStockData(response.data);
    } catch (error) {
      console.error('Error fetching stock K info:', error);
    }
  };

  const handleMouseOver = (stock) => {
    setSelectedStock(stock);
    fetchStockKInfo(stock.stock_code);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <table className="">
        <thead className="thead-dark">
          <tr>
            <th scope="col">序号</th>
            <th scope="col" onClick={() => handleSort('code')}>
              代码
              {sortColumn === 'code' && <i className={`fas fa-sort-${sortDirection}`} />}
            </th>
            <th scope="col" onClick={() => handleSort('name')}>
              名称
              {sortColumn === 'name' && <i className={`fas fa-sort-${sortDirection}`} />}
            </th>
            <th scope="col" onClick={() => handleSort('price')}>
              最新价
              {sortColumn === 'price' && <i className={`fas fa-sort-${sortDirection}`} />}
            </th>
            <th scope="col" onClick={() => handleSort('change')}>
              实时涨幅
              {sortColumn === 'change' && <i className={`fas fa-sort-${sortDirection}`} />}
            </th>
            <th scope="col" onClick={() => handleSort('limit_circ_mv')}>
              限制流通市值：亿
              {sortColumn === 'limit_circ_mv' && <i className={`fas fa-sort-${sortDirection}`} />}
            </th>
            <th scope="col" onClick={() => handleSort('free_circ_mv')}>
              自由流通市值：亿
              {sortColumn === 'free_circ_mv' && <i className={`fas fa-sort-${sortDirection}`} />}
            </th>
            <th scope="col" onClick={() => handleSort('below5dma')}>
              低于5日线
              {sortColumn === 'below5dma' && <i className={`fas fa-sort-${sortDirection}`} />}
            </th>
            <th scope="col" onClick={() => handleSort('below10dma')}>
              低于10日线
              {sortColumn === 'below10dma' && <i className={`fas fa-sort-${sortDirection}`} />}
            </th>
            <th scope="col" onClick={() => handleSort('concept')} className="concept-column">
              所属概念
              {sortColumn === 'concept' && <i className={`fas fa-sort-${sortDirection}`} />}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedStocks.map((stock, index) => {
            const isExpanded = expandedRows[stock.id];
            const rowStyle = {
              color: stock.below_5_day_line ? 'red' : 'inherit',
            };
            return (
              <tr key={stock.id} style={rowStyle}>
                <td>{index + 1}</td>
                <td className="ellipsis">{stock.stock_code}</td>
                <td className="ellipsis" onMouseOver={() => handleMouseOver(stock)} onMouseOut={handleMouseOut}>
                  {stock.stock_name}
                </td>
                <td className="ellipsis">{stock.stock_price}</td>
                <td className={`ellipsis ${stock.stock_change >= 0 ? 'green-text' : 'red-text'}`}>
                  {stock.stock_change}%
                </td>
                <td className="ellipsis">{stock.limit_circ_mv}</td>
                <td className="ellipsis">{stock.free_circ_mv}</td>
                <td>{stock.below_5_day_line ? '是' : '否'}</td>
                <td>{stock.below_10_day_line ? '是' : '否'}</td>
                <td className="ellipsis concept-column">
                  <span className={isExpanded ? 'expanded' : 'collapsed'}>
                    {stock.concept}
                  </span>
                  <button className="expand-button" onClick={() => handleExpandRow(stock.id)}>
                    <svg
                      className={`arrow-icon ${isExpanded ? 'up' : 'down'}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                    >
                      <path d={isExpanded ? 'M7 10l5 5 5-5z' : 'M7 14l5-5 5 5z'} />
                    </svg>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {selectedStockData && (
        <div className="candlestick-chart-container">
          <CandlestickChart data={selectedStockData} />
        </div>
      )}
    </div>
  );
};

export default StockTable;
