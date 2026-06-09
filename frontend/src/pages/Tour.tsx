import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import type { Tour as TourType, Review } from '../types';
import { tourImg, userImg, formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import Mapbox from '../components/Mapbox';

const ICONS = '/img/icons.svg';

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="reviews__card">
    <div className="reviews__avatar">
      <img
        src={userImg(review.user.photo)}
        alt={review.user.name}
        className="reviews__avatar-img"
      />
      <h6 className="reviews__user">{review.user.name}</h6>
    </div>
    <p className="reviews__text">{review.review}</p>
    <div className="reviews__rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`reviews__star reviews__star--${star <= review.rating ? 'active' : 'inactive'}`}
        >
          <use href={`${ICONS}#icon-star`} />
        </svg>
      ))}
    </div>
  </div>
);

const QuickFact = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="overview-box__detail">
    <svg className="overview-box__icon">
      <use href={`${ICONS}#icon-${icon}`} />
    </svg>
    <span className="overview-box__label">{label}</span>
    <span className="overview-box__text">{value}</span>
  </div>
);

const Tour = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [tour, setTour] = useState<TourType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingCheckLoading, setBookingCheckLoading] = useState(false);

  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);

  const handleBookTour = async () => {
    if (!tour) return;
    setBookingLoading(true);
    try {
      const session = await API.get(`/bookings/checkout-session/${tour.id || tour._id}`);
      if (session.data.session && session.data.session.url) {
        window.location.assign(session.data.session.url);
      } else {
        throw new Error('Failed to create checkout session.');
      }
    } catch (err) {
      console.error(err);
      alert('Error booking tour. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await API.get(`/tours?nameSlug=${slug}`);
        const tours = res.data.data;
        if (tours && tours.length > 0) {
          const fetchedTour = tours[0];
          setTour(fetchedTour);
          
          if (user) {
            setBookingCheckLoading(true);
            try {
              const bookingRes = await API.get(`/bookings?user=${user._id}&tour=${fetchedTour.id || fetchedTour._id}`);
              if (bookingRes.data.results && bookingRes.data.results > 0) {
                setIsBooked(true);
              }
            } catch(e) {}
            setBookingCheckLoading(false);
          }
        } else {
          setError('Tour not found.');
        }
      } catch {
        setError('Could not load tour. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [slug, user]);

  const hasReviewed = tour?.reviews?.some(r => r.user?._id === user?._id || (r.user as any) === user?._id);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour) return;
    setReviewLoading(true);
    try {
      await API.post('/reviews', {
        tour: tour.id || tour._id,
        user: user?._id,
        review: reviewText,
        rating: reviewRating
      });
      alert('Review posted successfully!');
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to post review.');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="main tour-flex-center">
        <div className="spinner" />
      </main>
    );
  }

  if (error || !tour) {
    return (
      <main className="main tour-flex-center">
        <div className="error">
          <div className="error__title">
            <h2 className="heading-secondary heading-secondary--error">Uh oh! Something went wrong!</h2>
            <h2 className="error__emoji">😢 🤯</h2>
          </div>
          <div className="error__msg">{error || 'Tour not found.'}</div>
        </div>
      </main>
    );
  }

  const nextDate = tour.startDates?.length > 0 ? formatDate(tour.startDates[0]) : 'TBD';

  return (
    <>
      <section className="section-header">
        <div className="header__hero">
          <div className="header__hero-overlay">&nbsp;</div>
          <img
            src={tourImg(tour.imageCover)}
            alt={tour.name}
            className="header__hero-img"
          />
        </div>
        <div className="heading-box">
          <h1 className="heading-primary">
            <span>{tour.name} tour</span>
          </h1>
          <div className="heading-box__group">
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use href={`${ICONS}#icon-clock`} />
              </svg>
              <span className="heading-box__text">{tour.duration} days</span>
            </div>
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use href={`${ICONS}#icon-map-pin`} />
              </svg>
              <span className="heading-box__text">{tour.startLocation?.description}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-description">
        <div className="overview-box">
          <div>
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>
              <QuickFact icon="calendar" label="Next date" value={nextDate} />
              <QuickFact icon="trending-up" label="Difficulty" value={tour.difficulty} />
              <QuickFact icon="user" label="Participants" value={`${tour.maxGroupSize} people`} />
              <QuickFact icon="star" label="Rating" value={`${tour.ratingsAverage} / 5`} />
            </div>

            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Your tour guides</h2>
              {tour.guides?.map((guide) => (
                <div key={guide._id} className="overview-box__detail">
                  <img
                    src={userImg(guide.photo)}
                    alt={guide.name}
                    className="overview-box__img"
                  />
                  <span className="overview-box__label">
                    {guide.role === 'lead-guide' ? 'Lead guide' : 'Tour guide'}
                  </span>
                  <span className="overview-box__text">{guide.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="description-box">
          <h2 className="heading-secondary ma-bt-lg">About {tour.name} tour</h2>
          {tour.description?.split('\n').map((paragraph, i) => (
            <p key={i} className="description__text">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {tour.images && tour.images.length > 0 && (
        <section className="section-pictures">
          {tour.images.map((img, i) => (
            <div key={i} className="picture-box">
              <img
                src={tourImg(img)}
                alt={`${tour.name} ${i + 1}`}
                className={`picture-box__img picture-box__img--${i + 1}`}
              />
            </div>
          ))}
        </section>
      )}

      <section className="section-map">
        {tour.locations && tour.locations.length > 0 ? (
          <Mapbox locations={tour.locations} />
        ) : (
          <div className="tour-no-locations">
            <h2 className="heading-secondary">No locations provided</h2>
          </div>
        )}
      </section>

      {tour.reviews && tour.reviews.length > 0 && (
        <section className="section-reviews">
          <div className="reviews">
            {tour.reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        </section>
      )}

      {user && !hasReviewed && isBooked && (
        <section className="section-cta tour-review-cta">
          <div className="login-form tour-review-form-container">
            <h2 className="heading-secondary ma-bt-md">Leave a Review</h2>
            <form className="form" onSubmit={handleReviewSubmit}>
              <div className="form__group">
                <label className="form__label">Your thoughts</label>
                <textarea 
                  className="form__input" 
                  value={reviewText} 
                  onChange={e => setReviewText(e.target.value)} 
                  required 
                  rows={4}
                  placeholder="Tell us about your experience..."
                />
              </div>
              <div className="form__group">
                <label className="form__label">Rating</label>
                <div className="tour-review-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="tour-review-star-icon"
                      style={{ fill: star <= reviewRating ? '#55c57a' : '#bbb' }}
                    >
                      <use href={`${ICONS}#icon-star`} />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="form__group tour-review-submit">
                <button className="btn btn--green" disabled={reviewLoading}>
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      <section className="section-cta">
        <div className="cta">
          <div className="cta__img cta__img--logo">
            <img src="/img/logo-white.png" alt="Natours logo" />
          </div>
          {tour.images && tour.images.length >= 2 && (
            <>
              <img src={tourImg(tour.images[1])} alt="Tour picture" className="cta__img cta__img--1" />
              <img src={tourImg(tour.images[0])} alt="Tour picture" className="cta__img cta__img--2" />
            </>
          )}

          <div className="cta__content">
            <h2 className="heading-secondary">What are you waiting for?</h2>
            <p className="cta__text">
              {tour.duration} days. 1 adventure. Infinite memories. Make it yours today!
            </p>
            {user ? (
              bookingCheckLoading ? (
                <button className="btn btn--green span-all-rows" disabled>Checking...</button>
              ) : isBooked ? (
                <button className="btn span-all-rows tour-booked-btn" disabled>
                  Booked
                </button>
              ) : (
                <button 
                  className="btn btn--green span-all-rows"
                  onClick={handleBookTour}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'Processing...' : 'Book tour now!'}
                </button>
              )
            ) : (
              <Link to="/login" className="btn btn--green span-all-rows">
                Log in to book tour
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Tour;
