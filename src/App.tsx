import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { GiveClothesPage } from './pages/GiveClothesPage';
import { ActivityPage } from './pages/ActivityPage';
import { ImpactPage } from './pages/ImpactPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { GuidelinesPage } from './pages/GuidelinesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

// Scroll to top helper on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F5EF] text-[#202522]">
      <ScrollToTop />
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/clothes/:id" element={<ListingDetailPage />} />
          <Route path="/give" element={<GiveClothesPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default App;
