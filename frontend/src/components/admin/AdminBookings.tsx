import { useState, useEffect } from "react";
import API from "../../api";
import Modal from "../Modal";
import type { Booking } from "../../types";

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/bookings?page=${page}&limit=${limit}`);
      setBookings(res.data.data);
      setTotal(res.data.results || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page]);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await API.delete(`/bookings/${deletingId}`);
      setDeletingId(null);
      fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div className="user-view__form-container" style={{ maxWidth: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h2 className="heading-secondary">Manage Bookings</h2>
      </div>

      {loading ? (
        <p style={{ fontSize: "1.6rem" }}>Loading...</p>
      ) : (
        <div
          style={{
            overflowX: "auto",
            backgroundColor: "#fff",
            borderRadius: "1rem",
            boxShadow: "0 1.5rem 4rem rgba(0,0,0,0.1)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "1.4rem",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f3f3f3", textAlign: "left" }}>
                <th style={{ padding: "1.5rem" }}>Tour</th>
                <th style={{ padding: "1.5rem" }}>User</th>
                <th style={{ padding: "1.5rem" }}>Price</th>
                <th style={{ padding: "1.5rem", textAlign: "right" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} style={{ borderBottom: "1px solid #f4f2f2" }}>
                  <td style={{ padding: "1.5rem" }}>
                    {b.tour?.name || "Unknown"}
                  </td>
                  <td style={{ padding: "1.5rem" }}>
                    {b.user?.email || "Unknown"}
                  </td>
                  <td style={{ padding: "1.5rem" }}>${b.price}</td>
                  <td style={{ padding: "1.5rem", textAlign: "right" }}>
                    <button
                      className="btn-text"
                      style={{ color: "#eb4d4b" }}
                      onClick={() => setDeletingId(b._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div
        style={{
          marginTop: "3rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          className="btn btn--small btn--green"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>
        <span style={{ fontSize: "1.6rem", alignSelf: "center" }}>
          Page {page}
        </span>
        <button
          className="btn btn--small btn--green"
          disabled={total < limit}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Confirm Delete"
      >
        <p style={{ fontSize: "1.6rem", marginBottom: "2rem" }}>
          Are you sure you want to delete this booking?
        </p>
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
        >
          <button
            className="btn btn--small"
            style={{ backgroundColor: "#777", color: "#fff" }}
            onClick={() => setDeletingId(null)}
          >
            Cancel
          </button>
          <button
            className="btn btn--small"
            style={{ backgroundColor: "#eb4d4b", color: "#fff" }}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminBookings;
