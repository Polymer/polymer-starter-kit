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

goog.provide('axs.color');
goog.provide('axs.color.Color');

/**
 * @constructor
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @param {number} alpha
 */
axs.color.Color = function(red, green, blue, alpha) {
    /** @type {number} */
    this.red = red;

    /** @type {number} */
    this.green = green;

    /** @type {number} */
    this.blue = blue;

    /** @type {number} */
    this.alpha = alpha;
};

/**
 * @constructor
 * See https://en.wikipedia.org/wiki/YCbCr for more information.
 * @param {Array.<number>} coords The YCbCr values as a 3 element array, in the order [luma, Cb, Cr].
 *     All numbers are in the range [0, 1].
 */
axs.color.YCbCr = function(coords) {
    /** @type {number} */
    this.luma = this.z = coords[0];

    /** @type {number} */
    this.Cb = this.x = coords[1];

    /** @type {number} */
    this.Cr = this.y = coords[2];
};

axs.color.YCbCr.prototype = {
    /**
     * @param {number} scalar
     * @return {axs.color.YCbCr} This color multiplied by the given scalar
     */
    multiply: function(scalar) {
        var result = [ this.luma * scalar, this.Cb * scalar, this.Cr * scalar ];
        return new axs.color.YCbCr(result);
    },

    /**
     * @param {axs.color.YCbCr} other
     * @return {axs.color.YCbCr} This plus other
     */
    add: function(other) {
        var result = [ this.luma + other.luma, this.Cb + other.Cb, this.Cr + other.Cr ];
        return new axs.color.YCbCr(result);
    },

    /**
     * @param {axs.color.YCbCr} other
     * @return {axs.color.YCbCr} This minus other
     */
    subtract: function(other) {
        var result = [ this.luma - other.luma, this.Cb - other.Cb, this.Cr - other.Cr ];
        return new axs.color.YCbCr(result);
    }

};


/**
 * Calculate the contrast ratio between the two given colors. Returns the ratio
 * to 1, for example for two two colors with a contrast ratio of 21:1, this
 * function will return 21.
 * @param {axs.color.Color} fgColor
 * @param {axs.color.Color} bgColor
 * @return {!number}
 */
axs.color.calculateContrastRatio = function(fgColor, bgColor) {
    if (fgColor.alpha < 1)
        fgColor = axs.color.flattenColors(fgColor, bgColor);

    var fgLuminance = axs.color.calculateLuminance(fgColor);
    var bgLuminance = axs.color.calculateLuminance(bgColor);
    var contrastRatio = (Math.max(fgLuminance, bgLuminance) + 0.05) /
        (Math.min(fgLuminance, bgLuminance) + 0.05);
    return contrastRatio;
};

/**
 * Calculate the luminance of the given color using the WCAG algorithm.
 * @param {axs.color.Color} color
 * @return {number}
 */
axs.color.calculateLuminance = function(color) {
/*    var rSRGB = color.red / 255;
    var gSRGB = color.green / 255;
    var bSRGB = color.blue / 255;

    var r = rSRGB <= 0.03928 ? rSRGB / 12.92 : Math.pow(((rSRGB + 0.055)/1.055), 2.4);
    var g = gSRGB <= 0.03928 ? gSRGB / 12.92 : Math.pow(((gSRGB + 0.055)/1.055), 2.4);
    var b = bSRGB <= 0.03928 ? bSRGB / 12.92 : Math.pow(((bSRGB + 0.055)/1.055), 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b; */
    var ycc = axs.color.toYCbCr(color);
    return ycc.luma;
};

/**
 * Compute the luminance ratio between two luminance values.
 * @param {number} luminance1
 * @param {number} luminance2
 */
axs.color.luminanceRatio = function(luminance1, luminance2) {
    return (Math.max(luminance1, luminance2) + 0.05) /
        (Math.min(luminance1, luminance2) + 0.05);
};

/**
 * @param {string} colorString The color string from CSS.
 * @return {?axs.color.Color}
 */
