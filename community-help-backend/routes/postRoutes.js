const express = require("express");
const router = express.Router();

const {
  createPost,
  getPosts,
  deletePost,
  updateStatus,
  addComment,
} = require("../controllers/postController");
const protect = require("../middleware/authMiddleware");

// Create post (protected)
router.post("/", protect, createPost);

// Get all posts (public)
router.get("/", getPosts);

// Delete post (only owner)
router.delete("/:id", protect, deletePost);

router.put("/status/:id", protect, updateStatus);

router.post("/comment/:id", protect, addComment);

module.exports = router;
