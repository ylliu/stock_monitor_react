import React, { useState, useEffect } from 'react';
import './StockTable.css'; // 引入 CSS 文件

const StockTable = ({ stocksData }) => {
  const [stocks, setStocks] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({}); // 用于记录每行是否展开

  // 比较两个对象是否相等（用于比较行数据）
  const isRowDataChanged = (oldRow, newRow) => {
    return (
      oldRow.stock_code !== newRow.stock_code ||
      oldRow.stock_name !== newRow.stock_name ||
      oldRow.price !== newRow.price ||
      oldRow.change !== newRow.change ||
      oldRow.below_5_day_line !== newRow.below_5_day_line ||
      oldRow.below_10_day_line !== newRow.below_10_day_line ||
      oldRow.concept !== newRow.concept
    );
  };

  // useEffect(() => {
  //   const fetchStocks = async () => {
  //     try {
  //         const response = await fetch(`http://127.0.0.1:5000/monitor_records/${date}`);
  //         if (!response.ok) {
  //             throw new Error('Network response was not ok');
  //         }
  //         const newData = await response.json();

  //         // 直接替换所有数据
  //         setStocks(newData);

  //         // 数据更新成功，清空错误信息
  //         setError(null);
  //     } catch (err) {
  //         setError(err.message);
  //     }
  //   };

  //   fetchStocks(); // 初始调用

  //   // 每隔 5 秒调用一次
  //   const intervalId = setInterval(fetchStocks, 500000);

  //   // 在组件卸载时清除定时器
  //   return () => clearInterval(intervalId);
  // }, [date]);

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
      [id]: !prev[id], // 切换展开状态
    }));
  };

  const sortedStocks = sortColumn
    ? [...stocksData].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      })
    : stocksData;

  if (error) return <div>Error: {error}</div>;

  return (
    <table className="table table-striped table-hover">
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
          return (
            <tr key={stock.id}>
              <td>{index + 1}</td>
              <td className="ellipsis">{stock.stock_code}</td>
              <td className="ellipsis">{stock.stock_name}</td>
              <td className="ellipsis">{stock.price}</td>
              <td className="ellipsis">{stock.change}%</td>
              <td>{stock.below_5_day_line ? 'Yes' : 'No'}</td>
              <td>{stock.below_10_day_line ? 'Yes' : 'No'}</td>
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
  );
};

export default StockTable;
