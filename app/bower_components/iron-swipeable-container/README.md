
<!---

This README is automatically generated from the comments in these files:
iron-swipeable-container.html

Edit those files, and our readme bot will duplicate them over here!
Edit this file, and the bot will squash your changes :)

-->

[![Build Status](https://travis-ci.org/PolymerElements/iron-swipeable-container.svg?branch=master)](https://travis-ci.org/PolymerElements/iron-swipeable-container)

_[Demo and API Docs](https://elements.polymer-project.org/elements/iron-swipeable-container)_


##&lt;iron-swipeable-container&gt;


`<iron-swipeable-container>` is a container that allows any of its nested
children (native or custom elements) to be swiped away. By default it supports
a curved or horizontal transition, but the transition duration and properties
can be customized.

Example:

    <iron-swipeable-container>
      <div>I can be swiped</div>
      <paper-card heading="Me too!"></paper-card>
    </iron-swipeable-container>

To disable swiping on individual children, you must give them the `.disable-swipe`
class. Alternatively, to disable swiping on the whole container, you can use its
`disable-swipe` attribute:

    <iron-swipeable-container>
      <div class="disable-swipe">I cannot be swiped be swiped</div>
      <paper-card heading="But I can!"></paper-card>
    </iron-swipeable-container>

    <iron-swipeable-container disable-swipe>
      <div>I cannot be swiped</div>
      <paper-card heading="Me neither :("></paper-card>
    </iron-swipeable-container>

It is a good idea to disable text selection on any of the children that you
want to be swiped:

    .swipe {
      -moz-user-select: none;
      -ms-user-select: none;
      -webkit-user-select: none;
      user-select: none;
      cursor: default;
    }


