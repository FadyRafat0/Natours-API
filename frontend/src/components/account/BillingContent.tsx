import { useEffect, useState } from 'react';
import API from '../../api';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';

const BillingContent = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        const res = await API.get(`/bookings?user=${user._id || (user as any).id}`);
        setBookings(res.data.data || res.data.results || []);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const totalSpent = bookings.reduce((acc, curr) => acc + (curr.price || 0), 0);

  if (loading) {
    return (
      <div className="user-view__form-container">
        <h2 className="heading-secondary ma-bt-md">Billing Overview</h2>
        <p>Loading billing data...</p>
      </div>
    );
  }

  return (
    <div className="user-view__form-container">
      <h2 className="heading-secondary ma-bt-md">Billing Overview</h2>

      <div className="billing-grid">
        <div className="billing-card billing-card--center">
          <h3 className="heading-tertirary billing-card__title">
            Total Spent
          </h3>
          <p className="billing-card__balance">
            ${totalSpent.toFixed(2)}
          </p>
          <span
            className="btn btn--small btn--green"
            style={{ cursor: "default" }}
          >
            Paid in Full
          </span>
        </div>

        <div className="billing-card">
          <h3 className="heading-tertirary billing-card__title billing-card__title--mb">
            Payment Methods
          </h3>
          <div className="billing-card__payment-method">
            <div className="billing-card__icon">💳</div>
            <div>
              <p className="billing-card__text-bold">
                Stripe Checkout
              </p>
              <p className="billing-card__text-muted">Securely Handled</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="heading-secondary ma-bt-md">Recent Bookings (Invoices)</h2>
      <div className="invoice-list">
        {bookings.length === 0 ? (
          <p>No past bookings found.</p>
        ) : (
          bookings.map((booking, i) => (
            <div key={booking._id || i} className="invoice-item">
              <div>
                <p className="billing-card__text-bold">
                  {booking.tour?.name ? `${booking.tour.name} Tour` : `Invoice INV-${booking._id.substring(0, 6).toUpperCase()}`}
                </p>
                <p className="billing-card__text-muted">
                  {booking.createdAt ? formatDate(booking.createdAt) : 'Recent'} &bull; ${booking.price?.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BillingContent;
