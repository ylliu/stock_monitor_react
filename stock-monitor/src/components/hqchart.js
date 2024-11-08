import React from 'react';

const HQChart = (code) => {
  
   const stockCode = code.stock;
   
   const format_code = formatStockCode(stockCode)
    const src = `https://gu.qq.com/${format_code}/gp`;
    return (
    
    <div style={{ width: '140vh', height: '100vh'}}>
      <iframe
        src={src}
        title="HQChart"
        width="100%"
        height="100%"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default HQChart;

function formatStockCode(stockCode) {
  if (typeof stockCode !== 'string') {
    console.error('Invalid stock code format');
    return '';
  }

  const [code, suffix] = stockCode.split('.');
  if (!code || !suffix) {
    console.error('Invalid stock code format');
    return '';
  }

  // 将后缀转换为小写，并拼接代码
  return `${suffix.toLowerCase()}${code}`;
}