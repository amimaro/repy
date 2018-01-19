const Schema = require('../schema.js');

function bower(res) {
  let packages = [];
  for (let p of JSON.parse(res)) {
    let schema = new Schema();
    schema.name = p['name'];
    schema.description = p['description'];
    schema.manager = 'bower';
    schema.url = p['repository_url'];
    schema.forks = p['forks'];
    schema.stars = p['stars'];
    schema.releases.push(p['latest_release_number']);
    packages.push(schema);
  }
  return packages;
}

module.exports = bower;
