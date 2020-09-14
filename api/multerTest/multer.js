const aws = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');


aws.config.update({
    secretAccessKey: 'secret key',
    accessKeyId: 'key',
    region: 'us-west-2'
})

const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'storysquad-teamc-ugc',
        acl: 'public-read',
        metadata: function(req, file, cb){
            cb(null, {fieldName: 'TESTING_META_DATA'})
            console.log(file)
        },
        key: function(req, file, cb){
            console.log(file)
            cb(null, Date.now().toString())
        }
    })
})

module.exports = upload;


