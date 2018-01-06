const Schema = require('../schema.js');

function brew(res) {
  let packages = [];
  for (let p of JSON.parse(res).data) {
    let schema = new Schema();
    schema.name = p['title'];
    schema.description = p['description'];
    schema.manager = 'brew';
    schema.url = p['homepage'];
    packages.push(schema);
  }
  return packages;
}

module.exports = brew;
