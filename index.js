require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {authenticate} = require('./src/middleware/auth.js');
const errorHandler = require('./src/middleware/error-handler');
const router = require('./src/routes');
const sequelize = require('./src/db');
const {MEDIA_UPLOAD_FOLDER} = require('./src/constants');

(async () => {
  const app = express();

  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use('/', express.static('public'));
  //app.use('/media', express.static(MEDIA_UPLOAD_FOLDER));
  app.use(authenticate);
  app.use('/api', router);
  app.use(errorHandler);

  
  await sequelize.sync();
  const port = process.env.PORT || 3001;
  
  app.listen(port, () => {
    console.log(`Server is now listening on port ${port}`);
  });
})();
