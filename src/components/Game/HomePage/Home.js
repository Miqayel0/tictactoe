import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Container from "@material-ui/core/Container";
import { deepOrange } from "@material-ui/core/colors";
import TextField from "@material-ui/core/TextField";
import Axios from "../../../Axios";
import Logo from "../../../assets/img/tic_tac_toe-512.png";

const useStyles = makeStyles(theme => ({
    toolbar: {
        display: "flex",
        justifyContent: "space-between"
    },
    icon: {
        marginRight: theme.spacing(2)
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6)
    },
    heroButtons: {
        marginTop: theme.spacing(4)
    },
    picture: {
        marginTop: theme.spacing(4)
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300
    },
    dense: {
        marginTop: 19
    },
    submit: {
        width: "300px",
        marginTop: theme.spacing(2)
    },
    orangeAvatar: {
        margin: 10,
        color: "#fff",
        backgroundColor: deepOrange[500]
    },
    account: {
        marginBottom: theme.spacing(2)
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6)
    }
}));

const Home = props => {
    const classes = useStyles();
    const [connectClicked, setConnectClicked] = useState(false);
    const [createClicked, setCreateClicked] = useState(false);
    const [matrixSize, setMatrixSize] = useState(0);
    const [firstPlayerTurn, setFirstPlayerTurn] = useState(0);

    const inputChangedHandler = (event, callBack) => {
        callBack(event.target.value);
    };

    const submitHandler = async event => {
        event.preventDefault();

        let formData = new FormData();
        formData.append("matrixSize", matrixSize);
        formData.append("firstPlayerTurn", firstPlayerTurn);
        //formData.append("whosTurn", whosTurn);

        const response = await createGame(formData);
        console.log("[CREATE_GAME_RESPONSE] ", response);

        if (!response || response.status !== 200) {
            return Error();
        } else {
            props.setGameId(response.data.gameId);
            props.history.push(`/play/${response.data.gameId}`);
        }
    };

    const keyPress = async event => {
        if (event.keyCode === 13) {
            let formData = new FormData();
            formData.append("gameId", event.target.value);

            let response = await connectToGame(formData);

            if (!response || response.status !== 200) {
                return Error();
            } else {
                console.log("[response]", response);
                props.history.push(`/play/${response.data.gameId}`);
            }
        }
    };

    const createGame = async formData => {
        const headers = {
            Authorization: localStorage.getItem("accessToken")
        };
        let response = null;

        try {
            response = await Axios.post("/game", formData, {
                headers: headers
            });
        } catch (err) {
            return err.response;
        }

        return response;
    };

    const connectToGame = async formData => {
        let headers = {
            Authorization: localStorage.getItem("accessToken")
        };
        let response = null;
        try {
            response = await Axios.post("/game/attach-player", formData, {
                headers: headers
            });
        } catch (err) {
            return err.response;
        }

        return response;
    };

    const connectChangedHandler = () => {
        setCreateClicked(false);
        setConnectClicked(!connectClicked);
    };

    const createChangedHandler = () => {
        setConnectClicked(false);
        setCreateClicked(!createClicked);
    };
    return (
        <React.Fragment>
            <CssBaseline />
            <div className={classes.heroContent}>
                <Container maxWidth="xs">
                    <Typography
                        component="h1"
                        variant="h2"
                        align="center"
                        color="textPrimary"
                        gutterBottom
                    >
                        TicTacToe
                    </Typography>
                    {props.gameId && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                                props.history.push(`play${props.gameId}`)
                            }
                        >
                            Connect To Game
                        </Button>
                    )}
                    <div className={classes.heroButtons}>
                        <Grid container spacing={2} justify="center">
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={createChangedHandler}
                                >
                                    new game
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={connectChangedHandler}
                                >
                                    connect to game
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                    {connectClicked && (
                        <TextField
                            id="standard-dense"
                            label="Game ID"
                            className={clsx(classes.textField, classes.dense)}
                            margin="dense"
                            onKeyDown={event => keyPress(event)}
                        />
                    )}

                    {createClicked && (
                        <form noValidate>
                            <TextField
                                id="outlined-number"
                                label="Matrix Size"
                                value={matrixSize}
                                onChange={event =>
                                    inputChangedHandler(event, setMatrixSize)
                                }
                                type="number"
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true
                                }}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                id="outlined-dense"
                                label="Your turn (1 - X, 2 - 0)"
                                className={clsx(
                                    classes.textField,
                                    classes.dense
                                )}
                                onChange={event =>
                                    inputChangedHandler(
                                        event,
                                        setFirstPlayerTurn
                                    )
                                }
                                margin="dense"
                                variant="outlined"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={submitHandler}
                                className={classes.submit}
                            >
                                Submit
                            </Button>
                        </form>
                    )}
                    <div className={classes.picture}>
                        <img
                            src={Logo}
                            width="400"
                            height="350"
                            alt="background"
                        />
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Home;
