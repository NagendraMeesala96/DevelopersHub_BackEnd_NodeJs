const mongoose = require("mongoose");

const PostBid = new mongoose.Schema({
  PostId: {
    type: String,
    required: true,
  },
  UserDetails: {
    UserId: {
      type: String,
      required: true,
    },
    UserProfile:{
        type: String,
      required: true,
    },
    UserName: {
      type: String,
      required: true,
    },
    UserJobRole:{
        type:String,
        required:true
    },
    UserNum:{
        type:String,
        required:true
    },
    UserMail:{
        type:String,
        required:true
    },
    UserRating:{
      type:Number,
      required:true
    }
  },
  BidPrice: {
    type: Number,
    required: true,
  },
  Proposal: {
    type: String,
    required: true,
  },
  NoOfDaysDelivery: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("PostBid", PostBid);
