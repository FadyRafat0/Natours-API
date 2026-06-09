import { useState, useEffect } from 'react';
import API from '../../api';
import Modal from '../Modal';
import type { Review } from '../../types';

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  
  const [formText, setFormText] = useState('');
  const [formRating, setFormRating] = useState(5);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/reviews?page=${page}&limit=${limit}`);
      setReviews(res.data.data);
      setTotal(res.data.results || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await API.delete(`/reviews/${deletingId}`);
      setDeletingId(null);
      fetchReviews();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleSave = async () => {
    try {
      if (editingReview) {
        await API.patch(`/reviews/${editingReview._id}`, { review: formText, rating: formRating });
      }
      setEditingReview(null);
      fetchReviews();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Save failed.');
    }
  };

  const openEdit = (r: Review) => {
    setEditingReview(r);
    setFormText(r.review);
    setFormRating(r.rating);
  };

  return (
    <div className="user-view__form-container" style={{ maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="heading-secondary">Manage Reviews</h2>
      </div>

      {loading ? <p style={{ fontSize: '1.6rem' }}>Loading...</p> : (
        <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '1rem', boxShadow: '0 1.5rem 4rem rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.4rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f3f3', textAlign: 'left' }}>
                <th style={{ padding: '1.5rem' }}>Review</th>
                <th style={{ padding: '1.5rem' }}>Rating</th>
                <th style={{ padding: '1.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r._id} style={{ borderBottom: '1px solid #f4f2f2' }}>
                  <td style={{ padding: '1.5rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.review}</td>
                  <td style={{ padding: '1.5rem' }}>{r.rating} / 5</td>
                  <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                    <button className="btn-text" style={{ marginRight: '1rem' }} onClick={() => openEdit(r)}>Edit</button>
                    <button className="btn-text" style={{ color: '#eb4d4b' }} onClick={() => setDeletingId(r._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn--small btn--green" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
        <span style={{ fontSize: '1.6rem', alignSelf: 'center' }}>Page {page}</span>
        <button className="btn btn--small btn--green" disabled={total < limit} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>

      <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)} title="Confirm Delete">
        <p style={{ fontSize: '1.6rem', marginBottom: '2rem' }}>Are you sure you want to delete this review?</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button className="btn btn--small" style={{ backgroundColor: '#777', color: '#fff' }} onClick={() => setDeletingId(null)}>Cancel</button>
          <button className="btn btn--small" style={{ backgroundColor: '#eb4d4b', color: '#fff' }} onClick={handleDelete}>Delete</button>
        </div>
      </Modal>

      <Modal isOpen={!!editingReview} onClose={() => setEditingReview(null)} title="Edit Review">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="form__label">Review <span style={{color: 'red'}}>*</span></label>
            <textarea className="form__input" value={formText} onChange={e => setFormText(e.target.value)} required rows={4} />
          </div>
          <div>
            <label className="form__label">Rating <span style={{color: 'red'}}>*</span></label>
            <input className="form__input" type="number" min={1} max={5} value={formRating} onChange={e => setFormRating(Number(e.target.value))} required />
          </div>
          <button className="btn btn--small btn--green" style={{ marginTop: '1rem' }} onClick={handleSave}>Save</button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminReviews;
