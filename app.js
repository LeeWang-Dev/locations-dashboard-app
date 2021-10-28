
const express = require('express');
const path = require("path");
const cors = require('cors');

const {Client} = require('pg');

const PORT = normalizePort(process.env.PORT || '8080');

const dbClient = new Client({
  user: 'leewang',
  host: 'lee-instance.ciuz5stfwmcj.us-east-1.rds.amazonaws.com',
  database: 'locations_db',
  password: 'testing1234',
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

  let t1 = timeRange[0];
  let t2 = timeRange[1];

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

  if(zoom>=16){
    query = `
        SELECT DISTINCT ON (advertiser_id)
            id,
            heading,
            1 AS point_count,
            geom
        FROM
            ${tableName}
        WHERE
            geom && ST_MakeEnvelope(${x1},${y1},${x2},${y2}, 4326)
            ${categoryCondition}
            AND (location_at>=${t1} AND location_at<${t2})
        ORDER BY advertiser_id, location_at DESC
    `;
  }else if(zoom<16 && zoom>=14){
    query = `
      SELECT
        MIN(id) AS id,
        MIN(heading) AS heading,
        COUNT(cluster_id) AS point_count,
        ST_CENTROID(ST_UNION(geom)) AS geom
      FROM
        (SELECT DISTINCT ON (advertiser_id)
            id,
            ST_ClusterDBSCAN(geom,${2*Math.PI/(Math.pow(2,zoom-1))},1) OVER () cluster_id,
            heading,
            geom
         FROM
            ${tableName}
         WHERE
            geom && ST_MakeEnvelope(${x1},${y1},${x2},${y2}, 4326)
            ${categoryCondition}
            AND (location_at>=${t1} AND location_at<${t2})
         ORDER BY advertiser_id, location_at DESC
        ) AS cluster_table
      GROUP BY cluster_id
    `;
  }else if(zoom<14 && zoom>=12){
    query = `
      SELECT
        MIN(id) AS id,
        MIN(heading) AS heading,
        COUNT(cluster_id) AS point_count,
        ST_CENTROID(ST_UNION(geom)) AS geom
      FROM
        (SELECT DISTINCT ON (advertiser_id)
            id,
            ST_ClusterKMeans(geom, 12) OVER() AS cluster_id,
            heading,
            geom
         FROM
            ${tableName}
         WHERE
            geom && ST_MakeEnvelope(${x1},${y1},${x2},${y2}, 4326)
            ${categoryCondition}
            AND (location_at>=${t1} AND location_at<${t2})
         ORDER BY advertiser_id, location_at DESC
        ) AS cluster_table
      GROUP BY cluster_id
    `;
    /*
    query = `
      SELECT
        count(*) AS point_count,
        ST_Centroid(ST_MakeEnvelope(${x1},${y1},${x2},${y2}, 4326)) AS geom
      FROM
      ( SELECT
          advertiser_id          
        FROM
          ${tableName}
        WHERE
          geom && ST_MakeEnvelope(${x1},${y1},${x2},${y2}, 4326)
          ${categoryCondition}
          AND (location_at>=${t1} AND location_at<${t2})
        GROUP BY advertiser_id
      ) AS group_table
    `;
    */
  }
  
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

  let t1 = timeRange[0];
  let t2 = timeRange[1];

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
      platform,
      count(platform) AS count
    FROM
      (
        SELECT 
          advertiser_id,
          MIN(platform) AS platform
        FROM
          ${tableName}
        WHERE
          geom && ST_MakeEnvelope(${x1},${y1},${x2},${y2}, 4326)
          ${categoryCondition}
          AND (location_at>=${t1} AND location_at<${t2})
        GROUP BY advertiser_id 
      ) AS group_table 
    GROUP BY platform
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
      id, location_at,
      latitude, longitude, geom,
      altitude, heading,
      speed, horizontal_accuracy, vertical_accuracy
     FROM
      ${tableName}
     WHERE
      advertiser_id=(
        SELECT advertiser_id FROM ${tableName} WHERE id=${id}
      )
     ORDER BY location_at
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