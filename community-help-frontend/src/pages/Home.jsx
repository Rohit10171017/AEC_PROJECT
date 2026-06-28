import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function Home() {
  const [posts, setPosts] = useState([]);

  const [type, setType] = useState("");

  const [showReport, setShowReport] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null);

  const [reportReason, setReportReason] = useState("");

  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || [],
  );

  const [search, setSearch] = useState("");

  const [showFavorites, setShowFavorites] = useState(false);

  const [activeImage, setActiveImage] = useState(null);

  const [showProfile, setShowProfile] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [commentInput, setCommentInput] = useState({});

  const [layout, setLayout] = useState("feed");



  const [searchMode, setSearchMode] = useState("posts");

 const fetchPosts = useCallback(async () => {
  try {
    const res = await API.get(`/posts?type=${type}`);
    setPosts(res.data);
  } catch (err) {
    console.log(err);
  }
}, [type]);

useEffect(() => {
  fetchPosts();
}, [fetchPosts]);
 

  /* DELETE */
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchPosts();
      toast.success("Post deleted");
    } catch (err) {
      toast.error("Error deleting post");
    }
  };

  /* OPEN REPORT */
  const openReport = (post) => {
    setSelectedPost(post);

    setShowReport(true);
  };

  /* SUBMIT REPORT */
  const submitReport = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/reports",

        {
          postId: selectedPost._id,

          reason: reportReason,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Report submitted");

      setShowReport(false);

      setReportReason("");
    } catch (err) {
      toast.error("Error submitting report");
    }
  };

  const toggleFavorite = (id) => {
    let updatedFavorites;

    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter((fav) => fav !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }

    setFavorites(updatedFavorites);

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const filteredPosts = posts.filter((post) => {
    if (searchMode === "posts") {
      return (
        post.title
          ?.toLowerCase()

          .includes(search.toLowerCase()) ||
        post.description
          ?.toLowerCase()

          .includes(search.toLowerCase())
      );
    }

    /* LOCATION SEARCH */
    return post.location
      ?.toLowerCase()

      .includes(search.toLowerCase());
  });

  const updatePostStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/posts/status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchPosts();

      toast.success("Status updated");
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const openProfile = (user) => {
    setSelectedUser(user);

    setShowProfile(true);
  };

  const addComment = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        `/posts/comment/${postId}`,

        {
          text: commentInput[postId],
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Comment added");

      setCommentInput({
        ...commentInput,

        [postId]: "",
      });

      fetchPosts();
    } catch (err) {
      toast.error("Error adding comment");
    }
  };

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (searchMode !== "location") return 0;

    const aNearby = a.location
      ?.toLowerCase()

      .includes(search.toLowerCase());

    const bNearby = b.location
      ?.toLowerCase()

      .includes(search.toLowerCase());

    return bNearby - aNearby;
  });
  return (
    <div className="home-container">
      {/* HEADER */}
      <div className="feed-header">
        <h2>🌍 Community Feed</h2>

        <div className="search-controls">
          {/* SEARCH */}
          <div className="search-toggle">
            <button
              className={searchMode === "posts" ? "active-toggle" : ""}
              onClick={() => setSearchMode("posts")}
            >
              📝
            </button>

            <button
              className={searchMode === "location" ? "active-toggle" : ""}
              onClick={() => setSearchMode("location")}
            >
              📍
            </button>
          </div>
          <input
            type="text"
            placeholder={
              searchMode === "posts"
                ? "🔍 Search posts..."
                : "📍 Search by location..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <div className="layout-switcher">
            <button onClick={() => setLayout("feed")}>📃</button>

            <button onClick={() => setLayout("grid")}>🟦</button>

            <button onClick={() => setLayout("compact")}>☰</button>
          </div>

          {/* TYPE FILTER */}
          <select onChange={(e) => setType(e.target.value)}>
            <option value="">All Posts</option>

            <option value="need">Needs</option>

            <option value="offer">Offers</option>
          </select>

          {/* FAVORITES */}
          <button
            className="favorites-filter"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            {showFavorites ? "❤️ Saved" : "🤍 Favorites"}
          </button>
        </div>
      </div>

      {/* DASHBOARD */}

      <div className="dashboard">
        <div className="stat-card">
          <h3>{posts.length}</h3>

          <p>Total Posts</p>
        </div>

        <div className="stat-card need-card">
          <h3>{posts.filter((p) => p.type === "need").length}</h3>

          <p>Need Requests</p>
        </div>

        <div className="stat-card offer-card">
          <h3>{posts.filter((p) => p.type === "offer").length}</h3>

          <p>Offers</p>
        </div>

        <div className="stat-card helped-card">
          <h3>{posts.length * 3}</h3>

          <p>People Helped</p>
        </div>
      </div>
      {/* POSTS */}
      <div className={`posts ${layout}`}>
        {sortedPosts.length > 0 ? (
          sortedPosts.map((post) => (
            <div key={post._id} className="post">
              {/* TOP */}
              <div className="post-top">
                <span className={`badge ${post.type}`}>
                  {post.type === "need" ? "🔴 Need Help" : "🟢 Offering Help"}
                </span>

                <div className={`status-badge ${post.status}`}>
                  {post.status === "open"
                    ? "🟢 Open"
                    : post.status === "progress"
                      ? "🟡 In Progress"
                      : "⚪ Resolved"}
                </div>
              </div>

              {/* TITLE */}
              <h3>{post.title}</h3>

              {/* DESC */}
              <p className="desc">{post.description}</p>

              {/* IMAGE */}
              {post.image && (
                <button
                  className="view-image-btn"
                  onClick={() => setActiveImage(post.image)}
                >
                  🖼 View Image
                </button>
              )}

              {/* INFO */}
              <div className="info">
                <p>📂 {post.category}</p>

                <p>📍 {post.location}</p>
              </div>

              {/* NEARBY BADGE */}
              {searchMode === "location" &&
                post.location
                  ?.toLowerCase()

                  .includes(search.toLowerCase()) && (
                  <span className="nearby-badge">📍 Nearby</span>
                )}

              {/* USER */}
              <div className="user-row">
                <div className="avatar">{post.user?.name?.charAt(0)}</div>

                <div>
                  <p
                    className="user clickable-user"
                    onClick={() => openProfile(post.user)}
                  >
                    {post.user?.name}
                  </p>

                  <small>Community Member</small>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="actions">
                <button className="message-btn">💬</button>

                <button className="report-btn" onClick={() => openReport(post)}>
                  🚩
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(post._id)}
                >
                  🗑
                </button>

                <button
                  className="favorite-btn"
                  onClick={() => toggleFavorite(post._id)}
                >
                  {favorites.includes(post._id) ? "❤️" : "🤍"}
                </button>

                <select
                  className="status-select"
                  value={post.status || "open"}
                  onChange={(e) => updatePostStatus(post._id, e.target.value)}
                >
                  <option value="open">Open</option>

                  <option value="progress">In Progress</option>

                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {/* COMMENTS */}
              <div className="comments-section">
                {/* TITLE */}
                <h4>💬 Comments ({post.comments?.length || 0})</h4>

                {/* INPUT */}
                <div className="comment-input-box">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInput[post._id] || ""}
                    onChange={(e) =>
                      setCommentInput({
                        ...commentInput,

                        [post._id]: e.target.value,
                      })
                    }
                  />

                  <button onClick={() => addComment(post._id)}>Post</button>
                </div>

                {/* COMMENT LIST */}
                <div className="comment-list">
                  {post.comments?.map((comment, index) => (
                    <div key={index} className="comment">
                      <strong>{comment.user?.name}</strong>

                      <p>{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h2>😢 No posts found</h2>

            <p>Try different keywords or filters.</p>
          </div>
        )}
      </div>

      {/* REPORT MODAL */}
      {showReport && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h2>🚩 Report Post</h2>

            <textarea
              placeholder="Why are you reporting this post?"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />

            <div className="report-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowReport(false)}
              >
                Cancel
              </button>

              <button className="submit-btn" onClick={submitReport}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {/* IMAGE MODAL */}

      {activeImage && (
        <div
          className="image-modal-overlay"
          onClick={() => setActiveImage(null)}
        >
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-image-btn"
              onClick={() => setActiveImage(null)}
            >
              ✖
            </button>

            <img src={activeImage} alt="preview" className="fullscreen-image" />
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}

      {showProfile && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            {/* CLOSE */}
            <button
              className="close-profile-btn"
              onClick={() => setShowProfile(false)}
            >
              ✖
            </button>

            {/* AVATAR */}
            <div className="profile-avatar">{selectedUser.name?.charAt(0)}</div>

            {/* NAME */}
            <h2>{selectedUser.name}</h2>

            {/* EMAIL */}
            <p className="profile-email">{selectedUser.email}</p>

            {/* STATS */}
            <div className="profile-stats">
              <div>
                <h3>
                  {posts.filter((p) => p.user?._id === selectedUser._id).length}
                </h3>

                <p>Posts</p>
              </div>

              <div>
                <h3>
                  {
                    posts.filter(
                      (p) =>
                        p.user?._id === selectedUser._id && p.type === "need",
                    ).length
                  }
                </h3>

                <p>Needs</p>
              </div>

              <div>
                <h3>
                  {
                    posts.filter(
                      (p) =>
                        p.user?._id === selectedUser._id && p.type === "offer",
                    ).length
                  }
                </h3>

                <p>Offers</p>
              </div>
            </div>

            {/* JOINED */}
            <div className="joined-box">🌍 Community Member</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
