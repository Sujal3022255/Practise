import React, { useState } from 'react';
import './Analytics.css';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');

  const salesData = [
    { month: 'Jan', sales: 4500, revenue: 15000 },
    { month: 'Feb', sales: 5200, revenue: 18000 },
    { month: 'Mar', sales: 4800, revenue: 16500 },
    { month: 'Apr', sales: 6100, revenue: 21000 },
    { month: 'May', sales: 7300, revenue: 25000 },
    { month: 'Jun', sales: 6800, revenue: 23500 },
  ];

  const downloadReport = (format) => {
    alert(`Downloading ${format.toUpperCase()} report...`);
    // Implement actual download logic here
  };

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h1>Reports & Analytics</h1>
        <div className="time-range-selector">
          <button 
            className={timeRange === 'week' ? 'active' : ''} 
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={timeRange === 'month' ? 'active' : ''} 
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={timeRange === 'year' ? 'active' : ''} 
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      <div className="analytics-cards">
        <div className="analytics-card">
          <h3>Total Sales</h3>
          <p className="big-number">34,700</p>
          <span className="trend positive">↑ 12.5%</span>
        </div>
        <div className="analytics-card">
          <h3>Total Revenue</h3>
          <p className="big-number">$119,500</p>
          <span className="trend positive">↑ 18.2%</span>
        </div>
        <div className="analytics-card">
          <h3>Avg Order Value</h3>
          <p className="big-number">$3.44</p>
          <span className="trend negative">↓ 2.1%</span>
        </div>
        <div className="analytics-card">
          <h3>Conversion Rate</h3>
          <p className="big-number">3.8%</p>
          <span className="trend positive">↑ 0.5%</span>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h2>Sales Overview</h2>
          <div className="bar-chart">
            {salesData.map((item, index) => (
              <div key={index} className="bar-group">
                <div className="bar" style={{ height: `${(item.sales / 100)}px` }}>
                  <span className="bar-value">{item.sales}</span>
                </div>
                <span className="bar-label">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h2>Revenue Breakdown</h2>
          <div className="revenue-list">
            {salesData.map((item, index) => (
              <div key={index} className="revenue-item">
                <span className="revenue-month">{item.month}</span>
                <div className="revenue-bar-bg">
                  <div 
                    className="revenue-bar" 
                    style={{ width: `${(item.revenue / 250)}px` }}
                  ></div>
                </div>
                <span className="revenue-amount">${item.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="download-section">
        <h2>Download Reports</h2>
        <div className="download-buttons">
          <button className="download-btn pdf" onClick={() => downloadReport('pdf')}>
            📄 Download as PDF
          </button>
          <button className="download-btn csv" onClick={() => downloadReport('csv')}>
            📊 Download as CSV
          </button>
          <button className="download-btn excel" onClick={() => downloadReport('excel')}>
            📈 Download as Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
