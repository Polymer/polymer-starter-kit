# Use Polymer Starter Kit on Chrome Dev Editor

If you are using a Chromebook, one of the few IDE you can use is Chrome Dev Editor.

To use the Polymer Starter Kit you have to download the [latest release](https://github.com/PolymerElements/polymer-starter-kit/releases) in the `light` flavor (the additional tools can't be used from CDE).

After downloading the `polymer-starter0kit-light-*.zip` file unpack it in a new folder (for Example `psk-light`) you should have a directory structure like 

TODO: ADD IMAGE

Before opening the folder inside CDE, we need to move the file `bower.json` to `app/bower.json`, this way running `Bower Update` will place the updated packages in `app/bower_components`

TODO: ADD IMAGE

We can now `Open Folder...` inside CDE and start renaming the file `app/manifes.json` to `app/web-app-manifest.json`, followed by updating the link to it in the file `app/index.html`

TODO: ADD IMAGE

*This change is needed because `manifest.json` is interpreted by CDE as a Chrome App Manifest and the web app manifest is slightly different*

Open `app/routing.html` and add the following code after the last route:

```
page('*', function () {
  app.route = 'home';
});
```

For example:

```
...
    page('/contact', function () {
      app.route = 'contact';
    });
    
    page('*', function () {
      app.route = 'home';
    });

    // add #! before urls
    page({
      hashbang: true
    });
...
```


Select `app/index.html` and hit run to start the application in the browser.
