import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const BacktestInterface = ({ onBack }) => {
  const [backtestConfig, setBacktestConfig] = useState({
    strategy: '',
    startDate: '',
    endDate: '',
    initialCapital: 100000,
    commission: 0.0025,
    slippage: 0.001,
    maxPositions: 10
  });

  const [backtestResults, setBacktestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState([]);

  // 模拟的策略列表
  const strategies = [
    { id: 'ma_crossover', name: '均线交叉策略', description: '5日线上穿10日线买入，下穿卖出' },
    { id: 'pullback', name: '回踩策略', description: '股价回踩支撑位后买入' },
    { id: 'breakout', name: '突破策略', description: '突破重要阻力位买入' },
    { id: 'volume_surge', name: '放量突破', description: '量价齐升时买入' }
  ];

  // 模拟的股票池
  const stockPool = [
    { code: '000001', name: '平安银行' },
    { code: '000002', name: '万科A' },
    { code: '000858', name: '五粮液' },
    { code: '600036', name: '招商银行' },
    { code: '600519', name: '贵州茅台' },
    { code: '000651', name: '格力电器' }
  ];

  const handleConfigChange = (field, value) => {
    setBacktestConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStockSelection = (stockCode) => {
    setSelectedStocks(prev => {
      if (prev.includes(stockCode)) {
        return prev.filter(code => code !== stockCode);
      } else {
        return [...prev, stockCode];
      }
    });
  };

  const runBacktest = async () => {
    if (!backtestConfig.strategy || !backtestConfig.startDate || !backtestConfig.endDate) {
      alert('请完善回测配置');
      return;
    }

    setIsRunning(true);
    
    // 模拟回测运行
    setTimeout(() => {
      const mockResults = {
        totalReturn: 0.125,
        annualizedReturn: 0.084,
        sharpeRatio: 1.23,
        maxDrawdown: 0.085,
        winRate: 0.67,
        totalTrades: 156,
        winningTrades: 105,
        losingTrades: 51,
        avgWinningTrade: 0.034,
        avgLosingTrade: -0.021,
        profitFactor: 1.89,
        tradingDays: 252,
        trades: [
          { date: '2023-01-15', stock: '000001', action: '买入', price: 15.23, quantity: 1000, pnl: 0 },
          { date: '2023-01-22', stock: '000001', action: '卖出', price: 16.45, quantity: 1000, pnl: 1220 },
          { date: '2023-02-03', stock: '000002', action: '买入', price: 28.56, quantity: 500, pnl: 0 },
          { date: '2023-02-10', stock: '000002', action: '卖出', price: 30.12, quantity: 500, pnl: 780 },
          { date: '2023-02-15', stock: '600519', action: '买入', price: 1825.67, quantity: 10, pnl: 0 },
          { date: '2023-02-28', stock: '600519', action: '卖出', price: 1756.23, quantity: 10, pnl: -694 }
        ]
      };
      
      setBacktestResults(mockResults);
      setIsRunning(false);
    }, 3000);
  };

  const resetBacktest = () => {
    setBacktestResults(null);
    setSelectedStocks([]);
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  useEffect(() => {
    const currentDate = getCurrentDate();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const startDate = oneYearAgo.toISOString().split('T')[0];
    
    setBacktestConfig(prev => ({
      ...prev,
      startDate,
      endDate: currentDate
    }));
  }, []);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="text-primary">策略回测系统</h4>
        <button 
          className="btn btn-secondary" 
          onClick={onBack}
        >
          返回主界面
        </button>
      </div>

      <div className="row">
        {/* 回测配置 */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>回测配置</h5>
            </div>
            <div className="card-body">
              {/* 策略选择 */}
              <div className="mb-3">
                <label className="form-label">选择策略</label>
                <select 
                  className="form-select" 
                  value={backtestConfig.strategy}
                  onChange={(e) => handleConfigChange('strategy', e.target.value)}
                >
                  <option value="">请选择策略</option>
                  {strategies.map(strategy => (
                    <option key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </option>
                  ))}
                </select>
                {backtestConfig.strategy && (
                  <small className="text-muted">
                    {strategies.find(s => s.id === backtestConfig.strategy)?.description}
                  </small>
                )}
              </div>

              {/* 时间范围 */}
              <div className="mb-3">
                <label className="form-label">开始日期</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={backtestConfig.startDate}
                  onChange={(e) => handleConfigChange('startDate', e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">结束日期</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={backtestConfig.endDate}
                  onChange={(e) => handleConfigChange('endDate', e.target.value)}
                />
              </div>

              {/* 触发均线成本 */}
              <div className="mb-3">
                <label className="form-label">均线成本价格</label>
              <select
                className="form-select"
                value={backtestConfig.initialCapital}
                onChange={(e) => handleConfigChange('initialCapital', Number(e.target.value))}
              >
                <option value={5}>5日均线</option>
                <option value={10}>10日均线</option>
                <option value={20}>20日均线</option>
                <option value={30}>30日均线</option>
                <option value={60}>60日均线</option>
              </select>
              </div>
              {/* 操作按钮 */}
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary" 
                  onClick={runBacktest}
                  disabled={isRunning}
                >
                  {isRunning ? '回测中...' : '开始回测'}
                </button>
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={resetBacktest}
                >
                  重置
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 回测结果 */}
        <div className="col-md-8">
          {isRunning && (
            <div className="card">
              <div className="card-body text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">加载中...</span>
                </div>
                <p className="mt-3">正在运行回测，请稍候...</p>
              </div>
            </div>
          )}

          {backtestResults && (
            <div className="card">
              <div className="card-header">
                <h5>回测结果</h5>
              </div>
              <div className="card-body">
                {/* 核心指标 */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6>收益指标</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td>总收益率</td>
                          <td className="text-end">
                            <span className={backtestResults.totalReturn >= 0 ? 'text-success' : 'text-danger'}>
                              {(backtestResults.totalReturn * 100).toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>年化收益率</td>
                          <td className="text-end">
                            <span className={backtestResults.annualizedReturn >= 0 ? 'text-success' : 'text-danger'}>
                              {(backtestResults.annualizedReturn * 100).toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>夏普比率</td>
                          <td className="text-end">{backtestResults.sharpeRatio.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>最大回撤</td>
                          <td className="text-end text-danger">
                            {(backtestResults.maxDrawdown * 100).toFixed(2)}%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h6>交易指标</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td>胜率</td>
                          <td className="text-end">{(backtestResults.winRate * 100).toFixed(2)}%</td>
                        </tr>
                        <tr>
                          <td>总交易次数</td>
                          <td className="text-end">{backtestResults.totalTrades}</td>
                        </tr>
                        <tr>
                          <td>盈利交易</td>
                          <td className="text-end text-success">{backtestResults.winningTrades}</td>
                        </tr>
                        <tr>
                          <td>亏损交易</td>
                          <td className="text-end text-danger">{backtestResults.losingTrades}</td>
                        </tr>
                        <tr>
                          <td>平均盈利</td>
                          <td className="text-end text-success">
                            {(backtestResults.avgWinningTrade * 100).toFixed(2)}%
                          </td>
                        </tr>
                        <tr>
                          <td>平均亏损</td>
                          <td className="text-end text-danger">
                            {(backtestResults.avgLosingTrade * 100).toFixed(2)}%
                          </td>
                        </tr>
                        <tr>
                          <td>盈亏比</td>
                          <td className="text-end">{backtestResults.profitFactor.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 交易记录 */}
                <div className="mt-4">
                  <h6>交易记录</h6>
                  <div className="table-responsive">
                    <table className="table table-sm table-hover">
                      <thead>
                        <tr>
                          <th>日期</th>
                          <th>股票代码</th>
                          <th>操作</th>
                          <th>价格</th>
                          <th>数量</th>
                          <th>盈亏</th>
                        </tr>
                      </thead>
                      <tbody>
                        {backtestResults.trades.map((trade, index) => (
                          <tr key={index}>
                            <td>{trade.date}</td>
                            <td>{trade.stock}</td>
                            <td>
                              <span className={trade.action === '买入' ? 'text-success' : 'text-danger'}>
                                {trade.action}
                              </span>
                            </td>
                            <td>¥{trade.price.toFixed(2)}</td>
                            <td>{trade.quantity}</td>
                            <td className={trade.pnl >= 0 ? 'text-success' : 'text-danger'}>
                              {trade.pnl >= 0 ? '+' : ''}¥{trade.pnl.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isRunning && !backtestResults && (
            <div className="card">
              <div className="card-body text-center text-muted">
                <p>请配置回测参数并点击"开始回测"</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BacktestInterface;