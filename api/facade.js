const Schema = require('./schema.js');
const rp = require('request-promise');
const parser = require('xml2json');

const npmUrl = 'https://registry.npmjs.org/-/v1/search?from=0&size=10&quality=1.95&popularity=3.3&maintenance=2.05&text=';
const launchpadBinaryUrl = 'https://api.launchpad.net/devel/ubuntu/+archive/primary?ws.op=getPublishedBinaries&ws.size=10&pocket=Release&status=Published&ordered=false&binary_name=';
const launchpadBinaryExactUrl = 'https://api.launchpad.net/devel/ubuntu/+archive/primary?ws.op=getPublishedBinaries&ws.size=10&pocket=Release&status=Published&ordered=false&exact_match=true&binary_name=';
const brewUrl = 'http://searchbrew.com/search?q=';
const gemUrl = 'https://rubygems.org/api/v1/search.json?query=';
const pipApi = 'https://pypi-server-api.herokuapp.com/query/';
const chocoApi = 'https://chocolatey.org/api/v2/Search()?$filter=IsLatestVersion&$skip=0&$top=7&targetFramework=%27%27&includePrerelease=false&searchTerm=%27';

let getLaunchpadData = function(res, prev) {
  let packages = prev;
  for (let entrie of JSON.parse(res).entries) {
    let bin_component = entrie['component_name'];
    if (bin_component == 'main' || bin_component == 'universe') {
      let bin_package_name = entrie['binary_package_name'];
      let bin_package_version = entrie['binary_package_version'];
      let bin_distro = entrie['distro_arch_series_link'].replace('https://api.launchpad.net/devel/ubuntu/', '').split('/')[0];
      let bin_arch = entrie['distro_arch_series_link'].replace('https://api.launchpad.net/devel/ubuntu/', '').split('/')[1];
      let packIndex = packages.findIndex(pack => (pack.name == bin_package_name && pack.distro == bin_distro));
      if (packIndex >= 0) { //Package Exist - Add new Release
        if (packages[packIndex].releases.indexOf(bin_package_version) < 0)
          packages[packIndex].releases.push(bin_package_version);
      } else { //Package not Exist - Add new Pack
        let schema = new Schema();
        schema.name = bin_package_name;
        schema.distro = bin_distro;
        schema.arch = bin_arch;
        schema.repo = 'apt';
        schema.description = "Ubuntu " + bin_distro + " package";
        if (schema.releases.indexOf(bin_package_version) < 0)
          schema.releases.push(bin_package_version);
        schema.selectedRelease = schema.releases[0];
        schema.url = "https://launchpad.net/ubuntu/+source/" + bin_package_name;
        packages.push(schema);
      }
    }
  }
  return packages;
};

class ManagerFacade {

  getData(...args) {

    let packages = [];
    let manager = args[0]['manager'];
    let query = args[0]['query'];
    if (manager === 'apt') {
      return rp(launchpadBinaryExactUrl + query)
        .then(function(res) {
          packages = getLaunchpadData(res, packages);
          return rp(launchpadBinaryUrl + query)
            .then(function(res) {
              packages = getLaunchpadData(res, packages);
              return packages;
            })
            .catch(function(err) {
              return "Something went wrong... :/";
            });
        })
        .catch(function(err) {
          console.log(err);
          return "Something went wrong... :/";
        });
    } else if (manager === 'npm') {
      return rp(npmUrl + query)
        .then(function(res) {
          for (let p of JSON.parse(res).objects) {
            let schema = new Schema();
            p = p.package;
            schema.name = p['name'];
            schema.description = p['description'];
            schema.publisher = p['publisher']['username'];
            schema.github = p['links']['repository'];
            schema.repo = 'npm';
            schema.releases.push(p['version']);
            schema.url = "https://www.npmjs.com/package/" + p['name'];
            schema.selectedRelease = schema.releases[0];
            packages.push(schema);
          }
          return packages;
        })
        .catch(function(err) {
          return "Something went wrong... :/";
        });
    } else if (manager === 'gem') {
      return rp(gemUrl + query)
        .then(function(res) {
          for (let p of JSON.parse(res)) {
            let schema = new Schema();
            schema.name = p['name'];
            schema.description = p['info'];
            schema.repo = 'gem';
            schema.publisher = p['authors'];
            schema.url = p['project_uri'];
            schema.releases.push(p['version']);
            schema.selectedRelease = schema.releases[0];
            packages.push(schema);
          }
          return packages;
        })
        .catch(function(err) {
          return "Something went wrong... :/";
        });
    } else if (manager === 'brew') {
      return rp(brewUrl + query)
        .then(function(res) {
          for (let p of JSON.parse(res).data) {
            let schema = new Schema();
            schema.name = p['title'];
            schema.description = p['description'];
            schema.repo = 'brew';
            schema.url = p['homepage'];
            packages.push(schema);
          }
          return packages;
        })
        .catch(function(err) {
          return "Something went wrong... :/";
        });
    } else if (manager === 'pip') {
      return rp(pipApi + query)
        .then(function(res) {
          for (let p of JSON.parse(res).objects) {
            let schema = new Schema();
            schema.name = p['name'];
            schema.description = p['summary'];
            schema.repo = 'pip';
            schema.publisher = p['author'];
            schema.url = p['package_url'];
            schema.releases.push(p['version']);
            schema.selectedRelease = schema.releases[0];
            packages.push(schema);
          }
          return packages;
        })
        .catch(function(err) {
          return "Something went wrong... :/";
        });
    } else if (manager === 'choco') {
      return rp(chocoApi + query + '%27')
        .then(function(res) {
          let packs = JSON.parse(parser.toJson(res));
          if ((packs.feed.entry).length == null || (packs.feed.entry).length == undefined) {
            return packages;
          } else {
            for (let p of packs.feed.entry) {
              let schema = new Schema();
              schema.name = p['title']['$t'];
              schema.description = p['summary']['$t'];
              schema.repo = 'choco';
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
        })
        .catch(function(err) {
          console.log(err);
          return "Something went wrong... :/";
        });
    } else {
      return {};
    }
  }

}

module.exports = new ManagerFacade();
