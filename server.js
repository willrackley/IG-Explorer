const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
//const Book = require("./models/Book.js");
const PORT = process.env.PORT || 4000;

// Connect to the Mongo DB
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/igExplorer";
// mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
// Add routes, both API and view
app.use(routes);

//routes
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/scrape", require("./routes/api/scrape"));


// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
