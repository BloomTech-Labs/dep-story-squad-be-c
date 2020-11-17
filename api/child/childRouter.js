const express = require('express');
const authRequired = require('../middleware/authRequired');
const Child = require('./childModel');
const dsModel = require('../dsService/dsModel.js');
const router = express.Router();
const jwt = require('jsonwebtoken');
const checkToken = require('../middleware/jwtRestricted');
const fileUploadHandler = require('../middleware/uploadFiles');

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
      if (children) {
        res.status(200).json(children);
      } else {
        res.status(404).json({ message: 'No children found' });
      }
    })
    .catch(() => {
      res.status(500);
    });
});

//login endpoint for child
router.post('/:id', authRequired, function (req, res) {
  const id = String(req.params.id);
  if (req.body.pin) {
    //retrieve the parent from the db
    Child.findById(id)
      .then((child) => {
        //check the pin
        if (child.pin === req.body.pin) {
          //if the pin is correct make a token and get the dashboard data
          const token = createToken(child);
          //check for mission progress and make a db entry if none is found
          Child.getMissionProgress(req.params.id)
            .then((progress) => {
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
                    id: progress.id,
                    read: progress.read,
                    write: progress.write,
                    draw: progress.draw,
                  },
                });
              } else {
                Child.createMissionProgress(req.params.id)
                  .then((newProgress) => {
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
                          id: newProgress.id,
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
});

//get current mission endpoint
//check the token
router.get('/:id/mission', checkToken, function (req, res) {
  Child.findById(req.params.id)
    .then((child) => {
      Child.getCurrentMission(child.current_mission)
        .then((mission) => {
          if (mission) {
            res.status(200).json({
              ...mission,
            });
          } else {
            res.status(404).json({ message: 'no mission found' });
          }
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

/**
 * Parse and save writing submission
 * @param images
 * @param child
 * @returns {Promise<any[]>}
 */
async function parseAndSaveSubmissions(images, child, dsScores) {
  return Promise.all(
    images.map(async (url) => {
      try {
        // return writing scores and round it to nearest integer

        let submissionObject = {
          file_path: url,
          score: Math.round(dsScores.data.Complexity),
          flagged: dsScores.data.IsFlagged,
          mission_id: child.current_mission,
          child_id: child.id,
        };
        try {
          await Child.addWriting(submissionObject);
        } catch (err) {
          console.log('error', err);
        }
        return true;
      } catch (e) {
        console.log('error', e);
        return false;
      }
    })
  );
}

/*
Front end submits mission_progress.id with images.

Once object is created, send to ds api
*/

//post writting submission
//use the multer function to send to the aws bucket and get the url's back
//send each of those url's to the ds endpoint to get scores and flags back
//add those scores and flags to the urls to make each post object
//add each of those post objects to the db
router.post(
  '/:id/mission/write',
  checkToken,
  fileUploadHandler,
  async function (req, res) {
    let child = await Child.findById(req.params.id);
    let mission_progress_id = req.query['mpi'];

    console.log('QUERY', req.query);

    // pull s3 data created in fileUploadHandler from body
    let fileArray = req.body;

    try {
      // create images array
      const images = [];
      // iterate over fileArray to pull out s3 urls and add to images array
      for (let i = 0; i < Object.keys(fileArray).length; i++) {
        let fileLocation = fileArray[i].Location;
        images.push(fileLocation);
      }
      // construct object structure for DS API
      const dsSubmit = {
        SubmissionID: mission_progress_id,
        StoryId: child.current_mission,
        Pages: {},
      };
      // iterate over images array to create pageObj, which is then inserted into dsSubmit.Pages object
      images.map((result, i) => {
        const updateInd = i + 1;
        const pageObj = {
          URL: result,
          Checksum: fileArray[i].Checksum,
        };
        dsSubmit.Pages[updateInd] = pageObj;
      });

      // now that dsSubmit object is created, send to DS API for scoring and flagging review
      let dsScores = await dsModel.getTextPrediction(dsSubmit);

      // send data to saveSubmissions function for storage in database
      await parseAndSaveSubmissions(images, child, dsScores);

      // if we've made it this far, child has successfully submitted a writing sample so update their mission progress
      const mission = await Child.updateProgress(req.params.id, 'write');

      // send success message to client
      res.status(200).json({
        message: 'we got your submission!',
        progress: mission[0],
      });
    } catch (err) {
      // if caught here, the issue either in the dsSubmit object construction, the DS API itself, or the saving of data to the database
      res.status(500).json({ message: 'File upload error' });
    }
  }
);

router.post('/:id/mission/draw', checkToken, fileUploadHandler, async function (
  req,
  res
) {
  let child = await Child.findById(req.params.id);
  let mission_progress_id = req.query['mpi'];

  // pull s3 data created in fileUploadHandler from body
  let fileArray = req.body;

  // create images array
  const images = [];
  // iterate over fileArray to pull out s3 urls and add to images array
  for (let i = 0; i < Object.keys(fileArray).length; i++) {
    let fileLocation = fileArray[i].Location;
    images.push(fileLocation);
  }
  // construct object structure for DS API

  if (images.length > 1) {
    res.status(500).json({ message: 'Please only upload one drawing' });
  } else {
    const dsSubmit = {
      SubmissionID: mission_progress_id,
    };
    // iterate over images array to create pageObj, which is then inserted into dsSubmit.Pages object
    images.map((result, i) => {
      dsSubmit['URL'] = result;
      dsSubmit['Checksum'] = fileArray[i].Checksum;
    });

    // now that dsSubmit object is created, send to DS API for scoring and flagging review
    let dsScores = await dsModel.getDrawingPrediction(dsSubmit);

    // create submission object for drawing

    let submissionObject = {
      file_path: images[0],
      flagged: dsScores.data.IsFlagged,
      mission_id: child.current_mission,
      child_id: child.id,
    };

    // send drawing to database
    await Child.addDrawing(submissionObject);

    // if we've made it this far, child has successfully submitted a drawing sample so update their mission progress
    const mission = await Child.updateProgress(req.params.id, 'draw');

    // send success message to client
    res.status(200).json({
      message: 'we got your submission!',
      progress: mission[0],
    });
  }
  // } catch (err) {
  //   // if caught here, the issue either in the dsSubmit object construction, the DS API itself, or the saving of data to the database
  //   res.status(500).json({ message: 'File upload error' });
  // }
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

module.exports = router;
