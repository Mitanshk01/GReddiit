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
import { CircularProgress } from "@mui/material";
import axios from "axios";

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

export default function SignUp(props) {
  const [isButtonLoading, setButtonLoading] = React.useState(false);
  const [data, setData] = React.useState({
    firstName: "",
    lastName: "",
    userName: "",
    emailId: "",
    age: "",
    contactNumber: "",
    passWord: "",
  });

  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: [event.target.value] });
  };

  const handleSubmit = (event) => {
    setButtonLoading(true);
    event.preventDefault();

    const userObj = {
      firstName: data.firstName[0],
      lastName: data.lastName[0],
      userName: data.userName[0],
      emailId: data.emailId[0],
      age: data.age[0],
      contactNumber: data.contactNumber[0],
      passWord: data.passWord[0],
    };

    const sData = JSON.stringify(userObj);

    axios
      .post("http://localhost:4000/users/createuser", sData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        alert("User Registered Successfully! Please Login!");
        setButtonLoading(false);
      })
      .catch((error) => {
        setButtonLoading(false);
        alert("Invalid Details!");
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={changeHandler}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={changeHandler}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="user-name"
                  name="userName"
                  required
                  fullWidth
                  id="userName"
                  label="User Name"
                  autoFocus
                  onChange={changeHandler}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="emailId"
                  autoComplete="email"
                  onChange={changeHandler}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="age"
                  label="Age"
                  name="age"
                  onChange={changeHandler}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="contactNumber"
                  label="Contact Number"
                  name="contactNumber"
                  onChange={changeHandler}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passWord"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={changeHandler}
                />
              </Grid>
            </Grid>
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
                disabled={
                  data.userName == "" ||
                  data.passWord == "" ||
                  data.emailId == "" ||
                  data.firstName == "" ||
                  data.lastName == "" ||
                  data.contactNumber == "" ||
                  data.age == ""
                }
                style={{
                  backgroundColor:
                    data.userName == "" ||
                    data.passWord == "" ||
                    data.emailId == "" ||
                    data.firstName == "" ||
                    data.lastName == "" ||
                    data.contactNumber == "" ||
                    data.age == ""
                      ? "red"
                      : "",
                }}
              >
                Sign Up
              </Button>
            )}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => props.onFormSwitch("login")}
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
