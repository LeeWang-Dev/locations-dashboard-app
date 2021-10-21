import React, { useEffect, useState } from 'react';

import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Badge from '@mui/material/Badge';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import CalendarPickerSkeleton from '@mui/lab/CalendarPickerSkeleton';
import PickersDay from '@mui/lab/PickersDay';

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import imgLogo from "../../assets/images/logo.png";

import { google } from "./../../utils/settings.js";
import { dateFormat } from "../../utils/util.js";
import { getDays } from "../../services/days.js";

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
 
 let timeout = null;

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
     const [isLoading, setIsLoading] = useState(false);
     const [highlightedDays, setHighlightedDays] = useState([]);
     
     const handleMonthChange = (date) => {
        setIsLoading(true);
        setHighlightedDays([]);
        fetchHighlightedDays(date);
     }

     const fetchHighlightedDays = (date) => {
        if(timeout){
           clearTimeout(timeout);
        }
        timeout = setTimeout(async () => {
            let res = await getDays({dateString:dateFormat(date)});
            setIsLoading(false);
            if(res.status === 'success'){
              setHighlightedDays(res.result);
            }
        }, 500);
     };

     useEffect(() => {
        var input = document.getElementById("input-address");
        const autocomplete = new google.maps.places.Autocomplete(input);
        google.maps.event.addListener(autocomplete, "place_changed", function () {
          var place = autocomplete.getPlace();
          setSearchLocation(place.geometry.location.toJSON());
          setAddress(place.formatted_address);
        });

        fetchHighlightedDays(selectedDate);
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
                        //label="Select Date"
                        value={selectedDate}
                        loading={isLoading}
                        renderLoading={() => <CalendarPickerSkeleton />}
                        renderInput={(params) => <TextField {...params} />}
                        renderDay={(day, _value, DayComponentProps) => {
                            const isSelected =
                              !DayComponentProps.outsideCurrentMonth &&
                              highlightedDays.indexOf(day.getDate()) > -1;
                            return (
                               <PickersDay 
                                  key={day.toString()} 
                                  {...DayComponentProps} 
                                  //disabled={!isSelected}
                                  style={{border: isSelected?'1px solid #ff844b':0}}
                               />
                            );
                          }}
                          onMonthChange={handleMonthChange}
                          onChange={(newValue) => {
                            setSelectedDate(newValue);
                            setTimeRange([0,24]);
                          }}
                    />
                </LocalizationProvider>
            </Grid>
        </Grid>
     );
 }

export default Header;