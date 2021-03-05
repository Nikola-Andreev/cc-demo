import * as React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import DetailsModal from "./DetailsModal";
import Button from "@material-ui/core/Button";

const RatesTable = ({ rows, setRows, pairData }) => {
  const [direction, setDirection] = React.useState("asc");
  const [platformName, setPlatformName] = React.useState("");
  const [detailsData, setDetailsData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [isSearchingDetails, setIsSearchingDetails] = React.useState(false);

  const sort = () => {
    if (direction === "asc") {
      sortAsc();
      setDirection("desc");
    } else {
      sortDesc();
      setDirection("asc");
    }
  };

  const sortAsc = () => {
    setRows(
      [...rows].sort((r1, r2) => Number(r1.data ?? 0) - Number(r2.data ?? 0))
    );
  };

  const sortDesc = () => {
    setRows(
      [...rows].sort((r1, r2) => Number(r2.data ?? 0) - Number(r1.data ?? 0))
    );
  };

  const openModal = (name) => {
    getDetails(name);
    setPlatformName(name);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const getDetails = (name) => {
    setIsSearchingDetails(true);
    const pairValues = pairData.split("/");
    const pair = pairValues[0] + pairValues[1];
    fetch(`http://localhost:8080/history/${name}/${pair}`).then(
      async (result) => {
        const responseData = await result.json();
        setDetailsData(responseData);
        setIsSearchingDetails(false);
      },
      (error) => {
        console.log(error);
        setIsSearchingDetails(false);
      }
    );
  };

  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography style={{ fontWeight: 600 }}>Platform Name</Typography>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                style={{ fontWeight: 600 }}
                onClick={sort}
                direction={direction}
              >
                Current Price
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">
                {row.data ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={row.data ? () => openModal(row.name) : () => {}}
                  >
                    {Number(row.data).toFixed(2)}
                  </Button>
                ) : (
                  "N/A"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {open && (
        <DetailsModal
          open={open}
          closeModal={closeModal}
          pairData={pairData}
          platformName={platformName}
          detailsData={detailsData}
          isSearchingDetails={isSearchingDetails}
        />
      )}
    </TableContainer>
  );
};

export default RatesTable;
