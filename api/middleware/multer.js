const aws = require('aws-sdk'); //"^2.2.41"
const multer = require('multer'); // "^1.3.0"
const multerS3 = require('multer-s3'); //"^2.7.0"

aws.config.update({
  secretAccessKey: process.env.SECRETKEY,
  accessKeyId: process.env.ACCESSKEYID,
  region: 'us-east-1',
});

const s3 = new aws.S3();

const uploader = (buffer, name, type) => {
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: process.env.S3_BUCKET,
    ContentType: type.mime,
    Key: `${name}.${type.ext}`,
  };
  return s3.upload(params).promise();
};

const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: 'storysquad-teamc-bucket',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(
        null,
        'user-content/' + Date.now().toString() + `${file.originalname}`
      );
    },
  }),
});

module.exports = { upload, uploader };
