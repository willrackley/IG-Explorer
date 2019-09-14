const router = require("express").Router();
const influencersRoutes = require("./influencers");
const scrapeRoutes = require("./scrape");
const userRoutes = require("./users");

// routes
router.use("/influencers", influencersRoutes);
router.use("/scrape", scrapeRoutes);
router.use("/users", userRoutes)
module.exports = router;
