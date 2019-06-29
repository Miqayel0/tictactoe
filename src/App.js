import React, { useState } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";
import Game from "./components/Game/Play";
import GameHostory from "./components/Game/GameHistory/GameHistory";
import Home from "./components/Game/HomePage/Home";
import Layout from "../src/hoc/Layout/Layout";
import "./App.css";

const App = props => {
    const [isAuth, setIsAuth] = useState(false);
    const [gameId, setGameId] = useState("");

    // useEffect(() => {
    //     function checkOut() {
    //         const token = localStorage.getItem("accessToken");
    //         if (token) {
    //             !isAuth && setIsAuth(true);
    //         } else {
    //             isAuth && setIsAuth(false);
    //         }
    //     }
    //     checkOut();
    // }, [isAuth]);

    (function checkOut() {
        const token = localStorage.getItem("accessToken");
        if (token) {
            !isAuth && setIsAuth(true);
        } else {
            isAuth && setIsAuth(false);
        }
    })();

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
                    <Route
                        path="/play/:gameId"
                        exact
                        render={props => <Game {...props} gameId={gameId} />}
                    />
                    <Route
                        path="/home"
                        exact
                        render={props => (
                            <Home {...props} setGameId={setGameId} />
                        )}
                    />
                    <Route path="/game-history" exact component={GameHostory} />
                    <Redirect to="/home" />
                </Switch>
            </Layout>
        );
    }
    console.log("[IS_AUTH]", isAuth);
    return <div className="App">{routes}</div>;
};

export default withRouter(App);
