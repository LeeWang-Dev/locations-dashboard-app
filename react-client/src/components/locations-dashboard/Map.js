import React, { useState, useEffect } from 'react';

import { makeStyles } from '@mui/styles';

import ReactMapGL, { Marker } from 'react-map-gl';

import { MAPBOX_ACCESS_TOKEN } from "../../utils/constants.js";
import { getMarkers } from "../../services/locations.js";

const useStyles = makeStyles({
   mapContainer:{
      '& .mapboxgl-ctrl-logo': {
         display: 'none'
       }
   }
});

function Map() {
    const classes = useStyles();
    const [viewport, setViewport] = useState({
        longitude: -122.45,
        latitude: 37.78,
        zoom: 14
    });

    const [markers, setMarkers] = useState([]);

    useEffect(async ()=>{

        var result = await getMarkers();
        console.log(result);
        //setMarkers(result);
 
    }, []);

    return (
        <ReactMapGL className={classes.mapContainer}
            {...viewport}    
            width="100%"
            height="100%"
            mapStyle="mapbox://styles/mapbox/satellite-v9"
            mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
            //ref={mapRef}
            attributionControl={false}
            maxZoom={24}
            //minZoom={16}
            //maxPitch={0}
            //dragPan={dragPan}
            //preserveDrawingBuffer={true}
            //dragRotate={false}
            //transitionDuration={100}
            onViewportChange={setViewport}
            //getCursor={() => mouseCursor}
            //onMouseMove={handleMouseMove}
            //onClick={handleMouseClick}
            //onMouseDown={handleMouseDown}
            //onMouseUp={handleMouseUp}
            //onTouchStart={handleMouseDown}
            //onTouchMove={handleMouseMove}
            //onTouchEnd={handleMouseUp}
        >
            <Marker latitude={37.78} longitude={-122.41} offsetLeft={-20} offsetTop={-10}>
                <div>You are here</div>
            </Marker>
        </ReactMapGL>
    );
}

export default Map;