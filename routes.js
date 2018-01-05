const Router = require('express').Router;
const router = new Router();

const api = require('./api/router');

router.use('/api', api);
router.get('*', function(req, res) {
  res.sendfile('./dist/index.html')
});

module.exports = router;
