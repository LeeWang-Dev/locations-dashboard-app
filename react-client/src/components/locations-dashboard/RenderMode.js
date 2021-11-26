import React from 'react';
import { makeStyles } from '@mui/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const useStyles = makeStyles({
    togglePanel:{
        position:'absolute',
        top:10,
        right:10
    }
 });

function RenderMode(props){
   const classes = useStyles();
   const {
      renderMode,
      setRenderMode
   } = props;

   const handleToggle = (e, newValue) => {
        if(newValue !== null){
           setRenderMode(newValue);
        }
    }

   return (
    <div className={classes.togglePanel}>
        <ToggleButtonGroup 
            value={renderMode} exclusive
            onChange={handleToggle} aria-label="chart button group"
        >
            <ToggleButton value="cluster" aria-label="Cluster">
                Cluster
            </ToggleButton>
            <ToggleButton value="heatmap" aria-label="Heatmap">
                Heatmap
            </ToggleButton>
        </ToggleButtonGroup>
    </div>
   );
}

export default RenderMode;