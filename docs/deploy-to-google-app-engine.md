# Deploy to Google App Engine

Google App Engine is a great way to host your Polymer application using Google infrastructure.

[You can sign up for a Google Cloud Platform free account](https://cloud.google.com/).

There are multiple ways to host web app on GCP, but my favorite one is using GAE.

The scripts below are based on the [Using Static Files guide](https://cloud.google.com/appengine/docs/python/gettingstartedpython27/staticfiles) and [Polymer Gmail by @ebidel](https://github.com/ebidel/polymer-gmail) repository.

1.  Install the gcloud command line tools

        curl https://sdk.cloud.google.com | bash

    Detailed instructions can be found [here](https://cloud.google.com/sdk/)

1.  Inititalize gcloud

        gcloud init

    In this step you will be asked to login to your GCP account and set default settings, such as project, zone & region, etc.

1.  Create a new GCP project using the [Developers Console](https://console.developers.google.com/home/dashboard)

1.  Add `app.yaml` to your project root folder

    ```yaml
    runtime: python27
    api_version: 1
    threadsafe: yes

    handlers:

    - url: /bower_components
      static_dir: bower_components
      secure: always

    - url: /images
      static_dir: images
      secure: always

    - url: /(.*).(html|js|json|css)
      static_files: \1.\2
      upload: (.*)\.(html|js|json|css)
      secure: always

    - url: /
      static_files: index.html
      upload: index\.html
      http_headers:
        Link: '</scripts/app.js>; rel=preload; as=script, </elements/elements.html>; rel=preload; as=document, </styles/main.css>; rel=preload; as=style'
        # Access-Control-Allow-Origin: "*"
      secure: always

    skip_files:
    - ^(.*/)?app\.yaml
    ```

    This is the configuration file for the GCP project.
    It sets a python runtime environment and static file handlers.
    The configuration utilizes GAE HTTP/2 capabilities in order to minimize load time for HTTP/2 compatible browsers.

    **Please note**: This also ensures HTTPS; if you wish to use custom domains supporting HTTP only, you will need to remove all the 'secure: always’ entries. If you decide to have custom domains that only use HTTP instead of HTTPS, be aware some Web platform APIs such as service workers and Web app manifests, including some elements that depend on such APIs for their functionality, only work with HTTPS.

1.  Add a bash script to build & deploy the application

    ```sh
    #!/usr/bin/env bash

    GAE_PROJECT=psk
    DEPLOY_VERSION=$1

    if [ -z "$DEPLOY_VERSION" ]
    then
      TAG=`git describe --abbrev=0`
      # GAE doesn't allow periods
      DEPLOY_VERSION=${TAG//.}
    fi

    # Build it.
    echo "Building $DEPLOY_VERSION"
    gulp
    cp app.yaml dist/app.yaml

    echo "Deploying $DEPLOY_VERSION"
    gcloud preview app deploy dist/app.yaml --project $GAE_PROJECT --promote --version $DEPLOY_VERSION
    ```

    You have to set `GAE_PROJECT` variable to your GAE project id.
    A deploy version can be provided as a parameter for the script, if not provided the latest git tag will be used.

1.  Add execution permission to the script

        chmod +x deploy.sh

1.  Run the deploy script

      Without version argument in order to use the latest git tag

        ./deploy.sh

      Or with a version argument (according to GAE version [limitations](https://cloud.google.com/appengine/docs/python/config/appconfig?hl=en))

        ./deploy.sh v100

    The URL to your live site is listed in the output.

Enjoy!
