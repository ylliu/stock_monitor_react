import React, { useState } from 'react';

const StockConfig = () => {
  const [firstDayVolRatio, setFirstDayVolRatio] = useState(15);
  const [freeFloatValueRangeMin, setFreeFloatValueRangeMin] = useState(20);
  const [freeFloatValueRangeMax, setFreeFloatValueRangeMax] = useState(30);
  const [circulationValueRangeMin, setCirculationValueRangeMin] = useState(50);
  const [circulationValueRangeMax, setCirculationValueRangeMax] = useState(70);
  const [secondCandleNewHighDays, setSecondCandleNewHighDays] = useState(10);
  const [ma10Ratio, setMa10Ratio] = useState(4.2);
  const [daysToMa10, setDaysToMa10] = useState(5);

  return (
    <div className="row my-3">
      <div className="col-12 col-md-4">
        <div className="form-group">
          <label className="d-block mb-2">首日量比大于</label>
          <input type="number" className="form-control text-left" value={firstDayVolRatio} onChange={(e) => setFirstDayVolRatio(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="d-block mb-2">第二个阳线收盘价达到X交易日新高</label>
          <input type="number" className="form-control text-left" value={secondCandleNewHighDays} onChange={(e) => setSecondCandleNewHighDays(e.target.value)} />
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="form-group">
          <label className="d-block mb-2">第一个阳线前一天的自由流通市值范围 (单位：亿)</label>
          <div className="input-group">
            <input type="number" className="form-control text-left" value={freeFloatValueRangeMin} onChange={(e) => setFreeFloatValueRangeMin(e.target.value)} />
            <div className="input-group-text">-</div>
            <input type="number" className="form-control text-left" value={freeFloatValueRangeMax} onChange={(e) => setFreeFloatValueRangeMax(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="d-block mb-2">第一个阳线前一天的流通市值范围 (单位：亿)</label>
          <div className="input-group">
            <input type="number" className="form-control text-left" value={circulationValueRangeMin} onChange={(e) => setCirculationValueRangeMin(e.target.value)} />
            <div className="input-group-text">-</div>
            <input type="number" className="form-control text-left" value={circulationValueRangeMax} onChange={(e) => setCirculationValueRangeMax(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="form-group">
          <label className="d-block mb-2">10日线均线放大系数</label>
          <input type="number" className="form-control text-left" value={ma10Ratio} onChange={(e) => setMa10Ratio(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="d-block mb-2">回踩10日均线后第一个阳线的小于交易日</label>
          <input type="number" className="form-control text-left" value={daysToMa10} onChange={(e) => setDaysToMa10(e.target.value)} />
        </div>
      </div>
    </div>
  );
};

export default StockConfig;