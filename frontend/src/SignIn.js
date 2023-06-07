import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/Mitanshk01">
        Mitansh
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn(props) {
  const navigate = useNavigate();

  const [isButtonLoading, setButtonLoading] = React.useState(false);
  const [data, setData] = useState({
    emailId: "",
    passWord: "",
  });

  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: [event.target.value] });
  };

  const handleSubmit = (event) => {
    setButtonLoading(true);
    event.preventDefault();
    const sData = JSON.stringify({
      emailId: data.emailId[0],
      passWord: data.passWord[0],
    });

    axios
      .post("http://localhost:4000/users/find", sData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        alert("Authenticated!");
        setButtonLoading(false);
        props.setEmailId(res.data.data.user.emailId);
        localStorage.setItem("userTok", res.data.token);
        props.setJwt(res.data.token);
        props.JwtState(true);
        navigate("/DashBoard");
      })
      .catch(() => {
        alert("Incorrect Username/Password!");
        setButtonLoading(false);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="emailId"
              autoComplete="email"
              autoFocus
              onChange={changeHandler}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="passWord"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={changeHandler}
            />
            {isButtonLoading ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </div>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={data.userName == "" || data.passWord == ""}
                style={{
                  backgroundColor:
                    data.userName == "" || data.passWord == "" ? "red" : "",
                }}
              >
                Sign In
              </Button>
            )}
            <Grid container>
              <Grid item>
                <Link
                  variant="body2"
                  href="#"
                  onClick={() => props.onFormSwitch("register")}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
