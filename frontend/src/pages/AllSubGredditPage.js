import * as React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../NavbarDashboard";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import { Modal } from "@mui/material";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import "./AllSubGredditPage.css";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

export default function AllSubGredditPage(props) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 650,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    overflow: "scroll",
    p: 4,
  };

  const [openCom, setOpenCom] = React.useState("");

  const [isButtonLoading, setButtonLoading] = React.useState(false);

  const [reportData, setReportData] = React.useState({
    concern: "",
  });

  const [userFollowing, setUserFollowing] = React.useState([]);

  const [postData, setPostData] = React.useState({
    name: "",
    description: "",
  });

  const [allPostData, setAllPostData] = React.useState([]);

  const pageName = useParams();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const [anchorEl2, setAnchorEl2] = React.useState(null);

  const open2 = Boolean(anchorEl2);

  const [anchorEl3, setAnchorEl3] = React.useState("");

  const [replym, setReplym] = React.useState({
    message: "",
  });

  const handleClose2 = (event) => {
    event.preventDefault();
    setReportData({});
    setAnchorEl2(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.preventDefault();
    setAnchorEl(null);
  };

  const [pageData, setPageData] = React.useState({
    description: "",
    bannedKeyWords: [],
    postIds: [],
    members: [],
  });

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
        alert("Unauthenticated User!");
        props.JwtState(false);
      });
  }, []);

  React.useEffect(() => {
    axios
      .post(
        "http://localhost:4000/users/finduserssubgreddit",
        { pageName: pageName.name },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${props.jwt}`,
          },
        }
      )
      .then((res) => {
        setPageData(res.data[0]);
      })
      .catch((error) => {
        if (error.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(error.response.data.message);
        }
      });
  }, []);

  function RecursiveComments(pr) {
    const [isExpanded, setIsExpanded] = React.useState("");
    const [opModal, setOpModal] = React.useState("");

    const handleCloseCom = (event) => {
      event.preventDefault();
      setOpModal("");
    };

    const [reply, setReply] = React.useState({
      message: "",
    });

    const [replies, setReplies] = React.useState([]);

    React.useEffect(() => {
      axios
        .post(
          "http://localhost:4000/users/allcomments",
          { parentCommentId: pr.parId },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer:${props.jwt}`,
            },
          }
        )
        .then((res) => {
          setReplies(res.data);
        })
        .catch((error) => {
          if (error.response.request.status == 401) {
            alert("Unauthorized User! Kindly Login!");
            props.JwtState(false);
          } else {
            alert(error.response.data.message);
          }
        });
    }, []);

    return replies.map((rep) => {
      return (
        <div style={{ marginTop: 10 }}>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={opModal === rep._id}
            onClose={handleCloseCom}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Box sx={style}>
              <form className="fm">
                <label className="lbl">
                  Type your reply:
                  <input
                    className="txt"
                    name="message"
                    type="text"
                    value={reply.message}
                    onChange={(ev) => {
                      setReply({ ...reply, [ev.target.name]: ev.target.value });
                    }}
                  />
                </label>
                <br />
                <input
                  disabled={reply.message === ""}
                  type="submit"
                  value="Submit"
                  className="sub"
                  onClick={(e) => {
                    e.preventDefault();
                    e.cancelBubble = true;
                    if (e.stopPropagation) e.stopPropagation();
                    const commentObj = JSON.stringify({
                      postedBy: props.emailId,
                      postedText: reply.message,
                      parentCommentId: rep._id,
                      postedSubGId: pageData._id,
                      postedSubGName: pageData.name,
                      subCommentsId: [],
                    });
                    axios
                      .post(
                        "http://localhost:4000/users/addcomments",
                        commentObj,
                        {
                          headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer:${props.jwt}`,
                          },
                        }
                      )
                      .then((res) => {
                        alert("Comment Posted Successfully!");

                        axios
                          .post(
                            "http://localhost:4000/users/pushcomments",
                            { _id: pr.parId, subComId: res.data._id },
                            {
                              headers: {
                                "Content-Type": "application/json",
                                authorization: `Bearer:${props.jwt}`,
                              },
                            }
                          )
                          .then((re) => {
                            alert("Comment Posted Successfully!");

                            setAnchorEl3("");
                          })
                          .catch((err) => {
                            if (err.response.request.status == 401) {
                              alert("Unauthorized User! Kindly Login!");
                              props.JwtState(false);
                            } else {
                              alert(err.response.data.message);
                            }
                          });
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
                />
              </form>
            </Box>
          </Modal>
          <div
            style={{ marginLeft: 20 * pr.depth }}
            onClick={(eve) => {
              eve.preventDefault();
              eve.cancelBubble = true;
              if (eve.stopPropagation) eve.stopPropagation();
              if (isExpanded === "") {
                setIsExpanded(rep._id);
              } else {
                setIsExpanded("");
              }
            }}
          >
            Posted By: u/{rep.postedBy}
            <br />
            {rep.postedText}
            <Button
              onClick={() => {
                setOpModal(rep._id);
              }}
            >
              Reply
            </Button>
            {isExpanded === rep._id && rep.subCommentsId ? (
              <RecursiveComments parId={rep._id} depth={pr.depth + 1} />
            ) : (
              <div></div>
            )}
          </div>
        </div>
      );
    });
  }

  const handleChange = (event) => {
    event.preventDefault();
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChange2 = (event) => {
    event.preventDefault();
    setReportData({
      ...reportData,
      [event.target.name]: event.target.value,
    });
  };

  React.useEffect(() => {
    axios
      .post(
        "http://localhost:4000/users/getpost",
        { name: pageName.name },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${props.jwt}`,
          },
        }
      )
      .then((res) => {
        setAllPostData(res.data);
      })
      .catch((error) => {
        if (error.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(error.response.data.message);
        }
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setButtonLoading(true);

    const postObj = {
      name: postData.name,
      postedBy: props.emailId,
      text: postData.description,
      postedId: pageData._id,
      upVotes: 0,
      downVotes: 0,
      voteType: 0,
      savedBy: [],
      pageName: pageName.name,
    };

    var check = false;

    for (var i = 0; i < pageData.bannedKeyWords.length; i++) {
      const regularExp = new RegExp(pageData.bannedKeyWords[i], "i");

      if (postData.description.match(regularExp)) {
        check = true;
        break;
      }
    }

    if (check === true) {
      alert("Your Post contains a banned keyword");
    }

    const pData = JSON.stringify(postObj);

    axios
      .post(
        "http://localhost:4000/users/subpost",
        {
          _id: pageData._id,
          noPosts: allPostData.length + 1,
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
        setButtonLoading(false);
        if (error.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(error.response.data.message);
        }
      });

    axios
      .post("http://localhost:4000/users/createpost", pData, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer:${props.jwt}`,
        },
      })
      .then((res) => {
        setButtonLoading(false);
        setAllPostData([...allPostData, res.data]);
      })
      .catch((error) => {
        setButtonLoading(false);
        if (error.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(error.response.data.message);
        }
      });

    axios
      .post(
        "http://localhost:4000/users/updatestatsposts",
        {
          _id: pageData._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${props.jwt}`,
          },
        }
      )
      .catch((error) => {
        if (error.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(error.response.data.message);
        }
      });

    setPostData({});
  };

  function handleDelete(pst, idx) {
    let updatedArray = [];
    setUserFollowing((prev) => {
      updatedArray = prev.filter((item, ind) => {
        return idx !== ind;
      });
      return updatedArray;
    });
  }

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  return (
    <div>
      <div>
        <Navbar JwtState={props.JwtState} />
      </div>
      <div style={{ paddingTop: "100px" }} className="pageImg"></div>
      <div>
        <h1 style={{ textAlign: "center" }}>r/{pageName.name}</h1>
      </div>
      <div>
        <div style={{ display: "flex" }}>
          <div style={{ width: "15%", paddingLeft: "30px" }}>
            <h3>About:</h3>
            <div className="circle-container">
              <img src={pageData.profImage} className="circle-image" />
            </div>
            <p>Description: {pageData.description}</p>
            <p>Banned Keywords: {pageData.bannedKeyWords}</p>
            <p>No Of Posts: {allPostData.length}</p>
            <p>No Of Members: {pageData.members.length}</p>
          </div>
          <div style={{ width: "85%" }}>
            <div>
              <Button
                variant="contained"
                onClick={handleClick}
                style={{ display: "flex", textAlign: "right" }}
              >
                New Post
              </Button>

              <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
              >
                <Box sx={style}>
                  <form className="fm">
                    {" "}
                    <label className="lbl">
                      Name of the Post:
                      <input
                        className="txt"
                        name="name"
                        type="text"
                        value={postData.name}
                        onChange={handleChange}
                      />
                    </label>
                    <br />
                    <label className="lbl">
                      Description:
                      <input
                        className="txt"
                        name="description"
                        type="text"
                        value={postData.description}
                        onChange={handleChange}
                        style={{ height: "100px" }}
                      />
                    </label>
                    <br />
                    {isButtonLoading ? (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <CircularProgress />
                      </div>
                    ) : (
                      <input
                        disabled={
                          postData.name === "" || postData.description === ""
                        }
                        type="submit"
                        value="Submit"
                        className="sub"
                        onClick={handleSubmit}
                        style={{
                          backgroundColor:
                            postData.name == "" || postData.description == ""
                              ? "red"
                              : "",
                        }}
                      />
                    )}
                  </form>
                </Box>
              </Modal>
            </div>
            <div>
              {allPostData.map((pst, idx) => {
                let itm = pst.text;
                for (var j = 0; j < pageData.bannedKeyWords.length; j++) {
                  const regularEx = new RegExp(
                    pageData.bannedKeyWords[j],
                    "gi"
                  );
                  if (itm.match(regularEx)) {
                    var tempstr = new Array(
                      pageData.bannedKeyWords[j].length + 1
                    ).join("*");
                    itm = itm.replace(regularEx, tempstr);
                  }
                }
                return (
                  <div
                    className="pbox"
                    style={{
                      paddingTop: "50px",
                      marginLeft: "2%",
                      paddingRight: "2%",
                    }}
                  >
                    <Modal
                      aria-labelledby="transition-modal-title"
                      aria-describedby="transition-modal-description"
                      open={anchorEl3 === pst._id}
                      onClose={(e) => {
                        setAnchorEl3("");
                      }}
                      closeAfterTransition
                      BackdropComponent={Backdrop}
                      BackdropProps={{
                        timeout: 500,
                      }}
                    >
                      <Box sx={style}>
                        <form className="fm">
                          <label className="lbl">
                            Type your reply:
                            <input
                              className="txt"
                              name="message"
                              type="text"
                              value={replym.message}
                              onChange={(ev) => {
                                setReplym({
                                  ...replym,
                                  [ev.target.name]: ev.target.value,
                                });
                              }}
                            />
                          </label>
                          <br />
                          <input
                            disabled={replym.message === ""}
                            type="submit"
                            value="Submit"
                            className="sub"
                            onClick={(e) => {
                              e.preventDefault();
                              const commentObj = JSON.stringify({
                                postedBy: props.emailId,
                                postedText: replym.message,
                                parentCommentId: pst._id,
                                postedSubGId: pageData._id,
                                postedSubGName: pageData.name,
                                subCommentsId: [],
                              });
                              axios
                                .post(
                                  "http://localhost:4000/users/addcomments",
                                  commentObj,
                                  {
                                    headers: {
                                      "Content-Type": "application/json",
                                      authorization: `Bearer:${props.jwt}`,
                                    },
                                  }
                                )
                                .then((res) => {
                                  alert("Comment Posted Successfully!");
                                  setAnchorEl3(null);
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
                          />
                        </form>
                      </Box>
                    </Modal>
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
                                disabled={
                                  props.emailId === pst.postedBy ||
                                  !pageData.members.includes(pst.postedBy)
                                    ? 1
                                    : 0
                                }
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
                                      if (
                                        error.response.request.status == 401
                                      ) {
                                        alert(
                                          "Unauthorized User! Kindly Login!"
                                        );
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
                                      if (
                                        error.response.request.status == 401
                                      ) {
                                        alert(
                                          "Unauthorized User! Kindly Login!"
                                        );
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
                                      if (
                                        error.response.request.status == 401
                                      ) {
                                        alert(
                                          "Unauthorized User! Kindly Login!"
                                        );
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
                                      if (
                                        error.response.request.status == 401
                                      ) {
                                        alert(
                                          "Unauthorized User! Kindly Login!"
                                        );
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
                          {itm}
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
                                const ix = allPostData.indexOf(pst);
                                const newArray = allPostData.map((item, i) => {
                                  if (ix === i) {
                                    return { ...item, ["voteType"]: 1 };
                                  } else {
                                    return item;
                                  }
                                });
                                setAllPostData((prev) => newArray);
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
                                const ix = allPostData.indexOf(pst);
                                const newArray = allPostData.map((item, i) => {
                                  if (ix === i) {
                                    return { ...item, ["voteType"]: -1 };
                                  } else {
                                    return item;
                                  }
                                });
                                setAllPostData((prev) => newArray);
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
                          disabled={
                            pst.savedBy && pst.savedBy.includes(props.emailId)
                              ? 1
                              : 0
                          }
                          onClick={(event) => {
                            event.preventDefault();
                            axios
                              .post(
                                "http://localhost:4000/users/savepost",
                                { postId: pst._id, emailId: props.emailId },
                                {
                                  headers: {
                                    "Content-Type": "application/json",
                                    authorization: `Bearer:${props.jwt}`,
                                  },
                                }
                              )
                              .then((res) => {
                                const ix = allPostData.indexOf(pst);
                                const newArray = allPostData.map((item, i) => {
                                  if (ix === i) {
                                    const vArr = allPostData[i];
                                    if (!vArr.savedBy) vArr.savedBy = [];
                                    vArr.savedBy.push(props.emailId);
                                    return { ...item, vArr };
                                  } else {
                                    return item;
                                  }
                                });
                                setAllPostData((prev) => newArray);
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
                          Save
                        </Button>
                        <Button
                          onClick={(event) => {
                            event.preventDefault();
                            setAnchorEl3(pst._id);
                          }}
                        >
                          Comment
                        </Button>
                        <Button
                          onClick={(e) => {
                            if (openCom !== pst._id) setOpenCom(pst._id);
                            else {
                              setOpenCom("");
                            }
                          }}
                        >
                          Show Comments
                        </Button>

                        <Button
                          onClick={handleClick2}
                          disabled={props.emailId === pst.postedBy ? 1 : 0}
                        >
                          Report
                        </Button>
                        <Modal
                          aria-labelledby="transition-modal-title"
                          aria-describedby="transition-modal-description"
                          open={open2}
                          onClose={handleClose2}
                          closeAfterTransition
                          BackdropComponent={Backdrop}
                          BackdropProps={{
                            timeout: 500,
                          }}
                        >
                          <Box sx={style}>
                            <form className="fm">
                              <label className="lbl">
                                Concern:
                                <input
                                  className="txt"
                                  name="concern"
                                  type="text"
                                  value={reportData.concern}
                                  onChange={handleChange2}
                                  style={{ height: "100px" }}
                                />
                              </label>
                              <br />
                              <input
                                type="submit"
                                value="Submit"
                                className="sub"
                                onClick={(event) => {
                                  event.preventDefault();

                                  const reportObj = {
                                    reportedBy: props.emailId,
                                    reportedUser: pst.postedBy,
                                    reportedText: pst.text,
                                    reportConcern: reportData.concern,
                                    reportedPostId: pst._id,
                                    reportedSubGId: pageData._id,
                                    reportOutcome: "",
                                    createdAt: new Date(),
                                  };

                                  const rData = JSON.stringify(reportObj);

                                  axios
                                    .post(
                                      "http://localhost:4000/users/createreport",
                                      rData,
                                      {
                                        headers: {
                                          "Content-Type": "application/json",
                                          authorization: `Bearer:${props.jwt}`,
                                        },
                                      }
                                    )
                                    .then((res) => {})
                                    .catch((error) => {
                                      if (
                                        error.response.request.status == 401
                                      ) {
                                        alert(
                                          "Unauthorized User! Kindly Login!"
                                        );
                                        props.JwtState(false);
                                      } else {
                                        alert(error.response.data.message);
                                      }
                                    });

                                  axios
                                    .post(
                                      "http://localhost:4000/users/updatestatsreport",
                                      {
                                        _id: pst.postedId,
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
                                      if (
                                        error.response.request.status == 401
                                      ) {
                                        alert(
                                          "Unauthorized User! Kindly Login!"
                                        );
                                        props.JwtState(false);
                                      } else {
                                        alert(error.response.data.message);
                                      }
                                    });

                                  setReportData({});

                                  setAnchorEl2(null);
                                }}
                              />
                            </form>
                          </Box>
                        </Modal>
                        <Modal
                          aria-labelledby="transition-modal-title"
                          aria-describedby="transition-modal-description"
                          open={openCom === pst._id}
                          onClose={(e) => {
                            setOpenCom("");
                          }}
                          closeAfterTransition
                          BackdropComponent={Backdrop}
                          BackdropProps={{
                            timeout: 500,
                          }}
                        >
                          <Box sx={style}>
                            <RecursiveComments parId={pst._id} depth={0} />
                          </Box>
                        </Modal>
                      </div>
                    </Box>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
