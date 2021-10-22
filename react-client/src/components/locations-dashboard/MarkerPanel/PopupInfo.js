import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { timeFormat, secondsFromDate } from "../../../utils/util.js";

function PopupInfo(props){
  const { params, info } = props;
  return (
    <Grid container style={{maxWidth:350,padding:10}}>
        <Grid item xs={12}>
           <Typography variant="h6" style={{marginBottom:10,borderBottom:'1px solid #e3ebf1'}}>
               Location Information
            </Typography>  
        </Grid>
        <Grid item xs={6}>
            <Typography variant="subtitle2">Time</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="caption">
            {`UTC ${timeFormat(info['location_at']-secondsFromDate(params.date))} ${params.date}`}
            </Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="subtitle2">Location</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="caption">
                {`[ ${info['longitude']}, ${info['latitude']} ]`}
            </Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="subtitle2">Altitude</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="caption">
                {`${info['altitude']} m`}
            </Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="subtitle2">Heading</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="caption">
                {info['heading']}
            </Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="subtitle2">Speed</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="caption">
                {`${info['speed']} m/s`}
            </Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="subtitle2">Horizontal Accuracy</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="caption">
              {`${info['horizontal_accuracy']} m`}
            </Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="subtitle2">Vertical Accuracy</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="caption">
                {`${info['vertical_accuracy']} m`}
            </Typography>
        </Grid>
    </Grid>
  );
}

export default PopupInfo;