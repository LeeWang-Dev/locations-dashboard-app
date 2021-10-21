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
     width:540,
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
    const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE);
    const [timeRange, setTimeRange] = useState([
       secondsFromDate(dateFormat(DEFAULT_DATE)),
       secondsFromDate(dateFormat(DEFAULT_DATE))+86399
    ]);
    const [counts, setCounts] = useState([]);

    return (
       <div className={classes.root}>
           <Header 
              setSearchLocation={setSearchLocation}
              address={address}
              setAddress={setAddress}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setTimeRange={setTimeRange}
           />
           <div className={classes.content}>
              <div className={classes.chartContainer}>
                <Counts counts={counts} />
                <Charts />  
              </div>
              <div className={classes.mapContainer}>
                 <Map 
                    searchLocation={searchLocation}
                    address={address}
                    selectedDate={selectedDate}
                    timeRange={timeRange}
                    setCounts={setCounts}
                 />
                 <TimeSlider 
                    selectedDate={selectedDate}
                    timeRange={timeRange}
                    setTimeRange={setTimeRange}
                 />
               </div>
           </div>
       </div>
    );
}

export default Main;