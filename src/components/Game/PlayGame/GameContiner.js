import React, { Component } from "react";
import { HubConnectionBuilder } from "@aspnet/signalr";
import { withRouter } from "react-router";
import Axios from "../../../Axios";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Board from "./components/Board.js";
import PlayerInfo from "./components/PlayerInfo.js";
import GameoverDialog from "./components/GameoverDialog.js";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { isDraw, isWinner } from "./utils/util";

const styles = theme => ({
    Typo: {
        marginTop: theme.spacing(3),
        display: "inline",
    },
    Div: {
        margin: theme.spacing(2),
    },
    matg: {
        marginTop: theme.spacing(2),
    },
});

class Game extends Component {
    state = {
        showDialog: false,
        nick: "",
        message: "",
        messages: [],
        hubConnection: null,
        board: [[]],
        gameover: false,
        winner: -1,
        value: null,
        hasWinner: false,
        row: null,
        col: null,
        player: null,
        allowMove: true,
        errMessage: "",
    };

    get gameId() {
        const {
            match: { params },
        } = this.props;

        return params.gameId || null;
    }

    get userId() {
        return localStorage.getItem("userId") || null;
    }

    componentDidMount = async () => {
        const hubToken = localStorage.getItem("hubToken");
        let response = await this.getGameById(this.gameId);
        let playerRessponse = await this.getPlayerNumber(this.gameId);

        if (
            !response ||
            response.status !== 200 ||
            !playerRessponse ||
            playerRessponse.status !== 200
        ) {
            console.log("Error");
            return new Error();
        }
        console.log("[GAME_ID]", response.data);
        console.log("[PLAYER_NUMER]", playerRessponse.data);

        const {
            matrixSize,
            firstPlayerTurn,
            secondPlayerTurn,
            moves,
        } = response.data;
        const { player } = playerRessponse.data;
        let playerValue = null;

        if (player === 1) {
            playerValue = firstPlayerTurn;
        } else if (player === 2) {
            playerValue = secondPlayerTurn;
        }

        let board = Array(matrixSize)
            .fill(0)
            .map(() => Array(matrixSize).fill(0));

        moves.forEach(m => (board[m.row][m.col] = m.value));

        const hubConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:5001/play", {
                accessTokenFactory: () => hubToken,
            })
            .build();

        this.setState(
            { hubConnection, board, value: playerValue, player },
            () => {
                this.state.hubConnection
                    .start()
                    .then(() =>
                        console.log("[SOCKET_CONNECTION] Connection started!")
                    )
                    .catch(err =>
                        console.log(
                            "[SOCKET_CONNECTION] Error while establishing connection :( ",
                            err
                        )
                    );

                this.state.hubConnection.on(
                    "sendToPlayer",
                    (value, row, col) => {
                        this.movePlayer(value, row, col);
                        this.setState({ allowMove: true, errMessage: "" });
                    }
                );
            }
        );
    };

    getGameById = async id => {
        const headers = {
            Authorization: localStorage.getItem("accessToken"),
        };
        let response = null;

        try {
            response = await Axios.get(`/game/${id}`, {
                headers: headers,
            });
        } catch (err) {
            return err.response;
        }

        return response;
    };

    getPlayerNumber = async gameId => {
        const headers = {
            Authorization: localStorage.getItem("accessToken"),
        };
        let response = null;
        try {
            response = await Axios.get(`/game/player-number/${gameId}`, {
                headers: headers,
            });
        } catch (err) {
            return err.response;
        }

        return response;
    };

    notifyMove = (gameId, value, row, col, player) => {
        this.state.hubConnection
            .invoke("getMove", gameId, value, row, col, player)
            .catch(err => console.error(err));
    };

    newGame = () => {
        this.setState({ gameover: false });
    };

    gameover = () => {
        this.setState({ gameover: true });
    };

    winner = value => {
        this.setState({ winner: value });
    };

    /**
     * When a value plays a value we need to mark that spot on the board.  We then need to
     * switch to the next value
     * @param {number} value The current value
     * @param {number} row The row on the board
     * @param {number} col The column on the board
     */

    movePlayer = (value, row, col) => {
        console.log("[PLAYER]", value);
        const updatedBoard = [...this.state.board]; // cloning board
        updatedBoard[row][col] = value;

        this.setState({ board: updatedBoard, allowMove: false });
    };

    checkWinner = (board, value) => {
        // the logic to check if a value has won or the game ended in a draw are in
        // the utils/game.js file.

        // instead of returning a promise like we would if we were making an api call
        // from our operations, we just return a boolean for the game winner
        let hasWinner = true;

        if (isWinner(board, value)) {
            this.winner(value);
            this.gameover();
        } else if (isDraw(board)) {
            this.winner(0);
            this.gameover();
        } else {
            hasWinner = false;
        }

        this.setState({ hasWinner });
    };

    handleBoardOnMove = square => {
        // when a square is clicked we want to mark that square for the current value

        const { board, value, gameover, player, allowMove } = this.state;
        const { row, col } = square;
        // only mark if the game is still in progress and the square is empty (none)
        // otherwise, ignore the play
        if (allowMove === false) {
            this.setState({ errMessage: "Not your turn" });
            return;
        }

        if (gameover || board[row][col] !== 0) {
            return;
        }
        // make a play for the value
        this.movePlayer(value, row, col);
        this.notifyMove(this.gameId, value, row, col, player);

        // then check for the winner

        if (this.state.hasWinner) {
            this.setState({ showDialog: true });
        }
    };

    handleDialogClick = answer => {
        // we only want to start a new game if the value clicks 'yes'
        if (answer) {
            this.newGame();
        }

        // we always want to close the dialog
        this.setState({ showDialog: false });
    };

    handleDialogClose = () => {
        // close the dialog
        this.setState({ showDialog: false });
    };

    render() {
        const {
            showDialog,
            board,
            player,
            gameover,
            winner,
            errMessage,
        } = this.state;
        const { classes } = this.props;
        const draw = winner === 0;

        return (
            // at extra-small (xs) size the grid show have two rows
            // at small (sm+) and above we want 2 columns
            // Grid 'item' in a container must have columns (xs, sm, md, etc.) that add up to 12, per grid docs:
            // https://material-ui-next.com/layout/grid/
            <div className={classes.Typo}>
                {errMessage && (
                    <Typography
                        className={classes.Div}
                        color={"error"}
                        variant="h6"
                    >
                        {errMessage}
                    </Typography>
                )}
                <CopyToClipboard text={this.gameId}>
                    <Typography className={classes.Div} variant="h6">
                        Game ID {this.gameId}
                        {"  "}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                        >
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                        </svg>
                    </Typography>
                </CopyToClipboard>
                <Board board={board} onMove={this.handleBoardOnMove} />
                <PlayerInfo player={player} gameover={gameover} />
                <GameoverDialog
                    open={showDialog}
                    isDraw={draw}
                    player={winner}
                    onClick={this.handleDialogClick}
                    onClose={this.handleDialogClose}
                />
            </div>
        );
    }
}
export default withRouter(withStyles(styles)(Game));
