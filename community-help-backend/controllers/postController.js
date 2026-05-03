const Post = require("../models/Post");
const Notification = require("../models/Notification");
// Create post
exports.createPost = async (req, res) => {
  try {
    const { title, description, type, category, location, image } = req.body;

    const post = await Post.create({
      title,
      description,
      type,
      category,
      location,
      image,
      user: req.user._id,
    });
    res.status(201).json({
      message: "Post created",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const { type, category } = req.query;

    let filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;

    const posts = await Post.find(filter).populate("user", "name email");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    console.log("DELETE ROUTE HIT");

    console.log("POST USER:", post.user);

    console.log("REQ USER:", req.user);
    // CHECK OWNER
    /* OWNER OR ADMIN */
    if (
      post.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await post.deleteOne();

    res.json({
      message: "Post deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* UPDATE STATUS */
exports.updateStatus = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // OWNER CHECK
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    post.status = req.body.status;

    await post.save();

    res.json({
      message: "Status updated",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ADD COMMENT */
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = {
      text: req.body.text,

      user: req.user._id,
    };

    post.comments.push(comment);
    /* CREATE NOTIFICATION */

    if (post.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: post.user,

        text: `${req.user.name} commented on your post`,
      });
    }
    await post.save();

    const updatedPost = await Post.findById(post._id)

      .populate("comments.user", "name");

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
