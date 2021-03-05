import * as React from "react";
import { useParams } from "react-router-dom";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import RatesTable from "../components/RatesTable";
import CircularProgress from "@material-ui/core/CircularProgress";

const HomePage = () => {
  const [pair, setPair] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [invalidFormat, setInvalidFormat] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);

  let { c1, c2 } = useParams();
  React.useEffect(() => {
    const urlPair = `${c1}/${c2}`;
    if (c1 && c2) {
      setPair(urlPair);
      searchData(`${c1}${c2}`);
    }
  }, [c1, c2]);

  const searchData = (pairData) => {
    setIsSearching(true);
    fetch(`http://localhost:8080/${pairData}`).then(
      async (result) => {
        const responseData = await result.json();
        setRows(responseData);
        setIsSearching(false);
      },
      (error) => {
        setIsSearching(false);
        console.log(error);
      }
    );
  };

  const search = (event) => {
    event.preventDefault();
    setInvalidFormat(!pair.includes("/"));
    if (!invalidFormat && pair) {
      const pairValues = pair.split("/");
      const pairData = pairValues[0] + pairValues[1];
      searchData(pairData);
    }
  };

  const handlePairChange = (event) => {
    setPair(event.target.value);
  };

  return (
    <div className="App" style={{ marginTop: "50px" }}>
      <form onSubmit={search}>
        <TextField
          style={{ width: "30%" }}
          error={invalidFormat}
          label="Enter pair value (example BTC/USD)"
          onChange={handlePairChange}
          value={pair}
        />
        <br />
        <Button
          style={{ marginTop: "10px" }}
          type="submit"
          variant="contained"
          disabled={isSearching}
        >
          Search
        </Button>
      </form>
      <div style={{ marginTop: "30px" }}>
        {isSearching ? (
          <CircularProgress />
        ) : (
          <RatesTable rows={rows} setRows={setRows} pairData={pair} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
