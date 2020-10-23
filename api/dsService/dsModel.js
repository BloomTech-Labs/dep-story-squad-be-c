const axios = require('axios');
const dsConfig = require('../../config/dsConfig');
const dsClient = axios.create(dsConfig);

const getPrediction = (URL) => {
  return dsClient.post('/ocr', { URL });
};

module.exports = { getPrediction };
