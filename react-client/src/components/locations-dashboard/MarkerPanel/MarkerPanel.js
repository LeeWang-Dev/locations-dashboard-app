import React, { useState } from 'react';

import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import PermDeviceInformationIcon from '@mui/icons-material/PermDeviceInformation';

import MarkerInfo from "./MarkerInfo.js";
import TrackingMap from './TrackingMap.js';

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
           boxSizing:'border-box',
           overflowX:'hidden',
           overflowY:'auto'
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
 });

function MarkerPanel(props) {
    const classes = useStyles();
    const {
        markerPanelInfo,
        setMarkerPanelInfo
    } = props;

    const [toggleValue, setToggleValue] = useState('properties');
    
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
    
    return (
        <Drawer
            className={classes.drawer}
            anchor="left"
            open={true}
            onClose={toggleDrawer(false)}
        >
          <Grid container spacing={1} className={classes.drawerHeader} alignItems="center">
                <Grid item md={6} xs={12} container>
                    <PermDeviceInformationIcon color="warning" style={{marginRight:10}}/>
                    <Typography variant="h6" style={{flex:1}}>
                        Device Information
                    </Typography>
                </Grid>    
                <Grid item md={6} xs={12} container justifyContent="flex-end">
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
          </Grid>
          {toggleValue === 'properties' && (
             <MarkerInfo params={markerPanelInfo} />
          )}
          {toggleValue === 'tracking' && (
             <TrackingMap params={markerPanelInfo} />
          )}
        </Drawer>
   );
}

export default MarkerPanel;