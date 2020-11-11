const crypto = require('crypto');

const generateChecksum = (str, algorithm = 'sha512', encoding = 'hex') => {
  return crypto.createHash(algorithm).update(str, 'utf8').digest(encoding);
};

module.exports = generateChecksum;
