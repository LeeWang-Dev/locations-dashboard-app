
const express = require('express');
const path = require("path");
const cors = require('cors');

const {Client} = require('pg');

const PORT = normalizePort(process.env.PORT || '8080');

const dbClient = new Client({
  user: 'lee',
  host: 'jp-ground.ciuz5stfwmcj.us-east-1.rds.amazonaws.com',
  database: 'locations_db',
  password: 'Test1234',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  }
});

dbClient.connect();

// http server

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use(express.static(path.join(__dirname, 'react-client/build')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'react-client/build', 'index.html'));
});

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}.`);
});

app.post('/api/clusters', async (req, res) => {

  const { date, timeRange, zoom, bounds, poiLocations, poiRadius } = req.body;

  let t1 = timeRange[0]*1000;
  let t2 = timeRange[1]*1000;

  const tableName = getTableName(date);

  let x1 = bounds[0];
  let y1 = bounds[1];
  let x2 = bounds[2];
  let y2 = bounds[3];
  
  let query = '';

  let categoryCondition = '';
  if(poiLocations.length>0){
    let poiGeoJSON = JSON.stringify({"type":"MultiPoint","coordinates":poiLocations});
    categoryCondition = `AND ST_DWithin(geom::geography, ST_SetSRID(ST_GeomFromGeoJSON('${poiGeoJSON}'),4326)::geography, ${poiRadius})`;
  }

  if(zoom>=18){
    query = `
        SELECT DISTINCT ON (device_id)
            id,
            1 AS point_count,
            geom
        FROM
            ${tableName}
        WHERE
            geom && ST_MakeEnvelope(${x1},${y1},${x2},${y2}, 4326)
            ${categoryCondition}
            AND (timestamp>=${t1} AND timestamp<${t2})
        ORDER BY device_id, timestamp DESC
    `;
  }else{
    query = `
      SELECT
        MIN(id) AS id,
        COUNT(cluster_id) AS point_count,
        ST_CENTROID(ST_UNION(geom)) AS geom
      FROM
        (SELECT DISTINCT ON (device_id)
            id,
            ST_ClusterDBSCAN(geom,${2*Math.PI/(Math.pow(2,zoom-1))},1) OVER () cluster_id,
            geom
         FROM
            ${tableName}
         WHERE
            geom && ST_MakeEnvelope(${x1},${y1},${x2},${y2}, 4326)
            ${categoryCondition}
            AND (timestamp>=${t1} AND timestamp<${t2})
         ORDER BY device_id, timestamp DESC
        ) AS cluster_table
      GROUP BY cluster_id
    `;
  }  
  /*  
    query = `
      SELECT
        MIN(id) AS id,
        COUNT(cluster_id) AS point_count,
        ST_CENTROID(ST_UNION(geom)) AS geom
      FROM
        (SELECT DISTINCT ON (device_id)
            id,
            ST_ClusterKMeans(geom, 12) OVER() AS cluster_id,
            geom
         FROM
            ${tableName}
         WHERE
            geom && ST_MakeEnvelope(${x1},${y1},${x2},${y2}, 4326)
            ${categoryCondition}
            AND (timestamp>=${t1} AND timestamp<${t2})
         ORDER BY device_id, timestamp DESC
         LIMIT 20000
        ) AS cluster_table
      GROUP BY cluster_id
    `;
  */

   // get geojson query
   const geojsonQuery = `
      SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(features.feature)
      ) AS geojson
      FROM (
        SELECT jsonb_build_object(
        'type',       'Feature',
        'geometry',   ST_AsGeoJSON(geom)::jsonb,
        'properties', to_jsonb(inputs) - 'geom'
        ) AS feature
        FROM (${query}) inputs) features;
    `;

   try {
      const result = await dbClient.query(geojsonQuery);
      res.json({
        'status': 'success',
        'result': result.rows[0].geojson
      });
   } catch (err) {
      res.json({
        'status': 'failed',
        'message': err
      });
   }
});

app.post('/api/markers', async (req,res) => {
  const { date, timeRange, zoom, bounds, poiLocations, poiRadius } = req.body;

  let t1 = timeRange[0]*1000;
  let t2 = timeRange[1]*1000;

  const tableName = getTableName(date);

  let x1 = bounds[0];
  let y1 = bounds[1];
  let x2 = bounds[2];
  let y2 = bounds[3];
  
  let query = '';

  let categoryCondition = '';
  if(poiLocations.length>0){
    let poiGeoJSON = JSON.stringify({"type":"MultiPoint","coordinates":poiLocations});
    categoryCondition = `AND ST_DWithin(geom::geography, ST_SetSRID(ST_GeomFromGeoJSON('${poiGeoJSON}'),4326)::geography, ${poiRadius})`;
  }

  query = `
    SELECT DISTINCT ON (device_id)
      id,geom
    FROM
      ${tableName}
    WHERE
      geom && ST_MakeEnvelope(${x1},${y1},${x2},${y2}, 4326)
      ${categoryCondition}
      AND (timestamp>=${t1} AND timestamp<${t2})
    ORDER BY device_id, timestamp DESC
  `;

  // get geojson query
  const geojsonQuery = `
      SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(features.feature)
      ) AS geojson
      FROM (
        SELECT jsonb_build_object(
        'type',       'Feature',
        'geometry',   ST_AsGeoJSON(geom)::jsonb,
        'properties', to_jsonb(inputs) - 'geom'
        ) AS feature
        FROM (${query}) inputs) features;
  `;

   try {
      const result = await dbClient.query(geojsonQuery);
      res.json({
        'status': 'success',
        'result': result.rows[0].geojson
      });
   } catch (err) {
      res.json({
        'status': 'failed',
        'message': err
      });
   } 

});

app.post('/api/counts', async (req, res) => {
  const { date, timeRange, bounds, poiLocations, poiRadius } = req.body;

  let t1 = timeRange[0]*1000;
  let t2 = timeRange[1]*1000;

  const tableName = getTableName(date);

  let x1 = bounds[0];
  let y1 = bounds[1];
  let x2 = bounds[2];
  let y2 = bounds[3];
  
  let query = '';
  let categoryCondition = '';
  if(poiLocations.length>0){
    let poiGeoJSON = JSON.stringify({"type":"MultiPoint","coordinates":poiLocations});
    categoryCondition = `AND ST_DWithin(geom::geography, ST_SetSRID(ST_GeomFromGeoJSON('${poiGeoJSON}'),4326)::geography, ${poiRadius})`;
  }

  query = `
    SELECT
      id_type,
      count(id_type) AS count
    FROM
      (
        SELECT 
          device_id,
          MIN(id_type) AS id_type
        FROM
          ${tableName}
        WHERE
          geom && ST_MakeEnvelope(${x1},${y1},${x2},${y2}, 4326)
          ${categoryCondition}
          AND (timestamp>=${t1} AND timestamp<${t2})
        GROUP BY device_id 
      ) AS group_table 
    GROUP BY id_type
  `;

  try {
      const result = await dbClient.query(query);
      res.json({
        'status': 'success',
        'result': result.rows
      });
  } catch (err) {
      res.json({
        'status': 'failed',
        'message': err
      });
  }
});

app.post('/api/marker/info', async (req, res) => {
  const { date, id } = req.body;
  const tableName = getTableName(date);
  var query = `
     SELECT * FROM ${tableName} WHERE id=${id}
  `;
  try {
      const result = await dbClient.query(query);
      res.json({
        'status': 'success',
        'result': result.rows[0]
      });
  } catch (err) {
      res.json({
        'status': 'failed',
        'message': err
      });
  }
});

app.post('/api/marker/tracking', async (req, res) => {
  const { date, id } = req.body;
  const tableName = getTableName(date);
  var query = `
     SELECT 
      id,
      latitude,
      longitude,
      horizontal_accuracy,
      timestamp,
      geom
     FROM
      ${tableName}
     WHERE
      device_id=(
        SELECT device_id FROM ${tableName} WHERE id=${id}
      )
     ORDER BY timestamp
  `;

  const geojsonQuery = `
      SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(features.feature)
      ) AS geojson
      FROM (
        SELECT jsonb_build_object(
        'type',       'Feature',
        'geometry',   ST_AsGeoJSON(geom)::jsonb,
        'properties', to_jsonb(inputs) - 'geom'
        ) AS feature
        FROM (${query}) inputs) features;
    `;

  try {
      const result = await dbClient.query(geojsonQuery);
      res.json({
        'status': 'success',
        'result': result.rows[0].geojson
      });
  } catch (err) {
      res.json({
        'status': 'failed',
        'message': err
      });
  }
});

app.get('/api/places', async (req, res) => {
  const query = `
    SELECT
      place_id,
      location::json AS location,
      viewport::json AS viewport,
      name,
      address,
      type,
      rating,
      user_ratings_total,
      url,
      image
    FROM
      places
  `;
  try {
    const result = await dbClient.query(query);
    res.json({
      'status': 'success',
      'result': result.rows
    });
  } catch (err) {
    res.json({
      'status': 'failed',
      'message': err
    });
  }
});

app.post('/api/place/add', async (req, res) => {

  const { 
    place_id,
    location,
    viewport,
    name,
    address,
    type,
    rating,
    user_ratings_total,
    url,
    image
  } = req.body;
  
  const query = `
     INSERT INTO 
        places(
          place_id,
          location,
          viewport,
          name,
          address,
          type,
          rating,
          user_ratings_total,
          url,
          image
        )
     VALUES(
        '${place_id}',
        '${JSON.stringify(location)}',
        '${JSON.stringify(viewport)}',
        '${name}',
        '${address}',
        '${type}',
         ${rating},
         ${user_ratings_total},
        '${url}',
        '${image}'
     )   
  `;

  try {
      const result = await dbClient.query(query);
      res.json({
        'status': 'success',
        'message': 'Inserted successfully'
      });
  } catch (err) {
      res.json({
        'status': 'failed',
        'message': err
      });
  }
});

app.post('/api/place/delete', async (req, res) => {
  const { place_id } = req.body;
  const query = `
     DELETE FROM
       places
     WHERE
       place_id='${place_id}'
  `;
  try {
      const result = await dbClient.query(query);
      res.json({
        'status': 'success',
        'message': 'Deleted successfully'
      });
  } catch (err) {
      res.json({
        'status': 'failed',
        'message': err
      });
  }
});

app.post('/api/days', async (req, res) => {
  const { date } = req.body;
  var dateArray = date.split('/');
  var query = `
     SELECT 
       tablename 
     FROM
       pg_catalog.pg_tables
     WHERE 
       schemaname='public'
       AND tablename like 'locations_${dateArray[2]}_${dateArray[0]}_%'
  `;
  try {
      const result = await dbClient.query(query);
      const tables = result.rows;
      const days = tables.map(row=>parseInt(row.tablename.split("_")[3]));
      res.json({
        'status': 'success',
        'result': days
      });
  } catch (err) {
      res.json({
        'status': 'failed',
        'message': err
      });
  }
});

function getTableName(dateStr){
   var dateArray = dateStr.split("/");
   var y = dateArray[2];
   var m = dateArray[0];
   var d = dateArray[1];
   return `locations_${y}_${m}_${d}`;
}

function normalizePort(val) {
   var port = parseInt(val, 10);
 
   if (isNaN(port)) {
     // named pipe
     return val;
   }
 
   if (port >= 0) {
     // port number
     return port;
   }
 
   return false;
 }