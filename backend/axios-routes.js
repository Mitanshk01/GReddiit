const express = require("express");
const Router = express.Router();
const User = require("./schemas/userSchema.js");
const SubGreddiit = require("./schemas/subGredditSchema");
const Post = require("./schemas/postSchema");
const jwt = require("jsonwebtoken");
const jwt_secret = "ahasjdlksdodlkewisowskjdsjlidoiw";
const bcrypt = require("bcryptjs");
const Report = require("./schemas/reportSchema");
const Comments = require("./schemas/commentSchema");
const Chat = require("./schemas/chatSchema");
const Stats = require("./schemas/statSchema");
const auth = require("./middleware/auth");

const signToken = (emailId) => {
  return jwt.sign({ emailId }, jwt_secret, {
    expiresIn: "45d",
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.emailId);

  return res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

Router.route("/auth").get((req, res, next) => {
  const token = req.headers.authorization.split(":")[1];
  const decoded = jwt.verify(token, jwt_secret);
  const emId = decoded.emailId;

  try {
    User.findOne({ emailId: emId }, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Unauthenticated User!",
        });
      } else {
        return res.status(200).json({ user: data });
      }
    });
  } catch {
    return res.status(400).json({
      message: "Unauthenticated User!",
    });
  }
});

Router.route("/createuser").post((req, res, next) => {
  try {
    bcrypt.hash(req.body.passWord, 10).then((hash) => {
      const usr = req.body;
      usr.passWord = hash;
      User.create(usr, (error, data) => {
        if (error) {
          return res.status(400).json({
            message:
              "Invalid Credentials! A user already exists with same EmailId/Username",
          });
        } else {
          return res.status(200).json(data);
        }
      });
    });
  } catch {
    return res.status(400).json({
      message:
        "Invalid Credentials! A user already exists with same EmailId/Username",
    });
  }
});

Router.route("/find").post((req, res, next) => {
  let temp = {
    emailId: req.body.emailId,
  };
  try {
    User.find({ emailId: req.body.emailId }, (erro, docs) => {
      if (docs.length) {
        temp.passWord = docs[0].passWord;
        bcrypt.compare(req.body.passWord, docs[0].passWord, (err, reso) => {
          if (reso === true) {
            User.findOne(temp, (error, data) => {
              if (error) {
                return res.status(400).json({
                  message: "User Not Found! Please register",
                });
              } else {
                createSendToken(temp, 200, res);
              }
            });
          } else {
            return res.status(400).json(erro);
          }
        });
      } else {
        return res.status(400).json({
          message: "User Not Found! Please register",
        });
      }
    });
  } catch {
    return res.status(400).json({
      message: "User Not Found! Please register",
    });
  }
});

Router.use(auth);

Router.route("/updateprofile").post((req, res, next) => {
  const query = { emailId: req.body.emailId };
  const updated_val = req.body;

  try {
    User.findOneAndUpdate(query, updated_val, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error Updating! Try Again!",
        });
      } else {
        return res.status(200).json("Update Successful");
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error Updating! Try Again!",
    });
  }
});

Router.route("/createsubgreddit").post((req, res, next) => {
  try {
    SubGreddiit.create(req.body, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "SubGreddit with same name exists!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "SubGreddit with same name exists!",
    });
  }
});

Router.route("/updatestatsjoins").post((req, res, next) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const query = {
    dataDate: formattedDate,
    subGId: req.body._id,
  };

  try {
    Stats.findOne(query, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error while updating stats!",
        });
      } else {
        if (Boolean(data)) {
          Stats.updateOne(
            query,
            {
              noJoins: req.body.noJoins + 1,
            },
            (err, da) => {
              if (error) {
                return res.status(400).json({
                  message: "Error while updating stats!",
                });
              } else {
                return res.status(200).json(da);
              }
            }
          );
        } else {
          const createVal = {
            subGId: req.body._id,
            dataDate: formattedDate,
            noJoins: req.body.noJoins + 1,
            noPosts: 0,
            noDeletedReports: 0,
            noReports: 0,
            noVisitors: 0,
          };
          Stats.create(createVal, (error, data) => {
            if (error) {
              return res.status(400).json({
                message: "Error while updating stats!",
              });
            } else {
              return res.status(200).json(data);
            }
          });
        }
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error while updating stats!",
    });
  }
});

