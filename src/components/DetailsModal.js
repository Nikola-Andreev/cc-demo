import * as React from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import DetailsTable from "./DetailsTable";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "20%",
    left: "35%",
  },
}));

const DetailsModal = ({
  open,
  closeModal,
  pairData,
  platformName,
  detailsData,
  isSearchingDetails,
}) => {
  const classes = useStyles();

  const body = (
    <div className={classes.paper}>
      <h2 id="simple-modal-title">
        Details {platformName} {pairData}
      </h2>
      {isSearchingDetails ? (
        <div style={{ marginLeft: "45%" }}>
          <CircularProgress />
        </div>
      ) : (
        <DetailsTable detailsData={detailsData} name={platformName} />
      )}
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={closeModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
};

export default DetailsModal;
