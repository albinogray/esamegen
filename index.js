var _ = require('underscore');
var ipaddr = require('ipaddr.js');

var stateData = {
  counters: {},
  ipAddressCounters : {},
}

var MAX_SAFE_INTEGER = 9007199254740991;
// TODO: change to Number.MAX_SAFE_INTEGER; for ECMA script 6

var _incrementIp = function (ipAddr, addValue, minAddr, maxAddr) {
  var ipBytes = ipAddr.split(".");
  var ipInt = parseInt(ipBytes[3], 10) + 256 * parseInt(ipBytes[2], 10) + 256 * 256 * parseInt(ipBytes[1], 10) + 256 * 256 * 256 * parseInt(ipBytes[0], 10);
  ipInt += addValue;

  // initialize to a value that does not match 0 .. 4
  var maxByteCompareIndex = -1;
  var maxValueBytes = null;

  var currPos = 256 * 256 * 256;
  if (maxAddr) {
    maxByteCompareIndex = 0;
    maxValueBytes = maxAddr.split(".");
  }
  for (var index = 0; index < 4; index++) {
    var help = (ipInt - (ipInt % currPos)) / currPos;
    ipBytes[index] = help.toFixed(0);
    ipInt = ipInt - help * currPos;
    currPos /= 256;
    if (maxByteCompareIndex === index) {
      if (ipBytes[index] > maxValueBytes[index]) {
        return minAddr;
      } else if (ipBytes[index] === maxValueBytes[index]) {
        maxByteCompareIndex += 1;
      }
    }
  }
  return ipBytes.join(".");
}

module.exports = {

  /**
   * Clears the named counters. If no names are specified then all counters are cleared.
   *
   * @param names The name or an array of names of counters to clear
   */
  clearCounter: function (names) {
    if (!names) {
      stateData.counters = {};
    } else if (_.isArray(names)) {
      names.forEach(function (name) {
        delete stateData.counters[name];
      });
    } else if (_.isString(names)) {
      delete stateData.counters[names];
    }
  },

  /**
   * Return the value of a specific counter.
   *
   * Options:
   *
   * - `min` minimum value of the counter (0 = default)
   * - `max` maximum value of the counter (Number.MAX_SAFE_INTEGER = default)
   * - `name` name of the counter - if not given use 'default'
   * - `incrementBy` by how much the counter is incremented before it is returned
   * - 'init' re-initialize the counter
   *
   * @param  {Object} options
   * @return {Number} The value of the counter
   */
  counter: function (options) {
    var opt = options || {};

    var name = opt.name || 'default';
    var min = opt.min || 0;
    var max = opt.max || MAX_SAFE_INTEGER;
    var init = opt.init || false;
    var incrementBy = opt.incrementBy || 0;

    
    if (!stateData.counters[name] || init) {
      if (min > max) {
        throw Error('min cannot be greater than max');
      }
      stateData.counters[name] = {
        value: min,
        min: min,
        max: max
      }
    }

    var sc = stateData.counters[name];
    
    sc.value = sc.value + incrementBy;
    if (sc.value > sc.max) {
      sc.value = sc.min;
    }

    return sc.value;
  },


  /**
   * Clears the named IP address counters. If no names are specified then all counters are cleared.
   *
   * @param names The name or an array of names of counters to clear
   */
  clearIpAddressCounter: function (names) {
    if (!names) {
      stateData.ipAddressCounters = {};
    } else if (_.isArray(names)) {
      names.forEach(function (name) {
        delete stateData.ipAddressCounters[name];
      });
    } else if (_.isString(names)) {
      delete stateData.ipAddressCounters[names];
    }
  },

  ipAddressCounter: function (options) {

    var opt = options || {};

    var name = opt.name || 'default';
    var init = opt.init || false;
    var incrementBy = opt.incrementBy || 0;


    if (!stateData.ipAddressCounters[name] || init) {
      var min = opt.min || "0.0.0.0"
      var max = opt.max || "255.255.255.255";

      if (ipaddr.isValid(min) === false) {
        throw Error("min is not a valid IPv4 address");
      }
      if (ipaddr.isValid(max) === false) {
        throw Error("max is not a valid IPv4 address");
      }

      if (min > max) {
        throw Error('min cannot be greater than max');
      }
      stateData.ipAddressCounters[name] = {
        value: min,
        min: min,
        max: max
      }
    }

    var sc = stateData.ipAddressCounters[name];
    sc.value = _incrementIp(sc.value, incrementBy, sc.min, sc.max);
    return sc.value;
  }
}







