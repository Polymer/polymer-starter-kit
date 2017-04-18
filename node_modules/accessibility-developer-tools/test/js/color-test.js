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

module("Contrast Ratio", {
  setup: function () {
    var fixture = document.createElement('div');
    document.getElementById('qunit-fixture').appendChild(fixture);
    this.fixture_ = fixture;
    this.black_ = {"red": 0, "green": 0, "blue": 0, "alpha": 1};
    this.white_ = {"red": 255, "green": 255, "blue": 255, "alpha": 1};
  }
});
test("Black and white.", function () {
  equal(axs.color.calculateContrastRatio(this.white_, this.black_), 21);
  equal(axs.color.calculateContrastRatio(this.black_, this.white_), 21);
});
test("Same color === no contrast.", function () {
  equal(axs.color.calculateContrastRatio(this.white_, this.white_), 1);
  equal(axs.color.calculateContrastRatio(this.black_, this.black_), 1);
});
test("Transparent foreground === no contrast.", function () {
  equal(axs.color.calculateContrastRatio({"red": 0, "green": 0, "blue": 0, "alpha": 0}, this.white_), 1);
});

module("parseColor");
test("parses alpha values correctly", function() {
  var colorString = 'rgba(255, 255, 255, .47)';
  var color = axs.color.parseColor(colorString);
  equal(color.red, 255);
  equal(color.blue, 255);
  equal(color.green, 255);
  equal(color.alpha, .47);
});

test("handles rgba transparent value correctly", function() {
  var colorString = 'rgba(0, 0, 0, 0)';
  var color = axs.color.parseColor(colorString);
  equal(color.red, 0);
  equal(color.blue, 0);
  equal(color.green, 0);
  equal(color.alpha, 0);
});

test("handles xbrowser 'transparent' value correctly", function() {
  // Firefox, IE11, Project Spartan (MS Edge Release Candidate)
  // See #180 https://github.com/GoogleChrome/accessibility-developer-tools/issues/180
  var colorString = 'transparent';
  var color = axs.color.parseColor(colorString);
  equal(color.red, 0);
  equal(color.blue, 0);
  equal(color.green, 0);
  equal(color.alpha, 0);
});

module("suggestColors");
test("suggests correct grey values", function() {
  var white = new axs.color.Color(255, 255, 255, 1)
  var desiredContrastRatios = { AA: 4.5, AAA: 7.0 };
  var suggestions = axs.color.suggestColors(white, white, desiredContrastRatios);
  deepEqual(suggestions, { AA: { bg: "#ffffff", contrast: "4.54", fg: "#767676" },
                           AAA: { bg: "#ffffff", contrast: "7.00", fg: "#595959" } });
});
