import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import './Spinner.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
    },
  })
);

export default function Spinner() {
  const classes = useStyles();

  return (
    <div className={'spinner-loading-div'}>
      <div className={'spinner-loading'}>
        <div className={classes.root}>
          <CircularProgress />
          <CircularProgress color="secondary" />
          <CircularProgress color="inherit" />
        </div>
      </div>
    </div>
  );
}
