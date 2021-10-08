
const express = require('express');
const path = require("path");
const cors = require('cors');

const {Client} = require('pg');

const PORT = normalizePort(process.env.PORT || '8080');

const dbClient = new Client({
  user: 'sluaxjbbtvzxji',
  host: 'ec2-35-171-171-27.compute-1.amazonaws.com',
  database: 'd3ifv17g3mgqbn',
  password: '01758eddd110dcd9ca82365e68be500f423a77b34f420057cd3732c73c01b95d',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  }
});

dbClient.connect();

// http server

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, 'react-client/build')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'react-client/build', 'index.html'));
});

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}.`);
});

app.get('/api/clusters', async (req, res) => {
  
  let zoom = parseInt(req.query.zoom);

  let x1 = parseFloat(req.query.bounds[0]);
  let y1 = parseFloat(req.query.bounds[1]);
  let x2 = parseFloat(req.query.bounds[2]);
  let y2 = parseFloat(req.query.bounds[3]);
  
  // get rows with latest date

  const clusterQuery = `
      SELECT
        cluster_id,
        COUNT(cluster_id) AS point_count,
        ST_CENTROID(ST_UNION(geom)) AS geom
      FROM
        (SELECT
           ST_ClusterDBSCAN(geom, ${2*Math.PI/Math.pow(2,zoom-1)}, 1) OVER () cluster_id,
           geom
         FROM
          locations
         WHERE
          geom && ST_MakeEnvelope(${x1},${y1},${x2},${y2}, 4326)
        )
        cluster_table
      GROUP BY cluster_id
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
        FROM (${clusterQuery}) inputs) features;
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