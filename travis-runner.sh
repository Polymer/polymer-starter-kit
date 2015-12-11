#!/bin/bash -e
set -o pipefail

if [ "$TRAVIS_BRANCH" = "master" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]
then
  git config --global user.email "samccone@gmail.com"
  git config --global user.name "auto deployer"

  deploy_ghpages () {
    # Deploying to GitHub Pages!
    sed -i.tmp "s/\/\/ app.baseUrl = '\/polymer-starter-kit/app.baseUrl = '\/polymer-starter-kit/" app/scripts/app.js
    gulp build-deploy-gh-pages
    # Undoing Changes to PSK for GitHub Pages
    cp app/scripts/app.js.tmp app/scripts/app.js
    rm app/scripts/app.js.tmp
  }

  deploy_firebase () {
    # Deploying to Firebase! (https://polymer-starter-kit.firebaseapp.com)
    # Making Changes to PSK for Firebase
    sed -i.tmp 's/<!-- Chrome for Android theme color -->/<base href="\/">\'$'\n<!-- Chrome for Android theme color -->/g' app/index.html
    sed -i.tmp "s/hashbang: true/hashbang: false/" app/elements/routing.html
    cp app/docs/firebase.json app/firebase.json
    # Starting Build Process for Firebase Changes
    gulp
    # Starting Deploy Process to Firebaseapp.com Server -- polymer-starter-kit.firebaseapp.com
    firebase deploy --non-interactive --token "${FIREBASE_TOKEN}"
    # Undoing Changes to PSK for Firebase
    cp app/index.html.tmp app/index.html
    cp app/elements/routing.html.tmp app/elements/routing.html
    rm app/elements/routing.html.tmp
    rm app/index.html.tmp
    rm app/firebase.json
  }

  deploy_ghpages
  deploy_firebase

else
  npm run lint
  npm test
fi
