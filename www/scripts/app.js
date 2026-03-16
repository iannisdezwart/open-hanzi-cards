var OpenHanziCards = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to2, from2, except, desc) => {
    if (from2 && typeof from2 === "object" || typeof from2 === "function") {
      for (let key of __getOwnPropNames(from2))
        if (!__hasOwnProp.call(to2, key) && key !== except)
          __defProp(to2, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
    }
    return to2;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/client/quiz-controller.ts
  var quiz_controller_exports = {};
  __export(quiz_controller_exports, {
    startApp: () => startApp
  });

  // node_modules/.pnpm/hanzi-writer@3.7.3/node_modules/hanzi-writer/dist/index.esm.js
  var _globalObj$requestAni;
  var _globalObj$cancelAnim;
  var _globalObj$navigator;
  var globalObj = typeof window === "undefined" ? global : window;
  var performanceNow = globalObj.performance && (() => globalObj.performance.now()) || (() => Date.now());
  var requestAnimationFrame = ((_globalObj$requestAni = globalObj.requestAnimationFrame) === null || _globalObj$requestAni === void 0 ? void 0 : _globalObj$requestAni.bind(globalObj)) || ((callback) => setTimeout(() => callback(performanceNow()), 1e3 / 60));
  var cancelAnimationFrame = ((_globalObj$cancelAnim = globalObj.cancelAnimationFrame) === null || _globalObj$cancelAnim === void 0 ? void 0 : _globalObj$cancelAnim.bind(globalObj)) || clearTimeout;
  function arrLast(arr) {
    return arr[arr.length - 1];
  }
  var fixIndex = (index, length2) => {
    if (index < 0) {
      return length2 + index;
    }
    return index;
  };
  var selectIndex = (arr, index) => {
    return arr[fixIndex(index, arr.length)];
  };
  function copyAndMergeDeep(base, override) {
    const output = {
      ...base
    };
    for (const key in override) {
      const baseVal = base[key];
      const overrideVal = override[key];
      if (baseVal === overrideVal) {
        continue;
      }
      if (baseVal && overrideVal && typeof baseVal === "object" && typeof overrideVal === "object" && !Array.isArray(overrideVal)) {
        output[key] = copyAndMergeDeep(baseVal, overrideVal);
      } else {
        output[key] = overrideVal;
      }
    }
    return output;
  }
  function inflate(scope, obj) {
    const parts = scope.split(".");
    const final = {};
    let current = final;
    for (let i = 0; i < parts.length; i++) {
      const cap = i === parts.length - 1 ? obj : {};
      current[parts[i]] = cap;
      current = cap;
    }
    return final;
  }
  var count = 0;
  function counter() {
    count++;
    return count;
  }
  function average(arr) {
    const sum = arr.reduce((acc, val) => val + acc, 0);
    return sum / arr.length;
  }
  function colorStringToVals(colorString) {
    const normalizedColor = colorString.toUpperCase().trim();
    if (/^#([A-F0-9]{3}){1,2}$/.test(normalizedColor)) {
      let hexParts = normalizedColor.substring(1).split("");
      if (hexParts.length === 3) {
        hexParts = [hexParts[0], hexParts[0], hexParts[1], hexParts[1], hexParts[2], hexParts[2]];
      }
      const hexStr = `${hexParts.join("")}`;
      return {
        r: parseInt(hexStr.slice(0, 2), 16),
        g: parseInt(hexStr.slice(2, 4), 16),
        b: parseInt(hexStr.slice(4, 6), 16),
        a: 1
      };
    }
    const rgbMatch = normalizedColor.match(/^RGBA?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d*\.?\d+))?\)$/);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1], 10),
        g: parseInt(rgbMatch[2], 10),
        b: parseInt(rgbMatch[3], 10),
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
        a: parseFloat(rgbMatch[4] || 1, 10)
      };
    }
    throw new Error(`Invalid color: ${colorString}`);
  }
  var trim = (string) => string.replace(/^\s+/, "").replace(/\s+$/, "");
  function objRepeat(item, times) {
    const obj = {};
    for (let i = 0; i < times; i++) {
      obj[i] = item;
    }
    return obj;
  }
  function objRepeatCb(times, cb) {
    const obj = {};
    for (let i = 0; i < times; i++) {
      obj[i] = cb(i);
    }
    return obj;
  }
  var ua = ((_globalObj$navigator = globalObj.navigator) === null || _globalObj$navigator === void 0 ? void 0 : _globalObj$navigator.userAgent) || "";
  var isMsBrowser = ua.indexOf("MSIE ") > 0 || ua.indexOf("Trident/") > 0 || ua.indexOf("Edge/") > 0;
  var noop = () => {
  };
  var RenderState = class {
    constructor(character, options, onStateChange = noop) {
      this._mutationChains = [];
      this._onStateChange = onStateChange;
      this.state = {
        options: {
          drawingFadeDuration: options.drawingFadeDuration,
          drawingWidth: options.drawingWidth,
          drawingColor: colorStringToVals(options.drawingColor),
          strokeColor: colorStringToVals(options.strokeColor),
          outlineColor: colorStringToVals(options.outlineColor),
          radicalColor: colorStringToVals(options.radicalColor || options.strokeColor),
          highlightColor: colorStringToVals(options.highlightColor)
        },
        character: {
          main: {
            opacity: options.showCharacter ? 1 : 0,
            strokes: {}
          },
          outline: {
            opacity: options.showOutline ? 1 : 0,
            strokes: {}
          },
          highlight: {
            opacity: 1,
            strokes: {}
          }
        },
        userStrokes: null
      };
      for (let i = 0; i < character.strokes.length; i++) {
        this.state.character.main.strokes[i] = {
          opacity: 1,
          displayPortion: 1
        };
        this.state.character.outline.strokes[i] = {
          opacity: 1,
          displayPortion: 1
        };
        this.state.character.highlight.strokes[i] = {
          opacity: 0,
          displayPortion: 1
        };
      }
    }
    overwriteOnStateChange(onStateChange) {
      this._onStateChange = onStateChange;
    }
    updateState(stateChanges) {
      const nextState = copyAndMergeDeep(this.state, stateChanges);
      this._onStateChange(nextState, this.state);
      this.state = nextState;
    }
    run(mutations, options = {}) {
      const scopes = mutations.map((mut) => mut.scope);
      this.cancelMutations(scopes);
      return new Promise((resolve) => {
        const mutationChain = {
          _isActive: true,
          _index: 0,
          _resolve: resolve,
          _mutations: mutations,
          _loop: options.loop,
          _scopes: scopes
        };
        this._mutationChains.push(mutationChain);
        this._run(mutationChain);
      });
    }
    _run(mutationChain) {
      if (!mutationChain._isActive) {
        return;
      }
      const mutations = mutationChain._mutations;
      if (mutationChain._index >= mutations.length) {
        if (mutationChain._loop) {
          mutationChain._index = 0;
        } else {
          mutationChain._isActive = false;
          this._mutationChains = this._mutationChains.filter((chain) => chain !== mutationChain);
          mutationChain._resolve({
            canceled: false
          });
          return;
        }
      }
      const activeMutation = mutationChain._mutations[mutationChain._index];
      activeMutation.run(this).then(() => {
        if (mutationChain._isActive) {
          mutationChain._index++;
          this._run(mutationChain);
        }
      });
    }
    _getActiveMutations() {
      return this._mutationChains.map((chain) => chain._mutations[chain._index]);
    }
    pauseAll() {
      this._getActiveMutations().forEach((mutation) => mutation.pause());
    }
    resumeAll() {
      this._getActiveMutations().forEach((mutation) => mutation.resume());
    }
    cancelMutations(scopesToCancel) {
      for (const chain of this._mutationChains) {
        for (const chainId of chain._scopes) {
          for (const scopeToCancel of scopesToCancel) {
            if (chainId.startsWith(scopeToCancel) || scopeToCancel.startsWith(chainId)) {
              this._cancelMutationChain(chain);
            }
          }
        }
      }
    }
    cancelAll() {
      this.cancelMutations([""]);
    }
    _cancelMutationChain(mutationChain) {
      var _mutationChain$_resol;
      mutationChain._isActive = false;
      for (let i = mutationChain._index; i < mutationChain._mutations.length; i++) {
        mutationChain._mutations[i].cancel(this);
      }
      (_mutationChain$_resol = mutationChain._resolve) === null || _mutationChain$_resol === void 0 ? void 0 : _mutationChain$_resol.call(mutationChain, {
        canceled: true
      });
      this._mutationChains = this._mutationChains.filter((chain) => chain !== mutationChain);
    }
  };
  var subtract = (p1, p2) => ({
    x: p1.x - p2.x,
    y: p1.y - p2.y
  });
  var magnitude = (point) => Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
  var distance = (point1, point2) => magnitude(subtract(point1, point2));
  var equals = (point1, point2) => point1.x === point2.x && point1.y === point2.y;
  var round = (point, precision = 1) => {
    const multiplier = precision * 10;
    return {
      x: Math.round(multiplier * point.x) / multiplier,
      y: Math.round(multiplier * point.y) / multiplier
    };
  };
  var length = (points) => {
    let lastPoint = points[0];
    const pointsSansFirst = points.slice(1);
    return pointsSansFirst.reduce((acc, point) => {
      const dist = distance(point, lastPoint);
      lastPoint = point;
      return acc + dist;
    }, 0);
  };
  var cosineSimilarity = (point1, point2) => {
    const rawDotProduct = point1.x * point2.x + point1.y * point2.y;
    return rawDotProduct / magnitude(point1) / magnitude(point2);
  };
  var _extendPointOnLine = (p1, p2, dist) => {
    const vect = subtract(p2, p1);
    const norm = dist / magnitude(vect);
    return {
      x: p2.x + norm * vect.x,
      y: p2.y + norm * vect.y
    };
  };
  var frechetDist = (curve1, curve2) => {
    const longCurve = curve1.length >= curve2.length ? curve1 : curve2;
    const shortCurve = curve1.length >= curve2.length ? curve2 : curve1;
    const calcVal = (i, j, prevResultsCol2, curResultsCol) => {
      if (i === 0 && j === 0) {
        return distance(longCurve[0], shortCurve[0]);
      }
      if (i > 0 && j === 0) {
        return Math.max(prevResultsCol2[0], distance(longCurve[i], shortCurve[0]));
      }
      const lastResult = curResultsCol[curResultsCol.length - 1];
      if (i === 0 && j > 0) {
        return Math.max(lastResult, distance(longCurve[0], shortCurve[j]));
      }
      return Math.max(Math.min(prevResultsCol2[j], prevResultsCol2[j - 1], lastResult), distance(longCurve[i], shortCurve[j]));
    };
    let prevResultsCol = [];
    for (let i = 0; i < longCurve.length; i++) {
      const curResultsCol = [];
      for (let j = 0; j < shortCurve.length; j++) {
        curResultsCol.push(calcVal(i, j, prevResultsCol, curResultsCol));
      }
      prevResultsCol = curResultsCol;
    }
    return prevResultsCol[shortCurve.length - 1];
  };
  var subdivideCurve = (curve, maxLen = 0.05) => {
    const newCurve = curve.slice(0, 1);
    for (const point of curve.slice(1)) {
      const prevPoint = newCurve[newCurve.length - 1];
      const segLen = distance(point, prevPoint);
      if (segLen > maxLen) {
        const numNewPoints = Math.ceil(segLen / maxLen);
        const newSegLen = segLen / numNewPoints;
        for (let i = 0; i < numNewPoints; i++) {
          newCurve.push(_extendPointOnLine(point, prevPoint, -1 * newSegLen * (i + 1)));
        }
      } else {
        newCurve.push(point);
      }
    }
    return newCurve;
  };
  var outlineCurve = (curve, numPoints = 30) => {
    const curveLen = length(curve);
    const segmentLen = curveLen / (numPoints - 1);
    const outlinePoints = [curve[0]];
    const endPoint = arrLast(curve);
    const remainingCurvePoints = curve.slice(1);
    for (let i = 0; i < numPoints - 2; i++) {
      let lastPoint = arrLast(outlinePoints);
      let remainingDist = segmentLen;
      let outlinePointFound = false;
      while (!outlinePointFound) {
        const nextPointDist = distance(lastPoint, remainingCurvePoints[0]);
        if (nextPointDist < remainingDist) {
          remainingDist -= nextPointDist;
          lastPoint = remainingCurvePoints.shift();
        } else {
          const nextPoint = _extendPointOnLine(lastPoint, remainingCurvePoints[0], remainingDist - nextPointDist);
          outlinePoints.push(nextPoint);
          outlinePointFound = true;
        }
      }
    }
    outlinePoints.push(endPoint);
    return outlinePoints;
  };
  var normalizeCurve = (curve) => {
    const outlinedCurve = outlineCurve(curve);
    const meanX = average(outlinedCurve.map((point) => point.x));
    const meanY = average(outlinedCurve.map((point) => point.y));
    const mean = {
      x: meanX,
      y: meanY
    };
    const translatedCurve = outlinedCurve.map((point) => subtract(point, mean));
    const scale = Math.sqrt(average([Math.pow(translatedCurve[0].x, 2) + Math.pow(translatedCurve[0].y, 2), Math.pow(arrLast(translatedCurve).x, 2) + Math.pow(arrLast(translatedCurve).y, 2)]));
    const scaledCurve = translatedCurve.map((point) => ({
      x: point.x / scale,
      y: point.y / scale
    }));
    return subdivideCurve(scaledCurve);
  };
  var rotate = (curve, theta) => {
    return curve.map((point) => ({
      x: Math.cos(theta) * point.x - Math.sin(theta) * point.y,
      y: Math.sin(theta) * point.x + Math.cos(theta) * point.y
    }));
  };
  var _filterParallelPoints = (points) => {
    if (points.length < 3)
      return points;
    const filteredPoints = [points[0], points[1]];
    points.slice(2).forEach((point) => {
      const numFilteredPoints = filteredPoints.length;
      const curVect = subtract(point, filteredPoints[numFilteredPoints - 1]);
      const prevVect = subtract(filteredPoints[numFilteredPoints - 1], filteredPoints[numFilteredPoints - 2]);
      const isParallel = curVect.y * prevVect.x - curVect.x * prevVect.y === 0;
      if (isParallel) {
        filteredPoints.pop();
      }
      filteredPoints.push(point);
    });
    return filteredPoints;
  };
  function getPathString(points, close = false) {
    const start = round(points[0]);
    const remainingPoints = points.slice(1);
    let pathString = `M ${start.x} ${start.y}`;
    remainingPoints.forEach((point) => {
      const roundedPoint = round(point);
      pathString += ` L ${roundedPoint.x} ${roundedPoint.y}`;
    });
    if (close) {
      pathString += "Z";
    }
    return pathString;
  }
  var extendStart = (points, dist) => {
    const filteredPoints = _filterParallelPoints(points);
    if (filteredPoints.length < 2)
      return filteredPoints;
    const p1 = filteredPoints[1];
    const p2 = filteredPoints[0];
    const newStart = _extendPointOnLine(p1, p2, dist);
    const extendedPoints = filteredPoints.slice(1);
    extendedPoints.unshift(newStart);
    return extendedPoints;
  };
  var Stroke = class {
    constructor(path, points, strokeNum, isInRadical = false) {
      this.path = path;
      this.points = points;
      this.strokeNum = strokeNum;
      this.isInRadical = isInRadical;
    }
    getStartingPoint() {
      return this.points[0];
    }
    getEndingPoint() {
      return this.points[this.points.length - 1];
    }
    getLength() {
      return length(this.points);
    }
    getVectors() {
      let lastPoint = this.points[0];
      const pointsSansFirst = this.points.slice(1);
      return pointsSansFirst.map((point) => {
        const vector = subtract(point, lastPoint);
        lastPoint = point;
        return vector;
      });
    }
    getDistance(point) {
      const distances = this.points.map((strokePoint) => distance(strokePoint, point));
      return Math.min(...distances);
    }
    getAverageDistance(points) {
      const totalDist = points.reduce((acc, point) => acc + this.getDistance(point), 0);
      return totalDist / points.length;
    }
  };
  var Character = class {
    constructor(symbol, strokes) {
      this.symbol = symbol;
      this.strokes = strokes;
    }
  };
  function generateStrokes({
    radStrokes,
    strokes,
    medians
  }) {
    const isInRadical = (strokeNum) => {
      var _radStrokes$indexOf;
      return ((_radStrokes$indexOf = radStrokes === null || radStrokes === void 0 ? void 0 : radStrokes.indexOf(strokeNum)) !== null && _radStrokes$indexOf !== void 0 ? _radStrokes$indexOf : -1) >= 0;
    };
    return strokes.map((path, index) => {
      const points = medians[index].map((pointData) => {
        const [x, y] = pointData;
        return {
          x,
          y
        };
      });
      return new Stroke(path, points, index, isInRadical(index));
    });
  }
  function parseCharData(symbol, charJson) {
    const strokes = generateStrokes(charJson);
    return new Character(symbol, strokes);
  }
  var CHARACTER_BOUNDS = [{
    x: 0,
    y: -124
  }, {
    x: 1024,
    y: 900
  }];
  var [from, to] = CHARACTER_BOUNDS;
  var preScaledWidth = to.x - from.x;
  var preScaledHeight = to.y - from.y;
  var Positioner = class {
    constructor(options) {
      const {
        padding,
        width,
        height
      } = options;
      this.padding = padding;
      this.width = width;
      this.height = height;
      const effectiveWidth = width - 2 * padding;
      const effectiveHeight = height - 2 * padding;
      const scaleX = effectiveWidth / preScaledWidth;
      const scaleY = effectiveHeight / preScaledHeight;
      this.scale = Math.min(scaleX, scaleY);
      const xCenteringBuffer = padding + (effectiveWidth - this.scale * preScaledWidth) / 2;
      const yCenteringBuffer = padding + (effectiveHeight - this.scale * preScaledHeight) / 2;
      this.xOffset = -1 * from.x * this.scale + xCenteringBuffer;
      this.yOffset = -1 * from.y * this.scale + yCenteringBuffer;
    }
    convertExternalPoint(point) {
      const x = (point.x - this.xOffset) / this.scale;
      const y = (this.height - this.yOffset - point.y) / this.scale;
      return {
        x,
        y
      };
    }
  };
  var COSINE_SIMILARITY_THRESHOLD = 0;
  var START_AND_END_DIST_THRESHOLD = 250;
  var FRECHET_THRESHOLD = 0.4;
  var MIN_LEN_THRESHOLD = 0.35;
  function strokeMatches(userStroke, character, strokeNum, options = {}) {
    const strokes = character.strokes;
    const points = stripDuplicates(userStroke.points);
    if (points.length < 2) {
      return {
        isMatch: false,
        meta: {
          isStrokeBackwards: false
        }
      };
    }
    const {
      isMatch,
      meta,
      avgDist
    } = getMatchData(points, strokes[strokeNum], options);
    if (!isMatch) {
      return {
        isMatch,
        meta
      };
    }
    const laterStrokes = strokes.slice(strokeNum + 1);
    let closestMatchDist = avgDist;
    for (let i = 0; i < laterStrokes.length; i++) {
      const {
        isMatch: isMatch2,
        avgDist: avgDist2
      } = getMatchData(points, laterStrokes[i], {
        ...options,
        checkBackwards: false
      });
      if (isMatch2 && avgDist2 < closestMatchDist) {
        closestMatchDist = avgDist2;
      }
    }
    if (closestMatchDist < avgDist) {
      const leniencyAdjustment = 0.6 * (closestMatchDist + avgDist) / (2 * avgDist);
      const {
        isMatch: isMatch2,
        meta: meta2
      } = getMatchData(points, strokes[strokeNum], {
        ...options,
        leniency: (options.leniency || 1) * leniencyAdjustment
      });
      return {
        isMatch: isMatch2,
        meta: meta2
      };
    }
    return {
      isMatch,
      meta
    };
  }
  var startAndEndMatches = (points, closestStroke, leniency) => {
    const startingDist = distance(closestStroke.getStartingPoint(), points[0]);
    const endingDist = distance(closestStroke.getEndingPoint(), points[points.length - 1]);
    return startingDist <= START_AND_END_DIST_THRESHOLD * leniency && endingDist <= START_AND_END_DIST_THRESHOLD * leniency;
  };
  var getEdgeVectors = (points) => {
    const vectors = [];
    let lastPoint = points[0];
    points.slice(1).forEach((point) => {
      vectors.push(subtract(point, lastPoint));
      lastPoint = point;
    });
    return vectors;
  };
  var directionMatches = (points, stroke) => {
    const edgeVectors = getEdgeVectors(points);
    const strokeVectors = stroke.getVectors();
    const similarities = edgeVectors.map((edgeVector) => {
      const strokeSimilarities = strokeVectors.map((strokeVector) => cosineSimilarity(strokeVector, edgeVector));
      return Math.max(...strokeSimilarities);
    });
    const avgSimilarity = average(similarities);
    return avgSimilarity > COSINE_SIMILARITY_THRESHOLD;
  };
  var lengthMatches = (points, stroke, leniency) => {
    return leniency * (length(points) + 25) / (stroke.getLength() + 25) >= MIN_LEN_THRESHOLD;
  };
  var stripDuplicates = (points) => {
    if (points.length < 2)
      return points;
    const [firstPoint, ...rest] = points;
    const dedupedPoints = [firstPoint];
    for (const point of rest) {
      if (!equals(point, dedupedPoints[dedupedPoints.length - 1])) {
        dedupedPoints.push(point);
      }
    }
    return dedupedPoints;
  };
  var SHAPE_FIT_ROTATIONS = [Math.PI / 16, Math.PI / 32, 0, -1 * Math.PI / 32, -1 * Math.PI / 16];
  var shapeFit = (curve1, curve2, leniency) => {
    const normCurve1 = normalizeCurve(curve1);
    const normCurve2 = normalizeCurve(curve2);
    let minDist = Infinity;
    SHAPE_FIT_ROTATIONS.forEach((theta) => {
      const dist = frechetDist(normCurve1, rotate(normCurve2, theta));
      if (dist < minDist) {
        minDist = dist;
      }
    });
    return minDist <= FRECHET_THRESHOLD * leniency;
  };
  var getMatchData = (points, stroke, options) => {
    const {
      leniency = 1,
      isOutlineVisible = false,
      checkBackwards = true,
      averageDistanceThreshold = 350
    } = options;
    const avgDist = stroke.getAverageDistance(points);
    const distMod = isOutlineVisible || stroke.strokeNum > 0 ? 0.5 : 1;
    const withinDistThresh = avgDist <= averageDistanceThreshold * distMod * leniency;
    if (!withinDistThresh) {
      return {
        isMatch: false,
        avgDist,
        meta: {
          isStrokeBackwards: false
        }
      };
    }
    const startAndEndMatch = startAndEndMatches(points, stroke, leniency);
    const directionMatch = directionMatches(points, stroke);
    const shapeMatch = shapeFit(points, stroke.points, leniency);
    const lengthMatch = lengthMatches(points, stroke, leniency);
    const isMatch = withinDistThresh && startAndEndMatch && directionMatch && shapeMatch && lengthMatch;
    if (checkBackwards && !isMatch) {
      const backwardsMatchData = getMatchData([...points].reverse(), stroke, {
        ...options,
        checkBackwards: false
      });
      if (backwardsMatchData.isMatch) {
        return {
          isMatch,
          avgDist,
          meta: {
            isStrokeBackwards: true
          }
        };
      }
    }
    return {
      isMatch,
      avgDist,
      meta: {
        isStrokeBackwards: false
      }
    };
  };
  var UserStroke = class {
    constructor(id, startingPoint, startingExternalPoint) {
      this.id = id;
      this.points = [startingPoint];
      this.externalPoints = [startingExternalPoint];
    }
    appendPoint(point, externalPoint) {
      this.points.push(point);
      this.externalPoints.push(externalPoint);
    }
  };
  var Delay = class {
    constructor(duration) {
      this._duration = duration;
      this._startTime = null;
      this._paused = false;
      this.scope = `delay.${duration}`;
    }
    run() {
      this._startTime = performanceNow();
      this._runningPromise = new Promise((resolve) => {
        this._resolve = resolve;
        this._timeout = setTimeout(() => this.cancel(), this._duration);
      });
      return this._runningPromise;
    }
    pause() {
      if (this._paused)
        return;
      const elapsedDelay = performance.now() - (this._startTime || 0);
      this._duration = Math.max(0, this._duration - elapsedDelay);
      clearTimeout(this._timeout);
      this._paused = true;
    }
    resume() {
      if (!this._paused)
        return;
      this._startTime = performance.now();
      this._timeout = setTimeout(() => this.cancel(), this._duration);
      this._paused = false;
    }
    cancel() {
      clearTimeout(this._timeout);
      if (this._resolve) {
        this._resolve();
      }
      this._resolve = void 0;
    }
  };
  var Mutation = class {
    /**
     *
     * @param scope a string representation of what fields this mutation affects from the state. This is used to cancel conflicting mutations
     * @param valuesOrCallable a thunk containing the value to set, or a callback which will return those values
     */
    constructor(scope, valuesOrCallable, options = {}) {
      this._tick = (timing) => {
        if (this._startPauseTime !== null) {
          return;
        }
        const progress = Math.min(1, (timing - this._startTime - this._pausedDuration) / this._duration);
        if (progress === 1) {
          this._renderState.updateState(this._values);
          this._frameHandle = void 0;
          this.cancel(this._renderState);
        } else {
          const easedProgress = ease(progress);
          const stateChanges = getPartialValues(this._startState, this._values, easedProgress);
          this._renderState.updateState(stateChanges);
          this._frameHandle = requestAnimationFrame(this._tick);
        }
      };
      this.scope = scope;
      this._valuesOrCallable = valuesOrCallable;
      this._duration = options.duration || 0;
      this._force = options.force;
      this._pausedDuration = 0;
      this._startPauseTime = null;
    }
    run(renderState) {
      if (!this._values)
        this._inflateValues(renderState);
      if (this._duration === 0)
        renderState.updateState(this._values);
      if (this._duration === 0 || isAlreadyAtEnd(renderState.state, this._values)) {
        return Promise.resolve();
      }
      this._renderState = renderState;
      this._startState = renderState.state;
      this._startTime = performance.now();
      this._frameHandle = requestAnimationFrame(this._tick);
      return new Promise((resolve) => {
        this._resolve = resolve;
      });
    }
    _inflateValues(renderState) {
      let values = this._valuesOrCallable;
      if (typeof this._valuesOrCallable === "function") {
        values = this._valuesOrCallable(renderState.state);
      }
      this._values = inflate(this.scope, values);
    }
    pause() {
      if (this._startPauseTime !== null) {
        return;
      }
      if (this._frameHandle) {
        cancelAnimationFrame(this._frameHandle);
      }
      this._startPauseTime = performance.now();
    }
    resume() {
      if (this._startPauseTime === null) {
        return;
      }
      this._frameHandle = requestAnimationFrame(this._tick);
      this._pausedDuration += performance.now() - this._startPauseTime;
      this._startPauseTime = null;
    }
    cancel(renderState) {
      var _this$_resolve;
      (_this$_resolve = this._resolve) === null || _this$_resolve === void 0 ? void 0 : _this$_resolve.call(this);
      this._resolve = void 0;
      cancelAnimationFrame(this._frameHandle || -1);
      this._frameHandle = void 0;
      if (this._force) {
        if (!this._values)
          this._inflateValues(renderState);
        renderState.updateState(this._values);
      }
    }
  };
  Mutation.Delay = Delay;
  function getPartialValues(startValues, endValues, progress) {
    const target = {};
    for (const key in endValues) {
      const endValue = endValues[key];
      const startValue = startValues === null || startValues === void 0 ? void 0 : startValues[key];
      if (typeof startValue === "number" && typeof endValue === "number" && endValue >= 0) {
        target[key] = progress * (endValue - startValue) + startValue;
      } else {
        target[key] = getPartialValues(startValue, endValue, progress);
      }
    }
    return target;
  }
  function isAlreadyAtEnd(startValues, endValues) {
    for (const key in endValues) {
      const endValue = endValues[key];
      const startValue = startValues === null || startValues === void 0 ? void 0 : startValues[key];
      if (endValue >= 0) {
        if (endValue !== startValue) {
          return false;
        }
      } else if (!isAlreadyAtEnd(startValue, endValue)) {
        return false;
      }
    }
    return true;
  }
  var ease = (x) => -Math.cos(x * Math.PI) / 2 + 0.5;
  var showStrokes = (charName, character, duration) => {
    return [new Mutation(`character.${charName}.strokes`, objRepeat({
      opacity: 1,
      displayPortion: 1
    }, character.strokes.length), {
      duration,
      force: true
    })];
  };
  var showCharacter = (charName, character, duration) => {
    return [new Mutation(`character.${charName}`, {
      opacity: 1,
      strokes: objRepeat({
        opacity: 1,
        displayPortion: 1
      }, character.strokes.length)
    }, {
      duration,
      force: true
    })];
  };
  var hideCharacter = (charName, character, duration) => {
    return [new Mutation(`character.${charName}.opacity`, 0, {
      duration,
      force: true
    }), ...showStrokes(charName, character, 0)];
  };
  var updateColor = (colorName, colorVal, duration) => {
    return [new Mutation(`options.${colorName}`, colorVal, {
      duration
    })];
  };
  var highlightStroke = (stroke, color, speed) => {
    const strokeNum = stroke.strokeNum;
    const duration = (stroke.getLength() + 600) / (3 * speed);
    return [new Mutation("options.highlightColor", color), new Mutation("character.highlight", {
      opacity: 1,
      strokes: {
        [strokeNum]: {
          displayPortion: 0,
          opacity: 0
        }
      }
    }), new Mutation(`character.highlight.strokes.${strokeNum}`, {
      displayPortion: 1,
      opacity: 1
    }, {
      duration
    }), new Mutation(`character.highlight.strokes.${strokeNum}.opacity`, 0, {
      duration,
      force: true
    })];
  };
  var animateStroke = (charName, stroke, speed) => {
    const strokeNum = stroke.strokeNum;
    const duration = (stroke.getLength() + 600) / (3 * speed);
    return [new Mutation(`character.${charName}`, {
      opacity: 1,
      strokes: {
        [strokeNum]: {
          displayPortion: 0,
          opacity: 1
        }
      }
    }), new Mutation(`character.${charName}.strokes.${strokeNum}.displayPortion`, 1, {
      duration
    })];
  };
  var animateSingleStroke = (charName, character, strokeNum, speed) => {
    const mutationStateFunc = (state) => {
      const curCharState = state.character[charName];
      const mutationState = {
        opacity: 1,
        strokes: {}
      };
      for (let i = 0; i < character.strokes.length; i++) {
        mutationState.strokes[i] = {
          opacity: curCharState.opacity * curCharState.strokes[i].opacity
        };
      }
      return mutationState;
    };
    const stroke = character.strokes[strokeNum];
    return [new Mutation(`character.${charName}`, mutationStateFunc), ...animateStroke(charName, stroke, speed)];
  };
  var showStroke = (charName, strokeNum, duration) => {
    return [new Mutation(`character.${charName}.strokes.${strokeNum}`, {
      displayPortion: 1,
      opacity: 1
    }, {
      duration,
      force: true
    })];
  };
  var animateCharacter = (charName, character, fadeDuration, speed, delayBetweenStrokes) => {
    let mutations = hideCharacter(charName, character, fadeDuration);
    mutations = mutations.concat(showStrokes(charName, character, 0));
    mutations.push(new Mutation(`character.${charName}`, {
      opacity: 1,
      strokes: objRepeat({
        opacity: 0
      }, character.strokes.length)
    }, {
      force: true
    }));
    character.strokes.forEach((stroke, i) => {
      if (i > 0)
        mutations.push(new Mutation.Delay(delayBetweenStrokes));
      mutations = mutations.concat(animateStroke(charName, stroke, speed));
    });
    return mutations;
  };
  var animateCharacterLoop = (charName, character, fadeDuration, speed, delayBetweenStrokes, delayBetweenLoops) => {
    const mutations = animateCharacter(charName, character, fadeDuration, speed, delayBetweenStrokes);
    mutations.push(new Mutation.Delay(delayBetweenLoops));
    return mutations;
  };
  var startQuiz = (character, fadeDuration, startStrokeNum) => {
    return [...hideCharacter("main", character, fadeDuration), new Mutation("character.highlight", {
      opacity: 1,
      strokes: objRepeat({
        opacity: 0
      }, character.strokes.length)
    }, {
      force: true
    }), new Mutation("character.main", {
      opacity: 1,
      strokes: objRepeatCb(character.strokes.length, (i) => ({
        opacity: i < startStrokeNum ? 1 : 0
      }))
    }, {
      force: true
    })];
  };
  var startUserStroke = (id, point) => {
    return [new Mutation("quiz.activeUserStrokeId", id, {
      force: true
    }), new Mutation(`userStrokes.${id}`, {
      points: [point],
      opacity: 1
    }, {
      force: true
    })];
  };
  var updateUserStroke = (userStrokeId, points) => {
    return [new Mutation(`userStrokes.${userStrokeId}.points`, points, {
      force: true
    })];
  };
  var hideUserStroke = (userStrokeId, duration) => {
    return [new Mutation(`userStrokes.${userStrokeId}.opacity`, 0, {
      duration
    })];
  };
  var removeAllUserStrokes = (userStrokeIds) => {
    return (userStrokeIds === null || userStrokeIds === void 0 ? void 0 : userStrokeIds.map((userStrokeId) => new Mutation(`userStrokes.${userStrokeId}`, null, {
      force: true
    }))) || [];
  };
  var highlightCompleteChar = (character, color, duration) => {
    return [new Mutation("options.highlightColor", color), ...hideCharacter("highlight", character), ...showCharacter("highlight", character, duration / 2), ...hideCharacter("highlight", character, duration / 2)];
  };
  var getDrawnPath = (userStroke) => ({
    pathString: getPathString(userStroke.externalPoints),
    points: userStroke.points.map((point) => round(point))
  });
  var Quiz = class {
    constructor(character, renderState, positioner) {
      this._currentStrokeIndex = 0;
      this._mistakesOnStroke = 0;
      this._totalMistakes = 0;
      this._character = character;
      this._renderState = renderState;
      this._isActive = false;
      this._positioner = positioner;
    }
    startQuiz(options) {
      if (this._userStrokesIds) {
        this._renderState.run(removeAllUserStrokes(this._userStrokesIds));
      }
      this._userStrokesIds = [];
      this._isActive = true;
      this._options = options;
      const startIndex = fixIndex(options.quizStartStrokeNum, this._character.strokes.length);
      this._currentStrokeIndex = Math.min(startIndex, this._character.strokes.length - 1);
      this._mistakesOnStroke = 0;
      this._totalMistakes = 0;
      return this._renderState.run(startQuiz(this._character, options.strokeFadeDuration, this._currentStrokeIndex));
    }
    startUserStroke(externalPoint) {
      var _this$_userStrokesIds;
      if (!this._isActive) {
        return null;
      }
      if (this._userStroke) {
        return this.endUserStroke();
      }
      const point = this._positioner.convertExternalPoint(externalPoint);
      const strokeId = counter();
      this._userStroke = new UserStroke(strokeId, point, externalPoint);
      (_this$_userStrokesIds = this._userStrokesIds) === null || _this$_userStrokesIds === void 0 ? void 0 : _this$_userStrokesIds.push(strokeId);
      return this._renderState.run(startUserStroke(strokeId, point));
    }
    continueUserStroke(externalPoint) {
      if (!this._userStroke) {
        return Promise.resolve();
      }
      const point = this._positioner.convertExternalPoint(externalPoint);
      this._userStroke.appendPoint(point, externalPoint);
      const nextPoints = this._userStroke.points.slice(0);
      return this._renderState.run(updateUserStroke(this._userStroke.id, nextPoints));
    }
    setPositioner(positioner) {
      this._positioner = positioner;
    }
    endUserStroke() {
      var _this$_options$drawin;
      if (!this._userStroke)
        return;
      this._renderState.run(hideUserStroke(this._userStroke.id, (_this$_options$drawin = this._options.drawingFadeDuration) !== null && _this$_options$drawin !== void 0 ? _this$_options$drawin : 300));
      if (this._userStroke.points.length === 1) {
        this._userStroke = void 0;
        return;
      }
      const {
        acceptBackwardsStrokes,
        markStrokeCorrectAfterMisses
      } = this._options;
      const currentStroke = this._getCurrentStroke();
      const {
        isMatch,
        meta
      } = strokeMatches(this._userStroke, this._character, this._currentStrokeIndex, {
        isOutlineVisible: this._renderState.state.character.outline.opacity > 0,
        leniency: this._options.leniency,
        averageDistanceThreshold: this._options.averageDistanceThreshold
      });
      const isForceAccepted = markStrokeCorrectAfterMisses && this._mistakesOnStroke + 1 >= markStrokeCorrectAfterMisses;
      const isAccepted = isMatch || isForceAccepted || meta.isStrokeBackwards && acceptBackwardsStrokes;
      if (isAccepted) {
        this._handleSuccess(meta);
      } else {
        this._handleFailure(meta);
        const {
          showHintAfterMisses,
          highlightColor,
          strokeHighlightSpeed
        } = this._options;
        if (showHintAfterMisses !== false && this._mistakesOnStroke >= showHintAfterMisses) {
          this._renderState.run(highlightStroke(currentStroke, colorStringToVals(highlightColor), strokeHighlightSpeed));
        }
      }
      this._userStroke = void 0;
    }
    cancel() {
      this._isActive = false;
      if (this._userStrokesIds) {
        this._renderState.run(removeAllUserStrokes(this._userStrokesIds));
      }
    }
    _getStrokeData({
      isCorrect,
      meta
    }) {
      return {
        character: this._character.symbol,
        strokeNum: this._currentStrokeIndex,
        mistakesOnStroke: this._mistakesOnStroke,
        totalMistakes: this._totalMistakes,
        strokesRemaining: this._character.strokes.length - this._currentStrokeIndex - (isCorrect ? 1 : 0),
        drawnPath: getDrawnPath(this._userStroke),
        isBackwards: meta.isStrokeBackwards
      };
    }
    nextStroke() {
      if (!this._options)
        return;
      const {
        strokes,
        symbol
      } = this._character;
      const {
        onComplete,
        highlightOnComplete,
        strokeFadeDuration,
        highlightCompleteColor,
        highlightColor,
        strokeHighlightDuration
      } = this._options;
      let animation = showStroke("main", this._currentStrokeIndex, strokeFadeDuration);
      this._mistakesOnStroke = 0;
      this._currentStrokeIndex += 1;
      const isComplete = this._currentStrokeIndex === strokes.length;
      if (isComplete) {
        this._isActive = false;
        onComplete === null || onComplete === void 0 ? void 0 : onComplete({
          character: symbol,
          totalMistakes: this._totalMistakes
        });
        if (highlightOnComplete) {
          animation = animation.concat(highlightCompleteChar(this._character, colorStringToVals(highlightCompleteColor || highlightColor), (strokeHighlightDuration || 0) * 2));
        }
      }
      this._renderState.run(animation);
    }
    _handleSuccess(meta) {
      if (!this._options)
        return;
      const {
        onCorrectStroke
      } = this._options;
      onCorrectStroke === null || onCorrectStroke === void 0 ? void 0 : onCorrectStroke({
        ...this._getStrokeData({
          isCorrect: true,
          meta
        })
      });
      this.nextStroke();
    }
    _handleFailure(meta) {
      var _this$_options$onMist, _this$_options;
      this._mistakesOnStroke += 1;
      this._totalMistakes += 1;
      (_this$_options$onMist = (_this$_options = this._options).onMistake) === null || _this$_options$onMist === void 0 ? void 0 : _this$_options$onMist.call(_this$_options, this._getStrokeData({
        isCorrect: false,
        meta
      }));
    }
    _getCurrentStroke() {
      return this._character.strokes[this._currentStrokeIndex];
    }
  };
  function createElm(elmType) {
    return document.createElementNS("http://www.w3.org/2000/svg", elmType);
  }
  function attr(elm, name, value) {
    elm.setAttributeNS(null, name, value);
  }
  function attrs(elm, attrsMap) {
    Object.keys(attrsMap).forEach((attrName) => attr(elm, attrName, attrsMap[attrName]));
  }
  function urlIdRef(id) {
    let prefix = "";
    if (window.location && window.location.href) {
      prefix = window.location.href.replace(/#[^#]*$/, "").replace(/"/gi, "%22");
    }
    return `url("${prefix}#${id}")`;
  }
  function removeElm(elm) {
    var _elm$parentNode;
    elm === null || elm === void 0 ? void 0 : (_elm$parentNode = elm.parentNode) === null || _elm$parentNode === void 0 ? void 0 : _elm$parentNode.removeChild(elm);
  }
  var StrokeRendererBase = class _StrokeRendererBase {
    constructor(stroke) {
      this.stroke = stroke;
      this._pathLength = stroke.getLength() + _StrokeRendererBase.STROKE_WIDTH / 2;
    }
    _getStrokeDashoffset(displayPortion) {
      return this._pathLength * 0.999 * (1 - displayPortion);
    }
    _getColor({
      strokeColor,
      radicalColor
    }) {
      return radicalColor && this.stroke.isInRadical ? radicalColor : strokeColor;
    }
  };
  StrokeRendererBase.STROKE_WIDTH = 200;
  var STROKE_WIDTH = 200;
  var StrokeRenderer = class extends StrokeRendererBase {
    constructor(stroke) {
      super(stroke);
      this._oldProps = void 0;
    }
    mount(target) {
      this._animationPath = createElm("path");
      this._clip = createElm("clipPath");
      this._strokePath = createElm("path");
      const maskId = `mask-${counter()}`;
      attr(this._clip, "id", maskId);
      attr(this._strokePath, "d", this.stroke.path);
      this._animationPath.style.opacity = "0";
      attr(this._animationPath, "clip-path", urlIdRef(maskId));
      const extendedMaskPoints = extendStart(this.stroke.points, STROKE_WIDTH / 2);
      attr(this._animationPath, "d", getPathString(extendedMaskPoints));
      attrs(this._animationPath, {
        stroke: "#FFFFFF",
        "stroke-width": STROKE_WIDTH.toString(),
        fill: "none",
        "stroke-linecap": "round",
        "stroke-linejoin": "miter",
        "stroke-dasharray": `${this._pathLength},${this._pathLength}`
      });
      this._clip.appendChild(this._strokePath);
      target.defs.appendChild(this._clip);
      target.svg.appendChild(this._animationPath);
      return this;
    }
    render(props) {
      var _this$_oldProps, _this$_oldProps2;
      if (props === this._oldProps || !this._animationPath) {
        return;
      }
      if (props.displayPortion !== ((_this$_oldProps = this._oldProps) === null || _this$_oldProps === void 0 ? void 0 : _this$_oldProps.displayPortion)) {
        this._animationPath.style.strokeDashoffset = this._getStrokeDashoffset(props.displayPortion).toString();
      }
      const color = this._getColor(props);
      if (!this._oldProps || color !== this._getColor(this._oldProps)) {
        const {
          r,
          g,
          b,
          a
        } = color;
        attrs(this._animationPath, {
          stroke: `rgba(${r},${g},${b},${a})`
        });
      }
      if (props.opacity !== ((_this$_oldProps2 = this._oldProps) === null || _this$_oldProps2 === void 0 ? void 0 : _this$_oldProps2.opacity)) {
        this._animationPath.style.opacity = props.opacity.toString();
      }
      this._oldProps = props;
    }
  };
  var CharacterRenderer = class {
    constructor(character) {
      this._oldProps = void 0;
      this._strokeRenderers = character.strokes.map((stroke) => new StrokeRenderer(stroke));
    }
    mount(target) {
      const subTarget = target.createSubRenderTarget();
      this._group = subTarget.svg;
      this._strokeRenderers.forEach((strokeRenderer) => {
        strokeRenderer.mount(subTarget);
      });
    }
    render(props) {
      var _this$_oldProps, _this$_oldProps3;
      if (props === this._oldProps || !this._group) {
        return;
      }
      const {
        opacity,
        strokes,
        strokeColor,
        radicalColor = null
      } = props;
      if (opacity !== ((_this$_oldProps = this._oldProps) === null || _this$_oldProps === void 0 ? void 0 : _this$_oldProps.opacity)) {
        this._group.style.opacity = opacity.toString();
        if (!isMsBrowser) {
          var _this$_oldProps2;
          if (opacity === 0) {
            this._group.style.display = "none";
          } else if (((_this$_oldProps2 = this._oldProps) === null || _this$_oldProps2 === void 0 ? void 0 : _this$_oldProps2.opacity) === 0) {
            this._group.style.removeProperty("display");
          }
        }
      }
      const colorsChanged = !this._oldProps || strokeColor !== this._oldProps.strokeColor || radicalColor !== this._oldProps.radicalColor;
      if (colorsChanged || strokes !== ((_this$_oldProps3 = this._oldProps) === null || _this$_oldProps3 === void 0 ? void 0 : _this$_oldProps3.strokes)) {
        for (let i = 0; i < this._strokeRenderers.length; i++) {
          var _this$_oldProps4;
          if (!colorsChanged && (_this$_oldProps4 = this._oldProps) !== null && _this$_oldProps4 !== void 0 && _this$_oldProps4.strokes && strokes[i] === this._oldProps.strokes[i]) {
            continue;
          }
          this._strokeRenderers[i].render({
            strokeColor,
            radicalColor,
            opacity: strokes[i].opacity,
            displayPortion: strokes[i].displayPortion
          });
        }
      }
      this._oldProps = props;
    }
  };
  var UserStrokeRenderer = class {
    constructor() {
      this._oldProps = void 0;
    }
    mount(target) {
      this._path = createElm("path");
      target.svg.appendChild(this._path);
    }
    render(props) {
      var _this$_oldProps, _this$_oldProps2, _this$_oldProps3, _this$_oldProps4;
      if (!this._path || props === this._oldProps) {
        return;
      }
      if (props.strokeColor !== ((_this$_oldProps = this._oldProps) === null || _this$_oldProps === void 0 ? void 0 : _this$_oldProps.strokeColor) || props.strokeWidth !== ((_this$_oldProps2 = this._oldProps) === null || _this$_oldProps2 === void 0 ? void 0 : _this$_oldProps2.strokeWidth)) {
        const {
          r,
          g,
          b,
          a
        } = props.strokeColor;
        attrs(this._path, {
          fill: "none",
          stroke: `rgba(${r},${g},${b},${a})`,
          "stroke-width": props.strokeWidth.toString(),
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        });
      }
      if (props.opacity !== ((_this$_oldProps3 = this._oldProps) === null || _this$_oldProps3 === void 0 ? void 0 : _this$_oldProps3.opacity)) {
        attr(this._path, "opacity", props.opacity.toString());
      }
      if (props.points !== ((_this$_oldProps4 = this._oldProps) === null || _this$_oldProps4 === void 0 ? void 0 : _this$_oldProps4.points)) {
        attr(this._path, "d", getPathString(props.points));
      }
      this._oldProps = props;
    }
    destroy() {
      removeElm(this._path);
    }
  };
  var HanziWriterRenderer = class {
    constructor(character, positioner) {
      this._character = character;
      this._positioner = positioner;
      this._mainCharRenderer = new CharacterRenderer(character);
      this._outlineCharRenderer = new CharacterRenderer(character);
      this._highlightCharRenderer = new CharacterRenderer(character);
      this._userStrokeRenderers = {};
    }
    mount(target) {
      const positionedTarget = target.createSubRenderTarget();
      const group = positionedTarget.svg;
      const {
        xOffset,
        yOffset,
        height,
        scale
      } = this._positioner;
      attr(group, "transform", `translate(${xOffset}, ${height - yOffset}) scale(${scale}, ${-1 * scale})`);
      this._outlineCharRenderer.mount(positionedTarget);
      this._mainCharRenderer.mount(positionedTarget);
      this._highlightCharRenderer.mount(positionedTarget);
      this._positionedTarget = positionedTarget;
    }
    render(props) {
      const {
        main,
        outline,
        highlight
      } = props.character;
      const {
        outlineColor,
        radicalColor,
        highlightColor,
        strokeColor,
        drawingWidth,
        drawingColor
      } = props.options;
      this._outlineCharRenderer.render({
        opacity: outline.opacity,
        strokes: outline.strokes,
        strokeColor: outlineColor
      });
      this._mainCharRenderer.render({
        opacity: main.opacity,
        strokes: main.strokes,
        strokeColor,
        radicalColor
      });
      this._highlightCharRenderer.render({
        opacity: highlight.opacity,
        strokes: highlight.strokes,
        strokeColor: highlightColor
      });
      const userStrokes = props.userStrokes || {};
      for (const userStrokeId in this._userStrokeRenderers) {
        if (!userStrokes[userStrokeId]) {
          var _this$_userStrokeRend;
          (_this$_userStrokeRend = this._userStrokeRenderers[userStrokeId]) === null || _this$_userStrokeRend === void 0 ? void 0 : _this$_userStrokeRend.destroy();
          delete this._userStrokeRenderers[userStrokeId];
        }
      }
      for (const userStrokeId in userStrokes) {
        const stroke = userStrokes[userStrokeId];
        if (!stroke) {
          continue;
        }
        const userStrokeProps = {
          strokeWidth: drawingWidth,
          strokeColor: drawingColor,
          ...stroke
        };
        const strokeRenderer = (() => {
          if (this._userStrokeRenderers[userStrokeId]) {
            return this._userStrokeRenderers[userStrokeId];
          }
          const newStrokeRenderer = new UserStrokeRenderer();
          newStrokeRenderer.mount(this._positionedTarget);
          this._userStrokeRenderers[userStrokeId] = newStrokeRenderer;
          return newStrokeRenderer;
        })();
        strokeRenderer.render(userStrokeProps);
      }
    }
    destroy() {
      removeElm(this._positionedTarget.svg);
      this._positionedTarget.defs.innerHTML = "";
    }
  };
  var RenderTargetBase = class {
    constructor(node) {
      this.node = node;
    }
    addPointerStartListener(callback) {
      this.node.addEventListener("mousedown", (evt) => {
        callback(this._eventify(evt, this._getMousePoint));
      });
      this.node.addEventListener("touchstart", (evt) => {
        callback(this._eventify(evt, this._getTouchPoint));
      });
    }
    addPointerMoveListener(callback) {
      this.node.addEventListener("mousemove", (evt) => {
        callback(this._eventify(evt, this._getMousePoint));
      });
      this.node.addEventListener("touchmove", (evt) => {
        callback(this._eventify(evt, this._getTouchPoint));
      });
    }
    addPointerEndListener(callback) {
      document.addEventListener("mouseup", callback);
      document.addEventListener("touchend", callback);
    }
    getBoundingClientRect() {
      return this.node.getBoundingClientRect();
    }
    updateDimensions(width, height) {
      this.node.setAttribute("width", `${width}`);
      this.node.setAttribute("height", `${height}`);
    }
    _eventify(evt, pointFunc) {
      return {
        getPoint: () => pointFunc.call(this, evt),
        preventDefault: () => evt.preventDefault()
      };
    }
    _getMousePoint(evt) {
      const {
        left,
        top
      } = this.getBoundingClientRect();
      const x = evt.clientX - left;
      const y = evt.clientY - top;
      return {
        x,
        y
      };
    }
    _getTouchPoint(evt) {
      const {
        left,
        top
      } = this.getBoundingClientRect();
      const x = evt.touches[0].clientX - left;
      const y = evt.touches[0].clientY - top;
      return {
        x,
        y
      };
    }
  };
  var RenderTarget = class _RenderTarget extends RenderTargetBase {
    constructor(svg, defs) {
      super(svg);
      this.svg = svg;
      this.defs = defs;
      if ("createSVGPoint" in svg) {
        this._pt = svg.createSVGPoint();
      }
    }
    static init(elmOrId, width = "100%", height = "100%") {
      const element = (() => {
        if (typeof elmOrId === "string") {
          return document.getElementById(elmOrId);
        }
        return elmOrId;
      })();
      if (!element) {
        throw new Error(`HanziWriter target element not found: ${elmOrId}`);
      }
      const nodeType = element.nodeName.toUpperCase();
      const svg = (() => {
        if (nodeType === "SVG" || nodeType === "G") {
          return element;
        } else {
          const svg2 = createElm("svg");
          element.appendChild(svg2);
          return svg2;
        }
      })();
      attrs(svg, {
        width,
        height
      });
      const defs = createElm("defs");
      svg.appendChild(defs);
      return new _RenderTarget(svg, defs);
    }
    createSubRenderTarget() {
      const group = createElm("g");
      this.svg.appendChild(group);
      return new _RenderTarget(group, this.defs);
    }
    _getMousePoint(evt) {
      if (this._pt) {
        this._pt.x = evt.clientX;
        this._pt.y = evt.clientY;
        if ("getScreenCTM" in this.node) {
          var _this$node$getScreenC;
          const localPt = this._pt.matrixTransform((_this$node$getScreenC = this.node.getScreenCTM()) === null || _this$node$getScreenC === void 0 ? void 0 : _this$node$getScreenC.inverse());
          return {
            x: localPt.x,
            y: localPt.y
          };
        }
      }
      return super._getMousePoint.call(this, evt);
    }
    _getTouchPoint(evt) {
      if (this._pt) {
        this._pt.x = evt.touches[0].clientX;
        this._pt.y = evt.touches[0].clientY;
        if ("getScreenCTM" in this.node) {
          var _this$node$getScreenC2;
          const localPt = this._pt.matrixTransform((_this$node$getScreenC2 = this.node.getScreenCTM()) === null || _this$node$getScreenC2 === void 0 ? void 0 : _this$node$getScreenC2.inverse());
          return {
            x: localPt.x,
            y: localPt.y
          };
        }
      }
      return super._getTouchPoint(evt);
    }
  };
  var svgRenderer = {
    HanziWriterRenderer,
    createRenderTarget: RenderTarget.init
  };
  var drawPath = (ctx, points) => {
    ctx.beginPath();
    const start = points[0];
    const remainingPoints = points.slice(1);
    ctx.moveTo(start.x, start.y);
    for (const point of remainingPoints) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
  };
  var pathStringToCanvas = (pathString) => {
    const pathParts = pathString.split(/(^|\s+)(?=[A-Z])/).filter((part) => part !== " ");
    const commands = [(ctx) => ctx.beginPath()];
    for (const part of pathParts) {
      const [cmd, ...rawParams] = part.split(/\s+/);
      const params = rawParams.map((param) => parseFloat(param));
      if (cmd === "M") {
        commands.push((ctx) => ctx.moveTo(...params));
      } else if (cmd === "L") {
        commands.push((ctx) => ctx.lineTo(...params));
      } else if (cmd === "C") {
        commands.push((ctx) => ctx.bezierCurveTo(...params));
      } else if (cmd === "Q") {
        commands.push((ctx) => ctx.quadraticCurveTo(...params));
      } else
        ;
    }
    return (ctx) => commands.forEach((cmd) => cmd(ctx));
  };
  var StrokeRenderer$1 = class extends StrokeRendererBase {
    constructor(stroke, usePath2D = true) {
      super(stroke);
      if (usePath2D && Path2D) {
        this._path2D = new Path2D(this.stroke.path);
      } else {
        this._pathCmd = pathStringToCanvas(this.stroke.path);
      }
      this._extendedMaskPoints = extendStart(this.stroke.points, StrokeRendererBase.STROKE_WIDTH / 2);
    }
    render(ctx, props) {
      if (props.opacity < 0.05) {
        return;
      }
      ctx.save();
      if (this._path2D) {
        ctx.clip(this._path2D);
      } else {
        var _this$_pathCmd;
        (_this$_pathCmd = this._pathCmd) === null || _this$_pathCmd === void 0 ? void 0 : _this$_pathCmd.call(this, ctx);
        ctx.globalAlpha = 0;
        ctx.stroke();
        ctx.clip();
      }
      const {
        r,
        g,
        b,
        a
      } = this._getColor(props);
      const color = a === 1 ? `rgb(${r},${g},${b})` : `rgb(${r},${g},${b},${a})`;
      const dashOffset = this._getStrokeDashoffset(props.displayPortion);
      ctx.globalAlpha = props.opacity;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = StrokeRendererBase.STROKE_WIDTH;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.setLineDash([this._pathLength, this._pathLength], dashOffset);
      ctx.lineDashOffset = dashOffset;
      drawPath(ctx, this._extendedMaskPoints);
      ctx.restore();
    }
  };
  var CharacterRenderer$1 = class {
    constructor(character) {
      this._strokeRenderers = character.strokes.map((stroke) => new StrokeRenderer$1(stroke));
    }
    render(ctx, props) {
      if (props.opacity < 0.05)
        return;
      const {
        opacity,
        strokeColor,
        radicalColor,
        strokes
      } = props;
      for (let i = 0; i < this._strokeRenderers.length; i++) {
        this._strokeRenderers[i].render(ctx, {
          strokeColor,
          radicalColor,
          opacity: strokes[i].opacity * opacity,
          displayPortion: strokes[i].displayPortion || 0
        });
      }
    }
  };
  function renderUserStroke(ctx, props) {
    if (props.opacity < 0.05) {
      return;
    }
    const {
      opacity,
      strokeWidth,
      strokeColor,
      points
    } = props;
    const {
      r,
      g,
      b,
      a
    } = strokeColor;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    drawPath(ctx, points);
    ctx.restore();
  }
  var HanziWriterRenderer$1 = class {
    constructor(character, positioner) {
      this.destroy = noop;
      this._character = character;
      this._positioner = positioner;
      this._mainCharRenderer = new CharacterRenderer$1(character);
      this._outlineCharRenderer = new CharacterRenderer$1(character);
      this._highlightCharRenderer = new CharacterRenderer$1(character);
    }
    mount(target) {
      this._target = target;
    }
    _animationFrame(cb) {
      const {
        width,
        height,
        scale,
        xOffset,
        yOffset
      } = this._positioner;
      const ctx = this._target.getContext();
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(xOffset, height - yOffset);
      ctx.transform(1, 0, 0, -1, 0, 0);
      ctx.scale(scale, scale);
      cb(ctx);
      ctx.restore();
      if (ctx.draw) {
        ctx.draw();
      }
    }
    render(props) {
      const {
        outline,
        main,
        highlight
      } = props.character;
      const {
        outlineColor,
        strokeColor,
        radicalColor,
        highlightColor,
        drawingColor,
        drawingWidth
      } = props.options;
      this._animationFrame((ctx) => {
        this._outlineCharRenderer.render(ctx, {
          opacity: outline.opacity,
          strokes: outline.strokes,
          strokeColor: outlineColor
        });
        this._mainCharRenderer.render(ctx, {
          opacity: main.opacity,
          strokes: main.strokes,
          strokeColor,
          radicalColor
        });
        this._highlightCharRenderer.render(ctx, {
          opacity: highlight.opacity,
          strokes: highlight.strokes,
          strokeColor: highlightColor
        });
        const userStrokes = props.userStrokes || {};
        for (const userStrokeId in userStrokes) {
          const userStroke = userStrokes[userStrokeId];
          if (userStroke) {
            const userStrokeProps = {
              strokeWidth: drawingWidth,
              strokeColor: drawingColor,
              ...userStroke
            };
            renderUserStroke(ctx, userStrokeProps);
          }
        }
      });
    }
  };
  var RenderTarget$1 = class _RenderTarget$1 extends RenderTargetBase {
    constructor(canvas) {
      super(canvas);
    }
    static init(elmOrId, width = "100%", height = "100%") {
      const element = (() => {
        if (typeof elmOrId === "string") {
          return document.getElementById(elmOrId);
        }
        return elmOrId;
      })();
      if (!element) {
        throw new Error(`HanziWriter target element not found: ${elmOrId}`);
      }
      const nodeType = element.nodeName.toUpperCase();
      const canvas = (() => {
        if (nodeType === "CANVAS") {
          return element;
        }
        const canvas2 = document.createElement("canvas");
        element.appendChild(canvas2);
        return canvas2;
      })();
      canvas.setAttribute("width", width);
      canvas.setAttribute("height", height);
      return new _RenderTarget$1(canvas);
    }
    getContext() {
      return this.node.getContext("2d");
    }
  };
  var canvasRenderer = {
    HanziWriterRenderer: HanziWriterRenderer$1,
    createRenderTarget: RenderTarget$1.init
  };
  var VERSION = "2.0.1";
  var getCharDataUrl = (char) => `https://cdn.jsdelivr.net/npm/hanzi-writer-data@${VERSION}/${char}.json`;
  var defaultCharDataLoader = (char, onLoad, onError) => {
    const xhr = new XMLHttpRequest();
    if (xhr.overrideMimeType) {
      xhr.overrideMimeType("application/json");
    }
    xhr.open("GET", getCharDataUrl(char), true);
    xhr.onerror = (event) => {
      onError(xhr, event);
    };
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4)
        return;
      if (xhr.status === 200) {
        onLoad(JSON.parse(xhr.responseText));
      } else if (xhr.status !== 0 && onError) {
        onError(xhr);
      }
    };
    xhr.send(null);
  };
  var defaultOptions = {
    charDataLoader: defaultCharDataLoader,
    onLoadCharDataError: null,
    onLoadCharDataSuccess: null,
    showOutline: true,
    showCharacter: true,
    renderer: "svg",
    // positioning options
    width: 0,
    height: 0,
    padding: 20,
    // animation options
    strokeAnimationSpeed: 1,
    strokeFadeDuration: 400,
    strokeHighlightDuration: 200,
    strokeHighlightSpeed: 2,
    delayBetweenStrokes: 1e3,
    delayBetweenLoops: 2e3,
    // colors
    strokeColor: "#555",
    radicalColor: null,
    highlightColor: "#AAF",
    outlineColor: "#DDD",
    drawingColor: "#333",
    // quiz options
    leniency: 1,
    showHintAfterMisses: 3,
    highlightOnComplete: true,
    highlightCompleteColor: null,
    markStrokeCorrectAfterMisses: false,
    acceptBackwardsStrokes: false,
    quizStartStrokeNum: 0,
    averageDistanceThreshold: 350,
    // undocumented obscure options
    drawingFadeDuration: 300,
    drawingWidth: 4,
    strokeWidth: 2,
    outlineWidth: 2,
    rendererOverride: {}
  };
  var LoadingManager = class {
    constructor(options) {
      this._loadCounter = 0;
      this._isLoading = false;
      this.loadingFailed = false;
      this._options = options;
    }
    _debouncedLoad(char, count2) {
      const wrappedResolve = (data) => {
        if (count2 === this._loadCounter) {
          var _this$_resolve;
          (_this$_resolve = this._resolve) === null || _this$_resolve === void 0 ? void 0 : _this$_resolve.call(this, data);
        }
      };
      const wrappedReject = (reason) => {
        if (count2 === this._loadCounter) {
          var _this$_reject;
          (_this$_reject = this._reject) === null || _this$_reject === void 0 ? void 0 : _this$_reject.call(this, reason);
        }
      };
      const returnedData = this._options.charDataLoader(char, wrappedResolve, wrappedReject);
      if (returnedData) {
        if ("then" in returnedData) {
          returnedData.then(wrappedResolve).catch(wrappedReject);
        } else {
          wrappedResolve(returnedData);
        }
      }
    }
    _setupLoadingPromise() {
      return new Promise((resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
      }).then((data) => {
        var _this$_options$onLoad, _this$_options;
        this._isLoading = false;
        (_this$_options$onLoad = (_this$_options = this._options).onLoadCharDataSuccess) === null || _this$_options$onLoad === void 0 ? void 0 : _this$_options$onLoad.call(_this$_options, data);
        return data;
      }).catch((reason) => {
        this._isLoading = false;
        this.loadingFailed = true;
        if (this._options.onLoadCharDataError) {
          this._options.onLoadCharDataError(reason);
          return;
        }
        if (reason instanceof Error) {
          throw reason;
        }
        const err = new Error(`Failed to load char data for ${this._loadingChar}`);
        err.reason = reason;
        throw err;
      });
    }
    loadCharData(char) {
      this._loadingChar = char;
      const promise = this._setupLoadingPromise();
      this.loadingFailed = false;
      this._isLoading = true;
      this._loadCounter++;
      this._debouncedLoad(char, this._loadCounter);
      return promise;
    }
  };
  var HanziWriter = class _HanziWriter {
    constructor(element, options = {}) {
      const {
        HanziWriterRenderer: HanziWriterRenderer2,
        createRenderTarget
      } = options.renderer === "canvas" ? canvasRenderer : svgRenderer;
      const rendererOverride = options.rendererOverride || {};
      this._renderer = {
        HanziWriterRenderer: rendererOverride.HanziWriterRenderer || HanziWriterRenderer2,
        createRenderTarget: rendererOverride.createRenderTarget || createRenderTarget
      };
      this.target = this._renderer.createRenderTarget(element, options.width, options.height);
      this._options = this._assignOptions(options);
      this._loadingManager = new LoadingManager(this._options);
      this._setupListeners();
    }
    /** Main entry point */
    static create(element, character, options) {
      const writer = new _HanziWriter(element, options);
      writer.setCharacter(character);
      return writer;
    }
    static loadCharacterData(character, options = {}) {
      const loadingManager = (() => {
        const {
          _loadingManager,
          _loadingOptions
        } = _HanziWriter;
        if ((_loadingManager === null || _loadingManager === void 0 ? void 0 : _loadingManager._loadingChar) === character && _loadingOptions === options) {
          return _loadingManager;
        }
        return new LoadingManager({
          ...defaultOptions,
          ...options
        });
      })();
      _HanziWriter._loadingManager = loadingManager;
      _HanziWriter._loadingOptions = options;
      return loadingManager.loadCharData(character);
    }
    static getScalingTransform(width, height, padding = 0) {
      const positioner = new Positioner({
        width,
        height,
        padding
      });
      return {
        x: positioner.xOffset,
        y: positioner.yOffset,
        scale: positioner.scale,
        transform: trim(`
        translate(${positioner.xOffset}, ${positioner.height - positioner.yOffset})
        scale(${positioner.scale}, ${-1 * positioner.scale})
      `).replace(/\s+/g, " ")
      };
    }
    showCharacter(options = {}) {
      this._options.showCharacter = true;
      return this._withData(() => {
        var _this$_renderState;
        return (_this$_renderState = this._renderState) === null || _this$_renderState === void 0 ? void 0 : _this$_renderState.run(showCharacter("main", this._character, typeof options.duration === "number" ? options.duration : this._options.strokeFadeDuration)).then((res) => {
          var _options$onComplete;
          (_options$onComplete = options.onComplete) === null || _options$onComplete === void 0 ? void 0 : _options$onComplete.call(options, res);
          return res;
        });
      });
    }
    hideCharacter(options = {}) {
      this._options.showCharacter = false;
      return this._withData(() => {
        var _this$_renderState2;
        return (_this$_renderState2 = this._renderState) === null || _this$_renderState2 === void 0 ? void 0 : _this$_renderState2.run(hideCharacter("main", this._character, typeof options.duration === "number" ? options.duration : this._options.strokeFadeDuration)).then((res) => {
          var _options$onComplete2;
          (_options$onComplete2 = options.onComplete) === null || _options$onComplete2 === void 0 ? void 0 : _options$onComplete2.call(options, res);
          return res;
        });
      });
    }
    animateCharacter(options = {}) {
      this.cancelQuiz();
      return this._withData(() => {
        var _this$_renderState3;
        return (_this$_renderState3 = this._renderState) === null || _this$_renderState3 === void 0 ? void 0 : _this$_renderState3.run(animateCharacter("main", this._character, this._options.strokeFadeDuration, this._options.strokeAnimationSpeed, this._options.delayBetweenStrokes)).then((res) => {
          var _options$onComplete3;
          (_options$onComplete3 = options.onComplete) === null || _options$onComplete3 === void 0 ? void 0 : _options$onComplete3.call(options, res);
          return res;
        });
      });
    }
    animateStroke(strokeNum, options = {}) {
      this.cancelQuiz();
      return this._withData(() => {
        var _this$_renderState4;
        return (_this$_renderState4 = this._renderState) === null || _this$_renderState4 === void 0 ? void 0 : _this$_renderState4.run(animateSingleStroke("main", this._character, fixIndex(strokeNum, this._character.strokes.length), this._options.strokeAnimationSpeed)).then((res) => {
          var _options$onComplete4;
          (_options$onComplete4 = options.onComplete) === null || _options$onComplete4 === void 0 ? void 0 : _options$onComplete4.call(options, res);
          return res;
        });
      });
    }
    highlightStroke(strokeNum, options = {}) {
      const promise = () => {
        if (!this._character || !this._renderState) {
          return;
        }
        return this._renderState.run(highlightStroke(selectIndex(this._character.strokes, strokeNum), colorStringToVals(this._options.highlightColor), this._options.strokeHighlightSpeed)).then((res) => {
          var _options$onComplete5;
          (_options$onComplete5 = options.onComplete) === null || _options$onComplete5 === void 0 ? void 0 : _options$onComplete5.call(options, res);
          return res;
        });
      };
      return this._withData(promise);
    }
    async loopCharacterAnimation() {
      this.cancelQuiz();
      return this._withData(() => this._renderState.run(animateCharacterLoop("main", this._character, this._options.strokeFadeDuration, this._options.strokeAnimationSpeed, this._options.delayBetweenStrokes, this._options.delayBetweenLoops), {
        loop: true
      }));
    }
    pauseAnimation() {
      return this._withData(() => {
        var _this$_renderState5;
        return (_this$_renderState5 = this._renderState) === null || _this$_renderState5 === void 0 ? void 0 : _this$_renderState5.pauseAll();
      });
    }
    resumeAnimation() {
      return this._withData(() => {
        var _this$_renderState6;
        return (_this$_renderState6 = this._renderState) === null || _this$_renderState6 === void 0 ? void 0 : _this$_renderState6.resumeAll();
      });
    }
    showOutline(options = {}) {
      this._options.showOutline = true;
      return this._withData(() => {
        var _this$_renderState7;
        return (_this$_renderState7 = this._renderState) === null || _this$_renderState7 === void 0 ? void 0 : _this$_renderState7.run(showCharacter("outline", this._character, typeof options.duration === "number" ? options.duration : this._options.strokeFadeDuration)).then((res) => {
          var _options$onComplete6;
          (_options$onComplete6 = options.onComplete) === null || _options$onComplete6 === void 0 ? void 0 : _options$onComplete6.call(options, res);
          return res;
        });
      });
    }
    hideOutline(options = {}) {
      this._options.showOutline = false;
      return this._withData(() => {
        var _this$_renderState8;
        return (_this$_renderState8 = this._renderState) === null || _this$_renderState8 === void 0 ? void 0 : _this$_renderState8.run(hideCharacter("outline", this._character, typeof options.duration === "number" ? options.duration : this._options.strokeFadeDuration)).then((res) => {
          var _options$onComplete7;
          (_options$onComplete7 = options.onComplete) === null || _options$onComplete7 === void 0 ? void 0 : _options$onComplete7.call(options, res);
          return res;
        });
      });
    }
    /** Updates the size of the writer instance without resetting render state */
    updateDimensions({
      width,
      height,
      padding
    }) {
      if (width !== void 0)
        this._options.width = width;
      if (height !== void 0)
        this._options.height = height;
      if (padding !== void 0)
        this._options.padding = padding;
      this.target.updateDimensions(this._options.width, this._options.height);
      if (this._character && this._renderState && this._hanziWriterRenderer && this._positioner) {
        this._hanziWriterRenderer.destroy();
        const hanziWriterRenderer = this._initAndMountHanziWriterRenderer(this._character);
        this._renderState.overwriteOnStateChange((nextState) => hanziWriterRenderer.render(nextState));
        hanziWriterRenderer.render(this._renderState.state);
        if (this._quiz) {
          this._quiz.setPositioner(this._positioner);
        }
      }
    }
    updateColor(colorName, colorVal, options = {}) {
      var _options$duration;
      let mutations = [];
      const fixedColorVal = (() => {
        if (colorName === "radicalColor" && !colorVal) {
          return this._options.strokeColor;
        }
        return colorVal;
      })();
      const mappedColor = colorStringToVals(fixedColorVal);
      this._options[colorName] = colorVal;
      const duration = (_options$duration = options.duration) !== null && _options$duration !== void 0 ? _options$duration : this._options.strokeFadeDuration;
      mutations = mutations.concat(updateColor(colorName, mappedColor, duration));
      if (colorName === "radicalColor" && !colorVal) {
        mutations = mutations.concat(updateColor(colorName, null, 0));
      }
      return this._withData(() => {
        var _this$_renderState9;
        return (_this$_renderState9 = this._renderState) === null || _this$_renderState9 === void 0 ? void 0 : _this$_renderState9.run(mutations).then((res) => {
          var _options$onComplete8;
          (_options$onComplete8 = options.onComplete) === null || _options$onComplete8 === void 0 ? void 0 : _options$onComplete8.call(options, res);
          return res;
        });
      });
    }
    quiz(quizOptions = {}) {
      return this._withData(async () => {
        if (this._character && this._renderState && this._positioner) {
          this.cancelQuiz();
          this._quiz = new Quiz(this._character, this._renderState, this._positioner);
          this._options = {
            ...this._options,
            ...quizOptions
          };
          this._quiz.startQuiz(this._options);
        }
      });
    }
    skipQuizStroke() {
      if (this._quiz) {
        this._quiz.nextStroke();
      }
    }
    cancelQuiz() {
      if (this._quiz) {
        this._quiz.cancel();
        this._quiz = void 0;
      }
    }
    setCharacter(char) {
      this.cancelQuiz();
      this._char = char;
      if (this._hanziWriterRenderer) {
        this._hanziWriterRenderer.destroy();
      }
      if (this._renderState) {
        this._renderState.cancelAll();
      }
      this._hanziWriterRenderer = null;
      this._withDataPromise = this._loadingManager.loadCharData(char).then((pathStrings) => {
        if (!pathStrings || this._loadingManager.loadingFailed) {
          return;
        }
        this._character = parseCharData(char, pathStrings);
        this._renderState = new RenderState(this._character, this._options, (nextState) => hanziWriterRenderer.render(nextState));
        const hanziWriterRenderer = this._initAndMountHanziWriterRenderer(this._character);
        hanziWriterRenderer.render(this._renderState.state);
      });
      return this._withDataPromise;
    }
    _initAndMountHanziWriterRenderer(character) {
      const {
        width,
        height,
        padding
      } = this._options;
      this._positioner = new Positioner({
        width,
        height,
        padding
      });
      const hanziWriterRenderer = new this._renderer.HanziWriterRenderer(character, this._positioner);
      hanziWriterRenderer.mount(this.target);
      this._hanziWriterRenderer = hanziWriterRenderer;
      return hanziWriterRenderer;
    }
    async getCharacterData() {
      if (!this._char) {
        throw new Error("setCharacter() must be called before calling getCharacterData()");
      }
      const character = await this._withData(() => this._character);
      return character;
    }
    _assignOptions(options) {
      const mergedOptions = {
        ...defaultOptions,
        ...options
      };
      if (options.strokeAnimationDuration && !options.strokeAnimationSpeed) {
        mergedOptions.strokeAnimationSpeed = 500 / options.strokeAnimationDuration;
      }
      if (options.strokeHighlightDuration && !options.strokeHighlightSpeed) {
        mergedOptions.strokeHighlightSpeed = 500 / mergedOptions.strokeHighlightDuration;
      }
      if (!options.highlightCompleteColor) {
        mergedOptions.highlightCompleteColor = mergedOptions.highlightColor;
      }
      return this._fillWidthAndHeight(mergedOptions);
    }
    /** returns a new options object with width and height filled in if missing */
    _fillWidthAndHeight(options) {
      const filledOpts = {
        ...options
      };
      if (filledOpts.width && !filledOpts.height) {
        filledOpts.height = filledOpts.width;
      } else if (filledOpts.height && !filledOpts.width) {
        filledOpts.width = filledOpts.height;
      } else if (!filledOpts.width && !filledOpts.height) {
        const {
          width,
          height
        } = this.target.getBoundingClientRect();
        const minDim = Math.min(width, height);
        filledOpts.width = minDim;
        filledOpts.height = minDim;
      }
      return filledOpts;
    }
    _withData(func) {
      if (this._loadingManager.loadingFailed) {
        throw Error("Failed to load character data. Call setCharacter and try again.");
      }
      if (this._withDataPromise) {
        return this._withDataPromise.then(() => {
          if (!this._loadingManager.loadingFailed) {
            return func();
          }
        });
      }
      return Promise.resolve().then(func);
    }
    _setupListeners() {
      this.target.addPointerStartListener((evt) => {
        if (this._quiz) {
          evt.preventDefault();
          this._quiz.startUserStroke(evt.getPoint());
        }
      });
      this.target.addPointerMoveListener((evt) => {
        if (this._quiz) {
          evt.preventDefault();
          this._quiz.continueUserStroke(evt.getPoint());
        }
      });
      this.target.addPointerEndListener(() => {
        var _this$_quiz;
        (_this$_quiz = this._quiz) === null || _this$_quiz === void 0 ? void 0 : _this$_quiz.endUserStroke();
      });
    }
  };
  HanziWriter._loadingManager = null;
  HanziWriter._loadingOptions = null;
  var index_esm_default = HanziWriter;

  // src/client/db.ts
  var CARDS_PER_PART = 30;
  var DB_NAME = "open_hanzi_cards";
  var DB_VERSION = 1;
  var STORE_NAME = "words";
  var WORDS_PATH = "/res/words.json";
  var db;
  function initDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      let upgradePromise = null;
      req.onupgradeneeded = (event) => {
        upgradePromise = (async () => {
          db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store2 = db.createObjectStore(STORE_NAME, {
              keyPath: "word.simplified"
            });
            store2.createIndex("learningOrder", "learningOrder", {
              multiEntry: true
            });
            store2.createIndex("lastRevision", "lastRevision");
            store2.createIndex("knowledgeLevel", "knowledgeLevel");
          }
          const res = await fetch(WORDS_PATH);
          const words = await res.json();
          const flashCards = /* @__PURE__ */ new Map();
          for (const word of words) {
            const flashCard = {
              word,
              starred: false,
              revisionLevel: 0,
              timesRevised: 0,
              lastRevision: 0,
              knowledgeLevel: 0,
              learningOrder: [],
              // populated after parts determined
              partsByLevel: {}
            };
            flashCards.set(word.simplified, flashCard);
          }
          const cardsByLevel = /* @__PURE__ */ new Map();
          for (const flashCard of flashCards.values()) {
            for (const level of flashCard.word.level) {
              if (!cardsByLevel.has(level)) {
                cardsByLevel.set(level, []);
              }
              cardsByLevel.get(level).push(flashCard);
            }
          }
          for (const [level, cards] of cardsByLevel) {
            cards.sort((a, b) => a.word.frequency - b.word.frequency);
            for (let i = 0; i < cards.length; i++) {
              const part = Math.floor(i / CARDS_PER_PART) + 1;
              cards[i].partsByLevel[level] = part;
            }
          }
          for (const flashCard of flashCards.values()) {
            flashCard.learningOrder = flashCard.word.level.map((l) => [
              l,
              flashCard.partsByLevel[l] || 0,
              0,
              flashCard.word.frequency
            ]);
          }
          const tx = db.transaction(STORE_NAME, "readwrite");
          const store = tx.objectStore(STORE_NAME);
          for (const flashCard of flashCards.values()) {
            store.put(flashCard);
          }
        })();
      };
      req.onsuccess = async (event) => {
        if (upgradePromise) {
          await upgradePromise;
        } else {
          db = event.target.result;
        }
        resolve();
      };
      req.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }
  var getMaxLastRevision = () => new Promise((resolve, reject) => {
    const req = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).index("lastRevision").openCursor(null, "prev");
    req.onsuccess = (ev) => {
      const cursor = ev.target.result;
      if (cursor == null) {
        resolve(0);
        return;
      }
      resolve(cursor.value.lastRevision);
    };
    req.onerror = (ev) => {
      reject(ev.target.error);
    };
  });
  var getTotalCards = () => new Promise((resolve, reject) => {
    const req = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).count();
    req.onsuccess = (ev) => {
      resolve(ev.target.result);
    };
    req.onerror = (ev) => {
      reject(ev.target.error);
    };
  });
  var getLevelPartStats = async (level, part) => {
    const cards = await getLearningSet(level, Infinity, part);
    const count2 = cards.length;
    const avgRevision = count2 === 0 ? 0 : cards.reduce((sum, c) => sum + c.revisionLevel, 0) / count2;
    return { count: count2, avgRevision };
  };
  var updateKnowledgeLevels = async (level) => {
    const maxLastRevision = await getMaxLastRevision();
    const totalCards = await getTotalCards();
    return await new Promise((resolve, reject) => {
      const req = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).index("learningOrder").openCursor(
        IDBKeyRange.bound(
          [level, 0, 0, 0],
          [level, Infinity, Infinity, Infinity]
        )
      );
      req.onsuccess = (ev) => {
        const cursor = ev.target.result;
        if (cursor == null) {
          resolve();
          return;
        }
        const flashCard = cursor.value;
        flashCard.knowledgeLevel = flashCard.revisionLevel * Math.exp(
          -1 * (maxLastRevision - flashCard.lastRevision) / (2 * totalCards)
        );
        flashCard.learningOrder = flashCard.word.level.map((l) => [
          l,
          flashCard.partsByLevel[l] || (() => {
            throw new Error(
              `Card ${flashCard.word.simplified} missing part for level ${l}`
            );
          })(),
          flashCard.knowledgeLevel,
          flashCard.word.frequency
        ]);
        cursor.update(flashCard);
        cursor.continue();
      };
      req.onerror = (ev) => {
        reject(ev.target.error);
      };
    });
  };
  var getAllLevels = () => new Promise((resolve, reject) => {
    const levels = /* @__PURE__ */ new Set();
    const req = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).openCursor();
    req.onsuccess = (ev) => {
      const cursor = ev.target.result;
      if (cursor == null) {
        resolve(Array.from(levels).sort());
        return;
      }
      const flashCard = cursor.value;
      for (const l of flashCard.word.level)
        levels.add(l);
      cursor.continue();
    };
    req.onerror = (ev) => reject(ev.target.error);
  });
  var getLearningSet = async (level, count2, part) => {
    return await new Promise((resolve, reject) => {
      const cards = [];
      const lower = part != null ? [level, part, 0, 0] : [level, 0, 0, 0];
      const upper = part != null ? [level, part, Infinity, Infinity] : [level, Infinity, Infinity, Infinity];
      const req = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).index("learningOrder").openCursor(IDBKeyRange.bound(lower, upper));
      req.onsuccess = (ev) => {
        const cursor = ev.target.result;
        if (cursor == null || cards.length >= count2) {
          resolve(cards);
          return;
        }
        cards.push(cursor.value);
        cursor.continue();
      };
      req.onerror = (ev) => {
        reject(ev.target.error);
      };
    });
  };
  var finaliseQuiz = async (cards) => {
    const maxLastRevision = await getMaxLastRevision();
    await new Promise((resolve, reject) => {
      const req = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME);
      let processedCount = 0;
      for (const card of cards) {
        card.lastRevision = maxLastRevision + processedCount + 1;
        const updateReq = req.put(card);
        updateReq.onsuccess = () => {
          processedCount++;
          if (processedCount === cards.length) {
            resolve();
          }
        };
        updateReq.onerror = (ev) => {
          reject(ev.target.error);
        };
      }
    });
  };
  var getPartCountForLevel = async (level) => {
    return await new Promise((resolve, reject) => {
      let maxPart = 0;
      const req = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).openCursor();
      req.onsuccess = (ev) => {
        const cursor = ev.target.result;
        if (cursor == null) {
          resolve(maxPart);
          return;
        }
        const flashCard = cursor.value;
        if (flashCard.partsByLevel[level]) {
          maxPart = Math.max(maxPart, flashCard.partsByLevel[level]);
        }
        cursor.continue();
      };
      req.onerror = (ev) => {
        reject(ev.target.error);
      };
    });
  };

  // src/client/models.ts
  var REVISION_LEVEL_DELTA = 0.1;
  var LEARNING_TYPES = [
    "mandarin_pinyin_to_english",
    "mandarin_to_pinyin",
    "english_to_pinyin",
    "english_to_mandarin"
  ];
  var LEARNING_TYPE_UNLOCK_LEVELS = {
    mandarin_pinyin_to_english: 0,
    mandarin_to_pinyin: 0.1,
    english_to_pinyin: 0.2,
    english_to_mandarin: 0.3
  };

  // src/client/ui.ts
  var app = document.getElementById("app");
  var ui = {
    app,
    posName(pos) {
      const mapping = {
        a: "adjective",
        ad: "adjective as adverbial",
        ag: "adjective morpheme",
        an: "adjective with nominal function",
        b: "non-predicate adjective",
        c: "conjunction",
        d: "adverb",
        dg: "adverb morpheme",
        e: "interjection",
        f: "directional locality",
        g: "morpheme",
        h: "prefix",
        i: "idiom",
        j: "abbreviation",
        k: "suffix",
        l: "fixed expression",
        m: "numeral",
        mg: "numeric morpheme",
        mq: "measure word",
        n: "common noun",
        ng: "noun morpheme",
        nr: "personal name",
        ns: "place name",
        nt: "organisation name",
        nx: "nominal character string",
        nz: "other proper noun",
        o: "onomatopoeia",
        p: "preposition",
        q: "quantifier",
        r: "pronoun",
        rg: "pronoun morpheme",
        s: "space word",
        t: "time word",
        tg: "time word morphene",
        u: "auxiliary",
        v: "verb",
        vd: "verb as adverbial",
        vg: "verb morpheme",
        vn: "verb with nominal function",
        w: "symbol and non-sential punctuation",
        x: "unclassified item",
        y: "modal particle",
        z: "descriptive"
      };
      if (!(pos in mapping)) {
        console.warn(`Unknown part of speech: ${pos}`);
        return pos;
      }
      return mapping[pos];
    },
    renderControls(levels, selectedLevel2, totalParts2, quizSize2, stats, onLevelChange, onPartChange, onSizeChange, selectedPart2) {
      const controls = document.getElementById("controls");
      const levelOptions = levels.map((l) => (
        /* html */
        `<option value="${l}">${l}</option>`
      )).join("");
      const partOptionsArr = [
        /* html */
        `<option value="all">All parts</option>`,
        ...Array.from({ length: totalParts2 }, (_, i) => {
          const part = i + 1;
          return (
            /* html */
            `<option value="${part}">Part ${part}</option>`
          );
        })
      ];
      const partOptions = partOptionsArr.join("");
      const avgRevisionStr = new Intl.NumberFormat("en", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(stats.avgRevision);
      const statsHtml = (
        /* html */
        `
    <div id="controls-stats">
      cards: ${stats.count}, avg rev: ${avgRevisionStr}
    </div>
    `
      );
      controls.innerHTML = /* html */
      `
    <div class="row">
      <label for="level-select">Level:</label>
      <select id="level-select">
        ${levelOptions}
      </select>
      <label for="part-select">Part:</label>
      <select id="part-select">
        ${partOptions}
      </select>
      <label for="quiz-size">Cards in quiz:</label>
      <input type="number" id="quiz-size" min="1" value="${quizSize2}" max="${stats.count}">
    </div>
    <div class="row">
      ${statsHtml}
    </div>
    `;
      const lvlSelect = controls.querySelector(
        "#level-select"
      );
      if (!levels.includes(selectedLevel2) && levels.length > 0) {
        selectedLevel2 = levels[0];
      }
      lvlSelect.value = selectedLevel2;
      lvlSelect.addEventListener("change", () => onLevelChange(lvlSelect.value));
      const partSelect = controls.querySelector(
        "#part-select"
      );
      partSelect.value = selectedPart2 == null ? "all" : String(Math.min(selectedPart2, totalParts2));
      partSelect.addEventListener("change", () => {
        const val = partSelect.value;
        if (val === "all") {
          onPartChange(null);
        } else {
          onPartChange(parseInt(val));
        }
      });
      if (onSizeChange) {
        const sizeInput = controls.querySelector(
          "#quiz-size"
        );
        sizeInput.value = String(quizSize2);
        sizeInput.max = stats ? String(stats.count) : "";
        sizeInput.addEventListener("change", () => {
          const val = parseInt(sizeInput.value);
          if (!isNaN(val) && val >= 1) {
            onSizeChange(val);
          }
        });
      }
    },
    quizProgressBar(current, total) {
      return (
        /* html */
        `
    <div class="quiz-progress">Question ${current} of ${total}</div>
    `
      );
    },
    displayFlashCard(quizCard, revisionDeltaStr, revisionLevelDelta, progress, onNext) {
      const card = quizCard.card;
      const newRevisionLevelStr = new Intl.NumberFormat("en", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(card.revisionLevel);
      this.app.innerHTML = /* html */
      `
    <div class="flash-card">
      <div class="top-left-corner">
        <a
          href="https://hanzicraft.com/character/${encodeURIComponent(card.word.simplified)}"
          class="info-button" target="_blank">\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F</a>
        <a
          href="https://www.purpleculture.net/sample-sentences/?word=${encodeURIComponent(card.word.simplified)}"
          class="info-button" target="_blank">\u{1F4AC}</a>
      </div>
      <div class="top-right-corner">
        <button class="tts-button">\u{1F50A}</button>
      </div>
      <h1>${card.word.simplified}</h1>
      <div class="pos">
        ${card.word.pos.map((p) => (
        /* html */
        `<span>${this.posName(p)}</span>`
      )).join("")}
      </div>
      <p class="starred">Starred: ${card.starred}</p>
      <p class="revision-level">
        RevisionLevel: ${newRevisionLevelStr}
        <span class="${revisionLevelDelta > 0 ? "positive" : "negative"}">
          ${revisionDeltaStr}
        </span>
      </p>
      ${card.word.forms.map(
        (form) => (
          /* html */
          `
          <p class="pinyin">${form.transcriptions.pinyin}</p>
          <p class="traditional">${form.traditional}</p>
          <ol>
            ${form.meanings.map((m) => (
            /* html */
            `<li>${m}</li>`
          )).join("")}
          </ol>
          `
        )
      ).join("")}
      <button id="next-button">Next</button>
    </div>
    ${this.quizProgressBar(progress.current, progress.total)}
    `;
      const nextButton = document.getElementById("next-button");
      nextButton.addEventListener("click", onNext);
      setTimeout(() => nextButton.focus(), 0);
      const ttsBtn = document.querySelector(".tts-button");
      ttsBtn.addEventListener("click", () => this.playTts(card));
      if (quizCard.learningType === "mandarin_pinyin_to_english" || quizCard.learningType === "english_to_mandarin") {
        this.playTts(card);
      }
    },
    registerAnswerInput(onSubmit) {
      document.getElementById("submit-answer").addEventListener("click", onSubmit);
      const input = document.getElementById("answer-input");
      input.focus();
      input.addEventListener("keydown", (ev) => {
        if (ev.key != "Enter") {
          return;
        }
        onSubmit();
        ev.stopPropagation();
      });
    },
    displayQuestionMandarinPinyinToEnglish(card, progress, onSubmit) {
      const pinyin = new Set(card.word.forms.map((f) => f.transcriptions.pinyin));
      this.app.innerHTML = /* html */
      `
    <div class="question">
      <div class="top-right-corner">
        <button class="tts-button">\u{1F50A}</button>
      </div>
      <h1>${card.word.simplified}</h1>
      <p>${Array.from(pinyin).join(" / ")}</p>
      <input type="text" placeholder="Enter the English meaning" id="answer-input">
      <button id="submit-answer">Submit</button>
    </div>
    ${this.quizProgressBar(progress.current, progress.total)}
    `;
      this.registerAnswerInput(onSubmit);
      const ttsBtn = document.querySelector(".tts-button");
      ttsBtn.addEventListener("click", () => this.playTts(card));
      this.playTts(card);
    },
    displayQuestionMandarinToPinyin(card, progress, onSubmit) {
      this.app.innerHTML = /* html */
      `
    <div class="question">
      <h1>${card.word.simplified}</h1>
      <input type="text" placeholder="Enter the pinyin" id="answer-input">
      <button id="submit-answer">Submit</button>
    </div>
    ${this.quizProgressBar(progress.current, progress.total)}
    `;
      this.registerAnswerInput(onSubmit);
    },
    displayQuestionEnglishToPinyin(card, progress, onSubmit) {
      this.app.innerHTML = /* html */
      `
    <div class="question">
      ${card.word.forms.map(
        (form) => (
          /* html */
          `
          <ol>
            ${form.meanings.map((m) => (
            /* html */
            `<li>${m}</li>`
          )).join("")}
          </ol>
          `
        )
      ).join("")}
      <input type="text" placeholder="Enter the pinyin" id="answer-input">
      <button id="submit-answer">Submit</button>
    </div>
    ${this.quizProgressBar(progress.current, progress.total)}
    `;
      this.registerAnswerInput(onSubmit);
    },
    displayQuestionEnglishToMandarin(card, progress) {
      const simplifiedLetters = card.word.simplified.split("");
      this.app.innerHTML = /* html */
      `
    <div class="question">
      <div class="top-right-corner">
        <button class="tts-button">\u{1F50A}</button>
      </div>
      ${card.word.forms.map(
        (form) => (
          /* html */
          `
          <p class="pinyin">${form.transcriptions.pinyin}</p>
          <ol>
            ${form.meanings.map((m) => (
            /* html */
            `<li>${m}</li>`
          )).join("")}
          </ol>
          `
        )
      ).join("")}
      <div class="hanzi-writer">
        <p>Write the character(s):</p>
        ${simplifiedLetters.map(
        (_, i) => (
          /* html */
          `
            <div class="hanzi-char" id="hanzi-char-${i}"></div>
            `
        )
      ).join("")}
      </div>
      ${this.quizProgressBar(progress.current, progress.total)}
    </div>
    `;
      const ttsBtn = document.querySelector(".tts-button");
      ttsBtn.addEventListener("click", () => this.playTts(card));
      this.playTts(card);
    },
    playTts(card) {
      const url = `/res/audio/${encodeURIComponent(card.word.simplified)}.mp3`;
      const audio = new Audio(url);
      audio.play();
    }
  };

  // src/client/util.ts
  var clamp = (num, min, max) => {
    return Math.max(min, Math.min(max, num));
  };
  var applySign = (sign, num) => {
    return sign ? num : -num;
  };
  var shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  var levenshtein = (a, b) => {
    const dp = Array.from(
      { length: a.length + 1 },
      (_, i) => Array.from(
        { length: b.length + 1 },
        (_2, j) => i === 0 ? j : j === 0 ? i : 0
      )
    );
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[a.length][b.length];
  };

  // src/client/quiz-controller.ts
  var selectedLevel = "new-1";
  var selectedPart = void 0;
  var totalParts = 1;
  var quizCardIndex = 0;
  var quizCards = [];
  var quizSize = 7;
  async function updateControls() {
    try {
      const levels = await getAllLevels();
      totalParts = await getPartCountForLevel(selectedLevel);
      const stats = await getLevelPartStats(
        selectedLevel,
        selectedPart || void 0
      );
      ui.renderControls(
        levels,
        selectedLevel,
        totalParts,
        quizSize,
        stats,
        async (lvl) => {
          selectedLevel = lvl;
          selectedPart = void 0;
          await quiz(selectedLevel, selectedPart);
        },
        async (part) => {
          selectedPart = part;
          await quiz(selectedLevel, selectedPart);
        },
        async (size) => {
          quizSize = size;
          await quiz(selectedLevel, selectedPart);
        },
        selectedPart
      );
    } catch (e) {
      console.warn("Could not update controls:", e);
    }
  }
  function computeResult() {
    switch (quizCards[quizCardIndex].learningType) {
      case "mandarin_pinyin_to_english":
        return getResultMandarinPinyinToEnglish();
      case "mandarin_to_pinyin":
        return getResultMandarinToPinyin();
      case "english_to_pinyin":
        return getResultEnglishToPinyin();
      case "english_to_mandarin":
        return getResultEnglishToMandarin();
      default:
        throw new Error(
          `Unsupported learning type: ${quizCards[quizCardIndex].learningType}`
        );
    }
  }
  function getResultMandarinPinyinToEnglish() {
    const input = document.getElementById("answer-input");
    const answers = input.value.split(";").map((a) => a.trim().toLowerCase());
    const normalise = (s) => s.toLowerCase().trim();
    const expandMeaning = (m) => {
      const trimmed = m.trim();
      if (/^\([^()]+\)$/.test(trimmed))
        return [normalise(trimmed)];
      const without = trimmed.replace(/\s*\([^()]*\)/g, "").trim();
      const withInline = trimmed.replace(/[()]/g, "");
      return [normalise(without), normalise(withInline)];
    };
    const isClose = (a, b) => {
      const dist = levenshtein(a, b);
      const maxLen = Math.max(a.length, b.length);
      return dist <= Math.max(1, Math.floor(maxLen * 0.2));
    };
    const isAnswerCorrect = (meaning, answer) => {
      const a = normalise(answer);
      return meaning.split(";").flatMap(expandMeaning).some((m) => isClose(m, a));
    };
    const possibleAnswers = quizCards[quizCardIndex].card.word.forms.map((f) => f.meanings).flat();
    const allAnswersCorrect = answers.every(
      (answer) => possibleAnswers.some((meaning) => isAnswerCorrect(meaning, answer))
    );
    return {
      revisionLevelDelta: applySign(allAnswersCorrect, REVISION_LEVEL_DELTA)
    };
  }
  function getResultMandarinToPinyin() {
    const inputEl = document.getElementById("answer-input");
    const answer = inputEl.value.trim().toLowerCase().replace(/\s+/g, " ");
    const possibleAnswers = quizCards[quizCardIndex].card.word.forms.map(
      (form) => {
        const numeric = form.transcriptions.numeric?.trim().toLowerCase();
        const noTone = numeric?.replace(/\d/g, "").trim();
        const pinyin = form.transcriptions.pinyin?.trim().toLowerCase();
        const options = [pinyin, numeric, noTone].filter(Boolean);
        return options.some((opt) => opt.replace(/\s+/g, " ") === answer);
      }
    );
    const anyCorrect = possibleAnswers.some((c) => c);
    return { revisionLevelDelta: applySign(anyCorrect, REVISION_LEVEL_DELTA) };
  }
  function getResultEnglishToPinyin() {
    const inputEl = document.getElementById("answer-input");
    const answer = inputEl.value.trim().toLowerCase().replace(/\s+/g, " ");
    const possibleAnswers = quizCards[quizCardIndex].card.word.forms.map(
      (form) => {
        const numeric = form.transcriptions.numeric?.trim().toLowerCase();
        const noTone = numeric?.replace(/\d/g, "").trim();
        const pinyin = form.transcriptions.pinyin?.trim().toLowerCase();
        const options = [pinyin, numeric, noTone].filter(Boolean);
        return options.some((opt) => opt.replace(/\s+/g, " ") === answer);
      }
    );
    const anyCorrect = possibleAnswers.some((c) => c);
    return { revisionLevelDelta: applySign(anyCorrect, REVISION_LEVEL_DELTA) };
  }
  function getResultEnglishToMandarin() {
    const mistakes = hanziWritersMistakes.reduce((a, b) => a + b, 0);
    const totalStrokes = hanziWritersTotalStrokes.reduce((a, b) => a + b, 0);
    const accuracy = (totalStrokes - mistakes) / totalStrokes;
    const CUTOFF_ACCURACY = 0.6;
    const score = 1 - (2 * accuracy - 2) / (CUTOFF_ACCURACY - 1);
    return {
      revisionLevelDelta: REVISION_LEVEL_DELTA * clamp(score, -1, 1)
    };
  }
  var hanziWritersMistakes = [];
  var hanziWritersTotalStrokes = [];
  function displayFlashCardInternal() {
    const result = computeResult();
    const quizCard = quizCards[quizCardIndex];
    const card = quizCard.card;
    const revisionLevelDelta = result.revisionLevelDelta;
    const revisionLevelDeltaStr = new Intl.NumberFormat("en", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      signDisplay: "always"
    }).format(revisionLevelDelta);
    card.revisionLevel = clamp(card.revisionLevel + revisionLevelDelta, 0, 1);
    card.timesRevised += 1;
    const progress = { current: quizCardIndex + 1, total: quizCards.length };
    ui.displayFlashCard(
      quizCard,
      revisionLevelDeltaStr,
      revisionLevelDelta,
      progress,
      quizNextQuestionPressed
    );
  }
  function displayQuizCard() {
    const quizCard = quizCards[quizCardIndex];
    const progress = { current: quizCardIndex + 1, total: quizCards.length };
    switch (quizCard.learningType) {
      case "mandarin_pinyin_to_english":
        ui.displayQuestionMandarinPinyinToEnglish(
          quizCard.card,
          progress,
          quizSubmitAnswerPressed
        );
        break;
      case "mandarin_to_pinyin":
        ui.displayQuestionMandarinToPinyin(
          quizCard.card,
          progress,
          quizSubmitAnswerPressed
        );
        break;
      case "english_to_pinyin":
        ui.displayQuestionEnglishToPinyin(
          quizCard.card,
          progress,
          quizSubmitAnswerPressed
        );
        break;
      case "english_to_mandarin":
        ui.displayQuestionEnglishToMandarin(quizCard.card, progress);
        initHanziWriter(quizCard.card);
        break;
      default:
        throw new Error(`Unsupported learning type: ${quizCard.learningType}`);
    }
  }
  function initHanziWriter(card) {
    const simplifiedChars = card.word.simplified.split("");
    hanziWritersMistakes = new Array(simplifiedChars.length).fill(0);
    hanziWritersTotalStrokes = new Array(simplifiedChars.length).fill(0);
    let completed = 0;
    for (let idx = 0; idx < simplifiedChars.length; idx++) {
      const writer = index_esm_default.create(
        document.querySelector(`#hanzi-char-${idx}`),
        simplifiedChars[idx],
        {
          width: 150,
          height: 150,
          showCharacter: false,
          showOutline: card.revisionLevel < 0.4,
          showHintAfterMisses: 1,
          highlightOnComplete: true,
          padding: 5
        }
      );
      writer.quiz({
        onComplete: () => {
          completed++;
          if (completed === simplifiedChars.length) {
            setTimeout(() => {
              quizSubmitAnswerPressed();
            }, 1e3);
          }
        },
        onMistake: () => {
          hanziWritersMistakes[idx]++;
        },
        onCorrectStroke: () => {
          hanziWritersTotalStrokes[idx]++;
        }
      });
    }
  }
  function quizSubmitAnswerPressed() {
    displayFlashCardInternal();
  }
  async function quizNextQuestionPressed() {
    quizCardIndex++;
    if (quizCardIndex >= quizCards.length) {
      await finaliseQuiz(quizCards.map((q) => q.card));
      await updateKnowledgeLevels(selectedLevel);
      await quiz(selectedLevel, selectedPart);
    } else {
      displayQuizCard();
    }
  }
  async function quiz(level, part) {
    await updateControls();
    try {
      const partCards = await getLearningSet(level, quizSize, part);
      quizCardIndex = 0;
      quizCards = shuffleArray(
        partCards.map(
          (card) => LEARNING_TYPES.filter(
            (lt) => card.revisionLevel >= LEARNING_TYPE_UNLOCK_LEVELS[lt]
          ).map((lt) => ({ card, learningType: lt }))
        ).flat()
      );
      displayQuizCard();
    } catch (e) {
      console.warn("Could not load quiz cards:", e);
    }
  }
  async function startApp() {
    await initDb();
    await quiz(selectedLevel, selectedPart);
  }
  return __toCommonJS(quiz_controller_exports);
})();
