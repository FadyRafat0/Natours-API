import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api';
import type { Tour } from '../types';
import TourCard from '../components/TourCard';

const Overview = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await API.get('/tours');
        setTours(res.data.data);
      } catch {
        setError('Could not load tours. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const search = searchParams.get('search');
  const filteredTours = search
    ? tours.filter((tour) => tour.name.toLowerCase().includes(search.toLowerCase()))
    : tours;

  if (loading) {
    return (
      <main className="main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="error">
          <div className="error__title">
            <h2 className="heading-secondary heading-secondary--error">Uh oh! Something went wrong!</h2>
            <h2 className="error__emoji">😢 🤯</h2>
          </div>
          <div className="error__msg">{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="main">
      <div className="card-container">
        {filteredTours.length > 0 ? (
          filteredTours.map((tour) => (
            <TourCard key={tour._id} tour={tour} />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <h2 className="heading-secondary">No tours found matching "{search}"</h2>
          </div>
        )}
      </div>
    </main>
  );
};

export default Overview;
