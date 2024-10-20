import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockConfig = () => {
  const [firstDayVolRatio, setFirstDayVolRatio] = useState(15);
  const [freeFloatValueRangeMin, setFreeFloatValueRangeMin] = useState(20);
  const [freeFloatValueRangeMax, setFreeFloatValueRangeMax] = useState(30);
  const [circulationValueRangeMin, setCirculationValueRangeMin] = useState(50);
  const [circulationValueRangeMax, setCirculationValueRangeMax] = useState(70);
  const [secondCandleNewHighDays, setSecondCandleNewHighDays] = useState(10);
  const [ma10Ratio, setMa10Ratio] = useState(4.2);
  const [daysToMa10, setDaysToMa10] = useState(5);

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


  return (
    <div className="row my-3">
      <div className="col-12 col-md-4">
        <div className="form-group">
          <label className="d-block mb-2">首日量比大于</label>
          <div className="row">
            <div className="col-sm-3">
              <input type="number" className="form-control text-left" value={config.first_day_vol_ratio} onChange={(e) => handleConfigChange({ ...config, first_day_vol_ratio: e.target.value })} />
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
            <input type="number" className="form-control text-left" value={config.ma10_ratio} onChange={(e) => handleConfigChange({ ...config, ma10_ratio: e.target.value })} />
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