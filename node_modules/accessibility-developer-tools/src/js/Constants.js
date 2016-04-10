// Copyright 2012 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('axs.constants');
goog.provide('axs.constants.AuditResult');
goog.provide('axs.constants.Severity');

/** @type {Object.<string, Object>} */
axs.constants.ARIA_ROLES = {
    "alert": {
        "namefrom": [ "author" ],
        "parent": [ "region" ]
    },
    "alertdialog": {
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "alert", "dialog" ]
    },
    "application": {
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "landmark" ]
    },
    "article": {
        "namefrom": [ "author" ],
        "parent": [ "document", "region" ]
    },
    "banner": {
        "namefrom": [ "author" ],
        "parent": [ "landmark" ]
    },
    "button": {
        "childpresentational": true,
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "command" ],
        "properties": [ "aria-expanded", "aria-pressed" ]
    },
    "checkbox": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "input" ],
        "requiredProperties": [ "aria-checked" ],
        "properties": [ "aria-checked" ]
    },
    "columnheader": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "gridcell", "sectionhead", "widget" ],
        "properties": [ "aria-sort" ],
        "scope": [ "row" ]
    },
    "combobox": {
        "mustcontain": [ "listbox", "textbox" ],
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "select" ],
        "requiredProperties": [ "aria-expanded" ],
        "properties": [ "aria-expanded", "aria-autocomplete", "aria-required" ]
    },
    "command": {
        "abstract": true,
        "namefrom": [ "author" ],
        "parent": [ "widget" ]
    },
    "complementary": {
        "namefrom": [ "author" ],
        "parent": [ "landmark" ]
    },
    "composite": {
        "abstract": true,
        "childpresentational": false,
        "namefrom": [ "author" ],
        "parent": [ "widget" ],
        "properties": [ "aria-activedescendant" ]
    },
    "contentinfo": {
        "namefrom": [ "author" ],
        "parent": [ "landmark" ]
    },
    "definition": {
        "namefrom": [ "author" ],
        "parent": [ "section" ]
    },
    "dialog": {
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "window" ]
    },
    "directory": {
        "namefrom": [ "contents", "author" ],
        "parent": [ "list" ]
    },
    "document": {
        "namefrom": [ " author" ],
        "namerequired": true,
        "parent": [ "structure" ],
        "properties": [ "aria-expanded" ]
    },
    "form": {
        "namefrom": [ "author" ],
        "parent": [ "landmark" ]
    },
    "grid": {
        "mustcontain": [ "row", "rowgroup" ],
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "composite", "region" ],
        "properties": [ "aria-level", "aria-multiselectable", "aria-readonly" ]
    },
    "gridcell": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "section", "widget" ],
        "properties": [ "aria-readonly", "aria-required", "aria-selected" ],
        "scope": [ "row" ]
    },
    "group": {
        "namefrom": [ " author" ],
        "parent": [ "section" ],
        "properties": [ "aria-activedescendant" ]
    },
    "heading": {
        "namerequired": true,
        "parent": [ "sectionhead" ],
        "properties": [ "aria-level" ]
    },
    "img": {
        "childpresentational": true,
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "section" ]
    },
    "input": {
        "abstract": true,
        "namefrom": [ "author" ],
        "parent": [ "widget" ]
    },
    "landmark": {
        "abstract": true,
        "namefrom": [ "contents", "author" ],
        "namerequired": false,
        "parent": [ "region" ]
    },
    "link": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "command" ],
        "properties": [ "aria-expanded" ]
    },
    "list": {
        "mustcontain": [ "group", "listitem" ],
        "namefrom": [ "author" ],
        "parent": [ "region" ]
    },
    "listbox": {
        "mustcontain": [ "option" ],
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "list", "select" ],
        "properties": [ "aria-multiselectable", "aria-required" ]
    },
    "listitem": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "section" ],
        "properties": [ "aria-level", "aria-posinset", "aria-setsize" ],
        "scope": [ "list" ]
    },
    "log": {
        "namefrom": [ " author" ],
        "namerequired": true,
        "parent": [ "region" ]
    },
    "main": {
        "namefrom": [ "author" ],
        "parent": [ "landmark" ]
    },
    "marquee": {
        "namerequired": true,
        "parent": [ "section" ]
    },
    "math": {
        "childpresentational": true,
        "namefrom": [ "author" ],
        "parent": [ "section" ]
    },
    "menu": {
        "mustcontain": [
            "group",
            "menuitemradio",
            "menuitem",
            "menuitemcheckbox"
        ],
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "list", "select" ]
    },
    "menubar": {
        "namefrom": [ "author" ],
        "parent": [ "menu" ]
    },
    "menuitem": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "command" ],
        "scope": [ "menu", "menubar" ]
    },
    "menuitemcheckbox": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "checkbox", "menuitem" ],
        "scope": [ "menu", "menubar" ]
    },
    "menuitemradio": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "menuitemcheckbox", "radio" ],
        "scope": [ "menu", "menubar" ]
    },
    "navigation": {
        "namefrom": [ "author" ],
        "parent": [ "landmark" ]
    },
    "note": {
        "namefrom": [ "author" ],
        "parent": [ "section" ]
    },
    "option": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "input" ],
        "properties": [
            "aria-checked",
            "aria-posinset",
            "aria-selected",
            "aria-setsize"
        ]
    },
    "presentation": {
        "parent": [ "structure" ]
    },
    "progressbar": {
        "childpresentational": true,
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "range" ]
    },
    "radio": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "checkbox", "option" ]
    },
    "radiogroup": {
        "mustcontain": [ "radio" ],
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "select" ],
        "properties": [ "aria-required" ]
    },
    "range": {
        "abstract": true,
        "namefrom": [ "author" ],
        "parent": [ "widget" ],
        "properties": [
            "aria-valuemax",
            "aria-valuemin",
            "aria-valuenow",
            "aria-valuetext"
        ]
    },
    "region": {
        "namefrom": [ " author" ],
        "parent": [ "section" ]
    },
    "roletype": {
        "abstract": true,
        "properties": [
            "aria-atomic",
            "aria-busy",
            "aria-controls",
            "aria-describedby",
            "aria-disabled",
            "aria-dropeffect",
            "aria-flowto",
            "aria-grabbed",
            "aria-haspopup",
            "aria-hidden",
            "aria-invalid",
            "aria-label",
            "aria-labelledby",
            "aria-live",
            "aria-owns",
            "aria-relevant"
        ]
    },
    "row": {
        "mustcontain": [ "columnheader", "gridcell", "rowheader" ],
        "namefrom": [ "contents", "author" ],
        "parent": [ "group", "widget" ],
        "properties": [ "aria-level", "aria-selected" ],
        "scope": [ "grid", "rowgroup", "treegrid" ]
    },
    "rowgroup": {
        "mustcontain": [ "row" ],
        "namefrom": [ "contents", "author" ],
        "parent": [ "group" ],
        "scope": [ "grid" ]
    },
    "rowheader": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "gridcell", "sectionhead", "widget" ],
        "properties": [ "aria-sort" ],
        "scope": [ "row" ]
    },
    "search": {
        "namefrom": [ "author" ],
        "parent": [ "landmark" ]
    },
    "section": {
        "abstract": true,
        "namefrom": [ "contents", "author" ],
        "parent": [ "structure" ],
        "properties": [ "aria-expanded" ]
    },
    "sectionhead": {
        "abstract": true,
        "namefrom": [ "contents", "author" ],
        "parent": [ "structure" ],
        "properties": [ "aria-expanded" ]
    },
    "select": {
        "abstract": true,
        "namefrom": [ "author" ],
        "parent": [ "composite", "group", "input" ]
    },
    "separator": {
        "childpresentational": true,
        "namefrom": [ "author" ],
        "parent": [ "structure" ],
        "properties": [ "aria-expanded", "aria-orientation" ]
    },
    "scrollbar": {
        "childpresentational": true,
        "namefrom": [ "author" ],
        "namerequired": false,
        "parent": [ "input", "range" ],
        "requiredProperties": [
            "aria-controls",
            "aria-orientation",
            "aria-valuemax",
            "aria-valuemin",
            "aria-valuenow"
        ],
        "properties": [
            "aria-controls",
            "aria-orientation",
            "aria-valuemax",
            "aria-valuemin",
            "aria-valuenow"
        ]
    },
    "slider": {
        "childpresentational": true,
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "input", "range" ],
        "requiredProperties": [ "aria-valuemax", "aria-valuemin", "aria-valuenow" ],
        "properties": [
            "aria-valuemax",
            "aria-valuemin",
            "aria-valuenow",
            "aria-orientation"
        ]
    },
    "spinbutton": {
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "input", "range" ],
        "requiredProperties": [ "aria-valuemax", "aria-valuemin", "aria-valuenow" ],
        "properties": [
            "aria-valuemax",
            "aria-valuemin",
            "aria-valuenow",
            "aria-required"
        ]
    },
    "status": {
        "parent": [ "region" ]
    },
    "structure": {
        "abstract": true,
        "parent": [ "roletype" ]
    },
    "tab": {
        "namefrom": [ "contents", "author" ],
        "parent": [ "sectionhead", "widget" ],
        "properties": [ "aria-selected" ],
        "scope": [ "tablist" ]
    },
    "tablist": {
        "mustcontain": [ "tab" ],
        "namefrom": [ "author" ],
        "parent": [ "composite", "directory" ],
        "properties": [ "aria-level" ]
    },
    "tabpanel": {
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "region" ]
    },
    "textbox": {
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "input" ],
        "properties": [
            "aria-activedescendant",
            "aria-autocomplete",
            "aria-multiline",
            "aria-readonly",
            "aria-required"
        ]
    },
    "timer": {
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "status" ]
    },
    "toolbar": {
        "namefrom": [ "author" ],
        "parent": [ "group" ]
    },
    "tooltip": {
        "namerequired": true,
        "parent": [ "section" ]
    },
    "tree": {
        "mustcontain": [ "group", "treeitem" ],
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "select" ],
        "properties": [ "aria-multiselectable", "aria-required" ]
    },
    "treegrid": {
        "mustcontain": [ "row" ],
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "grid", "tree" ]
    },
    "treeitem": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "listitem", "option" ],
        "scope": [ "group", "tree" ]
    },
    "widget": {
        "abstract": true,
        "parent": [ "roletype" ]
    },
    "window": {
        "abstract": true,
        "namefrom": [ " author" ],
        "parent": [ "roletype" ],
        "properties": [ "aria-expanded" ]
    }
};

