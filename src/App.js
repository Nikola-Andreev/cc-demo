import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Switch>
        <Route path={"/:c1?/:c2?"} component={HomePage} />
      </Switch>
    </Router>
  );
}

export default App;
