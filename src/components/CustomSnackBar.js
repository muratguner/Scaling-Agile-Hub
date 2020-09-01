import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  root: {
		width: '100%',
	},
  close: {
    padding: theme.spacing(0.5),
  },
  content: {
    minWidth: '150px'
  }
  
}));

const CustomSnackBar = props => { 
  const { message } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}

        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        ContentProps={{
          "aria-describedby": "message-id",
          className: classes.content
        }}
        message={					<Typography variant='body1' id='message-id'>
        {message}
      </Typography>}
      />
  );
}

export default CustomSnackBar;
