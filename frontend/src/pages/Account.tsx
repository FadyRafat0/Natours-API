import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SettingsContent from '../components/account/SettingsContent';
import BookingsContent from '../components/account/BookingsContent';
import ReviewsContent from '../components/account/ReviewsContent';
import BillingContent from '../components/account/BillingContent';
import AdminUsers from '../components/admin/AdminUsers';
import AdminTours from '../components/admin/AdminTours';
import AdminReviews from '../components/admin/AdminReviews';
import AdminBookings from '../components/admin/AdminBookings';

const Account = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('settings');

  if (!user) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'settings': return <SettingsContent />;
      case 'bookings': return <BookingsContent />;
      case 'reviews': return <ReviewsContent />;
      case 'billing': return <BillingContent />;
      case 'admin-tours': return <AdminTours />;
      case 'admin-users': return <AdminUsers />;
      case 'admin-reviews': return <AdminReviews />;
      case 'admin-bookings': return <AdminBookings />;
      default: return <SettingsContent />;
    }
  };

  return (
    <main className="main">
      <div className="user-view">
        <nav className="user-view__menu">
          <ul className="side-nav">
            <li className={activeTab === 'settings' ? 'side-nav--active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }}>
                <svg><use href="/img/icons.svg#icon-settings" /></svg>Settings
              </a>
            </li>
            <li className={activeTab === 'bookings' ? 'side-nav--active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('bookings'); }}>
                <svg><use href="/img/icons.svg#icon-briefcase" /></svg>My bookings
              </a>
            </li>
            <li className={activeTab === 'reviews' ? 'side-nav--active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('reviews'); }}>
                <svg><use href="/img/icons.svg#icon-star" /></svg>My reviews
              </a>
            </li>
            <li className={activeTab === 'billing' ? 'side-nav--active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('billing'); }}>
                <svg><use href="/img/icons.svg#icon-credit-card" /></svg>Billing
              </a>
            </li>
          </ul>

          {user.role === 'admin' && (
            <div className="admin-nav">
              <h5 className="admin-nav__heading">Admin</h5>
              <ul className="side-nav">
                <li className={activeTab === 'admin-tours' ? 'side-nav--active' : ''}>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('admin-tours'); }}>
                    <svg><use href="/img/icons.svg#icon-map" /></svg>Manage tours
                  </a>
                </li>
                <li className={activeTab === 'admin-users' ? 'side-nav--active' : ''}>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('admin-users'); }}>
                    <svg><use href="/img/icons.svg#icon-users" /></svg>Manage users
                  </a>
                </li>
                <li className={activeTab === 'admin-reviews' ? 'side-nav--active' : ''}>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('admin-reviews'); }}>
                    <svg><use href="/img/icons.svg#icon-star" /></svg>Manage reviews
                  </a>
                </li>
                <li className={activeTab === 'admin-bookings' ? 'side-nav--active' : ''}>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('admin-bookings'); }}>
                    <svg><use href="/img/icons.svg#icon-briefcase" /></svg>Manage bookings
                  </a>
                </li>
              </ul>
            </div>
          )}
        </nav>

        <div className="user-view__content">
          {renderContent()}
        </div>
      </div>
    </main>
  );
};

export default Account;