Router.route("/updatestatsdelete").post((req, res, next) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const query = {
    dataDate: formattedDate,
    subGId: req.body._id,
  };

  try {
    Stats.findOne(query, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error while updating stats!",
        });
      } else {
        if (Boolean(data)) {
          Stats.updateOne(
            query,
            {
              noDeletedReports: data.noDeletedReports + 1,
            },
            (err, da) => {
              if (error) {
                return res.status(400).json({
                  message: "Error while updating stats!",
                });
              } else {
                return res.status(200).json(da);
              }
            }
          );
        } else {
          const createVal = {
            subGId: req.body._id,
            dataDate: formattedDate,
            noJoins: 0,
            noPosts: 0,
            noDeletedReports: 1,
            noReports: 0,
            noVisitors: 0,
          };
          Stats.create(createVal, (error, data) => {
            if (error) {
              return res.status(400).json({
                message: "Error while updating stats!",
              });
            } else {
              return res.status(200).json(data);
            }
          });
        }
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error while updating stats!",
    });
  }
});

Router.route("/updatestatsreport").post((req, res, next) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const query = {
    dataDate: formattedDate,
    subGId: req.body._id,
  };

  try {
    Stats.findOne(query, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error while updating stats!",
        });
      } else {
        if (Boolean(data)) {
          Stats.updateOne(
            query,
            {
              noReports: data.noReports + 1,
            },
            (err, da) => {
              if (error) {
                return res.status(400).json({
                  message: "Error while updating stats!",
                });
              } else {
                return res.status(200).json(da);
              }
            }
          );
        } else {
          const createVal = {
            subGId: req.body._id,
            dataDate: formattedDate,
            noJoins: 0,
            noPosts: 0,
            noDeletedReports: 0,
            noReports: 1,
            noVisitors: 0,
          };
          Stats.create(createVal, (error, data) => {
            if (error) {
              return res.status(400).json({
                message: "Error while updating stats!",
              });
            } else {
              return res.status(200).json(data);
            }
          });
        }
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error while updating stats!",
    });
  }
});

Router.route("/updatestatsposts").post((req, res, next) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const query = {
    dataDate: formattedDate,
    subGId: req.body._id,
  };

  try {
    Stats.findOne(query, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error while updating stats!",
        });
      } else {
        if (Boolean(data)) {
          Stats.updateOne(
            query,
            {
              noPosts: data.noPosts + 1,
            },
            (err, da) => {
              if (error) {
                return res.status(400).json({
                  message: "Error while updating stats!",
                });
              } else {
                return res.status(200).json(da);
              }
            }
          );
        } else {
          const createVal = {
            dataDate: formattedDate,
            noPosts: 1,
            noJoins: 0,
            noVisitors: 0,
            noDeletedReports: 0,
            noReports: 0,
            subGId: req.body._id,
          };
          Stats.create(createVal, (error, data) => {
            if (error) {
              return res.status(400).json({
                message: "Error while updating stats!",
              });
            } else {
              return res.status(200).json(data);
            }
          });
        }
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error while updating stats!",
    });
  }
});

Router.route("/getstats").post((req, res, next) => {
  try {
    Stats.find(
      {
        subGId: req.body._id,
      },
      (error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Try Again!",
          });
        } else {
          return res.status(200).json(data);
        }
      }
    );
  } catch {
    return res.status(400).json({
      message: "Try Again!",
    });
  }
});

