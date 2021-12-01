const express = require('express');
const path = require("path");
const cors = require('cors');

const {Client} = require('pg');

const PORT = normalizePort(process.env.PORT || '8000');

const app = express();

// postgresql db config
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

// AWS config
const AWS = require('aws-sdk');
const accessKeyId = 'AKIATPAJQC2YHRZL7DNS';
const secretAccessKey = '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';
const region = 'us-east-1';
AWS.config.update({
    accessKeyId: accessKeyId, 
    secretAccessKey: secretAccessKey, 
    region: region
});
const s3 = new AWS.S3();

// date config
const yy = '2021', mm = '09', dd = '01';

// table name for creating
const tableName = `locations_${yy}_${mm}_${dd}`;

// s3 bucket directory
const bucketParams = {
    Bucket : 'quadrant-csv2',
    Delimiter: '/',
    Prefix: `year=${yy}/month=${mm}/day=${dd}/`
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

build_db();

async function build_db(){
   
  let res;
   // Check table
   
   res = await checkExistTable();
   if(res.status === 'success'){
     if(res.result.exists){
        console.log(`${tableName} already exsist.`);
        return;
     }
   }else{
     console.log(res.message);
     return;
   }
   
   // get csv file keys from s3 bucket
   console.log('Get csv files from S3 bucket...');
   res = await getKeysFromAWSBucket();
   if(res.status === 'success'){
     if(res.result.length>0){
       // Create new table
       
       console.log(`Creating new table ${tableName}`);
       var createTableResponse = await createTable();
       if(createTableResponse.status === 'success'){
         console.log(createTableResponse.result);
       }else{
         console.log(createTableResponse.message);
         return;
       }
       
       const fileKeys = res.result;
       // import csv data to database
       console.log('Start import csv...');
       for(let i=0;i<fileKeys.length;i++){
          var fileKey = fileKeys[i];
          console.log(fileKey);
          res = await importCSV(fileKey);
          if(res.status === 'success'){
            console.log(res.result);
          }else{
            console.log(res.message);
          }
       }
       console.log('Finished import csv files.');
     }else{
       console.log('No exsist any csv file.');
       return;
     }
   }else{
     console.log(res.message);
     return;
   }
   
   // Delete dateformat column
   console.log('Delete dateformat column...');
   res = await deleteColumn('dateformat');
   if(res.status === 'success'){
      console.log(res.result);
   }else{
      console.log(res.message);
   }

   // Update geom field for point geometry
   console.log('Update geom field...');
   res = await updateGeometry();
   if(res.status === 'success'){
      console.log(res.result);
   }else{
      console.log(res.message);
   }

   // Create Indexes
   // Create geom field index
   console.log('Create geom index...');
   res = await createIndex('geom','gist');
   if(res.status === 'success'){
     console.log(res.result);
   }else{
     console.log(res.message);
   }

   // Create device_id field index
   console.log('Create device_id index...');
   res = await createIndex('device_id','btree');
   if(res.status === 'success'){
     console.log(res.result);
   }else{
     console.log(res.message);
   }

   // Create id_type field index
   console.log('Create id_type index...');
   res = await createIndex('id_type','btree');
   if(res.status === 'success'){
     console.log(res.result);
   }else{
     console.log(res.message);
   }
   
   // Create timestamp field index
   console.log('Create timestamp index...');
   res = await createIndex('timestamp','btree');
   if(res.status === 'success'){
     console.log(res.result);
   }else{
     console.log(res.message);
   }
   
   console.log(`${tableName} is completed.`);
}

function checkExistTable(){
   return new Promise(async (resolve) => {
      const query = `
         SELECT EXISTS(
            SELECT
              *
            FROM
              information_schema.tables
            WHERE
              table_schema = 'public'
              AND
              table_name = '${tableName}'  
         )
      `;
      try {
        const result = await dbClient.query(query);
          resolve({
            'status': 'success',
            'result': result.rows[0]
          });
      } catch (err) {
          resolve({
            'status': 'failed',
            'message': err
          });
      }
   });
}

function createTable(){
  return new Promise(async (resolve) => {
    
    const query = `
      CREATE TABLE public.${tableName}
      (
          id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
          device_id character varying(50) COLLATE pg_catalog."default",
          id_type character varying(10) COLLATE pg_catalog."default",
          longitude double precision,
          latitude double precision,
          horizontal_accuracy double precision,
          timestamp bigint,
          dateformat character varying(20) COLLATE pg_catalog."default",
          geom geometry,
          CONSTRAINT "${tableName}_pkey" PRIMARY KEY (id)
      )
    `;

    try {
        await dbClient.query(query);
        resolve({
          'status': 'success',
          'result': `Created ${tableName} successfully.`
        });
    } catch (err) {
        resolve({
          'status': 'failed',
          'message': err
        });
    }
  });
}

function getKeysFromAWSBucket() {
    return new Promise((resolve) => {
        s3.listObjects(bucketParams, function(err, data) {
            if (err) {
              resolve({
                  status:'failed',
                  message:err
              });
            } else {
              var result = [];
              data.Contents.forEach(item => {
                var extension = item.Key.split('.').pop();  
                if(extension === 'csv'){
                  result.push(item.Key)
                }
              });
              resolve({
                  status:'success',
                  result:result
              });
            }
        });
    });
}

function importCSV(fileKey){
   return new Promise(async (resolve) => {
      const query = `
        SELECT aws_s3.table_import_from_s3 (
          'public.${tableName}',
          'device_id,
           id_type,
           longitude,
           latitude,
           horizontal_accuracy,
           timestamp,
           dateformat',
          '(FORMAT csv, HEADER false, DELIMITER '','')',
          '${bucketParams.Bucket}',
          '${fileKey}',
          '${region}',
          '${accessKeyId}',
          '${secretAccessKey}'
        )
      `;

      try {
          await dbClient.query(query);
          resolve({
            'status': 'success',
            'result': `Imported ${fileKey} successfully.`
          });
      } catch (err) {
          resolve({
            'status': 'failed',
            'message': err
          });
      }
   });
}

function deleteColumn(column_name){
  return new Promise(async (resolve) => {
    const query = `
      ALTER TABLE ${tableName}
      DROP COLUMN IF EXISTS ${column_name}
    `;
    try {
        await dbClient.query(query);
        resolve({
          'status': 'success',
          'result': `Deleted ${column_name} column successfully.`
        });
    } catch (err) {
        resolve({
          'status': 'failed',
          'message': err
        });
    }
  });
}

function updateGeometry(){
  return new Promise(async (resolve) => {
    const query = `
      UPDATE
        ${tableName}
      SET
        geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
    `;

    try {
        await dbClient.query(query);
        resolve({
          'status': 'success',
          'result': `Updated point geometry field successfully.`
        });
    } catch (err) {
        resolve({
          'status': 'failed',
          'message': err
        });
    }
  });
}

function createIndex(field,indexType){
  return new Promise(async (resolve) => {
    const query = `CREATE INDEX ${tableName}_${field}_idx ON ${tableName} USING ${indexType}(${field})`;
    try {
        await dbClient.query(query);
        resolve({
          'status': 'success',
          'result': `Created ${field} index successfully.`
        });
    } catch (err) {
        resolve({
          'status': 'failed',
          'message': err
        });
    }
  });
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