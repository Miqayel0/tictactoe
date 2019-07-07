import React, { Component } from "react";
import { HubConnectionBuilder } from "@aspnet/signalr";
import Grid from "@material-ui/core/Grid";
import { withRouter } from "react-router";
import Axios from "../../../Axios";
import Board from "./components/Board.js";
import PlayerInfo from "./components/PlayerInfo.js";
import GameoverDialog from "./components/GameoverDialog.js";
import { isDraw, isWinner } from "./utils/util";

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
        player: 1,
        hasWinner: false,
    };

    componentDidMount = async () => {
        const hubToken = localStorage.getItem("hubToken");
        const {
            match: { params },
        } = this.props;

        let response = await this.getGameById(params.gameId);

        if (response.status !== 200) {
            return new Error(response.data);
        }

        console.log("[GAME_DID_MOUNT_GAMEID]", response.data);
        let matrixSize = response.data.matrixSize;
        let board = Array(matrixSize)
            .fill(0)
            .map(() => Array(matrixSize).fill(0));

        const hubConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:5001/play", {
                accessTokenFactory: () => hubToken,
            })
            .build();

        this.setState({ hubConnection, board }, () => {
            this.state.hubConnection
                .start()
                .then(() =>
                    console.log("[SOCKET_CONNECTION] Connection started!")
                )
                .catch(err =>
                    console.log("Error while establishing connection :( ", err)
                );

            this.state.hubConnection.on(
                "sendToAll",
                (nick, receivedMessage) => {
                    const text = `${nick}: ${receivedMessage}`;
                    const messages = this.state.messages.concat([text]);
                    this.setState({ messages });
                }
            );
        });
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

    sendMessage = () => {
        this.state.hubConnection
            .invoke(
                "sendToAll",
                "e730e3ac-8978-43df-b4b9-87edae9a40fa",
                this.state.message
            )
            .catch(err => console.error(err));

        this.setState({ message: "" });
    };

    newGame = () => {
        this.setState({ gameover: false });
    };

    switchPlayer = player => {
        this.setState({ player });
    };

    gameover = () => {
        this.setState({ gameover: true });
    };

    winner = player => {
        this.setState({ winner: player });
    };

    /**
     * When a player plays a turn we need to mark that spot on the board.  We then need to
     * switch to the next player
     * @param {number} player The current player
     * @param {number} row The row on the board
     * @param {number} col The column on the board
     */

    movePlayer = (player, row, col) => {
        console.log("[PLAYER]", player);
        const updated = [...this.state.board];

        updated[row][col] = player;
        this.setState({ board: updated });
    };

    checkWinner = (board, player) => {
        // the logic to check if a player has won or the game ended in a draw are in
        // the utils/game.js file.

        // instead of returning a promise like we would if we were making an api call
        // from our operations, we just return a boolean for the game winner
        let hasWinner = true;

        if (isWinner(board, player)) {
            this.winner(player);
            this.gameover();
        } else if (isDraw(board)) {
            this.winner(0);
            this.gameover();
        } else {
            hasWinner = false;
        }

        this.setState({ hasWinner });
    };

    playTurn = (player, row, col) => {
        let nextPlayer;

        switch (player) {
            case 1:
                nextPlayer = 2;
                break;
            case 2:
                nextPlayer = 1;
                break;
            default:
                // throw error?
                break;
        }

        this.movePlayer(player, row, col);
        this.switchPlayer(nextPlayer);
    };

    handleBoardOnMove = square => {
        // when a square is clicked we want to mark that square for the current player

        const { board, player, gameover } = this.state;
        const { row, col } = square;

        // only mark if the game is still in progress and the square is empty (none)
        // otherwise, ignore the play
        if (gameover || board[row][col] !== 0) {
            return;
        }

        console.log("PLAYER handleBoardOnMove", player);
        // make a play for the player
        this.playTurn(player, row, col);
        // then check for a winner

        if (this.state.hasWinner) {
            this.setState({ showDialog: true });
        }
    };

    handleDialogClick = answer => {
        // we only want to start a new game if the player clicks 'yes'
        if (answer) {
            this.newGame();
        }

        // we always want to close the dialog
        this.setState({ showDialog: false });
    };

    handleDialogClose() {
        // close the dialog
        this.setState({ showDialog: false });
    }

    render() {
        const { showDialog, board, player, gameover, winner } = this.state;
        const draw = winner === 0;

        return (
            // at extra-small (xs) size the grid show have two rows
            // at small (sm+) and above we want 2 columns
            // Grid 'item' in a container must have columns (xs, sm, md, etc.) that add up to 12, per grid docs:
            // https://material-ui-next.com/layout/grid/
            <div style={{ marginTop: "50px" }}>
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
export default withRouter(Game);
