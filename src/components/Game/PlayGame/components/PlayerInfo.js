import React from "react";

import Typography from "@material-ui/core/Typography";

const PlayerInfo = ({ player, gameover }) => {
    return (
        <div>
            <Typography variant="subtitle1">
                {gameover && "Gameover!"}
                {!gameover && `Player: ${player}`}
            </Typography>
        </div>
    );
};

export default PlayerInfo;
