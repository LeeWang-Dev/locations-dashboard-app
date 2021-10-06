import React from 'react';

import { makeStyles } from '@mui/styles';

import Map from "./Map.js";

const useStyles = makeStyles({
   root:{
      width:'100vw',
      height:'100vh'
   }
});

function Main() {
    const classes = useStyles();
    return (
       <div className={classes.root}>
           <Map />
       </div>
    );
}

export default Main;