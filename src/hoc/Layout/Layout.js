import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange } from "@material-ui/core/colors";
import Axios from "../../Axios";
import Logo from "../../assets/img/tic_tac_toe-512.png";
import EditUserPopup from "../../components/User/UpdateUserPopup";
import { withRouter } from "react-router";

const headers = {
    Authorization: localStorage.getItem("accessToken"),
};

const useStyles = makeStyles(theme => ({
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
    },
    submit: {
        width: "300px",
        marginTop: theme.spacing(2),
    },
    orangeAvatar: {
        margin: 10,
        color: "#fff",
        backgroundColor: deepOrange[500],
    },
    account: {
        marginBottom: theme.spacing(2),
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
}));

const Layout = props => {
    const classes = useStyles();
    const [playerFullName, setPlayerFullName] = useState("");
    const [fullNameShorthand, setFullNameShorthand] = useState("");
    const [playerFirstName, setPlayerFirstName] = useState("");
    const [playerLastName, setPlayerLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openPopup, setOpen] = React.useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await Axios.get("account/player", { headers });
            setPlayerFullName(response.data.fullName);
            setFullNameShorthand(response.data.fullNameShorthand);
            setPlayerFirstName(response.data.lastName);
            setPlayerLastName(response.data.firstName);
            setEmail(response.data.email);
            setUserName(response.data.userName);
            console.log("[USER_RESPONSE]", response);
        };

        fetchData();
    }, []);

    function handleClickOpenPopup() {
        setOpen(true);
    }

    function handleClosePopup() {
        setOpen(false);
    }

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const accountClickedHandler = () => {
        handleClose();
        handleClickOpenPopup();
    };

    const updateUserSubmitHandler = async () => {
        let formData = new FormData();
        let response = null;
        formData.append("userName", userName);
        formData.append("firstName", playerFirstName);
        formData.append("lastName", playerLastName);
        formData.append("email", email);

        handleClosePopup();
        try {
            response = await Axios.put("/account", formData, {
                headers: headers,
            });
            setPlayerFullName(response.data.fullName);
            setFullNameShorthand(response.data.fullNameShorthand);
        } catch (err) {
            throw new Error(err.response.data);
        }
        console.log("[UPDATE_USER_RESPONSE] ", response);
    };

    const logout = () => {
        handleClose();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("hubToken");
        props.history.push("/sign-in");
    };

    const inputChangedHandler = (event, callBack) => {
        callBack(event.target.value);
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar className={classes.toolbar}>
                    <img
                        src={Logo}
                        width="40"
                        height="35"
                        alt="background"
                        onClick={() => props.history.push("/home")}
                    />
                    <Typography variant="h6" color="inherit" noWrap>
                        TicTacToe
                    </Typography>
                    <Avatar
                        className={classes.orangeAvatar}
                        onClick={handleClick}
                    >
                        {fullNameShorthand}
                    </Avatar>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem
                            onClick={accountClickedHandler}
                            className={classes.account}
                        >
                            {playerFullName}
                        </MenuItem>
                        <MenuItem onClick={handleClose}>Games</MenuItem>
                        <MenuItem onClick={logout}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
                <EditUserPopup
                    open={openPopup}
                    inputChangedHandler={inputChangedHandler}
                    handleClose={handleClosePopup}
                    email={email}
                    userName={userName}
                    firstName={playerFirstName}
                    lastName={playerLastName}
                    setEmail={setEmail}
                    setUserName={setUserName}
                    setFirstName={setPlayerFirstName}
                    setLastName={setPlayerLastName}
                    handleSubmit={updateUserSubmitHandler}
                />
            </AppBar>
            <main>{props.children}</main>
            <footer className={classes.footer}>
                <Typography variant="h6" align="center" gutterBottom>
                    About Us
                </Typography>
                <Typography
                    component="p"
                    variant="subtitle1"
                    color="textSecondary"
                    align="center"
                    gutterBottom
                >
                    CEO Ani Barseghyan
                </Typography>
                <Typography
                    variant="subtitle2"
                    align="center"
                    color="textSecondary"
                    component="p"
                >
                    CTO Varsik Harutyunyan, PM Narek Aharonyan, Developer
                    Miqayel Avagyan
                </Typography>
                <Typography
                    variant="caption"
                    align="center"
                    color="textSecondary"
                    component="p"
                >
                    © 2019 All Rights Reserved - Fancy | Terms of Use | Privacy
                    Policy | Cookies Policy
                </Typography>
            </footer>
        </React.Fragment>
    );
};

export default withRouter(Layout);
