const rp = require('request-promise');
const managers = require('./model/managers');

const npm = require('./model/npm');
const gem = require('./model/gem');
const pip = require('./model/pip');
const brew = require('./model/brew');
const bower = require('./model/bower');
const choco = require('./model/choco');
const aptget = require('./model/aptget');

class ManagerFacade {

  getData(...args) {

    let packages = [];
    let requests = [];
    let manager = args[0]['manager'];
    let query = args[0]['query'].toLowerCase();
    let urls = managers[manager].url.map((url) => {
      return url + query + this.addDetails(manager);
    });

    for (let url of urls) {
      requests.push(
        rp(url)
        .then(function(res) {
          if (manager === 'apt-get' && query.length >= 4)
            packages = aptget(res, packages);
          else if (manager === 'brew')
            packages = brew(res);
          else if (manager === 'choco')
            packages = choco(res);
          else if (manager === 'gem')
            packages = gem(res);
          else if (manager === 'npm')
            packages = npm(res);
          else if (manager === 'pip')
            packages = pip(res);
          else if (manager === 'bower')
            packages = bower(res);
          // Add new package manager functions here
          else
            return packages;

          return requests.length > 0 ? requests.shift() : packages;
        })
        .catch(function(err) {
          return err;
          return "Something went wrong... :/";
        })
      );
    }

    return requests.shift();
  }

  addDetails(manager) {
    if (manager === 'choco')
      return '%27';
    else
      return '';
  }

}

module.exports = new ManagerFacade();
