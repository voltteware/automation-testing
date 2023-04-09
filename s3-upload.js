'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config();
const BUCKET_NAME = (process.env.BASE_URL.includes('dev') ? 'stockaid-dev' : 'stockaid-preprod');

function uploadS3(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, function (err, data) {
      if (err) return reject(err); // Something went wrong!
      const s3bucket = new AWS.S3({
        httpOptions: {
          timeout: 900000 // 15 minutes
        },
        params: { Bucket: BUCKET_NAME, ACL: 'public-read' },
        credentials: new AWS.Credentials(process.env.AWS_S3_ACCESSKEY, process.env.AWS_S3_SECRETKEY),
      });
  
      const params = {
        Key: 'automation-testing-report.html',
        Body: data
      };

      s3bucket.upload(params, function (err, data) {
        if (err) {
         return reject(err);
        }

        return resolve(data);
      });
    });
  })
}

module.exports = {uploadS3};