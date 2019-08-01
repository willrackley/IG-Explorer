import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Main from "./pages/Main";

function App() {
  return (
    <Router>
          {/* <Nav /> */}
          <Switch>
            <Route exact path="/" component={Main} />
          </Switch>
          {/* <Footer/> */}
      </Router>
  );
}

export default App;
