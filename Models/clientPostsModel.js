const mongoose = require("mongoose");

const clientPosts = new mongoose.Schema({
  OwnerDetails: {
    ClientName: { type: String, required: true },
    ClientNum: { type: String, required: true },
    ClientEmail: { type: String, required: true },
    ClientProfilePic: { type: String, required: true },
  },
  PostTitle: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  BidPrice: {
    type: String,
    required: true,
  },
  RequiredSkills: {
    type: String,
    required: true,
  },
  PostDate: {
    type: Date,
    default: new Date(),
  },
  PostExpiryDate: {
    type: Date,
    default: new Date(),
  },
  TotalBids: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("clientPosts", clientPosts);
