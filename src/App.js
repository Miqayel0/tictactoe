import React, { useState, useEffect } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";
import Game from "./components/Game/Play";
import HomeTest from "./components/Game/Home/HomeTest";
import Layout from "../src/hoc/Layout/Layout";
import "./App.css";

function App(props) {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        console.log("Helllloooo")
        function checkOut() {
            const token = localStorage.getItem("accessToken");
            console.log("Token");
            if (token) {
                setIsAuth(true);
                props.history.push("/home");
            } else {
                props.history.push("/sign-in");
            }
        }
        checkOut();
    }, [isAuth]);

    let routes = (
        <Switch>
            <Route path="/sign-up" exact component={Register} />
            <Route path="/sign-in" exact component={Login} />
            <Redirect to="/sign-in" />
        </Switch>
    );

    if (isAuth) {
        routes = (
            <Layout>
                <Switch>
                    <Route path="/play" exact component={Game} />
                    <Route path="/home" exact component={HomeTest} />
                    <Redirect to="/home" />
                </Switch>
            </Layout>
        );
    }
    console.log("IsAuth", isAuth);
    return <div className="App">{routes}</div>;
}

export default withRouter(App);
