import React, { useEffect, useState } from 'react';

import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Drawer from '@mui/material/Drawer';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const useStyles = makeStyles({
    markerInfoDrawer:{
       '& .MuiBackdrop-root':{
           //position:'absolute'
           //backgroundColor:'transparent' //'rgba(0,0,0,0.2)'
       },
       '&>.MuiPaper-root':{
           //position: 'absolute',
           width:'50%',
           padding:40,
           backgroundColor:'#f1f6fa'
       }
    },
    header:{
      display:'flex',
      flexDirection:'row',
      paddingBottom:10,
      marginBottom:20,
      borderBottom:'1px solid #e3ebf1'
    }
 });

function MarkerPanel(props) {
    const classes = useStyles();
    const {
        markerInfo,
        setMarkerInfo
    } = props;

    const [toggleValue, setToggleValue] = useState('properties');

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setMarkerInfo({
            ...markerInfo,
            open: open
        });
    };

   useEffect(()=>{
      //console.log(markerInfo);
   }, [markerInfo]);

   return (
        <Drawer
            className={classes.markerInfoDrawer}
            anchor="left"
            open={true}
            onClose={toggleDrawer(false)}
        >
          <Grid container className={classes.header} justifyContent="space-between" alignItems="center">
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
          <Paper>
                <Typography variant="caption">
                    Advertiser ID
                </Typography>
                <Typography variant="h6">
                    Advertiser ID
                </Typography>
          </Paper>
        </Drawer>
   );
}

export default MarkerPanel;