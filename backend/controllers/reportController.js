const PDFReportService = require('../services/pdfReportService');
const Delivery = require('../models/Delivery');
const Order = require('../models/Order');

// Generate monthly delivery report
const generateMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ 
        error: 'Month and year are required' 
      });
    }

    // Create date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Fetch deliveries for the specified month
    const deliveries = await Delivery.find({
      deliveryDate: {
        $gte: startDate,
        $lte: endDate
      }
    })
    .populate('orderID')
    .populate('staffID')
    .populate({
      path: 'orderID',
      populate: {
        path: 'customerID',
        model: 'Customer'
      }
    });

    if (deliveries.length === 0) {
      return res.status(404).json({ 
        error: 'No deliveries found for the specified month' 
      });
    }

    // Generate PDF report
    const pdfService = new PDFReportService();
    const pdfDoc = await pdfService.generateMonthlyDeliveryReport(
      deliveries, 
      getMonthName(month), 
      year
    );

    // Set response headers for PDF download
    const fileName = `Monthly_Delivery_Report_${getMonthName(month)}_${year}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Send PDF buffer
    const pdfBuffer = pdfDoc.output('arraybuffer');
    res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error('Error generating monthly report:', error);
    res.status(500).json({ 
      error: 'Failed to generate monthly report',
      details: error.message 
    });
  }
};

// Get report statistics
const getReportStats = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ 
        error: 'Month and year are required' 
      });
    }

    // Create date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Fetch deliveries for the specified month
    const deliveries = await Delivery.find({
      deliveryDate: {
        $gte: startDate,
        $lte: endDate
      }
    })
    .populate('orderID')
    .populate('staffID');

    // Calculate statistics
    const stats = calculateReportStats(deliveries);
    
    res.json({
      month: getMonthName(month),
      year: parseInt(year),
      stats,
      totalDeliveries: deliveries.length
    });

  } catch (error) {
    console.error('Error getting report stats:', error);
    res.status(500).json({ 
      error: 'Failed to get report statistics',
      details: error.message 
    });
  }
};

// Get available report periods
const getAvailablePeriods = async (req, res) => {
  try {
    // Get all unique year-month combinations from deliveries
    const periods = await Delivery.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$deliveryDate' },
            month: { $month: '$deliveryDate' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 }
      }
    ]);

    const formattedPeriods = periods.map(period => ({
      year: period._id.year,
      month: period._id.month,
      monthName: getMonthName(period._id.month),
      deliveryCount: period.count
    }));

    res.json(formattedPeriods);

  } catch (error) {
    console.error('Error getting available periods:', error);
    res.status(500).json({ 
      error: 'Failed to get available periods',
      details: error.message 
    });
  }
};

// Helper function to calculate report statistics
const calculateReportStats = (deliveries) => {
  const totalDeliveries = deliveries.length;
  const completedDeliveries = deliveries.filter(d => d.deliveryStatus === 'Delivered').length;
  const pendingDeliveries = deliveries.filter(d => d.deliveryStatus === 'Pending').length;
  const inTransitDeliveries = deliveries.filter(d => d.deliveryStatus === 'In Transit').length;
  const failedDeliveries = deliveries.filter(d => d.deliveryStatus === 'Failed').length;
  
  const totalRevenue = deliveries
    .filter(d => d.deliveryStatus === 'Delivered')
    .reduce((sum, d) => sum + (d.orderID?.totalAmount || 0), 0);

  const successRate = totalDeliveries > 0 ? (completedDeliveries / totalDeliveries) * 100 : 0;

  // Calculate average delivery time
  const completedWithTimes = deliveries.filter(d => 
    d.deliveryStatus === 'Delivered' && 
    d.actualDeliveryTime && 
    d.estimatedDeliveryTime
  );

  let averageDeliveryTime = 0;
  if (completedWithTimes.length > 0) {
    const totalMinutes = completedWithTimes.reduce((sum, delivery) => {
      const estimated = new Date(delivery.estimatedDeliveryTime);
      const actual = new Date(delivery.actualDeliveryTime);
      const diffMinutes = (actual - estimated) / (1000 * 60);
      return sum + Math.abs(diffMinutes);
    }, 0);
    averageDeliveryTime = Math.round(totalMinutes / completedWithTimes.length);
  }

  return {
    totalDeliveries,
    completedDeliveries,
    pendingDeliveries,
    inTransitDeliveries,
    failedDeliveries,
    totalRevenue,
    successRate: Math.round(successRate * 100) / 100,
    averageDeliveryTime
  };
};

// Helper function to get month name
const getMonthName = (monthNumber) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber - 1] || 'Unknown';
};

module.exports = {
  generateMonthlyReport,
  getReportStats,
  getAvailablePeriods
};