axs.constants.WIDGET_ROLES = {};

/**
 * Squashes the parent hierarchy on to role object.
 * @param {Object} role
 * @param {Object} set
 * @private
 */
axs.constants.addAllParentRolesToSet_ = function(role, set) {
  if (!role['parent'])
      return;
  var parents = role['parent'];
  for (var j = 0; j < parents.length; j++) {
    var parentRoleName = parents[j];
    set[parentRoleName] = true;
    axs.constants.addAllParentRolesToSet_(
        axs.constants.ARIA_ROLES[parentRoleName], set);
  }
};

/**
 * Adds all properties and requiredProperties from parent hierarchy.
 * @param {Object} role
 * @param {string} propertiesName
 * @param {Object} propertiesSet
 * @private
 */
axs.constants.addAllPropertiesToSet_ = function(role, propertiesName,
    propertiesSet) {
  var properties = role[propertiesName];
  if (properties) {
    for (var i = 0; i < properties.length; i++)
      propertiesSet[properties[i]] = true;
  }
  if (role['parent']) {
    var parents = role['parent'];
    for (var j = 0; j < parents.length; j++) {
      var parentRoleName = parents[j];
      axs.constants.addAllPropertiesToSet_(
          axs.constants.ARIA_ROLES[parentRoleName], propertiesName,
          propertiesSet);
    }
  }
};

