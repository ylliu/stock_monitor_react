import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StockConfig.css'; // 引入 CSS 文件
const StockConfig = ({ selectedBoard, onBoardChange,selectedConfig  }) => {
  const [config, setConfig] = useState({
    id:1,
    first_day_vol_ratio: 1.5,
    free_float_value_range_min: 20,
    free_float_value_range_max: 30,
    circulation_value_range_min: 50,
    circulation_value_range_max: 70,
    second_candle_new_high_days: 10,
    max_volume_high_days:20,
    five_days_max_up_pct:10,
    ten_days_max_up_pct:20,
    ma10_ratio: 1.001,
    days_to_ma10: 10,
    ma5_trigger: false,
    ma10_trigger: false,
    two_positive_pct_avg:11,
    min_positive_days:2,
    is_margin_stock: false, // 新增字段
    is_second_day_price_up:true,
    config_name:'',
    has_limit_up:false,
    limit_up_days:12,
  });

  const [serverIp, setServerIp] = useState(null);
  
  const [currentConfigId, setCurrentConfigId] = useState(null); // 保存当前配置的 ID

  useEffect(() => {
    fetch('./server_ip.json')
      .then(response => response.json())
      .then(data => {
        setServerIp(data.server_ip);
        console.log(data.server_ip); // 确保正确获取到 serverIp
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

   // Fetch the configuration from the server when selectedBoard or selectedConfig changes
   useEffect(() => {
    if (selectedConfig) {
      console.log(selectedConfig)
      setConfig(selectedConfig); // Update the config state when selected config changes
    }
  }, [selectedConfig]);


   // 根据板块选择查询当前配置的 ID
   useEffect(() => {
    if (selectedBoard && serverIp) {
      axios.get(`http://${serverIp}:5000/config/id/${selectedBoard}`)
        .then(response => {
          setCurrentConfigId(response.data.config_id); // 设置当前配置的 ID
          console.log('Current Config ID:', response.data);
        })
        .catch(error => {
          console.error('Error fetching config ID:', error);
        });
    }
  }, [selectedBoard, serverIp]);

   // 根据配置 ID 获取配置数据
  useEffect(() => {
    if (currentConfigId && serverIp) {
      axios.get(`http://${serverIp}:5000/config/${selectedBoard}/${currentConfigId}`)
        .then(response => {
          setConfig(response.data); // 更新配置数据
        })
        .catch(error => {
          console.error('Error fetching config:', error);
        });
    }
  }, [currentConfigId, serverIp, selectedBoard]);

  
  const handleConfigChange = (newConfig) => {
    setConfig(newConfig);
    // 更新配置数据
    axios.post(`http://${serverIp}:5000/config/${selectedBoard}/${currentConfigId}`, newConfig)
      .then(response => console.log('Config updated:', response.data))
      .catch(error => console.error('Error updating config:', error));
  };

  const handleMa10RatioChange = (e) => {
    const newMa10Ratio = e.target.value;
    setConfig(prevConfig => {
      const newConfig = { ...prevConfig, ma10_ratio: newMa10Ratio };

      // Update configuration on the server
      axios.post(`http://${serverIp}:5000/config/${selectedBoard}/${currentConfigId}`, newConfig)
        .then(response => console.log('Config updated:', response.data))
        .catch(error => console.error('Error updating config:', error));

      return newConfig;
    });
  };

  // Handle changing the selected board
  const handleBoardChange = (board) => {
    if (onBoardChange) {
      onBoardChange(board); // 调用父组件传来的 onBoardChange 方法
      localStorage.setItem('selectedBoard', board); // 保存选中的板块到 localStorage
      console.log('Selected board:', board);
      axios.get(`http://${serverIp}:5000/config/${board}/${currentConfigId}`)
        .then(response => setConfig(response.data))
        .catch(error => console.error('Error fetching config:', error));
    }
  };
  const handleMarginCheckboxChange = (e) => {
    setConfig(prevConfig => {
      const newConfig = { ...prevConfig, is_margin_stock: e.target.checked };
      axios.post(`http://${serverIp}:5000/config/${selectedBoard}/${currentConfigId}`, newConfig)
        .then(response => console.log('Config updated:', response.data))
        .catch(error => console.error('Error updating config:', error));
      return newConfig;
    });
  };

  const handleLimitUpCheckboxChange = (e) => {
    setConfig(prevConfig => {
      const newConfig = { ...prevConfig, has_limit_up: e.target.checked };
      axios.post(`http://${serverIp}:5000/config/${selectedBoard}/${currentConfigId}`, newConfig)
        .then(response => console.log('Config updated:', response.data))
        .catch(error => console.error('Error updating config:', error));
      return newConfig;
    });
  };

  const handleSecondPriceUpCheckboxChange = (e) => {
    setConfig(prevConfig => {
      const newConfig = { ...prevConfig, is_second_day_price_up: e.target.checked };
      axios.post(`http://${serverIp}:5000/config/${selectedBoard}/${currentConfigId}`, newConfig)
        .then(response => console.log('Config updated:', response.data))
        .catch(error => console.error('Error updating config:', error));
      return newConfig;
    });
  };

  
  return (
    <div className="row my-3">
      <div className="col-12 col-md-4">
        <div className="form-group">
          <label className="d-block mb-2">首日量比大于</label>
          <div className="row">
            <div className="col-sm-3">
              <input type="number" step="0.1" className="form-control text-left" value={config.first_day_vol_ratio}  onChange={(e) => handleConfigChange({ ...config, first_day_vol_ratio: e.target.value })} />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="d-block mb-2">连阳最高达到x日新高</label>
          <div className="row">
            <div className="col-sm-3">
              <input type="number" className="form-control text-left" value={config.second_candle_new_high_days} onChange={(e) => handleConfigChange({ ...config, second_candle_new_high_days: e.target.value })} />
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <div className="row">
            <div className="col-sm-8">
              <div className="board-selection">
                <input
                  type="checkbox"
                  checked={selectedBoard === 'main'}
                  onChange={() => handleBoardChange('main')}
                  id="mainBoardCheckbox"
                />
                <label htmlFor="mainBoardCheckbox" className="ml-2">主板</label>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="d-block mb-2">最低连阳天数</label>
          <div className="row">
            <div className="col-sm-6">
              <select
                className="form-control text-left"
                value={config.min_positive_days}
                onChange={(e) => handleConfigChange({ ...config, min_positive_days: parseInt(e.target.value, 10) })} // 确保转换为数字
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="d-block mb-2">10日涨幅不超过</label>
          <div className="row">
            <div className="col-sm-3">
              <input
                type="number"
                step="0.1"
                className="form-control text-left w-75"  // 控制宽度
                style={{ minWidth: "150px", padding: "8px" }}  // 进一步调整大小
                value={config.ten_days_max_up_pct}
                onChange={(e) => handleConfigChange({ ...config, ten_days_max_up_pct: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="d-block mb-2">方案名称</label>
          <div className="row">
            <div className="col-sm-3">
              <input
                type="text"
                className="form-control text-left w-75"  // 控制宽度
                style={{ minWidth: "150px", padding: "8px" }}  // 进一步调整大小
                value={config.config_name}
                onChange={(e) => handleConfigChange({ ...config, config_name: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="form-group">
          <label className="d-block mb-2">爆量前自由流通市值</label>
          <div className="input-group">
            <div className="col-sm-3">
              <input type="number" className="form-control text-left" value={config.free_float_value_range_min} onChange={(e) => handleConfigChange({ ...config, free_float_value_range_min: e.target.value })} />
            </div>
            <div className="input-group-text">-</div>
            <div className="col-sm-3">
              <input type="number" className="form-control text-left" value={config.free_float_value_range_max} onChange={(e) => handleConfigChange({ ...config, free_float_value_range_max: e.target.value })} />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="d-block mb-2">爆量前流通市值</label>
          <div className="input-group">
            <div className="col-sm-3">
              <input type="number" className="form-control text-left" value={config.circulation_value_range_min} onChange={(e) => handleConfigChange({ ...config, circulation_value_range_min: e.target.value })} />
            </div>
            <div className="input-group-text">-</div>
            <div className="col-sm-3">
              <input type="number" className="form-control text-left" value={config.circulation_value_range_max} onChange={(e) => handleConfigChange({ ...config, circulation_value_range_max: e.target.value })} />
            </div>
          </div>
        </div>

        {/* New Board Selection */}
        <div className="form-group">
          <div className="row">
            <div className="col-sm-8">
              <div className="board-selection">
                <input
                  type="checkbox"
                  checked={selectedBoard === 'chiNext'}
                  onChange={() => handleBoardChange('chiNext')}
                  id="chiNextCheckbox"
                />
                <label htmlFor="chiNextCheckbox" className="ml-2">创业板</label>
                <span style={{ margin: '0 10px' }}></span> {/* 添加空白间距 */}
                <input
                  type="checkbox"
                  checked={selectedBoard === 'sciNext'}
                  onChange={() => handleBoardChange('sciNext')}
                  id="sciNextCheckbox"
                />
                <label htmlFor="sciNextCheckbox" className="ml-2">科创板</label>
              </div>
              <div className="margin-select">
                <input
                  type="checkbox"
                  checked={config.is_margin_stock}
                  onChange={handleMarginCheckboxChange}
                />
                <label className="ml-2">&nbsp;&nbsp;是否为融资标的</label>
              </div>
              <div className="form-group">
                <label className="d-block mb-2">最高交易量是前面 xx 天内的最高量</label>
                <div className="row">
                  <div className="col-sm-3">
                    <input
                      type="number"
                      className="form-control text-left w-75"  // 控制宽度
                      style={{ minWidth: "150px", padding: "8px" }}  // 进一步调整大小
                      value={config.max_volume_high_days}
                      onChange={(e) => handleConfigChange({ ...config, max_volume_high_days: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="margin-select">
                <input
                  type="checkbox"
                  checked={config.is_second_day_price_up}
                  onChange={handleSecondPriceUpCheckboxChange}
                />
                <label className="ml-2">&nbsp;&nbsp;第二天是否需要上涨</label>
              </div>

              <div className="margin-select mt-2">
                {/* 新增：最近xx天内有无涨停 */}
                <input
                  type="checkbox"
                  checked={config.has_limit_up}
                  onChange={handleLimitUpCheckboxChange}
                />
                <label className="ml-2">&nbsp;&nbsp;是否有涨停</label>
                <p></p>
                <label className="ml-2">最近XX天内有无涨停</label>
                <input
                  type="number"
                  value={config.limit_up_days}
                  onChange={(e) => handleConfigChange({ ...config, limit_up_days: e.target.value })}
                  className="ml-2 p-1 border rounded w-16"
                  placeholder="天数"
                />
               
              </div>

            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="form-group">
          <label className="d-block mb-2">10日线均线放大系数</label>
          <div className="row">
            <div className="col-sm-6">
              <input
                type="number"
                step="0.001"
                className="form-control text-left"
                value={config.ma10_ratio} // Display three decimal places
                onChange={handleMa10RatioChange}
              />
              </div>
          </div>
        </div>
        <div className="form-group">
          <label className="d-block mb-2">第一个阳线到今天是几天</label>
          <div className="row">
            <div className="col-sm-6">
              <input type="number" className="form-control text-left" value={config.days_to_ma10} onChange={(e) => handleConfigChange({ ...config, days_to_ma10: e.target.value })} />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="d-block mb-2">两日平均振幅</label>
          <div className="row">
            <div className="col-sm-6">
              <input type="number" step="0.1" className="form-control text-left" value={config.two_positive_pct_avg} onChange={(e) => handleConfigChange({ ...config, two_positive_pct_avg: e.target.value })} />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="d-block mb-2">5日涨幅不超过</label>
          <div className="row">
            <div className="col-sm-3">
              <input
                type="number"
                step="0.1"
                className="form-control text-left w-75"  // 控制宽度
                style={{ minWidth: "150px", padding: "8px" }}  // 进一步调整大小
                value={config.five_days_max_up_pct}
                onChange={(e) => handleConfigChange({ ...config, five_days_max_up_pct: e.target.value })}
              />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default StockConfig;
