import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";

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

function createData(name, calories, fatt) {
    let current_datetime = new Date();
    let fat =
        current_datetime.getDate() +
        "-" +
        (current_datetime.getMonth() + 1) +
        "-" +
        current_datetime.getFullYear();
    console.log(fat);
    return { name, calories, fat };
}

const rows = [
    createData("Frozen yoghurt", "Win", 23),
    createData("Ice cream sandwich", "Win", 9.0),
    createData("Eclair", "lose", 16.0),
    createData("Cupcake", "Win", 3.7),
    createData("Gingerbread", "lose", 16.0),
];

const SimpleTable = props => {
    const classes = useStyles();

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
                    {rows.map(row => (
                        <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                                <Link href={""}>
                                {row.name}
                                </Link>
                            </TableCell>
                            <TableCell>{row.calories}</TableCell>
                            <TableCell>{row.fat}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};
export default SimpleTable;
