const express = require('express');
//const authRequired = require('../middleware/authRequired');
const Child = require('./childModel');
const router = express.Router();
const jwt = require('jsonwebtoken');
//const checkProgress = require('../middleware/checkProgress');
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

router.get('/', function (req, res) {
  Child.findAll()
    .then((children) => {
      console.log(children);
      res.status(200).json(children);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: err.essage });
    });
});

//login endpoint for child
router.post(
  '/:id',
  /*authRequired,*/ function (req, res) {
    const id = String(req.params.id);
    if (req.body.pin) {
      //retrieve the parent from the db
      Child.findById(id)
        .then((child) => {
          //check the pin
          //console.log(child);
          //console.log(req.body);
          //console.log(child.pin === req.body.pin);
          //console.log(createToken(child));
          if (child.pin === req.body.pin) {
            //if the pin is correct make a token and get the dashboard data
            const token = createToken(child);
            //check for mission progress and make a db entry if none is found
            Child.getMissionProgress(req.params.id)
              .then((progress) => {
                console.log(progress);
                if (progress) {
                  res.status(200).json({
                    token: token,
                    child: {
                      id: child.id,
                      name: child.name,
                      username: child.username,
                      current_mission: child.current_mission,
                      avatar_url: child.avatar_url,
                    },
                    mission_progress: {
                      read: progress.read,
                      write: progress.write,
                      draw: progress.draw,
                    },
                  });
                } else {
                  Child.createMissionProgress(req.params.id)
                    .then((newProgress) => {
                      console.log(newProgress);
                      if (newProgress) {
                        res.status(200).json({
                          token: token,
                          child: {
                            id: child.id,
                            name: child.name,
                            username: child.username,
                            current_mission: child.current_mission,
                            avatar_url: child.avatar_url,
                          },
                          mission_progress: {
                            read: newProgress.read,
                            write: newProgress.write,
                            draw: newProgress.draw,
                          },
                        });
                      } else {
                        res.status(500).json({
                          message: 'error creating mission progress object',
                        });
                      }
                    })
                    .catch((err) => {
                      res.status(500).json({
                        error: err,
                        message: 'error retrieving mission progress object',
                      });
                    });
                }
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                  message: 'error retrieving mission progress object',
                });
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
  }
);

//get current mission endpoint
//check the token
router.get('/:id/mission', checkToken, function (req, res) {
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
});

router.get('/:id/progress', checkToken, (req, res) => {
  Child.findById(req.params.id)
    .then((child) => {
      if (child) {
        Child.getMissionProgress(child.id)
          .then((mission) => {
            res.status(200).json({ progress: mission });
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      } else {
        res.status(404).json({ message: 'child not found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.put('/:id/mission/read', checkToken, (req, res) => {
  Child.findById(req.params.id)
    .then((child) => {
      if (child) {
        Child.updateProgress(child.id, 'read')
          .then((resp) => {
            res.status(200).json({ progress: resp[0] });
          })
          .catch((err) => {
            res.status(500).json({ message: 'There was an error', error: err });
          });
      } else {
        res.status(404).json({ message: 'Child not found.' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'There was an error', error: err });
    });
});

//post writting submission
//use the multer function to send to the aws bucket and get the url's back
//send each of those url's to the ds endpoint to get scores and flags back
//add those scores and flags to the urls to make each post object
//add each of those post objects to the db

router.post('/:id/mission/write', checkToken, async function (req, res) {
  let child = await Child.findById(req.params.id);
  //we run the images through this multer function
  //we send our files to an AWS bucket
  //we get back an array of urls for the uploaded files
  multiUpload(req, res, async function (err) {
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
              console.log(response);
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
router.get('/:id/archive', checkToken, function (req, res) {
  Child.getArchive(req.params.id)
    .then((submissions) => {
      res.json({ submissions });
    })
    .catch((err) => {
      res.json({ err });
    });
});

const mockDSCall = function () {
  return {
    score: Math.trunc(Math.random() * 100),
    //flagged: false
  };
};

module.exports = router;
