import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";
//import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles(theme => ({
    TextField: {
        marginBottom: theme.spacing(2)
    }
}));

const FormDialog = props => {
    const classes = useStyles();
    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Edit Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        //variant="outlined"
                        autoFocus
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={props.email}
                        className={classes.TextField}
                        onChange={event =>
                            props.inputChangedHandler(event, props.setEmail)
                        }
                    />
                    <TextField
                        autoComplete="fname"
                        name="firstName"
                        //variant="outlined"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        value={props.firstName}
                        className={classes.TextField}
                        onChange={event =>
                            props.inputChangedHandler(event, props.setFirstName)
                        }
                    />
                    <TextField
                        //variant="outlined"
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="lname"
                        value={props.lastName}
                        className={classes.TextField}
                        onChange={event =>
                            props.inputChangedHandler(event, props.setLastName)
                        }
                    />
                    <TextField
                        //variant="outlined"
                        required
                        fullWidth
                        id="userName"
                        label="User Name"
                        name="userName"
                        autoComplete="userName"
                        value={props.userName}
                        className={classes.TextField}
                        onChange={event =>
                            props.inputChangedHandler(event, props.setUserName)
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={props.handleClose}
                        variant="outlined"
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={props.handleSubmit} color="secondary">
                        submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
export default FormDialog;
