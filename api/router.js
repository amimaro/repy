const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();

router.route('/callback')
  .post((...args) => controller.callback(...args));

router.route('/package')
  .post((...args) => controller.getData(...args));

router.route('/manager')
  .get((...args) => controller.getManagers(...args));

module.exports = router;
