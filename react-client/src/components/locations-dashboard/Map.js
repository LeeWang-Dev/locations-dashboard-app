
import React, { useState, useEffect, useRef } from 'react';

import { makeStyles } from '@mui/styles';
import LinearProgress from '@mui/material/LinearProgress';

import ReactMapGL, { 
           Source,
           Layer,
           Marker,
           ScaleControl,
           NavigationControl,
           FlyToInterpolator
       } from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from "mapbox-gl";

import numeral from "numeral";

import { MAPBOX_ACCESS_TOKEN, DEFAULT_VIEWPORT } from "../../utils/settings.js";
import { dateFormat } from "../../utils/util.js";
import { getClusters } from "../../services/cluster.js";
import { getCounts } from "../../services/counts.js";

import iconMarker from "../../assets/images/marker-icon.png";
import iconSearch from "../../assets/images/search-marker.png";

import MarkerPanel from "./MarkerPanel/MarkerPanel.js";

mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const useStyles = makeStyles({
   mapDiv:{
      '& .mapboxgl-ctrl-logo': {
         display: 'none'
       }
   },
   addressLabel:{
      display:'flex',
      alignItems:'center',
      padding:'0 10px',
      width:240,
      height:60,
      color:'#000',
      fontSize:14,
      lineHeight:'14px',
      //borderRadius:4,
      borderLeft:'2px solid #ff0000',
      backgroundColor:'rgba(255,255,255,0.8)',
      pointerEvents:'none'
   }
});

let timeout = null;

function Map(props) {
    const classes = useStyles();
    const { 
       searchLocation,
       address,
       selectedDate,
       timeRange,
       setCounts
    } = props;

    const mapRef = useRef(null);
    const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);
    const [interactiveLayerIds, setInteractiveLayerIds] = useState(null);
    const [clusterSource, setClusterSource] = useState({
        type: 'FeatureCollection',
        features:[]
    });
    const [showLoading, setShowLoading] = useState(true);
    
    const [markerPanelInfo, setMarkerPanelInfo] = useState(false);

    const handleClick = async (e) => {
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
            }else if(feature.layer.id === 'unclustered-point-layer'){
                setMarkerPanelInfo({
                    ...markerPanelInfo,
                    open: true,
                    date: dateFormat(selectedDate),
                    id: feature.properties["id"],
                    geometry: feature.geometry
                });
               
            }
        }
    }

    useEffect(()=>{

        const map = mapRef.current.getMap();
        
        map.loadImage(iconMarker, (error, image) => {
            if (error) throw error;
            // Add the image to the map style.
            map.addImage('marker-icon', image);
        });

    }, []);

    useEffect(()=>{
        if(searchLocation){
            setViewport({
               ...viewport,
               latitude: searchLocation.lat,
               longitude: searchLocation.lng,
               zoom: 16,
               //transitionDuration: 4000,
               //transitionInterpolator: new FlyToInterpolator(),
               ////transitionEasing: d3.easeCubic
            });
        }
    }, [searchLocation]);

    useEffect(()=>{

       const map = mapRef.current.getMap();

       map.on('moveend', mapDataCallback);

       mapDataCallback();

    }, [selectedDate, timeRange]);

    const mapDataCallback = () => {
        const map = mapRef.current.getMap();
        if(map.getZoom()<14){
            setClusterSource({
                type: 'FeatureCollection',
                features:[]
            });
            return;
        } 
        if(timeout){
            clearTimeout(timeout);
        }
        timeout = setTimeout(async () => {
           setShowLoading(true);
           let res = await getClusters({
               date: dateFormat(selectedDate),
               timeRange: timeRange,
               zoom: map.getZoom(),
               bounds: map.getBounds().toArray().flat()
           });
           setShowLoading(false);
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
           }else{
                setClusterSource({
                    type: 'FeatureCollection',
                    features:[]
                });
           }
           setInteractiveLayerIds(['cluster-layer','unclustered-point-layer']);

           res = await getCounts({
                date: dateFormat(selectedDate),
                timeRange: timeRange,
                bounds: map.getBounds().toArray().flat()
           });
           if(res.status === 'success'){
              var newCounts = [];
              newCounts['TOTAL'] = 0;
              res.result.forEach(row=>{
                  newCounts[row.platform] = row.count;
                  newCounts['TOTAL'] += parseInt(row.count);
              });
              setCounts(newCounts);
           }else{
              setCounts([]);
           }
        }, 500);
    }

    return (
        <ReactMapGL className={classes.mapDiv}
            {...viewport}    
            width="100%"
            height="100%"
            mapStyle="mapbox://styles/mapbox/light-v10"
            mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
            ref={mapRef}
            attributionControl={false}
            maxZoom={24}
            minZoom={14}
            onViewportChange={setViewport}
            interactiveLayerIds={interactiveLayerIds}
            onClick={handleClick}
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
                        'icon-rotate': ["get","heading"],
                        'icon-allow-overlap':true,
                        'icon-ignore-placement': true,
                        'icon-rotation-alignment':'map', // viewport
                        'icon-pitch-alignment':'viewport'
                    }}
                />
                {markerPanelInfo.open && (
                   <Layer
                        id='select-point-layer'
                        type='circle'
                        source='clusterSource'
                        filter={['==', 'id', markerPanelInfo.id]}
                        paint={{
                            'circle-radius':20,
                            'circle-color': 'transparent',
                            'circle-stroke-color':'#ff844b',
                            'circle-stroke-width':2
                        }}
                    />
                )}
            </Source>
            <NavigationControl style={{ top:10,right:10}}/>
            <ScaleControl style={{bottom:10,left:10}} />
            {(searchLocation && address) && (
                <>
                <Marker longitude={searchLocation.lng} latitude={searchLocation.lat} offsetLeft={-16} offsetTop={-32}>
                    <img src={iconSearch} alt="marker" />
                </Marker>
                <Marker longitude={searchLocation.lng} latitude={searchLocation.lat} offsetLeft={16} offsetTop={-46}>
                    <div className={classes.addressLabel}>{address}</div>
                </Marker>
                </>
            )}
            {markerPanelInfo.open && (
                <MarkerPanel
                    markerPanelInfo={markerPanelInfo}    
                    setMarkerPanelInfo={setMarkerPanelInfo}
                />
            )}
            {showLoading && <LinearProgress />}
        </ReactMapGL>
    );
}

export default Map;