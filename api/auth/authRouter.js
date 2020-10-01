const express = require('express');
const router = express.Router();
const authRequired = require('../middleware/authRequired');
const Parents = require('../parent/parentModel');

//register a new okta and parent account
router.post('/register', authRequired, function (req, res) {
  if (req.newProfile) {
    if (req.body.pin) {
      const parentObject = {
        ...req.newProfile,
        pin: req.body.pin,
      };
      Parents.create(parentObject)
        .then((newParent) => {
          console.log(newParent[0]);
          if (newParent[0]) {
            res.status(200).json({
              id: newParent[0].id,
              name: newParent[0].name,
              message: 'successfully registered',
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            message: 'error saving parent account',
            error: err,
          });
        });
    } else {
      res.status(400).json({
        message: 'you must include a pin to register',
      });
    }
  } else {
    res.status(400).json({
      message: 'an account with that id already exists',
    });
  }
});

//login returns the names and ids of all child accounts and the parent account
router.get('/login', authRequired, function (req, res) {
  if (req.profile) {
    Parents.getNamesAndIDS(req.profile.id)
      .then((data) => {
        console.log(data);
        if (data) {
          res.status(200).json({
            message: 'logged in',
            accounts: data,
          });
        } else {
          res.status(400).json({
            message: 'no child accounts found',
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: 'error retrieving child data',
          error: err,
        });
      });
  } else {
    res.status(400).json({
      message: 'you must register a parent account before logging in',
    });
  }
});

module.exports = router;
