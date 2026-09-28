export type UserRole = 'donor' | 'seeker' | 'admin';

export type ClothingCategory =
  | 'T-shirts'
  | 'Shirts'
  | 'Jeans'
  | 'Trousers'
  | 'Dresses'
  | 'Kurtis'
  | 'Sarees'
  | 'Jackets'
  | 'Sweaters'
  | 'Kidswear'
  | 'Footwear'
  | 'Other';

export type ClothingSize =
  | 'XS'
  | 'S'
  | 'M'
  | 'L'
  | 'XL'
  | 'XXL'
  | 'Kids (0-2y)'
  | 'Kids (3-6y)'
  | 'Kids (7-12y)'
  | 'Free Size';

export type ClothingCondition = 'Like New' | 'Good' | 'Gently Used';

export type ClothingGender = 'Unisex' | 'Men' | 'Women' | 'Kids' | 'All';

export type PickupMethod =
  | 'Donor Pickup (Doorstep/Lobby)'
  | 'Public Handover Point (Metro/Mall/Cafe)'
  | 'Community Drop-off Center'
  | 'Donor Willing to Deliver';

export type ListingStatus = 'available' | 'requested' | 'reserved' | 'handed_over' | 'hidden';

export type RequestStatus = 'pending' | 'approved' | 'declined' | 'cancelled' | 'completed';

export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  city: string;
  area: string;
  role: UserRole;
  createdAt: string;
  verified: boolean;
  phoneApprox?: string;
  bio?: string;
  badges: string[];
  donationsCount: number;
  requestsCount: number;
}

export interface ClothingListing {
  id: string;
  donorId: string;
  donorName: string;
  donorAvatar: string;
  donorVerified: boolean;
  title: string;
  category: ClothingCategory;
  size: ClothingSize;
  condition: ClothingCondition;
  gender: ClothingGender;
  color: string;
  brand?: string;
  description: string;
  suitableFor?: string;
  donorNote?: string;
  images: string[];
  city: string;
  area: string;
  pickupMethods: PickupMethod[];
  status: ListingStatus;
  createdAt: string;
  requestCount: number;
  favoriteCount: number;
  featured?: boolean;
}

export interface ClothingRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  listingCategory: ClothingCategory;
  listingImage: string;
  listingSize: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  requesterCity: string;
  requesterArea: string;
  donorId: string;
  donorName: string;
  message?: string;
  createdAt: string;
  status: RequestStatus;
  pickupMethod: PickupMethod;
  approximateHandoverLocation: string;
  handoverInstructions?: string;
  completedAt?: string;
}

export interface Favorite {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
}

export interface Report {
  id: string;
  listingId?: string;
  listingTitle?: string;
  reportedBy: string;
  reportedByName: string;
  reason: string;
  details?: string;
  status: ReportStatus;
  createdAt: string;
}

export interface ActivityEvent {
  id: string;
  type: 'listing_created' | 'request_sent' | 'request_approved' | 'request_declined' | 'handover_completed' | 'listing_saved';
  message: string;
  timestamp: string;
  userId: string;
  userName: string;
  listingId?: string;
  listingTitle?: string;
}

export interface ToastNotification {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
}

export interface SearchFilterState {
  searchQuery: string;
  category: ClothingCategory | 'All';
  size: ClothingSize | 'All';
  condition: ClothingCondition | 'All';
  gender: ClothingGender | 'All';
  city: string;
  sortBy: 'newest' | 'most_requested' | 'condition' | 'size';
  onlyAvailable: boolean;
}

export interface ImpactStats {
  itemsReused: number;
  donationsCompleted: number;
  peopleSupported: number;
  activeListings: number;
  estWaterSavedLiters: number; // calculated transparently
  estCo2AvoidedKg: number;    // calculated transparently
  communityHandoversCount: number;
  citiesCount: number;
}
