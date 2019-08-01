const router = require("express").Router();
const postRoutes = require("./posts");
const scrapeRoutes = require("./scrape");

// routes
router.use("/posts", postRoutes);
router.use("/scrape", scrapeRoutes);
module.exports = router;
