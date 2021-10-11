import React, { useState, useEffect, useRef } from 'react';

import { makeStyles } from '@mui/styles';

import ReactMapGL, { Source, Layer, ScaleControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from "mapbox-gl";

import numeral from "numeral";

import { MAPBOX_ACCESS_TOKEN } from "../../utils/constants.js";
import { getClusters } from "../../services/cluster.js";

import iconMarker from "../../assets/images/marker-icon.png";

mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const useStyles = makeStyles({
   mapContainer:{
      '& .mapboxgl-ctrl-logo': {
         display: 'none'
       }
   }
});

function Map() {
    const classes = useStyles();
    const mapRef = useRef(null);
    const [viewport, setViewport] = useState({
        longitude: 0,
        latitude: 0,
        zoom: 1
    });

    const [clusterSource, setClusterSource] = useState({
        type: 'FeatureCollection',
        features:[]
    });
    //const [mapCursor, setMapCursor] = useState('default');
    
    const handleViewport = (viewport) => {
        setViewport(viewport);
    }
    /*
    const handleMouseMove = (e) => {
        let features = mapRef.current.queryRenderedFeatures([[e.point[0] - 5, e.point[1] - 5], [e.point[0] + 5, e.point[1] + 5]]);
        if(features.length>0){
           setMapCursor('pointer');
        }else{
           setMapCursor('default');
        }
    }
    */ 
    const handleClick = (e) => {
        if(e.features && e.features.length>0){
            const feature = e.features[0];
            if(feature.layer.id === 'cluster-layer'){
                setViewport({
                    ...viewport,
                    longitude: feature.geometry.coordinates[0],
                    latitude: feature.geometry.coordinates[1],
                    zoom: viewport.zoom + 1,
                    transitionDuration: 500
                });
            }
        }
    }

    useEffect(()=>{

        const map = mapRef.current.getMap();

        let timeout = null;

        map.loadImage(iconMarker, (error, image) => {
            if (error) throw error;
            // Add the image to the map style.
            map.addImage('marker-icon', image);
        });

        map.on('moveend', mapDataCallback);

        function mapDataCallback(){
            if(timeout){
                clearTimeout(timeout);
            }
            timeout = setTimeout(async () => {
               let res = await getClusters({
                   zoom: map.getZoom(),
                   bounds: map.getBounds().toArray().flat()
               });
               if(res.status === 'success'){
                   if(res.result && res.result.features){
                        res.result.features.forEach(feature => {
                            var abbr = numeral(feature.properties["point_count"]).format("0.[0] a").toUpperCase();
                            if(feature.properties["point_count"]>=1000){
                               abbr += '+';
                            }
                            feature.properties["point_count_abbreviated"] = abbr;
                        });
                        setClusterSource(res.result);
                   }
               }
            }, 500);
        }

    }, []);

    return (
        <ReactMapGL className={classes.mapContainer}
            {...viewport}    
            width="100%"
            height="100%"
            mapStyle="mapbox://styles/mapbox/light-v10"
            mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
            ref={mapRef}
            attributionControl={false}
            maxZoom={24}
            //minZoom={16}
            //maxPitch={0}
            //dragPan={dragPan}
            //preserveDrawingBuffer={true}
            //dragRotate={false}
            //transitionDuration={100}
            onViewportChange={handleViewport}
            interactiveLayerIds={['cluster-layer','unclustered-point-layer']}
            //getCursor={() => mapCursor}
            //onMouseMove={handleMouseMove}
            onClick={handleClick}
            //onMouseDown={handleMouseDown}
            //onMouseUp={handleMouseUp}
            //onTouchStart={handleMouseDown}
            //onTouchMove={handleMouseMove}
            //onTouchEnd={handleMouseUp}
        >
            <Source
                id="clusterSource"
                type="geojson"
                data={clusterSource}
                //cluster={true}
                //clusterMaxZoom={14}
                //clusterRadius={50}
            >
                <Layer
                    id='cluster-layer'
                    type='circle'
                    source='clusterSource'
                    filter={['>', 'point_count', 1]}
                    paint={{
                    'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
                    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
                    }}
                />
                <Layer 
                    id='cluster-count-layer'
                    type='symbol'
                    source='clusterSource'
                    filter={['>', 'point_count', 1]}
                    layout={{
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12
                    }}
                />
                <Layer
                    id='unclustered-point-layer'
                    type='symbol'
                    source='clusterSource'
                    filter={['==', 'point_count', 1]}
                    layout={{
                        'icon-image': 'marker-icon',
                        'icon-size': 0.6,
                        'icon-rotate': ["get","heading"]
                    }}
                />
            </Source>
            <ScaleControl 
                style={{bottom:10,left:10}} />
        </ReactMapGL>
    );
}

export default Map;