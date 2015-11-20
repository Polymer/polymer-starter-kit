#!/bin/bash
set -o pipefail

echo "$TRAVIS_BRANCH"

if [ "$TRAVIS_BRANCH" = "master" ] && [ "$TRAVIS_PULL_REQUEST" != "true" ]
then
  echo "Deploying!" && \
  sed -i  .tmp "s/\/\/ app.baseUrl = '\/polymer-starter-kit/app.baseUrl = '\/polymer-starter-kit/" app/scripts/app.js && \
  rm app/scripts/app.js.tmp && \
  bower i && \
  npm run compile-all && \
  cp CNAME dist
  cd dist && \
  git init && \
  git add . && \
  git commit -m "deploy" && \
  git push --force --quiet "https://${GH_TOKEN}@github.com/polymerelements/polymer-starter-kit.git" master:gh-pages > /dev/null 2>&1 && \
  cd .. && \
  sed -i .tmp "s/app.baseUrl = '\/polymer-starter-kit/\/\/ app.baseUrl = '\/polymer-starter-kit/" app/scripts/app.js && \
  rm app/scripts/app.js.tmp
else
  npm run lint
fi
