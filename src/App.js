import React, { useState, useEffect } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";
import Game from "./components/Game/Play";
import HomeTest from "./components/Game/Home/Home";
import Layout from "../src/hoc/Layout/Layout";
import "./App.css";

const App = props => {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        function checkOut() {
            const token = localStorage.getItem("accessToken");
            if (token) {
                setIsAuth(true);
            } else {
                !isAuth && setIsAuth(false);
            }
        }
        checkOut();
    }, [isAuth]);

    let routes = (
        <Switch>
            <Route path="/sign-up" exact component={Register} />
            <Route
                path="/sign-in"
                exact
                render={props => <Login {...props} setAuth={setIsAuth} />}
            />
            <Redirect to="/sign-in" />
        </Switch>
    );

    if (isAuth) {
        routes = (
            <Layout setAuth={setIsAuth}>
                <Switch>
                    <Route path="/play" exact component={Game} />
                    <Route path="/home" exact component={HomeTest} />
                    <Redirect to="/home" />
                </Switch>
            </Layout>
        );
    }
    console.log("[IS_AUTH]", isAuth);
    return <div className="App">{routes}</div>;
};

export default withRouter(App);
