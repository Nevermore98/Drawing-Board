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
})({"Dryx":[function(require,module,exports) {
var _this = this;

var canvas = document.getElementById('drawing-board');
var ctx = canvas.getContext('2d');
var colorBtn = document.getElementsByClassName('color-item');
var colorGroup = document.getElementsByClassName('color-group');

var highlighter = document.getElementById('highlighter');
var eraser = document.getElementById('eraser');

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

var lineColor = 'black';
var lineWidth = 4;

var isDrawing = false;
var isErasing = false;

// 存储坐标点
var points = [];
var beginPoint = null;

// 创建高清画布
createHDCanvas();
// 设置背景颜色，下载的图片背景才有颜色
setCanvasBg('white');
// 选择线条颜色
selectColor();

highlighter.onclick = function () {
  isErasing = false;
};

eraser.onclick = function () {
  isErasing = true;
};

// 绘图
// 判断是否为触屏设备
var isTouchDevice = 'ontouchstart' in document.documentElement;
if (isTouchDevice) {
  // 触屏设备
  canvas.ontouchstart = function (e) {
    //储存绘图表面
    _this.firstDot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    saveData(_this.firstDot);
    isDrawing = true;
    ctx.beginPath();
    beginPoint = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    points.push({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    drawCircle(beginPoint.x, beginPoint.y, lineWidth / 2);
  };
  canvas.ontouchmove = function (e) {
    if (!isDrawing) return;
    ctx.beginPath();
    points.push({ x: e.touches[0].clientX, y: e.touches[0].clientY });

    if (points.length > 3) {
      var lastTwoPoints = points.slice(-2);
      var controlPoint = lastTwoPoints[0];
      var endPoint = {
        x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
        y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
      };
      drawSmoothLine(beginPoint, controlPoint, endPoint);
      beginPoint = endPoint;
    }
  };
} else {
  // 非触屏设备
  canvas.onmousedown = function (e) {
    //储存绘图表面
    _this.firstDot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    saveData(_this.firstDot);
    isDrawing = true;
    ctx.beginPath();
    beginPoint = { x: e.clientX, y: e.clientY };
    points.push({ x: e.clientX, y: e.clientY });
    drawCircle(beginPoint.x, beginPoint.y, lineWidth / 2);
  };

  canvas.onmousemove = function (e) {
    if (!isDrawing) return;
    ctx.beginPath();
    points.push({ x: e.clientX, y: e.clientY });

    if (points.length > 3) {
      var lastTwoPoints = points.slice(-2);
      var controlPoint = lastTwoPoints[0];
      var endPoint = {
        x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
        y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
      };
      drawSmoothLine(beginPoint, controlPoint, endPoint);
      beginPoint = endPoint;
    }
  };

  canvas.onmouseup = function (e) {
    if (!isDrawing) return;
    ctx.beginPath();
    points.push({ x: e.clientX, y: e.clientY });

    if (points.length > 3) {
      var lastTwoPoints = points.slice(-2);
      var controlPoint = lastTwoPoints[0];
      var endPoint = lastTwoPoints[1];
      drawSmoothLine(beginPoint, controlPoint, endPoint);
    }
    beginPoint = null;
    isDrawing = false;
    points = [];
  };

  canvas.onmouseleave = function () {
    isDrawing = false;
  };
}

// 画圆形
function drawCircle(x, y, radius) {
  if (isErasing) {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.clip();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  } else {
    ctx.beginPath();
    ctx.fillStyle = lineColor;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}

// 绘制二次贝塞尔平滑曲线
function drawSmoothLine(beginPoint, controlPoint, endPoint) {
  ctx.lineWidth = lineWidth;
  if (isErasing) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.moveTo(beginPoint.x, beginPoint.y);
    ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
    ctx.stroke();
    ctx.closePath();
    ctx.clip();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  } else {
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(beginPoint.x, beginPoint.y);
    ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
    ctx.stroke();
    ctx.closePath();
  }
}

function setCanvasBg(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
}

function selectColor() {
  ctx.beginPath();
  for (var i = 0; i < colorBtn.length; i++) {
    colorBtn[i].onclick = function () {
      for (var _i = 0; _i < colorBtn.length; _i++) {
        colorBtn[_i].classList.remove('active');
        this.classList.add('active');
        lineColor = this.style.backgroundColor;
        ctx.strokeStyle = lineColor;
      }
    };
  }
}

function createHDCanvas() {
  var w = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : canvas.width;
  var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : canvas.height;

  var ratio = window.devicePixelRatio || 1;
  canvas.width = w * ratio; // 实际渲染像素
  canvas.height = h * ratio; // 实际渲染像素
  canvas.style.width = w + 'px'; // 控制显示大小
  canvas.style.height = h + 'px'; // 控制显示大小
  ctx.scale(ratio, ratio);
  return canvas;
}
},{}]},{},["Dryx"], null)
//# sourceMappingURL=canvas.7ec15fbb.map