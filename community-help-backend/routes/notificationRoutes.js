const express =
  require("express");

const router =
  express.Router();

const protect =
  require("../middleware/authMiddleware");

const Notification =
  require("../models/Notification");

/* GET MY NOTIFICATIONS */
router.get(

  "/",

  protect,

  async (req, res) => {

    try {

      const notifications =
        await Notification.find({

          user: req.user._id

        })

        .sort({
          createdAt: -1
        });

      res.json(notifications);

    } catch (error) {

      res.status(500).json({

        message:
          error.message

      });

    }

  }

);

module.exports =
  router;