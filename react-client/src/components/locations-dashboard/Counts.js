import React, { useState} from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

import numeral from "numeral";

function Counts() {
    return(
       <Grid container spacing={2} flexDirection="row" style={{marginBottom:50}}>
           <Grid item lg={4} md={6} xs={12}>
               <Paper>
                    <Grid container alignItems="center">
                        <ShareLocationIcon color="primary" />
                        <Typography variant="caption">
                            Total Devices
                        </Typography>
                    </Grid>
                   <Typography variant="h5" style={{marginLeft:20}}>
                       {numeral('1234').format("0,0")}
                   </Typography>
                </Paper>
           </Grid>
           <Grid item lg={4} md={6} xs={12}>
                <Paper>
                    <Grid container alignItems="center">
                        <PhoneAndroidIcon color="primary" />
                        <Typography variant="caption">
                            Android
                        </Typography>
                    </Grid>
                   <Typography variant="h5" style={{marginLeft:20}}>
                      {numeral('1234').format("0,0")}
                   </Typography>
                </Paper>
           </Grid>
           <Grid item lg={4} md={6} xs={12}>
                <Paper>
                    <Grid container alignItems="center">
                        <PhoneIphoneIcon color="secondary" />
                        <Typography variant="caption">
                            iPhone
                        </Typography>
                    </Grid>
                   <Typography variant="h5" style={{marginLeft:20}}>
                      {numeral('1234').format("0,0")}
                   </Typography>
                </Paper>
           </Grid>
       </Grid>
    );
}
export default Counts;