// TODO make a AriaRole object etc.
for (var roleName in axs.constants.ARIA_ROLES) {
    var role = axs.constants.ARIA_ROLES[roleName];

    var propertiesSet = {};
    axs.constants.addAllPropertiesToSet_(role, 'properties', propertiesSet);
    role['propertiesSet'] = propertiesSet;

    var requiredPropertiesSet = {};
    axs.constants.addAllPropertiesToSet_(role, 'requiredProperties', requiredPropertiesSet);
    role['requiredPropertiesSet'] = requiredPropertiesSet;
    var parentRolesSet = {};
    axs.constants.addAllParentRolesToSet_(role, parentRolesSet);
    role['allParentRolesSet'] = parentRolesSet;
    if ('widget' in parentRolesSet)
        axs.constants.WIDGET_ROLES[roleName] = role;
}

// BEGIN ARIA_PROPERTIES_AUTOGENERATED
/** @type {Object.<string, Object>} */
axs.constants.ARIA_PROPERTIES = {
    "activedescendant": {
        "type": "property",
        "valueType": "idref"
    },
    "atomic": {
        "defaultValue": "false",
        "type": "property",
        "valueType": "boolean"
    },
    "autocomplete": {
        "defaultValue": "none",
        "type": "property",
        "valueType": "token",
        "values": [
            "inline",
            "list",
            "both",
            "none"
        ]
    },
    "busy": {
        "defaultValue": "false",
        "type": "state",
        "valueType": "boolean"
    },
    "checked": {
        "defaultValue": "undefined",
        "type": "state",
        "valueType": "token",
        "values": [
            "true",
            "false",
            "mixed",
            "undefined"
        ]
    },
    "controls": {
        "type": "property",
        "valueType": "idref_list"
    },
    "describedby": {
        "type": "property",
        "valueType": "idref_list"
    },
    "disabled": {
        "defaultValue": "false",
        "type": "state",
        "valueType": "boolean"
    },
    "dropeffect": {
        "defaultValue": "none",
        "type": "property",
        "valueType": "token_list",
        "values": [
            "copy",
            "move",
            "link",
            "execute",
            "popup",
            "none"
        ]
    },
    "expanded": {
        "defaultValue": "undefined",
        "type": "state",
        "valueType": "token",
        "values": [
            "true",
            "false",
            "undefined"
        ]
    },
    "flowto": {
        "type": "property",
        "valueType": "idref_list"
    },
    "grabbed": {
        "defaultValue": "undefined",
        "type": "state",
        "valueType": "token",
        "values": [
            "true",
            "false",
            "undefined"
        ]
    },
    "haspopup": {
        "defaultValue": "false",
        "type": "property",
        "valueType": "boolean"
    },
    "hidden": {
        "defaultValue": "false",
        "type": "state",
        "valueType": "boolean"
    },
    "invalid": {
        "defaultValue": "false",
        "type": "state",
        "valueType": "token",
        "values": [
            "grammar",
            "false",
            "spelling",
            "true"
        ]
    },
    "label": {
        "type": "property",
        "valueType": "string"
    },
    "labelledby": {
        "type": "property",
        "valueType": "idref_list"
    },
    "level": {
        "type": "property",
        "valueType": "integer"
    },
    "live": {
        "defaultValue": "off",
        "type": "property",
        "valueType": "token",
        "values": [
            "off",
            "polite",
            "assertive"
        ]
    },
    "multiline": {
        "defaultValue": "false",
        "type": "property",
        "valueType": "boolean"
    },
    "multiselectable": {
        "defaultValue": "false",
        "type": "property",
        "valueType": "boolean"
    },
    "orientation": {
        "defaultValue": "vertical",
        "type": "property",
        "valueType": "token",
        "values": [
            "horizontal",
            "vertical"
        ]
    },
    "owns": {
        "type": "property",
        "valueType": "idref_list"
    },
    "posinset": {
        "type": "property",
        "valueType": "integer"
    },
    "pressed": {
        "defaultValue": "undefined",
        "type": "state",
        "valueType": "token",
        "values": [
            "true",
            "false",
            "mixed",
            "undefined"
        ]
    },
    "readonly": {
        "defaultValue": "false",
        "type": "property",
        "valueType": "boolean"
    },
    "relevant": {
        "defaultValue": "additions text",
        "type": "property",
        "valueType": "token_list",
        "values": [
            "additions",
            "removals",
            "text",
            "all"
        ]
    },
    "required": {
        "defaultValue": "false",
        "type": "property",
        "valueType": "boolean"
    },
    "selected": {
        "defaultValue": "undefined",
        "type": "state",
        "valueType": "token",
        "values": [
            "true",
            "false",
            "undefined"
        ]
    },
    "setsize": {
        "type": "property",
        "valueType": "integer"
    },
    "sort": {
        "defaultValue": "none",
        "type": "property",
        "valueType": "token",
        "values": [
            "ascending",
            "descending",
            "none",
            "other"
        ]
    },
    "valuemax": {
        "type": "property",
        "valueType": "decimal"
    },
    "valuemin": {
        "type": "property",
        "valueType": "decimal"
    },
    "valuenow": {
        "type": "property",
        "valueType": "decimal"
    },
    "valuetext": {
        "type": "property",
        "valueType": "string"
    }
};
// END ARIA_PROPERTIES_AUTOGENERATED

(function() {
// pull values lists into sets
for (var propertyName in axs.constants.ARIA_PROPERTIES) {
    var propertyDetails = axs.constants.ARIA_PROPERTIES[propertyName];
    if (!propertyDetails.values)
        continue;
    var valuesSet = {};
    for (var i = 0; i < propertyDetails.values.length; i++)
        valuesSet[propertyDetails.values[i]] = true;
    propertyDetails.valuesSet = valuesSet;
}
})();

/**
 * All of the states and properties which apply globally.
 * @type {Object<!string, !boolean>}
 */
axs.constants.GLOBAL_PROPERTIES = axs.constants.ARIA_ROLES['roletype'].propertiesSet;

/**
 * A constant indicating no role name.
 * @type {string}
 */
axs.constants.NO_ROLE_NAME = ' ';

/**
 * A mapping from ARIA role names to their message ids.
 * Copied from ChromeVox:
 * http://code.google.com/p/google-axs-chrome/source/browse/trunk/chromevox/common/aria_util.js
 * @type {Object.<string, string>}
 */
axs.constants.WIDGET_ROLE_TO_NAME = {
  'alert' : 'aria_role_alert',
  'alertdialog' : 'aria_role_alertdialog',
  'button' : 'aria_role_button',
  'checkbox' : 'aria_role_checkbox',
  'columnheader' : 'aria_role_columnheader',
  'combobox' : 'aria_role_combobox',
  'dialog' : 'aria_role_dialog',
  'grid' : 'aria_role_grid',
  'gridcell' : 'aria_role_gridcell',
  'link' : 'aria_role_link',
  'listbox' : 'aria_role_listbox',
  'log' : 'aria_role_log',
  'marquee' : 'aria_role_marquee',
  'menu' : 'aria_role_menu',
  'menubar' : 'aria_role_menubar',
  'menuitem' : 'aria_role_menuitem',
  'menuitemcheckbox' : 'aria_role_menuitemcheckbox',
  'menuitemradio' : 'aria_role_menuitemradio',
  'option' : axs.constants.NO_ROLE_NAME,
  'progressbar' : 'aria_role_progressbar',
  'radio' : 'aria_role_radio',
  'radiogroup' : 'aria_role_radiogroup',
  'rowheader' : 'aria_role_rowheader',
  'scrollbar' : 'aria_role_scrollbar',
  'slider' : 'aria_role_slider',
  'spinbutton' : 'aria_role_spinbutton',
  'status' : 'aria_role_status',
  'tab' : 'aria_role_tab',
  'tabpanel' : 'aria_role_tabpanel',
  'textbox' : 'aria_role_textbox',
  'timer' : 'aria_role_timer',
  'toolbar' : 'aria_role_toolbar',
  'tooltip' : 'aria_role_tooltip',
  'treeitem' : 'aria_role_treeitem'
};


/**
 * @type {Object.<string, string>}
 * Copied from ChromeVox:
 * http://code.google.com/p/google-axs-chrome/source/browse/trunk/chromevox/common/aria_util.js
 */
axs.constants.STRUCTURE_ROLE_TO_NAME = {
  'article' : 'aria_role_article',
  'application' : 'aria_role_application',
  'banner' : 'aria_role_banner',
  'columnheader' : 'aria_role_columnheader',
  'complementary' : 'aria_role_complementary',
  'contentinfo' : 'aria_role_contentinfo',
  'definition' : 'aria_role_definition',
  'directory' : 'aria_role_directory',
  'document' : 'aria_role_document',
  'form' : 'aria_role_form',
  'group' : 'aria_role_group',
  'heading' : 'aria_role_heading',
  'img' : 'aria_role_img',
  'list' : 'aria_role_list',
  'listitem' : 'aria_role_listitem',
  'main' : 'aria_role_main',
  'math' : 'aria_role_math',
  'navigation' : 'aria_role_navigation',
  'note' : 'aria_role_note',
  'region' : 'aria_role_region',
  'rowheader' : 'aria_role_rowheader',
  'search' : 'aria_role_search',
  'separator' : 'aria_role_separator'
};


