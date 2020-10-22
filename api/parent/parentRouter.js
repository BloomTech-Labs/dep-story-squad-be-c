const express = require('express');
const router = express.Router();
const authRequired = require('../middleware/authRequired');
const Parents = require('./parentModel');
const Child = require('../child/childModel');
const jwt = require('jsonwebtoken');
const checkToken = require('../middleware/jwtRestricted');

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

//login to parent account
//needs a pin and a valid okta ID token
//will return a json web token and child data
router.post('/:id', authRequired, function (req, res) {
  //make sure the pin is in the body
  if (req.body.pin) {
    //retrieve the parent from the db
    Parents.findById(req.params.id)
      .then((parent) => {
        //check the pin
        console.log(parent);
        if (parent.pin === req.body.pin) {
          //if the pin is correct make a token and get the dashboard data
          const token = createToken(parent);
          Parents.getChildData(req.params.id)
            .then((childData) => {
              if (childData) {
                res.status(200).json({
                  message: 'logged in',
                  token: token,
                  parent: {
                    id: parent.id,
                    name: parent.name,
                    email: parent.email,
                    admin: parent.admin,
                  },
                });
              } else {
                res.status(500).json({
                  message: 'no child data found',
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
            message: 'incorrect pin',
          });
        }
      })
      .catch((err) => {
        res.status(400).json({
          message: 'there is no parent with that ID',
          error: err,
        });
      });
  } else {
    res.status(400).json({
      message: 'please include a pin',
    });
  }
});

/* all endpoints after this require a jwt the login above */

//make a child account

router.post('/:id/children', checkToken, function (req, res) {
  Parents.findById(req.params.id)
    .then((parent) => {
      if (parent) {
        const newchildObj = {
          ...req.body,
          parent_id: req.params.id,
        };
        Parents.createChild(newchildObj)
          .then((response) => {
            console.log(response);
            if (response) {
              res.status(200).json({
                message: 'created a new child',
                newChild: response,
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

router.delete('/:id/children/:child_id', checkToken, function (req, res) {
  Child.findById(req.params.child_id)
    .then((child) => {
      console.log('PARAMS', req.params.id);
      console.log('CHILD', child);
      console.log('PARAMSChild.parent_id', child.parent_id);
      if (child && child.parent_id === Number(req.params.id)) {
        console.log('remove id', req.params.child_id);
        Child.remove(req.params.child_id)
          .then(() => {
            res.status(200).json({
              message: 'child removed from DB',
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: 'error removing child from DB',
              error: err,
            });
          });
      } else {
        res.status(400).json({
          message: 'unauthorized',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'error retrieving child from DB',
        error: err,
      });
    });
});

router.get('/:id/dashboard', checkToken, function (req, res) {
  Parents.getChildData(req.params.id)
    .then((childData) => {
      if (childData) {
        res.status(200).json({
          childData,
        });
      } else {
        res.status(500).json({
          message: 'no child data found',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'error retrieving child data',
        error: err,
      });
    });
});

//put for parent

//delete for parent

//delete for parent

module.exports = router;
