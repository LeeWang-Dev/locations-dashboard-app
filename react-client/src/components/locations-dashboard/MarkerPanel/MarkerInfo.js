import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import SystemSecurityUpdateGoodIcon from '@mui/icons-material/SystemSecurityUpdateGood';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

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
        <>
        {markerInfo?
            <>
            <Paper className={classes.paper}>
                <Grid container className={classes.paperHeader} alignItems="center">
                    <SystemSecurityUpdateGoodIcon color="warning" style={{marginRight:10}} />
                    <Typography variant="h6">
                        Device Identification
                    </Typography>
                </Grid>  
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={4}>
                        <Typography variant="subtitle2">Device ID</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="caption">{markerInfo.device_id}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="subtitle2">Country</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="caption">Japan</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="subtitle2">Device Type</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="caption">{markerInfo.id_type}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="subtitle2">Device OS</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="caption">
                            {markerInfo.id_type==='aaid'?'Android':'iOS'}
                        </Typography>
                    </Grid>
                </Grid>  
            </Paper>
            <Paper className={classes.paper}>
                <Grid container className={classes.paperHeader} alignItems="center">
                    <LocationOnIcon color="warning" style={{marginRight:10}} />
                    <Typography variant="h6">
                        Device Location
                    </Typography>
                </Grid> 
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={4}>
                        <Typography variant="subtitle2">Timestamp</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="caption">
                            {`UTC ${timeFormat(markerInfo.timestamp/1000-secondsFromDate(params.date))} ${params.date}`}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="subtitle2">Longitude</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="caption">
                            {markerInfo.longitude}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="subtitle2">Latitude</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="caption">
                            {markerInfo.latitude}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="subtitle2">Horizontal Accuracy</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="caption">{`${markerInfo.horizontal_accuracy} m`}</Typography>
                    </Grid>
                </Grid>
            </Paper>
            <Paper className={classes.paper}>
                <Grid container className={classes.paperHeader} alignItems="center">
                    <MoreHorizIcon color="warning" style={{marginRight:10}} />
                    <Typography variant="h6">
                        Others
                    </Typography>
                </Grid> 
                <Grid container justifyContent="center">
                    <Typography variant="caption">
                        There is no any other information.
                    </Typography>
                </Grid>
            </Paper>    
            </>
            :
            <Grid container justifyContent="center">
                <CircularProgress />
            </Grid>
        } 
        </>
    );
}

export default MarkerInfo;