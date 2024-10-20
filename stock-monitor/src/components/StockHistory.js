import React from 'react';

const StockHistory = ({ stockHistory }) => {
  return (
    <div>
      <div className="card-header">预警历史记录</div>
      <div className="card-body">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>时间</th>
              <th>代码</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            {stockHistory.map((history, index) => (
              <tr key={index}>
                <td>{history.time}</td>
                <td>{history.code}</td>
                <td>{history.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockHistory;