import { useState, useEffect } from 'react';
import API from '../../api';
import { useAuth } from '../../context/AuthContext';
import { formatDate, tourImg } from '../../utils/helpers';
import type { Review } from '../../types';
import Modal from '../Modal';

const ReviewsContent = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editReviewText, setEditReviewText] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/reviews?user=${user?._id}&page=${page}&limit=${limit}`);
      setReviews(res.data.data);
      setTotal(res.data.results || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchReviews();
  }, [user?._id, page]);

  const handleSaveEdit = async (id: string) => {
    setSaving(true);
    try {
      await API.patch(`/reviews/${id}`, { review: editReviewText, rating: editRating });
      setEditingId(null);
      fetchReviews();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update review.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await API.delete(`/reviews/${deletingId}`);
      setDeletingId(null);
      fetchReviews();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete review.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading && reviews.length === 0) return <div style={{ fontSize: '1.6rem' }}>Loading reviews...</div>;

  return (
    <div className="user-view__form-container">
      <h2 className="heading-secondary ma-bt-md">My Reviews</h2>
      {!reviews.length && !loading ? (
        <div style={{ fontSize: '1.6rem' }}>You haven't written any reviews yet.</div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {reviews.map((review) => {
              const isEditing = editingId === review._id;
              const tourName = typeof review.tour === 'object' ? review.tour.name : 'Unknown Tour';
              const coverImg = typeof review.tour === 'object' ? review.tour.imageCover : 'default.jpg';
              
              return (
                <div key={review._id} style={{ display: 'flex', backgroundColor: '#fff', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1.5rem 4rem rgba(0,0,0,0.1)' }}>
                  <img src={tourImg(coverImg)} alt={tourName} style={{ width: '150px', objectFit: 'cover' }} />
                  <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 className="heading-tertirary" style={{ marginBottom: '1rem', fontSize: '1.8rem', textTransform: 'uppercase', fontWeight: 700 }}>
                      <span>{tourName}</span>
                    </h3>
                    
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <textarea 
                          className="form__input" 
                          value={editReviewText} 
                          onChange={e => setEditReviewText(e.target.value)} 
                          rows={3} 
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontSize: '1.4rem', color: '#777' }}>Rating:</span>
                          <input 
                            type="number" 
                            className="form__input" 
                            style={{ width: '80px', padding: '0.5rem 1rem' }} 
                            value={editRating} 
                            min={1} 
                            max={5} 
                            onChange={e => setEditRating(Number(e.target.value))} 
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <p style={{ fontSize: '1.5rem', marginBottom: '1rem', fontStyle: 'italic' }}>"{review.review}"</p>
                        <p style={{ fontSize: '1.4rem', color: '#777' }}>
                          <strong style={{ color: '#55c57a' }}>Rating:</strong> {review.rating}/5 &bull; <strong style={{ color: '#55c57a' }}>Date:</strong> {formatDate(review.createdAt)}
                        </p>
                      </>
                    )}
                  </div>
                  <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                    {isEditing ? (
                      <>
                        <button className="btn btn--small btn--green" disabled={saving} onClick={() => handleSaveEdit(review._id)}>Save</button>
                        <button className="btn btn--small" style={{ backgroundColor: '#777', color: '#fff' }} onClick={() => setEditingId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn--small btn--green" onClick={() => {
                          setEditingId(review._id);
                          setEditReviewText(review.review);
                          setEditRating(review.rating);
                        }}>Edit</button>
                        <button className="btn btn--small" style={{ backgroundColor: '#eb4d4b', color: '#fff' }} onClick={() => setDeletingId(review._id)}>Delete</button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn--small btn--green" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              Previous
            </button>
            <span style={{ fontSize: '1.6rem', alignSelf: 'center' }}>Page {page}</span>
            <button className="btn btn--small btn--green" disabled={total < limit} onClick={() => setPage(p => p + 1)}>
              Next
            </button>
          </div>
        </>
      )}

      <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)} title="Confirm Delete">
        <p style={{ fontSize: '1.6rem', marginBottom: '2rem' }}>Are you sure you want to delete this review? This action cannot be undone.</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button className="btn btn--small" style={{ backgroundColor: '#777', color: '#fff' }} onClick={() => setDeletingId(null)}>Cancel</button>
          <button className="btn btn--small" style={{ backgroundColor: '#eb4d4b', color: '#fff' }} disabled={deleting} onClick={handleDelete}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ReviewsContent;
