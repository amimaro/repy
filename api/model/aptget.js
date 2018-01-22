const Schema = require('../schema.js');

function aptget(res, prev) {
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
        schema.manager = 'apt-get';
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
}

module.exports = aptget;
