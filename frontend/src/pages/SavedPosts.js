import * as React from "react";
import Navbar from "../NavbarDashboard";
import axios from "axios";
import { Button } from "@mui/material";
import { Modal } from "@mui/material";
import { Backdrop, Box } from "@mui/material";
import "./AllSubGredditPage.css";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

export default function SavedPosts(props) {
  const [savedPostsData, setSavedPostsData] = React.useState([]);

  const [userFollowing, setUserFollowing] = React.useState([]);

  function handleDelete(pst, idx) {
    let newA = [];
    setUserFollowing((prev) => {
      newA = prev.filter((item, ind) => {
        return idx !== ind;
      });
      return newA;
    });
  }

  const jwt = localStorage.getItem("userTok");
  React.useEffect(() => {
    axios
      .get("http://localhost:4000/users/auth", {
        headers: { authorization: `Bearer:${jwt}` },
      })
      .then((res) => {
        setUserFollowing(res.data.user.following);
      })
      .catch((err) => {
        props.JwtState(false);
      });
  }, []);

  React.useEffect(() => {
    axios
      .post(
        "http://localhost:4000/users/getsavedposts",
        { emailId: props.emailId },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${props.jwt}`,
          },
        }
      )
      .then((res) => {
        setSavedPostsData(res.data);
      })
      .catch((error) => {
        if (error.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(error.response.data.message);
        }
      });
  });
  return (
    <div>
      <div>
        <Navbar JwtState={props.JwtState} />
      </div>
      <div style={{ paddingTop: "100px" }}>
        <div>
          {savedPostsData.map((pst, idx) => {
            return (
              <div
                className="pbox"
                style={{
                  paddingTop: "50px",
                  marginLeft: "2%",
                  paddingRight: "2%",
                }}
              >
                <Box
                  style={{
                    backgroundColor: "#f0f0f0",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "1px 2px 9px #F4AAB9",
                  }}
                >
                  <div className="postTitle">
                    <div style={{ display: "flex" }}>
                      <div style={{ width: "40%" }}>
                        <p
                          style={{
                            paddingLeft: "10px",
                            fontSize: "19px",
                          }}
                        >
                          Posted By : u/{pst.postedBy}
                        </p>
                      </div>
                      <div style={{ width: "45%" }}>
                        {!userFollowing.includes(pst.postedBy) ? (
                          <Button
                            disabled={props.emailId === pst.postedBy ? 1 : 0}
                            onClick={(event) => {
                              axios
                                .post(
                                  "http://localhost:4000/users/adduserfollowing",
                                  {
                                    emailId: props.emailId,
                                    followerName: pst.postedBy,
                                  },
                                  {
                                    headers: {
                                      "Content-Type": "application/json",
                                      authorization: `Bearer:${props.jwt}`,
                                    },
                                  }
                                )
                                .then((res) => {})
                                .catch((error) => {
                                  if (error.response.request.status == 401) {
                                    alert("Unauthorized User! Kindly Login!");
                                    props.JwtState(false);
                                  } else {
                                    alert(error.response.data.message);
                                  }
                                });
                              axios
                                .post(
                                  "http://localhost:4000/users/adduserfollower",
                                  {
                                    emailId: props.emailId,
                                    followerName: pst.postedBy,
                                  },
                                  {
                                    headers: {
                                      "Content-Type": "application/json",
                                      authorization: `Bearer:${props.jwt}`,
                                    },
                                  }
                                )
                                .then((res) => {
                                  setUserFollowing([
                                    ...userFollowing,
                                    pst.postedBy,
                                  ]);
                                })
                                .catch((error) => {
                                  if (error.response.request.status == 401) {
                                    alert("Unauthorized User! Kindly Login!");
                                    props.JwtState(false);
                                  } else {
                                    alert(error.response.data.message);
                                  }
                                });
                            }}
                          >
                            Follow
                          </Button>
                        ) : (
                          <Button
                            onClick={(event) => {
                              axios
                                .post(
                                  "http://localhost:4000/users/deleteuserfollowing",
                                  {
                                    emailId: props.emailId,
                                    followerName: pst.postedBy,
                                  },
                                  {
                                    headers: {
                                      "Content-Type": "application/json",
                                      authorization: `Bearer:${props.jwt}`,
                                    },
                                  }
                                )
                                .then((res) => {
                                  const ind = userFollowing.indexOf(
                                    pst.postedBy
                                  );
                                  handleDelete(pst.postedBy, ind);
                                })
                                .catch((error) => {
                                  if (error.response.request.status == 401) {
                                    alert("Unauthorized User! Kindly Login!");
                                    props.JwtState(false);
                                  } else {
                                    alert(error.response.data.message);
                                  }
                                });

                              axios
                                .post(
                                  "http://localhost:4000/users/deleteuserfollower",
                                  {
                                    emailId: props.emailId,
                                    followerName: pst.postedBy,
                                  },
                                  {
                                    headers: {
                                      "Content-Type": "application/json",
                                      authorization: `Bearer:${props.jwt}`,
                                    },
                                  }
                                )
                                .then((res) => {})
                                .catch((error) => {
                                  if (error.response.request.status == 401) {
                                    alert("Unauthorized User! Kindly Login!");
                                    props.JwtState(false);
                                  } else {
                                    alert(error.response.data.message);
                                  }
                                });
                            }}
                          >
                            Following
                          </Button>
                        )}
                      </div>
                    </div>
                    <h2 style={{ paddingLeft: "10px" }}> {pst.name}</h2>
                  </div>
                  <div className="postBody">
                    <p style={{ paddingLeft: "10px", paddingTop: "10px" }}>
                      {pst.text}
                    </p>
                  </div>
                  <div className="postBottom">
                    <Button
                      disabled={pst.voteType === 1 ? 1 : 0}
                      onClick={(event) => {
                        axios
                          .post(
                            "http://localhost:4000/users/updatevote",
                            { postId: pst._id, voteState: 1 },
                            {
                              headers: {
                                "Content-Type": "application/json",
                                authorization: `Bearer:${props.jwt}`,
                              },
                            }
                          )
                          .then((res) => {
                            const ix = savedPostsData.indexOf(pst);
                            const newArray = savedPostsData.map((item, i) => {
                              if (ix === i) {
                                return { ...item, ["voteType"]: 1 };
                              } else {
                                return item;
                              }
                            });
                            setSavedPostsData((prev) => newArray);
                          })
                          .catch((error) => {
                            if (error.response.request.status == 401) {
                              alert("Unauthorized User! Kindly Login!");
                              props.JwtState(false);
                            } else {
                              alert(error.response.data.message);
                            }
                          });
                      }}
                    >
                      <ArrowCircleUpIcon />
                    </Button>
                    <Button
                      disabled={pst.voteType === -1 ? 1 : 0}
                      onClick={(event) => {
                        axios
                          .post(
                            "http://localhost:4000/users/updatevote",
                            { postId: pst._id, voteState: -1 },
                            {
                              headers: {
                                "Content-Type": "application/json",
                                authorization: `Bearer:${props.jwt}`,
                              },
                            }
                          )
                          .then((res) => {
                            const ix = savedPostsData.indexOf(pst);
                            const newArray = savedPostsData.map((item, i) => {
                              if (ix === i) {
                                return { ...item, ["voteType"]: -1 };
                              } else {
                                return item;
                              }
                            });
                            setSavedPostsData((prev) => newArray);
                          })
                          .catch((error) => {
                            if (error.response.request.status == 401) {
                              alert("Unauthorized User! Kindly Login!");
                              props.JwtState(false);
                            } else {
                              alert(error.response.data.message);
                            }
                          });
                      }}
                    >
                      <ArrowCircleDownIcon />
                    </Button>
                    <Button
                      onClick={(event) => {
                        event.preventDefault();
                        axios
                          .post(
                            "http://localhost:4000/users/unsavepost",
                            { postId: pst._id, emailId: props.emailId },
                            {
                              headers: {
                                "Content-Type": "application/json",
                                authorization: `Bearer:${props.jwt}`,
                              },
                            }
                          )
                          .then((res) => {
                            const ix = savedPostsData.indexOf(pst);
                            const newArray = savedPostsData.map((item, i) => {
                              if (ix === i) {
                                const vArr = savedPostsData[i];
                                const indx = savedPostsData[i].indexOf(pst);
                                vArr.splice(indx, 1);
                                return { ...item, vArr };
                              } else {
                                return item;
                              }
                            });
                            setSavedPostsData((prev) => newArray);
                          })
                          .catch((error) => {
                            if (error.response.request.status == 401) {
                              alert("Unauthorized User! Kindly Login!");
                              props.JwtState(false);
                            } else {
                              alert(error.response.data.message);
                            }
                          });
                      }}
                    >
                      Unsave
                    </Button>
                    <Button onClick={(event) => {}}>Comment</Button>
                  </div>
                </Box>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
