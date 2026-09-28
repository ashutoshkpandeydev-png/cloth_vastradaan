import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Package,
  Heart,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  AlertCircle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import { ClothingCard } from '../components/common/ClothingCard';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import { ClothingRequest, RequestStatus } from '../types';

export const ActivityPage: React.FC = () => {
  const {
    currentUser,
    listings,
    requests,
    favorites,
    refreshRequests,
    refreshListings,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'requests' | 'saved' | 'completed'>(
    'requests'
  );

  const [selectedRequestForAction, setSelectedRequestForAction] = useState<ClothingRequest | null>(null);
  const [handoverInstructionsInput, setHandoverInstructionsInput] = useState('');
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
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

  // Filter listings & requests for current user
  const myListings = listings.filter(l => l.donorId === currentUser.id);
  const myRequests = requests.filter(
    r => r.donorId === currentUser.id || r.requesterId === currentUser.id
  );

  const pendingIncomingRequests = requests.filter(
    r => r.donorId === currentUser.id && r.status === 'pending'
  );

  const approvedRequests = myRequests.filter(
    r => r.status === 'approved' || r.status === 'pending'
  );

  const completedHandovers = myRequests.filter(r => r.status === 'completed');

  const savedListings = listings.filter(l => favorites.includes(l.id));

  // Stats calculation
  const totalGiven = myListings.filter(l => l.status === 'handed_over').length;
  const totalReceived = myRequests.filter(
    r => r.requesterId === currentUser.id && r.status === 'completed'
  ).length;

  const handleApproveClick = (req: ClothingRequest) => {
    setSelectedRequestForAction(req);
    setHandoverInstructionsInput(
      req.handoverInstructions ||
        `Available near ${req.approximateHandoverLocation} between 4 PM - 6 PM on Saturday. Look for a brown paper parcel.`
    );
    setIsApproveModalOpen(true);
  };

  const handleConfirmApprove = () => {
    if (!selectedRequestForAction) return;

    try {
      storageService.updateRequestStatus(
        selectedRequestForAction.id,
        'approved',
        handoverInstructionsInput.trim()
      );
      refreshRequests();
      refreshListings();
      setIsApproveModalOpen(false);
      setSelectedRequestForAction(null);
      showToast({
        title: 'Request Approved!',
        message: `Handover coordinates revealed to ${selectedRequestForAction.requesterName}.`,
        type: 'success'
      });
    } catch {
      showToast({ title: 'Error', message: 'Could not approve request.', type: 'error' });
    }
  };

  const handleDeclineClick = (req: ClothingRequest) => {
    setConfirmModalData({
      isOpen: true,
      title: 'Decline Request',
      message: `Decline the request from ${req.requesterName} for "${req.listingTitle}"?`,
      action: () => {
        storageService.updateRequestStatus(req.id, 'declined');
        refreshRequests();
        refreshListings();
        showToast({ title: 'Request Declined', type: 'info' });
        setConfirmModalData(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleCompleteClick = (req: ClothingRequest) => {
    setConfirmModalData({
      isOpen: true,
      title: 'Confirm Handover Completion',
      message: `Mark "${req.listingTitle}" as successfully handed over? This will add to community circularity metrics.`,
      action: () => {
        storageService.updateRequestStatus(req.id, 'completed');
        refreshRequests();
        refreshListings();
        showToast({
          title: 'Handover Completed!',
          message: 'Thank you for giving clothes a second life!',
          type: 'success'
        });
        setConfirmModalData(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-leaf uppercase tracking-wider">
            Dashboard & History
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-forest">
            My Community Activity
          </h1>
          <p className="text-xs sm:text-sm text-mutedDark mt-1">
            Active persona: <span className="font-bold text-forest">{currentUser.name}</span> ({currentUser.role.toUpperCase()} • {currentUser.city})
          </p>
        </div>

        <Link
          to="/give"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-forest text-white text-xs font-bold shadow-soft hover:shadow-soft-lg transition-all"
        >
          <PlusCircle className="w-4 h-4 text-leaf" />
          <span>Give Another Item</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-mutedDark">Items Listed</p>
          <p className="font-display font-black text-2xl text-forest mt-1">{myListings.length}</p>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-mutedDark">Pending Requests</p>
          <p className="font-display font-black text-2xl text-amber-700 mt-1">{pendingIncomingRequests.length}</p>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-mutedDark">Successful Given</p>
          <p className="font-display font-black text-2xl text-leaf mt-1">{totalGiven}</p>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-mutedDark">Items Received</p>
          <p className="font-display font-black text-2xl text-terracotta mt-1">{totalReceived}</p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'requests', label: 'Requests', count: myRequests.length },
          { id: 'listings', label: 'My Listings', count: myListings.length },
          { id: 'saved', label: 'Saved Wardrobe', count: savedListings.length },
          { id: 'completed', label: 'Completed Handovers', count: completedHandovers.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-forest text-white shadow-soft'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeTab === tab.id ? 'bg-leaf text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT: REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {myRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-soft max-w-md mx-auto space-y-3">
              <MessageSquare className="w-8 h-8 text-stone-300 mx-auto" />
              <h3 className="font-display font-bold text-lg text-forest">No requests yet</h3>
              <p className="text-xs text-mutedDark">
                Requests you send or receive will appear here with status tracking.
              </p>
              <Link
                to="/discover"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-forest text-white text-xs font-bold shadow-soft"
              >
                <Compass className="w-4 h-4" />
                <span>Discover Items</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((req) => {
                const isDonor = req.donorId === currentUser.id;

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-soft space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.listingImage || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=200&q=80'}
                          alt={req.listingTitle}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-leaf">
                            {isDonor ? 'Incoming Request for your listing' : 'Your Outgoing Request'}
                          </span>
                          <h3 className="font-display font-bold text-sm text-forest">{req.listingTitle}</h3>
                          <p className="text-xs text-mutedDark">
                            {isDonor ? `From: ${req.requesterName}` : `Donor: ${req.donorName}`} • Size {req.listingSize}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            req.status === 'pending'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : req.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : req.status === 'completed'
                              ? 'bg-forest text-white'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {req.status === 'pending'
                            ? 'Pending Review'
                            : req.status === 'approved'
                            ? 'Approved • Ready for Handover'
                            : req.status === 'completed'
                            ? 'Handover Completed'
                            : req.status}
                        </span>
                      </div>
                    </div>

                    {/* Message body */}
                    {req.message && (
                      <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 text-xs">
                        <span className="font-bold text-stone-600 block mb-0.5">Requester Message:</span>
                        <p className="text-neutralDark italic">"{req.message}"</p>
                      </div>
                    )}

                    {/* Approved Handover Details */}
                    {req.status === 'approved' && req.handoverInstructions && (
                      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-2">
                        <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                          <ShieldCheck className="w-4 h-4 text-emerald-700" />
                          <span>Approved Handover Coordinates Revealed:</span>
                        </div>
                        <p className="text-emerald-950 font-medium">{req.handoverInstructions}</p>
                        <p className="text-[11px] text-emerald-800">
                          Handover Location: {req.approximateHandoverLocation}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <span className="text-[11px] text-stone-400">
                        Requested on {new Date(req.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2">
                        {isDonor && req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleDeclineClick(req)}
                              className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleApproveClick(req)}
                              className="px-4 py-1.5 rounded-xl bg-forest hover:bg-forest/90 text-white text-xs font-bold shadow-soft"
                            >
                              Approve Request
                            </button>
                          </>
                        )}

                        {req.status === 'approved' && (
                          <button
                            onClick={() => handleCompleteClick(req)}
                            className="px-4 py-1.5 rounded-xl bg-leaf hover:bg-leaf/90 text-white text-xs font-bold shadow-soft"
                          >
                            Mark Handover Completed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: MY LISTINGS */}
      {activeTab === 'listings' && (
        <div>
          {myListings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-soft max-w-md mx-auto space-y-3">
              <Package className="w-8 h-8 text-stone-300 mx-auto" />
              <h3 className="font-display font-bold text-lg text-forest">No clothes listed yet</h3>
              <p className="text-xs text-mutedDark">
                Your unused clothes could be someone's next favorite garment.
              </p>
              <Link
                to="/give"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-forest text-white text-xs font-bold shadow-soft"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Give Clothes Now</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {myListings.map((listing) => (
                <ClothingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: SAVED */}
      {activeTab === 'saved' && (
        <div>
          {savedListings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-soft max-w-md mx-auto space-y-3">
              <Heart className="w-8 h-8 text-stone-300 mx-auto" />
              <h3 className="font-display font-bold text-lg text-forest">No saved items</h3>
              <p className="text-xs text-mutedDark">
                Click the heart icon on any clothing card to bookmark it here.
              </p>
              <Link
                to="/discover"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-forest text-white text-xs font-bold shadow-soft"
              >
                <Compass className="w-4 h-4" />
                <span>Discover Clothes</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {savedListings.map((listing) => (
                <ClothingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: COMPLETED HANDOVERS */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {completedHandovers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-soft max-w-md mx-auto space-y-3">
              <CheckCircle2 className="w-8 h-8 text-stone-300 mx-auto" />
              <h3 className="font-display font-bold text-lg text-forest">No completed handovers yet</h3>
              <p className="text-xs text-mutedDark">
                Completed item handovers will be archived here for impact record.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedHandovers.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-soft flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-leaf/10 text-leaf flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-forest">{req.listingTitle}</h4>
                      <p className="text-xs text-mutedDark">
                        Completed between {req.donorName} & {req.requesterName}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-leaf px-3 py-1 rounded-full bg-leaf/10">
                    Handed Over
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* APPROVE MODAL WITH HANDOVER INSTRUCTIONS */}
      {isApproveModalOpen && selectedRequestForAction && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-forest/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-soft-xl border border-stone-200 space-y-4">
            <h2 className="font-display font-bold text-xl text-forest">
              Approve Request from {selectedRequestForAction.requesterName}
            </h2>
            <p className="text-xs text-mutedDark">
              Provide pickup coordinates or instructions. This will be revealed privately to {selectedRequestForAction.requesterName}.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1">
                Handover Instructions / Meeting Point Details
              </label>
              <textarea
                rows={4}
                value={handoverInstructionsInput}
                onChange={(e) => setHandoverInstructionsInput(e.target.value)}
                className="w-full p-3 rounded-2xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-leaf/40 resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsApproveModalOpen(false)}
                className="flex-1 py-2.5 rounded-2xl border border-stone-200 text-stone-600 font-semibold text-xs hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApprove}
                className="flex-1 py-2.5 rounded-2xl bg-forest hover:bg-forest/90 text-white font-bold text-xs shadow-soft"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

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
