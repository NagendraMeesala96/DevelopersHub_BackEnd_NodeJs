const mongoose = require("mongoose");

const client = new mongoose.Schema({
  
  FullName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Mobile: {
    type: String,
    required: true,
  },
  ProfilePic: {
    type: String,
    default:
      "https://png.pngtree.com/png-clipart/20200225/original/pngtree-young-service-boy-vector-download-user-icon-vector-avatar-png-image_5257569.jpg",
  },
  SocialMedia: {
    Facebook: {
      type: String,
      default: null
    },
    Instagram: {
      type: String,
      default: null
    },
    GitHub: {
      type: String,
      default: null
    },
    LinkedIn: {
      type: String,
      default: null
    },
    Website: {
      type: String,
      default: null
    },
    Twitter: {
      type: String,
      default: null
    },
  },
});

module.exports = mongoose.model("client", client);
