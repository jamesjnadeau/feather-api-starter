/*
This file is run on a fresh install after it's .env file has been configured.
it performs the following:
* Checks if the AWS Keys are all set properly
* Checks if the AWS_STORAGE_BUCKET exists
* Checks if the AWS_SITE_BUCKET if NODE_ENV is produciton
* Creates any of the above if they don't exist and initializes them.

* Create tests that test the uploading to these configured buckets

User Policy Example:
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "s3:ListAllMyBuckets",
            "Resource": "arn:aws:s3:::*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::REPLACE_WITH_BUCKET_NAME"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:*"
            ],
            "Resource": "arn:aws:s3:::REPLACE_WITH_BUCKET_NAME/*"
        }
    ]
}

Bucket Policy Example
{
  "Version":"2012-10-17",
  "Statement":[
    {
      "Sid":"AddPerm",
      "Effect":"Allow",
      "Principal": "*",
      "Action":["s3:GetObject"],
      "Resource":["arn:aws:s3:::examplebucket/*"]
    }
  ]
}


StorageBucket CORS:
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>PUT</AllowedMethod>
        <AllowedMethod>POST</AllowedMethod>
        <AllowedMethod>OPTIONS</AllowedMethod>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
</CORSConfiguration>



see:
http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-examples.html
https://github.com/afloyd/s3-site-sync/blob/master/lib/sync.js
*/
//Load .env file
require('dotenv').load();
var async = require('async');

AWS = require('_local/utils/aws');
var s3 = new AWS.S3();
var AWS_STORAGE_BUCKET= process.env.AWS_STORAGE_BUCKET
var AWS_SITE_BUCKET = process.env.AWS_SITE_BUCKET;
var foundAWS_STORAGE_BUCKET = false;
var foundAWS_SITE_BUCKET = false;
var storageBucket = new AWS.S3({params: {Bucket: AWS_STORAGE_BUCKET}});
var siteBucket = new AWS.S3({params: {Bucket: AWS_SITE_BUCKET}});
async.waterfall([
  function checkForBuckets(done) {
    //list all buckets and look for the ones specified in proces.env
    s3.listBuckets(function(err, data) {
      if (err) {
        done(err);
      } else {
        for (var index in data.Buckets) {
          var bucket = data.Buckets[index];
          if(bucket.Name === AWS_STORAGE_BUCKET ) {
            foundAWS_STORAGE_BUCKET = true;
          }
          if(bucket.Name === AWS_SITE_BUCKET ) {
            foundAWS_SITE_BUCKET = true;
          }
          //console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
        }
        done();
      }
    });
  },
  function createAWS_STORAGE_BUCKETifMissing(done) {

    if(!foundAWS_STORAGE_BUCKET) {
      storageBucket.createBucket(function(err) {
        if(err) {
          done(err);
        }
        console.log('Creating Bucket:', AWS_STORAGE_BUCKET)
        done(null, storageBucket);
      });
    } else {
      console.log('Bucket Exists:', AWS_STORAGE_BUCKET);
      //ensure bucket has proper cors setup for put via url
      done(null);
    }
  },
  /*function enableCORSforUploads(storageBucket, done) {
    storageBucket.putBucketCors({
      CORSConfiguration: {
        CORSRules: [{
          AllowedOrigins: ['*'],
          AllowedHeaders: ['*'],
          AllowedMethods: ['GET', 'PUT', 'POST'],
          MaxAgeSeconds: 30000
        }]
      }
    }, function(err) {
      done(err);
    });
  }*/
  function createAWS_SITE_BUCKETifMissing(done) {

    if(!foundAWS_SITE_BUCKET) {
      storageBucket.createBucket(function(err) {
        if(err) {
          done(err);
        }
        console.log('Creating Bucket:', AWS_SITE_BUCKET)
        done(null, storageBucket);
      });
    } else {
      console.log('Bucket Exists:', AWS_SITE_BUCKET);
      done(null);
    }
  },
  function configAWS_SITE_BUCKETforWebsite(done) {
    params = {
      WebsiteConfiguration: { /* required */
        ErrorDocument: {
          Key: 'error.html' /* required */
        },
        IndexDocument: {
          Suffix: 'index.html' /* required */
        },
      },
    };
    siteBucket.putBucketWebsite(params, function(err, data) {

  },
], function(err, result) {
  if(err) {
    console.error(err);
  }
  console.log('Init Done.');
})
