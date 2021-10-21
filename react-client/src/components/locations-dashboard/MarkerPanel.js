import React, { useEffect, useState } from 'react';

import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Drawer from '@mui/material/Drawer';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';

import { getMarkerInfo } from "../../services/marker.js";

const useStyles = makeStyles({
    markerInfoDrawer:{
       '& .MuiBackdrop-root':{
           //position:'absolute'
           //backgroundColor:'transparent' //'rgba(0,0,0,0.2)'
       },
       '&>.MuiPaper-root':{
           //position: 'absolute',
           width: '40%',
           minWidth:400,
           paddingLeft:40,
           paddingRight:40,
           backgroundColor:'#f1f6fa'
       }
    },
    drawerHeader:{
      display:'flex',
      flexDirection:'row',
      paddingTop:30,
      paddingBottom:16,
      marginBottom:20,
      borderBottom:'1px solid #e3ebf1'
    },
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
    }
 });

function MarkerPanel(props) {
    const classes = useStyles();
    const {
        markerPanelInfo,
        setMarkerPanelInfo
    } = props;

    const [toggleValue, setToggleValue] = useState('properties');
    const [markerInfo, setMarkerInfo] = useState(null);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setMarkerPanelInfo({
            ...markerPanelInfo,
            open: open
        });
    };

   useEffect(()=>{
      
      getMarkerInfoCallback();
        
   }, [markerPanelInfo]);

   const getMarkerInfoCallback = async () => {
        let res = await getMarkerInfo({
            dateString: markerPanelInfo.date,
            id: markerPanelInfo.id
        });
        if(res.status === 'success'){
            setMarkerInfo(res.result);
        }else{
            setMarkerInfo(null);
        }
   }

   return (
        <Drawer
            className={classes.markerInfoDrawer}
            anchor="left"
            open={true}
            onClose={toggleDrawer(false)}
        >
          <Grid container className={classes.drawerHeader} justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                    Device Information
                </Typography>
                <ToggleButtonGroup 
                    value={toggleValue} exclusive
                    onChange={(e, newValue) => setToggleValue(newValue)} aria-label="marker button group"
                >
                    <ToggleButton value="properties" aria-label="Properties">
                       Properties
                    </ToggleButton>
                    <ToggleButton value="tracking" aria-label="Tracking">
                       Tracking
                    </ToggleButton>
                </ToggleButtonGroup>
          </Grid>
          {markerInfo?
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
                            <Typography variant="caption">{new Date(markerInfo.location_at*1000).toISOString()}</Typography>
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
          }
        </Drawer>
   );
}

export default MarkerPanel;