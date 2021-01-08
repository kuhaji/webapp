const express = require('express');
const grantAccess = require('./middleware/access-control');
const {allowIfLoggedIn} = require('./middleware/auth');
const {login, createUser, getUser, getUsers} = require('./controllers/user');
const {uploadFile} = require('./controllers/fileupload');
const {createImagePost, getImagePostsByUser} = require('./controllers/image-post');
const fileupload = require('express-fileupload');

const router = express.Router();

router.post('/login', login);
router.post('/users', createUser);
router.get('/users', allowIfLoggedIn, grantAccess('read:any', 'user'), getUsers);
router.get('/users/:userId', allowIfLoggedIn, grantAccess('read:own', 'user'), getUser);

router.post(
  `/users/:userId/imageposts`,
  allowIfLoggedIn,
  grantAccess('create:own', 'imagepost'),
  fileupload({limits: {fileSize: 5000000, files: 1}}),
  createImagePost
);

router.get('/users/:userId/imageposts', allowIfLoggedIn, grantAccess('read:own', 'imagepost'), getImagePostsByUser);
router.post('/upload', allowIfLoggedIn, uploadFile);

module.exports = router;