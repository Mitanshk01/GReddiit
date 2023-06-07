import * as React from "react";
import Navbar from "./NavbarDashboard";
import axios from "axios";
import { useState } from "react";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Modal, TextField } from "@mui/material";
import "./Profile.css";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { CircularProgress } from "@mui/material";

export default function Profile(props) {
  const [foundChat, setFoundChat] = React.useState([]);
  const [chatPeople, setChatPeople] = useState([]);

  function ShowChat(pr) {
    React.useEffect(() => {
      const interval = setInterval(() => {
        axios
          .post(
            "http://localhost:4000/users/findchat",
            { chatBetween: [props.emailId, pr.usr] },
            {
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer:${props.jwt}`,
              },
            }
          )
          .then((res) => {
            if (res.data) setFoundChat((prev) => res.data.chatText);
          })
          .catch((error) => {
            if (error.response.request.status == 401) {
              alert("Unauthorized User! Kindly Login!");
              props.JwtState(false);
            } else {
              alert(error.response.data.message);
            }
          });
      }, 3000);

      return () => clearInterval(interval);
    }, []);

    return (
      <div style={{ overflowY: "scroll", height: "200px" }}>
        {foundChat.map((msg) => {
          return (
            <div
              style={{
                display: "flex",
                marginTop: "10px",
                justifyContent: msg.sender == props.emailId ? "right" : "left",
              }}
            >
              <p>{msg.message}</p>
            </div>
          );
        })}
      </div>
    );
  }

  const [isButtonLoading, setButtonLoading] = React.useState(false);
  const [messages, setMessages] = useState([]);

  const [myMessage, setMyMessage] = React.useState({
    message: "",
  });

  const handleSendMessage = (event) => {
    event.preventDefault();
    setMyMessage({ ...myMessage, [event.target.name]: event.target.value });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    overflow: "scroll",
    p: 4,
  };

  const jwt = localStorage.getItem("userTok");

  const [userData, setUserData] = useState({
    followers: [],
    following: [],
  });

  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [anchorEl3, setAnchorEl3] = React.useState(null);
  const [anchorEl4, setAnchorEl4] = React.useState("");

  const [following, setFollowing] = React.useState([]);
  const [followers, setFollowers] = React.useState([]);

  const open1 = Boolean(anchorEl1);
  const open2 = Boolean(anchorEl2);
  const open3 = Boolean(anchorEl3);

  const handleDelete1 = (name, idx) => {
    let newA = [];
    setFollowers((prev) => {
      newA = prev.filter((item, ind) => {
        return idx !== ind;
      });
      return newA;
    });
  };

  const handleDelete2 = (name, idx) => {
    let newA = [];
    setFollowers((prev) => {
      newA = prev.filter((item, ind) => {
        return idx !== ind;
      });
      return newA;
    });
  };

  const handleClick1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleClose1 = (event) => {
    setAnchorEl1(null);
  };

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = (event) => {
    setAnchorEl2(null);
  };

  const handleClick3 = (event) => {
    setAnchorEl3(event.currentTarget);
  };

  const handleClose3 = (event) => {
    setAnchorEl3(null);
  };

  React.useEffect(() => {
    axios
      .get("http://localhost:4000/users/auth", {
        headers: { authorization: `Bearer:${jwt}` },
      })
      .then((res) => {
        setUserData(res.data.user);

        setChatPeople((prev) =>
          res.data.user.followers.filter((val) =>
            res.data.user.following.includes(val)
          )
        );

        setFollowers(res.data.user.followers);
        setFollowing(res.data.user.following);
      })
      .catch((err) => {
        props.JwtState(false);
        alert(err.message);
      });
  }, []);

  const handleChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    setButtonLoading(true);
    event.preventDefault();
    axios
      .post("http://localhost:4000/users/updateprofile", userData, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer:${props.jwt}`,
        },
      })
      .then((res) => {
        setButtonLoading(false);
        alert("Update Successful!");
      })
      .catch((err) => {
        setButtonLoading(false);
        if (err.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(err.response.data.message);
        }
      });
  };

  return (
    <div>
      <div>
        <Navbar JwtState={props.JwtState} />
      </div>
      <div style={{ paddingTop: "100px" }} className="info">
        <div>
          <form className="fm" style={{ marginLeft: 20 }}>
            {" "}
            <label className="lbl">
              First Name:
              <input
                className="txt"
                name="firstName"
                type="text"
                value={userData.firstName}
                onChange={handleChange}
              />
            </label>
            <br />
            <label className="lbl">
              Last Name:
              <input
                className="txt"
                name="lastName"
                type="text"
                value={userData.lastName}
                onChange={handleChange}
              />
            </label>
            <br />
            <label className="lbl">
              Email Id:
              <input
                className="txt"
                name="emailId"
                type="text"
                value={userData.emailId}
                disabled={true}
              />
            </label>
            <br />
            <label className="lbl">
              Phone Number:
              <input
                className="txt"
                name="contactNumber"
                type="text"
                value={userData.contactNumber}
                onChange={handleChange}
              />
            </label>
            <br />
            <label className="lbl">
              UserName:
              <input
                className="txt"
                name="userName"
                type="text"
                value={userData.userName}
                onChange={handleChange}
              />
            </label>
            <br />
            <label className="lbl">
              Age:
              <input
                className="txt"
                name="age"
                type="text"
                value={userData.age}
                disabled
              />
            </label>
            {isButtonLoading ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </div>
            ) : (
              <input
                type="submit"
                value="Save"
                className="sub"
                onClick={handleSubmit}
                style={{
                  backgroundColor:
                    userData.userName == "" ||
                    userData.lastName == "" ||
                    userData.firstName == "" ||
                    userData.contactNumber == ""
                      ? "red"
                      : "",
                }}
                disabled={
                  userData.userName == "" ||
                  userData.lastName == "" ||
                  userData.firstName == "" ||
                  userData.contactNumber == ""
                }
              />
            )}
          </form>
        </div>
        <div className="drop-downs">
          <div>
            <Button
              id="basic-button"
              aria-controls={open1 ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open1 ? "true" : undefined}
              onClick={handleClick1}
              style={{ marginLeft: 35 }}
            >
              Followers {followers.length}
            </Button>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={open1}
              onClose={handleClose1}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Box sx={style}>
                {followers.map((usr) => {
                  return (
                    <MenuItem>
                      {usr}
                      <CancelPresentationIcon
                        onClick={() => {
                          axios
                            .post(
                              "http://localhost:4000/users/deleteuserfollowing",
                              {
                                emailId: usr,
                                followerName: userData.emailId,
                              },
                              {
                                headers: {
                                  "Content-Type": "application/json",
                                  authorization: `Bearer:${props.jwt}`,
                                },
                              }
                            )
                            .then((res) => {
                              const ind = following.indexOf(usr);
                              handleDelete1(usr, ind);
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
                                emailId: usr,
                                followerName: userData.emailId,
                              },
                              {
                                headers: {
                                  "Content-Type": "application/json",
                                  authorization: `Bearer:${props.jwt}`,
                                },
                              }
                            )
                            .then((res) => {
                              const ind = followers.indexOf(usr);
                              handleDelete2(usr, ind);
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
                    </MenuItem>
                  );
                })}
              </Box>
            </Modal>
          </div>
          <div>
            <Button
              id="basic-button"
              aria-controls={open2 ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open2 ? "true" : undefined}
              onClick={handleClick2}
              style={{ marginLeft: 35 }}
            >
              Following {following.length}
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
                {following.map((usr) => {
                  return (
                    <MenuItem>
                      {usr}
                      <CancelPresentationIcon
                        onClick={() => {
                          const idx = userData.following.indexOf(usr);
                          userData.following.splice(idx, 1);
                          axios
                            .post(
                              "http://localhost:4000/users/deleteuserfollowing",
                              {
                                emailId: userData.emailId,
                                followerName: usr,
                              },
                              {
                                headers: {
                                  "Content-Type": "application/json",
                                  authorization: `Bearer:${props.jwt}`,
                                },
                              }
                            )
                            .then((res) => {
                              const ind = following.indexOf(usr);
                              handleDelete1(usr, ind);
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
                                emailId: userData.emailId,
                                followerName: usr,
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
                      />
                    </MenuItem>
                  );
                })}
              </Box>
            </Modal>
          </div>
          <div>
            <Button
              id="basic-button"
              aria-controls={open3 ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open3 ? "true" : undefined}
              onClick={handleClick3}
              style={{ marginLeft: 35 }}
            >
              Chat
            </Button>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={open3}
              onClose={handleClose3}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Box sx={style}>
                {chatPeople.map((usr) => {
                  return (
                    <div>
                      <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={anchorEl4 === usr}
                        onClose={() => {
                          setFoundChat([]);
                          setAnchorEl4((prev) => "");
                        }}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 500,
                        }}
                      >
                        <Box sx={style}>
                          <div className="chatbox">
                            {anchorEl4 === usr ? <ShowChat usr={usr} /> : <></>}
                            <TextField
                              name="message"
                              value={myMessage.message}
                              onChange={handleSendMessage}
                            />
                            <Button
                              style={{ marginTop: "10px" }}
                              onClick={(even) => {
                                even.preventDefault();
                                axios
                                  .post(
                                    "http://localhost:4000/users/findchat",
                                    { chatBetween: [props.emailId, usr] },
                                    {
                                      headers: {
                                        "Content-Type": "application/json",
                                        authorization: `Bearer:${props.jwt}`,
                                      },
                                    }
                                  )
                                  .then((res) => {
                                    if (res.data)
                                      setMessages(res.data.chatBetween);

                                    if (res.data) {
                                      const messageObj = {
                                        chatBetween: [props.emailId, usr],
                                        chatText: {
                                          sender: props.emailId,
                                          message: myMessage.message,
                                        },
                                      };
                                      axios
                                        .post(
                                          "http://localhost:4000/users/updatechat",
                                          JSON.stringify(messageObj),
                                          {
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                              authorization: `Bearer:${props.jwt}`,
                                            },
                                          }
                                        )
                                        .then((re) => {
                                          setMessages([
                                            ...messages,
                                            messageObj,
                                          ]);
                                        })
                                        .catch((erro) => {
                                          if (
                                            erro.response.request.status == 401
                                          ) {
                                            alert(
                                              "Unauthorized User! Kindly Login!"
                                            );
                                            props.JwtState(false);
                                          } else {
                                            alert(erro.response.data.message);
                                          }
                                        });
                                    } else {
                                      const messageObj = {
                                        chatBetween: [props.emailId, usr],
                                        chatText: [
                                          {
                                            sender: props.emailId,
                                            message: myMessage.message,
                                          },
                                        ],
                                      };
                                      axios
                                        .post(
                                          "http://localhost:4000/users/createchat",
                                          JSON.stringify(messageObj),
                                          {
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                              authorization: `Bearer:${props.jwt}`,
                                            },
                                          }
                                        )
                                        .then((re) => {
                                          setMessages((prev) => messageObj);
                                        })
                                        .catch((erro) => {
                                          if (
                                            erro.response.request.status == 401
                                          ) {
                                            alert(
                                              "Unauthorized User! Kindly Login!"
                                            );
                                            props.JwtState(false);
                                          } else {
                                            alert(erro.response.data.message);
                                          }
                                        });
                                    }
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
                              Send
                            </Button>
                          </div>
                        </Box>
                      </Modal>
                      <MenuItem
                        onClick={(ev) => {
                          ev.preventDefault();
                          setAnchorEl4(usr);
                        }}
                      >
                        {usr}
                      </MenuItem>
                    </div>
                  );
                })}
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
