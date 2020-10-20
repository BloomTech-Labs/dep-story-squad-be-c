const axios = require('axios');
const dsConfig = require('../../config/dsConfig');
const dsClient = axios.create(dsConfig);

const getPrediction = (url) => {
  return dsClient.post('/ocr/', { url });
};

module.exports = { getPrediction };
