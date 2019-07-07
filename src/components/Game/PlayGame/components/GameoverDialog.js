import React from 'react';

import Button from '@material-ui/core/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from '@material-ui/core';

const GameoverDialog = ({ fullScreen, open, isDraw, player, onClick, onClose }) => {
  const title = isDraw ? 'Draw!' : `Player - ${player} wins!`;

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title">

      <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Would you like to start a new game?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClick(false)} color="secondary">
          No
      </Button>
        <Button onClick={() => onClick(true)} color="primary" autoFocus>
          Yes
      </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withMobileDialog()(GameoverDialog);