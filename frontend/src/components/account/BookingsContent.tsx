import { useState, useEffect } from "react";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import { formatDate, tourImg } from "../../utils/helpers";
import type { Booking } from "../../types";

const BookingsContent = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await API.get(
          `/bookings/my-bookings?page=${page}&limit=${limit}`,
        );
        setBookings(res.data.data);
        setTotal(res.data.results || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchBookings();
  }, [user?._id, page]);

  if (loading)
    return <div style={{ fontSize: "1.6rem" }}>Loading bookings...</div>;

  return (
    <div className="user-view__form-container">
      <h2 className="heading-secondary ma-bt-md">My Bookings</h2>
      {!bookings.length ? (
        <div style={{ fontSize: "1.6rem" }}>You have no bookings yet.</div>
      ) : (
        <>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            {bookings.map((booking) => (
              <div
                key={booking._id}
                style={{
                  display: "flex",
                  backgroundColor: "#fff",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  boxShadow: "0 1.5rem 4rem rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={tourImg(booking.tour.imageCover)}
                  alt={booking.tour.name}
                  style={{ width: "150px", objectFit: "cover" }}
                />
                <div
                  style={{
                    padding: "2rem",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <h3
                    className="heading-tertirary"
                    style={{
                      marginBottom: "1rem",
                      fontSize: "1.8rem",
                      textTransform: "uppercase",
                      fontWeight: 700,
                    }}
                  >
                    <span>{booking.tour.name}</span>
                  </h3>
                  <p style={{ fontSize: "1.4rem", color: "#777" }}>
                    <strong style={{ color: "#55c57a" }}>Price:</strong> $
                    {booking.price} &bull;{" "}
                    <strong style={{ color: "#55c57a" }}>Date Paid:</strong>{" "}
                    {formatDate(booking.createdAt)}
                  </p>
                </div>
                <div
                  style={{
                    padding: "2rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    className="btn btn--green btn--small"
                    style={{ cursor: "default" }}
                  >
                    {booking.paid ? "PAID" : "PENDING"}
                  </span>
                </div>
              </div>
            ))}
          </div>

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
        </>
      )}
    </div>
  );
};

export default BookingsContent;
