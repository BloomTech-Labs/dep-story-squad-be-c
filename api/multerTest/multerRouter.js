const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/multer');
const singleUpload = upload.single('image');
const multiUpload = upload.array('images', 5);

router.get('/', function (req, res) {
  return res.json({ message: 'test route working' });
});

//Example of what the illustration submission endpoint could look like
router.post('/single-image-upload-test', function (req, res) {
  singleUpload(req, res, function (err) {
    if (req.file === undefined) {
      return res.json({ message: 'file undefined', error: err });
    }
    return res.json({ imageUrl: req.file.location });
  });
});

//example of what the writing submission could look like
router.post('/multi-image-upload-test', async (req, res) => {
  multiUpload(req, res, function (err) {
    console.log('response from aws', req.files);
    if (err) {
      return res.status(500).json({
        error: err,
        status: 'fail',
        message: 'Error: No File Selected',
      });
    } else {
      if (req.files === undefined || req.files.length < 1) {
        return res.status(500).json({ message: 'file undefined' });
      } else {
        const fileArray = req.files;
        let fileLocation = '';
        const images = [];
        for (let i = 0; i < fileArray.length; i++) {
          fileLocation = fileArray[i].location;
          images.push(fileLocation);
        }
        //this is where an axios call to ds would be made
        res.json({
          images,
        });
      }
    }
  });
});

module.exports = router;
