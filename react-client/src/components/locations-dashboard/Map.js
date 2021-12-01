
import React, { useState, useEffect, useRef } from 'react';

import { makeStyles } from '@mui/styles';
import LinearProgress from '@mui/material/LinearProgress';

import ReactMapGL, { 
           Source,
           Layer,
           Marker,
           ScaleControl,
           NavigationControl,
           WebMercatorViewport,
           FlyToInterpolator
       } from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from "mapbox-gl";

import { MAPBOX_ACCESS_TOKEN, DEFAULT_VIEWPORT } from "../../utils/settings.js";
import { dateFormat } from "../../utils/util.js";
import { getMarkers } from "../../services/marker.js";
//import { getClusters } from "../../services/cluster.js";
//import { getCounts } from "../../services/counts.js";

import iconMarker from "../../assets/images/user-icon.png";
import iconSearch from "../../assets/images/home-icon.png";

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
       searchPlace,
       filter,
       renderMode,
       setCounts
    } = props;

    const mapRef = useRef(null);
    const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);
    const [interactiveLayerIds, setInteractiveLayerIds] = useState([]);
    const [dataSource, setDataSource] = useState({
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
                    date: dateFormat(filter.date),
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
        
        return () => {
            if(map.hasImage('marker-icon')){
                map.removeImage('marker-icon');
            }
        }

    }, []);

    useEffect(()=>{
        if(searchPlace){
            const vp = new WebMercatorViewport(viewport);
            const { zoom } = vp.fitBounds( //const {longitude, latitude, zoom}
                [ 
                    [searchPlace.viewport[0], searchPlace.viewport[1]],
                    [searchPlace.viewport[2], searchPlace.viewport[3]]
                ],
                { padding: 40 }
            );
            setViewport({
                ...viewport,
                longitude:searchPlace.location[0],
                latitude:searchPlace.location[1],
                zoom,
                transitionInterpolator: new FlyToInterpolator(),
                transitionDuration: 1000
            });
        }
    }, [searchPlace]);

    useEffect(()=>{

       const map = mapRef.current.getMap();

       map.on('moveend', mapDataCallback);

       mapDataCallback();

       return () => map.off('moveend', mapDataCallback);

    }, [filter]);

    useEffect(()=>{

        let newCounts = [];
        newCounts['TOTAL'] = dataSource.features.length;
        dataSource.features.forEach(feature=>{
            if(newCounts[feature.properties.id_type]){
                newCounts[feature.properties.id_type] += 1; 
            }else{
                newCounts[feature.properties.id_type] = 1;
            }
        });
        setCounts(newCounts);
    }, [dataSource]);

    useEffect(()=>{
        if(dataSource.features.length>0){
            if(renderMode === 'cluster'){
                setInteractiveLayerIds(['cluster-layer','unclustered-point-layer']);
            }else{
                setInteractiveLayerIds(['unclustered-point-layer']);
            }
        }
    }, [renderMode, dataSource]);

    const mapDataCallback = () => {
        const map = mapRef.current.getMap();
        if(timeout){
            clearTimeout(timeout);
        }
        timeout = setTimeout(async () => {
           setShowLoading(true);
           let poiLocations = [];
           if(filter.category !== 'All Categories'){
                const poiFeatures = map.queryRenderedFeatures({ layers: ['poi-label'] });
                let categoryFeatures = poiFeatures.filter(feature=>feature.properties["maki"] === filter.category.toLowerCase());
                categoryFeatures.forEach(feature=>{
                   poiLocations.push(feature.geometry.coordinates);
                });
                if(poiLocations.length === 0){
                    setDataSource({
                        type: 'FeatureCollection',
                        features:[]
                    });
                    setCounts([]);
                    setShowLoading(false);
                    return;
                }
           }
           
           let newDataSource = {
                type: 'FeatureCollection',
                features:[]
           };
           let res = await getMarkers({
                date: dateFormat(filter.date),
                timeRange: filter.timeRange,
                zoom: map.getZoom(),
                bounds: map.getBounds().toArray().flat(),
                poiLocations: poiLocations,
                poiRadius: filter.category_distance
            });

            if(res.status === 'success'){
                if(res.result && res.result.features){
                    newDataSource = res.result;
                }
            }
            setDataSource(newDataSource);
           
            setShowLoading(false);

        }, 500);
    }

    return (
        <ReactMapGL className={classes.mapDiv}
            {...viewport}    
            width="100%"
            height="100%"
            mapStyle="mapbox://styles/mapbox/streets-v11"
            //mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
            mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
            ref={mapRef}
            attributionControl={false}
            maxZoom={24}
            minZoom={16}
            onViewportChange={setViewport}
            interactiveLayerIds={interactiveLayerIds}
            onClick={handleClick}
        >
            {renderMode==='cluster' && (
                <Source
                    id="clusterSource"
                    type="geojson"
                    data={dataSource}
                    cluster={true}
                    clusterMaxZoom={18}
                    clusterRadius={50}
                >
                    <Layer
                        id='cluster-layer'
                        type='circle'
                        source='clusterSource'
                        filter={['has', 'point_count']}
                        //filter={['>', 'point_count', 1]}
                        paint={{
                          'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
                          'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
                        }}
                    />
                    <Layer 
                        id='cluster-count-layer'
                        type='symbol'
                        source='clusterSource'
                        filter={['has', 'point_count']}
                        //filter={['>', 'point_count', 1]}
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
                        filter={['!', ['has', 'point_count']]}
                        //filter={['==', 'point_count', 1]}
                        layout={{
                           'icon-image': 'marker-icon',
                           'icon-size': 0.5,
                           'icon-offset':[0, -32],
                           //'icon-rotate': ["get","heading"],
                           'icon-allow-overlap':true,
                           'icon-ignore-placement': true,
                           //'icon-rotation-alignment':'map', // viewport
                           //'icon-pitch-alignment':'viewport'
                        }}
                    />
                    {markerPanelInfo.open && (
                        <Layer
                            id='select-point-layer'
                            type='symbol'
                            source='clusterSource'
                            filter={['==', 'id', markerPanelInfo.id]}
                            layout={{
                                'icon-image': 'marker-icon',
                                'icon-size': 0.7,
                                'icon-offset':[0, -32],
                                'icon-allow-overlap':true,
                                'icon-ignore-placement': true,
                             }}
                        />
                    )}
                </Source>
            )}
            {renderMode==='heatmap' && (
                <Source
                    id="heatmapSource"
                    type="geojson"
                    data={dataSource}
                >
                    <Layer 
                       id='heatmap-layer'
                       type='heatmap'
                       source='heatmapSource'
                       maxzoom={19}
                       paint={{
                         'heatmap-weight':[
                            'interpolate',['linear'], ['zoom'],
                            12,
                            0.2,
                            19,
                            1
                          ],
                         'heatmap-intensity': [
                            'interpolate',['linear'], ['zoom'],
                            12,
                            5,
                            19,
                            1
                          ],
                          'heatmap-color': [
                            'interpolate',['linear'],['heatmap-density'],
                            0,
                            'rgba(33,102,172,0)',
                            0.2,
                            'rgb(103,169,207)',
                            0.4,
                            'rgb(209,229,240)',
                            0.6,
                            'rgb(166,189,219)',
                            0.8,
                            'rgb(103,169,207)',
                            1,
                            'rgb(28,144,153)'
                          ],
                         'heatmap-radius': [
                            'interpolate',['linear'],['zoom'],
                            12,
                            16,
                            19,
                            40
                         ],
                         'heatmap-opacity': [
                            'interpolate',['linear'],['zoom'],
                            12,
                            0.9,
                            19,
                            0.5
                         ]
                       }}
                    />
                    <Layer
                        id='unclustered-point-layer'
                        type='symbol'
                        source='heatmapSource'
                        minzoom={18}
                        layout={{
                            'icon-image': 'marker-icon',
                            'icon-size': 0.5,
                            'icon-offset':[0, -32],
                            //'icon-rotate': ["get","heading"],
                            'icon-allow-overlap':true,
                            'icon-ignore-placement': true,
                            //'icon-rotation-alignment':'map', // viewport
                            //'icon-pitch-alignment':'viewport'
                        }}
                    />
                    {markerPanelInfo.open && (
                        <Layer
                            id='select-point-layer'
                            type='symbol'
                            source='heatmapSource'
                            filter={['==', 'id', markerPanelInfo.id]}
                            layout={{
                                'icon-image': 'marker-icon',
                                'icon-size': 0.7,
                                'icon-offset':[0, -32],
                                'icon-allow-overlap':true,
                                'icon-ignore-placement': true,
                            }}
                        />
                    )}
                </Source>
            )}
            <NavigationControl style={{ top:70,right:10}}/>
            <ScaleControl style={{bottom:10,left:10}} />
            {searchPlace && (
                <>
                <Marker longitude={searchPlace.location[0]} latitude={searchPlace.location[1]} offsetLeft={-16} offsetTop={-44}>
                    <img src={iconSearch} alt="marker" />
                </Marker>
                <Marker longitude={searchPlace.location[0]} latitude={searchPlace.location[1]} offsetLeft={20} offsetTop={-56}>
                    <div className={classes.addressLabel}>{searchPlace.address}</div>
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