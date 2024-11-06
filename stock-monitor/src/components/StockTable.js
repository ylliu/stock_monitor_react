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
  const [serverIp, setServerIp] = useState(null);

  // 读取 server_ip.json 配置
  useEffect(() => {
    fetch('./server_ip.json')
      .then(response => response.json())
      .then(data => {
        setServerIp(data.server_ip);
        console.log(serverIp);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [serverIp]);

  const handleSort = (column) => {
    // 检查是否为日期列
    const isDateColumn = column === 'bullish_start_date' || column === 'bullish_end_date';
  
    // 更新排序列和方向
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  
    // 对 stocksData 排序并更新
    const sortedStocks = [...stocksData].sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];
  
      // 如果是日期字段，将值转换为 Date 对象进行比较
      if (isDateColumn) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
  
      // 根据排序方向进行排序
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  
    setStocks(sortedStocks);
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

  // 处理排序逻辑
  const sortedStocks = sortColumn
    ? [...stocksData].sort((a, b) => {
        let aValue = a[sortColumn];
        let bValue = b[sortColumn];

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      })
    : stocksData;

  const handleMouseOut = () => {
    setSelectedStock(null);
    setSelectedStockData(null);
  };

  const fetchStockKInfo = async (stockCode) => {
    try {
      const response = await axios.get(`http://${serverIp}:5000/stock_K_info/${stockCode}`);
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
            <th scope="col" onClick={() => handleSort('code')}>代码</th>
            <th scope="col" onClick={() => handleSort('name')}>名称</th>
            <th scope="col" onClick={() => handleSort('price')}>最新价</th>
            <th scope="col" onClick={() => handleSort('change')}>实时涨幅</th>
            <th scope="col" onClick={() => handleSort('limit_circ_mv')}>限制流通市值：亿</th>
            <th scope="col" onClick={() => handleSort('free_circ_mv')}>自由流通市值：亿</th>
            <th scope="col" onClick={() => handleSort('below5dma')}>低于5日线</th>
            <th scope="col" onClick={() => handleSort('below10dma')}>低于10日线</th>
            <th scope="col" onClick={() => handleSort('bullish_start_date')}>阳线起始日</th>
            <th scope="col" onClick={() => handleSort('bullish_end_date')}>阳线结束日</th>
            <th scope="col" onClick={() => handleSort('concept')}>所属概念</th>
          </tr>
        </thead>
        <tbody>
          {sortedStocks.map((stock, index) => {
            const isExpanded = expandedRows[stock.id];
            const rowStyle = {
              color: stock.below_5_day_line ? 'red' : 'inherit',
            };
            return (
              <tr key={stock.id} className={stock.below_5_day_line?'red-row': ''}>
                <td>{index + 1}</td>
                <td className="ellipsis">{stock.stock_code}</td>
                <td className="ellipsis" onMouseOver={() => handleMouseOver(stock)} onMouseOut={handleMouseOut}>
                  {stock.stock_name}
                </td>
                <td className="ellipsis">{stock.stock_price}</td>
                <td className={`ellipsis ${stock.stock_change >= 0 ? 'red-text' : 'green-text'}`}>
                  {stock.stock_change}%
                </td>
                <td className="ellipsis">{stock.limit_circ_mv}</td>
                <td className="ellipsis">{stock.free_circ_mv}</td>
                <td>{stock.below_5_day_line ? '是' : '否'}</td>
                <td>{stock.below_10_day_line ? '是' : '否'}</td>
                <td>{stock.bullish_start_date}</td>
                <td>{stock.bullish_end_date}</td>
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
