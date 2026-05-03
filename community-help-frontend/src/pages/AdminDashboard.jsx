import { useEffect, useState } from "react";

import API from "../services/api";

import toast from "react-hot-toast";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  /* FETCH USERS */
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        "/admin/users",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUsers(res.data);
    } catch (err) {
      toast.error("Admin access denied");
    }
  };
  /* FETCH REPORTS */
  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        "/admin/reports",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setReports(res.data);
    } catch (err) {
      toast.error("Error fetching reports");
    }
  };

  /* FETCH STATS */
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        "/admin/stats",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setStats(res.data);
    } catch (err) {
      toast.error("Error fetching stats");
    }
  };
  /* BAN USER */
  const banUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/admin/ban/${id}`,

        {},

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("User banned");

      fetchUsers();
    } catch (err) {
      toast.error("Error banning user");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
    fetchReports();
  }, []);

  return (
    <div className="admin-page">
      <h1>👑 Admin Dashboard</h1>
      {/* ANALYTICS */}

      {stats && (
        <div className="analytics-grid">
          <div className="analytics-card">
            <h2>{stats.totalUsers}</h2>

            <p>👥 Users</p>
          </div>

          <div className="analytics-card">
            <h2>{stats.totalPosts}</h2>

            <p>📝 Posts</p>
          </div>

          <div className="analytics-card">
            <h2>{stats.totalReports}</h2>

            <p>🚩 Reports</p>
          </div>

          <div className="analytics-card">
            <h2>{stats.bannedUsers}</h2>

            <p>🔨 Banned</p>
          </div>
        </div>
      )}
      <div className="admin-users">
        {users.map((user) => (
          <div key={user._id} className="admin-user-card">
            <div>
              <h3>{user.name}</h3>

              <p>{user.email}</p>

              <small>Role: {user.role}</small>
            </div>

            <div>
              {user.isBanned ? (
                <button className="banned-btn">Banned</button>
              ) : (
                <button className="ban-btn" onClick={() => banUser(user._id)}>
                  Ban
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* REPORTS */}

      <div className="reports-section">
        <h2>🚩 Reported Posts</h2>

        <div className="reports-list">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div key={report._id} className="report-card">
                <h3>{report.post?.title}</h3>

                <p>
                  <strong>Reason:</strong> {report.reason}
                </p>

                <small>Reported By: {report.reportedBy?.name}</small>
              </div>
            ))
          ) : (
            <p>No reports yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
