# Deploy

This tutorial teaches you how to deploy your Polymer Starter Kit application.

If you have not completed the [Set up tutorial](set-up.md), do so now
before attempting this tutorial.

## Deploy with Firebase (recommended)

Firebase is a very simple and secure way to deploy a PSK site. You can sign
up for a free account and deploy your application in less than 5 minutes.

The instructions below are based on the [Firebase hosting quick start
guide](https://firebase.google.com/docs/hosting/quickstart).

1.  [Sign up for a Firebase account](https://firebase.google.com).

1.  Install the Firebase command line tools.

        npm install -g firebase-tools

    The `-g` flag instructs `npm` to install the package globally so that you
    can use the `firebase` command from any directory. You may need
    to install the package with `sudo` privileges.

1.  `cd` into your project directory.

1.  Inititalize the Firebase application.

        firebase login
        firebase init

1.  Press `Space` to disable the Database feature. Leave the Hosting feature
    enabled. Press `Enter` to confirm your choices.

1.  Firebase asks you the name of your app's public directory. Enter `dist`.
    This works because when you run `gulp` to build your application, PSK
    builds everything and places it all in `dist`. So `dist` contains
    everything your application needs to run.

1.  When Firebase asks you `Configure as a single-page app 
    (rewrite all urls to /index.html)?` select `No`. 

1.  When Firebase asks `File dist/index.html already exists. Overwrite?`
    select `No`.

1.  Select which app you want to deploy to. 

1.  Run the following command to deploy.

        firebase deploy

1.  You can view your site at the URL listed in the output, or by running 
    `firebase open hosting:site`. 
