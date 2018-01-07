# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

### Issues

Feel free to report any bugs,enhancements, help, questions using [Github's issues](https://help.github.com/articles/creating-an-issue/).

### Any contributions you make will be under the MIT Software License

Your submissions are understood to be under the same [MIT License](LICENSE.md) that covers this project.


## Pull Request Process

1. Fork, then clone the repo:
```
git clone git@github.com:YOUR-USERNAME/repy.git
```
2. Create a new branch:
```
git checkout -b [new_branch]
```
3. After you commit your changes you can push your changes up:
```
git push origin [new_branch]
```

## New API support?

You may open a issue with interest in some package manager or add new resources to our code based on some steps:

1. Add a new package manager at api/model/managers.js, following the example bellow:

```
  'gem': {
    'display_name': 'RubyGem',
    'code': 'gem',
    'url': ['https://rubygems.org/api/v1/search.json?query='],
    'cmd': 'gem install',
    'sufix': ''
  },
```
* The 'url' has to be broken so that we can add the query at the end.
* The 'cmd' should be all commands before the package name and 'sufix' any options after package name.

2. Create a js file at api/model with the codename of the package manager e.g. api/model/gem.js.
3. The file created must have a function with the search response as a parameter and a package array returned, at the end, the module should be exported:
```
const Schema = require('../schema.js');

function gem(res) {
  let packages = [];

  //data mapping goes here

  return packages;
}

module.exports = gem;
```
4. Before mapping, all data pushed to 'packages' should follow a data base model available at api/schema.js (* required data):
```
{
    "name": "",             // *package name
    "url": "",              // homepage url
    "description": "", 		  // package description
    "publisher": "",		    // author/publisher name
    "github": "",			      // github url
    "manager": "",			    // *package manager code e.g. apt-get, npm, gem...
    "distro": "",			      // distribution name
    "arch": "",				      // architecture name
   	"releases": [],			    // version releases
    "selectedRelease": "",  // selected release, usually the first entry os 'releases'
    "img": "",				      // icon url
    "down": "",				      // download count
    "options": {			      // options setup
        "sudo": false,		  // options: sudo command
        "global": false,	  // options: global commad for npm (-g)
        "save": false		    // options: save command for npm (--save)
    },
    "isSelected": false		  // check if selected
}
```
5. Data mapping should be based on the api response. At each iteration a new Schema is created and the api data is mapped to their respective pair. Then, the schema object is pushed to the packages array.:
```
const Schema = require('../schema.js');

function gem(res) {
  let packages = [];

  for (let pack of JSON.parse(res)) {
    let schema = new Schema();
    schema.name = pack['name'];
    schema.description = pack['info'];
    schema.manager = 'gem';
    schema.publisher = pack['authors'];
    schema.url = pack['project_uri'];
    schema.releases.push(pack['version']);
    schema.selectedRelease = schema.releases[0];
    packages.push(schema);
  }

  return packages;
}

module.exports = gem;
```
6. The final step is to import the module to the facade request function at api/facade.js.

* Import the new module
```
	const gem = require('./model/gem');
```
* Add the function where it's marked on the code by the comment
```
		      ...
          else if (manager === 'npm')
            packages = npm(res);
          else if (manager === 'pip')
            packages = pip(res);
          else if (manager === 'gem')
            packages = gem(res);
          // Add new package manager functions here
          ...
```
7. All done! Thanks for your support! Take a look at the pull request section to merge the changes.
