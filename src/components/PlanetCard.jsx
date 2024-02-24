import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { AccordionSummary, Dialog, Typography } from "@mui/material";
import "./PlanetCard.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function PlanetCard(props) {
  const { selectedPlanet, handleDialogClose, open } = props;
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPlanet) {
      getResidents();
    }
  }, [selectedPlanet]);

  const getResidents = () => {
    if (selectedPlanet.residents.length > 0) {
      setLoading(true);
      Promise.all(
        selectedPlanet.residents.map((residentUrl) =>
          axios.get(residentUrl).then((response) => response.data)
        )
      )
        .then((residentData) => {
          setResidents(residentData);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  };

  const residentHeaders = [
    "Name",
    "Height",
    "Mass",
    "Hair Color",
    "Skin Color",
    "Eye Color",
    "Birth Year",
    "Gender",
  ];

  return (
    <Dialog
      open={open}
      PaperProps={{ sx: { height: "90%" } }}
      onClose={handleDialogClose}
      maxWidth="md"
      fullWidth
    >
      <CloseIcon
        className="closeIcon"
        fontSize="small"
        onClick={handleDialogClose}
      />
      {loading ? (
        <dic className="loader">
          <img src="/assets/loader.gif" alt="loading" className="loading" />
          <h4>Hold on. Getting Planet Details...</h4>
        </dic>
      ) : (
        <div className="planetDetailsCard">
          <p className="dialogTitle">
            Planet '
            <strong className="planetName">{selectedPlanet.name}</strong>'
          </p>
          <div className="divisions">
            <div className="planetCard">
              <img
                src="/assets/gravity.png"
                alt="category"
                className="categoryImage"
              />
              <strong>Gravity</strong>
              <p className="category">{selectedPlanet.gravity}</p>
            </div>
            <div className="planetCard">
              <img
                src="/assets/rotation_period.png"
                alt="category"
                className="categoryImage"
              />
              <strong>Rotation Period</strong>
              <p className="category">{selectedPlanet.rotation_period}</p>
            </div>
          </div>
          <div className="divisions">
            <div className="planetCard">
              <img
                src="/assets/orbital_period.png"
                alt="category"
                className="categoryImage"
              />
              <strong>Orbital Period: </strong>
              <p className="category">{selectedPlanet.orbital_period}</p>
            </div>
            <div className="planetCard">
              <img
                src="/assets/diameter.png"
                alt="category"
                className="categoryImage"
              />
              <strong>Diameter</strong>
              <p className="category">{selectedPlanet.diameter}</p>
            </div>
          </div>
          <div className="divisions">
            <div className="planetCard">
              <img
                src="/assets/terrain.png"
                alt="category"
                className="categoryImage"
              />
              <strong>Terrain</strong>
              <p className="category">{selectedPlanet.terrain}</p>
            </div>
            <div className="planetCard">
              <img
                src="/assets/surface_water.png"
                alt="category"
                className="categoryImage"
              />
              <strong>Surface Water</strong>
              <p className="category">{selectedPlanet.surface_water}</p>
            </div>
          </div>
          <div className="planetCard">
            <img
              src="/assets/population.png"
              alt="category"
              className="categoryImage"
            />
            <strong>Population</strong>
            <p className="category">{selectedPlanet.population}</p>
          </div>
          {residents.length > 0 ? (
            <div className="residentsInfo">
              <h3 className="noOneText">Residents ({residents.length})</h3>
              <div className="accordionContainer">
                {residents.map((resident, index) => (
                  <Accordion key={index}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel-${index}-content`}
                      id={`panel-${index}-header`}
                    >
                      <Typography>{resident.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper}>
                        <Table
                          sx={{ minWidth: 650 }}
                          aria-label="resident table"
                        >
                          <TableHead>
                            <TableRow className="columnHeader">
                              {residentHeaders.map((header, index) => (
                                <TableCell
                                  key={index}
                                  className="tableHeaderCell"
                                >
                                  {header}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              {residentHeaders.map((header, index) => (
                                <TableCell key={index} className="tableColumns">
                                  {
                                    resident[
                                      header.toLowerCase().replace(" ", "_")
                                    ]
                                  }
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </div>
            </div>
          ) : (
            <p className="noOneText">
              No one is residing on {selectedPlanet.name} at the moment
            </p>
          )}
        </div>
      )}
    </Dialog>
  );
}
