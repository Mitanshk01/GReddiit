import * as React from "react";
import Navbar from "./NavbarDashboard";
import { Modal } from "@mui/material";
import { Backdrop } from "@mui/material";
import { Button } from "@mui/material";
import axios from "axios";
import { Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function MySubGreddit(props) {
  const navigate = useNavigate();
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

  const templ = {
    name: "",
    description: "",
    tags: "",
    bannedKeyWords: "",
  };

  const [loading, setLoading] = React.useState(false);

  const convertToBase64 = async (file) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        setLoading(false);
        resolve(fileReader.result);
      };
      fileReader.onerror = (err) => {
        setLoading(false);
        reject(err);
      };
    });
  };

  const [profileImage, setProfileImage] = React.useState(null);
  const [isButtonLoading, setButtonLoading] = React.useState(false);

  const selectImage = (event) => {
    setProfileImage((prev) => event.target.files[0]);
  };

  const [subGreddiitData, setSubGreddiitData] = React.useState({
    name: "",
    description: "",
    tags: "",
    bannedKeyWords: "",
  });

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.preventDefault();
    setAnchorEl(null);
  };

  const handleChange = (event) => {
    setSubGreddiitData({
      ...subGreddiitData,
      [event.target.name]: event.target.value,
    });
  };

  const [pageData, setPageData] = React.useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setButtonLoading(true);
    const convImage = await convertToBase64(profileImage);

    const subGredditObj = {
      name: subGreddiitData.name,
      description: subGreddiitData.description,
      tags: subGreddiitData.tags.split(","),
      bannedKeyWords: subGreddiitData.bannedKeyWords.split(","),
      moderators: [props.emailId],
      members: [props.emailId],
      creationDate: new Date(),
      profImage: convImage,
      noPosts: 0,
    };

    const sData = JSON.stringify(subGredditObj);

    axios
      .post("http://localhost:4000/users/createsubgreddit", sData, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer:${props.jwt}`,
        },
      })
      .then((res) => {
        alert("SubGreddit Created Successfully!");
        setButtonLoading(false);
        setPageData([...pageData, subGredditObj]);
      })
      .catch((error, res) => {
        setButtonLoading(false);
        if (error.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(error.response.data.message);
        }
      });
    setSubGreddiitData((prev) => templ);
  };

  function handleDelete(SubG, idx) {
    let newA = [];
    setPageData((prev) => {
      newA = prev.filter((item, ind) => {
        return idx !== ind;
      });

      return newA;
    });
  }

  const deleteReports = async (rptId) => {
    axios
      .post(
        "http://localhost:4000/users/deletereportbysub",
        {
          _id: rptId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${props.jwt}`,
          },
        }
      )
      .then((res) => {})
      .catch((err) => {
        if (err.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(err.response.data.message);
        }
      });
  };

  const deleteComments = async (subGId) => {
    axios
      .post(
        "http://localhost:4000/users/deletecomments",
        {
          postedSubGId: subGId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${props.jwt}`,
          },
        }
      )
      .then((res) => {})
      .catch((err) => {
        if (err.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(err.response.data.message);
        }
      });
  };

  const deletePosts = async (pstId) => {
    axios
      .post(
        "http://localhost:4000/users/deletepostbysub",
        {
          postedId: pstId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${props.jwt}`,
          },
        }
      )
      .then((res) => {})
      .catch((err) => {
        if (err.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(err.response.data.message);
        }
      });
  };
  const deleteSubG = async (SubG, ind) => {
    axios
      .post("http://localhost:4000/users/deletemysubgreddit", SubG, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer:${props.jwt}`,
        },
      })
      .then((res) => {
        handleDelete(SubG, ind);
      })
      .catch((error) => {
        if (error.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(error.response.data.message);
        }
      });
  };

  const deleteStats = async (pstId) => {
    axios
      .post(
        "http://localhost:4000/users/deletestats",
        {
          _id: pstId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${props.jwt}`,
          },
        }
      )
      .then((res) => {})
      .catch((err) => {
        if (err.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(err.response.data.message);
        }
      });
  };

  React.useEffect(() => {
    axios
      .post(
        "http://localhost:4000/users/findmysubgreddit",
        {
          emailId: props.emailId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${props.jwt}`,
          },
        }
      )
      .then((res) => {
        setPageData(res.data);
      })
      .catch((err) => {
        if (err.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(err.response.data.message);
        }
      });
  }, [props.emailId]);

  return (
    <div>
      <div>
        <Navbar JwtState={props.JwtState} />
      </div>
      {loading === true ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : (
        <div style={{ paddingTop: "100px" }}>
          <Button
            variant="contained"
            onClick={handleClick}
            style={{ display: "flex", textAlign: "center", margin: "auto" }}
          >
            New SubGreddiit
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
                  Name:
                  <input
                    className="txt"
                    name="name"
                    type="text"
                    value={subGreddiitData.name}
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
                    value={subGreddiitData.description}
                    onChange={handleChange}
                  />
                </label>
                <br />
                <label className="lbl">
                  Tags(Single Word ',' seperated)
                  <input
                    className="txt"
                    name="tags"
                    type="text"
                    value={subGreddiitData.tags}
                    onChange={handleChange}
                  />
                </label>
                <br />
                <label className="lbl">
                  Banned Key Words(Single Word ',' seperated)
                  <input
                    className="txt"
                    name="bannedKeyWords"
                    value={subGreddiitData.bannedKeyWords}
                    onChange={handleChange}
                  />
                </label>
                <input type="file" onChange={selectImage} name="file" />
                {isButtonLoading ? (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </div>
                ) : (
                  <input
                    disabled={
                      subGreddiitData.name === "" ||
                      subGreddiitData.description === ""
                    }
                    type="submit"
                    value="Submit"
                    className="sub"
                    onClick={handleSubmit}
                    style={{
                      backgroundColor:
                        subGreddiitData.name === "" ||
                        subGreddiitData.description === ""
                          ? "red"
                          : "",
                    }}
                  />
                )}
              </form>
            </Box>
          </Modal>
          <Box>
            {pageData.map((pageD, ind) => {
              return (
                <div
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
                    <h3 style={{ textAlign: "center" }}> {pageD.name}</h3>
                    <p>Description: {pageD.description}</p>
                    <p>Banned Keywords: {pageD.bannedKeyWords}</p>
                    <p>No Of Posts: {pageD.noPosts}</p>
                    <p>
                      No Of Members: {pageD.members ? pageD.members.length : 0}
                    </p>
                    <Button
                      style={{ marginLeft: "716px" }}
                      onClick={() => {
                        navigate(`/MySubG/${pageD.name}`);
                      }}
                    >
                      Open
                    </Button>
                    <Button
                      onClick={async () => {
                        await deleteReports(pageD._id);
                        await deletePosts(pageD._id);
                        await deleteComments(pageD._id);
                        await deleteStats(pageD._id);
                        await deleteSubG(pageD, ind);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </div>
              );
            })}
          </Box>
        </div>
      )}
    </div>
  );
}
