import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  ClothingListing,
  ClothingRequest,
  Report,
  ActivityEvent,
  ImpactStats,
  ToastNotification,
  SearchFilterState,
  UserRole
} from '../types';
import { storageService } from '../services/storageService';

interface AppContextType {
  currentUser: User;
  allUsers: User[];
  switchUser: (userId: string) => void;
  switchUserByRole: (role: UserRole) => void;
  listings: ClothingListing[];
  refreshListings: () => void;
  requests: ClothingRequest[];
  refreshRequests: () => void;
  favorites: string[];
  toggleFavorite: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;
  toasts: ToastNotification[];
  showToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  reports: Report[];
  refreshReports: () => void;
  activityFeed: ActivityEvent[];
  refreshActivity: () => void;
  impactStats: ImpactStats;
  refreshImpact: () => void;
  resetAllDemoData: () => void;
  searchFilter: SearchFilterState;
  setSearchFilter: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  clearFilters: () => void;
}

const defaultFilterState: SearchFilterState = {
  searchQuery: '',
  category: 'All',
  size: 'All',
  condition: 'All',
  gender: 'All',
  city: 'All',
  sortBy: 'newest',
  onlyAvailable: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => storageService.getCurrentUser());
  const [allUsers, setAllUsers] = useState<User[]>(() => storageService.getUsers());
  const [listings, setListings] = useState<ClothingListing[]>(() => storageService.getListings());
  const [requests, setRequests] = useState<ClothingRequest[]>(() => storageService.getRequests());
  const [favorites, setFavorites] = useState<string[]>(() => storageService.getFavorites(currentUser.id));
  const [reports, setReports] = useState<Report[]>(() => storageService.getReports());
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>(() => storageService.getActivityFeed());
  const [impactStats, setImpactStats] = useState<ImpactStats>(() => storageService.getImpactStats());
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [searchFilter, setSearchFilter] = useState<SearchFilterState>(defaultFilterState);

  // Sync favorites when user switches
  useEffect(() => {
    setFavorites(storageService.getFavorites(currentUser.id));
  }, [currentUser.id]);

  const refreshListings = () => {
    setListings(storageService.getListings());
  };

  const refreshRequests = () => {
    setRequests(storageService.getRequests());
  };

  const refreshReports = () => {
    setReports(storageService.getReports());
  };

  const refreshActivity = () => {
    setActivityFeed(storageService.getActivityFeed());
  };

  const refreshImpact = () => {
    setImpactStats(storageService.getImpactStats());
  };

  const switchUser = (userId: string) => {
    const user = storageService.setCurrentUserId(userId);
    setCurrentUser(user);
    showToast({
      title: `Switched account to ${user.name}`,
      message: `Active role: ${user.role.toUpperCase()} (${user.city})`,
      type: 'info'
    });
  };

  const switchUserByRole = (role: UserRole) => {
    const users = storageService.getUsers();
    const user = users.find(u => u.role === role);
    if (user) {
      switchUser(user.id);
    }
  };

  const toggleFavorite = (listingId: string) => {
    const isNowFav = storageService.toggleFavorite(currentUser.id, listingId);
    setFavorites(storageService.getFavorites(currentUser.id));
    refreshListings();
    showToast({
      title: isNowFav ? 'Added to Saved Wardrobe' : 'Removed from Saved Wardrobe',
      type: isNowFav ? 'success' : 'info'
    });
  };

  const isFavorite = (listingId: string) => {
    return favorites.includes(listingId);
  };

  const showToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastNotification = { id, duration: 4000, ...toast };
    setToasts(prev => [...prev, newToast]);

    if (newToast.duration) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const clearFilters = () => {
    setSearchFilter(defaultFilterState);
  };

  const resetAllDemoData = () => {
    storageService.resetToSeedData();
    setCurrentUser(storageService.getCurrentUser());
    setAllUsers(storageService.getUsers());
    setListings(storageService.getListings());
    setRequests(storageService.getRequests());
    setFavorites([]);
    setReports(storageService.getReports());
    setActivityFeed(storageService.getActivityFeed());
    setImpactStats(storageService.getImpactStats());
    clearFilters();
    showToast({
      title: 'Demo Data Reset',
      message: 'All listings, requests, and community stats have been restored to initial seed state.',
      type: 'success'
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        switchUser,
        switchUserByRole,
        listings,
        refreshListings,
        requests,
        refreshRequests,
        favorites,
        toggleFavorite,
        isFavorite,
        toasts,
        showToast,
        removeToast,
        reports,
        refreshReports,
        activityFeed,
        refreshActivity,
        impactStats,
        refreshImpact,
        resetAllDemoData,
        searchFilter,
        setSearchFilter,
        clearFilters
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
