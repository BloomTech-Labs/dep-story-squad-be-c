const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const singleUpload = upload.single('image');
const multiUpload = upload.array('images', 5);

router.get('/', function(req,res){
    return res.json({'message': 'test route working'});
})

router.post('/single-image-upload-test', function(req, res){
    singleUpload(req, res, function(err){
        if(req.file === undefined){
            return res.json({'message': 'file undefined'})
        }
        return res.json({'imageUrl': req.file.location})
    });
});

router.post('/multi-image-upload-test', async (req, res)=>{
    multiUpload(req, res, function(err){
        console.log('files', req.files);
        if(err){
            return res.status(500).json({
                status: 'fail',
                message: 'Error: No File Selected'
            });
        }else{
            if(req.files === undefined){
                return res.json({'message': 'file undefined'})
            }
            else{
                const fileArray = req.files
                let fileLocation = '';
                const images = [];
                for(let i = 0; i < fileArray.length; i ++){
                    fileLocation = fileArray[i].location;
                    images.push(fileLocation);
                };
                //this is where an axios call to ds would be made
                res.json({
                    fileArray
                })

            }
        }
    });
});

module.exports = router;
