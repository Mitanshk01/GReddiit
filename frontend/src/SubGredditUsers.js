import * as React from "react";
import { useParams } from "react-router-dom";
import Navbar from "./NavbarDashboard";
import "./pages/SubGredditPage.css";
import { useState } from "react";
import SubGredditNav from "./navbars/SubGreddiitPageNavbar";
import axios from "axios";
import { MenuItem } from "@mui/material";

export default function SubGredditUsers(props) {
  const pageName = useParams();

  const [usersData, setUsersData] = useState([]);
  const [blockedUsersData, setBlockedUsersData] = useState([]);

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
        setUsersData(res.data[0].members);
        setBlockedUsersData(res.data[0].blockedMembers);
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
        {usersData.map((usr) => {
          return (
            <MenuItem
              style={{
                textAlign: "center",
                alignItems: "center",
                display: "flex",
                margin: "auto",
              }}
            >
              {usr}
            </MenuItem>
          );
        })}
        {blockedUsersData.map((usr) => {
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
              {usr} (Blocked)
            </MenuItem>
          );
        })}
      </div>
    </div>
  );
}
