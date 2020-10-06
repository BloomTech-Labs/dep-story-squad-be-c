const Child = require('../child/childModel');

module.exports = (req, res, next) =>{
    Child.getMissionProgress(req.params.id)
        .then(progress=>{
            if(progress.id){
                next();
            }else{
                Child.createMissionProgress(req.params.id)
                    .then(response=>{
                        console.log(response)
                        if(response.read){
                            next();
                        }
                        else{
                            res.status(500).json({
                                message: 'error creating mission progress object'
                            })
                        }
                    })
                    .catch(err=>{
                        res.status(500).json({
                                error: err,
                                message: 'error creating mission progress object'
                            })
                    })
            }
        })
}