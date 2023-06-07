import * as React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../NavbarDashboard";
import SubGredditNav from "../navbars/SubGreddiitPageNavbar";

export default function SubGredditPage(props) {
  const pageName = useParams();

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
    </div>
  );
}
