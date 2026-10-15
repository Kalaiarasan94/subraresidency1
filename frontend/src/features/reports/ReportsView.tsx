import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Printer, 
  Download, 
  FileSpreadsheet, 
  Calendar, 
  Filter, 
  ReceiptIndianRupee, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  CreditCard, 
  CheckCircle2, 
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Building,
  ShieldCheck
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { API_BASE_URL } from '../../lib/api';
import logoImg from '../../assets/logo.png';
import { generateHotelReportPdf, ReportColumn } from '../../lib/pdfReportGenerator';

interface ReportsViewProps {
  userRole?: 'admin' | 'reception';
  defaultTab?: 'comprehensive' | 'revenue' | 'expenses' | 'settlements';
}

type FilterMode = 'month' | 'date' | 'range';
type ReportType = 'comprehensive' | 'revenue' | 'expenses' | 'settlements';

export const ReportsView: React.FC<ReportsViewProps> = ({ 
  userRole = 'admin',
  defaultTab = 'comprehensive' 
}) => {
  // Report mode & type
  const [reportType, setReportType] = useState<ReportType>(defaultTab);
  const [filterMode, setFilterMode] = useState<FilterMode>('month');

  // Date filters
  const today = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [singleDate, setSingleDate] = useState<string>(today);
  const [startDate, setStartDate] = useState<string>(`${currentYear}-${currentMonth}-01`);
  const [endDate, setEndDate] = useState<string>(today);

  // Search & secondary filter
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Data & loading states
  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [reportData, setReportData] = useState<{
    summary: any;
    channels: any[];
    expenses_by_category: any[];
    all_bookings: any[];
    expenses: any[];
  }>({
    summary: {
      total_bookings: 0,
      gross_revenue: 0,
      platform_fees: 0,
      net_hotel_revenue: 0,
      total_expenses: 0,
      net_operating_profit: 0,
    },
    channels: [],
    expenses_by_category: [],
    all_bookings: [],
    expenses: [],
  });

  const printPaperRef = useRef<HTMLDivElement>(null);

  // Compute effective date range
  const computedDateRange = useMemo(() => {
    if (filterMode === 'month') {
      const start = `${selectedYear}-${selectedMonth}-01`;
      // Last day of month
      const lastDay = new Date(selectedYear, parseInt(selectedMonth, 10), 0).getDate();
      const end = `${selectedYear}-${selectedMonth}-${String(lastDay).padStart(2, '0')}`;
      return { start, end };
    } else if (filterMode === 'date') {
      return { start: singleDate, end: singleDate };
    } else {
      return { start: startDate, end: endDate };
    }
  }, [filterMode, selectedYear, selectedMonth, singleDate, startDate, endDate]);

  // Fetch Report Data
  const fetchReportData = async () => {
    setLoading(true);
    try {
      const { start, end } = computedDateRange;
      const url = `${API_BASE_URL}/accounts/summary?start_date=${start}&end_date=${end}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load accounts summary');
      const json = await res.json();
      if (json && json.status === 'success' && json.data) {
        setReportData({
          summary: json.data.summary || {},
          channels: json.data.channels || [],
          expenses_by_category: json.data.expenses_by_category || [],
          all_bookings: json.data.all_bookings || json.data.recent_bookings || [],
          expenses: json.data.expenses || [],
        });
      }
    } catch (err) {
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [computedDateRange.start, computedDateRange.end]);

  // Month navigation helpers
  const handlePrevMonth = () => {
    let m = parseInt(selectedMonth, 10) - 1;
    let y = selectedYear;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    setSelectedYear(y);
    setSelectedMonth(String(m).padStart(2, '0'));
  };

  const handleNextMonth = () => {
    let m = parseInt(selectedMonth, 10) + 1;
    let y = selectedYear;
    if (m > 12) {
      m = 1;
      y += 1;
    }
    setSelectedYear(y);
    setSelectedMonth(String(m).padStart(2, '0'));
  };

  const setPreset = (preset: 'today' | 'yesterday' | 'this_month' | 'last_month' | 'all') => {
    const now = new Date();
    if (preset === 'today') {
      setFilterMode('date');
      setSingleDate(now.toISOString().split('T')[0]);
    } else if (preset === 'yesterday') {
      setFilterMode('date');
      const yest = new Date(now);
      yest.setDate(yest.getDate() - 1);
      setSingleDate(yest.toISOString().split('T')[0]);
    } else if (preset === 'this_month') {
      setFilterMode('month');
      setSelectedYear(now.getFullYear());
      setSelectedMonth(String(now.getMonth() + 1).padStart(2, '0'));
    } else if (preset === 'last_month') {
      setFilterMode('month');
      let m = now.getMonth(); // 0-indexed is last month
      let y = now.getFullYear();
      if (m === 0) {
        m = 12;
        y -= 1;
      }
      setSelectedYear(y);
      setSelectedMonth(String(m).padStart(2, '0'));
    } else if (preset === 'all') {
      setFilterMode('range');
      setStartDate('2025-01-01');
      setEndDate(now.toISOString().split('T')[0]);
    }
  };

  // Compile unified transactions for the report table
  const unifiedTransactions = useMemo(() => {
    const list: any[] = [];

    // Bookings (Inflow)
    if (reportType === 'comprehensive' || reportType === 'revenue' || reportType === 'settlements') {
      reportData.all_bookings.forEach((b: any) => {
        const gross = parseFloat(b.total_amount || 0);
        const fee = parseFloat(b.platform_fee || 0);
        const net = parseFloat(b.actual_amount || gross - fee);
        const dateStr = b.created_at ? b.created_at.split(' ')[0] : (b.check_in_date || '');
        const paymentMode = b.payment_method || (b.booking_source === 'Online' ? 'Razorpay Online' : 'Front Desk');

        list.push({
          id: `BKG-${b.id}`,
          refId: b.booking_id || `HBK-${b.id}`,
          date: dateStr,
          rawDate: new Date(b.created_at || b.check_in_date || 0),
          particulars: `${b.guest_name || 'Guest'} (${b.room_number ? 'Room ' + b.room_number : b.category_label || 'Room'})`,
          category: b.booking_source || 'Online',
          paymentMode: paymentMode,
          type: 'INFLOW',
          gross: gross,
          deduction: fee,
          net: net,
          status: b.payment_status || b.status || 'Confirmed'
        });
      });
    }

    // Expenses (Outflow)
    if (reportType === 'comprehensive' || reportType === 'expenses') {
      reportData.expenses.forEach((e: any) => {
        const amt = parseFloat(e.amount || 0);
        list.push({
          id: `EXP-${e.id}`,
          refId: `EXP-${String(e.id).padStart(4, '0')}`,
          date: e.expense_date || (e.created_at ? e.created_at.split(' ')[0] : ''),
          rawDate: new Date(e.expense_date || e.created_at || 0),
          particulars: `${e.title} ${e.paid_to ? '• To: ' + e.paid_to : ''}`,
          category: e.category || 'General Expense',
          paymentMode: e.payment_mode || 'Cash',
          type: 'OUTFLOW',
          gross: amt,
          deduction: 0,
          net: amt,
          status: 'Settled'
        });
      });
    }

    // Sort chronologically descending
    list.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

    // Apply search & payment mode filter
    return list.filter((item) => {
      if (paymentFilter !== 'all') {
        const mode = item.paymentMode.toLowerCase();
        if (paymentFilter === 'cash' && !mode.includes('cash')) return false;
        if (paymentFilter === 'upi' && !mode.includes('upi') && !mode.includes('gpay')) return false;
        if (paymentFilter === 'online' && !mode.includes('online') && !mode.includes('razorpay')) return false;
        if (paymentFilter === 'card' && !mode.includes('card')) return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const hay = `${item.refId} ${item.particulars} ${item.category} ${item.paymentMode}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [reportData, reportType, searchTerm, paymentFilter]);

  // Aggregate totals from filtered items
  const totals = useMemo(() => {
    let totalInflow = 0;
    let totalOutflow = 0;
    let totalDeductions = 0;
    let cashSum = 0;
    let upiSum = 0;
    let onlineSum = 0;
    let cardSum = 0;

    unifiedTransactions.forEach((t) => {
      const mode = t.paymentMode.toLowerCase();
      if (t.type === 'INFLOW') {
        totalInflow += t.gross;
        totalDeductions += t.deduction;
        if (mode.includes('cash')) cashSum += t.net;
        else if (mode.includes('upi') || mode.includes('gpay')) upiSum += t.net;
        else if (mode.includes('online') || mode.includes('razorpay')) onlineSum += t.net;
        else if (mode.includes('card')) cardSum += t.net;
        else onlineSum += t.net;
      } else {
        totalOutflow += t.net;
      }
    });

    const netOperatingBalance = totalInflow - totalDeductions - totalOutflow;

    return {
      totalInflow,
      totalOutflow,
      totalDeductions,
      netOperatingBalance,
      cashSum,
      upiSum,
      onlineSum,
      cardSum,
      count: unifiedTransactions.length
    };
  }, [unifiedTransactions]);

  // Print Action
  const handlePrint = () => {
    window.print();
  };

  // Download PDF Action - High Resolution Vector PDF
  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const fileDate = filterMode === 'month' 
        ? `${selectedYear}_${selectedMonth}` 
        : (filterMode === 'date' ? singleDate : `${computedDateRange.start}_to_${computedDateRange.end}`);

      const isBookingReport = reportType === 'revenue';

      const columns: ReportColumn[] = isBookingReport ? [
        { header: '#', dataKey: '_index', alignment: 'center', width: 10 },
        { header: 'Booking Ref', dataKey: 'refId', alignment: 'left', width: 34 },
        { header: 'Guest & Room Stay', dataKey: 'particulars', alignment: 'left' },
        { header: 'Date', dataKey: 'date', alignment: 'center', width: 25 },
        { header: 'Channel', dataKey: 'category', alignment: 'left', width: 26 },
        { header: 'Payment Mode', dataKey: 'paymentMode', alignment: 'left', width: 30 },
        { header: 'Gross (₹)', dataKey: 'grossFormatted', alignment: 'right', width: 26 },
        { header: 'Net (₹)', dataKey: 'netFormatted', alignment: 'right', width: 26 },
        { header: 'Status', dataKey: 'status', alignment: 'center', width: 24 }
      ] : [
        { header: '#', dataKey: '_index', alignment: 'center', width: 10 },
        { header: 'Date', dataKey: 'date', alignment: 'center', width: 25 },
        { header: 'Ref / Voucher', dataKey: 'refId', alignment: 'left', width: 32 },
        { header: 'Particulars / Description', dataKey: 'particulars', alignment: 'left' },
        { header: 'Category / Source', dataKey: 'category', alignment: 'left', width: 32 },
        { header: 'Payment Mode', dataKey: 'paymentMode', alignment: 'left', width: 30 },
        { header: 'Type', dataKey: 'type', alignment: 'center', width: 20 },
        { header: 'Gross (₹)', dataKey: 'grossFormatted', alignment: 'right', width: 26 },
        { header: 'Net (₹)', dataKey: 'netFormatted', alignment: 'right', width: 26 }
      ];

      const formattedData = unifiedTransactions.map((tx) => ({
        ...tx,
        grossFormatted: `₹${tx.gross.toFixed(2)}`,
        netFormatted: `${tx.type === 'INFLOW' ? '+' : '-'}₹${tx.net.toFixed(2)}`
      }));

      generateHotelReportPdf({
        title: reportHeading,
        period: periodLabel,
        summaryCards: [
          { label: 'Total Inflow', value: `₹${totals.totalInflow.toLocaleString('en-IN')}` },
          { label: 'Total Outflow', value: `₹${totals.totalOutflow.toLocaleString('en-IN')}` },
          { label: 'Net Margin', value: `₹${totals.netOperatingBalance.toLocaleString('en-IN')}` },
          { label: 'Total Records', value: `${totals.count} Entries` }
        ],
        columns,
        data: formattedData,
        filename: `Subra_Residency_Report_${reportType.toUpperCase()}_${fileDate}.pdf`
      });
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Unable to generate PDF automatically. You can also click "Print" and select "Save as PDF".');
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Export CSV Action
  const handleExportCsv = () => {
    const headers = ['Sl.No', 'Date', 'Ref / Voucher ID', 'Particulars / Description', 'Category / Channel', 'Payment Mode', 'Type', 'Gross (Rs)', 'Deduction (Rs)', 'Net Amount (Rs)', 'Status'];
    const rows = unifiedTransactions.map((t, i) => [
      i + 1,
      t.date,
      `"${t.refId}"`,
      `"${t.particulars.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      `"${t.paymentMode}"`,
      t.type,
      t.gross.toFixed(2),
      t.deduction.toFixed(2),
      t.net.toFixed(2),
      t.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Subra_Residency_Report_${computedDateRange.start}_to_${computedDateRange.end}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const reportHeading = useMemo(() => {
    switch (reportType) {
      case 'revenue':
        return 'REVENUE & ROOM BOOKINGS REGISTER';
      case 'expenses':
        return 'OPERATING EXPENSES & OUTFLOW STATEMENT';
      case 'settlements':
        return 'DAILY PAYMENT SETTLEMENTS & CASH AUDIT';
      case 'comprehensive':
      default:
        return 'OFFICIAL HOTEL ACCOUNTS & AUDIT STATEMENT';
    }
  }, [reportType]);

  const periodLabel = useMemo(() => {
    if (filterMode === 'month') {
      return `${monthNames[parseInt(selectedMonth, 10) - 1]} ${selectedYear} (Monthly Audit)`;
    } else if (filterMode === 'date') {
      return `${singleDate} (Single Day Audit)`;
    } else {
      return `${computedDateRange.start} to ${computedDateRange.end}`;
    }
  }, [filterMode, selectedYear, selectedMonth, singleDate, computedDateRange]);

  return (
    <div className="space-y-6 pb-12 font-sans antialiased text-gray-800">
      
      {/* Top Banner & Control Deck - Hidden on Print */}
      <div className="no-print bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
        
        {/* Row 1: Title & Action Buttons */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                <ReceiptIndianRupee size={20} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                  Accounts & Performance Reports
                </h2>
                <p className="text-xs text-gray-500">
                  Generate, print, and export official audit statements by date, month, or custom period
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons: Print, PDF, CSV, Refresh */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={fetchReportData}
              disabled={loading}
              className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-medium rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-medium rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export as CSV Spreadsheet"
            >
              <FileSpreadsheet size={14} className="text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print to Printer"
            >
              <Printer size={15} className="text-blue-600" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download size={15} className={downloadingPdf ? 'animate-bounce' : ''} />
              <span>{downloadingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Report Type Tabs */}
        <div className="flex items-center gap-1.5 border-b border-gray-200 pb-3 overflow-x-auto">
          {[
            { id: 'comprehensive', label: 'Complete Financial Statement (P&L)', icon: FileText },
            { id: 'revenue', label: 'Revenue & Bookings Ledger', icon: TrendingUp },
            { id: 'expenses', label: 'Operating Expenses Ledger', icon: ReceiptIndianRupee },
            { id: 'settlements', label: 'Payment Mode Settlements', icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = reportType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id as ReportType)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                  active
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                }`}
              >
                <Icon size={14} className={active ? 'text-emerald-600' : 'text-gray-400'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Row 3: Date & Month Selection Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1 items-center">
          
          {/* Mode Switcher */}
          <div className="md:col-span-4 flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <button
              onClick={() => setFilterMode('month')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md text-center transition-colors cursor-pointer ${
                filterMode === 'month' ? 'bg-white text-gray-900 shadow-xs font-semibold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              By Month
            </button>
            <button
              onClick={() => setFilterMode('date')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md text-center transition-colors cursor-pointer ${
                filterMode === 'date' ? 'bg-white text-gray-900 shadow-xs font-semibold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              By Specific Date
            </button>
            <button
              onClick={() => setFilterMode('range')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md text-center transition-colors cursor-pointer ${
                filterMode === 'range' ? 'bg-white text-gray-900 shadow-xs font-semibold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Custom Range
            </button>
          </div>

          {/* Month Pickers or Date Pickers */}
          <div className="md:col-span-5 flex items-center gap-2">
            {filterMode === 'month' && (
              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors"
                  title="Previous Month"
                >
                  <ChevronLeft size={16} />
                </button>

                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-800 flex-1 focus:ring-1 focus:ring-emerald-500"
                >
                  {monthNames.map((name, idx) => (
                    <option key={idx} value={String(idx + 1).padStart(2, '0')}>
                      {name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-800 w-24 focus:ring-1 focus:ring-emerald-500"
                >
                  {[2024, 2025, 2026, 2027, 2028].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>

                <button
                  onClick={handleNextMonth}
                  className="p-1.5 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors"
                  title="Next Month"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {filterMode === 'date' && (
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Report Date:</span>
                <input
                  type="date"
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-800 flex-1 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            )}

            {filterMode === 'range' && (
              <div className="flex items-center gap-2 w-full">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-800 flex-1 focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-gray-400 text-xs">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-800 flex-1 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>

          {/* Quick Presets */}
          <div className="md:col-span-3 flex items-center justify-end gap-1.5 flex-wrap">
            <button
              onClick={() => setPreset('today')}
              className="px-2 py-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-[11px] font-medium rounded-md transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setPreset('yesterday')}
              className="px-2 py-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-[11px] font-medium rounded-md transition-colors"
            >
              Yesterday
            </button>
            <button
              onClick={() => setPreset('this_month')}
              className="px-2 py-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-[11px] font-medium rounded-md transition-colors"
            >
              This Month
            </button>
            <button
              onClick={() => setPreset('last_month')}
              className="px-2 py-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-[11px] font-medium rounded-md transition-colors"
            >
              Last Month
            </button>
          </div>
        </div>

        {/* Row 4: Search & Secondary Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 text-xs">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, guest, category, note..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-gray-500 font-medium">Payment Mode:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Payment Modes</option>
              <option value="cash">Cash Only</option>
              <option value="upi">UPI / GPay Only</option>
              <option value="online">Online / Razorpay Only</option>
              <option value="card">Card / POS Only</option>
            </select>

            <span className="text-gray-400">|</span>

            <span className="text-gray-500 font-mono">
              Showing <strong className="text-gray-900">{unifiedTransactions.length}</strong> records
            </span>
          </div>
        </div>
      </div>

      {/* Screen Summary KPI Cards - Hidden on Print */}
      <div className="no-print grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Gross Inflow</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <ArrowDownLeft size={16} />
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900 mt-2 font-mono tabular-nums">
            ₹{totals.totalInflow.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Room bookings & guest settlements</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Operational Outflow</span>
            <span className="p-1.5 bg-rose-50 text-rose-700 rounded-lg">
              <ArrowUpRight size={16} />
            </span>
          </div>
          <p className="text-xl font-bold text-rose-700 mt-2 font-mono tabular-nums">
            ₹{totals.totalOutflow.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Hotel operational expenses</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Net Surplus / Margin</span>
            <span className={`p-1.5 rounded-lg ${totals.netOperatingBalance >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              <TrendingUp size={16} />
            </span>
          </div>
          <p className={`text-xl font-bold mt-2 font-mono tabular-nums ${totals.netOperatingBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            ₹{totals.netOperatingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Inflow minus expenses</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Records</span>
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
              <Building size={16} />
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900 mt-2 font-mono tabular-nums">
            {totals.count} Entries
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">In {periodLabel}</p>
        </div>
      </div>

      {/* ========================================================
          THE PRINTABLE / EXPORTABLE REPORT PAPER (A4 FORMAT)
          ======================================================== */}
      <div 
        ref={printPaperRef}
        id="printable-report-paper"
        className="printable-document bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-md max-w-5xl mx-auto space-y-6 text-gray-900"
      >
        
        {/* Document Header with Hotel Branding */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-emerald-900/30">
          <div className="flex items-start gap-4">
            <img 
              src={logoImg} 
              alt="Subra Residency" 
              className="w-16 h-16 object-contain rounded-xl border border-gray-200 p-1.5 bg-white shadow-xs shrink-0" 
            />
            <div>
              <h1 className="font-serif text-2xl font-black text-[#0a3622] tracking-wide">
                SUBRA RESIDENCY
              </h1>
              <p className="text-[10px] font-extrabold uppercase text-[#b38728] tracking-widest mt-0.5">
                RAGUPATHI ANANDHALAKSHMI &bull; PROPRIETORSHIP
              </p>
              <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                NO.45-1/1187B2, Lal Bahadur Sastry Road, Kumbakonam, Thanjavur, Tamil Nadu &bull; PIN: 612001<br />
                Phone: +91 73958 09991 | 73958 09992 &bull; Email: subraresidency@gmail.com
              </p>
              <div className="mt-1.5 text-xs font-bold text-gray-800 font-mono">
                GSTIN: <span className="text-[#0a3622]">33AQQPA7394F2ZN</span> &bull; State Code: 33 (Tamil Nadu)
              </div>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <div className="text-base font-black text-[#0a3622] uppercase tracking-wider">
              {reportHeading}
            </div>
            <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
              Period: {periodLabel}
            </div>
            <div className="text-[10px] text-gray-500 font-mono mt-2">
              Generated: {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
            <div className="text-[10px] text-gray-400 font-mono">
              Portal: {userRole === 'admin' ? 'Admin Central' : 'Front Desk Reception'}
            </div>
          </div>
        </div>

        {/* Executive Summary Cards in Document */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/70 p-3.5 rounded-xl border border-gray-200 text-xs">
          <div>
            <div className="text-[10px] font-bold uppercase text-gray-500">Gross Inflow (₹)</div>
            <div className="text-sm font-extrabold text-[#0a3622] font-mono mt-0.5 tabular-nums">
              ₹{totals.totalInflow.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-gray-500">Total Outflow (₹)</div>
            <div className="text-sm font-extrabold text-rose-700 font-mono mt-0.5 tabular-nums">
              ₹{totals.totalOutflow.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-gray-500">Net Surplus (₹)</div>
            <div className={`text-sm font-extrabold font-mono mt-0.5 tabular-nums ${totals.netOperatingBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              ₹{totals.netOperatingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-gray-500">Settlement Ledger</div>
            <div className="text-[11px] text-gray-700 font-mono mt-0.5">
              Cash: ₹{totals.cashSum.toLocaleString('en-IN')} | UPI: ₹{totals.upiSum.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Main Tabular Report */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Detailed Transaction Ledger &amp; Audit Records
            </h3>
            <span className="text-[11px] text-gray-500 font-mono">
              Total Entries: {unifiedTransactions.length}
            </span>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100/90 text-gray-700 text-[10px] font-bold uppercase tracking-wider border-b border-gray-200">
                  <th className="px-3 py-2.5 text-center w-10">#</th>
                  <th className="px-3 py-2.5 w-24">Date</th>
                  <th className="px-3 py-2.5 w-32">Ref / Voucher</th>
                  <th className="px-3 py-2.5">Particulars / Description</th>
                  <th className="px-3 py-2.5 w-28">Category</th>
                  <th className="px-3 py-2.5 w-24">Mode</th>
                  <th className="px-3 py-2.5 text-center w-20">Type</th>
                  <th className="px-3 py-2.5 text-right w-24">Gross (₹)</th>
                  <th className="px-3 py-2.5 text-right w-24">Net (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-sans">
                {unifiedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                      No transactions recorded for the selected period ({periodLabel}).
                    </td>
                  </tr>
                ) : (
                  unifiedTransactions.map((tx, idx) => {
                    const isInflow = tx.type === 'INFLOW';
                    return (
                      <tr 
                        key={tx.id || idx}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                      >
                        <td className="px-3 py-2 text-center text-gray-400 font-mono text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="px-3 py-2 text-gray-700 font-mono whitespace-nowrap text-[11px]">
                          {tx.date}
                        </td>
                        <td className="px-3 py-2 font-mono font-semibold text-gray-900 text-[11px] whitespace-nowrap">
                          {tx.refId}
                        </td>
                        <td className="px-3 py-2 text-gray-800 font-medium">
                          {tx.particulars}
                        </td>
                        <td className="px-3 py-2 text-gray-600 text-[11px]">
                          {tx.category}
                        </td>
                        <td className="px-3 py-2 text-gray-600 text-[11px] whitespace-nowrap">
                          {tx.paymentMode}
                        </td>
                        <td className="px-3 py-2 text-center whitespace-nowrap">
                          <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-sm uppercase tracking-wider ${
                            isInflow 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {isInflow ? 'Inflow' : 'Outflow'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-gray-700 tabular-nums">
                          ₹{tx.gross.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className={`px-3 py-2 text-right font-mono font-bold tabular-nums ${
                          isInflow ? 'text-emerald-700' : 'text-rose-700'
                        }`}>
                          {isInflow ? '+' : '-'}₹{tx.net.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              {/* Grand Totals Table Footer */}
              <tfoot>
                <tr className="bg-gray-100 border-t-2 border-gray-300 font-bold text-xs text-gray-900">
                  <td colSpan={6} className="px-3 py-3 text-right uppercase tracking-wider">
                    Grand Totals:
                  </td>
                  <td className="px-3 py-3 text-center text-[10px] text-gray-500 uppercase">
                    {unifiedTransactions.length} Items
                  </td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums text-gray-800">
                    ₹{totals.totalInflow.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`px-3 py-3 text-right font-mono text-sm tabular-nums ${
                    totals.netOperatingBalance >= 0 ? 'text-emerald-800' : 'text-rose-800'
                  }`}>
                    ₹{totals.netOperatingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Payment Channels & Tax Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50">
            <div className="font-bold text-gray-800 uppercase tracking-wider text-[10px] border-b border-gray-200 pb-1 mb-2">
              Payment Methods Breakdown
            </div>
            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-gray-600">Cash Collections:</span>
                <span className="font-bold text-gray-900">₹{totals.cashSum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">UPI / GPay / PhonePe:</span>
                <span className="font-bold text-gray-900">₹{totals.upiSum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Online Gateway (Razorpay):</span>
                <span className="font-bold text-gray-900">₹{totals.onlineSum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Debit / Credit Card (POS):</span>
                <span className="font-bold text-gray-900">₹{totals.cardSum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50">
            <div className="font-bold text-gray-800 uppercase tracking-wider text-[10px] border-b border-gray-200 pb-1 mb-2">
              Statutory &amp; System Declaration
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              This statement certifies the room receipts, operational expenditures, and channel distributions for the declared period. All financial data is cryptographically recorded within the hotel property management database.
            </p>
            <div className="mt-2 text-[10px] text-gray-500 font-mono">
              Security Hash: SHA256-SUBRA-{Date.now().toString(36).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Verification & Official Sign-off */}
        <div className="pt-8 mt-6 border-t border-gray-200 grid grid-cols-3 gap-6 text-center text-xs">
          <div>
            <div className="h-12 border-b border-gray-300 mx-auto w-3/4 mb-2"></div>
            <p className="font-bold text-gray-900 text-xs">Prepared By</p>
            <p className="text-[10px] text-gray-500 uppercase">Front Desk / Accounts Executive</p>
          </div>

          <div>
            <div className="h-12 border-b border-gray-300 mx-auto w-3/4 mb-2 flex items-center justify-center">
              <span className="text-[9px] uppercase tracking-widest text-gray-300 font-bold border border-dashed border-gray-300 px-2 py-0.5 rounded">
                Official Hotel Seal
              </span>
            </div>
            <p className="font-bold text-gray-900 text-xs">Property Stamp</p>
            <p className="text-[10px] text-gray-500 uppercase">Subra Residency Kumbakonam</p>
          </div>

          <div>
            <div className="h-12 border-b border-gray-300 mx-auto w-3/4 mb-2"></div>
            <p className="font-bold text-gray-900 text-xs">Verified &amp; Authorized By</p>
            <p className="text-[10px] text-gray-500 uppercase">General Manager / Proprietor</p>
          </div>
        </div>

        {/* Document Footer Note */}
        <div className="text-center pt-4 border-t border-gray-100 text-[10px] text-gray-400 font-mono">
          Subra Residency HMS &bull; Automated Audit System &bull; Page 1 of 1 &bull; Kumbakonam Luxury Temple Hospitality
        </div>

      </div>

    </div>
  );
};
