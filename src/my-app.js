/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './my-icons.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class MyApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          --app-primary-color: #4285f4;
          --app-secondary-color: black;
      
          display: block;
        }
      
        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }
      
        app-header {
          color: #fff;
          background-color: var(--app-primary-color);
        }
      
        app-header paper-icon-button {
          --paper-icon-button-ink-color: white;
        }
      
        .drawer-list {
          margin: 0 20px;
        }
      
        .drawer-list a {
          display: block;
          padding: 0 16px;
          text-decoration: none;
          color: var(--app-secondary-color);
          line-height: 40px;
        }
      
        .drawer-list a.iron-selected {
          color: black;
          font-weight: bold;
        }
      </style>
      
      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>
      
      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>
      
      <app-drawer-layout fullbleed="" narrow="{{narrow}}">
        <!-- Drawer content -->
        <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar>Menu</app-toolbar>
          <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
            <template is="dom-repeat" items="{{pages}}" filter="visibleNavItems">
              <a name="[[item.name]]" href="[[rootPath]][[item.name]]">[[item.display]]</a>
            </template>
          </iron-selector>
        </app-drawer>
      
        <!-- Main content -->
        <app-header-layout has-scrolling-region="">
      
          <app-header slot="header" condenses="" reveals="" effects="waterfall">
            <app-toolbar>
              <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
              <div main-title="">My App</div>
            </app-toolbar>
          </app-header>
      
          <iron-pages selected="[[page]]" attr-for-selected="name" role="main" id="navpages">
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      pages: {
        type: Array,
        value() {
          return [
            // Add all pages here. Make them visible in the menu by setting a display value.
            // 'name' is used internally to reference the page, but it's visible to users in the page route.
            // 'element' is the page's HTML custom element name. It's the first argument to the window.customElements.define() call in the page source.
            // 'display' is what is shown to users in the menu. If left blank or set to false, it isn't added to the menu.
            // 'role' is used internally when deciding what page to display for an undefined or bad page route.
            { name: "view1", element: "my-view1", file: "./my-view1.js", display: "View One", role: "home" },
            { name: "view2", element: "my-view2", file: "./my-view2.js", display: "View Two" },
            { name: "view3", element: "my-view3", file: "./my-view3.js", display: "View Three" },
            { name: "view404", element: "my-view404", file: "./my-view404.js", role: "err404" }
          ];
        }
      },
      routeData: Object,
      subroute: Object
    };
  }

  visibleNavItems(item) {
    if (item.display == null || item.display == false) {
      return false;
    }
    return true;
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }

  _routePageChanged(page) {
    // Show the corresponding page according to the route.
    //
    // If no page was found in the route data, page will be an empty string.
    // Show the page with "home" role in that case. And if the page doesn't exist, show page with role "err404".
    if (!page) {
      this.page = this.pages[this.pages.map(a => a.role).indexOf("home")].name;
    } else if (this.pages.map(a => a.name).indexOf(page) !== -1) {
      this.page = page;
    } else {
      this.page = this.pages[this.pages.map(a => a.role).indexOf("err404")].name;
    }

    // Close a non-persistent drawer when the page & route are changed.
    if (!this.$.drawer.persistent) {
      this.$.drawer.close();
    }
  }

  _pageChanged(page) {
    // Import the page component and add it to the 'iron-pages' element on demand.
    //
    // Note: `polymer build` doesn't like string concatenation in the import
    // statement, so break it up.

    //If this page isn't in the iron-pages.
    if (Array.from(this.$.navpages.children).map(a => a.name).indexOf(page) == -1) {

      //Grab the page definition for the correct page.
      var pagedef = this.pages[this.pages.map(a => a.name).indexOf(page)];

      //Import the page component.
      import(pagedef.file);

      //Generate and insert the page element into the iron-pages.
      var newPage = document.createElement(pagedef.element);
      newPage.name = pagedef.name;
      this.$.navpages.appendChild(newPage);
    }
  }
}

window.customElements.define('my-app', MyApp);
