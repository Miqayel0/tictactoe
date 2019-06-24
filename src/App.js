import React from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";
import Game from "./components/Game/Play";
import Home from "./components/Game/Home"
import "./App.css";

function App() {
    return (
        <div className="App">
            <Switch>
                <Route path="/sign-up" exact component={Register} />
                <Route path="/sign-in" exact component={Login} />
                <Route path="/play" exact component={Game} />
                <Route path="/home" exact component={Home} />
                <Redirect to="/sign-in" />
            </Switch>
        </div>
    );
}

export default withRouter(App);
