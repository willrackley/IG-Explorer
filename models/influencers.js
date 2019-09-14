const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const influencerSchema = new Schema({
  igName: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
});

const Influencer = mongoose.model("Influencer", influencerSchema);

module.exports = Influencer;