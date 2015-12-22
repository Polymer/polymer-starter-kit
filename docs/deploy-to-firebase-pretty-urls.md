# Deploy to Firebase Hosting using Pretty URLs

Firebase Hosting is a very simple and secure way to deploy a Polymer Starter Kit site. You can sign up for a free account and deploy your application in less than 5 minutes. [Superstatic](https://github.com/firebase/superstatic) is the open-source web server that is used both by Firebase Hosting and as the local server for `gulp serve` and `gulp serve:dist`.

The instructions below are based on the [Firebase hosting quick start
guide](https://www.firebase.com/docs/hosting/quickstart.html).

1.  [Sign up for a Firebase account](https://www.firebase.com/signup/)

1.  Install the Firebase command line tools

        npm install -g firebase-tools

    The `-g` flag instructs `npm` to install the package globally so that you
    can use the `firebase` command from any directory. You may need
    to install the package with `sudo` privileges.

1.  `cd` into your project directory

1.  Create a Firebase project (if you don't have one) at [https://www.firebase.com/account](https://www.firebase.com/account).

1.  Modify the `firebase.json` file in your project directory and add a `name` property that matches your Firebase project ID (e.g. `my-app` from `my-app.firebaseio.com`).

        {"name": "my-app"}

1.  Build

        gulp

1.  Deploy

        firebase deploy

    The URL to your live site is listed in the output.

You can see a demo of Polymer Starter Kit hosted on Firebase using pretty URLs at https://polymer-starter-kit.firebaseapp.com.
