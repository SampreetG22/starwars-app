import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { CircularProgress, Pagination } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import useSound from "use-sound";
import PlanetCard from "./components/PlanetCard";

function App() {
  const [planetData, setPlanetData] = useState({ results: [] });
  const [selectedPlanet, setSelectedPlanet] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [muted, setMuted] = useState(true);

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

  const [play, { stop }] = useSound("/Cosmos.mp3", { volume: 0.8, loop: true });
  useEffect(() => {
    if (!muted) {
      play();
    } else {
      stop();
    }
  }, [muted, play, stop]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <div className="mainContainer">
      {muted ? (
        <Tooltip
          title="Turn on audio"
          placement="left"
          TransitionComponent={Zoom}
        >
          <VolumeOffIcon
            id="volumeOff"
            onClick={() => {
              play();
              setMuted(!muted);
            }}
            className="audioIcon"
            fontSize="small"
            sx={{ color: "white", fontSize: "2vw" }}
          />
        </Tooltip>
      ) : (
        <Tooltip
          title="Turn off audio"
          placement="left"
          TransitionComponent={Zoom}
        >
          <VolumeUpIcon
            onClick={() => {
              stop();
              setMuted(!muted);
            }}
            className="audioIcon"
            fontSize="small"
            sx={{ color: "white", fontSize: "2vw" }}
          />
        </Tooltip>
      )}
      <video
        className="videoBg"
        src="/BackgroundVideo.mp4"
        type="video/mp4"
        autoPlay
        loop
        muted
      ></video>
      <h1 className="mainHeading">
        Welcome to our exploration of the expansive
        <img src="/assets/StarWars.jpg" className="starWars" alt="starWars" />
        universe
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
                  <span className="planetSpan">
                    Planet
                    <h3 className="planetName">{eachPlanet.name}</h3>
                  </span>
                </div>
              );
            })}
          </div>
          <Pagination
            count={6}
            page={page}
            onChange={handleChange}
            className="pagination"
            color="warning"
            size="large"
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