axs.color.parseColor = function(colorString) {
    if (colorString === "transparent") {
        return new axs.color.Color(0, 0, 0, 0);
    }
    var rgbRegex = /^rgb\((\d+), (\d+), (\d+)\)$/;
    var match = colorString.match(rgbRegex);

    if (match) {
        var r = parseInt(match[1], 10);
        var g = parseInt(match[2], 10);
        var b = parseInt(match[3], 10);
        var a = 1;
        return new axs.color.Color(r, g, b, a);
    }

    var rgbaRegex = /^rgba\((\d+), (\d+), (\d+), (\d*(\.\d+)?)\)/;
    match = colorString.match(rgbaRegex);
    if (match) {
        var r = parseInt(match[1], 10);
        var g = parseInt(match[2], 10);
        var b = parseInt(match[3], 10);
        var a = parseFloat(match[4]);
        return new axs.color.Color(r, g, b, a);
    }

    return null;
};

/**
 * @param {number} value The value of a color channel, 0 <= value <= 0xFF
 * @return {!string}
 */
axs.color.colorChannelToString = function(value) {
    value = Math.round(value);
    if (value <= 0xF)
        return '0' + value.toString(16);
    return value.toString(16);
};

/**
 * @param {axs.color.Color} color
 * @return {!string}
 */
axs.color.colorToString = function(color) {
    if (color.alpha == 1) {
         return '#' + axs.color.colorChannelToString(color.red) +
         axs.color.colorChannelToString(color.green) + axs.color.colorChannelToString(color.blue);
    }
    else
        return 'rgba(' + [color.red, color.green, color.blue, color.alpha].join(',') + ')';
};

/**
 * Compute a desired luminance given a given luminance and a desired contrast ratio.
 * @param {number} luminance The given luminance.
 * @param {number} contrast The desired contrast ratio.
 * @param {boolean} higher Whether the desired luminance is higher or lower than the given luminance.
 * @return {number} The desired luminance.
 */
axs.color.luminanceFromContrastRatio = function(luminance, contrast, higher) {
    if (higher) {
        var newLuminance = (luminance + 0.05) * contrast - 0.05;
        return newLuminance;
    } else {
        var newLuminance = (luminance + 0.05) / contrast - 0.05;
        return newLuminance;
    }
};

/**
 * Given a color in YCbCr format and a desired luminance, pick a new color with the desired luminance which is
 * as close as possible to the original color.
 * @param {axs.color.YCbCr} ycc The original color in YCbCr form.
 * @param {number} luma The desired luminance
 * @return {!axs.color.Color} A new color in RGB.
 */
axs.color.translateColor = function(ycc, luma) {
    var endpoint = (luma > ycc.luma) ? axs.color.WHITE_YCC : axs.color.BLACK_YCC;
    var cubeFaces = (endpoint == axs.color.WHITE_YCC) ? axs.color.YCC_CUBE_FACES_WHITE
                                                      : axs.color.YCC_CUBE_FACES_BLACK;

    var a = new axs.color.YCbCr([0, ycc.Cb, ycc.Cr]);
    var b = new axs.color.YCbCr([1, ycc.Cb, ycc.Cr]);
    var line = { a: a, b: b };

    var intersection = null;
    for (var i = 0; i < cubeFaces.length; i++) {
        var cubeFace = cubeFaces[i];
        intersection = axs.color.findIntersection(line, cubeFace);
        // If intersection within [0, 1] in Z axis, it is within the cube.
        if (intersection.z >= 0 && intersection.z <= 1)
            break;
    }
    if (!intersection) {
        // Should never happen
        throw "Couldn't find intersection with YCbCr color cube for Cb=" + ycc.Cb + ", Cr=" + ycc.Cr + ".";
    }
    if (intersection.x != ycc.x || intersection.y != ycc.y) {
        // Should never happen
        throw "Intersection has wrong Cb/Cr values.";
    }

    // If intersection.luma is closer to endpoint than desired luma, then luma is inside cube
    // and we can immediately return new value.
    if (Math.abs(endpoint.luma - intersection.luma) < Math.abs(endpoint.luma - luma)) {
        var translatedColor = [luma, ycc.Cb, ycc.Cr];
        return axs.color.fromYCbCrArray(translatedColor);
    }

    // Otherwise, translate from intersection towards white/black such that luma is correct.
    var dLuma = luma - intersection.luma;
    var scale = dLuma / (endpoint.luma - intersection.luma);
    var translatedColor = [ luma,
                            intersection.Cb - (intersection.Cb * scale),
                            intersection.Cr - (intersection.Cr * scale) ];

    return axs.color.fromYCbCrArray(translatedColor);
};

/** @typedef {{fg: string, bg: string, contrast: string}} */
axs.color.SuggestedColors;

