import React, { useState } from 'react';

const StockTable = ({ stocks }) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedStocks = sortColumn
    ? stocks.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      })
    : stocks;

  return (
    <table className="table table-striped table-hover">
      <thead className="thead-dark">
        <tr>
          <th scope="col">序号</th>
          <th scope="col" onClick={() => handleSort('code')}>
            代码
            {sortColumn === 'code' && (
              <i className={`fas fa-sort-${sortDirection}`} />
            )}
          </th>
          <th scope="col" onClick={() => handleSort('name')}>
            名称
            {sortColumn === 'name' && (
              <i className={`fas fa-sort-${sortDirection}`} />
            )}
          </th>
          <th scope="col" onClick={() => handleSort('price')}>
            最新价
            {sortColumn === 'price' && (
              <i className={`fas fa-sort-${sortDirection}`} />
            )}
          </th>
          <th scope="col" onClick={() => handleSort('change')}>
            实时涨幅
            {sortColumn === 'change' && (
              <i className={`fas fa-sort-${sortDirection}`} />
            )}
          </th>
          <th scope="col" onClick={() => handleSort('below5dma')}>
            低于5日线
            {sortColumn === 'below5dma' && (
              <i className={`fas fa-sort-${sortDirection}`} />
            )}
          </th>
          <th scope="col" onClick={() => handleSort('below10dma')}>
            低于10日线
            {sortColumn === 'below10dma' && (
              <i className={`fas fa-sort-${sortDirection}`} />
            )}
          </th>
          <th scope="col" onClick={() => handleSort('concept')}>
            所属概念
            {sortColumn === 'concept' && (
              <i className={`fas fa-sort-${sortDirection}`} />
            )}
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedStocks.map((stock, index) => (
          <tr key={stock.id}>
            <td>{index + 1}</td>
            <td>{stock.code}</td>
            <td>{stock.name}</td>
            <td>{stock.price}</td>
            <td>{stock.change}%</td>
            <td>{stock.below5dma ? 'Yes' : 'No'}</td>
            <td>{stock.below10dma ? 'Yes' : 'No'}</td>
            <td>{stock.concept}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StockTable;