/**
 * @type {Array.<Object>}
 * Copied from ChromeVox:
 * http://code.google.com/p/google-axs-chrome/source/browse/trunk/chromevox/common/aria_util.js
 */
axs.constants.ATTRIBUTE_VALUE_TO_STATUS = [
  { name: 'aria-autocomplete', values:
      {'inline' : 'aria_autocomplete_inline',
       'list' : 'aria_autocomplete_list',
       'both' : 'aria_autocomplete_both'} },
  { name: 'aria-checked', values:
      {'true' : 'aria_checked_true',
       'false' : 'aria_checked_false',
       'mixed' : 'aria_checked_mixed'} },
  { name: 'aria-disabled', values:
      {'true' : 'aria_disabled_true'} },
  { name: 'aria-expanded', values:
      {'true' : 'aria_expanded_true',
       'false' : 'aria_expanded_false'} },
  { name: 'aria-invalid', values:
      {'true' : 'aria_invalid_true',
       'grammar' : 'aria_invalid_grammar',
       'spelling' : 'aria_invalid_spelling'} },
  { name: 'aria-multiline', values:
      {'true' : 'aria_multiline_true'} },
  { name: 'aria-multiselectable', values:
      {'true' : 'aria_multiselectable_true'} },
  { name: 'aria-pressed', values:
      {'true' : 'aria_pressed_true',
       'false' : 'aria_pressed_false',
       'mixed' : 'aria_pressed_mixed'} },
  { name: 'aria-readonly', values:
      {'true' : 'aria_readonly_true'} },
  { name: 'aria-required', values:
      {'true' : 'aria_required_true'} },
  { name: 'aria-selected', values:
      {'true' : 'aria_selected_true',
       'false' : 'aria_selected_false'} }
];

/**
 * Copied from ChromeVox:
 * http://code.google.com/p/google-axs-chrome/source/browse/trunk/chromevox/common/dom_util.js
 * @type {Object}
 */
axs.constants.INPUT_TYPE_TO_INFORMATION_TABLE_MSG = {
  'button' : 'input_type_button',
  'checkbox' : 'input_type_checkbox',
  'color' : 'input_type_color',
  'datetime' : 'input_type_datetime',
  'datetime-local' : 'input_type_datetime_local',
  'date' : 'input_type_date',
  'email' : 'input_type_email',
  'file' : 'input_type_file',
  'image' : 'input_type_image',
  'month' : 'input_type_month',
  'number' : 'input_type_number',
  'password' : 'input_type_password',
  'radio' : 'input_type_radio',
  'range' : 'input_type_range',
  'reset' : 'input_type_reset',
  'search' : 'input_type_search',
  'submit' : 'input_type_submit',
  'tel' : 'input_type_tel',
  'text' : 'input_type_text',
  'url' : 'input_type_url',
  'week' : 'input_type_week'
};


/**
 * Copied from ChromeVox:
 * http://code.google.com/p/google-axs-chrome/source/browse/trunk/chromevox/common/dom_util.js
 * @type {Object}
 */
axs.constants.TAG_TO_INFORMATION_TABLE_VERBOSE_MSG = {
  'A' : 'tag_link',
  'BUTTON' : 'tag_button',
  'H1' : 'tag_h1',
  'H2' : 'tag_h2',
  'H3' : 'tag_h3',
  'H4' : 'tag_h4',
  'H5' : 'tag_h5',
  'H6' : 'tag_h6',
  'LI' : 'tag_li',
  'OL' : 'tag_ol',
  'SELECT' : 'tag_select',
  'TEXTAREA' : 'tag_textarea',
  'UL' : 'tag_ul',
  'SECTION' : 'tag_section',
  'NAV' : 'tag_nav',
  'ARTICLE' : 'tag_article',
  'ASIDE' : 'tag_aside',
  'HGROUP' : 'tag_hgroup',
  'HEADER' : 'tag_header',
  'FOOTER' : 'tag_footer',
  'TIME' : 'tag_time',
  'MARK' : 'tag_mark'
};

/**
 * Copied from ChromeVox:
 * http://code.google.com/p/google-axs-chrome/source/browse/trunk/chromevox/common/dom_util.js
 * @type {Object}
 */
axs.constants.TAG_TO_INFORMATION_TABLE_BRIEF_MSG = {
  'BUTTON' : 'tag_button',
  'SELECT' : 'tag_select',
  'TEXTAREA' : 'tag_textarea'
};

axs.constants.MIXED_VALUES = {
    "true": true,
    "false": true,
    "mixed": true
};

/** @enum {string} */
axs.constants.Severity = {
    INFO: 'Info',
    WARNING: 'Warning',
    SEVERE: 'Severe'
};

/** @enum {string} */
axs.constants.AuditResult = {
    PASS: 'PASS',
    FAIL: 'FAIL',
    NA: 'NA'
};

