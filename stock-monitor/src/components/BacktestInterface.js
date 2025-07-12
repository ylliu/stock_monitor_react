import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const BacktestInterface = ({ onBack }) => {
  const [backtestConfig, setBacktestConfig] = useState({
    strategy: '',
    startDate: '',
    endDate: '',
    marketBoard: '',
    initialCapital: 5 // 默认5日均线
  });
  
  const [serverIp, setServerIp] = useState(null);
  const [backtestResults, setBacktestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [strategies, setStrategies] = useState([]);

  // 从localStorage加载配置
  const loadConfigFromStorage = () => {
    try {
      const savedConfig = localStorage.getItem('backtestConfig');
      const savedResults = localStorage.getItem('backtestResults');
      const savedStrategies = localStorage.getItem('strategies');
      
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setBacktestConfig(parsedConfig);
      }
      
      if (savedResults) {
        const parsedResults = JSON.parse(savedResults);
        setBacktestResults(parsedResults);
      }
      
      if (savedStrategies) {
        const parsedStrategies = JSON.parse(savedStrategies);
        setStrategies(parsedStrategies);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  // 保存配置到localStorage
  const saveConfigToStorage = (config) => {
    try {
      localStorage.setItem('backtestConfig', JSON.stringify(config));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // 保存回测结果到localStorage
  const saveResultsToStorage = (results) => {
    try {
      localStorage.setItem('backtestResults', JSON.stringify(results));
    } catch (error) {
      console.error('Error saving results to localStorage:', error);
    }
  };

  // 保存策略列表到localStorage
  const saveStrategiesToStorage = (strategies) => {
    try {
      localStorage.setItem('strategies', JSON.stringify(strategies));
    } catch (error) {
      console.error('Error saving strategies to localStorage:', error);
    }
  };

  // 获取服务器IP
  useEffect(() => {
    fetch('./server_ip.json')
      .then(response => response.json())
      .then(data => {
        setServerIp(data.server_ip);
        console.log(data.server_ip);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  // 页面加载时恢复数据
  useEffect(() => {
    loadConfigFromStorage();
  }, []);

  // 通用配置更新函数
  const handleConfigChange = (key, value) => {
    const newConfig = {
      ...backtestConfig,
      [key]: value,
      // 选择板块后保持策略选择，除非策略不属于新板块
      ...(key === 'marketBoard' ? { 
        strategy: strategies.some(s => s.id === parseInt(backtestConfig.strategy) && s.board === value) 
          ? backtestConfig.strategy 
          : '' 
      } : {})
    };
    
    setBacktestConfig(newConfig);
    saveConfigToStorage(newConfig);
  };

  // 监听 marketBoard 变化后调用接口获取策略列表
  useEffect(() => {
    const board = backtestConfig.marketBoard;
    if (!board || !serverIp) {
      // 如果没有板块选择，但localStorage中有策略数据，则保留
      if (!board && strategies.length === 0) {
        setStrategies([]);
      }
      return;
    }

    // 检查是否已有该板块的策略数据，避免重复请求
    const hasStrategiesForBoard = strategies.some(s => s.board === board);
    if (hasStrategiesForBoard && strategies.length > 0) {
      console.log('已有策略数据，跳过请求');
      return;
    }

    fetch(`http://${serverIp}:5000/config/list?board=${board}`)
      .then((response) => response.json())
      .then((data) => {
        // 合并新数据和已有数据，避免覆盖其他板块的策略
        const existingStrategies = strategies.filter(s => s.board !== board);
        const newStrategies = [...existingStrategies, ...data];
        
        setStrategies(newStrategies);
        saveStrategiesToStorage(newStrategies);
        console.log('获取策略列表成功:', data);
      })
      .catch((err) => {
        console.error('Error fetching strategy list:', err);
        // 出错时不清空策略列表，保持原有数据
        alert('获取策略列表失败，请检查网络连接');
      });
  }, [backtestConfig.marketBoard, serverIp]);

  // 格式化日期显示
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    // 如果是8位数字格式 (20250626)，转换为 YYYY-MM-DD 格式
    if (dateString.length === 8) {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      return `${year}-${month}-${day}`;
    }
    return dateString;
  };

  // 运行回测
  const runBacktest = async () => {
    if (!backtestConfig.strategy || !backtestConfig.endDate || !backtestConfig.marketBoard) {
      alert('请完善回测配置');
      return;
    }

    setIsRunning(true);
    // 清空之前的结果
    setBacktestResults(null);
    localStorage.removeItem('backtestResults');
    
    try {
      // 调用监控记录接口获取股票池
      const response = await fetch(`http://${serverIp}:5000/monitor_records/${backtestConfig.endDate}/${backtestConfig.marketBoard}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const stockPoolData = await response.json();
      console.log('获取股票池数据:', stockPoolData);
      
      // 设置回测结果为股票池数据
      const results = {
        stockPool: stockPoolData,
        selectedDate: backtestConfig.endDate,
        selectedBoard: backtestConfig.marketBoard,
        strategy: backtestConfig.strategy
      };
      
      setBacktestResults(results);
      saveResultsToStorage(results);
      
    } catch (error) {
      console.error('获取股票池失败:', error);
      alert('获取股票池失败，请检查网络连接或服务器状态');
    } finally {
      setIsRunning(false);
    }
  };

  const resetBacktest = () => {
    setBacktestResults(null);
    setSelectedStocks([]);
    // 清空localStorage中的结果
    localStorage.removeItem('backtestResults');
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // 初始化默认值 - 只在没有保存数据时执行
  useEffect(() => {
    // 检查是否需要初始化默认值
    const needsInitialization = !backtestConfig.startDate || !backtestConfig.endDate;
    
    if (needsInitialization) {
      const currentDate = getCurrentDate();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const startDate = oneMonthAgo.toISOString().split('T')[0];
      
      const newConfig = {
        ...backtestConfig,
        startDate: backtestConfig.startDate || startDate,
        endDate: backtestConfig.endDate || currentDate,
        // 如果没有板块选择，设置默认板块
        marketBoard: backtestConfig.marketBoard || 'main',
        // 保持其他配置不变
        strategy: backtestConfig.strategy || '',
        initialCapital: backtestConfig.initialCapital || 5
      };
      
      setBacktestConfig(newConfig);
      saveConfigToStorage(newConfig);
    }
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
              {/* 板块选择 */}
              <div className="mb-3">
                <label className="form-label">选择板块</label>
                <select
                  className="form-select"
                  value={backtestConfig.marketBoard}
                  onChange={(e) => handleConfigChange('marketBoard', e.target.value)}
                >
                  <option value="">请选择板块</option>
                  <option value="main">主板</option>
                  <option value="chiNext">创业板</option>
                  <option value="sciNext">科创板</option>
                </select>
              </div>

              {/* 策略选择 */}
              <div className="mb-3">
                <label className="form-label">选择策略</label>
                <select
                  className="form-select"
                  value={backtestConfig.strategy}
                  onChange={(e) => handleConfigChange('strategy', e.target.value)}
                  disabled={!strategies.filter(s => s.board === backtestConfig.marketBoard).length}
                >
                  <option value="">请选择策略</option>
                  {strategies
                    .filter((strategy) => strategy.board === backtestConfig.marketBoard)
                    .map((strategy) => (
                      <option key={strategy.id} value={strategy.id}>
                        {strategy.config_name}
                      </option>
                    ))}
                </select>
                {backtestConfig.strategy && (
                  <small className="text-muted">
                    策略ID: {backtestConfig.strategy} | 板块: {backtestConfig.marketBoard}
                    {strategies.find((s) => s.id === parseInt(backtestConfig.strategy) && s.board === backtestConfig.marketBoard)?.is_applied && 
                      <span className="badge bg-success ms-2">已应用</span>
                    }
                  </small>
                )}
              </div>

              {/* 回测日期 */}
              <div className="mb-3">
                <label className="form-label">回测日期</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={backtestConfig.endDate}
                  onChange={(e) => handleConfigChange('endDate', e.target.value)}
                />
              </div>

              {/* 均线成本 */}
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

          {backtestResults && backtestResults.stockPool && (
            <div className="card">
              <div className="card-header">
                <h5>股票池 - {backtestResults.selectedDate} ({backtestResults.selectedBoard})</h5>
              </div>
              <div className="card-body">
                {/* 股票池统计信息 */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6>总股票数量</h6>
                        <h4 className="text-primary">{backtestResults.stockPool.length}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6>选择策略</h6>
                        <h6 className="text-info">
                          {strategies.find(s => s.id === parseInt(backtestResults.strategy))?.config_name || '未知策略'}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 股票列表 */}
                <h6>股票列表</h6>
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-blue">
                      <tr>
                        <th>序号</th>
                        <th>股票名称</th>
                        <th>阳线开始日</th>
                        <th>阳线结束日</th>
                        <th>触发日期</th>
                        <th>成本价</th>
                        <th>持有最高价</th>
                        <th>持有最高收益率</th>
                      </tr>
                    </thead>
                    <tbody>
                      {backtestResults.stockPool.map((stock, index) => (
                        <tr key={stock.code || index}>
                          <td>{index + 1}</td>
                          <td>{stock.stock_name || '-'}</td>
                          <td className="text-success">
                            {formatDate(stock.bullish_start_date)}
                          </td>
                          <td className="text-success">
                            {formatDate(stock.bullish_end_date)}
                          </td>
                          <td className="text-success">
                            {formatDate(stock.tigger_date)}
                          </td>
                         
                          <td>{stock.cost_price || '-'}</td>
                          <td>{stock.hold_max_price || '-'}</td>
                          <td>{stock.hold_max_rate || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 如果没有数据 */}
                {(!backtestResults.stockPool || backtestResults.stockPool.length === 0) && (
                  <div className="text-center text-muted py-4">
                    <p>该日期和板块下暂无股票数据</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!isRunning && !backtestResults && (
            <div className="card">
              <div className="card-body text-center text-muted">
                <p>请配置回测参数并点击"开始回测"获取股票池</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BacktestInterface;