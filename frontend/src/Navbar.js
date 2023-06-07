import React, { useState } from "react";
import SignIn from "./SignIn";
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
import { fontStyle, style } from "@mui/system";

export default function Navbar(props) {
  const theme = useTheme();
  // console.log(theme);
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  // console.log(isMatch);

  return (
    <React.Fragment>
      <AppBar sx={{ background: "#063970" }}>
        <Toolbar>
          <RedditIcon sx={{ transform: "scale(2)" }} />
          <Typography
            sx={{ fontSize: "2rem", paddingLeft: "2%", fontFamily: "Roboto" }}
          >
            GReddiit
          </Typography>
          {/* {isMatch ? (
            <>
              <Typography sx={{ fontSize: "2rem", paddingLeft: "10%" }}>
                GReddiit
              </Typography>
            </>
          ) : ( */}
          <>
            <Button
              sx={{ marginLeft: "1192px" }}
              variant="contained"
              onClick={() => props.onFormSwitch("")}
            >
              Home
            </Button>
            <Button
              sx={{ marginLeft: "auto" }}
              variant="contained"
              onClick={() => props.onFormSwitch("login")}
            >
              Login
            </Button>
            <Button
              sx={{ marginLeft: "10px" }}
              variant="contained"
              onClick={() => props.onFormSwitch("register")}
            >
              SignUp
            </Button>
          </>
          {/* )} */}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
