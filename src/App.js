import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { CircularProgress, Pagination } from "@mui/material";
import PlanetCard from "./components/PlanetCard";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

function App() {
  const [planetData, setPlanetData] = useState({ results: [] });
  const [selectedPlanet, setSelectedPlanet] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    fetchPlanets();
  }, [page]);

  const fetchPlanets = () => {
    setLoading(true);
    axios({
      method: "GET",
      url: "https://swapi.dev/api/planets/?format=json",
      params: {
        page: page,
      },
    })
      .then((response) => {
        setPlanetData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <div className="mainContainer">
      {muted ? (
        <VolumeOffIcon
          onClick={() => setMuted(!muted)}
          className="audioIcon"
          fontSize="small"
          sx={{ color: "white" }}
        />
      ) : (
        <VolumeUpIcon
          onClick={() => setMuted(!muted)}
          className="audioIcon"
          fontSize="small"
          sx={{ color: "white" }}
        />
      )}
      <video
        src="/Background.mp4"
        loop
        className="videoBg"
        autoPlay
        muted={muted}
      />
      <audio autoPlay loop src="/Cosmos.mp3" muted={muted}></audio>
      <h1 className="mainHeading">
        <img src="/assets/StarWars.jpg" className="starWars" alt="starWars" />
        Planets Directory
      </h1>
      {loading ? (
        <>
          <CircularProgress size={1} thickness={4} className="loader" />
          <h2 className="loaderText">Getting Planets Info...</h2>
        </>
      ) : (
        <>
          <div className="allPlanetsContainer">
            {planetData.results.map((eachPlanet, i) => {
              return (
                <div
                  key={i}
                  className="eachPlanetCard"
                  onClick={() => {
                    setOpen(true);
                    setSelectedPlanet(eachPlanet);
                  }}
                >
                  <span>Planet</span>
                  <h3 className="planetName">{eachPlanet.name}</h3>
                </div>
              );
            })}
          </div>
          <Pagination
            count={6}
            page={page}
            onChange={handleChange}
            className="pagination"
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-page": {
                color: "white",
                fontSize: "20px",
                marginInline: "10px",
              },
            }}
          />
        </>
      )}

      {open && (
        <PlanetCard
          selectedPlanet={selectedPlanet}
          handleDialogClose={handleDialogClose}
          open={open}
        />
      )}
    </div>
  );
}

export default App;
