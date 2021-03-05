import * as React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

const DetailsTable = ({ detailsData, name }) => {
  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography style={{ fontWeight: 600 }}>Sell</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography style={{ fontWeight: 600 }}>Buy</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {detailsData && detailsData.length ? (
            detailsData.map((data, index) => (
              <TableRow key={btoa(index)}>
                <TableCell component="th" scope="row">
                  {data[0]}
                </TableCell>
                <TableCell align="right">{data[1]}</TableCell>
              </TableRow>
            ))
          ) : (
            <div>The details for {name} are not available yet.</div>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DetailsTable;
