module.exports = {
  baseURL: 'https://selenium-release.storage.googleapis.com',
  version: '2.53.0',
  drivers: {
    chrome: {
      version: '2.21',
      arch: process.arch,
      baseURL: 'https://chromedriver.storage.googleapis.com'
    },
    ie: {
      version: '2.53.0',
      arch: process.arch,
      baseURL: 'https://selenium-release.storage.googleapis.com'
    }
  }
};
