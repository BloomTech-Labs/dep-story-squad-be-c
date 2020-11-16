const { default: Axios } = require('axios');
const dsConfig = require('../../config/dsConfig');
const dsClient = Axios.create(dsConfig);

/*
Column on Response tables referencing mission_progress.id

Writing_response: keep track of page numbers


For every response we have with submission id x, find pages with matching id.
iterate pages into object where page number is key, and value is equal to a URL k/v pair, and a checksum which will just be a hashing of the url string.


Example data of object needing to be passed to predictions.
Checksum is a SHA512 hash
{
  "SubmissionID": 123564, <- Mission_Progress.id
  "StoryId": 154478, <- Missions.id
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
const getTextPrediction = (dsSubmit) => {
  //submission/text
  //submission/illustration
  return dsClient.post('submission/text', dsSubmit);
};

const getDrawingPrediction = (dsSubmit) => {
  //submission/text
  //submission/illustration
  return dsClient.post('submission/illustration', dsSubmit);
};

module.exports = { getTextPrediction, getDrawingPrediction };
