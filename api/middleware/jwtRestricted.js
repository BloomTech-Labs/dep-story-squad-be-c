const jwt = require('jsonwebtoken');

//Verifies the jwt that we send after the user enters their pin

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(' ')[1];
  const secret = process.env.JWTSECRET;
  if (authorization) {
    jwt.verify(token, secret, (error, decodedToken) => {
      if (error) {
        console.log(error, decodedToken);
        res.status(401).json({ errorMessage: 'Invalid Credentials' });
      } else {
        req.decodedToken = decodedToken;
        if (req.decodedToken.sub == req.params.id) {
          next();
        } else {
          res.status(400).json({
            message:
              'The ID provided is not associated with the token provided',
          });
        }
      }
    });
  } else {
    res.status(400).json({ errorMessage: 'No credentials Provided' });
  }
};
