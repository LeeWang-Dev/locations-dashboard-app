import React, { useEffect, useState } from 'react';
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
           //maxWidth:600,
           paddingTop:10,
           paddingBottom:5,
           paddingLeft:40,
           paddingRight:40,
           backgroundColor:'rgba(255,255,255,0.7)',
        },
        '&.MuiSlider-root':{
          //position:'absolute'
          //width:'60%'
       }
    }
 });

 
function TimeSlider(props){
    const classes = useStyles();
    const { 
        filter,
        setFilter
    } = props;
    
    const [sliderProps, setSliderProps] = useState({
        min:0,
        max:100,
        step: 1,
        defaultValue:0,
        marks:[]
    });
    const [timeRangeLabel, setTimeRangeLabel] = useState('');

    const handleChange = (event, newValue) => {
        setFilter({
           ...filter,
           timeRange: newValue
        });
        const t0 = secondsFromDate(dateFormat(filter.date));
        setTimeRangeLabel(`UTC ${timeFormat(newValue[0]-t0)} - ${timeFormat(newValue[1]-t0)} ${dateFormat(filter.date)}`);
    };

    useEffect(()=>{
        const t0 = secondsFromDate(dateFormat(filter.date));
        setSliderProps({
            min:t0,
            max:t0+86399,
            step:30,
            defaultValue: [t0,t0+86399],
            marks:[
                { value: t0, label: '0'},
                { value: t0+3*3600, label: '3'},
                { value: t0+6*3600, label: '6'},
                { value: t0+9*3600, label: '9'},
                { value: t0+12*3600, label: '12'},
                { value: t0+15*3600, label: '15'},
                { value: t0+18*3600, label: '18'},
                { value: t0+21*3600, label: '21'},
                { value: t0+24*3600, label: '24'}
            ]
        });    

        setFilter({
            ...filter,
            timeRange: [t0, t0+86399]
        });
        setTimeRangeLabel(`UTC ${timeFormat(0)} - ${timeFormat(86399)} ${dateFormat(filter.date)}`);

     }, [filter.date]);

    return (
        <Grid container className={classes.timeslider} justifyContent="center">
            <Paper>
               <Typography variant="h6" align="center">
                  {timeRangeLabel}
               </Typography>
               <Slider
                    getAriaLabel={() => 'Time range'}
                    value={filter.timeRange}
                    onChange={handleChange}
                    //valueLabelDisplay="auto"
                    //color="primary"
                    style={{color:'#ff844b'}}
                    {...sliderProps}
               />
            </Paper>
        </Grid>
    );
}
export default TimeSlider;