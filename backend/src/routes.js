const express = require('express');
const postController = require('./controllers/postController');
const likeController = require('./controllers/likeController');
const deslikeController = require('./controllers/deslikeController');

const routes = express.Router();

routes.post('/devs/:devId/likes', likeController.store);
routes.post('/devs/:devId/deslikes', deslikeController.store);
routes.get('/devs', deslikeController.index);
routes.delete('/devs', deslikeController.delete);
routes.post('/devs', postController.store);

module.exports = routes;