const Promise = require('bluebird');
const path = require('path');
const fs = Promise.promisifyAll(require('fs'));
const {MEDIA_UPLOAD_FOLDER} = require('../constants');
const {BadRequestError} = require('../errors');

/**
 * Save a file to the media uploads folder.
 * 
 * @param {object} file - file object
 * @param {string} file.name - filename
 * @param {Buffer|ReadableStream} file.data - file content as Buffer or ReadableStream
 * @param {string} file.mimetype - file MIME type
 * @param {object} [options]
 * @param {string[]} [options.allowedFileTypes] - allowed MIME types
 * @param {string} [options.mediaPath] - custom path inside the media folder
 * @returns {Promise<string>} the relative file path
 */
module.exports = async (file, options= {}) => {
  const {allowedFileTypes, mediaPath = ''} = options;
  if (allowedFileTypes && !allowedFileTypes.includes(file.mimetype)) {
    throw new BadRequestError(`Unsupported file type: ${file.mimetype}`);
  }
  const relativePath = path.join('/', MEDIA_UPLOAD_FOLDER, mediaPath, file.name);
  const filePath = path.join(process.cwd(), 'public', relativePath);
  const dirname = path.dirname(filePath);
  try {
    await fs.statAsync(dirname);
  } catch (e) {
      // Create the directory if it doesn't exist
    await fs.mkdirAsync(dirname, {recursive: true});
  }
  if (typeof file.data.pipe === 'function') {
    file.data.pipe(fs.createWriteStream(filePath));
  } else {
    await fs.writeFileAsync(filePath, file.data);
  }
  return relativePath;
}
