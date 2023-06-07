import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./NavbarDashboard";
import "./pages/SubGredditPage.css";
import { useState } from "react";
import SubGredditNav from "./navbars/SubGreddiitPageNavbar";
import axios from "axios";
import { MenuItem } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CancelIcon from "@mui/icons-material/Cancel";

export default function SubGredditJoin(props) {
  const pageName = useParams();
  const [joinReqData, setJoinReqData] = useState([]);
  const [membersData, setMembersData] = useState([]);
  const [pageId, setPageId] = useState("");

  React.useEffect(() => {
    axios
      .post(
        "http://localhost:4000/users/findmysub",
        { pageName: pageName.name },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${props.jwt}`,
          },
        }
      )
      .then((res) => {
        setJoinReqData(res.data[0].joinrequests);
        setMembersData(res.data[0].members);
        setPageId(res.data[0]._id);
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

  function handleDelete(usr, idx) {
    setJoinReqData((prev) => {
      return prev.filter((item, ind) => {
        return idx !== ind;
      });
    });
  }

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
        {joinReqData ? (
          joinReqData.map((usr, idx) => {
            return (
              <MenuItem
                style={{
                  textAlign: "center",
                  alignItems: "center",
                  display: "flex",
                  margin: "auto",
                }}
              >
                {usr}{" "}
                <CheckBoxIcon
                  style={{ marginLeft: "200px" }}
                  onClick={() => {
                    axios
                      .post(
                        "http://localhost:4000/users/handlejoin",
                        {
                          pageName: pageName.name,
                          members: usr,
                          joinRequests: usr,
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
                        "http://localhost:4000/users/updatestatsjoins",
                        {
                          _id: pageId,
                          noJoins: membersData.length,
                        },
                        {
                          headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer:${props.jwt}`,
                          },
                        }
                      )
                      .then((res) => {
                        handleDelete(usr, idx);
                        setMembersData([...membersData], usr);
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
                <CancelIcon
                  onClick={() => {
                    const idx = joinReqData.indexOf(usr);
                    joinReqData.splice(idx, 1);

                    axios
                      .post(
                        "http://localhost:4000/users/handlejoin",
                        {
                          pageName: pageName.name,
                          members: "",
                          joinRequests: usr,
                        },
                        {
                          headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer:${props.jwt}`,
                          },
                        }
                      )
                      .then((res) => {
                        setJoinReqData(res.data[0].joinrequests);
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
          })
        ) : (
          <>
            <></>
          </>
        )}
        {/* {blockedUsersData.map((usr) => {
          return (
            <MenuItem
              style={{
                backgroundColor: "red",
                textAlign: "center",
                alignItems: "center",
                display: "flex",
                margin: "auto",
              }}
            >
              {usr}  (Blocked)
            </MenuItem>
          );
        })} */}
      </div>
    </div>
  );
}
