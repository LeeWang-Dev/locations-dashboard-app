import React, { useEffect, useState } from 'react';

import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import CalendarPickerSkeleton from '@mui/lab/CalendarPickerSkeleton';
import PickersDay from '@mui/lab/PickersDay';

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CategoryIcon from '@mui/icons-material/Category';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';

import imgLogo from "../../assets/images/logo.png";

import { google, categories, category_distances } from "./../../utils/settings.js";
import { dateFormat } from '../../utils/util.js';
import { getDays } from "../../services/days.js";

const useStyles = makeStyles({
    header:{
       width:'100%',
       padding:10,
       backgroundColor:'white'
    },
    logo:{
        height: 75
    }
 });
 
 let timeout = null;

 function Header(props) {
     const classes = useStyles();
     const { 
         searchPlace,
         setSearchPlace,
         filter,
         setFilter
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
            let res = await getDays({date:dateFormat(date)});
            setIsLoading(false);
            if(res.status === 'success'){
              setHighlightedDays(res.result);
            }
        }, 500);
     };

     useEffect(() => {
        var input = document.getElementById("input-address");
        const options = {
            componentRestrictions: { country: "jp" },
        };
        const autocomplete = new google.maps.places.Autocomplete(input, options);
        const placeChangeHandle = google.maps.event.addListener(autocomplete, "place_changed", function () {
          var place = autocomplete.getPlace();
          if(place && place.geometry && place.formatted_address){
            var placePhotoUrl=place.url;
            if(place.photos){
               placePhotoUrl = place.photos[0].getUrl({maxWidth:128}); 
            }
            setSearchPlace({
              place_id:place.place_id,
              location:[
                place.geometry.location.lng(),
                place.geometry.location.lat()
              ],
              viewport:[
                place.geometry.viewport.getSouthWest().lng(),
                place.geometry.viewport.getSouthWest().lat(),
                place.geometry.viewport.getNorthEast().lng(),
                place.geometry.viewport.getNorthEast().lat()
              ],
              name:place.name,
              address:place.formatted_address,
              type:place.types?place.types[0]:'',
              rating:place.rating??0,
              user_ratings_total:place.user_ratings_total??0,
              url:place.url,
              imageLink: placePhotoUrl,
              image:''
            });
          }
        });

        fetchHighlightedDays(filter.date);

        return () => {
           //google.maps.event.clearListeners(autocomplete, 'place_changed');
           google.maps.event.removeListener(placeChangeHandle);
        }
     }, []);

     useEffect(() => {
        if(searchPlace){
          document.getElementById("input-address").value=searchPlace.address;
        }else{
          document.getElementById("input-address").value='';
        }
     },[searchPlace]);

     return (
        <Grid container className={classes.header} spacing={1} alignItems="center">
            <Grid container item lg={3} md={12} justifyContent="center">
                <img src={imgLogo} className={classes.logo} alt="logo" />
            </Grid>
            <Grid container item spacing={2} lg={9} md={12}>
                <Grid item md={4}>
                    <TextField
                      id="input-address"
                      name="address"
                      //variant="outlined"
                      //InputLabelProps={{ shrink: true }}
                      placeholder="Enter your address."
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                              <IconButton aria-label="toggle password visibility"
                                  onClick={()=>setSearchPlace(null)}
                                  onMouseDown={(e)=>e.preventDefault()}
                                  edge="end"
                              >{(searchPlace && searchPlace.address) && <CloseIcon />}
                              </IconButton>
                          </InputAdornment>
                        )
                      }}
                      autoComplete="off"
                    />
                </Grid>
                <Grid item md={3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            //label="Select Date"
                            value={filter.date}
                            loading={isLoading}
                            renderLoading={() => <CalendarPickerSkeleton />}
                            renderInput={(params) => <TextField {...params} fullWidth />}
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
                              onYearChange={handleMonthChange}
                              onChange={(newValue) => {
                                if(newValue!==null){
                                  setFilter({
                                    ...filter,
                                    date: newValue
                                  });
                                }
                              }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item md={3}>
                  <TextField
                    variant="outlined"
                    //label="Select categories"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    select={true}
                    SelectProps={{
                        MenuProps: {
                          anchorOrigin: { vertical: "bottom", horizontal: "center" },
                          transformOrigin: { vertical: "top", horizontal: "center" },
                          getContentAnchorEl: null
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CategoryIcon />
                        </InputAdornment>
                      )
                    }}
                    value={filter.category}
                    onChange={(e) => setFilter({...filter, category: e.target.value})}
                  >
                    {  
                      categories.map((item,index)=>(
                        <MenuItem key={`category-${index}`} value={item}>
                            {item}
                        </MenuItem>  
                      ))
                    }
                  </TextField>
                </Grid>
                <Grid item md={2}>
                  <TextField
                      variant="outlined"
                      //label="Select categories"
                      //placeholder="Select Category"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      select={true}
                      SelectProps={{
                          MenuProps: {
                            anchorOrigin: { vertical: "bottom", horizontal: "center" },
                            transformOrigin: { vertical: "top", horizontal: "center" },
                            getContentAnchorEl: null
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ShareLocationIcon />
                          </InputAdornment>
                        )
                      }}
                      value={filter.category_distance}
                      onChange={(e) => setFilter({...filter, category_distance: e.target.value})}
                      disabled={filter.category==='All Categories'?true:false}
                    >
                      {  
                        category_distances.map((item,index)=>(
                          <MenuItem key={`d-${index}`} value={item}>
                              {`${item} m`}
                          </MenuItem>  
                        ))
                      }
                  </TextField>
                </Grid>
            </Grid>
        </Grid>
     );
 }

export default Header;