Router.route("/updatestatsvisitors").post((req, res, next) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const query = {
    dataDate: formattedDate,
    subGId: req.body._id,
  };

  try {
    Stats.findOne(query, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error while updating stats!",
        });
      } else {
        if (Boolean(data)) {
          Stats.updateOne(
            query,
            {
              noVisitors: data.noVisitors + 1,
            },
            (err, da) => {
              if (error) {
                return res.status(400).json({
                  message: "Error while updating stats!",
                });
              } else {
                return res.status(200).json(da);
              }
            }
          );
        } else {
          const createVal = {
            dataDate: formattedDate,
            noPosts: 0,
            noJoins: 0,
            noVisitors: 1,
            noDeletedReports: 0,
            noReports: 0,
            subGId: req.body._id,
          };
          Stats.create(createVal, (error, data) => {
            if (error) {
              return res.status(400).json({
                message: "Error while updating stats!",
              });
            } else {
              return res.status(200).json(data);
            }
          });
        }
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error while updating stats!",
    });
  }
});

Router.route("/findmysubgreddit").post((req, res, next) => {
  const query = { moderators: { $in: [req.body.emailId] } };

  try {
    SubGreddiit.find(query, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error while finding Subgreddits! Try again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error while finding Subgreddits! Try again!",
    });
  }
});

Router.route("/finduserssubgreddit").post((req, res, next) => {
  const query = { name: req.body.pageName };

  try {
    SubGreddiit.find(query, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error while finding Subgreddits! Try again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error while finding Subgreddits! Try again!",
    });
  }
});

Router.route("/deletemysubgreddit").post((req, res, next) => {
  const query = { name: req.body.name };

  try {
    SubGreddiit.findOneAndDelete(query, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error Deleting Subgreddits! Try again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(200).json(data);
  }
});

Router.route("/deletestats").post((req, res, next) => {
  const query = { subGId: req.body._id };
  try {
    Stats.deleteMany(query, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error Deleting Subgreddits! Try again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error Deleting Subgreddits! Try again!",
    });
  }
});

Router.route("/handlejoin").post((req, res, next) => {
  const query = { name: req.body.pageName };

  let updated_val;
  if (req.body.members !== "")
    updated_val = {
      $push: { members: req.body.members },
      $pull: { joinrequests: req.body.joinRequests },
    };
  else {
    updated_val = {
      $pull: { joinrequests: req.body.joinRequests },
    };
  }

  try {
    SubGreddiit.findOneAndUpdate(query, updated_val, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error Joining Subgreddits! Try again!",
        });
      } else {
        return res.status(200).json("Update Successful");
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error Joining Subgreddits! Try again!",
    });
  }
});

Router.route("/findmysub").post((req, res, next) => {
  try {
    SubGreddiit.find({ name: req.body.pageName }, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error Loading Subgreddiits! Try again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error Loading Subgreddiits! Try again!",
    });
  }
});

Router.route("/findothersub").post((req, res, next) => {
  const query = { members: { $ne: req.body.emailId } };
  try {
    SubGreddiit.find(query, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error Loading Subgreddiits! Try again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error Loading Subgreddiits! Try again!",
    });
  }
});

Router.route("/allcomments").post((req, res, next) => {
  try {
    Comments.find(req.body, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error Loading Comments! Try again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error Loading Comments! Try again!",
    });
  }
});

Router.route("/addcomments").post((req, res, next) => {
  try {
    Comments.create(req.body, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error Commenting! Try again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error Commenting! Try again!",
    });
  }
});

Router.route("/pushcomments").post((req, res, next) => {
  const query = { $push: { subCommentsId: req.body.subComId } };

  try {
    Comments.updateOne({ _id: req.body._id }, query, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error Commenting! Try again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error Commenting! Try again!",
    });
  }
});

Router.route("/deletefollowers").post((req, res, next) => {
  const updated_val = {
    $pull: { members: req.body.emailId },
    $push: { leftMembers: req.body.emailId },
  };
  try {
    SubGreddiit.updateOne(
      { name: req.body.name },
      updated_val,
      (error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Error Removing Follower! Try again!",
          });
        } else {
          return res.status(200).json(data);
        }
      }
    );
  } catch {
    return res.status(400).json({
      message: "Error Removing Follower! Try again!",
    });
  }
});

Router.route("/findallsub").post((req, res, next) => {
  try {
    SubGreddiit.find({}, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error Finding Subgreddits! Try Again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error Finding Subgreddits! Try Again!",
    });
  }
});

