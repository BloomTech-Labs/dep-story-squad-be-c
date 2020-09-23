const express = require('express');
const authRequired = require('../middleware/authRequired');
const Child = require('./childModel');
const router = express.Router();
const jwt = require('jsonwebtoken');
const checkToken = require('../middleware/jwtRestricted');

function createToken(user) {
    const payload = {
        sub: user.id,
        username: user.username
    };
    const secret = process.env.JWTSECRET
    const options = {
      expiresIn: "3h",
    };
        return jwt.sign(payload, secret, options);
}
//login endpoint for child
router.get('/:id', authRequired, function (req, res){
    if(req.body.pin){
    //retrieve the parent from the db
    Child.findById(req.params.id)
      .then((child)=>{
        //check the pin
        console.log(child)
        if(child.pin === req.body.pin){
          //if the pin is correct make a token and get the dashboard data
          const token = createToken(child);
          res.status(200).json({
              "token": token,
              "child": {
                      'id': child.id,
                      'name': child.name, 
                      'username': child.username, 
                      'current_mission': child.current_mission, 
                      'avatar_url': child.avatar_url  
                      }
          })
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
})


//get current mission endpoint
//check the token
router.get('/:id/mission', checkToken, function (req,res){
    if(req.decodedToken.sub == req.params.id){
    Child.findById(req.params.id)
        .then((child)=>{
            Child.getCurrentMission(child.current_mission)
                .then(mission=>{
                    res.json({
                        ...mission
                    })
                })
                .catch(err=>{
                    res.status(500).json({
                        "message": "error retrieving mission",
                        "error": err
                    })
                })
        })
        .catch(err=>{
            res.status(500).json({
                "message": "error retrieving child data",
                "error": err
            })
        })
    }else{
        res.status(400).json({
            "message": "The ID provided is not associated with the token provided"
        })
    }
})

//post story and drawing submission
    //use the multer function to send to the aws bucket and get the url's back
    //send each of those url's to the ds endpoint to get scores and flags back
    //add those scores and flags to the urls to make each post object
    //add each of those post objects to the db



module.exports = router;
