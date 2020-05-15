// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({11:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var a = exports.a = 1;
},{}],6:[function(require,module,exports) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _moduleA = require("./moduleA");

document.getElementById("satrect").style.visibility = "hidden";

function rgbToHex(red, green, blue) {
  var rgb = blue | green << 8 | red << 16;
  return '#' + (0x1000000 + rgb).toString(16).slice(1);
}

function isPercentage(n) {
  return typeof n === "string" && n.indexOf('%') != -1;
}

function isOnePointZero(n) {
  return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
}

function bound01(n, max) {
  if (isOnePointZero(n)) {
    n = "100%";
  }

  var processPercent = isPercentage(n);
  n = Math.min(max, Math.max(0, parseFloat(n)));

  // Automatically convert percentage into number
  if (processPercent) {
    n = parseInt(n * max, 10) / 100;
  }

  // Handle floating point rounding errors
  if (Math.abs(n - max) < 0.000001) {
    return 1;
  }

  // Convert into [0, 1] range if it isn't already
  return n % max / parseFloat(max);
}

function hslToRgb(h, s, l) {
  var r, g, b;

  h = bound01(h, 360);
  s = bound01(s, 100);
  l = bound01(l, 100);

  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
}

function isWindow(obj) {
  return obj !== null && obj === obj.window;
}

function getWindow(elem) {
  return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
}

function offset(elem) {

  var docElem,
      win,
      box = {
    top: 0,
    left: 0
  },
      doc = elem && elem.ownerDocument;

  docElem = doc.documentElement;

  if (_typeof(elem.getBoundingClientRect) !== (typeof undefined === "undefined" ? "undefined" : _typeof(undefined))) {
    box = elem.getBoundingClientRect();
  }
  win = getWindow(doc);
  return {
    top: box.top + win.pageYOffset - docElem.clientTop,
    left: box.left + win.pageXOffset - docElem.clientLeft
  };
}

function segmentNumber(number, min, max) {
  return Math.max(min, Math.min(number, max));
}
// COLOR PICKER //
var color = [0, 100, 50];

var elements = {
  hue_bar: document.querySelector(".hue_bar"),
  sat_rect: document.querySelector(".sat_rect"),

  color_preview: document.querySelector(".color_preview"),

  sat_picker: document.querySelector(".sat_picker"),
  hue_picker: document.querySelector(".hue_picker")
};

var sat_width = elements.sat_rect.offsetWidth,
    sat_height = elements.sat_rect.offsetHeight;

var hue_height = elements.hue_bar.offsetHeight;

function returnPickedColor() {

  elements.hue_picker.style.background = "hsl( " + color[0] + ",100%, 50% )";
  document.body.style.background = "hsl( " + color[0] + "," + color[1] + "%," + color[2] + "% )";
  elements.sat_picker.style.background = "hsl( " + color[0] + "," + color[1] + "%," + color[2] + "% )";
  elements.color_preview.style.background = "hsl( " + color[0] + "," + color[1] + "%," + color[2] + "% )";

  var rgb_color = hslToRgb(color[0], color[1], color[2]),
      hex_color = rgbToHex(rgb_color[0], rgb_color[1], rgb_color[2]);

  console.log(hex_color);

  document.querySelector(".bottom input").value = hex_color.toUpperCase();
}

function setHuePickerValue(e) {

  var hue_bar_position = {
    top: offset(elements.sat_rect).top
  };

  color[0] = segmentNumber(Math.floor((e.pageY - hue_bar_position.top) / hue_height * 360), 0, 360);

  elements.hue_picker.style.top = segmentNumber((e.pageY - hue_bar_position.top) / hue_height * 100, 0, hue_height / 2) + "%";

  elements.sat_rect.style.background = "hsl(" + color[0] + ", 100%, 50%)";

  returnPickedColor();
}

var hue_drag_started = false,
    sat_drag_started = false;

//LINE DRAG START
elements.hue_bar.addEventListener('mousedown', function (e) {
  hue_drag_started = true;
  elements.hue_picker.classList.add("active");

  setHuePickerValue(e);
});

//--//

function setSatPickerValue(e) {

  var rect_position = {
    left: offset(elements.sat_rect).left,
    top: offset(elements.sat_rect).top
  };

  var position = [segmentNumber(e.pageX - rect_position.left, 0, sat_width), segmentNumber(e.pageY - rect_position.top, 0, sat_height)];

  elements.sat_picker.style.left = position[0] + "px";
  elements.sat_picker.style.top = position[1] + "px";

  color[1] = Math.floor(position[0] / sat_width * 100);

  var x = e.pageX - offset(elements.sat_rect).left;
  var y = e.pageY - offset(elements.sat_rect).top;
  //constrain x max
  if (x > sat_width) {
    x = sat_width;
  }
  if (x < 0) {
    x = 0;
  }
  if (y > sat_height) {
    y = sat_height;
  }
  if (y < 0) {
    y = 0;
  }

  //convert between hsv and hsl
  var xRatio = x / sat_width * 100,
      yRatio = y / sat_height * 100,
      hsvValue = 1 - yRatio / 100,
      hsvSaturation = xRatio / 100,
      lightness = hsvValue / 2 * (2 - hsvSaturation);

  color[2] = Math.floor(lightness * 100);

  returnPickedColor();
}

//COLOR DRAG START
elements.sat_rect.addEventListener('mousedown', function (e) {
  sat_drag_started = true;

  elements.sat_picker.classList.add("active");
  setSatPickerValue(e);
});

document.addEventListener('mousemove', function (e) {
  //COLOR DRAG MOVE
  if (sat_drag_started) {
    setSatPickerValue(e);
  }

  //LINE DRAG MOVE
  if (hue_drag_started) {
    setHuePickerValue(e);
  }
});

//MOUSE UP
document.addEventListener('mouseup', function () {
  if (sat_drag_started) {
    elements.sat_picker.classList.remove("active");
    sat_drag_started = false;
  }

  if (hue_drag_started) {
    elements.hue_picker.classList.remove("active");
    hue_drag_started = false;
  }
});

console.log(_moduleA.a);
},{"./moduleA":11}],15:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '49220' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[15,6])
//# sourceMappingURL=/dist/pixel-editor.map