Router.route("/searchbytag").post((req, res, next) => {
  const query = { tags: { $in: req.body.allTags } };
  try {
    SubGreddiit.find(query, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error Finding Subgreddits by Tag! Try Again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error Finding Subgreddits by Tag! Try Again!",
    });
  }
});

Router.route("/joinsub").post((req, res, next) => {
  const updated_val = { $push: { joinrequests: req.body.emailId } };

  try {
    SubGreddiit.updateOne(
      { name: req.body.name },
      updated_val,
      (error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Error Joining Subgreddit! Try Again!",
          });
        } else {
          return res.status(200).json(data);
        }
      }
    );
  } catch {
    return res.status(400).json({
      message: "Error Joining Subgreddit! Try Again!",
    });
  }
});

Router.route("/createpost").post((req, res, next) => {
  try {
    Post.create(req.body, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error Posting! Try Again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error Posting! Try Again!",
    });
  }
});

Router.route("/subpost").post((req, res, next) => {
  try {
    SubGreddiit.findOneAndUpdate(
      { _id: req.body._id },
      { noPosts: req.body.noPosts },
      (error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Error! Try Again!",
          });
        } else {
          return res.status(200).json(data);
        }
      }
    );
  } catch {
    return res.status(400).json({
      message: "Error! Try Again!",
    });
  }
});

Router.route("/getpost").post((req, res, next) => {
  try {
    Post.find({ pageName: req.body.name }, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error Loading! Try Again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error Loading! Try Again!",
    });
  }
});

Router.route("/deletepost").post((req, res, next) => {
  try {
    Post.deleteOne({ _id: req.body._id }, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error deleting! Try Again!",
        });
      } else {
        console.log(data);
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error deleting! Try Again!",
    });
  }
});

Router.route("/deletecomments").post((req, res, next) => {
  try {
    Comments.deleteMany(req.body, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error Deleting! Try Again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error Deleting! Try Again!",
    });
  }
});

Router.route("/deletepostbysub").post((req, res, next) => {
  try {
    Post.deleteMany({ postedId: req.body.postedId }, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error Deleting! Try Again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error Deleting! Try Again!",
    });
  }
});

Router.route("/createreport").post((req, res, next) => {
  try {
    Report.create(req.body, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error reporting! Try Again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error reporting! Try Again!",
    });
  }
});

Router.route("/getreports").post((req, res, next) => {
  try {
    Report.find(
      {
        reportedSubGId: req.body._id,
      },
      (error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Error Loading! Try Again!",
          });
        } else {
          return res.status(200).json(data);
        }
      }
    );
  } catch {
    return res.status(400).json({
      message: "Error Loading! Try Again!",
    });
  }
});

Router.route("/deletereport").post((req, res, next) => {
  try {
    Report.deleteOne({ _id: req.body._id }, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error deleting! Try Again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error deleting! Try Again!",
    });
  }
});

Router.route("/deletereportbysub").post((req, res, next) => {
  try {
    Report.deleteMany({ reportedSubGId: req.body._id }, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error deleting! Try Again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error deleting! Try Again!",
    });
  }
});

Router.route("/updatereport").post((req, res, next) => {
  try {
    Report.updateOne(
      { _id: req.body._id },
      { reportOutcome: req.body.reportOutcome },
      (error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Error updating report! Try Again!",
          });
        } else {
          return res.status(200).json(data);
        }
      }
    );
  } catch {
    return res.status(400).json({
      message: "Error updating report! Try Again!",
    });
  }
});

Router.route("/adduserfollowing").post((req, res, next) => {
  const updated_val = {
    $push: { following: req.body.followerName },
  };

  try {
    User.updateOne(
      { emailId: req.body.emailId },
      updated_val,
      (error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Error in following! Try Again!",
          });
        } else {
          return res.status(200).json(data);
        }
      }
    );
  } catch {
    return res.status(400).json({
      message: "Error in following! Try Again!",
    });
  }
});

Router.route("/adduserfollower").post((req, res, next) => {
  const updated_val = {
    $push: { followers: req.body.emailId },
  };

  try {
    User.updateOne(
      { emailId: req.body.followerName },
      updated_val,
      (error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Error in following! Try Again!",
          });
        } else {
          return res.status(200).json(data);
        }
      }
    );
  } catch {
    return res.status(400).json({
      message: "Error in following! Try Again!",
    });
  }
});

