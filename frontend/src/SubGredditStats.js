import * as React from "react";
import { useParams } from "react-router-dom";
import Navbar from "./NavbarDashboard";
import "./pages/SubGredditPage.css";
import { useState } from "react";
import SubGredditNav from "./navbars/SubGreddiitPageNavbar";
import axios from "axios";
import { MenuItem } from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart } from "react-chartjs-2";

export default function SubGredditStats(props) {
  const pageName = useParams();

  const [pageData, setPageData] = useState({});
  const [dateData, setDateData] = useState([]);
  const [visitorData, setVisitorData] = useState([]);
  const [membersData, setMembersData] = useState([]);
  const [postsData, setPostsData] = useState([]);
  const [deleteData, setDeleteData] = useState([]);
  const [reportsData, setReportsData] = useState([]);

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
        setPageData(res.data[0]);
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
    axios
      .post(
        "http://localhost:4000/users/getstats",
        { _id: pageData._id },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${props.jwt}`,
          },
        }
      )
      .then((res) => {
        const sortedData = res.data.sort((a, b) => {
          const date1 = new Date(a.dataDate);
          const date2 = new Date(b.dataDate);
          if (date2 > date1) {
            return -1;
          }
          if (date2 < date1) {
            return 1;
          }
        });

        setDateData(
          sortedData.map((el) => {
            return el.dataDate;
          })
        );

        setVisitorData(
          sortedData.map((el) => {
            return el.noVisitors;
          })
        );

        setPostsData(
          sortedData.map((el) => {
            return el.noPosts;
          })
        );

        setMembersData(
          sortedData.map((el) => {
            return el.noJoins;
          })
        );

        setReportsData(
          sortedData.map((el) => {
            return el.noReports;
          })
        );

        setDeleteData(
          sortedData.map((el) => {
            return el.noDeletedReports;
          })
        );
      })
      .catch((error) => {
        if (error.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(error.response.data.message);
        }
      });
  }, [pageData]);

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
        <Line
          data={{
            labels: dateData,
            datasets: [
              {
                label: "New Members",
                fill: false,
                lineTension: 0.5,
                backgroundColor: "rgba(75,192,192,1)",
                borderColor: "rgba(0,0,0,1)",
                borderWidth: 2,
                data: membersData,
              },
            ],
          }}
          options={{
            title: {
              display: true,
              text: "New members every day",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />
        <Line
          data={{
            labels: dateData,
            datasets: [
              {
                label: "New Posts",
                fill: false,
                lineTension: 0.5,
                backgroundColor: "rgba(75,192,192,1)",
                borderColor: "rgba(0,0,0,1)",
                borderWidth: 2,
                data: postsData,
              },
            ],
          }}
          options={{
            title: {
              display: true,
              text: "New Posts every day",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />
        <Line
          data={{
            labels: dateData,
            datasets: [
              {
                label: "Daily Visitors",
                fill: false,
                lineTension: 0.5,
                backgroundColor: "rgba(75,192,192,1)",
                borderColor: "rgba(0,0,0,1)",
                borderWidth: 2,
                data: visitorData,
              },
            ],
          }}
          options={{
            title: {
              display: true,
              text: "New members every day",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />

        <Line
          data={{
            labels: dateData,
            datasets: [
              {
                label: "New Reports",
                fill: false,
                lineTension: 0.5,
                backgroundColor: "rgba(75,192,192,1)",
                borderColor: "rgba(0,0,0,1)",
                borderWidth: 2,
                data: reportsData,
              },
              {
                label: "Deleted Reports",
                fill: false,
                lineTension: 0.5,
                backgroundColor: "red",
                borderColor: "rgba(0,0,0,1)",
                borderWidth: 2,
                data: deleteData,
              },
            ],
          }}
          options={{
            title: {
              display: true,
              text: "New Posts every day",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />
      </div>
    </div>
  );
}
