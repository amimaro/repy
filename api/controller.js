const managerFacade = require('./facade');
const managers = require('./model/managers');

class ManagerController {

  constructor(facade) {
    this.facade = facade;
  }

  getData(req, res, next) {
    let manager = req.body.manager;
    let query = req.body.query;
    if (query != "" && Object.keys(managers).indexOf(manager) >= 0) {
      return this.facade.getData(req.body)
        .then(collection => res.status(200).json(collection))
        .catch(err => next(err));
    } else {
      res.status(404).json({});
    }
  }

  getManagers(req, res, next) {
    res.status(200).json(managers);
  }

}

module.exports = new ManagerController(managerFacade);
