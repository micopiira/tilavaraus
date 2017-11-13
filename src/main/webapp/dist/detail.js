webpackJsonp([0], [
	/* 0 */
	/***/ (function (module, exports, __webpack_require__) {

		/* WEBPACK VAR INJECTION */
		(function (module) {
			var require;//! moment.js
//! version : 2.19.2
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

			;(function (global, factory) {
				true ? module.exports = factory() :
					typeof define === 'function' && define.amd ? define(factory) :
						global.moment = factory()
			}(this, (function () {
				'use strict';

				var hookCallback;

				function hooks() {
					return hookCallback.apply(null, arguments);
				}

// This is done to register the method called with moment()
// without creating circular dependencies.
				function setHookCallback(callback) {
					hookCallback = callback;
				}

				function isArray(input) {
					return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
				}

				function isObject(input) {
					// IE8 will treat undefined and null as object if it wasn't for
					// input != null
					return input != null && Object.prototype.toString.call(input) === '[object Object]';
				}

				function isObjectEmpty(obj) {
					if (Object.getOwnPropertyNames) {
						return (Object.getOwnPropertyNames(obj).length === 0);
					} else {
						var k;
						for (k in obj) {
							if (obj.hasOwnProperty(k)) {
								return false;
							}
						}
						return true;
					}
				}

				function isUndefined(input) {
					return input === void 0;
				}

				function isNumber(input) {
					return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
				}

				function isDate(input) {
					return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
				}

				function map(arr, fn) {
					var res = [], i;
					for (i = 0; i < arr.length; ++i) {
						res.push(fn(arr[i], i));
					}
					return res;
				}

				function hasOwnProp(a, b) {
					return Object.prototype.hasOwnProperty.call(a, b);
				}

				function extend(a, b) {
					for (var i in b) {
						if (hasOwnProp(b, i)) {
							a[i] = b[i];
						}
					}

					if (hasOwnProp(b, 'toString')) {
						a.toString = b.toString;
					}

					if (hasOwnProp(b, 'valueOf')) {
						a.valueOf = b.valueOf;
					}

					return a;
				}

				function createUTC(input, format, locale, strict) {
					return createLocalOrUTC(input, format, locale, strict, true).utc();
				}

				function defaultParsingFlags() {
					// We need to deep clone this object.
					return {
						empty: false,
						unusedTokens: [],
						unusedInput: [],
						overflow: -2,
						charsLeftOver: 0,
						nullInput: false,
						invalidMonth: null,
						invalidFormat: false,
						userInvalidated: false,
						iso: false,
						parsedDateParts: [],
						meridiem: null,
						rfc2822: false,
						weekdayMismatch: false
					};
				}

				function getParsingFlags(m) {
					if (m._pf == null) {
						m._pf = defaultParsingFlags();
					}
					return m._pf;
				}

				var some;
				if (Array.prototype.some) {
					some = Array.prototype.some;
				} else {
					some = function (fun) {
						var t = Object(this);
						var len = t.length >>> 0;

						for (var i = 0; i < len; i++) {
							if (i in t && fun.call(this, t[i], i, t)) {
								return true;
							}
						}

						return false;
					};
				}

				function isValid(m) {
					if (m._isValid == null) {
						var flags = getParsingFlags(m);
						var parsedParts = some.call(flags.parsedDateParts, function (i) {
							return i != null;
						});
						var isNowValid = !isNaN(m._d.getTime()) &&
							flags.overflow < 0 &&
							!flags.empty &&
							!flags.invalidMonth &&
							!flags.invalidWeekday &&
							!flags.weekdayMismatch &&
							!flags.nullInput &&
							!flags.invalidFormat &&
							!flags.userInvalidated &&
							(!flags.meridiem || (flags.meridiem && parsedParts));

						if (m._strict) {
							isNowValid = isNowValid &&
								flags.charsLeftOver === 0 &&
								flags.unusedTokens.length === 0 &&
								flags.bigHour === undefined;
						}

						if (Object.isFrozen == null || !Object.isFrozen(m)) {
							m._isValid = isNowValid;
						}
						else {
							return isNowValid;
						}
					}
					return m._isValid;
				}

				function createInvalid(flags) {
					var m = createUTC(NaN);
					if (flags != null) {
						extend(getParsingFlags(m), flags);
					}
					else {
						getParsingFlags(m).userInvalidated = true;
					}

					return m;
				}

// Plugins that add properties should also add the key here (null value),
// so we can properly clone ourselves.
				var momentProperties = hooks.momentProperties = [];

				function copyConfig(to, from) {
					var i, prop, val;

					if (!isUndefined(from._isAMomentObject)) {
						to._isAMomentObject = from._isAMomentObject;
					}
					if (!isUndefined(from._i)) {
						to._i = from._i;
					}
					if (!isUndefined(from._f)) {
						to._f = from._f;
					}
					if (!isUndefined(from._l)) {
						to._l = from._l;
					}
					if (!isUndefined(from._strict)) {
						to._strict = from._strict;
					}
					if (!isUndefined(from._tzm)) {
						to._tzm = from._tzm;
					}
					if (!isUndefined(from._isUTC)) {
						to._isUTC = from._isUTC;
					}
					if (!isUndefined(from._offset)) {
						to._offset = from._offset;
					}
					if (!isUndefined(from._pf)) {
						to._pf = getParsingFlags(from);
					}
					if (!isUndefined(from._locale)) {
						to._locale = from._locale;
					}

					if (momentProperties.length > 0) {
						for (i = 0; i < momentProperties.length; i++) {
							prop = momentProperties[i];
							val = from[prop];
							if (!isUndefined(val)) {
								to[prop] = val;
							}
						}
					}

					return to;
				}

				var updateInProgress = false;

// Moment prototype object
				function Moment(config) {
					copyConfig(this, config);
					this._d = new Date(config._d != null ? config._d.getTime() : NaN);
					if (!this.isValid()) {
						this._d = new Date(NaN);
					}
					// Prevent infinite loop in case updateOffset creates new moment
					// objects.
					if (updateInProgress === false) {
						updateInProgress = true;
						hooks.updateOffset(this);
						updateInProgress = false;
					}
				}

				function isMoment(obj) {
					return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
				}

				function absFloor(number) {
					if (number < 0) {
						// -0 -> 0
						return Math.ceil(number) || 0;
					} else {
						return Math.floor(number);
					}
				}

				function toInt(argumentForCoercion) {
					var coercedNumber = +argumentForCoercion,
						value = 0;

					if (coercedNumber !== 0 && isFinite(coercedNumber)) {
						value = absFloor(coercedNumber);
					}

					return value;
				}

// compare two arrays, return the number of differences
				function compareArrays(array1, array2, dontConvert) {
					var len = Math.min(array1.length, array2.length),
						lengthDiff = Math.abs(array1.length - array2.length),
						diffs = 0,
						i;
					for (i = 0; i < len; i++) {
						if ((dontConvert && array1[i] !== array2[i]) ||
							(!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
							diffs++;
						}
					}
					return diffs + lengthDiff;
				}

				function warn(msg) {
					if (hooks.suppressDeprecationWarnings === false &&
						(typeof console !== 'undefined') && console.warn) {
						console.warn('Deprecation warning: ' + msg);
					}
				}

				function deprecate(msg, fn) {
					var firstTime = true;

					return extend(function () {
						if (hooks.deprecationHandler != null) {
							hooks.deprecationHandler(null, msg);
						}
						if (firstTime) {
							var args = [];
							var arg;
							for (var i = 0; i < arguments.length; i++) {
								arg = '';
								if (typeof arguments[i] === 'object') {
									arg += '\n[' + i + '] ';
									for (var key in arguments[0]) {
										arg += key + ': ' + arguments[0][key] + ', ';
									}
									arg = arg.slice(0, -2); // Remove trailing comma and space
								} else {
									arg = arguments[i];
								}
								args.push(arg);
							}
							warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
							firstTime = false;
						}
						return fn.apply(this, arguments);
					}, fn);
				}

				var deprecations = {};

				function deprecateSimple(name, msg) {
					if (hooks.deprecationHandler != null) {
						hooks.deprecationHandler(name, msg);
					}
					if (!deprecations[name]) {
						warn(msg);
						deprecations[name] = true;
					}
				}

				hooks.suppressDeprecationWarnings = false;
				hooks.deprecationHandler = null;

				function isFunction(input) {
					return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
				}

				function set(config) {
					var prop, i;
					for (i in config) {
						prop = config[i];
						if (isFunction(prop)) {
							this[i] = prop;
						} else {
							this['_' + i] = prop;
						}
					}
					this._config = config;
					// Lenient ordinal parsing accepts just a number in addition to
					// number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
					// TODO: Remove "ordinalParse" fallback in next major release.
					this._dayOfMonthOrdinalParseLenient = new RegExp(
						(this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
						'|' + (/\d{1,2}/).source);
				}

				function mergeConfigs(parentConfig, childConfig) {
					var res = extend({}, parentConfig), prop;
					for (prop in childConfig) {
						if (hasOwnProp(childConfig, prop)) {
							if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
								res[prop] = {};
								extend(res[prop], parentConfig[prop]);
								extend(res[prop], childConfig[prop]);
							} else if (childConfig[prop] != null) {
								res[prop] = childConfig[prop];
							} else {
								delete res[prop];
							}
						}
					}
					for (prop in parentConfig) {
						if (hasOwnProp(parentConfig, prop) &&
							!hasOwnProp(childConfig, prop) &&
							isObject(parentConfig[prop])) {
							// make sure changes to properties don't modify parent config
							res[prop] = extend({}, res[prop]);
						}
					}
					return res;
				}

				function Locale(config) {
					if (config != null) {
						this.set(config);
					}
				}

				var keys;

				if (Object.keys) {
					keys = Object.keys;
				} else {
					keys = function (obj) {
						var i, res = [];
						for (i in obj) {
							if (hasOwnProp(obj, i)) {
								res.push(i);
							}
						}
						return res;
					};
				}

				var defaultCalendar = {
					sameDay: '[Today at] LT',
					nextDay: '[Tomorrow at] LT',
					nextWeek: 'dddd [at] LT',
					lastDay: '[Yesterday at] LT',
					lastWeek: '[Last] dddd [at] LT',
					sameElse: 'L'
				};

				function calendar(key, mom, now) {
					var output = this._calendar[key] || this._calendar['sameElse'];
					return isFunction(output) ? output.call(mom, now) : output;
				}

				var defaultLongDateFormat = {
					LTS: 'h:mm:ss A',
					LT: 'h:mm A',
					L: 'MM/DD/YYYY',
					LL: 'MMMM D, YYYY',
					LLL: 'MMMM D, YYYY h:mm A',
					LLLL: 'dddd, MMMM D, YYYY h:mm A'
				};

				function longDateFormat(key) {
					var format = this._longDateFormat[key],
						formatUpper = this._longDateFormat[key.toUpperCase()];

					if (format || !formatUpper) {
						return format;
					}

					this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
						return val.slice(1);
					});

					return this._longDateFormat[key];
				}

				var defaultInvalidDate = 'Invalid date';

				function invalidDate() {
					return this._invalidDate;
				}

				var defaultOrdinal = '%d';
				var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

				function ordinal(number) {
					return this._ordinal.replace('%d', number);
				}

				var defaultRelativeTime = {
					future: 'in %s',
					past: '%s ago',
					s: 'a few seconds',
					ss: '%d seconds',
					m: 'a minute',
					mm: '%d minutes',
					h: 'an hour',
					hh: '%d hours',
					d: 'a day',
					dd: '%d days',
					M: 'a month',
					MM: '%d months',
					y: 'a year',
					yy: '%d years'
				};

				function relativeTime(number, withoutSuffix, string, isFuture) {
					var output = this._relativeTime[string];
					return (isFunction(output)) ?
						output(number, withoutSuffix, string, isFuture) :
						output.replace(/%d/i, number);
				}

				function pastFuture(diff, output) {
					var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
					return isFunction(format) ? format(output) : format.replace(/%s/i, output);
				}

				var aliases = {};

				function addUnitAlias(unit, shorthand) {
					var lowerCase = unit.toLowerCase();
					aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
				}

				function normalizeUnits(units) {
					return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
				}

				function normalizeObjectUnits(inputObject) {
					var normalizedInput = {},
						normalizedProp,
						prop;

					for (prop in inputObject) {
						if (hasOwnProp(inputObject, prop)) {
							normalizedProp = normalizeUnits(prop);
							if (normalizedProp) {
								normalizedInput[normalizedProp] = inputObject[prop];
							}
						}
					}

					return normalizedInput;
				}

				var priorities = {};

				function addUnitPriority(unit, priority) {
					priorities[unit] = priority;
				}

				function getPrioritizedUnits(unitsObj) {
					var units = [];
					for (var u in unitsObj) {
						units.push({unit: u, priority: priorities[u]});
					}
					units.sort(function (a, b) {
						return a.priority - b.priority;
					});
					return units;
				}

				function zeroFill(number, targetLength, forceSign) {
					var absNumber = '' + Math.abs(number),
						zerosToFill = targetLength - absNumber.length,
						sign = number >= 0;
					return (sign ? (forceSign ? '+' : '') : '-') +
						Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
				}

				var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

				var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

				var formatFunctions = {};

				var formatTokenFunctions = {};

// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
				function addFormatToken(token, padded, ordinal, callback) {
					var func = callback;
					if (typeof callback === 'string') {
						func = function () {
							return this[callback]();
						};
					}
					if (token) {
						formatTokenFunctions[token] = func;
					}
					if (padded) {
						formatTokenFunctions[padded[0]] = function () {
							return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
						};
					}
					if (ordinal) {
						formatTokenFunctions[ordinal] = function () {
							return this.localeData().ordinal(func.apply(this, arguments), token);
						};
					}
				}

				function removeFormattingTokens(input) {
					if (input.match(/\[[\s\S]/)) {
						return input.replace(/^\[|\]$/g, '');
					}
					return input.replace(/\\/g, '');
				}

				function makeFormatFunction(format) {
					var array = format.match(formattingTokens), i, length;

					for (i = 0, length = array.length; i < length; i++) {
						if (formatTokenFunctions[array[i]]) {
							array[i] = formatTokenFunctions[array[i]];
						} else {
							array[i] = removeFormattingTokens(array[i]);
						}
					}

					return function (mom) {
						var output = '', i;
						for (i = 0; i < length; i++) {
							output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
						}
						return output;
					};
				}

// format date using native date object
				function formatMoment(m, format) {
					if (!m.isValid()) {
						return m.localeData().invalidDate();
					}

					format = expandFormat(format, m.localeData());
					formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

					return formatFunctions[format](m);
				}

				function expandFormat(format, locale) {
					var i = 5;

					function replaceLongDateFormatTokens(input) {
						return locale.longDateFormat(input) || input;
					}

					localFormattingTokens.lastIndex = 0;
					while (i >= 0 && localFormattingTokens.test(format)) {
						format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
						localFormattingTokens.lastIndex = 0;
						i -= 1;
					}

					return format;
				}

				var match1 = /\d/;            //       0 - 9
				var match2 = /\d\d/;          //      00 - 99
				var match3 = /\d{3}/;         //     000 - 999
				var match4 = /\d{4}/;         //    0000 - 9999
				var match6 = /[+-]?\d{6}/;    // -999999 - 999999
				var match1to2 = /\d\d?/;         //       0 - 99
				var match3to4 = /\d\d\d\d?/;     //     999 - 9999
				var match5to6 = /\d\d\d\d\d\d?/; //   99999 - 999999
				var match1to3 = /\d{1,3}/;       //       0 - 999
				var match1to4 = /\d{1,4}/;       //       0 - 9999
				var match1to6 = /[+-]?\d{1,6}/;  // -999999 - 999999

				var matchUnsigned = /\d+/;           //       0 - inf
				var matchSigned = /[+-]?\d+/;      //    -inf - inf

				var matchOffset = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
				var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

				var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

// any word (or two) characters or numbers including two/three word month in arabic.
// includes scottish gaelic two word and hyphenated months
				var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


				var regexes = {};

				function addRegexToken(token, regex, strictRegex) {
					regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
						return (isStrict && strictRegex) ? strictRegex : regex;
					};
				}

				function getParseRegexForToken(token, config) {
					if (!hasOwnProp(regexes, token)) {
						return new RegExp(unescapeFormat(token));
					}

					return regexes[token](config._strict, config._locale);
				}

// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
				function unescapeFormat(s) {
					return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
						return p1 || p2 || p3 || p4;
					}));
				}

				function regexEscape(s) {
					return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
				}

				var tokens = {};

				function addParseToken(token, callback) {
					var i, func = callback;
					if (typeof token === 'string') {
						token = [token];
					}
					if (isNumber(callback)) {
						func = function (input, array) {
							array[callback] = toInt(input);
						};
					}
					for (i = 0; i < token.length; i++) {
						tokens[token[i]] = func;
					}
				}

				function addWeekParseToken(token, callback) {
					addParseToken(token, function (input, array, config, token) {
						config._w = config._w || {};
						callback(input, config._w, config, token);
					});
				}

				function addTimeToArrayFromToken(token, input, config) {
					if (input != null && hasOwnProp(tokens, token)) {
						tokens[token](input, config._a, config, token);
					}
				}

				var YEAR = 0;
				var MONTH = 1;
				var DATE = 2;
				var HOUR = 3;
				var MINUTE = 4;
				var SECOND = 5;
				var MILLISECOND = 6;
				var WEEK = 7;
				var WEEKDAY = 8;

// FORMATTING

				addFormatToken('Y', 0, 0, function () {
					var y = this.year();
					return y <= 9999 ? '' + y : '+' + y;
				});

				addFormatToken(0, ['YY', 2], 0, function () {
					return this.year() % 100;
				});

				addFormatToken(0, ['YYYY', 4], 0, 'year');
				addFormatToken(0, ['YYYYY', 5], 0, 'year');
				addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

// ALIASES

				addUnitAlias('year', 'y');

// PRIORITIES

				addUnitPriority('year', 1);

// PARSING

				addRegexToken('Y', matchSigned);
				addRegexToken('YY', match1to2, match2);
				addRegexToken('YYYY', match1to4, match4);
				addRegexToken('YYYYY', match1to6, match6);
				addRegexToken('YYYYYY', match1to6, match6);

				addParseToken(['YYYYY', 'YYYYYY'], YEAR);
				addParseToken('YYYY', function (input, array) {
					array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
				});
				addParseToken('YY', function (input, array) {
					array[YEAR] = hooks.parseTwoDigitYear(input);
				});
				addParseToken('Y', function (input, array) {
					array[YEAR] = parseInt(input, 10);
				});

// HELPERS

				function daysInYear(year) {
					return isLeapYear(year) ? 366 : 365;
				}

				function isLeapYear(year) {
					return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
				}

// HOOKS

				hooks.parseTwoDigitYear = function (input) {
					return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
				};

// MOMENTS

				var getSetYear = makeGetSet('FullYear', true);

				function getIsLeapYear() {
					return isLeapYear(this.year());
				}

				function makeGetSet(unit, keepTime) {
					return function (value) {
						if (value != null) {
							set$1(this, unit, value);
							hooks.updateOffset(this, keepTime);
							return this;
						} else {
							return get(this, unit);
						}
					};
				}

				function get(mom, unit) {
					return mom.isValid() ?
						mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
				}

				function set$1(mom, unit, value) {
					if (mom.isValid() && !isNaN(value)) {
						if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
							mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
						}
						else {
							mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
						}
					}
				}

// MOMENTS

				function stringGet(units) {
					units = normalizeUnits(units);
					if (isFunction(this[units])) {
						return this[units]();
					}
					return this;
				}


				function stringSet(units, value) {
					if (typeof units === 'object') {
						units = normalizeObjectUnits(units);
						var prioritized = getPrioritizedUnits(units);
						for (var i = 0; i < prioritized.length; i++) {
							this[prioritized[i].unit](units[prioritized[i].unit]);
						}
					} else {
						units = normalizeUnits(units);
						if (isFunction(this[units])) {
							return this[units](value);
						}
					}
					return this;
				}

				function mod(n, x) {
					return ((n % x) + x) % x;
				}

				var indexOf;

				if (Array.prototype.indexOf) {
					indexOf = Array.prototype.indexOf;
				} else {
					indexOf = function (o) {
						// I know
						var i;
						for (i = 0; i < this.length; ++i) {
							if (this[i] === o) {
								return i;
							}
						}
						return -1;
					};
				}

				function daysInMonth(year, month) {
					if (isNaN(year) || isNaN(month)) {
						return NaN;
					}
					var modMonth = mod(month, 12);
					year += (month - modMonth) / 12;
					return modMonth === 1 ? (isLeapYear(year) ? 29 : 28) : (31 - modMonth % 7 % 2);
				}

// FORMATTING

				addFormatToken('M', ['MM', 2], 'Mo', function () {
					return this.month() + 1;
				});

				addFormatToken('MMM', 0, 0, function (format) {
					return this.localeData().monthsShort(this, format);
				});

				addFormatToken('MMMM', 0, 0, function (format) {
					return this.localeData().months(this, format);
				});

// ALIASES

				addUnitAlias('month', 'M');

// PRIORITY

				addUnitPriority('month', 8);

// PARSING

				addRegexToken('M', match1to2);
				addRegexToken('MM', match1to2, match2);
				addRegexToken('MMM', function (isStrict, locale) {
					return locale.monthsShortRegex(isStrict);
				});
				addRegexToken('MMMM', function (isStrict, locale) {
					return locale.monthsRegex(isStrict);
				});

				addParseToken(['M', 'MM'], function (input, array) {
					array[MONTH] = toInt(input) - 1;
				});

				addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
					var month = config._locale.monthsParse(input, token, config._strict);
					// if we didn't find a month name, mark the date as invalid.
					if (month != null) {
						array[MONTH] = month;
					} else {
						getParsingFlags(config).invalidMonth = input;
					}
				});

// LOCALES

				var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
				var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');

				function localeMonths(m, format) {
					if (!m) {
						return isArray(this._months) ? this._months :
							this._months['standalone'];
					}
					return isArray(this._months) ? this._months[m.month()] :
						this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
				}

				var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');

				function localeMonthsShort(m, format) {
					if (!m) {
						return isArray(this._monthsShort) ? this._monthsShort :
							this._monthsShort['standalone'];
					}
					return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
						this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
				}

				function handleStrictParse(monthName, format, strict) {
					var i, ii, mom, llc = monthName.toLocaleLowerCase();
					if (!this._monthsParse) {
						// this is not used
						this._monthsParse = [];
						this._longMonthsParse = [];
						this._shortMonthsParse = [];
						for (i = 0; i < 12; ++i) {
							mom = createUTC([2000, i]);
							this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
							this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
						}
					}

					if (strict) {
						if (format === 'MMM') {
							ii = indexOf.call(this._shortMonthsParse, llc);
							return ii !== -1 ? ii : null;
						} else {
							ii = indexOf.call(this._longMonthsParse, llc);
							return ii !== -1 ? ii : null;
						}
					} else {
						if (format === 'MMM') {
							ii = indexOf.call(this._shortMonthsParse, llc);
							if (ii !== -1) {
								return ii;
							}
							ii = indexOf.call(this._longMonthsParse, llc);
							return ii !== -1 ? ii : null;
						} else {
							ii = indexOf.call(this._longMonthsParse, llc);
							if (ii !== -1) {
								return ii;
							}
							ii = indexOf.call(this._shortMonthsParse, llc);
							return ii !== -1 ? ii : null;
						}
					}
				}

				function localeMonthsParse(monthName, format, strict) {
					var i, mom, regex;

					if (this._monthsParseExact) {
						return handleStrictParse.call(this, monthName, format, strict);
					}

					if (!this._monthsParse) {
						this._monthsParse = [];
						this._longMonthsParse = [];
						this._shortMonthsParse = [];
					}

					// TODO: add sorting
					// Sorting makes sure if one month (or abbr) is a prefix of another
					// see sorting in computeMonthsParse
					for (i = 0; i < 12; i++) {
						// make the regex if we don't have it already
						mom = createUTC([2000, i]);
						if (strict && !this._longMonthsParse[i]) {
							this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
							this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
						}
						if (!strict && !this._monthsParse[i]) {
							regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
							this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
						}
						// test the regex
						if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
							return i;
						} else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
							return i;
						} else if (!strict && this._monthsParse[i].test(monthName)) {
							return i;
						}
					}
				}

// MOMENTS

				function setMonth(mom, value) {
					var dayOfMonth;

					if (!mom.isValid()) {
						// No op
						return mom;
					}

					if (typeof value === 'string') {
						if (/^\d+$/.test(value)) {
							value = toInt(value);
						} else {
							value = mom.localeData().monthsParse(value);
							// TODO: Another silent failure?
							if (!isNumber(value)) {
								return mom;
							}
						}
					}

					dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
					mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
					return mom;
				}

				function getSetMonth(value) {
					if (value != null) {
						setMonth(this, value);
						hooks.updateOffset(this, true);
						return this;
					} else {
						return get(this, 'Month');
					}
				}

				function getDaysInMonth() {
					return daysInMonth(this.year(), this.month());
				}

				var defaultMonthsShortRegex = matchWord;

				function monthsShortRegex(isStrict) {
					if (this._monthsParseExact) {
						if (!hasOwnProp(this, '_monthsRegex')) {
							computeMonthsParse.call(this);
						}
						if (isStrict) {
							return this._monthsShortStrictRegex;
						} else {
							return this._monthsShortRegex;
						}
					} else {
						if (!hasOwnProp(this, '_monthsShortRegex')) {
							this._monthsShortRegex = defaultMonthsShortRegex;
						}
						return this._monthsShortStrictRegex && isStrict ?
							this._monthsShortStrictRegex : this._monthsShortRegex;
					}
				}

				var defaultMonthsRegex = matchWord;

				function monthsRegex(isStrict) {
					if (this._monthsParseExact) {
						if (!hasOwnProp(this, '_monthsRegex')) {
							computeMonthsParse.call(this);
						}
						if (isStrict) {
							return this._monthsStrictRegex;
						} else {
							return this._monthsRegex;
						}
					} else {
						if (!hasOwnProp(this, '_monthsRegex')) {
							this._monthsRegex = defaultMonthsRegex;
						}
						return this._monthsStrictRegex && isStrict ?
							this._monthsStrictRegex : this._monthsRegex;
					}
				}

				function computeMonthsParse() {
					function cmpLenRev(a, b) {
						return b.length - a.length;
					}

					var shortPieces = [], longPieces = [], mixedPieces = [],
						i, mom;
					for (i = 0; i < 12; i++) {
						// make the regex if we don't have it already
						mom = createUTC([2000, i]);
						shortPieces.push(this.monthsShort(mom, ''));
						longPieces.push(this.months(mom, ''));
						mixedPieces.push(this.months(mom, ''));
						mixedPieces.push(this.monthsShort(mom, ''));
					}
					// Sorting makes sure if one month (or abbr) is a prefix of another it
					// will match the longer piece.
					shortPieces.sort(cmpLenRev);
					longPieces.sort(cmpLenRev);
					mixedPieces.sort(cmpLenRev);
					for (i = 0; i < 12; i++) {
						shortPieces[i] = regexEscape(shortPieces[i]);
						longPieces[i] = regexEscape(longPieces[i]);
					}
					for (i = 0; i < 24; i++) {
						mixedPieces[i] = regexEscape(mixedPieces[i]);
					}

					this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
					this._monthsShortRegex = this._monthsRegex;
					this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
					this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
				}

				function createDate(y, m, d, h, M, s, ms) {
					// can't just apply() to create a date:
					// https://stackoverflow.com/q/181348
					var date = new Date(y, m, d, h, M, s, ms);

					// the date constructor remaps years 0-99 to 1900-1999
					if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
						date.setFullYear(y);
					}
					return date;
				}

				function createUTCDate(y) {
					var date = new Date(Date.UTC.apply(null, arguments));

					// the Date.UTC function remaps years 0-99 to 1900-1999
					if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
						date.setUTCFullYear(y);
					}
					return date;
				}

// start-of-first-week - start-of-year
				function firstWeekOffset(year, dow, doy) {
					var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
						fwd = 7 + dow - doy,
						// first-week day local weekday -- which local weekday is fwd
						fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

					return -fwdlw + fwd - 1;
				}

// https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
				function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
					var localWeekday = (7 + weekday - dow) % 7,
						weekOffset = firstWeekOffset(year, dow, doy),
						dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
						resYear, resDayOfYear;

					if (dayOfYear <= 0) {
						resYear = year - 1;
						resDayOfYear = daysInYear(resYear) + dayOfYear;
					} else if (dayOfYear > daysInYear(year)) {
						resYear = year + 1;
						resDayOfYear = dayOfYear - daysInYear(year);
					} else {
						resYear = year;
						resDayOfYear = dayOfYear;
					}

					return {
						year: resYear,
						dayOfYear: resDayOfYear
					};
				}

				function weekOfYear(mom, dow, doy) {
					var weekOffset = firstWeekOffset(mom.year(), dow, doy),
						week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
						resWeek, resYear;

					if (week < 1) {
						resYear = mom.year() - 1;
						resWeek = week + weeksInYear(resYear, dow, doy);
					} else if (week > weeksInYear(mom.year(), dow, doy)) {
						resWeek = week - weeksInYear(mom.year(), dow, doy);
						resYear = mom.year() + 1;
					} else {
						resYear = mom.year();
						resWeek = week;
					}

					return {
						week: resWeek,
						year: resYear
					};
				}

				function weeksInYear(year, dow, doy) {
					var weekOffset = firstWeekOffset(year, dow, doy),
						weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
					return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
				}

// FORMATTING

				addFormatToken('w', ['ww', 2], 'wo', 'week');
				addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

// ALIASES

				addUnitAlias('week', 'w');
				addUnitAlias('isoWeek', 'W');

// PRIORITIES

				addUnitPriority('week', 5);
				addUnitPriority('isoWeek', 5);

// PARSING

				addRegexToken('w', match1to2);
				addRegexToken('ww', match1to2, match2);
				addRegexToken('W', match1to2);
				addRegexToken('WW', match1to2, match2);

				addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
					week[token.substr(0, 1)] = toInt(input);
				});

// HELPERS

// LOCALES

				function localeWeek(mom) {
					return weekOfYear(mom, this._week.dow, this._week.doy).week;
				}

				var defaultLocaleWeek = {
					dow: 0, // Sunday is the first day of the week.
					doy: 6  // The week that contains Jan 1st is the first week of the year.
				};

				function localeFirstDayOfWeek() {
					return this._week.dow;
				}

				function localeFirstDayOfYear() {
					return this._week.doy;
				}

// MOMENTS

				function getSetWeek(input) {
					var week = this.localeData().week(this);
					return input == null ? week : this.add((input - week) * 7, 'd');
				}

				function getSetISOWeek(input) {
					var week = weekOfYear(this, 1, 4).week;
					return input == null ? week : this.add((input - week) * 7, 'd');
				}

// FORMATTING

				addFormatToken('d', 0, 'do', 'day');

				addFormatToken('dd', 0, 0, function (format) {
					return this.localeData().weekdaysMin(this, format);
				});

				addFormatToken('ddd', 0, 0, function (format) {
					return this.localeData().weekdaysShort(this, format);
				});

				addFormatToken('dddd', 0, 0, function (format) {
					return this.localeData().weekdays(this, format);
				});

				addFormatToken('e', 0, 0, 'weekday');
				addFormatToken('E', 0, 0, 'isoWeekday');

// ALIASES

				addUnitAlias('day', 'd');
				addUnitAlias('weekday', 'e');
				addUnitAlias('isoWeekday', 'E');

// PRIORITY
				addUnitPriority('day', 11);
				addUnitPriority('weekday', 11);
				addUnitPriority('isoWeekday', 11);

// PARSING

				addRegexToken('d', match1to2);
				addRegexToken('e', match1to2);
				addRegexToken('E', match1to2);
				addRegexToken('dd', function (isStrict, locale) {
					return locale.weekdaysMinRegex(isStrict);
				});
				addRegexToken('ddd', function (isStrict, locale) {
					return locale.weekdaysShortRegex(isStrict);
				});
				addRegexToken('dddd', function (isStrict, locale) {
					return locale.weekdaysRegex(isStrict);
				});

				addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
					var weekday = config._locale.weekdaysParse(input, token, config._strict);
					// if we didn't get a weekday name, mark the date as invalid
					if (weekday != null) {
						week.d = weekday;
					} else {
						getParsingFlags(config).invalidWeekday = input;
					}
				});

				addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
					week[token] = toInt(input);
				});

// HELPERS

				function parseWeekday(input, locale) {
					if (typeof input !== 'string') {
						return input;
					}

					if (!isNaN(input)) {
						return parseInt(input, 10);
					}

					input = locale.weekdaysParse(input);
					if (typeof input === 'number') {
						return input;
					}

					return null;
				}

				function parseIsoWeekday(input, locale) {
					if (typeof input === 'string') {
						return locale.weekdaysParse(input) % 7 || 7;
					}
					return isNaN(input) ? null : input;
				}

// LOCALES

				var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');

				function localeWeekdays(m, format) {
					if (!m) {
						return isArray(this._weekdays) ? this._weekdays :
							this._weekdays['standalone'];
					}
					return isArray(this._weekdays) ? this._weekdays[m.day()] :
						this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
				}

				var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');

				function localeWeekdaysShort(m) {
					return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
				}

				var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');

				function localeWeekdaysMin(m) {
					return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
				}

				function handleStrictParse$1(weekdayName, format, strict) {
					var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
					if (!this._weekdaysParse) {
						this._weekdaysParse = [];
						this._shortWeekdaysParse = [];
						this._minWeekdaysParse = [];

						for (i = 0; i < 7; ++i) {
							mom = createUTC([2000, 1]).day(i);
							this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
							this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
							this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
						}
					}

					if (strict) {
						if (format === 'dddd') {
							ii = indexOf.call(this._weekdaysParse, llc);
							return ii !== -1 ? ii : null;
						} else if (format === 'ddd') {
							ii = indexOf.call(this._shortWeekdaysParse, llc);
							return ii !== -1 ? ii : null;
						} else {
							ii = indexOf.call(this._minWeekdaysParse, llc);
							return ii !== -1 ? ii : null;
						}
					} else {
						if (format === 'dddd') {
							ii = indexOf.call(this._weekdaysParse, llc);
							if (ii !== -1) {
								return ii;
							}
							ii = indexOf.call(this._shortWeekdaysParse, llc);
							if (ii !== -1) {
								return ii;
							}
							ii = indexOf.call(this._minWeekdaysParse, llc);
							return ii !== -1 ? ii : null;
						} else if (format === 'ddd') {
							ii = indexOf.call(this._shortWeekdaysParse, llc);
							if (ii !== -1) {
								return ii;
							}
							ii = indexOf.call(this._weekdaysParse, llc);
							if (ii !== -1) {
								return ii;
							}
							ii = indexOf.call(this._minWeekdaysParse, llc);
							return ii !== -1 ? ii : null;
						} else {
							ii = indexOf.call(this._minWeekdaysParse, llc);
							if (ii !== -1) {
								return ii;
							}
							ii = indexOf.call(this._weekdaysParse, llc);
							if (ii !== -1) {
								return ii;
							}
							ii = indexOf.call(this._shortWeekdaysParse, llc);
							return ii !== -1 ? ii : null;
						}
					}
				}

				function localeWeekdaysParse(weekdayName, format, strict) {
					var i, mom, regex;

					if (this._weekdaysParseExact) {
						return handleStrictParse$1.call(this, weekdayName, format, strict);
					}

					if (!this._weekdaysParse) {
						this._weekdaysParse = [];
						this._minWeekdaysParse = [];
						this._shortWeekdaysParse = [];
						this._fullWeekdaysParse = [];
					}

					for (i = 0; i < 7; i++) {
						// make the regex if we don't have it already

						mom = createUTC([2000, 1]).day(i);
						if (strict && !this._fullWeekdaysParse[i]) {
							this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
							this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
							this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
						}
						if (!this._weekdaysParse[i]) {
							regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
							this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
						}
						// test the regex
						if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
							return i;
						} else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
							return i;
						} else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
							return i;
						} else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
							return i;
						}
					}
				}

// MOMENTS

				function getSetDayOfWeek(input) {
					if (!this.isValid()) {
						return input != null ? this : NaN;
					}
					var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
					if (input != null) {
						input = parseWeekday(input, this.localeData());
						return this.add(input - day, 'd');
					} else {
						return day;
					}
				}

				function getSetLocaleDayOfWeek(input) {
					if (!this.isValid()) {
						return input != null ? this : NaN;
					}
					var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
					return input == null ? weekday : this.add(input - weekday, 'd');
				}

				function getSetISODayOfWeek(input) {
					if (!this.isValid()) {
						return input != null ? this : NaN;
					}

					// behaves the same as moment#day except
					// as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
					// as a setter, sunday should belong to the previous week.

					if (input != null) {
						var weekday = parseIsoWeekday(input, this.localeData());
						return this.day(this.day() % 7 ? weekday : weekday - 7);
					} else {
						return this.day() || 7;
					}
				}

				var defaultWeekdaysRegex = matchWord;

				function weekdaysRegex(isStrict) {
					if (this._weekdaysParseExact) {
						if (!hasOwnProp(this, '_weekdaysRegex')) {
							computeWeekdaysParse.call(this);
						}
						if (isStrict) {
							return this._weekdaysStrictRegex;
						} else {
							return this._weekdaysRegex;
						}
					} else {
						if (!hasOwnProp(this, '_weekdaysRegex')) {
							this._weekdaysRegex = defaultWeekdaysRegex;
						}
						return this._weekdaysStrictRegex && isStrict ?
							this._weekdaysStrictRegex : this._weekdaysRegex;
					}
				}

				var defaultWeekdaysShortRegex = matchWord;

				function weekdaysShortRegex(isStrict) {
					if (this._weekdaysParseExact) {
						if (!hasOwnProp(this, '_weekdaysRegex')) {
							computeWeekdaysParse.call(this);
						}
						if (isStrict) {
							return this._weekdaysShortStrictRegex;
						} else {
							return this._weekdaysShortRegex;
						}
					} else {
						if (!hasOwnProp(this, '_weekdaysShortRegex')) {
							this._weekdaysShortRegex = defaultWeekdaysShortRegex;
						}
						return this._weekdaysShortStrictRegex && isStrict ?
							this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
					}
				}

				var defaultWeekdaysMinRegex = matchWord;

				function weekdaysMinRegex(isStrict) {
					if (this._weekdaysParseExact) {
						if (!hasOwnProp(this, '_weekdaysRegex')) {
							computeWeekdaysParse.call(this);
						}
						if (isStrict) {
							return this._weekdaysMinStrictRegex;
						} else {
							return this._weekdaysMinRegex;
						}
					} else {
						if (!hasOwnProp(this, '_weekdaysMinRegex')) {
							this._weekdaysMinRegex = defaultWeekdaysMinRegex;
						}
						return this._weekdaysMinStrictRegex && isStrict ?
							this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
					}
				}


				function computeWeekdaysParse() {
					function cmpLenRev(a, b) {
						return b.length - a.length;
					}

					var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
						i, mom, minp, shortp, longp;
					for (i = 0; i < 7; i++) {
						// make the regex if we don't have it already
						mom = createUTC([2000, 1]).day(i);
						minp = this.weekdaysMin(mom, '');
						shortp = this.weekdaysShort(mom, '');
						longp = this.weekdays(mom, '');
						minPieces.push(minp);
						shortPieces.push(shortp);
						longPieces.push(longp);
						mixedPieces.push(minp);
						mixedPieces.push(shortp);
						mixedPieces.push(longp);
					}
					// Sorting makes sure if one weekday (or abbr) is a prefix of another it
					// will match the longer piece.
					minPieces.sort(cmpLenRev);
					shortPieces.sort(cmpLenRev);
					longPieces.sort(cmpLenRev);
					mixedPieces.sort(cmpLenRev);
					for (i = 0; i < 7; i++) {
						shortPieces[i] = regexEscape(shortPieces[i]);
						longPieces[i] = regexEscape(longPieces[i]);
						mixedPieces[i] = regexEscape(mixedPieces[i]);
					}

					this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
					this._weekdaysShortRegex = this._weekdaysRegex;
					this._weekdaysMinRegex = this._weekdaysRegex;

					this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
					this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
					this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
				}

// FORMATTING

				function hFormat() {
					return this.hours() % 12 || 12;
				}

				function kFormat() {
					return this.hours() || 24;
				}

				addFormatToken('H', ['HH', 2], 0, 'hour');
				addFormatToken('h', ['hh', 2], 0, hFormat);
				addFormatToken('k', ['kk', 2], 0, kFormat);

				addFormatToken('hmm', 0, 0, function () {
					return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
				});

				addFormatToken('hmmss', 0, 0, function () {
					return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
						zeroFill(this.seconds(), 2);
				});

				addFormatToken('Hmm', 0, 0, function () {
					return '' + this.hours() + zeroFill(this.minutes(), 2);
				});

				addFormatToken('Hmmss', 0, 0, function () {
					return '' + this.hours() + zeroFill(this.minutes(), 2) +
						zeroFill(this.seconds(), 2);
				});

				function meridiem(token, lowercase) {
					addFormatToken(token, 0, 0, function () {
						return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
					});
				}

				meridiem('a', true);
				meridiem('A', false);

// ALIASES

				addUnitAlias('hour', 'h');

// PRIORITY
				addUnitPriority('hour', 13);

// PARSING

				function matchMeridiem(isStrict, locale) {
					return locale._meridiemParse;
				}

				addRegexToken('a', matchMeridiem);
				addRegexToken('A', matchMeridiem);
				addRegexToken('H', match1to2);
				addRegexToken('h', match1to2);
				addRegexToken('k', match1to2);
				addRegexToken('HH', match1to2, match2);
				addRegexToken('hh', match1to2, match2);
				addRegexToken('kk', match1to2, match2);

				addRegexToken('hmm', match3to4);
				addRegexToken('hmmss', match5to6);
				addRegexToken('Hmm', match3to4);
				addRegexToken('Hmmss', match5to6);

				addParseToken(['H', 'HH'], HOUR);
				addParseToken(['k', 'kk'], function (input, array, config) {
					var kInput = toInt(input);
					array[HOUR] = kInput === 24 ? 0 : kInput;
				});
				addParseToken(['a', 'A'], function (input, array, config) {
					config._isPm = config._locale.isPM(input);
					config._meridiem = input;
				});
				addParseToken(['h', 'hh'], function (input, array, config) {
					array[HOUR] = toInt(input);
					getParsingFlags(config).bigHour = true;
				});
				addParseToken('hmm', function (input, array, config) {
					var pos = input.length - 2;
					array[HOUR] = toInt(input.substr(0, pos));
					array[MINUTE] = toInt(input.substr(pos));
					getParsingFlags(config).bigHour = true;
				});
				addParseToken('hmmss', function (input, array, config) {
					var pos1 = input.length - 4;
					var pos2 = input.length - 2;
					array[HOUR] = toInt(input.substr(0, pos1));
					array[MINUTE] = toInt(input.substr(pos1, 2));
					array[SECOND] = toInt(input.substr(pos2));
					getParsingFlags(config).bigHour = true;
				});
				addParseToken('Hmm', function (input, array, config) {
					var pos = input.length - 2;
					array[HOUR] = toInt(input.substr(0, pos));
					array[MINUTE] = toInt(input.substr(pos));
				});
				addParseToken('Hmmss', function (input, array, config) {
					var pos1 = input.length - 4;
					var pos2 = input.length - 2;
					array[HOUR] = toInt(input.substr(0, pos1));
					array[MINUTE] = toInt(input.substr(pos1, 2));
					array[SECOND] = toInt(input.substr(pos2));
				});

// LOCALES

				function localeIsPM(input) {
					// IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
					// Using charAt should be more compatible.
					return ((input + '').toLowerCase().charAt(0) === 'p');
				}

				var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;

				function localeMeridiem(hours, minutes, isLower) {
					if (hours > 11) {
						return isLower ? 'pm' : 'PM';
					} else {
						return isLower ? 'am' : 'AM';
					}
				}


// MOMENTS

// Setting the hour should keep the time, because the user explicitly
// specified which hour he wants. So trying to maintain the same hour (in
// a new timezone) makes sense. Adding/subtracting hours does not follow
// this rule.
				var getSetHour = makeGetSet('Hours', true);

// months
// week
// weekdays
// meridiem
				var baseConfig = {
					calendar: defaultCalendar,
					longDateFormat: defaultLongDateFormat,
					invalidDate: defaultInvalidDate,
					ordinal: defaultOrdinal,
					dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
					relativeTime: defaultRelativeTime,

					months: defaultLocaleMonths,
					monthsShort: defaultLocaleMonthsShort,

					week: defaultLocaleWeek,

					weekdays: defaultLocaleWeekdays,
					weekdaysMin: defaultLocaleWeekdaysMin,
					weekdaysShort: defaultLocaleWeekdaysShort,

					meridiemParse: defaultLocaleMeridiemParse
				};

// internal storage for locale config files
				var locales = {};
				var localeFamilies = {};
				var globalLocale;

				function normalizeLocale(key) {
					return key ? key.toLowerCase().replace('_', '-') : key;
				}

// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
				function chooseLocale(names) {
					var i = 0, j, next, locale, split;

					while (i < names.length) {
						split = normalizeLocale(names[i]).split('-');
						j = split.length;
						next = normalizeLocale(names[i + 1]);
						next = next ? next.split('-') : null;
						while (j > 0) {
							locale = loadLocale(split.slice(0, j).join('-'));
							if (locale) {
								return locale;
							}
							if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
								//the next array item is better than a shallower substring of this one
								break;
							}
							j--;
						}
						i++;
					}
					return null;
				}

				function loadLocale(name) {
					var oldLocale = null;
					// TODO: Find a better way to register and load all the locales in Node
					if (!locales[name] && (typeof module !== 'undefined') &&
						module && module.exports) {
						try {
							oldLocale = globalLocale._abbr;
							var aliasedRequire = require;
							__webpack_require__(125)("./" + name);
							getSetGlobalLocale(oldLocale);
						} catch (e) {
						}
					}
					return locales[name];
				}

// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
				function getSetGlobalLocale(key, values) {
					var data;
					if (key) {
						if (isUndefined(values)) {
							data = getLocale(key);
						}
						else {
							data = defineLocale(key, values);
						}

						if (data) {
							// moment.duration._locale = moment._locale = data;
							globalLocale = data;
						}
					}

					return globalLocale._abbr;
				}

				function defineLocale(name, config) {
					if (config !== null) {
						var parentConfig = baseConfig;
						config.abbr = name;
						if (locales[name] != null) {
							deprecateSimple('defineLocaleOverride',
								'use moment.updateLocale(localeName, config) to change ' +
								'an existing locale. moment.defineLocale(localeName, ' +
								'config) should only be used for creating a new locale ' +
								'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
							parentConfig = locales[name]._config;
						} else if (config.parentLocale != null) {
							if (locales[config.parentLocale] != null) {
								parentConfig = locales[config.parentLocale]._config;
							} else {
								if (!localeFamilies[config.parentLocale]) {
									localeFamilies[config.parentLocale] = [];
								}
								localeFamilies[config.parentLocale].push({
									name: name,
									config: config
								});
								return null;
							}
						}
						locales[name] = new Locale(mergeConfigs(parentConfig, config));

						if (localeFamilies[name]) {
							localeFamilies[name].forEach(function (x) {
								defineLocale(x.name, x.config);
							});
						}

						// backwards compat for now: also set the locale
						// make sure we set the locale AFTER all child locales have been
						// created, so we won't end up with the child locale set.
						getSetGlobalLocale(name);


						return locales[name];
					} else {
						// useful for testing
						delete locales[name];
						return null;
					}
				}

				function updateLocale(name, config) {
					if (config != null) {
						var locale, tmpLocale, parentConfig = baseConfig;
						// MERGE
						tmpLocale = loadLocale(name);
						if (tmpLocale != null) {
							parentConfig = tmpLocale._config;
						}
						config = mergeConfigs(parentConfig, config);
						locale = new Locale(config);
						locale.parentLocale = locales[name];
						locales[name] = locale;

						// backwards compat for now: also set the locale
						getSetGlobalLocale(name);
					} else {
						// pass null for config to unupdate, useful for tests
						if (locales[name] != null) {
							if (locales[name].parentLocale != null) {
								locales[name] = locales[name].parentLocale;
							} else if (locales[name] != null) {
								delete locales[name];
							}
						}
					}
					return locales[name];
				}

// returns locale data
				function getLocale(key) {
					var locale;

					if (key && key._locale && key._locale._abbr) {
						key = key._locale._abbr;
					}

					if (!key) {
						return globalLocale;
					}

					if (!isArray(key)) {
						//short-circuit everything else
						locale = loadLocale(key);
						if (locale) {
							return locale;
						}
						key = [key];
					}

					return chooseLocale(key);
				}

				function listLocales() {
					return keys(locales);
				}

				function checkOverflow(m) {
					var overflow;
					var a = m._a;

					if (a && getParsingFlags(m).overflow === -2) {
						overflow =
							a[MONTH] < 0 || a[MONTH] > 11 ? MONTH :
								a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
									a[HOUR] < 0 || a[HOUR] > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
										a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE :
											a[SECOND] < 0 || a[SECOND] > 59 ? SECOND :
												a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
													-1;

						if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
							overflow = DATE;
						}
						if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
							overflow = WEEK;
						}
						if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
							overflow = WEEKDAY;
						}

						getParsingFlags(m).overflow = overflow;
					}

					return m;
				}

// Pick the first defined of two or three arguments.
				function defaults(a, b, c) {
					if (a != null) {
						return a;
					}
					if (b != null) {
						return b;
					}
					return c;
				}

				function currentDateArray(config) {
					// hooks is actually the exported moment object
					var nowValue = new Date(hooks.now());
					if (config._useUTC) {
						return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
					}
					return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
				}

// convert an array to a date.
// the array should mirror the parameters below
// note: all values past the year are optional and will default to the lowest possible value.
// [year, month, day , hour, minute, second, millisecond]
				function configFromArray(config) {
					var i, date, input = [], currentDate, yearToUse;

					if (config._d) {
						return;
					}

					currentDate = currentDateArray(config);

					//compute day of the year from weeks and weekdays
					if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
						dayOfYearFromWeekInfo(config);
					}

					//if the day of the year is set, figure out what it is
					if (config._dayOfYear != null) {
						yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

						if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
							getParsingFlags(config)._overflowDayOfYear = true;
						}

						date = createUTCDate(yearToUse, 0, config._dayOfYear);
						config._a[MONTH] = date.getUTCMonth();
						config._a[DATE] = date.getUTCDate();
					}

					// Default to current date.
					// * if no year, month, day of month are given, default to today
					// * if day of month is given, default month and year
					// * if month is given, default only year
					// * if year is given, don't default anything
					for (i = 0; i < 3 && config._a[i] == null; ++i) {
						config._a[i] = input[i] = currentDate[i];
					}

					// Zero out whatever was not defaulted, including time
					for (; i < 7; i++) {
						config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
					}

					// Check for 24:00:00.000
					if (config._a[HOUR] === 24 &&
						config._a[MINUTE] === 0 &&
						config._a[SECOND] === 0 &&
						config._a[MILLISECOND] === 0) {
						config._nextDay = true;
						config._a[HOUR] = 0;
					}

					config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
					// Apply timezone offset from input. The actual utcOffset can be changed
					// with parseZone.
					if (config._tzm != null) {
						config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
					}

					if (config._nextDay) {
						config._a[HOUR] = 24;
					}

					// check for mismatching day of week
					if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== config._d.getDay()) {
						getParsingFlags(config).weekdayMismatch = true;
					}
				}

				function dayOfYearFromWeekInfo(config) {
					var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

					w = config._w;
					if (w.GG != null || w.W != null || w.E != null) {
						dow = 1;
						doy = 4;

						// TODO: We need to take the current isoWeekYear, but that depends on
						// how we interpret now (local, utc, fixed offset). So create
						// a now version of current config (take local/utc/offset flags, and
						// create now).
						weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
						week = defaults(w.W, 1);
						weekday = defaults(w.E, 1);
						if (weekday < 1 || weekday > 7) {
							weekdayOverflow = true;
						}
					} else {
						dow = config._locale._week.dow;
						doy = config._locale._week.doy;

						var curWeek = weekOfYear(createLocal(), dow, doy);

						weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

						// Default to current week.
						week = defaults(w.w, curWeek.week);

						if (w.d != null) {
							// weekday -- low day numbers are considered next week
							weekday = w.d;
							if (weekday < 0 || weekday > 6) {
								weekdayOverflow = true;
							}
						} else if (w.e != null) {
							// local weekday -- counting starts from begining of week
							weekday = w.e + dow;
							if (w.e < 0 || w.e > 6) {
								weekdayOverflow = true;
							}
						} else {
							// default to begining of week
							weekday = dow;
						}
					}
					if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
						getParsingFlags(config)._overflowWeeks = true;
					} else if (weekdayOverflow != null) {
						getParsingFlags(config)._overflowWeekday = true;
					} else {
						temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
						config._a[YEAR] = temp.year;
						config._dayOfYear = temp.dayOfYear;
					}
				}

// iso 8601 regex
// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
				var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
				var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

				var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

				var isoDates = [
					['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
					['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
					['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
					['GGGG-[W]WW', /\d{4}-W\d\d/, false],
					['YYYY-DDD', /\d{4}-\d{3}/],
					['YYYY-MM', /\d{4}-\d\d/, false],
					['YYYYYYMMDD', /[+-]\d{10}/],
					['YYYYMMDD', /\d{8}/],
					// YYYYMM is NOT allowed by the standard
					['GGGG[W]WWE', /\d{4}W\d{3}/],
					['GGGG[W]WW', /\d{4}W\d{2}/, false],
					['YYYYDDD', /\d{7}/]
				];

// iso time formats and regexes
				var isoTimes = [
					['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
					['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
					['HH:mm:ss', /\d\d:\d\d:\d\d/],
					['HH:mm', /\d\d:\d\d/],
					['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
					['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
					['HHmmss', /\d\d\d\d\d\d/],
					['HHmm', /\d\d\d\d/],
					['HH', /\d\d/]
				];

				var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

// date from iso format
				function configFromISO(config) {
					var i, l,
						string = config._i,
						match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
						allowTime, dateFormat, timeFormat, tzFormat;

					if (match) {
						getParsingFlags(config).iso = true;

						for (i = 0, l = isoDates.length; i < l; i++) {
							if (isoDates[i][1].exec(match[1])) {
								dateFormat = isoDates[i][0];
								allowTime = isoDates[i][2] !== false;
								break;
							}
						}
						if (dateFormat == null) {
							config._isValid = false;
							return;
						}
						if (match[3]) {
							for (i = 0, l = isoTimes.length; i < l; i++) {
								if (isoTimes[i][1].exec(match[3])) {
									// match[2] should be 'T' or space
									timeFormat = (match[2] || ' ') + isoTimes[i][0];
									break;
								}
							}
							if (timeFormat == null) {
								config._isValid = false;
								return;
							}
						}
						if (!allowTime && timeFormat != null) {
							config._isValid = false;
							return;
						}
						if (match[4]) {
							if (tzRegex.exec(match[4])) {
								tzFormat = 'Z';
							} else {
								config._isValid = false;
								return;
							}
						}
						config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
						configFromStringAndFormat(config);
					} else {
						config._isValid = false;
					}
				}

// RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
				var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;

				function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
					var result = [
						untruncateYear(yearStr),
						defaultLocaleMonthsShort.indexOf(monthStr),
						parseInt(dayStr, 10),
						parseInt(hourStr, 10),
						parseInt(minuteStr, 10)
					];

					if (secondStr) {
						result.push(parseInt(secondStr, 10));
					}

					return result;
				}

				function untruncateYear(yearStr) {
					var year = parseInt(yearStr, 10);
					if (year <= 49) {
						return 2000 + year;
					} else if (year <= 999) {
						return 1900 + year;
					}
					return year;
				}

				function preprocessRFC2822(s) {
					// Remove comments and folding whitespace and replace multiple-spaces with a single space
					return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').trim();
				}

				function checkWeekday(weekdayStr, parsedInput, config) {
					if (weekdayStr) {
						// TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
						var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
							weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
						if (weekdayProvided !== weekdayActual) {
							getParsingFlags(config).weekdayMismatch = true;
							config._isValid = false;
							return false;
						}
					}
					return true;
				}

				var obsOffsets = {
					UT: 0,
					GMT: 0,
					EDT: -4 * 60,
					EST: -5 * 60,
					CDT: -5 * 60,
					CST: -6 * 60,
					MDT: -6 * 60,
					MST: -7 * 60,
					PDT: -7 * 60,
					PST: -8 * 60
				};

				function calculateOffset(obsOffset, militaryOffset, numOffset) {
					if (obsOffset) {
						return obsOffsets[obsOffset];
					} else if (militaryOffset) {
						// the only allowed military tz is Z
						return 0;
					} else {
						var hm = parseInt(numOffset, 10);
						var m = hm % 100, h = (hm - m) / 100;
						return h * 60 + m;
					}
				}

// date and time from ref 2822 format
				function configFromRFC2822(config) {
					var match = rfc2822.exec(preprocessRFC2822(config._i));
					if (match) {
						var parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
						if (!checkWeekday(match[1], parsedArray, config)) {
							return;
						}

						config._a = parsedArray;
						config._tzm = calculateOffset(match[8], match[9], match[10]);

						config._d = createUTCDate.apply(null, config._a);
						config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

						getParsingFlags(config).rfc2822 = true;
					} else {
						config._isValid = false;
					}
				}

// date from iso format or fallback
				function configFromString(config) {
					var matched = aspNetJsonRegex.exec(config._i);

					if (matched !== null) {
						config._d = new Date(+matched[1]);
						return;
					}

					configFromISO(config);
					if (config._isValid === false) {
						delete config._isValid;
					} else {
						return;
					}

					configFromRFC2822(config);
					if (config._isValid === false) {
						delete config._isValid;
					} else {
						return;
					}

					// Final attempt, use Input Fallback
					hooks.createFromInputFallback(config);
				}

				hooks.createFromInputFallback = deprecate(
					'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
					'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
					'discouraged and will be removed in an upcoming major release. Please refer to ' +
					'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
					function (config) {
						config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
					}
				);

// constant that refers to the ISO standard
				hooks.ISO_8601 = function () {
				};

// constant that refers to the RFC 2822 form
				hooks.RFC_2822 = function () {
				};

// date from string and format string
				function configFromStringAndFormat(config) {
					// TODO: Move this to another part of the creation flow to prevent circular deps
					if (config._f === hooks.ISO_8601) {
						configFromISO(config);
						return;
					}
					if (config._f === hooks.RFC_2822) {
						configFromRFC2822(config);
						return;
					}
					config._a = [];
					getParsingFlags(config).empty = true;

					// This array is used to make a Date, either with `new Date` or `Date.UTC`
					var string = '' + config._i,
						i, parsedInput, tokens, token, skipped,
						stringLength = string.length,
						totalParsedInputLength = 0;

					tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

					for (i = 0; i < tokens.length; i++) {
						token = tokens[i];
						parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
						// console.log('token', token, 'parsedInput', parsedInput,
						//         'regex', getParseRegexForToken(token, config));
						if (parsedInput) {
							skipped = string.substr(0, string.indexOf(parsedInput));
							if (skipped.length > 0) {
								getParsingFlags(config).unusedInput.push(skipped);
							}
							string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
							totalParsedInputLength += parsedInput.length;
						}
						// don't parse if it's not a known token
						if (formatTokenFunctions[token]) {
							if (parsedInput) {
								getParsingFlags(config).empty = false;
							}
							else {
								getParsingFlags(config).unusedTokens.push(token);
							}
							addTimeToArrayFromToken(token, parsedInput, config);
						}
						else if (config._strict && !parsedInput) {
							getParsingFlags(config).unusedTokens.push(token);
						}
					}

					// add remaining unparsed input length to the string
					getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
					if (string.length > 0) {
						getParsingFlags(config).unusedInput.push(string);
					}

					// clear _12h flag if hour is <= 12
					if (config._a[HOUR] <= 12 &&
						getParsingFlags(config).bigHour === true &&
						config._a[HOUR] > 0) {
						getParsingFlags(config).bigHour = undefined;
					}

					getParsingFlags(config).parsedDateParts = config._a.slice(0);
					getParsingFlags(config).meridiem = config._meridiem;
					// handle meridiem
					config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

					configFromArray(config);
					checkOverflow(config);
				}


				function meridiemFixWrap(locale, hour, meridiem) {
					var isPm;

					if (meridiem == null) {
						// nothing to do
						return hour;
					}
					if (locale.meridiemHour != null) {
						return locale.meridiemHour(hour, meridiem);
					} else if (locale.isPM != null) {
						// Fallback
						isPm = locale.isPM(meridiem);
						if (isPm && hour < 12) {
							hour += 12;
						}
						if (!isPm && hour === 12) {
							hour = 0;
						}
						return hour;
					} else {
						// this is not supposed to happen
						return hour;
					}
				}

// date from string and array of format strings
				function configFromStringAndArray(config) {
					var tempConfig,
						bestMoment,

						scoreToBeat,
						i,
						currentScore;

					if (config._f.length === 0) {
						getParsingFlags(config).invalidFormat = true;
						config._d = new Date(NaN);
						return;
					}

					for (i = 0; i < config._f.length; i++) {
						currentScore = 0;
						tempConfig = copyConfig({}, config);
						if (config._useUTC != null) {
							tempConfig._useUTC = config._useUTC;
						}
						tempConfig._f = config._f[i];
						configFromStringAndFormat(tempConfig);

						if (!isValid(tempConfig)) {
							continue;
						}

						// if there is any input that was not parsed add a penalty for that format
						currentScore += getParsingFlags(tempConfig).charsLeftOver;

						//or tokens
						currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

						getParsingFlags(tempConfig).score = currentScore;

						if (scoreToBeat == null || currentScore < scoreToBeat) {
							scoreToBeat = currentScore;
							bestMoment = tempConfig;
						}
					}

					extend(config, bestMoment || tempConfig);
				}

				function configFromObject(config) {
					if (config._d) {
						return;
					}

					var i = normalizeObjectUnits(config._i);
					config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
						return obj && parseInt(obj, 10);
					});

					configFromArray(config);
				}

				function createFromConfig(config) {
					var res = new Moment(checkOverflow(prepareConfig(config)));
					if (res._nextDay) {
						// Adding is smart enough around DST
						res.add(1, 'd');
						res._nextDay = undefined;
					}

					return res;
				}

				function prepareConfig(config) {
					var input = config._i,
						format = config._f;

					config._locale = config._locale || getLocale(config._l);

					if (input === null || (format === undefined && input === '')) {
						return createInvalid({nullInput: true});
					}

					if (typeof input === 'string') {
						config._i = input = config._locale.preparse(input);
					}

					if (isMoment(input)) {
						return new Moment(checkOverflow(input));
					} else if (isDate(input)) {
						config._d = input;
					} else if (isArray(format)) {
						configFromStringAndArray(config);
					} else if (format) {
						configFromStringAndFormat(config);
					} else {
						configFromInput(config);
					}

					if (!isValid(config)) {
						config._d = null;
					}

					return config;
				}

				function configFromInput(config) {
					var input = config._i;
					if (isUndefined(input)) {
						config._d = new Date(hooks.now());
					} else if (isDate(input)) {
						config._d = new Date(input.valueOf());
					} else if (typeof input === 'string') {
						configFromString(config);
					} else if (isArray(input)) {
						config._a = map(input.slice(0), function (obj) {
							return parseInt(obj, 10);
						});
						configFromArray(config);
					} else if (isObject(input)) {
						configFromObject(config);
					} else if (isNumber(input)) {
						// from milliseconds
						config._d = new Date(input);
					} else {
						hooks.createFromInputFallback(config);
					}
				}

				function createLocalOrUTC(input, format, locale, strict, isUTC) {
					var c = {};

					if (locale === true || locale === false) {
						strict = locale;
						locale = undefined;
					}

					if ((isObject(input) && isObjectEmpty(input)) ||
						(isArray(input) && input.length === 0)) {
						input = undefined;
					}
					// object construction must be done this way.
					// https://github.com/moment/moment/issues/1423
					c._isAMomentObject = true;
					c._useUTC = c._isUTC = isUTC;
					c._l = locale;
					c._i = input;
					c._f = format;
					c._strict = strict;

					return createFromConfig(c);
				}

				function createLocal(input, format, locale, strict) {
					return createLocalOrUTC(input, format, locale, strict, false);
				}

				var prototypeMin = deprecate(
					'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
					function () {
						var other = createLocal.apply(null, arguments);
						if (this.isValid() && other.isValid()) {
							return other < this ? this : other;
						} else {
							return createInvalid();
						}
					}
				);

				var prototypeMax = deprecate(
					'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
					function () {
						var other = createLocal.apply(null, arguments);
						if (this.isValid() && other.isValid()) {
							return other > this ? this : other;
						} else {
							return createInvalid();
						}
					}
				);

// Pick a moment m from moments so that m[fn](other) is true for all
// other. This relies on the function fn to be transitive.
//
// moments should either be an array of moment objects or an array, whose
// first element is an array of moment objects.
				function pickBy(fn, moments) {
					var res, i;
					if (moments.length === 1 && isArray(moments[0])) {
						moments = moments[0];
					}
					if (!moments.length) {
						return createLocal();
					}
					res = moments[0];
					for (i = 1; i < moments.length; ++i) {
						if (!moments[i].isValid() || moments[i][fn](res)) {
							res = moments[i];
						}
					}
					return res;
				}

// TODO: Use [].sort instead?
				function min() {
					var args = [].slice.call(arguments, 0);

					return pickBy('isBefore', args);
				}

				function max() {
					var args = [].slice.call(arguments, 0);

					return pickBy('isAfter', args);
				}

				var now = function () {
					return Date.now ? Date.now() : +(new Date());
				};

				var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

				function isDurationValid(m) {
					for (var key in m) {
						if (!(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
							return false;
						}
					}

					var unitHasDecimal = false;
					for (var i = 0; i < ordering.length; ++i) {
						if (m[ordering[i]]) {
							if (unitHasDecimal) {
								return false; // only allow non-integers for smallest unit
							}
							if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
								unitHasDecimal = true;
							}
						}
					}

					return true;
				}

				function isValid$1() {
					return this._isValid;
				}

				function createInvalid$1() {
					return createDuration(NaN);
				}

				function Duration(duration) {
					var normalizedInput = normalizeObjectUnits(duration),
						years = normalizedInput.year || 0,
						quarters = normalizedInput.quarter || 0,
						months = normalizedInput.month || 0,
						weeks = normalizedInput.week || 0,
						days = normalizedInput.day || 0,
						hours = normalizedInput.hour || 0,
						minutes = normalizedInput.minute || 0,
						seconds = normalizedInput.second || 0,
						milliseconds = normalizedInput.millisecond || 0;

					this._isValid = isDurationValid(normalizedInput);

					// representation for dateAddRemove
					this._milliseconds = +milliseconds +
						seconds * 1e3 + // 1000
						minutes * 6e4 + // 1000 * 60
						hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
					// Because of dateAddRemove treats 24 hours as different from a
					// day when working around DST, we need to store them separately
					this._days = +days +
						weeks * 7;
					// It is impossible to translate months into days without knowing
					// which months you are are talking about, so we have to store
					// it separately.
					this._months = +months +
						quarters * 3 +
						years * 12;

					this._data = {};

					this._locale = getLocale();

					this._bubble();
				}

				function isDuration(obj) {
					return obj instanceof Duration;
				}

				function absRound(number) {
					if (number < 0) {
						return Math.round(-1 * number) * -1;
					} else {
						return Math.round(number);
					}
				}

// FORMATTING

				function offset(token, separator) {
					addFormatToken(token, 0, 0, function () {
						var offset = this.utcOffset();
						var sign = '+';
						if (offset < 0) {
							offset = -offset;
							sign = '-';
						}
						return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
					});
				}

				offset('Z', ':');
				offset('ZZ', '');

// PARSING

				addRegexToken('Z', matchShortOffset);
				addRegexToken('ZZ', matchShortOffset);
				addParseToken(['Z', 'ZZ'], function (input, array, config) {
					config._useUTC = true;
					config._tzm = offsetFromString(matchShortOffset, input);
				});

// HELPERS

// timezone chunker
// '+10:00' > ['10',  '00']
// '-1530'  > ['-15', '30']
				var chunkOffset = /([\+\-]|\d\d)/gi;

				function offsetFromString(matcher, string) {
					var matches = (string || '').match(matcher);

					if (matches === null) {
						return null;
					}

					var chunk = matches[matches.length - 1] || [];
					var parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
					var minutes = +(parts[1] * 60) + toInt(parts[2]);

					return minutes === 0 ?
						0 :
						parts[0] === '+' ? minutes : -minutes;
				}

// Return a moment from input, that is local/utc/zone equivalent to model.
				function cloneWithOffset(input, model) {
					var res, diff;
					if (model._isUTC) {
						res = model.clone();
						diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
						// Use low-level api, because this fn is low-level api.
						res._d.setTime(res._d.valueOf() + diff);
						hooks.updateOffset(res, false);
						return res;
					} else {
						return createLocal(input).local();
					}
				}

				function getDateOffset(m) {
					// On Firefox.24 Date#getTimezoneOffset returns a floating point.
					// https://github.com/moment/moment/pull/1871
					return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
				}

// HOOKS

// This function will be called whenever a moment is mutated.
// It is intended to keep the offset in sync with the timezone.
				hooks.updateOffset = function () {
				};

// MOMENTS

// keepLocalTime = true means only change the timezone, without
// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
// +0200, so we adjust the time as needed, to be valid.
//
// Keeping the time actually adds/subtracts (one hour)
// from the actual represented time. That is why we call updateOffset
// a second time. In case it wants us to change the offset again
// _changeInProgress == true case, then we have to adjust, because
// there is no such time in the given timezone.
				function getSetOffset(input, keepLocalTime, keepMinutes) {
					var offset = this._offset || 0,
						localAdjust;
					if (!this.isValid()) {
						return input != null ? this : NaN;
					}
					if (input != null) {
						if (typeof input === 'string') {
							input = offsetFromString(matchShortOffset, input);
							if (input === null) {
								return this;
							}
						} else if (Math.abs(input) < 16 && !keepMinutes) {
							input = input * 60;
						}
						if (!this._isUTC && keepLocalTime) {
							localAdjust = getDateOffset(this);
						}
						this._offset = input;
						this._isUTC = true;
						if (localAdjust != null) {
							this.add(localAdjust, 'm');
						}
						if (offset !== input) {
							if (!keepLocalTime || this._changeInProgress) {
								addSubtract(this, createDuration(input - offset, 'm'), 1, false);
							} else if (!this._changeInProgress) {
								this._changeInProgress = true;
								hooks.updateOffset(this, true);
								this._changeInProgress = null;
							}
						}
						return this;
					} else {
						return this._isUTC ? offset : getDateOffset(this);
					}
				}

				function getSetZone(input, keepLocalTime) {
					if (input != null) {
						if (typeof input !== 'string') {
							input = -input;
						}

						this.utcOffset(input, keepLocalTime);

						return this;
					} else {
						return -this.utcOffset();
					}
				}

				function setOffsetToUTC(keepLocalTime) {
					return this.utcOffset(0, keepLocalTime);
				}

				function setOffsetToLocal(keepLocalTime) {
					if (this._isUTC) {
						this.utcOffset(0, keepLocalTime);
						this._isUTC = false;

						if (keepLocalTime) {
							this.subtract(getDateOffset(this), 'm');
						}
					}
					return this;
				}

				function setOffsetToParsedOffset() {
					if (this._tzm != null) {
						this.utcOffset(this._tzm, false, true);
					} else if (typeof this._i === 'string') {
						var tZone = offsetFromString(matchOffset, this._i);
						if (tZone != null) {
							this.utcOffset(tZone);
						}
						else {
							this.utcOffset(0, true);
						}
					}
					return this;
				}

				function hasAlignedHourOffset(input) {
					if (!this.isValid()) {
						return false;
					}
					input = input ? createLocal(input).utcOffset() : 0;

					return (this.utcOffset() - input) % 60 === 0;
				}

				function isDaylightSavingTime() {
					return (
						this.utcOffset() > this.clone().month(0).utcOffset() ||
						this.utcOffset() > this.clone().month(5).utcOffset()
					);
				}

				function isDaylightSavingTimeShifted() {
					if (!isUndefined(this._isDSTShifted)) {
						return this._isDSTShifted;
					}

					var c = {};

					copyConfig(c, this);
					c = prepareConfig(c);

					if (c._a) {
						var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
						this._isDSTShifted = this.isValid() &&
							compareArrays(c._a, other.toArray()) > 0;
					} else {
						this._isDSTShifted = false;
					}

					return this._isDSTShifted;
				}

				function isLocal() {
					return this.isValid() ? !this._isUTC : false;
				}

				function isUtcOffset() {
					return this.isValid() ? this._isUTC : false;
				}

				function isUtc() {
					return this.isValid() ? this._isUTC && this._offset === 0 : false;
				}

// ASP.NET json date format regex
				var aspNetRegex = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
// and further modified to allow for strings containing both week and day
				var isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

				function createDuration(input, key) {
					var duration = input,
						// matching against regexp is expensive, do it on demand
						match = null,
						sign,
						ret,
						diffRes;

					if (isDuration(input)) {
						duration = {
							ms: input._milliseconds,
							d: input._days,
							M: input._months
						};
					} else if (isNumber(input)) {
						duration = {};
						if (key) {
							duration[key] = input;
						} else {
							duration.milliseconds = input;
						}
					} else if (!!(match = aspNetRegex.exec(input))) {
						sign = (match[1] === '-') ? -1 : 1;
						duration = {
							y: 0,
							d: toInt(match[DATE]) * sign,
							h: toInt(match[HOUR]) * sign,
							m: toInt(match[MINUTE]) * sign,
							s: toInt(match[SECOND]) * sign,
							ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
						};
					} else if (!!(match = isoRegex.exec(input))) {
						sign = (match[1] === '-') ? -1 : (match[1] === '+') ? 1 : 1;
						duration = {
							y: parseIso(match[2], sign),
							M: parseIso(match[3], sign),
							w: parseIso(match[4], sign),
							d: parseIso(match[5], sign),
							h: parseIso(match[6], sign),
							m: parseIso(match[7], sign),
							s: parseIso(match[8], sign)
						};
					} else if (duration == null) {// checks for null or undefined
						duration = {};
					} else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
						diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

						duration = {};
						duration.ms = diffRes.milliseconds;
						duration.M = diffRes.months;
					}

					ret = new Duration(duration);

					if (isDuration(input) && hasOwnProp(input, '_locale')) {
						ret._locale = input._locale;
					}

					return ret;
				}

				createDuration.fn = Duration.prototype;
				createDuration.invalid = createInvalid$1;

				function parseIso(inp, sign) {
					// We'd normally use ~~inp for this, but unfortunately it also
					// converts floats to ints.
					// inp may be undefined, so careful calling replace on it.
					var res = inp && parseFloat(inp.replace(',', '.'));
					// apply sign while we're at it
					return (isNaN(res) ? 0 : res) * sign;
				}

				function positiveMomentsDifference(base, other) {
					var res = {milliseconds: 0, months: 0};

					res.months = other.month() - base.month() +
						(other.year() - base.year()) * 12;
					if (base.clone().add(res.months, 'M').isAfter(other)) {
						--res.months;
					}

					res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

					return res;
				}

				function momentsDifference(base, other) {
					var res;
					if (!(base.isValid() && other.isValid())) {
						return {milliseconds: 0, months: 0};
					}

					other = cloneWithOffset(other, base);
					if (base.isBefore(other)) {
						res = positiveMomentsDifference(base, other);
					} else {
						res = positiveMomentsDifference(other, base);
						res.milliseconds = -res.milliseconds;
						res.months = -res.months;
					}

					return res;
				}

// TODO: remove 'name' arg after deprecation is removed
				function createAdder(direction, name) {
					return function (val, period) {
						var dur, tmp;
						//invert the arguments, but complain about it
						if (period !== null && !isNaN(+period)) {
							deprecateSimple(name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
								'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
							tmp = val;
							val = period;
							period = tmp;
						}

						val = typeof val === 'string' ? +val : val;
						dur = createDuration(val, period);
						addSubtract(this, dur, direction);
						return this;
					};
				}

				function addSubtract(mom, duration, isAdding, updateOffset) {
					var milliseconds = duration._milliseconds,
						days = absRound(duration._days),
						months = absRound(duration._months);

					if (!mom.isValid()) {
						// No op
						return;
					}

					updateOffset = updateOffset == null ? true : updateOffset;

					if (months) {
						setMonth(mom, get(mom, 'Month') + months * isAdding);
					}
					if (days) {
						set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
					}
					if (milliseconds) {
						mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
					}
					if (updateOffset) {
						hooks.updateOffset(mom, days || months);
					}
				}

				var add = createAdder(1, 'add');
				var subtract = createAdder(-1, 'subtract');

				function getCalendarFormat(myMoment, now) {
					var diff = myMoment.diff(now, 'days', true);
					return diff < -6 ? 'sameElse' :
						diff < -1 ? 'lastWeek' :
							diff < 0 ? 'lastDay' :
								diff < 1 ? 'sameDay' :
									diff < 2 ? 'nextDay' :
										diff < 7 ? 'nextWeek' : 'sameElse';
				}

				function calendar$1(time, formats) {
					// We want to compare the start of today, vs this.
					// Getting start-of-today depends on whether we're local/utc/offset or not.
					var now = time || createLocal(),
						sod = cloneWithOffset(now, this).startOf('day'),
						format = hooks.calendarFormat(this, sod) || 'sameElse';

					var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

					return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
				}

				function clone() {
					return new Moment(this);
				}

				function isAfter(input, units) {
					var localInput = isMoment(input) ? input : createLocal(input);
					if (!(this.isValid() && localInput.isValid())) {
						return false;
					}
					units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
					if (units === 'millisecond') {
						return this.valueOf() > localInput.valueOf();
					} else {
						return localInput.valueOf() < this.clone().startOf(units).valueOf();
					}
				}

				function isBefore(input, units) {
					var localInput = isMoment(input) ? input : createLocal(input);
					if (!(this.isValid() && localInput.isValid())) {
						return false;
					}
					units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
					if (units === 'millisecond') {
						return this.valueOf() < localInput.valueOf();
					} else {
						return this.clone().endOf(units).valueOf() < localInput.valueOf();
					}
				}

				function isBetween(from, to, units, inclusivity) {
					inclusivity = inclusivity || '()';
					return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
						(inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
				}

				function isSame(input, units) {
					var localInput = isMoment(input) ? input : createLocal(input),
						inputMs;
					if (!(this.isValid() && localInput.isValid())) {
						return false;
					}
					units = normalizeUnits(units || 'millisecond');
					if (units === 'millisecond') {
						return this.valueOf() === localInput.valueOf();
					} else {
						inputMs = localInput.valueOf();
						return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
					}
				}

				function isSameOrAfter(input, units) {
					return this.isSame(input, units) || this.isAfter(input, units);
				}

				function isSameOrBefore(input, units) {
					return this.isSame(input, units) || this.isBefore(input, units);
				}

				function diff(input, units, asFloat) {
					var that,
						zoneDelta,
						delta, output;

					if (!this.isValid()) {
						return NaN;
					}

					that = cloneWithOffset(input, this);

					if (!that.isValid()) {
						return NaN;
					}

					zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

					units = normalizeUnits(units);

					switch (units) {
						case 'year':
							output = monthDiff(this, that) / 12;
							break;
						case 'month':
							output = monthDiff(this, that);
							break;
						case 'quarter':
							output = monthDiff(this, that) / 3;
							break;
						case 'second':
							output = (this - that) / 1e3;
							break; // 1000
						case 'minute':
							output = (this - that) / 6e4;
							break; // 1000 * 60
						case 'hour':
							output = (this - that) / 36e5;
							break; // 1000 * 60 * 60
						case 'day':
							output = (this - that - zoneDelta) / 864e5;
							break; // 1000 * 60 * 60 * 24, negate dst
						case 'week':
							output = (this - that - zoneDelta) / 6048e5;
							break; // 1000 * 60 * 60 * 24 * 7, negate dst
						default:
							output = this - that;
					}

					return asFloat ? output : absFloor(output);
				}

				function monthDiff(a, b) {
					// difference in months
					var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
						// b is in (anchor - 1 month, anchor + 1 month)
						anchor = a.clone().add(wholeMonthDiff, 'months'),
						anchor2, adjust;

					if (b - anchor < 0) {
						anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
						// linear across the month
						adjust = (b - anchor) / (anchor - anchor2);
					} else {
						anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
						// linear across the month
						adjust = (b - anchor) / (anchor2 - anchor);
					}

					//check for negative zero, return zero if negative zero
					return -(wholeMonthDiff + adjust) || 0;
				}

				hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
				hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

				function toString() {
					return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
				}

				function toISOString() {
					if (!this.isValid()) {
						return null;
					}
					var m = this.clone().utc();
					if (m.year() < 0 || m.year() > 9999) {
						return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
					}
					if (isFunction(Date.prototype.toISOString)) {
						// native implementation is ~50x faster, use it when we can
						return this.toDate().toISOString();
					}
					return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
				}

				/**
				 * Return a human readable representation of a moment that can
				 * also be evaluated to get a new moment which is the same
				 *
				 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
				 */
				function inspect() {
					if (!this.isValid()) {
						return 'moment.invalid(/* ' + this._i + ' */)';
					}
					var func = 'moment';
					var zone = '';
					if (!this.isLocal()) {
						func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
						zone = 'Z';
					}
					var prefix = '[' + func + '("]';
					var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
					var datetime = '-MM-DD[T]HH:mm:ss.SSS';
					var suffix = zone + '[")]';

					return this.format(prefix + year + datetime + suffix);
				}

				function format(inputString) {
					if (!inputString) {
						inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
					}
					var output = formatMoment(this, inputString);
					return this.localeData().postformat(output);
				}

				function from(time, withoutSuffix) {
					if (this.isValid() &&
						((isMoment(time) && time.isValid()) ||
							createLocal(time).isValid())) {
						return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
					} else {
						return this.localeData().invalidDate();
					}
				}

				function fromNow(withoutSuffix) {
					return this.from(createLocal(), withoutSuffix);
				}

				function to(time, withoutSuffix) {
					if (this.isValid() &&
						((isMoment(time) && time.isValid()) ||
							createLocal(time).isValid())) {
						return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
					} else {
						return this.localeData().invalidDate();
					}
				}

				function toNow(withoutSuffix) {
					return this.to(createLocal(), withoutSuffix);
				}

// If passed a locale key, it will set the locale for this
// instance.  Otherwise, it will return the locale configuration
// variables for this instance.
				function locale(key) {
					var newLocaleData;

					if (key === undefined) {
						return this._locale._abbr;
					} else {
						newLocaleData = getLocale(key);
						if (newLocaleData != null) {
							this._locale = newLocaleData;
						}
						return this;
					}
				}

				var lang = deprecate(
					'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
					function (key) {
						if (key === undefined) {
							return this.localeData();
						} else {
							return this.locale(key);
						}
					}
				);

				function localeData() {
					return this._locale;
				}

				function startOf(units) {
					units = normalizeUnits(units);
					// the following switch intentionally omits break keywords
					// to utilize falling through the cases.
					switch (units) {
						case 'year':
							this.month(0);
						/* falls through */
						case 'quarter':
						case 'month':
							this.date(1);
						/* falls through */
						case 'week':
						case 'isoWeek':
						case 'day':
						case 'date':
							this.hours(0);
						/* falls through */
						case 'hour':
							this.minutes(0);
						/* falls through */
						case 'minute':
							this.seconds(0);
						/* falls through */
						case 'second':
							this.milliseconds(0);
					}

					// weeks are a special case
					if (units === 'week') {
						this.weekday(0);
					}
					if (units === 'isoWeek') {
						this.isoWeekday(1);
					}

					// quarters are also special
					if (units === 'quarter') {
						this.month(Math.floor(this.month() / 3) * 3);
					}

					return this;
				}

				function endOf(units) {
					units = normalizeUnits(units);
					if (units === undefined || units === 'millisecond') {
						return this;
					}

					// 'date' is an alias for 'day', so it should be considered as such.
					if (units === 'date') {
						units = 'day';
					}

					return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
				}

				function valueOf() {
					return this._d.valueOf() - ((this._offset || 0) * 60000);
				}

				function unix() {
					return Math.floor(this.valueOf() / 1000);
				}

				function toDate() {
					return new Date(this.valueOf());
				}

				function toArray() {
					var m = this;
					return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
				}

				function toObject() {
					var m = this;
					return {
						years: m.year(),
						months: m.month(),
						date: m.date(),
						hours: m.hours(),
						minutes: m.minutes(),
						seconds: m.seconds(),
						milliseconds: m.milliseconds()
					};
				}

				function toJSON() {
					// new Date(NaN).toJSON() === null
					return this.isValid() ? this.toISOString() : null;
				}

				function isValid$2() {
					return isValid(this);
				}

				function parsingFlags() {
					return extend({}, getParsingFlags(this));
				}

				function invalidAt() {
					return getParsingFlags(this).overflow;
				}

				function creationData() {
					return {
						input: this._i,
						format: this._f,
						locale: this._locale,
						isUTC: this._isUTC,
						strict: this._strict
					};
				}

// FORMATTING

				addFormatToken(0, ['gg', 2], 0, function () {
					return this.weekYear() % 100;
				});

				addFormatToken(0, ['GG', 2], 0, function () {
					return this.isoWeekYear() % 100;
				});

				function addWeekYearFormatToken(token, getter) {
					addFormatToken(0, [token, token.length], 0, getter);
				}

				addWeekYearFormatToken('gggg', 'weekYear');
				addWeekYearFormatToken('ggggg', 'weekYear');
				addWeekYearFormatToken('GGGG', 'isoWeekYear');
				addWeekYearFormatToken('GGGGG', 'isoWeekYear');

// ALIASES

				addUnitAlias('weekYear', 'gg');
				addUnitAlias('isoWeekYear', 'GG');

// PRIORITY

				addUnitPriority('weekYear', 1);
				addUnitPriority('isoWeekYear', 1);


// PARSING

				addRegexToken('G', matchSigned);
				addRegexToken('g', matchSigned);
				addRegexToken('GG', match1to2, match2);
				addRegexToken('gg', match1to2, match2);
				addRegexToken('GGGG', match1to4, match4);
				addRegexToken('gggg', match1to4, match4);
				addRegexToken('GGGGG', match1to6, match6);
				addRegexToken('ggggg', match1to6, match6);

				addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
					week[token.substr(0, 2)] = toInt(input);
				});

				addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
					week[token] = hooks.parseTwoDigitYear(input);
				});

// MOMENTS

				function getSetWeekYear(input) {
					return getSetWeekYearHelper.call(this,
						input,
						this.week(),
						this.weekday(),
						this.localeData()._week.dow,
						this.localeData()._week.doy);
				}

				function getSetISOWeekYear(input) {
					return getSetWeekYearHelper.call(this,
						input, this.isoWeek(), this.isoWeekday(), 1, 4);
				}

				function getISOWeeksInYear() {
					return weeksInYear(this.year(), 1, 4);
				}

				function getWeeksInYear() {
					var weekInfo = this.localeData()._week;
					return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
				}

				function getSetWeekYearHelper(input, week, weekday, dow, doy) {
					var weeksTarget;
					if (input == null) {
						return weekOfYear(this, dow, doy).year;
					} else {
						weeksTarget = weeksInYear(input, dow, doy);
						if (week > weeksTarget) {
							week = weeksTarget;
						}
						return setWeekAll.call(this, input, week, weekday, dow, doy);
					}
				}

				function setWeekAll(weekYear, week, weekday, dow, doy) {
					var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
						date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

					this.year(date.getUTCFullYear());
					this.month(date.getUTCMonth());
					this.date(date.getUTCDate());
					return this;
				}

// FORMATTING

				addFormatToken('Q', 0, 'Qo', 'quarter');

// ALIASES

				addUnitAlias('quarter', 'Q');

// PRIORITY

				addUnitPriority('quarter', 7);

// PARSING

				addRegexToken('Q', match1);
				addParseToken('Q', function (input, array) {
					array[MONTH] = (toInt(input) - 1) * 3;
				});

// MOMENTS

				function getSetQuarter(input) {
					return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
				}

// FORMATTING

				addFormatToken('D', ['DD', 2], 'Do', 'date');

// ALIASES

				addUnitAlias('date', 'D');

// PRIOROITY
				addUnitPriority('date', 9);

// PARSING

				addRegexToken('D', match1to2);
				addRegexToken('DD', match1to2, match2);
				addRegexToken('Do', function (isStrict, locale) {
					// TODO: Remove "ordinalParse" fallback in next major release.
					return isStrict ?
						(locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
						locale._dayOfMonthOrdinalParseLenient;
				});

				addParseToken(['D', 'DD'], DATE);
				addParseToken('Do', function (input, array) {
					array[DATE] = toInt(input.match(match1to2)[0], 10);
				});

// MOMENTS

				var getSetDayOfMonth = makeGetSet('Date', true);

// FORMATTING

				addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

// ALIASES

				addUnitAlias('dayOfYear', 'DDD');

// PRIORITY
				addUnitPriority('dayOfYear', 4);

// PARSING

				addRegexToken('DDD', match1to3);
				addRegexToken('DDDD', match3);
				addParseToken(['DDD', 'DDDD'], function (input, array, config) {
					config._dayOfYear = toInt(input);
				});

// HELPERS

// MOMENTS

				function getSetDayOfYear(input) {
					var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
					return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
				}

// FORMATTING

				addFormatToken('m', ['mm', 2], 0, 'minute');

// ALIASES

				addUnitAlias('minute', 'm');

// PRIORITY

				addUnitPriority('minute', 14);

// PARSING

				addRegexToken('m', match1to2);
				addRegexToken('mm', match1to2, match2);
				addParseToken(['m', 'mm'], MINUTE);

// MOMENTS

				var getSetMinute = makeGetSet('Minutes', false);

// FORMATTING

				addFormatToken('s', ['ss', 2], 0, 'second');

// ALIASES

				addUnitAlias('second', 's');

// PRIORITY

				addUnitPriority('second', 15);

// PARSING

				addRegexToken('s', match1to2);
				addRegexToken('ss', match1to2, match2);
				addParseToken(['s', 'ss'], SECOND);

// MOMENTS

				var getSetSecond = makeGetSet('Seconds', false);

// FORMATTING

				addFormatToken('S', 0, 0, function () {
					return ~~(this.millisecond() / 100);
				});

				addFormatToken(0, ['SS', 2], 0, function () {
					return ~~(this.millisecond() / 10);
				});

				addFormatToken(0, ['SSS', 3], 0, 'millisecond');
				addFormatToken(0, ['SSSS', 4], 0, function () {
					return this.millisecond() * 10;
				});
				addFormatToken(0, ['SSSSS', 5], 0, function () {
					return this.millisecond() * 100;
				});
				addFormatToken(0, ['SSSSSS', 6], 0, function () {
					return this.millisecond() * 1000;
				});
				addFormatToken(0, ['SSSSSSS', 7], 0, function () {
					return this.millisecond() * 10000;
				});
				addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
					return this.millisecond() * 100000;
				});
				addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
					return this.millisecond() * 1000000;
				});


// ALIASES

				addUnitAlias('millisecond', 'ms');

// PRIORITY

				addUnitPriority('millisecond', 16);

// PARSING

				addRegexToken('S', match1to3, match1);
				addRegexToken('SS', match1to3, match2);
				addRegexToken('SSS', match1to3, match3);

				var token;
				for (token = 'SSSS'; token.length <= 9; token += 'S') {
					addRegexToken(token, matchUnsigned);
				}

				function parseMs(input, array) {
					array[MILLISECOND] = toInt(('0.' + input) * 1000);
				}

				for (token = 'S'; token.length <= 9; token += 'S') {
					addParseToken(token, parseMs);
				}
// MOMENTS

				var getSetMillisecond = makeGetSet('Milliseconds', false);

// FORMATTING

				addFormatToken('z', 0, 0, 'zoneAbbr');
				addFormatToken('zz', 0, 0, 'zoneName');

// MOMENTS

				function getZoneAbbr() {
					return this._isUTC ? 'UTC' : '';
				}

				function getZoneName() {
					return this._isUTC ? 'Coordinated Universal Time' : '';
				}

				var proto = Moment.prototype;

				proto.add = add;
				proto.calendar = calendar$1;
				proto.clone = clone;
				proto.diff = diff;
				proto.endOf = endOf;
				proto.format = format;
				proto.from = from;
				proto.fromNow = fromNow;
				proto.to = to;
				proto.toNow = toNow;
				proto.get = stringGet;
				proto.invalidAt = invalidAt;
				proto.isAfter = isAfter;
				proto.isBefore = isBefore;
				proto.isBetween = isBetween;
				proto.isSame = isSame;
				proto.isSameOrAfter = isSameOrAfter;
				proto.isSameOrBefore = isSameOrBefore;
				proto.isValid = isValid$2;
				proto.lang = lang;
				proto.locale = locale;
				proto.localeData = localeData;
				proto.max = prototypeMax;
				proto.min = prototypeMin;
				proto.parsingFlags = parsingFlags;
				proto.set = stringSet;
				proto.startOf = startOf;
				proto.subtract = subtract;
				proto.toArray = toArray;
				proto.toObject = toObject;
				proto.toDate = toDate;
				proto.toISOString = toISOString;
				proto.inspect = inspect;
				proto.toJSON = toJSON;
				proto.toString = toString;
				proto.unix = unix;
				proto.valueOf = valueOf;
				proto.creationData = creationData;

// Year
				proto.year = getSetYear;
				proto.isLeapYear = getIsLeapYear;

// Week Year
				proto.weekYear = getSetWeekYear;
				proto.isoWeekYear = getSetISOWeekYear;

// Quarter
				proto.quarter = proto.quarters = getSetQuarter;

// Month
				proto.month = getSetMonth;
				proto.daysInMonth = getDaysInMonth;

// Week
				proto.week = proto.weeks = getSetWeek;
				proto.isoWeek = proto.isoWeeks = getSetISOWeek;
				proto.weeksInYear = getWeeksInYear;
				proto.isoWeeksInYear = getISOWeeksInYear;

// Day
				proto.date = getSetDayOfMonth;
				proto.day = proto.days = getSetDayOfWeek;
				proto.weekday = getSetLocaleDayOfWeek;
				proto.isoWeekday = getSetISODayOfWeek;
				proto.dayOfYear = getSetDayOfYear;

// Hour
				proto.hour = proto.hours = getSetHour;

// Minute
				proto.minute = proto.minutes = getSetMinute;

// Second
				proto.second = proto.seconds = getSetSecond;

// Millisecond
				proto.millisecond = proto.milliseconds = getSetMillisecond;

// Offset
				proto.utcOffset = getSetOffset;
				proto.utc = setOffsetToUTC;
				proto.local = setOffsetToLocal;
				proto.parseZone = setOffsetToParsedOffset;
				proto.hasAlignedHourOffset = hasAlignedHourOffset;
				proto.isDST = isDaylightSavingTime;
				proto.isLocal = isLocal;
				proto.isUtcOffset = isUtcOffset;
				proto.isUtc = isUtc;
				proto.isUTC = isUtc;

// Timezone
				proto.zoneAbbr = getZoneAbbr;
				proto.zoneName = getZoneName;

// Deprecations
				proto.dates = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
				proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
				proto.years = deprecate('years accessor is deprecated. Use year instead', getSetYear);
				proto.zone = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
				proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

				function createUnix(input) {
					return createLocal(input * 1000);
				}

				function createInZone() {
					return createLocal.apply(null, arguments).parseZone();
				}

				function preParsePostFormat(string) {
					return string;
				}

				var proto$1 = Locale.prototype;

				proto$1.calendar = calendar;
				proto$1.longDateFormat = longDateFormat;
				proto$1.invalidDate = invalidDate;
				proto$1.ordinal = ordinal;
				proto$1.preparse = preParsePostFormat;
				proto$1.postformat = preParsePostFormat;
				proto$1.relativeTime = relativeTime;
				proto$1.pastFuture = pastFuture;
				proto$1.set = set;

// Month
				proto$1.months = localeMonths;
				proto$1.monthsShort = localeMonthsShort;
				proto$1.monthsParse = localeMonthsParse;
				proto$1.monthsRegex = monthsRegex;
				proto$1.monthsShortRegex = monthsShortRegex;

// Week
				proto$1.week = localeWeek;
				proto$1.firstDayOfYear = localeFirstDayOfYear;
				proto$1.firstDayOfWeek = localeFirstDayOfWeek;

// Day of Week
				proto$1.weekdays = localeWeekdays;
				proto$1.weekdaysMin = localeWeekdaysMin;
				proto$1.weekdaysShort = localeWeekdaysShort;
				proto$1.weekdaysParse = localeWeekdaysParse;

				proto$1.weekdaysRegex = weekdaysRegex;
				proto$1.weekdaysShortRegex = weekdaysShortRegex;
				proto$1.weekdaysMinRegex = weekdaysMinRegex;

// Hours
				proto$1.isPM = localeIsPM;
				proto$1.meridiem = localeMeridiem;

				function get$1(format, index, field, setter) {
					var locale = getLocale();
					var utc = createUTC().set(setter, index);
					return locale[field](utc, format);
				}

				function listMonthsImpl(format, index, field) {
					if (isNumber(format)) {
						index = format;
						format = undefined;
					}

					format = format || '';

					if (index != null) {
						return get$1(format, index, field, 'month');
					}

					var i;
					var out = [];
					for (i = 0; i < 12; i++) {
						out[i] = get$1(format, i, field, 'month');
					}
					return out;
				}

// ()
// (5)
// (fmt, 5)
// (fmt)
// (true)
// (true, 5)
// (true, fmt, 5)
// (true, fmt)
				function listWeekdaysImpl(localeSorted, format, index, field) {
					if (typeof localeSorted === 'boolean') {
						if (isNumber(format)) {
							index = format;
							format = undefined;
						}

						format = format || '';
					} else {
						format = localeSorted;
						index = format;
						localeSorted = false;

						if (isNumber(format)) {
							index = format;
							format = undefined;
						}

						format = format || '';
					}

					var locale = getLocale(),
						shift = localeSorted ? locale._week.dow : 0;

					if (index != null) {
						return get$1(format, (index + shift) % 7, field, 'day');
					}

					var i;
					var out = [];
					for (i = 0; i < 7; i++) {
						out[i] = get$1(format, (i + shift) % 7, field, 'day');
					}
					return out;
				}

				function listMonths(format, index) {
					return listMonthsImpl(format, index, 'months');
				}

				function listMonthsShort(format, index) {
					return listMonthsImpl(format, index, 'monthsShort');
				}

				function listWeekdays(localeSorted, format, index) {
					return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
				}

				function listWeekdaysShort(localeSorted, format, index) {
					return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
				}

				function listWeekdaysMin(localeSorted, format, index) {
					return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
				}

				getSetGlobalLocale('en', {
					dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
					ordinal: function (number) {
						var b = number % 10,
							output = (toInt(number % 100 / 10) === 1) ? 'th' :
								(b === 1) ? 'st' :
									(b === 2) ? 'nd' :
										(b === 3) ? 'rd' : 'th';
						return number + output;
					}
				});

// Side effect imports
				hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
				hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

				var mathAbs = Math.abs;

				function abs() {
					var data = this._data;

					this._milliseconds = mathAbs(this._milliseconds);
					this._days = mathAbs(this._days);
					this._months = mathAbs(this._months);

					data.milliseconds = mathAbs(data.milliseconds);
					data.seconds = mathAbs(data.seconds);
					data.minutes = mathAbs(data.minutes);
					data.hours = mathAbs(data.hours);
					data.months = mathAbs(data.months);
					data.years = mathAbs(data.years);

					return this;
				}

				function addSubtract$1(duration, input, value, direction) {
					var other = createDuration(input, value);

					duration._milliseconds += direction * other._milliseconds;
					duration._days += direction * other._days;
					duration._months += direction * other._months;

					return duration._bubble();
				}

// supports only 2.0-style add(1, 's') or add(duration)
				function add$1(input, value) {
					return addSubtract$1(this, input, value, 1);
				}

// supports only 2.0-style subtract(1, 's') or subtract(duration)
				function subtract$1(input, value) {
					return addSubtract$1(this, input, value, -1);
				}

				function absCeil(number) {
					if (number < 0) {
						return Math.floor(number);
					} else {
						return Math.ceil(number);
					}
				}

				function bubble() {
					var milliseconds = this._milliseconds;
					var days = this._days;
					var months = this._months;
					var data = this._data;
					var seconds, minutes, hours, years, monthsFromDays;

					// if we have a mix of positive and negative values, bubble down first
					// check: https://github.com/moment/moment/issues/2166
					if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
							(milliseconds <= 0 && days <= 0 && months <= 0))) {
						milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
						days = 0;
						months = 0;
					}

					// The following code bubbles up values, see the tests for
					// examples of what that means.
					data.milliseconds = milliseconds % 1000;

					seconds = absFloor(milliseconds / 1000);
					data.seconds = seconds % 60;

					minutes = absFloor(seconds / 60);
					data.minutes = minutes % 60;

					hours = absFloor(minutes / 60);
					data.hours = hours % 24;

					days += absFloor(hours / 24);

					// convert days to months
					monthsFromDays = absFloor(daysToMonths(days));
					months += monthsFromDays;
					days -= absCeil(monthsToDays(monthsFromDays));

					// 12 months -> 1 year
					years = absFloor(months / 12);
					months %= 12;

					data.days = days;
					data.months = months;
					data.years = years;

					return this;
				}

				function daysToMonths(days) {
					// 400 years have 146097 days (taking into account leap year rules)
					// 400 years have 12 months === 4800
					return days * 4800 / 146097;
				}

				function monthsToDays(months) {
					// the reverse of daysToMonths
					return months * 146097 / 4800;
				}

				function as(units) {
					if (!this.isValid()) {
						return NaN;
					}
					var days;
					var months;
					var milliseconds = this._milliseconds;

					units = normalizeUnits(units);

					if (units === 'month' || units === 'year') {
						days = this._days + milliseconds / 864e5;
						months = this._months + daysToMonths(days);
						return units === 'month' ? months : months / 12;
					} else {
						// handle milliseconds separately because of floating point math errors (issue #1867)
						days = this._days + Math.round(monthsToDays(this._months));
						switch (units) {
							case 'week'   :
								return days / 7 + milliseconds / 6048e5;
							case 'day'    :
								return days + milliseconds / 864e5;
							case 'hour'   :
								return days * 24 + milliseconds / 36e5;
							case 'minute' :
								return days * 1440 + milliseconds / 6e4;
							case 'second' :
								return days * 86400 + milliseconds / 1000;
							// Math.floor prevents floating point math errors here
							case 'millisecond':
								return Math.floor(days * 864e5) + milliseconds;
							default:
								throw new Error('Unknown unit ' + units);
						}
					}
				}

// TODO: Use this.as('ms')?
				function valueOf$1() {
					if (!this.isValid()) {
						return NaN;
					}
					return (
						this._milliseconds +
						this._days * 864e5 +
						(this._months % 12) * 2592e6 +
						toInt(this._months / 12) * 31536e6
					);
				}

				function makeAs(alias) {
					return function () {
						return this.as(alias);
					};
				}

				var asMilliseconds = makeAs('ms');
				var asSeconds = makeAs('s');
				var asMinutes = makeAs('m');
				var asHours = makeAs('h');
				var asDays = makeAs('d');
				var asWeeks = makeAs('w');
				var asMonths = makeAs('M');
				var asYears = makeAs('y');

				function clone$1() {
					return createDuration(this);
				}

				function get$2(units) {
					units = normalizeUnits(units);
					return this.isValid() ? this[units + 's']() : NaN;
				}

				function makeGetter(name) {
					return function () {
						return this.isValid() ? this._data[name] : NaN;
					};
				}

				var milliseconds = makeGetter('milliseconds');
				var seconds = makeGetter('seconds');
				var minutes = makeGetter('minutes');
				var hours = makeGetter('hours');
				var days = makeGetter('days');
				var months = makeGetter('months');
				var years = makeGetter('years');

				function weeks() {
					return absFloor(this.days() / 7);
				}

				var round = Math.round;
				var thresholds = {
					ss: 44,         // a few seconds to seconds
					s: 45,         // seconds to minute
					m: 45,         // minutes to hour
					h: 22,         // hours to day
					d: 26,         // days to month
					M: 11          // months to year
				};

// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
				function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
					return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
				}

				function relativeTime$1(posNegDuration, withoutSuffix, locale) {
					var duration = createDuration(posNegDuration).abs();
					var seconds = round(duration.as('s'));
					var minutes = round(duration.as('m'));
					var hours = round(duration.as('h'));
					var days = round(duration.as('d'));
					var months = round(duration.as('M'));
					var years = round(duration.as('y'));

					var a = seconds <= thresholds.ss && ['s', seconds] ||
						seconds < thresholds.s && ['ss', seconds] ||
						minutes <= 1 && ['m'] ||
						minutes < thresholds.m && ['mm', minutes] ||
						hours <= 1 && ['h'] ||
						hours < thresholds.h && ['hh', hours] ||
						days <= 1 && ['d'] ||
						days < thresholds.d && ['dd', days] ||
						months <= 1 && ['M'] ||
						months < thresholds.M && ['MM', months] ||
						years <= 1 && ['y'] || ['yy', years];

					a[2] = withoutSuffix;
					a[3] = +posNegDuration > 0;
					a[4] = locale;
					return substituteTimeAgo.apply(null, a);
				}

// This function allows you to set the rounding function for relative time strings
				function getSetRelativeTimeRounding(roundingFunction) {
					if (roundingFunction === undefined) {
						return round;
					}
					if (typeof(roundingFunction) === 'function') {
						round = roundingFunction;
						return true;
					}
					return false;
				}

// This function allows you to set a threshold for relative time strings
				function getSetRelativeTimeThreshold(threshold, limit) {
					if (thresholds[threshold] === undefined) {
						return false;
					}
					if (limit === undefined) {
						return thresholds[threshold];
					}
					thresholds[threshold] = limit;
					if (threshold === 's') {
						thresholds.ss = limit - 1;
					}
					return true;
				}

				function humanize(withSuffix) {
					if (!this.isValid()) {
						return this.localeData().invalidDate();
					}

					var locale = this.localeData();
					var output = relativeTime$1(this, !withSuffix, locale);

					if (withSuffix) {
						output = locale.pastFuture(+this, output);
					}

					return locale.postformat(output);
				}

				var abs$1 = Math.abs;

				function sign(x) {
					return ((x > 0) - (x < 0)) || +x;
				}

				function toISOString$1() {
					// for ISO strings we do not use the normal bubbling rules:
					//  * milliseconds bubble up until they become hours
					//  * days do not bubble at all
					//  * months bubble up until they become years
					// This is because there is no context-free conversion between hours and days
					// (think of clock changes)
					// and also not between days and months (28-31 days per month)
					if (!this.isValid()) {
						return this.localeData().invalidDate();
					}

					var seconds = abs$1(this._milliseconds) / 1000;
					var days = abs$1(this._days);
					var months = abs$1(this._months);
					var minutes, hours, years;

					// 3600 seconds -> 60 minutes -> 1 hour
					minutes = absFloor(seconds / 60);
					hours = absFloor(minutes / 60);
					seconds %= 60;
					minutes %= 60;

					// 12 months -> 1 year
					years = absFloor(months / 12);
					months %= 12;


					// inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
					var Y = years;
					var M = months;
					var D = days;
					var h = hours;
					var m = minutes;
					var s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
					var total = this.asSeconds();

					if (!total) {
						// this is the same as C#'s (Noda) and python (isodate)...
						// but not other JS (goog.date)
						return 'P0D';
					}

					var totalSign = total < 0 ? '-' : '';
					var ymSign = sign(this._months) !== sign(total) ? '-' : '';
					var daysSign = sign(this._days) !== sign(total) ? '-' : '';
					var hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

					return totalSign + 'P' +
						(Y ? ymSign + Y + 'Y' : '') +
						(M ? ymSign + M + 'M' : '') +
						(D ? daysSign + D + 'D' : '') +
						((h || m || s) ? 'T' : '') +
						(h ? hmsSign + h + 'H' : '') +
						(m ? hmsSign + m + 'M' : '') +
						(s ? hmsSign + s + 'S' : '');
				}

				var proto$2 = Duration.prototype;

				proto$2.isValid = isValid$1;
				proto$2.abs = abs;
				proto$2.add = add$1;
				proto$2.subtract = subtract$1;
				proto$2.as = as;
				proto$2.asMilliseconds = asMilliseconds;
				proto$2.asSeconds = asSeconds;
				proto$2.asMinutes = asMinutes;
				proto$2.asHours = asHours;
				proto$2.asDays = asDays;
				proto$2.asWeeks = asWeeks;
				proto$2.asMonths = asMonths;
				proto$2.asYears = asYears;
				proto$2.valueOf = valueOf$1;
				proto$2._bubble = bubble;
				proto$2.clone = clone$1;
				proto$2.get = get$2;
				proto$2.milliseconds = milliseconds;
				proto$2.seconds = seconds;
				proto$2.minutes = minutes;
				proto$2.hours = hours;
				proto$2.days = days;
				proto$2.weeks = weeks;
				proto$2.months = months;
				proto$2.years = years;
				proto$2.humanize = humanize;
				proto$2.toISOString = toISOString$1;
				proto$2.toString = toISOString$1;
				proto$2.toJSON = toISOString$1;
				proto$2.locale = locale;
				proto$2.localeData = localeData;

// Deprecations
				proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
				proto$2.lang = lang;

// Side effect imports

// FORMATTING

				addFormatToken('X', 0, 0, 'unix');
				addFormatToken('x', 0, 0, 'valueOf');

// PARSING

				addRegexToken('x', matchSigned);
				addRegexToken('X', matchTimestamp);
				addParseToken('X', function (input, array, config) {
					config._d = new Date(parseFloat(input, 10) * 1000);
				});
				addParseToken('x', function (input, array, config) {
					config._d = new Date(toInt(input));
				});

// Side effect imports


				hooks.version = '2.19.2';

				setHookCallback(createLocal);

				hooks.fn = proto;
				hooks.min = min;
				hooks.max = max;
				hooks.now = now;
				hooks.utc = createUTC;
				hooks.unix = createUnix;
				hooks.months = listMonths;
				hooks.isDate = isDate;
				hooks.locale = getSetGlobalLocale;
				hooks.invalid = createInvalid;
				hooks.duration = createDuration;
				hooks.isMoment = isMoment;
				hooks.weekdays = listWeekdays;
				hooks.parseZone = createInZone;
				hooks.localeData = getLocale;
				hooks.isDuration = isDuration;
				hooks.monthsShort = listMonthsShort;
				hooks.weekdaysMin = listWeekdaysMin;
				hooks.defineLocale = defineLocale;
				hooks.updateLocale = updateLocale;
				hooks.locales = listLocales;
				hooks.weekdaysShort = listWeekdaysShort;
				hooks.normalizeUnits = normalizeUnits;
				hooks.relativeTimeRounding = getSetRelativeTimeRounding;
				hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
				hooks.calendarFormat = getCalendarFormat;
				hooks.prototype = proto;

				return hooks;

			})));

			/* WEBPACK VAR INJECTION */
		}.call(exports, __webpack_require__(124)(module)))

		/***/
	}),
	/* 1 */,
	/* 2 */,
	/* 3 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Afrikaans [af]
//! author : Werner Mollentze : https://github.com/wernerm

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var af = moment.defineLocale('af', {
				months: 'Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember'.split('_'),
				monthsShort: 'Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des'.split('_'),
				weekdays: 'Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag'.split('_'),
				weekdaysShort: 'Son_Maa_Din_Woe_Don_Vry_Sat'.split('_'),
				weekdaysMin: 'So_Ma_Di_Wo_Do_Vr_Sa'.split('_'),
				meridiemParse: /vm|nm/i,
				isPM: function (input) {
					return /^nm$/i.test(input);
				},
				meridiem: function (hours, minutes, isLower) {
					if (hours < 12) {
						return isLower ? 'vm' : 'VM';
					} else {
						return isLower ? 'nm' : 'NM';
					}
				},
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd, D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[Vandag om] LT',
					nextDay: '[Môre om] LT',
					nextWeek: 'dddd [om] LT',
					lastDay: '[Gister om] LT',
					lastWeek: '[Laas] dddd [om] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'oor %s',
					past: '%s gelede',
					s: '\'n paar sekondes',
					m: '\'n minuut',
					mm: '%d minute',
					h: '\'n uur',
					hh: '%d ure',
					d: '\'n dag',
					dd: '%d dae',
					M: '\'n maand',
					MM: '%d maande',
					y: '\'n jaar',
					yy: '%d jaar'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
				ordinal: function (number) {
					return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de'); // Thanks to Joris Röling : https://github.com/jjupiter
				},
				week: {
					dow: 1, // Maandag is die eerste dag van die week.
					doy: 4  // Die week wat die 4de Januarie bevat is die eerste week van die jaar.
				}
			});

			return af;

		})));


		/***/
	}),
	/* 4 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Arabic [ar]
//! author : Abdel Said: https://github.com/abdelsaid
//! author : Ahmed Elkhatib
//! author : forabi https://github.com/forabi

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var symbolMap = {
				'1': '١',
				'2': '٢',
				'3': '٣',
				'4': '٤',
				'5': '٥',
				'6': '٦',
				'7': '٧',
				'8': '٨',
				'9': '٩',
				'0': '٠'
			};
			var numberMap = {
				'١': '1',
				'٢': '2',
				'٣': '3',
				'٤': '4',
				'٥': '5',
				'٦': '6',
				'٧': '7',
				'٨': '8',
				'٩': '9',
				'٠': '0'
			};
			var pluralForm = function (n) {
				return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
			};
			var plurals = {
				s: ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
				m: ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
				h: ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
				d: ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
				M: ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
				y: ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام']
			};
			var pluralize = function (u) {
				return function (number, withoutSuffix, string, isFuture) {
					var f = pluralForm(number),
						str = plurals[u][pluralForm(number)];
					if (f === 2) {
						str = str[withoutSuffix ? 0 : 1];
					}
					return str.replace(/%d/i, number);
				};
			};
			var months = [
				'كانون الثاني يناير',
				'شباط فبراير',
				'آذار مارس',
				'نيسان أبريل',
				'أيار مايو',
				'حزيران يونيو',
				'تموز يوليو',
				'آب أغسطس',
				'أيلول سبتمبر',
				'تشرين الأول أكتوبر',
				'تشرين الثاني نوفمبر',
				'كانون الأول ديسمبر'
			];

			var ar = moment.defineLocale('ar', {
				months: months,
				monthsShort: months,
				weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
				weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
				weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'D/\u200FM/\u200FYYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D MMMM YYYY HH:mm'
				},
				meridiemParse: /ص|م/,
				isPM: function (input) {
					return 'م' === input;
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 12) {
						return 'ص';
					} else {
						return 'م';
					}
				},
				calendar: {
					sameDay: '[اليوم عند الساعة] LT',
					nextDay: '[غدًا عند الساعة] LT',
					nextWeek: 'dddd [عند الساعة] LT',
					lastDay: '[أمس عند الساعة] LT',
					lastWeek: 'dddd [عند الساعة] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'بعد %s',
					past: 'منذ %s',
					s: pluralize('s'),
					m: pluralize('m'),
					mm: pluralize('m'),
					h: pluralize('h'),
					hh: pluralize('h'),
					d: pluralize('d'),
					dd: pluralize('d'),
					M: pluralize('M'),
					MM: pluralize('M'),
					y: pluralize('y'),
					yy: pluralize('y')
				},
				preparse: function (string) {
					return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
						return numberMap[match];
					}).replace(/،/g, ',');
				},
				postformat: function (string) {
					return string.replace(/\d/g, function (match) {
						return symbolMap[match];
					}).replace(/,/g, '،');
				},
				week: {
					dow: 6, // Saturday is the first day of the week.
					doy: 12  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return ar;

		})));


		/***/
	}),
	/* 5 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Arabic (Algeria) [ar-dz]
//! author : Noureddine LOUAHEDJ : https://github.com/noureddineme

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var arDz = moment.defineLocale('ar-dz', {
				months: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
				monthsShort: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
				weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
				weekdaysShort: 'احد_اثنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
				weekdaysMin: 'أح_إث_ثلا_أر_خم_جم_سب'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[اليوم على الساعة] LT',
					nextDay: '[غدا على الساعة] LT',
					nextWeek: 'dddd [على الساعة] LT',
					lastDay: '[أمس على الساعة] LT',
					lastWeek: 'dddd [على الساعة] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'في %s',
					past: 'منذ %s',
					s: 'ثوان',
					m: 'دقيقة',
					mm: '%d دقائق',
					h: 'ساعة',
					hh: '%d ساعات',
					d: 'يوم',
					dd: '%d أيام',
					M: 'شهر',
					MM: '%d أشهر',
					y: 'سنة',
					yy: '%d سنوات'
				},
				week: {
					dow: 0, // Sunday is the first day of the week.
					doy: 4  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return arDz;

		})));


		/***/
	}),
	/* 6 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Arabic (Kuwait) [ar-kw]
//! author : Nusret Parlak: https://github.com/nusretparlak

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var arKw = moment.defineLocale('ar-kw', {
				months: 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
				monthsShort: 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
				weekdays: 'الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
				weekdaysShort: 'احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
				weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[اليوم على الساعة] LT',
					nextDay: '[غدا على الساعة] LT',
					nextWeek: 'dddd [على الساعة] LT',
					lastDay: '[أمس على الساعة] LT',
					lastWeek: 'dddd [على الساعة] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'في %s',
					past: 'منذ %s',
					s: 'ثوان',
					m: 'دقيقة',
					mm: '%d دقائق',
					h: 'ساعة',
					hh: '%d ساعات',
					d: 'يوم',
					dd: '%d أيام',
					M: 'شهر',
					MM: '%d أشهر',
					y: 'سنة',
					yy: '%d سنوات'
				},
				week: {
					dow: 0, // Sunday is the first day of the week.
					doy: 12  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return arKw;

		})));


		/***/
	}),
	/* 7 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Arabic (Lybia) [ar-ly]
//! author : Ali Hmer: https://github.com/kikoanis

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var symbolMap = {
				'1': '1',
				'2': '2',
				'3': '3',
				'4': '4',
				'5': '5',
				'6': '6',
				'7': '7',
				'8': '8',
				'9': '9',
				'0': '0'
			};
			var pluralForm = function (n) {
				return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
			};
			var plurals = {
				s: ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
				m: ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
				h: ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
				d: ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
				M: ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
				y: ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام']
			};
			var pluralize = function (u) {
				return function (number, withoutSuffix, string, isFuture) {
					var f = pluralForm(number),
						str = plurals[u][pluralForm(number)];
					if (f === 2) {
						str = str[withoutSuffix ? 0 : 1];
					}
					return str.replace(/%d/i, number);
				};
			};
			var months = [
				'يناير',
				'فبراير',
				'مارس',
				'أبريل',
				'مايو',
				'يونيو',
				'يوليو',
				'أغسطس',
				'سبتمبر',
				'أكتوبر',
				'نوفمبر',
				'ديسمبر'
			];

			var arLy = moment.defineLocale('ar-ly', {
				months: months,
				monthsShort: months,
				weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
				weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
				weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'D/\u200FM/\u200FYYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D MMMM YYYY HH:mm'
				},
				meridiemParse: /ص|م/,
				isPM: function (input) {
					return 'م' === input;
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 12) {
						return 'ص';
					} else {
						return 'م';
					}
				},
				calendar: {
					sameDay: '[اليوم عند الساعة] LT',
					nextDay: '[غدًا عند الساعة] LT',
					nextWeek: 'dddd [عند الساعة] LT',
					lastDay: '[أمس عند الساعة] LT',
					lastWeek: 'dddd [عند الساعة] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'بعد %s',
					past: 'منذ %s',
					s: pluralize('s'),
					m: pluralize('m'),
					mm: pluralize('m'),
					h: pluralize('h'),
					hh: pluralize('h'),
					d: pluralize('d'),
					dd: pluralize('d'),
					M: pluralize('M'),
					MM: pluralize('M'),
					y: pluralize('y'),
					yy: pluralize('y')
				},
				preparse: function (string) {
					return string.replace(/،/g, ',');
				},
				postformat: function (string) {
					return string.replace(/\d/g, function (match) {
						return symbolMap[match];
					}).replace(/,/g, '،');
				},
				week: {
					dow: 6, // Saturday is the first day of the week.
					doy: 12  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return arLy;

		})));


		/***/
	}),
	/* 8 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Arabic (Morocco) [ar-ma]
//! author : ElFadili Yassine : https://github.com/ElFadiliY
//! author : Abdel Said : https://github.com/abdelsaid

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var arMa = moment.defineLocale('ar-ma', {
				months: 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
				monthsShort: 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
				weekdays: 'الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
				weekdaysShort: 'احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
				weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[اليوم على الساعة] LT',
					nextDay: '[غدا على الساعة] LT',
					nextWeek: 'dddd [على الساعة] LT',
					lastDay: '[أمس على الساعة] LT',
					lastWeek: 'dddd [على الساعة] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'في %s',
					past: 'منذ %s',
					s: 'ثوان',
					m: 'دقيقة',
					mm: '%d دقائق',
					h: 'ساعة',
					hh: '%d ساعات',
					d: 'يوم',
					dd: '%d أيام',
					M: 'شهر',
					MM: '%d أشهر',
					y: 'سنة',
					yy: '%d سنوات'
				},
				week: {
					dow: 6, // Saturday is the first day of the week.
					doy: 12  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return arMa;

		})));


		/***/
	}),
	/* 9 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Arabic (Saudi Arabia) [ar-sa]
//! author : Suhail Alkowaileet : https://github.com/xsoh

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var symbolMap = {
				'1': '١',
				'2': '٢',
				'3': '٣',
				'4': '٤',
				'5': '٥',
				'6': '٦',
				'7': '٧',
				'8': '٨',
				'9': '٩',
				'0': '٠'
			};
			var numberMap = {
				'١': '1',
				'٢': '2',
				'٣': '3',
				'٤': '4',
				'٥': '5',
				'٦': '6',
				'٧': '7',
				'٨': '8',
				'٩': '9',
				'٠': '0'
			};

			var arSa = moment.defineLocale('ar-sa', {
				months: 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
				monthsShort: 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
				weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
				weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
				weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D MMMM YYYY HH:mm'
				},
				meridiemParse: /ص|م/,
				isPM: function (input) {
					return 'م' === input;
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 12) {
						return 'ص';
					} else {
						return 'م';
					}
				},
				calendar: {
					sameDay: '[اليوم على الساعة] LT',
					nextDay: '[غدا على الساعة] LT',
					nextWeek: 'dddd [على الساعة] LT',
					lastDay: '[أمس على الساعة] LT',
					lastWeek: 'dddd [على الساعة] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'في %s',
					past: 'منذ %s',
					s: 'ثوان',
					m: 'دقيقة',
					mm: '%d دقائق',
					h: 'ساعة',
					hh: '%d ساعات',
					d: 'يوم',
					dd: '%d أيام',
					M: 'شهر',
					MM: '%d أشهر',
					y: 'سنة',
					yy: '%d سنوات'
				},
				preparse: function (string) {
					return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
						return numberMap[match];
					}).replace(/،/g, ',');
				},
				postformat: function (string) {
					return string.replace(/\d/g, function (match) {
						return symbolMap[match];
					}).replace(/,/g, '،');
				},
				week: {
					dow: 0, // Sunday is the first day of the week.
					doy: 6  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return arSa;

		})));


		/***/
	}),
	/* 10 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale  :  Arabic (Tunisia) [ar-tn]
//! author : Nader Toukabri : https://github.com/naderio

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var arTn = moment.defineLocale('ar-tn', {
				months: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
				monthsShort: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
				weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
				weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
				weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[اليوم على الساعة] LT',
					nextDay: '[غدا على الساعة] LT',
					nextWeek: 'dddd [على الساعة] LT',
					lastDay: '[أمس على الساعة] LT',
					lastWeek: 'dddd [على الساعة] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'في %s',
					past: 'منذ %s',
					s: 'ثوان',
					m: 'دقيقة',
					mm: '%d دقائق',
					h: 'ساعة',
					hh: '%d ساعات',
					d: 'يوم',
					dd: '%d أيام',
					M: 'شهر',
					MM: '%d أشهر',
					y: 'سنة',
					yy: '%d سنوات'
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4 // The week that contains Jan 4th is the first week of the year.
				}
			});

			return arTn;

		})));


		/***/
	}),
	/* 11 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Azerbaijani [az]
//! author : topchiyev : https://github.com/topchiyev

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var suffixes = {
				1: '-inci',
				5: '-inci',
				8: '-inci',
				70: '-inci',
				80: '-inci',
				2: '-nci',
				7: '-nci',
				20: '-nci',
				50: '-nci',
				3: '-üncü',
				4: '-üncü',
				100: '-üncü',
				6: '-ncı',
				9: '-uncu',
				10: '-uncu',
				30: '-uncu',
				60: '-ıncı',
				90: '-ıncı'
			};

			var az = moment.defineLocale('az', {
				months: 'yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr'.split('_'),
				monthsShort: 'yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek'.split('_'),
				weekdays: 'Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə'.split('_'),
				weekdaysShort: 'Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən'.split('_'),
				weekdaysMin: 'Bz_BE_ÇA_Çə_CA_Cü_Şə'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd, D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[bugün saat] LT',
					nextDay: '[sabah saat] LT',
					nextWeek: '[gələn həftə] dddd [saat] LT',
					lastDay: '[dünən] LT',
					lastWeek: '[keçən həftə] dddd [saat] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s sonra',
					past: '%s əvvəl',
					s: 'birneçə saniyyə',
					m: 'bir dəqiqə',
					mm: '%d dəqiqə',
					h: 'bir saat',
					hh: '%d saat',
					d: 'bir gün',
					dd: '%d gün',
					M: 'bir ay',
					MM: '%d ay',
					y: 'bir il',
					yy: '%d il'
				},
				meridiemParse: /gecə|səhər|gündüz|axşam/,
				isPM: function (input) {
					return /^(gündüz|axşam)$/.test(input);
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 4) {
						return 'gecə';
					} else if (hour < 12) {
						return 'səhər';
					} else if (hour < 17) {
						return 'gündüz';
					} else {
						return 'axşam';
					}
				},
				dayOfMonthOrdinalParse: /\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,
				ordinal: function (number) {
					if (number === 0) {  // special case for zero
						return number + '-ıncı';
					}
					var a = number % 10,
						b = number % 100 - a,
						c = number >= 100 ? 100 : null;
					return number + (suffixes[a] || suffixes[b] || suffixes[c]);
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return az;

		})));


		/***/
	}),
	/* 12 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Belarusian [be]
//! author : Dmitry Demidov : https://github.com/demidov91
//! author: Praleska: http://praleska.pro/
//! Author : Menelion Elensúle : https://github.com/Oire

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			function plural(word, num) {
				var forms = word.split('_');
				return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
			}

			function relativeTimeWithPlural(number, withoutSuffix, key) {
				var format = {
					'mm': withoutSuffix ? 'хвіліна_хвіліны_хвілін' : 'хвіліну_хвіліны_хвілін',
					'hh': withoutSuffix ? 'гадзіна_гадзіны_гадзін' : 'гадзіну_гадзіны_гадзін',
					'dd': 'дзень_дні_дзён',
					'MM': 'месяц_месяцы_месяцаў',
					'yy': 'год_гады_гадоў'
				};
				if (key === 'm') {
					return withoutSuffix ? 'хвіліна' : 'хвіліну';
				}
				else if (key === 'h') {
					return withoutSuffix ? 'гадзіна' : 'гадзіну';
				}
				else {
					return number + ' ' + plural(format[key], +number);
				}
			}

			var be = moment.defineLocale('be', {
				months: {
					format: 'студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня'.split('_'),
					standalone: 'студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань'.split('_')
				},
				monthsShort: 'студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж'.split('_'),
				weekdays: {
					format: 'нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу'.split('_'),
					standalone: 'нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота'.split('_'),
					isFormat: /\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/
				},
				weekdaysShort: 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
				weekdaysMin: 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D MMMM YYYY г.',
					LLL: 'D MMMM YYYY г., HH:mm',
					LLLL: 'dddd, D MMMM YYYY г., HH:mm'
				},
				calendar: {
					sameDay: '[Сёння ў] LT',
					nextDay: '[Заўтра ў] LT',
					lastDay: '[Учора ў] LT',
					nextWeek: function () {
						return '[У] dddd [ў] LT';
					},
					lastWeek: function () {
						switch (this.day()) {
							case 0:
							case 3:
							case 5:
							case 6:
								return '[У мінулую] dddd [ў] LT';
							case 1:
							case 2:
							case 4:
								return '[У мінулы] dddd [ў] LT';
						}
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'праз %s',
					past: '%s таму',
					s: 'некалькі секунд',
					m: relativeTimeWithPlural,
					mm: relativeTimeWithPlural,
					h: relativeTimeWithPlural,
					hh: relativeTimeWithPlural,
					d: 'дзень',
					dd: relativeTimeWithPlural,
					M: 'месяц',
					MM: relativeTimeWithPlural,
					y: 'год',
					yy: relativeTimeWithPlural
				},
				meridiemParse: /ночы|раніцы|дня|вечара/,
				isPM: function (input) {
					return /^(дня|вечара)$/.test(input);
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 4) {
						return 'ночы';
					} else if (hour < 12) {
						return 'раніцы';
					} else if (hour < 17) {
						return 'дня';
					} else {
						return 'вечара';
					}
				},
				dayOfMonthOrdinalParse: /\d{1,2}-(і|ы|га)/,
				ordinal: function (number, period) {
					switch (period) {
						case 'M':
						case 'd':
						case 'DDD':
						case 'w':
						case 'W':
							return (number % 10 === 2 || number % 10 === 3) && (number % 100 !== 12 && number % 100 !== 13) ? number + '-і' : number + '-ы';
						case 'D':
							return number + '-га';
						default:
							return number;
					}
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return be;

		})));


		/***/
	}),
	/* 13 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Bulgarian [bg]
//! author : Krasen Borisov : https://github.com/kraz

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var bg = moment.defineLocale('bg', {
				months: 'януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември'.split('_'),
				monthsShort: 'янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек'.split('_'),
				weekdays: 'неделя_понеделник_вторник_сряда_четвъртък_петък_събота'.split('_'),
				weekdaysShort: 'нед_пон_вто_сря_чет_пет_съб'.split('_'),
				weekdaysMin: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
				longDateFormat: {
					LT: 'H:mm',
					LTS: 'H:mm:ss',
					L: 'D.MM.YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY H:mm',
					LLLL: 'dddd, D MMMM YYYY H:mm'
				},
				calendar: {
					sameDay: '[Днес в] LT',
					nextDay: '[Утре в] LT',
					nextWeek: 'dddd [в] LT',
					lastDay: '[Вчера в] LT',
					lastWeek: function () {
						switch (this.day()) {
							case 0:
							case 3:
							case 6:
								return '[В изминалата] dddd [в] LT';
							case 1:
							case 2:
							case 4:
							case 5:
								return '[В изминалия] dddd [в] LT';
						}
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'след %s',
					past: 'преди %s',
					s: 'няколко секунди',
					m: 'минута',
					mm: '%d минути',
					h: 'час',
					hh: '%d часа',
					d: 'ден',
					dd: '%d дни',
					M: 'месец',
					MM: '%d месеца',
					y: 'година',
					yy: '%d години'
				},
				dayOfMonthOrdinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
				ordinal: function (number) {
					var lastDigit = number % 10,
						last2Digits = number % 100;
					if (number === 0) {
						return number + '-ев';
					} else if (last2Digits === 0) {
						return number + '-ен';
					} else if (last2Digits > 10 && last2Digits < 20) {
						return number + '-ти';
					} else if (lastDigit === 1) {
						return number + '-ви';
					} else if (lastDigit === 2) {
						return number + '-ри';
					} else if (lastDigit === 7 || lastDigit === 8) {
						return number + '-ми';
					} else {
						return number + '-ти';
					}
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return bg;

		})));


		/***/
	}),
	/* 14 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Bambara [bm]
//! author : Estelle Comment : https://github.com/estellecomment

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';

// Language contact person : Abdoufata Kane : https://github.com/abdoufata

			var bm = moment.defineLocale('bm', {
				months: 'Zanwuyekalo_Fewuruyekalo_Marisikalo_Awirilikalo_Mɛkalo_Zuwɛnkalo_Zuluyekalo_Utikalo_Sɛtanburukalo_ɔkutɔburukalo_Nowanburukalo_Desanburukalo'.split('_'),
				monthsShort: 'Zan_Few_Mar_Awi_Mɛ_Zuw_Zul_Uti_Sɛt_ɔku_Now_Des'.split('_'),
				weekdays: 'Kari_Ntɛnɛn_Tarata_Araba_Alamisa_Juma_Sibiri'.split('_'),
				weekdaysShort: 'Kar_Ntɛ_Tar_Ara_Ala_Jum_Sib'.split('_'),
				weekdaysMin: 'Ka_Nt_Ta_Ar_Al_Ju_Si'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'MMMM [tile] D [san] YYYY',
					LLL: 'MMMM [tile] D [san] YYYY [lɛrɛ] HH:mm',
					LLLL: 'dddd MMMM [tile] D [san] YYYY [lɛrɛ] HH:mm'
				},
				calendar: {
					sameDay: '[Bi lɛrɛ] LT',
					nextDay: '[Sini lɛrɛ] LT',
					nextWeek: 'dddd [don lɛrɛ] LT',
					lastDay: '[Kunu lɛrɛ] LT',
					lastWeek: 'dddd [tɛmɛnen lɛrɛ] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s kɔnɔ',
					past: 'a bɛ %s bɔ',
					s: 'sanga dama dama',
					m: 'miniti kelen',
					mm: 'miniti %d',
					h: 'lɛrɛ kelen',
					hh: 'lɛrɛ %d',
					d: 'tile kelen',
					dd: 'tile %d',
					M: 'kalo kelen',
					MM: 'kalo %d',
					y: 'san kelen',
					yy: 'san %d'
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return bm;

		})));


		/***/
	}),
	/* 15 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Bengali [bn]
//! author : Kaushik Gandhi : https://github.com/kaushikgandhi

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var symbolMap = {
				'1': '১',
				'2': '২',
				'3': '৩',
				'4': '৪',
				'5': '৫',
				'6': '৬',
				'7': '৭',
				'8': '৮',
				'9': '৯',
				'0': '০'
			};
			var numberMap = {
				'১': '1',
				'২': '2',
				'৩': '3',
				'৪': '4',
				'৫': '5',
				'৬': '6',
				'৭': '7',
				'৮': '8',
				'৯': '9',
				'০': '0'
			};

			var bn = moment.defineLocale('bn', {
				months: 'জানুয়ারী_ফেব্রুয়ারি_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর'.split('_'),
				monthsShort: 'জানু_ফেব_মার্চ_এপ্র_মে_জুন_জুল_আগ_সেপ্ট_অক্টো_নভে_ডিসে'.split('_'),
				weekdays: 'রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পতিবার_শুক্রবার_শনিবার'.split('_'),
				weekdaysShort: 'রবি_সোম_মঙ্গল_বুধ_বৃহস্পতি_শুক্র_শনি'.split('_'),
				weekdaysMin: 'রবি_সোম_মঙ্গ_বুধ_বৃহঃ_শুক্র_শনি'.split('_'),
				longDateFormat: {
					LT: 'A h:mm সময়',
					LTS: 'A h:mm:ss সময়',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY, A h:mm সময়',
					LLLL: 'dddd, D MMMM YYYY, A h:mm সময়'
				},
				calendar: {
					sameDay: '[আজ] LT',
					nextDay: '[আগামীকাল] LT',
					nextWeek: 'dddd, LT',
					lastDay: '[গতকাল] LT',
					lastWeek: '[গত] dddd, LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s পরে',
					past: '%s আগে',
					s: 'কয়েক সেকেন্ড',
					m: 'এক মিনিট',
					mm: '%d মিনিট',
					h: 'এক ঘন্টা',
					hh: '%d ঘন্টা',
					d: 'এক দিন',
					dd: '%d দিন',
					M: 'এক মাস',
					MM: '%d মাস',
					y: 'এক বছর',
					yy: '%d বছর'
				},
				preparse: function (string) {
					return string.replace(/[১২৩৪৫৬৭৮৯০]/g, function (match) {
						return numberMap[match];
					});
				},
				postformat: function (string) {
					return string.replace(/\d/g, function (match) {
						return symbolMap[match];
					});
				},
				meridiemParse: /রাত|সকাল|দুপুর|বিকাল|রাত/,
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if ((meridiem === 'রাত' && hour >= 4) ||
						(meridiem === 'দুপুর' && hour < 5) ||
						meridiem === 'বিকাল') {
						return hour + 12;
					} else {
						return hour;
					}
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 4) {
						return 'রাত';
					} else if (hour < 10) {
						return 'সকাল';
					} else if (hour < 17) {
						return 'দুপুর';
					} else if (hour < 20) {
						return 'বিকাল';
					} else {
						return 'রাত';
					}
				},
				week: {
					dow: 0, // Sunday is the first day of the week.
					doy: 6  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return bn;

		})));


		/***/
	}),
	/* 16 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Tibetan [bo]
//! author : Thupten N. Chakrishar : https://github.com/vajradog

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var symbolMap = {
				'1': '༡',
				'2': '༢',
				'3': '༣',
				'4': '༤',
				'5': '༥',
				'6': '༦',
				'7': '༧',
				'8': '༨',
				'9': '༩',
				'0': '༠'
			};
			var numberMap = {
				'༡': '1',
				'༢': '2',
				'༣': '3',
				'༤': '4',
				'༥': '5',
				'༦': '6',
				'༧': '7',
				'༨': '8',
				'༩': '9',
				'༠': '0'
			};

			var bo = moment.defineLocale('bo', {
				months: 'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split('_'),
				monthsShort: 'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split('_'),
				weekdays: 'གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་'.split('_'),
				weekdaysShort: 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split('_'),
				weekdaysMin: 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split('_'),
				longDateFormat: {
					LT: 'A h:mm',
					LTS: 'A h:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY, A h:mm',
					LLLL: 'dddd, D MMMM YYYY, A h:mm'
				},
				calendar: {
					sameDay: '[དི་རིང] LT',
					nextDay: '[སང་ཉིན] LT',
					nextWeek: '[བདུན་ཕྲག་རྗེས་མ], LT',
					lastDay: '[ཁ་སང] LT',
					lastWeek: '[བདུན་ཕྲག་མཐའ་མ] dddd, LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s ལ་',
					past: '%s སྔན་ལ',
					s: 'ལམ་སང',
					m: 'སྐར་མ་གཅིག',
					mm: '%d སྐར་མ',
					h: 'ཆུ་ཚོད་གཅིག',
					hh: '%d ཆུ་ཚོད',
					d: 'ཉིན་གཅིག',
					dd: '%d ཉིན་',
					M: 'ཟླ་བ་གཅིག',
					MM: '%d ཟླ་བ',
					y: 'ལོ་གཅིག',
					yy: '%d ལོ'
				},
				preparse: function (string) {
					return string.replace(/[༡༢༣༤༥༦༧༨༩༠]/g, function (match) {
						return numberMap[match];
					});
				},
				postformat: function (string) {
					return string.replace(/\d/g, function (match) {
						return symbolMap[match];
					});
				},
				meridiemParse: /མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if ((meridiem === 'མཚན་མོ' && hour >= 4) ||
						(meridiem === 'ཉིན་གུང' && hour < 5) ||
						meridiem === 'དགོང་དག') {
						return hour + 12;
					} else {
						return hour;
					}
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 4) {
						return 'མཚན་མོ';
					} else if (hour < 10) {
						return 'ཞོགས་ཀས';
					} else if (hour < 17) {
						return 'ཉིན་གུང';
					} else if (hour < 20) {
						return 'དགོང་དག';
					} else {
						return 'མཚན་མོ';
					}
				},
				week: {
					dow: 0, // Sunday is the first day of the week.
					doy: 6  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return bo;

		})));


		/***/
	}),
	/* 17 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Breton [br]
//! author : Jean-Baptiste Le Duigou : https://github.com/jbleduigou

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			function relativeTimeWithMutation(number, withoutSuffix, key) {
				var format = {
					'mm': 'munutenn',
					'MM': 'miz',
					'dd': 'devezh'
				};
				return number + ' ' + mutation(format[key], number);
			}

			function specialMutationForYears(number) {
				switch (lastNumber(number)) {
					case 1:
					case 3:
					case 4:
					case 5:
					case 9:
						return number + ' bloaz';
					default:
						return number + ' vloaz';
				}
			}

			function lastNumber(number) {
				if (number > 9) {
					return lastNumber(number % 10);
				}
				return number;
			}

			function mutation(text, number) {
				if (number === 2) {
					return softMutation(text);
				}
				return text;
			}

			function softMutation(text) {
				var mutationTable = {
					'm': 'v',
					'b': 'v',
					'd': 'z'
				};
				if (mutationTable[text.charAt(0)] === undefined) {
					return text;
				}
				return mutationTable[text.charAt(0)] + text.substring(1);
			}

			var br = moment.defineLocale('br', {
				months: 'Genver_C\'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu'.split('_'),
				monthsShort: 'Gen_C\'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker'.split('_'),
				weekdays: 'Sul_Lun_Meurzh_Merc\'her_Yaou_Gwener_Sadorn'.split('_'),
				weekdaysShort: 'Sul_Lun_Meu_Mer_Yao_Gwe_Sad'.split('_'),
				weekdaysMin: 'Su_Lu_Me_Mer_Ya_Gw_Sa'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'h[e]mm A',
					LTS: 'h[e]mm:ss A',
					L: 'DD/MM/YYYY',
					LL: 'D [a viz] MMMM YYYY',
					LLL: 'D [a viz] MMMM YYYY h[e]mm A',
					LLLL: 'dddd, D [a viz] MMMM YYYY h[e]mm A'
				},
				calendar: {
					sameDay: '[Hiziv da] LT',
					nextDay: '[Warc\'hoazh da] LT',
					nextWeek: 'dddd [da] LT',
					lastDay: '[Dec\'h da] LT',
					lastWeek: 'dddd [paset da] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'a-benn %s',
					past: '%s \'zo',
					s: 'un nebeud segondennoù',
					m: 'ur vunutenn',
					mm: relativeTimeWithMutation,
					h: 'un eur',
					hh: '%d eur',
					d: 'un devezh',
					dd: relativeTimeWithMutation,
					M: 'ur miz',
					MM: relativeTimeWithMutation,
					y: 'ur bloaz',
					yy: specialMutationForYears
				},
				dayOfMonthOrdinalParse: /\d{1,2}(añ|vet)/,
				ordinal: function (number) {
					var output = (number === 1) ? 'añ' : 'vet';
					return number + output;
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return br;

		})));


		/***/
	}),
	/* 18 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Bosnian [bs]
//! author : Nedim Cholich : https://github.com/frontyard
//! based on (hr) translation by Bojan Marković

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			function translate(number, withoutSuffix, key) {
				var result = number + ' ';
				switch (key) {
					case 'm':
						return withoutSuffix ? 'jedna minuta' : 'jedne minute';
					case 'mm':
						if (number === 1) {
							result += 'minuta';
						} else if (number === 2 || number === 3 || number === 4) {
							result += 'minute';
						} else {
							result += 'minuta';
						}
						return result;
					case 'h':
						return withoutSuffix ? 'jedan sat' : 'jednog sata';
					case 'hh':
						if (number === 1) {
							result += 'sat';
						} else if (number === 2 || number === 3 || number === 4) {
							result += 'sata';
						} else {
							result += 'sati';
						}
						return result;
					case 'dd':
						if (number === 1) {
							result += 'dan';
						} else {
							result += 'dana';
						}
						return result;
					case 'MM':
						if (number === 1) {
							result += 'mjesec';
						} else if (number === 2 || number === 3 || number === 4) {
							result += 'mjeseca';
						} else {
							result += 'mjeseci';
						}
						return result;
					case 'yy':
						if (number === 1) {
							result += 'godina';
						} else if (number === 2 || number === 3 || number === 4) {
							result += 'godine';
						} else {
							result += 'godina';
						}
						return result;
				}
			}

			var bs = moment.defineLocale('bs', {
				months: 'januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar'.split('_'),
				monthsShort: 'jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.'.split('_'),
				monthsParseExact: true,
				weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
				weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
				weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'H:mm',
					LTS: 'H:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D. MMMM YYYY',
					LLL: 'D. MMMM YYYY H:mm',
					LLLL: 'dddd, D. MMMM YYYY H:mm'
				},
				calendar: {
					sameDay: '[danas u] LT',
					nextDay: '[sutra u] LT',
					nextWeek: function () {
						switch (this.day()) {
							case 0:
								return '[u] [nedjelju] [u] LT';
							case 3:
								return '[u] [srijedu] [u] LT';
							case 6:
								return '[u] [subotu] [u] LT';
							case 1:
							case 2:
							case 4:
							case 5:
								return '[u] dddd [u] LT';
						}
					},
					lastDay: '[jučer u] LT',
					lastWeek: function () {
						switch (this.day()) {
							case 0:
							case 3:
								return '[prošlu] dddd [u] LT';
							case 6:
								return '[prošle] [subote] [u] LT';
							case 1:
							case 2:
							case 4:
							case 5:
								return '[prošli] dddd [u] LT';
						}
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'za %s',
					past: 'prije %s',
					s: 'par sekundi',
					m: translate,
					mm: translate,
					h: translate,
					hh: translate,
					d: 'dan',
					dd: translate,
					M: 'mjesec',
					MM: translate,
					y: 'godinu',
					yy: translate
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return bs;

		})));


		/***/
	}),
	/* 19 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Catalan [ca]
//! author : Juan G. Hurtado : https://github.com/juanghurtado

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var ca = moment.defineLocale('ca', {
				months: {
					standalone: 'gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre'.split('_'),
					format: 'de gener_de febrer_de març_d\'abril_de maig_de juny_de juliol_d\'agost_de setembre_d\'octubre_de novembre_de desembre'.split('_'),
					isFormat: /D[oD]?(\s)+MMMM/
				},
				monthsShort: 'gen._febr._març_abr._maig_juny_jul._ag._set._oct._nov._des.'.split('_'),
				monthsParseExact: true,
				weekdays: 'diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte'.split('_'),
				weekdaysShort: 'dg._dl._dt._dc._dj._dv._ds.'.split('_'),
				weekdaysMin: 'dg_dl_dt_dc_dj_dv_ds'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'H:mm',
					LTS: 'H:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM [de] YYYY',
					ll: 'D MMM YYYY',
					LLL: 'D MMMM [de] YYYY [a les] H:mm',
					lll: 'D MMM YYYY, H:mm',
					LLLL: 'dddd D MMMM [de] YYYY [a les] H:mm',
					llll: 'ddd D MMM YYYY, H:mm'
				},
				calendar: {
					sameDay: function () {
						return '[avui a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
					},
					nextDay: function () {
						return '[demà a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
					},
					nextWeek: function () {
						return 'dddd [a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
					},
					lastDay: function () {
						return '[ahir a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
					},
					lastWeek: function () {
						return '[el] dddd [passat a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'd\'aquí %s',
					past: 'fa %s',
					s: 'uns segons',
					m: 'un minut',
					mm: '%d minuts',
					h: 'una hora',
					hh: '%d hores',
					d: 'un dia',
					dd: '%d dies',
					M: 'un mes',
					MM: '%d mesos',
					y: 'un any',
					yy: '%d anys'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(r|n|t|è|a)/,
				ordinal: function (number, period) {
					var output = (number === 1) ? 'r' :
						(number === 2) ? 'n' :
							(number === 3) ? 'r' :
								(number === 4) ? 't' : 'è';
					if (period === 'w' || period === 'W') {
						output = 'a';
					}
					return number + output;
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return ca;

		})));


		/***/
	}),
	/* 20 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Czech [cs]
//! author : petrbela : https://github.com/petrbela

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var months = 'leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec'.split('_');
			var monthsShort = 'led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro'.split('_');

			function plural(n) {
				return (n > 1) && (n < 5) && (~~(n / 10) !== 1);
			}

			function translate(number, withoutSuffix, key, isFuture) {
				var result = number + ' ';
				switch (key) {
					case 's':  // a few seconds / in a few seconds / a few seconds ago
						return (withoutSuffix || isFuture) ? 'pár sekund' : 'pár sekundami';
					case 'm':  // a minute / in a minute / a minute ago
						return withoutSuffix ? 'minuta' : (isFuture ? 'minutu' : 'minutou');
					case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
						if (withoutSuffix || isFuture) {
							return result + (plural(number) ? 'minuty' : 'minut');
						} else {
							return result + 'minutami';
						}
						break;
					case 'h':  // an hour / in an hour / an hour ago
						return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
					case 'hh': // 9 hours / in 9 hours / 9 hours ago
						if (withoutSuffix || isFuture) {
							return result + (plural(number) ? 'hodiny' : 'hodin');
						} else {
							return result + 'hodinami';
						}
						break;
					case 'd':  // a day / in a day / a day ago
						return (withoutSuffix || isFuture) ? 'den' : 'dnem';
					case 'dd': // 9 days / in 9 days / 9 days ago
						if (withoutSuffix || isFuture) {
							return result + (plural(number) ? 'dny' : 'dní');
						} else {
							return result + 'dny';
						}
						break;
					case 'M':  // a month / in a month / a month ago
						return (withoutSuffix || isFuture) ? 'měsíc' : 'měsícem';
					case 'MM': // 9 months / in 9 months / 9 months ago
						if (withoutSuffix || isFuture) {
							return result + (plural(number) ? 'měsíce' : 'měsíců');
						} else {
							return result + 'měsíci';
						}
						break;
					case 'y':  // a year / in a year / a year ago
						return (withoutSuffix || isFuture) ? 'rok' : 'rokem';
					case 'yy': // 9 years / in 9 years / 9 years ago
						if (withoutSuffix || isFuture) {
							return result + (plural(number) ? 'roky' : 'let');
						} else {
							return result + 'lety';
						}
						break;
				}
			}

			var cs = moment.defineLocale('cs', {
				months: months,
				monthsShort: monthsShort,
				monthsParse: (function (months, monthsShort) {
					var i, _monthsParse = [];
					for (i = 0; i < 12; i++) {
						// use custom parser to solve problem with July (červenec)
						_monthsParse[i] = new RegExp('^' + months[i] + '$|^' + monthsShort[i] + '$', 'i');
					}
					return _monthsParse;
				}(months, monthsShort)),
				shortMonthsParse: (function (monthsShort) {
					var i, _shortMonthsParse = [];
					for (i = 0; i < 12; i++) {
						_shortMonthsParse[i] = new RegExp('^' + monthsShort[i] + '$', 'i');
					}
					return _shortMonthsParse;
				}(monthsShort)),
				longMonthsParse: (function (months) {
					var i, _longMonthsParse = [];
					for (i = 0; i < 12; i++) {
						_longMonthsParse[i] = new RegExp('^' + months[i] + '$', 'i');
					}
					return _longMonthsParse;
				}(months)),
				weekdays: 'neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota'.split('_'),
				weekdaysShort: 'ne_po_út_st_čt_pá_so'.split('_'),
				weekdaysMin: 'ne_po_út_st_čt_pá_so'.split('_'),
				longDateFormat: {
					LT: 'H:mm',
					LTS: 'H:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D. MMMM YYYY',
					LLL: 'D. MMMM YYYY H:mm',
					LLLL: 'dddd D. MMMM YYYY H:mm',
					l: 'D. M. YYYY'
				},
				calendar: {
					sameDay: '[dnes v] LT',
					nextDay: '[zítra v] LT',
					nextWeek: function () {
						switch (this.day()) {
							case 0:
								return '[v neděli v] LT';
							case 1:
							case 2:
								return '[v] dddd [v] LT';
							case 3:
								return '[ve středu v] LT';
							case 4:
								return '[ve čtvrtek v] LT';
							case 5:
								return '[v pátek v] LT';
							case 6:
								return '[v sobotu v] LT';
						}
					},
					lastDay: '[včera v] LT',
					lastWeek: function () {
						switch (this.day()) {
							case 0:
								return '[minulou neděli v] LT';
							case 1:
							case 2:
								return '[minulé] dddd [v] LT';
							case 3:
								return '[minulou středu v] LT';
							case 4:
							case 5:
								return '[minulý] dddd [v] LT';
							case 6:
								return '[minulou sobotu v] LT';
						}
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'za %s',
					past: 'před %s',
					s: translate,
					m: translate,
					mm: translate,
					h: translate,
					hh: translate,
					d: translate,
					dd: translate,
					M: translate,
					MM: translate,
					y: translate,
					yy: translate
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return cs;

		})));


		/***/
	}),
	/* 21 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Chuvash [cv]
//! author : Anatoly Mironov : https://github.com/mirontoli

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var cv = moment.defineLocale('cv', {
				months: 'кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав'.split('_'),
				monthsShort: 'кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш'.split('_'),
				weekdays: 'вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун'.split('_'),
				weekdaysShort: 'выр_тун_ытл_юн_кӗҫ_эрн_шӑм'.split('_'),
				weekdaysMin: 'вр_тн_ыт_юн_кҫ_эр_шм'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD-MM-YYYY',
					LL: 'YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]',
					LLL: 'YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm',
					LLLL: 'dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm'
				},
				calendar: {
					sameDay: '[Паян] LT [сехетре]',
					nextDay: '[Ыран] LT [сехетре]',
					lastDay: '[Ӗнер] LT [сехетре]',
					nextWeek: '[Ҫитес] dddd LT [сехетре]',
					lastWeek: '[Иртнӗ] dddd LT [сехетре]',
					sameElse: 'L'
				},
				relativeTime: {
					future: function (output) {
						var affix = /сехет$/i.exec(output) ? 'рен' : /ҫул$/i.exec(output) ? 'тан' : 'ран';
						return output + affix;
					},
					past: '%s каялла',
					s: 'пӗр-ик ҫеккунт',
					m: 'пӗр минут',
					mm: '%d минут',
					h: 'пӗр сехет',
					hh: '%d сехет',
					d: 'пӗр кун',
					dd: '%d кун',
					M: 'пӗр уйӑх',
					MM: '%d уйӑх',
					y: 'пӗр ҫул',
					yy: '%d ҫул'
				},
				dayOfMonthOrdinalParse: /\d{1,2}-мӗш/,
				ordinal: '%d-мӗш',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return cv;

		})));


		/***/
	}),
	/* 22 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Welsh [cy]
//! author : Robert Allen : https://github.com/robgallen
//! author : https://github.com/ryangreaves

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var cy = moment.defineLocale('cy', {
				months: 'Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr'.split('_'),
				monthsShort: 'Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag'.split('_'),
				weekdays: 'Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn'.split('_'),
				weekdaysShort: 'Sul_Llun_Maw_Mer_Iau_Gwe_Sad'.split('_'),
				weekdaysMin: 'Su_Ll_Ma_Me_Ia_Gw_Sa'.split('_'),
				weekdaysParseExact: true,
				// time formats are the same as en-gb
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd, D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[Heddiw am] LT',
					nextDay: '[Yfory am] LT',
					nextWeek: 'dddd [am] LT',
					lastDay: '[Ddoe am] LT',
					lastWeek: 'dddd [diwethaf am] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'mewn %s',
					past: '%s yn ôl',
					s: 'ychydig eiliadau',
					m: 'munud',
					mm: '%d munud',
					h: 'awr',
					hh: '%d awr',
					d: 'diwrnod',
					dd: '%d diwrnod',
					M: 'mis',
					MM: '%d mis',
					y: 'blwyddyn',
					yy: '%d flynedd'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,
				// traditional ordinal numbers above 31 are not commonly used in colloquial Welsh
				ordinal: function (number) {
					var b = number,
						output = '',
						lookup = [
							'', 'af', 'il', 'ydd', 'ydd', 'ed', 'ed', 'ed', 'fed', 'fed', 'fed', // 1af to 10fed
							'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'fed' // 11eg to 20fed
						];
					if (b > 20) {
						if (b === 40 || b === 50 || b === 60 || b === 80 || b === 100) {
							output = 'fed'; // not 30ain, 70ain or 90ain
						} else {
							output = 'ain';
						}
					} else if (b > 0) {
						output = lookup[b];
					}
					return number + output;
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return cy;

		})));


		/***/
	}),
	/* 23 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Danish [da]
//! author : Ulrik Nielsen : https://github.com/mrbase

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var da = moment.defineLocale('da', {
				months: 'januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december'.split('_'),
				monthsShort: 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
				weekdays: 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
				weekdaysShort: 'søn_man_tir_ons_tor_fre_lør'.split('_'),
				weekdaysMin: 'sø_ma_ti_on_to_fr_lø'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D. MMMM YYYY',
					LLL: 'D. MMMM YYYY HH:mm',
					LLLL: 'dddd [d.] D. MMMM YYYY [kl.] HH:mm'
				},
				calendar: {
					sameDay: '[i dag kl.] LT',
					nextDay: '[i morgen kl.] LT',
					nextWeek: 'på dddd [kl.] LT',
					lastDay: '[i går kl.] LT',
					lastWeek: '[i] dddd[s kl.] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'om %s',
					past: '%s siden',
					s: 'få sekunder',
					m: 'et minut',
					mm: '%d minutter',
					h: 'en time',
					hh: '%d timer',
					d: 'en dag',
					dd: '%d dage',
					M: 'en måned',
					MM: '%d måneder',
					y: 'et år',
					yy: '%d år'
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return da;

		})));


		/***/
	}),
	/* 24 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : German [de]
//! author : lluchs : https://github.com/lluchs
//! author: Menelion Elensúle: https://github.com/Oire
//! author : Mikolaj Dadela : https://github.com/mik01aj

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			function processRelativeTime(number, withoutSuffix, key, isFuture) {
				var format = {
					'm': ['eine Minute', 'einer Minute'],
					'h': ['eine Stunde', 'einer Stunde'],
					'd': ['ein Tag', 'einem Tag'],
					'dd': [number + ' Tage', number + ' Tagen'],
					'M': ['ein Monat', 'einem Monat'],
					'MM': [number + ' Monate', number + ' Monaten'],
					'y': ['ein Jahr', 'einem Jahr'],
					'yy': [number + ' Jahre', number + ' Jahren']
				};
				return withoutSuffix ? format[key][0] : format[key][1];
			}

			var de = moment.defineLocale('de', {
				months: 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
				monthsShort: 'Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
				monthsParseExact: true,
				weekdays: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
				weekdaysShort: 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
				weekdaysMin: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D. MMMM YYYY',
					LLL: 'D. MMMM YYYY HH:mm',
					LLLL: 'dddd, D. MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[heute um] LT [Uhr]',
					sameElse: 'L',
					nextDay: '[morgen um] LT [Uhr]',
					nextWeek: 'dddd [um] LT [Uhr]',
					lastDay: '[gestern um] LT [Uhr]',
					lastWeek: '[letzten] dddd [um] LT [Uhr]'
				},
				relativeTime: {
					future: 'in %s',
					past: 'vor %s',
					s: 'ein paar Sekunden',
					m: processRelativeTime,
					mm: '%d Minuten',
					h: processRelativeTime,
					hh: '%d Stunden',
					d: processRelativeTime,
					dd: processRelativeTime,
					M: processRelativeTime,
					MM: processRelativeTime,
					y: processRelativeTime,
					yy: processRelativeTime
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return de;

		})));


		/***/
	}),
	/* 25 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : German (Austria) [de-at]
//! author : lluchs : https://github.com/lluchs
//! author: Menelion Elensúle: https://github.com/Oire
//! author : Martin Groller : https://github.com/MadMG
//! author : Mikolaj Dadela : https://github.com/mik01aj

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			function processRelativeTime(number, withoutSuffix, key, isFuture) {
				var format = {
					'm': ['eine Minute', 'einer Minute'],
					'h': ['eine Stunde', 'einer Stunde'],
					'd': ['ein Tag', 'einem Tag'],
					'dd': [number + ' Tage', number + ' Tagen'],
					'M': ['ein Monat', 'einem Monat'],
					'MM': [number + ' Monate', number + ' Monaten'],
					'y': ['ein Jahr', 'einem Jahr'],
					'yy': [number + ' Jahre', number + ' Jahren']
				};
				return withoutSuffix ? format[key][0] : format[key][1];
			}

			var deAt = moment.defineLocale('de-at', {
				months: 'Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
				monthsShort: 'Jän._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
				monthsParseExact: true,
				weekdays: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
				weekdaysShort: 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
				weekdaysMin: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D. MMMM YYYY',
					LLL: 'D. MMMM YYYY HH:mm',
					LLLL: 'dddd, D. MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[heute um] LT [Uhr]',
					sameElse: 'L',
					nextDay: '[morgen um] LT [Uhr]',
					nextWeek: 'dddd [um] LT [Uhr]',
					lastDay: '[gestern um] LT [Uhr]',
					lastWeek: '[letzten] dddd [um] LT [Uhr]'
				},
				relativeTime: {
					future: 'in %s',
					past: 'vor %s',
					s: 'ein paar Sekunden',
					m: processRelativeTime,
					mm: '%d Minuten',
					h: processRelativeTime,
					hh: '%d Stunden',
					d: processRelativeTime,
					dd: processRelativeTime,
					M: processRelativeTime,
					MM: processRelativeTime,
					y: processRelativeTime,
					yy: processRelativeTime
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return deAt;

		})));


		/***/
	}),
	/* 26 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : German (Switzerland) [de-ch]
//! author : sschueller : https://github.com/sschueller

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


// based on: https://www.bk.admin.ch/dokumentation/sprachen/04915/05016/index.html?lang=de#

			function processRelativeTime(number, withoutSuffix, key, isFuture) {
				var format = {
					'm': ['eine Minute', 'einer Minute'],
					'h': ['eine Stunde', 'einer Stunde'],
					'd': ['ein Tag', 'einem Tag'],
					'dd': [number + ' Tage', number + ' Tagen'],
					'M': ['ein Monat', 'einem Monat'],
					'MM': [number + ' Monate', number + ' Monaten'],
					'y': ['ein Jahr', 'einem Jahr'],
					'yy': [number + ' Jahre', number + ' Jahren']
				};
				return withoutSuffix ? format[key][0] : format[key][1];
			}

			var deCh = moment.defineLocale('de-ch', {
				months: 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
				monthsShort: 'Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
				monthsParseExact: true,
				weekdays: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
				weekdaysShort: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
				weekdaysMin: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH.mm',
					LTS: 'HH.mm.ss',
					L: 'DD.MM.YYYY',
					LL: 'D. MMMM YYYY',
					LLL: 'D. MMMM YYYY HH.mm',
					LLLL: 'dddd, D. MMMM YYYY HH.mm'
				},
				calendar: {
					sameDay: '[heute um] LT [Uhr]',
					sameElse: 'L',
					nextDay: '[morgen um] LT [Uhr]',
					nextWeek: 'dddd [um] LT [Uhr]',
					lastDay: '[gestern um] LT [Uhr]',
					lastWeek: '[letzten] dddd [um] LT [Uhr]'
				},
				relativeTime: {
					future: 'in %s',
					past: 'vor %s',
					s: 'ein paar Sekunden',
					m: processRelativeTime,
					mm: '%d Minuten',
					h: processRelativeTime,
					hh: '%d Stunden',
					d: processRelativeTime,
					dd: processRelativeTime,
					M: processRelativeTime,
					MM: processRelativeTime,
					y: processRelativeTime,
					yy: processRelativeTime
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return deCh;

		})));


		/***/
	}),
	/* 27 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Maldivian [dv]
//! author : Jawish Hameed : https://github.com/jawish

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var months = [
				'ޖެނުއަރީ',
				'ފެބްރުއަރީ',
				'މާރިޗު',
				'އޭޕްރީލު',
				'މޭ',
				'ޖޫން',
				'ޖުލައި',
				'އޯގަސްޓު',
				'ސެޕްޓެމްބަރު',
				'އޮކްޓޯބަރު',
				'ނޮވެމްބަރު',
				'ޑިސެމްބަރު'
			];
			var weekdays = [
				'އާދިއްތަ',
				'ހޯމަ',
				'އަންގާރަ',
				'ބުދަ',
				'ބުރާސްފަތި',
				'ހުކުރު',
				'ހޮނިހިރު'
			];

			var dv = moment.defineLocale('dv', {
				months: months,
				monthsShort: months,
				weekdays: weekdays,
				weekdaysShort: weekdays,
				weekdaysMin: 'އާދި_ހޯމަ_އަން_ބުދަ_ބުރާ_ހުކު_ހޮނި'.split('_'),
				longDateFormat: {

					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'D/M/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D MMMM YYYY HH:mm'
				},
				meridiemParse: /މކ|މފ/,
				isPM: function (input) {
					return 'މފ' === input;
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 12) {
						return 'މކ';
					} else {
						return 'މފ';
					}
				},
				calendar: {
					sameDay: '[މިއަދު] LT',
					nextDay: '[މާދަމާ] LT',
					nextWeek: 'dddd LT',
					lastDay: '[އިއްޔެ] LT',
					lastWeek: '[ފާއިތުވި] dddd LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'ތެރޭގައި %s',
					past: 'ކުރިން %s',
					s: 'ސިކުންތުކޮޅެއް',
					m: 'މިނިޓެއް',
					mm: 'މިނިޓު %d',
					h: 'ގަޑިއިރެއް',
					hh: 'ގަޑިއިރު %d',
					d: 'ދުވަހެއް',
					dd: 'ދުވަސް %d',
					M: 'މަހެއް',
					MM: 'މަސް %d',
					y: 'އަހަރެއް',
					yy: 'އަހަރު %d'
				},
				preparse: function (string) {
					return string.replace(/،/g, ',');
				},
				postformat: function (string) {
					return string.replace(/,/g, '،');
				},
				week: {
					dow: 7,  // Sunday is the first day of the week.
					doy: 12  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return dv;

		})));


		/***/
	}),
	/* 28 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Greek [el]
//! author : Aggelos Karalias : https://github.com/mehiel

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';

			function isFunction(input) {
				return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
			}


			var el = moment.defineLocale('el', {
				monthsNominativeEl: 'Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος'.split('_'),
				monthsGenitiveEl: 'Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου'.split('_'),
				months: function (momentToFormat, format) {
					if (!momentToFormat) {
						return this._monthsNominativeEl;
					} else if (typeof format === 'string' && /D/.test(format.substring(0, format.indexOf('MMMM')))) { // if there is a day number before 'MMMM'
						return this._monthsGenitiveEl[momentToFormat.month()];
					} else {
						return this._monthsNominativeEl[momentToFormat.month()];
					}
				},
				monthsShort: 'Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ'.split('_'),
				weekdays: 'Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο'.split('_'),
				weekdaysShort: 'Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ'.split('_'),
				weekdaysMin: 'Κυ_Δε_Τρ_Τε_Πε_Πα_Σα'.split('_'),
				meridiem: function (hours, minutes, isLower) {
					if (hours > 11) {
						return isLower ? 'μμ' : 'ΜΜ';
					} else {
						return isLower ? 'πμ' : 'ΠΜ';
					}
				},
				isPM: function (input) {
					return ((input + '').toLowerCase()[0] === 'μ');
				},
				meridiemParse: /[ΠΜ]\.?Μ?\.?/i,
				longDateFormat: {
					LT: 'h:mm A',
					LTS: 'h:mm:ss A',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY h:mm A',
					LLLL: 'dddd, D MMMM YYYY h:mm A'
				},
				calendarEl: {
					sameDay: '[Σήμερα {}] LT',
					nextDay: '[Αύριο {}] LT',
					nextWeek: 'dddd [{}] LT',
					lastDay: '[Χθες {}] LT',
					lastWeek: function () {
						switch (this.day()) {
							case 6:
								return '[το προηγούμενο] dddd [{}] LT';
							default:
								return '[την προηγούμενη] dddd [{}] LT';
						}
					},
					sameElse: 'L'
				},
				calendar: function (key, mom) {
					var output = this._calendarEl[key],
						hours = mom && mom.hours();
					if (isFunction(output)) {
						output = output.apply(mom);
					}
					return output.replace('{}', (hours % 12 === 1 ? 'στη' : 'στις'));
				},
				relativeTime: {
					future: 'σε %s',
					past: '%s πριν',
					s: 'λίγα δευτερόλεπτα',
					m: 'ένα λεπτό',
					mm: '%d λεπτά',
					h: 'μία ώρα',
					hh: '%d ώρες',
					d: 'μία μέρα',
					dd: '%d μέρες',
					M: 'ένας μήνας',
					MM: '%d μήνες',
					y: 'ένας χρόνος',
					yy: '%d χρόνια'
				},
				dayOfMonthOrdinalParse: /\d{1,2}η/,
				ordinal: '%dη',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4st is the first week of the year.
				}
			});

			return el;

		})));


		/***/
	}),
	/* 29 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : English (Australia) [en-au]
//! author : Jared Morse : https://github.com/jarcoal

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var enAu = moment.defineLocale('en-au', {
				months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
				monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
				weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
				weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
				weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
				longDateFormat: {
					LT: 'h:mm A',
					LTS: 'h:mm:ss A',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY h:mm A',
					LLLL: 'dddd, D MMMM YYYY h:mm A'
				},
				calendar: {
					sameDay: '[Today at] LT',
					nextDay: '[Tomorrow at] LT',
					nextWeek: 'dddd [at] LT',
					lastDay: '[Yesterday at] LT',
					lastWeek: '[Last] dddd [at] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'in %s',
					past: '%s ago',
					s: 'a few seconds',
					m: 'a minute',
					mm: '%d minutes',
					h: 'an hour',
					hh: '%d hours',
					d: 'a day',
					dd: '%d days',
					M: 'a month',
					MM: '%d months',
					y: 'a year',
					yy: '%d years'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
				ordinal: function (number) {
					var b = number % 10,
						output = (~~(number % 100 / 10) === 1) ? 'th' :
							(b === 1) ? 'st' :
								(b === 2) ? 'nd' :
									(b === 3) ? 'rd' : 'th';
					return number + output;
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return enAu;

		})));


		/***/
	}),
	/* 30 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : English (Canada) [en-ca]
//! author : Jonathan Abourbih : https://github.com/jonbca

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var enCa = moment.defineLocale('en-ca', {
				months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
				monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
				weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
				weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
				weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
				longDateFormat: {
					LT: 'h:mm A',
					LTS: 'h:mm:ss A',
					L: 'YYYY-MM-DD',
					LL: 'MMMM D, YYYY',
					LLL: 'MMMM D, YYYY h:mm A',
					LLLL: 'dddd, MMMM D, YYYY h:mm A'
				},
				calendar: {
					sameDay: '[Today at] LT',
					nextDay: '[Tomorrow at] LT',
					nextWeek: 'dddd [at] LT',
					lastDay: '[Yesterday at] LT',
					lastWeek: '[Last] dddd [at] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'in %s',
					past: '%s ago',
					s: 'a few seconds',
					m: 'a minute',
					mm: '%d minutes',
					h: 'an hour',
					hh: '%d hours',
					d: 'a day',
					dd: '%d days',
					M: 'a month',
					MM: '%d months',
					y: 'a year',
					yy: '%d years'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
				ordinal: function (number) {
					var b = number % 10,
						output = (~~(number % 100 / 10) === 1) ? 'th' :
							(b === 1) ? 'st' :
								(b === 2) ? 'nd' :
									(b === 3) ? 'rd' : 'th';
					return number + output;
				}
			});

			return enCa;

		})));


		/***/
	}),
	/* 31 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : English (United Kingdom) [en-gb]
//! author : Chris Gedrim : https://github.com/chrisgedrim

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var enGb = moment.defineLocale('en-gb', {
				months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
				monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
				weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
				weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
				weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd, D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[Today at] LT',
					nextDay: '[Tomorrow at] LT',
					nextWeek: 'dddd [at] LT',
					lastDay: '[Yesterday at] LT',
					lastWeek: '[Last] dddd [at] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'in %s',
					past: '%s ago',
					s: 'a few seconds',
					m: 'a minute',
					mm: '%d minutes',
					h: 'an hour',
					hh: '%d hours',
					d: 'a day',
					dd: '%d days',
					M: 'a month',
					MM: '%d months',
					y: 'a year',
					yy: '%d years'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
				ordinal: function (number) {
					var b = number % 10,
						output = (~~(number % 100 / 10) === 1) ? 'th' :
							(b === 1) ? 'st' :
								(b === 2) ? 'nd' :
									(b === 3) ? 'rd' : 'th';
					return number + output;
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return enGb;

		})));


		/***/
	}),
	/* 32 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : English (Ireland) [en-ie]
//! author : Chris Cartlidge : https://github.com/chriscartlidge

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var enIe = moment.defineLocale('en-ie', {
				months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
				monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
				weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
				weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
				weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD-MM-YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[Today at] LT',
					nextDay: '[Tomorrow at] LT',
					nextWeek: 'dddd [at] LT',
					lastDay: '[Yesterday at] LT',
					lastWeek: '[Last] dddd [at] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'in %s',
					past: '%s ago',
					s: 'a few seconds',
					m: 'a minute',
					mm: '%d minutes',
					h: 'an hour',
					hh: '%d hours',
					d: 'a day',
					dd: '%d days',
					M: 'a month',
					MM: '%d months',
					y: 'a year',
					yy: '%d years'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
				ordinal: function (number) {
					var b = number % 10,
						output = (~~(number % 100 / 10) === 1) ? 'th' :
							(b === 1) ? 'st' :
								(b === 2) ? 'nd' :
									(b === 3) ? 'rd' : 'th';
					return number + output;
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return enIe;

		})));


		/***/
	}),
	/* 33 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : English (New Zealand) [en-nz]
//! author : Luke McGregor : https://github.com/lukemcgregor

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var enNz = moment.defineLocale('en-nz', {
				months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
				monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
				weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
				weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
				weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
				longDateFormat: {
					LT: 'h:mm A',
					LTS: 'h:mm:ss A',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY h:mm A',
					LLLL: 'dddd, D MMMM YYYY h:mm A'
				},
				calendar: {
					sameDay: '[Today at] LT',
					nextDay: '[Tomorrow at] LT',
					nextWeek: 'dddd [at] LT',
					lastDay: '[Yesterday at] LT',
					lastWeek: '[Last] dddd [at] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'in %s',
					past: '%s ago',
					s: 'a few seconds',
					m: 'a minute',
					mm: '%d minutes',
					h: 'an hour',
					hh: '%d hours',
					d: 'a day',
					dd: '%d days',
					M: 'a month',
					MM: '%d months',
					y: 'a year',
					yy: '%d years'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
				ordinal: function (number) {
					var b = number % 10,
						output = (~~(number % 100 / 10) === 1) ? 'th' :
							(b === 1) ? 'st' :
								(b === 2) ? 'nd' :
									(b === 3) ? 'rd' : 'th';
					return number + output;
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return enNz;

		})));


		/***/
	}),
	/* 34 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Esperanto [eo]
//! author : Colin Dean : https://github.com/colindean
//! author : Mia Nordentoft Imperatori : https://github.com/miestasmia
//! comment : miestasmia corrected the translation by colindean

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var eo = moment.defineLocale('eo', {
				months: 'januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro'.split('_'),
				monthsShort: 'jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec'.split('_'),
				weekdays: 'dimanĉo_lundo_mardo_merkredo_ĵaŭdo_vendredo_sabato'.split('_'),
				weekdaysShort: 'dim_lun_mard_merk_ĵaŭ_ven_sab'.split('_'),
				weekdaysMin: 'di_lu_ma_me_ĵa_ve_sa'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'YYYY-MM-DD',
					LL: 'D[-a de] MMMM, YYYY',
					LLL: 'D[-a de] MMMM, YYYY HH:mm',
					LLLL: 'dddd, [la] D[-a de] MMMM, YYYY HH:mm'
				},
				meridiemParse: /[ap]\.t\.m/i,
				isPM: function (input) {
					return input.charAt(0).toLowerCase() === 'p';
				},
				meridiem: function (hours, minutes, isLower) {
					if (hours > 11) {
						return isLower ? 'p.t.m.' : 'P.T.M.';
					} else {
						return isLower ? 'a.t.m.' : 'A.T.M.';
					}
				},
				calendar: {
					sameDay: '[Hodiaŭ je] LT',
					nextDay: '[Morgaŭ je] LT',
					nextWeek: 'dddd [je] LT',
					lastDay: '[Hieraŭ je] LT',
					lastWeek: '[pasinta] dddd [je] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'post %s',
					past: 'antaŭ %s',
					s: 'sekundoj',
					m: 'minuto',
					mm: '%d minutoj',
					h: 'horo',
					hh: '%d horoj',
					d: 'tago',//ne 'diurno', ĉar estas uzita por proksimumo
					dd: '%d tagoj',
					M: 'monato',
					MM: '%d monatoj',
					y: 'jaro',
					yy: '%d jaroj'
				},
				dayOfMonthOrdinalParse: /\d{1,2}a/,
				ordinal: '%da',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return eo;

		})));


		/***/
	}),
	/* 35 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Spanish [es]
//! author : Julio Napurí : https://github.com/julionc

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
			var monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

			var monthsParse = [/^ene/i, /^feb/i, /^mar/i, /^abr/i, /^may/i, /^jun/i, /^jul/i, /^ago/i, /^sep/i, /^oct/i, /^nov/i, /^dic/i];
			var monthsRegex = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;

			var es = moment.defineLocale('es', {
				months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
				monthsShort: function (m, format) {
					if (!m) {
						return monthsShortDot;
					} else if (/-MMM-/.test(format)) {
						return monthsShort[m.month()];
					} else {
						return monthsShortDot[m.month()];
					}
				},
				monthsRegex: monthsRegex,
				monthsShortRegex: monthsRegex,
				monthsStrictRegex: /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
				monthsShortStrictRegex: /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
				monthsParse: monthsParse,
				longMonthsParse: monthsParse,
				shortMonthsParse: monthsParse,
				weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
				weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
				weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'H:mm',
					LTS: 'H:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D [de] MMMM [de] YYYY',
					LLL: 'D [de] MMMM [de] YYYY H:mm',
					LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
				},
				calendar: {
					sameDay: function () {
						return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
					},
					nextDay: function () {
						return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
					},
					nextWeek: function () {
						return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
					},
					lastDay: function () {
						return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
					},
					lastWeek: function () {
						return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'en %s',
					past: 'hace %s',
					s: 'unos segundos',
					m: 'un minuto',
					mm: '%d minutos',
					h: 'una hora',
					hh: '%d horas',
					d: 'un día',
					dd: '%d días',
					M: 'un mes',
					MM: '%d meses',
					y: 'un año',
					yy: '%d años'
				},
				dayOfMonthOrdinalParse: /\d{1,2}º/,
				ordinal: '%dº',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return es;

		})));


		/***/
	}),
	/* 36 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Spanish (Dominican Republic) [es-do]

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
			var monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

			var monthsParse = [/^ene/i, /^feb/i, /^mar/i, /^abr/i, /^may/i, /^jun/i, /^jul/i, /^ago/i, /^sep/i, /^oct/i, /^nov/i, /^dic/i];
			var monthsRegex = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;

			var esDo = moment.defineLocale('es-do', {
				months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
				monthsShort: function (m, format) {
					if (!m) {
						return monthsShortDot;
					} else if (/-MMM-/.test(format)) {
						return monthsShort[m.month()];
					} else {
						return monthsShortDot[m.month()];
					}
				},
				monthsRegex: monthsRegex,
				monthsShortRegex: monthsRegex,
				monthsStrictRegex: /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
				monthsShortStrictRegex: /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
				monthsParse: monthsParse,
				longMonthsParse: monthsParse,
				shortMonthsParse: monthsParse,
				weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
				weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
				weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'h:mm A',
					LTS: 'h:mm:ss A',
					L: 'DD/MM/YYYY',
					LL: 'D [de] MMMM [de] YYYY',
					LLL: 'D [de] MMMM [de] YYYY h:mm A',
					LLLL: 'dddd, D [de] MMMM [de] YYYY h:mm A'
				},
				calendar: {
					sameDay: function () {
						return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
					},
					nextDay: function () {
						return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
					},
					nextWeek: function () {
						return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
					},
					lastDay: function () {
						return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
					},
					lastWeek: function () {
						return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'en %s',
					past: 'hace %s',
					s: 'unos segundos',
					m: 'un minuto',
					mm: '%d minutos',
					h: 'una hora',
					hh: '%d horas',
					d: 'un día',
					dd: '%d días',
					M: 'un mes',
					MM: '%d meses',
					y: 'un año',
					yy: '%d años'
				},
				dayOfMonthOrdinalParse: /\d{1,2}º/,
				ordinal: '%dº',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return esDo;

		})));


		/***/
	}),
	/* 37 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Spanish(United State) [es-us]
//! author : bustta : https://github.com/bustta

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
			var monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

			var esUs = moment.defineLocale('es-us', {
				months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
				monthsShort: function (m, format) {
					if (!m) {
						return monthsShortDot;
					} else if (/-MMM-/.test(format)) {
						return monthsShort[m.month()];
					} else {
						return monthsShortDot[m.month()];
					}
				},
				monthsParseExact: true,
				weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
				weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
				weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'H:mm',
					LTS: 'H:mm:ss',
					L: 'MM/DD/YYYY',
					LL: 'MMMM [de] D [de] YYYY',
					LLL: 'MMMM [de] D [de] YYYY H:mm',
					LLLL: 'dddd, MMMM [de] D [de] YYYY H:mm'
				},
				calendar: {
					sameDay: function () {
						return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
					},
					nextDay: function () {
						return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
					},
					nextWeek: function () {
						return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
					},
					lastDay: function () {
						return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
					},
					lastWeek: function () {
						return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'en %s',
					past: 'hace %s',
					s: 'unos segundos',
					m: 'un minuto',
					mm: '%d minutos',
					h: 'una hora',
					hh: '%d horas',
					d: 'un día',
					dd: '%d días',
					M: 'un mes',
					MM: '%d meses',
					y: 'un año',
					yy: '%d años'
				},
				dayOfMonthOrdinalParse: /\d{1,2}º/,
				ordinal: '%dº',
				week: {
					dow: 0, // Sunday is the first day of the week.
					doy: 6  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return esUs;

		})));


		/***/
	}),
	/* 38 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Estonian [et]
//! author : Henry Kehlmann : https://github.com/madhenry
//! improvements : Illimar Tambek : https://github.com/ragulka

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			function processRelativeTime(number, withoutSuffix, key, isFuture) {
				var format = {
					's': ['mõne sekundi', 'mõni sekund', 'paar sekundit'],
					'm': ['ühe minuti', 'üks minut'],
					'mm': [number + ' minuti', number + ' minutit'],
					'h': ['ühe tunni', 'tund aega', 'üks tund'],
					'hh': [number + ' tunni', number + ' tundi'],
					'd': ['ühe päeva', 'üks päev'],
					'M': ['kuu aja', 'kuu aega', 'üks kuu'],
					'MM': [number + ' kuu', number + ' kuud'],
					'y': ['ühe aasta', 'aasta', 'üks aasta'],
					'yy': [number + ' aasta', number + ' aastat']
				};
				if (withoutSuffix) {
					return format[key][2] ? format[key][2] : format[key][1];
				}
				return isFuture ? format[key][0] : format[key][1];
			}

			var et = moment.defineLocale('et', {
				months: 'jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember'.split('_'),
				monthsShort: 'jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets'.split('_'),
				weekdays: 'pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev'.split('_'),
				weekdaysShort: 'P_E_T_K_N_R_L'.split('_'),
				weekdaysMin: 'P_E_T_K_N_R_L'.split('_'),
				longDateFormat: {
					LT: 'H:mm',
					LTS: 'H:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D. MMMM YYYY',
					LLL: 'D. MMMM YYYY H:mm',
					LLLL: 'dddd, D. MMMM YYYY H:mm'
				},
				calendar: {
					sameDay: '[Täna,] LT',
					nextDay: '[Homme,] LT',
					nextWeek: '[Järgmine] dddd LT',
					lastDay: '[Eile,] LT',
					lastWeek: '[Eelmine] dddd LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s pärast',
					past: '%s tagasi',
					s: processRelativeTime,
					m: processRelativeTime,
					mm: processRelativeTime,
					h: processRelativeTime,
					hh: processRelativeTime,
					d: processRelativeTime,
					dd: '%d päeva',
					M: processRelativeTime,
					MM: processRelativeTime,
					y: processRelativeTime,
					yy: processRelativeTime
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return et;

		})));


		/***/
	}),
	/* 39 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Basque [eu]
//! author : Eneko Illarramendi : https://github.com/eillarra

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var eu = moment.defineLocale('eu', {
				months: 'urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua'.split('_'),
				monthsShort: 'urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.'.split('_'),
				monthsParseExact: true,
				weekdays: 'igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata'.split('_'),
				weekdaysShort: 'ig._al._ar._az._og._ol._lr.'.split('_'),
				weekdaysMin: 'ig_al_ar_az_og_ol_lr'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'YYYY-MM-DD',
					LL: 'YYYY[ko] MMMM[ren] D[a]',
					LLL: 'YYYY[ko] MMMM[ren] D[a] HH:mm',
					LLLL: 'dddd, YYYY[ko] MMMM[ren] D[a] HH:mm',
					l: 'YYYY-M-D',
					ll: 'YYYY[ko] MMM D[a]',
					lll: 'YYYY[ko] MMM D[a] HH:mm',
					llll: 'ddd, YYYY[ko] MMM D[a] HH:mm'
				},
				calendar: {
					sameDay: '[gaur] LT[etan]',
					nextDay: '[bihar] LT[etan]',
					nextWeek: 'dddd LT[etan]',
					lastDay: '[atzo] LT[etan]',
					lastWeek: '[aurreko] dddd LT[etan]',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s barru',
					past: 'duela %s',
					s: 'segundo batzuk',
					m: 'minutu bat',
					mm: '%d minutu',
					h: 'ordu bat',
					hh: '%d ordu',
					d: 'egun bat',
					dd: '%d egun',
					M: 'hilabete bat',
					MM: '%d hilabete',
					y: 'urte bat',
					yy: '%d urte'
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return eu;

		})));


		/***/
	}),
	/* 40 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Persian [fa]
//! author : Ebrahim Byagowi : https://github.com/ebraminio

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var symbolMap = {
				'1': '۱',
				'2': '۲',
				'3': '۳',
				'4': '۴',
				'5': '۵',
				'6': '۶',
				'7': '۷',
				'8': '۸',
				'9': '۹',
				'0': '۰'
			};
			var numberMap = {
				'۱': '1',
				'۲': '2',
				'۳': '3',
				'۴': '4',
				'۵': '5',
				'۶': '6',
				'۷': '7',
				'۸': '8',
				'۹': '9',
				'۰': '0'
			};

			var fa = moment.defineLocale('fa', {
				months: 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
				monthsShort: 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
				weekdays: 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
				weekdaysShort: 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
				weekdaysMin: 'ی_د_س_چ_پ_ج_ش'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd, D MMMM YYYY HH:mm'
				},
				meridiemParse: /قبل از ظهر|بعد از ظهر/,
				isPM: function (input) {
					return /بعد از ظهر/.test(input);
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 12) {
						return 'قبل از ظهر';
					} else {
						return 'بعد از ظهر';
					}
				},
				calendar: {
					sameDay: '[امروز ساعت] LT',
					nextDay: '[فردا ساعت] LT',
					nextWeek: 'dddd [ساعت] LT',
					lastDay: '[دیروز ساعت] LT',
					lastWeek: 'dddd [پیش] [ساعت] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'در %s',
					past: '%s پیش',
					s: 'چند ثانیه',
					m: 'یک دقیقه',
					mm: '%d دقیقه',
					h: 'یک ساعت',
					hh: '%d ساعت',
					d: 'یک روز',
					dd: '%d روز',
					M: 'یک ماه',
					MM: '%d ماه',
					y: 'یک سال',
					yy: '%d سال'
				},
				preparse: function (string) {
					return string.replace(/[۰-۹]/g, function (match) {
						return numberMap[match];
					}).replace(/،/g, ',');
				},
				postformat: function (string) {
					return string.replace(/\d/g, function (match) {
						return symbolMap[match];
					}).replace(/,/g, '،');
				},
				dayOfMonthOrdinalParse: /\d{1,2}م/,
				ordinal: '%dم',
				week: {
					dow: 6, // Saturday is the first day of the week.
					doy: 12 // The week that contains Jan 1st is the first week of the year.
				}
			});

			return fa;

		})));


		/***/
	}),
	/* 41 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Finnish [fi]
//! author : Tarmo Aidantausta : https://github.com/bleadof

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var numbersPast = 'nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän'.split(' ');
			var numbersFuture = [
				'nolla', 'yhden', 'kahden', 'kolmen', 'neljän', 'viiden', 'kuuden',
				numbersPast[7], numbersPast[8], numbersPast[9]
			];

			function translate(number, withoutSuffix, key, isFuture) {
				var result = '';
				switch (key) {
					case 's':
						return isFuture ? 'muutaman sekunnin' : 'muutama sekunti';
					case 'm':
						return isFuture ? 'minuutin' : 'minuutti';
					case 'mm':
						result = isFuture ? 'minuutin' : 'minuuttia';
						break;
					case 'h':
						return isFuture ? 'tunnin' : 'tunti';
					case 'hh':
						result = isFuture ? 'tunnin' : 'tuntia';
						break;
					case 'd':
						return isFuture ? 'päivän' : 'päivä';
					case 'dd':
						result = isFuture ? 'päivän' : 'päivää';
						break;
					case 'M':
						return isFuture ? 'kuukauden' : 'kuukausi';
					case 'MM':
						result = isFuture ? 'kuukauden' : 'kuukautta';
						break;
					case 'y':
						return isFuture ? 'vuoden' : 'vuosi';
					case 'yy':
						result = isFuture ? 'vuoden' : 'vuotta';
						break;
				}
				result = verbalNumber(number, isFuture) + ' ' + result;
				return result;
			}

			function verbalNumber(number, isFuture) {
				return number < 10 ? (isFuture ? numbersFuture[number] : numbersPast[number]) : number;
			}

			var fi = moment.defineLocale('fi', {
				months: 'tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu'.split('_'),
				monthsShort: 'tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu'.split('_'),
				weekdays: 'sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai'.split('_'),
				weekdaysShort: 'su_ma_ti_ke_to_pe_la'.split('_'),
				weekdaysMin: 'su_ma_ti_ke_to_pe_la'.split('_'),
				longDateFormat: {
					LT: 'HH.mm',
					LTS: 'HH.mm.ss',
					L: 'DD.MM.YYYY',
					LL: 'Do MMMM[ta] YYYY',
					LLL: 'Do MMMM[ta] YYYY, [klo] HH.mm',
					LLLL: 'dddd, Do MMMM[ta] YYYY, [klo] HH.mm',
					l: 'D.M.YYYY',
					ll: 'Do MMM YYYY',
					lll: 'Do MMM YYYY, [klo] HH.mm',
					llll: 'ddd, Do MMM YYYY, [klo] HH.mm'
				},
				calendar: {
					sameDay: '[tänään] [klo] LT',
					nextDay: '[huomenna] [klo] LT',
					nextWeek: 'dddd [klo] LT',
					lastDay: '[eilen] [klo] LT',
					lastWeek: '[viime] dddd[na] [klo] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s päästä',
					past: '%s sitten',
					s: translate,
					m: translate,
					mm: translate,
					h: translate,
					hh: translate,
					d: translate,
					dd: translate,
					M: translate,
					MM: translate,
					y: translate,
					yy: translate
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return fi;

		})));


		/***/
	}),
	/* 42 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Faroese [fo]
//! author : Ragnar Johannesen : https://github.com/ragnar123

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var fo = moment.defineLocale('fo', {
				months: 'januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
				monthsShort: 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
				weekdays: 'sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur'.split('_'),
				weekdaysShort: 'sun_mán_týs_mik_hós_frí_ley'.split('_'),
				weekdaysMin: 'su_má_tý_mi_hó_fr_le'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D. MMMM, YYYY HH:mm'
				},
				calendar: {
					sameDay: '[Í dag kl.] LT',
					nextDay: '[Í morgin kl.] LT',
					nextWeek: 'dddd [kl.] LT',
					lastDay: '[Í gjár kl.] LT',
					lastWeek: '[síðstu] dddd [kl] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'um %s',
					past: '%s síðani',
					s: 'fá sekund',
					m: 'ein minutt',
					mm: '%d minuttir',
					h: 'ein tími',
					hh: '%d tímar',
					d: 'ein dagur',
					dd: '%d dagar',
					M: 'ein mánaði',
					MM: '%d mánaðir',
					y: 'eitt ár',
					yy: '%d ár'
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return fo;

		})));


		/***/
	}),
	/* 43 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : French [fr]
//! author : John Fischer : https://github.com/jfroffice

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var fr = moment.defineLocale('fr', {
				months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
				monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
				monthsParseExact: true,
				weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
				weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
				weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[Aujourd’hui à] LT',
					nextDay: '[Demain à] LT',
					nextWeek: 'dddd [à] LT',
					lastDay: '[Hier à] LT',
					lastWeek: 'dddd [dernier à] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'dans %s',
					past: 'il y a %s',
					s: 'quelques secondes',
					m: 'une minute',
					mm: '%d minutes',
					h: 'une heure',
					hh: '%d heures',
					d: 'un jour',
					dd: '%d jours',
					M: 'un mois',
					MM: '%d mois',
					y: 'un an',
					yy: '%d ans'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(er|)/,
				ordinal: function (number, period) {
					switch (period) {
						// TODO: Return 'e' when day of month > 1. Move this case inside
						// block for masculine words below.
						// See https://github.com/moment/moment/issues/3375
						case 'D':
							return number + (number === 1 ? 'er' : '');

						// Words with masculine grammatical gender: mois, trimestre, jour
						default:
						case 'M':
						case 'Q':
						case 'DDD':
						case 'd':
							return number + (number === 1 ? 'er' : 'e');

						// Words with feminine grammatical gender: semaine
						case 'w':
						case 'W':
							return number + (number === 1 ? 're' : 'e');
					}
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return fr;

		})));


		/***/
	}),
	/* 44 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : French (Canada) [fr-ca]
//! author : Jonathan Abourbih : https://github.com/jonbca

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var frCa = moment.defineLocale('fr-ca', {
				months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
				monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
				monthsParseExact: true,
				weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
				weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
				weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'YYYY-MM-DD',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[Aujourd’hui à] LT',
					nextDay: '[Demain à] LT',
					nextWeek: 'dddd [à] LT',
					lastDay: '[Hier à] LT',
					lastWeek: 'dddd [dernier à] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'dans %s',
					past: 'il y a %s',
					s: 'quelques secondes',
					m: 'une minute',
					mm: '%d minutes',
					h: 'une heure',
					hh: '%d heures',
					d: 'un jour',
					dd: '%d jours',
					M: 'un mois',
					MM: '%d mois',
					y: 'un an',
					yy: '%d ans'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
				ordinal: function (number, period) {
					switch (period) {
						// Words with masculine grammatical gender: mois, trimestre, jour
						default:
						case 'M':
						case 'Q':
						case 'D':
						case 'DDD':
						case 'd':
							return number + (number === 1 ? 'er' : 'e');

						// Words with feminine grammatical gender: semaine
						case 'w':
						case 'W':
							return number + (number === 1 ? 're' : 'e');
					}
				}
			});

			return frCa;

		})));


		/***/
	}),
	/* 45 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : French (Switzerland) [fr-ch]
//! author : Gaspard Bucher : https://github.com/gaspard

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var frCh = moment.defineLocale('fr-ch', {
				months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
				monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
				monthsParseExact: true,
				weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
				weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
				weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[Aujourd’hui à] LT',
					nextDay: '[Demain à] LT',
					nextWeek: 'dddd [à] LT',
					lastDay: '[Hier à] LT',
					lastWeek: 'dddd [dernier à] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'dans %s',
					past: 'il y a %s',
					s: 'quelques secondes',
					m: 'une minute',
					mm: '%d minutes',
					h: 'une heure',
					hh: '%d heures',
					d: 'un jour',
					dd: '%d jours',
					M: 'un mois',
					MM: '%d mois',
					y: 'un an',
					yy: '%d ans'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
				ordinal: function (number, period) {
					switch (period) {
						// Words with masculine grammatical gender: mois, trimestre, jour
						default:
						case 'M':
						case 'Q':
						case 'D':
						case 'DDD':
						case 'd':
							return number + (number === 1 ? 'er' : 'e');

						// Words with feminine grammatical gender: semaine
						case 'w':
						case 'W':
							return number + (number === 1 ? 're' : 'e');
					}
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return frCh;

		})));


		/***/
	}),
	/* 46 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Frisian [fy]
//! author : Robin van der Vliet : https://github.com/robin0van0der0v

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var monthsShortWithDots = 'jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.'.split('_');
			var monthsShortWithoutDots = 'jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_');

			var fy = moment.defineLocale('fy', {
				months: 'jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber'.split('_'),
				monthsShort: function (m, format) {
					if (!m) {
						return monthsShortWithDots;
					} else if (/-MMM-/.test(format)) {
						return monthsShortWithoutDots[m.month()];
					} else {
						return monthsShortWithDots[m.month()];
					}
				},
				monthsParseExact: true,
				weekdays: 'snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon'.split('_'),
				weekdaysShort: 'si._mo._ti._wo._to._fr._so.'.split('_'),
				weekdaysMin: 'Si_Mo_Ti_Wo_To_Fr_So'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD-MM-YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[hjoed om] LT',
					nextDay: '[moarn om] LT',
					nextWeek: 'dddd [om] LT',
					lastDay: '[juster om] LT',
					lastWeek: '[ôfrûne] dddd [om] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'oer %s',
					past: '%s lyn',
					s: 'in pear sekonden',
					m: 'ien minút',
					mm: '%d minuten',
					h: 'ien oere',
					hh: '%d oeren',
					d: 'ien dei',
					dd: '%d dagen',
					M: 'ien moanne',
					MM: '%d moannen',
					y: 'ien jier',
					yy: '%d jierren'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
				ordinal: function (number) {
					return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return fy;

		})));


		/***/
	}),
	/* 47 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Scottish Gaelic [gd]
//! author : Jon Ashdown : https://github.com/jonashdown

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var months = [
				'Am Faoilleach', 'An Gearran', 'Am Màrt', 'An Giblean', 'An Cèitean', 'An t-Ògmhios', 'An t-Iuchar', 'An Lùnastal', 'An t-Sultain', 'An Dàmhair', 'An t-Samhain', 'An Dùbhlachd'
			];

			var monthsShort = ['Faoi', 'Gear', 'Màrt', 'Gibl', 'Cèit', 'Ògmh', 'Iuch', 'Lùn', 'Sult', 'Dàmh', 'Samh', 'Dùbh'];

			var weekdays = ['Didòmhnaich', 'Diluain', 'Dimàirt', 'Diciadain', 'Diardaoin', 'Dihaoine', 'Disathairne'];

			var weekdaysShort = ['Did', 'Dil', 'Dim', 'Dic', 'Dia', 'Dih', 'Dis'];

			var weekdaysMin = ['Dò', 'Lu', 'Mà', 'Ci', 'Ar', 'Ha', 'Sa'];

			var gd = moment.defineLocale('gd', {
				months: months,
				monthsShort: monthsShort,
				monthsParseExact: true,
				weekdays: weekdays,
				weekdaysShort: weekdaysShort,
				weekdaysMin: weekdaysMin,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd, D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[An-diugh aig] LT',
					nextDay: '[A-màireach aig] LT',
					nextWeek: 'dddd [aig] LT',
					lastDay: '[An-dè aig] LT',
					lastWeek: 'dddd [seo chaidh] [aig] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'ann an %s',
					past: 'bho chionn %s',
					s: 'beagan diogan',
					m: 'mionaid',
					mm: '%d mionaidean',
					h: 'uair',
					hh: '%d uairean',
					d: 'latha',
					dd: '%d latha',
					M: 'mìos',
					MM: '%d mìosan',
					y: 'bliadhna',
					yy: '%d bliadhna'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(d|na|mh)/,
				ordinal: function (number) {
					var output = number === 1 ? 'd' : number % 10 === 2 ? 'na' : 'mh';
					return number + output;
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return gd;

		})));


		/***/
	}),
	/* 48 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Galician [gl]
//! author : Juan G. Hurtado : https://github.com/juanghurtado

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var gl = moment.defineLocale('gl', {
				months: 'xaneiro_febreiro_marzo_abril_maio_xuño_xullo_agosto_setembro_outubro_novembro_decembro'.split('_'),
				monthsShort: 'xan._feb._mar._abr._mai._xuñ._xul._ago._set._out._nov._dec.'.split('_'),
				monthsParseExact: true,
				weekdays: 'domingo_luns_martes_mércores_xoves_venres_sábado'.split('_'),
				weekdaysShort: 'dom._lun._mar._mér._xov._ven._sáb.'.split('_'),
				weekdaysMin: 'do_lu_ma_mé_xo_ve_sá'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'H:mm',
					LTS: 'H:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D [de] MMMM [de] YYYY',
					LLL: 'D [de] MMMM [de] YYYY H:mm',
					LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
				},
				calendar: {
					sameDay: function () {
						return '[hoxe ' + ((this.hours() !== 1) ? 'ás' : 'á') + '] LT';
					},
					nextDay: function () {
						return '[mañá ' + ((this.hours() !== 1) ? 'ás' : 'á') + '] LT';
					},
					nextWeek: function () {
						return 'dddd [' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
					},
					lastDay: function () {
						return '[onte ' + ((this.hours() !== 1) ? 'á' : 'a') + '] LT';
					},
					lastWeek: function () {
						return '[o] dddd [pasado ' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: function (str) {
						if (str.indexOf('un') === 0) {
							return 'n' + str;
						}
						return 'en ' + str;
					},
					past: 'hai %s',
					s: 'uns segundos',
					m: 'un minuto',
					mm: '%d minutos',
					h: 'unha hora',
					hh: '%d horas',
					d: 'un día',
					dd: '%d días',
					M: 'un mes',
					MM: '%d meses',
					y: 'un ano',
					yy: '%d anos'
				},
				dayOfMonthOrdinalParse: /\d{1,2}º/,
				ordinal: '%dº',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return gl;

		})));


		/***/
	}),
	/* 49 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Konkani Latin script [gom-latn]
//! author : The Discoverer : https://github.com/WikiDiscoverer

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			function processRelativeTime(number, withoutSuffix, key, isFuture) {
				var format = {
					's': ['thodde secondanim', 'thodde second'],
					'm': ['eka mintan', 'ek minute'],
					'mm': [number + ' mintanim', number + ' mintam'],
					'h': ['eka horan', 'ek hor'],
					'hh': [number + ' horanim', number + ' hor'],
					'd': ['eka disan', 'ek dis'],
					'dd': [number + ' disanim', number + ' dis'],
					'M': ['eka mhoinean', 'ek mhoino'],
					'MM': [number + ' mhoineanim', number + ' mhoine'],
					'y': ['eka vorsan', 'ek voros'],
					'yy': [number + ' vorsanim', number + ' vorsam']
				};
				return withoutSuffix ? format[key][0] : format[key][1];
			}

			var gomLatn = moment.defineLocale('gom-latn', {
				months: 'Janer_Febrer_Mars_Abril_Mai_Jun_Julai_Agost_Setembr_Otubr_Novembr_Dezembr'.split('_'),
				monthsShort: 'Jan._Feb._Mars_Abr._Mai_Jun_Jul._Ago._Set._Otu._Nov._Dez.'.split('_'),
				monthsParseExact: true,
				weekdays: 'Aitar_Somar_Mongllar_Budvar_Brestar_Sukrar_Son\'var'.split('_'),
				weekdaysShort: 'Ait._Som._Mon._Bud._Bre._Suk._Son.'.split('_'),
				weekdaysMin: 'Ai_Sm_Mo_Bu_Br_Su_Sn'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'A h:mm [vazta]',
					LTS: 'A h:mm:ss [vazta]',
					L: 'DD-MM-YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY A h:mm [vazta]',
					LLLL: 'dddd, MMMM[achea] Do, YYYY, A h:mm [vazta]',
					llll: 'ddd, D MMM YYYY, A h:mm [vazta]'
				},
				calendar: {
					sameDay: '[Aiz] LT',
					nextDay: '[Faleam] LT',
					nextWeek: '[Ieta to] dddd[,] LT',
					lastDay: '[Kal] LT',
					lastWeek: '[Fatlo] dddd[,] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s',
					past: '%s adim',
					s: processRelativeTime,
					m: processRelativeTime,
					mm: processRelativeTime,
					h: processRelativeTime,
					hh: processRelativeTime,
					d: processRelativeTime,
					dd: processRelativeTime,
					M: processRelativeTime,
					MM: processRelativeTime,
					y: processRelativeTime,
					yy: processRelativeTime
				},
				dayOfMonthOrdinalParse: /\d{1,2}(er)/,
				ordinal: function (number, period) {
					switch (period) {
						// the ordinal 'er' only applies to day of the month
						case 'D':
							return number + 'er';
						default:
						case 'M':
						case 'Q':
						case 'DDD':
						case 'd':
						case 'w':
						case 'W':
							return number;
					}
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				},
				meridiemParse: /rati|sokalli|donparam|sanje/,
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if (meridiem === 'rati') {
						return hour < 4 ? hour : hour + 12;
					} else if (meridiem === 'sokalli') {
						return hour;
					} else if (meridiem === 'donparam') {
						return hour > 12 ? hour : hour + 12;
					} else if (meridiem === 'sanje') {
						return hour + 12;
					}
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 4) {
						return 'rati';
					} else if (hour < 12) {
						return 'sokalli';
					} else if (hour < 16) {
						return 'donparam';
					} else if (hour < 20) {
						return 'sanje';
					} else {
						return 'rati';
					}
				}
			});

			return gomLatn;

		})));


		/***/
	}),
	/* 50 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Gujarati [gu]
//! author : Kaushik Thanki : https://github.com/Kaushik1987

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var symbolMap = {
				'1': '૧',
				'2': '૨',
				'3': '૩',
				'4': '૪',
				'5': '૫',
				'6': '૬',
				'7': '૭',
				'8': '૮',
				'9': '૯',
				'0': '૦'
			};
			var numberMap = {
				'૧': '1',
				'૨': '2',
				'૩': '3',
				'૪': '4',
				'૫': '5',
				'૬': '6',
				'૭': '7',
				'૮': '8',
				'૯': '9',
				'૦': '0'
			};

			var gu = moment.defineLocale('gu', {
				months: 'જાન્યુઆરી_ફેબ્રુઆરી_માર્ચ_એપ્રિલ_મે_જૂન_જુલાઈ_ઑગસ્ટ_સપ્ટેમ્બર_ઑક્ટ્બર_નવેમ્બર_ડિસેમ્બર'.split('_'),
				monthsShort: 'જાન્યુ._ફેબ્રુ._માર્ચ_એપ્રિ._મે_જૂન_જુલા._ઑગ._સપ્ટે._ઑક્ટ્._નવે._ડિસે.'.split('_'),
				monthsParseExact: true,
				weekdays: 'રવિવાર_સોમવાર_મંગળવાર_બુધ્વાર_ગુરુવાર_શુક્રવાર_શનિવાર'.split('_'),
				weekdaysShort: 'રવિ_સોમ_મંગળ_બુધ્_ગુરુ_શુક્ર_શનિ'.split('_'),
				weekdaysMin: 'ર_સો_મં_બુ_ગુ_શુ_શ'.split('_'),
				longDateFormat: {
					LT: 'A h:mm વાગ્યે',
					LTS: 'A h:mm:ss વાગ્યે',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY, A h:mm વાગ્યે',
					LLLL: 'dddd, D MMMM YYYY, A h:mm વાગ્યે'
				},
				calendar: {
					sameDay: '[આજ] LT',
					nextDay: '[કાલે] LT',
					nextWeek: 'dddd, LT',
					lastDay: '[ગઇકાલે] LT',
					lastWeek: '[પાછલા] dddd, LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s મા',
					past: '%s પેહલા',
					s: 'અમુક પળો',
					m: 'એક મિનિટ',
					mm: '%d મિનિટ',
					h: 'એક કલાક',
					hh: '%d કલાક',
					d: 'એક દિવસ',
					dd: '%d દિવસ',
					M: 'એક મહિનો',
					MM: '%d મહિનો',
					y: 'એક વર્ષ',
					yy: '%d વર્ષ'
				},
				preparse: function (string) {
					return string.replace(/[૧૨૩૪૫૬૭૮૯૦]/g, function (match) {
						return numberMap[match];
					});
				},
				postformat: function (string) {
					return string.replace(/\d/g, function (match) {
						return symbolMap[match];
					});
				},
				// Gujarati notation for meridiems are quite fuzzy in practice. While there exists
				// a rigid notion of a 'Pahar' it is not used as rigidly in modern Gujarati.
				meridiemParse: /રાત|બપોર|સવાર|સાંજ/,
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if (meridiem === 'રાત') {
						return hour < 4 ? hour : hour + 12;
					} else if (meridiem === 'સવાર') {
						return hour;
					} else if (meridiem === 'બપોર') {
						return hour >= 10 ? hour : hour + 12;
					} else if (meridiem === 'સાંજ') {
						return hour + 12;
					}
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 4) {
						return 'રાત';
					} else if (hour < 10) {
						return 'સવાર';
					} else if (hour < 17) {
						return 'બપોર';
					} else if (hour < 20) {
						return 'સાંજ';
					} else {
						return 'રાત';
					}
				},
				week: {
					dow: 0, // Sunday is the first day of the week.
					doy: 6 // The week that contains Jan 1st is the first week of the year.
				}
			});

			return gu;

		})));


		/***/
	}),
	/* 51 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Hebrew [he]
//! author : Tomer Cohen : https://github.com/tomer
//! author : Moshe Simantov : https://github.com/DevelopmentIL
//! author : Tal Ater : https://github.com/TalAter

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var he = moment.defineLocale('he', {
				months: 'ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר'.split('_'),
				monthsShort: 'ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳'.split('_'),
				weekdays: 'ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת'.split('_'),
				weekdaysShort: 'א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳'.split('_'),
				weekdaysMin: 'א_ב_ג_ד_ה_ו_ש'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D [ב]MMMM YYYY',
					LLL: 'D [ב]MMMM YYYY HH:mm',
					LLLL: 'dddd, D [ב]MMMM YYYY HH:mm',
					l: 'D/M/YYYY',
					ll: 'D MMM YYYY',
					lll: 'D MMM YYYY HH:mm',
					llll: 'ddd, D MMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[היום ב־]LT',
					nextDay: '[מחר ב־]LT',
					nextWeek: 'dddd [בשעה] LT',
					lastDay: '[אתמול ב־]LT',
					lastWeek: '[ביום] dddd [האחרון בשעה] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'בעוד %s',
					past: 'לפני %s',
					s: 'מספר שניות',
					m: 'דקה',
					mm: '%d דקות',
					h: 'שעה',
					hh: function (number) {
						if (number === 2) {
							return 'שעתיים';
						}
						return number + ' שעות';
					},
					d: 'יום',
					dd: function (number) {
						if (number === 2) {
							return 'יומיים';
						}
						return number + ' ימים';
					},
					M: 'חודש',
					MM: function (number) {
						if (number === 2) {
							return 'חודשיים';
						}
						return number + ' חודשים';
					},
					y: 'שנה',
					yy: function (number) {
						if (number === 2) {
							return 'שנתיים';
						} else if (number % 10 === 0 && number !== 10) {
							return number + ' שנה';
						}
						return number + ' שנים';
					}
				},
				meridiemParse: /אחה"צ|לפנה"צ|אחרי הצהריים|לפני הצהריים|לפנות בוקר|בבוקר|בערב/i,
				isPM: function (input) {
					return /^(אחה"צ|אחרי הצהריים|בערב)$/.test(input);
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 5) {
						return 'לפנות בוקר';
					} else if (hour < 10) {
						return 'בבוקר';
					} else if (hour < 12) {
						return isLower ? 'לפנה"צ' : 'לפני הצהריים';
					} else if (hour < 18) {
						return isLower ? 'אחה"צ' : 'אחרי הצהריים';
					} else {
						return 'בערב';
					}
				}
			});

			return he;

		})));


		/***/
	}),
	/* 52 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Hindi [hi]
//! author : Mayank Singhal : https://github.com/mayanksinghal

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var symbolMap = {
				'1': '१',
				'2': '२',
				'3': '३',
				'4': '४',
				'5': '५',
				'6': '६',
				'7': '७',
				'8': '८',
				'9': '९',
				'0': '०'
			};
			var numberMap = {
				'१': '1',
				'२': '2',
				'३': '3',
				'४': '4',
				'५': '5',
				'६': '6',
				'७': '7',
				'८': '8',
				'९': '9',
				'०': '0'
			};

			var hi = moment.defineLocale('hi', {
				months: 'जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर'.split('_'),
				monthsShort: 'जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.'.split('_'),
				monthsParseExact: true,
				weekdays: 'रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
				weekdaysShort: 'रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि'.split('_'),
				weekdaysMin: 'र_सो_मं_बु_गु_शु_श'.split('_'),
				longDateFormat: {
					LT: 'A h:mm बजे',
					LTS: 'A h:mm:ss बजे',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY, A h:mm बजे',
					LLLL: 'dddd, D MMMM YYYY, A h:mm बजे'
				},
				calendar: {
					sameDay: '[आज] LT',
					nextDay: '[कल] LT',
					nextWeek: 'dddd, LT',
					lastDay: '[कल] LT',
					lastWeek: '[पिछले] dddd, LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s में',
					past: '%s पहले',
					s: 'कुछ ही क्षण',
					m: 'एक मिनट',
					mm: '%d मिनट',
					h: 'एक घंटा',
					hh: '%d घंटे',
					d: 'एक दिन',
					dd: '%d दिन',
					M: 'एक महीने',
					MM: '%d महीने',
					y: 'एक वर्ष',
					yy: '%d वर्ष'
				},
				preparse: function (string) {
					return string.replace(/[१२३४५६७८९०]/g, function (match) {
						return numberMap[match];
					});
				},
				postformat: function (string) {
					return string.replace(/\d/g, function (match) {
						return symbolMap[match];
					});
				},
				// Hindi notation for meridiems are quite fuzzy in practice. While there exists
				// a rigid notion of a 'Pahar' it is not used as rigidly in modern Hindi.
				meridiemParse: /रात|सुबह|दोपहर|शाम/,
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if (meridiem === 'रात') {
						return hour < 4 ? hour : hour + 12;
					} else if (meridiem === 'सुबह') {
						return hour;
					} else if (meridiem === 'दोपहर') {
						return hour >= 10 ? hour : hour + 12;
					} else if (meridiem === 'शाम') {
						return hour + 12;
					}
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 4) {
						return 'रात';
					} else if (hour < 10) {
						return 'सुबह';
					} else if (hour < 17) {
						return 'दोपहर';
					} else if (hour < 20) {
						return 'शाम';
					} else {
						return 'रात';
					}
				},
				week: {
					dow: 0, // Sunday is the first day of the week.
					doy: 6  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return hi;

		})));


		/***/
	}),
	/* 53 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Croatian [hr]
//! author : Bojan Marković : https://github.com/bmarkovic

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			function translate(number, withoutSuffix, key) {
				var result = number + ' ';
				switch (key) {
					case 'm':
						return withoutSuffix ? 'jedna minuta' : 'jedne minute';
					case 'mm':
						if (number === 1) {
							result += 'minuta';
						} else if (number === 2 || number === 3 || number === 4) {
							result += 'minute';
						} else {
							result += 'minuta';
						}
						return result;
					case 'h':
						return withoutSuffix ? 'jedan sat' : 'jednog sata';
					case 'hh':
						if (number === 1) {
							result += 'sat';
						} else if (number === 2 || number === 3 || number === 4) {
							result += 'sata';
						} else {
							result += 'sati';
						}
						return result;
					case 'dd':
						if (number === 1) {
							result += 'dan';
						} else {
							result += 'dana';
						}
						return result;
					case 'MM':
						if (number === 1) {
							result += 'mjesec';
						} else if (number === 2 || number === 3 || number === 4) {
							result += 'mjeseca';
						} else {
							result += 'mjeseci';
						}
						return result;
					case 'yy':
						if (number === 1) {
							result += 'godina';
						} else if (number === 2 || number === 3 || number === 4) {
							result += 'godine';
						} else {
							result += 'godina';
						}
						return result;
				}
			}

			var hr = moment.defineLocale('hr', {
				months: {
					format: 'siječnja_veljače_ožujka_travnja_svibnja_lipnja_srpnja_kolovoza_rujna_listopada_studenoga_prosinca'.split('_'),
					standalone: 'siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac'.split('_')
				},
				monthsShort: 'sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.'.split('_'),
				monthsParseExact: true,
				weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
				weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
				weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'H:mm',
					LTS: 'H:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D. MMMM YYYY',
					LLL: 'D. MMMM YYYY H:mm',
					LLLL: 'dddd, D. MMMM YYYY H:mm'
				},
				calendar: {
					sameDay: '[danas u] LT',
					nextDay: '[sutra u] LT',
					nextWeek: function () {
						switch (this.day()) {
							case 0:
								return '[u] [nedjelju] [u] LT';
							case 3:
								return '[u] [srijedu] [u] LT';
							case 6:
								return '[u] [subotu] [u] LT';
							case 1:
							case 2:
							case 4:
							case 5:
								return '[u] dddd [u] LT';
						}
					},
					lastDay: '[jučer u] LT',
					lastWeek: function () {
						switch (this.day()) {
							case 0:
							case 3:
								return '[prošlu] dddd [u] LT';
							case 6:
								return '[prošle] [subote] [u] LT';
							case 1:
							case 2:
							case 4:
							case 5:
								return '[prošli] dddd [u] LT';
						}
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'za %s',
					past: 'prije %s',
					s: 'par sekundi',
					m: translate,
					mm: translate,
					h: translate,
					hh: translate,
					d: 'dan',
					dd: translate,
					M: 'mjesec',
					MM: translate,
					y: 'godinu',
					yy: translate
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return hr;

		})));


		/***/
	}),
	/* 54 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Hungarian [hu]
//! author : Adam Brunner : https://github.com/adambrunner

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var weekEndings = 'vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton'.split(' ');

			function translate(number, withoutSuffix, key, isFuture) {
				var num = number,
					suffix;
				switch (key) {
					case 's':
						return (isFuture || withoutSuffix) ? 'néhány másodperc' : 'néhány másodperce';
					case 'm':
						return 'egy' + (isFuture || withoutSuffix ? ' perc' : ' perce');
					case 'mm':
						return num + (isFuture || withoutSuffix ? ' perc' : ' perce');
					case 'h':
						return 'egy' + (isFuture || withoutSuffix ? ' óra' : ' órája');
					case 'hh':
						return num + (isFuture || withoutSuffix ? ' óra' : ' órája');
					case 'd':
						return 'egy' + (isFuture || withoutSuffix ? ' nap' : ' napja');
					case 'dd':
						return num + (isFuture || withoutSuffix ? ' nap' : ' napja');
					case 'M':
						return 'egy' + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
					case 'MM':
						return num + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
					case 'y':
						return 'egy' + (isFuture || withoutSuffix ? ' év' : ' éve');
					case 'yy':
						return num + (isFuture || withoutSuffix ? ' év' : ' éve');
				}
				return '';
			}

			function week(isFuture) {
				return (isFuture ? '' : '[múlt] ') + '[' + weekEndings[this.day()] + '] LT[-kor]';
			}

			var hu = moment.defineLocale('hu', {
				months: 'január_február_március_április_május_június_július_augusztus_szeptember_október_november_december'.split('_'),
				monthsShort: 'jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec'.split('_'),
				weekdays: 'vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat'.split('_'),
				weekdaysShort: 'vas_hét_kedd_sze_csüt_pén_szo'.split('_'),
				weekdaysMin: 'v_h_k_sze_cs_p_szo'.split('_'),
				longDateFormat: {
					LT: 'H:mm',
					LTS: 'H:mm:ss',
					L: 'YYYY.MM.DD.',
					LL: 'YYYY. MMMM D.',
					LLL: 'YYYY. MMMM D. H:mm',
					LLLL: 'YYYY. MMMM D., dddd H:mm'
				},
				meridiemParse: /de|du/i,
				isPM: function (input) {
					return input.charAt(1).toLowerCase() === 'u';
				},
				meridiem: function (hours, minutes, isLower) {
					if (hours < 12) {
						return isLower === true ? 'de' : 'DE';
					} else {
						return isLower === true ? 'du' : 'DU';
					}
				},
				calendar: {
					sameDay: '[ma] LT[-kor]',
					nextDay: '[holnap] LT[-kor]',
					nextWeek: function () {
						return week.call(this, true);
					},
					lastDay: '[tegnap] LT[-kor]',
					lastWeek: function () {
						return week.call(this, false);
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s múlva',
					past: '%s',
					s: translate,
					m: translate,
					mm: translate,
					h: translate,
					hh: translate,
					d: translate,
					dd: translate,
					M: translate,
					MM: translate,
					y: translate,
					yy: translate
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return hu;

		})));


		/***/
	}),
	/* 55 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Armenian [hy-am]
//! author : Armendarabyan : https://github.com/armendarabyan

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var hyAm = moment.defineLocale('hy-am', {
				months: {
					format: 'հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի'.split('_'),
					standalone: 'հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր'.split('_')
				},
				monthsShort: 'հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ'.split('_'),
				weekdays: 'կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ'.split('_'),
				weekdaysShort: 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
				weekdaysMin: 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D MMMM YYYY թ.',
					LLL: 'D MMMM YYYY թ., HH:mm',
					LLLL: 'dddd, D MMMM YYYY թ., HH:mm'
				},
				calendar: {
					sameDay: '[այսօր] LT',
					nextDay: '[վաղը] LT',
					lastDay: '[երեկ] LT',
					nextWeek: function () {
						return 'dddd [օրը ժամը] LT';
					},
					lastWeek: function () {
						return '[անցած] dddd [օրը ժամը] LT';
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s հետո',
					past: '%s առաջ',
					s: 'մի քանի վայրկյան',
					m: 'րոպե',
					mm: '%d րոպե',
					h: 'ժամ',
					hh: '%d ժամ',
					d: 'օր',
					dd: '%d օր',
					M: 'ամիս',
					MM: '%d ամիս',
					y: 'տարի',
					yy: '%d տարի'
				},
				meridiemParse: /գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,
				isPM: function (input) {
					return /^(ցերեկվա|երեկոյան)$/.test(input);
				},
				meridiem: function (hour) {
					if (hour < 4) {
						return 'գիշերվա';
					} else if (hour < 12) {
						return 'առավոտվա';
					} else if (hour < 17) {
						return 'ցերեկվա';
					} else {
						return 'երեկոյան';
					}
				},
				dayOfMonthOrdinalParse: /\d{1,2}|\d{1,2}-(ին|րդ)/,
				ordinal: function (number, period) {
					switch (period) {
						case 'DDD':
						case 'w':
						case 'W':
						case 'DDDo':
							if (number === 1) {
								return number + '-ին';
							}
							return number + '-րդ';
						default:
							return number;
					}
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return hyAm;

		})));


		/***/
	}),
	/* 56 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Indonesian [id]
//! author : Mohammad Satrio Utomo : https://github.com/tyok
//! reference: http://id.wikisource.org/wiki/Pedoman_Umum_Ejaan_Bahasa_Indonesia_yang_Disempurnakan

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var id = moment.defineLocale('id', {
				months: 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember'.split('_'),
				monthsShort: 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des'.split('_'),
				weekdays: 'Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu'.split('_'),
				weekdaysShort: 'Min_Sen_Sel_Rab_Kam_Jum_Sab'.split('_'),
				weekdaysMin: 'Mg_Sn_Sl_Rb_Km_Jm_Sb'.split('_'),
				longDateFormat: {
					LT: 'HH.mm',
					LTS: 'HH.mm.ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY [pukul] HH.mm',
					LLLL: 'dddd, D MMMM YYYY [pukul] HH.mm'
				},
				meridiemParse: /pagi|siang|sore|malam/,
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if (meridiem === 'pagi') {
						return hour;
					} else if (meridiem === 'siang') {
						return hour >= 11 ? hour : hour + 12;
					} else if (meridiem === 'sore' || meridiem === 'malam') {
						return hour + 12;
					}
				},
				meridiem: function (hours, minutes, isLower) {
					if (hours < 11) {
						return 'pagi';
					} else if (hours < 15) {
						return 'siang';
					} else if (hours < 19) {
						return 'sore';
					} else {
						return 'malam';
					}
				},
				calendar: {
					sameDay: '[Hari ini pukul] LT',
					nextDay: '[Besok pukul] LT',
					nextWeek: 'dddd [pukul] LT',
					lastDay: '[Kemarin pukul] LT',
					lastWeek: 'dddd [lalu pukul] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'dalam %s',
					past: '%s yang lalu',
					s: 'beberapa detik',
					m: 'semenit',
					mm: '%d menit',
					h: 'sejam',
					hh: '%d jam',
					d: 'sehari',
					dd: '%d hari',
					M: 'sebulan',
					MM: '%d bulan',
					y: 'setahun',
					yy: '%d tahun'
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return id;

		})));


		/***/
	}),
	/* 57 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Icelandic [is]
//! author : Hinrik Örn Sigurðsson : https://github.com/hinrik

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			function plural(n) {
				if (n % 100 === 11) {
					return true;
				} else if (n % 10 === 1) {
					return false;
				}
				return true;
			}

			function translate(number, withoutSuffix, key, isFuture) {
				var result = number + ' ';
				switch (key) {
					case 's':
						return withoutSuffix || isFuture ? 'nokkrar sekúndur' : 'nokkrum sekúndum';
					case 'm':
						return withoutSuffix ? 'mínúta' : 'mínútu';
					case 'mm':
						if (plural(number)) {
							return result + (withoutSuffix || isFuture ? 'mínútur' : 'mínútum');
						} else if (withoutSuffix) {
							return result + 'mínúta';
						}
						return result + 'mínútu';
					case 'hh':
						if (plural(number)) {
							return result + (withoutSuffix || isFuture ? 'klukkustundir' : 'klukkustundum');
						}
						return result + 'klukkustund';
					case 'd':
						if (withoutSuffix) {
							return 'dagur';
						}
						return isFuture ? 'dag' : 'degi';
					case 'dd':
						if (plural(number)) {
							if (withoutSuffix) {
								return result + 'dagar';
							}
							return result + (isFuture ? 'daga' : 'dögum');
						} else if (withoutSuffix) {
							return result + 'dagur';
						}
						return result + (isFuture ? 'dag' : 'degi');
					case 'M':
						if (withoutSuffix) {
							return 'mánuður';
						}
						return isFuture ? 'mánuð' : 'mánuði';
					case 'MM':
						if (plural(number)) {
							if (withoutSuffix) {
								return result + 'mánuðir';
							}
							return result + (isFuture ? 'mánuði' : 'mánuðum');
						} else if (withoutSuffix) {
							return result + 'mánuður';
						}
						return result + (isFuture ? 'mánuð' : 'mánuði');
					case 'y':
						return withoutSuffix || isFuture ? 'ár' : 'ári';
					case 'yy':
						if (plural(number)) {
							return result + (withoutSuffix || isFuture ? 'ár' : 'árum');
						}
						return result + (withoutSuffix || isFuture ? 'ár' : 'ári');
				}
			}

			var is = moment.defineLocale('is', {
				months: 'janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember'.split('_'),
				monthsShort: 'jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des'.split('_'),
				weekdays: 'sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur'.split('_'),
				weekdaysShort: 'sun_mán_þri_mið_fim_fös_lau'.split('_'),
				weekdaysMin: 'Su_Má_Þr_Mi_Fi_Fö_La'.split('_'),
				longDateFormat: {
					LT: 'H:mm',
					LTS: 'H:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D. MMMM YYYY',
					LLL: 'D. MMMM YYYY [kl.] H:mm',
					LLLL: 'dddd, D. MMMM YYYY [kl.] H:mm'
				},
				calendar: {
					sameDay: '[í dag kl.] LT',
					nextDay: '[á morgun kl.] LT',
					nextWeek: 'dddd [kl.] LT',
					lastDay: '[í gær kl.] LT',
					lastWeek: '[síðasta] dddd [kl.] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'eftir %s',
					past: 'fyrir %s síðan',
					s: translate,
					m: translate,
					mm: translate,
					h: 'klukkustund',
					hh: translate,
					d: translate,
					dd: translate,
					M: translate,
					MM: translate,
					y: translate,
					yy: translate
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return is;

		})));


		/***/
	}),
	/* 58 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Italian [it]
//! author : Lorenzo : https://github.com/aliem
//! author: Mattia Larentis: https://github.com/nostalgiaz

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var it = moment.defineLocale('it', {
				months: 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split('_'),
				monthsShort: 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
				weekdays: 'domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato'.split('_'),
				weekdaysShort: 'dom_lun_mar_mer_gio_ven_sab'.split('_'),
				weekdaysMin: 'do_lu_ma_me_gi_ve_sa'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd, D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[Oggi alle] LT',
					nextDay: '[Domani alle] LT',
					nextWeek: 'dddd [alle] LT',
					lastDay: '[Ieri alle] LT',
					lastWeek: function () {
						switch (this.day()) {
							case 0:
								return '[la scorsa] dddd [alle] LT';
							default:
								return '[lo scorso] dddd [alle] LT';
						}
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: function (s) {
						return ((/^[0-9].+$/).test(s) ? 'tra' : 'in') + ' ' + s;
					},
					past: '%s fa',
					s: 'alcuni secondi',
					m: 'un minuto',
					mm: '%d minuti',
					h: 'un\'ora',
					hh: '%d ore',
					d: 'un giorno',
					dd: '%d giorni',
					M: 'un mese',
					MM: '%d mesi',
					y: 'un anno',
					yy: '%d anni'
				},
				dayOfMonthOrdinalParse: /\d{1,2}º/,
				ordinal: '%dº',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return it;

		})));


		/***/
	}),
	/* 59 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Japanese [ja]
//! author : LI Long : https://github.com/baryon

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var ja = moment.defineLocale('ja', {
				months: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
				monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
				weekdays: '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),
				weekdaysShort: '日_月_火_水_木_金_土'.split('_'),
				weekdaysMin: '日_月_火_水_木_金_土'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'YYYY/MM/DD',
					LL: 'YYYY年M月D日',
					LLL: 'YYYY年M月D日 HH:mm',
					LLLL: 'YYYY年M月D日 HH:mm dddd',
					l: 'YYYY/MM/DD',
					ll: 'YYYY年M月D日',
					lll: 'YYYY年M月D日 HH:mm',
					llll: 'YYYY年M月D日 HH:mm dddd'
				},
				meridiemParse: /午前|午後/i,
				isPM: function (input) {
					return input === '午後';
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 12) {
						return '午前';
					} else {
						return '午後';
					}
				},
				calendar: {
					sameDay: '[今日] LT',
					nextDay: '[明日] LT',
					nextWeek: '[来週]dddd LT',
					lastDay: '[昨日] LT',
					lastWeek: '[前週]dddd LT',
					sameElse: 'L'
				},
				dayOfMonthOrdinalParse: /\d{1,2}日/,
				ordinal: function (number, period) {
					switch (period) {
						case 'd':
						case 'D':
						case 'DDD':
							return number + '日';
						default:
							return number;
					}
				},
				relativeTime: {
					future: '%s後',
					past: '%s前',
					s: '数秒',
					m: '1分',
					mm: '%d分',
					h: '1時間',
					hh: '%d時間',
					d: '1日',
					dd: '%d日',
					M: '1ヶ月',
					MM: '%dヶ月',
					y: '1年',
					yy: '%d年'
				}
			});

			return ja;

		})));


		/***/
	}),
	/* 60 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Javanese [jv]
//! author : Rony Lantip : https://github.com/lantip
//! reference: http://jv.wikipedia.org/wiki/Basa_Jawa

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var jv = moment.defineLocale('jv', {
				months: 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember'.split('_'),
				monthsShort: 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des'.split('_'),
				weekdays: 'Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu'.split('_'),
				weekdaysShort: 'Min_Sen_Sel_Reb_Kem_Jem_Sep'.split('_'),
				weekdaysMin: 'Mg_Sn_Sl_Rb_Km_Jm_Sp'.split('_'),
				longDateFormat: {
					LT: 'HH.mm',
					LTS: 'HH.mm.ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY [pukul] HH.mm',
					LLLL: 'dddd, D MMMM YYYY [pukul] HH.mm'
				},
				meridiemParse: /enjing|siyang|sonten|ndalu/,
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if (meridiem === 'enjing') {
						return hour;
					} else if (meridiem === 'siyang') {
						return hour >= 11 ? hour : hour + 12;
					} else if (meridiem === 'sonten' || meridiem === 'ndalu') {
						return hour + 12;
					}
				},
				meridiem: function (hours, minutes, isLower) {
					if (hours < 11) {
						return 'enjing';
					} else if (hours < 15) {
						return 'siyang';
					} else if (hours < 19) {
						return 'sonten';
					} else {
						return 'ndalu';
					}
				},
				calendar: {
					sameDay: '[Dinten puniko pukul] LT',
					nextDay: '[Mbenjang pukul] LT',
					nextWeek: 'dddd [pukul] LT',
					lastDay: '[Kala wingi pukul] LT',
					lastWeek: 'dddd [kepengker pukul] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'wonten ing %s',
					past: '%s ingkang kepengker',
					s: 'sawetawis detik',
					m: 'setunggal menit',
					mm: '%d menit',
					h: 'setunggal jam',
					hh: '%d jam',
					d: 'sedinten',
					dd: '%d dinten',
					M: 'sewulan',
					MM: '%d wulan',
					y: 'setaun',
					yy: '%d taun'
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return jv;

		})));


		/***/
	}),
	/* 61 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Georgian [ka]
//! author : Irakli Janiashvili : https://github.com/irakli-janiashvili

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var ka = moment.defineLocale('ka', {
				months: {
					standalone: 'იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი'.split('_'),
					format: 'იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს'.split('_')
				},
				monthsShort: 'იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ'.split('_'),
				weekdays: {
					standalone: 'კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი'.split('_'),
					format: 'კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს'.split('_'),
					isFormat: /(წინა|შემდეგ)/
				},
				weekdaysShort: 'კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ'.split('_'),
				weekdaysMin: 'კვ_ორ_სა_ოთ_ხუ_პა_შა'.split('_'),
				longDateFormat: {
					LT: 'h:mm A',
					LTS: 'h:mm:ss A',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY h:mm A',
					LLLL: 'dddd, D MMMM YYYY h:mm A'
				},
				calendar: {
					sameDay: '[დღეს] LT[-ზე]',
					nextDay: '[ხვალ] LT[-ზე]',
					lastDay: '[გუშინ] LT[-ზე]',
					nextWeek: '[შემდეგ] dddd LT[-ზე]',
					lastWeek: '[წინა] dddd LT-ზე',
					sameElse: 'L'
				},
				relativeTime: {
					future: function (s) {
						return (/(წამი|წუთი|საათი|წელი)/).test(s) ?
							s.replace(/ი$/, 'ში') :
							s + 'ში';
					},
					past: function (s) {
						if ((/(წამი|წუთი|საათი|დღე|თვე)/).test(s)) {
							return s.replace(/(ი|ე)$/, 'ის უკან');
						}
						if ((/წელი/).test(s)) {
							return s.replace(/წელი$/, 'წლის უკან');
						}
					},
					s: 'რამდენიმე წამი',
					m: 'წუთი',
					mm: '%d წუთი',
					h: 'საათი',
					hh: '%d საათი',
					d: 'დღე',
					dd: '%d დღე',
					M: 'თვე',
					MM: '%d თვე',
					y: 'წელი',
					yy: '%d წელი'
				},
				dayOfMonthOrdinalParse: /0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,
				ordinal: function (number) {
					if (number === 0) {
						return number;
					}
					if (number === 1) {
						return number + '-ლი';
					}
					if ((number < 20) || (number <= 100 && (number % 20 === 0)) || (number % 100 === 0)) {
						return 'მე-' + number;
					}
					return number + '-ე';
				},
				week: {
					dow: 1,
					doy: 7
				}
			});

			return ka;

		})));


		/***/
	}),
	/* 62 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Kazakh [kk]
//! authors : Nurlan Rakhimzhanov : https://github.com/nurlan

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var suffixes = {
				0: '-ші',
				1: '-ші',
				2: '-ші',
				3: '-ші',
				4: '-ші',
				5: '-ші',
				6: '-шы',
				7: '-ші',
				8: '-ші',
				9: '-шы',
				10: '-шы',
				20: '-шы',
				30: '-шы',
				40: '-шы',
				50: '-ші',
				60: '-шы',
				70: '-ші',
				80: '-ші',
				90: '-шы',
				100: '-ші'
			};

			var kk = moment.defineLocale('kk', {
				months: 'қаңтар_ақпан_наурыз_сәуір_мамыр_маусым_шілде_тамыз_қыркүйек_қазан_қараша_желтоқсан'.split('_'),
				monthsShort: 'қаң_ақп_нау_сәу_мам_мау_шіл_там_қыр_қаз_қар_жел'.split('_'),
				weekdays: 'жексенбі_дүйсенбі_сейсенбі_сәрсенбі_бейсенбі_жұма_сенбі'.split('_'),
				weekdaysShort: 'жек_дүй_сей_сәр_бей_жұм_сен'.split('_'),
				weekdaysMin: 'жк_дй_сй_ср_бй_жм_сн'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd, D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[Бүгін сағат] LT',
					nextDay: '[Ертең сағат] LT',
					nextWeek: 'dddd [сағат] LT',
					lastDay: '[Кеше сағат] LT',
					lastWeek: '[Өткен аптаның] dddd [сағат] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s ішінде',
					past: '%s бұрын',
					s: 'бірнеше секунд',
					m: 'бір минут',
					mm: '%d минут',
					h: 'бір сағат',
					hh: '%d сағат',
					d: 'бір күн',
					dd: '%d күн',
					M: 'бір ай',
					MM: '%d ай',
					y: 'бір жыл',
					yy: '%d жыл'
				},
				dayOfMonthOrdinalParse: /\d{1,2}-(ші|шы)/,
				ordinal: function (number) {
					var a = number % 10,
						b = number >= 100 ? 100 : null;
					return number + (suffixes[number] || suffixes[a] || suffixes[b]);
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return kk;

		})));


		/***/
	}),
	/* 63 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Cambodian [km]
//! author : Kruy Vanna : https://github.com/kruyvanna

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var km = moment.defineLocale('km', {
				months: 'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
				monthsShort: 'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
				weekdays: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
				weekdaysShort: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
				weekdaysMin: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd, D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[ថ្ងៃនេះ ម៉ោង] LT',
					nextDay: '[ស្អែក ម៉ោង] LT',
					nextWeek: 'dddd [ម៉ោង] LT',
					lastDay: '[ម្សិលមិញ ម៉ោង] LT',
					lastWeek: 'dddd [សប្តាហ៍មុន] [ម៉ោង] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%sទៀត',
					past: '%sមុន',
					s: 'ប៉ុន្មានវិនាទី',
					m: 'មួយនាទី',
					mm: '%d នាទី',
					h: 'មួយម៉ោង',
					hh: '%d ម៉ោង',
					d: 'មួយថ្ងៃ',
					dd: '%d ថ្ងៃ',
					M: 'មួយខែ',
					MM: '%d ខែ',
					y: 'មួយឆ្នាំ',
					yy: '%d ឆ្នាំ'
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4 // The week that contains Jan 4th is the first week of the year.
				}
			});

			return km;

		})));


		/***/
	}),
	/* 64 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Kannada [kn]
//! author : Rajeev Naik : https://github.com/rajeevnaikte

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var symbolMap = {
				'1': '೧',
				'2': '೨',
				'3': '೩',
				'4': '೪',
				'5': '೫',
				'6': '೬',
				'7': '೭',
				'8': '೮',
				'9': '೯',
				'0': '೦'
			};
			var numberMap = {
				'೧': '1',
				'೨': '2',
				'೩': '3',
				'೪': '4',
				'೫': '5',
				'೬': '6',
				'೭': '7',
				'೮': '8',
				'೯': '9',
				'೦': '0'
			};

			var kn = moment.defineLocale('kn', {
				months: 'ಜನವರಿ_ಫೆಬ್ರವರಿ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂಬರ್_ಅಕ್ಟೋಬರ್_ನವೆಂಬರ್_ಡಿಸೆಂಬರ್'.split('_'),
				monthsShort: 'ಜನ_ಫೆಬ್ರ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂಬ_ಅಕ್ಟೋಬ_ನವೆಂಬ_ಡಿಸೆಂಬ'.split('_'),
				monthsParseExact: true,
				weekdays: 'ಭಾನುವಾರ_ಸೋಮವಾರ_ಮಂಗಳವಾರ_ಬುಧವಾರ_ಗುರುವಾರ_ಶುಕ್ರವಾರ_ಶನಿವಾರ'.split('_'),
				weekdaysShort: 'ಭಾನು_ಸೋಮ_ಮಂಗಳ_ಬುಧ_ಗುರು_ಶುಕ್ರ_ಶನಿ'.split('_'),
				weekdaysMin: 'ಭಾ_ಸೋ_ಮಂ_ಬು_ಗು_ಶು_ಶ'.split('_'),
				longDateFormat: {
					LT: 'A h:mm',
					LTS: 'A h:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY, A h:mm',
					LLLL: 'dddd, D MMMM YYYY, A h:mm'
				},
				calendar: {
					sameDay: '[ಇಂದು] LT',
					nextDay: '[ನಾಳೆ] LT',
					nextWeek: 'dddd, LT',
					lastDay: '[ನಿನ್ನೆ] LT',
					lastWeek: '[ಕೊನೆಯ] dddd, LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s ನಂತರ',
					past: '%s ಹಿಂದೆ',
					s: 'ಕೆಲವು ಕ್ಷಣಗಳು',
					m: 'ಒಂದು ನಿಮಿಷ',
					mm: '%d ನಿಮಿಷ',
					h: 'ಒಂದು ಗಂಟೆ',
					hh: '%d ಗಂಟೆ',
					d: 'ಒಂದು ದಿನ',
					dd: '%d ದಿನ',
					M: 'ಒಂದು ತಿಂಗಳು',
					MM: '%d ತಿಂಗಳು',
					y: 'ಒಂದು ವರ್ಷ',
					yy: '%d ವರ್ಷ'
				},
				preparse: function (string) {
					return string.replace(/[೧೨೩೪೫೬೭೮೯೦]/g, function (match) {
						return numberMap[match];
					});
				},
				postformat: function (string) {
					return string.replace(/\d/g, function (match) {
						return symbolMap[match];
					});
				},
				meridiemParse: /ರಾತ್ರಿ|ಬೆಳಿಗ್ಗೆ|ಮಧ್ಯಾಹ್ನ|ಸಂಜೆ/,
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if (meridiem === 'ರಾತ್ರಿ') {
						return hour < 4 ? hour : hour + 12;
					} else if (meridiem === 'ಬೆಳಿಗ್ಗೆ') {
						return hour;
					} else if (meridiem === 'ಮಧ್ಯಾಹ್ನ') {
						return hour >= 10 ? hour : hour + 12;
					} else if (meridiem === 'ಸಂಜೆ') {
						return hour + 12;
					}
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 4) {
						return 'ರಾತ್ರಿ';
					} else if (hour < 10) {
						return 'ಬೆಳಿಗ್ಗೆ';
					} else if (hour < 17) {
						return 'ಮಧ್ಯಾಹ್ನ';
					} else if (hour < 20) {
						return 'ಸಂಜೆ';
					} else {
						return 'ರಾತ್ರಿ';
					}
				},
				dayOfMonthOrdinalParse: /\d{1,2}(ನೇ)/,
				ordinal: function (number) {
					return number + 'ನೇ';
				},
				week: {
					dow: 0, // Sunday is the first day of the week.
					doy: 6  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return kn;

		})));


		/***/
	}),
	/* 65 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Korean [ko]
//! author : Kyungwook, Park : https://github.com/kyungw00k
//! author : Jeeeyul Lee <jeeeyul@gmail.com>

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var ko = moment.defineLocale('ko', {
				months: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
				monthsShort: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
				weekdays: '일요일_월요일_화요일_수요일_목요일_금요일_토요일'.split('_'),
				weekdaysShort: '일_월_화_수_목_금_토'.split('_'),
				weekdaysMin: '일_월_화_수_목_금_토'.split('_'),
				longDateFormat: {
					LT: 'A h:mm',
					LTS: 'A h:mm:ss',
					L: 'YYYY.MM.DD',
					LL: 'YYYY년 MMMM D일',
					LLL: 'YYYY년 MMMM D일 A h:mm',
					LLLL: 'YYYY년 MMMM D일 dddd A h:mm',
					l: 'YYYY.MM.DD',
					ll: 'YYYY년 MMMM D일',
					lll: 'YYYY년 MMMM D일 A h:mm',
					llll: 'YYYY년 MMMM D일 dddd A h:mm'
				},
				calendar: {
					sameDay: '오늘 LT',
					nextDay: '내일 LT',
					nextWeek: 'dddd LT',
					lastDay: '어제 LT',
					lastWeek: '지난주 dddd LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s 후',
					past: '%s 전',
					s: '몇 초',
					ss: '%d초',
					m: '1분',
					mm: '%d분',
					h: '한 시간',
					hh: '%d시간',
					d: '하루',
					dd: '%d일',
					M: '한 달',
					MM: '%d달',
					y: '일 년',
					yy: '%d년'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(일|월|주)/,
				ordinal: function (number, period) {
					switch (period) {
						case 'd':
						case 'D':
						case 'DDD':
							return number + '일';
						case 'M':
							return number + '월';
						case 'w':
						case 'W':
							return number + '주';
						default:
							return number;
					}
				},
				meridiemParse: /오전|오후/,
				isPM: function (token) {
					return token === '오후';
				},
				meridiem: function (hour, minute, isUpper) {
					return hour < 12 ? '오전' : '오후';
				}
			});

			return ko;

		})));


		/***/
	}),
	/* 66 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Kyrgyz [ky]
//! author : Chyngyz Arystan uulu : https://github.com/chyngyz

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var suffixes = {
				0: '-чү',
				1: '-чи',
				2: '-чи',
				3: '-чү',
				4: '-чү',
				5: '-чи',
				6: '-чы',
				7: '-чи',
				8: '-чи',
				9: '-чу',
				10: '-чу',
				20: '-чы',
				30: '-чу',
				40: '-чы',
				50: '-чү',
				60: '-чы',
				70: '-чи',
				80: '-чи',
				90: '-чу',
				100: '-чү'
			};

			var ky = moment.defineLocale('ky', {
				months: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_'),
				monthsShort: 'янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек'.split('_'),
				weekdays: 'Жекшемби_Дүйшөмбү_Шейшемби_Шаршемби_Бейшемби_Жума_Ишемби'.split('_'),
				weekdaysShort: 'Жек_Дүй_Шей_Шар_Бей_Жум_Ише'.split('_'),
				weekdaysMin: 'Жк_Дй_Шй_Шр_Бй_Жм_Иш'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd, D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[Бүгүн саат] LT',
					nextDay: '[Эртең саат] LT',
					nextWeek: 'dddd [саат] LT',
					lastDay: '[Кече саат] LT',
					lastWeek: '[Өткен аптанын] dddd [күнү] [саат] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s ичинде',
					past: '%s мурун',
					s: 'бирнече секунд',
					m: 'бир мүнөт',
					mm: '%d мүнөт',
					h: 'бир саат',
					hh: '%d саат',
					d: 'бир күн',
					dd: '%d күн',
					M: 'бир ай',
					MM: '%d ай',
					y: 'бир жыл',
					yy: '%d жыл'
				},
				dayOfMonthOrdinalParse: /\d{1,2}-(чи|чы|чү|чу)/,
				ordinal: function (number) {
					var a = number % 10,
						b = number >= 100 ? 100 : null;
					return number + (suffixes[number] || suffixes[a] || suffixes[b]);
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return ky;

		})));


		/***/
	}),
	/* 67 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Luxembourgish [lb]
//! author : mweimerskirch : https://github.com/mweimerskirch
//! author : David Raison : https://github.com/kwisatz

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			function processRelativeTime(number, withoutSuffix, key, isFuture) {
				var format = {
					'm': ['eng Minutt', 'enger Minutt'],
					'h': ['eng Stonn', 'enger Stonn'],
					'd': ['een Dag', 'engem Dag'],
					'M': ['ee Mount', 'engem Mount'],
					'y': ['ee Joer', 'engem Joer']
				};
				return withoutSuffix ? format[key][0] : format[key][1];
			}

			function processFutureTime(string) {
				var number = string.substr(0, string.indexOf(' '));
				if (eifelerRegelAppliesToNumber(number)) {
					return 'a ' + string;
				}
				return 'an ' + string;
			}

			function processPastTime(string) {
				var number = string.substr(0, string.indexOf(' '));
				if (eifelerRegelAppliesToNumber(number)) {
					return 'viru ' + string;
				}
				return 'virun ' + string;
			}

			/**
			 * Returns true if the word before the given number loses the '-n' ending.
			 * e.g. 'an 10 Deeg' but 'a 5 Deeg'
			 *
			 * @param number {integer}
			 * @returns {boolean}
			 */
			function eifelerRegelAppliesToNumber(number) {
				number = parseInt(number, 10);
				if (isNaN(number)) {
					return false;
				}
				if (number < 0) {
					// Negative Number --> always true
					return true;
				} else if (number < 10) {
					// Only 1 digit
					if (4 <= number && number <= 7) {
						return true;
					}
					return false;
				} else if (number < 100) {
					// 2 digits
					var lastDigit = number % 10, firstDigit = number / 10;
					if (lastDigit === 0) {
						return eifelerRegelAppliesToNumber(firstDigit);
					}
					return eifelerRegelAppliesToNumber(lastDigit);
				} else if (number < 10000) {
					// 3 or 4 digits --> recursively check first digit
					while (number >= 10) {
						number = number / 10;
					}
					return eifelerRegelAppliesToNumber(number);
				} else {
					// Anything larger than 4 digits: recursively check first n-3 digits
					number = number / 1000;
					return eifelerRegelAppliesToNumber(number);
				}
			}

			var lb = moment.defineLocale('lb', {
				months: 'Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
				monthsShort: 'Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
				monthsParseExact: true,
				weekdays: 'Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg'.split('_'),
				weekdaysShort: 'So._Mé._Dë._Më._Do._Fr._Sa.'.split('_'),
				weekdaysMin: 'So_Mé_Dë_Më_Do_Fr_Sa'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'H:mm [Auer]',
					LTS: 'H:mm:ss [Auer]',
					L: 'DD.MM.YYYY',
					LL: 'D. MMMM YYYY',
					LLL: 'D. MMMM YYYY H:mm [Auer]',
					LLLL: 'dddd, D. MMMM YYYY H:mm [Auer]'
				},
				calendar: {
					sameDay: '[Haut um] LT',
					sameElse: 'L',
					nextDay: '[Muer um] LT',
					nextWeek: 'dddd [um] LT',
					lastDay: '[Gëschter um] LT',
					lastWeek: function () {
						// Different date string for 'Dënschdeg' (Tuesday) and 'Donneschdeg' (Thursday) due to phonological rule
						switch (this.day()) {
							case 2:
							case 4:
								return '[Leschten] dddd [um] LT';
							default:
								return '[Leschte] dddd [um] LT';
						}
					}
				},
				relativeTime: {
					future: processFutureTime,
					past: processPastTime,
					s: 'e puer Sekonnen',
					m: processRelativeTime,
					mm: '%d Minutten',
					h: processRelativeTime,
					hh: '%d Stonnen',
					d: processRelativeTime,
					dd: '%d Deeg',
					M: processRelativeTime,
					MM: '%d Méint',
					y: processRelativeTime,
					yy: '%d Joer'
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return lb;

		})));


		/***/
	}),
	/* 68 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Lao [lo]
//! author : Ryan Hart : https://github.com/ryanhart2

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var lo = moment.defineLocale('lo', {
				months: 'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split('_'),
				monthsShort: 'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split('_'),
				weekdays: 'ອາທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
				weekdaysShort: 'ທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
				weekdaysMin: 'ທ_ຈ_ອຄ_ພ_ພຫ_ສກ_ສ'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'ວັນdddd D MMMM YYYY HH:mm'
				},
				meridiemParse: /ຕອນເຊົ້າ|ຕອນແລງ/,
				isPM: function (input) {
					return input === 'ຕອນແລງ';
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 12) {
						return 'ຕອນເຊົ້າ';
					} else {
						return 'ຕອນແລງ';
					}
				},
				calendar: {
					sameDay: '[ມື້ນີ້ເວລາ] LT',
					nextDay: '[ມື້ອື່ນເວລາ] LT',
					nextWeek: '[ວັນ]dddd[ໜ້າເວລາ] LT',
					lastDay: '[ມື້ວານນີ້ເວລາ] LT',
					lastWeek: '[ວັນ]dddd[ແລ້ວນີ້ເວລາ] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'ອີກ %s',
					past: '%sຜ່ານມາ',
					s: 'ບໍ່ເທົ່າໃດວິນາທີ',
					m: '1 ນາທີ',
					mm: '%d ນາທີ',
					h: '1 ຊົ່ວໂມງ',
					hh: '%d ຊົ່ວໂມງ',
					d: '1 ມື້',
					dd: '%d ມື້',
					M: '1 ເດືອນ',
					MM: '%d ເດືອນ',
					y: '1 ປີ',
					yy: '%d ປີ'
				},
				dayOfMonthOrdinalParse: /(ທີ່)\d{1,2}/,
				ordinal: function (number) {
					return 'ທີ່' + number;
				}
			});

			return lo;

		})));


		/***/
	}),
	/* 69 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Lithuanian [lt]
//! author : Mindaugas Mozūras : https://github.com/mmozuras

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var units = {
				'm': 'minutė_minutės_minutę',
				'mm': 'minutės_minučių_minutes',
				'h': 'valanda_valandos_valandą',
				'hh': 'valandos_valandų_valandas',
				'd': 'diena_dienos_dieną',
				'dd': 'dienos_dienų_dienas',
				'M': 'mėnuo_mėnesio_mėnesį',
				'MM': 'mėnesiai_mėnesių_mėnesius',
				'y': 'metai_metų_metus',
				'yy': 'metai_metų_metus'
			};

			function translateSeconds(number, withoutSuffix, key, isFuture) {
				if (withoutSuffix) {
					return 'kelios sekundės';
				} else {
					return isFuture ? 'kelių sekundžių' : 'kelias sekundes';
				}
			}

			function translateSingular(number, withoutSuffix, key, isFuture) {
				return withoutSuffix ? forms(key)[0] : (isFuture ? forms(key)[1] : forms(key)[2]);
			}

			function special(number) {
				return number % 10 === 0 || (number > 10 && number < 20);
			}

			function forms(key) {
				return units[key].split('_');
			}

			function translate(number, withoutSuffix, key, isFuture) {
				var result = number + ' ';
				if (number === 1) {
					return result + translateSingular(number, withoutSuffix, key[0], isFuture);
				} else if (withoutSuffix) {
					return result + (special(number) ? forms(key)[1] : forms(key)[0]);
				} else {
					if (isFuture) {
						return result + forms(key)[1];
					} else {
						return result + (special(number) ? forms(key)[1] : forms(key)[2]);
					}
				}
			}

			var lt = moment.defineLocale('lt', {
				months: {
					format: 'sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio'.split('_'),
					standalone: 'sausis_vasaris_kovas_balandis_gegužė_birželis_liepa_rugpjūtis_rugsėjis_spalis_lapkritis_gruodis'.split('_'),
					isFormat: /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?|MMMM?(\[[^\[\]]*\]|\s)+D[oD]?/
				},
				monthsShort: 'sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd'.split('_'),
				weekdays: {
					format: 'sekmadienį_pirmadienį_antradienį_trečiadienį_ketvirtadienį_penktadienį_šeštadienį'.split('_'),
					standalone: 'sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis'.split('_'),
					isFormat: /dddd HH:mm/
				},
				weekdaysShort: 'Sek_Pir_Ant_Tre_Ket_Pen_Šeš'.split('_'),
				weekdaysMin: 'S_P_A_T_K_Pn_Š'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'YYYY-MM-DD',
					LL: 'YYYY [m.] MMMM D [d.]',
					LLL: 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
					LLLL: 'YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]',
					l: 'YYYY-MM-DD',
					ll: 'YYYY [m.] MMMM D [d.]',
					lll: 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
					llll: 'YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]'
				},
				calendar: {
					sameDay: '[Šiandien] LT',
					nextDay: '[Rytoj] LT',
					nextWeek: 'dddd LT',
					lastDay: '[Vakar] LT',
					lastWeek: '[Praėjusį] dddd LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'po %s',
					past: 'prieš %s',
					s: translateSeconds,
					m: translateSingular,
					mm: translate,
					h: translateSingular,
					hh: translate,
					d: translateSingular,
					dd: translate,
					M: translateSingular,
					MM: translate,
					y: translateSingular,
					yy: translate
				},
				dayOfMonthOrdinalParse: /\d{1,2}-oji/,
				ordinal: function (number) {
					return number + '-oji';
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return lt;

		})));


		/***/
	}),
	/* 70 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Latvian [lv]
//! author : Kristaps Karlsons : https://github.com/skakri
//! author : Jānis Elmeris : https://github.com/JanisE

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var units = {
				'm': 'minūtes_minūtēm_minūte_minūtes'.split('_'),
				'mm': 'minūtes_minūtēm_minūte_minūtes'.split('_'),
				'h': 'stundas_stundām_stunda_stundas'.split('_'),
				'hh': 'stundas_stundām_stunda_stundas'.split('_'),
				'd': 'dienas_dienām_diena_dienas'.split('_'),
				'dd': 'dienas_dienām_diena_dienas'.split('_'),
				'M': 'mēneša_mēnešiem_mēnesis_mēneši'.split('_'),
				'MM': 'mēneša_mēnešiem_mēnesis_mēneši'.split('_'),
				'y': 'gada_gadiem_gads_gadi'.split('_'),
				'yy': 'gada_gadiem_gads_gadi'.split('_')
			};

			/**
			 * @param withoutSuffix boolean true = a length of time; false = before/after a period of time.
			 */
			function format(forms, number, withoutSuffix) {
				if (withoutSuffix) {
					// E.g. "21 minūte", "3 minūtes".
					return number % 10 === 1 && number % 100 !== 11 ? forms[2] : forms[3];
				} else {
					// E.g. "21 minūtes" as in "pēc 21 minūtes".
					// E.g. "3 minūtēm" as in "pēc 3 minūtēm".
					return number % 10 === 1 && number % 100 !== 11 ? forms[0] : forms[1];
				}
			}

			function relativeTimeWithPlural(number, withoutSuffix, key) {
				return number + ' ' + format(units[key], number, withoutSuffix);
			}

			function relativeTimeWithSingular(number, withoutSuffix, key) {
				return format(units[key], number, withoutSuffix);
			}

			function relativeSeconds(number, withoutSuffix) {
				return withoutSuffix ? 'dažas sekundes' : 'dažām sekundēm';
			}

			var lv = moment.defineLocale('lv', {
				months: 'janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris'.split('_'),
				monthsShort: 'jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec'.split('_'),
				weekdays: 'svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena'.split('_'),
				weekdaysShort: 'Sv_P_O_T_C_Pk_S'.split('_'),
				weekdaysMin: 'Sv_P_O_T_C_Pk_S'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD.MM.YYYY.',
					LL: 'YYYY. [gada] D. MMMM',
					LLL: 'YYYY. [gada] D. MMMM, HH:mm',
					LLLL: 'YYYY. [gada] D. MMMM, dddd, HH:mm'
				},
				calendar: {
					sameDay: '[Šodien pulksten] LT',
					nextDay: '[Rīt pulksten] LT',
					nextWeek: 'dddd [pulksten] LT',
					lastDay: '[Vakar pulksten] LT',
					lastWeek: '[Pagājušā] dddd [pulksten] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'pēc %s',
					past: 'pirms %s',
					s: relativeSeconds,
					m: relativeTimeWithSingular,
					mm: relativeTimeWithPlural,
					h: relativeTimeWithSingular,
					hh: relativeTimeWithPlural,
					d: relativeTimeWithSingular,
					dd: relativeTimeWithPlural,
					M: relativeTimeWithSingular,
					MM: relativeTimeWithPlural,
					y: relativeTimeWithSingular,
					yy: relativeTimeWithPlural
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return lv;

		})));


		/***/
	}),
	/* 71 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Montenegrin [me]
//! author : Miodrag Nikač <miodrag@restartit.me> : https://github.com/miodragnikac

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var translator = {
				words: { //Different grammatical cases
					m: ['jedan minut', 'jednog minuta'],
					mm: ['minut', 'minuta', 'minuta'],
					h: ['jedan sat', 'jednog sata'],
					hh: ['sat', 'sata', 'sati'],
					dd: ['dan', 'dana', 'dana'],
					MM: ['mjesec', 'mjeseca', 'mjeseci'],
					yy: ['godina', 'godine', 'godina']
				},
				correctGrammaticalCase: function (number, wordKey) {
					return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
				},
				translate: function (number, withoutSuffix, key) {
					var wordKey = translator.words[key];
					if (key.length === 1) {
						return withoutSuffix ? wordKey[0] : wordKey[1];
					} else {
						return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
					}
				}
			};

			var me = moment.defineLocale('me', {
				months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split('_'),
				monthsShort: 'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
				monthsParseExact: true,
				weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
				weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
				weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'H:mm',
					LTS: 'H:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D. MMMM YYYY',
					LLL: 'D. MMMM YYYY H:mm',
					LLLL: 'dddd, D. MMMM YYYY H:mm'
				},
				calendar: {
					sameDay: '[danas u] LT',
					nextDay: '[sjutra u] LT',

					nextWeek: function () {
						switch (this.day()) {
							case 0:
								return '[u] [nedjelju] [u] LT';
							case 3:
								return '[u] [srijedu] [u] LT';
							case 6:
								return '[u] [subotu] [u] LT';
							case 1:
							case 2:
							case 4:
							case 5:
								return '[u] dddd [u] LT';
						}
					},
					lastDay: '[juče u] LT',
					lastWeek: function () {
						var lastWeekDays = [
							'[prošle] [nedjelje] [u] LT',
							'[prošlog] [ponedjeljka] [u] LT',
							'[prošlog] [utorka] [u] LT',
							'[prošle] [srijede] [u] LT',
							'[prošlog] [četvrtka] [u] LT',
							'[prošlog] [petka] [u] LT',
							'[prošle] [subote] [u] LT'
						];
						return lastWeekDays[this.day()];
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'za %s',
					past: 'prije %s',
					s: 'nekoliko sekundi',
					m: translator.translate,
					mm: translator.translate,
					h: translator.translate,
					hh: translator.translate,
					d: 'dan',
					dd: translator.translate,
					M: 'mjesec',
					MM: translator.translate,
					y: 'godinu',
					yy: translator.translate
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return me;

		})));


		/***/
	}),
	/* 72 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Maori [mi]
//! author : John Corrigan <robbiecloset@gmail.com> : https://github.com/johnideal

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var mi = moment.defineLocale('mi', {
				months: 'Kohi-tāte_Hui-tanguru_Poutū-te-rangi_Paenga-whāwhā_Haratua_Pipiri_Hōngoingoi_Here-turi-kōkā_Mahuru_Whiringa-ā-nuku_Whiringa-ā-rangi_Hakihea'.split('_'),
				monthsShort: 'Kohi_Hui_Pou_Pae_Hara_Pipi_Hōngoi_Here_Mahu_Whi-nu_Whi-ra_Haki'.split('_'),
				monthsRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
				monthsStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
				monthsShortRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
				monthsShortStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,2}/i,
				weekdays: 'Rātapu_Mane_Tūrei_Wenerei_Tāite_Paraire_Hātarei'.split('_'),
				weekdaysShort: 'Ta_Ma_Tū_We_Tāi_Pa_Hā'.split('_'),
				weekdaysMin: 'Ta_Ma_Tū_We_Tāi_Pa_Hā'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY [i] HH:mm',
					LLLL: 'dddd, D MMMM YYYY [i] HH:mm'
				},
				calendar: {
					sameDay: '[i teie mahana, i] LT',
					nextDay: '[apopo i] LT',
					nextWeek: 'dddd [i] LT',
					lastDay: '[inanahi i] LT',
					lastWeek: 'dddd [whakamutunga i] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'i roto i %s',
					past: '%s i mua',
					s: 'te hēkona ruarua',
					m: 'he meneti',
					mm: '%d meneti',
					h: 'te haora',
					hh: '%d haora',
					d: 'he ra',
					dd: '%d ra',
					M: 'he marama',
					MM: '%d marama',
					y: 'he tau',
					yy: '%d tau'
				},
				dayOfMonthOrdinalParse: /\d{1,2}º/,
				ordinal: '%dº',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return mi;

		})));


		/***/
	}),
	/* 73 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Macedonian [mk]
//! author : Borislav Mickov : https://github.com/B0k0

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var mk = moment.defineLocale('mk', {
				months: 'јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември'.split('_'),
				monthsShort: 'јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек'.split('_'),
				weekdays: 'недела_понеделник_вторник_среда_четврток_петок_сабота'.split('_'),
				weekdaysShort: 'нед_пон_вто_сре_чет_пет_саб'.split('_'),
				weekdaysMin: 'нe_пo_вт_ср_че_пе_сa'.split('_'),
				longDateFormat: {
					LT: 'H:mm',
					LTS: 'H:mm:ss',
					L: 'D.MM.YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY H:mm',
					LLLL: 'dddd, D MMMM YYYY H:mm'
				},
				calendar: {
					sameDay: '[Денес во] LT',
					nextDay: '[Утре во] LT',
					nextWeek: '[Во] dddd [во] LT',
					lastDay: '[Вчера во] LT',
					lastWeek: function () {
						switch (this.day()) {
							case 0:
							case 3:
							case 6:
								return '[Изминатата] dddd [во] LT';
							case 1:
							case 2:
							case 4:
							case 5:
								return '[Изминатиот] dddd [во] LT';
						}
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'после %s',
					past: 'пред %s',
					s: 'неколку секунди',
					m: 'минута',
					mm: '%d минути',
					h: 'час',
					hh: '%d часа',
					d: 'ден',
					dd: '%d дена',
					M: 'месец',
					MM: '%d месеци',
					y: 'година',
					yy: '%d години'
				},
				dayOfMonthOrdinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
				ordinal: function (number) {
					var lastDigit = number % 10,
						last2Digits = number % 100;
					if (number === 0) {
						return number + '-ев';
					} else if (last2Digits === 0) {
						return number + '-ен';
					} else if (last2Digits > 10 && last2Digits < 20) {
						return number + '-ти';
					} else if (lastDigit === 1) {
						return number + '-ви';
					} else if (lastDigit === 2) {
						return number + '-ри';
					} else if (lastDigit === 7 || lastDigit === 8) {
						return number + '-ми';
					} else {
						return number + '-ти';
					}
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return mk;

		})));


		/***/
	}),
	/* 74 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Malayalam [ml]
//! author : Floyd Pink : https://github.com/floydpink

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var ml = moment.defineLocale('ml', {
				months: 'ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ'.split('_'),
				monthsShort: 'ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.'.split('_'),
				monthsParseExact: true,
				weekdays: 'ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച'.split('_'),
				weekdaysShort: 'ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി'.split('_'),
				weekdaysMin: 'ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ'.split('_'),
				longDateFormat: {
					LT: 'A h:mm -നു',
					LTS: 'A h:mm:ss -നു',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY, A h:mm -നു',
					LLLL: 'dddd, D MMMM YYYY, A h:mm -നു'
				},
				calendar: {
					sameDay: '[ഇന്ന്] LT',
					nextDay: '[നാളെ] LT',
					nextWeek: 'dddd, LT',
					lastDay: '[ഇന്നലെ] LT',
					lastWeek: '[കഴിഞ്ഞ] dddd, LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s കഴിഞ്ഞ്',
					past: '%s മുൻപ്',
					s: 'അൽപ നിമിഷങ്ങൾ',
					m: 'ഒരു മിനിറ്റ്',
					mm: '%d മിനിറ്റ്',
					h: 'ഒരു മണിക്കൂർ',
					hh: '%d മണിക്കൂർ',
					d: 'ഒരു ദിവസം',
					dd: '%d ദിവസം',
					M: 'ഒരു മാസം',
					MM: '%d മാസം',
					y: 'ഒരു വർഷം',
					yy: '%d വർഷം'
				},
				meridiemParse: /രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if ((meridiem === 'രാത്രി' && hour >= 4) ||
						meridiem === 'ഉച്ച കഴിഞ്ഞ്' ||
						meridiem === 'വൈകുന്നേരം') {
						return hour + 12;
					} else {
						return hour;
					}
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 4) {
						return 'രാത്രി';
					} else if (hour < 12) {
						return 'രാവിലെ';
					} else if (hour < 17) {
						return 'ഉച്ച കഴിഞ്ഞ്';
					} else if (hour < 20) {
						return 'വൈകുന്നേരം';
					} else {
						return 'രാത്രി';
					}
				}
			});

			return ml;

		})));


		/***/
	}),
	/* 75 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Marathi [mr]
//! author : Harshad Kale : https://github.com/kalehv
//! author : Vivek Athalye : https://github.com/vnathalye

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var symbolMap = {
				'1': '१',
				'2': '२',
				'3': '३',
				'4': '४',
				'5': '५',
				'6': '६',
				'7': '७',
				'8': '८',
				'9': '९',
				'0': '०'
			};
			var numberMap = {
				'१': '1',
				'२': '2',
				'३': '3',
				'४': '4',
				'५': '5',
				'६': '6',
				'७': '7',
				'८': '8',
				'९': '9',
				'०': '0'
			};

			function relativeTimeMr(number, withoutSuffix, string, isFuture) {
				var output = '';
				if (withoutSuffix) {
					switch (string) {
						case 's':
							output = 'काही सेकंद';
							break;
						case 'm':
							output = 'एक मिनिट';
							break;
						case 'mm':
							output = '%d मिनिटे';
							break;
						case 'h':
							output = 'एक तास';
							break;
						case 'hh':
							output = '%d तास';
							break;
						case 'd':
							output = 'एक दिवस';
							break;
						case 'dd':
							output = '%d दिवस';
							break;
						case 'M':
							output = 'एक महिना';
							break;
						case 'MM':
							output = '%d महिने';
							break;
						case 'y':
							output = 'एक वर्ष';
							break;
						case 'yy':
							output = '%d वर्षे';
							break;
					}
				}
				else {
					switch (string) {
						case 's':
							output = 'काही सेकंदां';
							break;
						case 'm':
							output = 'एका मिनिटा';
							break;
						case 'mm':
							output = '%d मिनिटां';
							break;
						case 'h':
							output = 'एका तासा';
							break;
						case 'hh':
							output = '%d तासां';
							break;
						case 'd':
							output = 'एका दिवसा';
							break;
						case 'dd':
							output = '%d दिवसां';
							break;
						case 'M':
							output = 'एका महिन्या';
							break;
						case 'MM':
							output = '%d महिन्यां';
							break;
						case 'y':
							output = 'एका वर्षा';
							break;
						case 'yy':
							output = '%d वर्षां';
							break;
					}
				}
				return output.replace(/%d/i, number);
			}

			var mr = moment.defineLocale('mr', {
				months: 'जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर'.split('_'),
				monthsShort: 'जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.'.split('_'),
				monthsParseExact: true,
				weekdays: 'रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
				weekdaysShort: 'रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि'.split('_'),
				weekdaysMin: 'र_सो_मं_बु_गु_शु_श'.split('_'),
				longDateFormat: {
					LT: 'A h:mm वाजता',
					LTS: 'A h:mm:ss वाजता',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY, A h:mm वाजता',
					LLLL: 'dddd, D MMMM YYYY, A h:mm वाजता'
				},
				calendar: {
					sameDay: '[आज] LT',
					nextDay: '[उद्या] LT',
					nextWeek: 'dddd, LT',
					lastDay: '[काल] LT',
					lastWeek: '[मागील] dddd, LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%sमध्ये',
					past: '%sपूर्वी',
					s: relativeTimeMr,
					m: relativeTimeMr,
					mm: relativeTimeMr,
					h: relativeTimeMr,
					hh: relativeTimeMr,
					d: relativeTimeMr,
					dd: relativeTimeMr,
					M: relativeTimeMr,
					MM: relativeTimeMr,
					y: relativeTimeMr,
					yy: relativeTimeMr
				},
				preparse: function (string) {
					return string.replace(/[१२३४५६७८९०]/g, function (match) {
						return numberMap[match];
					});
				},
				postformat: function (string) {
					return string.replace(/\d/g, function (match) {
						return symbolMap[match];
					});
				},
				meridiemParse: /रात्री|सकाळी|दुपारी|सायंकाळी/,
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if (meridiem === 'रात्री') {
						return hour < 4 ? hour : hour + 12;
					} else if (meridiem === 'सकाळी') {
						return hour;
					} else if (meridiem === 'दुपारी') {
						return hour >= 10 ? hour : hour + 12;
					} else if (meridiem === 'सायंकाळी') {
						return hour + 12;
					}
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 4) {
						return 'रात्री';
					} else if (hour < 10) {
						return 'सकाळी';
					} else if (hour < 17) {
						return 'दुपारी';
					} else if (hour < 20) {
						return 'सायंकाळी';
					} else {
						return 'रात्री';
					}
				},
				week: {
					dow: 0, // Sunday is the first day of the week.
					doy: 6  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return mr;

		})));


		/***/
	}),
	/* 76 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Malay [ms]
//! author : Weldan Jamili : https://github.com/weldan

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var ms = moment.defineLocale('ms', {
				months: 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
				monthsShort: 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
				weekdays: 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
				weekdaysShort: 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
				weekdaysMin: 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
				longDateFormat: {
					LT: 'HH.mm',
					LTS: 'HH.mm.ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY [pukul] HH.mm',
					LLLL: 'dddd, D MMMM YYYY [pukul] HH.mm'
				},
				meridiemParse: /pagi|tengahari|petang|malam/,
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if (meridiem === 'pagi') {
						return hour;
					} else if (meridiem === 'tengahari') {
						return hour >= 11 ? hour : hour + 12;
					} else if (meridiem === 'petang' || meridiem === 'malam') {
						return hour + 12;
					}
				},
				meridiem: function (hours, minutes, isLower) {
					if (hours < 11) {
						return 'pagi';
					} else if (hours < 15) {
						return 'tengahari';
					} else if (hours < 19) {
						return 'petang';
					} else {
						return 'malam';
					}
				},
				calendar: {
					sameDay: '[Hari ini pukul] LT',
					nextDay: '[Esok pukul] LT',
					nextWeek: 'dddd [pukul] LT',
					lastDay: '[Kelmarin pukul] LT',
					lastWeek: 'dddd [lepas pukul] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'dalam %s',
					past: '%s yang lepas',
					s: 'beberapa saat',
					m: 'seminit',
					mm: '%d minit',
					h: 'sejam',
					hh: '%d jam',
					d: 'sehari',
					dd: '%d hari',
					M: 'sebulan',
					MM: '%d bulan',
					y: 'setahun',
					yy: '%d tahun'
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return ms;

		})));


		/***/
	}),
	/* 77 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Malay [ms-my]
//! note : DEPRECATED, the correct one is [ms]
//! author : Weldan Jamili : https://github.com/weldan

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var msMy = moment.defineLocale('ms-my', {
				months: 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
				monthsShort: 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
				weekdays: 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
				weekdaysShort: 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
				weekdaysMin: 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
				longDateFormat: {
					LT: 'HH.mm',
					LTS: 'HH.mm.ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY [pukul] HH.mm',
					LLLL: 'dddd, D MMMM YYYY [pukul] HH.mm'
				},
				meridiemParse: /pagi|tengahari|petang|malam/,
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if (meridiem === 'pagi') {
						return hour;
					} else if (meridiem === 'tengahari') {
						return hour >= 11 ? hour : hour + 12;
					} else if (meridiem === 'petang' || meridiem === 'malam') {
						return hour + 12;
					}
				},
				meridiem: function (hours, minutes, isLower) {
					if (hours < 11) {
						return 'pagi';
					} else if (hours < 15) {
						return 'tengahari';
					} else if (hours < 19) {
						return 'petang';
					} else {
						return 'malam';
					}
				},
				calendar: {
					sameDay: '[Hari ini pukul] LT',
					nextDay: '[Esok pukul] LT',
					nextWeek: 'dddd [pukul] LT',
					lastDay: '[Kelmarin pukul] LT',
					lastWeek: 'dddd [lepas pukul] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'dalam %s',
					past: '%s yang lepas',
					s: 'beberapa saat',
					m: 'seminit',
					mm: '%d minit',
					h: 'sejam',
					hh: '%d jam',
					d: 'sehari',
					dd: '%d hari',
					M: 'sebulan',
					MM: '%d bulan',
					y: 'setahun',
					yy: '%d tahun'
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return msMy;

		})));


		/***/
	}),
	/* 78 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Burmese [my]
//! author : Squar team, mysquar.com
//! author : David Rossellat : https://github.com/gholadr
//! author : Tin Aung Lin : https://github.com/thanyawzinmin

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var symbolMap = {
				'1': '၁',
				'2': '၂',
				'3': '၃',
				'4': '၄',
				'5': '၅',
				'6': '၆',
				'7': '၇',
				'8': '၈',
				'9': '၉',
				'0': '၀'
			};
			var numberMap = {
				'၁': '1',
				'၂': '2',
				'၃': '3',
				'၄': '4',
				'၅': '5',
				'၆': '6',
				'၇': '7',
				'၈': '8',
				'၉': '9',
				'၀': '0'
			};

			var my = moment.defineLocale('my', {
				months: 'ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ'.split('_'),
				monthsShort: 'ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ'.split('_'),
				weekdays: 'တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ'.split('_'),
				weekdaysShort: 'နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),
				weekdaysMin: 'နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),

				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[ယနေ.] LT [မှာ]',
					nextDay: '[မနက်ဖြန်] LT [မှာ]',
					nextWeek: 'dddd LT [မှာ]',
					lastDay: '[မနေ.က] LT [မှာ]',
					lastWeek: '[ပြီးခဲ့သော] dddd LT [မှာ]',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'လာမည့် %s မှာ',
					past: 'လွန်ခဲ့သော %s က',
					s: 'စက္ကန်.အနည်းငယ်',
					m: 'တစ်မိနစ်',
					mm: '%d မိနစ်',
					h: 'တစ်နာရီ',
					hh: '%d နာရီ',
					d: 'တစ်ရက်',
					dd: '%d ရက်',
					M: 'တစ်လ',
					MM: '%d လ',
					y: 'တစ်နှစ်',
					yy: '%d နှစ်'
				},
				preparse: function (string) {
					return string.replace(/[၁၂၃၄၅၆၇၈၉၀]/g, function (match) {
						return numberMap[match];
					});
				},
				postformat: function (string) {
					return string.replace(/\d/g, function (match) {
						return symbolMap[match];
					});
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4 // The week that contains Jan 1st is the first week of the year.
				}
			});

			return my;

		})));


		/***/
	}),
	/* 79 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Norwegian Bokmål [nb]
//! authors : Espen Hovlandsdal : https://github.com/rexxars
//!           Sigurd Gartmann : https://github.com/sigurdga

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var nb = moment.defineLocale('nb', {
				months: 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
				monthsShort: 'jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.'.split('_'),
				monthsParseExact: true,
				weekdays: 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
				weekdaysShort: 'sø._ma._ti._on._to._fr._lø.'.split('_'),
				weekdaysMin: 'sø_ma_ti_on_to_fr_lø'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D. MMMM YYYY',
					LLL: 'D. MMMM YYYY [kl.] HH:mm',
					LLLL: 'dddd D. MMMM YYYY [kl.] HH:mm'
				},
				calendar: {
					sameDay: '[i dag kl.] LT',
					nextDay: '[i morgen kl.] LT',
					nextWeek: 'dddd [kl.] LT',
					lastDay: '[i går kl.] LT',
					lastWeek: '[forrige] dddd [kl.] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'om %s',
					past: '%s siden',
					s: 'noen sekunder',
					m: 'ett minutt',
					mm: '%d minutter',
					h: 'en time',
					hh: '%d timer',
					d: 'en dag',
					dd: '%d dager',
					M: 'en måned',
					MM: '%d måneder',
					y: 'ett år',
					yy: '%d år'
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return nb;

		})));


		/***/
	}),
	/* 80 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Nepalese [ne]
//! author : suvash : https://github.com/suvash

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var symbolMap = {
				'1': '१',
				'2': '२',
				'3': '३',
				'4': '४',
				'5': '५',
				'6': '६',
				'7': '७',
				'8': '८',
				'9': '९',
				'0': '०'
			};
			var numberMap = {
				'१': '1',
				'२': '2',
				'३': '3',
				'४': '4',
				'५': '5',
				'६': '6',
				'७': '7',
				'८': '8',
				'९': '9',
				'०': '0'
			};

			var ne = moment.defineLocale('ne', {
				months: 'जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर'.split('_'),
				monthsShort: 'जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.'.split('_'),
				monthsParseExact: true,
				weekdays: 'आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार'.split('_'),
				weekdaysShort: 'आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.'.split('_'),
				weekdaysMin: 'आ._सो._मं._बु._बि._शु._श.'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'Aको h:mm बजे',
					LTS: 'Aको h:mm:ss बजे',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY, Aको h:mm बजे',
					LLLL: 'dddd, D MMMM YYYY, Aको h:mm बजे'
				},
				preparse: function (string) {
					return string.replace(/[१२३४५६७८९०]/g, function (match) {
						return numberMap[match];
					});
				},
				postformat: function (string) {
					return string.replace(/\d/g, function (match) {
						return symbolMap[match];
					});
				},
				meridiemParse: /राति|बिहान|दिउँसो|साँझ/,
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if (meridiem === 'राति') {
						return hour < 4 ? hour : hour + 12;
					} else if (meridiem === 'बिहान') {
						return hour;
					} else if (meridiem === 'दिउँसो') {
						return hour >= 10 ? hour : hour + 12;
					} else if (meridiem === 'साँझ') {
						return hour + 12;
					}
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 3) {
						return 'राति';
					} else if (hour < 12) {
						return 'बिहान';
					} else if (hour < 16) {
						return 'दिउँसो';
					} else if (hour < 20) {
						return 'साँझ';
					} else {
						return 'राति';
					}
				},
				calendar: {
					sameDay: '[आज] LT',
					nextDay: '[भोलि] LT',
					nextWeek: '[आउँदो] dddd[,] LT',
					lastDay: '[हिजो] LT',
					lastWeek: '[गएको] dddd[,] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%sमा',
					past: '%s अगाडि',
					s: 'केही क्षण',
					m: 'एक मिनेट',
					mm: '%d मिनेट',
					h: 'एक घण्टा',
					hh: '%d घण्टा',
					d: 'एक दिन',
					dd: '%d दिन',
					M: 'एक महिना',
					MM: '%d महिना',
					y: 'एक बर्ष',
					yy: '%d बर्ष'
				},
				week: {
					dow: 0, // Sunday is the first day of the week.
					doy: 6  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return ne;

		})));


		/***/
	}),
	/* 81 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Dutch [nl]
//! author : Joris Röling : https://github.com/jorisroling
//! author : Jacob Middag : https://github.com/middagj

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_');
			var monthsShortWithoutDots = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

			var monthsParse = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
			var monthsRegex = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

			var nl = moment.defineLocale('nl', {
				months: 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
				monthsShort: function (m, format) {
					if (!m) {
						return monthsShortWithDots;
					} else if (/-MMM-/.test(format)) {
						return monthsShortWithoutDots[m.month()];
					} else {
						return monthsShortWithDots[m.month()];
					}
				},

				monthsRegex: monthsRegex,
				monthsShortRegex: monthsRegex,
				monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
				monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

				monthsParse: monthsParse,
				longMonthsParse: monthsParse,
				shortMonthsParse: monthsParse,

				weekdays: 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
				weekdaysShort: 'zo._ma._di._wo._do._vr._za.'.split('_'),
				weekdaysMin: 'zo_ma_di_wo_do_vr_za'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD-MM-YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[vandaag om] LT',
					nextDay: '[morgen om] LT',
					nextWeek: 'dddd [om] LT',
					lastDay: '[gisteren om] LT',
					lastWeek: '[afgelopen] dddd [om] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'over %s',
					past: '%s geleden',
					s: 'een paar seconden',
					m: 'één minuut',
					mm: '%d minuten',
					h: 'één uur',
					hh: '%d uur',
					d: 'één dag',
					dd: '%d dagen',
					M: 'één maand',
					MM: '%d maanden',
					y: 'één jaar',
					yy: '%d jaar'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
				ordinal: function (number) {
					return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return nl;

		})));


		/***/
	}),
	/* 82 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Dutch (Belgium) [nl-be]
//! author : Joris Röling : https://github.com/jorisroling
//! author : Jacob Middag : https://github.com/middagj

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_');
			var monthsShortWithoutDots = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

			var monthsParse = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
			var monthsRegex = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

			var nlBe = moment.defineLocale('nl-be', {
				months: 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
				monthsShort: function (m, format) {
					if (!m) {
						return monthsShortWithDots;
					} else if (/-MMM-/.test(format)) {
						return monthsShortWithoutDots[m.month()];
					} else {
						return monthsShortWithDots[m.month()];
					}
				},

				monthsRegex: monthsRegex,
				monthsShortRegex: monthsRegex,
				monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
				monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

				monthsParse: monthsParse,
				longMonthsParse: monthsParse,
				shortMonthsParse: monthsParse,

				weekdays: 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
				weekdaysShort: 'zo._ma._di._wo._do._vr._za.'.split('_'),
				weekdaysMin: 'zo_ma_di_wo_do_vr_za'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[vandaag om] LT',
					nextDay: '[morgen om] LT',
					nextWeek: 'dddd [om] LT',
					lastDay: '[gisteren om] LT',
					lastWeek: '[afgelopen] dddd [om] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'over %s',
					past: '%s geleden',
					s: 'een paar seconden',
					m: 'één minuut',
					mm: '%d minuten',
					h: 'één uur',
					hh: '%d uur',
					d: 'één dag',
					dd: '%d dagen',
					M: 'één maand',
					MM: '%d maanden',
					y: 'één jaar',
					yy: '%d jaar'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
				ordinal: function (number) {
					return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return nlBe;

		})));


		/***/
	}),
	/* 83 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Nynorsk [nn]
//! author : https://github.com/mechuwind

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var nn = moment.defineLocale('nn', {
				months: 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
				monthsShort: 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
				weekdays: 'sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag'.split('_'),
				weekdaysShort: 'sun_mån_tys_ons_tor_fre_lau'.split('_'),
				weekdaysMin: 'su_må_ty_on_to_fr_lø'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D. MMMM YYYY',
					LLL: 'D. MMMM YYYY [kl.] H:mm',
					LLLL: 'dddd D. MMMM YYYY [kl.] HH:mm'
				},
				calendar: {
					sameDay: '[I dag klokka] LT',
					nextDay: '[I morgon klokka] LT',
					nextWeek: 'dddd [klokka] LT',
					lastDay: '[I går klokka] LT',
					lastWeek: '[Føregåande] dddd [klokka] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'om %s',
					past: '%s sidan',
					s: 'nokre sekund',
					m: 'eit minutt',
					mm: '%d minutt',
					h: 'ein time',
					hh: '%d timar',
					d: 'ein dag',
					dd: '%d dagar',
					M: 'ein månad',
					MM: '%d månader',
					y: 'eit år',
					yy: '%d år'
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return nn;

		})));


		/***/
	}),
	/* 84 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Punjabi (India) [pa-in]
//! author : Harpreet Singh : https://github.com/harpreetkhalsagtbit

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var symbolMap = {
				'1': '੧',
				'2': '੨',
				'3': '੩',
				'4': '੪',
				'5': '੫',
				'6': '੬',
				'7': '੭',
				'8': '੮',
				'9': '੯',
				'0': '੦'
			};
			var numberMap = {
				'੧': '1',
				'੨': '2',
				'੩': '3',
				'੪': '4',
				'੫': '5',
				'੬': '6',
				'੭': '7',
				'੮': '8',
				'੯': '9',
				'੦': '0'
			};

			var paIn = moment.defineLocale('pa-in', {
				// There are months name as per Nanakshahi Calender but they are not used as rigidly in modern Punjabi.
				months: 'ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ'.split('_'),
				monthsShort: 'ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ'.split('_'),
				weekdays: 'ਐਤਵਾਰ_ਸੋਮਵਾਰ_ਮੰਗਲਵਾਰ_ਬੁਧਵਾਰ_ਵੀਰਵਾਰ_ਸ਼ੁੱਕਰਵਾਰ_ਸ਼ਨੀਚਰਵਾਰ'.split('_'),
				weekdaysShort: 'ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ'.split('_'),
				weekdaysMin: 'ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ'.split('_'),
				longDateFormat: {
					LT: 'A h:mm ਵਜੇ',
					LTS: 'A h:mm:ss ਵਜੇ',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY, A h:mm ਵਜੇ',
					LLLL: 'dddd, D MMMM YYYY, A h:mm ਵਜੇ'
				},
				calendar: {
					sameDay: '[ਅਜ] LT',
					nextDay: '[ਕਲ] LT',
					nextWeek: 'dddd, LT',
					lastDay: '[ਕਲ] LT',
					lastWeek: '[ਪਿਛਲੇ] dddd, LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s ਵਿੱਚ',
					past: '%s ਪਿਛਲੇ',
					s: 'ਕੁਝ ਸਕਿੰਟ',
					m: 'ਇਕ ਮਿੰਟ',
					mm: '%d ਮਿੰਟ',
					h: 'ਇੱਕ ਘੰਟਾ',
					hh: '%d ਘੰਟੇ',
					d: 'ਇੱਕ ਦਿਨ',
					dd: '%d ਦਿਨ',
					M: 'ਇੱਕ ਮਹੀਨਾ',
					MM: '%d ਮਹੀਨੇ',
					y: 'ਇੱਕ ਸਾਲ',
					yy: '%d ਸਾਲ'
				},
				preparse: function (string) {
					return string.replace(/[੧੨੩੪੫੬੭੮੯੦]/g, function (match) {
						return numberMap[match];
					});
				},
				postformat: function (string) {
					return string.replace(/\d/g, function (match) {
						return symbolMap[match];
					});
				},
				// Punjabi notation for meridiems are quite fuzzy in practice. While there exists
				// a rigid notion of a 'Pahar' it is not used as rigidly in modern Punjabi.
				meridiemParse: /ਰਾਤ|ਸਵੇਰ|ਦੁਪਹਿਰ|ਸ਼ਾਮ/,
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if (meridiem === 'ਰਾਤ') {
						return hour < 4 ? hour : hour + 12;
					} else if (meridiem === 'ਸਵੇਰ') {
						return hour;
					} else if (meridiem === 'ਦੁਪਹਿਰ') {
						return hour >= 10 ? hour : hour + 12;
					} else if (meridiem === 'ਸ਼ਾਮ') {
						return hour + 12;
					}
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 4) {
						return 'ਰਾਤ';
					} else if (hour < 10) {
						return 'ਸਵੇਰ';
					} else if (hour < 17) {
						return 'ਦੁਪਹਿਰ';
					} else if (hour < 20) {
						return 'ਸ਼ਾਮ';
					} else {
						return 'ਰਾਤ';
					}
				},
				week: {
					dow: 0, // Sunday is the first day of the week.
					doy: 6  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return paIn;

		})));


		/***/
	}),
	/* 85 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Polish [pl]
//! author : Rafal Hirsz : https://github.com/evoL

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var monthsNominative = 'styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień'.split('_');
			var monthsSubjective = 'stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia'.split('_');

			function plural(n) {
				return (n % 10 < 5) && (n % 10 > 1) && ((~~(n / 10) % 10) !== 1);
			}

			function translate(number, withoutSuffix, key) {
				var result = number + ' ';
				switch (key) {
					case 'm':
						return withoutSuffix ? 'minuta' : 'minutę';
					case 'mm':
						return result + (plural(number) ? 'minuty' : 'minut');
					case 'h':
						return withoutSuffix ? 'godzina' : 'godzinę';
					case 'hh':
						return result + (plural(number) ? 'godziny' : 'godzin');
					case 'MM':
						return result + (plural(number) ? 'miesiące' : 'miesięcy');
					case 'yy':
						return result + (plural(number) ? 'lata' : 'lat');
				}
			}

			var pl = moment.defineLocale('pl', {
				months: function (momentToFormat, format) {
					if (!momentToFormat) {
						return monthsNominative;
					} else if (format === '') {
						// Hack: if format empty we know this is used to generate
						// RegExp by moment. Give then back both valid forms of months
						// in RegExp ready format.
						return '(' + monthsSubjective[momentToFormat.month()] + '|' + monthsNominative[momentToFormat.month()] + ')';
					} else if (/D MMMM/.test(format)) {
						return monthsSubjective[momentToFormat.month()];
					} else {
						return monthsNominative[momentToFormat.month()];
					}
				},
				monthsShort: 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
				weekdays: 'niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota'.split('_'),
				weekdaysShort: 'ndz_pon_wt_śr_czw_pt_sob'.split('_'),
				weekdaysMin: 'Nd_Pn_Wt_Śr_Cz_Pt_So'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd, D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[Dziś o] LT',
					nextDay: '[Jutro o] LT',
					nextWeek: function () {
						switch (this.day()) {
							case 0:
								return '[W niedzielę o] LT';

							case 2:
								return '[We wtorek o] LT';

							case 3:
								return '[W środę o] LT';

							case 6:
								return '[W sobotę o] LT';

							default:
								return '[W] dddd [o] LT';
						}
					},
					lastDay: '[Wczoraj o] LT',
					lastWeek: function () {
						switch (this.day()) {
							case 0:
								return '[W zeszłą niedzielę o] LT';
							case 3:
								return '[W zeszłą środę o] LT';
							case 6:
								return '[W zeszłą sobotę o] LT';
							default:
								return '[W zeszły] dddd [o] LT';
						}
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'za %s',
					past: '%s temu',
					s: 'kilka sekund',
					m: translate,
					mm: translate,
					h: translate,
					hh: translate,
					d: '1 dzień',
					dd: '%d dni',
					M: 'miesiąc',
					MM: translate,
					y: 'rok',
					yy: translate
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return pl;

		})));


		/***/
	}),
	/* 86 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Portuguese [pt]
//! author : Jefferson : https://github.com/jalex79

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var pt = moment.defineLocale('pt', {
				months: 'janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split('_'),
				monthsShort: 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
				weekdays: 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
				weekdaysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
				weekdaysMin: 'Do_2ª_3ª_4ª_5ª_6ª_Sá'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D [de] MMMM [de] YYYY',
					LLL: 'D [de] MMMM [de] YYYY HH:mm',
					LLLL: 'dddd, D [de] MMMM [de] YYYY HH:mm'
				},
				calendar: {
					sameDay: '[Hoje às] LT',
					nextDay: '[Amanhã às] LT',
					nextWeek: 'dddd [às] LT',
					lastDay: '[Ontem às] LT',
					lastWeek: function () {
						return (this.day() === 0 || this.day() === 6) ?
							'[Último] dddd [às] LT' : // Saturday + Sunday
							'[Última] dddd [às] LT'; // Monday - Friday
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'em %s',
					past: 'há %s',
					s: 'segundos',
					m: 'um minuto',
					mm: '%d minutos',
					h: 'uma hora',
					hh: '%d horas',
					d: 'um dia',
					dd: '%d dias',
					M: 'um mês',
					MM: '%d meses',
					y: 'um ano',
					yy: '%d anos'
				},
				dayOfMonthOrdinalParse: /\d{1,2}º/,
				ordinal: '%dº',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return pt;

		})));


		/***/
	}),
	/* 87 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Portuguese (Brazil) [pt-br]
//! author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var ptBr = moment.defineLocale('pt-br', {
				months: 'janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split('_'),
				monthsShort: 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
				weekdays: 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
				weekdaysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
				weekdaysMin: 'Do_2ª_3ª_4ª_5ª_6ª_Sá'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D [de] MMMM [de] YYYY',
					LLL: 'D [de] MMMM [de] YYYY [às] HH:mm',
					LLLL: 'dddd, D [de] MMMM [de] YYYY [às] HH:mm'
				},
				calendar: {
					sameDay: '[Hoje às] LT',
					nextDay: '[Amanhã às] LT',
					nextWeek: 'dddd [às] LT',
					lastDay: '[Ontem às] LT',
					lastWeek: function () {
						return (this.day() === 0 || this.day() === 6) ?
							'[Último] dddd [às] LT' : // Saturday + Sunday
							'[Última] dddd [às] LT'; // Monday - Friday
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'em %s',
					past: '%s atrás',
					s: 'poucos segundos',
					ss: '%d segundos',
					m: 'um minuto',
					mm: '%d minutos',
					h: 'uma hora',
					hh: '%d horas',
					d: 'um dia',
					dd: '%d dias',
					M: 'um mês',
					MM: '%d meses',
					y: 'um ano',
					yy: '%d anos'
				},
				dayOfMonthOrdinalParse: /\d{1,2}º/,
				ordinal: '%dº'
			});

			return ptBr;

		})));


		/***/
	}),
	/* 88 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Romanian [ro]
//! author : Vlad Gurdiga : https://github.com/gurdiga
//! author : Valentin Agachi : https://github.com/avaly

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			function relativeTimeWithPlural(number, withoutSuffix, key) {
				var format = {
						'mm': 'minute',
						'hh': 'ore',
						'dd': 'zile',
						'MM': 'luni',
						'yy': 'ani'
					},
					separator = ' ';
				if (number % 100 >= 20 || (number >= 100 && number % 100 === 0)) {
					separator = ' de ';
				}
				return number + separator + format[key];
			}

			var ro = moment.defineLocale('ro', {
				months: 'ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie'.split('_'),
				monthsShort: 'ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.'.split('_'),
				monthsParseExact: true,
				weekdays: 'duminică_luni_marți_miercuri_joi_vineri_sâmbătă'.split('_'),
				weekdaysShort: 'Dum_Lun_Mar_Mie_Joi_Vin_Sâm'.split('_'),
				weekdaysMin: 'Du_Lu_Ma_Mi_Jo_Vi_Sâ'.split('_'),
				longDateFormat: {
					LT: 'H:mm',
					LTS: 'H:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY H:mm',
					LLLL: 'dddd, D MMMM YYYY H:mm'
				},
				calendar: {
					sameDay: '[azi la] LT',
					nextDay: '[mâine la] LT',
					nextWeek: 'dddd [la] LT',
					lastDay: '[ieri la] LT',
					lastWeek: '[fosta] dddd [la] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'peste %s',
					past: '%s în urmă',
					s: 'câteva secunde',
					m: 'un minut',
					mm: relativeTimeWithPlural,
					h: 'o oră',
					hh: relativeTimeWithPlural,
					d: 'o zi',
					dd: relativeTimeWithPlural,
					M: 'o lună',
					MM: relativeTimeWithPlural,
					y: 'un an',
					yy: relativeTimeWithPlural
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return ro;

		})));


		/***/
	}),
	/* 89 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Russian [ru]
//! author : Viktorminator : https://github.com/Viktorminator
//! Author : Menelion Elensúle : https://github.com/Oire
//! author : Коренберг Марк : https://github.com/socketpair

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			function plural(word, num) {
				var forms = word.split('_');
				return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
			}

			function relativeTimeWithPlural(number, withoutSuffix, key) {
				var format = {
					'mm': withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
					'hh': 'час_часа_часов',
					'dd': 'день_дня_дней',
					'MM': 'месяц_месяца_месяцев',
					'yy': 'год_года_лет'
				};
				if (key === 'm') {
					return withoutSuffix ? 'минута' : 'минуту';
				}
				else {
					return number + ' ' + plural(format[key], +number);
				}
			}

			var monthsParse = [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[йя]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i];

// http://new.gramota.ru/spravka/rules/139-prop : § 103
// Сокращения месяцев: http://new.gramota.ru/spravka/buro/search-answer?s=242637
// CLDR data:          http://www.unicode.org/cldr/charts/28/summary/ru.html#1753
			var ru = moment.defineLocale('ru', {
				months: {
					format: 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_'),
					standalone: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_')
				},
				monthsShort: {
					// по CLDR именно "июл." и "июн.", но какой смысл менять букву на точку ?
					format: 'янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.'.split('_'),
					standalone: 'янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.'.split('_')
				},
				weekdays: {
					standalone: 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
					format: 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_'),
					isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/
				},
				weekdaysShort: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
				weekdaysMin: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
				monthsParse: monthsParse,
				longMonthsParse: monthsParse,
				shortMonthsParse: monthsParse,

				// полные названия с падежами, по три буквы, для некоторых, по 4 буквы, сокращения с точкой и без точки
				monthsRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

				// копия предыдущего
				monthsShortRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

				// полные названия с падежами
				monthsStrictRegex: /^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,

				// Выражение, которое соотвествует только сокращённым формам
				monthsShortStrictRegex: /^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D MMMM YYYY г.',
					LLL: 'D MMMM YYYY г., HH:mm',
					LLLL: 'dddd, D MMMM YYYY г., HH:mm'
				},
				calendar: {
					sameDay: '[Сегодня в] LT',
					nextDay: '[Завтра в] LT',
					lastDay: '[Вчера в] LT',
					nextWeek: function (now) {
						if (now.week() !== this.week()) {
							switch (this.day()) {
								case 0:
									return '[В следующее] dddd [в] LT';
								case 1:
								case 2:
								case 4:
									return '[В следующий] dddd [в] LT';
								case 3:
								case 5:
								case 6:
									return '[В следующую] dddd [в] LT';
							}
						} else {
							if (this.day() === 2) {
								return '[Во] dddd [в] LT';
							} else {
								return '[В] dddd [в] LT';
							}
						}
					},
					lastWeek: function (now) {
						if (now.week() !== this.week()) {
							switch (this.day()) {
								case 0:
									return '[В прошлое] dddd [в] LT';
								case 1:
								case 2:
								case 4:
									return '[В прошлый] dddd [в] LT';
								case 3:
								case 5:
								case 6:
									return '[В прошлую] dddd [в] LT';
							}
						} else {
							if (this.day() === 2) {
								return '[Во] dddd [в] LT';
							} else {
								return '[В] dddd [в] LT';
							}
						}
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'через %s',
					past: '%s назад',
					s: 'несколько секунд',
					m: relativeTimeWithPlural,
					mm: relativeTimeWithPlural,
					h: 'час',
					hh: relativeTimeWithPlural,
					d: 'день',
					dd: relativeTimeWithPlural,
					M: 'месяц',
					MM: relativeTimeWithPlural,
					y: 'год',
					yy: relativeTimeWithPlural
				},
				meridiemParse: /ночи|утра|дня|вечера/i,
				isPM: function (input) {
					return /^(дня|вечера)$/.test(input);
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 4) {
						return 'ночи';
					} else if (hour < 12) {
						return 'утра';
					} else if (hour < 17) {
						return 'дня';
					} else {
						return 'вечера';
					}
				},
				dayOfMonthOrdinalParse: /\d{1,2}-(й|го|я)/,
				ordinal: function (number, period) {
					switch (period) {
						case 'M':
						case 'd':
						case 'DDD':
							return number + '-й';
						case 'D':
							return number + '-го';
						case 'w':
						case 'W':
							return number + '-я';
						default:
							return number;
					}
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return ru;

		})));


		/***/
	}),
	/* 90 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Sindhi [sd]
//! author : Narain Sagar : https://github.com/narainsagar

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var months = [
				'جنوري',
				'فيبروري',
				'مارچ',
				'اپريل',
				'مئي',
				'جون',
				'جولاءِ',
				'آگسٽ',
				'سيپٽمبر',
				'آڪٽوبر',
				'نومبر',
				'ڊسمبر'
			];
			var days = [
				'آچر',
				'سومر',
				'اڱارو',
				'اربع',
				'خميس',
				'جمع',
				'ڇنڇر'
			];

			var sd = moment.defineLocale('sd', {
				months: months,
				monthsShort: months,
				weekdays: days,
				weekdaysShort: days,
				weekdaysMin: days,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd، D MMMM YYYY HH:mm'
				},
				meridiemParse: /صبح|شام/,
				isPM: function (input) {
					return 'شام' === input;
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 12) {
						return 'صبح';
					}
					return 'شام';
				},
				calendar: {
					sameDay: '[اڄ] LT',
					nextDay: '[سڀاڻي] LT',
					nextWeek: 'dddd [اڳين هفتي تي] LT',
					lastDay: '[ڪالهه] LT',
					lastWeek: '[گزريل هفتي] dddd [تي] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s پوء',
					past: '%s اڳ',
					s: 'چند سيڪنڊ',
					m: 'هڪ منٽ',
					mm: '%d منٽ',
					h: 'هڪ ڪلاڪ',
					hh: '%d ڪلاڪ',
					d: 'هڪ ڏينهن',
					dd: '%d ڏينهن',
					M: 'هڪ مهينو',
					MM: '%d مهينا',
					y: 'هڪ سال',
					yy: '%d سال'
				},
				preparse: function (string) {
					return string.replace(/،/g, ',');
				},
				postformat: function (string) {
					return string.replace(/,/g, '،');
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return sd;

		})));


		/***/
	}),
	/* 91 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Northern Sami [se]
//! authors : Bård Rolstad Henriksen : https://github.com/karamell

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var se = moment.defineLocale('se', {
				months: 'ođđajagemánnu_guovvamánnu_njukčamánnu_cuoŋománnu_miessemánnu_geassemánnu_suoidnemánnu_borgemánnu_čakčamánnu_golggotmánnu_skábmamánnu_juovlamánnu'.split('_'),
				monthsShort: 'ođđj_guov_njuk_cuo_mies_geas_suoi_borg_čakč_golg_skáb_juov'.split('_'),
				weekdays: 'sotnabeaivi_vuossárga_maŋŋebárga_gaskavahkku_duorastat_bearjadat_lávvardat'.split('_'),
				weekdaysShort: 'sotn_vuos_maŋ_gask_duor_bear_láv'.split('_'),
				weekdaysMin: 's_v_m_g_d_b_L'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'MMMM D. [b.] YYYY',
					LLL: 'MMMM D. [b.] YYYY [ti.] HH:mm',
					LLLL: 'dddd, MMMM D. [b.] YYYY [ti.] HH:mm'
				},
				calendar: {
					sameDay: '[otne ti] LT',
					nextDay: '[ihttin ti] LT',
					nextWeek: 'dddd [ti] LT',
					lastDay: '[ikte ti] LT',
					lastWeek: '[ovddit] dddd [ti] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s geažes',
					past: 'maŋit %s',
					s: 'moadde sekunddat',
					m: 'okta minuhta',
					mm: '%d minuhtat',
					h: 'okta diimmu',
					hh: '%d diimmut',
					d: 'okta beaivi',
					dd: '%d beaivvit',
					M: 'okta mánnu',
					MM: '%d mánut',
					y: 'okta jahki',
					yy: '%d jagit'
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return se;

		})));


		/***/
	}),
	/* 92 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Sinhalese [si]
//! author : Sampath Sitinamaluwa : https://github.com/sampathsris

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			/*jshint -W100*/
			var si = moment.defineLocale('si', {
				months: 'ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්'.split('_'),
				monthsShort: 'ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ'.split('_'),
				weekdays: 'ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා'.split('_'),
				weekdaysShort: 'ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන'.split('_'),
				weekdaysMin: 'ඉ_ස_අ_බ_බ්‍ර_සි_සෙ'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'a h:mm',
					LTS: 'a h:mm:ss',
					L: 'YYYY/MM/DD',
					LL: 'YYYY MMMM D',
					LLL: 'YYYY MMMM D, a h:mm',
					LLLL: 'YYYY MMMM D [වැනි] dddd, a h:mm:ss'
				},
				calendar: {
					sameDay: '[අද] LT[ට]',
					nextDay: '[හෙට] LT[ට]',
					nextWeek: 'dddd LT[ට]',
					lastDay: '[ඊයේ] LT[ට]',
					lastWeek: '[පසුගිය] dddd LT[ට]',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%sකින්',
					past: '%sකට පෙර',
					s: 'තත්පර කිහිපය',
					m: 'මිනිත්තුව',
					mm: 'මිනිත්තු %d',
					h: 'පැය',
					hh: 'පැය %d',
					d: 'දිනය',
					dd: 'දින %d',
					M: 'මාසය',
					MM: 'මාස %d',
					y: 'වසර',
					yy: 'වසර %d'
				},
				dayOfMonthOrdinalParse: /\d{1,2} වැනි/,
				ordinal: function (number) {
					return number + ' වැනි';
				},
				meridiemParse: /පෙර වරු|පස් වරු|පෙ.ව|ප.ව./,
				isPM: function (input) {
					return input === 'ප.ව.' || input === 'පස් වරු';
				},
				meridiem: function (hours, minutes, isLower) {
					if (hours > 11) {
						return isLower ? 'ප.ව.' : 'පස් වරු';
					} else {
						return isLower ? 'පෙ.ව.' : 'පෙර වරු';
					}
				}
			});

			return si;

		})));


		/***/
	}),
	/* 93 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Slovak [sk]
//! author : Martin Minka : https://github.com/k2s
//! based on work of petrbela : https://github.com/petrbela

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var months = 'január_február_marec_apríl_máj_jún_júl_august_september_október_november_december'.split('_');
			var monthsShort = 'jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec'.split('_');

			function plural(n) {
				return (n > 1) && (n < 5);
			}

			function translate(number, withoutSuffix, key, isFuture) {
				var result = number + ' ';
				switch (key) {
					case 's':  // a few seconds / in a few seconds / a few seconds ago
						return (withoutSuffix || isFuture) ? 'pár sekúnd' : 'pár sekundami';
					case 'm':  // a minute / in a minute / a minute ago
						return withoutSuffix ? 'minúta' : (isFuture ? 'minútu' : 'minútou');
					case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
						if (withoutSuffix || isFuture) {
							return result + (plural(number) ? 'minúty' : 'minút');
						} else {
							return result + 'minútami';
						}
						break;
					case 'h':  // an hour / in an hour / an hour ago
						return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
					case 'hh': // 9 hours / in 9 hours / 9 hours ago
						if (withoutSuffix || isFuture) {
							return result + (plural(number) ? 'hodiny' : 'hodín');
						} else {
							return result + 'hodinami';
						}
						break;
					case 'd':  // a day / in a day / a day ago
						return (withoutSuffix || isFuture) ? 'deň' : 'dňom';
					case 'dd': // 9 days / in 9 days / 9 days ago
						if (withoutSuffix || isFuture) {
							return result + (plural(number) ? 'dni' : 'dní');
						} else {
							return result + 'dňami';
						}
						break;
					case 'M':  // a month / in a month / a month ago
						return (withoutSuffix || isFuture) ? 'mesiac' : 'mesiacom';
					case 'MM': // 9 months / in 9 months / 9 months ago
						if (withoutSuffix || isFuture) {
							return result + (plural(number) ? 'mesiace' : 'mesiacov');
						} else {
							return result + 'mesiacmi';
						}
						break;
					case 'y':  // a year / in a year / a year ago
						return (withoutSuffix || isFuture) ? 'rok' : 'rokom';
					case 'yy': // 9 years / in 9 years / 9 years ago
						if (withoutSuffix || isFuture) {
							return result + (plural(number) ? 'roky' : 'rokov');
						} else {
							return result + 'rokmi';
						}
						break;
				}
			}

			var sk = moment.defineLocale('sk', {
				months: months,
				monthsShort: monthsShort,
				weekdays: 'nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota'.split('_'),
				weekdaysShort: 'ne_po_ut_st_št_pi_so'.split('_'),
				weekdaysMin: 'ne_po_ut_st_št_pi_so'.split('_'),
				longDateFormat: {
					LT: 'H:mm',
					LTS: 'H:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D. MMMM YYYY',
					LLL: 'D. MMMM YYYY H:mm',
					LLLL: 'dddd D. MMMM YYYY H:mm'
				},
				calendar: {
					sameDay: '[dnes o] LT',
					nextDay: '[zajtra o] LT',
					nextWeek: function () {
						switch (this.day()) {
							case 0:
								return '[v nedeľu o] LT';
							case 1:
							case 2:
								return '[v] dddd [o] LT';
							case 3:
								return '[v stredu o] LT';
							case 4:
								return '[vo štvrtok o] LT';
							case 5:
								return '[v piatok o] LT';
							case 6:
								return '[v sobotu o] LT';
						}
					},
					lastDay: '[včera o] LT',
					lastWeek: function () {
						switch (this.day()) {
							case 0:
								return '[minulú nedeľu o] LT';
							case 1:
							case 2:
								return '[minulý] dddd [o] LT';
							case 3:
								return '[minulú stredu o] LT';
							case 4:
							case 5:
								return '[minulý] dddd [o] LT';
							case 6:
								return '[minulú sobotu o] LT';
						}
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'za %s',
					past: 'pred %s',
					s: translate,
					m: translate,
					mm: translate,
					h: translate,
					hh: translate,
					d: translate,
					dd: translate,
					M: translate,
					MM: translate,
					y: translate,
					yy: translate
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return sk;

		})));


		/***/
	}),
	/* 94 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Slovenian [sl]
//! author : Robert Sedovšek : https://github.com/sedovsek

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			function processRelativeTime(number, withoutSuffix, key, isFuture) {
				var result = number + ' ';
				switch (key) {
					case 's':
						return withoutSuffix || isFuture ? 'nekaj sekund' : 'nekaj sekundami';
					case 'm':
						return withoutSuffix ? 'ena minuta' : 'eno minuto';
					case 'mm':
						if (number === 1) {
							result += withoutSuffix ? 'minuta' : 'minuto';
						} else if (number === 2) {
							result += withoutSuffix || isFuture ? 'minuti' : 'minutama';
						} else if (number < 5) {
							result += withoutSuffix || isFuture ? 'minute' : 'minutami';
						} else {
							result += withoutSuffix || isFuture ? 'minut' : 'minutami';
						}
						return result;
					case 'h':
						return withoutSuffix ? 'ena ura' : 'eno uro';
					case 'hh':
						if (number === 1) {
							result += withoutSuffix ? 'ura' : 'uro';
						} else if (number === 2) {
							result += withoutSuffix || isFuture ? 'uri' : 'urama';
						} else if (number < 5) {
							result += withoutSuffix || isFuture ? 'ure' : 'urami';
						} else {
							result += withoutSuffix || isFuture ? 'ur' : 'urami';
						}
						return result;
					case 'd':
						return withoutSuffix || isFuture ? 'en dan' : 'enim dnem';
					case 'dd':
						if (number === 1) {
							result += withoutSuffix || isFuture ? 'dan' : 'dnem';
						} else if (number === 2) {
							result += withoutSuffix || isFuture ? 'dni' : 'dnevoma';
						} else {
							result += withoutSuffix || isFuture ? 'dni' : 'dnevi';
						}
						return result;
					case 'M':
						return withoutSuffix || isFuture ? 'en mesec' : 'enim mesecem';
					case 'MM':
						if (number === 1) {
							result += withoutSuffix || isFuture ? 'mesec' : 'mesecem';
						} else if (number === 2) {
							result += withoutSuffix || isFuture ? 'meseca' : 'mesecema';
						} else if (number < 5) {
							result += withoutSuffix || isFuture ? 'mesece' : 'meseci';
						} else {
							result += withoutSuffix || isFuture ? 'mesecev' : 'meseci';
						}
						return result;
					case 'y':
						return withoutSuffix || isFuture ? 'eno leto' : 'enim letom';
					case 'yy':
						if (number === 1) {
							result += withoutSuffix || isFuture ? 'leto' : 'letom';
						} else if (number === 2) {
							result += withoutSuffix || isFuture ? 'leti' : 'letoma';
						} else if (number < 5) {
							result += withoutSuffix || isFuture ? 'leta' : 'leti';
						} else {
							result += withoutSuffix || isFuture ? 'let' : 'leti';
						}
						return result;
				}
			}

			var sl = moment.defineLocale('sl', {
				months: 'januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december'.split('_'),
				monthsShort: 'jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.'.split('_'),
				monthsParseExact: true,
				weekdays: 'nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota'.split('_'),
				weekdaysShort: 'ned._pon._tor._sre._čet._pet._sob.'.split('_'),
				weekdaysMin: 'ne_po_to_sr_če_pe_so'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'H:mm',
					LTS: 'H:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D. MMMM YYYY',
					LLL: 'D. MMMM YYYY H:mm',
					LLLL: 'dddd, D. MMMM YYYY H:mm'
				},
				calendar: {
					sameDay: '[danes ob] LT',
					nextDay: '[jutri ob] LT',

					nextWeek: function () {
						switch (this.day()) {
							case 0:
								return '[v] [nedeljo] [ob] LT';
							case 3:
								return '[v] [sredo] [ob] LT';
							case 6:
								return '[v] [soboto] [ob] LT';
							case 1:
							case 2:
							case 4:
							case 5:
								return '[v] dddd [ob] LT';
						}
					},
					lastDay: '[včeraj ob] LT',
					lastWeek: function () {
						switch (this.day()) {
							case 0:
								return '[prejšnjo] [nedeljo] [ob] LT';
							case 3:
								return '[prejšnjo] [sredo] [ob] LT';
							case 6:
								return '[prejšnjo] [soboto] [ob] LT';
							case 1:
							case 2:
							case 4:
							case 5:
								return '[prejšnji] dddd [ob] LT';
						}
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'čez %s',
					past: 'pred %s',
					s: processRelativeTime,
					m: processRelativeTime,
					mm: processRelativeTime,
					h: processRelativeTime,
					hh: processRelativeTime,
					d: processRelativeTime,
					dd: processRelativeTime,
					M: processRelativeTime,
					MM: processRelativeTime,
					y: processRelativeTime,
					yy: processRelativeTime
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return sl;

		})));


		/***/
	}),
	/* 95 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Albanian [sq]
//! author : Flakërim Ismani : https://github.com/flakerimi
//! author : Menelion Elensúle : https://github.com/Oire
//! author : Oerd Cukalla : https://github.com/oerd

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var sq = moment.defineLocale('sq', {
				months: 'Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor'.split('_'),
				monthsShort: 'Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj'.split('_'),
				weekdays: 'E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë'.split('_'),
				weekdaysShort: 'Die_Hën_Mar_Mër_Enj_Pre_Sht'.split('_'),
				weekdaysMin: 'D_H_Ma_Më_E_P_Sh'.split('_'),
				weekdaysParseExact: true,
				meridiemParse: /PD|MD/,
				isPM: function (input) {
					return input.charAt(0) === 'M';
				},
				meridiem: function (hours, minutes, isLower) {
					return hours < 12 ? 'PD' : 'MD';
				},
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd, D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[Sot në] LT',
					nextDay: '[Nesër në] LT',
					nextWeek: 'dddd [në] LT',
					lastDay: '[Dje në] LT',
					lastWeek: 'dddd [e kaluar në] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'në %s',
					past: '%s më parë',
					s: 'disa sekonda',
					m: 'një minutë',
					mm: '%d minuta',
					h: 'një orë',
					hh: '%d orë',
					d: 'një ditë',
					dd: '%d ditë',
					M: 'një muaj',
					MM: '%d muaj',
					y: 'një vit',
					yy: '%d vite'
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return sq;

		})));


		/***/
	}),
	/* 96 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Serbian [sr]
//! author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var translator = {
				words: { //Different grammatical cases
					m: ['jedan minut', 'jedne minute'],
					mm: ['minut', 'minute', 'minuta'],
					h: ['jedan sat', 'jednog sata'],
					hh: ['sat', 'sata', 'sati'],
					dd: ['dan', 'dana', 'dana'],
					MM: ['mesec', 'meseca', 'meseci'],
					yy: ['godina', 'godine', 'godina']
				},
				correctGrammaticalCase: function (number, wordKey) {
					return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
				},
				translate: function (number, withoutSuffix, key) {
					var wordKey = translator.words[key];
					if (key.length === 1) {
						return withoutSuffix ? wordKey[0] : wordKey[1];
					} else {
						return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
					}
				}
			};

			var sr = moment.defineLocale('sr', {
				months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split('_'),
				monthsShort: 'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
				monthsParseExact: true,
				weekdays: 'nedelja_ponedeljak_utorak_sreda_četvrtak_petak_subota'.split('_'),
				weekdaysShort: 'ned._pon._uto._sre._čet._pet._sub.'.split('_'),
				weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'H:mm',
					LTS: 'H:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D. MMMM YYYY',
					LLL: 'D. MMMM YYYY H:mm',
					LLLL: 'dddd, D. MMMM YYYY H:mm'
				},
				calendar: {
					sameDay: '[danas u] LT',
					nextDay: '[sutra u] LT',
					nextWeek: function () {
						switch (this.day()) {
							case 0:
								return '[u] [nedelju] [u] LT';
							case 3:
								return '[u] [sredu] [u] LT';
							case 6:
								return '[u] [subotu] [u] LT';
							case 1:
							case 2:
							case 4:
							case 5:
								return '[u] dddd [u] LT';
						}
					},
					lastDay: '[juče u] LT',
					lastWeek: function () {
						var lastWeekDays = [
							'[prošle] [nedelje] [u] LT',
							'[prošlog] [ponedeljka] [u] LT',
							'[prošlog] [utorka] [u] LT',
							'[prošle] [srede] [u] LT',
							'[prošlog] [četvrtka] [u] LT',
							'[prošlog] [petka] [u] LT',
							'[prošle] [subote] [u] LT'
						];
						return lastWeekDays[this.day()];
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'za %s',
					past: 'pre %s',
					s: 'nekoliko sekundi',
					m: translator.translate,
					mm: translator.translate,
					h: translator.translate,
					hh: translator.translate,
					d: 'dan',
					dd: translator.translate,
					M: 'mesec',
					MM: translator.translate,
					y: 'godinu',
					yy: translator.translate
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return sr;

		})));


		/***/
	}),
	/* 97 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Serbian Cyrillic [sr-cyrl]
//! author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var translator = {
				words: { //Different grammatical cases
					m: ['један минут', 'једне минуте'],
					mm: ['минут', 'минуте', 'минута'],
					h: ['један сат', 'једног сата'],
					hh: ['сат', 'сата', 'сати'],
					dd: ['дан', 'дана', 'дана'],
					MM: ['месец', 'месеца', 'месеци'],
					yy: ['година', 'године', 'година']
				},
				correctGrammaticalCase: function (number, wordKey) {
					return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
				},
				translate: function (number, withoutSuffix, key) {
					var wordKey = translator.words[key];
					if (key.length === 1) {
						return withoutSuffix ? wordKey[0] : wordKey[1];
					} else {
						return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
					}
				}
			};

			var srCyrl = moment.defineLocale('sr-cyrl', {
				months: 'јануар_фебруар_март_април_мај_јун_јул_август_септембар_октобар_новембар_децембар'.split('_'),
				monthsShort: 'јан._феб._мар._апр._мај_јун_јул_авг._сеп._окт._нов._дец.'.split('_'),
				monthsParseExact: true,
				weekdays: 'недеља_понедељак_уторак_среда_четвртак_петак_субота'.split('_'),
				weekdaysShort: 'нед._пон._уто._сре._чет._пет._суб.'.split('_'),
				weekdaysMin: 'не_по_ут_ср_че_пе_су'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'H:mm',
					LTS: 'H:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D. MMMM YYYY',
					LLL: 'D. MMMM YYYY H:mm',
					LLLL: 'dddd, D. MMMM YYYY H:mm'
				},
				calendar: {
					sameDay: '[данас у] LT',
					nextDay: '[сутра у] LT',
					nextWeek: function () {
						switch (this.day()) {
							case 0:
								return '[у] [недељу] [у] LT';
							case 3:
								return '[у] [среду] [у] LT';
							case 6:
								return '[у] [суботу] [у] LT';
							case 1:
							case 2:
							case 4:
							case 5:
								return '[у] dddd [у] LT';
						}
					},
					lastDay: '[јуче у] LT',
					lastWeek: function () {
						var lastWeekDays = [
							'[прошле] [недеље] [у] LT',
							'[прошлог] [понедељка] [у] LT',
							'[прошлог] [уторка] [у] LT',
							'[прошле] [среде] [у] LT',
							'[прошлог] [четвртка] [у] LT',
							'[прошлог] [петка] [у] LT',
							'[прошле] [суботе] [у] LT'
						];
						return lastWeekDays[this.day()];
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'за %s',
					past: 'пре %s',
					s: 'неколико секунди',
					m: translator.translate,
					mm: translator.translate,
					h: translator.translate,
					hh: translator.translate,
					d: 'дан',
					dd: translator.translate,
					M: 'месец',
					MM: translator.translate,
					y: 'годину',
					yy: translator.translate
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return srCyrl;

		})));


		/***/
	}),
	/* 98 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : siSwati [ss]
//! author : Nicolai Davies<mail@nicolai.io> : https://github.com/nicolaidavies

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var ss = moment.defineLocale('ss', {
				months: "Bhimbidvwane_Indlovana_Indlov'lenkhulu_Mabasa_Inkhwekhweti_Inhlaba_Kholwane_Ingci_Inyoni_Imphala_Lweti_Ingongoni".split('_'),
				monthsShort: 'Bhi_Ina_Inu_Mab_Ink_Inh_Kho_Igc_Iny_Imp_Lwe_Igo'.split('_'),
				weekdays: 'Lisontfo_Umsombuluko_Lesibili_Lesitsatfu_Lesine_Lesihlanu_Umgcibelo'.split('_'),
				weekdaysShort: 'Lis_Umb_Lsb_Les_Lsi_Lsh_Umg'.split('_'),
				weekdaysMin: 'Li_Us_Lb_Lt_Ls_Lh_Ug'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'h:mm A',
					LTS: 'h:mm:ss A',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY h:mm A',
					LLLL: 'dddd, D MMMM YYYY h:mm A'
				},
				calendar: {
					sameDay: '[Namuhla nga] LT',
					nextDay: '[Kusasa nga] LT',
					nextWeek: 'dddd [nga] LT',
					lastDay: '[Itolo nga] LT',
					lastWeek: 'dddd [leliphelile] [nga] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'nga %s',
					past: 'wenteka nga %s',
					s: 'emizuzwana lomcane',
					m: 'umzuzu',
					mm: '%d emizuzu',
					h: 'lihora',
					hh: '%d emahora',
					d: 'lilanga',
					dd: '%d emalanga',
					M: 'inyanga',
					MM: '%d tinyanga',
					y: 'umnyaka',
					yy: '%d iminyaka'
				},
				meridiemParse: /ekuseni|emini|entsambama|ebusuku/,
				meridiem: function (hours, minutes, isLower) {
					if (hours < 11) {
						return 'ekuseni';
					} else if (hours < 15) {
						return 'emini';
					} else if (hours < 19) {
						return 'entsambama';
					} else {
						return 'ebusuku';
					}
				},
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if (meridiem === 'ekuseni') {
						return hour;
					} else if (meridiem === 'emini') {
						return hour >= 11 ? hour : hour + 12;
					} else if (meridiem === 'entsambama' || meridiem === 'ebusuku') {
						if (hour === 0) {
							return 0;
						}
						return hour + 12;
					}
				},
				dayOfMonthOrdinalParse: /\d{1,2}/,
				ordinal: '%d',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return ss;

		})));


		/***/
	}),
	/* 99 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Swedish [sv]
//! author : Jens Alm : https://github.com/ulmus

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var sv = moment.defineLocale('sv', {
				months: 'januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december'.split('_'),
				monthsShort: 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
				weekdays: 'söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag'.split('_'),
				weekdaysShort: 'sön_mån_tis_ons_tor_fre_lör'.split('_'),
				weekdaysMin: 'sö_må_ti_on_to_fr_lö'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'YYYY-MM-DD',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY [kl.] HH:mm',
					LLLL: 'dddd D MMMM YYYY [kl.] HH:mm',
					lll: 'D MMM YYYY HH:mm',
					llll: 'ddd D MMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[Idag] LT',
					nextDay: '[Imorgon] LT',
					lastDay: '[Igår] LT',
					nextWeek: '[På] dddd LT',
					lastWeek: '[I] dddd[s] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'om %s',
					past: 'för %s sedan',
					s: 'några sekunder',
					m: 'en minut',
					mm: '%d minuter',
					h: 'en timme',
					hh: '%d timmar',
					d: 'en dag',
					dd: '%d dagar',
					M: 'en månad',
					MM: '%d månader',
					y: 'ett år',
					yy: '%d år'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(e|a)/,
				ordinal: function (number) {
					var b = number % 10,
						output = (~~(number % 100 / 10) === 1) ? 'e' :
							(b === 1) ? 'a' :
								(b === 2) ? 'a' :
									(b === 3) ? 'e' : 'e';
					return number + output;
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return sv;

		})));


		/***/
	}),
	/* 100 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Swahili [sw]
//! author : Fahad Kassim : https://github.com/fadsel

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var sw = moment.defineLocale('sw', {
				months: 'Januari_Februari_Machi_Aprili_Mei_Juni_Julai_Agosti_Septemba_Oktoba_Novemba_Desemba'.split('_'),
				monthsShort: 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ago_Sep_Okt_Nov_Des'.split('_'),
				weekdays: 'Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi'.split('_'),
				weekdaysShort: 'Jpl_Jtat_Jnne_Jtan_Alh_Ijm_Jmos'.split('_'),
				weekdaysMin: 'J2_J3_J4_J5_Al_Ij_J1'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd, D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[leo saa] LT',
					nextDay: '[kesho saa] LT',
					nextWeek: '[wiki ijayo] dddd [saat] LT',
					lastDay: '[jana] LT',
					lastWeek: '[wiki iliyopita] dddd [saat] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s baadaye',
					past: 'tokea %s',
					s: 'hivi punde',
					m: 'dakika moja',
					mm: 'dakika %d',
					h: 'saa limoja',
					hh: 'masaa %d',
					d: 'siku moja',
					dd: 'masiku %d',
					M: 'mwezi mmoja',
					MM: 'miezi %d',
					y: 'mwaka mmoja',
					yy: 'miaka %d'
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return sw;

		})));


		/***/
	}),
	/* 101 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Tamil [ta]
//! author : Arjunkumar Krishnamoorthy : https://github.com/tk120404

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var symbolMap = {
				'1': '௧',
				'2': '௨',
				'3': '௩',
				'4': '௪',
				'5': '௫',
				'6': '௬',
				'7': '௭',
				'8': '௮',
				'9': '௯',
				'0': '௦'
			};
			var numberMap = {
				'௧': '1',
				'௨': '2',
				'௩': '3',
				'௪': '4',
				'௫': '5',
				'௬': '6',
				'௭': '7',
				'௮': '8',
				'௯': '9',
				'௦': '0'
			};

			var ta = moment.defineLocale('ta', {
				months: 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
				monthsShort: 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
				weekdays: 'ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை'.split('_'),
				weekdaysShort: 'ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி'.split('_'),
				weekdaysMin: 'ஞா_தி_செ_பு_வி_வெ_ச'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY, HH:mm',
					LLLL: 'dddd, D MMMM YYYY, HH:mm'
				},
				calendar: {
					sameDay: '[இன்று] LT',
					nextDay: '[நாளை] LT',
					nextWeek: 'dddd, LT',
					lastDay: '[நேற்று] LT',
					lastWeek: '[கடந்த வாரம்] dddd, LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s இல்',
					past: '%s முன்',
					s: 'ஒரு சில விநாடிகள்',
					m: 'ஒரு நிமிடம்',
					mm: '%d நிமிடங்கள்',
					h: 'ஒரு மணி நேரம்',
					hh: '%d மணி நேரம்',
					d: 'ஒரு நாள்',
					dd: '%d நாட்கள்',
					M: 'ஒரு மாதம்',
					MM: '%d மாதங்கள்',
					y: 'ஒரு வருடம்',
					yy: '%d ஆண்டுகள்'
				},
				dayOfMonthOrdinalParse: /\d{1,2}வது/,
				ordinal: function (number) {
					return number + 'வது';
				},
				preparse: function (string) {
					return string.replace(/[௧௨௩௪௫௬௭௮௯௦]/g, function (match) {
						return numberMap[match];
					});
				},
				postformat: function (string) {
					return string.replace(/\d/g, function (match) {
						return symbolMap[match];
					});
				},
				// refer http://ta.wikipedia.org/s/1er1
				meridiemParse: /யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,
				meridiem: function (hour, minute, isLower) {
					if (hour < 2) {
						return ' யாமம்';
					} else if (hour < 6) {
						return ' வைகறை';  // வைகறை
					} else if (hour < 10) {
						return ' காலை'; // காலை
					} else if (hour < 14) {
						return ' நண்பகல்'; // நண்பகல்
					} else if (hour < 18) {
						return ' எற்பாடு'; // எற்பாடு
					} else if (hour < 22) {
						return ' மாலை'; // மாலை
					} else {
						return ' யாமம்';
					}
				},
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if (meridiem === 'யாமம்') {
						return hour < 2 ? hour : hour + 12;
					} else if (meridiem === 'வைகறை' || meridiem === 'காலை') {
						return hour;
					} else if (meridiem === 'நண்பகல்') {
						return hour >= 10 ? hour : hour + 12;
					} else {
						return hour + 12;
					}
				},
				week: {
					dow: 0, // Sunday is the first day of the week.
					doy: 6  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return ta;

		})));


		/***/
	}),
	/* 102 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Telugu [te]
//! author : Krishna Chaitanya Thota : https://github.com/kcthota

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var te = moment.defineLocale('te', {
				months: 'జనవరి_ఫిబ్రవరి_మార్చి_ఏప్రిల్_మే_జూన్_జూలై_ఆగస్టు_సెప్టెంబర్_అక్టోబర్_నవంబర్_డిసెంబర్'.split('_'),
				monthsShort: 'జన._ఫిబ్ర._మార్చి_ఏప్రి._మే_జూన్_జూలై_ఆగ._సెప్._అక్టో._నవ._డిసె.'.split('_'),
				monthsParseExact: true,
				weekdays: 'ఆదివారం_సోమవారం_మంగళవారం_బుధవారం_గురువారం_శుక్రవారం_శనివారం'.split('_'),
				weekdaysShort: 'ఆది_సోమ_మంగళ_బుధ_గురు_శుక్ర_శని'.split('_'),
				weekdaysMin: 'ఆ_సో_మం_బు_గు_శు_శ'.split('_'),
				longDateFormat: {
					LT: 'A h:mm',
					LTS: 'A h:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY, A h:mm',
					LLLL: 'dddd, D MMMM YYYY, A h:mm'
				},
				calendar: {
					sameDay: '[నేడు] LT',
					nextDay: '[రేపు] LT',
					nextWeek: 'dddd, LT',
					lastDay: '[నిన్న] LT',
					lastWeek: '[గత] dddd, LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s లో',
					past: '%s క్రితం',
					s: 'కొన్ని క్షణాలు',
					m: 'ఒక నిమిషం',
					mm: '%d నిమిషాలు',
					h: 'ఒక గంట',
					hh: '%d గంటలు',
					d: 'ఒక రోజు',
					dd: '%d రోజులు',
					M: 'ఒక నెల',
					MM: '%d నెలలు',
					y: 'ఒక సంవత్సరం',
					yy: '%d సంవత్సరాలు'
				},
				dayOfMonthOrdinalParse: /\d{1,2}వ/,
				ordinal: '%dవ',
				meridiemParse: /రాత్రి|ఉదయం|మధ్యాహ్నం|సాయంత్రం/,
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if (meridiem === 'రాత్రి') {
						return hour < 4 ? hour : hour + 12;
					} else if (meridiem === 'ఉదయం') {
						return hour;
					} else if (meridiem === 'మధ్యాహ్నం') {
						return hour >= 10 ? hour : hour + 12;
					} else if (meridiem === 'సాయంత్రం') {
						return hour + 12;
					}
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 4) {
						return 'రాత్రి';
					} else if (hour < 10) {
						return 'ఉదయం';
					} else if (hour < 17) {
						return 'మధ్యాహ్నం';
					} else if (hour < 20) {
						return 'సాయంత్రం';
					} else {
						return 'రాత్రి';
					}
				},
				week: {
					dow: 0, // Sunday is the first day of the week.
					doy: 6  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return te;

		})));


		/***/
	}),
	/* 103 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Tetun Dili (East Timor) [tet]
//! author : Joshua Brooks : https://github.com/joshbrooks
//! author : Onorio De J. Afonso : https://github.com/marobo

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var tet = moment.defineLocale('tet', {
				months: 'Janeiru_Fevereiru_Marsu_Abril_Maiu_Juniu_Juliu_Augustu_Setembru_Outubru_Novembru_Dezembru'.split('_'),
				monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Aug_Set_Out_Nov_Dez'.split('_'),
				weekdays: 'Domingu_Segunda_Tersa_Kuarta_Kinta_Sexta_Sabadu'.split('_'),
				weekdaysShort: 'Dom_Seg_Ters_Kua_Kint_Sext_Sab'.split('_'),
				weekdaysMin: 'Do_Seg_Te_Ku_Ki_Sex_Sa'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd, D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[Ohin iha] LT',
					nextDay: '[Aban iha] LT',
					nextWeek: 'dddd [iha] LT',
					lastDay: '[Horiseik iha] LT',
					lastWeek: 'dddd [semana kotuk] [iha] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'iha %s',
					past: '%s liuba',
					s: 'minutu balun',
					m: 'minutu ida',
					mm: 'minutus %d',
					h: 'horas ida',
					hh: 'horas %d',
					d: 'loron ida',
					dd: 'loron %d',
					M: 'fulan ida',
					MM: 'fulan %d',
					y: 'tinan ida',
					yy: 'tinan %d'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
				ordinal: function (number) {
					var b = number % 10,
						output = (~~(number % 100 / 10) === 1) ? 'th' :
							(b === 1) ? 'st' :
								(b === 2) ? 'nd' :
									(b === 3) ? 'rd' : 'th';
					return number + output;
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return tet;

		})));


		/***/
	}),
	/* 104 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Thai [th]
//! author : Kridsada Thanabulpong : https://github.com/sirn

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var th = moment.defineLocale('th', {
				months: 'มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม'.split('_'),
				monthsShort: 'ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.'.split('_'),
				monthsParseExact: true,
				weekdays: 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_'),
				weekdaysShort: 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์'.split('_'), // yes, three characters difference
				weekdaysMin: 'อา._จ._อ._พ._พฤ._ศ._ส.'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'H:mm',
					LTS: 'H:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY เวลา H:mm',
					LLLL: 'วันddddที่ D MMMM YYYY เวลา H:mm'
				},
				meridiemParse: /ก่อนเที่ยง|หลังเที่ยง/,
				isPM: function (input) {
					return input === 'หลังเที่ยง';
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 12) {
						return 'ก่อนเที่ยง';
					} else {
						return 'หลังเที่ยง';
					}
				},
				calendar: {
					sameDay: '[วันนี้ เวลา] LT',
					nextDay: '[พรุ่งนี้ เวลา] LT',
					nextWeek: 'dddd[หน้า เวลา] LT',
					lastDay: '[เมื่อวานนี้ เวลา] LT',
					lastWeek: '[วัน]dddd[ที่แล้ว เวลา] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'อีก %s',
					past: '%sที่แล้ว',
					s: 'ไม่กี่วินาที',
					m: '1 นาที',
					mm: '%d นาที',
					h: '1 ชั่วโมง',
					hh: '%d ชั่วโมง',
					d: '1 วัน',
					dd: '%d วัน',
					M: '1 เดือน',
					MM: '%d เดือน',
					y: '1 ปี',
					yy: '%d ปี'
				}
			});

			return th;

		})));


		/***/
	}),
	/* 105 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Tagalog (Philippines) [tl-ph]
//! author : Dan Hagman : https://github.com/hagmandan

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var tlPh = moment.defineLocale('tl-ph', {
				months: 'Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre'.split('_'),
				monthsShort: 'Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis'.split('_'),
				weekdays: 'Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado'.split('_'),
				weekdaysShort: 'Lin_Lun_Mar_Miy_Huw_Biy_Sab'.split('_'),
				weekdaysMin: 'Li_Lu_Ma_Mi_Hu_Bi_Sab'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'MM/D/YYYY',
					LL: 'MMMM D, YYYY',
					LLL: 'MMMM D, YYYY HH:mm',
					LLLL: 'dddd, MMMM DD, YYYY HH:mm'
				},
				calendar: {
					sameDay: 'LT [ngayong araw]',
					nextDay: '[Bukas ng] LT',
					nextWeek: 'LT [sa susunod na] dddd',
					lastDay: 'LT [kahapon]',
					lastWeek: 'LT [noong nakaraang] dddd',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'sa loob ng %s',
					past: '%s ang nakalipas',
					s: 'ilang segundo',
					m: 'isang minuto',
					mm: '%d minuto',
					h: 'isang oras',
					hh: '%d oras',
					d: 'isang araw',
					dd: '%d araw',
					M: 'isang buwan',
					MM: '%d buwan',
					y: 'isang taon',
					yy: '%d taon'
				},
				dayOfMonthOrdinalParse: /\d{1,2}/,
				ordinal: function (number) {
					return number;
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return tlPh;

		})));


		/***/
	}),
	/* 106 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Klingon [tlh]
//! author : Dominika Kruk : https://github.com/amaranthrose

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var numbersNouns = 'pagh_wa’_cha’_wej_loS_vagh_jav_Soch_chorgh_Hut'.split('_');

			function translateFuture(output) {
				var time = output;
				time = (output.indexOf('jaj') !== -1) ?
					time.slice(0, -3) + 'leS' :
					(output.indexOf('jar') !== -1) ?
						time.slice(0, -3) + 'waQ' :
						(output.indexOf('DIS') !== -1) ?
							time.slice(0, -3) + 'nem' :
							time + ' pIq';
				return time;
			}

			function translatePast(output) {
				var time = output;
				time = (output.indexOf('jaj') !== -1) ?
					time.slice(0, -3) + 'Hu’' :
					(output.indexOf('jar') !== -1) ?
						time.slice(0, -3) + 'wen' :
						(output.indexOf('DIS') !== -1) ?
							time.slice(0, -3) + 'ben' :
							time + ' ret';
				return time;
			}

			function translate(number, withoutSuffix, string, isFuture) {
				var numberNoun = numberAsNoun(number);
				switch (string) {
					case 'mm':
						return numberNoun + ' tup';
					case 'hh':
						return numberNoun + ' rep';
					case 'dd':
						return numberNoun + ' jaj';
					case 'MM':
						return numberNoun + ' jar';
					case 'yy':
						return numberNoun + ' DIS';
				}
			}

			function numberAsNoun(number) {
				var hundred = Math.floor((number % 1000) / 100),
					ten = Math.floor((number % 100) / 10),
					one = number % 10,
					word = '';
				if (hundred > 0) {
					word += numbersNouns[hundred] + 'vatlh';
				}
				if (ten > 0) {
					word += ((word !== '') ? ' ' : '') + numbersNouns[ten] + 'maH';
				}
				if (one > 0) {
					word += ((word !== '') ? ' ' : '') + numbersNouns[one];
				}
				return (word === '') ? 'pagh' : word;
			}

			var tlh = moment.defineLocale('tlh', {
				months: 'tera’ jar wa’_tera’ jar cha’_tera’ jar wej_tera’ jar loS_tera’ jar vagh_tera’ jar jav_tera’ jar Soch_tera’ jar chorgh_tera’ jar Hut_tera’ jar wa’maH_tera’ jar wa’maH wa’_tera’ jar wa’maH cha’'.split('_'),
				monthsShort: 'jar wa’_jar cha’_jar wej_jar loS_jar vagh_jar jav_jar Soch_jar chorgh_jar Hut_jar wa’maH_jar wa’maH wa’_jar wa’maH cha’'.split('_'),
				monthsParseExact: true,
				weekdays: 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
				weekdaysShort: 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
				weekdaysMin: 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd, D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[DaHjaj] LT',
					nextDay: '[wa’leS] LT',
					nextWeek: 'LLL',
					lastDay: '[wa’Hu’] LT',
					lastWeek: 'LLL',
					sameElse: 'L'
				},
				relativeTime: {
					future: translateFuture,
					past: translatePast,
					s: 'puS lup',
					m: 'wa’ tup',
					mm: translate,
					h: 'wa’ rep',
					hh: translate,
					d: 'wa’ jaj',
					dd: translate,
					M: 'wa’ jar',
					MM: translate,
					y: 'wa’ DIS',
					yy: translate
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return tlh;

		})));


		/***/
	}),
	/* 107 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Turkish [tr]
//! authors : Erhan Gundogan : https://github.com/erhangundogan,
//!           Burak Yiğit Kaya: https://github.com/BYK

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var suffixes = {
				1: '\'inci',
				5: '\'inci',
				8: '\'inci',
				70: '\'inci',
				80: '\'inci',
				2: '\'nci',
				7: '\'nci',
				20: '\'nci',
				50: '\'nci',
				3: '\'üncü',
				4: '\'üncü',
				100: '\'üncü',
				6: '\'ncı',
				9: '\'uncu',
				10: '\'uncu',
				30: '\'uncu',
				60: '\'ıncı',
				90: '\'ıncı'
			};

			var tr = moment.defineLocale('tr', {
				months: 'Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık'.split('_'),
				monthsShort: 'Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara'.split('_'),
				weekdays: 'Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi'.split('_'),
				weekdaysShort: 'Paz_Pts_Sal_Çar_Per_Cum_Cts'.split('_'),
				weekdaysMin: 'Pz_Pt_Sa_Ça_Pe_Cu_Ct'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd, D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[bugün saat] LT',
					nextDay: '[yarın saat] LT',
					nextWeek: '[gelecek] dddd [saat] LT',
					lastDay: '[dün] LT',
					lastWeek: '[geçen] dddd [saat] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s sonra',
					past: '%s önce',
					s: 'birkaç saniye',
					m: 'bir dakika',
					mm: '%d dakika',
					h: 'bir saat',
					hh: '%d saat',
					d: 'bir gün',
					dd: '%d gün',
					M: 'bir ay',
					MM: '%d ay',
					y: 'bir yıl',
					yy: '%d yıl'
				},
				dayOfMonthOrdinalParse: /\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,
				ordinal: function (number) {
					if (number === 0) {  // special case for zero
						return number + '\'ıncı';
					}
					var a = number % 10,
						b = number % 100 - a,
						c = number >= 100 ? 100 : null;
					return number + (suffixes[a] || suffixes[b] || suffixes[c]);
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return tr;

		})));


		/***/
	}),
	/* 108 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Talossan [tzl]
//! author : Robin van der Vliet : https://github.com/robin0van0der0v
//! author : Iustì Canun

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


// After the year there should be a slash and the amount of years since December 26, 1979 in Roman numerals.
// This is currently too difficult (maybe even impossible) to add.
			var tzl = moment.defineLocale('tzl', {
				months: 'Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar'.split('_'),
				monthsShort: 'Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec'.split('_'),
				weekdays: 'Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi'.split('_'),
				weekdaysShort: 'Súl_Lún_Mai_Már_Xhú_Vié_Sát'.split('_'),
				weekdaysMin: 'Sú_Lú_Ma_Má_Xh_Vi_Sá'.split('_'),
				longDateFormat: {
					LT: 'HH.mm',
					LTS: 'HH.mm.ss',
					L: 'DD.MM.YYYY',
					LL: 'D. MMMM [dallas] YYYY',
					LLL: 'D. MMMM [dallas] YYYY HH.mm',
					LLLL: 'dddd, [li] D. MMMM [dallas] YYYY HH.mm'
				},
				meridiemParse: /d\'o|d\'a/i,
				isPM: function (input) {
					return 'd\'o' === input.toLowerCase();
				},
				meridiem: function (hours, minutes, isLower) {
					if (hours > 11) {
						return isLower ? 'd\'o' : 'D\'O';
					} else {
						return isLower ? 'd\'a' : 'D\'A';
					}
				},
				calendar: {
					sameDay: '[oxhi à] LT',
					nextDay: '[demà à] LT',
					nextWeek: 'dddd [à] LT',
					lastDay: '[ieiri à] LT',
					lastWeek: '[sür el] dddd [lasteu à] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'osprei %s',
					past: 'ja%s',
					s: processRelativeTime,
					m: processRelativeTime,
					mm: processRelativeTime,
					h: processRelativeTime,
					hh: processRelativeTime,
					d: processRelativeTime,
					dd: processRelativeTime,
					M: processRelativeTime,
					MM: processRelativeTime,
					y: processRelativeTime,
					yy: processRelativeTime
				},
				dayOfMonthOrdinalParse: /\d{1,2}\./,
				ordinal: '%d.',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			function processRelativeTime(number, withoutSuffix, key, isFuture) {
				var format = {
					's': ['viensas secunds', '\'iensas secunds'],
					'm': ['\'n míut', '\'iens míut'],
					'mm': [number + ' míuts', '' + number + ' míuts'],
					'h': ['\'n þora', '\'iensa þora'],
					'hh': [number + ' þoras', '' + number + ' þoras'],
					'd': ['\'n ziua', '\'iensa ziua'],
					'dd': [number + ' ziuas', '' + number + ' ziuas'],
					'M': ['\'n mes', '\'iens mes'],
					'MM': [number + ' mesen', '' + number + ' mesen'],
					'y': ['\'n ar', '\'iens ar'],
					'yy': [number + ' ars', '' + number + ' ars']
				};
				return isFuture ? format[key][0] : (withoutSuffix ? format[key][0] : format[key][1]);
			}

			return tzl;

		})));


		/***/
	}),
	/* 109 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Central Atlas Tamazight [tzm]
//! author : Abdel Said : https://github.com/abdelsaid

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var tzm = moment.defineLocale('tzm', {
				months: 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
				monthsShort: 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
				weekdays: 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
				weekdaysShort: 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
				weekdaysMin: 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[ⴰⵙⴷⵅ ⴴ] LT',
					nextDay: '[ⴰⵙⴽⴰ ⴴ] LT',
					nextWeek: 'dddd [ⴴ] LT',
					lastDay: '[ⴰⵚⴰⵏⵜ ⴴ] LT',
					lastWeek: 'dddd [ⴴ] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s',
					past: 'ⵢⴰⵏ %s',
					s: 'ⵉⵎⵉⴽ',
					m: 'ⵎⵉⵏⵓⴺ',
					mm: '%d ⵎⵉⵏⵓⴺ',
					h: 'ⵙⴰⵄⴰ',
					hh: '%d ⵜⴰⵙⵙⴰⵄⵉⵏ',
					d: 'ⴰⵙⵙ',
					dd: '%d oⵙⵙⴰⵏ',
					M: 'ⴰⵢoⵓⵔ',
					MM: '%d ⵉⵢⵢⵉⵔⵏ',
					y: 'ⴰⵙⴳⴰⵙ',
					yy: '%d ⵉⵙⴳⴰⵙⵏ'
				},
				week: {
					dow: 6, // Saturday is the first day of the week.
					doy: 12  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return tzm;

		})));


		/***/
	}),
	/* 110 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Central Atlas Tamazight Latin [tzm-latn]
//! author : Abdel Said : https://github.com/abdelsaid

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var tzmLatn = moment.defineLocale('tzm-latn', {
				months: 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split('_'),
				monthsShort: 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split('_'),
				weekdays: 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
				weekdaysShort: 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
				weekdaysMin: 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[asdkh g] LT',
					nextDay: '[aska g] LT',
					nextWeek: 'dddd [g] LT',
					lastDay: '[assant g] LT',
					lastWeek: 'dddd [g] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'dadkh s yan %s',
					past: 'yan %s',
					s: 'imik',
					m: 'minuḍ',
					mm: '%d minuḍ',
					h: 'saɛa',
					hh: '%d tassaɛin',
					d: 'ass',
					dd: '%d ossan',
					M: 'ayowr',
					MM: '%d iyyirn',
					y: 'asgas',
					yy: '%d isgasn'
				},
				week: {
					dow: 6, // Saturday is the first day of the week.
					doy: 12  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return tzmLatn;

		})));


		/***/
	}),
	/* 111 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Ukrainian [uk]
//! author : zemlanin : https://github.com/zemlanin
//! Author : Menelion Elensúle : https://github.com/Oire

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			function plural(word, num) {
				var forms = word.split('_');
				return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
			}

			function relativeTimeWithPlural(number, withoutSuffix, key) {
				var format = {
					'mm': withoutSuffix ? 'хвилина_хвилини_хвилин' : 'хвилину_хвилини_хвилин',
					'hh': withoutSuffix ? 'година_години_годин' : 'годину_години_годин',
					'dd': 'день_дні_днів',
					'MM': 'місяць_місяці_місяців',
					'yy': 'рік_роки_років'
				};
				if (key === 'm') {
					return withoutSuffix ? 'хвилина' : 'хвилину';
				}
				else if (key === 'h') {
					return withoutSuffix ? 'година' : 'годину';
				}
				else {
					return number + ' ' + plural(format[key], +number);
				}
			}

			function weekdaysCaseReplace(m, format) {
				var weekdays = {
					'nominative': 'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота'.split('_'),
					'accusative': 'неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу'.split('_'),
					'genitive': 'неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи'.split('_')
				};

				if (!m) {
					return weekdays['nominative'];
				}

				var nounCase = (/(\[[ВвУу]\]) ?dddd/).test(format) ?
					'accusative' :
					((/\[?(?:минулої|наступної)? ?\] ?dddd/).test(format) ?
						'genitive' :
						'nominative');
				return weekdays[nounCase][m.day()];
			}

			function processHoursFunction(str) {
				return function () {
					return str + 'о' + (this.hours() === 11 ? 'б' : '') + '] LT';
				};
			}

			var uk = moment.defineLocale('uk', {
				months: {
					'format': 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня'.split('_'),
					'standalone': 'січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень'.split('_')
				},
				monthsShort: 'січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд'.split('_'),
				weekdays: weekdaysCaseReplace,
				weekdaysShort: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
				weekdaysMin: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD.MM.YYYY',
					LL: 'D MMMM YYYY р.',
					LLL: 'D MMMM YYYY р., HH:mm',
					LLLL: 'dddd, D MMMM YYYY р., HH:mm'
				},
				calendar: {
					sameDay: processHoursFunction('[Сьогодні '),
					nextDay: processHoursFunction('[Завтра '),
					lastDay: processHoursFunction('[Вчора '),
					nextWeek: processHoursFunction('[У] dddd ['),
					lastWeek: function () {
						switch (this.day()) {
							case 0:
							case 3:
							case 5:
							case 6:
								return processHoursFunction('[Минулої] dddd [').call(this);
							case 1:
							case 2:
							case 4:
								return processHoursFunction('[Минулого] dddd [').call(this);
						}
					},
					sameElse: 'L'
				},
				relativeTime: {
					future: 'за %s',
					past: '%s тому',
					s: 'декілька секунд',
					m: relativeTimeWithPlural,
					mm: relativeTimeWithPlural,
					h: 'годину',
					hh: relativeTimeWithPlural,
					d: 'день',
					dd: relativeTimeWithPlural,
					M: 'місяць',
					MM: relativeTimeWithPlural,
					y: 'рік',
					yy: relativeTimeWithPlural
				},
				// M. E.: those two are virtually unused but a user might want to implement them for his/her website for some reason
				meridiemParse: /ночі|ранку|дня|вечора/,
				isPM: function (input) {
					return /^(дня|вечора)$/.test(input);
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 4) {
						return 'ночі';
					} else if (hour < 12) {
						return 'ранку';
					} else if (hour < 17) {
						return 'дня';
					} else {
						return 'вечора';
					}
				},
				dayOfMonthOrdinalParse: /\d{1,2}-(й|го)/,
				ordinal: function (number, period) {
					switch (period) {
						case 'M':
						case 'd':
						case 'DDD':
						case 'w':
						case 'W':
							return number + '-й';
						case 'D':
							return number + '-го';
						default:
							return number;
					}
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return uk;

		})));


		/***/
	}),
	/* 112 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Urdu [ur]
//! author : Sawood Alam : https://github.com/ibnesayeed
//! author : Zack : https://github.com/ZackVision

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var months = [
				'جنوری',
				'فروری',
				'مارچ',
				'اپریل',
				'مئی',
				'جون',
				'جولائی',
				'اگست',
				'ستمبر',
				'اکتوبر',
				'نومبر',
				'دسمبر'
			];
			var days = [
				'اتوار',
				'پیر',
				'منگل',
				'بدھ',
				'جمعرات',
				'جمعہ',
				'ہفتہ'
			];

			var ur = moment.defineLocale('ur', {
				months: months,
				monthsShort: months,
				weekdays: days,
				weekdaysShort: days,
				weekdaysMin: days,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd، D MMMM YYYY HH:mm'
				},
				meridiemParse: /صبح|شام/,
				isPM: function (input) {
					return 'شام' === input;
				},
				meridiem: function (hour, minute, isLower) {
					if (hour < 12) {
						return 'صبح';
					}
					return 'شام';
				},
				calendar: {
					sameDay: '[آج بوقت] LT',
					nextDay: '[کل بوقت] LT',
					nextWeek: 'dddd [بوقت] LT',
					lastDay: '[گذشتہ روز بوقت] LT',
					lastWeek: '[گذشتہ] dddd [بوقت] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s بعد',
					past: '%s قبل',
					s: 'چند سیکنڈ',
					m: 'ایک منٹ',
					mm: '%d منٹ',
					h: 'ایک گھنٹہ',
					hh: '%d گھنٹے',
					d: 'ایک دن',
					dd: '%d دن',
					M: 'ایک ماہ',
					MM: '%d ماہ',
					y: 'ایک سال',
					yy: '%d سال'
				},
				preparse: function (string) {
					return string.replace(/،/g, ',');
				},
				postformat: function (string) {
					return string.replace(/,/g, '،');
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return ur;

		})));


		/***/
	}),
	/* 113 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Uzbek [uz]
//! author : Sardor Muminov : https://github.com/muminoff

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var uz = moment.defineLocale('uz', {
				months: 'январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр'.split('_'),
				monthsShort: 'янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек'.split('_'),
				weekdays: 'Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба'.split('_'),
				weekdaysShort: 'Якш_Душ_Сеш_Чор_Пай_Жум_Шан'.split('_'),
				weekdaysMin: 'Як_Ду_Се_Чо_Па_Жу_Ша'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'D MMMM YYYY, dddd HH:mm'
				},
				calendar: {
					sameDay: '[Бугун соат] LT [да]',
					nextDay: '[Эртага] LT [да]',
					nextWeek: 'dddd [куни соат] LT [да]',
					lastDay: '[Кеча соат] LT [да]',
					lastWeek: '[Утган] dddd [куни соат] LT [да]',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'Якин %s ичида',
					past: 'Бир неча %s олдин',
					s: 'фурсат',
					m: 'бир дакика',
					mm: '%d дакика',
					h: 'бир соат',
					hh: '%d соат',
					d: 'бир кун',
					dd: '%d кун',
					M: 'бир ой',
					MM: '%d ой',
					y: 'бир йил',
					yy: '%d йил'
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return uz;

		})));


		/***/
	}),
	/* 114 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Uzbek Latin [uz-latn]
//! author : Rasulbek Mirzayev : github.com/Rasulbeeek

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var uzLatn = moment.defineLocale('uz-latn', {
				months: 'Yanvar_Fevral_Mart_Aprel_May_Iyun_Iyul_Avgust_Sentabr_Oktabr_Noyabr_Dekabr'.split('_'),
				monthsShort: 'Yan_Fev_Mar_Apr_May_Iyun_Iyul_Avg_Sen_Okt_Noy_Dek'.split('_'),
				weekdays: 'Yakshanba_Dushanba_Seshanba_Chorshanba_Payshanba_Juma_Shanba'.split('_'),
				weekdaysShort: 'Yak_Dush_Sesh_Chor_Pay_Jum_Shan'.split('_'),
				weekdaysMin: 'Ya_Du_Se_Cho_Pa_Ju_Sha'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'D MMMM YYYY, dddd HH:mm'
				},
				calendar: {
					sameDay: '[Bugun soat] LT [da]',
					nextDay: '[Ertaga] LT [da]',
					nextWeek: 'dddd [kuni soat] LT [da]',
					lastDay: '[Kecha soat] LT [da]',
					lastWeek: '[O\'tgan] dddd [kuni soat] LT [da]',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'Yaqin %s ichida',
					past: 'Bir necha %s oldin',
					s: 'soniya',
					m: 'bir daqiqa',
					mm: '%d daqiqa',
					h: 'bir soat',
					hh: '%d soat',
					d: 'bir kun',
					dd: '%d kun',
					M: 'bir oy',
					MM: '%d oy',
					y: 'bir yil',
					yy: '%d yil'
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 7  // The week that contains Jan 1st is the first week of the year.
				}
			});

			return uzLatn;

		})));


		/***/
	}),
	/* 115 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Vietnamese [vi]
//! author : Bang Nguyen : https://github.com/bangnk

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var vi = moment.defineLocale('vi', {
				months: 'tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12'.split('_'),
				monthsShort: 'Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12'.split('_'),
				monthsParseExact: true,
				weekdays: 'chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy'.split('_'),
				weekdaysShort: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
				weekdaysMin: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
				weekdaysParseExact: true,
				meridiemParse: /sa|ch/i,
				isPM: function (input) {
					return /^ch$/i.test(input);
				},
				meridiem: function (hours, minutes, isLower) {
					if (hours < 12) {
						return isLower ? 'sa' : 'SA';
					} else {
						return isLower ? 'ch' : 'CH';
					}
				},
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM [năm] YYYY',
					LLL: 'D MMMM [năm] YYYY HH:mm',
					LLLL: 'dddd, D MMMM [năm] YYYY HH:mm',
					l: 'DD/M/YYYY',
					ll: 'D MMM YYYY',
					lll: 'D MMM YYYY HH:mm',
					llll: 'ddd, D MMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[Hôm nay lúc] LT',
					nextDay: '[Ngày mai lúc] LT',
					nextWeek: 'dddd [tuần tới lúc] LT',
					lastDay: '[Hôm qua lúc] LT',
					lastWeek: 'dddd [tuần rồi lúc] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: '%s tới',
					past: '%s trước',
					s: 'vài giây',
					m: 'một phút',
					mm: '%d phút',
					h: 'một giờ',
					hh: '%d giờ',
					d: 'một ngày',
					dd: '%d ngày',
					M: 'một tháng',
					MM: '%d tháng',
					y: 'một năm',
					yy: '%d năm'
				},
				dayOfMonthOrdinalParse: /\d{1,2}/,
				ordinal: function (number) {
					return number;
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return vi;

		})));


		/***/
	}),
	/* 116 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Pseudo [x-pseudo]
//! author : Andrew Hood : https://github.com/andrewhood125

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var xPseudo = moment.defineLocale('x-pseudo', {
				months: 'J~áñúá~rý_F~ébrú~árý_~Márc~h_Áp~ríl_~Máý_~Júñé~_Júl~ý_Áú~gúst~_Sép~témb~ér_Ó~ctób~ér_Ñ~óvém~bér_~Décé~mbér'.split('_'),
				monthsShort: 'J~áñ_~Féb_~Már_~Ápr_~Máý_~Júñ_~Júl_~Áúg_~Sép_~Óct_~Ñóv_~Déc'.split('_'),
				monthsParseExact: true,
				weekdays: 'S~úñdá~ý_Mó~ñdáý~_Túé~sdáý~_Wéd~ñésd~áý_T~húrs~dáý_~Fríd~áý_S~átúr~dáý'.split('_'),
				weekdaysShort: 'S~úñ_~Móñ_~Túé_~Wéd_~Thú_~Frí_~Sát'.split('_'),
				weekdaysMin: 'S~ú_Mó~_Tú_~Wé_T~h_Fr~_Sá'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd, D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[T~ódá~ý át] LT',
					nextDay: '[T~ómó~rró~w át] LT',
					nextWeek: 'dddd [át] LT',
					lastDay: '[Ý~ést~érdá~ý át] LT',
					lastWeek: '[L~ást] dddd [át] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'í~ñ %s',
					past: '%s á~gó',
					s: 'á ~féw ~sécó~ñds',
					m: 'á ~míñ~úté',
					mm: '%d m~íñú~tés',
					h: 'á~ñ hó~úr',
					hh: '%d h~óúrs',
					d: 'á ~dáý',
					dd: '%d d~áýs',
					M: 'á ~móñ~th',
					MM: '%d m~óñt~hs',
					y: 'á ~ýéár',
					yy: '%d ý~éárs'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
				ordinal: function (number) {
					var b = number % 10,
						output = (~~(number % 100 / 10) === 1) ? 'th' :
							(b === 1) ? 'st' :
								(b === 2) ? 'nd' :
									(b === 3) ? 'rd' : 'th';
					return number + output;
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return xPseudo;

		})));


		/***/
	}),
	/* 117 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Yoruba Nigeria [yo]
//! author : Atolagbe Abisoye : https://github.com/andela-batolagbe

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var yo = moment.defineLocale('yo', {
				months: 'Sẹ́rẹ́_Èrèlè_Ẹrẹ̀nà_Ìgbé_Èbibi_Òkùdu_Agẹmo_Ògún_Owewe_Ọ̀wàrà_Bélú_Ọ̀pẹ̀̀'.split('_'),
				monthsShort: 'Sẹ́r_Èrl_Ẹrn_Ìgb_Èbi_Òkù_Agẹ_Ògú_Owe_Ọ̀wà_Bél_Ọ̀pẹ̀̀'.split('_'),
				weekdays: 'Àìkú_Ajé_Ìsẹ́gun_Ọjọ́rú_Ọjọ́bọ_Ẹtì_Àbámẹ́ta'.split('_'),
				weekdaysShort: 'Àìk_Ajé_Ìsẹ́_Ọjr_Ọjb_Ẹtì_Àbá'.split('_'),
				weekdaysMin: 'Àì_Aj_Ìs_Ọr_Ọb_Ẹt_Àb'.split('_'),
				longDateFormat: {
					LT: 'h:mm A',
					LTS: 'h:mm:ss A',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY h:mm A',
					LLLL: 'dddd, D MMMM YYYY h:mm A'
				},
				calendar: {
					sameDay: '[Ònì ni] LT',
					nextDay: '[Ọ̀la ni] LT',
					nextWeek: 'dddd [Ọsẹ̀ tón\'bọ] [ni] LT',
					lastDay: '[Àna ni] LT',
					lastWeek: 'dddd [Ọsẹ̀ tólọ́] [ni] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'ní %s',
					past: '%s kọjá',
					s: 'ìsẹjú aayá die',
					m: 'ìsẹjú kan',
					mm: 'ìsẹjú %d',
					h: 'wákati kan',
					hh: 'wákati %d',
					d: 'ọjọ́ kan',
					dd: 'ọjọ́ %d',
					M: 'osù kan',
					MM: 'osù %d',
					y: 'ọdún kan',
					yy: 'ọdún %d'
				},
				dayOfMonthOrdinalParse: /ọjọ́\s\d{1,2}/,
				ordinal: 'ọjọ́ %d',
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4 // The week that contains Jan 4th is the first week of the year.
				}
			});

			return yo;

		})));


		/***/
	}),
	/* 118 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Chinese (China) [zh-cn]
//! author : suupic : https://github.com/suupic
//! author : Zeno Zeng : https://github.com/zenozeng

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var zhCn = moment.defineLocale('zh-cn', {
				months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
				monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
				weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
				weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
				weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'YYYY年MMMD日',
					LL: 'YYYY年MMMD日',
					LLL: 'YYYY年MMMD日Ah点mm分',
					LLLL: 'YYYY年MMMD日ddddAh点mm分',
					l: 'YYYY年MMMD日',
					ll: 'YYYY年MMMD日',
					lll: 'YYYY年MMMD日 HH:mm',
					llll: 'YYYY年MMMD日dddd HH:mm'
				},
				meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if (meridiem === '凌晨' || meridiem === '早上' ||
						meridiem === '上午') {
						return hour;
					} else if (meridiem === '下午' || meridiem === '晚上') {
						return hour + 12;
					} else {
						// '中午'
						return hour >= 11 ? hour : hour + 12;
					}
				},
				meridiem: function (hour, minute, isLower) {
					var hm = hour * 100 + minute;
					if (hm < 600) {
						return '凌晨';
					} else if (hm < 900) {
						return '早上';
					} else if (hm < 1130) {
						return '上午';
					} else if (hm < 1230) {
						return '中午';
					} else if (hm < 1800) {
						return '下午';
					} else {
						return '晚上';
					}
				},
				calendar: {
					sameDay: '[今天]LT',
					nextDay: '[明天]LT',
					nextWeek: '[下]ddddLT',
					lastDay: '[昨天]LT',
					lastWeek: '[上]ddddLT',
					sameElse: 'L'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
				ordinal: function (number, period) {
					switch (period) {
						case 'd':
						case 'D':
						case 'DDD':
							return number + '日';
						case 'M':
							return number + '月';
						case 'w':
						case 'W':
							return number + '周';
						default:
							return number;
					}
				},
				relativeTime: {
					future: '%s内',
					past: '%s前',
					s: '几秒',
					m: '1 分钟',
					mm: '%d 分钟',
					h: '1 小时',
					hh: '%d 小时',
					d: '1 天',
					dd: '%d 天',
					M: '1 个月',
					MM: '%d 个月',
					y: '1 年',
					yy: '%d 年'
				},
				week: {
					// GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
					dow: 1, // Monday is the first day of the week.
					doy: 4  // The week that contains Jan 4th is the first week of the year.
				}
			});

			return zhCn;

		})));


		/***/
	}),
	/* 119 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Chinese (Hong Kong) [zh-hk]
//! author : Ben : https://github.com/ben-lin
//! author : Chris Lam : https://github.com/hehachris
//! author : Konstantin : https://github.com/skfd

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var zhHk = moment.defineLocale('zh-hk', {
				months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
				monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
				weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
				weekdaysShort: '週日_週一_週二_週三_週四_週五_週六'.split('_'),
				weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'YYYY年MMMD日',
					LL: 'YYYY年MMMD日',
					LLL: 'YYYY年MMMD日 HH:mm',
					LLLL: 'YYYY年MMMD日dddd HH:mm',
					l: 'YYYY年MMMD日',
					ll: 'YYYY年MMMD日',
					lll: 'YYYY年MMMD日 HH:mm',
					llll: 'YYYY年MMMD日dddd HH:mm'
				},
				meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
						return hour;
					} else if (meridiem === '中午') {
						return hour >= 11 ? hour : hour + 12;
					} else if (meridiem === '下午' || meridiem === '晚上') {
						return hour + 12;
					}
				},
				meridiem: function (hour, minute, isLower) {
					var hm = hour * 100 + minute;
					if (hm < 600) {
						return '凌晨';
					} else if (hm < 900) {
						return '早上';
					} else if (hm < 1130) {
						return '上午';
					} else if (hm < 1230) {
						return '中午';
					} else if (hm < 1800) {
						return '下午';
					} else {
						return '晚上';
					}
				},
				calendar: {
					sameDay: '[今天]LT',
					nextDay: '[明天]LT',
					nextWeek: '[下]ddddLT',
					lastDay: '[昨天]LT',
					lastWeek: '[上]ddddLT',
					sameElse: 'L'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
				ordinal: function (number, period) {
					switch (period) {
						case 'd' :
						case 'D' :
						case 'DDD' :
							return number + '日';
						case 'M' :
							return number + '月';
						case 'w' :
						case 'W' :
							return number + '週';
						default :
							return number;
					}
				},
				relativeTime: {
					future: '%s內',
					past: '%s前',
					s: '幾秒',
					m: '1 分鐘',
					mm: '%d 分鐘',
					h: '1 小時',
					hh: '%d 小時',
					d: '1 天',
					dd: '%d 天',
					M: '1 個月',
					MM: '%d 個月',
					y: '1 年',
					yy: '%d 年'
				}
			});

			return zhHk;

		})));


		/***/
	}),
	/* 120 */
	/***/ (function (module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Chinese (Taiwan) [zh-tw]
//! author : Ben : https://github.com/ben-lin
//! author : Chris Lam : https://github.com/hehachris

		;(function (global, factory) {
			true ? factory(__webpack_require__(0)) :
				typeof define === 'function' && define.amd ? define(['../moment'], factory) :
					factory(global.moment)
		}(this, (function (moment) {
			'use strict';


			var zhTw = moment.defineLocale('zh-tw', {
				months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
				monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
				weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
				weekdaysShort: '週日_週一_週二_週三_週四_週五_週六'.split('_'),
				weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'YYYY年MMMD日',
					LL: 'YYYY年MMMD日',
					LLL: 'YYYY年MMMD日 HH:mm',
					LLLL: 'YYYY年MMMD日dddd HH:mm',
					l: 'YYYY年MMMD日',
					ll: 'YYYY年MMMD日',
					lll: 'YYYY年MMMD日 HH:mm',
					llll: 'YYYY年MMMD日dddd HH:mm'
				},
				meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
				meridiemHour: function (hour, meridiem) {
					if (hour === 12) {
						hour = 0;
					}
					if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
						return hour;
					} else if (meridiem === '中午') {
						return hour >= 11 ? hour : hour + 12;
					} else if (meridiem === '下午' || meridiem === '晚上') {
						return hour + 12;
					}
				},
				meridiem: function (hour, minute, isLower) {
					var hm = hour * 100 + minute;
					if (hm < 600) {
						return '凌晨';
					} else if (hm < 900) {
						return '早上';
					} else if (hm < 1130) {
						return '上午';
					} else if (hm < 1230) {
						return '中午';
					} else if (hm < 1800) {
						return '下午';
					} else {
						return '晚上';
					}
				},
				calendar: {
					sameDay: '[今天]LT',
					nextDay: '[明天]LT',
					nextWeek: '[下]ddddLT',
					lastDay: '[昨天]LT',
					lastWeek: '[上]ddddLT',
					sameElse: 'L'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
				ordinal: function (number, period) {
					switch (period) {
						case 'd' :
						case 'D' :
						case 'DDD' :
							return number + '日';
						case 'M' :
							return number + '月';
						case 'w' :
						case 'W' :
							return number + '週';
						default :
							return number;
					}
				},
				relativeTime: {
					future: '%s內',
					past: '%s前',
					s: '幾秒',
					m: '1 分鐘',
					mm: '%d 分鐘',
					h: '1 小時',
					hh: '%d 小時',
					d: '1 天',
					dd: '%d 天',
					M: '1 個月',
					MM: '%d 個月',
					y: '1 年',
					yy: '%d 年'
				}
			});

			return zhTw;

		})));


		/***/
	}),
	/* 121 */,
	/* 122 */,
	/* 123 */
	/***/ (function (module, __webpack_exports__, __webpack_require__) {

		"use strict";
		Object.defineProperty(__webpack_exports__, "__esModule", {value: true});
		/* harmony import */
		var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(1);
		/* harmony import */
		var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
		/* harmony import */
		var __WEBPACK_IMPORTED_MODULE_1_moment__ = __webpack_require__(0);
		/* harmony import */
		var __WEBPACK_IMPORTED_MODULE_1_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_moment__);
		/* harmony import */
		var __WEBPACK_IMPORTED_MODULE_2_fullcalendar__ = __webpack_require__(126);
		/* harmony import */
		var __WEBPACK_IMPORTED_MODULE_2_fullcalendar___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_fullcalendar__);
		/* harmony import */
		var __WEBPACK_IMPORTED_MODULE_3_fullcalendar_dist_fullcalendar_css__ = __webpack_require__(127);
		/* harmony import */
		var __WEBPACK_IMPORTED_MODULE_3_fullcalendar_dist_fullcalendar_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_fullcalendar_dist_fullcalendar_css__);


		const durationBetween = (start, end) => __WEBPACK_IMPORTED_MODULE_1_moment___default.a.duration(start.diff(end));

		__WEBPACK_IMPORTED_MODULE_0_jquery___default()(() => {
			const [$startTime, $endTime, $duration] = [__WEBPACK_IMPORTED_MODULE_0_jquery___default()('#startTime'), __WEBPACK_IMPORTED_MODULE_0_jquery___default()('#endTime'), __WEBPACK_IMPORTED_MODULE_0_jquery___default()('#duration')];
			const FORMAT = 'YYYY-MM-DD[T]hh:mm';

			window.APP = {
				updateDuration: () => {
					$duration.text(durationBetween(__WEBPACK_IMPORTED_MODULE_1_moment___default()($startTime.val()), __WEBPACK_IMPORTED_MODULE_1_moment___default()($endTime.val())).humanize());
				}
			};

			__WEBPACK_IMPORTED_MODULE_0_jquery___default()('#calendar').fullCalendar({
				defaultView: 'agendaWeek',
				events: window.eventsUrl,
				locale: window.locale,
				firstDay: 1,
				hiddenDays: [0],
				allDaySlot: false,
				selectable: true,
				selectHelper: true,
				selectLongPressDelay: 500,
				unselectCancel: '#reservationForm',
				select: (start, end) => {
					$startTime.val(start.format(FORMAT));
					$endTime.val(end.format(FORMAT));
					APP.updateDuration();
				},
				dayClick: function (date) {
					$startTime.val(date.format(FORMAT));
					$endTime.val(date.add({hours: 1}).format(FORMAT));
					APP.updateDuration();
				}
			});
		});

		/***/
	}),
	/* 124 */
	/***/ (function (module, exports) {

		module.exports = function (module) {
			if (!module.webpackPolyfill) {
				module.deprecate = function () {
				};
				module.paths = [];
				// module.parent = undefined by default
				if (!module.children) module.children = [];
				Object.defineProperty(module, "loaded", {
					enumerable: true,
					get: function () {
						return module.l;
					}
				});
				Object.defineProperty(module, "id", {
					enumerable: true,
					get: function () {
						return module.i;
					}
				});
				module.webpackPolyfill = 1;
			}
			return module;
		};


		/***/
	}),
	/* 125 */
	/***/ (function (module, exports, __webpack_require__) {

		var map = {
			"./af": 3,
			"./af.js": 3,
			"./ar": 4,
			"./ar-dz": 5,
			"./ar-dz.js": 5,
			"./ar-kw": 6,
			"./ar-kw.js": 6,
			"./ar-ly": 7,
			"./ar-ly.js": 7,
			"./ar-ma": 8,
			"./ar-ma.js": 8,
			"./ar-sa": 9,
			"./ar-sa.js": 9,
			"./ar-tn": 10,
			"./ar-tn.js": 10,
			"./ar.js": 4,
			"./az": 11,
			"./az.js": 11,
			"./be": 12,
			"./be.js": 12,
			"./bg": 13,
			"./bg.js": 13,
			"./bm": 14,
			"./bm.js": 14,
			"./bn": 15,
			"./bn.js": 15,
			"./bo": 16,
			"./bo.js": 16,
			"./br": 17,
			"./br.js": 17,
			"./bs": 18,
			"./bs.js": 18,
			"./ca": 19,
			"./ca.js": 19,
			"./cs": 20,
			"./cs.js": 20,
			"./cv": 21,
			"./cv.js": 21,
			"./cy": 22,
			"./cy.js": 22,
			"./da": 23,
			"./da.js": 23,
			"./de": 24,
			"./de-at": 25,
			"./de-at.js": 25,
			"./de-ch": 26,
			"./de-ch.js": 26,
			"./de.js": 24,
			"./dv": 27,
			"./dv.js": 27,
			"./el": 28,
			"./el.js": 28,
			"./en-au": 29,
			"./en-au.js": 29,
			"./en-ca": 30,
			"./en-ca.js": 30,
			"./en-gb": 31,
			"./en-gb.js": 31,
			"./en-ie": 32,
			"./en-ie.js": 32,
			"./en-nz": 33,
			"./en-nz.js": 33,
			"./eo": 34,
			"./eo.js": 34,
			"./es": 35,
			"./es-do": 36,
			"./es-do.js": 36,
			"./es-us": 37,
			"./es-us.js": 37,
			"./es.js": 35,
			"./et": 38,
			"./et.js": 38,
			"./eu": 39,
			"./eu.js": 39,
			"./fa": 40,
			"./fa.js": 40,
			"./fi": 41,
			"./fi.js": 41,
			"./fo": 42,
			"./fo.js": 42,
			"./fr": 43,
			"./fr-ca": 44,
			"./fr-ca.js": 44,
			"./fr-ch": 45,
			"./fr-ch.js": 45,
			"./fr.js": 43,
			"./fy": 46,
			"./fy.js": 46,
			"./gd": 47,
			"./gd.js": 47,
			"./gl": 48,
			"./gl.js": 48,
			"./gom-latn": 49,
			"./gom-latn.js": 49,
			"./gu": 50,
			"./gu.js": 50,
			"./he": 51,
			"./he.js": 51,
			"./hi": 52,
			"./hi.js": 52,
			"./hr": 53,
			"./hr.js": 53,
			"./hu": 54,
			"./hu.js": 54,
			"./hy-am": 55,
			"./hy-am.js": 55,
			"./id": 56,
			"./id.js": 56,
			"./is": 57,
			"./is.js": 57,
			"./it": 58,
			"./it.js": 58,
			"./ja": 59,
			"./ja.js": 59,
			"./jv": 60,
			"./jv.js": 60,
			"./ka": 61,
			"./ka.js": 61,
			"./kk": 62,
			"./kk.js": 62,
			"./km": 63,
			"./km.js": 63,
			"./kn": 64,
			"./kn.js": 64,
			"./ko": 65,
			"./ko.js": 65,
			"./ky": 66,
			"./ky.js": 66,
			"./lb": 67,
			"./lb.js": 67,
			"./lo": 68,
			"./lo.js": 68,
			"./lt": 69,
			"./lt.js": 69,
			"./lv": 70,
			"./lv.js": 70,
			"./me": 71,
			"./me.js": 71,
			"./mi": 72,
			"./mi.js": 72,
			"./mk": 73,
			"./mk.js": 73,
			"./ml": 74,
			"./ml.js": 74,
			"./mr": 75,
			"./mr.js": 75,
			"./ms": 76,
			"./ms-my": 77,
			"./ms-my.js": 77,
			"./ms.js": 76,
			"./my": 78,
			"./my.js": 78,
			"./nb": 79,
			"./nb.js": 79,
			"./ne": 80,
			"./ne.js": 80,
			"./nl": 81,
			"./nl-be": 82,
			"./nl-be.js": 82,
			"./nl.js": 81,
			"./nn": 83,
			"./nn.js": 83,
			"./pa-in": 84,
			"./pa-in.js": 84,
			"./pl": 85,
			"./pl.js": 85,
			"./pt": 86,
			"./pt-br": 87,
			"./pt-br.js": 87,
			"./pt.js": 86,
			"./ro": 88,
			"./ro.js": 88,
			"./ru": 89,
			"./ru.js": 89,
			"./sd": 90,
			"./sd.js": 90,
			"./se": 91,
			"./se.js": 91,
			"./si": 92,
			"./si.js": 92,
			"./sk": 93,
			"./sk.js": 93,
			"./sl": 94,
			"./sl.js": 94,
			"./sq": 95,
			"./sq.js": 95,
			"./sr": 96,
			"./sr-cyrl": 97,
			"./sr-cyrl.js": 97,
			"./sr.js": 96,
			"./ss": 98,
			"./ss.js": 98,
			"./sv": 99,
			"./sv.js": 99,
			"./sw": 100,
			"./sw.js": 100,
			"./ta": 101,
			"./ta.js": 101,
			"./te": 102,
			"./te.js": 102,
			"./tet": 103,
			"./tet.js": 103,
			"./th": 104,
			"./th.js": 104,
			"./tl-ph": 105,
			"./tl-ph.js": 105,
			"./tlh": 106,
			"./tlh.js": 106,
			"./tr": 107,
			"./tr.js": 107,
			"./tzl": 108,
			"./tzl.js": 108,
			"./tzm": 109,
			"./tzm-latn": 110,
			"./tzm-latn.js": 110,
			"./tzm.js": 109,
			"./uk": 111,
			"./uk.js": 111,
			"./ur": 112,
			"./ur.js": 112,
			"./uz": 113,
			"./uz-latn": 114,
			"./uz-latn.js": 114,
			"./uz.js": 113,
			"./vi": 115,
			"./vi.js": 115,
			"./x-pseudo": 116,
			"./x-pseudo.js": 116,
			"./yo": 117,
			"./yo.js": 117,
			"./zh-cn": 118,
			"./zh-cn.js": 118,
			"./zh-hk": 119,
			"./zh-hk.js": 119,
			"./zh-tw": 120,
			"./zh-tw.js": 120
		};

		function webpackContext(req) {
			return __webpack_require__(webpackContextResolve(req));
		};

		function webpackContextResolve(req) {
			var id = map[req];
			if (!(id + 1)) // check for number or string
				throw new Error("Cannot find module '" + req + "'.");
			return id;
		};
		webpackContext.keys = function webpackContextKeys() {
			return Object.keys(map);
		};
		webpackContext.resolve = webpackContextResolve;
		module.exports = webpackContext;
		webpackContext.id = 125;

		/***/
	}),
	/* 126 */
	/***/ (function (module, exports, __webpack_require__) {

		var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
		/*!
 * FullCalendar v3.6.2
 * Docs & License: https://fullcalendar.io/
 * (c) 2017 Adam Shaw
 */

		(function (factory) {
			if (true) {
				!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
					__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
						(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
			}
			else if (typeof exports === 'object') { // Node/CommonJS
				module.exports = factory(require('jquery'), require('moment'));
			}
			else {
				factory(jQuery, moment);
			}
		})(function ($, moment) {

			;
			;

			var FC = $.fullCalendar = {
				version: "3.6.2",
				// When introducing internal API incompatibilities (where fullcalendar plugins would break),
				// the minor version of the calendar should be upped (ex: 2.7.2 -> 2.8.0)
				// and the below integer should be incremented.
				internalApiVersion: 11
			};
			var fcViews = FC.views = {};


			$.fn.fullCalendar = function (options) {
				var args = Array.prototype.slice.call(arguments, 1); // for a possible method call
				var res = this; // what this function will return (this jQuery object by default)

				this.each(function (i, _element) { // loop each DOM element involved
					var element = $(_element);
					var calendar = element.data('fullCalendar'); // get the existing calendar object (if any)
					var singleRes; // the returned value of this single method call

					// a method call
					if (typeof options === 'string') {

						if (options === 'getCalendar') {
							if (!i) { // first element only
								res = calendar;
							}
						}
						else if (options === 'destroy') { // don't warn if no calendar object
							if (calendar) {
								calendar.destroy();
								element.removeData('fullCalendar');
							}
						}
						else if (!calendar) {
							FC.warn("Attempting to call a FullCalendar method on an element with no calendar.");
						}
						else if ($.isFunction(calendar[options])) {
							singleRes = calendar[options].apply(calendar, args);

							if (!i) {
								res = singleRes; // record the first method call result
							}
							if (options === 'destroy') { // for the destroy method, must remove Calendar object data
								element.removeData('fullCalendar');
							}
						}
						else {
							FC.warn("'" + options + "' is an unknown FullCalendar method.");
						}
					}
					// a new calendar initialization
					else if (!calendar) { // don't initialize twice
						calendar = new Calendar(element, options);
						element.data('fullCalendar', calendar);
						calendar.render();
					}
				});

				return res;
			};


			var complexOptions = [ // names of options that are objects whose properties should be combined
				'header',
				'footer',
				'buttonText',
				'buttonIcons',
				'themeButtonIcons'
			];


// Merges an array of option objects into a single object
			function mergeOptions(optionObjs) {
				return mergeProps(optionObjs, complexOptions);
			}

			;
			;

// exports
			FC.applyAll = applyAll;
			FC.debounce = debounce;
			FC.isInt = isInt;
			FC.htmlEscape = htmlEscape;
			FC.cssToStr = cssToStr;
			FC.proxy = proxy;
			FC.capitaliseFirstLetter = capitaliseFirstLetter;


			/* FullCalendar-specific DOM Utilities
----------------------------------------------------------------------------------------------------------------------*/


// Given the scrollbar widths of some other container, create borders/margins on rowEls in order to match the left
// and right space that was offset by the scrollbars. A 1-pixel border first, then margin beyond that.
			function compensateScroll(rowEls, scrollbarWidths) {
				if (scrollbarWidths.left) {
					rowEls.css({
						'border-left-width': 1,
						'margin-left': scrollbarWidths.left - 1
					});
				}
				if (scrollbarWidths.right) {
					rowEls.css({
						'border-right-width': 1,
						'margin-right': scrollbarWidths.right - 1
					});
				}
			}


// Undoes compensateScroll and restores all borders/margins
			function uncompensateScroll(rowEls) {
				rowEls.css({
					'margin-left': '',
					'margin-right': '',
					'border-left-width': '',
					'border-right-width': ''
				});
			}


// Make the mouse cursor express that an event is not allowed in the current area
			function disableCursor() {
				$('body').addClass('fc-not-allowed');
			}


// Returns the mouse cursor to its original look
			function enableCursor() {
				$('body').removeClass('fc-not-allowed');
			}


// Given a total available height to fill, have `els` (essentially child rows) expand to accomodate.
// By default, all elements that are shorter than the recommended height are expanded uniformly, not considering
// any other els that are already too tall. if `shouldRedistribute` is on, it considers these tall rows and
// reduces the available height.
			function distributeHeight(els, availableHeight, shouldRedistribute) {

				// *FLOORING NOTE*: we floor in certain places because zoom can give inaccurate floating-point dimensions,
				// and it is better to be shorter than taller, to avoid creating unnecessary scrollbars.

				var minOffset1 = Math.floor(availableHeight / els.length); // for non-last element
				var minOffset2 = Math.floor(availableHeight - minOffset1 * (els.length - 1)); // for last element *FLOORING NOTE*
				var flexEls = []; // elements that are allowed to expand. array of DOM nodes
				var flexOffsets = []; // amount of vertical space it takes up
				var flexHeights = []; // actual css height
				var usedHeight = 0;

				undistributeHeight(els); // give all elements their natural height

				// find elements that are below the recommended height (expandable).
				// important to query for heights in a single first pass (to avoid reflow oscillation).
				els.each(function (i, el) {
					var minOffset = i === els.length - 1 ? minOffset2 : minOffset1;
					var naturalOffset = $(el).outerHeight(true);

					if (naturalOffset < minOffset) {
						flexEls.push(el);
						flexOffsets.push(naturalOffset);
						flexHeights.push($(el).height());
					}
					else {
						// this element stretches past recommended height (non-expandable). mark the space as occupied.
						usedHeight += naturalOffset;
					}
				});

				// readjust the recommended height to only consider the height available to non-maxed-out rows.
				if (shouldRedistribute) {
					availableHeight -= usedHeight;
					minOffset1 = Math.floor(availableHeight / flexEls.length);
					minOffset2 = Math.floor(availableHeight - minOffset1 * (flexEls.length - 1)); // *FLOORING NOTE*
				}

				// assign heights to all expandable elements
				$(flexEls).each(function (i, el) {
					var minOffset = i === flexEls.length - 1 ? minOffset2 : minOffset1;
					var naturalOffset = flexOffsets[i];
					var naturalHeight = flexHeights[i];
					var newHeight = minOffset - (naturalOffset - naturalHeight); // subtract the margin/padding

					if (naturalOffset < minOffset) { // we check this again because redistribution might have changed things
						$(el).height(newHeight);
					}
				});
			}


// Undoes distrubuteHeight, restoring all els to their natural height
			function undistributeHeight(els) {
				els.height('');
			}


// Given `els`, a jQuery set of <td> cells, find the cell with the largest natural width and set the widths of all the
// cells to be that width.
// PREREQUISITE: if you want a cell to take up width, it needs to have a single inner element w/ display:inline
			function matchCellWidths(els) {
				var maxInnerWidth = 0;

				els.find('> *').each(function (i, innerEl) {
					var innerWidth = $(innerEl).outerWidth();
					if (innerWidth > maxInnerWidth) {
						maxInnerWidth = innerWidth;
					}
				});

				maxInnerWidth++; // sometimes not accurate of width the text needs to stay on one line. insurance

				els.width(maxInnerWidth);

				return maxInnerWidth;
			}


// Given one element that resides inside another,
// Subtracts the height of the inner element from the outer element.
			function subtractInnerElHeight(outerEl, innerEl) {
				var both = outerEl.add(innerEl);
				var diff;

				// effin' IE8/9/10/11 sometimes returns 0 for dimensions. this weird hack was the only thing that worked
				both.css({
					position: 'relative', // cause a reflow, which will force fresh dimension recalculation
					left: -1 // ensure reflow in case the el was already relative. negative is less likely to cause new scroll
				});
				diff = outerEl.outerHeight() - innerEl.outerHeight(); // grab the dimensions
				both.css({position: '', left: ''}); // undo hack

				return diff;
			}


			/* Element Geom Utilities
----------------------------------------------------------------------------------------------------------------------*/

			FC.getOuterRect = getOuterRect;
			FC.getClientRect = getClientRect;
			FC.getContentRect = getContentRect;
			FC.getScrollbarWidths = getScrollbarWidths;


// borrowed from https://github.com/jquery/jquery-ui/blob/1.11.0/ui/core.js#L51
			function getScrollParent(el) {
				var position = el.css('position'),
					scrollParent = el.parents().filter(function () {
						var parent = $(this);
						return (/(auto|scroll)/).test(
							parent.css('overflow') + parent.css('overflow-y') + parent.css('overflow-x')
						);
					}).eq(0);

				return position === 'fixed' || !scrollParent.length ? $(el[0].ownerDocument || document) : scrollParent;
			}


// Queries the outer bounding area of a jQuery element.
// Returns a rectangle with absolute coordinates: left, right (exclusive), top, bottom (exclusive).
// Origin is optional.
			function getOuterRect(el, origin) {
				var offset = el.offset();
				var left = offset.left - (origin ? origin.left : 0);
				var top = offset.top - (origin ? origin.top : 0);

				return {
					left: left,
					right: left + el.outerWidth(),
					top: top,
					bottom: top + el.outerHeight()
				};
			}


// Queries the area within the margin/border/scrollbars of a jQuery element. Does not go within the padding.
// Returns a rectangle with absolute coordinates: left, right (exclusive), top, bottom (exclusive).
// Origin is optional.
// WARNING: given element can't have borders
// NOTE: should use clientLeft/clientTop, but very unreliable cross-browser.
			function getClientRect(el, origin) {
				var offset = el.offset();
				var scrollbarWidths = getScrollbarWidths(el);
				var left = offset.left + getCssFloat(el, 'border-left-width') + scrollbarWidths.left - (origin ? origin.left : 0);
				var top = offset.top + getCssFloat(el, 'border-top-width') + scrollbarWidths.top - (origin ? origin.top : 0);

				return {
					left: left,
					right: left + el[0].clientWidth, // clientWidth includes padding but NOT scrollbars
					top: top,
					bottom: top + el[0].clientHeight // clientHeight includes padding but NOT scrollbars
				};
			}


// Queries the area within the margin/border/padding of a jQuery element. Assumed not to have scrollbars.
// Returns a rectangle with absolute coordinates: left, right (exclusive), top, bottom (exclusive).
// Origin is optional.
			function getContentRect(el, origin) {
				var offset = el.offset(); // just outside of border, margin not included
				var left = offset.left + getCssFloat(el, 'border-left-width') + getCssFloat(el, 'padding-left') -
					(origin ? origin.left : 0);
				var top = offset.top + getCssFloat(el, 'border-top-width') + getCssFloat(el, 'padding-top') -
					(origin ? origin.top : 0);

				return {
					left: left,
					right: left + el.width(),
					top: top,
					bottom: top + el.height()
				};
			}


// Returns the computed left/right/top/bottom scrollbar widths for the given jQuery element.
// WARNING: given element can't have borders (which will cause offsetWidth/offsetHeight to be larger).
// NOTE: should use clientLeft/clientTop, but very unreliable cross-browser.
			function getScrollbarWidths(el) {
				var leftRightWidth = el[0].offsetWidth - el[0].clientWidth;
				var bottomWidth = el[0].offsetHeight - el[0].clientHeight;
				var widths;

				leftRightWidth = sanitizeScrollbarWidth(leftRightWidth);
				bottomWidth = sanitizeScrollbarWidth(bottomWidth);

				widths = {left: 0, right: 0, top: 0, bottom: bottomWidth};

				if (getIsLeftRtlScrollbars() && el.css('direction') == 'rtl') { // is the scrollbar on the left side?
					widths.left = leftRightWidth;
				}
				else {
					widths.right = leftRightWidth;
				}

				return widths;
			}


// The scrollbar width computations in getScrollbarWidths are sometimes flawed when it comes to
// retina displays, rounding, and IE11. Massage them into a usable value.
			function sanitizeScrollbarWidth(width) {
				width = Math.max(0, width); // no negatives
				width = Math.round(width);
				return width;
			}


// Logic for determining if, when the element is right-to-left, the scrollbar appears on the left side

			var _isLeftRtlScrollbars = null;

			function getIsLeftRtlScrollbars() { // responsible for caching the computation
				if (_isLeftRtlScrollbars === null) {
					_isLeftRtlScrollbars = computeIsLeftRtlScrollbars();
				}
				return _isLeftRtlScrollbars;
			}

			function computeIsLeftRtlScrollbars() { // creates an offscreen test element, then removes it
				var el = $('<div><div/></div>')
					.css({
						position: 'absolute',
						top: -1000,
						left: 0,
						border: 0,
						padding: 0,
						overflow: 'scroll',
						direction: 'rtl'
					})
					.appendTo('body');
				var innerEl = el.children();
				var res = innerEl.offset().left > el.offset().left; // is the inner div shifted to accommodate a left scrollbar?
				el.remove();
				return res;
			}


// Retrieves a jQuery element's computed CSS value as a floating-point number.
// If the queried value is non-numeric (ex: IE can return "medium" for border width), will just return zero.
			function getCssFloat(el, prop) {
				return parseFloat(el.css(prop)) || 0;
			}


			/* Mouse / Touch Utilities
----------------------------------------------------------------------------------------------------------------------*/

			FC.preventDefault = preventDefault;


// Returns a boolean whether this was a left mouse click and no ctrl key (which means right click on Mac)
			function isPrimaryMouseButton(ev) {
				return ev.which == 1 && !ev.ctrlKey;
			}


			function getEvX(ev) {
				var touches = ev.originalEvent.touches;

				// on mobile FF, pageX for touch events is present, but incorrect,
				// so, look at touch coordinates first.
				if (touches && touches.length) {
					return touches[0].pageX;
				}

				return ev.pageX;
			}


			function getEvY(ev) {
				var touches = ev.originalEvent.touches;

				// on mobile FF, pageX for touch events is present, but incorrect,
				// so, look at touch coordinates first.
				if (touches && touches.length) {
					return touches[0].pageY;
				}

				return ev.pageY;
			}


			function getEvIsTouch(ev) {
				return /^touch/.test(ev.type);
			}


			function preventSelection(el) {
				el.addClass('fc-unselectable')
					.on('selectstart', preventDefault);
			}


			function allowSelection(el) {
				el.removeClass('fc-unselectable')
					.off('selectstart', preventDefault);
			}


// Stops a mouse/touch event from doing it's native browser action
			function preventDefault(ev) {
				ev.preventDefault();
			}


			/* General Geometry Utils
----------------------------------------------------------------------------------------------------------------------*/

			FC.intersectRects = intersectRects;

// Returns a new rectangle that is the intersection of the two rectangles. If they don't intersect, returns false
			function intersectRects(rect1, rect2) {
				var res = {
					left: Math.max(rect1.left, rect2.left),
					right: Math.min(rect1.right, rect2.right),
					top: Math.max(rect1.top, rect2.top),
					bottom: Math.min(rect1.bottom, rect2.bottom)
				};

				if (res.left < res.right && res.top < res.bottom) {
					return res;
				}
				return false;
			}


// Returns a new point that will have been moved to reside within the given rectangle
			function constrainPoint(point, rect) {
				return {
					left: Math.min(Math.max(point.left, rect.left), rect.right),
					top: Math.min(Math.max(point.top, rect.top), rect.bottom)
				};
			}


// Returns a point that is the center of the given rectangle
			function getRectCenter(rect) {
				return {
					left: (rect.left + rect.right) / 2,
					top: (rect.top + rect.bottom) / 2
				};
			}


// Subtracts point2's coordinates from point1's coordinates, returning a delta
			function diffPoints(point1, point2) {
				return {
					left: point1.left - point2.left,
					top: point1.top - point2.top
				};
			}


			/* Object Ordering by Field
----------------------------------------------------------------------------------------------------------------------*/

			FC.parseFieldSpecs = parseFieldSpecs;
			FC.compareByFieldSpecs = compareByFieldSpecs;
			FC.compareByFieldSpec = compareByFieldSpec;
			FC.flexibleCompare = flexibleCompare;


			function parseFieldSpecs(input) {
				var specs = [];
				var tokens = [];
				var i, token;

				if (typeof input === 'string') {
					tokens = input.split(/\s*,\s*/);
				}
				else if (typeof input === 'function') {
					tokens = [input];
				}
				else if ($.isArray(input)) {
					tokens = input;
				}

				for (i = 0; i < tokens.length; i++) {
					token = tokens[i];

					if (typeof token === 'string') {
						specs.push(
							token.charAt(0) == '-' ?
								{field: token.substring(1), order: -1} :
								{field: token, order: 1}
						);
					}
					else if (typeof token === 'function') {
						specs.push({func: token});
					}
				}

				return specs;
			}


			function compareByFieldSpecs(obj1, obj2, fieldSpecs) {
				var i;
				var cmp;

				for (i = 0; i < fieldSpecs.length; i++) {
					cmp = compareByFieldSpec(obj1, obj2, fieldSpecs[i]);
					if (cmp) {
						return cmp;
					}
				}

				return 0;
			}


			function compareByFieldSpec(obj1, obj2, fieldSpec) {
				if (fieldSpec.func) {
					return fieldSpec.func(obj1, obj2);
				}
				return flexibleCompare(obj1[fieldSpec.field], obj2[fieldSpec.field]) *
					(fieldSpec.order || 1);
			}


			function flexibleCompare(a, b) {
				if (!a && !b) {
					return 0;
				}
				if (b == null) {
					return -1;
				}
				if (a == null) {
					return 1;
				}
				if ($.type(a) === 'string' || $.type(b) === 'string') {
					return String(a).localeCompare(String(b));
				}
				return a - b;
			}


			/* Date Utilities
----------------------------------------------------------------------------------------------------------------------*/

			FC.computeGreatestUnit = computeGreatestUnit;
			FC.divideRangeByDuration = divideRangeByDuration;
			FC.divideDurationByDuration = divideDurationByDuration;
			FC.multiplyDuration = multiplyDuration;
			FC.durationHasTime = durationHasTime;

			var dayIDs = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
			var unitsDesc = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond']; // descending


// Diffs the two moments into a Duration where full-days are recorded first, then the remaining time.
// Moments will have their timezones normalized.
			function diffDayTime(a, b) {
				return moment.duration({
					days: a.clone().stripTime().diff(b.clone().stripTime(), 'days'),
					ms: a.time() - b.time() // time-of-day from day start. disregards timezone
				});
			}


// Diffs the two moments via their start-of-day (regardless of timezone). Produces whole-day durations.
			function diffDay(a, b) {
				return moment.duration({
					days: a.clone().stripTime().diff(b.clone().stripTime(), 'days')
				});
			}


// Diffs two moments, producing a duration, made of a whole-unit-increment of the given unit. Uses rounding.
			function diffByUnit(a, b, unit) {
				return moment.duration(
					Math.round(a.diff(b, unit, true)), // returnFloat=true
					unit
				);
			}


// Computes the unit name of the largest whole-unit period of time.
// For example, 48 hours will be "days" whereas 49 hours will be "hours".
// Accepts start/end, a range object, or an original duration object.
			function computeGreatestUnit(start, end) {
				var i, unit;
				var val;

				for (i = 0; i < unitsDesc.length; i++) {
					unit = unitsDesc[i];
					val = computeRangeAs(unit, start, end);

					if (val >= 1 && isInt(val)) {
						break;
					}
				}

				return unit; // will be "milliseconds" if nothing else matches
			}


// like computeGreatestUnit, but has special abilities to interpret the source input for clues
			function computeDurationGreatestUnit(duration, durationInput) {
				var unit = computeGreatestUnit(duration);

				// prevent days:7 from being interpreted as a week
				if (unit === 'week' && typeof durationInput === 'object' && durationInput.days) {
					unit = 'day';
				}

				return unit;
			}


// Computes the number of units (like "hours") in the given range.
// Range can be a {start,end} object, separate start/end args, or a Duration.
// Results are based on Moment's .as() and .diff() methods, so results can depend on internal handling
// of month-diffing logic (which tends to vary from version to version).
			function computeRangeAs(unit, start, end) {

				if (end != null) { // given start, end
					return end.diff(start, unit, true);
				}
				else if (moment.isDuration(start)) { // given duration
					return start.as(unit);
				}
				else { // given { start, end } range object
					return start.end.diff(start.start, unit, true);
				}
			}


// Intelligently divides a range (specified by a start/end params) by a duration
			function divideRangeByDuration(start, end, dur) {
				var months;

				if (durationHasTime(dur)) {
					return (end - start) / dur;
				}
				months = dur.asMonths();
				if (Math.abs(months) >= 1 && isInt(months)) {
					return end.diff(start, 'months', true) / months;
				}
				return end.diff(start, 'days', true) / dur.asDays();
			}


// Intelligently divides one duration by another
			function divideDurationByDuration(dur1, dur2) {
				var months1, months2;

				if (durationHasTime(dur1) || durationHasTime(dur2)) {
					return dur1 / dur2;
				}
				months1 = dur1.asMonths();
				months2 = dur2.asMonths();
				if (
					Math.abs(months1) >= 1 && isInt(months1) &&
					Math.abs(months2) >= 1 && isInt(months2)
				) {
					return months1 / months2;
				}
				return dur1.asDays() / dur2.asDays();
			}


// Intelligently multiplies a duration by a number
			function multiplyDuration(dur, n) {
				var months;

				if (durationHasTime(dur)) {
					return moment.duration(dur * n);
				}
				months = dur.asMonths();
				if (Math.abs(months) >= 1 && isInt(months)) {
					return moment.duration({months: months * n});
				}
				return moment.duration({days: dur.asDays() * n});
			}


// Returns a boolean about whether the given duration has any time parts (hours/minutes/seconds/ms)
			function durationHasTime(dur) {
				return Boolean(dur.hours() || dur.minutes() || dur.seconds() || dur.milliseconds());
			}


			function isNativeDate(input) {
				return Object.prototype.toString.call(input) === '[object Date]' || input instanceof Date;
			}


// Returns a boolean about whether the given input is a time string, like "06:40:00" or "06:00"
			function isTimeString(str) {
				return typeof str === 'string' &&
					/^\d+\:\d+(?:\:\d+\.?(?:\d{3})?)?$/.test(str);
			}


			/* Logging and Debug
----------------------------------------------------------------------------------------------------------------------*/

			FC.log = function () {
				var console = window.console;

				if (console && console.log) {
					return console.log.apply(console, arguments);
				}
			};

			FC.warn = function () {
				var console = window.console;

				if (console && console.warn) {
					return console.warn.apply(console, arguments);
				}
				else {
					return FC.log.apply(FC, arguments);
				}
			};


			/* General Utilities
----------------------------------------------------------------------------------------------------------------------*/

			var hasOwnPropMethod = {}.hasOwnProperty;


// Merges an array of objects into a single object.
// The second argument allows for an array of property names who's object values will be merged together.
			function mergeProps(propObjs, complexProps) {
				var dest = {};
				var i, name;
				var complexObjs;
				var j, val;
				var props;

				if (complexProps) {
					for (i = 0; i < complexProps.length; i++) {
						name = complexProps[i];
						complexObjs = [];

						// collect the trailing object values, stopping when a non-object is discovered
						for (j = propObjs.length - 1; j >= 0; j--) {
							val = propObjs[j][name];

							if (typeof val === 'object') {
								complexObjs.unshift(val);
							}
							else if (val !== undefined) {
								dest[name] = val; // if there were no objects, this value will be used
								break;
							}
						}

						// if the trailing values were objects, use the merged value
						if (complexObjs.length) {
							dest[name] = mergeProps(complexObjs);
						}
					}
				}

				// copy values into the destination, going from last to first
				for (i = propObjs.length - 1; i >= 0; i--) {
					props = propObjs[i];

					for (name in props) {
						if (!(name in dest)) { // if already assigned by previous props or complex props, don't reassign
							dest[name] = props[name];
						}
					}
				}

				return dest;
			}


			function copyOwnProps(src, dest) {
				for (var name in src) {
					if (hasOwnProp(src, name)) {
						dest[name] = src[name];
					}
				}
			}


			function hasOwnProp(obj, name) {
				return hasOwnPropMethod.call(obj, name);
			}


			function applyAll(functions, thisObj, args) {
				if ($.isFunction(functions)) {
					functions = [functions];
				}
				if (functions) {
					var i;
					var ret;
					for (i = 0; i < functions.length; i++) {
						ret = functions[i].apply(thisObj, args) || ret;
					}
					return ret;
				}
			}


			function removeMatching(array, testFunc) {
				var removeCnt = 0;
				var i = 0;

				while (i < array.length) {
					if (testFunc(array[i])) { // truthy value means *remove*
						array.splice(i, 1);
						removeCnt++;
					}
					else {
						i++;
					}
				}

				return removeCnt;
			}


			function removeExact(array, exactVal) {
				var removeCnt = 0;
				var i = 0;

				while (i < array.length) {
					if (array[i] === exactVal) {
						array.splice(i, 1);
						removeCnt++;
					}
					else {
						i++;
					}
				}

				return removeCnt;
			}

			FC.removeExact = removeExact;


			function isArraysEqual(a0, a1) {
				var len = a0.length;
				var i;

				if (len == null || len !== a1.length) { // not array? or not same length?
					return false;
				}

				for (i = 0; i < len; i++) {
					if (a0[i] !== a1[i]) {
						return false;
					}
				}

				return true;
			}


			function firstDefined() {
				for (var i = 0; i < arguments.length; i++) {
					if (arguments[i] !== undefined) {
						return arguments[i];
					}
				}
			}


			function htmlEscape(s) {
				return (s + '').replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/'/g, '&#039;')
					.replace(/"/g, '&quot;')
					.replace(/\n/g, '<br />');
			}


			function stripHtmlEntities(text) {
				return text.replace(/&.*?;/g, '');
			}


// Given a hash of CSS properties, returns a string of CSS.
// Uses property names as-is (no camel-case conversion). Will not make statements for null/undefined values.
			function cssToStr(cssProps) {
				var statements = [];

				$.each(cssProps, function (name, val) {
					if (val != null) {
						statements.push(name + ':' + val);
					}
				});

				return statements.join(';');
			}


// Given an object hash of HTML attribute names to values,
// generates a string that can be injected between < > in HTML
			function attrsToStr(attrs) {
				var parts = [];

				$.each(attrs, function (name, val) {
					if (val != null) {
						parts.push(name + '="' + htmlEscape(val) + '"');
					}
				});

				return parts.join(' ');
			}


			function capitaliseFirstLetter(str) {
				return str.charAt(0).toUpperCase() + str.slice(1);
			}


			function compareNumbers(a, b) { // for .sort()
				return a - b;
			}


			function isInt(n) {
				return n % 1 === 0;
			}


// Returns a method bound to the given object context.
// Just like one of the jQuery.proxy signatures, but without the undesired behavior of treating the same method with
// different contexts as identical when binding/unbinding events.
			function proxy(obj, methodName) {
				var method = obj[methodName];

				return function () {
					return method.apply(obj, arguments);
				};
			}


// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// https://github.com/jashkenas/underscore/blob/1.6.0/underscore.js#L714
			function debounce(func, wait, immediate) {
				var timeout, args, context, timestamp, result;

				var later = function () {
					var last = +new Date() - timestamp;
					if (last < wait) {
						timeout = setTimeout(later, wait - last);
					}
					else {
						timeout = null;
						if (!immediate) {
							result = func.apply(context, args);
							context = args = null;
						}
					}
				};

				return function () {
					context = this;
					args = arguments;
					timestamp = +new Date();
					var callNow = immediate && !timeout;
					if (!timeout) {
						timeout = setTimeout(later, wait);
					}
					if (callNow) {
						result = func.apply(context, args);
						context = args = null;
					}
					return result;
				};
			}

			;
			;

			/*
GENERAL NOTE on moments throughout the *entire rest* of the codebase:
All moments are assumed to be ambiguously-zoned unless otherwise noted,
with the NOTABLE EXCEOPTION of start/end dates that live on *Event Objects*.
Ambiguously-TIMED moments are assumed to be ambiguously-zoned by nature.
*/

			var ambigDateOfMonthRegex = /^\s*\d{4}-\d\d$/;
			var ambigTimeOrZoneRegex =
				/^\s*\d{4}-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?)?$/;
			var newMomentProto = moment.fn; // where we will attach our new methods
			var oldMomentProto = $.extend({}, newMomentProto); // copy of original moment methods

// tell momentjs to transfer these properties upon clone
			var momentProperties = moment.momentProperties;
			momentProperties.push('_fullCalendar');
			momentProperties.push('_ambigTime');
			momentProperties.push('_ambigZone');


// Creating
// -------------------------------------------------------------------------------------------------

// Creates a new moment, similar to the vanilla moment(...) constructor, but with
// extra features (ambiguous time, enhanced formatting). When given an existing moment,
// it will function as a clone (and retain the zone of the moment). Anything else will
// result in a moment in the local zone.
			FC.moment = function () {
				return makeMoment(arguments);
			};

// Sames as FC.moment, but forces the resulting moment to be in the UTC timezone.
			FC.moment.utc = function () {
				var mom = makeMoment(arguments, true);

				// Force it into UTC because makeMoment doesn't guarantee it
				// (if given a pre-existing moment for example)
				if (mom.hasTime()) { // don't give ambiguously-timed moments a UTC zone
					mom.utc();
				}

				return mom;
			};

// Same as FC.moment, but when given an ISO8601 string, the timezone offset is preserved.
// ISO8601 strings with no timezone offset will become ambiguously zoned.
			FC.moment.parseZone = function () {
				return makeMoment(arguments, true, true);
			};

// Builds an enhanced moment from args. When given an existing moment, it clones. When given a
// native Date, or called with no arguments (the current time), the resulting moment will be local.
// Anything else needs to be "parsed" (a string or an array), and will be affected by:
//    parseAsUTC - if there is no zone information, should we parse the input in UTC?
//    parseZone - if there is zone information, should we force the zone of the moment?
			function makeMoment(args, parseAsUTC, parseZone) {
				var input = args[0];
				var isSingleString = args.length == 1 && typeof input === 'string';
				var isAmbigTime;
				var isAmbigZone;
				var ambigMatch;
				var mom;

				if (moment.isMoment(input) || isNativeDate(input) || input === undefined) {
					mom = moment.apply(null, args);
				}
				else { // "parsing" is required
					isAmbigTime = false;
					isAmbigZone = false;

					if (isSingleString) {
						if (ambigDateOfMonthRegex.test(input)) {
							// accept strings like '2014-05', but convert to the first of the month
							input += '-01';
							args = [input]; // for when we pass it on to moment's constructor
							isAmbigTime = true;
							isAmbigZone = true;
						}
						else if ((ambigMatch = ambigTimeOrZoneRegex.exec(input))) {
							isAmbigTime = !ambigMatch[5]; // no time part?
							isAmbigZone = true;
						}
					}
					else if ($.isArray(input)) {
						// arrays have no timezone information, so assume ambiguous zone
						isAmbigZone = true;
					}
					// otherwise, probably a string with a format

					if (parseAsUTC || isAmbigTime) {
						mom = moment.utc.apply(moment, args);
					}
					else {
						mom = moment.apply(null, args);
					}

					if (isAmbigTime) {
						mom._ambigTime = true;
						mom._ambigZone = true; // ambiguous time always means ambiguous zone
					}
					else if (parseZone) { // let's record the inputted zone somehow
						if (isAmbigZone) {
							mom._ambigZone = true;
						}
						else if (isSingleString) {
							mom.utcOffset(input); // if not a valid zone, will assign UTC
						}
					}
				}

				mom._fullCalendar = true; // flag for extended functionality

				return mom;
			}


// Week Number
// -------------------------------------------------------------------------------------------------


// Returns the week number, considering the locale's custom week number calcuation
// `weeks` is an alias for `week`
			newMomentProto.week = newMomentProto.weeks = function (input) {
				var weekCalc = this._locale._fullCalendar_weekCalc;

				if (input == null && typeof weekCalc === 'function') { // custom function only works for getter
					return weekCalc(this);
				}
				else if (weekCalc === 'ISO') {
					return oldMomentProto.isoWeek.apply(this, arguments); // ISO getter/setter
				}

				return oldMomentProto.week.apply(this, arguments); // local getter/setter
			};


// Time-of-day
// -------------------------------------------------------------------------------------------------

// GETTER
// Returns a Duration with the hours/minutes/seconds/ms values of the moment.
// If the moment has an ambiguous time, a duration of 00:00 will be returned.
//
// SETTER
// You can supply a Duration, a Moment, or a Duration-like argument.
// When setting the time, and the moment has an ambiguous time, it then becomes unambiguous.
			newMomentProto.time = function (time) {

				// Fallback to the original method (if there is one) if this moment wasn't created via FullCalendar.
				// `time` is a generic enough method name where this precaution is necessary to avoid collisions w/ other plugins.
				if (!this._fullCalendar) {
					return oldMomentProto.time.apply(this, arguments);
				}

				if (time == null) { // getter
					return moment.duration({
						hours: this.hours(),
						minutes: this.minutes(),
						seconds: this.seconds(),
						milliseconds: this.milliseconds()
					});
				}
				else { // setter

					this._ambigTime = false; // mark that the moment now has a time

					if (!moment.isDuration(time) && !moment.isMoment(time)) {
						time = moment.duration(time);
					}

					// The day value should cause overflow (so 24 hours becomes 00:00:00 of next day).
					// Only for Duration times, not Moment times.
					var dayHours = 0;
					if (moment.isDuration(time)) {
						dayHours = Math.floor(time.asDays()) * 24;
					}

					// We need to set the individual fields.
					// Can't use startOf('day') then add duration. In case of DST at start of day.
					return this.hours(dayHours + time.hours())
						.minutes(time.minutes())
						.seconds(time.seconds())
						.milliseconds(time.milliseconds());
				}
			};

// Converts the moment to UTC, stripping out its time-of-day and timezone offset,
// but preserving its YMD. A moment with a stripped time will display no time
// nor timezone offset when .format() is called.
			newMomentProto.stripTime = function () {

				if (!this._ambigTime) {

					this.utc(true); // keepLocalTime=true (for keeping *date* value)

					// set time to zero
					this.set({
						hours: 0,
						minutes: 0,
						seconds: 0,
						ms: 0
					});

					// Mark the time as ambiguous. This needs to happen after the .utc() call, which might call .utcOffset(),
					// which clears all ambig flags.
					this._ambigTime = true;
					this._ambigZone = true; // if ambiguous time, also ambiguous timezone offset
				}

				return this; // for chaining
			};

// Returns if the moment has a non-ambiguous time (boolean)
			newMomentProto.hasTime = function () {
				return !this._ambigTime;
			};


// Timezone
// -------------------------------------------------------------------------------------------------

// Converts the moment to UTC, stripping out its timezone offset, but preserving its
// YMD and time-of-day. A moment with a stripped timezone offset will display no
// timezone offset when .format() is called.
			newMomentProto.stripZone = function () {
				var wasAmbigTime;

				if (!this._ambigZone) {

					wasAmbigTime = this._ambigTime;

					this.utc(true); // keepLocalTime=true (for keeping date and time values)

					// the above call to .utc()/.utcOffset() unfortunately might clear the ambig flags, so restore
					this._ambigTime = wasAmbigTime || false;

					// Mark the zone as ambiguous. This needs to happen after the .utc() call, which might call .utcOffset(),
					// which clears the ambig flags.
					this._ambigZone = true;
				}

				return this; // for chaining
			};

// Returns of the moment has a non-ambiguous timezone offset (boolean)
			newMomentProto.hasZone = function () {
				return !this._ambigZone;
			};


// implicitly marks a zone
			newMomentProto.local = function (keepLocalTime) {

				// for when converting from ambiguously-zoned to local,
				// keep the time values when converting from UTC -> local
				oldMomentProto.local.call(this, this._ambigZone || keepLocalTime);

				// ensure non-ambiguous
				// this probably already happened via local() -> utcOffset(), but don't rely on Moment's internals
				this._ambigTime = false;
				this._ambigZone = false;

				return this; // for chaining
			};


// implicitly marks a zone
			newMomentProto.utc = function (keepLocalTime) {

				oldMomentProto.utc.call(this, keepLocalTime);

				// ensure non-ambiguous
				// this probably already happened via utc() -> utcOffset(), but don't rely on Moment's internals
				this._ambigTime = false;
				this._ambigZone = false;

				return this;
			};


// implicitly marks a zone (will probably get called upon .utc() and .local())
			newMomentProto.utcOffset = function (tzo) {

				if (tzo != null) { // setter
					// these assignments needs to happen before the original zone method is called.
					// I forget why, something to do with a browser crash.
					this._ambigTime = false;
					this._ambigZone = false;
				}

				return oldMomentProto.utcOffset.apply(this, arguments);
			};


// Formatting
// -------------------------------------------------------------------------------------------------

			newMomentProto.format = function () {

				if (this._fullCalendar && arguments[0]) { // an enhanced moment? and a format string provided?
					return formatDate(this, arguments[0]); // our extended formatting
				}
				if (this._ambigTime) {
					return oldMomentFormat(englishMoment(this), 'YYYY-MM-DD');
				}
				if (this._ambigZone) {
					return oldMomentFormat(englishMoment(this), 'YYYY-MM-DD[T]HH:mm:ss');
				}
				if (this._fullCalendar) { // enhanced non-ambig moment?
					// moment.format() doesn't ensure english, but we want to.
					return oldMomentFormat(englishMoment(this));
				}

				return oldMomentProto.format.apply(this, arguments);
			};

			newMomentProto.toISOString = function () {

				if (this._ambigTime) {
					return oldMomentFormat(englishMoment(this), 'YYYY-MM-DD');
				}
				if (this._ambigZone) {
					return oldMomentFormat(englishMoment(this), 'YYYY-MM-DD[T]HH:mm:ss');
				}
				if (this._fullCalendar) { // enhanced non-ambig moment?
					// depending on browser, moment might not output english. ensure english.
					// https://github.com/moment/moment/blob/2.18.1/src/lib/moment/format.js#L22
					return oldMomentProto.toISOString.apply(englishMoment(this), arguments);
				}

				return oldMomentProto.toISOString.apply(this, arguments);
			};

			function englishMoment(mom) {
				if (mom.locale() !== 'en') {
					return mom.clone().locale('en');
				}
				return mom;
			}

			;
			;
			(function () {

// exports
				FC.formatDate = formatDate;
				FC.formatRange = formatRange;
				FC.oldMomentFormat = oldMomentFormat;
				FC.queryMostGranularFormatUnit = queryMostGranularFormatUnit;


// Config
// ---------------------------------------------------------------------------------------------------------------------

				/*
Inserted between chunks in the fake ("intermediate") formatting string.
Important that it passes as whitespace (\s) because moment often identifies non-standalone months
via a regexp with an \s.
*/
				var PART_SEPARATOR = '\u000b'; // vertical tab

				/*
Inserted as the first character of a literal-text chunk to indicate that the literal text is not actually literal text,
but rather, a "special" token that has custom rendering (see specialTokens map).
*/
				var SPECIAL_TOKEN_MARKER = '\u001f'; // information separator 1

				/*
Inserted at the beginning and end of a span of text that must have non-zero numeric characters.
Handling of these markers is done in a post-processing step at the very end of text rendering.
*/
				var MAYBE_MARKER = '\u001e'; // information separator 2
				var MAYBE_REGEXP = new RegExp(MAYBE_MARKER + '([^' + MAYBE_MARKER + ']*)' + MAYBE_MARKER, 'g'); // must be global

				/*
Addition formatting tokens we want recognized
*/
				var specialTokens = {
					t: function (date) { // "a" or "p"
						return oldMomentFormat(date, 'a').charAt(0);
					},
					T: function (date) { // "A" or "P"
						return oldMomentFormat(date, 'A').charAt(0);
					}
				};

				/*
The first characters of formatting tokens for units that are 1 day or larger.
`value` is for ranking relative size (lower means bigger).
`unit` is a normalized unit, used for comparing moments.
*/
				var largeTokenMap = {
					Y: {value: 1, unit: 'year'},
					M: {value: 2, unit: 'month'},
					W: {value: 3, unit: 'week'}, // ISO week
					w: {value: 3, unit: 'week'}, // local week
					D: {value: 4, unit: 'day'}, // day of month
					d: {value: 4, unit: 'day'} // day of week
				};


// Single Date Formatting
// ---------------------------------------------------------------------------------------------------------------------

				/*
Formats `date` with a Moment formatting string, but allow our non-zero areas and special token
*/
				function formatDate(date, formatStr) {
					return renderFakeFormatString(
						getParsedFormatString(formatStr).fakeFormatString,
						date
					);
				}

				/*
Call this if you want Moment's original format method to be used
*/
				function oldMomentFormat(mom, formatStr) {
					return oldMomentProto.format.call(mom, formatStr); // oldMomentProto defined in moment-ext.js
				}


// Date Range Formatting
// -------------------------------------------------------------------------------------------------
// TODO: make it work with timezone offset

				/*
Using a formatting string meant for a single date, generate a range string, like
"Sep 2 - 9 2013", that intelligently inserts a separator where the dates differ.
If the dates are the same as far as the format string is concerned, just return a single
rendering of one date, without any separator.
*/
				function formatRange(date1, date2, formatStr, separator, isRTL) {
					var localeData;

					date1 = FC.moment.parseZone(date1);
					date2 = FC.moment.parseZone(date2);

					localeData = date1.localeData();

					// Expand localized format strings, like "LL" -> "MMMM D YYYY".
					// BTW, this is not important for `formatDate` because it is impossible to put custom tokens
					// or non-zero areas in Moment's localized format strings.
					formatStr = localeData.longDateFormat(formatStr) || formatStr;

					return renderParsedFormat(
						getParsedFormatString(formatStr),
						date1,
						date2,
						separator || ' - ',
						isRTL
					);
				}

				/*
Renders a range with an already-parsed format string.
*/
				function renderParsedFormat(parsedFormat, date1, date2, separator, isRTL) {
					var sameUnits = parsedFormat.sameUnits;
					var unzonedDate1 = date1.clone().stripZone(); // for same-unit comparisons
					var unzonedDate2 = date2.clone().stripZone(); // "

					var renderedParts1 = renderFakeFormatStringParts(parsedFormat.fakeFormatString, date1);
					var renderedParts2 = renderFakeFormatStringParts(parsedFormat.fakeFormatString, date2);

					var leftI;
					var leftStr = '';
					var rightI;
					var rightStr = '';
					var middleI;
					var middleStr1 = '';
					var middleStr2 = '';
					var middleStr = '';

					// Start at the leftmost side of the formatting string and continue until you hit a token
					// that is not the same between dates.
					for (
						leftI = 0;
						leftI < sameUnits.length && (!sameUnits[leftI] || unzonedDate1.isSame(unzonedDate2, sameUnits[leftI]));
						leftI++
					) {
						leftStr += renderedParts1[leftI];
					}

					// Similarly, start at the rightmost side of the formatting string and move left
					for (
						rightI = sameUnits.length - 1;
						rightI > leftI && (!sameUnits[rightI] || unzonedDate1.isSame(unzonedDate2, sameUnits[rightI]));
						rightI--
					) {
						// If current chunk is on the boundary of unique date-content, and is a special-case
						// date-formatting postfix character, then don't consume it. Consider it unique date-content.
						// TODO: make configurable
						if (rightI - 1 === leftI && renderedParts1[rightI] === '.') {
							break;
						}

						rightStr = renderedParts1[rightI] + rightStr;
					}

					// The area in the middle is different for both of the dates.
					// Collect them distinctly so we can jam them together later.
					for (middleI = leftI; middleI <= rightI; middleI++) {
						middleStr1 += renderedParts1[middleI];
						middleStr2 += renderedParts2[middleI];
					}

					if (middleStr1 || middleStr2) {
						if (isRTL) {
							middleStr = middleStr2 + separator + middleStr1;
						}
						else {
							middleStr = middleStr1 + separator + middleStr2;
						}
					}

					return processMaybeMarkers(
						leftStr + middleStr + rightStr
					);
				}


// Format String Parsing
// ---------------------------------------------------------------------------------------------------------------------

				var parsedFormatStrCache = {};

				/*
Returns a parsed format string, leveraging a cache.
*/
				function getParsedFormatString(formatStr) {
					return parsedFormatStrCache[formatStr] ||
						(parsedFormatStrCache[formatStr] = parseFormatString(formatStr));
				}

				/*
Parses a format string into the following:
- fakeFormatString: a momentJS formatting string, littered with special control characters that get post-processed.
- sameUnits: for every part in fakeFormatString, if the part is a token, the value will be a unit string (like "day"),
  that indicates how similar a range's start & end must be in order to share the same formatted text.
  If not a token, then the value is null.
  Always a flat array (not nested liked "chunks").
*/
				function parseFormatString(formatStr) {
					var chunks = chunkFormatString(formatStr);

					return {
						fakeFormatString: buildFakeFormatString(chunks),
						sameUnits: buildSameUnits(chunks)
					};
				}

				/*
Break the formatting string into an array of chunks.
A 'maybe' chunk will have nested chunks.
*/
				function chunkFormatString(formatStr) {
					var chunks = [];
					var match;

					// TODO: more descrimination
					// \4 is a backreference to the first character of a multi-character set.
					var chunker = /\[([^\]]*)\]|\(([^\)]*)\)|(LTS|LT|(\w)\4*o?)|([^\w\[\(]+)/g;

					while ((match = chunker.exec(formatStr))) {
						if (match[1]) { // a literal string inside [ ... ]
							chunks.push.apply(chunks, // append
								splitStringLiteral(match[1])
							);
						}
						else if (match[2]) { // non-zero formatting inside ( ... )
							chunks.push({maybe: chunkFormatString(match[2])});
						}
						else if (match[3]) { // a formatting token
							chunks.push({token: match[3]});
						}
						else if (match[5]) { // an unenclosed literal string
							chunks.push.apply(chunks, // append
								splitStringLiteral(match[5])
							);
						}
					}

					return chunks;
				}

				/*
Potentially splits a literal-text string into multiple parts. For special cases.
*/
				function splitStringLiteral(s) {
					if (s === '. ') {
						return ['.', ' ']; // for locales with periods bound to the end of each year/month/date
					}
					else {
						return [s];
					}
				}

				/*
Given chunks parsed from a real format string, generate a fake (aka "intermediate") format string with special control
characters that will eventually be given to moment for formatting, and then post-processed.
*/
				function buildFakeFormatString(chunks) {
					var parts = [];
					var i, chunk;

					for (i = 0; i < chunks.length; i++) {
						chunk = chunks[i];

						if (typeof chunk === 'string') {
							parts.push('[' + chunk + ']');
						}
						else if (chunk.token) {
							if (chunk.token in specialTokens) {
								parts.push(
									SPECIAL_TOKEN_MARKER + // useful during post-processing
									'[' + chunk.token + ']' // preserve as literal text
								);
							}
							else {
								parts.push(chunk.token); // unprotected text implies a format string
							}
						}
						else if (chunk.maybe) {
							parts.push(
								MAYBE_MARKER + // useful during post-processing
								buildFakeFormatString(chunk.maybe) +
								MAYBE_MARKER
							);
						}
					}

					return parts.join(PART_SEPARATOR);
				}

				/*
Given parsed chunks from a real formatting string, generates an array of unit strings (like "day") that indicate
in which regard two dates must be similar in order to share range formatting text.
The `chunks` can be nested (because of "maybe" chunks), however, the returned array will be flat.
*/
				function buildSameUnits(chunks) {
					var units = [];
					var i, chunk;
					var tokenInfo;

					for (i = 0; i < chunks.length; i++) {
						chunk = chunks[i];

						if (chunk.token) {
							tokenInfo = largeTokenMap[chunk.token.charAt(0)];
							units.push(tokenInfo ? tokenInfo.unit : 'second'); // default to a very strict same-second
						}
						else if (chunk.maybe) {
							units.push.apply(units, // append
								buildSameUnits(chunk.maybe)
							);
						}
						else {
							units.push(null);
						}
					}

					return units;
				}


// Rendering to text
// ---------------------------------------------------------------------------------------------------------------------

				/*
Formats a date with a fake format string, post-processes the control characters, then returns.
*/
				function renderFakeFormatString(fakeFormatString, date) {
					return processMaybeMarkers(
						renderFakeFormatStringParts(fakeFormatString, date).join('')
					);
				}

				/*
Formats a date into parts that will have been post-processed, EXCEPT for the "maybe" markers.
*/
				function renderFakeFormatStringParts(fakeFormatString, date) {
					var parts = [];
					var fakeRender = oldMomentFormat(date, fakeFormatString);
					var fakeParts = fakeRender.split(PART_SEPARATOR);
					var i, fakePart;

					for (i = 0; i < fakeParts.length; i++) {
						fakePart = fakeParts[i];

						if (fakePart.charAt(0) === SPECIAL_TOKEN_MARKER) {
							parts.push(
								// the literal string IS the token's name.
								// call special token's registered function.
								specialTokens[fakePart.substring(1)](date)
							);
						}
						else {
							parts.push(fakePart);
						}
					}

					return parts;
				}

				/*
Accepts an almost-finally-formatted string and processes the "maybe" control characters, returning a new string.
*/
				function processMaybeMarkers(s) {
					return s.replace(MAYBE_REGEXP, function (m0, m1) { // regex assumed to have 'g' flag
						if (m1.match(/[1-9]/)) { // any non-zero numeric characters?
							return m1;
						}
						else {
							return '';
						}
					});
				}


// Misc Utils
// -------------------------------------------------------------------------------------------------

				/*
Returns a unit string, either 'year', 'month', 'day', or null for the most granular formatting token in the string.
*/
				function queryMostGranularFormatUnit(formatStr) {
					var chunks = chunkFormatString(formatStr);
					var i, chunk;
					var candidate;
					var best;

					for (i = 0; i < chunks.length; i++) {
						chunk = chunks[i];

						if (chunk.token) {
							candidate = largeTokenMap[chunk.token.charAt(0)];
							if (candidate) {
								if (!best || candidate.value > best.value) {
									best = candidate;
								}
							}
						}
					}

					if (best) {
						return best.unit;
					}

					return null;
				};

			})();

// quick local references
			var formatDate = FC.formatDate;
			var formatRange = FC.formatRange;
			var oldMomentFormat = FC.oldMomentFormat;

			;
			;

			FC.Class = Class; // export

// Class that all other classes will inherit from
			function Class() {
			}


// Called on a class to create a subclass.
// Last argument contains instance methods. Any argument before the last are considered mixins.
			Class.extend = function () {
				var members = {};
				var i;

				for (i = 0; i < arguments.length; i++) {
					copyOwnProps(arguments[i], members);
				}

				return extendClass(this, members);
			};


// Adds new member variables/methods to the class's prototype.
// Can be called with another class, or a plain object hash containing new members.
			Class.mixin = function (members) {
				copyOwnProps(members, this.prototype);
			};


			function extendClass(superClass, members) {
				var subClass;

				// ensure a constructor for the subclass, forwarding all arguments to the super-constructor if it doesn't exist
				if (hasOwnProp(members, 'constructor')) {
					subClass = members.constructor;
				}
				if (typeof subClass !== 'function') {
					subClass = members.constructor = function () {
						superClass.apply(this, arguments);
					};
				}

				// build the base prototype for the subclass, which is an new object chained to the superclass's prototype
				subClass.prototype = Object.create(superClass.prototype);

				// copy each member variable/method onto the the subclass's prototype
				copyOwnProps(members, subClass.prototype);

				// copy over all class variables/methods to the subclass, such as `extend` and `mixin`
				copyOwnProps(superClass, subClass);

				return subClass;
			}

			;
			;

			var EmitterMixin = FC.EmitterMixin = {

				// jQuery-ification via $(this) allows a non-DOM object to have
				// the same event handling capabilities (including namespaces).


				on: function (types, handler) {
					$(this).on(types, this._prepareIntercept(handler));
					return this; // for chaining
				},


				one: function (types, handler) {
					$(this).one(types, this._prepareIntercept(handler));
					return this; // for chaining
				},


				_prepareIntercept: function (handler) {
					// handlers are always called with an "event" object as their first param.
					// sneak the `this` context and arguments into the extra parameter object
					// and forward them on to the original handler.
					var intercept = function (ev, extra) {
						return handler.apply(
							extra.context || this,
							extra.args || []
						);
					};

					// mimick jQuery's internal "proxy" system (risky, I know)
					// causing all functions with the same .guid to appear to be the same.
					// https://github.com/jquery/jquery/blob/2.2.4/src/core.js#L448
					// this is needed for calling .off with the original non-intercept handler.
					if (!handler.guid) {
						handler.guid = $.guid++;
					}
					intercept.guid = handler.guid;

					return intercept;
				},


				off: function (types, handler) {
					$(this).off(types, handler);

					return this; // for chaining
				},


				trigger: function (types) {
					var args = Array.prototype.slice.call(arguments, 1); // arguments after the first

					// pass in "extra" info to the intercept
					$(this).triggerHandler(types, {args: args});

					return this; // for chaining
				},


				triggerWith: function (types, context, args) {

					// `triggerHandler` is less reliant on the DOM compared to `trigger`.
					// pass in "extra" info to the intercept.
					$(this).triggerHandler(types, {context: context, args: args});

					return this; // for chaining
				},


				hasHandlers: function (type) {
					var hash = $._data(this, 'events'); // http://blog.jquery.com/2012/08/09/jquery-1-8-released/

					return hash && hash[type] && hash[type].length > 0;
				}

			};

			;
			;

			/*
Utility methods for easily listening to events on another object,
and more importantly, easily unlistening from them.
*/
			var ListenerMixin = FC.ListenerMixin = (function () {
				var guid = 0;
				var ListenerMixin = {

					listenerId: null,

					/*
		Given an `other` object that has on/off methods, bind the given `callback` to an event by the given name.
		The `callback` will be called with the `this` context of the object that .listenTo is being called on.
		Can be called:
			.listenTo(other, eventName, callback)
		OR
			.listenTo(other, {
				eventName1: callback1,
				eventName2: callback2
			})
		*/
					listenTo: function (other, arg, callback) {
						if (typeof arg === 'object') { // given dictionary of callbacks
							for (var eventName in arg) {
								if (arg.hasOwnProperty(eventName)) {
									this.listenTo(other, eventName, arg[eventName]);
								}
							}
						}
						else if (typeof arg === 'string') {
							other.on(
								arg + '.' + this.getListenerNamespace(), // use event namespacing to identify this object
								$.proxy(callback, this) // always use `this` context
								// the usually-undesired jQuery guid behavior doesn't matter,
								// because we always unbind via namespace
							);
						}
					},

					/*
		Causes the current object to stop listening to events on the `other` object.
		`eventName` is optional. If omitted, will stop listening to ALL events on `other`.
		*/
					stopListeningTo: function (other, eventName) {
						other.off((eventName || '') + '.' + this.getListenerNamespace());
					},

					/*
		Returns a string, unique to this object, to be used for event namespacing
		*/
					getListenerNamespace: function () {
						if (this.listenerId == null) {
							this.listenerId = guid++;
						}
						return '_listener' + this.listenerId;
					}

				};
				return ListenerMixin;
			})();
			;
			;

			var ParsableModelMixin = {

				standardPropMap: {}, // will be cloned by defineStandardProps


				/*
	Returns true/false for success.
	Meant to be only called ONCE, at object creation.
	*/
				applyProps: function (rawProps) {
					var standardPropMap = this.standardPropMap;
					var manualProps = {};
					var miscProps = {};
					var propName;

					for (propName in rawProps) {
						if (standardPropMap[propName] === true) { // copy verbatim
							this[propName] = rawProps[propName];
						}
						else if (standardPropMap[propName] === false) {
							manualProps[propName] = rawProps[propName];
						}
						else {
							miscProps[propName] = rawProps[propName];
						}
					}

					this.applyMiscProps(miscProps);

					return this.applyManualStandardProps(manualProps);
				},


				/*
	If subclasses override, they must call this supermethod and return the boolean response.
	Meant to be only called ONCE, at object creation.
	*/
				applyManualStandardProps: function (rawProps) {
					return true;
				},


				/*
	Can be called even after initial object creation.
	*/
				applyMiscProps: function (rawProps) {
					// subclasses can implement
				},


				/*
	TODO: why is this a method when defineStandardProps is static
	*/
				isStandardProp: function (propName) {
					return propName in this.standardPropMap;
				}

			};


			/*
TODO: devise a better system
*/
			var ParsableModelMixin_defineStandardProps = function (propDefs) {
				var proto = this.prototype;

				if (!proto.hasOwnProperty('standardPropMap')) {
					proto.standardPropMap = Object.create(proto.standardPropMap);
				}

				copyOwnProps(propDefs, proto.standardPropMap);
			};


			/*
TODO: devise a better system
*/
			var ParsableModelMixin_copyVerbatimStandardProps = function (src, dest) {
				var map = this.prototype.standardPropMap;
				var propName;

				for (propName in map) {
					if (
						src[propName] != null && // in the src object?
						map[propName] === true // false means "copy verbatim"
					) {
						dest[propName] = src[propName];
					}
				}
			};

			;
			;

			var Model = Class.extend(EmitterMixin, ListenerMixin, {

				_props: null,
				_watchers: null,
				_globalWatchArgs: {}, // mutation protection in Model.watch

				constructor: function () {
					this._watchers = {};
					this._props = {};
					this.applyGlobalWatchers();
					this.constructed();
				},

				// useful for monkeypatching. TODO: BaseClass?
				constructed: function () {
				},

				applyGlobalWatchers: function () {
					var map = this._globalWatchArgs;
					var name;

					for (name in map) {
						this.watch.apply(this, map[name]);
					}
				},

				has: function (name) {
					return name in this._props;
				},

				get: function (name) {
					if (name === undefined) {
						return this._props;
					}

					return this._props[name];
				},

				set: function (name, val) {
					var newProps;

					if (typeof name === 'string') {
						newProps = {};
						newProps[name] = val === undefined ? null : val;
					}
					else {
						newProps = name;
					}

					this.setProps(newProps);
				},

				reset: function (newProps) {
					var oldProps = this._props;
					var changeset = {}; // will have undefined's to signal unsets
					var name;

					for (name in oldProps) {
						changeset[name] = undefined;
					}

					for (name in newProps) {
						changeset[name] = newProps[name];
					}

					this.setProps(changeset);
				},

				unset: function (name) { // accepts a string or array of strings
					var newProps = {};
					var names;
					var i;

					if (typeof name === 'string') {
						names = [name];
					}
					else {
						names = name;
					}

					for (i = 0; i < names.length; i++) {
						newProps[names[i]] = undefined;
					}

					this.setProps(newProps);
				},

				setProps: function (newProps) {
					var changedProps = {};
					var changedCnt = 0;
					var name, val;

					for (name in newProps) {
						val = newProps[name];

						// a change in value?
						// if an object, don't check equality, because might have been mutated internally.
						// TODO: eventually enforce immutability.
						if (
							typeof val === 'object' ||
							val !== this._props[name]
						) {
							changedProps[name] = val;
							changedCnt++;
						}
					}

					if (changedCnt) {

						this.trigger('before:batchChange', changedProps);

						for (name in changedProps) {
							val = changedProps[name];

							this.trigger('before:change', name, val);
							this.trigger('before:change:' + name, val);
						}

						for (name in changedProps) {
							val = changedProps[name];

							if (val === undefined) {
								delete this._props[name];
							}
							else {
								this._props[name] = val;
							}

							this.trigger('change:' + name, val);
							this.trigger('change', name, val);
						}

						this.trigger('batchChange', changedProps);
					}
				},

				watch: function (name, depList, startFunc, stopFunc) {
					var _this = this;

					this.unwatch(name);

					this._watchers[name] = this._watchDeps(depList, function (deps) {
						var res = startFunc.call(_this, deps);

						if (res && res.then) {
							_this.unset(name); // put in an unset state while resolving
							res.then(function (val) {
								_this.set(name, val);
							});
						}
						else {
							_this.set(name, res);
						}
					}, function (deps) {
						_this.unset(name);

						if (stopFunc) {
							stopFunc.call(_this, deps);
						}
					});
				},

				unwatch: function (name) {
					var watcher = this._watchers[name];

					if (watcher) {
						delete this._watchers[name];
						watcher.teardown();
					}
				},

				_watchDeps: function (depList, startFunc, stopFunc) {
					var _this = this;
					var queuedChangeCnt = 0;
					var depCnt = depList.length;
					var satisfyCnt = 0;
					var values = {}; // what's passed as the `deps` arguments
					var bindTuples = []; // array of [ eventName, handlerFunc ] arrays
					var isCallingStop = false;

					function onBeforeDepChange(depName, val, isOptional) {
						queuedChangeCnt++;
						if (queuedChangeCnt === 1) { // first change to cause a "stop" ?
							if (satisfyCnt === depCnt) { // all deps previously satisfied?
								isCallingStop = true;
								stopFunc(values);
								isCallingStop = false;
							}
						}
					}

					function onDepChange(depName, val, isOptional) {

						if (val === undefined) { // unsetting a value?

							// required dependency that was previously set?
							if (!isOptional && values[depName] !== undefined) {
								satisfyCnt--;
							}

							delete values[depName];
						}
						else { // setting a value?

							// required dependency that was previously unset?
							if (!isOptional && values[depName] === undefined) {
								satisfyCnt++;
							}

							values[depName] = val;
						}

						queuedChangeCnt--;
						if (!queuedChangeCnt) { // last change to cause a "start"?

							// now finally satisfied or satisfied all along?
							if (satisfyCnt === depCnt) {

								// if the stopFunc initiated another value change, ignore it.
								// it will be processed by another change event anyway.
								if (!isCallingStop) {
									startFunc(values);
								}
							}
						}
					}

					// intercept for .on() that remembers handlers
					function bind(eventName, handler) {
						_this.on(eventName, handler);
						bindTuples.push([eventName, handler]);
					}

					// listen to dependency changes
					depList.forEach(function (depName) {
						var isOptional = false;

						if (depName.charAt(0) === '?') { // TODO: more DRY
							depName = depName.substring(1);
							isOptional = true;
						}

						bind('before:change:' + depName, function (val) {
							onBeforeDepChange(depName, val, isOptional);
						});

						bind('change:' + depName, function (val) {
							onDepChange(depName, val, isOptional);
						});
					});

					// process current dependency values
					depList.forEach(function (depName) {
						var isOptional = false;

						if (depName.charAt(0) === '?') { // TODO: more DRY
							depName = depName.substring(1);
							isOptional = true;
						}

						if (_this.has(depName)) {
							values[depName] = _this.get(depName);
							satisfyCnt++;
						}
						else if (isOptional) {
							satisfyCnt++;
						}
					});

					// initially satisfied
					if (satisfyCnt === depCnt) {
						startFunc(values);
					}

					return {
						teardown: function () {
							// remove all handlers
							for (var i = 0; i < bindTuples.length; i++) {
								_this.off(bindTuples[i][0], bindTuples[i][1]);
							}
							bindTuples = null;

							// was satisfied, so call stopFunc
							if (satisfyCnt === depCnt) {
								stopFunc();
							}
						},
						flash: function () {
							if (satisfyCnt === depCnt) {
								stopFunc();
								startFunc(values);
							}
						}
					};
				},

				flash: function (name) {
					var watcher = this._watchers[name];

					if (watcher) {
						watcher.flash();
					}
				}

			});


			Model.watch = function (name /* , depList, startFunc, stopFunc */) {

				// subclasses should make a masked-copy of the superclass's map
				// TODO: write test
				if (!this.prototype.hasOwnProperty('_globalWatchArgs')) {
					this.prototype._globalWatchArgs = Object.create(this.prototype._globalWatchArgs);
				}

				this.prototype._globalWatchArgs[name] = arguments;
			};


			FC.Model = Model;


			;
			;

			var Promise = {

				construct: function (executor) {
					var deferred = $.Deferred();
					var promise = deferred.promise();

					if (typeof executor === 'function') {
						executor(
							function (val) { // resolve
								deferred.resolve(val);
								attachImmediatelyResolvingThen(promise, val);
							},
							function () { // reject
								deferred.reject();
								attachImmediatelyRejectingThen(promise);
							}
						);
					}

					return promise;
				},

				resolve: function (val) {
					var deferred = $.Deferred().resolve(val);
					var promise = deferred.promise();

					attachImmediatelyResolvingThen(promise, val);

					return promise;
				},

				reject: function () {
					var deferred = $.Deferred().reject();
					var promise = deferred.promise();

					attachImmediatelyRejectingThen(promise);

					return promise;
				}

			};


			function attachImmediatelyResolvingThen(promise, val) {
				promise.then = function (onResolve) {
					if (typeof onResolve === 'function') {
						return Promise.resolve(onResolve(val));
					}
					return promise;
				};
			}


			function attachImmediatelyRejectingThen(promise) {
				promise.then = function (onResolve, onReject) {
					if (typeof onReject === 'function') {
						onReject();
					}
					return promise;
				};
			}


			FC.Promise = Promise;

			;
			;

			var TaskQueue = Class.extend(EmitterMixin, {

				q: null,
				isPaused: false,
				isRunning: false,


				constructor: function () {
					this.q = [];
				},


				queue: function (/* taskFunc, taskFunc... */) {
					this.q.push.apply(this.q, arguments); // append
					this.tryStart();
				},


				pause: function () {
					this.isPaused = true;
				},


				resume: function () {
					this.isPaused = false;
					this.tryStart();
				},


				getIsIdle: function () {
					return !this.isRunning && !this.isPaused;
				},


				tryStart: function () {
					if (!this.isRunning && this.canRunNext()) {
						this.isRunning = true;
						this.trigger('start');
						this.runRemaining();
					}
				},


				canRunNext: function () {
					return !this.isPaused && this.q.length;
				},


				runRemaining: function () { // assumes at least one task in queue. does not check canRunNext for first task.
					var _this = this;
					var task;
					var res;

					do {
						task = this.q.shift(); // always freshly reference q. might have been reassigned.
						res = this.runTask(task);

						if (res && res.then) {
							res.then(function () { // jshint ignore:line
								if (_this.canRunNext()) {
									_this.runRemaining();
								}
							});
							return; // prevent marking as stopped
						}
					} while (this.canRunNext());

					this.trigger('stop'); // not really a 'stop' ... more of a 'drained'
					this.isRunning = false;

					// if 'stop' handler added more tasks.... TODO: write test for this
					this.tryStart();
				},


				runTask: function (task) {
					return task(); // task *is* the function, but subclasses can change the format of a task
				}

			});

			FC.TaskQueue = TaskQueue;

			;
			;

			var RenderQueue = TaskQueue.extend({

				waitsByNamespace: null,
				waitNamespace: null,
				waitId: null,


				constructor: function (waitsByNamespace) {
					TaskQueue.call(this); // super-constructor

					this.waitsByNamespace = waitsByNamespace || {};
				},


				queue: function (taskFunc, namespace, type) {
					var task = {
						func: taskFunc,
						namespace: namespace,
						type: type
					};
					var waitMs;

					if (namespace) {
						waitMs = this.waitsByNamespace[namespace];
					}

					if (this.waitNamespace) {
						if (namespace === this.waitNamespace && waitMs != null) {
							this.delayWait(waitMs);
						}
						else {
							this.clearWait();
							this.tryStart();
						}
					}

					if (this.compoundTask(task)) { // appended to queue?

						if (!this.waitNamespace && waitMs != null) {
							this.startWait(namespace, waitMs);
						}
						else {
							this.tryStart();
						}
					}
				},


				startWait: function (namespace, waitMs) {
					this.waitNamespace = namespace;
					this.spawnWait(waitMs);
				},


				delayWait: function (waitMs) {
					clearTimeout(this.waitId);
					this.spawnWait(waitMs);
				},


				spawnWait: function (waitMs) {
					var _this = this;

					this.waitId = setTimeout(function () {
						_this.waitNamespace = null;
						_this.tryStart();
					}, waitMs);
				},


				clearWait: function () {
					if (this.waitNamespace) {
						clearTimeout(this.waitId);
						this.waitId = null;
						this.waitNamespace = null;
					}
				},


				canRunNext: function () {
					if (!TaskQueue.prototype.canRunNext.apply(this, arguments)) {
						return false;
					}

					// waiting for a certain namespace to stop receiving tasks?
					if (this.waitNamespace) {

						// if there was a different namespace task in the meantime,
						// that forces all previously-waiting tasks to suddenly execute.
						// TODO: find a way to do this in constant time.
						for (var q = this.q, i = 0; i < q.length; i++) {
							if (q[i].namespace !== this.waitNamespace) {
								return true; // allow execution
							}
						}

						return false;
					}

					return true;
				},


				runTask: function (task) {
					task.func();
				},


				compoundTask: function (newTask) {
					var q = this.q;
					var shouldAppend = true;
					var i, task;

					if (newTask.namespace && newTask.type === 'destroy') {

						// remove all init/add/remove ops with same namespace, regardless of order
						for (i = q.length - 1; i >= 0; i--) {
							task = q[i];

							switch (task.type) {
								case 'init':
									shouldAppend = false; // jshint ignore:line
								// the latest destroy is cancelled out by not doing the init
								// and fallthrough....
								case 'add':
								case 'remove':
									q.splice(i, 1); // remove task
							}
						}
					}

					if (shouldAppend) {
						q.push(newTask);
					}

					return shouldAppend;
				}

			});

			FC.RenderQueue = RenderQueue;

			;
			;

			/* A rectangular panel that is absolutely positioned over other content
------------------------------------------------------------------------------------------------------------------------
Options:
	- className (string)
	- content (HTML string or jQuery element set)
	- parentEl
	- top
	- left
	- right (the x coord of where the right edge should be. not a "CSS" right)
	- autoHide (boolean)
	- show (callback)
	- hide (callback)
*/

			var Popover = Class.extend(ListenerMixin, {

				isHidden: true,
				options: null,
				el: null, // the container element for the popover. generated by this object
				margin: 10, // the space required between the popover and the edges of the scroll container


				constructor: function (options) {
					this.options = options || {};
				},


				// Shows the popover on the specified position. Renders it if not already
				show: function () {
					if (this.isHidden) {
						if (!this.el) {
							this.render();
						}
						this.el.show();
						this.position();
						this.isHidden = false;
						this.trigger('show');
					}
				},


				// Hides the popover, through CSS, but does not remove it from the DOM
				hide: function () {
					if (!this.isHidden) {
						this.el.hide();
						this.isHidden = true;
						this.trigger('hide');
					}
				},


				// Creates `this.el` and renders content inside of it
				render: function () {
					var _this = this;
					var options = this.options;

					this.el = $('<div class="fc-popover"/>')
						.addClass(options.className || '')
						.css({
							// position initially to the top left to avoid creating scrollbars
							top: 0,
							left: 0
						})
						.append(options.content)
						.appendTo(options.parentEl);

					// when a click happens on anything inside with a 'fc-close' className, hide the popover
					this.el.on('click', '.fc-close', function () {
						_this.hide();
					});

					if (options.autoHide) {
						this.listenTo($(document), 'mousedown', this.documentMousedown);
					}
				},


				// Triggered when the user clicks *anywhere* in the document, for the autoHide feature
				documentMousedown: function (ev) {
					// only hide the popover if the click happened outside the popover
					if (this.el && !$(ev.target).closest(this.el).length) {
						this.hide();
					}
				},


				// Hides and unregisters any handlers
				removeElement: function () {
					this.hide();

					if (this.el) {
						this.el.remove();
						this.el = null;
					}

					this.stopListeningTo($(document), 'mousedown');
				},


				// Positions the popover optimally, using the top/left/right options
				position: function () {
					var options = this.options;
					var origin = this.el.offsetParent().offset();
					var width = this.el.outerWidth();
					var height = this.el.outerHeight();
					var windowEl = $(window);
					var viewportEl = getScrollParent(this.el);
					var viewportTop;
					var viewportLeft;
					var viewportOffset;
					var top; // the "position" (not "offset") values for the popover
					var left; //

					// compute top and left
					top = options.top || 0;
					if (options.left !== undefined) {
						left = options.left;
					}
					else if (options.right !== undefined) {
						left = options.right - width; // derive the left value from the right value
					}
					else {
						left = 0;
					}

					if (viewportEl.is(window) || viewportEl.is(document)) { // normalize getScrollParent's result
						viewportEl = windowEl;
						viewportTop = 0; // the window is always at the top left
						viewportLeft = 0; // (and .offset() won't work if called here)
					}
					else {
						viewportOffset = viewportEl.offset();
						viewportTop = viewportOffset.top;
						viewportLeft = viewportOffset.left;
					}

					// if the window is scrolled, it causes the visible area to be further down
					viewportTop += windowEl.scrollTop();
					viewportLeft += windowEl.scrollLeft();

					// constrain to the view port. if constrained by two edges, give precedence to top/left
					if (options.viewportConstrain !== false) {
						top = Math.min(top, viewportTop + viewportEl.outerHeight() - height - this.margin);
						top = Math.max(top, viewportTop + this.margin);
						left = Math.min(left, viewportLeft + viewportEl.outerWidth() - width - this.margin);
						left = Math.max(left, viewportLeft + this.margin);
					}

					this.el.css({
						top: top - origin.top,
						left: left - origin.left
					});
				},


				// Triggers a callback. Calls a function in the option hash of the same name.
				// Arguments beyond the first `name` are forwarded on.
				// TODO: better code reuse for this. Repeat code
				trigger: function (name) {
					if (this.options[name]) {
						this.options[name].apply(this, Array.prototype.slice.call(arguments, 1));
					}
				}

			});

			;
			;

			/*
A cache for the left/right/top/bottom/width/height values for one or more elements.
Works with both offset (from topleft document) and position (from offsetParent).

options:
- els
- isHorizontal
- isVertical
*/
			var CoordCache = FC.CoordCache = Class.extend({

				els: null, // jQuery set (assumed to be siblings)
				forcedOffsetParentEl: null, // options can override the natural offsetParent
				origin: null, // {left,top} position of offsetParent of els
				boundingRect: null, // constrain cordinates to this rectangle. {left,right,top,bottom} or null
				isHorizontal: false, // whether to query for left/right/width
				isVertical: false, // whether to query for top/bottom/height

				// arrays of coordinates (offsets from topleft of document)
				lefts: null,
				rights: null,
				tops: null,
				bottoms: null,


				constructor: function (options) {
					this.els = $(options.els);
					this.isHorizontal = options.isHorizontal;
					this.isVertical = options.isVertical;
					this.forcedOffsetParentEl = options.offsetParent ? $(options.offsetParent) : null;
				},


				// Queries the els for coordinates and stores them.
				// Call this method before using and of the get* methods below.
				build: function () {
					var offsetParentEl = this.forcedOffsetParentEl;
					if (!offsetParentEl && this.els.length > 0) {
						offsetParentEl = this.els.eq(0).offsetParent();
					}

					this.origin = offsetParentEl ?
						offsetParentEl.offset() :
						null;

					this.boundingRect = this.queryBoundingRect();

					if (this.isHorizontal) {
						this.buildElHorizontals();
					}
					if (this.isVertical) {
						this.buildElVerticals();
					}
				},


				// Destroys all internal data about coordinates, freeing memory
				clear: function () {
					this.origin = null;
					this.boundingRect = null;
					this.lefts = null;
					this.rights = null;
					this.tops = null;
					this.bottoms = null;
				},


				// When called, if coord caches aren't built, builds them
				ensureBuilt: function () {
					if (!this.origin) {
						this.build();
					}
				},


				// Populates the left/right internal coordinate arrays
				buildElHorizontals: function () {
					var lefts = [];
					var rights = [];

					this.els.each(function (i, node) {
						var el = $(node);
						var left = el.offset().left;
						var width = el.outerWidth();

						lefts.push(left);
						rights.push(left + width);
					});

					this.lefts = lefts;
					this.rights = rights;
				},


				// Populates the top/bottom internal coordinate arrays
				buildElVerticals: function () {
					var tops = [];
					var bottoms = [];

					this.els.each(function (i, node) {
						var el = $(node);
						var top = el.offset().top;
						var height = el.outerHeight();

						tops.push(top);
						bottoms.push(top + height);
					});

					this.tops = tops;
					this.bottoms = bottoms;
				},


				// Given a left offset (from document left), returns the index of the el that it horizontally intersects.
				// If no intersection is made, returns undefined.
				getHorizontalIndex: function (leftOffset) {
					this.ensureBuilt();

					var lefts = this.lefts;
					var rights = this.rights;
					var len = lefts.length;
					var i;

					for (i = 0; i < len; i++) {
						if (leftOffset >= lefts[i] && leftOffset < rights[i]) {
							return i;
						}
					}
				},


				// Given a top offset (from document top), returns the index of the el that it vertically intersects.
				// If no intersection is made, returns undefined.
				getVerticalIndex: function (topOffset) {
					this.ensureBuilt();

					var tops = this.tops;
					var bottoms = this.bottoms;
					var len = tops.length;
					var i;

					for (i = 0; i < len; i++) {
						if (topOffset >= tops[i] && topOffset < bottoms[i]) {
							return i;
						}
					}
				},


				// Gets the left offset (from document left) of the element at the given index
				getLeftOffset: function (leftIndex) {
					this.ensureBuilt();
					return this.lefts[leftIndex];
				},


				// Gets the left position (from offsetParent left) of the element at the given index
				getLeftPosition: function (leftIndex) {
					this.ensureBuilt();
					return this.lefts[leftIndex] - this.origin.left;
				},


				// Gets the right offset (from document left) of the element at the given index.
				// This value is NOT relative to the document's right edge, like the CSS concept of "right" would be.
				getRightOffset: function (leftIndex) {
					this.ensureBuilt();
					return this.rights[leftIndex];
				},


				// Gets the right position (from offsetParent left) of the element at the given index.
				// This value is NOT relative to the offsetParent's right edge, like the CSS concept of "right" would be.
				getRightPosition: function (leftIndex) {
					this.ensureBuilt();
					return this.rights[leftIndex] - this.origin.left;
				},


				// Gets the width of the element at the given index
				getWidth: function (leftIndex) {
					this.ensureBuilt();
					return this.rights[leftIndex] - this.lefts[leftIndex];
				},


				// Gets the top offset (from document top) of the element at the given index
				getTopOffset: function (topIndex) {
					this.ensureBuilt();
					return this.tops[topIndex];
				},


				// Gets the top position (from offsetParent top) of the element at the given position
				getTopPosition: function (topIndex) {
					this.ensureBuilt();
					return this.tops[topIndex] - this.origin.top;
				},

				// Gets the bottom offset (from the document top) of the element at the given index.
				// This value is NOT relative to the offsetParent's bottom edge, like the CSS concept of "bottom" would be.
				getBottomOffset: function (topIndex) {
					this.ensureBuilt();
					return this.bottoms[topIndex];
				},


				// Gets the bottom position (from the offsetParent top) of the element at the given index.
				// This value is NOT relative to the offsetParent's bottom edge, like the CSS concept of "bottom" would be.
				getBottomPosition: function (topIndex) {
					this.ensureBuilt();
					return this.bottoms[topIndex] - this.origin.top;
				},


				// Gets the height of the element at the given index
				getHeight: function (topIndex) {
					this.ensureBuilt();
					return this.bottoms[topIndex] - this.tops[topIndex];
				},


				// Bounding Rect
				// TODO: decouple this from CoordCache

				// Compute and return what the elements' bounding rectangle is, from the user's perspective.
				// Right now, only returns a rectangle if constrained by an overflow:scroll element.
				// Returns null if there are no elements
				queryBoundingRect: function () {
					var scrollParentEl;

					if (this.els.length > 0) {
						scrollParentEl = getScrollParent(this.els.eq(0));

						if (!scrollParentEl.is(document)) {
							return getClientRect(scrollParentEl);
						}
					}

					return null;
				},

				isPointInBounds: function (leftOffset, topOffset) {
					return this.isLeftInBounds(leftOffset) && this.isTopInBounds(topOffset);
				},

				isLeftInBounds: function (leftOffset) {
					return !this.boundingRect || (leftOffset >= this.boundingRect.left && leftOffset < this.boundingRect.right);
				},

				isTopInBounds: function (topOffset) {
					return !this.boundingRect || (topOffset >= this.boundingRect.top && topOffset < this.boundingRect.bottom);
				}

			});

			;
			;

			/* Tracks a drag's mouse movement, firing various handlers
----------------------------------------------------------------------------------------------------------------------*/
// TODO: use Emitter

			var DragListener = FC.DragListener = Class.extend(ListenerMixin, {

				options: null,
				subjectEl: null,

				// coordinates of the initial mousedown
				originX: null,
				originY: null,

				// the wrapping element that scrolls, or MIGHT scroll if there's overflow.
				// TODO: do this for wrappers that have overflow:hidden as well.
				scrollEl: null,

				isInteracting: false,
				isDistanceSurpassed: false,
				isDelayEnded: false,
				isDragging: false,
				isTouch: false,
				isGeneric: false, // initiated by 'dragstart' (jqui)

				delay: null,
				delayTimeoutId: null,
				minDistance: null,

				shouldCancelTouchScroll: true,
				scrollAlwaysKills: false,


				constructor: function (options) {
					this.options = options || {};
				},


				// Interaction (high-level)
				// -----------------------------------------------------------------------------------------------------------------


				startInteraction: function (ev, extraOptions) {

					if (ev.type === 'mousedown') {
						if (GlobalEmitter.get().shouldIgnoreMouse()) {
							return;
						}
						else if (!isPrimaryMouseButton(ev)) {
							return;
						}
						else {
							ev.preventDefault(); // prevents native selection in most browsers
						}
					}

					if (!this.isInteracting) {

						// process options
						extraOptions = extraOptions || {};
						this.delay = firstDefined(extraOptions.delay, this.options.delay, 0);
						this.minDistance = firstDefined(extraOptions.distance, this.options.distance, 0);
						this.subjectEl = this.options.subjectEl;

						preventSelection($('body'));

						this.isInteracting = true;
						this.isTouch = getEvIsTouch(ev);
						this.isGeneric = ev.type === 'dragstart';
						this.isDelayEnded = false;
						this.isDistanceSurpassed = false;

						this.originX = getEvX(ev);
						this.originY = getEvY(ev);
						this.scrollEl = getScrollParent($(ev.target));

						this.bindHandlers();
						this.initAutoScroll();
						this.handleInteractionStart(ev);
						this.startDelay(ev);

						if (!this.minDistance) {
							this.handleDistanceSurpassed(ev);
						}
					}
				},


				handleInteractionStart: function (ev) {
					this.trigger('interactionStart', ev);
				},


				endInteraction: function (ev, isCancelled) {
					if (this.isInteracting) {
						this.endDrag(ev);

						if (this.delayTimeoutId) {
							clearTimeout(this.delayTimeoutId);
							this.delayTimeoutId = null;
						}

						this.destroyAutoScroll();
						this.unbindHandlers();

						this.isInteracting = false;
						this.handleInteractionEnd(ev, isCancelled);

						allowSelection($('body'));
					}
				},


				handleInteractionEnd: function (ev, isCancelled) {
					this.trigger('interactionEnd', ev, isCancelled || false);
				},


				// Binding To DOM
				// -----------------------------------------------------------------------------------------------------------------


				bindHandlers: function () {
					// some browsers (Safari in iOS 10) don't allow preventDefault on touch events that are bound after touchstart,
					// so listen to the GlobalEmitter singleton, which is always bound, instead of the document directly.
					var globalEmitter = GlobalEmitter.get();

					if (this.isGeneric) {
						this.listenTo($(document), { // might only work on iOS because of GlobalEmitter's bind :(
							drag: this.handleMove,
							dragstop: this.endInteraction
						});
					}
					else if (this.isTouch) {
						this.listenTo(globalEmitter, {
							touchmove: this.handleTouchMove,
							touchend: this.endInteraction,
							scroll: this.handleTouchScroll
						});
					}
					else {
						this.listenTo(globalEmitter, {
							mousemove: this.handleMouseMove,
							mouseup: this.endInteraction
						});
					}

					this.listenTo(globalEmitter, {
						selectstart: preventDefault, // don't allow selection while dragging
						contextmenu: preventDefault // long taps would open menu on Chrome dev tools
					});
				},


				unbindHandlers: function () {
					this.stopListeningTo(GlobalEmitter.get());
					this.stopListeningTo($(document)); // for isGeneric
				},


				// Drag (high-level)
				// -----------------------------------------------------------------------------------------------------------------


				// extraOptions ignored if drag already started
				startDrag: function (ev, extraOptions) {
					this.startInteraction(ev, extraOptions); // ensure interaction began

					if (!this.isDragging) {
						this.isDragging = true;
						this.handleDragStart(ev);
					}
				},


				handleDragStart: function (ev) {
					this.trigger('dragStart', ev);
				},


				handleMove: function (ev) {
					var dx = getEvX(ev) - this.originX;
					var dy = getEvY(ev) - this.originY;
					var minDistance = this.minDistance;
					var distanceSq; // current distance from the origin, squared

					if (!this.isDistanceSurpassed) {
						distanceSq = dx * dx + dy * dy;
						if (distanceSq >= minDistance * minDistance) { // use pythagorean theorem
							this.handleDistanceSurpassed(ev);
						}
					}

					if (this.isDragging) {
						this.handleDrag(dx, dy, ev);
					}
				},


				// Called while the mouse is being moved and when we know a legitimate drag is taking place
				handleDrag: function (dx, dy, ev) {
					this.trigger('drag', dx, dy, ev);
					this.updateAutoScroll(ev); // will possibly cause scrolling
				},


				endDrag: function (ev) {
					if (this.isDragging) {
						this.isDragging = false;
						this.handleDragEnd(ev);
					}
				},


				handleDragEnd: function (ev) {
					this.trigger('dragEnd', ev);
				},


				// Delay
				// -----------------------------------------------------------------------------------------------------------------


				startDelay: function (initialEv) {
					var _this = this;

					if (this.delay) {
						this.delayTimeoutId = setTimeout(function () {
							_this.handleDelayEnd(initialEv);
						}, this.delay);
					}
					else {
						this.handleDelayEnd(initialEv);
					}
				},


				handleDelayEnd: function (initialEv) {
					this.isDelayEnded = true;

					if (this.isDistanceSurpassed) {
						this.startDrag(initialEv);
					}
				},


				// Distance
				// -----------------------------------------------------------------------------------------------------------------


				handleDistanceSurpassed: function (ev) {
					this.isDistanceSurpassed = true;

					if (this.isDelayEnded) {
						this.startDrag(ev);
					}
				},


				// Mouse / Touch
				// -----------------------------------------------------------------------------------------------------------------


				handleTouchMove: function (ev) {

					// prevent inertia and touchmove-scrolling while dragging
					if (this.isDragging && this.shouldCancelTouchScroll) {
						ev.preventDefault();
					}

					this.handleMove(ev);
				},


				handleMouseMove: function (ev) {
					this.handleMove(ev);
				},


				// Scrolling (unrelated to auto-scroll)
				// -----------------------------------------------------------------------------------------------------------------


				handleTouchScroll: function (ev) {
					// if the drag is being initiated by touch, but a scroll happens before
					// the drag-initiating delay is over, cancel the drag
					if (!this.isDragging || this.scrollAlwaysKills) {
						this.endInteraction(ev, true); // isCancelled=true
					}
				},


				// Utils
				// -----------------------------------------------------------------------------------------------------------------


				// Triggers a callback. Calls a function in the option hash of the same name.
				// Arguments beyond the first `name` are forwarded on.
				trigger: function (name) {
					if (this.options[name]) {
						this.options[name].apply(this, Array.prototype.slice.call(arguments, 1));
					}
					// makes _methods callable by event name. TODO: kill this
					if (this['_' + name]) {
						this['_' + name].apply(this, Array.prototype.slice.call(arguments, 1));
					}
				}


			});

			;
			;
			/*
this.scrollEl is set in DragListener
*/
			DragListener.mixin({

				isAutoScroll: false,

				scrollBounds: null, // { top, bottom, left, right }
				scrollTopVel: null, // pixels per second
				scrollLeftVel: null, // pixels per second
				scrollIntervalId: null, // ID of setTimeout for scrolling animation loop

				// defaults
				scrollSensitivity: 30, // pixels from edge for scrolling to start
				scrollSpeed: 200, // pixels per second, at maximum speed
				scrollIntervalMs: 50, // millisecond wait between scroll increment


				initAutoScroll: function () {
					var scrollEl = this.scrollEl;

					this.isAutoScroll =
						this.options.scroll &&
						scrollEl &&
						!scrollEl.is(window) &&
						!scrollEl.is(document);

					if (this.isAutoScroll) {
						// debounce makes sure rapid calls don't happen
						this.listenTo(scrollEl, 'scroll', debounce(this.handleDebouncedScroll, 100));
					}
				},


				destroyAutoScroll: function () {
					this.endAutoScroll(); // kill any animation loop

					// remove the scroll handler if there is a scrollEl
					if (this.isAutoScroll) {
						this.stopListeningTo(this.scrollEl, 'scroll'); // will probably get removed by unbindHandlers too :(
					}
				},


				// Computes and stores the bounding rectangle of scrollEl
				computeScrollBounds: function () {
					if (this.isAutoScroll) {
						this.scrollBounds = getOuterRect(this.scrollEl);
						// TODO: use getClientRect in future. but prevents auto scrolling when on top of scrollbars
					}
				},


				// Called when the dragging is in progress and scrolling should be updated
				updateAutoScroll: function (ev) {
					var sensitivity = this.scrollSensitivity;
					var bounds = this.scrollBounds;
					var topCloseness, bottomCloseness;
					var leftCloseness, rightCloseness;
					var topVel = 0;
					var leftVel = 0;

					if (bounds) { // only scroll if scrollEl exists

						// compute closeness to edges. valid range is from 0.0 - 1.0
						topCloseness = (sensitivity - (getEvY(ev) - bounds.top)) / sensitivity;
						bottomCloseness = (sensitivity - (bounds.bottom - getEvY(ev))) / sensitivity;
						leftCloseness = (sensitivity - (getEvX(ev) - bounds.left)) / sensitivity;
						rightCloseness = (sensitivity - (bounds.right - getEvX(ev))) / sensitivity;

						// translate vertical closeness into velocity.
						// mouse must be completely in bounds for velocity to happen.
						if (topCloseness >= 0 && topCloseness <= 1) {
							topVel = topCloseness * this.scrollSpeed * -1; // negative. for scrolling up
						}
						else if (bottomCloseness >= 0 && bottomCloseness <= 1) {
							topVel = bottomCloseness * this.scrollSpeed;
						}

						// translate horizontal closeness into velocity
						if (leftCloseness >= 0 && leftCloseness <= 1) {
							leftVel = leftCloseness * this.scrollSpeed * -1; // negative. for scrolling left
						}
						else if (rightCloseness >= 0 && rightCloseness <= 1) {
							leftVel = rightCloseness * this.scrollSpeed;
						}
					}

					this.setScrollVel(topVel, leftVel);
				},


				// Sets the speed-of-scrolling for the scrollEl
				setScrollVel: function (topVel, leftVel) {

					this.scrollTopVel = topVel;
					this.scrollLeftVel = leftVel;

					this.constrainScrollVel(); // massages into realistic values

					// if there is non-zero velocity, and an animation loop hasn't already started, then START
					if ((this.scrollTopVel || this.scrollLeftVel) && !this.scrollIntervalId) {
						this.scrollIntervalId = setInterval(
							proxy(this, 'scrollIntervalFunc'), // scope to `this`
							this.scrollIntervalMs
						);
					}
				},


				// Forces scrollTopVel and scrollLeftVel to be zero if scrolling has already gone all the way
				constrainScrollVel: function () {
					var el = this.scrollEl;

					if (this.scrollTopVel < 0) { // scrolling up?
						if (el.scrollTop() <= 0) { // already scrolled all the way up?
							this.scrollTopVel = 0;
						}
					}
					else if (this.scrollTopVel > 0) { // scrolling down?
						if (el.scrollTop() + el[0].clientHeight >= el[0].scrollHeight) { // already scrolled all the way down?
							this.scrollTopVel = 0;
						}
					}

					if (this.scrollLeftVel < 0) { // scrolling left?
						if (el.scrollLeft() <= 0) { // already scrolled all the left?
							this.scrollLeftVel = 0;
						}
					}
					else if (this.scrollLeftVel > 0) { // scrolling right?
						if (el.scrollLeft() + el[0].clientWidth >= el[0].scrollWidth) { // already scrolled all the way right?
							this.scrollLeftVel = 0;
						}
					}
				},


				// This function gets called during every iteration of the scrolling animation loop
				scrollIntervalFunc: function () {
					var el = this.scrollEl;
					var frac = this.scrollIntervalMs / 1000; // considering animation frequency, what the vel should be mult'd by

					// change the value of scrollEl's scroll
					if (this.scrollTopVel) {
						el.scrollTop(el.scrollTop() + this.scrollTopVel * frac);
					}
					if (this.scrollLeftVel) {
						el.scrollLeft(el.scrollLeft() + this.scrollLeftVel * frac);
					}

					this.constrainScrollVel(); // since the scroll values changed, recompute the velocities

					// if scrolled all the way, which causes the vels to be zero, stop the animation loop
					if (!this.scrollTopVel && !this.scrollLeftVel) {
						this.endAutoScroll();
					}
				},


				// Kills any existing scrolling animation loop
				endAutoScroll: function () {
					if (this.scrollIntervalId) {
						clearInterval(this.scrollIntervalId);
						this.scrollIntervalId = null;

						this.handleScrollEnd();
					}
				},


				// Get called when the scrollEl is scrolled (NOTE: this is delayed via debounce)
				handleDebouncedScroll: function () {
					// recompute all coordinates, but *only* if this is *not* part of our scrolling animation
					if (!this.scrollIntervalId) {
						this.handleScrollEnd();
					}
				},


				// Called when scrolling has stopped, whether through auto scroll, or the user scrolling
				handleScrollEnd: function () {
				}

			});
			;
			;

			/* Tracks mouse movements over a component and raises events about which hit the mouse is over.
------------------------------------------------------------------------------------------------------------------------
options:
- subjectEl
- subjectCenter
*/

			var HitDragListener = DragListener.extend({

				component: null, // converts coordinates to hits
				// methods: hitsNeeded, hitsNotNeeded, queryHit

				origHit: null, // the hit the mouse was over when listening started
				hit: null, // the hit the mouse is over
				coordAdjust: null, // delta that will be added to the mouse coordinates when computing collisions


				constructor: function (component, options) {
					DragListener.call(this, options); // call the super-constructor

					this.component = component;
				},


				// Called when drag listening starts (but a real drag has not necessarily began).
				// ev might be undefined if dragging was started manually.
				handleInteractionStart: function (ev) {
					var subjectEl = this.subjectEl;
					var subjectRect;
					var origPoint;
					var point;

					this.component.hitsNeeded();
					this.computeScrollBounds(); // for autoscroll

					if (ev) {
						origPoint = {left: getEvX(ev), top: getEvY(ev)};
						point = origPoint;

						// constrain the point to bounds of the element being dragged
						if (subjectEl) {
							subjectRect = getOuterRect(subjectEl); // used for centering as well
							point = constrainPoint(point, subjectRect);
						}

						this.origHit = this.queryHit(point.left, point.top);

						// treat the center of the subject as the collision point?
						if (subjectEl && this.options.subjectCenter) {

							// only consider the area the subject overlaps the hit. best for large subjects.
							// TODO: skip this if hit didn't supply left/right/top/bottom
							if (this.origHit) {
								subjectRect = intersectRects(this.origHit, subjectRect) ||
									subjectRect; // in case there is no intersection
							}

							point = getRectCenter(subjectRect);
						}

						this.coordAdjust = diffPoints(point, origPoint); // point - origPoint
					}
					else {
						this.origHit = null;
						this.coordAdjust = null;
					}

					// call the super-method. do it after origHit has been computed
					DragListener.prototype.handleInteractionStart.apply(this, arguments);
				},


				// Called when the actual drag has started
				handleDragStart: function (ev) {
					var hit;

					DragListener.prototype.handleDragStart.apply(this, arguments); // call the super-method

					// might be different from this.origHit if the min-distance is large
					hit = this.queryHit(getEvX(ev), getEvY(ev));

					// report the initial hit the mouse is over
					// especially important if no min-distance and drag starts immediately
					if (hit) {
						this.handleHitOver(hit);
					}
				},


				// Called when the drag moves
				handleDrag: function (dx, dy, ev) {
					var hit;

					DragListener.prototype.handleDrag.apply(this, arguments); // call the super-method

					hit = this.queryHit(getEvX(ev), getEvY(ev));

					if (!isHitsEqual(hit, this.hit)) { // a different hit than before?
						if (this.hit) {
							this.handleHitOut();
						}
						if (hit) {
							this.handleHitOver(hit);
						}
					}
				},


				// Called when dragging has been stopped
				handleDragEnd: function () {
					this.handleHitDone();
					DragListener.prototype.handleDragEnd.apply(this, arguments); // call the super-method
				},


				// Called when a the mouse has just moved over a new hit
				handleHitOver: function (hit) {
					var isOrig = isHitsEqual(hit, this.origHit);

					this.hit = hit;

					this.trigger('hitOver', this.hit, isOrig, this.origHit);
				},


				// Called when the mouse has just moved out of a hit
				handleHitOut: function () {
					if (this.hit) {
						this.trigger('hitOut', this.hit);
						this.handleHitDone();
						this.hit = null;
					}
				},


				// Called after a hitOut. Also called before a dragStop
				handleHitDone: function () {
					if (this.hit) {
						this.trigger('hitDone', this.hit);
					}
				},


				// Called when the interaction ends, whether there was a real drag or not
				handleInteractionEnd: function () {
					DragListener.prototype.handleInteractionEnd.apply(this, arguments); // call the super-method

					this.origHit = null;
					this.hit = null;

					this.component.hitsNotNeeded();
				},


				// Called when scrolling has stopped, whether through auto scroll, or the user scrolling
				handleScrollEnd: function () {
					DragListener.prototype.handleScrollEnd.apply(this, arguments); // call the super-method

					// hits' absolute positions will be in new places after a user's scroll.
					// HACK for recomputing.
					if (this.isDragging) {
						this.component.releaseHits();
						this.component.prepareHits();
					}
				},


				// Gets the hit underneath the coordinates for the given mouse event
				queryHit: function (left, top) {

					if (this.coordAdjust) {
						left += this.coordAdjust.left;
						top += this.coordAdjust.top;
					}

					return this.component.queryHit(left, top);
				}

			});


// Returns `true` if the hits are identically equal. `false` otherwise. Must be from the same component.
// Two null values will be considered equal, as two "out of the component" states are the same.
			function isHitsEqual(hit0, hit1) {

				if (!hit0 && !hit1) {
					return true;
				}

				if (hit0 && hit1) {
					return hit0.component === hit1.component &&
						isHitPropsWithin(hit0, hit1) &&
						isHitPropsWithin(hit1, hit0); // ensures all props are identical
				}

				return false;
			}


// Returns true if all of subHit's non-standard properties are within superHit
			function isHitPropsWithin(subHit, superHit) {
				for (var propName in subHit) {
					if (!/^(component|left|right|top|bottom)$/.test(propName)) {
						if (subHit[propName] !== superHit[propName]) {
							return false;
						}
					}
				}
				return true;
			}

			;
			;

			/*
Listens to document and window-level user-interaction events, like touch events and mouse events,
and fires these events as-is to whoever is observing a GlobalEmitter.
Best when used as a singleton via GlobalEmitter.get()

Normalizes mouse/touch events. For examples:
- ignores the the simulated mouse events that happen after a quick tap: mousemove+mousedown+mouseup+click
- compensates for various buggy scenarios where a touchend does not fire
*/

			FC.touchMouseIgnoreWait = 500;

			var GlobalEmitter = Class.extend(ListenerMixin, EmitterMixin, {

				isTouching: false,
				mouseIgnoreDepth: 0,
				handleScrollProxy: null,


				bind: function () {
					var _this = this;

					this.listenTo($(document), {
						touchstart: this.handleTouchStart,
						touchcancel: this.handleTouchCancel,
						touchend: this.handleTouchEnd,
						mousedown: this.handleMouseDown,
						mousemove: this.handleMouseMove,
						mouseup: this.handleMouseUp,
						click: this.handleClick,
						selectstart: this.handleSelectStart,
						contextmenu: this.handleContextMenu
					});

					// because we need to call preventDefault
					// because https://www.chromestatus.com/features/5093566007214080
					// TODO: investigate performance because this is a global handler
					window.addEventListener(
						'touchmove',
						this.handleTouchMoveProxy = function (ev) {
							_this.handleTouchMove($.Event(ev));
						},
						{passive: false} // allows preventDefault()
					);

					// attach a handler to get called when ANY scroll action happens on the page.
					// this was impossible to do with normal on/off because 'scroll' doesn't bubble.
					// http://stackoverflow.com/a/32954565/96342
					window.addEventListener(
						'scroll',
						this.handleScrollProxy = function (ev) {
							_this.handleScroll($.Event(ev));
						},
						true // useCapture
					);
				},

				unbind: function () {
					this.stopListeningTo($(document));

					window.removeEventListener(
						'touchmove',
						this.handleTouchMoveProxy
					);

					window.removeEventListener(
						'scroll',
						this.handleScrollProxy,
						true // useCapture
					);
				},


				// Touch Handlers
				// -----------------------------------------------------------------------------------------------------------------

				handleTouchStart: function (ev) {

					// if a previous touch interaction never ended with a touchend, then implicitly end it,
					// but since a new touch interaction is about to begin, don't start the mouse ignore period.
					this.stopTouch(ev, true); // skipMouseIgnore=true

					this.isTouching = true;
					this.trigger('touchstart', ev);
				},

				handleTouchMove: function (ev) {
					if (this.isTouching) {
						this.trigger('touchmove', ev);
					}
				},

				handleTouchCancel: function (ev) {
					if (this.isTouching) {
						this.trigger('touchcancel', ev);

						// Have touchcancel fire an artificial touchend. That way, handlers won't need to listen to both.
						// If touchend fires later, it won't have any effect b/c isTouching will be false.
						this.stopTouch(ev);
					}
				},

				handleTouchEnd: function (ev) {
					this.stopTouch(ev);
				},


				// Mouse Handlers
				// -----------------------------------------------------------------------------------------------------------------

				handleMouseDown: function (ev) {
					if (!this.shouldIgnoreMouse()) {
						this.trigger('mousedown', ev);
					}
				},

				handleMouseMove: function (ev) {
					if (!this.shouldIgnoreMouse()) {
						this.trigger('mousemove', ev);
					}
				},

				handleMouseUp: function (ev) {
					if (!this.shouldIgnoreMouse()) {
						this.trigger('mouseup', ev);
					}
				},

				handleClick: function (ev) {
					if (!this.shouldIgnoreMouse()) {
						this.trigger('click', ev);
					}
				},


				// Misc Handlers
				// -----------------------------------------------------------------------------------------------------------------

				handleSelectStart: function (ev) {
					this.trigger('selectstart', ev);
				},

				handleContextMenu: function (ev) {
					this.trigger('contextmenu', ev);
				},

				handleScroll: function (ev) {
					this.trigger('scroll', ev);
				},


				// Utils
				// -----------------------------------------------------------------------------------------------------------------

				stopTouch: function (ev, skipMouseIgnore) {
					if (this.isTouching) {
						this.isTouching = false;
						this.trigger('touchend', ev);

						if (!skipMouseIgnore) {
							this.startTouchMouseIgnore();
						}
					}
				},

				startTouchMouseIgnore: function () {
					var _this = this;
					var wait = FC.touchMouseIgnoreWait;

					if (wait) {
						this.mouseIgnoreDepth++;
						setTimeout(function () {
							_this.mouseIgnoreDepth--;
						}, wait);
					}
				},

				shouldIgnoreMouse: function () {
					return this.isTouching || Boolean(this.mouseIgnoreDepth);
				}

			});


// Singleton
// ---------------------------------------------------------------------------------------------------------------------

			(function () {
				var globalEmitter = null;
				var neededCount = 0;


				// gets the singleton
				GlobalEmitter.get = function () {

					if (!globalEmitter) {
						globalEmitter = new GlobalEmitter();
						globalEmitter.bind();
					}

					return globalEmitter;
				};


				// called when an object knows it will need a GlobalEmitter in the near future.
				GlobalEmitter.needed = function () {
					GlobalEmitter.get(); // ensures globalEmitter
					neededCount++;
				};


				// called when the object that originally called needed() doesn't need a GlobalEmitter anymore.
				GlobalEmitter.unneeded = function () {
					neededCount--;

					if (!neededCount) { // nobody else needs it
						globalEmitter.unbind();
						globalEmitter = null;
					}
				};

			})();

			;
			;

			/* Creates a clone of an element and lets it track the mouse as it moves
----------------------------------------------------------------------------------------------------------------------*/

			var MouseFollower = Class.extend(ListenerMixin, {

				options: null,

				sourceEl: null, // the element that will be cloned and made to look like it is dragging
				el: null, // the clone of `sourceEl` that will track the mouse
				parentEl: null, // the element that `el` (the clone) will be attached to

				// the initial position of el, relative to the offset parent. made to match the initial offset of sourceEl
				top0: null,
				left0: null,

				// the absolute coordinates of the initiating touch/mouse action
				y0: null,
				x0: null,

				// the number of pixels the mouse has moved from its initial position
				topDelta: null,
				leftDelta: null,

				isFollowing: false,
				isHidden: false,
				isAnimating: false, // doing the revert animation?

				constructor: function (sourceEl, options) {
					this.options = options = options || {};
					this.sourceEl = sourceEl;
					this.parentEl = options.parentEl ? $(options.parentEl) : sourceEl.parent(); // default to sourceEl's parent
				},


				// Causes the element to start following the mouse
				start: function (ev) {
					if (!this.isFollowing) {
						this.isFollowing = true;

						this.y0 = getEvY(ev);
						this.x0 = getEvX(ev);
						this.topDelta = 0;
						this.leftDelta = 0;

						if (!this.isHidden) {
							this.updatePosition();
						}

						if (getEvIsTouch(ev)) {
							this.listenTo($(document), 'touchmove', this.handleMove);
						}
						else {
							this.listenTo($(document), 'mousemove', this.handleMove);
						}
					}
				},


				// Causes the element to stop following the mouse. If shouldRevert is true, will animate back to original position.
				// `callback` gets invoked when the animation is complete. If no animation, it is invoked immediately.
				stop: function (shouldRevert, callback) {
					var _this = this;
					var revertDuration = this.options.revertDuration;

					function complete() { // might be called by .animate(), which might change `this` context
						_this.isAnimating = false;
						_this.removeElement();

						_this.top0 = _this.left0 = null; // reset state for future updatePosition calls

						if (callback) {
							callback();
						}
					}

					if (this.isFollowing && !this.isAnimating) { // disallow more than one stop animation at a time
						this.isFollowing = false;

						this.stopListeningTo($(document));

						if (shouldRevert && revertDuration && !this.isHidden) { // do a revert animation?
							this.isAnimating = true;
							this.el.animate({
								top: this.top0,
								left: this.left0
							}, {
								duration: revertDuration,
								complete: complete
							});
						}
						else {
							complete();
						}
					}
				},


				// Gets the tracking element. Create it if necessary
				getEl: function () {
					var el = this.el;

					if (!el) {
						el = this.el = this.sourceEl.clone()
							.addClass(this.options.additionalClass || '')
							.css({
								position: 'absolute',
								visibility: '', // in case original element was hidden (commonly through hideEvents())
								display: this.isHidden ? 'none' : '', // for when initially hidden
								margin: 0,
								right: 'auto', // erase and set width instead
								bottom: 'auto', // erase and set height instead
								width: this.sourceEl.width(), // explicit height in case there was a 'right' value
								height: this.sourceEl.height(), // explicit width in case there was a 'bottom' value
								opacity: this.options.opacity || '',
								zIndex: this.options.zIndex
							});

						// we don't want long taps or any mouse interaction causing selection/menus.
						// would use preventSelection(), but that prevents selectstart, causing problems.
						el.addClass('fc-unselectable');

						el.appendTo(this.parentEl);
					}

					return el;
				},


				// Removes the tracking element if it has already been created
				removeElement: function () {
					if (this.el) {
						this.el.remove();
						this.el = null;
					}
				},


				// Update the CSS position of the tracking element
				updatePosition: function () {
					var sourceOffset;
					var origin;

					this.getEl(); // ensure this.el

					// make sure origin info was computed
					if (this.top0 === null) {
						sourceOffset = this.sourceEl.offset();
						origin = this.el.offsetParent().offset();
						this.top0 = sourceOffset.top - origin.top;
						this.left0 = sourceOffset.left - origin.left;
					}

					this.el.css({
						top: this.top0 + this.topDelta,
						left: this.left0 + this.leftDelta
					});
				},


				// Gets called when the user moves the mouse
				handleMove: function (ev) {
					this.topDelta = getEvY(ev) - this.y0;
					this.leftDelta = getEvX(ev) - this.x0;

					if (!this.isHidden) {
						this.updatePosition();
					}
				},


				// Temporarily makes the tracking element invisible. Can be called before following starts
				hide: function () {
					if (!this.isHidden) {
						this.isHidden = true;
						if (this.el) {
							this.el.hide();
						}
					}
				},


				// Show the tracking element after it has been temporarily hidden
				show: function () {
					if (this.isHidden) {
						this.isHidden = false;
						this.updatePosition();
						this.getEl().show();
					}
				}

			});

			;
			;

			/*
Embodies a div that has potential scrollbars
*/
			var Scroller = FC.Scroller = Class.extend({

				el: null, // the guaranteed outer element
				scrollEl: null, // the element with the scrollbars
				overflowX: null,
				overflowY: null,


				constructor: function (options) {
					options = options || {};
					this.overflowX = options.overflowX || options.overflow || 'auto';
					this.overflowY = options.overflowY || options.overflow || 'auto';
				},


				render: function () {
					this.el = this.renderEl();
					this.applyOverflow();
				},


				renderEl: function () {
					return (this.scrollEl = $('<div class="fc-scroller"></div>'));
				},


				// sets to natural height, unlocks overflow
				clear: function () {
					this.setHeight('auto');
					this.applyOverflow();
				},


				destroy: function () {
					this.el.remove();
				},


				// Overflow
				// -----------------------------------------------------------------------------------------------------------------


				applyOverflow: function () {
					this.scrollEl.css({
						'overflow-x': this.overflowX,
						'overflow-y': this.overflowY
					});
				},


				// Causes any 'auto' overflow values to resolves to 'scroll' or 'hidden'.
				// Useful for preserving scrollbar widths regardless of future resizes.
				// Can pass in scrollbarWidths for optimization.
				lockOverflow: function (scrollbarWidths) {
					var overflowX = this.overflowX;
					var overflowY = this.overflowY;

					scrollbarWidths = scrollbarWidths || this.getScrollbarWidths();

					if (overflowX === 'auto') {
						overflowX = (
							scrollbarWidths.top || scrollbarWidths.bottom || // horizontal scrollbars?
							// OR scrolling pane with massless scrollbars?
							this.scrollEl[0].scrollWidth - 1 > this.scrollEl[0].clientWidth
							// subtract 1 because of IE off-by-one issue
						) ? 'scroll' : 'hidden';
					}

					if (overflowY === 'auto') {
						overflowY = (
							scrollbarWidths.left || scrollbarWidths.right || // vertical scrollbars?
							// OR scrolling pane with massless scrollbars?
							this.scrollEl[0].scrollHeight - 1 > this.scrollEl[0].clientHeight
							// subtract 1 because of IE off-by-one issue
						) ? 'scroll' : 'hidden';
					}

					this.scrollEl.css({'overflow-x': overflowX, 'overflow-y': overflowY});
				},


				// Getters / Setters
				// -----------------------------------------------------------------------------------------------------------------


				setHeight: function (height) {
					this.scrollEl.height(height);
				},


				getScrollTop: function () {
					return this.scrollEl.scrollTop();
				},


				setScrollTop: function (top) {
					this.scrollEl.scrollTop(top);
				},


				getClientWidth: function () {
					return this.scrollEl[0].clientWidth;
				},


				getClientHeight: function () {
					return this.scrollEl[0].clientHeight;
				},


				getScrollbarWidths: function () {
					return getScrollbarWidths(this.scrollEl);
				}

			});

			;
			;

			function Iterator(items) {
				this.items = items || [];
			}


			/* Calls a method on every item passing the arguments through */
			Iterator.prototype.proxyCall = function (methodName) {
				var args = Array.prototype.slice.call(arguments, 1);
				var results = [];

				this.items.forEach(function (item) {
					results.push(item[methodName].apply(item, args));
				});

				return results;
			};

			;
			;

			var Interaction = Class.extend({

				view: null,
				component: null,


				constructor: function (component) {
					this.view = component._getView();
					this.component = component;
				},


				opt: function (name) {
					return this.view.opt(name);
				},


				end: function () {
					// subclasses can implement
				}

			});

			;
			;

			var DateClicking = Interaction.extend({

				dragListener: null,


				/*
	component must implement:
		- bindDateHandlerToEl
		- getSafeHitFootprint
		- getHitEl
	*/
				constructor: function (component) {
					Interaction.call(this, component);

					this.dragListener = this.buildDragListener();
				},


				end: function () {
					this.dragListener.endInteraction();
				},


				bindToEl: function (el) {
					var component = this.component;
					var dragListener = this.dragListener;

					component.bindDateHandlerToEl(el, 'mousedown', function (ev) {
						if (!component.shouldIgnoreMouse()) {
							dragListener.startInteraction(ev);
						}
					});

					component.bindDateHandlerToEl(el, 'touchstart', function (ev) {
						if (!component.shouldIgnoreTouch()) {
							dragListener.startInteraction(ev);
						}
					});
				},


				// Creates a listener that tracks the user's drag across day elements, for day clicking.
				buildDragListener: function () {
					var _this = this;
					var component = this.component;
					var dayClickHit; // null if invalid dayClick

					var dragListener = new HitDragListener(component, {
						scroll: this.opt('dragScroll'),
						interactionStart: function () {
							dayClickHit = dragListener.origHit;
						},
						hitOver: function (hit, isOrig, origHit) {
							// if user dragged to another cell at any point, it can no longer be a dayClick
							if (!isOrig) {
								dayClickHit = null;
							}
						},
						hitOut: function () { // called before mouse moves to a different hit OR moved out of all hits
							dayClickHit = null;
						},
						interactionEnd: function (ev, isCancelled) {
							var componentFootprint;

							if (!isCancelled && dayClickHit) {
								componentFootprint = component.getSafeHitFootprint(dayClickHit);

								if (componentFootprint) {
									_this.view.triggerDayClick(componentFootprint, component.getHitEl(dayClickHit), ev);
								}
							}
						}
					});

					// because dragListener won't be called with any time delay, "dragging" will begin immediately,
					// which will kill any touchmoving/scrolling. Prevent this.
					dragListener.shouldCancelTouchScroll = false;

					dragListener.scrollAlwaysKills = true;

					return dragListener;
				}

			});

			;
			;

			var DateSelecting = FC.DateSelecting = Interaction.extend({

				dragListener: null,


				/*
	component must implement:
		- bindDateHandlerToEl
		- getSafeHitFootprint
		- renderHighlight
		- unrenderHighlight
	*/
				constructor: function (component) {
					Interaction.call(this, component);

					this.dragListener = this.buildDragListener();
				},


				end: function () {
					this.dragListener.endInteraction();
				},


				getDelay: function () {
					var delay = this.opt('selectLongPressDelay');

					if (delay == null) {
						delay = this.opt('longPressDelay'); // fallback
					}

					return delay;
				},


				bindToEl: function (el) {
					var _this = this;
					var component = this.component;
					var dragListener = this.dragListener;

					component.bindDateHandlerToEl(el, 'mousedown', function (ev) {
						if (_this.opt('selectable') && !component.shouldIgnoreMouse()) {
							dragListener.startInteraction(ev, {
								distance: _this.opt('selectMinDistance')
							});
						}
					});

					component.bindDateHandlerToEl(el, 'touchstart', function (ev) {
						if (_this.opt('selectable') && !component.shouldIgnoreTouch()) {
							dragListener.startInteraction(ev, {
								delay: _this.getDelay()
							});
						}
					});

					preventSelection(el);
				},


				// Creates a listener that tracks the user's drag across day elements, for day selecting.
				buildDragListener: function () {
					var _this = this;
					var component = this.component;
					var selectionFootprint; // null if invalid selection

					var dragListener = new HitDragListener(component, {
						scroll: this.opt('dragScroll'),
						interactionStart: function () {
							selectionFootprint = null;
						},
						dragStart: function (ev) {
							_this.view.unselect(ev); // since we could be rendering a new selection, we want to clear any old one
						},
						hitOver: function (hit, isOrig, origHit) {
							var origHitFootprint;
							var hitFootprint;

							if (origHit) { // click needs to have started on a hit

								origHitFootprint = component.getSafeHitFootprint(origHit);
								hitFootprint = component.getSafeHitFootprint(hit);

								if (origHitFootprint && hitFootprint) {
									selectionFootprint = _this.computeSelection(origHitFootprint, hitFootprint);
								}
								else {
									selectionFootprint = null;
								}

								if (selectionFootprint) {
									component.renderSelectionFootprint(selectionFootprint);
								}
								else if (selectionFootprint === false) {
									disableCursor();
								}
							}
						},
						hitOut: function () { // called before mouse moves to a different hit OR moved out of all hits
							selectionFootprint = null;
							component.unrenderSelection();
						},
						hitDone: function () { // called after a hitOut OR before a dragEnd
							enableCursor();
						},
						interactionEnd: function (ev, isCancelled) {
							if (!isCancelled && selectionFootprint) {
								// the selection will already have been rendered. just report it
								_this.view.reportSelection(selectionFootprint, ev);
							}
						}
					});

					return dragListener;
				},


				// Given the first and last date-spans of a selection, returns another date-span object.
				// Subclasses can override and provide additional data in the span object. Will be passed to renderSelectionFootprint().
				// Will return false if the selection is invalid and this should be indicated to the user.
				// Will return null/undefined if a selection invalid but no error should be reported.
				computeSelection: function (footprint0, footprint1) {
					var wholeFootprint = this.computeSelectionFootprint(footprint0, footprint1);

					if (wholeFootprint && !this.isSelectionFootprintAllowed(wholeFootprint)) {
						return false;
					}

					return wholeFootprint;
				},


				// Given two spans, must return the combination of the two.
				// TODO: do this separation of concerns (combining VS validation) for event dnd/resize too.
				// Assumes both footprints are non-open-ended.
				computeSelectionFootprint: function (footprint0, footprint1) {
					var ms = [
						footprint0.unzonedRange.startMs,
						footprint0.unzonedRange.endMs,
						footprint1.unzonedRange.startMs,
						footprint1.unzonedRange.endMs
					];

					ms.sort(compareNumbers);

					return new ComponentFootprint(
						new UnzonedRange(ms[0], ms[3]),
						footprint0.isAllDay
					);
				},


				isSelectionFootprintAllowed: function (componentFootprint) {
					return this.component.dateProfile.validUnzonedRange.containsRange(componentFootprint.unzonedRange) &&
						this.view.calendar.isSelectionFootprintAllowed(componentFootprint);
				}

			});

			;
			;

			var EventDragging = FC.EventDragging = Interaction.extend({

				eventPointing: null,
				dragListener: null,
				isDragging: false,


				/*
	component implements:
		- bindSegHandlerToEl
		- publiclyTrigger
		- diffDates
		- eventRangesToEventFootprints
		- isEventInstanceGroupAllowed
	*/
				constructor: function (component, eventPointing) {
					Interaction.call(this, component);

					this.eventPointing = eventPointing;
				},


				end: function () {
					if (this.dragListener) {
						this.dragListener.endInteraction();
					}
				},


				getSelectionDelay: function () {
					var delay = this.opt('eventLongPressDelay');

					if (delay == null) {
						delay = this.opt('longPressDelay'); // fallback
					}

					return delay;
				},


				bindToEl: function (el) {
					var component = this.component;

					component.bindSegHandlerToEl(el, 'mousedown', this.handleMousedown.bind(this));
					component.bindSegHandlerToEl(el, 'touchstart', this.handleTouchStart.bind(this));
				},


				handleMousedown: function (seg, ev) {
					if (this.component.canStartDrag(seg, ev)) {
						this.buildDragListener(seg).startInteraction(ev, {distance: 5});
					}
				},


				handleTouchStart: function (seg, ev) {
					var component = this.component;
					var settings = {
						delay: this.view.isEventDefSelected(seg.footprint.eventDef) ? // already selected?
							0 : this.getSelectionDelay()
					};

					if (component.canStartDrag(seg, ev)) {
						this.buildDragListener(seg).startInteraction(ev, settings);
					}
					else if (component.canStartSelection(seg, ev)) {
						this.buildSelectListener(seg).startInteraction(ev, settings);
					}
				},


				// seg isn't draggable, but let's use a generic DragListener
				// simply for the delay, so it can be selected.
				// Has side effect of setting/unsetting `dragListener`
				buildSelectListener: function (seg) {
					var _this = this;
					var view = this.view;
					var eventDef = seg.footprint.eventDef;
					var eventInstance = seg.footprint.eventInstance; // null for inverse-background events

					if (this.dragListener) {
						return this.dragListener;
					}

					var dragListener = this.dragListener = new DragListener({
						dragStart: function (ev) {
							if (
								dragListener.isTouch &&
								!view.isEventDefSelected(eventDef) &&
								eventInstance
							) {
								// if not previously selected, will fire after a delay. then, select the event
								view.selectEventInstance(eventInstance);
							}
						},
						interactionEnd: function (ev) {
							_this.dragListener = null;
						}
					});

					return dragListener;
				},


				// Builds a listener that will track user-dragging on an event segment.
				// Generic enough to work with any type of Grid.
				// Has side effect of setting/unsetting `dragListener`
				buildDragListener: function (seg) {
					var _this = this;
					var component = this.component;
					var view = this.view;
					var calendar = view.calendar;
					var eventManager = calendar.eventManager;
					var el = seg.el;
					var eventDef = seg.footprint.eventDef;
					var eventInstance = seg.footprint.eventInstance; // null for inverse-background events
					var isDragging;
					var mouseFollower; // A clone of the original element that will move with the mouse
					var eventDefMutation;

					if (this.dragListener) {
						return this.dragListener;
					}

					// Tracks mouse movement over the *view's* coordinate map. Allows dragging and dropping between subcomponents
					// of the view.
					var dragListener = this.dragListener = new HitDragListener(view, {
						scroll: this.opt('dragScroll'),
						subjectEl: el,
						subjectCenter: true,
						interactionStart: function (ev) {
							seg.component = component; // for renderDrag
							isDragging = false;
							mouseFollower = new MouseFollower(seg.el, {
								additionalClass: 'fc-dragging',
								parentEl: view.el,
								opacity: dragListener.isTouch ? null : _this.opt('dragOpacity'),
								revertDuration: _this.opt('dragRevertDuration'),
								zIndex: 2 // one above the .fc-view
							});
							mouseFollower.hide(); // don't show until we know this is a real drag
							mouseFollower.start(ev);
						},
						dragStart: function (ev) {
							if (
								dragListener.isTouch &&
								!view.isEventDefSelected(eventDef) &&
								eventInstance
							) {
								// if not previously selected, will fire after a delay. then, select the event
								view.selectEventInstance(eventInstance);
							}
							isDragging = true;

							// ensure a mouseout on the manipulated event has been reported
							_this.eventPointing.handleMouseout(seg, ev);

							_this.segDragStart(seg, ev);
							view.hideEventsWithId(seg.footprint.eventDef.id);
						},
						hitOver: function (hit, isOrig, origHit) {
							var isAllowed = true;
							var origFootprint;
							var footprint;
							var mutatedEventInstanceGroup;

							// starting hit could be forced (DayGrid.limit)
							if (seg.hit) {
								origHit = seg.hit;
							}

							// hit might not belong to this grid, so query origin grid
							origFootprint = origHit.component.getSafeHitFootprint(origHit);
							footprint = hit.component.getSafeHitFootprint(hit);

							if (origFootprint && footprint) {
								eventDefMutation = _this.computeEventDropMutation(origFootprint, footprint, eventDef);

								if (eventDefMutation) {
									mutatedEventInstanceGroup = eventManager.buildMutatedEventInstanceGroup(
										eventDef.id,
										eventDefMutation
									);
									isAllowed = component.isEventInstanceGroupAllowed(mutatedEventInstanceGroup);
								}
								else {
									isAllowed = false;
								}
							}
							else {
								isAllowed = false;
							}

							if (!isAllowed) {
								eventDefMutation = null;
								disableCursor();
							}

							// if a valid drop location, have the subclass render a visual indication
							if (
								eventDefMutation &&
								view.renderDrag( // truthy if rendered something
									component.eventRangesToEventFootprints(
										mutatedEventInstanceGroup.sliceRenderRanges(component.dateProfile.renderUnzonedRange, calendar)
									),
									seg,
									dragListener.isTouch
								)
							) {
								mouseFollower.hide(); // if the subclass is already using a mock event "helper", hide our own
							}
							else {
								mouseFollower.show(); // otherwise, have the helper follow the mouse (no snapping)
							}

							if (isOrig) {
								// needs to have moved hits to be a valid drop
								eventDefMutation = null;
							}
						},
						hitOut: function () { // called before mouse moves to a different hit OR moved out of all hits
							view.unrenderDrag(seg); // unrender whatever was done in renderDrag
							mouseFollower.show(); // show in case we are moving out of all hits
							eventDefMutation = null;
						},
						hitDone: function () { // Called after a hitOut OR before a dragEnd
							enableCursor();
						},
						interactionEnd: function (ev) {
							delete seg.component; // prevent side effects

							// do revert animation if hasn't changed. calls a callback when finished (whether animation or not)
							mouseFollower.stop(!eventDefMutation, function () {
								if (isDragging) {
									view.unrenderDrag(seg);
									_this.segDragStop(seg, ev);
								}

								view.showEventsWithId(seg.footprint.eventDef.id);

								if (eventDefMutation) {
									// no need to re-show original, will rerender all anyways. esp important if eventRenderWait
									view.reportEventDrop(eventInstance, eventDefMutation, el, ev);
								}
							});

							_this.dragListener = null;
						}
					});

					return dragListener;
				},


				// Called before event segment dragging starts
				segDragStart: function (seg, ev) {
					this.isDragging = true;
					this.component.publiclyTrigger('eventDragStart', {
						context: seg.el[0],
						args: [
							seg.footprint.getEventLegacy(),
							ev,
							{}, // jqui dummy
							this.view
						]
					});
				},


				// Called after event segment dragging stops
				segDragStop: function (seg, ev) {
					this.isDragging = false;
					this.component.publiclyTrigger('eventDragStop', {
						context: seg.el[0],
						args: [
							seg.footprint.getEventLegacy(),
							ev,
							{}, // jqui dummy
							this.view
						]
					});
				},


				// DOES NOT consider overlap/constraint
				computeEventDropMutation: function (startFootprint, endFootprint, eventDef) {
					var eventDefMutation = new EventDefMutation();

					eventDefMutation.setDateMutation(
						this.computeEventDateMutation(startFootprint, endFootprint)
					);

					return eventDefMutation;
				},


				computeEventDateMutation: function (startFootprint, endFootprint) {
					var date0 = startFootprint.unzonedRange.getStart();
					var date1 = endFootprint.unzonedRange.getStart();
					var clearEnd = false;
					var forceTimed = false;
					var forceAllDay = false;
					var dateDelta;
					var dateMutation;

					if (startFootprint.isAllDay !== endFootprint.isAllDay) {
						clearEnd = true;

						if (endFootprint.isAllDay) {
							forceAllDay = true;
							date0.stripTime();
						}
						else {
							forceTimed = true;
						}
					}

					dateDelta = this.component.diffDates(date1, date0);

					dateMutation = new EventDefDateMutation();
					dateMutation.clearEnd = clearEnd;
					dateMutation.forceTimed = forceTimed;
					dateMutation.forceAllDay = forceAllDay;
					dateMutation.setDateDelta(dateDelta);

					return dateMutation;
				}

			});

			;
			;

			var EventResizing = FC.EventResizing = Interaction.extend({

				eventPointing: null,
				dragListener: null,
				isResizing: false,


				/*
	component impements:
		- bindSegHandlerToEl
		- publiclyTrigger
		- diffDates
		- eventRangesToEventFootprints
		- isEventInstanceGroupAllowed
		- getSafeHitFootprint
	*/


				constructor: function (component, eventPointing) {
					Interaction.call(this, component);

					this.eventPointing = eventPointing;
				},


				end: function () {
					if (this.dragListener) {
						this.dragListener.endInteraction();
					}
				},


				bindToEl: function (el) {
					var component = this.component;

					component.bindSegHandlerToEl(el, 'mousedown', this.handleMouseDown.bind(this));
					component.bindSegHandlerToEl(el, 'touchstart', this.handleTouchStart.bind(this));
				},


				handleMouseDown: function (seg, ev) {
					if (this.component.canStartResize(seg, ev)) {
						this.buildDragListener(seg, $(ev.target).is('.fc-start-resizer'))
							.startInteraction(ev, {distance: 5});
					}
				},


				handleTouchStart: function (seg, ev) {
					if (this.component.canStartResize(seg, ev)) {
						this.buildDragListener(seg, $(ev.target).is('.fc-start-resizer'))
							.startInteraction(ev);
					}
				},


				// Creates a listener that tracks the user as they resize an event segment.
				// Generic enough to work with any type of Grid.
				buildDragListener: function (seg, isStart) {
					var _this = this;
					var component = this.component;
					var view = this.view;
					var calendar = view.calendar;
					var eventManager = calendar.eventManager;
					var el = seg.el;
					var eventDef = seg.footprint.eventDef;
					var eventInstance = seg.footprint.eventInstance;
					var isDragging;
					var resizeMutation; // zoned event date properties. falsy if invalid resize

					// Tracks mouse movement over the *grid's* coordinate map
					var dragListener = this.dragListener = new HitDragListener(component, {
						scroll: this.opt('dragScroll'),
						subjectEl: el,
						interactionStart: function () {
							isDragging = false;
						},
						dragStart: function (ev) {
							isDragging = true;

							// ensure a mouseout on the manipulated event has been reported
							_this.eventPointing.handleMouseout(seg, ev);

							_this.segResizeStart(seg, ev);
						},
						hitOver: function (hit, isOrig, origHit) {
							var isAllowed = true;
							var origHitFootprint = component.getSafeHitFootprint(origHit);
							var hitFootprint = component.getSafeHitFootprint(hit);
							var mutatedEventInstanceGroup;

							if (origHitFootprint && hitFootprint) {
								resizeMutation = isStart ?
									_this.computeEventStartResizeMutation(origHitFootprint, hitFootprint, seg.footprint) :
									_this.computeEventEndResizeMutation(origHitFootprint, hitFootprint, seg.footprint);

								if (resizeMutation) {
									mutatedEventInstanceGroup = eventManager.buildMutatedEventInstanceGroup(
										eventDef.id,
										resizeMutation
									);
									isAllowed = component.isEventInstanceGroupAllowed(mutatedEventInstanceGroup);
								}
								else {
									isAllowed = false;
								}
							}
							else {
								isAllowed = false;
							}

							if (!isAllowed) {
								resizeMutation = null;
								disableCursor();
							}
							else if (resizeMutation.isEmpty()) {
								// no change. (FYI, event dates might have zones)
								resizeMutation = null;
							}

							if (resizeMutation) {
								view.hideEventsWithId(seg.footprint.eventDef.id);
								view.renderEventResize(
									component.eventRangesToEventFootprints(
										mutatedEventInstanceGroup.sliceRenderRanges(component.dateProfile.renderUnzonedRange, calendar)
									),
									seg
								);
							}
						},
						hitOut: function () { // called before mouse moves to a different hit OR moved out of all hits
							resizeMutation = null;
						},
						hitDone: function () { // resets the rendering to show the original event
							view.unrenderEventResize(seg);
							view.showEventsWithId(seg.footprint.eventDef.id);
							enableCursor();
						},
						interactionEnd: function (ev) {
							if (isDragging) {
								_this.segResizeStop(seg, ev);
							}

							if (resizeMutation) { // valid date to resize to?
								// no need to re-show original, will rerender all anyways. esp important if eventRenderWait
								view.reportEventResize(eventInstance, resizeMutation, el, ev);
							}

							_this.dragListener = null;
						}
					});

					return dragListener;
				},


				// Called before event segment resizing starts
				segResizeStart: function (seg, ev) {
					this.isResizing = true;
					this.component.publiclyTrigger('eventResizeStart', {
						context: seg.el[0],
						args: [
							seg.footprint.getEventLegacy(),
							ev,
							{}, // jqui dummy
							this.view
						]
					});
				},


				// Called after event segment resizing stops
				segResizeStop: function (seg, ev) {
					this.isResizing = false;
					this.component.publiclyTrigger('eventResizeStop', {
						context: seg.el[0],
						args: [
							seg.footprint.getEventLegacy(),
							ev,
							{}, // jqui dummy
							this.view
						]
					});
				},


				// Returns new date-information for an event segment being resized from its start
				computeEventStartResizeMutation: function (startFootprint, endFootprint, origEventFootprint) {
					var origRange = origEventFootprint.componentFootprint.unzonedRange;
					var startDelta = this.component.diffDates(
						endFootprint.unzonedRange.getStart(),
						startFootprint.unzonedRange.getStart()
					);
					var dateMutation;
					var eventDefMutation;

					if (origRange.getStart().add(startDelta) < origRange.getEnd()) {

						dateMutation = new EventDefDateMutation();
						dateMutation.setStartDelta(startDelta);

						eventDefMutation = new EventDefMutation();
						eventDefMutation.setDateMutation(dateMutation);

						return eventDefMutation;
					}

					return false;
				},


				// Returns new date-information for an event segment being resized from its end
				computeEventEndResizeMutation: function (startFootprint, endFootprint, origEventFootprint) {
					var origRange = origEventFootprint.componentFootprint.unzonedRange;
					var endDelta = this.component.diffDates(
						endFootprint.unzonedRange.getEnd(),
						startFootprint.unzonedRange.getEnd()
					);
					var dateMutation;
					var eventDefMutation;

					if (origRange.getEnd().add(endDelta) > origRange.getStart()) {

						dateMutation = new EventDefDateMutation();
						dateMutation.setEndDelta(endDelta);

						eventDefMutation = new EventDefMutation();
						eventDefMutation.setDateMutation(dateMutation);

						return eventDefMutation;
					}

					return false;
				}

			});

			;
			;

			var ExternalDropping = FC.ExternalDropping = Interaction.extend(ListenerMixin, {

				dragListener: null,
				isDragging: false, // jqui-dragging an external element? boolean


				/*
	component impements:
		- eventRangesToEventFootprints
		- isEventInstanceGroupAllowed
		- isExternalInstanceGroupAllowed
		- renderDrag
		- unrenderDrag
	*/


				end: function () {
					if (this.dragListener) {
						this.dragListener.endInteraction();
					}
				},


				bindToDocument: function () {
					this.listenTo($(document), {
						dragstart: this.handleDragStart, // jqui
						sortstart: this.handleDragStart // jqui
					});
				},


				unbindFromDocument: function () {
					this.stopListeningTo($(document));
				},


				// Called when a jQuery UI drag is initiated anywhere in the DOM
				handleDragStart: function (ev, ui) {
					var el;
					var accept;

					if (this.opt('droppable')) { // only listen if this setting is on
						el = $((ui ? ui.item : null) || ev.target);

						// Test that the dragged element passes the dropAccept selector or filter function.
						// FYI, the default is "*" (matches all)
						accept = this.opt('dropAccept');
						if ($.isFunction(accept) ? accept.call(el[0], el) : el.is(accept)) {
							if (!this.isDragging) { // prevent double-listening if fired twice
								this.listenToExternalDrag(el, ev, ui);
							}
						}
					}
				},


				// Called when a jQuery UI drag starts and it needs to be monitored for dropping
				listenToExternalDrag: function (el, ev, ui) {
					var _this = this;
					var component = this.component;
					var view = this.view;
					var meta = getDraggedElMeta(el); // extra data about event drop, including possible event to create
					var singleEventDef; // a null value signals an unsuccessful drag

					// listener that tracks mouse movement over date-associated pixel regions
					var dragListener = _this.dragListener = new HitDragListener(component, {
						interactionStart: function () {
							_this.isDragging = true;
						},
						hitOver: function (hit) {
							var isAllowed = true;
							var hitFootprint = hit.component.getSafeHitFootprint(hit); // hit might not belong to this grid
							var mutatedEventInstanceGroup;

							if (hitFootprint) {
								singleEventDef = _this.computeExternalDrop(hitFootprint, meta);

								if (singleEventDef) {
									mutatedEventInstanceGroup = new EventInstanceGroup(
										singleEventDef.buildInstances()
									);
									isAllowed = meta.eventProps ? // isEvent?
										component.isEventInstanceGroupAllowed(mutatedEventInstanceGroup) :
										component.isExternalInstanceGroupAllowed(mutatedEventInstanceGroup);
								}
								else {
									isAllowed = false;
								}
							}
							else {
								isAllowed = false;
							}

							if (!isAllowed) {
								singleEventDef = null;
								disableCursor();
							}

							if (singleEventDef) {
								component.renderDrag( // called without a seg parameter
									component.eventRangesToEventFootprints(
										mutatedEventInstanceGroup.sliceRenderRanges(component.dateProfile.renderUnzonedRange, view.calendar)
									)
								);
							}
						},
						hitOut: function () {
							singleEventDef = null; // signal unsuccessful
						},
						hitDone: function () { // Called after a hitOut OR before a dragEnd
							enableCursor();
							component.unrenderDrag();
						},
						interactionEnd: function (ev) {

							if (singleEventDef) { // element was dropped on a valid hit
								view.reportExternalDrop(
									singleEventDef,
									Boolean(meta.eventProps), // isEvent
									Boolean(meta.stick), // isSticky
									el, ev, ui
								);
							}

							_this.isDragging = false;
							_this.dragListener = null;
						}
					});

					dragListener.startDrag(ev); // start listening immediately
				},


				// Given a hit to be dropped upon, and misc data associated with the jqui drag (guaranteed to be a plain object),
				// returns the zoned start/end dates for the event that would result from the hypothetical drop. end might be null.
				// Returning a null value signals an invalid drop hit.
				// DOES NOT consider overlap/constraint.
				// Assumes both footprints are non-open-ended.
				computeExternalDrop: function (componentFootprint, meta) {
					var calendar = this.view.calendar;
					var start = FC.moment.utc(componentFootprint.unzonedRange.startMs).stripZone();
					var end;
					var eventDef;

					if (componentFootprint.isAllDay) {
						// if dropped on an all-day span, and element's metadata specified a time, set it
						if (meta.startTime) {
							start.time(meta.startTime);
						}
						else {
							start.stripTime();
						}
					}

					if (meta.duration) {
						end = start.clone().add(meta.duration);
					}

					start = calendar.applyTimezone(start);

					if (end) {
						end = calendar.applyTimezone(end);
					}

					eventDef = SingleEventDef.parse(
						$.extend({}, meta.eventProps, {
							start: start,
							end: end
						}),
						new EventSource(calendar)
					);

					return eventDef;
				}

			});


			/* External-Dragging-Element Data
----------------------------------------------------------------------------------------------------------------------*/

// Require all HTML5 data-* attributes used by FullCalendar to have this prefix.
// A value of '' will query attributes like data-event. A value of 'fc' will query attributes like data-fc-event.
			FC.dataAttrPrefix = '';

// Given a jQuery element that might represent a dragged FullCalendar event, returns an intermediate data structure
// to be used for Event Object creation.
// A defined `.eventProps`, even when empty, indicates that an event should be created.
			function getDraggedElMeta(el) {
				var prefix = FC.dataAttrPrefix;
				var eventProps; // properties for creating the event, not related to date/time
				var startTime; // a Duration
				var duration;
				var stick;

				if (prefix) {
					prefix += '-';
				}
				eventProps = el.data(prefix + 'event') || null;

				if (eventProps) {
					if (typeof eventProps === 'object') {
						eventProps = $.extend({}, eventProps); // make a copy
					}
					else { // something like 1 or true. still signal event creation
						eventProps = {};
					}

					// pluck special-cased date/time properties
					startTime = eventProps.start;
					if (startTime == null) {
						startTime = eventProps.time;
					} // accept 'time' as well
					duration = eventProps.duration;
					stick = eventProps.stick;
					delete eventProps.start;
					delete eventProps.time;
					delete eventProps.duration;
					delete eventProps.stick;
				}

				// fallback to standalone attribute values for each of the date/time properties
				if (startTime == null) {
					startTime = el.data(prefix + 'start');
				}
				if (startTime == null) {
					startTime = el.data(prefix + 'time');
				} // accept 'time' as well
				if (duration == null) {
					duration = el.data(prefix + 'duration');
				}
				if (stick == null) {
					stick = el.data(prefix + 'stick');
				}

				// massage into correct data types
				startTime = startTime != null ? moment.duration(startTime) : null;
				duration = duration != null ? moment.duration(duration) : null;
				stick = Boolean(stick);

				return {eventProps: eventProps, startTime: startTime, duration: duration, stick: stick};
			}

			;
			;

			var EventPointing = FC.EventPointing = Interaction.extend({

				mousedOverSeg: null, // the segment object the user's mouse is over. null if over nothing


				/*
	component must implement:
		- publiclyTrigger
	*/


				bindToEl: function (el) {
					var component = this.component;

					component.bindSegHandlerToEl(el, 'click', this.handleClick.bind(this));
					component.bindSegHandlerToEl(el, 'mouseenter', this.handleMouseover.bind(this));
					component.bindSegHandlerToEl(el, 'mouseleave', this.handleMouseout.bind(this));
				},


				handleClick: function (seg, ev) {
					var res = this.component.publiclyTrigger('eventClick', { // can return `false` to cancel
						context: seg.el[0],
						args: [seg.footprint.getEventLegacy(), ev, this.view]
					});

					if (res === false) {
						ev.preventDefault();
					}
				},


				// Updates internal state and triggers handlers for when an event element is moused over
				handleMouseover: function (seg, ev) {
					if (
						!GlobalEmitter.get().shouldIgnoreMouse() &&
						!this.mousedOverSeg
					) {
						this.mousedOverSeg = seg;

						// TODO: move to EventSelecting's responsibility
						if (this.view.isEventDefResizable(seg.footprint.eventDef)) {
							seg.el.addClass('fc-allow-mouse-resize');
						}

						this.component.publiclyTrigger('eventMouseover', {
							context: seg.el[0],
							args: [seg.footprint.getEventLegacy(), ev, this.view]
						});
					}
				},


				// Updates internal state and triggers handlers for when an event element is moused out.
				// Can be given no arguments, in which case it will mouseout the segment that was previously moused over.
				handleMouseout: function (seg, ev) {
					if (this.mousedOverSeg) {
						this.mousedOverSeg = null;

						// TODO: move to EventSelecting's responsibility
						if (this.view.isEventDefResizable(seg.footprint.eventDef)) {
							seg.el.removeClass('fc-allow-mouse-resize');
						}

						this.component.publiclyTrigger('eventMouseout', {
							context: seg.el[0],
							args: [
								seg.footprint.getEventLegacy(),
								ev || {}, // if given no arg, make a mock mouse event
								this.view
							]
						});
					}
				},


				end: function () {
					if (this.mousedOverSeg) {
						this.handleMouseout(this.mousedOverSeg);
					}
				}

			});

			;
			;

			var StandardInteractionsMixin = FC.StandardInteractionsMixin = {
				dateClickingClass: DateClicking,
				dateSelectingClass: DateSelecting,
				eventPointingClass: EventPointing,
				eventDraggingClass: EventDragging,
				eventResizingClass: EventResizing,
				externalDroppingClass: ExternalDropping
			};

			;
			;

			var EventRenderer = FC.EventRenderer = Class.extend({

				view: null,
				component: null,
				fillRenderer: null, // might remain null

				fgSegs: null,
				bgSegs: null,

				// derived from options
				eventTimeFormat: null,
				displayEventTime: null,
				displayEventEnd: null,


				constructor: function (component, fillRenderer) { // fillRenderer is optional
					this.view = component._getView();
					this.component = component;
					this.fillRenderer = fillRenderer;
				},


				opt: function (name) {
					return this.view.opt(name);
				},


				// Updates values that rely on options and also relate to range
				rangeUpdated: function () {
					var displayEventTime;
					var displayEventEnd;

					this.eventTimeFormat =
						this.opt('eventTimeFormat') ||
						this.opt('timeFormat') || // deprecated
						this.computeEventTimeFormat();

					displayEventTime = this.opt('displayEventTime');
					if (displayEventTime == null) {
						displayEventTime = this.computeDisplayEventTime(); // might be based off of range
					}

					displayEventEnd = this.opt('displayEventEnd');
					if (displayEventEnd == null) {
						displayEventEnd = this.computeDisplayEventEnd(); // might be based off of range
					}

					this.displayEventTime = displayEventTime;
					this.displayEventEnd = displayEventEnd;
				},


				render: function (eventsPayload) {
					var dateProfile = this.component._getDateProfile();
					var eventDefId;
					var instanceGroup;
					var eventRanges;
					var bgRanges = [];
					var fgRanges = [];

					for (eventDefId in eventsPayload) {
						instanceGroup = eventsPayload[eventDefId];

						eventRanges = instanceGroup.sliceRenderRanges(
							dateProfile.activeUnzonedRange
						);

						if (instanceGroup.getEventDef().hasBgRendering()) {
							bgRanges.push.apply(bgRanges, eventRanges);
						}
						else {
							fgRanges.push.apply(fgRanges, eventRanges);
						}
					}

					this.renderBgRanges(bgRanges);
					this.renderFgRanges(fgRanges);
				},


				unrender: function () {
					this.unrenderBgRanges();
					this.unrenderFgRanges();
				},


				renderFgRanges: function (eventRanges) {
					var eventFootprints = this.component.eventRangesToEventFootprints(eventRanges);
					var segs = this.component.eventFootprintsToSegs(eventFootprints);

					// render an `.el` on each seg
					// returns a subset of the segs. segs that were actually rendered
					segs = this.renderFgSegEls(segs);

					if (this.renderFgSegs(segs) !== false) { // no failure?
						this.fgSegs = segs;
					}
				},


				unrenderFgRanges: function () {
					this.unrenderFgSegs(this.fgSegs || []);
					this.fgSegs = null;
				},


				renderBgRanges: function (eventRanges) {
					var eventFootprints = this.component.eventRangesToEventFootprints(eventRanges);
					var segs = this.component.eventFootprintsToSegs(eventFootprints);

					if (this.renderBgSegs(segs) !== false) { // no failure?
						this.bgSegs = segs;
					}
				},


				unrenderBgRanges: function () {
					this.unrenderBgSegs();
					this.bgSegs = null;
				},


				getSegs: function () {
					return (this.bgSegs || []).concat(this.fgSegs || []);
				},


				// Renders foreground event segments onto the grid
				renderFgSegs: function (segs) {
					// subclasses must implement
					// segs already has rendered els, and has been filtered.

					return false; // signal failure if not implemented
				},


				// Unrenders all currently rendered foreground segments
				unrenderFgSegs: function (segs) {
					// subclasses must implement
				},


				renderBgSegs: function (segs) {
					var _this = this;

					if (this.fillRenderer) {
						this.fillRenderer.renderSegs('bgEvent', segs, {
							getClasses: function (seg) {
								return _this.getBgClasses(seg.footprint.eventDef);
							},
							getCss: function (seg) {
								return {
									'background-color': _this.getBgColor(seg.footprint.eventDef)
								};
							},
							filterEl: function (seg, el) {
								return _this.filterEventRenderEl(seg.footprint, el);
							}
						});
					}
					else {
						return false; // signal failure if no fillRenderer
					}
				},


				unrenderBgSegs: function () {
					if (this.fillRenderer) {
						this.fillRenderer.unrender('bgEvent');
					}
				},


				// Renders and assigns an `el` property for each foreground event segment.
				// Only returns segments that successfully rendered.
				renderFgSegEls: function (segs, disableResizing) {
					var _this = this;
					var hasEventRenderHandlers = this.view.hasPublicHandlers('eventRender');
					var html = '';
					var renderedSegs = [];
					var i;

					if (segs.length) { // don't build an empty html string

						// build a large concatenation of event segment HTML
						for (i = 0; i < segs.length; i++) {
							this.beforeFgSegHtml(segs[i]);
							html += this.fgSegHtml(segs[i], disableResizing);
						}

						// Grab individual elements from the combined HTML string. Use each as the default rendering.
						// Then, compute the 'el' for each segment. An el might be null if the eventRender callback returned false.
						$(html).each(function (i, node) {
							var seg = segs[i];
							var el = $(node);

							if (hasEventRenderHandlers) { // optimization
								el = _this.filterEventRenderEl(seg.footprint, el);
							}

							if (el) {
								el.data('fc-seg', seg); // used by handlers
								seg.el = el;
								renderedSegs.push(seg);
							}
						});
					}

					return renderedSegs;
				},


				beforeFgSegHtml: function (seg) { // hack
				},


				// Generates the HTML for the default rendering of a foreground event segment. Used by renderFgSegEls()
				fgSegHtml: function (seg, disableResizing) {
					// subclasses should implement
				},


				// Generic utility for generating the HTML classNames for an event segment's element
				getSegClasses: function (seg, isDraggable, isResizable) {
					var classes = [
						'fc-event',
						seg.isStart ? 'fc-start' : 'fc-not-start',
						seg.isEnd ? 'fc-end' : 'fc-not-end'
					].concat(this.getClasses(seg.footprint.eventDef));

					if (isDraggable) {
						classes.push('fc-draggable');
					}
					if (isResizable) {
						classes.push('fc-resizable');
					}

					// event is currently selected? attach a className.
					if (this.view.isEventDefSelected(seg.footprint.eventDef)) {
						classes.push('fc-selected');
					}

					return classes;
				},


				// Given an event and the default element used for rendering, returns the element that should actually be used.
				// Basically runs events and elements through the eventRender hook.
				filterEventRenderEl: function (eventFootprint, el) {
					var legacy = eventFootprint.getEventLegacy();

					var custom = this.view.publiclyTrigger('eventRender', {
						context: legacy,
						args: [legacy, el, this.view]
					});

					if (custom === false) { // means don't render at all
						el = null;
					}
					else if (custom && custom !== true) {
						el = $(custom);
					}

					return el;
				},


				// Compute the text that should be displayed on an event's element.
				// `range` can be the Event object itself, or something range-like, with at least a `start`.
				// If event times are disabled, or the event has no time, will return a blank string.
				// If not specified, formatStr will default to the eventTimeFormat setting,
				// and displayEnd will default to the displayEventEnd setting.
				getTimeText: function (eventFootprint, formatStr, displayEnd) {
					return this._getTimeText(
						eventFootprint.eventInstance.dateProfile.start,
						eventFootprint.eventInstance.dateProfile.end,
						eventFootprint.componentFootprint.isAllDay,
						formatStr,
						displayEnd
					);
				},


				_getTimeText: function (start, end, isAllDay, formatStr, displayEnd) {
					if (formatStr == null) {
						formatStr = this.eventTimeFormat;
					}

					if (displayEnd == null) {
						displayEnd = this.displayEventEnd;
					}

					if (this.displayEventTime && !isAllDay) {
						if (displayEnd && end) {
							return this.view.formatRange(
								{start: start, end: end},
								false, // allDay
								formatStr
							);
						}
						else {
							return start.format(formatStr);
						}
					}

					return '';
				},


				computeEventTimeFormat: function () {
					return this.opt('smallTimeFormat');
				},


				computeDisplayEventTime: function () {
					return true;
				},


				computeDisplayEventEnd: function () {
					return true;
				},


				getBgClasses: function (eventDef) {
					var classNames = this.getClasses(eventDef);
					classNames.push('fc-bgevent');
					return classNames;
				},


				getClasses: function (eventDef) {
					var objs = this.getStylingObjs(eventDef);
					var i;
					var classNames = [];

					for (i = 0; i < objs.length; i++) {
						classNames.push.apply( // append
							classNames,
							objs[i].eventClassName || objs[i].className || []
						);
					}

					return classNames;
				},


				// Utility for generating event skin-related CSS properties
				getSkinCss: function (eventDef) {
					return {
						'background-color': this.getBgColor(eventDef),
						'border-color': this.getBorderColor(eventDef),
						color: this.getTextColor(eventDef)
					};
				},


				// Queries for caller-specified color, then falls back to default
				getBgColor: function (eventDef) {
					var objs = this.getStylingObjs(eventDef);
					var i;
					var val;

					for (i = 0; i < objs.length && !val; i++) {
						val = objs[i].eventBackgroundColor || objs[i].eventColor ||
							objs[i].backgroundColor || objs[i].color;
					}

					if (!val) {
						val = this.opt('eventBackgroundColor') || this.opt('eventColor');
					}

					return val;
				},


				// Queries for caller-specified color, then falls back to default
				getBorderColor: function (eventDef) {
					var objs = this.getStylingObjs(eventDef);
					var i;
					var val;

					for (i = 0; i < objs.length && !val; i++) {
						val = objs[i].eventBorderColor || objs[i].eventColor ||
							objs[i].borderColor || objs[i].color;
					}

					if (!val) {
						val = this.opt('eventBorderColor') || this.opt('eventColor');
					}

					return val;
				},


				// Queries for caller-specified color, then falls back to default
				getTextColor: function (eventDef) {
					var objs = this.getStylingObjs(eventDef);
					var i;
					var val;

					for (i = 0; i < objs.length && !val; i++) {
						val = objs[i].eventTextColor ||
							objs[i].textColor;
					}

					if (!val) {
						val = this.opt('eventTextColor');
					}

					return val;
				},


				getStylingObjs: function (eventDef) {
					var objs = this.getFallbackStylingObjs(eventDef);
					objs.unshift(eventDef);
					return objs;
				},


				getFallbackStylingObjs: function (eventDef) {
					return [eventDef.source];
				},


				sortEventSegs: function (segs) {
					segs.sort(proxy(this, 'compareEventSegs'));
				},


				// A cmp function for determining which segments should take visual priority
				compareEventSegs: function (seg1, seg2) {
					var f1 = seg1.footprint.componentFootprint;
					var r1 = f1.unzonedRange;
					var f2 = seg2.footprint.componentFootprint;
					var r2 = f2.unzonedRange;

					return r1.startMs - r2.startMs || // earlier events go first
						(r2.endMs - r2.startMs) - (r1.endMs - r1.startMs) || // tie? longer events go first
						f2.isAllDay - f1.isAllDay || // tie? put all-day events first (booleans cast to 0/1)
						compareByFieldSpecs(
							seg1.footprint.eventDef,
							seg2.footprint.eventDef,
							this.view.eventOrderSpecs
						);
				}

			});

			;
			;

			var BusinessHourRenderer = FC.BusinessHourRenderer = Class.extend({

				component: null,
				fillRenderer: null,
				segs: null,


				/*
	component implements:
		- eventRangesToEventFootprints
		- eventFootprintsToSegs
	*/
				constructor: function (component, fillRenderer) {
					this.component = component;
					this.fillRenderer = fillRenderer;
				},


				render: function (businessHourGenerator) {
					var component = this.component;
					var unzonedRange = component._getDateProfile().activeUnzonedRange;

					var eventInstanceGroup = businessHourGenerator.buildEventInstanceGroup(
						component.hasAllDayBusinessHours,
						unzonedRange
					);

					var eventFootprints = eventInstanceGroup ?
						component.eventRangesToEventFootprints(
							eventInstanceGroup.sliceRenderRanges(unzonedRange)
						) :
						[];

					this.renderEventFootprints(eventFootprints);
				},


				renderEventFootprints: function (eventFootprints) {
					var segs = this.component.eventFootprintsToSegs(eventFootprints);

					this.renderSegs(segs);
					this.segs = segs;
				},


				renderSegs: function (segs) {
					if (this.fillRenderer) {
						this.fillRenderer.renderSegs('businessHours', segs, {
							getClasses: function (seg) {
								return ['fc-nonbusiness', 'fc-bgevent'];
							}
						});
					}
				},


				unrender: function () {
					if (this.fillRenderer) {
						this.fillRenderer.unrender('businessHours');
					}

					this.segs = null;
				},


				getSegs: function () {
					return this.segs || [];
				}

			});

			;
			;

			var FillRenderer = FC.FillRenderer = Class.extend({ // use for highlight, background events, business hours

				fillSegTag: 'div',
				component: null,
				elsByFill: null, // a hash of jQuery element sets used for rendering each fill. Keyed by fill name.


				constructor: function (component) {
					this.component = component;
					this.elsByFill = {};
				},


				renderFootprint: function (type, componentFootprint, props) {
					this.renderSegs(
						type,
						this.component.componentFootprintToSegs(componentFootprint),
						props
					);
				},


				renderSegs: function (type, segs, props) {
					var els;

					segs = this.buildSegEls(type, segs, props); // assignes `.el` to each seg. returns successfully rendered segs
					els = this.attachSegEls(type, segs);

					if (els) {
						this.reportEls(type, els);
					}

					return segs;
				},


				// Unrenders a specific type of fill that is currently rendered on the grid
				unrender: function (type) {
					var el = this.elsByFill[type];

					if (el) {
						el.remove();
						delete this.elsByFill[type];
					}
				},


				// Renders and assigns an `el` property for each fill segment. Generic enough to work with different types.
				// Only returns segments that successfully rendered.
				buildSegEls: function (type, segs, props) {
					var _this = this;
					var html = '';
					var renderedSegs = [];
					var i;

					if (segs.length) {

						// build a large concatenation of segment HTML
						for (i = 0; i < segs.length; i++) {
							html += this.buildSegHtml(type, segs[i], props);
						}

						// Grab individual elements from the combined HTML string. Use each as the default rendering.
						// Then, compute the 'el' for each segment.
						$(html).each(function (i, node) {
							var seg = segs[i];
							var el = $(node);

							// allow custom filter methods per-type
							if (props.filterEl) {
								el = props.filterEl(seg, el);
							}

							if (el) { // custom filters did not cancel the render
								el = $(el); // allow custom filter to return raw DOM node

								// correct element type? (would be bad if a non-TD were inserted into a table for example)
								if (el.is(_this.fillSegTag)) {
									seg.el = el;
									renderedSegs.push(seg);
								}
							}
						});
					}

					return renderedSegs;
				},


				// Builds the HTML needed for one fill segment. Generic enough to work with different types.
				buildSegHtml: function (type, seg, props) {
					// custom hooks per-type
					var classes = props.getClasses ? props.getClasses(seg) : [];
					var css = cssToStr(props.getCss ? props.getCss(seg) : {});

					return '<' + this.fillSegTag +
						(classes.length ? ' class="' + classes.join(' ') + '"' : '') +
						(css ? ' style="' + css + '"' : '') +
						' />';
				},


				// Should return wrapping DOM structure
				attachSegEls: function (type, segs) {
					// subclasses must implement
				},


				reportEls: function (type, nodes) {
					if (this.elsByFill[type]) {
						this.elsByFill[type] = this.elsByFill[type].add(nodes);
					}
					else {
						this.elsByFill[type] = $(nodes);
					}
				}

			});

			;
			;

			var HelperRenderer = FC.HelperRenderer = Class.extend({

				view: null,
				component: null,
				eventRenderer: null,
				helperEls: null,


				constructor: function (component, eventRenderer) {
					this.view = component._getView();
					this.component = component;
					this.eventRenderer = eventRenderer;
				},


				renderComponentFootprint: function (componentFootprint) {
					this.renderEventFootprints([
						this.fabricateEventFootprint(componentFootprint)
					]);
				},


				renderEventDraggingFootprints: function (eventFootprints, sourceSeg, isTouch) {
					this.renderEventFootprints(
						eventFootprints,
						sourceSeg,
						'fc-dragging',
						isTouch ? null : this.view.opt('dragOpacity')
					);
				},


				renderEventResizingFootprints: function (eventFootprints, sourceSeg, isTouch) {
					this.renderEventFootprints(
						eventFootprints,
						sourceSeg,
						'fc-resizing'
					);
				},


				renderEventFootprints: function (eventFootprints, sourceSeg, extraClassNames, opacity) {
					var segs = this.component.eventFootprintsToSegs(eventFootprints);
					var classNames = 'fc-helper ' + (extraClassNames || '');
					var i;

					// assigns each seg's el and returns a subset of segs that were rendered
					segs = this.eventRenderer.renderFgSegEls(segs);

					for (i = 0; i < segs.length; i++) {
						segs[i].el.addClass(classNames);
					}

					if (opacity != null) {
						for (i = 0; i < segs.length; i++) {
							segs[i].el.css('opacity', opacity);
						}
					}

					this.helperEls = this.renderSegs(segs, sourceSeg);
				},


				/*
	Must return all mock event elements
	*/
				renderSegs: function (segs, sourceSeg) {
					// Subclasses must implement
				},


				unrender: function () {
					if (this.helperEls) {
						this.helperEls.remove();
						this.helperEls = null;
					}
				},


				fabricateEventFootprint: function (componentFootprint) {
					var calendar = this.view.calendar;
					var eventDateProfile = calendar.footprintToDateProfile(componentFootprint);
					var dummyEvent = new SingleEventDef(new EventSource(calendar));
					var dummyInstance;

					dummyEvent.dateProfile = eventDateProfile;
					dummyInstance = dummyEvent.buildInstance();

					return new EventFootprint(componentFootprint, dummyEvent, dummyInstance);
				}

			});

			;
			;

			var Component = Model.extend({

				el: null,


				setElement: function (el) {
					this.el = el;
					this.bindGlobalHandlers();
					this.renderSkeleton();
					this.set('isInDom', true);
				},


				removeElement: function () {
					this.unset('isInDom');
					this.unrenderSkeleton();
					this.unbindGlobalHandlers();

					this.el.remove();
					// NOTE: don't null-out this.el in case the View was destroyed within an API callback.
					// We don't null-out the View's other jQuery element references upon destroy,
					//  so we shouldn't kill this.el either.
				},


				bindGlobalHandlers: function () {
				},


				unbindGlobalHandlers: function () {
				},


				/*
	NOTE: Can't have a `render` method. Read the deprecation notice in View::executeDateRender
	*/


				// Renders the basic structure of the view before any content is rendered
				renderSkeleton: function () {
					// subclasses should implement
				},


				// Unrenders the basic structure of the view
				unrenderSkeleton: function () {
					// subclasses should implement
				}

			});

			;
			;

			var DateComponent = FC.DateComponent = Component.extend({

				uid: null,
				childrenByUid: null,
				isRTL: false, // frequently accessed options
				nextDayThreshold: null, // "
				dateProfile: null, // hack

				eventRendererClass: null,
				helperRendererClass: null,
				businessHourRendererClass: null,
				fillRendererClass: null,

				eventRenderer: null,
				helperRenderer: null,
				businessHourRenderer: null,
				fillRenderer: null,

				hitsNeededDepth: 0, // necessary because multiple callers might need the same hits

				hasAllDayBusinessHours: false, // TODO: unify with largeUnit and isTimeScale?

				isDatesRendered: false,


				constructor: function () {
					Component.call(this);

					this.uid = String(DateComponent.guid++);
					this.childrenByUid = {};

					this.nextDayThreshold = moment.duration(this.opt('nextDayThreshold'));
					this.isRTL = this.opt('isRTL');

					if (this.fillRendererClass) {
						this.fillRenderer = new this.fillRendererClass(this);
					}

					if (this.eventRendererClass) { // fillRenderer is optional -----v
						this.eventRenderer = new this.eventRendererClass(this, this.fillRenderer);
					}

					if (this.helperRendererClass && this.eventRenderer) {
						this.helperRenderer = new this.helperRendererClass(this, this.eventRenderer);
					}

					if (this.businessHourRendererClass && this.fillRenderer) {
						this.businessHourRenderer = new this.businessHourRendererClass(this, this.fillRenderer);
					}
				},


				addChild: function (child) {
					if (!this.childrenByUid[child.uid]) {
						this.childrenByUid[child.uid] = child;

						return true;
					}

					return false;
				},


				removeChild: function (child) {
					if (this.childrenByUid[child.uid]) {
						delete this.childrenByUid[child.uid];

						return true;
					}

					return false;
				},


				// TODO: only do if isInDom?
				// TODO: make part of Component, along with children/batch-render system?
				updateSize: function (totalHeight, isAuto, isResize) {
					this.callChildren('updateSize', arguments);
				},


				// Options
				// -----------------------------------------------------------------------------------------------------------------


				opt: function (name) {
					return this._getView().opt(name); // default implementation
				},


				publiclyTrigger: function (/**/) {
					var calendar = this._getCalendar();

					return calendar.publiclyTrigger.apply(calendar, arguments);
				},


				hasPublicHandlers: function (/**/) {
					var calendar = this._getCalendar();

					return calendar.hasPublicHandlers.apply(calendar, arguments);
				},


				// Date
				// -----------------------------------------------------------------------------------------------------------------


				executeDateRender: function (dateProfile) {
					this.dateProfile = dateProfile; // for rendering
					this.renderDates(dateProfile);
					this.isDatesRendered = true;
					this.callChildren('executeDateRender', arguments);
				},


				executeDateUnrender: function () { // wrapper
					this.callChildren('executeDateUnrender', arguments);
					this.dateProfile = null;
					this.unrenderDates();
					this.isDatesRendered = false;
				},


				// date-cell content only
				renderDates: function (dateProfile) {
					// subclasses should implement
				},


				// date-cell content only
				unrenderDates: function () {
					// subclasses should override
				},


				// Now-Indicator
				// -----------------------------------------------------------------------------------------------------------------


				// Returns a string unit, like 'second' or 'minute' that defined how often the current time indicator
				// should be refreshed. If something falsy is returned, no time indicator is rendered at all.
				getNowIndicatorUnit: function () {
					// subclasses should implement
				},


				// Renders a current time indicator at the given datetime
				renderNowIndicator: function (date) {
					this.callChildren('renderNowIndicator', arguments);
				},


				// Undoes the rendering actions from renderNowIndicator
				unrenderNowIndicator: function () {
					this.callChildren('unrenderNowIndicator', arguments);
				},


				// Business Hours
				// ---------------------------------------------------------------------------------------------------------------


				renderBusinessHours: function (businessHourGenerator) {
					if (this.businessHourRenderer) {
						this.businessHourRenderer.render(businessHourGenerator);
					}

					this.callChildren('renderBusinessHours', arguments);
				},


				// Unrenders previously-rendered business-hours
				unrenderBusinessHours: function () {
					this.callChildren('unrenderBusinessHours', arguments);

					if (this.businessHourRenderer) {
						this.businessHourRenderer.unrender();
					}
				},


				// Event Displaying
				// -----------------------------------------------------------------------------------------------------------------


				executeEventRender: function (eventsPayload) {
					if (this.eventRenderer) {
						this.eventRenderer.rangeUpdated(); // poorly named now
						this.eventRenderer.render(eventsPayload);
					}
					else if (this.renderEvents) { // legacy
						this.renderEvents(convertEventsPayloadToLegacyArray(eventsPayload));
					}

					this.callChildren('executeEventRender', arguments);
				},


				executeEventUnrender: function () {
					this.callChildren('executeEventUnrender', arguments);

					if (this.eventRenderer) {
						this.eventRenderer.unrender();
					}
					else if (this.destroyEvents) { // legacy
						this.destroyEvents();
					}
				},


				getBusinessHourSegs: function () { // recursive
					var segs = this.getOwnBusinessHourSegs();

					this.iterChildren(function (child) {
						segs.push.apply(segs, child.getBusinessHourSegs());
					});

					return segs;
				},


				getOwnBusinessHourSegs: function () {
					if (this.businessHourRenderer) {
						return this.businessHourRenderer.getSegs();
					}

					return [];
				},


				getEventSegs: function () { // recursive
					var segs = this.getOwnEventSegs();

					this.iterChildren(function (child) {
						segs.push.apply(segs, child.getEventSegs());
					});

					return segs;
				},


				getOwnEventSegs: function () { // just for itself
					if (this.eventRenderer) {
						return this.eventRenderer.getSegs();
					}

					return [];
				},


				// Event Rendering Triggering
				// -----------------------------------------------------------------------------------------------------------------


				triggerAfterEventsRendered: function () {
					this.triggerAfterEventSegsRendered(
						this.getEventSegs()
					);

					this.publiclyTrigger('eventAfterAllRender', {
						context: this,
						args: [this]
					});
				},


				triggerAfterEventSegsRendered: function (segs) {
					var _this = this;

					// an optimization, because getEventLegacy is expensive
					if (this.hasPublicHandlers('eventAfterRender')) {
						segs.forEach(function (seg) {
							var legacy;

							if (seg.el) { // necessary?
								legacy = seg.footprint.getEventLegacy();

								_this.publiclyTrigger('eventAfterRender', {
									context: legacy,
									args: [legacy, seg.el, _this]
								});
							}
						});
					}
				},


				triggerBeforeEventsDestroyed: function () {
					this.triggerBeforeEventSegsDestroyed(
						this.getEventSegs()
					);
				},


				triggerBeforeEventSegsDestroyed: function (segs) {
					var _this = this;

					if (this.hasPublicHandlers('eventDestroy')) {
						segs.forEach(function (seg) {
							var legacy;

							if (seg.el) { // necessary?
								legacy = seg.footprint.getEventLegacy();

								_this.publiclyTrigger('eventDestroy', {
									context: legacy,
									args: [legacy, seg.el, _this]
								});
							}
						});
					}
				},


				// Event Rendering Utils
				// -----------------------------------------------------------------------------------------------------------------


				// Hides all rendered event segments linked to the given event
				// RECURSIVE with subcomponents
				showEventsWithId: function (eventDefId) {

					this.getEventSegs().forEach(function (seg) {
						if (
							seg.footprint.eventDef.id === eventDefId &&
							seg.el // necessary?
						) {
							seg.el.css('visibility', '');
						}
					});

					this.callChildren('showEventsWithId', arguments);
				},


				// Shows all rendered event segments linked to the given event
				// RECURSIVE with subcomponents
				hideEventsWithId: function (eventDefId) {

					this.getEventSegs().forEach(function (seg) {
						if (
							seg.footprint.eventDef.id === eventDefId &&
							seg.el // necessary?
						) {
							seg.el.css('visibility', 'hidden');
						}
					});

					this.callChildren('hideEventsWithId', arguments);
				},


				// Drag-n-Drop Rendering (for both events and external elements)
				// ---------------------------------------------------------------------------------------------------------------


				// Renders a visual indication of a event or external-element drag over the given drop zone.
				// If an external-element, seg will be `null`.
				// Must return elements used for any mock events.
				renderDrag: function (eventFootprints, seg, isTouch) {
					var renderedHelper = false;

					this.iterChildren(function (child) {
						if (child.renderDrag(eventFootprints, seg, isTouch)) {
							renderedHelper = true;
						}
					});

					return renderedHelper;
				},


				// Unrenders a visual indication of an event or external-element being dragged.
				unrenderDrag: function () {
					this.callChildren('unrenderDrag', arguments);
				},


				// Event Resizing
				// ---------------------------------------------------------------------------------------------------------------


				// Renders a visual indication of an event being resized.
				renderEventResize: function (eventFootprints, seg, isTouch) {
					this.callChildren('renderEventResize', arguments);
				},


				// Unrenders a visual indication of an event being resized.
				unrenderEventResize: function () {
					this.callChildren('unrenderEventResize', arguments);
				},


				// Selection
				// ---------------------------------------------------------------------------------------------------------------


				// Renders a visual indication of the selection
				// TODO: rename to `renderSelection` after legacy is gone
				renderSelectionFootprint: function (componentFootprint) {
					this.renderHighlight(componentFootprint);

					this.callChildren('renderSelectionFootprint', arguments);
				},


				// Unrenders a visual indication of selection
				unrenderSelection: function () {
					this.unrenderHighlight();

					this.callChildren('unrenderSelection', arguments);
				},


				// Highlight
				// ---------------------------------------------------------------------------------------------------------------


				// Renders an emphasis on the given date range. Given a span (unzoned start/end and other misc data)
				renderHighlight: function (componentFootprint) {
					if (this.fillRenderer) {
						this.fillRenderer.renderFootprint(
							'highlight',
							componentFootprint,
							{
								getClasses: function () {
									return ['fc-highlight'];
								}
							}
						);
					}

					this.callChildren('renderHighlight', arguments);
				},


				// Unrenders the emphasis on a date range
				unrenderHighlight: function () {
					if (this.fillRenderer) {
						this.fillRenderer.unrender('highlight');
					}

					this.callChildren('unrenderHighlight', arguments);
				},


				// Hit Areas
				// ---------------------------------------------------------------------------------------------------------------
				// just because all DateComponents support this interface
				// doesn't mean they need to have their own internal coord system. they can defer to sub-components.


				hitsNeeded: function () {
					if (!(this.hitsNeededDepth++)) {
						this.prepareHits();
					}

					this.callChildren('hitsNeeded', arguments);
				},


				hitsNotNeeded: function () {
					if (this.hitsNeededDepth && !(--this.hitsNeededDepth)) {
						this.releaseHits();
					}

					this.callChildren('hitsNotNeeded', arguments);
				},


				prepareHits: function () {
					// subclasses can implement
				},


				releaseHits: function () {
					// subclasses can implement
				},


				// Given coordinates from the topleft of the document, return data about the date-related area underneath.
				// Can return an object with arbitrary properties (although top/right/left/bottom are encouraged).
				// Must have a `grid` property, a reference to this current grid. TODO: avoid this
				// The returned object will be processed by getHitFootprint and getHitEl.
				queryHit: function (leftOffset, topOffset) {
					var childrenByUid = this.childrenByUid;
					var uid;
					var hit;

					for (uid in childrenByUid) {
						hit = childrenByUid[uid].queryHit(leftOffset, topOffset);

						if (hit) {
							break;
						}
					}

					return hit;
				},


				getSafeHitFootprint: function (hit) {
					var footprint = this.getHitFootprint(hit);

					if (!this.dateProfile.activeUnzonedRange.containsRange(footprint.unzonedRange)) {
						return null;
					}

					return footprint;
				},


				getHitFootprint: function (hit) {
				},


				// Given position-level information about a date-related area within the grid,
				// should return a jQuery element that best represents it. passed to dayClick callback.
				getHitEl: function (hit) {
				},


				/* Converting eventRange -> eventFootprint
	------------------------------------------------------------------------------------------------------------------*/


				eventRangesToEventFootprints: function (eventRanges) {
					var eventFootprints = [];
					var i;

					for (i = 0; i < eventRanges.length; i++) {
						eventFootprints.push.apply( // append
							eventFootprints,
							this.eventRangeToEventFootprints(eventRanges[i])
						);
					}

					return eventFootprints;
				},


				eventRangeToEventFootprints: function (eventRange) {
					return [eventRangeToEventFootprint(eventRange)];
				},


				/* Converting componentFootprint/eventFootprint -> segs
	------------------------------------------------------------------------------------------------------------------*/


				eventFootprintsToSegs: function (eventFootprints) {
					var segs = [];
					var i;

					for (i = 0; i < eventFootprints.length; i++) {
						segs.push.apply(segs,
							this.eventFootprintToSegs(eventFootprints[i])
						);
					}

					return segs;
				},


				// Given an event's span (unzoned start/end and other misc data), and the event itself,
				// slices into segments and attaches event-derived properties to them.
				// eventSpan - { start, end, isStart, isEnd, otherthings... }
				eventFootprintToSegs: function (eventFootprint) {
					var unzonedRange = eventFootprint.componentFootprint.unzonedRange;
					var segs;
					var i, seg;

					segs = this.componentFootprintToSegs(eventFootprint.componentFootprint);

					for (i = 0; i < segs.length; i++) {
						seg = segs[i];

						if (!unzonedRange.isStart) {
							seg.isStart = false;
						}
						if (!unzonedRange.isEnd) {
							seg.isEnd = false;
						}

						seg.footprint = eventFootprint;
						// TODO: rename to seg.eventFootprint
					}

					return segs;
				},


				componentFootprintToSegs: function (componentFootprint) {
					return [];
				},


				// Utils
				// ---------------------------------------------------------------------------------------------------------------


				callChildren: function (methodName, args) {
					this.iterChildren(function (child) {
						child[methodName].apply(child, args);
					});
				},


				iterChildren: function (func) {
					var childrenByUid = this.childrenByUid;
					var uid;

					for (uid in childrenByUid) {
						func(childrenByUid[uid]);
					}
				},


				_getCalendar: function () { // TODO: strip out. move to generic parent.
					return this.calendar || this.view.calendar;
				},


				_getView: function () { // TODO: strip out. move to generic parent.
					return this.view;
				},


				_getDateProfile: function () {
					return this._getView().get('dateProfile');
				}

			});


			DateComponent.guid = 0; // TODO: better system for this?


// legacy

			function convertEventsPayloadToLegacyArray(eventsPayload) {
				var eventDefId;
				var eventInstances;
				var legacyEvents = [];
				var i;

				for (eventDefId in eventsPayload) {
					eventInstances = eventsPayload[eventDefId].eventInstances;

					for (i = 0; i < eventInstances.length; i++) {
						legacyEvents.push(
							eventInstances[i].toLegacy()
						);
					}
				}

				return legacyEvents;
			}

			;
			;

			DateComponent.mixin({

				// Generates HTML for an anchor to another view into the calendar.
				// Will either generate an <a> tag or a non-clickable <span> tag, depending on enabled settings.
				// `gotoOptions` can either be a moment input, or an object with the form:
				// { date, type, forceOff }
				// `type` is a view-type like "day" or "week". default value is "day".
				// `attrs` and `innerHtml` are use to generate the rest of the HTML tag.
				buildGotoAnchorHtml: function (gotoOptions, attrs, innerHtml) {
					var date, type, forceOff;
					var finalOptions;

					if ($.isPlainObject(gotoOptions)) {
						date = gotoOptions.date;
						type = gotoOptions.type;
						forceOff = gotoOptions.forceOff;
					}
					else {
						date = gotoOptions; // a single moment input
					}
					date = FC.moment(date); // if a string, parse it

					finalOptions = { // for serialization into the link
						date: date.format('YYYY-MM-DD'),
						type: type || 'day'
					};

					if (typeof attrs === 'string') {
						innerHtml = attrs;
						attrs = null;
					}

					attrs = attrs ? ' ' + attrsToStr(attrs) : ''; // will have a leading space
					innerHtml = innerHtml || '';

					if (!forceOff && this.opt('navLinks')) {
						return '<a' + attrs +
							' data-goto="' + htmlEscape(JSON.stringify(finalOptions)) + '">' +
							innerHtml +
							'</a>';
					}
					else {
						return '<span' + attrs + '>' +
							innerHtml +
							'</span>';
					}
				},


				getAllDayHtml: function () {
					return this.opt('allDayHtml') || htmlEscape(this.opt('allDayText'));
				},


				// Computes HTML classNames for a single-day element
				getDayClasses: function (date, noThemeHighlight) {
					var view = this._getView();
					var classes = [];
					var today;

					if (!this.dateProfile.activeUnzonedRange.containsDate(date)) {
						classes.push('fc-disabled-day'); // TODO: jQuery UI theme?
					}
					else {
						classes.push('fc-' + dayIDs[date.day()]);

						if (view.isDateInOtherMonth(date, this.dateProfile)) { // TODO: use DateComponent subclass somehow
							classes.push('fc-other-month');
						}

						today = view.calendar.getNow();

						if (date.isSame(today, 'day')) {
							classes.push('fc-today');

							if (noThemeHighlight !== true) {
								classes.push(view.calendar.theme.getClass('today'));
							}
						}
						else if (date < today) {
							classes.push('fc-past');
						}
						else {
							classes.push('fc-future');
						}
					}

					return classes;
				},


				// Utility for formatting a range. Accepts a range object, formatting string, and optional separator.
				// Displays all-day ranges naturally, with an inclusive end. Takes the current isRTL into account.
				// The timezones of the dates within `range` will be respected.
				formatRange: function (range, isAllDay, formatStr, separator) {
					var end = range.end;

					if (isAllDay) {
						end = end.clone().subtract(1); // convert to inclusive. last ms of previous day
					}

					return formatRange(range.start, end, formatStr, separator, this.isRTL);
				},


				// Compute the number of the give units in the "current" range.
				// Will return a floating-point number. Won't round.
				currentRangeAs: function (unit) {
					return this._getDateProfile().currentUnzonedRange.as(unit);
				},


				// Returns the date range of the full days the given range visually appears to occupy.
				// Returns a plain object with start/end, NOT an UnzonedRange!
				computeDayRange: function (unzonedRange) {
					var calendar = this._getCalendar();
					var startDay = calendar.msToUtcMoment(unzonedRange.startMs, true); // the beginning of the day the range starts
					var end = calendar.msToUtcMoment(unzonedRange.endMs);
					var endTimeMS = +end.time(); // # of milliseconds into `endDay`
					var endDay = end.clone().stripTime(); // the beginning of the day the range exclusively ends

					// If the end time is actually inclusively part of the next day and is equal to or
					// beyond the next day threshold, adjust the end to be the exclusive end of `endDay`.
					// Otherwise, leaving it as inclusive will cause it to exclude `endDay`.
					if (endTimeMS && endTimeMS >= this.nextDayThreshold) {
						endDay.add(1, 'days');
					}

					// If end is within `startDay` but not past nextDayThreshold, assign the default duration of one day.
					if (endDay <= startDay) {
						endDay = startDay.clone().add(1, 'days');
					}

					return {start: startDay, end: endDay};
				},


				// Does the given range visually appear to occupy more than one day?
				isMultiDayRange: function (unzonedRange) {
					var dayRange = this.computeDayRange(unzonedRange);

					return dayRange.end.diff(dayRange.start, 'days') > 1;
				}

			});

			;
			;

			var InteractiveDateComponent = FC.InteractiveDateComponent = DateComponent.extend({

				dateClickingClass: null,
				dateSelectingClass: null,
				eventPointingClass: null,
				eventDraggingClass: null,
				eventResizingClass: null,
				externalDroppingClass: null,

				dateClicking: null,
				dateSelecting: null,
				eventPointing: null,
				eventDragging: null,
				eventResizing: null,
				externalDropping: null,

				// self-config, overridable by subclasses
				segSelector: '.fc-event-container > *', // what constitutes an event element?

				// if defined, holds the unit identified (ex: "year" or "month") that determines the level of granularity
				// of the date areas. if not defined, assumes to be day and time granularity.
				// TODO: port isTimeScale into same system?
				largeUnit: null,


				constructor: function () {
					DateComponent.call(this);

					if (this.dateSelectingClass) {
						this.dateClicking = new this.dateClickingClass(this);
					}

					if (this.dateSelectingClass) {
						this.dateSelecting = new this.dateSelectingClass(this);
					}

					if (this.eventPointingClass) {
						this.eventPointing = new this.eventPointingClass(this);
					}

					if (this.eventDraggingClass && this.eventPointing) {
						this.eventDragging = new this.eventDraggingClass(this, this.eventPointing);
					}

					if (this.eventResizingClass && this.eventPointing) {
						this.eventResizing = new this.eventResizingClass(this, this.eventPointing);
					}

					if (this.externalDroppingClass) {
						this.externalDropping = new this.externalDroppingClass(this);
					}
				},


				// Sets the container element that the view should render inside of, does global DOM-related initializations,
				// and renders all the non-date-related content inside.
				setElement: function (el) {
					DateComponent.prototype.setElement.apply(this, arguments);

					if (this.dateClicking) {
						this.dateClicking.bindToEl(el);
					}

					if (this.dateSelecting) {
						this.dateSelecting.bindToEl(el);
					}

					this.bindAllSegHandlersToEl(el);
				},


				unrender: function () {
					this.endInteractions();

					DateComponent.prototype.unrender.apply(this, arguments);
				},


				executeEventUnrender: function () {
					this.endInteractions();

					DateComponent.prototype.executeEventUnrender.apply(this, arguments);
				},


				bindGlobalHandlers: function () {
					DateComponent.prototype.bindGlobalHandlers.apply(this, arguments);

					if (this.externalDropping) {
						this.externalDropping.bindToDocument();
					}
				},


				unbindGlobalHandlers: function () {
					DateComponent.prototype.unbindGlobalHandlers.apply(this, arguments);

					if (this.externalDropping) {
						this.externalDropping.unbindFromDocument();
					}
				},


				bindDateHandlerToEl: function (el, name, handler) {
					var _this = this;

					// attach a handler to the grid's root element.
					// jQuery will take care of unregistering them when removeElement gets called.
					this.el.on(name, function (ev) {
						if (
							!$(ev.target).is(
								_this.segSelector + ',' + // directly on an event element
								_this.segSelector + ' *,' + // within an event element
								'.fc-more,' + // a "more.." link
								'a[data-goto]' // a clickable nav link
							)
						) {
							return handler.call(_this, ev);
						}
					});
				},


				bindAllSegHandlersToEl: function (el) {
					[
						this.eventPointing,
						this.eventDragging,
						this.eventResizing
					].forEach(function (eventInteraction) {
						if (eventInteraction) {
							eventInteraction.bindToEl(el);
						}
					});
				},


				bindSegHandlerToEl: function (el, name, handler) {
					var _this = this;

					el.on(name, this.segSelector, function (ev) {
						var seg = $(this).data('fc-seg'); // grab segment data. put there by View::renderEventsPayload

						if (seg && !_this.shouldIgnoreEventPointing()) {
							return handler.call(_this, seg, ev); // context will be the Grid
						}
					});
				},


				shouldIgnoreMouse: function () {
					// HACK
					// This will still work even though bindDateHandlerToEl doesn't use GlobalEmitter.
					return GlobalEmitter.get().shouldIgnoreMouse();
				},


				shouldIgnoreTouch: function () {
					var view = this._getView();

					// On iOS (and Android?) when a new selection is initiated overtop another selection,
					// the touchend never fires because the elements gets removed mid-touch-interaction (my theory).
					// HACK: simply don't allow this to happen.
					// ALSO: prevent selection when an *event* is already raised.
					return view.isSelected || view.selectedEvent;
				},


				shouldIgnoreEventPointing: function () {
					// only call the handlers if there is not a drag/resize in progress
					return (this.eventDragging && this.eventDragging.isDragging) ||
						(this.eventResizing && this.eventResizing.isResizing);
				},


				canStartSelection: function (seg, ev) {
					return getEvIsTouch(ev) &&
						!this.canStartResize(seg, ev) &&
						(this.isEventDefDraggable(seg.footprint.eventDef) ||
							this.isEventDefResizable(seg.footprint.eventDef));
				},


				canStartDrag: function (seg, ev) {
					return !this.canStartResize(seg, ev) &&
						this.isEventDefDraggable(seg.footprint.eventDef);
				},


				canStartResize: function (seg, ev) {
					var view = this._getView();
					var eventDef = seg.footprint.eventDef;

					return (!getEvIsTouch(ev) || view.isEventDefSelected(eventDef)) &&
						this.isEventDefResizable(eventDef) &&
						$(ev.target).is('.fc-resizer');
				},


				// Kills all in-progress dragging.
				// Useful for when public API methods that result in re-rendering are invoked during a drag.
				// Also useful for when touch devices misbehave and don't fire their touchend.
				endInteractions: function () {
					[
						this.dateClicking,
						this.dateSelecting,
						this.eventPointing,
						this.eventDragging,
						this.eventResizing
					].forEach(function (interaction) {
						if (interaction) {
							interaction.end();
						}
					});
				},


				// Event Drag-n-Drop
				// ---------------------------------------------------------------------------------------------------------------


				// Computes if the given event is allowed to be dragged by the user
				isEventDefDraggable: function (eventDef) {
					return this.isEventDefStartEditable(eventDef);
				},


				isEventDefStartEditable: function (eventDef) {
					var isEditable = eventDef.isStartExplicitlyEditable();

					if (isEditable == null) {
						isEditable = this.opt('eventStartEditable');

						if (isEditable == null) {
							isEditable = this.isEventDefGenerallyEditable(eventDef);
						}
					}

					return isEditable;
				},


				isEventDefGenerallyEditable: function (eventDef) {
					var isEditable = eventDef.isExplicitlyEditable();

					if (isEditable == null) {
						isEditable = this.opt('editable');
					}

					return isEditable;
				},


				// Event Resizing
				// ---------------------------------------------------------------------------------------------------------------


				// Computes if the given event is allowed to be resized from its starting edge
				isEventDefResizableFromStart: function (eventDef) {
					return this.opt('eventResizableFromStart') && this.isEventDefResizable(eventDef);
				},


				// Computes if the given event is allowed to be resized from its ending edge
				isEventDefResizableFromEnd: function (eventDef) {
					return this.isEventDefResizable(eventDef);
				},


				// Computes if the given event is allowed to be resized by the user at all
				isEventDefResizable: function (eventDef) {
					var isResizable = eventDef.isDurationExplicitlyEditable();

					if (isResizable == null) {
						isResizable = this.opt('eventDurationEditable');

						if (isResizable == null) {
							isResizable = this.isEventDefGenerallyEditable(eventDef);
						}
					}
					return isResizable;
				},


				// Event Mutation / Constraints
				// ---------------------------------------------------------------------------------------------------------------


				// Diffs the two dates, returning a duration, based on granularity of the grid
				// TODO: port isTimeScale into this system?
				diffDates: function (a, b) {
					if (this.largeUnit) {
						return diffByUnit(a, b, this.largeUnit);
					}
					else {
						return diffDayTime(a, b);
					}
				},


				// is it allowed, in relation to the view's validRange?
				// NOTE: very similar to isExternalInstanceGroupAllowed
				isEventInstanceGroupAllowed: function (eventInstanceGroup) {
					var view = this._getView();
					var dateProfile = this.dateProfile;
					var eventFootprints = this.eventRangesToEventFootprints(eventInstanceGroup.getAllEventRanges());
					var i;

					for (i = 0; i < eventFootprints.length; i++) {
						// TODO: just use getAllEventRanges directly
						if (!dateProfile.validUnzonedRange.containsRange(eventFootprints[i].componentFootprint.unzonedRange)) {
							return false;
						}
					}

					return view.calendar.isEventInstanceGroupAllowed(eventInstanceGroup);
				},


				// NOTE: very similar to isEventInstanceGroupAllowed
				// when it's a completely anonymous external drag, no event.
				isExternalInstanceGroupAllowed: function (eventInstanceGroup) {
					var view = this._getView();
					var dateProfile = this.dateProfile;
					var eventFootprints = this.eventRangesToEventFootprints(eventInstanceGroup.getAllEventRanges());
					var i;

					for (i = 0; i < eventFootprints.length; i++) {
						if (!dateProfile.validUnzonedRange.containsRange(eventFootprints[i].componentFootprint.unzonedRange)) {
							return false;
						}
					}

					for (i = 0; i < eventFootprints.length; i++) {
						// treat it as a selection
						// TODO: pass in eventInstanceGroup instead
						//  because we don't want calendar's constraint system to depend on a component's
						//  determination of footprints.
						if (!view.calendar.isSelectionFootprintAllowed(eventFootprints[i].componentFootprint)) {
							return false;
						}
					}

					return true;
				}

			});

			;
			;

			/*
A set of rendering and date-related methods for a visual component comprised of one or more rows of day columns.
Prerequisite: the object being mixed into needs to be a *Grid*
*/
			var DayTableMixin = FC.DayTableMixin = {

				breakOnWeeks: false, // should create a new row for each week?
				dayDates: null, // whole-day dates for each column. left to right
				dayIndices: null, // for each day from start, the offset
				daysPerRow: null,
				rowCnt: null,
				colCnt: null,
				colHeadFormat: null,


				// Populates internal variables used for date calculation and rendering
				updateDayTable: function () {
					var view = this.view;
					var calendar = view.calendar;
					var date = calendar.msToUtcMoment(this.dateProfile.renderUnzonedRange.startMs, true);
					var end = calendar.msToUtcMoment(this.dateProfile.renderUnzonedRange.endMs, true);
					var dayIndex = -1;
					var dayIndices = [];
					var dayDates = [];
					var daysPerRow;
					var firstDay;
					var rowCnt;

					while (date.isBefore(end)) { // loop each day from start to end
						if (view.isHiddenDay(date)) {
							dayIndices.push(dayIndex + 0.5); // mark that it's between indices
						}
						else {
							dayIndex++;
							dayIndices.push(dayIndex);
							dayDates.push(date.clone());
						}
						date.add(1, 'days');
					}

					if (this.breakOnWeeks) {
						// count columns until the day-of-week repeats
						firstDay = dayDates[0].day();
						for (daysPerRow = 1; daysPerRow < dayDates.length; daysPerRow++) {
							if (dayDates[daysPerRow].day() == firstDay) {
								break;
							}
						}
						rowCnt = Math.ceil(dayDates.length / daysPerRow);
					}
					else {
						rowCnt = 1;
						daysPerRow = dayDates.length;
					}

					this.dayDates = dayDates;
					this.dayIndices = dayIndices;
					this.daysPerRow = daysPerRow;
					this.rowCnt = rowCnt;

					this.updateDayTableCols();
				},


				// Computes and assigned the colCnt property and updates any options that may be computed from it
				updateDayTableCols: function () {
					this.colCnt = this.computeColCnt();
					this.colHeadFormat = this.opt('columnFormat') || this.computeColHeadFormat();
				},


				// Determines how many columns there should be in the table
				computeColCnt: function () {
					return this.daysPerRow;
				},


				// Computes the ambiguously-timed moment for the given cell
				getCellDate: function (row, col) {
					return this.dayDates[
						this.getCellDayIndex(row, col)
						].clone();
				},


				// Computes the ambiguously-timed date range for the given cell
				getCellRange: function (row, col) {
					var start = this.getCellDate(row, col);
					var end = start.clone().add(1, 'days');

					return {start: start, end: end};
				},


				// Returns the number of day cells, chronologically, from the first of the grid (0-based)
				getCellDayIndex: function (row, col) {
					return row * this.daysPerRow + this.getColDayIndex(col);
				},


				// Returns the numner of day cells, chronologically, from the first cell in *any given row*
				getColDayIndex: function (col) {
					if (this.isRTL) {
						return this.colCnt - 1 - col;
					}
					else {
						return col;
					}
				},


				// Given a date, returns its chronolocial cell-index from the first cell of the grid.
				// If the date lies between cells (because of hiddenDays), returns a floating-point value between offsets.
				// If before the first offset, returns a negative number.
				// If after the last offset, returns an offset past the last cell offset.
				// Only works for *start* dates of cells. Will not work for exclusive end dates for cells.
				getDateDayIndex: function (date) {
					var dayIndices = this.dayIndices;
					var dayOffset = date.diff(this.dayDates[0], 'days');

					if (dayOffset < 0) {
						return dayIndices[0] - 1;
					}
					else if (dayOffset >= dayIndices.length) {
						return dayIndices[dayIndices.length - 1] + 1;
					}
					else {
						return dayIndices[dayOffset];
					}
				},


				/* Options
	------------------------------------------------------------------------------------------------------------------*/


				// Computes a default column header formatting string if `colFormat` is not explicitly defined
				computeColHeadFormat: function () {
					// if more than one week row, or if there are a lot of columns with not much space,
					// put just the day numbers will be in each cell
					if (this.rowCnt > 1 || this.colCnt > 10) {
						return 'ddd'; // "Sat"
					}
					// multiple days, so full single date string WON'T be in title text
					else if (this.colCnt > 1) {
						return this.opt('dayOfMonthFormat'); // "Sat 12/10"
					}
					// single day, so full single date string will probably be in title text
					else {
						return 'dddd'; // "Saturday"
					}
				},


				/* Slicing
	------------------------------------------------------------------------------------------------------------------*/


				// Slices up a date range into a segment for every week-row it intersects with
				sliceRangeByRow: function (unzonedRange) {
					var daysPerRow = this.daysPerRow;
					var normalRange = this.view.computeDayRange(unzonedRange); // make whole-day range, considering nextDayThreshold
					var rangeFirst = this.getDateDayIndex(normalRange.start); // inclusive first index
					var rangeLast = this.getDateDayIndex(normalRange.end.clone().subtract(1, 'days')); // inclusive last index
					var segs = [];
					var row;
					var rowFirst, rowLast; // inclusive day-index range for current row
					var segFirst, segLast; // inclusive day-index range for segment

					for (row = 0; row < this.rowCnt; row++) {
						rowFirst = row * daysPerRow;
						rowLast = rowFirst + daysPerRow - 1;

						// intersect segment's offset range with the row's
						segFirst = Math.max(rangeFirst, rowFirst);
						segLast = Math.min(rangeLast, rowLast);

						// deal with in-between indices
						segFirst = Math.ceil(segFirst); // in-between starts round to next cell
						segLast = Math.floor(segLast); // in-between ends round to prev cell

						if (segFirst <= segLast) { // was there any intersection with the current row?
							segs.push({
								row: row,

								// normalize to start of row
								firstRowDayIndex: segFirst - rowFirst,
								lastRowDayIndex: segLast - rowFirst,

								// must be matching integers to be the segment's start/end
								isStart: segFirst === rangeFirst,
								isEnd: segLast === rangeLast
							});
						}
					}

					return segs;
				},


				// Slices up a date range into a segment for every day-cell it intersects with.
				// TODO: make more DRY with sliceRangeByRow somehow.
				sliceRangeByDay: function (unzonedRange) {
					var daysPerRow = this.daysPerRow;
					var normalRange = this.view.computeDayRange(unzonedRange); // make whole-day range, considering nextDayThreshold
					var rangeFirst = this.getDateDayIndex(normalRange.start); // inclusive first index
					var rangeLast = this.getDateDayIndex(normalRange.end.clone().subtract(1, 'days')); // inclusive last index
					var segs = [];
					var row;
					var rowFirst, rowLast; // inclusive day-index range for current row
					var i;
					var segFirst, segLast; // inclusive day-index range for segment

					for (row = 0; row < this.rowCnt; row++) {
						rowFirst = row * daysPerRow;
						rowLast = rowFirst + daysPerRow - 1;

						for (i = rowFirst; i <= rowLast; i++) {

							// intersect segment's offset range with the row's
							segFirst = Math.max(rangeFirst, i);
							segLast = Math.min(rangeLast, i);

							// deal with in-between indices
							segFirst = Math.ceil(segFirst); // in-between starts round to next cell
							segLast = Math.floor(segLast); // in-between ends round to prev cell

							if (segFirst <= segLast) { // was there any intersection with the current row?
								segs.push({
									row: row,

									// normalize to start of row
									firstRowDayIndex: segFirst - rowFirst,
									lastRowDayIndex: segLast - rowFirst,

									// must be matching integers to be the segment's start/end
									isStart: segFirst === rangeFirst,
									isEnd: segLast === rangeLast
								});
							}
						}
					}

					return segs;
				},


				/* Header Rendering
	------------------------------------------------------------------------------------------------------------------*/


				renderHeadHtml: function () {
					var theme = this.view.calendar.theme;

					return '' +
						'<div class="fc-row ' + theme.getClass('headerRow') + '">' +
						'<table class="' + theme.getClass('tableGrid') + '">' +
						'<thead>' +
						this.renderHeadTrHtml() +
						'</thead>' +
						'</table>' +
						'</div>';
				},


				renderHeadIntroHtml: function () {
					return this.renderIntroHtml(); // fall back to generic
				},


				renderHeadTrHtml: function () {
					return '' +
						'<tr>' +
						(this.isRTL ? '' : this.renderHeadIntroHtml()) +
						this.renderHeadDateCellsHtml() +
						(this.isRTL ? this.renderHeadIntroHtml() : '') +
						'</tr>';
				},


				renderHeadDateCellsHtml: function () {
					var htmls = [];
					var col, date;

					for (col = 0; col < this.colCnt; col++) {
						date = this.getCellDate(0, col);
						htmls.push(this.renderHeadDateCellHtml(date));
					}

					return htmls.join('');
				},


				// TODO: when internalApiVersion, accept an object for HTML attributes
				// (colspan should be no different)
				renderHeadDateCellHtml: function (date, colspan, otherAttrs) {
					var view = this.view;
					var isDateValid = this.dateProfile.activeUnzonedRange.containsDate(date); // TODO: called too frequently. cache somehow.
					var classNames = [
						'fc-day-header',
						view.calendar.theme.getClass('widgetHeader')
					];
					var innerHtml = htmlEscape(date.format(this.colHeadFormat));

					// if only one row of days, the classNames on the header can represent the specific days beneath
					if (this.rowCnt === 1) {
						classNames = classNames.concat(
							// includes the day-of-week class
							// noThemeHighlight=true (don't highlight the header)
							this.getDayClasses(date, true)
						);
					}
					else {
						classNames.push('fc-' + dayIDs[date.day()]); // only add the day-of-week class
					}

					return '' +
						'<th class="' + classNames.join(' ') + '"' +
						((isDateValid && this.rowCnt) === 1 ?
							' data-date="' + date.format('YYYY-MM-DD') + '"' :
							'') +
						(colspan > 1 ?
							' colspan="' + colspan + '"' :
							'') +
						(otherAttrs ?
							' ' + otherAttrs :
							'') +
						'>' +
						(isDateValid ?
								// don't make a link if the heading could represent multiple days, or if there's only one day (forceOff)
								view.buildGotoAnchorHtml(
									{date: date, forceOff: this.rowCnt > 1 || this.colCnt === 1},
									innerHtml
								) :
								// if not valid, display text, but no link
								innerHtml
						) +
						'</th>';
				},


				/* Background Rendering
	------------------------------------------------------------------------------------------------------------------*/


				renderBgTrHtml: function (row) {
					return '' +
						'<tr>' +
						(this.isRTL ? '' : this.renderBgIntroHtml(row)) +
						this.renderBgCellsHtml(row) +
						(this.isRTL ? this.renderBgIntroHtml(row) : '') +
						'</tr>';
				},


				renderBgIntroHtml: function (row) {
					return this.renderIntroHtml(); // fall back to generic
				},


				renderBgCellsHtml: function (row) {
					var htmls = [];
					var col, date;

					for (col = 0; col < this.colCnt; col++) {
						date = this.getCellDate(row, col);
						htmls.push(this.renderBgCellHtml(date));
					}

					return htmls.join('');
				},


				renderBgCellHtml: function (date, otherAttrs) {
					var view = this.view;
					var isDateValid = this.dateProfile.activeUnzonedRange.containsDate(date); // TODO: called too frequently. cache somehow.
					var classes = this.getDayClasses(date);

					classes.unshift('fc-day', view.calendar.theme.getClass('widgetContent'));

					return '<td class="' + classes.join(' ') + '"' +
						(isDateValid ?
							' data-date="' + date.format('YYYY-MM-DD') + '"' : // if date has a time, won't format it
							'') +
						(otherAttrs ?
							' ' + otherAttrs :
							'') +
						'></td>';
				},


				/* Generic
	------------------------------------------------------------------------------------------------------------------*/


				// Generates the default HTML intro for any row. User classes should override
				renderIntroHtml: function () {
				},


				// TODO: a generic method for dealing with <tr>, RTL, intro
				// when increment internalApiVersion
				// wrapTr (scheduler)


				/* Utils
	------------------------------------------------------------------------------------------------------------------*/


				// Applies the generic "intro" and "outro" HTML to the given cells.
				// Intro means the leftmost cell when the calendar is LTR and the rightmost cell when RTL. Vice-versa for outro.
				bookendCells: function (trEl) {
					var introHtml = this.renderIntroHtml();

					if (introHtml) {
						if (this.isRTL) {
							trEl.append(introHtml);
						}
						else {
							trEl.prepend(introHtml);
						}
					}
				}

			};

			;
			;

			/* An abstract class from which other views inherit from
----------------------------------------------------------------------------------------------------------------------*/

			var View = FC.View = InteractiveDateComponent.extend({

				type: null, // subclass' view name (string)
				name: null, // deprecated. use `type` instead
				title: null, // the text that will be displayed in the header's title

				calendar: null, // owner Calendar object
				viewSpec: null,
				options: null, // hash containing all options. already merged with view-specific-options

				renderQueue: null,
				batchRenderDepth: 0,
				queuedScroll: null,

				isSelected: false, // boolean whether a range of time is user-selected or not
				selectedEventInstance: null,

				eventOrderSpecs: null, // criteria for ordering events when they have same date/time

				// for date utils, computed from options
				isHiddenDayHash: null,

				// now indicator
				isNowIndicatorRendered: null,
				initialNowDate: null, // result first getNow call
				initialNowQueriedMs: null, // ms time the getNow was called
				nowIndicatorTimeoutID: null, // for refresh timing of now indicator
				nowIndicatorIntervalID: null, // "

				constructor: function (calendar, viewSpec) {
					this.calendar = calendar;
					this.viewSpec = viewSpec;

					// shortcuts
					this.type = viewSpec.type;
					this.options = viewSpec.options;

					// .name is deprecated
					this.name = this.type;

					InteractiveDateComponent.call(this);

					this.initRenderQueue();
					this.initHiddenDays();
					this.bindBaseRenderHandlers();
					this.eventOrderSpecs = parseFieldSpecs(this.opt('eventOrder'));

					// legacy
					if (this.initialize) {
						this.initialize();
					}
				},


				_getView: function () {
					return this;
				},


				// Retrieves an option with the given name
				opt: function (name) {
					return this.options[name];
				},


				/* Render Queue
	------------------------------------------------------------------------------------------------------------------*/


				initRenderQueue: function () {
					this.renderQueue = new RenderQueue({
						event: this.opt('eventRenderWait')
					});

					this.renderQueue.on('start', this.onRenderQueueStart.bind(this));
					this.renderQueue.on('stop', this.onRenderQueueStop.bind(this));

					this.on('before:change', this.startBatchRender);
					this.on('change', this.stopBatchRender);
				},


				onRenderQueueStart: function () {
					this.calendar.freezeContentHeight();
					this.addScroll(this.queryScroll());
				},


				onRenderQueueStop: function () {
					if (this.calendar.updateViewSize()) { // success?
						this.popScroll();
					}
					this.calendar.thawContentHeight();
				},


				startBatchRender: function () {
					if (!(this.batchRenderDepth++)) {
						this.renderQueue.pause();
					}
				},


				stopBatchRender: function () {
					if (!(--this.batchRenderDepth)) {
						this.renderQueue.resume();
					}
				},


				requestRender: function (func, namespace, actionType) {
					this.renderQueue.queue(func, namespace, actionType);
				},


				// given func will auto-bind to `this`
				whenSizeUpdated: function (func) {
					if (this.renderQueue.isRunning) {
						this.renderQueue.one('stop', func.bind(this));
					}
					else {
						func.call(this);
					}
				},


				/* Title and Date Formatting
	------------------------------------------------------------------------------------------------------------------*/


				// Computes what the title at the top of the calendar should be for this view
				computeTitle: function (dateProfile) {
					var unzonedRange;

					// for views that span a large unit of time, show the proper interval, ignoring stray days before and after
					if (/^(year|month)$/.test(dateProfile.currentRangeUnit)) {
						unzonedRange = dateProfile.currentUnzonedRange;
					}
					else { // for day units or smaller, use the actual day range
						unzonedRange = dateProfile.activeUnzonedRange;
					}

					return this.formatRange(
						{
							start: this.calendar.msToMoment(unzonedRange.startMs, dateProfile.isRangeAllDay),
							end: this.calendar.msToMoment(unzonedRange.endMs, dateProfile.isRangeAllDay)
						},
						dateProfile.isRangeAllDay,
						this.opt('titleFormat') || this.computeTitleFormat(dateProfile),
						this.opt('titleRangeSeparator')
					);
				},


				// Generates the format string that should be used to generate the title for the current date range.
				// Attempts to compute the most appropriate format if not explicitly specified with `titleFormat`.
				computeTitleFormat: function (dateProfile) {
					var currentRangeUnit = dateProfile.currentRangeUnit;

					if (currentRangeUnit == 'year') {
						return 'YYYY';
					}
					else if (currentRangeUnit == 'month') {
						return this.opt('monthYearFormat'); // like "September 2014"
					}
					else if (dateProfile.currentUnzonedRange.as('days') > 1) {
						return 'll'; // multi-day range. shorter, like "Sep 9 - 10 2014"
					}
					else {
						return 'LL'; // one day. longer, like "September 9 2014"
					}
				},


				// Date Setting/Unsetting
				// -----------------------------------------------------------------------------------------------------------------


				setDate: function (date) {
					var currentDateProfile = this.get('dateProfile');
					var newDateProfile = this.buildDateProfile(date, null, true); // forceToValid=true

					if (
						!currentDateProfile ||
						!currentDateProfile.activeUnzonedRange.equals(newDateProfile.activeUnzonedRange)
					) {
						this.set('dateProfile', newDateProfile);
					}
				},


				unsetDate: function () {
					this.unset('dateProfile');
				},


				// Event Data
				// -----------------------------------------------------------------------------------------------------------------


				fetchInitialEvents: function (dateProfile) {
					var calendar = this.calendar;
					var forceAllDay = dateProfile.isRangeAllDay && !this.usesMinMaxTime;

					return calendar.requestEvents(
						calendar.msToMoment(dateProfile.activeUnzonedRange.startMs, forceAllDay),
						calendar.msToMoment(dateProfile.activeUnzonedRange.endMs, forceAllDay)
					);
				},


				bindEventChanges: function () {
					this.listenTo(this.calendar, 'eventsReset', this.resetEvents); // TODO: make this a real event
				},


				unbindEventChanges: function () {
					this.stopListeningTo(this.calendar, 'eventsReset');
				},


				setEvents: function (eventsPayload) {
					this.set('currentEvents', eventsPayload);
					this.set('hasEvents', true);
				},


				unsetEvents: function () {
					this.unset('currentEvents');
					this.unset('hasEvents');
				},


				resetEvents: function (eventsPayload) {
					this.startBatchRender();
					this.unsetEvents();
					this.setEvents(eventsPayload);
					this.stopBatchRender();
				},


				// Date High-level Rendering
				// -----------------------------------------------------------------------------------------------------------------


				requestDateRender: function (dateProfile) {
					var _this = this;

					this.requestRender(function () {
						_this.executeDateRender(dateProfile);
					}, 'date', 'init');
				},


				requestDateUnrender: function () {
					var _this = this;

					this.requestRender(function () {
						_this.executeDateUnrender();
					}, 'date', 'destroy');
				},


				// if dateProfile not specified, uses current
				executeDateRender: function (dateProfile) {
					DateComponent.prototype.executeDateRender.apply(this, arguments);

					if (this.render) {
						this.render(); // TODO: deprecate
					}

					this.trigger('datesRendered');
					this.addScroll({isDateInit: true});
					this.startNowIndicator(); // shouldn't render yet because updateSize will be called soon
				},


				executeDateUnrender: function () {
					this.unselect();
					this.stopNowIndicator();
					this.trigger('before:datesUnrendered');

					if (this.destroy) {
						this.destroy(); // TODO: deprecate
					}

					DateComponent.prototype.executeDateUnrender.apply(this, arguments);
				},


				// "Base" rendering
				// -----------------------------------------------------------------------------------------------------------------


				bindBaseRenderHandlers: function () {
					var _this = this;

					this.on('datesRendered', function () {
						_this.whenSizeUpdated(
							_this.triggerViewRender
						);
					});

					this.on('before:datesUnrendered', function () {
						_this.triggerViewDestroy();
					});
				},


				triggerViewRender: function () {
					this.publiclyTrigger('viewRender', {
						context: this,
						args: [this, this.el]
					});
				},


				triggerViewDestroy: function () {
					this.publiclyTrigger('viewDestroy', {
						context: this,
						args: [this, this.el]
					});
				},


				// Event High-level Rendering
				// -----------------------------------------------------------------------------------------------------------------


				requestEventsRender: function (eventsPayload) {
					var _this = this;

					this.requestRender(function () {
						_this.executeEventRender(eventsPayload);
						_this.whenSizeUpdated(
							_this.triggerAfterEventsRendered
						);
					}, 'event', 'init');
				},


				requestEventsUnrender: function () {
					var _this = this;

					this.requestRender(function () {
						_this.triggerBeforeEventsDestroyed();
						_this.executeEventUnrender();
					}, 'event', 'destroy');
				},


				// Business Hour High-level Rendering
				// -----------------------------------------------------------------------------------------------------------------


				requestBusinessHoursRender: function (businessHourGenerator) {
					var _this = this;

					this.requestRender(function () {
						_this.renderBusinessHours(businessHourGenerator);
					}, 'businessHours', 'init');
				},

				requestBusinessHoursUnrender: function () {
					var _this = this;

					this.requestRender(function () {
						_this.unrenderBusinessHours();
					}, 'businessHours', 'destroy');
				},


				// Misc view rendering utils
				// -----------------------------------------------------------------------------------------------------------------


				// Binds DOM handlers to elements that reside outside the view container, such as the document
				bindGlobalHandlers: function () {
					InteractiveDateComponent.prototype.bindGlobalHandlers.apply(this, arguments);

					this.listenTo(GlobalEmitter.get(), {
						touchstart: this.processUnselect,
						mousedown: this.handleDocumentMousedown
					});
				},


				// Unbinds DOM handlers from elements that reside outside the view container
				unbindGlobalHandlers: function () {
					InteractiveDateComponent.prototype.unbindGlobalHandlers.apply(this, arguments);

					this.stopListeningTo(GlobalEmitter.get());
				},


				/* Now Indicator
	------------------------------------------------------------------------------------------------------------------*/


				// Immediately render the current time indicator and begins re-rendering it at an interval,
				// which is defined by this.getNowIndicatorUnit().
				// TODO: somehow do this for the current whole day's background too
				startNowIndicator: function () {
					var _this = this;
					var unit;
					var update;
					var delay; // ms wait value

					if (this.opt('nowIndicator')) {
						unit = this.getNowIndicatorUnit();
						if (unit) {
							update = proxy(this, 'updateNowIndicator'); // bind to `this`

							this.initialNowDate = this.calendar.getNow();
							this.initialNowQueriedMs = +new Date();

							// wait until the beginning of the next interval
							delay = this.initialNowDate.clone().startOf(unit).add(1, unit) - this.initialNowDate;
							this.nowIndicatorTimeoutID = setTimeout(function () {
								_this.nowIndicatorTimeoutID = null;
								update();
								delay = +moment.duration(1, unit);
								delay = Math.max(100, delay); // prevent too frequent
								_this.nowIndicatorIntervalID = setInterval(update, delay); // update every interval
							}, delay);
						}

						// rendering will be initiated in updateSize
					}
				},


				// rerenders the now indicator, computing the new current time from the amount of time that has passed
				// since the initial getNow call.
				updateNowIndicator: function () {
					if (
						this.isDatesRendered &&
						this.initialNowDate // activated before?
					) {
						this.unrenderNowIndicator(); // won't unrender if unnecessary
						this.renderNowIndicator(
							this.initialNowDate.clone().add(new Date() - this.initialNowQueriedMs) // add ms
						);
						this.isNowIndicatorRendered = true;
					}
				},


				// Immediately unrenders the view's current time indicator and stops any re-rendering timers.
				// Won't cause side effects if indicator isn't rendered.
				stopNowIndicator: function () {
					if (this.isNowIndicatorRendered) {

						if (this.nowIndicatorTimeoutID) {
							clearTimeout(this.nowIndicatorTimeoutID);
							this.nowIndicatorTimeoutID = null;
						}
						if (this.nowIndicatorIntervalID) {
							clearInterval(this.nowIndicatorIntervalID);
							this.nowIndicatorIntervalID = null;
						}

						this.unrenderNowIndicator();
						this.isNowIndicatorRendered = false;
					}
				},


				/* Dimensions
	------------------------------------------------------------------------------------------------------------------*/


				updateSize: function (totalHeight, isAuto, isResize) {

					if (this.setHeight) { // for legacy API
						this.setHeight(totalHeight, isAuto);
					}
					else {
						InteractiveDateComponent.prototype.updateSize.apply(this, arguments);
					}

					this.updateNowIndicator();
				},


				/* Scroller
	------------------------------------------------------------------------------------------------------------------*/


				addScroll: function (scroll) {
					var queuedScroll = this.queuedScroll || (this.queuedScroll = {});

					$.extend(queuedScroll, scroll);
				},


				popScroll: function () {
					this.applyQueuedScroll();
					this.queuedScroll = null;
				},


				applyQueuedScroll: function () {
					if (this.queuedScroll) {
						this.applyScroll(this.queuedScroll);
					}
				},


				queryScroll: function () {
					var scroll = {};

					if (this.isDatesRendered) {
						$.extend(scroll, this.queryDateScroll());
					}

					return scroll;
				},


				applyScroll: function (scroll) {
					if (scroll.isDateInit && this.isDatesRendered) {
						$.extend(scroll, this.computeInitialDateScroll());
					}

					if (this.isDatesRendered) {
						this.applyDateScroll(scroll);
					}
				},


				computeInitialDateScroll: function () {
					return {}; // subclasses must implement
				},


				queryDateScroll: function () {
					return {}; // subclasses must implement
				},


				applyDateScroll: function (scroll) {
					; // subclasses must implement
				},


				/* Event Drag-n-Drop
	------------------------------------------------------------------------------------------------------------------*/


				reportEventDrop: function (eventInstance, eventMutation, el, ev) {
					var eventManager = this.calendar.eventManager;
					var undoFunc = eventManager.mutateEventsWithId(
						eventInstance.def.id,
						eventMutation,
						this.calendar
					);
					var dateMutation = eventMutation.dateMutation;

					// update the EventInstance, for handlers
					if (dateMutation) {
						eventInstance.dateProfile = dateMutation.buildNewDateProfile(
							eventInstance.dateProfile,
							this.calendar
						);
					}

					this.triggerEventDrop(
						eventInstance,
						// a drop doesn't necessarily mean a date mutation (ex: resource change)
						(dateMutation && dateMutation.dateDelta) || moment.duration(),
						undoFunc,
						el, ev
					);
				},


				// Triggers event-drop handlers that have subscribed via the API
				triggerEventDrop: function (eventInstance, dateDelta, undoFunc, el, ev) {
					this.publiclyTrigger('eventDrop', {
						context: el[0],
						args: [
							eventInstance.toLegacy(),
							dateDelta,
							undoFunc,
							ev,
							{}, // {} = jqui dummy
							this
						]
					});
				},


				/* External Element Drag-n-Drop
	------------------------------------------------------------------------------------------------------------------*/


				// Must be called when an external element, via jQuery UI, has been dropped onto the calendar.
				// `meta` is the parsed data that has been embedded into the dragging event.
				// `dropLocation` is an object that contains the new zoned start/end/allDay values for the event.
				reportExternalDrop: function (singleEventDef, isEvent, isSticky, el, ev, ui) {

					if (isEvent) {
						this.calendar.eventManager.addEventDef(singleEventDef, isSticky);
					}

					this.triggerExternalDrop(singleEventDef, isEvent, el, ev, ui);
				},


				// Triggers external-drop handlers that have subscribed via the API
				triggerExternalDrop: function (singleEventDef, isEvent, el, ev, ui) {

					// trigger 'drop' regardless of whether element represents an event
					this.publiclyTrigger('drop', {
						context: el[0],
						args: [
							singleEventDef.dateProfile.start.clone(),
							ev,
							ui,
							this
						]
					});

					if (isEvent) {
						// signal an external event landed
						this.publiclyTrigger('eventReceive', {
							context: this,
							args: [
								singleEventDef.buildInstance().toLegacy(),
								this
							]
						});
					}
				},


				/* Event Resizing
	------------------------------------------------------------------------------------------------------------------*/


				// Must be called when an event in the view has been resized to a new length
				reportEventResize: function (eventInstance, eventMutation, el, ev) {
					var eventManager = this.calendar.eventManager;
					var undoFunc = eventManager.mutateEventsWithId(
						eventInstance.def.id,
						eventMutation,
						this.calendar
					);

					// update the EventInstance, for handlers
					eventInstance.dateProfile = eventMutation.dateMutation.buildNewDateProfile(
						eventInstance.dateProfile,
						this.calendar
					);

					this.triggerEventResize(
						eventInstance,
						eventMutation.dateMutation.endDelta,
						undoFunc,
						el, ev
					);
				},


				// Triggers event-resize handlers that have subscribed via the API
				triggerEventResize: function (eventInstance, durationDelta, undoFunc, el, ev) {
					this.publiclyTrigger('eventResize', {
						context: el[0],
						args: [
							eventInstance.toLegacy(),
							durationDelta,
							undoFunc,
							ev,
							{}, // {} = jqui dummy
							this
						]
					});
				},


				/* Selection (time range)
	------------------------------------------------------------------------------------------------------------------*/


				// Selects a date span on the view. `start` and `end` are both Moments.
				// `ev` is the native mouse event that begin the interaction.
				select: function (footprint, ev) {
					this.unselect(ev);
					this.renderSelectionFootprint(footprint);
					this.reportSelection(footprint, ev);
				},


				renderSelectionFootprint: function (footprint, ev) {
					if (this.renderSelection) { // legacy method in custom view classes
						this.renderSelection(
							footprint.toLegacy(this.calendar)
						);
					}
					else {
						InteractiveDateComponent.prototype.renderSelectionFootprint.apply(this, arguments);
					}
				},


				// Called when a new selection is made. Updates internal state and triggers handlers.
				reportSelection: function (footprint, ev) {
					this.isSelected = true;
					this.triggerSelect(footprint, ev);
				},


				// Triggers handlers to 'select'
				triggerSelect: function (footprint, ev) {
					var dateProfile = this.calendar.footprintToDateProfile(footprint); // abuse of "Event"DateProfile?

					this.publiclyTrigger('select', {
						context: this,
						args: [
							dateProfile.start,
							dateProfile.end,
							ev,
							this
						]
					});
				},


				// Undoes a selection. updates in the internal state and triggers handlers.
				// `ev` is the native mouse event that began the interaction.
				unselect: function (ev) {
					if (this.isSelected) {
						this.isSelected = false;
						if (this.destroySelection) {
							this.destroySelection(); // TODO: deprecate
						}
						this.unrenderSelection();
						this.publiclyTrigger('unselect', {
							context: this,
							args: [ev, this]
						});
					}
				},


				/* Event Selection
	------------------------------------------------------------------------------------------------------------------*/


				selectEventInstance: function (eventInstance) {
					if (
						!this.selectedEventInstance ||
						this.selectedEventInstance !== eventInstance
					) {
						this.unselectEventInstance();

						this.getEventSegs().forEach(function (seg) {
							if (
								seg.footprint.eventInstance === eventInstance &&
								seg.el // necessary?
							) {
								seg.el.addClass('fc-selected');
							}
						});

						this.selectedEventInstance = eventInstance;
					}
				},


				unselectEventInstance: function () {
					if (this.selectedEventInstance) {

						this.getEventSegs().forEach(function (seg) {
							if (seg.el) { // necessary?
								seg.el.removeClass('fc-selected');
							}
						});

						this.selectedEventInstance = null;
					}
				},


				isEventDefSelected: function (eventDef) {
					// event references might change on refetchEvents(), while selectedEventInstance doesn't,
					// so compare IDs
					return this.selectedEventInstance && this.selectedEventInstance.def.id === eventDef.id;
				},


				/* Mouse / Touch Unselecting (time range & event unselection)
	------------------------------------------------------------------------------------------------------------------*/
				// TODO: move consistently to down/start or up/end?
				// TODO: don't kill previous selection if touch scrolling


				handleDocumentMousedown: function (ev) {
					if (isPrimaryMouseButton(ev)) {
						this.processUnselect(ev);
					}
				},


				processUnselect: function (ev) {
					this.processRangeUnselect(ev);
					this.processEventUnselect(ev);
				},


				processRangeUnselect: function (ev) {
					var ignore;

					// is there a time-range selection?
					if (this.isSelected && this.opt('unselectAuto')) {
						// only unselect if the clicked element is not identical to or inside of an 'unselectCancel' element
						ignore = this.opt('unselectCancel');
						if (!ignore || !$(ev.target).closest(ignore).length) {
							this.unselect(ev);
						}
					}
				},


				processEventUnselect: function (ev) {
					if (this.selectedEventInstance) {
						if (!$(ev.target).closest('.fc-selected').length) {
							this.unselectEventInstance();
						}
					}
				},


				/* Triggers
	------------------------------------------------------------------------------------------------------------------*/


				triggerBaseRendered: function () {
					this.publiclyTrigger('viewRender', {
						context: this,
						args: [this, this.el]
					});
				},


				triggerBaseUnrendered: function () {
					this.publiclyTrigger('viewDestroy', {
						context: this,
						args: [this, this.el]
					});
				},


				// Triggers handlers to 'dayClick'
				// Span has start/end of the clicked area. Only the start is useful.
				triggerDayClick: function (footprint, dayEl, ev) {
					var dateProfile = this.calendar.footprintToDateProfile(footprint); // abuse of "Event"DateProfile?

					this.publiclyTrigger('dayClick', {
						context: dayEl,
						args: [dateProfile.start, ev, this]
					});
				}

			});


			View.watch('displayingDates', ['isInDom', 'dateProfile'], function (deps) {
				this.requestDateRender(deps.dateProfile);
			}, function () {
				this.requestDateUnrender();
			});


			View.watch('displayingBusinessHours', ['displayingDates', 'businessHourGenerator'], function (deps) {
				this.requestBusinessHoursRender(deps.businessHourGenerator);
			}, function () {
				this.requestBusinessHoursUnrender();
			});


			View.watch('initialEvents', ['dateProfile'], function (deps) {
				return this.fetchInitialEvents(deps.dateProfile);
			});


			View.watch('bindingEvents', ['initialEvents'], function (deps) {
				this.setEvents(deps.initialEvents);
				this.bindEventChanges();
			}, function () {
				this.unbindEventChanges();
				this.unsetEvents();
			});


			View.watch('displayingEvents', ['displayingDates', 'hasEvents'], function () {
				this.requestEventsRender(this.get('currentEvents'));
			}, function () {
				this.requestEventsUnrender();
			});


			View.watch('title', ['dateProfile'], function (deps) {
				return (this.title = this.computeTitle(deps.dateProfile)); // assign to View for legacy reasons
			});


			View.watch('legacyDateProps', ['dateProfile'], function (deps) {
				var calendar = this.calendar;
				var dateProfile = deps.dateProfile;

				// DEPRECATED, but we need to keep it updated...
				this.start = calendar.msToMoment(dateProfile.activeUnzonedRange.startMs, dateProfile.isRangeAllDay);
				this.end = calendar.msToMoment(dateProfile.activeUnzonedRange.endMs, dateProfile.isRangeAllDay);
				this.intervalStart = calendar.msToMoment(dateProfile.currentUnzonedRange.startMs, dateProfile.isRangeAllDay);
				this.intervalEnd = calendar.msToMoment(dateProfile.currentUnzonedRange.endMs, dateProfile.isRangeAllDay);
			});

			;
			;

			View.mixin({

				usesMinMaxTime: false, // whether minTime/maxTime will affect the activeUnzonedRange. Views must opt-in.

				// DEPRECATED
				start: null, // use activeUnzonedRange
				end: null, // use activeUnzonedRange
				intervalStart: null, // use currentUnzonedRange
				intervalEnd: null, // use currentUnzonedRange


				/* Date Range Computation
	------------------------------------------------------------------------------------------------------------------*/


				// Builds a structure with info about what the dates/ranges will be for the "prev" view.
				buildPrevDateProfile: function (date) {
					var dateProfile = this.get('dateProfile');
					var prevDate = date.clone().startOf(dateProfile.currentRangeUnit)
						.subtract(dateProfile.dateIncrement);

					return this.buildDateProfile(prevDate, -1);
				},


				// Builds a structure with info about what the dates/ranges will be for the "next" view.
				buildNextDateProfile: function (date) {
					var dateProfile = this.get('dateProfile');
					var nextDate = date.clone().startOf(dateProfile.currentRangeUnit)
						.add(dateProfile.dateIncrement);

					return this.buildDateProfile(nextDate, 1);
				},


				// Builds a structure holding dates/ranges for rendering around the given date.
				// Optional direction param indicates whether the date is being incremented/decremented
				// from its previous value. decremented = -1, incremented = 1 (default).
				buildDateProfile: function (date, direction, forceToValid) {
					var isDateAllDay = !date.hasTime();
					var validUnzonedRange;
					var minTime = null;
					var maxTime = null;
					var currentInfo;
					var isRangeAllDay;
					var renderUnzonedRange;
					var activeUnzonedRange;
					var isValid;

					validUnzonedRange = this.buildValidRange();
					validUnzonedRange = this.trimHiddenDays(validUnzonedRange);

					if (forceToValid) {
						date = this.calendar.msToUtcMoment(
							validUnzonedRange.constrainDate(date), // returns MS
							isDateAllDay
						);
					}

					currentInfo = this.buildCurrentRangeInfo(date, direction);
					isRangeAllDay = /^(year|month|week|day)$/.test(currentInfo.unit);
					renderUnzonedRange = this.buildRenderRange(
						this.trimHiddenDays(currentInfo.unzonedRange),
						currentInfo.unit,
						isRangeAllDay
					);
					renderUnzonedRange = this.trimHiddenDays(renderUnzonedRange);
					activeUnzonedRange = renderUnzonedRange.clone();

					if (!this.opt('showNonCurrentDates')) {
						activeUnzonedRange = activeUnzonedRange.intersect(currentInfo.unzonedRange);
					}

					minTime = moment.duration(this.opt('minTime'));
					maxTime = moment.duration(this.opt('maxTime'));
					activeUnzonedRange = this.adjustActiveRange(activeUnzonedRange, minTime, maxTime);
					activeUnzonedRange = activeUnzonedRange.intersect(validUnzonedRange); // might return null

					if (activeUnzonedRange) {
						date = this.calendar.msToUtcMoment(
							activeUnzonedRange.constrainDate(date), // returns MS
							isDateAllDay
						);
					}

					// it's invalid if the originally requested date is not contained,
					// or if the range is completely outside of the valid range.
					isValid = currentInfo.unzonedRange.intersectsWith(validUnzonedRange);

					return {
						// constraint for where prev/next operations can go and where events can be dragged/resized to.
						// an object with optional start and end properties.
						validUnzonedRange: validUnzonedRange,

						// range the view is formally responsible for.
						// for example, a month view might have 1st-31st, excluding padded dates
						currentUnzonedRange: currentInfo.unzonedRange,

						// name of largest unit being displayed, like "month" or "week"
						currentRangeUnit: currentInfo.unit,

						isRangeAllDay: isRangeAllDay,

						// dates that display events and accept drag-n-drop
						// will be `null` if no dates accept events
						activeUnzonedRange: activeUnzonedRange,

						// date range with a rendered skeleton
						// includes not-active days that need some sort of DOM
						renderUnzonedRange: renderUnzonedRange,

						// Duration object that denotes the first visible time of any given day
						minTime: minTime,

						// Duration object that denotes the exclusive visible end time of any given day
						maxTime: maxTime,

						isValid: isValid,

						date: date,

						// how far the current date will move for a prev/next operation
						dateIncrement: this.buildDateIncrement(currentInfo.duration)
						// pass a fallback (might be null) ^
					};
				},


				// Builds an object with optional start/end properties.
				// Indicates the minimum/maximum dates to display.
				// not responsible for trimming hidden days.
				buildValidRange: function () {
					return this.getUnzonedRangeOption('validRange', this.calendar.getNow()) ||
						new UnzonedRange(); // completely open-ended
				},


				// Builds a structure with info about the "current" range, the range that is
				// highlighted as being the current month for example.
				// See buildDateProfile for a description of `direction`.
				// Guaranteed to have `range` and `unit` properties. `duration` is optional.
				// TODO: accept a MS-time instead of a moment `date`?
				buildCurrentRangeInfo: function (date, direction) {
					var duration = null;
					var unit = null;
					var unzonedRange = null;
					var dayCount;

					if (this.viewSpec.duration) {
						duration = this.viewSpec.duration;
						unit = this.viewSpec.durationUnit;
						unzonedRange = this.buildRangeFromDuration(date, direction, duration, unit);
					}
					else if ((dayCount = this.opt('dayCount'))) {
						unit = 'day';
						unzonedRange = this.buildRangeFromDayCount(date, direction, dayCount);
					}
					else if ((unzonedRange = this.buildCustomVisibleRange(date))) {
						unit = computeGreatestUnit(unzonedRange.getStart(), unzonedRange.getEnd());
					}
					else {
						duration = this.getFallbackDuration();
						unit = computeGreatestUnit(duration);
						unzonedRange = this.buildRangeFromDuration(date, direction, duration, unit);
					}

					return {duration: duration, unit: unit, unzonedRange: unzonedRange};
				},


				getFallbackDuration: function () {
					return moment.duration({days: 1});
				},


				// Returns a new activeUnzonedRange to have time values (un-ambiguate)
				// minTime or maxTime causes the range to expand.
				adjustActiveRange: function (unzonedRange, minTime, maxTime) {
					var start = unzonedRange.getStart();
					var end = unzonedRange.getEnd();

					if (this.usesMinMaxTime) {

						if (minTime < 0) {
							start.time(0).add(minTime);
						}

						if (maxTime > 24 * 60 * 60 * 1000) { // beyond 24 hours?
							end.time(maxTime - (24 * 60 * 60 * 1000));
						}
					}

					return new UnzonedRange(start, end);
				},


				// Builds the "current" range when it is specified as an explicit duration.
				// `unit` is the already-computed computeGreatestUnit value of duration.
				// TODO: accept a MS-time instead of a moment `date`?
				buildRangeFromDuration: function (date, direction, duration, unit) {
					var alignment = this.opt('dateAlignment');
					var start = date.clone();
					var end;
					var dateIncrementInput;
					var dateIncrementDuration;

					// if the view displays a single day or smaller
					if (duration.as('days') <= 1) {
						if (this.isHiddenDay(start)) {
							start = this.skipHiddenDays(start, direction);
							start.startOf('day');
						}
					}

					// compute what the alignment should be
					if (!alignment) {
						dateIncrementInput = this.opt('dateIncrement');

						if (dateIncrementInput) {
							dateIncrementDuration = moment.duration(dateIncrementInput);

							// use the smaller of the two units
							if (dateIncrementDuration < duration) {
								alignment = computeDurationGreatestUnit(dateIncrementDuration, dateIncrementInput);
							}
							else {
								alignment = unit;
							}
						}
						else {
							alignment = unit;
						}
					}

					start.startOf(alignment);
					end = start.clone().add(duration);

					return new UnzonedRange(start, end);
				},


				// Builds the "current" range when a dayCount is specified.
				// TODO: accept a MS-time instead of a moment `date`?
				buildRangeFromDayCount: function (date, direction, dayCount) {
					var customAlignment = this.opt('dateAlignment');
					var runningCount = 0;
					var start = date.clone();
					var end;

					if (customAlignment) {
						start.startOf(customAlignment);
					}

					start.startOf('day');
					start = this.skipHiddenDays(start, direction);

					end = start.clone();
					do {
						end.add(1, 'day');
						if (!this.isHiddenDay(end)) {
							runningCount++;
						}
					} while (runningCount < dayCount);

					return new UnzonedRange(start, end);
				},


				// Builds a normalized range object for the "visible" range,
				// which is a way to define the currentUnzonedRange and activeUnzonedRange at the same time.
				// TODO: accept a MS-time instead of a moment `date`?
				buildCustomVisibleRange: function (date) {
					var visibleUnzonedRange = this.getUnzonedRangeOption(
						'visibleRange',
						this.calendar.applyTimezone(date) // correct zone. also generates new obj that avoids mutations
					);

					if (visibleUnzonedRange && (visibleUnzonedRange.startMs === null || visibleUnzonedRange.endMs === null)) {
						return null;
					}

					return visibleUnzonedRange;
				},


				// Computes the range that will represent the element/cells for *rendering*,
				// but which may have voided days/times.
				// not responsible for trimming hidden days.
				buildRenderRange: function (currentUnzonedRange, currentRangeUnit, isRangeAllDay) {
					return currentUnzonedRange.clone();
				},


				// Compute the duration value that should be added/substracted to the current date
				// when a prev/next operation happens.
				buildDateIncrement: function (fallback) {
					var dateIncrementInput = this.opt('dateIncrement');
					var customAlignment;

					if (dateIncrementInput) {
						return moment.duration(dateIncrementInput);
					}
					else if ((customAlignment = this.opt('dateAlignment'))) {
						return moment.duration(1, customAlignment);
					}
					else if (fallback) {
						return fallback;
					}
					else {
						return moment.duration({days: 1});
					}
				},


				// Remove days from the beginning and end of the range that are computed as hidden.
				trimHiddenDays: function (inputUnzonedRange) {
					var start = inputUnzonedRange.getStart();
					var end = inputUnzonedRange.getEnd();

					if (start) {
						start = this.skipHiddenDays(start);
					}

					if (end) {
						end = this.skipHiddenDays(end, -1, true);
					}

					return new UnzonedRange(start, end);
				},


				// For DateComponent::getDayClasses
				isDateInOtherMonth: function (date, dateProfile) {
					return false;
				},


				// Arguments after name will be forwarded to a hypothetical function value
				// WARNING: passed-in arguments will be given to generator functions as-is and can cause side-effects.
				// Always clone your objects if you fear mutation.
				getUnzonedRangeOption: function (name) {
					var val = this.opt(name);

					if (typeof val === 'function') {
						val = val.apply(
							null,
							Array.prototype.slice.call(arguments, 1)
						);
					}

					if (val) {
						return this.calendar.parseUnzonedRange(val);
					}
				},


				/* Hidden Days
	------------------------------------------------------------------------------------------------------------------*/


				// Initializes internal variables related to calculating hidden days-of-week
				initHiddenDays: function () {
					var hiddenDays = this.opt('hiddenDays') || []; // array of day-of-week indices that are hidden
					var isHiddenDayHash = []; // is the day-of-week hidden? (hash with day-of-week-index -> bool)
					var dayCnt = 0;
					var i;

					if (this.opt('weekends') === false) {
						hiddenDays.push(0, 6); // 0=sunday, 6=saturday
					}

					for (i = 0; i < 7; i++) {
						if (
							!(isHiddenDayHash[i] = $.inArray(i, hiddenDays) !== -1)
						) {
							dayCnt++;
						}
					}

					if (!dayCnt) {
						throw 'invalid hiddenDays'; // all days were hidden? bad.
					}

					this.isHiddenDayHash = isHiddenDayHash;
				},


				// Is the current day hidden?
				// `day` is a day-of-week index (0-6), or a Moment
				isHiddenDay: function (day) {
					if (moment.isMoment(day)) {
						day = day.day();
					}
					return this.isHiddenDayHash[day];
				},


				// Incrementing the current day until it is no longer a hidden day, returning a copy.
				// DOES NOT CONSIDER validUnzonedRange!
				// If the initial value of `date` is not a hidden day, don't do anything.
				// Pass `isExclusive` as `true` if you are dealing with an end date.
				// `inc` defaults to `1` (increment one day forward each time)
				skipHiddenDays: function (date, inc, isExclusive) {
					var out = date.clone();
					inc = inc || 1;
					while (
						this.isHiddenDayHash[(out.day() + (isExclusive ? inc : 0) + 7) % 7]
						) {
						out.add(inc, 'days');
					}
					return out;
				}

			});

			;
			;

			/* Toolbar with buttons and title
----------------------------------------------------------------------------------------------------------------------*/

			function Toolbar(calendar, toolbarOptions) {
				var t = this;

				// exports
				t.setToolbarOptions = setToolbarOptions;
				t.render = render;
				t.removeElement = removeElement;
				t.updateTitle = updateTitle;
				t.activateButton = activateButton;
				t.deactivateButton = deactivateButton;
				t.disableButton = disableButton;
				t.enableButton = enableButton;
				t.getViewsWithButtons = getViewsWithButtons;
				t.el = null; // mirrors local `el`

				// locals
				var el;
				var viewsWithButtons = [];

				// method to update toolbar-specific options, not calendar-wide options
				function setToolbarOptions(newToolbarOptions) {
					toolbarOptions = newToolbarOptions;
				}

				// can be called repeatedly and will rerender
				function render() {
					var sections = toolbarOptions.layout;

					if (sections) {
						if (!el) {
							el = this.el = $("<div class='fc-toolbar " + toolbarOptions.extraClasses + "'/>");
						}
						else {
							el.empty();
						}
						el.append(renderSection('left'))
							.append(renderSection('right'))
							.append(renderSection('center'))
							.append('<div class="fc-clear"/>');
					}
					else {
						removeElement();
					}
				}


				function removeElement() {
					if (el) {
						el.remove();
						el = t.el = null;
					}
				}


				function renderSection(position) {
					var theme = calendar.theme;
					var sectionEl = $('<div class="fc-' + position + '"/>');
					var buttonStr = toolbarOptions.layout[position];
					var calendarCustomButtons = calendar.opt('customButtons') || {};
					var calendarButtonTextOverrides = calendar.overrides.buttonText || {};
					var calendarButtonText = calendar.opt('buttonText') || {};

					if (buttonStr) {
						$.each(buttonStr.split(' '), function (i) {
							var groupChildren = $();
							var isOnlyButtons = true;
							var groupEl;

							$.each(this.split(','), function (j, buttonName) {
								var customButtonProps;
								var viewSpec;
								var buttonClick;
								var buttonIcon; // only one of these will be set
								var buttonText; // "
								var buttonInnerHtml;
								var buttonClasses;
								var buttonEl;

								if (buttonName == 'title') {
									groupChildren = groupChildren.add($('<h2>&nbsp;</h2>')); // we always want it to take up height
									isOnlyButtons = false;
								}
								else {

									if ((customButtonProps = calendarCustomButtons[buttonName])) {
										buttonClick = function (ev) {
											if (customButtonProps.click) {
												customButtonProps.click.call(buttonEl[0], ev);
											}
										};
										(buttonIcon = theme.getCustomButtonIconClass(customButtonProps)) ||
										(buttonIcon = theme.getIconClass(buttonName)) ||
										(buttonText = customButtonProps.text); // jshint ignore:line
									}
									else if ((viewSpec = calendar.getViewSpec(buttonName))) {
										viewsWithButtons.push(buttonName);
										buttonClick = function () {
											calendar.changeView(buttonName);
										};
										(buttonText = viewSpec.buttonTextOverride) ||
										(buttonIcon = theme.getIconClass(buttonName)) ||
										(buttonText = viewSpec.buttonTextDefault); // jshint ignore:line
									}
									else if (calendar[buttonName]) { // a calendar method
										buttonClick = function () {
											calendar[buttonName]();
										};
										(buttonText = calendarButtonTextOverrides[buttonName]) ||
										(buttonIcon = theme.getIconClass(buttonName)) ||
										(buttonText = calendarButtonText[buttonName]); // jshint ignore:line
										//            ^ everything else is considered default
									}

									if (buttonClick) {

										buttonClasses = [
											'fc-' + buttonName + '-button',
											theme.getClass('button'),
											theme.getClass('stateDefault')
										];

										if (buttonText) {
											buttonInnerHtml = htmlEscape(buttonText);
										}
										else if (buttonIcon) {
											buttonInnerHtml = "<span class='" + buttonIcon + "'></span>";
										}

										buttonEl = $( // type="button" so that it doesn't submit a form
											'<button type="button" class="' + buttonClasses.join(' ') + '">' +
											buttonInnerHtml +
											'</button>'
										)
											.click(function (ev) {
												// don't process clicks for disabled buttons
												if (!buttonEl.hasClass(theme.getClass('stateDisabled'))) {

													buttonClick(ev);

													// after the click action, if the button becomes the "active" tab, or disabled,
													// it should never have a hover class, so remove it now.
													if (
														buttonEl.hasClass(theme.getClass('stateActive')) ||
														buttonEl.hasClass(theme.getClass('stateDisabled'))
													) {
														buttonEl.removeClass(theme.getClass('stateHover'));
													}
												}
											})
											.mousedown(function () {
												// the *down* effect (mouse pressed in).
												// only on buttons that are not the "active" tab, or disabled
												buttonEl
													.not('.' + theme.getClass('stateActive'))
													.not('.' + theme.getClass('stateDisabled'))
													.addClass(theme.getClass('stateDown'));
											})
											.mouseup(function () {
												// undo the *down* effect
												buttonEl.removeClass(theme.getClass('stateDown'));
											})
											.hover(
												function () {
													// the *hover* effect.
													// only on buttons that are not the "active" tab, or disabled
													buttonEl
														.not('.' + theme.getClass('stateActive'))
														.not('.' + theme.getClass('stateDisabled'))
														.addClass(theme.getClass('stateHover'));
												},
												function () {
													// undo the *hover* effect
													buttonEl
														.removeClass(theme.getClass('stateHover'))
														.removeClass(theme.getClass('stateDown')); // if mouseleave happens before mouseup
												}
											);

										groupChildren = groupChildren.add(buttonEl);
									}
								}
							});

							if (isOnlyButtons) {
								groupChildren
									.first().addClass(theme.getClass('cornerLeft')).end()
									.last().addClass(theme.getClass('cornerRight')).end();
							}

							if (groupChildren.length > 1) {
								groupEl = $('<div/>');
								if (isOnlyButtons) {
									groupEl.addClass(theme.getClass('buttonGroup'));
								}
								groupEl.append(groupChildren);
								sectionEl.append(groupEl);
							}
							else {
								sectionEl.append(groupChildren); // 1 or 0 children
							}
						});
					}

					return sectionEl;
				}


				function updateTitle(text) {
					if (el) {
						el.find('h2').text(text);
					}
				}


				function activateButton(buttonName) {
					if (el) {
						el.find('.fc-' + buttonName + '-button')
							.addClass(calendar.theme.getClass('stateActive'));
					}
				}


				function deactivateButton(buttonName) {
					if (el) {
						el.find('.fc-' + buttonName + '-button')
							.removeClass(calendar.theme.getClass('stateActive'));
					}
				}


				function disableButton(buttonName) {
					if (el) {
						el.find('.fc-' + buttonName + '-button')
							.prop('disabled', true)
							.addClass(calendar.theme.getClass('stateDisabled'));
					}
				}


				function enableButton(buttonName) {
					if (el) {
						el.find('.fc-' + buttonName + '-button')
							.prop('disabled', false)
							.removeClass(calendar.theme.getClass('stateDisabled'));
					}
				}


				function getViewsWithButtons() {
					return viewsWithButtons;
				}

			}

			;
			;

			var Calendar = FC.Calendar = Class.extend(EmitterMixin, ListenerMixin, {

				view: null, // current View object
				viewsByType: null, // holds all instantiated view instances, current or not
				currentDate: null, // unzoned moment. private (public API should use getDate instead)
				theme: null,
				businessHourGenerator: null,
				loadingLevel: 0, // number of simultaneous loading tasks


				constructor: function (el, overrides) {

					// declare the current calendar instance relies on GlobalEmitter. needed for garbage collection.
					// unneeded() is called in destroy.
					GlobalEmitter.needed();

					this.el = el;
					this.viewsByType = {};
					this.viewSpecCache = {};

					this.initOptionsInternals(overrides);
					this.initMomentInternals(); // needs to happen after options hash initialized
					this.initCurrentDate();
					this.initEventManager();

					this.constructed();
				},


				// useful for monkeypatching. TODO: BaseClass?
				constructed: function () {
				},


				// Public API
				// -----------------------------------------------------------------------------------------------------------------


				getView: function () {
					return this.view;
				},


				publiclyTrigger: function (name, triggerInfo) {
					var optHandler = this.opt(name);
					var context;
					var args;

					if ($.isPlainObject(triggerInfo)) {
						context = triggerInfo.context;
						args = triggerInfo.args;
					}
					else if ($.isArray(triggerInfo)) {
						args = triggerInfo;
					}

					if (context == null) {
						context = this.el[0]; // fallback context
					}

					if (!args) {
						args = [];
					}

					this.triggerWith(name, context, args); // Emitter's method

					if (optHandler) {
						return optHandler.apply(context, args);
					}
				},


				hasPublicHandlers: function (name) {
					return this.hasHandlers(name) ||
						this.opt(name); // handler specified in options
				},


				// View
				// -----------------------------------------------------------------------------------------------------------------


				// Given a view name for a custom view or a standard view, creates a ready-to-go View object
				instantiateView: function (viewType) {
					var spec = this.getViewSpec(viewType);

					return new spec['class'](this, spec);
				},


				// Returns a boolean about whether the view is okay to instantiate at some point
				isValidViewType: function (viewType) {
					return Boolean(this.getViewSpec(viewType));
				},


				changeView: function (viewName, dateOrRange) {

					if (dateOrRange) {

						if (dateOrRange.start && dateOrRange.end) { // a range
							this.recordOptionOverrides({ // will not rerender
								visibleRange: dateOrRange
							});
						}
						else { // a date
							this.currentDate = this.moment(dateOrRange).stripZone(); // just like gotoDate
						}
					}

					this.renderView(viewName);
				},


				// Forces navigation to a view for the given date.
				// `viewType` can be a specific view name or a generic one like "week" or "day".
				zoomTo: function (newDate, viewType) {
					var spec;

					viewType = viewType || 'day'; // day is default zoom
					spec = this.getViewSpec(viewType) || this.getUnitViewSpec(viewType);

					this.currentDate = newDate.clone();
					this.renderView(spec ? spec.type : null);
				},


				// Current Date
				// -----------------------------------------------------------------------------------------------------------------


				initCurrentDate: function () {
					var defaultDateInput = this.opt('defaultDate');

					// compute the initial ambig-timezone date
					if (defaultDateInput != null) {
						this.currentDate = this.moment(defaultDateInput).stripZone();
					}
					else {
						this.currentDate = this.getNow(); // getNow already returns unzoned
					}
				},


				prev: function () {
					var prevInfo = this.view.buildPrevDateProfile(this.currentDate);

					if (prevInfo.isValid) {
						this.currentDate = prevInfo.date;
						this.renderView();
					}
				},


				next: function () {
					var nextInfo = this.view.buildNextDateProfile(this.currentDate);

					if (nextInfo.isValid) {
						this.currentDate = nextInfo.date;
						this.renderView();
					}
				},


				prevYear: function () {
					this.currentDate.add(-1, 'years');
					this.renderView();
				},


				nextYear: function () {
					this.currentDate.add(1, 'years');
					this.renderView();
				},


				today: function () {
					this.currentDate = this.getNow(); // should deny like prev/next?
					this.renderView();
				},


				gotoDate: function (zonedDateInput) {
					this.currentDate = this.moment(zonedDateInput).stripZone();
					this.renderView();
				},


				incrementDate: function (delta) {
					this.currentDate.add(moment.duration(delta));
					this.renderView();
				},


				// for external API
				getDate: function () {
					return this.applyTimezone(this.currentDate); // infuse the calendar's timezone
				},


				// Loading Triggering
				// -----------------------------------------------------------------------------------------------------------------


				// Should be called when any type of async data fetching begins
				pushLoading: function () {
					if (!(this.loadingLevel++)) {
						this.publiclyTrigger('loading', [true, this.view]);
					}
				},


				// Should be called when any type of async data fetching completes
				popLoading: function () {
					if (!(--this.loadingLevel)) {
						this.publiclyTrigger('loading', [false, this.view]);
					}
				},


				// Selection
				// -----------------------------------------------------------------------------------------------------------------


				// this public method receives start/end dates in any format, with any timezone
				select: function (zonedStartInput, zonedEndInput) {
					this.view.select(
						this.buildSelectFootprint.apply(this, arguments)
					);
				},


				unselect: function () { // safe to be called before renderView
					if (this.view) {
						this.view.unselect();
					}
				},


				// Given arguments to the select method in the API, returns a span (unzoned start/end and other info)
				buildSelectFootprint: function (zonedStartInput, zonedEndInput) {
					var start = this.moment(zonedStartInput).stripZone();
					var end;

					if (zonedEndInput) {
						end = this.moment(zonedEndInput).stripZone();
					}
					else if (start.hasTime()) {
						end = start.clone().add(this.defaultTimedEventDuration);
					}
					else {
						end = start.clone().add(this.defaultAllDayEventDuration);
					}

					return new ComponentFootprint(
						new UnzonedRange(start, end),
						!start.hasTime()
					);
				},


				// Misc
				// -----------------------------------------------------------------------------------------------------------------


				// will return `null` if invalid range
				parseUnzonedRange: function (rangeInput) {
					var start = null;
					var end = null;

					if (rangeInput.start) {
						start = this.moment(rangeInput.start).stripZone();
					}

					if (rangeInput.end) {
						end = this.moment(rangeInput.end).stripZone();
					}

					if (!start && !end) {
						return null;
					}

					if (start && end && end.isBefore(start)) {
						return null;
					}

					return new UnzonedRange(start, end);
				},


				rerenderEvents: function () { // API method. destroys old events if previously rendered.
					this.view.flash('displayingEvents');
				},


				initEventManager: function () {
					var _this = this;
					var eventManager = new EventManager(this);
					var rawSources = this.opt('eventSources') || [];
					var singleRawSource = this.opt('events');

					this.eventManager = eventManager;

					if (singleRawSource) {
						rawSources.unshift(singleRawSource);
					}

					eventManager.on('release', function (eventsPayload) {
						_this.trigger('eventsReset', eventsPayload);
					});

					eventManager.freeze();

					rawSources.forEach(function (rawSource) {
						var source = EventSourceParser.parse(rawSource, _this);

						if (source) {
							eventManager.addSource(source);
						}
					});

					eventManager.thaw();
				},


				requestEvents: function (start, end) {
					return this.eventManager.requestEvents(
						start,
						end,
						this.opt('timezone'),
						!this.opt('lazyFetching')
					);
				}

			});

			;
			;
			/*
Options binding/triggering system.
*/
			Calendar.mixin({

				dirDefaults: null, // option defaults related to LTR or RTL
				localeDefaults: null, // option defaults related to current locale
				overrides: null, // option overrides given to the fullCalendar constructor
				dynamicOverrides: null, // options set with dynamic setter method. higher precedence than view overrides.
				optionsModel: null, // all defaults combined with overrides


				initOptionsInternals: function (overrides) {
					this.overrides = $.extend({}, overrides); // make a copy
					this.dynamicOverrides = {};
					this.optionsModel = new Model();

					this.populateOptionsHash();
				},


				// public getter/setter
				option: function (name, value) {
					var newOptionHash;

					if (typeof name === 'string') {
						if (value === undefined) { // getter
							return this.optionsModel.get(name);
						}
						else { // setter for individual option
							newOptionHash = {};
							newOptionHash[name] = value;
							this.setOptions(newOptionHash);
						}
					}
					else if (typeof name === 'object') { // compound setter with object input
						this.setOptions(name);
					}
				},


				// private getter
				opt: function (name) {
					return this.optionsModel.get(name);
				},


				setOptions: function (newOptionHash) {
					var optionCnt = 0;
					var optionName;

					this.recordOptionOverrides(newOptionHash); // will trigger optionsModel watchers

					for (optionName in newOptionHash) {
						optionCnt++;
					}

					// special-case handling of single option change.
					// if only one option change, `optionName` will be its name.
					if (optionCnt === 1) {
						if (optionName === 'height' || optionName === 'contentHeight' || optionName === 'aspectRatio') {
							this.updateViewSize(true); // isResize=true
							return;
						}
						else if (optionName === 'defaultDate') {
							return; // can't change date this way. use gotoDate instead
						}
						else if (optionName === 'businessHours') {
							return; // optionsModel already reacts to this
						}
						else if (optionName === 'timezone') {
							this.view.flash('initialEvents');
							return;
						}
					}

					// catch-all. rerender the header and footer and rebuild/rerender the current view
					this.renderHeader();
					this.renderFooter();

					// even non-current views will be affected by this option change. do before rerender
					// TODO: detangle
					this.viewsByType = {};

					this.reinitView();
				},


				// Computes the flattened options hash for the calendar and assigns to `this.options`.
				// Assumes this.overrides and this.dynamicOverrides have already been initialized.
				populateOptionsHash: function () {
					var locale, localeDefaults;
					var isRTL, dirDefaults;
					var rawOptions;

					locale = firstDefined( // explicit locale option given?
						this.dynamicOverrides.locale,
						this.overrides.locale
					);
					localeDefaults = localeOptionHash[locale];
					if (!localeDefaults) { // explicit locale option not given or invalid?
						locale = Calendar.defaults.locale;
						localeDefaults = localeOptionHash[locale] || {};
					}

					isRTL = firstDefined( // based on options computed so far, is direction RTL?
						this.dynamicOverrides.isRTL,
						this.overrides.isRTL,
						localeDefaults.isRTL,
						Calendar.defaults.isRTL
					);
					dirDefaults = isRTL ? Calendar.rtlDefaults : {};

					this.dirDefaults = dirDefaults;
					this.localeDefaults = localeDefaults;

					rawOptions = mergeOptions([ // merge defaults and overrides. lowest to highest precedence
						Calendar.defaults, // global defaults
						dirDefaults,
						localeDefaults,
						this.overrides,
						this.dynamicOverrides
					]);
					populateInstanceComputableOptions(rawOptions); // fill in gaps with computed options

					this.optionsModel.reset(rawOptions);
				},


				// stores the new options internally, but does not rerender anything.
				recordOptionOverrides: function (newOptionHash) {
					var optionName;

					for (optionName in newOptionHash) {
						this.dynamicOverrides[optionName] = newOptionHash[optionName];
					}

					this.viewSpecCache = {}; // the dynamic override invalidates the options in this cache, so just clear it
					this.populateOptionsHash(); // this.options needs to be recomputed after the dynamic override
				}

			});

			;
			;

			Calendar.mixin({

				defaultAllDayEventDuration: null,
				defaultTimedEventDuration: null,
				localeData: null,


				initMomentInternals: function () {
					var _this = this;

					this.defaultAllDayEventDuration = moment.duration(this.opt('defaultAllDayEventDuration'));
					this.defaultTimedEventDuration = moment.duration(this.opt('defaultTimedEventDuration'));

					// Called immediately, and when any of the options change.
					// Happens before any internal objects rebuild or rerender, because this is very core.
					this.optionsModel.watch('buildingMomentLocale', [
						'?locale', '?monthNames', '?monthNamesShort', '?dayNames', '?dayNamesShort',
						'?firstDay', '?weekNumberCalculation'
					], function (opts) {
						var weekNumberCalculation = opts.weekNumberCalculation;
						var firstDay = opts.firstDay;
						var _week;

						// normalize
						if (weekNumberCalculation === 'iso') {
							weekNumberCalculation = 'ISO'; // normalize
						}

						var localeData = Object.create( // make a cheap copy
							getMomentLocaleData(opts.locale) // will fall back to en
						);

						if (opts.monthNames) {
							localeData._months = opts.monthNames;
						}
						if (opts.monthNamesShort) {
							localeData._monthsShort = opts.monthNamesShort;
						}
						if (opts.dayNames) {
							localeData._weekdays = opts.dayNames;
						}
						if (opts.dayNamesShort) {
							localeData._weekdaysShort = opts.dayNamesShort;
						}

						if (firstDay == null && weekNumberCalculation === 'ISO') {
							firstDay = 1;
						}
						if (firstDay != null) {
							_week = Object.create(localeData._week); // _week: { dow: # }
							_week.dow = firstDay;
							localeData._week = _week;
						}

						if ( // whitelist certain kinds of input
						weekNumberCalculation === 'ISO' ||
						weekNumberCalculation === 'local' ||
						typeof weekNumberCalculation === 'function'
						) {
							localeData._fullCalendar_weekCalc = weekNumberCalculation; // moment-ext will know what to do with it
						}

						_this.localeData = localeData;

						// If the internal current date object already exists, move to new locale.
						// We do NOT need to do this technique for event dates, because this happens when converting to "segments".
						if (_this.currentDate) {
							_this.localizeMoment(_this.currentDate); // sets to localeData
						}
					});
				},


				// Builds a moment using the settings of the current calendar: timezone and locale.
				// Accepts anything the vanilla moment() constructor accepts.
				moment: function () {
					var mom;

					if (this.opt('timezone') === 'local') {
						mom = FC.moment.apply(null, arguments);

						// Force the moment to be local, because FC.moment doesn't guarantee it.
						if (mom.hasTime()) { // don't give ambiguously-timed moments a local zone
							mom.local();
						}
					}
					else if (this.opt('timezone') === 'UTC') {
						mom = FC.moment.utc.apply(null, arguments); // process as UTC
					}
					else {
						mom = FC.moment.parseZone.apply(null, arguments); // let the input decide the zone
					}

					this.localizeMoment(mom); // TODO

					return mom;
				},


				msToMoment: function (ms, forceAllDay) {
					var mom = FC.moment.utc(ms); // TODO: optimize by using Date.UTC

					if (forceAllDay) {
						mom.stripTime();
					}
					else {
						mom = this.applyTimezone(mom); // may or may not apply locale
					}

					this.localizeMoment(mom);

					return mom;
				},


				msToUtcMoment: function (ms, forceAllDay) {
					var mom = FC.moment.utc(ms); // TODO: optimize by using Date.UTC

					if (forceAllDay) {
						mom.stripTime();
					}

					this.localizeMoment(mom);

					return mom;
				},


				// Updates the given moment's locale settings to the current calendar locale settings.
				localizeMoment: function (mom) {
					mom._locale = this.localeData;
				},


				// Returns a boolean about whether or not the calendar knows how to calculate
				// the timezone offset of arbitrary dates in the current timezone.
				getIsAmbigTimezone: function () {
					return this.opt('timezone') !== 'local' && this.opt('timezone') !== 'UTC';
				},


				// Returns a copy of the given date in the current timezone. Has no effect on dates without times.
				applyTimezone: function (date) {
					if (!date.hasTime()) {
						return date.clone();
					}

					var zonedDate = this.moment(date.toArray());
					var timeAdjust = date.time() - zonedDate.time();
					var adjustedZonedDate;

					// Safari sometimes has problems with this coersion when near DST. Adjust if necessary. (bug #2396)
					if (timeAdjust) { // is the time result different than expected?
						adjustedZonedDate = zonedDate.clone().add(timeAdjust); // add milliseconds
						if (date.time() - adjustedZonedDate.time() === 0) { // does it match perfectly now?
							zonedDate = adjustedZonedDate;
						}
					}

					return zonedDate;
				},


				/*
	Assumes the footprint is non-open-ended.
	*/
				footprintToDateProfile: function (componentFootprint, ignoreEnd) {
					var start = FC.moment.utc(componentFootprint.unzonedRange.startMs);
					var end;

					if (!ignoreEnd) {
						end = FC.moment.utc(componentFootprint.unzonedRange.endMs);
					}

					if (componentFootprint.isAllDay) {
						start.stripTime();

						if (end) {
							end.stripTime();
						}
					}
					else {
						start = this.applyTimezone(start);

						if (end) {
							end = this.applyTimezone(end);
						}
					}

					return new EventDateProfile(start, end, this);
				},


				// Returns a moment for the current date, as defined by the client's computer or from the `now` option.
				// Will return an moment with an ambiguous timezone.
				getNow: function () {
					var now = this.opt('now');
					if (typeof now === 'function') {
						now = now();
					}
					return this.moment(now).stripZone();
				},


				// Produces a human-readable string for the given duration.
				// Side-effect: changes the locale of the given duration.
				humanizeDuration: function (duration) {
					return duration.locale(this.opt('locale')).humanize();
				},


				// Event-Specific Date Utilities. TODO: move
				// -----------------------------------------------------------------------------------------------------------------


				// Get an event's normalized end date. If not present, calculate it from the defaults.
				getEventEnd: function (event) {
					if (event.end) {
						return event.end.clone();
					}
					else {
						return this.getDefaultEventEnd(event.allDay, event.start);
					}
				},


				// Given an event's allDay status and start date, return what its fallback end date should be.
				// TODO: rename to computeDefaultEventEnd
				getDefaultEventEnd: function (allDay, zonedStart) {
					var end = zonedStart.clone();

					if (allDay) {
						end.stripTime().add(this.defaultAllDayEventDuration);
					}
					else {
						end.add(this.defaultTimedEventDuration);
					}

					if (this.getIsAmbigTimezone()) {
						end.stripZone(); // we don't know what the tzo should be
					}

					return end;
				}

			});

			;
			;

			Calendar.mixin({

				viewSpecCache: null, // cache of view definitions (initialized in Calendar.js)


				// Gets information about how to create a view. Will use a cache.
				getViewSpec: function (viewType) {
					var cache = this.viewSpecCache;

					return cache[viewType] || (cache[viewType] = this.buildViewSpec(viewType));
				},


				// Given a duration singular unit, like "week" or "day", finds a matching view spec.
				// Preference is given to views that have corresponding buttons.
				getUnitViewSpec: function (unit) {
					var viewTypes;
					var i;
					var spec;

					if ($.inArray(unit, unitsDesc) != -1) {

						// put views that have buttons first. there will be duplicates, but oh well
						viewTypes = this.header.getViewsWithButtons(); // TODO: include footer as well?
						$.each(FC.views, function (viewType) { // all views
							viewTypes.push(viewType);
						});

						for (i = 0; i < viewTypes.length; i++) {
							spec = this.getViewSpec(viewTypes[i]);
							if (spec) {
								if (spec.singleUnit == unit) {
									return spec;
								}
							}
						}
					}
				},


				// Builds an object with information on how to create a given view
				buildViewSpec: function (requestedViewType) {
					var viewOverrides = this.overrides.views || {};
					var specChain = []; // for the view. lowest to highest priority
					var defaultsChain = []; // for the view. lowest to highest priority
					var overridesChain = []; // for the view. lowest to highest priority
					var viewType = requestedViewType;
					var spec; // for the view
					var overrides; // for the view
					var durationInput;
					var duration;
					var unit;

					// iterate from the specific view definition to a more general one until we hit an actual View class
					while (viewType) {
						spec = fcViews[viewType];
						overrides = viewOverrides[viewType];
						viewType = null; // clear. might repopulate for another iteration

						if (typeof spec === 'function') { // TODO: deprecate
							spec = {'class': spec};
						}

						if (spec) {
							specChain.unshift(spec);
							defaultsChain.unshift(spec.defaults || {});
							durationInput = durationInput || spec.duration;
							viewType = viewType || spec.type;
						}

						if (overrides) {
							overridesChain.unshift(overrides); // view-specific option hashes have options at zero-level
							durationInput = durationInput || overrides.duration;
							viewType = viewType || overrides.type;
						}
					}

					spec = mergeProps(specChain);
					spec.type = requestedViewType;
					if (!spec['class']) {
						return false;
					}

					// fall back to top-level `duration` option
					durationInput = durationInput ||
						this.dynamicOverrides.duration ||
						this.overrides.duration;

					if (durationInput) {
						duration = moment.duration(durationInput);

						if (duration.valueOf()) { // valid?

							unit = computeDurationGreatestUnit(duration, durationInput);

							spec.duration = duration;
							spec.durationUnit = unit;

							// view is a single-unit duration, like "week" or "day"
							// incorporate options for this. lowest priority
							if (duration.as(unit) === 1) {
								spec.singleUnit = unit;
								overridesChain.unshift(viewOverrides[unit] || {});
							}
						}
					}

					spec.defaults = mergeOptions(defaultsChain);
					spec.overrides = mergeOptions(overridesChain);

					this.buildViewSpecOptions(spec);
					this.buildViewSpecButtonText(spec, requestedViewType);

					return spec;
				},


				// Builds and assigns a view spec's options object from its already-assigned defaults and overrides
				buildViewSpecOptions: function (spec) {
					spec.options = mergeOptions([ // lowest to highest priority
						Calendar.defaults, // global defaults
						spec.defaults, // view's defaults (from ViewSubclass.defaults)
						this.dirDefaults,
						this.localeDefaults, // locale and dir take precedence over view's defaults!
						this.overrides, // calendar's overrides (options given to constructor)
						spec.overrides, // view's overrides (view-specific options)
						this.dynamicOverrides // dynamically set via setter. highest precedence
					]);
					populateInstanceComputableOptions(spec.options);
				},


				// Computes and assigns a view spec's buttonText-related options
				buildViewSpecButtonText: function (spec, requestedViewType) {

					// given an options object with a possible `buttonText` hash, lookup the buttonText for the
					// requested view, falling back to a generic unit entry like "week" or "day"
					function queryButtonText(options) {
						var buttonText = options.buttonText || {};
						return buttonText[requestedViewType] ||
							// view can decide to look up a certain key
							(spec.buttonTextKey ? buttonText[spec.buttonTextKey] : null) ||
							// a key like "month"
							(spec.singleUnit ? buttonText[spec.singleUnit] : null);
					}

					// highest to lowest priority
					spec.buttonTextOverride =
						queryButtonText(this.dynamicOverrides) ||
						queryButtonText(this.overrides) || // constructor-specified buttonText lookup hash takes precedence
						spec.overrides.buttonText; // `buttonText` for view-specific options is a string

					// highest to lowest priority. mirrors buildViewSpecOptions
					spec.buttonTextDefault =
						queryButtonText(this.localeDefaults) ||
						queryButtonText(this.dirDefaults) ||
						spec.defaults.buttonText || // a single string. from ViewSubclass.defaults
						queryButtonText(Calendar.defaults) ||
						(spec.duration ? this.humanizeDuration(spec.duration) : null) || // like "3 days"
						requestedViewType; // fall back to given view name
				}

			});

			;
			;

			Calendar.mixin({

				el: null,
				contentEl: null,
				suggestedViewHeight: null,
				ignoreUpdateViewSize: 0,
				freezeContentHeightDepth: 0,
				windowResizeProxy: null,


				render: function () {
					if (!this.contentEl) {
						this.initialRender();
					}
					else if (this.elementVisible()) {
						// mainly for the public API
						this.calcSize();
						this.renderView();
					}
				},


				initialRender: function () {
					var _this = this;
					var el = this.el;

					el.addClass('fc');

					// event delegation for nav links
					el.on('click.fc', 'a[data-goto]', function (ev) {
						var anchorEl = $(this);
						var gotoOptions = anchorEl.data('goto'); // will automatically parse JSON
						var date = _this.moment(gotoOptions.date);
						var viewType = gotoOptions.type;

						// property like "navLinkDayClick". might be a string or a function
						var customAction = _this.view.opt('navLink' + capitaliseFirstLetter(viewType) + 'Click');

						if (typeof customAction === 'function') {
							customAction(date, ev);
						}
						else {
							if (typeof customAction === 'string') {
								viewType = customAction;
							}
							_this.zoomTo(date, viewType);
						}
					});

					// called immediately, and upon option change
					this.optionsModel.watch('settingTheme', ['?theme', '?themeSystem'], function (opts) {
						var themeClass = ThemeRegistry.getThemeClass(opts.themeSystem || opts.theme);
						var theme = new themeClass(_this.optionsModel);
						var widgetClass = theme.getClass('widget');

						_this.theme = theme;

						if (widgetClass) {
							el.addClass(widgetClass);
						}
					}, function () {
						var widgetClass = _this.theme.getClass('widget');

						_this.theme = null;

						if (widgetClass) {
							el.removeClass(widgetClass);
						}
					});

					this.optionsModel.watch('settingBusinessHourGenerator', ['?businessHours'], function (deps) {
						_this.businessHourGenerator = new BusinessHourGenerator(deps.businessHours, _this);

						if (_this.view) {
							_this.view.set('businessHourGenerator', _this.businessHourGenerator);
						}
					}, function () {
						_this.businessHourGenerator = null;
					});

					// called immediately, and upon option change.
					// HACK: locale often affects isRTL, so we explicitly listen to that too.
					this.optionsModel.watch('applyingDirClasses', ['?isRTL', '?locale'], function (opts) {
						el.toggleClass('fc-ltr', !opts.isRTL);
						el.toggleClass('fc-rtl', opts.isRTL);
					});

					this.contentEl = $("<div class='fc-view-container'/>").prependTo(el);

					this.initToolbars();
					this.renderHeader();
					this.renderFooter();
					this.renderView(this.opt('defaultView'));

					if (this.opt('handleWindowResize')) {
						$(window).resize(
							this.windowResizeProxy = debounce( // prevents rapid calls
								this.windowResize.bind(this),
								this.opt('windowResizeDelay')
							)
						);
					}
				},


				destroy: function () {
					if (this.view) {
						this.clearView();
					}

					this.toolbarsManager.proxyCall('removeElement');
					this.contentEl.remove();
					this.el.removeClass('fc fc-ltr fc-rtl');

					// removes theme-related root className
					this.optionsModel.unwatch('settingTheme');
					this.optionsModel.unwatch('settingBusinessHourGenerator');

					this.el.off('.fc'); // unbind nav link handlers

					if (this.windowResizeProxy) {
						$(window).unbind('resize', this.windowResizeProxy);
						this.windowResizeProxy = null;
					}

					GlobalEmitter.unneeded();
				},


				elementVisible: function () {
					return this.el.is(':visible');
				},


				// Render Queue
				// -----------------------------------------------------------------------------------------------------------------


				bindViewHandlers: function (view) {
					var _this = this;

					view.watch('titleForCalendar', ['title'], function (deps) { // TODO: better system
						if (view === _this.view) { // hack
							_this.setToolbarsTitle(deps.title);
						}
					});

					view.watch('dateProfileForCalendar', ['dateProfile'], function (deps) {
						if (view === _this.view) { // hack
							_this.currentDate = deps.dateProfile.date; // might have been constrained by view dates
							_this.updateToolbarButtons(deps.dateProfile);
						}
					});
				},


				unbindViewHandlers: function (view) {
					view.unwatch('titleForCalendar');
					view.unwatch('dateProfileForCalendar');
				},


				// View Rendering
				// -----------------------------------------------------------------------------------


				// Renders a view because of a date change, view-type change, or for the first time.
				// If not given a viewType, keep the current view but render different dates.
				// Accepts an optional scroll state to restore to.
				renderView: function (viewType) {
					var oldView = this.view;
					var newView;

					this.freezeContentHeight();

					if (oldView && viewType && oldView.type !== viewType) {
						this.clearView();
					}

					// if viewType changed, or the view was never created, create a fresh view
					if (!this.view && viewType) {
						newView = this.view =
							this.viewsByType[viewType] ||
							(this.viewsByType[viewType] = this.instantiateView(viewType));

						this.bindViewHandlers(newView);

						newView.setElement(
							$("<div class='fc-view fc-" + viewType + "-view' />").appendTo(this.contentEl)
						);

						this.toolbarsManager.proxyCall('activateButton', viewType);
					}

					if (this.view) {

						// prevent unnecessary change firing
						if (this.view.get('businessHourGenerator') !== this.businessHourGenerator) {
							this.view.set('businessHourGenerator', this.businessHourGenerator);
						}

						this.view.setDate(this.currentDate);
					}

					this.thawContentHeight();
				},


				// Unrenders the current view and reflects this change in the Header.
				// Unregsiters the `view`, but does not remove from viewByType hash.
				clearView: function () {
					var currentView = this.view;

					this.toolbarsManager.proxyCall('deactivateButton', currentView.type);

					this.unbindViewHandlers(currentView);

					currentView.removeElement();
					currentView.unsetDate(); // so bindViewHandlers doesn't fire with old values next time

					this.view = null;
				},


				// Destroys the view, including the view object. Then, re-instantiates it and renders it.
				// Maintains the same scroll state.
				// TODO: maintain any other user-manipulated state.
				reinitView: function () {
					var oldView = this.view;
					var scroll = oldView.queryScroll(); // wouldn't be so complicated if Calendar owned the scroll
					this.freezeContentHeight();

					this.clearView();
					this.calcSize();
					this.renderView(oldView.type); // needs the type to freshly render

					this.view.applyScroll(scroll);
					this.thawContentHeight();
				},


				// Resizing
				// -----------------------------------------------------------------------------------


				getSuggestedViewHeight: function () {
					if (this.suggestedViewHeight === null) {
						this.calcSize();
					}
					return this.suggestedViewHeight;
				},


				isHeightAuto: function () {
					return this.opt('contentHeight') === 'auto' || this.opt('height') === 'auto';
				},


				updateViewSize: function (isResize) {
					var view = this.view;
					var scroll;

					if (!this.ignoreUpdateViewSize && view) {

						if (isResize) {
							this.calcSize();
							scroll = view.queryScroll();
						}

						this.ignoreUpdateViewSize++;

						view.updateSize(
							this.getSuggestedViewHeight(),
							this.isHeightAuto(),
							isResize
						);

						this.ignoreUpdateViewSize--;

						if (isResize) {
							view.applyScroll(scroll);
						}

						return true; // signal success
					}
				},


				calcSize: function () {
					if (this.elementVisible()) {
						this._calcSize();
					}
				},


				_calcSize: function () { // assumes elementVisible
					var contentHeightInput = this.opt('contentHeight');
					var heightInput = this.opt('height');

					if (typeof contentHeightInput === 'number') { // exists and not 'auto'
						this.suggestedViewHeight = contentHeightInput;
					}
					else if (typeof contentHeightInput === 'function') { // exists and is a function
						this.suggestedViewHeight = contentHeightInput();
					}
					else if (typeof heightInput === 'number') { // exists and not 'auto'
						this.suggestedViewHeight = heightInput - this.queryToolbarsHeight();
					}
					else if (typeof heightInput === 'function') { // exists and is a function
						this.suggestedViewHeight = heightInput() - this.queryToolbarsHeight();
					}
					else if (heightInput === 'parent') { // set to height of parent element
						this.suggestedViewHeight = this.el.parent().height() - this.queryToolbarsHeight();
					}
					else {
						this.suggestedViewHeight = Math.round(
							this.contentEl.width() /
							Math.max(this.opt('aspectRatio'), .5)
						);
					}
				},


				windowResize: function (ev) {
					if (
						ev.target === window && // so we don't process jqui "resize" events that have bubbled up
						this.view &&
						this.view.isDatesRendered
					) {
						if (this.updateViewSize(true)) { // isResize=true, returns true on success
							this.publiclyTrigger('windowResize', [this.view]);
						}
					}
				},


				/* Height "Freezing"
	-----------------------------------------------------------------------------*/


				freezeContentHeight: function () {
					if (!(this.freezeContentHeightDepth++)) {
						this.forceFreezeContentHeight();
					}
				},


				forceFreezeContentHeight: function () {
					this.contentEl.css({
						width: '100%',
						height: this.contentEl.height(),
						overflow: 'hidden'
					});
				},


				thawContentHeight: function () {
					this.freezeContentHeightDepth--;

					// always bring back to natural height
					this.contentEl.css({
						width: '',
						height: '',
						overflow: ''
					});

					// but if there are future thaws, re-freeze
					if (this.freezeContentHeightDepth) {
						this.forceFreezeContentHeight();
					}
				}

			});

			;
			;

			Calendar.mixin({

				header: null,
				footer: null,
				toolbarsManager: null,


				initToolbars: function () {
					this.header = new Toolbar(this, this.computeHeaderOptions());
					this.footer = new Toolbar(this, this.computeFooterOptions());
					this.toolbarsManager = new Iterator([this.header, this.footer]);
				},


				computeHeaderOptions: function () {
					return {
						extraClasses: 'fc-header-toolbar',
						layout: this.opt('header')
					};
				},


				computeFooterOptions: function () {
					return {
						extraClasses: 'fc-footer-toolbar',
						layout: this.opt('footer')
					};
				},


				// can be called repeatedly and Header will rerender
				renderHeader: function () {
					var header = this.header;

					header.setToolbarOptions(this.computeHeaderOptions());
					header.render();

					if (header.el) {
						this.el.prepend(header.el);
					}
				},


				// can be called repeatedly and Footer will rerender
				renderFooter: function () {
					var footer = this.footer;

					footer.setToolbarOptions(this.computeFooterOptions());
					footer.render();

					if (footer.el) {
						this.el.append(footer.el);
					}
				},


				setToolbarsTitle: function (title) {
					this.toolbarsManager.proxyCall('updateTitle', title);
				},


				updateToolbarButtons: function (dateProfile) {
					var now = this.getNow();
					var view = this.view;
					var todayInfo = view.buildDateProfile(now);
					var prevInfo = view.buildPrevDateProfile(this.currentDate);
					var nextInfo = view.buildNextDateProfile(this.currentDate);

					this.toolbarsManager.proxyCall(
						(todayInfo.isValid && !dateProfile.currentUnzonedRange.containsDate(now)) ?
							'enableButton' :
							'disableButton',
						'today'
					);

					this.toolbarsManager.proxyCall(
						prevInfo.isValid ?
							'enableButton' :
							'disableButton',
						'prev'
					);

					this.toolbarsManager.proxyCall(
						nextInfo.isValid ?
							'enableButton' :
							'disableButton',
						'next'
					);
				},


				queryToolbarsHeight: function () {
					return this.toolbarsManager.items.reduce(function (accumulator, toolbar) {
						var toolbarHeight = toolbar.el ? toolbar.el.outerHeight(true) : 0; // includes margin
						return accumulator + toolbarHeight;
					}, 0);
				}

			});

			;
			;

			/*
determines if eventInstanceGroup is allowed,
in relation to other EVENTS and business hours.
*/
			Calendar.prototype.isEventInstanceGroupAllowed = function (eventInstanceGroup) {
				var eventDef = eventInstanceGroup.getEventDef();
				var eventFootprints = this.eventRangesToEventFootprints(eventInstanceGroup.getAllEventRanges());
				var i;

				var peerEventInstances = this.getPeerEventInstances(eventDef);
				var peerEventRanges = peerEventInstances.map(eventInstanceToEventRange);
				var peerEventFootprints = this.eventRangesToEventFootprints(peerEventRanges);

				var constraintVal = eventDef.getConstraint();
				var overlapVal = eventDef.getOverlap();

				var eventAllowFunc = this.opt('eventAllow');

				for (i = 0; i < eventFootprints.length; i++) {
					if (
						!this.isFootprintAllowed(
							eventFootprints[i].componentFootprint,
							peerEventFootprints,
							constraintVal,
							overlapVal,
							eventFootprints[i].eventInstance
						)
					) {
						return false;
					}
				}

				if (eventAllowFunc) {
					for (i = 0; i < eventFootprints.length; i++) {
						if (
							eventAllowFunc(
								eventFootprints[i].componentFootprint.toLegacy(this),
								eventFootprints[i].getEventLegacy()
							) === false
						) {
							return false;
						}
					}
				}

				return true;
			};


			Calendar.prototype.getPeerEventInstances = function (eventDef) {
				return this.eventManager.getEventInstancesWithoutId(eventDef.id);
			};


			Calendar.prototype.isSelectionFootprintAllowed = function (componentFootprint) {
				var peerEventInstances = this.eventManager.getEventInstances();
				var peerEventRanges = peerEventInstances.map(eventInstanceToEventRange);
				var peerEventFootprints = this.eventRangesToEventFootprints(peerEventRanges);

				var selectAllowFunc;

				if (
					this.isFootprintAllowed(
						componentFootprint,
						peerEventFootprints,
						this.opt('selectConstraint'),
						this.opt('selectOverlap')
					)
				) {
					selectAllowFunc = this.opt('selectAllow');

					if (selectAllowFunc) {
						return selectAllowFunc(componentFootprint.toLegacy(this)) !== false;
					}
					else {
						return true;
					}
				}

				return false;
			};


			Calendar.prototype.isFootprintAllowed = function (componentFootprint,
			                                                  peerEventFootprints,
			                                                  constraintVal,
			                                                  overlapVal,
			                                                  subjectEventInstance // optional
			) {
				var constraintFootprints; // ComponentFootprint[]
				var overlapEventFootprints; // EventFootprint[]

				if (constraintVal != null) {
					constraintFootprints = this.constraintValToFootprints(constraintVal, componentFootprint.isAllDay);

					if (!this.isFootprintWithinConstraints(componentFootprint, constraintFootprints)) {
						return false;
					}
				}

				overlapEventFootprints = this.collectOverlapEventFootprints(peerEventFootprints, componentFootprint);

				if (overlapVal === false) {
					if (overlapEventFootprints.length) {
						return false;
					}
				}
				else if (typeof overlapVal === 'function') {
					if (!isOverlapsAllowedByFunc(overlapEventFootprints, overlapVal, subjectEventInstance)) {
						return false;
					}
				}

				if (subjectEventInstance) {
					if (!isOverlapEventInstancesAllowed(overlapEventFootprints, subjectEventInstance)) {
						return false;
					}
				}

				return true;
			};


// Constraint
// ------------------------------------------------------------------------------------------------


			Calendar.prototype.isFootprintWithinConstraints = function (componentFootprint, constraintFootprints) {
				var i;

				for (i = 0; i < constraintFootprints.length; i++) {
					if (this.footprintContainsFootprint(constraintFootprints[i], componentFootprint)) {
						return true;
					}
				}

				return false;
			};


			Calendar.prototype.constraintValToFootprints = function (constraintVal, isAllDay) {
				var eventInstances;

				if (constraintVal === 'businessHours') {
					return this.buildCurrentBusinessFootprints(isAllDay);
				}
				else if (typeof constraintVal === 'object') {
					eventInstances = this.parseEventDefToInstances(constraintVal); // handles recurring events

					if (!eventInstances) { // invalid input. fallback to parsing footprint directly
						return this.parseFootprints(constraintVal);
					}
					else {
						return this.eventInstancesToFootprints(eventInstances);
					}
				}
				else if (constraintVal != null) { // an ID
					eventInstances = this.eventManager.getEventInstancesWithId(constraintVal);

					return this.eventInstancesToFootprints(eventInstances);
				}
			};


// returns ComponentFootprint[]
// uses current view's range
			Calendar.prototype.buildCurrentBusinessFootprints = function (isAllDay) {
				var view = this.view;
				var businessHourGenerator = view.get('businessHourGenerator');
				var unzonedRange = view.dateProfile.activeUnzonedRange;
				var eventInstanceGroup = businessHourGenerator.buildEventInstanceGroup(isAllDay, unzonedRange);

				if (eventInstanceGroup) {
					return this.eventInstancesToFootprints(eventInstanceGroup.eventInstances);
				}
				else {
					return [];
				}
			};


// conversion util
			Calendar.prototype.eventInstancesToFootprints = function (eventInstances) {
				var eventRanges = eventInstances.map(eventInstanceToEventRange);
				var eventFootprints = this.eventRangesToEventFootprints(eventRanges);

				return eventFootprints.map(eventFootprintToComponentFootprint);
			};


// Overlap
// ------------------------------------------------------------------------------------------------


			Calendar.prototype.collectOverlapEventFootprints = function (peerEventFootprints, targetFootprint) {
				var overlapEventFootprints = [];
				var i;

				for (i = 0; i < peerEventFootprints.length; i++) {
					if (
						this.footprintsIntersect(
							targetFootprint,
							peerEventFootprints[i].componentFootprint
						)
					) {
						overlapEventFootprints.push(peerEventFootprints[i]);
					}
				}

				return overlapEventFootprints;
			};


// optional subjectEventInstance
			function isOverlapsAllowedByFunc(overlapEventFootprints, overlapFunc, subjectEventInstance) {
				var i;

				for (i = 0; i < overlapEventFootprints.length; i++) {
					if (
						!overlapFunc(
							overlapEventFootprints[i].eventInstance.toLegacy(),
							subjectEventInstance ? subjectEventInstance.toLegacy() : null
						)
					) {
						return false;
					}
				}

				return true;
			}


			function isOverlapEventInstancesAllowed(overlapEventFootprints, subjectEventInstance) {
				var subjectLegacyInstance = subjectEventInstance.toLegacy();
				var i;
				var overlapEventInstance;
				var overlapEventDef;
				var overlapVal;

				for (i = 0; i < overlapEventFootprints.length; i++) {
					overlapEventInstance = overlapEventFootprints[i].eventInstance;
					overlapEventDef = overlapEventInstance.def;

					// don't need to pass in calendar, because don't want to consider global eventOverlap property,
					// because we already considered that earlier in the process.
					overlapVal = overlapEventDef.getOverlap();

					if (overlapVal === false) {
						return false;
					}
					else if (typeof overlapVal === 'function') {
						if (
							!overlapVal(
								overlapEventInstance.toLegacy(),
								subjectLegacyInstance
							)
						) {
							return false;
						}
					}
				}

				return true;
			}


// Conversion: eventDefs -> eventInstances -> eventRanges -> eventFootprints -> componentFootprints
// ------------------------------------------------------------------------------------------------
// NOTE: this might seem like repetitive code with the Grid class, however, this code is related to
// constraints whereas the Grid code is related to rendering. Each approach might want to convert
// eventRanges -> eventFootprints in a different way. Regardless, there are opportunities to make
// this more DRY.


			/*
Returns false on invalid input.
*/
			Calendar.prototype.parseEventDefToInstances = function (eventInput) {
				var eventManager = this.eventManager;
				var eventDef = EventDefParser.parse(eventInput, new EventSource(this));

				if (!eventDef) { // invalid
					return false;
				}

				return eventDef.buildInstances(eventManager.currentPeriod.unzonedRange);
			};


			Calendar.prototype.eventRangesToEventFootprints = function (eventRanges) {
				var i;
				var eventFootprints = [];

				for (i = 0; i < eventRanges.length; i++) {
					eventFootprints.push.apply( // footprints
						eventFootprints,
						this.eventRangeToEventFootprints(eventRanges[i])
					);
				}

				return eventFootprints;
			};


			Calendar.prototype.eventRangeToEventFootprints = function (eventRange) {
				return [eventRangeToEventFootprint(eventRange)];
			};


			/*
Parses footprints directly.
Very similar to EventDateProfile::parse :(
*/
			Calendar.prototype.parseFootprints = function (rawInput) {
				var start, end;

				if (rawInput.start) {
					start = this.moment(rawInput.start);

					if (!start.isValid()) {
						start = null;
					}
				}

				if (rawInput.end) {
					end = this.moment(rawInput.end);

					if (!end.isValid()) {
						end = null;
					}
				}

				return [
					new ComponentFootprint(
						new UnzonedRange(start, end),
						(start && !start.hasTime()) || (end && !end.hasTime()) // isAllDay
					)
				];
			};


// Footprint Utils
// ----------------------------------------------------------------------------------------


			Calendar.prototype.footprintContainsFootprint = function (outerFootprint, innerFootprint) {
				return outerFootprint.unzonedRange.containsRange(innerFootprint.unzonedRange);
			};


			Calendar.prototype.footprintsIntersect = function (footprint0, footprint1) {
				return footprint0.unzonedRange.intersectsWith(footprint1.unzonedRange);
			};

			;
			;

			Calendar.mixin({

				// Sources
				// ------------------------------------------------------------------------------------


				getEventSources: function () {
					return this.eventManager.otherSources.slice(); // clone
				},


				getEventSourceById: function (id) {
					return this.eventManager.getSourceById(
						EventSource.normalizeId(id)
					);
				},


				addEventSource: function (sourceInput) {
					var source = EventSourceParser.parse(sourceInput, this);

					if (source) {
						this.eventManager.addSource(source);
					}
				},


				removeEventSources: function (sourceMultiQuery) {
					var eventManager = this.eventManager;
					var sources;
					var i;

					if (sourceMultiQuery == null) {
						this.eventManager.removeAllSources();
					}
					else {
						sources = eventManager.multiQuerySources(sourceMultiQuery);

						eventManager.freeze();

						for (i = 0; i < sources.length; i++) {
							eventManager.removeSource(sources[i]);
						}

						eventManager.thaw();
					}
				},


				removeEventSource: function (sourceQuery) {
					var eventManager = this.eventManager;
					var sources = eventManager.querySources(sourceQuery);
					var i;

					eventManager.freeze();

					for (i = 0; i < sources.length; i++) {
						eventManager.removeSource(sources[i]);
					}

					eventManager.thaw();
				},


				refetchEventSources: function (sourceMultiQuery) {
					var eventManager = this.eventManager;
					var sources = eventManager.multiQuerySources(sourceMultiQuery);
					var i;

					eventManager.freeze();

					for (i = 0; i < sources.length; i++) {
						eventManager.refetchSource(sources[i]);
					}

					eventManager.thaw();
				},


				// Events
				// ------------------------------------------------------------------------------------


				refetchEvents: function () {
					this.eventManager.refetchAllSources();
				},


				renderEvents: function (eventInputs, isSticky) {
					this.eventManager.freeze();

					for (var i = 0; i < eventInputs.length; i++) {
						this.renderEvent(eventInputs[i], isSticky);
					}

					this.eventManager.thaw();
				},


				renderEvent: function (eventInput, isSticky) {
					var eventManager = this.eventManager;
					var eventDef = EventDefParser.parse(
						eventInput,
						eventInput.source || eventManager.stickySource
					);

					if (eventDef) {
						eventManager.addEventDef(eventDef, isSticky);
					}
				},


				// legacyQuery operates on legacy event instance objects
				removeEvents: function (legacyQuery) {
					var eventManager = this.eventManager;
					var legacyInstances = [];
					var idMap = {};
					var eventDef;
					var i;

					if (legacyQuery == null) { // shortcut for removing all
						eventManager.removeAllEventDefs(true); // persist=true
					}
					else {
						eventManager.getEventInstances().forEach(function (eventInstance) {
							legacyInstances.push(eventInstance.toLegacy());
						});

						legacyInstances = filterLegacyEventInstances(legacyInstances, legacyQuery);

						// compute unique IDs
						for (i = 0; i < legacyInstances.length; i++) {
							eventDef = this.eventManager.getEventDefByUid(legacyInstances[i]._id);
							idMap[eventDef.id] = true;
						}

						eventManager.freeze();

						for (i in idMap) { // reuse `i` as an "id"
							eventManager.removeEventDefsById(i, true); // persist=true
						}

						eventManager.thaw();
					}
				},


				// legacyQuery operates on legacy event instance objects
				clientEvents: function (legacyQuery) {
					var legacyEventInstances = [];

					this.eventManager.getEventInstances().forEach(function (eventInstance) {
						legacyEventInstances.push(eventInstance.toLegacy());
					});

					return filterLegacyEventInstances(legacyEventInstances, legacyQuery);
				},


				updateEvents: function (eventPropsArray) {
					this.eventManager.freeze();

					for (var i = 0; i < eventPropsArray.length; i++) {
						this.updateEvent(eventPropsArray[i]);
					}

					this.eventManager.thaw();
				},


				updateEvent: function (eventProps) {
					var eventDef = this.eventManager.getEventDefByUid(eventProps._id);
					var eventInstance;
					var eventDefMutation;

					if (eventDef instanceof SingleEventDef) {
						eventInstance = eventDef.buildInstance();

						eventDefMutation = EventDefMutation.createFromRawProps(
							eventInstance,
							eventProps, // raw props
							null // largeUnit -- who uses it?
						);

						this.eventManager.mutateEventsWithId(eventDef.id, eventDefMutation); // will release
					}
				}

			});


			function filterLegacyEventInstances(legacyEventInstances, legacyQuery) {
				if (legacyQuery == null) {
					return legacyEventInstances;
				}
				else if ($.isFunction(legacyQuery)) {
					return legacyEventInstances.filter(legacyQuery);
				}
				else { // an event ID
					legacyQuery += ''; // normalize to string

					return legacyEventInstances.filter(function (legacyEventInstance) {
						// soft comparison because id not be normalized to string
						return legacyEventInstance.id == legacyQuery ||
							legacyEventInstance._id === legacyQuery; // can specify internal id, but must exactly match
					});
				}
			}

			;
			;

			Calendar.defaults = {

				titleRangeSeparator: ' \u2013 ', // en dash
				monthYearFormat: 'MMMM YYYY', // required for en. other locales rely on datepicker computable option

				defaultTimedEventDuration: '02:00:00',
				defaultAllDayEventDuration: {days: 1},
				forceEventDuration: false,
				nextDayThreshold: '09:00:00', // 9am

				// display
				columnHeader: true,
				defaultView: 'month',
				aspectRatio: 1.35,
				header: {
					left: 'title',
					center: '',
					right: 'today prev,next'
				},
				weekends: true,
				weekNumbers: false,

				weekNumberTitle: 'W',
				weekNumberCalculation: 'local',

				//editable: false,

				//nowIndicator: false,

				scrollTime: '06:00:00',
				minTime: '00:00:00',
				maxTime: '24:00:00',
				showNonCurrentDates: true,

				// event ajax
				lazyFetching: true,
				startParam: 'start',
				endParam: 'end',
				timezoneParam: 'timezone',

				timezone: false,

				//allDayDefault: undefined,

				// locale
				isRTL: false,
				buttonText: {
					prev: "prev",
					next: "next",
					prevYear: "prev year",
					nextYear: "next year",
					year: 'year', // TODO: locale files need to specify this
					today: 'today',
					month: 'month',
					week: 'week',
					day: 'day'
				},
				//buttonIcons: null,

				allDayText: 'all-day',

				// allows setting a min-height to the event segment to prevent short events overlapping each other
				agendaEventMinHeight: 0,

				// jquery-ui theming
				theme: false,
				//themeButtonIcons: null,

				//eventResizableFromStart: false,
				dragOpacity: .75,
				dragRevertDuration: 500,
				dragScroll: true,

				//selectable: false,
				unselectAuto: true,
				//selectMinDistance: 0,

				dropAccept: '*',

				eventOrder: 'title',
				//eventRenderWait: null,

				eventLimit: false,
				eventLimitText: 'more',
				eventLimitClick: 'popover',
				dayPopoverFormat: 'LL',

				handleWindowResize: true,
				windowResizeDelay: 100, // milliseconds before an updateSize happens

				longPressDelay: 1000

			};


			Calendar.englishDefaults = { // used by locale.js
				dayPopoverFormat: 'dddd, MMMM D'
			};


			Calendar.rtlDefaults = { // right-to-left defaults
				header: { // TODO: smarter solution (first/center/last ?)
					left: 'next,prev today',
					center: '',
					right: 'title'
				},
				buttonIcons: {
					prev: 'right-single-arrow',
					next: 'left-single-arrow',
					prevYear: 'right-double-arrow',
					nextYear: 'left-double-arrow'
				},
				themeButtonIcons: {
					prev: 'circle-triangle-e',
					next: 'circle-triangle-w',
					nextYear: 'seek-prev',
					prevYear: 'seek-next'
				}
			};

			;
			;

			var localeOptionHash = FC.locales = {}; // initialize and expose


// TODO: document the structure and ordering of a FullCalendar locale file


// Initialize jQuery UI datepicker translations while using some of the translations
// Will set this as the default locales for datepicker.
			FC.datepickerLocale = function (localeCode, dpLocaleCode, dpOptions) {

				// get the FullCalendar internal option hash for this locale. create if necessary
				var fcOptions = localeOptionHash[localeCode] || (localeOptionHash[localeCode] = {});

				// transfer some simple options from datepicker to fc
				fcOptions.isRTL = dpOptions.isRTL;
				fcOptions.weekNumberTitle = dpOptions.weekHeader;

				// compute some more complex options from datepicker
				$.each(dpComputableOptions, function (name, func) {
					fcOptions[name] = func(dpOptions);
				});

				// is jQuery UI Datepicker is on the page?
				if ($.datepicker) {

					// Register the locale data.
					// FullCalendar and MomentJS use locale codes like "pt-br" but Datepicker
					// does it like "pt-BR" or if it doesn't have the locale, maybe just "pt".
					// Make an alias so the locale can be referenced either way.
					$.datepicker.regional[dpLocaleCode] =
						$.datepicker.regional[localeCode] = // alias
							dpOptions;

					// Alias 'en' to the default locale data. Do this every time.
					$.datepicker.regional.en = $.datepicker.regional[''];

					// Set as Datepicker's global defaults.
					$.datepicker.setDefaults(dpOptions);
				}
			};


// Sets FullCalendar-specific translations. Will set the locales as the global default.
			FC.locale = function (localeCode, newFcOptions) {
				var fcOptions;
				var momOptions;

				// get the FullCalendar internal option hash for this locale. create if necessary
				fcOptions = localeOptionHash[localeCode] || (localeOptionHash[localeCode] = {});

				// provided new options for this locales? merge them in
				if (newFcOptions) {
					fcOptions = localeOptionHash[localeCode] = mergeOptions([fcOptions, newFcOptions]);
				}

				// compute locale options that weren't defined.
				// always do this. newFcOptions can be undefined when initializing from i18n file,
				// so no way to tell if this is an initialization or a default-setting.
				momOptions = getMomentLocaleData(localeCode); // will fall back to en
				$.each(momComputableOptions, function (name, func) {
					if (fcOptions[name] == null) {
						fcOptions[name] = func(momOptions, fcOptions);
					}
				});

				// set it as the default locale for FullCalendar
				Calendar.defaults.locale = localeCode;
			};


// NOTE: can't guarantee any of these computations will run because not every locale has datepicker
// configs, so make sure there are English fallbacks for these in the defaults file.
			var dpComputableOptions = {

				buttonText: function (dpOptions) {
					return {
						// the translations sometimes wrongly contain HTML entities
						prev: stripHtmlEntities(dpOptions.prevText),
						next: stripHtmlEntities(dpOptions.nextText),
						today: stripHtmlEntities(dpOptions.currentText)
					};
				},

				// Produces format strings like "MMMM YYYY" -> "September 2014"
				monthYearFormat: function (dpOptions) {
					return dpOptions.showMonthAfterYear ?
						'YYYY[' + dpOptions.yearSuffix + '] MMMM' :
						'MMMM YYYY[' + dpOptions.yearSuffix + ']';
				}

			};

			var momComputableOptions = {

				// Produces format strings like "ddd M/D" -> "Fri 9/15"
				dayOfMonthFormat: function (momOptions, fcOptions) {
					var format = momOptions.longDateFormat('l'); // for the format like "M/D/YYYY"

					// strip the year off the edge, as well as other misc non-whitespace chars
					format = format.replace(/^Y+[^\w\s]*|[^\w\s]*Y+$/g, '');

					if (fcOptions.isRTL) {
						format += ' ddd'; // for RTL, add day-of-week to end
					}
					else {
						format = 'ddd ' + format; // for LTR, add day-of-week to beginning
					}
					return format;
				},

				// Produces format strings like "h:mma" -> "6:00pm"
				mediumTimeFormat: function (momOptions) { // can't be called `timeFormat` because collides with option
					return momOptions.longDateFormat('LT')
						.replace(/\s*a$/i, 'a'); // convert AM/PM/am/pm to lowercase. remove any spaces beforehand
				},

				// Produces format strings like "h(:mm)a" -> "6pm" / "6:30pm"
				smallTimeFormat: function (momOptions) {
					return momOptions.longDateFormat('LT')
						.replace(':mm', '(:mm)')
						.replace(/(\Wmm)$/, '($1)') // like above, but for foreign locales
						.replace(/\s*a$/i, 'a'); // convert AM/PM/am/pm to lowercase. remove any spaces beforehand
				},

				// Produces format strings like "h(:mm)t" -> "6p" / "6:30p"
				extraSmallTimeFormat: function (momOptions) {
					return momOptions.longDateFormat('LT')
						.replace(':mm', '(:mm)')
						.replace(/(\Wmm)$/, '($1)') // like above, but for foreign locales
						.replace(/\s*a$/i, 't'); // convert to AM/PM/am/pm to lowercase one-letter. remove any spaces beforehand
				},

				// Produces format strings like "ha" / "H" -> "6pm" / "18"
				hourFormat: function (momOptions) {
					return momOptions.longDateFormat('LT')
						.replace(':mm', '')
						.replace(/(\Wmm)$/, '') // like above, but for foreign locales
						.replace(/\s*a$/i, 'a'); // convert AM/PM/am/pm to lowercase. remove any spaces beforehand
				},

				// Produces format strings like "h:mm" -> "6:30" (with no AM/PM)
				noMeridiemTimeFormat: function (momOptions) {
					return momOptions.longDateFormat('LT')
						.replace(/\s*a$/i, ''); // remove trailing AM/PM
				}

			};


// options that should be computed off live calendar options (considers override options)
// TODO: best place for this? related to locale?
// TODO: flipping text based on isRTL is a bad idea because the CSS `direction` might want to handle it
			var instanceComputableOptions = {

				// Produces format strings for results like "Mo 16"
				smallDayDateFormat: function (options) {
					return options.isRTL ?
						'D dd' :
						'dd D';
				},

				// Produces format strings for results like "Wk 5"
				weekFormat: function (options) {
					return options.isRTL ?
						'w[ ' + options.weekNumberTitle + ']' :
						'[' + options.weekNumberTitle + ' ]w';
				},

				// Produces format strings for results like "Wk5"
				smallWeekFormat: function (options) {
					return options.isRTL ?
						'w[' + options.weekNumberTitle + ']' :
						'[' + options.weekNumberTitle + ']w';
				}

			};

// TODO: make these computable properties in optionsModel
			function populateInstanceComputableOptions(options) {
				$.each(instanceComputableOptions, function (name, func) {
					if (options[name] == null) {
						options[name] = func(options);
					}
				});
			}


// Returns moment's internal locale data. If doesn't exist, returns English.
			function getMomentLocaleData(localeCode) {
				return moment.localeData(localeCode) || moment.localeData('en');
			}


// Initialize English by forcing computation of moment-derived options.
// Also, sets it as the default.
			FC.locale('en', Calendar.englishDefaults);

			;
			;

			var UnzonedRange = FC.UnzonedRange = Class.extend({

				startMs: null, // if null, no start constraint
				endMs: null, // if null, no end constraint

				// TODO: move these into footprint.
				// Especially, doesn't make sense for null startMs/endMs.
				isStart: true,
				isEnd: true,

				constructor: function (startInput, endInput) {

					if (moment.isMoment(startInput)) {
						startInput = startInput.clone().stripZone();
					}

					if (moment.isMoment(endInput)) {
						endInput = endInput.clone().stripZone();
					}

					if (startInput) {
						this.startMs = startInput.valueOf();
					}

					if (endInput) {
						this.endMs = endInput.valueOf();
					}
				},

				intersect: function (otherRange) {
					var startMs = this.startMs;
					var endMs = this.endMs;
					var newRange = null;

					if (otherRange.startMs !== null) {
						if (startMs === null) {
							startMs = otherRange.startMs;
						}
						else {
							startMs = Math.max(startMs, otherRange.startMs);
						}
					}

					if (otherRange.endMs !== null) {
						if (endMs === null) {
							endMs = otherRange.endMs;
						}
						else {
							endMs = Math.min(endMs, otherRange.endMs);
						}
					}

					if (startMs === null || endMs === null || startMs < endMs) {
						newRange = new UnzonedRange(startMs, endMs);
						newRange.isStart = this.isStart && startMs === this.startMs;
						newRange.isEnd = this.isEnd && endMs === this.endMs;
					}

					return newRange;
				},


				intersectsWith: function (otherRange) {
					return (this.endMs === null || otherRange.startMs === null || this.endMs > otherRange.startMs) &&
						(this.startMs === null || otherRange.endMs === null || this.startMs < otherRange.endMs);
				},


				containsRange: function (innerRange) {
					return (this.startMs === null || (innerRange.startMs !== null && innerRange.startMs >= this.startMs)) &&
						(this.endMs === null || (innerRange.endMs !== null && innerRange.endMs <= this.endMs));
				},


				// `date` can be a moment, a Date, or a millisecond time.
				containsDate: function (date) {
					var ms = date.valueOf();

					return (this.startMs === null || ms >= this.startMs) &&
						(this.endMs === null || ms < this.endMs);
				},


				// If the given date is not within the given range, move it inside.
				// (If it's past the end, make it one millisecond before the end).
				// `date` can be a moment, a Date, or a millisecond time.
				// Returns a MS-time.
				constrainDate: function (date) {
					var ms = date.valueOf();

					if (this.startMs !== null && ms < this.startMs) {
						ms = this.startMs;
					}

					if (this.endMs !== null && ms >= this.endMs) {
						ms = this.endMs - 1;
					}

					return ms;
				},


				equals: function (otherRange) {
					return this.startMs === otherRange.startMs && this.endMs === otherRange.endMs;
				},


				clone: function () {
					var range = new UnzonedRange(this.startMs, this.endMs);

					range.isStart = this.isStart;
					range.isEnd = this.isEnd;

					return range;
				},


				// Returns an ambig-zoned moment from startMs.
				// BEWARE: returned moment is not localized.
				// Formatting and start-of-week will be default.
				getStart: function () {
					if (this.startMs !== null) {
						return FC.moment.utc(this.startMs).stripZone();
					}
				},

				// Returns an ambig-zoned moment from startMs.
				// BEWARE: returned moment is not localized.
				// Formatting and start-of-week will be default.
				getEnd: function () {
					if (this.endMs !== null) {
						return FC.moment.utc(this.endMs).stripZone();
					}
				},


				as: function (unit) {
					return moment.utc(this.endMs).diff(
						moment.utc(this.startMs),
						unit,
						true
					);
				}

			});


			/*
SIDEEFFECT: will mutate eventRanges.
Will return a new array result.
Only works for non-open-ended ranges.
*/
			function invertUnzonedRanges(ranges, constraintRange) {
				var invertedRanges = [];
				var startMs = constraintRange.startMs; // the end of the previous range. the start of the new range
				var i;
				var dateRange;

				// ranges need to be in order. required for our date-walking algorithm
				ranges.sort(compareUnzonedRanges);

				for (i = 0; i < ranges.length; i++) {
					dateRange = ranges[i];

					// add the span of time before the event (if there is any)
					if (dateRange.startMs > startMs) { // compare millisecond time (skip any ambig logic)
						invertedRanges.push(
							new UnzonedRange(startMs, dateRange.startMs)
						);
					}

					if (dateRange.endMs > startMs) {
						startMs = dateRange.endMs;
					}
				}

				// add the span of time after the last event (if there is any)
				if (startMs < constraintRange.endMs) { // compare millisecond time (skip any ambig logic)
					invertedRanges.push(
						new UnzonedRange(startMs, constraintRange.endMs)
					);
				}

				return invertedRanges;
			}


			/*
Only works for non-open-ended ranges.
*/
			function compareUnzonedRanges(range1, range2) {
				return range1.startMs - range2.startMs; // earlier ranges go first
			}

			;
			;

			/*
Meant to be immutable
*/
			var ComponentFootprint = FC.ComponentFootprint = Class.extend({

				unzonedRange: null,
				isAllDay: false, // component can choose to ignore this


				constructor: function (unzonedRange, isAllDay) {
					this.unzonedRange = unzonedRange;
					this.isAllDay = isAllDay;
				},


				/*
	Only works for non-open-ended ranges.
	*/
				toLegacy: function (calendar) {
					return {
						start: calendar.msToMoment(this.unzonedRange.startMs, this.isAllDay),
						end: calendar.msToMoment(this.unzonedRange.endMs, this.isAllDay)
					};
				}

			});

			;
			;

			var EventPeriod = Class.extend(EmitterMixin, {

				start: null,
				end: null,
				timezone: null,

				unzonedRange: null,

				requestsByUid: null,
				pendingCnt: 0,

				freezeDepth: 0,
				stuntedReleaseCnt: 0,
				releaseCnt: 0,

				eventDefsByUid: null,
				eventDefsById: null,
				eventInstanceGroupsById: null,


				constructor: function (start, end, timezone) {
					this.start = start;
					this.end = end;
					this.timezone = timezone;

					this.unzonedRange = new UnzonedRange(
						start.clone().stripZone(),
						end.clone().stripZone()
					);

					this.requestsByUid = {};
					this.eventDefsByUid = {};
					this.eventDefsById = {};
					this.eventInstanceGroupsById = {};
				},


				isWithinRange: function (start, end) {
					// TODO: use a range util function?
					return !start.isBefore(this.start) && !end.isAfter(this.end);
				},


				// Requesting and Purging
				// -----------------------------------------------------------------------------------------------------------------


				requestSources: function (sources) {
					this.freeze();

					for (var i = 0; i < sources.length; i++) {
						this.requestSource(sources[i]);
					}

					this.thaw();
				},


				requestSource: function (source) {
					var _this = this;
					var request = {source: source, status: 'pending'};

					this.requestsByUid[source.uid] = request;
					this.pendingCnt += 1;

					source.fetch(this.start, this.end, this.timezone).then(function (eventDefs) {
						if (request.status !== 'cancelled') {
							request.status = 'completed';
							request.eventDefs = eventDefs;

							_this.addEventDefs(eventDefs);
							_this.pendingCnt--;
							_this.tryRelease();
						}
					}, function () { // failure
						if (request.status !== 'cancelled') {
							request.status = 'failed';

							_this.pendingCnt--;
							_this.tryRelease();
						}
					});
				},


				purgeSource: function (source) {
					var request = this.requestsByUid[source.uid];

					if (request) {
						delete this.requestsByUid[source.uid];

						if (request.status === 'pending') {
							request.status = 'cancelled';
							this.pendingCnt--;
							this.tryRelease();
						}
						else if (request.status === 'completed') {
							request.eventDefs.forEach(this.removeEventDef.bind(this));
						}
					}
				},


				purgeAllSources: function () {
					var requestsByUid = this.requestsByUid;
					var uid, request;
					var completedCnt = 0;

					for (uid in requestsByUid) {
						request = requestsByUid[uid];

						if (request.status === 'pending') {
							request.status = 'cancelled';
						}
						else if (request.status === 'completed') {
							completedCnt++;
						}
					}

					this.requestsByUid = {};
					this.pendingCnt = 0;

					if (completedCnt) {
						this.removeAllEventDefs(); // might release
					}
				},


				// Event Definitions
				// -----------------------------------------------------------------------------------------------------------------


				getEventDefByUid: function (eventDefUid) {
					return this.eventDefsByUid[eventDefUid];
				},


				getEventDefsById: function (eventDefId) {
					var a = this.eventDefsById[eventDefId];

					if (a) {
						return a.slice(); // clone
					}

					return [];
				},


				addEventDefs: function (eventDefs) {
					for (var i = 0; i < eventDefs.length; i++) {
						this.addEventDef(eventDefs[i]);
					}
				},


				addEventDef: function (eventDef) {
					var eventDefsById = this.eventDefsById;
					var eventDefId = eventDef.id;
					var eventDefs = eventDefsById[eventDefId] || (eventDefsById[eventDefId] = []);
					var eventInstances = eventDef.buildInstances(this.unzonedRange);
					var i;

					eventDefs.push(eventDef);

					this.eventDefsByUid[eventDef.uid] = eventDef;

					for (i = 0; i < eventInstances.length; i++) {
						this.addEventInstance(eventInstances[i], eventDefId);
					}
				},


				removeEventDefsById: function (eventDefId) {
					var _this = this;

					this.getEventDefsById(eventDefId).forEach(function (eventDef) {
						_this.removeEventDef(eventDef);
					});
				},


				removeAllEventDefs: function () {
					var isEmpty = $.isEmptyObject(this.eventDefsByUid);

					this.eventDefsByUid = {};
					this.eventDefsById = {};
					this.eventInstanceGroupsById = {};

					if (!isEmpty) {
						this.tryRelease();
					}
				},


				removeEventDef: function (eventDef) {
					var eventDefsById = this.eventDefsById;
					var eventDefs = eventDefsById[eventDef.id];

					delete this.eventDefsByUid[eventDef.uid];

					if (eventDefs) {
						removeExact(eventDefs, eventDef);

						if (!eventDefs.length) {
							delete eventDefsById[eventDef.id];
						}

						this.removeEventInstancesForDef(eventDef);
					}
				},


				// Event Instances
				// -----------------------------------------------------------------------------------------------------------------


				getEventInstances: function () { // TODO: consider iterator
					var eventInstanceGroupsById = this.eventInstanceGroupsById;
					var eventInstances = [];
					var id;

					for (id in eventInstanceGroupsById) {
						eventInstances.push.apply(eventInstances, // append
							eventInstanceGroupsById[id].eventInstances
						);
					}

					return eventInstances;
				},


				getEventInstancesWithId: function (eventDefId) {
					var eventInstanceGroup = this.eventInstanceGroupsById[eventDefId];

					if (eventInstanceGroup) {
						return eventInstanceGroup.eventInstances.slice(); // clone
					}

					return [];
				},


				getEventInstancesWithoutId: function (eventDefId) { // TODO: consider iterator
					var eventInstanceGroupsById = this.eventInstanceGroupsById;
					var matchingInstances = [];
					var id;

					for (id in eventInstanceGroupsById) {
						if (id !== eventDefId) {
							matchingInstances.push.apply(matchingInstances, // append
								eventInstanceGroupsById[id].eventInstances
							);
						}
					}

					return matchingInstances;
				},


				addEventInstance: function (eventInstance, eventDefId) {
					var eventInstanceGroupsById = this.eventInstanceGroupsById;
					var eventInstanceGroup = eventInstanceGroupsById[eventDefId] ||
						(eventInstanceGroupsById[eventDefId] = new EventInstanceGroup());

					eventInstanceGroup.eventInstances.push(eventInstance);

					this.tryRelease();
				},


				removeEventInstancesForDef: function (eventDef) {
					var eventInstanceGroupsById = this.eventInstanceGroupsById;
					var eventInstanceGroup = eventInstanceGroupsById[eventDef.id];
					var removeCnt;

					if (eventInstanceGroup) {
						removeCnt = removeMatching(eventInstanceGroup.eventInstances, function (currentEventInstance) {
							return currentEventInstance.def === eventDef;
						});

						if (!eventInstanceGroup.eventInstances.length) {
							delete eventInstanceGroupsById[eventDef.id];
						}

						if (removeCnt) {
							this.tryRelease();
						}
					}
				},


				// Releasing and Freezing
				// -----------------------------------------------------------------------------------------------------------------


				tryRelease: function () {
					if (!this.pendingCnt) {
						if (!this.freezeDepth) {
							this.release();
						}
						else {
							this.stuntedReleaseCnt++;
						}
					}
				},


				release: function () {
					this.releaseCnt++;
					this.trigger('release', this.eventInstanceGroupsById);
				},


				whenReleased: function () {
					var _this = this;

					if (this.releaseCnt) {
						return Promise.resolve(this.eventInstanceGroupsById);
					}
					else {
						return Promise.construct(function (onResolve) {
							_this.one('release', onResolve);
						});
					}
				},


				freeze: function () {
					if (!(this.freezeDepth++)) {
						this.stuntedReleaseCnt = 0;
					}
				},


				thaw: function () {
					if (!(--this.freezeDepth) && this.stuntedReleaseCnt && !this.pendingCnt) {
						this.release();
					}
				}

			});

			;
			;

			var EventManager = Class.extend(EmitterMixin, ListenerMixin, {

				currentPeriod: null,

				calendar: null,
				stickySource: null,
				otherSources: null, // does not include sticky source


				constructor: function (calendar) {
					this.calendar = calendar;
					this.stickySource = new ArrayEventSource(calendar);
					this.otherSources = [];
				},


				requestEvents: function (start, end, timezone, force) {
					if (
						force ||
						!this.currentPeriod ||
						!this.currentPeriod.isWithinRange(start, end) ||
						timezone !== this.currentPeriod.timezone
					) {
						this.setPeriod( // will change this.currentPeriod
							new EventPeriod(start, end, timezone)
						);
					}

					return this.currentPeriod.whenReleased();
				},


				// Source Adding/Removing
				// -----------------------------------------------------------------------------------------------------------------


				addSource: function (eventSource) {
					this.otherSources.push(eventSource);

					if (this.currentPeriod) {
						this.currentPeriod.requestSource(eventSource); // might release
					}
				},


				removeSource: function (doomedSource) {
					removeExact(this.otherSources, doomedSource);

					if (this.currentPeriod) {
						this.currentPeriod.purgeSource(doomedSource); // might release
					}
				},


				removeAllSources: function () {
					this.otherSources = [];

					if (this.currentPeriod) {
						this.currentPeriod.purgeAllSources(); // might release
					}
				},


				// Source Refetching
				// -----------------------------------------------------------------------------------------------------------------


				refetchSource: function (eventSource) {
					var currentPeriod = this.currentPeriod;

					if (currentPeriod) {
						currentPeriod.freeze();
						currentPeriod.purgeSource(eventSource);
						currentPeriod.requestSource(eventSource);
						currentPeriod.thaw();
					}
				},


				refetchAllSources: function () {
					var currentPeriod = this.currentPeriod;

					if (currentPeriod) {
						currentPeriod.freeze();
						currentPeriod.purgeAllSources();
						currentPeriod.requestSources(this.getSources());
						currentPeriod.thaw();
					}
				},


				// Source Querying
				// -----------------------------------------------------------------------------------------------------------------


				getSources: function () {
					return [this.stickySource].concat(this.otherSources);
				},


				// like querySources, but accepts multple match criteria (like multiple IDs)
				multiQuerySources: function (matchInputs) {

					// coerce into an array
					if (!matchInputs) {
						matchInputs = [];
					}
					else if (!$.isArray(matchInputs)) {
						matchInputs = [matchInputs];
					}

					var matchingSources = [];
					var i;

					// resolve raw inputs to real event source objects
					for (i = 0; i < matchInputs.length; i++) {
						matchingSources.push.apply( // append
							matchingSources,
							this.querySources(matchInputs[i])
						);
					}

					return matchingSources;
				},


				// matchInput can either by a real event source object, an ID, or the function/URL for the source.
				// returns an array of matching source objects.
				querySources: function (matchInput) {
					var sources = this.otherSources;
					var i, source;

					// given a proper event source object
					for (i = 0; i < sources.length; i++) {
						source = sources[i];

						if (source === matchInput) {
							return [source];
						}
					}

					// an ID match
					source = this.getSourceById(EventSource.normalizeId(matchInput));
					if (source) {
						return [source];
					}

					// parse as an event source
					matchInput = EventSourceParser.parse(matchInput, this.calendar);
					if (matchInput) {

						return $.grep(sources, function (source) {
							return isSourcesEquivalent(matchInput, source);
						});
					}
				},


				/*
	ID assumed to already be normalized
	*/
				getSourceById: function (id) {
					return $.grep(this.otherSources, function (source) {
						return source.id && source.id === id;
					})[0];
				},


				// Event-Period
				// -----------------------------------------------------------------------------------------------------------------


				setPeriod: function (eventPeriod) {
					if (this.currentPeriod) {
						this.unbindPeriod(this.currentPeriod);
						this.currentPeriod = null;
					}

					this.currentPeriod = eventPeriod;
					this.bindPeriod(eventPeriod);

					eventPeriod.requestSources(this.getSources());
				},


				bindPeriod: function (eventPeriod) {
					this.listenTo(eventPeriod, 'release', function (eventsPayload) {
						this.trigger('release', eventsPayload);
					});
				},


				unbindPeriod: function (eventPeriod) {
					this.stopListeningTo(eventPeriod);
				},


				// Event Getting/Adding/Removing
				// -----------------------------------------------------------------------------------------------------------------


				getEventDefByUid: function (uid) {
					if (this.currentPeriod) {
						return this.currentPeriod.getEventDefByUid(uid);
					}
				},


				addEventDef: function (eventDef, isSticky) {
					if (isSticky) {
						this.stickySource.addEventDef(eventDef);
					}

					if (this.currentPeriod) {
						this.currentPeriod.addEventDef(eventDef); // might release
					}
				},


				removeEventDefsById: function (eventId) {
					this.getSources().forEach(function (eventSource) {
						eventSource.removeEventDefsById(eventId);
					});

					if (this.currentPeriod) {
						this.currentPeriod.removeEventDefsById(eventId); // might release
					}
				},


				removeAllEventDefs: function () {
					this.getSources().forEach(function (eventSource) {
						eventSource.removeAllEventDefs();
					});

					if (this.currentPeriod) {
						this.currentPeriod.removeAllEventDefs();
					}
				},


				// Event Mutating
				// -----------------------------------------------------------------------------------------------------------------


				/*
	Returns an undo function.
	*/
				mutateEventsWithId: function (eventDefId, eventDefMutation) {
					var currentPeriod = this.currentPeriod;
					var eventDefs;
					var undoFuncs = [];

					if (currentPeriod) {

						currentPeriod.freeze();

						eventDefs = currentPeriod.getEventDefsById(eventDefId);
						eventDefs.forEach(function (eventDef) {
							// add/remove esp because id might change
							currentPeriod.removeEventDef(eventDef);
							undoFuncs.push(eventDefMutation.mutateSingle(eventDef));
							currentPeriod.addEventDef(eventDef);
						});

						currentPeriod.thaw();

						return function () {
							currentPeriod.freeze();

							for (var i = 0; i < eventDefs.length; i++) {
								currentPeriod.removeEventDef(eventDefs[i]);
								undoFuncs[i]();
								currentPeriod.addEventDef(eventDefs[i]);
							}

							currentPeriod.thaw();
						};
					}

					return function () {
					};
				},


				/*
	copies and then mutates
	*/
				buildMutatedEventInstanceGroup: function (eventDefId, eventDefMutation) {
					var eventDefs = this.getEventDefsById(eventDefId);
					var i;
					var defCopy;
					var allInstances = [];

					for (i = 0; i < eventDefs.length; i++) {
						defCopy = eventDefs[i].clone();

						if (defCopy instanceof SingleEventDef) {
							eventDefMutation.mutateSingle(defCopy);

							allInstances.push.apply(allInstances, // append
								defCopy.buildInstances()
							);
						}
					}

					return new EventInstanceGroup(allInstances);
				},


				// Freezing
				// -----------------------------------------------------------------------------------------------------------------


				freeze: function () {
					if (this.currentPeriod) {
						this.currentPeriod.freeze();
					}
				},


				thaw: function () {
					if (this.currentPeriod) {
						this.currentPeriod.thaw();
					}
				}

			});


// Methods that straight-up query the current EventPeriod for an array of results.
			[
				'getEventDefsById',
				'getEventInstances',
				'getEventInstancesWithId',
				'getEventInstancesWithoutId'
			].forEach(function (methodName) {

				EventManager.prototype[methodName] = function () {
					var currentPeriod = this.currentPeriod;

					if (currentPeriod) {
						return currentPeriod[methodName].apply(currentPeriod, arguments);
					}

					return [];
				};
			});


			function isSourcesEquivalent(source0, source1) {
				return source0.getPrimitive() == source1.getPrimitive();
			}

			;
			;

			var BUSINESS_HOUR_EVENT_DEFAULTS = {
				start: '09:00',
				end: '17:00',
				dow: [1, 2, 3, 4, 5], // monday - friday
				rendering: 'inverse-background'
				// classNames are defined in businessHoursSegClasses
			};


			var BusinessHourGenerator = FC.BusinessHourGenerator = Class.extend({

				rawComplexDef: null,
				calendar: null, // for anonymous EventSource


				constructor: function (rawComplexDef, calendar) {
					this.rawComplexDef = rawComplexDef;
					this.calendar = calendar;
				},


				buildEventInstanceGroup: function (isAllDay, unzonedRange) {
					var eventDefs = this.buildEventDefs(isAllDay);
					var eventInstanceGroup;

					if (eventDefs.length) {
						eventInstanceGroup = new EventInstanceGroup(
							eventDefsToEventInstances(eventDefs, unzonedRange)
						);

						// so that inverse-background rendering can happen even when no eventRanges in view
						eventInstanceGroup.explicitEventDef = eventDefs[0];

						return eventInstanceGroup;
					}
				},


				buildEventDefs: function (isAllDay) {
					var rawComplexDef = this.rawComplexDef;
					var rawDefs = [];
					var requireDow = false;
					var i;
					var defs = [];

					if (rawComplexDef === true) {
						rawDefs = [{}]; // will get BUSINESS_HOUR_EVENT_DEFAULTS verbatim
					}
					else if ($.isPlainObject(rawComplexDef)) {
						rawDefs = [rawComplexDef];
					}
					else if ($.isArray(rawComplexDef)) {
						rawDefs = rawComplexDef;
						requireDow = true; // every sub-definition NEEDS a day-of-week
					}

					for (i = 0; i < rawDefs.length; i++) {
						if (!requireDow || rawDefs[i].dow) {
							defs.push(
								this.buildEventDef(isAllDay, rawDefs[i])
							);
						}
					}

					return defs;
				},


				buildEventDef: function (isAllDay, rawDef) {
					var fullRawDef = $.extend({}, BUSINESS_HOUR_EVENT_DEFAULTS, rawDef);

					if (isAllDay) {
						fullRawDef.start = null;
						fullRawDef.end = null;
					}

					return RecurringEventDef.parse(
						fullRawDef,
						new EventSource(this.calendar) // dummy source
					);
				}

			});

			;
			;

			var EventDefParser = {

				parse: function (eventInput, source) {
					if (
						isTimeString(eventInput.start) || moment.isDuration(eventInput.start) ||
						isTimeString(eventInput.end) || moment.isDuration(eventInput.end)
					) {
						return RecurringEventDef.parse(eventInput, source);
					}
					else {
						return SingleEventDef.parse(eventInput, source);
					}
				}

			};

			;
			;

			var EventDef = FC.EventDef = Class.extend(ParsableModelMixin, {

				source: null, // required

				id: null, // normalized supplied ID
				rawId: null, // unnormalized supplied ID
				uid: null, // internal ID. new ID for every definition

				// NOTE: eventOrder sorting relies on these
				title: null,
				url: null,
				rendering: null,
				constraint: null,
				overlap: null,
				editable: null,
				startEditable: null,
				durationEditable: null,
				color: null,
				backgroundColor: null,
				borderColor: null,
				textColor: null,

				className: null, // an array. TODO: rename to className*s* (API breakage)
				miscProps: null,


				constructor: function (source) {
					this.source = source;
					this.className = [];
					this.miscProps = {};
				},


				isAllDay: function () {
					// subclasses must implement
				},


				buildInstances: function (unzonedRange) {
					// subclasses must implement
				},


				clone: function () {
					var copy = new this.constructor(this.source);

					copy.id = this.id;
					copy.rawId = this.rawId;
					copy.uid = this.uid; // not really unique anymore :(

					EventDef.copyVerbatimStandardProps(this, copy);

					copy.className = this.className.slice(); // copy
					copy.miscProps = $.extend({}, this.miscProps);

					return copy;
				},


				hasInverseRendering: function () {
					return this.getRendering() === 'inverse-background';
				},


				hasBgRendering: function () {
					var rendering = this.getRendering();

					return rendering === 'inverse-background' || rendering === 'background';
				},


				getRendering: function () {
					if (this.rendering != null) {
						return this.rendering;
					}

					return this.source.rendering;
				},


				getConstraint: function () {
					if (this.constraint != null) {
						return this.constraint;
					}

					if (this.source.constraint != null) {
						return this.source.constraint;
					}

					return this.source.calendar.opt('eventConstraint'); // what about View option?
				},


				getOverlap: function () {
					if (this.overlap != null) {
						return this.overlap;
					}

					if (this.source.overlap != null) {
						return this.source.overlap;
					}

					return this.source.calendar.opt('eventOverlap'); // what about View option?
				},


				isStartExplicitlyEditable: function () {
					if (this.startEditable !== null) {
						return this.startEditable;
					}

					return this.source.startEditable;
				},


				isDurationExplicitlyEditable: function () {
					if (this.durationEditable !== null) {
						return this.durationEditable;
					}

					return this.source.durationEditable;
				},


				isExplicitlyEditable: function () {
					if (this.editable !== null) {
						return this.editable;
					}

					return this.source.editable;
				},


				toLegacy: function () {
					var obj = $.extend({}, this.miscProps);

					obj._id = this.uid;
					obj.source = this.source;
					obj.className = this.className.slice(); // copy
					obj.allDay = this.isAllDay();

					if (this.rawId != null) {
						obj.id = this.rawId;
					}

					EventDef.copyVerbatimStandardProps(this, obj);

					return obj;
				},


				applyManualStandardProps: function (rawProps) {

					if (rawProps.id != null) {
						this.id = EventDef.normalizeId((this.rawId = rawProps.id));
					}
					else {
						this.id = EventDef.generateId();
					}

					if (rawProps._id != null) { // accept this prop, even tho somewhat internal
						this.uid = String(rawProps._id);
					}
					else {
						this.uid = EventDef.generateId();
					}

					// TODO: converge with EventSource
					if ($.isArray(rawProps.className)) {
						this.className = rawProps.className;
					}
					if (typeof rawProps.className === 'string') {
						this.className = rawProps.className.split(/\s+/);
					}

					return true;
				},


				applyMiscProps: function (rawProps) {
					$.extend(this.miscProps, rawProps);
				}

			});

// finish initializing the mixin
			EventDef.defineStandardProps = ParsableModelMixin_defineStandardProps;
			EventDef.copyVerbatimStandardProps = ParsableModelMixin_copyVerbatimStandardProps;


// IDs
// ---------------------------------------------------------------------------------------------------------------------
// TODO: converge with EventSource


			EventDef.uuid = 0;


			EventDef.normalizeId = function (id) {
				return String(id);
			};


			EventDef.generateId = function () {
				return '_fc' + (EventDef.uuid++);
			};


// Parsing
// ---------------------------------------------------------------------------------------------------------------------


			EventDef.defineStandardProps({
				// not automatically assigned (`false`)
				_id: false,
				id: false,
				className: false,
				source: false, // will ignored

				// automatically assigned (`true`)
				title: true,
				url: true,
				rendering: true,
				constraint: true,
				overlap: true,
				editable: true,
				startEditable: true,
				durationEditable: true,
				color: true,
				backgroundColor: true,
				borderColor: true,
				textColor: true
			});


			EventDef.parse = function (rawInput, source) {
				var def = new this(source);

				if (def.applyProps(rawInput)) {
					return def;
				}

				return false;
			};

			;
			;

			var SingleEventDef = EventDef.extend({

				dateProfile: null,


				/*
	Will receive start/end params, but will be ignored.
	*/
				buildInstances: function () {
					return [this.buildInstance()];
				},


				buildInstance: function () {
					return new EventInstance(
						this, // definition
						this.dateProfile
					);
				},


				isAllDay: function () {
					return this.dateProfile.isAllDay();
				},


				clone: function () {
					var def = EventDef.prototype.clone.call(this);

					def.dateProfile = this.dateProfile;

					return def;
				},


				rezone: function () {
					var calendar = this.source.calendar;
					var dateProfile = this.dateProfile;

					this.dateProfile = new EventDateProfile(
						calendar.moment(dateProfile.start),
						dateProfile.end ? calendar.moment(dateProfile.end) : null,
						calendar
					);
				},


				/*
	NOTE: if super-method fails, should still attempt to apply
	*/
				applyManualStandardProps: function (rawProps) {
					var superSuccess = EventDef.prototype.applyManualStandardProps.apply(this, arguments);
					var dateProfile = EventDateProfile.parse(rawProps, this.source); // returns null on failure

					if (dateProfile) {
						this.dateProfile = dateProfile;

						// make sure `date` shows up in the legacy event objects as-is
						if (rawProps.date != null) {
							this.miscProps.date = rawProps.date;
						}

						return superSuccess;
					}
					else {
						return false;
					}
				}

			});


// Parsing
// ---------------------------------------------------------------------------------------------------------------------


			SingleEventDef.defineStandardProps({ // false = manually process
				start: false,
				date: false, // alias for 'start'
				end: false,
				allDay: false
			});

			;
			;

			var RecurringEventDef = EventDef.extend({

				startTime: null, // duration
				endTime: null, // duration, or null
				dowHash: null, // object hash, or null


				isAllDay: function () {
					return !this.startTime && !this.endTime;
				},


				buildInstances: function (unzonedRange) {
					var calendar = this.source.calendar;
					var unzonedDate = unzonedRange.getStart();
					var unzonedEnd = unzonedRange.getEnd();
					var zonedDayStart;
					var instanceStart, instanceEnd;
					var instances = [];

					while (unzonedDate.isBefore(unzonedEnd)) {

						// if everyday, or this particular day-of-week
						if (!this.dowHash || this.dowHash[unzonedDate.day()]) {

							zonedDayStart = calendar.applyTimezone(unzonedDate);
							instanceStart = zonedDayStart.clone();
							instanceEnd = null;

							if (this.startTime) {
								instanceStart.time(this.startTime);
							}
							else {
								instanceStart.stripTime();
							}

							if (this.endTime) {
								instanceEnd = zonedDayStart.clone().time(this.endTime);
							}

							instances.push(
								new EventInstance(
									this, // definition
									new EventDateProfile(instanceStart, instanceEnd, calendar)
								)
							);
						}

						unzonedDate.add(1, 'days');
					}

					return instances;
				},


				setDow: function (dowNumbers) {

					if (!this.dowHash) {
						this.dowHash = {};
					}

					for (var i = 0; i < dowNumbers.length; i++) {
						this.dowHash[dowNumbers[i]] = true;
					}
				},


				clone: function () {
					var def = EventDef.prototype.clone.call(this);

					if (def.startTime) {
						def.startTime = moment.duration(this.startTime);
					}

					if (def.endTime) {
						def.endTime = moment.duration(this.endTime);
					}

					if (this.dowHash) {
						def.dowHash = $.extend({}, this.dowHash);
					}

					return def;
				},


				/*
	NOTE: if super-method fails, should still attempt to apply
	*/
				applyProps: function (rawProps) {
					var superSuccess = EventDef.prototype.applyProps.apply(this, arguments);

					if (rawProps.start) {
						this.startTime = moment.duration(rawProps.start);
					}

					if (rawProps.end) {
						this.endTime = moment.duration(rawProps.end);
					}

					if (rawProps.dow) {
						this.setDow(rawProps.dow);
					}

					return superSuccess;
				}

			});


// Parsing
// ---------------------------------------------------------------------------------------------------------------------


			RecurringEventDef.defineStandardProps({ // false = manually process
				start: false,
				end: false,
				dow: false
			});

			;
			;

			var EventInstance = Class.extend({

				def: null, // EventDef
				dateProfile: null, // EventDateProfile


				constructor: function (def, dateProfile) {
					this.def = def;
					this.dateProfile = dateProfile;
				},


				toLegacy: function () {
					var dateProfile = this.dateProfile;
					var obj = this.def.toLegacy();

					obj.start = dateProfile.start.clone();
					obj.end = dateProfile.end ? dateProfile.end.clone() : null;

					return obj;
				}

			});

			;
			;

			/*
It's expected that there will be at least one EventInstance,
OR that an explicitEventDef is assigned.
*/
			var EventInstanceGroup = FC.EventInstanceGroup = Class.extend({

				eventInstances: null,
				explicitEventDef: null, // optional


				constructor: function (eventInstances) {
					this.eventInstances = eventInstances || [];
				},


				getAllEventRanges: function (constraintRange) {
					if (constraintRange) {
						return this.sliceNormalRenderRanges(constraintRange);
					}
					else {
						return this.eventInstances.map(eventInstanceToEventRange);
					}
				},


				sliceRenderRanges: function (constraintRange) {
					if (this.isInverse()) {
						return this.sliceInverseRenderRanges(constraintRange);
					}
					else {
						return this.sliceNormalRenderRanges(constraintRange);
					}
				},


				sliceNormalRenderRanges: function (constraintRange) {
					var eventInstances = this.eventInstances;
					var i, eventInstance;
					var slicedRange;
					var slicedEventRanges = [];

					for (i = 0; i < eventInstances.length; i++) {
						eventInstance = eventInstances[i];

						slicedRange = eventInstance.dateProfile.unzonedRange.intersect(constraintRange);

						if (slicedRange) {
							slicedEventRanges.push(
								new EventRange(
									slicedRange,
									eventInstance.def,
									eventInstance
								)
							);
						}
					}

					return slicedEventRanges;
				},


				sliceInverseRenderRanges: function (constraintRange) {
					var unzonedRanges = this.eventInstances.map(eventInstanceToUnzonedRange);
					var ownerDef = this.getEventDef();

					unzonedRanges = invertUnzonedRanges(unzonedRanges, constraintRange);

					return unzonedRanges.map(function (unzonedRange) {
						return new EventRange(unzonedRange, ownerDef); // don't give an EventInstance
					});
				},


				isInverse: function () {
					return this.getEventDef().hasInverseRendering();
				},


				getEventDef: function () {
					return this.explicitEventDef || this.eventInstances[0].def;
				}

			});

			;
			;

			/*
Meant to be immutable
*/
			var EventDateProfile = Class.extend({

				start: null,
				end: null,
				unzonedRange: null,


				constructor: function (start, end, calendar) {
					this.start = start;
					this.end = end || null;
					this.unzonedRange = this.buildUnzonedRange(calendar);
				},


				isAllDay: function () { // why recompute this every time?
					return !(this.start.hasTime() || (this.end && this.end.hasTime()));
				},


				/*
	Needs a Calendar object
	*/
				buildUnzonedRange: function (calendar) {
					var startMs = this.start.clone().stripZone().valueOf();
					var endMs = this.getEnd(calendar).stripZone().valueOf();

					return new UnzonedRange(startMs, endMs);
				},


				/*
	Needs a Calendar object
	*/
				getEnd: function (calendar) {
					return this.end ?
						this.end.clone() :
						// derive the end from the start and allDay. compute allDay if necessary
						calendar.getDefaultEventEnd(
							this.isAllDay(),
							this.start
						);
				}

			});


			EventDateProfile.isStandardProp = function (propName) {
				return propName === 'start' || propName === 'date' || propName === 'end' || propName === 'allDay';
			};


			/*
Needs an EventSource object
*/
			EventDateProfile.parse = function (rawProps, source) {
				var startInput = rawProps.start || rawProps.date;
				var endInput = rawProps.end;

				if (!startInput) {
					return false;
				}

				var calendar = source.calendar;
				var start = calendar.moment(startInput);
				var end = endInput ? calendar.moment(endInput) : null;
				var forcedAllDay = rawProps.allDay;
				var forceEventDuration = calendar.opt('forceEventDuration');

				if (!start.isValid()) {
					return false;
				}

				if (end && (!end.isValid() || !end.isAfter(start))) {
					end = null;
				}

				if (forcedAllDay == null) {
					forcedAllDay = source.allDayDefault;
					if (forcedAllDay == null) {
						forcedAllDay = calendar.opt('allDayDefault');
					}
				}

				if (forcedAllDay === true) {
					start.stripTime();
					if (end) {
						end.stripTime();
					}
				}
				else if (forcedAllDay === false) {
					if (!start.hasTime()) {
						start.time(0);
					}
					if (end && !end.hasTime()) {
						end.time(0);
					}
				}

				if (!end && forceEventDuration) {
					end = calendar.getDefaultEventEnd(!start.hasTime(), start);
				}

				return new EventDateProfile(start, end, calendar);
			};

			;
			;

			var EventRange = Class.extend({

				unzonedRange: null,
				eventDef: null,
				eventInstance: null, // optional


				constructor: function (unzonedRange, eventDef, eventInstance) {
					this.unzonedRange = unzonedRange;
					this.eventDef = eventDef;

					if (eventInstance) {
						this.eventInstance = eventInstance;
					}
				}

			});

			;
			;

			var EventFootprint = FC.EventFootprint = Class.extend({

				componentFootprint: null,
				eventDef: null,
				eventInstance: null, // optional


				constructor: function (componentFootprint, eventDef, eventInstance) {
					this.componentFootprint = componentFootprint;
					this.eventDef = eventDef;

					if (eventInstance) {
						this.eventInstance = eventInstance;
					}
				},


				getEventLegacy: function () {
					return (this.eventInstance || this.eventDef).toLegacy();
				}

			});

			;
			;

			var EventDefMutation = FC.EventDefMutation = Class.extend({

				// won't ever be empty. will be null instead.
				// callers should use setDateMutation for setting.
				dateMutation: null,

				// hacks to get updateEvent/createFromRawProps to work.
				// not undo-able and not considered in isEmpty.
				eventDefId: null, // standard manual props
				className: null, // "
				verbatimStandardProps: null,
				miscProps: null,


				/*
	eventDef assumed to be a SingleEventDef.
	returns an undo function.
	*/
				mutateSingle: function (eventDef) {
					var origDateProfile;

					if (this.dateMutation) {
						origDateProfile = eventDef.dateProfile;

						eventDef.dateProfile = this.dateMutation.buildNewDateProfile(
							origDateProfile,
							eventDef.source.calendar
						);
					}

					// can't undo
					// TODO: more DRY with EventDef::applyManualStandardProps
					if (this.eventDefId != null) {
						eventDef.id = EventDef.normalizeId((eventDef.rawId = this.eventDefId));
					}

					// can't undo
					// TODO: more DRY with EventDef::applyManualStandardProps
					if (this.className) {
						eventDef.className = this.className;
					}

					// can't undo
					if (this.verbatimStandardProps) {
						SingleEventDef.copyVerbatimStandardProps(
							this.verbatimStandardProps, // src
							eventDef // dest
						);
					}

					// can't undo
					if (this.miscProps) {
						eventDef.applyMiscProps(this.miscProps);
					}

					if (origDateProfile) {
						return function () {
							eventDef.dateProfile = origDateProfile;
						};
					}
					else {
						return function () {
						};
					}
				},


				setDateMutation: function (dateMutation) {
					if (dateMutation && !dateMutation.isEmpty()) {
						this.dateMutation = dateMutation;
					}
					else {
						this.dateMutation = null;
					}
				},


				isEmpty: function () {
					return !this.dateMutation;
				}

			});


			EventDefMutation.createFromRawProps = function (eventInstance, rawProps, largeUnit) {
				var eventDef = eventInstance.def;
				var dateProps = {};
				var standardProps = {};
				var miscProps = {};
				var verbatimStandardProps = {};
				var eventDefId = null;
				var className = null;
				var propName;
				var dateProfile;
				var dateMutation;
				var defMutation;

				for (propName in rawProps) {
					if (EventDateProfile.isStandardProp(propName)) {
						dateProps[propName] = rawProps[propName];
					}
					else if (eventDef.isStandardProp(propName)) {
						standardProps[propName] = rawProps[propName];
					}
					else if (eventDef.miscProps[propName] !== rawProps[propName]) { // only if changed
						miscProps[propName] = rawProps[propName];
					}
				}

				dateProfile = EventDateProfile.parse(dateProps, eventDef.source);

				if (dateProfile) { // no failure?
					dateMutation = EventDefDateMutation.createFromDiff(
						eventInstance.dateProfile,
						dateProfile,
						largeUnit
					);
				}

				if (standardProps.id !== eventDef.id) {
					eventDefId = standardProps.id; // only apply if there's a change
				}

				if (!isArraysEqual(standardProps.className, eventDef.className)) {
					className = standardProps.className; // only apply if there's a change
				}

				EventDef.copyVerbatimStandardProps(
					standardProps, // src
					verbatimStandardProps // dest
				);

				defMutation = new EventDefMutation();
				defMutation.eventDefId = eventDefId;
				defMutation.className = className;
				defMutation.verbatimStandardProps = verbatimStandardProps;
				defMutation.miscProps = miscProps;

				if (dateMutation) {
					defMutation.dateMutation = dateMutation;
				}

				return defMutation;
			};

			;
			;

			var EventDefDateMutation = Class.extend({

				clearEnd: false,
				forceTimed: false,
				forceAllDay: false,

				// Durations. if 0-ms duration, will be null instead.
				// Callers should not set this directly.
				dateDelta: null,
				startDelta: null,
				endDelta: null,


				/*
	returns an undo function.
	*/
				buildNewDateProfile: function (eventDateProfile, calendar) {
					var start = eventDateProfile.start.clone();
					var end = null;
					var shouldRezone = false;

					if (eventDateProfile.end && !this.clearEnd) {
						end = eventDateProfile.end.clone();
					}
					// if there will be an end-date mutation, guarantee an end,
					// ambigously-zoned according to the original allDay
					else if (this.endDelta && !end) {
						end = calendar.getDefaultEventEnd(eventDateProfile.isAllDay(), start);
					}

					if (this.forceTimed) {
						shouldRezone = true;

						if (!start.hasTime()) {
							start.time(0);
						}

						if (end && !end.hasTime()) {
							end.time(0);
						}
					}
					else if (this.forceAllDay) {

						if (start.hasTime()) {
							start.stripTime();
						}

						if (end && end.hasTime()) {
							end.stripTime();
						}
					}

					if (this.dateDelta) {
						shouldRezone = true;

						start.add(this.dateDelta);

						if (end) {
							end.add(this.dateDelta);
						}
					}

					// do this before adding startDelta to start, so we can work off of start
					if (this.endDelta) {
						shouldRezone = true;

						end.add(this.endDelta);
					}

					if (this.startDelta) {
						shouldRezone = true;

						start.add(this.startDelta);
					}

					if (shouldRezone) {
						start = calendar.applyTimezone(start);

						if (end) {
							end = calendar.applyTimezone(end);
						}
					}

					// TODO: okay to access calendar option?
					if (!end && calendar.opt('forceEventDuration')) {
						end = calendar.getDefaultEventEnd(eventDateProfile.isAllDay(), start);
					}

					return new EventDateProfile(start, end, calendar);
				},


				setDateDelta: function (dateDelta) {
					if (dateDelta && dateDelta.valueOf()) {
						this.dateDelta = dateDelta;
					}
					else {
						this.dateDelta = null;
					}
				},


				setStartDelta: function (startDelta) {
					if (startDelta && startDelta.valueOf()) {
						this.startDelta = startDelta;
					}
					else {
						this.startDelta = null;
					}
				},


				setEndDelta: function (endDelta) {
					if (endDelta && endDelta.valueOf()) {
						this.endDelta = endDelta;
					}
					else {
						this.endDelta = null;
					}
				},


				isEmpty: function () {
					return !this.clearEnd && !this.forceTimed && !this.forceAllDay &&
						!this.dateDelta && !this.startDelta && !this.endDelta;
				}

			});


			EventDefDateMutation.createFromDiff = function (dateProfile0, dateProfile1, largeUnit) {
				var clearEnd = dateProfile0.end && !dateProfile1.end;
				var forceTimed = dateProfile0.isAllDay() && !dateProfile1.isAllDay();
				var forceAllDay = !dateProfile0.isAllDay() && dateProfile1.isAllDay();
				var dateDelta;
				var endDiff;
				var endDelta;
				var mutation;

				// subtracts the dates in the appropriate way, returning a duration
				function subtractDates(date1, date0) { // date1 - date0
					if (largeUnit) {
						return diffByUnit(date1, date0, largeUnit); // poorly named
					}
					else if (dateProfile1.isAllDay()) {
						return diffDay(date1, date0); // poorly named
					}
					else {
						return diffDayTime(date1, date0); // poorly named
					}
				}

				dateDelta = subtractDates(dateProfile1.start, dateProfile0.start);

				if (dateProfile1.end) {
					// use unzonedRanges because dateProfile0.end might be null
					endDiff = subtractDates(
						dateProfile1.unzonedRange.getEnd(),
						dateProfile0.unzonedRange.getEnd()
					);
					endDelta = endDiff.subtract(dateDelta);
				}

				mutation = new EventDefDateMutation();
				mutation.clearEnd = clearEnd;
				mutation.forceTimed = forceTimed;
				mutation.forceAllDay = forceAllDay;
				mutation.setDateDelta(dateDelta);
				mutation.setEndDelta(endDelta);

				return mutation;
			};

			;
			;

			function eventDefsToEventInstances(eventDefs, unzonedRange) {
				var eventInstances = [];
				var i;

				for (i = 0; i < eventDefs.length; i++) {
					eventInstances.push.apply(eventInstances, // append
						eventDefs[i].buildInstances(unzonedRange)
					);
				}

				return eventInstances;
			}


			function eventInstanceToEventRange(eventInstance) {
				return new EventRange(
					eventInstance.dateProfile.unzonedRange,
					eventInstance.def,
					eventInstance
				);
			}


			function eventRangeToEventFootprint(eventRange) {
				return new EventFootprint(
					new ComponentFootprint(
						eventRange.unzonedRange,
						eventRange.eventDef.isAllDay()
					),
					eventRange.eventDef,
					eventRange.eventInstance // might not exist
				);
			}


			function eventInstanceToUnzonedRange(eventInstance) {
				return eventInstance.dateProfile.unzonedRange;
			}


			function eventFootprintToComponentFootprint(eventFootprint) {
				return eventFootprint.componentFootprint;
			}

			;
			;

			var EventSource = Class.extend(ParsableModelMixin, {

				calendar: null,

				id: null, // can stay null
				uid: null,
				color: null,
				backgroundColor: null,
				borderColor: null,
				textColor: null,
				className: null, // array
				editable: null,
				startEditable: null,
				durationEditable: null,
				rendering: null,
				overlap: null,
				constraint: null,
				allDayDefault: null,
				eventDataTransform: null, // optional function


				// can we do away with calendar? at least for the abstract?
				// useful for buildEventDef
				constructor: function (calendar) {
					this.calendar = calendar;
					this.className = [];
					this.uid = String(EventSource.uuid++);
				},


				fetch: function (start, end, timezone) {
					// subclasses must implement. must return a promise.
				},


				removeEventDefsById: function (eventDefId) {
					// optional for subclasses to implement
				},


				removeAllEventDefs: function () {
					// optional for subclasses to implement
				},


				/*
	For compairing/matching
	*/
				getPrimitive: function (otherSource) {
					// subclasses must implement
				},


				parseEventDefs: function (rawEventDefs) {
					var i;
					var eventDef;
					var eventDefs = [];

					for (i = 0; i < rawEventDefs.length; i++) {
						eventDef = this.parseEventDef(rawEventDefs[i]);

						if (eventDef) {
							eventDefs.push(eventDef);
						}
					}

					return eventDefs;
				},


				parseEventDef: function (rawInput) {
					var calendarTransform = this.calendar.opt('eventDataTransform');
					var sourceTransform = this.eventDataTransform;

					if (calendarTransform) {
						rawInput = calendarTransform(rawInput);
					}
					if (sourceTransform) {
						rawInput = sourceTransform(rawInput);
					}

					return EventDefParser.parse(rawInput, this);
				},


				applyManualStandardProps: function (rawProps) {

					if (rawProps.id != null) {
						this.id = EventSource.normalizeId(rawProps.id);
					}

					// TODO: converge with EventDef
					if ($.isArray(rawProps.className)) {
						this.className = rawProps.className;
					}
					else if (typeof rawProps.className === 'string') {
						this.className = rawProps.className.split(/\s+/);
					}

					return true;
				}

			});


// finish initializing the mixin
			EventSource.defineStandardProps = ParsableModelMixin_defineStandardProps;


// IDs
// ---------------------------------------------------------------------------------------------------------------------
// TODO: converge with EventDef


			EventSource.uuid = 0;


			EventSource.normalizeId = function (id) {
				if (id) {
					return String(id);
				}

				return null;
			};


// Parsing
// ---------------------------------------------------------------------------------------------------------------------


			EventSource.defineStandardProps({
				// manually process...
				id: false,
				className: false,

				// automatically transfer...
				color: true,
				backgroundColor: true,
				borderColor: true,
				textColor: true,
				editable: true,
				startEditable: true,
				durationEditable: true,
				rendering: true,
				overlap: true,
				constraint: true,
				allDayDefault: true,
				eventDataTransform: true
			});


			/*
rawInput can be any data type!
*/
			EventSource.parse = function (rawInput, calendar) {
				var source = new this(calendar);

				if (typeof rawInput === 'object') {
					if (source.applyProps(rawInput)) {
						return source;
					}
				}

				return false;
			};


			FC.EventSource = EventSource;

			;
			;

			var EventSourceParser = {

				sourceClasses: [],


				registerClass: function (EventSourceClass) {
					this.sourceClasses.unshift(EventSourceClass); // give highest priority
				},


				parse: function (rawInput, calendar) {
					var sourceClasses = this.sourceClasses;
					var i;
					var eventSource;

					for (i = 0; i < sourceClasses.length; i++) {
						eventSource = sourceClasses[i].parse(rawInput, calendar);

						if (eventSource) {
							return eventSource;
						}
					}
				}

			};


			FC.EventSourceParser = EventSourceParser;

			;
			;

			var ArrayEventSource = EventSource.extend({

				rawEventDefs: null, // unparsed
				eventDefs: null,
				currentTimezone: null,


				constructor: function (calendar) {
					EventSource.apply(this, arguments); // super-constructor
					this.eventDefs = []; // for if setRawEventDefs is never called
				},


				setRawEventDefs: function (rawEventDefs) {
					this.rawEventDefs = rawEventDefs;
					this.eventDefs = this.parseEventDefs(rawEventDefs);
				},


				fetch: function (start, end, timezone) {
					var eventDefs = this.eventDefs;
					var i;

					if (
						this.currentTimezone !== null &&
						this.currentTimezone !== timezone
					) {
						for (i = 0; i < eventDefs.length; i++) {
							if (eventDefs[i] instanceof SingleEventDef) {
								eventDefs[i].rezone();
							}
						}
					}

					this.currentTimezone = timezone;

					return Promise.resolve(eventDefs);
				},


				addEventDef: function (eventDef) {
					this.eventDefs.push(eventDef);
				},


				/*
	eventDefId already normalized to a string
	*/
				removeEventDefsById: function (eventDefId) {
					return removeMatching(this.eventDefs, function (eventDef) {
						return eventDef.id === eventDefId;
					});
				},


				removeAllEventDefs: function () {
					this.eventDefs = [];
				},


				getPrimitive: function () {
					return this.rawEventDefs;
				},


				applyManualStandardProps: function (rawProps) {
					var superSuccess = EventSource.prototype.applyManualStandardProps.apply(this, arguments);

					this.setRawEventDefs(rawProps.events);

					return superSuccess;
				}

			});


			ArrayEventSource.defineStandardProps({
				events: false // don't automatically transfer
			});


			ArrayEventSource.parse = function (rawInput, calendar) {
				var rawProps;

				// normalize raw input
				if ($.isArray(rawInput.events)) { // extended form
					rawProps = rawInput;
				}
				else if ($.isArray(rawInput)) { // short form
					rawProps = {events: rawInput};
				}

				if (rawProps) {
					return EventSource.parse.call(this, rawProps, calendar);
				}

				return false;
			};


			EventSourceParser.registerClass(ArrayEventSource);

			FC.ArrayEventSource = ArrayEventSource;

			;
			;

			var FuncEventSource = EventSource.extend({

				func: null,


				fetch: function (start, end, timezone) {
					var _this = this;

					this.calendar.pushLoading();

					return Promise.construct(function (onResolve) {
						_this.func.call(
							_this.calendar,
							start.clone(),
							end.clone(),
							timezone,
							function (rawEventDefs) {
								_this.calendar.popLoading();

								onResolve(_this.parseEventDefs(rawEventDefs));
							}
						);
					});
				},


				getPrimitive: function () {
					return this.func;
				},


				applyManualStandardProps: function (rawProps) {
					var superSuccess = EventSource.prototype.applyManualStandardProps.apply(this, arguments);

					this.func = rawProps.events;

					return superSuccess;
				}

			});


			FuncEventSource.defineStandardProps({
				events: false // don't automatically transfer
			});


			FuncEventSource.parse = function (rawInput, calendar) {
				var rawProps;

				// normalize raw input
				if ($.isFunction(rawInput.events)) { // extended form
					rawProps = rawInput;
				}
				else if ($.isFunction(rawInput)) { // short form
					rawProps = {events: rawInput};
				}

				if (rawProps) {
					return EventSource.parse.call(this, rawProps, calendar);
				}

				return false;
			};


			EventSourceParser.registerClass(FuncEventSource);

			FC.FuncEventSource = FuncEventSource;

			;
			;

			var JsonFeedEventSource = EventSource.extend({

				// these props must all be manually set before calling fetch
				url: null,
				startParam: null,
				endParam: null,
				timezoneParam: null,
				ajaxSettings: null, // does not include url


				fetch: function (start, end, timezone) {
					var _this = this;
					var ajaxSettings = this.ajaxSettings;
					var onSuccess = ajaxSettings.success;
					var onError = ajaxSettings.error;
					var requestParams = this.buildRequestParams(start, end, timezone);

					// todo: eventually handle the promise's then,
					// don't intercept success/error
					// tho will be a breaking API change

					this.calendar.pushLoading();

					return Promise.construct(function (onResolve, onReject) {
						$.ajax($.extend(
							{}, // destination
							JsonFeedEventSource.AJAX_DEFAULTS,
							ajaxSettings,
							{
								url: _this.url,
								data: requestParams,
								success: function (rawEventDefs) {
									var callbackRes;

									_this.calendar.popLoading();

									if (rawEventDefs) {
										callbackRes = applyAll(onSuccess, this, arguments); // redirect `this`

										if ($.isArray(callbackRes)) {
											rawEventDefs = callbackRes;
										}

										onResolve(_this.parseEventDefs(rawEventDefs));
									}
									else {
										onReject();
									}
								},
								error: function () {
									_this.calendar.popLoading();

									applyAll(onError, this, arguments); // redirect `this`
									onReject();
								}
							}
						));
					});
				},


				buildRequestParams: function (start, end, timezone) {
					var calendar = this.calendar;
					var ajaxSettings = this.ajaxSettings;
					var startParam, endParam, timezoneParam;
					var customRequestParams;
					var params = {};

					startParam = this.startParam;
					if (startParam == null) {
						startParam = calendar.opt('startParam');
					}

					endParam = this.endParam;
					if (endParam == null) {
						endParam = calendar.opt('endParam');
					}

					timezoneParam = this.timezoneParam;
					if (timezoneParam == null) {
						timezoneParam = calendar.opt('timezoneParam');
					}

					// retrieve any outbound GET/POST $.ajax data from the options
					if ($.isFunction(ajaxSettings.data)) {
						// supplied as a function that returns a key/value object
						customRequestParams = ajaxSettings.data();
					}
					else {
						// probably supplied as a straight key/value object
						customRequestParams = ajaxSettings.data || {};
					}

					$.extend(params, customRequestParams);

					params[startParam] = start.format();
					params[endParam] = end.format();

					if (timezone && timezone !== 'local') {
						params[timezoneParam] = timezone;
					}

					return params;
				},


				getPrimitive: function () {
					return this.url;
				},


				applyMiscProps: function (rawProps) {
					EventSource.prototype.applyMiscProps.apply(this, arguments);

					this.ajaxSettings = rawProps;
				}

			});


			JsonFeedEventSource.AJAX_DEFAULTS = {
				dataType: 'json',
				cache: false
			};


			JsonFeedEventSource.defineStandardProps({
				// automatically transfer (true)...
				url: true,
				startParam: true,
				endParam: true,
				timezoneParam: true
			});


			JsonFeedEventSource.parse = function (rawInput, calendar) {
				var rawProps;

				// normalize raw input
				if (typeof rawInput.url === 'string') { // extended form
					rawProps = rawInput;
				}
				else if (typeof rawInput === 'string') { // short form
					rawProps = {url: rawInput};
				}

				if (rawProps) {
					return EventSource.parse.call(this, rawProps, calendar);
				}

				return false;
			};


			EventSourceParser.registerClass(JsonFeedEventSource);

			FC.JsonFeedEventSource = JsonFeedEventSource;

			;
			;

			var ThemeRegistry = FC.ThemeRegistry = {

				themeClassHash: {},


				register: function (themeName, themeClass) {
					this.themeClassHash[themeName] = themeClass;
				},


				getThemeClass: function (themeSetting) {
					if (!themeSetting) {
						return StandardTheme;
					}
					else if (themeSetting === true) {
						return JqueryUiTheme;
					}
					else {
						return this.themeClassHash[themeSetting];
					}
				}

			};

			;
			;

			var Theme = FC.Theme = Class.extend({

				classes: {},
				iconClasses: {},
				baseIconClass: '',
				iconOverrideOption: null,
				iconOverrideCustomButtonOption: null,
				iconOverridePrefix: '',


				constructor: function (optionsModel) {
					this.optionsModel = optionsModel;
					this.processIconOverride();
				},


				processIconOverride: function () {
					if (this.iconOverrideOption) {
						this.setIconOverride(
							this.optionsModel.get(this.iconOverrideOption)
						);
					}
				},


				setIconOverride: function (iconOverrideHash) {
					var iconClassesCopy;
					var buttonName;

					if ($.isPlainObject(iconOverrideHash)) {
						iconClassesCopy = $.extend({}, this.iconClasses);

						for (buttonName in iconOverrideHash) {
							iconClassesCopy[buttonName] = this.applyIconOverridePrefix(
								iconOverrideHash[buttonName]
							);
						}

						this.iconClasses = iconClassesCopy;
					}
					else if (iconOverrideHash === false) {
						this.iconClasses = {};
					}
				},


				applyIconOverridePrefix: function (className) {
					var prefix = this.iconOverridePrefix;

					if (prefix && className.indexOf(prefix) !== 0) { // if not already present
						className = prefix + className;
					}

					return className;
				},


				getClass: function (key) {
					return this.classes[key] || '';
				},


				getIconClass: function (buttonName) {
					var className = this.iconClasses[buttonName];

					if (className) {
						return this.baseIconClass + ' ' + className;
					}

					return '';
				},


				getCustomButtonIconClass: function (customButtonProps) {
					var className;

					if (this.iconOverrideCustomButtonOption) {
						className = customButtonProps[this.iconOverrideCustomButtonOption];

						if (className) {
							return this.baseIconClass + ' ' + this.applyIconOverridePrefix(className);
						}
					}

					return '';
				}

			});

			;
			;

			var StandardTheme = Theme.extend({

				classes: {
					widget: 'fc-unthemed',
					widgetHeader: 'fc-widget-header',
					widgetContent: 'fc-widget-content',

					buttonGroup: 'fc-button-group',
					button: 'fc-button',
					cornerLeft: 'fc-corner-left',
					cornerRight: 'fc-corner-right',
					stateDefault: 'fc-state-default',
					stateActive: 'fc-state-active',
					stateDisabled: 'fc-state-disabled',
					stateHover: 'fc-state-hover',
					stateDown: 'fc-state-down',

					popoverHeader: 'fc-widget-header',
					popoverContent: 'fc-widget-content',

					// day grid
					headerRow: 'fc-widget-header',
					dayRow: 'fc-widget-content',

					// list view
					listView: 'fc-widget-content'
				},

				baseIconClass: 'fc-icon',
				iconClasses: {
					close: 'fc-icon-x',
					prev: 'fc-icon-left-single-arrow',
					next: 'fc-icon-right-single-arrow',
					prevYear: 'fc-icon-left-double-arrow',
					nextYear: 'fc-icon-right-double-arrow'
				},

				iconOverrideOption: 'buttonIcons',
				iconOverrideCustomButtonOption: 'icon',
				iconOverridePrefix: 'fc-icon-'

			});

			ThemeRegistry.register('standard', StandardTheme);

			;
			;

			var JqueryUiTheme = Theme.extend({

				classes: {
					widget: 'ui-widget',
					widgetHeader: 'ui-widget-header',
					widgetContent: 'ui-widget-content',

					buttonGroup: 'fc-button-group',
					button: 'ui-button',
					cornerLeft: 'ui-corner-left',
					cornerRight: 'ui-corner-right',
					stateDefault: 'ui-state-default',
					stateActive: 'ui-state-active',
					stateDisabled: 'ui-state-disabled',
					stateHover: 'ui-state-hover',
					stateDown: 'ui-state-down',

					today: 'ui-state-highlight',

					popoverHeader: 'ui-widget-header',
					popoverContent: 'ui-widget-content',

					// day grid
					headerRow: 'ui-widget-header',
					dayRow: 'ui-widget-content',

					// list view
					listView: 'ui-widget-content'
				},

				baseIconClass: 'ui-icon',
				iconClasses: {
					close: 'ui-icon-closethick',
					prev: 'ui-icon-circle-triangle-w',
					next: 'ui-icon-circle-triangle-e',
					prevYear: 'ui-icon-seek-prev',
					nextYear: 'ui-icon-seek-next'
				},

				iconOverrideOption: 'themeButtonIcons',
				iconOverrideCustomButtonOption: 'themeIcon',
				iconOverridePrefix: 'ui-icon-'

			});

			ThemeRegistry.register('jquery-ui', JqueryUiTheme);

			;
			;

			var BootstrapTheme = Theme.extend({

				classes: {
					widget: 'fc-bootstrap3',

					tableGrid: 'table-bordered', // avoid `table` class b/c don't want margins. only border color
					tableList: 'table table-striped', // `table` class creates bottom margin but who cares

					buttonGroup: 'btn-group',
					button: 'btn btn-default',
					stateActive: 'active',
					stateDisabled: 'disabled',

					today: 'alert alert-info', // the plain `info` class requires `.table`, too much to ask

					popover: 'panel panel-default',
					popoverHeader: 'panel-heading',
					popoverContent: 'panel-body',

					// day grid
					headerRow: 'panel-default', // avoid `panel` class b/c don't want margins/radius. only border color
					dayRow: 'panel-default', // "

					// list view
					listView: 'panel panel-default'
				},

				baseIconClass: 'glyphicon',
				iconClasses: {
					close: 'glyphicon-remove',
					prev: 'glyphicon-chevron-left',
					next: 'glyphicon-chevron-right',
					prevYear: 'glyphicon-backward',
					nextYear: 'glyphicon-forward'
				},

				iconOverrideOption: 'bootstrapGlyphicons',
				iconOverrideCustomButtonOption: 'bootstrapGlyphicon',
				iconOverridePrefix: 'glyphicon-'

			});

			ThemeRegistry.register('bootstrap3', BootstrapTheme);

			;
			;

			var DayGridFillRenderer = FillRenderer.extend({

				fillSegTag: 'td', // override the default tag name


				attachSegEls: function (type, segs) {
					var nodes = [];
					var i, seg;
					var skeletonEl;

					for (i = 0; i < segs.length; i++) {
						seg = segs[i];
						skeletonEl = this.renderFillRow(type, seg);
						this.component.rowEls.eq(seg.row).append(skeletonEl);
						nodes.push(skeletonEl[0]);
					}

					return nodes;
				},


				// Generates the HTML needed for one row of a fill. Requires the seg's el to be rendered.
				renderFillRow: function (type, seg) {
					var colCnt = this.component.colCnt;
					var startCol = seg.leftCol;
					var endCol = seg.rightCol + 1;
					var className;
					var skeletonEl;
					var trEl;

					if (type === 'businessHours') {
						className = 'bgevent';
					}
					else {
						className = type.toLowerCase();
					}

					skeletonEl = $(
						'<div class="fc-' + className + '-skeleton">' +
						'<table><tr/></table>' +
						'</div>'
					);
					trEl = skeletonEl.find('tr');

					if (startCol > 0) {
						trEl.append('<td colspan="' + startCol + '"/>');
					}

					trEl.append(
						seg.el.attr('colspan', endCol - startCol)
					);

					if (endCol < colCnt) {
						trEl.append('<td colspan="' + (colCnt - endCol) + '"/>');
					}

					this.component.bookendCells(trEl);

					return skeletonEl;
				}
			});

			;
			;

			/* Event-rendering methods for the DayGrid class
----------------------------------------------------------------------------------------------------------------------*/

			var DayGridEventRenderer = EventRenderer.extend({

				dayGrid: null,
				rowStructs: null, // an array of objects, each holding information about a row's foreground event-rendering


				constructor: function (dayGrid) {
					EventRenderer.apply(this, arguments);

					this.dayGrid = dayGrid;
				},


				renderBgRanges: function (eventRanges) {
					// don't render timed background events
					eventRanges = $.grep(eventRanges, function (eventRange) {
						return eventRange.eventDef.isAllDay();
					});

					EventRenderer.prototype.renderBgRanges.call(this, eventRanges);
				},


				// Renders the given foreground event segments onto the grid
				renderFgSegs: function (segs) {
					var rowStructs = this.rowStructs = this.renderSegRows(segs);

					// append to each row's content skeleton
					this.dayGrid.rowEls.each(function (i, rowNode) {
						$(rowNode).find('.fc-content-skeleton > table').append(
							rowStructs[i].tbodyEl
						);
					});
				},


				// Unrenders all currently rendered foreground event segments
				unrenderFgSegs: function () {
					var rowStructs = this.rowStructs || [];
					var rowStruct;

					while ((rowStruct = rowStructs.pop())) {
						rowStruct.tbodyEl.remove();
					}

					this.rowStructs = null;
				},


				// Uses the given events array to generate <tbody> elements that should be appended to each row's content skeleton.
				// Returns an array of rowStruct objects (see the bottom of `renderSegRow`).
				// PRECONDITION: each segment shoud already have a rendered and assigned `.el`
				renderSegRows: function (segs) {
					var rowStructs = [];
					var segRows;
					var row;

					segRows = this.groupSegRows(segs); // group into nested arrays

					// iterate each row of segment groupings
					for (row = 0; row < segRows.length; row++) {
						rowStructs.push(
							this.renderSegRow(row, segRows[row])
						);
					}

					return rowStructs;
				},


				// Given a row # and an array of segments all in the same row, render a <tbody> element, a skeleton that contains
				// the segments. Returns object with a bunch of internal data about how the render was calculated.
				// NOTE: modifies rowSegs
				renderSegRow: function (row, rowSegs) {
					var colCnt = this.dayGrid.colCnt;
					var segLevels = this.buildSegLevels(rowSegs); // group into sub-arrays of levels
					var levelCnt = Math.max(1, segLevels.length); // ensure at least one level
					var tbody = $('<tbody/>');
					var segMatrix = []; // lookup for which segments are rendered into which level+col cells
					var cellMatrix = []; // lookup for all <td> elements of the level+col matrix
					var loneCellMatrix = []; // lookup for <td> elements that only take up a single column
					var i, levelSegs;
					var col;
					var tr;
					var j, seg;
					var td;

					// populates empty cells from the current column (`col`) to `endCol`
					function emptyCellsUntil(endCol) {
						while (col < endCol) {
							// try to grab a cell from the level above and extend its rowspan. otherwise, create a fresh cell
							td = (loneCellMatrix[i - 1] || [])[col];
							if (td) {
								td.attr(
									'rowspan',
									parseInt(td.attr('rowspan') || 1, 10) + 1
								);
							}
							else {
								td = $('<td/>');
								tr.append(td);
							}
							cellMatrix[i][col] = td;
							loneCellMatrix[i][col] = td;
							col++;
						}
					}

					for (i = 0; i < levelCnt; i++) { // iterate through all levels
						levelSegs = segLevels[i];
						col = 0;
						tr = $('<tr/>');

						segMatrix.push([]);
						cellMatrix.push([]);
						loneCellMatrix.push([]);

						// levelCnt might be 1 even though there are no actual levels. protect against this.
						// this single empty row is useful for styling.
						if (levelSegs) {
							for (j = 0; j < levelSegs.length; j++) { // iterate through segments in level
								seg = levelSegs[j];

								emptyCellsUntil(seg.leftCol);

								// create a container that occupies or more columns. append the event element.
								td = $('<td class="fc-event-container"/>').append(seg.el);
								if (seg.leftCol != seg.rightCol) {
									td.attr('colspan', seg.rightCol - seg.leftCol + 1);
								}
								else { // a single-column segment
									loneCellMatrix[i][col] = td;
								}

								while (col <= seg.rightCol) {
									cellMatrix[i][col] = td;
									segMatrix[i][col] = seg;
									col++;
								}

								tr.append(td);
							}
						}

						emptyCellsUntil(colCnt); // finish off the row
						this.dayGrid.bookendCells(tr);
						tbody.append(tr);
					}

					return { // a "rowStruct"
						row: row, // the row number
						tbodyEl: tbody,
						cellMatrix: cellMatrix,
						segMatrix: segMatrix,
						segLevels: segLevels,
						segs: rowSegs
					};
				},


				// Stacks a flat array of segments, which are all assumed to be in the same row, into subarrays of vertical levels.
				// NOTE: modifies segs
				buildSegLevels: function (segs) {
					var levels = [];
					var i, seg;
					var j;

					// Give preference to elements with certain criteria, so they have
					// a chance to be closer to the top.
					this.sortEventSegs(segs);

					for (i = 0; i < segs.length; i++) {
						seg = segs[i];

						// loop through levels, starting with the topmost, until the segment doesn't collide with other segments
						for (j = 0; j < levels.length; j++) {
							if (!isDaySegCollision(seg, levels[j])) {
								break;
							}
						}
						// `j` now holds the desired subrow index
						seg.level = j;

						// create new level array if needed and append segment
						(levels[j] || (levels[j] = [])).push(seg);
					}

					// order segments left-to-right. very important if calendar is RTL
					for (j = 0; j < levels.length; j++) {
						levels[j].sort(compareDaySegCols);
					}

					return levels;
				},


				// Given a flat array of segments, return an array of sub-arrays, grouped by each segment's row
				groupSegRows: function (segs) {
					var segRows = [];
					var i;

					for (i = 0; i < this.dayGrid.rowCnt; i++) {
						segRows.push([]);
					}

					for (i = 0; i < segs.length; i++) {
						segRows[segs[i].row].push(segs[i]);
					}

					return segRows;
				},


				// Computes a default event time formatting string if `timeFormat` is not explicitly defined
				computeEventTimeFormat: function () {
					return this.opt('extraSmallTimeFormat'); // like "6p" or "6:30p"
				},


				// Computes a default `displayEventEnd` value if one is not expliclty defined
				computeDisplayEventEnd: function () {
					return this.dayGrid.colCnt === 1; // we'll likely have space if there's only one day
				},


				// Builds the HTML to be used for the default element for an individual segment
				fgSegHtml: function (seg, disableResizing) {
					var view = this.view;
					var eventDef = seg.footprint.eventDef;
					var isAllDay = seg.footprint.componentFootprint.isAllDay;
					var isDraggable = view.isEventDefDraggable(eventDef);
					var isResizableFromStart = !disableResizing && isAllDay &&
						seg.isStart && view.isEventDefResizableFromStart(eventDef);
					var isResizableFromEnd = !disableResizing && isAllDay &&
						seg.isEnd && view.isEventDefResizableFromEnd(eventDef);
					var classes = this.getSegClasses(seg, isDraggable, isResizableFromStart || isResizableFromEnd);
					var skinCss = cssToStr(this.getSkinCss(eventDef));
					var timeHtml = '';
					var timeText;
					var titleHtml;

					classes.unshift('fc-day-grid-event', 'fc-h-event');

					// Only display a timed events time if it is the starting segment
					if (seg.isStart) {
						timeText = this.getTimeText(seg.footprint);
						if (timeText) {
							timeHtml = '<span class="fc-time">' + htmlEscape(timeText) + '</span>';
						}
					}

					titleHtml =
						'<span class="fc-title">' +
						(htmlEscape(eventDef.title || '') || '&nbsp;') + // we always want one line of height
						'</span>';

					return '<a class="' + classes.join(' ') + '"' +
						(eventDef.url ?
								' href="' + htmlEscape(eventDef.url) + '"' :
								''
						) +
						(skinCss ?
								' style="' + skinCss + '"' :
								''
						) +
						'>' +
						'<div class="fc-content">' +
						(this.isRTL ?
								titleHtml + ' ' + timeHtml : // put a natural space in between
								timeHtml + ' ' + titleHtml   //
						) +
						'</div>' +
						(isResizableFromStart ?
								'<div class="fc-resizer fc-start-resizer" />' :
								''
						) +
						(isResizableFromEnd ?
								'<div class="fc-resizer fc-end-resizer" />' :
								''
						) +
						'</a>';
				}

			});


// Computes whether two segments' columns collide. They are assumed to be in the same row.
			function isDaySegCollision(seg, otherSegs) {
				var i, otherSeg;

				for (i = 0; i < otherSegs.length; i++) {
					otherSeg = otherSegs[i];

					if (
						otherSeg.leftCol <= seg.rightCol &&
						otherSeg.rightCol >= seg.leftCol
					) {
						return true;
					}
				}

				return false;
			}


// A cmp function for determining the leftmost event
			function compareDaySegCols(a, b) {
				return a.leftCol - b.leftCol;
			}

			;
			;

			var DayGridHelperRenderer = HelperRenderer.extend({


				// Renders a mock "helper" event. `sourceSeg` is the associated internal segment object. It can be null.
				renderSegs: function (segs, sourceSeg) {
					var helperNodes = [];
					var rowStructs;

					// TODO: not good to call eventRenderer this way
					rowStructs = this.eventRenderer.renderSegRows(segs);

					// inject each new event skeleton into each associated row
					this.component.rowEls.each(function (row, rowNode) {
						var rowEl = $(rowNode); // the .fc-row
						var skeletonEl = $('<div class="fc-helper-skeleton"><table/></div>'); // will be absolutely positioned
						var skeletonTopEl;
						var skeletonTop;

						// If there is an original segment, match the top position. Otherwise, put it at the row's top level
						if (sourceSeg && sourceSeg.row === row) {
							skeletonTop = sourceSeg.el.position().top;
						}
						else {
							skeletonTopEl = rowEl.find('.fc-content-skeleton tbody');
							if (!skeletonTopEl.length) { // when no events
								skeletonTopEl = rowEl.find('.fc-content-skeleton table');
							}

							skeletonTop = skeletonTopEl.position().top;
						}

						skeletonEl.css('top', skeletonTop)
							.find('table')
							.append(rowStructs[row].tbodyEl);

						rowEl.append(skeletonEl);
						helperNodes.push(skeletonEl[0]);
					});

					return $(helperNodes); // must return the elements rendered
				}

			});

			;
			;

			/* A component that renders a grid of whole-days that runs horizontally. There can be multiple rows, one per week.
----------------------------------------------------------------------------------------------------------------------*/

			var DayGrid = FC.DayGrid = InteractiveDateComponent.extend(StandardInteractionsMixin, DayTableMixin, {

				eventRendererClass: DayGridEventRenderer,
				businessHourRendererClass: BusinessHourRenderer,
				helperRendererClass: DayGridHelperRenderer,
				fillRendererClass: DayGridFillRenderer,

				view: null, // TODO: make more general and/or remove
				helperRenderer: null,

				cellWeekNumbersVisible: false, // display week numbers in day cell?

				bottomCoordPadding: 0, // hack for extending the hit area for the last row of the coordinate grid

				headContainerEl: null, // div that hold's the date header
				rowEls: null, // set of fake row elements
				cellEls: null, // set of whole-day elements comprising the row's background

				rowCoordCache: null,
				colCoordCache: null,

				// isRigid determines whether the individual rows should ignore the contents and be a constant height.
				// Relies on the view's colCnt and rowCnt. In the future, this component should probably be self-sufficient.
				isRigid: false,

				hasAllDayBusinessHours: true,


				constructor: function (view) {
					this.view = view; // do first, for opt calls during initialization

					InteractiveDateComponent.call(this);
				},


				// Slices up the given span (unzoned start/end with other misc data) into an array of segments
				componentFootprintToSegs: function (componentFootprint) {
					var segs = this.sliceRangeByRow(componentFootprint.unzonedRange);
					var i, seg;

					for (i = 0; i < segs.length; i++) {
						seg = segs[i];

						if (this.isRTL) {
							seg.leftCol = this.daysPerRow - 1 - seg.lastRowDayIndex;
							seg.rightCol = this.daysPerRow - 1 - seg.firstRowDayIndex;
						}
						else {
							seg.leftCol = seg.firstRowDayIndex;
							seg.rightCol = seg.lastRowDayIndex;
						}
					}

					return segs;
				},


				/* Date Rendering
	------------------------------------------------------------------------------------------------------------------*/


				renderDates: function (dateProfile) {
					this.dateProfile = dateProfile;
					this.updateDayTable();
					this.renderGrid();
				},


				unrenderDates: function () {
					this.removeSegPopover();
				},


				// Renders the rows and columns into the component's `this.el`, which should already be assigned.
				renderGrid: function () {
					var view = this.view;
					var rowCnt = this.rowCnt;
					var colCnt = this.colCnt;
					var html = '';
					var row;
					var col;

					if (this.headContainerEl) {
						this.headContainerEl.html(this.renderHeadHtml());
					}

					for (row = 0; row < rowCnt; row++) {
						html += this.renderDayRowHtml(row, this.isRigid);
					}
					this.el.html(html);

					this.rowEls = this.el.find('.fc-row');
					this.cellEls = this.el.find('.fc-day, .fc-disabled-day');

					this.rowCoordCache = new CoordCache({
						els: this.rowEls,
						isVertical: true
					});
					this.colCoordCache = new CoordCache({
						els: this.cellEls.slice(0, this.colCnt), // only the first row
						isHorizontal: true
					});

					// trigger dayRender with each cell's element
					for (row = 0; row < rowCnt; row++) {
						for (col = 0; col < colCnt; col++) {
							this.publiclyTrigger('dayRender', {
								context: view,
								args: [
									this.getCellDate(row, col),
									this.getCellEl(row, col),
									view
								]
							});
						}
					}
				},


				// Generates the HTML for a single row, which is a div that wraps a table.
				// `row` is the row number.
				renderDayRowHtml: function (row, isRigid) {
					var theme = this.view.calendar.theme;
					var classes = ['fc-row', 'fc-week', theme.getClass('dayRow')];

					if (isRigid) {
						classes.push('fc-rigid');
					}

					return '' +
						'<div class="' + classes.join(' ') + '">' +
						'<div class="fc-bg">' +
						'<table class="' + theme.getClass('tableGrid') + '">' +
						this.renderBgTrHtml(row) +
						'</table>' +
						'</div>' +
						'<div class="fc-content-skeleton">' +
						'<table>' +
						(this.getIsNumbersVisible() ?
								'<thead>' +
								this.renderNumberTrHtml(row) +
								'</thead>' :
								''
						) +
						'</table>' +
						'</div>' +
						'</div>';
				},


				getIsNumbersVisible: function () {
					return this.getIsDayNumbersVisible() || this.cellWeekNumbersVisible;
				},


				getIsDayNumbersVisible: function () {
					return this.rowCnt > 1;
				},


				/* Grid Number Rendering
	------------------------------------------------------------------------------------------------------------------*/


				renderNumberTrHtml: function (row) {
					return '' +
						'<tr>' +
						(this.isRTL ? '' : this.renderNumberIntroHtml(row)) +
						this.renderNumberCellsHtml(row) +
						(this.isRTL ? this.renderNumberIntroHtml(row) : '') +
						'</tr>';
				},


				renderNumberIntroHtml: function (row) {
					return this.renderIntroHtml();
				},


				renderNumberCellsHtml: function (row) {
					var htmls = [];
					var col, date;

					for (col = 0; col < this.colCnt; col++) {
						date = this.getCellDate(row, col);
						htmls.push(this.renderNumberCellHtml(date));
					}

					return htmls.join('');
				},


				// Generates the HTML for the <td>s of the "number" row in the DayGrid's content skeleton.
				// The number row will only exist if either day numbers or week numbers are turned on.
				renderNumberCellHtml: function (date) {
					var view = this.view;
					var html = '';
					var isDateValid = this.dateProfile.activeUnzonedRange.containsDate(date); // TODO: called too frequently. cache somehow.
					var isDayNumberVisible = this.getIsDayNumbersVisible() && isDateValid;
					var classes;
					var weekCalcFirstDoW;

					if (!isDayNumberVisible && !this.cellWeekNumbersVisible) {
						// no numbers in day cell (week number must be along the side)
						return '<td/>'; //  will create an empty space above events :(
					}

					classes = this.getDayClasses(date);
					classes.unshift('fc-day-top');

					if (this.cellWeekNumbersVisible) {
						// To determine the day of week number change under ISO, we cannot
						// rely on moment.js methods such as firstDayOfWeek() or weekday(),
						// because they rely on the locale's dow (possibly overridden by
						// our firstDay option), which may not be Monday. We cannot change
						// dow, because that would affect the calendar start day as well.
						if (date._locale._fullCalendar_weekCalc === 'ISO') {
							weekCalcFirstDoW = 1;  // Monday by ISO 8601 definition
						}
						else {
							weekCalcFirstDoW = date._locale.firstDayOfWeek();
						}
					}

					html += '<td class="' + classes.join(' ') + '"' +
						(isDateValid ?
								' data-date="' + date.format() + '"' :
								''
						) +
						'>';

					if (this.cellWeekNumbersVisible && (date.day() == weekCalcFirstDoW)) {
						html += view.buildGotoAnchorHtml(
							{date: date, type: 'week'},
							{'class': 'fc-week-number'},
							date.format('w') // inner HTML
						);
					}

					if (isDayNumberVisible) {
						html += view.buildGotoAnchorHtml(
							date,
							{'class': 'fc-day-number'},
							date.date() // inner HTML
						);
					}

					html += '</td>';

					return html;
				},


				/* Hit System
	------------------------------------------------------------------------------------------------------------------*/


				prepareHits: function () {
					this.colCoordCache.build();
					this.rowCoordCache.build();
					this.rowCoordCache.bottoms[this.rowCnt - 1] += this.bottomCoordPadding; // hack
				},


				releaseHits: function () {
					this.colCoordCache.clear();
					this.rowCoordCache.clear();
				},


				queryHit: function (leftOffset, topOffset) {
					if (this.colCoordCache.isLeftInBounds(leftOffset) && this.rowCoordCache.isTopInBounds(topOffset)) {
						var col = this.colCoordCache.getHorizontalIndex(leftOffset);
						var row = this.rowCoordCache.getVerticalIndex(topOffset);

						if (row != null && col != null) {
							return this.getCellHit(row, col);
						}
					}
				},


				getHitFootprint: function (hit) {
					var range = this.getCellRange(hit.row, hit.col);

					return new ComponentFootprint(
						new UnzonedRange(range.start, range.end),
						true // all-day?
					);
				},


				getHitEl: function (hit) {
					return this.getCellEl(hit.row, hit.col);
				},


				/* Cell System
	------------------------------------------------------------------------------------------------------------------*/
				// FYI: the first column is the leftmost column, regardless of date


				getCellHit: function (row, col) {
					return {
						row: row,
						col: col,
						component: this, // needed unfortunately :(
						left: this.colCoordCache.getLeftOffset(col),
						right: this.colCoordCache.getRightOffset(col),
						top: this.rowCoordCache.getTopOffset(row),
						bottom: this.rowCoordCache.getBottomOffset(row)
					};
				},


				getCellEl: function (row, col) {
					return this.cellEls.eq(row * this.colCnt + col);
				},


				/* Event Rendering
	------------------------------------------------------------------------------------------------------------------*/


				// Unrenders all events currently rendered on the grid
				unrenderEvents: function () {
					this.removeSegPopover(); // removes the "more.." events popover

					InteractiveDateComponent.prototype.unrenderEvents.apply(this, arguments);
				},


				// Retrieves all rendered segment objects currently rendered on the grid
				getOwnEventSegs: function () {
					return InteractiveDateComponent.prototype.getOwnEventSegs.apply(this, arguments) // get the segments from the super-method
						.concat(this.popoverSegs || []); // append the segments from the "more..." popover
				},


				/* Event Drag Visualization
	------------------------------------------------------------------------------------------------------------------*/


				// Renders a visual indication of an event or external element being dragged.
				// `eventLocation` has zoned start and end (optional)
				renderDrag: function (eventFootprints, seg, isTouch) {
					var i;

					for (i = 0; i < eventFootprints.length; i++) {
						this.renderHighlight(eventFootprints[i].componentFootprint);
					}

					// render drags from OTHER components as helpers
					if (eventFootprints.length && seg && seg.component !== this) {
						this.helperRenderer.renderEventDraggingFootprints(eventFootprints, seg, isTouch);

						return true; // signal helpers rendered
					}
				},


				// Unrenders any visual indication of a hovering event
				unrenderDrag: function (seg) {
					this.unrenderHighlight();
					this.helperRenderer.unrender();
				},


				/* Event Resize Visualization
	------------------------------------------------------------------------------------------------------------------*/


				// Renders a visual indication of an event being resized
				renderEventResize: function (eventFootprints, seg, isTouch) {
					var i;

					for (i = 0; i < eventFootprints.length; i++) {
						this.renderHighlight(eventFootprints[i].componentFootprint);
					}

					this.helperRenderer.renderEventResizingFootprints(eventFootprints, seg, isTouch);
				},


				// Unrenders a visual indication of an event being resized
				unrenderEventResize: function (seg) {
					this.unrenderHighlight();
					this.helperRenderer.unrender();
				}

			});

			;
			;

			/* Methods relate to limiting the number events for a given day on a DayGrid
----------------------------------------------------------------------------------------------------------------------*/
// NOTE: all the segs being passed around in here are foreground segs

			DayGrid.mixin({

				segPopover: null, // the Popover that holds events that can't fit in a cell. null when not visible
				popoverSegs: null, // an array of segment objects that the segPopover holds. null when not visible


				removeSegPopover: function () {
					if (this.segPopover) {
						this.segPopover.hide(); // in handler, will call segPopover's removeElement
					}
				},


				// Limits the number of "levels" (vertically stacking layers of events) for each row of the grid.
				// `levelLimit` can be false (don't limit), a number, or true (should be computed).
				limitRows: function (levelLimit) {
					var rowStructs = this.eventRenderer.rowStructs || [];
					var row; // row #
					var rowLevelLimit;

					for (row = 0; row < rowStructs.length; row++) {
						this.unlimitRow(row);

						if (!levelLimit) {
							rowLevelLimit = false;
						}
						else if (typeof levelLimit === 'number') {
							rowLevelLimit = levelLimit;
						}
						else {
							rowLevelLimit = this.computeRowLevelLimit(row);
						}

						if (rowLevelLimit !== false) {
							this.limitRow(row, rowLevelLimit);
						}
					}
				},


				// Computes the number of levels a row will accomodate without going outside its bounds.
				// Assumes the row is "rigid" (maintains a constant height regardless of what is inside).
				// `row` is the row number.
				computeRowLevelLimit: function (row) {
					var rowEl = this.rowEls.eq(row); // the containing "fake" row div
					var rowHeight = rowEl.height(); // TODO: cache somehow?
					var trEls = this.eventRenderer.rowStructs[row].tbodyEl.children();
					var i, trEl;
					var trHeight;

					function iterInnerHeights(i, childNode) {
						trHeight = Math.max(trHeight, $(childNode).outerHeight());
					}

					// Reveal one level <tr> at a time and stop when we find one out of bounds
					for (i = 0; i < trEls.length; i++) {
						trEl = trEls.eq(i).removeClass('fc-limited'); // reset to original state (reveal)

						// with rowspans>1 and IE8, trEl.outerHeight() would return the height of the largest cell,
						// so instead, find the tallest inner content element.
						trHeight = 0;
						trEl.find('> td > :first-child').each(iterInnerHeights);

						if (trEl.position().top + trHeight > rowHeight) {
							return i;
						}
					}

					return false; // should not limit at all
				},


				// Limits the given grid row to the maximum number of levels and injects "more" links if necessary.
				// `row` is the row number.
				// `levelLimit` is a number for the maximum (inclusive) number of levels allowed.
				limitRow: function (row, levelLimit) {
					var _this = this;
					var rowStruct = this.eventRenderer.rowStructs[row];
					var moreNodes = []; // array of "more" <a> links and <td> DOM nodes
					var col = 0; // col #, left-to-right (not chronologically)
					var levelSegs; // array of segment objects in the last allowable level, ordered left-to-right
					var cellMatrix; // a matrix (by level, then column) of all <td> jQuery elements in the row
					var limitedNodes; // array of temporarily hidden level <tr> and segment <td> DOM nodes
					var i, seg;
					var segsBelow; // array of segment objects below `seg` in the current `col`
					var totalSegsBelow; // total number of segments below `seg` in any of the columns `seg` occupies
					var colSegsBelow; // array of segment arrays, below seg, one for each column (offset from segs's first column)
					var td, rowspan;
					var segMoreNodes; // array of "more" <td> cells that will stand-in for the current seg's cell
					var j;
					var moreTd, moreWrap, moreLink;

					// Iterates through empty level cells and places "more" links inside if need be
					function emptyCellsUntil(endCol) { // goes from current `col` to `endCol`
						while (col < endCol) {
							segsBelow = _this.getCellSegs(row, col, levelLimit);
							if (segsBelow.length) {
								td = cellMatrix[levelLimit - 1][col];
								moreLink = _this.renderMoreLink(row, col, segsBelow);
								moreWrap = $('<div/>').append(moreLink);
								td.append(moreWrap);
								moreNodes.push(moreWrap[0]);
							}
							col++;
						}
					}

					if (levelLimit && levelLimit < rowStruct.segLevels.length) { // is it actually over the limit?
						levelSegs = rowStruct.segLevels[levelLimit - 1];
						cellMatrix = rowStruct.cellMatrix;

						limitedNodes = rowStruct.tbodyEl.children().slice(levelLimit) // get level <tr> elements past the limit
							.addClass('fc-limited').get(); // hide elements and get a simple DOM-nodes array

						// iterate though segments in the last allowable level
						for (i = 0; i < levelSegs.length; i++) {
							seg = levelSegs[i];
							emptyCellsUntil(seg.leftCol); // process empty cells before the segment

							// determine *all* segments below `seg` that occupy the same columns
							colSegsBelow = [];
							totalSegsBelow = 0;
							while (col <= seg.rightCol) {
								segsBelow = this.getCellSegs(row, col, levelLimit);
								colSegsBelow.push(segsBelow);
								totalSegsBelow += segsBelow.length;
								col++;
							}

							if (totalSegsBelow) { // do we need to replace this segment with one or many "more" links?
								td = cellMatrix[levelLimit - 1][seg.leftCol]; // the segment's parent cell
								rowspan = td.attr('rowspan') || 1;
								segMoreNodes = [];

								// make a replacement <td> for each column the segment occupies. will be one for each colspan
								for (j = 0; j < colSegsBelow.length; j++) {
									moreTd = $('<td class="fc-more-cell"/>').attr('rowspan', rowspan);
									segsBelow = colSegsBelow[j];
									moreLink = this.renderMoreLink(
										row,
										seg.leftCol + j,
										[seg].concat(segsBelow) // count seg as hidden too
									);
									moreWrap = $('<div/>').append(moreLink);
									moreTd.append(moreWrap);
									segMoreNodes.push(moreTd[0]);
									moreNodes.push(moreTd[0]);
								}

								td.addClass('fc-limited').after($(segMoreNodes)); // hide original <td> and inject replacements
								limitedNodes.push(td[0]);
							}
						}

						emptyCellsUntil(this.colCnt); // finish off the level
						rowStruct.moreEls = $(moreNodes); // for easy undoing later
						rowStruct.limitedEls = $(limitedNodes); // for easy undoing later
					}
				},


				// Reveals all levels and removes all "more"-related elements for a grid's row.
				// `row` is a row number.
				unlimitRow: function (row) {
					var rowStruct = this.eventRenderer.rowStructs[row];

					if (rowStruct.moreEls) {
						rowStruct.moreEls.remove();
						rowStruct.moreEls = null;
					}

					if (rowStruct.limitedEls) {
						rowStruct.limitedEls.removeClass('fc-limited');
						rowStruct.limitedEls = null;
					}
				},


				// Renders an <a> element that represents hidden event element for a cell.
				// Responsible for attaching click handler as well.
				renderMoreLink: function (row, col, hiddenSegs) {
					var _this = this;
					var view = this.view;

					return $('<a class="fc-more"/>')
						.text(
							this.getMoreLinkText(hiddenSegs.length)
						)
						.on('click', function (ev) {
							var clickOption = _this.opt('eventLimitClick');
							var date = _this.getCellDate(row, col);
							var moreEl = $(this);
							var dayEl = _this.getCellEl(row, col);
							var allSegs = _this.getCellSegs(row, col);

							// rescope the segments to be within the cell's date
							var reslicedAllSegs = _this.resliceDaySegs(allSegs, date);
							var reslicedHiddenSegs = _this.resliceDaySegs(hiddenSegs, date);

							if (typeof clickOption === 'function') {
								// the returned value can be an atomic option
								clickOption = _this.publiclyTrigger('eventLimitClick', {
									context: view,
									args: [
										{
											date: date.clone(),
											dayEl: dayEl,
											moreEl: moreEl,
											segs: reslicedAllSegs,
											hiddenSegs: reslicedHiddenSegs
										},
										ev,
										view
									]
								});
							}

							if (clickOption === 'popover') {
								_this.showSegPopover(row, col, moreEl, reslicedAllSegs);
							}
							else if (typeof clickOption === 'string') { // a view name
								view.calendar.zoomTo(date, clickOption);
							}
						});
				},


				// Reveals the popover that displays all events within a cell
				showSegPopover: function (row, col, moreLink, segs) {
					var _this = this;
					var view = this.view;
					var moreWrap = moreLink.parent(); // the <div> wrapper around the <a>
					var topEl; // the element we want to match the top coordinate of
					var options;

					if (this.rowCnt == 1) {
						topEl = view.el; // will cause the popover to cover any sort of header
					}
					else {
						topEl = this.rowEls.eq(row); // will align with top of row
					}

					options = {
						className: 'fc-more-popover ' + view.calendar.theme.getClass('popover'),
						content: this.renderSegPopoverContent(row, col, segs),
						parentEl: view.el, // attach to root of view. guarantees outside of scrollbars.
						top: topEl.offset().top,
						autoHide: true, // when the user clicks elsewhere, hide the popover
						viewportConstrain: this.opt('popoverViewportConstrain'),
						hide: function () {
							// kill everything when the popover is hidden
							// notify events to be removed
							if (_this.popoverSegs) {
								_this.triggerBeforeEventSegsDestroyed(_this.popoverSegs);
							}
							_this.segPopover.removeElement();
							_this.segPopover = null;
							_this.popoverSegs = null;
						}
					};

					// Determine horizontal coordinate.
					// We use the moreWrap instead of the <td> to avoid border confusion.
					if (this.isRTL) {
						options.right = moreWrap.offset().left + moreWrap.outerWidth() + 1; // +1 to be over cell border
					}
					else {
						options.left = moreWrap.offset().left - 1; // -1 to be over cell border
					}

					this.segPopover = new Popover(options);
					this.segPopover.show();

					// the popover doesn't live within the grid's container element, and thus won't get the event
					// delegated-handlers for free. attach event-related handlers to the popover.
					this.bindAllSegHandlersToEl(this.segPopover.el);

					this.triggerAfterEventSegsRendered(segs);
				},


				// Builds the inner DOM contents of the segment popover
				renderSegPopoverContent: function (row, col, segs) {
					var view = this.view;
					var theme = view.calendar.theme;
					var title = this.getCellDate(row, col).format(this.opt('dayPopoverFormat'));
					var content = $(
						'<div class="fc-header ' + theme.getClass('popoverHeader') + '">' +
						'<span class="fc-close ' + theme.getIconClass('close') + '"></span>' +
						'<span class="fc-title">' +
						htmlEscape(title) +
						'</span>' +
						'<div class="fc-clear"/>' +
						'</div>' +
						'<div class="fc-body ' + theme.getClass('popoverContent') + '">' +
						'<div class="fc-event-container"></div>' +
						'</div>'
					);
					var segContainer = content.find('.fc-event-container');
					var i;

					// render each seg's `el` and only return the visible segs
					segs = this.eventRenderer.renderFgSegEls(segs, true); // disableResizing=true
					this.popoverSegs = segs;

					for (i = 0; i < segs.length; i++) {

						// because segments in the popover are not part of a grid coordinate system, provide a hint to any
						// grids that want to do drag-n-drop about which cell it came from
						this.hitsNeeded();
						segs[i].hit = this.getCellHit(row, col);
						this.hitsNotNeeded();

						segContainer.append(segs[i].el);
					}

					return content;
				},


				// Given the events within an array of segment objects, reslice them to be in a single day
				resliceDaySegs: function (segs, dayDate) {
					var dayStart = dayDate.clone();
					var dayEnd = dayStart.clone().add(1, 'days');
					var dayRange = new UnzonedRange(dayStart, dayEnd);
					var newSegs = [];
					var i, seg;
					var slicedRange;

					for (i = 0; i < segs.length; i++) {
						seg = segs[i];
						slicedRange = seg.footprint.componentFootprint.unzonedRange.intersect(dayRange);

						if (slicedRange) {
							newSegs.push(
								$.extend({}, seg, {
									footprint: new EventFootprint(
										new ComponentFootprint(
											slicedRange,
											seg.footprint.componentFootprint.isAllDay
										),
										seg.footprint.eventDef,
										seg.footprint.eventInstance
									),
									isStart: seg.isStart && slicedRange.isStart,
									isEnd: seg.isEnd && slicedRange.isEnd
								})
							);
						}
					}

					// force an order because eventsToSegs doesn't guarantee one
					// TODO: research if still needed
					this.eventRenderer.sortEventSegs(newSegs);

					return newSegs;
				},


				// Generates the text that should be inside a "more" link, given the number of events it represents
				getMoreLinkText: function (num) {
					var opt = this.opt('eventLimitText');

					if (typeof opt === 'function') {
						return opt(num);
					}
					else {
						return '+' + num + ' ' + opt;
					}
				},


				// Returns segments within a given cell.
				// If `startLevel` is specified, returns only events including and below that level. Otherwise returns all segs.
				getCellSegs: function (row, col, startLevel) {
					var segMatrix = this.eventRenderer.rowStructs[row].segMatrix;
					var level = startLevel || 0;
					var segs = [];
					var seg;

					while (level < segMatrix.length) {
						seg = segMatrix[level][col];
						if (seg) {
							segs.push(seg);
						}
						level++;
					}

					return segs;
				}

			});

			;
			;

			/* An abstract class for the "basic" views, as well as month view. Renders one or more rows of day cells.
----------------------------------------------------------------------------------------------------------------------*/
// It is a manager for a DayGrid subcomponent, which does most of the heavy lifting.
// It is responsible for managing width/height.

			var BasicView = FC.BasicView = View.extend({

				scroller: null,

				dayGridClass: DayGrid, // class the dayGrid will be instantiated from (overridable by subclasses)
				dayGrid: null, // the main subcomponent that does most of the heavy lifting

				weekNumberWidth: null, // width of all the week-number cells running down the side


				constructor: function () {
					View.apply(this, arguments);

					this.dayGrid = this.instantiateDayGrid();
					this.dayGrid.isRigid = this.hasRigidRows();

					if (this.opt('weekNumbers')) {
						if (this.opt('weekNumbersWithinDays')) {
							this.dayGrid.cellWeekNumbersVisible = true;
							this.dayGrid.colWeekNumbersVisible = false;
						}
						else {
							this.dayGrid.cellWeekNumbersVisible = false;
							this.dayGrid.colWeekNumbersVisible = true;
						}
						;
					}

					this.addChild(this.dayGrid);

					this.scroller = new Scroller({
						overflowX: 'hidden',
						overflowY: 'auto'
					});
				},


				// Generates the DayGrid object this view needs. Draws from this.dayGridClass
				instantiateDayGrid: function () {
					// generate a subclass on the fly with BasicView-specific behavior
					// TODO: cache this subclass
					var subclass = this.dayGridClass.extend(basicDayGridMethods);

					return new subclass(this);
				},


				// Computes the date range that will be rendered.
				buildRenderRange: function (currentUnzonedRange, currentRangeUnit, isRangeAllDay) {
					var renderUnzonedRange = View.prototype.buildRenderRange.apply(this, arguments); // an UnzonedRange
					var start = this.calendar.msToUtcMoment(renderUnzonedRange.startMs, isRangeAllDay);
					var end = this.calendar.msToUtcMoment(renderUnzonedRange.endMs, isRangeAllDay);

					// year and month views should be aligned with weeks. this is already done for week
					if (/^(year|month)$/.test(currentRangeUnit)) {
						start.startOf('week');

						// make end-of-week if not already
						if (end.weekday()) {
							end.add(1, 'week').startOf('week'); // exclusively move backwards
						}
					}

					return new UnzonedRange(start, end);
				},


				executeDateRender: function (dateProfile) {
					this.dayGrid.breakOnWeeks = /year|month|week/.test(dateProfile.currentRangeUnit);

					View.prototype.executeDateRender.apply(this, arguments);
				},


				renderSkeleton: function () {
					var dayGridContainerEl;
					var dayGridEl;

					this.el.addClass('fc-basic-view').html(this.renderSkeletonHtml());

					this.scroller.render();

					dayGridContainerEl = this.scroller.el.addClass('fc-day-grid-container');
					dayGridEl = $('<div class="fc-day-grid" />').appendTo(dayGridContainerEl);

					this.el.find('.fc-body > tr > td').append(dayGridContainerEl);

					this.dayGrid.headContainerEl = this.el.find('.fc-head-container');
					this.dayGrid.setElement(dayGridEl);
				},


				unrenderSkeleton: function () {
					this.dayGrid.removeElement();
					this.scroller.destroy();
				},


				// Builds the HTML skeleton for the view.
				// The day-grid component will render inside of a container defined by this HTML.
				renderSkeletonHtml: function () {
					var theme = this.calendar.theme;

					return '' +
						'<table class="' + theme.getClass('tableGrid') + '">' +
						(this.opt('columnHeader') ?
								'<thead class="fc-head">' +
								'<tr>' +
								'<td class="fc-head-container ' + theme.getClass('widgetHeader') + '">&nbsp;</td>' +
								'</tr>' +
								'</thead>' :
								''
						) +
						'<tbody class="fc-body">' +
						'<tr>' +
						'<td class="' + theme.getClass('widgetContent') + '"></td>' +
						'</tr>' +
						'</tbody>' +
						'</table>';
				},


				// Generates an HTML attribute string for setting the width of the week number column, if it is known
				weekNumberStyleAttr: function () {
					if (this.weekNumberWidth !== null) {
						return 'style="width:' + this.weekNumberWidth + 'px"';
					}
					return '';
				},


				// Determines whether each row should have a constant height
				hasRigidRows: function () {
					var eventLimit = this.opt('eventLimit');

					return eventLimit && typeof eventLimit !== 'number';
				},


				/* Dimensions
	------------------------------------------------------------------------------------------------------------------*/


				// Refreshes the horizontal dimensions of the view
				updateSize: function (totalHeight, isAuto, isResize) {
					var eventLimit = this.opt('eventLimit');
					var headRowEl = this.dayGrid.headContainerEl.find('.fc-row');
					var scrollerHeight;
					var scrollbarWidths;

					// hack to give the view some height prior to dayGrid's columns being rendered
					// TODO: separate setting height from scroller VS dayGrid.
					if (!this.dayGrid.rowEls) {
						if (!isAuto) {
							scrollerHeight = this.computeScrollerHeight(totalHeight);
							this.scroller.setHeight(scrollerHeight);
						}
						return;
					}

					View.prototype.updateSize.apply(this, arguments);

					if (this.dayGrid.colWeekNumbersVisible) {
						// Make sure all week number cells running down the side have the same width.
						// Record the width for cells created later.
						this.weekNumberWidth = matchCellWidths(
							this.el.find('.fc-week-number')
						);
					}

					// reset all heights to be natural
					this.scroller.clear();
					uncompensateScroll(headRowEl);

					this.dayGrid.removeSegPopover(); // kill the "more" popover if displayed

					// is the event limit a constant level number?
					if (eventLimit && typeof eventLimit === 'number') {
						this.dayGrid.limitRows(eventLimit); // limit the levels first so the height can redistribute after
					}

					// distribute the height to the rows
					// (totalHeight is a "recommended" value if isAuto)
					scrollerHeight = this.computeScrollerHeight(totalHeight);
					this.setGridHeight(scrollerHeight, isAuto);

					// is the event limit dynamically calculated?
					if (eventLimit && typeof eventLimit !== 'number') {
						this.dayGrid.limitRows(eventLimit); // limit the levels after the grid's row heights have been set
					}

					if (!isAuto) { // should we force dimensions of the scroll container?

						this.scroller.setHeight(scrollerHeight);
						scrollbarWidths = this.scroller.getScrollbarWidths();

						if (scrollbarWidths.left || scrollbarWidths.right) { // using scrollbars?

							compensateScroll(headRowEl, scrollbarWidths);

							// doing the scrollbar compensation might have created text overflow which created more height. redo
							scrollerHeight = this.computeScrollerHeight(totalHeight);
							this.scroller.setHeight(scrollerHeight);
						}

						// guarantees the same scrollbar widths
						this.scroller.lockOverflow(scrollbarWidths);
					}
				},


				// given a desired total height of the view, returns what the height of the scroller should be
				computeScrollerHeight: function (totalHeight) {
					return totalHeight -
						subtractInnerElHeight(this.el, this.scroller.el); // everything that's NOT the scroller
				},


				// Sets the height of just the DayGrid component in this view
				setGridHeight: function (height, isAuto) {
					if (isAuto) {
						undistributeHeight(this.dayGrid.rowEls); // let the rows be their natural height with no expanding
					}
					else {
						distributeHeight(this.dayGrid.rowEls, height, true); // true = compensate for height-hogging rows
					}
				},


				/* Scroll
	------------------------------------------------------------------------------------------------------------------*/


				computeInitialDateScroll: function () {
					return {top: 0};
				},


				queryDateScroll: function () {
					return {top: this.scroller.getScrollTop()};
				},


				applyDateScroll: function (scroll) {
					if (scroll.top !== undefined) {
						this.scroller.setScrollTop(scroll.top);
					}
				}

			});


// Methods that will customize the rendering behavior of the BasicView's dayGrid
			var basicDayGridMethods = { // not relly methods anymore


				colWeekNumbersVisible: false, // display week numbers along the side?


				// Generates the HTML that will go before the day-of week header cells
				renderHeadIntroHtml: function () {
					var view = this.view;

					if (this.colWeekNumbersVisible) {
						return '' +
							'<th class="fc-week-number ' + view.calendar.theme.getClass('widgetHeader') + '" ' + view.weekNumberStyleAttr() + '>' +
							'<span>' + // needed for matchCellWidths
							htmlEscape(this.opt('weekNumberTitle')) +
							'</span>' +
							'</th>';
					}

					return '';
				},


				// Generates the HTML that will go before content-skeleton cells that display the day/week numbers
				renderNumberIntroHtml: function (row) {
					var view = this.view;
					var weekStart = this.getCellDate(row, 0);

					if (this.colWeekNumbersVisible) {
						return '' +
							'<td class="fc-week-number" ' + view.weekNumberStyleAttr() + '>' +
							view.buildGotoAnchorHtml( // aside from link, important for matchCellWidths
								{date: weekStart, type: 'week', forceOff: this.colCnt === 1},
								weekStart.format('w') // inner HTML
							) +
							'</td>';
					}

					return '';
				},


				// Generates the HTML that goes before the day bg cells for each day-row
				renderBgIntroHtml: function () {
					var view = this.view;

					if (this.colWeekNumbersVisible) {
						return '<td class="fc-week-number ' + view.calendar.theme.getClass('widgetContent') + '" ' +
							view.weekNumberStyleAttr() + '></td>';
					}

					return '';
				},


				// Generates the HTML that goes before every other type of row generated by DayGrid.
				// Affects helper-skeleton and highlight-skeleton rows.
				renderIntroHtml: function () {
					var view = this.view;

					if (this.colWeekNumbersVisible) {
						return '<td class="fc-week-number" ' + view.weekNumberStyleAttr() + '></td>';
					}

					return '';
				},


				getIsNumbersVisible: function () {
					return DayGrid.prototype.getIsNumbersVisible.apply(this, arguments) || this.colWeekNumbersVisible;
				}

			};

			;
			;

			/* A month view with day cells running in rows (one-per-week) and columns
----------------------------------------------------------------------------------------------------------------------*/

			var MonthView = FC.MonthView = BasicView.extend({


				// Computes the date range that will be rendered.
				buildRenderRange: function (currentUnzonedRange, currentRangeUnit, isRangeAllDay) {
					var renderUnzonedRange = BasicView.prototype.buildRenderRange.apply(this, arguments);
					var start = this.calendar.msToUtcMoment(renderUnzonedRange.startMs, isRangeAllDay);
					var end = this.calendar.msToUtcMoment(renderUnzonedRange.endMs, isRangeAllDay);
					var rowCnt;

					// ensure 6 weeks
					if (this.isFixedWeeks()) {
						rowCnt = Math.ceil( // could be partial weeks due to hiddenDays
							end.diff(start, 'weeks', true) // dontRound=true
						);
						end.add(6 - rowCnt, 'weeks');
					}

					return new UnzonedRange(start, end);
				},


				// Overrides the default BasicView behavior to have special multi-week auto-height logic
				setGridHeight: function (height, isAuto) {

					// if auto, make the height of each row the height that it would be if there were 6 weeks
					if (isAuto) {
						height *= this.rowCnt / 6;
					}

					distributeHeight(this.dayGrid.rowEls, height, !isAuto); // if auto, don't compensate for height-hogging rows
				},


				isFixedWeeks: function () {
					return this.opt('fixedWeekCount');
				},


				isDateInOtherMonth: function (date, dateProfile) {
					return date.month() !== moment.utc(dateProfile.currentUnzonedRange.startMs).month(); // TODO: optimize
				}

			});

			;
			;

			fcViews.basic = {
				'class': BasicView
			};

			fcViews.basicDay = {
				type: 'basic',
				duration: {days: 1}
			};

			fcViews.basicWeek = {
				type: 'basic',
				duration: {weeks: 1}
			};

			fcViews.month = {
				'class': MonthView,
				duration: {months: 1}, // important for prev/next
				defaults: {
					fixedWeekCount: true
				}
			};
			;
			;

			var TimeGridFillRenderer = FillRenderer.extend({


				attachSegEls: function (type, segs) {
					var timeGrid = this.component;
					var containerEls;

					// TODO: more efficient lookup
					if (type === 'bgEvent') {
						containerEls = timeGrid.bgContainerEls;
					}
					else if (type === 'businessHours') {
						containerEls = timeGrid.businessContainerEls;
					}
					else if (type === 'highlight') {
						containerEls = timeGrid.highlightContainerEls;
					}

					timeGrid.updateSegVerticals(segs);
					timeGrid.attachSegsByCol(timeGrid.groupSegsByCol(segs), containerEls);

					return segs.map(function (seg) {
						return seg.el[0];
					});
				}

			});

			;
			;

			/*
Only handles foreground segs.
Does not own rendering. Use for low-level util methods by TimeGrid.
*/
			var TimeGridEventRenderer = EventRenderer.extend({

				timeGrid: null,


				constructor: function (timeGrid) {
					EventRenderer.apply(this, arguments);

					this.timeGrid = timeGrid;
				},


				renderFgSegs: function (segs) {
					this.renderFgSegsIntoContainers(segs, this.timeGrid.fgContainerEls);
				},


				// Given an array of foreground segments, render a DOM element for each, computes position,
				// and attaches to the column inner-container elements.
				renderFgSegsIntoContainers: function (segs, containerEls) {
					var segsByCol;
					var col;

					segsByCol = this.timeGrid.groupSegsByCol(segs);

					for (col = 0; col < this.timeGrid.colCnt; col++) {
						this.updateFgSegCoords(segsByCol[col]);
					}

					this.timeGrid.attachSegsByCol(segsByCol, containerEls);
				},


				unrenderFgSegs: function () {
					if (this.fgSegs) { // hack
						this.fgSegs.forEach(function (seg) {
							seg.el.remove();
						});
					}
				},


				// Computes a default event time formatting string if `timeFormat` is not explicitly defined
				computeEventTimeFormat: function () {
					return this.opt('noMeridiemTimeFormat'); // like "6:30" (no AM/PM)
				},


				// Computes a default `displayEventEnd` value if one is not expliclty defined
				computeDisplayEventEnd: function () {
					return true;
				},


				// Renders the HTML for a single event segment's default rendering
				fgSegHtml: function (seg, disableResizing) {
					var view = this.view;
					var calendar = view.calendar;
					var componentFootprint = seg.footprint.componentFootprint;
					var isAllDay = componentFootprint.isAllDay;
					var eventDef = seg.footprint.eventDef;
					var isDraggable = view.isEventDefDraggable(eventDef);
					var isResizableFromStart = !disableResizing && seg.isStart && view.isEventDefResizableFromStart(eventDef);
					var isResizableFromEnd = !disableResizing && seg.isEnd && view.isEventDefResizableFromEnd(eventDef);
					var classes = this.getSegClasses(seg, isDraggable, isResizableFromStart || isResizableFromEnd);
					var skinCss = cssToStr(this.getSkinCss(eventDef));
					var timeText;
					var fullTimeText; // more verbose time text. for the print stylesheet
					var startTimeText; // just the start time text

					classes.unshift('fc-time-grid-event', 'fc-v-event');

					// if the event appears to span more than one day...
					if (view.isMultiDayRange(componentFootprint.unzonedRange)) {
						// Don't display time text on segments that run entirely through a day.
						// That would appear as midnight-midnight and would look dumb.
						// Otherwise, display the time text for the *segment's* times (like 6pm-midnight or midnight-10am)
						if (seg.isStart || seg.isEnd) {
							var zonedStart = calendar.msToMoment(seg.startMs);
							var zonedEnd = calendar.msToMoment(seg.endMs);
							timeText = this._getTimeText(zonedStart, zonedEnd, isAllDay);
							fullTimeText = this._getTimeText(zonedStart, zonedEnd, isAllDay, 'LT');
							startTimeText = this._getTimeText(zonedStart, zonedEnd, isAllDay, null, false); // displayEnd=false
						}
					}
					else {
						// Display the normal time text for the *event's* times
						timeText = this.getTimeText(seg.footprint);
						fullTimeText = this.getTimeText(seg.footprint, 'LT');
						startTimeText = this.getTimeText(seg.footprint, null, false); // displayEnd=false
					}

					return '<a class="' + classes.join(' ') + '"' +
						(eventDef.url ?
								' href="' + htmlEscape(eventDef.url) + '"' :
								''
						) +
						(skinCss ?
								' style="' + skinCss + '"' :
								''
						) +
						'>' +
						'<div class="fc-content">' +
						(timeText ?
								'<div class="fc-time"' +
								' data-start="' + htmlEscape(startTimeText) + '"' +
								' data-full="' + htmlEscape(fullTimeText) + '"' +
								'>' +
								'<span>' + htmlEscape(timeText) + '</span>' +
								'</div>' :
								''
						) +
						(eventDef.title ?
								'<div class="fc-title">' +
								htmlEscape(eventDef.title) +
								'</div>' :
								''
						) +
						'</div>' +
						'<div class="fc-bg"/>' +
						/* TODO: write CSS for this
				(isResizableFromStart ?
					'<div class="fc-resizer fc-start-resizer" />' :
					''
					) +
				*/
						(isResizableFromEnd ?
								'<div class="fc-resizer fc-end-resizer" />' :
								''
						) +
						'</a>';
				},


				// Given segments that are assumed to all live in the *same column*,
				// compute their verical/horizontal coordinates and assign to their elements.
				updateFgSegCoords: function (segs) {
					this.timeGrid.computeSegVerticals(segs); // horizontals relies on this
					this.computeFgSegHorizontals(segs); // compute horizontal coordinates, z-index's, and reorder the array
					this.timeGrid.assignSegVerticals(segs);
					this.assignFgSegHorizontals(segs);
				},


				// Given an array of segments that are all in the same column, sets the backwardCoord and forwardCoord on each.
				// NOTE: Also reorders the given array by date!
				computeFgSegHorizontals: function (segs) {
					var levels;
					var level0;
					var i;

					this.sortEventSegs(segs); // order by certain criteria
					levels = buildSlotSegLevels(segs);
					computeForwardSlotSegs(levels);

					if ((level0 = levels[0])) {

						for (i = 0; i < level0.length; i++) {
							computeSlotSegPressures(level0[i]);
						}

						for (i = 0; i < level0.length; i++) {
							this.computeFgSegForwardBack(level0[i], 0, 0);
						}
					}
				},


				// Calculate seg.forwardCoord and seg.backwardCoord for the segment, where both values range
				// from 0 to 1. If the calendar is left-to-right, the seg.backwardCoord maps to "left" and
				// seg.forwardCoord maps to "right" (via percentage). Vice-versa if the calendar is right-to-left.
				//
				// The segment might be part of a "series", which means consecutive segments with the same pressure
				// who's width is unknown until an edge has been hit. `seriesBackwardPressure` is the number of
				// segments behind this one in the current series, and `seriesBackwardCoord` is the starting
				// coordinate of the first segment in the series.
				computeFgSegForwardBack: function (seg, seriesBackwardPressure, seriesBackwardCoord) {
					var forwardSegs = seg.forwardSegs;
					var i;

					if (seg.forwardCoord === undefined) { // not already computed

						if (!forwardSegs.length) {

							// if there are no forward segments, this segment should butt up against the edge
							seg.forwardCoord = 1;
						}
						else {

							// sort highest pressure first
							this.sortForwardSegs(forwardSegs);

							// this segment's forwardCoord will be calculated from the backwardCoord of the
							// highest-pressure forward segment.
							this.computeFgSegForwardBack(forwardSegs[0], seriesBackwardPressure + 1, seriesBackwardCoord);
							seg.forwardCoord = forwardSegs[0].backwardCoord;
						}

						// calculate the backwardCoord from the forwardCoord. consider the series
						seg.backwardCoord = seg.forwardCoord -
							(seg.forwardCoord - seriesBackwardCoord) / // available width for series
							(seriesBackwardPressure + 1); // # of segments in the series

						// use this segment's coordinates to computed the coordinates of the less-pressurized
						// forward segments
						for (i = 0; i < forwardSegs.length; i++) {
							this.computeFgSegForwardBack(forwardSegs[i], 0, seg.forwardCoord);
						}
					}
				},


				sortForwardSegs: function (forwardSegs) {
					forwardSegs.sort(proxy(this, 'compareForwardSegs'));
				},


				// A cmp function for determining which forward segment to rely on more when computing coordinates.
				compareForwardSegs: function (seg1, seg2) {
					// put higher-pressure first
					return seg2.forwardPressure - seg1.forwardPressure ||
						// put segments that are closer to initial edge first (and favor ones with no coords yet)
						(seg1.backwardCoord || 0) - (seg2.backwardCoord || 0) ||
						// do normal sorting...
						this.compareEventSegs(seg1, seg2);
				},


				// Given foreground event segments that have already had their position coordinates computed,
				// assigns position-related CSS values to their elements.
				assignFgSegHorizontals: function (segs) {
					var i, seg;

					for (i = 0; i < segs.length; i++) {
						seg = segs[i];
						seg.el.css(this.generateFgSegHorizontalCss(seg));

						// if the height is short, add a className for alternate styling
						if (seg.bottom - seg.top < 30) {
							seg.el.addClass('fc-short');
						}
					}
				},


				// Generates an object with CSS properties/values that should be applied to an event segment element.
				// Contains important positioning-related properties that should be applied to any event element, customized or not.
				generateFgSegHorizontalCss: function (seg) {
					var shouldOverlap = this.opt('slotEventOverlap');
					var backwardCoord = seg.backwardCoord; // the left side if LTR. the right side if RTL. floating-point
					var forwardCoord = seg.forwardCoord; // the right side if LTR. the left side if RTL. floating-point
					var props = this.timeGrid.generateSegVerticalCss(seg); // get top/bottom first
					var left; // amount of space from left edge, a fraction of the total width
					var right; // amount of space from right edge, a fraction of the total width

					if (shouldOverlap) {
						// double the width, but don't go beyond the maximum forward coordinate (1.0)
						forwardCoord = Math.min(1, backwardCoord + (forwardCoord - backwardCoord) * 2);
					}

					if (this.timeGrid.isRTL) {
						left = 1 - forwardCoord;
						right = backwardCoord;
					}
					else {
						left = backwardCoord;
						right = 1 - forwardCoord;
					}

					props.zIndex = seg.level + 1; // convert from 0-base to 1-based
					props.left = left * 100 + '%';
					props.right = right * 100 + '%';

					if (shouldOverlap && seg.forwardPressure) {
						// add padding to the edge so that forward stacked events don't cover the resizer's icon
						props[this.isRTL ? 'marginLeft' : 'marginRight'] = 10 * 2; // 10 is a guesstimate of the icon's width
					}

					return props;
				}

			});


// Builds an array of segments "levels". The first level will be the leftmost tier of segments if the calendar is
// left-to-right, or the rightmost if the calendar is right-to-left. Assumes the segments are already ordered by date.
			function buildSlotSegLevels(segs) {
				var levels = [];
				var i, seg;
				var j;

				for (i = 0; i < segs.length; i++) {
					seg = segs[i];

					// go through all the levels and stop on the first level where there are no collisions
					for (j = 0; j < levels.length; j++) {
						if (!computeSlotSegCollisions(seg, levels[j]).length) {
							break;
						}
					}

					seg.level = j;

					(levels[j] || (levels[j] = [])).push(seg);
				}

				return levels;
			}


// For every segment, figure out the other segments that are in subsequent
// levels that also occupy the same vertical space. Accumulate in seg.forwardSegs
			function computeForwardSlotSegs(levels) {
				var i, level;
				var j, seg;
				var k;

				for (i = 0; i < levels.length; i++) {
					level = levels[i];

					for (j = 0; j < level.length; j++) {
						seg = level[j];

						seg.forwardSegs = [];
						for (k = i + 1; k < levels.length; k++) {
							computeSlotSegCollisions(seg, levels[k], seg.forwardSegs);
						}
					}
				}
			}


// Figure out which path forward (via seg.forwardSegs) results in the longest path until
// the furthest edge is reached. The number of segments in this path will be seg.forwardPressure
			function computeSlotSegPressures(seg) {
				var forwardSegs = seg.forwardSegs;
				var forwardPressure = 0;
				var i, forwardSeg;

				if (seg.forwardPressure === undefined) { // not already computed

					for (i = 0; i < forwardSegs.length; i++) {
						forwardSeg = forwardSegs[i];

						// figure out the child's maximum forward path
						computeSlotSegPressures(forwardSeg);

						// either use the existing maximum, or use the child's forward pressure
						// plus one (for the forwardSeg itself)
						forwardPressure = Math.max(
							forwardPressure,
							1 + forwardSeg.forwardPressure
						);
					}

					seg.forwardPressure = forwardPressure;
				}
			}


// Find all the segments in `otherSegs` that vertically collide with `seg`.
// Append into an optionally-supplied `results` array and return.
			function computeSlotSegCollisions(seg, otherSegs, results) {
				results = results || [];

				for (var i = 0; i < otherSegs.length; i++) {
					if (isSlotSegCollision(seg, otherSegs[i])) {
						results.push(otherSegs[i]);
					}
				}

				return results;
			}


// Do these segments occupy the same vertical space?
			function isSlotSegCollision(seg1, seg2) {
				return seg1.bottom > seg2.top && seg1.top < seg2.bottom;
			}

			;
			;

			var TimeGridHelperRenderer = HelperRenderer.extend({


				renderSegs: function (segs, sourceSeg) {
					var helperNodes = [];
					var i, seg;
					var sourceEl;

					// TODO: not good to call eventRenderer this way
					this.eventRenderer.renderFgSegsIntoContainers(
						segs,
						this.component.helperContainerEls
					);

					// Try to make the segment that is in the same row as sourceSeg look the same
					for (i = 0; i < segs.length; i++) {
						seg = segs[i];

						if (sourceSeg && sourceSeg.col === seg.col) {
							sourceEl = sourceSeg.el;
							seg.el.css({
								left: sourceEl.css('left'),
								right: sourceEl.css('right'),
								'margin-left': sourceEl.css('margin-left'),
								'margin-right': sourceEl.css('margin-right')
							});
						}

						helperNodes.push(seg.el[0]);
					}

					return $(helperNodes); // must return the elements rendered
				}

			});

			;
			;

			/* A component that renders one or more columns of vertical time slots
----------------------------------------------------------------------------------------------------------------------*/
// We mixin DayTable, even though there is only a single row of days

			var TimeGrid = FC.TimeGrid = InteractiveDateComponent.extend(StandardInteractionsMixin, DayTableMixin, {

				eventRendererClass: TimeGridEventRenderer,
				businessHourRendererClass: BusinessHourRenderer,
				helperRendererClass: TimeGridHelperRenderer,
				fillRendererClass: TimeGridFillRenderer,

				view: null, // TODO: make more general and/or remove
				helperRenderer: null,

				dayRanges: null, // UnzonedRange[], of start-end of each day
				slotDuration: null, // duration of a "slot", a distinct time segment on given day, visualized by lines
				snapDuration: null, // granularity of time for dragging and selecting
				snapsPerSlot: null,
				labelFormat: null, // formatting string for times running along vertical axis
				labelInterval: null, // duration of how often a label should be displayed for a slot

				headContainerEl: null, // div that hold's the date header
				colEls: null, // cells elements in the day-row background
				slatContainerEl: null, // div that wraps all the slat rows
				slatEls: null, // elements running horizontally across all columns
				nowIndicatorEls: null,

				colCoordCache: null,
				slatCoordCache: null,

				bottomRuleEl: null, // hidden by default
				contentSkeletonEl: null,
				colContainerEls: null, // containers for each column

				// inner-containers for each column where different types of segs live
				fgContainerEls: null,
				bgContainerEls: null,
				helperContainerEls: null,
				highlightContainerEls: null,
				businessContainerEls: null,

				// arrays of different types of displayed segments
				helperSegs: null,
				highlightSegs: null,
				businessSegs: null,


				constructor: function (view) {
					this.view = view; // do first, for opt calls during initialization

					InteractiveDateComponent.call(this); // call the super-constructor

					this.processOptions();
				},


				// Slices up the given span (unzoned start/end with other misc data) into an array of segments
				componentFootprintToSegs: function (componentFootprint) {
					var segs = this.sliceRangeByTimes(componentFootprint.unzonedRange);
					var i;

					for (i = 0; i < segs.length; i++) {
						if (this.isRTL) {
							segs[i].col = this.daysPerRow - 1 - segs[i].dayIndex;
						}
						else {
							segs[i].col = segs[i].dayIndex;
						}
					}

					return segs;
				},


				/* Date Handling
	------------------------------------------------------------------------------------------------------------------*/


				sliceRangeByTimes: function (unzonedRange) {
					var segs = [];
					var segRange;
					var dayIndex;

					for (dayIndex = 0; dayIndex < this.daysPerRow; dayIndex++) {

						segRange = unzonedRange.intersect(this.dayRanges[dayIndex]);

						if (segRange) {
							segs.push({
								startMs: segRange.startMs,
								endMs: segRange.endMs,
								isStart: segRange.isStart,
								isEnd: segRange.isEnd,
								dayIndex: dayIndex
							});
						}
					}

					return segs;
				},


				/* Options
	------------------------------------------------------------------------------------------------------------------*/


				// Parses various options into properties of this object
				processOptions: function () {
					var slotDuration = this.opt('slotDuration');
					var snapDuration = this.opt('snapDuration');
					var input;

					slotDuration = moment.duration(slotDuration);
					snapDuration = snapDuration ? moment.duration(snapDuration) : slotDuration;

					this.slotDuration = slotDuration;
					this.snapDuration = snapDuration;
					this.snapsPerSlot = slotDuration / snapDuration; // TODO: ensure an integer multiple?

					// might be an array value (for TimelineView).
					// if so, getting the most granular entry (the last one probably).
					input = this.opt('slotLabelFormat');
					if ($.isArray(input)) {
						input = input[input.length - 1];
					}

					this.labelFormat = input ||
						this.opt('smallTimeFormat'); // the computed default

					input = this.opt('slotLabelInterval');
					this.labelInterval = input ?
						moment.duration(input) :
						this.computeLabelInterval(slotDuration);
				},


				// Computes an automatic value for slotLabelInterval
				computeLabelInterval: function (slotDuration) {
					var i;
					var labelInterval;
					var slotsPerLabel;

					// find the smallest stock label interval that results in more than one slots-per-label
					for (i = AGENDA_STOCK_SUB_DURATIONS.length - 1; i >= 0; i--) {
						labelInterval = moment.duration(AGENDA_STOCK_SUB_DURATIONS[i]);
						slotsPerLabel = divideDurationByDuration(labelInterval, slotDuration);
						if (isInt(slotsPerLabel) && slotsPerLabel > 1) {
							return labelInterval;
						}
					}

					return moment.duration(slotDuration); // fall back. clone
				},


				/* Date Rendering
	------------------------------------------------------------------------------------------------------------------*/


				renderDates: function (dateProfile) {
					this.dateProfile = dateProfile;
					this.updateDayTable();
					this.renderSlats();
					this.renderColumns();
				},


				unrenderDates: function () {
					//this.unrenderSlats(); // don't need this because repeated .html() calls clear
					this.unrenderColumns();
				},


				renderSkeleton: function () {
					var theme = this.view.calendar.theme;

					this.el.html(
						'<div class="fc-bg"></div>' +
						'<div class="fc-slats"></div>' +
						'<hr class="fc-divider ' + theme.getClass('widgetHeader') + '" style="display:none" />'
					);

					this.bottomRuleEl = this.el.find('hr');
				},


				renderSlats: function () {
					var theme = this.view.calendar.theme;

					this.slatContainerEl = this.el.find('> .fc-slats')
						.html( // avoids needing ::unrenderSlats()
							'<table class="' + theme.getClass('tableGrid') + '">' +
							this.renderSlatRowHtml() +
							'</table>'
						);

					this.slatEls = this.slatContainerEl.find('tr');

					this.slatCoordCache = new CoordCache({
						els: this.slatEls,
						isVertical: true
					});
				},


				// Generates the HTML for the horizontal "slats" that run width-wise. Has a time axis on a side. Depends on RTL.
				renderSlatRowHtml: function () {
					var view = this.view;
					var calendar = view.calendar;
					var theme = calendar.theme;
					var isRTL = this.isRTL;
					var dateProfile = this.dateProfile;
					var html = '';
					var slotTime = moment.duration(+dateProfile.minTime); // wish there was .clone() for durations
					var slotIterator = moment.duration(0);
					var slotDate; // will be on the view's first day, but we only care about its time
					var isLabeled;
					var axisHtml;

					// Calculate the time for each slot
					while (slotTime < dateProfile.maxTime) {
						slotDate = calendar.msToUtcMoment(dateProfile.renderUnzonedRange.startMs).time(slotTime);
						isLabeled = isInt(divideDurationByDuration(slotIterator, this.labelInterval));

						axisHtml =
							'<td class="fc-axis fc-time ' + theme.getClass('widgetContent') + '" ' + view.axisStyleAttr() + '>' +
							(isLabeled ?
									'<span>' + // for matchCellWidths
									htmlEscape(slotDate.format(this.labelFormat)) +
									'</span>' :
									''
							) +
							'</td>';

						html +=
							'<tr data-time="' + slotDate.format('HH:mm:ss') + '"' +
							(isLabeled ? '' : ' class="fc-minor"') +
							'>' +
							(!isRTL ? axisHtml : '') +
							'<td class="' + theme.getClass('widgetContent') + '"/>' +
							(isRTL ? axisHtml : '') +
							"</tr>";

						slotTime.add(this.slotDuration);
						slotIterator.add(this.slotDuration);
					}

					return html;
				},


				renderColumns: function () {
					var dateProfile = this.dateProfile;
					var theme = this.view.calendar.theme;

					this.dayRanges = this.dayDates.map(function (dayDate) {
						return new UnzonedRange(
							dayDate.clone().add(dateProfile.minTime),
							dayDate.clone().add(dateProfile.maxTime)
						);
					});

					if (this.headContainerEl) {
						this.headContainerEl.html(this.renderHeadHtml());
					}

					this.el.find('> .fc-bg').html(
						'<table class="' + theme.getClass('tableGrid') + '">' +
						this.renderBgTrHtml(0) + // row=0
						'</table>'
					);

					this.colEls = this.el.find('.fc-day, .fc-disabled-day');

					this.colCoordCache = new CoordCache({
						els: this.colEls,
						isHorizontal: true
					});

					this.renderContentSkeleton();
				},


				unrenderColumns: function () {
					this.unrenderContentSkeleton();
				},


				/* Content Skeleton
	------------------------------------------------------------------------------------------------------------------*/


				// Renders the DOM that the view's content will live in
				renderContentSkeleton: function () {
					var cellHtml = '';
					var i;
					var skeletonEl;

					for (i = 0; i < this.colCnt; i++) {
						cellHtml +=
							'<td>' +
							'<div class="fc-content-col">' +
							'<div class="fc-event-container fc-helper-container"></div>' +
							'<div class="fc-event-container"></div>' +
							'<div class="fc-highlight-container"></div>' +
							'<div class="fc-bgevent-container"></div>' +
							'<div class="fc-business-container"></div>' +
							'</div>' +
							'</td>';
					}

					skeletonEl = this.contentSkeletonEl = $(
						'<div class="fc-content-skeleton">' +
						'<table>' +
						'<tr>' + cellHtml + '</tr>' +
						'</table>' +
						'</div>'
					);

					this.colContainerEls = skeletonEl.find('.fc-content-col');
					this.helperContainerEls = skeletonEl.find('.fc-helper-container');
					this.fgContainerEls = skeletonEl.find('.fc-event-container:not(.fc-helper-container)');
					this.bgContainerEls = skeletonEl.find('.fc-bgevent-container');
					this.highlightContainerEls = skeletonEl.find('.fc-highlight-container');
					this.businessContainerEls = skeletonEl.find('.fc-business-container');

					this.bookendCells(skeletonEl.find('tr')); // TODO: do this on string level
					this.el.append(skeletonEl);
				},


				unrenderContentSkeleton: function () {
					this.contentSkeletonEl.remove();
					this.contentSkeletonEl = null;
					this.colContainerEls = null;
					this.helperContainerEls = null;
					this.fgContainerEls = null;
					this.bgContainerEls = null;
					this.highlightContainerEls = null;
					this.businessContainerEls = null;
				},


				// Given a flat array of segments, return an array of sub-arrays, grouped by each segment's col
				groupSegsByCol: function (segs) {
					var segsByCol = [];
					var i;

					for (i = 0; i < this.colCnt; i++) {
						segsByCol.push([]);
					}

					for (i = 0; i < segs.length; i++) {
						segsByCol[segs[i].col].push(segs[i]);
					}

					return segsByCol;
				},


				// Given segments grouped by column, insert the segments' elements into a parallel array of container
				// elements, each living within a column.
				attachSegsByCol: function (segsByCol, containerEls) {
					var col;
					var segs;
					var i;

					for (col = 0; col < this.colCnt; col++) { // iterate each column grouping
						segs = segsByCol[col];

						for (i = 0; i < segs.length; i++) {
							containerEls.eq(col).append(segs[i].el);
						}
					}
				},


				/* Now Indicator
	------------------------------------------------------------------------------------------------------------------*/


				getNowIndicatorUnit: function () {
					return 'minute'; // will refresh on the minute
				},


				renderNowIndicator: function (date) {
					// seg system might be overkill, but it handles scenario where line needs to be rendered
					//  more than once because of columns with the same date (resources columns for example)
					var segs = this.componentFootprintToSegs(
						new ComponentFootprint(
							new UnzonedRange(date, date.valueOf() + 1), // protect against null range
							false // all-day
						)
					);
					var top = this.computeDateTop(date, date);
					var nodes = [];
					var i;

					// render lines within the columns
					for (i = 0; i < segs.length; i++) {
						nodes.push($('<div class="fc-now-indicator fc-now-indicator-line"></div>')
							.css('top', top)
							.appendTo(this.colContainerEls.eq(segs[i].col))[0]);
					}

					// render an arrow over the axis
					if (segs.length > 0) { // is the current time in view?
						nodes.push($('<div class="fc-now-indicator fc-now-indicator-arrow"></div>')
							.css('top', top)
							.appendTo(this.el.find('.fc-content-skeleton'))[0]);
					}

					this.nowIndicatorEls = $(nodes);
				},


				unrenderNowIndicator: function () {
					if (this.nowIndicatorEls) {
						this.nowIndicatorEls.remove();
						this.nowIndicatorEls = null;
					}
				},


				/* Coordinates
	------------------------------------------------------------------------------------------------------------------*/


				updateSize: function (totalHeight, isAuto, isResize) {
					InteractiveDateComponent.prototype.updateSize.apply(this, arguments);

					this.slatCoordCache.build();

					if (isResize) {
						this.updateSegVerticals(
							[].concat(this.eventRenderer.getSegs(), this.businessSegs || [])
						);
					}
				},


				getTotalSlatHeight: function () {
					return this.slatContainerEl.outerHeight();
				},


				// Computes the top coordinate, relative to the bounds of the grid, of the given date.
				// `ms` can be a millisecond UTC time OR a UTC moment.
				// A `startOfDayDate` must be given for avoiding ambiguity over how to treat midnight.
				computeDateTop: function (ms, startOfDayDate) {
					return this.computeTimeTop(
						moment.duration(
							ms - startOfDayDate.clone().stripTime()
						)
					);
				},


				// Computes the top coordinate, relative to the bounds of the grid, of the given time (a Duration).
				computeTimeTop: function (time) {
					var len = this.slatEls.length;
					var dateProfile = this.dateProfile;
					var slatCoverage = (time - dateProfile.minTime) / this.slotDuration; // floating-point value of # of slots covered
					var slatIndex;
					var slatRemainder;

					// compute a floating-point number for how many slats should be progressed through.
					// from 0 to number of slats (inclusive)
					// constrained because minTime/maxTime might be customized.
					slatCoverage = Math.max(0, slatCoverage);
					slatCoverage = Math.min(len, slatCoverage);

					// an integer index of the furthest whole slat
					// from 0 to number slats (*exclusive*, so len-1)
					slatIndex = Math.floor(slatCoverage);
					slatIndex = Math.min(slatIndex, len - 1);

					// how much further through the slatIndex slat (from 0.0-1.0) must be covered in addition.
					// could be 1.0 if slatCoverage is covering *all* the slots
					slatRemainder = slatCoverage - slatIndex;

					return this.slatCoordCache.getTopPosition(slatIndex) +
						this.slatCoordCache.getHeight(slatIndex) * slatRemainder;
				},


				// Refreshes the CSS top/bottom coordinates for each segment element.
				// Works when called after initial render, after a window resize/zoom for example.
				updateSegVerticals: function (segs) {
					this.computeSegVerticals(segs);
					this.assignSegVerticals(segs);
				},


				// For each segment in an array, computes and assigns its top and bottom properties
				computeSegVerticals: function (segs) {
					var eventMinHeight = this.opt('agendaEventMinHeight');
					var i, seg;
					var dayDate;

					for (i = 0; i < segs.length; i++) {
						seg = segs[i];
						dayDate = this.dayDates[seg.dayIndex];

						seg.top = this.computeDateTop(seg.startMs, dayDate);
						seg.bottom = Math.max(
							seg.top + eventMinHeight,
							this.computeDateTop(seg.endMs, dayDate)
						);
					}
				},


				// Given segments that already have their top/bottom properties computed, applies those values to
				// the segments' elements.
				assignSegVerticals: function (segs) {
					var i, seg;

					for (i = 0; i < segs.length; i++) {
						seg = segs[i];
						seg.el.css(this.generateSegVerticalCss(seg));
					}
				},


				// Generates an object with CSS properties for the top/bottom coordinates of a segment element
				generateSegVerticalCss: function (seg) {
					return {
						top: seg.top,
						bottom: -seg.bottom // flipped because needs to be space beyond bottom edge of event container
					};
				},


				/* Hit System
	------------------------------------------------------------------------------------------------------------------*/


				prepareHits: function () {
					this.colCoordCache.build();
					this.slatCoordCache.build();
				},


				releaseHits: function () {
					this.colCoordCache.clear();
					// NOTE: don't clear slatCoordCache because we rely on it for computeTimeTop
				},


				queryHit: function (leftOffset, topOffset) {
					var snapsPerSlot = this.snapsPerSlot;
					var colCoordCache = this.colCoordCache;
					var slatCoordCache = this.slatCoordCache;

					if (colCoordCache.isLeftInBounds(leftOffset) && slatCoordCache.isTopInBounds(topOffset)) {
						var colIndex = colCoordCache.getHorizontalIndex(leftOffset);
						var slatIndex = slatCoordCache.getVerticalIndex(topOffset);

						if (colIndex != null && slatIndex != null) {
							var slatTop = slatCoordCache.getTopOffset(slatIndex);
							var slatHeight = slatCoordCache.getHeight(slatIndex);
							var partial = (topOffset - slatTop) / slatHeight; // floating point number between 0 and 1
							var localSnapIndex = Math.floor(partial * snapsPerSlot); // the snap # relative to start of slat
							var snapIndex = slatIndex * snapsPerSlot + localSnapIndex;
							var snapTop = slatTop + (localSnapIndex / snapsPerSlot) * slatHeight;
							var snapBottom = slatTop + ((localSnapIndex + 1) / snapsPerSlot) * slatHeight;

							return {
								col: colIndex,
								snap: snapIndex,
								component: this, // needed unfortunately :(
								left: colCoordCache.getLeftOffset(colIndex),
								right: colCoordCache.getRightOffset(colIndex),
								top: snapTop,
								bottom: snapBottom
							};
						}
					}
				},


				getHitFootprint: function (hit) {
					var start = this.getCellDate(0, hit.col); // row=0
					var time = this.computeSnapTime(hit.snap); // pass in the snap-index
					var end;

					start.time(time);
					end = start.clone().add(this.snapDuration);

					return new ComponentFootprint(
						new UnzonedRange(start, end),
						false // all-day?
					);
				},


				// Given a row number of the grid, representing a "snap", returns a time (Duration) from its start-of-day
				computeSnapTime: function (snapIndex) {
					return moment.duration(this.dateProfile.minTime + this.snapDuration * snapIndex);
				},


				getHitEl: function (hit) {
					return this.colEls.eq(hit.col);
				},


				/* Event Drag Visualization
	------------------------------------------------------------------------------------------------------------------*/


				// Renders a visual indication of an event being dragged over the specified date(s).
				// A returned value of `true` signals that a mock "helper" event has been rendered.
				renderDrag: function (eventFootprints, seg, isTouch) {
					var i;

					if (seg) { // if there is event information for this drag, render a helper event

						if (eventFootprints.length) {
							this.helperRenderer.renderEventDraggingFootprints(eventFootprints, seg, isTouch);

							// signal that a helper has been rendered
							return true;
						}
					}
					else { // otherwise, just render a highlight

						for (i = 0; i < eventFootprints.length; i++) {
							this.renderHighlight(eventFootprints[i].componentFootprint);
						}
					}
				},


				// Unrenders any visual indication of an event being dragged
				unrenderDrag: function (seg) {
					this.unrenderHighlight();
					this.helperRenderer.unrender();
				},


				/* Event Resize Visualization
	------------------------------------------------------------------------------------------------------------------*/


				// Renders a visual indication of an event being resized
				renderEventResize: function (eventFootprints, seg, isTouch) {
					this.helperRenderer.renderEventResizingFootprints(eventFootprints, seg, isTouch);
				},


				// Unrenders any visual indication of an event being resized
				unrenderEventResize: function (seg) {
					this.helperRenderer.unrender();
				},


				/* Selection
	------------------------------------------------------------------------------------------------------------------*/


				// Renders a visual indication of a selection. Overrides the default, which was to simply render a highlight.
				renderSelectionFootprint: function (componentFootprint) {
					if (this.opt('selectHelper')) { // this setting signals that a mock helper event should be rendered
						this.helperRenderer.renderComponentFootprint(componentFootprint);
					}
					else {
						this.renderHighlight(componentFootprint);
					}
				},


				// Unrenders any visual indication of a selection
				unrenderSelection: function () {
					this.helperRenderer.unrender();
					this.unrenderHighlight();
				}

			});

			;
			;

			/* An abstract class for all agenda-related views. Displays one more columns with time slots running vertically.
----------------------------------------------------------------------------------------------------------------------*/
// Is a manager for the TimeGrid subcomponent and possibly the DayGrid subcomponent (if allDaySlot is on).
// Responsible for managing width/height.

			var AgendaView = FC.AgendaView = View.extend({

				scroller: null,

				timeGridClass: TimeGrid, // class used to instantiate the timeGrid. subclasses can override
				timeGrid: null, // the main time-grid subcomponent of this view

				dayGridClass: DayGrid, // class used to instantiate the dayGrid. subclasses can override
				dayGrid: null, // the "all-day" subcomponent. if all-day is turned off, this will be null

				axisWidth: null, // the width of the time axis running down the side

				// indicates that minTime/maxTime affects rendering
				usesMinMaxTime: true,


				constructor: function () {
					View.apply(this, arguments);

					this.timeGrid = this.instantiateTimeGrid();
					this.addChild(this.timeGrid);

					if (this.opt('allDaySlot')) { // should we display the "all-day" area?
						this.dayGrid = this.instantiateDayGrid(); // the all-day subcomponent of this view
						this.addChild(this.dayGrid);
					}

					this.scroller = new Scroller({
						overflowX: 'hidden',
						overflowY: 'auto'
					});
				},


				// Instantiates the TimeGrid object this view needs. Draws from this.timeGridClass
				instantiateTimeGrid: function () {
					var subclass = this.timeGridClass.extend(agendaTimeGridMethods);

					return new subclass(this);
				},


				// Instantiates the DayGrid object this view might need. Draws from this.dayGridClass
				instantiateDayGrid: function () {
					var subclass = this.dayGridClass.extend(agendaDayGridMethods);

					return new subclass(this);
				},


				/* Rendering
	------------------------------------------------------------------------------------------------------------------*/


				renderSkeleton: function () {
					var timeGridWrapEl;
					var timeGridEl;

					this.el.addClass('fc-agenda-view').html(this.renderSkeletonHtml());

					this.scroller.render();

					timeGridWrapEl = this.scroller.el.addClass('fc-time-grid-container');
					timeGridEl = $('<div class="fc-time-grid" />').appendTo(timeGridWrapEl);

					this.el.find('.fc-body > tr > td').append(timeGridWrapEl);

					this.timeGrid.headContainerEl = this.el.find('.fc-head-container');
					this.timeGrid.setElement(timeGridEl);

					if (this.dayGrid) {
						this.dayGrid.setElement(this.el.find('.fc-day-grid'));

						// have the day-grid extend it's coordinate area over the <hr> dividing the two grids
						this.dayGrid.bottomCoordPadding = this.dayGrid.el.next('hr').outerHeight();
					}
				},


				unrenderSkeleton: function () {
					this.timeGrid.removeElement();

					if (this.dayGrid) {
						this.dayGrid.removeElement();
					}

					this.scroller.destroy();
				},


				// Builds the HTML skeleton for the view.
				// The day-grid and time-grid components will render inside containers defined by this HTML.
				renderSkeletonHtml: function () {
					var theme = this.calendar.theme;

					return '' +
						'<table class="' + theme.getClass('tableGrid') + '">' +
						(this.opt('columnHeader') ?
								'<thead class="fc-head">' +
								'<tr>' +
								'<td class="fc-head-container ' + theme.getClass('widgetHeader') + '">&nbsp;</td>' +
								'</tr>' +
								'</thead>' :
								''
						) +
						'<tbody class="fc-body">' +
						'<tr>' +
						'<td class="' + theme.getClass('widgetContent') + '">' +
						(this.dayGrid ?
								'<div class="fc-day-grid"/>' +
								'<hr class="fc-divider ' + theme.getClass('widgetHeader') + '"/>' :
								''
						) +
						'</td>' +
						'</tr>' +
						'</tbody>' +
						'</table>';
				},


				// Generates an HTML attribute string for setting the width of the axis, if it is known
				axisStyleAttr: function () {
					if (this.axisWidth !== null) {
						return 'style="width:' + this.axisWidth + 'px"';
					}
					return '';
				},


				/* Now Indicator
	------------------------------------------------------------------------------------------------------------------*/


				getNowIndicatorUnit: function () {
					return this.timeGrid.getNowIndicatorUnit();
				},


				/* Dimensions
	------------------------------------------------------------------------------------------------------------------*/


				// Adjusts the vertical dimensions of the view to the specified values
				updateSize: function (totalHeight, isAuto, isResize) {
					var eventLimit;
					var scrollerHeight;
					var scrollbarWidths;

					View.prototype.updateSize.apply(this, arguments);

					// make all axis cells line up, and record the width so newly created axis cells will have it
					this.axisWidth = matchCellWidths(this.el.find('.fc-axis'));

					// hack to give the view some height prior to timeGrid's columns being rendered
					// TODO: separate setting height from scroller VS timeGrid.
					if (!this.timeGrid.colEls) {
						if (!isAuto) {
							scrollerHeight = this.computeScrollerHeight(totalHeight);
							this.scroller.setHeight(scrollerHeight);
						}
						return;
					}

					// set of fake row elements that must compensate when scroller has scrollbars
					var noScrollRowEls = this.el.find('.fc-row:not(.fc-scroller *)');

					// reset all dimensions back to the original state
					this.timeGrid.bottomRuleEl.hide(); // .show() will be called later if this <hr> is necessary
					this.scroller.clear(); // sets height to 'auto' and clears overflow
					uncompensateScroll(noScrollRowEls);

					// limit number of events in the all-day area
					if (this.dayGrid) {
						this.dayGrid.removeSegPopover(); // kill the "more" popover if displayed

						eventLimit = this.opt('eventLimit');
						if (eventLimit && typeof eventLimit !== 'number') {
							eventLimit = AGENDA_ALL_DAY_EVENT_LIMIT; // make sure "auto" goes to a real number
						}
						if (eventLimit) {
							this.dayGrid.limitRows(eventLimit);
						}
					}

					if (!isAuto) { // should we force dimensions of the scroll container?

						scrollerHeight = this.computeScrollerHeight(totalHeight);
						this.scroller.setHeight(scrollerHeight);
						scrollbarWidths = this.scroller.getScrollbarWidths();

						if (scrollbarWidths.left || scrollbarWidths.right) { // using scrollbars?

							// make the all-day and header rows lines up
							compensateScroll(noScrollRowEls, scrollbarWidths);

							// the scrollbar compensation might have changed text flow, which might affect height, so recalculate
							// and reapply the desired height to the scroller.
							scrollerHeight = this.computeScrollerHeight(totalHeight);
							this.scroller.setHeight(scrollerHeight);
						}

						// guarantees the same scrollbar widths
						this.scroller.lockOverflow(scrollbarWidths);

						// if there's any space below the slats, show the horizontal rule.
						// this won't cause any new overflow, because lockOverflow already called.
						if (this.timeGrid.getTotalSlatHeight() < scrollerHeight) {
							this.timeGrid.bottomRuleEl.show();
						}
					}
				},


				// given a desired total height of the view, returns what the height of the scroller should be
				computeScrollerHeight: function (totalHeight) {
					return totalHeight -
						subtractInnerElHeight(this.el, this.scroller.el); // everything that's NOT the scroller
				},


				/* Scroll
	------------------------------------------------------------------------------------------------------------------*/


				// Computes the initial pre-configured scroll state prior to allowing the user to change it
				computeInitialDateScroll: function () {
					var scrollTime = moment.duration(this.opt('scrollTime'));
					var top = this.timeGrid.computeTimeTop(scrollTime);

					// zoom can give weird floating-point values. rather scroll a little bit further
					top = Math.ceil(top);

					if (top) {
						top++; // to overcome top border that slots beyond the first have. looks better
					}

					return {top: top};
				},


				queryDateScroll: function () {
					return {top: this.scroller.getScrollTop()};
				},


				applyDateScroll: function (scroll) {
					if (scroll.top !== undefined) {
						this.scroller.setScrollTop(scroll.top);
					}
				},


				/* Hit Areas
	------------------------------------------------------------------------------------------------------------------*/
				// forward all hit-related method calls to the grids (dayGrid might not be defined)


				getHitFootprint: function (hit) {
					// TODO: hit.component is set as a hack to identify where the hit came from
					return hit.component.getHitFootprint(hit);
				},


				getHitEl: function (hit) {
					// TODO: hit.component is set as a hack to identify where the hit came from
					return hit.component.getHitEl(hit);
				},


				/* Event Rendering
	------------------------------------------------------------------------------------------------------------------*/


				executeEventRender: function (eventsPayload) {
					var dayEventsPayload = {};
					var timedEventsPayload = {};
					var id, eventInstanceGroup;

					// separate the events into all-day and timed
					for (id in eventsPayload) {
						eventInstanceGroup = eventsPayload[id];

						if (eventInstanceGroup.getEventDef().isAllDay()) {
							dayEventsPayload[id] = eventInstanceGroup;
						}
						else {
							timedEventsPayload[id] = eventInstanceGroup;
						}
					}

					this.timeGrid.executeEventRender(timedEventsPayload);

					if (this.dayGrid) {
						this.dayGrid.executeEventRender(dayEventsPayload);
					}
				},


				/* Dragging/Resizing Routing
	------------------------------------------------------------------------------------------------------------------*/


				// A returned value of `true` signals that a mock "helper" event has been rendered.
				renderDrag: function (eventFootprints, seg, isTouch) {
					var groups = groupEventFootprintsByAllDay(eventFootprints);
					var renderedHelper = false;

					renderedHelper = this.timeGrid.renderDrag(groups.timed, seg, isTouch);

					if (this.dayGrid) {
						renderedHelper = this.dayGrid.renderDrag(groups.allDay, seg, isTouch) || renderedHelper;
					}

					return renderedHelper;
				},


				renderEventResize: function (eventFootprints, seg, isTouch) {
					var groups = groupEventFootprintsByAllDay(eventFootprints);

					this.timeGrid.renderEventResize(groups.timed, seg, isTouch);

					if (this.dayGrid) {
						this.dayGrid.renderEventResize(groups.allDay, seg, isTouch);
					}
				},


				/* Selection
	------------------------------------------------------------------------------------------------------------------*/


				// Renders a visual indication of a selection
				renderSelectionFootprint: function (componentFootprint) {
					if (!componentFootprint.isAllDay) {
						this.timeGrid.renderSelectionFootprint(componentFootprint);
					}
					else if (this.dayGrid) {
						this.dayGrid.renderSelectionFootprint(componentFootprint);
					}
				}

			});


// Methods that will customize the rendering behavior of the AgendaView's timeGrid
// TODO: move into TimeGrid
			var agendaTimeGridMethods = {


				// Generates the HTML that will go before the day-of week header cells
				renderHeadIntroHtml: function () {
					var view = this.view;
					var calendar = view.calendar;
					var weekStart = calendar.msToUtcMoment(this.dateProfile.renderUnzonedRange.startMs, true);
					var weekText;

					if (this.opt('weekNumbers')) {
						weekText = weekStart.format(this.opt('smallWeekFormat'));

						return '' +
							'<th class="fc-axis fc-week-number ' + calendar.theme.getClass('widgetHeader') + '" ' + view.axisStyleAttr() + '>' +
							view.buildGotoAnchorHtml( // aside from link, important for matchCellWidths
								{date: weekStart, type: 'week', forceOff: this.colCnt > 1},
								htmlEscape(weekText) // inner HTML
							) +
							'</th>';
					}
					else {
						return '<th class="fc-axis ' + calendar.theme.getClass('widgetHeader') + '" ' + view.axisStyleAttr() + '></th>';
					}
				},


				// Generates the HTML that goes before the bg of the TimeGrid slot area. Long vertical column.
				renderBgIntroHtml: function () {
					var view = this.view;

					return '<td class="fc-axis ' + view.calendar.theme.getClass('widgetContent') + '" ' + view.axisStyleAttr() + '></td>';
				},


				// Generates the HTML that goes before all other types of cells.
				// Affects content-skeleton, helper-skeleton, highlight-skeleton for both the time-grid and day-grid.
				renderIntroHtml: function () {
					var view = this.view;

					return '<td class="fc-axis" ' + view.axisStyleAttr() + '></td>';
				}

			};


// Methods that will customize the rendering behavior of the AgendaView's dayGrid
			var agendaDayGridMethods = {


				// Generates the HTML that goes before the all-day cells
				renderBgIntroHtml: function () {
					var view = this.view;

					return '' +
						'<td class="fc-axis ' + view.calendar.theme.getClass('widgetContent') + '" ' + view.axisStyleAttr() + '>' +
						'<span>' + // needed for matchCellWidths
						view.getAllDayHtml() +
						'</span>' +
						'</td>';
				},


				// Generates the HTML that goes before all other types of cells.
				// Affects content-skeleton, helper-skeleton, highlight-skeleton for both the time-grid and day-grid.
				renderIntroHtml: function () {
					var view = this.view;

					return '<td class="fc-axis" ' + view.axisStyleAttr() + '></td>';
				}

			};


			function groupEventFootprintsByAllDay(eventFootprints) {
				var allDay = [];
				var timed = [];
				var i;

				for (i = 0; i < eventFootprints.length; i++) {
					if (eventFootprints[i].componentFootprint.isAllDay) {
						allDay.push(eventFootprints[i]);
					}
					else {
						timed.push(eventFootprints[i]);
					}
				}

				return {allDay: allDay, timed: timed};
			}

			;
			;

			var AGENDA_ALL_DAY_EVENT_LIMIT = 5;

// potential nice values for the slot-duration and interval-duration
// from largest to smallest
			var AGENDA_STOCK_SUB_DURATIONS = [
				{hours: 1},
				{minutes: 30},
				{minutes: 15},
				{seconds: 30},
				{seconds: 15}
			];

			fcViews.agenda = {
				'class': AgendaView,
				defaults: {
					allDaySlot: true,
					slotDuration: '00:30:00',
					slotEventOverlap: true // a bad name. confused with overlap/constraint system
				}
			};

			fcViews.agendaDay = {
				type: 'agenda',
				duration: {days: 1}
			};

			fcViews.agendaWeek = {
				type: 'agenda',
				duration: {weeks: 1}
			};
			;
			;

			/*
Responsible for the scroller, and forwarding event-related actions into the "grid".
*/
			var ListView = FC.ListView = View.extend({

				segSelector: '.fc-list-item', // which elements accept event actions
				//eventRendererClass is below
				//eventPointingClass is below

				scroller: null,
				contentEl: null,

				dayDates: null, // localized ambig-time moment array
				dayRanges: null, // UnzonedRange[], of start-end of each day


				constructor: function () {
					View.apply(this, arguments);

					this.scroller = new Scroller({
						overflowX: 'hidden',
						overflowY: 'auto'
					});
				},


				renderSkeleton: function () {
					this.el.addClass(
						'fc-list-view ' +
						this.calendar.theme.getClass('listView')
					);

					this.scroller.render();
					this.scroller.el.appendTo(this.el);

					this.contentEl = this.scroller.scrollEl; // shortcut
				},


				unrenderSkeleton: function () {
					this.scroller.destroy(); // will remove the Grid too
				},


				updateSize: function (totalHeight, isAuto, isResize) {
					this.scroller.setHeight(this.computeScrollerHeight(totalHeight));
				},


				computeScrollerHeight: function (totalHeight) {
					return totalHeight -
						subtractInnerElHeight(this.el, this.scroller.el); // everything that's NOT the scroller
				},


				renderDates: function (dateProfile) {
					var calendar = this.calendar;
					var dayStart = calendar.msToUtcMoment(dateProfile.renderUnzonedRange.startMs, true);
					var viewEnd = calendar.msToUtcMoment(dateProfile.renderUnzonedRange.endMs, true);
					var dayDates = [];
					var dayRanges = [];

					while (dayStart < viewEnd) {

						dayDates.push(dayStart.clone());

						dayRanges.push(new UnzonedRange(
							dayStart,
							dayStart.clone().add(1, 'day')
						));

						dayStart.add(1, 'day');
					}

					this.dayDates = dayDates;
					this.dayRanges = dayRanges;

					// all real rendering happens in EventRenderer
				},


				// slices by day
				componentFootprintToSegs: function (footprint) {
					var dayRanges = this.dayRanges;
					var dayIndex;
					var segRange;
					var seg;
					var segs = [];

					for (dayIndex = 0; dayIndex < dayRanges.length; dayIndex++) {
						segRange = footprint.unzonedRange.intersect(dayRanges[dayIndex]);

						if (segRange) {
							seg = {
								startMs: segRange.startMs,
								endMs: segRange.endMs,
								isStart: segRange.isStart,
								isEnd: segRange.isEnd,
								dayIndex: dayIndex
							};

							segs.push(seg);

							// detect when footprint won't go fully into the next day,
							// and mutate the latest seg to the be the end.
							if (
								!seg.isEnd && !footprint.isAllDay &&
								dayIndex + 1 < dayRanges.length &&
								footprint.unzonedRange.endMs < dayRanges[dayIndex + 1].startMs + this.nextDayThreshold
							) {
								seg.endMs = footprint.unzonedRange.endMs;
								seg.isEnd = true;
								break;
							}
						}
					}

					return segs;
				},


				eventRendererClass: EventRenderer.extend({


					renderFgSegs: function (segs) {
						if (!segs.length) {
							this.component.renderEmptyMessage();
						}
						else {
							this.component.renderSegList(segs);
						}
					},


					// generates the HTML for a single event row
					fgSegHtml: function (seg) {
						var view = this.view;
						var calendar = view.calendar;
						var theme = calendar.theme;
						var eventFootprint = seg.footprint;
						var eventDef = eventFootprint.eventDef;
						var componentFootprint = eventFootprint.componentFootprint;
						var url = eventDef.url;
						var classes = ['fc-list-item'].concat(this.getClasses(eventDef));
						var bgColor = this.getBgColor(eventDef);
						var timeHtml;

						if (componentFootprint.isAllDay) {
							timeHtml = view.getAllDayHtml();
						}
						// if the event appears to span more than one day
						else if (view.isMultiDayRange(componentFootprint.unzonedRange)) {
							if (seg.isStart || seg.isEnd) { // outer segment that probably lasts part of the day
								timeHtml = htmlEscape(this._getTimeText(
									calendar.msToMoment(seg.startMs),
									calendar.msToMoment(seg.endMs),
									componentFootprint.isAllDay
								));
							}
							else { // inner segment that lasts the whole day
								timeHtml = view.getAllDayHtml();
							}
						}
						else {
							// Display the normal time text for the *event's* times
							timeHtml = htmlEscape(this.getTimeText(eventFootprint));
						}

						if (url) {
							classes.push('fc-has-url');
						}

						return '<tr class="' + classes.join(' ') + '">' +
							(this.displayEventTime ?
								'<td class="fc-list-item-time ' + theme.getClass('widgetContent') + '">' +
								(timeHtml || '') +
								'</td>' :
								'') +
							'<td class="fc-list-item-marker ' + theme.getClass('widgetContent') + '">' +
							'<span class="fc-event-dot"' +
							(bgColor ?
								' style="background-color:' + bgColor + '"' :
								'') +
							'></span>' +
							'</td>' +
							'<td class="fc-list-item-title ' + theme.getClass('widgetContent') + '">' +
							'<a' + (url ? ' href="' + htmlEscape(url) + '"' : '') + '>' +
							htmlEscape(eventDef.title || '') +
							'</a>' +
							'</td>' +
							'</tr>';
					},


					// like "4:00am"
					computeEventTimeFormat: function () {
						return this.opt('mediumTimeFormat');
					}

				}),


				eventPointingClass: EventPointing.extend({

					// for events with a url, the whole <tr> should be clickable,
					// but it's impossible to wrap with an <a> tag. simulate this.
					handleClick: function (seg, ev) {
						var url;

						EventPointing.prototype.handleClick.apply(this, arguments); // super. might prevent the default action

						// not clicking on or within an <a> with an href
						if (!$(ev.target).closest('a[href]').length) {
							url = seg.footprint.eventDef.url;

							if (url && !ev.isDefaultPrevented()) { // jsEvent not cancelled in handler
								window.location.href = url; // simulate link click
							}
						}
					}

				}),


				renderEmptyMessage: function () {
					this.contentEl.html(
						'<div class="fc-list-empty-wrap2">' + // TODO: try less wraps
						'<div class="fc-list-empty-wrap1">' +
						'<div class="fc-list-empty">' +
						htmlEscape(this.opt('noEventsMessage')) +
						'</div>' +
						'</div>' +
						'</div>'
					);
				},


				// render the event segments in the view
				renderSegList: function (allSegs) {
					var segsByDay = this.groupSegsByDay(allSegs); // sparse array
					var dayIndex;
					var daySegs;
					var i;
					var tableEl = $('<table class="fc-list-table ' + this.calendar.theme.getClass('tableList') + '"><tbody/></table>');
					var tbodyEl = tableEl.find('tbody');

					for (dayIndex = 0; dayIndex < segsByDay.length; dayIndex++) {
						daySegs = segsByDay[dayIndex];

						if (daySegs) { // sparse array, so might be undefined

							// append a day header
							tbodyEl.append(this.dayHeaderHtml(this.dayDates[dayIndex]));

							this.eventRenderer.sortEventSegs(daySegs);

							for (i = 0; i < daySegs.length; i++) {
								tbodyEl.append(daySegs[i].el); // append event row
							}
						}
					}

					this.contentEl.empty().append(tableEl);
				},


				// Returns a sparse array of arrays, segs grouped by their dayIndex
				groupSegsByDay: function (segs) {
					var segsByDay = []; // sparse array
					var i, seg;

					for (i = 0; i < segs.length; i++) {
						seg = segs[i];
						(segsByDay[seg.dayIndex] || (segsByDay[seg.dayIndex] = []))
							.push(seg);
					}

					return segsByDay;
				},


				// generates the HTML for the day headers that live amongst the event rows
				dayHeaderHtml: function (dayDate) {
					var mainFormat = this.opt('listDayFormat');
					var altFormat = this.opt('listDayAltFormat');

					return '<tr class="fc-list-heading" data-date="' + dayDate.format('YYYY-MM-DD') + '">' +
						'<td class="' + this.calendar.theme.getClass('widgetHeader') + '" colspan="3">' +
						(mainFormat ?
							this.buildGotoAnchorHtml(
								dayDate,
								{'class': 'fc-list-heading-main'},
								htmlEscape(dayDate.format(mainFormat)) // inner HTML
							) :
							'') +
						(altFormat ?
							this.buildGotoAnchorHtml(
								dayDate,
								{'class': 'fc-list-heading-alt'},
								htmlEscape(dayDate.format(altFormat)) // inner HTML
							) :
							'') +
						'</td>' +
						'</tr>';
				}

			});

			;
			;

			fcViews.list = {
				'class': ListView,
				buttonTextKey: 'list', // what to lookup in locale files
				defaults: {
					buttonText: 'list', // text to display for English
					listDayFormat: 'LL', // like "January 1, 2016"
					noEventsMessage: 'No events to display'
				}
			};

			fcViews.listDay = {
				type: 'list',
				duration: {days: 1},
				defaults: {
					listDayFormat: 'dddd' // day-of-week is all we need. full date is probably in header
				}
			};

			fcViews.listWeek = {
				type: 'list',
				duration: {weeks: 1},
				defaults: {
					listDayFormat: 'dddd', // day-of-week is more important
					listDayAltFormat: 'LL'
				}
			};

			fcViews.listMonth = {
				type: 'list',
				duration: {month: 1},
				defaults: {
					listDayAltFormat: 'dddd' // day-of-week is nice-to-have
				}
			};

			fcViews.listYear = {
				type: 'list',
				duration: {year: 1},
				defaults: {
					listDayAltFormat: 'dddd' // day-of-week is nice-to-have
				}
			};

			;
			;

			return FC; // export for Node/CommonJS
		});

		/***/
	}),
	/* 127 */
	/***/ (function (module, exports) {

// removed by extract-text-webpack-plugin

		/***/
	})
], [123]);