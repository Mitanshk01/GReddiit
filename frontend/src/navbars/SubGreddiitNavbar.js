import * as React from "react";
import "../SubGreddiitNavbarStyle.css";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

export default function SubGredditNavbar(props) {
  const [searchData, setSearchData] = useState({
    data: "",
  });
  
  const handleChange = (event) => {
    event.preventdefault();
    setSearchData({ ...searchData, [event.target.name]: [event.target.value] });
  };

  return (
    <div>
      <div>
        <form>
          <TextField
            style={{
              textAlign: "center",
              margin: "auto",
              width: "30%",
              marginLeft: "100px",
            }}
            label="Search a SubGreddiit"
            variant="outlined"
            onChange={handleChange}
            size="small"
          />
          <IconButton type="submit" aria-label="search">
            <SearchIcon style={{ fill: "blue" }} />
          </IconButton>
        </form>
      </div>
    </div>
  );
}
