import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Axios from "../../../Axios";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        overflowX: "auto",
    },
    table: {
        marginTop: theme.spacing(3),
        margin: "auto",
        width: "70%",
        minWidth: 650,
    },
}));

function formatDate(date) {
    let current_datetime = new Date(date);
    let formatted_date =
        current_datetime.getFullYear() +
        "-" +
        (current_datetime.getMonth() + 1) +
        "-" +
        current_datetime.getDate() +
        " " +
        current_datetime.getHours() +
        ":" +
        current_datetime.getMinutes() +
        ":" +
        current_datetime.getSeconds();
    return formatted_date;
}

const SimpleTable = props => {
    const classes = useStyles();
    const [scores, setScores] = useState([]);

    useEffect(() => {
        const getScores = async () => {
            const headers = {
                Authorization: localStorage.getItem("accessToken"),
            };
            const response = await Axios.get("/score", {
                headers: headers,
            });
            setScores(response.data.scoreHistory);
            console.log("[SCORE_RESPONSE]", response);
        };

        getScores().catch(err => err);
    }, []);

    return (
        <Paper className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Competitor</TableCell>
                        <TableCell>Result</TableCell>
                        <TableCell>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {scores.map((score, index) => (
                        <TableRow key={index}>
                            <TableCell component="th" scope="row">
                                <Link href={""}>{score.secondPlayerName}</Link>
                            </TableCell>
                            <TableCell>{score.result}</TableCell>
                            <TableCell>{formatDate(score.date)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};
export default SimpleTable;
