import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockConfig = () => {
  const [config, setConfig] = useState({
    first_day_vol_ratio: 15,
    free_float_value_range_min: 20,
    free_float_value_range_max: 30,
    circulation_value_range_min: 50,
    circulation_value_range_max: 70,
    second_candle_new_high_days: 10,
    ma10_ratio: 4.2,
    days_to_ma10: 5
  });

  useEffect(() => {
    // 在组件挂载时获取配置数据
    axios.get('http://127.0.0.1:5000/config')
      .then(response => setConfig(response.data))
      .catch(error => console.error('Error fetching config:', error));
  }, []);

  const handleConfigChange = (newConfig) => {
    setConfig(newConfig);
    // 更新配置数据
    axios.post('http://127.0.0.1:5000/config', newConfig)
      .then(response => console.log('Config updated:', response.data))
      .catch(error => console.error('Error updating config:', error));
  };

  const incrementFirstDayVolRatio = () => {
    setConfig(prevConfig => {
      const newVolRatio = (parseFloat(prevConfig.first_day_vol_ratio) + 0.1).toFixed(1);
      const newConfig = { ...prevConfig, first_day_vol_ratio: newVolRatio };

      axios.post('http://127.0.0.1:5000/config', newConfig)
        .then(response => console.log('Config updated:', response.data))
        .catch(error => console.error('Error updating config:', error));

      return newConfig;
    });
  };

  const decrementFirstDayVolRatio = () => {
    setConfig(prevConfig => {
      const newVolRatio = (parseFloat(prevConfig.first_day_vol_ratio) - 0.1).toFixed(1);
      const newConfig = { ...prevConfig, first_day_vol_ratio: newVolRatio };

      axios.post('http://127.0.0.1:5000/config', newConfig)
        .then(response => console.log('Config updated:', response.data))
        .catch(error => console.error('Error updating config:', error));

      return newConfig;
    });
  };

  const handleMa10RatioChange = (e) => {
    const newMa10Ratio = e.target.value;
    setConfig(prevConfig => {
      const newConfig = { ...prevConfig, ma10_ratio: newMa10Ratio };

      // Update configuration on the server
      axios.post('http://127.0.0.1:5000/config', newConfig)
        .then(response => console.log('Config updated:', response.data))
        .catch(error => console.error('Error updating config:', error));

      return newConfig;
    });
  };

  const incrementMa10Ratio = () => {
    setConfig(prevConfig => {
      const newMa10Ratio = (parseFloat(prevConfig.ma10_ratio) + 0.001).toFixed(3);
      const newConfig = { ...prevConfig, ma10_ratio: newMa10Ratio };

      axios.post('http://127.0.0.1:5000/config', newConfig)
        .then(response => console.log('Config updated:', response.data))
        .catch(error => console.error('Error updating config:', error));

      return newConfig;
    });
  };

  const decrementMa10Ratio = () => {
    setConfig(prevConfig => {
      const newMa10Ratio = (parseFloat(prevConfig.ma10_ratio) - 0.001).toFixed(3);
      const newConfig = { ...prevConfig, ma10_ratio: newMa10Ratio };

      axios.post('http://127.0.0.1:5000/config', newConfig)
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
              <input type="number" className="form-control text-left" value={config.first_day_vol_ratio}  onChange={(e) => handleConfigChange({ ...config, first_day_vol_ratio: e.target.value })} />
            </div>
            <div className="col-sm-1">
              <button onClick={incrementFirstDayVolRatio} className="btn btn-primary">+</button>
            </div>
            <div className="col-sm-1">
              <button onClick={decrementFirstDayVolRatio} className="btn btn-danger">-</button>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="d-block mb-2">第二个阳线收盘价达到X交易日新高</label>
          <div className="row">
            <div className="col-sm-3">
              <input type="number" className="form-control text-left" value={config.second_candle_new_high_days} onChange={(e) => handleConfigChange({ ...config, second_candle_new_high_days: e.target.value })} />
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="form-group">
          <label className="d-block mb-2">第一个阳线前一天的自由流通市值范围 (单位：亿)</label>
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
          <label className="d-block mb-2">第一个阳线前一天的流通市值范围 (单位：亿)</label>
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
      </div>
      <div className="col-12 col-md-4">
        <div className="form-group">
          <label className="d-block mb-2">10日线均线放大系数</label>
          <div className="row">
            <div className="col-sm-3">
              <input
                type="number"
                className="form-control text-left"
                value={config.ma10_ratio}
                onChange={handleMa10RatioChange}
              />
            </div>
            <div className="col-sm-1">
              <button onClick={incrementMa10Ratio} className="btn btn-primary">+</button>
            </div>
            <div className="col-sm-1">
              <button onClick={decrementMa10Ratio} className="btn btn-danger">-</button>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="d-block mb-2">回踩10日均线后第一个阳线的小于交易日</label>
          <div className="row">
            <div className="col-sm-3">
              <input type="number" className="form-control text-left" value={config.days_to_ma10} onChange={(e) => handleConfigChange({ ...config, days_to_ma10: e.target.value })} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockConfig;
