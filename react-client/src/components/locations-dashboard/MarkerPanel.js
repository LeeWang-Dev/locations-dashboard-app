import React, { useEffect, useState } from 'react';

import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Drawer from '@mui/material/Drawer';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import Slider from '@mui/material/Slider';

import ReactMapGL, { 
    Source,
    Layer,
    Marker,
    ScaleControl,
    NavigationControl,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from "mapbox-gl";
import { MAPBOX_ACCESS_TOKEN } from "../../utils/settings.js";

import iconMarker from "../../assets/images/marker-icon.png";

import { timeFormat, secondsFromDate } from "../../utils/util.js";
import { getMarkerInfo, getTracking } from "../../services/marker.js";

mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;


const useStyles = makeStyles({
    drawer:{
       '& .MuiBackdrop-root':{
           //position:'absolute'
           //backgroundColor:'transparent' //'rgba(0,0,0,0.2)'
       },
       '&>.MuiPaper-root':{
           //position: 'absolute',
           display:'flex',
           flexDirection:'column',
           width: '50%',
           minWidth:400,
           padding:'20px 40px',
           backgroundColor:'#f1f6fa',
           boxSizing:'border-box'
       }
    },
    drawerHeader:{
      display:'flex',
      flexDirection:'row',
      paddingTop:20,
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
    },
    mapContainer:{
       flex:1,
       position:'relative'
    },
    mapDiv:{
        border:'1px solid #e3ebf1',
       '& .mapboxgl-ctrl-logo': {
           display: 'none'
        }
    },
    timeslider:{
        position:'absolute',
        bottom:10,
        left:0,
        right:0,
        '& .MuiPaper-root':{
           width:'70%',
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

function MarkerPanel(props) {
    const classes = useStyles();
    const {
        markerPanelInfo,
        setMarkerPanelInfo
    } = props;

    const [toggleValue, setToggleValue] = useState('properties');
    const [markerInfo, setMarkerInfo] = useState(null);
    const [trackSource, setTrackSource] = useState(null);
    //const [interpolateLine, setInterpolateSource] = useState(null);

    const [viewport, setViewport] = useState({
        longitude: markerPanelInfo.geometry.coordinates[0],
        latitude: markerPanelInfo.geometry.coordinates[1],
        zoom:15
    });
    
    const [sliderValue, setSliderValue] = useState(86400);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setMarkerPanelInfo({
            ...markerPanelInfo,
            open: open
        });
    };

    const handleToggleButton = (event, newValue) => {
        if(newValue !== null){
          setToggleValue(newValue);
        }
    }
    
    const handleSliderChange = (event, newValue) => {
        setSliderValue(newValue);
    };

   useEffect(()=>{
      
      fetchMarkerInfo();
        
   }, [markerPanelInfo]);

   const fetchMarkerInfo = async () => {
        let res = await getMarkerInfo({
            date: markerPanelInfo.date,
            id: markerPanelInfo.id
        });
        if(res.status === 'success'){
            setMarkerInfo(res.result);
            setSliderValue(parseInt(res.result.location_at));
            //res.result.location_at
        }else{
            setMarkerInfo(null);
        }
        res = await getTracking({
            date: markerPanelInfo.date,
            id: markerPanelInfo.id
        });
        //console.log(res);
        if(res.status === 'success'){
           //setTrackSource(res.result);

        }else{
           //setTrackSource(null);
        }
   }

   return (
        <Drawer
            className={classes.drawer}
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
                    onChange={handleToggleButton} aria-label="marker button group"
                >
                    <ToggleButton value="properties" aria-label="Properties">
                       Properties
                    </ToggleButton>
                    <ToggleButton value="tracking" aria-label="Tracking">
                       Tracking
                    </ToggleButton>
                </ToggleButtonGroup>
          </Grid>
          {toggleValue === 'properties' && (
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
          )}
          {
              toggleValue === 'tracking' && (
                <div className={classes.mapContainer}>
                    <ReactMapGL className={classes.mapDiv}
                        {...viewport}    
                        width="100%"
                        height="100%"
                        mapStyle="mapbox://styles/mapbox/light-v10"
                        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                        attributionControl={false}
                        maxZoom={24}
                        minZoom={14}
                        onViewportChange={setViewport}
                    >
                        
                       <NavigationControl style={{ top:10,left:10}}/>
                    </ReactMapGL>
                    <Grid container className={classes.timeslider} justifyContent="center">
                        <Paper>
                            <Typography variant="h6" align="center">
                                {`UTC ${timeFormat(sliderValue-secondsFromDate(markerPanelInfo.date))} ${markerPanelInfo.date}`}
                            </Typography>
                            <Slider
                                aria-label="track time"
                                value={sliderValue}
                                onChange={handleSliderChange}
                                defaultValue={86399}
                                min={secondsFromDate(markerPanelInfo.date)}
                                max={secondsFromDate(markerPanelInfo.date)+86399}
                                setp={10}
                                //valueLabelDisplay="auto"
                                style={{color:'#ff844b'}}
                                marks = {[
                                    { value: secondsFromDate(markerPanelInfo.date), label: '0'},
                                    { value: secondsFromDate(markerPanelInfo.date)+3*3600, label: '3'},
                                    { value: secondsFromDate(markerPanelInfo.date)+6*3600, label: '6'},
                                    { value: secondsFromDate(markerPanelInfo.date)+9*3600, label: '9'},
                                    { value: secondsFromDate(markerPanelInfo.date)+12*3600, label: '12'},
                                    { value: secondsFromDate(markerPanelInfo.date)+15*3600, label: '15'},
                                    { value: secondsFromDate(markerPanelInfo.date)+18*3600, label: '18'},
                                    { value: secondsFromDate(markerPanelInfo.date)+21*3600, label: '21'},
                                    { value: secondsFromDate(markerPanelInfo.date)+24*3600, label: '24'}
                                ]}
                                
                            />
                        </Paper>
                    </Grid>
                </div>  
              )
          }
        </Drawer>
   );
}

export default MarkerPanel;