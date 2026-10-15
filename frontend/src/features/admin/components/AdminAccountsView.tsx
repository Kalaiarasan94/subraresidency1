import React, { useState, useEffect, useMemo } from 'react';
import { 
  IndianRupee, TrendingUp, TrendingDown, CreditCard, Building2, 
  Calendar, Plus, Trash2, Search, Filter, Download, Printer, 
  CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight, 
  Layers, ShoppingBag, ReceiptIndianRupee, PieChart, FileText, ChevronRight,
  ExternalLink, Sparkles, RefreshCw, Loader2, X, Eye, Save
} from 'lucide-react';
import { API_BASE_URL } from '../../../lib/api';
import logoImg from '../../../assets/logo.png';
import { TaxInvoiceModal } from '../../../components/common/TaxInvoiceModal';
import { ReportsView } from '../../reports/ReportsView';

export const AdminAccountsView: React.FC = () => {
  // Navigation & Sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'expenses' | 'report'>('overview');

  // Date Range State
  const [datePreset, setDatePreset] = useState<string>('this_month');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Data State
  const [loading, setLoading] = useState<boolean>(true);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [expensesList, setExpensesList] = useState<any[]>([]);
  const [expenseSearch, setExpenseSearch] = useState<string>('');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState<string>('All');

  // Modal State
  const [showAddExpenseModal, setShowAddExpenseModal] = useState<boolean>(false);
  const [savingExpense, setSavingExpense] = useState<boolean>(false);
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Housekeeping & Laundry',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    payment_mode: 'UPI',
    paid_to: '',
    notes: ''
  });

  // Invoice Modal State
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<string | null>(null);

  // Category choices
  const expenseCategories = [
    'Housekeeping & Laundry',
    'Utilities (Electricity/Water)',
    'Room Supplies & Amenities',
    'Maintenance & Repairs',
    'Staff Wages & Salaries',
    'Food & Beverage',
    'Platform & OTA Commissions',
    'Taxes & Licenses',
    'Miscellaneous'
  ];

  // Initialize date range based on preset
  useEffect(() => {
    const now = new Date();
    let s = '';
    let e = '';

    if (datePreset === 'today') {
      s = e = now.toISOString().split('T')[0];
    } else if (datePreset === 'this_week') {
      const day = now.getDay();
      const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(now.setDate(diffToMonday));
      s = monday.toISOString().split('T')[0];
      e = new Date().toISOString().split('T')[0];
    } else if (datePreset === 'this_month') {
      s = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      e = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    } else if (datePreset === 'last_month') {
      s = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
      e = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
    } else if (datePreset === 'financial_year') {
      // Indian FY starts April 1
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth(); // 0-indexed
      const fyStartYear = currentMonth >= 3 ? currentYear : currentYear - 1;
      s = `${fyStartYear}-04-01`;
      e = `${fyStartYear + 1}-03-31`;
    } else if (datePreset === 'all_time') {
      s = '';
      e = '';
    }

    setStartDate(s);
    setEndDate(e);
  }, [datePreset]);

  // Fetch Accounts Summary & Expenses
  const fetchData = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (startDate) q.append('start_date', startDate);
      if (endDate) q.append('end_date', endDate);

      const [summaryRes, expensesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/accounts/summary?${q.toString()}`),
        fetch(`${API_BASE_URL}/expenses/list?${q.toString()}`)
      ]);

      if (summaryRes.ok) {
        const text = await summaryRes.text();
        if (text && text.trim().startsWith('{')) {
          const sumJson = JSON.parse(text);
          if (sumJson.status === 'success') {
            setSummaryData(sumJson.data);
          }
        }
      }
      if (expensesRes.ok) {
        const text = await expensesRes.text();
        if (text && text.trim().startsWith('{')) {
          const expJson = JSON.parse(text);
          if (expJson.status === 'success') {
            setExpensesList(expJson.data || []);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load accounts data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  // Handle Create Expense
  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.title.trim() || !expenseForm.amount) {
      alert('Please provide title and amount.');
      return;
    }

    setSavingExpense(true);
    try {
      const res = await fetch(`${API_BASE_URL}/expenses/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseForm)
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setShowAddExpenseModal(false);
        setExpenseForm({
          title: '',
          category: 'Housekeeping & Laundry',
          amount: '',
          expense_date: new Date().toISOString().split('T')[0],
          payment_mode: 'UPI',
          paid_to: '',
          notes: ''
        });
        fetchData();
      } else {
        alert(data.message || 'Failed to record expense.');
      }
    } catch (err) {
      alert('Error communicating with server.');
    } finally {
      setSavingExpense(false);
    }
  };

  // Handle Delete Expense
  const handleDeleteExpense = async (id: number) => {
    if (!confirm('Are you sure you want to delete this expense record?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/expenses/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.status === 'success') {
        fetchData();
      } else {
        alert(data.message || 'Failed to delete expense.');
      }
    } catch (e) {
      alert('Connection error deleting expense.');
    }
  };

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expensesList.filter(item => {
      const matchCat = expenseCategoryFilter === 'All' || item.category === expenseCategoryFilter;
      const q = expenseSearch.toLowerCase();
      const matchSearch = !q || 
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.paid_to && item.paid_to.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [expensesList, expenseCategoryFilter, expenseSearch]);

  const summary = summaryData?.summary || {
    total_bookings: 0,
    gross_revenue: 0,
    platform_fees: 0,
    net_hotel_revenue: 0,
    total_expenses: 0,
    net_operating_profit: 0
  };

  const channels = summaryData?.channels || [];
  const expensesByCategory = summaryData?.expenses_by_category || [];
  const recentBookings = summaryData?.recent_bookings || [];

  const inr = (val: number) => '₹' + Number(val || 0).toLocaleString('en-IN');
  const inrDec = (val: number) => '₹' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6 antialiased">
      {/* Top Banner / Controls */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center shadow-xs">
              <IndianRupee size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-gray-900">
                  Accounts & Financial Management
                </h1>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Audit Ready
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time turnover, OTA commission reconciliation, hotel actuals, and expense tracking
              </p>
            </div>
          </div>
        </div>

        {/* Date Filter & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset selector */}
          <select
            value={datePreset}
            onChange={(e) => setDatePreset(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-xs"
          >
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="this_week">This Week</option>
            <option value="today">Today</option>
            <option value="financial_year">Financial Year (FY)</option>
            <option value="all_time">All Time</option>
          </select>

          {/* Quick Dates */}
          <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
            <Calendar size={13} className="text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setDatePreset('custom');
              }}
              className="bg-transparent text-gray-700 text-xs focus:outline-none"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setDatePreset('custom');
              }}
              className="bg-transparent text-gray-700 text-xs focus:outline-none"
            />
          </div>

          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs font-medium rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus size={14} className="text-gray-600" />
            <span>Record Expense</span>
          </button>

          <button
            onClick={() => setActiveSubTab('report')}
            className="px-3.5 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-xs font-medium rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer size={14} className="text-gray-600" />
            <span>Audit Statement</span>
          </button>
        </div>
      </div>

      {/* 5 Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Gross Total Invoiced */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-500 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Gross Turnover</span>
              <span className="p-1.5 rounded-md bg-gray-100 text-gray-600">
                <CreditCard size={14} />
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900 tracking-tight font-mono">
              {inr(summary.gross_revenue)}
            </div>
          </div>
          <div className="text-[11px] text-gray-500 mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
            <span>Invoiced Total</span>
            <span className="font-medium text-gray-700 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">{summary.total_bookings} Folios</span>
          </div>
        </div>

        {/* OTA Platform Deductions */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-500 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">OTA Platform Fees</span>
              <span className="p-1.5 rounded-md bg-gray-100 text-gray-600">
                <ArrowDownRight size={14} />
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900 tracking-tight font-mono">
              {inr(summary.platform_fees)}
            </div>
          </div>
          <div className="text-[11px] text-gray-500 mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
            <span>Commissions</span>
            <span className="font-semibold text-gray-700 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
              {summary.gross_revenue > 0 ? `${((summary.platform_fees / summary.gross_revenue) * 100).toFixed(1)}%` : '0%'}
            </span>
          </div>
        </div>

        {/* Net Hotel Accounts */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-500 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Hotel Net Revenue</span>
              <span className="p-1.5 rounded-md bg-gray-100 text-gray-600">
                <Building2 size={14} />
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900 tracking-tight font-mono">
              {inr(summary.net_hotel_revenue)}
            </div>
          </div>
          <div className="text-[11px] text-gray-500 mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
            <span>Realized Income</span>
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Net Settled</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-500 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Operating Expenses</span>
              <span className="p-1.5 rounded-md bg-gray-100 text-gray-600">
                <ShoppingBag size={14} />
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900 tracking-tight font-mono">
              {inr(summary.total_expenses)}
            </div>
          </div>
          <div className="text-[11px] text-gray-500 mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
            <span>Operational Outflow</span>
            <span className="font-medium text-gray-700 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">{expensesList.length} Entries</span>
          </div>
        </div>

        {/* Net Operating Profit */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-500 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Net Operating P&L</span>
              <span className="p-1.5 rounded-md bg-gray-100 text-gray-600">
                {summary.net_operating_profit >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              </span>
            </div>
            <div className={`text-xl font-bold tracking-tight font-mono ${
              summary.net_operating_profit >= 0 ? 'text-gray-900' : 'text-rose-700'
            }`}>
              {inr(summary.net_operating_profit)}
            </div>
          </div>
          <div className="text-[11px] text-gray-500 mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
            <span>Margin</span>
            <span className={`font-semibold px-1.5 py-0.5 rounded border ${
              summary.net_operating_profit >= 0 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {summary.net_hotel_revenue > 0 ? `${((summary.net_operating_profit / summary.net_hotel_revenue) * 100).toFixed(1)}%` : '0%'}
            </span>
          </div>
        </div>

      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap gap-1 p-1 bg-gray-100 rounded-lg border border-gray-200 text-xs w-fit">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-white text-gray-900 shadow-xs font-semibold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Layers size={14} />
          <span>Accounts & Channels</span>
        </button>

        <button
          onClick={() => setActiveSubTab('expenses')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'expenses'
              ? 'bg-white text-gray-900 shadow-xs font-semibold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ReceiptIndianRupee size={14} />
          <span>Expenses Manager ({expensesList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('report')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'report'
              ? 'bg-white text-gray-900 shadow-xs font-semibold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText size={14} />
          <span>Official Accounts PDF Report</span>
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="bg-white rounded-2xl p-16 flex flex-col items-center justify-center text-gray-400 gap-3 border border-gray-200">
          <Loader2 size={32} className="animate-spin text-blue-600" />
          <p className="text-sm font-medium">Reconciling accounts and records...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: ACCOUNTS & CHANNELS */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Channel Cards Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Building2 size={16} className="text-slate-700" />
                    Channel Revenue Reconciliation (Walk-ins vs Website vs OTAs)
                  </h2>
                  <span className="text-xs text-gray-500 font-medium">
                    Breakdown of gross billing vs actual net realized rate
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {channels.map((ch: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-2.5 h-2.5 rounded-full shrink-0" 
                              style={{ backgroundColor: ch.color || '#475569' }} 
                            />
                            <span className="font-bold text-xs text-gray-900">{ch.label || ch.source}</span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                            {ch.count} bookings ({ch.percentage}%)
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between text-gray-600">
                            <span>Invoiced (Gross):</span>
                            <span className="font-bold font-mono text-gray-900">{inr(ch.gross)}</span>
                          </div>
                          <div className="flex justify-between text-amber-700">
                            <span>Platform Fee / Commission:</span>
                            <span className="font-semibold font-mono">- {inr(ch.platform_fee)}</span>
                          </div>
                          <div className="flex justify-between text-emerald-800 pt-1.5 border-t border-gray-100 font-bold">
                            <span>Hotel Actual Net:</span>
                            <span className="text-sm font-mono">{inr(ch.net)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-4 pt-2 border-t border-gray-100">
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="h-1.5 rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${ch.percentage}%`, 
                              backgroundColor: ch.color || '#334155' 
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Bookings Accounts Table */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ReceiptIndianRupee size={16} className="text-gray-500" />
                    <h3 className="text-sm font-bold text-gray-900">Recent Invoiced Bookings & Folio Audit</h3>
                  </div>
                  <span className="text-xs text-gray-500">
                    Showing latest {recentBookings.length} records in selected period
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4">Booking Ref</th>
                        <th className="py-3 px-4">Guest Name</th>
                        <th className="py-3 px-4">Source / Platform</th>
                        <th className="py-3 px-4">Stay Dates</th>
                        <th className="py-3 px-4 text-right">Invoiced (Gross)</th>
                        <th className="py-3 px-4 text-right">Platform Fee</th>
                        <th className="py-3 px-4 text-right">Hotel Net Rate</th>
                        <th className="py-3 px-4 text-center">GST Tax Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {recentBookings.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-gray-400">
                            No reservations found for the selected date range.
                          </td>
                        </tr>
                      ) : (
                        recentBookings.map((b: any) => (
                          <tr key={b.id} className="hover:bg-gray-50/70 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-gray-900">
                              {b.booking_id}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-gray-900">{b.guest_name || 'Walk-in Guest'}</div>
                              <div className="text-[10px] text-gray-400">{b.guest_phone || '—'}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
                                {b.booking_source || 'Online'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {b.check_in_date} &bull; {b.check_out_date}
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-gray-900">
                              {inr(b.total_amount)}
                            </td>
                            <td className="py-3 px-4 text-right text-amber-700 font-semibold">
                              {parseFloat(b.platform_fee) > 0 ? `- ${inr(b.platform_fee)}` : '₹0.00'}
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-emerald-800">
                              {inr(b.actual_amount || (parseFloat(b.total_amount) - parseFloat(b.platform_fee)))}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => setSelectedBookingForInvoice(b.booking_id)}
                                className="px-2.5 py-1 text-[11px] font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300 shadow-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                                title="View Official GST Tax Invoice"
                              >
                                <Eye size={12} className="text-gray-500" />
                                <span>Invoice</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: EXPENSES MANAGER */}
          {activeSubTab === 'expenses' && (
            <div className="space-y-6">
              
              {/* Category Breakdown & Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                      <PieChart size={14} className="text-slate-700" />
                      Operating Expense Breakdown by Category
                    </h3>
                    <span className="text-xs font-extrabold text-rose-700 font-mono">
                      Total: {inr(summary.total_expenses)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {expensesByCategory.map((cat: any, i: number) => {
                      const pct = summary.total_expenses > 0 
                        ? ((cat.amount / summary.total_expenses) * 100).toFixed(1)
                        : 0;
                      return (
                        <div key={i} className="p-3 bg-gray-50/80 rounded-lg border border-gray-100 flex flex-col justify-between">
                          <div className="flex justify-between items-start text-xs">
                            <span className="font-semibold text-gray-800">{cat.category}</span>
                            <span className="font-bold text-gray-900">{inr(cat.amount)}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2">
                            <span>{cat.count} expense records</span>
                            <span className="font-bold text-rose-600">{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Add CTA */}
                <div className="bg-white rounded-xl p-5 border border-gray-200 flex flex-col justify-between shadow-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Expense Management
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-1">Record Outflow</h3>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      Maintain official operational records for laundry, diesel, electricity, amenities, and staff wages for audits.
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setShowAddExpenseModal(true)}
                      className="w-full py-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs font-medium rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus size={14} className="text-gray-600" />
                      <span>Add Expense Entry</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search title, vendor, notes..."
                      value={expenseSearch}
                      onChange={(e) => setExpenseSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <select
                    value={expenseCategoryFilter}
                    onChange={(e) => setExpenseCategoryFilter(e.target.value)}
                    className="text-xs font-semibold px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    {expenseCategories.map((c, idx) => (
                      <option key={idx} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="text-xs text-gray-500 font-medium">
                  Showing {filteredExpenses.length} of {expensesList.length} expenses
                </div>
              </div>

              {/* Expenses Table */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Expense Title / Item</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Vendor / Paid To</th>
                        <th className="py-3 px-4">Payment Mode</th>
                        <th className="py-3 px-4 text-right">Amount (₹)</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {filteredExpenses.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-gray-400">
                            No expenses recorded matching the current filter.
                          </td>
                        </tr>
                      ) : (
                        filteredExpenses.map((exp: any) => (
                          <tr key={exp.id} className="hover:bg-gray-50/70 transition-colors">
                            <td className="py-3 px-4 font-mono text-gray-600">
                              {exp.expense_date}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-gray-900">{exp.title}</div>
                              {exp.notes && (
                                <div className="text-[10px] text-gray-400 truncate max-w-xs">{exp.notes}</div>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                                {exp.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-medium text-gray-800">
                              {exp.paid_to || '—'}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700">
                                {exp.payment_mode || 'Cash'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-rose-700 text-sm">
                              {inrDec(exp.amount)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleDeleteExpense(exp.id)}
                                className="p-1.5 text-gray-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                                title="Delete Expense Record"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ACCOUNTS PDF REPORT / AUDIT STATEMENT */}
          {activeSubTab === 'report' && (
            <ReportsView userRole="admin" />
          )}
        </>
      )}

      {/* Record Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <ReceiptIndianRupee size={16} className="text-slate-800" />
                <h3 className="text-sm font-bold text-gray-900">Record Operational Expense</h3>
              </div>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Expense Title / Purpose <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Linen Dry Cleaning Batch 42"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    {expenseCategories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Amount (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="2500"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Expense Date
                  </label>
                  <input
                    type="date"
                    required
                    value={expenseForm.expense_date}
                    onChange={(e) => setExpenseForm({ ...expenseForm, expense_date: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={expenseForm.payment_mode}
                    onChange={(e) => setExpenseForm({ ...expenseForm, payment_mode: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                    <option value="Card">Credit / Debit Card</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Vendor / Paid To
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sri Murugan Laundry Services"
                  value={expenseForm.paid_to}
                  onChange={(e) => setExpenseForm({ ...expenseForm, paid_to: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Notes / Bill Reference No.
                </label>
                <textarea
                  rows={2}
                  placeholder="Any remarks, invoice/bill number, or details..."
                  value={expenseForm.notes}
                  onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingExpense}
                  className="px-5 py-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs font-medium rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {savingExpense ? <Loader2 size={13} className="animate-spin text-gray-600" /> : <Save size={13} className="text-gray-600" />}
                  <span>{savingExpense ? 'Recording...' : 'Save Expense'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reusable Tax Invoice Modal */}
      {selectedBookingForInvoice && (
        <TaxInvoiceModal
          bookingId={selectedBookingForInvoice}
          isOpen={true}
          onClose={() => setSelectedBookingForInvoice(null)}
        />
      )}

    </div>
  );
};
