const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const bodyParser = require('body-parser');
const multer = require('multer'); // "^1.3.0"
const multerS3 = require('multer-s3'); //"^2.7.0"


aws.config.update({
    secretAccessKey: 'secret key',
    accessKeyId: 'key',
    region: 'us-west-2'
});

const s3 = new aws.S3();

router.use(bodyParser.json());

const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: 'YOUR_BUCKET_NAME',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, Date.now().toString()); //use Date.now() for unique file keys
        }
    })
});

router.post('upload')

module.exports = router;
/*
const upload = require('./multer');
const singleUpload = upload.single('image');

router.get('/', function(req,res){
    return res.json({'message': 'test route working'});
})
router.post('/image-upload-test', function(req, res){
    singleUpload(req, res, function(err){
        if(req.file === undefined){
            return res.json({'message': 'file undefined'})
        }
        return res.json({'imageUrl': req.file.location})
    });
});
*/



