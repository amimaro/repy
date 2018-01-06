const Schema = require('../schema.js');

function npm(res) {
  let packages = [];
  for (let p of JSON.parse(res).objects) {
    let schema = new Schema();
    p = p.package;
    schema.name = p['name'];
    schema.description = p['description'];
    schema.publisher = p['publisher']['username'];
    schema.github = p['links']['repository'];
    schema.manager = 'npm';
    schema.releases.push(p['version']);
    schema.url = "https://www.npmjs.com/package/" + p['name'];
    schema.selectedRelease = schema.releases[0];
    packages.push(schema);
  }
  return packages;
}

module.exports = npm;