Router.route("/deleteuserfollowing").post((req, res, next) => {
  const updated_val = {
    $pull: { following: req.body.followerName },
  };

  try {
    User.updateOne(
      { emailId: req.body.emailId },
      updated_val,
      (error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Error in removing follower! Try Again!",
          });
        } else {
          return res.status(200).json(data);
        }
      }
    );
  } catch {
    return res.status(400).json({
      message: "Error in removing follower! Try Again!",
    });
  }
});

Router.route("/findchat").post((req, res, next) => {
  const query = {
    chatBetween: { $all: req.body.chatBetween },
  };

  try {
    Chat.findOne(query, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error! Try Again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error! Try Again!",
    });
  }
});

Router.route("/createchat").post((req, res, next) => {
  try {
    Chat.create(req.body, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error! Try Again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error! Try Again!",
    });
  }
});

Router.route("/updatechat").post((req, res, next) => {
  const query = {
    $push: { chatText: req.body.chatText },
  };

  try {
    Chat.findOneAndUpdate(
      {
        chatBetween: { $all: req.body.chatBetween },
      },
      query,
      (error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Error! Try Again!",
          });
        } else {
          return res.status(200).json(data);
        }
      }
    );
  } catch {
    return res.status(400).json({
      message: "Error! Try Again!",
    });
  }
});

Router.route("/blockusersubg").post((req, res, next) => {
  const updated_val = {
    $push: { blockedMembers: req.body.name },
    $pull: { members: req.body.name },
  };

  try {
    SubGreddiit.updateOne({ _id: req.body._id }, updated_val, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error in blocking user! Try Again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error in blocking user! Try Again!",
    });
  }
});

Router.route("/blockuserpost").post((req, res, next) => {
  const updated_val = { postedBy: "Blocked User" };

  try {
    Post.updateMany({ postedBy: req.body.name }, updated_val, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error in blocking! Try Again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error in blocking! Try Again!",
    });
  }
});

Router.route("/deleteuserfollower").post((req, res, next) => {
  const updated_val = {
    $pull: { followers: req.body.emailId },
  };

  try {
    User.updateOne(
      { emailId: req.body.followerName },
      updated_val,
      (error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Error in removing follower! Try Again!",
          });
        } else {
          return res.status(200).json(data);
        }
      }
    );
  } catch {
    return res.status(400).json({
      message: "Error in removing follower! Try Again!",
    });
  }
});

Router.route("/updatevote").post((req, res, next) => {
  const updated_val = { voteType: req.body.voteState };

  try {
    Post.updateOne({ _id: req.body.postId }, updated_val, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error in updating vote! Try Again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error in updating vote! Try Again!",
    });
  }
});

Router.route("/savepost").post((req, res, next) => {
  const updated_val = { $push: { savedBy: req.body.emailId } };

  try {
    Post.findOneAndUpdate(
      { _id: req.body.postId },
      updated_val,
      (error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Error in saving post! Try Again!",
          });
        } else {
          return res.status(200).json(data);
        }
      }
    );
  } catch {
    return res.status(400).json({
      message: "Error in saving post! Try Again!",
    });
  }
});

Router.route("/unsavepost").post((req, res, next) => {
  const updated_val = { $pull: { savedBy: req.body.emailId } };

  try {
    Post.updateOne({ _id: req.body.postId }, updated_val, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error in unsaving post! Try Again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error in unsaving post! Try Again!",
    });
  }
});

Router.route("/getsavedposts").post((req, res, next) => {
  const query = { savedBy: { $in: [req.body.emailId] } };

  try {
    Post.find(query, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error! Try Again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error! Try Again!",
    });
  }
});

Router.route("/getsavedsubg").post((req, res, next) => {
  const query = { _id: req.body._id };

  try {
    SubGreddiit.find(query, (error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Error! Try Again!",
        });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch {
    return res.status(400).json({
      message: "Error! Try Again!",
    });
  }
});

module.exports = Router;
