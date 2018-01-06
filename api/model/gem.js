const Schema = require('../schema.js');

function gem(res) {
  let packages = [];
  for (let p of JSON.parse(res)) {
    let schema = new Schema();
    schema.name = p['name'];
    schema.description = p['info'];
    schema.manager = 'gem';
    schema.publisher = p['authors'];
    schema.url = p['project_uri'];
    schema.releases.push(p['version']);
    schema.selectedRelease = schema.releases[0];
    packages.push(schema);
  }
  return packages;
}

module.exports = gem;
