# Use Polymer Starter Kit on Chrome Dev Editor

If you are using a Chromebook, one of the few IDE you can use is [Chrome Dev Editor](https://github.com/GoogleChrome/chromedeveditor).

To use the Polymer Starter Kit you have to download the [latest release](https://github.com/PolymerElements/polymer-starter-kit/releases) in the `light` flavor (the additional tools can't be used from CDE).

After downloading the `polymer-starter-kit-light-*.zip` file unpack it in a new folder (for Example `psk-light`) you should have a directory structure like

![psk-light-folder-p1](https://cloud.githubusercontent.com/assets/1431346/9451900/a73ffcf2-4ab1-11e5-8742-e0b5523ba9d5.png)

When the app first opens you'll notice, in the bottom left, that Bower is updating.

![bower updating](https://cloud.githubusercontent.com/assets/1066253/11860260/d837edae-a427-11e5-997e-117caa83bbed.png)

Wait for this process to finish before continuing (it may take a few minutes). When it is complete, you should notice that the `bower_components` directory has moved to `app/bower_components`. This is because CDE is respecting the configuration in our `.bowerrc` file. This is a good thing :)

We can now `Open Folder...` inside CDE and start renaming the file `app/manifest.json` to `app/web-app-manifest.json`, followed by updating the link to it in the file `app/index.html`

![manifest json](https://cloud.githubusercontent.com/assets/1431346/9452182/27e41478-4ab3-11e5-8e40-d7c0f1249feb.png)


*This change is needed because `manifest.json` is interpreted by CDE as a [Chrome Apps Manifest](https://developer.chrome.com/extensions/manifest) and the [web app manifest](https://w3c.github.io/manifest/) is slightly different*

Open `app/elements/routing.html` and add the following code after the last route:

```javascript
page('*', function () {
  app.route = 'home';
});
```

After the change, the code will look like the following:

```javascript
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


Select `app/index.html` and hit run (or press CTRL+R) to see the application running in the browser.
