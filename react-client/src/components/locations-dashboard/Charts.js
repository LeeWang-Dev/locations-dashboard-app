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
                onChange={(e, newValue) => setToggleValue(newValue)} aria-label="general conditions button group"
            >
                <ToggleButton value="platform" aria-label="General Conditions">
                   Platform
                </ToggleButton>
                <ToggleButton value="device_model" aria-label="Roof Slope">
                   Device Model
                </ToggleButton>
                <ToggleButton value="category_1" aria-label="Roof Drainage">
                   Category 1
                </ToggleButton>
                <ToggleButton value="category_2" aria-label="Wall Details">
                   Category 2
                </ToggleButton>
            </ToggleButtonGroup>
       </Grid>
    );
}
export default Charts;