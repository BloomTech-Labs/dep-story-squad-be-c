const express = require('express');
const authRequired = require('../middleware/authRequired');
const Child = require('./childModel');
const router = express.Router();
const jwt = require('jsonwebtoken');
const upload = require('../middleware/multer');
const multiUpload = upload.array('image', 5);
const singleUpload = upload.single('image');
const checkToken = require('../middleware/jwtRestricted');

//token creator for our JWT
function createToken(user) {
  const payload = {
    sub: user.id,
    username: user.username,
  };
  const secret = process.env.JWTSECRET;
  const options = {
    expiresIn: '3h',
  };
  return jwt.sign(payload, secret, options);
}

//login endpoint for child
router.post('/:id', authRequired, function (req, res) {
  if (req.body.pin) {
    //retrieve the parent from the db
    Child.findById(req.params.id)
      .then((child) => {
        //check the pin
        console.log(child);
        if (child.pin === req.body.pin) {
          //if the pin is correct make a token and get the dashboard data
          const token = createToken(child);
          res.status(200).json({
            token: token,
            child: {
              id: child.id,
              name: child.name,
              username: child.username,
              current_mission: child.current_mission,
              avatar_url: child.avatar_url,
            },
          });
        } else {
          res.status(400).json({
            message: 'incorrect pin',
          });
        }
      })
      .catch((err) => {
        res.status(400).json({
          message: 'there is no child with that ID',
          error: err,
        });
      });
  } else {
    res.status(400).json({
      message: 'please include a pin',
    });
  }
});

//get current mission endpoint
//check the token
router.get('/:id/mission', checkToken, function (req, res) {
  if (req.decodedToken.sub == req.params.id) {
    Child.findById(req.params.id)
      .then((child) => {
        Child.getCurrentMission(child.current_mission)
          .then((mission) => {
            res.status(200).json({
              ...mission,
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: 'error retrieving mission',
              error: err,
            });
          });
      })
      .catch((err) => {
        res.status(500).json({
          message: 'error retrieving child data',
          error: err,
        });
      });
  } else {
    res.status(400).json({
      message: 'The ID provided is not associated with the token provided',
    });
  }
});

//post writting submission
//use the multer function to send to the aws bucket and get the url's back
//send each of those url's to the ds endpoint to get scores and flags back
//add those scores and flags to the urls to make each post object
//add each of those post objects to the db

router.post('/:id/mission/write', checkToken, async function (req, res) {
  console.log(req, 'bodylog')
  let child = await Child.findById(req.params.id);
  //we run the images through this multer function
  //we send our files to an AWS bucket
  //we get back an array of urls for the uploaded files
  multiUpload(req, res, async function (err) {
    //console.log('files', req.files);
    if (err) {
      return res.status(500).json({
        status: 'fail',
        message: 'Error: No File Selected',
      });
    } else {
      if (req.files[0] === undefined) {
        return res.json({ message: 'file undefined' });
      } else {
        const fileArray = req.files;
        let fileLocation = '';
        const images = [];
        for (let i = 0; i < fileArray.length; i++) {
          fileLocation = fileArray[i].location;
          images.push(fileLocation);
        }
        //this is where the axios calls to ds would be made
        //with the url's in the body
        //we get the scores and flags back
        //and construct the submission objects to save to the DB
        let submissions = [];
        images.map((url) => {
          let result = mockDSCall(url);
          let submissionObject = {
            file_path: url,
            ...result,
            mission_id: child.current_mission,
            child_id: child.id,
          };
          submissions.push(submissionObject);
        });
        //console.log(submissions);
        //so now we should have an array of objects ready to put in the DB
        await submissions.map((obj) => {
          Child.addWriting(obj)
            .then((response) => {
              //console.log(response);
            })
            .catch((err) => {
              res.json({
                error: err,
              });
            });
        });
        //if an error wasn't thrown that means that we've successfully submitted!
        res.status(200).json({
          message: 'we got your submission!',
        });
      }
    }
  });
});

router.post('/:id/mission/draw', checkToken, async function (req, res) {
  let child = await Child.findById(req.params.id);

  singleUpload(req, res, async function (err) {
    //console.log('files', req.files);
    if (err) {
      return res.status(500).json({
        status: 'fail',
        message: 'Error: No File Selected',
      });
    } else {
      if (req.file === undefined) {
        return res.json({ message: 'file undefined' });
      } else {
        let result = mockDSCall(req.file.location);
        let submissionObject = {
          file_path: req.file.location,
          ...result,
          mission_id: child.current_mission,
          child_id: child.id,
        };
        Child.addWriting(submissionObject)
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            res.json({ error: err });
          });
        res.status(200).json({ message: 'we got your submission!' });
      }
    }
  });
});

//get past submissions
router.get(
  '/:id/archive',
  /*checkToken,*/ function (req, res) {
    Child.getArchive(req.params.id)
      .then((submissions) => {
        res.json({ submissions });
      })
      .catch((err) => {
        res.json({ err });
      });
  }
);

const mockDSCall = function () {
  return {
    score: Math.trunc(Math.random() * 100),
    //flagged: false
  };
};

module.exports = router;
