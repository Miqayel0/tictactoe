import React, { Component } from "react";
import { HubConnectionBuilder } from "@aspnet/signalr";
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
        turn: null,
        hasWinner: false,
        row: null,
        col: null,
        currentPlayer: null,
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

        if (response.status !== 200) {
            return new Error(response.data);
        }
        console.log("[GAME_DID_MOUNT_GAMEID]", response.data);

        const { matrixSize, firstPlayerId, firstPlayerTurn, moves} = response.data;

        let board = Array(matrixSize)
            .fill(0)
            .map(() => Array(matrixSize).fill(0));

        let turn = null;
        let currentPlayer = null;

        if (this.userId === firstPlayerId) {
            turn = firstPlayerTurn;
            currentPlayer = 1;
        } else {
            currentPlayer  = 2;
            switch (firstPlayerTurn) {
                case 1:
                    turn = 2;
                    break;
                case 2:
                    turn = 1;
                    break;
            }
        }

        moves.forEach(m => board[m.row][m.column] = m.player);

        const hubConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:5001/play", {
                accessTokenFactory: () => hubToken,
            })
            .build();

        this.setState({ hubConnection, board, turn, currentPlayer }, () => {
            this.state.hubConnection
                .start()
                .then(() =>
                    console.log("[SOCKET_CONNECTION] Connection started!")
                )
                .catch(err =>
                    console.log("[SOCKET_CONNECTION] Error while establishing connection :( ", err)
                );

            this.state.hubConnection.on(
                "sendToPlayer",
                (turn, row,col) => {
                    this.movePlayer(turn, row, col);
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

    notifyMove = (gameId, turn, row, col, currentPlayer) => {
        this.state.hubConnection
            .invoke("getMove", gameId, turn, row, col, currentPlayer)
            .catch(err => console.error(err));
    };

    newGame = () => {
        this.setState({ gameover: false });
    };

    /*     switchPlayer = turn => {
        this.setState({ turn });
    }; */

    gameover = () => {
        this.setState({ gameover: true });
    };

    winner = turn => {
        this.setState({ winner: turn });
    };

    /**
     * When a turn plays a turn we need to mark that spot on the board.  We then need to
     * switch to the next turn
     * @param {number} turn The current turn
     * @param {number} row The row on the board
     * @param {number} col The column on the board
     */

    movePlayer = (turn, row, col) => {
        console.log("[PLAYER]", turn);
        const updatedBoard = [...this.state.board]; // cloning board
        updatedBoard[row][col] = turn;

        this.setState({ board: updatedBoard });
    };

    checkWinner = (board, turn) => {
        // the logic to check if a turn has won or the game ended in a draw are in
        // the utils/game.js file.

        // instead of returning a promise like we would if we were making an api call
        // from our operations, we just return a boolean for the game winner
        let hasWinner = true;

        if (isWinner(board, turn)) {
            this.winner(turn);
            this.gameover();
        } else if (isDraw(board)) {
            this.winner(0);
            this.gameover();
        } else {
            hasWinner = false;
        }

        this.setState({ hasWinner });
    };

    /*     playTurn = (turn, row, col) => {
        let nextPlayer;

        switch (turn) {
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

        this.movePlayer(turn, row, col);
        this.switchPlayer(nextPlayer);
    }; */

    handleBoardOnMove = square => {
        // when a square is clicked we want to mark that square for the current turn

        const { board, turn, gameover, currentPlayer } = this.state;
        const { row, col } = square;
        // only mark if the game is still in progress and the square is empty (none)
        // otherwise, ignore the play
        if (gameover || board[row][col] !== 0) {
            return;
        }
        // make a play for the turn
        this.movePlayer(turn, row, col);
        this.notifyMove(this.gameId, turn, row, col, currentPlayer);

        // then check for the winner

        if (this.state.hasWinner) {
            this.setState({ showDialog: true });
        }
    };

    handleDialogClick = answer => {
        // we only want to start a new game if the turn clicks 'yes'
        if (answer) {
            this.newGame();
        }

        // we always want to close the dialog
        this.setState({ showDialog: false });
    };

    handleDialogClose = () => {
        // close the dialog
        this.setState({ showDialog: false });
    }

    render() {
        const { showDialog, board, turn, gameover, winner } = this.state;
        const draw = winner === 0;

        return (
            // at extra-small (xs) size the grid show have two rows
            // at small (sm+) and above we want 2 columns
            // Grid 'item' in a container must have columns (xs, sm, md, etc.) that add up to 12, per grid docs:
            // https://material-ui-next.com/layout/grid/
            <div style={{ marginTop: "50px" }}>
                <Board board={board} onMove={this.handleBoardOnMove} />
                <PlayerInfo player={turn} gameover={gameover} />
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
