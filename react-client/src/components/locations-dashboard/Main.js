import React from 'react';

import { makeStyles } from '@mui/styles';

import Header from "./Header.js";
import Map from "./Map.js";
import Counts from "./Counts.js";
import Charts from "./Charts.js";

const useStyles = makeStyles({
   root:{
      display:'flex',
      flexDirection:'column',
      width:'100vw',
      height:'100vh'
   },
   content:{
      flex:1,
      display:'flex',
      flexDirection:'row',
      backgroundColor:'#f1f6fa'
   },
   leftContainer:{
     width:'40%',
     padding:20
   },
   mapContainer:{
      flex:1,
   }
});

function Main() {
    const classes = useStyles();
    return (
       <div className={classes.root}>
           <Header />
           <div className={classes.content}>
              <div className={classes.leftContainer}>
                <Counts />
                <Charts />  
              </div>
              <div className={classes.mapContainer}>
                 <Map />
               </div>
           </div>
       </div>
    );
}

export default Main;