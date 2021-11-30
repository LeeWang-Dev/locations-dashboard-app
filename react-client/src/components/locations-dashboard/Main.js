import React, { useState } from 'react';

import { makeStyles } from '@mui/styles';

import { DEFAULT_DATE } from "./../../utils/settings.js";

import Header from "./Header.js";
import SideBar from "./SideBar.js";
import Map from "./Map.js";
import RenderMode from "./RenderMode.js";
import Counts from "./Counts.js";
import PieChart from './PieChart.js';
import TimeSlider from "./TimeSlider.js";

import { dateFormat, secondsFromDate } from '../../utils/util.js';

const useStyles = makeStyles({
   root:{
      display:'flex',
      flexDirection:'column',
      width:'100vw',
      height:'100vh'
   },
   content:{
      position:'relative',
      flex:1,
      display:'flex',
      flexDirection:'row',
      height:0,
      //backgroundColor:'#f1f6fa'
   },
   sidebar:{
     position:'relative',
     display:'flex',
     flexDirection:'column',
     width:400,
     padding:0,
   },
   mapContainer:{
      position:'relative',
      flex:1,
   }
});

function Main() {
    const classes = useStyles();
    const [searchPlace, setSearchPlace] = useState(null);
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
    const [renderMode, setRenderMode] = useState('cluster');

    return (
       <div className={classes.root}>
           <Header
              searchPlace={searchPlace} 
              setSearchPlace={setSearchPlace}
              filter={filter}
              setFilter={setFilter}
           />
           <div className={classes.content}>
              <div className={classes.sidebar}>
                 <SideBar 
                    searchPlace={searchPlace}
                    setSearchPlace={setSearchPlace} 
                 />
              </div>
              <div className={classes.mapContainer}>
                 <Map 
                    searchPlace={searchPlace}
                    filter={filter}
                    renderMode={renderMode}
                    setCounts={setCounts}
                 />
                 <RenderMode 
                    renderMode={renderMode}
                    setRenderMode={setRenderMode}
                 />
                 <Counts counts={counts} />
                 {counts['TOTAL'] && <PieChart counts={counts} />}
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