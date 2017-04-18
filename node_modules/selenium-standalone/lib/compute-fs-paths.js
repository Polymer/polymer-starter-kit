module.exports = computeFsPaths;

var path = require('path');

var basePath = path.join(__dirname, '..', '.selenium');

function computeFsPaths(opts) {
  var fsPaths = {};
  opts.basePath = opts.basePath || basePath;
  if (opts.drivers.chrome) {
    fsPaths.chrome = {
      installPath: path.join(opts.basePath, 'chromedriver', opts.drivers.chrome.version + '-' + opts.drivers.chrome.arch + '-chromedriver')
    };
  }
  if (opts.drivers.ie) {
    fsPaths.ie = {
      installPath: path.join(opts.basePath, 'iedriver', opts.drivers.ie.version + '-' + opts.drivers.ie.arch + '-IEDriverServer.exe')
    };
  }

  fsPaths.selenium = {
    installPath: path.join(opts.basePath, 'selenium-server', opts.seleniumVersion + '-server.jar')
  };

  fsPaths = Object.keys(fsPaths).reduce(function computeDownloadPath(newFsPaths, name) {
    var downloadPath;

    if (name === 'selenium') {
      downloadPath = newFsPaths[name].installPath;
    } else {
      downloadPath = newFsPaths[name].installPath + '.zip';
    }

    newFsPaths[name].downloadPath = downloadPath;
    return newFsPaths;
  }, fsPaths);

  return fsPaths;
}
