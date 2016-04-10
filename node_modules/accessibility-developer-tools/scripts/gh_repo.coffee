request = require 'superagent'
Promise = require 'bluebird'

# Small utility class to interact with the Github v3 releases API.
module.exports = class GHRepo
  constructor: (@config = {}) ->
    @baseUrl = "https://api.github.com/repos/#{@config.repo}"

  _buildRequest: (req) ->
    req
      .auth @config.username, @config.password
      .set 'Accept', 'application/vnd.github.v3'
      .set 'User-Agent', 'grunt'

  log: -> console.log.apply console, arguments

  getReleaseByTagName: (tag) ->
    # GET /repos/:owner/:repo/releases/tags/:tag
    new Promise (resolve, reject) =>
      @log 'GET', "#{@baseUrl}/releases/tags/#{tag}"
      @_buildRequest(request.get "#{@baseUrl}/releases/tags/#{tag}")
        .end (err, res) ->
          return resolve() if res.statusCode is 404
          return reject(err) if err?
          return reject("Request failed") if res.statusCode isnt 200
          resolve res.body

  getReleases: (tag) ->
    # GET /repos/:owner/:repo/releases
    new Promise (resolve, reject) =>
      @log 'GET', "#{@baseUrl}/releases"
      @_buildRequest(request.get "#{@baseUrl}/releases")
        .end (err, res) ->
          return resolve() if res.statusCode is 404
          return reject(err) if err?
          return reject("Request failed") if res.statusCode isnt 200
          resolve res.body

  updateRelease: (release, payload) ->
    # PATCH /repos/:owner/:repo/releases/:id
    new Promise (resolve, reject) =>
      @log 'PATCH', "#{@baseUrl}/releases/#{release.id}"
      @_buildRequest(request.patch "#{@baseUrl}/releases/#{release.id}")
        .send payload
        .end (err, res) ->
          return reject(err) if err?
          return reject("Request failed") if res.statusCode isnt 200
          resolve res.body

  createRelease: (payload) ->
    # POST /repos/:owner/:repo/releases
    new Promise (resolve, reject) =>
      @log 'POST', "#{@baseUrl}/releases"
      @_buildRequest(request.post "#{@baseUrl}/releases")
        .send payload
        .end (err, res) ->
          return reject(err) if err?
          return reject("Request failed") if res.statusCode isnt 201
          resolve res.body

  getReleaseByName: (name) ->
    new Promise (resolve, reject) =>
      @getReleases().then (releases = []) ->
        for release in releases
          return resolve(release) if release.name is name

        return resolve()
      .catch (err) ->
        reject "Unable to fetch project releases."
