import React, { useState, useEffect } from 'react';

const StockTable = ({ date }) => {
  const [stocks, setStocks] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const response = await fetch(`http://127.0.0.1:5000/monitor_records/${date}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setStocks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, [date]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedStocks = sortColumn
    ? [...stocks].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      })
    : stocks;

  if (loading) return <div>Loading...</div>;
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
          <th scope="col" onClick={() => handleSort('concept')}>
            所属概念
            {sortColumn === 'concept' && <i className={`fas fa-sort-${sortDirection}`} />}
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedStocks.map((stock, index) => (
          <tr key={stock.id}>
            <td>{index + 1}</td>
            <td>{stock.stock_code}</td>
            <td>{stock.name}</td>
            <td>{stock.price}</td>
            <td>{stock.change}%</td>
            <td>{stock.below_5_day_line ? 'Yes' : 'No'}</td>
            <td>{stock.below_10_day_line ? 'Yes' : 'No'}</td>
            <td>{stock.concept}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StockTable;
