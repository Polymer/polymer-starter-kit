exports.getStdout = function(stdout) {
  return stdout[0] && stdout[0].length && stdout[0].split('\n')[0].trim();
};
