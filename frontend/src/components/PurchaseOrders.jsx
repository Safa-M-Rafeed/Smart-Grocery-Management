import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowPathIcon, PlusIcon, EyeIcon, ArrowDownTrayIcon, TrashIcon, BuildingOfficeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    } 
  }
};

const StatCard = ({ title, value, icon, color }) => (
  <motion.div variants={cardVariants}>
    <div className={`h-full bg-gradient-to-r ${color} text-white relative overflow-hidden rounded-lg before:content-[''] before:absolute before:top-0 before:right-0 before:w-20 before:h-20 before:bg-white/10 before:rounded-full before:translate-x-[25px] before:-translate-y-[25px]`}>
      <div className="p-4 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-white/20 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <h3 className="text-3xl font-bold mb-1">{value}</h3>
        <p className="opacity-90 text-sm">{title}</p>
      </div>
    </div>
  </motion.div>
);

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPO, setSelectedPO] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, sent: 0, received: 0, cancelled: 0 });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.get('http://localhost:5000/api/purchaseOrders');
      const ordersWithId = res.data.map(po => ({ ...po, id: po._id }));
      setOrders(ordersWithId);
      
      const total = ordersWithId.length;
      const pending = ordersWithId.filter(o => o.status === 'pending').length;
      const sent = ordersWithId.filter(o => o.status === 'sent').length;
      const received = ordersWithId.filter(o => o.status === 'received').length;
      const cancelled = ordersWithId.filter(o => o.status === 'cancelled').length;
      
      setStats({ total, pending, sent, received, cancelled });
      setLoading(false);
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError(`Failed to fetch purchase orders: ${err.response?.data?.message || err.message}`);
      setLoading(false);
    }
  };

  const handleView = (po) => {
    setSelectedPO(po);
    setModalOpen(true);
  };

  const handleUpdateStatus = async (status) => {
    try {
      await axios.put(`http://localhost:5000/api/purchaseOrders/${selectedPO._id}`, { status });
      setModalOpen(false);
      fetchOrders();
    } catch (err) {
      console.error('Update status error:', err);
      setError(`Failed to update purchase order status: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleGeneratePO = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/purchaseOrders/generate');
      fetchOrders();
    } catch (err) {
      console.error('Generate PO error:', err);
      setError(`Failed to generate purchase order: ${err.response?.data?.message || err.message}`);
    }
  };

const handleExportPDF = (po) => {
  try {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const taxRate = 0.15; // 15% tax as example

    // Header with solid color
    doc.setFillColor(83, 125, 93); // #537D5D in RGB
    doc.rect(0, 0, 210, 50, 'F');
    
    // Logo placeholder (replace with actual base64 or URL)
    doc.addImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', 'PNG', 10, 10, 30, 30);
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('SmartInventory System', 45, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('123 Inventory Lane, Colombo, Sri Lanka', 45, 30);
    doc.text('Email: info@smartinventory.com | Phone: +94 112 345 678', 45, 36);
    
    // Invoice Details Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Purchase Order Invoice', 14, 60);
    doc.setFontSize(10);
    doc.text(`PO Number: ${po.poNumber || 'N/A'}`, 14, 70);
    doc.text(`Date: ${currentDate}`, 14, 80);
    doc.text(`Supplier: ${po.supplier || 'N/A'}`, 14, 90);
    doc.text(`Status: ${po.status || 'N/A'}`, 14, 100);
    
    // Product Table with modern styling
    const tableData = po.products?.map(p => [
      p.productId?.name || 'Unknown Product',
      p.quantityToOrder || 0,
      (p.productId?.price || 0).toFixed(2),
      ((p.productId?.price || 0) * (p.quantityToOrder || 0)).toFixed(2)
    ]) || [['No products', 0, '0.00', '0.00']];
    
    autoTable(doc, {
      head: [['Product', 'Quantity', 'Unit Price (LKR)', 'Total (LKR)']],
      body: tableData,
      startY: 110,
      theme: 'grid',
      headStyles: { fillColor: [83, 125, 93], textColor: 255, fontStyle: 'bold' },
      bodyStyles: { textColor: 50, cellPadding: 4 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: 'bold' },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 40, halign: 'right' },
        3: { cellWidth: 40, halign: 'right' }
      },
      margin: { left: 14, right: 14 },
      didParseCell: (data) => {
        if (data.row.section === 'body' && data.column.index === 3) {
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });
    
    // Totals Section
    const subtotal = tableData.reduce((sum, row) => sum + parseFloat(row[3] || 0), 0);
    const tax = subtotal * taxRate;
    const grandTotal = subtotal + tax;
    
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text('Subtotal:', 130, finalY);
    doc.text(subtotal.toFixed(2), 190, finalY, { align: 'right' });
    doc.text(`Tax (${taxRate * 100}%):`, 130, finalY + 10);
    doc.text(tax.toFixed(2), 190, finalY + 10, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(83, 125, 93);
    doc.text('Grand Total:', 130, finalY + 20);
    doc.text(grandTotal.toFixed(2), 190, finalY + 20, { align: 'right' });
    
    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.setFontSize(8);
    doc.text('Thank you for your business. Payment terms: Net 30 days.', 14, finalY + 40);
    doc.text('For inquiries, contact info@smartinventory.com', 14, finalY + 50);

    doc.save(`PO_Invoice_${po.poNumber || po._id}_${currentDate.replace(/ /g, '_')}.pdf`);
  } catch (err) {
    console.error('PDF generation error:', err);
    alert('Failed to generate PDF. Please try again.');
  }
};

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`http://localhost:5000/api/purchaseOrders/${id}`);
        fetchOrders();
      } catch (err) {
        setError('Failed to delete');
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-[calc(100vh-64px)]"><div className="animate-spin h-16 w-16 border-4 border-primary-main border-t-transparent rounded-full"></div></div>;

  if (error) return <div className="m-8 rounded-lg bg-red-100 p-4 shadow-md">{error}</div>;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 md:p-8">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-2xl font-bold">Purchase Orders</h4>
          <button onClick={fetchOrders} className="bg-gray-100 p-2 rounded hover:bg-gray-200 mr-2">
            <ArrowPathIcon className="h-6 w-6" />
          </button>
          <button onClick={handleGeneratePO} className="bg-primary-main text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg">
            <PlusIcon className="h-5 w-5 inline mr-2" /> Manually Generate PO
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Orders" value={stats.total} icon={<DocumentTextIcon className="h-6 w-6" />} color="from-[#667eea] to-[#667eea99]" />
        <StatCard title="Pending Orders" value={stats.pending} icon={<DocumentTextIcon className="h-6 w-6" />} color="from-[#f093fb] to-[#f093fb99]" />
        <StatCard title="Sent Orders" value={stats.sent} icon={<DocumentTextIcon className="h-6 w-6" />} color="from-[#4facfe] to-[#4facfe99]" />
        <StatCard title="Received Orders" value={stats.received} icon={<DocumentTextIcon className="h-6 w-6" />} color="from-[#43e97b] to-[#43e97b99]" />
        <StatCard title="Cancelled Orders" value={stats.cancelled} icon={<DocumentTextIcon className="h-6 w-6" />} color="from-[#ff758c] to-[#ff758c99]" />
      </div>

      <motion.div variants={cardVariants} className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="p-4 text-left font-semibold">Supplier</th>
              <th className="p-4 text-left font-semibold">Date</th>
              <th className="p-4 text-left font-semibold">Products</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(po => (
              <tr key={po.id} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="p-4 flex items-center gap-2"><BuildingOfficeIcon className="h-4 w-4 text-gray-500" /> {po.supplier || 'N/A'}</td>
                <td className="p-4">{new Date(po.createdAt).toLocaleDateString()}</td>
                <td className="p-4">{po.products?.length || 0}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${po.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : po.status === 'sent' ? 'bg-blue-100 text-blue-700' : po.status === 'received' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => handleView(po)} className="p-1 text-blue-500 hover:bg-blue-50 rounded"><EyeIcon className="h-4 w-4" /></button>
                  <button onClick={() => handleExportPDF(po)} className="p-1 text-green-500 hover:bg-green-50 rounded"><ArrowDownTrayIcon className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(po.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><TrashIcon className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h4 className="text-xl font-bold mb-4">Purchase Order Details</h4>
            <p className="text-sm">Supplier: {selectedPO?.supplier || 'N/A'}</p>
            <p className="text-sm">Date: {selectedPO && new Date(selectedPO.createdAt).toLocaleDateString()}</p>
            <p className="text-sm">Status: {selectedPO?.status || 'N/A'}</p>
            <table className="w-full mt-4">
              <thead>
                <tr>
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Quantity to Order</th>
                </tr>
              </thead>
              <tbody>
                {selectedPO?.products?.map((p, i) => (
                  <tr key={i}>
                    <td className="p-2">{p.name || 'Unknown Product'}</td>
                    <td className="p-2">{p.quantityToOrder || 0}</td>
                  </tr>
                )) || <tr><td colSpan={2}>No products found</td></tr>}
              </tbody>
            </table>
            <div className="mt-4 flex gap-4">
              {selectedPO?.status === 'pending' && (
                <>
                  <button onClick={() => handleUpdateStatus('sent')} className="bg-blue-500 text-white px-4 py-2 rounded">Send to Supplier</button>
                  <button onClick={() => handleUpdateStatus('cancelled')} className="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
                </>
              )}
              {selectedPO?.status === 'sent' && (
                <>
                  <button onClick={() => handleUpdateStatus('received')} className="bg-green-500 text-white px-4 py-2 rounded">Mark as Received</button>
                  <button onClick={() => handleUpdateStatus('cancelled')} className="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
                </>
              )}
              <button onClick={() => setModalOpen(false)} className="bg-gray-200 px-4 py-2 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PurchaseOrders;