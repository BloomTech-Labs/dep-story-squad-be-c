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
            if(newParent[0]){
              res.status(200).json({
              id: newParent[0].id,
              name: newParent[0].name,
              message: 'successfully registered',
            });}
            
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
      Parents.getChildNamesAndIDS(req.profile.id)
        .then((children) => {
          if (children) {
            const namesandIDS = {
              parent: {
                id: req.profile.id,
                name: req.profile.name,
              },
              children: children,
            };
            res.status(200).json({
              message: 'logged in',
              data: namesandIDS,
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
