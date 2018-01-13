const managers = {
  'apt-get': {
    'display_name': 'Apt-Get',
    'code': 'apt-get',
    'url': ['https://api.launchpad.net/devel/ubuntu/+archive/primary?ws.op=getPublishedBinaries&ws.size=10&pocket=Release&status=Published&ordered=false&exact_match=true&binary_name=',
      'https://api.launchpad.net/devel/ubuntu/+archive/primary?ws.op=getPublishedBinaries&ws.size=10&pocket=Release&status=Published&ordered=false&binary_name='
    ],
    'cmd': 'apt-get install -y',
    'sufix': ''
  },
  'npm': {
    'display_name': 'NPM',
    'code': 'npm',
    'url': ['https://registry.npmjs.org/-/v1/search?from=0&size=10&quality=1.95&popularity=3.3&maintenance=2.05&text='],
    'cmd': 'npm install',
    'sufix': ''
  },
  'gem': {
    'display_name': 'RubyGem',
    'code': 'gem',
    'url': ['https://rubygems.org/api/v1/search.json?query='],
    'cmd': 'gem install',
    'sufix': ''
  },
  'pip': {
    'display_name': 'PyPi',
    'code': 'pip',
    'url': ['https://pypi-server-api.herokuapp.com/query/'],
    'cmd': 'pip install',
    'sufix': ''
  },
  'choco': {
    'display_name': 'Chocolatey',
    'code': 'choco',
    'url': ['https://chocolatey.org/api/v2/Search()?$filter=IsLatestVersion&$skip=0&$top=7&targetFramework=%27%27&includePrerelease=false&searchTerm=%27'],
    'cmd': 'choco install',
    'sufix': '-y'
  },
  'brew': {
    'display_name': 'Homebrew',
    'code': 'brew',
    'url': ['http://searchbrew.com/search?q='],
    'cmd': 'brew install',
    'sufix': ''
  }
};

module.exports = managers;
