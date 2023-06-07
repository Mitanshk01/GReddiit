import React from "react";
import Navbar from "./NavbarDashboard";
import { useState } from "react";
import axios from "axios";
import { Box, tableRowClasses } from "@mui/material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Fuse from "fuse.js";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { FormControl } from "@mui/material";
import { Chip, CircularProgress } from "@mui/material";

export default function Dashboard(props) {
  const [searchData, setSearchData] = useState({
    data: "",
  });

  const [isButtonLoading2, setButtonLoading2] = React.useState(false);

  const [clickSort, setClickSort] = useState(false);

  const [tagSort, setTagSort] = useState(false);

  const handleChange = (event) => {
    setSearchData({ ...searchData, data: [event.target.value] });
  };

  const navigate = useNavigate();

  const [moderators, setModerator] = useState([]);
  const [allSubG, setAllSubG] = useState([]);
  const [selectedSort, setSelectedSort] = useState([]);
  const [joinReq, setJoinReq] = useState([]);
  const [leftSubG, setLeftSubG] = useState([]);
  const [tags, setTags] = React.useState([]);
  const [tagVal, setTagVal] = React.useState({
    tag: "",
  });

  const [tagSubG, setTagSubG] = React.useState([]);

  const selectionChangeHandler = (event) => {
    setSelectedSort(event.target.value);
  };

  React.useEffect(() => {
    axios
      .post(
        "http://localhost:4000/users/findmysubgreddit",
        {
          emailId: props.emailId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${props.jwt}`,
          },
        }
      )
      .then((res) => {
        let arr = [];
        for (var i = 0; i < res.data.length; i++) {
          arr.push(res.data[i].name);
        }
        setModerator(arr);
      })
      .catch((err) => {
        alert("Error!");
      });
  }, [props.emailId]);

  function handleDelete(SubG, idx) {
    let newA = [];
    setAllSubG((prev) => {
      newA = prev.filter((item, ind) => {
        return idx !== ind;
      });

      newA.push(SubG);

      return newA;
    });
  }

  React.useEffect(() => {
    axios
      .post(
        "http://localhost:4000/users/findallsub",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${props.jwt}`,
          },
        }
      )
      .then((res) => {
        setAllSubG(res.data);

        let tarr1 = [],
          tarr2 = [];

        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].joinrequests.includes(props.emailId)) {
            tarr1.push(res.data[i].name);
          }
          if (res.data[i].leftMembers.includes(props.emailId)) {
            tarr2.push(res.data[i].name);
          }
        }

        setJoinReq(tarr1);

        setLeftSubG(tarr2);
      })
      .catch((error) => {
        if (error.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(error.response.data.message);
        }
      });
  }, [props.emailId]);

  if (!clickSort)
    allSubG.sort((a, b) => {
      if (a.members.includes(props.emailId)) return -1;
      else return 1;
    });

  const handleSort = (event) => {
    setClickSort(true);
    event.preventDefault();

    const toSortData = allSubG;

    if (selectedSort.includes("NameAsc") && selectedSort.includes("NameDesc")) {
      alert("Invalid Sort Input!");
    } else if (selectedSort.length) {
      toSortData.sort((a, b) => {
        if (selectedSort.length >= 1 && selectedSort[0] == "NameAsc") {
          return a.name > b.name ? 1 : -1;
        } else if (selectedSort.length >= 1 && selectedSort[0] == "NameDesc") {
          return a.name < b.name ? 1 : -1;
        } else if (selectedSort.length >= 1 && selectedSort[0] == "Followers") {
          if (a.members.length == b.members.length) {
            if (selectedSort.length >= 2) {
              if (selectedSort[1] == "NameAsc") {
                return a.name > b.name ? 1 : -1;
              } else if (selectedSort[1] == "NameDesc") {
                return a.name < b.name ? 1 : -1;
              } else {
                var c = new Date(a.creationDate);
                var d = new Date(b.creationDate);
                if (c == d) {
                  if (selectedSort.length == 3) {
                    if (selectedSort[2] == "NameAsc") {
                      return a.name > b.name ? 1 : -1;
                    } else if (selectedSort[2] == "NameDesc") {
                      return a.name < b.name ? 1 : -1;
                    }
                  } else return 0;
                } else return d - c;
              }
            } else {
              return 0;
            }
          } else {
            return a.members.length < b.members.length ? 1 : -1;
          }
        } else if (
          selectedSort.length >= 1 &&
          selectedSort[0] == "CreationDate"
        ) {
          var c = new Date(a.creationDate);
          var d = new Date(b.creationDate);
          if (c == d) {
            if (selectedSort.length >= 2) {
              if (selectedSort[1] == "NameAsc") {
                return a.name > b.name ? 1 : -1;
              } else if (selectedSort[1] == "NameDesc") {
                return a.name < b.name ? 1 : -1;
              } else if (selectedSort[1] == "Followers") {
                if (a.members.length == b.members.length) {
                  if (selectedSort.length >= 3) {
                    if (selectedSort[1] == "NameAsc") {
                      return a.name > b.name ? 1 : -1;
                    } else if (selectedSort[1] == "NameDesc") {
                      return a.name < b.name ? 1 : -1;
                    }
                  } else return 0;
                }
                return a.members.length < b.members.length ? 1 : -1;
              }
            } else return 0;
          }
          return d - c;
        }
      });

      setAllSubG([...toSortData]);
    }
  };

  function FuseData() {
    const fuse = new Fuse(allSubG, {
      keys: ["name"],
    });

    return fuse.search(searchData.data[0]).map((res) => {
      return (
        <div
          style={{
            paddingTop: "50px",
            marginLeft: "2%",
            paddingRight: "2%",
          }}
        >
          <Box
            style={{
              backgroundColor: "#f0f0f0",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "1px 2px 9px #F4AAB9",
            }}
          >
            <h3 style={{ textAlign: "center" }}> {res.item.name}</h3>
            <p>Description: {res.item.description}</p>
            <p>Banned Keywords: {res.item.bannedKeyWords}</p>
            <p>No Of Posts: res.item.noPosts</p>
            <p>No Of Members: {res.item.members.length}</p>
          </Box>
        </div>
      );
    });
  }

  const mapArray = (Arr) => {
    return Arr.map((SubG, idx) => {
      return (
        <div
          onClick={(event) => {
            event.cancelBubble = true;
            if (event.stopPropagation) event.stopPropagation();
            if (SubG.members.includes(props.emailId)) {
              axios
                .post(
                  "http://localhost:4000/users/updatestatsvisitors",
                  {
                    _id: SubG._id,
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      authorization: `Bearer:${props.jwt}`,
                    },
                  }
                )
                .then((res) => {})
                .catch((error) => {
                  if (error.response.request.status == 401) {
                    alert("Unauthorized User! Kindly Login!");
                    props.JwtState(false);
                  } else {
                    alert(error.response.data.message);
                  }
                });
              navigate(`/AllSubG/${SubG.name}`);
            }
          }}
          style={{
            paddingTop: "50px",
            marginLeft: "2%",
            paddingRight: "2%",
          }}
        >
          <Box
            style={{
              backgroundColor: "#f0f0f0",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "1px 2px 9px #F4AAB9",
            }}
          >
            <h3 style={{ textAlign: "center" }}> {SubG.name}</h3>
            <p>Description: {SubG.description}</p>
            <p>Banned Keywords: {SubG.bannedKeyWords}</p>
            <p>No Of Posts: {SubG.noPosts}</p>
            <p>No Of Members: {SubG.members.length}</p>
            {SubG.members.includes(props.emailId) ? (
              <Button
                disabled={moderators.includes(SubG.name) ? true : false}
                style={{
                  textAlign: "center",
                  display: "flex",
                  margin: "auto",
                }}
                onClick={(event) => {
                  event.cancelBubble = true;
                  if (event.stopPropagation) event.stopPropagation();
                  axios
                    .post(
                      "http://localhost:4000/users/deletefollowers",
                      {
                        name: SubG.name,
                        emailId: props.emailId,
                      },
                      {
                        headers: {
                          "Content-Type": "application/json",
                          authorization: `Bearer:${props.jwt}`,
                        },
                      }
                    )
                    .catch((err) => {
                      if (err.response.request.status == 401) {
                        alert("Unauthorized User! Kindly Login!");
                        props.JwtState(false);
                      } else {
                        alert(err.response.data.message);
                      }
                    });
                  const ind = SubG.members.indexOf(props.emailId);
                  setLeftSubG([...leftSubG, SubG.name]);
                  SubG.members.splice(ind, 1);
                  handleDelete(SubG, idx);
                }}
              >
                Leave
              </Button>
            ) : isButtonLoading2 ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </div>
            ) : (
              <Button
                disabled={joinReq.includes(SubG.name) ? true : false}
                style={{
                  textAlign: "center",
                  display: "flex",
                  margin: "auto",
                }}
                onClick={(event) => {
                  event.cancelBubble = true;
                  if (event.stopPropagation) event.stopPropagation();

                  if (leftSubG.includes(SubG.name)) {
                    alert(
                      "You had left this SubGreddiit earlier! You cannot join again!"
                    );
                  } else if (SubG.blockedMembers.includes(props.emailId)) {
                    alert(
                      "You have been blocked in this SubGreddiit ! You cannot join again!"
                    );
                  } else {
                    setButtonLoading2(true);
                    axios
                      .post(
                        "http://localhost:4000/users/joinsub",
                        {
                          name: SubG.name,
                          emailId: props.emailId,
                        },
                        {
                          headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer:${props.jwt}`,
                          },
                        }
                      )
                      .then((res) => {
                        setButtonLoading2(false);
                      })
                      .catch((err) => {
                        setButtonLoading2(false);
                        if (err.response.request.status == 401) {
                          alert("Unauthorized User! Kindly Login!");
                          props.JwtState(false);
                        } else {
                          alert(err.response.data.message);
                        }
                      });
                    setJoinReq([...joinReq, SubG.name]);
                  }
                }}
              >
                Join
              </Button>
            )}
          </Box>
        </div>
      );
    });
  };

  return (
    <>
      <div>
        <Navbar JwtState={props.JwtState} />
      </div>
      <div style={{ paddingTop: "100px" }}>
        <form>
          <TextField
            style={{
              textAlign: "center",
              margin: "auto",
              width: "30%",
              marginLeft: "100px",
            }}
            value={searchData.data}
            label="Search a SubGreddiit"
            variant="outlined"
            name="data"
            onChange={handleChange}
            size="small"
          />
          <IconButton type="submit" aria-label="search">
            <SearchIcon style={{ fill: "blue" }} />
          </IconButton>
        </form>
        <FormControl style={{ marginTop: 10, marginLeft: 100 }}>
          <p>Sort SubGreddiits By:</p>
          <Select
            multiple
            value={selectedSort}
            onChange={selectionChangeHandler}
            renderValue={(selected) => (
              <div>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </div>
            )}
          >
            <MenuItem value={"NameAsc"}>Name(Ascending)</MenuItem>
            <MenuItem value={"NameDesc"}>Name(Descending)</MenuItem>
            <MenuItem value={"Followers"}>Followers</MenuItem>
            <MenuItem value={"CreationDate"}>Creation Date</MenuItem>
          </Select>
          <FormHelperText>Select sorting criteria</FormHelperText>
        </FormControl>
        <Button style={{ marginTop: 68, marginLeft: 40 }} onClick={handleSort}>
          Sort
        </Button>
        <Button
          style={{ marginTop: 68, marginLeft: 40 }}
          onClick={() => {
            setTagSort(false);
            setSelectedSort([]);
            setClickSort(false);
          }}
        >
          Default View
        </Button>
        <FormControl>
          <TextField
            style={{ marginTop: 57, marginLeft: 40 }}
            value={tagVal.tag}
            onChange={(event) => {
              setTagVal({ ...tagVal, tag: [event.target.value] });
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                setTags([...tags, tagVal.tag]);
                setTagVal({ tag: "" });
              }
            }}
          ></TextField>
          <FormHelperText style={{ marginLeft: 108 }}>
            Select Tags
          </FormHelperText>
        </FormControl>
        {tags.map((tg, indd) => {
          return (
            <Chip
              style={{ marginLeft: 5, marginTop: 60 }}
              key={tg}
              label={tg}
              onClick={(e) => {
                setTags((prev) => {
                  return prev.filter((item, i) => {
                    return i !== indd;
                  });
                });
              }}
            />
          );
        })}
        <Button
          style={{ marginTop: 68, marginLeft: 30 }}
          onClick={(e) => {
            axios
              .post(
                "http://localhost:4000/users/searchbytag",
                {
                  allTags: tags,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer:${props.jwt}`,
                  },
                }
              )
              .then((res) => {
                setTagSubG((prev) => res.data);
                setTags((prev) => []);
                if (tags.length > 0) setTagSort(true);
              })
              .catch((err) => {
                if (err.response.request.status == 401) {
                  alert("Unauthorized User! Kindly Login!");
                  props.JwtState(false);
                } else {
                  alert(err.response.data.message);
                }
              });
          }}
        >
          Search by Tag
        </Button>
      </div>
      <div>
        {searchData.data == "" ? (
          tagSort == false ? (
            mapArray(allSubG)
          ) : (
            mapArray(tagSubG)
          )
        ) : (
          <div>{<FuseData />}</div>
        )}
      </div>
    </>
  );
}
