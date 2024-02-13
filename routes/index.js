import AppController from '../controllers/AppController';

const mapRouter = (app) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);
};

module.exports = mapRouter;
