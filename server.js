const express = require("express");
const mongoose = require("mongoose");
const user = require("./Models/userModel.js");
const client = require("./Models/clientModel");
const clientPost = require("./Models/clientPostsModel");
const jwt = require("jsonwebtoken");
const middleware = require("./Models/middleware.js");
const review = require("./Models/ReviewModel.js");
const cors = require("cors");
const PostBid = require("./Models/PostBid");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const PORT = process.env.PORT || 3000;

const mongooseURL = `mongodb+srv://Nagendra9573:Nagendra9573@cluster0.j08ql.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(mongooseURL, (req, res) => {
  console.log("DB Connected......");
});

//Server Home Page
app.get("/", (req, res) => {
  res.send("Welcome To Server..");
});

//Register Users
app.post("/register", async (req, res) => {
  try {
    const { FullName, Email, Password, Mobile, Skills, ProfilePic } = req.body;

    const existUser = await user.findOne({ Email });

    if (existUser) {
      return res.status(400).json({
        status:"User Already Registered",
        data:existUser
      });
    }

    let newUser = new user({
      FullName,
      Email,
      Password,
      Mobile,
      Skills,
      ProfilePic,
    });

    await newUser.save();

    return res.status(200).json({
      status: "User Registered Successfully",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      status:"Server Error",
      data:error
    })
  }
});
//Delete Employee by ID
app.delete("/employee/:id", async (req, res) => {
  try {
    await user.findByIdAndDelete(req.params.id);

    console.log("User Deleted");

    return res.json(await user.find());
  } catch (err) {
    console.log(err.message);
  }
});
//Delete Client by ID
app.delete("/client/:id", async (req, res) => {
  try {
    await client.findByIdAndDelete(req.params.id);

    console.log("Client Deleted");

    return res.json(await client.find());
  } catch (err) {
    console.log(err.message);
  }
});
//Login Users
app.post("/login", async (req, res) => {
  try {
    const { UserType, Email, Password } = req.body;

    const exist = await user.findOne({ Email });

    if (!exist) {
      return res.status(400).send("User Not Exist");
    }

    if (exist.Password != Password) {
      return res.status(400).send("Password Wrong");
    }

    let payload = {
      users: {
        id: exist.id,
      },
    };

    jwt.sign(payload, "jwtPassword", { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

app.post("/Admin/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const exist = await client.findOne({ Email });

    if (!exist) {
      return res.status(400).send("User Not Exist");
    }

    if (exist.Password != Password) {
      return res.status(400).send("Password Wrong");
    }

    let payload = {
      users: {
        id: exist.id,
      },
    };

    jwt.sign(payload, "jwtPassword", { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

//Get All Employee
app.get("/allEmployees", middleware, async (req, res) => {
  try {
    let allProfiles = await user.find();

    return res.json(allProfiles);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});
//Get All Clients
app.get("/allClients", middleware, async (req, res) => {
  try {
    let allClients = await client.find();

    return res.json(allClients);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

//ClientPost
app.post("/addClientPost", middleware, async (req, res) => {
  try {
    const { PostTitle, Description, BidPrice, RequiredSkills } =
      req.body;

    let exist = await client.findById(req.users.id);
    console.log(exist); 
    let newPost = new clientPost({
      OwnerDetails: {
        ClientName: exist.FullName,
        ClientNum: exist.Mobile,
        ClientEmail: exist.Email,
        ClientProfilePic: exist.ProfilePic,
      },
      PostTitle,
      Description,
      BidPrice,
      RequiredSkills,
    });
    await newPost.save();
    return res.status(200).json({
      status:"Post Published Successfully",
      data:newPost
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});
//Get My Posts
app.get("/MyPosts", middleware, async (req, res) => {
  try {
    let allPosts = await clientPost.find();

    console.log(req.users.id.toString());

    let MyPosts = allPosts.filter(
      (post) => post.PostOwnerId.toString() === req.users.id.toString()
    );

    return res.status(200).json(MyPosts);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});
//Get All Posts
app.get("/allPosts", middleware, async (req, res) => {
  try {
    let allPosts = await clientPost.find();

    return res.json(allPosts);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});
//Delete Post by ID
app.delete("/Post/:id", async (req, res) => {
  try {
    await clientPost.findByIdAndDelete(req.params.id);

    console.log("Post Deleted");

    return res.json(await clientPost.find());
  } catch (err) {
    console.log(err.message);
  }
});
//Employee Post a bid
app.post("/PlaceBid", middleware, async (req, res) => {
  try {
    const { PostId, BidPrice, Proposal, NoOfDaysDelivery } = req.body;

    console.log(req.users.id);

    let exist = await user.findById(req.users.id);

    console.log(req.users.id);

    let newBid = new PostBid({
      PostId,
      UserDetails: {
        UserId: req.users.id,
        UserName: exist.FullName,
        UserJobRole: exist.JobRole,
        UserNum: exist.Mobile,
        UserMail: exist.Email,
        UserProfile: exist.ProfilePic,
        UserRating: exist.OverAllRating,
      },
      BidPrice,
      Proposal,
      NoOfDaysDelivery,
    });
    await newBid.save();
    return res.status(200).json({
      status: "Successfully Placed Bid",
      data: newBid,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

//All Bids
app.get("/AllBids", middleware, async (req, res) => {
  try {
    let allBids = await PostBid.find();

    return res.json(allBids);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

//Get Bids by Post ID
app.get("/PostBid/:id", middleware, async (req, res) => {
  try {
    let allPostBids = await PostBid.find();

    let postIdBid = allPostBids.filter(
      (PostBid) => PostBid.PostId.toString() === req.params.id.toString()
    );

    return res.status(200).json(postIdBid);
  } catch (error) {
    console.log(error);

    return res.status(500).send("Server Error");
  }
});
//My Bids
app.get("/MyBids", middleware, async (req, res) => {
  try {
    let allPostBids = await PostBid.find();

    let MyBids = allPostBids.filter(
      (PostBid) =>
        PostBid.UserDetails.UserId.toString() === req.users.id.toString()
    );

    return res.status(200).json(MyBids);
  } catch (error) {
    console.log(error);

    return res.status(500).send("Server Error");
  }
});
//Delete Bid by ID
app.delete("/Bid/:id", async (req, res) => {
  try {
    await PostBid.findByIdAndDelete(req.params.id);
    console.log("Bid Deleted");
    return res.json(await PostBid.find());
  } catch (err) {
    console.log(err.message);
  }
});
//check user already bid or not
app.post("/checkBid/:id", middleware, async (req, res) => {
  try {
    let allPostBids = await PostBid.find();

    let postIdBid = allPostBids.filter(
      (PostBid) => PostBid.PostId.toString() === req.params.id.toString()
    );
    let result = {
      error: "",
    };

    postIdBid.filter((PostBid) => {
      console.log(PostBid.UserDetails.UserId + "data" + req.users.id);
      if (PostBid.UserDetails.UserId.toString() === req.users.id.toString()) {
        result.error = "Yes";
      }
    });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    return res.status(500).send("Server Error");
  }
});
//Get Post by Bid
app.get("/GetPost/:id", middleware, async (req, res) => {
  try {
    let allPosts = await clientPost.find();
    let post = allPosts.filter(
      (Post) => Post._id.toString() === req.params.id.toString()
    );
    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});
//Update bids
app.put("/UpdateBid/:id", async (req, res) => {
  try {
    let allPosts = await clientPost.find();
    let post = allPosts.filter(
      (Post) => Post._id.toString() === req.params.id.toString()
    );

    let count = post[0].TotalBids;
    clientPost.findByIdAndUpdate(
      req.params.id,
      { TotalBids: count + 1 },
      (err, docs) => {
        if (err) {
          console.log(err);
        }
      }
    );

    console.log("Update Request");
    return res.json(await clientPost.find());
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

//Get My Profile
app.post("/myProfile", middleware, async (req, res) => {
  const { UserType } = req.body;

  try {
    let userData = await user.findById(req.users.id);
    return res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

//Add Review
app.post("/addReview", middleware, async (req, res) => {
  try {
    const { taskProvider, taskWorker, rating, reviewContent } = req.body;

    const exist = await client.findById(req.users.id);

    const newReview = new review({
      taskProvider: exist.FullName,
      taskWorker,
      rating,
      reviewContent,
    });
    newReview.save();
    return res.status(200).send("Submitted Review");
  } catch (error) {
    console.log(error);

    return res.status(500).send("Server Error");
  }
});

//GET MY REVIEWs
app.get("/myReview", middleware, async (req, res) => {
  try {
    let allReviews = await review.find();

    let myReviews = allReviews.filter(
      (review) => review.taskWorker.toString() === req.users.id.toString()
    );

    return res.status(200).json(myReviews);
  } catch (error) {
    console.log(error);

    return res.status(500).send("Server Error");
  }
});

//Get Profile By ID
app.get("/UserProfile/:id", async (req, res) => {
  try {
    const data = await user.findById(req.params.id);

    return res.json(data);
  } catch (error) {
    console.log(error);

    return res.status(500).send("Server Error");
  }
});

//Get Ratings By ID
app.get("/UserProfile/Ratings/:id", async (req, res) => {
  try {
    const data = await review.find();

    let matchData = data.filter((da) => {
      if (da.taskWorker === req.params.id) {
        return da;
      }
    });

    return res.json(matchData);
  } catch (error) {
    console.log(error);

    return res.status(500).send("Server Error");
  }
});
//Delete Review
app.delete("/DeleteReview/:id", async (req, res) => {
  try {
    await review.findByIdAndDelete(req.params.id);
    console.log("Review Deleted");
    return res.json(await review.find());
  } catch (err) {
    console.log(err.message);
  }
});
//All Reviews
app.get("/AllReviews", middleware, async (req, res) => {
  try {
    let allReviews = await review.find();
    return res.json(allReviews);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});
//Check Bid
app.post("/checkBid/:id", middleware, async (req, res) => {
  try {
    let allPostBids = await PostBid.find();

    let postIdBid = allPostBids.filter(
      (PostBid) => PostBid.PostId.toString() === req.params.id.toString()
    );
    let result = {
      error: "",
    };

    postIdBid.filter((PostBid) => {
      console.log(PostBid.UserDetails.UserId + "data" + req.users.id);
      if (PostBid.UserDetails.UserId.toString() === req.users.id.toString()) {
        result.error = "Yes";
      }
    });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    return res.status(500).send("Server Error");
  }
});
//Get Post by Bid
app.get("/GetPost/:id", middleware, async (req, res) => {
  try {
    let allPosts = await clientPost.find();
    let post = allPosts.filter(
      (Post) => Post._id.toString() === req.params.id.toString()
    );
    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});
//Update Rating
app.put("/UpdateRating/:id", async (req, res) => {
  const { userComment, userRating } = req.body;
  try {
    user.findByIdAndUpdate(
      req.params.id,
      { $push: { ratings: Number(userRating) } },
      (err, docs) => {
        if (err) {
          console.log(err);
        }
      }
    );

    // let allBids = allBids.find();

    // let data = allPosts.filter(
    //   (Post) => Post._id.toString() === req.params.id.toString()
    // );

    return res.status(200).json({
      status: "Updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});
//Rating Calculations
app.put("/RatingCalculation/:id", async (req, res) => {
  const { userComment, userRating } = req.body;

  try {
    const data = await user.findById(req.params.id);

    var stars = data.ratings,
      count = 0,
      sum = 0;

    stars.forEach(function (value, index) {
      count += value;
      sum += value * (index + 1);
    });

    let rating = sum / count;

    rating = Math.floor(rating);

    user.findByIdAndUpdate(
      req.params.id,
      { OverAllRating: rating },
      (err, docs) => {
        if (err) {
          console.log(err);
        }
      }
    );
    return res.status(200).json({
      status: "Updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});
//Update social Media
app.put("/UpdateSocialMedia/", middleware, async (req, res) => {
  const { Facebook, Instagram, GitHub, LinkedIn, Website, Twitter } = req.body;

  try {
    user.findByIdAndUpdate(
      req.users.id,
      {
        SocialMedia: {
          Facebook,
          Instagram,
          GitHub,
          LinkedIn,
          Website,
          Twitter,
        },
      },
      (err, docs) => {
        if (err) {
          console.log(err);
        }
      }
    );

    let userData = await user.findById(req.users.id);
    return res.status(200).json({
      status: "Updated",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

//Update social Media
app.put("/UpdatePersonalDetails/", middleware, async (req, res) => {
  const { FullName, JobRole, Mobile, Skills, Address, Projects } = req.body;

  try {
    user.findByIdAndUpdate(
      req.users.id,
      {
        FullName,
        JobRole,
        Mobile,
        Skills,
        Address,
        Projects,
      },
      (err, docs) => {
        if (err) {
          console.log(err);
        }
      }
    );

    let userData = await user.findById(req.users.id);
    return res.status(200).json({
      status: "Educational Details Updated",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

//Update Education
app.put("/UpdateEducation/", middleware, async (req, res) => {
  const {
    CollegeName1,
    Percentage1,
    CollegeName2,
    Percentage2,
    SchoolName,
    Percentage3,
  } = req.body;
  console.log(Percentage2);
  try {
    user.findByIdAndUpdate(
      req.users.id,
      {
        Education: {
          Graduation: { CollegeName1, Percentage1 },
          Secondary: { CollegeName2, Percentage2 },
          School: { SchoolName, Percentage3 },
        },
      },
      (err, docs) => {
        if (err) {
          console.log(err);
        }
      }
    );

    let userData = await user.findById(req.users.id);
    return res.status(200).json({
      status: "Personal Details Updated",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

//Update Img

app.put("/UpdateImg/", middleware, async (req, res) => {
  const { ProfilePic } = req.body;

  try {
    user.findByIdAndUpdate(
      req.users.id,
      {
        ProfilePic,
      },
      (err, docs) => {
        if (err) {
          console.log(err);
        }
      }
    );

    let userData = await user.findById(req.users.id);
    return res.status(200).json({
      status: "ProfilePic Updated",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server Started At http://localhost:${PORT}/`);
});
