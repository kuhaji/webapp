const ImagePost = require('../models/image-post');
const {handleAsync, uploadFile} = require('../helpers');

module.exports.createImagePost = handleAsync(async (req, res) => {
  const fileUploadOptions = {
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
    mediaPath: 'posts'
  };
  const imageFile = req.files && req.files.image;
  const imagePath = imageFile
    ? await uploadFile(imageFile, fileUploadOptions)
    : req.body.imagePath || '';
  const {title, description} = req.body;
  const post = await ImagePost.create({
    UserId: parseInt(req.params.userId),
    imagePath,
    title,
    description
  });
  res.json({status: 'success', post});
});

module.exports.getImagePostsByUser = handleAsync(async (req, res) => {
  const {userId} = req.params;
  const posts = await ImagePost.findAll({where: {userId}});
  res.json({posts: posts.map(post => post.toJSON())});
});
