import React, { useState } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import "./App.css";
import Home from "./Home";
import axios from "axios";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import MySubGreddit from "./MySubGreddit";
import SubGredditPage from "./pages/SubGredditPage";
import SubGredditUsers from "./SubGredditUsers";
import SubGredditJoin from "./SubGredditJoin";
import AllSubGredditPage from "./pages/AllSubGredditPage";
import SavedPosts from "./pages/SavedPosts";
import SubGredditReports from "./SubGredditReports";
import SubGredditStats from "./SubGredditStats";

export default function App() {
  const [form, setForm] = useState("");
  const [jwtState, setJwtState] = useState(false);

  const [emailId, setEmailId] = useState("");

  const [loading, setLoading] = useState(0);

  const [jwt, setJwt] = React.useState(localStorage.getItem("userTok"));

  React.useEffect(() => {
    if (jwt) {
      axios
        .get("http://localhost:4000/users/auth", {
          headers: { authorization: `Bearer:${jwt}` },
        })
        .then((res) => {
          setEmailId(res.data.user.emailId);
          setJwtState(true);
          setLoading(1);
        })
        .catch((err) => {
          setJwtState(false);
        });
    } else {
      setLoading(1);
    }
  }, []);

  return (
    <div>
      {loading === 0 ? (
        <div>
          <p>Loading</p>
        </div>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route
              exact
              path="/"
              element={
                !jwtState ? (
                  <Home
                    formval={form}
                    funcForm={setForm}
                    JwtState={setJwtState}
                    jwt={jwt}
                    setJwt={setJwt}
                    emailId={emailId}
                    setEmailId={setEmailId}
                  />
                ) : (
                  <Dashboard
                    jwt={jwt}
                    setJwt={setJwt}
                    JwtState={setJwtState}
                    emailId={emailId}
                    setEmailId={setEmailId}
                  />
                )
              }
            ></Route>
            <Route
              exact
              path="/Dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard
                    auth={jwtState}
                    JwtState={setJwtState}
                    emailId={emailId}
                    setEmailId={setEmailId}
                    jwt={jwt}
                    setJwt={setJwt}
                  />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              exact
              path="/Profile"
              element={
                <ProtectedRoute>
                  <Profile
                    auth={jwtState}
                    JwtState={setJwtState}
                    jwt={jwt}
                    setJwt={setJwt}
                    emailId={emailId}
                    setEmailId={setEmailId}
                  />
                </ProtectedRoute>
              }
            ></Route>

            <Route
              exact
              path="/MySubGreddit"
              element={
                <ProtectedRoute>
                  <MySubGreddit
                    auth={jwtState}
                    JwtState={setJwtState}
                    jwt={jwt}
                    setJwt={setJwt}
                    emailId={emailId}
                  />
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="/MySubG/:name"
              element={
                <ProtectedRoute>
                  <SubGredditPage
                    auth={jwtState}
                    JwtState={setJwtState}
                    jwt={jwt}
                    setJwt={setJwt}
                    emailId={emailId}
                  />
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="/SavedPosts"
              element={
                <ProtectedRoute>
                  <SavedPosts
                    JwtState={setJwtState}
                    jwt={jwt}
                    setJwt={setJwt}
                    auth={jwtState}
                    emailId={emailId}
                  />
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="/MySubG/:name/users"
              element={
                <ProtectedRoute>
                  <SubGredditUsers
                    JwtState={setJwtState}
                    jwt={jwt}
                    setJwt={setJwt}
                    auth={jwtState}
                    emailId={emailId}
                  />
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="/MySubG/:name/joinRequests"
              element={
                <ProtectedRoute>
                  <SubGredditJoin
                    JwtState={setJwtState}
                    jwt={jwt}
                    setJwt={setJwt}
                    auth={jwtState}
                    emailId={emailId}
                  />
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="/MySubG/:name/stats"
              element={
                <ProtectedRoute>
                  <SubGredditStats
                    JwtState={setJwtState}
                    jwt={jwt}
                    setJwt={setJwt}
                    auth={jwtState}
                    emailId={emailId}
                  />
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="/MySubG/:name/reports"
              element={
                <ProtectedRoute>
                  <SubGredditReports
                    JwtState={setJwtState}
                    jwt={jwt}
                    setJwt={setJwt}
                    auth={jwtState}
                    emailId={emailId}
                  />
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="/AllSubG/:name"
              element={
                <ProtectedRoute>
                  <AllSubGredditPage
                    JwtState={setJwtState}
                    jwt={jwt}
                    setJwt={setJwt}
                    emailId={emailId}
                    auth={jwtState}
                  />
                </ProtectedRoute>
              }
            ></Route>
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}
