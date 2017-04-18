module.exports = {
	local: require('./local'),
	browserstack: require('./browserstack'),
	remotePreview: require('./remote-preview'),
	remote: require('./remote/launcher'),
	server: require('./remote/server')
};
