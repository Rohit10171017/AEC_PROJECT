const Report =
  require("../models/Report");

/* CREATE REPORT */
exports.createReport =
  async (req, res) => {

    try {

      const report =
        await Report.create({

          post:
            req.body.postId,

          reportedBy:
            req.user._id,

          reason:
            req.body.reason

        });

      res.status(201).json({

        message:
          "Report submitted",

        report
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }

};