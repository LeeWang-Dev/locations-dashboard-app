import React from 'react';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

import { dateFormat, secondsFromDate, timeFormat } from "../../utils/util.js";

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
                  {`UTC ${timeFormat(timeRange[0]-secondsFromDate(dateFormat(selectedDate)))} - ${timeFormat(timeRange[1]-secondsFromDate(dateFormat(selectedDate)))} ${dateFormat(selectedDate)}`}
               </Typography>
               <Slider
                    getAriaLabel={() => 'Time range'}
                    value={timeRange}
                    onChange={handleChange}
                    defaultValue={secondsFromDate(dateFormat(selectedDate))+86399}
                    min={secondsFromDate(dateFormat(selectedDate))}
                    max={secondsFromDate(dateFormat(selectedDate))+86399}
                    //valueLabelDisplay="auto"
                    //color="primary"
                    style={{color:'#ff844b'}}
                    marks = {[
                        { value: secondsFromDate(dateFormat(selectedDate)), label: '0'},
                        { value: secondsFromDate(dateFormat(selectedDate))+3*3600, label: '3'},
                        { value: secondsFromDate(dateFormat(selectedDate))+6*3600, label: '6'},
                        { value: secondsFromDate(dateFormat(selectedDate))+9*3600, label: '9'},
                        { value: secondsFromDate(dateFormat(selectedDate))+12*3600, label: '12'},
                        { value: secondsFromDate(dateFormat(selectedDate))+15*3600, label: '15'},
                        { value: secondsFromDate(dateFormat(selectedDate))+18*3600, label: '18'},
                        { value: secondsFromDate(dateFormat(selectedDate))+21*3600, label: '21'},
                        { value: secondsFromDate(dateFormat(selectedDate))+24*3600, label: '24'}
                    ]}
               />
            </Paper>
        </Grid>
    );
}
export default TimeSlider;