import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { timeFormat, secondsFromDate } from "../../../utils/util.js";
import { getMarkerInfo } from "../../../services/marker.js";

const useStyles = makeStyles({
    paper:{
        marginBottom:20,
        '&.MuiPaper-root':{
            padding:'30px 30px 20px 30px'
        }
    },
    paperHeader:{
        paddingBottom:10,
        marginBottom:20,
        borderBottom:'1px solid #e3ebf1'
    },
});

function MarkerInfo(props){
    const { params } = props;
    const classes = useStyles();
    const [markerInfo, setMarkerInfo] = useState(null);

    useEffect(()=>{
     
        fetchMarkerInfo();
          
     }, []);

    const fetchMarkerInfo = async () => {
        let res = await getMarkerInfo({
            date: params.date,
            id: params.id
        });
        if(res.status === 'success'){
            setMarkerInfo(res.result);
        }else{
            setMarkerInfo(null);
        }
    }

    return (
        markerInfo?
            <>
            <Paper className={classes.paper}>
                    <Grid container className={classes.paperHeader}>
                        <Typography variant="h6">
                            Device Identification
                        </Typography>
                    </Grid>  
                    <Grid container spacing={1} alignItems="center">
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Advertiser ID</Typography>
                        </Grid>
                        <Grid item md={9} xs={6}>
                            <Typography variant="caption">{markerInfo.advertiser_id}</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Country</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">{markerInfo.final_country}</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Platform</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">{markerInfo.platform}</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Device Model</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">{markerInfo.device_model}</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">IPV 4</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">{markerInfo.ipv_4}</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">IPV 6</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">{markerInfo.ipv_6}</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Wifi SSID</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">{markerInfo.wifi_ssid}</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Wifi BSSID</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">{markerInfo.wifi_bssid}</Typography>
                        </Grid>
                    </Grid>  
                </Paper>
                <Paper className={classes.paper}>
                    <Grid container className={classes.paperHeader}>
                        <Typography variant="h6">
                            Device Location
                        </Typography>
                    </Grid> 
                    <Grid container spacing={1} alignItems="center">
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Location time</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">
                                {`UTC ${timeFormat(markerInfo.location_at-secondsFromDate(params.date))} ${params.date}`}
                            </Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Location</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">
                                {`[ ${markerInfo.longitude}, ${markerInfo.latitude} ]`}
                            </Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Altitude</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">{`${markerInfo.altitude} m`}</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Horizontal Accuracy</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">{`${markerInfo.horizontal_accuracy} m`}</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Vertical Accuracy</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">{`${markerInfo.vertical_accuracy} m`}</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Heading</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">{markerInfo.heading}</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Speed</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">{`${markerInfo.speed} m/s`}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
                <Paper className={classes.paper}>
                    <Grid container className={classes.paperHeader}>
                        <Typography variant="h6">
                            Other Information
                        </Typography>
                    </Grid> 
                    <Grid container spacing={1} alignItems="center">
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">User Agent</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">{markerInfo.user_agent}</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Publisher ID</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">{markerInfo.publisher_id}</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Technical Signals</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption"></Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Background</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">{markerInfo.background}</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Carrier</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">{markerInfo.carrier}</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Venue Name</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">{markerInfo.venue_name}</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Venue Category</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">{markerInfo.venue_category}</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="subtitle2">Dwell Time</Typography>
                        </Grid>
                        <Grid item md={3} xs={6}>
                            <Typography variant="caption">{markerInfo.dwell_time}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </>
            :
            <Grid container justifyContent="center">
                <CircularProgress />
            </Grid>
    );
}

export default MarkerInfo;