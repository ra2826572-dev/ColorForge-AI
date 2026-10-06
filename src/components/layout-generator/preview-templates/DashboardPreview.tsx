import React, { useState } from 'react';
import { GeneratedLayoutSystem } from '../../../types/colorforge';
import {
  LayoutDashboard,
  BarChart2,
  Users,
  CreditCard,
  Settings,
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Plus,
  Shield,
  Layers,
} from 'lucide-react';

interface PreviewProps {
  system: GeneratedLayoutSystem;
  fontFamily: string;
}

export const DashboardPreview: React.FC<PreviewProps> = ({ system, fontFamily }) => {
  const [activeNav, setActiveNav] = useState('overview');
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const c = system.colors;
  const d = system.analysis.derivedColors;
  const r = system.borderRadius;

  const transactions = [
    { customer: 'Acme Global Corp', date: 'Just now', amount: '$4,250.00', status: 'Completed', method: 'Stripe' },
    { customer: 'Hyperion Analytics', date: '22m ago', amount: '$1,890.00', status: 'Completed', method: 'Wire' },
    { customer: 'Studio Monolith LLC', date: '1h ago', amount: '$850.00', status: 'Pending', method: 'Credit Card' },
    { customer: 'Vanguard Media Group', date: '3h ago', amount: '$6,400.00', status: 'Completed', method: 'Invoice' },
  ];

  return (
    <div
      style={{
        backgroundColor: c.background,
        color: c.text,
        fontFamily,
      }}
      className="w-full flex min-h-[640px] transition-colors duration-200"
    >
      {/* Mock Sidebar */}
      <aside
        style={{
          backgroundColor: c.surface,
          borderRight: `1px solid ${d.cardBorder}`,
        }}
        className="w-56 hidden md:flex flex-col justify-between p-4 shrink-0"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 font-black text-sm px-2">
            <div
              style={{ backgroundColor: c.primary, borderRadius: r }}
              className="w-7 h-7 flex items-center justify-center text-white text-xs font-bold"
            >
              {system.websiteName.charAt(0)}
            </div>
            <span>{system.websiteName}</span>
          </div>

          <div className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'analytics', label: 'Analytics', icon: BarChart2 },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'billing', label: 'Billing', icon: CreditCard },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  style={{
                    backgroundColor: isActive ? c.primary : 'transparent',
                    color: isActive ? '#FFFFFF' : d.mutedText,
                    borderRadius: r,
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold transition-all text-left"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Plan Widget */}
        <div
          style={{
            backgroundColor: d.subtleBg,
            borderColor: d.cardBorder,
            borderRadius: r,
          }}
          className="p-3 border space-y-2 text-xs"
        >
          <div className="flex items-center justify-between font-bold">
            <span>Enterprise Pro</span>
            <span style={{ color: c.accent }}>Active</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div style={{ backgroundColor: c.primary, width: '74%' }} className="h-full rounded-full" />
          </div>
          <span style={{ color: d.mutedText }} className="text-[10px] block">
            74,210 of 100k API tokens used
          </span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header
          style={{
            backgroundColor: c.surface,
            borderBottom: `1px solid ${d.cardBorder}`,
          }}
          className="h-16 px-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5" style={{ color: d.mutedText }} />
              <input
                type="text"
                placeholder="Search metrics, logs, transactions..."
                style={{
                  backgroundColor: d.inputBg,
                  borderColor: d.inputBorder,
                  color: c.text,
                  borderRadius: r,
                }}
                className="pl-8 pr-3 py-1.5 text-xs border w-64 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              style={{
                backgroundColor: d.subtleBg,
                borderColor: d.cardBorder,
                borderRadius: r,
              }}
              className="p-2 border relative hover:opacity-80"
            >
              <Bell className="h-3.5 w-3.5" style={{ color: d.mutedText }} />
              <span style={{ backgroundColor: c.accent }} className="w-2 h-2 rounded-full absolute top-1 right-1" />
            </button>

            <button
              style={{
                backgroundColor: c.primary,
                borderRadius: r,
              }}
              className="px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Report</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight">Executive Intelligence</h1>
              <p style={{ color: d.mutedText }} className="text-xs">
                Real-time transaction throughput and pipeline telemetry
              </p>
            </div>

            <div
              style={{
                backgroundColor: c.surface,
                borderColor: d.cardBorder,
                borderRadius: r,
              }}
              className="px-3 py-1.5 text-xs font-semibold border flex items-center gap-2"
            >
              <span>Period:</span>
              <span className="font-bold">{dateRange}</span>
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Gross Revenue', value: '$284,950', change: '+18.4%', isPositive: true },
              { label: 'Active Subscribers', value: '14,290', change: '+8.1%', isPositive: true },
              { label: 'Conversion Velocity', value: '4.82%', change: '+1.4%', isPositive: true },
              { label: 'Churn Rate', value: '0.84%', change: '-0.3%', isPositive: true },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: c.surface,
                  borderColor: d.cardBorder,
                  borderRadius: r,
                }}
                className="p-4 border shadow-sm flex flex-col justify-between"
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: d.mutedText }}>
                  {stat.label}
                </span>
                <div className="text-2xl font-black mb-2">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs font-bold" style={{ color: c.accent }}>
                  {stat.isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  <span>{stat.change} vs prev. 30d</span>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue Chart Widget */}
          <div
            style={{
              backgroundColor: c.surface,
              borderColor: d.cardBorder,
              borderRadius: r,
            }}
            className="p-6 border shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold">Throughput & Revenue Distribution</h3>
                <p style={{ color: d.mutedText }} className="text-xs">Visualized with user's selected primary & secondary hues</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span style={{ backgroundColor: c.primary }} className="w-3 h-3 rounded-sm" />
                  <span>Recurring SaaS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span style={{ backgroundColor: c.accent }} className="w-3 h-3 rounded-sm" />
                  <span>Expansion Add-ons</span>
                </div>
              </div>
            </div>

            {/* Simulated Chart Bars */}
            <div className="flex items-end gap-3 h-36 w-full pt-4 border-b pb-2" style={{ borderColor: d.cardBorder }}>
              {[45, 62, 58, 80, 72, 94, 88, 76, 92, 100, 85, 96].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div
                    style={{
                      height: `${val}%`,
                      backgroundColor: idx === 9 ? c.accent : c.primary,
                      borderRadius: '4px',
                    }}
                    className="w-full transition-all hover:opacity-80"
                  />
                  <span className="text-[10px] font-mono" style={{ color: d.mutedText }}>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <div
            style={{
              backgroundColor: c.surface,
              borderColor: d.cardBorder,
              borderRadius: r,
            }}
            className="border shadow-sm overflow-hidden"
          >
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: d.cardBorder }}>
              <h3 className="font-bold text-sm">Recent Ledger Settlements</h3>
              <span style={{ color: c.primary }} className="text-xs font-bold cursor-pointer">Export CSV</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr style={{ backgroundColor: d.subtleBg, color: d.mutedText, borderColor: d.cardBorder }} className="border-b">
                    <th className="p-3.5 font-semibold">Organization</th>
                    <th className="p-3.5 font-semibold">Date</th>
                    <th className="p-3.5 font-semibold">Method</th>
                    <th className="p-3.5 font-semibold">Amount</th>
                    <th className="p-3.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: d.cardBorder }}>
                  {transactions.map((tx, idx) => (
                    <tr key={idx} className="hover:opacity-80 transition-opacity">
                      <td className="p-3.5 font-bold">{tx.customer}</td>
                      <td className="p-3.5" style={{ color: d.mutedText }}>{tx.date}</td>
                      <td className="p-3.5" style={{ color: d.mutedText }}>{tx.method}</td>
                      <td className="p-3.5 font-black">{tx.amount}</td>
                      <td className="p-3.5">
                        <span
                          style={{
                            backgroundColor: tx.status === 'Completed' ? d.badgeBg : d.subtleBg,
                            color: tx.status === 'Completed' ? d.badgeText : d.mutedText,
                          }}
                          className="px-2 py-0.5 rounded text-[10px] font-bold"
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
