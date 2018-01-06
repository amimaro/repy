const Schema = require('../schema.js');
const parser = require('xml2json');

function choco(res) {
  let packages = [];
  let packs = JSON.parse(parser.toJson(res));
  if ((packs.feed.entry).length == null || (packs.feed.entry).length == undefined) {
    return packages;
  } else {
    for (let p of packs.feed.entry) {
      let schema = new Schema();
      schema.name = p['title']['$t'];
      schema.description = p['summary']['$t'];
      schema.manager = 'choco';
      schema.down = p['m:properties']['d:DownloadCount']['$t'];
      schema.publisher = p['author']['name'];
      schema.url = p['d:ProjectUrl'];
      schema.releases.push(p['m:properties']['d:Version']);
      // schema.img = p['d:IconUrl'];
      schema.selectedRelease = schema.releases[0];
      packages.push(schema);
    }
  }
  return packages;
}

module.exports = choco;
