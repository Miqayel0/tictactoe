import React from "react";
import classnames from "classnames";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import Square from "./Square.js";

const borderStyle = "1px solid black";

// styles is a function that accepts the base theme object from material-ui
// and returns an object with either overrides or new styles to apply to
// components and elements
const styles = theme => ({
    // a square's dimension is 100x100px
    square: {
        height: 100,
        width: 100,
        lineHeight: "100px", // this is to center the icon in the square
        fontSize: "48px", // the size of our player's icon
        cursor: "pointer",
    },
    // if a square is marked, we show the not allowed circle with a line through it
    marked: { cursor: "not-allowed" },
    // a rows should have its content centered
    row: { textAlign: "center" },
    // these styles make up the border of the game cross pattern
    "0_1": { borderLeft: borderStyle, borderRight: borderStyle },
    "2_1": { borderLeft: borderStyle, borderRight: borderStyle },
    "1_1": { border: borderStyle },
    "1_0": { borderTop: borderStyle, borderBottom: borderStyle },
    "1_2": { borderTop: borderStyle, borderBottom: borderStyle },
});

const Board = ({ classes, board, onMove }) => {
    // the 'board' and 'onMove' handler are passed in from the props of the Game which
    // holds this component and control the state
    // we will simply render the 'board' in its current state and call the 'onMove'
    // handler function given to us when a player clicks on a Square
    return (
        <Grid container>
            {board.map((row, rIdx) => (
                <Grid key={rIdx} item xs={12} className={classes.row}>
                    <Grid container justify="center">
                        {row.map((col, cIdx) => {
                            // the border style for a square as defined by the styles object above
                            const border = classes["1_1"] || "";
                            // remember that 0 is for NONE in our players enum...which we should add
                            const marked = col !== 0 ? classes.marked : "";

                            return (
                                <Grid
                                    key={cIdx}
                                    item
                                    className={classnames(
                                        classes.square,
                                        border,
                                        marked
                                    )}
                                    onClick={() =>
                                        onMove({ row: rIdx, col: cIdx })
                                    }
                                >
                                    {/* 
                      we have two options here, we can add the click event to the grid item or we can 
                      or we can pass it down to the Square to call when it is clicked on.  
                      if we pass it down, we will need to update the square to accept the onMove event 
                      and give the coordinates that it resides in
                    */}
                                    <Square player={col} />
                                </Grid>
                            );
                        })}
                    </Grid>
                </Grid>
            ))}
        </Grid>
    );
};

export default withStyles(styles)(Board);
