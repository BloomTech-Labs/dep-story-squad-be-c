const axios = require('axios');
const dsConfig = require('../../config/dsConfig');
const dsClient = axios.create(dsConfig);

/*
Example data of object needing to be passed to predictions.
Checksum is a SHA512 hash
{
  "SubmissionID": 123564,
  "StoryId": 154478,
  "Pages": {
    "1": {
      "URL": "https://test-image-bucket-14579.s3.amazonaws.com/bucketFolder/1600554345008-lg.png",
      "Checksum": "edbd2c0cd247bda620f9a0a3fe5553fb19606929d686ed3440742b1a25df426a8e6d3188b7eec163488764cc72d8cee67faba47e29f7744871d94d2a19dc70de"
    },
    "2": {
      "URL": "https://test-image-bucket-14579.s3.amazonaws.com/bucketFolder/1600554345008-lg.png",
      "Checksum": "edbd2c0cd247bda620f9a0a3fe5553fb19606929d686ed3440742b1a25df426a8e6d3188b7eec163488764cc72d8cee67faba47e29f7744871d94d2a19dc70de"
    }
  }
}
*/
const getPrediction = (URL) => {
  //submission/text
  //submission/illustration
  return dsClient.post('/ocr', { URL });
};

module.exports = { getPrediction };
