import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { timeFormat, secondsFromDate } from "../../../utils/util.js";

function PopupInfo(props){
  const { params, info } = props;
  return (
    <Grid container alignItems="center" style={{maxWidth:350,padding:10}}>
        <Grid item xs={12} container 
              style={{
                  paddingBottom:10,
                  marginBottom:10,
                  borderBottom:'1px solid #e3ebf1'
              }}
        >
           <LocationOnIcon color="warning" style={{marginRight:10}} />
           <Typography variant="h6">
               Device Location/Time
            </Typography>  
        </Grid>
        <Grid item xs={4}>
            <Typography variant="subtitle2">Time</Typography>
        </Grid>
        <Grid item xs={8}>
            <Typography variant="caption">
            {`UTC ${timeFormat(parseInt(info['timestamp']/1000)-secondsFromDate(params.date))} ${params.date}`}
            </Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="subtitle2">Longitude</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="caption">
                {info['longitude']}
            </Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="subtitle2">Latitude</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="caption">
                {info['latitude']}
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
    </Grid>
  );
}

export default PopupInfo;