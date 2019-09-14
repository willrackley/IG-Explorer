const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
const passport = require('passport');

const PORT = process.env.PORT || 4000;

// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/igExplorer";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Passport
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Add routes, both API and view
app.use(routes);

//routes
app.use("/api/influencers", require("./routes/api/influencers"));
app.use("/api/scrape", require("./routes/api/scrape"));
app.use("/api/users", require("./routes/api/users"));


// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
