# Add page transitions with neon-animated-pages

This recipe focuses on replacing the "static" `iron-pages` component with `neon-animated-pages` in order to display slick animations when transitioning between pages.

## Update your dependencies

- First thing first, we need to replace the `iron-pages` import in `app/elements/elements.html` with a set of components from the `neon-animation` librairy, including `neon-animated-pages`:

```patch
- <link rel="import" href="../bower_components/iron-pages/iron-pages.html">
...
+
+ <!-- Neon elements -->
+ <link rel="import" href="../bower_components/neon-animation/neon-animated-pages.html">
+ <link rel="import" href="../bower_components/neon-animation/neon-animatable.html">
+ <link rel="import" href="../bower_components/neon-animation/animations/slide-from-bottom-animation.html">
+ <link rel="import" href="../bower_components/neon-animation/animations/fade-out-animation.html">
+
```
Note the last two imports are actually animations definitions. We are going to use `slide-from-bottom-animation` and `fade-out-animation` as entry and exit animations respectively. Those animations will apply for all page transitions.

If you wish to use different animations, make sure you replace those imports by the ones you need.

## Replace `iron-pages` with `neon-animated-pages`

- Next, we need to remove the `iron-pages` from `app/index.html` and replace it with `neon-animated-pages`:

```patch
- <iron-pages attr-for-selected="data-route" selected="{{route}}">
+ <neon-animated-pages attr-for-selected="data-route" selected="{{route}}" entry-animation="slide-from-bottom-animation" exit-animation="fade-out-animation">
...
- </iron-pages>
+ </neon-animated-pages>
```
This is pretty straightforward, as these elements behave similarly and share a common API, being both based on `Polymer.IronSelectableBehavior`.

- It is then necessary to replace the children `section` of our page selector with `neon-animatable` elements. You should proceed as follows for the contact section/page for example:

```patch
- <section data-route="contact">
+ <neon-animatable data-route="contact">
    <paper-material elevation="1">
      <h2 class="page-title">Contact</h2>
      <p>This is the contact section</p>
    </paper-material>
- </section>
+ </neon-animatable>
```
Until now, all the pages of our web application were embeded in `section` tags under our page selector `iron-pages`. Replacing those `section` with the convenience element `neon-animatable` is now mandatory because all children of `neon-animated-pages` are required to implement `Polymer.NeonAnimatableBehavior` in order to be animated.

## Fix the CSS

-  In `app/styles/app-theme.html`:

```patch
- section[data-route="home"] paper-material {
+ neon-animatable[data-route="home"] paper-material {
    @apply(--paper-font-body2);
  }
  
- section[data-route="home"] paper-material .subhead {
+ neon-animatable[data-route="home"] paper-material .subhead {
    @apply(--paper-font-subhead);
  }

+ neon-animated-pages {
+   height: 100%;
+ }
+ 
  paper-material {
    border-radius: 2px;
-   height: 100%;
    padding: 16px 0 16px 0;
    width: calc(98.66% - 16px);
    margin: 16px auto;
    background: white;
  }

...

  /* Tablet+ */
  @media (min-width: 601px) {
 
    #drawer.paper-drawer-panel > [drawer] {
      border-right: 1px solid rgba(0, 0, 0, 0.14);
    }
  
-   iron-pages {
+   neon-animated-pages > * {
      padding: 48px 62px;
    }

...
```

## Going further

This recipe took you through a basic integration of `neon-animated-pages` in Polymer Starter Kit with global and declarative transitions.
However, it doesn't stop there, as `neon-animated-pages` can enable your web application to:

- Have page specific transitions
- Use multiple animations during one transition
- Only animate part of your page or a specific element
- Use complex animations such as cascaded animations or shared element animations (hero animation, ripple animation)

Those features require you to extract every page of your web application in its own web-component.
Once that is done, we recommend you take a look at the following resources to learn how to make the most of the `neon-animated-pages` element:

* [Using neon-animation](https://elements.polymer-project.org/guides/using-neon-animations)
* [Polycasts - Slick web animations](https://www.youtube.com/watch?v=Lwvi1u4XXzc) from Rob Dodson
* [Polycasts - Neon-animated-pages](https://www.youtube.com/watch?v=wMhq1o0DULM) from Rob Dodson