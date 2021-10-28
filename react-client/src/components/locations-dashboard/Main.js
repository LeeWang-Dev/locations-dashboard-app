import React, { useState } from 'react';

import { makeStyles } from '@mui/styles';

import { DEFAULT_DATE } from "./../../utils/settings.js";

import Header from "./Header.js";
import Map from "./Map.js";
import TimeSlider from "./TimeSlider.js";
import Counts from "./Counts.js";
import Charts from "./Charts.js";
import { dateFormat, secondsFromDate } from '../../utils/util.js';

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
   chartContainer:{
     width:500,
     padding:20
   },
   mapContainer:{
      flex:1,
      position:'relative'
   }
});

function Main() {
    const classes = useStyles();
    const [searchLocation, setSearchLocation] = useState(null);
    const [address, setAddress] = useState(null);
    const [filter, setFilter] = useState({
       date: DEFAULT_DATE,
       timeRange: [
         secondsFromDate(dateFormat(DEFAULT_DATE)),
         secondsFromDate(dateFormat(DEFAULT_DATE))+86399
      ],
      category: "All Categories",
      category_distance: 20
    });
    const [counts, setCounts] = useState([]);

    return (
       <div className={classes.root}>
           <Header 
              setSearchLocation={setSearchLocation}
              address={address}
              setAddress={setAddress}
              filter={filter}
              setFilter={setFilter}
           />
           <div className={classes.content}>
              <div className={classes.chartContainer}>
                <Counts counts={counts} />
                <Charts counts={counts} />  
              </div>
              <div className={classes.mapContainer}>
                 <Map 
                    searchLocation={searchLocation}
                    address={address}
                    filter={filter}
                    setCounts={setCounts}
                 />
                 <TimeSlider 
                    filter={filter}
                    setFilter={setFilter}
                 />
               </div>
           </div>
       </div>
    );
}

export default Main;