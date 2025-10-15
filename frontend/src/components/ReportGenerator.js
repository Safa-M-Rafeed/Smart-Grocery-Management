import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReportGenerator.css';

const ReportGenerator = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availablePeriods, setAvailablePeriods] = useState([]);
  const [reportStats, setReportStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAvailablePeriods();
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchReportStats();
    }
  }, [selectedMonth, selectedYear]);

  const fetchAvailablePeriods = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/reports/periods');
      setAvailablePeriods(response.data);
    } catch (err) {
      console.error('Error fetching available periods:', err);
    }
  };

  const fetchReportStats = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/reports/monthly/stats?month=${selectedMonth}&year=${selectedYear}`);
      setReportStats(response.data);
    } catch (err) {
      console.error('Error fetching report stats:', err);
    }
  };

  const generatePDFReport = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `http://localhost:4000/api/reports/monthly/pdf?month=${selectedMonth}&year=${selectedYear}`,
        { responseType: 'blob' }
      );

      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const monthName = getMonthName(selectedMonth);
      link.download = `Monthly_Delivery_Report_${monthName}_${selectedYear}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Error generating report:', err);
      
      let errorMessage = 'Failed to generate report';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.details) {
        errorMessage = err.response.data.details;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (monthNumber) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1];
  };

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  const getYearOptions = () => {
    const currentYear = getCurrentYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 5; year--) {
      years.push(year);
    }
    return years;
  };

  return (
    <div className="report-generator">
      <div className="report-header">
        <h2>📊 Monthly Delivery Report Generator</h2>
        <p>Generate comprehensive PDF reports for delivery performance</p>
      </div>

      <div className="report-controls">
        <div className="control-group">
          <label htmlFor="month">Select Month:</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="form-select"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {getMonthName(i + 1)}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="year">Select Year:</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="form-select"
          >
            {getYearOptions().map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={generatePDFReport}
          disabled={loading}
          className="generate-btn"
        >
          {loading ? 'Generating...' : '📄 Generate PDF Report'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {reportStats && (
        <div className="report-preview">
          <h3>📈 Report Preview - {getMonthName(selectedMonth)} {selectedYear}</h3>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <div className="stat-value">{reportStats.stats.totalDeliveries}</div>
                <div className="stat-label">Total Deliveries</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-value">{reportStats.stats.completedDeliveries}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <div className="stat-value">{reportStats.stats.pendingDeliveries}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🚚</div>
              <div className="stat-content">
                <div className="stat-value">{reportStats.stats.inTransitDeliveries}</div>
                <div className="stat-label">In Transit</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">❌</div>
              <div className="stat-content">
                <div className="stat-value">{reportStats.stats.failedDeliveries}</div>
                <div className="stat-label">Failed</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-value">LKR {reportStats.stats.totalRevenue.toFixed(2)}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-value">{reportStats.stats.successRate.toFixed(1)}%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <div className="stat-value">{reportStats.stats.averageDeliveryTime} min</div>
                <div className="stat-label">Avg. Delivery Time</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {availablePeriods.length > 0 && (
        <div className="available-periods">
          <h3>📅 Available Report Periods</h3>
          <p className="periods-note">
            💡 Select a period with delivery data to generate a report
          </p>
          <div className="periods-list">
            {availablePeriods.map((period, index) => (
              <div key={index} className="period-item">
                <span className="period-date">{period.monthName} {period.year}</span>
                <span className="period-count">{period.deliveryCount} deliveries</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