/** @enum {boolean} */
axs.constants.InlineElements = {
    // fontstyle
    'TT': true,
    'I': true,
    'B': true,
    'BIG': true,
    'SMALL': true,

    // phrase
    'EM': true,
    'STRONG': true,
    'DFN': true,
    'CODE': true,
    'SAMP': true,
    'KBD': true,
    'VAR': true,
    'CITE': true,
    'ABBR': true,
    'ACRONYM': true,

    // special
    'A': true,
    'IMG': true,
    'OBJECT': true,
    'BR': true,
    'SCRIPT': true,
    'MAP': true,
    'Q': true,
    'SUB': true,
    'SUP': true,
    'SPAN': true,
    'BDO': true,

    // formctrl
    'INPUT': true,
    'SELECT': true,
    'TEXTAREA': true,
    'LABEL': true,
    'BUTTON': true
 };

 /** @enum {boolean} */
axs.constants.NATIVELY_DISABLEABLE = {
    // W3C and WHATWG https://html.spec.whatwg.org/#enabling-and-disabling-form-controls:-the-disabled-attribute
    'BUTTON': true,
    'INPUT': true,
    'SELECT': true,
    'TEXTAREA': true,
    'FIELDSET': true,

    // W3C http://www.w3.org/TR/html5/disabled-elements.html#disabled-elements
    'OPTGROUP': true,
    'OPTION': true
};

/**
 * Maps ARIA attributes to their exactly equivalent HTML attributes.
 * @type {Object.<string, string>}
 */
axs.constants.ARIA_TO_HTML_ATTRIBUTE = {
  'aria-checked' : 'checked',
  'aria-disabled' : 'disabled',
  'aria-hidden' : 'hidden',
  'aria-expanded' : 'open',
  'aria-valuemax' : 'max',
  'aria-valuemin' : 'min',
  'aria-readonly' : 'readonly',
  'aria-required' : 'required',
  'aria-selected' : 'selected',
  'aria-valuenow' : 'value'
};

/**
 * Holds information about implicit ARIA semantics for a given HTML element type.
 * This object has the following properties:
 * <ul>
 * <li>`role` will contain the implicit role if it exists, otherwise empty string.</li>
 * <li>`allowed` contains the roles that can reasonably be applied to this element.
 *    Note: A tag that can take any role is signified by a '*' wildcard in the array. It is not
 *    an error if the array contains other roles but currently this has no meaning. In future it may
 *    be used to indicate recommended roles.
 * </li>
 * <li>`selector` is present if this is a 'subclass' of the base HTML element, i.e. its semantics are
 *    modified by context or attributes. It can be used with the selectors API to find and/or match
 *    elements.
 * </li>
 * <li>`reserved` will be true if this is a semantically strong element that you may not modify with any
 *    ARIA attributes, including role or global attributes.
 * </li>
 * </ul>
 *
 * @typedef {{ role: string,
 *             allowed: Array.<string>,
 *             selector: string,
 *             reserved:  boolean }}
 */
axs.constants.HtmlInfo;
/**
 * A lookup table which maps uppercase tagName to information about implicit ARIA semantics.
 * This table is based on the document: http://w3c.github.io/aria-in-html/
 * It is not complete and never can be. Complex scenarios require specific handling not provided here.
 * Any element not listed here:
 *    - has no implicit role
 *    - can take any role
 *    e.g. em,strong,small,s,cite,q,dfn,abbr,time,code,var,samp,kbd,sub and sup,i,b,u,mark ,ruby,rt,rp,bdi,bdo,br,wbr
 *
 * Where there is any ambiguity this table will endeavor to provide for the most broad case (to avoid
 *    false failures in conformance checking).
 *
 * For example 'table' can take any role however in practice it should only be given the role 'grid' when
 *    being used as a data grid or 'presentation' when used for layout. This lookup ignores these nuances and
 *    allows all roles.
 *
 * @type {Object.<string, Array.<axs.constants.HtmlInfo>>}
 */
