import React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

import numeral from "numeral";

function Counts(props) {
    const { counts } = props;
    return(
       <Grid container spacing={2} flexDirection="row" style={{marginBottom:50}}>
           <Grid item sm={4} xs={12}>
               <Paper>
                    <Grid container alignItems="center">
                        <LocationOnIcon color="primary" />
                        <Typography variant="caption">
                            Total Devices
                        </Typography>
                    </Grid>
                   <Typography variant="h5" style={{marginLeft:20}}>
                       {counts["TOTAL"]?numeral(counts["TOTAL"]).format("0,0"):0}
                   </Typography>
                </Paper>
           </Grid>
           <Grid item sm={4} xs={12}>
                <Paper>
                    <Grid container alignItems="center">
                        <PhoneAndroidIcon color="primary" />
                        <Typography variant="caption">
                            Android
                        </Typography>
                    </Grid>
                   <Typography variant="h5" style={{marginLeft:20}}>
                      {counts["AAID"]?numeral(counts["AAID"]).format("0,0"):0}
                   </Typography>
                </Paper>
           </Grid>
           <Grid item sm={4} xs={12}>
                <Paper>
                    <Grid container alignItems="center">
                        <PhoneIphoneIcon color="secondary" />
                        <Typography variant="caption">
                            iPhone
                        </Typography>
                    </Grid>
                   <Typography variant="h5" style={{marginLeft:20}}>
                      {counts["IDFA"]?numeral(counts["IDFA"]).format("0,0"):0}
                   </Typography>
                </Paper>
           </Grid>
       </Grid>
    );
}
export default Counts;