/**
 * @param {axs.color.Color} bgColor
 * @param {axs.color.Color} fgColor
 * @param {Object.<string, number>} desiredContrastRatios A map of label to desired contrast ratio.
 * @return {Object.<string, axs.color.SuggestedColors>}
 */
axs.color.suggestColors = function(bgColor, fgColor, desiredContrastRatios) {
    var colors = {};
    var bgLuminance = axs.color.calculateLuminance(bgColor);
    var fgLuminance = axs.color.calculateLuminance(fgColor);

    var fgLuminanceIsHigher = fgLuminance > bgLuminance;
    var fgYCbCr = axs.color.toYCbCr(fgColor);
    var bgYCbCr = axs.color.toYCbCr(bgColor);
    for (var desiredLabel in desiredContrastRatios) {
        var desiredContrast = desiredContrastRatios[desiredLabel];

        var desiredFgLuminance = axs.color.luminanceFromContrastRatio(bgLuminance, desiredContrast + 0.02, fgLuminanceIsHigher);
        if (desiredFgLuminance <= 1 && desiredFgLuminance >= 0) {
            var newFgColor = axs.color.translateColor(fgYCbCr, desiredFgLuminance);
            var newContrastRatio = axs.color.calculateContrastRatio(newFgColor, bgColor);
            var suggestedColors = {};
            suggestedColors.fg = /** @type {!string} */ (axs.color.colorToString(newFgColor));
            suggestedColors.bg = /** @type {!string} */ (axs.color.colorToString(bgColor));
            suggestedColors.contrast = /** @type {!string} */ (newContrastRatio.toFixed(2));
            colors[desiredLabel] = /** @type {axs.color.SuggestedColors} */ (suggestedColors);
            continue;
        }

        var desiredBgLuminance = axs.color.luminanceFromContrastRatio(fgLuminance, desiredContrast + 0.02, !fgLuminanceIsHigher);
        if (desiredBgLuminance <= 1 && desiredBgLuminance >= 0) {
            var newBgColor = axs.color.translateColor(bgYCbCr, desiredBgLuminance);
            var newContrastRatio = axs.color.calculateContrastRatio(fgColor, newBgColor);
            var suggestedColors = {};
            suggestedColors.bg = /** @type {!string} */ (axs.color.colorToString(newBgColor));
            suggestedColors.fg = /** @type {!string} */ (axs.color.colorToString(fgColor));
            suggestedColors.contrast = /** @type {!string} */ (newContrastRatio.toFixed(2));
            colors[desiredLabel] = /** @type {axs.color.SuggestedColors} */ (suggestedColors);
        }
    }
    return colors;
};

/**
 * Combine the two given color according to alpha blending.
 * @param {axs.color.Color} fgColor
 * @param {axs.color.Color} bgColor
 * @return {axs.color.Color}
 */
axs.color.flattenColors = function(fgColor, bgColor) {
    var alpha = fgColor.alpha;
    var r = ((1 - alpha) * bgColor.red) + (alpha * fgColor.red);
    var g = ((1 - alpha) * bgColor.green) + (alpha * fgColor.green);
    var b = ((1 - alpha) * bgColor.blue) + (alpha * fgColor.blue);
    var a = fgColor.alpha + (bgColor.alpha * (1 - fgColor.alpha));

    return new axs.color.Color(r, g, b, a);
};

/**
 * Multiply the given vector by the given matrix.
 * @param {Array.<Array.<number>>} matrix A 3x3 matrix
 * @param {Array.<number>} vector A 3-element vector
 * @return {Array.<number>} A 3-element vector
 */
axs.color.multiplyMatrixVector = function(matrix, vector) {
    var a = matrix[0][0];
    var b = matrix[0][1];
    var c = matrix[0][2];
    var d = matrix[1][0];
    var e = matrix[1][1];
    var f = matrix[1][2];
    var g = matrix[2][0];
    var h = matrix[2][1];
    var k = matrix[2][2];

    var x = vector[0];
    var y = vector[1];
    var z = vector[2];

    return [
        a*x + b*y + c*z,
        d*x + e*y + f*z,
        g*x + h*y + k*z
    ];
};

/**
 * Convert a given RGB color to YCbCr.
 * @param {axs.color.Color} color
 * @return {axs.color.YCbCr}
 */
