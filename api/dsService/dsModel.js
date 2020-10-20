const axios = require('axios');
const dsConfig = require('../../config/dsConfig');
const dsClient = axios.create(dsConfig);

const getPrediction = (x1) => {
  return dsClient.post('/ocr', { x1 });
};

module.exports = { getPrediction };
