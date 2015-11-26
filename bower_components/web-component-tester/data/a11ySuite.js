/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(Mocha, chai, axs) {

  Object.keys(Mocha.interfaces).forEach(function(iface) {
    var orig = Mocha.interfaces[iface];

    Mocha.interfaces[iface] = function(suite) {
      orig.apply(this, arguments);

      var Suite = Mocha.Suite;
      var Test = Mocha.Test;

      suite.on('pre-require', function(context, file, mocha) {

        // build an audit config to disable certain ignorable tests
        var axsConfig = new axs.AuditConfiguration();
        axsConfig.scope = document.body;
        axsConfig.showUnsupportedRulesWarning = false;

        // filter out rules that only run in the extension
        var rules = axs.AuditRules.getRules().filter(function(rule) {
          return !rule.requiresConsoleAPI;
        });

        /**
          * Runs the Chrome Accessibility Developer Tools Audit against a test-fixture
          *
          * @param {String} fixtureId ID of the fixture element in the document to use
          */
        context.a11ySuite = function(fixtureId) {
          // capture a reference to the fixture element early
          var fixtureElement = document.getElementById(fixtureId);
          if (!fixtureElement) {
            return;
          }

          // build mocha suite
          var a11ySuite = Suite.create(suite, 'A11y Audit - Fixture: ' + fixtureId);

          // override the `eachTest` function to hackily create the tests
          //
          // eachTest is called right before test runs to calculate the total
          // number of tests
          a11ySuite.eachTest = function() {
            // instantiate fixture
            fixtureElement.create();

            // run audit
            var auditResults = axs.Audit.run(axsConfig);

            // create tests for audit results
            auditResults.forEach(function(result, index) {
              // only show applicable tests
              if (result.result !== 'NA') {
                var title = rules[index].heading;
                // fail test if audit result is FAIL
                var error = result.result === 'FAIL' ? axs.Audit.accessibilityErrorMessage(result) : null;
                var test = new Test(title, function() {
                  if (error) {
                    throw new Error(error);
                  }
                });
                test.file = file;
                a11ySuite.addTest(test);
              }
            });

            // teardown fixture
            fixtureElement.restore();

            suite.eachTest.apply(a11ySuite, arguments);
            this.eachTest = suite.eachTest;
          };

          return a11ySuite;
        };
      });
    };
  });

  chai.use(function(chai, util) {
    var Assertion = chai.Assertion;

    // assert
    chai.assert.a11yLabel = function(node, exp, msg){
      new Assertion(node).to.have.a11yLabel(exp, msg);
    };

    // expect / should
    Assertion.addMethod('a11yLabel', function(str, msg) {
      if (msg) {
        util.flag(this, 'message', msg);
      }

      var node = this._obj;

      // obj must be a Node
      new Assertion(node).to.be.instanceOf(Node);

      // vind the text alternative with the help of accessibility dev tools
      var textAlternative = axs.properties.findTextAlternatives(node, {});

      this.assert(
        textAlternative === str,
        'expected #{this} to have text alternative #{exp} but got #{act}',
        'expected #{this} to not have text alternative #{act}',
        str,
        textAlternative,
        true
      );
    });
  });
})(window.Mocha, window.chai, window.axs);
