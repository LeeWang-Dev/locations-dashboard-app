import React from 'react';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

import { dateFormat } from "../../utils/util.js";

const useStyles = makeStyles({
    timeslider:{
        position:'absolute',
        bottom:10,
        left:0,
        right:0,
        '& .MuiPaper-root':{
           width:'50%',
           paddingTop:10,
           paddingBottom:5,
           paddingLeft:40,
           paddingRight:40,
           backgroundColor:'rgba(255,255,255,0.7)',
        },
        '&.MuiSlider-root':{
          //position:'absolute'
          width:'60%'
       }
    }
 });

 const marks = [
    { value: 0, label: '0'},
    { value: 3, label: '3'},
    { value: 6, label: '6'},
    { value: 9, label: '9'},
    { value: 12, label: '12'},
    { value: 15, label: '15'},
    { value: 18, label: '18'},
    { value: 21, label: '21'},
    { value: 24, label: '24'}
  ];

function TimeSlider(props){
    const classes = useStyles();
    const { 
        selectedDate,
        timeRange,
        setTimeRange
    } = props;

    const handleChange = (event, newValue) => {
        setTimeRange(newValue);
    };

    return (
        <Grid container className={classes.timeslider} justifyContent="center">
            <Paper>
               <Typography variant="h6" align="center">
                  {`UTC ${timeRange[0]}:00 - ${timeRange[1]}:00 ${dateFormat(selectedDate)}`}
               </Typography>
               <Slider
                 getAriaLabel={() => 'Time range'}
                 value={timeRange}
                 onChange={handleChange}
                 defaultValue={24}
                 min={0}
                 max={24}
                 valueLabelDisplay="auto"
                 marks={marks}
                 //color="primary"
                 style={{color:'#ff844b'}}
               />
            </Paper>
        </Grid>
    );
}
export default TimeSlider;