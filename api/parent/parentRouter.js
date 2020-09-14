const express = require('express');
const router = express.Router();
const authRequired = require('../middleware/authRequired');
const Parents = require('./parentModel');

//register a new parent account
router.post('/register', authRequired, function(req,res){
  if(req.newProfile){
    if(req.body.pin){
      const parentObject = {
        ...req.newProfile,
        pin: req.body.pin
      }
      Parents.create(parentObject)
        .then((newParent)=>{
          res.status(200).json({
            'id': newParent.id,
            'name': newParent.name,
            'message': 'successfully registered'
          })
        }).catch(err=>{
          res.status(500).json({
            'message': 'error saving parent account',
            'error': err
          })
        })
    }else{
      res.status(400).json({
        'message': 'you must include a pin to register'
      })
    }
  }else{
    res.status(400).json({
      'message': 'an account with that id already exists'
    })
  }
});

//make a child account
router.post('/:id', authRequired, function(req,res){
  Parents.findById(req.params.id)
    .then((parent)=>{
      if(parent){
        const newchildObj = {
          ...req.body,
          parent_id: req.params.id
        }
        Parents.createChild(newchildObj)
          .then((response)=>{
            if(response){
              res.status(200).json({
                'message': 'created a new child',
                ...response
              })
            }else{
              res.status(500).json({
                'message': 'unable to retrieve new child data'
              })
            }
          }).catch(err=>{
            res.status(500).json({
              'message': 'error adding child to database',
              'error': err
            })
          })
      }else{
        res.status(400).json({
          'message': 'there is no parent with that id'
        })
      }
    }).catch(err=>{
      res.status(500).json({
        'message': 'unable to retrieve parent data',
        'error': err
      })
    })
});

//login returns the names and ids of all child accounts and the parent account
router.get('/login', authRequired, function(req,res){
  if(req.profile){
    Parents.getChildNamesAndIDS(req.profile.id)
      .then((children)=>{
        if(children){
          namesandIDS = {
            parent: {
              id: req.profile.name,
              name: req.profile.name
            },
            children: children
          }
          res.status(200).json({
            'message': 'logged in',
            'data': namesandIDS
          })
        }else{
          res.status(400).json({
            'message': 'no child accounts found',
          })
        }
      }).catch(err=>{
        res.status(500).json({
          'message': 'error retrieving child data',
          'error': err
        })
      })
  }else{
    res.status(400).json({
      'message': 'you must register a parent account before logging in'
    })
  }
});

//get dashboard
router.get('/:id', authRequired, function(req,res){
  if(req.profile){
    Parents.getChildData(req.params.id)
      .then((childData)=>{
        if(childData){
          res.status(200).json({
            'message': 'dashboard retrieved',
            'data': childData
          })
        }else{
          res.status(500).json({
            'message': 'no child data found'
          })
        }
      }).catch((err)=>{
        res.status(500).json({
          'message': 'error retrieving child data',
          'error': err
        })
      })
  }else{
    res.status(400).json({
      'message': 'no profile found with that id'
    })
  }
});



module.exports = router;
