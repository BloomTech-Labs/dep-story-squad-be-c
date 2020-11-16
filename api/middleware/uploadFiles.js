const crypto = require('crypto');
const multiparty = require('multiparty');
const fileType = require('file-type');
const fs = require('fs');
const { uploader } = require('../middleware/multer');

const fileUploadHandler = async (req, res, next) => {
  // Create a new instance of a multiparty form object
  const form = new multiparty.Form();
  // Parse the form data from the request body into multiparty
  form.parse(req, async (error, fields, files) => {
    // Iterate over the request body and parse all form data
    try {
      // Get a list of all form fields that had file uploads
      const fileNames = Object.keys(files);

      // Initiate a hash table to store resolved file upload values
      const resolvedFiles = {};
      const checksums = {};

      // Check each field, and upload however many files were in each input
      for await (const f of fileNames) {
        // Get the path of each file
        const paths = files[f].map((x) => x.path);

        // Read each file into a buffer
        const buffers = paths.map((path) => fs.readFileSync(path));

        buffers.forEach((s) => {
          if (!checksums[f]) {
            checksums[f] = [];
          }
          checksums[f].push(generateChecksum(s));
        });

        // Create a list of promises to find each file type and resolve them

        const typePromises = buffers.map((buffer) =>
          fileType.fromBuffer(buffer)
        );

        const types = await Promise.all(typePromises);

        // Generate unique names for each file
        const uploadFileNames = paths.map((path, i) => {
          const timestamp = Date.now().toString();
          return `user-content/'${timestamp}-lg-${path}-${i + 1}`;
        });

        // Create a list of promises that upload files to the S3 bucket
        const promiseList = files[f].map((_, i) => {
          return uploader(buffers[i], uploadFileNames[i], types[i]);
        });

        // Resolve those promises and store them in the hash table with key being the form input value
        const resolved = await Promise.all(promiseList);
        resolvedFiles[f] = resolved.map((x, i) => ({
          ...x,
          Checksum: checksums[f][i],
        }));

        req.body = {
          ...req.body,
          ...resolvedFiles['image'],
        };

        console.log('uploadFiles:', req.body);
      }
      next();
    } catch (err) {
      // There was an error with the S3 upload
      res.status(409).json({ error: 'File upload failed.' });
    }
  });
};

const generateChecksum = (str, algorithm = 'sha512', encoding = 'hex') => {
  return crypto.createHash(algorithm).update(str, 'utf8').digest(encoding);
};

module.exports = fileUploadHandler;
