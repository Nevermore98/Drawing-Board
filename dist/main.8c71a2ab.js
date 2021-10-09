// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
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

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
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
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"epB2":[function(require,module,exports) {
var tools = document.getElementsByClassName('tool');
var range = document.getElementById('range');

var clear = document.getElementById('clear');
var undo = document.getElementById('undo');
var save = document.getElementById('save');

window.onbeforeunload = function () {
  return 'Reload site?';
};

var historyData = [];

selectTool();

range.onchange = function () {
  lineWidth = this.value;
};

clear.onclick = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBg('white');
};

undo.onclick = function () {
  if (historyData.length < 1) return;
  top = historyData[historyData.length - 1];
  ctx.putImageData(historyData[historyData.length - 1], 0, 0);
  historyData.pop();
};

save.onclick = function () {
  var imgUrl = canvas.toDataURL('image/png');
  var saveA = document.createElement('a');
  document.body.appendChild(saveA);
  saveA.href = imgUrl;
  saveA.download = 'pic' + new Date().getTime();
  saveA.target = '_blank';
  saveA.click();
};

function selectTool() {
  for (var i = 0; i < tools.length; i++) {
    tools[i].onmousedown = function () {
      for (var _i = 0; _i < tools.length; _i++) {
        tools[_i].classList.remove('active');
        this.classList.add('active');
      }
    };
  }
}

function saveData(data) {
  // 撤销次数上限 10
  historyData.length === 10 && historyData.shift();
  historyData.push(data);
}
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.8c71a2ab.map