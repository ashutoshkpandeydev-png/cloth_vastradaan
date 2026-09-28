import {
  User,
  ClothingListing,
  ClothingRequest,
  Favorite,
  Report,
  ActivityEvent,
  ImpactStats,
  SearchFilterState,
  RequestStatus,
  ReportStatus,
  PickupMethod
} from '../types';
import {
  SEED_USERS,
  SEED_LISTINGS,
  SEED_REQUESTS,
  SEED_REPORTS,
  SEED_ACTIVITY,
  SEED_IMPACT
} from '../data/seedData';

const STORAGE_KEYS = {
  USERS: 'cloth_forward_users_v1',
  CURRENT_USER_ID: 'cloth_forward_current_user_id_v1',
  LISTINGS: 'cloth_forward_listings_v1',
  REQUESTS: 'cloth_forward_requests_v1',
  FAVORITES: 'cloth_forward_favorites_v1',
  REPORTS: 'cloth_forward_reports_v1',
  ACTIVITY: 'cloth_forward_activity_v1',
  IMPACT: 'cloth_forward_impact_v1'
};

class StorageService {
  constructor() {
    this.initializeIfEmpty();
  }

  private initializeIfEmpty() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-donor-1'); // Default to Aarav (Donor)
    }
    if (!localStorage.getItem(STORAGE_KEYS.LISTINGS)) {
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(SEED_LISTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(SEED_REQUESTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
      // Default sample favorites for Priya
      const sampleFavs: Favorite[] = [
        { id: 'fav-1', userId: 'user-seeker-1', listingId: 'item-001', createdAt: new Date().toISOString() },
        { id: 'fav-2', userId: 'user-seeker-1', listingId: 'item-006', createdAt: new Date().toISOString() }
      ];
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(sampleFavs));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(SEED_REPORTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(SEED_ACTIVITY));
    }
    if (!localStorage.getItem(STORAGE_KEYS.IMPACT)) {
      localStorage.setItem(STORAGE_KEYS.IMPACT, JSON.stringify(SEED_IMPACT));
    }
  }

  // --- Users & Session ---
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  }

  getCurrentUser(): User {
    const users = this.getUsers();
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user-donor-1';
    const found = users.find(u => u.id === currentId);
    return found || users[0] || SEED_USERS[0];
  }

  setCurrentUserId(id: string): User {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
    return this.getCurrentUser();
  }

  // --- Listings ---
  getListings(filters?: Partial<SearchFilterState>): ClothingListing[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      let list: ClothingListing[] = raw ? JSON.parse(raw) : SEED_LISTINGS;

      if (!filters) return list;

      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase().trim();
        list = list.filter(item =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          (item.brand && item.brand.toLowerCase().includes(query)) ||
          item.city.toLowerCase().includes(query) ||
          item.area.toLowerCase().includes(query) ||
          item.color.toLowerCase().includes(query)
        );
      }

      if (filters.category && filters.category !== 'All') {
        list = list.filter(item => item.category === filters.category);
      }

      if (filters.size && filters.size !== 'All') {
        list = list.filter(item => item.size === filters.size);
      }

      if (filters.condition && filters.condition !== 'All') {
        list = list.filter(item => item.condition === filters.condition);
      }

      if (filters.gender && filters.gender !== 'All') {
        list = list.filter(item => item.gender === filters.gender || item.gender === 'Unisex');
      }

      if (filters.city && filters.city !== 'All' && filters.city.trim() !== '') {
        list = list.filter(item => item.city.toLowerCase() === filters.city?.toLowerCase());
      }

      if (filters.onlyAvailable) {
        list = list.filter(item => item.status === 'available');
      }

      if (filters.sortBy) {
        if (filters.sortBy === 'newest') {
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (filters.sortBy === 'most_requested') {
          list.sort((a, b) => b.requestCount - a.requestCount);
        }
      }

      return list;
    } catch {
      return SEED_LISTINGS;
    }
  }

  getListingById(id: string): ClothingListing | undefined {
    const listings = this.getListings();
    return listings.find(item => item.id === id);
  }

  createListing(data: {
    donorId: string;
    donorName: string;
    donorAvatar: string;
    donorVerified: boolean;
    title: string;
    category: ClothingListing['category'];
    size: ClothingListing['size'];
    condition: ClothingListing['condition'];
    gender: ClothingListing['gender'];
    color: string;
    brand?: string;
    description: string;
    suitableFor?: string;
    donorNote?: string;
    images: string[];
    city: string;
    area: string;
    pickupMethods: PickupMethod[];
  }): ClothingListing {
    const listings = this.getListings();
    const newId = `item-${Date.now().toString().slice(-4)}`;
    const newListing: ClothingListing = {
      ...data,
      id: newId,
      status: 'available',
      createdAt: new Date().toISOString(),
      requestCount: 0,
      favoriteCount: 0,
      featured: false
    };

    const updated = [newListing, ...listings];
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(updated));

    // Log Activity
    this.addActivityEvent({
      type: 'listing_created',
      message: `${data.donorName} listed "${data.title}" in ${data.city}`,
      userId: data.donorId,
      userName: data.donorName,
      listingId: newId,
      listingTitle: data.title
    });

    // Update user stats
    this.incrementUserDonationCount(data.donorId);

    return newListing;
  }

  updateListing(id: string, updates: Partial<ClothingListing>): ClothingListing | null {
    const listings = this.getListings();
    const index = listings.findIndex(l => l.id === id);
    if (index === -1) return null;

    listings[index] = { ...listings[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
    return listings[index];
  }

  deleteListing(id: string): boolean {
    const listings = this.getListings();
    const filtered = listings.filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(filtered));
    return true;
  }

  // --- Requests ---
  getRequests(userId?: string, role?: 'donor' | 'seeker'): ClothingRequest[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      const requests: ClothingRequest[] = raw ? JSON.parse(raw) : SEED_REQUESTS;

      if (!userId) return requests;

      if (role === 'donor') {
        return requests.filter(r => r.donorId === userId);
      } else if (role === 'seeker') {
        return requests.filter(r => r.requesterId === userId);
      }

      return requests.filter(r => r.donorId === userId || r.requesterId === userId);
    } catch {
      return SEED_REQUESTS;
    }
  }

  createRequest(data: {
    listingId: string;
    requesterId: string;
    message?: string;
    pickupMethod: PickupMethod;
  }): ClothingRequest {
    const listing = this.getListingById(data.listingId);
    if (!listing) throw new Error('Listing not found');

    const users = this.getUsers();
    const requester = users.find(u => u.id === data.requesterId) || this.getCurrentUser();

    const requests = this.getRequests();
    const newReqId = `req-${Date.now().toString().slice(-4)}`;

    const newRequest: ClothingRequest = {
      id: newReqId,
      listingId: listing.id,
      listingTitle: listing.title,
      listingCategory: listing.category,
      listingImage: listing.images[0] || '',
      listingSize: listing.size,
      requesterId: requester.id,
      requesterName: requester.name,
      requesterAvatar: requester.avatar,
      requesterCity: requester.city,
      requesterArea: requester.area,
      donorId: listing.donorId,
      donorName: listing.donorName,
      message: data.message,
      createdAt: new Date().toISOString(),
      status: 'pending',
      pickupMethod: data.pickupMethod,
      approximateHandoverLocation: `${listing.area}, ${listing.city}`
    };

    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify([newRequest, ...requests]));

    // Update listing requestCount & status
    this.updateListing(listing.id, {
      requestCount: listing.requestCount + 1,
      status: 'requested'
    });

    // Add activity
    this.addActivityEvent({
      type: 'request_sent',
      message: `${requester.name} requested "${listing.title}" in ${listing.city}`,
      userId: requester.id,
      userName: requester.name,
      listingId: listing.id,
      listingTitle: listing.title
    });

    return newRequest;
  }

  updateRequestStatus(
    requestId: string,
    newStatus: RequestStatus,
    instructions?: string
  ): ClothingRequest | null {
    const requests = this.getRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index === -1) return null;

    const req = requests[index];
    req.status = newStatus;
    if (instructions) {
      req.handoverInstructions = instructions;
    }
    if (newStatus === 'completed') {
      req.completedAt = new Date().toISOString();
      this.updateListing(req.listingId, { status: 'handed_over' });
      this.incrementImpactMetrics();
    } else if (newStatus === 'approved') {
      this.updateListing(req.listingId, { status: 'reserved' });
    }

    requests[index] = req;
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));

    // Log Activity
    const actType =
      newStatus === 'approved'
        ? 'request_approved'
        : newStatus === 'declined'
        ? 'request_declined'
        : newStatus === 'completed'
        ? 'handover_completed'
        : 'request_sent';

    this.addActivityEvent({
      type: actType,
      message: `Request for "${req.listingTitle}" was marked ${newStatus}`,
      userId: req.donorId,
      userName: req.donorName,
      listingId: req.listingId,
      listingTitle: req.listingTitle
    });

    return req;
  }

  // --- Favorites ---
  getFavorites(userId: string): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      const favs: Favorite[] = raw ? JSON.parse(raw) : [];
      return favs.filter(f => f.userId === userId).map(f => f.listingId);
    } catch {
      return [];
    }
  }

  toggleFavorite(userId: string, listingId: string): boolean {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      let favs: Favorite[] = raw ? JSON.parse(raw) : [];
      const existing = favs.find(f => f.userId === userId && f.listingId === listingId);

      const listing = this.getListingById(listingId);
      let isNowFav = false;

      if (existing) {
        favs = favs.filter(f => !(f.userId === userId && f.listingId === listingId));
        if (listing && listing.favoriteCount > 0) {
          this.updateListing(listingId, { favoriteCount: listing.favoriteCount - 1 });
        }
        isNowFav = false;
      } else {
        favs.push({
          id: `fav-${Date.now()}`,
          userId,
          listingId,
          createdAt: new Date().toISOString()
        });
        if (listing) {
          this.updateListing(listingId, { favoriteCount: listing.favoriteCount + 1 });
        }
        isNowFav = true;
      }

      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
      return isNowFav;
    } catch {
      return false;
    }
  }

  // --- Reports ---
  getReports(): Report[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return raw ? JSON.parse(raw) : SEED_REPORTS;
    } catch {
      return SEED_REPORTS;
    }
  }

  createReport(data: {
    listingId?: string;
    listingTitle?: string;
    reportedBy: string;
    reportedByName: string;
    reason: string;
    details?: string;
  }): Report {
    const reports = this.getReports();
    const newRep: Report = {
      id: `rep-${Date.now().toString().slice(-4)}`,
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([newRep, ...reports]));
    return newRep;
  }

  updateReportStatus(id: string, status: ReportStatus): Report | null {
    const reports = this.getReports();
    const index = reports.findIndex(r => r.id === id);
    if (index === -1) return null;

    reports[index].status = status;
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    return reports[index];
  }

  // --- Activity ---
  getActivityFeed(): ActivityEvent[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
      return raw ? JSON.parse(raw) : SEED_ACTIVITY;
    } catch {
      return SEED_ACTIVITY;
    }
  }

  addActivityEvent(event: Omit<ActivityEvent, 'id' | 'timestamp'>) {
    const list = this.getActivityFeed();
    const newEvent: ActivityEvent = {
      id: `act-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      ...event
    };
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify([newEvent, ...list.slice(0, 49)]));
  }

  // --- Impact Stats ---
  getImpactStats(): ImpactStats {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.IMPACT);
      return raw ? JSON.parse(raw) : SEED_IMPACT;
    } catch {
      return SEED_IMPACT;
    }
  }

  private incrementImpactMetrics() {
    const current = this.getImpactStats();
    const updated: ImpactStats = {
      ...current,
      itemsReused: current.itemsReused + 1,
      donationsCompleted: current.donationsCompleted + 1,
      peopleSupported: current.peopleSupported + 1,
      estWaterSavedLiters: current.estWaterSavedLiters + 2700,
      estCo2AvoidedKg: current.estCo2AvoidedKg + 8,
      communityHandoversCount: current.communityHandoversCount + 1
    };
    localStorage.setItem(STORAGE_KEYS.IMPACT, JSON.stringify(updated));
  }

  private incrementUserDonationCount(userId: string) {
    const users = this.getUsers();
    const u = users.find(user => user.id === userId);
    if (u) {
      u.donationsCount += 1;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  }

  // --- Reset & Reseed Data ---
  resetToSeedData() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-donor-1');
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(SEED_LISTINGS));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(SEED_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(SEED_REPORTS));
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(SEED_ACTIVITY));
    localStorage.setItem(STORAGE_KEYS.IMPACT, JSON.stringify(SEED_IMPACT));
  }
}

export const storageService = new StorageService();
