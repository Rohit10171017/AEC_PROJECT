const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const adminOnly = require("../middleware/adminMiddleware");

const Report = require("../models/Report");

const User = require("../models/User");

const Post =
  require("../models/Post");


/* GET ALL REPORTS */
router.get(
  "/reports",

  protect,

  adminOnly,

  async (req, res) => {
    try {
      const reports = await Report.find()

        .populate("post")

        .populate("reportedBy", "name email");

      res.json(reports);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
);

/* BAN USER */
router.put(
  "/ban/:id",

  protect,

  adminOnly,

  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.isBanned = true;

      await user.save();

      res.json({
        message: "User banned successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
);

/* GET ALL USERS */
router.get(

  "/users",

  protect,

  adminOnly,

  async (req, res) => {

    try {

      const users =
        await User.find()
        .select("-password");

      res.json(users);

    } catch (error) {

      res.status(500).json({

        message:
          error.message

      });

    }

  }

);

/* ADMIN STATS */
router.get(

  "/stats",

  protect,

  adminOnly,

  async (req, res) => {

    try {

      const totalUsers =
        await User.countDocuments();

      const totalPosts =
        await Post.countDocuments();

      const totalReports =
        await Report.countDocuments();

      const bannedUsers =
        await User.countDocuments({
          isBanned: true
        });

      res.json({

        totalUsers,

        totalPosts,

        totalReports,

        bannedUsers

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message

      });

    }

  }

);

module.exports = router;
