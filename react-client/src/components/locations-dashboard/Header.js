import React, { useEffect } from 'react';

import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import imgLogo from "../../assets/images/logo.png";

import { google } from "./../../utils/settings.js";

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
     const { 
         setSearchLocation,
         address,
         setAddress,
         selectedDate,
         setSelectedDate,
         setTimeRange
     } = props;

     useEffect(() => {
        var input = document.getElementById("input-address");
        const autocomplete = new google.maps.places.Autocomplete(input);
        google.maps.event.addListener(autocomplete, "place_changed", function () {
          var place = autocomplete.getPlace();
          setSearchLocation(place.geometry.location.toJSON());
          setAddress(place.formatted_address);
        });
     }, []);

     return (
        <Grid container className={classes.header} spacing={3}>
            <Grid container item sm={4} justifyContent="center" alignItems="center">
                <img src={imgLogo} className={classes.logo} />
            </Grid>
            <Grid container item sm={4} alignItems="center">
                <TextField
                  id="input-address"
                  name="address"
                  //variant="outlined"
                  //InputLabelProps={{ shrink: true }}
                  placeholder="Enter your address."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                       <InputAdornment position="end">
                            <IconButton aria-label="toggle password visibility"
                                onClick={()=>{
                                    setAddress('');
                                    document.getElementById("input-address").value='';
                                }}
                                onMouseDown={(e)=>e.preventDefault()}
                                edge="end"
                            >{address && <CloseIcon />}
                            </IconButton>
                       </InputAdornment>
                    )
                  }}
                  fullWidth
                  autoComplete="off"
                />
            </Grid>
            <Grid container item sm={4} alignItems="center">
               <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        //label="Locations Date"
                        value={selectedDate}
                        onChange={(newValue) => {
                            var d = newValue.getDate();
                            var m = newValue.getMonth() + 1; //Month from 0 to 11
                            var y = newValue.getFullYear();
                            var dateStr = '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
                            setSelectedDate(dateStr);
                            setTimeRange([0,24]);
                        }}
                        renderInput={(params) =>
                          <TextField {...params} 
                              //fullWidth 
                          />
                        }
                    />
                </LocalizationProvider>
            </Grid>
        </Grid>
     );
 }

export default Header;