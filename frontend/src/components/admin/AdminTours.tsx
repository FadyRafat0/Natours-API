import { useState, useEffect } from "react";
import API from "../../api";
import Modal from "../Modal";
import type { Tour } from "../../types";

const AdminTours = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const limit = 10;

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [creating, setCreating] = useState(false);

  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDifficulty, setFormDifficulty] = useState("easy");

  const fetchTours = async () => {
    try {
      setLoading(true);
      const query = search ? `&name[regex]=${search}&name[options]=i` : "";
      const res = await API.get(`/tours?page=${page}&limit=${limit}${query}`);
      setTours(res.data.data);
      setTotal(res.data.results || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (page !== 1 && search !== "") {
        setPage(1);
      } else {
        fetchTours();
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [search, page]);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await API.delete(`/tours/${deletingId}`);
      setDeletingId(null);
      fetchTours();
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  const handleSave = async () => {
    try {
      if (editingTour) {
        await API.patch(`/tours/${editingTour._id}`, {
          name: formName,
          price: Number(formPrice),
          difficulty: formDifficulty,
        });
      } else {
        await API.post(`/tours`, {
          name: formName,
          price: Number(formPrice),
          difficulty: formDifficulty,
          maxGroupSize: 10,
          duration: 5,
          summary: "A great tour",
        });
      }
      setEditingTour(null);
      setCreating(false);
      fetchTours();
    } catch (err: any) {
      alert(err.response?.data?.message || "Save failed.");
    }
  };

  const openEdit = (t: Tour) => {
    setEditingTour(t);
    setFormName(t.name);
    setFormPrice(String(t.price));
    setFormDifficulty(t.difficulty);
  };

  const openCreate = () => {
    setCreating(true);
    setFormName("");
    setFormPrice("");
    setFormDifficulty("easy");
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
        <h2 className="heading-secondary">Manage Tours</h2>
        <button className="btn btn--small btn--green" onClick={openCreate}>
          Add Tour
        </button>
      </div>

      <input
        type="text"
        className="form__input"
        placeholder="Search by tour name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "2rem", width: "100%", maxWidth: "400px" }}
      />

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
                <th style={{ padding: "1.5rem" }}>Name</th>
                <th style={{ padding: "1.5rem" }}>Price</th>
                <th style={{ padding: "1.5rem" }}>Difficulty</th>
                <th style={{ padding: "1.5rem", textAlign: "right" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tours.map((t) => (
                <tr key={t._id} style={{ borderBottom: "1px solid #f4f2f2" }}>
                  <td style={{ padding: "1.5rem" }}>{t.name}</td>
                  <td style={{ padding: "1.5rem" }}>${t.price}</td>
                  <td
                    style={{ padding: "1.5rem", textTransform: "capitalize" }}
                  >
                    {t.difficulty}
                  </td>
                  <td style={{ padding: "1.5rem", textAlign: "right" }}>
                    <button
                      className="btn-text"
                      style={{ marginRight: "1rem" }}
                      onClick={() => openEdit(t)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-text"
                      style={{ color: "#eb4d4b" }}
                      onClick={() => setDeletingId(t._id)}
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
          Are you sure you want to delete this tour?
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

      <Modal
        isOpen={creating || !!editingTour}
        onClose={() => {
          setCreating(false);
          setEditingTour(null);
        }}
        title={creating ? "Create Tour" : "Edit Tour"}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div>
            <label className="form__label">
              Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className="form__input"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form__label">
              Price <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className="form__input"
              type="number"
              value={formPrice}
              onChange={(e) => setFormPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form__label">
              Difficulty <span style={{ color: "red" }}>*</span>
            </label>
            <select
              className="form__input"
              value={formDifficulty}
              onChange={(e) => setFormDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <button
            className="btn btn--small btn--green"
            style={{ marginTop: "1rem" }}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminTours;
