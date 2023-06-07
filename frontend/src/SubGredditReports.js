import * as React from "react";
import { useParams } from "react-router-dom";
import Navbar from "./NavbarDashboard";
import "./pages/SubGredditPage.css";
import { Button, Menu } from "@mui/material";
import SubGredditNav from "./navbars/SubGreddiitPageNavbar";
import axios from "axios";
import { Box } from "@mui/system";
import { useRef } from "react";

export default function SubGredditReports(props) {
  const pageName = useParams();
  const [reports, setReports] = React.useState([]);
  const [timerRemaining, setTimerRemaining] = React.useState(3);
  const [clickBlock, setClickBlock] = React.useState(false);
  const [userRep, setUserRep] = React.useState("");
  const [rep, setRep] = React.useState({});
  const [repIdx, setRepIdx] = React.useState("");
  const [subGId, setSubGId] = React.useState("");

  const timerInterval = useRef(null);

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
        setSubGId(res.data[0]._id);
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

  React.useEffect(() => {
    if (timerRemaining === 0) {
      clearInterval(timerInterval.current);
      axios
        .post(
          "http://localhost:4000/users/blockusersubg",
          {
            _id: rep.reportedSubGId,
            name: rep.reportedUser,
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
          "http://localhost:4000/users/blockuserpost",
          {
            name: rep.reportedUser,
          },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer:${props.jwt}`,
            },
          }
        )
        .then((res) => {
          const newArray = reports.map((item, i) => {
            if (repIdx === i) {
              const vArr = reports[i];
              vArr.reportOutcome = "blocked";
              return { ...item, vArr };
            } else {
              return item;
            }
          });
          setReports((prev) => newArray);
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
          "http://localhost:4000/users/updatereport",
          {
            _id: rep._id,
            reportOutcome: "blocked",
          },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer:${props.jwt}`,
            },
          }
        )
        .then((res) => {
          const newArray = reports.map((item, i) => {
            if (repIdx === i) {
              const vArr = reports[i];
              vArr.reportOutcome = "ignore";
              return { ...item, vArr };
            } else {
              return item;
            }
          });
          setReports((prev) => newArray);
          setUserRep((prev) => "");
        })
        .catch((error) => {
          if (error.response.request.status == 401) {
            alert("Unauthorized User! Kindly Login!");
            props.JwtState(false);
          } else {
            alert(error.response.data.message);
          }
        });
    }
  }, [timerRemaining]);

  React.useEffect(() => {
    axios
      .post(
        "http://localhost:4000/users/getreports",
        {
          _id: subGId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${props.jwt}`,
          },
        }
      )
      .then((res) => {
        setReports(res.data);
      })

      .catch((error) => {
        if (error.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(error.response.data.message);
        }
      });
  }, [subGId]);

  function handleDelete(rpt, idx) {
    let newA = [];
    setReports((prev) => {
      newA = prev.filter((item, ind) => {
        return idx !== ind;
      });
      return newA;
    });
  }

  async function deletePost(postId) {
    axios
      .post(
        "http://localhost:4000/users/deletepost",
        {
          _id: postId,
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
  }

  async function deleteReport(report) {
    axios
      .post(
        "http://localhost:4000/users/deletereport",
        {
          _id: report._id,
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
        "http://localhost:4000/users/updatestatsdelete",
        {
          _id: report.reportedSubGId,
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
  }

  async function blockUserSubG(rpt) {
    axios
      .post(
        "http://localhost:4000/users/blockusersubg",
        {
          _id: rpt.reportedSubGId,
          name: rpt.reportedUser,
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
  }

  async function blockUserPost(rpt, idx) {
    axios
      .post(
        "http://localhost:4000/users/blockuserpost",
        {
          name: rpt.reportedUser,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${props.jwt}`,
          },
        }
      )
      .then((res) => {
        const newArray = reports.map((item, i) => {
          if (idx === i) {
            const vArr = reports[i];
            vArr.reportOutcome = "blocked";
            return { ...item, vArr };
          } else {
            return item;
          }
        });
        setReports((prev) => newArray);
      })
      .catch((error) => {
        if (error.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(error.response.data.message);
        }
      });
  }

  async function updReport(rpt, idx) {
    axios
      .post(
        "http://localhost:4000/users/updatereport",
        {
          _id: rpt._id,
          reportOutcome: "ignore",
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${props.jwt}`,
          },
        }
      )
      .then((res) => {
        const newArray = reports.map((item, i) => {
          if (idx === i) {
            const vArr = reports[i];
            vArr.reportOutcome = "ignore";
            return { ...item, vArr };
          } else {
            return item;
          }
        });
        setReports((prev) => newArray);
      })
      .catch((error) => {
        if (error.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(error.response.data.message);
        }
      });
  }

  const handleBlock = async (rpt, idx) => {
    setTimerRemaining((prev) => 3);

    timerInterval.current = setInterval(() => {
      setTimerRemaining((prev) => (prev ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timerInterval.current);
    };
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
        <SubGredditNav pageName={pageName} />
      </div>
      <div style={{ paddingTop: "45px" }}>
        {reports.map((rpt, idx) => {
          return (
            <div
              style={{
                paddingTop: "50px",
                marginLeft: "2%",
                paddingRight: "2%",
              }}
            >
              <div>
                <Box
                  style={{
                    backgroundColor: "#f0f0f0",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "1px 2px 9px #F4AAB9",
                  }}
                >
                  <p>Reported User : u/{rpt.reportedUser}</p>
                  <p>Reported By : u/{rpt.reportedBy}</p>
                  <p>Reported Text : {rpt.reportedText}</p>
                  <p>Concern : {rpt.reportConcern}</p>
                </Box>
              </div>
              <div>
                {clickBlock === false || userRep != rpt._id ? (
                  <Button
                    disabled={rpt.reportOutcome === "" ? 0 : 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setRep((prev) => rpt);
                      setRepIdx((prev) => idx);
                      setTimerRemaining((prev) => 3);
                      setClickBlock(true);
                      setUserRep((prev) => rpt._id);
                      handleBlock(rpt, idx);
                    }}
                  >
                    Block User
                  </Button>
                ) : (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setRep((prev) => {});
                      setRepIdx((prev) => "");
                      clearInterval(timerInterval.current);
                      setClickBlock(false);
                      setUserRep((prev) => "");
                      setTimerRemaining((prev) => 3);
                    }}
                  >
                    {" "}
                    Cancel in {timerRemaining}s{" "}
                  </Button>
                )}
                <Button
                  disabled={rpt.reportOutcome === "" ? 0 : 1}
                  onClick={async (event) => {
                    event.preventDefault();
                    await deleteReport(rpt);
                    await deletePost(rpt.reportedPostId);
                    handleDelete(rpt, idx);
                  }}
                >
                  Delete Post
                </Button>
                <Button
                  disabled={rpt.reportOutcome === "" ? 0 : 1}
                  onClick={(event) => {
                    event.preventDefault();
                    axios
                      .post(
                        "http://localhost:4000/users/updatereport",
                        {
                          _id: rpt._id,
                          reportOutcome: "ignore",
                        },
                        {
                          headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer:${props.jwt}`,
                          },
                        }
                      )
                      .then((res) => {
                        const newArray = reports.map((item, i) => {
                          if (idx === i) {
                            const vArr = reports[i];
                            vArr.reportOutcome = "ignore";
                            return { ...item, vArr };
                          } else {
                            return item;
                          }
                        });
                        setReports((prev) => newArray);
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
                  Ignore
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
