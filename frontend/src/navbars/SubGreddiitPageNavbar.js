import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../pages/SubGredditPage.css";
import { useState } from "react";
import { Button } from "@mui/material";

export default function SubGredditNav(props) {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);

  console.log(props.pageName);

  return (
    <nav className="navbar">
      <div className="toggle-container" onClick={() => setOpen(!isOpen)}>
        <div className={`toggle-bar ${isOpen ? "change" : ""}`}></div>
        <div className={`toggle-bar ${isOpen ? "change" : ""}`}></div>
        <div className={`toggle-bar ${isOpen ? "change" : ""}`}></div>
      </div>
      <div className={`nav-links ${isOpen ? "show-nav" : ""}`}>
        <Button
          className="nav-link"
          onClick={() => {
            navigate(`/MySubG/${props.pageName.name}`);
          }}
        >
          Home
        </Button>
        <Button
          className="nav-link"
          onClick={() => {
            navigate(`/MySubG/${props.pageName.name}/users`);
          }}
        >
          Users
        </Button>
        <Button
          className="nav-link"
          onClick={() => {
            navigate(`/MySubG/${props.pageName.name}/joinRequests`);
          }}
        >
          Join Requests
        </Button>
        <Button
          className="nav-link"
          onClick={() => {
            navigate(`/MySubG/${props.pageName.name}/stats`);
          }}
        >
          Stats
        </Button>
        <Button
          className="nav-link"
          onClick={() => {
            navigate(`/MySubG/${props.pageName.name}/reports`);
          }}
        >
          Reports
        </Button>
      </div>
    </nav>
  );
}
