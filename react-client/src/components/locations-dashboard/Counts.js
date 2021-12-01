import React from 'react';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import numeral from "numeral";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

const useStyles = makeStyles({
    countsPanel:{
        position:'absolute',
        top:10,
        left:10,
        width:400,
        //height:160,
        '& .MuiPaper-root':{
           backgroundColor:'rgba(255,255,255,0.8)',
        }
    }
 });

function Counts(props){
    const classes = useStyles();
    const { counts } = props;

    return(
        <div className={classes.countsPanel}>
            <Grid container spacing={2} flexDirection="row">
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
                        {counts["aaid"]?numeral(counts["aaid"]).format("0,0"):0}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Paper>
                        <Grid container alignItems="center">
                            <PhoneIphoneIcon color="secondary" />
                            <Typography variant="caption">
                                iOS
                            </Typography>
                        </Grid>
                        <Typography variant="h5" style={{marginLeft:20}}>
                        {counts["idfa"]?numeral(counts["idfa"]).format("0,0"):0}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default Counts;