axs.color.toYCbCr = function(color) {
    var rSRGB = color.red / 255;
    var gSRGB = color.green / 255;
    var bSRGB = color.blue / 255;

    var r = rSRGB <= 0.03928 ? rSRGB / 12.92 : Math.pow(((rSRGB + 0.055)/1.055), 2.4);
    var g = gSRGB <= 0.03928 ? gSRGB / 12.92 : Math.pow(((gSRGB + 0.055)/1.055), 2.4);
    var b = bSRGB <= 0.03928 ? bSRGB / 12.92 : Math.pow(((bSRGB + 0.055)/1.055), 2.4);

    return new axs.color.YCbCr(axs.color.multiplyMatrixVector(axs.color.YCC_MATRIX, [r, g, b]));
};

/**
 * @param {axs.color.YCbCr} ycc
 * @return {!axs.color.Color}
 */
axs.color.fromYCbCr = function(ycc) {
    return axs.color.fromYCbCrArray([ycc.luma, ycc.Cb, ycc.Cr]);
};

/**
 * Convert a color from a YCbCr color (as a vector) to an RGB color
 * @param {Array.<number>} yccArray
 * @return {!axs.color.Color}
 */
axs.color.fromYCbCrArray = function(yccArray) {
    var rgb = axs.color.multiplyMatrixVector(axs.color.INVERTED_YCC_MATRIX, yccArray);

    var r = rgb[0];
    var g = rgb[1];
    var b = rgb[2];
    var rSRGB = r <= 0.00303949 ? (r * 12.92) : (Math.pow(r, (1/2.4)) * 1.055) - 0.055;
    var gSRGB = g <= 0.00303949 ? (g * 12.92) : (Math.pow(g, (1/2.4)) * 1.055) - 0.055;
    var bSRGB = b <= 0.00303949 ? (b * 12.92) : (Math.pow(b, (1/2.4)) * 1.055) - 0.055;

    var red = Math.min(Math.max(Math.round(rSRGB * 255), 0), 255);
    var green = Math.min(Math.max(Math.round(gSRGB * 255), 0), 255);
    var blue = Math.min(Math.max(Math.round(bSRGB * 255), 0), 255);

    return new axs.color.Color(red, green, blue, 1);
};

/**
 * Returns an RGB to YCbCr conversion matrix for the given kR, kB constants.
 * @param {number} kR
 * @param {number} kB
 * @return {Array.<Array.<number>>}
 */
axs.color.RGBToYCbCrMatrix = function(kR, kB) {
    return [
        [
            kR,
            (1 - kR - kB),
            kB
        ],
        [
            -kR/(2 - 2*kB),
            (kR + kB - 1)/(2 - 2*kB),
            (1 - kB)/(2 - 2*kB)
        ],
        [
            (1 - kR)/(2 - 2*kR),
            (kR + kB - 1)/(2 - 2*kR),
            -kB/(2 - 2*kR)
        ]
    ];
};

/**
 * Return the inverse of the given 3x3 matrix.
 * @param {Array.<Array.<number>>} matrix
 * @return Array.<Array.<number>> The inverse of the given matrix.
 */
axs.color.invert3x3Matrix = function(matrix) {
    var a = matrix[0][0];
    var b = matrix[0][1];
    var c = matrix[0][2];
    var d = matrix[1][0];
    var e = matrix[1][1];
    var f = matrix[1][2];
    var g = matrix[2][0];
    var h = matrix[2][1];
    var k = matrix[2][2];

    var A = (e*k - f*h);
    var B = (f*g - d*k);
    var C = (d*h - e*g);
    var D = (c*h - b*k);
    var E = (a*k - c*g);
    var F = (g*b - a*h);
    var G = (b*f - c*e);
    var H = (c*d - a*f);
    var K = (a*e - b*d);

    var det = a * (e*k - f*h) - b * (k*d - f*g) + c * (d*h - e*g);
    var z = 1/det;

    return axs.color.scalarMultiplyMatrix([
        [ A, D, G ],
        [ B, E, H ],
        [ C, F, K ]
    ], z);
};

/** @typedef {{ a: axs.color.YCbCr, b: axs.color.YCbCr }} */
axs.color.Line;

/** @typedef {{ p0: axs.color.YCbCr, p1: axs.color.YCbCr, p2: axs.color.YCbCr }} */
axs.color.Plane;

/**
 * Find the intersection between a line and a plane using
 * http://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection#Parametric_form
 * @param {axs.color.Line} l
 * @param {axs.color.Plane} p
 * @return {axs.color.YCbCr}
 */
