import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from 'react-redux'
import './App.css';
import Main from "./pages/Main";
import SavedPosts from "./pages/SavedPosts";
import customSearch from "./pages/customSearch"
import adminPage from "./pages/admin"
import store from './store'

function App() {
  return (
    <Provider store={store}>
      <Router>
            <Switch>
              <Route exact path="/" component={Main} />
              <Route exact path="/savedPosts" component={SavedPosts} />
              <Route exact path="/customSearch" component={customSearch} />
              <Route exact path="/admin" component={adminPage} />
            </Switch>
            {/* <Footer/> */}
        </Router>
    </Provider>
  );
}

export default App;
