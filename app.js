
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

  const { dateString, timeRange, zoom, bounds } = req.body;

  let d = dateString.split("/");

  let t0 = Date.UTC(d[2],parseInt(d[0])-1,d[1])/1000
  let t1 = t0 + timeRange[0]*60*60;
  let t2 = t0 + timeRange[1]*60*60;

  const tableName = getTableName(dateString);

  let x1 = bounds[0];
  let y1 = bounds[1];
  let x2 = bounds[2];
  let y2 = bounds[3];
  
  let query = '';

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
            AND (location_at>=${t1} AND location_at<${t2})
        ORDER BY advertiser_id, location_at DESC
        )  cluster_table
      GROUP BY cluster_id
    `;
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
  const { dateString, timeRange, bounds } = req.body;

  let d = dateString.split("/");

  let t0 = Date.UTC(d[2],parseInt(d[0])-1,d[1])/1000
  let t1 = t0 + timeRange[0]*60*60;
  let t2 = t0 + timeRange[1]*60*60;

  const tableName = getTableName(dateString);

  let x1 = bounds[0];
  let y1 = bounds[1];
  let x2 = bounds[2];
  let y2 = bounds[3];
  
  let query = `
     SELECT 
        platform,
        count(platform) AS count
     FROM
       ${tableName}
     WHERE
        geom && ST_MakeEnvelope(${x1},${y1},${x2},${y2}, 4326)
        AND (location_at>=${t1} AND location_at<${t2})
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
  const { dateString, id } = req.body;
  const tableName = getTableName(dateString);
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

app.post('/api/days', async (req, res) => {
  const { dateString } = req.body;
  var dateArray = dateString.split('/');
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