axs.color.findIntersection = function(l, p) {
    var lhs = [ l.a.x - p.p0.x, l.a.y - p.p0.y, l.a.z - p.p0.z ];

    var matrix = [ [ l.a.x - l.b.x, p.p1.x - p.p0.x, p.p2.x - p.p0.x ],
                   [ l.a.y - l.b.y, p.p1.y - p.p0.y, p.p2.y - p.p0.y ],
                   [ l.a.z - l.b.z, p.p1.z - p.p0.z, p.p2.z - p.p0.z ] ];
    var invertedMatrix = axs.color.invert3x3Matrix(matrix);

    var tuv = axs.color.multiplyMatrixVector(invertedMatrix, lhs);
    var t = tuv[0];

    var result = l.a.add(l.b.subtract(l.a).multiply(t));
    return result;
};

/**
 * Multiply a matrix by a scalar.
 * @param {Array.<Array.<number>>} matrix A 3x3 matrix.
 * @param {number} scalar
 * @return {Array.<Array.<number>>}
 */
axs.color.scalarMultiplyMatrix = function(matrix, scalar) {
    var result = [];

    for (var i = 0; i < 3; i++)
      result[i] = axs.color.scalarMultiplyVector(matrix[i], scalar);

    return result;
};

/**
 * Multiply a vector by a scalar.
 * @param {Array.<number>} vector
 * @param {number} scalar
 * @return {Array.<number>} vector
 */
axs.color.scalarMultiplyVector = function(vector, scalar) {
    var result = [];
    for (var i = 0; i < vector.length; i++)
        result[i] = vector[i] * scalar;
    return result;
};

axs.color.kR = 0.2126;
axs.color.kB = 0.0722;
axs.color.YCC_MATRIX = axs.color.RGBToYCbCrMatrix(axs.color.kR, axs.color.kB);
axs.color.INVERTED_YCC_MATRIX = axs.color.invert3x3Matrix(axs.color.YCC_MATRIX);

axs.color.BLACK = new axs.color.Color(0, 0, 0, 1.0);
axs.color.BLACK_YCC = axs.color.toYCbCr(axs.color.BLACK);
axs.color.WHITE = new axs.color.Color(255, 255, 255, 1.0);
axs.color.WHITE_YCC = axs.color.toYCbCr(axs.color.WHITE);
axs.color.RED = new axs.color.Color(255, 0, 0, 1.0);
axs.color.RED_YCC = axs.color.toYCbCr(axs.color.RED);
axs.color.GREEN = new axs.color.Color(0, 255, 0, 1.0);
axs.color.GREEN_YCC = axs.color.toYCbCr(axs.color.GREEN);
axs.color.BLUE = new axs.color.Color(0, 0, 255, 1.0);
axs.color.BLUE_YCC = axs.color.toYCbCr(axs.color.BLUE);
axs.color.CYAN = new axs.color.Color(0, 255, 255, 1.0);
axs.color.CYAN_YCC = axs.color.toYCbCr(axs.color.CYAN);
axs.color.MAGENTA = new axs.color.Color(255, 0, 255, 1.0);
axs.color.MAGENTA_YCC = axs.color.toYCbCr(axs.color.MAGENTA);
axs.color.YELLOW = new axs.color.Color(255, 255, 0, 1.0);
axs.color.YELLOW_YCC = axs.color.toYCbCr(axs.color.YELLOW);

axs.color.YCC_CUBE_FACES_BLACK = [ { p0: axs.color.BLACK_YCC, p1: axs.color.RED_YCC, p2: axs.color.GREEN_YCC },
                                   { p0: axs.color.BLACK_YCC, p1: axs.color.GREEN_YCC, p2: axs.color.BLUE_YCC },
                                   { p0: axs.color.BLACK_YCC, p1: axs.color.BLUE_YCC, p2: axs.color.RED_YCC } ];
axs.color.YCC_CUBE_FACES_WHITE = [ { p0: axs.color.WHITE_YCC, p1: axs.color.CYAN_YCC, p2: axs.color.MAGENTA_YCC },
                                   { p0: axs.color.WHITE_YCC, p1: axs.color.MAGENTA_YCC, p2: axs.color.YELLOW_YCC },
                                   { p0: axs.color.WHITE_YCC, p1: axs.color.YELLOW_YCC, p2: axs.color.CYAN_YCC } ];
