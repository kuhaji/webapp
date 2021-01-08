const Busboy = require('busboy');
const {uploadFile} = require('../helpers');

module.exports.uploadFile = (req, res, next) => {
  const busboy = new Busboy({
    headers: req.headers,
    limits: {
      fileSize: 5000000
    }
  });
  const fileInfo = {};
  busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
    fileInfo.path = await uploadFile({name: filename, data: file, mimetype});
  });
  busboy.on('finish', () => {
    res.send(fileInfo);
  });
  req.pipe(busboy);
}