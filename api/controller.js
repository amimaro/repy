const managerFacade = require('./facade');

const managers = [{
  'display_name': 'Apt-Get',
  'code': 'apt'
}, {
  'display_name': 'NPM',
  'code': 'npm'
}, {
  'display_name': 'RubyGem',
  'code': 'gem'
}, {
  'display_name': 'Pip',
  'code': 'pip'
}, {
  'display_name': 'Chocolatey',
  'code': 'choco'
}, {
  'display_name': 'Homebrew',
  'code': 'brew'
}];

class ManagerController {

  constructor(facade) {
    this.facade = facade;
  }

  getData(req, res, next) {
    let manager = req.body.manager;
    let query = req.body.query;
    if (query != "" && managers.findIndex(m => m.code == manager) >= 0) {
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
