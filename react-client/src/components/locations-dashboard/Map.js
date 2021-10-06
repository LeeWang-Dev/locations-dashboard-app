import React, { useState } from 'react';

import { makeStyles } from '@mui/styles';

import ReactMapGL from 'react-map-gl';

import { MAPBOX_ACCESS_TOKEN } from "../../utils/constants.js";

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
        </ReactMapGL>
    );
}

export default Map;