axs.constants.TAG_TO_IMPLICIT_SEMANTIC_INFO = {
    'A': [{
        role: 'link',
        allowed: [
        'button',
        'checkbox',
        'menuitem',
        'menuitemcheckbox',
        'menuitemradio',
        'tab',
        'treeitem'],
        selector: 'a[href]'
    }],
    'ADDRESS': [{
        role: '',
        allowed: [
        'contentinfo',
        'presentation']
    }],
    'AREA': [{
        role: 'link',
        selector: 'area[href]'
    }],
    'ARTICLE': [{
        role: 'article',
        allowed: [
        'presentation',
        'article',
        'document',
        'application',
        'main']
    }],
    'ASIDE': [{
        role: 'complementary',
        allowed: [
        'note',
        'complementary',
        'search',
        'presentation']
    }],
    'AUDIO': [{
        role: '',
        allowed: ['application', 'presentation']
    }],
    'BASE': [{
        role: '',
        reserved: true
    }],
    'BODY': [{
        role: 'document',
        allowed: ['presentation']
    }],
    'BUTTON': [{
        role: 'button',
        allowed: [
        'link',
        'menuitem',
        'menuitemcheckbox',
        'menuitemradio',
        'radio'],
        selector: 'button:not([aria-pressed]):not([type="menu"])'
    }, {
        role: 'button',
        allowed: ['button'],
        selector: 'button[aria-pressed]'
    }, {
        role: 'button',
        attributes: {
            'aria-haspopup': true
        },
        allowed: [
        'link',
        'menuitem',
        'menuitemcheckbox',
        'menuitemradio',
        'radio'],
        selector: 'button[type="menu"]'
    }],
    'CAPTION': [{
        role: '',
        allowed: ['presentation']
    }],
    'COL': [{
        role: '',
        reserved: true
    }],
    'COLGROUP': [{
        role: '',
        reserved: true
    }],
    'DATALIST': [{
        role: 'listbox',
        attributes: {
            'aria-multiselectable': false
        },
        allowed: ['presentation']
    }],
    'DEL': [{
        role: '',
        allowed: ['*']
    }],
    'DD': [{
        role: '',
        allowed: ['presentation']
    }],
    'DT': [{
        role: '',
        allowed: ['presentation']
    }],
    'DETAILS': [{
        role: 'group',
        allowed: [
        'group',
        'presentation']
    }],
    'DIALOG': [{  // updated 'allowed' from: http://www.w3.org/html/wg/drafts/html/master/interactive-elements.html#the-dialog-element
        role: 'dialog',
        allowed: ['dialog', 'alert', 'alertdialog', 'application', 'log', 'marquee', 'status'],
        selector: 'dialog[open]'
    }, {
        role: 'dialog',
        attributes: {
            'aria-hidden': true
        },
        allowed: ['dialog', 'alert', 'alertdialog', 'application', 'log', 'marquee', 'status'],
        selector: 'dialog:not([open])'
    }],
    'DIV': [{
        role: '',
        allowed: ['*']
    }],
    'DL': [{
        role: 'list',
        allowed: ['presentation']
    }],
    'EMBED': [{
        role: '',
        allowed: [
        'application',
        'document',
        'img',
        'presentation']
    }],
    'FIGURE': [{
        role: '',
        allowed: ['*']
    }],
    'FOOTER': [{
        role: '',
        allowed: ['contentinfo', 'presentation']
    }],
    'FORM': [{
        role: 'form',
        allowed: ['presentation']
    }],
    'P': [{
        role: '',
        allowed: ['*']
    }],
    'PRE': [{
        role: '',
        allowed: ['*']
    }],
    'BLOCKQUOTE': [{
        role: '',
        allowed: ['*']
    }],
    H1: [{
        role: 'heading'
    }],
    H2: [{
        role: 'heading'
    }],
    H3: [{
        role: 'heading'
    }],
    H4: [{
        role: 'heading'
    }],
    H5: [{
        role: 'heading'
    }],
    H6: [{
        role: 'heading'
    }],
    'HEAD': [{
        role: '',
        reserved: true
    }],
    'HEADER': [{
        role: '',
        allowed: [
        'banner',
        'presentation']
    }],
    'HR': [{
        role: 'separator',
        allowed: ['presentation']
    }],
    'HTML': [{
        role: '',
        reserved: true
    }],
    'IFRAME': [{
        role: '',
        allowed: [
        'application',
        'document',
        'img',
        'presentation'],
        selector: 'iframe:not([seamless])'
    }, {
        role: '',
        allowed: [
        'application',
        'document',
        'img',
        'presentation',
        'group'],
        selector: 'iframe[seamless]'
    }],
    'IMG': [{
        role: 'presentation',
        reserved: true,
        selector: 'img[alt=""]'
    }, {
        role: 'img',
        allowed: ['*'],
        selector: 'img[alt]:not([alt=""])'
    }],
    'INPUT': [{
        role: 'button',
        allowed: [
        'link',
        'menuitem',
        'menuitemcheckbox',
        'menuitemradio',
        'radio'],
        selector: 'input[type="button"]:not([aria-pressed])'
    }, {
        role: 'button',
        allowed: ['button'],
        selector: 'input[type="button"][aria-pressed]'
    }, {
        role: 'checkbox',
        allowed: ['checkbox'],
        selector: 'input[type="checkbox"]'
    }, {
        role: '',
        selector: 'input[type="color"]'
    }, {
        role: '',
        selector: 'input[type="date"]'
    }, {
        role: '',
        selector: 'input[type="datetime"]'
    }, {
        role: 'textbox',
        selector: 'input[type="email"]:not([list])'
    }, {
        role: '',
        selector: 'input[type="file"]'
    }, {
        role: '',
        reserved: true,
        selector: 'input[type="hidden"]'
    }, {
        role: 'button',
        allowed: ['button'],
        selector: 'input[type="image"][aria-pressed]'
    }, {
        role: 'button',
        allowed: [
        'link',
        'menuitem',
        'menuitemcheckbox',
        'menuitemradio',
        'radio'],
        selector: 'input[type="image"]:not([aria-pressed])'
    }, {
        role: '',
        selector: 'input[type="month"]'
    }, {
        role: '',
        selector: 'input[type="number"]'
    }, {
        role: 'textbox',
        selector: 'input[type="password"]'
    }, {
        role: 'radio',
        allowed: ['menuitemradio'],
        selector: 'input[type="radio"]'
    }, {
        role: 'slider',
        selector: 'input[type="range"]'
    }, {
        role: 'button',
        selector: 'input[type="reset"]'
    }, {
        role: 'combobox',  // aria-owns is set to the same value as the list attribute
        selector: 'input[type="search"][list]'
    }, {
        role: 'textbox',
        selector: 'input[type="search"]:not([list])'
    }, {
        role: 'button',
        selector: 'input[type="submit"]'
    }, {
        role: 'combobox',  // aria-owns is set to the same value as the list attribute
        selector: 'input[type="tel"][list]'
    }, {
        role: 'textbox',
        selector: 'input[type="tel"]:not([list])'
    }, {
        role: 'combobox',  // aria-owns is set to the same value as the list attribute
        selector: 'input[type="text"][list]'
    }, {
        role: 'textbox',
        selector: 'input[type="text"]:not([list])'
    }, {
        role: 'textbox',
        selector: 'input:not([type])'
    }, {
        role: '',
        selector: 'input[type="time"]'
    }, {
        role: 'combobox',  // aria-owns is set to the same value as the list attribute
        selector: 'input[type="url"][list]'
    }, {
        role: 'textbox',
        selector: 'input[type="url"]:not([list])'
    }, {
        role: '',
        selector: 'input[type="week"]'
    }],
    'INS': [{
        role: '',
        allowed: ['*']
    }],
    'KEYGEN': [{
        role: ''
    }],
    'LABEL': [{
        role: '',
        allowed: ['presentation']
    }],
    'LI': [{
        role: 'listitem',
        allowed: [
        'menuitem',
        'menuitemcheckbox',
        'menuitemradio',
        'option',
        'tab',
        'treeitem',
        'presentation'],
        selector: 'ol:not([role="presentation"])>li, ul:not([role="presentation"])>li'
    }, {
        role: 'listitem',
        allowed: [
        'listitem',
        'menuitem',
        'menuitemcheckbox',
        'menuitemradio',
        'option',
        'tab',
        'treeitem',
        'presentation'],
        selector: 'ol[role="presentation"]>li, ul[role="presentation"]>li'
    }],
    'LINK': [{
        role: 'link',
        reserved: true,
        selector: 'link[href]'
    }],
    'MAIN': [{
        role: '',
        allowed: [
        'main',
        'presentation']
    }],
    'MAP': [{
        role: '',
        reserved: true
    }],
    'MATH': [{
        role: '',
        allowed: ['presentation']
    }],
    'MENU': [{
        role: 'toolbar',
        selector: 'menu[type="toolbar"]'
    }],
    'MENUITEM': [{
        role: 'menuitem',
        selector: 'menuitem[type="command"]'
    }, {
        role: 'menuitemcheckbox',
        selector: 'menuitem[type="checkbox"]'
    }, {
        role: 'menuitemradio',
        selector: 'menuitem[type="radio"]'
    }],
    'META': [{
        role: '',
        reserved: true
    }],
    'METER': [{
        role: 'progressbar',
        allowed: ['presentation']
    }],
    'NAV': [{
        role: 'navigation',
        allowed: ['navigation', 'presentation']
    }],
    'NOSCRIPT': [{
        role: '',
        reserved: true
    }],
    'OBJECT': [{
        role: '',
        allowed: ['application', 'document', 'img', 'presentation']
    }],
    'OL': [{
        role: 'list',
        allowed: ['directory', 'group', 'listbox', 'menu', 'menubar', 'tablist', 'toolbar', 'tree', 'presentation']
    }],
    'OPTGROUP': [{
        role: '',
        allowed: ['presentation']
    }],
    'OPTION': [{
        role: 'option'
    }],
    'OUTPUT': [{
        role: 'status',
        allowed: ['*']
    }],
    'PARAM': [{
        role: '',
        reserved: true
    }],
    'PICTURE': [{
        role: '',
        reserved: true
    }],
    'PROGRESS': [{
        role: 'progressbar',
        allowed: ['presentation']
    }],
    'SCRIPT': [{
        role: '',
        reserved: true
    }],
    'SECTION': [{
        role: 'region',
        allowed: [
        'alert',
        'alertdialog',
        'application',
        'contentinfo',
        'dialog',
        'document',
        'log',
        'marquee',
        'search',
        'status',
        'presentation']
    }],
    'SELECT': [{
        role: 'listbox'
    }],
    'SOURCE': [{
        role: '',
        reserved: true
    }],
    'SPAN': [{
        role: '',
        allowed: ['*']
    }],
    'STYLE': [{
        role: '',
        reserved: true
    }],
    'SVG': [{
        role: '',
        allowed: [
        'application',
        'document',
        'img',
        'presentation']
    }],
    'SUMMARY': [{
        role: '',
        allowed: ['presentation']
    }],
    'TABLE': [{
        role: '',
        allowed: ['*']
    }],
    'TEMPLATE': [{
        role: '',
        reserved: true
    }],
    'TEXTAREA': [{
        role: 'textbox'
    }],
    'TBODY': [{
        role: 'rowgroup',
        allowed: ['*']
    }],
    'THEAD': [{
        role: 'rowgroup',
        allowed: ['*']
    }],
    'TFOOT': [{
        role: 'rowgroup',
        allowed: ['*']
    }],
    'TITLE': [{
        role: '',
        reserved: true
    }],
    'TD': [{
        role: '',
        allowed: ['*']
    }],
    'TH': [{
        role: '',
        allowed: ['*']
    }],
    'TR': [{
        role: '',
        allowed: ['*']
    }],
    'TRACK': [{
        role: '',
        reserved: true
    }],
    'UL': [{
        role: 'list',
        allowed: [
        'directory',
        'group',
        'listbox',
        'menu',
        'menubar',
        'tablist',
        'toolbar',
        'tree',
        'presentation']
    }],
    'VIDEO': [{
        role: '',
        allowed: ['application', 'presentation']
    }]
};
