import React, { useState } from "react";
import {
  AppBar,
  Button,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RedditIcon from "@mui/icons-material/Reddit";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import { fontStyle, style } from "@mui/system";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import MySubGreddit from "./MySubGreddit";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";

export default function Navbar(props) {
  const navigate = useNavigate();
  const theme = useTheme();
  // console.log(theme);
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  // console.log(isMatch);

  function handleLogout() {
    localStorage.clear();
    console.log("cleared");
    props.JwtState(false);
    navigate("/");
  }

  function handleProfile() {
    navigate("/Profile");
  }

  function handleHome() {
    navigate("/Dashboard");
  }

  function mySubG() {
    navigate("/MySubGreddit");
  }

  function savedPosts() {
    navigate("/SavedPosts");
  }

  return (
    <div>
      <AppBar sx={{ background: "#063970" }}>
        <Toolbar>
          <RedditIcon sx={{ transform: "scale(2)" }} />
          <Typography
            sx={{ fontSize: "2rem", paddingLeft: "2%", fontFamily: "Roboto" }}
          >
            GReddiit
          </Typography>
          <>
            <Button
              sx={{ marginLeft: "1011px" }}
              variant="contained"
              onClick={savedPosts}
            >
              <BookmarkAddedIcon />
            </Button>
            <Button
              sx={{ marginLeft: "auto" }}
              variant="contained"
              onClick={mySubG}
            >
              <MyLocationIcon />
            </Button>
            <Button
              sx={{ marginLeft: "auto" }}
              variant="contained"
              onClick={handleHome}
            >
              <HomeIcon />
            </Button>
            <Button
              sx={{ marginLeft: "auto" }}
              variant="contained"
              onClick={handleProfile}
            >
              <AccountCircleIcon />
            </Button>
            <Button
              sx={{ marginLeft: "auto" }}
              variant="contained"
              onClick={handleLogout}
            >
              <LogoutIcon />
            </Button>
          </>
        </Toolbar>
      </AppBar>
    </div>
  );
}
