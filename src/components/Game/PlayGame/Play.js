import React, { Component } from "react";
import { HubConnectionBuilder } from "@aspnet/signalr";

const token = localStorage.getItem("hubToken");

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nick: "",
            message: "",
            messages: [],
            hubConnection: null,
        };
    }

    componentDidMount = () => {
        const hubToken = localStorage.getItem("hubToken");
        const hubConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:5001/play", {
                accessTokenFactory: () => hubToken,
            })
            .build();

        this.setState({ hubConnection }, () => {
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

    render() {
        console.log("[PLAY_PROPS]",this.props);
        const { match: { params } } = this.props;
        return (
            <div style={{margin: '50px'}}>
                <span style={{margin: '50px'}} >{params.gameId}</span>
                <input
                    type="text"
                    value={this.state.message}
                    onChange={e => this.setState({ message: e.target.value })}
                />

                <button onClick={this.sendMessage}>Send</button>

                <div>
                    {this.state.messages.map((message, index) => (
                        <span style={{ display: "block" }} key={index}>
                            {message}
                        </span>
                    ))}
                </div>
            </div>
        );
    }
}

export default Chat;
