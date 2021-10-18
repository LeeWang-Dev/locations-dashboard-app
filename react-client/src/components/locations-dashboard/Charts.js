import React, { useState} from 'react';

import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

function Charts() {
    const [toggleValue, setToggleValue] = useState();
    return(
       <Grid container justifyContent="center">
           <ToggleButtonGroup 
                value={toggleValue} exclusive
                onChange={(e, newValue) => setToggleValue(newValue)} aria-label="general conditions button group"
            >
                <ToggleButton value="general_conditions" aria-label="General Conditions">
                   Platform
                </ToggleButton>
                <ToggleButton value="roof_slope" aria-label="Roof Slope">
                   Device Model
                </ToggleButton>
                <ToggleButton value="roof_drainage" aria-label="Roof Drainage">
                   Category 1
                </ToggleButton>
                <ToggleButton value="wall_details" aria-label="Wall Details">
                   Category 2
                </ToggleButton>
                <ToggleButton value="roof_details" aria-label="Roof Details">
                   Category 3
                </ToggleButton>
            </ToggleButtonGroup>
       </Grid>
    );
}
export default Charts;