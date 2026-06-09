import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api';
import type { Tour } from '../types';
import TourCard from '../components/TourCard';

const Overview = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 9;
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const searchQuery = search ? `&name[regex]=${search}&name[options]=i` : '';
        const res = await API.get(`/tours?page=${page}&limit=${limit}${searchQuery}`);
        setTours(res.data.data);
        setTotal(res.data.totalResults || 0);
      } catch {
        setError('Could not load tours. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, [page, search]);

  const totalPages = Math.ceil(total / limit);

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
        {tours.length > 0 ? (
          tours.map((tour) => (
            <TourCard key={tour._id} tour={tour} />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <h2 className="heading-secondary">No tours found{search ? ` matching "${search}"` : ''}</h2>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '4rem', paddingBottom: '4rem' }}>
          <button
            className="btn btn--green btn--small"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            &larr; Previous
          </button>
          <span style={{ fontSize: '1.6rem', alignSelf: 'center', fontWeight: 600 }}>
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn--green btn--small"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next &rarr;
          </button>
        </div>
      )}
    </main>
  );
};

export default Overview;
