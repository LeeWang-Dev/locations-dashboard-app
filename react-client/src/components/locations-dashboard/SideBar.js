import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
//import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MapIcon from '@mui/icons-material/Map';
import FavoriteIcon from '@mui/icons-material/Favorite';

import numeral from "numeral";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { addPlace, getPlaces, deletePlace } from '../../services/place.js';

const useStyles = makeStyles({
    sideBarHeader:{
        padding:10,
        paddingBottom:10,
        //borderBottom:'1px solid #e3ebf1',
        backgroundColor:'#f1f6fa'
    },
    sideBarContent:{
        flex:1,
        height:0,
        overflowY:'auto'
    },
    label:{
        display:'block',
        paddingTop:16,
        paddingLeft:24,
        paddingBottom:4
    },
    listItem:{
        '&.MuiListItem-root':{
            borderBottom:'1px solid #eee'
        },
        '& .MuiListItemButton-root':{
           borderRadius:0,
          
        },
        '& .MuiAvatar-root':{
            width:90,
            height:90,
            borderRadius:4
        }
    }
});

function SideBar(props) {
   const classes = useStyles();
   const {
      searchPlace,
      setSearchPlace
   } = props;
   const [places, setPlaces] = useState([]);
   const [addPlaceDialogOpen, setAddPlaceDialogOpen] = useState(false);
   const [deletePlaceDialogOpen, setDeletePlaceDialogOpen] = useState(false);
   const [addPlaceDisabled, setAddPlaceDisabled] = useState(true);

   const handleURLChange = (e) => {
      setSearchPlace({
          ...searchPlace,
          image:e.target.value
      }); 
   }
   
   const handleAddPlace = async () => {
      setAddPlaceDialogOpen(false);
      let res = await addPlace(searchPlace);
      if(res.status === 'success'){
          setPlaces([
            ...places,
            searchPlace
          ]);
          setAddPlaceDisabled(true);
      }else{
          console.log(res.message);
      }
   }

   const handleDeletePlace = (place) => (e) => {
        setDeletePlaceDialogOpen(true);
        setSearchPlace(place);
   }

   const handleDeletePlaceDialogOk = async () => {
       setDeletePlaceDialogOpen(false);
       if(searchPlace){
            let res = await deletePlace({place_id:searchPlace.place_id});
            if(res.status === 'success'){
                let newPlaces = places.filter(place=>place.place_id !== searchPlace.place_id);
                setPlaces(newPlaces);
                setSearchPlace(null);
            }else{
                console.log(res.message);
            }
       }
   }

   useEffect(() => {
      if(searchPlace){
        let filters = places.filter(place=>place.place_id===searchPlace.place_id);
        if(filters.length>0){
            setAddPlaceDisabled(true);
        }else{
            setAddPlaceDisabled(false);   
        }
      }else{
         setAddPlaceDisabled(true);
      }
   }, [searchPlace]);

   useEffect(() => {

      fetchPlaces();

   }, []);

   const fetchPlaces = async () => {
      let res = await getPlaces();
      if(res.status === 'success'){
          setPlaces(res.result);
      }else{
          console.log(res.message);
      }
   }

   return (
        <>
        <div className={classes.sideBarHeader}>
            <Grid container justifyContent="space-between" alignItems="center">
                <FavoriteIcon color="warning" style={{marginRight:10}} />
                <Typography variant="h6" style={{flex:1}}>
                    Favorite Places
                </Typography>
                <Button 
                    color="warning" 
                    startIcon={<AddCircleOutlineIcon />}
                    disabled={addPlaceDisabled}
                    onClick={()=>setAddPlaceDialogOpen(true)}
                    >
                    Add Place
                </Button>
            </Grid>  
            {places.length>0 && (
                <Grid container justifyContent="center">
                    <Typography variant="caption">
                        {`${places.length} places`}
                    </Typography>
                </Grid>
            )}
        </div>
        <div className={classes.sideBarContent}>
        {
            places.length>0?
                <List dense={true} >
                    {
                        places.map((place,index)=>(
                            <ListItem 
                                key={place.place_id} 
                                className={classes.listItem}
                                disablePadding={true}
                                secondaryAction={
                                    <IconButton 
                                        edge="end" aria-label="delete"
                                        onClick={handleDeletePlace(place)}
                                    >
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemButton 
                                  selected={searchPlace?searchPlace.place_id===place.place_id:false}
                                  onClick={()=>setSearchPlace(place)}
                                >
                                    <ListItemText 
                                        primary={
                                            <Typography variant="subtitle2" style={{marginBottom:4}}>
                                                {place.name}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                            {place.user_ratings_total>0 && (
                                                <Grid container alignItems="center">
                                                    <Typography variant="caption">
                                                       {place.rating} 
                                                    </Typography>
                                                    <Rating 
                                                        name="rating" 
                                                        size="small"
                                                        defaultValue={0} 
                                                        precision={0.1} 
                                                        readOnly
                                                        value={place.rating} 
                                                        style={{marginLeft:5,marginRight:5}}
                                                    />
                                                    <Typography variant="caption">
                                                       {`(${numeral(place.user_ratings_total).format("0,0")})`}
                                                    </Typography>
                                                </Grid>
                                            )}
                                            <Typography variant="caption" component="div">
                                                {place.type}
                                            </Typography>
                                            <Typography variant="caption">
                                                {place.address}
                                            </Typography>
                                            </>
                                        }
                                    />
                                    <ListItemAvatar>
                                        <Avatar
                                            alt="image"
                                            src={place.image}
                                        />
                                    </ListItemAvatar>
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                </List>
            :
                <>
                <Typography variant="body1" component="div" align="center" style={{marginTop:30,padding:10}}>
                    Places is empty.
                </Typography> 
                <Typography variant="body1" component="div" align="center" style={{padding:10}}>
                    Please add your favorite places.
                </Typography>     
                </>
        }
        </div>
        <Dialog
            open={addPlaceDialogOpen}
            onClose={()=>setAddPlaceDialogOpen(false)}
            aria-labelledby="dialog-add-place"
            aria-describedby="dialog-add-place"
        >
            <DialogTitle>
                Add Place
                <IconButton
                    aria-label="close"
                    onClick={()=>setAddPlaceDialogOpen(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                  <CloseIcon />
                </IconButton>
            </DialogTitle>
            <ValidatorForm
                onSubmit={handleAddPlace}
                style={{ width: "100%" }}
            >
                <DialogContent>
                    <ListItem 
                       className={classes.listItem}
                       disablePadding
                       style={{paddingBottom:10}}
                    >
                        <ListItemText 
                            primary={
                                <Typography variant="subtitle2" style={{marginBottom:4}}>
                                    {searchPlace?searchPlace.name:''}
                                </Typography>
                            }
                            secondary={
                                <>
                                {(searchPlace && searchPlace.user_ratings_total>0) && (
                                    <Grid container alignItems="center">
                                        <Typography variant="caption">
                                        {searchPlace?searchPlace.rating:''} 
                                        </Typography>
                                        <Rating 
                                            name="rating" 
                                            size="small"
                                            defaultValue={0} 
                                            precision={0.1} 
                                            readOnly
                                            value={searchPlace?searchPlace.rating:0} 
                                            style={{marginLeft:5,marginRight:5}}
                                        />
                                        <Typography variant="caption">
                                        {searchPlace?`(${numeral(searchPlace.user_ratings_total).format("0,0")})`:''}
                                        </Typography>
                                    </Grid>
                                )}
                                <Typography variant="caption" component="div">
                                    {searchPlace?searchPlace.type:''}
                                </Typography>
                                <Typography variant="caption">
                                    {searchPlace?searchPlace.address:''}
                                </Typography>
                                </>
                            }
                        />
                        <ListItemAvatar>
                            <Avatar
                                alt="image"
                                src={searchPlace?searchPlace.imageLink:''}
                            />
                        </ListItemAvatar>
                    </ListItem>
                    <Button
                       color="warning"
                       startIcon={<MapIcon />}
                       style={{padding:'5px 10px',marginTop:10,marginBottom:10}}
                       onClick={()=>window.open(searchPlace.imageLink,'_blank')}
                    >
                       Open Image Link
                    </Button>
                    <TextValidator 
                        name="postcode"
                        placeholder="google place image url"
                        fullWidth
                        value={searchPlace?searchPlace.image:''}
                        onChange={handleURLChange}
                        validators={['required']}
                        errorMessages={['Image URL is required.']}
                    />
                </DialogContent>
                <DialogActions>
                    <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth
                            onClick={()=>setAddPlaceDialogOpen(false)}
                        >Cancel</Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button 
                            type="submit"
                            variant="contained"
                            color="warning"
                            autoFocus
                            fullWidth
                        >Add</Button>
                    </Grid>
                    </Grid>
               </DialogActions>
            </ValidatorForm>  
        </Dialog>
        <Dialog
            open={deletePlaceDialogOpen}
            onClose={()=>setDeletePlaceDialogOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle>
                Delete Place
                <IconButton
                    aria-label="close"
                    onClick={()=>setDeletePlaceDialogOpen(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                  <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1" align="center" style={{marginTop:20}}>
                   Are you sure you want to delete selected place?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Grid container spacing={3}>
                   <Grid item xs={12} sm={6}>
                      <Button 
                         variant="contained" 
                         color="primary" 
                         fullWidth
                         onClick={()=>setDeletePlaceDialogOpen(false)}
                      >Cancel</Button>
                   </Grid>
                   <Grid item xs={12} sm={6}>
                      <Button 
                         variant="contained"
                         color="warning"
                         autoFocus
                         fullWidth
                         onClick={handleDeletePlaceDialogOk}
                      >Yes</Button>
                   </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
        </>
   );

}

export default SideBar;