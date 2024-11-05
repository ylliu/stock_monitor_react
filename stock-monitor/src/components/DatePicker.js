import React from 'react';

const DatePicker = ({ selectedDate, onChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor="date-picker" className="form-label">选择日期:</label>
      <input
        type="date"
        id="date-picker"
        value={selectedDate}
        onChange={(e) => onChange(e.target.value)}
        className="form-control"
      />
    </div>
  );
};

export default DatePicker;
