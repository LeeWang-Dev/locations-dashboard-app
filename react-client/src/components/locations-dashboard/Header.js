import React, { useState} from 'react';

import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

import imgLogo from "../../assets/images/logo.png";

const useStyles = makeStyles({
    header:{
       padding:'10px 20px',
       backgroundColor:'white'
    },
    logo:{
        height: 80
    },
    headerTitle:{
       flex:1
    }
 });
 
 function Header(props) {
     const classes = useStyles();
     const { selectedDate, setSelectedDate } = props;
     return (
        <Grid container className={classes.header} spacing={3}>
            <Grid container item sm={4} justifyContent="center" alignItems="center">
                <img src={imgLogo} className={classes.logo} />
            </Grid>
            <Grid container item sm={4} justifyContent="center" alignItems="center">
                <Typography className={classes.headerTitle} variant="h4" align="center">
                    Locations Dashboard
                </Typography>
            </Grid>
            <Grid container item sm={4} justifyContent="center" alignItems="center">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Locations Date"
                        value={selectedDate}
                        onChange={(newValue) => {
                            setSelectedDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </Grid>
        </Grid>
     );
 }

export default Header;