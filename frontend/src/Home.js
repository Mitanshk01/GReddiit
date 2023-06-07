import React from "react";
import Navbar from "./Navbar";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { Outlet } from "react-router-dom";
import "./App.css";

export default function Home(props) {
  return (
    <div className="bg">
      <Navbar
        onFormSwitch={props.funcForm}
        emailId={props.emailId}
        setEmailId={props.setEmailId}
        jwt={props.jwt}
        setJwt={props.setJwt}
      />

      {props.formval === "login" ? (
        <SignIn
          onFormSwitch={props.funcForm}
          JwtState={props.JwtState}
          emailId={props.emailId}
          setEmailId={props.setEmailId}
          jwt={props.jwt}
          setJwt={props.setJwt}
        />
      ) : props.formval === "register" ? (
        <SignUp onFormSwitch={props.funcForm} />
      ) : (
        <div></div>
      )}
      <Outlet />
    </div>
  );
}
