const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable').default;
const fs = require('fs');
const path = require('path');

class PDFReportService {
  constructor() {
    this.logoPath = path.join(__dirname, '../assets/alogo.png');
  }

  async generateMonthlyDeliveryReport(deliveries, month, year) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Set up colors
    const primaryColor = [102, 126, 234]; // #667eea
    const secondaryColor = [118, 75, 162]; // #764ba2
    const textColor = [51, 51, 51]; // #333
    const lightGray = [245, 245, 245]; // #f5f5f5

    // Add logo if exists
    try {
      if (fs.existsSync(this.logoPath)) {
        const logoData = fs.readFileSync(this.logoPath);
        const logoBase64 = logoData.toString('base64');
        doc.addImage(`data:image/png;base64,${logoBase64}`, 'PNG', 20, 15, 30, 20);
      }
    } catch (error) {
      console.log('Logo not found, continuing without logo');
    }

    // Header
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.text('Smart Grocery Management', pageWidth - 20, 25, { align: 'right' });
    
    doc.setFontSize(18);
    doc.setTextColor(...textColor);
    doc.text('Monthly Delivery Report', pageWidth - 20, 35, { align: 'right' });
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`Report Period: ${month} ${year}`, pageWidth - 20, 45, { align: 'right' });
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 20, 55, { align: 'right' });

    // Add line separator
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, 65, pageWidth - 20, 65);

    // Summary Statistics
    const stats = this.calculateStats(deliveries);
    this.addSummarySection(doc, stats, pageWidth);

    // Delivery Details Table
    this.addDeliveryTable(doc, deliveries, pageWidth);

    // Staff Performance Section
    this.addStaffPerformanceSection(doc, deliveries, pageWidth);

    // Footer
    this.addFooter(doc, pageWidth, pageHeight);

    return doc;
  }

  calculateStats(deliveries) {
    const totalDeliveries = deliveries.length;
    const completedDeliveries = deliveries.filter(d => d.deliveryStatus === 'Delivered').length;
    const pendingDeliveries = deliveries.filter(d => d.deliveryStatus === 'Pending').length;
    const inTransitDeliveries = deliveries.filter(d => d.deliveryStatus === 'In Transit').length;
    const failedDeliveries = deliveries.filter(d => d.deliveryStatus === 'Failed').length;
    
    const totalRevenue = deliveries
      .filter(d => d.deliveryStatus === 'Delivered')
      .reduce((sum, d) => sum + (d.orderID?.totalAmount || 0), 0);

    const averageDeliveryTime = this.calculateAverageDeliveryTime(deliveries);
    const successRate = totalDeliveries > 0 ? (completedDeliveries / totalDeliveries) * 100 : 0;

    return {
      totalDeliveries,
      completedDeliveries,
      pendingDeliveries,
      inTransitDeliveries,
      failedDeliveries,
      totalRevenue,
      averageDeliveryTime,
      successRate
    };
  }

  calculateAverageDeliveryTime(deliveries) {
    const completedDeliveries = deliveries.filter(d => 
      d.deliveryStatus === 'Delivered' && 
      d.actualDeliveryTime && 
      d.estimatedDeliveryTime
    );

    if (completedDeliveries.length === 0) return 0;

    const totalMinutes = completedDeliveries.reduce((sum, delivery) => {
      const estimated = new Date(delivery.estimatedDeliveryTime);
      const actual = new Date(delivery.actualDeliveryTime);
      const diffMinutes = (actual - estimated) / (1000 * 60);
      return sum + Math.abs(diffMinutes);
    }, 0);

    return Math.round(totalMinutes / completedDeliveries.length);
  }

  addSummarySection(doc, stats, pageWidth) {
    const startY = 80;
    const boxWidth = (pageWidth - 60) / 2;
    const boxHeight = 40;

    // Summary box
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(20, startY, pageWidth - 40, boxHeight, 3, 3, 'F');
    
    doc.setFontSize(16);
    doc.setTextColor(51, 51, 51);
    doc.text('Monthly Summary', 30, startY + 12);

    // Stats in two columns
    const leftColumn = 30;
    const rightColumn = pageWidth / 2 + 10;
    const lineHeight = 6;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    // Left column
    doc.text(`Total Deliveries: ${stats.totalDeliveries}`, leftColumn, startY + 20);
    doc.text(`Completed: ${stats.completedDeliveries}`, leftColumn, startY + 20 + lineHeight);
    doc.text(`Pending: ${stats.pendingDeliveries}`, leftColumn, startY + 20 + lineHeight * 2);
    
    // Right column
    doc.text(`Success Rate: ${stats.successRate.toFixed(1)}%`, rightColumn, startY + 20);
    doc.text(`Total Revenue: LKR ${stats.totalRevenue.toFixed(2)}`, rightColumn, startY + 20 + lineHeight);
    doc.text(`Avg. Delivery Time: ${stats.averageDeliveryTime} min`, rightColumn, startY + 20 + lineHeight * 2);
  }

  addDeliveryTable(doc, deliveries, pageWidth) {
    const startY = 140;
    
    // Table header
    doc.setFontSize(14);
    doc.setTextColor(51, 51, 51);
    doc.text('Delivery Details', 20, startY);

    // Prepare table data
    const tableData = deliveries.map(delivery => [
      delivery.deliveryID,
      delivery.orderID?.customerID?.customerName || 'N/A',
      delivery.deliveryStatus,
      delivery.orderID?.totalAmount ? `LKR ${delivery.orderID.totalAmount}` : 'N/A',
      delivery.orderID?.paymentMethod || 'N/A',
      new Date(delivery.deliveryDate).toLocaleDateString(),
      delivery.staffID?.staffName || 'Unassigned'
    ]);

    // Create table
    autoTable(doc, {
      startY: startY + 10,
      head: [['Delivery ID', 'Customer', 'Status', 'Amount', 'Payment', 'Date', 'Staff']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [102, 126, 234],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [51, 51, 51]
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Delivery ID
        1: { cellWidth: 30 }, // Customer
        2: { cellWidth: 20 }, // Status
        3: { cellWidth: 25 }, // Amount
        4: { cellWidth: 25 }, // Payment
        5: { cellWidth: 20 }, // Date
        6: { cellWidth: 25 }  // Staff
      },
      margin: { left: 20, right: 20 }
    });
  }

  addStaffPerformanceSection(doc, deliveries, pageWidth) {
    const finalY = doc.lastAutoTable.finalY || 200;
    const startY = finalY + 20;

    // Staff performance header
    doc.setFontSize(14);
    doc.setTextColor(51, 51, 51);
    doc.text('Staff Performance', 20, startY);

    // Calculate staff performance
    const staffStats = this.calculateStaffStats(deliveries);
    
    if (staffStats.length > 0) {
      const tableData = staffStats.map(staff => [
        staff.staffName,
        staff.totalDeliveries,
        staff.completedDeliveries,
        `${staff.successRate.toFixed(1)}%`,
        staff.totalRevenue ? `LKR ${staff.totalRevenue.toFixed(2)}` : 'N/A'
      ]);

      autoTable(doc, {
        startY: startY + 10,
        head: [['Staff Name', 'Total Deliveries', 'Completed', 'Success Rate', 'Revenue']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [118, 75, 162],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [51, 51, 51]
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        },
        columnStyles: {
          0: { cellWidth: 40 }, // Staff Name
          1: { cellWidth: 30 }, // Total Deliveries
          2: { cellWidth: 30 }, // Completed
          3: { cellWidth: 25 }, // Success Rate
          4: { cellWidth: 35 }  // Revenue
        },
        margin: { left: 20, right: 20 }
      });
    }
  }

  calculateStaffStats(deliveries) {
    const staffMap = new Map();

    deliveries.forEach(delivery => {
      const staffId = delivery.staffID?._id || 'unassigned';
      const staffName = delivery.staffID?.staffName || 'Unassigned';
      
      if (!staffMap.has(staffId)) {
        staffMap.set(staffId, {
          staffName,
          totalDeliveries: 0,
          completedDeliveries: 0,
          totalRevenue: 0
        });
      }

      const stats = staffMap.get(staffId);
      stats.totalDeliveries++;
      
      if (delivery.deliveryStatus === 'Delivered') {
        stats.completedDeliveries++;
        stats.totalRevenue += delivery.orderID?.totalAmount || 0;
      }
    });

    return Array.from(staffMap.values()).map(staff => ({
      ...staff,
      successRate: staff.totalDeliveries > 0 ? (staff.completedDeliveries / staff.totalDeliveries) * 100 : 0
    }));
  }

  addFooter(doc, pageWidth, pageHeight) {
    const footerY = pageHeight - 20;
    
    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, footerY - 10, pageWidth - 20, footerY - 10);
    
    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Smart Grocery Management System', 20, footerY);
    doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth - 20, footerY, { align: 'right' });
  }
}

module.exports = PDFReportService;
