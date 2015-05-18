# iron-media-query

`iron-media-query` can be used to data bind to a CSS media query.
The `query` property is a bare CSS media query.
The `queryMatches` property is a boolean representing if the page matches that media query.

Example:

    <iron-media-query query="(min-width: 600px)" queryMatches="{{queryMatches}}"></iron-media-query>
