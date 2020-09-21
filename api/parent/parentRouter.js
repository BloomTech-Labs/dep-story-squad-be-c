const express = require('express');
const router = express.Router();
const authRequired = require('../middleware/authRequired');
const Parents = require('./parentModel');
const jwt = require("jsonwebtoken");

function createToken(user) {
    const payload = {
        sub: user.id,
        username: user.username
    };
    const secret = process.env.JWTSECRET || 'bananas'
    const options = {
      expiresIn: "3h",
    };
        return jwt.sign(payload, secret, options);
}

//make a child account
router.post('/:id', authRequired, function (req, res) {
  Parents.findById(req.params.id)
    .then((parent) => {
      if (parent) {
        const newchildObj = {
          ...req.body,
          parent_id: req.params.id,
        };
        Parents.createChild(newchildObj)
          .then((response) => {
            if (response) {
              res.status(200).json({
                message: 'created a new child',
                ...response,
              });
            } else {
              res.status(500).json({
                message: 'unable to retrieve new child data',
              });
            }
          })
          .catch((err) => {
            res.status(500).json({
              message: 'error adding child to database',
              error: err,
            });
          });
      } else {
        res.status(400).json({
          message: 'there is no parent with that id',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'unable to retrieve parent data',
        error: err,
      });
    });
});

//this is the login for the parent account to get the dashboard data
//takes a pin in the body and returns a jwt and the child data
router.get('/:id', authRequired, function (req, res) {
  //make sure the pin is in the body
  if(req.body.pin){
    //retrieve the parent from the db
    Parents.findById(req.params.id)
      .then((parent)=>{
        //check the pin
        if(parent.pin === req.body.pin){
          //if the pin is correct make a token and get the dashboard data
          const token = createToken(parent);
          Parents.getChildData(req.params.id)
            .then((childData) => {
              if (childData) {
                res.status(200).json({
                  "message": 'dashboard retrieved',
                  "data": childData,
                  "token": token
                });
              }else{
                res.status(500).json({
                  "message": 'no child data found',
                });
              }
            })
            .catch((err) => {
              res.status(500).json({
                "message": 'error retrieving child data',
                "error": err
              });
            });
        }else{
          res.status(400).json({
            "message": "incorrect pin"
          })
        }
      })
      .catch(err=>{
          res.status(400).json({
            "message": "there is no parent with that ID",
            "error": err
          });
      });
    
    }else{
      res.status(400).json({
        message: 'please include a pin',
      });
    }
});

module.exports = router;
