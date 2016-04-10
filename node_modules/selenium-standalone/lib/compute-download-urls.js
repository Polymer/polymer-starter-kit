module.exports = computeDownloadUrls;

var util = require('util');

var urls = {
  selenium: '%s/%s/selenium-server-standalone-%s.jar',
  chrome: '%s/%s/chromedriver_%s.zip',
  ie: '%s/%s/IEDriverServer_%s_%s.zip'
};

function computeDownloadUrls(opts, askedOpts) {
  // 2.44.0 => 2.44
  // 2.44.0 would be `patch`, 2.44 `minor`, 2 `major` as per semver

  var downloadUrls = {
    selenium: util.format(
      urls.selenium,
      opts.seleniumBaseURL,
      opts.seleniumVersion.slice(0, opts.seleniumVersion.lastIndexOf('.')),
      opts.seleniumVersion
    )
  };
  if (opts.drivers.chrome) {
    downloadUrls.chrome = util.format(
      urls.chrome,
      opts.drivers.chrome.baseURL,
      opts.drivers.chrome.version,
      getChromeDriverPlatform(opts.drivers.chrome.arch)
    );
  }
  if (opts.drivers.ie) {
    downloadUrls.ie = util.format(
      urls.ie,
      opts.drivers.ie.baseURL,
      opts.drivers.ie.version.slice(0, opts.drivers.ie.version.lastIndexOf('.')),
      getIeDriverArchitecture(opts.drivers.ie.arch),
      opts.drivers.ie.version
    );
  }
  return downloadUrls;
}

function getChromeDriverPlatform(wantedArchitecture) {
  var platform;

  if (process.platform === 'linux') {
    platform = 'linux' + (wantedArchitecture === 'x64' ? '64' : '32');
  } else if (process.platform === 'darwin') {
    platform = 'mac32';
  } else {
    platform = 'win32';
  }

  return platform;
}

function getIeDriverArchitecture(wanted) {
  var platform;

  if (wanted === 'ia32') {
    platform = 'Win32';
  } else {
    platform = 'x64';
  }

  return platform;
}
