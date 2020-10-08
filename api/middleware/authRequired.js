const createError = require('http-errors');
const OktaJwtVerifier = require('@okta/jwt-verifier');
const oktaVerifierConfig = require('../../config/okta');
const Parent = require('../parent/parentModel');
const oktaJwtVerifier = new OktaJwtVerifier(oktaVerifierConfig.config);

const makeParentObj = (claims) => {
  return {
    id: claims.sub,
    email: claims.email,
    name: claims.name,
  };
};
/**
 * A simple middleware that asserts valid Okta idToken and sends 401 responses
 * if the token is not present or fails validation. If the token is valid its
 * contents are attached to req.profile
 */
const authRequired = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/Bearer (.+)/);

    if (!match) throw new Error('Missing idToken');

    const idToken = match[1];
    //console.log(idToken);
    oktaJwtVerifier
      .verifyAccessToken(idToken, oktaVerifierConfig.expectedAudience)
      .then(async (data) => {
        const jwtUserObj = makeParentObj(data.claims);
        console.log(data, 'object');
        const profile = await Parent.findById(jwtUserObj.id);
        //res.status(200).json({'message': jwtUserObj});
        if (profile) {
          req.profile = profile;
        } else if (jwtUserObj.id && jwtUserObj.name && jwtUserObj.email) {
          req.profile = jwtUserObj;
        } else {
          throw new Error('unable to process id token');
        }
        next();
      })
      .catch((err) => {
        res.status(400).json({
          message: 'invalid token',
          error: err,
        });
      });
  } catch (err) {
    next(createError(401, err));
  }
};

module.exports = authRequired;
