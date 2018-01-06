const Schema = require('../schema.js');

function pip(res) {
  let packages = [];
  for (let p of JSON.parse(res).objects) {
    let schema = new Schema();
    schema.name = p['name'];
    schema.description = p['summary'];
    schema.manager = 'pip';
    schema.publisher = p['author'];
    schema.url = p['package_url'];
    schema.releases.push(p['version']);
    schema.selectedRelease = schema.releases[0];
    packages.push(schema);
  }
  return packages;
}

module.exports = pip;
