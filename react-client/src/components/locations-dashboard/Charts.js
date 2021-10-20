import React, { useState} from 'react';

import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

function Charts() {
    const [toggleValue, setToggleValue] = useState('platform');
    return(
       <Grid container justifyContent="center">
           <ToggleButtonGroup 
                value={toggleValue} exclusive
                onChange={(e, newValue) => setToggleValue(newValue)} aria-label="chart button group"
            >
                <ToggleButton value="platform" aria-label="Platform">
                   Platform
                </ToggleButton>
                <ToggleButton value="device_model" aria-label="Device Model">
                   Device Model
                </ToggleButton>
                <ToggleButton value="category_1" aria-label="Category 1">
                   Category 1
                </ToggleButton>
                <ToggleButton value="category_2" aria-label="Category 2">
                   Category 2
                </ToggleButton>
            </ToggleButtonGroup>
       </Grid>
    );
}
export default Charts;