import React, { useState } from 'react';
import {
  ShieldAlert,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Layers,
  BarChart3,
  Users,
  Package,
  Activity,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import { ConfirmModal } from '../components/modals/ConfirmModal';

const CHART_COLORS = ['#5C8D63', '#D9785B', '#D8B56A', '#3B82F6', '#8B5CF6', '#12231B'];

export const AdminPage: React.FC = () => {
  const {
    currentUser,
    listings,
    requests,
    reports,
    allUsers,
    impactStats,
    refreshListings,
    refreshReports,
    resetAllDemoData,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'reports' | 'requests'>('listings');
  const [confirmModalData, setConfirmModalData] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {}
  });

  // Calculate KPIs
  const availableCount = listings.filter(l => l.status === 'available').length;
  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;
  const completedHandoversCount = requests.filter(r => r.status === 'completed').length;
  const pendingReportsCount = reports.filter(r => r.status === 'pending').length;

  // Category distribution data for Recharts
  const categoryCounts: Record<string, number> = {};
  listings.forEach((l) => {
    categoryCounts[l.category] = (categoryCounts[l.category] || 0) + 1;
  });
  const categoryChartData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    count: categoryCounts[cat]
  }));

  // City distribution data
  const cityCounts: Record<string, number> = {};
  listings.forEach((l) => {
    cityCounts[l.city] = (cityCounts[l.city] || 0) + 1;
  });
  const cityChartData = Object.keys(cityCounts).map((c) => ({
    name: c,
    listings: cityCounts[c]
  }));

  // Toggle Hide / Restore Listing
  const handleToggleHideListing = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'hidden' ? 'available' : 'hidden';
    storageService.updateListing(id, { status: newStatus as any });
    refreshListings();
    showToast({
      title: newStatus === 'hidden' ? 'Listing Hidden' : 'Listing Restored',
      message: `Listing is now ${newStatus}.`,
      type: 'info'
    });
  };

  // Resolve Report
  const handleResolveReport = (reportId: string, status: 'resolved' | 'dismissed') => {
    storageService.updateReportStatus(reportId, status);
    refreshReports();
    showToast({
      title: status === 'resolved' ? 'Report Resolved' : 'Report Dismissed',
      type: 'success'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Community Moderation Console
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-forest tracking-tight">
            Platform Health & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-mutedDark mt-1">
            Supervise active listings, review flagged items, and maintain community safety standards.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setConfirmModalData({
              isOpen: true,
              title: 'Reset & Reseed All Platform Data',
              message: 'This will restore all demo users, 24+ listings, initial requests, and impact stats back to their seed values.',
              action: () => {
                resetAllDemoData();
                setConfirmModalData(prev => ({ ...prev, isOpen: false }));
              }
            });
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reseed Demo Database</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-mutedDark">Total Listings</p>
          <p className="font-display font-black text-2xl text-forest mt-1">{listings.length}</p>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-mutedDark">Available Now</p>
          <p className="font-display font-black text-2xl text-leaf mt-1">{availableCount}</p>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-mutedDark">Pending Requests</p>
          <p className="font-display font-black text-2xl text-amber-700 mt-1">{pendingRequestsCount}</p>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-mutedDark">Completed Handovers</p>
          <p className="font-display font-black text-2xl text-forest mt-1">{completedHandoversCount}</p>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-mutedDark">Active Community Members</p>
          <p className="font-display font-black text-2xl text-forest mt-1">{allUsers.length}</p>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-rose-200 shadow-soft bg-rose-50/40">
          <p className="text-[10px] font-bold uppercase tracking-wider text-rose-800">Pending Reports</p>
          <p className="font-display font-black text-2xl text-rose-700 mt-1">{pendingReportsCount}</p>
        </div>
      </div>

      {/* Analytics Visual Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* City Distribution Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-4">
          <h2 className="font-display font-bold text-base text-forest">
            Listings Distributed by Metro Hub
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B746E" fontSize={11} />
                <YAxis stroke="#6B746E" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#12231B', color: '#fff', borderRadius: '12px' }}
                />
                <Bar dataKey="listings" fill="#5C8D63" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Pie Chart */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-4">
          <h2 className="font-display font-bold text-base text-forest">
            Top Categories in Circulation
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#12231B', color: '#fff', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Moderation Management Tabs & Tables */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-6">
        <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'listings'
                ? 'bg-forest text-white'
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
            }`}
          >
            All Wardrobe Listings ({listings.length})
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'bg-rose-700 text-white'
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>Flagged Reports ({reports.length})</span>
            {pendingReportsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'requests'
                ? 'bg-forest text-white'
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
            }`}
          >
            Community Requests ({requests.length})
          </button>
        </div>

        {/* TAB 1: LISTINGS MODERATION TABLE */}
        {activeTab === 'listings' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="p-3">Garment</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">City / Locality</th>
                  <th className="p-3">Donor</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-stone-50/60">
                    <td className="p-3 font-semibold text-forest flex items-center gap-2">
                      <img
                        src={l.images[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=200&q=80'}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="truncate max-w-[200px]">{l.title}</span>
                    </td>
                    <td className="p-3 text-stone-600">{l.category} ({l.size})</td>
                    <td className="p-3 text-stone-600">{l.area}, {l.city}</td>
                    <td className="p-3 text-stone-600">{l.donorName}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          l.status === 'available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : l.status === 'hidden'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleHideListing(l.id, l.status)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          l.status === 'hidden'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        }`}
                      >
                        {l.status === 'hidden' ? 'Restore' : 'Hide'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: REPORTS TABLE */}
        {activeTab === 'reports' && (
          <div className="overflow-x-auto">
            {reports.length === 0 ? (
              <p className="text-center py-8 text-xs text-mutedDark">No reported content on file.</p>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="p-3">Flagged Item</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3">Reported By</th>
                    <th className="p-3">Details</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {reports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-stone-50/60">
                      <td className="p-3 font-semibold text-forest">
                        {rep.listingTitle || 'Listing content'}
                      </td>
                      <td className="p-3 text-rose-700 font-medium">{rep.reason}</td>
                      <td className="p-3 text-stone-600">{rep.reportedByName}</td>
                      <td className="p-3 text-stone-500 italic max-w-xs truncate">
                        {rep.details || '—'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            rep.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : rep.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {rep.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {rep.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleResolveReport(rep.id, 'dismissed')}
                              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-stone-100 text-stone-600 hover:bg-stone-200"
                            >
                              Dismiss
                            </button>
                            <button
                              onClick={() => handleResolveReport(rep.id, 'resolved')}
                              className="px-3 py-1 rounded-xl text-xs font-bold bg-forest text-white hover:bg-forest/90"
                            >
                              Resolve
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 3: REQUESTS TABLE */}
        {activeTab === 'requests' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="p-3">Listing</th>
                  <th className="p-3">Requester</th>
                  <th className="p-3">Donor</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50/60">
                    <td className="p-3 font-semibold text-forest">{r.listingTitle}</td>
                    <td className="p-3 text-stone-600">{r.requesterName}</td>
                    <td className="p-3 text-stone-600">{r.donorName}</td>
                    <td className="p-3 text-stone-500">{r.pickupMethod}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          r.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : r.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'completed'
                            ? 'bg-forest text-white'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-right text-stone-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalData.isOpen}
        title={confirmModalData.title}
        message={confirmModalData.message}
        onConfirm={confirmModalData.action}
        onCancel={() => setConfirmModalData(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
