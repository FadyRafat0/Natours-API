import { useState, useEffect } from "react";
import API from "../../api";
import Modal from "../Modal";
import type { User } from "../../types";

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const limit = 10;

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [creating, setCreating] = useState(false);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("user");
  const [formPassword, setFormPassword] = useState("");
  const [formPasswordConfirm, setFormPasswordConfirm] = useState("");
  const [formIsVerified, setFormIsVerified] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const query = search ? `&email[regex]=${search}&email[options]=i` : "";
      const res = await API.get(`/users?page=${page}&limit=${limit}${query}`);
      setUsers(res.data.data);
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
        fetchUsers();
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [search, page]);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await API.delete(`/users/${deletingId}`);
      setDeletingId(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        await API.patch(`/users/${editingUser._id}`, {
          name: formName,
          email: formEmail,
          role: formRole,
          isVerified: formIsVerified,
        });
      } else {
        await API.post(`/users`, {
          name: formName,
          email: formEmail,
          role: formRole,
          isVerified: formIsVerified,
          password: formPassword,
          passwordConfirm: formPasswordConfirm,
        });
      }
      setEditingUser(null);
      setCreating(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Save failed.");
    }
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormIsVerified(user.isVerified || false);
    setFormPassword("");
    setFormPasswordConfirm("");
  };

  const openCreate = () => {
    setCreating(true);
    setFormName("");
    setFormEmail("");
    setFormRole("user");
    setFormIsVerified(false);
    setFormPassword("");
    setFormPasswordConfirm("");
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
        <h2 className="heading-secondary">Manage Users</h2>
        <button className="btn btn--small btn--green" onClick={openCreate}>
          Add User
        </button>
      </div>

      <input
        type="text"
        className="form__input"
        placeholder="Search by email..."
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
                <th style={{ padding: "1.5rem" }}>Email</th>
                <th style={{ padding: "1.5rem" }}>Role</th>
                <th style={{ padding: "1.5rem", textAlign: "right" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: "1px solid #f4f2f2" }}>
                  <td style={{ padding: "1.5rem" }}>{u.name}</td>
                  <td style={{ padding: "1.5rem" }}>{u.email}</td>
                  <td style={{ padding: "1.5rem" }}>{u.role}</td>
                  <td style={{ padding: "1.5rem", textAlign: "right" }}>
                    <button
                      className="btn-text"
                      style={{ marginRight: "1rem" }}
                      onClick={() => openEdit(u)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-text"
                      style={{ color: "#eb4d4b" }}
                      onClick={() => setDeletingId(u._id)}
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
          Are you sure you want to delete this user?
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
        isOpen={creating || !!editingUser}
        onClose={() => {
          setCreating(false);
          setEditingUser(null);
        }}
        title={creating ? "Create User" : "Edit User"}
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
              Email <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className="form__input"
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form__label">
              Role <span style={{ color: "red" }}>*</span>
            </label>
            <select
              className="form__input"
              value={formRole}
              onChange={(e) => setFormRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="guide">Guide</option>
              <option value="lead-guide">Lead Guide</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <input
              type="checkbox"
              id="isVerified"
              checked={formIsVerified}
              onChange={(e) => setFormIsVerified(e.target.checked)}
              style={{ width: "2rem", height: "2rem", cursor: "pointer" }}
            />
            <label htmlFor="isVerified" className="form__label" style={{ margin: 0, cursor: "pointer" }}>
              Email Verified
            </label>
          </div>
          {creating && (
            <>
              <div>
                <label className="form__label">
                  Password <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form__input"
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  required={creating}
                  minLength={8}
                />
              </div>
              <div>
                <label className="form__label">
                  Confirm Password <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form__input"
                  type="password"
                  value={formPasswordConfirm}
                  onChange={(e) => setFormPasswordConfirm(e.target.value)}
                  required={creating}
                  minLength={8}
                />
              </div>
            </>
          )}
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

export default AdminUsers;
