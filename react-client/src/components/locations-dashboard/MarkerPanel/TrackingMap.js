import React, { useEffect, useState, useRef, useCallback} from 'react';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

import ReactMapGL, { 
    Source,
    Layer,
    Popup,
    WebMercatorViewport
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from "mapbox-gl";
import { MAPBOX_ACCESS_TOKEN } from "../../../utils/settings.js";

import * as turf from '@turf/turf'

import iconMarker from "../../../assets/images/marker-icon.png";

import { timeFormat, secondsFromDate } from "../../../utils/util.js";
import { getTracking } from "../../../services/marker.js";

import PopupInfo from "./PopupInfo.js";

mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const useStyles = makeStyles({
    mapContainer:{
        flex:1,
        position:'relative'
     },
     mapDiv:{
         border:'1px solid #e3ebf1',
        '& .mapboxgl-ctrl-logo': {
            display: 'none'
         }
     },
     timeslider:{
         position:'absolute',
         bottom:10,
         left:0,
         right:0,
         '& .MuiPaper-root':{
            width:'70%',
            paddingTop:10,
            paddingBottom:5,
            paddingLeft:40,
            paddingRight:40,
            backgroundColor:'rgba(255,255,255,0.7)',
         },
         '&.MuiSlider-root':{
           //position:'absolute'
           width:'60%'
        }
     }
});

function TrackingMap(props){
    const classes = useStyles();
    const { params } = props;
    const mapRef = useRef(null);
    const [viewport, setViewport] = useState({
        longitude: params.geometry.coordinates[0],
        latitude: params.geometry.coordinates[1],
        zoom:15
    });
    const [interactiveLayerIds, setInteractiveLayerIds] = useState(null);
    const [sliderProps, setSliderProps] = useState({
        min:0,
        max:100,
        step: 1,
        defaultValue:0,
        marks:[]
    });
    
    const [sliderValue, setSliderValue] = useState(0);
    const [sliderLabel, setSliderLabel] = useState('');
    //const [isLoading, setIsLoading] = useState(true);
    const [points, setPoints] = useState({
        type: 'FeatureCollection',
        features:[]
    });
    const [trackPoints, setTrackPoints] = useState([]);
    const [trackPoint, setTrackPoint] = useState({
        type: 'FeatureCollection',
        features:[]
    });
    const [trackLine, setTrackLine] = useState({
        type: 'FeatureCollection',
        features:[]
    });
    
    const [hoverInfo, setHoverInfo] = useState(null);

    const onHover = useCallback(e => {
        if(e.features && e.features.length>0){
            const feature = e.features[0];
            if(feature.layer.id==='points-layer'){
                setHoverInfo({
                    longitude: e.lngLat[0],
                    latitude: e.lngLat[1],
                    data: feature.properties
                });
            }else{
               setHoverInfo(null);
            }
        }else{
            setHoverInfo(null);
        }
    }, []);

    const handleSliderChange = (event, newValue) => {
        setSliderValue(newValue);
        setSliderLabel(`UTC ${timeFormat(newValue-secondsFromDate(params.date))} ${params.date}`);

        // current track line
        let newTrackLine={
            type: 'FeatureCollection',
            features:[{
                type:'Feature',
                geometry:{
                    type:'LineString',
                    coordinates:[]
                },
                properties:{}
            }]
        }
        let newPoint = null;
        trackPoints.forEach(point=>{
            if(point.time<=newValue){
                newTrackLine.features[0].geometry.coordinates.push([
                    point.longitude,
                    point.latitude,
                ]);
                newPoint = point;
            }else{
                return;
            }
        });
        setTrackLine(newTrackLine);

        // current track point
        if(newPoint){
            let newTrackPoint={
                type: 'FeatureCollection',
                features:[{
                    type:'Feature',
                    geometry:{
                        type:'Point',
                        coordinates:[newPoint.longitude, newPoint.latitude]
                    },
                    properties:{heading: newPoint.heading}
                }]
            }
            setTrackPoint(newTrackPoint);
        }
    };

    const fetchTrackingData = async () => {
        let res = await getTracking({
            date: params.date,
            id: params.id
        });

        if(res.status === 'success'){
            let result = res.result;
            // full extent map
            var bbox = turf.bbox(result);
            const map = mapRef.current.getMap();
            const { longitude, latitude, zoom } = new WebMercatorViewport({
                ...viewport,
                width: map.getCanvas().width,
                height: map.getCanvas().height,
                }).fitBounds(
                [
                    [bbox[0], bbox[1]],
                    [bbox[2], bbox[3]],
                ],
                { padding: 40 }
            );
            setViewport({
                ...viewport,
                longitude: longitude,
                latitude: latitude,
                zoom: zoom,
            });

            // measured points
            setPoints(result);
            setInteractiveLayerIds(['points-layer']);

            let features = result.features;

            // current track point
            let t = 0;
            features.forEach(feature=>{
                if(feature.properties.id == params.id){
                    setTrackPoint({
                        type:'FeatureCollection',
                        features:[feature]
                    });
                    t = parseInt(feature.properties["location_at"]);
                    setSliderValue(t);
                    setSliderLabel(`UTC ${timeFormat(t-secondsFromDate(params.date))} ${params.date}`);
                    return;
                }
            });

            // calculate track points
            let newTrackPoints = [];
            for(let i=0;i<features.length-1;i++){
                var t1 = parseInt(features[i].properties['location_at']);
                var t2 = parseInt(features[i+1].properties['location_at']);
                var dm=(t2-t1)/10;
                var bearing = turf.bearing(features[i], features[i+1]);
                if(dm>1){
                    var k=0;
                    while(t1<t2){
                        t1+=10;
                        k++;
                        var from_lat=parseFloat(features[i].properties['latitude']);
                        var from_lng=parseFloat(features[i].properties['longitude']);
                        var to_lat=parseFloat(features[i+1].properties['latitude']);
                        var to_lng=parseFloat(features[i+1].properties['longitude']);
                        var lat=from_lat+(to_lat-from_lat)*k/dm;
                        var lng=from_lng+(to_lng-from_lng)*k/dm;
                        newTrackPoints.push({
                           latitude: lat,
                           longitude: lng,
                           time: t1,
                           heading: turf.bearingToAzimuth(bearing),
                        });
                     }
                }
            }
            
            setTrackPoints(newTrackPoints);

            // current track line
            let newTrackLine={
                type: 'FeatureCollection',
                features:[{
                    type:'Feature',
                    geometry:{
                        type:'LineString',
                        coordinates:[]
                    },
                    properties:{}
                }]
            }
            newTrackPoints.forEach(point=>{
                if(point.time<=t){
                    newTrackLine.features[0].geometry.coordinates.push([
                        point.longitude,
                        point.latitude,
                    ]);
                }else{
                    return;
                }
            });
            setTrackLine(newTrackLine);
        }
    }

    useEffect(()=>{
        const map = mapRef.current.getMap();
        
        map.loadImage(iconMarker, (error, image) => {
            if (error) throw error;
            // Add the image to the map style.
            map.addImage('marker-icon', image);
        });

        const t0 = secondsFromDate(params.date);
        setSliderProps({
        min: t0,
        max: t0+86399,
        defaultValue:t0+86399,
        step: 10,
        marks:[
            { value: t0, label: '0'},
            { value: t0+3*3600, label: '3'},
            { value: t0+6*3600, label: '6'},
            { value: t0+9*3600, label: '9'},
            { value: t0+12*3600, label: '12'},
            { value: t0+15*3600, label: '15'},
            { value: t0+18*3600, label: '18'},
            { value: t0+21*3600, label: '21'},
            { value: t0+24*3600, label: '24'}
        ]
        });
        setSliderValue(t0);
        setSliderLabel(`UTC ${timeFormat(0)} ${params.date}`);
        
        fetchTrackingData();
        
    }, []);

    return (
        <div className={classes.mapContainer}>
            <ReactMapGL className={classes.mapDiv}
                {...viewport}    
                width="100%"
                height="100%"
                mapStyle="mapbox://styles/mapbox/light-v10"
                mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                attributionControl={false}
                maxZoom={22}
                //minZoom={14}
                ref={mapRef}
                interactiveLayerIds={interactiveLayerIds}
                onViewportChange={setViewport}
                onHover={onHover}
            >
                <Source id="trackLine" type="geojson" data={trackLine}>
                    <Layer id="trackLine" type="line"
                        filter={['==', '$type', 'LineString']}
                        paint={{
                            'line-color': 'cyan',
                            'line-opacity': 0.75,
                            'line-width': 2
                        }}
                    />
                </Source>   
                <Source id="points" type="geojson" data={points}>
                    <Layer
                        id='points-layer'
                        type='circle'
                        source='points'
                        paint={{
                          'circle-color': '#1976d2',
                          'circle-radius': 6
                        }}
                    />
                </Source>
                <Source id="trackPoint" type="geojson" data={trackPoint}>
                    <Layer
                        id='track-point-layer'
                        type='symbol'
                        source='trackPoint'
                        layout={{
                            'icon-image': 'marker-icon',
                            'icon-size': 0.6,
                            'icon-rotate': ["get","heading"],
                            'icon-allow-overlap':true,
                            'icon-ignore-placement': true,
                            'icon-rotation-alignment':'map', // viewport
                            'icon-pitch-alignment':'viewport'
                        }}
                    />
                </Source>
                {hoverInfo && (
                    <Popup
                        longitude={hoverInfo.longitude}
                        latitude={hoverInfo.latitude}
                        closeButton={false}
                    >
                       <PopupInfo info={hoverInfo.data} params={params} />
                    </Popup>
                )}
            </ReactMapGL>
            <Grid container className={classes.timeslider} justifyContent="center">
                <Paper>
                    <Typography variant="h6" align="center">
                        {sliderLabel}
                    </Typography>
                    <Slider
                        aria-label="track time"
                        value={sliderValue}
                        onChange={handleSliderChange}
                        //valueLabelDisplay="auto"
                        style={{color:'#ff844b'}}
                        {...sliderProps}
                    />
                </Paper>
            </Grid>
        </div>  
    );
}

export default TrackingMap;