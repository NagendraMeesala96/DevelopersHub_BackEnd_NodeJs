const mongoose = require("mongoose");

const user = new mongoose.Schema({
  userType : {
    type:String,
    default:"Employee"
  },
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
  Skills: {
    type: String,
    required: true,
  },
  ProfilePic: {
    type: String,
    default:
      "https://png.pngtree.com/png-clipart/20200225/original/pngtree-young-service-boy-vector-download-user-icon-vector-avatar-png-image_5257569.jpg",
  },
  JobRole: {
    type: String,
    default: "Freelancer",
  },
  Address: {
    type: String,
    default: "",
  },
  ratings: {
    type: Array,
  },
  OverAllRating: {
    type: Number,
    default: 0
  },
  Projects: {
    type: String,
    default: "",
  },
  Education: {
    Graduation: {
      CollegeName1: {
        type: String,
        default: "",
      },
      Percentage1: {
        type: String,
        default: "",
      },
    },
    Secondary: {
      CollegeName2: {
        type: String,
        default: "",
      },
      Percentage2: {
        type: String,
        default: "",
      },
    },
    School: {
      SchoolName: {
        type: String,
        default: "",
      },
      Percentage3: {
        type: String,
        default: "",
      },
    },
  },

  SocialMedia: {
    Facebook: {
      type: String,
      default: "null",
    },
    Instagram: {
      type: String,
      default: "null",
    },
    GitHub: {
      type: String,
      default: "null",
    },
    LinkedIn: {
      type: String,
      default: "null",
    },
    Website: {
      type: String,
      default: "null",
    },
    Twitter: {
      type: String,
      default: "null",
    },
  },
  TrainingDetails: {
    TrainingProgram: {
      type: String,
      default: "",
    },
    Organization: {
      type: String,
      default: "",
    },
    Location: {
      type: String,
      default: "",
    },
    StartDate: {
      type: Date,
      default: "",
    },
    EndDate: {
      type: Date,
      default: "",
    },
    Description: {
      type: String,
      default: "",
    },
  },
});

module.exports = mongoose.model("users", user);
