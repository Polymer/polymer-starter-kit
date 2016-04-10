// Copyright 2015 Google Inc.
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

module('UncontrolledTabpanel');

test('No roles === NA.', function() {
  // Setup fixture
  var fixture = document.getElementById('qunit-fixture');
  for (var i = 0; i < 10; i++)
    fixture.appendChild(document.createElement('div'));

  deepEqual(
    axs.AuditRules.getRule('uncontrolledTabpanel').run({ scope: fixture }),
    { result: axs.constants.AuditResult.NA }
  );
});

test('No elements with role tabpanel === NA.', function() {
  // Setup fixture
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.setAttribute('role', 'tablist');
  fixture.appendChild(div);

  deepEqual(
    axs.AuditRules.getRule('uncontrolledTabpanel').run({ scope: fixture }),
    { result: axs.constants.AuditResult.NA }
  );
});

test('Tabpanel with aria-labelledby === PASS.', function() {
  // Setup fixture
  var fixture = document.getElementById('qunit-fixture');
  var tabList = document.createElement('div');
  tabList.setAttribute('role', 'tablist');
  fixture.appendChild(tabList);
  var tab = document.createElement('div');
  tab.setAttribute('role', 'tab');
  tab.setAttribute('id', 'tabId');

  tabList.appendChild(tab);
  var tabPanel = document.createElement('div');
  tabPanel.setAttribute('role', 'tabpanel');
  tabPanel.setAttribute('aria-labelledby', 'tabId');
  fixture.appendChild(tabPanel);

  deepEqual(
    axs.AuditRules.getRule('uncontrolledTabpanel').run({ scope: fixture }),
    { elements: [], result: axs.constants.AuditResult.PASS }
  );
});

test('Tabpanel which is controlled via aria-controls on the tab === PASS.', function() {
  // Setup fixture
  var fixture = document.getElementById('qunit-fixture');
  var tabList = document.createElement('div');
  tabList.setAttribute('role', 'tablist');
  fixture.appendChild(tabList);
  var tab = document.createElement('div');
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', 'tabpanelId');

  tabList.appendChild(tab);
  var tabPanel = document.createElement('div');
  tabPanel.setAttribute('role', 'tabpanel');
  tabPanel.setAttribute('id', 'tabpanelId');
  fixture.appendChild(tabPanel);

  deepEqual(
    axs.AuditRules.getRule('uncontrolledTabpanel').run({ scope: fixture }),
    { elements: [], result: axs.constants.AuditResult.PASS }
  );
});

// If tabpanels were added dynamically with JS, then a tab might not always have a tab panel. This
// test ensures that the audit is only checking for a tabpanel without a tab, not a tab without a
// tabpanel.
test('Tabpanel which is controlled via aria-controls on its tab when there is more than one tab === PASS.', function() {
  // Setup fixture
  var fixture = document.getElementById('qunit-fixture');
  var tabList = document.createElement('div');
  tabList.setAttribute('role', 'tablist');
  fixture.appendChild(tabList);

  var tab1 = document.createElement('div');
  tab1.setAttribute('role', 'tab');
  tab1.setAttribute('aria-controls', 'tabpanelId');
  tabList.appendChild(tab1);

  var tab2 = document.createElement('div');
  tab2.setAttribute('role', 'tab');
  tabList.appendChild(tab2);

  var tabPanel = document.createElement('div');
  tabPanel.setAttribute('role', 'tabpanel');
  tabPanel.setAttribute('id', 'tabpanelId');
  fixture.appendChild(tabPanel);

  deepEqual(
    axs.AuditRules.getRule('uncontrolledTabpanel').run({ scope: fixture }),
    { elements: [], result: axs.constants.AuditResult.PASS }
  );
});

test('Tabpanel which is not controlled or labeled by a tab === FAIL.', function() {
  // Setup fixture
  var fixture = document.getElementById('qunit-fixture');
  var tabList = document.createElement('div');
  tabList.setAttribute('role', 'tablist');
  fixture.appendChild(tabList);
  var tab = document.createElement('div');
  tab.setAttribute('role', 'tab');

  tabList.appendChild(tab);
  var tabPanel = document.createElement('div');
  tabPanel.setAttribute('role', 'tabpanel');
  fixture.appendChild(tabPanel);

  deepEqual(
    axs.AuditRules.getRule('uncontrolledTabpanel').run({ scope: fixture }),
    { elements: [tabPanel], result: axs.constants.AuditResult.FAIL }
  );
});

test('Tabpanel which is labeled by something other than a tab and not controlled by a tab == FAIL.', function() {
  // Setup fixture
  var fixture = document.getElementById('qunit-fixture');

  var tabPanel = document.createElement('div');
  tabPanel.setAttribute('role', 'tabpanel');
  tabPanel.setAttribute('aria-labelledby', 'not-a-tab');
  fixture.appendChild(tabPanel);

  var notATab = document.createElement('h5');
  notATab.setAttribute('id', 'not-a-tab');
  fixture.appendChild(notATab);

  deepEqual(
    axs.AuditRules.getRule('uncontrolledTabpanel').run({ scope: fixture }),
    { elements: [tabPanel], result: axs.constants.AuditResult.FAIL }
  );
});
