(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
/* global HTMLElement */

'use strict'

module.exports = function emptyElement (element) {
  if (!(element instanceof HTMLElement)) {
    throw new TypeError('Expected an element')
  }

  var node
  while ((node = element.lastChild)) element.removeChild(node)
  return element
}

},{}],4:[function(require,module,exports){
/* jshint node:true */

'use strict';

var IntlMessageFormat = require('./lib/main')['default'];

// Add all locale data to `IntlMessageFormat`. This module will be ignored when
// bundling for the browser with Browserify/Webpack.
require('./lib/locales');

// Re-export `IntlMessageFormat` as the CommonJS default exports with all the
// locale data registered, and with English set as the default locale. Define
// the `default` prop for use with other compiled ES6 Modules.
exports = module.exports = IntlMessageFormat;
exports['default'] = exports;

},{"./lib/locales":1,"./lib/main":9}],5:[function(require,module,exports){
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

"use strict";
exports["default"] = Compiler;

function Compiler(locales, formats, pluralFn) {
    this.locales  = locales;
    this.formats  = formats;
    this.pluralFn = pluralFn;
}

Compiler.prototype.compile = function (ast) {
    this.pluralStack        = [];
    this.currentPlural      = null;
    this.pluralNumberFormat = null;

    return this.compileMessage(ast);
};

Compiler.prototype.compileMessage = function (ast) {
    if (!(ast && ast.type === 'messageFormatPattern')) {
        throw new Error('Message AST is not of type: "messageFormatPattern"');
    }

    var elements = ast.elements,
        pattern  = [];

    var i, len, element;

    for (i = 0, len = elements.length; i < len; i += 1) {
        element = elements[i];

        switch (element.type) {
            case 'messageTextElement':
                pattern.push(this.compileMessageText(element));
                break;

            case 'argumentElement':
                pattern.push(this.compileArgument(element));
                break;

            default:
                throw new Error('Message element does not have a valid type');
        }
    }

    return pattern;
};

Compiler.prototype.compileMessageText = function (element) {
    // When this `element` is part of plural sub-pattern and its value contains
    // an unescaped '#', use a `PluralOffsetString` helper to properly output
    // the number with the correct offset in the string.
    if (this.currentPlural && /(^|[^\\])#/g.test(element.value)) {
        // Create a cache a NumberFormat instance that can be reused for any
        // PluralOffsetString instance in this message.
        if (!this.pluralNumberFormat) {
            this.pluralNumberFormat = new Intl.NumberFormat(this.locales);
        }

        return new PluralOffsetString(
                this.currentPlural.id,
                this.currentPlural.format.offset,
                this.pluralNumberFormat,
                element.value);
    }

    // Unescape the escaped '#'s in the message text.
    return element.value.replace(/\\#/g, '#');
};

Compiler.prototype.compileArgument = function (element) {
    var format = element.format;

    if (!format) {
        return new StringFormat(element.id);
    }

    var formats  = this.formats,
        locales  = this.locales,
        pluralFn = this.pluralFn,
        options;

    switch (format.type) {
        case 'numberFormat':
            options = formats.number[format.style];
            return {
                id    : element.id,
                format: new Intl.NumberFormat(locales, options).format
            };

        case 'dateFormat':
            options = formats.date[format.style];
            return {
                id    : element.id,
                format: new Intl.DateTimeFormat(locales, options).format
            };

        case 'timeFormat':
            options = formats.time[format.style];
            return {
                id    : element.id,
                format: new Intl.DateTimeFormat(locales, options).format
            };

        case 'pluralFormat':
            options = this.compileOptions(element);
            return new PluralFormat(
                element.id, format.ordinal, format.offset, options, pluralFn
            );

        case 'selectFormat':
            options = this.compileOptions(element);
            return new SelectFormat(element.id, options);

        default:
            throw new Error('Message element does not have a valid format type');
    }
};

Compiler.prototype.compileOptions = function (element) {
    var format      = element.format,
        options     = format.options,
        optionsHash = {};

    // Save the current plural element, if any, then set it to a new value when
    // compiling the options sub-patterns. This conforms the spec's algorithm
    // for handling `"#"` syntax in message text.
    this.pluralStack.push(this.currentPlural);
    this.currentPlural = format.type === 'pluralFormat' ? element : null;

    var i, len, option;

    for (i = 0, len = options.length; i < len; i += 1) {
        option = options[i];

        // Compile the sub-pattern and save it under the options's selector.
        optionsHash[option.selector] = this.compileMessage(option.value);
    }

    // Pop the plural stack to put back the original current plural value.
    this.currentPlural = this.pluralStack.pop();

    return optionsHash;
};

// -- Compiler Helper Classes --------------------------------------------------

function StringFormat(id) {
    this.id = id;
}

StringFormat.prototype.format = function (value) {
    if (!value) {
        return '';
    }

    return typeof value === 'string' ? value : String(value);
};

function PluralFormat(id, useOrdinal, offset, options, pluralFn) {
    this.id         = id;
    this.useOrdinal = useOrdinal;
    this.offset     = offset;
    this.options    = options;
    this.pluralFn   = pluralFn;
}

PluralFormat.prototype.getOption = function (value) {
    var options = this.options;

    var option = options['=' + value] ||
            options[this.pluralFn(value - this.offset, this.useOrdinal)];

    return option || options.other;
};

function PluralOffsetString(id, offset, numberFormat, string) {
    this.id           = id;
    this.offset       = offset;
    this.numberFormat = numberFormat;
    this.string       = string;
}

PluralOffsetString.prototype.format = function (value) {
    var number = this.numberFormat.format(value - this.offset);

    return this.string
            .replace(/(^|[^\\])#/g, '$1' + number)
            .replace(/\\#/g, '#');
};

function SelectFormat(id, options) {
    this.id      = id;
    this.options = options;
}

SelectFormat.prototype.getOption = function (value) {
    var options = this.options;
    return options[value] || options.other;
};


},{}],6:[function(require,module,exports){
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

"use strict";
var src$utils$$ = require("./utils"), src$es5$$ = require("./es5"), src$compiler$$ = require("./compiler"), intl$messageformat$parser$$ = require("intl-messageformat-parser");
exports["default"] = MessageFormat;

// -- MessageFormat --------------------------------------------------------

function MessageFormat(message, locales, formats) {
    // Parse string messages into an AST.
    var ast = typeof message === 'string' ?
            MessageFormat.__parse(message) : message;

    if (!(ast && ast.type === 'messageFormatPattern')) {
        throw new TypeError('A message must be provided as a String or AST.');
    }

    // Creates a new object with the specified `formats` merged with the default
    // formats.
    formats = this._mergeFormats(MessageFormat.formats, formats);

    // Defined first because it's used to build the format pattern.
    src$es5$$.defineProperty(this, '_locale',  {value: this._resolveLocale(locales)});

    // Compile the `ast` to a pattern that is highly optimized for repeated
    // `format()` invocations. **Note:** This passes the `locales` set provided
    // to the constructor instead of just the resolved locale.
    var pluralFn = this._findPluralRuleFunction(this._locale);
    var pattern  = this._compilePattern(ast, locales, formats, pluralFn);

    // "Bind" `format()` method to `this` so it can be passed by reference like
    // the other `Intl` APIs.
    var messageFormat = this;
    this.format = function (values) {
        return messageFormat._format(pattern, values);
    };
}

// Default format options used as the prototype of the `formats` provided to the
// constructor. These are used when constructing the internal Intl.NumberFormat
// and Intl.DateTimeFormat instances.
src$es5$$.defineProperty(MessageFormat, 'formats', {
    enumerable: true,

    value: {
        number: {
            'currency': {
                style: 'currency'
            },

            'percent': {
                style: 'percent'
            }
        },

        date: {
            'short': {
                month: 'numeric',
                day  : 'numeric',
                year : '2-digit'
            },

            'medium': {
                month: 'short',
                day  : 'numeric',
                year : 'numeric'
            },

            'long': {
                month: 'long',
                day  : 'numeric',
                year : 'numeric'
            },

            'full': {
                weekday: 'long',
                month  : 'long',
                day    : 'numeric',
                year   : 'numeric'
            }
        },

        time: {
            'short': {
                hour  : 'numeric',
                minute: 'numeric'
            },

            'medium':  {
                hour  : 'numeric',
                minute: 'numeric',
                second: 'numeric'
            },

            'long': {
                hour        : 'numeric',
                minute      : 'numeric',
                second      : 'numeric',
                timeZoneName: 'short'
            },

            'full': {
                hour        : 'numeric',
                minute      : 'numeric',
                second      : 'numeric',
                timeZoneName: 'short'
            }
        }
    }
});

// Define internal private properties for dealing with locale data.
src$es5$$.defineProperty(MessageFormat, '__localeData__', {value: src$es5$$.objCreate(null)});
src$es5$$.defineProperty(MessageFormat, '__addLocaleData', {value: function (data) {
    if (!(data && data.locale)) {
        throw new Error(
            'Locale data provided to IntlMessageFormat is missing a ' +
            '`locale` property'
        );
    }

    MessageFormat.__localeData__[data.locale.toLowerCase()] = data;
}});

// Defines `__parse()` static method as an exposed private.
src$es5$$.defineProperty(MessageFormat, '__parse', {value: intl$messageformat$parser$$["default"].parse});

// Define public `defaultLocale` property which defaults to English, but can be
// set by the developer.
src$es5$$.defineProperty(MessageFormat, 'defaultLocale', {
    enumerable: true,
    writable  : true,
    value     : undefined
});

MessageFormat.prototype.resolvedOptions = function () {
    // TODO: Provide anything else?
    return {
        locale: this._locale
    };
};

MessageFormat.prototype._compilePattern = function (ast, locales, formats, pluralFn) {
    var compiler = new src$compiler$$["default"](locales, formats, pluralFn);
    return compiler.compile(ast);
};

MessageFormat.prototype._findPluralRuleFunction = function (locale) {
    var localeData = MessageFormat.__localeData__;
    var data       = localeData[locale.toLowerCase()];

    // The locale data is de-duplicated, so we have to traverse the locale's
    // hierarchy until we find a `pluralRuleFunction` to return.
    while (data) {
        if (data.pluralRuleFunction) {
            return data.pluralRuleFunction;
        }

        data = data.parentLocale && localeData[data.parentLocale.toLowerCase()];
    }

    throw new Error(
        'Locale data added to IntlMessageFormat is missing a ' +
        '`pluralRuleFunction` for :' + locale
    );
};

MessageFormat.prototype._format = function (pattern, values) {
    var result = '',
        i, len, part, id, value;

    for (i = 0, len = pattern.length; i < len; i += 1) {
        part = pattern[i];

        // Exist early for string parts.
        if (typeof part === 'string') {
            result += part;
            continue;
        }

        id = part.id;

        // Enforce that all required values are provided by the caller.
        if (!(values && src$utils$$.hop.call(values, id))) {
            throw new Error('A value must be provided for: ' + id);
        }

        value = values[id];

        // Recursively format plural and select parts' option — which can be a
        // nested pattern structure. The choosing of the option to use is
        // abstracted-by and delegated-to the part helper object.
        if (part.options) {
            result += this._format(part.getOption(value), values);
        } else {
            result += part.format(value);
        }
    }

    return result;
};

MessageFormat.prototype._mergeFormats = function (defaults, formats) {
    var mergedFormats = {},
        type, mergedType;

    for (type in defaults) {
        if (!src$utils$$.hop.call(defaults, type)) { continue; }

        mergedFormats[type] = mergedType = src$es5$$.objCreate(defaults[type]);

        if (formats && src$utils$$.hop.call(formats, type)) {
            src$utils$$.extend(mergedType, formats[type]);
        }
    }

    return mergedFormats;
};

MessageFormat.prototype._resolveLocale = function (locales) {
    if (typeof locales === 'string') {
        locales = [locales];
    }

    // Create a copy of the array so we can push on the default locale.
    locales = (locales || []).concat(MessageFormat.defaultLocale);

    var localeData = MessageFormat.__localeData__;
    var i, len, localeParts, data;

    // Using the set of locales + the default locale, we look for the first one
    // which that has been registered. When data does not exist for a locale, we
    // traverse its ancestors to find something that's been registered within
    // its hierarchy of locales. Since we lack the proper `parentLocale` data
    // here, we must take a naive approach to traversal.
    for (i = 0, len = locales.length; i < len; i += 1) {
        localeParts = locales[i].toLowerCase().split('-');

        while (localeParts.length) {
            data = localeData[localeParts.join('-')];
            if (data) {
                // Return the normalized locale string; e.g., we return "en-US",
                // instead of "en-us".
                return data.locale;
            }

            localeParts.pop();
        }
    }

    var defaultLocale = locales.pop();
    throw new Error(
        'No locale data has been added to IntlMessageFormat for: ' +
        locales.join(', ') + ', or the default locale: ' + defaultLocale
    );
};


},{"./compiler":5,"./es5":8,"./utils":10,"intl-messageformat-parser":11}],7:[function(require,module,exports){
// GENERATED FILE
"use strict";
exports["default"] = {"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"}};


},{}],8:[function(require,module,exports){
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

"use strict";
var src$utils$$ = require("./utils");

// Purposely using the same implementation as the Intl.js `Intl` polyfill.
// Copyright 2013 Andy Earnshaw, MIT License

var realDefineProp = (function () {
    try { return !!Object.defineProperty({}, 'a', {}); }
    catch (e) { return false; }
})();

var es3 = !realDefineProp && !Object.prototype.__defineGetter__;

var defineProperty = realDefineProp ? Object.defineProperty :
        function (obj, name, desc) {

    if ('get' in desc && obj.__defineGetter__) {
        obj.__defineGetter__(name, desc.get);
    } else if (!src$utils$$.hop.call(obj, name) || 'value' in desc) {
        obj[name] = desc.value;
    }
};

var objCreate = Object.create || function (proto, props) {
    var obj, k;

    function F() {}
    F.prototype = proto;
    obj = new F();

    for (k in props) {
        if (src$utils$$.hop.call(props, k)) {
            defineProperty(obj, k, props[k]);
        }
    }

    return obj;
};
exports.defineProperty = defineProperty, exports.objCreate = objCreate;


},{"./utils":10}],9:[function(require,module,exports){
/* jslint esnext: true */

"use strict";
var src$core$$ = require("./core"), src$en$$ = require("./en");

src$core$$["default"].__addLocaleData(src$en$$["default"]);
src$core$$["default"].defaultLocale = 'en';

exports["default"] = src$core$$["default"];


},{"./core":6,"./en":7}],10:[function(require,module,exports){
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

"use strict";
exports.extend = extend;
var hop = Object.prototype.hasOwnProperty;

function extend(obj) {
    var sources = Array.prototype.slice.call(arguments, 1),
        i, len, source, key;

    for (i = 0, len = sources.length; i < len; i += 1) {
        source = sources[i];
        if (!source) { continue; }

        for (key in source) {
            if (hop.call(source, key)) {
                obj[key] = source[key];
            }
        }
    }

    return obj;
}
exports.hop = hop;


},{}],11:[function(require,module,exports){
'use strict';

exports = module.exports = require('./lib/parser')['default'];
exports['default'] = exports;

},{"./lib/parser":12}],12:[function(require,module,exports){
"use strict";

exports["default"] = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = [],
        peg$c1 = function(elements) {
                return {
                    type    : 'messageFormatPattern',
                    elements: elements
                };
            },
        peg$c2 = peg$FAILED,
        peg$c3 = function(text) {
                var string = '',
                    i, j, outerLen, inner, innerLen;

                for (i = 0, outerLen = text.length; i < outerLen; i += 1) {
                    inner = text[i];

                    for (j = 0, innerLen = inner.length; j < innerLen; j += 1) {
                        string += inner[j];
                    }
                }

                return string;
            },
        peg$c4 = function(messageText) {
                return {
                    type : 'messageTextElement',
                    value: messageText
                };
            },
        peg$c5 = /^[^ \t\n\r,.+={}#]/,
        peg$c6 = { type: "class", value: "[^ \\t\\n\\r,.+={}#]", description: "[^ \\t\\n\\r,.+={}#]" },
        peg$c7 = "{",
        peg$c8 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c9 = null,
        peg$c10 = ",",
        peg$c11 = { type: "literal", value: ",", description: "\",\"" },
        peg$c12 = "}",
        peg$c13 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c14 = function(id, format) {
                return {
                    type  : 'argumentElement',
                    id    : id,
                    format: format && format[2]
                };
            },
        peg$c15 = "number",
        peg$c16 = { type: "literal", value: "number", description: "\"number\"" },
        peg$c17 = "date",
        peg$c18 = { type: "literal", value: "date", description: "\"date\"" },
        peg$c19 = "time",
        peg$c20 = { type: "literal", value: "time", description: "\"time\"" },
        peg$c21 = function(type, style) {
                return {
                    type : type + 'Format',
                    style: style && style[2]
                };
            },
        peg$c22 = "plural",
        peg$c23 = { type: "literal", value: "plural", description: "\"plural\"" },
        peg$c24 = function(pluralStyle) {
                return {
                    type   : pluralStyle.type,
                    ordinal: false,
                    offset : pluralStyle.offset || 0,
                    options: pluralStyle.options
                };
            },
        peg$c25 = "selectordinal",
        peg$c26 = { type: "literal", value: "selectordinal", description: "\"selectordinal\"" },
        peg$c27 = function(pluralStyle) {
                return {
                    type   : pluralStyle.type,
                    ordinal: true,
                    offset : pluralStyle.offset || 0,
                    options: pluralStyle.options
                }
            },
        peg$c28 = "select",
        peg$c29 = { type: "literal", value: "select", description: "\"select\"" },
        peg$c30 = function(options) {
                return {
                    type   : 'selectFormat',
                    options: options
                };
            },
        peg$c31 = "=",
        peg$c32 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c33 = function(selector, pattern) {
                return {
                    type    : 'optionalFormatPattern',
                    selector: selector,
                    value   : pattern
                };
            },
        peg$c34 = "offset:",
        peg$c35 = { type: "literal", value: "offset:", description: "\"offset:\"" },
        peg$c36 = function(number) {
                return number;
            },
        peg$c37 = function(offset, options) {
                return {
                    type   : 'pluralFormat',
                    offset : offset,
                    options: options
                };
            },
        peg$c38 = { type: "other", description: "whitespace" },
        peg$c39 = /^[ \t\n\r]/,
        peg$c40 = { type: "class", value: "[ \\t\\n\\r]", description: "[ \\t\\n\\r]" },
        peg$c41 = { type: "other", description: "optionalWhitespace" },
        peg$c42 = /^[0-9]/,
        peg$c43 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c44 = /^[0-9a-f]/i,
        peg$c45 = { type: "class", value: "[0-9a-f]i", description: "[0-9a-f]i" },
        peg$c46 = "0",
        peg$c47 = { type: "literal", value: "0", description: "\"0\"" },
        peg$c48 = /^[1-9]/,
        peg$c49 = { type: "class", value: "[1-9]", description: "[1-9]" },
        peg$c50 = function(digits) {
            return parseInt(digits, 10);
        },
        peg$c51 = /^[^{}\\\0-\x1F \t\n\r]/,
        peg$c52 = { type: "class", value: "[^{}\\\\\\0-\\x1F \\t\\n\\r]", description: "[^{}\\\\\\0-\\x1F \\t\\n\\r]" },
        peg$c53 = "\\\\",
        peg$c54 = { type: "literal", value: "\\\\", description: "\"\\\\\\\\\"" },
        peg$c55 = function() { return '\\'; },
        peg$c56 = "\\#",
        peg$c57 = { type: "literal", value: "\\#", description: "\"\\\\#\"" },
        peg$c58 = function() { return '\\#'; },
        peg$c59 = "\\{",
        peg$c60 = { type: "literal", value: "\\{", description: "\"\\\\{\"" },
        peg$c61 = function() { return '\u007B'; },
        peg$c62 = "\\}",
        peg$c63 = { type: "literal", value: "\\}", description: "\"\\\\}\"" },
        peg$c64 = function() { return '\u007D'; },
        peg$c65 = "\\u",
        peg$c66 = { type: "literal", value: "\\u", description: "\"\\\\u\"" },
        peg$c67 = function(digits) {
                return String.fromCharCode(parseInt(digits, 16));
            },
        peg$c68 = function(chars) { return chars.join(''); },

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$parsestart() {
      var s0;

      s0 = peg$parsemessageFormatPattern();

      return s0;
    }

    function peg$parsemessageFormatPattern() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsemessageFormatElement();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsemessageFormatElement();
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c1(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsemessageFormatElement() {
      var s0;

      s0 = peg$parsemessageTextElement();
      if (s0 === peg$FAILED) {
        s0 = peg$parseargumentElement();
      }

      return s0;
    }

    function peg$parsemessageText() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      s3 = peg$parse_();
      if (s3 !== peg$FAILED) {
        s4 = peg$parsechars();
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s3 = [s3, s4, s5];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c2;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$c2;
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$currPos;
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsechars();
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s3 = [s3, s4, s5];
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$c2;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$c2;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c3(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsews();
        if (s1 !== peg$FAILED) {
          s1 = input.substring(s0, peg$currPos);
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parsemessageTextElement() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parsemessageText();
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c4(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseargument() {
      var s0, s1, s2;

      s0 = peg$parsenumber();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        if (peg$c5.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c6); }
        }
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            if (peg$c5.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c6); }
            }
          }
        } else {
          s1 = peg$c2;
        }
        if (s1 !== peg$FAILED) {
          s1 = input.substring(s0, peg$currPos);
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseargumentElement() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 123) {
        s1 = peg$c7;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c8); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseargument();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 44) {
                s6 = peg$c10;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c11); }
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parse_();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseelementFormat();
                  if (s8 !== peg$FAILED) {
                    s6 = [s6, s7, s8];
                    s5 = s6;
                  } else {
                    peg$currPos = s5;
                    s5 = peg$c2;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$c2;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$c2;
              }
              if (s5 === peg$FAILED) {
                s5 = peg$c9;
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 125) {
                    s7 = peg$c12;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c13); }
                  }
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c14(s3, s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseelementFormat() {
      var s0;

      s0 = peg$parsesimpleFormat();
      if (s0 === peg$FAILED) {
        s0 = peg$parsepluralFormat();
        if (s0 === peg$FAILED) {
          s0 = peg$parseselectOrdinalFormat();
          if (s0 === peg$FAILED) {
            s0 = peg$parseselectFormat();
          }
        }
      }

      return s0;
    }

    function peg$parsesimpleFormat() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c15) {
        s1 = peg$c15;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c16); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c17) {
          s1 = peg$c17;
          peg$currPos += 4;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c18); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 4) === peg$c19) {
            s1 = peg$c19;
            peg$currPos += 4;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c20); }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 44) {
            s4 = peg$c10;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c11); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsechars();
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c2;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c2;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c2;
          }
          if (s3 === peg$FAILED) {
            s3 = peg$c9;
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c21(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsepluralFormat() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c22) {
        s1 = peg$c22;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c23); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c10;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c11); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsepluralStyle();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c24(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseselectOrdinalFormat() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 13) === peg$c25) {
        s1 = peg$c25;
        peg$currPos += 13;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c26); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c10;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c11); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsepluralStyle();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c27(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseselectFormat() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c28) {
        s1 = peg$c28;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c29); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c10;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c11); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parseoptionalFormatPattern();
              if (s6 !== peg$FAILED) {
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parseoptionalFormatPattern();
                }
              } else {
                s5 = peg$c2;
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c30(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseselector() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 61) {
        s2 = peg$c31;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c32); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsenumber();
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$c2;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        s1 = input.substring(s0, peg$currPos);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$parsechars();
      }

      return s0;
    }

    function peg$parseoptionalFormatPattern() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseselector();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 123) {
              s4 = peg$c7;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c8); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsemessageFormatPattern();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 125) {
                      s8 = peg$c12;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c13); }
                    }
                    if (s8 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c33(s2, s6);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseoffset() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 7) === peg$c34) {
        s1 = peg$c34;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c35); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsenumber();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c36(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsepluralStyle() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseoffset();
      if (s1 === peg$FAILED) {
        s1 = peg$c9;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseoptionalFormatPattern();
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseoptionalFormatPattern();
            }
          } else {
            s3 = peg$c2;
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c37(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsews() {
      var s0, s1;

      peg$silentFails++;
      s0 = [];
      if (peg$c39.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c40); }
      }
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          if (peg$c39.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c40); }
          }
        }
      } else {
        s0 = peg$c2;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c38); }
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1, s2;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsews();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsews();
      }
      if (s1 !== peg$FAILED) {
        s1 = input.substring(s0, peg$currPos);
      }
      s0 = s1;
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c41); }
      }

      return s0;
    }

    function peg$parsedigit() {
      var s0;

      if (peg$c42.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c43); }
      }

      return s0;
    }

    function peg$parsehexDigit() {
      var s0;

      if (peg$c44.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c45); }
      }

      return s0;
    }

    function peg$parsenumber() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 48) {
        s1 = peg$c46;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c47); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$currPos;
        s2 = peg$currPos;
        if (peg$c48.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c49); }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parsedigit();
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parsedigit();
          }
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c2;
        }
        if (s2 !== peg$FAILED) {
          s2 = input.substring(s1, peg$currPos);
        }
        s1 = s2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c50(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsechar() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      if (peg$c51.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c52); }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c53) {
          s1 = peg$c53;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c54); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c55();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c56) {
            s1 = peg$c56;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c57); }
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c58();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c59) {
              s1 = peg$c59;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c60); }
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c61();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 2) === peg$c62) {
                s1 = peg$c62;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c63); }
              }
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c64();
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c65) {
                  s1 = peg$c65;
                  peg$currPos += 2;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c66); }
                }
                if (s1 !== peg$FAILED) {
                  s2 = peg$currPos;
                  s3 = peg$currPos;
                  s4 = peg$parsehexDigit();
                  if (s4 !== peg$FAILED) {
                    s5 = peg$parsehexDigit();
                    if (s5 !== peg$FAILED) {
                      s6 = peg$parsehexDigit();
                      if (s6 !== peg$FAILED) {
                        s7 = peg$parsehexDigit();
                        if (s7 !== peg$FAILED) {
                          s4 = [s4, s5, s6, s7];
                          s3 = s4;
                        } else {
                          peg$currPos = s3;
                          s3 = peg$c2;
                        }
                      } else {
                        peg$currPos = s3;
                        s3 = peg$c2;
                      }
                    } else {
                      peg$currPos = s3;
                      s3 = peg$c2;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$c2;
                  }
                  if (s3 !== peg$FAILED) {
                    s3 = input.substring(s2, peg$currPos);
                  }
                  s2 = s3;
                  if (s2 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c67(s2);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsechars() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsechar();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsechar();
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c68(s1);
      }
      s0 = s1;

      return s0;
    }

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();


},{}],13:[function(require,module,exports){
IntlRelativeFormat.__addLocaleData({"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"one":"in {0} year","other":"in {0} years"},"past":{"one":"{0} year ago","other":"{0} years ago"}}},"month":{"displayName":"month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"one":"in {0} month","other":"in {0} months"},"past":{"one":"{0} month ago","other":"{0} months ago"}}},"day":{"displayName":"day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"one":"in {0} day","other":"in {0} days"},"past":{"one":"{0} day ago","other":"{0} days ago"}}},"hour":{"displayName":"hour","relativeTime":{"future":{"one":"in {0} hour","other":"in {0} hours"},"past":{"one":"{0} hour ago","other":"{0} hours ago"}}},"minute":{"displayName":"minute","relativeTime":{"future":{"one":"in {0} minute","other":"in {0} minutes"},"past":{"one":"{0} minute ago","other":"{0} minutes ago"}}},"second":{"displayName":"second","relative":{"0":"now"},"relativeTime":{"future":{"one":"in {0} second","other":"in {0} seconds"},"past":{"one":"{0} second ago","other":"{0} seconds ago"}}}}});
IntlRelativeFormat.__addLocaleData({"locale":"en-001","parentLocale":"en"});
IntlRelativeFormat.__addLocaleData({"locale":"en-150","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-AG","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-AI","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-AS","parentLocale":"en"});
IntlRelativeFormat.__addLocaleData({"locale":"en-AT","parentLocale":"en-150"});
IntlRelativeFormat.__addLocaleData({"locale":"en-AU","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-BB","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-BE","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-BI","parentLocale":"en"});
IntlRelativeFormat.__addLocaleData({"locale":"en-BM","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-BS","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-BW","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-BZ","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-CA","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-CC","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-CH","parentLocale":"en-150"});
IntlRelativeFormat.__addLocaleData({"locale":"en-CK","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-CM","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-CX","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-CY","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-DE","parentLocale":"en-150"});
IntlRelativeFormat.__addLocaleData({"locale":"en-DG","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-DK","parentLocale":"en-150"});
IntlRelativeFormat.__addLocaleData({"locale":"en-DM","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-Dsrt","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
IntlRelativeFormat.__addLocaleData({"locale":"en-ER","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-FI","parentLocale":"en-150"});
IntlRelativeFormat.__addLocaleData({"locale":"en-FJ","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-FK","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-FM","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-GB","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-GD","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-GG","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-GH","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-GI","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-GM","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-GU","parentLocale":"en"});
IntlRelativeFormat.__addLocaleData({"locale":"en-GY","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-HK","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-IE","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-IL","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-IM","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-IN","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-IO","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-JE","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-JM","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-KE","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-KI","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-KN","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-KY","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-LC","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-LR","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-LS","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-MG","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-MH","parentLocale":"en"});
IntlRelativeFormat.__addLocaleData({"locale":"en-MO","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-MP","parentLocale":"en"});
IntlRelativeFormat.__addLocaleData({"locale":"en-MS","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-MT","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-MU","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-MW","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-MY","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-NA","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-NF","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-NG","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-NL","parentLocale":"en-150"});
IntlRelativeFormat.__addLocaleData({"locale":"en-NR","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-NU","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-NZ","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-PG","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-PH","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-PK","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-PN","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-PR","parentLocale":"en"});
IntlRelativeFormat.__addLocaleData({"locale":"en-PW","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-RW","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-SB","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-SC","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-SD","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-SE","parentLocale":"en-150"});
IntlRelativeFormat.__addLocaleData({"locale":"en-SG","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-SH","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-SI","parentLocale":"en-150"});
IntlRelativeFormat.__addLocaleData({"locale":"en-SL","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-SS","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-SX","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-SZ","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-Shaw","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"other":"+{0} y"},"past":{"other":"-{0} y"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"other":"+{0} m"},"past":{"other":"-{0} m"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"other":"+{0} d"},"past":{"other":"-{0} d"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"other":"+{0} h"},"past":{"other":"-{0} h"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"other":"+{0} min"},"past":{"other":"-{0} min"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"other":"+{0} s"},"past":{"other":"-{0} s"}}}}});
IntlRelativeFormat.__addLocaleData({"locale":"en-TC","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-TK","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-TO","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-TT","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-TV","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-TZ","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-UG","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-UM","parentLocale":"en"});
IntlRelativeFormat.__addLocaleData({"locale":"en-US","parentLocale":"en"});
IntlRelativeFormat.__addLocaleData({"locale":"en-VC","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-VG","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-VI","parentLocale":"en"});
IntlRelativeFormat.__addLocaleData({"locale":"en-VU","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-WS","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-ZA","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-ZM","parentLocale":"en-001"});
IntlRelativeFormat.__addLocaleData({"locale":"en-ZW","parentLocale":"en-001"});

},{}],14:[function(require,module,exports){
IntlRelativeFormat.__addLocaleData({"locale":"es","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"},"fields":{"year":{"displayName":"año","relative":{"0":"este año","1":"el próximo año","-1":"el año pasado"},"relativeTime":{"future":{"one":"dentro de {0} año","other":"dentro de {0} años"},"past":{"one":"hace {0} año","other":"hace {0} años"}}},"month":{"displayName":"mes","relative":{"0":"este mes","1":"el próximo mes","-1":"el mes pasado"},"relativeTime":{"future":{"one":"dentro de {0} mes","other":"dentro de {0} meses"},"past":{"one":"hace {0} mes","other":"hace {0} meses"}}},"day":{"displayName":"día","relative":{"0":"hoy","1":"mañana","2":"pasado mañana","-2":"anteayer","-1":"ayer"},"relativeTime":{"future":{"one":"dentro de {0} día","other":"dentro de {0} días"},"past":{"one":"hace {0} día","other":"hace {0} días"}}},"hour":{"displayName":"hora","relativeTime":{"future":{"one":"dentro de {0} hora","other":"dentro de {0} horas"},"past":{"one":"hace {0} hora","other":"hace {0} horas"}}},"minute":{"displayName":"minuto","relativeTime":{"future":{"one":"dentro de {0} minuto","other":"dentro de {0} minutos"},"past":{"one":"hace {0} minuto","other":"hace {0} minutos"}}},"second":{"displayName":"segundo","relative":{"0":"ahora"},"relativeTime":{"future":{"one":"dentro de {0} segundo","other":"dentro de {0} segundos"},"past":{"one":"hace {0} segundo","other":"hace {0} segundos"}}}}});
IntlRelativeFormat.__addLocaleData({"locale":"es-419","parentLocale":"es"});
IntlRelativeFormat.__addLocaleData({"locale":"es-AR","parentLocale":"es-419"});
IntlRelativeFormat.__addLocaleData({"locale":"es-BO","parentLocale":"es-419"});
IntlRelativeFormat.__addLocaleData({"locale":"es-CL","parentLocale":"es-419"});
IntlRelativeFormat.__addLocaleData({"locale":"es-CO","parentLocale":"es-419"});
IntlRelativeFormat.__addLocaleData({"locale":"es-CR","parentLocale":"es-419","fields":{"year":{"displayName":"año","relative":{"0":"este año","1":"el próximo año","-1":"el año pasado"},"relativeTime":{"future":{"one":"dentro de {0} año","other":"dentro de {0} años"},"past":{"one":"hace {0} año","other":"hace {0} años"}}},"month":{"displayName":"mes","relative":{"0":"este mes","1":"el próximo mes","-1":"el mes pasado"},"relativeTime":{"future":{"one":"dentro de {0} mes","other":"dentro de {0} meses"},"past":{"one":"hace {0} mes","other":"hace {0} meses"}}},"day":{"displayName":"día","relative":{"0":"hoy","1":"mañana","2":"pasado mañana","-2":"antier","-1":"ayer"},"relativeTime":{"future":{"one":"dentro de {0} día","other":"dentro de {0} días"},"past":{"one":"hace {0} día","other":"hace {0} días"}}},"hour":{"displayName":"hora","relativeTime":{"future":{"one":"dentro de {0} hora","other":"dentro de {0} horas"},"past":{"one":"hace {0} hora","other":"hace {0} horas"}}},"minute":{"displayName":"minuto","relativeTime":{"future":{"one":"dentro de {0} minuto","other":"dentro de {0} minutos"},"past":{"one":"hace {0} minuto","other":"hace {0} minutos"}}},"second":{"displayName":"segundo","relative":{"0":"ahora"},"relativeTime":{"future":{"one":"dentro de {0} segundo","other":"dentro de {0} segundos"},"past":{"one":"hace {0} segundo","other":"hace {0} segundos"}}}}});
IntlRelativeFormat.__addLocaleData({"locale":"es-CU","parentLocale":"es-419"});
IntlRelativeFormat.__addLocaleData({"locale":"es-DO","parentLocale":"es-419","fields":{"year":{"displayName":"Año","relative":{"0":"este año","1":"el próximo año","-1":"el año pasado"},"relativeTime":{"future":{"one":"dentro de {0} año","other":"dentro de {0} años"},"past":{"one":"hace {0} año","other":"hace {0} años"}}},"month":{"displayName":"Mes","relative":{"0":"este mes","1":"el próximo mes","-1":"el mes pasado"},"relativeTime":{"future":{"one":"dentro de {0} mes","other":"dentro de {0} meses"},"past":{"one":"hace {0} mes","other":"hace {0} meses"}}},"day":{"displayName":"Día","relative":{"0":"hoy","1":"mañana","2":"pasado mañana","-2":"anteayer","-1":"ayer"},"relativeTime":{"future":{"one":"dentro de {0} día","other":"dentro de {0} días"},"past":{"one":"hace {0} día","other":"hace {0} días"}}},"hour":{"displayName":"hora","relativeTime":{"future":{"one":"dentro de {0} hora","other":"dentro de {0} horas"},"past":{"one":"hace {0} hora","other":"hace {0} horas"}}},"minute":{"displayName":"Minuto","relativeTime":{"future":{"one":"dentro de {0} minuto","other":"dentro de {0} minutos"},"past":{"one":"hace {0} minuto","other":"hace {0} minutos"}}},"second":{"displayName":"Segundo","relative":{"0":"ahora"},"relativeTime":{"future":{"one":"dentro de {0} segundo","other":"dentro de {0} segundos"},"past":{"one":"hace {0} segundo","other":"hace {0} segundos"}}}}});
IntlRelativeFormat.__addLocaleData({"locale":"es-EA","parentLocale":"es"});
IntlRelativeFormat.__addLocaleData({"locale":"es-EC","parentLocale":"es-419"});
IntlRelativeFormat.__addLocaleData({"locale":"es-GQ","parentLocale":"es"});
IntlRelativeFormat.__addLocaleData({"locale":"es-GT","parentLocale":"es-419","fields":{"year":{"displayName":"año","relative":{"0":"este año","1":"el próximo año","-1":"el año pasado"},"relativeTime":{"future":{"one":"dentro de {0} año","other":"dentro de {0} años"},"past":{"one":"hace {0} año","other":"hace {0} años"}}},"month":{"displayName":"mes","relative":{"0":"este mes","1":"el próximo mes","-1":"el mes pasado"},"relativeTime":{"future":{"one":"dentro de {0} mes","other":"dentro de {0} meses"},"past":{"one":"hace {0} mes","other":"hace {0} meses"}}},"day":{"displayName":"día","relative":{"0":"hoy","1":"mañana","2":"pasado mañana","-2":"antier","-1":"ayer"},"relativeTime":{"future":{"one":"dentro de {0} día","other":"dentro de {0} días"},"past":{"one":"hace {0} día","other":"hace {0} días"}}},"hour":{"displayName":"hora","relativeTime":{"future":{"one":"dentro de {0} hora","other":"dentro de {0} horas"},"past":{"one":"hace {0} hora","other":"hace {0} horas"}}},"minute":{"displayName":"minuto","relativeTime":{"future":{"one":"dentro de {0} minuto","other":"dentro de {0} minutos"},"past":{"one":"hace {0} minuto","other":"hace {0} minutos"}}},"second":{"displayName":"segundo","relative":{"0":"ahora"},"relativeTime":{"future":{"one":"dentro de {0} segundo","other":"dentro de {0} segundos"},"past":{"one":"hace {0} segundo","other":"hace {0} segundos"}}}}});
IntlRelativeFormat.__addLocaleData({"locale":"es-HN","parentLocale":"es-419","fields":{"year":{"displayName":"año","relative":{"0":"este año","1":"el próximo año","-1":"el año pasado"},"relativeTime":{"future":{"one":"dentro de {0} año","other":"dentro de {0} años"},"past":{"one":"hace {0} año","other":"hace {0} años"}}},"month":{"displayName":"mes","relative":{"0":"este mes","1":"el próximo mes","-1":"el mes pasado"},"relativeTime":{"future":{"one":"dentro de {0} mes","other":"dentro de {0} meses"},"past":{"one":"hace {0} mes","other":"hace {0} meses"}}},"day":{"displayName":"día","relative":{"0":"hoy","1":"mañana","2":"pasado mañana","-2":"antier","-1":"ayer"},"relativeTime":{"future":{"one":"dentro de {0} día","other":"dentro de {0} días"},"past":{"one":"hace {0} día","other":"hace {0} días"}}},"hour":{"displayName":"hora","relativeTime":{"future":{"one":"dentro de {0} hora","other":"dentro de {0} horas"},"past":{"one":"hace {0} hora","other":"hace {0} horas"}}},"minute":{"displayName":"minuto","relativeTime":{"future":{"one":"dentro de {0} minuto","other":"dentro de {0} minutos"},"past":{"one":"hace {0} minuto","other":"hace {0} minutos"}}},"second":{"displayName":"segundo","relative":{"0":"ahora"},"relativeTime":{"future":{"one":"dentro de {0} segundo","other":"dentro de {0} segundos"},"past":{"one":"hace {0} segundo","other":"hace {0} segundos"}}}}});
IntlRelativeFormat.__addLocaleData({"locale":"es-IC","parentLocale":"es"});
IntlRelativeFormat.__addLocaleData({"locale":"es-MX","parentLocale":"es-419","fields":{"year":{"displayName":"año","relative":{"0":"este año","1":"el año próximo","-1":"el año pasado"},"relativeTime":{"future":{"one":"dentro de {0} año","other":"dentro de {0} años"},"past":{"one":"hace {0} año","other":"hace {0} años"}}},"month":{"displayName":"mes","relative":{"0":"este mes","1":"el mes próximo","-1":"el mes pasado"},"relativeTime":{"future":{"one":"en {0} mes","other":"en {0} meses"},"past":{"one":"hace {0} mes","other":"hace {0} meses"}}},"day":{"displayName":"día","relative":{"0":"hoy","1":"mañana","2":"pasado mañana","-2":"antier","-1":"ayer"},"relativeTime":{"future":{"one":"dentro de {0} día","other":"dentro de {0} días"},"past":{"one":"hace {0} día","other":"hace {0} días"}}},"hour":{"displayName":"hora","relativeTime":{"future":{"one":"dentro de {0} hora","other":"dentro de {0} horas"},"past":{"one":"hace {0} hora","other":"hace {0} horas"}}},"minute":{"displayName":"minuto","relativeTime":{"future":{"one":"dentro de {0} minuto","other":"dentro de {0} minutos"},"past":{"one":"hace {0} minuto","other":"hace {0} minutos"}}},"second":{"displayName":"segundo","relative":{"0":"ahora"},"relativeTime":{"future":{"one":"dentro de {0} segundo","other":"dentro de {0} segundos"},"past":{"one":"hace {0} segundo","other":"hace {0} segundos"}}}}});
IntlRelativeFormat.__addLocaleData({"locale":"es-NI","parentLocale":"es-419","fields":{"year":{"displayName":"año","relative":{"0":"este año","1":"el próximo año","-1":"el año pasado"},"relativeTime":{"future":{"one":"dentro de {0} año","other":"dentro de {0} años"},"past":{"one":"hace {0} año","other":"hace {0} años"}}},"month":{"displayName":"mes","relative":{"0":"este mes","1":"el próximo mes","-1":"el mes pasado"},"relativeTime":{"future":{"one":"dentro de {0} mes","other":"dentro de {0} meses"},"past":{"one":"hace {0} mes","other":"hace {0} meses"}}},"day":{"displayName":"día","relative":{"0":"hoy","1":"mañana","2":"pasado mañana","-2":"antier","-1":"ayer"},"relativeTime":{"future":{"one":"dentro de {0} día","other":"dentro de {0} días"},"past":{"one":"hace {0} día","other":"hace {0} días"}}},"hour":{"displayName":"hora","relativeTime":{"future":{"one":"dentro de {0} hora","other":"dentro de {0} horas"},"past":{"one":"hace {0} hora","other":"hace {0} horas"}}},"minute":{"displayName":"minuto","relativeTime":{"future":{"one":"dentro de {0} minuto","other":"dentro de {0} minutos"},"past":{"one":"hace {0} minuto","other":"hace {0} minutos"}}},"second":{"displayName":"segundo","relative":{"0":"ahora"},"relativeTime":{"future":{"one":"dentro de {0} segundo","other":"dentro de {0} segundos"},"past":{"one":"hace {0} segundo","other":"hace {0} segundos"}}}}});
IntlRelativeFormat.__addLocaleData({"locale":"es-PA","parentLocale":"es-419","fields":{"year":{"displayName":"año","relative":{"0":"este año","1":"el próximo año","-1":"el año pasado"},"relativeTime":{"future":{"one":"dentro de {0} año","other":"dentro de {0} años"},"past":{"one":"hace {0} año","other":"hace {0} años"}}},"month":{"displayName":"mes","relative":{"0":"este mes","1":"el próximo mes","-1":"el mes pasado"},"relativeTime":{"future":{"one":"dentro de {0} mes","other":"dentro de {0} meses"},"past":{"one":"hace {0} mes","other":"hace {0} meses"}}},"day":{"displayName":"día","relative":{"0":"hoy","1":"mañana","2":"pasado mañana","-2":"antier","-1":"ayer"},"relativeTime":{"future":{"one":"dentro de {0} día","other":"dentro de {0} días"},"past":{"one":"hace {0} día","other":"hace {0} días"}}},"hour":{"displayName":"hora","relativeTime":{"future":{"one":"dentro de {0} hora","other":"dentro de {0} horas"},"past":{"one":"hace {0} hora","other":"hace {0} horas"}}},"minute":{"displayName":"minuto","relativeTime":{"future":{"one":"dentro de {0} minuto","other":"dentro de {0} minutos"},"past":{"one":"hace {0} minuto","other":"hace {0} minutos"}}},"second":{"displayName":"segundo","relative":{"0":"ahora"},"relativeTime":{"future":{"one":"dentro de {0} segundo","other":"dentro de {0} segundos"},"past":{"one":"hace {0} segundo","other":"hace {0} segundos"}}}}});
IntlRelativeFormat.__addLocaleData({"locale":"es-PE","parentLocale":"es-419"});
IntlRelativeFormat.__addLocaleData({"locale":"es-PH","parentLocale":"es"});
IntlRelativeFormat.__addLocaleData({"locale":"es-PR","parentLocale":"es-419"});
IntlRelativeFormat.__addLocaleData({"locale":"es-PY","parentLocale":"es-419","fields":{"year":{"displayName":"año","relative":{"0":"este año","1":"el próximo año","-1":"el año pasado"},"relativeTime":{"future":{"one":"dentro de {0} año","other":"dentro de {0} años"},"past":{"one":"hace {0} año","other":"hace {0} años"}}},"month":{"displayName":"mes","relative":{"0":"este mes","1":"el próximo mes","-1":"el mes pasado"},"relativeTime":{"future":{"one":"dentro de {0} mes","other":"dentro de {0} meses"},"past":{"one":"hace {0} mes","other":"hace {0} meses"}}},"day":{"displayName":"día","relative":{"0":"hoy","1":"mañana","2":"pasado mañana","-2":"antes de ayer","-1":"ayer"},"relativeTime":{"future":{"one":"dentro de {0} día","other":"dentro de {0} días"},"past":{"one":"hace {0} día","other":"hace {0} días"}}},"hour":{"displayName":"hora","relativeTime":{"future":{"one":"dentro de {0} hora","other":"dentro de {0} horas"},"past":{"one":"hace {0} hora","other":"hace {0} horas"}}},"minute":{"displayName":"minuto","relativeTime":{"future":{"one":"dentro de {0} minuto","other":"dentro de {0} minutos"},"past":{"one":"hace {0} minuto","other":"hace {0} minutos"}}},"second":{"displayName":"segundo","relative":{"0":"ahora"},"relativeTime":{"future":{"one":"dentro de {0} segundo","other":"dentro de {0} segundos"},"past":{"one":"hace {0} segundo","other":"hace {0} segundos"}}}}});
IntlRelativeFormat.__addLocaleData({"locale":"es-SV","parentLocale":"es-419","fields":{"year":{"displayName":"año","relative":{"0":"este año","1":"el próximo año","-1":"el año pasado"},"relativeTime":{"future":{"one":"dentro de {0} año","other":"dentro de {0} años"},"past":{"one":"hace {0} año","other":"hace {0} años"}}},"month":{"displayName":"mes","relative":{"0":"este mes","1":"el próximo mes","-1":"el mes pasado"},"relativeTime":{"future":{"one":"dentro de {0} mes","other":"dentro de {0} meses"},"past":{"one":"hace {0} mes","other":"hace {0} meses"}}},"day":{"displayName":"día","relative":{"0":"hoy","1":"mañana","2":"pasado mañana","-2":"antier","-1":"ayer"},"relativeTime":{"future":{"one":"dentro de {0} día","other":"dentro de {0} días"},"past":{"one":"hace {0} día","other":"hace {0} días"}}},"hour":{"displayName":"hora","relativeTime":{"future":{"one":"dentro de {0} hora","other":"dentro de {0} horas"},"past":{"one":"hace {0} hora","other":"hace {0} horas"}}},"minute":{"displayName":"minuto","relativeTime":{"future":{"one":"dentro de {0} minuto","other":"dentro de {0} minutos"},"past":{"one":"hace {0} minuto","other":"hace {0} minutos"}}},"second":{"displayName":"segundo","relative":{"0":"ahora"},"relativeTime":{"future":{"one":"dentro de {0} segundo","other":"dentro de {0} segundos"},"past":{"one":"hace {0} segundo","other":"hace {0} segundos"}}}}});
IntlRelativeFormat.__addLocaleData({"locale":"es-US","parentLocale":"es-419"});
IntlRelativeFormat.__addLocaleData({"locale":"es-UY","parentLocale":"es-419"});
IntlRelativeFormat.__addLocaleData({"locale":"es-VE","parentLocale":"es-419"});

},{}],15:[function(require,module,exports){
/* jshint node:true */

'use strict';

var IntlRelativeFormat = require('./lib/main')['default'];

// Add all locale data to `IntlRelativeFormat`. This module will be ignored when
// bundling for the browser with Browserify/Webpack.
require('./lib/locales');

// Re-export `IntlRelativeFormat` as the CommonJS default exports with all the
// locale data registered, and with English set as the default locale. Define
// the `default` prop for use with other compiled ES6 Modules.
exports = module.exports = IntlRelativeFormat;
exports['default'] = exports;

},{"./lib/locales":1,"./lib/main":20}],16:[function(require,module,exports){
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

"use strict";
var intl$messageformat$$ = require("intl-messageformat"), src$diff$$ = require("./diff"), src$es5$$ = require("./es5");
exports["default"] = RelativeFormat;

// -----------------------------------------------------------------------------

var FIELDS = ['second', 'minute', 'hour', 'day', 'month', 'year'];
var STYLES = ['best fit', 'numeric'];

// -- RelativeFormat -----------------------------------------------------------

function RelativeFormat(locales, options) {
    options = options || {};

    // Make a copy of `locales` if it's an array, so that it doesn't change
    // since it's used lazily.
    if (src$es5$$.isArray(locales)) {
        locales = locales.concat();
    }

    src$es5$$.defineProperty(this, '_locale', {value: this._resolveLocale(locales)});
    src$es5$$.defineProperty(this, '_options', {value: {
        style: this._resolveStyle(options.style),
        units: this._isValidUnits(options.units) && options.units
    }});

    src$es5$$.defineProperty(this, '_locales', {value: locales});
    src$es5$$.defineProperty(this, '_fields', {value: this._findFields(this._locale)});
    src$es5$$.defineProperty(this, '_messages', {value: src$es5$$.objCreate(null)});

    // "Bind" `format()` method to `this` so it can be passed by reference like
    // the other `Intl` APIs.
    var relativeFormat = this;
    this.format = function format(date, options) {
        return relativeFormat._format(date, options);
    };
}

// Define internal private properties for dealing with locale data.
src$es5$$.defineProperty(RelativeFormat, '__localeData__', {value: src$es5$$.objCreate(null)});
src$es5$$.defineProperty(RelativeFormat, '__addLocaleData', {value: function (data) {
    if (!(data && data.locale)) {
        throw new Error(
            'Locale data provided to IntlRelativeFormat is missing a ' +
            '`locale` property value'
        );
    }

    RelativeFormat.__localeData__[data.locale.toLowerCase()] = data;

    // Add data to IntlMessageFormat.
    intl$messageformat$$["default"].__addLocaleData(data);
}});

// Define public `defaultLocale` property which can be set by the developer, or
// it will be set when the first RelativeFormat instance is created by
// leveraging the resolved locale from `Intl`.
src$es5$$.defineProperty(RelativeFormat, 'defaultLocale', {
    enumerable: true,
    writable  : true,
    value     : undefined
});

// Define public `thresholds` property which can be set by the developer, and
// defaults to relative time thresholds from moment.js.
src$es5$$.defineProperty(RelativeFormat, 'thresholds', {
    enumerable: true,

    value: {
        second: 45,  // seconds to minute
        minute: 45,  // minutes to hour
        hour  : 22,  // hours to day
        day   : 26,  // days to month
        month : 11   // months to year
    }
});

RelativeFormat.prototype.resolvedOptions = function () {
    return {
        locale: this._locale,
        style : this._options.style,
        units : this._options.units
    };
};

RelativeFormat.prototype._compileMessage = function (units) {
    // `this._locales` is the original set of locales the user specified to the
    // constructor, while `this._locale` is the resolved root locale.
    var locales        = this._locales;
    var resolvedLocale = this._locale;

    var field        = this._fields[units];
    var relativeTime = field.relativeTime;
    var future       = '';
    var past         = '';
    var i;

    for (i in relativeTime.future) {
        if (relativeTime.future.hasOwnProperty(i)) {
            future += ' ' + i + ' {' +
                relativeTime.future[i].replace('{0}', '#') + '}';
        }
    }

    for (i in relativeTime.past) {
        if (relativeTime.past.hasOwnProperty(i)) {
            past += ' ' + i + ' {' +
                relativeTime.past[i].replace('{0}', '#') + '}';
        }
    }

    var message = '{when, select, future {{0, plural, ' + future + '}}' +
                                 'past {{0, plural, ' + past + '}}}';

    // Create the synthetic IntlMessageFormat instance using the original
    // locales value specified by the user when constructing the the parent
    // IntlRelativeFormat instance.
    return new intl$messageformat$$["default"](message, locales);
};

RelativeFormat.prototype._getMessage = function (units) {
    var messages = this._messages;

    // Create a new synthetic message based on the locale data from CLDR.
    if (!messages[units]) {
        messages[units] = this._compileMessage(units);
    }

    return messages[units];
};

RelativeFormat.prototype._getRelativeUnits = function (diff, units) {
    var field = this._fields[units];

    if (field.relative) {
        return field.relative[diff];
    }
};

RelativeFormat.prototype._findFields = function (locale) {
    var localeData = RelativeFormat.__localeData__;
    var data       = localeData[locale.toLowerCase()];

    // The locale data is de-duplicated, so we have to traverse the locale's
    // hierarchy until we find `fields` to return.
    while (data) {
        if (data.fields) {
            return data.fields;
        }

        data = data.parentLocale && localeData[data.parentLocale.toLowerCase()];
    }

    throw new Error(
        'Locale data added to IntlRelativeFormat is missing `fields` for :' +
        locale
    );
};

RelativeFormat.prototype._format = function (date, options) {
    var now = options && options.now !== undefined ? options.now : src$es5$$.dateNow();

    if (date === undefined) {
        date = now;
    }

    // Determine if the `date` and optional `now` values are valid, and throw a
    // similar error to what `Intl.DateTimeFormat#format()` would throw.
    if (!isFinite(now)) {
        throw new RangeError(
            'The `now` option provided to IntlRelativeFormat#format() is not ' +
            'in valid range.'
        );
    }

    if (!isFinite(date)) {
        throw new RangeError(
            'The date value provided to IntlRelativeFormat#format() is not ' +
            'in valid range.'
        );
    }

    var diffReport  = src$diff$$["default"](now, date);
    var units       = this._options.units || this._selectUnits(diffReport);
    var diffInUnits = diffReport[units];

    if (this._options.style !== 'numeric') {
        var relativeUnits = this._getRelativeUnits(diffInUnits, units);
        if (relativeUnits) {
            return relativeUnits;
        }
    }

    return this._getMessage(units).format({
        '0' : Math.abs(diffInUnits),
        when: diffInUnits < 0 ? 'past' : 'future'
    });
};

RelativeFormat.prototype._isValidUnits = function (units) {
    if (!units || src$es5$$.arrIndexOf.call(FIELDS, units) >= 0) {
        return true;
    }

    if (typeof units === 'string') {
        var suggestion = /s$/.test(units) && units.substr(0, units.length - 1);
        if (suggestion && src$es5$$.arrIndexOf.call(FIELDS, suggestion) >= 0) {
            throw new Error(
                '"' + units + '" is not a valid IntlRelativeFormat `units` ' +
                'value, did you mean: ' + suggestion
            );
        }
    }

    throw new Error(
        '"' + units + '" is not a valid IntlRelativeFormat `units` value, it ' +
        'must be one of: "' + FIELDS.join('", "') + '"'
    );
};

RelativeFormat.prototype._resolveLocale = function (locales) {
    if (typeof locales === 'string') {
        locales = [locales];
    }

    // Create a copy of the array so we can push on the default locale.
    locales = (locales || []).concat(RelativeFormat.defaultLocale);

    var localeData = RelativeFormat.__localeData__;
    var i, len, localeParts, data;

    // Using the set of locales + the default locale, we look for the first one
    // which that has been registered. When data does not exist for a locale, we
    // traverse its ancestors to find something that's been registered within
    // its hierarchy of locales. Since we lack the proper `parentLocale` data
    // here, we must take a naive approach to traversal.
    for (i = 0, len = locales.length; i < len; i += 1) {
        localeParts = locales[i].toLowerCase().split('-');

        while (localeParts.length) {
            data = localeData[localeParts.join('-')];
            if (data) {
                // Return the normalized locale string; e.g., we return "en-US",
                // instead of "en-us".
                return data.locale;
            }

            localeParts.pop();
        }
    }

    var defaultLocale = locales.pop();
    throw new Error(
        'No locale data has been added to IntlRelativeFormat for: ' +
        locales.join(', ') + ', or the default locale: ' + defaultLocale
    );
};

RelativeFormat.prototype._resolveStyle = function (style) {
    // Default to "best fit" style.
    if (!style) {
        return STYLES[0];
    }

    if (src$es5$$.arrIndexOf.call(STYLES, style) >= 0) {
        return style;
    }

    throw new Error(
        '"' + style + '" is not a valid IntlRelativeFormat `style` value, it ' +
        'must be one of: "' + STYLES.join('", "') + '"'
    );
};

RelativeFormat.prototype._selectUnits = function (diffReport) {
    var i, l, units;

    for (i = 0, l = FIELDS.length; i < l; i += 1) {
        units = FIELDS[i];

        if (Math.abs(diffReport[units]) < RelativeFormat.thresholds[units]) {
            break;
        }
    }

    return units;
};


},{"./diff":17,"./es5":19,"intl-messageformat":21}],17:[function(require,module,exports){
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

"use strict";

var round = Math.round;

function daysToYears(days) {
    // 400 years have 146097 days (taking into account leap year rules)
    return days * 400 / 146097;
}

exports["default"] = function (from, to) {
    // Convert to ms timestamps.
    from = +from;
    to   = +to;

    var millisecond = round(to - from),
        second      = round(millisecond / 1000),
        minute      = round(second / 60),
        hour        = round(minute / 60),
        day         = round(hour / 24),
        week        = round(day / 7);

    var rawYears = daysToYears(day),
        month    = round(rawYears * 12),
        year     = round(rawYears);

    return {
        millisecond: millisecond,
        second     : second,
        minute     : minute,
        hour       : hour,
        day        : day,
        week       : week,
        month      : month,
        year       : year
    };
};


},{}],18:[function(require,module,exports){
// GENERATED FILE
"use strict";
exports["default"] = {"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"one":"in {0} year","other":"in {0} years"},"past":{"one":"{0} year ago","other":"{0} years ago"}}},"month":{"displayName":"month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"one":"in {0} month","other":"in {0} months"},"past":{"one":"{0} month ago","other":"{0} months ago"}}},"day":{"displayName":"day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"one":"in {0} day","other":"in {0} days"},"past":{"one":"{0} day ago","other":"{0} days ago"}}},"hour":{"displayName":"hour","relativeTime":{"future":{"one":"in {0} hour","other":"in {0} hours"},"past":{"one":"{0} hour ago","other":"{0} hours ago"}}},"minute":{"displayName":"minute","relativeTime":{"future":{"one":"in {0} minute","other":"in {0} minutes"},"past":{"one":"{0} minute ago","other":"{0} minutes ago"}}},"second":{"displayName":"second","relative":{"0":"now"},"relativeTime":{"future":{"one":"in {0} second","other":"in {0} seconds"},"past":{"one":"{0} second ago","other":"{0} seconds ago"}}}}};


},{}],19:[function(require,module,exports){
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

"use strict";

// Purposely using the same implementation as the Intl.js `Intl` polyfill.
// Copyright 2013 Andy Earnshaw, MIT License

var hop = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

var realDefineProp = (function () {
    try { return !!Object.defineProperty({}, 'a', {}); }
    catch (e) { return false; }
})();

var es3 = !realDefineProp && !Object.prototype.__defineGetter__;

var defineProperty = realDefineProp ? Object.defineProperty :
        function (obj, name, desc) {

    if ('get' in desc && obj.__defineGetter__) {
        obj.__defineGetter__(name, desc.get);
    } else if (!hop.call(obj, name) || 'value' in desc) {
        obj[name] = desc.value;
    }
};

var objCreate = Object.create || function (proto, props) {
    var obj, k;

    function F() {}
    F.prototype = proto;
    obj = new F();

    for (k in props) {
        if (hop.call(props, k)) {
            defineProperty(obj, k, props[k]);
        }
    }

    return obj;
};

var arrIndexOf = Array.prototype.indexOf || function (search, fromIndex) {
    /*jshint validthis:true */
    var arr = this;
    if (!arr.length) {
        return -1;
    }

    for (var i = fromIndex || 0, max = arr.length; i < max; i++) {
        if (arr[i] === search) {
            return i;
        }
    }

    return -1;
};

var isArray = Array.isArray || function (obj) {
    return toString.call(obj) === '[object Array]';
};

var dateNow = Date.now || function () {
    return new Date().getTime();
};
exports.defineProperty = defineProperty, exports.objCreate = objCreate, exports.arrIndexOf = arrIndexOf, exports.isArray = isArray, exports.dateNow = dateNow;


},{}],20:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"./core":16,"./en":18,"dup":9}],21:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./lib/locales":1,"./lib/main":26,"dup":4}],22:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],23:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./compiler":22,"./es5":25,"./utils":27,"dup":6,"intl-messageformat-parser":28}],24:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],25:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"./utils":27,"dup":8}],26:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"./core":23,"./en":24,"dup":9}],27:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],28:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"./lib/parser":29,"dup":11}],29:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],30:[function(require,module,exports){
(function (global){
// Expose `IntlPolyfill` as global to add locale data into runtime later on.
global.IntlPolyfill = require('./lib/core.js');

// Require all locale data for `Intl`. This module will be
// ignored when bundling for the browser with Browserify/Webpack.
require('./locale-data/complete.js');

// hack to export the polyfill as global Intl if needed
if (!global.Intl) {
    global.Intl = global.IntlPolyfill;
    global.IntlPolyfill.__applyLocaleSensitivePrototypes();
}

// providing an idiomatic api for the nodejs version of this module
module.exports = global.IntlPolyfill;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./lib/core.js":31,"./locale-data/complete.js":1}],31:[function(require,module,exports){
'use strict';

var babelHelpers = {};
babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
babelHelpers;

var realDefineProp = function () {
    var sentinel = {};
    try {
        Object.defineProperty(sentinel, 'a', {});
        return 'a' in sentinel;
    } catch (e) {
        return false;
    }
}();

// Need a workaround for getters in ES3
var es3 = !realDefineProp && !Object.prototype.__defineGetter__;

// We use this a lot (and need it for proto-less objects)
var hop = Object.prototype.hasOwnProperty;

// Naive defineProperty for compatibility
var defineProperty = realDefineProp ? Object.defineProperty : function (obj, name, desc) {
    if ('get' in desc && obj.__defineGetter__) obj.__defineGetter__(name, desc.get);else if (!hop.call(obj, name) || 'value' in desc) obj[name] = desc.value;
};

// Array.prototype.indexOf, as good as we need it to be
var arrIndexOf = Array.prototype.indexOf || function (search) {
    /*jshint validthis:true */
    var t = this;
    if (!t.length) return -1;

    for (var i = arguments[1] || 0, max = t.length; i < max; i++) {
        if (t[i] === search) return i;
    }

    return -1;
};

// Create an object with the specified prototype (2nd arg required for Record)
var objCreate = Object.create || function (proto, props) {
    var obj = void 0;

    function F() {}
    F.prototype = proto;
    obj = new F();

    for (var k in props) {
        if (hop.call(props, k)) defineProperty(obj, k, props[k]);
    }

    return obj;
};

// Snapshot some (hopefully still) native built-ins
var arrSlice = Array.prototype.slice;
var arrConcat = Array.prototype.concat;
var arrPush = Array.prototype.push;
var arrJoin = Array.prototype.join;
var arrShift = Array.prototype.shift;

// Naive Function.prototype.bind for compatibility
var fnBind = Function.prototype.bind || function (thisObj) {
    var fn = this,
        args = arrSlice.call(arguments, 1);

    // All our (presently) bound functions have either 1 or 0 arguments. By returning
    // different function signatures, we can pass some tests in ES3 environments
    if (fn.length === 1) {
        return function () {
            return fn.apply(thisObj, arrConcat.call(args, arrSlice.call(arguments)));
        };
    }
    return function () {
        return fn.apply(thisObj, arrConcat.call(args, arrSlice.call(arguments)));
    };
};

// Object housing internal properties for constructors
var internals = objCreate(null);

// Keep internal properties internal
var secret = Math.random();

// Helper functions
// ================

/**
 * A function to deal with the inaccuracy of calculating log10 in pre-ES6
 * JavaScript environments. Math.log(num) / Math.LN10 was responsible for
 * causing issue #62.
 */
function log10Floor(n) {
    // ES6 provides the more accurate Math.log10
    if (typeof Math.log10 === 'function') return Math.floor(Math.log10(n));

    var x = Math.round(Math.log(n) * Math.LOG10E);
    return x - (Number('1e' + x) > n);
}

/**
 * A map that doesn't contain Object in its prototype chain
 */
function Record(obj) {
    // Copy only own properties over unless this object is already a Record instance
    for (var k in obj) {
        if (obj instanceof Record || hop.call(obj, k)) defineProperty(this, k, { value: obj[k], enumerable: true, writable: true, configurable: true });
    }
}
Record.prototype = objCreate(null);

/**
 * An ordered list
 */
function List() {
    defineProperty(this, 'length', { writable: true, value: 0 });

    if (arguments.length) arrPush.apply(this, arrSlice.call(arguments));
}
List.prototype = objCreate(null);

/**
 * Constructs a regular expression to restore tainted RegExp properties
 */
function createRegExpRestore() {
    var esc = /[.?*+^$[\]\\(){}|-]/g,
        lm = RegExp.lastMatch || '',
        ml = RegExp.multiline ? 'm' : '',
        ret = { input: RegExp.input },
        reg = new List(),
        has = false,
        cap = {};

    // Create a snapshot of all the 'captured' properties
    for (var i = 1; i <= 9; i++) {
        has = (cap['$' + i] = RegExp['$' + i]) || has;
    } // Now we've snapshotted some properties, escape the lastMatch string
    lm = lm.replace(esc, '\\$&');

    // If any of the captured strings were non-empty, iterate over them all
    if (has) {
        for (var _i = 1; _i <= 9; _i++) {
            var m = cap['$' + _i];

            // If it's empty, add an empty capturing group
            if (!m) lm = '()' + lm;

            // Else find the string in lm and escape & wrap it to capture it
            else {
                    m = m.replace(esc, '\\$&');
                    lm = lm.replace(m, '(' + m + ')');
                }

            // Push it to the reg and chop lm to make sure further groups come after
            arrPush.call(reg, lm.slice(0, lm.indexOf('(') + 1));
            lm = lm.slice(lm.indexOf('(') + 1);
        }
    }

    // Create the regular expression that will reconstruct the RegExp properties
    ret.exp = new RegExp(arrJoin.call(reg, '') + lm, ml);

    return ret;
}

/**
 * Mimics ES5's abstract ToObject() function
 */
function toObject(arg) {
    if (arg === null) throw new TypeError('Cannot convert null or undefined to object');

    return Object(arg);
}

/**
 * Returns "internal" properties for an object
 */
function getInternalProperties(obj) {
    if (hop.call(obj, '__getInternalProperties')) return obj.__getInternalProperties(secret);

    return objCreate(null);
}

/**
* Defines regular expressions for various operations related to the BCP 47 syntax,
* as defined at http://tools.ietf.org/html/bcp47#section-2.1
*/

// extlang       = 3ALPHA              ; selected ISO 639 codes
//                 *2("-" 3ALPHA)      ; permanently reserved
var extlang = '[a-z]{3}(?:-[a-z]{3}){0,2}';

// language      = 2*3ALPHA            ; shortest ISO 639 code
//                 ["-" extlang]       ; sometimes followed by
//                                     ; extended language subtags
//               / 4ALPHA              ; or reserved for future use
//               / 5*8ALPHA            ; or registered language subtag
var language = '(?:[a-z]{2,3}(?:-' + extlang + ')?|[a-z]{4}|[a-z]{5,8})';

// script        = 4ALPHA              ; ISO 15924 code
var script = '[a-z]{4}';

// region        = 2ALPHA              ; ISO 3166-1 code
//               / 3DIGIT              ; UN M.49 code
var region = '(?:[a-z]{2}|\\d{3})';

// variant       = 5*8alphanum         ; registered variants
//               / (DIGIT 3alphanum)
var variant = '(?:[a-z0-9]{5,8}|\\d[a-z0-9]{3})';

//                                     ; Single alphanumerics
//                                     ; "x" reserved for private use
// singleton     = DIGIT               ; 0 - 9
//               / %x41-57             ; A - W
//               / %x59-5A             ; Y - Z
//               / %x61-77             ; a - w
//               / %x79-7A             ; y - z
var singleton = '[0-9a-wy-z]';

// extension     = singleton 1*("-" (2*8alphanum))
var extension = singleton + '(?:-[a-z0-9]{2,8})+';

// privateuse    = "x" 1*("-" (1*8alphanum))
var privateuse = 'x(?:-[a-z0-9]{1,8})+';

// irregular     = "en-GB-oed"         ; irregular tags do not match
//               / "i-ami"             ; the 'langtag' production and
//               / "i-bnn"             ; would not otherwise be
//               / "i-default"         ; considered 'well-formed'
//               / "i-enochian"        ; These tags are all valid,
//               / "i-hak"             ; but most are deprecated
//               / "i-klingon"         ; in favor of more modern
//               / "i-lux"             ; subtags or subtag
//               / "i-mingo"           ; combination
//               / "i-navajo"
//               / "i-pwn"
//               / "i-tao"
//               / "i-tay"
//               / "i-tsu"
//               / "sgn-BE-FR"
//               / "sgn-BE-NL"
//               / "sgn-CH-DE"
var irregular = '(?:en-GB-oed' + '|i-(?:ami|bnn|default|enochian|hak|klingon|lux|mingo|navajo|pwn|tao|tay|tsu)' + '|sgn-(?:BE-FR|BE-NL|CH-DE))';

// regular       = "art-lojban"        ; these tags match the 'langtag'
//               / "cel-gaulish"       ; production, but their subtags
//               / "no-bok"            ; are not extended language
//               / "no-nyn"            ; or variant subtags: their meaning
//               / "zh-guoyu"          ; is defined by their registration
//               / "zh-hakka"          ; and all of these are deprecated
//               / "zh-min"            ; in favor of a more modern
//               / "zh-min-nan"        ; subtag or sequence of subtags
//               / "zh-xiang"
var regular = '(?:art-lojban|cel-gaulish|no-bok|no-nyn' + '|zh-(?:guoyu|hakka|min|min-nan|xiang))';

// grandfathered = irregular           ; non-redundant tags registered
//               / regular             ; during the RFC 3066 era
var grandfathered = '(?:' + irregular + '|' + regular + ')';

// langtag       = language
//                 ["-" script]
//                 ["-" region]
//                 *("-" variant)
//                 *("-" extension)
//                 ["-" privateuse]
var langtag = language + '(?:-' + script + ')?(?:-' + region + ')?(?:-' + variant + ')*(?:-' + extension + ')*(?:-' + privateuse + ')?';

// Language-Tag  = langtag             ; normal language tags
//               / privateuse          ; private use tag
//               / grandfathered       ; grandfathered tags
var expBCP47Syntax = RegExp('^(?:' + langtag + '|' + privateuse + '|' + grandfathered + ')$', 'i');

// Match duplicate variants in a language tag
var expVariantDupes = RegExp('^(?!x).*?-(' + variant + ')-(?:\\w{4,8}-(?!x-))*\\1\\b', 'i');

// Match duplicate singletons in a language tag (except in private use)
var expSingletonDupes = RegExp('^(?!x).*?-(' + singleton + ')-(?:\\w+-(?!x-))*\\1\\b', 'i');

// Match all extension sequences
var expExtSequences = RegExp('-' + extension, 'ig');

// Default locale is the first-added locale data for us
var defaultLocale = void 0;
function setDefaultLocale(locale) {
    defaultLocale = locale;
}

// IANA Subtag Registry redundant tag and subtag maps
var redundantTags = {
    tags: {
        "art-lojban": "jbo",
        "i-ami": "ami",
        "i-bnn": "bnn",
        "i-hak": "hak",
        "i-klingon": "tlh",
        "i-lux": "lb",
        "i-navajo": "nv",
        "i-pwn": "pwn",
        "i-tao": "tao",
        "i-tay": "tay",
        "i-tsu": "tsu",
        "no-bok": "nb",
        "no-nyn": "nn",
        "sgn-BE-FR": "sfb",
        "sgn-BE-NL": "vgt",
        "sgn-CH-DE": "sgg",
        "zh-guoyu": "cmn",
        "zh-hakka": "hak",
        "zh-min-nan": "nan",
        "zh-xiang": "hsn",
        "sgn-BR": "bzs",
        "sgn-CO": "csn",
        "sgn-DE": "gsg",
        "sgn-DK": "dsl",
        "sgn-ES": "ssp",
        "sgn-FR": "fsl",
        "sgn-GB": "bfi",
        "sgn-GR": "gss",
        "sgn-IE": "isg",
        "sgn-IT": "ise",
        "sgn-JP": "jsl",
        "sgn-MX": "mfs",
        "sgn-NI": "ncs",
        "sgn-NL": "dse",
        "sgn-NO": "nsl",
        "sgn-PT": "psr",
        "sgn-SE": "swl",
        "sgn-US": "ase",
        "sgn-ZA": "sfs",
        "zh-cmn": "cmn",
        "zh-cmn-Hans": "cmn-Hans",
        "zh-cmn-Hant": "cmn-Hant",
        "zh-gan": "gan",
        "zh-wuu": "wuu",
        "zh-yue": "yue"
    },
    subtags: {
        BU: "MM",
        DD: "DE",
        FX: "FR",
        TP: "TL",
        YD: "YE",
        ZR: "CD",
        heploc: "alalc97",
        'in': "id",
        iw: "he",
        ji: "yi",
        jw: "jv",
        mo: "ro",
        ayx: "nun",
        bjd: "drl",
        ccq: "rki",
        cjr: "mom",
        cka: "cmr",
        cmk: "xch",
        drh: "khk",
        drw: "prs",
        gav: "dev",
        hrr: "jal",
        ibi: "opa",
        kgh: "kml",
        lcq: "ppr",
        mst: "mry",
        myt: "mry",
        sca: "hle",
        tie: "ras",
        tkk: "twm",
        tlw: "weo",
        tnf: "prs",
        ybd: "rki",
        yma: "lrr"
    },
    extLang: {
        aao: ["aao", "ar"],
        abh: ["abh", "ar"],
        abv: ["abv", "ar"],
        acm: ["acm", "ar"],
        acq: ["acq", "ar"],
        acw: ["acw", "ar"],
        acx: ["acx", "ar"],
        acy: ["acy", "ar"],
        adf: ["adf", "ar"],
        ads: ["ads", "sgn"],
        aeb: ["aeb", "ar"],
        aec: ["aec", "ar"],
        aed: ["aed", "sgn"],
        aen: ["aen", "sgn"],
        afb: ["afb", "ar"],
        afg: ["afg", "sgn"],
        ajp: ["ajp", "ar"],
        apc: ["apc", "ar"],
        apd: ["apd", "ar"],
        arb: ["arb", "ar"],
        arq: ["arq", "ar"],
        ars: ["ars", "ar"],
        ary: ["ary", "ar"],
        arz: ["arz", "ar"],
        ase: ["ase", "sgn"],
        asf: ["asf", "sgn"],
        asp: ["asp", "sgn"],
        asq: ["asq", "sgn"],
        asw: ["asw", "sgn"],
        auz: ["auz", "ar"],
        avl: ["avl", "ar"],
        ayh: ["ayh", "ar"],
        ayl: ["ayl", "ar"],
        ayn: ["ayn", "ar"],
        ayp: ["ayp", "ar"],
        bbz: ["bbz", "ar"],
        bfi: ["bfi", "sgn"],
        bfk: ["bfk", "sgn"],
        bjn: ["bjn", "ms"],
        bog: ["bog", "sgn"],
        bqn: ["bqn", "sgn"],
        bqy: ["bqy", "sgn"],
        btj: ["btj", "ms"],
        bve: ["bve", "ms"],
        bvl: ["bvl", "sgn"],
        bvu: ["bvu", "ms"],
        bzs: ["bzs", "sgn"],
        cdo: ["cdo", "zh"],
        cds: ["cds", "sgn"],
        cjy: ["cjy", "zh"],
        cmn: ["cmn", "zh"],
        coa: ["coa", "ms"],
        cpx: ["cpx", "zh"],
        csc: ["csc", "sgn"],
        csd: ["csd", "sgn"],
        cse: ["cse", "sgn"],
        csf: ["csf", "sgn"],
        csg: ["csg", "sgn"],
        csl: ["csl", "sgn"],
        csn: ["csn", "sgn"],
        csq: ["csq", "sgn"],
        csr: ["csr", "sgn"],
        czh: ["czh", "zh"],
        czo: ["czo", "zh"],
        doq: ["doq", "sgn"],
        dse: ["dse", "sgn"],
        dsl: ["dsl", "sgn"],
        dup: ["dup", "ms"],
        ecs: ["ecs", "sgn"],
        esl: ["esl", "sgn"],
        esn: ["esn", "sgn"],
        eso: ["eso", "sgn"],
        eth: ["eth", "sgn"],
        fcs: ["fcs", "sgn"],
        fse: ["fse", "sgn"],
        fsl: ["fsl", "sgn"],
        fss: ["fss", "sgn"],
        gan: ["gan", "zh"],
        gds: ["gds", "sgn"],
        gom: ["gom", "kok"],
        gse: ["gse", "sgn"],
        gsg: ["gsg", "sgn"],
        gsm: ["gsm", "sgn"],
        gss: ["gss", "sgn"],
        gus: ["gus", "sgn"],
        hab: ["hab", "sgn"],
        haf: ["haf", "sgn"],
        hak: ["hak", "zh"],
        hds: ["hds", "sgn"],
        hji: ["hji", "ms"],
        hks: ["hks", "sgn"],
        hos: ["hos", "sgn"],
        hps: ["hps", "sgn"],
        hsh: ["hsh", "sgn"],
        hsl: ["hsl", "sgn"],
        hsn: ["hsn", "zh"],
        icl: ["icl", "sgn"],
        ils: ["ils", "sgn"],
        inl: ["inl", "sgn"],
        ins: ["ins", "sgn"],
        ise: ["ise", "sgn"],
        isg: ["isg", "sgn"],
        isr: ["isr", "sgn"],
        jak: ["jak", "ms"],
        jax: ["jax", "ms"],
        jcs: ["jcs", "sgn"],
        jhs: ["jhs", "sgn"],
        jls: ["jls", "sgn"],
        jos: ["jos", "sgn"],
        jsl: ["jsl", "sgn"],
        jus: ["jus", "sgn"],
        kgi: ["kgi", "sgn"],
        knn: ["knn", "kok"],
        kvb: ["kvb", "ms"],
        kvk: ["kvk", "sgn"],
        kvr: ["kvr", "ms"],
        kxd: ["kxd", "ms"],
        lbs: ["lbs", "sgn"],
        lce: ["lce", "ms"],
        lcf: ["lcf", "ms"],
        liw: ["liw", "ms"],
        lls: ["lls", "sgn"],
        lsg: ["lsg", "sgn"],
        lsl: ["lsl", "sgn"],
        lso: ["lso", "sgn"],
        lsp: ["lsp", "sgn"],
        lst: ["lst", "sgn"],
        lsy: ["lsy", "sgn"],
        ltg: ["ltg", "lv"],
        lvs: ["lvs", "lv"],
        lzh: ["lzh", "zh"],
        max: ["max", "ms"],
        mdl: ["mdl", "sgn"],
        meo: ["meo", "ms"],
        mfa: ["mfa", "ms"],
        mfb: ["mfb", "ms"],
        mfs: ["mfs", "sgn"],
        min: ["min", "ms"],
        mnp: ["mnp", "zh"],
        mqg: ["mqg", "ms"],
        mre: ["mre", "sgn"],
        msd: ["msd", "sgn"],
        msi: ["msi", "ms"],
        msr: ["msr", "sgn"],
        mui: ["mui", "ms"],
        mzc: ["mzc", "sgn"],
        mzg: ["mzg", "sgn"],
        mzy: ["mzy", "sgn"],
        nan: ["nan", "zh"],
        nbs: ["nbs", "sgn"],
        ncs: ["ncs", "sgn"],
        nsi: ["nsi", "sgn"],
        nsl: ["nsl", "sgn"],
        nsp: ["nsp", "sgn"],
        nsr: ["nsr", "sgn"],
        nzs: ["nzs", "sgn"],
        okl: ["okl", "sgn"],
        orn: ["orn", "ms"],
        ors: ["ors", "ms"],
        pel: ["pel", "ms"],
        pga: ["pga", "ar"],
        pks: ["pks", "sgn"],
        prl: ["prl", "sgn"],
        prz: ["prz", "sgn"],
        psc: ["psc", "sgn"],
        psd: ["psd", "sgn"],
        pse: ["pse", "ms"],
        psg: ["psg", "sgn"],
        psl: ["psl", "sgn"],
        pso: ["pso", "sgn"],
        psp: ["psp", "sgn"],
        psr: ["psr", "sgn"],
        pys: ["pys", "sgn"],
        rms: ["rms", "sgn"],
        rsi: ["rsi", "sgn"],
        rsl: ["rsl", "sgn"],
        sdl: ["sdl", "sgn"],
        sfb: ["sfb", "sgn"],
        sfs: ["sfs", "sgn"],
        sgg: ["sgg", "sgn"],
        sgx: ["sgx", "sgn"],
        shu: ["shu", "ar"],
        slf: ["slf", "sgn"],
        sls: ["sls", "sgn"],
        sqk: ["sqk", "sgn"],
        sqs: ["sqs", "sgn"],
        ssh: ["ssh", "ar"],
        ssp: ["ssp", "sgn"],
        ssr: ["ssr", "sgn"],
        svk: ["svk", "sgn"],
        swc: ["swc", "sw"],
        swh: ["swh", "sw"],
        swl: ["swl", "sgn"],
        syy: ["syy", "sgn"],
        tmw: ["tmw", "ms"],
        tse: ["tse", "sgn"],
        tsm: ["tsm", "sgn"],
        tsq: ["tsq", "sgn"],
        tss: ["tss", "sgn"],
        tsy: ["tsy", "sgn"],
        tza: ["tza", "sgn"],
        ugn: ["ugn", "sgn"],
        ugy: ["ugy", "sgn"],
        ukl: ["ukl", "sgn"],
        uks: ["uks", "sgn"],
        urk: ["urk", "ms"],
        uzn: ["uzn", "uz"],
        uzs: ["uzs", "uz"],
        vgt: ["vgt", "sgn"],
        vkk: ["vkk", "ms"],
        vkt: ["vkt", "ms"],
        vsi: ["vsi", "sgn"],
        vsl: ["vsl", "sgn"],
        vsv: ["vsv", "sgn"],
        wuu: ["wuu", "zh"],
        xki: ["xki", "sgn"],
        xml: ["xml", "sgn"],
        xmm: ["xmm", "ms"],
        xms: ["xms", "sgn"],
        yds: ["yds", "sgn"],
        ysl: ["ysl", "sgn"],
        yue: ["yue", "zh"],
        zib: ["zib", "sgn"],
        zlm: ["zlm", "ms"],
        zmi: ["zmi", "ms"],
        zsl: ["zsl", "sgn"],
        zsm: ["zsm", "ms"]
    }
};

/**
 * Convert only a-z to uppercase as per section 6.1 of the spec
 */
function toLatinUpperCase(str) {
    var i = str.length;

    while (i--) {
        var ch = str.charAt(i);

        if (ch >= "a" && ch <= "z") str = str.slice(0, i) + ch.toUpperCase() + str.slice(i + 1);
    }

    return str;
}

/**
 * The IsStructurallyValidLanguageTag abstract operation verifies that the locale
 * argument (which must be a String value)
 *
 * - represents a well-formed BCP 47 language tag as specified in RFC 5646 section
 *   2.1, or successor,
 * - does not include duplicate variant subtags, and
 * - does not include duplicate singleton subtags.
 *
 * The abstract operation returns true if locale can be generated from the ABNF
 * grammar in section 2.1 of the RFC, starting with Language-Tag, and does not
 * contain duplicate variant or singleton subtags (other than as a private use
 * subtag). It returns false otherwise. Terminal value characters in the grammar are
 * interpreted as the Unicode equivalents of the ASCII octet values given.
 */
function /* 6.2.2 */IsStructurallyValidLanguageTag(locale) {
    // represents a well-formed BCP 47 language tag as specified in RFC 5646
    if (!expBCP47Syntax.test(locale)) return false;

    // does not include duplicate variant subtags, and
    if (expVariantDupes.test(locale)) return false;

    // does not include duplicate singleton subtags.
    if (expSingletonDupes.test(locale)) return false;

    return true;
}

/**
 * The CanonicalizeLanguageTag abstract operation returns the canonical and case-
 * regularized form of the locale argument (which must be a String value that is
 * a structurally valid BCP 47 language tag as verified by the
 * IsStructurallyValidLanguageTag abstract operation). It takes the steps
 * specified in RFC 5646 section 4.5, or successor, to bring the language tag
 * into canonical form, and to regularize the case of the subtags, but does not
 * take the steps to bring a language tag into “extlang form” and to reorder
 * variant subtags.

 * The specifications for extensions to BCP 47 language tags, such as RFC 6067,
 * may include canonicalization rules for the extension subtag sequences they
 * define that go beyond the canonicalization rules of RFC 5646 section 4.5.
 * Implementations are allowed, but not required, to apply these additional rules.
 */
function /* 6.2.3 */CanonicalizeLanguageTag(locale) {
    var match = void 0,
        parts = void 0;

    // A language tag is in 'canonical form' when the tag is well-formed
    // according to the rules in Sections 2.1 and 2.2

    // Section 2.1 says all subtags use lowercase...
    locale = locale.toLowerCase();

    // ...with 2 exceptions: 'two-letter and four-letter subtags that neither
    // appear at the start of the tag nor occur after singletons.  Such two-letter
    // subtags are all uppercase (as in the tags "en-CA-x-ca" or "sgn-BE-FR") and
    // four-letter subtags are titlecase (as in the tag "az-Latn-x-latn").
    parts = locale.split('-');
    for (var i = 1, max = parts.length; i < max; i++) {
        // Two-letter subtags are all uppercase
        if (parts[i].length === 2) parts[i] = parts[i].toUpperCase();

        // Four-letter subtags are titlecase
        else if (parts[i].length === 4) parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].slice(1);

            // Is it a singleton?
            else if (parts[i].length === 1 && parts[i] !== 'x') break;
    }
    locale = arrJoin.call(parts, '-');

    // The steps laid out in RFC 5646 section 4.5 are as follows:

    // 1.  Extension sequences are ordered into case-insensitive ASCII order
    //     by singleton subtag.
    if ((match = locale.match(expExtSequences)) && match.length > 1) {
        // The built-in sort() sorts by ASCII order, so use that
        match.sort();

        // Replace all extensions with the joined, sorted array
        locale = locale.replace(RegExp('(?:' + expExtSequences.source + ')+', 'i'), arrJoin.call(match, ''));
    }

    // 2.  Redundant or grandfathered tags are replaced by their 'Preferred-
    //     Value', if there is one.
    if (hop.call(redundantTags.tags, locale)) locale = redundantTags.tags[locale];

    // 3.  Subtags are replaced by their 'Preferred-Value', if there is one.
    //     For extlangs, the original primary language subtag is also
    //     replaced if there is a primary language subtag in the 'Preferred-
    //     Value'.
    parts = locale.split('-');

    for (var _i = 1, _max = parts.length; _i < _max; _i++) {
        if (hop.call(redundantTags.subtags, parts[_i])) parts[_i] = redundantTags.subtags[parts[_i]];else if (hop.call(redundantTags.extLang, parts[_i])) {
            parts[_i] = redundantTags.extLang[parts[_i]][0];

            // For extlang tags, the prefix needs to be removed if it is redundant
            if (_i === 1 && redundantTags.extLang[parts[1]][1] === parts[0]) {
                parts = arrSlice.call(parts, _i++);
                _max -= 1;
            }
        }
    }

    return arrJoin.call(parts, '-');
}

/**
 * The DefaultLocale abstract operation returns a String value representing the
 * structurally valid (6.2.2) and canonicalized (6.2.3) BCP 47 language tag for the
 * host environment’s current locale.
 */
function /* 6.2.4 */DefaultLocale() {
    return defaultLocale;
}

// Sect 6.3 Currency Codes
// =======================

var expCurrencyCode = /^[A-Z]{3}$/;

/**
 * The IsWellFormedCurrencyCode abstract operation verifies that the currency argument
 * (after conversion to a String value) represents a well-formed 3-letter ISO currency
 * code. The following steps are taken:
 */
function /* 6.3.1 */IsWellFormedCurrencyCode(currency) {
    // 1. Let `c` be ToString(currency)
    var c = String(currency);

    // 2. Let `normalized` be the result of mapping c to upper case as described
    //    in 6.1.
    var normalized = toLatinUpperCase(c);

    // 3. If the string length of normalized is not 3, return false.
    // 4. If normalized contains any character that is not in the range "A" to "Z"
    //    (U+0041 to U+005A), return false.
    if (expCurrencyCode.test(normalized) === false) return false;

    // 5. Return true
    return true;
}

var expUnicodeExSeq = /-u(?:-[0-9a-z]{2,8})+/gi; // See `extension` below

function /* 9.2.1 */CanonicalizeLocaleList(locales) {
    // The abstract operation CanonicalizeLocaleList takes the following steps:

    // 1. If locales is undefined, then a. Return a new empty List
    if (locales === undefined) return new List();

    // 2. Let seen be a new empty List.
    var seen = new List();

    // 3. If locales is a String value, then
    //    a. Let locales be a new array created as if by the expression new
    //    Array(locales) where Array is the standard built-in constructor with
    //    that name and locales is the value of locales.
    locales = typeof locales === 'string' ? [locales] : locales;

    // 4. Let O be ToObject(locales).
    var O = toObject(locales);

    // 5. Let lenValue be the result of calling the [[Get]] internal method of
    //    O with the argument "length".
    // 6. Let len be ToUint32(lenValue).
    var len = O.length;

    // 7. Let k be 0.
    var k = 0;

    // 8. Repeat, while k < len
    while (k < len) {
        // a. Let Pk be ToString(k).
        var Pk = String(k);

        // b. Let kPresent be the result of calling the [[HasProperty]] internal
        //    method of O with argument Pk.
        var kPresent = Pk in O;

        // c. If kPresent is true, then
        if (kPresent) {
            // i. Let kValue be the result of calling the [[Get]] internal
            //     method of O with argument Pk.
            var kValue = O[Pk];

            // ii. If the type of kValue is not String or Object, then throw a
            //     TypeError exception.
            if (kValue === null || typeof kValue !== 'string' && (typeof kValue === "undefined" ? "undefined" : babelHelpers["typeof"](kValue)) !== 'object') throw new TypeError('String or Object type expected');

            // iii. Let tag be ToString(kValue).
            var tag = String(kValue);

            // iv. If the result of calling the abstract operation
            //     IsStructurallyValidLanguageTag (defined in 6.2.2), passing tag as
            //     the argument, is false, then throw a RangeError exception.
            if (!IsStructurallyValidLanguageTag(tag)) throw new RangeError("'" + tag + "' is not a structurally valid language tag");

            // v. Let tag be the result of calling the abstract operation
            //    CanonicalizeLanguageTag (defined in 6.2.3), passing tag as the
            //    argument.
            tag = CanonicalizeLanguageTag(tag);

            // vi. If tag is not an element of seen, then append tag as the last
            //     element of seen.
            if (arrIndexOf.call(seen, tag) === -1) arrPush.call(seen, tag);
        }

        // d. Increase k by 1.
        k++;
    }

    // 9. Return seen.
    return seen;
}

/**
 * The BestAvailableLocale abstract operation compares the provided argument
 * locale, which must be a String value with a structurally valid and
 * canonicalized BCP 47 language tag, against the locales in availableLocales and
 * returns either the longest non-empty prefix of locale that is an element of
 * availableLocales, or undefined if there is no such element. It uses the
 * fallback mechanism of RFC 4647, section 3.4. The following steps are taken:
 */
function /* 9.2.2 */BestAvailableLocale(availableLocales, locale) {
    // 1. Let candidate be locale
    var candidate = locale;

    // 2. Repeat
    while (candidate) {
        // a. If availableLocales contains an element equal to candidate, then return
        // candidate.
        if (arrIndexOf.call(availableLocales, candidate) > -1) return candidate;

        // b. Let pos be the character index of the last occurrence of "-"
        // (U+002D) within candidate. If that character does not occur, return
        // undefined.
        var pos = candidate.lastIndexOf('-');

        if (pos < 0) return;

        // c. If pos ≥ 2 and the character "-" occurs at index pos-2 of candidate,
        //    then decrease pos by 2.
        if (pos >= 2 && candidate.charAt(pos - 2) === '-') pos -= 2;

        // d. Let candidate be the substring of candidate from position 0, inclusive,
        //    to position pos, exclusive.
        candidate = candidate.substring(0, pos);
    }
}

/**
 * The LookupMatcher abstract operation compares requestedLocales, which must be
 * a List as returned by CanonicalizeLocaleList, against the locales in
 * availableLocales and determines the best available language to meet the
 * request. The following steps are taken:
 */
function /* 9.2.3 */LookupMatcher(availableLocales, requestedLocales) {
    // 1. Let i be 0.
    var i = 0;

    // 2. Let len be the number of elements in requestedLocales.
    var len = requestedLocales.length;

    // 3. Let availableLocale be undefined.
    var availableLocale = void 0;

    var locale = void 0,
        noExtensionsLocale = void 0;

    // 4. Repeat while i < len and availableLocale is undefined:
    while (i < len && !availableLocale) {
        // a. Let locale be the element of requestedLocales at 0-origined list
        //    position i.
        locale = requestedLocales[i];

        // b. Let noExtensionsLocale be the String value that is locale with all
        //    Unicode locale extension sequences removed.
        noExtensionsLocale = String(locale).replace(expUnicodeExSeq, '');

        // c. Let availableLocale be the result of calling the
        //    BestAvailableLocale abstract operation (defined in 9.2.2) with
        //    arguments availableLocales and noExtensionsLocale.
        availableLocale = BestAvailableLocale(availableLocales, noExtensionsLocale);

        // d. Increase i by 1.
        i++;
    }

    // 5. Let result be a new Record.
    var result = new Record();

    // 6. If availableLocale is not undefined, then
    if (availableLocale !== undefined) {
        // a. Set result.[[locale]] to availableLocale.
        result['[[locale]]'] = availableLocale;

        // b. If locale and noExtensionsLocale are not the same String value, then
        if (String(locale) !== String(noExtensionsLocale)) {
            // i. Let extension be the String value consisting of the first
            //    substring of locale that is a Unicode locale extension sequence.
            var extension = locale.match(expUnicodeExSeq)[0];

            // ii. Let extensionIndex be the character position of the initial
            //     "-" of the first Unicode locale extension sequence within locale.
            var extensionIndex = locale.indexOf('-u-');

            // iii. Set result.[[extension]] to extension.
            result['[[extension]]'] = extension;

            // iv. Set result.[[extensionIndex]] to extensionIndex.
            result['[[extensionIndex]]'] = extensionIndex;
        }
    }
    // 7. Else
    else
        // a. Set result.[[locale]] to the value returned by the DefaultLocale abstract
        //    operation (defined in 6.2.4).
        result['[[locale]]'] = DefaultLocale();

    // 8. Return result
    return result;
}

/**
 * The BestFitMatcher abstract operation compares requestedLocales, which must be
 * a List as returned by CanonicalizeLocaleList, against the locales in
 * availableLocales and determines the best available language to meet the
 * request. The algorithm is implementation dependent, but should produce results
 * that a typical user of the requested locales would perceive as at least as
 * good as those produced by the LookupMatcher abstract operation. Options
 * specified through Unicode locale extension sequences must be ignored by the
 * algorithm. Information about such subsequences is returned separately.
 * The abstract operation returns a record with a [[locale]] field, whose value
 * is the language tag of the selected locale, which must be an element of
 * availableLocales. If the language tag of the request locale that led to the
 * selected locale contained a Unicode locale extension sequence, then the
 * returned record also contains an [[extension]] field whose value is the first
 * Unicode locale extension sequence, and an [[extensionIndex]] field whose value
 * is the index of the first Unicode locale extension sequence within the request
 * locale language tag.
 */
function /* 9.2.4 */BestFitMatcher(availableLocales, requestedLocales) {
    return LookupMatcher(availableLocales, requestedLocales);
}

/**
 * The ResolveLocale abstract operation compares a BCP 47 language priority list
 * requestedLocales against the locales in availableLocales and determines the
 * best available language to meet the request. availableLocales and
 * requestedLocales must be provided as List values, options as a Record.
 */
function /* 9.2.5 */ResolveLocale(availableLocales, requestedLocales, options, relevantExtensionKeys, localeData) {
    if (availableLocales.length === 0) {
        throw new ReferenceError('No locale data has been provided for this object yet.');
    }

    // The following steps are taken:
    // 1. Let matcher be the value of options.[[localeMatcher]].
    var matcher = options['[[localeMatcher]]'];

    var r = void 0;

    // 2. If matcher is "lookup", then
    if (matcher === 'lookup')
        // a. Let r be the result of calling the LookupMatcher abstract operation
        //    (defined in 9.2.3) with arguments availableLocales and
        //    requestedLocales.
        r = LookupMatcher(availableLocales, requestedLocales);

        // 3. Else
    else
        // a. Let r be the result of calling the BestFitMatcher abstract
        //    operation (defined in 9.2.4) with arguments availableLocales and
        //    requestedLocales.
        r = BestFitMatcher(availableLocales, requestedLocales);

    // 4. Let foundLocale be the value of r.[[locale]].
    var foundLocale = r['[[locale]]'];

    var extensionSubtags = void 0,
        extensionSubtagsLength = void 0;

    // 5. If r has an [[extension]] field, then
    if (hop.call(r, '[[extension]]')) {
        // a. Let extension be the value of r.[[extension]].
        var extension = r['[[extension]]'];
        // b. Let split be the standard built-in function object defined in ES5,
        //    15.5.4.14.
        var split = String.prototype.split;
        // c. Let extensionSubtags be the result of calling the [[Call]] internal
        //    method of split with extension as the this value and an argument
        //    list containing the single item "-".
        extensionSubtags = split.call(extension, '-');
        // d. Let extensionSubtagsLength be the result of calling the [[Get]]
        //    internal method of extensionSubtags with argument "length".
        extensionSubtagsLength = extensionSubtags.length;
    }

    // 6. Let result be a new Record.
    var result = new Record();

    // 7. Set result.[[dataLocale]] to foundLocale.
    result['[[dataLocale]]'] = foundLocale;

    // 8. Let supportedExtension be "-u".
    var supportedExtension = '-u';
    // 9. Let i be 0.
    var i = 0;
    // 10. Let len be the result of calling the [[Get]] internal method of
    //     relevantExtensionKeys with argument "length".
    var len = relevantExtensionKeys.length;

    // 11 Repeat while i < len:
    while (i < len) {
        // a. Let key be the result of calling the [[Get]] internal method of
        //    relevantExtensionKeys with argument ToString(i).
        var key = relevantExtensionKeys[i];
        // b. Let foundLocaleData be the result of calling the [[Get]] internal
        //    method of localeData with the argument foundLocale.
        var foundLocaleData = localeData[foundLocale];
        // c. Let keyLocaleData be the result of calling the [[Get]] internal
        //    method of foundLocaleData with the argument key.
        var keyLocaleData = foundLocaleData[key];
        // d. Let value be the result of calling the [[Get]] internal method of
        //    keyLocaleData with argument "0".
        var value = keyLocaleData['0'];
        // e. Let supportedExtensionAddition be "".
        var supportedExtensionAddition = '';
        // f. Let indexOf be the standard built-in function object defined in
        //    ES5, 15.4.4.14.
        var indexOf = arrIndexOf;

        // g. If extensionSubtags is not undefined, then
        if (extensionSubtags !== undefined) {
            // i. Let keyPos be the result of calling the [[Call]] internal
            //    method of indexOf with extensionSubtags as the this value and
            // an argument list containing the single item key.
            var keyPos = indexOf.call(extensionSubtags, key);

            // ii. If keyPos ≠ -1, then
            if (keyPos !== -1) {
                // 1. If keyPos + 1 < extensionSubtagsLength and the length of the
                //    result of calling the [[Get]] internal method of
                //    extensionSubtags with argument ToString(keyPos +1) is greater
                //    than 2, then
                if (keyPos + 1 < extensionSubtagsLength && extensionSubtags[keyPos + 1].length > 2) {
                    // a. Let requestedValue be the result of calling the [[Get]]
                    //    internal method of extensionSubtags with argument
                    //    ToString(keyPos + 1).
                    var requestedValue = extensionSubtags[keyPos + 1];
                    // b. Let valuePos be the result of calling the [[Call]]
                    //    internal method of indexOf with keyLocaleData as the
                    //    this value and an argument list containing the single
                    //    item requestedValue.
                    var valuePos = indexOf.call(keyLocaleData, requestedValue);

                    // c. If valuePos ≠ -1, then
                    if (valuePos !== -1) {
                        // i. Let value be requestedValue.
                        value = requestedValue,
                        // ii. Let supportedExtensionAddition be the
                        //     concatenation of "-", key, "-", and value.
                        supportedExtensionAddition = '-' + key + '-' + value;
                    }
                }
                // 2. Else
                else {
                        // a. Let valuePos be the result of calling the [[Call]]
                        // internal method of indexOf with keyLocaleData as the this
                        // value and an argument list containing the single item
                        // "true".
                        var _valuePos = indexOf(keyLocaleData, 'true');

                        // b. If valuePos ≠ -1, then
                        if (_valuePos !== -1)
                            // i. Let value be "true".
                            value = 'true';
                    }
            }
        }
        // h. If options has a field [[<key>]], then
        if (hop.call(options, '[[' + key + ']]')) {
            // i. Let optionsValue be the value of options.[[<key>]].
            var optionsValue = options['[[' + key + ']]'];

            // ii. If the result of calling the [[Call]] internal method of indexOf
            //     with keyLocaleData as the this value and an argument list
            //     containing the single item optionsValue is not -1, then
            if (indexOf.call(keyLocaleData, optionsValue) !== -1) {
                // 1. If optionsValue is not equal to value, then
                if (optionsValue !== value) {
                    // a. Let value be optionsValue.
                    value = optionsValue;
                    // b. Let supportedExtensionAddition be "".
                    supportedExtensionAddition = '';
                }
            }
        }
        // i. Set result.[[<key>]] to value.
        result['[[' + key + ']]'] = value;

        // j. Append supportedExtensionAddition to supportedExtension.
        supportedExtension += supportedExtensionAddition;

        // k. Increase i by 1.
        i++;
    }
    // 12. If the length of supportedExtension is greater than 2, then
    if (supportedExtension.length > 2) {
        // a.
        var privateIndex = foundLocale.indexOf("-x-");
        // b.
        if (privateIndex === -1) {
            // i.
            foundLocale = foundLocale + supportedExtension;
        }
        // c.
        else {
                // i.
                var preExtension = foundLocale.substring(0, privateIndex);
                // ii.
                var postExtension = foundLocale.substring(privateIndex);
                // iii.
                foundLocale = preExtension + supportedExtension + postExtension;
            }
        // d. asserting - skipping
        // e.
        foundLocale = CanonicalizeLanguageTag(foundLocale);
    }
    // 13. Set result.[[locale]] to foundLocale.
    result['[[locale]]'] = foundLocale;

    // 14. Return result.
    return result;
}

/**
 * The LookupSupportedLocales abstract operation returns the subset of the
 * provided BCP 47 language priority list requestedLocales for which
 * availableLocales has a matching locale when using the BCP 47 Lookup algorithm.
 * Locales appear in the same order in the returned list as in requestedLocales.
 * The following steps are taken:
 */
function /* 9.2.6 */LookupSupportedLocales(availableLocales, requestedLocales) {
    // 1. Let len be the number of elements in requestedLocales.
    var len = requestedLocales.length;
    // 2. Let subset be a new empty List.
    var subset = new List();
    // 3. Let k be 0.
    var k = 0;

    // 4. Repeat while k < len
    while (k < len) {
        // a. Let locale be the element of requestedLocales at 0-origined list
        //    position k.
        var locale = requestedLocales[k];
        // b. Let noExtensionsLocale be the String value that is locale with all
        //    Unicode locale extension sequences removed.
        var noExtensionsLocale = String(locale).replace(expUnicodeExSeq, '');
        // c. Let availableLocale be the result of calling the
        //    BestAvailableLocale abstract operation (defined in 9.2.2) with
        //    arguments availableLocales and noExtensionsLocale.
        var availableLocale = BestAvailableLocale(availableLocales, noExtensionsLocale);

        // d. If availableLocale is not undefined, then append locale to the end of
        //    subset.
        if (availableLocale !== undefined) arrPush.call(subset, locale);

        // e. Increment k by 1.
        k++;
    }

    // 5. Let subsetArray be a new Array object whose elements are the same
    //    values in the same order as the elements of subset.
    var subsetArray = arrSlice.call(subset);

    // 6. Return subsetArray.
    return subsetArray;
}

/**
 * The BestFitSupportedLocales abstract operation returns the subset of the
 * provided BCP 47 language priority list requestedLocales for which
 * availableLocales has a matching locale when using the Best Fit Matcher
 * algorithm. Locales appear in the same order in the returned list as in
 * requestedLocales. The steps taken are implementation dependent.
 */
function /*9.2.7 */BestFitSupportedLocales(availableLocales, requestedLocales) {
    // ###TODO: implement this function as described by the specification###
    return LookupSupportedLocales(availableLocales, requestedLocales);
}

/**
 * The SupportedLocales abstract operation returns the subset of the provided BCP
 * 47 language priority list requestedLocales for which availableLocales has a
 * matching locale. Two algorithms are available to match the locales: the Lookup
 * algorithm described in RFC 4647 section 3.4, and an implementation dependent
 * best-fit algorithm. Locales appear in the same order in the returned list as
 * in requestedLocales. The following steps are taken:
 */
function /*9.2.8 */SupportedLocales(availableLocales, requestedLocales, options) {
    var matcher = void 0,
        subset = void 0;

    // 1. If options is not undefined, then
    if (options !== undefined) {
        // a. Let options be ToObject(options).
        options = new Record(toObject(options));
        // b. Let matcher be the result of calling the [[Get]] internal method of
        //    options with argument "localeMatcher".
        matcher = options.localeMatcher;

        // c. If matcher is not undefined, then
        if (matcher !== undefined) {
            // i. Let matcher be ToString(matcher).
            matcher = String(matcher);

            // ii. If matcher is not "lookup" or "best fit", then throw a RangeError
            //     exception.
            if (matcher !== 'lookup' && matcher !== 'best fit') throw new RangeError('matcher should be "lookup" or "best fit"');
        }
    }
    // 2. If matcher is undefined or "best fit", then
    if (matcher === undefined || matcher === 'best fit')
        // a. Let subset be the result of calling the BestFitSupportedLocales
        //    abstract operation (defined in 9.2.7) with arguments
        //    availableLocales and requestedLocales.
        subset = BestFitSupportedLocales(availableLocales, requestedLocales);
        // 3. Else
    else
        // a. Let subset be the result of calling the LookupSupportedLocales
        //    abstract operation (defined in 9.2.6) with arguments
        //    availableLocales and requestedLocales.
        subset = LookupSupportedLocales(availableLocales, requestedLocales);

    // 4. For each named own property name P of subset,
    for (var P in subset) {
        if (!hop.call(subset, P)) continue;

        // a. Let desc be the result of calling the [[GetOwnProperty]] internal
        //    method of subset with P.
        // b. Set desc.[[Writable]] to false.
        // c. Set desc.[[Configurable]] to false.
        // d. Call the [[DefineOwnProperty]] internal method of subset with P, desc,
        //    and true as arguments.
        defineProperty(subset, P, {
            writable: false, configurable: false, value: subset[P]
        });
    }
    // "Freeze" the array so no new elements can be added
    defineProperty(subset, 'length', { writable: false });

    // 5. Return subset
    return subset;
}

/**
 * The GetOption abstract operation extracts the value of the property named
 * property from the provided options object, converts it to the required type,
 * checks whether it is one of a List of allowed values, and fills in a fallback
 * value if necessary.
 */
function /*9.2.9 */GetOption(options, property, type, values, fallback) {
    // 1. Let value be the result of calling the [[Get]] internal method of
    //    options with argument property.
    var value = options[property];

    // 2. If value is not undefined, then
    if (value !== undefined) {
        // a. Assert: type is "boolean" or "string".
        // b. If type is "boolean", then let value be ToBoolean(value).
        // c. If type is "string", then let value be ToString(value).
        value = type === 'boolean' ? Boolean(value) : type === 'string' ? String(value) : value;

        // d. If values is not undefined, then
        if (values !== undefined) {
            // i. If values does not contain an element equal to value, then throw a
            //    RangeError exception.
            if (arrIndexOf.call(values, value) === -1) throw new RangeError("'" + value + "' is not an allowed value for `" + property + '`');
        }

        // e. Return value.
        return value;
    }
    // Else return fallback.
    return fallback;
}

/**
 * The GetNumberOption abstract operation extracts a property value from the
 * provided options object, converts it to a Number value, checks whether it is
 * in the allowed range, and fills in a fallback value if necessary.
 */
function /* 9.2.10 */GetNumberOption(options, property, minimum, maximum, fallback) {
    // 1. Let value be the result of calling the [[Get]] internal method of
    //    options with argument property.
    var value = options[property];

    // 2. If value is not undefined, then
    if (value !== undefined) {
        // a. Let value be ToNumber(value).
        value = Number(value);

        // b. If value is NaN or less than minimum or greater than maximum, throw a
        //    RangeError exception.
        if (isNaN(value) || value < minimum || value > maximum) throw new RangeError('Value is not a number or outside accepted range');

        // c. Return floor(value).
        return Math.floor(value);
    }
    // 3. Else return fallback.
    return fallback;
}

// 8 The Intl Object
var Intl = {};

// 8.2 Function Properties of the Intl Object

// 8.2.1
// @spec[tc39/ecma402/master/spec/intl.html]
// @clause[sec-intl.getcanonicallocales]
Intl.getCanonicalLocales = function (locales) {
    // 1. Let ll be ? CanonicalizeLocaleList(locales).
    var ll = CanonicalizeLocaleList(locales);
    // 2. Return CreateArrayFromList(ll).
    {
        var result = [];
        for (var code in ll) {
            result.push(ll[code]);
        }
        return result;
    }
};

// Currency minor units output from get-4217 grunt task, formatted
var currencyMinorUnits = {
    BHD: 3, BYR: 0, XOF: 0, BIF: 0, XAF: 0, CLF: 4, CLP: 0, KMF: 0, DJF: 0,
    XPF: 0, GNF: 0, ISK: 0, IQD: 3, JPY: 0, JOD: 3, KRW: 0, KWD: 3, LYD: 3,
    OMR: 3, PYG: 0, RWF: 0, TND: 3, UGX: 0, UYI: 0, VUV: 0, VND: 0
};

// Define the NumberFormat constructor internally so it cannot be tainted
function NumberFormatConstructor() {
    var locales = arguments[0];
    var options = arguments[1];

    if (!this || this === Intl) {
        return new Intl.NumberFormat(locales, options);
    }

    return InitializeNumberFormat(toObject(this), locales, options);
}

defineProperty(Intl, 'NumberFormat', {
    configurable: true,
    writable: true,
    value: NumberFormatConstructor
});

// Must explicitly set prototypes as unwritable
defineProperty(Intl.NumberFormat, 'prototype', {
    writable: false
});

/**
 * The abstract operation InitializeNumberFormat accepts the arguments
 * numberFormat (which must be an object), locales, and options. It initializes
 * numberFormat as a NumberFormat object.
 */
function /*11.1.1.1 */InitializeNumberFormat(numberFormat, locales, options) {
    // This will be a internal properties object if we're not already initialized
    var internal = getInternalProperties(numberFormat);

    // Create an object whose props can be used to restore the values of RegExp props
    var regexpState = createRegExpRestore();

    // 1. If numberFormat has an [[initializedIntlObject]] internal property with
    // value true, throw a TypeError exception.
    if (internal['[[initializedIntlObject]]'] === true) throw new TypeError('`this` object has already been initialized as an Intl object');

    // Need this to access the `internal` object
    defineProperty(numberFormat, '__getInternalProperties', {
        value: function value() {
            // NOTE: Non-standard, for internal use only
            if (arguments[0] === secret) return internal;
        }
    });

    // 2. Set the [[initializedIntlObject]] internal property of numberFormat to true.
    internal['[[initializedIntlObject]]'] = true;

    // 3. Let requestedLocales be the result of calling the CanonicalizeLocaleList
    //    abstract operation (defined in 9.2.1) with argument locales.
    var requestedLocales = CanonicalizeLocaleList(locales);

    // 4. If options is undefined, then
    if (options === undefined)
        // a. Let options be the result of creating a new object as if by the
        // expression new Object() where Object is the standard built-in constructor
        // with that name.
        options = {};

        // 5. Else
    else
        // a. Let options be ToObject(options).
        options = toObject(options);

    // 6. Let opt be a new Record.
    var opt = new Record(),


    // 7. Let matcher be the result of calling the GetOption abstract operation
    //    (defined in 9.2.9) with the arguments options, "localeMatcher", "string",
    //    a List containing the two String values "lookup" and "best fit", and
    //    "best fit".
    matcher = GetOption(options, 'localeMatcher', 'string', new List('lookup', 'best fit'), 'best fit');

    // 8. Set opt.[[localeMatcher]] to matcher.
    opt['[[localeMatcher]]'] = matcher;

    // 9. Let NumberFormat be the standard built-in object that is the initial value
    //    of Intl.NumberFormat.
    // 10. Let localeData be the value of the [[localeData]] internal property of
    //     NumberFormat.
    var localeData = internals.NumberFormat['[[localeData]]'];

    // 11. Let r be the result of calling the ResolveLocale abstract operation
    //     (defined in 9.2.5) with the [[availableLocales]] internal property of
    //     NumberFormat, requestedLocales, opt, the [[relevantExtensionKeys]]
    //     internal property of NumberFormat, and localeData.
    var r = ResolveLocale(internals.NumberFormat['[[availableLocales]]'], requestedLocales, opt, internals.NumberFormat['[[relevantExtensionKeys]]'], localeData);

    // 12. Set the [[locale]] internal property of numberFormat to the value of
    //     r.[[locale]].
    internal['[[locale]]'] = r['[[locale]]'];

    // 13. Set the [[numberingSystem]] internal property of numberFormat to the value
    //     of r.[[nu]].
    internal['[[numberingSystem]]'] = r['[[nu]]'];

    // The specification doesn't tell us to do this, but it's helpful later on
    internal['[[dataLocale]]'] = r['[[dataLocale]]'];

    // 14. Let dataLocale be the value of r.[[dataLocale]].
    var dataLocale = r['[[dataLocale]]'];

    // 15. Let s be the result of calling the GetOption abstract operation with the
    //     arguments options, "style", "string", a List containing the three String
    //     values "decimal", "percent", and "currency", and "decimal".
    var s = GetOption(options, 'style', 'string', new List('decimal', 'percent', 'currency'), 'decimal');

    // 16. Set the [[style]] internal property of numberFormat to s.
    internal['[[style]]'] = s;

    // 17. Let c be the result of calling the GetOption abstract operation with the
    //     arguments options, "currency", "string", undefined, and undefined.
    var c = GetOption(options, 'currency', 'string');

    // 18. If c is not undefined and the result of calling the
    //     IsWellFormedCurrencyCode abstract operation (defined in 6.3.1) with
    //     argument c is false, then throw a RangeError exception.
    if (c !== undefined && !IsWellFormedCurrencyCode(c)) throw new RangeError("'" + c + "' is not a valid currency code");

    // 19. If s is "currency" and c is undefined, throw a TypeError exception.
    if (s === 'currency' && c === undefined) throw new TypeError('Currency code is required when style is currency');

    var cDigits = void 0;

    // 20. If s is "currency", then
    if (s === 'currency') {
        // a. Let c be the result of converting c to upper case as specified in 6.1.
        c = c.toUpperCase();

        // b. Set the [[currency]] internal property of numberFormat to c.
        internal['[[currency]]'] = c;

        // c. Let cDigits be the result of calling the CurrencyDigits abstract
        //    operation (defined below) with argument c.
        cDigits = CurrencyDigits(c);
    }

    // 21. Let cd be the result of calling the GetOption abstract operation with the
    //     arguments options, "currencyDisplay", "string", a List containing the
    //     three String values "code", "symbol", and "name", and "symbol".
    var cd = GetOption(options, 'currencyDisplay', 'string', new List('code', 'symbol', 'name'), 'symbol');

    // 22. If s is "currency", then set the [[currencyDisplay]] internal property of
    //     numberFormat to cd.
    if (s === 'currency') internal['[[currencyDisplay]]'] = cd;

    // 23. Let mnid be the result of calling the GetNumberOption abstract operation
    //     (defined in 9.2.10) with arguments options, "minimumIntegerDigits", 1, 21,
    //     and 1.
    var mnid = GetNumberOption(options, 'minimumIntegerDigits', 1, 21, 1);

    // 24. Set the [[minimumIntegerDigits]] internal property of numberFormat to mnid.
    internal['[[minimumIntegerDigits]]'] = mnid;

    // 25. If s is "currency", then let mnfdDefault be cDigits; else let mnfdDefault
    //     be 0.
    var mnfdDefault = s === 'currency' ? cDigits : 0;

    // 26. Let mnfd be the result of calling the GetNumberOption abstract operation
    //     with arguments options, "minimumFractionDigits", 0, 20, and mnfdDefault.
    var mnfd = GetNumberOption(options, 'minimumFractionDigits', 0, 20, mnfdDefault);

    // 27. Set the [[minimumFractionDigits]] internal property of numberFormat to mnfd.
    internal['[[minimumFractionDigits]]'] = mnfd;

    // 28. If s is "currency", then let mxfdDefault be max(mnfd, cDigits); else if s
    //     is "percent", then let mxfdDefault be max(mnfd, 0); else let mxfdDefault
    //     be max(mnfd, 3).
    var mxfdDefault = s === 'currency' ? Math.max(mnfd, cDigits) : s === 'percent' ? Math.max(mnfd, 0) : Math.max(mnfd, 3);

    // 29. Let mxfd be the result of calling the GetNumberOption abstract operation
    //     with arguments options, "maximumFractionDigits", mnfd, 20, and mxfdDefault.
    var mxfd = GetNumberOption(options, 'maximumFractionDigits', mnfd, 20, mxfdDefault);

    // 30. Set the [[maximumFractionDigits]] internal property of numberFormat to mxfd.
    internal['[[maximumFractionDigits]]'] = mxfd;

    // 31. Let mnsd be the result of calling the [[Get]] internal method of options
    //     with argument "minimumSignificantDigits".
    var mnsd = options.minimumSignificantDigits;

    // 32. Let mxsd be the result of calling the [[Get]] internal method of options
    //     with argument "maximumSignificantDigits".
    var mxsd = options.maximumSignificantDigits;

    // 33. If mnsd is not undefined or mxsd is not undefined, then:
    if (mnsd !== undefined || mxsd !== undefined) {
        // a. Let mnsd be the result of calling the GetNumberOption abstract
        //    operation with arguments options, "minimumSignificantDigits", 1, 21,
        //    and 1.
        mnsd = GetNumberOption(options, 'minimumSignificantDigits', 1, 21, 1);

        // b. Let mxsd be the result of calling the GetNumberOption abstract
        //     operation with arguments options, "maximumSignificantDigits", mnsd,
        //     21, and 21.
        mxsd = GetNumberOption(options, 'maximumSignificantDigits', mnsd, 21, 21);

        // c. Set the [[minimumSignificantDigits]] internal property of numberFormat
        //    to mnsd, and the [[maximumSignificantDigits]] internal property of
        //    numberFormat to mxsd.
        internal['[[minimumSignificantDigits]]'] = mnsd;
        internal['[[maximumSignificantDigits]]'] = mxsd;
    }
    // 34. Let g be the result of calling the GetOption abstract operation with the
    //     arguments options, "useGrouping", "boolean", undefined, and true.
    var g = GetOption(options, 'useGrouping', 'boolean', undefined, true);

    // 35. Set the [[useGrouping]] internal property of numberFormat to g.
    internal['[[useGrouping]]'] = g;

    // 36. Let dataLocaleData be the result of calling the [[Get]] internal method of
    //     localeData with argument dataLocale.
    var dataLocaleData = localeData[dataLocale];

    // 37. Let patterns be the result of calling the [[Get]] internal method of
    //     dataLocaleData with argument "patterns".
    var patterns = dataLocaleData.patterns;

    // 38. Assert: patterns is an object (see 11.2.3)

    // 39. Let stylePatterns be the result of calling the [[Get]] internal method of
    //     patterns with argument s.
    var stylePatterns = patterns[s];

    // 40. Set the [[positivePattern]] internal property of numberFormat to the
    //     result of calling the [[Get]] internal method of stylePatterns with the
    //     argument "positivePattern".
    internal['[[positivePattern]]'] = stylePatterns.positivePattern;

    // 41. Set the [[negativePattern]] internal property of numberFormat to the
    //     result of calling the [[Get]] internal method of stylePatterns with the
    //     argument "negativePattern".
    internal['[[negativePattern]]'] = stylePatterns.negativePattern;

    // 42. Set the [[boundFormat]] internal property of numberFormat to undefined.
    internal['[[boundFormat]]'] = undefined;

    // 43. Set the [[initializedNumberFormat]] internal property of numberFormat to
    //     true.
    internal['[[initializedNumberFormat]]'] = true;

    // In ES3, we need to pre-bind the format() function
    if (es3) numberFormat.format = GetFormatNumber.call(numberFormat);

    // Restore the RegExp properties
    regexpState.exp.test(regexpState.input);

    // Return the newly initialised object
    return numberFormat;
}

function CurrencyDigits(currency) {
    // When the CurrencyDigits abstract operation is called with an argument currency
    // (which must be an upper case String value), the following steps are taken:

    // 1. If the ISO 4217 currency and funds code list contains currency as an
    // alphabetic code, then return the minor unit value corresponding to the
    // currency from the list; else return 2.
    return currencyMinorUnits[currency] !== undefined ? currencyMinorUnits[currency] : 2;
}

/* 11.2.3 */internals.NumberFormat = {
    '[[availableLocales]]': [],
    '[[relevantExtensionKeys]]': ['nu'],
    '[[localeData]]': {}
};

/**
 * When the supportedLocalesOf method of Intl.NumberFormat is called, the
 * following steps are taken:
 */
/* 11.2.2 */
defineProperty(Intl.NumberFormat, 'supportedLocalesOf', {
    configurable: true,
    writable: true,
    value: fnBind.call(function (locales) {
        // Bound functions only have the `this` value altered if being used as a constructor,
        // this lets us imitate a native function that has no constructor
        if (!hop.call(this, '[[availableLocales]]')) throw new TypeError('supportedLocalesOf() is not a constructor');

        // Create an object whose props can be used to restore the values of RegExp props
        var regexpState = createRegExpRestore(),


        // 1. If options is not provided, then let options be undefined.
        options = arguments[1],


        // 2. Let availableLocales be the value of the [[availableLocales]] internal
        //    property of the standard built-in object that is the initial value of
        //    Intl.NumberFormat.

        availableLocales = this['[[availableLocales]]'],


        // 3. Let requestedLocales be the result of calling the CanonicalizeLocaleList
        //    abstract operation (defined in 9.2.1) with argument locales.
        requestedLocales = CanonicalizeLocaleList(locales);

        // Restore the RegExp properties
        regexpState.exp.test(regexpState.input);

        // 4. Return the result of calling the SupportedLocales abstract operation
        //    (defined in 9.2.8) with arguments availableLocales, requestedLocales,
        //    and options.
        return SupportedLocales(availableLocales, requestedLocales, options);
    }, internals.NumberFormat)
});

/**
 * This named accessor property returns a function that formats a number
 * according to the effective locale and the formatting options of this
 * NumberFormat object.
 */
/* 11.3.2 */defineProperty(Intl.NumberFormat.prototype, 'format', {
    configurable: true,
    get: GetFormatNumber
});

function GetFormatNumber() {
    var internal = this !== null && babelHelpers["typeof"](this) === 'object' && getInternalProperties(this);

    // Satisfy test 11.3_b
    if (!internal || !internal['[[initializedNumberFormat]]']) throw new TypeError('`this` value for format() is not an initialized Intl.NumberFormat object.');

    // The value of the [[Get]] attribute is a function that takes the following
    // steps:

    // 1. If the [[boundFormat]] internal property of this NumberFormat object
    //    is undefined, then:
    if (internal['[[boundFormat]]'] === undefined) {
        // a. Let F be a Function object, with internal properties set as
        //    specified for built-in functions in ES5, 15, or successor, and the
        //    length property set to 1, that takes the argument value and
        //    performs the following steps:
        var F = function F(value) {
            // i. If value is not provided, then let value be undefined.
            // ii. Let x be ToNumber(value).
            // iii. Return the result of calling the FormatNumber abstract
            //      operation (defined below) with arguments this and x.
            return FormatNumber(this, /* x = */Number(value));
        };

        // b. Let bind be the standard built-in function object defined in ES5,
        //    15.3.4.5.
        // c. Let bf be the result of calling the [[Call]] internal method of
        //    bind with F as the this value and an argument list containing
        //    the single item this.
        var bf = fnBind.call(F, this);

        // d. Set the [[boundFormat]] internal property of this NumberFormat
        //    object to bf.
        internal['[[boundFormat]]'] = bf;
    }
    // Return the value of the [[boundFormat]] internal property of this
    // NumberFormat object.
    return internal['[[boundFormat]]'];
}

Intl.NumberFormat.prototype.formatToParts = function (value) {
    var internal = this !== null && babelHelpers["typeof"](this) === 'object' && getInternalProperties(this);
    if (!internal || !internal['[[initializedNumberFormat]]']) throw new TypeError('`this` value for formatToParts() is not an initialized Intl.NumberFormat object.');

    var x = Number(value);
    return FormatNumberToParts(this, x);
};

/*
 * @spec[stasm/ecma402/number-format-to-parts/spec/numberformat.html]
 * @clause[sec-formatnumbertoparts]
 */
function FormatNumberToParts(numberFormat, x) {
    // 1. Let parts be ? PartitionNumberPattern(numberFormat, x).
    var parts = PartitionNumberPattern(numberFormat, x);
    // 2. Let result be ArrayCreate(0).
    var result = [];
    // 3. Let n be 0.
    var n = 0;
    // 4. For each part in parts, do:
    for (var i = 0; parts.length > i; i++) {
        var part = parts[i];
        // a. Let O be ObjectCreate(%ObjectPrototype%).
        var O = {};
        // a. Perform ? CreateDataPropertyOrThrow(O, "type", part.[[type]]).
        O.type = part['[[type]]'];
        // a. Perform ? CreateDataPropertyOrThrow(O, "value", part.[[value]]).
        O.value = part['[[value]]'];
        // a. Perform ? CreateDataPropertyOrThrow(result, ? ToString(n), O).
        result[n] = O;
        // a. Increment n by 1.
        n += 1;
    }
    // 5. Return result.
    return result;
}

/*
 * @spec[stasm/ecma402/number-format-to-parts/spec/numberformat.html]
 * @clause[sec-partitionnumberpattern]
 */
function PartitionNumberPattern(numberFormat, x) {

    var internal = getInternalProperties(numberFormat),
        locale = internal['[[dataLocale]]'],
        nums = internal['[[numberingSystem]]'],
        data = internals.NumberFormat['[[localeData]]'][locale],
        ild = data.symbols[nums] || data.symbols.latn,
        pattern = void 0;

    // 1. If x is not NaN and x < 0, then:
    if (!isNaN(x) && x < 0) {
        // a. Let x be -x.
        x = -x;
        // a. Let pattern be the value of numberFormat.[[negativePattern]].
        pattern = internal['[[negativePattern]]'];
    }
    // 2. Else,
    else {
            // a. Let pattern be the value of numberFormat.[[positivePattern]].
            pattern = internal['[[positivePattern]]'];
        }
    // 3. Let result be a new empty List.
    var result = new List();
    // 4. Let beginIndex be Call(%StringProto_indexOf%, pattern, "{", 0).
    var beginIndex = pattern.indexOf('{', 0);
    // 5. Let endIndex be 0.
    var endIndex = 0;
    // 6. Let nextIndex be 0.
    var nextIndex = 0;
    // 7. Let length be the number of code units in pattern.
    var length = pattern.length;
    // 8. Repeat while beginIndex is an integer index into pattern:
    while (beginIndex > -1 && beginIndex < length) {
        // a. Set endIndex to Call(%StringProto_indexOf%, pattern, "}", beginIndex)
        endIndex = pattern.indexOf('}', beginIndex);
        // a. If endIndex = -1, throw new Error exception.
        if (endIndex === -1) throw new Error();
        // a. If beginIndex is greater than nextIndex, then:
        if (beginIndex > nextIndex) {
            // i. Let literal be a substring of pattern from position nextIndex, inclusive, to position beginIndex, exclusive.
            var literal = pattern.substring(nextIndex, beginIndex);
            // ii. Add new part record { [[type]]: "literal", [[value]]: literal } as a new element of the list result.
            arrPush.call(result, { '[[type]]': 'literal', '[[value]]': literal });
        }
        // a. Let p be the substring of pattern from position beginIndex, exclusive, to position endIndex, exclusive.
        var p = pattern.substring(beginIndex + 1, endIndex);
        // a. If p is equal "number", then:
        if (p === "number") {
            // i. If x is NaN,
            if (isNaN(x)) {
                // 1. Let n be an ILD String value indicating the NaN value.
                var n = ild.nan;
                // 2. Add new part record { [[type]]: "nan", [[value]]: n } as a new element of the list result.
                arrPush.call(result, { '[[type]]': 'nan', '[[value]]': n });
            }
            // ii. Else if isFinite(x) is false,
            else if (!isFinite(x)) {
                    // 1. Let n be an ILD String value indicating infinity.
                    var _n = ild.infinity;
                    // 2. Add new part record { [[type]]: "infinity", [[value]]: n } as a new element of the list result.
                    arrPush.call(result, { '[[type]]': 'infinity', '[[value]]': _n });
                }
                // iii. Else,
                else {
                        // 1. If the value of numberFormat.[[style]] is "percent" and isFinite(x), let x be 100 × x.
                        if (internal['[[style]]'] === 'percent' && isFinite(x)) x *= 100;

                        var _n2 = void 0;
                        // 2. If the numberFormat.[[minimumSignificantDigits]] and numberFormat.[[maximumSignificantDigits]] are present, then
                        if (hop.call(internal, '[[minimumSignificantDigits]]') && hop.call(internal, '[[maximumSignificantDigits]]')) {
                            // a. Let n be ToRawPrecision(x, numberFormat.[[minimumSignificantDigits]], numberFormat.[[maximumSignificantDigits]]).
                            _n2 = ToRawPrecision(x, internal['[[minimumSignificantDigits]]'], internal['[[maximumSignificantDigits]]']);
                        }
                        // 3. Else,
                        else {
                                // a. Let n be ToRawFixed(x, numberFormat.[[minimumIntegerDigits]], numberFormat.[[minimumFractionDigits]], numberFormat.[[maximumFractionDigits]]).
                                _n2 = ToRawFixed(x, internal['[[minimumIntegerDigits]]'], internal['[[minimumFractionDigits]]'], internal['[[maximumFractionDigits]]']);
                            }
                        // 4. If the value of the numberFormat.[[numberingSystem]] matches one of the values in the "Numbering System" column of Table 2 below, then
                        if (numSys[nums]) {
                            (function () {
                                // a. Let digits be an array whose 10 String valued elements are the UTF-16 string representations of the 10 digits specified in the "Digits" column of the matching row in Table 2.
                                var digits = numSys[nums];
                                // a. Replace each digit in n with the value of digits[digit].
                                _n2 = String(_n2).replace(/\d/g, function (digit) {
                                    return digits[digit];
                                });
                            })();
                        }
                        // 5. Else use an implementation dependent algorithm to map n to the appropriate representation of n in the given numbering system.
                        else _n2 = String(_n2); // ###TODO###

                        var integer = void 0;
                        var fraction = void 0;
                        // 6. Let decimalSepIndex be Call(%StringProto_indexOf%, n, ".", 0).
                        var decimalSepIndex = _n2.indexOf('.', 0);
                        // 7. If decimalSepIndex > 0, then:
                        if (decimalSepIndex > 0) {
                            // a. Let integer be the substring of n from position 0, inclusive, to position decimalSepIndex, exclusive.
                            integer = _n2.substring(0, decimalSepIndex);
                            // a. Let fraction be the substring of n from position decimalSepIndex, exclusive, to the end of n.
                            fraction = _n2.substring(decimalSepIndex + 1, decimalSepIndex.length);
                        }
                        // 8. Else:
                        else {
                                // a. Let integer be n.
                                integer = _n2;
                                // a. Let fraction be undefined.
                                fraction = undefined;
                            }
                        // 9. If the value of the numberFormat.[[useGrouping]] is true,
                        if (internal['[[useGrouping]]'] === true) {
                            // a. Let groupSepSymbol be the ILND String representing the grouping separator.
                            var groupSepSymbol = ild.group;
                            // a. Let groups be a List whose elements are, in left to right order, the substrings defined by ILND set of locations within the integer.
                            var groups = [];
                            // ----> implementation:
                            // Primary group represents the group closest to the decimal
                            var pgSize = data.patterns.primaryGroupSize || 3;
                            // Secondary group is every other group
                            var sgSize = data.patterns.secondaryGroupSize || pgSize;
                            // Group only if necessary
                            if (integer.length > pgSize) {
                                // Index of the primary grouping separator
                                var end = integer.length - pgSize;
                                // Starting index for our loop
                                var idx = end % sgSize;
                                var start = integer.slice(0, idx);
                                if (start.length) arrPush.call(groups, start);
                                // Loop to separate into secondary grouping digits
                                while (idx < end) {
                                    arrPush.call(groups, integer.slice(idx, idx + sgSize));
                                    idx += sgSize;
                                }
                                // Add the primary grouping digits
                                arrPush.call(groups, integer.slice(end));
                            } else {
                                arrPush.call(groups, integer);
                            }
                            // a. Assert: The number of elements in groups List is greater than 0.
                            if (groups.length === 0) throw new Error();
                            // a. Repeat, while groups List is not empty:
                            while (groups.length) {
                                // i. Remove the first element from groups and let integerGroup be the value of that element.
                                var integerGroup = arrShift.call(groups);
                                // ii. Add new part record { [[type]]: "integer", [[value]]: integerGroup } as a new element of the list result.
                                arrPush.call(result, { '[[type]]': 'integer', '[[value]]': integerGroup });
                                // iii. If groups List is not empty, then:
                                if (groups.length) {
                                    // 1. Add new part record { [[type]]: "group", [[value]]: groupSepSymbol } as a new element of the list result.
                                    arrPush.call(result, { '[[type]]': 'group', '[[value]]': groupSepSymbol });
                                }
                            }
                        }
                        // 10. Else,
                        else {
                                // a. Add new part record { [[type]]: "integer", [[value]]: integer } as a new element of the list result.
                                arrPush.call(result, { '[[type]]': 'integer', '[[value]]': integer });
                            }
                        // 11. If fraction is not undefined, then:
                        if (fraction !== undefined) {
                            // a. Let decimalSepSymbol be the ILND String representing the decimal separator.
                            var decimalSepSymbol = ild.decimal;
                            // a. Add new part record { [[type]]: "decimal", [[value]]: decimalSepSymbol } as a new element of the list result.
                            arrPush.call(result, { '[[type]]': 'decimal', '[[value]]': decimalSepSymbol });
                            // a. Add new part record { [[type]]: "fraction", [[value]]: fraction } as a new element of the list result.
                            arrPush.call(result, { '[[type]]': 'fraction', '[[value]]': fraction });
                        }
                    }
        }
        // a. Else if p is equal "plusSign", then:
        else if (p === "plusSign") {
                // i. Let plusSignSymbol be the ILND String representing the plus sign.
                var plusSignSymbol = ild.plusSign;
                // ii. Add new part record { [[type]]: "plusSign", [[value]]: plusSignSymbol } as a new element of the list result.
                arrPush.call(result, { '[[type]]': 'plusSign', '[[value]]': plusSignSymbol });
            }
            // a. Else if p is equal "minusSign", then:
            else if (p === "minusSign") {
                    // i. Let minusSignSymbol be the ILND String representing the minus sign.
                    var minusSignSymbol = ild.minusSign;
                    // ii. Add new part record { [[type]]: "minusSign", [[value]]: minusSignSymbol } as a new element of the list result.
                    arrPush.call(result, { '[[type]]': 'minusSign', '[[value]]': minusSignSymbol });
                }
                // a. Else if p is equal "percentSign" and numberFormat.[[style]] is "percent", then:
                else if (p === "percentSign" && internal['[[style]]'] === "percent") {
                        // i. Let percentSignSymbol be the ILND String representing the percent sign.
                        var percentSignSymbol = ild.percentSign;
                        // ii. Add new part record { [[type]]: "percentSign", [[value]]: percentSignSymbol } as a new element of the list result.
                        arrPush.call(result, { '[[type]]': 'literal', '[[value]]': percentSignSymbol });
                    }
                    // a. Else if p is equal "currency" and numberFormat.[[style]] is "currency", then:
                    else if (p === "currency" && internal['[[style]]'] === "currency") {
                            // i. Let currency be the value of numberFormat.[[currency]].
                            var currency = internal['[[currency]]'];

                            var cd = void 0;

                            // ii. If numberFormat.[[currencyDisplay]] is "code", then
                            if (internal['[[currencyDisplay]]'] === "code") {
                                // 1. Let cd be currency.
                                cd = currency;
                            }
                            // iii. Else if numberFormat.[[currencyDisplay]] is "symbol", then
                            else if (internal['[[currencyDisplay]]'] === "symbol") {
                                    // 1. Let cd be an ILD string representing currency in short form. If the implementation does not have such a representation of currency, use currency itself.
                                    cd = data.currencies[currency] || currency;
                                }
                                // iv. Else if numberFormat.[[currencyDisplay]] is "name", then
                                else if (internal['[[currencyDisplay]]'] === "name") {
                                        // 1. Let cd be an ILD string representing currency in long form. If the implementation does not have such a representation of currency, then use currency itself.
                                        cd = currency;
                                    }
                            // v. Add new part record { [[type]]: "currency", [[value]]: cd } as a new element of the list result.
                            arrPush.call(result, { '[[type]]': 'currency', '[[value]]': cd });
                        }
                        // a. Else,
                        else {
                                // i. Let literal be the substring of pattern from position beginIndex, inclusive, to position endIndex, inclusive.
                                var _literal = pattern.substring(beginIndex, endIndex);
                                // ii. Add new part record { [[type]]: "literal", [[value]]: literal } as a new element of the list result.
                                arrPush.call(result, { '[[type]]': 'literal', '[[value]]': _literal });
                            }
        // a. Set nextIndex to endIndex + 1.
        nextIndex = endIndex + 1;
        // a. Set beginIndex to Call(%StringProto_indexOf%, pattern, "{", nextIndex)
        beginIndex = pattern.indexOf('{', nextIndex);
    }
    // 9. If nextIndex is less than length, then:
    if (nextIndex < length) {
        // a. Let literal be the substring of pattern from position nextIndex, inclusive, to position length, exclusive.
        var _literal2 = pattern.substring(nextIndex, length);
        // a. Add new part record { [[type]]: "literal", [[value]]: literal } as a new element of the list result.
        arrPush.call(result, { '[[type]]': 'literal', '[[value]]': _literal2 });
    }
    // 10. Return result.
    return result;
}

/*
 * @spec[stasm/ecma402/number-format-to-parts/spec/numberformat.html]
 * @clause[sec-formatnumber]
 */
function FormatNumber(numberFormat, x) {
    // 1. Let parts be ? PartitionNumberPattern(numberFormat, x).
    var parts = PartitionNumberPattern(numberFormat, x);
    // 2. Let result be an empty String.
    var result = '';
    // 3. For each part in parts, do:
    for (var i = 0; parts.length > i; i++) {
        var part = parts[i];
        // a. Set result to a String value produced by concatenating result and part.[[value]].
        result += part['[[value]]'];
    }
    // 4. Return result.
    return result;
}

/**
 * When the ToRawPrecision abstract operation is called with arguments x (which
 * must be a finite non-negative number), minPrecision, and maxPrecision (both
 * must be integers between 1 and 21) the following steps are taken:
 */
function ToRawPrecision(x, minPrecision, maxPrecision) {
    // 1. Let p be maxPrecision.
    var p = maxPrecision;

    var m = void 0,
        e = void 0;

    // 2. If x = 0, then
    if (x === 0) {
        // a. Let m be the String consisting of p occurrences of the character "0".
        m = arrJoin.call(Array(p + 1), '0');
        // b. Let e be 0.
        e = 0;
    }
    // 3. Else
    else {
            // a. Let e and n be integers such that 10ᵖ⁻¹ ≤ n < 10ᵖ and for which the
            //    exact mathematical value of n × 10ᵉ⁻ᵖ⁺¹ – x is as close to zero as
            //    possible. If there are two such sets of e and n, pick the e and n for
            //    which n × 10ᵉ⁻ᵖ⁺¹ is larger.
            e = log10Floor(Math.abs(x));

            // Easier to get to m from here
            var f = Math.round(Math.exp(Math.abs(e - p + 1) * Math.LN10));

            // b. Let m be the String consisting of the digits of the decimal
            //    representation of n (in order, with no leading zeroes)
            m = String(Math.round(e - p + 1 < 0 ? x * f : x / f));
        }

    // 4. If e ≥ p, then
    if (e >= p)
        // a. Return the concatenation of m and e-p+1 occurrences of the character "0".
        return m + arrJoin.call(Array(e - p + 1 + 1), '0');

        // 5. If e = p-1, then
    else if (e === p - 1)
            // a. Return m.
            return m;

            // 6. If e ≥ 0, then
        else if (e >= 0)
                // a. Let m be the concatenation of the first e+1 characters of m, the character
                //    ".", and the remaining p–(e+1) characters of m.
                m = m.slice(0, e + 1) + '.' + m.slice(e + 1);

                // 7. If e < 0, then
            else if (e < 0)
                    // a. Let m be the concatenation of the String "0.", –(e+1) occurrences of the
                    //    character "0", and the string m.
                    m = '0.' + arrJoin.call(Array(-(e + 1) + 1), '0') + m;

    // 8. If m contains the character ".", and maxPrecision > minPrecision, then
    if (m.indexOf(".") >= 0 && maxPrecision > minPrecision) {
        // a. Let cut be maxPrecision – minPrecision.
        var cut = maxPrecision - minPrecision;

        // b. Repeat while cut > 0 and the last character of m is "0":
        while (cut > 0 && m.charAt(m.length - 1) === '0') {
            //  i. Remove the last character from m.
            m = m.slice(0, -1);

            //  ii. Decrease cut by 1.
            cut--;
        }

        // c. If the last character of m is ".", then
        if (m.charAt(m.length - 1) === '.')
            //    i. Remove the last character from m.
            m = m.slice(0, -1);
    }
    // 9. Return m.
    return m;
}

/**
 * @spec[tc39/ecma402/master/spec/numberformat.html]
 * @clause[sec-torawfixed]
 * When the ToRawFixed abstract operation is called with arguments x (which must
 * be a finite non-negative number), minInteger (which must be an integer between
 * 1 and 21), minFraction, and maxFraction (which must be integers between 0 and
 * 20) the following steps are taken:
 */
function ToRawFixed(x, minInteger, minFraction, maxFraction) {
    // 1. Let f be maxFraction.
    var f = maxFraction;
    // 2. Let n be an integer for which the exact mathematical value of n ÷ 10f – x is as close to zero as possible. If there are two such n, pick the larger n.
    var n = Math.pow(10, f) * x; // diverging...
    // 3. If n = 0, let m be the String "0". Otherwise, let m be the String consisting of the digits of the decimal representation of n (in order, with no leading zeroes).
    var m = n === 0 ? "0" : n.toFixed(0); // divering...

    {
        // this diversion is needed to take into consideration big numbers, e.g.:
        // 1.2344501e+37 -> 12344501000000000000000000000000000000
        var idx = void 0;
        var exp = (idx = m.indexOf('e')) > -1 ? m.slice(idx + 1) : 0;
        if (exp) {
            m = m.slice(0, idx).replace('.', '');
            m += arrJoin.call(Array(exp - (m.length - 1) + 1), '0');
        }
    }

    var int = void 0;
    // 4. If f ≠ 0, then
    if (f !== 0) {
        // a. Let k be the number of characters in m.
        var k = m.length;
        // a. If k ≤ f, then
        if (k <= f) {
            // i. Let z be the String consisting of f+1–k occurrences of the character "0".
            var z = arrJoin.call(Array(f + 1 - k + 1), '0');
            // ii. Let m be the concatenation of Strings z and m.
            m = z + m;
            // iii. Let k be f+1.
            k = f + 1;
        }
        // a. Let a be the first k–f characters of m, and let b be the remaining f characters of m.
        var a = m.substring(0, k - f),
            b = m.substring(k - f, m.length);
        // a. Let m be the concatenation of the three Strings a, ".", and b.
        m = a + "." + b;
        // a. Let int be the number of characters in a.
        int = a.length;
    }
    // 5. Else, let int be the number of characters in m.
    else int = m.length;
    // 6. Let cut be maxFraction – minFraction.
    var cut = maxFraction - minFraction;
    // 7. Repeat while cut > 0 and the last character of m is "0":
    while (cut > 0 && m.slice(-1) === "0") {
        // a. Remove the last character from m.
        m = m.slice(0, -1);
        // a. Decrease cut by 1.
        cut--;
    }
    // 8. If the last character of m is ".", then
    if (m.slice(-1) === ".") {
        // a. Remove the last character from m.
        m = m.slice(0, -1);
    }
    // 9. If int < minInteger, then
    if (int < minInteger) {
        // a. Let z be the String consisting of minInteger–int occurrences of the character "0".
        var _z = arrJoin.call(Array(minInteger - int + 1), '0');
        // a. Let m be the concatenation of Strings z and m.
        m = _z + m;
    }
    // 10. Return m.
    return m;
}

// Sect 11.3.2 Table 2, Numbering systems
// ======================================
var numSys = {
    arab: ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"],
    arabext: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
    bali: ["᭐", "᭑", "᭒", "᭓", "᭔", "᭕", "᭖", "᭗", "᭘", "᭙"],
    beng: ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"],
    deva: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
    fullwide: ["０", "１", "２", "３", "４", "５", "６", "７", "８", "９"],
    gujr: ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"],
    guru: ["੦", "੧", "੨", "੩", "੪", "੫", "੬", "੭", "੮", "੯"],
    hanidec: ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"],
    khmr: ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"],
    knda: ["೦", "೧", "೨", "೩", "೪", "೫", "೬", "೭", "೮", "೯"],
    laoo: ["໐", "໑", "໒", "໓", "໔", "໕", "໖", "໗", "໘", "໙"],
    latn: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    limb: ["᥆", "᥇", "᥈", "᥉", "᥊", "᥋", "᥌", "᥍", "᥎", "᥏"],
    mlym: ["൦", "൧", "൨", "൩", "൪", "൫", "൬", "൭", "൮", "൯"],
    mong: ["᠐", "᠑", "᠒", "᠓", "᠔", "᠕", "᠖", "᠗", "᠘", "᠙"],
    mymr: ["၀", "၁", "၂", "၃", "၄", "၅", "၆", "၇", "၈", "၉"],
    orya: ["୦", "୧", "୨", "୩", "୪", "୫", "୬", "୭", "୮", "୯"],
    tamldec: ["௦", "௧", "௨", "௩", "௪", "௫", "௬", "௭", "௮", "௯"],
    telu: ["౦", "౧", "౨", "౩", "౪", "౫", "౬", "౭", "౮", "౯"],
    thai: ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"],
    tibt: ["༠", "༡", "༢", "༣", "༤", "༥", "༦", "༧", "༨", "༩"]
};

/**
 * This function provides access to the locale and formatting options computed
 * during initialization of the object.
 *
 * The function returns a new object whose properties and attributes are set as
 * if constructed by an object literal assigning to each of the following
 * properties the value of the corresponding internal property of this
 * NumberFormat object (see 11.4): locale, numberingSystem, style, currency,
 * currencyDisplay, minimumIntegerDigits, minimumFractionDigits,
 * maximumFractionDigits, minimumSignificantDigits, maximumSignificantDigits, and
 * useGrouping. Properties whose corresponding internal properties are not present
 * are not assigned.
 */
/* 11.3.3 */defineProperty(Intl.NumberFormat.prototype, 'resolvedOptions', {
    configurable: true,
    writable: true,
    value: function value() {
        var prop = void 0,
            descs = new Record(),
            props = ['locale', 'numberingSystem', 'style', 'currency', 'currencyDisplay', 'minimumIntegerDigits', 'minimumFractionDigits', 'maximumFractionDigits', 'minimumSignificantDigits', 'maximumSignificantDigits', 'useGrouping'],
            internal = this !== null && babelHelpers["typeof"](this) === 'object' && getInternalProperties(this);

        // Satisfy test 11.3_b
        if (!internal || !internal['[[initializedNumberFormat]]']) throw new TypeError('`this` value for resolvedOptions() is not an initialized Intl.NumberFormat object.');

        for (var i = 0, max = props.length; i < max; i++) {
            if (hop.call(internal, prop = '[[' + props[i] + ']]')) descs[props[i]] = { value: internal[prop], writable: true, configurable: true, enumerable: true };
        }

        return objCreate({}, descs);
    }
});

/* jslint esnext: true */

// Match these datetime components in a CLDR pattern, except those in single quotes
var expDTComponents = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
// trim patterns after transformations
var expPatternTrimmer = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
// Skip over patterns with these datetime components because we don't have data
// to back them up:
// timezone, weekday, amoung others
var unwantedDTCs = /[rqQASjJgwWIQq]/; // xXVO were removed from this list in favor of computing matches with timeZoneName values but printing as empty string

var dtKeys = ["weekday", "era", "year", "month", "day", "weekday", "quarter"];
var tmKeys = ["hour", "minute", "second", "hour12", "timeZoneName"];

function isDateFormatOnly(obj) {
    for (var i = 0; i < tmKeys.length; i += 1) {
        if (obj.hasOwnProperty(tmKeys[i])) {
            return false;
        }
    }
    return true;
}

function isTimeFormatOnly(obj) {
    for (var i = 0; i < dtKeys.length; i += 1) {
        if (obj.hasOwnProperty(dtKeys[i])) {
            return false;
        }
    }
    return true;
}

function joinDateAndTimeFormats(dateFormatObj, timeFormatObj) {
    var o = { _: {} };
    for (var i = 0; i < dtKeys.length; i += 1) {
        if (dateFormatObj[dtKeys[i]]) {
            o[dtKeys[i]] = dateFormatObj[dtKeys[i]];
        }
        if (dateFormatObj._[dtKeys[i]]) {
            o._[dtKeys[i]] = dateFormatObj._[dtKeys[i]];
        }
    }
    for (var j = 0; j < tmKeys.length; j += 1) {
        if (timeFormatObj[tmKeys[j]]) {
            o[tmKeys[j]] = timeFormatObj[tmKeys[j]];
        }
        if (timeFormatObj._[tmKeys[j]]) {
            o._[tmKeys[j]] = timeFormatObj._[tmKeys[j]];
        }
    }
    return o;
}

function computeFinalPatterns(formatObj) {
    // From http://www.unicode.org/reports/tr35/tr35-dates.html#Date_Format_Patterns:
    //  'In patterns, two single quotes represents a literal single quote, either
    //   inside or outside single quotes. Text within single quotes is not
    //   interpreted in any way (except for two adjacent single quotes).'
    formatObj.pattern12 = formatObj.extendedPattern.replace(/'([^']*)'/g, function ($0, literal) {
        return literal ? literal : "'";
    });

    // pattern 12 is always the default. we can produce the 24 by removing {ampm}
    formatObj.pattern = formatObj.pattern12.replace('{ampm}', '').replace(expPatternTrimmer, '');
    return formatObj;
}

function expDTComponentsMeta($0, formatObj) {
    switch ($0.charAt(0)) {
        // --- Era
        case 'G':
            formatObj.era = ['short', 'short', 'short', 'long', 'narrow'][$0.length - 1];
            return '{era}';

        // --- Year
        case 'y':
        case 'Y':
        case 'u':
        case 'U':
        case 'r':
            formatObj.year = $0.length === 2 ? '2-digit' : 'numeric';
            return '{year}';

        // --- Quarter (not supported in this polyfill)
        case 'Q':
        case 'q':
            formatObj.quarter = ['numeric', '2-digit', 'short', 'long', 'narrow'][$0.length - 1];
            return '{quarter}';

        // --- Month
        case 'M':
        case 'L':
            formatObj.month = ['numeric', '2-digit', 'short', 'long', 'narrow'][$0.length - 1];
            return '{month}';

        // --- Week (not supported in this polyfill)
        case 'w':
            // week of the year
            formatObj.week = $0.length === 2 ? '2-digit' : 'numeric';
            return '{weekday}';
        case 'W':
            // week of the month
            formatObj.week = 'numeric';
            return '{weekday}';

        // --- Day
        case 'd':
            // day of the month
            formatObj.day = $0.length === 2 ? '2-digit' : 'numeric';
            return '{day}';
        case 'D': // day of the year
        case 'F': // day of the week
        case 'g':
            // 1..n: Modified Julian day
            formatObj.day = 'numeric';
            return '{day}';

        // --- Week Day
        case 'E':
            // day of the week
            formatObj.weekday = ['short', 'short', 'short', 'long', 'narrow', 'short'][$0.length - 1];
            return '{weekday}';
        case 'e':
            // local day of the week
            formatObj.weekday = ['numeric', '2-digit', 'short', 'long', 'narrow', 'short'][$0.length - 1];
            return '{weekday}';
        case 'c':
            // stand alone local day of the week
            formatObj.weekday = ['numeric', undefined, 'short', 'long', 'narrow', 'short'][$0.length - 1];
            return '{weekday}';

        // --- Period
        case 'a': // AM, PM
        case 'b': // am, pm, noon, midnight
        case 'B':
            // flexible day periods
            formatObj.hour12 = true;
            return '{ampm}';

        // --- Hour
        case 'h':
        case 'H':
            formatObj.hour = $0.length === 2 ? '2-digit' : 'numeric';
            return '{hour}';
        case 'k':
        case 'K':
            formatObj.hour12 = true; // 12-hour-cycle time formats (using h or K)
            formatObj.hour = $0.length === 2 ? '2-digit' : 'numeric';
            return '{hour}';

        // --- Minute
        case 'm':
            formatObj.minute = $0.length === 2 ? '2-digit' : 'numeric';
            return '{minute}';

        // --- Second
        case 's':
            formatObj.second = $0.length === 2 ? '2-digit' : 'numeric';
            return '{second}';
        case 'S':
        case 'A':
            formatObj.second = 'numeric';
            return '{second}';

        // --- Timezone
        case 'z': // 1..3, 4: specific non-location format
        case 'Z': // 1..3, 4, 5: The ISO8601 varios formats
        case 'O': // 1, 4: miliseconds in day short, long
        case 'v': // 1, 4: generic non-location format
        case 'V': // 1, 2, 3, 4: time zone ID or city
        case 'X': // 1, 2, 3, 4: The ISO8601 varios formats
        case 'x':
            // 1, 2, 3, 4: The ISO8601 varios formats
            // this polyfill only supports much, for now, we are just doing something dummy
            formatObj.timeZoneName = $0.length < 4 ? 'short' : 'long';
            return '{timeZoneName}';
    }
}

/**
 * Converts the CLDR availableFormats into the objects and patterns required by
 * the ECMAScript Internationalization API specification.
 */
function createDateTimeFormat(skeleton, pattern) {
    // we ignore certain patterns that are unsupported to avoid this expensive op.
    if (unwantedDTCs.test(pattern)) return undefined;

    var formatObj = {
        originalPattern: pattern,
        _: {}
    };

    // Replace the pattern string with the one required by the specification, whilst
    // at the same time evaluating it for the subsets and formats
    formatObj.extendedPattern = pattern.replace(expDTComponents, function ($0) {
        // See which symbol we're dealing with
        return expDTComponentsMeta($0, formatObj._);
    });

    // Match the skeleton string with the one required by the specification
    // this implementation is based on the Date Field Symbol Table:
    // http://unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
    // Note: we are adding extra data to the formatObject even though this polyfill
    //       might not support it.
    skeleton.replace(expDTComponents, function ($0) {
        // See which symbol we're dealing with
        return expDTComponentsMeta($0, formatObj);
    });

    return computeFinalPatterns(formatObj);
}

/**
 * Processes DateTime formats from CLDR to an easier-to-parse format.
 * the result of this operation should be cached the first time a particular
 * calendar is analyzed.
 *
 * The specification requires we support at least the following subsets of
 * date/time components:
 *
 *   - 'weekday', 'year', 'month', 'day', 'hour', 'minute', 'second'
 *   - 'weekday', 'year', 'month', 'day'
 *   - 'year', 'month', 'day'
 *   - 'year', 'month'
 *   - 'month', 'day'
 *   - 'hour', 'minute', 'second'
 *   - 'hour', 'minute'
 *
 * We need to cherry pick at least these subsets from the CLDR data and convert
 * them into the pattern objects used in the ECMA-402 API.
 */
function createDateTimeFormats(formats) {
    var availableFormats = formats.availableFormats;
    var timeFormats = formats.timeFormats;
    var dateFormats = formats.dateFormats;
    var result = [];
    var skeleton = void 0,
        pattern = void 0,
        computed = void 0,
        i = void 0,
        j = void 0;
    var timeRelatedFormats = [];
    var dateRelatedFormats = [];

    // Map available (custom) formats into a pattern for createDateTimeFormats
    for (skeleton in availableFormats) {
        if (availableFormats.hasOwnProperty(skeleton)) {
            pattern = availableFormats[skeleton];
            computed = createDateTimeFormat(skeleton, pattern);
            if (computed) {
                result.push(computed);
                // in some cases, the format is only displaying date specific props
                // or time specific props, in which case we need to also produce the
                // combined formats.
                if (isDateFormatOnly(computed)) {
                    dateRelatedFormats.push(computed);
                } else if (isTimeFormatOnly(computed)) {
                    timeRelatedFormats.push(computed);
                }
            }
        }
    }

    // Map time formats into a pattern for createDateTimeFormats
    for (skeleton in timeFormats) {
        if (timeFormats.hasOwnProperty(skeleton)) {
            pattern = timeFormats[skeleton];
            computed = createDateTimeFormat(skeleton, pattern);
            if (computed) {
                result.push(computed);
                timeRelatedFormats.push(computed);
            }
        }
    }

    // Map date formats into a pattern for createDateTimeFormats
    for (skeleton in dateFormats) {
        if (dateFormats.hasOwnProperty(skeleton)) {
            pattern = dateFormats[skeleton];
            computed = createDateTimeFormat(skeleton, pattern);
            if (computed) {
                result.push(computed);
                dateRelatedFormats.push(computed);
            }
        }
    }

    // combine custom time and custom date formats when they are orthogonals to complete the
    // formats supported by CLDR.
    // This Algo is based on section "Missing Skeleton Fields" from:
    // http://unicode.org/reports/tr35/tr35-dates.html#availableFormats_appendItems
    for (i = 0; i < timeRelatedFormats.length; i += 1) {
        for (j = 0; j < dateRelatedFormats.length; j += 1) {
            if (dateRelatedFormats[j].month === 'long') {
                pattern = dateRelatedFormats[j].weekday ? formats.full : formats.long;
            } else if (dateRelatedFormats[j].month === 'short') {
                pattern = formats.medium;
            } else {
                pattern = formats.short;
            }
            computed = joinDateAndTimeFormats(dateRelatedFormats[j], timeRelatedFormats[i]);
            computed.originalPattern = pattern;
            computed.extendedPattern = pattern.replace('{0}', timeRelatedFormats[i].extendedPattern).replace('{1}', dateRelatedFormats[j].extendedPattern).replace(/^[,\s]+|[,\s]+$/gi, '');
            result.push(computeFinalPatterns(computed));
        }
    }

    return result;
}

// An object map of date component keys, saves using a regex later
var dateWidths = objCreate(null, { narrow: {}, short: {}, long: {} });

/**
 * Returns a string for a date component, resolved using multiple inheritance as specified
 * as specified in the Unicode Technical Standard 35.
 */
function resolveDateString(data, ca, component, width, key) {
    // From http://www.unicode.org/reports/tr35/tr35.html#Multiple_Inheritance:
    // 'In clearly specified instances, resources may inherit from within the same locale.
    //  For example, ... the Buddhist calendar inherits from the Gregorian calendar.'
    var obj = data[ca] && data[ca][component] ? data[ca][component] : data.gregory[component],


    // "sideways" inheritance resolves strings when a key doesn't exist
    alts = {
        narrow: ['short', 'long'],
        short: ['long', 'narrow'],
        long: ['short', 'narrow']
    },


    //
    resolved = hop.call(obj, width) ? obj[width] : hop.call(obj, alts[width][0]) ? obj[alts[width][0]] : obj[alts[width][1]];

    // `key` wouldn't be specified for components 'dayPeriods'
    return key !== null ? resolved[key] : resolved;
}

// Define the DateTimeFormat constructor internally so it cannot be tainted
function DateTimeFormatConstructor() {
    var locales = arguments[0];
    var options = arguments[1];

    if (!this || this === Intl) {
        return new Intl.DateTimeFormat(locales, options);
    }
    return InitializeDateTimeFormat(toObject(this), locales, options);
}

defineProperty(Intl, 'DateTimeFormat', {
    configurable: true,
    writable: true,
    value: DateTimeFormatConstructor
});

// Must explicitly set prototypes as unwritable
defineProperty(DateTimeFormatConstructor, 'prototype', {
    writable: false
});

/**
 * The abstract operation InitializeDateTimeFormat accepts the arguments dateTimeFormat
 * (which must be an object), locales, and options. It initializes dateTimeFormat as a
 * DateTimeFormat object.
 */
function /* 12.1.1.1 */InitializeDateTimeFormat(dateTimeFormat, locales, options) {
    // This will be a internal properties object if we're not already initialized
    var internal = getInternalProperties(dateTimeFormat);

    // Create an object whose props can be used to restore the values of RegExp props
    var regexpState = createRegExpRestore();

    // 1. If dateTimeFormat has an [[initializedIntlObject]] internal property with
    //    value true, throw a TypeError exception.
    if (internal['[[initializedIntlObject]]'] === true) throw new TypeError('`this` object has already been initialized as an Intl object');

    // Need this to access the `internal` object
    defineProperty(dateTimeFormat, '__getInternalProperties', {
        value: function value() {
            // NOTE: Non-standard, for internal use only
            if (arguments[0] === secret) return internal;
        }
    });

    // 2. Set the [[initializedIntlObject]] internal property of numberFormat to true.
    internal['[[initializedIntlObject]]'] = true;

    // 3. Let requestedLocales be the result of calling the CanonicalizeLocaleList
    //    abstract operation (defined in 9.2.1) with argument locales.
    var requestedLocales = CanonicalizeLocaleList(locales);

    // 4. Let options be the result of calling the ToDateTimeOptions abstract
    //    operation (defined below) with arguments options, "any", and "date".
    options = ToDateTimeOptions(options, 'any', 'date');

    // 5. Let opt be a new Record.
    var opt = new Record();

    // 6. Let matcher be the result of calling the GetOption abstract operation
    //    (defined in 9.2.9) with arguments options, "localeMatcher", "string", a List
    //    containing the two String values "lookup" and "best fit", and "best fit".
    var matcher = GetOption(options, 'localeMatcher', 'string', new List('lookup', 'best fit'), 'best fit');

    // 7. Set opt.[[localeMatcher]] to matcher.
    opt['[[localeMatcher]]'] = matcher;

    // 8. Let DateTimeFormat be the standard built-in object that is the initial
    //    value of Intl.DateTimeFormat.
    var DateTimeFormat = internals.DateTimeFormat; // This is what we *really* need

    // 9. Let localeData be the value of the [[localeData]] internal property of
    //    DateTimeFormat.
    var localeData = DateTimeFormat['[[localeData]]'];

    // 10. Let r be the result of calling the ResolveLocale abstract operation
    //     (defined in 9.2.5) with the [[availableLocales]] internal property of
    //      DateTimeFormat, requestedLocales, opt, the [[relevantExtensionKeys]]
    //      internal property of DateTimeFormat, and localeData.
    var r = ResolveLocale(DateTimeFormat['[[availableLocales]]'], requestedLocales, opt, DateTimeFormat['[[relevantExtensionKeys]]'], localeData);

    // 11. Set the [[locale]] internal property of dateTimeFormat to the value of
    //     r.[[locale]].
    internal['[[locale]]'] = r['[[locale]]'];

    // 12. Set the [[calendar]] internal property of dateTimeFormat to the value of
    //     r.[[ca]].
    internal['[[calendar]]'] = r['[[ca]]'];

    // 13. Set the [[numberingSystem]] internal property of dateTimeFormat to the value of
    //     r.[[nu]].
    internal['[[numberingSystem]]'] = r['[[nu]]'];

    // The specification doesn't tell us to do this, but it's helpful later on
    internal['[[dataLocale]]'] = r['[[dataLocale]]'];

    // 14. Let dataLocale be the value of r.[[dataLocale]].
    var dataLocale = r['[[dataLocale]]'];

    // 15. Let tz be the result of calling the [[Get]] internal method of options with
    //     argument "timeZone".
    var tz = options.timeZone;

    // 16. If tz is not undefined, then
    if (tz !== undefined) {
        // a. Let tz be ToString(tz).
        // b. Convert tz to upper case as described in 6.1.
        //    NOTE: If an implementation accepts additional time zone values, as permitted
        //          under certain conditions by the Conformance clause, different casing
        //          rules apply.
        tz = toLatinUpperCase(tz);

        // c. If tz is not "UTC", then throw a RangeError exception.
        // ###TODO: accept more time zones###
        if (tz !== 'UTC') throw new RangeError('timeZone is not supported.');
    }

    // 17. Set the [[timeZone]] internal property of dateTimeFormat to tz.
    internal['[[timeZone]]'] = tz;

    // 18. Let opt be a new Record.
    opt = new Record();

    // 19. For each row of Table 3, except the header row, do:
    for (var prop in dateTimeComponents) {
        if (!hop.call(dateTimeComponents, prop)) continue;

        // 20. Let prop be the name given in the Property column of the row.
        // 21. Let value be the result of calling the GetOption abstract operation,
        //     passing as argument options, the name given in the Property column of the
        //     row, "string", a List containing the strings given in the Values column of
        //     the row, and undefined.
        var value = GetOption(options, prop, 'string', dateTimeComponents[prop]);

        // 22. Set opt.[[<prop>]] to value.
        opt['[[' + prop + ']]'] = value;
    }

    // Assigned a value below
    var bestFormat = void 0;

    // 23. Let dataLocaleData be the result of calling the [[Get]] internal method of
    //     localeData with argument dataLocale.
    var dataLocaleData = localeData[dataLocale];

    // 24. Let formats be the result of calling the [[Get]] internal method of
    //     dataLocaleData with argument "formats".
    //     Note: we process the CLDR formats into the spec'd structure
    var formats = ToDateTimeFormats(dataLocaleData.formats);

    // 25. Let matcher be the result of calling the GetOption abstract operation with
    //     arguments options, "formatMatcher", "string", a List containing the two String
    //     values "basic" and "best fit", and "best fit".
    matcher = GetOption(options, 'formatMatcher', 'string', new List('basic', 'best fit'), 'best fit');

    // Optimization: caching the processed formats as a one time operation by
    // replacing the initial structure from localeData
    dataLocaleData.formats = formats;

    // 26. If matcher is "basic", then
    if (matcher === 'basic') {
        // 27. Let bestFormat be the result of calling the BasicFormatMatcher abstract
        //     operation (defined below) with opt and formats.
        bestFormat = BasicFormatMatcher(opt, formats);

        // 28. Else
    } else {
            {
                // diverging
                var _hr = GetOption(options, 'hour12', 'boolean' /*, undefined, undefined*/);
                opt.hour12 = _hr === undefined ? dataLocaleData.hour12 : _hr;
            }
            // 29. Let bestFormat be the result of calling the BestFitFormatMatcher
            //     abstract operation (defined below) with opt and formats.
            bestFormat = BestFitFormatMatcher(opt, formats);
        }

    // 30. For each row in Table 3, except the header row, do
    for (var _prop in dateTimeComponents) {
        if (!hop.call(dateTimeComponents, _prop)) continue;

        // a. Let prop be the name given in the Property column of the row.
        // b. Let pDesc be the result of calling the [[GetOwnProperty]] internal method of
        //    bestFormat with argument prop.
        // c. If pDesc is not undefined, then
        if (hop.call(bestFormat, _prop)) {
            // i. Let p be the result of calling the [[Get]] internal method of bestFormat
            //    with argument prop.
            var p = bestFormat[_prop];
            {
                // diverging
                p = bestFormat._ && hop.call(bestFormat._, _prop) ? bestFormat._[_prop] : p;
            }

            // ii. Set the [[<prop>]] internal property of dateTimeFormat to p.
            internal['[[' + _prop + ']]'] = p;
        }
    }

    var pattern = void 0; // Assigned a value below

    // 31. Let hr12 be the result of calling the GetOption abstract operation with
    //     arguments options, "hour12", "boolean", undefined, and undefined.
    var hr12 = GetOption(options, 'hour12', 'boolean' /*, undefined, undefined*/);

    // 32. If dateTimeFormat has an internal property [[hour]], then
    if (internal['[[hour]]']) {
        // a. If hr12 is undefined, then let hr12 be the result of calling the [[Get]]
        //    internal method of dataLocaleData with argument "hour12".
        hr12 = hr12 === undefined ? dataLocaleData.hour12 : hr12;

        // b. Set the [[hour12]] internal property of dateTimeFormat to hr12.
        internal['[[hour12]]'] = hr12;

        // c. If hr12 is true, then
        if (hr12 === true) {
            // i. Let hourNo0 be the result of calling the [[Get]] internal method of
            //    dataLocaleData with argument "hourNo0".
            var hourNo0 = dataLocaleData.hourNo0;

            // ii. Set the [[hourNo0]] internal property of dateTimeFormat to hourNo0.
            internal['[[hourNo0]]'] = hourNo0;

            // iii. Let pattern be the result of calling the [[Get]] internal method of
            //      bestFormat with argument "pattern12".
            pattern = bestFormat.pattern12;
        }

        // d. Else
        else
            // i. Let pattern be the result of calling the [[Get]] internal method of
            //    bestFormat with argument "pattern".
            pattern = bestFormat.pattern;
    }

    // 33. Else
    else
        // a. Let pattern be the result of calling the [[Get]] internal method of
        //    bestFormat with argument "pattern".
        pattern = bestFormat.pattern;

    // 34. Set the [[pattern]] internal property of dateTimeFormat to pattern.
    internal['[[pattern]]'] = pattern;

    // 35. Set the [[boundFormat]] internal property of dateTimeFormat to undefined.
    internal['[[boundFormat]]'] = undefined;

    // 36. Set the [[initializedDateTimeFormat]] internal property of dateTimeFormat to
    //     true.
    internal['[[initializedDateTimeFormat]]'] = true;

    // In ES3, we need to pre-bind the format() function
    if (es3) dateTimeFormat.format = GetFormatDateTime.call(dateTimeFormat);

    // Restore the RegExp properties
    regexpState.exp.test(regexpState.input);

    // Return the newly initialised object
    return dateTimeFormat;
}

/**
 * Several DateTimeFormat algorithms use values from the following table, which provides
 * property names and allowable values for the components of date and time formats:
 */
var dateTimeComponents = {
    weekday: ["narrow", "short", "long"],
    era: ["narrow", "short", "long"],
    year: ["2-digit", "numeric"],
    month: ["2-digit", "numeric", "narrow", "short", "long"],
    day: ["2-digit", "numeric"],
    hour: ["2-digit", "numeric"],
    minute: ["2-digit", "numeric"],
    second: ["2-digit", "numeric"],
    timeZoneName: ["short", "long"]
};

/**
 * When the ToDateTimeOptions abstract operation is called with arguments options,
 * required, and defaults, the following steps are taken:
 */
function ToDateTimeFormats(formats) {
    if (Object.prototype.toString.call(formats) === '[object Array]') {
        return formats;
    }
    return createDateTimeFormats(formats);
}

/**
 * When the ToDateTimeOptions abstract operation is called with arguments options,
 * required, and defaults, the following steps are taken:
 */
function ToDateTimeOptions(options, required, defaults) {
    // 1. If options is undefined, then let options be null, else let options be
    //    ToObject(options).
    if (options === undefined) options = null;else {
        // (#12) options needs to be a Record, but it also needs to inherit properties
        var opt2 = toObject(options);
        options = new Record();

        for (var k in opt2) {
            options[k] = opt2[k];
        }
    }

    // 2. Let create be the standard built-in function object defined in ES5, 15.2.3.5.
    var create = objCreate;

    // 3. Let options be the result of calling the [[Call]] internal method of create with
    //    undefined as the this value and an argument list containing the single item
    //    options.
    options = create(options);

    // 4. Let needDefaults be true.
    var needDefaults = true;

    // 5. If required is "date" or "any", then
    if (required === 'date' || required === 'any') {
        // a. For each of the property names "weekday", "year", "month", "day":
        // i. If the result of calling the [[Get]] internal method of options with the
        //    property name is not undefined, then let needDefaults be false.
        if (options.weekday !== undefined || options.year !== undefined || options.month !== undefined || options.day !== undefined) needDefaults = false;
    }

    // 6. If required is "time" or "any", then
    if (required === 'time' || required === 'any') {
        // a. For each of the property names "hour", "minute", "second":
        // i. If the result of calling the [[Get]] internal method of options with the
        //    property name is not undefined, then let needDefaults be false.
        if (options.hour !== undefined || options.minute !== undefined || options.second !== undefined) needDefaults = false;
    }

    // 7. If needDefaults is true and defaults is either "date" or "all", then
    if (needDefaults && (defaults === 'date' || defaults === 'all'))
        // a. For each of the property names "year", "month", "day":
        // i. Call the [[DefineOwnProperty]] internal method of options with the
        //    property name, Property Descriptor {[[Value]]: "numeric", [[Writable]]:
        //    true, [[Enumerable]]: true, [[Configurable]]: true}, and false.
        options.year = options.month = options.day = 'numeric';

    // 8. If needDefaults is true and defaults is either "time" or "all", then
    if (needDefaults && (defaults === 'time' || defaults === 'all'))
        // a. For each of the property names "hour", "minute", "second":
        // i. Call the [[DefineOwnProperty]] internal method of options with the
        //    property name, Property Descriptor {[[Value]]: "numeric", [[Writable]]:
        //    true, [[Enumerable]]: true, [[Configurable]]: true}, and false.
        options.hour = options.minute = options.second = 'numeric';

    // 9. Return options.
    return options;
}

/**
 * When the BasicFormatMatcher abstract operation is called with two arguments options and
 * formats, the following steps are taken:
 */
function BasicFormatMatcher(options, formats) {
    // 1. Let removalPenalty be 120.
    var removalPenalty = 120;

    // 2. Let additionPenalty be 20.
    var additionPenalty = 20;

    // 3. Let longLessPenalty be 8.
    var longLessPenalty = 8;

    // 4. Let longMorePenalty be 6.
    var longMorePenalty = 6;

    // 5. Let shortLessPenalty be 6.
    var shortLessPenalty = 6;

    // 6. Let shortMorePenalty be 3.
    var shortMorePenalty = 3;

    // 7. Let bestScore be -Infinity.
    var bestScore = -Infinity;

    // 8. Let bestFormat be undefined.
    var bestFormat = void 0;

    // 9. Let i be 0.
    var i = 0;

    // 10. Assert: formats is an Array object.

    // 11. Let len be the result of calling the [[Get]] internal method of formats with argument "length".
    var len = formats.length;

    // 12. Repeat while i < len:
    while (i < len) {
        // a. Let format be the result of calling the [[Get]] internal method of formats with argument ToString(i).
        var format = formats[i];

        // b. Let score be 0.
        var score = 0;

        // c. For each property shown in Table 3:
        for (var property in dateTimeComponents) {
            if (!hop.call(dateTimeComponents, property)) continue;

            // i. Let optionsProp be options.[[<property>]].
            var optionsProp = options['[[' + property + ']]'];

            // ii. Let formatPropDesc be the result of calling the [[GetOwnProperty]] internal method of format
            //     with argument property.
            // iii. If formatPropDesc is not undefined, then
            //     1. Let formatProp be the result of calling the [[Get]] internal method of format with argument property.
            var formatProp = hop.call(format, property) ? format[property] : undefined;

            // iv. If optionsProp is undefined and formatProp is not undefined, then decrease score by
            //     additionPenalty.
            if (optionsProp === undefined && formatProp !== undefined) score -= additionPenalty;

            // v. Else if optionsProp is not undefined and formatProp is undefined, then decrease score by
            //    removalPenalty.
            else if (optionsProp !== undefined && formatProp === undefined) score -= removalPenalty;

                // vi. Else
                else {
                        // 1. Let values be the array ["2-digit", "numeric", "narrow", "short",
                        //    "long"].
                        var values = ['2-digit', 'numeric', 'narrow', 'short', 'long'];

                        // 2. Let optionsPropIndex be the index of optionsProp within values.
                        var optionsPropIndex = arrIndexOf.call(values, optionsProp);

                        // 3. Let formatPropIndex be the index of formatProp within values.
                        var formatPropIndex = arrIndexOf.call(values, formatProp);

                        // 4. Let delta be max(min(formatPropIndex - optionsPropIndex, 2), -2).
                        var delta = Math.max(Math.min(formatPropIndex - optionsPropIndex, 2), -2);

                        // 5. If delta = 2, decrease score by longMorePenalty.
                        if (delta === 2) score -= longMorePenalty;

                        // 6. Else if delta = 1, decrease score by shortMorePenalty.
                        else if (delta === 1) score -= shortMorePenalty;

                            // 7. Else if delta = -1, decrease score by shortLessPenalty.
                            else if (delta === -1) score -= shortLessPenalty;

                                // 8. Else if delta = -2, decrease score by longLessPenalty.
                                else if (delta === -2) score -= longLessPenalty;
                    }
        }

        // d. If score > bestScore, then
        if (score > bestScore) {
            // i. Let bestScore be score.
            bestScore = score;

            // ii. Let bestFormat be format.
            bestFormat = format;
        }

        // e. Increase i by 1.
        i++;
    }

    // 13. Return bestFormat.
    return bestFormat;
}

/**
 * When the BestFitFormatMatcher abstract operation is called with two arguments options
 * and formats, it performs implementation dependent steps, which should return a set of
 * component representations that a typical user of the selected locale would perceive as
 * at least as good as the one returned by BasicFormatMatcher.
 *
 * This polyfill defines the algorithm to be the same as BasicFormatMatcher,
 * with the addition of bonus points awarded where the requested format is of
 * the same data type as the potentially matching format.
 *
 * This algo relies on the concept of closest distance matching described here:
 * http://unicode.org/reports/tr35/tr35-dates.html#Matching_Skeletons
 * Typically a “best match” is found using a closest distance match, such as:
 *
 * Symbols requesting a best choice for the locale are replaced.
 *      j → one of {H, k, h, K}; C → one of {a, b, B}
 * -> Covered by cldr.js matching process
 *
 * For fields with symbols representing the same type (year, month, day, etc):
 *     Most symbols have a small distance from each other.
 *         M ≅ L; E ≅ c; a ≅ b ≅ B; H ≅ k ≅ h ≅ K; ...
 *     -> Covered by cldr.js matching process
 *
 *     Width differences among fields, other than those marking text vs numeric, are given small distance from each other.
 *         MMM ≅ MMMM
 *         MM ≅ M
 *     Numeric and text fields are given a larger distance from each other.
 *         MMM ≈ MM
 *     Symbols representing substantial differences (week of year vs week of month) are given much larger a distances from each other.
 *         d ≋ D; ...
 *     Missing or extra fields cause a match to fail. (But see Missing Skeleton Fields).
 *
 *
 * For example,
 *
 *     { month: 'numeric', day: 'numeric' }
 *
 * should match
 *
 *     { month: '2-digit', day: '2-digit' }
 *
 * rather than
 *
 *     { month: 'short', day: 'numeric' }
 *
 * This makes sense because a user requesting a formatted date with numeric parts would
 * not expect to see the returned format containing narrow, short or long part names
 */
function BestFitFormatMatcher(options, formats) {

    // 1. Let removalPenalty be 120.
    var removalPenalty = 120;

    // 2. Let additionPenalty be 20.
    var additionPenalty = 20;

    // 3. Let longLessPenalty be 8.
    var longLessPenalty = 8;

    // 4. Let longMorePenalty be 6.
    var longMorePenalty = 6;

    // 5. Let shortLessPenalty be 6.
    var shortLessPenalty = 6;

    // 6. Let shortMorePenalty be 3.
    var shortMorePenalty = 3;

    var hour12Penalty = 1;

    // 7. Let bestScore be -Infinity.
    var bestScore = -Infinity;

    // 8. Let bestFormat be undefined.
    var bestFormat = void 0;

    // 9. Let i be 0.
    var i = 0;

    // 10. Assert: formats is an Array object.

    // 11. Let len be the result of calling the [[Get]] internal method of formats with argument "length".
    var len = formats.length;

    // 12. Repeat while i < len:
    while (i < len) {
        // a. Let format be the result of calling the [[Get]] internal method of formats with argument ToString(i).
        var format = formats[i];

        // b. Let score be 0.
        var score = 0;

        // c. For each property shown in Table 3:
        for (var property in dateTimeComponents) {
            if (!hop.call(dateTimeComponents, property)) continue;

            // i. Let optionsProp be options.[[<property>]].
            var optionsProp = options['[[' + property + ']]'];

            // ii. Let formatPropDesc be the result of calling the [[GetOwnProperty]] internal method of format
            //     with argument property.
            // iii. If formatPropDesc is not undefined, then
            //     1. Let formatProp be the result of calling the [[Get]] internal method of format with argument property.
            var formatProp = hop.call(format, property) ? format[property] : undefined;

            // iv. If optionsProp is undefined and formatProp is not undefined, then decrease score by
            //     additionPenalty.
            if (optionsProp === undefined && formatProp !== undefined) score -= additionPenalty;

            // v. Else if optionsProp is not undefined and formatProp is undefined, then decrease score by
            //    removalPenalty.
            else if (optionsProp !== undefined && formatProp === undefined) score -= removalPenalty;

                // vi. Else
                else {
                        // 1. Let values be the array ["2-digit", "numeric", "narrow", "short",
                        //    "long"].
                        var values = ['2-digit', 'numeric', 'narrow', 'short', 'long'];

                        // 2. Let optionsPropIndex be the index of optionsProp within values.
                        var optionsPropIndex = arrIndexOf.call(values, optionsProp);

                        // 3. Let formatPropIndex be the index of formatProp within values.
                        var formatPropIndex = arrIndexOf.call(values, formatProp);

                        // 4. Let delta be max(min(formatPropIndex - optionsPropIndex, 2), -2).
                        var delta = Math.max(Math.min(formatPropIndex - optionsPropIndex, 2), -2);

                        {
                            // diverging from spec
                            // When the bestFit argument is true, subtract additional penalty where data types are not the same
                            if (formatPropIndex <= 1 && optionsPropIndex >= 2 || formatPropIndex >= 2 && optionsPropIndex <= 1) {
                                // 5. If delta = 2, decrease score by longMorePenalty.
                                if (delta > 0) score -= longMorePenalty;else if (delta < 0) score -= longLessPenalty;
                            } else {
                                // 5. If delta = 2, decrease score by longMorePenalty.
                                if (delta > 1) score -= shortMorePenalty;else if (delta < -1) score -= shortLessPenalty;
                            }
                        }
                    }
        }

        {
            // diverging to also take into consideration differences between 12 or 24 hours
            // which is special for the best fit only.
            if (format._.hour12 !== options.hour12) {
                score -= hour12Penalty;
            }
        }

        // d. If score > bestScore, then
        if (score > bestScore) {
            // i. Let bestScore be score.
            bestScore = score;
            // ii. Let bestFormat be format.
            bestFormat = format;
        }

        // e. Increase i by 1.
        i++;
    }

    // 13. Return bestFormat.
    return bestFormat;
}

/* 12.2.3 */internals.DateTimeFormat = {
    '[[availableLocales]]': [],
    '[[relevantExtensionKeys]]': ['ca', 'nu'],
    '[[localeData]]': {}
};

/**
 * When the supportedLocalesOf method of Intl.DateTimeFormat is called, the
 * following steps are taken:
 */
/* 12.2.2 */
defineProperty(Intl.DateTimeFormat, 'supportedLocalesOf', {
    configurable: true,
    writable: true,
    value: fnBind.call(function (locales) {
        // Bound functions only have the `this` value altered if being used as a constructor,
        // this lets us imitate a native function that has no constructor
        if (!hop.call(this, '[[availableLocales]]')) throw new TypeError('supportedLocalesOf() is not a constructor');

        // Create an object whose props can be used to restore the values of RegExp props
        var regexpState = createRegExpRestore(),


        // 1. If options is not provided, then let options be undefined.
        options = arguments[1],


        // 2. Let availableLocales be the value of the [[availableLocales]] internal
        //    property of the standard built-in object that is the initial value of
        //    Intl.NumberFormat.

        availableLocales = this['[[availableLocales]]'],


        // 3. Let requestedLocales be the result of calling the CanonicalizeLocaleList
        //    abstract operation (defined in 9.2.1) with argument locales.
        requestedLocales = CanonicalizeLocaleList(locales);

        // Restore the RegExp properties
        regexpState.exp.test(regexpState.input);

        // 4. Return the result of calling the SupportedLocales abstract operation
        //    (defined in 9.2.8) with arguments availableLocales, requestedLocales,
        //    and options.
        return SupportedLocales(availableLocales, requestedLocales, options);
    }, internals.NumberFormat)
});

/**
 * This named accessor property returns a function that formats a number
 * according to the effective locale and the formatting options of this
 * DateTimeFormat object.
 */
/* 12.3.2 */defineProperty(Intl.DateTimeFormat.prototype, 'format', {
    configurable: true,
    get: GetFormatDateTime
});

defineProperty(Intl.DateTimeFormat.prototype, 'formatToParts', {
    configurable: true,
    get: GetFormatToPartsDateTime
});

function GetFormatDateTime() {
    var internal = this !== null && babelHelpers["typeof"](this) === 'object' && getInternalProperties(this);

    // Satisfy test 12.3_b
    if (!internal || !internal['[[initializedDateTimeFormat]]']) throw new TypeError('`this` value for format() is not an initialized Intl.DateTimeFormat object.');

    // The value of the [[Get]] attribute is a function that takes the following
    // steps:

    // 1. If the [[boundFormat]] internal property of this DateTimeFormat object
    //    is undefined, then:
    if (internal['[[boundFormat]]'] === undefined) {
        // a. Let F be a Function object, with internal properties set as
        //    specified for built-in functions in ES5, 15, or successor, and the
        //    length property set to 0, that takes the argument date and
        //    performs the following steps:
        var F = function F() {
            //   i. If date is not provided or is undefined, then let x be the
            //      result as if by the expression Date.now() where Date.now is
            //      the standard built-in function defined in ES5, 15.9.4.4.
            //  ii. Else let x be ToNumber(date).
            // iii. Return the result of calling the FormatDateTime abstract
            //      operation (defined below) with arguments this and x.
            var x = Number(arguments.length === 0 ? Date.now() : arguments[0]);
            return FormatDateTime(this, x);
        };
        // b. Let bind be the standard built-in function object defined in ES5,
        //    15.3.4.5.
        // c. Let bf be the result of calling the [[Call]] internal method of
        //    bind with F as the this value and an argument list containing
        //    the single item this.
        var bf = fnBind.call(F, this);
        // d. Set the [[boundFormat]] internal property of this NumberFormat
        //    object to bf.
        internal['[[boundFormat]]'] = bf;
    }
    // Return the value of the [[boundFormat]] internal property of this
    // NumberFormat object.
    return internal['[[boundFormat]]'];
}

function GetFormatToPartsDateTime() {
    var internal = this !== null && babelHelpers["typeof"](this) === 'object' && getInternalProperties(this);

    if (!internal || !internal['[[initializedDateTimeFormat]]']) throw new TypeError('`this` value for formatToParts() is not an initialized Intl.DateTimeFormat object.');

    if (internal['[[boundFormatToParts]]'] === undefined) {
        var F = function F() {
            var x = Number(arguments.length === 0 ? Date.now() : arguments[0]);
            return FormatToPartsDateTime(this, x);
        };
        var bf = fnBind.call(F, this);
        internal['[[boundFormatToParts]]'] = bf;
    }
    return internal['[[boundFormatToParts]]'];
}

function CreateDateTimeParts(dateTimeFormat, x) {
    // 1. If x is not a finite Number, then throw a RangeError exception.
    if (!isFinite(x)) throw new RangeError('Invalid valid date passed to format');

    var internal = dateTimeFormat.__getInternalProperties(secret);

    // Creating restore point for properties on the RegExp object... please wait
    /* let regexpState = */createRegExpRestore(); // ###TODO: review this

    // 2. Let locale be the value of the [[locale]] internal property of dateTimeFormat.
    var locale = internal['[[locale]]'];

    // 3. Let nf be the result of creating a new NumberFormat object as if by the
    // expression new Intl.NumberFormat([locale], {useGrouping: false}) where
    // Intl.NumberFormat is the standard built-in constructor defined in 11.1.3.
    var nf = new Intl.NumberFormat([locale], { useGrouping: false });

    // 4. Let nf2 be the result of creating a new NumberFormat object as if by the
    // expression new Intl.NumberFormat([locale], {minimumIntegerDigits: 2, useGrouping:
    // false}) where Intl.NumberFormat is the standard built-in constructor defined in
    // 11.1.3.
    var nf2 = new Intl.NumberFormat([locale], { minimumIntegerDigits: 2, useGrouping: false });

    // 5. Let tm be the result of calling the ToLocalTime abstract operation (defined
    // below) with x, the value of the [[calendar]] internal property of dateTimeFormat,
    // and the value of the [[timeZone]] internal property of dateTimeFormat.
    var tm = ToLocalTime(x, internal['[[calendar]]'], internal['[[timeZone]]']);

    // 6. Let result be the value of the [[pattern]] internal property of dateTimeFormat.
    var pattern = internal['[[pattern]]'];

    // 7.
    var result = new List();

    // 8.
    var index = 0;

    // 9.
    var beginIndex = pattern.indexOf('{');

    // 10.
    var endIndex = 0;

    // Need the locale minus any extensions
    var dataLocale = internal['[[dataLocale]]'];

    // Need the calendar data from CLDR
    var localeData = internals.DateTimeFormat['[[localeData]]'][dataLocale].calendars;
    var ca = internal['[[calendar]]'];

    // 11.
    while (beginIndex !== -1) {
        var fv = void 0;
        // a.
        endIndex = pattern.indexOf('}', beginIndex);
        // b.
        if (endIndex === -1) {
            throw new Error('Unclosed pattern');
        }
        // c.
        if (beginIndex > index) {
            arrPush.call(result, {
                type: 'literal',
                value: pattern.substring(index, beginIndex)
            });
        }
        // d.
        var p = pattern.substring(beginIndex + 1, endIndex);
        // e.
        if (dateTimeComponents.hasOwnProperty(p)) {
            //   i. Let f be the value of the [[<p>]] internal property of dateTimeFormat.
            var f = internal['[[' + p + ']]'];
            //  ii. Let v be the value of tm.[[<p>]].
            var v = tm['[[' + p + ']]'];
            // iii. If p is "year" and v ≤ 0, then let v be 1 - v.
            if (p === 'year' && v <= 0) {
                v = 1 - v;
            }
            //  iv. If p is "month", then increase v by 1.
            else if (p === 'month') {
                    v++;
                }
                //   v. If p is "hour" and the value of the [[hour12]] internal property of
                //      dateTimeFormat is true, then
                else if (p === 'hour' && internal['[[hour12]]'] === true) {
                        // 1. Let v be v modulo 12.
                        v = v % 12;
                        // 2. If v is 0 and the value of the [[hourNo0]] internal property of
                        //    dateTimeFormat is true, then let v be 12.
                        if (v === 0 && internal['[[hourNo0]]'] === true) {
                            v = 12;
                        }
                    }

            //  vi. If f is "numeric", then
            if (f === 'numeric') {
                // 1. Let fv be the result of calling the FormatNumber abstract operation
                //    (defined in 11.3.2) with arguments nf and v.
                fv = FormatNumber(nf, v);
            }
            // vii. Else if f is "2-digit", then
            else if (f === '2-digit') {
                    // 1. Let fv be the result of calling the FormatNumber abstract operation
                    //    with arguments nf2 and v.
                    fv = FormatNumber(nf2, v);
                    // 2. If the length of fv is greater than 2, let fv be the substring of fv
                    //    containing the last two characters.
                    if (fv.length > 2) {
                        fv = fv.slice(-2);
                    }
                }
                // viii. Else if f is "narrow", "short", or "long", then let fv be a String
                //     value representing f in the desired form; the String value depends upon
                //     the implementation and the effective locale and calendar of
                //     dateTimeFormat. If p is "month", then the String value may also depend
                //     on whether dateTimeFormat has a [[day]] internal property. If p is
                //     "timeZoneName", then the String value may also depend on the value of
                //     the [[inDST]] field of tm.
                else if (f in dateWidths) {
                        switch (p) {
                            case 'month':
                                fv = resolveDateString(localeData, ca, 'months', f, tm['[[' + p + ']]']);
                                break;

                            case 'weekday':
                                try {
                                    fv = resolveDateString(localeData, ca, 'days', f, tm['[[' + p + ']]']);
                                    // fv = resolveDateString(ca.days, f)[tm['[['+ p +']]']];
                                } catch (e) {
                                    throw new Error('Could not find weekday data for locale ' + locale);
                                }
                                break;

                            case 'timeZoneName':
                                fv = ''; // ###TODO
                                break;

                            case 'era':
                                try {
                                    fv = resolveDateString(localeData, ca, 'eras', f, tm['[[' + p + ']]']);
                                } catch (e) {
                                    throw new Error('Could not find era data for locale ' + locale);
                                }
                                break;

                            default:
                                fv = tm['[[' + p + ']]'];
                        }
                    }
            // ix
            arrPush.call(result, {
                type: p,
                value: fv
            });
            // f.
        } else if (p === 'ampm') {
                // i.
                var _v = tm['[[hour]]'];
                // ii./iii.
                fv = resolveDateString(localeData, ca, 'dayPeriods', _v > 11 ? 'pm' : 'am', null);
                // iv.
                arrPush.call(result, {
                    type: 'dayPeriod',
                    value: fv
                });
                // g.
            } else {
                    arrPush.call(result, {
                        type: 'literal',
                        value: pattern.substring(beginIndex, endIndex + 1)
                    });
                }
        // h.
        index = endIndex + 1;
        // i.
        beginIndex = pattern.indexOf('{', index);
    }
    // 12.
    if (endIndex < pattern.length - 1) {
        arrPush.call(result, {
            type: 'literal',
            value: pattern.substr(endIndex + 1)
        });
    }
    // 13.
    return result;
}

/**
 * When the FormatDateTime abstract operation is called with arguments dateTimeFormat
 * (which must be an object initialized as a DateTimeFormat) and x (which must be a Number
 * value), it returns a String value representing x (interpreted as a time value as
 * specified in ES5, 15.9.1.1) according to the effective locale and the formatting
 * options of dateTimeFormat.
 */
function FormatDateTime(dateTimeFormat, x) {
    var parts = CreateDateTimeParts(dateTimeFormat, x);
    var result = '';

    for (var i = 0; parts.length > i; i++) {
        var part = parts[i];
        result += part.value;
    }
    return result;
}

function FormatToPartsDateTime(dateTimeFormat, x) {
    var parts = CreateDateTimeParts(dateTimeFormat, x);
    var result = [];
    for (var i = 0; parts.length > i; i++) {
        var part = parts[i];
        result.push({
            type: part.type,
            value: part.value
        });
    }
    return result;
}

/**
 * When the ToLocalTime abstract operation is called with arguments date, calendar, and
 * timeZone, the following steps are taken:
 */
function ToLocalTime(date, calendar, timeZone) {
    // 1. Apply calendrical calculations on date for the given calendar and time zone to
    //    produce weekday, era, year, month, day, hour, minute, second, and inDST values.
    //    The calculations should use best available information about the specified
    //    calendar and time zone. If the calendar is "gregory", then the calculations must
    //    match the algorithms specified in ES5, 15.9.1, except that calculations are not
    //    bound by the restrictions on the use of best available information on time zones
    //    for local time zone adjustment and daylight saving time adjustment imposed by
    //    ES5, 15.9.1.7 and 15.9.1.8.
    // ###TODO###
    var d = new Date(date),
        m = 'get' + (timeZone || '');

    // 2. Return a Record with fields [[weekday]], [[era]], [[year]], [[month]], [[day]],
    //    [[hour]], [[minute]], [[second]], and [[inDST]], each with the corresponding
    //    calculated value.
    return new Record({
        '[[weekday]]': d[m + 'Day'](),
        '[[era]]': +(d[m + 'FullYear']() >= 0),
        '[[year]]': d[m + 'FullYear'](),
        '[[month]]': d[m + 'Month'](),
        '[[day]]': d[m + 'Date'](),
        '[[hour]]': d[m + 'Hours'](),
        '[[minute]]': d[m + 'Minutes'](),
        '[[second]]': d[m + 'Seconds'](),
        '[[inDST]]': false });
}

/**
 * The function returns a new object whose properties and attributes are set as if
 * constructed by an object literal assigning to each of the following properties the
 * value of the corresponding internal property of this DateTimeFormat object (see 12.4):
 * locale, calendar, numberingSystem, timeZone, hour12, weekday, era, year, month, day,
 * hour, minute, second, and timeZoneName. Properties whose corresponding internal
 * properties are not present are not assigned.
 */
/* 12.3.3 */ // ###TODO###
defineProperty(Intl.DateTimeFormat.prototype, 'resolvedOptions', {
    writable: true,
    configurable: true,
    value: function value() {
        var prop = void 0,
            descs = new Record(),
            props = ['locale', 'calendar', 'numberingSystem', 'timeZone', 'hour12', 'weekday', 'era', 'year', 'month', 'day', 'hour', 'minute', 'second', 'timeZoneName'],
            internal = this !== null && babelHelpers["typeof"](this) === 'object' && getInternalProperties(this);

        // Satisfy test 12.3_b
        if (!internal || !internal['[[initializedDateTimeFormat]]']) throw new TypeError('`this` value for resolvedOptions() is not an initialized Intl.DateTimeFormat object.');

        for (var i = 0, max = props.length; i < max; i++) {
            if (hop.call(internal, prop = '[[' + props[i] + ']]')) descs[props[i]] = { value: internal[prop], writable: true, configurable: true, enumerable: true };
        }

        return objCreate({}, descs);
    }
});

var ls = Intl.__localeSensitiveProtos = {
    Number: {},
    Date: {}
};

/**
 * When the toLocaleString method is called with optional arguments locales and options,
 * the following steps are taken:
 */
/* 13.2.1 */ls.Number.toLocaleString = function () {
    // Satisfy test 13.2.1_1
    if (Object.prototype.toString.call(this) !== '[object Number]') throw new TypeError('`this` value must be a number for Number.prototype.toLocaleString()');

    // 1. Let x be this Number value (as defined in ES5, 15.7.4).
    // 2. If locales is not provided, then let locales be undefined.
    // 3. If options is not provided, then let options be undefined.
    // 4. Let numberFormat be the result of creating a new object as if by the
    //    expression new Intl.NumberFormat(locales, options) where
    //    Intl.NumberFormat is the standard built-in constructor defined in 11.1.3.
    // 5. Return the result of calling the FormatNumber abstract operation
    //    (defined in 11.3.2) with arguments numberFormat and x.
    return FormatNumber(new NumberFormatConstructor(arguments[0], arguments[1]), this);
};

/**
 * When the toLocaleString method is called with optional arguments locales and options,
 * the following steps are taken:
 */
/* 13.3.1 */ls.Date.toLocaleString = function () {
    // Satisfy test 13.3.0_1
    if (Object.prototype.toString.call(this) !== '[object Date]') throw new TypeError('`this` value must be a Date instance for Date.prototype.toLocaleString()');

    // 1. Let x be this time value (as defined in ES5, 15.9.5).
    var x = +this;

    // 2. If x is NaN, then return "Invalid Date".
    if (isNaN(x)) return 'Invalid Date';

    // 3. If locales is not provided, then let locales be undefined.
    var locales = arguments[0];

    // 4. If options is not provided, then let options be undefined.
    var options = arguments[1];

    // 5. Let options be the result of calling the ToDateTimeOptions abstract
    //    operation (defined in 12.1.1) with arguments options, "any", and "all".
    options = ToDateTimeOptions(options, 'any', 'all');

    // 6. Let dateTimeFormat be the result of creating a new object as if by the
    //    expression new Intl.DateTimeFormat(locales, options) where
    //    Intl.DateTimeFormat is the standard built-in constructor defined in 12.1.3.
    var dateTimeFormat = new DateTimeFormatConstructor(locales, options);

    // 7. Return the result of calling the FormatDateTime abstract operation (defined
    //    in 12.3.2) with arguments dateTimeFormat and x.
    return FormatDateTime(dateTimeFormat, x);
};

/**
 * When the toLocaleDateString method is called with optional arguments locales and
 * options, the following steps are taken:
 */
/* 13.3.2 */ls.Date.toLocaleDateString = function () {
    // Satisfy test 13.3.0_1
    if (Object.prototype.toString.call(this) !== '[object Date]') throw new TypeError('`this` value must be a Date instance for Date.prototype.toLocaleDateString()');

    // 1. Let x be this time value (as defined in ES5, 15.9.5).
    var x = +this;

    // 2. If x is NaN, then return "Invalid Date".
    if (isNaN(x)) return 'Invalid Date';

    // 3. If locales is not provided, then let locales be undefined.
    var locales = arguments[0],


    // 4. If options is not provided, then let options be undefined.
    options = arguments[1];

    // 5. Let options be the result of calling the ToDateTimeOptions abstract
    //    operation (defined in 12.1.1) with arguments options, "date", and "date".
    options = ToDateTimeOptions(options, 'date', 'date');

    // 6. Let dateTimeFormat be the result of creating a new object as if by the
    //    expression new Intl.DateTimeFormat(locales, options) where
    //    Intl.DateTimeFormat is the standard built-in constructor defined in 12.1.3.
    var dateTimeFormat = new DateTimeFormatConstructor(locales, options);

    // 7. Return the result of calling the FormatDateTime abstract operation (defined
    //    in 12.3.2) with arguments dateTimeFormat and x.
    return FormatDateTime(dateTimeFormat, x);
};

/**
 * When the toLocaleTimeString method is called with optional arguments locales and
 * options, the following steps are taken:
 */
/* 13.3.3 */ls.Date.toLocaleTimeString = function () {
    // Satisfy test 13.3.0_1
    if (Object.prototype.toString.call(this) !== '[object Date]') throw new TypeError('`this` value must be a Date instance for Date.prototype.toLocaleTimeString()');

    // 1. Let x be this time value (as defined in ES5, 15.9.5).
    var x = +this;

    // 2. If x is NaN, then return "Invalid Date".
    if (isNaN(x)) return 'Invalid Date';

    // 3. If locales is not provided, then let locales be undefined.
    var locales = arguments[0];

    // 4. If options is not provided, then let options be undefined.
    var options = arguments[1];

    // 5. Let options be the result of calling the ToDateTimeOptions abstract
    //    operation (defined in 12.1.1) with arguments options, "time", and "time".
    options = ToDateTimeOptions(options, 'time', 'time');

    // 6. Let dateTimeFormat be the result of creating a new object as if by the
    //    expression new Intl.DateTimeFormat(locales, options) where
    //    Intl.DateTimeFormat is the standard built-in constructor defined in 12.1.3.
    var dateTimeFormat = new DateTimeFormatConstructor(locales, options);

    // 7. Return the result of calling the FormatDateTime abstract operation (defined
    //    in 12.3.2) with arguments dateTimeFormat and x.
    return FormatDateTime(dateTimeFormat, x);
};

defineProperty(Intl, '__applyLocaleSensitivePrototypes', {
    writable: true,
    configurable: true,
    value: function value() {
        defineProperty(Number.prototype, 'toLocaleString', { writable: true, configurable: true, value: ls.Number.toLocaleString });
        // Need this here for IE 8, to avoid the _DontEnum_ bug
        defineProperty(Date.prototype, 'toLocaleString', { writable: true, configurable: true, value: ls.Date.toLocaleString });

        for (var k in ls.Date) {
            if (hop.call(ls.Date, k)) defineProperty(Date.prototype, k, { writable: true, configurable: true, value: ls.Date[k] });
        }
    }
});

/**
 * Can't really ship a single script with data for hundreds of locales, so we provide
 * this __addLocaleData method as a means for the developer to add the data on an
 * as-needed basis
 */
defineProperty(Intl, '__addLocaleData', {
    value: function value(data) {
        if (!IsStructurallyValidLanguageTag(data.locale)) throw new Error("Object passed doesn't identify itself with a valid language tag");

        addLocaleData(data, data.locale);
    }
});

function addLocaleData(data, tag) {
    // Both NumberFormat and DateTimeFormat require number data, so throw if it isn't present
    if (!data.number) throw new Error("Object passed doesn't contain locale data for Intl.NumberFormat");

    var locale = void 0,
        locales = [tag],
        parts = tag.split('-');

    // Create fallbacks for locale data with scripts, e.g. Latn, Hans, Vaii, etc
    if (parts.length > 2 && parts[1].length === 4) arrPush.call(locales, parts[0] + '-' + parts[2]);

    while (locale = arrShift.call(locales)) {
        // Add to NumberFormat internal properties as per 11.2.3
        arrPush.call(internals.NumberFormat['[[availableLocales]]'], locale);
        internals.NumberFormat['[[localeData]]'][locale] = data.number;

        // ...and DateTimeFormat internal properties as per 12.2.3
        if (data.date) {
            data.date.nu = data.number.nu;
            arrPush.call(internals.DateTimeFormat['[[availableLocales]]'], locale);
            internals.DateTimeFormat['[[localeData]]'][locale] = data.date;
        }
    }

    // If this is the first set of locale data added, make it the default
    if (defaultLocale === undefined) setDefaultLocale(tag);
}

module.exports = Intl;
},{}],32:[function(require,module,exports){
IntlPolyfill.__addLocaleData({locale:"en-US",date:{ca:["gregory","buddhist","chinese","coptic","dangi","ethioaa","ethiopic","generic","hebrew","indian","islamic","islamicc","japanese","persian","roc"],hourNo0:true,hour12:true,formats:{short:"{1}, {0}",medium:"{1}, {0}",full:"{1} 'at' {0}",long:"{1} 'at' {0}",availableFormats:{"d":"d","E":"ccc",Ed:"d E",Ehm:"E h:mm a",EHm:"E HH:mm",Ehms:"E h:mm:ss a",EHms:"E HH:mm:ss",Gy:"y G",GyMMM:"MMM y G",GyMMMd:"MMM d, y G",GyMMMEd:"E, MMM d, y G","h":"h a","H":"HH",hm:"h:mm a",Hm:"HH:mm",hms:"h:mm:ss a",Hms:"HH:mm:ss",hmsv:"h:mm:ss a v",Hmsv:"HH:mm:ss v",hmv:"h:mm a v",Hmv:"HH:mm v","M":"L",Md:"M/d",MEd:"E, M/d",MMM:"LLL",MMMd:"MMM d",MMMEd:"E, MMM d",MMMMd:"MMMM d",ms:"mm:ss","y":"y",yM:"M/y",yMd:"M/d/y",yMEd:"E, M/d/y",yMMM:"MMM y",yMMMd:"MMM d, y",yMMMEd:"E, MMM d, y",yMMMM:"MMMM y",yQQQ:"QQQ y",yQQQQ:"QQQQ y"},dateFormats:{yMMMMEEEEd:"EEEE, MMMM d, y",yMMMMd:"MMMM d, y",yMMMd:"MMM d, y",yMd:"M/d/yy"},timeFormats:{hmmsszzzz:"h:mm:ss a zzzz",hmsz:"h:mm:ss a z",hms:"h:mm:ss a",hm:"h:mm a"}},calendars:{buddhist:{months:{narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],short:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],long:["January","February","March","April","May","June","July","August","September","October","November","December"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["BE"],short:["BE"],long:["BE"]},dayPeriods:{am:"AM",pm:"PM"}},chinese:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Mo1","Mo2","Mo3","Mo4","Mo5","Mo6","Mo7","Mo8","Mo9","Mo10","Mo11","Mo12"],long:["Month1","Month2","Month3","Month4","Month5","Month6","Month7","Month8","Month9","Month10","Month11","Month12"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},dayPeriods:{am:"AM",pm:"PM"}},coptic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13"],short:["Tout","Baba","Hator","Kiahk","Toba","Amshir","Baramhat","Baramouda","Bashans","Paona","Epep","Mesra","Nasie"],long:["Tout","Baba","Hator","Kiahk","Toba","Amshir","Baramhat","Baramouda","Bashans","Paona","Epep","Mesra","Nasie"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["ERA0","ERA1"],short:["ERA0","ERA1"],long:["ERA0","ERA1"]},dayPeriods:{am:"AM",pm:"PM"}},dangi:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Mo1","Mo2","Mo3","Mo4","Mo5","Mo6","Mo7","Mo8","Mo9","Mo10","Mo11","Mo12"],long:["Month1","Month2","Month3","Month4","Month5","Month6","Month7","Month8","Month9","Month10","Month11","Month12"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},dayPeriods:{am:"AM",pm:"PM"}},ethiopic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13"],short:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"],long:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["ERA0","ERA1"],short:["ERA0","ERA1"],long:["ERA0","ERA1"]},dayPeriods:{am:"AM",pm:"PM"}},ethioaa:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13"],short:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"],long:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["ERA0"],short:["ERA0"],long:["ERA0"]},dayPeriods:{am:"AM",pm:"PM"}},generic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12"],long:["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["ERA0","ERA1"],short:["ERA0","ERA1"],long:["ERA0","ERA1"]},dayPeriods:{am:"AM",pm:"PM"}},gregory:{months:{narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],short:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],long:["January","February","March","April","May","June","July","August","September","October","November","December"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["B","A","BCE","CE"],short:["BC","AD","BCE","CE"],long:["Before Christ","Anno Domini","Before Common Era","Common Era"]},dayPeriods:{am:"AM",pm:"PM"}},hebrew:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13","7"],short:["Tishri","Heshvan","Kislev","Tevet","Shevat","Adar I","Adar","Nisan","Iyar","Sivan","Tamuz","Av","Elul","Adar II"],long:["Tishri","Heshvan","Kislev","Tevet","Shevat","Adar I","Adar","Nisan","Iyar","Sivan","Tamuz","Av","Elul","Adar II"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["AM"],short:["AM"],long:["AM"]},dayPeriods:{am:"AM",pm:"PM"}},indian:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Chaitra","Vaisakha","Jyaistha","Asadha","Sravana","Bhadra","Asvina","Kartika","Agrahayana","Pausa","Magha","Phalguna"],long:["Chaitra","Vaisakha","Jyaistha","Asadha","Sravana","Bhadra","Asvina","Kartika","Agrahayana","Pausa","Magha","Phalguna"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["Saka"],short:["Saka"],long:["Saka"]},dayPeriods:{am:"AM",pm:"PM"}},islamic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Muh.","Saf.","Rab. I","Rab. II","Jum. I","Jum. II","Raj.","Sha.","Ram.","Shaw.","Dhuʻl-Q.","Dhuʻl-H."],long:["Muharram","Safar","Rabiʻ I","Rabiʻ II","Jumada I","Jumada II","Rajab","Shaʻban","Ramadan","Shawwal","Dhuʻl-Qiʻdah","Dhuʻl-Hijjah"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["AH"],short:["AH"],long:["AH"]},dayPeriods:{am:"AM",pm:"PM"}},islamicc:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Muh.","Saf.","Rab. I","Rab. II","Jum. I","Jum. II","Raj.","Sha.","Ram.","Shaw.","Dhuʻl-Q.","Dhuʻl-H."],long:["Muharram","Safar","Rabiʻ I","Rabiʻ II","Jumada I","Jumada II","Rajab","Shaʻban","Ramadan","Shawwal","Dhuʻl-Qiʻdah","Dhuʻl-Hijjah"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["AH"],short:["AH"],long:["AH"]},dayPeriods:{am:"AM",pm:"PM"}},japanese:{months:{narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],short:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],long:["January","February","March","April","May","June","July","August","September","October","November","December"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["Taika (645–650)","Hakuchi (650–671)","Hakuhō (672–686)","Shuchō (686–701)","Taihō (701–704)","Keiun (704–708)","Wadō (708–715)","Reiki (715–717)","Yōrō (717–724)","Jinki (724–729)","Tenpyō (729–749)","Tenpyō-kampō (749-749)","Tenpyō-shōhō (749-757)","Tenpyō-hōji (757-765)","Tenpyō-jingo (765-767)","Jingo-keiun (767-770)","Hōki (770–780)","Ten-ō (781-782)","Enryaku (782–806)","Daidō (806–810)","Kōnin (810–824)","Tenchō (824–834)","Jōwa (834–848)","Kajō (848–851)","Ninju (851–854)","Saikō (854–857)","Ten-an (857-859)","Jōgan (859–877)","Gangyō (877–885)","Ninna (885–889)","Kanpyō (889–898)","Shōtai (898–901)","Engi (901–923)","Enchō (923–931)","Jōhei (931–938)","Tengyō (938–947)","Tenryaku (947–957)","Tentoku (957–961)","Ōwa (961–964)","Kōhō (964–968)","Anna (968–970)","Tenroku (970–973)","Ten’en (973–976)","Jōgen (976–978)","Tengen (978–983)","Eikan (983–985)","Kanna (985–987)","Eien (987–989)","Eiso (989–990)","Shōryaku (990–995)","Chōtoku (995–999)","Chōhō (999–1004)","Kankō (1004–1012)","Chōwa (1012–1017)","Kannin (1017–1021)","Jian (1021–1024)","Manju (1024–1028)","Chōgen (1028–1037)","Chōryaku (1037–1040)","Chōkyū (1040–1044)","Kantoku (1044–1046)","Eishō (1046–1053)","Tengi (1053–1058)","Kōhei (1058–1065)","Jiryaku (1065–1069)","Enkyū (1069–1074)","Shōho (1074–1077)","Shōryaku (1077–1081)","Eihō (1081–1084)","Ōtoku (1084–1087)","Kanji (1087–1094)","Kahō (1094–1096)","Eichō (1096–1097)","Jōtoku (1097–1099)","Kōwa (1099–1104)","Chōji (1104–1106)","Kashō (1106–1108)","Tennin (1108–1110)","Ten-ei (1110-1113)","Eikyū (1113–1118)","Gen’ei (1118–1120)","Hōan (1120–1124)","Tenji (1124–1126)","Daiji (1126–1131)","Tenshō (1131–1132)","Chōshō (1132–1135)","Hōen (1135–1141)","Eiji (1141–1142)","Kōji (1142–1144)","Ten’yō (1144–1145)","Kyūan (1145–1151)","Ninpei (1151–1154)","Kyūju (1154–1156)","Hōgen (1156–1159)","Heiji (1159–1160)","Eiryaku (1160–1161)","Ōho (1161–1163)","Chōkan (1163–1165)","Eiman (1165–1166)","Nin’an (1166–1169)","Kaō (1169–1171)","Shōan (1171–1175)","Angen (1175–1177)","Jishō (1177–1181)","Yōwa (1181–1182)","Juei (1182–1184)","Genryaku (1184–1185)","Bunji (1185–1190)","Kenkyū (1190–1199)","Shōji (1199–1201)","Kennin (1201–1204)","Genkyū (1204–1206)","Ken’ei (1206–1207)","Jōgen (1207–1211)","Kenryaku (1211–1213)","Kenpō (1213–1219)","Jōkyū (1219–1222)","Jōō (1222–1224)","Gennin (1224–1225)","Karoku (1225–1227)","Antei (1227–1229)","Kanki (1229–1232)","Jōei (1232–1233)","Tenpuku (1233–1234)","Bunryaku (1234–1235)","Katei (1235–1238)","Ryakunin (1238–1239)","En’ō (1239–1240)","Ninji (1240–1243)","Kangen (1243–1247)","Hōji (1247–1249)","Kenchō (1249–1256)","Kōgen (1256–1257)","Shōka (1257–1259)","Shōgen (1259–1260)","Bun’ō (1260–1261)","Kōchō (1261–1264)","Bun’ei (1264–1275)","Kenji (1275–1278)","Kōan (1278–1288)","Shōō (1288–1293)","Einin (1293–1299)","Shōan (1299–1302)","Kengen (1302–1303)","Kagen (1303–1306)","Tokuji (1306–1308)","Enkyō (1308–1311)","Ōchō (1311–1312)","Shōwa (1312–1317)","Bunpō (1317–1319)","Genō (1319–1321)","Genkō (1321–1324)","Shōchū (1324–1326)","Karyaku (1326–1329)","Gentoku (1329–1331)","Genkō (1331–1334)","Kenmu (1334–1336)","Engen (1336–1340)","Kōkoku (1340–1346)","Shōhei (1346–1370)","Kentoku (1370–1372)","Bunchū (1372–1375)","Tenju (1375–1379)","Kōryaku (1379–1381)","Kōwa (1381–1384)","Genchū (1384–1392)","Meitoku (1384–1387)","Kakei (1387–1389)","Kōō (1389–1390)","Meitoku (1390–1394)","Ōei (1394–1428)","Shōchō (1428–1429)","Eikyō (1429–1441)","Kakitsu (1441–1444)","Bun’an (1444–1449)","Hōtoku (1449–1452)","Kyōtoku (1452–1455)","Kōshō (1455–1457)","Chōroku (1457–1460)","Kanshō (1460–1466)","Bunshō (1466–1467)","Ōnin (1467–1469)","Bunmei (1469–1487)","Chōkyō (1487–1489)","Entoku (1489–1492)","Meiō (1492–1501)","Bunki (1501–1504)","Eishō (1504–1521)","Taiei (1521–1528)","Kyōroku (1528–1532)","Tenbun (1532–1555)","Kōji (1555–1558)","Eiroku (1558–1570)","Genki (1570–1573)","Tenshō (1573–1592)","Bunroku (1592–1596)","Keichō (1596–1615)","Genna (1615–1624)","Kan’ei (1624–1644)","Shōho (1644–1648)","Keian (1648–1652)","Jōō (1652–1655)","Meireki (1655–1658)","Manji (1658–1661)","Kanbun (1661–1673)","Enpō (1673–1681)","Tenna (1681–1684)","Jōkyō (1684–1688)","Genroku (1688–1704)","Hōei (1704–1711)","Shōtoku (1711–1716)","Kyōhō (1716–1736)","Genbun (1736–1741)","Kanpō (1741–1744)","Enkyō (1744–1748)","Kan’en (1748–1751)","Hōreki (1751–1764)","Meiwa (1764–1772)","An’ei (1772–1781)","Tenmei (1781–1789)","Kansei (1789–1801)","Kyōwa (1801–1804)","Bunka (1804–1818)","Bunsei (1818–1830)","Tenpō (1830–1844)","Kōka (1844–1848)","Kaei (1848–1854)","Ansei (1854–1860)","Man’en (1860–1861)","Bunkyū (1861–1864)","Genji (1864–1865)","Keiō (1865–1868)","M","T","S","H"],short:["Taika (645–650)","Hakuchi (650–671)","Hakuhō (672–686)","Shuchō (686–701)","Taihō (701–704)","Keiun (704–708)","Wadō (708–715)","Reiki (715–717)","Yōrō (717–724)","Jinki (724–729)","Tenpyō (729–749)","Tenpyō-kampō (749-749)","Tenpyō-shōhō (749-757)","Tenpyō-hōji (757-765)","Tenpyō-jingo (765-767)","Jingo-keiun (767-770)","Hōki (770–780)","Ten-ō (781-782)","Enryaku (782–806)","Daidō (806–810)","Kōnin (810–824)","Tenchō (824–834)","Jōwa (834–848)","Kajō (848–851)","Ninju (851–854)","Saikō (854–857)","Ten-an (857-859)","Jōgan (859–877)","Gangyō (877–885)","Ninna (885–889)","Kanpyō (889–898)","Shōtai (898–901)","Engi (901–923)","Enchō (923–931)","Jōhei (931–938)","Tengyō (938–947)","Tenryaku (947–957)","Tentoku (957–961)","Ōwa (961–964)","Kōhō (964–968)","Anna (968–970)","Tenroku (970–973)","Ten’en (973–976)","Jōgen (976–978)","Tengen (978–983)","Eikan (983–985)","Kanna (985–987)","Eien (987–989)","Eiso (989–990)","Shōryaku (990–995)","Chōtoku (995–999)","Chōhō (999–1004)","Kankō (1004–1012)","Chōwa (1012–1017)","Kannin (1017–1021)","Jian (1021–1024)","Manju (1024–1028)","Chōgen (1028–1037)","Chōryaku (1037–1040)","Chōkyū (1040–1044)","Kantoku (1044–1046)","Eishō (1046–1053)","Tengi (1053–1058)","Kōhei (1058–1065)","Jiryaku (1065–1069)","Enkyū (1069–1074)","Shōho (1074–1077)","Shōryaku (1077–1081)","Eihō (1081–1084)","Ōtoku (1084–1087)","Kanji (1087–1094)","Kahō (1094–1096)","Eichō (1096–1097)","Jōtoku (1097–1099)","Kōwa (1099–1104)","Chōji (1104–1106)","Kashō (1106–1108)","Tennin (1108–1110)","Ten-ei (1110-1113)","Eikyū (1113–1118)","Gen’ei (1118–1120)","Hōan (1120–1124)","Tenji (1124–1126)","Daiji (1126–1131)","Tenshō (1131–1132)","Chōshō (1132–1135)","Hōen (1135–1141)","Eiji (1141–1142)","Kōji (1142–1144)","Ten’yō (1144–1145)","Kyūan (1145–1151)","Ninpei (1151–1154)","Kyūju (1154–1156)","Hōgen (1156–1159)","Heiji (1159–1160)","Eiryaku (1160–1161)","Ōho (1161–1163)","Chōkan (1163–1165)","Eiman (1165–1166)","Nin’an (1166–1169)","Kaō (1169–1171)","Shōan (1171–1175)","Angen (1175–1177)","Jishō (1177–1181)","Yōwa (1181–1182)","Juei (1182–1184)","Genryaku (1184–1185)","Bunji (1185–1190)","Kenkyū (1190–1199)","Shōji (1199–1201)","Kennin (1201–1204)","Genkyū (1204–1206)","Ken’ei (1206–1207)","Jōgen (1207–1211)","Kenryaku (1211–1213)","Kenpō (1213–1219)","Jōkyū (1219–1222)","Jōō (1222–1224)","Gennin (1224–1225)","Karoku (1225–1227)","Antei (1227–1229)","Kanki (1229–1232)","Jōei (1232–1233)","Tenpuku (1233–1234)","Bunryaku (1234–1235)","Katei (1235–1238)","Ryakunin (1238–1239)","En’ō (1239–1240)","Ninji (1240–1243)","Kangen (1243–1247)","Hōji (1247–1249)","Kenchō (1249–1256)","Kōgen (1256–1257)","Shōka (1257–1259)","Shōgen (1259–1260)","Bun’ō (1260–1261)","Kōchō (1261–1264)","Bun’ei (1264–1275)","Kenji (1275–1278)","Kōan (1278–1288)","Shōō (1288–1293)","Einin (1293–1299)","Shōan (1299–1302)","Kengen (1302–1303)","Kagen (1303–1306)","Tokuji (1306–1308)","Enkyō (1308–1311)","Ōchō (1311–1312)","Shōwa (1312–1317)","Bunpō (1317–1319)","Genō (1319–1321)","Genkō (1321–1324)","Shōchū (1324–1326)","Karyaku (1326–1329)","Gentoku (1329–1331)","Genkō (1331–1334)","Kenmu (1334–1336)","Engen (1336–1340)","Kōkoku (1340–1346)","Shōhei (1346–1370)","Kentoku (1370–1372)","Bunchū (1372–1375)","Tenju (1375–1379)","Kōryaku (1379–1381)","Kōwa (1381–1384)","Genchū (1384–1392)","Meitoku (1384–1387)","Kakei (1387–1389)","Kōō (1389–1390)","Meitoku (1390–1394)","Ōei (1394–1428)","Shōchō (1428–1429)","Eikyō (1429–1441)","Kakitsu (1441–1444)","Bun’an (1444–1449)","Hōtoku (1449–1452)","Kyōtoku (1452–1455)","Kōshō (1455–1457)","Chōroku (1457–1460)","Kanshō (1460–1466)","Bunshō (1466–1467)","Ōnin (1467–1469)","Bunmei (1469–1487)","Chōkyō (1487–1489)","Entoku (1489–1492)","Meiō (1492–1501)","Bunki (1501–1504)","Eishō (1504–1521)","Taiei (1521–1528)","Kyōroku (1528–1532)","Tenbun (1532–1555)","Kōji (1555–1558)","Eiroku (1558–1570)","Genki (1570–1573)","Tenshō (1573–1592)","Bunroku (1592–1596)","Keichō (1596–1615)","Genna (1615–1624)","Kan’ei (1624–1644)","Shōho (1644–1648)","Keian (1648–1652)","Jōō (1652–1655)","Meireki (1655–1658)","Manji (1658–1661)","Kanbun (1661–1673)","Enpō (1673–1681)","Tenna (1681–1684)","Jōkyō (1684–1688)","Genroku (1688–1704)","Hōei (1704–1711)","Shōtoku (1711–1716)","Kyōhō (1716–1736)","Genbun (1736–1741)","Kanpō (1741–1744)","Enkyō (1744–1748)","Kan’en (1748–1751)","Hōreki (1751–1764)","Meiwa (1764–1772)","An’ei (1772–1781)","Tenmei (1781–1789)","Kansei (1789–1801)","Kyōwa (1801–1804)","Bunka (1804–1818)","Bunsei (1818–1830)","Tenpō (1830–1844)","Kōka (1844–1848)","Kaei (1848–1854)","Ansei (1854–1860)","Man’en (1860–1861)","Bunkyū (1861–1864)","Genji (1864–1865)","Keiō (1865–1868)","Meiji","Taishō","Shōwa","Heisei"],long:["Taika (645–650)","Hakuchi (650–671)","Hakuhō (672–686)","Shuchō (686–701)","Taihō (701–704)","Keiun (704–708)","Wadō (708–715)","Reiki (715–717)","Yōrō (717–724)","Jinki (724–729)","Tenpyō (729–749)","Tenpyō-kampō (749-749)","Tenpyō-shōhō (749-757)","Tenpyō-hōji (757-765)","Tenpyō-jingo (765-767)","Jingo-keiun (767-770)","Hōki (770–780)","Ten-ō (781-782)","Enryaku (782–806)","Daidō (806–810)","Kōnin (810–824)","Tenchō (824–834)","Jōwa (834–848)","Kajō (848–851)","Ninju (851–854)","Saikō (854–857)","Ten-an (857-859)","Jōgan (859–877)","Gangyō (877–885)","Ninna (885–889)","Kanpyō (889–898)","Shōtai (898–901)","Engi (901–923)","Enchō (923–931)","Jōhei (931–938)","Tengyō (938–947)","Tenryaku (947–957)","Tentoku (957–961)","Ōwa (961–964)","Kōhō (964–968)","Anna (968–970)","Tenroku (970–973)","Ten’en (973–976)","Jōgen (976–978)","Tengen (978–983)","Eikan (983–985)","Kanna (985–987)","Eien (987–989)","Eiso (989–990)","Shōryaku (990–995)","Chōtoku (995–999)","Chōhō (999–1004)","Kankō (1004–1012)","Chōwa (1012–1017)","Kannin (1017–1021)","Jian (1021–1024)","Manju (1024–1028)","Chōgen (1028–1037)","Chōryaku (1037–1040)","Chōkyū (1040–1044)","Kantoku (1044–1046)","Eishō (1046–1053)","Tengi (1053–1058)","Kōhei (1058–1065)","Jiryaku (1065–1069)","Enkyū (1069–1074)","Shōho (1074–1077)","Shōryaku (1077–1081)","Eihō (1081–1084)","Ōtoku (1084–1087)","Kanji (1087–1094)","Kahō (1094–1096)","Eichō (1096–1097)","Jōtoku (1097–1099)","Kōwa (1099–1104)","Chōji (1104–1106)","Kashō (1106–1108)","Tennin (1108–1110)","Ten-ei (1110-1113)","Eikyū (1113–1118)","Gen’ei (1118–1120)","Hōan (1120–1124)","Tenji (1124–1126)","Daiji (1126–1131)","Tenshō (1131–1132)","Chōshō (1132–1135)","Hōen (1135–1141)","Eiji (1141–1142)","Kōji (1142–1144)","Ten’yō (1144–1145)","Kyūan (1145–1151)","Ninpei (1151–1154)","Kyūju (1154–1156)","Hōgen (1156–1159)","Heiji (1159–1160)","Eiryaku (1160–1161)","Ōho (1161–1163)","Chōkan (1163–1165)","Eiman (1165–1166)","Nin’an (1166–1169)","Kaō (1169–1171)","Shōan (1171–1175)","Angen (1175–1177)","Jishō (1177–1181)","Yōwa (1181–1182)","Juei (1182–1184)","Genryaku (1184–1185)","Bunji (1185–1190)","Kenkyū (1190–1199)","Shōji (1199–1201)","Kennin (1201–1204)","Genkyū (1204–1206)","Ken’ei (1206–1207)","Jōgen (1207–1211)","Kenryaku (1211–1213)","Kenpō (1213–1219)","Jōkyū (1219–1222)","Jōō (1222–1224)","Gennin (1224–1225)","Karoku (1225–1227)","Antei (1227–1229)","Kanki (1229–1232)","Jōei (1232–1233)","Tenpuku (1233–1234)","Bunryaku (1234–1235)","Katei (1235–1238)","Ryakunin (1238–1239)","En’ō (1239–1240)","Ninji (1240–1243)","Kangen (1243–1247)","Hōji (1247–1249)","Kenchō (1249–1256)","Kōgen (1256–1257)","Shōka (1257–1259)","Shōgen (1259–1260)","Bun’ō (1260–1261)","Kōchō (1261–1264)","Bun’ei (1264–1275)","Kenji (1275–1278)","Kōan (1278–1288)","Shōō (1288–1293)","Einin (1293–1299)","Shōan (1299–1302)","Kengen (1302–1303)","Kagen (1303–1306)","Tokuji (1306–1308)","Enkyō (1308–1311)","Ōchō (1311–1312)","Shōwa (1312–1317)","Bunpō (1317–1319)","Genō (1319–1321)","Genkō (1321–1324)","Shōchū (1324–1326)","Karyaku (1326–1329)","Gentoku (1329–1331)","Genkō (1331–1334)","Kenmu (1334–1336)","Engen (1336–1340)","Kōkoku (1340–1346)","Shōhei (1346–1370)","Kentoku (1370–1372)","Bunchū (1372–1375)","Tenju (1375–1379)","Kōryaku (1379–1381)","Kōwa (1381–1384)","Genchū (1384–1392)","Meitoku (1384–1387)","Kakei (1387–1389)","Kōō (1389–1390)","Meitoku (1390–1394)","Ōei (1394–1428)","Shōchō (1428–1429)","Eikyō (1429–1441)","Kakitsu (1441–1444)","Bun’an (1444–1449)","Hōtoku (1449–1452)","Kyōtoku (1452–1455)","Kōshō (1455–1457)","Chōroku (1457–1460)","Kanshō (1460–1466)","Bunshō (1466–1467)","Ōnin (1467–1469)","Bunmei (1469–1487)","Chōkyō (1487–1489)","Entoku (1489–1492)","Meiō (1492–1501)","Bunki (1501–1504)","Eishō (1504–1521)","Taiei (1521–1528)","Kyōroku (1528–1532)","Tenbun (1532–1555)","Kōji (1555–1558)","Eiroku (1558–1570)","Genki (1570–1573)","Tenshō (1573–1592)","Bunroku (1592–1596)","Keichō (1596–1615)","Genna (1615–1624)","Kan’ei (1624–1644)","Shōho (1644–1648)","Keian (1648–1652)","Jōō (1652–1655)","Meireki (1655–1658)","Manji (1658–1661)","Kanbun (1661–1673)","Enpō (1673–1681)","Tenna (1681–1684)","Jōkyō (1684–1688)","Genroku (1688–1704)","Hōei (1704–1711)","Shōtoku (1711–1716)","Kyōhō (1716–1736)","Genbun (1736–1741)","Kanpō (1741–1744)","Enkyō (1744–1748)","Kan’en (1748–1751)","Hōreki (1751–1764)","Meiwa (1764–1772)","An’ei (1772–1781)","Tenmei (1781–1789)","Kansei (1789–1801)","Kyōwa (1801–1804)","Bunka (1804–1818)","Bunsei (1818–1830)","Tenpō (1830–1844)","Kōka (1844–1848)","Kaei (1848–1854)","Ansei (1854–1860)","Man’en (1860–1861)","Bunkyū (1861–1864)","Genji (1864–1865)","Keiō (1865–1868)","Meiji","Taishō","Shōwa","Heisei"]},dayPeriods:{am:"AM",pm:"PM"}},persian:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Farvardin","Ordibehesht","Khordad","Tir","Mordad","Shahrivar","Mehr","Aban","Azar","Dey","Bahman","Esfand"],long:["Farvardin","Ordibehesht","Khordad","Tir","Mordad","Shahrivar","Mehr","Aban","Azar","Dey","Bahman","Esfand"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["AP"],short:["AP"],long:["AP"]},dayPeriods:{am:"AM",pm:"PM"}},roc:{months:{narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],short:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],long:["January","February","March","April","May","June","July","August","September","October","November","December"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["Before R.O.C.","Minguo"],short:["Before R.O.C.","Minguo"],long:["Before R.O.C.","Minguo"]},dayPeriods:{am:"AM",pm:"PM"}}}},number:{nu:["latn"],patterns:{decimal:{positivePattern:"{number}",negativePattern:"{minusSign}{number}"},currency:{positivePattern:"{currency}{number}",negativePattern:"{minusSign}{currency}{number}"},percent:{positivePattern:"{number}{percentSign}",negativePattern:"{minusSign}{number}{percentSign}"}},symbols:{latn:{decimal:".",group:",",nan:"NaN",plusSign:"+",minusSign:"-",percentSign:"%",infinity:"∞"}},currencies:{AUD:"A$",BRL:"R$",CAD:"CA$",CNY:"CN¥",EUR:"€",GBP:"£",HKD:"HK$",ILS:"₪",INR:"₹",JPY:"¥",KRW:"₩",MXN:"MX$",NZD:"NZ$",TWD:"NT$",USD:"$",VND:"₫",XAF:"FCFA",XCD:"EC$",XOF:"CFA",XPF:"CFPF"}}});
},{}],33:[function(require,module,exports){
IntlPolyfill.__addLocaleData({locale:"es",date:{ca:["gregory","buddhist","chinese","coptic","dangi","ethioaa","ethiopic","generic","hebrew","indian","islamic","islamicc","japanese","persian","roc"],hourNo0:true,hour12:false,formats:{short:"{1} {0}",medium:"{1} {0}",full:"{1}, {0}",long:"{1}, {0}",availableFormats:{"d":"d","E":"ccc",Ed:"E d",Ehm:"E, h:mm a",EHm:"E, H:mm",Ehms:"E, h:mm:ss a",EHms:"E, H:mm:ss",Gy:"y G",GyMMM:"MMM y G",GyMMMd:"d MMM y G",GyMMMEd:"E, d MMM y G",GyMMMM:"MMMM 'de' y G",GyMMMMd:"d 'de' MMMM 'de' y G",GyMMMMEd:"E, d 'de' MMMM 'de' y G","h":"h a","H":"H",hm:"h:mm a",Hm:"H:mm",hms:"h:mm:ss a",Hms:"H:mm:ss",hmsv:"h:mm:ss a v",Hmsv:"H:mm:ss v",hmsvvvv:"h:mm:ss a (vvvv)",Hmsvvvv:"H:mm:ss (vvvv)",hmv:"h:mm a v",Hmv:"H:mm v","M":"L",Md:"d/M",MEd:"E, d/M",MMd:"d/M",MMdd:"d/M",MMM:"LLL",MMMd:"d MMM",MMMEd:"E, d MMM",MMMMd:"d 'de' MMMM",MMMMEd:"E, d 'de' MMMM",ms:"mm:ss","y":"y",yM:"M/y",yMd:"d/M/y",yMEd:"EEE, d/M/y",yMM:"M/y",yMMM:"MMM y",yMMMd:"d MMM y",yMMMEd:"EEE, d MMM y",yMMMM:"MMMM 'de' y",yMMMMd:"d 'de' MMMM 'de' y",yMMMMEd:"EEE, d 'de' MMMM 'de' y",yQQQ:"QQQ y",yQQQQ:"QQQQ 'de' y"},dateFormats:{yMMMMEEEEd:"EEEE, d 'de' MMMM 'de' y",yMMMMd:"d 'de' MMMM 'de' y",yMMMd:"d MMM y",yMd:"d/M/yy"},timeFormats:{hmmsszzzz:"H:mm:ss (zzzz)",hmsz:"H:mm:ss z",hms:"H:mm:ss",hm:"H:mm"}},calendars:{buddhist:{months:{narrow:["E","F","M","A","M","J","J","A","S","O","N","D"],short:["ene.","feb.","mar.","abr.","may.","jun.","jul.","ago.","sept.","oct.","nov.","dic."],long:["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["BE"],short:["BE"],long:["BE"]},dayPeriods:{am:"a. m.",pm:"p. m."}},chinese:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12"],long:["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},dayPeriods:{am:"a. m.",pm:"p. m."}},coptic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13"],short:["Tout","Baba","Hator","Kiahk","Toba","Amshir","Baramhat","Baramouda","Bashans","Paona","Epep","Mesra","Nasie"],long:["Tout","Baba","Hator","Kiahk","Toba","Amshir","Baramhat","Baramouda","Bashans","Paona","Epep","Mesra","Nasie"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["ERA0","ERA1"],short:["ERA0","ERA1"],long:["ERA0","ERA1"]},dayPeriods:{am:"a. m.",pm:"p. m."}},dangi:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12"],long:["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},dayPeriods:{am:"a. m.",pm:"p. m."}},ethiopic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13"],short:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"],long:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["ERA0","ERA1"],short:["ERA0","ERA1"],long:["ERA0","ERA1"]},dayPeriods:{am:"a. m.",pm:"p. m."}},ethioaa:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13"],short:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"],long:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["ERA0"],short:["ERA0"],long:["ERA0"]},dayPeriods:{am:"a. m.",pm:"p. m."}},generic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12"],long:["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["ERA0","ERA1"],short:["ERA0","ERA1"],long:["ERA0","ERA1"]},dayPeriods:{am:"a. m.",pm:"p. m."}},gregory:{months:{narrow:["E","F","M","A","M","J","J","A","S","O","N","D"],short:["ene.","feb.","mar.","abr.","may.","jun.","jul.","ago.","sept.","oct.","nov.","dic."],long:["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["a. C.","d. C.","a. e. c.","e. c."],short:["a. C.","d. C.","a. e. c.","e. c."],long:["antes de Cristo","después de Cristo","antes de la era común","era común"]},dayPeriods:{am:"a. m.",pm:"p. m."}},hebrew:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13","7"],short:["Tishri","Heshvan","Kislev","Tevet","Shevat","Adar I","Adar","Nisan","Iyar","Sivan","Tamuz","Av","Elul","Adar II"],long:["Tishri","Heshvan","Kislev","Tevet","Shevat","Adar I","Adar","Nisan","Iyar","Sivan","Tamuz","Av","Elul","Adar II"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["AM"],short:["AM"],long:["AM"]},dayPeriods:{am:"a. m.",pm:"p. m."}},indian:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Chaitra","Vaisakha","Jyaistha","Asadha","Sravana","Bhadra","Asvina","Kartika","Agrahayana","Pausa","Magha","Phalguna"],long:["Chaitra","Vaisakha","Jyaistha","Asadha","Sravana","Bhadra","Asvina","Kartika","Agrahayana","Pausa","Magha","Phalguna"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["Saka"],short:["Saka"],long:["Saka"]},dayPeriods:{am:"a. m.",pm:"p. m."}},islamic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Muh.","Saf.","Rab. I","Rab. II","Jum. I","Jum. II","Raj.","Sha.","Ram.","Shaw.","Dhuʻl-Q.","Dhuʻl-H."],long:["Muharram","Safar","Rabiʻ I","Rabiʻ II","Jumada I","Jumada II","Rajab","Shaʻban","Ramadan","Shawwal","Dhuʻl-Qiʻdah","Dhuʻl-Hijjah"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["AH"],short:["AH"],long:["AH"]},dayPeriods:{am:"a. m.",pm:"p. m."}},islamicc:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Muh.","Saf.","Rab. I","Rab. II","Jum. I","Jum. II","Raj.","Sha.","Ram.","Shaw.","Dhuʻl-Q.","Dhuʻl-H."],long:["Muharram","Safar","Rabiʻ I","Rabiʻ II","Jumada I","Jumada II","Rajab","Shaʻban","Ramadan","Shawwal","Dhuʻl-Qiʻdah","Dhuʻl-Hijjah"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["AH"],short:["AH"],long:["AH"]},dayPeriods:{am:"a. m.",pm:"p. m."}},japanese:{months:{narrow:["E","F","M","A","M","J","J","A","S","O","N","D"],short:["ene.","feb.","mar.","abr.","may.","jun.","jul.","ago.","sept.","oct.","nov.","dic."],long:["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["Taika (645–650)","Hakuchi (650–671)","Hakuhō (672–686)","Shuchō (686–701)","Taihō (701–704)","Keiun (704–708)","Wadō (708–715)","Reiki (715–717)","Yōrō (717–724)","Jinki (724–729)","Tenpyō (729–749)","Tenpyō-kampō (749-749)","Tenpyō-shōhō (749-757)","Tenpyō-hōji (757-765)","Tenpyō-jingo (765-767)","Jingo-keiun (767-770)","Hōki (770–780)","Ten-ō (781-782)","Enryaku (782–806)","Daidō (806–810)","Kōnin (810–824)","Tenchō (824–834)","Jōwa (834–848)","Kajō (848–851)","Ninju (851–854)","Saikō (854–857)","Ten-an (857-859)","Jōgan (859–877)","Gangyō (877–885)","Ninna (885–889)","Kanpyō (889–898)","Shōtai (898–901)","Engi (901–923)","Enchō (923–931)","Jōhei (931–938)","Tengyō (938–947)","Tenryaku (947–957)","Tentoku (957–961)","Ōwa (961–964)","Kōhō (964–968)","Anna (968–970)","Tenroku (970–973)","Ten’en (973–976)","Jōgen (976–978)","Tengen (978–983)","Eikan (983–985)","Kanna (985–987)","Eien (987–989)","Eiso (989–990)","Shōryaku (990–995)","Chōtoku (995–999)","Chōhō (999–1004)","Kankō (1004–1012)","Chōwa (1012–1017)","Kannin (1017–1021)","Jian (1021–1024)","Manju (1024–1028)","Chōgen (1028–1037)","Chōryaku (1037–1040)","Chōkyū (1040–1044)","Kantoku (1044–1046)","Eishō (1046–1053)","Tengi (1053–1058)","Kōhei (1058–1065)","Jiryaku (1065–1069)","Enkyū (1069–1074)","Shōho (1074–1077)","Shōryaku (1077–1081)","Eihō (1081–1084)","Ōtoku (1084–1087)","Kanji (1087–1094)","Kahō (1094–1096)","Eichō (1096–1097)","Jōtoku (1097–1099)","Kōwa (1099–1104)","Chōji (1104–1106)","Kashō (1106–1108)","Tennin (1108–1110)","Ten-ei (1110-1113)","Eikyū (1113–1118)","Gen’ei (1118–1120)","Hōan (1120–1124)","Tenji (1124–1126)","Daiji (1126–1131)","Tenshō (1131–1132)","Chōshō (1132–1135)","Hōen (1135–1141)","Eiji (1141–1142)","Kōji (1142–1144)","Ten’yō (1144–1145)","Kyūan (1145–1151)","Ninpei (1151–1154)","Kyūju (1154–1156)","Hōgen (1156–1159)","Heiji (1159–1160)","Eiryaku (1160–1161)","Ōho (1161–1163)","Chōkan (1163–1165)","Eiman (1165–1166)","Nin’an (1166–1169)","Kaō (1169–1171)","Shōan (1171–1175)","Angen (1175–1177)","Jishō (1177–1181)","Yōwa (1181–1182)","Juei (1182–1184)","Genryaku (1184–1185)","Bunji (1185–1190)","Kenkyū (1190–1199)","Shōji (1199–1201)","Kennin (1201–1204)","Genkyū (1204–1206)","Ken’ei (1206–1207)","Jōgen (1207–1211)","Kenryaku (1211–1213)","Kenpō (1213–1219)","Jōkyū (1219–1222)","Jōō (1222–1224)","Gennin (1224–1225)","Karoku (1225–1227)","Antei (1227–1229)","Kanki (1229–1232)","Jōei (1232–1233)","Tenpuku (1233–1234)","Bunryaku (1234–1235)","Katei (1235–1238)","Ryakunin (1238–1239)","En’ō (1239–1240)","Ninji (1240–1243)","Kangen (1243–1247)","Hōji (1247–1249)","Kenchō (1249–1256)","Kōgen (1256–1257)","Shōka (1257–1259)","Shōgen (1259–1260)","Bun’ō (1260–1261)","Kōchō (1261–1264)","Bun’ei (1264–1275)","Kenji (1275–1278)","Kōan (1278–1288)","Shōō (1288–1293)","Einin (1293–1299)","Shōan (1299–1302)","Kengen (1302–1303)","Kagen (1303–1306)","Tokuji (1306–1308)","Enkyō (1308–1311)","Ōchō (1311–1312)","Shōwa (1312–1317)","Bunpō (1317–1319)","Genō (1319–1321)","Genkō (1321–1324)","Shōchū (1324–1326)","Karyaku (1326–1329)","Gentoku (1329–1331)","Genkō (1331–1334)","Kenmu (1334–1336)","Engen (1336–1340)","Kōkoku (1340–1346)","Shōhei (1346–1370)","Kentoku (1370–1372)","Bunchū (1372–1375)","Tenju (1375–1379)","Kōryaku (1379–1381)","Kōwa (1381–1384)","Genchū (1384–1392)","Meitoku (1384–1387)","Kakei (1387–1389)","Kōō (1389–1390)","Meitoku (1390–1394)","Ōei (1394–1428)","Shōchō (1428–1429)","Eikyō (1429–1441)","Kakitsu (1441–1444)","Bun’an (1444–1449)","Hōtoku (1449–1452)","Kyōtoku (1452–1455)","Kōshō (1455–1457)","Chōroku (1457–1460)","Kanshō (1460–1466)","Bunshō (1466–1467)","Ōnin (1467–1469)","Bunmei (1469–1487)","Chōkyō (1487–1489)","Entoku (1489–1492)","Meiō (1492–1501)","Bunki (1501–1504)","Eishō (1504–1521)","Taiei (1521–1528)","Kyōroku (1528–1532)","Tenbun (1532–1555)","Kōji (1555–1558)","Eiroku (1558–1570)","Genki (1570–1573)","Tenshō (1573–1592)","Bunroku (1592–1596)","Keichō (1596–1615)","Genna (1615–1624)","Kan’ei (1624–1644)","Shōho (1644–1648)","Keian (1648–1652)","Jōō (1652–1655)","Meireki (1655–1658)","Manji (1658–1661)","Kanbun (1661–1673)","Enpō (1673–1681)","Tenna (1681–1684)","Jōkyō (1684–1688)","Genroku (1688–1704)","Hōei (1704–1711)","Shōtoku (1711–1716)","Kyōhō (1716–1736)","Genbun (1736–1741)","Kanpō (1741–1744)","Enkyō (1744–1748)","Kan’en (1748–1751)","Hōreki (1751–1764)","Meiwa (1764–1772)","An’ei (1772–1781)","Tenmei (1781–1789)","Kansei (1789–1801)","Kyōwa (1801–1804)","Bunka (1804–1818)","Bunsei (1818–1830)","Tenpō (1830–1844)","Kōka (1844–1848)","Kaei (1848–1854)","Ansei (1854–1860)","Man’en (1860–1861)","Bunkyū (1861–1864)","Genji (1864–1865)","Keiō (1865–1868)","M","T","S","H"],short:["Taika (645–650)","Hakuchi (650–671)","Hakuhō (672–686)","Shuchō (686–701)","Taihō (701–704)","Keiun (704–708)","Wadō (708–715)","Reiki (715–717)","Yōrō (717–724)","Jinki (724–729)","Tenpyō (729–749)","Tenpyō-kampō (749-749)","Tenpyō-shōhō (749-757)","Tenpyō-hōji (757-765)","Tenpyō-jingo (765-767)","Jingo-keiun (767-770)","Hōki (770–780)","Ten-ō (781-782)","Enryaku (782–806)","Daidō (806–810)","Kōnin (810–824)","Tenchō (824–834)","Jōwa (834–848)","Kajō (848–851)","Ninju (851–854)","Saikō (854–857)","Ten-an (857-859)","Jōgan (859–877)","Gangyō (877–885)","Ninna (885–889)","Kanpyō (889–898)","Shōtai (898–901)","Engi (901–923)","Enchō (923–931)","Jōhei (931–938)","Tengyō (938–947)","Tenryaku (947–957)","Tentoku (957–961)","Ōwa (961–964)","Kōhō (964–968)","Anna (968–970)","Tenroku (970–973)","Ten’en (973–976)","Jōgen (976–978)","Tengen (978–983)","Eikan (983–985)","Kanna (985–987)","Eien (987–989)","Eiso (989–990)","Shōryaku (990–995)","Chōtoku (995–999)","Chōhō (999–1004)","Kankō (1004–1012)","Chōwa (1012–1017)","Kannin (1017–1021)","Jian (1021–1024)","Manju (1024–1028)","Chōgen (1028–1037)","Chōryaku (1037–1040)","Chōkyū (1040–1044)","Kantoku (1044–1046)","Eishō (1046–1053)","Tengi (1053–1058)","Kōhei (1058–1065)","Jiryaku (1065–1069)","Enkyū (1069–1074)","Shōho (1074–1077)","Shōryaku (1077–1081)","Eihō (1081–1084)","Ōtoku (1084–1087)","Kanji (1087–1094)","Kahō (1094–1096)","Eichō (1096–1097)","Jōtoku (1097–1099)","Kōwa (1099–1104)","Chōji (1104–1106)","Kashō (1106–1108)","Tennin (1108–1110)","Ten-ei (1110-1113)","Eikyū (1113–1118)","Gen’ei (1118–1120)","Hōan (1120–1124)","Tenji (1124–1126)","Daiji (1126–1131)","Tenshō (1131–1132)","Chōshō (1132–1135)","Hōen (1135–1141)","Eiji (1141–1142)","Kōji (1142–1144)","Ten’yō (1144–1145)","Kyūan (1145–1151)","Ninpei (1151–1154)","Kyūju (1154–1156)","Hōgen (1156–1159)","Heiji (1159–1160)","Eiryaku (1160–1161)","Ōho (1161–1163)","Chōkan (1163–1165)","Eiman (1165–1166)","Nin’an (1166–1169)","Kaō (1169–1171)","Shōan (1171–1175)","Angen (1175–1177)","Jishō (1177–1181)","Yōwa (1181–1182)","Juei (1182–1184)","Genryaku (1184–1185)","Bunji (1185–1190)","Kenkyū (1190–1199)","Shōji (1199–1201)","Kennin (1201–1204)","Genkyū (1204–1206)","Ken’ei (1206–1207)","Jōgen (1207–1211)","Kenryaku (1211–1213)","Kenpō (1213–1219)","Jōkyū (1219–1222)","Jōō (1222–1224)","Gennin (1224–1225)","Karoku (1225–1227)","Antei (1227–1229)","Kanki (1229–1232)","Jōei (1232–1233)","Tenpuku (1233–1234)","Bunryaku (1234–1235)","Katei (1235–1238)","Ryakunin (1238–1239)","En’ō (1239–1240)","Ninji (1240–1243)","Kangen (1243–1247)","Hōji (1247–1249)","Kenchō (1249–1256)","Kōgen (1256–1257)","Shōka (1257–1259)","Shōgen (1259–1260)","Bun’ō (1260–1261)","Kōchō (1261–1264)","Bun’ei (1264–1275)","Kenji (1275–1278)","Kōan (1278–1288)","Shōō (1288–1293)","Einin (1293–1299)","Shōan (1299–1302)","Kengen (1302–1303)","Kagen (1303–1306)","Tokuji (1306–1308)","Enkyō (1308–1311)","Ōchō (1311–1312)","Shōwa (1312–1317)","Bunpō (1317–1319)","Genō (1319–1321)","Genkō (1321–1324)","Shōchū (1324–1326)","Karyaku (1326–1329)","Gentoku (1329–1331)","Genkō (1331–1334)","Kenmu (1334–1336)","Engen (1336–1340)","Kōkoku (1340–1346)","Shōhei (1346–1370)","Kentoku (1370–1372)","Bunchū (1372–1375)","Tenju (1375–1379)","Kōryaku (1379–1381)","Kōwa (1381–1384)","Genchū (1384–1392)","Meitoku (1384–1387)","Kakei (1387–1389)","Kōō (1389–1390)","Meitoku (1390–1394)","Ōei (1394–1428)","Shōchō (1428–1429)","Eikyō (1429–1441)","Kakitsu (1441–1444)","Bun’an (1444–1449)","Hōtoku (1449–1452)","Kyōtoku (1452–1455)","Kōshō (1455–1457)","Chōroku (1457–1460)","Kanshō (1460–1466)","Bunshō (1466–1467)","Ōnin (1467–1469)","Bunmei (1469–1487)","Chōkyō (1487–1489)","Entoku (1489–1492)","Meiō (1492–1501)","Bunki (1501–1504)","Eishō (1504–1521)","Taiei (1521–1528)","Kyōroku (1528–1532)","Tenbun (1532–1555)","Kōji (1555–1558)","Eiroku (1558–1570)","Genki (1570–1573)","Tenshō (1573–1592)","Bunroku (1592–1596)","Keichō (1596–1615)","Genna (1615–1624)","Kan’ei (1624–1644)","Shōho (1644–1648)","Keian (1648–1652)","Jōō (1652–1655)","Meireki (1655–1658)","Manji (1658–1661)","Kanbun (1661–1673)","Enpō (1673–1681)","Tenna (1681–1684)","Jōkyō (1684–1688)","Genroku (1688–1704)","Hōei (1704–1711)","Shōtoku (1711–1716)","Kyōhō (1716–1736)","Genbun (1736–1741)","Kanpō (1741–1744)","Enkyō (1744–1748)","Kan’en (1748–1751)","Hōreki (1751–1764)","Meiwa (1764–1772)","An’ei (1772–1781)","Tenmei (1781–1789)","Kansei (1789–1801)","Kyōwa (1801–1804)","Bunka (1804–1818)","Bunsei (1818–1830)","Tenpō (1830–1844)","Kōka (1844–1848)","Kaei (1848–1854)","Ansei (1854–1860)","Man’en (1860–1861)","Bunkyū (1861–1864)","Genji (1864–1865)","Keiō (1865–1868)","Meiji","Taishō","Shōwa","Heisei"],long:["Taika (645–650)","Hakuchi (650–671)","Hakuhō (672–686)","Shuchō (686–701)","Taihō (701–704)","Keiun (704–708)","Wadō (708–715)","Reiki (715–717)","Yōrō (717–724)","Jinki (724–729)","Tenpyō (729–749)","Tenpyō-kampō (749-749)","Tenpyō-shōhō (749-757)","Tenpyō-hōji (757-765)","Tenpyō-jingo (765-767)","Jingo-keiun (767-770)","Hōki (770–780)","Ten-ō (781-782)","Enryaku (782–806)","Daidō (806–810)","Kōnin (810–824)","Tenchō (824–834)","Jōwa (834–848)","Kajō (848–851)","Ninju (851–854)","Saikō (854–857)","Ten-an (857-859)","Jōgan (859–877)","Gangyō (877–885)","Ninna (885–889)","Kanpyō (889–898)","Shōtai (898–901)","Engi (901–923)","Enchō (923–931)","Jōhei (931–938)","Tengyō (938–947)","Tenryaku (947–957)","Tentoku (957–961)","Ōwa (961–964)","Kōhō (964–968)","Anna (968–970)","Tenroku (970–973)","Ten’en (973–976)","Jōgen (976–978)","Tengen (978–983)","Eikan (983–985)","Kanna (985–987)","Eien (987–989)","Eiso (989–990)","Shōryaku (990–995)","Chōtoku (995–999)","Chōhō (999–1004)","Kankō (1004–1012)","Chōwa (1012–1017)","Kannin (1017–1021)","Jian (1021–1024)","Manju (1024–1028)","Chōgen (1028–1037)","Chōryaku (1037–1040)","Chōkyū (1040–1044)","Kantoku (1044–1046)","Eishō (1046–1053)","Tengi (1053–1058)","Kōhei (1058–1065)","Jiryaku (1065–1069)","Enkyū (1069–1074)","Shōho (1074–1077)","Shōryaku (1077–1081)","Eihō (1081–1084)","Ōtoku (1084–1087)","Kanji (1087–1094)","Kahō (1094–1096)","Eichō (1096–1097)","Jōtoku (1097–1099)","Kōwa (1099–1104)","Chōji (1104–1106)","Kashō (1106–1108)","Tennin (1108–1110)","Ten-ei (1110-1113)","Eikyū (1113–1118)","Gen’ei (1118–1120)","Hōan (1120–1124)","Tenji (1124–1126)","Daiji (1126–1131)","Tenshō (1131–1132)","Chōshō (1132–1135)","Hōen (1135–1141)","Eiji (1141–1142)","Kōji (1142–1144)","Ten’yō (1144–1145)","Kyūan (1145–1151)","Ninpei (1151–1154)","Kyūju (1154–1156)","Hōgen (1156–1159)","Heiji (1159–1160)","Eiryaku (1160–1161)","Ōho (1161–1163)","Chōkan (1163–1165)","Eiman (1165–1166)","Nin’an (1166–1169)","Kaō (1169–1171)","Shōan (1171–1175)","Angen (1175–1177)","Jishō (1177–1181)","Yōwa (1181–1182)","Juei (1182–1184)","Genryaku (1184–1185)","Bunji (1185–1190)","Kenkyū (1190–1199)","Shōji (1199–1201)","Kennin (1201–1204)","Genkyū (1204–1206)","Ken’ei (1206–1207)","Jōgen (1207–1211)","Kenryaku (1211–1213)","Kenpō (1213–1219)","Jōkyū (1219–1222)","Jōō (1222–1224)","Gennin (1224–1225)","Karoku (1225–1227)","Antei (1227–1229)","Kanki (1229–1232)","Jōei (1232–1233)","Tenpuku (1233–1234)","Bunryaku (1234–1235)","Katei (1235–1238)","Ryakunin (1238–1239)","En’ō (1239–1240)","Ninji (1240–1243)","Kangen (1243–1247)","Hōji (1247–1249)","Kenchō (1249–1256)","Kōgen (1256–1257)","Shōka (1257–1259)","Shōgen (1259–1260)","Bun’ō (1260–1261)","Kōchō (1261–1264)","Bun’ei (1264–1275)","Kenji (1275–1278)","Kōan (1278–1288)","Shōō (1288–1293)","Einin (1293–1299)","Shōan (1299–1302)","Kengen (1302–1303)","Kagen (1303–1306)","Tokuji (1306–1308)","Enkyō (1308–1311)","Ōchō (1311–1312)","Shōwa (1312–1317)","Bunpō (1317–1319)","Genō (1319–1321)","Genkō (1321–1324)","Shōchū (1324–1326)","Karyaku (1326–1329)","Gentoku (1329–1331)","Genkō (1331–1334)","Kenmu (1334–1336)","Engen (1336–1340)","Kōkoku (1340–1346)","Shōhei (1346–1370)","Kentoku (1370–1372)","Bunchū (1372–1375)","Tenju (1375–1379)","Kōryaku (1379–1381)","Kōwa (1381–1384)","Genchū (1384–1392)","Meitoku (1384–1387)","Kakei (1387–1389)","Kōō (1389–1390)","Meitoku (1390–1394)","Ōei (1394–1428)","Shōchō (1428–1429)","Eikyō (1429–1441)","Kakitsu (1441–1444)","Bun’an (1444–1449)","Hōtoku (1449–1452)","Kyōtoku (1452–1455)","Kōshō (1455–1457)","Chōroku (1457–1460)","Kanshō (1460–1466)","Bunshō (1466–1467)","Ōnin (1467–1469)","Bunmei (1469–1487)","Chōkyō (1487–1489)","Entoku (1489–1492)","Meiō (1492–1501)","Bunki (1501–1504)","Eishō (1504–1521)","Taiei (1521–1528)","Kyōroku (1528–1532)","Tenbun (1532–1555)","Kōji (1555–1558)","Eiroku (1558–1570)","Genki (1570–1573)","Tenshō (1573–1592)","Bunroku (1592–1596)","Keichō (1596–1615)","Genna (1615–1624)","Kan’ei (1624–1644)","Shōho (1644–1648)","Keian (1648–1652)","Jōō (1652–1655)","Meireki (1655–1658)","Manji (1658–1661)","Kanbun (1661–1673)","Enpō (1673–1681)","Tenna (1681–1684)","Jōkyō (1684–1688)","Genroku (1688–1704)","Hōei (1704–1711)","Shōtoku (1711–1716)","Kyōhō (1716–1736)","Genbun (1736–1741)","Kanpō (1741–1744)","Enkyō (1744–1748)","Kan’en (1748–1751)","Hōreki (1751–1764)","Meiwa (1764–1772)","An’ei (1772–1781)","Tenmei (1781–1789)","Kansei (1789–1801)","Kyōwa (1801–1804)","Bunka (1804–1818)","Bunsei (1818–1830)","Tenpō (1830–1844)","Kōka (1844–1848)","Kaei (1848–1854)","Ansei (1854–1860)","Man’en (1860–1861)","Bunkyū (1861–1864)","Genji (1864–1865)","Keiō (1865–1868)","Meiji","Taishō","Shōwa","Heisei"]},dayPeriods:{am:"a. m.",pm:"p. m."}},persian:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Farvardin","Ordibehesht","Khordad","Tir","Mordad","Shahrivar","Mehr","Aban","Azar","Dey","Bahman","Esfand"],long:["Farvardin","Ordibehesht","Khordad","Tir","Mordad","Shahrivar","Mehr","Aban","Azar","Dey","Bahman","Esfand"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["AP"],short:["AP"],long:["AP"]},dayPeriods:{am:"a. m.",pm:"p. m."}},roc:{months:{narrow:["E","F","M","A","M","J","J","A","S","O","N","D"],short:["ene.","feb.","mar.","abr.","may.","jun.","jul.","ago.","sept.","oct.","nov.","dic."],long:["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["antes de R.O.C.","R.O.C."],short:["antes de R.O.C.","R.O.C."],long:["antes de R.O.C.","R.O.C."]},dayPeriods:{am:"a. m.",pm:"p. m."}}}},number:{nu:["latn"],patterns:{decimal:{positivePattern:"{number}",negativePattern:"{minusSign}{number}"},currency:{positivePattern:"{number} {currency}",negativePattern:"{minusSign}{number} {currency}"},percent:{positivePattern:"{number} {percentSign}",negativePattern:"{minusSign}{number} {percentSign}"}},symbols:{latn:{decimal:",",group:".",nan:"NaN",plusSign:"+",minusSign:"-",percentSign:"%",infinity:"∞"}},currencies:{CAD:"CA$",ESP:"₧",EUR:"€",THB:"฿",USD:"$",VND:"₫",XPF:"CFPF"}}});
},{}],34:[function(require,module,exports){
(function (process){
  /* globals require, module */

  'use strict';

  /**
   * Module dependencies.
   */

  var pathtoRegexp = require('path-to-regexp');

  /**
   * Module exports.
   */

  module.exports = page;

  /**
   * Detect click event
   */
  var clickEvent = ('undefined' !== typeof document) && document.ontouchstart ? 'touchstart' : 'click';

  /**
   * To work properly with the URL
   * history.location generated polyfill in https://github.com/devote/HTML5-History-API
   */

  var location = ('undefined' !== typeof window) && (window.history.location || window.location);

  /**
   * Perform initial dispatch.
   */

  var dispatch = true;


  /**
   * Decode URL components (query string, pathname, hash).
   * Accommodates both regular percent encoding and x-www-form-urlencoded format.
   */
  var decodeURLComponents = true;

  /**
   * Base path.
   */

  var base = '';

  /**
   * Running flag.
   */

  var running;

  /**
   * HashBang option
   */

  var hashbang = false;

  /**
   * Previous context, for capturing
   * page exit events.
   */

  var prevContext;

  /**
   * Register `path` with callback `fn()`,
   * or route `path`, or redirection,
   * or `page.start()`.
   *
   *   page(fn);
   *   page('*', fn);
   *   page('/user/:id', load, user);
   *   page('/user/' + user.id, { some: 'thing' });
   *   page('/user/' + user.id);
   *   page('/from', '/to')
   *   page();
   *
   * @param {string|!Function|!Object} path
   * @param {Function=} fn
   * @api public
   */

  function page(path, fn) {
    // <callback>
    if ('function' === typeof path) {
      return page('*', path);
    }

    // route <path> to <callback ...>
    if ('function' === typeof fn) {
      var route = new Route(/** @type {string} */ (path));
      for (var i = 1; i < arguments.length; ++i) {
        page.callbacks.push(route.middleware(arguments[i]));
      }
      // show <path> with [state]
    } else if ('string' === typeof path) {
      page['string' === typeof fn ? 'redirect' : 'show'](path, fn);
      // start [options]
    } else {
      page.start(path);
    }
  }

  /**
   * Callback functions.
   */

  page.callbacks = [];
  page.exits = [];

  /**
   * Current path being processed
   * @type {string}
   */
  page.current = '';

  /**
   * Number of pages navigated to.
   * @type {number}
   *
   *     page.len == 0;
   *     page('/login');
   *     page.len == 1;
   */

  page.len = 0;

  /**
   * Get or set basepath to `path`.
   *
   * @param {string} path
   * @api public
   */

  page.base = function(path) {
    if (0 === arguments.length) return base;
    base = path;
  };

  /**
   * Bind with the given `options`.
   *
   * Options:
   *
   *    - `click` bind to click events [true]
   *    - `popstate` bind to popstate [true]
   *    - `dispatch` perform initial dispatch [true]
   *
   * @param {Object} options
   * @api public
   */

  page.start = function(options) {
    options = options || {};
    if (running) return;
    running = true;
    if (false === options.dispatch) dispatch = false;
    if (false === options.decodeURLComponents) decodeURLComponents = false;
    if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
    if (false !== options.click) {
      document.addEventListener(clickEvent, onclick, false);
    }
    if (true === options.hashbang) hashbang = true;
    if (!dispatch) return;
    var url = (hashbang && ~location.hash.indexOf('#!')) ? location.hash.substr(2) + location.search : location.pathname + location.search + location.hash;
    page.replace(url, null, true, dispatch);
  };

  /**
   * Unbind click and popstate event handlers.
   *
   * @api public
   */

  page.stop = function() {
    if (!running) return;
    page.current = '';
    page.len = 0;
    running = false;
    document.removeEventListener(clickEvent, onclick, false);
    window.removeEventListener('popstate', onpopstate, false);
  };

  /**
   * Show `path` with optional `state` object.
   *
   * @param {string} path
   * @param {Object=} state
   * @param {boolean=} dispatch
   * @param {boolean=} push
   * @return {!Context}
   * @api public
   */

  page.show = function(path, state, dispatch, push) {
    var ctx = new Context(path, state);
    page.current = ctx.path;
    if (false !== dispatch) page.dispatch(ctx);
    if (false !== ctx.handled && false !== push) ctx.pushState();
    return ctx;
  };

  /**
   * Goes back in the history
   * Back should always let the current route push state and then go back.
   *
   * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
   * @param {Object=} state
   * @api public
   */

  page.back = function(path, state) {
    if (page.len > 0) {
      // this may need more testing to see if all browsers
      // wait for the next tick to go back in history
      history.back();
      page.len--;
    } else if (path) {
      setTimeout(function() {
        page.show(path, state);
      });
    }else{
      setTimeout(function() {
        page.show(base, state);
      });
    }
  };


  /**
   * Register route to redirect from one path to other
   * or just redirect to another route
   *
   * @param {string} from - if param 'to' is undefined redirects to 'from'
   * @param {string=} to
   * @api public
   */
  page.redirect = function(from, to) {
    // Define route from a path to another
    if ('string' === typeof from && 'string' === typeof to) {
      page(from, function(e) {
        setTimeout(function() {
          page.replace(/** @type {!string} */ (to));
        }, 0);
      });
    }

    // Wait for the push state and replace it with another
    if ('string' === typeof from && 'undefined' === typeof to) {
      setTimeout(function() {
        page.replace(from);
      }, 0);
    }
  };

  /**
   * Replace `path` with optional `state` object.
   *
   * @param {string} path
   * @param {Object=} state
   * @param {boolean=} init
   * @param {boolean=} dispatch
   * @return {!Context}
   * @api public
   */


  page.replace = function(path, state, init, dispatch) {
    var ctx = new Context(path, state);
    page.current = ctx.path;
    ctx.init = init;
    ctx.save(); // save before dispatching, which may redirect
    if (false !== dispatch) page.dispatch(ctx);
    return ctx;
  };

  /**
   * Dispatch the given `ctx`.
   *
   * @param {Context} ctx
   * @api private
   */
  page.dispatch = function(ctx) {
    var prev = prevContext,
      i = 0,
      j = 0;

    prevContext = ctx;

    function nextExit() {
      var fn = page.exits[j++];
      if (!fn) return nextEnter();
      fn(prev, nextExit);
    }

    function nextEnter() {
      var fn = page.callbacks[i++];

      if (ctx.path !== page.current) {
        ctx.handled = false;
        return;
      }
      if (!fn) return unhandled(ctx);
      fn(ctx, nextEnter);
    }

    if (prev) {
      nextExit();
    } else {
      nextEnter();
    }
  };

  /**
   * Unhandled `ctx`. When it's not the initial
   * popstate then redirect. If you wish to handle
   * 404s on your own use `page('*', callback)`.
   *
   * @param {Context} ctx
   * @api private
   */
  function unhandled(ctx) {
    if (ctx.handled) return;
    var current;

    if (hashbang) {
      current = base + location.hash.replace('#!', '');
    } else {
      current = location.pathname + location.search;
    }

    if (current === ctx.canonicalPath) return;
    page.stop();
    ctx.handled = false;
    location.href = ctx.canonicalPath;
  }

  /**
   * Register an exit route on `path` with
   * callback `fn()`, which will be called
   * on the previous context when a new
   * page is visited.
   */
  page.exit = function(path, fn) {
    if (typeof path === 'function') {
      return page.exit('*', path);
    }

    var route = new Route(path);
    for (var i = 1; i < arguments.length; ++i) {
      page.exits.push(route.middleware(arguments[i]));
    }
  };

  /**
   * Remove URL encoding from the given `str`.
   * Accommodates whitespace in both x-www-form-urlencoded
   * and regular percent-encoded form.
   *
   * @param {string} val - URL component to decode
   */
  function decodeURLEncodedURIComponent(val) {
    if (typeof val !== 'string') { return val; }
    return decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
  }

  /**
   * Initialize a new "request" `Context`
   * with the given `path` and optional initial `state`.
   *
   * @constructor
   * @param {string} path
   * @param {Object=} state
   * @api public
   */

  function Context(path, state) {
    if ('/' === path[0] && 0 !== path.indexOf(base)) path = base + (hashbang ? '#!' : '') + path;
    var i = path.indexOf('?');

    this.canonicalPath = path;
    this.path = path.replace(base, '') || '/';
    if (hashbang) this.path = this.path.replace('#!', '') || '/';

    this.title = document.title;
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i ? decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
    this.pathname = decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
    this.params = {};

    // fragment
    this.hash = '';
    if (!hashbang) {
      if (!~this.path.indexOf('#')) return;
      var parts = this.path.split('#');
      this.path = parts[0];
      this.hash = decodeURLEncodedURIComponent(parts[1]) || '';
      this.querystring = this.querystring.split('#')[0];
    }
  }

  /**
   * Expose `Context`.
   */

  page.Context = Context;

  /**
   * Push state.
   *
   * @api private
   */

  Context.prototype.pushState = function() {
    page.len++;
    history.pushState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
  };

  /**
   * Save the context state.
   *
   * @api public
   */

  Context.prototype.save = function() {
    history.replaceState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
  };

  /**
   * Initialize `Route` with the given HTTP `path`,
   * and an array of `callbacks` and `options`.
   *
   * Options:
   *
   *   - `sensitive`    enable case-sensitive routes
   *   - `strict`       enable strict matching for trailing slashes
   *
   * @constructor
   * @param {string} path
   * @param {Object=} options
   * @api private
   */

  function Route(path, options) {
    options = options || {};
    this.path = (path === '*') ? '(.*)' : path;
    this.method = 'GET';
    this.regexp = pathtoRegexp(this.path,
      this.keys = [],
      options);
  }

  /**
   * Expose `Route`.
   */

  page.Route = Route;

  /**
   * Return route middleware with
   * the given callback `fn()`.
   *
   * @param {Function} fn
   * @return {Function}
   * @api public
   */

  Route.prototype.middleware = function(fn) {
    var self = this;
    return function(ctx, next) {
      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
      next();
    };
  };

  /**
   * Check if this route matches `path`, if so
   * populate `params`.
   *
   * @param {string} path
   * @param {Object} params
   * @return {boolean}
   * @api private
   */

  Route.prototype.match = function(path, params) {
    var keys = this.keys,
      qsIndex = path.indexOf('?'),
      pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
      m = this.regexp.exec(decodeURIComponent(pathname));

    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];
      var val = decodeURLEncodedURIComponent(m[i]);
      if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
        params[key.name] = val;
      }
    }

    return true;
  };


  /**
   * Handle "populate" events.
   */

  var onpopstate = (function () {
    var loaded = false;
    if ('undefined' === typeof window) {
      return;
    }
    if (document.readyState === 'complete') {
      loaded = true;
    } else {
      window.addEventListener('load', function() {
        setTimeout(function() {
          loaded = true;
        }, 0);
      });
    }
    return function onpopstate(e) {
      if (!loaded) return;
      if (e.state) {
        var path = e.state.path;
        page.replace(path, e.state);
      } else {
        page.show(location.pathname + location.hash, undefined, undefined, false);
      }
    };
  })();
  /**
   * Handle "click" events.
   */

  function onclick(e) {

    if (1 !== which(e)) return;

    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.defaultPrevented) return;



    // ensure link
    // use shadow dom when available
    var el = e.path ? e.path[0] : e.target;
    while (el && 'A' !== el.nodeName) el = el.parentNode;
    if (!el || 'A' !== el.nodeName) return;



    // Ignore if tag has
    // 1. "download" attribute
    // 2. rel="external" attribute
    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

    // ensure non-hash for the same path
    var link = el.getAttribute('href');
    if (!hashbang && el.pathname === location.pathname && (el.hash || '#' === link)) return;



    // Check for mailto: in the href
    if (link && link.indexOf('mailto:') > -1) return;

    // check target
    if (el.target) return;

    // x-origin
    if (!sameOrigin(el.href)) return;



    // rebuild path
    var path = el.pathname + el.search + (el.hash || '');

    // strip leading "/[drive letter]:" on NW.js on Windows
    if (typeof process !== 'undefined' && path.match(/^\/[a-zA-Z]:\//)) {
      path = path.replace(/^\/[a-zA-Z]:\//, '/');
    }

    // same page
    var orig = path;

    if (path.indexOf(base) === 0) {
      path = path.substr(base.length);
    }

    if (hashbang) path = path.replace('#!', '');

    if (base && orig === path) return;

    e.preventDefault();
    page.show(orig);
  }

  /**
   * Event button.
   */

  function which(e) {
    e = e || window.event;
    return null === e.which ? e.button : e.which;
  }

  /**
   * Check if `href` is the same origin.
   */

  function sameOrigin(href) {
    var origin = location.protocol + '//' + location.hostname;
    if (location.port) origin += ':' + location.port;
    return (href && (0 === href.indexOf(origin)));
  }

  page.sameOrigin = sameOrigin;

}).call(this,require('_process'))

},{"_process":2,"path-to-regexp":35}],35:[function(require,module,exports){
var isarray = require('isarray')

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp
module.exports.parse = parse
module.exports.compile = compile
module.exports.tokensToFunction = tokensToFunction
module.exports.tokensToRegExp = tokensToRegExp

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {String} str
 * @return {Array}
 */
function parse (str) {
  var tokens = []
  var key = 0
  var index = 0
  var path = ''
  var res

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0]
    var escaped = res[1]
    var offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      continue
    }

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
    }

    var prefix = res[2]
    var name = res[3]
    var capture = res[4]
    var group = res[5]
    var suffix = res[6]
    var asterisk = res[7]

    var repeat = suffix === '+' || suffix === '*'
    var optional = suffix === '?' || suffix === '*'
    var delimiter = prefix || '/'
    var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?')

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      pattern: escapeGroup(pattern)
    })
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index)
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path)
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {String}   str
 * @return {Function}
 */
function compile (str) {
  return tokensToFunction(parse(str))
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^' + tokens[i].pattern + '$')
    }
  }

  return function (obj) {
    var path = ''
    var data = obj || {}

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        path += token

        continue
      }

      var value = data[token.name]
      var segment

      if (value == null) {
        if (token.optional) {
          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encodeURIComponent(value[j])

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      segment = encodeURIComponent(value)

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {String} str
 * @return {String}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {String} group
 * @return {String}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {RegExp} re
 * @param  {Array}  keys
 * @return {RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {String}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {RegExp} path
 * @param  {Array}  keys
 * @return {RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g)

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        pattern: null
      })
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {Array}  path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = []

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source)
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {String} path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function stringToRegexp (path, keys, options) {
  var tokens = parse(path)
  var re = tokensToRegExp(tokens, options)

  // Attach keys back to the regexp.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] !== 'string') {
      keys.push(tokens[i])
    }
  }

  return attachKeys(re, keys)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {Array}  tokens
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function tokensToRegExp (tokens, options) {
  options = options || {}

  var strict = options.strict
  var end = options.end !== false
  var route = ''
  var lastToken = tokens[tokens.length - 1]
  var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken)

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
    } else {
      var prefix = escapeString(token.prefix)
      var capture = token.pattern

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*'
      }

      if (token.optional) {
        if (prefix) {
          capture = '(?:' + prefix + '(' + capture + '))?'
        } else {
          capture = '(' + capture + ')?'
        }
      } else {
        capture = prefix + '(' + capture + ')'
      }

      route += capture
    }
  }

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?'
  }

  if (end) {
    route += '$'
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithSlash ? '' : '(?=\\/|$)'
  }

  return new RegExp('^' + route, flags(options))
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(String|RegExp|Array)} path
 * @param  {Array}                 [keys]
 * @param  {Object}                [options]
 * @return {RegExp}
 */
function pathToRegexp (path, keys, options) {
  keys = keys || []

  if (!isarray(keys)) {
    options = keys
    keys = []
  } else if (!options) {
    options = {}
  }

  if (path instanceof RegExp) {
    return regexpToRegexp(path, keys, options)
  }

  if (isarray(path)) {
    return arrayToRegexp(path, keys, options)
  }

  return stringToRegexp(path, keys, options)
}

},{"isarray":36}],36:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],37:[function(require,module,exports){

var orig = document.title;

exports = module.exports = set;

function set(str) {
  var i = 1;
  var args = arguments;
  document.title = str.replace(/%[os]/g, function(_){
    switch (_) {
      case '%o':
        return orig;
      case '%s':
        return args[i++];
    }
  });
}

exports.reset = function(){
  set(orig);
};

},{}],38:[function(require,module,exports){
var bel = require('bel') // turns template tag into DOM elements
var morphdom = require('morphdom') // efficiently diffs + morphs two DOM elements
var defaultEvents = require('./update-events.js') // default events to be copied when dom elements update

module.exports = bel

// TODO move this + defaultEvents to a new module once we receive more feedback
module.exports.update = function (fromNode, toNode, opts) {
  if (!opts) opts = {}
  if (opts.events !== false) {
    if (!opts.onBeforeMorphEl) opts.onBeforeMorphEl = copier
  }

  return morphdom(fromNode, toNode, opts)

  // morphdom only copies attributes. we decided we also wanted to copy events
  // that can be set via attributes
  function copier (f, t) {
    // copy events:
    var events = opts.events || defaultEvents
    for (var i = 0; i < events.length; i++) {
      var ev = events[i]
      if (t[ev]) { // if new element has a whitelisted attribute
        f[ev] = t[ev] // update existing element
      } else if (f[ev]) { // if existing element has it and new one doesnt
        f[ev] = undefined // remove it from existing element
      }
    }
    // copy values for form elements
    if (f.nodeName === 'INPUT' || f.nodeName === 'TEXTAREA' || f.nodeNAME === 'SELECT') {
      if (t.getAttribute('value') === null) t.value = f.value
    }
  }
}

},{"./update-events.js":44,"bel":39,"morphdom":43}],39:[function(require,module,exports){
var document = require('global/document')
var hyperx = require('hyperx')

var SVGNS = 'http://www.w3.org/2000/svg'
var BOOL_PROPS = {
  autofocus: 1,
  checked: 1,
  defaultchecked: 1,
  disabled: 1,
  formnovalidate: 1,
  indeterminate: 1,
  readonly: 1,
  required: 1,
  willvalidate: 1
}
var SVG_TAGS = [
  'svg',
  'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
  'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB',
  'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode',
  'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting',
  'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face',
  'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri',
  'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line',
  'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath',
  'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

function belCreateElement (tag, props, children) {
  var el

  // If an svg tag, it needs a namespace
  if (SVG_TAGS.indexOf(tag) !== -1) {
    props.namespace = SVGNS
  }

  // If we are using a namespace
  var ns = false
  if (props.namespace) {
    ns = props.namespace
    delete props.namespace
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else {
    el = document.createElement(tag)
  }

  // Create the properties
  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      var key = p.toLowerCase()
      var val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // If a property is boolean, set itself to the key
      if (BOOL_PROPS[key]) {
        if (val === 'true') val = key
        else if (val === 'false') continue
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on') {
        el[p] = val
      } else {
        if (ns) {
          el.setAttributeNS(null, p, val)
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  function appendChild (childs) {
    if (!Array.isArray(childs)) return
    for (var i = 0; i < childs.length; i++) {
      var node = childs[i]
      if (Array.isArray(node)) {
        appendChild(node)
        continue
      }

      if (typeof node === 'number' ||
        typeof node === 'boolean' ||
        node instanceof Date ||
        node instanceof RegExp) {
        node = node.toString()
      }

      if (typeof node === 'string') {
        if (el.lastChild && el.lastChild.nodeName === '#text') {
          el.lastChild.nodeValue += node
          continue
        }
        node = document.createTextNode(node)
      }

      if (node && node.nodeType) {
        el.appendChild(node)
      }
    }
  }
  appendChild(children)

  return el
}

module.exports = hyperx(belCreateElement)
module.exports.createElement = belCreateElement

},{"global/document":40,"hyperx":41}],40:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"min-document":1}],41:[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12

module.exports = function (h, opts) {
  h = attrToProp(h)
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        p.push([ VAR, xstate, arg ])
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else cur[1][key] = concat(cur[1][key], parts[i][1])
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else cur[1][key] = concat(cur[1][key], parts[i][2])
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state)) {
          if (state === OPEN) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === TEXT) {
          reg += c
        } else if (state === OPEN && /\s/.test(c)) {
          res.push([OPEN, reg])
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[\w-]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_BREAK],[ATTR_VALUE,reg])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var hasOwn = Object.prototype.hasOwnProperty
function has (obj, key) { return hasOwn.call(obj, key) }

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":42}],42:[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],43:[function(require,module,exports){
// Create a range object for efficently rendering strings to elements.
var range;

var testEl = typeof document !== 'undefined' ? document.body || document.createElement('div') : {};

// Fixes https://github.com/patrick-steele-idem/morphdom/issues/32 (IE7+ support)
// <=IE7 does not support el.hasAttribute(name)
var hasAttribute;
if (testEl.hasAttribute) {
    hasAttribute = function hasAttribute(el, name) {
        return el.hasAttribute(name);
    };
} else {
    hasAttribute = function hasAttribute(el, name) {
        return el.getAttributeNode(name);
    };
}

function empty(o) {
    for (var k in o) {
        if (o.hasOwnProperty(k)) {
            return false;
        }
    }

    return true;
}
function toElement(str) {
    if (!range && document.createRange) {
        range = document.createRange();
        range.selectNode(document.body);
    }

    var fragment;
    if (range && range.createContextualFragment) {
        fragment = range.createContextualFragment(str);
    } else {
        fragment = document.createElement('body');
        fragment.innerHTML = str;
    }
    return fragment.childNodes[0];
}

var specialElHandlers = {
    /**
     * Needed for IE. Apparently IE doesn't think
     * that "selected" is an attribute when reading
     * over the attributes using selectEl.attributes
     */
    OPTION: function(fromEl, toEl) {
        if ((fromEl.selected = toEl.selected)) {
            fromEl.setAttribute('selected', '');
        } else {
            fromEl.removeAttribute('selected', '');
        }
    },
    /**
     * The "value" attribute is special for the <input> element
     * since it sets the initial value. Changing the "value"
     * attribute without changing the "value" property will have
     * no effect since it is only used to the set the initial value.
     * Similar for the "checked" attribute.
     */
    INPUT: function(fromEl, toEl) {
        fromEl.checked = toEl.checked;

        if (fromEl.value != toEl.value) {
            fromEl.value = toEl.value;
        }

        if (!hasAttribute(toEl, 'checked')) {
            fromEl.removeAttribute('checked');
        }

        if (!hasAttribute(toEl, 'value')) {
            fromEl.removeAttribute('value');
        }
    },

    TEXTAREA: function(fromEl, toEl) {
        var newValue = toEl.value;
        if (fromEl.value != newValue) {
            fromEl.value = newValue;
        }

        if (fromEl.firstChild) {
            fromEl.firstChild.nodeValue = newValue;
        }
    }
};

function noop() {}

/**
 * Loop over all of the attributes on the target node and make sure the
 * original DOM node has the same attributes. If an attribute
 * found on the original node is not on the new node then remove it from
 * the original node
 * @param  {HTMLElement} fromNode
 * @param  {HTMLElement} toNode
 */
function morphAttrs(fromNode, toNode) {
    var attrs = toNode.attributes;
    var i;
    var attr;
    var attrName;
    var attrValue;
    var foundAttrs = {};

    for (i=attrs.length-1; i>=0; i--) {
        attr = attrs[i];
        if (attr.specified !== false) {
            attrName = attr.name;
            attrValue = attr.value;
            foundAttrs[attrName] = true;

            if (fromNode.getAttribute(attrName) !== attrValue) {
                fromNode.setAttribute(attrName, attrValue);
            }
        }
    }

    // Delete any extra attributes found on the original DOM element that weren't
    // found on the target element.
    attrs = fromNode.attributes;

    for (i=attrs.length-1; i>=0; i--) {
        attr = attrs[i];
        if (attr.specified !== false) {
            attrName = attr.name;
            if (!foundAttrs.hasOwnProperty(attrName)) {
                fromNode.removeAttribute(attrName);
            }
        }
    }
}

/**
 * Copies the children of one DOM element to another DOM element
 */
function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while(curChild) {
        var nextChild = curChild.nextSibling;
        toEl.appendChild(curChild);
        curChild = nextChild;
    }
    return toEl;
}

function defaultGetNodeKey(node) {
    return node.id;
}

function morphdom(fromNode, toNode, options) {
    if (!options) {
        options = {};
    }

    if (typeof toNode === 'string') {
        if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML') {
            var toNodeHtml = toNode;
            toNode = document.createElement('html');
            toNode.innerHTML = toNodeHtml;
        } else {
            toNode = toElement(toNode);
        }
    }

    var savedEls = {}; // Used to save off DOM elements with IDs
    var unmatchedEls = {};
    var getNodeKey = options.getNodeKey || defaultGetNodeKey;
    var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
    var onNodeAdded = options.onNodeAdded || noop;
    var onBeforeElUpdated = options.onBeforeElUpdated || options.onBeforeMorphEl || noop;
    var onElUpdated = options.onElUpdated || noop;
    var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
    var onNodeDiscarded = options.onNodeDiscarded || noop;
    var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || options.onBeforeMorphElChildren || noop;
    var childrenOnly = options.childrenOnly === true;
    var movedEls = [];

    function removeNodeHelper(node, nestedInSavedEl) {
        var id = getNodeKey(node);
        // If the node has an ID then save it off since we will want
        // to reuse it in case the target DOM tree has a DOM element
        // with the same ID
        if (id) {
            savedEls[id] = node;
        } else if (!nestedInSavedEl) {
            // If we are not nested in a saved element then we know that this node has been
            // completely discarded and will not exist in the final DOM.
            onNodeDiscarded(node);
        }

        if (node.nodeType === 1) {
            var curChild = node.firstChild;
            while(curChild) {
                removeNodeHelper(curChild, nestedInSavedEl || id);
                curChild = curChild.nextSibling;
            }
        }
    }

    function walkDiscardedChildNodes(node) {
        if (node.nodeType === 1) {
            var curChild = node.firstChild;
            while(curChild) {


                if (!getNodeKey(curChild)) {
                    // We only want to handle nodes that don't have an ID to avoid double
                    // walking the same saved element.

                    onNodeDiscarded(curChild);

                    // Walk recursively
                    walkDiscardedChildNodes(curChild);
                }

                curChild = curChild.nextSibling;
            }
        }
    }

    function removeNode(node, parentNode, alreadyVisited) {
        if (onBeforeNodeDiscarded(node) === false) {
            return;
        }

        parentNode.removeChild(node);
        if (alreadyVisited) {
            if (!getNodeKey(node)) {
                onNodeDiscarded(node);
                walkDiscardedChildNodes(node);
            }
        } else {
            removeNodeHelper(node);
        }
    }

    function morphEl(fromEl, toEl, alreadyVisited, childrenOnly) {
        var toElKey = getNodeKey(toEl);
        if (toElKey) {
            // If an element with an ID is being morphed then it is will be in the final
            // DOM so clear it out of the saved elements collection
            delete savedEls[toElKey];
        }

        if (!childrenOnly) {
            if (onBeforeElUpdated(fromEl, toEl) === false) {
                return;
            }

            morphAttrs(fromEl, toEl);
            onElUpdated(fromEl);

            if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
                return;
            }
        }

        if (fromEl.tagName != 'TEXTAREA') {
            var curToNodeChild = toEl.firstChild;
            var curFromNodeChild = fromEl.firstChild;
            var curToNodeId;

            var fromNextSibling;
            var toNextSibling;
            var savedEl;
            var unmatchedEl;

            outer: while(curToNodeChild) {
                toNextSibling = curToNodeChild.nextSibling;
                curToNodeId = getNodeKey(curToNodeChild);

                while(curFromNodeChild) {
                    var curFromNodeId = getNodeKey(curFromNodeChild);
                    fromNextSibling = curFromNodeChild.nextSibling;

                    if (!alreadyVisited) {
                        if (curFromNodeId && (unmatchedEl = unmatchedEls[curFromNodeId])) {
                            unmatchedEl.parentNode.replaceChild(curFromNodeChild, unmatchedEl);
                            morphEl(curFromNodeChild, unmatchedEl, alreadyVisited);
                            curFromNodeChild = fromNextSibling;
                            continue;
                        }
                    }

                    var curFromNodeType = curFromNodeChild.nodeType;

                    if (curFromNodeType === curToNodeChild.nodeType) {
                        var isCompatible = false;

                        if (curFromNodeType === 1) { // Both nodes being compared are Element nodes
                            if (curFromNodeChild.tagName === curToNodeChild.tagName) {
                                // We have compatible DOM elements
                                if (curFromNodeId || curToNodeId) {
                                    // If either DOM element has an ID then we handle
                                    // those differently since we want to match up
                                    // by ID
                                    if (curToNodeId === curFromNodeId) {
                                        isCompatible = true;
                                    }
                                } else {
                                    isCompatible = true;
                                }
                            }

                            if (isCompatible) {
                                // We found compatible DOM elements so transform the current "from" node
                                // to match the current target DOM node.
                                morphEl(curFromNodeChild, curToNodeChild, alreadyVisited);
                            }
                        } else if (curFromNodeType === 3) { // Both nodes being compared are Text nodes
                            isCompatible = true;
                            // Simply update nodeValue on the original node to change the text value
                            curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                        }

                        if (isCompatible) {
                            curToNodeChild = toNextSibling;
                            curFromNodeChild = fromNextSibling;
                            continue outer;
                        }
                    }

                    // No compatible match so remove the old node from the DOM and continue trying
                    // to find a match in the original DOM
                    removeNode(curFromNodeChild, fromEl, alreadyVisited);
                    curFromNodeChild = fromNextSibling;
                }

                if (curToNodeId) {
                    if ((savedEl = savedEls[curToNodeId])) {
                        morphEl(savedEl, curToNodeChild, true);
                        curToNodeChild = savedEl; // We want to append the saved element instead
                    } else {
                        // The current DOM element in the target tree has an ID
                        // but we did not find a match in any of the corresponding
                        // siblings. We just put the target element in the old DOM tree
                        // but if we later find an element in the old DOM tree that has
                        // a matching ID then we will replace the target element
                        // with the corresponding old element and morph the old element
                        unmatchedEls[curToNodeId] = curToNodeChild;
                    }
                }

                // If we got this far then we did not find a candidate match for our "to node"
                // and we exhausted all of the children "from" nodes. Therefore, we will just
                // append the current "to node" to the end
                if (onBeforeNodeAdded(curToNodeChild) !== false) {
                    fromEl.appendChild(curToNodeChild);
                    onNodeAdded(curToNodeChild);
                }

                if (curToNodeChild.nodeType === 1 && (curToNodeId || curToNodeChild.firstChild)) {
                    // The element that was just added to the original DOM may have
                    // some nested elements with a key/ID that needs to be matched up
                    // with other elements. We'll add the element to a list so that we
                    // can later process the nested elements if there are any unmatched
                    // keyed elements that were discarded
                    movedEls.push(curToNodeChild);
                }

                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
            }

            // We have processed all of the "to nodes". If curFromNodeChild is non-null then
            // we still have some from nodes left over that need to be removed
            while(curFromNodeChild) {
                fromNextSibling = curFromNodeChild.nextSibling;
                removeNode(curFromNodeChild, fromEl, alreadyVisited);
                curFromNodeChild = fromNextSibling;
            }
        }

        var specialElHandler = specialElHandlers[fromEl.tagName];
        if (specialElHandler) {
            specialElHandler(fromEl, toEl);
        }
    } // END: morphEl(...)

    var morphedNode = fromNode;
    var morphedNodeType = morphedNode.nodeType;
    var toNodeType = toNode.nodeType;

    if (!childrenOnly) {
        // Handle the case where we are given two DOM nodes that are not
        // compatible (e.g. <div> --> <span> or <div> --> TEXT)
        if (morphedNodeType === 1) {
            if (toNodeType === 1) {
                if (fromNode.tagName !== toNode.tagName) {
                    onNodeDiscarded(fromNode);
                    morphedNode = moveChildren(fromNode, document.createElement(toNode.tagName));
                }
            } else {
                // Going from an element node to a text node
                morphedNode = toNode;
            }
        } else if (morphedNodeType === 3) { // Text node
            if (toNodeType === 3) {
                morphedNode.nodeValue = toNode.nodeValue;
                return morphedNode;
            } else {
                // Text node to something else
                morphedNode = toNode;
            }
        }
    }

    if (morphedNode === toNode) {
        // The "to node" was not compatible with the "from node"
        // so we had to toss out the "from node" and use the "to node"
        onNodeDiscarded(fromNode);
    } else {
        morphEl(morphedNode, toNode, false, childrenOnly);

        /**
         * What we will do here is walk the tree for the DOM element
         * that was moved from the target DOM tree to the original
         * DOM tree and we will look for keyed elements that could
         * be matched to keyed elements that were earlier discarded.
         * If we find a match then we will move the saved element
         * into the final DOM tree
         */
        var handleMovedEl = function(el) {
            var curChild = el.firstChild;
            while(curChild) {
                var nextSibling = curChild.nextSibling;

                var key = getNodeKey(curChild);
                if (key) {
                    var savedEl = savedEls[key];
                    if (savedEl && (curChild.tagName === savedEl.tagName)) {
                        curChild.parentNode.replaceChild(savedEl, curChild);
                        morphEl(savedEl, curChild, true /* already visited the saved el tree */);
                        curChild = nextSibling;
                        if (empty(savedEls)) {
                            return false;
                        }
                        continue;
                    }
                }

                if (curChild.nodeType === 1) {
                    handleMovedEl(curChild);
                }

                curChild = nextSibling;
            }
        };

        // The loop below is used to possibly match up any discarded
        // elements in the original DOM tree with elemenets from the
        // target tree that were moved over without visiting their
        // children
        if (!empty(savedEls)) {
            handleMovedElsLoop:
            while (movedEls.length) {
                var movedElsTemp = movedEls;
                movedEls = [];
                for (var i=0; i<movedElsTemp.length; i++) {
                    if (handleMovedEl(movedElsTemp[i]) === false) {
                        // There are no more unmatched elements so completely end
                        // the loop
                        break handleMovedElsLoop;
                    }
                }
            }
        }

        // Fire the "onNodeDiscarded" event for any saved elements
        // that never found a new home in the morphed DOM
        for (var savedElId in savedEls) {
            if (savedEls.hasOwnProperty(savedElId)) {
                var savedEl = savedEls[savedElId];
                onNodeDiscarded(savedEl);
                walkDiscardedChildNodes(savedEl);
            }
        }
    }

    if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
        // If we had to swap out the from node with a new node because the old
        // node was not compatible with the target node then we need to
        // replace the old DOM node in the original DOM tree. This is only
        // possible if the original DOM node was part of a DOM tree which
        // we know is the case if it has a parent node.
        fromNode.parentNode.replaceChild(morphedNode, fromNode);
    }

    return morphedNode;
}

module.exports = morphdom;

},{}],44:[function(require,module,exports){
module.exports = [
  // attribute events (can be set with attributes)
  'onclick',
  'ondblclick',
  'onmousedown',
  'onmouseup',
  'onmouseover',
  'onmousemove',
  'onmouseout',
  'ondragstart',
  'ondrag',
  'ondragenter',
  'ondragleave',
  'ondragover',
  'ondrop',
  'ondragend',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onunload',
  'onabort',
  'onerror',
  'onresize',
  'onscroll',
  'onselect',
  'onchange',
  'onsubmit',
  'onreset',
  'onfocus',
  'onblur',
  'oninput',
  // other common events
  'oncontextmenu',
  'onfocusin',
  'onfocusout'
]

},{}],45:[function(require,module,exports){
var yo = require('yo-yo');
var translate = require('../translate');

var el = yo`<footer class="site-footer">
                <div class="container">
                    <div class="row">
                        <div class="col s12 l3 center-align"><a href="#" data-activates="dropdown1" class="dropdown-button btn btn-flat">${ translate.message('language') }</a>
                            <ul id="dropdown1" class="dropdown-content">
                                <li><a href="#!">${ translate.message('spanish') }</a></li>
                                <li><a href="#!">${ translate.message('english') }</a></li>
                            </ul>
                        </div>
                        <div class="col s12 l3 push-l6 center-align">© 2016 Mygram</div>
                    </div>
                </div>
            </footer>`;

document.body.appendChild(el);

},{"../translate":58,"yo-yo":38}],46:[function(require,module,exports){
var page = require('page');
var empty = require('empty-element');
var template = require('./template');
var title = require('title');

page('/', function (ctx, next) {
	title('MyGram');
	var main = document.getElementById('main-container');

	var pictures = [{
		user: {
			username: 'Daniel H',
			avatar: 'https://scontent-mia1-1.xx.fbcdn.net/v/t1.0-9/12963889_10208901904603330_6870354961841214887_n.jpg?oh=f819a022e52be19cabaabd89d6cb39ce&oe=57E6B7F5'
		},
		url: 'http://materializecss.com/images/office.jpg',
		likes: 0,
		liked: false,
		createdAt: new Date()
	}, {
		user: {
			username: 'David Pte',
			avatar: 'https://scontent-mia1-1.xx.fbcdn.net/v/t1.0-9/13240476_10207468828932980_766208754586076978_n.jpg?oh=ae997f0f10403f65499674f5a2869757&oe=579DE806'
		},
		url: 'http://materializecss.com/images/office.jpg',
		likes: 1,
		liked: true,
		createdAt: new Date().setDate(new Date().getDate() - 10)
	}];

	empty(main).appendChild(template(pictures));
});

},{"./template":47,"empty-element":3,"page":34,"title":37}],47:[function(require,module,exports){
var yo = require('yo-yo');
var layout = require('../layout');
var picture = require('../picture-card');

module.exports = function (pictures) {

	var el = yo`<div class="conatiner timeline">
					<div class="row">
						<div class="col s12 m10 offset-m1 l6 offset-l3">
							${ pictures.map(function (pic) {
		return picture(pic);
	}) }
						</div>
					</div>
				</div>`;
	return layout(el);
};

},{"../layout":50,"../picture-card":51,"yo-yo":38}],48:[function(require,module,exports){
var page = require('page');

require('./homepage');
require('./signup');
require('./signin');
require('./footer');

page();

},{"./footer":45,"./homepage":46,"./signin":52,"./signup":54,"page":34}],49:[function(require,module,exports){
var yo = require('yo-yo');

module.exports = function landing(box) {
	return yo`<div class="container landing">
					<div class="row">
						<div class="col s10 push-s1">
							<div class="row">
								<div class="col m5 hide-on-small-only">
									<img class="iphone" src="./iphone.png" alt="iphone"/>
								</div>
								${ box }
							</div>
						</div>
					</div>
				</div>`;
};

},{"yo-yo":38}],50:[function(require,module,exports){
var yo = require('yo-yo');
var translate = require('../translate');

module.exports = function layout(content) {
	return yo`<div>
					<nav class="header">
						<div class="nav-wrapper">
							<div class="container">
								<div class="row">
									<div class="col s12 m6 offset-m1">
										<a href="" class="brand-logo mygram">MyGram</a>
									</div>
									<div class="col s2 m6 push-s10 push-m10">
										<a href="#" class="btn btn-large btn-flat dropdown-button" data-activates="drop-user">
											<i class="fa fa-user" aria-hidden="true"></i>
										</a>
										<ul id="drop-user" class="dropdown-content">
											<li><a href="">${ translate.message('logout') }</a></li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</nav>
					<div class="content">
						${ content }
					</div>
				</div>`;
};

},{"../translate":58,"yo-yo":38}],51:[function(require,module,exports){
var yo = require('yo-yo');
var translate = require('../translate');

module.exports = function pictureCard(pic) {
	var el;
	/*estamos pisando pic*/
	function render(picture) {
		return yo`<div class="card ${ picture.liked ? 'liked' : '' }">
					    <div class="card-image">
					    	<img class="activator" src="${ picture.url }">
					    </div>
					    <div class="card-content">
					    	<a href="/user/${ picture.user.username }" class="card-title">
					    		<img src="${ picture.user.avatar }" class="avatar" alt="" />
					    		<span class="username">${ picture.user.username }</span>
					    	</a>
					    	<small class="right time">${ translate.date.format(picture.createdAt) }</small>
					    	<p>
					    		<a href="#" class="left" onclick=${ like.bind(null, true) }>
					    			<i class="fa fa-heart-o" aria-hidden="true"></i>
					    		</a>
					    		<a href="#" class="left" onclick=${ like.bind(null, false) }>
					    			<i class="fa fa-heart" aria-hidden="true"></i>
					    		</a>
				    			<span class="left likes">${ translate.message('likes', { likes: picture.likes }) }</span>
					    	</p>
					    </div>
				    </div>`;
	}

	function like(liked) {
		pic.liked = liked;
		pic.likes += liked ? 1 : -1;
		var newEl = render(pic);
		yo.update(el, newEl);
		return false; /*quita comportamiento default de tag a*/
	}

	el = render(pic);
	return el;
};

/*translate.message('likes',picture.likes) => likes es el string a traducir*/

},{"../translate":58,"yo-yo":38}],52:[function(require,module,exports){
var page = require('page');
var empty = require('empty-element');
var template = require('./template');
var title = require('title');

page('/signin', function (ctx, next) {
	title('MyGram - Signin');
	var main = document.getElementById('main-container');
	empty(main).appendChild(template);
});

},{"./template":53,"empty-element":3,"page":34,"title":37}],53:[function(require,module,exports){
var yo = require('yo-yo');
var landing = require('../landing');
var translate = require('../translate');

var signinForm = yo`<div class="col s12 m7">
						<div class="row">
							<div class="signup-box">
								<h1 class="mygram">MyGram</h1>
								<form class="signup-form">
									<div class="section">
										<a href="" class="btn btn-fb hide-on-small-only">${ translate.message('signup.facebook') }</a>
										<a href="" class="btn btn-fb hide-on-med-and-up"><i class="fa fa-facebook-official"></i>${ translate.message('signup.text') }</a>
									</div>
									<div class="divider">
										
									</div>
									<div class="section">
										<input type="text" name="usernamee" placeholder="${ translate.message('username') }">
										<input type="password" name="password" placeholder="${ translate.message('password') }">
										<button type="submit" class="btn waves-effect waves-light btn-signup">${ translate.message('signup.text') }</button>
									</div>
								</form>
							</div>								
						</div>
						<div class="row">
							<div class="login-box">
								${ translate.message('signin.not-have-account') } <a href="/signup">${ translate.message('signup.call-to-action') }</a>
							</div>
						</div>
					</div>`;

module.exports = landing(signinForm);

},{"../landing":49,"../translate":58,"yo-yo":38}],54:[function(require,module,exports){
var page = require('page');
var empty = require('empty-element');
var template = require('./template');
var title = require('title');

page('/signup', function (ctx, next) {
	title('MyGram - Signup');
	var main = document.getElementById('main-container');
	empty(main).appendChild(template);
});

},{"./template":55,"empty-element":3,"page":34,"title":37}],55:[function(require,module,exports){
var yo = require('yo-yo');
var landing = require('../landing');
var translate = require('../translate');

var signupForm = yo`<div class="col s12 m7">
						<div class="row">
							<div class="signup-box">
								<h1 class="mygram">MyGram</h1>
								<form action="" class="signup-form">
									<h2>${ translate.message('signup.subheading') }</h2>
									<div class="section">
										<a href="" class="btn btn-fb hide-on-small-only">${ translate.message('signup.facebook') }</a>
										<a href="" class="btn btn-fb hide-on-med-and-up"><i class="fa fa-facebook-official"></i>${ translate.message('signup.text') }</a>
									</div>
									<div class="divider">
										
									</div>
									<div class="section">
										<input type="email" name="email" placeholder="${ translate.message('email') }">
										<input type="text" name="name" placeholder="${ translate.message('username') }">
										<input type="text" name="usernamee" placeholder="${ translate.message('fullname') }">
										<input type="password" name="password" placeholder="${ translate.message('password') }">
										<button type="submit" class="btn waves-effect waves-light btn-signup">${ translate.message('signup.call-to-action') }</button>
									</div>
								</form>
							</div>								
						</div>
						<div class="row">
							<div class="login-box">
								${ translate.message('signup.have-account') } <a href="/signin">${ translate.message('signin') }</a>
							</div>
						</div>
					</div>`;

module.exports = landing(signupForm);

},{"../landing":49,"../translate":58,"yo-yo":38}],56:[function(require,module,exports){
module.exports = {
           likes: '{ likes, plural, ' + /*prural es el tipo de dato*/
           '=0 {no likes}' + '=1 {# like}' + 'other {# likes}}',
           logout: 'Logout',
           english: 'English',
           spanish: 'Spanish',
           'signup.subheading': 'Signup to watch your friends\' students',
           'signup.facebook': 'Signup with Facebook',
           'signup.text': 'Signup',
           'email': 'Email',
           'username': 'User name',
           'fullname': 'Full name',
           'password': 'Password',
           'signup.call-to-action': 'Singup',
           'signup.have-account': 'Already have an account?',
           'signin': 'Signin',
           'signin.not-have-account': 'Don\'t have an account?',
           'language': 'Language'
};

},{}],57:[function(require,module,exports){
module.exports = {
   likes: '{ likes, number} me gusta', /*number es el tipo de dato*/
   logout: 'Salir',
   english: 'Ingles',
   Spanish: 'Español',
   'signup.subheading': 'Registrate para ver fotos de tus amigos estudiantes',
   'signup.facebook': 'Iniciar sesión con Facebook',
   'signup.text': 'Iniciar sesión',
   'email': 'Correo electrónico',
   'username': 'Nombre de usuario',
   'fullname': 'Nombre completo',
   'password': 'Contraseña',
   'signup.call-to-action': 'Regístrate',
   'signup.have-account': '¿Tienes una cuenta?',
   'signin': 'Entrar',
   'signin.not-have-account': '¿No tienes una cuenta?',
   'language': 'Idioma'
};

},{}],58:[function(require,module,exports){
/*soporte safari*/
if (!window.Intl) {
	window.Intl = require('intl'); // polyfill for `Intl`
	require('intl/locale-data/jsonp/en-US.js');
	require('intl/locale-data/jsonp/es.js');
}

/*fechas*/
var IntlRelativeFormat = window.IntlRelativeFormat = require('intl-relativeformat');

require('intl-relativeformat/dist/locale-data/en.js');
require('intl-relativeformat/dist/locale-data/es.js');

/*textos*/
var IntlMessageFormat = require('intl-messageformat');

/*https://github.com/yahoo/intl-messageformat*/
var es = require('./es');
var en = require('./en-US');

var MESSAGES = {};
MESSAGES.es = es;
MESSAGES['en-US'] = en;

var locale = 'en-US';

module.exports = {
	message: function (text, opts) {
		opts = opts || {};
		var msg = new IntlMessageFormat(MESSAGES[locale][text], locale, null);
		return msg.format(opts);
	},
	date: new IntlRelativeFormat(locale)
};

/*MESSAGES[locale][text] se esta refiriendo a la propiedad que nos llegue*/

},{"./en-US":56,"./es":57,"intl":30,"intl-messageformat":4,"intl-relativeformat":15,"intl-relativeformat/dist/locale-data/en.js":13,"intl-relativeformat/dist/locale-data/es.js":14,"intl/locale-data/jsonp/en-US.js":32,"intl/locale-data/jsonp/es.js":33}]},{},[48])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9lbXB0eS1lbGVtZW50L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ludGwtbWVzc2FnZWZvcm1hdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbnRsLW1lc3NhZ2Vmb3JtYXQvbGliL2NvbXBpbGVyLmpzIiwibm9kZV9tb2R1bGVzL2ludGwtbWVzc2FnZWZvcm1hdC9saWIvY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9pbnRsLW1lc3NhZ2Vmb3JtYXQvbGliL2VuLmpzIiwibm9kZV9tb2R1bGVzL2ludGwtbWVzc2FnZWZvcm1hdC9saWIvZXM1LmpzIiwibm9kZV9tb2R1bGVzL2ludGwtbWVzc2FnZWZvcm1hdC9saWIvbWFpbi5qcyIsIm5vZGVfbW9kdWxlcy9pbnRsLW1lc3NhZ2Vmb3JtYXQvbGliL3V0aWxzLmpzIiwibm9kZV9tb2R1bGVzL2ludGwtbWVzc2FnZWZvcm1hdC9ub2RlX21vZHVsZXMvaW50bC1tZXNzYWdlZm9ybWF0LXBhcnNlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbnRsLW1lc3NhZ2Vmb3JtYXQvbm9kZV9tb2R1bGVzL2ludGwtbWVzc2FnZWZvcm1hdC1wYXJzZXIvbGliL3BhcnNlci5qcyIsIm5vZGVfbW9kdWxlcy9pbnRsLXJlbGF0aXZlZm9ybWF0L2Rpc3QvbG9jYWxlLWRhdGEvZW4uanMiLCJub2RlX21vZHVsZXMvaW50bC1yZWxhdGl2ZWZvcm1hdC9kaXN0L2xvY2FsZS1kYXRhL2VzLmpzIiwibm9kZV9tb2R1bGVzL2ludGwtcmVsYXRpdmVmb3JtYXQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaW50bC1yZWxhdGl2ZWZvcm1hdC9saWIvY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9pbnRsLXJlbGF0aXZlZm9ybWF0L2xpYi9kaWZmLmpzIiwibm9kZV9tb2R1bGVzL2ludGwtcmVsYXRpdmVmb3JtYXQvbGliL2VuLmpzIiwibm9kZV9tb2R1bGVzL2ludGwtcmVsYXRpdmVmb3JtYXQvbGliL2VzNS5qcyIsIm5vZGVfbW9kdWxlcy9pbnRsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ludGwvbGliL2NvcmUuanMiLCJub2RlX21vZHVsZXMvaW50bC9sb2NhbGUtZGF0YS9qc29ucC9lbi1VUy5qcyIsIm5vZGVfbW9kdWxlcy9pbnRsL2xvY2FsZS1kYXRhL2pzb25wL2VzLmpzIiwibm9kZV9tb2R1bGVzL3BhZ2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcGFnZS9ub2RlX21vZHVsZXMvcGF0aC10by1yZWdleHAvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcGFnZS9ub2RlX21vZHVsZXMvcGF0aC10by1yZWdleHAvbm9kZV9tb2R1bGVzL2lzYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGl0bGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMveW8teW8vaW5kZXguanMiLCJub2RlX21vZHVsZXMveW8teW8vbm9kZV9tb2R1bGVzL2JlbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy95by15by9ub2RlX21vZHVsZXMvYmVsL25vZGVfbW9kdWxlcy9nbG9iYWwvZG9jdW1lbnQuanMiLCJub2RlX21vZHVsZXMveW8teW8vbm9kZV9tb2R1bGVzL2JlbC9ub2RlX21vZHVsZXMvaHlwZXJ4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3lvLXlvL25vZGVfbW9kdWxlcy9iZWwvbm9kZV9tb2R1bGVzL2h5cGVyeC9ub2RlX21vZHVsZXMvaHlwZXJzY3JpcHQtYXR0cmlidXRlLXRvLXByb3BlcnR5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3lvLXlvL25vZGVfbW9kdWxlcy9tb3JwaGRvbS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMveW8teW8vdXBkYXRlLWV2ZW50cy5qcyIsInNyY1xcZm9vdGVyXFxpbmRleC5qcyIsInNyY1xcaG9tZXBhZ2VcXGluZGV4LmpzIiwic3JjXFxob21lcGFnZVxcdGVtcGxhdGUuanMiLCJzcmNcXGluZGV4LmpzIiwic3JjXFxsYW5kaW5nXFxpbmRleC5qcyIsInNyY1xcbGF5b3V0XFxpbmRleC5qcyIsInNyY1xccGljdHVyZS1jYXJkXFxpbmRleC5qcyIsInNyY1xcc2lnbmluXFxpbmRleC5qcyIsInNyY1xcc2lnbmluXFx0ZW1wbGF0ZS5qcyIsInNyY1xcc2lnbnVwXFxpbmRleC5qcyIsInNyY1xcc2lnbnVwXFx0ZW1wbGF0ZS5qcyIsInNyY1xcdHJhbnNsYXRlXFxlbi1VUy5qcyIsInNyY1xcdHJhbnNsYXRlXFxlcy5qcyIsInNyY1xcdHJhbnNsYXRlXFxpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzkwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ250SEE7O0FDQUE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM5bUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RZQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBLElBQUksS0FBSyxRQUFULEFBQVMsQUFBUTtBQUNqQixJQUFJLFlBQVksUUFBaEIsQUFBZ0IsQUFBUTs7QUFFeEIsSUFBSSxLQUFLLEVBQUUsQ0FBQSxBQUFDOzs7NElBRytILFVBQUEsQUFBVSxRQUgxSSxBQUdnSSxBQUFrQixhQUhsSixBQUc4Sjs7b0RBRXRILFVBQUEsQUFBVSxRQUxsRCxBQUt3QyxBQUFrQixZQUwxRCxBQUtxRTtvREFDN0IsVUFBQSxBQUFVLFFBTmxELEFBTXdDLEFBQWtCLFlBTnJFLEFBQVcsQUFNcUU7Ozs7Ozs7O0FBUWhGLFNBQUEsQUFBUyxLQUFULEFBQWMsWUFBZCxBQUEwQjs7O0FDakIxQixJQUFJLE9BQU8sUUFBWCxBQUFXLEFBQVE7QUFDbkIsSUFBSSxRQUFRLFFBQVosQUFBWSxBQUFRO0FBQ3BCLElBQUksV0FBVyxRQUFmLEFBQWUsQUFBUTtBQUN2QixJQUFJLFFBQVEsUUFBWixBQUFZLEFBQVE7O0FBR3BCLEtBQUEsQUFBSyxLQUFLLFVBQUEsQUFBVSxLQUFWLEFBQWUsTUFBTSxBQUM5QjtPQUFBLEFBQU0sQUFDTjtLQUFJLE9BQU8sU0FBQSxBQUFTLGVBQXBCLEFBQVcsQUFBd0IsQUFFbkM7O0tBQUk7O2FBRUksQUFDSyxBQUNWO1dBSEYsQUFDTyxBQUNMLEFBQ1EsQUFFVDs7T0FMRCxBQUtNLEFBQ0w7U0FORCxBQU1RLEFBQ1A7U0FQRCxBQU9RLEFBQ1A7YUFBVyxJQVRFLEFBQ2QsQUFDQyxBQU9XLEFBQUk7OzthQUdULEFBQ0ssQUFDVjtXQUhGLEFBQ08sQUFDTCxBQUNRLEFBRVQ7O09BTEQsQUFLTSxBQUNMO1NBTkQsQUFNUSxBQUNQO1NBUEQsQUFPUSxBQUNQO2FBQVcsSUFBQSxBQUFJLE9BQUosQUFBVyxRQUFRLElBQUEsQUFBSSxPQUFKLEFBQVcsWUFuQjNDLEFBQWUsQUFXZCxBQUNDLEFBT1csQUFBMEMsQUFJdkQ7OztPQUFBLEFBQU0sTUFBTixBQUFZLFlBQVksU0EzQnpCLEFBMkJDLEFBQXdCLEFBQVMsQUFDakM7Ozs7QUNsQ0QsSUFBSSxLQUFLLFFBQVQsQUFBUyxBQUFRO0FBQ2pCLElBQUksU0FBUyxRQUFiLEFBQWEsQUFBUTtBQUNyQixJQUFJLFVBQVUsUUFBZCxBQUFjLEFBQVE7O0FBRXRCLE9BQUEsQUFBTyxVQUFVLFVBQUEsQUFBVSxVQUFVLEFBRXBDOztLQUFJLEtBQUssR0FBRSxBQUFDOzs7bUJBR0osQUFBUyxJQUFJLFVBQUEsQUFBVSxLQUFLLEFBQzdCO1NBQU8sUUFKZCxBQUFXLEFBR0gsQUFDRCxBQUFPLEFBQVEsQUFDZixBQUlQO0FBVFcsQUFHSDs7OztRQU1ELE9BWFIsQUFXQyxBQUFPLEFBQU8sQUFDZDs7OztBQ2hCRCxJQUFJLE9BQU8sUUFBWCxBQUFXLEFBQVE7O0FBRW5CLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTs7QUFFUjs7O0FDUEEsSUFBSSxLQUFLLFFBQVQsQUFBUyxBQUFROztBQUVqQixPQUFBLEFBQU8sVUFBVSxTQUFBLEFBQVMsUUFBVCxBQUFpQixLQUFLLEFBQ3RDO1FBQVEsR0FBRSxBQUFDOzs7Ozs7O1dBRFosQUFDQyxBQUFVLEFBT0QsQUFLVDs7Ozs7Ozs7QUNmRCxJQUFJLEtBQUssUUFBVCxBQUFTLEFBQVE7QUFDakIsSUFBSSxZQUFZLFFBQWhCLEFBQWdCLEFBQVE7O0FBRXhCLE9BQUEsQUFBTyxVQUFVLFNBQUEsQUFBUyxPQUFULEFBQWdCLFNBQVMsQUFDekM7UUFBTyxHQUFFLEFBQUM7Ozs7Ozs7Ozs7Ozs7NkJBYWlCLFVBQUEsQUFBVSxRQWI1QixBQWFrQixBQUFrQixXQWJwQyxBQWE4Qzs7Ozs7Ozs7U0FkeEQsQUFDQyxBQUFTLEFBcUJGLEFBR1A7Ozs7OztBQzVCRCxJQUFJLEtBQUssUUFBVCxBQUFTLEFBQVE7QUFDakIsSUFBSSxZQUFZLFFBQWhCLEFBQWdCLEFBQVE7O0FBRXhCLE9BQUEsQUFBTyxVQUFVLFNBQUEsQUFBUyxZQUFULEFBQXFCLEtBQUssQUFDMUM7S0FBQSxBQUFJLEFBRUo7O1VBQUEsQUFBUyxPQUFULEFBQWlCLFNBQVMsQUFDekI7U0FBTyxFQUFHLENBQUEsQUFBQyxvQkFBbUIsUUFBQSxBQUFRLFFBQVIsQUFBZ0IsVUFBcEMsQUFBOEMsSUFBOUMsQUFBaUQ7O3lDQUVyQixRQUY1QixBQUVvQyxLQUZwQyxBQUV3Qzs7OzRCQUd6QixRQUFBLEFBQVEsS0FMdkIsQUFLNEIsVUFMNUIsQUFLcUM7d0JBQzFCLFFBQUEsQUFBUSxLQU5uQixBQU13QixRQU54QixBQU0rQjtxQ0FDUCxRQUFBLEFBQVEsS0FQaEMsQUFPcUMsVUFQckMsQUFPOEM7O3VDQUVwQixVQUFBLEFBQVUsS0FBVixBQUFlLE9BQU8sUUFUaEQsQUFTMEIsQUFBOEIsWUFUeEQsQUFTbUU7OytDQUVqQyxLQUFBLEFBQUssS0FBTCxBQUFVLE1BWDVDLEFBV2tDLEFBQWdCLE9BWGxELEFBV3dEOzs7K0NBR3RCLEtBQUEsQUFBSyxLQUFMLEFBQVUsTUFkNUMsQUFja0MsQUFBZ0IsUUFkbEQsQUFjeUQ7Ozt1Q0FHL0IsVUFBQSxBQUFVLFFBQVYsQUFBa0IsU0FBUyxFQUFFLE9BQU8sUUFqQjlELEFBaUIwQixBQUEyQixBQUFpQixVQWpCaEYsQUFBVSxBQWlCK0UsQUFJekYsQUFFRTs7Ozs7O1VBQUEsQUFBUyxLQUFULEFBQWUsT0FBTyxBQUNyQjtNQUFBLEFBQUksUUFBSixBQUFZLEFBQ1o7TUFBQSxBQUFJLFNBQVMsUUFBQSxBQUFRLElBQUksQ0FBekIsQUFBMEIsQUFDMUI7TUFBSSxRQUFRLE9BQVosQUFBWSxBQUFPLEFBQ25CO0tBQUEsQUFBRyxPQUFILEFBQVUsSUFBVixBQUFjLEFBQ2Q7UyxBQUFBLEFBQU8sQUFDUCxBQUVEOzs7TUFBSyxPQUFMLEFBQUssQUFBTyxBQUNaO1FBcENKLEFBb0NJLEFBQU8sQUFDVjs7Ozs7O0FDeENELElBQUksT0FBTyxRQUFYLEFBQVcsQUFBUTtBQUNuQixJQUFJLFFBQVEsUUFBWixBQUFZLEFBQVE7QUFDcEIsSUFBSSxXQUFXLFFBQWYsQUFBZSxBQUFRO0FBQ3ZCLElBQUksUUFBUSxRQUFaLEFBQVksQUFBUTs7QUFHcEIsS0FBQSxBQUFLLFdBQVcsVUFBQSxBQUFVLEtBQVYsQUFBZSxNQUFNLEFBQ3BDO09BQUEsQUFBTSxBQUNOO0tBQUksT0FBTyxTQUFBLEFBQVMsZUFBcEIsQUFBVyxBQUF3QixBQUNuQztPQUFBLEFBQU0sTUFBTixBQUFZLFlBSGIsQUFHQyxBQUF3QixBQUN4Qjs7OztBQ1ZELElBQUksS0FBSyxRQUFULEFBQVMsQUFBUTtBQUNqQixJQUFJLFVBQVUsUUFBZCxBQUFjLEFBQVE7QUFDdEIsSUFBSSxZQUFZLFFBQWhCLEFBQWdCLEFBQVE7O0FBRXhCLElBQUksYUFBYSxHQUFFLEFBQUM7Ozs7Ozs4REFNeUMsVUFBQSxBQUFVLFFBTnBELEFBTTBDLEFBQWtCLG9CQU41RCxBQU0rRTtxR0FDRSxVQUFBLEFBQVUsUUFQM0YsQUFPaUYsQUFBa0IsZ0JBUG5HLEFBT2tIOzs7Ozs7OERBTXhFLFVBQUEsQUFBVSxRQWJwRCxBQWEwQyxBQUFrQixhQWI1RCxBQWF3RTtpRUFDM0IsVUFBQSxBQUFVLFFBZHZELEFBYzZDLEFBQWtCLGFBZC9ELEFBYzJFO21GQUNaLFVBQUEsQUFBVSxRQWZ6RSxBQWUrRCxBQUFrQixnQkFmakYsQUFlZ0c7Ozs7Ozs7V0FPekcsVUFBQSxBQUFVLFFBdEJELEFBc0JULEFBQWtCLDRCQXRCVCxBQXNCb0Msc0JBQXFCLFVBQUEsQUFBVSxRQXRCbkUsQUFzQnlELEFBQWtCLDBCQXRCOUYsQUFBbUIsQUFzQm9HOzs7OztBQUt2SCxPQUFBLEFBQU8sVUFBVSxRQUFqQixBQUFpQixBQUFROzs7QUMvQnpCLElBQUksT0FBTyxRQUFYLEFBQVcsQUFBUTtBQUNuQixJQUFJLFFBQVEsUUFBWixBQUFZLEFBQVE7QUFDcEIsSUFBSSxXQUFXLFFBQWYsQUFBZSxBQUFRO0FBQ3ZCLElBQUksUUFBUSxRQUFaLEFBQVksQUFBUTs7QUFHcEIsS0FBQSxBQUFLLFdBQVcsVUFBQSxBQUFVLEtBQVYsQUFBZSxNQUFNLEFBQ3BDO09BQUEsQUFBTSxBQUNOO0tBQUksT0FBTyxTQUFBLEFBQVMsZUFBcEIsQUFBVyxBQUF3QixBQUNuQztPQUFBLEFBQU0sTUFBTixBQUFZLFlBSGIsQUFHQyxBQUF3QixBQUN4Qjs7OztBQ1ZELElBQUksS0FBSyxRQUFULEFBQVMsQUFBUTtBQUNqQixJQUFJLFVBQVUsUUFBZCxBQUFjLEFBQVE7QUFDdEIsSUFBSSxZQUFZLFFBQWhCLEFBQWdCLEFBQVE7O0FBRXhCLElBQUksYUFBYSxHQUFFLEFBQUM7Ozs7O2dCQUtMLFVBQUEsQUFBVSxRQUxOLEFBS0osQUFBa0Isc0JBTGQsQUFLbUM7OzhEQUVPLFVBQUEsQUFBVSxRQVBwRCxBQU8wQyxBQUFrQixvQkFQNUQsQUFPK0U7cUdBQ0UsVUFBQSxBQUFVLFFBUjNGLEFBUWlGLEFBQWtCLGdCQVJuRyxBQVFrSDs7Ozs7OzJEQU0zRSxVQUFBLEFBQVUsUUFkakQsQUFjdUMsQUFBa0IsVUFkekQsQUFja0U7eURBQzdCLFVBQUEsQUFBVSxRQWYvQyxBQWVxQyxBQUFrQixhQWZ2RCxBQWVtRTs4REFDekIsVUFBQSxBQUFVLFFBaEJwRCxBQWdCMEMsQUFBa0IsYUFoQjVELEFBZ0J3RTtpRUFDM0IsVUFBQSxBQUFVLFFBakJ2RCxBQWlCNkMsQUFBa0IsYUFqQi9ELEFBaUIyRTttRkFDWixVQUFBLEFBQVUsUUFsQnpFLEFBa0IrRCxBQUFrQiwwQkFsQmpGLEFBa0IwRzs7Ozs7OztXQU9uSCxVQUFBLEFBQVUsUUF6QkQsQUF5QlQsQUFBa0Isd0JBekJULEFBeUJnQyxzQkFBcUIsVUFBQSxBQUFVLFFBekIvRCxBQXlCcUQsQUFBa0IsV0F6QjFGLEFBQW1CLEFBeUJpRjs7Ozs7QUFLcEcsT0FBQSxBQUFPLFVBQVUsUUFBakIsQUFBaUIsQUFBUTs7O0FDbEN6QixPQUFBLEFBQU87a0IsQUFDQyxBQUNJOzZCQURKLEFBRUksZ0JBSEssQUFJTCxBQUNYO21CQUxnQixBQUtSLEFBQ1I7b0JBTmdCLEFBTVAsQUFDVDtvQkFQZ0IsQUFPUCxBQUNUO2dDQVJnQixBQVFLLEFBQ3JCOzhCQVRnQixBQVNHLEFBQ2hCOzBCQVZhLEFBVUUsQUFDZjtvQkFYYSxBQVdKLEFBQ1Q7dUJBWmEsQUFZRCxBQUNaO3VCQWJhLEFBYUQsQUFDWjt1QkFkYSxBQWNELEFBQ1o7b0NBZmEsQUFlWSxBQUN6QjtrQ0FoQmEsQUFnQlUsQUFDdkI7cUJBakJhLEFBaUJILEFBQ1Y7c0NBbEJhLEFBa0JjLEFBQzNCO3VCQW5CSixBQUFpQixBQUNoQixBQWtCZTs7OztBQ25CaEIsT0FBQSxBQUFPO1UsQUFBVSxBQUNULEFBQ1A7V0FGZ0IsQUFFUixBQUNSO1lBSGdCLEFBR1AsQUFDVDtZQUpnQixBQUlQLEFBQ1Q7d0JBTGdCLEFBS0ssQUFDckI7c0JBTmdCLEFBTUcsQUFDaEI7a0JBUGEsQUFPRSxBQUNmO1lBUmEsQUFRSixBQUNUO2VBVGEsQUFTRCxBQUNaO2VBVmEsQUFVRCxBQUNaO2VBWGEsQUFXRCxBQUNaOzRCQVphLEFBWVksQUFDekI7MEJBYmEsQUFhVSxBQUN2QjthQWRhLEFBY0gsQUFDVjs4QkFmYSxBQWVjLEFBQzNCO2VBaEJKLEFBQWlCLEFBQ2hCLEFBZWU7Ozs7O0FDZmhCLElBQUksQ0FBQyxPQUFMLEFBQVksTUFBTSxBQUNkO1FBQUEsQUFBTyxPQUFPLFEsQUFBZCxBQUFjLEFBQVEsQUFDdEI7U0FBQSxBQUFRLEFBQ1I7U0FBQSxBQUFRLEFBQ1g7Ozs7QUFHRCxJQUFJLHFCQUFxQixPQUFBLEFBQU8scUJBQXFCLFFBQXJELEFBQXFELEFBQVE7O0FBRTdELFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTs7O0FBTVIsSUFBSSxvQkFBb0IsUUFBeEIsQUFBd0IsQUFBUTs7O0FBR2hDLElBQUksS0FBSyxRQUFULEFBQVMsQUFBUTtBQUNqQixJQUFJLEtBQUssUUFBVCxBQUFTLEFBQVE7O0FBRWpCLElBQUksV0FBSixBQUFlO0FBQ2YsU0FBQSxBQUFTLEtBQVQsQUFBYztBQUNkLFNBQUEsQUFBUyxXQUFULEFBQW9COztBQUdwQixJQUFJLFNBQUosQUFBYTs7QUFFYixPQUFBLEFBQU87VUFDRyxVQUFBLEFBQVUsTUFBVixBQUFnQixNQUFNLEFBQzlCO1NBQU8sUUFBUCxBQUFlLEFBQ2Y7TUFBSSxNQUFNLElBQUEsQUFBSSxrQkFBa0IsU0FBQSxBQUFTLFFBQS9CLEFBQXNCLEFBQWlCLE9BQXZDLEFBQThDLFFBQXhELEFBQVUsQUFBc0QsQUFDaEU7U0FBTyxJQUFBLEFBQUksT0FKSSxBQUlmLEFBQU8sQUFBVyxBQUNsQixBQUNEOztPQUFNLElBQUEsQUFBSSxtQkFOWCxBQUFpQixBQUNoQixBQUtNLEFBQXVCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyogZ2xvYmFsIEhUTUxFbGVtZW50ICovXG5cbid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVtcHR5RWxlbWVudCAoZWxlbWVudCkge1xuICBpZiAoIShlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYW4gZWxlbWVudCcpXG4gIH1cblxuICB2YXIgbm9kZVxuICB3aGlsZSAoKG5vZGUgPSBlbGVtZW50Lmxhc3RDaGlsZCkpIGVsZW1lbnQucmVtb3ZlQ2hpbGQobm9kZSlcbiAgcmV0dXJuIGVsZW1lbnRcbn1cbiIsIi8qIGpzaGludCBub2RlOnRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgSW50bE1lc3NhZ2VGb3JtYXQgPSByZXF1aXJlKCcuL2xpYi9tYWluJylbJ2RlZmF1bHQnXTtcblxuLy8gQWRkIGFsbCBsb2NhbGUgZGF0YSB0byBgSW50bE1lc3NhZ2VGb3JtYXRgLiBUaGlzIG1vZHVsZSB3aWxsIGJlIGlnbm9yZWQgd2hlblxuLy8gYnVuZGxpbmcgZm9yIHRoZSBicm93c2VyIHdpdGggQnJvd3NlcmlmeS9XZWJwYWNrLlxucmVxdWlyZSgnLi9saWIvbG9jYWxlcycpO1xuXG4vLyBSZS1leHBvcnQgYEludGxNZXNzYWdlRm9ybWF0YCBhcyB0aGUgQ29tbW9uSlMgZGVmYXVsdCBleHBvcnRzIHdpdGggYWxsIHRoZVxuLy8gbG9jYWxlIGRhdGEgcmVnaXN0ZXJlZCwgYW5kIHdpdGggRW5nbGlzaCBzZXQgYXMgdGhlIGRlZmF1bHQgbG9jYWxlLiBEZWZpbmVcbi8vIHRoZSBgZGVmYXVsdGAgcHJvcCBmb3IgdXNlIHdpdGggb3RoZXIgY29tcGlsZWQgRVM2IE1vZHVsZXMuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBJbnRsTWVzc2FnZUZvcm1hdDtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGV4cG9ydHM7XG4iLCIvKlxuQ29weXJpZ2h0IChjKSAyMDE0LCBZYWhvbyEgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuQ29weXJpZ2h0cyBsaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBMaWNlbnNlLlxuU2VlIHRoZSBhY2NvbXBhbnlpbmcgTElDRU5TRSBmaWxlIGZvciB0ZXJtcy5cbiovXG5cbi8qIGpzbGludCBlc25leHQ6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IENvbXBpbGVyO1xuXG5mdW5jdGlvbiBDb21waWxlcihsb2NhbGVzLCBmb3JtYXRzLCBwbHVyYWxGbikge1xuICAgIHRoaXMubG9jYWxlcyAgPSBsb2NhbGVzO1xuICAgIHRoaXMuZm9ybWF0cyAgPSBmb3JtYXRzO1xuICAgIHRoaXMucGx1cmFsRm4gPSBwbHVyYWxGbjtcbn1cblxuQ29tcGlsZXIucHJvdG90eXBlLmNvbXBpbGUgPSBmdW5jdGlvbiAoYXN0KSB7XG4gICAgdGhpcy5wbHVyYWxTdGFjayAgICAgICAgPSBbXTtcbiAgICB0aGlzLmN1cnJlbnRQbHVyYWwgICAgICA9IG51bGw7XG4gICAgdGhpcy5wbHVyYWxOdW1iZXJGb3JtYXQgPSBudWxsO1xuXG4gICAgcmV0dXJuIHRoaXMuY29tcGlsZU1lc3NhZ2UoYXN0KTtcbn07XG5cbkNvbXBpbGVyLnByb3RvdHlwZS5jb21waWxlTWVzc2FnZSA9IGZ1bmN0aW9uIChhc3QpIHtcbiAgICBpZiAoIShhc3QgJiYgYXN0LnR5cGUgPT09ICdtZXNzYWdlRm9ybWF0UGF0dGVybicpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTWVzc2FnZSBBU1QgaXMgbm90IG9mIHR5cGU6IFwibWVzc2FnZUZvcm1hdFBhdHRlcm5cIicpO1xuICAgIH1cblxuICAgIHZhciBlbGVtZW50cyA9IGFzdC5lbGVtZW50cyxcbiAgICAgICAgcGF0dGVybiAgPSBbXTtcblxuICAgIHZhciBpLCBsZW4sIGVsZW1lbnQ7XG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICBlbGVtZW50ID0gZWxlbWVudHNbaV07XG5cbiAgICAgICAgc3dpdGNoIChlbGVtZW50LnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ21lc3NhZ2VUZXh0RWxlbWVudCc6XG4gICAgICAgICAgICAgICAgcGF0dGVybi5wdXNoKHRoaXMuY29tcGlsZU1lc3NhZ2VUZXh0KGVsZW1lbnQpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnYXJndW1lbnRFbGVtZW50JzpcbiAgICAgICAgICAgICAgICBwYXR0ZXJuLnB1c2godGhpcy5jb21waWxlQXJndW1lbnQoZWxlbWVudCkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWVzc2FnZSBlbGVtZW50IGRvZXMgbm90IGhhdmUgYSB2YWxpZCB0eXBlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcGF0dGVybjtcbn07XG5cbkNvbXBpbGVyLnByb3RvdHlwZS5jb21waWxlTWVzc2FnZVRleHQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIC8vIFdoZW4gdGhpcyBgZWxlbWVudGAgaXMgcGFydCBvZiBwbHVyYWwgc3ViLXBhdHRlcm4gYW5kIGl0cyB2YWx1ZSBjb250YWluc1xuICAgIC8vIGFuIHVuZXNjYXBlZCAnIycsIHVzZSBhIGBQbHVyYWxPZmZzZXRTdHJpbmdgIGhlbHBlciB0byBwcm9wZXJseSBvdXRwdXRcbiAgICAvLyB0aGUgbnVtYmVyIHdpdGggdGhlIGNvcnJlY3Qgb2Zmc2V0IGluIHRoZSBzdHJpbmcuXG4gICAgaWYgKHRoaXMuY3VycmVudFBsdXJhbCAmJiAvKF58W15cXFxcXSkjL2cudGVzdChlbGVtZW50LnZhbHVlKSkge1xuICAgICAgICAvLyBDcmVhdGUgYSBjYWNoZSBhIE51bWJlckZvcm1hdCBpbnN0YW5jZSB0aGF0IGNhbiBiZSByZXVzZWQgZm9yIGFueVxuICAgICAgICAvLyBQbHVyYWxPZmZzZXRTdHJpbmcgaW5zdGFuY2UgaW4gdGhpcyBtZXNzYWdlLlxuICAgICAgICBpZiAoIXRoaXMucGx1cmFsTnVtYmVyRm9ybWF0KSB7XG4gICAgICAgICAgICB0aGlzLnBsdXJhbE51bWJlckZvcm1hdCA9IG5ldyBJbnRsLk51bWJlckZvcm1hdCh0aGlzLmxvY2FsZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQbHVyYWxPZmZzZXRTdHJpbmcoXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGx1cmFsLmlkLFxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBsdXJhbC5mb3JtYXQub2Zmc2V0LFxuICAgICAgICAgICAgICAgIHRoaXMucGx1cmFsTnVtYmVyRm9ybWF0LFxuICAgICAgICAgICAgICAgIGVsZW1lbnQudmFsdWUpO1xuICAgIH1cblxuICAgIC8vIFVuZXNjYXBlIHRoZSBlc2NhcGVkICcjJ3MgaW4gdGhlIG1lc3NhZ2UgdGV4dC5cbiAgICByZXR1cm4gZWxlbWVudC52YWx1ZS5yZXBsYWNlKC9cXFxcIy9nLCAnIycpO1xufTtcblxuQ29tcGlsZXIucHJvdG90eXBlLmNvbXBpbGVBcmd1bWVudCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgdmFyIGZvcm1hdCA9IGVsZW1lbnQuZm9ybWF0O1xuXG4gICAgaWYgKCFmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdGb3JtYXQoZWxlbWVudC5pZCk7XG4gICAgfVxuXG4gICAgdmFyIGZvcm1hdHMgID0gdGhpcy5mb3JtYXRzLFxuICAgICAgICBsb2NhbGVzICA9IHRoaXMubG9jYWxlcyxcbiAgICAgICAgcGx1cmFsRm4gPSB0aGlzLnBsdXJhbEZuLFxuICAgICAgICBvcHRpb25zO1xuXG4gICAgc3dpdGNoIChmb3JtYXQudHlwZSkge1xuICAgICAgICBjYXNlICdudW1iZXJGb3JtYXQnOlxuICAgICAgICAgICAgb3B0aW9ucyA9IGZvcm1hdHMubnVtYmVyW2Zvcm1hdC5zdHlsZV07XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGlkICAgIDogZWxlbWVudC5pZCxcbiAgICAgICAgICAgICAgICBmb3JtYXQ6IG5ldyBJbnRsLk51bWJlckZvcm1hdChsb2NhbGVzLCBvcHRpb25zKS5mb3JtYXRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgY2FzZSAnZGF0ZUZvcm1hdCc6XG4gICAgICAgICAgICBvcHRpb25zID0gZm9ybWF0cy5kYXRlW2Zvcm1hdC5zdHlsZV07XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGlkICAgIDogZWxlbWVudC5pZCxcbiAgICAgICAgICAgICAgICBmb3JtYXQ6IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGxvY2FsZXMsIG9wdGlvbnMpLmZvcm1hdFxuICAgICAgICAgICAgfTtcblxuICAgICAgICBjYXNlICd0aW1lRm9ybWF0JzpcbiAgICAgICAgICAgIG9wdGlvbnMgPSBmb3JtYXRzLnRpbWVbZm9ybWF0LnN0eWxlXTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaWQgICAgOiBlbGVtZW50LmlkLFxuICAgICAgICAgICAgICAgIGZvcm1hdDogbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobG9jYWxlcywgb3B0aW9ucykuZm9ybWF0XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGNhc2UgJ3BsdXJhbEZvcm1hdCc6XG4gICAgICAgICAgICBvcHRpb25zID0gdGhpcy5jb21waWxlT3B0aW9ucyhlbGVtZW50KTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUGx1cmFsRm9ybWF0KFxuICAgICAgICAgICAgICAgIGVsZW1lbnQuaWQsIGZvcm1hdC5vcmRpbmFsLCBmb3JtYXQub2Zmc2V0LCBvcHRpb25zLCBwbHVyYWxGblxuICAgICAgICAgICAgKTtcblxuICAgICAgICBjYXNlICdzZWxlY3RGb3JtYXQnOlxuICAgICAgICAgICAgb3B0aW9ucyA9IHRoaXMuY29tcGlsZU9wdGlvbnMoZWxlbWVudCk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFNlbGVjdEZvcm1hdChlbGVtZW50LmlkLCBvcHRpb25zKTtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNZXNzYWdlIGVsZW1lbnQgZG9lcyBub3QgaGF2ZSBhIHZhbGlkIGZvcm1hdCB0eXBlJyk7XG4gICAgfVxufTtcblxuQ29tcGlsZXIucHJvdG90eXBlLmNvbXBpbGVPcHRpb25zID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICB2YXIgZm9ybWF0ICAgICAgPSBlbGVtZW50LmZvcm1hdCxcbiAgICAgICAgb3B0aW9ucyAgICAgPSBmb3JtYXQub3B0aW9ucyxcbiAgICAgICAgb3B0aW9uc0hhc2ggPSB7fTtcblxuICAgIC8vIFNhdmUgdGhlIGN1cnJlbnQgcGx1cmFsIGVsZW1lbnQsIGlmIGFueSwgdGhlbiBzZXQgaXQgdG8gYSBuZXcgdmFsdWUgd2hlblxuICAgIC8vIGNvbXBpbGluZyB0aGUgb3B0aW9ucyBzdWItcGF0dGVybnMuIFRoaXMgY29uZm9ybXMgdGhlIHNwZWMncyBhbGdvcml0aG1cbiAgICAvLyBmb3IgaGFuZGxpbmcgYFwiI1wiYCBzeW50YXggaW4gbWVzc2FnZSB0ZXh0LlxuICAgIHRoaXMucGx1cmFsU3RhY2sucHVzaCh0aGlzLmN1cnJlbnRQbHVyYWwpO1xuICAgIHRoaXMuY3VycmVudFBsdXJhbCA9IGZvcm1hdC50eXBlID09PSAncGx1cmFsRm9ybWF0JyA/IGVsZW1lbnQgOiBudWxsO1xuXG4gICAgdmFyIGksIGxlbiwgb3B0aW9uO1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gb3B0aW9ucy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICBvcHRpb24gPSBvcHRpb25zW2ldO1xuXG4gICAgICAgIC8vIENvbXBpbGUgdGhlIHN1Yi1wYXR0ZXJuIGFuZCBzYXZlIGl0IHVuZGVyIHRoZSBvcHRpb25zJ3Mgc2VsZWN0b3IuXG4gICAgICAgIG9wdGlvbnNIYXNoW29wdGlvbi5zZWxlY3Rvcl0gPSB0aGlzLmNvbXBpbGVNZXNzYWdlKG9wdGlvbi52YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gUG9wIHRoZSBwbHVyYWwgc3RhY2sgdG8gcHV0IGJhY2sgdGhlIG9yaWdpbmFsIGN1cnJlbnQgcGx1cmFsIHZhbHVlLlxuICAgIHRoaXMuY3VycmVudFBsdXJhbCA9IHRoaXMucGx1cmFsU3RhY2sucG9wKCk7XG5cbiAgICByZXR1cm4gb3B0aW9uc0hhc2g7XG59O1xuXG4vLyAtLSBDb21waWxlciBIZWxwZXIgQ2xhc3NlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBTdHJpbmdGb3JtYXQoaWQpIHtcbiAgICB0aGlzLmlkID0gaWQ7XG59XG5cblN0cmluZ0Zvcm1hdC5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZSA6IFN0cmluZyh2YWx1ZSk7XG59O1xuXG5mdW5jdGlvbiBQbHVyYWxGb3JtYXQoaWQsIHVzZU9yZGluYWwsIG9mZnNldCwgb3B0aW9ucywgcGx1cmFsRm4pIHtcbiAgICB0aGlzLmlkICAgICAgICAgPSBpZDtcbiAgICB0aGlzLnVzZU9yZGluYWwgPSB1c2VPcmRpbmFsO1xuICAgIHRoaXMub2Zmc2V0ICAgICA9IG9mZnNldDtcbiAgICB0aGlzLm9wdGlvbnMgICAgPSBvcHRpb25zO1xuICAgIHRoaXMucGx1cmFsRm4gICA9IHBsdXJhbEZuO1xufVxuXG5QbHVyYWxGb3JtYXQucHJvdG90eXBlLmdldE9wdGlvbiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgdmFyIG9wdGlvbiA9IG9wdGlvbnNbJz0nICsgdmFsdWVdIHx8XG4gICAgICAgICAgICBvcHRpb25zW3RoaXMucGx1cmFsRm4odmFsdWUgLSB0aGlzLm9mZnNldCwgdGhpcy51c2VPcmRpbmFsKV07XG5cbiAgICByZXR1cm4gb3B0aW9uIHx8IG9wdGlvbnMub3RoZXI7XG59O1xuXG5mdW5jdGlvbiBQbHVyYWxPZmZzZXRTdHJpbmcoaWQsIG9mZnNldCwgbnVtYmVyRm9ybWF0LCBzdHJpbmcpIHtcbiAgICB0aGlzLmlkICAgICAgICAgICA9IGlkO1xuICAgIHRoaXMub2Zmc2V0ICAgICAgID0gb2Zmc2V0O1xuICAgIHRoaXMubnVtYmVyRm9ybWF0ID0gbnVtYmVyRm9ybWF0O1xuICAgIHRoaXMuc3RyaW5nICAgICAgID0gc3RyaW5nO1xufVxuXG5QbHVyYWxPZmZzZXRTdHJpbmcucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciBudW1iZXIgPSB0aGlzLm51bWJlckZvcm1hdC5mb3JtYXQodmFsdWUgLSB0aGlzLm9mZnNldCk7XG5cbiAgICByZXR1cm4gdGhpcy5zdHJpbmdcbiAgICAgICAgICAgIC5yZXBsYWNlKC8oXnxbXlxcXFxdKSMvZywgJyQxJyArIG51bWJlcilcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcIy9nLCAnIycpO1xufTtcblxuZnVuY3Rpb24gU2VsZWN0Rm9ybWF0KGlkLCBvcHRpb25zKSB7XG4gICAgdGhpcy5pZCAgICAgID0gaWQ7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbn1cblxuU2VsZWN0Rm9ybWF0LnByb3RvdHlwZS5nZXRPcHRpb24gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICByZXR1cm4gb3B0aW9uc1t2YWx1ZV0gfHwgb3B0aW9ucy5vdGhlcjtcbn07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbXBpbGVyLmpzLm1hcCIsIi8qXG5Db3B5cmlnaHQgKGMpIDIwMTQsIFlhaG9vISBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5Db3B5cmlnaHRzIGxpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIExpY2Vuc2UuXG5TZWUgdGhlIGFjY29tcGFueWluZyBMSUNFTlNFIGZpbGUgZm9yIHRlcm1zLlxuKi9cblxuLyoganNsaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcbnZhciBzcmMkdXRpbHMkJCA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpLCBzcmMkZXM1JCQgPSByZXF1aXJlKFwiLi9lczVcIiksIHNyYyRjb21waWxlciQkID0gcmVxdWlyZShcIi4vY29tcGlsZXJcIiksIGludGwkbWVzc2FnZWZvcm1hdCRwYXJzZXIkJCA9IHJlcXVpcmUoXCJpbnRsLW1lc3NhZ2Vmb3JtYXQtcGFyc2VyXCIpO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBNZXNzYWdlRm9ybWF0O1xuXG4vLyAtLSBNZXNzYWdlRm9ybWF0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIE1lc3NhZ2VGb3JtYXQobWVzc2FnZSwgbG9jYWxlcywgZm9ybWF0cykge1xuICAgIC8vIFBhcnNlIHN0cmluZyBtZXNzYWdlcyBpbnRvIGFuIEFTVC5cbiAgICB2YXIgYXN0ID0gdHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnID9cbiAgICAgICAgICAgIE1lc3NhZ2VGb3JtYXQuX19wYXJzZShtZXNzYWdlKSA6IG1lc3NhZ2U7XG5cbiAgICBpZiAoIShhc3QgJiYgYXN0LnR5cGUgPT09ICdtZXNzYWdlRm9ybWF0UGF0dGVybicpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0EgbWVzc2FnZSBtdXN0IGJlIHByb3ZpZGVkIGFzIGEgU3RyaW5nIG9yIEFTVC4nKTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGVzIGEgbmV3IG9iamVjdCB3aXRoIHRoZSBzcGVjaWZpZWQgYGZvcm1hdHNgIG1lcmdlZCB3aXRoIHRoZSBkZWZhdWx0XG4gICAgLy8gZm9ybWF0cy5cbiAgICBmb3JtYXRzID0gdGhpcy5fbWVyZ2VGb3JtYXRzKE1lc3NhZ2VGb3JtYXQuZm9ybWF0cywgZm9ybWF0cyk7XG5cbiAgICAvLyBEZWZpbmVkIGZpcnN0IGJlY2F1c2UgaXQncyB1c2VkIHRvIGJ1aWxkIHRoZSBmb3JtYXQgcGF0dGVybi5cbiAgICBzcmMkZXM1JCQuZGVmaW5lUHJvcGVydHkodGhpcywgJ19sb2NhbGUnLCAge3ZhbHVlOiB0aGlzLl9yZXNvbHZlTG9jYWxlKGxvY2FsZXMpfSk7XG5cbiAgICAvLyBDb21waWxlIHRoZSBgYXN0YCB0byBhIHBhdHRlcm4gdGhhdCBpcyBoaWdobHkgb3B0aW1pemVkIGZvciByZXBlYXRlZFxuICAgIC8vIGBmb3JtYXQoKWAgaW52b2NhdGlvbnMuICoqTm90ZToqKiBUaGlzIHBhc3NlcyB0aGUgYGxvY2FsZXNgIHNldCBwcm92aWRlZFxuICAgIC8vIHRvIHRoZSBjb25zdHJ1Y3RvciBpbnN0ZWFkIG9mIGp1c3QgdGhlIHJlc29sdmVkIGxvY2FsZS5cbiAgICB2YXIgcGx1cmFsRm4gPSB0aGlzLl9maW5kUGx1cmFsUnVsZUZ1bmN0aW9uKHRoaXMuX2xvY2FsZSk7XG4gICAgdmFyIHBhdHRlcm4gID0gdGhpcy5fY29tcGlsZVBhdHRlcm4oYXN0LCBsb2NhbGVzLCBmb3JtYXRzLCBwbHVyYWxGbik7XG5cbiAgICAvLyBcIkJpbmRcIiBgZm9ybWF0KClgIG1ldGhvZCB0byBgdGhpc2Agc28gaXQgY2FuIGJlIHBhc3NlZCBieSByZWZlcmVuY2UgbGlrZVxuICAgIC8vIHRoZSBvdGhlciBgSW50bGAgQVBJcy5cbiAgICB2YXIgbWVzc2FnZUZvcm1hdCA9IHRoaXM7XG4gICAgdGhpcy5mb3JtYXQgPSBmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlRm9ybWF0Ll9mb3JtYXQocGF0dGVybiwgdmFsdWVzKTtcbiAgICB9O1xufVxuXG4vLyBEZWZhdWx0IGZvcm1hdCBvcHRpb25zIHVzZWQgYXMgdGhlIHByb3RvdHlwZSBvZiB0aGUgYGZvcm1hdHNgIHByb3ZpZGVkIHRvIHRoZVxuLy8gY29uc3RydWN0b3IuIFRoZXNlIGFyZSB1c2VkIHdoZW4gY29uc3RydWN0aW5nIHRoZSBpbnRlcm5hbCBJbnRsLk51bWJlckZvcm1hdFxuLy8gYW5kIEludGwuRGF0ZVRpbWVGb3JtYXQgaW5zdGFuY2VzLlxuc3JjJGVzNSQkLmRlZmluZVByb3BlcnR5KE1lc3NhZ2VGb3JtYXQsICdmb3JtYXRzJywge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG5cbiAgICB2YWx1ZToge1xuICAgICAgICBudW1iZXI6IHtcbiAgICAgICAgICAgICdjdXJyZW5jeSc6IHtcbiAgICAgICAgICAgICAgICBzdHlsZTogJ2N1cnJlbmN5J1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgJ3BlcmNlbnQnOiB7XG4gICAgICAgICAgICAgICAgc3R5bGU6ICdwZXJjZW50J1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGRhdGU6IHtcbiAgICAgICAgICAgICdzaG9ydCc6IHtcbiAgICAgICAgICAgICAgICBtb250aDogJ251bWVyaWMnLFxuICAgICAgICAgICAgICAgIGRheSAgOiAnbnVtZXJpYycsXG4gICAgICAgICAgICAgICAgeWVhciA6ICcyLWRpZ2l0J1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgJ21lZGl1bSc6IHtcbiAgICAgICAgICAgICAgICBtb250aDogJ3Nob3J0JyxcbiAgICAgICAgICAgICAgICBkYXkgIDogJ251bWVyaWMnLFxuICAgICAgICAgICAgICAgIHllYXIgOiAnbnVtZXJpYydcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICdsb25nJzoge1xuICAgICAgICAgICAgICAgIG1vbnRoOiAnbG9uZycsXG4gICAgICAgICAgICAgICAgZGF5ICA6ICdudW1lcmljJyxcbiAgICAgICAgICAgICAgICB5ZWFyIDogJ251bWVyaWMnXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAnZnVsbCc6IHtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5OiAnbG9uZycsXG4gICAgICAgICAgICAgICAgbW9udGggIDogJ2xvbmcnLFxuICAgICAgICAgICAgICAgIGRheSAgICA6ICdudW1lcmljJyxcbiAgICAgICAgICAgICAgICB5ZWFyICAgOiAnbnVtZXJpYydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB0aW1lOiB7XG4gICAgICAgICAgICAnc2hvcnQnOiB7XG4gICAgICAgICAgICAgICAgaG91ciAgOiAnbnVtZXJpYycsXG4gICAgICAgICAgICAgICAgbWludXRlOiAnbnVtZXJpYydcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICdtZWRpdW0nOiAge1xuICAgICAgICAgICAgICAgIGhvdXIgIDogJ251bWVyaWMnLFxuICAgICAgICAgICAgICAgIG1pbnV0ZTogJ251bWVyaWMnLFxuICAgICAgICAgICAgICAgIHNlY29uZDogJ251bWVyaWMnXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAnbG9uZyc6IHtcbiAgICAgICAgICAgICAgICBob3VyICAgICAgICA6ICdudW1lcmljJyxcbiAgICAgICAgICAgICAgICBtaW51dGUgICAgICA6ICdudW1lcmljJyxcbiAgICAgICAgICAgICAgICBzZWNvbmQgICAgICA6ICdudW1lcmljJyxcbiAgICAgICAgICAgICAgICB0aW1lWm9uZU5hbWU6ICdzaG9ydCdcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICdmdWxsJzoge1xuICAgICAgICAgICAgICAgIGhvdXIgICAgICAgIDogJ251bWVyaWMnLFxuICAgICAgICAgICAgICAgIG1pbnV0ZSAgICAgIDogJ251bWVyaWMnLFxuICAgICAgICAgICAgICAgIHNlY29uZCAgICAgIDogJ251bWVyaWMnLFxuICAgICAgICAgICAgICAgIHRpbWVab25lTmFtZTogJ3Nob3J0J1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbi8vIERlZmluZSBpbnRlcm5hbCBwcml2YXRlIHByb3BlcnRpZXMgZm9yIGRlYWxpbmcgd2l0aCBsb2NhbGUgZGF0YS5cbnNyYyRlczUkJC5kZWZpbmVQcm9wZXJ0eShNZXNzYWdlRm9ybWF0LCAnX19sb2NhbGVEYXRhX18nLCB7dmFsdWU6IHNyYyRlczUkJC5vYmpDcmVhdGUobnVsbCl9KTtcbnNyYyRlczUkJC5kZWZpbmVQcm9wZXJ0eShNZXNzYWdlRm9ybWF0LCAnX19hZGRMb2NhbGVEYXRhJywge3ZhbHVlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGlmICghKGRhdGEgJiYgZGF0YS5sb2NhbGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICdMb2NhbGUgZGF0YSBwcm92aWRlZCB0byBJbnRsTWVzc2FnZUZvcm1hdCBpcyBtaXNzaW5nIGEgJyArXG4gICAgICAgICAgICAnYGxvY2FsZWAgcHJvcGVydHknXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgTWVzc2FnZUZvcm1hdC5fX2xvY2FsZURhdGFfX1tkYXRhLmxvY2FsZS50b0xvd2VyQ2FzZSgpXSA9IGRhdGE7XG59fSk7XG5cbi8vIERlZmluZXMgYF9fcGFyc2UoKWAgc3RhdGljIG1ldGhvZCBhcyBhbiBleHBvc2VkIHByaXZhdGUuXG5zcmMkZXM1JCQuZGVmaW5lUHJvcGVydHkoTWVzc2FnZUZvcm1hdCwgJ19fcGFyc2UnLCB7dmFsdWU6IGludGwkbWVzc2FnZWZvcm1hdCRwYXJzZXIkJFtcImRlZmF1bHRcIl0ucGFyc2V9KTtcblxuLy8gRGVmaW5lIHB1YmxpYyBgZGVmYXVsdExvY2FsZWAgcHJvcGVydHkgd2hpY2ggZGVmYXVsdHMgdG8gRW5nbGlzaCwgYnV0IGNhbiBiZVxuLy8gc2V0IGJ5IHRoZSBkZXZlbG9wZXIuXG5zcmMkZXM1JCQuZGVmaW5lUHJvcGVydHkoTWVzc2FnZUZvcm1hdCwgJ2RlZmF1bHRMb2NhbGUnLCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZSAgOiB0cnVlLFxuICAgIHZhbHVlICAgICA6IHVuZGVmaW5lZFxufSk7XG5cbk1lc3NhZ2VGb3JtYXQucHJvdG90eXBlLnJlc29sdmVkT3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUT0RPOiBQcm92aWRlIGFueXRoaW5nIGVsc2U/XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbG9jYWxlOiB0aGlzLl9sb2NhbGVcbiAgICB9O1xufTtcblxuTWVzc2FnZUZvcm1hdC5wcm90b3R5cGUuX2NvbXBpbGVQYXR0ZXJuID0gZnVuY3Rpb24gKGFzdCwgbG9jYWxlcywgZm9ybWF0cywgcGx1cmFsRm4pIHtcbiAgICB2YXIgY29tcGlsZXIgPSBuZXcgc3JjJGNvbXBpbGVyJCRbXCJkZWZhdWx0XCJdKGxvY2FsZXMsIGZvcm1hdHMsIHBsdXJhbEZuKTtcbiAgICByZXR1cm4gY29tcGlsZXIuY29tcGlsZShhc3QpO1xufTtcblxuTWVzc2FnZUZvcm1hdC5wcm90b3R5cGUuX2ZpbmRQbHVyYWxSdWxlRnVuY3Rpb24gPSBmdW5jdGlvbiAobG9jYWxlKSB7XG4gICAgdmFyIGxvY2FsZURhdGEgPSBNZXNzYWdlRm9ybWF0Ll9fbG9jYWxlRGF0YV9fO1xuICAgIHZhciBkYXRhICAgICAgID0gbG9jYWxlRGF0YVtsb2NhbGUudG9Mb3dlckNhc2UoKV07XG5cbiAgICAvLyBUaGUgbG9jYWxlIGRhdGEgaXMgZGUtZHVwbGljYXRlZCwgc28gd2UgaGF2ZSB0byB0cmF2ZXJzZSB0aGUgbG9jYWxlJ3NcbiAgICAvLyBoaWVyYXJjaHkgdW50aWwgd2UgZmluZCBhIGBwbHVyYWxSdWxlRnVuY3Rpb25gIHRvIHJldHVybi5cbiAgICB3aGlsZSAoZGF0YSkge1xuICAgICAgICBpZiAoZGF0YS5wbHVyYWxSdWxlRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLnBsdXJhbFJ1bGVGdW5jdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGEgPSBkYXRhLnBhcmVudExvY2FsZSAmJiBsb2NhbGVEYXRhW2RhdGEucGFyZW50TG9jYWxlLnRvTG93ZXJDYXNlKCldO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0xvY2FsZSBkYXRhIGFkZGVkIHRvIEludGxNZXNzYWdlRm9ybWF0IGlzIG1pc3NpbmcgYSAnICtcbiAgICAgICAgJ2BwbHVyYWxSdWxlRnVuY3Rpb25gIGZvciA6JyArIGxvY2FsZVxuICAgICk7XG59O1xuXG5NZXNzYWdlRm9ybWF0LnByb3RvdHlwZS5fZm9ybWF0ID0gZnVuY3Rpb24gKHBhdHRlcm4sIHZhbHVlcykge1xuICAgIHZhciByZXN1bHQgPSAnJyxcbiAgICAgICAgaSwgbGVuLCBwYXJ0LCBpZCwgdmFsdWU7XG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBwYXR0ZXJuLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgIHBhcnQgPSBwYXR0ZXJuW2ldO1xuXG4gICAgICAgIC8vIEV4aXN0IGVhcmx5IGZvciBzdHJpbmcgcGFydHMuXG4gICAgICAgIGlmICh0eXBlb2YgcGFydCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBwYXJ0O1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZCA9IHBhcnQuaWQ7XG5cbiAgICAgICAgLy8gRW5mb3JjZSB0aGF0IGFsbCByZXF1aXJlZCB2YWx1ZXMgYXJlIHByb3ZpZGVkIGJ5IHRoZSBjYWxsZXIuXG4gICAgICAgIGlmICghKHZhbHVlcyAmJiBzcmMkdXRpbHMkJC5ob3AuY2FsbCh2YWx1ZXMsIGlkKSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQSB2YWx1ZSBtdXN0IGJlIHByb3ZpZGVkIGZvcjogJyArIGlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlID0gdmFsdWVzW2lkXTtcblxuICAgICAgICAvLyBSZWN1cnNpdmVseSBmb3JtYXQgcGx1cmFsIGFuZCBzZWxlY3QgcGFydHMnIG9wdGlvbiDigJQgd2hpY2ggY2FuIGJlIGFcbiAgICAgICAgLy8gbmVzdGVkIHBhdHRlcm4gc3RydWN0dXJlLiBUaGUgY2hvb3Npbmcgb2YgdGhlIG9wdGlvbiB0byB1c2UgaXNcbiAgICAgICAgLy8gYWJzdHJhY3RlZC1ieSBhbmQgZGVsZWdhdGVkLXRvIHRoZSBwYXJ0IGhlbHBlciBvYmplY3QuXG4gICAgICAgIGlmIChwYXJ0Lm9wdGlvbnMpIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSB0aGlzLl9mb3JtYXQocGFydC5nZXRPcHRpb24odmFsdWUpLCB2YWx1ZXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ICs9IHBhcnQuZm9ybWF0KHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5NZXNzYWdlRm9ybWF0LnByb3RvdHlwZS5fbWVyZ2VGb3JtYXRzID0gZnVuY3Rpb24gKGRlZmF1bHRzLCBmb3JtYXRzKSB7XG4gICAgdmFyIG1lcmdlZEZvcm1hdHMgPSB7fSxcbiAgICAgICAgdHlwZSwgbWVyZ2VkVHlwZTtcblxuICAgIGZvciAodHlwZSBpbiBkZWZhdWx0cykge1xuICAgICAgICBpZiAoIXNyYyR1dGlscyQkLmhvcC5jYWxsKGRlZmF1bHRzLCB0eXBlKSkgeyBjb250aW51ZTsgfVxuXG4gICAgICAgIG1lcmdlZEZvcm1hdHNbdHlwZV0gPSBtZXJnZWRUeXBlID0gc3JjJGVzNSQkLm9iakNyZWF0ZShkZWZhdWx0c1t0eXBlXSk7XG5cbiAgICAgICAgaWYgKGZvcm1hdHMgJiYgc3JjJHV0aWxzJCQuaG9wLmNhbGwoZm9ybWF0cywgdHlwZSkpIHtcbiAgICAgICAgICAgIHNyYyR1dGlscyQkLmV4dGVuZChtZXJnZWRUeXBlLCBmb3JtYXRzW3R5cGVdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtZXJnZWRGb3JtYXRzO1xufTtcblxuTWVzc2FnZUZvcm1hdC5wcm90b3R5cGUuX3Jlc29sdmVMb2NhbGUgPSBmdW5jdGlvbiAobG9jYWxlcykge1xuICAgIGlmICh0eXBlb2YgbG9jYWxlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgbG9jYWxlcyA9IFtsb2NhbGVzXTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgYSBjb3B5IG9mIHRoZSBhcnJheSBzbyB3ZSBjYW4gcHVzaCBvbiB0aGUgZGVmYXVsdCBsb2NhbGUuXG4gICAgbG9jYWxlcyA9IChsb2NhbGVzIHx8IFtdKS5jb25jYXQoTWVzc2FnZUZvcm1hdC5kZWZhdWx0TG9jYWxlKTtcblxuICAgIHZhciBsb2NhbGVEYXRhID0gTWVzc2FnZUZvcm1hdC5fX2xvY2FsZURhdGFfXztcbiAgICB2YXIgaSwgbGVuLCBsb2NhbGVQYXJ0cywgZGF0YTtcblxuICAgIC8vIFVzaW5nIHRoZSBzZXQgb2YgbG9jYWxlcyArIHRoZSBkZWZhdWx0IGxvY2FsZSwgd2UgbG9vayBmb3IgdGhlIGZpcnN0IG9uZVxuICAgIC8vIHdoaWNoIHRoYXQgaGFzIGJlZW4gcmVnaXN0ZXJlZC4gV2hlbiBkYXRhIGRvZXMgbm90IGV4aXN0IGZvciBhIGxvY2FsZSwgd2VcbiAgICAvLyB0cmF2ZXJzZSBpdHMgYW5jZXN0b3JzIHRvIGZpbmQgc29tZXRoaW5nIHRoYXQncyBiZWVuIHJlZ2lzdGVyZWQgd2l0aGluXG4gICAgLy8gaXRzIGhpZXJhcmNoeSBvZiBsb2NhbGVzLiBTaW5jZSB3ZSBsYWNrIHRoZSBwcm9wZXIgYHBhcmVudExvY2FsZWAgZGF0YVxuICAgIC8vIGhlcmUsIHdlIG11c3QgdGFrZSBhIG5haXZlIGFwcHJvYWNoIHRvIHRyYXZlcnNhbC5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBsb2NhbGVzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgIGxvY2FsZVBhcnRzID0gbG9jYWxlc1tpXS50b0xvd2VyQ2FzZSgpLnNwbGl0KCctJyk7XG5cbiAgICAgICAgd2hpbGUgKGxvY2FsZVBhcnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgZGF0YSA9IGxvY2FsZURhdGFbbG9jYWxlUGFydHMuam9pbignLScpXTtcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gUmV0dXJuIHRoZSBub3JtYWxpemVkIGxvY2FsZSBzdHJpbmc7IGUuZy4sIHdlIHJldHVybiBcImVuLVVTXCIsXG4gICAgICAgICAgICAgICAgLy8gaW5zdGVhZCBvZiBcImVuLXVzXCIuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEubG9jYWxlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsb2NhbGVQYXJ0cy5wb3AoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlID0gbG9jYWxlcy5wb3AoKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdObyBsb2NhbGUgZGF0YSBoYXMgYmVlbiBhZGRlZCB0byBJbnRsTWVzc2FnZUZvcm1hdCBmb3I6ICcgK1xuICAgICAgICBsb2NhbGVzLmpvaW4oJywgJykgKyAnLCBvciB0aGUgZGVmYXVsdCBsb2NhbGU6ICcgKyBkZWZhdWx0TG9jYWxlXG4gICAgKTtcbn07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvcmUuanMubWFwIiwiLy8gR0VORVJBVEVEIEZJTEVcblwidXNlIHN0cmljdFwiO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB7XCJsb2NhbGVcIjpcImVuXCIsXCJwbHVyYWxSdWxlRnVuY3Rpb25cIjpmdW5jdGlvbiAobixvcmQpe3ZhciBzPVN0cmluZyhuKS5zcGxpdChcIi5cIiksdjA9IXNbMV0sdDA9TnVtYmVyKHNbMF0pPT1uLG4xMD10MCYmc1swXS5zbGljZSgtMSksbjEwMD10MCYmc1swXS5zbGljZSgtMik7aWYob3JkKXJldHVybiBuMTA9PTEmJm4xMDAhPTExP1wib25lXCI6bjEwPT0yJiZuMTAwIT0xMj9cInR3b1wiOm4xMD09MyYmbjEwMCE9MTM/XCJmZXdcIjpcIm90aGVyXCI7cmV0dXJuIG49PTEmJnYwP1wib25lXCI6XCJvdGhlclwifX07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVuLmpzLm1hcCIsIi8qXG5Db3B5cmlnaHQgKGMpIDIwMTQsIFlhaG9vISBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5Db3B5cmlnaHRzIGxpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIExpY2Vuc2UuXG5TZWUgdGhlIGFjY29tcGFueWluZyBMSUNFTlNFIGZpbGUgZm9yIHRlcm1zLlxuKi9cblxuLyoganNsaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcbnZhciBzcmMkdXRpbHMkJCA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xuXG4vLyBQdXJwb3NlbHkgdXNpbmcgdGhlIHNhbWUgaW1wbGVtZW50YXRpb24gYXMgdGhlIEludGwuanMgYEludGxgIHBvbHlmaWxsLlxuLy8gQ29weXJpZ2h0IDIwMTMgQW5keSBFYXJuc2hhdywgTUlUIExpY2Vuc2VcblxudmFyIHJlYWxEZWZpbmVQcm9wID0gKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkgeyByZXR1cm4gISFPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge30pOyB9XG4gICAgY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9XG59KSgpO1xuXG52YXIgZXMzID0gIXJlYWxEZWZpbmVQcm9wICYmICFPYmplY3QucHJvdG90eXBlLl9fZGVmaW5lR2V0dGVyX187XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IHJlYWxEZWZpbmVQcm9wID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDpcbiAgICAgICAgZnVuY3Rpb24gKG9iaiwgbmFtZSwgZGVzYykge1xuXG4gICAgaWYgKCdnZXQnIGluIGRlc2MgJiYgb2JqLl9fZGVmaW5lR2V0dGVyX18pIHtcbiAgICAgICAgb2JqLl9fZGVmaW5lR2V0dGVyX18obmFtZSwgZGVzYy5nZXQpO1xuICAgIH0gZWxzZSBpZiAoIXNyYyR1dGlscyQkLmhvcC5jYWxsKG9iaiwgbmFtZSkgfHwgJ3ZhbHVlJyBpbiBkZXNjKSB7XG4gICAgICAgIG9ialtuYW1lXSA9IGRlc2MudmFsdWU7XG4gICAgfVxufTtcblxudmFyIG9iakNyZWF0ZSA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gKHByb3RvLCBwcm9wcykge1xuICAgIHZhciBvYmosIGs7XG5cbiAgICBmdW5jdGlvbiBGKCkge31cbiAgICBGLnByb3RvdHlwZSA9IHByb3RvO1xuICAgIG9iaiA9IG5ldyBGKCk7XG5cbiAgICBmb3IgKGsgaW4gcHJvcHMpIHtcbiAgICAgICAgaWYgKHNyYyR1dGlscyQkLmhvcC5jYWxsKHByb3BzLCBrKSkge1xuICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkob2JqLCBrLCBwcm9wc1trXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xufTtcbmV4cG9ydHMuZGVmaW5lUHJvcGVydHkgPSBkZWZpbmVQcm9wZXJ0eSwgZXhwb3J0cy5vYmpDcmVhdGUgPSBvYmpDcmVhdGU7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVzNS5qcy5tYXAiLCIvKiBqc2xpbnQgZXNuZXh0OiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xudmFyIHNyYyRjb3JlJCQgPSByZXF1aXJlKFwiLi9jb3JlXCIpLCBzcmMkZW4kJCA9IHJlcXVpcmUoXCIuL2VuXCIpO1xuXG5zcmMkY29yZSQkW1wiZGVmYXVsdFwiXS5fX2FkZExvY2FsZURhdGEoc3JjJGVuJCRbXCJkZWZhdWx0XCJdKTtcbnNyYyRjb3JlJCRbXCJkZWZhdWx0XCJdLmRlZmF1bHRMb2NhbGUgPSAnZW4nO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHNyYyRjb3JlJCRbXCJkZWZhdWx0XCJdO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYWluLmpzLm1hcCIsIi8qXG5Db3B5cmlnaHQgKGMpIDIwMTQsIFlhaG9vISBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5Db3B5cmlnaHRzIGxpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIExpY2Vuc2UuXG5TZWUgdGhlIGFjY29tcGFueWluZyBMSUNFTlNFIGZpbGUgZm9yIHRlcm1zLlxuKi9cblxuLyoganNsaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO1xudmFyIGhvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmZ1bmN0aW9uIGV4dGVuZChvYmopIHtcbiAgICB2YXIgc291cmNlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSksXG4gICAgICAgIGksIGxlbiwgc291cmNlLCBrZXk7XG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBzb3VyY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZXNbaV07XG4gICAgICAgIGlmICghc291cmNlKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgICAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoaG9wLmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgb2JqW2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvYmo7XG59XG5leHBvcnRzLmhvcCA9IGhvcDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXRpbHMuanMubWFwIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9wYXJzZXInKVsnZGVmYXVsdCddO1xuZXhwb3J0c1snZGVmYXVsdCddID0gZXhwb3J0cztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IChmdW5jdGlvbigpIHtcbiAgLypcbiAgICogR2VuZXJhdGVkIGJ5IFBFRy5qcyAwLjguMC5cbiAgICpcbiAgICogaHR0cDovL3BlZ2pzLm1hamRhLmN6L1xuICAgKi9cblxuICBmdW5jdGlvbiBwZWckc3ViY2xhc3MoY2hpbGQsIHBhcmVudCkge1xuICAgIGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfVxuICAgIGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcbiAgICBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpO1xuICB9XG5cbiAgZnVuY3Rpb24gU3ludGF4RXJyb3IobWVzc2FnZSwgZXhwZWN0ZWQsIGZvdW5kLCBvZmZzZXQsIGxpbmUsIGNvbHVtbikge1xuICAgIHRoaXMubWVzc2FnZSAgPSBtZXNzYWdlO1xuICAgIHRoaXMuZXhwZWN0ZWQgPSBleHBlY3RlZDtcbiAgICB0aGlzLmZvdW5kICAgID0gZm91bmQ7XG4gICAgdGhpcy5vZmZzZXQgICA9IG9mZnNldDtcbiAgICB0aGlzLmxpbmUgICAgID0gbGluZTtcbiAgICB0aGlzLmNvbHVtbiAgID0gY29sdW1uO1xuXG4gICAgdGhpcy5uYW1lICAgICA9IFwiU3ludGF4RXJyb3JcIjtcbiAgfVxuXG4gIHBlZyRzdWJjbGFzcyhTeW50YXhFcnJvciwgRXJyb3IpO1xuXG4gIGZ1bmN0aW9uIHBhcnNlKGlucHV0KSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHt9LFxuXG4gICAgICAgIHBlZyRGQUlMRUQgPSB7fSxcblxuICAgICAgICBwZWckc3RhcnRSdWxlRnVuY3Rpb25zID0geyBzdGFydDogcGVnJHBhcnNlc3RhcnQgfSxcbiAgICAgICAgcGVnJHN0YXJ0UnVsZUZ1bmN0aW9uICA9IHBlZyRwYXJzZXN0YXJ0LFxuXG4gICAgICAgIHBlZyRjMCA9IFtdLFxuICAgICAgICBwZWckYzEgPSBmdW5jdGlvbihlbGVtZW50cykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgICAgOiAnbWVzc2FnZUZvcm1hdFBhdHRlcm4nLFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50czogZWxlbWVudHNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgcGVnJGMyID0gcGVnJEZBSUxFRCxcbiAgICAgICAgcGVnJGMzID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgICAgICAgIHZhciBzdHJpbmcgPSAnJyxcbiAgICAgICAgICAgICAgICAgICAgaSwgaiwgb3V0ZXJMZW4sIGlubmVyLCBpbm5lckxlbjtcblxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIG91dGVyTGVuID0gdGV4dC5sZW5ndGg7IGkgPCBvdXRlckxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlubmVyID0gdGV4dFtpXTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwLCBpbm5lckxlbiA9IGlubmVyLmxlbmd0aDsgaiA8IGlubmVyTGVuOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSBpbm5lcltqXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgICAgICAgICB9LFxuICAgICAgICBwZWckYzQgPSBmdW5jdGlvbihtZXNzYWdlVGV4dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgOiAnbWVzc2FnZVRleHRFbGVtZW50JyxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IG1lc3NhZ2VUZXh0XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIHBlZyRjNSA9IC9eW14gXFx0XFxuXFxyLC4rPXt9I10vLFxuICAgICAgICBwZWckYzYgPSB7IHR5cGU6IFwiY2xhc3NcIiwgdmFsdWU6IFwiW14gXFxcXHRcXFxcblxcXFxyLC4rPXt9I11cIiwgZGVzY3JpcHRpb246IFwiW14gXFxcXHRcXFxcblxcXFxyLC4rPXt9I11cIiB9LFxuICAgICAgICBwZWckYzcgPSBcIntcIixcbiAgICAgICAgcGVnJGM4ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwie1wiLCBkZXNjcmlwdGlvbjogXCJcXFwie1xcXCJcIiB9LFxuICAgICAgICBwZWckYzkgPSBudWxsLFxuICAgICAgICBwZWckYzEwID0gXCIsXCIsXG4gICAgICAgIHBlZyRjMTEgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCIsXCIsIGRlc2NyaXB0aW9uOiBcIlxcXCIsXFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMTIgPSBcIn1cIixcbiAgICAgICAgcGVnJGMxMyA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcIn1cIiwgZGVzY3JpcHRpb246IFwiXFxcIn1cXFwiXCIgfSxcbiAgICAgICAgcGVnJGMxNCA9IGZ1bmN0aW9uKGlkLCBmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlICA6ICdhcmd1bWVudEVsZW1lbnQnLFxuICAgICAgICAgICAgICAgICAgICBpZCAgICA6IGlkLFxuICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IGZvcm1hdCAmJiBmb3JtYXRbMl1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgcGVnJGMxNSA9IFwibnVtYmVyXCIsXG4gICAgICAgIHBlZyRjMTYgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJudW1iZXJcIiwgZGVzY3JpcHRpb246IFwiXFxcIm51bWJlclxcXCJcIiB9LFxuICAgICAgICBwZWckYzE3ID0gXCJkYXRlXCIsXG4gICAgICAgIHBlZyRjMTggPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJkYXRlXCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJkYXRlXFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMTkgPSBcInRpbWVcIixcbiAgICAgICAgcGVnJGMyMCA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcInRpbWVcIiwgZGVzY3JpcHRpb246IFwiXFxcInRpbWVcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMyMSA9IGZ1bmN0aW9uKHR5cGUsIHN0eWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA6IHR5cGUgKyAnRm9ybWF0JyxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHN0eWxlICYmIHN0eWxlWzJdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIHBlZyRjMjIgPSBcInBsdXJhbFwiLFxuICAgICAgICBwZWckYzIzID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwicGx1cmFsXCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJwbHVyYWxcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMyNCA9IGZ1bmN0aW9uKHBsdXJhbFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSAgIDogcGx1cmFsU3R5bGUudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgb3JkaW5hbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldCA6IHBsdXJhbFN0eWxlLm9mZnNldCB8fCAwLFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBwbHVyYWxTdHlsZS5vcHRpb25zXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIHBlZyRjMjUgPSBcInNlbGVjdG9yZGluYWxcIixcbiAgICAgICAgcGVnJGMyNiA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcInNlbGVjdG9yZGluYWxcIiwgZGVzY3JpcHRpb246IFwiXFxcInNlbGVjdG9yZGluYWxcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMyNyA9IGZ1bmN0aW9uKHBsdXJhbFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSAgIDogcGx1cmFsU3R5bGUudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgb3JkaW5hbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0IDogcGx1cmFsU3R5bGUub2Zmc2V0IHx8IDAsXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHBsdXJhbFN0eWxlLm9wdGlvbnNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICBwZWckYzI4ID0gXCJzZWxlY3RcIixcbiAgICAgICAgcGVnJGMyOSA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcInNlbGVjdFwiLCBkZXNjcmlwdGlvbjogXCJcXFwic2VsZWN0XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMzAgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSAgIDogJ3NlbGVjdEZvcm1hdCcsXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgcGVnJGMzMSA9IFwiPVwiLFxuICAgICAgICBwZWckYzMyID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiPVwiLCBkZXNjcmlwdGlvbjogXCJcXFwiPVxcXCJcIiB9LFxuICAgICAgICBwZWckYzMzID0gZnVuY3Rpb24oc2VsZWN0b3IsIHBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlICAgIDogJ29wdGlvbmFsRm9ybWF0UGF0dGVybicsXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBzZWxlY3RvcixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgICA6IHBhdHRlcm5cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgcGVnJGMzNCA9IFwib2Zmc2V0OlwiLFxuICAgICAgICBwZWckYzM1ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwib2Zmc2V0OlwiLCBkZXNjcmlwdGlvbjogXCJcXFwib2Zmc2V0OlxcXCJcIiB9LFxuICAgICAgICBwZWckYzM2ID0gZnVuY3Rpb24obnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bWJlcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIHBlZyRjMzcgPSBmdW5jdGlvbihvZmZzZXQsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlICAgOiAncGx1cmFsRm9ybWF0JyxcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0IDogb2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIHBlZyRjMzggPSB7IHR5cGU6IFwib3RoZXJcIiwgZGVzY3JpcHRpb246IFwid2hpdGVzcGFjZVwiIH0sXG4gICAgICAgIHBlZyRjMzkgPSAvXlsgXFx0XFxuXFxyXS8sXG4gICAgICAgIHBlZyRjNDAgPSB7IHR5cGU6IFwiY2xhc3NcIiwgdmFsdWU6IFwiWyBcXFxcdFxcXFxuXFxcXHJdXCIsIGRlc2NyaXB0aW9uOiBcIlsgXFxcXHRcXFxcblxcXFxyXVwiIH0sXG4gICAgICAgIHBlZyRjNDEgPSB7IHR5cGU6IFwib3RoZXJcIiwgZGVzY3JpcHRpb246IFwib3B0aW9uYWxXaGl0ZXNwYWNlXCIgfSxcbiAgICAgICAgcGVnJGM0MiA9IC9eWzAtOV0vLFxuICAgICAgICBwZWckYzQzID0geyB0eXBlOiBcImNsYXNzXCIsIHZhbHVlOiBcIlswLTldXCIsIGRlc2NyaXB0aW9uOiBcIlswLTldXCIgfSxcbiAgICAgICAgcGVnJGM0NCA9IC9eWzAtOWEtZl0vaSxcbiAgICAgICAgcGVnJGM0NSA9IHsgdHlwZTogXCJjbGFzc1wiLCB2YWx1ZTogXCJbMC05YS1mXWlcIiwgZGVzY3JpcHRpb246IFwiWzAtOWEtZl1pXCIgfSxcbiAgICAgICAgcGVnJGM0NiA9IFwiMFwiLFxuICAgICAgICBwZWckYzQ3ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiMFwiLCBkZXNjcmlwdGlvbjogXCJcXFwiMFxcXCJcIiB9LFxuICAgICAgICBwZWckYzQ4ID0gL15bMS05XS8sXG4gICAgICAgIHBlZyRjNDkgPSB7IHR5cGU6IFwiY2xhc3NcIiwgdmFsdWU6IFwiWzEtOV1cIiwgZGVzY3JpcHRpb246IFwiWzEtOV1cIiB9LFxuICAgICAgICBwZWckYzUwID0gZnVuY3Rpb24oZGlnaXRzKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoZGlnaXRzLCAxMCk7XG4gICAgICAgIH0sXG4gICAgICAgIHBlZyRjNTEgPSAvXltee31cXFxcXFwwLVxceDFGfyBcXHRcXG5cXHJdLyxcbiAgICAgICAgcGVnJGM1MiA9IHsgdHlwZTogXCJjbGFzc1wiLCB2YWx1ZTogXCJbXnt9XFxcXFxcXFxcXFxcMC1cXFxceDFGfyBcXFxcdFxcXFxuXFxcXHJdXCIsIGRlc2NyaXB0aW9uOiBcIltee31cXFxcXFxcXFxcXFwwLVxcXFx4MUZ/IFxcXFx0XFxcXG5cXFxccl1cIiB9LFxuICAgICAgICBwZWckYzUzID0gXCJcXFxcXFxcXFwiLFxuICAgICAgICBwZWckYzU0ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiXFxcXFxcXFxcIiwgZGVzY3JpcHRpb246IFwiXFxcIlxcXFxcXFxcXFxcXFxcXFxcXFwiXCIgfSxcbiAgICAgICAgcGVnJGM1NSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gJ1xcXFwnOyB9LFxuICAgICAgICBwZWckYzU2ID0gXCJcXFxcI1wiLFxuICAgICAgICBwZWckYzU3ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiXFxcXCNcIiwgZGVzY3JpcHRpb246IFwiXFxcIlxcXFxcXFxcI1xcXCJcIiB9LFxuICAgICAgICBwZWckYzU4ID0gZnVuY3Rpb24oKSB7IHJldHVybiAnXFxcXCMnOyB9LFxuICAgICAgICBwZWckYzU5ID0gXCJcXFxce1wiLFxuICAgICAgICBwZWckYzYwID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiXFxcXHtcIiwgZGVzY3JpcHRpb246IFwiXFxcIlxcXFxcXFxce1xcXCJcIiB9LFxuICAgICAgICBwZWckYzYxID0gZnVuY3Rpb24oKSB7IHJldHVybiAnXFx1MDA3Qic7IH0sXG4gICAgICAgIHBlZyRjNjIgPSBcIlxcXFx9XCIsXG4gICAgICAgIHBlZyRjNjMgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJcXFxcfVwiLCBkZXNjcmlwdGlvbjogXCJcXFwiXFxcXFxcXFx9XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjNjQgPSBmdW5jdGlvbigpIHsgcmV0dXJuICdcXHUwMDdEJzsgfSxcbiAgICAgICAgcGVnJGM2NSA9IFwiXFxcXHVcIixcbiAgICAgICAgcGVnJGM2NiA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcIlxcXFx1XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJcXFxcXFxcXHVcXFwiXCIgfSxcbiAgICAgICAgcGVnJGM2NyA9IGZ1bmN0aW9uKGRpZ2l0cykge1xuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KGRpZ2l0cywgMTYpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIHBlZyRjNjggPSBmdW5jdGlvbihjaGFycykgeyByZXR1cm4gY2hhcnMuam9pbignJyk7IH0sXG5cbiAgICAgICAgcGVnJGN1cnJQb3MgICAgICAgICAgPSAwLFxuICAgICAgICBwZWckcmVwb3J0ZWRQb3MgICAgICA9IDAsXG4gICAgICAgIHBlZyRjYWNoZWRQb3MgICAgICAgID0gMCxcbiAgICAgICAgcGVnJGNhY2hlZFBvc0RldGFpbHMgPSB7IGxpbmU6IDEsIGNvbHVtbjogMSwgc2VlbkNSOiBmYWxzZSB9LFxuICAgICAgICBwZWckbWF4RmFpbFBvcyAgICAgICA9IDAsXG4gICAgICAgIHBlZyRtYXhGYWlsRXhwZWN0ZWQgID0gW10sXG4gICAgICAgIHBlZyRzaWxlbnRGYWlscyAgICAgID0gMCxcblxuICAgICAgICBwZWckcmVzdWx0O1xuXG4gICAgaWYgKFwic3RhcnRSdWxlXCIgaW4gb3B0aW9ucykge1xuICAgICAgaWYgKCEob3B0aW9ucy5zdGFydFJ1bGUgaW4gcGVnJHN0YXJ0UnVsZUZ1bmN0aW9ucykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3Qgc3RhcnQgcGFyc2luZyBmcm9tIHJ1bGUgXFxcIlwiICsgb3B0aW9ucy5zdGFydFJ1bGUgKyBcIlxcXCIuXCIpO1xuICAgICAgfVxuXG4gICAgICBwZWckc3RhcnRSdWxlRnVuY3Rpb24gPSBwZWckc3RhcnRSdWxlRnVuY3Rpb25zW29wdGlvbnMuc3RhcnRSdWxlXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0ZXh0KCkge1xuICAgICAgcmV0dXJuIGlucHV0LnN1YnN0cmluZyhwZWckcmVwb3J0ZWRQb3MsIHBlZyRjdXJyUG9zKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvZmZzZXQoKSB7XG4gICAgICByZXR1cm4gcGVnJHJlcG9ydGVkUG9zO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpbmUoKSB7XG4gICAgICByZXR1cm4gcGVnJGNvbXB1dGVQb3NEZXRhaWxzKHBlZyRyZXBvcnRlZFBvcykubGluZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb2x1bW4oKSB7XG4gICAgICByZXR1cm4gcGVnJGNvbXB1dGVQb3NEZXRhaWxzKHBlZyRyZXBvcnRlZFBvcykuY29sdW1uO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4cGVjdGVkKGRlc2NyaXB0aW9uKSB7XG4gICAgICB0aHJvdyBwZWckYnVpbGRFeGNlcHRpb24oXG4gICAgICAgIG51bGwsXG4gICAgICAgIFt7IHR5cGU6IFwib3RoZXJcIiwgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uIH1dLFxuICAgICAgICBwZWckcmVwb3J0ZWRQb3NcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXJyb3IobWVzc2FnZSkge1xuICAgICAgdGhyb3cgcGVnJGJ1aWxkRXhjZXB0aW9uKG1lc3NhZ2UsIG51bGwsIHBlZyRyZXBvcnRlZFBvcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJGNvbXB1dGVQb3NEZXRhaWxzKHBvcykge1xuICAgICAgZnVuY3Rpb24gYWR2YW5jZShkZXRhaWxzLCBzdGFydFBvcywgZW5kUG9zKSB7XG4gICAgICAgIHZhciBwLCBjaDtcblxuICAgICAgICBmb3IgKHAgPSBzdGFydFBvczsgcCA8IGVuZFBvczsgcCsrKSB7XG4gICAgICAgICAgY2ggPSBpbnB1dC5jaGFyQXQocCk7XG4gICAgICAgICAgaWYgKGNoID09PSBcIlxcblwiKSB7XG4gICAgICAgICAgICBpZiAoIWRldGFpbHMuc2VlbkNSKSB7IGRldGFpbHMubGluZSsrOyB9XG4gICAgICAgICAgICBkZXRhaWxzLmNvbHVtbiA9IDE7XG4gICAgICAgICAgICBkZXRhaWxzLnNlZW5DUiA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT09IFwiXFxyXCIgfHwgY2ggPT09IFwiXFx1MjAyOFwiIHx8IGNoID09PSBcIlxcdTIwMjlcIikge1xuICAgICAgICAgICAgZGV0YWlscy5saW5lKys7XG4gICAgICAgICAgICBkZXRhaWxzLmNvbHVtbiA9IDE7XG4gICAgICAgICAgICBkZXRhaWxzLnNlZW5DUiA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRldGFpbHMuY29sdW1uKys7XG4gICAgICAgICAgICBkZXRhaWxzLnNlZW5DUiA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocGVnJGNhY2hlZFBvcyAhPT0gcG9zKSB7XG4gICAgICAgIGlmIChwZWckY2FjaGVkUG9zID4gcG9zKSB7XG4gICAgICAgICAgcGVnJGNhY2hlZFBvcyA9IDA7XG4gICAgICAgICAgcGVnJGNhY2hlZFBvc0RldGFpbHMgPSB7IGxpbmU6IDEsIGNvbHVtbjogMSwgc2VlbkNSOiBmYWxzZSB9O1xuICAgICAgICB9XG4gICAgICAgIGFkdmFuY2UocGVnJGNhY2hlZFBvc0RldGFpbHMsIHBlZyRjYWNoZWRQb3MsIHBvcyk7XG4gICAgICAgIHBlZyRjYWNoZWRQb3MgPSBwb3M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwZWckY2FjaGVkUG9zRGV0YWlscztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckZmFpbChleHBlY3RlZCkge1xuICAgICAgaWYgKHBlZyRjdXJyUG9zIDwgcGVnJG1heEZhaWxQb3MpIHsgcmV0dXJuOyB9XG5cbiAgICAgIGlmIChwZWckY3VyclBvcyA+IHBlZyRtYXhGYWlsUG9zKSB7XG4gICAgICAgIHBlZyRtYXhGYWlsUG9zID0gcGVnJGN1cnJQb3M7XG4gICAgICAgIHBlZyRtYXhGYWlsRXhwZWN0ZWQgPSBbXTtcbiAgICAgIH1cblxuICAgICAgcGVnJG1heEZhaWxFeHBlY3RlZC5wdXNoKGV4cGVjdGVkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckYnVpbGRFeGNlcHRpb24obWVzc2FnZSwgZXhwZWN0ZWQsIHBvcykge1xuICAgICAgZnVuY3Rpb24gY2xlYW51cEV4cGVjdGVkKGV4cGVjdGVkKSB7XG4gICAgICAgIHZhciBpID0gMTtcblxuICAgICAgICBleHBlY3RlZC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICBpZiAoYS5kZXNjcmlwdGlvbiA8IGIuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGEuZGVzY3JpcHRpb24gPiBiLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB3aGlsZSAoaSA8IGV4cGVjdGVkLmxlbmd0aCkge1xuICAgICAgICAgIGlmIChleHBlY3RlZFtpIC0gMV0gPT09IGV4cGVjdGVkW2ldKSB7XG4gICAgICAgICAgICBleHBlY3RlZC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYnVpbGRNZXNzYWdlKGV4cGVjdGVkLCBmb3VuZCkge1xuICAgICAgICBmdW5jdGlvbiBzdHJpbmdFc2NhcGUocykge1xuICAgICAgICAgIGZ1bmN0aW9uIGhleChjaCkgeyByZXR1cm4gY2guY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTsgfVxuXG4gICAgICAgICAgcmV0dXJuIHNcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcL2csICAgJ1xcXFxcXFxcJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCAgICAnXFxcXFwiJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHgwOC9nLCAnXFxcXGInKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcdC9nLCAgICdcXFxcdCcpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICAgJ1xcXFxuJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXGYvZywgICAnXFxcXGYnKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcci9nLCAgICdcXFxccicpXG4gICAgICAgICAgICAucmVwbGFjZSgvW1xceDAwLVxceDA3XFx4MEJcXHgwRVxceDBGXS9nLCBmdW5jdGlvbihjaCkgeyByZXR1cm4gJ1xcXFx4MCcgKyBoZXgoY2gpOyB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoL1tcXHgxMC1cXHgxRlxceDgwLVxceEZGXS9nLCAgICBmdW5jdGlvbihjaCkgeyByZXR1cm4gJ1xcXFx4JyAgKyBoZXgoY2gpOyB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoL1tcXHUwMTgwLVxcdTBGRkZdL2csICAgICAgICAgZnVuY3Rpb24oY2gpIHsgcmV0dXJuICdcXFxcdTAnICsgaGV4KGNoKTsgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC9bXFx1MTA4MC1cXHVGRkZGXS9nLCAgICAgICAgIGZ1bmN0aW9uKGNoKSB7IHJldHVybiAnXFxcXHUnICArIGhleChjaCk7IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGV4cGVjdGVkRGVzY3MgPSBuZXcgQXJyYXkoZXhwZWN0ZWQubGVuZ3RoKSxcbiAgICAgICAgICAgIGV4cGVjdGVkRGVzYywgZm91bmREZXNjLCBpO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBleHBlY3RlZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGV4cGVjdGVkRGVzY3NbaV0gPSBleHBlY3RlZFtpXS5kZXNjcmlwdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cGVjdGVkRGVzYyA9IGV4cGVjdGVkLmxlbmd0aCA+IDFcbiAgICAgICAgICA/IGV4cGVjdGVkRGVzY3Muc2xpY2UoMCwgLTEpLmpvaW4oXCIsIFwiKVxuICAgICAgICAgICAgICArIFwiIG9yIFwiXG4gICAgICAgICAgICAgICsgZXhwZWN0ZWREZXNjc1tleHBlY3RlZC5sZW5ndGggLSAxXVxuICAgICAgICAgIDogZXhwZWN0ZWREZXNjc1swXTtcblxuICAgICAgICBmb3VuZERlc2MgPSBmb3VuZCA/IFwiXFxcIlwiICsgc3RyaW5nRXNjYXBlKGZvdW5kKSArIFwiXFxcIlwiIDogXCJlbmQgb2YgaW5wdXRcIjtcblxuICAgICAgICByZXR1cm4gXCJFeHBlY3RlZCBcIiArIGV4cGVjdGVkRGVzYyArIFwiIGJ1dCBcIiArIGZvdW5kRGVzYyArIFwiIGZvdW5kLlwiO1xuICAgICAgfVxuXG4gICAgICB2YXIgcG9zRGV0YWlscyA9IHBlZyRjb21wdXRlUG9zRGV0YWlscyhwb3MpLFxuICAgICAgICAgIGZvdW5kICAgICAgPSBwb3MgPCBpbnB1dC5sZW5ndGggPyBpbnB1dC5jaGFyQXQocG9zKSA6IG51bGw7XG5cbiAgICAgIGlmIChleHBlY3RlZCAhPT0gbnVsbCkge1xuICAgICAgICBjbGVhbnVwRXhwZWN0ZWQoZXhwZWN0ZWQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFN5bnRheEVycm9yKFxuICAgICAgICBtZXNzYWdlICE9PSBudWxsID8gbWVzc2FnZSA6IGJ1aWxkTWVzc2FnZShleHBlY3RlZCwgZm91bmQpLFxuICAgICAgICBleHBlY3RlZCxcbiAgICAgICAgZm91bmQsXG4gICAgICAgIHBvcyxcbiAgICAgICAgcG9zRGV0YWlscy5saW5lLFxuICAgICAgICBwb3NEZXRhaWxzLmNvbHVtblxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VzdGFydCgpIHtcbiAgICAgIHZhciBzMDtcblxuICAgICAgczAgPSBwZWckcGFyc2VtZXNzYWdlRm9ybWF0UGF0dGVybigpO1xuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlbWVzc2FnZUZvcm1hdFBhdHRlcm4oKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMjtcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIHMxID0gW107XG4gICAgICBzMiA9IHBlZyRwYXJzZW1lc3NhZ2VGb3JtYXRFbGVtZW50KCk7XG4gICAgICB3aGlsZSAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczEucHVzaChzMik7XG4gICAgICAgIHMyID0gcGVnJHBhcnNlbWVzc2FnZUZvcm1hdEVsZW1lbnQoKTtcbiAgICAgIH1cbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBwZWckcmVwb3J0ZWRQb3MgPSBzMDtcbiAgICAgICAgczEgPSBwZWckYzEoczEpO1xuICAgICAgfVxuICAgICAgczAgPSBzMTtcblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZW1lc3NhZ2VGb3JtYXRFbGVtZW50KCkge1xuICAgICAgdmFyIHMwO1xuXG4gICAgICBzMCA9IHBlZyRwYXJzZW1lc3NhZ2VUZXh0RWxlbWVudCgpO1xuICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMwID0gcGVnJHBhcnNlYXJndW1lbnRFbGVtZW50KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VtZXNzYWdlVGV4dCgpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyLCBzMywgczQsIHM1O1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgczEgPSBbXTtcbiAgICAgIHMyID0gcGVnJGN1cnJQb3M7XG4gICAgICBzMyA9IHBlZyRwYXJzZV8oKTtcbiAgICAgIGlmIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzNCA9IHBlZyRwYXJzZWNoYXJzKCk7XG4gICAgICAgIGlmIChzNCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHM1ID0gcGVnJHBhcnNlXygpO1xuICAgICAgICAgIGlmIChzNSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgczMgPSBbczMsIHM0LCBzNV07XG4gICAgICAgICAgICBzMiA9IHMzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZWckY3VyclBvcyA9IHMyO1xuICAgICAgICAgICAgczIgPSBwZWckYzI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczI7XG4gICAgICAgICAgczIgPSBwZWckYzI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZyRjdXJyUG9zID0gczI7XG4gICAgICAgIHMyID0gcGVnJGMyO1xuICAgICAgfVxuICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHdoaWxlIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMxLnB1c2goczIpO1xuICAgICAgICAgIHMyID0gcGVnJGN1cnJQb3M7XG4gICAgICAgICAgczMgPSBwZWckcGFyc2VfKCk7XG4gICAgICAgICAgaWYgKHMzICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzNCA9IHBlZyRwYXJzZWNoYXJzKCk7XG4gICAgICAgICAgICBpZiAoczQgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgczUgPSBwZWckcGFyc2VfKCk7XG4gICAgICAgICAgICAgIGlmIChzNSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgIHMzID0gW3MzLCBzNCwgczVdO1xuICAgICAgICAgICAgICAgIHMyID0gczM7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMjtcbiAgICAgICAgICAgICAgICBzMiA9IHBlZyRjMjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMjtcbiAgICAgICAgICAgICAgczIgPSBwZWckYzI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczI7XG4gICAgICAgICAgICBzMiA9IHBlZyRjMjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMxID0gcGVnJGMyO1xuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICBzMSA9IHBlZyRjMyhzMSk7XG4gICAgICB9XG4gICAgICBzMCA9IHMxO1xuICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICAgIHMxID0gcGVnJHBhcnNld3MoKTtcbiAgICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczEgPSBpbnB1dC5zdWJzdHJpbmcoczAsIHBlZyRjdXJyUG9zKTtcbiAgICAgICAgfVxuICAgICAgICBzMCA9IHMxO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlbWVzc2FnZVRleHRFbGVtZW50KCkge1xuICAgICAgdmFyIHMwLCBzMTtcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIHMxID0gcGVnJHBhcnNlbWVzc2FnZVRleHQoKTtcbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBwZWckcmVwb3J0ZWRQb3MgPSBzMDtcbiAgICAgICAgczEgPSBwZWckYzQoczEpO1xuICAgICAgfVxuICAgICAgczAgPSBzMTtcblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZWFyZ3VtZW50KCkge1xuICAgICAgdmFyIHMwLCBzMSwgczI7XG5cbiAgICAgIHMwID0gcGVnJHBhcnNlbnVtYmVyKCk7XG4gICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgICAgczEgPSBbXTtcbiAgICAgICAgaWYgKHBlZyRjNS50ZXN0KGlucHV0LmNoYXJBdChwZWckY3VyclBvcykpKSB7XG4gICAgICAgICAgczIgPSBpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpO1xuICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgczIgPSBwZWckRkFJTEVEO1xuICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM2KTsgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHdoaWxlIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgczEucHVzaChzMik7XG4gICAgICAgICAgICBpZiAocGVnJGM1LnRlc3QoaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKSkpIHtcbiAgICAgICAgICAgICAgczIgPSBpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpO1xuICAgICAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgczIgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNik7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgczEgPSBwZWckYzI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczEgPSBpbnB1dC5zdWJzdHJpbmcoczAsIHBlZyRjdXJyUG9zKTtcbiAgICAgICAgfVxuICAgICAgICBzMCA9IHMxO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlYXJndW1lbnRFbGVtZW50KCkge1xuICAgICAgdmFyIHMwLCBzMSwgczIsIHMzLCBzNCwgczUsIHM2LCBzNywgczg7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwZWckY3VyclBvcykgPT09IDEyMykge1xuICAgICAgICBzMSA9IHBlZyRjNztcbiAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzgpOyB9XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczIgPSBwZWckcGFyc2VfKCk7XG4gICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMzID0gcGVnJHBhcnNlYXJndW1lbnQoKTtcbiAgICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHM0ID0gcGVnJHBhcnNlXygpO1xuICAgICAgICAgICAgaWYgKHM0ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgIHM1ID0gcGVnJGN1cnJQb3M7XG4gICAgICAgICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBlZyRjdXJyUG9zKSA9PT0gNDQpIHtcbiAgICAgICAgICAgICAgICBzNiA9IHBlZyRjMTA7XG4gICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzNiA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzExKTsgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChzNiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgIHM3ID0gcGVnJHBhcnNlXygpO1xuICAgICAgICAgICAgICAgIGlmIChzNyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgICAgczggPSBwZWckcGFyc2VlbGVtZW50Rm9ybWF0KCk7XG4gICAgICAgICAgICAgICAgICBpZiAoczggIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgczYgPSBbczYsIHM3LCBzOF07XG4gICAgICAgICAgICAgICAgICAgIHM1ID0gczY7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHM1O1xuICAgICAgICAgICAgICAgICAgICBzNSA9IHBlZyRjMjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzNTtcbiAgICAgICAgICAgICAgICAgIHM1ID0gcGVnJGMyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHM1O1xuICAgICAgICAgICAgICAgIHM1ID0gcGVnJGMyO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChzNSA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgIHM1ID0gcGVnJGM5O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChzNSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgIHM2ID0gcGVnJHBhcnNlXygpO1xuICAgICAgICAgICAgICAgIGlmIChzNiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocGVnJGN1cnJQb3MpID09PSAxMjUpIHtcbiAgICAgICAgICAgICAgICAgICAgczcgPSBwZWckYzEyO1xuICAgICAgICAgICAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgczcgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMTMpOyB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoczcgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVnJHJlcG9ydGVkUG9zID0gczA7XG4gICAgICAgICAgICAgICAgICAgIHMxID0gcGVnJGMxNChzMywgczUpO1xuICAgICAgICAgICAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VlbGVtZW50Rm9ybWF0KCkge1xuICAgICAgdmFyIHMwO1xuXG4gICAgICBzMCA9IHBlZyRwYXJzZXNpbXBsZUZvcm1hdCgpO1xuICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMwID0gcGVnJHBhcnNlcGx1cmFsRm9ybWF0KCk7XG4gICAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMwID0gcGVnJHBhcnNlc2VsZWN0T3JkaW5hbEZvcm1hdCgpO1xuICAgICAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgczAgPSBwZWckcGFyc2VzZWxlY3RGb3JtYXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZXNpbXBsZUZvcm1hdCgpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyLCBzMywgczQsIHM1LCBzNjtcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDYpID09PSBwZWckYzE1KSB7XG4gICAgICAgIHMxID0gcGVnJGMxNTtcbiAgICAgICAgcGVnJGN1cnJQb3MgKz0gNjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzE2KTsgfVxuICAgICAgfVxuICAgICAgaWYgKHMxID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDQpID09PSBwZWckYzE3KSB7XG4gICAgICAgICAgczEgPSBwZWckYzE3O1xuICAgICAgICAgIHBlZyRjdXJyUG9zICs9IDQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMxOCk7IH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoczEgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCA0KSA9PT0gcGVnJGMxOSkge1xuICAgICAgICAgICAgczEgPSBwZWckYzE5O1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgKz0gNDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzIwKTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMyID0gcGVnJHBhcnNlXygpO1xuICAgICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMyA9IHBlZyRjdXJyUG9zO1xuICAgICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBlZyRjdXJyUG9zKSA9PT0gNDQpIHtcbiAgICAgICAgICAgIHM0ID0gcGVnJGMxMDtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHM0ID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMxMSk7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHM0ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzNSA9IHBlZyRwYXJzZV8oKTtcbiAgICAgICAgICAgIGlmIChzNSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICBzNiA9IHBlZyRwYXJzZWNoYXJzKCk7XG4gICAgICAgICAgICAgIGlmIChzNiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgIHM0ID0gW3M0LCBzNSwgczZdO1xuICAgICAgICAgICAgICAgIHMzID0gczQ7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMztcbiAgICAgICAgICAgICAgICBzMyA9IHBlZyRjMjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMztcbiAgICAgICAgICAgICAgczMgPSBwZWckYzI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczM7XG4gICAgICAgICAgICBzMyA9IHBlZyRjMjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHMzID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzMyA9IHBlZyRjOTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHMzICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBwZWckcmVwb3J0ZWRQb3MgPSBzMDtcbiAgICAgICAgICAgIHMxID0gcGVnJGMyMShzMSwgczMpO1xuICAgICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZXBsdXJhbEZvcm1hdCgpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyLCBzMywgczQsIHM1O1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgNikgPT09IHBlZyRjMjIpIHtcbiAgICAgICAgczEgPSBwZWckYzIyO1xuICAgICAgICBwZWckY3VyclBvcyArPSA2O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMjMpOyB9XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczIgPSBwZWckcGFyc2VfKCk7XG4gICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBlZyRjdXJyUG9zKSA9PT0gNDQpIHtcbiAgICAgICAgICAgIHMzID0gcGVnJGMxMDtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHMzID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMxMSk7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHMzICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzNCA9IHBlZyRwYXJzZV8oKTtcbiAgICAgICAgICAgIGlmIChzNCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICBzNSA9IHBlZyRwYXJzZXBsdXJhbFN0eWxlKCk7XG4gICAgICAgICAgICAgIGlmIChzNSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICAgICAgICAgIHMxID0gcGVnJGMyNChzNSk7XG4gICAgICAgICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZXNlbGVjdE9yZGluYWxGb3JtYXQoKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMiwgczMsIHM0LCBzNTtcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDEzKSA9PT0gcGVnJGMyNSkge1xuICAgICAgICBzMSA9IHBlZyRjMjU7XG4gICAgICAgIHBlZyRjdXJyUG9zICs9IDEzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMjYpOyB9XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczIgPSBwZWckcGFyc2VfKCk7XG4gICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBlZyRjdXJyUG9zKSA9PT0gNDQpIHtcbiAgICAgICAgICAgIHMzID0gcGVnJGMxMDtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHMzID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMxMSk7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHMzICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzNCA9IHBlZyRwYXJzZV8oKTtcbiAgICAgICAgICAgIGlmIChzNCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICBzNSA9IHBlZyRwYXJzZXBsdXJhbFN0eWxlKCk7XG4gICAgICAgICAgICAgIGlmIChzNSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICAgICAgICAgIHMxID0gcGVnJGMyNyhzNSk7XG4gICAgICAgICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZXNlbGVjdEZvcm1hdCgpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyLCBzMywgczQsIHM1LCBzNjtcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDYpID09PSBwZWckYzI4KSB7XG4gICAgICAgIHMxID0gcGVnJGMyODtcbiAgICAgICAgcGVnJGN1cnJQb3MgKz0gNjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzI5KTsgfVxuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMyID0gcGVnJHBhcnNlXygpO1xuICAgICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwZWckY3VyclBvcykgPT09IDQ0KSB7XG4gICAgICAgICAgICBzMyA9IHBlZyRjMTA7XG4gICAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzMyA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMTEpOyB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgczQgPSBwZWckcGFyc2VfKCk7XG4gICAgICAgICAgICBpZiAoczQgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgczUgPSBbXTtcbiAgICAgICAgICAgICAgczYgPSBwZWckcGFyc2VvcHRpb25hbEZvcm1hdFBhdHRlcm4oKTtcbiAgICAgICAgICAgICAgaWYgKHM2ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHM2ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgICBzNS5wdXNoKHM2KTtcbiAgICAgICAgICAgICAgICAgIHM2ID0gcGVnJHBhcnNlb3B0aW9uYWxGb3JtYXRQYXR0ZXJuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHM1ID0gcGVnJGMyO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChzNSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICAgICAgICAgIHMxID0gcGVnJGMzMChzNSk7XG4gICAgICAgICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZXNlbGVjdG9yKCkge1xuICAgICAgdmFyIHMwLCBzMSwgczIsIHMzO1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgczEgPSBwZWckY3VyclBvcztcbiAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBlZyRjdXJyUG9zKSA9PT0gNjEpIHtcbiAgICAgICAgczIgPSBwZWckYzMxO1xuICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczIgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMzIpOyB9XG4gICAgICB9XG4gICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczMgPSBwZWckcGFyc2VudW1iZXIoKTtcbiAgICAgICAgaWYgKHMzICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczIgPSBbczIsIHMzXTtcbiAgICAgICAgICBzMSA9IHMyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczE7XG4gICAgICAgICAgczEgPSBwZWckYzI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZyRjdXJyUG9zID0gczE7XG4gICAgICAgIHMxID0gcGVnJGMyO1xuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMxID0gaW5wdXQuc3Vic3RyaW5nKHMwLCBwZWckY3VyclBvcyk7XG4gICAgICB9XG4gICAgICBzMCA9IHMxO1xuICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMwID0gcGVnJHBhcnNlY2hhcnMoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZW9wdGlvbmFsRm9ybWF0UGF0dGVybigpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyLCBzMywgczQsIHM1LCBzNiwgczcsIHM4O1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgczEgPSBwZWckcGFyc2VfKCk7XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczIgPSBwZWckcGFyc2VzZWxlY3RvcigpO1xuICAgICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMyA9IHBlZyRwYXJzZV8oKTtcbiAgICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBlZyRjdXJyUG9zKSA9PT0gMTIzKSB7XG4gICAgICAgICAgICAgIHM0ID0gcGVnJGM3O1xuICAgICAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgczQgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjOCk7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzNCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICBzNSA9IHBlZyRwYXJzZV8oKTtcbiAgICAgICAgICAgICAgaWYgKHM1ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgczYgPSBwZWckcGFyc2VtZXNzYWdlRm9ybWF0UGF0dGVybigpO1xuICAgICAgICAgICAgICAgIGlmIChzNiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgICAgczcgPSBwZWckcGFyc2VfKCk7XG4gICAgICAgICAgICAgICAgICBpZiAoczcgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocGVnJGN1cnJQb3MpID09PSAxMjUpIHtcbiAgICAgICAgICAgICAgICAgICAgICBzOCA9IHBlZyRjMTI7XG4gICAgICAgICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBzOCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzEzKTsgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChzOCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICAgICAgICAgICAgICAgIHMxID0gcGVnJGMzMyhzMiwgczYpO1xuICAgICAgICAgICAgICAgICAgICAgIHMwID0gczE7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VvZmZzZXQoKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMiwgczM7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCA3KSA9PT0gcGVnJGMzNCkge1xuICAgICAgICBzMSA9IHBlZyRjMzQ7XG4gICAgICAgIHBlZyRjdXJyUG9zICs9IDc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMzNSk7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMiA9IHBlZyRwYXJzZV8oKTtcbiAgICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczMgPSBwZWckcGFyc2VudW1iZXIoKTtcbiAgICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICAgICAgczEgPSBwZWckYzM2KHMzKTtcbiAgICAgICAgICAgIHMwID0gczE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VwbHVyYWxTdHlsZSgpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyLCBzMywgczQ7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBzMSA9IHBlZyRwYXJzZW9mZnNldCgpO1xuICAgICAgaWYgKHMxID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMxID0gcGVnJGM5O1xuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMyID0gcGVnJHBhcnNlXygpO1xuICAgICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMyA9IFtdO1xuICAgICAgICAgIHM0ID0gcGVnJHBhcnNlb3B0aW9uYWxGb3JtYXRQYXR0ZXJuKCk7XG4gICAgICAgICAgaWYgKHM0ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICB3aGlsZSAoczQgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgczMucHVzaChzNCk7XG4gICAgICAgICAgICAgIHM0ID0gcGVnJHBhcnNlb3B0aW9uYWxGb3JtYXRQYXR0ZXJuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHMzID0gcGVnJGMyO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICAgICAgczEgPSBwZWckYzM3KHMxLCBzMyk7XG4gICAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNld3MoKSB7XG4gICAgICB2YXIgczAsIHMxO1xuXG4gICAgICBwZWckc2lsZW50RmFpbHMrKztcbiAgICAgIHMwID0gW107XG4gICAgICBpZiAocGVnJGMzOS50ZXN0KGlucHV0LmNoYXJBdChwZWckY3VyclBvcykpKSB7XG4gICAgICAgIHMxID0gaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKTtcbiAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzQwKTsgfVxuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHdoaWxlIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMwLnB1c2goczEpO1xuICAgICAgICAgIGlmIChwZWckYzM5LnRlc3QoaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKSkpIHtcbiAgICAgICAgICAgIHMxID0gaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKTtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM0MCk7IH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgfVxuICAgICAgcGVnJHNpbGVudEZhaWxzLS07XG4gICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMzgpOyB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VfKCkge1xuICAgICAgdmFyIHMwLCBzMSwgczI7XG5cbiAgICAgIHBlZyRzaWxlbnRGYWlscysrO1xuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIHMxID0gW107XG4gICAgICBzMiA9IHBlZyRwYXJzZXdzKCk7XG4gICAgICB3aGlsZSAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczEucHVzaChzMik7XG4gICAgICAgIHMyID0gcGVnJHBhcnNld3MoKTtcbiAgICAgIH1cbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMSA9IGlucHV0LnN1YnN0cmluZyhzMCwgcGVnJGN1cnJQb3MpO1xuICAgICAgfVxuICAgICAgczAgPSBzMTtcbiAgICAgIHBlZyRzaWxlbnRGYWlscy0tO1xuICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzQxKTsgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlZGlnaXQoKSB7XG4gICAgICB2YXIgczA7XG5cbiAgICAgIGlmIChwZWckYzQyLnRlc3QoaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKSkpIHtcbiAgICAgICAgczAgPSBpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpO1xuICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczAgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNDMpOyB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VoZXhEaWdpdCgpIHtcbiAgICAgIHZhciBzMDtcblxuICAgICAgaWYgKHBlZyRjNDQudGVzdChpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpKSkge1xuICAgICAgICBzMCA9IGlucHV0LmNoYXJBdChwZWckY3VyclBvcyk7XG4gICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM0NSk7IH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZW51bWJlcigpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyLCBzMywgczQsIHM1O1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocGVnJGN1cnJQb3MpID09PSA0OCkge1xuICAgICAgICBzMSA9IHBlZyRjNDY7XG4gICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM0Nyk7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzMSA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMSA9IHBlZyRjdXJyUG9zO1xuICAgICAgICBzMiA9IHBlZyRjdXJyUG9zO1xuICAgICAgICBpZiAocGVnJGM0OC50ZXN0KGlucHV0LmNoYXJBdChwZWckY3VyclBvcykpKSB7XG4gICAgICAgICAgczMgPSBpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpO1xuICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgczMgPSBwZWckRkFJTEVEO1xuICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM0OSk7IH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzNCA9IFtdO1xuICAgICAgICAgIHM1ID0gcGVnJHBhcnNlZGlnaXQoKTtcbiAgICAgICAgICB3aGlsZSAoczUgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHM0LnB1c2goczUpO1xuICAgICAgICAgICAgczUgPSBwZWckcGFyc2VkaWdpdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoczQgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHMzID0gW3MzLCBzNF07XG4gICAgICAgICAgICBzMiA9IHMzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZWckY3VyclBvcyA9IHMyO1xuICAgICAgICAgICAgczIgPSBwZWckYzI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczI7XG4gICAgICAgICAgczIgPSBwZWckYzI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczIgPSBpbnB1dC5zdWJzdHJpbmcoczEsIHBlZyRjdXJyUG9zKTtcbiAgICAgICAgfVxuICAgICAgICBzMSA9IHMyO1xuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICBzMSA9IHBlZyRjNTAoczEpO1xuICAgICAgfVxuICAgICAgczAgPSBzMTtcblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZWNoYXIoKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMiwgczMsIHM0LCBzNSwgczYsIHM3O1xuXG4gICAgICBpZiAocGVnJGM1MS50ZXN0KGlucHV0LmNoYXJBdChwZWckY3VyclBvcykpKSB7XG4gICAgICAgIHMwID0gaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKTtcbiAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMwID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzUyKTsgfVxuICAgICAgfVxuICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDIpID09PSBwZWckYzUzKSB7XG4gICAgICAgICAgczEgPSBwZWckYzUzO1xuICAgICAgICAgIHBlZyRjdXJyUG9zICs9IDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM1NCk7IH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBwZWckcmVwb3J0ZWRQb3MgPSBzMDtcbiAgICAgICAgICBzMSA9IHBlZyRjNTUoKTtcbiAgICAgICAgfVxuICAgICAgICBzMCA9IHMxO1xuICAgICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDIpID09PSBwZWckYzU2KSB7XG4gICAgICAgICAgICBzMSA9IHBlZyRjNTY7XG4gICAgICAgICAgICBwZWckY3VyclBvcyArPSAyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNTcpOyB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgcGVnJHJlcG9ydGVkUG9zID0gczA7XG4gICAgICAgICAgICBzMSA9IHBlZyRjNTgoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICAgICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCAyKSA9PT0gcGVnJGM1OSkge1xuICAgICAgICAgICAgICBzMSA9IHBlZyRjNTk7XG4gICAgICAgICAgICAgIHBlZyRjdXJyUG9zICs9IDI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM2MCk7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICBwZWckcmVwb3J0ZWRQb3MgPSBzMDtcbiAgICAgICAgICAgICAgczEgPSBwZWckYzYxKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICAgICAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDIpID09PSBwZWckYzYyKSB7XG4gICAgICAgICAgICAgICAgczEgPSBwZWckYzYyO1xuICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zICs9IDI7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM2Myk7IH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICBwZWckcmVwb3J0ZWRQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICBzMSA9IHBlZyRjNjQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDIpID09PSBwZWckYzY1KSB7XG4gICAgICAgICAgICAgICAgICBzMSA9IHBlZyRjNjU7XG4gICAgICAgICAgICAgICAgICBwZWckY3VyclBvcyArPSAyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNjYpOyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgICAgczIgPSBwZWckY3VyclBvcztcbiAgICAgICAgICAgICAgICAgIHMzID0gcGVnJGN1cnJQb3M7XG4gICAgICAgICAgICAgICAgICBzNCA9IHBlZyRwYXJzZWhleERpZ2l0KCk7XG4gICAgICAgICAgICAgICAgICBpZiAoczQgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgczUgPSBwZWckcGFyc2VoZXhEaWdpdCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoczUgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgICBzNiA9IHBlZyRwYXJzZWhleERpZ2l0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKHM2ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzNyA9IHBlZyRwYXJzZWhleERpZ2l0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoczcgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgczQgPSBbczQsIHM1LCBzNiwgczddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBzMyA9IHM0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgczMgPSBwZWckYzI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczM7XG4gICAgICAgICAgICAgICAgICAgICAgICBzMyA9IHBlZyRjMjtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMztcbiAgICAgICAgICAgICAgICAgICAgICBzMyA9IHBlZyRjMjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMztcbiAgICAgICAgICAgICAgICAgICAgczMgPSBwZWckYzI7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgczMgPSBpbnB1dC5zdWJzdHJpbmcoczIsIHBlZyRjdXJyUG9zKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHMyID0gczM7XG4gICAgICAgICAgICAgICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVnJHJlcG9ydGVkUG9zID0gczA7XG4gICAgICAgICAgICAgICAgICAgIHMxID0gcGVnJGM2NyhzMik7XG4gICAgICAgICAgICAgICAgICAgIHMwID0gczE7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlY2hhcnMoKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMjtcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIHMxID0gW107XG4gICAgICBzMiA9IHBlZyRwYXJzZWNoYXIoKTtcbiAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICB3aGlsZSAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMS5wdXNoKHMyKTtcbiAgICAgICAgICBzMiA9IHBlZyRwYXJzZWNoYXIoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczEgPSBwZWckYzI7XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgcGVnJHJlcG9ydGVkUG9zID0gczA7XG4gICAgICAgIHMxID0gcGVnJGM2OChzMSk7XG4gICAgICB9XG4gICAgICBzMCA9IHMxO1xuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgcGVnJHJlc3VsdCA9IHBlZyRzdGFydFJ1bGVGdW5jdGlvbigpO1xuXG4gICAgaWYgKHBlZyRyZXN1bHQgIT09IHBlZyRGQUlMRUQgJiYgcGVnJGN1cnJQb3MgPT09IGlucHV0Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHBlZyRyZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwZWckcmVzdWx0ICE9PSBwZWckRkFJTEVEICYmIHBlZyRjdXJyUG9zIDwgaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgIHBlZyRmYWlsKHsgdHlwZTogXCJlbmRcIiwgZGVzY3JpcHRpb246IFwiZW5kIG9mIGlucHV0XCIgfSk7XG4gICAgICB9XG5cbiAgICAgIHRocm93IHBlZyRidWlsZEV4Y2VwdGlvbihudWxsLCBwZWckbWF4RmFpbEV4cGVjdGVkLCBwZWckbWF4RmFpbFBvcyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBTeW50YXhFcnJvcjogU3ludGF4RXJyb3IsXG4gICAgcGFyc2U6ICAgICAgIHBhcnNlXG4gIH07XG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZXIuanMubWFwIiwiSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuXCIsXCJwbHVyYWxSdWxlRnVuY3Rpb25cIjpmdW5jdGlvbiAobixvcmQpe3ZhciBzPVN0cmluZyhuKS5zcGxpdChcIi5cIiksdjA9IXNbMV0sdDA9TnVtYmVyKHNbMF0pPT1uLG4xMD10MCYmc1swXS5zbGljZSgtMSksbjEwMD10MCYmc1swXS5zbGljZSgtMik7aWYob3JkKXJldHVybiBuMTA9PTEmJm4xMDAhPTExP1wib25lXCI6bjEwPT0yJiZuMTAwIT0xMj9cInR3b1wiOm4xMD09MyYmbjEwMCE9MTM/XCJmZXdcIjpcIm90aGVyXCI7cmV0dXJuIG49PTEmJnYwP1wib25lXCI6XCJvdGhlclwifSxcImZpZWxkc1wiOntcInllYXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwieWVhclwiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJ0aGlzIHllYXJcIixcIjFcIjpcIm5leHQgeWVhclwiLFwiLTFcIjpcImxhc3QgeWVhclwifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiaW4gezB9IHllYXJcIixcIm90aGVyXCI6XCJpbiB7MH0geWVhcnNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJ7MH0geWVhciBhZ29cIixcIm90aGVyXCI6XCJ7MH0geWVhcnMgYWdvXCJ9fX0sXCJtb250aFwiOntcImRpc3BsYXlOYW1lXCI6XCJtb250aFwiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJ0aGlzIG1vbnRoXCIsXCIxXCI6XCJuZXh0IG1vbnRoXCIsXCItMVwiOlwibGFzdCBtb250aFwifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiaW4gezB9IG1vbnRoXCIsXCJvdGhlclwiOlwiaW4gezB9IG1vbnRoc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcInswfSBtb250aCBhZ29cIixcIm90aGVyXCI6XCJ7MH0gbW9udGhzIGFnb1wifX19LFwiZGF5XCI6e1wiZGlzcGxheU5hbWVcIjpcImRheVwiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJ0b2RheVwiLFwiMVwiOlwidG9tb3Jyb3dcIixcIi0xXCI6XCJ5ZXN0ZXJkYXlcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImluIHswfSBkYXlcIixcIm90aGVyXCI6XCJpbiB7MH0gZGF5c1wifSxcInBhc3RcIjp7XCJvbmVcIjpcInswfSBkYXkgYWdvXCIsXCJvdGhlclwiOlwiezB9IGRheXMgYWdvXCJ9fX0sXCJob3VyXCI6e1wiZGlzcGxheU5hbWVcIjpcImhvdXJcIixcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiaW4gezB9IGhvdXJcIixcIm90aGVyXCI6XCJpbiB7MH0gaG91cnNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJ7MH0gaG91ciBhZ29cIixcIm90aGVyXCI6XCJ7MH0gaG91cnMgYWdvXCJ9fX0sXCJtaW51dGVcIjp7XCJkaXNwbGF5TmFtZVwiOlwibWludXRlXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImluIHswfSBtaW51dGVcIixcIm90aGVyXCI6XCJpbiB7MH0gbWludXRlc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcInswfSBtaW51dGUgYWdvXCIsXCJvdGhlclwiOlwiezB9IG1pbnV0ZXMgYWdvXCJ9fX0sXCJzZWNvbmRcIjp7XCJkaXNwbGF5TmFtZVwiOlwic2Vjb25kXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcIm5vd1wifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiaW4gezB9IHNlY29uZFwiLFwib3RoZXJcIjpcImluIHswfSBzZWNvbmRzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiezB9IHNlY29uZCBhZ29cIixcIm90aGVyXCI6XCJ7MH0gc2Vjb25kcyBhZ29cIn19fX19KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi0wMDFcIixcInBhcmVudExvY2FsZVwiOlwiZW5cIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLTE1MFwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUFHXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tQUlcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1BU1wiLFwicGFyZW50TG9jYWxlXCI6XCJlblwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tQVRcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMTUwXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1BVVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUJCXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tQkVcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1CSVwiLFwicGFyZW50TG9jYWxlXCI6XCJlblwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tQk1cIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1CU1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUJXXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tQlpcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1DQVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUNDXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tQ0hcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMTUwXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1DS1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUNNXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tQ1hcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1DWVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLURFXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTE1MFwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tREdcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1ES1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0xNTBcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLURNXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tRHNydFwiLFwicGx1cmFsUnVsZUZ1bmN0aW9uXCI6ZnVuY3Rpb24gKG4sb3JkKXtpZihvcmQpcmV0dXJuXCJvdGhlclwiO3JldHVyblwib3RoZXJcIn0sXCJmaWVsZHNcIjp7XCJ5ZWFyXCI6e1wiZGlzcGxheU5hbWVcIjpcIlllYXJcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwidGhpcyB5ZWFyXCIsXCIxXCI6XCJuZXh0IHllYXJcIixcIi0xXCI6XCJsYXN0IHllYXJcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvdGhlclwiOlwiK3swfSB5XCJ9LFwicGFzdFwiOntcIm90aGVyXCI6XCItezB9IHlcIn19fSxcIm1vbnRoXCI6e1wiZGlzcGxheU5hbWVcIjpcIk1vbnRoXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcInRoaXMgbW9udGhcIixcIjFcIjpcIm5leHQgbW9udGhcIixcIi0xXCI6XCJsYXN0IG1vbnRoXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib3RoZXJcIjpcIit7MH0gbVwifSxcInBhc3RcIjp7XCJvdGhlclwiOlwiLXswfSBtXCJ9fX0sXCJkYXlcIjp7XCJkaXNwbGF5TmFtZVwiOlwiRGF5XCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcInRvZGF5XCIsXCIxXCI6XCJ0b21vcnJvd1wiLFwiLTFcIjpcInllc3RlcmRheVwifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm90aGVyXCI6XCIrezB9IGRcIn0sXCJwYXN0XCI6e1wib3RoZXJcIjpcIi17MH0gZFwifX19LFwiaG91clwiOntcImRpc3BsYXlOYW1lXCI6XCJIb3VyXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvdGhlclwiOlwiK3swfSBoXCJ9LFwicGFzdFwiOntcIm90aGVyXCI6XCItezB9IGhcIn19fSxcIm1pbnV0ZVwiOntcImRpc3BsYXlOYW1lXCI6XCJNaW51dGVcIixcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm90aGVyXCI6XCIrezB9IG1pblwifSxcInBhc3RcIjp7XCJvdGhlclwiOlwiLXswfSBtaW5cIn19fSxcInNlY29uZFwiOntcImRpc3BsYXlOYW1lXCI6XCJTZWNvbmRcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwibm93XCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib3RoZXJcIjpcIit7MH0gc1wifSxcInBhc3RcIjp7XCJvdGhlclwiOlwiLXswfSBzXCJ9fX19fSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tRVJcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1GSVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0xNTBcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUZKXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tRktcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1GTVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUdCXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tR0RcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1HR1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUdIXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tR0lcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1HTVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUdVXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1HWVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUhLXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tSUVcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1JTFwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUlNXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tSU5cIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1JT1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUpFXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tSk1cIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1LRVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUtJXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tS05cIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1LWVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUxDXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tTFJcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1MU1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLU1HXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tTUhcIixcInBhcmVudExvY2FsZVwiOlwiZW5cIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLU1PXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tTVBcIixcInBhcmVudExvY2FsZVwiOlwiZW5cIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLU1TXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tTVRcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1NVVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLU1XXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tTVlcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1OQVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLU5GXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tTkdcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1OTFwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0xNTBcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLU5SXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tTlVcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1OWlwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVBHXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tUEhcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1QS1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVBOXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tUFJcIixcInBhcmVudExvY2FsZVwiOlwiZW5cIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVBXXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tUldcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1TQlwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVNDXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tU0RcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1TRVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0xNTBcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVNHXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tU0hcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1TSVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0xNTBcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVNMXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tU1NcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1TWFwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVNaXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tU2hhd1wiLFwicGx1cmFsUnVsZUZ1bmN0aW9uXCI6ZnVuY3Rpb24gKG4sb3JkKXtpZihvcmQpcmV0dXJuXCJvdGhlclwiO3JldHVyblwib3RoZXJcIn0sXCJmaWVsZHNcIjp7XCJ5ZWFyXCI6e1wiZGlzcGxheU5hbWVcIjpcIlllYXJcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwidGhpcyB5ZWFyXCIsXCIxXCI6XCJuZXh0IHllYXJcIixcIi0xXCI6XCJsYXN0IHllYXJcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvdGhlclwiOlwiK3swfSB5XCJ9LFwicGFzdFwiOntcIm90aGVyXCI6XCItezB9IHlcIn19fSxcIm1vbnRoXCI6e1wiZGlzcGxheU5hbWVcIjpcIk1vbnRoXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcInRoaXMgbW9udGhcIixcIjFcIjpcIm5leHQgbW9udGhcIixcIi0xXCI6XCJsYXN0IG1vbnRoXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib3RoZXJcIjpcIit7MH0gbVwifSxcInBhc3RcIjp7XCJvdGhlclwiOlwiLXswfSBtXCJ9fX0sXCJkYXlcIjp7XCJkaXNwbGF5TmFtZVwiOlwiRGF5XCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcInRvZGF5XCIsXCIxXCI6XCJ0b21vcnJvd1wiLFwiLTFcIjpcInllc3RlcmRheVwifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm90aGVyXCI6XCIrezB9IGRcIn0sXCJwYXN0XCI6e1wib3RoZXJcIjpcIi17MH0gZFwifX19LFwiaG91clwiOntcImRpc3BsYXlOYW1lXCI6XCJIb3VyXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvdGhlclwiOlwiK3swfSBoXCJ9LFwicGFzdFwiOntcIm90aGVyXCI6XCItezB9IGhcIn19fSxcIm1pbnV0ZVwiOntcImRpc3BsYXlOYW1lXCI6XCJNaW51dGVcIixcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm90aGVyXCI6XCIrezB9IG1pblwifSxcInBhc3RcIjp7XCJvdGhlclwiOlwiLXswfSBtaW5cIn19fSxcInNlY29uZFwiOntcImRpc3BsYXlOYW1lXCI6XCJTZWNvbmRcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwibm93XCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib3RoZXJcIjpcIit7MH0gc1wifSxcInBhc3RcIjp7XCJvdGhlclwiOlwiLXswfSBzXCJ9fX19fSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tVENcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1US1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVRPXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tVFRcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1UVlwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVRaXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tVUdcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1VTVwiLFwicGFyZW50TG9jYWxlXCI6XCJlblwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tVVNcIixcInBhcmVudExvY2FsZVwiOlwiZW5cIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVZDXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tVkdcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1WSVwiLFwicGFyZW50TG9jYWxlXCI6XCJlblwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tVlVcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1XU1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVpBXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tWk1cIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1aV1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuIiwiSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVzXCIsXCJwbHVyYWxSdWxlRnVuY3Rpb25cIjpmdW5jdGlvbiAobixvcmQpe2lmKG9yZClyZXR1cm5cIm90aGVyXCI7cmV0dXJuIG49PTE/XCJvbmVcIjpcIm90aGVyXCJ9LFwiZmllbGRzXCI6e1wieWVhclwiOntcImRpc3BsYXlOYW1lXCI6XCJhw7FvXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImVzdGUgYcOxb1wiLFwiMVwiOlwiZWwgcHLDs3hpbW8gYcOxb1wiLFwiLTFcIjpcImVsIGHDsW8gcGFzYWRvXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGHDsW9cIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGHDsW9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gYcOxb1wiLFwib3RoZXJcIjpcImhhY2UgezB9IGHDsW9zXCJ9fX0sXCJtb250aFwiOntcImRpc3BsYXlOYW1lXCI6XCJtZXNcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiZXN0ZSBtZXNcIixcIjFcIjpcImVsIHByw7N4aW1vIG1lc1wiLFwiLTFcIjpcImVsIG1lcyBwYXNhZG9cIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gbWVzXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBtZXNlc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IG1lc1wiLFwib3RoZXJcIjpcImhhY2UgezB9IG1lc2VzXCJ9fX0sXCJkYXlcIjp7XCJkaXNwbGF5TmFtZVwiOlwiZMOtYVwiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJob3lcIixcIjFcIjpcIm1hw7FhbmFcIixcIjJcIjpcInBhc2FkbyBtYcOxYW5hXCIsXCItMlwiOlwiYW50ZWF5ZXJcIixcIi0xXCI6XCJheWVyXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGTDrWFcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGTDrWFzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gZMOtYVwiLFwib3RoZXJcIjpcImhhY2UgezB9IGTDrWFzXCJ9fX0sXCJob3VyXCI6e1wiZGlzcGxheU5hbWVcIjpcImhvcmFcIixcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBob3JhXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBob3Jhc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IGhvcmFcIixcIm90aGVyXCI6XCJoYWNlIHswfSBob3Jhc1wifX19LFwibWludXRlXCI6e1wiZGlzcGxheU5hbWVcIjpcIm1pbnV0b1wiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IG1pbnV0b1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gbWludXRvc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IG1pbnV0b1wiLFwib3RoZXJcIjpcImhhY2UgezB9IG1pbnV0b3NcIn19fSxcInNlY29uZFwiOntcImRpc3BsYXlOYW1lXCI6XCJzZWd1bmRvXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImFob3JhXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IHNlZ3VuZG9cIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IHNlZ3VuZG9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gc2VndW5kb1wiLFwib3RoZXJcIjpcImhhY2UgezB9IHNlZ3VuZG9zXCJ9fX19fSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZXMtNDE5XCIsXCJwYXJlbnRMb2NhbGVcIjpcImVzXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1BUlwiLFwicGFyZW50TG9jYWxlXCI6XCJlcy00MTlcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVzLUJPXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVzLTQxOVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZXMtQ0xcIixcInBhcmVudExvY2FsZVwiOlwiZXMtNDE5XCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1DT1wiLFwicGFyZW50TG9jYWxlXCI6XCJlcy00MTlcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVzLUNSXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVzLTQxOVwiLFwiZmllbGRzXCI6e1wieWVhclwiOntcImRpc3BsYXlOYW1lXCI6XCJhw7FvXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImVzdGUgYcOxb1wiLFwiMVwiOlwiZWwgcHLDs3hpbW8gYcOxb1wiLFwiLTFcIjpcImVsIGHDsW8gcGFzYWRvXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGHDsW9cIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGHDsW9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gYcOxb1wiLFwib3RoZXJcIjpcImhhY2UgezB9IGHDsW9zXCJ9fX0sXCJtb250aFwiOntcImRpc3BsYXlOYW1lXCI6XCJtZXNcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiZXN0ZSBtZXNcIixcIjFcIjpcImVsIHByw7N4aW1vIG1lc1wiLFwiLTFcIjpcImVsIG1lcyBwYXNhZG9cIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gbWVzXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBtZXNlc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IG1lc1wiLFwib3RoZXJcIjpcImhhY2UgezB9IG1lc2VzXCJ9fX0sXCJkYXlcIjp7XCJkaXNwbGF5TmFtZVwiOlwiZMOtYVwiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJob3lcIixcIjFcIjpcIm1hw7FhbmFcIixcIjJcIjpcInBhc2FkbyBtYcOxYW5hXCIsXCItMlwiOlwiYW50aWVyXCIsXCItMVwiOlwiYXllclwifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBkw61hXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBkw61hc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IGTDrWFcIixcIm90aGVyXCI6XCJoYWNlIHswfSBkw61hc1wifX19LFwiaG91clwiOntcImRpc3BsYXlOYW1lXCI6XCJob3JhXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gaG9yYVwiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gaG9yYXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBob3JhXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gaG9yYXNcIn19fSxcIm1pbnV0ZVwiOntcImRpc3BsYXlOYW1lXCI6XCJtaW51dG9cIixcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBtaW51dG9cIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IG1pbnV0b3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBtaW51dG9cIixcIm90aGVyXCI6XCJoYWNlIHswfSBtaW51dG9zXCJ9fX0sXCJzZWNvbmRcIjp7XCJkaXNwbGF5TmFtZVwiOlwic2VndW5kb1wiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJhaG9yYVwifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBzZWd1bmRvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBzZWd1bmRvc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IHNlZ3VuZG9cIixcIm90aGVyXCI6XCJoYWNlIHswfSBzZWd1bmRvc1wifX19fX0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVzLUNVXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVzLTQxOVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZXMtRE9cIixcInBhcmVudExvY2FsZVwiOlwiZXMtNDE5XCIsXCJmaWVsZHNcIjp7XCJ5ZWFyXCI6e1wiZGlzcGxheU5hbWVcIjpcIkHDsW9cIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiZXN0ZSBhw7FvXCIsXCIxXCI6XCJlbCBwcsOzeGltbyBhw7FvXCIsXCItMVwiOlwiZWwgYcOxbyBwYXNhZG9cIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gYcOxb1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gYcOxb3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBhw7FvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gYcOxb3NcIn19fSxcIm1vbnRoXCI6e1wiZGlzcGxheU5hbWVcIjpcIk1lc1wiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJlc3RlIG1lc1wiLFwiMVwiOlwiZWwgcHLDs3hpbW8gbWVzXCIsXCItMVwiOlwiZWwgbWVzIHBhc2Fkb1wifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBtZXNcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IG1lc2VzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gbWVzXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gbWVzZXNcIn19fSxcImRheVwiOntcImRpc3BsYXlOYW1lXCI6XCJEw61hXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImhveVwiLFwiMVwiOlwibWHDsWFuYVwiLFwiMlwiOlwicGFzYWRvIG1hw7FhbmFcIixcIi0yXCI6XCJhbnRlYXllclwiLFwiLTFcIjpcImF5ZXJcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gZMOtYVwiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gZMOtYXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBkw61hXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gZMOtYXNcIn19fSxcImhvdXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiaG9yYVwiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGhvcmFcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGhvcmFzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gaG9yYVwiLFwib3RoZXJcIjpcImhhY2UgezB9IGhvcmFzXCJ9fX0sXCJtaW51dGVcIjp7XCJkaXNwbGF5TmFtZVwiOlwiTWludXRvXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBtaW51dG9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gbWludXRvc1wifX19LFwic2Vjb25kXCI6e1wiZGlzcGxheU5hbWVcIjpcIlNlZ3VuZG9cIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiYWhvcmFcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBzZWd1bmRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gc2VndW5kb3NcIn19fX19KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1FQVwiLFwicGFyZW50TG9jYWxlXCI6XCJlc1wifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZXMtRUNcIixcInBhcmVudExvY2FsZVwiOlwiZXMtNDE5XCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1HUVwiLFwicGFyZW50TG9jYWxlXCI6XCJlc1wifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZXMtR1RcIixcInBhcmVudExvY2FsZVwiOlwiZXMtNDE5XCIsXCJmaWVsZHNcIjp7XCJ5ZWFyXCI6e1wiZGlzcGxheU5hbWVcIjpcImHDsW9cIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiZXN0ZSBhw7FvXCIsXCIxXCI6XCJlbCBwcsOzeGltbyBhw7FvXCIsXCItMVwiOlwiZWwgYcOxbyBwYXNhZG9cIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gYcOxb1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gYcOxb3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBhw7FvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gYcOxb3NcIn19fSxcIm1vbnRoXCI6e1wiZGlzcGxheU5hbWVcIjpcIm1lc1wiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJlc3RlIG1lc1wiLFwiMVwiOlwiZWwgcHLDs3hpbW8gbWVzXCIsXCItMVwiOlwiZWwgbWVzIHBhc2Fkb1wifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBtZXNcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IG1lc2VzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gbWVzXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gbWVzZXNcIn19fSxcImRheVwiOntcImRpc3BsYXlOYW1lXCI6XCJkw61hXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImhveVwiLFwiMVwiOlwibWHDsWFuYVwiLFwiMlwiOlwicGFzYWRvIG1hw7FhbmFcIixcIi0yXCI6XCJhbnRpZXJcIixcIi0xXCI6XCJheWVyXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGTDrWFcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGTDrWFzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gZMOtYVwiLFwib3RoZXJcIjpcImhhY2UgezB9IGTDrWFzXCJ9fX0sXCJob3VyXCI6e1wiZGlzcGxheU5hbWVcIjpcImhvcmFcIixcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBob3JhXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBob3Jhc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IGhvcmFcIixcIm90aGVyXCI6XCJoYWNlIHswfSBob3Jhc1wifX19LFwibWludXRlXCI6e1wiZGlzcGxheU5hbWVcIjpcIm1pbnV0b1wiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IG1pbnV0b1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gbWludXRvc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IG1pbnV0b1wiLFwib3RoZXJcIjpcImhhY2UgezB9IG1pbnV0b3NcIn19fSxcInNlY29uZFwiOntcImRpc3BsYXlOYW1lXCI6XCJzZWd1bmRvXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImFob3JhXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IHNlZ3VuZG9cIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IHNlZ3VuZG9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gc2VndW5kb1wiLFwib3RoZXJcIjpcImhhY2UgezB9IHNlZ3VuZG9zXCJ9fX19fSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZXMtSE5cIixcInBhcmVudExvY2FsZVwiOlwiZXMtNDE5XCIsXCJmaWVsZHNcIjp7XCJ5ZWFyXCI6e1wiZGlzcGxheU5hbWVcIjpcImHDsW9cIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiZXN0ZSBhw7FvXCIsXCIxXCI6XCJlbCBwcsOzeGltbyBhw7FvXCIsXCItMVwiOlwiZWwgYcOxbyBwYXNhZG9cIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gYcOxb1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gYcOxb3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBhw7FvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gYcOxb3NcIn19fSxcIm1vbnRoXCI6e1wiZGlzcGxheU5hbWVcIjpcIm1lc1wiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJlc3RlIG1lc1wiLFwiMVwiOlwiZWwgcHLDs3hpbW8gbWVzXCIsXCItMVwiOlwiZWwgbWVzIHBhc2Fkb1wifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBtZXNcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IG1lc2VzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gbWVzXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gbWVzZXNcIn19fSxcImRheVwiOntcImRpc3BsYXlOYW1lXCI6XCJkw61hXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImhveVwiLFwiMVwiOlwibWHDsWFuYVwiLFwiMlwiOlwicGFzYWRvIG1hw7FhbmFcIixcIi0yXCI6XCJhbnRpZXJcIixcIi0xXCI6XCJheWVyXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGTDrWFcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGTDrWFzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gZMOtYVwiLFwib3RoZXJcIjpcImhhY2UgezB9IGTDrWFzXCJ9fX0sXCJob3VyXCI6e1wiZGlzcGxheU5hbWVcIjpcImhvcmFcIixcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBob3JhXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBob3Jhc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IGhvcmFcIixcIm90aGVyXCI6XCJoYWNlIHswfSBob3Jhc1wifX19LFwibWludXRlXCI6e1wiZGlzcGxheU5hbWVcIjpcIm1pbnV0b1wiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IG1pbnV0b1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gbWludXRvc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IG1pbnV0b1wiLFwib3RoZXJcIjpcImhhY2UgezB9IG1pbnV0b3NcIn19fSxcInNlY29uZFwiOntcImRpc3BsYXlOYW1lXCI6XCJzZWd1bmRvXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImFob3JhXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IHNlZ3VuZG9cIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IHNlZ3VuZG9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gc2VndW5kb1wiLFwib3RoZXJcIjpcImhhY2UgezB9IHNlZ3VuZG9zXCJ9fX19fSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZXMtSUNcIixcInBhcmVudExvY2FsZVwiOlwiZXNcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVzLU1YXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVzLTQxOVwiLFwiZmllbGRzXCI6e1wieWVhclwiOntcImRpc3BsYXlOYW1lXCI6XCJhw7FvXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImVzdGUgYcOxb1wiLFwiMVwiOlwiZWwgYcOxbyBwcsOzeGltb1wiLFwiLTFcIjpcImVsIGHDsW8gcGFzYWRvXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGHDsW9cIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGHDsW9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gYcOxb1wiLFwib3RoZXJcIjpcImhhY2UgezB9IGHDsW9zXCJ9fX0sXCJtb250aFwiOntcImRpc3BsYXlOYW1lXCI6XCJtZXNcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiZXN0ZSBtZXNcIixcIjFcIjpcImVsIG1lcyBwcsOzeGltb1wiLFwiLTFcIjpcImVsIG1lcyBwYXNhZG9cIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImVuIHswfSBtZXNcIixcIm90aGVyXCI6XCJlbiB7MH0gbWVzZXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBtZXNcIixcIm90aGVyXCI6XCJoYWNlIHswfSBtZXNlc1wifX19LFwiZGF5XCI6e1wiZGlzcGxheU5hbWVcIjpcImTDrWFcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiaG95XCIsXCIxXCI6XCJtYcOxYW5hXCIsXCIyXCI6XCJwYXNhZG8gbWHDsWFuYVwiLFwiLTJcIjpcImFudGllclwiLFwiLTFcIjpcImF5ZXJcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gZMOtYVwiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gZMOtYXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBkw61hXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gZMOtYXNcIn19fSxcImhvdXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiaG9yYVwiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGhvcmFcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGhvcmFzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gaG9yYVwiLFwib3RoZXJcIjpcImhhY2UgezB9IGhvcmFzXCJ9fX0sXCJtaW51dGVcIjp7XCJkaXNwbGF5TmFtZVwiOlwibWludXRvXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBtaW51dG9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gbWludXRvc1wifX19LFwic2Vjb25kXCI6e1wiZGlzcGxheU5hbWVcIjpcInNlZ3VuZG9cIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiYWhvcmFcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBzZWd1bmRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gc2VndW5kb3NcIn19fX19KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1OSVwiLFwicGFyZW50TG9jYWxlXCI6XCJlcy00MTlcIixcImZpZWxkc1wiOntcInllYXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiYcOxb1wiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJlc3RlIGHDsW9cIixcIjFcIjpcImVsIHByw7N4aW1vIGHDsW9cIixcIi0xXCI6XCJlbCBhw7FvIHBhc2Fkb1wifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBhw7FvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBhw7Fvc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IGHDsW9cIixcIm90aGVyXCI6XCJoYWNlIHswfSBhw7Fvc1wifX19LFwibW9udGhcIjp7XCJkaXNwbGF5TmFtZVwiOlwibWVzXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImVzdGUgbWVzXCIsXCIxXCI6XCJlbCBwcsOzeGltbyBtZXNcIixcIi0xXCI6XCJlbCBtZXMgcGFzYWRvXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IG1lc1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gbWVzZXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBtZXNcIixcIm90aGVyXCI6XCJoYWNlIHswfSBtZXNlc1wifX19LFwiZGF5XCI6e1wiZGlzcGxheU5hbWVcIjpcImTDrWFcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiaG95XCIsXCIxXCI6XCJtYcOxYW5hXCIsXCIyXCI6XCJwYXNhZG8gbWHDsWFuYVwiLFwiLTJcIjpcImFudGllclwiLFwiLTFcIjpcImF5ZXJcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gZMOtYVwiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gZMOtYXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBkw61hXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gZMOtYXNcIn19fSxcImhvdXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiaG9yYVwiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGhvcmFcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGhvcmFzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gaG9yYVwiLFwib3RoZXJcIjpcImhhY2UgezB9IGhvcmFzXCJ9fX0sXCJtaW51dGVcIjp7XCJkaXNwbGF5TmFtZVwiOlwibWludXRvXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBtaW51dG9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gbWludXRvc1wifX19LFwic2Vjb25kXCI6e1wiZGlzcGxheU5hbWVcIjpcInNlZ3VuZG9cIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiYWhvcmFcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBzZWd1bmRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gc2VndW5kb3NcIn19fX19KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1QQVwiLFwicGFyZW50TG9jYWxlXCI6XCJlcy00MTlcIixcImZpZWxkc1wiOntcInllYXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiYcOxb1wiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJlc3RlIGHDsW9cIixcIjFcIjpcImVsIHByw7N4aW1vIGHDsW9cIixcIi0xXCI6XCJlbCBhw7FvIHBhc2Fkb1wifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBhw7FvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBhw7Fvc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IGHDsW9cIixcIm90aGVyXCI6XCJoYWNlIHswfSBhw7Fvc1wifX19LFwibW9udGhcIjp7XCJkaXNwbGF5TmFtZVwiOlwibWVzXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImVzdGUgbWVzXCIsXCIxXCI6XCJlbCBwcsOzeGltbyBtZXNcIixcIi0xXCI6XCJlbCBtZXMgcGFzYWRvXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IG1lc1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gbWVzZXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBtZXNcIixcIm90aGVyXCI6XCJoYWNlIHswfSBtZXNlc1wifX19LFwiZGF5XCI6e1wiZGlzcGxheU5hbWVcIjpcImTDrWFcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiaG95XCIsXCIxXCI6XCJtYcOxYW5hXCIsXCIyXCI6XCJwYXNhZG8gbWHDsWFuYVwiLFwiLTJcIjpcImFudGllclwiLFwiLTFcIjpcImF5ZXJcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gZMOtYVwiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gZMOtYXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBkw61hXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gZMOtYXNcIn19fSxcImhvdXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiaG9yYVwiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGhvcmFcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGhvcmFzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gaG9yYVwiLFwib3RoZXJcIjpcImhhY2UgezB9IGhvcmFzXCJ9fX0sXCJtaW51dGVcIjp7XCJkaXNwbGF5TmFtZVwiOlwibWludXRvXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBtaW51dG9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gbWludXRvc1wifX19LFwic2Vjb25kXCI6e1wiZGlzcGxheU5hbWVcIjpcInNlZ3VuZG9cIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiYWhvcmFcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBzZWd1bmRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gc2VndW5kb3NcIn19fX19KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1QRVwiLFwicGFyZW50TG9jYWxlXCI6XCJlcy00MTlcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVzLVBIXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVzXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1QUlwiLFwicGFyZW50TG9jYWxlXCI6XCJlcy00MTlcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVzLVBZXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVzLTQxOVwiLFwiZmllbGRzXCI6e1wieWVhclwiOntcImRpc3BsYXlOYW1lXCI6XCJhw7FvXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImVzdGUgYcOxb1wiLFwiMVwiOlwiZWwgcHLDs3hpbW8gYcOxb1wiLFwiLTFcIjpcImVsIGHDsW8gcGFzYWRvXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGHDsW9cIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGHDsW9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gYcOxb1wiLFwib3RoZXJcIjpcImhhY2UgezB9IGHDsW9zXCJ9fX0sXCJtb250aFwiOntcImRpc3BsYXlOYW1lXCI6XCJtZXNcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiZXN0ZSBtZXNcIixcIjFcIjpcImVsIHByw7N4aW1vIG1lc1wiLFwiLTFcIjpcImVsIG1lcyBwYXNhZG9cIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gbWVzXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBtZXNlc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IG1lc1wiLFwib3RoZXJcIjpcImhhY2UgezB9IG1lc2VzXCJ9fX0sXCJkYXlcIjp7XCJkaXNwbGF5TmFtZVwiOlwiZMOtYVwiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJob3lcIixcIjFcIjpcIm1hw7FhbmFcIixcIjJcIjpcInBhc2FkbyBtYcOxYW5hXCIsXCItMlwiOlwiYW50ZXMgZGUgYXllclwiLFwiLTFcIjpcImF5ZXJcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gZMOtYVwiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gZMOtYXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBkw61hXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gZMOtYXNcIn19fSxcImhvdXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiaG9yYVwiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGhvcmFcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGhvcmFzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gaG9yYVwiLFwib3RoZXJcIjpcImhhY2UgezB9IGhvcmFzXCJ9fX0sXCJtaW51dGVcIjp7XCJkaXNwbGF5TmFtZVwiOlwibWludXRvXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBtaW51dG9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gbWludXRvc1wifX19LFwic2Vjb25kXCI6e1wiZGlzcGxheU5hbWVcIjpcInNlZ3VuZG9cIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiYWhvcmFcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBzZWd1bmRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gc2VndW5kb3NcIn19fX19KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1TVlwiLFwicGFyZW50TG9jYWxlXCI6XCJlcy00MTlcIixcImZpZWxkc1wiOntcInllYXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiYcOxb1wiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJlc3RlIGHDsW9cIixcIjFcIjpcImVsIHByw7N4aW1vIGHDsW9cIixcIi0xXCI6XCJlbCBhw7FvIHBhc2Fkb1wifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBhw7FvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBhw7Fvc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IGHDsW9cIixcIm90aGVyXCI6XCJoYWNlIHswfSBhw7Fvc1wifX19LFwibW9udGhcIjp7XCJkaXNwbGF5TmFtZVwiOlwibWVzXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImVzdGUgbWVzXCIsXCIxXCI6XCJlbCBwcsOzeGltbyBtZXNcIixcIi0xXCI6XCJlbCBtZXMgcGFzYWRvXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IG1lc1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gbWVzZXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBtZXNcIixcIm90aGVyXCI6XCJoYWNlIHswfSBtZXNlc1wifX19LFwiZGF5XCI6e1wiZGlzcGxheU5hbWVcIjpcImTDrWFcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiaG95XCIsXCIxXCI6XCJtYcOxYW5hXCIsXCIyXCI6XCJwYXNhZG8gbWHDsWFuYVwiLFwiLTJcIjpcImFudGllclwiLFwiLTFcIjpcImF5ZXJcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gZMOtYVwiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gZMOtYXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBkw61hXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gZMOtYXNcIn19fSxcImhvdXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiaG9yYVwiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGhvcmFcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGhvcmFzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gaG9yYVwiLFwib3RoZXJcIjpcImhhY2UgezB9IGhvcmFzXCJ9fX0sXCJtaW51dGVcIjp7XCJkaXNwbGF5TmFtZVwiOlwibWludXRvXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBtaW51dG9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gbWludXRvc1wifX19LFwic2Vjb25kXCI6e1wiZGlzcGxheU5hbWVcIjpcInNlZ3VuZG9cIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiYWhvcmFcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBzZWd1bmRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gc2VndW5kb3NcIn19fX19KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1VU1wiLFwicGFyZW50TG9jYWxlXCI6XCJlcy00MTlcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVzLVVZXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVzLTQxOVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZXMtVkVcIixcInBhcmVudExvY2FsZVwiOlwiZXMtNDE5XCJ9KTtcbiIsIi8qIGpzaGludCBub2RlOnRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgSW50bFJlbGF0aXZlRm9ybWF0ID0gcmVxdWlyZSgnLi9saWIvbWFpbicpWydkZWZhdWx0J107XG5cbi8vIEFkZCBhbGwgbG9jYWxlIGRhdGEgdG8gYEludGxSZWxhdGl2ZUZvcm1hdGAuIFRoaXMgbW9kdWxlIHdpbGwgYmUgaWdub3JlZCB3aGVuXG4vLyBidW5kbGluZyBmb3IgdGhlIGJyb3dzZXIgd2l0aCBCcm93c2VyaWZ5L1dlYnBhY2suXG5yZXF1aXJlKCcuL2xpYi9sb2NhbGVzJyk7XG5cbi8vIFJlLWV4cG9ydCBgSW50bFJlbGF0aXZlRm9ybWF0YCBhcyB0aGUgQ29tbW9uSlMgZGVmYXVsdCBleHBvcnRzIHdpdGggYWxsIHRoZVxuLy8gbG9jYWxlIGRhdGEgcmVnaXN0ZXJlZCwgYW5kIHdpdGggRW5nbGlzaCBzZXQgYXMgdGhlIGRlZmF1bHQgbG9jYWxlLiBEZWZpbmVcbi8vIHRoZSBgZGVmYXVsdGAgcHJvcCBmb3IgdXNlIHdpdGggb3RoZXIgY29tcGlsZWQgRVM2IE1vZHVsZXMuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBJbnRsUmVsYXRpdmVGb3JtYXQ7XG5leHBvcnRzWydkZWZhdWx0J10gPSBleHBvcnRzO1xuIiwiLypcbkNvcHlyaWdodCAoYykgMjAxNCwgWWFob28hIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbkNvcHlyaWdodHMgbGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgTGljZW5zZS5cblNlZSB0aGUgYWNjb21wYW55aW5nIExJQ0VOU0UgZmlsZSBmb3IgdGVybXMuXG4qL1xuXG4vKiBqc2xpbnQgZXNuZXh0OiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xudmFyIGludGwkbWVzc2FnZWZvcm1hdCQkID0gcmVxdWlyZShcImludGwtbWVzc2FnZWZvcm1hdFwiKSwgc3JjJGRpZmYkJCA9IHJlcXVpcmUoXCIuL2RpZmZcIiksIHNyYyRlczUkJCA9IHJlcXVpcmUoXCIuL2VzNVwiKTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gUmVsYXRpdmVGb3JtYXQ7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBGSUVMRFMgPSBbJ3NlY29uZCcsICdtaW51dGUnLCAnaG91cicsICdkYXknLCAnbW9udGgnLCAneWVhciddO1xudmFyIFNUWUxFUyA9IFsnYmVzdCBmaXQnLCAnbnVtZXJpYyddO1xuXG4vLyAtLSBSZWxhdGl2ZUZvcm1hdCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBSZWxhdGl2ZUZvcm1hdChsb2NhbGVzLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAvLyBNYWtlIGEgY29weSBvZiBgbG9jYWxlc2AgaWYgaXQncyBhbiBhcnJheSwgc28gdGhhdCBpdCBkb2Vzbid0IGNoYW5nZVxuICAgIC8vIHNpbmNlIGl0J3MgdXNlZCBsYXppbHkuXG4gICAgaWYgKHNyYyRlczUkJC5pc0FycmF5KGxvY2FsZXMpKSB7XG4gICAgICAgIGxvY2FsZXMgPSBsb2NhbGVzLmNvbmNhdCgpO1xuICAgIH1cblxuICAgIHNyYyRlczUkJC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX2xvY2FsZScsIHt2YWx1ZTogdGhpcy5fcmVzb2x2ZUxvY2FsZShsb2NhbGVzKX0pO1xuICAgIHNyYyRlczUkJC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX29wdGlvbnMnLCB7dmFsdWU6IHtcbiAgICAgICAgc3R5bGU6IHRoaXMuX3Jlc29sdmVTdHlsZShvcHRpb25zLnN0eWxlKSxcbiAgICAgICAgdW5pdHM6IHRoaXMuX2lzVmFsaWRVbml0cyhvcHRpb25zLnVuaXRzKSAmJiBvcHRpb25zLnVuaXRzXG4gICAgfX0pO1xuXG4gICAgc3JjJGVzNSQkLmRlZmluZVByb3BlcnR5KHRoaXMsICdfbG9jYWxlcycsIHt2YWx1ZTogbG9jYWxlc30pO1xuICAgIHNyYyRlczUkJC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX2ZpZWxkcycsIHt2YWx1ZTogdGhpcy5fZmluZEZpZWxkcyh0aGlzLl9sb2NhbGUpfSk7XG4gICAgc3JjJGVzNSQkLmRlZmluZVByb3BlcnR5KHRoaXMsICdfbWVzc2FnZXMnLCB7dmFsdWU6IHNyYyRlczUkJC5vYmpDcmVhdGUobnVsbCl9KTtcblxuICAgIC8vIFwiQmluZFwiIGBmb3JtYXQoKWAgbWV0aG9kIHRvIGB0aGlzYCBzbyBpdCBjYW4gYmUgcGFzc2VkIGJ5IHJlZmVyZW5jZSBsaWtlXG4gICAgLy8gdGhlIG90aGVyIGBJbnRsYCBBUElzLlxuICAgIHZhciByZWxhdGl2ZUZvcm1hdCA9IHRoaXM7XG4gICAgdGhpcy5mb3JtYXQgPSBmdW5jdGlvbiBmb3JtYXQoZGF0ZSwgb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gcmVsYXRpdmVGb3JtYXQuX2Zvcm1hdChkYXRlLCBvcHRpb25zKTtcbiAgICB9O1xufVxuXG4vLyBEZWZpbmUgaW50ZXJuYWwgcHJpdmF0ZSBwcm9wZXJ0aWVzIGZvciBkZWFsaW5nIHdpdGggbG9jYWxlIGRhdGEuXG5zcmMkZXM1JCQuZGVmaW5lUHJvcGVydHkoUmVsYXRpdmVGb3JtYXQsICdfX2xvY2FsZURhdGFfXycsIHt2YWx1ZTogc3JjJGVzNSQkLm9iakNyZWF0ZShudWxsKX0pO1xuc3JjJGVzNSQkLmRlZmluZVByb3BlcnR5KFJlbGF0aXZlRm9ybWF0LCAnX19hZGRMb2NhbGVEYXRhJywge3ZhbHVlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGlmICghKGRhdGEgJiYgZGF0YS5sb2NhbGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICdMb2NhbGUgZGF0YSBwcm92aWRlZCB0byBJbnRsUmVsYXRpdmVGb3JtYXQgaXMgbWlzc2luZyBhICcgK1xuICAgICAgICAgICAgJ2Bsb2NhbGVgIHByb3BlcnR5IHZhbHVlJ1xuICAgICAgICApO1xuICAgIH1cblxuICAgIFJlbGF0aXZlRm9ybWF0Ll9fbG9jYWxlRGF0YV9fW2RhdGEubG9jYWxlLnRvTG93ZXJDYXNlKCldID0gZGF0YTtcblxuICAgIC8vIEFkZCBkYXRhIHRvIEludGxNZXNzYWdlRm9ybWF0LlxuICAgIGludGwkbWVzc2FnZWZvcm1hdCQkW1wiZGVmYXVsdFwiXS5fX2FkZExvY2FsZURhdGEoZGF0YSk7XG59fSk7XG5cbi8vIERlZmluZSBwdWJsaWMgYGRlZmF1bHRMb2NhbGVgIHByb3BlcnR5IHdoaWNoIGNhbiBiZSBzZXQgYnkgdGhlIGRldmVsb3Blciwgb3Jcbi8vIGl0IHdpbGwgYmUgc2V0IHdoZW4gdGhlIGZpcnN0IFJlbGF0aXZlRm9ybWF0IGluc3RhbmNlIGlzIGNyZWF0ZWQgYnlcbi8vIGxldmVyYWdpbmcgdGhlIHJlc29sdmVkIGxvY2FsZSBmcm9tIGBJbnRsYC5cbnNyYyRlczUkJC5kZWZpbmVQcm9wZXJ0eShSZWxhdGl2ZUZvcm1hdCwgJ2RlZmF1bHRMb2NhbGUnLCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZSAgOiB0cnVlLFxuICAgIHZhbHVlICAgICA6IHVuZGVmaW5lZFxufSk7XG5cbi8vIERlZmluZSBwdWJsaWMgYHRocmVzaG9sZHNgIHByb3BlcnR5IHdoaWNoIGNhbiBiZSBzZXQgYnkgdGhlIGRldmVsb3BlciwgYW5kXG4vLyBkZWZhdWx0cyB0byByZWxhdGl2ZSB0aW1lIHRocmVzaG9sZHMgZnJvbSBtb21lbnQuanMuXG5zcmMkZXM1JCQuZGVmaW5lUHJvcGVydHkoUmVsYXRpdmVGb3JtYXQsICd0aHJlc2hvbGRzJywge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG5cbiAgICB2YWx1ZToge1xuICAgICAgICBzZWNvbmQ6IDQ1LCAgLy8gc2Vjb25kcyB0byBtaW51dGVcbiAgICAgICAgbWludXRlOiA0NSwgIC8vIG1pbnV0ZXMgdG8gaG91clxuICAgICAgICBob3VyICA6IDIyLCAgLy8gaG91cnMgdG8gZGF5XG4gICAgICAgIGRheSAgIDogMjYsICAvLyBkYXlzIHRvIG1vbnRoXG4gICAgICAgIG1vbnRoIDogMTEgICAvLyBtb250aHMgdG8geWVhclxuICAgIH1cbn0pO1xuXG5SZWxhdGl2ZUZvcm1hdC5wcm90b3R5cGUucmVzb2x2ZWRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGxvY2FsZTogdGhpcy5fbG9jYWxlLFxuICAgICAgICBzdHlsZSA6IHRoaXMuX29wdGlvbnMuc3R5bGUsXG4gICAgICAgIHVuaXRzIDogdGhpcy5fb3B0aW9ucy51bml0c1xuICAgIH07XG59O1xuXG5SZWxhdGl2ZUZvcm1hdC5wcm90b3R5cGUuX2NvbXBpbGVNZXNzYWdlID0gZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgLy8gYHRoaXMuX2xvY2FsZXNgIGlzIHRoZSBvcmlnaW5hbCBzZXQgb2YgbG9jYWxlcyB0aGUgdXNlciBzcGVjaWZpZWQgdG8gdGhlXG4gICAgLy8gY29uc3RydWN0b3IsIHdoaWxlIGB0aGlzLl9sb2NhbGVgIGlzIHRoZSByZXNvbHZlZCByb290IGxvY2FsZS5cbiAgICB2YXIgbG9jYWxlcyAgICAgICAgPSB0aGlzLl9sb2NhbGVzO1xuICAgIHZhciByZXNvbHZlZExvY2FsZSA9IHRoaXMuX2xvY2FsZTtcblxuICAgIHZhciBmaWVsZCAgICAgICAgPSB0aGlzLl9maWVsZHNbdW5pdHNdO1xuICAgIHZhciByZWxhdGl2ZVRpbWUgPSBmaWVsZC5yZWxhdGl2ZVRpbWU7XG4gICAgdmFyIGZ1dHVyZSAgICAgICA9ICcnO1xuICAgIHZhciBwYXN0ICAgICAgICAgPSAnJztcbiAgICB2YXIgaTtcblxuICAgIGZvciAoaSBpbiByZWxhdGl2ZVRpbWUuZnV0dXJlKSB7XG4gICAgICAgIGlmIChyZWxhdGl2ZVRpbWUuZnV0dXJlLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICBmdXR1cmUgKz0gJyAnICsgaSArICcgeycgK1xuICAgICAgICAgICAgICAgIHJlbGF0aXZlVGltZS5mdXR1cmVbaV0ucmVwbGFjZSgnezB9JywgJyMnKSArICd9JztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoaSBpbiByZWxhdGl2ZVRpbWUucGFzdCkge1xuICAgICAgICBpZiAocmVsYXRpdmVUaW1lLnBhc3QuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgIHBhc3QgKz0gJyAnICsgaSArICcgeycgK1xuICAgICAgICAgICAgICAgIHJlbGF0aXZlVGltZS5wYXN0W2ldLnJlcGxhY2UoJ3swfScsICcjJykgKyAnfSc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbWVzc2FnZSA9ICd7d2hlbiwgc2VsZWN0LCBmdXR1cmUge3swLCBwbHVyYWwsICcgKyBmdXR1cmUgKyAnfX0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwYXN0IHt7MCwgcGx1cmFsLCAnICsgcGFzdCArICd9fX0nO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSBzeW50aGV0aWMgSW50bE1lc3NhZ2VGb3JtYXQgaW5zdGFuY2UgdXNpbmcgdGhlIG9yaWdpbmFsXG4gICAgLy8gbG9jYWxlcyB2YWx1ZSBzcGVjaWZpZWQgYnkgdGhlIHVzZXIgd2hlbiBjb25zdHJ1Y3RpbmcgdGhlIHRoZSBwYXJlbnRcbiAgICAvLyBJbnRsUmVsYXRpdmVGb3JtYXQgaW5zdGFuY2UuXG4gICAgcmV0dXJuIG5ldyBpbnRsJG1lc3NhZ2Vmb3JtYXQkJFtcImRlZmF1bHRcIl0obWVzc2FnZSwgbG9jYWxlcyk7XG59O1xuXG5SZWxhdGl2ZUZvcm1hdC5wcm90b3R5cGUuX2dldE1lc3NhZ2UgPSBmdW5jdGlvbiAodW5pdHMpIHtcbiAgICB2YXIgbWVzc2FnZXMgPSB0aGlzLl9tZXNzYWdlcztcblxuICAgIC8vIENyZWF0ZSBhIG5ldyBzeW50aGV0aWMgbWVzc2FnZSBiYXNlZCBvbiB0aGUgbG9jYWxlIGRhdGEgZnJvbSBDTERSLlxuICAgIGlmICghbWVzc2FnZXNbdW5pdHNdKSB7XG4gICAgICAgIG1lc3NhZ2VzW3VuaXRzXSA9IHRoaXMuX2NvbXBpbGVNZXNzYWdlKHVuaXRzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVzc2FnZXNbdW5pdHNdO1xufTtcblxuUmVsYXRpdmVGb3JtYXQucHJvdG90eXBlLl9nZXRSZWxhdGl2ZVVuaXRzID0gZnVuY3Rpb24gKGRpZmYsIHVuaXRzKSB7XG4gICAgdmFyIGZpZWxkID0gdGhpcy5fZmllbGRzW3VuaXRzXTtcblxuICAgIGlmIChmaWVsZC5yZWxhdGl2ZSkge1xuICAgICAgICByZXR1cm4gZmllbGQucmVsYXRpdmVbZGlmZl07XG4gICAgfVxufTtcblxuUmVsYXRpdmVGb3JtYXQucHJvdG90eXBlLl9maW5kRmllbGRzID0gZnVuY3Rpb24gKGxvY2FsZSkge1xuICAgIHZhciBsb2NhbGVEYXRhID0gUmVsYXRpdmVGb3JtYXQuX19sb2NhbGVEYXRhX187XG4gICAgdmFyIGRhdGEgICAgICAgPSBsb2NhbGVEYXRhW2xvY2FsZS50b0xvd2VyQ2FzZSgpXTtcblxuICAgIC8vIFRoZSBsb2NhbGUgZGF0YSBpcyBkZS1kdXBsaWNhdGVkLCBzbyB3ZSBoYXZlIHRvIHRyYXZlcnNlIHRoZSBsb2NhbGUnc1xuICAgIC8vIGhpZXJhcmNoeSB1bnRpbCB3ZSBmaW5kIGBmaWVsZHNgIHRvIHJldHVybi5cbiAgICB3aGlsZSAoZGF0YSkge1xuICAgICAgICBpZiAoZGF0YS5maWVsZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLmZpZWxkcztcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGEgPSBkYXRhLnBhcmVudExvY2FsZSAmJiBsb2NhbGVEYXRhW2RhdGEucGFyZW50TG9jYWxlLnRvTG93ZXJDYXNlKCldO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0xvY2FsZSBkYXRhIGFkZGVkIHRvIEludGxSZWxhdGl2ZUZvcm1hdCBpcyBtaXNzaW5nIGBmaWVsZHNgIGZvciA6JyArXG4gICAgICAgIGxvY2FsZVxuICAgICk7XG59O1xuXG5SZWxhdGl2ZUZvcm1hdC5wcm90b3R5cGUuX2Zvcm1hdCA9IGZ1bmN0aW9uIChkYXRlLCBvcHRpb25zKSB7XG4gICAgdmFyIG5vdyA9IG9wdGlvbnMgJiYgb3B0aW9ucy5ub3cgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubm93IDogc3JjJGVzNSQkLmRhdGVOb3coKTtcblxuICAgIGlmIChkYXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZGF0ZSA9IG5vdztcbiAgICB9XG5cbiAgICAvLyBEZXRlcm1pbmUgaWYgdGhlIGBkYXRlYCBhbmQgb3B0aW9uYWwgYG5vd2AgdmFsdWVzIGFyZSB2YWxpZCwgYW5kIHRocm93IGFcbiAgICAvLyBzaW1pbGFyIGVycm9yIHRvIHdoYXQgYEludGwuRGF0ZVRpbWVGb3JtYXQjZm9ybWF0KClgIHdvdWxkIHRocm93LlxuICAgIGlmICghaXNGaW5pdGUobm93KSkge1xuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgICAgICdUaGUgYG5vd2Agb3B0aW9uIHByb3ZpZGVkIHRvIEludGxSZWxhdGl2ZUZvcm1hdCNmb3JtYXQoKSBpcyBub3QgJyArXG4gICAgICAgICAgICAnaW4gdmFsaWQgcmFuZ2UuJ1xuICAgICAgICApO1xuICAgIH1cblxuICAgIGlmICghaXNGaW5pdGUoZGF0ZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXG4gICAgICAgICAgICAnVGhlIGRhdGUgdmFsdWUgcHJvdmlkZWQgdG8gSW50bFJlbGF0aXZlRm9ybWF0I2Zvcm1hdCgpIGlzIG5vdCAnICtcbiAgICAgICAgICAgICdpbiB2YWxpZCByYW5nZS4nXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgdmFyIGRpZmZSZXBvcnQgID0gc3JjJGRpZmYkJFtcImRlZmF1bHRcIl0obm93LCBkYXRlKTtcbiAgICB2YXIgdW5pdHMgICAgICAgPSB0aGlzLl9vcHRpb25zLnVuaXRzIHx8IHRoaXMuX3NlbGVjdFVuaXRzKGRpZmZSZXBvcnQpO1xuICAgIHZhciBkaWZmSW5Vbml0cyA9IGRpZmZSZXBvcnRbdW5pdHNdO1xuXG4gICAgaWYgKHRoaXMuX29wdGlvbnMuc3R5bGUgIT09ICdudW1lcmljJykge1xuICAgICAgICB2YXIgcmVsYXRpdmVVbml0cyA9IHRoaXMuX2dldFJlbGF0aXZlVW5pdHMoZGlmZkluVW5pdHMsIHVuaXRzKTtcbiAgICAgICAgaWYgKHJlbGF0aXZlVW5pdHMpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGl2ZVVuaXRzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2dldE1lc3NhZ2UodW5pdHMpLmZvcm1hdCh7XG4gICAgICAgICcwJyA6IE1hdGguYWJzKGRpZmZJblVuaXRzKSxcbiAgICAgICAgd2hlbjogZGlmZkluVW5pdHMgPCAwID8gJ3Bhc3QnIDogJ2Z1dHVyZSdcbiAgICB9KTtcbn07XG5cblJlbGF0aXZlRm9ybWF0LnByb3RvdHlwZS5faXNWYWxpZFVuaXRzID0gZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgaWYgKCF1bml0cyB8fCBzcmMkZXM1JCQuYXJySW5kZXhPZi5jYWxsKEZJRUxEUywgdW5pdHMpID49IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB1bml0cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFyIHN1Z2dlc3Rpb24gPSAvcyQvLnRlc3QodW5pdHMpICYmIHVuaXRzLnN1YnN0cigwLCB1bml0cy5sZW5ndGggLSAxKTtcbiAgICAgICAgaWYgKHN1Z2dlc3Rpb24gJiYgc3JjJGVzNSQkLmFyckluZGV4T2YuY2FsbChGSUVMRFMsIHN1Z2dlc3Rpb24pID49IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAnXCInICsgdW5pdHMgKyAnXCIgaXMgbm90IGEgdmFsaWQgSW50bFJlbGF0aXZlRm9ybWF0IGB1bml0c2AgJyArXG4gICAgICAgICAgICAgICAgJ3ZhbHVlLCBkaWQgeW91IG1lYW46ICcgKyBzdWdnZXN0aW9uXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnXCInICsgdW5pdHMgKyAnXCIgaXMgbm90IGEgdmFsaWQgSW50bFJlbGF0aXZlRm9ybWF0IGB1bml0c2AgdmFsdWUsIGl0ICcgK1xuICAgICAgICAnbXVzdCBiZSBvbmUgb2Y6IFwiJyArIEZJRUxEUy5qb2luKCdcIiwgXCInKSArICdcIidcbiAgICApO1xufTtcblxuUmVsYXRpdmVGb3JtYXQucHJvdG90eXBlLl9yZXNvbHZlTG9jYWxlID0gZnVuY3Rpb24gKGxvY2FsZXMpIHtcbiAgICBpZiAodHlwZW9mIGxvY2FsZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGxvY2FsZXMgPSBbbG9jYWxlc107XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIGEgY29weSBvZiB0aGUgYXJyYXkgc28gd2UgY2FuIHB1c2ggb24gdGhlIGRlZmF1bHQgbG9jYWxlLlxuICAgIGxvY2FsZXMgPSAobG9jYWxlcyB8fCBbXSkuY29uY2F0KFJlbGF0aXZlRm9ybWF0LmRlZmF1bHRMb2NhbGUpO1xuXG4gICAgdmFyIGxvY2FsZURhdGEgPSBSZWxhdGl2ZUZvcm1hdC5fX2xvY2FsZURhdGFfXztcbiAgICB2YXIgaSwgbGVuLCBsb2NhbGVQYXJ0cywgZGF0YTtcblxuICAgIC8vIFVzaW5nIHRoZSBzZXQgb2YgbG9jYWxlcyArIHRoZSBkZWZhdWx0IGxvY2FsZSwgd2UgbG9vayBmb3IgdGhlIGZpcnN0IG9uZVxuICAgIC8vIHdoaWNoIHRoYXQgaGFzIGJlZW4gcmVnaXN0ZXJlZC4gV2hlbiBkYXRhIGRvZXMgbm90IGV4aXN0IGZvciBhIGxvY2FsZSwgd2VcbiAgICAvLyB0cmF2ZXJzZSBpdHMgYW5jZXN0b3JzIHRvIGZpbmQgc29tZXRoaW5nIHRoYXQncyBiZWVuIHJlZ2lzdGVyZWQgd2l0aGluXG4gICAgLy8gaXRzIGhpZXJhcmNoeSBvZiBsb2NhbGVzLiBTaW5jZSB3ZSBsYWNrIHRoZSBwcm9wZXIgYHBhcmVudExvY2FsZWAgZGF0YVxuICAgIC8vIGhlcmUsIHdlIG11c3QgdGFrZSBhIG5haXZlIGFwcHJvYWNoIHRvIHRyYXZlcnNhbC5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBsb2NhbGVzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgIGxvY2FsZVBhcnRzID0gbG9jYWxlc1tpXS50b0xvd2VyQ2FzZSgpLnNwbGl0KCctJyk7XG5cbiAgICAgICAgd2hpbGUgKGxvY2FsZVBhcnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgZGF0YSA9IGxvY2FsZURhdGFbbG9jYWxlUGFydHMuam9pbignLScpXTtcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gUmV0dXJuIHRoZSBub3JtYWxpemVkIGxvY2FsZSBzdHJpbmc7IGUuZy4sIHdlIHJldHVybiBcImVuLVVTXCIsXG4gICAgICAgICAgICAgICAgLy8gaW5zdGVhZCBvZiBcImVuLXVzXCIuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEubG9jYWxlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsb2NhbGVQYXJ0cy5wb3AoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlID0gbG9jYWxlcy5wb3AoKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdObyBsb2NhbGUgZGF0YSBoYXMgYmVlbiBhZGRlZCB0byBJbnRsUmVsYXRpdmVGb3JtYXQgZm9yOiAnICtcbiAgICAgICAgbG9jYWxlcy5qb2luKCcsICcpICsgJywgb3IgdGhlIGRlZmF1bHQgbG9jYWxlOiAnICsgZGVmYXVsdExvY2FsZVxuICAgICk7XG59O1xuXG5SZWxhdGl2ZUZvcm1hdC5wcm90b3R5cGUuX3Jlc29sdmVTdHlsZSA9IGZ1bmN0aW9uIChzdHlsZSkge1xuICAgIC8vIERlZmF1bHQgdG8gXCJiZXN0IGZpdFwiIHN0eWxlLlxuICAgIGlmICghc3R5bGUpIHtcbiAgICAgICAgcmV0dXJuIFNUWUxFU1swXTtcbiAgICB9XG5cbiAgICBpZiAoc3JjJGVzNSQkLmFyckluZGV4T2YuY2FsbChTVFlMRVMsIHN0eWxlKSA+PSAwKSB7XG4gICAgICAgIHJldHVybiBzdHlsZTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdcIicgKyBzdHlsZSArICdcIiBpcyBub3QgYSB2YWxpZCBJbnRsUmVsYXRpdmVGb3JtYXQgYHN0eWxlYCB2YWx1ZSwgaXQgJyArXG4gICAgICAgICdtdXN0IGJlIG9uZSBvZjogXCInICsgU1RZTEVTLmpvaW4oJ1wiLCBcIicpICsgJ1wiJ1xuICAgICk7XG59O1xuXG5SZWxhdGl2ZUZvcm1hdC5wcm90b3R5cGUuX3NlbGVjdFVuaXRzID0gZnVuY3Rpb24gKGRpZmZSZXBvcnQpIHtcbiAgICB2YXIgaSwgbCwgdW5pdHM7XG5cbiAgICBmb3IgKGkgPSAwLCBsID0gRklFTERTLmxlbmd0aDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICB1bml0cyA9IEZJRUxEU1tpXTtcblxuICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlJlcG9ydFt1bml0c10pIDwgUmVsYXRpdmVGb3JtYXQudGhyZXNob2xkc1t1bml0c10pIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuaXRzO1xufTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29yZS5qcy5tYXAiLCIvKlxuQ29weXJpZ2h0IChjKSAyMDE0LCBZYWhvbyEgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuQ29weXJpZ2h0cyBsaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBMaWNlbnNlLlxuU2VlIHRoZSBhY2NvbXBhbnlpbmcgTElDRU5TRSBmaWxlIGZvciB0ZXJtcy5cbiovXG5cbi8qIGpzbGludCBlc25leHQ6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciByb3VuZCA9IE1hdGgucm91bmQ7XG5cbmZ1bmN0aW9uIGRheXNUb1llYXJzKGRheXMpIHtcbiAgICAvLyA0MDAgeWVhcnMgaGF2ZSAxNDYwOTcgZGF5cyAodGFraW5nIGludG8gYWNjb3VudCBsZWFwIHllYXIgcnVsZXMpXG4gICAgcmV0dXJuIGRheXMgKiA0MDAgLyAxNDYwOTc7XG59XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gICAgLy8gQ29udmVydCB0byBtcyB0aW1lc3RhbXBzLlxuICAgIGZyb20gPSArZnJvbTtcbiAgICB0byAgID0gK3RvO1xuXG4gICAgdmFyIG1pbGxpc2Vjb25kID0gcm91bmQodG8gLSBmcm9tKSxcbiAgICAgICAgc2Vjb25kICAgICAgPSByb3VuZChtaWxsaXNlY29uZCAvIDEwMDApLFxuICAgICAgICBtaW51dGUgICAgICA9IHJvdW5kKHNlY29uZCAvIDYwKSxcbiAgICAgICAgaG91ciAgICAgICAgPSByb3VuZChtaW51dGUgLyA2MCksXG4gICAgICAgIGRheSAgICAgICAgID0gcm91bmQoaG91ciAvIDI0KSxcbiAgICAgICAgd2VlayAgICAgICAgPSByb3VuZChkYXkgLyA3KTtcblxuICAgIHZhciByYXdZZWFycyA9IGRheXNUb1llYXJzKGRheSksXG4gICAgICAgIG1vbnRoICAgID0gcm91bmQocmF3WWVhcnMgKiAxMiksXG4gICAgICAgIHllYXIgICAgID0gcm91bmQocmF3WWVhcnMpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbWlsbGlzZWNvbmQ6IG1pbGxpc2Vjb25kLFxuICAgICAgICBzZWNvbmQgICAgIDogc2Vjb25kLFxuICAgICAgICBtaW51dGUgICAgIDogbWludXRlLFxuICAgICAgICBob3VyICAgICAgIDogaG91cixcbiAgICAgICAgZGF5ICAgICAgICA6IGRheSxcbiAgICAgICAgd2VlayAgICAgICA6IHdlZWssXG4gICAgICAgIG1vbnRoICAgICAgOiBtb250aCxcbiAgICAgICAgeWVhciAgICAgICA6IHllYXJcbiAgICB9O1xufTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGlmZi5qcy5tYXAiLCIvLyBHRU5FUkFURUQgRklMRVxuXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHtcImxvY2FsZVwiOlwiZW5cIixcInBsdXJhbFJ1bGVGdW5jdGlvblwiOmZ1bmN0aW9uIChuLG9yZCl7dmFyIHM9U3RyaW5nKG4pLnNwbGl0KFwiLlwiKSx2MD0hc1sxXSx0MD1OdW1iZXIoc1swXSk9PW4sbjEwPXQwJiZzWzBdLnNsaWNlKC0xKSxuMTAwPXQwJiZzWzBdLnNsaWNlKC0yKTtpZihvcmQpcmV0dXJuIG4xMD09MSYmbjEwMCE9MTE/XCJvbmVcIjpuMTA9PTImJm4xMDAhPTEyP1widHdvXCI6bjEwPT0zJiZuMTAwIT0xMz9cImZld1wiOlwib3RoZXJcIjtyZXR1cm4gbj09MSYmdjA/XCJvbmVcIjpcIm90aGVyXCJ9LFwiZmllbGRzXCI6e1wieWVhclwiOntcImRpc3BsYXlOYW1lXCI6XCJ5ZWFyXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcInRoaXMgeWVhclwiLFwiMVwiOlwibmV4dCB5ZWFyXCIsXCItMVwiOlwibGFzdCB5ZWFyXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJpbiB7MH0geWVhclwiLFwib3RoZXJcIjpcImluIHswfSB5ZWFyc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcInswfSB5ZWFyIGFnb1wiLFwib3RoZXJcIjpcInswfSB5ZWFycyBhZ29cIn19fSxcIm1vbnRoXCI6e1wiZGlzcGxheU5hbWVcIjpcIm1vbnRoXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcInRoaXMgbW9udGhcIixcIjFcIjpcIm5leHQgbW9udGhcIixcIi0xXCI6XCJsYXN0IG1vbnRoXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJpbiB7MH0gbW9udGhcIixcIm90aGVyXCI6XCJpbiB7MH0gbW9udGhzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiezB9IG1vbnRoIGFnb1wiLFwib3RoZXJcIjpcInswfSBtb250aHMgYWdvXCJ9fX0sXCJkYXlcIjp7XCJkaXNwbGF5TmFtZVwiOlwiZGF5XCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcInRvZGF5XCIsXCIxXCI6XCJ0b21vcnJvd1wiLFwiLTFcIjpcInllc3RlcmRheVwifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiaW4gezB9IGRheVwiLFwib3RoZXJcIjpcImluIHswfSBkYXlzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiezB9IGRheSBhZ29cIixcIm90aGVyXCI6XCJ7MH0gZGF5cyBhZ29cIn19fSxcImhvdXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiaG91clwiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJpbiB7MH0gaG91clwiLFwib3RoZXJcIjpcImluIHswfSBob3Vyc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcInswfSBob3VyIGFnb1wiLFwib3RoZXJcIjpcInswfSBob3VycyBhZ29cIn19fSxcIm1pbnV0ZVwiOntcImRpc3BsYXlOYW1lXCI6XCJtaW51dGVcIixcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiaW4gezB9IG1pbnV0ZVwiLFwib3RoZXJcIjpcImluIHswfSBtaW51dGVzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiezB9IG1pbnV0ZSBhZ29cIixcIm90aGVyXCI6XCJ7MH0gbWludXRlcyBhZ29cIn19fSxcInNlY29uZFwiOntcImRpc3BsYXlOYW1lXCI6XCJzZWNvbmRcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwibm93XCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJpbiB7MH0gc2Vjb25kXCIsXCJvdGhlclwiOlwiaW4gezB9IHNlY29uZHNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJ7MH0gc2Vjb25kIGFnb1wiLFwib3RoZXJcIjpcInswfSBzZWNvbmRzIGFnb1wifX19fX07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVuLmpzLm1hcCIsIi8qXG5Db3B5cmlnaHQgKGMpIDIwMTQsIFlhaG9vISBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5Db3B5cmlnaHRzIGxpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIExpY2Vuc2UuXG5TZWUgdGhlIGFjY29tcGFueWluZyBMSUNFTlNFIGZpbGUgZm9yIHRlcm1zLlxuKi9cblxuLyoganNsaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gUHVycG9zZWx5IHVzaW5nIHRoZSBzYW1lIGltcGxlbWVudGF0aW9uIGFzIHRoZSBJbnRsLmpzIGBJbnRsYCBwb2x5ZmlsbC5cbi8vIENvcHlyaWdodCAyMDEzIEFuZHkgRWFybnNoYXcsIE1JVCBMaWNlbnNlXG5cbnZhciBob3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxudmFyIHJlYWxEZWZpbmVQcm9wID0gKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkgeyByZXR1cm4gISFPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge30pOyB9XG4gICAgY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9XG59KSgpO1xuXG52YXIgZXMzID0gIXJlYWxEZWZpbmVQcm9wICYmICFPYmplY3QucHJvdG90eXBlLl9fZGVmaW5lR2V0dGVyX187XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IHJlYWxEZWZpbmVQcm9wID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDpcbiAgICAgICAgZnVuY3Rpb24gKG9iaiwgbmFtZSwgZGVzYykge1xuXG4gICAgaWYgKCdnZXQnIGluIGRlc2MgJiYgb2JqLl9fZGVmaW5lR2V0dGVyX18pIHtcbiAgICAgICAgb2JqLl9fZGVmaW5lR2V0dGVyX18obmFtZSwgZGVzYy5nZXQpO1xuICAgIH0gZWxzZSBpZiAoIWhvcC5jYWxsKG9iaiwgbmFtZSkgfHwgJ3ZhbHVlJyBpbiBkZXNjKSB7XG4gICAgICAgIG9ialtuYW1lXSA9IGRlc2MudmFsdWU7XG4gICAgfVxufTtcblxudmFyIG9iakNyZWF0ZSA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gKHByb3RvLCBwcm9wcykge1xuICAgIHZhciBvYmosIGs7XG5cbiAgICBmdW5jdGlvbiBGKCkge31cbiAgICBGLnByb3RvdHlwZSA9IHByb3RvO1xuICAgIG9iaiA9IG5ldyBGKCk7XG5cbiAgICBmb3IgKGsgaW4gcHJvcHMpIHtcbiAgICAgICAgaWYgKGhvcC5jYWxsKHByb3BzLCBrKSkge1xuICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkob2JqLCBrLCBwcm9wc1trXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxudmFyIGFyckluZGV4T2YgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiB8fCBmdW5jdGlvbiAoc2VhcmNoLCBmcm9tSW5kZXgpIHtcbiAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgIHZhciBhcnIgPSB0aGlzO1xuICAgIGlmICghYXJyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IGZyb21JbmRleCB8fCAwLCBtYXggPSBhcnIubGVuZ3RoOyBpIDwgbWF4OyBpKyspIHtcbiAgICAgICAgaWYgKGFycltpXSA9PT0gc2VhcmNoKSB7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbnZhciBkYXRlTm93ID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbn07XG5leHBvcnRzLmRlZmluZVByb3BlcnR5ID0gZGVmaW5lUHJvcGVydHksIGV4cG9ydHMub2JqQ3JlYXRlID0gb2JqQ3JlYXRlLCBleHBvcnRzLmFyckluZGV4T2YgPSBhcnJJbmRleE9mLCBleHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5LCBleHBvcnRzLmRhdGVOb3cgPSBkYXRlTm93O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1lczUuanMubWFwIiwiLy8gRXhwb3NlIGBJbnRsUG9seWZpbGxgIGFzIGdsb2JhbCB0byBhZGQgbG9jYWxlIGRhdGEgaW50byBydW50aW1lIGxhdGVyIG9uLlxuZ2xvYmFsLkludGxQb2x5ZmlsbCA9IHJlcXVpcmUoJy4vbGliL2NvcmUuanMnKTtcblxuLy8gUmVxdWlyZSBhbGwgbG9jYWxlIGRhdGEgZm9yIGBJbnRsYC4gVGhpcyBtb2R1bGUgd2lsbCBiZVxuLy8gaWdub3JlZCB3aGVuIGJ1bmRsaW5nIGZvciB0aGUgYnJvd3NlciB3aXRoIEJyb3dzZXJpZnkvV2VicGFjay5cbnJlcXVpcmUoJy4vbG9jYWxlLWRhdGEvY29tcGxldGUuanMnKTtcblxuLy8gaGFjayB0byBleHBvcnQgdGhlIHBvbHlmaWxsIGFzIGdsb2JhbCBJbnRsIGlmIG5lZWRlZFxuaWYgKCFnbG9iYWwuSW50bCkge1xuICAgIGdsb2JhbC5JbnRsID0gZ2xvYmFsLkludGxQb2x5ZmlsbDtcbiAgICBnbG9iYWwuSW50bFBvbHlmaWxsLl9fYXBwbHlMb2NhbGVTZW5zaXRpdmVQcm90b3R5cGVzKCk7XG59XG5cbi8vIHByb3ZpZGluZyBhbiBpZGlvbWF0aWMgYXBpIGZvciB0aGUgbm9kZWpzIHZlcnNpb24gb2YgdGhpcyBtb2R1bGVcbm1vZHVsZS5leHBvcnRzID0gZ2xvYmFsLkludGxQb2x5ZmlsbDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhYmVsSGVscGVycyA9IHt9O1xuYmFiZWxIZWxwZXJzLnR5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iajtcbn0gOiBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG59O1xuYmFiZWxIZWxwZXJzO1xuXG52YXIgcmVhbERlZmluZVByb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbnRpbmVsID0ge307XG4gICAgdHJ5IHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNlbnRpbmVsLCAnYScsIHt9KTtcbiAgICAgICAgcmV0dXJuICdhJyBpbiBzZW50aW5lbDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59KCk7XG5cbi8vIE5lZWQgYSB3b3JrYXJvdW5kIGZvciBnZXR0ZXJzIGluIEVTM1xudmFyIGVzMyA9ICFyZWFsRGVmaW5lUHJvcCAmJiAhT2JqZWN0LnByb3RvdHlwZS5fX2RlZmluZUdldHRlcl9fO1xuXG4vLyBXZSB1c2UgdGhpcyBhIGxvdCAoYW5kIG5lZWQgaXQgZm9yIHByb3RvLWxlc3Mgb2JqZWN0cylcbnZhciBob3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4vLyBOYWl2ZSBkZWZpbmVQcm9wZXJ0eSBmb3IgY29tcGF0aWJpbGl0eVxudmFyIGRlZmluZVByb3BlcnR5ID0gcmVhbERlZmluZVByb3AgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiAob2JqLCBuYW1lLCBkZXNjKSB7XG4gICAgaWYgKCdnZXQnIGluIGRlc2MgJiYgb2JqLl9fZGVmaW5lR2V0dGVyX18pIG9iai5fX2RlZmluZUdldHRlcl9fKG5hbWUsIGRlc2MuZ2V0KTtlbHNlIGlmICghaG9wLmNhbGwob2JqLCBuYW1lKSB8fCAndmFsdWUnIGluIGRlc2MpIG9ialtuYW1lXSA9IGRlc2MudmFsdWU7XG59O1xuXG4vLyBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiwgYXMgZ29vZCBhcyB3ZSBuZWVkIGl0IHRvIGJlXG52YXIgYXJySW5kZXhPZiA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mIHx8IGZ1bmN0aW9uIChzZWFyY2gpIHtcbiAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgIHZhciB0ID0gdGhpcztcbiAgICBpZiAoIXQubGVuZ3RoKSByZXR1cm4gLTE7XG5cbiAgICBmb3IgKHZhciBpID0gYXJndW1lbnRzWzFdIHx8IDAsIG1heCA9IHQubGVuZ3RoOyBpIDwgbWF4OyBpKyspIHtcbiAgICAgICAgaWYgKHRbaV0gPT09IHNlYXJjaCkgcmV0dXJuIGk7XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xufTtcblxuLy8gQ3JlYXRlIGFuIG9iamVjdCB3aXRoIHRoZSBzcGVjaWZpZWQgcHJvdG90eXBlICgybmQgYXJnIHJlcXVpcmVkIGZvciBSZWNvcmQpXG52YXIgb2JqQ3JlYXRlID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiAocHJvdG8sIHByb3BzKSB7XG4gICAgdmFyIG9iaiA9IHZvaWQgMDtcblxuICAgIGZ1bmN0aW9uIEYoKSB7fVxuICAgIEYucHJvdG90eXBlID0gcHJvdG87XG4gICAgb2JqID0gbmV3IEYoKTtcblxuICAgIGZvciAodmFyIGsgaW4gcHJvcHMpIHtcbiAgICAgICAgaWYgKGhvcC5jYWxsKHByb3BzLCBrKSkgZGVmaW5lUHJvcGVydHkob2JqLCBrLCBwcm9wc1trXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn07XG5cbi8vIFNuYXBzaG90IHNvbWUgKGhvcGVmdWxseSBzdGlsbCkgbmF0aXZlIGJ1aWx0LWluc1xudmFyIGFyclNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xudmFyIGFyckNvbmNhdCA9IEFycmF5LnByb3RvdHlwZS5jb25jYXQ7XG52YXIgYXJyUHVzaCA9IEFycmF5LnByb3RvdHlwZS5wdXNoO1xudmFyIGFyckpvaW4gPSBBcnJheS5wcm90b3R5cGUuam9pbjtcbnZhciBhcnJTaGlmdCA9IEFycmF5LnByb3RvdHlwZS5zaGlmdDtcblxuLy8gTmFpdmUgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgZm9yIGNvbXBhdGliaWxpdHlcbnZhciBmbkJpbmQgPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCB8fCBmdW5jdGlvbiAodGhpc09iaikge1xuICAgIHZhciBmbiA9IHRoaXMsXG4gICAgICAgIGFyZ3MgPSBhcnJTbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICAvLyBBbGwgb3VyIChwcmVzZW50bHkpIGJvdW5kIGZ1bmN0aW9ucyBoYXZlIGVpdGhlciAxIG9yIDAgYXJndW1lbnRzLiBCeSByZXR1cm5pbmdcbiAgICAvLyBkaWZmZXJlbnQgZnVuY3Rpb24gc2lnbmF0dXJlcywgd2UgY2FuIHBhc3Mgc29tZSB0ZXN0cyBpbiBFUzMgZW52aXJvbm1lbnRzXG4gICAgaWYgKGZuLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNPYmosIGFyckNvbmNhdC5jYWxsKGFyZ3MsIGFyclNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpc09iaiwgYXJyQ29uY2F0LmNhbGwoYXJncywgYXJyU2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgfTtcbn07XG5cbi8vIE9iamVjdCBob3VzaW5nIGludGVybmFsIHByb3BlcnRpZXMgZm9yIGNvbnN0cnVjdG9yc1xudmFyIGludGVybmFscyA9IG9iakNyZWF0ZShudWxsKTtcblxuLy8gS2VlcCBpbnRlcm5hbCBwcm9wZXJ0aWVzIGludGVybmFsXG52YXIgc2VjcmV0ID0gTWF0aC5yYW5kb20oKTtcblxuLy8gSGVscGVyIGZ1bmN0aW9uc1xuLy8gPT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIEEgZnVuY3Rpb24gdG8gZGVhbCB3aXRoIHRoZSBpbmFjY3VyYWN5IG9mIGNhbGN1bGF0aW5nIGxvZzEwIGluIHByZS1FUzZcbiAqIEphdmFTY3JpcHQgZW52aXJvbm1lbnRzLiBNYXRoLmxvZyhudW0pIC8gTWF0aC5MTjEwIHdhcyByZXNwb25zaWJsZSBmb3JcbiAqIGNhdXNpbmcgaXNzdWUgIzYyLlxuICovXG5mdW5jdGlvbiBsb2cxMEZsb29yKG4pIHtcbiAgICAvLyBFUzYgcHJvdmlkZXMgdGhlIG1vcmUgYWNjdXJhdGUgTWF0aC5sb2cxMFxuICAgIGlmICh0eXBlb2YgTWF0aC5sb2cxMCA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5sb2cxMChuKSk7XG5cbiAgICB2YXIgeCA9IE1hdGgucm91bmQoTWF0aC5sb2cobikgKiBNYXRoLkxPRzEwRSk7XG4gICAgcmV0dXJuIHggLSAoTnVtYmVyKCcxZScgKyB4KSA+IG4pO1xufVxuXG4vKipcbiAqIEEgbWFwIHRoYXQgZG9lc24ndCBjb250YWluIE9iamVjdCBpbiBpdHMgcHJvdG90eXBlIGNoYWluXG4gKi9cbmZ1bmN0aW9uIFJlY29yZChvYmopIHtcbiAgICAvLyBDb3B5IG9ubHkgb3duIHByb3BlcnRpZXMgb3ZlciB1bmxlc3MgdGhpcyBvYmplY3QgaXMgYWxyZWFkeSBhIFJlY29yZCBpbnN0YW5jZVxuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBSZWNvcmQgfHwgaG9wLmNhbGwob2JqLCBrKSkgZGVmaW5lUHJvcGVydHkodGhpcywgaywgeyB2YWx1ZTogb2JqW2tdLCBlbnVtZXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0pO1xuICAgIH1cbn1cblJlY29yZC5wcm90b3R5cGUgPSBvYmpDcmVhdGUobnVsbCk7XG5cbi8qKlxuICogQW4gb3JkZXJlZCBsaXN0XG4gKi9cbmZ1bmN0aW9uIExpc3QoKSB7XG4gICAgZGVmaW5lUHJvcGVydHkodGhpcywgJ2xlbmd0aCcsIHsgd3JpdGFibGU6IHRydWUsIHZhbHVlOiAwIH0pO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIGFyclB1c2guYXBwbHkodGhpcywgYXJyU2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbn1cbkxpc3QucHJvdG90eXBlID0gb2JqQ3JlYXRlKG51bGwpO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gcmVzdG9yZSB0YWludGVkIFJlZ0V4cCBwcm9wZXJ0aWVzXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVJlZ0V4cFJlc3RvcmUoKSB7XG4gICAgdmFyIGVzYyA9IC9bLj8qK14kW1xcXVxcXFwoKXt9fC1dL2csXG4gICAgICAgIGxtID0gUmVnRXhwLmxhc3RNYXRjaCB8fCAnJyxcbiAgICAgICAgbWwgPSBSZWdFeHAubXVsdGlsaW5lID8gJ20nIDogJycsXG4gICAgICAgIHJldCA9IHsgaW5wdXQ6IFJlZ0V4cC5pbnB1dCB9LFxuICAgICAgICByZWcgPSBuZXcgTGlzdCgpLFxuICAgICAgICBoYXMgPSBmYWxzZSxcbiAgICAgICAgY2FwID0ge307XG5cbiAgICAvLyBDcmVhdGUgYSBzbmFwc2hvdCBvZiBhbGwgdGhlICdjYXB0dXJlZCcgcHJvcGVydGllc1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IDk7IGkrKykge1xuICAgICAgICBoYXMgPSAoY2FwWyckJyArIGldID0gUmVnRXhwWyckJyArIGldKSB8fCBoYXM7XG4gICAgfSAvLyBOb3cgd2UndmUgc25hcHNob3R0ZWQgc29tZSBwcm9wZXJ0aWVzLCBlc2NhcGUgdGhlIGxhc3RNYXRjaCBzdHJpbmdcbiAgICBsbSA9IGxtLnJlcGxhY2UoZXNjLCAnXFxcXCQmJyk7XG5cbiAgICAvLyBJZiBhbnkgb2YgdGhlIGNhcHR1cmVkIHN0cmluZ3Mgd2VyZSBub24tZW1wdHksIGl0ZXJhdGUgb3ZlciB0aGVtIGFsbFxuICAgIGlmIChoYXMpIHtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8PSA5OyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgbSA9IGNhcFsnJCcgKyBfaV07XG5cbiAgICAgICAgICAgIC8vIElmIGl0J3MgZW1wdHksIGFkZCBhbiBlbXB0eSBjYXB0dXJpbmcgZ3JvdXBcbiAgICAgICAgICAgIGlmICghbSkgbG0gPSAnKCknICsgbG07XG5cbiAgICAgICAgICAgIC8vIEVsc2UgZmluZCB0aGUgc3RyaW5nIGluIGxtIGFuZCBlc2NhcGUgJiB3cmFwIGl0IHRvIGNhcHR1cmUgaXRcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtID0gbS5yZXBsYWNlKGVzYywgJ1xcXFwkJicpO1xuICAgICAgICAgICAgICAgICAgICBsbSA9IGxtLnJlcGxhY2UobSwgJygnICsgbSArICcpJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBQdXNoIGl0IHRvIHRoZSByZWcgYW5kIGNob3AgbG0gdG8gbWFrZSBzdXJlIGZ1cnRoZXIgZ3JvdXBzIGNvbWUgYWZ0ZXJcbiAgICAgICAgICAgIGFyclB1c2guY2FsbChyZWcsIGxtLnNsaWNlKDAsIGxtLmluZGV4T2YoJygnKSArIDEpKTtcbiAgICAgICAgICAgIGxtID0gbG0uc2xpY2UobG0uaW5kZXhPZignKCcpICsgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0aGF0IHdpbGwgcmVjb25zdHJ1Y3QgdGhlIFJlZ0V4cCBwcm9wZXJ0aWVzXG4gICAgcmV0LmV4cCA9IG5ldyBSZWdFeHAoYXJySm9pbi5jYWxsKHJlZywgJycpICsgbG0sIG1sKTtcblxuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogTWltaWNzIEVTNSdzIGFic3RyYWN0IFRvT2JqZWN0KCkgZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gdG9PYmplY3QoYXJnKSB7XG4gICAgaWYgKGFyZyA9PT0gbnVsbCkgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgbnVsbCBvciB1bmRlZmluZWQgdG8gb2JqZWN0Jyk7XG5cbiAgICByZXR1cm4gT2JqZWN0KGFyZyk7XG59XG5cbi8qKlxuICogUmV0dXJucyBcImludGVybmFsXCIgcHJvcGVydGllcyBmb3IgYW4gb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGdldEludGVybmFsUHJvcGVydGllcyhvYmopIHtcbiAgICBpZiAoaG9wLmNhbGwob2JqLCAnX19nZXRJbnRlcm5hbFByb3BlcnRpZXMnKSkgcmV0dXJuIG9iai5fX2dldEludGVybmFsUHJvcGVydGllcyhzZWNyZXQpO1xuXG4gICAgcmV0dXJuIG9iakNyZWF0ZShudWxsKTtcbn1cblxuLyoqXG4qIERlZmluZXMgcmVndWxhciBleHByZXNzaW9ucyBmb3IgdmFyaW91cyBvcGVyYXRpb25zIHJlbGF0ZWQgdG8gdGhlIEJDUCA0NyBzeW50YXgsXG4qIGFzIGRlZmluZWQgYXQgaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvYmNwNDcjc2VjdGlvbi0yLjFcbiovXG5cbi8vIGV4dGxhbmcgICAgICAgPSAzQUxQSEEgICAgICAgICAgICAgIDsgc2VsZWN0ZWQgSVNPIDYzOSBjb2Rlc1xuLy8gICAgICAgICAgICAgICAgICoyKFwiLVwiIDNBTFBIQSkgICAgICA7IHBlcm1hbmVudGx5IHJlc2VydmVkXG52YXIgZXh0bGFuZyA9ICdbYS16XXszfSg/Oi1bYS16XXszfSl7MCwyfSc7XG5cbi8vIGxhbmd1YWdlICAgICAgPSAyKjNBTFBIQSAgICAgICAgICAgIDsgc2hvcnRlc3QgSVNPIDYzOSBjb2RlXG4vLyAgICAgICAgICAgICAgICAgW1wiLVwiIGV4dGxhbmddICAgICAgIDsgc29tZXRpbWVzIGZvbGxvd2VkIGJ5XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7IGV4dGVuZGVkIGxhbmd1YWdlIHN1YnRhZ3Ncbi8vICAgICAgICAgICAgICAgLyA0QUxQSEEgICAgICAgICAgICAgIDsgb3IgcmVzZXJ2ZWQgZm9yIGZ1dHVyZSB1c2Vcbi8vICAgICAgICAgICAgICAgLyA1KjhBTFBIQSAgICAgICAgICAgIDsgb3IgcmVnaXN0ZXJlZCBsYW5ndWFnZSBzdWJ0YWdcbnZhciBsYW5ndWFnZSA9ICcoPzpbYS16XXsyLDN9KD86LScgKyBleHRsYW5nICsgJyk/fFthLXpdezR9fFthLXpdezUsOH0pJztcblxuLy8gc2NyaXB0ICAgICAgICA9IDRBTFBIQSAgICAgICAgICAgICAgOyBJU08gMTU5MjQgY29kZVxudmFyIHNjcmlwdCA9ICdbYS16XXs0fSc7XG5cbi8vIHJlZ2lvbiAgICAgICAgPSAyQUxQSEEgICAgICAgICAgICAgIDsgSVNPIDMxNjYtMSBjb2RlXG4vLyAgICAgICAgICAgICAgIC8gM0RJR0lUICAgICAgICAgICAgICA7IFVOIE0uNDkgY29kZVxudmFyIHJlZ2lvbiA9ICcoPzpbYS16XXsyfXxcXFxcZHszfSknO1xuXG4vLyB2YXJpYW50ICAgICAgID0gNSo4YWxwaGFudW0gICAgICAgICA7IHJlZ2lzdGVyZWQgdmFyaWFudHNcbi8vICAgICAgICAgICAgICAgLyAoRElHSVQgM2FscGhhbnVtKVxudmFyIHZhcmlhbnQgPSAnKD86W2EtejAtOV17NSw4fXxcXFxcZFthLXowLTldezN9KSc7XG5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDsgU2luZ2xlIGFscGhhbnVtZXJpY3Ncbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDsgXCJ4XCIgcmVzZXJ2ZWQgZm9yIHByaXZhdGUgdXNlXG4vLyBzaW5nbGV0b24gICAgID0gRElHSVQgICAgICAgICAgICAgICA7IDAgLSA5XG4vLyAgICAgICAgICAgICAgIC8gJXg0MS01NyAgICAgICAgICAgICA7IEEgLSBXXG4vLyAgICAgICAgICAgICAgIC8gJXg1OS01QSAgICAgICAgICAgICA7IFkgLSBaXG4vLyAgICAgICAgICAgICAgIC8gJXg2MS03NyAgICAgICAgICAgICA7IGEgLSB3XG4vLyAgICAgICAgICAgICAgIC8gJXg3OS03QSAgICAgICAgICAgICA7IHkgLSB6XG52YXIgc2luZ2xldG9uID0gJ1swLTlhLXd5LXpdJztcblxuLy8gZXh0ZW5zaW9uICAgICA9IHNpbmdsZXRvbiAxKihcIi1cIiAoMio4YWxwaGFudW0pKVxudmFyIGV4dGVuc2lvbiA9IHNpbmdsZXRvbiArICcoPzotW2EtejAtOV17Miw4fSkrJztcblxuLy8gcHJpdmF0ZXVzZSAgICA9IFwieFwiIDEqKFwiLVwiICgxKjhhbHBoYW51bSkpXG52YXIgcHJpdmF0ZXVzZSA9ICd4KD86LVthLXowLTldezEsOH0pKyc7XG5cbi8vIGlycmVndWxhciAgICAgPSBcImVuLUdCLW9lZFwiICAgICAgICAgOyBpcnJlZ3VsYXIgdGFncyBkbyBub3QgbWF0Y2hcbi8vICAgICAgICAgICAgICAgLyBcImktYW1pXCIgICAgICAgICAgICAgOyB0aGUgJ2xhbmd0YWcnIHByb2R1Y3Rpb24gYW5kXG4vLyAgICAgICAgICAgICAgIC8gXCJpLWJublwiICAgICAgICAgICAgIDsgd291bGQgbm90IG90aGVyd2lzZSBiZVxuLy8gICAgICAgICAgICAgICAvIFwiaS1kZWZhdWx0XCIgICAgICAgICA7IGNvbnNpZGVyZWQgJ3dlbGwtZm9ybWVkJ1xuLy8gICAgICAgICAgICAgICAvIFwiaS1lbm9jaGlhblwiICAgICAgICA7IFRoZXNlIHRhZ3MgYXJlIGFsbCB2YWxpZCxcbi8vICAgICAgICAgICAgICAgLyBcImktaGFrXCIgICAgICAgICAgICAgOyBidXQgbW9zdCBhcmUgZGVwcmVjYXRlZFxuLy8gICAgICAgICAgICAgICAvIFwiaS1rbGluZ29uXCIgICAgICAgICA7IGluIGZhdm9yIG9mIG1vcmUgbW9kZXJuXG4vLyAgICAgICAgICAgICAgIC8gXCJpLWx1eFwiICAgICAgICAgICAgIDsgc3VidGFncyBvciBzdWJ0YWdcbi8vICAgICAgICAgICAgICAgLyBcImktbWluZ29cIiAgICAgICAgICAgOyBjb21iaW5hdGlvblxuLy8gICAgICAgICAgICAgICAvIFwiaS1uYXZham9cIlxuLy8gICAgICAgICAgICAgICAvIFwiaS1wd25cIlxuLy8gICAgICAgICAgICAgICAvIFwiaS10YW9cIlxuLy8gICAgICAgICAgICAgICAvIFwiaS10YXlcIlxuLy8gICAgICAgICAgICAgICAvIFwiaS10c3VcIlxuLy8gICAgICAgICAgICAgICAvIFwic2duLUJFLUZSXCJcbi8vICAgICAgICAgICAgICAgLyBcInNnbi1CRS1OTFwiXG4vLyAgICAgICAgICAgICAgIC8gXCJzZ24tQ0gtREVcIlxudmFyIGlycmVndWxhciA9ICcoPzplbi1HQi1vZWQnICsgJ3xpLSg/OmFtaXxibm58ZGVmYXVsdHxlbm9jaGlhbnxoYWt8a2xpbmdvbnxsdXh8bWluZ298bmF2YWpvfHB3bnx0YW98dGF5fHRzdSknICsgJ3xzZ24tKD86QkUtRlJ8QkUtTkx8Q0gtREUpKSc7XG5cbi8vIHJlZ3VsYXIgICAgICAgPSBcImFydC1sb2piYW5cIiAgICAgICAgOyB0aGVzZSB0YWdzIG1hdGNoIHRoZSAnbGFuZ3RhZydcbi8vICAgICAgICAgICAgICAgLyBcImNlbC1nYXVsaXNoXCIgICAgICAgOyBwcm9kdWN0aW9uLCBidXQgdGhlaXIgc3VidGFnc1xuLy8gICAgICAgICAgICAgICAvIFwibm8tYm9rXCIgICAgICAgICAgICA7IGFyZSBub3QgZXh0ZW5kZWQgbGFuZ3VhZ2Vcbi8vICAgICAgICAgICAgICAgLyBcIm5vLW55blwiICAgICAgICAgICAgOyBvciB2YXJpYW50IHN1YnRhZ3M6IHRoZWlyIG1lYW5pbmdcbi8vICAgICAgICAgICAgICAgLyBcInpoLWd1b3l1XCIgICAgICAgICAgOyBpcyBkZWZpbmVkIGJ5IHRoZWlyIHJlZ2lzdHJhdGlvblxuLy8gICAgICAgICAgICAgICAvIFwiemgtaGFra2FcIiAgICAgICAgICA7IGFuZCBhbGwgb2YgdGhlc2UgYXJlIGRlcHJlY2F0ZWRcbi8vICAgICAgICAgICAgICAgLyBcInpoLW1pblwiICAgICAgICAgICAgOyBpbiBmYXZvciBvZiBhIG1vcmUgbW9kZXJuXG4vLyAgICAgICAgICAgICAgIC8gXCJ6aC1taW4tbmFuXCIgICAgICAgIDsgc3VidGFnIG9yIHNlcXVlbmNlIG9mIHN1YnRhZ3Ncbi8vICAgICAgICAgICAgICAgLyBcInpoLXhpYW5nXCJcbnZhciByZWd1bGFyID0gJyg/OmFydC1sb2piYW58Y2VsLWdhdWxpc2h8bm8tYm9rfG5vLW55bicgKyAnfHpoLSg/Omd1b3l1fGhha2thfG1pbnxtaW4tbmFufHhpYW5nKSknO1xuXG4vLyBncmFuZGZhdGhlcmVkID0gaXJyZWd1bGFyICAgICAgICAgICA7IG5vbi1yZWR1bmRhbnQgdGFncyByZWdpc3RlcmVkXG4vLyAgICAgICAgICAgICAgIC8gcmVndWxhciAgICAgICAgICAgICA7IGR1cmluZyB0aGUgUkZDIDMwNjYgZXJhXG52YXIgZ3JhbmRmYXRoZXJlZCA9ICcoPzonICsgaXJyZWd1bGFyICsgJ3wnICsgcmVndWxhciArICcpJztcblxuLy8gbGFuZ3RhZyAgICAgICA9IGxhbmd1YWdlXG4vLyAgICAgICAgICAgICAgICAgW1wiLVwiIHNjcmlwdF1cbi8vICAgICAgICAgICAgICAgICBbXCItXCIgcmVnaW9uXVxuLy8gICAgICAgICAgICAgICAgICooXCItXCIgdmFyaWFudClcbi8vICAgICAgICAgICAgICAgICAqKFwiLVwiIGV4dGVuc2lvbilcbi8vICAgICAgICAgICAgICAgICBbXCItXCIgcHJpdmF0ZXVzZV1cbnZhciBsYW5ndGFnID0gbGFuZ3VhZ2UgKyAnKD86LScgKyBzY3JpcHQgKyAnKT8oPzotJyArIHJlZ2lvbiArICcpPyg/Oi0nICsgdmFyaWFudCArICcpKig/Oi0nICsgZXh0ZW5zaW9uICsgJykqKD86LScgKyBwcml2YXRldXNlICsgJyk/JztcblxuLy8gTGFuZ3VhZ2UtVGFnICA9IGxhbmd0YWcgICAgICAgICAgICAgOyBub3JtYWwgbGFuZ3VhZ2UgdGFnc1xuLy8gICAgICAgICAgICAgICAvIHByaXZhdGV1c2UgICAgICAgICAgOyBwcml2YXRlIHVzZSB0YWdcbi8vICAgICAgICAgICAgICAgLyBncmFuZGZhdGhlcmVkICAgICAgIDsgZ3JhbmRmYXRoZXJlZCB0YWdzXG52YXIgZXhwQkNQNDdTeW50YXggPSBSZWdFeHAoJ14oPzonICsgbGFuZ3RhZyArICd8JyArIHByaXZhdGV1c2UgKyAnfCcgKyBncmFuZGZhdGhlcmVkICsgJykkJywgJ2knKTtcblxuLy8gTWF0Y2ggZHVwbGljYXRlIHZhcmlhbnRzIGluIGEgbGFuZ3VhZ2UgdGFnXG52YXIgZXhwVmFyaWFudER1cGVzID0gUmVnRXhwKCdeKD8heCkuKj8tKCcgKyB2YXJpYW50ICsgJyktKD86XFxcXHd7NCw4fS0oPyF4LSkpKlxcXFwxXFxcXGInLCAnaScpO1xuXG4vLyBNYXRjaCBkdXBsaWNhdGUgc2luZ2xldG9ucyBpbiBhIGxhbmd1YWdlIHRhZyAoZXhjZXB0IGluIHByaXZhdGUgdXNlKVxudmFyIGV4cFNpbmdsZXRvbkR1cGVzID0gUmVnRXhwKCdeKD8heCkuKj8tKCcgKyBzaW5nbGV0b24gKyAnKS0oPzpcXFxcdystKD8heC0pKSpcXFxcMVxcXFxiJywgJ2knKTtcblxuLy8gTWF0Y2ggYWxsIGV4dGVuc2lvbiBzZXF1ZW5jZXNcbnZhciBleHBFeHRTZXF1ZW5jZXMgPSBSZWdFeHAoJy0nICsgZXh0ZW5zaW9uLCAnaWcnKTtcblxuLy8gRGVmYXVsdCBsb2NhbGUgaXMgdGhlIGZpcnN0LWFkZGVkIGxvY2FsZSBkYXRhIGZvciB1c1xudmFyIGRlZmF1bHRMb2NhbGUgPSB2b2lkIDA7XG5mdW5jdGlvbiBzZXREZWZhdWx0TG9jYWxlKGxvY2FsZSkge1xuICAgIGRlZmF1bHRMb2NhbGUgPSBsb2NhbGU7XG59XG5cbi8vIElBTkEgU3VidGFnIFJlZ2lzdHJ5IHJlZHVuZGFudCB0YWcgYW5kIHN1YnRhZyBtYXBzXG52YXIgcmVkdW5kYW50VGFncyA9IHtcbiAgICB0YWdzOiB7XG4gICAgICAgIFwiYXJ0LWxvamJhblwiOiBcImpib1wiLFxuICAgICAgICBcImktYW1pXCI6IFwiYW1pXCIsXG4gICAgICAgIFwiaS1ibm5cIjogXCJibm5cIixcbiAgICAgICAgXCJpLWhha1wiOiBcImhha1wiLFxuICAgICAgICBcImkta2xpbmdvblwiOiBcInRsaFwiLFxuICAgICAgICBcImktbHV4XCI6IFwibGJcIixcbiAgICAgICAgXCJpLW5hdmFqb1wiOiBcIm52XCIsXG4gICAgICAgIFwiaS1wd25cIjogXCJwd25cIixcbiAgICAgICAgXCJpLXRhb1wiOiBcInRhb1wiLFxuICAgICAgICBcImktdGF5XCI6IFwidGF5XCIsXG4gICAgICAgIFwiaS10c3VcIjogXCJ0c3VcIixcbiAgICAgICAgXCJuby1ib2tcIjogXCJuYlwiLFxuICAgICAgICBcIm5vLW55blwiOiBcIm5uXCIsXG4gICAgICAgIFwic2duLUJFLUZSXCI6IFwic2ZiXCIsXG4gICAgICAgIFwic2duLUJFLU5MXCI6IFwidmd0XCIsXG4gICAgICAgIFwic2duLUNILURFXCI6IFwic2dnXCIsXG4gICAgICAgIFwiemgtZ3VveXVcIjogXCJjbW5cIixcbiAgICAgICAgXCJ6aC1oYWtrYVwiOiBcImhha1wiLFxuICAgICAgICBcInpoLW1pbi1uYW5cIjogXCJuYW5cIixcbiAgICAgICAgXCJ6aC14aWFuZ1wiOiBcImhzblwiLFxuICAgICAgICBcInNnbi1CUlwiOiBcImJ6c1wiLFxuICAgICAgICBcInNnbi1DT1wiOiBcImNzblwiLFxuICAgICAgICBcInNnbi1ERVwiOiBcImdzZ1wiLFxuICAgICAgICBcInNnbi1ES1wiOiBcImRzbFwiLFxuICAgICAgICBcInNnbi1FU1wiOiBcInNzcFwiLFxuICAgICAgICBcInNnbi1GUlwiOiBcImZzbFwiLFxuICAgICAgICBcInNnbi1HQlwiOiBcImJmaVwiLFxuICAgICAgICBcInNnbi1HUlwiOiBcImdzc1wiLFxuICAgICAgICBcInNnbi1JRVwiOiBcImlzZ1wiLFxuICAgICAgICBcInNnbi1JVFwiOiBcImlzZVwiLFxuICAgICAgICBcInNnbi1KUFwiOiBcImpzbFwiLFxuICAgICAgICBcInNnbi1NWFwiOiBcIm1mc1wiLFxuICAgICAgICBcInNnbi1OSVwiOiBcIm5jc1wiLFxuICAgICAgICBcInNnbi1OTFwiOiBcImRzZVwiLFxuICAgICAgICBcInNnbi1OT1wiOiBcIm5zbFwiLFxuICAgICAgICBcInNnbi1QVFwiOiBcInBzclwiLFxuICAgICAgICBcInNnbi1TRVwiOiBcInN3bFwiLFxuICAgICAgICBcInNnbi1VU1wiOiBcImFzZVwiLFxuICAgICAgICBcInNnbi1aQVwiOiBcInNmc1wiLFxuICAgICAgICBcInpoLWNtblwiOiBcImNtblwiLFxuICAgICAgICBcInpoLWNtbi1IYW5zXCI6IFwiY21uLUhhbnNcIixcbiAgICAgICAgXCJ6aC1jbW4tSGFudFwiOiBcImNtbi1IYW50XCIsXG4gICAgICAgIFwiemgtZ2FuXCI6IFwiZ2FuXCIsXG4gICAgICAgIFwiemgtd3V1XCI6IFwid3V1XCIsXG4gICAgICAgIFwiemgteXVlXCI6IFwieXVlXCJcbiAgICB9LFxuICAgIHN1YnRhZ3M6IHtcbiAgICAgICAgQlU6IFwiTU1cIixcbiAgICAgICAgREQ6IFwiREVcIixcbiAgICAgICAgRlg6IFwiRlJcIixcbiAgICAgICAgVFA6IFwiVExcIixcbiAgICAgICAgWUQ6IFwiWUVcIixcbiAgICAgICAgWlI6IFwiQ0RcIixcbiAgICAgICAgaGVwbG9jOiBcImFsYWxjOTdcIixcbiAgICAgICAgJ2luJzogXCJpZFwiLFxuICAgICAgICBpdzogXCJoZVwiLFxuICAgICAgICBqaTogXCJ5aVwiLFxuICAgICAgICBqdzogXCJqdlwiLFxuICAgICAgICBtbzogXCJyb1wiLFxuICAgICAgICBheXg6IFwibnVuXCIsXG4gICAgICAgIGJqZDogXCJkcmxcIixcbiAgICAgICAgY2NxOiBcInJraVwiLFxuICAgICAgICBjanI6IFwibW9tXCIsXG4gICAgICAgIGNrYTogXCJjbXJcIixcbiAgICAgICAgY21rOiBcInhjaFwiLFxuICAgICAgICBkcmg6IFwia2hrXCIsXG4gICAgICAgIGRydzogXCJwcnNcIixcbiAgICAgICAgZ2F2OiBcImRldlwiLFxuICAgICAgICBocnI6IFwiamFsXCIsXG4gICAgICAgIGliaTogXCJvcGFcIixcbiAgICAgICAga2doOiBcImttbFwiLFxuICAgICAgICBsY3E6IFwicHByXCIsXG4gICAgICAgIG1zdDogXCJtcnlcIixcbiAgICAgICAgbXl0OiBcIm1yeVwiLFxuICAgICAgICBzY2E6IFwiaGxlXCIsXG4gICAgICAgIHRpZTogXCJyYXNcIixcbiAgICAgICAgdGtrOiBcInR3bVwiLFxuICAgICAgICB0bHc6IFwid2VvXCIsXG4gICAgICAgIHRuZjogXCJwcnNcIixcbiAgICAgICAgeWJkOiBcInJraVwiLFxuICAgICAgICB5bWE6IFwibHJyXCJcbiAgICB9LFxuICAgIGV4dExhbmc6IHtcbiAgICAgICAgYWFvOiBbXCJhYW9cIiwgXCJhclwiXSxcbiAgICAgICAgYWJoOiBbXCJhYmhcIiwgXCJhclwiXSxcbiAgICAgICAgYWJ2OiBbXCJhYnZcIiwgXCJhclwiXSxcbiAgICAgICAgYWNtOiBbXCJhY21cIiwgXCJhclwiXSxcbiAgICAgICAgYWNxOiBbXCJhY3FcIiwgXCJhclwiXSxcbiAgICAgICAgYWN3OiBbXCJhY3dcIiwgXCJhclwiXSxcbiAgICAgICAgYWN4OiBbXCJhY3hcIiwgXCJhclwiXSxcbiAgICAgICAgYWN5OiBbXCJhY3lcIiwgXCJhclwiXSxcbiAgICAgICAgYWRmOiBbXCJhZGZcIiwgXCJhclwiXSxcbiAgICAgICAgYWRzOiBbXCJhZHNcIiwgXCJzZ25cIl0sXG4gICAgICAgIGFlYjogW1wiYWViXCIsIFwiYXJcIl0sXG4gICAgICAgIGFlYzogW1wiYWVjXCIsIFwiYXJcIl0sXG4gICAgICAgIGFlZDogW1wiYWVkXCIsIFwic2duXCJdLFxuICAgICAgICBhZW46IFtcImFlblwiLCBcInNnblwiXSxcbiAgICAgICAgYWZiOiBbXCJhZmJcIiwgXCJhclwiXSxcbiAgICAgICAgYWZnOiBbXCJhZmdcIiwgXCJzZ25cIl0sXG4gICAgICAgIGFqcDogW1wiYWpwXCIsIFwiYXJcIl0sXG4gICAgICAgIGFwYzogW1wiYXBjXCIsIFwiYXJcIl0sXG4gICAgICAgIGFwZDogW1wiYXBkXCIsIFwiYXJcIl0sXG4gICAgICAgIGFyYjogW1wiYXJiXCIsIFwiYXJcIl0sXG4gICAgICAgIGFycTogW1wiYXJxXCIsIFwiYXJcIl0sXG4gICAgICAgIGFyczogW1wiYXJzXCIsIFwiYXJcIl0sXG4gICAgICAgIGFyeTogW1wiYXJ5XCIsIFwiYXJcIl0sXG4gICAgICAgIGFyejogW1wiYXJ6XCIsIFwiYXJcIl0sXG4gICAgICAgIGFzZTogW1wiYXNlXCIsIFwic2duXCJdLFxuICAgICAgICBhc2Y6IFtcImFzZlwiLCBcInNnblwiXSxcbiAgICAgICAgYXNwOiBbXCJhc3BcIiwgXCJzZ25cIl0sXG4gICAgICAgIGFzcTogW1wiYXNxXCIsIFwic2duXCJdLFxuICAgICAgICBhc3c6IFtcImFzd1wiLCBcInNnblwiXSxcbiAgICAgICAgYXV6OiBbXCJhdXpcIiwgXCJhclwiXSxcbiAgICAgICAgYXZsOiBbXCJhdmxcIiwgXCJhclwiXSxcbiAgICAgICAgYXloOiBbXCJheWhcIiwgXCJhclwiXSxcbiAgICAgICAgYXlsOiBbXCJheWxcIiwgXCJhclwiXSxcbiAgICAgICAgYXluOiBbXCJheW5cIiwgXCJhclwiXSxcbiAgICAgICAgYXlwOiBbXCJheXBcIiwgXCJhclwiXSxcbiAgICAgICAgYmJ6OiBbXCJiYnpcIiwgXCJhclwiXSxcbiAgICAgICAgYmZpOiBbXCJiZmlcIiwgXCJzZ25cIl0sXG4gICAgICAgIGJmazogW1wiYmZrXCIsIFwic2duXCJdLFxuICAgICAgICBiam46IFtcImJqblwiLCBcIm1zXCJdLFxuICAgICAgICBib2c6IFtcImJvZ1wiLCBcInNnblwiXSxcbiAgICAgICAgYnFuOiBbXCJicW5cIiwgXCJzZ25cIl0sXG4gICAgICAgIGJxeTogW1wiYnF5XCIsIFwic2duXCJdLFxuICAgICAgICBidGo6IFtcImJ0alwiLCBcIm1zXCJdLFxuICAgICAgICBidmU6IFtcImJ2ZVwiLCBcIm1zXCJdLFxuICAgICAgICBidmw6IFtcImJ2bFwiLCBcInNnblwiXSxcbiAgICAgICAgYnZ1OiBbXCJidnVcIiwgXCJtc1wiXSxcbiAgICAgICAgYnpzOiBbXCJienNcIiwgXCJzZ25cIl0sXG4gICAgICAgIGNkbzogW1wiY2RvXCIsIFwiemhcIl0sXG4gICAgICAgIGNkczogW1wiY2RzXCIsIFwic2duXCJdLFxuICAgICAgICBjank6IFtcImNqeVwiLCBcInpoXCJdLFxuICAgICAgICBjbW46IFtcImNtblwiLCBcInpoXCJdLFxuICAgICAgICBjb2E6IFtcImNvYVwiLCBcIm1zXCJdLFxuICAgICAgICBjcHg6IFtcImNweFwiLCBcInpoXCJdLFxuICAgICAgICBjc2M6IFtcImNzY1wiLCBcInNnblwiXSxcbiAgICAgICAgY3NkOiBbXCJjc2RcIiwgXCJzZ25cIl0sXG4gICAgICAgIGNzZTogW1wiY3NlXCIsIFwic2duXCJdLFxuICAgICAgICBjc2Y6IFtcImNzZlwiLCBcInNnblwiXSxcbiAgICAgICAgY3NnOiBbXCJjc2dcIiwgXCJzZ25cIl0sXG4gICAgICAgIGNzbDogW1wiY3NsXCIsIFwic2duXCJdLFxuICAgICAgICBjc246IFtcImNzblwiLCBcInNnblwiXSxcbiAgICAgICAgY3NxOiBbXCJjc3FcIiwgXCJzZ25cIl0sXG4gICAgICAgIGNzcjogW1wiY3NyXCIsIFwic2duXCJdLFxuICAgICAgICBjemg6IFtcImN6aFwiLCBcInpoXCJdLFxuICAgICAgICBjem86IFtcImN6b1wiLCBcInpoXCJdLFxuICAgICAgICBkb3E6IFtcImRvcVwiLCBcInNnblwiXSxcbiAgICAgICAgZHNlOiBbXCJkc2VcIiwgXCJzZ25cIl0sXG4gICAgICAgIGRzbDogW1wiZHNsXCIsIFwic2duXCJdLFxuICAgICAgICBkdXA6IFtcImR1cFwiLCBcIm1zXCJdLFxuICAgICAgICBlY3M6IFtcImVjc1wiLCBcInNnblwiXSxcbiAgICAgICAgZXNsOiBbXCJlc2xcIiwgXCJzZ25cIl0sXG4gICAgICAgIGVzbjogW1wiZXNuXCIsIFwic2duXCJdLFxuICAgICAgICBlc286IFtcImVzb1wiLCBcInNnblwiXSxcbiAgICAgICAgZXRoOiBbXCJldGhcIiwgXCJzZ25cIl0sXG4gICAgICAgIGZjczogW1wiZmNzXCIsIFwic2duXCJdLFxuICAgICAgICBmc2U6IFtcImZzZVwiLCBcInNnblwiXSxcbiAgICAgICAgZnNsOiBbXCJmc2xcIiwgXCJzZ25cIl0sXG4gICAgICAgIGZzczogW1wiZnNzXCIsIFwic2duXCJdLFxuICAgICAgICBnYW46IFtcImdhblwiLCBcInpoXCJdLFxuICAgICAgICBnZHM6IFtcImdkc1wiLCBcInNnblwiXSxcbiAgICAgICAgZ29tOiBbXCJnb21cIiwgXCJrb2tcIl0sXG4gICAgICAgIGdzZTogW1wiZ3NlXCIsIFwic2duXCJdLFxuICAgICAgICBnc2c6IFtcImdzZ1wiLCBcInNnblwiXSxcbiAgICAgICAgZ3NtOiBbXCJnc21cIiwgXCJzZ25cIl0sXG4gICAgICAgIGdzczogW1wiZ3NzXCIsIFwic2duXCJdLFxuICAgICAgICBndXM6IFtcImd1c1wiLCBcInNnblwiXSxcbiAgICAgICAgaGFiOiBbXCJoYWJcIiwgXCJzZ25cIl0sXG4gICAgICAgIGhhZjogW1wiaGFmXCIsIFwic2duXCJdLFxuICAgICAgICBoYWs6IFtcImhha1wiLCBcInpoXCJdLFxuICAgICAgICBoZHM6IFtcImhkc1wiLCBcInNnblwiXSxcbiAgICAgICAgaGppOiBbXCJoamlcIiwgXCJtc1wiXSxcbiAgICAgICAgaGtzOiBbXCJoa3NcIiwgXCJzZ25cIl0sXG4gICAgICAgIGhvczogW1wiaG9zXCIsIFwic2duXCJdLFxuICAgICAgICBocHM6IFtcImhwc1wiLCBcInNnblwiXSxcbiAgICAgICAgaHNoOiBbXCJoc2hcIiwgXCJzZ25cIl0sXG4gICAgICAgIGhzbDogW1wiaHNsXCIsIFwic2duXCJdLFxuICAgICAgICBoc246IFtcImhzblwiLCBcInpoXCJdLFxuICAgICAgICBpY2w6IFtcImljbFwiLCBcInNnblwiXSxcbiAgICAgICAgaWxzOiBbXCJpbHNcIiwgXCJzZ25cIl0sXG4gICAgICAgIGlubDogW1wiaW5sXCIsIFwic2duXCJdLFxuICAgICAgICBpbnM6IFtcImluc1wiLCBcInNnblwiXSxcbiAgICAgICAgaXNlOiBbXCJpc2VcIiwgXCJzZ25cIl0sXG4gICAgICAgIGlzZzogW1wiaXNnXCIsIFwic2duXCJdLFxuICAgICAgICBpc3I6IFtcImlzclwiLCBcInNnblwiXSxcbiAgICAgICAgamFrOiBbXCJqYWtcIiwgXCJtc1wiXSxcbiAgICAgICAgamF4OiBbXCJqYXhcIiwgXCJtc1wiXSxcbiAgICAgICAgamNzOiBbXCJqY3NcIiwgXCJzZ25cIl0sXG4gICAgICAgIGpoczogW1wiamhzXCIsIFwic2duXCJdLFxuICAgICAgICBqbHM6IFtcImpsc1wiLCBcInNnblwiXSxcbiAgICAgICAgam9zOiBbXCJqb3NcIiwgXCJzZ25cIl0sXG4gICAgICAgIGpzbDogW1wianNsXCIsIFwic2duXCJdLFxuICAgICAgICBqdXM6IFtcImp1c1wiLCBcInNnblwiXSxcbiAgICAgICAga2dpOiBbXCJrZ2lcIiwgXCJzZ25cIl0sXG4gICAgICAgIGtubjogW1wia25uXCIsIFwia29rXCJdLFxuICAgICAgICBrdmI6IFtcImt2YlwiLCBcIm1zXCJdLFxuICAgICAgICBrdms6IFtcImt2a1wiLCBcInNnblwiXSxcbiAgICAgICAga3ZyOiBbXCJrdnJcIiwgXCJtc1wiXSxcbiAgICAgICAga3hkOiBbXCJreGRcIiwgXCJtc1wiXSxcbiAgICAgICAgbGJzOiBbXCJsYnNcIiwgXCJzZ25cIl0sXG4gICAgICAgIGxjZTogW1wibGNlXCIsIFwibXNcIl0sXG4gICAgICAgIGxjZjogW1wibGNmXCIsIFwibXNcIl0sXG4gICAgICAgIGxpdzogW1wibGl3XCIsIFwibXNcIl0sXG4gICAgICAgIGxsczogW1wibGxzXCIsIFwic2duXCJdLFxuICAgICAgICBsc2c6IFtcImxzZ1wiLCBcInNnblwiXSxcbiAgICAgICAgbHNsOiBbXCJsc2xcIiwgXCJzZ25cIl0sXG4gICAgICAgIGxzbzogW1wibHNvXCIsIFwic2duXCJdLFxuICAgICAgICBsc3A6IFtcImxzcFwiLCBcInNnblwiXSxcbiAgICAgICAgbHN0OiBbXCJsc3RcIiwgXCJzZ25cIl0sXG4gICAgICAgIGxzeTogW1wibHN5XCIsIFwic2duXCJdLFxuICAgICAgICBsdGc6IFtcImx0Z1wiLCBcImx2XCJdLFxuICAgICAgICBsdnM6IFtcImx2c1wiLCBcImx2XCJdLFxuICAgICAgICBsemg6IFtcImx6aFwiLCBcInpoXCJdLFxuICAgICAgICBtYXg6IFtcIm1heFwiLCBcIm1zXCJdLFxuICAgICAgICBtZGw6IFtcIm1kbFwiLCBcInNnblwiXSxcbiAgICAgICAgbWVvOiBbXCJtZW9cIiwgXCJtc1wiXSxcbiAgICAgICAgbWZhOiBbXCJtZmFcIiwgXCJtc1wiXSxcbiAgICAgICAgbWZiOiBbXCJtZmJcIiwgXCJtc1wiXSxcbiAgICAgICAgbWZzOiBbXCJtZnNcIiwgXCJzZ25cIl0sXG4gICAgICAgIG1pbjogW1wibWluXCIsIFwibXNcIl0sXG4gICAgICAgIG1ucDogW1wibW5wXCIsIFwiemhcIl0sXG4gICAgICAgIG1xZzogW1wibXFnXCIsIFwibXNcIl0sXG4gICAgICAgIG1yZTogW1wibXJlXCIsIFwic2duXCJdLFxuICAgICAgICBtc2Q6IFtcIm1zZFwiLCBcInNnblwiXSxcbiAgICAgICAgbXNpOiBbXCJtc2lcIiwgXCJtc1wiXSxcbiAgICAgICAgbXNyOiBbXCJtc3JcIiwgXCJzZ25cIl0sXG4gICAgICAgIG11aTogW1wibXVpXCIsIFwibXNcIl0sXG4gICAgICAgIG16YzogW1wibXpjXCIsIFwic2duXCJdLFxuICAgICAgICBtemc6IFtcIm16Z1wiLCBcInNnblwiXSxcbiAgICAgICAgbXp5OiBbXCJtenlcIiwgXCJzZ25cIl0sXG4gICAgICAgIG5hbjogW1wibmFuXCIsIFwiemhcIl0sXG4gICAgICAgIG5iczogW1wibmJzXCIsIFwic2duXCJdLFxuICAgICAgICBuY3M6IFtcIm5jc1wiLCBcInNnblwiXSxcbiAgICAgICAgbnNpOiBbXCJuc2lcIiwgXCJzZ25cIl0sXG4gICAgICAgIG5zbDogW1wibnNsXCIsIFwic2duXCJdLFxuICAgICAgICBuc3A6IFtcIm5zcFwiLCBcInNnblwiXSxcbiAgICAgICAgbnNyOiBbXCJuc3JcIiwgXCJzZ25cIl0sXG4gICAgICAgIG56czogW1wibnpzXCIsIFwic2duXCJdLFxuICAgICAgICBva2w6IFtcIm9rbFwiLCBcInNnblwiXSxcbiAgICAgICAgb3JuOiBbXCJvcm5cIiwgXCJtc1wiXSxcbiAgICAgICAgb3JzOiBbXCJvcnNcIiwgXCJtc1wiXSxcbiAgICAgICAgcGVsOiBbXCJwZWxcIiwgXCJtc1wiXSxcbiAgICAgICAgcGdhOiBbXCJwZ2FcIiwgXCJhclwiXSxcbiAgICAgICAgcGtzOiBbXCJwa3NcIiwgXCJzZ25cIl0sXG4gICAgICAgIHBybDogW1wicHJsXCIsIFwic2duXCJdLFxuICAgICAgICBwcno6IFtcInByelwiLCBcInNnblwiXSxcbiAgICAgICAgcHNjOiBbXCJwc2NcIiwgXCJzZ25cIl0sXG4gICAgICAgIHBzZDogW1wicHNkXCIsIFwic2duXCJdLFxuICAgICAgICBwc2U6IFtcInBzZVwiLCBcIm1zXCJdLFxuICAgICAgICBwc2c6IFtcInBzZ1wiLCBcInNnblwiXSxcbiAgICAgICAgcHNsOiBbXCJwc2xcIiwgXCJzZ25cIl0sXG4gICAgICAgIHBzbzogW1wicHNvXCIsIFwic2duXCJdLFxuICAgICAgICBwc3A6IFtcInBzcFwiLCBcInNnblwiXSxcbiAgICAgICAgcHNyOiBbXCJwc3JcIiwgXCJzZ25cIl0sXG4gICAgICAgIHB5czogW1wicHlzXCIsIFwic2duXCJdLFxuICAgICAgICBybXM6IFtcInJtc1wiLCBcInNnblwiXSxcbiAgICAgICAgcnNpOiBbXCJyc2lcIiwgXCJzZ25cIl0sXG4gICAgICAgIHJzbDogW1wicnNsXCIsIFwic2duXCJdLFxuICAgICAgICBzZGw6IFtcInNkbFwiLCBcInNnblwiXSxcbiAgICAgICAgc2ZiOiBbXCJzZmJcIiwgXCJzZ25cIl0sXG4gICAgICAgIHNmczogW1wic2ZzXCIsIFwic2duXCJdLFxuICAgICAgICBzZ2c6IFtcInNnZ1wiLCBcInNnblwiXSxcbiAgICAgICAgc2d4OiBbXCJzZ3hcIiwgXCJzZ25cIl0sXG4gICAgICAgIHNodTogW1wic2h1XCIsIFwiYXJcIl0sXG4gICAgICAgIHNsZjogW1wic2xmXCIsIFwic2duXCJdLFxuICAgICAgICBzbHM6IFtcInNsc1wiLCBcInNnblwiXSxcbiAgICAgICAgc3FrOiBbXCJzcWtcIiwgXCJzZ25cIl0sXG4gICAgICAgIHNxczogW1wic3FzXCIsIFwic2duXCJdLFxuICAgICAgICBzc2g6IFtcInNzaFwiLCBcImFyXCJdLFxuICAgICAgICBzc3A6IFtcInNzcFwiLCBcInNnblwiXSxcbiAgICAgICAgc3NyOiBbXCJzc3JcIiwgXCJzZ25cIl0sXG4gICAgICAgIHN2azogW1wic3ZrXCIsIFwic2duXCJdLFxuICAgICAgICBzd2M6IFtcInN3Y1wiLCBcInN3XCJdLFxuICAgICAgICBzd2g6IFtcInN3aFwiLCBcInN3XCJdLFxuICAgICAgICBzd2w6IFtcInN3bFwiLCBcInNnblwiXSxcbiAgICAgICAgc3l5OiBbXCJzeXlcIiwgXCJzZ25cIl0sXG4gICAgICAgIHRtdzogW1widG13XCIsIFwibXNcIl0sXG4gICAgICAgIHRzZTogW1widHNlXCIsIFwic2duXCJdLFxuICAgICAgICB0c206IFtcInRzbVwiLCBcInNnblwiXSxcbiAgICAgICAgdHNxOiBbXCJ0c3FcIiwgXCJzZ25cIl0sXG4gICAgICAgIHRzczogW1widHNzXCIsIFwic2duXCJdLFxuICAgICAgICB0c3k6IFtcInRzeVwiLCBcInNnblwiXSxcbiAgICAgICAgdHphOiBbXCJ0emFcIiwgXCJzZ25cIl0sXG4gICAgICAgIHVnbjogW1widWduXCIsIFwic2duXCJdLFxuICAgICAgICB1Z3k6IFtcInVneVwiLCBcInNnblwiXSxcbiAgICAgICAgdWtsOiBbXCJ1a2xcIiwgXCJzZ25cIl0sXG4gICAgICAgIHVrczogW1widWtzXCIsIFwic2duXCJdLFxuICAgICAgICB1cms6IFtcInVya1wiLCBcIm1zXCJdLFxuICAgICAgICB1em46IFtcInV6blwiLCBcInV6XCJdLFxuICAgICAgICB1enM6IFtcInV6c1wiLCBcInV6XCJdLFxuICAgICAgICB2Z3Q6IFtcInZndFwiLCBcInNnblwiXSxcbiAgICAgICAgdmtrOiBbXCJ2a2tcIiwgXCJtc1wiXSxcbiAgICAgICAgdmt0OiBbXCJ2a3RcIiwgXCJtc1wiXSxcbiAgICAgICAgdnNpOiBbXCJ2c2lcIiwgXCJzZ25cIl0sXG4gICAgICAgIHZzbDogW1widnNsXCIsIFwic2duXCJdLFxuICAgICAgICB2c3Y6IFtcInZzdlwiLCBcInNnblwiXSxcbiAgICAgICAgd3V1OiBbXCJ3dXVcIiwgXCJ6aFwiXSxcbiAgICAgICAgeGtpOiBbXCJ4a2lcIiwgXCJzZ25cIl0sXG4gICAgICAgIHhtbDogW1wieG1sXCIsIFwic2duXCJdLFxuICAgICAgICB4bW06IFtcInhtbVwiLCBcIm1zXCJdLFxuICAgICAgICB4bXM6IFtcInhtc1wiLCBcInNnblwiXSxcbiAgICAgICAgeWRzOiBbXCJ5ZHNcIiwgXCJzZ25cIl0sXG4gICAgICAgIHlzbDogW1wieXNsXCIsIFwic2duXCJdLFxuICAgICAgICB5dWU6IFtcInl1ZVwiLCBcInpoXCJdLFxuICAgICAgICB6aWI6IFtcInppYlwiLCBcInNnblwiXSxcbiAgICAgICAgemxtOiBbXCJ6bG1cIiwgXCJtc1wiXSxcbiAgICAgICAgem1pOiBbXCJ6bWlcIiwgXCJtc1wiXSxcbiAgICAgICAgenNsOiBbXCJ6c2xcIiwgXCJzZ25cIl0sXG4gICAgICAgIHpzbTogW1wienNtXCIsIFwibXNcIl1cbiAgICB9XG59O1xuXG4vKipcbiAqIENvbnZlcnQgb25seSBhLXogdG8gdXBwZXJjYXNlIGFzIHBlciBzZWN0aW9uIDYuMSBvZiB0aGUgc3BlY1xuICovXG5mdW5jdGlvbiB0b0xhdGluVXBwZXJDYXNlKHN0cikge1xuICAgIHZhciBpID0gc3RyLmxlbmd0aDtcblxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgdmFyIGNoID0gc3RyLmNoYXJBdChpKTtcblxuICAgICAgICBpZiAoY2ggPj0gXCJhXCIgJiYgY2ggPD0gXCJ6XCIpIHN0ciA9IHN0ci5zbGljZSgwLCBpKSArIGNoLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoaSArIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBzdHI7XG59XG5cbi8qKlxuICogVGhlIElzU3RydWN0dXJhbGx5VmFsaWRMYW5ndWFnZVRhZyBhYnN0cmFjdCBvcGVyYXRpb24gdmVyaWZpZXMgdGhhdCB0aGUgbG9jYWxlXG4gKiBhcmd1bWVudCAod2hpY2ggbXVzdCBiZSBhIFN0cmluZyB2YWx1ZSlcbiAqXG4gKiAtIHJlcHJlc2VudHMgYSB3ZWxsLWZvcm1lZCBCQ1AgNDcgbGFuZ3VhZ2UgdGFnIGFzIHNwZWNpZmllZCBpbiBSRkMgNTY0NiBzZWN0aW9uXG4gKiAgIDIuMSwgb3Igc3VjY2Vzc29yLFxuICogLSBkb2VzIG5vdCBpbmNsdWRlIGR1cGxpY2F0ZSB2YXJpYW50IHN1YnRhZ3MsIGFuZFxuICogLSBkb2VzIG5vdCBpbmNsdWRlIGR1cGxpY2F0ZSBzaW5nbGV0b24gc3VidGFncy5cbiAqXG4gKiBUaGUgYWJzdHJhY3Qgb3BlcmF0aW9uIHJldHVybnMgdHJ1ZSBpZiBsb2NhbGUgY2FuIGJlIGdlbmVyYXRlZCBmcm9tIHRoZSBBQk5GXG4gKiBncmFtbWFyIGluIHNlY3Rpb24gMi4xIG9mIHRoZSBSRkMsIHN0YXJ0aW5nIHdpdGggTGFuZ3VhZ2UtVGFnLCBhbmQgZG9lcyBub3RcbiAqIGNvbnRhaW4gZHVwbGljYXRlIHZhcmlhbnQgb3Igc2luZ2xldG9uIHN1YnRhZ3MgKG90aGVyIHRoYW4gYXMgYSBwcml2YXRlIHVzZVxuICogc3VidGFnKS4gSXQgcmV0dXJucyBmYWxzZSBvdGhlcndpc2UuIFRlcm1pbmFsIHZhbHVlIGNoYXJhY3RlcnMgaW4gdGhlIGdyYW1tYXIgYXJlXG4gKiBpbnRlcnByZXRlZCBhcyB0aGUgVW5pY29kZSBlcXVpdmFsZW50cyBvZiB0aGUgQVNDSUkgb2N0ZXQgdmFsdWVzIGdpdmVuLlxuICovXG5mdW5jdGlvbiAvKiA2LjIuMiAqL0lzU3RydWN0dXJhbGx5VmFsaWRMYW5ndWFnZVRhZyhsb2NhbGUpIHtcbiAgICAvLyByZXByZXNlbnRzIGEgd2VsbC1mb3JtZWQgQkNQIDQ3IGxhbmd1YWdlIHRhZyBhcyBzcGVjaWZpZWQgaW4gUkZDIDU2NDZcbiAgICBpZiAoIWV4cEJDUDQ3U3ludGF4LnRlc3QobG9jYWxlKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgLy8gZG9lcyBub3QgaW5jbHVkZSBkdXBsaWNhdGUgdmFyaWFudCBzdWJ0YWdzLCBhbmRcbiAgICBpZiAoZXhwVmFyaWFudER1cGVzLnRlc3QobG9jYWxlKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgLy8gZG9lcyBub3QgaW5jbHVkZSBkdXBsaWNhdGUgc2luZ2xldG9uIHN1YnRhZ3MuXG4gICAgaWYgKGV4cFNpbmdsZXRvbkR1cGVzLnRlc3QobG9jYWxlKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogVGhlIENhbm9uaWNhbGl6ZUxhbmd1YWdlVGFnIGFic3RyYWN0IG9wZXJhdGlvbiByZXR1cm5zIHRoZSBjYW5vbmljYWwgYW5kIGNhc2UtXG4gKiByZWd1bGFyaXplZCBmb3JtIG9mIHRoZSBsb2NhbGUgYXJndW1lbnQgKHdoaWNoIG11c3QgYmUgYSBTdHJpbmcgdmFsdWUgdGhhdCBpc1xuICogYSBzdHJ1Y3R1cmFsbHkgdmFsaWQgQkNQIDQ3IGxhbmd1YWdlIHRhZyBhcyB2ZXJpZmllZCBieSB0aGVcbiAqIElzU3RydWN0dXJhbGx5VmFsaWRMYW5ndWFnZVRhZyBhYnN0cmFjdCBvcGVyYXRpb24pLiBJdCB0YWtlcyB0aGUgc3RlcHNcbiAqIHNwZWNpZmllZCBpbiBSRkMgNTY0NiBzZWN0aW9uIDQuNSwgb3Igc3VjY2Vzc29yLCB0byBicmluZyB0aGUgbGFuZ3VhZ2UgdGFnXG4gKiBpbnRvIGNhbm9uaWNhbCBmb3JtLCBhbmQgdG8gcmVndWxhcml6ZSB0aGUgY2FzZSBvZiB0aGUgc3VidGFncywgYnV0IGRvZXMgbm90XG4gKiB0YWtlIHRoZSBzdGVwcyB0byBicmluZyBhIGxhbmd1YWdlIHRhZyBpbnRvIOKAnGV4dGxhbmcgZm9ybeKAnSBhbmQgdG8gcmVvcmRlclxuICogdmFyaWFudCBzdWJ0YWdzLlxuXG4gKiBUaGUgc3BlY2lmaWNhdGlvbnMgZm9yIGV4dGVuc2lvbnMgdG8gQkNQIDQ3IGxhbmd1YWdlIHRhZ3MsIHN1Y2ggYXMgUkZDIDYwNjcsXG4gKiBtYXkgaW5jbHVkZSBjYW5vbmljYWxpemF0aW9uIHJ1bGVzIGZvciB0aGUgZXh0ZW5zaW9uIHN1YnRhZyBzZXF1ZW5jZXMgdGhleVxuICogZGVmaW5lIHRoYXQgZ28gYmV5b25kIHRoZSBjYW5vbmljYWxpemF0aW9uIHJ1bGVzIG9mIFJGQyA1NjQ2IHNlY3Rpb24gNC41LlxuICogSW1wbGVtZW50YXRpb25zIGFyZSBhbGxvd2VkLCBidXQgbm90IHJlcXVpcmVkLCB0byBhcHBseSB0aGVzZSBhZGRpdGlvbmFsIHJ1bGVzLlxuICovXG5mdW5jdGlvbiAvKiA2LjIuMyAqL0Nhbm9uaWNhbGl6ZUxhbmd1YWdlVGFnKGxvY2FsZSkge1xuICAgIHZhciBtYXRjaCA9IHZvaWQgMCxcbiAgICAgICAgcGFydHMgPSB2b2lkIDA7XG5cbiAgICAvLyBBIGxhbmd1YWdlIHRhZyBpcyBpbiAnY2Fub25pY2FsIGZvcm0nIHdoZW4gdGhlIHRhZyBpcyB3ZWxsLWZvcm1lZFxuICAgIC8vIGFjY29yZGluZyB0byB0aGUgcnVsZXMgaW4gU2VjdGlvbnMgMi4xIGFuZCAyLjJcblxuICAgIC8vIFNlY3Rpb24gMi4xIHNheXMgYWxsIHN1YnRhZ3MgdXNlIGxvd2VyY2FzZS4uLlxuICAgIGxvY2FsZSA9IGxvY2FsZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgLy8gLi4ud2l0aCAyIGV4Y2VwdGlvbnM6ICd0d28tbGV0dGVyIGFuZCBmb3VyLWxldHRlciBzdWJ0YWdzIHRoYXQgbmVpdGhlclxuICAgIC8vIGFwcGVhciBhdCB0aGUgc3RhcnQgb2YgdGhlIHRhZyBub3Igb2NjdXIgYWZ0ZXIgc2luZ2xldG9ucy4gIFN1Y2ggdHdvLWxldHRlclxuICAgIC8vIHN1YnRhZ3MgYXJlIGFsbCB1cHBlcmNhc2UgKGFzIGluIHRoZSB0YWdzIFwiZW4tQ0EteC1jYVwiIG9yIFwic2duLUJFLUZSXCIpIGFuZFxuICAgIC8vIGZvdXItbGV0dGVyIHN1YnRhZ3MgYXJlIHRpdGxlY2FzZSAoYXMgaW4gdGhlIHRhZyBcImF6LUxhdG4teC1sYXRuXCIpLlxuICAgIHBhcnRzID0gbG9jYWxlLnNwbGl0KCctJyk7XG4gICAgZm9yICh2YXIgaSA9IDEsIG1heCA9IHBhcnRzLmxlbmd0aDsgaSA8IG1heDsgaSsrKSB7XG4gICAgICAgIC8vIFR3by1sZXR0ZXIgc3VidGFncyBhcmUgYWxsIHVwcGVyY2FzZVxuICAgICAgICBpZiAocGFydHNbaV0ubGVuZ3RoID09PSAyKSBwYXJ0c1tpXSA9IHBhcnRzW2ldLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgLy8gRm91ci1sZXR0ZXIgc3VidGFncyBhcmUgdGl0bGVjYXNlXG4gICAgICAgIGVsc2UgaWYgKHBhcnRzW2ldLmxlbmd0aCA9PT0gNCkgcGFydHNbaV0gPSBwYXJ0c1tpXS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHBhcnRzW2ldLnNsaWNlKDEpO1xuXG4gICAgICAgICAgICAvLyBJcyBpdCBhIHNpbmdsZXRvbj9cbiAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRzW2ldLmxlbmd0aCA9PT0gMSAmJiBwYXJ0c1tpXSAhPT0gJ3gnKSBicmVhaztcbiAgICB9XG4gICAgbG9jYWxlID0gYXJySm9pbi5jYWxsKHBhcnRzLCAnLScpO1xuXG4gICAgLy8gVGhlIHN0ZXBzIGxhaWQgb3V0IGluIFJGQyA1NjQ2IHNlY3Rpb24gNC41IGFyZSBhcyBmb2xsb3dzOlxuXG4gICAgLy8gMS4gIEV4dGVuc2lvbiBzZXF1ZW5jZXMgYXJlIG9yZGVyZWQgaW50byBjYXNlLWluc2Vuc2l0aXZlIEFTQ0lJIG9yZGVyXG4gICAgLy8gICAgIGJ5IHNpbmdsZXRvbiBzdWJ0YWcuXG4gICAgaWYgKChtYXRjaCA9IGxvY2FsZS5tYXRjaChleHBFeHRTZXF1ZW5jZXMpKSAmJiBtYXRjaC5sZW5ndGggPiAxKSB7XG4gICAgICAgIC8vIFRoZSBidWlsdC1pbiBzb3J0KCkgc29ydHMgYnkgQVNDSUkgb3JkZXIsIHNvIHVzZSB0aGF0XG4gICAgICAgIG1hdGNoLnNvcnQoKTtcblxuICAgICAgICAvLyBSZXBsYWNlIGFsbCBleHRlbnNpb25zIHdpdGggdGhlIGpvaW5lZCwgc29ydGVkIGFycmF5XG4gICAgICAgIGxvY2FsZSA9IGxvY2FsZS5yZXBsYWNlKFJlZ0V4cCgnKD86JyArIGV4cEV4dFNlcXVlbmNlcy5zb3VyY2UgKyAnKSsnLCAnaScpLCBhcnJKb2luLmNhbGwobWF0Y2gsICcnKSk7XG4gICAgfVxuXG4gICAgLy8gMi4gIFJlZHVuZGFudCBvciBncmFuZGZhdGhlcmVkIHRhZ3MgYXJlIHJlcGxhY2VkIGJ5IHRoZWlyICdQcmVmZXJyZWQtXG4gICAgLy8gICAgIFZhbHVlJywgaWYgdGhlcmUgaXMgb25lLlxuICAgIGlmIChob3AuY2FsbChyZWR1bmRhbnRUYWdzLnRhZ3MsIGxvY2FsZSkpIGxvY2FsZSA9IHJlZHVuZGFudFRhZ3MudGFnc1tsb2NhbGVdO1xuXG4gICAgLy8gMy4gIFN1YnRhZ3MgYXJlIHJlcGxhY2VkIGJ5IHRoZWlyICdQcmVmZXJyZWQtVmFsdWUnLCBpZiB0aGVyZSBpcyBvbmUuXG4gICAgLy8gICAgIEZvciBleHRsYW5ncywgdGhlIG9yaWdpbmFsIHByaW1hcnkgbGFuZ3VhZ2Ugc3VidGFnIGlzIGFsc29cbiAgICAvLyAgICAgcmVwbGFjZWQgaWYgdGhlcmUgaXMgYSBwcmltYXJ5IGxhbmd1YWdlIHN1YnRhZyBpbiB0aGUgJ1ByZWZlcnJlZC1cbiAgICAvLyAgICAgVmFsdWUnLlxuICAgIHBhcnRzID0gbG9jYWxlLnNwbGl0KCctJyk7XG5cbiAgICBmb3IgKHZhciBfaSA9IDEsIF9tYXggPSBwYXJ0cy5sZW5ndGg7IF9pIDwgX21heDsgX2krKykge1xuICAgICAgICBpZiAoaG9wLmNhbGwocmVkdW5kYW50VGFncy5zdWJ0YWdzLCBwYXJ0c1tfaV0pKSBwYXJ0c1tfaV0gPSByZWR1bmRhbnRUYWdzLnN1YnRhZ3NbcGFydHNbX2ldXTtlbHNlIGlmIChob3AuY2FsbChyZWR1bmRhbnRUYWdzLmV4dExhbmcsIHBhcnRzW19pXSkpIHtcbiAgICAgICAgICAgIHBhcnRzW19pXSA9IHJlZHVuZGFudFRhZ3MuZXh0TGFuZ1twYXJ0c1tfaV1dWzBdO1xuXG4gICAgICAgICAgICAvLyBGb3IgZXh0bGFuZyB0YWdzLCB0aGUgcHJlZml4IG5lZWRzIHRvIGJlIHJlbW92ZWQgaWYgaXQgaXMgcmVkdW5kYW50XG4gICAgICAgICAgICBpZiAoX2kgPT09IDEgJiYgcmVkdW5kYW50VGFncy5leHRMYW5nW3BhcnRzWzFdXVsxXSA9PT0gcGFydHNbMF0pIHtcbiAgICAgICAgICAgICAgICBwYXJ0cyA9IGFyclNsaWNlLmNhbGwocGFydHMsIF9pKyspO1xuICAgICAgICAgICAgICAgIF9tYXggLT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhcnJKb2luLmNhbGwocGFydHMsICctJyk7XG59XG5cbi8qKlxuICogVGhlIERlZmF1bHRMb2NhbGUgYWJzdHJhY3Qgb3BlcmF0aW9uIHJldHVybnMgYSBTdHJpbmcgdmFsdWUgcmVwcmVzZW50aW5nIHRoZVxuICogc3RydWN0dXJhbGx5IHZhbGlkICg2LjIuMikgYW5kIGNhbm9uaWNhbGl6ZWQgKDYuMi4zKSBCQ1AgNDcgbGFuZ3VhZ2UgdGFnIGZvciB0aGVcbiAqIGhvc3QgZW52aXJvbm1lbnTigJlzIGN1cnJlbnQgbG9jYWxlLlxuICovXG5mdW5jdGlvbiAvKiA2LjIuNCAqL0RlZmF1bHRMb2NhbGUoKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRMb2NhbGU7XG59XG5cbi8vIFNlY3QgNi4zIEN1cnJlbmN5IENvZGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG52YXIgZXhwQ3VycmVuY3lDb2RlID0gL15bQS1aXXszfSQvO1xuXG4vKipcbiAqIFRoZSBJc1dlbGxGb3JtZWRDdXJyZW5jeUNvZGUgYWJzdHJhY3Qgb3BlcmF0aW9uIHZlcmlmaWVzIHRoYXQgdGhlIGN1cnJlbmN5IGFyZ3VtZW50XG4gKiAoYWZ0ZXIgY29udmVyc2lvbiB0byBhIFN0cmluZyB2YWx1ZSkgcmVwcmVzZW50cyBhIHdlbGwtZm9ybWVkIDMtbGV0dGVyIElTTyBjdXJyZW5jeVxuICogY29kZS4gVGhlIGZvbGxvd2luZyBzdGVwcyBhcmUgdGFrZW46XG4gKi9cbmZ1bmN0aW9uIC8qIDYuMy4xICovSXNXZWxsRm9ybWVkQ3VycmVuY3lDb2RlKGN1cnJlbmN5KSB7XG4gICAgLy8gMS4gTGV0IGBjYCBiZSBUb1N0cmluZyhjdXJyZW5jeSlcbiAgICB2YXIgYyA9IFN0cmluZyhjdXJyZW5jeSk7XG5cbiAgICAvLyAyLiBMZXQgYG5vcm1hbGl6ZWRgIGJlIHRoZSByZXN1bHQgb2YgbWFwcGluZyBjIHRvIHVwcGVyIGNhc2UgYXMgZGVzY3JpYmVkXG4gICAgLy8gICAgaW4gNi4xLlxuICAgIHZhciBub3JtYWxpemVkID0gdG9MYXRpblVwcGVyQ2FzZShjKTtcblxuICAgIC8vIDMuIElmIHRoZSBzdHJpbmcgbGVuZ3RoIG9mIG5vcm1hbGl6ZWQgaXMgbm90IDMsIHJldHVybiBmYWxzZS5cbiAgICAvLyA0LiBJZiBub3JtYWxpemVkIGNvbnRhaW5zIGFueSBjaGFyYWN0ZXIgdGhhdCBpcyBub3QgaW4gdGhlIHJhbmdlIFwiQVwiIHRvIFwiWlwiXG4gICAgLy8gICAgKFUrMDA0MSB0byBVKzAwNUEpLCByZXR1cm4gZmFsc2UuXG4gICAgaWYgKGV4cEN1cnJlbmN5Q29kZS50ZXN0KG5vcm1hbGl6ZWQpID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgLy8gNS4gUmV0dXJuIHRydWVcbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxudmFyIGV4cFVuaWNvZGVFeFNlcSA9IC8tdSg/Oi1bMC05YS16XXsyLDh9KSsvZ2k7IC8vIFNlZSBgZXh0ZW5zaW9uYCBiZWxvd1xuXG5mdW5jdGlvbiAvKiA5LjIuMSAqL0Nhbm9uaWNhbGl6ZUxvY2FsZUxpc3QobG9jYWxlcykge1xuICAgIC8vIFRoZSBhYnN0cmFjdCBvcGVyYXRpb24gQ2Fub25pY2FsaXplTG9jYWxlTGlzdCB0YWtlcyB0aGUgZm9sbG93aW5nIHN0ZXBzOlxuXG4gICAgLy8gMS4gSWYgbG9jYWxlcyBpcyB1bmRlZmluZWQsIHRoZW4gYS4gUmV0dXJuIGEgbmV3IGVtcHR5IExpc3RcbiAgICBpZiAobG9jYWxlcyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbmV3IExpc3QoKTtcblxuICAgIC8vIDIuIExldCBzZWVuIGJlIGEgbmV3IGVtcHR5IExpc3QuXG4gICAgdmFyIHNlZW4gPSBuZXcgTGlzdCgpO1xuXG4gICAgLy8gMy4gSWYgbG9jYWxlcyBpcyBhIFN0cmluZyB2YWx1ZSwgdGhlblxuICAgIC8vICAgIGEuIExldCBsb2NhbGVzIGJlIGEgbmV3IGFycmF5IGNyZWF0ZWQgYXMgaWYgYnkgdGhlIGV4cHJlc3Npb24gbmV3XG4gICAgLy8gICAgQXJyYXkobG9jYWxlcykgd2hlcmUgQXJyYXkgaXMgdGhlIHN0YW5kYXJkIGJ1aWx0LWluIGNvbnN0cnVjdG9yIHdpdGhcbiAgICAvLyAgICB0aGF0IG5hbWUgYW5kIGxvY2FsZXMgaXMgdGhlIHZhbHVlIG9mIGxvY2FsZXMuXG4gICAgbG9jYWxlcyA9IHR5cGVvZiBsb2NhbGVzID09PSAnc3RyaW5nJyA/IFtsb2NhbGVzXSA6IGxvY2FsZXM7XG5cbiAgICAvLyA0LiBMZXQgTyBiZSBUb09iamVjdChsb2NhbGVzKS5cbiAgICB2YXIgTyA9IHRvT2JqZWN0KGxvY2FsZXMpO1xuXG4gICAgLy8gNS4gTGV0IGxlblZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAvLyAgICBPIHdpdGggdGhlIGFyZ3VtZW50IFwibGVuZ3RoXCIuXG4gICAgLy8gNi4gTGV0IGxlbiBiZSBUb1VpbnQzMihsZW5WYWx1ZSkuXG4gICAgdmFyIGxlbiA9IE8ubGVuZ3RoO1xuXG4gICAgLy8gNy4gTGV0IGsgYmUgMC5cbiAgICB2YXIgayA9IDA7XG5cbiAgICAvLyA4LiBSZXBlYXQsIHdoaWxlIGsgPCBsZW5cbiAgICB3aGlsZSAoayA8IGxlbikge1xuICAgICAgICAvLyBhLiBMZXQgUGsgYmUgVG9TdHJpbmcoaykuXG4gICAgICAgIHZhciBQayA9IFN0cmluZyhrKTtcblxuICAgICAgICAvLyBiLiBMZXQga1ByZXNlbnQgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0hhc1Byb3BlcnR5XV0gaW50ZXJuYWxcbiAgICAgICAgLy8gICAgbWV0aG9kIG9mIE8gd2l0aCBhcmd1bWVudCBQay5cbiAgICAgICAgdmFyIGtQcmVzZW50ID0gUGsgaW4gTztcblxuICAgICAgICAvLyBjLiBJZiBrUHJlc2VudCBpcyB0cnVlLCB0aGVuXG4gICAgICAgIGlmIChrUHJlc2VudCkge1xuICAgICAgICAgICAgLy8gaS4gTGV0IGtWYWx1ZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWxcbiAgICAgICAgICAgIC8vICAgICBtZXRob2Qgb2YgTyB3aXRoIGFyZ3VtZW50IFBrLlxuICAgICAgICAgICAgdmFyIGtWYWx1ZSA9IE9bUGtdO1xuXG4gICAgICAgICAgICAvLyBpaS4gSWYgdGhlIHR5cGUgb2Yga1ZhbHVlIGlzIG5vdCBTdHJpbmcgb3IgT2JqZWN0LCB0aGVuIHRocm93IGFcbiAgICAgICAgICAgIC8vICAgICBUeXBlRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICAgICAgaWYgKGtWYWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2Yga1ZhbHVlICE9PSAnc3RyaW5nJyAmJiAodHlwZW9mIGtWYWx1ZSA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBiYWJlbEhlbHBlcnNbXCJ0eXBlb2ZcIl0oa1ZhbHVlKSkgIT09ICdvYmplY3QnKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdTdHJpbmcgb3IgT2JqZWN0IHR5cGUgZXhwZWN0ZWQnKTtcblxuICAgICAgICAgICAgLy8gaWlpLiBMZXQgdGFnIGJlIFRvU3RyaW5nKGtWYWx1ZSkuXG4gICAgICAgICAgICB2YXIgdGFnID0gU3RyaW5nKGtWYWx1ZSk7XG5cbiAgICAgICAgICAgIC8vIGl2LiBJZiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIGFic3RyYWN0IG9wZXJhdGlvblxuICAgICAgICAgICAgLy8gICAgIElzU3RydWN0dXJhbGx5VmFsaWRMYW5ndWFnZVRhZyAoZGVmaW5lZCBpbiA2LjIuMiksIHBhc3NpbmcgdGFnIGFzXG4gICAgICAgICAgICAvLyAgICAgdGhlIGFyZ3VtZW50LCBpcyBmYWxzZSwgdGhlbiB0aHJvdyBhIFJhbmdlRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICAgICAgaWYgKCFJc1N0cnVjdHVyYWxseVZhbGlkTGFuZ3VhZ2VUYWcodGFnKSkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCInXCIgKyB0YWcgKyBcIicgaXMgbm90IGEgc3RydWN0dXJhbGx5IHZhbGlkIGxhbmd1YWdlIHRhZ1wiKTtcblxuICAgICAgICAgICAgLy8gdi4gTGV0IHRhZyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIGFic3RyYWN0IG9wZXJhdGlvblxuICAgICAgICAgICAgLy8gICAgQ2Fub25pY2FsaXplTGFuZ3VhZ2VUYWcgKGRlZmluZWQgaW4gNi4yLjMpLCBwYXNzaW5nIHRhZyBhcyB0aGVcbiAgICAgICAgICAgIC8vICAgIGFyZ3VtZW50LlxuICAgICAgICAgICAgdGFnID0gQ2Fub25pY2FsaXplTGFuZ3VhZ2VUYWcodGFnKTtcblxuICAgICAgICAgICAgLy8gdmkuIElmIHRhZyBpcyBub3QgYW4gZWxlbWVudCBvZiBzZWVuLCB0aGVuIGFwcGVuZCB0YWcgYXMgdGhlIGxhc3RcbiAgICAgICAgICAgIC8vICAgICBlbGVtZW50IG9mIHNlZW4uXG4gICAgICAgICAgICBpZiAoYXJySW5kZXhPZi5jYWxsKHNlZW4sIHRhZykgPT09IC0xKSBhcnJQdXNoLmNhbGwoc2VlbiwgdGFnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGQuIEluY3JlYXNlIGsgYnkgMS5cbiAgICAgICAgaysrO1xuICAgIH1cblxuICAgIC8vIDkuIFJldHVybiBzZWVuLlxuICAgIHJldHVybiBzZWVuO1xufVxuXG4vKipcbiAqIFRoZSBCZXN0QXZhaWxhYmxlTG9jYWxlIGFic3RyYWN0IG9wZXJhdGlvbiBjb21wYXJlcyB0aGUgcHJvdmlkZWQgYXJndW1lbnRcbiAqIGxvY2FsZSwgd2hpY2ggbXVzdCBiZSBhIFN0cmluZyB2YWx1ZSB3aXRoIGEgc3RydWN0dXJhbGx5IHZhbGlkIGFuZFxuICogY2Fub25pY2FsaXplZCBCQ1AgNDcgbGFuZ3VhZ2UgdGFnLCBhZ2FpbnN0IHRoZSBsb2NhbGVzIGluIGF2YWlsYWJsZUxvY2FsZXMgYW5kXG4gKiByZXR1cm5zIGVpdGhlciB0aGUgbG9uZ2VzdCBub24tZW1wdHkgcHJlZml4IG9mIGxvY2FsZSB0aGF0IGlzIGFuIGVsZW1lbnQgb2ZcbiAqIGF2YWlsYWJsZUxvY2FsZXMsIG9yIHVuZGVmaW5lZCBpZiB0aGVyZSBpcyBubyBzdWNoIGVsZW1lbnQuIEl0IHVzZXMgdGhlXG4gKiBmYWxsYmFjayBtZWNoYW5pc20gb2YgUkZDIDQ2NDcsIHNlY3Rpb24gMy40LiBUaGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAqL1xuZnVuY3Rpb24gLyogOS4yLjIgKi9CZXN0QXZhaWxhYmxlTG9jYWxlKGF2YWlsYWJsZUxvY2FsZXMsIGxvY2FsZSkge1xuICAgIC8vIDEuIExldCBjYW5kaWRhdGUgYmUgbG9jYWxlXG4gICAgdmFyIGNhbmRpZGF0ZSA9IGxvY2FsZTtcblxuICAgIC8vIDIuIFJlcGVhdFxuICAgIHdoaWxlIChjYW5kaWRhdGUpIHtcbiAgICAgICAgLy8gYS4gSWYgYXZhaWxhYmxlTG9jYWxlcyBjb250YWlucyBhbiBlbGVtZW50IGVxdWFsIHRvIGNhbmRpZGF0ZSwgdGhlbiByZXR1cm5cbiAgICAgICAgLy8gY2FuZGlkYXRlLlxuICAgICAgICBpZiAoYXJySW5kZXhPZi5jYWxsKGF2YWlsYWJsZUxvY2FsZXMsIGNhbmRpZGF0ZSkgPiAtMSkgcmV0dXJuIGNhbmRpZGF0ZTtcblxuICAgICAgICAvLyBiLiBMZXQgcG9zIGJlIHRoZSBjaGFyYWN0ZXIgaW5kZXggb2YgdGhlIGxhc3Qgb2NjdXJyZW5jZSBvZiBcIi1cIlxuICAgICAgICAvLyAoVSswMDJEKSB3aXRoaW4gY2FuZGlkYXRlLiBJZiB0aGF0IGNoYXJhY3RlciBkb2VzIG5vdCBvY2N1ciwgcmV0dXJuXG4gICAgICAgIC8vIHVuZGVmaW5lZC5cbiAgICAgICAgdmFyIHBvcyA9IGNhbmRpZGF0ZS5sYXN0SW5kZXhPZignLScpO1xuXG4gICAgICAgIGlmIChwb3MgPCAwKSByZXR1cm47XG5cbiAgICAgICAgLy8gYy4gSWYgcG9zIOKJpSAyIGFuZCB0aGUgY2hhcmFjdGVyIFwiLVwiIG9jY3VycyBhdCBpbmRleCBwb3MtMiBvZiBjYW5kaWRhdGUsXG4gICAgICAgIC8vICAgIHRoZW4gZGVjcmVhc2UgcG9zIGJ5IDIuXG4gICAgICAgIGlmIChwb3MgPj0gMiAmJiBjYW5kaWRhdGUuY2hhckF0KHBvcyAtIDIpID09PSAnLScpIHBvcyAtPSAyO1xuXG4gICAgICAgIC8vIGQuIExldCBjYW5kaWRhdGUgYmUgdGhlIHN1YnN0cmluZyBvZiBjYW5kaWRhdGUgZnJvbSBwb3NpdGlvbiAwLCBpbmNsdXNpdmUsXG4gICAgICAgIC8vICAgIHRvIHBvc2l0aW9uIHBvcywgZXhjbHVzaXZlLlxuICAgICAgICBjYW5kaWRhdGUgPSBjYW5kaWRhdGUuc3Vic3RyaW5nKDAsIHBvcyk7XG4gICAgfVxufVxuXG4vKipcbiAqIFRoZSBMb29rdXBNYXRjaGVyIGFic3RyYWN0IG9wZXJhdGlvbiBjb21wYXJlcyByZXF1ZXN0ZWRMb2NhbGVzLCB3aGljaCBtdXN0IGJlXG4gKiBhIExpc3QgYXMgcmV0dXJuZWQgYnkgQ2Fub25pY2FsaXplTG9jYWxlTGlzdCwgYWdhaW5zdCB0aGUgbG9jYWxlcyBpblxuICogYXZhaWxhYmxlTG9jYWxlcyBhbmQgZGV0ZXJtaW5lcyB0aGUgYmVzdCBhdmFpbGFibGUgbGFuZ3VhZ2UgdG8gbWVldCB0aGVcbiAqIHJlcXVlc3QuIFRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHRha2VuOlxuICovXG5mdW5jdGlvbiAvKiA5LjIuMyAqL0xvb2t1cE1hdGNoZXIoYXZhaWxhYmxlTG9jYWxlcywgcmVxdWVzdGVkTG9jYWxlcykge1xuICAgIC8vIDEuIExldCBpIGJlIDAuXG4gICAgdmFyIGkgPSAwO1xuXG4gICAgLy8gMi4gTGV0IGxlbiBiZSB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHJlcXVlc3RlZExvY2FsZXMuXG4gICAgdmFyIGxlbiA9IHJlcXVlc3RlZExvY2FsZXMubGVuZ3RoO1xuXG4gICAgLy8gMy4gTGV0IGF2YWlsYWJsZUxvY2FsZSBiZSB1bmRlZmluZWQuXG4gICAgdmFyIGF2YWlsYWJsZUxvY2FsZSA9IHZvaWQgMDtcblxuICAgIHZhciBsb2NhbGUgPSB2b2lkIDAsXG4gICAgICAgIG5vRXh0ZW5zaW9uc0xvY2FsZSA9IHZvaWQgMDtcblxuICAgIC8vIDQuIFJlcGVhdCB3aGlsZSBpIDwgbGVuIGFuZCBhdmFpbGFibGVMb2NhbGUgaXMgdW5kZWZpbmVkOlxuICAgIHdoaWxlIChpIDwgbGVuICYmICFhdmFpbGFibGVMb2NhbGUpIHtcbiAgICAgICAgLy8gYS4gTGV0IGxvY2FsZSBiZSB0aGUgZWxlbWVudCBvZiByZXF1ZXN0ZWRMb2NhbGVzIGF0IDAtb3JpZ2luZWQgbGlzdFxuICAgICAgICAvLyAgICBwb3NpdGlvbiBpLlxuICAgICAgICBsb2NhbGUgPSByZXF1ZXN0ZWRMb2NhbGVzW2ldO1xuXG4gICAgICAgIC8vIGIuIExldCBub0V4dGVuc2lvbnNMb2NhbGUgYmUgdGhlIFN0cmluZyB2YWx1ZSB0aGF0IGlzIGxvY2FsZSB3aXRoIGFsbFxuICAgICAgICAvLyAgICBVbmljb2RlIGxvY2FsZSBleHRlbnNpb24gc2VxdWVuY2VzIHJlbW92ZWQuXG4gICAgICAgIG5vRXh0ZW5zaW9uc0xvY2FsZSA9IFN0cmluZyhsb2NhbGUpLnJlcGxhY2UoZXhwVW5pY29kZUV4U2VxLCAnJyk7XG5cbiAgICAgICAgLy8gYy4gTGV0IGF2YWlsYWJsZUxvY2FsZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlXG4gICAgICAgIC8vICAgIEJlc3RBdmFpbGFibGVMb2NhbGUgYWJzdHJhY3Qgb3BlcmF0aW9uIChkZWZpbmVkIGluIDkuMi4yKSB3aXRoXG4gICAgICAgIC8vICAgIGFyZ3VtZW50cyBhdmFpbGFibGVMb2NhbGVzIGFuZCBub0V4dGVuc2lvbnNMb2NhbGUuXG4gICAgICAgIGF2YWlsYWJsZUxvY2FsZSA9IEJlc3RBdmFpbGFibGVMb2NhbGUoYXZhaWxhYmxlTG9jYWxlcywgbm9FeHRlbnNpb25zTG9jYWxlKTtcblxuICAgICAgICAvLyBkLiBJbmNyZWFzZSBpIGJ5IDEuXG4gICAgICAgIGkrKztcbiAgICB9XG5cbiAgICAvLyA1LiBMZXQgcmVzdWx0IGJlIGEgbmV3IFJlY29yZC5cbiAgICB2YXIgcmVzdWx0ID0gbmV3IFJlY29yZCgpO1xuXG4gICAgLy8gNi4gSWYgYXZhaWxhYmxlTG9jYWxlIGlzIG5vdCB1bmRlZmluZWQsIHRoZW5cbiAgICBpZiAoYXZhaWxhYmxlTG9jYWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gYS4gU2V0IHJlc3VsdC5bW2xvY2FsZV1dIHRvIGF2YWlsYWJsZUxvY2FsZS5cbiAgICAgICAgcmVzdWx0WydbW2xvY2FsZV1dJ10gPSBhdmFpbGFibGVMb2NhbGU7XG5cbiAgICAgICAgLy8gYi4gSWYgbG9jYWxlIGFuZCBub0V4dGVuc2lvbnNMb2NhbGUgYXJlIG5vdCB0aGUgc2FtZSBTdHJpbmcgdmFsdWUsIHRoZW5cbiAgICAgICAgaWYgKFN0cmluZyhsb2NhbGUpICE9PSBTdHJpbmcobm9FeHRlbnNpb25zTG9jYWxlKSkge1xuICAgICAgICAgICAgLy8gaS4gTGV0IGV4dGVuc2lvbiBiZSB0aGUgU3RyaW5nIHZhbHVlIGNvbnNpc3Rpbmcgb2YgdGhlIGZpcnN0XG4gICAgICAgICAgICAvLyAgICBzdWJzdHJpbmcgb2YgbG9jYWxlIHRoYXQgaXMgYSBVbmljb2RlIGxvY2FsZSBleHRlbnNpb24gc2VxdWVuY2UuXG4gICAgICAgICAgICB2YXIgZXh0ZW5zaW9uID0gbG9jYWxlLm1hdGNoKGV4cFVuaWNvZGVFeFNlcSlbMF07XG5cbiAgICAgICAgICAgIC8vIGlpLiBMZXQgZXh0ZW5zaW9uSW5kZXggYmUgdGhlIGNoYXJhY3RlciBwb3NpdGlvbiBvZiB0aGUgaW5pdGlhbFxuICAgICAgICAgICAgLy8gICAgIFwiLVwiIG9mIHRoZSBmaXJzdCBVbmljb2RlIGxvY2FsZSBleHRlbnNpb24gc2VxdWVuY2Ugd2l0aGluIGxvY2FsZS5cbiAgICAgICAgICAgIHZhciBleHRlbnNpb25JbmRleCA9IGxvY2FsZS5pbmRleE9mKCctdS0nKTtcblxuICAgICAgICAgICAgLy8gaWlpLiBTZXQgcmVzdWx0LltbZXh0ZW5zaW9uXV0gdG8gZXh0ZW5zaW9uLlxuICAgICAgICAgICAgcmVzdWx0WydbW2V4dGVuc2lvbl1dJ10gPSBleHRlbnNpb247XG5cbiAgICAgICAgICAgIC8vIGl2LiBTZXQgcmVzdWx0LltbZXh0ZW5zaW9uSW5kZXhdXSB0byBleHRlbnNpb25JbmRleC5cbiAgICAgICAgICAgIHJlc3VsdFsnW1tleHRlbnNpb25JbmRleF1dJ10gPSBleHRlbnNpb25JbmRleDtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyA3LiBFbHNlXG4gICAgZWxzZVxuICAgICAgICAvLyBhLiBTZXQgcmVzdWx0LltbbG9jYWxlXV0gdG8gdGhlIHZhbHVlIHJldHVybmVkIGJ5IHRoZSBEZWZhdWx0TG9jYWxlIGFic3RyYWN0XG4gICAgICAgIC8vICAgIG9wZXJhdGlvbiAoZGVmaW5lZCBpbiA2LjIuNCkuXG4gICAgICAgIHJlc3VsdFsnW1tsb2NhbGVdXSddID0gRGVmYXVsdExvY2FsZSgpO1xuXG4gICAgLy8gOC4gUmV0dXJuIHJlc3VsdFxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhlIEJlc3RGaXRNYXRjaGVyIGFic3RyYWN0IG9wZXJhdGlvbiBjb21wYXJlcyByZXF1ZXN0ZWRMb2NhbGVzLCB3aGljaCBtdXN0IGJlXG4gKiBhIExpc3QgYXMgcmV0dXJuZWQgYnkgQ2Fub25pY2FsaXplTG9jYWxlTGlzdCwgYWdhaW5zdCB0aGUgbG9jYWxlcyBpblxuICogYXZhaWxhYmxlTG9jYWxlcyBhbmQgZGV0ZXJtaW5lcyB0aGUgYmVzdCBhdmFpbGFibGUgbGFuZ3VhZ2UgdG8gbWVldCB0aGVcbiAqIHJlcXVlc3QuIFRoZSBhbGdvcml0aG0gaXMgaW1wbGVtZW50YXRpb24gZGVwZW5kZW50LCBidXQgc2hvdWxkIHByb2R1Y2UgcmVzdWx0c1xuICogdGhhdCBhIHR5cGljYWwgdXNlciBvZiB0aGUgcmVxdWVzdGVkIGxvY2FsZXMgd291bGQgcGVyY2VpdmUgYXMgYXQgbGVhc3QgYXNcbiAqIGdvb2QgYXMgdGhvc2UgcHJvZHVjZWQgYnkgdGhlIExvb2t1cE1hdGNoZXIgYWJzdHJhY3Qgb3BlcmF0aW9uLiBPcHRpb25zXG4gKiBzcGVjaWZpZWQgdGhyb3VnaCBVbmljb2RlIGxvY2FsZSBleHRlbnNpb24gc2VxdWVuY2VzIG11c3QgYmUgaWdub3JlZCBieSB0aGVcbiAqIGFsZ29yaXRobS4gSW5mb3JtYXRpb24gYWJvdXQgc3VjaCBzdWJzZXF1ZW5jZXMgaXMgcmV0dXJuZWQgc2VwYXJhdGVseS5cbiAqIFRoZSBhYnN0cmFjdCBvcGVyYXRpb24gcmV0dXJucyBhIHJlY29yZCB3aXRoIGEgW1tsb2NhbGVdXSBmaWVsZCwgd2hvc2UgdmFsdWVcbiAqIGlzIHRoZSBsYW5ndWFnZSB0YWcgb2YgdGhlIHNlbGVjdGVkIGxvY2FsZSwgd2hpY2ggbXVzdCBiZSBhbiBlbGVtZW50IG9mXG4gKiBhdmFpbGFibGVMb2NhbGVzLiBJZiB0aGUgbGFuZ3VhZ2UgdGFnIG9mIHRoZSByZXF1ZXN0IGxvY2FsZSB0aGF0IGxlZCB0byB0aGVcbiAqIHNlbGVjdGVkIGxvY2FsZSBjb250YWluZWQgYSBVbmljb2RlIGxvY2FsZSBleHRlbnNpb24gc2VxdWVuY2UsIHRoZW4gdGhlXG4gKiByZXR1cm5lZCByZWNvcmQgYWxzbyBjb250YWlucyBhbiBbW2V4dGVuc2lvbl1dIGZpZWxkIHdob3NlIHZhbHVlIGlzIHRoZSBmaXJzdFxuICogVW5pY29kZSBsb2NhbGUgZXh0ZW5zaW9uIHNlcXVlbmNlLCBhbmQgYW4gW1tleHRlbnNpb25JbmRleF1dIGZpZWxkIHdob3NlIHZhbHVlXG4gKiBpcyB0aGUgaW5kZXggb2YgdGhlIGZpcnN0IFVuaWNvZGUgbG9jYWxlIGV4dGVuc2lvbiBzZXF1ZW5jZSB3aXRoaW4gdGhlIHJlcXVlc3RcbiAqIGxvY2FsZSBsYW5ndWFnZSB0YWcuXG4gKi9cbmZ1bmN0aW9uIC8qIDkuMi40ICovQmVzdEZpdE1hdGNoZXIoYXZhaWxhYmxlTG9jYWxlcywgcmVxdWVzdGVkTG9jYWxlcykge1xuICAgIHJldHVybiBMb29rdXBNYXRjaGVyKGF2YWlsYWJsZUxvY2FsZXMsIHJlcXVlc3RlZExvY2FsZXMpO1xufVxuXG4vKipcbiAqIFRoZSBSZXNvbHZlTG9jYWxlIGFic3RyYWN0IG9wZXJhdGlvbiBjb21wYXJlcyBhIEJDUCA0NyBsYW5ndWFnZSBwcmlvcml0eSBsaXN0XG4gKiByZXF1ZXN0ZWRMb2NhbGVzIGFnYWluc3QgdGhlIGxvY2FsZXMgaW4gYXZhaWxhYmxlTG9jYWxlcyBhbmQgZGV0ZXJtaW5lcyB0aGVcbiAqIGJlc3QgYXZhaWxhYmxlIGxhbmd1YWdlIHRvIG1lZXQgdGhlIHJlcXVlc3QuIGF2YWlsYWJsZUxvY2FsZXMgYW5kXG4gKiByZXF1ZXN0ZWRMb2NhbGVzIG11c3QgYmUgcHJvdmlkZWQgYXMgTGlzdCB2YWx1ZXMsIG9wdGlvbnMgYXMgYSBSZWNvcmQuXG4gKi9cbmZ1bmN0aW9uIC8qIDkuMi41ICovUmVzb2x2ZUxvY2FsZShhdmFpbGFibGVMb2NhbGVzLCByZXF1ZXN0ZWRMb2NhbGVzLCBvcHRpb25zLCByZWxldmFudEV4dGVuc2lvbktleXMsIGxvY2FsZURhdGEpIHtcbiAgICBpZiAoYXZhaWxhYmxlTG9jYWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdObyBsb2NhbGUgZGF0YSBoYXMgYmVlbiBwcm92aWRlZCBmb3IgdGhpcyBvYmplY3QgeWV0LicpO1xuICAgIH1cblxuICAgIC8vIFRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHRha2VuOlxuICAgIC8vIDEuIExldCBtYXRjaGVyIGJlIHRoZSB2YWx1ZSBvZiBvcHRpb25zLltbbG9jYWxlTWF0Y2hlcl1dLlxuICAgIHZhciBtYXRjaGVyID0gb3B0aW9uc1snW1tsb2NhbGVNYXRjaGVyXV0nXTtcblxuICAgIHZhciByID0gdm9pZCAwO1xuXG4gICAgLy8gMi4gSWYgbWF0Y2hlciBpcyBcImxvb2t1cFwiLCB0aGVuXG4gICAgaWYgKG1hdGNoZXIgPT09ICdsb29rdXAnKVxuICAgICAgICAvLyBhLiBMZXQgciBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIExvb2t1cE1hdGNoZXIgYWJzdHJhY3Qgb3BlcmF0aW9uXG4gICAgICAgIC8vICAgIChkZWZpbmVkIGluIDkuMi4zKSB3aXRoIGFyZ3VtZW50cyBhdmFpbGFibGVMb2NhbGVzIGFuZFxuICAgICAgICAvLyAgICByZXF1ZXN0ZWRMb2NhbGVzLlxuICAgICAgICByID0gTG9va3VwTWF0Y2hlcihhdmFpbGFibGVMb2NhbGVzLCByZXF1ZXN0ZWRMb2NhbGVzKTtcblxuICAgICAgICAvLyAzLiBFbHNlXG4gICAgZWxzZVxuICAgICAgICAvLyBhLiBMZXQgciBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEJlc3RGaXRNYXRjaGVyIGFic3RyYWN0XG4gICAgICAgIC8vICAgIG9wZXJhdGlvbiAoZGVmaW5lZCBpbiA5LjIuNCkgd2l0aCBhcmd1bWVudHMgYXZhaWxhYmxlTG9jYWxlcyBhbmRcbiAgICAgICAgLy8gICAgcmVxdWVzdGVkTG9jYWxlcy5cbiAgICAgICAgciA9IEJlc3RGaXRNYXRjaGVyKGF2YWlsYWJsZUxvY2FsZXMsIHJlcXVlc3RlZExvY2FsZXMpO1xuXG4gICAgLy8gNC4gTGV0IGZvdW5kTG9jYWxlIGJlIHRoZSB2YWx1ZSBvZiByLltbbG9jYWxlXV0uXG4gICAgdmFyIGZvdW5kTG9jYWxlID0gclsnW1tsb2NhbGVdXSddO1xuXG4gICAgdmFyIGV4dGVuc2lvblN1YnRhZ3MgPSB2b2lkIDAsXG4gICAgICAgIGV4dGVuc2lvblN1YnRhZ3NMZW5ndGggPSB2b2lkIDA7XG5cbiAgICAvLyA1LiBJZiByIGhhcyBhbiBbW2V4dGVuc2lvbl1dIGZpZWxkLCB0aGVuXG4gICAgaWYgKGhvcC5jYWxsKHIsICdbW2V4dGVuc2lvbl1dJykpIHtcbiAgICAgICAgLy8gYS4gTGV0IGV4dGVuc2lvbiBiZSB0aGUgdmFsdWUgb2Ygci5bW2V4dGVuc2lvbl1dLlxuICAgICAgICB2YXIgZXh0ZW5zaW9uID0gclsnW1tleHRlbnNpb25dXSddO1xuICAgICAgICAvLyBiLiBMZXQgc3BsaXQgYmUgdGhlIHN0YW5kYXJkIGJ1aWx0LWluIGZ1bmN0aW9uIG9iamVjdCBkZWZpbmVkIGluIEVTNSxcbiAgICAgICAgLy8gICAgMTUuNS40LjE0LlxuICAgICAgICB2YXIgc3BsaXQgPSBTdHJpbmcucHJvdG90eXBlLnNwbGl0O1xuICAgICAgICAvLyBjLiBMZXQgZXh0ZW5zaW9uU3VidGFncyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbQ2FsbF1dIGludGVybmFsXG4gICAgICAgIC8vICAgIG1ldGhvZCBvZiBzcGxpdCB3aXRoIGV4dGVuc2lvbiBhcyB0aGUgdGhpcyB2YWx1ZSBhbmQgYW4gYXJndW1lbnRcbiAgICAgICAgLy8gICAgbGlzdCBjb250YWluaW5nIHRoZSBzaW5nbGUgaXRlbSBcIi1cIi5cbiAgICAgICAgZXh0ZW5zaW9uU3VidGFncyA9IHNwbGl0LmNhbGwoZXh0ZW5zaW9uLCAnLScpO1xuICAgICAgICAvLyBkLiBMZXQgZXh0ZW5zaW9uU3VidGFnc0xlbmd0aCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV1cbiAgICAgICAgLy8gICAgaW50ZXJuYWwgbWV0aG9kIG9mIGV4dGVuc2lvblN1YnRhZ3Mgd2l0aCBhcmd1bWVudCBcImxlbmd0aFwiLlxuICAgICAgICBleHRlbnNpb25TdWJ0YWdzTGVuZ3RoID0gZXh0ZW5zaW9uU3VidGFncy5sZW5ndGg7XG4gICAgfVxuXG4gICAgLy8gNi4gTGV0IHJlc3VsdCBiZSBhIG5ldyBSZWNvcmQuXG4gICAgdmFyIHJlc3VsdCA9IG5ldyBSZWNvcmQoKTtcblxuICAgIC8vIDcuIFNldCByZXN1bHQuW1tkYXRhTG9jYWxlXV0gdG8gZm91bmRMb2NhbGUuXG4gICAgcmVzdWx0WydbW2RhdGFMb2NhbGVdXSddID0gZm91bmRMb2NhbGU7XG5cbiAgICAvLyA4LiBMZXQgc3VwcG9ydGVkRXh0ZW5zaW9uIGJlIFwiLXVcIi5cbiAgICB2YXIgc3VwcG9ydGVkRXh0ZW5zaW9uID0gJy11JztcbiAgICAvLyA5LiBMZXQgaSBiZSAwLlxuICAgIHZhciBpID0gMDtcbiAgICAvLyAxMC4gTGV0IGxlbiBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgLy8gICAgIHJlbGV2YW50RXh0ZW5zaW9uS2V5cyB3aXRoIGFyZ3VtZW50IFwibGVuZ3RoXCIuXG4gICAgdmFyIGxlbiA9IHJlbGV2YW50RXh0ZW5zaW9uS2V5cy5sZW5ndGg7XG5cbiAgICAvLyAxMSBSZXBlYXQgd2hpbGUgaSA8IGxlbjpcbiAgICB3aGlsZSAoaSA8IGxlbikge1xuICAgICAgICAvLyBhLiBMZXQga2V5IGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAgICAgLy8gICAgcmVsZXZhbnRFeHRlbnNpb25LZXlzIHdpdGggYXJndW1lbnQgVG9TdHJpbmcoaSkuXG4gICAgICAgIHZhciBrZXkgPSByZWxldmFudEV4dGVuc2lvbktleXNbaV07XG4gICAgICAgIC8vIGIuIExldCBmb3VuZExvY2FsZURhdGEgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsXG4gICAgICAgIC8vICAgIG1ldGhvZCBvZiBsb2NhbGVEYXRhIHdpdGggdGhlIGFyZ3VtZW50IGZvdW5kTG9jYWxlLlxuICAgICAgICB2YXIgZm91bmRMb2NhbGVEYXRhID0gbG9jYWxlRGF0YVtmb3VuZExvY2FsZV07XG4gICAgICAgIC8vIGMuIExldCBrZXlMb2NhbGVEYXRhIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbFxuICAgICAgICAvLyAgICBtZXRob2Qgb2YgZm91bmRMb2NhbGVEYXRhIHdpdGggdGhlIGFyZ3VtZW50IGtleS5cbiAgICAgICAgdmFyIGtleUxvY2FsZURhdGEgPSBmb3VuZExvY2FsZURhdGFba2V5XTtcbiAgICAgICAgLy8gZC4gTGV0IHZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAgICAgLy8gICAga2V5TG9jYWxlRGF0YSB3aXRoIGFyZ3VtZW50IFwiMFwiLlxuICAgICAgICB2YXIgdmFsdWUgPSBrZXlMb2NhbGVEYXRhWycwJ107XG4gICAgICAgIC8vIGUuIExldCBzdXBwb3J0ZWRFeHRlbnNpb25BZGRpdGlvbiBiZSBcIlwiLlxuICAgICAgICB2YXIgc3VwcG9ydGVkRXh0ZW5zaW9uQWRkaXRpb24gPSAnJztcbiAgICAgICAgLy8gZi4gTGV0IGluZGV4T2YgYmUgdGhlIHN0YW5kYXJkIGJ1aWx0LWluIGZ1bmN0aW9uIG9iamVjdCBkZWZpbmVkIGluXG4gICAgICAgIC8vICAgIEVTNSwgMTUuNC40LjE0LlxuICAgICAgICB2YXIgaW5kZXhPZiA9IGFyckluZGV4T2Y7XG5cbiAgICAgICAgLy8gZy4gSWYgZXh0ZW5zaW9uU3VidGFncyBpcyBub3QgdW5kZWZpbmVkLCB0aGVuXG4gICAgICAgIGlmIChleHRlbnNpb25TdWJ0YWdzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIGkuIExldCBrZXlQb3MgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NhbGxdXSBpbnRlcm5hbFxuICAgICAgICAgICAgLy8gICAgbWV0aG9kIG9mIGluZGV4T2Ygd2l0aCBleHRlbnNpb25TdWJ0YWdzIGFzIHRoZSB0aGlzIHZhbHVlIGFuZFxuICAgICAgICAgICAgLy8gYW4gYXJndW1lbnQgbGlzdCBjb250YWluaW5nIHRoZSBzaW5nbGUgaXRlbSBrZXkuXG4gICAgICAgICAgICB2YXIga2V5UG9zID0gaW5kZXhPZi5jYWxsKGV4dGVuc2lvblN1YnRhZ3MsIGtleSk7XG5cbiAgICAgICAgICAgIC8vIGlpLiBJZiBrZXlQb3Mg4omgIC0xLCB0aGVuXG4gICAgICAgICAgICBpZiAoa2V5UG9zICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIC8vIDEuIElmIGtleVBvcyArIDEgPCBleHRlbnNpb25TdWJ0YWdzTGVuZ3RoIGFuZCB0aGUgbGVuZ3RoIG9mIHRoZVxuICAgICAgICAgICAgICAgIC8vICAgIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZlxuICAgICAgICAgICAgICAgIC8vICAgIGV4dGVuc2lvblN1YnRhZ3Mgd2l0aCBhcmd1bWVudCBUb1N0cmluZyhrZXlQb3MgKzEpIGlzIGdyZWF0ZXJcbiAgICAgICAgICAgICAgICAvLyAgICB0aGFuIDIsIHRoZW5cbiAgICAgICAgICAgICAgICBpZiAoa2V5UG9zICsgMSA8IGV4dGVuc2lvblN1YnRhZ3NMZW5ndGggJiYgZXh0ZW5zaW9uU3VidGFnc1trZXlQb3MgKyAxXS5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGEuIExldCByZXF1ZXN0ZWRWYWx1ZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV1cbiAgICAgICAgICAgICAgICAgICAgLy8gICAgaW50ZXJuYWwgbWV0aG9kIG9mIGV4dGVuc2lvblN1YnRhZ3Mgd2l0aCBhcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICAvLyAgICBUb1N0cmluZyhrZXlQb3MgKyAxKS5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlcXVlc3RlZFZhbHVlID0gZXh0ZW5zaW9uU3VidGFnc1trZXlQb3MgKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gYi4gTGV0IHZhbHVlUG9zIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDYWxsXV1cbiAgICAgICAgICAgICAgICAgICAgLy8gICAgaW50ZXJuYWwgbWV0aG9kIG9mIGluZGV4T2Ygd2l0aCBrZXlMb2NhbGVEYXRhIGFzIHRoZVxuICAgICAgICAgICAgICAgICAgICAvLyAgICB0aGlzIHZhbHVlIGFuZCBhbiBhcmd1bWVudCBsaXN0IGNvbnRhaW5pbmcgdGhlIHNpbmdsZVxuICAgICAgICAgICAgICAgICAgICAvLyAgICBpdGVtIHJlcXVlc3RlZFZhbHVlLlxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVQb3MgPSBpbmRleE9mLmNhbGwoa2V5TG9jYWxlRGF0YSwgcmVxdWVzdGVkVmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGMuIElmIHZhbHVlUG9zIOKJoCAtMSwgdGhlblxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWVQb3MgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpLiBMZXQgdmFsdWUgYmUgcmVxdWVzdGVkVmFsdWUuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlcXVlc3RlZFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWkuIExldCBzdXBwb3J0ZWRFeHRlbnNpb25BZGRpdGlvbiBiZSB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBjb25jYXRlbmF0aW9uIG9mIFwiLVwiLCBrZXksIFwiLVwiLCBhbmQgdmFsdWUuXG4gICAgICAgICAgICAgICAgICAgICAgICBzdXBwb3J0ZWRFeHRlbnNpb25BZGRpdGlvbiA9ICctJyArIGtleSArICctJyArIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIDIuIEVsc2VcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGEuIExldCB2YWx1ZVBvcyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbQ2FsbF1dXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpbnRlcm5hbCBtZXRob2Qgb2YgaW5kZXhPZiB3aXRoIGtleUxvY2FsZURhdGEgYXMgdGhlIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhbHVlIGFuZCBhbiBhcmd1bWVudCBsaXN0IGNvbnRhaW5pbmcgdGhlIHNpbmdsZSBpdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBcInRydWVcIi5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfdmFsdWVQb3MgPSBpbmRleE9mKGtleUxvY2FsZURhdGEsICd0cnVlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGIuIElmIHZhbHVlUG9zIOKJoCAtMSwgdGhlblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF92YWx1ZVBvcyAhPT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaS4gTGV0IHZhbHVlIGJlIFwidHJ1ZVwiLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gJ3RydWUnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gaC4gSWYgb3B0aW9ucyBoYXMgYSBmaWVsZCBbWzxrZXk+XV0sIHRoZW5cbiAgICAgICAgaWYgKGhvcC5jYWxsKG9wdGlvbnMsICdbWycgKyBrZXkgKyAnXV0nKSkge1xuICAgICAgICAgICAgLy8gaS4gTGV0IG9wdGlvbnNWYWx1ZSBiZSB0aGUgdmFsdWUgb2Ygb3B0aW9ucy5bWzxrZXk+XV0uXG4gICAgICAgICAgICB2YXIgb3B0aW9uc1ZhbHVlID0gb3B0aW9uc1snW1snICsga2V5ICsgJ11dJ107XG5cbiAgICAgICAgICAgIC8vIGlpLiBJZiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbQ2FsbF1dIGludGVybmFsIG1ldGhvZCBvZiBpbmRleE9mXG4gICAgICAgICAgICAvLyAgICAgd2l0aCBrZXlMb2NhbGVEYXRhIGFzIHRoZSB0aGlzIHZhbHVlIGFuZCBhbiBhcmd1bWVudCBsaXN0XG4gICAgICAgICAgICAvLyAgICAgY29udGFpbmluZyB0aGUgc2luZ2xlIGl0ZW0gb3B0aW9uc1ZhbHVlIGlzIG5vdCAtMSwgdGhlblxuICAgICAgICAgICAgaWYgKGluZGV4T2YuY2FsbChrZXlMb2NhbGVEYXRhLCBvcHRpb25zVmFsdWUpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIC8vIDEuIElmIG9wdGlvbnNWYWx1ZSBpcyBub3QgZXF1YWwgdG8gdmFsdWUsIHRoZW5cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9uc1ZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBhLiBMZXQgdmFsdWUgYmUgb3B0aW9uc1ZhbHVlLlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG9wdGlvbnNWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gYi4gTGV0IHN1cHBvcnRlZEV4dGVuc2lvbkFkZGl0aW9uIGJlIFwiXCIuXG4gICAgICAgICAgICAgICAgICAgIHN1cHBvcnRlZEV4dGVuc2lvbkFkZGl0aW9uID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGkuIFNldCByZXN1bHQuW1s8a2V5Pl1dIHRvIHZhbHVlLlxuICAgICAgICByZXN1bHRbJ1tbJyArIGtleSArICddXSddID0gdmFsdWU7XG5cbiAgICAgICAgLy8gai4gQXBwZW5kIHN1cHBvcnRlZEV4dGVuc2lvbkFkZGl0aW9uIHRvIHN1cHBvcnRlZEV4dGVuc2lvbi5cbiAgICAgICAgc3VwcG9ydGVkRXh0ZW5zaW9uICs9IHN1cHBvcnRlZEV4dGVuc2lvbkFkZGl0aW9uO1xuXG4gICAgICAgIC8vIGsuIEluY3JlYXNlIGkgYnkgMS5cbiAgICAgICAgaSsrO1xuICAgIH1cbiAgICAvLyAxMi4gSWYgdGhlIGxlbmd0aCBvZiBzdXBwb3J0ZWRFeHRlbnNpb24gaXMgZ3JlYXRlciB0aGFuIDIsIHRoZW5cbiAgICBpZiAoc3VwcG9ydGVkRXh0ZW5zaW9uLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgLy8gYS5cbiAgICAgICAgdmFyIHByaXZhdGVJbmRleCA9IGZvdW5kTG9jYWxlLmluZGV4T2YoXCIteC1cIik7XG4gICAgICAgIC8vIGIuXG4gICAgICAgIGlmIChwcml2YXRlSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICAvLyBpLlxuICAgICAgICAgICAgZm91bmRMb2NhbGUgPSBmb3VuZExvY2FsZSArIHN1cHBvcnRlZEV4dGVuc2lvbjtcbiAgICAgICAgfVxuICAgICAgICAvLyBjLlxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBpLlxuICAgICAgICAgICAgICAgIHZhciBwcmVFeHRlbnNpb24gPSBmb3VuZExvY2FsZS5zdWJzdHJpbmcoMCwgcHJpdmF0ZUluZGV4KTtcbiAgICAgICAgICAgICAgICAvLyBpaS5cbiAgICAgICAgICAgICAgICB2YXIgcG9zdEV4dGVuc2lvbiA9IGZvdW5kTG9jYWxlLnN1YnN0cmluZyhwcml2YXRlSW5kZXgpO1xuICAgICAgICAgICAgICAgIC8vIGlpaS5cbiAgICAgICAgICAgICAgICBmb3VuZExvY2FsZSA9IHByZUV4dGVuc2lvbiArIHN1cHBvcnRlZEV4dGVuc2lvbiArIHBvc3RFeHRlbnNpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIC8vIGQuIGFzc2VydGluZyAtIHNraXBwaW5nXG4gICAgICAgIC8vIGUuXG4gICAgICAgIGZvdW5kTG9jYWxlID0gQ2Fub25pY2FsaXplTGFuZ3VhZ2VUYWcoZm91bmRMb2NhbGUpO1xuICAgIH1cbiAgICAvLyAxMy4gU2V0IHJlc3VsdC5bW2xvY2FsZV1dIHRvIGZvdW5kTG9jYWxlLlxuICAgIHJlc3VsdFsnW1tsb2NhbGVdXSddID0gZm91bmRMb2NhbGU7XG5cbiAgICAvLyAxNC4gUmV0dXJuIHJlc3VsdC5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFRoZSBMb29rdXBTdXBwb3J0ZWRMb2NhbGVzIGFic3RyYWN0IG9wZXJhdGlvbiByZXR1cm5zIHRoZSBzdWJzZXQgb2YgdGhlXG4gKiBwcm92aWRlZCBCQ1AgNDcgbGFuZ3VhZ2UgcHJpb3JpdHkgbGlzdCByZXF1ZXN0ZWRMb2NhbGVzIGZvciB3aGljaFxuICogYXZhaWxhYmxlTG9jYWxlcyBoYXMgYSBtYXRjaGluZyBsb2NhbGUgd2hlbiB1c2luZyB0aGUgQkNQIDQ3IExvb2t1cCBhbGdvcml0aG0uXG4gKiBMb2NhbGVzIGFwcGVhciBpbiB0aGUgc2FtZSBvcmRlciBpbiB0aGUgcmV0dXJuZWQgbGlzdCBhcyBpbiByZXF1ZXN0ZWRMb2NhbGVzLlxuICogVGhlIGZvbGxvd2luZyBzdGVwcyBhcmUgdGFrZW46XG4gKi9cbmZ1bmN0aW9uIC8qIDkuMi42ICovTG9va3VwU3VwcG9ydGVkTG9jYWxlcyhhdmFpbGFibGVMb2NhbGVzLCByZXF1ZXN0ZWRMb2NhbGVzKSB7XG4gICAgLy8gMS4gTGV0IGxlbiBiZSB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHJlcXVlc3RlZExvY2FsZXMuXG4gICAgdmFyIGxlbiA9IHJlcXVlc3RlZExvY2FsZXMubGVuZ3RoO1xuICAgIC8vIDIuIExldCBzdWJzZXQgYmUgYSBuZXcgZW1wdHkgTGlzdC5cbiAgICB2YXIgc3Vic2V0ID0gbmV3IExpc3QoKTtcbiAgICAvLyAzLiBMZXQgayBiZSAwLlxuICAgIHZhciBrID0gMDtcblxuICAgIC8vIDQuIFJlcGVhdCB3aGlsZSBrIDwgbGVuXG4gICAgd2hpbGUgKGsgPCBsZW4pIHtcbiAgICAgICAgLy8gYS4gTGV0IGxvY2FsZSBiZSB0aGUgZWxlbWVudCBvZiByZXF1ZXN0ZWRMb2NhbGVzIGF0IDAtb3JpZ2luZWQgbGlzdFxuICAgICAgICAvLyAgICBwb3NpdGlvbiBrLlxuICAgICAgICB2YXIgbG9jYWxlID0gcmVxdWVzdGVkTG9jYWxlc1trXTtcbiAgICAgICAgLy8gYi4gTGV0IG5vRXh0ZW5zaW9uc0xvY2FsZSBiZSB0aGUgU3RyaW5nIHZhbHVlIHRoYXQgaXMgbG9jYWxlIHdpdGggYWxsXG4gICAgICAgIC8vICAgIFVuaWNvZGUgbG9jYWxlIGV4dGVuc2lvbiBzZXF1ZW5jZXMgcmVtb3ZlZC5cbiAgICAgICAgdmFyIG5vRXh0ZW5zaW9uc0xvY2FsZSA9IFN0cmluZyhsb2NhbGUpLnJlcGxhY2UoZXhwVW5pY29kZUV4U2VxLCAnJyk7XG4gICAgICAgIC8vIGMuIExldCBhdmFpbGFibGVMb2NhbGUgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZVxuICAgICAgICAvLyAgICBCZXN0QXZhaWxhYmxlTG9jYWxlIGFic3RyYWN0IG9wZXJhdGlvbiAoZGVmaW5lZCBpbiA5LjIuMikgd2l0aFxuICAgICAgICAvLyAgICBhcmd1bWVudHMgYXZhaWxhYmxlTG9jYWxlcyBhbmQgbm9FeHRlbnNpb25zTG9jYWxlLlxuICAgICAgICB2YXIgYXZhaWxhYmxlTG9jYWxlID0gQmVzdEF2YWlsYWJsZUxvY2FsZShhdmFpbGFibGVMb2NhbGVzLCBub0V4dGVuc2lvbnNMb2NhbGUpO1xuXG4gICAgICAgIC8vIGQuIElmIGF2YWlsYWJsZUxvY2FsZSBpcyBub3QgdW5kZWZpbmVkLCB0aGVuIGFwcGVuZCBsb2NhbGUgdG8gdGhlIGVuZCBvZlxuICAgICAgICAvLyAgICBzdWJzZXQuXG4gICAgICAgIGlmIChhdmFpbGFibGVMb2NhbGUgIT09IHVuZGVmaW5lZCkgYXJyUHVzaC5jYWxsKHN1YnNldCwgbG9jYWxlKTtcblxuICAgICAgICAvLyBlLiBJbmNyZW1lbnQgayBieSAxLlxuICAgICAgICBrKys7XG4gICAgfVxuXG4gICAgLy8gNS4gTGV0IHN1YnNldEFycmF5IGJlIGEgbmV3IEFycmF5IG9iamVjdCB3aG9zZSBlbGVtZW50cyBhcmUgdGhlIHNhbWVcbiAgICAvLyAgICB2YWx1ZXMgaW4gdGhlIHNhbWUgb3JkZXIgYXMgdGhlIGVsZW1lbnRzIG9mIHN1YnNldC5cbiAgICB2YXIgc3Vic2V0QXJyYXkgPSBhcnJTbGljZS5jYWxsKHN1YnNldCk7XG5cbiAgICAvLyA2LiBSZXR1cm4gc3Vic2V0QXJyYXkuXG4gICAgcmV0dXJuIHN1YnNldEFycmF5O1xufVxuXG4vKipcbiAqIFRoZSBCZXN0Rml0U3VwcG9ydGVkTG9jYWxlcyBhYnN0cmFjdCBvcGVyYXRpb24gcmV0dXJucyB0aGUgc3Vic2V0IG9mIHRoZVxuICogcHJvdmlkZWQgQkNQIDQ3IGxhbmd1YWdlIHByaW9yaXR5IGxpc3QgcmVxdWVzdGVkTG9jYWxlcyBmb3Igd2hpY2hcbiAqIGF2YWlsYWJsZUxvY2FsZXMgaGFzIGEgbWF0Y2hpbmcgbG9jYWxlIHdoZW4gdXNpbmcgdGhlIEJlc3QgRml0IE1hdGNoZXJcbiAqIGFsZ29yaXRobS4gTG9jYWxlcyBhcHBlYXIgaW4gdGhlIHNhbWUgb3JkZXIgaW4gdGhlIHJldHVybmVkIGxpc3QgYXMgaW5cbiAqIHJlcXVlc3RlZExvY2FsZXMuIFRoZSBzdGVwcyB0YWtlbiBhcmUgaW1wbGVtZW50YXRpb24gZGVwZW5kZW50LlxuICovXG5mdW5jdGlvbiAvKjkuMi43ICovQmVzdEZpdFN1cHBvcnRlZExvY2FsZXMoYXZhaWxhYmxlTG9jYWxlcywgcmVxdWVzdGVkTG9jYWxlcykge1xuICAgIC8vICMjI1RPRE86IGltcGxlbWVudCB0aGlzIGZ1bmN0aW9uIGFzIGRlc2NyaWJlZCBieSB0aGUgc3BlY2lmaWNhdGlvbiMjI1xuICAgIHJldHVybiBMb29rdXBTdXBwb3J0ZWRMb2NhbGVzKGF2YWlsYWJsZUxvY2FsZXMsIHJlcXVlc3RlZExvY2FsZXMpO1xufVxuXG4vKipcbiAqIFRoZSBTdXBwb3J0ZWRMb2NhbGVzIGFic3RyYWN0IG9wZXJhdGlvbiByZXR1cm5zIHRoZSBzdWJzZXQgb2YgdGhlIHByb3ZpZGVkIEJDUFxuICogNDcgbGFuZ3VhZ2UgcHJpb3JpdHkgbGlzdCByZXF1ZXN0ZWRMb2NhbGVzIGZvciB3aGljaCBhdmFpbGFibGVMb2NhbGVzIGhhcyBhXG4gKiBtYXRjaGluZyBsb2NhbGUuIFR3byBhbGdvcml0aG1zIGFyZSBhdmFpbGFibGUgdG8gbWF0Y2ggdGhlIGxvY2FsZXM6IHRoZSBMb29rdXBcbiAqIGFsZ29yaXRobSBkZXNjcmliZWQgaW4gUkZDIDQ2NDcgc2VjdGlvbiAzLjQsIGFuZCBhbiBpbXBsZW1lbnRhdGlvbiBkZXBlbmRlbnRcbiAqIGJlc3QtZml0IGFsZ29yaXRobS4gTG9jYWxlcyBhcHBlYXIgaW4gdGhlIHNhbWUgb3JkZXIgaW4gdGhlIHJldHVybmVkIGxpc3QgYXNcbiAqIGluIHJlcXVlc3RlZExvY2FsZXMuIFRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHRha2VuOlxuICovXG5mdW5jdGlvbiAvKjkuMi44ICovU3VwcG9ydGVkTG9jYWxlcyhhdmFpbGFibGVMb2NhbGVzLCByZXF1ZXN0ZWRMb2NhbGVzLCBvcHRpb25zKSB7XG4gICAgdmFyIG1hdGNoZXIgPSB2b2lkIDAsXG4gICAgICAgIHN1YnNldCA9IHZvaWQgMDtcblxuICAgIC8vIDEuIElmIG9wdGlvbnMgaXMgbm90IHVuZGVmaW5lZCwgdGhlblxuICAgIGlmIChvcHRpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gYS4gTGV0IG9wdGlvbnMgYmUgVG9PYmplY3Qob3B0aW9ucykuXG4gICAgICAgIG9wdGlvbnMgPSBuZXcgUmVjb3JkKHRvT2JqZWN0KG9wdGlvbnMpKTtcbiAgICAgICAgLy8gYi4gTGV0IG1hdGNoZXIgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZlxuICAgICAgICAvLyAgICBvcHRpb25zIHdpdGggYXJndW1lbnQgXCJsb2NhbGVNYXRjaGVyXCIuXG4gICAgICAgIG1hdGNoZXIgPSBvcHRpb25zLmxvY2FsZU1hdGNoZXI7XG5cbiAgICAgICAgLy8gYy4gSWYgbWF0Y2hlciBpcyBub3QgdW5kZWZpbmVkLCB0aGVuXG4gICAgICAgIGlmIChtYXRjaGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIGkuIExldCBtYXRjaGVyIGJlIFRvU3RyaW5nKG1hdGNoZXIpLlxuICAgICAgICAgICAgbWF0Y2hlciA9IFN0cmluZyhtYXRjaGVyKTtcblxuICAgICAgICAgICAgLy8gaWkuIElmIG1hdGNoZXIgaXMgbm90IFwibG9va3VwXCIgb3IgXCJiZXN0IGZpdFwiLCB0aGVuIHRocm93IGEgUmFuZ2VFcnJvclxuICAgICAgICAgICAgLy8gICAgIGV4Y2VwdGlvbi5cbiAgICAgICAgICAgIGlmIChtYXRjaGVyICE9PSAnbG9va3VwJyAmJiBtYXRjaGVyICE9PSAnYmVzdCBmaXQnKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignbWF0Y2hlciBzaG91bGQgYmUgXCJsb29rdXBcIiBvciBcImJlc3QgZml0XCInKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyAyLiBJZiBtYXRjaGVyIGlzIHVuZGVmaW5lZCBvciBcImJlc3QgZml0XCIsIHRoZW5cbiAgICBpZiAobWF0Y2hlciA9PT0gdW5kZWZpbmVkIHx8IG1hdGNoZXIgPT09ICdiZXN0IGZpdCcpXG4gICAgICAgIC8vIGEuIExldCBzdWJzZXQgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBCZXN0Rml0U3VwcG9ydGVkTG9jYWxlc1xuICAgICAgICAvLyAgICBhYnN0cmFjdCBvcGVyYXRpb24gKGRlZmluZWQgaW4gOS4yLjcpIHdpdGggYXJndW1lbnRzXG4gICAgICAgIC8vICAgIGF2YWlsYWJsZUxvY2FsZXMgYW5kIHJlcXVlc3RlZExvY2FsZXMuXG4gICAgICAgIHN1YnNldCA9IEJlc3RGaXRTdXBwb3J0ZWRMb2NhbGVzKGF2YWlsYWJsZUxvY2FsZXMsIHJlcXVlc3RlZExvY2FsZXMpO1xuICAgICAgICAvLyAzLiBFbHNlXG4gICAgZWxzZVxuICAgICAgICAvLyBhLiBMZXQgc3Vic2V0IGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgTG9va3VwU3VwcG9ydGVkTG9jYWxlc1xuICAgICAgICAvLyAgICBhYnN0cmFjdCBvcGVyYXRpb24gKGRlZmluZWQgaW4gOS4yLjYpIHdpdGggYXJndW1lbnRzXG4gICAgICAgIC8vICAgIGF2YWlsYWJsZUxvY2FsZXMgYW5kIHJlcXVlc3RlZExvY2FsZXMuXG4gICAgICAgIHN1YnNldCA9IExvb2t1cFN1cHBvcnRlZExvY2FsZXMoYXZhaWxhYmxlTG9jYWxlcywgcmVxdWVzdGVkTG9jYWxlcyk7XG5cbiAgICAvLyA0LiBGb3IgZWFjaCBuYW1lZCBvd24gcHJvcGVydHkgbmFtZSBQIG9mIHN1YnNldCxcbiAgICBmb3IgKHZhciBQIGluIHN1YnNldCkge1xuICAgICAgICBpZiAoIWhvcC5jYWxsKHN1YnNldCwgUCkpIGNvbnRpbnVlO1xuXG4gICAgICAgIC8vIGEuIExldCBkZXNjIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRPd25Qcm9wZXJ0eV1dIGludGVybmFsXG4gICAgICAgIC8vICAgIG1ldGhvZCBvZiBzdWJzZXQgd2l0aCBQLlxuICAgICAgICAvLyBiLiBTZXQgZGVzYy5bW1dyaXRhYmxlXV0gdG8gZmFsc2UuXG4gICAgICAgIC8vIGMuIFNldCBkZXNjLltbQ29uZmlndXJhYmxlXV0gdG8gZmFsc2UuXG4gICAgICAgIC8vIGQuIENhbGwgdGhlIFtbRGVmaW5lT3duUHJvcGVydHldXSBpbnRlcm5hbCBtZXRob2Qgb2Ygc3Vic2V0IHdpdGggUCwgZGVzYyxcbiAgICAgICAgLy8gICAgYW5kIHRydWUgYXMgYXJndW1lbnRzLlxuICAgICAgICBkZWZpbmVQcm9wZXJ0eShzdWJzZXQsIFAsIHtcbiAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSwgY29uZmlndXJhYmxlOiBmYWxzZSwgdmFsdWU6IHN1YnNldFtQXVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gXCJGcmVlemVcIiB0aGUgYXJyYXkgc28gbm8gbmV3IGVsZW1lbnRzIGNhbiBiZSBhZGRlZFxuICAgIGRlZmluZVByb3BlcnR5KHN1YnNldCwgJ2xlbmd0aCcsIHsgd3JpdGFibGU6IGZhbHNlIH0pO1xuXG4gICAgLy8gNS4gUmV0dXJuIHN1YnNldFxuICAgIHJldHVybiBzdWJzZXQ7XG59XG5cbi8qKlxuICogVGhlIEdldE9wdGlvbiBhYnN0cmFjdCBvcGVyYXRpb24gZXh0cmFjdHMgdGhlIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eSBuYW1lZFxuICogcHJvcGVydHkgZnJvbSB0aGUgcHJvdmlkZWQgb3B0aW9ucyBvYmplY3QsIGNvbnZlcnRzIGl0IHRvIHRoZSByZXF1aXJlZCB0eXBlLFxuICogY2hlY2tzIHdoZXRoZXIgaXQgaXMgb25lIG9mIGEgTGlzdCBvZiBhbGxvd2VkIHZhbHVlcywgYW5kIGZpbGxzIGluIGEgZmFsbGJhY2tcbiAqIHZhbHVlIGlmIG5lY2Vzc2FyeS5cbiAqL1xuZnVuY3Rpb24gLyo5LjIuOSAqL0dldE9wdGlvbihvcHRpb25zLCBwcm9wZXJ0eSwgdHlwZSwgdmFsdWVzLCBmYWxsYmFjaykge1xuICAgIC8vIDEuIExldCB2YWx1ZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgLy8gICAgb3B0aW9ucyB3aXRoIGFyZ3VtZW50IHByb3BlcnR5LlxuICAgIHZhciB2YWx1ZSA9IG9wdGlvbnNbcHJvcGVydHldO1xuXG4gICAgLy8gMi4gSWYgdmFsdWUgaXMgbm90IHVuZGVmaW5lZCwgdGhlblxuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIGEuIEFzc2VydDogdHlwZSBpcyBcImJvb2xlYW5cIiBvciBcInN0cmluZ1wiLlxuICAgICAgICAvLyBiLiBJZiB0eXBlIGlzIFwiYm9vbGVhblwiLCB0aGVuIGxldCB2YWx1ZSBiZSBUb0Jvb2xlYW4odmFsdWUpLlxuICAgICAgICAvLyBjLiBJZiB0eXBlIGlzIFwic3RyaW5nXCIsIHRoZW4gbGV0IHZhbHVlIGJlIFRvU3RyaW5nKHZhbHVlKS5cbiAgICAgICAgdmFsdWUgPSB0eXBlID09PSAnYm9vbGVhbicgPyBCb29sZWFuKHZhbHVlKSA6IHR5cGUgPT09ICdzdHJpbmcnID8gU3RyaW5nKHZhbHVlKSA6IHZhbHVlO1xuXG4gICAgICAgIC8vIGQuIElmIHZhbHVlcyBpcyBub3QgdW5kZWZpbmVkLCB0aGVuXG4gICAgICAgIGlmICh2YWx1ZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gaS4gSWYgdmFsdWVzIGRvZXMgbm90IGNvbnRhaW4gYW4gZWxlbWVudCBlcXVhbCB0byB2YWx1ZSwgdGhlbiB0aHJvdyBhXG4gICAgICAgICAgICAvLyAgICBSYW5nZUVycm9yIGV4Y2VwdGlvbi5cbiAgICAgICAgICAgIGlmIChhcnJJbmRleE9mLmNhbGwodmFsdWVzLCB2YWx1ZSkgPT09IC0xKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIidcIiArIHZhbHVlICsgXCInIGlzIG5vdCBhbiBhbGxvd2VkIHZhbHVlIGZvciBgXCIgKyBwcm9wZXJ0eSArICdgJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBlLiBSZXR1cm4gdmFsdWUuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgLy8gRWxzZSByZXR1cm4gZmFsbGJhY2suXG4gICAgcmV0dXJuIGZhbGxiYWNrO1xufVxuXG4vKipcbiAqIFRoZSBHZXROdW1iZXJPcHRpb24gYWJzdHJhY3Qgb3BlcmF0aW9uIGV4dHJhY3RzIGEgcHJvcGVydHkgdmFsdWUgZnJvbSB0aGVcbiAqIHByb3ZpZGVkIG9wdGlvbnMgb2JqZWN0LCBjb252ZXJ0cyBpdCB0byBhIE51bWJlciB2YWx1ZSwgY2hlY2tzIHdoZXRoZXIgaXQgaXNcbiAqIGluIHRoZSBhbGxvd2VkIHJhbmdlLCBhbmQgZmlsbHMgaW4gYSBmYWxsYmFjayB2YWx1ZSBpZiBuZWNlc3NhcnkuXG4gKi9cbmZ1bmN0aW9uIC8qIDkuMi4xMCAqL0dldE51bWJlck9wdGlvbihvcHRpb25zLCBwcm9wZXJ0eSwgbWluaW11bSwgbWF4aW11bSwgZmFsbGJhY2spIHtcbiAgICAvLyAxLiBMZXQgdmFsdWUgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZlxuICAgIC8vICAgIG9wdGlvbnMgd2l0aCBhcmd1bWVudCBwcm9wZXJ0eS5cbiAgICB2YXIgdmFsdWUgPSBvcHRpb25zW3Byb3BlcnR5XTtcblxuICAgIC8vIDIuIElmIHZhbHVlIGlzIG5vdCB1bmRlZmluZWQsIHRoZW5cbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBhLiBMZXQgdmFsdWUgYmUgVG9OdW1iZXIodmFsdWUpLlxuICAgICAgICB2YWx1ZSA9IE51bWJlcih2YWx1ZSk7XG5cbiAgICAgICAgLy8gYi4gSWYgdmFsdWUgaXMgTmFOIG9yIGxlc3MgdGhhbiBtaW5pbXVtIG9yIGdyZWF0ZXIgdGhhbiBtYXhpbXVtLCB0aHJvdyBhXG4gICAgICAgIC8vICAgIFJhbmdlRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlIDwgbWluaW11bSB8fCB2YWx1ZSA+IG1heGltdW0pIHRocm93IG5ldyBSYW5nZUVycm9yKCdWYWx1ZSBpcyBub3QgYSBudW1iZXIgb3Igb3V0c2lkZSBhY2NlcHRlZCByYW5nZScpO1xuXG4gICAgICAgIC8vIGMuIFJldHVybiBmbG9vcih2YWx1ZSkuXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHZhbHVlKTtcbiAgICB9XG4gICAgLy8gMy4gRWxzZSByZXR1cm4gZmFsbGJhY2suXG4gICAgcmV0dXJuIGZhbGxiYWNrO1xufVxuXG4vLyA4IFRoZSBJbnRsIE9iamVjdFxudmFyIEludGwgPSB7fTtcblxuLy8gOC4yIEZ1bmN0aW9uIFByb3BlcnRpZXMgb2YgdGhlIEludGwgT2JqZWN0XG5cbi8vIDguMi4xXG4vLyBAc3BlY1t0YzM5L2VjbWE0MDIvbWFzdGVyL3NwZWMvaW50bC5odG1sXVxuLy8gQGNsYXVzZVtzZWMtaW50bC5nZXRjYW5vbmljYWxsb2NhbGVzXVxuSW50bC5nZXRDYW5vbmljYWxMb2NhbGVzID0gZnVuY3Rpb24gKGxvY2FsZXMpIHtcbiAgICAvLyAxLiBMZXQgbGwgYmUgPyBDYW5vbmljYWxpemVMb2NhbGVMaXN0KGxvY2FsZXMpLlxuICAgIHZhciBsbCA9IENhbm9uaWNhbGl6ZUxvY2FsZUxpc3QobG9jYWxlcyk7XG4gICAgLy8gMi4gUmV0dXJuIENyZWF0ZUFycmF5RnJvbUxpc3QobGwpLlxuICAgIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBjb2RlIGluIGxsKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChsbFtjb2RlXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59O1xuXG4vLyBDdXJyZW5jeSBtaW5vciB1bml0cyBvdXRwdXQgZnJvbSBnZXQtNDIxNyBncnVudCB0YXNrLCBmb3JtYXR0ZWRcbnZhciBjdXJyZW5jeU1pbm9yVW5pdHMgPSB7XG4gICAgQkhEOiAzLCBCWVI6IDAsIFhPRjogMCwgQklGOiAwLCBYQUY6IDAsIENMRjogNCwgQ0xQOiAwLCBLTUY6IDAsIERKRjogMCxcbiAgICBYUEY6IDAsIEdORjogMCwgSVNLOiAwLCBJUUQ6IDMsIEpQWTogMCwgSk9EOiAzLCBLUlc6IDAsIEtXRDogMywgTFlEOiAzLFxuICAgIE9NUjogMywgUFlHOiAwLCBSV0Y6IDAsIFRORDogMywgVUdYOiAwLCBVWUk6IDAsIFZVVjogMCwgVk5EOiAwXG59O1xuXG4vLyBEZWZpbmUgdGhlIE51bWJlckZvcm1hdCBjb25zdHJ1Y3RvciBpbnRlcm5hbGx5IHNvIGl0IGNhbm5vdCBiZSB0YWludGVkXG5mdW5jdGlvbiBOdW1iZXJGb3JtYXRDb25zdHJ1Y3RvcigpIHtcbiAgICB2YXIgbG9jYWxlcyA9IGFyZ3VtZW50c1swXTtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50c1sxXTtcblxuICAgIGlmICghdGhpcyB8fCB0aGlzID09PSBJbnRsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW50bC5OdW1iZXJGb3JtYXQobG9jYWxlcywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEluaXRpYWxpemVOdW1iZXJGb3JtYXQodG9PYmplY3QodGhpcyksIGxvY2FsZXMsIG9wdGlvbnMpO1xufVxuXG5kZWZpbmVQcm9wZXJ0eShJbnRsLCAnTnVtYmVyRm9ybWF0Jywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogTnVtYmVyRm9ybWF0Q29uc3RydWN0b3Jcbn0pO1xuXG4vLyBNdXN0IGV4cGxpY2l0bHkgc2V0IHByb3RvdHlwZXMgYXMgdW53cml0YWJsZVxuZGVmaW5lUHJvcGVydHkoSW50bC5OdW1iZXJGb3JtYXQsICdwcm90b3R5cGUnLCB7XG4gICAgd3JpdGFibGU6IGZhbHNlXG59KTtcblxuLyoqXG4gKiBUaGUgYWJzdHJhY3Qgb3BlcmF0aW9uIEluaXRpYWxpemVOdW1iZXJGb3JtYXQgYWNjZXB0cyB0aGUgYXJndW1lbnRzXG4gKiBudW1iZXJGb3JtYXQgKHdoaWNoIG11c3QgYmUgYW4gb2JqZWN0KSwgbG9jYWxlcywgYW5kIG9wdGlvbnMuIEl0IGluaXRpYWxpemVzXG4gKiBudW1iZXJGb3JtYXQgYXMgYSBOdW1iZXJGb3JtYXQgb2JqZWN0LlxuICovXG5mdW5jdGlvbiAvKjExLjEuMS4xICovSW5pdGlhbGl6ZU51bWJlckZvcm1hdChudW1iZXJGb3JtYXQsIGxvY2FsZXMsIG9wdGlvbnMpIHtcbiAgICAvLyBUaGlzIHdpbGwgYmUgYSBpbnRlcm5hbCBwcm9wZXJ0aWVzIG9iamVjdCBpZiB3ZSdyZSBub3QgYWxyZWFkeSBpbml0aWFsaXplZFxuICAgIHZhciBpbnRlcm5hbCA9IGdldEludGVybmFsUHJvcGVydGllcyhudW1iZXJGb3JtYXQpO1xuXG4gICAgLy8gQ3JlYXRlIGFuIG9iamVjdCB3aG9zZSBwcm9wcyBjYW4gYmUgdXNlZCB0byByZXN0b3JlIHRoZSB2YWx1ZXMgb2YgUmVnRXhwIHByb3BzXG4gICAgdmFyIHJlZ2V4cFN0YXRlID0gY3JlYXRlUmVnRXhwUmVzdG9yZSgpO1xuXG4gICAgLy8gMS4gSWYgbnVtYmVyRm9ybWF0IGhhcyBhbiBbW2luaXRpYWxpemVkSW50bE9iamVjdF1dIGludGVybmFsIHByb3BlcnR5IHdpdGhcbiAgICAvLyB2YWx1ZSB0cnVlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXG4gICAgaWYgKGludGVybmFsWydbW2luaXRpYWxpemVkSW50bE9iamVjdF1dJ10gPT09IHRydWUpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2B0aGlzYCBvYmplY3QgaGFzIGFscmVhZHkgYmVlbiBpbml0aWFsaXplZCBhcyBhbiBJbnRsIG9iamVjdCcpO1xuXG4gICAgLy8gTmVlZCB0aGlzIHRvIGFjY2VzcyB0aGUgYGludGVybmFsYCBvYmplY3RcbiAgICBkZWZpbmVQcm9wZXJ0eShudW1iZXJGb3JtYXQsICdfX2dldEludGVybmFsUHJvcGVydGllcycsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuICAgICAgICAgICAgLy8gTk9URTogTm9uLXN0YW5kYXJkLCBmb3IgaW50ZXJuYWwgdXNlIG9ubHlcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHNbMF0gPT09IHNlY3JldCkgcmV0dXJuIGludGVybmFsO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyAyLiBTZXQgdGhlIFtbaW5pdGlhbGl6ZWRJbnRsT2JqZWN0XV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgbnVtYmVyRm9ybWF0IHRvIHRydWUuXG4gICAgaW50ZXJuYWxbJ1tbaW5pdGlhbGl6ZWRJbnRsT2JqZWN0XV0nXSA9IHRydWU7XG5cbiAgICAvLyAzLiBMZXQgcmVxdWVzdGVkTG9jYWxlcyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIENhbm9uaWNhbGl6ZUxvY2FsZUxpc3RcbiAgICAvLyAgICBhYnN0cmFjdCBvcGVyYXRpb24gKGRlZmluZWQgaW4gOS4yLjEpIHdpdGggYXJndW1lbnQgbG9jYWxlcy5cbiAgICB2YXIgcmVxdWVzdGVkTG9jYWxlcyA9IENhbm9uaWNhbGl6ZUxvY2FsZUxpc3QobG9jYWxlcyk7XG5cbiAgICAvLyA0LiBJZiBvcHRpb25zIGlzIHVuZGVmaW5lZCwgdGhlblxuICAgIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpXG4gICAgICAgIC8vIGEuIExldCBvcHRpb25zIGJlIHRoZSByZXN1bHQgb2YgY3JlYXRpbmcgYSBuZXcgb2JqZWN0IGFzIGlmIGJ5IHRoZVxuICAgICAgICAvLyBleHByZXNzaW9uIG5ldyBPYmplY3QoKSB3aGVyZSBPYmplY3QgaXMgdGhlIHN0YW5kYXJkIGJ1aWx0LWluIGNvbnN0cnVjdG9yXG4gICAgICAgIC8vIHdpdGggdGhhdCBuYW1lLlxuICAgICAgICBvcHRpb25zID0ge307XG5cbiAgICAgICAgLy8gNS4gRWxzZVxuICAgIGVsc2VcbiAgICAgICAgLy8gYS4gTGV0IG9wdGlvbnMgYmUgVG9PYmplY3Qob3B0aW9ucykuXG4gICAgICAgIG9wdGlvbnMgPSB0b09iamVjdChvcHRpb25zKTtcblxuICAgIC8vIDYuIExldCBvcHQgYmUgYSBuZXcgUmVjb3JkLlxuICAgIHZhciBvcHQgPSBuZXcgUmVjb3JkKCksXG5cblxuICAgIC8vIDcuIExldCBtYXRjaGVyIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0T3B0aW9uIGFic3RyYWN0IG9wZXJhdGlvblxuICAgIC8vICAgIChkZWZpbmVkIGluIDkuMi45KSB3aXRoIHRoZSBhcmd1bWVudHMgb3B0aW9ucywgXCJsb2NhbGVNYXRjaGVyXCIsIFwic3RyaW5nXCIsXG4gICAgLy8gICAgYSBMaXN0IGNvbnRhaW5pbmcgdGhlIHR3byBTdHJpbmcgdmFsdWVzIFwibG9va3VwXCIgYW5kIFwiYmVzdCBmaXRcIiwgYW5kXG4gICAgLy8gICAgXCJiZXN0IGZpdFwiLlxuICAgIG1hdGNoZXIgPSBHZXRPcHRpb24ob3B0aW9ucywgJ2xvY2FsZU1hdGNoZXInLCAnc3RyaW5nJywgbmV3IExpc3QoJ2xvb2t1cCcsICdiZXN0IGZpdCcpLCAnYmVzdCBmaXQnKTtcblxuICAgIC8vIDguIFNldCBvcHQuW1tsb2NhbGVNYXRjaGVyXV0gdG8gbWF0Y2hlci5cbiAgICBvcHRbJ1tbbG9jYWxlTWF0Y2hlcl1dJ10gPSBtYXRjaGVyO1xuXG4gICAgLy8gOS4gTGV0IE51bWJlckZvcm1hdCBiZSB0aGUgc3RhbmRhcmQgYnVpbHQtaW4gb2JqZWN0IHRoYXQgaXMgdGhlIGluaXRpYWwgdmFsdWVcbiAgICAvLyAgICBvZiBJbnRsLk51bWJlckZvcm1hdC5cbiAgICAvLyAxMC4gTGV0IGxvY2FsZURhdGEgYmUgdGhlIHZhbHVlIG9mIHRoZSBbW2xvY2FsZURhdGFdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZlxuICAgIC8vICAgICBOdW1iZXJGb3JtYXQuXG4gICAgdmFyIGxvY2FsZURhdGEgPSBpbnRlcm5hbHMuTnVtYmVyRm9ybWF0WydbW2xvY2FsZURhdGFdXSddO1xuXG4gICAgLy8gMTEuIExldCByIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgUmVzb2x2ZUxvY2FsZSBhYnN0cmFjdCBvcGVyYXRpb25cbiAgICAvLyAgICAgKGRlZmluZWQgaW4gOS4yLjUpIHdpdGggdGhlIFtbYXZhaWxhYmxlTG9jYWxlc11dIGludGVybmFsIHByb3BlcnR5IG9mXG4gICAgLy8gICAgIE51bWJlckZvcm1hdCwgcmVxdWVzdGVkTG9jYWxlcywgb3B0LCB0aGUgW1tyZWxldmFudEV4dGVuc2lvbktleXNdXVxuICAgIC8vICAgICBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBOdW1iZXJGb3JtYXQsIGFuZCBsb2NhbGVEYXRhLlxuICAgIHZhciByID0gUmVzb2x2ZUxvY2FsZShpbnRlcm5hbHMuTnVtYmVyRm9ybWF0WydbW2F2YWlsYWJsZUxvY2FsZXNdXSddLCByZXF1ZXN0ZWRMb2NhbGVzLCBvcHQsIGludGVybmFscy5OdW1iZXJGb3JtYXRbJ1tbcmVsZXZhbnRFeHRlbnNpb25LZXlzXV0nXSwgbG9jYWxlRGF0YSk7XG5cbiAgICAvLyAxMi4gU2V0IHRoZSBbW2xvY2FsZV1dIGludGVybmFsIHByb3BlcnR5IG9mIG51bWJlckZvcm1hdCB0byB0aGUgdmFsdWUgb2ZcbiAgICAvLyAgICAgci5bW2xvY2FsZV1dLlxuICAgIGludGVybmFsWydbW2xvY2FsZV1dJ10gPSByWydbW2xvY2FsZV1dJ107XG5cbiAgICAvLyAxMy4gU2V0IHRoZSBbW251bWJlcmluZ1N5c3RlbV1dIGludGVybmFsIHByb3BlcnR5IG9mIG51bWJlckZvcm1hdCB0byB0aGUgdmFsdWVcbiAgICAvLyAgICAgb2Ygci5bW251XV0uXG4gICAgaW50ZXJuYWxbJ1tbbnVtYmVyaW5nU3lzdGVtXV0nXSA9IHJbJ1tbbnVdXSddO1xuXG4gICAgLy8gVGhlIHNwZWNpZmljYXRpb24gZG9lc24ndCB0ZWxsIHVzIHRvIGRvIHRoaXMsIGJ1dCBpdCdzIGhlbHBmdWwgbGF0ZXIgb25cbiAgICBpbnRlcm5hbFsnW1tkYXRhTG9jYWxlXV0nXSA9IHJbJ1tbZGF0YUxvY2FsZV1dJ107XG5cbiAgICAvLyAxNC4gTGV0IGRhdGFMb2NhbGUgYmUgdGhlIHZhbHVlIG9mIHIuW1tkYXRhTG9jYWxlXV0uXG4gICAgdmFyIGRhdGFMb2NhbGUgPSByWydbW2RhdGFMb2NhbGVdXSddO1xuXG4gICAgLy8gMTUuIExldCBzIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0T3B0aW9uIGFic3RyYWN0IG9wZXJhdGlvbiB3aXRoIHRoZVxuICAgIC8vICAgICBhcmd1bWVudHMgb3B0aW9ucywgXCJzdHlsZVwiLCBcInN0cmluZ1wiLCBhIExpc3QgY29udGFpbmluZyB0aGUgdGhyZWUgU3RyaW5nXG4gICAgLy8gICAgIHZhbHVlcyBcImRlY2ltYWxcIiwgXCJwZXJjZW50XCIsIGFuZCBcImN1cnJlbmN5XCIsIGFuZCBcImRlY2ltYWxcIi5cbiAgICB2YXIgcyA9IEdldE9wdGlvbihvcHRpb25zLCAnc3R5bGUnLCAnc3RyaW5nJywgbmV3IExpc3QoJ2RlY2ltYWwnLCAncGVyY2VudCcsICdjdXJyZW5jeScpLCAnZGVjaW1hbCcpO1xuXG4gICAgLy8gMTYuIFNldCB0aGUgW1tzdHlsZV1dIGludGVybmFsIHByb3BlcnR5IG9mIG51bWJlckZvcm1hdCB0byBzLlxuICAgIGludGVybmFsWydbW3N0eWxlXV0nXSA9IHM7XG5cbiAgICAvLyAxNy4gTGV0IGMgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXRPcHRpb24gYWJzdHJhY3Qgb3BlcmF0aW9uIHdpdGggdGhlXG4gICAgLy8gICAgIGFyZ3VtZW50cyBvcHRpb25zLCBcImN1cnJlbmN5XCIsIFwic3RyaW5nXCIsIHVuZGVmaW5lZCwgYW5kIHVuZGVmaW5lZC5cbiAgICB2YXIgYyA9IEdldE9wdGlvbihvcHRpb25zLCAnY3VycmVuY3knLCAnc3RyaW5nJyk7XG5cbiAgICAvLyAxOC4gSWYgYyBpcyBub3QgdW5kZWZpbmVkIGFuZCB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlXG4gICAgLy8gICAgIElzV2VsbEZvcm1lZEN1cnJlbmN5Q29kZSBhYnN0cmFjdCBvcGVyYXRpb24gKGRlZmluZWQgaW4gNi4zLjEpIHdpdGhcbiAgICAvLyAgICAgYXJndW1lbnQgYyBpcyBmYWxzZSwgdGhlbiB0aHJvdyBhIFJhbmdlRXJyb3IgZXhjZXB0aW9uLlxuICAgIGlmIChjICE9PSB1bmRlZmluZWQgJiYgIUlzV2VsbEZvcm1lZEN1cnJlbmN5Q29kZShjKSkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCInXCIgKyBjICsgXCInIGlzIG5vdCBhIHZhbGlkIGN1cnJlbmN5IGNvZGVcIik7XG5cbiAgICAvLyAxOS4gSWYgcyBpcyBcImN1cnJlbmN5XCIgYW5kIGMgaXMgdW5kZWZpbmVkLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXG4gICAgaWYgKHMgPT09ICdjdXJyZW5jeScgJiYgYyA9PT0gdW5kZWZpbmVkKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdDdXJyZW5jeSBjb2RlIGlzIHJlcXVpcmVkIHdoZW4gc3R5bGUgaXMgY3VycmVuY3knKTtcblxuICAgIHZhciBjRGlnaXRzID0gdm9pZCAwO1xuXG4gICAgLy8gMjAuIElmIHMgaXMgXCJjdXJyZW5jeVwiLCB0aGVuXG4gICAgaWYgKHMgPT09ICdjdXJyZW5jeScpIHtcbiAgICAgICAgLy8gYS4gTGV0IGMgYmUgdGhlIHJlc3VsdCBvZiBjb252ZXJ0aW5nIGMgdG8gdXBwZXIgY2FzZSBhcyBzcGVjaWZpZWQgaW4gNi4xLlxuICAgICAgICBjID0gYy50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgIC8vIGIuIFNldCB0aGUgW1tjdXJyZW5jeV1dIGludGVybmFsIHByb3BlcnR5IG9mIG51bWJlckZvcm1hdCB0byBjLlxuICAgICAgICBpbnRlcm5hbFsnW1tjdXJyZW5jeV1dJ10gPSBjO1xuXG4gICAgICAgIC8vIGMuIExldCBjRGlnaXRzIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgQ3VycmVuY3lEaWdpdHMgYWJzdHJhY3RcbiAgICAgICAgLy8gICAgb3BlcmF0aW9uIChkZWZpbmVkIGJlbG93KSB3aXRoIGFyZ3VtZW50IGMuXG4gICAgICAgIGNEaWdpdHMgPSBDdXJyZW5jeURpZ2l0cyhjKTtcbiAgICB9XG5cbiAgICAvLyAyMS4gTGV0IGNkIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0T3B0aW9uIGFic3RyYWN0IG9wZXJhdGlvbiB3aXRoIHRoZVxuICAgIC8vICAgICBhcmd1bWVudHMgb3B0aW9ucywgXCJjdXJyZW5jeURpc3BsYXlcIiwgXCJzdHJpbmdcIiwgYSBMaXN0IGNvbnRhaW5pbmcgdGhlXG4gICAgLy8gICAgIHRocmVlIFN0cmluZyB2YWx1ZXMgXCJjb2RlXCIsIFwic3ltYm9sXCIsIGFuZCBcIm5hbWVcIiwgYW5kIFwic3ltYm9sXCIuXG4gICAgdmFyIGNkID0gR2V0T3B0aW9uKG9wdGlvbnMsICdjdXJyZW5jeURpc3BsYXknLCAnc3RyaW5nJywgbmV3IExpc3QoJ2NvZGUnLCAnc3ltYm9sJywgJ25hbWUnKSwgJ3N5bWJvbCcpO1xuXG4gICAgLy8gMjIuIElmIHMgaXMgXCJjdXJyZW5jeVwiLCB0aGVuIHNldCB0aGUgW1tjdXJyZW5jeURpc3BsYXldXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZlxuICAgIC8vICAgICBudW1iZXJGb3JtYXQgdG8gY2QuXG4gICAgaWYgKHMgPT09ICdjdXJyZW5jeScpIGludGVybmFsWydbW2N1cnJlbmN5RGlzcGxheV1dJ10gPSBjZDtcblxuICAgIC8vIDIzLiBMZXQgbW5pZCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldE51bWJlck9wdGlvbiBhYnN0cmFjdCBvcGVyYXRpb25cbiAgICAvLyAgICAgKGRlZmluZWQgaW4gOS4yLjEwKSB3aXRoIGFyZ3VtZW50cyBvcHRpb25zLCBcIm1pbmltdW1JbnRlZ2VyRGlnaXRzXCIsIDEsIDIxLFxuICAgIC8vICAgICBhbmQgMS5cbiAgICB2YXIgbW5pZCA9IEdldE51bWJlck9wdGlvbihvcHRpb25zLCAnbWluaW11bUludGVnZXJEaWdpdHMnLCAxLCAyMSwgMSk7XG5cbiAgICAvLyAyNC4gU2V0IHRoZSBbW21pbmltdW1JbnRlZ2VyRGlnaXRzXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgbnVtYmVyRm9ybWF0IHRvIG1uaWQuXG4gICAgaW50ZXJuYWxbJ1tbbWluaW11bUludGVnZXJEaWdpdHNdXSddID0gbW5pZDtcblxuICAgIC8vIDI1LiBJZiBzIGlzIFwiY3VycmVuY3lcIiwgdGhlbiBsZXQgbW5mZERlZmF1bHQgYmUgY0RpZ2l0czsgZWxzZSBsZXQgbW5mZERlZmF1bHRcbiAgICAvLyAgICAgYmUgMC5cbiAgICB2YXIgbW5mZERlZmF1bHQgPSBzID09PSAnY3VycmVuY3knID8gY0RpZ2l0cyA6IDA7XG5cbiAgICAvLyAyNi4gTGV0IG1uZmQgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXROdW1iZXJPcHRpb24gYWJzdHJhY3Qgb3BlcmF0aW9uXG4gICAgLy8gICAgIHdpdGggYXJndW1lbnRzIG9wdGlvbnMsIFwibWluaW11bUZyYWN0aW9uRGlnaXRzXCIsIDAsIDIwLCBhbmQgbW5mZERlZmF1bHQuXG4gICAgdmFyIG1uZmQgPSBHZXROdW1iZXJPcHRpb24ob3B0aW9ucywgJ21pbmltdW1GcmFjdGlvbkRpZ2l0cycsIDAsIDIwLCBtbmZkRGVmYXVsdCk7XG5cbiAgICAvLyAyNy4gU2V0IHRoZSBbW21pbmltdW1GcmFjdGlvbkRpZ2l0c11dIGludGVybmFsIHByb3BlcnR5IG9mIG51bWJlckZvcm1hdCB0byBtbmZkLlxuICAgIGludGVybmFsWydbW21pbmltdW1GcmFjdGlvbkRpZ2l0c11dJ10gPSBtbmZkO1xuXG4gICAgLy8gMjguIElmIHMgaXMgXCJjdXJyZW5jeVwiLCB0aGVuIGxldCBteGZkRGVmYXVsdCBiZSBtYXgobW5mZCwgY0RpZ2l0cyk7IGVsc2UgaWYgc1xuICAgIC8vICAgICBpcyBcInBlcmNlbnRcIiwgdGhlbiBsZXQgbXhmZERlZmF1bHQgYmUgbWF4KG1uZmQsIDApOyBlbHNlIGxldCBteGZkRGVmYXVsdFxuICAgIC8vICAgICBiZSBtYXgobW5mZCwgMykuXG4gICAgdmFyIG14ZmREZWZhdWx0ID0gcyA9PT0gJ2N1cnJlbmN5JyA/IE1hdGgubWF4KG1uZmQsIGNEaWdpdHMpIDogcyA9PT0gJ3BlcmNlbnQnID8gTWF0aC5tYXgobW5mZCwgMCkgOiBNYXRoLm1heChtbmZkLCAzKTtcblxuICAgIC8vIDI5LiBMZXQgbXhmZCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldE51bWJlck9wdGlvbiBhYnN0cmFjdCBvcGVyYXRpb25cbiAgICAvLyAgICAgd2l0aCBhcmd1bWVudHMgb3B0aW9ucywgXCJtYXhpbXVtRnJhY3Rpb25EaWdpdHNcIiwgbW5mZCwgMjAsIGFuZCBteGZkRGVmYXVsdC5cbiAgICB2YXIgbXhmZCA9IEdldE51bWJlck9wdGlvbihvcHRpb25zLCAnbWF4aW11bUZyYWN0aW9uRGlnaXRzJywgbW5mZCwgMjAsIG14ZmREZWZhdWx0KTtcblxuICAgIC8vIDMwLiBTZXQgdGhlIFtbbWF4aW11bUZyYWN0aW9uRGlnaXRzXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgbnVtYmVyRm9ybWF0IHRvIG14ZmQuXG4gICAgaW50ZXJuYWxbJ1tbbWF4aW11bUZyYWN0aW9uRGlnaXRzXV0nXSA9IG14ZmQ7XG5cbiAgICAvLyAzMS4gTGV0IG1uc2QgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZiBvcHRpb25zXG4gICAgLy8gICAgIHdpdGggYXJndW1lbnQgXCJtaW5pbXVtU2lnbmlmaWNhbnREaWdpdHNcIi5cbiAgICB2YXIgbW5zZCA9IG9wdGlvbnMubWluaW11bVNpZ25pZmljYW50RGlnaXRzO1xuXG4gICAgLy8gMzIuIExldCBteHNkIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2Ygb3B0aW9uc1xuICAgIC8vICAgICB3aXRoIGFyZ3VtZW50IFwibWF4aW11bVNpZ25pZmljYW50RGlnaXRzXCIuXG4gICAgdmFyIG14c2QgPSBvcHRpb25zLm1heGltdW1TaWduaWZpY2FudERpZ2l0cztcblxuICAgIC8vIDMzLiBJZiBtbnNkIGlzIG5vdCB1bmRlZmluZWQgb3IgbXhzZCBpcyBub3QgdW5kZWZpbmVkLCB0aGVuOlxuICAgIGlmIChtbnNkICE9PSB1bmRlZmluZWQgfHwgbXhzZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIGEuIExldCBtbnNkIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0TnVtYmVyT3B0aW9uIGFic3RyYWN0XG4gICAgICAgIC8vICAgIG9wZXJhdGlvbiB3aXRoIGFyZ3VtZW50cyBvcHRpb25zLCBcIm1pbmltdW1TaWduaWZpY2FudERpZ2l0c1wiLCAxLCAyMSxcbiAgICAgICAgLy8gICAgYW5kIDEuXG4gICAgICAgIG1uc2QgPSBHZXROdW1iZXJPcHRpb24ob3B0aW9ucywgJ21pbmltdW1TaWduaWZpY2FudERpZ2l0cycsIDEsIDIxLCAxKTtcblxuICAgICAgICAvLyBiLiBMZXQgbXhzZCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldE51bWJlck9wdGlvbiBhYnN0cmFjdFxuICAgICAgICAvLyAgICAgb3BlcmF0aW9uIHdpdGggYXJndW1lbnRzIG9wdGlvbnMsIFwibWF4aW11bVNpZ25pZmljYW50RGlnaXRzXCIsIG1uc2QsXG4gICAgICAgIC8vICAgICAyMSwgYW5kIDIxLlxuICAgICAgICBteHNkID0gR2V0TnVtYmVyT3B0aW9uKG9wdGlvbnMsICdtYXhpbXVtU2lnbmlmaWNhbnREaWdpdHMnLCBtbnNkLCAyMSwgMjEpO1xuXG4gICAgICAgIC8vIGMuIFNldCB0aGUgW1ttaW5pbXVtU2lnbmlmaWNhbnREaWdpdHNdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBudW1iZXJGb3JtYXRcbiAgICAgICAgLy8gICAgdG8gbW5zZCwgYW5kIHRoZSBbW21heGltdW1TaWduaWZpY2FudERpZ2l0c11dIGludGVybmFsIHByb3BlcnR5IG9mXG4gICAgICAgIC8vICAgIG51bWJlckZvcm1hdCB0byBteHNkLlxuICAgICAgICBpbnRlcm5hbFsnW1ttaW5pbXVtU2lnbmlmaWNhbnREaWdpdHNdXSddID0gbW5zZDtcbiAgICAgICAgaW50ZXJuYWxbJ1tbbWF4aW11bVNpZ25pZmljYW50RGlnaXRzXV0nXSA9IG14c2Q7XG4gICAgfVxuICAgIC8vIDM0LiBMZXQgZyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldE9wdGlvbiBhYnN0cmFjdCBvcGVyYXRpb24gd2l0aCB0aGVcbiAgICAvLyAgICAgYXJndW1lbnRzIG9wdGlvbnMsIFwidXNlR3JvdXBpbmdcIiwgXCJib29sZWFuXCIsIHVuZGVmaW5lZCwgYW5kIHRydWUuXG4gICAgdmFyIGcgPSBHZXRPcHRpb24ob3B0aW9ucywgJ3VzZUdyb3VwaW5nJywgJ2Jvb2xlYW4nLCB1bmRlZmluZWQsIHRydWUpO1xuXG4gICAgLy8gMzUuIFNldCB0aGUgW1t1c2VHcm91cGluZ11dIGludGVybmFsIHByb3BlcnR5IG9mIG51bWJlckZvcm1hdCB0byBnLlxuICAgIGludGVybmFsWydbW3VzZUdyb3VwaW5nXV0nXSA9IGc7XG5cbiAgICAvLyAzNi4gTGV0IGRhdGFMb2NhbGVEYXRhIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAvLyAgICAgbG9jYWxlRGF0YSB3aXRoIGFyZ3VtZW50IGRhdGFMb2NhbGUuXG4gICAgdmFyIGRhdGFMb2NhbGVEYXRhID0gbG9jYWxlRGF0YVtkYXRhTG9jYWxlXTtcblxuICAgIC8vIDM3LiBMZXQgcGF0dGVybnMgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZlxuICAgIC8vICAgICBkYXRhTG9jYWxlRGF0YSB3aXRoIGFyZ3VtZW50IFwicGF0dGVybnNcIi5cbiAgICB2YXIgcGF0dGVybnMgPSBkYXRhTG9jYWxlRGF0YS5wYXR0ZXJucztcblxuICAgIC8vIDM4LiBBc3NlcnQ6IHBhdHRlcm5zIGlzIGFuIG9iamVjdCAoc2VlIDExLjIuMylcblxuICAgIC8vIDM5LiBMZXQgc3R5bGVQYXR0ZXJucyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgLy8gICAgIHBhdHRlcm5zIHdpdGggYXJndW1lbnQgcy5cbiAgICB2YXIgc3R5bGVQYXR0ZXJucyA9IHBhdHRlcm5zW3NdO1xuXG4gICAgLy8gNDAuIFNldCB0aGUgW1twb3NpdGl2ZVBhdHRlcm5dXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBudW1iZXJGb3JtYXQgdG8gdGhlXG4gICAgLy8gICAgIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZiBzdHlsZVBhdHRlcm5zIHdpdGggdGhlXG4gICAgLy8gICAgIGFyZ3VtZW50IFwicG9zaXRpdmVQYXR0ZXJuXCIuXG4gICAgaW50ZXJuYWxbJ1tbcG9zaXRpdmVQYXR0ZXJuXV0nXSA9IHN0eWxlUGF0dGVybnMucG9zaXRpdmVQYXR0ZXJuO1xuXG4gICAgLy8gNDEuIFNldCB0aGUgW1tuZWdhdGl2ZVBhdHRlcm5dXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBudW1iZXJGb3JtYXQgdG8gdGhlXG4gICAgLy8gICAgIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZiBzdHlsZVBhdHRlcm5zIHdpdGggdGhlXG4gICAgLy8gICAgIGFyZ3VtZW50IFwibmVnYXRpdmVQYXR0ZXJuXCIuXG4gICAgaW50ZXJuYWxbJ1tbbmVnYXRpdmVQYXR0ZXJuXV0nXSA9IHN0eWxlUGF0dGVybnMubmVnYXRpdmVQYXR0ZXJuO1xuXG4gICAgLy8gNDIuIFNldCB0aGUgW1tib3VuZEZvcm1hdF1dIGludGVybmFsIHByb3BlcnR5IG9mIG51bWJlckZvcm1hdCB0byB1bmRlZmluZWQuXG4gICAgaW50ZXJuYWxbJ1tbYm91bmRGb3JtYXRdXSddID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gNDMuIFNldCB0aGUgW1tpbml0aWFsaXplZE51bWJlckZvcm1hdF1dIGludGVybmFsIHByb3BlcnR5IG9mIG51bWJlckZvcm1hdCB0b1xuICAgIC8vICAgICB0cnVlLlxuICAgIGludGVybmFsWydbW2luaXRpYWxpemVkTnVtYmVyRm9ybWF0XV0nXSA9IHRydWU7XG5cbiAgICAvLyBJbiBFUzMsIHdlIG5lZWQgdG8gcHJlLWJpbmQgdGhlIGZvcm1hdCgpIGZ1bmN0aW9uXG4gICAgaWYgKGVzMykgbnVtYmVyRm9ybWF0LmZvcm1hdCA9IEdldEZvcm1hdE51bWJlci5jYWxsKG51bWJlckZvcm1hdCk7XG5cbiAgICAvLyBSZXN0b3JlIHRoZSBSZWdFeHAgcHJvcGVydGllc1xuICAgIHJlZ2V4cFN0YXRlLmV4cC50ZXN0KHJlZ2V4cFN0YXRlLmlucHV0KTtcblxuICAgIC8vIFJldHVybiB0aGUgbmV3bHkgaW5pdGlhbGlzZWQgb2JqZWN0XG4gICAgcmV0dXJuIG51bWJlckZvcm1hdDtcbn1cblxuZnVuY3Rpb24gQ3VycmVuY3lEaWdpdHMoY3VycmVuY3kpIHtcbiAgICAvLyBXaGVuIHRoZSBDdXJyZW5jeURpZ2l0cyBhYnN0cmFjdCBvcGVyYXRpb24gaXMgY2FsbGVkIHdpdGggYW4gYXJndW1lbnQgY3VycmVuY3lcbiAgICAvLyAod2hpY2ggbXVzdCBiZSBhbiB1cHBlciBjYXNlIFN0cmluZyB2YWx1ZSksIHRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHRha2VuOlxuXG4gICAgLy8gMS4gSWYgdGhlIElTTyA0MjE3IGN1cnJlbmN5IGFuZCBmdW5kcyBjb2RlIGxpc3QgY29udGFpbnMgY3VycmVuY3kgYXMgYW5cbiAgICAvLyBhbHBoYWJldGljIGNvZGUsIHRoZW4gcmV0dXJuIHRoZSBtaW5vciB1bml0IHZhbHVlIGNvcnJlc3BvbmRpbmcgdG8gdGhlXG4gICAgLy8gY3VycmVuY3kgZnJvbSB0aGUgbGlzdDsgZWxzZSByZXR1cm4gMi5cbiAgICByZXR1cm4gY3VycmVuY3lNaW5vclVuaXRzW2N1cnJlbmN5XSAhPT0gdW5kZWZpbmVkID8gY3VycmVuY3lNaW5vclVuaXRzW2N1cnJlbmN5XSA6IDI7XG59XG5cbi8qIDExLjIuMyAqL2ludGVybmFscy5OdW1iZXJGb3JtYXQgPSB7XG4gICAgJ1tbYXZhaWxhYmxlTG9jYWxlc11dJzogW10sXG4gICAgJ1tbcmVsZXZhbnRFeHRlbnNpb25LZXlzXV0nOiBbJ251J10sXG4gICAgJ1tbbG9jYWxlRGF0YV1dJzoge31cbn07XG5cbi8qKlxuICogV2hlbiB0aGUgc3VwcG9ydGVkTG9jYWxlc09mIG1ldGhvZCBvZiBJbnRsLk51bWJlckZvcm1hdCBpcyBjYWxsZWQsIHRoZVxuICogZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAqL1xuLyogMTEuMi4yICovXG5kZWZpbmVQcm9wZXJ0eShJbnRsLk51bWJlckZvcm1hdCwgJ3N1cHBvcnRlZExvY2FsZXNPZicsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgdmFsdWU6IGZuQmluZC5jYWxsKGZ1bmN0aW9uIChsb2NhbGVzKSB7XG4gICAgICAgIC8vIEJvdW5kIGZ1bmN0aW9ucyBvbmx5IGhhdmUgdGhlIGB0aGlzYCB2YWx1ZSBhbHRlcmVkIGlmIGJlaW5nIHVzZWQgYXMgYSBjb25zdHJ1Y3RvcixcbiAgICAgICAgLy8gdGhpcyBsZXRzIHVzIGltaXRhdGUgYSBuYXRpdmUgZnVuY3Rpb24gdGhhdCBoYXMgbm8gY29uc3RydWN0b3JcbiAgICAgICAgaWYgKCFob3AuY2FsbCh0aGlzLCAnW1thdmFpbGFibGVMb2NhbGVzXV0nKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignc3VwcG9ydGVkTG9jYWxlc09mKCkgaXMgbm90IGEgY29uc3RydWN0b3InKTtcblxuICAgICAgICAvLyBDcmVhdGUgYW4gb2JqZWN0IHdob3NlIHByb3BzIGNhbiBiZSB1c2VkIHRvIHJlc3RvcmUgdGhlIHZhbHVlcyBvZiBSZWdFeHAgcHJvcHNcbiAgICAgICAgdmFyIHJlZ2V4cFN0YXRlID0gY3JlYXRlUmVnRXhwUmVzdG9yZSgpLFxuXG5cbiAgICAgICAgLy8gMS4gSWYgb3B0aW9ucyBpcyBub3QgcHJvdmlkZWQsIHRoZW4gbGV0IG9wdGlvbnMgYmUgdW5kZWZpbmVkLlxuICAgICAgICBvcHRpb25zID0gYXJndW1lbnRzWzFdLFxuXG5cbiAgICAgICAgLy8gMi4gTGV0IGF2YWlsYWJsZUxvY2FsZXMgYmUgdGhlIHZhbHVlIG9mIHRoZSBbW2F2YWlsYWJsZUxvY2FsZXNdXSBpbnRlcm5hbFxuICAgICAgICAvLyAgICBwcm9wZXJ0eSBvZiB0aGUgc3RhbmRhcmQgYnVpbHQtaW4gb2JqZWN0IHRoYXQgaXMgdGhlIGluaXRpYWwgdmFsdWUgb2ZcbiAgICAgICAgLy8gICAgSW50bC5OdW1iZXJGb3JtYXQuXG5cbiAgICAgICAgYXZhaWxhYmxlTG9jYWxlcyA9IHRoaXNbJ1tbYXZhaWxhYmxlTG9jYWxlc11dJ10sXG5cblxuICAgICAgICAvLyAzLiBMZXQgcmVxdWVzdGVkTG9jYWxlcyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIENhbm9uaWNhbGl6ZUxvY2FsZUxpc3RcbiAgICAgICAgLy8gICAgYWJzdHJhY3Qgb3BlcmF0aW9uIChkZWZpbmVkIGluIDkuMi4xKSB3aXRoIGFyZ3VtZW50IGxvY2FsZXMuXG4gICAgICAgIHJlcXVlc3RlZExvY2FsZXMgPSBDYW5vbmljYWxpemVMb2NhbGVMaXN0KGxvY2FsZXMpO1xuXG4gICAgICAgIC8vIFJlc3RvcmUgdGhlIFJlZ0V4cCBwcm9wZXJ0aWVzXG4gICAgICAgIHJlZ2V4cFN0YXRlLmV4cC50ZXN0KHJlZ2V4cFN0YXRlLmlucHV0KTtcblxuICAgICAgICAvLyA0LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBTdXBwb3J0ZWRMb2NhbGVzIGFic3RyYWN0IG9wZXJhdGlvblxuICAgICAgICAvLyAgICAoZGVmaW5lZCBpbiA5LjIuOCkgd2l0aCBhcmd1bWVudHMgYXZhaWxhYmxlTG9jYWxlcywgcmVxdWVzdGVkTG9jYWxlcyxcbiAgICAgICAgLy8gICAgYW5kIG9wdGlvbnMuXG4gICAgICAgIHJldHVybiBTdXBwb3J0ZWRMb2NhbGVzKGF2YWlsYWJsZUxvY2FsZXMsIHJlcXVlc3RlZExvY2FsZXMsIG9wdGlvbnMpO1xuICAgIH0sIGludGVybmFscy5OdW1iZXJGb3JtYXQpXG59KTtcblxuLyoqXG4gKiBUaGlzIG5hbWVkIGFjY2Vzc29yIHByb3BlcnR5IHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGZvcm1hdHMgYSBudW1iZXJcbiAqIGFjY29yZGluZyB0byB0aGUgZWZmZWN0aXZlIGxvY2FsZSBhbmQgdGhlIGZvcm1hdHRpbmcgb3B0aW9ucyBvZiB0aGlzXG4gKiBOdW1iZXJGb3JtYXQgb2JqZWN0LlxuICovXG4vKiAxMS4zLjIgKi9kZWZpbmVQcm9wZXJ0eShJbnRsLk51bWJlckZvcm1hdC5wcm90b3R5cGUsICdmb3JtYXQnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogR2V0Rm9ybWF0TnVtYmVyXG59KTtcblxuZnVuY3Rpb24gR2V0Rm9ybWF0TnVtYmVyKCkge1xuICAgIHZhciBpbnRlcm5hbCA9IHRoaXMgIT09IG51bGwgJiYgYmFiZWxIZWxwZXJzW1widHlwZW9mXCJdKHRoaXMpID09PSAnb2JqZWN0JyAmJiBnZXRJbnRlcm5hbFByb3BlcnRpZXModGhpcyk7XG5cbiAgICAvLyBTYXRpc2Z5IHRlc3QgMTEuM19iXG4gICAgaWYgKCFpbnRlcm5hbCB8fCAhaW50ZXJuYWxbJ1tbaW5pdGlhbGl6ZWROdW1iZXJGb3JtYXRdXSddKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdgdGhpc2AgdmFsdWUgZm9yIGZvcm1hdCgpIGlzIG5vdCBhbiBpbml0aWFsaXplZCBJbnRsLk51bWJlckZvcm1hdCBvYmplY3QuJyk7XG5cbiAgICAvLyBUaGUgdmFsdWUgb2YgdGhlIFtbR2V0XV0gYXR0cmlidXRlIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyB0aGUgZm9sbG93aW5nXG4gICAgLy8gc3RlcHM6XG5cbiAgICAvLyAxLiBJZiB0aGUgW1tib3VuZEZvcm1hdF1dIGludGVybmFsIHByb3BlcnR5IG9mIHRoaXMgTnVtYmVyRm9ybWF0IG9iamVjdFxuICAgIC8vICAgIGlzIHVuZGVmaW5lZCwgdGhlbjpcbiAgICBpZiAoaW50ZXJuYWxbJ1tbYm91bmRGb3JtYXRdXSddID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gYS4gTGV0IEYgYmUgYSBGdW5jdGlvbiBvYmplY3QsIHdpdGggaW50ZXJuYWwgcHJvcGVydGllcyBzZXQgYXNcbiAgICAgICAgLy8gICAgc3BlY2lmaWVkIGZvciBidWlsdC1pbiBmdW5jdGlvbnMgaW4gRVM1LCAxNSwgb3Igc3VjY2Vzc29yLCBhbmQgdGhlXG4gICAgICAgIC8vICAgIGxlbmd0aCBwcm9wZXJ0eSBzZXQgdG8gMSwgdGhhdCB0YWtlcyB0aGUgYXJndW1lbnQgdmFsdWUgYW5kXG4gICAgICAgIC8vICAgIHBlcmZvcm1zIHRoZSBmb2xsb3dpbmcgc3RlcHM6XG4gICAgICAgIHZhciBGID0gZnVuY3Rpb24gRih2YWx1ZSkge1xuICAgICAgICAgICAgLy8gaS4gSWYgdmFsdWUgaXMgbm90IHByb3ZpZGVkLCB0aGVuIGxldCB2YWx1ZSBiZSB1bmRlZmluZWQuXG4gICAgICAgICAgICAvLyBpaS4gTGV0IHggYmUgVG9OdW1iZXIodmFsdWUpLlxuICAgICAgICAgICAgLy8gaWlpLiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBGb3JtYXROdW1iZXIgYWJzdHJhY3RcbiAgICAgICAgICAgIC8vICAgICAgb3BlcmF0aW9uIChkZWZpbmVkIGJlbG93KSB3aXRoIGFyZ3VtZW50cyB0aGlzIGFuZCB4LlxuICAgICAgICAgICAgcmV0dXJuIEZvcm1hdE51bWJlcih0aGlzLCAvKiB4ID0gKi9OdW1iZXIodmFsdWUpKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBiLiBMZXQgYmluZCBiZSB0aGUgc3RhbmRhcmQgYnVpbHQtaW4gZnVuY3Rpb24gb2JqZWN0IGRlZmluZWQgaW4gRVM1LFxuICAgICAgICAvLyAgICAxNS4zLjQuNS5cbiAgICAgICAgLy8gYy4gTGV0IGJmIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgICAgIC8vICAgIGJpbmQgd2l0aCBGIGFzIHRoZSB0aGlzIHZhbHVlIGFuZCBhbiBhcmd1bWVudCBsaXN0IGNvbnRhaW5pbmdcbiAgICAgICAgLy8gICAgdGhlIHNpbmdsZSBpdGVtIHRoaXMuXG4gICAgICAgIHZhciBiZiA9IGZuQmluZC5jYWxsKEYsIHRoaXMpO1xuXG4gICAgICAgIC8vIGQuIFNldCB0aGUgW1tib3VuZEZvcm1hdF1dIGludGVybmFsIHByb3BlcnR5IG9mIHRoaXMgTnVtYmVyRm9ybWF0XG4gICAgICAgIC8vICAgIG9iamVjdCB0byBiZi5cbiAgICAgICAgaW50ZXJuYWxbJ1tbYm91bmRGb3JtYXRdXSddID0gYmY7XG4gICAgfVxuICAgIC8vIFJldHVybiB0aGUgdmFsdWUgb2YgdGhlIFtbYm91bmRGb3JtYXRdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiB0aGlzXG4gICAgLy8gTnVtYmVyRm9ybWF0IG9iamVjdC5cbiAgICByZXR1cm4gaW50ZXJuYWxbJ1tbYm91bmRGb3JtYXRdXSddO1xufVxuXG5JbnRsLk51bWJlckZvcm1hdC5wcm90b3R5cGUuZm9ybWF0VG9QYXJ0cyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciBpbnRlcm5hbCA9IHRoaXMgIT09IG51bGwgJiYgYmFiZWxIZWxwZXJzW1widHlwZW9mXCJdKHRoaXMpID09PSAnb2JqZWN0JyAmJiBnZXRJbnRlcm5hbFByb3BlcnRpZXModGhpcyk7XG4gICAgaWYgKCFpbnRlcm5hbCB8fCAhaW50ZXJuYWxbJ1tbaW5pdGlhbGl6ZWROdW1iZXJGb3JtYXRdXSddKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdgdGhpc2AgdmFsdWUgZm9yIGZvcm1hdFRvUGFydHMoKSBpcyBub3QgYW4gaW5pdGlhbGl6ZWQgSW50bC5OdW1iZXJGb3JtYXQgb2JqZWN0LicpO1xuXG4gICAgdmFyIHggPSBOdW1iZXIodmFsdWUpO1xuICAgIHJldHVybiBGb3JtYXROdW1iZXJUb1BhcnRzKHRoaXMsIHgpO1xufTtcblxuLypcbiAqIEBzcGVjW3N0YXNtL2VjbWE0MDIvbnVtYmVyLWZvcm1hdC10by1wYXJ0cy9zcGVjL251bWJlcmZvcm1hdC5odG1sXVxuICogQGNsYXVzZVtzZWMtZm9ybWF0bnVtYmVydG9wYXJ0c11cbiAqL1xuZnVuY3Rpb24gRm9ybWF0TnVtYmVyVG9QYXJ0cyhudW1iZXJGb3JtYXQsIHgpIHtcbiAgICAvLyAxLiBMZXQgcGFydHMgYmUgPyBQYXJ0aXRpb25OdW1iZXJQYXR0ZXJuKG51bWJlckZvcm1hdCwgeCkuXG4gICAgdmFyIHBhcnRzID0gUGFydGl0aW9uTnVtYmVyUGF0dGVybihudW1iZXJGb3JtYXQsIHgpO1xuICAgIC8vIDIuIExldCByZXN1bHQgYmUgQXJyYXlDcmVhdGUoMCkuXG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIC8vIDMuIExldCBuIGJlIDAuXG4gICAgdmFyIG4gPSAwO1xuICAgIC8vIDQuIEZvciBlYWNoIHBhcnQgaW4gcGFydHMsIGRvOlxuICAgIGZvciAodmFyIGkgPSAwOyBwYXJ0cy5sZW5ndGggPiBpOyBpKyspIHtcbiAgICAgICAgdmFyIHBhcnQgPSBwYXJ0c1tpXTtcbiAgICAgICAgLy8gYS4gTGV0IE8gYmUgT2JqZWN0Q3JlYXRlKCVPYmplY3RQcm90b3R5cGUlKS5cbiAgICAgICAgdmFyIE8gPSB7fTtcbiAgICAgICAgLy8gYS4gUGVyZm9ybSA/IENyZWF0ZURhdGFQcm9wZXJ0eU9yVGhyb3coTywgXCJ0eXBlXCIsIHBhcnQuW1t0eXBlXV0pLlxuICAgICAgICBPLnR5cGUgPSBwYXJ0WydbW3R5cGVdXSddO1xuICAgICAgICAvLyBhLiBQZXJmb3JtID8gQ3JlYXRlRGF0YVByb3BlcnR5T3JUaHJvdyhPLCBcInZhbHVlXCIsIHBhcnQuW1t2YWx1ZV1dKS5cbiAgICAgICAgTy52YWx1ZSA9IHBhcnRbJ1tbdmFsdWVdXSddO1xuICAgICAgICAvLyBhLiBQZXJmb3JtID8gQ3JlYXRlRGF0YVByb3BlcnR5T3JUaHJvdyhyZXN1bHQsID8gVG9TdHJpbmcobiksIE8pLlxuICAgICAgICByZXN1bHRbbl0gPSBPO1xuICAgICAgICAvLyBhLiBJbmNyZW1lbnQgbiBieSAxLlxuICAgICAgICBuICs9IDE7XG4gICAgfVxuICAgIC8vIDUuIFJldHVybiByZXN1bHQuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLypcbiAqIEBzcGVjW3N0YXNtL2VjbWE0MDIvbnVtYmVyLWZvcm1hdC10by1wYXJ0cy9zcGVjL251bWJlcmZvcm1hdC5odG1sXVxuICogQGNsYXVzZVtzZWMtcGFydGl0aW9ubnVtYmVycGF0dGVybl1cbiAqL1xuZnVuY3Rpb24gUGFydGl0aW9uTnVtYmVyUGF0dGVybihudW1iZXJGb3JtYXQsIHgpIHtcblxuICAgIHZhciBpbnRlcm5hbCA9IGdldEludGVybmFsUHJvcGVydGllcyhudW1iZXJGb3JtYXQpLFxuICAgICAgICBsb2NhbGUgPSBpbnRlcm5hbFsnW1tkYXRhTG9jYWxlXV0nXSxcbiAgICAgICAgbnVtcyA9IGludGVybmFsWydbW251bWJlcmluZ1N5c3RlbV1dJ10sXG4gICAgICAgIGRhdGEgPSBpbnRlcm5hbHMuTnVtYmVyRm9ybWF0WydbW2xvY2FsZURhdGFdXSddW2xvY2FsZV0sXG4gICAgICAgIGlsZCA9IGRhdGEuc3ltYm9sc1tudW1zXSB8fCBkYXRhLnN5bWJvbHMubGF0bixcbiAgICAgICAgcGF0dGVybiA9IHZvaWQgMDtcblxuICAgIC8vIDEuIElmIHggaXMgbm90IE5hTiBhbmQgeCA8IDAsIHRoZW46XG4gICAgaWYgKCFpc05hTih4KSAmJiB4IDwgMCkge1xuICAgICAgICAvLyBhLiBMZXQgeCBiZSAteC5cbiAgICAgICAgeCA9IC14O1xuICAgICAgICAvLyBhLiBMZXQgcGF0dGVybiBiZSB0aGUgdmFsdWUgb2YgbnVtYmVyRm9ybWF0LltbbmVnYXRpdmVQYXR0ZXJuXV0uXG4gICAgICAgIHBhdHRlcm4gPSBpbnRlcm5hbFsnW1tuZWdhdGl2ZVBhdHRlcm5dXSddO1xuICAgIH1cbiAgICAvLyAyLiBFbHNlLFxuICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gYS4gTGV0IHBhdHRlcm4gYmUgdGhlIHZhbHVlIG9mIG51bWJlckZvcm1hdC5bW3Bvc2l0aXZlUGF0dGVybl1dLlxuICAgICAgICAgICAgcGF0dGVybiA9IGludGVybmFsWydbW3Bvc2l0aXZlUGF0dGVybl1dJ107XG4gICAgICAgIH1cbiAgICAvLyAzLiBMZXQgcmVzdWx0IGJlIGEgbmV3IGVtcHR5IExpc3QuXG4gICAgdmFyIHJlc3VsdCA9IG5ldyBMaXN0KCk7XG4gICAgLy8gNC4gTGV0IGJlZ2luSW5kZXggYmUgQ2FsbCglU3RyaW5nUHJvdG9faW5kZXhPZiUsIHBhdHRlcm4sIFwie1wiLCAwKS5cbiAgICB2YXIgYmVnaW5JbmRleCA9IHBhdHRlcm4uaW5kZXhPZigneycsIDApO1xuICAgIC8vIDUuIExldCBlbmRJbmRleCBiZSAwLlxuICAgIHZhciBlbmRJbmRleCA9IDA7XG4gICAgLy8gNi4gTGV0IG5leHRJbmRleCBiZSAwLlxuICAgIHZhciBuZXh0SW5kZXggPSAwO1xuICAgIC8vIDcuIExldCBsZW5ndGggYmUgdGhlIG51bWJlciBvZiBjb2RlIHVuaXRzIGluIHBhdHRlcm4uXG4gICAgdmFyIGxlbmd0aCA9IHBhdHRlcm4ubGVuZ3RoO1xuICAgIC8vIDguIFJlcGVhdCB3aGlsZSBiZWdpbkluZGV4IGlzIGFuIGludGVnZXIgaW5kZXggaW50byBwYXR0ZXJuOlxuICAgIHdoaWxlIChiZWdpbkluZGV4ID4gLTEgJiYgYmVnaW5JbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAvLyBhLiBTZXQgZW5kSW5kZXggdG8gQ2FsbCglU3RyaW5nUHJvdG9faW5kZXhPZiUsIHBhdHRlcm4sIFwifVwiLCBiZWdpbkluZGV4KVxuICAgICAgICBlbmRJbmRleCA9IHBhdHRlcm4uaW5kZXhPZignfScsIGJlZ2luSW5kZXgpO1xuICAgICAgICAvLyBhLiBJZiBlbmRJbmRleCA9IC0xLCB0aHJvdyBuZXcgRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICBpZiAoZW5kSW5kZXggPT09IC0xKSB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgLy8gYS4gSWYgYmVnaW5JbmRleCBpcyBncmVhdGVyIHRoYW4gbmV4dEluZGV4LCB0aGVuOlxuICAgICAgICBpZiAoYmVnaW5JbmRleCA+IG5leHRJbmRleCkge1xuICAgICAgICAgICAgLy8gaS4gTGV0IGxpdGVyYWwgYmUgYSBzdWJzdHJpbmcgb2YgcGF0dGVybiBmcm9tIHBvc2l0aW9uIG5leHRJbmRleCwgaW5jbHVzaXZlLCB0byBwb3NpdGlvbiBiZWdpbkluZGV4LCBleGNsdXNpdmUuXG4gICAgICAgICAgICB2YXIgbGl0ZXJhbCA9IHBhdHRlcm4uc3Vic3RyaW5nKG5leHRJbmRleCwgYmVnaW5JbmRleCk7XG4gICAgICAgICAgICAvLyBpaS4gQWRkIG5ldyBwYXJ0IHJlY29yZCB7IFtbdHlwZV1dOiBcImxpdGVyYWxcIiwgW1t2YWx1ZV1dOiBsaXRlcmFsIH0gYXMgYSBuZXcgZWxlbWVudCBvZiB0aGUgbGlzdCByZXN1bHQuXG4gICAgICAgICAgICBhcnJQdXNoLmNhbGwocmVzdWx0LCB7ICdbW3R5cGVdXSc6ICdsaXRlcmFsJywgJ1tbdmFsdWVdXSc6IGxpdGVyYWwgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYS4gTGV0IHAgYmUgdGhlIHN1YnN0cmluZyBvZiBwYXR0ZXJuIGZyb20gcG9zaXRpb24gYmVnaW5JbmRleCwgZXhjbHVzaXZlLCB0byBwb3NpdGlvbiBlbmRJbmRleCwgZXhjbHVzaXZlLlxuICAgICAgICB2YXIgcCA9IHBhdHRlcm4uc3Vic3RyaW5nKGJlZ2luSW5kZXggKyAxLCBlbmRJbmRleCk7XG4gICAgICAgIC8vIGEuIElmIHAgaXMgZXF1YWwgXCJudW1iZXJcIiwgdGhlbjpcbiAgICAgICAgaWYgKHAgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIC8vIGkuIElmIHggaXMgTmFOLFxuICAgICAgICAgICAgaWYgKGlzTmFOKHgpKSB7XG4gICAgICAgICAgICAgICAgLy8gMS4gTGV0IG4gYmUgYW4gSUxEIFN0cmluZyB2YWx1ZSBpbmRpY2F0aW5nIHRoZSBOYU4gdmFsdWUuXG4gICAgICAgICAgICAgICAgdmFyIG4gPSBpbGQubmFuO1xuICAgICAgICAgICAgICAgIC8vIDIuIEFkZCBuZXcgcGFydCByZWNvcmQgeyBbW3R5cGVdXTogXCJuYW5cIiwgW1t2YWx1ZV1dOiBuIH0gYXMgYSBuZXcgZWxlbWVudCBvZiB0aGUgbGlzdCByZXN1bHQuXG4gICAgICAgICAgICAgICAgYXJyUHVzaC5jYWxsKHJlc3VsdCwgeyAnW1t0eXBlXV0nOiAnbmFuJywgJ1tbdmFsdWVdXSc6IG4gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpaS4gRWxzZSBpZiBpc0Zpbml0ZSh4KSBpcyBmYWxzZSxcbiAgICAgICAgICAgIGVsc2UgaWYgKCFpc0Zpbml0ZSh4KSkge1xuICAgICAgICAgICAgICAgICAgICAvLyAxLiBMZXQgbiBiZSBhbiBJTEQgU3RyaW5nIHZhbHVlIGluZGljYXRpbmcgaW5maW5pdHkuXG4gICAgICAgICAgICAgICAgICAgIHZhciBfbiA9IGlsZC5pbmZpbml0eTtcbiAgICAgICAgICAgICAgICAgICAgLy8gMi4gQWRkIG5ldyBwYXJ0IHJlY29yZCB7IFtbdHlwZV1dOiBcImluZmluaXR5XCIsIFtbdmFsdWVdXTogbiB9IGFzIGEgbmV3IGVsZW1lbnQgb2YgdGhlIGxpc3QgcmVzdWx0LlxuICAgICAgICAgICAgICAgICAgICBhcnJQdXNoLmNhbGwocmVzdWx0LCB7ICdbW3R5cGVdXSc6ICdpbmZpbml0eScsICdbW3ZhbHVlXV0nOiBfbiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaWlpLiBFbHNlLFxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMS4gSWYgdGhlIHZhbHVlIG9mIG51bWJlckZvcm1hdC5bW3N0eWxlXV0gaXMgXCJwZXJjZW50XCIgYW5kIGlzRmluaXRlKHgpLCBsZXQgeCBiZSAxMDAgw5cgeC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnRlcm5hbFsnW1tzdHlsZV1dJ10gPT09ICdwZXJjZW50JyAmJiBpc0Zpbml0ZSh4KSkgeCAqPSAxMDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfbjIgPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAyLiBJZiB0aGUgbnVtYmVyRm9ybWF0LltbbWluaW11bVNpZ25pZmljYW50RGlnaXRzXV0gYW5kIG51bWJlckZvcm1hdC5bW21heGltdW1TaWduaWZpY2FudERpZ2l0c11dIGFyZSBwcmVzZW50LCB0aGVuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaG9wLmNhbGwoaW50ZXJuYWwsICdbW21pbmltdW1TaWduaWZpY2FudERpZ2l0c11dJykgJiYgaG9wLmNhbGwoaW50ZXJuYWwsICdbW21heGltdW1TaWduaWZpY2FudERpZ2l0c11dJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhLiBMZXQgbiBiZSBUb1Jhd1ByZWNpc2lvbih4LCBudW1iZXJGb3JtYXQuW1ttaW5pbXVtU2lnbmlmaWNhbnREaWdpdHNdXSwgbnVtYmVyRm9ybWF0LltbbWF4aW11bVNpZ25pZmljYW50RGlnaXRzXV0pLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9uMiA9IFRvUmF3UHJlY2lzaW9uKHgsIGludGVybmFsWydbW21pbmltdW1TaWduaWZpY2FudERpZ2l0c11dJ10sIGludGVybmFsWydbW21heGltdW1TaWduaWZpY2FudERpZ2l0c11dJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMy4gRWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhLiBMZXQgbiBiZSBUb1Jhd0ZpeGVkKHgsIG51bWJlckZvcm1hdC5bW21pbmltdW1JbnRlZ2VyRGlnaXRzXV0sIG51bWJlckZvcm1hdC5bW21pbmltdW1GcmFjdGlvbkRpZ2l0c11dLCBudW1iZXJGb3JtYXQuW1ttYXhpbXVtRnJhY3Rpb25EaWdpdHNdXSkuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9uMiA9IFRvUmF3Rml4ZWQoeCwgaW50ZXJuYWxbJ1tbbWluaW11bUludGVnZXJEaWdpdHNdXSddLCBpbnRlcm5hbFsnW1ttaW5pbXVtRnJhY3Rpb25EaWdpdHNdXSddLCBpbnRlcm5hbFsnW1ttYXhpbXVtRnJhY3Rpb25EaWdpdHNdXSddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyA0LiBJZiB0aGUgdmFsdWUgb2YgdGhlIG51bWJlckZvcm1hdC5bW251bWJlcmluZ1N5c3RlbV1dIG1hdGNoZXMgb25lIG9mIHRoZSB2YWx1ZXMgaW4gdGhlIFwiTnVtYmVyaW5nIFN5c3RlbVwiIGNvbHVtbiBvZiBUYWJsZSAyIGJlbG93LCB0aGVuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVtU3lzW251bXNdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYS4gTGV0IGRpZ2l0cyBiZSBhbiBhcnJheSB3aG9zZSAxMCBTdHJpbmcgdmFsdWVkIGVsZW1lbnRzIGFyZSB0aGUgVVRGLTE2IHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2YgdGhlIDEwIGRpZ2l0cyBzcGVjaWZpZWQgaW4gdGhlIFwiRGlnaXRzXCIgY29sdW1uIG9mIHRoZSBtYXRjaGluZyByb3cgaW4gVGFibGUgMi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpZ2l0cyA9IG51bVN5c1tudW1zXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYS4gUmVwbGFjZSBlYWNoIGRpZ2l0IGluIG4gd2l0aCB0aGUgdmFsdWUgb2YgZGlnaXRzW2RpZ2l0XS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX24yID0gU3RyaW5nKF9uMikucmVwbGFjZSgvXFxkL2csIGZ1bmN0aW9uIChkaWdpdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRpZ2l0c1tkaWdpdF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyA1LiBFbHNlIHVzZSBhbiBpbXBsZW1lbnRhdGlvbiBkZXBlbmRlbnQgYWxnb3JpdGhtIHRvIG1hcCBuIHRvIHRoZSBhcHByb3ByaWF0ZSByZXByZXNlbnRhdGlvbiBvZiBuIGluIHRoZSBnaXZlbiBudW1iZXJpbmcgc3lzdGVtLlxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBfbjIgPSBTdHJpbmcoX24yKTsgLy8gIyMjVE9ETyMjI1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW50ZWdlciA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmcmFjdGlvbiA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDYuIExldCBkZWNpbWFsU2VwSW5kZXggYmUgQ2FsbCglU3RyaW5nUHJvdG9faW5kZXhPZiUsIG4sIFwiLlwiLCAwKS5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWNpbWFsU2VwSW5kZXggPSBfbjIuaW5kZXhPZignLicsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gNy4gSWYgZGVjaW1hbFNlcEluZGV4ID4gMCwgdGhlbjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZWNpbWFsU2VwSW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYS4gTGV0IGludGVnZXIgYmUgdGhlIHN1YnN0cmluZyBvZiBuIGZyb20gcG9zaXRpb24gMCwgaW5jbHVzaXZlLCB0byBwb3NpdGlvbiBkZWNpbWFsU2VwSW5kZXgsIGV4Y2x1c2l2ZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlZ2VyID0gX24yLnN1YnN0cmluZygwLCBkZWNpbWFsU2VwSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGEuIExldCBmcmFjdGlvbiBiZSB0aGUgc3Vic3RyaW5nIG9mIG4gZnJvbSBwb3NpdGlvbiBkZWNpbWFsU2VwSW5kZXgsIGV4Y2x1c2l2ZSwgdG8gdGhlIGVuZCBvZiBuLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyYWN0aW9uID0gX24yLnN1YnN0cmluZyhkZWNpbWFsU2VwSW5kZXggKyAxLCBkZWNpbWFsU2VwSW5kZXgubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDguIEVsc2U6XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYS4gTGV0IGludGVnZXIgYmUgbi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZWdlciA9IF9uMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYS4gTGV0IGZyYWN0aW9uIGJlIHVuZGVmaW5lZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJhY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gOS4gSWYgdGhlIHZhbHVlIG9mIHRoZSBudW1iZXJGb3JtYXQuW1t1c2VHcm91cGluZ11dIGlzIHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW50ZXJuYWxbJ1tbdXNlR3JvdXBpbmddXSddID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYS4gTGV0IGdyb3VwU2VwU3ltYm9sIGJlIHRoZSBJTE5EIFN0cmluZyByZXByZXNlbnRpbmcgdGhlIGdyb3VwaW5nIHNlcGFyYXRvci5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXBTZXBTeW1ib2wgPSBpbGQuZ3JvdXA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYS4gTGV0IGdyb3VwcyBiZSBhIExpc3Qgd2hvc2UgZWxlbWVudHMgYXJlLCBpbiBsZWZ0IHRvIHJpZ2h0IG9yZGVyLCB0aGUgc3Vic3RyaW5ncyBkZWZpbmVkIGJ5IElMTkQgc2V0IG9mIGxvY2F0aW9ucyB3aXRoaW4gdGhlIGludGVnZXIuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdyb3VwcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC0tLS0+IGltcGxlbWVudGF0aW9uOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFByaW1hcnkgZ3JvdXAgcmVwcmVzZW50cyB0aGUgZ3JvdXAgY2xvc2VzdCB0byB0aGUgZGVjaW1hbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwZ1NpemUgPSBkYXRhLnBhdHRlcm5zLnByaW1hcnlHcm91cFNpemUgfHwgMztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTZWNvbmRhcnkgZ3JvdXAgaXMgZXZlcnkgb3RoZXIgZ3JvdXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2dTaXplID0gZGF0YS5wYXR0ZXJucy5zZWNvbmRhcnlHcm91cFNpemUgfHwgcGdTaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdyb3VwIG9ubHkgaWYgbmVjZXNzYXJ5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGludGVnZXIubGVuZ3RoID4gcGdTaXplKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEluZGV4IG9mIHRoZSBwcmltYXJ5IGdyb3VwaW5nIHNlcGFyYXRvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZW5kID0gaW50ZWdlci5sZW5ndGggLSBwZ1NpemU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN0YXJ0aW5nIGluZGV4IGZvciBvdXIgbG9vcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWR4ID0gZW5kICUgc2dTaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhcnQgPSBpbnRlZ2VyLnNsaWNlKDAsIGlkeCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFydC5sZW5ndGgpIGFyclB1c2guY2FsbChncm91cHMsIHN0YXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTG9vcCB0byBzZXBhcmF0ZSBpbnRvIHNlY29uZGFyeSBncm91cGluZyBkaWdpdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGlkeCA8IGVuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyUHVzaC5jYWxsKGdyb3VwcywgaW50ZWdlci5zbGljZShpZHgsIGlkeCArIHNnU2l6ZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWR4ICs9IHNnU2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIHByaW1hcnkgZ3JvdXBpbmcgZGlnaXRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyclB1c2guY2FsbChncm91cHMsIGludGVnZXIuc2xpY2UoZW5kKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyUHVzaC5jYWxsKGdyb3VwcywgaW50ZWdlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGEuIEFzc2VydDogVGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiBncm91cHMgTGlzdCBpcyBncmVhdGVyIHRoYW4gMC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ3JvdXBzLmxlbmd0aCA9PT0gMCkgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYS4gUmVwZWF0LCB3aGlsZSBncm91cHMgTGlzdCBpcyBub3QgZW1wdHk6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGdyb3Vwcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaS4gUmVtb3ZlIHRoZSBmaXJzdCBlbGVtZW50IGZyb20gZ3JvdXBzIGFuZCBsZXQgaW50ZWdlckdyb3VwIGJlIHRoZSB2YWx1ZSBvZiB0aGF0IGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnRlZ2VyR3JvdXAgPSBhcnJTaGlmdC5jYWxsKGdyb3Vwcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlpLiBBZGQgbmV3IHBhcnQgcmVjb3JkIHsgW1t0eXBlXV06IFwiaW50ZWdlclwiLCBbW3ZhbHVlXV06IGludGVnZXJHcm91cCB9IGFzIGEgbmV3IGVsZW1lbnQgb2YgdGhlIGxpc3QgcmVzdWx0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJQdXNoLmNhbGwocmVzdWx0LCB7ICdbW3R5cGVdXSc6ICdpbnRlZ2VyJywgJ1tbdmFsdWVdXSc6IGludGVnZXJHcm91cCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWlpLiBJZiBncm91cHMgTGlzdCBpcyBub3QgZW1wdHksIHRoZW46XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChncm91cHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAxLiBBZGQgbmV3IHBhcnQgcmVjb3JkIHsgW1t0eXBlXV06IFwiZ3JvdXBcIiwgW1t2YWx1ZV1dOiBncm91cFNlcFN5bWJvbCB9IGFzIGEgbmV3IGVsZW1lbnQgb2YgdGhlIGxpc3QgcmVzdWx0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyUHVzaC5jYWxsKHJlc3VsdCwgeyAnW1t0eXBlXV0nOiAnZ3JvdXAnLCAnW1t2YWx1ZV1dJzogZ3JvdXBTZXBTeW1ib2wgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAxMC4gRWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhLiBBZGQgbmV3IHBhcnQgcmVjb3JkIHsgW1t0eXBlXV06IFwiaW50ZWdlclwiLCBbW3ZhbHVlXV06IGludGVnZXIgfSBhcyBhIG5ldyBlbGVtZW50IG9mIHRoZSBsaXN0IHJlc3VsdC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyUHVzaC5jYWxsKHJlc3VsdCwgeyAnW1t0eXBlXV0nOiAnaW50ZWdlcicsICdbW3ZhbHVlXV0nOiBpbnRlZ2VyIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDExLiBJZiBmcmFjdGlvbiBpcyBub3QgdW5kZWZpbmVkLCB0aGVuOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZyYWN0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhLiBMZXQgZGVjaW1hbFNlcFN5bWJvbCBiZSB0aGUgSUxORCBTdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBkZWNpbWFsIHNlcGFyYXRvci5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVjaW1hbFNlcFN5bWJvbCA9IGlsZC5kZWNpbWFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGEuIEFkZCBuZXcgcGFydCByZWNvcmQgeyBbW3R5cGVdXTogXCJkZWNpbWFsXCIsIFtbdmFsdWVdXTogZGVjaW1hbFNlcFN5bWJvbCB9IGFzIGEgbmV3IGVsZW1lbnQgb2YgdGhlIGxpc3QgcmVzdWx0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyclB1c2guY2FsbChyZXN1bHQsIHsgJ1tbdHlwZV1dJzogJ2RlY2ltYWwnLCAnW1t2YWx1ZV1dJzogZGVjaW1hbFNlcFN5bWJvbCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhLiBBZGQgbmV3IHBhcnQgcmVjb3JkIHsgW1t0eXBlXV06IFwiZnJhY3Rpb25cIiwgW1t2YWx1ZV1dOiBmcmFjdGlvbiB9IGFzIGEgbmV3IGVsZW1lbnQgb2YgdGhlIGxpc3QgcmVzdWx0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyclB1c2guY2FsbChyZXN1bHQsIHsgJ1tbdHlwZV1dJzogJ2ZyYWN0aW9uJywgJ1tbdmFsdWVdXSc6IGZyYWN0aW9uIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gYS4gRWxzZSBpZiBwIGlzIGVxdWFsIFwicGx1c1NpZ25cIiwgdGhlbjpcbiAgICAgICAgZWxzZSBpZiAocCA9PT0gXCJwbHVzU2lnblwiKSB7XG4gICAgICAgICAgICAgICAgLy8gaS4gTGV0IHBsdXNTaWduU3ltYm9sIGJlIHRoZSBJTE5EIFN0cmluZyByZXByZXNlbnRpbmcgdGhlIHBsdXMgc2lnbi5cbiAgICAgICAgICAgICAgICB2YXIgcGx1c1NpZ25TeW1ib2wgPSBpbGQucGx1c1NpZ247XG4gICAgICAgICAgICAgICAgLy8gaWkuIEFkZCBuZXcgcGFydCByZWNvcmQgeyBbW3R5cGVdXTogXCJwbHVzU2lnblwiLCBbW3ZhbHVlXV06IHBsdXNTaWduU3ltYm9sIH0gYXMgYSBuZXcgZWxlbWVudCBvZiB0aGUgbGlzdCByZXN1bHQuXG4gICAgICAgICAgICAgICAgYXJyUHVzaC5jYWxsKHJlc3VsdCwgeyAnW1t0eXBlXV0nOiAncGx1c1NpZ24nLCAnW1t2YWx1ZV1dJzogcGx1c1NpZ25TeW1ib2wgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBhLiBFbHNlIGlmIHAgaXMgZXF1YWwgXCJtaW51c1NpZ25cIiwgdGhlbjpcbiAgICAgICAgICAgIGVsc2UgaWYgKHAgPT09IFwibWludXNTaWduXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaS4gTGV0IG1pbnVzU2lnblN5bWJvbCBiZSB0aGUgSUxORCBTdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBtaW51cyBzaWduLlxuICAgICAgICAgICAgICAgICAgICB2YXIgbWludXNTaWduU3ltYm9sID0gaWxkLm1pbnVzU2lnbjtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWkuIEFkZCBuZXcgcGFydCByZWNvcmQgeyBbW3R5cGVdXTogXCJtaW51c1NpZ25cIiwgW1t2YWx1ZV1dOiBtaW51c1NpZ25TeW1ib2wgfSBhcyBhIG5ldyBlbGVtZW50IG9mIHRoZSBsaXN0IHJlc3VsdC5cbiAgICAgICAgICAgICAgICAgICAgYXJyUHVzaC5jYWxsKHJlc3VsdCwgeyAnW1t0eXBlXV0nOiAnbWludXNTaWduJywgJ1tbdmFsdWVdXSc6IG1pbnVzU2lnblN5bWJvbCB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gYS4gRWxzZSBpZiBwIGlzIGVxdWFsIFwicGVyY2VudFNpZ25cIiBhbmQgbnVtYmVyRm9ybWF0Lltbc3R5bGVdXSBpcyBcInBlcmNlbnRcIiwgdGhlbjpcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwID09PSBcInBlcmNlbnRTaWduXCIgJiYgaW50ZXJuYWxbJ1tbc3R5bGVdXSddID09PSBcInBlcmNlbnRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaS4gTGV0IHBlcmNlbnRTaWduU3ltYm9sIGJlIHRoZSBJTE5EIFN0cmluZyByZXByZXNlbnRpbmcgdGhlIHBlcmNlbnQgc2lnbi5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwZXJjZW50U2lnblN5bWJvbCA9IGlsZC5wZXJjZW50U2lnbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlpLiBBZGQgbmV3IHBhcnQgcmVjb3JkIHsgW1t0eXBlXV06IFwicGVyY2VudFNpZ25cIiwgW1t2YWx1ZV1dOiBwZXJjZW50U2lnblN5bWJvbCB9IGFzIGEgbmV3IGVsZW1lbnQgb2YgdGhlIGxpc3QgcmVzdWx0LlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyUHVzaC5jYWxsKHJlc3VsdCwgeyAnW1t0eXBlXV0nOiAnbGl0ZXJhbCcsICdbW3ZhbHVlXV0nOiBwZXJjZW50U2lnblN5bWJvbCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBhLiBFbHNlIGlmIHAgaXMgZXF1YWwgXCJjdXJyZW5jeVwiIGFuZCBudW1iZXJGb3JtYXQuW1tzdHlsZV1dIGlzIFwiY3VycmVuY3lcIiwgdGhlbjpcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocCA9PT0gXCJjdXJyZW5jeVwiICYmIGludGVybmFsWydbW3N0eWxlXV0nXSA9PT0gXCJjdXJyZW5jeVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaS4gTGV0IGN1cnJlbmN5IGJlIHRoZSB2YWx1ZSBvZiBudW1iZXJGb3JtYXQuW1tjdXJyZW5jeV1dLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW5jeSA9IGludGVybmFsWydbW2N1cnJlbmN5XV0nXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZCA9IHZvaWQgMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlpLiBJZiBudW1iZXJGb3JtYXQuW1tjdXJyZW5jeURpc3BsYXldXSBpcyBcImNvZGVcIiwgdGhlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnRlcm5hbFsnW1tjdXJyZW5jeURpc3BsYXldXSddID09PSBcImNvZGVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAxLiBMZXQgY2QgYmUgY3VycmVuY3kuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNkID0gY3VycmVuY3k7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlpaS4gRWxzZSBpZiBudW1iZXJGb3JtYXQuW1tjdXJyZW5jeURpc3BsYXldXSBpcyBcInN5bWJvbFwiLCB0aGVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoaW50ZXJuYWxbJ1tbY3VycmVuY3lEaXNwbGF5XV0nXSA9PT0gXCJzeW1ib2xcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMS4gTGV0IGNkIGJlIGFuIElMRCBzdHJpbmcgcmVwcmVzZW50aW5nIGN1cnJlbmN5IGluIHNob3J0IGZvcm0uIElmIHRoZSBpbXBsZW1lbnRhdGlvbiBkb2VzIG5vdCBoYXZlIHN1Y2ggYSByZXByZXNlbnRhdGlvbiBvZiBjdXJyZW5jeSwgdXNlIGN1cnJlbmN5IGl0c2VsZi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNkID0gZGF0YS5jdXJyZW5jaWVzW2N1cnJlbmN5XSB8fCBjdXJyZW5jeTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpdi4gRWxzZSBpZiBudW1iZXJGb3JtYXQuW1tjdXJyZW5jeURpc3BsYXldXSBpcyBcIm5hbWVcIiwgdGhlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpbnRlcm5hbFsnW1tjdXJyZW5jeURpc3BsYXldXSddID09PSBcIm5hbWVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDEuIExldCBjZCBiZSBhbiBJTEQgc3RyaW5nIHJlcHJlc2VudGluZyBjdXJyZW5jeSBpbiBsb25nIGZvcm0uIElmIHRoZSBpbXBsZW1lbnRhdGlvbiBkb2VzIG5vdCBoYXZlIHN1Y2ggYSByZXByZXNlbnRhdGlvbiBvZiBjdXJyZW5jeSwgdGhlbiB1c2UgY3VycmVuY3kgaXRzZWxmLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNkID0gY3VycmVuY3k7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdi4gQWRkIG5ldyBwYXJ0IHJlY29yZCB7IFtbdHlwZV1dOiBcImN1cnJlbmN5XCIsIFtbdmFsdWVdXTogY2QgfSBhcyBhIG5ldyBlbGVtZW50IG9mIHRoZSBsaXN0IHJlc3VsdC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJQdXNoLmNhbGwocmVzdWx0LCB7ICdbW3R5cGVdXSc6ICdjdXJyZW5jeScsICdbW3ZhbHVlXV0nOiBjZCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGEuIEVsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaS4gTGV0IGxpdGVyYWwgYmUgdGhlIHN1YnN0cmluZyBvZiBwYXR0ZXJuIGZyb20gcG9zaXRpb24gYmVnaW5JbmRleCwgaW5jbHVzaXZlLCB0byBwb3NpdGlvbiBlbmRJbmRleCwgaW5jbHVzaXZlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgX2xpdGVyYWwgPSBwYXR0ZXJuLnN1YnN0cmluZyhiZWdpbkluZGV4LCBlbmRJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlpLiBBZGQgbmV3IHBhcnQgcmVjb3JkIHsgW1t0eXBlXV06IFwibGl0ZXJhbFwiLCBbW3ZhbHVlXV06IGxpdGVyYWwgfSBhcyBhIG5ldyBlbGVtZW50IG9mIHRoZSBsaXN0IHJlc3VsdC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyUHVzaC5jYWxsKHJlc3VsdCwgeyAnW1t0eXBlXV0nOiAnbGl0ZXJhbCcsICdbW3ZhbHVlXV0nOiBfbGl0ZXJhbCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIC8vIGEuIFNldCBuZXh0SW5kZXggdG8gZW5kSW5kZXggKyAxLlxuICAgICAgICBuZXh0SW5kZXggPSBlbmRJbmRleCArIDE7XG4gICAgICAgIC8vIGEuIFNldCBiZWdpbkluZGV4IHRvIENhbGwoJVN0cmluZ1Byb3RvX2luZGV4T2YlLCBwYXR0ZXJuLCBcIntcIiwgbmV4dEluZGV4KVxuICAgICAgICBiZWdpbkluZGV4ID0gcGF0dGVybi5pbmRleE9mKCd7JywgbmV4dEluZGV4KTtcbiAgICB9XG4gICAgLy8gOS4gSWYgbmV4dEluZGV4IGlzIGxlc3MgdGhhbiBsZW5ndGgsIHRoZW46XG4gICAgaWYgKG5leHRJbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAvLyBhLiBMZXQgbGl0ZXJhbCBiZSB0aGUgc3Vic3RyaW5nIG9mIHBhdHRlcm4gZnJvbSBwb3NpdGlvbiBuZXh0SW5kZXgsIGluY2x1c2l2ZSwgdG8gcG9zaXRpb24gbGVuZ3RoLCBleGNsdXNpdmUuXG4gICAgICAgIHZhciBfbGl0ZXJhbDIgPSBwYXR0ZXJuLnN1YnN0cmluZyhuZXh0SW5kZXgsIGxlbmd0aCk7XG4gICAgICAgIC8vIGEuIEFkZCBuZXcgcGFydCByZWNvcmQgeyBbW3R5cGVdXTogXCJsaXRlcmFsXCIsIFtbdmFsdWVdXTogbGl0ZXJhbCB9IGFzIGEgbmV3IGVsZW1lbnQgb2YgdGhlIGxpc3QgcmVzdWx0LlxuICAgICAgICBhcnJQdXNoLmNhbGwocmVzdWx0LCB7ICdbW3R5cGVdXSc6ICdsaXRlcmFsJywgJ1tbdmFsdWVdXSc6IF9saXRlcmFsMiB9KTtcbiAgICB9XG4gICAgLy8gMTAuIFJldHVybiByZXN1bHQuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLypcbiAqIEBzcGVjW3N0YXNtL2VjbWE0MDIvbnVtYmVyLWZvcm1hdC10by1wYXJ0cy9zcGVjL251bWJlcmZvcm1hdC5odG1sXVxuICogQGNsYXVzZVtzZWMtZm9ybWF0bnVtYmVyXVxuICovXG5mdW5jdGlvbiBGb3JtYXROdW1iZXIobnVtYmVyRm9ybWF0LCB4KSB7XG4gICAgLy8gMS4gTGV0IHBhcnRzIGJlID8gUGFydGl0aW9uTnVtYmVyUGF0dGVybihudW1iZXJGb3JtYXQsIHgpLlxuICAgIHZhciBwYXJ0cyA9IFBhcnRpdGlvbk51bWJlclBhdHRlcm4obnVtYmVyRm9ybWF0LCB4KTtcbiAgICAvLyAyLiBMZXQgcmVzdWx0IGJlIGFuIGVtcHR5IFN0cmluZy5cbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgLy8gMy4gRm9yIGVhY2ggcGFydCBpbiBwYXJ0cywgZG86XG4gICAgZm9yICh2YXIgaSA9IDA7IHBhcnRzLmxlbmd0aCA+IGk7IGkrKykge1xuICAgICAgICB2YXIgcGFydCA9IHBhcnRzW2ldO1xuICAgICAgICAvLyBhLiBTZXQgcmVzdWx0IHRvIGEgU3RyaW5nIHZhbHVlIHByb2R1Y2VkIGJ5IGNvbmNhdGVuYXRpbmcgcmVzdWx0IGFuZCBwYXJ0LltbdmFsdWVdXS5cbiAgICAgICAgcmVzdWx0ICs9IHBhcnRbJ1tbdmFsdWVdXSddO1xuICAgIH1cbiAgICAvLyA0LiBSZXR1cm4gcmVzdWx0LlxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogV2hlbiB0aGUgVG9SYXdQcmVjaXNpb24gYWJzdHJhY3Qgb3BlcmF0aW9uIGlzIGNhbGxlZCB3aXRoIGFyZ3VtZW50cyB4ICh3aGljaFxuICogbXVzdCBiZSBhIGZpbml0ZSBub24tbmVnYXRpdmUgbnVtYmVyKSwgbWluUHJlY2lzaW9uLCBhbmQgbWF4UHJlY2lzaW9uIChib3RoXG4gKiBtdXN0IGJlIGludGVnZXJzIGJldHdlZW4gMSBhbmQgMjEpIHRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHRha2VuOlxuICovXG5mdW5jdGlvbiBUb1Jhd1ByZWNpc2lvbih4LCBtaW5QcmVjaXNpb24sIG1heFByZWNpc2lvbikge1xuICAgIC8vIDEuIExldCBwIGJlIG1heFByZWNpc2lvbi5cbiAgICB2YXIgcCA9IG1heFByZWNpc2lvbjtcblxuICAgIHZhciBtID0gdm9pZCAwLFxuICAgICAgICBlID0gdm9pZCAwO1xuXG4gICAgLy8gMi4gSWYgeCA9IDAsIHRoZW5cbiAgICBpZiAoeCA9PT0gMCkge1xuICAgICAgICAvLyBhLiBMZXQgbSBiZSB0aGUgU3RyaW5nIGNvbnNpc3Rpbmcgb2YgcCBvY2N1cnJlbmNlcyBvZiB0aGUgY2hhcmFjdGVyIFwiMFwiLlxuICAgICAgICBtID0gYXJySm9pbi5jYWxsKEFycmF5KHAgKyAxKSwgJzAnKTtcbiAgICAgICAgLy8gYi4gTGV0IGUgYmUgMC5cbiAgICAgICAgZSA9IDA7XG4gICAgfVxuICAgIC8vIDMuIEVsc2VcbiAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGEuIExldCBlIGFuZCBuIGJlIGludGVnZXJzIHN1Y2ggdGhhdCAxMOG1luKBu8K5IOKJpCBuIDwgMTDhtZYgYW5kIGZvciB3aGljaCB0aGVcbiAgICAgICAgICAgIC8vICAgIGV4YWN0IG1hdGhlbWF0aWNhbCB2YWx1ZSBvZiBuIMOXIDEw4bWJ4oG74bWW4oG6wrkg4oCTIHggaXMgYXMgY2xvc2UgdG8gemVybyBhc1xuICAgICAgICAgICAgLy8gICAgcG9zc2libGUuIElmIHRoZXJlIGFyZSB0d28gc3VjaCBzZXRzIG9mIGUgYW5kIG4sIHBpY2sgdGhlIGUgYW5kIG4gZm9yXG4gICAgICAgICAgICAvLyAgICB3aGljaCBuIMOXIDEw4bWJ4oG74bWW4oG6wrkgaXMgbGFyZ2VyLlxuICAgICAgICAgICAgZSA9IGxvZzEwRmxvb3IoTWF0aC5hYnMoeCkpO1xuXG4gICAgICAgICAgICAvLyBFYXNpZXIgdG8gZ2V0IHRvIG0gZnJvbSBoZXJlXG4gICAgICAgICAgICB2YXIgZiA9IE1hdGgucm91bmQoTWF0aC5leHAoTWF0aC5hYnMoZSAtIHAgKyAxKSAqIE1hdGguTE4xMCkpO1xuXG4gICAgICAgICAgICAvLyBiLiBMZXQgbSBiZSB0aGUgU3RyaW5nIGNvbnNpc3Rpbmcgb2YgdGhlIGRpZ2l0cyBvZiB0aGUgZGVjaW1hbFxuICAgICAgICAgICAgLy8gICAgcmVwcmVzZW50YXRpb24gb2YgbiAoaW4gb3JkZXIsIHdpdGggbm8gbGVhZGluZyB6ZXJvZXMpXG4gICAgICAgICAgICBtID0gU3RyaW5nKE1hdGgucm91bmQoZSAtIHAgKyAxIDwgMCA/IHggKiBmIDogeCAvIGYpKTtcbiAgICAgICAgfVxuXG4gICAgLy8gNC4gSWYgZSDiiaUgcCwgdGhlblxuICAgIGlmIChlID49IHApXG4gICAgICAgIC8vIGEuIFJldHVybiB0aGUgY29uY2F0ZW5hdGlvbiBvZiBtIGFuZCBlLXArMSBvY2N1cnJlbmNlcyBvZiB0aGUgY2hhcmFjdGVyIFwiMFwiLlxuICAgICAgICByZXR1cm4gbSArIGFyckpvaW4uY2FsbChBcnJheShlIC0gcCArIDEgKyAxKSwgJzAnKTtcblxuICAgICAgICAvLyA1LiBJZiBlID0gcC0xLCB0aGVuXG4gICAgZWxzZSBpZiAoZSA9PT0gcCAtIDEpXG4gICAgICAgICAgICAvLyBhLiBSZXR1cm4gbS5cbiAgICAgICAgICAgIHJldHVybiBtO1xuXG4gICAgICAgICAgICAvLyA2LiBJZiBlIOKJpSAwLCB0aGVuXG4gICAgICAgIGVsc2UgaWYgKGUgPj0gMClcbiAgICAgICAgICAgICAgICAvLyBhLiBMZXQgbSBiZSB0aGUgY29uY2F0ZW5hdGlvbiBvZiB0aGUgZmlyc3QgZSsxIGNoYXJhY3RlcnMgb2YgbSwgdGhlIGNoYXJhY3RlclxuICAgICAgICAgICAgICAgIC8vICAgIFwiLlwiLCBhbmQgdGhlIHJlbWFpbmluZyBw4oCTKGUrMSkgY2hhcmFjdGVycyBvZiBtLlxuICAgICAgICAgICAgICAgIG0gPSBtLnNsaWNlKDAsIGUgKyAxKSArICcuJyArIG0uc2xpY2UoZSArIDEpO1xuXG4gICAgICAgICAgICAgICAgLy8gNy4gSWYgZSA8IDAsIHRoZW5cbiAgICAgICAgICAgIGVsc2UgaWYgKGUgPCAwKVxuICAgICAgICAgICAgICAgICAgICAvLyBhLiBMZXQgbSBiZSB0aGUgY29uY2F0ZW5hdGlvbiBvZiB0aGUgU3RyaW5nIFwiMC5cIiwg4oCTKGUrMSkgb2NjdXJyZW5jZXMgb2YgdGhlXG4gICAgICAgICAgICAgICAgICAgIC8vICAgIGNoYXJhY3RlciBcIjBcIiwgYW5kIHRoZSBzdHJpbmcgbS5cbiAgICAgICAgICAgICAgICAgICAgbSA9ICcwLicgKyBhcnJKb2luLmNhbGwoQXJyYXkoLShlICsgMSkgKyAxKSwgJzAnKSArIG07XG5cbiAgICAvLyA4LiBJZiBtIGNvbnRhaW5zIHRoZSBjaGFyYWN0ZXIgXCIuXCIsIGFuZCBtYXhQcmVjaXNpb24gPiBtaW5QcmVjaXNpb24sIHRoZW5cbiAgICBpZiAobS5pbmRleE9mKFwiLlwiKSA+PSAwICYmIG1heFByZWNpc2lvbiA+IG1pblByZWNpc2lvbikge1xuICAgICAgICAvLyBhLiBMZXQgY3V0IGJlIG1heFByZWNpc2lvbiDigJMgbWluUHJlY2lzaW9uLlxuICAgICAgICB2YXIgY3V0ID0gbWF4UHJlY2lzaW9uIC0gbWluUHJlY2lzaW9uO1xuXG4gICAgICAgIC8vIGIuIFJlcGVhdCB3aGlsZSBjdXQgPiAwIGFuZCB0aGUgbGFzdCBjaGFyYWN0ZXIgb2YgbSBpcyBcIjBcIjpcbiAgICAgICAgd2hpbGUgKGN1dCA+IDAgJiYgbS5jaGFyQXQobS5sZW5ndGggLSAxKSA9PT0gJzAnKSB7XG4gICAgICAgICAgICAvLyAgaS4gUmVtb3ZlIHRoZSBsYXN0IGNoYXJhY3RlciBmcm9tIG0uXG4gICAgICAgICAgICBtID0gbS5zbGljZSgwLCAtMSk7XG5cbiAgICAgICAgICAgIC8vICBpaS4gRGVjcmVhc2UgY3V0IGJ5IDEuXG4gICAgICAgICAgICBjdXQtLTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGMuIElmIHRoZSBsYXN0IGNoYXJhY3RlciBvZiBtIGlzIFwiLlwiLCB0aGVuXG4gICAgICAgIGlmIChtLmNoYXJBdChtLmxlbmd0aCAtIDEpID09PSAnLicpXG4gICAgICAgICAgICAvLyAgICBpLiBSZW1vdmUgdGhlIGxhc3QgY2hhcmFjdGVyIGZyb20gbS5cbiAgICAgICAgICAgIG0gPSBtLnNsaWNlKDAsIC0xKTtcbiAgICB9XG4gICAgLy8gOS4gUmV0dXJuIG0uXG4gICAgcmV0dXJuIG07XG59XG5cbi8qKlxuICogQHNwZWNbdGMzOS9lY21hNDAyL21hc3Rlci9zcGVjL251bWJlcmZvcm1hdC5odG1sXVxuICogQGNsYXVzZVtzZWMtdG9yYXdmaXhlZF1cbiAqIFdoZW4gdGhlIFRvUmF3Rml4ZWQgYWJzdHJhY3Qgb3BlcmF0aW9uIGlzIGNhbGxlZCB3aXRoIGFyZ3VtZW50cyB4ICh3aGljaCBtdXN0XG4gKiBiZSBhIGZpbml0ZSBub24tbmVnYXRpdmUgbnVtYmVyKSwgbWluSW50ZWdlciAod2hpY2ggbXVzdCBiZSBhbiBpbnRlZ2VyIGJldHdlZW5cbiAqIDEgYW5kIDIxKSwgbWluRnJhY3Rpb24sIGFuZCBtYXhGcmFjdGlvbiAod2hpY2ggbXVzdCBiZSBpbnRlZ2VycyBiZXR3ZWVuIDAgYW5kXG4gKiAyMCkgdGhlIGZvbGxvd2luZyBzdGVwcyBhcmUgdGFrZW46XG4gKi9cbmZ1bmN0aW9uIFRvUmF3Rml4ZWQoeCwgbWluSW50ZWdlciwgbWluRnJhY3Rpb24sIG1heEZyYWN0aW9uKSB7XG4gICAgLy8gMS4gTGV0IGYgYmUgbWF4RnJhY3Rpb24uXG4gICAgdmFyIGYgPSBtYXhGcmFjdGlvbjtcbiAgICAvLyAyLiBMZXQgbiBiZSBhbiBpbnRlZ2VyIGZvciB3aGljaCB0aGUgZXhhY3QgbWF0aGVtYXRpY2FsIHZhbHVlIG9mIG4gw7cgMTBmIOKAkyB4IGlzIGFzIGNsb3NlIHRvIHplcm8gYXMgcG9zc2libGUuIElmIHRoZXJlIGFyZSB0d28gc3VjaCBuLCBwaWNrIHRoZSBsYXJnZXIgbi5cbiAgICB2YXIgbiA9IE1hdGgucG93KDEwLCBmKSAqIHg7IC8vIGRpdmVyZ2luZy4uLlxuICAgIC8vIDMuIElmIG4gPSAwLCBsZXQgbSBiZSB0aGUgU3RyaW5nIFwiMFwiLiBPdGhlcndpc2UsIGxldCBtIGJlIHRoZSBTdHJpbmcgY29uc2lzdGluZyBvZiB0aGUgZGlnaXRzIG9mIHRoZSBkZWNpbWFsIHJlcHJlc2VudGF0aW9uIG9mIG4gKGluIG9yZGVyLCB3aXRoIG5vIGxlYWRpbmcgemVyb2VzKS5cbiAgICB2YXIgbSA9IG4gPT09IDAgPyBcIjBcIiA6IG4udG9GaXhlZCgwKTsgLy8gZGl2ZXJpbmcuLi5cblxuICAgIHtcbiAgICAgICAgLy8gdGhpcyBkaXZlcnNpb24gaXMgbmVlZGVkIHRvIHRha2UgaW50byBjb25zaWRlcmF0aW9uIGJpZyBudW1iZXJzLCBlLmcuOlxuICAgICAgICAvLyAxLjIzNDQ1MDFlKzM3IC0+IDEyMzQ0NTAxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwXG4gICAgICAgIHZhciBpZHggPSB2b2lkIDA7XG4gICAgICAgIHZhciBleHAgPSAoaWR4ID0gbS5pbmRleE9mKCdlJykpID4gLTEgPyBtLnNsaWNlKGlkeCArIDEpIDogMDtcbiAgICAgICAgaWYgKGV4cCkge1xuICAgICAgICAgICAgbSA9IG0uc2xpY2UoMCwgaWR4KS5yZXBsYWNlKCcuJywgJycpO1xuICAgICAgICAgICAgbSArPSBhcnJKb2luLmNhbGwoQXJyYXkoZXhwIC0gKG0ubGVuZ3RoIC0gMSkgKyAxKSwgJzAnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBpbnQgPSB2b2lkIDA7XG4gICAgLy8gNC4gSWYgZiDiiaAgMCwgdGhlblxuICAgIGlmIChmICE9PSAwKSB7XG4gICAgICAgIC8vIGEuIExldCBrIGJlIHRoZSBudW1iZXIgb2YgY2hhcmFjdGVycyBpbiBtLlxuICAgICAgICB2YXIgayA9IG0ubGVuZ3RoO1xuICAgICAgICAvLyBhLiBJZiBrIOKJpCBmLCB0aGVuXG4gICAgICAgIGlmIChrIDw9IGYpIHtcbiAgICAgICAgICAgIC8vIGkuIExldCB6IGJlIHRoZSBTdHJpbmcgY29uc2lzdGluZyBvZiBmKzHigJNrIG9jY3VycmVuY2VzIG9mIHRoZSBjaGFyYWN0ZXIgXCIwXCIuXG4gICAgICAgICAgICB2YXIgeiA9IGFyckpvaW4uY2FsbChBcnJheShmICsgMSAtIGsgKyAxKSwgJzAnKTtcbiAgICAgICAgICAgIC8vIGlpLiBMZXQgbSBiZSB0aGUgY29uY2F0ZW5hdGlvbiBvZiBTdHJpbmdzIHogYW5kIG0uXG4gICAgICAgICAgICBtID0geiArIG07XG4gICAgICAgICAgICAvLyBpaWkuIExldCBrIGJlIGYrMS5cbiAgICAgICAgICAgIGsgPSBmICsgMTtcbiAgICAgICAgfVxuICAgICAgICAvLyBhLiBMZXQgYSBiZSB0aGUgZmlyc3Qga+KAk2YgY2hhcmFjdGVycyBvZiBtLCBhbmQgbGV0IGIgYmUgdGhlIHJlbWFpbmluZyBmIGNoYXJhY3RlcnMgb2YgbS5cbiAgICAgICAgdmFyIGEgPSBtLnN1YnN0cmluZygwLCBrIC0gZiksXG4gICAgICAgICAgICBiID0gbS5zdWJzdHJpbmcoayAtIGYsIG0ubGVuZ3RoKTtcbiAgICAgICAgLy8gYS4gTGV0IG0gYmUgdGhlIGNvbmNhdGVuYXRpb24gb2YgdGhlIHRocmVlIFN0cmluZ3MgYSwgXCIuXCIsIGFuZCBiLlxuICAgICAgICBtID0gYSArIFwiLlwiICsgYjtcbiAgICAgICAgLy8gYS4gTGV0IGludCBiZSB0aGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgaW4gYS5cbiAgICAgICAgaW50ID0gYS5sZW5ndGg7XG4gICAgfVxuICAgIC8vIDUuIEVsc2UsIGxldCBpbnQgYmUgdGhlIG51bWJlciBvZiBjaGFyYWN0ZXJzIGluIG0uXG4gICAgZWxzZSBpbnQgPSBtLmxlbmd0aDtcbiAgICAvLyA2LiBMZXQgY3V0IGJlIG1heEZyYWN0aW9uIOKAkyBtaW5GcmFjdGlvbi5cbiAgICB2YXIgY3V0ID0gbWF4RnJhY3Rpb24gLSBtaW5GcmFjdGlvbjtcbiAgICAvLyA3LiBSZXBlYXQgd2hpbGUgY3V0ID4gMCBhbmQgdGhlIGxhc3QgY2hhcmFjdGVyIG9mIG0gaXMgXCIwXCI6XG4gICAgd2hpbGUgKGN1dCA+IDAgJiYgbS5zbGljZSgtMSkgPT09IFwiMFwiKSB7XG4gICAgICAgIC8vIGEuIFJlbW92ZSB0aGUgbGFzdCBjaGFyYWN0ZXIgZnJvbSBtLlxuICAgICAgICBtID0gbS5zbGljZSgwLCAtMSk7XG4gICAgICAgIC8vIGEuIERlY3JlYXNlIGN1dCBieSAxLlxuICAgICAgICBjdXQtLTtcbiAgICB9XG4gICAgLy8gOC4gSWYgdGhlIGxhc3QgY2hhcmFjdGVyIG9mIG0gaXMgXCIuXCIsIHRoZW5cbiAgICBpZiAobS5zbGljZSgtMSkgPT09IFwiLlwiKSB7XG4gICAgICAgIC8vIGEuIFJlbW92ZSB0aGUgbGFzdCBjaGFyYWN0ZXIgZnJvbSBtLlxuICAgICAgICBtID0gbS5zbGljZSgwLCAtMSk7XG4gICAgfVxuICAgIC8vIDkuIElmIGludCA8IG1pbkludGVnZXIsIHRoZW5cbiAgICBpZiAoaW50IDwgbWluSW50ZWdlcikge1xuICAgICAgICAvLyBhLiBMZXQgeiBiZSB0aGUgU3RyaW5nIGNvbnNpc3Rpbmcgb2YgbWluSW50ZWdlcuKAk2ludCBvY2N1cnJlbmNlcyBvZiB0aGUgY2hhcmFjdGVyIFwiMFwiLlxuICAgICAgICB2YXIgX3ogPSBhcnJKb2luLmNhbGwoQXJyYXkobWluSW50ZWdlciAtIGludCArIDEpLCAnMCcpO1xuICAgICAgICAvLyBhLiBMZXQgbSBiZSB0aGUgY29uY2F0ZW5hdGlvbiBvZiBTdHJpbmdzIHogYW5kIG0uXG4gICAgICAgIG0gPSBfeiArIG07XG4gICAgfVxuICAgIC8vIDEwLiBSZXR1cm4gbS5cbiAgICByZXR1cm4gbTtcbn1cblxuLy8gU2VjdCAxMS4zLjIgVGFibGUgMiwgTnVtYmVyaW5nIHN5c3RlbXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG52YXIgbnVtU3lzID0ge1xuICAgIGFyYWI6IFtcItmgXCIsIFwi2aFcIiwgXCLZolwiLCBcItmjXCIsIFwi2aRcIiwgXCLZpVwiLCBcItmmXCIsIFwi2adcIiwgXCLZqFwiLCBcItmpXCJdLFxuICAgIGFyYWJleHQ6IFtcItuwXCIsIFwi27FcIiwgXCLbslwiLCBcItuzXCIsIFwi27RcIiwgXCLbtVwiLCBcItu2XCIsIFwi27dcIiwgXCLbuFwiLCBcItu5XCJdLFxuICAgIGJhbGk6IFtcIuGtkFwiLCBcIuGtkVwiLCBcIuGtklwiLCBcIuGtk1wiLCBcIuGtlFwiLCBcIuGtlVwiLCBcIuGtllwiLCBcIuGtl1wiLCBcIuGtmFwiLCBcIuGtmVwiXSxcbiAgICBiZW5nOiBbXCLgp6ZcIiwgXCLgp6dcIiwgXCLgp6hcIiwgXCLgp6lcIiwgXCLgp6pcIiwgXCLgp6tcIiwgXCLgp6xcIiwgXCLgp61cIiwgXCLgp65cIiwgXCLgp69cIl0sXG4gICAgZGV2YTogW1wi4KWmXCIsIFwi4KWnXCIsIFwi4KWoXCIsIFwi4KWpXCIsIFwi4KWqXCIsIFwi4KWrXCIsIFwi4KWsXCIsIFwi4KWtXCIsIFwi4KWuXCIsIFwi4KWvXCJdLFxuICAgIGZ1bGx3aWRlOiBbXCLvvJBcIiwgXCLvvJFcIiwgXCLvvJJcIiwgXCLvvJNcIiwgXCLvvJRcIiwgXCLvvJVcIiwgXCLvvJZcIiwgXCLvvJdcIiwgXCLvvJhcIiwgXCLvvJlcIl0sXG4gICAgZ3VqcjogW1wi4KumXCIsIFwi4KunXCIsIFwi4KuoXCIsIFwi4KupXCIsIFwi4KuqXCIsIFwi4KurXCIsIFwi4KusXCIsIFwi4KutXCIsIFwi4KuuXCIsIFwi4KuvXCJdLFxuICAgIGd1cnU6IFtcIuCpplwiLCBcIuCpp1wiLCBcIuCpqFwiLCBcIuCpqVwiLCBcIuCpqlwiLCBcIuCpq1wiLCBcIuCprFwiLCBcIuCprVwiLCBcIuCprlwiLCBcIuCpr1wiXSxcbiAgICBoYW5pZGVjOiBbXCLjgIdcIiwgXCLkuIBcIiwgXCLkuoxcIiwgXCLkuIlcIiwgXCLlm5tcIiwgXCLkupRcIiwgXCLlha1cIiwgXCLkuINcIiwgXCLlhatcIiwgXCLkuZ1cIl0sXG4gICAga2htcjogW1wi4Z+gXCIsIFwi4Z+hXCIsIFwi4Z+iXCIsIFwi4Z+jXCIsIFwi4Z+kXCIsIFwi4Z+lXCIsIFwi4Z+mXCIsIFwi4Z+nXCIsIFwi4Z+oXCIsIFwi4Z+pXCJdLFxuICAgIGtuZGE6IFtcIuCzplwiLCBcIuCzp1wiLCBcIuCzqFwiLCBcIuCzqVwiLCBcIuCzqlwiLCBcIuCzq1wiLCBcIuCzrFwiLCBcIuCzrVwiLCBcIuCzrlwiLCBcIuCzr1wiXSxcbiAgICBsYW9vOiBbXCLgu5BcIiwgXCLgu5FcIiwgXCLgu5JcIiwgXCLgu5NcIiwgXCLgu5RcIiwgXCLgu5VcIiwgXCLgu5ZcIiwgXCLgu5dcIiwgXCLgu5hcIiwgXCLgu5lcIl0sXG4gICAgbGF0bjogW1wiMFwiLCBcIjFcIiwgXCIyXCIsIFwiM1wiLCBcIjRcIiwgXCI1XCIsIFwiNlwiLCBcIjdcIiwgXCI4XCIsIFwiOVwiXSxcbiAgICBsaW1iOiBbXCLhpYZcIiwgXCLhpYdcIiwgXCLhpYhcIiwgXCLhpYlcIiwgXCLhpYpcIiwgXCLhpYtcIiwgXCLhpYxcIiwgXCLhpY1cIiwgXCLhpY5cIiwgXCLhpY9cIl0sXG4gICAgbWx5bTogW1wi4LWmXCIsIFwi4LWnXCIsIFwi4LWoXCIsIFwi4LWpXCIsIFwi4LWqXCIsIFwi4LWrXCIsIFwi4LWsXCIsIFwi4LWtXCIsIFwi4LWuXCIsIFwi4LWvXCJdLFxuICAgIG1vbmc6IFtcIuGgkFwiLCBcIuGgkVwiLCBcIuGgklwiLCBcIuGgk1wiLCBcIuGglFwiLCBcIuGglVwiLCBcIuGgllwiLCBcIuGgl1wiLCBcIuGgmFwiLCBcIuGgmVwiXSxcbiAgICBteW1yOiBbXCLhgYBcIiwgXCLhgYFcIiwgXCLhgYJcIiwgXCLhgYNcIiwgXCLhgYRcIiwgXCLhgYVcIiwgXCLhgYZcIiwgXCLhgYdcIiwgXCLhgYhcIiwgXCLhgYlcIl0sXG4gICAgb3J5YTogW1wi4K2mXCIsIFwi4K2nXCIsIFwi4K2oXCIsIFwi4K2pXCIsIFwi4K2qXCIsIFwi4K2rXCIsIFwi4K2sXCIsIFwi4K2tXCIsIFwi4K2uXCIsIFwi4K2vXCJdLFxuICAgIHRhbWxkZWM6IFtcIuCvplwiLCBcIuCvp1wiLCBcIuCvqFwiLCBcIuCvqVwiLCBcIuCvqlwiLCBcIuCvq1wiLCBcIuCvrFwiLCBcIuCvrVwiLCBcIuCvrlwiLCBcIuCvr1wiXSxcbiAgICB0ZWx1OiBbXCLgsaZcIiwgXCLgsadcIiwgXCLgsahcIiwgXCLgsalcIiwgXCLgsapcIiwgXCLgsatcIiwgXCLgsaxcIiwgXCLgsa1cIiwgXCLgsa5cIiwgXCLgsa9cIl0sXG4gICAgdGhhaTogW1wi4LmQXCIsIFwi4LmRXCIsIFwi4LmSXCIsIFwi4LmTXCIsIFwi4LmUXCIsIFwi4LmVXCIsIFwi4LmWXCIsIFwi4LmXXCIsIFwi4LmYXCIsIFwi4LmZXCJdLFxuICAgIHRpYnQ6IFtcIuC8oFwiLCBcIuC8oVwiLCBcIuC8olwiLCBcIuC8o1wiLCBcIuC8pFwiLCBcIuC8pVwiLCBcIuC8plwiLCBcIuC8p1wiLCBcIuC8qFwiLCBcIuC8qVwiXVxufTtcblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIHByb3ZpZGVzIGFjY2VzcyB0byB0aGUgbG9jYWxlIGFuZCBmb3JtYXR0aW5nIG9wdGlvbnMgY29tcHV0ZWRcbiAqIGR1cmluZyBpbml0aWFsaXphdGlvbiBvZiB0aGUgb2JqZWN0LlxuICpcbiAqIFRoZSBmdW5jdGlvbiByZXR1cm5zIGEgbmV3IG9iamVjdCB3aG9zZSBwcm9wZXJ0aWVzIGFuZCBhdHRyaWJ1dGVzIGFyZSBzZXQgYXNcbiAqIGlmIGNvbnN0cnVjdGVkIGJ5IGFuIG9iamVjdCBsaXRlcmFsIGFzc2lnbmluZyB0byBlYWNoIG9mIHRoZSBmb2xsb3dpbmdcbiAqIHByb3BlcnRpZXMgdGhlIHZhbHVlIG9mIHRoZSBjb3JyZXNwb25kaW5nIGludGVybmFsIHByb3BlcnR5IG9mIHRoaXNcbiAqIE51bWJlckZvcm1hdCBvYmplY3QgKHNlZSAxMS40KTogbG9jYWxlLCBudW1iZXJpbmdTeXN0ZW0sIHN0eWxlLCBjdXJyZW5jeSxcbiAqIGN1cnJlbmN5RGlzcGxheSwgbWluaW11bUludGVnZXJEaWdpdHMsIG1pbmltdW1GcmFjdGlvbkRpZ2l0cyxcbiAqIG1heGltdW1GcmFjdGlvbkRpZ2l0cywgbWluaW11bVNpZ25pZmljYW50RGlnaXRzLCBtYXhpbXVtU2lnbmlmaWNhbnREaWdpdHMsIGFuZFxuICogdXNlR3JvdXBpbmcuIFByb3BlcnRpZXMgd2hvc2UgY29ycmVzcG9uZGluZyBpbnRlcm5hbCBwcm9wZXJ0aWVzIGFyZSBub3QgcHJlc2VudFxuICogYXJlIG5vdCBhc3NpZ25lZC5cbiAqL1xuLyogMTEuMy4zICovZGVmaW5lUHJvcGVydHkoSW50bC5OdW1iZXJGb3JtYXQucHJvdG90eXBlLCAncmVzb2x2ZWRPcHRpb25zJywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG4gICAgICAgIHZhciBwcm9wID0gdm9pZCAwLFxuICAgICAgICAgICAgZGVzY3MgPSBuZXcgUmVjb3JkKCksXG4gICAgICAgICAgICBwcm9wcyA9IFsnbG9jYWxlJywgJ251bWJlcmluZ1N5c3RlbScsICdzdHlsZScsICdjdXJyZW5jeScsICdjdXJyZW5jeURpc3BsYXknLCAnbWluaW11bUludGVnZXJEaWdpdHMnLCAnbWluaW11bUZyYWN0aW9uRGlnaXRzJywgJ21heGltdW1GcmFjdGlvbkRpZ2l0cycsICdtaW5pbXVtU2lnbmlmaWNhbnREaWdpdHMnLCAnbWF4aW11bVNpZ25pZmljYW50RGlnaXRzJywgJ3VzZUdyb3VwaW5nJ10sXG4gICAgICAgICAgICBpbnRlcm5hbCA9IHRoaXMgIT09IG51bGwgJiYgYmFiZWxIZWxwZXJzW1widHlwZW9mXCJdKHRoaXMpID09PSAnb2JqZWN0JyAmJiBnZXRJbnRlcm5hbFByb3BlcnRpZXModGhpcyk7XG5cbiAgICAgICAgLy8gU2F0aXNmeSB0ZXN0IDExLjNfYlxuICAgICAgICBpZiAoIWludGVybmFsIHx8ICFpbnRlcm5hbFsnW1tpbml0aWFsaXplZE51bWJlckZvcm1hdF1dJ10pIHRocm93IG5ldyBUeXBlRXJyb3IoJ2B0aGlzYCB2YWx1ZSBmb3IgcmVzb2x2ZWRPcHRpb25zKCkgaXMgbm90IGFuIGluaXRpYWxpemVkIEludGwuTnVtYmVyRm9ybWF0IG9iamVjdC4nKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbWF4ID0gcHJvcHMubGVuZ3RoOyBpIDwgbWF4OyBpKyspIHtcbiAgICAgICAgICAgIGlmIChob3AuY2FsbChpbnRlcm5hbCwgcHJvcCA9ICdbWycgKyBwcm9wc1tpXSArICddXScpKSBkZXNjc1twcm9wc1tpXV0gPSB7IHZhbHVlOiBpbnRlcm5hbFtwcm9wXSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgZW51bWVyYWJsZTogdHJ1ZSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9iakNyZWF0ZSh7fSwgZGVzY3MpO1xuICAgIH1cbn0pO1xuXG4vKiBqc2xpbnQgZXNuZXh0OiB0cnVlICovXG5cbi8vIE1hdGNoIHRoZXNlIGRhdGV0aW1lIGNvbXBvbmVudHMgaW4gYSBDTERSIHBhdHRlcm4sIGV4Y2VwdCB0aG9zZSBpbiBzaW5nbGUgcXVvdGVzXG52YXIgZXhwRFRDb21wb25lbnRzID0gLyg/OltFZWNdezEsNn18R3sxLDV9fFtRcV17MSw1fXwoPzpbeVl1cl0rfFV7MSw1fSl8W01MXXsxLDV9fGR7MSwyfXxEezEsM318RnsxfXxbYWJCXXsxLDV9fFtoa0hLXXsxLDJ9fHd7MSwyfXxXezF9fG17MSwyfXxzezEsMn18W3paT3ZWeFhdezEsNH0pKD89KFteJ10qJ1teJ10qJykqW14nXSokKS9nO1xuLy8gdHJpbSBwYXR0ZXJucyBhZnRlciB0cmFuc2Zvcm1hdGlvbnNcbnZhciBleHBQYXR0ZXJuVHJpbW1lciA9IC9eW1xcc1xcdUZFRkZcXHhBMF0rfFtcXHNcXHVGRUZGXFx4QTBdKyQvZztcbi8vIFNraXAgb3ZlciBwYXR0ZXJucyB3aXRoIHRoZXNlIGRhdGV0aW1lIGNvbXBvbmVudHMgYmVjYXVzZSB3ZSBkb24ndCBoYXZlIGRhdGFcbi8vIHRvIGJhY2sgdGhlbSB1cDpcbi8vIHRpbWV6b25lLCB3ZWVrZGF5LCBhbW91bmcgb3RoZXJzXG52YXIgdW53YW50ZWREVENzID0gL1tycVFBU2pKZ3dXSVFxXS87IC8vIHhYVk8gd2VyZSByZW1vdmVkIGZyb20gdGhpcyBsaXN0IGluIGZhdm9yIG9mIGNvbXB1dGluZyBtYXRjaGVzIHdpdGggdGltZVpvbmVOYW1lIHZhbHVlcyBidXQgcHJpbnRpbmcgYXMgZW1wdHkgc3RyaW5nXG5cbnZhciBkdEtleXMgPSBbXCJ3ZWVrZGF5XCIsIFwiZXJhXCIsIFwieWVhclwiLCBcIm1vbnRoXCIsIFwiZGF5XCIsIFwid2Vla2RheVwiLCBcInF1YXJ0ZXJcIl07XG52YXIgdG1LZXlzID0gW1wiaG91clwiLCBcIm1pbnV0ZVwiLCBcInNlY29uZFwiLCBcImhvdXIxMlwiLCBcInRpbWVab25lTmFtZVwiXTtcblxuZnVuY3Rpb24gaXNEYXRlRm9ybWF0T25seShvYmopIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRtS2V5cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHRtS2V5c1tpXSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNUaW1lRm9ybWF0T25seShvYmopIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGR0S2V5cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGR0S2V5c1tpXSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gam9pbkRhdGVBbmRUaW1lRm9ybWF0cyhkYXRlRm9ybWF0T2JqLCB0aW1lRm9ybWF0T2JqKSB7XG4gICAgdmFyIG8gPSB7IF86IHt9IH07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkdEtleXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGRhdGVGb3JtYXRPYmpbZHRLZXlzW2ldXSkge1xuICAgICAgICAgICAgb1tkdEtleXNbaV1dID0gZGF0ZUZvcm1hdE9ialtkdEtleXNbaV1dO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRlRm9ybWF0T2JqLl9bZHRLZXlzW2ldXSkge1xuICAgICAgICAgICAgby5fW2R0S2V5c1tpXV0gPSBkYXRlRm9ybWF0T2JqLl9bZHRLZXlzW2ldXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRtS2V5cy5sZW5ndGg7IGogKz0gMSkge1xuICAgICAgICBpZiAodGltZUZvcm1hdE9ialt0bUtleXNbal1dKSB7XG4gICAgICAgICAgICBvW3RtS2V5c1tqXV0gPSB0aW1lRm9ybWF0T2JqW3RtS2V5c1tqXV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRpbWVGb3JtYXRPYmouX1t0bUtleXNbal1dKSB7XG4gICAgICAgICAgICBvLl9bdG1LZXlzW2pdXSA9IHRpbWVGb3JtYXRPYmouX1t0bUtleXNbal1dO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvO1xufVxuXG5mdW5jdGlvbiBjb21wdXRlRmluYWxQYXR0ZXJucyhmb3JtYXRPYmopIHtcbiAgICAvLyBGcm9tIGh0dHA6Ly93d3cudW5pY29kZS5vcmcvcmVwb3J0cy90cjM1L3RyMzUtZGF0ZXMuaHRtbCNEYXRlX0Zvcm1hdF9QYXR0ZXJuczpcbiAgICAvLyAgJ0luIHBhdHRlcm5zLCB0d28gc2luZ2xlIHF1b3RlcyByZXByZXNlbnRzIGEgbGl0ZXJhbCBzaW5nbGUgcXVvdGUsIGVpdGhlclxuICAgIC8vICAgaW5zaWRlIG9yIG91dHNpZGUgc2luZ2xlIHF1b3Rlcy4gVGV4dCB3aXRoaW4gc2luZ2xlIHF1b3RlcyBpcyBub3RcbiAgICAvLyAgIGludGVycHJldGVkIGluIGFueSB3YXkgKGV4Y2VwdCBmb3IgdHdvIGFkamFjZW50IHNpbmdsZSBxdW90ZXMpLidcbiAgICBmb3JtYXRPYmoucGF0dGVybjEyID0gZm9ybWF0T2JqLmV4dGVuZGVkUGF0dGVybi5yZXBsYWNlKC8nKFteJ10qKScvZywgZnVuY3Rpb24gKCQwLCBsaXRlcmFsKSB7XG4gICAgICAgIHJldHVybiBsaXRlcmFsID8gbGl0ZXJhbCA6IFwiJ1wiO1xuICAgIH0pO1xuXG4gICAgLy8gcGF0dGVybiAxMiBpcyBhbHdheXMgdGhlIGRlZmF1bHQuIHdlIGNhbiBwcm9kdWNlIHRoZSAyNCBieSByZW1vdmluZyB7YW1wbX1cbiAgICBmb3JtYXRPYmoucGF0dGVybiA9IGZvcm1hdE9iai5wYXR0ZXJuMTIucmVwbGFjZSgne2FtcG19JywgJycpLnJlcGxhY2UoZXhwUGF0dGVyblRyaW1tZXIsICcnKTtcbiAgICByZXR1cm4gZm9ybWF0T2JqO1xufVxuXG5mdW5jdGlvbiBleHBEVENvbXBvbmVudHNNZXRhKCQwLCBmb3JtYXRPYmopIHtcbiAgICBzd2l0Y2ggKCQwLmNoYXJBdCgwKSkge1xuICAgICAgICAvLyAtLS0gRXJhXG4gICAgICAgIGNhc2UgJ0cnOlxuICAgICAgICAgICAgZm9ybWF0T2JqLmVyYSA9IFsnc2hvcnQnLCAnc2hvcnQnLCAnc2hvcnQnLCAnbG9uZycsICduYXJyb3cnXVskMC5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIHJldHVybiAne2VyYX0nO1xuXG4gICAgICAgIC8vIC0tLSBZZWFyXG4gICAgICAgIGNhc2UgJ3knOlxuICAgICAgICBjYXNlICdZJzpcbiAgICAgICAgY2FzZSAndSc6XG4gICAgICAgIGNhc2UgJ1UnOlxuICAgICAgICBjYXNlICdyJzpcbiAgICAgICAgICAgIGZvcm1hdE9iai55ZWFyID0gJDAubGVuZ3RoID09PSAyID8gJzItZGlnaXQnIDogJ251bWVyaWMnO1xuICAgICAgICAgICAgcmV0dXJuICd7eWVhcn0nO1xuXG4gICAgICAgIC8vIC0tLSBRdWFydGVyIChub3Qgc3VwcG9ydGVkIGluIHRoaXMgcG9seWZpbGwpXG4gICAgICAgIGNhc2UgJ1EnOlxuICAgICAgICBjYXNlICdxJzpcbiAgICAgICAgICAgIGZvcm1hdE9iai5xdWFydGVyID0gWydudW1lcmljJywgJzItZGlnaXQnLCAnc2hvcnQnLCAnbG9uZycsICduYXJyb3cnXVskMC5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIHJldHVybiAne3F1YXJ0ZXJ9JztcblxuICAgICAgICAvLyAtLS0gTW9udGhcbiAgICAgICAgY2FzZSAnTSc6XG4gICAgICAgIGNhc2UgJ0wnOlxuICAgICAgICAgICAgZm9ybWF0T2JqLm1vbnRoID0gWydudW1lcmljJywgJzItZGlnaXQnLCAnc2hvcnQnLCAnbG9uZycsICduYXJyb3cnXVskMC5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIHJldHVybiAne21vbnRofSc7XG5cbiAgICAgICAgLy8gLS0tIFdlZWsgKG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBwb2x5ZmlsbClcbiAgICAgICAgY2FzZSAndyc6XG4gICAgICAgICAgICAvLyB3ZWVrIG9mIHRoZSB5ZWFyXG4gICAgICAgICAgICBmb3JtYXRPYmoud2VlayA9ICQwLmxlbmd0aCA9PT0gMiA/ICcyLWRpZ2l0JyA6ICdudW1lcmljJztcbiAgICAgICAgICAgIHJldHVybiAne3dlZWtkYXl9JztcbiAgICAgICAgY2FzZSAnVyc6XG4gICAgICAgICAgICAvLyB3ZWVrIG9mIHRoZSBtb250aFxuICAgICAgICAgICAgZm9ybWF0T2JqLndlZWsgPSAnbnVtZXJpYyc7XG4gICAgICAgICAgICByZXR1cm4gJ3t3ZWVrZGF5fSc7XG5cbiAgICAgICAgLy8gLS0tIERheVxuICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgICAgIC8vIGRheSBvZiB0aGUgbW9udGhcbiAgICAgICAgICAgIGZvcm1hdE9iai5kYXkgPSAkMC5sZW5ndGggPT09IDIgPyAnMi1kaWdpdCcgOiAnbnVtZXJpYyc7XG4gICAgICAgICAgICByZXR1cm4gJ3tkYXl9JztcbiAgICAgICAgY2FzZSAnRCc6IC8vIGRheSBvZiB0aGUgeWVhclxuICAgICAgICBjYXNlICdGJzogLy8gZGF5IG9mIHRoZSB3ZWVrXG4gICAgICAgIGNhc2UgJ2cnOlxuICAgICAgICAgICAgLy8gMS4ubjogTW9kaWZpZWQgSnVsaWFuIGRheVxuICAgICAgICAgICAgZm9ybWF0T2JqLmRheSA9ICdudW1lcmljJztcbiAgICAgICAgICAgIHJldHVybiAne2RheX0nO1xuXG4gICAgICAgIC8vIC0tLSBXZWVrIERheVxuICAgICAgICBjYXNlICdFJzpcbiAgICAgICAgICAgIC8vIGRheSBvZiB0aGUgd2Vla1xuICAgICAgICAgICAgZm9ybWF0T2JqLndlZWtkYXkgPSBbJ3Nob3J0JywgJ3Nob3J0JywgJ3Nob3J0JywgJ2xvbmcnLCAnbmFycm93JywgJ3Nob3J0J11bJDAubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICByZXR1cm4gJ3t3ZWVrZGF5fSc7XG4gICAgICAgIGNhc2UgJ2UnOlxuICAgICAgICAgICAgLy8gbG9jYWwgZGF5IG9mIHRoZSB3ZWVrXG4gICAgICAgICAgICBmb3JtYXRPYmoud2Vla2RheSA9IFsnbnVtZXJpYycsICcyLWRpZ2l0JywgJ3Nob3J0JywgJ2xvbmcnLCAnbmFycm93JywgJ3Nob3J0J11bJDAubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICByZXR1cm4gJ3t3ZWVrZGF5fSc7XG4gICAgICAgIGNhc2UgJ2MnOlxuICAgICAgICAgICAgLy8gc3RhbmQgYWxvbmUgbG9jYWwgZGF5IG9mIHRoZSB3ZWVrXG4gICAgICAgICAgICBmb3JtYXRPYmoud2Vla2RheSA9IFsnbnVtZXJpYycsIHVuZGVmaW5lZCwgJ3Nob3J0JywgJ2xvbmcnLCAnbmFycm93JywgJ3Nob3J0J11bJDAubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICByZXR1cm4gJ3t3ZWVrZGF5fSc7XG5cbiAgICAgICAgLy8gLS0tIFBlcmlvZFxuICAgICAgICBjYXNlICdhJzogLy8gQU0sIFBNXG4gICAgICAgIGNhc2UgJ2InOiAvLyBhbSwgcG0sIG5vb24sIG1pZG5pZ2h0XG4gICAgICAgIGNhc2UgJ0InOlxuICAgICAgICAgICAgLy8gZmxleGlibGUgZGF5IHBlcmlvZHNcbiAgICAgICAgICAgIGZvcm1hdE9iai5ob3VyMTIgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuICd7YW1wbX0nO1xuXG4gICAgICAgIC8vIC0tLSBIb3VyXG4gICAgICAgIGNhc2UgJ2gnOlxuICAgICAgICBjYXNlICdIJzpcbiAgICAgICAgICAgIGZvcm1hdE9iai5ob3VyID0gJDAubGVuZ3RoID09PSAyID8gJzItZGlnaXQnIDogJ251bWVyaWMnO1xuICAgICAgICAgICAgcmV0dXJuICd7aG91cn0nO1xuICAgICAgICBjYXNlICdrJzpcbiAgICAgICAgY2FzZSAnSyc6XG4gICAgICAgICAgICBmb3JtYXRPYmouaG91cjEyID0gdHJ1ZTsgLy8gMTItaG91ci1jeWNsZSB0aW1lIGZvcm1hdHMgKHVzaW5nIGggb3IgSylcbiAgICAgICAgICAgIGZvcm1hdE9iai5ob3VyID0gJDAubGVuZ3RoID09PSAyID8gJzItZGlnaXQnIDogJ251bWVyaWMnO1xuICAgICAgICAgICAgcmV0dXJuICd7aG91cn0nO1xuXG4gICAgICAgIC8vIC0tLSBNaW51dGVcbiAgICAgICAgY2FzZSAnbSc6XG4gICAgICAgICAgICBmb3JtYXRPYmoubWludXRlID0gJDAubGVuZ3RoID09PSAyID8gJzItZGlnaXQnIDogJ251bWVyaWMnO1xuICAgICAgICAgICAgcmV0dXJuICd7bWludXRlfSc7XG5cbiAgICAgICAgLy8gLS0tIFNlY29uZFxuICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgIGZvcm1hdE9iai5zZWNvbmQgPSAkMC5sZW5ndGggPT09IDIgPyAnMi1kaWdpdCcgOiAnbnVtZXJpYyc7XG4gICAgICAgICAgICByZXR1cm4gJ3tzZWNvbmR9JztcbiAgICAgICAgY2FzZSAnUyc6XG4gICAgICAgIGNhc2UgJ0EnOlxuICAgICAgICAgICAgZm9ybWF0T2JqLnNlY29uZCA9ICdudW1lcmljJztcbiAgICAgICAgICAgIHJldHVybiAne3NlY29uZH0nO1xuXG4gICAgICAgIC8vIC0tLSBUaW1lem9uZVxuICAgICAgICBjYXNlICd6JzogLy8gMS4uMywgNDogc3BlY2lmaWMgbm9uLWxvY2F0aW9uIGZvcm1hdFxuICAgICAgICBjYXNlICdaJzogLy8gMS4uMywgNCwgNTogVGhlIElTTzg2MDEgdmFyaW9zIGZvcm1hdHNcbiAgICAgICAgY2FzZSAnTyc6IC8vIDEsIDQ6IG1pbGlzZWNvbmRzIGluIGRheSBzaG9ydCwgbG9uZ1xuICAgICAgICBjYXNlICd2JzogLy8gMSwgNDogZ2VuZXJpYyBub24tbG9jYXRpb24gZm9ybWF0XG4gICAgICAgIGNhc2UgJ1YnOiAvLyAxLCAyLCAzLCA0OiB0aW1lIHpvbmUgSUQgb3IgY2l0eVxuICAgICAgICBjYXNlICdYJzogLy8gMSwgMiwgMywgNDogVGhlIElTTzg2MDEgdmFyaW9zIGZvcm1hdHNcbiAgICAgICAgY2FzZSAneCc6XG4gICAgICAgICAgICAvLyAxLCAyLCAzLCA0OiBUaGUgSVNPODYwMSB2YXJpb3MgZm9ybWF0c1xuICAgICAgICAgICAgLy8gdGhpcyBwb2x5ZmlsbCBvbmx5IHN1cHBvcnRzIG11Y2gsIGZvciBub3csIHdlIGFyZSBqdXN0IGRvaW5nIHNvbWV0aGluZyBkdW1teVxuICAgICAgICAgICAgZm9ybWF0T2JqLnRpbWVab25lTmFtZSA9ICQwLmxlbmd0aCA8IDQgPyAnc2hvcnQnIDogJ2xvbmcnO1xuICAgICAgICAgICAgcmV0dXJuICd7dGltZVpvbmVOYW1lfSc7XG4gICAgfVxufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBDTERSIGF2YWlsYWJsZUZvcm1hdHMgaW50byB0aGUgb2JqZWN0cyBhbmQgcGF0dGVybnMgcmVxdWlyZWQgYnlcbiAqIHRoZSBFQ01BU2NyaXB0IEludGVybmF0aW9uYWxpemF0aW9uIEFQSSBzcGVjaWZpY2F0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVEYXRlVGltZUZvcm1hdChza2VsZXRvbiwgcGF0dGVybikge1xuICAgIC8vIHdlIGlnbm9yZSBjZXJ0YWluIHBhdHRlcm5zIHRoYXQgYXJlIHVuc3VwcG9ydGVkIHRvIGF2b2lkIHRoaXMgZXhwZW5zaXZlIG9wLlxuICAgIGlmICh1bndhbnRlZERUQ3MudGVzdChwYXR0ZXJuKSkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIHZhciBmb3JtYXRPYmogPSB7XG4gICAgICAgIG9yaWdpbmFsUGF0dGVybjogcGF0dGVybixcbiAgICAgICAgXzoge31cbiAgICB9O1xuXG4gICAgLy8gUmVwbGFjZSB0aGUgcGF0dGVybiBzdHJpbmcgd2l0aCB0aGUgb25lIHJlcXVpcmVkIGJ5IHRoZSBzcGVjaWZpY2F0aW9uLCB3aGlsc3RcbiAgICAvLyBhdCB0aGUgc2FtZSB0aW1lIGV2YWx1YXRpbmcgaXQgZm9yIHRoZSBzdWJzZXRzIGFuZCBmb3JtYXRzXG4gICAgZm9ybWF0T2JqLmV4dGVuZGVkUGF0dGVybiA9IHBhdHRlcm4ucmVwbGFjZShleHBEVENvbXBvbmVudHMsIGZ1bmN0aW9uICgkMCkge1xuICAgICAgICAvLyBTZWUgd2hpY2ggc3ltYm9sIHdlJ3JlIGRlYWxpbmcgd2l0aFxuICAgICAgICByZXR1cm4gZXhwRFRDb21wb25lbnRzTWV0YSgkMCwgZm9ybWF0T2JqLl8pO1xuICAgIH0pO1xuXG4gICAgLy8gTWF0Y2ggdGhlIHNrZWxldG9uIHN0cmluZyB3aXRoIHRoZSBvbmUgcmVxdWlyZWQgYnkgdGhlIHNwZWNpZmljYXRpb25cbiAgICAvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIGJhc2VkIG9uIHRoZSBEYXRlIEZpZWxkIFN5bWJvbCBUYWJsZTpcbiAgICAvLyBodHRwOi8vdW5pY29kZS5vcmcvcmVwb3J0cy90cjM1L3RyMzUtZGF0ZXMuaHRtbCNEYXRlX0ZpZWxkX1N5bWJvbF9UYWJsZVxuICAgIC8vIE5vdGU6IHdlIGFyZSBhZGRpbmcgZXh0cmEgZGF0YSB0byB0aGUgZm9ybWF0T2JqZWN0IGV2ZW4gdGhvdWdoIHRoaXMgcG9seWZpbGxcbiAgICAvLyAgICAgICBtaWdodCBub3Qgc3VwcG9ydCBpdC5cbiAgICBza2VsZXRvbi5yZXBsYWNlKGV4cERUQ29tcG9uZW50cywgZnVuY3Rpb24gKCQwKSB7XG4gICAgICAgIC8vIFNlZSB3aGljaCBzeW1ib2wgd2UncmUgZGVhbGluZyB3aXRoXG4gICAgICAgIHJldHVybiBleHBEVENvbXBvbmVudHNNZXRhKCQwLCBmb3JtYXRPYmopO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbXB1dGVGaW5hbFBhdHRlcm5zKGZvcm1hdE9iaik7XG59XG5cbi8qKlxuICogUHJvY2Vzc2VzIERhdGVUaW1lIGZvcm1hdHMgZnJvbSBDTERSIHRvIGFuIGVhc2llci10by1wYXJzZSBmb3JtYXQuXG4gKiB0aGUgcmVzdWx0IG9mIHRoaXMgb3BlcmF0aW9uIHNob3VsZCBiZSBjYWNoZWQgdGhlIGZpcnN0IHRpbWUgYSBwYXJ0aWN1bGFyXG4gKiBjYWxlbmRhciBpcyBhbmFseXplZC5cbiAqXG4gKiBUaGUgc3BlY2lmaWNhdGlvbiByZXF1aXJlcyB3ZSBzdXBwb3J0IGF0IGxlYXN0IHRoZSBmb2xsb3dpbmcgc3Vic2V0cyBvZlxuICogZGF0ZS90aW1lIGNvbXBvbmVudHM6XG4gKlxuICogICAtICd3ZWVrZGF5JywgJ3llYXInLCAnbW9udGgnLCAnZGF5JywgJ2hvdXInLCAnbWludXRlJywgJ3NlY29uZCdcbiAqICAgLSAnd2Vla2RheScsICd5ZWFyJywgJ21vbnRoJywgJ2RheSdcbiAqICAgLSAneWVhcicsICdtb250aCcsICdkYXknXG4gKiAgIC0gJ3llYXInLCAnbW9udGgnXG4gKiAgIC0gJ21vbnRoJywgJ2RheSdcbiAqICAgLSAnaG91cicsICdtaW51dGUnLCAnc2Vjb25kJ1xuICogICAtICdob3VyJywgJ21pbnV0ZSdcbiAqXG4gKiBXZSBuZWVkIHRvIGNoZXJyeSBwaWNrIGF0IGxlYXN0IHRoZXNlIHN1YnNldHMgZnJvbSB0aGUgQ0xEUiBkYXRhIGFuZCBjb252ZXJ0XG4gKiB0aGVtIGludG8gdGhlIHBhdHRlcm4gb2JqZWN0cyB1c2VkIGluIHRoZSBFQ01BLTQwMiBBUEkuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZURhdGVUaW1lRm9ybWF0cyhmb3JtYXRzKSB7XG4gICAgdmFyIGF2YWlsYWJsZUZvcm1hdHMgPSBmb3JtYXRzLmF2YWlsYWJsZUZvcm1hdHM7XG4gICAgdmFyIHRpbWVGb3JtYXRzID0gZm9ybWF0cy50aW1lRm9ybWF0cztcbiAgICB2YXIgZGF0ZUZvcm1hdHMgPSBmb3JtYXRzLmRhdGVGb3JtYXRzO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgc2tlbGV0b24gPSB2b2lkIDAsXG4gICAgICAgIHBhdHRlcm4gPSB2b2lkIDAsXG4gICAgICAgIGNvbXB1dGVkID0gdm9pZCAwLFxuICAgICAgICBpID0gdm9pZCAwLFxuICAgICAgICBqID0gdm9pZCAwO1xuICAgIHZhciB0aW1lUmVsYXRlZEZvcm1hdHMgPSBbXTtcbiAgICB2YXIgZGF0ZVJlbGF0ZWRGb3JtYXRzID0gW107XG5cbiAgICAvLyBNYXAgYXZhaWxhYmxlIChjdXN0b20pIGZvcm1hdHMgaW50byBhIHBhdHRlcm4gZm9yIGNyZWF0ZURhdGVUaW1lRm9ybWF0c1xuICAgIGZvciAoc2tlbGV0b24gaW4gYXZhaWxhYmxlRm9ybWF0cykge1xuICAgICAgICBpZiAoYXZhaWxhYmxlRm9ybWF0cy5oYXNPd25Qcm9wZXJ0eShza2VsZXRvbikpIHtcbiAgICAgICAgICAgIHBhdHRlcm4gPSBhdmFpbGFibGVGb3JtYXRzW3NrZWxldG9uXTtcbiAgICAgICAgICAgIGNvbXB1dGVkID0gY3JlYXRlRGF0ZVRpbWVGb3JtYXQoc2tlbGV0b24sIHBhdHRlcm4pO1xuICAgICAgICAgICAgaWYgKGNvbXB1dGVkKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goY29tcHV0ZWQpO1xuICAgICAgICAgICAgICAgIC8vIGluIHNvbWUgY2FzZXMsIHRoZSBmb3JtYXQgaXMgb25seSBkaXNwbGF5aW5nIGRhdGUgc3BlY2lmaWMgcHJvcHNcbiAgICAgICAgICAgICAgICAvLyBvciB0aW1lIHNwZWNpZmljIHByb3BzLCBpbiB3aGljaCBjYXNlIHdlIG5lZWQgdG8gYWxzbyBwcm9kdWNlIHRoZVxuICAgICAgICAgICAgICAgIC8vIGNvbWJpbmVkIGZvcm1hdHMuXG4gICAgICAgICAgICAgICAgaWYgKGlzRGF0ZUZvcm1hdE9ubHkoY29tcHV0ZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGVSZWxhdGVkRm9ybWF0cy5wdXNoKGNvbXB1dGVkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzVGltZUZvcm1hdE9ubHkoY29tcHV0ZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVSZWxhdGVkRm9ybWF0cy5wdXNoKGNvbXB1dGVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNYXAgdGltZSBmb3JtYXRzIGludG8gYSBwYXR0ZXJuIGZvciBjcmVhdGVEYXRlVGltZUZvcm1hdHNcbiAgICBmb3IgKHNrZWxldG9uIGluIHRpbWVGb3JtYXRzKSB7XG4gICAgICAgIGlmICh0aW1lRm9ybWF0cy5oYXNPd25Qcm9wZXJ0eShza2VsZXRvbikpIHtcbiAgICAgICAgICAgIHBhdHRlcm4gPSB0aW1lRm9ybWF0c1tza2VsZXRvbl07XG4gICAgICAgICAgICBjb21wdXRlZCA9IGNyZWF0ZURhdGVUaW1lRm9ybWF0KHNrZWxldG9uLCBwYXR0ZXJuKTtcbiAgICAgICAgICAgIGlmIChjb21wdXRlZCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGNvbXB1dGVkKTtcbiAgICAgICAgICAgICAgICB0aW1lUmVsYXRlZEZvcm1hdHMucHVzaChjb21wdXRlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNYXAgZGF0ZSBmb3JtYXRzIGludG8gYSBwYXR0ZXJuIGZvciBjcmVhdGVEYXRlVGltZUZvcm1hdHNcbiAgICBmb3IgKHNrZWxldG9uIGluIGRhdGVGb3JtYXRzKSB7XG4gICAgICAgIGlmIChkYXRlRm9ybWF0cy5oYXNPd25Qcm9wZXJ0eShza2VsZXRvbikpIHtcbiAgICAgICAgICAgIHBhdHRlcm4gPSBkYXRlRm9ybWF0c1tza2VsZXRvbl07XG4gICAgICAgICAgICBjb21wdXRlZCA9IGNyZWF0ZURhdGVUaW1lRm9ybWF0KHNrZWxldG9uLCBwYXR0ZXJuKTtcbiAgICAgICAgICAgIGlmIChjb21wdXRlZCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGNvbXB1dGVkKTtcbiAgICAgICAgICAgICAgICBkYXRlUmVsYXRlZEZvcm1hdHMucHVzaChjb21wdXRlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb21iaW5lIGN1c3RvbSB0aW1lIGFuZCBjdXN0b20gZGF0ZSBmb3JtYXRzIHdoZW4gdGhleSBhcmUgb3J0aG9nb25hbHMgdG8gY29tcGxldGUgdGhlXG4gICAgLy8gZm9ybWF0cyBzdXBwb3J0ZWQgYnkgQ0xEUi5cbiAgICAvLyBUaGlzIEFsZ28gaXMgYmFzZWQgb24gc2VjdGlvbiBcIk1pc3NpbmcgU2tlbGV0b24gRmllbGRzXCIgZnJvbTpcbiAgICAvLyBodHRwOi8vdW5pY29kZS5vcmcvcmVwb3J0cy90cjM1L3RyMzUtZGF0ZXMuaHRtbCNhdmFpbGFibGVGb3JtYXRzX2FwcGVuZEl0ZW1zXG4gICAgZm9yIChpID0gMDsgaSA8IHRpbWVSZWxhdGVkRm9ybWF0cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgZGF0ZVJlbGF0ZWRGb3JtYXRzLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgICBpZiAoZGF0ZVJlbGF0ZWRGb3JtYXRzW2pdLm1vbnRoID09PSAnbG9uZycpIHtcbiAgICAgICAgICAgICAgICBwYXR0ZXJuID0gZGF0ZVJlbGF0ZWRGb3JtYXRzW2pdLndlZWtkYXkgPyBmb3JtYXRzLmZ1bGwgOiBmb3JtYXRzLmxvbmc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGVSZWxhdGVkRm9ybWF0c1tqXS5tb250aCA9PT0gJ3Nob3J0Jykge1xuICAgICAgICAgICAgICAgIHBhdHRlcm4gPSBmb3JtYXRzLm1lZGl1bTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGF0dGVybiA9IGZvcm1hdHMuc2hvcnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb21wdXRlZCA9IGpvaW5EYXRlQW5kVGltZUZvcm1hdHMoZGF0ZVJlbGF0ZWRGb3JtYXRzW2pdLCB0aW1lUmVsYXRlZEZvcm1hdHNbaV0pO1xuICAgICAgICAgICAgY29tcHV0ZWQub3JpZ2luYWxQYXR0ZXJuID0gcGF0dGVybjtcbiAgICAgICAgICAgIGNvbXB1dGVkLmV4dGVuZGVkUGF0dGVybiA9IHBhdHRlcm4ucmVwbGFjZSgnezB9JywgdGltZVJlbGF0ZWRGb3JtYXRzW2ldLmV4dGVuZGVkUGF0dGVybikucmVwbGFjZSgnezF9JywgZGF0ZVJlbGF0ZWRGb3JtYXRzW2pdLmV4dGVuZGVkUGF0dGVybikucmVwbGFjZSgvXlssXFxzXSt8WyxcXHNdKyQvZ2ksICcnKTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGNvbXB1dGVGaW5hbFBhdHRlcm5zKGNvbXB1dGVkKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBBbiBvYmplY3QgbWFwIG9mIGRhdGUgY29tcG9uZW50IGtleXMsIHNhdmVzIHVzaW5nIGEgcmVnZXggbGF0ZXJcbnZhciBkYXRlV2lkdGhzID0gb2JqQ3JlYXRlKG51bGwsIHsgbmFycm93OiB7fSwgc2hvcnQ6IHt9LCBsb25nOiB7fSB9KTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgc3RyaW5nIGZvciBhIGRhdGUgY29tcG9uZW50LCByZXNvbHZlZCB1c2luZyBtdWx0aXBsZSBpbmhlcml0YW5jZSBhcyBzcGVjaWZpZWRcbiAqIGFzIHNwZWNpZmllZCBpbiB0aGUgVW5pY29kZSBUZWNobmljYWwgU3RhbmRhcmQgMzUuXG4gKi9cbmZ1bmN0aW9uIHJlc29sdmVEYXRlU3RyaW5nKGRhdGEsIGNhLCBjb21wb25lbnQsIHdpZHRoLCBrZXkpIHtcbiAgICAvLyBGcm9tIGh0dHA6Ly93d3cudW5pY29kZS5vcmcvcmVwb3J0cy90cjM1L3RyMzUuaHRtbCNNdWx0aXBsZV9Jbmhlcml0YW5jZTpcbiAgICAvLyAnSW4gY2xlYXJseSBzcGVjaWZpZWQgaW5zdGFuY2VzLCByZXNvdXJjZXMgbWF5IGluaGVyaXQgZnJvbSB3aXRoaW4gdGhlIHNhbWUgbG9jYWxlLlxuICAgIC8vICBGb3IgZXhhbXBsZSwgLi4uIHRoZSBCdWRkaGlzdCBjYWxlbmRhciBpbmhlcml0cyBmcm9tIHRoZSBHcmVnb3JpYW4gY2FsZW5kYXIuJ1xuICAgIHZhciBvYmogPSBkYXRhW2NhXSAmJiBkYXRhW2NhXVtjb21wb25lbnRdID8gZGF0YVtjYV1bY29tcG9uZW50XSA6IGRhdGEuZ3JlZ29yeVtjb21wb25lbnRdLFxuXG5cbiAgICAvLyBcInNpZGV3YXlzXCIgaW5oZXJpdGFuY2UgcmVzb2x2ZXMgc3RyaW5ncyB3aGVuIGEga2V5IGRvZXNuJ3QgZXhpc3RcbiAgICBhbHRzID0ge1xuICAgICAgICBuYXJyb3c6IFsnc2hvcnQnLCAnbG9uZyddLFxuICAgICAgICBzaG9ydDogWydsb25nJywgJ25hcnJvdyddLFxuICAgICAgICBsb25nOiBbJ3Nob3J0JywgJ25hcnJvdyddXG4gICAgfSxcblxuXG4gICAgLy9cbiAgICByZXNvbHZlZCA9IGhvcC5jYWxsKG9iaiwgd2lkdGgpID8gb2JqW3dpZHRoXSA6IGhvcC5jYWxsKG9iaiwgYWx0c1t3aWR0aF1bMF0pID8gb2JqW2FsdHNbd2lkdGhdWzBdXSA6IG9ialthbHRzW3dpZHRoXVsxXV07XG5cbiAgICAvLyBga2V5YCB3b3VsZG4ndCBiZSBzcGVjaWZpZWQgZm9yIGNvbXBvbmVudHMgJ2RheVBlcmlvZHMnXG4gICAgcmV0dXJuIGtleSAhPT0gbnVsbCA/IHJlc29sdmVkW2tleV0gOiByZXNvbHZlZDtcbn1cblxuLy8gRGVmaW5lIHRoZSBEYXRlVGltZUZvcm1hdCBjb25zdHJ1Y3RvciBpbnRlcm5hbGx5IHNvIGl0IGNhbm5vdCBiZSB0YWludGVkXG5mdW5jdGlvbiBEYXRlVGltZUZvcm1hdENvbnN0cnVjdG9yKCkge1xuICAgIHZhciBsb2NhbGVzID0gYXJndW1lbnRzWzBdO1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzWzFdO1xuXG4gICAgaWYgKCF0aGlzIHx8IHRoaXMgPT09IEludGwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGxvY2FsZXMsIG9wdGlvbnMpO1xuICAgIH1cbiAgICByZXR1cm4gSW5pdGlhbGl6ZURhdGVUaW1lRm9ybWF0KHRvT2JqZWN0KHRoaXMpLCBsb2NhbGVzLCBvcHRpb25zKTtcbn1cblxuZGVmaW5lUHJvcGVydHkoSW50bCwgJ0RhdGVUaW1lRm9ybWF0Jywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogRGF0ZVRpbWVGb3JtYXRDb25zdHJ1Y3RvclxufSk7XG5cbi8vIE11c3QgZXhwbGljaXRseSBzZXQgcHJvdG90eXBlcyBhcyB1bndyaXRhYmxlXG5kZWZpbmVQcm9wZXJ0eShEYXRlVGltZUZvcm1hdENvbnN0cnVjdG9yLCAncHJvdG90eXBlJywge1xuICAgIHdyaXRhYmxlOiBmYWxzZVxufSk7XG5cbi8qKlxuICogVGhlIGFic3RyYWN0IG9wZXJhdGlvbiBJbml0aWFsaXplRGF0ZVRpbWVGb3JtYXQgYWNjZXB0cyB0aGUgYXJndW1lbnRzIGRhdGVUaW1lRm9ybWF0XG4gKiAod2hpY2ggbXVzdCBiZSBhbiBvYmplY3QpLCBsb2NhbGVzLCBhbmQgb3B0aW9ucy4gSXQgaW5pdGlhbGl6ZXMgZGF0ZVRpbWVGb3JtYXQgYXMgYVxuICogRGF0ZVRpbWVGb3JtYXQgb2JqZWN0LlxuICovXG5mdW5jdGlvbiAvKiAxMi4xLjEuMSAqL0luaXRpYWxpemVEYXRlVGltZUZvcm1hdChkYXRlVGltZUZvcm1hdCwgbG9jYWxlcywgb3B0aW9ucykge1xuICAgIC8vIFRoaXMgd2lsbCBiZSBhIGludGVybmFsIHByb3BlcnRpZXMgb2JqZWN0IGlmIHdlJ3JlIG5vdCBhbHJlYWR5IGluaXRpYWxpemVkXG4gICAgdmFyIGludGVybmFsID0gZ2V0SW50ZXJuYWxQcm9wZXJ0aWVzKGRhdGVUaW1lRm9ybWF0KTtcblxuICAgIC8vIENyZWF0ZSBhbiBvYmplY3Qgd2hvc2UgcHJvcHMgY2FuIGJlIHVzZWQgdG8gcmVzdG9yZSB0aGUgdmFsdWVzIG9mIFJlZ0V4cCBwcm9wc1xuICAgIHZhciByZWdleHBTdGF0ZSA9IGNyZWF0ZVJlZ0V4cFJlc3RvcmUoKTtcblxuICAgIC8vIDEuIElmIGRhdGVUaW1lRm9ybWF0IGhhcyBhbiBbW2luaXRpYWxpemVkSW50bE9iamVjdF1dIGludGVybmFsIHByb3BlcnR5IHdpdGhcbiAgICAvLyAgICB2YWx1ZSB0cnVlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXG4gICAgaWYgKGludGVybmFsWydbW2luaXRpYWxpemVkSW50bE9iamVjdF1dJ10gPT09IHRydWUpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2B0aGlzYCBvYmplY3QgaGFzIGFscmVhZHkgYmVlbiBpbml0aWFsaXplZCBhcyBhbiBJbnRsIG9iamVjdCcpO1xuXG4gICAgLy8gTmVlZCB0aGlzIHRvIGFjY2VzcyB0aGUgYGludGVybmFsYCBvYmplY3RcbiAgICBkZWZpbmVQcm9wZXJ0eShkYXRlVGltZUZvcm1hdCwgJ19fZ2V0SW50ZXJuYWxQcm9wZXJ0aWVzJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG4gICAgICAgICAgICAvLyBOT1RFOiBOb24tc3RhbmRhcmQsIGZvciBpbnRlcm5hbCB1c2Ugb25seVxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50c1swXSA9PT0gc2VjcmV0KSByZXR1cm4gaW50ZXJuYWw7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIDIuIFNldCB0aGUgW1tpbml0aWFsaXplZEludGxPYmplY3RdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBudW1iZXJGb3JtYXQgdG8gdHJ1ZS5cbiAgICBpbnRlcm5hbFsnW1tpbml0aWFsaXplZEludGxPYmplY3RdXSddID0gdHJ1ZTtcblxuICAgIC8vIDMuIExldCByZXF1ZXN0ZWRMb2NhbGVzIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgQ2Fub25pY2FsaXplTG9jYWxlTGlzdFxuICAgIC8vICAgIGFic3RyYWN0IG9wZXJhdGlvbiAoZGVmaW5lZCBpbiA5LjIuMSkgd2l0aCBhcmd1bWVudCBsb2NhbGVzLlxuICAgIHZhciByZXF1ZXN0ZWRMb2NhbGVzID0gQ2Fub25pY2FsaXplTG9jYWxlTGlzdChsb2NhbGVzKTtcblxuICAgIC8vIDQuIExldCBvcHRpb25zIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgVG9EYXRlVGltZU9wdGlvbnMgYWJzdHJhY3RcbiAgICAvLyAgICBvcGVyYXRpb24gKGRlZmluZWQgYmVsb3cpIHdpdGggYXJndW1lbnRzIG9wdGlvbnMsIFwiYW55XCIsIGFuZCBcImRhdGVcIi5cbiAgICBvcHRpb25zID0gVG9EYXRlVGltZU9wdGlvbnMob3B0aW9ucywgJ2FueScsICdkYXRlJyk7XG5cbiAgICAvLyA1LiBMZXQgb3B0IGJlIGEgbmV3IFJlY29yZC5cbiAgICB2YXIgb3B0ID0gbmV3IFJlY29yZCgpO1xuXG4gICAgLy8gNi4gTGV0IG1hdGNoZXIgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXRPcHRpb24gYWJzdHJhY3Qgb3BlcmF0aW9uXG4gICAgLy8gICAgKGRlZmluZWQgaW4gOS4yLjkpIHdpdGggYXJndW1lbnRzIG9wdGlvbnMsIFwibG9jYWxlTWF0Y2hlclwiLCBcInN0cmluZ1wiLCBhIExpc3RcbiAgICAvLyAgICBjb250YWluaW5nIHRoZSB0d28gU3RyaW5nIHZhbHVlcyBcImxvb2t1cFwiIGFuZCBcImJlc3QgZml0XCIsIGFuZCBcImJlc3QgZml0XCIuXG4gICAgdmFyIG1hdGNoZXIgPSBHZXRPcHRpb24ob3B0aW9ucywgJ2xvY2FsZU1hdGNoZXInLCAnc3RyaW5nJywgbmV3IExpc3QoJ2xvb2t1cCcsICdiZXN0IGZpdCcpLCAnYmVzdCBmaXQnKTtcblxuICAgIC8vIDcuIFNldCBvcHQuW1tsb2NhbGVNYXRjaGVyXV0gdG8gbWF0Y2hlci5cbiAgICBvcHRbJ1tbbG9jYWxlTWF0Y2hlcl1dJ10gPSBtYXRjaGVyO1xuXG4gICAgLy8gOC4gTGV0IERhdGVUaW1lRm9ybWF0IGJlIHRoZSBzdGFuZGFyZCBidWlsdC1pbiBvYmplY3QgdGhhdCBpcyB0aGUgaW5pdGlhbFxuICAgIC8vICAgIHZhbHVlIG9mIEludGwuRGF0ZVRpbWVGb3JtYXQuXG4gICAgdmFyIERhdGVUaW1lRm9ybWF0ID0gaW50ZXJuYWxzLkRhdGVUaW1lRm9ybWF0OyAvLyBUaGlzIGlzIHdoYXQgd2UgKnJlYWxseSogbmVlZFxuXG4gICAgLy8gOS4gTGV0IGxvY2FsZURhdGEgYmUgdGhlIHZhbHVlIG9mIHRoZSBbW2xvY2FsZURhdGFdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZlxuICAgIC8vICAgIERhdGVUaW1lRm9ybWF0LlxuICAgIHZhciBsb2NhbGVEYXRhID0gRGF0ZVRpbWVGb3JtYXRbJ1tbbG9jYWxlRGF0YV1dJ107XG5cbiAgICAvLyAxMC4gTGV0IHIgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBSZXNvbHZlTG9jYWxlIGFic3RyYWN0IG9wZXJhdGlvblxuICAgIC8vICAgICAoZGVmaW5lZCBpbiA5LjIuNSkgd2l0aCB0aGUgW1thdmFpbGFibGVMb2NhbGVzXV0gaW50ZXJuYWwgcHJvcGVydHkgb2ZcbiAgICAvLyAgICAgIERhdGVUaW1lRm9ybWF0LCByZXF1ZXN0ZWRMb2NhbGVzLCBvcHQsIHRoZSBbW3JlbGV2YW50RXh0ZW5zaW9uS2V5c11dXG4gICAgLy8gICAgICBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBEYXRlVGltZUZvcm1hdCwgYW5kIGxvY2FsZURhdGEuXG4gICAgdmFyIHIgPSBSZXNvbHZlTG9jYWxlKERhdGVUaW1lRm9ybWF0WydbW2F2YWlsYWJsZUxvY2FsZXNdXSddLCByZXF1ZXN0ZWRMb2NhbGVzLCBvcHQsIERhdGVUaW1lRm9ybWF0WydbW3JlbGV2YW50RXh0ZW5zaW9uS2V5c11dJ10sIGxvY2FsZURhdGEpO1xuXG4gICAgLy8gMTEuIFNldCB0aGUgW1tsb2NhbGVdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBkYXRlVGltZUZvcm1hdCB0byB0aGUgdmFsdWUgb2ZcbiAgICAvLyAgICAgci5bW2xvY2FsZV1dLlxuICAgIGludGVybmFsWydbW2xvY2FsZV1dJ10gPSByWydbW2xvY2FsZV1dJ107XG5cbiAgICAvLyAxMi4gU2V0IHRoZSBbW2NhbGVuZGFyXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgZGF0ZVRpbWVGb3JtYXQgdG8gdGhlIHZhbHVlIG9mXG4gICAgLy8gICAgIHIuW1tjYV1dLlxuICAgIGludGVybmFsWydbW2NhbGVuZGFyXV0nXSA9IHJbJ1tbY2FdXSddO1xuXG4gICAgLy8gMTMuIFNldCB0aGUgW1tudW1iZXJpbmdTeXN0ZW1dXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBkYXRlVGltZUZvcm1hdCB0byB0aGUgdmFsdWUgb2ZcbiAgICAvLyAgICAgci5bW251XV0uXG4gICAgaW50ZXJuYWxbJ1tbbnVtYmVyaW5nU3lzdGVtXV0nXSA9IHJbJ1tbbnVdXSddO1xuXG4gICAgLy8gVGhlIHNwZWNpZmljYXRpb24gZG9lc24ndCB0ZWxsIHVzIHRvIGRvIHRoaXMsIGJ1dCBpdCdzIGhlbHBmdWwgbGF0ZXIgb25cbiAgICBpbnRlcm5hbFsnW1tkYXRhTG9jYWxlXV0nXSA9IHJbJ1tbZGF0YUxvY2FsZV1dJ107XG5cbiAgICAvLyAxNC4gTGV0IGRhdGFMb2NhbGUgYmUgdGhlIHZhbHVlIG9mIHIuW1tkYXRhTG9jYWxlXV0uXG4gICAgdmFyIGRhdGFMb2NhbGUgPSByWydbW2RhdGFMb2NhbGVdXSddO1xuXG4gICAgLy8gMTUuIExldCB0eiBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mIG9wdGlvbnMgd2l0aFxuICAgIC8vICAgICBhcmd1bWVudCBcInRpbWVab25lXCIuXG4gICAgdmFyIHR6ID0gb3B0aW9ucy50aW1lWm9uZTtcblxuICAgIC8vIDE2LiBJZiB0eiBpcyBub3QgdW5kZWZpbmVkLCB0aGVuXG4gICAgaWYgKHR6ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gYS4gTGV0IHR6IGJlIFRvU3RyaW5nKHR6KS5cbiAgICAgICAgLy8gYi4gQ29udmVydCB0eiB0byB1cHBlciBjYXNlIGFzIGRlc2NyaWJlZCBpbiA2LjEuXG4gICAgICAgIC8vICAgIE5PVEU6IElmIGFuIGltcGxlbWVudGF0aW9uIGFjY2VwdHMgYWRkaXRpb25hbCB0aW1lIHpvbmUgdmFsdWVzLCBhcyBwZXJtaXR0ZWRcbiAgICAgICAgLy8gICAgICAgICAgdW5kZXIgY2VydGFpbiBjb25kaXRpb25zIGJ5IHRoZSBDb25mb3JtYW5jZSBjbGF1c2UsIGRpZmZlcmVudCBjYXNpbmdcbiAgICAgICAgLy8gICAgICAgICAgcnVsZXMgYXBwbHkuXG4gICAgICAgIHR6ID0gdG9MYXRpblVwcGVyQ2FzZSh0eik7XG5cbiAgICAgICAgLy8gYy4gSWYgdHogaXMgbm90IFwiVVRDXCIsIHRoZW4gdGhyb3cgYSBSYW5nZUVycm9yIGV4Y2VwdGlvbi5cbiAgICAgICAgLy8gIyMjVE9ETzogYWNjZXB0IG1vcmUgdGltZSB6b25lcyMjI1xuICAgICAgICBpZiAodHogIT09ICdVVEMnKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGltZVpvbmUgaXMgbm90IHN1cHBvcnRlZC4nKTtcbiAgICB9XG5cbiAgICAvLyAxNy4gU2V0IHRoZSBbW3RpbWVab25lXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgZGF0ZVRpbWVGb3JtYXQgdG8gdHouXG4gICAgaW50ZXJuYWxbJ1tbdGltZVpvbmVdXSddID0gdHo7XG5cbiAgICAvLyAxOC4gTGV0IG9wdCBiZSBhIG5ldyBSZWNvcmQuXG4gICAgb3B0ID0gbmV3IFJlY29yZCgpO1xuXG4gICAgLy8gMTkuIEZvciBlYWNoIHJvdyBvZiBUYWJsZSAzLCBleGNlcHQgdGhlIGhlYWRlciByb3csIGRvOlxuICAgIGZvciAodmFyIHByb3AgaW4gZGF0ZVRpbWVDb21wb25lbnRzKSB7XG4gICAgICAgIGlmICghaG9wLmNhbGwoZGF0ZVRpbWVDb21wb25lbnRzLCBwcm9wKSkgY29udGludWU7XG5cbiAgICAgICAgLy8gMjAuIExldCBwcm9wIGJlIHRoZSBuYW1lIGdpdmVuIGluIHRoZSBQcm9wZXJ0eSBjb2x1bW4gb2YgdGhlIHJvdy5cbiAgICAgICAgLy8gMjEuIExldCB2YWx1ZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldE9wdGlvbiBhYnN0cmFjdCBvcGVyYXRpb24sXG4gICAgICAgIC8vICAgICBwYXNzaW5nIGFzIGFyZ3VtZW50IG9wdGlvbnMsIHRoZSBuYW1lIGdpdmVuIGluIHRoZSBQcm9wZXJ0eSBjb2x1bW4gb2YgdGhlXG4gICAgICAgIC8vICAgICByb3csIFwic3RyaW5nXCIsIGEgTGlzdCBjb250YWluaW5nIHRoZSBzdHJpbmdzIGdpdmVuIGluIHRoZSBWYWx1ZXMgY29sdW1uIG9mXG4gICAgICAgIC8vICAgICB0aGUgcm93LCBhbmQgdW5kZWZpbmVkLlxuICAgICAgICB2YXIgdmFsdWUgPSBHZXRPcHRpb24ob3B0aW9ucywgcHJvcCwgJ3N0cmluZycsIGRhdGVUaW1lQ29tcG9uZW50c1twcm9wXSk7XG5cbiAgICAgICAgLy8gMjIuIFNldCBvcHQuW1s8cHJvcD5dXSB0byB2YWx1ZS5cbiAgICAgICAgb3B0WydbWycgKyBwcm9wICsgJ11dJ10gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvLyBBc3NpZ25lZCBhIHZhbHVlIGJlbG93XG4gICAgdmFyIGJlc3RGb3JtYXQgPSB2b2lkIDA7XG5cbiAgICAvLyAyMy4gTGV0IGRhdGFMb2NhbGVEYXRhIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAvLyAgICAgbG9jYWxlRGF0YSB3aXRoIGFyZ3VtZW50IGRhdGFMb2NhbGUuXG4gICAgdmFyIGRhdGFMb2NhbGVEYXRhID0gbG9jYWxlRGF0YVtkYXRhTG9jYWxlXTtcblxuICAgIC8vIDI0LiBMZXQgZm9ybWF0cyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgLy8gICAgIGRhdGFMb2NhbGVEYXRhIHdpdGggYXJndW1lbnQgXCJmb3JtYXRzXCIuXG4gICAgLy8gICAgIE5vdGU6IHdlIHByb2Nlc3MgdGhlIENMRFIgZm9ybWF0cyBpbnRvIHRoZSBzcGVjJ2Qgc3RydWN0dXJlXG4gICAgdmFyIGZvcm1hdHMgPSBUb0RhdGVUaW1lRm9ybWF0cyhkYXRhTG9jYWxlRGF0YS5mb3JtYXRzKTtcblxuICAgIC8vIDI1LiBMZXQgbWF0Y2hlciBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldE9wdGlvbiBhYnN0cmFjdCBvcGVyYXRpb24gd2l0aFxuICAgIC8vICAgICBhcmd1bWVudHMgb3B0aW9ucywgXCJmb3JtYXRNYXRjaGVyXCIsIFwic3RyaW5nXCIsIGEgTGlzdCBjb250YWluaW5nIHRoZSB0d28gU3RyaW5nXG4gICAgLy8gICAgIHZhbHVlcyBcImJhc2ljXCIgYW5kIFwiYmVzdCBmaXRcIiwgYW5kIFwiYmVzdCBmaXRcIi5cbiAgICBtYXRjaGVyID0gR2V0T3B0aW9uKG9wdGlvbnMsICdmb3JtYXRNYXRjaGVyJywgJ3N0cmluZycsIG5ldyBMaXN0KCdiYXNpYycsICdiZXN0IGZpdCcpLCAnYmVzdCBmaXQnKTtcblxuICAgIC8vIE9wdGltaXphdGlvbjogY2FjaGluZyB0aGUgcHJvY2Vzc2VkIGZvcm1hdHMgYXMgYSBvbmUgdGltZSBvcGVyYXRpb24gYnlcbiAgICAvLyByZXBsYWNpbmcgdGhlIGluaXRpYWwgc3RydWN0dXJlIGZyb20gbG9jYWxlRGF0YVxuICAgIGRhdGFMb2NhbGVEYXRhLmZvcm1hdHMgPSBmb3JtYXRzO1xuXG4gICAgLy8gMjYuIElmIG1hdGNoZXIgaXMgXCJiYXNpY1wiLCB0aGVuXG4gICAgaWYgKG1hdGNoZXIgPT09ICdiYXNpYycpIHtcbiAgICAgICAgLy8gMjcuIExldCBiZXN0Rm9ybWF0IGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgQmFzaWNGb3JtYXRNYXRjaGVyIGFic3RyYWN0XG4gICAgICAgIC8vICAgICBvcGVyYXRpb24gKGRlZmluZWQgYmVsb3cpIHdpdGggb3B0IGFuZCBmb3JtYXRzLlxuICAgICAgICBiZXN0Rm9ybWF0ID0gQmFzaWNGb3JtYXRNYXRjaGVyKG9wdCwgZm9ybWF0cyk7XG5cbiAgICAgICAgLy8gMjguIEVsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIGRpdmVyZ2luZ1xuICAgICAgICAgICAgICAgIHZhciBfaHIgPSBHZXRPcHRpb24ob3B0aW9ucywgJ2hvdXIxMicsICdib29sZWFuJyAvKiwgdW5kZWZpbmVkLCB1bmRlZmluZWQqLyk7XG4gICAgICAgICAgICAgICAgb3B0LmhvdXIxMiA9IF9ociA9PT0gdW5kZWZpbmVkID8gZGF0YUxvY2FsZURhdGEuaG91cjEyIDogX2hyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gMjkuIExldCBiZXN0Rm9ybWF0IGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgQmVzdEZpdEZvcm1hdE1hdGNoZXJcbiAgICAgICAgICAgIC8vICAgICBhYnN0cmFjdCBvcGVyYXRpb24gKGRlZmluZWQgYmVsb3cpIHdpdGggb3B0IGFuZCBmb3JtYXRzLlxuICAgICAgICAgICAgYmVzdEZvcm1hdCA9IEJlc3RGaXRGb3JtYXRNYXRjaGVyKG9wdCwgZm9ybWF0cyk7XG4gICAgICAgIH1cblxuICAgIC8vIDMwLiBGb3IgZWFjaCByb3cgaW4gVGFibGUgMywgZXhjZXB0IHRoZSBoZWFkZXIgcm93LCBkb1xuICAgIGZvciAodmFyIF9wcm9wIGluIGRhdGVUaW1lQ29tcG9uZW50cykge1xuICAgICAgICBpZiAoIWhvcC5jYWxsKGRhdGVUaW1lQ29tcG9uZW50cywgX3Byb3ApKSBjb250aW51ZTtcblxuICAgICAgICAvLyBhLiBMZXQgcHJvcCBiZSB0aGUgbmFtZSBnaXZlbiBpbiB0aGUgUHJvcGVydHkgY29sdW1uIG9mIHRoZSByb3cuXG4gICAgICAgIC8vIGIuIExldCBwRGVzYyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0T3duUHJvcGVydHldXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAgICAgLy8gICAgYmVzdEZvcm1hdCB3aXRoIGFyZ3VtZW50IHByb3AuXG4gICAgICAgIC8vIGMuIElmIHBEZXNjIGlzIG5vdCB1bmRlZmluZWQsIHRoZW5cbiAgICAgICAgaWYgKGhvcC5jYWxsKGJlc3RGb3JtYXQsIF9wcm9wKSkge1xuICAgICAgICAgICAgLy8gaS4gTGV0IHAgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZiBiZXN0Rm9ybWF0XG4gICAgICAgICAgICAvLyAgICB3aXRoIGFyZ3VtZW50IHByb3AuXG4gICAgICAgICAgICB2YXIgcCA9IGJlc3RGb3JtYXRbX3Byb3BdO1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIGRpdmVyZ2luZ1xuICAgICAgICAgICAgICAgIHAgPSBiZXN0Rm9ybWF0Ll8gJiYgaG9wLmNhbGwoYmVzdEZvcm1hdC5fLCBfcHJvcCkgPyBiZXN0Rm9ybWF0Ll9bX3Byb3BdIDogcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWkuIFNldCB0aGUgW1s8cHJvcD5dXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBkYXRlVGltZUZvcm1hdCB0byBwLlxuICAgICAgICAgICAgaW50ZXJuYWxbJ1tbJyArIF9wcm9wICsgJ11dJ10gPSBwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHBhdHRlcm4gPSB2b2lkIDA7IC8vIEFzc2lnbmVkIGEgdmFsdWUgYmVsb3dcblxuICAgIC8vIDMxLiBMZXQgaHIxMiBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldE9wdGlvbiBhYnN0cmFjdCBvcGVyYXRpb24gd2l0aFxuICAgIC8vICAgICBhcmd1bWVudHMgb3B0aW9ucywgXCJob3VyMTJcIiwgXCJib29sZWFuXCIsIHVuZGVmaW5lZCwgYW5kIHVuZGVmaW5lZC5cbiAgICB2YXIgaHIxMiA9IEdldE9wdGlvbihvcHRpb25zLCAnaG91cjEyJywgJ2Jvb2xlYW4nIC8qLCB1bmRlZmluZWQsIHVuZGVmaW5lZCovKTtcblxuICAgIC8vIDMyLiBJZiBkYXRlVGltZUZvcm1hdCBoYXMgYW4gaW50ZXJuYWwgcHJvcGVydHkgW1tob3VyXV0sIHRoZW5cbiAgICBpZiAoaW50ZXJuYWxbJ1tbaG91cl1dJ10pIHtcbiAgICAgICAgLy8gYS4gSWYgaHIxMiBpcyB1bmRlZmluZWQsIHRoZW4gbGV0IGhyMTIgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dXG4gICAgICAgIC8vICAgIGludGVybmFsIG1ldGhvZCBvZiBkYXRhTG9jYWxlRGF0YSB3aXRoIGFyZ3VtZW50IFwiaG91cjEyXCIuXG4gICAgICAgIGhyMTIgPSBocjEyID09PSB1bmRlZmluZWQgPyBkYXRhTG9jYWxlRGF0YS5ob3VyMTIgOiBocjEyO1xuXG4gICAgICAgIC8vIGIuIFNldCB0aGUgW1tob3VyMTJdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBkYXRlVGltZUZvcm1hdCB0byBocjEyLlxuICAgICAgICBpbnRlcm5hbFsnW1tob3VyMTJdXSddID0gaHIxMjtcblxuICAgICAgICAvLyBjLiBJZiBocjEyIGlzIHRydWUsIHRoZW5cbiAgICAgICAgaWYgKGhyMTIgPT09IHRydWUpIHtcbiAgICAgICAgICAgIC8vIGkuIExldCBob3VyTm8wIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAgICAgICAgIC8vICAgIGRhdGFMb2NhbGVEYXRhIHdpdGggYXJndW1lbnQgXCJob3VyTm8wXCIuXG4gICAgICAgICAgICB2YXIgaG91ck5vMCA9IGRhdGFMb2NhbGVEYXRhLmhvdXJObzA7XG5cbiAgICAgICAgICAgIC8vIGlpLiBTZXQgdGhlIFtbaG91ck5vMF1dIGludGVybmFsIHByb3BlcnR5IG9mIGRhdGVUaW1lRm9ybWF0IHRvIGhvdXJObzAuXG4gICAgICAgICAgICBpbnRlcm5hbFsnW1tob3VyTm8wXV0nXSA9IGhvdXJObzA7XG5cbiAgICAgICAgICAgIC8vIGlpaS4gTGV0IHBhdHRlcm4gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZlxuICAgICAgICAgICAgLy8gICAgICBiZXN0Rm9ybWF0IHdpdGggYXJndW1lbnQgXCJwYXR0ZXJuMTJcIi5cbiAgICAgICAgICAgIHBhdHRlcm4gPSBiZXN0Rm9ybWF0LnBhdHRlcm4xMjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGQuIEVsc2VcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgLy8gaS4gTGV0IHBhdHRlcm4gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZlxuICAgICAgICAgICAgLy8gICAgYmVzdEZvcm1hdCB3aXRoIGFyZ3VtZW50IFwicGF0dGVyblwiLlxuICAgICAgICAgICAgcGF0dGVybiA9IGJlc3RGb3JtYXQucGF0dGVybjtcbiAgICB9XG5cbiAgICAvLyAzMy4gRWxzZVxuICAgIGVsc2VcbiAgICAgICAgLy8gYS4gTGV0IHBhdHRlcm4gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZlxuICAgICAgICAvLyAgICBiZXN0Rm9ybWF0IHdpdGggYXJndW1lbnQgXCJwYXR0ZXJuXCIuXG4gICAgICAgIHBhdHRlcm4gPSBiZXN0Rm9ybWF0LnBhdHRlcm47XG5cbiAgICAvLyAzNC4gU2V0IHRoZSBbW3BhdHRlcm5dXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBkYXRlVGltZUZvcm1hdCB0byBwYXR0ZXJuLlxuICAgIGludGVybmFsWydbW3BhdHRlcm5dXSddID0gcGF0dGVybjtcblxuICAgIC8vIDM1LiBTZXQgdGhlIFtbYm91bmRGb3JtYXRdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBkYXRlVGltZUZvcm1hdCB0byB1bmRlZmluZWQuXG4gICAgaW50ZXJuYWxbJ1tbYm91bmRGb3JtYXRdXSddID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gMzYuIFNldCB0aGUgW1tpbml0aWFsaXplZERhdGVUaW1lRm9ybWF0XV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgZGF0ZVRpbWVGb3JtYXQgdG9cbiAgICAvLyAgICAgdHJ1ZS5cbiAgICBpbnRlcm5hbFsnW1tpbml0aWFsaXplZERhdGVUaW1lRm9ybWF0XV0nXSA9IHRydWU7XG5cbiAgICAvLyBJbiBFUzMsIHdlIG5lZWQgdG8gcHJlLWJpbmQgdGhlIGZvcm1hdCgpIGZ1bmN0aW9uXG4gICAgaWYgKGVzMykgZGF0ZVRpbWVGb3JtYXQuZm9ybWF0ID0gR2V0Rm9ybWF0RGF0ZVRpbWUuY2FsbChkYXRlVGltZUZvcm1hdCk7XG5cbiAgICAvLyBSZXN0b3JlIHRoZSBSZWdFeHAgcHJvcGVydGllc1xuICAgIHJlZ2V4cFN0YXRlLmV4cC50ZXN0KHJlZ2V4cFN0YXRlLmlucHV0KTtcblxuICAgIC8vIFJldHVybiB0aGUgbmV3bHkgaW5pdGlhbGlzZWQgb2JqZWN0XG4gICAgcmV0dXJuIGRhdGVUaW1lRm9ybWF0O1xufVxuXG4vKipcbiAqIFNldmVyYWwgRGF0ZVRpbWVGb3JtYXQgYWxnb3JpdGhtcyB1c2UgdmFsdWVzIGZyb20gdGhlIGZvbGxvd2luZyB0YWJsZSwgd2hpY2ggcHJvdmlkZXNcbiAqIHByb3BlcnR5IG5hbWVzIGFuZCBhbGxvd2FibGUgdmFsdWVzIGZvciB0aGUgY29tcG9uZW50cyBvZiBkYXRlIGFuZCB0aW1lIGZvcm1hdHM6XG4gKi9cbnZhciBkYXRlVGltZUNvbXBvbmVudHMgPSB7XG4gICAgd2Vla2RheTogW1wibmFycm93XCIsIFwic2hvcnRcIiwgXCJsb25nXCJdLFxuICAgIGVyYTogW1wibmFycm93XCIsIFwic2hvcnRcIiwgXCJsb25nXCJdLFxuICAgIHllYXI6IFtcIjItZGlnaXRcIiwgXCJudW1lcmljXCJdLFxuICAgIG1vbnRoOiBbXCIyLWRpZ2l0XCIsIFwibnVtZXJpY1wiLCBcIm5hcnJvd1wiLCBcInNob3J0XCIsIFwibG9uZ1wiXSxcbiAgICBkYXk6IFtcIjItZGlnaXRcIiwgXCJudW1lcmljXCJdLFxuICAgIGhvdXI6IFtcIjItZGlnaXRcIiwgXCJudW1lcmljXCJdLFxuICAgIG1pbnV0ZTogW1wiMi1kaWdpdFwiLCBcIm51bWVyaWNcIl0sXG4gICAgc2Vjb25kOiBbXCIyLWRpZ2l0XCIsIFwibnVtZXJpY1wiXSxcbiAgICB0aW1lWm9uZU5hbWU6IFtcInNob3J0XCIsIFwibG9uZ1wiXVxufTtcblxuLyoqXG4gKiBXaGVuIHRoZSBUb0RhdGVUaW1lT3B0aW9ucyBhYnN0cmFjdCBvcGVyYXRpb24gaXMgY2FsbGVkIHdpdGggYXJndW1lbnRzIG9wdGlvbnMsXG4gKiByZXF1aXJlZCwgYW5kIGRlZmF1bHRzLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAqL1xuZnVuY3Rpb24gVG9EYXRlVGltZUZvcm1hdHMoZm9ybWF0cykge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZm9ybWF0cykgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdHM7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVEYXRlVGltZUZvcm1hdHMoZm9ybWF0cyk7XG59XG5cbi8qKlxuICogV2hlbiB0aGUgVG9EYXRlVGltZU9wdGlvbnMgYWJzdHJhY3Qgb3BlcmF0aW9uIGlzIGNhbGxlZCB3aXRoIGFyZ3VtZW50cyBvcHRpb25zLFxuICogcmVxdWlyZWQsIGFuZCBkZWZhdWx0cywgdGhlIGZvbGxvd2luZyBzdGVwcyBhcmUgdGFrZW46XG4gKi9cbmZ1bmN0aW9uIFRvRGF0ZVRpbWVPcHRpb25zKG9wdGlvbnMsIHJlcXVpcmVkLCBkZWZhdWx0cykge1xuICAgIC8vIDEuIElmIG9wdGlvbnMgaXMgdW5kZWZpbmVkLCB0aGVuIGxldCBvcHRpb25zIGJlIG51bGwsIGVsc2UgbGV0IG9wdGlvbnMgYmVcbiAgICAvLyAgICBUb09iamVjdChvcHRpb25zKS5cbiAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSBvcHRpb25zID0gbnVsbDtlbHNlIHtcbiAgICAgICAgLy8gKCMxMikgb3B0aW9ucyBuZWVkcyB0byBiZSBhIFJlY29yZCwgYnV0IGl0IGFsc28gbmVlZHMgdG8gaW5oZXJpdCBwcm9wZXJ0aWVzXG4gICAgICAgIHZhciBvcHQyID0gdG9PYmplY3Qob3B0aW9ucyk7XG4gICAgICAgIG9wdGlvbnMgPSBuZXcgUmVjb3JkKCk7XG5cbiAgICAgICAgZm9yICh2YXIgayBpbiBvcHQyKSB7XG4gICAgICAgICAgICBvcHRpb25zW2tdID0gb3B0MltrXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIDIuIExldCBjcmVhdGUgYmUgdGhlIHN0YW5kYXJkIGJ1aWx0LWluIGZ1bmN0aW9uIG9iamVjdCBkZWZpbmVkIGluIEVTNSwgMTUuMi4zLjUuXG4gICAgdmFyIGNyZWF0ZSA9IG9iakNyZWF0ZTtcblxuICAgIC8vIDMuIExldCBvcHRpb25zIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kIG9mIGNyZWF0ZSB3aXRoXG4gICAgLy8gICAgdW5kZWZpbmVkIGFzIHRoZSB0aGlzIHZhbHVlIGFuZCBhbiBhcmd1bWVudCBsaXN0IGNvbnRhaW5pbmcgdGhlIHNpbmdsZSBpdGVtXG4gICAgLy8gICAgb3B0aW9ucy5cbiAgICBvcHRpb25zID0gY3JlYXRlKG9wdGlvbnMpO1xuXG4gICAgLy8gNC4gTGV0IG5lZWREZWZhdWx0cyBiZSB0cnVlLlxuICAgIHZhciBuZWVkRGVmYXVsdHMgPSB0cnVlO1xuXG4gICAgLy8gNS4gSWYgcmVxdWlyZWQgaXMgXCJkYXRlXCIgb3IgXCJhbnlcIiwgdGhlblxuICAgIGlmIChyZXF1aXJlZCA9PT0gJ2RhdGUnIHx8IHJlcXVpcmVkID09PSAnYW55Jykge1xuICAgICAgICAvLyBhLiBGb3IgZWFjaCBvZiB0aGUgcHJvcGVydHkgbmFtZXMgXCJ3ZWVrZGF5XCIsIFwieWVhclwiLCBcIm1vbnRoXCIsIFwiZGF5XCI6XG4gICAgICAgIC8vIGkuIElmIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2Ygb3B0aW9ucyB3aXRoIHRoZVxuICAgICAgICAvLyAgICBwcm9wZXJ0eSBuYW1lIGlzIG5vdCB1bmRlZmluZWQsIHRoZW4gbGV0IG5lZWREZWZhdWx0cyBiZSBmYWxzZS5cbiAgICAgICAgaWYgKG9wdGlvbnMud2Vla2RheSAhPT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMueWVhciAhPT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMubW9udGggIT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmRheSAhPT0gdW5kZWZpbmVkKSBuZWVkRGVmYXVsdHMgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyA2LiBJZiByZXF1aXJlZCBpcyBcInRpbWVcIiBvciBcImFueVwiLCB0aGVuXG4gICAgaWYgKHJlcXVpcmVkID09PSAndGltZScgfHwgcmVxdWlyZWQgPT09ICdhbnknKSB7XG4gICAgICAgIC8vIGEuIEZvciBlYWNoIG9mIHRoZSBwcm9wZXJ0eSBuYW1lcyBcImhvdXJcIiwgXCJtaW51dGVcIiwgXCJzZWNvbmRcIjpcbiAgICAgICAgLy8gaS4gSWYgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZiBvcHRpb25zIHdpdGggdGhlXG4gICAgICAgIC8vICAgIHByb3BlcnR5IG5hbWUgaXMgbm90IHVuZGVmaW5lZCwgdGhlbiBsZXQgbmVlZERlZmF1bHRzIGJlIGZhbHNlLlxuICAgICAgICBpZiAob3B0aW9ucy5ob3VyICE9PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5taW51dGUgIT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnNlY29uZCAhPT0gdW5kZWZpbmVkKSBuZWVkRGVmYXVsdHMgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyA3LiBJZiBuZWVkRGVmYXVsdHMgaXMgdHJ1ZSBhbmQgZGVmYXVsdHMgaXMgZWl0aGVyIFwiZGF0ZVwiIG9yIFwiYWxsXCIsIHRoZW5cbiAgICBpZiAobmVlZERlZmF1bHRzICYmIChkZWZhdWx0cyA9PT0gJ2RhdGUnIHx8IGRlZmF1bHRzID09PSAnYWxsJykpXG4gICAgICAgIC8vIGEuIEZvciBlYWNoIG9mIHRoZSBwcm9wZXJ0eSBuYW1lcyBcInllYXJcIiwgXCJtb250aFwiLCBcImRheVwiOlxuICAgICAgICAvLyBpLiBDYWxsIHRoZSBbW0RlZmluZU93blByb3BlcnR5XV0gaW50ZXJuYWwgbWV0aG9kIG9mIG9wdGlvbnMgd2l0aCB0aGVcbiAgICAgICAgLy8gICAgcHJvcGVydHkgbmFtZSwgUHJvcGVydHkgRGVzY3JpcHRvciB7W1tWYWx1ZV1dOiBcIm51bWVyaWNcIiwgW1tXcml0YWJsZV1dOlxuICAgICAgICAvLyAgICB0cnVlLCBbW0VudW1lcmFibGVdXTogdHJ1ZSwgW1tDb25maWd1cmFibGVdXTogdHJ1ZX0sIGFuZCBmYWxzZS5cbiAgICAgICAgb3B0aW9ucy55ZWFyID0gb3B0aW9ucy5tb250aCA9IG9wdGlvbnMuZGF5ID0gJ251bWVyaWMnO1xuXG4gICAgLy8gOC4gSWYgbmVlZERlZmF1bHRzIGlzIHRydWUgYW5kIGRlZmF1bHRzIGlzIGVpdGhlciBcInRpbWVcIiBvciBcImFsbFwiLCB0aGVuXG4gICAgaWYgKG5lZWREZWZhdWx0cyAmJiAoZGVmYXVsdHMgPT09ICd0aW1lJyB8fCBkZWZhdWx0cyA9PT0gJ2FsbCcpKVxuICAgICAgICAvLyBhLiBGb3IgZWFjaCBvZiB0aGUgcHJvcGVydHkgbmFtZXMgXCJob3VyXCIsIFwibWludXRlXCIsIFwic2Vjb25kXCI6XG4gICAgICAgIC8vIGkuIENhbGwgdGhlIFtbRGVmaW5lT3duUHJvcGVydHldXSBpbnRlcm5hbCBtZXRob2Qgb2Ygb3B0aW9ucyB3aXRoIHRoZVxuICAgICAgICAvLyAgICBwcm9wZXJ0eSBuYW1lLCBQcm9wZXJ0eSBEZXNjcmlwdG9yIHtbW1ZhbHVlXV06IFwibnVtZXJpY1wiLCBbW1dyaXRhYmxlXV06XG4gICAgICAgIC8vICAgIHRydWUsIFtbRW51bWVyYWJsZV1dOiB0cnVlLCBbW0NvbmZpZ3VyYWJsZV1dOiB0cnVlfSwgYW5kIGZhbHNlLlxuICAgICAgICBvcHRpb25zLmhvdXIgPSBvcHRpb25zLm1pbnV0ZSA9IG9wdGlvbnMuc2Vjb25kID0gJ251bWVyaWMnO1xuXG4gICAgLy8gOS4gUmV0dXJuIG9wdGlvbnMuXG4gICAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbi8qKlxuICogV2hlbiB0aGUgQmFzaWNGb3JtYXRNYXRjaGVyIGFic3RyYWN0IG9wZXJhdGlvbiBpcyBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzIG9wdGlvbnMgYW5kXG4gKiBmb3JtYXRzLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAqL1xuZnVuY3Rpb24gQmFzaWNGb3JtYXRNYXRjaGVyKG9wdGlvbnMsIGZvcm1hdHMpIHtcbiAgICAvLyAxLiBMZXQgcmVtb3ZhbFBlbmFsdHkgYmUgMTIwLlxuICAgIHZhciByZW1vdmFsUGVuYWx0eSA9IDEyMDtcblxuICAgIC8vIDIuIExldCBhZGRpdGlvblBlbmFsdHkgYmUgMjAuXG4gICAgdmFyIGFkZGl0aW9uUGVuYWx0eSA9IDIwO1xuXG4gICAgLy8gMy4gTGV0IGxvbmdMZXNzUGVuYWx0eSBiZSA4LlxuICAgIHZhciBsb25nTGVzc1BlbmFsdHkgPSA4O1xuXG4gICAgLy8gNC4gTGV0IGxvbmdNb3JlUGVuYWx0eSBiZSA2LlxuICAgIHZhciBsb25nTW9yZVBlbmFsdHkgPSA2O1xuXG4gICAgLy8gNS4gTGV0IHNob3J0TGVzc1BlbmFsdHkgYmUgNi5cbiAgICB2YXIgc2hvcnRMZXNzUGVuYWx0eSA9IDY7XG5cbiAgICAvLyA2LiBMZXQgc2hvcnRNb3JlUGVuYWx0eSBiZSAzLlxuICAgIHZhciBzaG9ydE1vcmVQZW5hbHR5ID0gMztcblxuICAgIC8vIDcuIExldCBiZXN0U2NvcmUgYmUgLUluZmluaXR5LlxuICAgIHZhciBiZXN0U2NvcmUgPSAtSW5maW5pdHk7XG5cbiAgICAvLyA4LiBMZXQgYmVzdEZvcm1hdCBiZSB1bmRlZmluZWQuXG4gICAgdmFyIGJlc3RGb3JtYXQgPSB2b2lkIDA7XG5cbiAgICAvLyA5LiBMZXQgaSBiZSAwLlxuICAgIHZhciBpID0gMDtcblxuICAgIC8vIDEwLiBBc3NlcnQ6IGZvcm1hdHMgaXMgYW4gQXJyYXkgb2JqZWN0LlxuXG4gICAgLy8gMTEuIExldCBsZW4gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZiBmb3JtYXRzIHdpdGggYXJndW1lbnQgXCJsZW5ndGhcIi5cbiAgICB2YXIgbGVuID0gZm9ybWF0cy5sZW5ndGg7XG5cbiAgICAvLyAxMi4gUmVwZWF0IHdoaWxlIGkgPCBsZW46XG4gICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgICAgLy8gYS4gTGV0IGZvcm1hdCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mIGZvcm1hdHMgd2l0aCBhcmd1bWVudCBUb1N0cmluZyhpKS5cbiAgICAgICAgdmFyIGZvcm1hdCA9IGZvcm1hdHNbaV07XG5cbiAgICAgICAgLy8gYi4gTGV0IHNjb3JlIGJlIDAuXG4gICAgICAgIHZhciBzY29yZSA9IDA7XG5cbiAgICAgICAgLy8gYy4gRm9yIGVhY2ggcHJvcGVydHkgc2hvd24gaW4gVGFibGUgMzpcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0ZVRpbWVDb21wb25lbnRzKSB7XG4gICAgICAgICAgICBpZiAoIWhvcC5jYWxsKGRhdGVUaW1lQ29tcG9uZW50cywgcHJvcGVydHkpKSBjb250aW51ZTtcblxuICAgICAgICAgICAgLy8gaS4gTGV0IG9wdGlvbnNQcm9wIGJlIG9wdGlvbnMuW1s8cHJvcGVydHk+XV0uXG4gICAgICAgICAgICB2YXIgb3B0aW9uc1Byb3AgPSBvcHRpb25zWydbWycgKyBwcm9wZXJ0eSArICddXSddO1xuXG4gICAgICAgICAgICAvLyBpaS4gTGV0IGZvcm1hdFByb3BEZXNjIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBmb3JtYXRcbiAgICAgICAgICAgIC8vICAgICB3aXRoIGFyZ3VtZW50IHByb3BlcnR5LlxuICAgICAgICAgICAgLy8gaWlpLiBJZiBmb3JtYXRQcm9wRGVzYyBpcyBub3QgdW5kZWZpbmVkLCB0aGVuXG4gICAgICAgICAgICAvLyAgICAgMS4gTGV0IGZvcm1hdFByb3AgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZiBmb3JtYXQgd2l0aCBhcmd1bWVudCBwcm9wZXJ0eS5cbiAgICAgICAgICAgIHZhciBmb3JtYXRQcm9wID0gaG9wLmNhbGwoZm9ybWF0LCBwcm9wZXJ0eSkgPyBmb3JtYXRbcHJvcGVydHldIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAvLyBpdi4gSWYgb3B0aW9uc1Byb3AgaXMgdW5kZWZpbmVkIGFuZCBmb3JtYXRQcm9wIGlzIG5vdCB1bmRlZmluZWQsIHRoZW4gZGVjcmVhc2Ugc2NvcmUgYnlcbiAgICAgICAgICAgIC8vICAgICBhZGRpdGlvblBlbmFsdHkuXG4gICAgICAgICAgICBpZiAob3B0aW9uc1Byb3AgPT09IHVuZGVmaW5lZCAmJiBmb3JtYXRQcm9wICE9PSB1bmRlZmluZWQpIHNjb3JlIC09IGFkZGl0aW9uUGVuYWx0eTtcblxuICAgICAgICAgICAgLy8gdi4gRWxzZSBpZiBvcHRpb25zUHJvcCBpcyBub3QgdW5kZWZpbmVkIGFuZCBmb3JtYXRQcm9wIGlzIHVuZGVmaW5lZCwgdGhlbiBkZWNyZWFzZSBzY29yZSBieVxuICAgICAgICAgICAgLy8gICAgcmVtb3ZhbFBlbmFsdHkuXG4gICAgICAgICAgICBlbHNlIGlmIChvcHRpb25zUHJvcCAhPT0gdW5kZWZpbmVkICYmIGZvcm1hdFByb3AgPT09IHVuZGVmaW5lZCkgc2NvcmUgLT0gcmVtb3ZhbFBlbmFsdHk7XG5cbiAgICAgICAgICAgICAgICAvLyB2aS4gRWxzZVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMS4gTGV0IHZhbHVlcyBiZSB0aGUgYXJyYXkgW1wiMi1kaWdpdFwiLCBcIm51bWVyaWNcIiwgXCJuYXJyb3dcIiwgXCJzaG9ydFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgXCJsb25nXCJdLlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9IFsnMi1kaWdpdCcsICdudW1lcmljJywgJ25hcnJvdycsICdzaG9ydCcsICdsb25nJ107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDIuIExldCBvcHRpb25zUHJvcEluZGV4IGJlIHRoZSBpbmRleCBvZiBvcHRpb25zUHJvcCB3aXRoaW4gdmFsdWVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9wdGlvbnNQcm9wSW5kZXggPSBhcnJJbmRleE9mLmNhbGwodmFsdWVzLCBvcHRpb25zUHJvcCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDMuIExldCBmb3JtYXRQcm9wSW5kZXggYmUgdGhlIGluZGV4IG9mIGZvcm1hdFByb3Agd2l0aGluIHZhbHVlcy5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb3JtYXRQcm9wSW5kZXggPSBhcnJJbmRleE9mLmNhbGwodmFsdWVzLCBmb3JtYXRQcm9wKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gNC4gTGV0IGRlbHRhIGJlIG1heChtaW4oZm9ybWF0UHJvcEluZGV4IC0gb3B0aW9uc1Byb3BJbmRleCwgMiksIC0yKS5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWx0YSA9IE1hdGgubWF4KE1hdGgubWluKGZvcm1hdFByb3BJbmRleCAtIG9wdGlvbnNQcm9wSW5kZXgsIDIpLCAtMik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDUuIElmIGRlbHRhID0gMiwgZGVjcmVhc2Ugc2NvcmUgYnkgbG9uZ01vcmVQZW5hbHR5LlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlbHRhID09PSAyKSBzY29yZSAtPSBsb25nTW9yZVBlbmFsdHk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDYuIEVsc2UgaWYgZGVsdGEgPSAxLCBkZWNyZWFzZSBzY29yZSBieSBzaG9ydE1vcmVQZW5hbHR5LlxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZGVsdGEgPT09IDEpIHNjb3JlIC09IHNob3J0TW9yZVBlbmFsdHk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA3LiBFbHNlIGlmIGRlbHRhID0gLTEsIGRlY3JlYXNlIHNjb3JlIGJ5IHNob3J0TGVzc1BlbmFsdHkuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZGVsdGEgPT09IC0xKSBzY29yZSAtPSBzaG9ydExlc3NQZW5hbHR5O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDguIEVsc2UgaWYgZGVsdGEgPSAtMiwgZGVjcmVhc2Ugc2NvcmUgYnkgbG9uZ0xlc3NQZW5hbHR5LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChkZWx0YSA9PT0gLTIpIHNjb3JlIC09IGxvbmdMZXNzUGVuYWx0eTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZC4gSWYgc2NvcmUgPiBiZXN0U2NvcmUsIHRoZW5cbiAgICAgICAgaWYgKHNjb3JlID4gYmVzdFNjb3JlKSB7XG4gICAgICAgICAgICAvLyBpLiBMZXQgYmVzdFNjb3JlIGJlIHNjb3JlLlxuICAgICAgICAgICAgYmVzdFNjb3JlID0gc2NvcmU7XG5cbiAgICAgICAgICAgIC8vIGlpLiBMZXQgYmVzdEZvcm1hdCBiZSBmb3JtYXQuXG4gICAgICAgICAgICBiZXN0Rm9ybWF0ID0gZm9ybWF0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZS4gSW5jcmVhc2UgaSBieSAxLlxuICAgICAgICBpKys7XG4gICAgfVxuXG4gICAgLy8gMTMuIFJldHVybiBiZXN0Rm9ybWF0LlxuICAgIHJldHVybiBiZXN0Rm9ybWF0O1xufVxuXG4vKipcbiAqIFdoZW4gdGhlIEJlc3RGaXRGb3JtYXRNYXRjaGVyIGFic3RyYWN0IG9wZXJhdGlvbiBpcyBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzIG9wdGlvbnNcbiAqIGFuZCBmb3JtYXRzLCBpdCBwZXJmb3JtcyBpbXBsZW1lbnRhdGlvbiBkZXBlbmRlbnQgc3RlcHMsIHdoaWNoIHNob3VsZCByZXR1cm4gYSBzZXQgb2ZcbiAqIGNvbXBvbmVudCByZXByZXNlbnRhdGlvbnMgdGhhdCBhIHR5cGljYWwgdXNlciBvZiB0aGUgc2VsZWN0ZWQgbG9jYWxlIHdvdWxkIHBlcmNlaXZlIGFzXG4gKiBhdCBsZWFzdCBhcyBnb29kIGFzIHRoZSBvbmUgcmV0dXJuZWQgYnkgQmFzaWNGb3JtYXRNYXRjaGVyLlxuICpcbiAqIFRoaXMgcG9seWZpbGwgZGVmaW5lcyB0aGUgYWxnb3JpdGhtIHRvIGJlIHRoZSBzYW1lIGFzIEJhc2ljRm9ybWF0TWF0Y2hlcixcbiAqIHdpdGggdGhlIGFkZGl0aW9uIG9mIGJvbnVzIHBvaW50cyBhd2FyZGVkIHdoZXJlIHRoZSByZXF1ZXN0ZWQgZm9ybWF0IGlzIG9mXG4gKiB0aGUgc2FtZSBkYXRhIHR5cGUgYXMgdGhlIHBvdGVudGlhbGx5IG1hdGNoaW5nIGZvcm1hdC5cbiAqXG4gKiBUaGlzIGFsZ28gcmVsaWVzIG9uIHRoZSBjb25jZXB0IG9mIGNsb3Nlc3QgZGlzdGFuY2UgbWF0Y2hpbmcgZGVzY3JpYmVkIGhlcmU6XG4gKiBodHRwOi8vdW5pY29kZS5vcmcvcmVwb3J0cy90cjM1L3RyMzUtZGF0ZXMuaHRtbCNNYXRjaGluZ19Ta2VsZXRvbnNcbiAqIFR5cGljYWxseSBhIOKAnGJlc3QgbWF0Y2jigJ0gaXMgZm91bmQgdXNpbmcgYSBjbG9zZXN0IGRpc3RhbmNlIG1hdGNoLCBzdWNoIGFzOlxuICpcbiAqIFN5bWJvbHMgcmVxdWVzdGluZyBhIGJlc3QgY2hvaWNlIGZvciB0aGUgbG9jYWxlIGFyZSByZXBsYWNlZC5cbiAqICAgICAgaiDihpIgb25lIG9mIHtILCBrLCBoLCBLfTsgQyDihpIgb25lIG9mIHthLCBiLCBCfVxuICogLT4gQ292ZXJlZCBieSBjbGRyLmpzIG1hdGNoaW5nIHByb2Nlc3NcbiAqXG4gKiBGb3IgZmllbGRzIHdpdGggc3ltYm9scyByZXByZXNlbnRpbmcgdGhlIHNhbWUgdHlwZSAoeWVhciwgbW9udGgsIGRheSwgZXRjKTpcbiAqICAgICBNb3N0IHN5bWJvbHMgaGF2ZSBhIHNtYWxsIGRpc3RhbmNlIGZyb20gZWFjaCBvdGhlci5cbiAqICAgICAgICAgTSDiiYUgTDsgRSDiiYUgYzsgYSDiiYUgYiDiiYUgQjsgSCDiiYUgayDiiYUgaCDiiYUgSzsgLi4uXG4gKiAgICAgLT4gQ292ZXJlZCBieSBjbGRyLmpzIG1hdGNoaW5nIHByb2Nlc3NcbiAqXG4gKiAgICAgV2lkdGggZGlmZmVyZW5jZXMgYW1vbmcgZmllbGRzLCBvdGhlciB0aGFuIHRob3NlIG1hcmtpbmcgdGV4dCB2cyBudW1lcmljLCBhcmUgZ2l2ZW4gc21hbGwgZGlzdGFuY2UgZnJvbSBlYWNoIG90aGVyLlxuICogICAgICAgICBNTU0g4omFIE1NTU1cbiAqICAgICAgICAgTU0g4omFIE1cbiAqICAgICBOdW1lcmljIGFuZCB0ZXh0IGZpZWxkcyBhcmUgZ2l2ZW4gYSBsYXJnZXIgZGlzdGFuY2UgZnJvbSBlYWNoIG90aGVyLlxuICogICAgICAgICBNTU0g4omIIE1NXG4gKiAgICAgU3ltYm9scyByZXByZXNlbnRpbmcgc3Vic3RhbnRpYWwgZGlmZmVyZW5jZXMgKHdlZWsgb2YgeWVhciB2cyB3ZWVrIG9mIG1vbnRoKSBhcmUgZ2l2ZW4gbXVjaCBsYXJnZXIgYSBkaXN0YW5jZXMgZnJvbSBlYWNoIG90aGVyLlxuICogICAgICAgICBkIOKJiyBEOyAuLi5cbiAqICAgICBNaXNzaW5nIG9yIGV4dHJhIGZpZWxkcyBjYXVzZSBhIG1hdGNoIHRvIGZhaWwuIChCdXQgc2VlIE1pc3NpbmcgU2tlbGV0b24gRmllbGRzKS5cbiAqXG4gKlxuICogRm9yIGV4YW1wbGUsXG4gKlxuICogICAgIHsgbW9udGg6ICdudW1lcmljJywgZGF5OiAnbnVtZXJpYycgfVxuICpcbiAqIHNob3VsZCBtYXRjaFxuICpcbiAqICAgICB7IG1vbnRoOiAnMi1kaWdpdCcsIGRheTogJzItZGlnaXQnIH1cbiAqXG4gKiByYXRoZXIgdGhhblxuICpcbiAqICAgICB7IG1vbnRoOiAnc2hvcnQnLCBkYXk6ICdudW1lcmljJyB9XG4gKlxuICogVGhpcyBtYWtlcyBzZW5zZSBiZWNhdXNlIGEgdXNlciByZXF1ZXN0aW5nIGEgZm9ybWF0dGVkIGRhdGUgd2l0aCBudW1lcmljIHBhcnRzIHdvdWxkXG4gKiBub3QgZXhwZWN0IHRvIHNlZSB0aGUgcmV0dXJuZWQgZm9ybWF0IGNvbnRhaW5pbmcgbmFycm93LCBzaG9ydCBvciBsb25nIHBhcnQgbmFtZXNcbiAqL1xuZnVuY3Rpb24gQmVzdEZpdEZvcm1hdE1hdGNoZXIob3B0aW9ucywgZm9ybWF0cykge1xuXG4gICAgLy8gMS4gTGV0IHJlbW92YWxQZW5hbHR5IGJlIDEyMC5cbiAgICB2YXIgcmVtb3ZhbFBlbmFsdHkgPSAxMjA7XG5cbiAgICAvLyAyLiBMZXQgYWRkaXRpb25QZW5hbHR5IGJlIDIwLlxuICAgIHZhciBhZGRpdGlvblBlbmFsdHkgPSAyMDtcblxuICAgIC8vIDMuIExldCBsb25nTGVzc1BlbmFsdHkgYmUgOC5cbiAgICB2YXIgbG9uZ0xlc3NQZW5hbHR5ID0gODtcblxuICAgIC8vIDQuIExldCBsb25nTW9yZVBlbmFsdHkgYmUgNi5cbiAgICB2YXIgbG9uZ01vcmVQZW5hbHR5ID0gNjtcblxuICAgIC8vIDUuIExldCBzaG9ydExlc3NQZW5hbHR5IGJlIDYuXG4gICAgdmFyIHNob3J0TGVzc1BlbmFsdHkgPSA2O1xuXG4gICAgLy8gNi4gTGV0IHNob3J0TW9yZVBlbmFsdHkgYmUgMy5cbiAgICB2YXIgc2hvcnRNb3JlUGVuYWx0eSA9IDM7XG5cbiAgICB2YXIgaG91cjEyUGVuYWx0eSA9IDE7XG5cbiAgICAvLyA3LiBMZXQgYmVzdFNjb3JlIGJlIC1JbmZpbml0eS5cbiAgICB2YXIgYmVzdFNjb3JlID0gLUluZmluaXR5O1xuXG4gICAgLy8gOC4gTGV0IGJlc3RGb3JtYXQgYmUgdW5kZWZpbmVkLlxuICAgIHZhciBiZXN0Rm9ybWF0ID0gdm9pZCAwO1xuXG4gICAgLy8gOS4gTGV0IGkgYmUgMC5cbiAgICB2YXIgaSA9IDA7XG5cbiAgICAvLyAxMC4gQXNzZXJ0OiBmb3JtYXRzIGlzIGFuIEFycmF5IG9iamVjdC5cblxuICAgIC8vIDExLiBMZXQgbGVuIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2YgZm9ybWF0cyB3aXRoIGFyZ3VtZW50IFwibGVuZ3RoXCIuXG4gICAgdmFyIGxlbiA9IGZvcm1hdHMubGVuZ3RoO1xuXG4gICAgLy8gMTIuIFJlcGVhdCB3aGlsZSBpIDwgbGVuOlxuICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICAgIC8vIGEuIExldCBmb3JtYXQgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZiBmb3JtYXRzIHdpdGggYXJndW1lbnQgVG9TdHJpbmcoaSkuXG4gICAgICAgIHZhciBmb3JtYXQgPSBmb3JtYXRzW2ldO1xuXG4gICAgICAgIC8vIGIuIExldCBzY29yZSBiZSAwLlxuICAgICAgICB2YXIgc2NvcmUgPSAwO1xuXG4gICAgICAgIC8vIGMuIEZvciBlYWNoIHByb3BlcnR5IHNob3duIGluIFRhYmxlIDM6XG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGVUaW1lQ29tcG9uZW50cykge1xuICAgICAgICAgICAgaWYgKCFob3AuY2FsbChkYXRlVGltZUNvbXBvbmVudHMsIHByb3BlcnR5KSkgY29udGludWU7XG5cbiAgICAgICAgICAgIC8vIGkuIExldCBvcHRpb25zUHJvcCBiZSBvcHRpb25zLltbPHByb3BlcnR5Pl1dLlxuICAgICAgICAgICAgdmFyIG9wdGlvbnNQcm9wID0gb3B0aW9uc1snW1snICsgcHJvcGVydHkgKyAnXV0nXTtcblxuICAgICAgICAgICAgLy8gaWkuIExldCBmb3JtYXRQcm9wRGVzYyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0T3duUHJvcGVydHldXSBpbnRlcm5hbCBtZXRob2Qgb2YgZm9ybWF0XG4gICAgICAgICAgICAvLyAgICAgd2l0aCBhcmd1bWVudCBwcm9wZXJ0eS5cbiAgICAgICAgICAgIC8vIGlpaS4gSWYgZm9ybWF0UHJvcERlc2MgaXMgbm90IHVuZGVmaW5lZCwgdGhlblxuICAgICAgICAgICAgLy8gICAgIDEuIExldCBmb3JtYXRQcm9wIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2YgZm9ybWF0IHdpdGggYXJndW1lbnQgcHJvcGVydHkuXG4gICAgICAgICAgICB2YXIgZm9ybWF0UHJvcCA9IGhvcC5jYWxsKGZvcm1hdCwgcHJvcGVydHkpID8gZm9ybWF0W3Byb3BlcnR5XSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgLy8gaXYuIElmIG9wdGlvbnNQcm9wIGlzIHVuZGVmaW5lZCBhbmQgZm9ybWF0UHJvcCBpcyBub3QgdW5kZWZpbmVkLCB0aGVuIGRlY3JlYXNlIHNjb3JlIGJ5XG4gICAgICAgICAgICAvLyAgICAgYWRkaXRpb25QZW5hbHR5LlxuICAgICAgICAgICAgaWYgKG9wdGlvbnNQcm9wID09PSB1bmRlZmluZWQgJiYgZm9ybWF0UHJvcCAhPT0gdW5kZWZpbmVkKSBzY29yZSAtPSBhZGRpdGlvblBlbmFsdHk7XG5cbiAgICAgICAgICAgIC8vIHYuIEVsc2UgaWYgb3B0aW9uc1Byb3AgaXMgbm90IHVuZGVmaW5lZCBhbmQgZm9ybWF0UHJvcCBpcyB1bmRlZmluZWQsIHRoZW4gZGVjcmVhc2Ugc2NvcmUgYnlcbiAgICAgICAgICAgIC8vICAgIHJlbW92YWxQZW5hbHR5LlxuICAgICAgICAgICAgZWxzZSBpZiAob3B0aW9uc1Byb3AgIT09IHVuZGVmaW5lZCAmJiBmb3JtYXRQcm9wID09PSB1bmRlZmluZWQpIHNjb3JlIC09IHJlbW92YWxQZW5hbHR5O1xuXG4gICAgICAgICAgICAgICAgLy8gdmkuIEVsc2VcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDEuIExldCB2YWx1ZXMgYmUgdGhlIGFycmF5IFtcIjItZGlnaXRcIiwgXCJudW1lcmljXCIsIFwibmFycm93XCIsIFwic2hvcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgIFwibG9uZ1wiXS5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZXMgPSBbJzItZGlnaXQnLCAnbnVtZXJpYycsICduYXJyb3cnLCAnc2hvcnQnLCAnbG9uZyddO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAyLiBMZXQgb3B0aW9uc1Byb3BJbmRleCBiZSB0aGUgaW5kZXggb2Ygb3B0aW9uc1Byb3Agd2l0aGluIHZhbHVlcy5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zUHJvcEluZGV4ID0gYXJySW5kZXhPZi5jYWxsKHZhbHVlcywgb3B0aW9uc1Byb3ApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAzLiBMZXQgZm9ybWF0UHJvcEluZGV4IGJlIHRoZSBpbmRleCBvZiBmb3JtYXRQcm9wIHdpdGhpbiB2YWx1ZXMuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm9ybWF0UHJvcEluZGV4ID0gYXJySW5kZXhPZi5jYWxsKHZhbHVlcywgZm9ybWF0UHJvcCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDQuIExldCBkZWx0YSBiZSBtYXgobWluKGZvcm1hdFByb3BJbmRleCAtIG9wdGlvbnNQcm9wSW5kZXgsIDIpLCAtMikuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVsdGEgPSBNYXRoLm1heChNYXRoLm1pbihmb3JtYXRQcm9wSW5kZXggLSBvcHRpb25zUHJvcEluZGV4LCAyKSwgLTIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGl2ZXJnaW5nIGZyb20gc3BlY1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gdGhlIGJlc3RGaXQgYXJndW1lbnQgaXMgdHJ1ZSwgc3VidHJhY3QgYWRkaXRpb25hbCBwZW5hbHR5IHdoZXJlIGRhdGEgdHlwZXMgYXJlIG5vdCB0aGUgc2FtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3JtYXRQcm9wSW5kZXggPD0gMSAmJiBvcHRpb25zUHJvcEluZGV4ID49IDIgfHwgZm9ybWF0UHJvcEluZGV4ID49IDIgJiYgb3B0aW9uc1Byb3BJbmRleCA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDUuIElmIGRlbHRhID0gMiwgZGVjcmVhc2Ugc2NvcmUgYnkgbG9uZ01vcmVQZW5hbHR5LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVsdGEgPiAwKSBzY29yZSAtPSBsb25nTW9yZVBlbmFsdHk7ZWxzZSBpZiAoZGVsdGEgPCAwKSBzY29yZSAtPSBsb25nTGVzc1BlbmFsdHk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gNS4gSWYgZGVsdGEgPSAyLCBkZWNyZWFzZSBzY29yZSBieSBsb25nTW9yZVBlbmFsdHkuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZWx0YSA+IDEpIHNjb3JlIC09IHNob3J0TW9yZVBlbmFsdHk7ZWxzZSBpZiAoZGVsdGEgPCAtMSkgc2NvcmUgLT0gc2hvcnRMZXNzUGVuYWx0eTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIGRpdmVyZ2luZyB0byBhbHNvIHRha2UgaW50byBjb25zaWRlcmF0aW9uIGRpZmZlcmVuY2VzIGJldHdlZW4gMTIgb3IgMjQgaG91cnNcbiAgICAgICAgICAgIC8vIHdoaWNoIGlzIHNwZWNpYWwgZm9yIHRoZSBiZXN0IGZpdCBvbmx5LlxuICAgICAgICAgICAgaWYgKGZvcm1hdC5fLmhvdXIxMiAhPT0gb3B0aW9ucy5ob3VyMTIpIHtcbiAgICAgICAgICAgICAgICBzY29yZSAtPSBob3VyMTJQZW5hbHR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZC4gSWYgc2NvcmUgPiBiZXN0U2NvcmUsIHRoZW5cbiAgICAgICAgaWYgKHNjb3JlID4gYmVzdFNjb3JlKSB7XG4gICAgICAgICAgICAvLyBpLiBMZXQgYmVzdFNjb3JlIGJlIHNjb3JlLlxuICAgICAgICAgICAgYmVzdFNjb3JlID0gc2NvcmU7XG4gICAgICAgICAgICAvLyBpaS4gTGV0IGJlc3RGb3JtYXQgYmUgZm9ybWF0LlxuICAgICAgICAgICAgYmVzdEZvcm1hdCA9IGZvcm1hdDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGUuIEluY3JlYXNlIGkgYnkgMS5cbiAgICAgICAgaSsrO1xuICAgIH1cblxuICAgIC8vIDEzLiBSZXR1cm4gYmVzdEZvcm1hdC5cbiAgICByZXR1cm4gYmVzdEZvcm1hdDtcbn1cblxuLyogMTIuMi4zICovaW50ZXJuYWxzLkRhdGVUaW1lRm9ybWF0ID0ge1xuICAgICdbW2F2YWlsYWJsZUxvY2FsZXNdXSc6IFtdLFxuICAgICdbW3JlbGV2YW50RXh0ZW5zaW9uS2V5c11dJzogWydjYScsICdudSddLFxuICAgICdbW2xvY2FsZURhdGFdXSc6IHt9XG59O1xuXG4vKipcbiAqIFdoZW4gdGhlIHN1cHBvcnRlZExvY2FsZXNPZiBtZXRob2Qgb2YgSW50bC5EYXRlVGltZUZvcm1hdCBpcyBjYWxsZWQsIHRoZVxuICogZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAqL1xuLyogMTIuMi4yICovXG5kZWZpbmVQcm9wZXJ0eShJbnRsLkRhdGVUaW1lRm9ybWF0LCAnc3VwcG9ydGVkTG9jYWxlc09mJywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogZm5CaW5kLmNhbGwoZnVuY3Rpb24gKGxvY2FsZXMpIHtcbiAgICAgICAgLy8gQm91bmQgZnVuY3Rpb25zIG9ubHkgaGF2ZSB0aGUgYHRoaXNgIHZhbHVlIGFsdGVyZWQgaWYgYmVpbmcgdXNlZCBhcyBhIGNvbnN0cnVjdG9yLFxuICAgICAgICAvLyB0aGlzIGxldHMgdXMgaW1pdGF0ZSBhIG5hdGl2ZSBmdW5jdGlvbiB0aGF0IGhhcyBubyBjb25zdHJ1Y3RvclxuICAgICAgICBpZiAoIWhvcC5jYWxsKHRoaXMsICdbW2F2YWlsYWJsZUxvY2FsZXNdXScpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdXBwb3J0ZWRMb2NhbGVzT2YoKSBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuXG4gICAgICAgIC8vIENyZWF0ZSBhbiBvYmplY3Qgd2hvc2UgcHJvcHMgY2FuIGJlIHVzZWQgdG8gcmVzdG9yZSB0aGUgdmFsdWVzIG9mIFJlZ0V4cCBwcm9wc1xuICAgICAgICB2YXIgcmVnZXhwU3RhdGUgPSBjcmVhdGVSZWdFeHBSZXN0b3JlKCksXG5cblxuICAgICAgICAvLyAxLiBJZiBvcHRpb25zIGlzIG5vdCBwcm92aWRlZCwgdGhlbiBsZXQgb3B0aW9ucyBiZSB1bmRlZmluZWQuXG4gICAgICAgIG9wdGlvbnMgPSBhcmd1bWVudHNbMV0sXG5cblxuICAgICAgICAvLyAyLiBMZXQgYXZhaWxhYmxlTG9jYWxlcyBiZSB0aGUgdmFsdWUgb2YgdGhlIFtbYXZhaWxhYmxlTG9jYWxlc11dIGludGVybmFsXG4gICAgICAgIC8vICAgIHByb3BlcnR5IG9mIHRoZSBzdGFuZGFyZCBidWlsdC1pbiBvYmplY3QgdGhhdCBpcyB0aGUgaW5pdGlhbCB2YWx1ZSBvZlxuICAgICAgICAvLyAgICBJbnRsLk51bWJlckZvcm1hdC5cblxuICAgICAgICBhdmFpbGFibGVMb2NhbGVzID0gdGhpc1snW1thdmFpbGFibGVMb2NhbGVzXV0nXSxcblxuXG4gICAgICAgIC8vIDMuIExldCByZXF1ZXN0ZWRMb2NhbGVzIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgQ2Fub25pY2FsaXplTG9jYWxlTGlzdFxuICAgICAgICAvLyAgICBhYnN0cmFjdCBvcGVyYXRpb24gKGRlZmluZWQgaW4gOS4yLjEpIHdpdGggYXJndW1lbnQgbG9jYWxlcy5cbiAgICAgICAgcmVxdWVzdGVkTG9jYWxlcyA9IENhbm9uaWNhbGl6ZUxvY2FsZUxpc3QobG9jYWxlcyk7XG5cbiAgICAgICAgLy8gUmVzdG9yZSB0aGUgUmVnRXhwIHByb3BlcnRpZXNcbiAgICAgICAgcmVnZXhwU3RhdGUuZXhwLnRlc3QocmVnZXhwU3RhdGUuaW5wdXQpO1xuXG4gICAgICAgIC8vIDQuIFJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFN1cHBvcnRlZExvY2FsZXMgYWJzdHJhY3Qgb3BlcmF0aW9uXG4gICAgICAgIC8vICAgIChkZWZpbmVkIGluIDkuMi44KSB3aXRoIGFyZ3VtZW50cyBhdmFpbGFibGVMb2NhbGVzLCByZXF1ZXN0ZWRMb2NhbGVzLFxuICAgICAgICAvLyAgICBhbmQgb3B0aW9ucy5cbiAgICAgICAgcmV0dXJuIFN1cHBvcnRlZExvY2FsZXMoYXZhaWxhYmxlTG9jYWxlcywgcmVxdWVzdGVkTG9jYWxlcywgb3B0aW9ucyk7XG4gICAgfSwgaW50ZXJuYWxzLk51bWJlckZvcm1hdClcbn0pO1xuXG4vKipcbiAqIFRoaXMgbmFtZWQgYWNjZXNzb3IgcHJvcGVydHkgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgZm9ybWF0cyBhIG51bWJlclxuICogYWNjb3JkaW5nIHRvIHRoZSBlZmZlY3RpdmUgbG9jYWxlIGFuZCB0aGUgZm9ybWF0dGluZyBvcHRpb25zIG9mIHRoaXNcbiAqIERhdGVUaW1lRm9ybWF0IG9iamVjdC5cbiAqL1xuLyogMTIuMy4yICovZGVmaW5lUHJvcGVydHkoSW50bC5EYXRlVGltZUZvcm1hdC5wcm90b3R5cGUsICdmb3JtYXQnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogR2V0Rm9ybWF0RGF0ZVRpbWVcbn0pO1xuXG5kZWZpbmVQcm9wZXJ0eShJbnRsLkRhdGVUaW1lRm9ybWF0LnByb3RvdHlwZSwgJ2Zvcm1hdFRvUGFydHMnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogR2V0Rm9ybWF0VG9QYXJ0c0RhdGVUaW1lXG59KTtcblxuZnVuY3Rpb24gR2V0Rm9ybWF0RGF0ZVRpbWUoKSB7XG4gICAgdmFyIGludGVybmFsID0gdGhpcyAhPT0gbnVsbCAmJiBiYWJlbEhlbHBlcnNbXCJ0eXBlb2ZcIl0odGhpcykgPT09ICdvYmplY3QnICYmIGdldEludGVybmFsUHJvcGVydGllcyh0aGlzKTtcblxuICAgIC8vIFNhdGlzZnkgdGVzdCAxMi4zX2JcbiAgICBpZiAoIWludGVybmFsIHx8ICFpbnRlcm5hbFsnW1tpbml0aWFsaXplZERhdGVUaW1lRm9ybWF0XV0nXSkgdGhyb3cgbmV3IFR5cGVFcnJvcignYHRoaXNgIHZhbHVlIGZvciBmb3JtYXQoKSBpcyBub3QgYW4gaW5pdGlhbGl6ZWQgSW50bC5EYXRlVGltZUZvcm1hdCBvYmplY3QuJyk7XG5cbiAgICAvLyBUaGUgdmFsdWUgb2YgdGhlIFtbR2V0XV0gYXR0cmlidXRlIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyB0aGUgZm9sbG93aW5nXG4gICAgLy8gc3RlcHM6XG5cbiAgICAvLyAxLiBJZiB0aGUgW1tib3VuZEZvcm1hdF1dIGludGVybmFsIHByb3BlcnR5IG9mIHRoaXMgRGF0ZVRpbWVGb3JtYXQgb2JqZWN0XG4gICAgLy8gICAgaXMgdW5kZWZpbmVkLCB0aGVuOlxuICAgIGlmIChpbnRlcm5hbFsnW1tib3VuZEZvcm1hdF1dJ10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBhLiBMZXQgRiBiZSBhIEZ1bmN0aW9uIG9iamVjdCwgd2l0aCBpbnRlcm5hbCBwcm9wZXJ0aWVzIHNldCBhc1xuICAgICAgICAvLyAgICBzcGVjaWZpZWQgZm9yIGJ1aWx0LWluIGZ1bmN0aW9ucyBpbiBFUzUsIDE1LCBvciBzdWNjZXNzb3IsIGFuZCB0aGVcbiAgICAgICAgLy8gICAgbGVuZ3RoIHByb3BlcnR5IHNldCB0byAwLCB0aGF0IHRha2VzIHRoZSBhcmd1bWVudCBkYXRlIGFuZFxuICAgICAgICAvLyAgICBwZXJmb3JtcyB0aGUgZm9sbG93aW5nIHN0ZXBzOlxuICAgICAgICB2YXIgRiA9IGZ1bmN0aW9uIEYoKSB7XG4gICAgICAgICAgICAvLyAgIGkuIElmIGRhdGUgaXMgbm90IHByb3ZpZGVkIG9yIGlzIHVuZGVmaW5lZCwgdGhlbiBsZXQgeCBiZSB0aGVcbiAgICAgICAgICAgIC8vICAgICAgcmVzdWx0IGFzIGlmIGJ5IHRoZSBleHByZXNzaW9uIERhdGUubm93KCkgd2hlcmUgRGF0ZS5ub3cgaXNcbiAgICAgICAgICAgIC8vICAgICAgdGhlIHN0YW5kYXJkIGJ1aWx0LWluIGZ1bmN0aW9uIGRlZmluZWQgaW4gRVM1LCAxNS45LjQuNC5cbiAgICAgICAgICAgIC8vICBpaS4gRWxzZSBsZXQgeCBiZSBUb051bWJlcihkYXRlKS5cbiAgICAgICAgICAgIC8vIGlpaS4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgRm9ybWF0RGF0ZVRpbWUgYWJzdHJhY3RcbiAgICAgICAgICAgIC8vICAgICAgb3BlcmF0aW9uIChkZWZpbmVkIGJlbG93KSB3aXRoIGFyZ3VtZW50cyB0aGlzIGFuZCB4LlxuICAgICAgICAgICAgdmFyIHggPSBOdW1iZXIoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCA/IERhdGUubm93KCkgOiBhcmd1bWVudHNbMF0pO1xuICAgICAgICAgICAgcmV0dXJuIEZvcm1hdERhdGVUaW1lKHRoaXMsIHgpO1xuICAgICAgICB9O1xuICAgICAgICAvLyBiLiBMZXQgYmluZCBiZSB0aGUgc3RhbmRhcmQgYnVpbHQtaW4gZnVuY3Rpb24gb2JqZWN0IGRlZmluZWQgaW4gRVM1LFxuICAgICAgICAvLyAgICAxNS4zLjQuNS5cbiAgICAgICAgLy8gYy4gTGV0IGJmIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgICAgIC8vICAgIGJpbmQgd2l0aCBGIGFzIHRoZSB0aGlzIHZhbHVlIGFuZCBhbiBhcmd1bWVudCBsaXN0IGNvbnRhaW5pbmdcbiAgICAgICAgLy8gICAgdGhlIHNpbmdsZSBpdGVtIHRoaXMuXG4gICAgICAgIHZhciBiZiA9IGZuQmluZC5jYWxsKEYsIHRoaXMpO1xuICAgICAgICAvLyBkLiBTZXQgdGhlIFtbYm91bmRGb3JtYXRdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiB0aGlzIE51bWJlckZvcm1hdFxuICAgICAgICAvLyAgICBvYmplY3QgdG8gYmYuXG4gICAgICAgIGludGVybmFsWydbW2JvdW5kRm9ybWF0XV0nXSA9IGJmO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gdGhlIHZhbHVlIG9mIHRoZSBbW2JvdW5kRm9ybWF0XV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgdGhpc1xuICAgIC8vIE51bWJlckZvcm1hdCBvYmplY3QuXG4gICAgcmV0dXJuIGludGVybmFsWydbW2JvdW5kRm9ybWF0XV0nXTtcbn1cblxuZnVuY3Rpb24gR2V0Rm9ybWF0VG9QYXJ0c0RhdGVUaW1lKCkge1xuICAgIHZhciBpbnRlcm5hbCA9IHRoaXMgIT09IG51bGwgJiYgYmFiZWxIZWxwZXJzW1widHlwZW9mXCJdKHRoaXMpID09PSAnb2JqZWN0JyAmJiBnZXRJbnRlcm5hbFByb3BlcnRpZXModGhpcyk7XG5cbiAgICBpZiAoIWludGVybmFsIHx8ICFpbnRlcm5hbFsnW1tpbml0aWFsaXplZERhdGVUaW1lRm9ybWF0XV0nXSkgdGhyb3cgbmV3IFR5cGVFcnJvcignYHRoaXNgIHZhbHVlIGZvciBmb3JtYXRUb1BhcnRzKCkgaXMgbm90IGFuIGluaXRpYWxpemVkIEludGwuRGF0ZVRpbWVGb3JtYXQgb2JqZWN0LicpO1xuXG4gICAgaWYgKGludGVybmFsWydbW2JvdW5kRm9ybWF0VG9QYXJ0c11dJ10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgRiA9IGZ1bmN0aW9uIEYoKSB7XG4gICAgICAgICAgICB2YXIgeCA9IE51bWJlcihhcmd1bWVudHMubGVuZ3RoID09PSAwID8gRGF0ZS5ub3coKSA6IGFyZ3VtZW50c1swXSk7XG4gICAgICAgICAgICByZXR1cm4gRm9ybWF0VG9QYXJ0c0RhdGVUaW1lKHRoaXMsIHgpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgYmYgPSBmbkJpbmQuY2FsbChGLCB0aGlzKTtcbiAgICAgICAgaW50ZXJuYWxbJ1tbYm91bmRGb3JtYXRUb1BhcnRzXV0nXSA9IGJmO1xuICAgIH1cbiAgICByZXR1cm4gaW50ZXJuYWxbJ1tbYm91bmRGb3JtYXRUb1BhcnRzXV0nXTtcbn1cblxuZnVuY3Rpb24gQ3JlYXRlRGF0ZVRpbWVQYXJ0cyhkYXRlVGltZUZvcm1hdCwgeCkge1xuICAgIC8vIDEuIElmIHggaXMgbm90IGEgZmluaXRlIE51bWJlciwgdGhlbiB0aHJvdyBhIFJhbmdlRXJyb3IgZXhjZXB0aW9uLlxuICAgIGlmICghaXNGaW5pdGUoeCkpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHZhbGlkIGRhdGUgcGFzc2VkIHRvIGZvcm1hdCcpO1xuXG4gICAgdmFyIGludGVybmFsID0gZGF0ZVRpbWVGb3JtYXQuX19nZXRJbnRlcm5hbFByb3BlcnRpZXMoc2VjcmV0KTtcblxuICAgIC8vIENyZWF0aW5nIHJlc3RvcmUgcG9pbnQgZm9yIHByb3BlcnRpZXMgb24gdGhlIFJlZ0V4cCBvYmplY3QuLi4gcGxlYXNlIHdhaXRcbiAgICAvKiBsZXQgcmVnZXhwU3RhdGUgPSAqL2NyZWF0ZVJlZ0V4cFJlc3RvcmUoKTsgLy8gIyMjVE9ETzogcmV2aWV3IHRoaXNcblxuICAgIC8vIDIuIExldCBsb2NhbGUgYmUgdGhlIHZhbHVlIG9mIHRoZSBbW2xvY2FsZV1dIGludGVybmFsIHByb3BlcnR5IG9mIGRhdGVUaW1lRm9ybWF0LlxuICAgIHZhciBsb2NhbGUgPSBpbnRlcm5hbFsnW1tsb2NhbGVdXSddO1xuXG4gICAgLy8gMy4gTGV0IG5mIGJlIHRoZSByZXN1bHQgb2YgY3JlYXRpbmcgYSBuZXcgTnVtYmVyRm9ybWF0IG9iamVjdCBhcyBpZiBieSB0aGVcbiAgICAvLyBleHByZXNzaW9uIG5ldyBJbnRsLk51bWJlckZvcm1hdChbbG9jYWxlXSwge3VzZUdyb3VwaW5nOiBmYWxzZX0pIHdoZXJlXG4gICAgLy8gSW50bC5OdW1iZXJGb3JtYXQgaXMgdGhlIHN0YW5kYXJkIGJ1aWx0LWluIGNvbnN0cnVjdG9yIGRlZmluZWQgaW4gMTEuMS4zLlxuICAgIHZhciBuZiA9IG5ldyBJbnRsLk51bWJlckZvcm1hdChbbG9jYWxlXSwgeyB1c2VHcm91cGluZzogZmFsc2UgfSk7XG5cbiAgICAvLyA0LiBMZXQgbmYyIGJlIHRoZSByZXN1bHQgb2YgY3JlYXRpbmcgYSBuZXcgTnVtYmVyRm9ybWF0IG9iamVjdCBhcyBpZiBieSB0aGVcbiAgICAvLyBleHByZXNzaW9uIG5ldyBJbnRsLk51bWJlckZvcm1hdChbbG9jYWxlXSwge21pbmltdW1JbnRlZ2VyRGlnaXRzOiAyLCB1c2VHcm91cGluZzpcbiAgICAvLyBmYWxzZX0pIHdoZXJlIEludGwuTnVtYmVyRm9ybWF0IGlzIHRoZSBzdGFuZGFyZCBidWlsdC1pbiBjb25zdHJ1Y3RvciBkZWZpbmVkIGluXG4gICAgLy8gMTEuMS4zLlxuICAgIHZhciBuZjIgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQoW2xvY2FsZV0sIHsgbWluaW11bUludGVnZXJEaWdpdHM6IDIsIHVzZUdyb3VwaW5nOiBmYWxzZSB9KTtcblxuICAgIC8vIDUuIExldCB0bSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFRvTG9jYWxUaW1lIGFic3RyYWN0IG9wZXJhdGlvbiAoZGVmaW5lZFxuICAgIC8vIGJlbG93KSB3aXRoIHgsIHRoZSB2YWx1ZSBvZiB0aGUgW1tjYWxlbmRhcl1dIGludGVybmFsIHByb3BlcnR5IG9mIGRhdGVUaW1lRm9ybWF0LFxuICAgIC8vIGFuZCB0aGUgdmFsdWUgb2YgdGhlIFtbdGltZVpvbmVdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBkYXRlVGltZUZvcm1hdC5cbiAgICB2YXIgdG0gPSBUb0xvY2FsVGltZSh4LCBpbnRlcm5hbFsnW1tjYWxlbmRhcl1dJ10sIGludGVybmFsWydbW3RpbWVab25lXV0nXSk7XG5cbiAgICAvLyA2LiBMZXQgcmVzdWx0IGJlIHRoZSB2YWx1ZSBvZiB0aGUgW1twYXR0ZXJuXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgZGF0ZVRpbWVGb3JtYXQuXG4gICAgdmFyIHBhdHRlcm4gPSBpbnRlcm5hbFsnW1twYXR0ZXJuXV0nXTtcblxuICAgIC8vIDcuXG4gICAgdmFyIHJlc3VsdCA9IG5ldyBMaXN0KCk7XG5cbiAgICAvLyA4LlxuICAgIHZhciBpbmRleCA9IDA7XG5cbiAgICAvLyA5LlxuICAgIHZhciBiZWdpbkluZGV4ID0gcGF0dGVybi5pbmRleE9mKCd7Jyk7XG5cbiAgICAvLyAxMC5cbiAgICB2YXIgZW5kSW5kZXggPSAwO1xuXG4gICAgLy8gTmVlZCB0aGUgbG9jYWxlIG1pbnVzIGFueSBleHRlbnNpb25zXG4gICAgdmFyIGRhdGFMb2NhbGUgPSBpbnRlcm5hbFsnW1tkYXRhTG9jYWxlXV0nXTtcblxuICAgIC8vIE5lZWQgdGhlIGNhbGVuZGFyIGRhdGEgZnJvbSBDTERSXG4gICAgdmFyIGxvY2FsZURhdGEgPSBpbnRlcm5hbHMuRGF0ZVRpbWVGb3JtYXRbJ1tbbG9jYWxlRGF0YV1dJ11bZGF0YUxvY2FsZV0uY2FsZW5kYXJzO1xuICAgIHZhciBjYSA9IGludGVybmFsWydbW2NhbGVuZGFyXV0nXTtcblxuICAgIC8vIDExLlxuICAgIHdoaWxlIChiZWdpbkluZGV4ICE9PSAtMSkge1xuICAgICAgICB2YXIgZnYgPSB2b2lkIDA7XG4gICAgICAgIC8vIGEuXG4gICAgICAgIGVuZEluZGV4ID0gcGF0dGVybi5pbmRleE9mKCd9JywgYmVnaW5JbmRleCk7XG4gICAgICAgIC8vIGIuXG4gICAgICAgIGlmIChlbmRJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5jbG9zZWQgcGF0dGVybicpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGMuXG4gICAgICAgIGlmIChiZWdpbkluZGV4ID4gaW5kZXgpIHtcbiAgICAgICAgICAgIGFyclB1c2guY2FsbChyZXN1bHQsIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnbGl0ZXJhbCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHBhdHRlcm4uc3Vic3RyaW5nKGluZGV4LCBiZWdpbkluZGV4KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZC5cbiAgICAgICAgdmFyIHAgPSBwYXR0ZXJuLnN1YnN0cmluZyhiZWdpbkluZGV4ICsgMSwgZW5kSW5kZXgpO1xuICAgICAgICAvLyBlLlxuICAgICAgICBpZiAoZGF0ZVRpbWVDb21wb25lbnRzLmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICAgICAgICAvLyAgIGkuIExldCBmIGJlIHRoZSB2YWx1ZSBvZiB0aGUgW1s8cD5dXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBkYXRlVGltZUZvcm1hdC5cbiAgICAgICAgICAgIHZhciBmID0gaW50ZXJuYWxbJ1tbJyArIHAgKyAnXV0nXTtcbiAgICAgICAgICAgIC8vICBpaS4gTGV0IHYgYmUgdGhlIHZhbHVlIG9mIHRtLltbPHA+XV0uXG4gICAgICAgICAgICB2YXIgdiA9IHRtWydbWycgKyBwICsgJ11dJ107XG4gICAgICAgICAgICAvLyBpaWkuIElmIHAgaXMgXCJ5ZWFyXCIgYW5kIHYg4omkIDAsIHRoZW4gbGV0IHYgYmUgMSAtIHYuXG4gICAgICAgICAgICBpZiAocCA9PT0gJ3llYXInICYmIHYgPD0gMCkge1xuICAgICAgICAgICAgICAgIHYgPSAxIC0gdjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vICBpdi4gSWYgcCBpcyBcIm1vbnRoXCIsIHRoZW4gaW5jcmVhc2UgdiBieSAxLlxuICAgICAgICAgICAgZWxzZSBpZiAocCA9PT0gJ21vbnRoJykge1xuICAgICAgICAgICAgICAgICAgICB2Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vICAgdi4gSWYgcCBpcyBcImhvdXJcIiBhbmQgdGhlIHZhbHVlIG9mIHRoZSBbW2hvdXIxMl1dIGludGVybmFsIHByb3BlcnR5IG9mXG4gICAgICAgICAgICAgICAgLy8gICAgICBkYXRlVGltZUZvcm1hdCBpcyB0cnVlLCB0aGVuXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocCA9PT0gJ2hvdXInICYmIGludGVybmFsWydbW2hvdXIxMl1dJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDEuIExldCB2IGJlIHYgbW9kdWxvIDEyLlxuICAgICAgICAgICAgICAgICAgICAgICAgdiA9IHYgJSAxMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDIuIElmIHYgaXMgMCBhbmQgdGhlIHZhbHVlIG9mIHRoZSBbW2hvdXJObzBdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgZGF0ZVRpbWVGb3JtYXQgaXMgdHJ1ZSwgdGhlbiBsZXQgdiBiZSAxMi5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ID09PSAwICYmIGludGVybmFsWydbW2hvdXJObzBdXSddID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdiA9IDEyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vICB2aS4gSWYgZiBpcyBcIm51bWVyaWNcIiwgdGhlblxuICAgICAgICAgICAgaWYgKGYgPT09ICdudW1lcmljJykge1xuICAgICAgICAgICAgICAgIC8vIDEuIExldCBmdiBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEZvcm1hdE51bWJlciBhYnN0cmFjdCBvcGVyYXRpb25cbiAgICAgICAgICAgICAgICAvLyAgICAoZGVmaW5lZCBpbiAxMS4zLjIpIHdpdGggYXJndW1lbnRzIG5mIGFuZCB2LlxuICAgICAgICAgICAgICAgIGZ2ID0gRm9ybWF0TnVtYmVyKG5mLCB2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHZpaS4gRWxzZSBpZiBmIGlzIFwiMi1kaWdpdFwiLCB0aGVuXG4gICAgICAgICAgICBlbHNlIGlmIChmID09PSAnMi1kaWdpdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gMS4gTGV0IGZ2IGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgRm9ybWF0TnVtYmVyIGFic3RyYWN0IG9wZXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAvLyAgICB3aXRoIGFyZ3VtZW50cyBuZjIgYW5kIHYuXG4gICAgICAgICAgICAgICAgICAgIGZ2ID0gRm9ybWF0TnVtYmVyKG5mMiwgdik7XG4gICAgICAgICAgICAgICAgICAgIC8vIDIuIElmIHRoZSBsZW5ndGggb2YgZnYgaXMgZ3JlYXRlciB0aGFuIDIsIGxldCBmdiBiZSB0aGUgc3Vic3RyaW5nIG9mIGZ2XG4gICAgICAgICAgICAgICAgICAgIC8vICAgIGNvbnRhaW5pbmcgdGhlIGxhc3QgdHdvIGNoYXJhY3RlcnMuXG4gICAgICAgICAgICAgICAgICAgIGlmIChmdi5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdiA9IGZ2LnNsaWNlKC0yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB2aWlpLiBFbHNlIGlmIGYgaXMgXCJuYXJyb3dcIiwgXCJzaG9ydFwiLCBvciBcImxvbmdcIiwgdGhlbiBsZXQgZnYgYmUgYSBTdHJpbmdcbiAgICAgICAgICAgICAgICAvLyAgICAgdmFsdWUgcmVwcmVzZW50aW5nIGYgaW4gdGhlIGRlc2lyZWQgZm9ybTsgdGhlIFN0cmluZyB2YWx1ZSBkZXBlbmRzIHVwb25cbiAgICAgICAgICAgICAgICAvLyAgICAgdGhlIGltcGxlbWVudGF0aW9uIGFuZCB0aGUgZWZmZWN0aXZlIGxvY2FsZSBhbmQgY2FsZW5kYXIgb2ZcbiAgICAgICAgICAgICAgICAvLyAgICAgZGF0ZVRpbWVGb3JtYXQuIElmIHAgaXMgXCJtb250aFwiLCB0aGVuIHRoZSBTdHJpbmcgdmFsdWUgbWF5IGFsc28gZGVwZW5kXG4gICAgICAgICAgICAgICAgLy8gICAgIG9uIHdoZXRoZXIgZGF0ZVRpbWVGb3JtYXQgaGFzIGEgW1tkYXldXSBpbnRlcm5hbCBwcm9wZXJ0eS4gSWYgcCBpc1xuICAgICAgICAgICAgICAgIC8vICAgICBcInRpbWVab25lTmFtZVwiLCB0aGVuIHRoZSBTdHJpbmcgdmFsdWUgbWF5IGFsc28gZGVwZW5kIG9uIHRoZSB2YWx1ZSBvZlxuICAgICAgICAgICAgICAgIC8vICAgICB0aGUgW1tpbkRTVF1dIGZpZWxkIG9mIHRtLlxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGYgaW4gZGF0ZVdpZHRocykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdiA9IHJlc29sdmVEYXRlU3RyaW5nKGxvY2FsZURhdGEsIGNhLCAnbW9udGhzJywgZiwgdG1bJ1tbJyArIHAgKyAnXV0nXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnd2Vla2RheSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdiA9IHJlc29sdmVEYXRlU3RyaW5nKGxvY2FsZURhdGEsIGNhLCAnZGF5cycsIGYsIHRtWydbWycgKyBwICsgJ11dJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZnYgPSByZXNvbHZlRGF0ZVN0cmluZyhjYS5kYXlzLCBmKVt0bVsnW1snKyBwICsnXV0nXV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGZpbmQgd2Vla2RheSBkYXRhIGZvciBsb2NhbGUgJyArIGxvY2FsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd0aW1lWm9uZU5hbWUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdiA9ICcnOyAvLyAjIyNUT0RPXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZXJhJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ2ID0gcmVzb2x2ZURhdGVTdHJpbmcobG9jYWxlRGF0YSwgY2EsICdlcmFzJywgZiwgdG1bJ1tbJyArIHAgKyAnXV0nXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGZpbmQgZXJhIGRhdGEgZm9yIGxvY2FsZSAnICsgbG9jYWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ2ID0gdG1bJ1tbJyArIHAgKyAnXV0nXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaXhcbiAgICAgICAgICAgIGFyclB1c2guY2FsbChyZXN1bHQsIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBwLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBmdlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBmLlxuICAgICAgICB9IGVsc2UgaWYgKHAgPT09ICdhbXBtJykge1xuICAgICAgICAgICAgICAgIC8vIGkuXG4gICAgICAgICAgICAgICAgdmFyIF92ID0gdG1bJ1tbaG91cl1dJ107XG4gICAgICAgICAgICAgICAgLy8gaWkuL2lpaS5cbiAgICAgICAgICAgICAgICBmdiA9IHJlc29sdmVEYXRlU3RyaW5nKGxvY2FsZURhdGEsIGNhLCAnZGF5UGVyaW9kcycsIF92ID4gMTEgPyAncG0nIDogJ2FtJywgbnVsbCk7XG4gICAgICAgICAgICAgICAgLy8gaXYuXG4gICAgICAgICAgICAgICAgYXJyUHVzaC5jYWxsKHJlc3VsdCwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGF5UGVyaW9kJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZ2XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gZy5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFyclB1c2guY2FsbChyZXN1bHQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdsaXRlcmFsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBwYXR0ZXJuLnN1YnN0cmluZyhiZWdpbkluZGV4LCBlbmRJbmRleCArIDEpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgLy8gaC5cbiAgICAgICAgaW5kZXggPSBlbmRJbmRleCArIDE7XG4gICAgICAgIC8vIGkuXG4gICAgICAgIGJlZ2luSW5kZXggPSBwYXR0ZXJuLmluZGV4T2YoJ3snLCBpbmRleCk7XG4gICAgfVxuICAgIC8vIDEyLlxuICAgIGlmIChlbmRJbmRleCA8IHBhdHRlcm4ubGVuZ3RoIC0gMSkge1xuICAgICAgICBhcnJQdXNoLmNhbGwocmVzdWx0LCB7XG4gICAgICAgICAgICB0eXBlOiAnbGl0ZXJhbCcsXG4gICAgICAgICAgICB2YWx1ZTogcGF0dGVybi5zdWJzdHIoZW5kSW5kZXggKyAxKVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gMTMuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBXaGVuIHRoZSBGb3JtYXREYXRlVGltZSBhYnN0cmFjdCBvcGVyYXRpb24gaXMgY2FsbGVkIHdpdGggYXJndW1lbnRzIGRhdGVUaW1lRm9ybWF0XG4gKiAod2hpY2ggbXVzdCBiZSBhbiBvYmplY3QgaW5pdGlhbGl6ZWQgYXMgYSBEYXRlVGltZUZvcm1hdCkgYW5kIHggKHdoaWNoIG11c3QgYmUgYSBOdW1iZXJcbiAqIHZhbHVlKSwgaXQgcmV0dXJucyBhIFN0cmluZyB2YWx1ZSByZXByZXNlbnRpbmcgeCAoaW50ZXJwcmV0ZWQgYXMgYSB0aW1lIHZhbHVlIGFzXG4gKiBzcGVjaWZpZWQgaW4gRVM1LCAxNS45LjEuMSkgYWNjb3JkaW5nIHRvIHRoZSBlZmZlY3RpdmUgbG9jYWxlIGFuZCB0aGUgZm9ybWF0dGluZ1xuICogb3B0aW9ucyBvZiBkYXRlVGltZUZvcm1hdC5cbiAqL1xuZnVuY3Rpb24gRm9ybWF0RGF0ZVRpbWUoZGF0ZVRpbWVGb3JtYXQsIHgpIHtcbiAgICB2YXIgcGFydHMgPSBDcmVhdGVEYXRlVGltZVBhcnRzKGRhdGVUaW1lRm9ybWF0LCB4KTtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgcGFydHMubGVuZ3RoID4gaTsgaSsrKSB7XG4gICAgICAgIHZhciBwYXJ0ID0gcGFydHNbaV07XG4gICAgICAgIHJlc3VsdCArPSBwYXJ0LnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBGb3JtYXRUb1BhcnRzRGF0ZVRpbWUoZGF0ZVRpbWVGb3JtYXQsIHgpIHtcbiAgICB2YXIgcGFydHMgPSBDcmVhdGVEYXRlVGltZVBhcnRzKGRhdGVUaW1lRm9ybWF0LCB4KTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IHBhcnRzLmxlbmd0aCA+IGk7IGkrKykge1xuICAgICAgICB2YXIgcGFydCA9IHBhcnRzW2ldO1xuICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiBwYXJ0LnR5cGUsXG4gICAgICAgICAgICB2YWx1ZTogcGFydC52YWx1ZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBXaGVuIHRoZSBUb0xvY2FsVGltZSBhYnN0cmFjdCBvcGVyYXRpb24gaXMgY2FsbGVkIHdpdGggYXJndW1lbnRzIGRhdGUsIGNhbGVuZGFyLCBhbmRcbiAqIHRpbWVab25lLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAqL1xuZnVuY3Rpb24gVG9Mb2NhbFRpbWUoZGF0ZSwgY2FsZW5kYXIsIHRpbWVab25lKSB7XG4gICAgLy8gMS4gQXBwbHkgY2FsZW5kcmljYWwgY2FsY3VsYXRpb25zIG9uIGRhdGUgZm9yIHRoZSBnaXZlbiBjYWxlbmRhciBhbmQgdGltZSB6b25lIHRvXG4gICAgLy8gICAgcHJvZHVjZSB3ZWVrZGF5LCBlcmEsIHllYXIsIG1vbnRoLCBkYXksIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCBhbmQgaW5EU1QgdmFsdWVzLlxuICAgIC8vICAgIFRoZSBjYWxjdWxhdGlvbnMgc2hvdWxkIHVzZSBiZXN0IGF2YWlsYWJsZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc3BlY2lmaWVkXG4gICAgLy8gICAgY2FsZW5kYXIgYW5kIHRpbWUgem9uZS4gSWYgdGhlIGNhbGVuZGFyIGlzIFwiZ3JlZ29yeVwiLCB0aGVuIHRoZSBjYWxjdWxhdGlvbnMgbXVzdFxuICAgIC8vICAgIG1hdGNoIHRoZSBhbGdvcml0aG1zIHNwZWNpZmllZCBpbiBFUzUsIDE1LjkuMSwgZXhjZXB0IHRoYXQgY2FsY3VsYXRpb25zIGFyZSBub3RcbiAgICAvLyAgICBib3VuZCBieSB0aGUgcmVzdHJpY3Rpb25zIG9uIHRoZSB1c2Ugb2YgYmVzdCBhdmFpbGFibGUgaW5mb3JtYXRpb24gb24gdGltZSB6b25lc1xuICAgIC8vICAgIGZvciBsb2NhbCB0aW1lIHpvbmUgYWRqdXN0bWVudCBhbmQgZGF5bGlnaHQgc2F2aW5nIHRpbWUgYWRqdXN0bWVudCBpbXBvc2VkIGJ5XG4gICAgLy8gICAgRVM1LCAxNS45LjEuNyBhbmQgMTUuOS4xLjguXG4gICAgLy8gIyMjVE9ETyMjI1xuICAgIHZhciBkID0gbmV3IERhdGUoZGF0ZSksXG4gICAgICAgIG0gPSAnZ2V0JyArICh0aW1lWm9uZSB8fCAnJyk7XG5cbiAgICAvLyAyLiBSZXR1cm4gYSBSZWNvcmQgd2l0aCBmaWVsZHMgW1t3ZWVrZGF5XV0sIFtbZXJhXV0sIFtbeWVhcl1dLCBbW21vbnRoXV0sIFtbZGF5XV0sXG4gICAgLy8gICAgW1tob3VyXV0sIFtbbWludXRlXV0sIFtbc2Vjb25kXV0sIGFuZCBbW2luRFNUXV0sIGVhY2ggd2l0aCB0aGUgY29ycmVzcG9uZGluZ1xuICAgIC8vICAgIGNhbGN1bGF0ZWQgdmFsdWUuXG4gICAgcmV0dXJuIG5ldyBSZWNvcmQoe1xuICAgICAgICAnW1t3ZWVrZGF5XV0nOiBkW20gKyAnRGF5J10oKSxcbiAgICAgICAgJ1tbZXJhXV0nOiArKGRbbSArICdGdWxsWWVhciddKCkgPj0gMCksXG4gICAgICAgICdbW3llYXJdXSc6IGRbbSArICdGdWxsWWVhciddKCksXG4gICAgICAgICdbW21vbnRoXV0nOiBkW20gKyAnTW9udGgnXSgpLFxuICAgICAgICAnW1tkYXldXSc6IGRbbSArICdEYXRlJ10oKSxcbiAgICAgICAgJ1tbaG91cl1dJzogZFttICsgJ0hvdXJzJ10oKSxcbiAgICAgICAgJ1tbbWludXRlXV0nOiBkW20gKyAnTWludXRlcyddKCksXG4gICAgICAgICdbW3NlY29uZF1dJzogZFttICsgJ1NlY29uZHMnXSgpLFxuICAgICAgICAnW1tpbkRTVF1dJzogZmFsc2UgfSk7XG59XG5cbi8qKlxuICogVGhlIGZ1bmN0aW9uIHJldHVybnMgYSBuZXcgb2JqZWN0IHdob3NlIHByb3BlcnRpZXMgYW5kIGF0dHJpYnV0ZXMgYXJlIHNldCBhcyBpZlxuICogY29uc3RydWN0ZWQgYnkgYW4gb2JqZWN0IGxpdGVyYWwgYXNzaWduaW5nIHRvIGVhY2ggb2YgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzIHRoZVxuICogdmFsdWUgb2YgdGhlIGNvcnJlc3BvbmRpbmcgaW50ZXJuYWwgcHJvcGVydHkgb2YgdGhpcyBEYXRlVGltZUZvcm1hdCBvYmplY3QgKHNlZSAxMi40KTpcbiAqIGxvY2FsZSwgY2FsZW5kYXIsIG51bWJlcmluZ1N5c3RlbSwgdGltZVpvbmUsIGhvdXIxMiwgd2Vla2RheSwgZXJhLCB5ZWFyLCBtb250aCwgZGF5LFxuICogaG91ciwgbWludXRlLCBzZWNvbmQsIGFuZCB0aW1lWm9uZU5hbWUuIFByb3BlcnRpZXMgd2hvc2UgY29ycmVzcG9uZGluZyBpbnRlcm5hbFxuICogcHJvcGVydGllcyBhcmUgbm90IHByZXNlbnQgYXJlIG5vdCBhc3NpZ25lZC5cbiAqL1xuLyogMTIuMy4zICovIC8vICMjI1RPRE8jIyNcbmRlZmluZVByb3BlcnR5KEludGwuRGF0ZVRpbWVGb3JtYXQucHJvdG90eXBlLCAncmVzb2x2ZWRPcHRpb25zJywge1xuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG4gICAgICAgIHZhciBwcm9wID0gdm9pZCAwLFxuICAgICAgICAgICAgZGVzY3MgPSBuZXcgUmVjb3JkKCksXG4gICAgICAgICAgICBwcm9wcyA9IFsnbG9jYWxlJywgJ2NhbGVuZGFyJywgJ251bWJlcmluZ1N5c3RlbScsICd0aW1lWm9uZScsICdob3VyMTInLCAnd2Vla2RheScsICdlcmEnLCAneWVhcicsICdtb250aCcsICdkYXknLCAnaG91cicsICdtaW51dGUnLCAnc2Vjb25kJywgJ3RpbWVab25lTmFtZSddLFxuICAgICAgICAgICAgaW50ZXJuYWwgPSB0aGlzICE9PSBudWxsICYmIGJhYmVsSGVscGVyc1tcInR5cGVvZlwiXSh0aGlzKSA9PT0gJ29iamVjdCcgJiYgZ2V0SW50ZXJuYWxQcm9wZXJ0aWVzKHRoaXMpO1xuXG4gICAgICAgIC8vIFNhdGlzZnkgdGVzdCAxMi4zX2JcbiAgICAgICAgaWYgKCFpbnRlcm5hbCB8fCAhaW50ZXJuYWxbJ1tbaW5pdGlhbGl6ZWREYXRlVGltZUZvcm1hdF1dJ10pIHRocm93IG5ldyBUeXBlRXJyb3IoJ2B0aGlzYCB2YWx1ZSBmb3IgcmVzb2x2ZWRPcHRpb25zKCkgaXMgbm90IGFuIGluaXRpYWxpemVkIEludGwuRGF0ZVRpbWVGb3JtYXQgb2JqZWN0LicpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBtYXggPSBwcm9wcy5sZW5ndGg7IGkgPCBtYXg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGhvcC5jYWxsKGludGVybmFsLCBwcm9wID0gJ1tbJyArIHByb3BzW2ldICsgJ11dJykpIGRlc2NzW3Byb3BzW2ldXSA9IHsgdmFsdWU6IGludGVybmFsW3Byb3BdLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCBlbnVtZXJhYmxlOiB0cnVlIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2JqQ3JlYXRlKHt9LCBkZXNjcyk7XG4gICAgfVxufSk7XG5cbnZhciBscyA9IEludGwuX19sb2NhbGVTZW5zaXRpdmVQcm90b3MgPSB7XG4gICAgTnVtYmVyOiB7fSxcbiAgICBEYXRlOiB7fVxufTtcblxuLyoqXG4gKiBXaGVuIHRoZSB0b0xvY2FsZVN0cmluZyBtZXRob2QgaXMgY2FsbGVkIHdpdGggb3B0aW9uYWwgYXJndW1lbnRzIGxvY2FsZXMgYW5kIG9wdGlvbnMsXG4gKiB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAqL1xuLyogMTMuMi4xICovbHMuTnVtYmVyLnRvTG9jYWxlU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFNhdGlzZnkgdGVzdCAxMy4yLjFfMVxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGhpcykgIT09ICdbb2JqZWN0IE51bWJlcl0nKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdgdGhpc2AgdmFsdWUgbXVzdCBiZSBhIG51bWJlciBmb3IgTnVtYmVyLnByb3RvdHlwZS50b0xvY2FsZVN0cmluZygpJyk7XG5cbiAgICAvLyAxLiBMZXQgeCBiZSB0aGlzIE51bWJlciB2YWx1ZSAoYXMgZGVmaW5lZCBpbiBFUzUsIDE1LjcuNCkuXG4gICAgLy8gMi4gSWYgbG9jYWxlcyBpcyBub3QgcHJvdmlkZWQsIHRoZW4gbGV0IGxvY2FsZXMgYmUgdW5kZWZpbmVkLlxuICAgIC8vIDMuIElmIG9wdGlvbnMgaXMgbm90IHByb3ZpZGVkLCB0aGVuIGxldCBvcHRpb25zIGJlIHVuZGVmaW5lZC5cbiAgICAvLyA0LiBMZXQgbnVtYmVyRm9ybWF0IGJlIHRoZSByZXN1bHQgb2YgY3JlYXRpbmcgYSBuZXcgb2JqZWN0IGFzIGlmIGJ5IHRoZVxuICAgIC8vICAgIGV4cHJlc3Npb24gbmV3IEludGwuTnVtYmVyRm9ybWF0KGxvY2FsZXMsIG9wdGlvbnMpIHdoZXJlXG4gICAgLy8gICAgSW50bC5OdW1iZXJGb3JtYXQgaXMgdGhlIHN0YW5kYXJkIGJ1aWx0LWluIGNvbnN0cnVjdG9yIGRlZmluZWQgaW4gMTEuMS4zLlxuICAgIC8vIDUuIFJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEZvcm1hdE51bWJlciBhYnN0cmFjdCBvcGVyYXRpb25cbiAgICAvLyAgICAoZGVmaW5lZCBpbiAxMS4zLjIpIHdpdGggYXJndW1lbnRzIG51bWJlckZvcm1hdCBhbmQgeC5cbiAgICByZXR1cm4gRm9ybWF0TnVtYmVyKG5ldyBOdW1iZXJGb3JtYXRDb25zdHJ1Y3Rvcihhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSksIHRoaXMpO1xufTtcblxuLyoqXG4gKiBXaGVuIHRoZSB0b0xvY2FsZVN0cmluZyBtZXRob2QgaXMgY2FsbGVkIHdpdGggb3B0aW9uYWwgYXJndW1lbnRzIGxvY2FsZXMgYW5kIG9wdGlvbnMsXG4gKiB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAqL1xuLyogMTMuMy4xICovbHMuRGF0ZS50b0xvY2FsZVN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBTYXRpc2Z5IHRlc3QgMTMuMy4wXzFcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRoaXMpICE9PSAnW29iamVjdCBEYXRlXScpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2B0aGlzYCB2YWx1ZSBtdXN0IGJlIGEgRGF0ZSBpbnN0YW5jZSBmb3IgRGF0ZS5wcm90b3R5cGUudG9Mb2NhbGVTdHJpbmcoKScpO1xuXG4gICAgLy8gMS4gTGV0IHggYmUgdGhpcyB0aW1lIHZhbHVlIChhcyBkZWZpbmVkIGluIEVTNSwgMTUuOS41KS5cbiAgICB2YXIgeCA9ICt0aGlzO1xuXG4gICAgLy8gMi4gSWYgeCBpcyBOYU4sIHRoZW4gcmV0dXJuIFwiSW52YWxpZCBEYXRlXCIuXG4gICAgaWYgKGlzTmFOKHgpKSByZXR1cm4gJ0ludmFsaWQgRGF0ZSc7XG5cbiAgICAvLyAzLiBJZiBsb2NhbGVzIGlzIG5vdCBwcm92aWRlZCwgdGhlbiBsZXQgbG9jYWxlcyBiZSB1bmRlZmluZWQuXG4gICAgdmFyIGxvY2FsZXMgPSBhcmd1bWVudHNbMF07XG5cbiAgICAvLyA0LiBJZiBvcHRpb25zIGlzIG5vdCBwcm92aWRlZCwgdGhlbiBsZXQgb3B0aW9ucyBiZSB1bmRlZmluZWQuXG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHNbMV07XG5cbiAgICAvLyA1LiBMZXQgb3B0aW9ucyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFRvRGF0ZVRpbWVPcHRpb25zIGFic3RyYWN0XG4gICAgLy8gICAgb3BlcmF0aW9uIChkZWZpbmVkIGluIDEyLjEuMSkgd2l0aCBhcmd1bWVudHMgb3B0aW9ucywgXCJhbnlcIiwgYW5kIFwiYWxsXCIuXG4gICAgb3B0aW9ucyA9IFRvRGF0ZVRpbWVPcHRpb25zKG9wdGlvbnMsICdhbnknLCAnYWxsJyk7XG5cbiAgICAvLyA2LiBMZXQgZGF0ZVRpbWVGb3JtYXQgYmUgdGhlIHJlc3VsdCBvZiBjcmVhdGluZyBhIG5ldyBvYmplY3QgYXMgaWYgYnkgdGhlXG4gICAgLy8gICAgZXhwcmVzc2lvbiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGVzLCBvcHRpb25zKSB3aGVyZVxuICAgIC8vICAgIEludGwuRGF0ZVRpbWVGb3JtYXQgaXMgdGhlIHN0YW5kYXJkIGJ1aWx0LWluIGNvbnN0cnVjdG9yIGRlZmluZWQgaW4gMTIuMS4zLlxuICAgIHZhciBkYXRlVGltZUZvcm1hdCA9IG5ldyBEYXRlVGltZUZvcm1hdENvbnN0cnVjdG9yKGxvY2FsZXMsIG9wdGlvbnMpO1xuXG4gICAgLy8gNy4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgRm9ybWF0RGF0ZVRpbWUgYWJzdHJhY3Qgb3BlcmF0aW9uIChkZWZpbmVkXG4gICAgLy8gICAgaW4gMTIuMy4yKSB3aXRoIGFyZ3VtZW50cyBkYXRlVGltZUZvcm1hdCBhbmQgeC5cbiAgICByZXR1cm4gRm9ybWF0RGF0ZVRpbWUoZGF0ZVRpbWVGb3JtYXQsIHgpO1xufTtcblxuLyoqXG4gKiBXaGVuIHRoZSB0b0xvY2FsZURhdGVTdHJpbmcgbWV0aG9kIGlzIGNhbGxlZCB3aXRoIG9wdGlvbmFsIGFyZ3VtZW50cyBsb2NhbGVzIGFuZFxuICogb3B0aW9ucywgdGhlIGZvbGxvd2luZyBzdGVwcyBhcmUgdGFrZW46XG4gKi9cbi8qIDEzLjMuMiAqL2xzLkRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFNhdGlzZnkgdGVzdCAxMy4zLjBfMVxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGhpcykgIT09ICdbb2JqZWN0IERhdGVdJykgdGhyb3cgbmV3IFR5cGVFcnJvcignYHRoaXNgIHZhbHVlIG11c3QgYmUgYSBEYXRlIGluc3RhbmNlIGZvciBEYXRlLnByb3RvdHlwZS50b0xvY2FsZURhdGVTdHJpbmcoKScpO1xuXG4gICAgLy8gMS4gTGV0IHggYmUgdGhpcyB0aW1lIHZhbHVlIChhcyBkZWZpbmVkIGluIEVTNSwgMTUuOS41KS5cbiAgICB2YXIgeCA9ICt0aGlzO1xuXG4gICAgLy8gMi4gSWYgeCBpcyBOYU4sIHRoZW4gcmV0dXJuIFwiSW52YWxpZCBEYXRlXCIuXG4gICAgaWYgKGlzTmFOKHgpKSByZXR1cm4gJ0ludmFsaWQgRGF0ZSc7XG5cbiAgICAvLyAzLiBJZiBsb2NhbGVzIGlzIG5vdCBwcm92aWRlZCwgdGhlbiBsZXQgbG9jYWxlcyBiZSB1bmRlZmluZWQuXG4gICAgdmFyIGxvY2FsZXMgPSBhcmd1bWVudHNbMF0sXG5cblxuICAgIC8vIDQuIElmIG9wdGlvbnMgaXMgbm90IHByb3ZpZGVkLCB0aGVuIGxldCBvcHRpb25zIGJlIHVuZGVmaW5lZC5cbiAgICBvcHRpb25zID0gYXJndW1lbnRzWzFdO1xuXG4gICAgLy8gNS4gTGV0IG9wdGlvbnMgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBUb0RhdGVUaW1lT3B0aW9ucyBhYnN0cmFjdFxuICAgIC8vICAgIG9wZXJhdGlvbiAoZGVmaW5lZCBpbiAxMi4xLjEpIHdpdGggYXJndW1lbnRzIG9wdGlvbnMsIFwiZGF0ZVwiLCBhbmQgXCJkYXRlXCIuXG4gICAgb3B0aW9ucyA9IFRvRGF0ZVRpbWVPcHRpb25zKG9wdGlvbnMsICdkYXRlJywgJ2RhdGUnKTtcblxuICAgIC8vIDYuIExldCBkYXRlVGltZUZvcm1hdCBiZSB0aGUgcmVzdWx0IG9mIGNyZWF0aW5nIGEgbmV3IG9iamVjdCBhcyBpZiBieSB0aGVcbiAgICAvLyAgICBleHByZXNzaW9uIG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGxvY2FsZXMsIG9wdGlvbnMpIHdoZXJlXG4gICAgLy8gICAgSW50bC5EYXRlVGltZUZvcm1hdCBpcyB0aGUgc3RhbmRhcmQgYnVpbHQtaW4gY29uc3RydWN0b3IgZGVmaW5lZCBpbiAxMi4xLjMuXG4gICAgdmFyIGRhdGVUaW1lRm9ybWF0ID0gbmV3IERhdGVUaW1lRm9ybWF0Q29uc3RydWN0b3IobG9jYWxlcywgb3B0aW9ucyk7XG5cbiAgICAvLyA3LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBGb3JtYXREYXRlVGltZSBhYnN0cmFjdCBvcGVyYXRpb24gKGRlZmluZWRcbiAgICAvLyAgICBpbiAxMi4zLjIpIHdpdGggYXJndW1lbnRzIGRhdGVUaW1lRm9ybWF0IGFuZCB4LlxuICAgIHJldHVybiBGb3JtYXREYXRlVGltZShkYXRlVGltZUZvcm1hdCwgeCk7XG59O1xuXG4vKipcbiAqIFdoZW4gdGhlIHRvTG9jYWxlVGltZVN0cmluZyBtZXRob2QgaXMgY2FsbGVkIHdpdGggb3B0aW9uYWwgYXJndW1lbnRzIGxvY2FsZXMgYW5kXG4gKiBvcHRpb25zLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAqL1xuLyogMTMuMy4zICovbHMuRGF0ZS50b0xvY2FsZVRpbWVTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gU2F0aXNmeSB0ZXN0IDEzLjMuMF8xXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0aGlzKSAhPT0gJ1tvYmplY3QgRGF0ZV0nKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdgdGhpc2AgdmFsdWUgbXVzdCBiZSBhIERhdGUgaW5zdGFuY2UgZm9yIERhdGUucHJvdG90eXBlLnRvTG9jYWxlVGltZVN0cmluZygpJyk7XG5cbiAgICAvLyAxLiBMZXQgeCBiZSB0aGlzIHRpbWUgdmFsdWUgKGFzIGRlZmluZWQgaW4gRVM1LCAxNS45LjUpLlxuICAgIHZhciB4ID0gK3RoaXM7XG5cbiAgICAvLyAyLiBJZiB4IGlzIE5hTiwgdGhlbiByZXR1cm4gXCJJbnZhbGlkIERhdGVcIi5cbiAgICBpZiAoaXNOYU4oeCkpIHJldHVybiAnSW52YWxpZCBEYXRlJztcblxuICAgIC8vIDMuIElmIGxvY2FsZXMgaXMgbm90IHByb3ZpZGVkLCB0aGVuIGxldCBsb2NhbGVzIGJlIHVuZGVmaW5lZC5cbiAgICB2YXIgbG9jYWxlcyA9IGFyZ3VtZW50c1swXTtcblxuICAgIC8vIDQuIElmIG9wdGlvbnMgaXMgbm90IHByb3ZpZGVkLCB0aGVuIGxldCBvcHRpb25zIGJlIHVuZGVmaW5lZC5cbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50c1sxXTtcblxuICAgIC8vIDUuIExldCBvcHRpb25zIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgVG9EYXRlVGltZU9wdGlvbnMgYWJzdHJhY3RcbiAgICAvLyAgICBvcGVyYXRpb24gKGRlZmluZWQgaW4gMTIuMS4xKSB3aXRoIGFyZ3VtZW50cyBvcHRpb25zLCBcInRpbWVcIiwgYW5kIFwidGltZVwiLlxuICAgIG9wdGlvbnMgPSBUb0RhdGVUaW1lT3B0aW9ucyhvcHRpb25zLCAndGltZScsICd0aW1lJyk7XG5cbiAgICAvLyA2LiBMZXQgZGF0ZVRpbWVGb3JtYXQgYmUgdGhlIHJlc3VsdCBvZiBjcmVhdGluZyBhIG5ldyBvYmplY3QgYXMgaWYgYnkgdGhlXG4gICAgLy8gICAgZXhwcmVzc2lvbiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGVzLCBvcHRpb25zKSB3aGVyZVxuICAgIC8vICAgIEludGwuRGF0ZVRpbWVGb3JtYXQgaXMgdGhlIHN0YW5kYXJkIGJ1aWx0LWluIGNvbnN0cnVjdG9yIGRlZmluZWQgaW4gMTIuMS4zLlxuICAgIHZhciBkYXRlVGltZUZvcm1hdCA9IG5ldyBEYXRlVGltZUZvcm1hdENvbnN0cnVjdG9yKGxvY2FsZXMsIG9wdGlvbnMpO1xuXG4gICAgLy8gNy4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgRm9ybWF0RGF0ZVRpbWUgYWJzdHJhY3Qgb3BlcmF0aW9uIChkZWZpbmVkXG4gICAgLy8gICAgaW4gMTIuMy4yKSB3aXRoIGFyZ3VtZW50cyBkYXRlVGltZUZvcm1hdCBhbmQgeC5cbiAgICByZXR1cm4gRm9ybWF0RGF0ZVRpbWUoZGF0ZVRpbWVGb3JtYXQsIHgpO1xufTtcblxuZGVmaW5lUHJvcGVydHkoSW50bCwgJ19fYXBwbHlMb2NhbGVTZW5zaXRpdmVQcm90b3R5cGVzJywge1xuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG4gICAgICAgIGRlZmluZVByb3BlcnR5KE51bWJlci5wcm90b3R5cGUsICd0b0xvY2FsZVN0cmluZycsIHsgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IGxzLk51bWJlci50b0xvY2FsZVN0cmluZyB9KTtcbiAgICAgICAgLy8gTmVlZCB0aGlzIGhlcmUgZm9yIElFIDgsIHRvIGF2b2lkIHRoZSBfRG9udEVudW1fIGJ1Z1xuICAgICAgICBkZWZpbmVQcm9wZXJ0eShEYXRlLnByb3RvdHlwZSwgJ3RvTG9jYWxlU3RyaW5nJywgeyB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogbHMuRGF0ZS50b0xvY2FsZVN0cmluZyB9KTtcblxuICAgICAgICBmb3IgKHZhciBrIGluIGxzLkRhdGUpIHtcbiAgICAgICAgICAgIGlmIChob3AuY2FsbChscy5EYXRlLCBrKSkgZGVmaW5lUHJvcGVydHkoRGF0ZS5wcm90b3R5cGUsIGssIHsgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IGxzLkRhdGVba10gfSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuLyoqXG4gKiBDYW4ndCByZWFsbHkgc2hpcCBhIHNpbmdsZSBzY3JpcHQgd2l0aCBkYXRhIGZvciBodW5kcmVkcyBvZiBsb2NhbGVzLCBzbyB3ZSBwcm92aWRlXG4gKiB0aGlzIF9fYWRkTG9jYWxlRGF0YSBtZXRob2QgYXMgYSBtZWFucyBmb3IgdGhlIGRldmVsb3BlciB0byBhZGQgdGhlIGRhdGEgb24gYW5cbiAqIGFzLW5lZWRlZCBiYXNpc1xuICovXG5kZWZpbmVQcm9wZXJ0eShJbnRsLCAnX19hZGRMb2NhbGVEYXRhJywge1xuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZShkYXRhKSB7XG4gICAgICAgIGlmICghSXNTdHJ1Y3R1cmFsbHlWYWxpZExhbmd1YWdlVGFnKGRhdGEubG9jYWxlKSkgdGhyb3cgbmV3IEVycm9yKFwiT2JqZWN0IHBhc3NlZCBkb2Vzbid0IGlkZW50aWZ5IGl0c2VsZiB3aXRoIGEgdmFsaWQgbGFuZ3VhZ2UgdGFnXCIpO1xuXG4gICAgICAgIGFkZExvY2FsZURhdGEoZGF0YSwgZGF0YS5sb2NhbGUpO1xuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiBhZGRMb2NhbGVEYXRhKGRhdGEsIHRhZykge1xuICAgIC8vIEJvdGggTnVtYmVyRm9ybWF0IGFuZCBEYXRlVGltZUZvcm1hdCByZXF1aXJlIG51bWJlciBkYXRhLCBzbyB0aHJvdyBpZiBpdCBpc24ndCBwcmVzZW50XG4gICAgaWYgKCFkYXRhLm51bWJlcikgdGhyb3cgbmV3IEVycm9yKFwiT2JqZWN0IHBhc3NlZCBkb2Vzbid0IGNvbnRhaW4gbG9jYWxlIGRhdGEgZm9yIEludGwuTnVtYmVyRm9ybWF0XCIpO1xuXG4gICAgdmFyIGxvY2FsZSA9IHZvaWQgMCxcbiAgICAgICAgbG9jYWxlcyA9IFt0YWddLFxuICAgICAgICBwYXJ0cyA9IHRhZy5zcGxpdCgnLScpO1xuXG4gICAgLy8gQ3JlYXRlIGZhbGxiYWNrcyBmb3IgbG9jYWxlIGRhdGEgd2l0aCBzY3JpcHRzLCBlLmcuIExhdG4sIEhhbnMsIFZhaWksIGV0Y1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPiAyICYmIHBhcnRzWzFdLmxlbmd0aCA9PT0gNCkgYXJyUHVzaC5jYWxsKGxvY2FsZXMsIHBhcnRzWzBdICsgJy0nICsgcGFydHNbMl0pO1xuXG4gICAgd2hpbGUgKGxvY2FsZSA9IGFyclNoaWZ0LmNhbGwobG9jYWxlcykpIHtcbiAgICAgICAgLy8gQWRkIHRvIE51bWJlckZvcm1hdCBpbnRlcm5hbCBwcm9wZXJ0aWVzIGFzIHBlciAxMS4yLjNcbiAgICAgICAgYXJyUHVzaC5jYWxsKGludGVybmFscy5OdW1iZXJGb3JtYXRbJ1tbYXZhaWxhYmxlTG9jYWxlc11dJ10sIGxvY2FsZSk7XG4gICAgICAgIGludGVybmFscy5OdW1iZXJGb3JtYXRbJ1tbbG9jYWxlRGF0YV1dJ11bbG9jYWxlXSA9IGRhdGEubnVtYmVyO1xuXG4gICAgICAgIC8vIC4uLmFuZCBEYXRlVGltZUZvcm1hdCBpbnRlcm5hbCBwcm9wZXJ0aWVzIGFzIHBlciAxMi4yLjNcbiAgICAgICAgaWYgKGRhdGEuZGF0ZSkge1xuICAgICAgICAgICAgZGF0YS5kYXRlLm51ID0gZGF0YS5udW1iZXIubnU7XG4gICAgICAgICAgICBhcnJQdXNoLmNhbGwoaW50ZXJuYWxzLkRhdGVUaW1lRm9ybWF0WydbW2F2YWlsYWJsZUxvY2FsZXNdXSddLCBsb2NhbGUpO1xuICAgICAgICAgICAgaW50ZXJuYWxzLkRhdGVUaW1lRm9ybWF0WydbW2xvY2FsZURhdGFdXSddW2xvY2FsZV0gPSBkYXRhLmRhdGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCBzZXQgb2YgbG9jYWxlIGRhdGEgYWRkZWQsIG1ha2UgaXQgdGhlIGRlZmF1bHRcbiAgICBpZiAoZGVmYXVsdExvY2FsZSA9PT0gdW5kZWZpbmVkKSBzZXREZWZhdWx0TG9jYWxlKHRhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW50bDsiLCJJbnRsUG9seWZpbGwuX19hZGRMb2NhbGVEYXRhKHtsb2NhbGU6XCJlbi1VU1wiLGRhdGU6e2NhOltcImdyZWdvcnlcIixcImJ1ZGRoaXN0XCIsXCJjaGluZXNlXCIsXCJjb3B0aWNcIixcImRhbmdpXCIsXCJldGhpb2FhXCIsXCJldGhpb3BpY1wiLFwiZ2VuZXJpY1wiLFwiaGVicmV3XCIsXCJpbmRpYW5cIixcImlzbGFtaWNcIixcImlzbGFtaWNjXCIsXCJqYXBhbmVzZVwiLFwicGVyc2lhblwiLFwicm9jXCJdLGhvdXJObzA6dHJ1ZSxob3VyMTI6dHJ1ZSxmb3JtYXRzOntzaG9ydDpcInsxfSwgezB9XCIsbWVkaXVtOlwiezF9LCB7MH1cIixmdWxsOlwiezF9ICdhdCcgezB9XCIsbG9uZzpcInsxfSAnYXQnIHswfVwiLGF2YWlsYWJsZUZvcm1hdHM6e1wiZFwiOlwiZFwiLFwiRVwiOlwiY2NjXCIsRWQ6XCJkIEVcIixFaG06XCJFIGg6bW0gYVwiLEVIbTpcIkUgSEg6bW1cIixFaG1zOlwiRSBoOm1tOnNzIGFcIixFSG1zOlwiRSBISDptbTpzc1wiLEd5OlwieSBHXCIsR3lNTU06XCJNTU0geSBHXCIsR3lNTU1kOlwiTU1NIGQsIHkgR1wiLEd5TU1NRWQ6XCJFLCBNTU0gZCwgeSBHXCIsXCJoXCI6XCJoIGFcIixcIkhcIjpcIkhIXCIsaG06XCJoOm1tIGFcIixIbTpcIkhIOm1tXCIsaG1zOlwiaDptbTpzcyBhXCIsSG1zOlwiSEg6bW06c3NcIixobXN2OlwiaDptbTpzcyBhIHZcIixIbXN2OlwiSEg6bW06c3MgdlwiLGhtdjpcImg6bW0gYSB2XCIsSG12OlwiSEg6bW0gdlwiLFwiTVwiOlwiTFwiLE1kOlwiTS9kXCIsTUVkOlwiRSwgTS9kXCIsTU1NOlwiTExMXCIsTU1NZDpcIk1NTSBkXCIsTU1NRWQ6XCJFLCBNTU0gZFwiLE1NTU1kOlwiTU1NTSBkXCIsbXM6XCJtbTpzc1wiLFwieVwiOlwieVwiLHlNOlwiTS95XCIseU1kOlwiTS9kL3lcIix5TUVkOlwiRSwgTS9kL3lcIix5TU1NOlwiTU1NIHlcIix5TU1NZDpcIk1NTSBkLCB5XCIseU1NTUVkOlwiRSwgTU1NIGQsIHlcIix5TU1NTTpcIk1NTU0geVwiLHlRUVE6XCJRUVEgeVwiLHlRUVFROlwiUVFRUSB5XCJ9LGRhdGVGb3JtYXRzOnt5TU1NTUVFRUVkOlwiRUVFRSwgTU1NTSBkLCB5XCIseU1NTU1kOlwiTU1NTSBkLCB5XCIseU1NTWQ6XCJNTU0gZCwgeVwiLHlNZDpcIk0vZC95eVwifSx0aW1lRm9ybWF0czp7aG1tc3N6enp6OlwiaDptbTpzcyBhIHp6enpcIixobXN6OlwiaDptbTpzcyBhIHpcIixobXM6XCJoOm1tOnNzIGFcIixobTpcImg6bW0gYVwifX0sY2FsZW5kYXJzOntidWRkaGlzdDp7bW9udGhzOntuYXJyb3c6W1wiSlwiLFwiRlwiLFwiTVwiLFwiQVwiLFwiTVwiLFwiSlwiLFwiSlwiLFwiQVwiLFwiU1wiLFwiT1wiLFwiTlwiLFwiRFwiXSxzaG9ydDpbXCJKYW5cIixcIkZlYlwiLFwiTWFyXCIsXCJBcHJcIixcIk1heVwiLFwiSnVuXCIsXCJKdWxcIixcIkF1Z1wiLFwiU2VwXCIsXCJPY3RcIixcIk5vdlwiLFwiRGVjXCJdLGxvbmc6W1wiSmFudWFyeVwiLFwiRmVicnVhcnlcIixcIk1hcmNoXCIsXCJBcHJpbFwiLFwiTWF5XCIsXCJKdW5lXCIsXCJKdWx5XCIsXCJBdWd1c3RcIixcIlNlcHRlbWJlclwiLFwiT2N0b2JlclwiLFwiTm92ZW1iZXJcIixcIkRlY2VtYmVyXCJdfSxkYXlzOntuYXJyb3c6W1wiU1wiLFwiTVwiLFwiVFwiLFwiV1wiLFwiVFwiLFwiRlwiLFwiU1wiXSxzaG9ydDpbXCJTdW5cIixcIk1vblwiLFwiVHVlXCIsXCJXZWRcIixcIlRodVwiLFwiRnJpXCIsXCJTYXRcIl0sbG9uZzpbXCJTdW5kYXlcIixcIk1vbmRheVwiLFwiVHVlc2RheVwiLFwiV2VkbmVzZGF5XCIsXCJUaHVyc2RheVwiLFwiRnJpZGF5XCIsXCJTYXR1cmRheVwiXX0sZXJhczp7bmFycm93OltcIkJFXCJdLHNob3J0OltcIkJFXCJdLGxvbmc6W1wiQkVcIl19LGRheVBlcmlvZHM6e2FtOlwiQU1cIixwbTpcIlBNXCJ9fSxjaGluZXNlOnttb250aHM6e25hcnJvdzpbXCIxXCIsXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCIxMFwiLFwiMTFcIixcIjEyXCJdLHNob3J0OltcIk1vMVwiLFwiTW8yXCIsXCJNbzNcIixcIk1vNFwiLFwiTW81XCIsXCJNbzZcIixcIk1vN1wiLFwiTW84XCIsXCJNbzlcIixcIk1vMTBcIixcIk1vMTFcIixcIk1vMTJcIl0sbG9uZzpbXCJNb250aDFcIixcIk1vbnRoMlwiLFwiTW9udGgzXCIsXCJNb250aDRcIixcIk1vbnRoNVwiLFwiTW9udGg2XCIsXCJNb250aDdcIixcIk1vbnRoOFwiLFwiTW9udGg5XCIsXCJNb250aDEwXCIsXCJNb250aDExXCIsXCJNb250aDEyXCJdfSxkYXlzOntuYXJyb3c6W1wiU1wiLFwiTVwiLFwiVFwiLFwiV1wiLFwiVFwiLFwiRlwiLFwiU1wiXSxzaG9ydDpbXCJTdW5cIixcIk1vblwiLFwiVHVlXCIsXCJXZWRcIixcIlRodVwiLFwiRnJpXCIsXCJTYXRcIl0sbG9uZzpbXCJTdW5kYXlcIixcIk1vbmRheVwiLFwiVHVlc2RheVwiLFwiV2VkbmVzZGF5XCIsXCJUaHVyc2RheVwiLFwiRnJpZGF5XCIsXCJTYXR1cmRheVwiXX0sZGF5UGVyaW9kczp7YW06XCJBTVwiLHBtOlwiUE1cIn19LGNvcHRpYzp7bW9udGhzOntuYXJyb3c6W1wiMVwiLFwiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiMTBcIixcIjExXCIsXCIxMlwiLFwiMTNcIl0sc2hvcnQ6W1wiVG91dFwiLFwiQmFiYVwiLFwiSGF0b3JcIixcIktpYWhrXCIsXCJUb2JhXCIsXCJBbXNoaXJcIixcIkJhcmFtaGF0XCIsXCJCYXJhbW91ZGFcIixcIkJhc2hhbnNcIixcIlBhb25hXCIsXCJFcGVwXCIsXCJNZXNyYVwiLFwiTmFzaWVcIl0sbG9uZzpbXCJUb3V0XCIsXCJCYWJhXCIsXCJIYXRvclwiLFwiS2lhaGtcIixcIlRvYmFcIixcIkFtc2hpclwiLFwiQmFyYW1oYXRcIixcIkJhcmFtb3VkYVwiLFwiQmFzaGFuc1wiLFwiUGFvbmFcIixcIkVwZXBcIixcIk1lc3JhXCIsXCJOYXNpZVwiXX0sZGF5czp7bmFycm93OltcIlNcIixcIk1cIixcIlRcIixcIldcIixcIlRcIixcIkZcIixcIlNcIl0sc2hvcnQ6W1wiU3VuXCIsXCJNb25cIixcIlR1ZVwiLFwiV2VkXCIsXCJUaHVcIixcIkZyaVwiLFwiU2F0XCJdLGxvbmc6W1wiU3VuZGF5XCIsXCJNb25kYXlcIixcIlR1ZXNkYXlcIixcIldlZG5lc2RheVwiLFwiVGh1cnNkYXlcIixcIkZyaWRheVwiLFwiU2F0dXJkYXlcIl19LGVyYXM6e25hcnJvdzpbXCJFUkEwXCIsXCJFUkExXCJdLHNob3J0OltcIkVSQTBcIixcIkVSQTFcIl0sbG9uZzpbXCJFUkEwXCIsXCJFUkExXCJdfSxkYXlQZXJpb2RzOnthbTpcIkFNXCIscG06XCJQTVwifX0sZGFuZ2k6e21vbnRoczp7bmFycm93OltcIjFcIixcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIjEwXCIsXCIxMVwiLFwiMTJcIl0sc2hvcnQ6W1wiTW8xXCIsXCJNbzJcIixcIk1vM1wiLFwiTW80XCIsXCJNbzVcIixcIk1vNlwiLFwiTW83XCIsXCJNbzhcIixcIk1vOVwiLFwiTW8xMFwiLFwiTW8xMVwiLFwiTW8xMlwiXSxsb25nOltcIk1vbnRoMVwiLFwiTW9udGgyXCIsXCJNb250aDNcIixcIk1vbnRoNFwiLFwiTW9udGg1XCIsXCJNb250aDZcIixcIk1vbnRoN1wiLFwiTW9udGg4XCIsXCJNb250aDlcIixcIk1vbnRoMTBcIixcIk1vbnRoMTFcIixcIk1vbnRoMTJcIl19LGRheXM6e25hcnJvdzpbXCJTXCIsXCJNXCIsXCJUXCIsXCJXXCIsXCJUXCIsXCJGXCIsXCJTXCJdLHNob3J0OltcIlN1blwiLFwiTW9uXCIsXCJUdWVcIixcIldlZFwiLFwiVGh1XCIsXCJGcmlcIixcIlNhdFwiXSxsb25nOltcIlN1bmRheVwiLFwiTW9uZGF5XCIsXCJUdWVzZGF5XCIsXCJXZWRuZXNkYXlcIixcIlRodXJzZGF5XCIsXCJGcmlkYXlcIixcIlNhdHVyZGF5XCJdfSxkYXlQZXJpb2RzOnthbTpcIkFNXCIscG06XCJQTVwifX0sZXRoaW9waWM6e21vbnRoczp7bmFycm93OltcIjFcIixcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIjEwXCIsXCIxMVwiLFwiMTJcIixcIjEzXCJdLHNob3J0OltcIk1lc2tlcmVtXCIsXCJUZWtlbXRcIixcIkhlZGFyXCIsXCJUYWhzYXNcIixcIlRlclwiLFwiWWVrYXRpdFwiLFwiTWVnYWJpdFwiLFwiTWlhemlhXCIsXCJHZW5ib3RcIixcIlNlbmVcIixcIkhhbWxlXCIsXCJOZWhhc3NlXCIsXCJQYWd1bWVuXCJdLGxvbmc6W1wiTWVza2VyZW1cIixcIlRla2VtdFwiLFwiSGVkYXJcIixcIlRhaHNhc1wiLFwiVGVyXCIsXCJZZWthdGl0XCIsXCJNZWdhYml0XCIsXCJNaWF6aWFcIixcIkdlbmJvdFwiLFwiU2VuZVwiLFwiSGFtbGVcIixcIk5laGFzc2VcIixcIlBhZ3VtZW5cIl19LGRheXM6e25hcnJvdzpbXCJTXCIsXCJNXCIsXCJUXCIsXCJXXCIsXCJUXCIsXCJGXCIsXCJTXCJdLHNob3J0OltcIlN1blwiLFwiTW9uXCIsXCJUdWVcIixcIldlZFwiLFwiVGh1XCIsXCJGcmlcIixcIlNhdFwiXSxsb25nOltcIlN1bmRheVwiLFwiTW9uZGF5XCIsXCJUdWVzZGF5XCIsXCJXZWRuZXNkYXlcIixcIlRodXJzZGF5XCIsXCJGcmlkYXlcIixcIlNhdHVyZGF5XCJdfSxlcmFzOntuYXJyb3c6W1wiRVJBMFwiLFwiRVJBMVwiXSxzaG9ydDpbXCJFUkEwXCIsXCJFUkExXCJdLGxvbmc6W1wiRVJBMFwiLFwiRVJBMVwiXX0sZGF5UGVyaW9kczp7YW06XCJBTVwiLHBtOlwiUE1cIn19LGV0aGlvYWE6e21vbnRoczp7bmFycm93OltcIjFcIixcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIjEwXCIsXCIxMVwiLFwiMTJcIixcIjEzXCJdLHNob3J0OltcIk1lc2tlcmVtXCIsXCJUZWtlbXRcIixcIkhlZGFyXCIsXCJUYWhzYXNcIixcIlRlclwiLFwiWWVrYXRpdFwiLFwiTWVnYWJpdFwiLFwiTWlhemlhXCIsXCJHZW5ib3RcIixcIlNlbmVcIixcIkhhbWxlXCIsXCJOZWhhc3NlXCIsXCJQYWd1bWVuXCJdLGxvbmc6W1wiTWVza2VyZW1cIixcIlRla2VtdFwiLFwiSGVkYXJcIixcIlRhaHNhc1wiLFwiVGVyXCIsXCJZZWthdGl0XCIsXCJNZWdhYml0XCIsXCJNaWF6aWFcIixcIkdlbmJvdFwiLFwiU2VuZVwiLFwiSGFtbGVcIixcIk5laGFzc2VcIixcIlBhZ3VtZW5cIl19LGRheXM6e25hcnJvdzpbXCJTXCIsXCJNXCIsXCJUXCIsXCJXXCIsXCJUXCIsXCJGXCIsXCJTXCJdLHNob3J0OltcIlN1blwiLFwiTW9uXCIsXCJUdWVcIixcIldlZFwiLFwiVGh1XCIsXCJGcmlcIixcIlNhdFwiXSxsb25nOltcIlN1bmRheVwiLFwiTW9uZGF5XCIsXCJUdWVzZGF5XCIsXCJXZWRuZXNkYXlcIixcIlRodXJzZGF5XCIsXCJGcmlkYXlcIixcIlNhdHVyZGF5XCJdfSxlcmFzOntuYXJyb3c6W1wiRVJBMFwiXSxzaG9ydDpbXCJFUkEwXCJdLGxvbmc6W1wiRVJBMFwiXX0sZGF5UGVyaW9kczp7YW06XCJBTVwiLHBtOlwiUE1cIn19LGdlbmVyaWM6e21vbnRoczp7bmFycm93OltcIjFcIixcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIjEwXCIsXCIxMVwiLFwiMTJcIl0sc2hvcnQ6W1wiTTAxXCIsXCJNMDJcIixcIk0wM1wiLFwiTTA0XCIsXCJNMDVcIixcIk0wNlwiLFwiTTA3XCIsXCJNMDhcIixcIk0wOVwiLFwiTTEwXCIsXCJNMTFcIixcIk0xMlwiXSxsb25nOltcIk0wMVwiLFwiTTAyXCIsXCJNMDNcIixcIk0wNFwiLFwiTTA1XCIsXCJNMDZcIixcIk0wN1wiLFwiTTA4XCIsXCJNMDlcIixcIk0xMFwiLFwiTTExXCIsXCJNMTJcIl19LGRheXM6e25hcnJvdzpbXCJTXCIsXCJNXCIsXCJUXCIsXCJXXCIsXCJUXCIsXCJGXCIsXCJTXCJdLHNob3J0OltcIlN1blwiLFwiTW9uXCIsXCJUdWVcIixcIldlZFwiLFwiVGh1XCIsXCJGcmlcIixcIlNhdFwiXSxsb25nOltcIlN1bmRheVwiLFwiTW9uZGF5XCIsXCJUdWVzZGF5XCIsXCJXZWRuZXNkYXlcIixcIlRodXJzZGF5XCIsXCJGcmlkYXlcIixcIlNhdHVyZGF5XCJdfSxlcmFzOntuYXJyb3c6W1wiRVJBMFwiLFwiRVJBMVwiXSxzaG9ydDpbXCJFUkEwXCIsXCJFUkExXCJdLGxvbmc6W1wiRVJBMFwiLFwiRVJBMVwiXX0sZGF5UGVyaW9kczp7YW06XCJBTVwiLHBtOlwiUE1cIn19LGdyZWdvcnk6e21vbnRoczp7bmFycm93OltcIkpcIixcIkZcIixcIk1cIixcIkFcIixcIk1cIixcIkpcIixcIkpcIixcIkFcIixcIlNcIixcIk9cIixcIk5cIixcIkRcIl0sc2hvcnQ6W1wiSmFuXCIsXCJGZWJcIixcIk1hclwiLFwiQXByXCIsXCJNYXlcIixcIkp1blwiLFwiSnVsXCIsXCJBdWdcIixcIlNlcFwiLFwiT2N0XCIsXCJOb3ZcIixcIkRlY1wiXSxsb25nOltcIkphbnVhcnlcIixcIkZlYnJ1YXJ5XCIsXCJNYXJjaFwiLFwiQXByaWxcIixcIk1heVwiLFwiSnVuZVwiLFwiSnVseVwiLFwiQXVndXN0XCIsXCJTZXB0ZW1iZXJcIixcIk9jdG9iZXJcIixcIk5vdmVtYmVyXCIsXCJEZWNlbWJlclwiXX0sZGF5czp7bmFycm93OltcIlNcIixcIk1cIixcIlRcIixcIldcIixcIlRcIixcIkZcIixcIlNcIl0sc2hvcnQ6W1wiU3VuXCIsXCJNb25cIixcIlR1ZVwiLFwiV2VkXCIsXCJUaHVcIixcIkZyaVwiLFwiU2F0XCJdLGxvbmc6W1wiU3VuZGF5XCIsXCJNb25kYXlcIixcIlR1ZXNkYXlcIixcIldlZG5lc2RheVwiLFwiVGh1cnNkYXlcIixcIkZyaWRheVwiLFwiU2F0dXJkYXlcIl19LGVyYXM6e25hcnJvdzpbXCJCXCIsXCJBXCIsXCJCQ0VcIixcIkNFXCJdLHNob3J0OltcIkJDXCIsXCJBRFwiLFwiQkNFXCIsXCJDRVwiXSxsb25nOltcIkJlZm9yZSBDaHJpc3RcIixcIkFubm8gRG9taW5pXCIsXCJCZWZvcmUgQ29tbW9uIEVyYVwiLFwiQ29tbW9uIEVyYVwiXX0sZGF5UGVyaW9kczp7YW06XCJBTVwiLHBtOlwiUE1cIn19LGhlYnJldzp7bW9udGhzOntuYXJyb3c6W1wiMVwiLFwiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiMTBcIixcIjExXCIsXCIxMlwiLFwiMTNcIixcIjdcIl0sc2hvcnQ6W1wiVGlzaHJpXCIsXCJIZXNodmFuXCIsXCJLaXNsZXZcIixcIlRldmV0XCIsXCJTaGV2YXRcIixcIkFkYXIgSVwiLFwiQWRhclwiLFwiTmlzYW5cIixcIkl5YXJcIixcIlNpdmFuXCIsXCJUYW11elwiLFwiQXZcIixcIkVsdWxcIixcIkFkYXIgSUlcIl0sbG9uZzpbXCJUaXNocmlcIixcIkhlc2h2YW5cIixcIktpc2xldlwiLFwiVGV2ZXRcIixcIlNoZXZhdFwiLFwiQWRhciBJXCIsXCJBZGFyXCIsXCJOaXNhblwiLFwiSXlhclwiLFwiU2l2YW5cIixcIlRhbXV6XCIsXCJBdlwiLFwiRWx1bFwiLFwiQWRhciBJSVwiXX0sZGF5czp7bmFycm93OltcIlNcIixcIk1cIixcIlRcIixcIldcIixcIlRcIixcIkZcIixcIlNcIl0sc2hvcnQ6W1wiU3VuXCIsXCJNb25cIixcIlR1ZVwiLFwiV2VkXCIsXCJUaHVcIixcIkZyaVwiLFwiU2F0XCJdLGxvbmc6W1wiU3VuZGF5XCIsXCJNb25kYXlcIixcIlR1ZXNkYXlcIixcIldlZG5lc2RheVwiLFwiVGh1cnNkYXlcIixcIkZyaWRheVwiLFwiU2F0dXJkYXlcIl19LGVyYXM6e25hcnJvdzpbXCJBTVwiXSxzaG9ydDpbXCJBTVwiXSxsb25nOltcIkFNXCJdfSxkYXlQZXJpb2RzOnthbTpcIkFNXCIscG06XCJQTVwifX0saW5kaWFuOnttb250aHM6e25hcnJvdzpbXCIxXCIsXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCIxMFwiLFwiMTFcIixcIjEyXCJdLHNob3J0OltcIkNoYWl0cmFcIixcIlZhaXNha2hhXCIsXCJKeWFpc3RoYVwiLFwiQXNhZGhhXCIsXCJTcmF2YW5hXCIsXCJCaGFkcmFcIixcIkFzdmluYVwiLFwiS2FydGlrYVwiLFwiQWdyYWhheWFuYVwiLFwiUGF1c2FcIixcIk1hZ2hhXCIsXCJQaGFsZ3VuYVwiXSxsb25nOltcIkNoYWl0cmFcIixcIlZhaXNha2hhXCIsXCJKeWFpc3RoYVwiLFwiQXNhZGhhXCIsXCJTcmF2YW5hXCIsXCJCaGFkcmFcIixcIkFzdmluYVwiLFwiS2FydGlrYVwiLFwiQWdyYWhheWFuYVwiLFwiUGF1c2FcIixcIk1hZ2hhXCIsXCJQaGFsZ3VuYVwiXX0sZGF5czp7bmFycm93OltcIlNcIixcIk1cIixcIlRcIixcIldcIixcIlRcIixcIkZcIixcIlNcIl0sc2hvcnQ6W1wiU3VuXCIsXCJNb25cIixcIlR1ZVwiLFwiV2VkXCIsXCJUaHVcIixcIkZyaVwiLFwiU2F0XCJdLGxvbmc6W1wiU3VuZGF5XCIsXCJNb25kYXlcIixcIlR1ZXNkYXlcIixcIldlZG5lc2RheVwiLFwiVGh1cnNkYXlcIixcIkZyaWRheVwiLFwiU2F0dXJkYXlcIl19LGVyYXM6e25hcnJvdzpbXCJTYWthXCJdLHNob3J0OltcIlNha2FcIl0sbG9uZzpbXCJTYWthXCJdfSxkYXlQZXJpb2RzOnthbTpcIkFNXCIscG06XCJQTVwifX0saXNsYW1pYzp7bW9udGhzOntuYXJyb3c6W1wiMVwiLFwiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiMTBcIixcIjExXCIsXCIxMlwiXSxzaG9ydDpbXCJNdWguXCIsXCJTYWYuXCIsXCJSYWIuIElcIixcIlJhYi4gSUlcIixcIkp1bS4gSVwiLFwiSnVtLiBJSVwiLFwiUmFqLlwiLFwiU2hhLlwiLFwiUmFtLlwiLFwiU2hhdy5cIixcIkRodcq7bC1RLlwiLFwiRGh1yrtsLUguXCJdLGxvbmc6W1wiTXVoYXJyYW1cIixcIlNhZmFyXCIsXCJSYWJpyrsgSVwiLFwiUmFiacq7IElJXCIsXCJKdW1hZGEgSVwiLFwiSnVtYWRhIElJXCIsXCJSYWphYlwiLFwiU2hhyrtiYW5cIixcIlJhbWFkYW5cIixcIlNoYXd3YWxcIixcIkRodcq7bC1Racq7ZGFoXCIsXCJEaHXKu2wtSGlqamFoXCJdfSxkYXlzOntuYXJyb3c6W1wiU1wiLFwiTVwiLFwiVFwiLFwiV1wiLFwiVFwiLFwiRlwiLFwiU1wiXSxzaG9ydDpbXCJTdW5cIixcIk1vblwiLFwiVHVlXCIsXCJXZWRcIixcIlRodVwiLFwiRnJpXCIsXCJTYXRcIl0sbG9uZzpbXCJTdW5kYXlcIixcIk1vbmRheVwiLFwiVHVlc2RheVwiLFwiV2VkbmVzZGF5XCIsXCJUaHVyc2RheVwiLFwiRnJpZGF5XCIsXCJTYXR1cmRheVwiXX0sZXJhczp7bmFycm93OltcIkFIXCJdLHNob3J0OltcIkFIXCJdLGxvbmc6W1wiQUhcIl19LGRheVBlcmlvZHM6e2FtOlwiQU1cIixwbTpcIlBNXCJ9fSxpc2xhbWljYzp7bW9udGhzOntuYXJyb3c6W1wiMVwiLFwiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiMTBcIixcIjExXCIsXCIxMlwiXSxzaG9ydDpbXCJNdWguXCIsXCJTYWYuXCIsXCJSYWIuIElcIixcIlJhYi4gSUlcIixcIkp1bS4gSVwiLFwiSnVtLiBJSVwiLFwiUmFqLlwiLFwiU2hhLlwiLFwiUmFtLlwiLFwiU2hhdy5cIixcIkRodcq7bC1RLlwiLFwiRGh1yrtsLUguXCJdLGxvbmc6W1wiTXVoYXJyYW1cIixcIlNhZmFyXCIsXCJSYWJpyrsgSVwiLFwiUmFiacq7IElJXCIsXCJKdW1hZGEgSVwiLFwiSnVtYWRhIElJXCIsXCJSYWphYlwiLFwiU2hhyrtiYW5cIixcIlJhbWFkYW5cIixcIlNoYXd3YWxcIixcIkRodcq7bC1Racq7ZGFoXCIsXCJEaHXKu2wtSGlqamFoXCJdfSxkYXlzOntuYXJyb3c6W1wiU1wiLFwiTVwiLFwiVFwiLFwiV1wiLFwiVFwiLFwiRlwiLFwiU1wiXSxzaG9ydDpbXCJTdW5cIixcIk1vblwiLFwiVHVlXCIsXCJXZWRcIixcIlRodVwiLFwiRnJpXCIsXCJTYXRcIl0sbG9uZzpbXCJTdW5kYXlcIixcIk1vbmRheVwiLFwiVHVlc2RheVwiLFwiV2VkbmVzZGF5XCIsXCJUaHVyc2RheVwiLFwiRnJpZGF5XCIsXCJTYXR1cmRheVwiXX0sZXJhczp7bmFycm93OltcIkFIXCJdLHNob3J0OltcIkFIXCJdLGxvbmc6W1wiQUhcIl19LGRheVBlcmlvZHM6e2FtOlwiQU1cIixwbTpcIlBNXCJ9fSxqYXBhbmVzZTp7bW9udGhzOntuYXJyb3c6W1wiSlwiLFwiRlwiLFwiTVwiLFwiQVwiLFwiTVwiLFwiSlwiLFwiSlwiLFwiQVwiLFwiU1wiLFwiT1wiLFwiTlwiLFwiRFwiXSxzaG9ydDpbXCJKYW5cIixcIkZlYlwiLFwiTWFyXCIsXCJBcHJcIixcIk1heVwiLFwiSnVuXCIsXCJKdWxcIixcIkF1Z1wiLFwiU2VwXCIsXCJPY3RcIixcIk5vdlwiLFwiRGVjXCJdLGxvbmc6W1wiSmFudWFyeVwiLFwiRmVicnVhcnlcIixcIk1hcmNoXCIsXCJBcHJpbFwiLFwiTWF5XCIsXCJKdW5lXCIsXCJKdWx5XCIsXCJBdWd1c3RcIixcIlNlcHRlbWJlclwiLFwiT2N0b2JlclwiLFwiTm92ZW1iZXJcIixcIkRlY2VtYmVyXCJdfSxkYXlzOntuYXJyb3c6W1wiU1wiLFwiTVwiLFwiVFwiLFwiV1wiLFwiVFwiLFwiRlwiLFwiU1wiXSxzaG9ydDpbXCJTdW5cIixcIk1vblwiLFwiVHVlXCIsXCJXZWRcIixcIlRodVwiLFwiRnJpXCIsXCJTYXRcIl0sbG9uZzpbXCJTdW5kYXlcIixcIk1vbmRheVwiLFwiVHVlc2RheVwiLFwiV2VkbmVzZGF5XCIsXCJUaHVyc2RheVwiLFwiRnJpZGF5XCIsXCJTYXR1cmRheVwiXX0sZXJhczp7bmFycm93OltcIlRhaWthICg2NDXigJM2NTApXCIsXCJIYWt1Y2hpICg2NTDigJM2NzEpXCIsXCJIYWt1aMWNICg2NzLigJM2ODYpXCIsXCJTaHVjaMWNICg2ODbigJM3MDEpXCIsXCJUYWloxY0gKDcwMeKAkzcwNClcIixcIktlaXVuICg3MDTigJM3MDgpXCIsXCJXYWTFjSAoNzA44oCTNzE1KVwiLFwiUmVpa2kgKDcxNeKAkzcxNylcIixcIlnFjXLFjSAoNzE34oCTNzI0KVwiLFwiSmlua2kgKDcyNOKAkzcyOSlcIixcIlRlbnB5xY0gKDcyOeKAkzc0OSlcIixcIlRlbnB5xY0ta2FtcMWNICg3NDktNzQ5KVwiLFwiVGVucHnFjS1zaMWNaMWNICg3NDktNzU3KVwiLFwiVGVucHnFjS1oxY1qaSAoNzU3LTc2NSlcIixcIlRlbnB5xY0tamluZ28gKDc2NS03NjcpXCIsXCJKaW5nby1rZWl1biAoNzY3LTc3MClcIixcIkjFjWtpICg3NzDigJM3ODApXCIsXCJUZW4txY0gKDc4MS03ODIpXCIsXCJFbnJ5YWt1ICg3ODLigJM4MDYpXCIsXCJEYWlkxY0gKDgwNuKAkzgxMClcIixcIkvFjW5pbiAoODEw4oCTODI0KVwiLFwiVGVuY2jFjSAoODI04oCTODM0KVwiLFwiSsWNd2EgKDgzNOKAkzg0OClcIixcIkthasWNICg4NDjigJM4NTEpXCIsXCJOaW5qdSAoODUx4oCTODU0KVwiLFwiU2Fpa8WNICg4NTTigJM4NTcpXCIsXCJUZW4tYW4gKDg1Ny04NTkpXCIsXCJKxY1nYW4gKDg1OeKAkzg3NylcIixcIkdhbmd5xY0gKDg3N+KAkzg4NSlcIixcIk5pbm5hICg4ODXigJM4ODkpXCIsXCJLYW5wecWNICg4ODnigJM4OTgpXCIsXCJTaMWNdGFpICg4OTjigJM5MDEpXCIsXCJFbmdpICg5MDHigJM5MjMpXCIsXCJFbmNoxY0gKDkyM+KAkzkzMSlcIixcIkrFjWhlaSAoOTMx4oCTOTM4KVwiLFwiVGVuZ3nFjSAoOTM44oCTOTQ3KVwiLFwiVGVucnlha3UgKDk0N+KAkzk1NylcIixcIlRlbnRva3UgKDk1N+KAkzk2MSlcIixcIsWMd2EgKDk2MeKAkzk2NClcIixcIkvFjWjFjSAoOTY04oCTOTY4KVwiLFwiQW5uYSAoOTY44oCTOTcwKVwiLFwiVGVucm9rdSAoOTcw4oCTOTczKVwiLFwiVGVu4oCZZW4gKDk3M+KAkzk3NilcIixcIkrFjWdlbiAoOTc24oCTOTc4KVwiLFwiVGVuZ2VuICg5NzjigJM5ODMpXCIsXCJFaWthbiAoOTgz4oCTOTg1KVwiLFwiS2FubmEgKDk4NeKAkzk4NylcIixcIkVpZW4gKDk4N+KAkzk4OSlcIixcIkVpc28gKDk4OeKAkzk5MClcIixcIlNoxY1yeWFrdSAoOTkw4oCTOTk1KVwiLFwiQ2jFjXRva3UgKDk5NeKAkzk5OSlcIixcIkNoxY1oxY0gKDk5OeKAkzEwMDQpXCIsXCJLYW5rxY0gKDEwMDTigJMxMDEyKVwiLFwiQ2jFjXdhICgxMDEy4oCTMTAxNylcIixcIkthbm5pbiAoMTAxN+KAkzEwMjEpXCIsXCJKaWFuICgxMDIx4oCTMTAyNClcIixcIk1hbmp1ICgxMDI04oCTMTAyOClcIixcIkNoxY1nZW4gKDEwMjjigJMxMDM3KVwiLFwiQ2jFjXJ5YWt1ICgxMDM34oCTMTA0MClcIixcIkNoxY1recWrICgxMDQw4oCTMTA0NClcIixcIkthbnRva3UgKDEwNDTigJMxMDQ2KVwiLFwiRWlzaMWNICgxMDQ24oCTMTA1MylcIixcIlRlbmdpICgxMDUz4oCTMTA1OClcIixcIkvFjWhlaSAoMTA1OOKAkzEwNjUpXCIsXCJKaXJ5YWt1ICgxMDY14oCTMTA2OSlcIixcIkVua3nFqyAoMTA2OeKAkzEwNzQpXCIsXCJTaMWNaG8gKDEwNzTigJMxMDc3KVwiLFwiU2jFjXJ5YWt1ICgxMDc34oCTMTA4MSlcIixcIkVpaMWNICgxMDgx4oCTMTA4NClcIixcIsWMdG9rdSAoMTA4NOKAkzEwODcpXCIsXCJLYW5qaSAoMTA4N+KAkzEwOTQpXCIsXCJLYWjFjSAoMTA5NOKAkzEwOTYpXCIsXCJFaWNoxY0gKDEwOTbigJMxMDk3KVwiLFwiSsWNdG9rdSAoMTA5N+KAkzEwOTkpXCIsXCJLxY13YSAoMTA5OeKAkzExMDQpXCIsXCJDaMWNamkgKDExMDTigJMxMTA2KVwiLFwiS2FzaMWNICgxMTA24oCTMTEwOClcIixcIlRlbm5pbiAoMTEwOOKAkzExMTApXCIsXCJUZW4tZWkgKDExMTAtMTExMylcIixcIkVpa3nFqyAoMTExM+KAkzExMTgpXCIsXCJHZW7igJllaSAoMTExOOKAkzExMjApXCIsXCJIxY1hbiAoMTEyMOKAkzExMjQpXCIsXCJUZW5qaSAoMTEyNOKAkzExMjYpXCIsXCJEYWlqaSAoMTEyNuKAkzExMzEpXCIsXCJUZW5zaMWNICgxMTMx4oCTMTEzMilcIixcIkNoxY1zaMWNICgxMTMy4oCTMTEzNSlcIixcIkjFjWVuICgxMTM14oCTMTE0MSlcIixcIkVpamkgKDExNDHigJMxMTQyKVwiLFwiS8WNamkgKDExNDLigJMxMTQ0KVwiLFwiVGVu4oCZecWNICgxMTQ04oCTMTE0NSlcIixcIkt5xathbiAoMTE0NeKAkzExNTEpXCIsXCJOaW5wZWkgKDExNTHigJMxMTU0KVwiLFwiS3nFq2p1ICgxMTU04oCTMTE1NilcIixcIkjFjWdlbiAoMTE1NuKAkzExNTkpXCIsXCJIZWlqaSAoMTE1OeKAkzExNjApXCIsXCJFaXJ5YWt1ICgxMTYw4oCTMTE2MSlcIixcIsWMaG8gKDExNjHigJMxMTYzKVwiLFwiQ2jFjWthbiAoMTE2M+KAkzExNjUpXCIsXCJFaW1hbiAoMTE2NeKAkzExNjYpXCIsXCJOaW7igJlhbiAoMTE2NuKAkzExNjkpXCIsXCJLYcWNICgxMTY54oCTMTE3MSlcIixcIlNoxY1hbiAoMTE3MeKAkzExNzUpXCIsXCJBbmdlbiAoMTE3NeKAkzExNzcpXCIsXCJKaXNoxY0gKDExNzfigJMxMTgxKVwiLFwiWcWNd2EgKDExODHigJMxMTgyKVwiLFwiSnVlaSAoMTE4MuKAkzExODQpXCIsXCJHZW5yeWFrdSAoMTE4NOKAkzExODUpXCIsXCJCdW5qaSAoMTE4NeKAkzExOTApXCIsXCJLZW5recWrICgxMTkw4oCTMTE5OSlcIixcIlNoxY1qaSAoMTE5OeKAkzEyMDEpXCIsXCJLZW5uaW4gKDEyMDHigJMxMjA0KVwiLFwiR2Vua3nFqyAoMTIwNOKAkzEyMDYpXCIsXCJLZW7igJllaSAoMTIwNuKAkzEyMDcpXCIsXCJKxY1nZW4gKDEyMDfigJMxMjExKVwiLFwiS2Vucnlha3UgKDEyMTHigJMxMjEzKVwiLFwiS2VucMWNICgxMjEz4oCTMTIxOSlcIixcIkrFjWt5xasgKDEyMTnigJMxMjIyKVwiLFwiSsWNxY0gKDEyMjLigJMxMjI0KVwiLFwiR2VubmluICgxMjI04oCTMTIyNSlcIixcIkthcm9rdSAoMTIyNeKAkzEyMjcpXCIsXCJBbnRlaSAoMTIyN+KAkzEyMjkpXCIsXCJLYW5raSAoMTIyOeKAkzEyMzIpXCIsXCJKxY1laSAoMTIzMuKAkzEyMzMpXCIsXCJUZW5wdWt1ICgxMjMz4oCTMTIzNClcIixcIkJ1bnJ5YWt1ICgxMjM04oCTMTIzNSlcIixcIkthdGVpICgxMjM14oCTMTIzOClcIixcIlJ5YWt1bmluICgxMjM44oCTMTIzOSlcIixcIkVu4oCZxY0gKDEyMznigJMxMjQwKVwiLFwiTmluamkgKDEyNDDigJMxMjQzKVwiLFwiS2FuZ2VuICgxMjQz4oCTMTI0NylcIixcIkjFjWppICgxMjQ34oCTMTI0OSlcIixcIktlbmNoxY0gKDEyNDnigJMxMjU2KVwiLFwiS8WNZ2VuICgxMjU24oCTMTI1NylcIixcIlNoxY1rYSAoMTI1N+KAkzEyNTkpXCIsXCJTaMWNZ2VuICgxMjU54oCTMTI2MClcIixcIkJ1buKAmcWNICgxMjYw4oCTMTI2MSlcIixcIkvFjWNoxY0gKDEyNjHigJMxMjY0KVwiLFwiQnVu4oCZZWkgKDEyNjTigJMxMjc1KVwiLFwiS2VuamkgKDEyNzXigJMxMjc4KVwiLFwiS8WNYW4gKDEyNzjigJMxMjg4KVwiLFwiU2jFjcWNICgxMjg44oCTMTI5MylcIixcIkVpbmluICgxMjkz4oCTMTI5OSlcIixcIlNoxY1hbiAoMTI5OeKAkzEzMDIpXCIsXCJLZW5nZW4gKDEzMDLigJMxMzAzKVwiLFwiS2FnZW4gKDEzMDPigJMxMzA2KVwiLFwiVG9rdWppICgxMzA24oCTMTMwOClcIixcIkVua3nFjSAoMTMwOOKAkzEzMTEpXCIsXCLFjGNoxY0gKDEzMTHigJMxMzEyKVwiLFwiU2jFjXdhICgxMzEy4oCTMTMxNylcIixcIkJ1bnDFjSAoMTMxN+KAkzEzMTkpXCIsXCJHZW7FjSAoMTMxOeKAkzEzMjEpXCIsXCJHZW5rxY0gKDEzMjHigJMxMzI0KVwiLFwiU2jFjWNoxasgKDEzMjTigJMxMzI2KVwiLFwiS2FyeWFrdSAoMTMyNuKAkzEzMjkpXCIsXCJHZW50b2t1ICgxMzI54oCTMTMzMSlcIixcIkdlbmvFjSAoMTMzMeKAkzEzMzQpXCIsXCJLZW5tdSAoMTMzNOKAkzEzMzYpXCIsXCJFbmdlbiAoMTMzNuKAkzEzNDApXCIsXCJLxY1rb2t1ICgxMzQw4oCTMTM0NilcIixcIlNoxY1oZWkgKDEzNDbigJMxMzcwKVwiLFwiS2VudG9rdSAoMTM3MOKAkzEzNzIpXCIsXCJCdW5jaMWrICgxMzcy4oCTMTM3NSlcIixcIlRlbmp1ICgxMzc14oCTMTM3OSlcIixcIkvFjXJ5YWt1ICgxMzc54oCTMTM4MSlcIixcIkvFjXdhICgxMzgx4oCTMTM4NClcIixcIkdlbmNoxasgKDEzODTigJMxMzkyKVwiLFwiTWVpdG9rdSAoMTM4NOKAkzEzODcpXCIsXCJLYWtlaSAoMTM4N+KAkzEzODkpXCIsXCJLxY3FjSAoMTM4OeKAkzEzOTApXCIsXCJNZWl0b2t1ICgxMzkw4oCTMTM5NClcIixcIsWMZWkgKDEzOTTigJMxNDI4KVwiLFwiU2jFjWNoxY0gKDE0MjjigJMxNDI5KVwiLFwiRWlrecWNICgxNDI54oCTMTQ0MSlcIixcIktha2l0c3UgKDE0NDHigJMxNDQ0KVwiLFwiQnVu4oCZYW4gKDE0NDTigJMxNDQ5KVwiLFwiSMWNdG9rdSAoMTQ0OeKAkzE0NTIpXCIsXCJLecWNdG9rdSAoMTQ1MuKAkzE0NTUpXCIsXCJLxY1zaMWNICgxNDU14oCTMTQ1NylcIixcIkNoxY1yb2t1ICgxNDU34oCTMTQ2MClcIixcIkthbnNoxY0gKDE0NjDigJMxNDY2KVwiLFwiQnVuc2jFjSAoMTQ2NuKAkzE0NjcpXCIsXCLFjG5pbiAoMTQ2N+KAkzE0NjkpXCIsXCJCdW5tZWkgKDE0NjnigJMxNDg3KVwiLFwiQ2jFjWt5xY0gKDE0ODfigJMxNDg5KVwiLFwiRW50b2t1ICgxNDg54oCTMTQ5MilcIixcIk1lacWNICgxNDky4oCTMTUwMSlcIixcIkJ1bmtpICgxNTAx4oCTMTUwNClcIixcIkVpc2jFjSAoMTUwNOKAkzE1MjEpXCIsXCJUYWllaSAoMTUyMeKAkzE1MjgpXCIsXCJLecWNcm9rdSAoMTUyOOKAkzE1MzIpXCIsXCJUZW5idW4gKDE1MzLigJMxNTU1KVwiLFwiS8WNamkgKDE1NTXigJMxNTU4KVwiLFwiRWlyb2t1ICgxNTU44oCTMTU3MClcIixcIkdlbmtpICgxNTcw4oCTMTU3MylcIixcIlRlbnNoxY0gKDE1NzPigJMxNTkyKVwiLFwiQnVucm9rdSAoMTU5MuKAkzE1OTYpXCIsXCJLZWljaMWNICgxNTk24oCTMTYxNSlcIixcIkdlbm5hICgxNjE14oCTMTYyNClcIixcIkthbuKAmWVpICgxNjI04oCTMTY0NClcIixcIlNoxY1obyAoMTY0NOKAkzE2NDgpXCIsXCJLZWlhbiAoMTY0OOKAkzE2NTIpXCIsXCJKxY3FjSAoMTY1MuKAkzE2NTUpXCIsXCJNZWlyZWtpICgxNjU14oCTMTY1OClcIixcIk1hbmppICgxNjU44oCTMTY2MSlcIixcIkthbmJ1biAoMTY2MeKAkzE2NzMpXCIsXCJFbnDFjSAoMTY3M+KAkzE2ODEpXCIsXCJUZW5uYSAoMTY4MeKAkzE2ODQpXCIsXCJKxY1recWNICgxNjg04oCTMTY4OClcIixcIkdlbnJva3UgKDE2ODjigJMxNzA0KVwiLFwiSMWNZWkgKDE3MDTigJMxNzExKVwiLFwiU2jFjXRva3UgKDE3MTHigJMxNzE2KVwiLFwiS3nFjWjFjSAoMTcxNuKAkzE3MzYpXCIsXCJHZW5idW4gKDE3MzbigJMxNzQxKVwiLFwiS2FucMWNICgxNzQx4oCTMTc0NClcIixcIkVua3nFjSAoMTc0NOKAkzE3NDgpXCIsXCJLYW7igJllbiAoMTc0OOKAkzE3NTEpXCIsXCJIxY1yZWtpICgxNzUx4oCTMTc2NClcIixcIk1laXdhICgxNzY04oCTMTc3MilcIixcIkFu4oCZZWkgKDE3NzLigJMxNzgxKVwiLFwiVGVubWVpICgxNzgx4oCTMTc4OSlcIixcIkthbnNlaSAoMTc4OeKAkzE4MDEpXCIsXCJLecWNd2EgKDE4MDHigJMxODA0KVwiLFwiQnVua2EgKDE4MDTigJMxODE4KVwiLFwiQnVuc2VpICgxODE44oCTMTgzMClcIixcIlRlbnDFjSAoMTgzMOKAkzE4NDQpXCIsXCJLxY1rYSAoMTg0NOKAkzE4NDgpXCIsXCJLYWVpICgxODQ44oCTMTg1NClcIixcIkFuc2VpICgxODU04oCTMTg2MClcIixcIk1hbuKAmWVuICgxODYw4oCTMTg2MSlcIixcIkJ1bmt5xasgKDE4NjHigJMxODY0KVwiLFwiR2VuamkgKDE4NjTigJMxODY1KVwiLFwiS2VpxY0gKDE4NjXigJMxODY4KVwiLFwiTVwiLFwiVFwiLFwiU1wiLFwiSFwiXSxzaG9ydDpbXCJUYWlrYSAoNjQ14oCTNjUwKVwiLFwiSGFrdWNoaSAoNjUw4oCTNjcxKVwiLFwiSGFrdWjFjSAoNjcy4oCTNjg2KVwiLFwiU2h1Y2jFjSAoNjg24oCTNzAxKVwiLFwiVGFpaMWNICg3MDHigJM3MDQpXCIsXCJLZWl1biAoNzA04oCTNzA4KVwiLFwiV2FkxY0gKDcwOOKAkzcxNSlcIixcIlJlaWtpICg3MTXigJM3MTcpXCIsXCJZxY1yxY0gKDcxN+KAkzcyNClcIixcIkppbmtpICg3MjTigJM3MjkpXCIsXCJUZW5wecWNICg3MjnigJM3NDkpXCIsXCJUZW5wecWNLWthbXDFjSAoNzQ5LTc0OSlcIixcIlRlbnB5xY0tc2jFjWjFjSAoNzQ5LTc1NylcIixcIlRlbnB5xY0taMWNamkgKDc1Ny03NjUpXCIsXCJUZW5wecWNLWppbmdvICg3NjUtNzY3KVwiLFwiSmluZ28ta2VpdW4gKDc2Ny03NzApXCIsXCJIxY1raSAoNzcw4oCTNzgwKVwiLFwiVGVuLcWNICg3ODEtNzgyKVwiLFwiRW5yeWFrdSAoNzgy4oCTODA2KVwiLFwiRGFpZMWNICg4MDbigJM4MTApXCIsXCJLxY1uaW4gKDgxMOKAkzgyNClcIixcIlRlbmNoxY0gKDgyNOKAkzgzNClcIixcIkrFjXdhICg4MzTigJM4NDgpXCIsXCJLYWrFjSAoODQ44oCTODUxKVwiLFwiTmluanUgKDg1MeKAkzg1NClcIixcIlNhaWvFjSAoODU04oCTODU3KVwiLFwiVGVuLWFuICg4NTctODU5KVwiLFwiSsWNZ2FuICg4NTnigJM4NzcpXCIsXCJHYW5necWNICg4NzfigJM4ODUpXCIsXCJOaW5uYSAoODg14oCTODg5KVwiLFwiS2FucHnFjSAoODg54oCTODk4KVwiLFwiU2jFjXRhaSAoODk44oCTOTAxKVwiLFwiRW5naSAoOTAx4oCTOTIzKVwiLFwiRW5jaMWNICg5MjPigJM5MzEpXCIsXCJKxY1oZWkgKDkzMeKAkzkzOClcIixcIlRlbmd5xY0gKDkzOOKAkzk0NylcIixcIlRlbnJ5YWt1ICg5NDfigJM5NTcpXCIsXCJUZW50b2t1ICg5NTfigJM5NjEpXCIsXCLFjHdhICg5NjHigJM5NjQpXCIsXCJLxY1oxY0gKDk2NOKAkzk2OClcIixcIkFubmEgKDk2OOKAkzk3MClcIixcIlRlbnJva3UgKDk3MOKAkzk3MylcIixcIlRlbuKAmWVuICg5NzPigJM5NzYpXCIsXCJKxY1nZW4gKDk3NuKAkzk3OClcIixcIlRlbmdlbiAoOTc44oCTOTgzKVwiLFwiRWlrYW4gKDk4M+KAkzk4NSlcIixcIkthbm5hICg5ODXigJM5ODcpXCIsXCJFaWVuICg5ODfigJM5ODkpXCIsXCJFaXNvICg5ODnigJM5OTApXCIsXCJTaMWNcnlha3UgKDk5MOKAkzk5NSlcIixcIkNoxY10b2t1ICg5OTXigJM5OTkpXCIsXCJDaMWNaMWNICg5OTnigJMxMDA0KVwiLFwiS2Fua8WNICgxMDA04oCTMTAxMilcIixcIkNoxY13YSAoMTAxMuKAkzEwMTcpXCIsXCJLYW5uaW4gKDEwMTfigJMxMDIxKVwiLFwiSmlhbiAoMTAyMeKAkzEwMjQpXCIsXCJNYW5qdSAoMTAyNOKAkzEwMjgpXCIsXCJDaMWNZ2VuICgxMDI44oCTMTAzNylcIixcIkNoxY1yeWFrdSAoMTAzN+KAkzEwNDApXCIsXCJDaMWNa3nFqyAoMTA0MOKAkzEwNDQpXCIsXCJLYW50b2t1ICgxMDQ04oCTMTA0NilcIixcIkVpc2jFjSAoMTA0NuKAkzEwNTMpXCIsXCJUZW5naSAoMTA1M+KAkzEwNTgpXCIsXCJLxY1oZWkgKDEwNTjigJMxMDY1KVwiLFwiSmlyeWFrdSAoMTA2NeKAkzEwNjkpXCIsXCJFbmt5xasgKDEwNjnigJMxMDc0KVwiLFwiU2jFjWhvICgxMDc04oCTMTA3NylcIixcIlNoxY1yeWFrdSAoMTA3N+KAkzEwODEpXCIsXCJFaWjFjSAoMTA4MeKAkzEwODQpXCIsXCLFjHRva3UgKDEwODTigJMxMDg3KVwiLFwiS2FuamkgKDEwODfigJMxMDk0KVwiLFwiS2FoxY0gKDEwOTTigJMxMDk2KVwiLFwiRWljaMWNICgxMDk24oCTMTA5NylcIixcIkrFjXRva3UgKDEwOTfigJMxMDk5KVwiLFwiS8WNd2EgKDEwOTnigJMxMTA0KVwiLFwiQ2jFjWppICgxMTA04oCTMTEwNilcIixcIkthc2jFjSAoMTEwNuKAkzExMDgpXCIsXCJUZW5uaW4gKDExMDjigJMxMTEwKVwiLFwiVGVuLWVpICgxMTEwLTExMTMpXCIsXCJFaWt5xasgKDExMTPigJMxMTE4KVwiLFwiR2Vu4oCZZWkgKDExMTjigJMxMTIwKVwiLFwiSMWNYW4gKDExMjDigJMxMTI0KVwiLFwiVGVuamkgKDExMjTigJMxMTI2KVwiLFwiRGFpamkgKDExMjbigJMxMTMxKVwiLFwiVGVuc2jFjSAoMTEzMeKAkzExMzIpXCIsXCJDaMWNc2jFjSAoMTEzMuKAkzExMzUpXCIsXCJIxY1lbiAoMTEzNeKAkzExNDEpXCIsXCJFaWppICgxMTQx4oCTMTE0MilcIixcIkvFjWppICgxMTQy4oCTMTE0NClcIixcIlRlbuKAmXnFjSAoMTE0NOKAkzExNDUpXCIsXCJLecWrYW4gKDExNDXigJMxMTUxKVwiLFwiTmlucGVpICgxMTUx4oCTMTE1NClcIixcIkt5xatqdSAoMTE1NOKAkzExNTYpXCIsXCJIxY1nZW4gKDExNTbigJMxMTU5KVwiLFwiSGVpamkgKDExNTnigJMxMTYwKVwiLFwiRWlyeWFrdSAoMTE2MOKAkzExNjEpXCIsXCLFjGhvICgxMTYx4oCTMTE2MylcIixcIkNoxY1rYW4gKDExNjPigJMxMTY1KVwiLFwiRWltYW4gKDExNjXigJMxMTY2KVwiLFwiTmlu4oCZYW4gKDExNjbigJMxMTY5KVwiLFwiS2HFjSAoMTE2OeKAkzExNzEpXCIsXCJTaMWNYW4gKDExNzHigJMxMTc1KVwiLFwiQW5nZW4gKDExNzXigJMxMTc3KVwiLFwiSmlzaMWNICgxMTc34oCTMTE4MSlcIixcIlnFjXdhICgxMTgx4oCTMTE4MilcIixcIkp1ZWkgKDExODLigJMxMTg0KVwiLFwiR2Vucnlha3UgKDExODTigJMxMTg1KVwiLFwiQnVuamkgKDExODXigJMxMTkwKVwiLFwiS2Vua3nFqyAoMTE5MOKAkzExOTkpXCIsXCJTaMWNamkgKDExOTnigJMxMjAxKVwiLFwiS2VubmluICgxMjAx4oCTMTIwNClcIixcIkdlbmt5xasgKDEyMDTigJMxMjA2KVwiLFwiS2Vu4oCZZWkgKDEyMDbigJMxMjA3KVwiLFwiSsWNZ2VuICgxMjA34oCTMTIxMSlcIixcIktlbnJ5YWt1ICgxMjEx4oCTMTIxMylcIixcIktlbnDFjSAoMTIxM+KAkzEyMTkpXCIsXCJKxY1recWrICgxMjE54oCTMTIyMilcIixcIkrFjcWNICgxMjIy4oCTMTIyNClcIixcIkdlbm5pbiAoMTIyNOKAkzEyMjUpXCIsXCJLYXJva3UgKDEyMjXigJMxMjI3KVwiLFwiQW50ZWkgKDEyMjfigJMxMjI5KVwiLFwiS2Fua2kgKDEyMjnigJMxMjMyKVwiLFwiSsWNZWkgKDEyMzLigJMxMjMzKVwiLFwiVGVucHVrdSAoMTIzM+KAkzEyMzQpXCIsXCJCdW5yeWFrdSAoMTIzNOKAkzEyMzUpXCIsXCJLYXRlaSAoMTIzNeKAkzEyMzgpXCIsXCJSeWFrdW5pbiAoMTIzOOKAkzEyMzkpXCIsXCJFbuKAmcWNICgxMjM54oCTMTI0MClcIixcIk5pbmppICgxMjQw4oCTMTI0MylcIixcIkthbmdlbiAoMTI0M+KAkzEyNDcpXCIsXCJIxY1qaSAoMTI0N+KAkzEyNDkpXCIsXCJLZW5jaMWNICgxMjQ54oCTMTI1NilcIixcIkvFjWdlbiAoMTI1NuKAkzEyNTcpXCIsXCJTaMWNa2EgKDEyNTfigJMxMjU5KVwiLFwiU2jFjWdlbiAoMTI1OeKAkzEyNjApXCIsXCJCdW7igJnFjSAoMTI2MOKAkzEyNjEpXCIsXCJLxY1jaMWNICgxMjYx4oCTMTI2NClcIixcIkJ1buKAmWVpICgxMjY04oCTMTI3NSlcIixcIktlbmppICgxMjc14oCTMTI3OClcIixcIkvFjWFuICgxMjc44oCTMTI4OClcIixcIlNoxY3FjSAoMTI4OOKAkzEyOTMpXCIsXCJFaW5pbiAoMTI5M+KAkzEyOTkpXCIsXCJTaMWNYW4gKDEyOTnigJMxMzAyKVwiLFwiS2VuZ2VuICgxMzAy4oCTMTMwMylcIixcIkthZ2VuICgxMzAz4oCTMTMwNilcIixcIlRva3VqaSAoMTMwNuKAkzEzMDgpXCIsXCJFbmt5xY0gKDEzMDjigJMxMzExKVwiLFwixYxjaMWNICgxMzEx4oCTMTMxMilcIixcIlNoxY13YSAoMTMxMuKAkzEzMTcpXCIsXCJCdW5wxY0gKDEzMTfigJMxMzE5KVwiLFwiR2VuxY0gKDEzMTnigJMxMzIxKVwiLFwiR2Vua8WNICgxMzIx4oCTMTMyNClcIixcIlNoxY1jaMWrICgxMzI04oCTMTMyNilcIixcIkthcnlha3UgKDEzMjbigJMxMzI5KVwiLFwiR2VudG9rdSAoMTMyOeKAkzEzMzEpXCIsXCJHZW5rxY0gKDEzMzHigJMxMzM0KVwiLFwiS2VubXUgKDEzMzTigJMxMzM2KVwiLFwiRW5nZW4gKDEzMzbigJMxMzQwKVwiLFwiS8WNa29rdSAoMTM0MOKAkzEzNDYpXCIsXCJTaMWNaGVpICgxMzQ24oCTMTM3MClcIixcIktlbnRva3UgKDEzNzDigJMxMzcyKVwiLFwiQnVuY2jFqyAoMTM3MuKAkzEzNzUpXCIsXCJUZW5qdSAoMTM3NeKAkzEzNzkpXCIsXCJLxY1yeWFrdSAoMTM3OeKAkzEzODEpXCIsXCJLxY13YSAoMTM4MeKAkzEzODQpXCIsXCJHZW5jaMWrICgxMzg04oCTMTM5MilcIixcIk1laXRva3UgKDEzODTigJMxMzg3KVwiLFwiS2FrZWkgKDEzODfigJMxMzg5KVwiLFwiS8WNxY0gKDEzODnigJMxMzkwKVwiLFwiTWVpdG9rdSAoMTM5MOKAkzEzOTQpXCIsXCLFjGVpICgxMzk04oCTMTQyOClcIixcIlNoxY1jaMWNICgxNDI44oCTMTQyOSlcIixcIkVpa3nFjSAoMTQyOeKAkzE0NDEpXCIsXCJLYWtpdHN1ICgxNDQx4oCTMTQ0NClcIixcIkJ1buKAmWFuICgxNDQ04oCTMTQ0OSlcIixcIkjFjXRva3UgKDE0NDnigJMxNDUyKVwiLFwiS3nFjXRva3UgKDE0NTLigJMxNDU1KVwiLFwiS8WNc2jFjSAoMTQ1NeKAkzE0NTcpXCIsXCJDaMWNcm9rdSAoMTQ1N+KAkzE0NjApXCIsXCJLYW5zaMWNICgxNDYw4oCTMTQ2NilcIixcIkJ1bnNoxY0gKDE0NjbigJMxNDY3KVwiLFwixYxuaW4gKDE0NjfigJMxNDY5KVwiLFwiQnVubWVpICgxNDY54oCTMTQ4NylcIixcIkNoxY1recWNICgxNDg34oCTMTQ4OSlcIixcIkVudG9rdSAoMTQ4OeKAkzE0OTIpXCIsXCJNZWnFjSAoMTQ5MuKAkzE1MDEpXCIsXCJCdW5raSAoMTUwMeKAkzE1MDQpXCIsXCJFaXNoxY0gKDE1MDTigJMxNTIxKVwiLFwiVGFpZWkgKDE1MjHigJMxNTI4KVwiLFwiS3nFjXJva3UgKDE1MjjigJMxNTMyKVwiLFwiVGVuYnVuICgxNTMy4oCTMTU1NSlcIixcIkvFjWppICgxNTU14oCTMTU1OClcIixcIkVpcm9rdSAoMTU1OOKAkzE1NzApXCIsXCJHZW5raSAoMTU3MOKAkzE1NzMpXCIsXCJUZW5zaMWNICgxNTcz4oCTMTU5MilcIixcIkJ1bnJva3UgKDE1OTLigJMxNTk2KVwiLFwiS2VpY2jFjSAoMTU5NuKAkzE2MTUpXCIsXCJHZW5uYSAoMTYxNeKAkzE2MjQpXCIsXCJLYW7igJllaSAoMTYyNOKAkzE2NDQpXCIsXCJTaMWNaG8gKDE2NDTigJMxNjQ4KVwiLFwiS2VpYW4gKDE2NDjigJMxNjUyKVwiLFwiSsWNxY0gKDE2NTLigJMxNjU1KVwiLFwiTWVpcmVraSAoMTY1NeKAkzE2NTgpXCIsXCJNYW5qaSAoMTY1OOKAkzE2NjEpXCIsXCJLYW5idW4gKDE2NjHigJMxNjczKVwiLFwiRW5wxY0gKDE2NzPigJMxNjgxKVwiLFwiVGVubmEgKDE2ODHigJMxNjg0KVwiLFwiSsWNa3nFjSAoMTY4NOKAkzE2ODgpXCIsXCJHZW5yb2t1ICgxNjg44oCTMTcwNClcIixcIkjFjWVpICgxNzA04oCTMTcxMSlcIixcIlNoxY10b2t1ICgxNzEx4oCTMTcxNilcIixcIkt5xY1oxY0gKDE3MTbigJMxNzM2KVwiLFwiR2VuYnVuICgxNzM24oCTMTc0MSlcIixcIkthbnDFjSAoMTc0MeKAkzE3NDQpXCIsXCJFbmt5xY0gKDE3NDTigJMxNzQ4KVwiLFwiS2Fu4oCZZW4gKDE3NDjigJMxNzUxKVwiLFwiSMWNcmVraSAoMTc1MeKAkzE3NjQpXCIsXCJNZWl3YSAoMTc2NOKAkzE3NzIpXCIsXCJBbuKAmWVpICgxNzcy4oCTMTc4MSlcIixcIlRlbm1laSAoMTc4MeKAkzE3ODkpXCIsXCJLYW5zZWkgKDE3ODnigJMxODAxKVwiLFwiS3nFjXdhICgxODAx4oCTMTgwNClcIixcIkJ1bmthICgxODA04oCTMTgxOClcIixcIkJ1bnNlaSAoMTgxOOKAkzE4MzApXCIsXCJUZW5wxY0gKDE4MzDigJMxODQ0KVwiLFwiS8WNa2EgKDE4NDTigJMxODQ4KVwiLFwiS2FlaSAoMTg0OOKAkzE4NTQpXCIsXCJBbnNlaSAoMTg1NOKAkzE4NjApXCIsXCJNYW7igJllbiAoMTg2MOKAkzE4NjEpXCIsXCJCdW5recWrICgxODYx4oCTMTg2NClcIixcIkdlbmppICgxODY04oCTMTg2NSlcIixcIktlacWNICgxODY14oCTMTg2OClcIixcIk1laWppXCIsXCJUYWlzaMWNXCIsXCJTaMWNd2FcIixcIkhlaXNlaVwiXSxsb25nOltcIlRhaWthICg2NDXigJM2NTApXCIsXCJIYWt1Y2hpICg2NTDigJM2NzEpXCIsXCJIYWt1aMWNICg2NzLigJM2ODYpXCIsXCJTaHVjaMWNICg2ODbigJM3MDEpXCIsXCJUYWloxY0gKDcwMeKAkzcwNClcIixcIktlaXVuICg3MDTigJM3MDgpXCIsXCJXYWTFjSAoNzA44oCTNzE1KVwiLFwiUmVpa2kgKDcxNeKAkzcxNylcIixcIlnFjXLFjSAoNzE34oCTNzI0KVwiLFwiSmlua2kgKDcyNOKAkzcyOSlcIixcIlRlbnB5xY0gKDcyOeKAkzc0OSlcIixcIlRlbnB5xY0ta2FtcMWNICg3NDktNzQ5KVwiLFwiVGVucHnFjS1zaMWNaMWNICg3NDktNzU3KVwiLFwiVGVucHnFjS1oxY1qaSAoNzU3LTc2NSlcIixcIlRlbnB5xY0tamluZ28gKDc2NS03NjcpXCIsXCJKaW5nby1rZWl1biAoNzY3LTc3MClcIixcIkjFjWtpICg3NzDigJM3ODApXCIsXCJUZW4txY0gKDc4MS03ODIpXCIsXCJFbnJ5YWt1ICg3ODLigJM4MDYpXCIsXCJEYWlkxY0gKDgwNuKAkzgxMClcIixcIkvFjW5pbiAoODEw4oCTODI0KVwiLFwiVGVuY2jFjSAoODI04oCTODM0KVwiLFwiSsWNd2EgKDgzNOKAkzg0OClcIixcIkthasWNICg4NDjigJM4NTEpXCIsXCJOaW5qdSAoODUx4oCTODU0KVwiLFwiU2Fpa8WNICg4NTTigJM4NTcpXCIsXCJUZW4tYW4gKDg1Ny04NTkpXCIsXCJKxY1nYW4gKDg1OeKAkzg3NylcIixcIkdhbmd5xY0gKDg3N+KAkzg4NSlcIixcIk5pbm5hICg4ODXigJM4ODkpXCIsXCJLYW5wecWNICg4ODnigJM4OTgpXCIsXCJTaMWNdGFpICg4OTjigJM5MDEpXCIsXCJFbmdpICg5MDHigJM5MjMpXCIsXCJFbmNoxY0gKDkyM+KAkzkzMSlcIixcIkrFjWhlaSAoOTMx4oCTOTM4KVwiLFwiVGVuZ3nFjSAoOTM44oCTOTQ3KVwiLFwiVGVucnlha3UgKDk0N+KAkzk1NylcIixcIlRlbnRva3UgKDk1N+KAkzk2MSlcIixcIsWMd2EgKDk2MeKAkzk2NClcIixcIkvFjWjFjSAoOTY04oCTOTY4KVwiLFwiQW5uYSAoOTY44oCTOTcwKVwiLFwiVGVucm9rdSAoOTcw4oCTOTczKVwiLFwiVGVu4oCZZW4gKDk3M+KAkzk3NilcIixcIkrFjWdlbiAoOTc24oCTOTc4KVwiLFwiVGVuZ2VuICg5NzjigJM5ODMpXCIsXCJFaWthbiAoOTgz4oCTOTg1KVwiLFwiS2FubmEgKDk4NeKAkzk4NylcIixcIkVpZW4gKDk4N+KAkzk4OSlcIixcIkVpc28gKDk4OeKAkzk5MClcIixcIlNoxY1yeWFrdSAoOTkw4oCTOTk1KVwiLFwiQ2jFjXRva3UgKDk5NeKAkzk5OSlcIixcIkNoxY1oxY0gKDk5OeKAkzEwMDQpXCIsXCJLYW5rxY0gKDEwMDTigJMxMDEyKVwiLFwiQ2jFjXdhICgxMDEy4oCTMTAxNylcIixcIkthbm5pbiAoMTAxN+KAkzEwMjEpXCIsXCJKaWFuICgxMDIx4oCTMTAyNClcIixcIk1hbmp1ICgxMDI04oCTMTAyOClcIixcIkNoxY1nZW4gKDEwMjjigJMxMDM3KVwiLFwiQ2jFjXJ5YWt1ICgxMDM34oCTMTA0MClcIixcIkNoxY1recWrICgxMDQw4oCTMTA0NClcIixcIkthbnRva3UgKDEwNDTigJMxMDQ2KVwiLFwiRWlzaMWNICgxMDQ24oCTMTA1MylcIixcIlRlbmdpICgxMDUz4oCTMTA1OClcIixcIkvFjWhlaSAoMTA1OOKAkzEwNjUpXCIsXCJKaXJ5YWt1ICgxMDY14oCTMTA2OSlcIixcIkVua3nFqyAoMTA2OeKAkzEwNzQpXCIsXCJTaMWNaG8gKDEwNzTigJMxMDc3KVwiLFwiU2jFjXJ5YWt1ICgxMDc34oCTMTA4MSlcIixcIkVpaMWNICgxMDgx4oCTMTA4NClcIixcIsWMdG9rdSAoMTA4NOKAkzEwODcpXCIsXCJLYW5qaSAoMTA4N+KAkzEwOTQpXCIsXCJLYWjFjSAoMTA5NOKAkzEwOTYpXCIsXCJFaWNoxY0gKDEwOTbigJMxMDk3KVwiLFwiSsWNdG9rdSAoMTA5N+KAkzEwOTkpXCIsXCJLxY13YSAoMTA5OeKAkzExMDQpXCIsXCJDaMWNamkgKDExMDTigJMxMTA2KVwiLFwiS2FzaMWNICgxMTA24oCTMTEwOClcIixcIlRlbm5pbiAoMTEwOOKAkzExMTApXCIsXCJUZW4tZWkgKDExMTAtMTExMylcIixcIkVpa3nFqyAoMTExM+KAkzExMTgpXCIsXCJHZW7igJllaSAoMTExOOKAkzExMjApXCIsXCJIxY1hbiAoMTEyMOKAkzExMjQpXCIsXCJUZW5qaSAoMTEyNOKAkzExMjYpXCIsXCJEYWlqaSAoMTEyNuKAkzExMzEpXCIsXCJUZW5zaMWNICgxMTMx4oCTMTEzMilcIixcIkNoxY1zaMWNICgxMTMy4oCTMTEzNSlcIixcIkjFjWVuICgxMTM14oCTMTE0MSlcIixcIkVpamkgKDExNDHigJMxMTQyKVwiLFwiS8WNamkgKDExNDLigJMxMTQ0KVwiLFwiVGVu4oCZecWNICgxMTQ04oCTMTE0NSlcIixcIkt5xathbiAoMTE0NeKAkzExNTEpXCIsXCJOaW5wZWkgKDExNTHigJMxMTU0KVwiLFwiS3nFq2p1ICgxMTU04oCTMTE1NilcIixcIkjFjWdlbiAoMTE1NuKAkzExNTkpXCIsXCJIZWlqaSAoMTE1OeKAkzExNjApXCIsXCJFaXJ5YWt1ICgxMTYw4oCTMTE2MSlcIixcIsWMaG8gKDExNjHigJMxMTYzKVwiLFwiQ2jFjWthbiAoMTE2M+KAkzExNjUpXCIsXCJFaW1hbiAoMTE2NeKAkzExNjYpXCIsXCJOaW7igJlhbiAoMTE2NuKAkzExNjkpXCIsXCJLYcWNICgxMTY54oCTMTE3MSlcIixcIlNoxY1hbiAoMTE3MeKAkzExNzUpXCIsXCJBbmdlbiAoMTE3NeKAkzExNzcpXCIsXCJKaXNoxY0gKDExNzfigJMxMTgxKVwiLFwiWcWNd2EgKDExODHigJMxMTgyKVwiLFwiSnVlaSAoMTE4MuKAkzExODQpXCIsXCJHZW5yeWFrdSAoMTE4NOKAkzExODUpXCIsXCJCdW5qaSAoMTE4NeKAkzExOTApXCIsXCJLZW5recWrICgxMTkw4oCTMTE5OSlcIixcIlNoxY1qaSAoMTE5OeKAkzEyMDEpXCIsXCJLZW5uaW4gKDEyMDHigJMxMjA0KVwiLFwiR2Vua3nFqyAoMTIwNOKAkzEyMDYpXCIsXCJLZW7igJllaSAoMTIwNuKAkzEyMDcpXCIsXCJKxY1nZW4gKDEyMDfigJMxMjExKVwiLFwiS2Vucnlha3UgKDEyMTHigJMxMjEzKVwiLFwiS2VucMWNICgxMjEz4oCTMTIxOSlcIixcIkrFjWt5xasgKDEyMTnigJMxMjIyKVwiLFwiSsWNxY0gKDEyMjLigJMxMjI0KVwiLFwiR2VubmluICgxMjI04oCTMTIyNSlcIixcIkthcm9rdSAoMTIyNeKAkzEyMjcpXCIsXCJBbnRlaSAoMTIyN+KAkzEyMjkpXCIsXCJLYW5raSAoMTIyOeKAkzEyMzIpXCIsXCJKxY1laSAoMTIzMuKAkzEyMzMpXCIsXCJUZW5wdWt1ICgxMjMz4oCTMTIzNClcIixcIkJ1bnJ5YWt1ICgxMjM04oCTMTIzNSlcIixcIkthdGVpICgxMjM14oCTMTIzOClcIixcIlJ5YWt1bmluICgxMjM44oCTMTIzOSlcIixcIkVu4oCZxY0gKDEyMznigJMxMjQwKVwiLFwiTmluamkgKDEyNDDigJMxMjQzKVwiLFwiS2FuZ2VuICgxMjQz4oCTMTI0NylcIixcIkjFjWppICgxMjQ34oCTMTI0OSlcIixcIktlbmNoxY0gKDEyNDnigJMxMjU2KVwiLFwiS8WNZ2VuICgxMjU24oCTMTI1NylcIixcIlNoxY1rYSAoMTI1N+KAkzEyNTkpXCIsXCJTaMWNZ2VuICgxMjU54oCTMTI2MClcIixcIkJ1buKAmcWNICgxMjYw4oCTMTI2MSlcIixcIkvFjWNoxY0gKDEyNjHigJMxMjY0KVwiLFwiQnVu4oCZZWkgKDEyNjTigJMxMjc1KVwiLFwiS2VuamkgKDEyNzXigJMxMjc4KVwiLFwiS8WNYW4gKDEyNzjigJMxMjg4KVwiLFwiU2jFjcWNICgxMjg44oCTMTI5MylcIixcIkVpbmluICgxMjkz4oCTMTI5OSlcIixcIlNoxY1hbiAoMTI5OeKAkzEzMDIpXCIsXCJLZW5nZW4gKDEzMDLigJMxMzAzKVwiLFwiS2FnZW4gKDEzMDPigJMxMzA2KVwiLFwiVG9rdWppICgxMzA24oCTMTMwOClcIixcIkVua3nFjSAoMTMwOOKAkzEzMTEpXCIsXCLFjGNoxY0gKDEzMTHigJMxMzEyKVwiLFwiU2jFjXdhICgxMzEy4oCTMTMxNylcIixcIkJ1bnDFjSAoMTMxN+KAkzEzMTkpXCIsXCJHZW7FjSAoMTMxOeKAkzEzMjEpXCIsXCJHZW5rxY0gKDEzMjHigJMxMzI0KVwiLFwiU2jFjWNoxasgKDEzMjTigJMxMzI2KVwiLFwiS2FyeWFrdSAoMTMyNuKAkzEzMjkpXCIsXCJHZW50b2t1ICgxMzI54oCTMTMzMSlcIixcIkdlbmvFjSAoMTMzMeKAkzEzMzQpXCIsXCJLZW5tdSAoMTMzNOKAkzEzMzYpXCIsXCJFbmdlbiAoMTMzNuKAkzEzNDApXCIsXCJLxY1rb2t1ICgxMzQw4oCTMTM0NilcIixcIlNoxY1oZWkgKDEzNDbigJMxMzcwKVwiLFwiS2VudG9rdSAoMTM3MOKAkzEzNzIpXCIsXCJCdW5jaMWrICgxMzcy4oCTMTM3NSlcIixcIlRlbmp1ICgxMzc14oCTMTM3OSlcIixcIkvFjXJ5YWt1ICgxMzc54oCTMTM4MSlcIixcIkvFjXdhICgxMzgx4oCTMTM4NClcIixcIkdlbmNoxasgKDEzODTigJMxMzkyKVwiLFwiTWVpdG9rdSAoMTM4NOKAkzEzODcpXCIsXCJLYWtlaSAoMTM4N+KAkzEzODkpXCIsXCJLxY3FjSAoMTM4OeKAkzEzOTApXCIsXCJNZWl0b2t1ICgxMzkw4oCTMTM5NClcIixcIsWMZWkgKDEzOTTigJMxNDI4KVwiLFwiU2jFjWNoxY0gKDE0MjjigJMxNDI5KVwiLFwiRWlrecWNICgxNDI54oCTMTQ0MSlcIixcIktha2l0c3UgKDE0NDHigJMxNDQ0KVwiLFwiQnVu4oCZYW4gKDE0NDTigJMxNDQ5KVwiLFwiSMWNdG9rdSAoMTQ0OeKAkzE0NTIpXCIsXCJLecWNdG9rdSAoMTQ1MuKAkzE0NTUpXCIsXCJLxY1zaMWNICgxNDU14oCTMTQ1NylcIixcIkNoxY1yb2t1ICgxNDU34oCTMTQ2MClcIixcIkthbnNoxY0gKDE0NjDigJMxNDY2KVwiLFwiQnVuc2jFjSAoMTQ2NuKAkzE0NjcpXCIsXCLFjG5pbiAoMTQ2N+KAkzE0NjkpXCIsXCJCdW5tZWkgKDE0NjnigJMxNDg3KVwiLFwiQ2jFjWt5xY0gKDE0ODfigJMxNDg5KVwiLFwiRW50b2t1ICgxNDg54oCTMTQ5MilcIixcIk1lacWNICgxNDky4oCTMTUwMSlcIixcIkJ1bmtpICgxNTAx4oCTMTUwNClcIixcIkVpc2jFjSAoMTUwNOKAkzE1MjEpXCIsXCJUYWllaSAoMTUyMeKAkzE1MjgpXCIsXCJLecWNcm9rdSAoMTUyOOKAkzE1MzIpXCIsXCJUZW5idW4gKDE1MzLigJMxNTU1KVwiLFwiS8WNamkgKDE1NTXigJMxNTU4KVwiLFwiRWlyb2t1ICgxNTU44oCTMTU3MClcIixcIkdlbmtpICgxNTcw4oCTMTU3MylcIixcIlRlbnNoxY0gKDE1NzPigJMxNTkyKVwiLFwiQnVucm9rdSAoMTU5MuKAkzE1OTYpXCIsXCJLZWljaMWNICgxNTk24oCTMTYxNSlcIixcIkdlbm5hICgxNjE14oCTMTYyNClcIixcIkthbuKAmWVpICgxNjI04oCTMTY0NClcIixcIlNoxY1obyAoMTY0NOKAkzE2NDgpXCIsXCJLZWlhbiAoMTY0OOKAkzE2NTIpXCIsXCJKxY3FjSAoMTY1MuKAkzE2NTUpXCIsXCJNZWlyZWtpICgxNjU14oCTMTY1OClcIixcIk1hbmppICgxNjU44oCTMTY2MSlcIixcIkthbmJ1biAoMTY2MeKAkzE2NzMpXCIsXCJFbnDFjSAoMTY3M+KAkzE2ODEpXCIsXCJUZW5uYSAoMTY4MeKAkzE2ODQpXCIsXCJKxY1recWNICgxNjg04oCTMTY4OClcIixcIkdlbnJva3UgKDE2ODjigJMxNzA0KVwiLFwiSMWNZWkgKDE3MDTigJMxNzExKVwiLFwiU2jFjXRva3UgKDE3MTHigJMxNzE2KVwiLFwiS3nFjWjFjSAoMTcxNuKAkzE3MzYpXCIsXCJHZW5idW4gKDE3MzbigJMxNzQxKVwiLFwiS2FucMWNICgxNzQx4oCTMTc0NClcIixcIkVua3nFjSAoMTc0NOKAkzE3NDgpXCIsXCJLYW7igJllbiAoMTc0OOKAkzE3NTEpXCIsXCJIxY1yZWtpICgxNzUx4oCTMTc2NClcIixcIk1laXdhICgxNzY04oCTMTc3MilcIixcIkFu4oCZZWkgKDE3NzLigJMxNzgxKVwiLFwiVGVubWVpICgxNzgx4oCTMTc4OSlcIixcIkthbnNlaSAoMTc4OeKAkzE4MDEpXCIsXCJLecWNd2EgKDE4MDHigJMxODA0KVwiLFwiQnVua2EgKDE4MDTigJMxODE4KVwiLFwiQnVuc2VpICgxODE44oCTMTgzMClcIixcIlRlbnDFjSAoMTgzMOKAkzE4NDQpXCIsXCJLxY1rYSAoMTg0NOKAkzE4NDgpXCIsXCJLYWVpICgxODQ44oCTMTg1NClcIixcIkFuc2VpICgxODU04oCTMTg2MClcIixcIk1hbuKAmWVuICgxODYw4oCTMTg2MSlcIixcIkJ1bmt5xasgKDE4NjHigJMxODY0KVwiLFwiR2VuamkgKDE4NjTigJMxODY1KVwiLFwiS2VpxY0gKDE4NjXigJMxODY4KVwiLFwiTWVpamlcIixcIlRhaXNoxY1cIixcIlNoxY13YVwiLFwiSGVpc2VpXCJdfSxkYXlQZXJpb2RzOnthbTpcIkFNXCIscG06XCJQTVwifX0scGVyc2lhbjp7bW9udGhzOntuYXJyb3c6W1wiMVwiLFwiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiMTBcIixcIjExXCIsXCIxMlwiXSxzaG9ydDpbXCJGYXJ2YXJkaW5cIixcIk9yZGliZWhlc2h0XCIsXCJLaG9yZGFkXCIsXCJUaXJcIixcIk1vcmRhZFwiLFwiU2hhaHJpdmFyXCIsXCJNZWhyXCIsXCJBYmFuXCIsXCJBemFyXCIsXCJEZXlcIixcIkJhaG1hblwiLFwiRXNmYW5kXCJdLGxvbmc6W1wiRmFydmFyZGluXCIsXCJPcmRpYmVoZXNodFwiLFwiS2hvcmRhZFwiLFwiVGlyXCIsXCJNb3JkYWRcIixcIlNoYWhyaXZhclwiLFwiTWVoclwiLFwiQWJhblwiLFwiQXphclwiLFwiRGV5XCIsXCJCYWhtYW5cIixcIkVzZmFuZFwiXX0sZGF5czp7bmFycm93OltcIlNcIixcIk1cIixcIlRcIixcIldcIixcIlRcIixcIkZcIixcIlNcIl0sc2hvcnQ6W1wiU3VuXCIsXCJNb25cIixcIlR1ZVwiLFwiV2VkXCIsXCJUaHVcIixcIkZyaVwiLFwiU2F0XCJdLGxvbmc6W1wiU3VuZGF5XCIsXCJNb25kYXlcIixcIlR1ZXNkYXlcIixcIldlZG5lc2RheVwiLFwiVGh1cnNkYXlcIixcIkZyaWRheVwiLFwiU2F0dXJkYXlcIl19LGVyYXM6e25hcnJvdzpbXCJBUFwiXSxzaG9ydDpbXCJBUFwiXSxsb25nOltcIkFQXCJdfSxkYXlQZXJpb2RzOnthbTpcIkFNXCIscG06XCJQTVwifX0scm9jOnttb250aHM6e25hcnJvdzpbXCJKXCIsXCJGXCIsXCJNXCIsXCJBXCIsXCJNXCIsXCJKXCIsXCJKXCIsXCJBXCIsXCJTXCIsXCJPXCIsXCJOXCIsXCJEXCJdLHNob3J0OltcIkphblwiLFwiRmViXCIsXCJNYXJcIixcIkFwclwiLFwiTWF5XCIsXCJKdW5cIixcIkp1bFwiLFwiQXVnXCIsXCJTZXBcIixcIk9jdFwiLFwiTm92XCIsXCJEZWNcIl0sbG9uZzpbXCJKYW51YXJ5XCIsXCJGZWJydWFyeVwiLFwiTWFyY2hcIixcIkFwcmlsXCIsXCJNYXlcIixcIkp1bmVcIixcIkp1bHlcIixcIkF1Z3VzdFwiLFwiU2VwdGVtYmVyXCIsXCJPY3RvYmVyXCIsXCJOb3ZlbWJlclwiLFwiRGVjZW1iZXJcIl19LGRheXM6e25hcnJvdzpbXCJTXCIsXCJNXCIsXCJUXCIsXCJXXCIsXCJUXCIsXCJGXCIsXCJTXCJdLHNob3J0OltcIlN1blwiLFwiTW9uXCIsXCJUdWVcIixcIldlZFwiLFwiVGh1XCIsXCJGcmlcIixcIlNhdFwiXSxsb25nOltcIlN1bmRheVwiLFwiTW9uZGF5XCIsXCJUdWVzZGF5XCIsXCJXZWRuZXNkYXlcIixcIlRodXJzZGF5XCIsXCJGcmlkYXlcIixcIlNhdHVyZGF5XCJdfSxlcmFzOntuYXJyb3c6W1wiQmVmb3JlIFIuTy5DLlwiLFwiTWluZ3VvXCJdLHNob3J0OltcIkJlZm9yZSBSLk8uQy5cIixcIk1pbmd1b1wiXSxsb25nOltcIkJlZm9yZSBSLk8uQy5cIixcIk1pbmd1b1wiXX0sZGF5UGVyaW9kczp7YW06XCJBTVwiLHBtOlwiUE1cIn19fX0sbnVtYmVyOntudTpbXCJsYXRuXCJdLHBhdHRlcm5zOntkZWNpbWFsOntwb3NpdGl2ZVBhdHRlcm46XCJ7bnVtYmVyfVwiLG5lZ2F0aXZlUGF0dGVybjpcInttaW51c1NpZ259e251bWJlcn1cIn0sY3VycmVuY3k6e3Bvc2l0aXZlUGF0dGVybjpcIntjdXJyZW5jeX17bnVtYmVyfVwiLG5lZ2F0aXZlUGF0dGVybjpcInttaW51c1NpZ259e2N1cnJlbmN5fXtudW1iZXJ9XCJ9LHBlcmNlbnQ6e3Bvc2l0aXZlUGF0dGVybjpcIntudW1iZXJ9e3BlcmNlbnRTaWdufVwiLG5lZ2F0aXZlUGF0dGVybjpcInttaW51c1NpZ259e251bWJlcn17cGVyY2VudFNpZ259XCJ9fSxzeW1ib2xzOntsYXRuOntkZWNpbWFsOlwiLlwiLGdyb3VwOlwiLFwiLG5hbjpcIk5hTlwiLHBsdXNTaWduOlwiK1wiLG1pbnVzU2lnbjpcIi1cIixwZXJjZW50U2lnbjpcIiVcIixpbmZpbml0eTpcIuKInlwifX0sY3VycmVuY2llczp7QVVEOlwiQSRcIixCUkw6XCJSJFwiLENBRDpcIkNBJFwiLENOWTpcIkNOwqVcIixFVVI6XCLigqxcIixHQlA6XCLCo1wiLEhLRDpcIkhLJFwiLElMUzpcIuKCqlwiLElOUjpcIuKCuVwiLEpQWTpcIsKlXCIsS1JXOlwi4oKpXCIsTVhOOlwiTVgkXCIsTlpEOlwiTlokXCIsVFdEOlwiTlQkXCIsVVNEOlwiJFwiLFZORDpcIuKCq1wiLFhBRjpcIkZDRkFcIixYQ0Q6XCJFQyRcIixYT0Y6XCJDRkFcIixYUEY6XCJDRlBGXCJ9fX0pOyIsIkludGxQb2x5ZmlsbC5fX2FkZExvY2FsZURhdGEoe2xvY2FsZTpcImVzXCIsZGF0ZTp7Y2E6W1wiZ3JlZ29yeVwiLFwiYnVkZGhpc3RcIixcImNoaW5lc2VcIixcImNvcHRpY1wiLFwiZGFuZ2lcIixcImV0aGlvYWFcIixcImV0aGlvcGljXCIsXCJnZW5lcmljXCIsXCJoZWJyZXdcIixcImluZGlhblwiLFwiaXNsYW1pY1wiLFwiaXNsYW1pY2NcIixcImphcGFuZXNlXCIsXCJwZXJzaWFuXCIsXCJyb2NcIl0saG91ck5vMDp0cnVlLGhvdXIxMjpmYWxzZSxmb3JtYXRzOntzaG9ydDpcInsxfSB7MH1cIixtZWRpdW06XCJ7MX0gezB9XCIsZnVsbDpcInsxfSwgezB9XCIsbG9uZzpcInsxfSwgezB9XCIsYXZhaWxhYmxlRm9ybWF0czp7XCJkXCI6XCJkXCIsXCJFXCI6XCJjY2NcIixFZDpcIkUgZFwiLEVobTpcIkUsIGg6bW0gYVwiLEVIbTpcIkUsIEg6bW1cIixFaG1zOlwiRSwgaDptbTpzcyBhXCIsRUhtczpcIkUsIEg6bW06c3NcIixHeTpcInkgR1wiLEd5TU1NOlwiTU1NIHkgR1wiLEd5TU1NZDpcImQgTU1NIHkgR1wiLEd5TU1NRWQ6XCJFLCBkIE1NTSB5IEdcIixHeU1NTU06XCJNTU1NICdkZScgeSBHXCIsR3lNTU1NZDpcImQgJ2RlJyBNTU1NICdkZScgeSBHXCIsR3lNTU1NRWQ6XCJFLCBkICdkZScgTU1NTSAnZGUnIHkgR1wiLFwiaFwiOlwiaCBhXCIsXCJIXCI6XCJIXCIsaG06XCJoOm1tIGFcIixIbTpcIkg6bW1cIixobXM6XCJoOm1tOnNzIGFcIixIbXM6XCJIOm1tOnNzXCIsaG1zdjpcImg6bW06c3MgYSB2XCIsSG1zdjpcIkg6bW06c3MgdlwiLGhtc3Z2dnY6XCJoOm1tOnNzIGEgKHZ2dnYpXCIsSG1zdnZ2djpcIkg6bW06c3MgKHZ2dnYpXCIsaG12OlwiaDptbSBhIHZcIixIbXY6XCJIOm1tIHZcIixcIk1cIjpcIkxcIixNZDpcImQvTVwiLE1FZDpcIkUsIGQvTVwiLE1NZDpcImQvTVwiLE1NZGQ6XCJkL01cIixNTU06XCJMTExcIixNTU1kOlwiZCBNTU1cIixNTU1FZDpcIkUsIGQgTU1NXCIsTU1NTWQ6XCJkICdkZScgTU1NTVwiLE1NTU1FZDpcIkUsIGQgJ2RlJyBNTU1NXCIsbXM6XCJtbTpzc1wiLFwieVwiOlwieVwiLHlNOlwiTS95XCIseU1kOlwiZC9NL3lcIix5TUVkOlwiRUVFLCBkL00veVwiLHlNTTpcIk0veVwiLHlNTU06XCJNTU0geVwiLHlNTU1kOlwiZCBNTU0geVwiLHlNTU1FZDpcIkVFRSwgZCBNTU0geVwiLHlNTU1NOlwiTU1NTSAnZGUnIHlcIix5TU1NTWQ6XCJkICdkZScgTU1NTSAnZGUnIHlcIix5TU1NTUVkOlwiRUVFLCBkICdkZScgTU1NTSAnZGUnIHlcIix5UVFROlwiUVFRIHlcIix5UVFRUTpcIlFRUVEgJ2RlJyB5XCJ9LGRhdGVGb3JtYXRzOnt5TU1NTUVFRUVkOlwiRUVFRSwgZCAnZGUnIE1NTU0gJ2RlJyB5XCIseU1NTU1kOlwiZCAnZGUnIE1NTU0gJ2RlJyB5XCIseU1NTWQ6XCJkIE1NTSB5XCIseU1kOlwiZC9NL3l5XCJ9LHRpbWVGb3JtYXRzOntobW1zc3p6eno6XCJIOm1tOnNzICh6enp6KVwiLGhtc3o6XCJIOm1tOnNzIHpcIixobXM6XCJIOm1tOnNzXCIsaG06XCJIOm1tXCJ9fSxjYWxlbmRhcnM6e2J1ZGRoaXN0Onttb250aHM6e25hcnJvdzpbXCJFXCIsXCJGXCIsXCJNXCIsXCJBXCIsXCJNXCIsXCJKXCIsXCJKXCIsXCJBXCIsXCJTXCIsXCJPXCIsXCJOXCIsXCJEXCJdLHNob3J0OltcImVuZS5cIixcImZlYi5cIixcIm1hci5cIixcImFici5cIixcIm1heS5cIixcImp1bi5cIixcImp1bC5cIixcImFnby5cIixcInNlcHQuXCIsXCJvY3QuXCIsXCJub3YuXCIsXCJkaWMuXCJdLGxvbmc6W1wiZW5lcm9cIixcImZlYnJlcm9cIixcIm1hcnpvXCIsXCJhYnJpbFwiLFwibWF5b1wiLFwianVuaW9cIixcImp1bGlvXCIsXCJhZ29zdG9cIixcInNlcHRpZW1icmVcIixcIm9jdHVicmVcIixcIm5vdmllbWJyZVwiLFwiZGljaWVtYnJlXCJdfSxkYXlzOntuYXJyb3c6W1wiRFwiLFwiTFwiLFwiTVwiLFwiWFwiLFwiSlwiLFwiVlwiLFwiU1wiXSxzaG9ydDpbXCJkb20uXCIsXCJsdW4uXCIsXCJtYXIuXCIsXCJtacOpLlwiLFwianVlLlwiLFwidmllLlwiLFwic8OhYi5cIl0sbG9uZzpbXCJkb21pbmdvXCIsXCJsdW5lc1wiLFwibWFydGVzXCIsXCJtacOpcmNvbGVzXCIsXCJqdWV2ZXNcIixcInZpZXJuZXNcIixcInPDoWJhZG9cIl19LGVyYXM6e25hcnJvdzpbXCJCRVwiXSxzaG9ydDpbXCJCRVwiXSxsb25nOltcIkJFXCJdfSxkYXlQZXJpb2RzOnthbTpcImEuIG0uXCIscG06XCJwLiBtLlwifX0sY2hpbmVzZTp7bW9udGhzOntuYXJyb3c6W1wiMVwiLFwiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiMTBcIixcIjExXCIsXCIxMlwiXSxzaG9ydDpbXCJNMDFcIixcIk0wMlwiLFwiTTAzXCIsXCJNMDRcIixcIk0wNVwiLFwiTTA2XCIsXCJNMDdcIixcIk0wOFwiLFwiTTA5XCIsXCJNMTBcIixcIk0xMVwiLFwiTTEyXCJdLGxvbmc6W1wiTTAxXCIsXCJNMDJcIixcIk0wM1wiLFwiTTA0XCIsXCJNMDVcIixcIk0wNlwiLFwiTTA3XCIsXCJNMDhcIixcIk0wOVwiLFwiTTEwXCIsXCJNMTFcIixcIk0xMlwiXX0sZGF5czp7bmFycm93OltcIkRcIixcIkxcIixcIk1cIixcIlhcIixcIkpcIixcIlZcIixcIlNcIl0sc2hvcnQ6W1wiZG9tLlwiLFwibHVuLlwiLFwibWFyLlwiLFwibWnDqS5cIixcImp1ZS5cIixcInZpZS5cIixcInPDoWIuXCJdLGxvbmc6W1wiZG9taW5nb1wiLFwibHVuZXNcIixcIm1hcnRlc1wiLFwibWnDqXJjb2xlc1wiLFwianVldmVzXCIsXCJ2aWVybmVzXCIsXCJzw6FiYWRvXCJdfSxkYXlQZXJpb2RzOnthbTpcImEuIG0uXCIscG06XCJwLiBtLlwifX0sY29wdGljOnttb250aHM6e25hcnJvdzpbXCIxXCIsXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCIxMFwiLFwiMTFcIixcIjEyXCIsXCIxM1wiXSxzaG9ydDpbXCJUb3V0XCIsXCJCYWJhXCIsXCJIYXRvclwiLFwiS2lhaGtcIixcIlRvYmFcIixcIkFtc2hpclwiLFwiQmFyYW1oYXRcIixcIkJhcmFtb3VkYVwiLFwiQmFzaGFuc1wiLFwiUGFvbmFcIixcIkVwZXBcIixcIk1lc3JhXCIsXCJOYXNpZVwiXSxsb25nOltcIlRvdXRcIixcIkJhYmFcIixcIkhhdG9yXCIsXCJLaWFoa1wiLFwiVG9iYVwiLFwiQW1zaGlyXCIsXCJCYXJhbWhhdFwiLFwiQmFyYW1vdWRhXCIsXCJCYXNoYW5zXCIsXCJQYW9uYVwiLFwiRXBlcFwiLFwiTWVzcmFcIixcIk5hc2llXCJdfSxkYXlzOntuYXJyb3c6W1wiRFwiLFwiTFwiLFwiTVwiLFwiWFwiLFwiSlwiLFwiVlwiLFwiU1wiXSxzaG9ydDpbXCJkb20uXCIsXCJsdW4uXCIsXCJtYXIuXCIsXCJtacOpLlwiLFwianVlLlwiLFwidmllLlwiLFwic8OhYi5cIl0sbG9uZzpbXCJkb21pbmdvXCIsXCJsdW5lc1wiLFwibWFydGVzXCIsXCJtacOpcmNvbGVzXCIsXCJqdWV2ZXNcIixcInZpZXJuZXNcIixcInPDoWJhZG9cIl19LGVyYXM6e25hcnJvdzpbXCJFUkEwXCIsXCJFUkExXCJdLHNob3J0OltcIkVSQTBcIixcIkVSQTFcIl0sbG9uZzpbXCJFUkEwXCIsXCJFUkExXCJdfSxkYXlQZXJpb2RzOnthbTpcImEuIG0uXCIscG06XCJwLiBtLlwifX0sZGFuZ2k6e21vbnRoczp7bmFycm93OltcIjFcIixcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIjEwXCIsXCIxMVwiLFwiMTJcIl0sc2hvcnQ6W1wiTTAxXCIsXCJNMDJcIixcIk0wM1wiLFwiTTA0XCIsXCJNMDVcIixcIk0wNlwiLFwiTTA3XCIsXCJNMDhcIixcIk0wOVwiLFwiTTEwXCIsXCJNMTFcIixcIk0xMlwiXSxsb25nOltcIk0wMVwiLFwiTTAyXCIsXCJNMDNcIixcIk0wNFwiLFwiTTA1XCIsXCJNMDZcIixcIk0wN1wiLFwiTTA4XCIsXCJNMDlcIixcIk0xMFwiLFwiTTExXCIsXCJNMTJcIl19LGRheXM6e25hcnJvdzpbXCJEXCIsXCJMXCIsXCJNXCIsXCJYXCIsXCJKXCIsXCJWXCIsXCJTXCJdLHNob3J0OltcImRvbS5cIixcImx1bi5cIixcIm1hci5cIixcIm1pw6kuXCIsXCJqdWUuXCIsXCJ2aWUuXCIsXCJzw6FiLlwiXSxsb25nOltcImRvbWluZ29cIixcImx1bmVzXCIsXCJtYXJ0ZXNcIixcIm1pw6lyY29sZXNcIixcImp1ZXZlc1wiLFwidmllcm5lc1wiLFwic8OhYmFkb1wiXX0sZGF5UGVyaW9kczp7YW06XCJhLiBtLlwiLHBtOlwicC4gbS5cIn19LGV0aGlvcGljOnttb250aHM6e25hcnJvdzpbXCIxXCIsXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCIxMFwiLFwiMTFcIixcIjEyXCIsXCIxM1wiXSxzaG9ydDpbXCJNZXNrZXJlbVwiLFwiVGVrZW10XCIsXCJIZWRhclwiLFwiVGFoc2FzXCIsXCJUZXJcIixcIllla2F0aXRcIixcIk1lZ2FiaXRcIixcIk1pYXppYVwiLFwiR2VuYm90XCIsXCJTZW5lXCIsXCJIYW1sZVwiLFwiTmVoYXNzZVwiLFwiUGFndW1lblwiXSxsb25nOltcIk1lc2tlcmVtXCIsXCJUZWtlbXRcIixcIkhlZGFyXCIsXCJUYWhzYXNcIixcIlRlclwiLFwiWWVrYXRpdFwiLFwiTWVnYWJpdFwiLFwiTWlhemlhXCIsXCJHZW5ib3RcIixcIlNlbmVcIixcIkhhbWxlXCIsXCJOZWhhc3NlXCIsXCJQYWd1bWVuXCJdfSxkYXlzOntuYXJyb3c6W1wiRFwiLFwiTFwiLFwiTVwiLFwiWFwiLFwiSlwiLFwiVlwiLFwiU1wiXSxzaG9ydDpbXCJkb20uXCIsXCJsdW4uXCIsXCJtYXIuXCIsXCJtacOpLlwiLFwianVlLlwiLFwidmllLlwiLFwic8OhYi5cIl0sbG9uZzpbXCJkb21pbmdvXCIsXCJsdW5lc1wiLFwibWFydGVzXCIsXCJtacOpcmNvbGVzXCIsXCJqdWV2ZXNcIixcInZpZXJuZXNcIixcInPDoWJhZG9cIl19LGVyYXM6e25hcnJvdzpbXCJFUkEwXCIsXCJFUkExXCJdLHNob3J0OltcIkVSQTBcIixcIkVSQTFcIl0sbG9uZzpbXCJFUkEwXCIsXCJFUkExXCJdfSxkYXlQZXJpb2RzOnthbTpcImEuIG0uXCIscG06XCJwLiBtLlwifX0sZXRoaW9hYTp7bW9udGhzOntuYXJyb3c6W1wiMVwiLFwiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiMTBcIixcIjExXCIsXCIxMlwiLFwiMTNcIl0sc2hvcnQ6W1wiTWVza2VyZW1cIixcIlRla2VtdFwiLFwiSGVkYXJcIixcIlRhaHNhc1wiLFwiVGVyXCIsXCJZZWthdGl0XCIsXCJNZWdhYml0XCIsXCJNaWF6aWFcIixcIkdlbmJvdFwiLFwiU2VuZVwiLFwiSGFtbGVcIixcIk5laGFzc2VcIixcIlBhZ3VtZW5cIl0sbG9uZzpbXCJNZXNrZXJlbVwiLFwiVGVrZW10XCIsXCJIZWRhclwiLFwiVGFoc2FzXCIsXCJUZXJcIixcIllla2F0aXRcIixcIk1lZ2FiaXRcIixcIk1pYXppYVwiLFwiR2VuYm90XCIsXCJTZW5lXCIsXCJIYW1sZVwiLFwiTmVoYXNzZVwiLFwiUGFndW1lblwiXX0sZGF5czp7bmFycm93OltcIkRcIixcIkxcIixcIk1cIixcIlhcIixcIkpcIixcIlZcIixcIlNcIl0sc2hvcnQ6W1wiZG9tLlwiLFwibHVuLlwiLFwibWFyLlwiLFwibWnDqS5cIixcImp1ZS5cIixcInZpZS5cIixcInPDoWIuXCJdLGxvbmc6W1wiZG9taW5nb1wiLFwibHVuZXNcIixcIm1hcnRlc1wiLFwibWnDqXJjb2xlc1wiLFwianVldmVzXCIsXCJ2aWVybmVzXCIsXCJzw6FiYWRvXCJdfSxlcmFzOntuYXJyb3c6W1wiRVJBMFwiXSxzaG9ydDpbXCJFUkEwXCJdLGxvbmc6W1wiRVJBMFwiXX0sZGF5UGVyaW9kczp7YW06XCJhLiBtLlwiLHBtOlwicC4gbS5cIn19LGdlbmVyaWM6e21vbnRoczp7bmFycm93OltcIjFcIixcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIjEwXCIsXCIxMVwiLFwiMTJcIl0sc2hvcnQ6W1wiTTAxXCIsXCJNMDJcIixcIk0wM1wiLFwiTTA0XCIsXCJNMDVcIixcIk0wNlwiLFwiTTA3XCIsXCJNMDhcIixcIk0wOVwiLFwiTTEwXCIsXCJNMTFcIixcIk0xMlwiXSxsb25nOltcIk0wMVwiLFwiTTAyXCIsXCJNMDNcIixcIk0wNFwiLFwiTTA1XCIsXCJNMDZcIixcIk0wN1wiLFwiTTA4XCIsXCJNMDlcIixcIk0xMFwiLFwiTTExXCIsXCJNMTJcIl19LGRheXM6e25hcnJvdzpbXCJEXCIsXCJMXCIsXCJNXCIsXCJYXCIsXCJKXCIsXCJWXCIsXCJTXCJdLHNob3J0OltcImRvbS5cIixcImx1bi5cIixcIm1hci5cIixcIm1pw6kuXCIsXCJqdWUuXCIsXCJ2aWUuXCIsXCJzw6FiLlwiXSxsb25nOltcImRvbWluZ29cIixcImx1bmVzXCIsXCJtYXJ0ZXNcIixcIm1pw6lyY29sZXNcIixcImp1ZXZlc1wiLFwidmllcm5lc1wiLFwic8OhYmFkb1wiXX0sZXJhczp7bmFycm93OltcIkVSQTBcIixcIkVSQTFcIl0sc2hvcnQ6W1wiRVJBMFwiLFwiRVJBMVwiXSxsb25nOltcIkVSQTBcIixcIkVSQTFcIl19LGRheVBlcmlvZHM6e2FtOlwiYS4gbS5cIixwbTpcInAuIG0uXCJ9fSxncmVnb3J5Onttb250aHM6e25hcnJvdzpbXCJFXCIsXCJGXCIsXCJNXCIsXCJBXCIsXCJNXCIsXCJKXCIsXCJKXCIsXCJBXCIsXCJTXCIsXCJPXCIsXCJOXCIsXCJEXCJdLHNob3J0OltcImVuZS5cIixcImZlYi5cIixcIm1hci5cIixcImFici5cIixcIm1heS5cIixcImp1bi5cIixcImp1bC5cIixcImFnby5cIixcInNlcHQuXCIsXCJvY3QuXCIsXCJub3YuXCIsXCJkaWMuXCJdLGxvbmc6W1wiZW5lcm9cIixcImZlYnJlcm9cIixcIm1hcnpvXCIsXCJhYnJpbFwiLFwibWF5b1wiLFwianVuaW9cIixcImp1bGlvXCIsXCJhZ29zdG9cIixcInNlcHRpZW1icmVcIixcIm9jdHVicmVcIixcIm5vdmllbWJyZVwiLFwiZGljaWVtYnJlXCJdfSxkYXlzOntuYXJyb3c6W1wiRFwiLFwiTFwiLFwiTVwiLFwiWFwiLFwiSlwiLFwiVlwiLFwiU1wiXSxzaG9ydDpbXCJkb20uXCIsXCJsdW4uXCIsXCJtYXIuXCIsXCJtacOpLlwiLFwianVlLlwiLFwidmllLlwiLFwic8OhYi5cIl0sbG9uZzpbXCJkb21pbmdvXCIsXCJsdW5lc1wiLFwibWFydGVzXCIsXCJtacOpcmNvbGVzXCIsXCJqdWV2ZXNcIixcInZpZXJuZXNcIixcInPDoWJhZG9cIl19LGVyYXM6e25hcnJvdzpbXCJhLiBDLlwiLFwiZC4gQy5cIixcImEuIGUuIGMuXCIsXCJlLiBjLlwiXSxzaG9ydDpbXCJhLiBDLlwiLFwiZC4gQy5cIixcImEuIGUuIGMuXCIsXCJlLiBjLlwiXSxsb25nOltcImFudGVzIGRlIENyaXN0b1wiLFwiZGVzcHXDqXMgZGUgQ3Jpc3RvXCIsXCJhbnRlcyBkZSBsYSBlcmEgY29tw7puXCIsXCJlcmEgY29tw7puXCJdfSxkYXlQZXJpb2RzOnthbTpcImEuIG0uXCIscG06XCJwLiBtLlwifX0saGVicmV3Onttb250aHM6e25hcnJvdzpbXCIxXCIsXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCIxMFwiLFwiMTFcIixcIjEyXCIsXCIxM1wiLFwiN1wiXSxzaG9ydDpbXCJUaXNocmlcIixcIkhlc2h2YW5cIixcIktpc2xldlwiLFwiVGV2ZXRcIixcIlNoZXZhdFwiLFwiQWRhciBJXCIsXCJBZGFyXCIsXCJOaXNhblwiLFwiSXlhclwiLFwiU2l2YW5cIixcIlRhbXV6XCIsXCJBdlwiLFwiRWx1bFwiLFwiQWRhciBJSVwiXSxsb25nOltcIlRpc2hyaVwiLFwiSGVzaHZhblwiLFwiS2lzbGV2XCIsXCJUZXZldFwiLFwiU2hldmF0XCIsXCJBZGFyIElcIixcIkFkYXJcIixcIk5pc2FuXCIsXCJJeWFyXCIsXCJTaXZhblwiLFwiVGFtdXpcIixcIkF2XCIsXCJFbHVsXCIsXCJBZGFyIElJXCJdfSxkYXlzOntuYXJyb3c6W1wiRFwiLFwiTFwiLFwiTVwiLFwiWFwiLFwiSlwiLFwiVlwiLFwiU1wiXSxzaG9ydDpbXCJkb20uXCIsXCJsdW4uXCIsXCJtYXIuXCIsXCJtacOpLlwiLFwianVlLlwiLFwidmllLlwiLFwic8OhYi5cIl0sbG9uZzpbXCJkb21pbmdvXCIsXCJsdW5lc1wiLFwibWFydGVzXCIsXCJtacOpcmNvbGVzXCIsXCJqdWV2ZXNcIixcInZpZXJuZXNcIixcInPDoWJhZG9cIl19LGVyYXM6e25hcnJvdzpbXCJBTVwiXSxzaG9ydDpbXCJBTVwiXSxsb25nOltcIkFNXCJdfSxkYXlQZXJpb2RzOnthbTpcImEuIG0uXCIscG06XCJwLiBtLlwifX0saW5kaWFuOnttb250aHM6e25hcnJvdzpbXCIxXCIsXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCIxMFwiLFwiMTFcIixcIjEyXCJdLHNob3J0OltcIkNoYWl0cmFcIixcIlZhaXNha2hhXCIsXCJKeWFpc3RoYVwiLFwiQXNhZGhhXCIsXCJTcmF2YW5hXCIsXCJCaGFkcmFcIixcIkFzdmluYVwiLFwiS2FydGlrYVwiLFwiQWdyYWhheWFuYVwiLFwiUGF1c2FcIixcIk1hZ2hhXCIsXCJQaGFsZ3VuYVwiXSxsb25nOltcIkNoYWl0cmFcIixcIlZhaXNha2hhXCIsXCJKeWFpc3RoYVwiLFwiQXNhZGhhXCIsXCJTcmF2YW5hXCIsXCJCaGFkcmFcIixcIkFzdmluYVwiLFwiS2FydGlrYVwiLFwiQWdyYWhheWFuYVwiLFwiUGF1c2FcIixcIk1hZ2hhXCIsXCJQaGFsZ3VuYVwiXX0sZGF5czp7bmFycm93OltcIkRcIixcIkxcIixcIk1cIixcIlhcIixcIkpcIixcIlZcIixcIlNcIl0sc2hvcnQ6W1wiZG9tLlwiLFwibHVuLlwiLFwibWFyLlwiLFwibWnDqS5cIixcImp1ZS5cIixcInZpZS5cIixcInPDoWIuXCJdLGxvbmc6W1wiZG9taW5nb1wiLFwibHVuZXNcIixcIm1hcnRlc1wiLFwibWnDqXJjb2xlc1wiLFwianVldmVzXCIsXCJ2aWVybmVzXCIsXCJzw6FiYWRvXCJdfSxlcmFzOntuYXJyb3c6W1wiU2FrYVwiXSxzaG9ydDpbXCJTYWthXCJdLGxvbmc6W1wiU2FrYVwiXX0sZGF5UGVyaW9kczp7YW06XCJhLiBtLlwiLHBtOlwicC4gbS5cIn19LGlzbGFtaWM6e21vbnRoczp7bmFycm93OltcIjFcIixcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIjEwXCIsXCIxMVwiLFwiMTJcIl0sc2hvcnQ6W1wiTXVoLlwiLFwiU2FmLlwiLFwiUmFiLiBJXCIsXCJSYWIuIElJXCIsXCJKdW0uIElcIixcIkp1bS4gSUlcIixcIlJhai5cIixcIlNoYS5cIixcIlJhbS5cIixcIlNoYXcuXCIsXCJEaHXKu2wtUS5cIixcIkRodcq7bC1ILlwiXSxsb25nOltcIk11aGFycmFtXCIsXCJTYWZhclwiLFwiUmFiacq7IElcIixcIlJhYmnKuyBJSVwiLFwiSnVtYWRhIElcIixcIkp1bWFkYSBJSVwiLFwiUmFqYWJcIixcIlNoYcq7YmFuXCIsXCJSYW1hZGFuXCIsXCJTaGF3d2FsXCIsXCJEaHXKu2wtUWnKu2RhaFwiLFwiRGh1yrtsLUhpamphaFwiXX0sZGF5czp7bmFycm93OltcIkRcIixcIkxcIixcIk1cIixcIlhcIixcIkpcIixcIlZcIixcIlNcIl0sc2hvcnQ6W1wiZG9tLlwiLFwibHVuLlwiLFwibWFyLlwiLFwibWnDqS5cIixcImp1ZS5cIixcInZpZS5cIixcInPDoWIuXCJdLGxvbmc6W1wiZG9taW5nb1wiLFwibHVuZXNcIixcIm1hcnRlc1wiLFwibWnDqXJjb2xlc1wiLFwianVldmVzXCIsXCJ2aWVybmVzXCIsXCJzw6FiYWRvXCJdfSxlcmFzOntuYXJyb3c6W1wiQUhcIl0sc2hvcnQ6W1wiQUhcIl0sbG9uZzpbXCJBSFwiXX0sZGF5UGVyaW9kczp7YW06XCJhLiBtLlwiLHBtOlwicC4gbS5cIn19LGlzbGFtaWNjOnttb250aHM6e25hcnJvdzpbXCIxXCIsXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCIxMFwiLFwiMTFcIixcIjEyXCJdLHNob3J0OltcIk11aC5cIixcIlNhZi5cIixcIlJhYi4gSVwiLFwiUmFiLiBJSVwiLFwiSnVtLiBJXCIsXCJKdW0uIElJXCIsXCJSYWouXCIsXCJTaGEuXCIsXCJSYW0uXCIsXCJTaGF3LlwiLFwiRGh1yrtsLVEuXCIsXCJEaHXKu2wtSC5cIl0sbG9uZzpbXCJNdWhhcnJhbVwiLFwiU2FmYXJcIixcIlJhYmnKuyBJXCIsXCJSYWJpyrsgSUlcIixcIkp1bWFkYSBJXCIsXCJKdW1hZGEgSUlcIixcIlJhamFiXCIsXCJTaGHKu2JhblwiLFwiUmFtYWRhblwiLFwiU2hhd3dhbFwiLFwiRGh1yrtsLVFpyrtkYWhcIixcIkRodcq7bC1IaWpqYWhcIl19LGRheXM6e25hcnJvdzpbXCJEXCIsXCJMXCIsXCJNXCIsXCJYXCIsXCJKXCIsXCJWXCIsXCJTXCJdLHNob3J0OltcImRvbS5cIixcImx1bi5cIixcIm1hci5cIixcIm1pw6kuXCIsXCJqdWUuXCIsXCJ2aWUuXCIsXCJzw6FiLlwiXSxsb25nOltcImRvbWluZ29cIixcImx1bmVzXCIsXCJtYXJ0ZXNcIixcIm1pw6lyY29sZXNcIixcImp1ZXZlc1wiLFwidmllcm5lc1wiLFwic8OhYmFkb1wiXX0sZXJhczp7bmFycm93OltcIkFIXCJdLHNob3J0OltcIkFIXCJdLGxvbmc6W1wiQUhcIl19LGRheVBlcmlvZHM6e2FtOlwiYS4gbS5cIixwbTpcInAuIG0uXCJ9fSxqYXBhbmVzZTp7bW9udGhzOntuYXJyb3c6W1wiRVwiLFwiRlwiLFwiTVwiLFwiQVwiLFwiTVwiLFwiSlwiLFwiSlwiLFwiQVwiLFwiU1wiLFwiT1wiLFwiTlwiLFwiRFwiXSxzaG9ydDpbXCJlbmUuXCIsXCJmZWIuXCIsXCJtYXIuXCIsXCJhYnIuXCIsXCJtYXkuXCIsXCJqdW4uXCIsXCJqdWwuXCIsXCJhZ28uXCIsXCJzZXB0LlwiLFwib2N0LlwiLFwibm92LlwiLFwiZGljLlwiXSxsb25nOltcImVuZXJvXCIsXCJmZWJyZXJvXCIsXCJtYXJ6b1wiLFwiYWJyaWxcIixcIm1heW9cIixcImp1bmlvXCIsXCJqdWxpb1wiLFwiYWdvc3RvXCIsXCJzZXB0aWVtYnJlXCIsXCJvY3R1YnJlXCIsXCJub3ZpZW1icmVcIixcImRpY2llbWJyZVwiXX0sZGF5czp7bmFycm93OltcIkRcIixcIkxcIixcIk1cIixcIlhcIixcIkpcIixcIlZcIixcIlNcIl0sc2hvcnQ6W1wiZG9tLlwiLFwibHVuLlwiLFwibWFyLlwiLFwibWnDqS5cIixcImp1ZS5cIixcInZpZS5cIixcInPDoWIuXCJdLGxvbmc6W1wiZG9taW5nb1wiLFwibHVuZXNcIixcIm1hcnRlc1wiLFwibWnDqXJjb2xlc1wiLFwianVldmVzXCIsXCJ2aWVybmVzXCIsXCJzw6FiYWRvXCJdfSxlcmFzOntuYXJyb3c6W1wiVGFpa2EgKDY0NeKAkzY1MClcIixcIkhha3VjaGkgKDY1MOKAkzY3MSlcIixcIkhha3VoxY0gKDY3MuKAkzY4NilcIixcIlNodWNoxY0gKDY4NuKAkzcwMSlcIixcIlRhaWjFjSAoNzAx4oCTNzA0KVwiLFwiS2VpdW4gKDcwNOKAkzcwOClcIixcIldhZMWNICg3MDjigJM3MTUpXCIsXCJSZWlraSAoNzE14oCTNzE3KVwiLFwiWcWNcsWNICg3MTfigJM3MjQpXCIsXCJKaW5raSAoNzI04oCTNzI5KVwiLFwiVGVucHnFjSAoNzI54oCTNzQ5KVwiLFwiVGVucHnFjS1rYW1wxY0gKDc0OS03NDkpXCIsXCJUZW5wecWNLXNoxY1oxY0gKDc0OS03NTcpXCIsXCJUZW5wecWNLWjFjWppICg3NTctNzY1KVwiLFwiVGVucHnFjS1qaW5nbyAoNzY1LTc2NylcIixcIkppbmdvLWtlaXVuICg3NjctNzcwKVwiLFwiSMWNa2kgKDc3MOKAkzc4MClcIixcIlRlbi3FjSAoNzgxLTc4MilcIixcIkVucnlha3UgKDc4MuKAkzgwNilcIixcIkRhaWTFjSAoODA24oCTODEwKVwiLFwiS8WNbmluICg4MTDigJM4MjQpXCIsXCJUZW5jaMWNICg4MjTigJM4MzQpXCIsXCJKxY13YSAoODM04oCTODQ4KVwiLFwiS2FqxY0gKDg0OOKAkzg1MSlcIixcIk5pbmp1ICg4NTHigJM4NTQpXCIsXCJTYWlrxY0gKDg1NOKAkzg1NylcIixcIlRlbi1hbiAoODU3LTg1OSlcIixcIkrFjWdhbiAoODU54oCTODc3KVwiLFwiR2FuZ3nFjSAoODc34oCTODg1KVwiLFwiTmlubmEgKDg4NeKAkzg4OSlcIixcIkthbnB5xY0gKDg4OeKAkzg5OClcIixcIlNoxY10YWkgKDg5OOKAkzkwMSlcIixcIkVuZ2kgKDkwMeKAkzkyMylcIixcIkVuY2jFjSAoOTIz4oCTOTMxKVwiLFwiSsWNaGVpICg5MzHigJM5MzgpXCIsXCJUZW5necWNICg5MzjigJM5NDcpXCIsXCJUZW5yeWFrdSAoOTQ34oCTOTU3KVwiLFwiVGVudG9rdSAoOTU34oCTOTYxKVwiLFwixYx3YSAoOTYx4oCTOTY0KVwiLFwiS8WNaMWNICg5NjTigJM5NjgpXCIsXCJBbm5hICg5NjjigJM5NzApXCIsXCJUZW5yb2t1ICg5NzDigJM5NzMpXCIsXCJUZW7igJllbiAoOTcz4oCTOTc2KVwiLFwiSsWNZ2VuICg5NzbigJM5NzgpXCIsXCJUZW5nZW4gKDk3OOKAkzk4MylcIixcIkVpa2FuICg5ODPigJM5ODUpXCIsXCJLYW5uYSAoOTg14oCTOTg3KVwiLFwiRWllbiAoOTg34oCTOTg5KVwiLFwiRWlzbyAoOTg54oCTOTkwKVwiLFwiU2jFjXJ5YWt1ICg5OTDigJM5OTUpXCIsXCJDaMWNdG9rdSAoOTk14oCTOTk5KVwiLFwiQ2jFjWjFjSAoOTk54oCTMTAwNClcIixcIkthbmvFjSAoMTAwNOKAkzEwMTIpXCIsXCJDaMWNd2EgKDEwMTLigJMxMDE3KVwiLFwiS2FubmluICgxMDE34oCTMTAyMSlcIixcIkppYW4gKDEwMjHigJMxMDI0KVwiLFwiTWFuanUgKDEwMjTigJMxMDI4KVwiLFwiQ2jFjWdlbiAoMTAyOOKAkzEwMzcpXCIsXCJDaMWNcnlha3UgKDEwMzfigJMxMDQwKVwiLFwiQ2jFjWt5xasgKDEwNDDigJMxMDQ0KVwiLFwiS2FudG9rdSAoMTA0NOKAkzEwNDYpXCIsXCJFaXNoxY0gKDEwNDbigJMxMDUzKVwiLFwiVGVuZ2kgKDEwNTPigJMxMDU4KVwiLFwiS8WNaGVpICgxMDU44oCTMTA2NSlcIixcIkppcnlha3UgKDEwNjXigJMxMDY5KVwiLFwiRW5recWrICgxMDY54oCTMTA3NClcIixcIlNoxY1obyAoMTA3NOKAkzEwNzcpXCIsXCJTaMWNcnlha3UgKDEwNzfigJMxMDgxKVwiLFwiRWloxY0gKDEwODHigJMxMDg0KVwiLFwixYx0b2t1ICgxMDg04oCTMTA4NylcIixcIkthbmppICgxMDg34oCTMTA5NClcIixcIkthaMWNICgxMDk04oCTMTA5NilcIixcIkVpY2jFjSAoMTA5NuKAkzEwOTcpXCIsXCJKxY10b2t1ICgxMDk34oCTMTA5OSlcIixcIkvFjXdhICgxMDk54oCTMTEwNClcIixcIkNoxY1qaSAoMTEwNOKAkzExMDYpXCIsXCJLYXNoxY0gKDExMDbigJMxMTA4KVwiLFwiVGVubmluICgxMTA44oCTMTExMClcIixcIlRlbi1laSAoMTExMC0xMTEzKVwiLFwiRWlrecWrICgxMTEz4oCTMTExOClcIixcIkdlbuKAmWVpICgxMTE44oCTMTEyMClcIixcIkjFjWFuICgxMTIw4oCTMTEyNClcIixcIlRlbmppICgxMTI04oCTMTEyNilcIixcIkRhaWppICgxMTI24oCTMTEzMSlcIixcIlRlbnNoxY0gKDExMzHigJMxMTMyKVwiLFwiQ2jFjXNoxY0gKDExMzLigJMxMTM1KVwiLFwiSMWNZW4gKDExMzXigJMxMTQxKVwiLFwiRWlqaSAoMTE0MeKAkzExNDIpXCIsXCJLxY1qaSAoMTE0MuKAkzExNDQpXCIsXCJUZW7igJl5xY0gKDExNDTigJMxMTQ1KVwiLFwiS3nFq2FuICgxMTQ14oCTMTE1MSlcIixcIk5pbnBlaSAoMTE1MeKAkzExNTQpXCIsXCJLecWranUgKDExNTTigJMxMTU2KVwiLFwiSMWNZ2VuICgxMTU24oCTMTE1OSlcIixcIkhlaWppICgxMTU54oCTMTE2MClcIixcIkVpcnlha3UgKDExNjDigJMxMTYxKVwiLFwixYxobyAoMTE2MeKAkzExNjMpXCIsXCJDaMWNa2FuICgxMTYz4oCTMTE2NSlcIixcIkVpbWFuICgxMTY14oCTMTE2NilcIixcIk5pbuKAmWFuICgxMTY24oCTMTE2OSlcIixcIkthxY0gKDExNjnigJMxMTcxKVwiLFwiU2jFjWFuICgxMTcx4oCTMTE3NSlcIixcIkFuZ2VuICgxMTc14oCTMTE3NylcIixcIkppc2jFjSAoMTE3N+KAkzExODEpXCIsXCJZxY13YSAoMTE4MeKAkzExODIpXCIsXCJKdWVpICgxMTgy4oCTMTE4NClcIixcIkdlbnJ5YWt1ICgxMTg04oCTMTE4NSlcIixcIkJ1bmppICgxMTg14oCTMTE5MClcIixcIktlbmt5xasgKDExOTDigJMxMTk5KVwiLFwiU2jFjWppICgxMTk54oCTMTIwMSlcIixcIktlbm5pbiAoMTIwMeKAkzEyMDQpXCIsXCJHZW5recWrICgxMjA04oCTMTIwNilcIixcIktlbuKAmWVpICgxMjA24oCTMTIwNylcIixcIkrFjWdlbiAoMTIwN+KAkzEyMTEpXCIsXCJLZW5yeWFrdSAoMTIxMeKAkzEyMTMpXCIsXCJLZW5wxY0gKDEyMTPigJMxMjE5KVwiLFwiSsWNa3nFqyAoMTIxOeKAkzEyMjIpXCIsXCJKxY3FjSAoMTIyMuKAkzEyMjQpXCIsXCJHZW5uaW4gKDEyMjTigJMxMjI1KVwiLFwiS2Fyb2t1ICgxMjI14oCTMTIyNylcIixcIkFudGVpICgxMjI34oCTMTIyOSlcIixcIkthbmtpICgxMjI54oCTMTIzMilcIixcIkrFjWVpICgxMjMy4oCTMTIzMylcIixcIlRlbnB1a3UgKDEyMzPigJMxMjM0KVwiLFwiQnVucnlha3UgKDEyMzTigJMxMjM1KVwiLFwiS2F0ZWkgKDEyMzXigJMxMjM4KVwiLFwiUnlha3VuaW4gKDEyMzjigJMxMjM5KVwiLFwiRW7igJnFjSAoMTIzOeKAkzEyNDApXCIsXCJOaW5qaSAoMTI0MOKAkzEyNDMpXCIsXCJLYW5nZW4gKDEyNDPigJMxMjQ3KVwiLFwiSMWNamkgKDEyNDfigJMxMjQ5KVwiLFwiS2VuY2jFjSAoMTI0OeKAkzEyNTYpXCIsXCJLxY1nZW4gKDEyNTbigJMxMjU3KVwiLFwiU2jFjWthICgxMjU34oCTMTI1OSlcIixcIlNoxY1nZW4gKDEyNTnigJMxMjYwKVwiLFwiQnVu4oCZxY0gKDEyNjDigJMxMjYxKVwiLFwiS8WNY2jFjSAoMTI2MeKAkzEyNjQpXCIsXCJCdW7igJllaSAoMTI2NOKAkzEyNzUpXCIsXCJLZW5qaSAoMTI3NeKAkzEyNzgpXCIsXCJLxY1hbiAoMTI3OOKAkzEyODgpXCIsXCJTaMWNxY0gKDEyODjigJMxMjkzKVwiLFwiRWluaW4gKDEyOTPigJMxMjk5KVwiLFwiU2jFjWFuICgxMjk54oCTMTMwMilcIixcIktlbmdlbiAoMTMwMuKAkzEzMDMpXCIsXCJLYWdlbiAoMTMwM+KAkzEzMDYpXCIsXCJUb2t1amkgKDEzMDbigJMxMzA4KVwiLFwiRW5recWNICgxMzA44oCTMTMxMSlcIixcIsWMY2jFjSAoMTMxMeKAkzEzMTIpXCIsXCJTaMWNd2EgKDEzMTLigJMxMzE3KVwiLFwiQnVucMWNICgxMzE34oCTMTMxOSlcIixcIkdlbsWNICgxMzE54oCTMTMyMSlcIixcIkdlbmvFjSAoMTMyMeKAkzEzMjQpXCIsXCJTaMWNY2jFqyAoMTMyNOKAkzEzMjYpXCIsXCJLYXJ5YWt1ICgxMzI24oCTMTMyOSlcIixcIkdlbnRva3UgKDEzMjnigJMxMzMxKVwiLFwiR2Vua8WNICgxMzMx4oCTMTMzNClcIixcIktlbm11ICgxMzM04oCTMTMzNilcIixcIkVuZ2VuICgxMzM24oCTMTM0MClcIixcIkvFjWtva3UgKDEzNDDigJMxMzQ2KVwiLFwiU2jFjWhlaSAoMTM0NuKAkzEzNzApXCIsXCJLZW50b2t1ICgxMzcw4oCTMTM3MilcIixcIkJ1bmNoxasgKDEzNzLigJMxMzc1KVwiLFwiVGVuanUgKDEzNzXigJMxMzc5KVwiLFwiS8WNcnlha3UgKDEzNznigJMxMzgxKVwiLFwiS8WNd2EgKDEzODHigJMxMzg0KVwiLFwiR2VuY2jFqyAoMTM4NOKAkzEzOTIpXCIsXCJNZWl0b2t1ICgxMzg04oCTMTM4NylcIixcIktha2VpICgxMzg34oCTMTM4OSlcIixcIkvFjcWNICgxMzg54oCTMTM5MClcIixcIk1laXRva3UgKDEzOTDigJMxMzk0KVwiLFwixYxlaSAoMTM5NOKAkzE0MjgpXCIsXCJTaMWNY2jFjSAoMTQyOOKAkzE0MjkpXCIsXCJFaWt5xY0gKDE0MjnigJMxNDQxKVwiLFwiS2FraXRzdSAoMTQ0MeKAkzE0NDQpXCIsXCJCdW7igJlhbiAoMTQ0NOKAkzE0NDkpXCIsXCJIxY10b2t1ICgxNDQ54oCTMTQ1MilcIixcIkt5xY10b2t1ICgxNDUy4oCTMTQ1NSlcIixcIkvFjXNoxY0gKDE0NTXigJMxNDU3KVwiLFwiQ2jFjXJva3UgKDE0NTfigJMxNDYwKVwiLFwiS2Fuc2jFjSAoMTQ2MOKAkzE0NjYpXCIsXCJCdW5zaMWNICgxNDY24oCTMTQ2NylcIixcIsWMbmluICgxNDY34oCTMTQ2OSlcIixcIkJ1bm1laSAoMTQ2OeKAkzE0ODcpXCIsXCJDaMWNa3nFjSAoMTQ4N+KAkzE0ODkpXCIsXCJFbnRva3UgKDE0ODnigJMxNDkyKVwiLFwiTWVpxY0gKDE0OTLigJMxNTAxKVwiLFwiQnVua2kgKDE1MDHigJMxNTA0KVwiLFwiRWlzaMWNICgxNTA04oCTMTUyMSlcIixcIlRhaWVpICgxNTIx4oCTMTUyOClcIixcIkt5xY1yb2t1ICgxNTI44oCTMTUzMilcIixcIlRlbmJ1biAoMTUzMuKAkzE1NTUpXCIsXCJLxY1qaSAoMTU1NeKAkzE1NTgpXCIsXCJFaXJva3UgKDE1NTjigJMxNTcwKVwiLFwiR2Vua2kgKDE1NzDigJMxNTczKVwiLFwiVGVuc2jFjSAoMTU3M+KAkzE1OTIpXCIsXCJCdW5yb2t1ICgxNTky4oCTMTU5NilcIixcIktlaWNoxY0gKDE1OTbigJMxNjE1KVwiLFwiR2VubmEgKDE2MTXigJMxNjI0KVwiLFwiS2Fu4oCZZWkgKDE2MjTigJMxNjQ0KVwiLFwiU2jFjWhvICgxNjQ04oCTMTY0OClcIixcIktlaWFuICgxNjQ44oCTMTY1MilcIixcIkrFjcWNICgxNjUy4oCTMTY1NSlcIixcIk1laXJla2kgKDE2NTXigJMxNjU4KVwiLFwiTWFuamkgKDE2NTjigJMxNjYxKVwiLFwiS2FuYnVuICgxNjYx4oCTMTY3MylcIixcIkVucMWNICgxNjcz4oCTMTY4MSlcIixcIlRlbm5hICgxNjgx4oCTMTY4NClcIixcIkrFjWt5xY0gKDE2ODTigJMxNjg4KVwiLFwiR2Vucm9rdSAoMTY4OOKAkzE3MDQpXCIsXCJIxY1laSAoMTcwNOKAkzE3MTEpXCIsXCJTaMWNdG9rdSAoMTcxMeKAkzE3MTYpXCIsXCJLecWNaMWNICgxNzE24oCTMTczNilcIixcIkdlbmJ1biAoMTczNuKAkzE3NDEpXCIsXCJLYW5wxY0gKDE3NDHigJMxNzQ0KVwiLFwiRW5recWNICgxNzQ04oCTMTc0OClcIixcIkthbuKAmWVuICgxNzQ44oCTMTc1MSlcIixcIkjFjXJla2kgKDE3NTHigJMxNzY0KVwiLFwiTWVpd2EgKDE3NjTigJMxNzcyKVwiLFwiQW7igJllaSAoMTc3MuKAkzE3ODEpXCIsXCJUZW5tZWkgKDE3ODHigJMxNzg5KVwiLFwiS2Fuc2VpICgxNzg54oCTMTgwMSlcIixcIkt5xY13YSAoMTgwMeKAkzE4MDQpXCIsXCJCdW5rYSAoMTgwNOKAkzE4MTgpXCIsXCJCdW5zZWkgKDE4MTjigJMxODMwKVwiLFwiVGVucMWNICgxODMw4oCTMTg0NClcIixcIkvFjWthICgxODQ04oCTMTg0OClcIixcIkthZWkgKDE4NDjigJMxODU0KVwiLFwiQW5zZWkgKDE4NTTigJMxODYwKVwiLFwiTWFu4oCZZW4gKDE4NjDigJMxODYxKVwiLFwiQnVua3nFqyAoMTg2MeKAkzE4NjQpXCIsXCJHZW5qaSAoMTg2NOKAkzE4NjUpXCIsXCJLZWnFjSAoMTg2NeKAkzE4NjgpXCIsXCJNXCIsXCJUXCIsXCJTXCIsXCJIXCJdLHNob3J0OltcIlRhaWthICg2NDXigJM2NTApXCIsXCJIYWt1Y2hpICg2NTDigJM2NzEpXCIsXCJIYWt1aMWNICg2NzLigJM2ODYpXCIsXCJTaHVjaMWNICg2ODbigJM3MDEpXCIsXCJUYWloxY0gKDcwMeKAkzcwNClcIixcIktlaXVuICg3MDTigJM3MDgpXCIsXCJXYWTFjSAoNzA44oCTNzE1KVwiLFwiUmVpa2kgKDcxNeKAkzcxNylcIixcIlnFjXLFjSAoNzE34oCTNzI0KVwiLFwiSmlua2kgKDcyNOKAkzcyOSlcIixcIlRlbnB5xY0gKDcyOeKAkzc0OSlcIixcIlRlbnB5xY0ta2FtcMWNICg3NDktNzQ5KVwiLFwiVGVucHnFjS1zaMWNaMWNICg3NDktNzU3KVwiLFwiVGVucHnFjS1oxY1qaSAoNzU3LTc2NSlcIixcIlRlbnB5xY0tamluZ28gKDc2NS03NjcpXCIsXCJKaW5nby1rZWl1biAoNzY3LTc3MClcIixcIkjFjWtpICg3NzDigJM3ODApXCIsXCJUZW4txY0gKDc4MS03ODIpXCIsXCJFbnJ5YWt1ICg3ODLigJM4MDYpXCIsXCJEYWlkxY0gKDgwNuKAkzgxMClcIixcIkvFjW5pbiAoODEw4oCTODI0KVwiLFwiVGVuY2jFjSAoODI04oCTODM0KVwiLFwiSsWNd2EgKDgzNOKAkzg0OClcIixcIkthasWNICg4NDjigJM4NTEpXCIsXCJOaW5qdSAoODUx4oCTODU0KVwiLFwiU2Fpa8WNICg4NTTigJM4NTcpXCIsXCJUZW4tYW4gKDg1Ny04NTkpXCIsXCJKxY1nYW4gKDg1OeKAkzg3NylcIixcIkdhbmd5xY0gKDg3N+KAkzg4NSlcIixcIk5pbm5hICg4ODXigJM4ODkpXCIsXCJLYW5wecWNICg4ODnigJM4OTgpXCIsXCJTaMWNdGFpICg4OTjigJM5MDEpXCIsXCJFbmdpICg5MDHigJM5MjMpXCIsXCJFbmNoxY0gKDkyM+KAkzkzMSlcIixcIkrFjWhlaSAoOTMx4oCTOTM4KVwiLFwiVGVuZ3nFjSAoOTM44oCTOTQ3KVwiLFwiVGVucnlha3UgKDk0N+KAkzk1NylcIixcIlRlbnRva3UgKDk1N+KAkzk2MSlcIixcIsWMd2EgKDk2MeKAkzk2NClcIixcIkvFjWjFjSAoOTY04oCTOTY4KVwiLFwiQW5uYSAoOTY44oCTOTcwKVwiLFwiVGVucm9rdSAoOTcw4oCTOTczKVwiLFwiVGVu4oCZZW4gKDk3M+KAkzk3NilcIixcIkrFjWdlbiAoOTc24oCTOTc4KVwiLFwiVGVuZ2VuICg5NzjigJM5ODMpXCIsXCJFaWthbiAoOTgz4oCTOTg1KVwiLFwiS2FubmEgKDk4NeKAkzk4NylcIixcIkVpZW4gKDk4N+KAkzk4OSlcIixcIkVpc28gKDk4OeKAkzk5MClcIixcIlNoxY1yeWFrdSAoOTkw4oCTOTk1KVwiLFwiQ2jFjXRva3UgKDk5NeKAkzk5OSlcIixcIkNoxY1oxY0gKDk5OeKAkzEwMDQpXCIsXCJLYW5rxY0gKDEwMDTigJMxMDEyKVwiLFwiQ2jFjXdhICgxMDEy4oCTMTAxNylcIixcIkthbm5pbiAoMTAxN+KAkzEwMjEpXCIsXCJKaWFuICgxMDIx4oCTMTAyNClcIixcIk1hbmp1ICgxMDI04oCTMTAyOClcIixcIkNoxY1nZW4gKDEwMjjigJMxMDM3KVwiLFwiQ2jFjXJ5YWt1ICgxMDM34oCTMTA0MClcIixcIkNoxY1recWrICgxMDQw4oCTMTA0NClcIixcIkthbnRva3UgKDEwNDTigJMxMDQ2KVwiLFwiRWlzaMWNICgxMDQ24oCTMTA1MylcIixcIlRlbmdpICgxMDUz4oCTMTA1OClcIixcIkvFjWhlaSAoMTA1OOKAkzEwNjUpXCIsXCJKaXJ5YWt1ICgxMDY14oCTMTA2OSlcIixcIkVua3nFqyAoMTA2OeKAkzEwNzQpXCIsXCJTaMWNaG8gKDEwNzTigJMxMDc3KVwiLFwiU2jFjXJ5YWt1ICgxMDc34oCTMTA4MSlcIixcIkVpaMWNICgxMDgx4oCTMTA4NClcIixcIsWMdG9rdSAoMTA4NOKAkzEwODcpXCIsXCJLYW5qaSAoMTA4N+KAkzEwOTQpXCIsXCJLYWjFjSAoMTA5NOKAkzEwOTYpXCIsXCJFaWNoxY0gKDEwOTbigJMxMDk3KVwiLFwiSsWNdG9rdSAoMTA5N+KAkzEwOTkpXCIsXCJLxY13YSAoMTA5OeKAkzExMDQpXCIsXCJDaMWNamkgKDExMDTigJMxMTA2KVwiLFwiS2FzaMWNICgxMTA24oCTMTEwOClcIixcIlRlbm5pbiAoMTEwOOKAkzExMTApXCIsXCJUZW4tZWkgKDExMTAtMTExMylcIixcIkVpa3nFqyAoMTExM+KAkzExMTgpXCIsXCJHZW7igJllaSAoMTExOOKAkzExMjApXCIsXCJIxY1hbiAoMTEyMOKAkzExMjQpXCIsXCJUZW5qaSAoMTEyNOKAkzExMjYpXCIsXCJEYWlqaSAoMTEyNuKAkzExMzEpXCIsXCJUZW5zaMWNICgxMTMx4oCTMTEzMilcIixcIkNoxY1zaMWNICgxMTMy4oCTMTEzNSlcIixcIkjFjWVuICgxMTM14oCTMTE0MSlcIixcIkVpamkgKDExNDHigJMxMTQyKVwiLFwiS8WNamkgKDExNDLigJMxMTQ0KVwiLFwiVGVu4oCZecWNICgxMTQ04oCTMTE0NSlcIixcIkt5xathbiAoMTE0NeKAkzExNTEpXCIsXCJOaW5wZWkgKDExNTHigJMxMTU0KVwiLFwiS3nFq2p1ICgxMTU04oCTMTE1NilcIixcIkjFjWdlbiAoMTE1NuKAkzExNTkpXCIsXCJIZWlqaSAoMTE1OeKAkzExNjApXCIsXCJFaXJ5YWt1ICgxMTYw4oCTMTE2MSlcIixcIsWMaG8gKDExNjHigJMxMTYzKVwiLFwiQ2jFjWthbiAoMTE2M+KAkzExNjUpXCIsXCJFaW1hbiAoMTE2NeKAkzExNjYpXCIsXCJOaW7igJlhbiAoMTE2NuKAkzExNjkpXCIsXCJLYcWNICgxMTY54oCTMTE3MSlcIixcIlNoxY1hbiAoMTE3MeKAkzExNzUpXCIsXCJBbmdlbiAoMTE3NeKAkzExNzcpXCIsXCJKaXNoxY0gKDExNzfigJMxMTgxKVwiLFwiWcWNd2EgKDExODHigJMxMTgyKVwiLFwiSnVlaSAoMTE4MuKAkzExODQpXCIsXCJHZW5yeWFrdSAoMTE4NOKAkzExODUpXCIsXCJCdW5qaSAoMTE4NeKAkzExOTApXCIsXCJLZW5recWrICgxMTkw4oCTMTE5OSlcIixcIlNoxY1qaSAoMTE5OeKAkzEyMDEpXCIsXCJLZW5uaW4gKDEyMDHigJMxMjA0KVwiLFwiR2Vua3nFqyAoMTIwNOKAkzEyMDYpXCIsXCJLZW7igJllaSAoMTIwNuKAkzEyMDcpXCIsXCJKxY1nZW4gKDEyMDfigJMxMjExKVwiLFwiS2Vucnlha3UgKDEyMTHigJMxMjEzKVwiLFwiS2VucMWNICgxMjEz4oCTMTIxOSlcIixcIkrFjWt5xasgKDEyMTnigJMxMjIyKVwiLFwiSsWNxY0gKDEyMjLigJMxMjI0KVwiLFwiR2VubmluICgxMjI04oCTMTIyNSlcIixcIkthcm9rdSAoMTIyNeKAkzEyMjcpXCIsXCJBbnRlaSAoMTIyN+KAkzEyMjkpXCIsXCJLYW5raSAoMTIyOeKAkzEyMzIpXCIsXCJKxY1laSAoMTIzMuKAkzEyMzMpXCIsXCJUZW5wdWt1ICgxMjMz4oCTMTIzNClcIixcIkJ1bnJ5YWt1ICgxMjM04oCTMTIzNSlcIixcIkthdGVpICgxMjM14oCTMTIzOClcIixcIlJ5YWt1bmluICgxMjM44oCTMTIzOSlcIixcIkVu4oCZxY0gKDEyMznigJMxMjQwKVwiLFwiTmluamkgKDEyNDDigJMxMjQzKVwiLFwiS2FuZ2VuICgxMjQz4oCTMTI0NylcIixcIkjFjWppICgxMjQ34oCTMTI0OSlcIixcIktlbmNoxY0gKDEyNDnigJMxMjU2KVwiLFwiS8WNZ2VuICgxMjU24oCTMTI1NylcIixcIlNoxY1rYSAoMTI1N+KAkzEyNTkpXCIsXCJTaMWNZ2VuICgxMjU54oCTMTI2MClcIixcIkJ1buKAmcWNICgxMjYw4oCTMTI2MSlcIixcIkvFjWNoxY0gKDEyNjHigJMxMjY0KVwiLFwiQnVu4oCZZWkgKDEyNjTigJMxMjc1KVwiLFwiS2VuamkgKDEyNzXigJMxMjc4KVwiLFwiS8WNYW4gKDEyNzjigJMxMjg4KVwiLFwiU2jFjcWNICgxMjg44oCTMTI5MylcIixcIkVpbmluICgxMjkz4oCTMTI5OSlcIixcIlNoxY1hbiAoMTI5OeKAkzEzMDIpXCIsXCJLZW5nZW4gKDEzMDLigJMxMzAzKVwiLFwiS2FnZW4gKDEzMDPigJMxMzA2KVwiLFwiVG9rdWppICgxMzA24oCTMTMwOClcIixcIkVua3nFjSAoMTMwOOKAkzEzMTEpXCIsXCLFjGNoxY0gKDEzMTHigJMxMzEyKVwiLFwiU2jFjXdhICgxMzEy4oCTMTMxNylcIixcIkJ1bnDFjSAoMTMxN+KAkzEzMTkpXCIsXCJHZW7FjSAoMTMxOeKAkzEzMjEpXCIsXCJHZW5rxY0gKDEzMjHigJMxMzI0KVwiLFwiU2jFjWNoxasgKDEzMjTigJMxMzI2KVwiLFwiS2FyeWFrdSAoMTMyNuKAkzEzMjkpXCIsXCJHZW50b2t1ICgxMzI54oCTMTMzMSlcIixcIkdlbmvFjSAoMTMzMeKAkzEzMzQpXCIsXCJLZW5tdSAoMTMzNOKAkzEzMzYpXCIsXCJFbmdlbiAoMTMzNuKAkzEzNDApXCIsXCJLxY1rb2t1ICgxMzQw4oCTMTM0NilcIixcIlNoxY1oZWkgKDEzNDbigJMxMzcwKVwiLFwiS2VudG9rdSAoMTM3MOKAkzEzNzIpXCIsXCJCdW5jaMWrICgxMzcy4oCTMTM3NSlcIixcIlRlbmp1ICgxMzc14oCTMTM3OSlcIixcIkvFjXJ5YWt1ICgxMzc54oCTMTM4MSlcIixcIkvFjXdhICgxMzgx4oCTMTM4NClcIixcIkdlbmNoxasgKDEzODTigJMxMzkyKVwiLFwiTWVpdG9rdSAoMTM4NOKAkzEzODcpXCIsXCJLYWtlaSAoMTM4N+KAkzEzODkpXCIsXCJLxY3FjSAoMTM4OeKAkzEzOTApXCIsXCJNZWl0b2t1ICgxMzkw4oCTMTM5NClcIixcIsWMZWkgKDEzOTTigJMxNDI4KVwiLFwiU2jFjWNoxY0gKDE0MjjigJMxNDI5KVwiLFwiRWlrecWNICgxNDI54oCTMTQ0MSlcIixcIktha2l0c3UgKDE0NDHigJMxNDQ0KVwiLFwiQnVu4oCZYW4gKDE0NDTigJMxNDQ5KVwiLFwiSMWNdG9rdSAoMTQ0OeKAkzE0NTIpXCIsXCJLecWNdG9rdSAoMTQ1MuKAkzE0NTUpXCIsXCJLxY1zaMWNICgxNDU14oCTMTQ1NylcIixcIkNoxY1yb2t1ICgxNDU34oCTMTQ2MClcIixcIkthbnNoxY0gKDE0NjDigJMxNDY2KVwiLFwiQnVuc2jFjSAoMTQ2NuKAkzE0NjcpXCIsXCLFjG5pbiAoMTQ2N+KAkzE0NjkpXCIsXCJCdW5tZWkgKDE0NjnigJMxNDg3KVwiLFwiQ2jFjWt5xY0gKDE0ODfigJMxNDg5KVwiLFwiRW50b2t1ICgxNDg54oCTMTQ5MilcIixcIk1lacWNICgxNDky4oCTMTUwMSlcIixcIkJ1bmtpICgxNTAx4oCTMTUwNClcIixcIkVpc2jFjSAoMTUwNOKAkzE1MjEpXCIsXCJUYWllaSAoMTUyMeKAkzE1MjgpXCIsXCJLecWNcm9rdSAoMTUyOOKAkzE1MzIpXCIsXCJUZW5idW4gKDE1MzLigJMxNTU1KVwiLFwiS8WNamkgKDE1NTXigJMxNTU4KVwiLFwiRWlyb2t1ICgxNTU44oCTMTU3MClcIixcIkdlbmtpICgxNTcw4oCTMTU3MylcIixcIlRlbnNoxY0gKDE1NzPigJMxNTkyKVwiLFwiQnVucm9rdSAoMTU5MuKAkzE1OTYpXCIsXCJLZWljaMWNICgxNTk24oCTMTYxNSlcIixcIkdlbm5hICgxNjE14oCTMTYyNClcIixcIkthbuKAmWVpICgxNjI04oCTMTY0NClcIixcIlNoxY1obyAoMTY0NOKAkzE2NDgpXCIsXCJLZWlhbiAoMTY0OOKAkzE2NTIpXCIsXCJKxY3FjSAoMTY1MuKAkzE2NTUpXCIsXCJNZWlyZWtpICgxNjU14oCTMTY1OClcIixcIk1hbmppICgxNjU44oCTMTY2MSlcIixcIkthbmJ1biAoMTY2MeKAkzE2NzMpXCIsXCJFbnDFjSAoMTY3M+KAkzE2ODEpXCIsXCJUZW5uYSAoMTY4MeKAkzE2ODQpXCIsXCJKxY1recWNICgxNjg04oCTMTY4OClcIixcIkdlbnJva3UgKDE2ODjigJMxNzA0KVwiLFwiSMWNZWkgKDE3MDTigJMxNzExKVwiLFwiU2jFjXRva3UgKDE3MTHigJMxNzE2KVwiLFwiS3nFjWjFjSAoMTcxNuKAkzE3MzYpXCIsXCJHZW5idW4gKDE3MzbigJMxNzQxKVwiLFwiS2FucMWNICgxNzQx4oCTMTc0NClcIixcIkVua3nFjSAoMTc0NOKAkzE3NDgpXCIsXCJLYW7igJllbiAoMTc0OOKAkzE3NTEpXCIsXCJIxY1yZWtpICgxNzUx4oCTMTc2NClcIixcIk1laXdhICgxNzY04oCTMTc3MilcIixcIkFu4oCZZWkgKDE3NzLigJMxNzgxKVwiLFwiVGVubWVpICgxNzgx4oCTMTc4OSlcIixcIkthbnNlaSAoMTc4OeKAkzE4MDEpXCIsXCJLecWNd2EgKDE4MDHigJMxODA0KVwiLFwiQnVua2EgKDE4MDTigJMxODE4KVwiLFwiQnVuc2VpICgxODE44oCTMTgzMClcIixcIlRlbnDFjSAoMTgzMOKAkzE4NDQpXCIsXCJLxY1rYSAoMTg0NOKAkzE4NDgpXCIsXCJLYWVpICgxODQ44oCTMTg1NClcIixcIkFuc2VpICgxODU04oCTMTg2MClcIixcIk1hbuKAmWVuICgxODYw4oCTMTg2MSlcIixcIkJ1bmt5xasgKDE4NjHigJMxODY0KVwiLFwiR2VuamkgKDE4NjTigJMxODY1KVwiLFwiS2VpxY0gKDE4NjXigJMxODY4KVwiLFwiTWVpamlcIixcIlRhaXNoxY1cIixcIlNoxY13YVwiLFwiSGVpc2VpXCJdLGxvbmc6W1wiVGFpa2EgKDY0NeKAkzY1MClcIixcIkhha3VjaGkgKDY1MOKAkzY3MSlcIixcIkhha3VoxY0gKDY3MuKAkzY4NilcIixcIlNodWNoxY0gKDY4NuKAkzcwMSlcIixcIlRhaWjFjSAoNzAx4oCTNzA0KVwiLFwiS2VpdW4gKDcwNOKAkzcwOClcIixcIldhZMWNICg3MDjigJM3MTUpXCIsXCJSZWlraSAoNzE14oCTNzE3KVwiLFwiWcWNcsWNICg3MTfigJM3MjQpXCIsXCJKaW5raSAoNzI04oCTNzI5KVwiLFwiVGVucHnFjSAoNzI54oCTNzQ5KVwiLFwiVGVucHnFjS1rYW1wxY0gKDc0OS03NDkpXCIsXCJUZW5wecWNLXNoxY1oxY0gKDc0OS03NTcpXCIsXCJUZW5wecWNLWjFjWppICg3NTctNzY1KVwiLFwiVGVucHnFjS1qaW5nbyAoNzY1LTc2NylcIixcIkppbmdvLWtlaXVuICg3NjctNzcwKVwiLFwiSMWNa2kgKDc3MOKAkzc4MClcIixcIlRlbi3FjSAoNzgxLTc4MilcIixcIkVucnlha3UgKDc4MuKAkzgwNilcIixcIkRhaWTFjSAoODA24oCTODEwKVwiLFwiS8WNbmluICg4MTDigJM4MjQpXCIsXCJUZW5jaMWNICg4MjTigJM4MzQpXCIsXCJKxY13YSAoODM04oCTODQ4KVwiLFwiS2FqxY0gKDg0OOKAkzg1MSlcIixcIk5pbmp1ICg4NTHigJM4NTQpXCIsXCJTYWlrxY0gKDg1NOKAkzg1NylcIixcIlRlbi1hbiAoODU3LTg1OSlcIixcIkrFjWdhbiAoODU54oCTODc3KVwiLFwiR2FuZ3nFjSAoODc34oCTODg1KVwiLFwiTmlubmEgKDg4NeKAkzg4OSlcIixcIkthbnB5xY0gKDg4OeKAkzg5OClcIixcIlNoxY10YWkgKDg5OOKAkzkwMSlcIixcIkVuZ2kgKDkwMeKAkzkyMylcIixcIkVuY2jFjSAoOTIz4oCTOTMxKVwiLFwiSsWNaGVpICg5MzHigJM5MzgpXCIsXCJUZW5necWNICg5MzjigJM5NDcpXCIsXCJUZW5yeWFrdSAoOTQ34oCTOTU3KVwiLFwiVGVudG9rdSAoOTU34oCTOTYxKVwiLFwixYx3YSAoOTYx4oCTOTY0KVwiLFwiS8WNaMWNICg5NjTigJM5NjgpXCIsXCJBbm5hICg5NjjigJM5NzApXCIsXCJUZW5yb2t1ICg5NzDigJM5NzMpXCIsXCJUZW7igJllbiAoOTcz4oCTOTc2KVwiLFwiSsWNZ2VuICg5NzbigJM5NzgpXCIsXCJUZW5nZW4gKDk3OOKAkzk4MylcIixcIkVpa2FuICg5ODPigJM5ODUpXCIsXCJLYW5uYSAoOTg14oCTOTg3KVwiLFwiRWllbiAoOTg34oCTOTg5KVwiLFwiRWlzbyAoOTg54oCTOTkwKVwiLFwiU2jFjXJ5YWt1ICg5OTDigJM5OTUpXCIsXCJDaMWNdG9rdSAoOTk14oCTOTk5KVwiLFwiQ2jFjWjFjSAoOTk54oCTMTAwNClcIixcIkthbmvFjSAoMTAwNOKAkzEwMTIpXCIsXCJDaMWNd2EgKDEwMTLigJMxMDE3KVwiLFwiS2FubmluICgxMDE34oCTMTAyMSlcIixcIkppYW4gKDEwMjHigJMxMDI0KVwiLFwiTWFuanUgKDEwMjTigJMxMDI4KVwiLFwiQ2jFjWdlbiAoMTAyOOKAkzEwMzcpXCIsXCJDaMWNcnlha3UgKDEwMzfigJMxMDQwKVwiLFwiQ2jFjWt5xasgKDEwNDDigJMxMDQ0KVwiLFwiS2FudG9rdSAoMTA0NOKAkzEwNDYpXCIsXCJFaXNoxY0gKDEwNDbigJMxMDUzKVwiLFwiVGVuZ2kgKDEwNTPigJMxMDU4KVwiLFwiS8WNaGVpICgxMDU44oCTMTA2NSlcIixcIkppcnlha3UgKDEwNjXigJMxMDY5KVwiLFwiRW5recWrICgxMDY54oCTMTA3NClcIixcIlNoxY1obyAoMTA3NOKAkzEwNzcpXCIsXCJTaMWNcnlha3UgKDEwNzfigJMxMDgxKVwiLFwiRWloxY0gKDEwODHigJMxMDg0KVwiLFwixYx0b2t1ICgxMDg04oCTMTA4NylcIixcIkthbmppICgxMDg34oCTMTA5NClcIixcIkthaMWNICgxMDk04oCTMTA5NilcIixcIkVpY2jFjSAoMTA5NuKAkzEwOTcpXCIsXCJKxY10b2t1ICgxMDk34oCTMTA5OSlcIixcIkvFjXdhICgxMDk54oCTMTEwNClcIixcIkNoxY1qaSAoMTEwNOKAkzExMDYpXCIsXCJLYXNoxY0gKDExMDbigJMxMTA4KVwiLFwiVGVubmluICgxMTA44oCTMTExMClcIixcIlRlbi1laSAoMTExMC0xMTEzKVwiLFwiRWlrecWrICgxMTEz4oCTMTExOClcIixcIkdlbuKAmWVpICgxMTE44oCTMTEyMClcIixcIkjFjWFuICgxMTIw4oCTMTEyNClcIixcIlRlbmppICgxMTI04oCTMTEyNilcIixcIkRhaWppICgxMTI24oCTMTEzMSlcIixcIlRlbnNoxY0gKDExMzHigJMxMTMyKVwiLFwiQ2jFjXNoxY0gKDExMzLigJMxMTM1KVwiLFwiSMWNZW4gKDExMzXigJMxMTQxKVwiLFwiRWlqaSAoMTE0MeKAkzExNDIpXCIsXCJLxY1qaSAoMTE0MuKAkzExNDQpXCIsXCJUZW7igJl5xY0gKDExNDTigJMxMTQ1KVwiLFwiS3nFq2FuICgxMTQ14oCTMTE1MSlcIixcIk5pbnBlaSAoMTE1MeKAkzExNTQpXCIsXCJLecWranUgKDExNTTigJMxMTU2KVwiLFwiSMWNZ2VuICgxMTU24oCTMTE1OSlcIixcIkhlaWppICgxMTU54oCTMTE2MClcIixcIkVpcnlha3UgKDExNjDigJMxMTYxKVwiLFwixYxobyAoMTE2MeKAkzExNjMpXCIsXCJDaMWNa2FuICgxMTYz4oCTMTE2NSlcIixcIkVpbWFuICgxMTY14oCTMTE2NilcIixcIk5pbuKAmWFuICgxMTY24oCTMTE2OSlcIixcIkthxY0gKDExNjnigJMxMTcxKVwiLFwiU2jFjWFuICgxMTcx4oCTMTE3NSlcIixcIkFuZ2VuICgxMTc14oCTMTE3NylcIixcIkppc2jFjSAoMTE3N+KAkzExODEpXCIsXCJZxY13YSAoMTE4MeKAkzExODIpXCIsXCJKdWVpICgxMTgy4oCTMTE4NClcIixcIkdlbnJ5YWt1ICgxMTg04oCTMTE4NSlcIixcIkJ1bmppICgxMTg14oCTMTE5MClcIixcIktlbmt5xasgKDExOTDigJMxMTk5KVwiLFwiU2jFjWppICgxMTk54oCTMTIwMSlcIixcIktlbm5pbiAoMTIwMeKAkzEyMDQpXCIsXCJHZW5recWrICgxMjA04oCTMTIwNilcIixcIktlbuKAmWVpICgxMjA24oCTMTIwNylcIixcIkrFjWdlbiAoMTIwN+KAkzEyMTEpXCIsXCJLZW5yeWFrdSAoMTIxMeKAkzEyMTMpXCIsXCJLZW5wxY0gKDEyMTPigJMxMjE5KVwiLFwiSsWNa3nFqyAoMTIxOeKAkzEyMjIpXCIsXCJKxY3FjSAoMTIyMuKAkzEyMjQpXCIsXCJHZW5uaW4gKDEyMjTigJMxMjI1KVwiLFwiS2Fyb2t1ICgxMjI14oCTMTIyNylcIixcIkFudGVpICgxMjI34oCTMTIyOSlcIixcIkthbmtpICgxMjI54oCTMTIzMilcIixcIkrFjWVpICgxMjMy4oCTMTIzMylcIixcIlRlbnB1a3UgKDEyMzPigJMxMjM0KVwiLFwiQnVucnlha3UgKDEyMzTigJMxMjM1KVwiLFwiS2F0ZWkgKDEyMzXigJMxMjM4KVwiLFwiUnlha3VuaW4gKDEyMzjigJMxMjM5KVwiLFwiRW7igJnFjSAoMTIzOeKAkzEyNDApXCIsXCJOaW5qaSAoMTI0MOKAkzEyNDMpXCIsXCJLYW5nZW4gKDEyNDPigJMxMjQ3KVwiLFwiSMWNamkgKDEyNDfigJMxMjQ5KVwiLFwiS2VuY2jFjSAoMTI0OeKAkzEyNTYpXCIsXCJLxY1nZW4gKDEyNTbigJMxMjU3KVwiLFwiU2jFjWthICgxMjU34oCTMTI1OSlcIixcIlNoxY1nZW4gKDEyNTnigJMxMjYwKVwiLFwiQnVu4oCZxY0gKDEyNjDigJMxMjYxKVwiLFwiS8WNY2jFjSAoMTI2MeKAkzEyNjQpXCIsXCJCdW7igJllaSAoMTI2NOKAkzEyNzUpXCIsXCJLZW5qaSAoMTI3NeKAkzEyNzgpXCIsXCJLxY1hbiAoMTI3OOKAkzEyODgpXCIsXCJTaMWNxY0gKDEyODjigJMxMjkzKVwiLFwiRWluaW4gKDEyOTPigJMxMjk5KVwiLFwiU2jFjWFuICgxMjk54oCTMTMwMilcIixcIktlbmdlbiAoMTMwMuKAkzEzMDMpXCIsXCJLYWdlbiAoMTMwM+KAkzEzMDYpXCIsXCJUb2t1amkgKDEzMDbigJMxMzA4KVwiLFwiRW5recWNICgxMzA44oCTMTMxMSlcIixcIsWMY2jFjSAoMTMxMeKAkzEzMTIpXCIsXCJTaMWNd2EgKDEzMTLigJMxMzE3KVwiLFwiQnVucMWNICgxMzE34oCTMTMxOSlcIixcIkdlbsWNICgxMzE54oCTMTMyMSlcIixcIkdlbmvFjSAoMTMyMeKAkzEzMjQpXCIsXCJTaMWNY2jFqyAoMTMyNOKAkzEzMjYpXCIsXCJLYXJ5YWt1ICgxMzI24oCTMTMyOSlcIixcIkdlbnRva3UgKDEzMjnigJMxMzMxKVwiLFwiR2Vua8WNICgxMzMx4oCTMTMzNClcIixcIktlbm11ICgxMzM04oCTMTMzNilcIixcIkVuZ2VuICgxMzM24oCTMTM0MClcIixcIkvFjWtva3UgKDEzNDDigJMxMzQ2KVwiLFwiU2jFjWhlaSAoMTM0NuKAkzEzNzApXCIsXCJLZW50b2t1ICgxMzcw4oCTMTM3MilcIixcIkJ1bmNoxasgKDEzNzLigJMxMzc1KVwiLFwiVGVuanUgKDEzNzXigJMxMzc5KVwiLFwiS8WNcnlha3UgKDEzNznigJMxMzgxKVwiLFwiS8WNd2EgKDEzODHigJMxMzg0KVwiLFwiR2VuY2jFqyAoMTM4NOKAkzEzOTIpXCIsXCJNZWl0b2t1ICgxMzg04oCTMTM4NylcIixcIktha2VpICgxMzg34oCTMTM4OSlcIixcIkvFjcWNICgxMzg54oCTMTM5MClcIixcIk1laXRva3UgKDEzOTDigJMxMzk0KVwiLFwixYxlaSAoMTM5NOKAkzE0MjgpXCIsXCJTaMWNY2jFjSAoMTQyOOKAkzE0MjkpXCIsXCJFaWt5xY0gKDE0MjnigJMxNDQxKVwiLFwiS2FraXRzdSAoMTQ0MeKAkzE0NDQpXCIsXCJCdW7igJlhbiAoMTQ0NOKAkzE0NDkpXCIsXCJIxY10b2t1ICgxNDQ54oCTMTQ1MilcIixcIkt5xY10b2t1ICgxNDUy4oCTMTQ1NSlcIixcIkvFjXNoxY0gKDE0NTXigJMxNDU3KVwiLFwiQ2jFjXJva3UgKDE0NTfigJMxNDYwKVwiLFwiS2Fuc2jFjSAoMTQ2MOKAkzE0NjYpXCIsXCJCdW5zaMWNICgxNDY24oCTMTQ2NylcIixcIsWMbmluICgxNDY34oCTMTQ2OSlcIixcIkJ1bm1laSAoMTQ2OeKAkzE0ODcpXCIsXCJDaMWNa3nFjSAoMTQ4N+KAkzE0ODkpXCIsXCJFbnRva3UgKDE0ODnigJMxNDkyKVwiLFwiTWVpxY0gKDE0OTLigJMxNTAxKVwiLFwiQnVua2kgKDE1MDHigJMxNTA0KVwiLFwiRWlzaMWNICgxNTA04oCTMTUyMSlcIixcIlRhaWVpICgxNTIx4oCTMTUyOClcIixcIkt5xY1yb2t1ICgxNTI44oCTMTUzMilcIixcIlRlbmJ1biAoMTUzMuKAkzE1NTUpXCIsXCJLxY1qaSAoMTU1NeKAkzE1NTgpXCIsXCJFaXJva3UgKDE1NTjigJMxNTcwKVwiLFwiR2Vua2kgKDE1NzDigJMxNTczKVwiLFwiVGVuc2jFjSAoMTU3M+KAkzE1OTIpXCIsXCJCdW5yb2t1ICgxNTky4oCTMTU5NilcIixcIktlaWNoxY0gKDE1OTbigJMxNjE1KVwiLFwiR2VubmEgKDE2MTXigJMxNjI0KVwiLFwiS2Fu4oCZZWkgKDE2MjTigJMxNjQ0KVwiLFwiU2jFjWhvICgxNjQ04oCTMTY0OClcIixcIktlaWFuICgxNjQ44oCTMTY1MilcIixcIkrFjcWNICgxNjUy4oCTMTY1NSlcIixcIk1laXJla2kgKDE2NTXigJMxNjU4KVwiLFwiTWFuamkgKDE2NTjigJMxNjYxKVwiLFwiS2FuYnVuICgxNjYx4oCTMTY3MylcIixcIkVucMWNICgxNjcz4oCTMTY4MSlcIixcIlRlbm5hICgxNjgx4oCTMTY4NClcIixcIkrFjWt5xY0gKDE2ODTigJMxNjg4KVwiLFwiR2Vucm9rdSAoMTY4OOKAkzE3MDQpXCIsXCJIxY1laSAoMTcwNOKAkzE3MTEpXCIsXCJTaMWNdG9rdSAoMTcxMeKAkzE3MTYpXCIsXCJLecWNaMWNICgxNzE24oCTMTczNilcIixcIkdlbmJ1biAoMTczNuKAkzE3NDEpXCIsXCJLYW5wxY0gKDE3NDHigJMxNzQ0KVwiLFwiRW5recWNICgxNzQ04oCTMTc0OClcIixcIkthbuKAmWVuICgxNzQ44oCTMTc1MSlcIixcIkjFjXJla2kgKDE3NTHigJMxNzY0KVwiLFwiTWVpd2EgKDE3NjTigJMxNzcyKVwiLFwiQW7igJllaSAoMTc3MuKAkzE3ODEpXCIsXCJUZW5tZWkgKDE3ODHigJMxNzg5KVwiLFwiS2Fuc2VpICgxNzg54oCTMTgwMSlcIixcIkt5xY13YSAoMTgwMeKAkzE4MDQpXCIsXCJCdW5rYSAoMTgwNOKAkzE4MTgpXCIsXCJCdW5zZWkgKDE4MTjigJMxODMwKVwiLFwiVGVucMWNICgxODMw4oCTMTg0NClcIixcIkvFjWthICgxODQ04oCTMTg0OClcIixcIkthZWkgKDE4NDjigJMxODU0KVwiLFwiQW5zZWkgKDE4NTTigJMxODYwKVwiLFwiTWFu4oCZZW4gKDE4NjDigJMxODYxKVwiLFwiQnVua3nFqyAoMTg2MeKAkzE4NjQpXCIsXCJHZW5qaSAoMTg2NOKAkzE4NjUpXCIsXCJLZWnFjSAoMTg2NeKAkzE4NjgpXCIsXCJNZWlqaVwiLFwiVGFpc2jFjVwiLFwiU2jFjXdhXCIsXCJIZWlzZWlcIl19LGRheVBlcmlvZHM6e2FtOlwiYS4gbS5cIixwbTpcInAuIG0uXCJ9fSxwZXJzaWFuOnttb250aHM6e25hcnJvdzpbXCIxXCIsXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCIxMFwiLFwiMTFcIixcIjEyXCJdLHNob3J0OltcIkZhcnZhcmRpblwiLFwiT3JkaWJlaGVzaHRcIixcIktob3JkYWRcIixcIlRpclwiLFwiTW9yZGFkXCIsXCJTaGFocml2YXJcIixcIk1laHJcIixcIkFiYW5cIixcIkF6YXJcIixcIkRleVwiLFwiQmFobWFuXCIsXCJFc2ZhbmRcIl0sbG9uZzpbXCJGYXJ2YXJkaW5cIixcIk9yZGliZWhlc2h0XCIsXCJLaG9yZGFkXCIsXCJUaXJcIixcIk1vcmRhZFwiLFwiU2hhaHJpdmFyXCIsXCJNZWhyXCIsXCJBYmFuXCIsXCJBemFyXCIsXCJEZXlcIixcIkJhaG1hblwiLFwiRXNmYW5kXCJdfSxkYXlzOntuYXJyb3c6W1wiRFwiLFwiTFwiLFwiTVwiLFwiWFwiLFwiSlwiLFwiVlwiLFwiU1wiXSxzaG9ydDpbXCJkb20uXCIsXCJsdW4uXCIsXCJtYXIuXCIsXCJtacOpLlwiLFwianVlLlwiLFwidmllLlwiLFwic8OhYi5cIl0sbG9uZzpbXCJkb21pbmdvXCIsXCJsdW5lc1wiLFwibWFydGVzXCIsXCJtacOpcmNvbGVzXCIsXCJqdWV2ZXNcIixcInZpZXJuZXNcIixcInPDoWJhZG9cIl19LGVyYXM6e25hcnJvdzpbXCJBUFwiXSxzaG9ydDpbXCJBUFwiXSxsb25nOltcIkFQXCJdfSxkYXlQZXJpb2RzOnthbTpcImEuIG0uXCIscG06XCJwLiBtLlwifX0scm9jOnttb250aHM6e25hcnJvdzpbXCJFXCIsXCJGXCIsXCJNXCIsXCJBXCIsXCJNXCIsXCJKXCIsXCJKXCIsXCJBXCIsXCJTXCIsXCJPXCIsXCJOXCIsXCJEXCJdLHNob3J0OltcImVuZS5cIixcImZlYi5cIixcIm1hci5cIixcImFici5cIixcIm1heS5cIixcImp1bi5cIixcImp1bC5cIixcImFnby5cIixcInNlcHQuXCIsXCJvY3QuXCIsXCJub3YuXCIsXCJkaWMuXCJdLGxvbmc6W1wiZW5lcm9cIixcImZlYnJlcm9cIixcIm1hcnpvXCIsXCJhYnJpbFwiLFwibWF5b1wiLFwianVuaW9cIixcImp1bGlvXCIsXCJhZ29zdG9cIixcInNlcHRpZW1icmVcIixcIm9jdHVicmVcIixcIm5vdmllbWJyZVwiLFwiZGljaWVtYnJlXCJdfSxkYXlzOntuYXJyb3c6W1wiRFwiLFwiTFwiLFwiTVwiLFwiWFwiLFwiSlwiLFwiVlwiLFwiU1wiXSxzaG9ydDpbXCJkb20uXCIsXCJsdW4uXCIsXCJtYXIuXCIsXCJtacOpLlwiLFwianVlLlwiLFwidmllLlwiLFwic8OhYi5cIl0sbG9uZzpbXCJkb21pbmdvXCIsXCJsdW5lc1wiLFwibWFydGVzXCIsXCJtacOpcmNvbGVzXCIsXCJqdWV2ZXNcIixcInZpZXJuZXNcIixcInPDoWJhZG9cIl19LGVyYXM6e25hcnJvdzpbXCJhbnRlcyBkZSBSLk8uQy5cIixcIlIuTy5DLlwiXSxzaG9ydDpbXCJhbnRlcyBkZSBSLk8uQy5cIixcIlIuTy5DLlwiXSxsb25nOltcImFudGVzIGRlIFIuTy5DLlwiLFwiUi5PLkMuXCJdfSxkYXlQZXJpb2RzOnthbTpcImEuIG0uXCIscG06XCJwLiBtLlwifX19fSxudW1iZXI6e251OltcImxhdG5cIl0scGF0dGVybnM6e2RlY2ltYWw6e3Bvc2l0aXZlUGF0dGVybjpcIntudW1iZXJ9XCIsbmVnYXRpdmVQYXR0ZXJuOlwie21pbnVzU2lnbn17bnVtYmVyfVwifSxjdXJyZW5jeTp7cG9zaXRpdmVQYXR0ZXJuOlwie251bWJlcn3CoHtjdXJyZW5jeX1cIixuZWdhdGl2ZVBhdHRlcm46XCJ7bWludXNTaWdufXtudW1iZXJ9wqB7Y3VycmVuY3l9XCJ9LHBlcmNlbnQ6e3Bvc2l0aXZlUGF0dGVybjpcIntudW1iZXJ9wqB7cGVyY2VudFNpZ259XCIsbmVnYXRpdmVQYXR0ZXJuOlwie21pbnVzU2lnbn17bnVtYmVyfcKge3BlcmNlbnRTaWdufVwifX0sc3ltYm9sczp7bGF0bjp7ZGVjaW1hbDpcIixcIixncm91cDpcIi5cIixuYW46XCJOYU5cIixwbHVzU2lnbjpcIitcIixtaW51c1NpZ246XCItXCIscGVyY2VudFNpZ246XCIlXCIsaW5maW5pdHk6XCLiiJ5cIn19LGN1cnJlbmNpZXM6e0NBRDpcIkNBJFwiLEVTUDpcIuKCp1wiLEVVUjpcIuKCrFwiLFRIQjpcIuC4v1wiLFVTRDpcIiRcIixWTkQ6XCLigqtcIixYUEY6XCJDRlBGXCJ9fX0pOyIsIiAgLyogZ2xvYmFscyByZXF1aXJlLCBtb2R1bGUgKi9cblxuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gICAqL1xuXG4gIHZhciBwYXRodG9SZWdleHAgPSByZXF1aXJlKCdwYXRoLXRvLXJlZ2V4cCcpO1xuXG4gIC8qKlxuICAgKiBNb2R1bGUgZXhwb3J0cy5cbiAgICovXG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuXG4gIC8qKlxuICAgKiBEZXRlY3QgY2xpY2sgZXZlbnRcbiAgICovXG4gIHZhciBjbGlja0V2ZW50ID0gKCd1bmRlZmluZWQnICE9PSB0eXBlb2YgZG9jdW1lbnQpICYmIGRvY3VtZW50Lm9udG91Y2hzdGFydCA/ICd0b3VjaHN0YXJ0JyA6ICdjbGljayc7XG5cbiAgLyoqXG4gICAqIFRvIHdvcmsgcHJvcGVybHkgd2l0aCB0aGUgVVJMXG4gICAqIGhpc3RvcnkubG9jYXRpb24gZ2VuZXJhdGVkIHBvbHlmaWxsIGluIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXZvdGUvSFRNTDUtSGlzdG9yeS1BUElcbiAgICovXG5cbiAgdmFyIGxvY2F0aW9uID0gKCd1bmRlZmluZWQnICE9PSB0eXBlb2Ygd2luZG93KSAmJiAod2luZG93Lmhpc3RvcnkubG9jYXRpb24gfHwgd2luZG93LmxvY2F0aW9uKTtcblxuICAvKipcbiAgICogUGVyZm9ybSBpbml0aWFsIGRpc3BhdGNoLlxuICAgKi9cblxuICB2YXIgZGlzcGF0Y2ggPSB0cnVlO1xuXG5cbiAgLyoqXG4gICAqIERlY29kZSBVUkwgY29tcG9uZW50cyAocXVlcnkgc3RyaW5nLCBwYXRobmFtZSwgaGFzaCkuXG4gICAqIEFjY29tbW9kYXRlcyBib3RoIHJlZ3VsYXIgcGVyY2VudCBlbmNvZGluZyBhbmQgeC13d3ctZm9ybS11cmxlbmNvZGVkIGZvcm1hdC5cbiAgICovXG4gIHZhciBkZWNvZGVVUkxDb21wb25lbnRzID0gdHJ1ZTtcblxuICAvKipcbiAgICogQmFzZSBwYXRoLlxuICAgKi9cblxuICB2YXIgYmFzZSA9ICcnO1xuXG4gIC8qKlxuICAgKiBSdW5uaW5nIGZsYWcuXG4gICAqL1xuXG4gIHZhciBydW5uaW5nO1xuXG4gIC8qKlxuICAgKiBIYXNoQmFuZyBvcHRpb25cbiAgICovXG5cbiAgdmFyIGhhc2hiYW5nID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFByZXZpb3VzIGNvbnRleHQsIGZvciBjYXB0dXJpbmdcbiAgICogcGFnZSBleGl0IGV2ZW50cy5cbiAgICovXG5cbiAgdmFyIHByZXZDb250ZXh0O1xuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBgcGF0aGAgd2l0aCBjYWxsYmFjayBgZm4oKWAsXG4gICAqIG9yIHJvdXRlIGBwYXRoYCwgb3IgcmVkaXJlY3Rpb24sXG4gICAqIG9yIGBwYWdlLnN0YXJ0KClgLlxuICAgKlxuICAgKiAgIHBhZ2UoZm4pO1xuICAgKiAgIHBhZ2UoJyonLCBmbik7XG4gICAqICAgcGFnZSgnL3VzZXIvOmlkJywgbG9hZCwgdXNlcik7XG4gICAqICAgcGFnZSgnL3VzZXIvJyArIHVzZXIuaWQsIHsgc29tZTogJ3RoaW5nJyB9KTtcbiAgICogICBwYWdlKCcvdXNlci8nICsgdXNlci5pZCk7XG4gICAqICAgcGFnZSgnL2Zyb20nLCAnL3RvJylcbiAgICogICBwYWdlKCk7XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfCFGdW5jdGlvbnwhT2JqZWN0fSBwYXRoXG4gICAqIEBwYXJhbSB7RnVuY3Rpb249fSBmblxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBmdW5jdGlvbiBwYWdlKHBhdGgsIGZuKSB7XG4gICAgLy8gPGNhbGxiYWNrPlxuICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgcGF0aCkge1xuICAgICAgcmV0dXJuIHBhZ2UoJyonLCBwYXRoKTtcbiAgICB9XG5cbiAgICAvLyByb3V0ZSA8cGF0aD4gdG8gPGNhbGxiYWNrIC4uLj5cbiAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGZuKSB7XG4gICAgICB2YXIgcm91dGUgPSBuZXcgUm91dGUoLyoqIEB0eXBlIHtzdHJpbmd9ICovIChwYXRoKSk7XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICBwYWdlLmNhbGxiYWNrcy5wdXNoKHJvdXRlLm1pZGRsZXdhcmUoYXJndW1lbnRzW2ldKSk7XG4gICAgICB9XG4gICAgICAvLyBzaG93IDxwYXRoPiB3aXRoIFtzdGF0ZV1cbiAgICB9IGVsc2UgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgcGF0aCkge1xuICAgICAgcGFnZVsnc3RyaW5nJyA9PT0gdHlwZW9mIGZuID8gJ3JlZGlyZWN0JyA6ICdzaG93J10ocGF0aCwgZm4pO1xuICAgICAgLy8gc3RhcnQgW29wdGlvbnNdXG4gICAgfSBlbHNlIHtcbiAgICAgIHBhZ2Uuc3RhcnQocGF0aCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZ1bmN0aW9ucy5cbiAgICovXG5cbiAgcGFnZS5jYWxsYmFja3MgPSBbXTtcbiAgcGFnZS5leGl0cyA9IFtdO1xuXG4gIC8qKlxuICAgKiBDdXJyZW50IHBhdGggYmVpbmcgcHJvY2Vzc2VkXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBwYWdlLmN1cnJlbnQgPSAnJztcblxuICAvKipcbiAgICogTnVtYmVyIG9mIHBhZ2VzIG5hdmlnYXRlZCB0by5cbiAgICogQHR5cGUge251bWJlcn1cbiAgICpcbiAgICogICAgIHBhZ2UubGVuID09IDA7XG4gICAqICAgICBwYWdlKCcvbG9naW4nKTtcbiAgICogICAgIHBhZ2UubGVuID09IDE7XG4gICAqL1xuXG4gIHBhZ2UubGVuID0gMDtcblxuICAvKipcbiAgICogR2V0IG9yIHNldCBiYXNlcGF0aCB0byBgcGF0aGAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2UuYmFzZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICBpZiAoMCA9PT0gYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGJhc2U7XG4gICAgYmFzZSA9IHBhdGg7XG4gIH07XG5cbiAgLyoqXG4gICAqIEJpbmQgd2l0aCB0aGUgZ2l2ZW4gYG9wdGlvbnNgLlxuICAgKlxuICAgKiBPcHRpb25zOlxuICAgKlxuICAgKiAgICAtIGBjbGlja2AgYmluZCB0byBjbGljayBldmVudHMgW3RydWVdXG4gICAqICAgIC0gYHBvcHN0YXRlYCBiaW5kIHRvIHBvcHN0YXRlIFt0cnVlXVxuICAgKiAgICAtIGBkaXNwYXRjaGAgcGVyZm9ybSBpbml0aWFsIGRpc3BhdGNoIFt0cnVlXVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLnN0YXJ0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGlmIChydW5uaW5nKSByZXR1cm47XG4gICAgcnVubmluZyA9IHRydWU7XG4gICAgaWYgKGZhbHNlID09PSBvcHRpb25zLmRpc3BhdGNoKSBkaXNwYXRjaCA9IGZhbHNlO1xuICAgIGlmIChmYWxzZSA9PT0gb3B0aW9ucy5kZWNvZGVVUkxDb21wb25lbnRzKSBkZWNvZGVVUkxDb21wb25lbnRzID0gZmFsc2U7XG4gICAgaWYgKGZhbHNlICE9PSBvcHRpb25zLnBvcHN0YXRlKSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvbnBvcHN0YXRlLCBmYWxzZSk7XG4gICAgaWYgKGZhbHNlICE9PSBvcHRpb25zLmNsaWNrKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGNsaWNrRXZlbnQsIG9uY2xpY2ssIGZhbHNlKTtcbiAgICB9XG4gICAgaWYgKHRydWUgPT09IG9wdGlvbnMuaGFzaGJhbmcpIGhhc2hiYW5nID0gdHJ1ZTtcbiAgICBpZiAoIWRpc3BhdGNoKSByZXR1cm47XG4gICAgdmFyIHVybCA9IChoYXNoYmFuZyAmJiB+bG9jYXRpb24uaGFzaC5pbmRleE9mKCcjIScpKSA/IGxvY2F0aW9uLmhhc2guc3Vic3RyKDIpICsgbG9jYXRpb24uc2VhcmNoIDogbG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2ggKyBsb2NhdGlvbi5oYXNoO1xuICAgIHBhZ2UucmVwbGFjZSh1cmwsIG51bGwsIHRydWUsIGRpc3BhdGNoKTtcbiAgfTtcblxuICAvKipcbiAgICogVW5iaW5kIGNsaWNrIGFuZCBwb3BzdGF0ZSBldmVudCBoYW5kbGVycy5cbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFydW5uaW5nKSByZXR1cm47XG4gICAgcGFnZS5jdXJyZW50ID0gJyc7XG4gICAgcGFnZS5sZW4gPSAwO1xuICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGNsaWNrRXZlbnQsIG9uY2xpY2ssIGZhbHNlKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvbnBvcHN0YXRlLCBmYWxzZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNob3cgYHBhdGhgIHdpdGggb3B0aW9uYWwgYHN0YXRlYCBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gc3RhdGVcbiAgICogQHBhcmFtIHtib29sZWFuPX0gZGlzcGF0Y2hcbiAgICogQHBhcmFtIHtib29sZWFuPX0gcHVzaFxuICAgKiBAcmV0dXJuIHshQ29udGV4dH1cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5zaG93ID0gZnVuY3Rpb24ocGF0aCwgc3RhdGUsIGRpc3BhdGNoLCBwdXNoKSB7XG4gICAgdmFyIGN0eCA9IG5ldyBDb250ZXh0KHBhdGgsIHN0YXRlKTtcbiAgICBwYWdlLmN1cnJlbnQgPSBjdHgucGF0aDtcbiAgICBpZiAoZmFsc2UgIT09IGRpc3BhdGNoKSBwYWdlLmRpc3BhdGNoKGN0eCk7XG4gICAgaWYgKGZhbHNlICE9PSBjdHguaGFuZGxlZCAmJiBmYWxzZSAhPT0gcHVzaCkgY3R4LnB1c2hTdGF0ZSgpO1xuICAgIHJldHVybiBjdHg7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdvZXMgYmFjayBpbiB0aGUgaGlzdG9yeVxuICAgKiBCYWNrIHNob3VsZCBhbHdheXMgbGV0IHRoZSBjdXJyZW50IHJvdXRlIHB1c2ggc3RhdGUgYW5kIHRoZW4gZ28gYmFjay5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBmYWxsYmFjayBwYXRoIHRvIGdvIGJhY2sgaWYgbm8gbW9yZSBoaXN0b3J5IGV4aXN0cywgaWYgdW5kZWZpbmVkIGRlZmF1bHRzIHRvIHBhZ2UuYmFzZVxuICAgKiBAcGFyYW0ge09iamVjdD19IHN0YXRlXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2UuYmFjayA9IGZ1bmN0aW9uKHBhdGgsIHN0YXRlKSB7XG4gICAgaWYgKHBhZ2UubGVuID4gMCkge1xuICAgICAgLy8gdGhpcyBtYXkgbmVlZCBtb3JlIHRlc3RpbmcgdG8gc2VlIGlmIGFsbCBicm93c2Vyc1xuICAgICAgLy8gd2FpdCBmb3IgdGhlIG5leHQgdGljayB0byBnbyBiYWNrIGluIGhpc3RvcnlcbiAgICAgIGhpc3RvcnkuYmFjaygpO1xuICAgICAgcGFnZS5sZW4tLTtcbiAgICB9IGVsc2UgaWYgKHBhdGgpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHBhZ2Uuc2hvdyhwYXRoLCBzdGF0ZSk7XG4gICAgICB9KTtcbiAgICB9ZWxzZXtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHBhZ2Uuc2hvdyhiYXNlLCBzdGF0ZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgICogUmVnaXN0ZXIgcm91dGUgdG8gcmVkaXJlY3QgZnJvbSBvbmUgcGF0aCB0byBvdGhlclxuICAgKiBvciBqdXN0IHJlZGlyZWN0IHRvIGFub3RoZXIgcm91dGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZyb20gLSBpZiBwYXJhbSAndG8nIGlzIHVuZGVmaW5lZCByZWRpcmVjdHMgdG8gJ2Zyb20nXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gdG9cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG4gIHBhZ2UucmVkaXJlY3QgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICAgIC8vIERlZmluZSByb3V0ZSBmcm9tIGEgcGF0aCB0byBhbm90aGVyXG4gICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgZnJvbSAmJiAnc3RyaW5nJyA9PT0gdHlwZW9mIHRvKSB7XG4gICAgICBwYWdlKGZyb20sIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBwYWdlLnJlcGxhY2UoLyoqIEB0eXBlIHshc3RyaW5nfSAqLyAodG8pKTtcbiAgICAgICAgfSwgMCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBXYWl0IGZvciB0aGUgcHVzaCBzdGF0ZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFub3RoZXJcbiAgICBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBmcm9tICYmICd1bmRlZmluZWQnID09PSB0eXBlb2YgdG8pIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHBhZ2UucmVwbGFjZShmcm9tKTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmVwbGFjZSBgcGF0aGAgd2l0aCBvcHRpb25hbCBgc3RhdGVgIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3Q9fSBzdGF0ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBpbml0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IGRpc3BhdGNoXG4gICAqIEByZXR1cm4geyFDb250ZXh0fVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuXG4gIHBhZ2UucmVwbGFjZSA9IGZ1bmN0aW9uKHBhdGgsIHN0YXRlLCBpbml0LCBkaXNwYXRjaCkge1xuICAgIHZhciBjdHggPSBuZXcgQ29udGV4dChwYXRoLCBzdGF0ZSk7XG4gICAgcGFnZS5jdXJyZW50ID0gY3R4LnBhdGg7XG4gICAgY3R4LmluaXQgPSBpbml0O1xuICAgIGN0eC5zYXZlKCk7IC8vIHNhdmUgYmVmb3JlIGRpc3BhdGNoaW5nLCB3aGljaCBtYXkgcmVkaXJlY3RcbiAgICBpZiAoZmFsc2UgIT09IGRpc3BhdGNoKSBwYWdlLmRpc3BhdGNoKGN0eCk7XG4gICAgcmV0dXJuIGN0eDtcbiAgfTtcblxuICAvKipcbiAgICogRGlzcGF0Y2ggdGhlIGdpdmVuIGBjdHhgLlxuICAgKlxuICAgKiBAcGFyYW0ge0NvbnRleHR9IGN0eFxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG4gIHBhZ2UuZGlzcGF0Y2ggPSBmdW5jdGlvbihjdHgpIHtcbiAgICB2YXIgcHJldiA9IHByZXZDb250ZXh0LFxuICAgICAgaSA9IDAsXG4gICAgICBqID0gMDtcblxuICAgIHByZXZDb250ZXh0ID0gY3R4O1xuXG4gICAgZnVuY3Rpb24gbmV4dEV4aXQoKSB7XG4gICAgICB2YXIgZm4gPSBwYWdlLmV4aXRzW2orK107XG4gICAgICBpZiAoIWZuKSByZXR1cm4gbmV4dEVudGVyKCk7XG4gICAgICBmbihwcmV2LCBuZXh0RXhpdCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbmV4dEVudGVyKCkge1xuICAgICAgdmFyIGZuID0gcGFnZS5jYWxsYmFja3NbaSsrXTtcblxuICAgICAgaWYgKGN0eC5wYXRoICE9PSBwYWdlLmN1cnJlbnQpIHtcbiAgICAgICAgY3R4LmhhbmRsZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCFmbikgcmV0dXJuIHVuaGFuZGxlZChjdHgpO1xuICAgICAgZm4oY3R4LCBuZXh0RW50ZXIpO1xuICAgIH1cblxuICAgIGlmIChwcmV2KSB7XG4gICAgICBuZXh0RXhpdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0RW50ZXIoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFVuaGFuZGxlZCBgY3R4YC4gV2hlbiBpdCdzIG5vdCB0aGUgaW5pdGlhbFxuICAgKiBwb3BzdGF0ZSB0aGVuIHJlZGlyZWN0LiBJZiB5b3Ugd2lzaCB0byBoYW5kbGVcbiAgICogNDA0cyBvbiB5b3VyIG93biB1c2UgYHBhZ2UoJyonLCBjYWxsYmFjaylgLlxuICAgKlxuICAgKiBAcGFyYW0ge0NvbnRleHR9IGN0eFxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIHVuaGFuZGxlZChjdHgpIHtcbiAgICBpZiAoY3R4LmhhbmRsZWQpIHJldHVybjtcbiAgICB2YXIgY3VycmVudDtcblxuICAgIGlmIChoYXNoYmFuZykge1xuICAgICAgY3VycmVudCA9IGJhc2UgKyBsb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMhJywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50ID0gbG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2g7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnQgPT09IGN0eC5jYW5vbmljYWxQYXRoKSByZXR1cm47XG4gICAgcGFnZS5zdG9wKCk7XG4gICAgY3R4LmhhbmRsZWQgPSBmYWxzZTtcbiAgICBsb2NhdGlvbi5ocmVmID0gY3R4LmNhbm9uaWNhbFBhdGg7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYW4gZXhpdCByb3V0ZSBvbiBgcGF0aGAgd2l0aFxuICAgKiBjYWxsYmFjayBgZm4oKWAsIHdoaWNoIHdpbGwgYmUgY2FsbGVkXG4gICAqIG9uIHRoZSBwcmV2aW91cyBjb250ZXh0IHdoZW4gYSBuZXdcbiAgICogcGFnZSBpcyB2aXNpdGVkLlxuICAgKi9cbiAgcGFnZS5leGl0ID0gZnVuY3Rpb24ocGF0aCwgZm4pIHtcbiAgICBpZiAodHlwZW9mIHBhdGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBwYWdlLmV4aXQoJyonLCBwYXRoKTtcbiAgICB9XG5cbiAgICB2YXIgcm91dGUgPSBuZXcgUm91dGUocGF0aCk7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHBhZ2UuZXhpdHMucHVzaChyb3V0ZS5taWRkbGV3YXJlKGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlIFVSTCBlbmNvZGluZyBmcm9tIHRoZSBnaXZlbiBgc3RyYC5cbiAgICogQWNjb21tb2RhdGVzIHdoaXRlc3BhY2UgaW4gYm90aCB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAgICogYW5kIHJlZ3VsYXIgcGVyY2VudC1lbmNvZGVkIGZvcm0uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWwgLSBVUkwgY29tcG9uZW50IHRvIGRlY29kZVxuICAgKi9cbiAgZnVuY3Rpb24gZGVjb2RlVVJMRW5jb2RlZFVSSUNvbXBvbmVudCh2YWwpIHtcbiAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ3N0cmluZycpIHsgcmV0dXJuIHZhbDsgfVxuICAgIHJldHVybiBkZWNvZGVVUkxDb21wb25lbnRzID8gZGVjb2RlVVJJQ29tcG9uZW50KHZhbC5yZXBsYWNlKC9cXCsvZywgJyAnKSkgOiB2YWw7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBhIG5ldyBcInJlcXVlc3RcIiBgQ29udGV4dGBcbiAgICogd2l0aCB0aGUgZ2l2ZW4gYHBhdGhgIGFuZCBvcHRpb25hbCBpbml0aWFsIGBzdGF0ZWAuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdD19IHN0YXRlXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIGZ1bmN0aW9uIENvbnRleHQocGF0aCwgc3RhdGUpIHtcbiAgICBpZiAoJy8nID09PSBwYXRoWzBdICYmIDAgIT09IHBhdGguaW5kZXhPZihiYXNlKSkgcGF0aCA9IGJhc2UgKyAoaGFzaGJhbmcgPyAnIyEnIDogJycpICsgcGF0aDtcbiAgICB2YXIgaSA9IHBhdGguaW5kZXhPZignPycpO1xuXG4gICAgdGhpcy5jYW5vbmljYWxQYXRoID0gcGF0aDtcbiAgICB0aGlzLnBhdGggPSBwYXRoLnJlcGxhY2UoYmFzZSwgJycpIHx8ICcvJztcbiAgICBpZiAoaGFzaGJhbmcpIHRoaXMucGF0aCA9IHRoaXMucGF0aC5yZXBsYWNlKCcjIScsICcnKSB8fCAnLyc7XG5cbiAgICB0aGlzLnRpdGxlID0gZG9jdW1lbnQudGl0bGU7XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlIHx8IHt9O1xuICAgIHRoaXMuc3RhdGUucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5xdWVyeXN0cmluZyA9IH5pID8gZGVjb2RlVVJMRW5jb2RlZFVSSUNvbXBvbmVudChwYXRoLnNsaWNlKGkgKyAxKSkgOiAnJztcbiAgICB0aGlzLnBhdGhuYW1lID0gZGVjb2RlVVJMRW5jb2RlZFVSSUNvbXBvbmVudCh+aSA/IHBhdGguc2xpY2UoMCwgaSkgOiBwYXRoKTtcbiAgICB0aGlzLnBhcmFtcyA9IHt9O1xuXG4gICAgLy8gZnJhZ21lbnRcbiAgICB0aGlzLmhhc2ggPSAnJztcbiAgICBpZiAoIWhhc2hiYW5nKSB7XG4gICAgICBpZiAoIX50aGlzLnBhdGguaW5kZXhPZignIycpKSByZXR1cm47XG4gICAgICB2YXIgcGFydHMgPSB0aGlzLnBhdGguc3BsaXQoJyMnKTtcbiAgICAgIHRoaXMucGF0aCA9IHBhcnRzWzBdO1xuICAgICAgdGhpcy5oYXNoID0gZGVjb2RlVVJMRW5jb2RlZFVSSUNvbXBvbmVudChwYXJ0c1sxXSkgfHwgJyc7XG4gICAgICB0aGlzLnF1ZXJ5c3RyaW5nID0gdGhpcy5xdWVyeXN0cmluZy5zcGxpdCgnIycpWzBdO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvc2UgYENvbnRleHRgLlxuICAgKi9cblxuICBwYWdlLkNvbnRleHQgPSBDb250ZXh0O1xuXG4gIC8qKlxuICAgKiBQdXNoIHN0YXRlLlxuICAgKlxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgQ29udGV4dC5wcm90b3R5cGUucHVzaFN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgcGFnZS5sZW4rKztcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSh0aGlzLnN0YXRlLCB0aGlzLnRpdGxlLCBoYXNoYmFuZyAmJiB0aGlzLnBhdGggIT09ICcvJyA/ICcjIScgKyB0aGlzLnBhdGggOiB0aGlzLmNhbm9uaWNhbFBhdGgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTYXZlIHRoZSBjb250ZXh0IHN0YXRlLlxuICAgKlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBDb250ZXh0LnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUodGhpcy5zdGF0ZSwgdGhpcy50aXRsZSwgaGFzaGJhbmcgJiYgdGhpcy5wYXRoICE9PSAnLycgPyAnIyEnICsgdGhpcy5wYXRoIDogdGhpcy5jYW5vbmljYWxQYXRoKTtcbiAgfTtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBgUm91dGVgIHdpdGggdGhlIGdpdmVuIEhUVFAgYHBhdGhgLFxuICAgKiBhbmQgYW4gYXJyYXkgb2YgYGNhbGxiYWNrc2AgYW5kIGBvcHRpb25zYC5cbiAgICpcbiAgICogT3B0aW9uczpcbiAgICpcbiAgICogICAtIGBzZW5zaXRpdmVgICAgIGVuYWJsZSBjYXNlLXNlbnNpdGl2ZSByb3V0ZXNcbiAgICogICAtIGBzdHJpY3RgICAgICAgIGVuYWJsZSBzdHJpY3QgbWF0Y2hpbmcgZm9yIHRyYWlsaW5nIHNsYXNoZXNcbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0aW9uc1xuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZnVuY3Rpb24gUm91dGUocGF0aCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHRoaXMucGF0aCA9IChwYXRoID09PSAnKicpID8gJyguKiknIDogcGF0aDtcbiAgICB0aGlzLm1ldGhvZCA9ICdHRVQnO1xuICAgIHRoaXMucmVnZXhwID0gcGF0aHRvUmVnZXhwKHRoaXMucGF0aCxcbiAgICAgIHRoaXMua2V5cyA9IFtdLFxuICAgICAgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRXhwb3NlIGBSb3V0ZWAuXG4gICAqL1xuXG4gIHBhZ2UuUm91dGUgPSBSb3V0ZTtcblxuICAvKipcbiAgICogUmV0dXJuIHJvdXRlIG1pZGRsZXdhcmUgd2l0aFxuICAgKiB0aGUgZ2l2ZW4gY2FsbGJhY2sgYGZuKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLm1pZGRsZXdhcmUgPSBmdW5jdGlvbihmbikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gZnVuY3Rpb24oY3R4LCBuZXh0KSB7XG4gICAgICBpZiAoc2VsZi5tYXRjaChjdHgucGF0aCwgY3R4LnBhcmFtcykpIHJldHVybiBmbihjdHgsIG5leHQpO1xuICAgICAgbmV4dCgpO1xuICAgIH07XG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoaXMgcm91dGUgbWF0Y2hlcyBgcGF0aGAsIGlmIHNvXG4gICAqIHBvcHVsYXRlIGBwYXJhbXNgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbihwYXRoLCBwYXJhbXMpIHtcbiAgICB2YXIga2V5cyA9IHRoaXMua2V5cyxcbiAgICAgIHFzSW5kZXggPSBwYXRoLmluZGV4T2YoJz8nKSxcbiAgICAgIHBhdGhuYW1lID0gfnFzSW5kZXggPyBwYXRoLnNsaWNlKDAsIHFzSW5kZXgpIDogcGF0aCxcbiAgICAgIG0gPSB0aGlzLnJlZ2V4cC5leGVjKGRlY29kZVVSSUNvbXBvbmVudChwYXRobmFtZSkpO1xuXG4gICAgaWYgKCFtKSByZXR1cm4gZmFsc2U7XG5cbiAgICBmb3IgKHZhciBpID0gMSwgbGVuID0gbS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgdmFyIGtleSA9IGtleXNbaSAtIDFdO1xuICAgICAgdmFyIHZhbCA9IGRlY29kZVVSTEVuY29kZWRVUklDb21wb25lbnQobVtpXSk7XG4gICAgICBpZiAodmFsICE9PSB1bmRlZmluZWQgfHwgIShoYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmFtcywga2V5Lm5hbWUpKSkge1xuICAgICAgICBwYXJhbXNba2V5Lm5hbWVdID0gdmFsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIEhhbmRsZSBcInBvcHVsYXRlXCIgZXZlbnRzLlxuICAgKi9cblxuICB2YXIgb25wb3BzdGF0ZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxvYWRlZCA9IGZhbHNlO1xuICAgIGlmICgndW5kZWZpbmVkJyA9PT0gdHlwZW9mIHdpbmRvdykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgbG9hZGVkID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBsb2FkZWQgPSB0cnVlO1xuICAgICAgICB9LCAwKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gb25wb3BzdGF0ZShlKSB7XG4gICAgICBpZiAoIWxvYWRlZCkgcmV0dXJuO1xuICAgICAgaWYgKGUuc3RhdGUpIHtcbiAgICAgICAgdmFyIHBhdGggPSBlLnN0YXRlLnBhdGg7XG4gICAgICAgIHBhZ2UucmVwbGFjZShwYXRoLCBlLnN0YXRlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhZ2Uuc2hvdyhsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLmhhc2gsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSkoKTtcbiAgLyoqXG4gICAqIEhhbmRsZSBcImNsaWNrXCIgZXZlbnRzLlxuICAgKi9cblxuICBmdW5jdGlvbiBvbmNsaWNrKGUpIHtcblxuICAgIGlmICgxICE9PSB3aGljaChlKSkgcmV0dXJuO1xuXG4gICAgaWYgKGUubWV0YUtleSB8fCBlLmN0cmxLZXkgfHwgZS5zaGlmdEtleSkgcmV0dXJuO1xuICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcblxuXG5cbiAgICAvLyBlbnN1cmUgbGlua1xuICAgIC8vIHVzZSBzaGFkb3cgZG9tIHdoZW4gYXZhaWxhYmxlXG4gICAgdmFyIGVsID0gZS5wYXRoID8gZS5wYXRoWzBdIDogZS50YXJnZXQ7XG4gICAgd2hpbGUgKGVsICYmICdBJyAhPT0gZWwubm9kZU5hbWUpIGVsID0gZWwucGFyZW50Tm9kZTtcbiAgICBpZiAoIWVsIHx8ICdBJyAhPT0gZWwubm9kZU5hbWUpIHJldHVybjtcblxuXG5cbiAgICAvLyBJZ25vcmUgaWYgdGFnIGhhc1xuICAgIC8vIDEuIFwiZG93bmxvYWRcIiBhdHRyaWJ1dGVcbiAgICAvLyAyLiByZWw9XCJleHRlcm5hbFwiIGF0dHJpYnV0ZVxuICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ2Rvd25sb2FkJykgfHwgZWwuZ2V0QXR0cmlidXRlKCdyZWwnKSA9PT0gJ2V4dGVybmFsJykgcmV0dXJuO1xuXG4gICAgLy8gZW5zdXJlIG5vbi1oYXNoIGZvciB0aGUgc2FtZSBwYXRoXG4gICAgdmFyIGxpbmsgPSBlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgICBpZiAoIWhhc2hiYW5nICYmIGVsLnBhdGhuYW1lID09PSBsb2NhdGlvbi5wYXRobmFtZSAmJiAoZWwuaGFzaCB8fCAnIycgPT09IGxpbmspKSByZXR1cm47XG5cblxuXG4gICAgLy8gQ2hlY2sgZm9yIG1haWx0bzogaW4gdGhlIGhyZWZcbiAgICBpZiAobGluayAmJiBsaW5rLmluZGV4T2YoJ21haWx0bzonKSA+IC0xKSByZXR1cm47XG5cbiAgICAvLyBjaGVjayB0YXJnZXRcbiAgICBpZiAoZWwudGFyZ2V0KSByZXR1cm47XG5cbiAgICAvLyB4LW9yaWdpblxuICAgIGlmICghc2FtZU9yaWdpbihlbC5ocmVmKSkgcmV0dXJuO1xuXG5cblxuICAgIC8vIHJlYnVpbGQgcGF0aFxuICAgIHZhciBwYXRoID0gZWwucGF0aG5hbWUgKyBlbC5zZWFyY2ggKyAoZWwuaGFzaCB8fCAnJyk7XG5cbiAgICAvLyBzdHJpcCBsZWFkaW5nIFwiL1tkcml2ZSBsZXR0ZXJdOlwiIG9uIE5XLmpzIG9uIFdpbmRvd3NcbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHBhdGgubWF0Y2goL15cXC9bYS16QS1aXTpcXC8vKSkge1xuICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXlxcL1thLXpBLVpdOlxcLy8sICcvJyk7XG4gICAgfVxuXG4gICAgLy8gc2FtZSBwYWdlXG4gICAgdmFyIG9yaWcgPSBwYXRoO1xuXG4gICAgaWYgKHBhdGguaW5kZXhPZihiYXNlKSA9PT0gMCkge1xuICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKGJhc2UubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBpZiAoaGFzaGJhbmcpIHBhdGggPSBwYXRoLnJlcGxhY2UoJyMhJywgJycpO1xuXG4gICAgaWYgKGJhc2UgJiYgb3JpZyA9PT0gcGF0aCkgcmV0dXJuO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHBhZ2Uuc2hvdyhvcmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCBidXR0b24uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHdoaWNoKGUpIHtcbiAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgcmV0dXJuIG51bGwgPT09IGUud2hpY2ggPyBlLmJ1dHRvbiA6IGUud2hpY2g7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYGhyZWZgIGlzIHRoZSBzYW1lIG9yaWdpbi5cbiAgICovXG5cbiAgZnVuY3Rpb24gc2FtZU9yaWdpbihocmVmKSB7XG4gICAgdmFyIG9yaWdpbiA9IGxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIGxvY2F0aW9uLmhvc3RuYW1lO1xuICAgIGlmIChsb2NhdGlvbi5wb3J0KSBvcmlnaW4gKz0gJzonICsgbG9jYXRpb24ucG9ydDtcbiAgICByZXR1cm4gKGhyZWYgJiYgKDAgPT09IGhyZWYuaW5kZXhPZihvcmlnaW4pKSk7XG4gIH1cblxuICBwYWdlLnNhbWVPcmlnaW4gPSBzYW1lT3JpZ2luO1xuIiwidmFyIGlzYXJyYXkgPSByZXF1aXJlKCdpc2FycmF5JylcblxuLyoqXG4gKiBFeHBvc2UgYHBhdGhUb1JlZ2V4cGAuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gcGF0aFRvUmVnZXhwXG5tb2R1bGUuZXhwb3J0cy5wYXJzZSA9IHBhcnNlXG5tb2R1bGUuZXhwb3J0cy5jb21waWxlID0gY29tcGlsZVxubW9kdWxlLmV4cG9ydHMudG9rZW5zVG9GdW5jdGlvbiA9IHRva2Vuc1RvRnVuY3Rpb25cbm1vZHVsZS5leHBvcnRzLnRva2Vuc1RvUmVnRXhwID0gdG9rZW5zVG9SZWdFeHBcblxuLyoqXG4gKiBUaGUgbWFpbiBwYXRoIG1hdGNoaW5nIHJlZ2V4cCB1dGlsaXR5LlxuICpcbiAqIEB0eXBlIHtSZWdFeHB9XG4gKi9cbnZhciBQQVRIX1JFR0VYUCA9IG5ldyBSZWdFeHAoW1xuICAvLyBNYXRjaCBlc2NhcGVkIGNoYXJhY3RlcnMgdGhhdCB3b3VsZCBvdGhlcndpc2UgYXBwZWFyIGluIGZ1dHVyZSBtYXRjaGVzLlxuICAvLyBUaGlzIGFsbG93cyB0aGUgdXNlciB0byBlc2NhcGUgc3BlY2lhbCBjaGFyYWN0ZXJzIHRoYXQgd29uJ3QgdHJhbnNmb3JtLlxuICAnKFxcXFxcXFxcLiknLFxuICAvLyBNYXRjaCBFeHByZXNzLXN0eWxlIHBhcmFtZXRlcnMgYW5kIHVuLW5hbWVkIHBhcmFtZXRlcnMgd2l0aCBhIHByZWZpeFxuICAvLyBhbmQgb3B0aW9uYWwgc3VmZml4ZXMuIE1hdGNoZXMgYXBwZWFyIGFzOlxuICAvL1xuICAvLyBcIi86dGVzdChcXFxcZCspP1wiID0+IFtcIi9cIiwgXCJ0ZXN0XCIsIFwiXFxkK1wiLCB1bmRlZmluZWQsIFwiP1wiLCB1bmRlZmluZWRdXG4gIC8vIFwiL3JvdXRlKFxcXFxkKylcIiAgPT4gW3VuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFwiXFxkK1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZF1cbiAgLy8gXCIvKlwiICAgICAgICAgICAgPT4gW1wiL1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFwiKlwiXVxuICAnKFtcXFxcLy5dKT8oPzooPzpcXFxcOihcXFxcdyspKD86XFxcXCgoKD86XFxcXFxcXFwufFteKCldKSspXFxcXCkpP3xcXFxcKCgoPzpcXFxcXFxcXC58W14oKV0pKylcXFxcKSkoWysqP10pP3woXFxcXCopKSdcbl0uam9pbignfCcpLCAnZycpXG5cbi8qKlxuICogUGFyc2UgYSBzdHJpbmcgZm9yIHRoZSByYXcgdG9rZW5zLlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuZnVuY3Rpb24gcGFyc2UgKHN0cikge1xuICB2YXIgdG9rZW5zID0gW11cbiAgdmFyIGtleSA9IDBcbiAgdmFyIGluZGV4ID0gMFxuICB2YXIgcGF0aCA9ICcnXG4gIHZhciByZXNcblxuICB3aGlsZSAoKHJlcyA9IFBBVEhfUkVHRVhQLmV4ZWMoc3RyKSkgIT0gbnVsbCkge1xuICAgIHZhciBtID0gcmVzWzBdXG4gICAgdmFyIGVzY2FwZWQgPSByZXNbMV1cbiAgICB2YXIgb2Zmc2V0ID0gcmVzLmluZGV4XG4gICAgcGF0aCArPSBzdHIuc2xpY2UoaW5kZXgsIG9mZnNldClcbiAgICBpbmRleCA9IG9mZnNldCArIG0ubGVuZ3RoXG5cbiAgICAvLyBJZ25vcmUgYWxyZWFkeSBlc2NhcGVkIHNlcXVlbmNlcy5cbiAgICBpZiAoZXNjYXBlZCkge1xuICAgICAgcGF0aCArPSBlc2NhcGVkWzFdXG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIC8vIFB1c2ggdGhlIGN1cnJlbnQgcGF0aCBvbnRvIHRoZSB0b2tlbnMuXG4gICAgaWYgKHBhdGgpIHtcbiAgICAgIHRva2Vucy5wdXNoKHBhdGgpXG4gICAgICBwYXRoID0gJydcbiAgICB9XG5cbiAgICB2YXIgcHJlZml4ID0gcmVzWzJdXG4gICAgdmFyIG5hbWUgPSByZXNbM11cbiAgICB2YXIgY2FwdHVyZSA9IHJlc1s0XVxuICAgIHZhciBncm91cCA9IHJlc1s1XVxuICAgIHZhciBzdWZmaXggPSByZXNbNl1cbiAgICB2YXIgYXN0ZXJpc2sgPSByZXNbN11cblxuICAgIHZhciByZXBlYXQgPSBzdWZmaXggPT09ICcrJyB8fCBzdWZmaXggPT09ICcqJ1xuICAgIHZhciBvcHRpb25hbCA9IHN1ZmZpeCA9PT0gJz8nIHx8IHN1ZmZpeCA9PT0gJyonXG4gICAgdmFyIGRlbGltaXRlciA9IHByZWZpeCB8fCAnLydcbiAgICB2YXIgcGF0dGVybiA9IGNhcHR1cmUgfHwgZ3JvdXAgfHwgKGFzdGVyaXNrID8gJy4qJyA6ICdbXicgKyBkZWxpbWl0ZXIgKyAnXSs/JylcblxuICAgIHRva2Vucy5wdXNoKHtcbiAgICAgIG5hbWU6IG5hbWUgfHwga2V5KyssXG4gICAgICBwcmVmaXg6IHByZWZpeCB8fCAnJyxcbiAgICAgIGRlbGltaXRlcjogZGVsaW1pdGVyLFxuICAgICAgb3B0aW9uYWw6IG9wdGlvbmFsLFxuICAgICAgcmVwZWF0OiByZXBlYXQsXG4gICAgICBwYXR0ZXJuOiBlc2NhcGVHcm91cChwYXR0ZXJuKVxuICAgIH0pXG4gIH1cblxuICAvLyBNYXRjaCBhbnkgY2hhcmFjdGVycyBzdGlsbCByZW1haW5pbmcuXG4gIGlmIChpbmRleCA8IHN0ci5sZW5ndGgpIHtcbiAgICBwYXRoICs9IHN0ci5zdWJzdHIoaW5kZXgpXG4gIH1cblxuICAvLyBJZiB0aGUgcGF0aCBleGlzdHMsIHB1c2ggaXQgb250byB0aGUgZW5kLlxuICBpZiAocGF0aCkge1xuICAgIHRva2Vucy5wdXNoKHBhdGgpXG4gIH1cblxuICByZXR1cm4gdG9rZW5zXG59XG5cbi8qKlxuICogQ29tcGlsZSBhIHN0cmluZyB0byBhIHRlbXBsYXRlIGZ1bmN0aW9uIGZvciB0aGUgcGF0aC5cbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgc3RyXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gY29tcGlsZSAoc3RyKSB7XG4gIHJldHVybiB0b2tlbnNUb0Z1bmN0aW9uKHBhcnNlKHN0cikpXG59XG5cbi8qKlxuICogRXhwb3NlIGEgbWV0aG9kIGZvciB0cmFuc2Zvcm1pbmcgdG9rZW5zIGludG8gdGhlIHBhdGggZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIHRva2Vuc1RvRnVuY3Rpb24gKHRva2Vucykge1xuICAvLyBDb21waWxlIGFsbCB0aGUgdG9rZW5zIGludG8gcmVnZXhwcy5cbiAgdmFyIG1hdGNoZXMgPSBuZXcgQXJyYXkodG9rZW5zLmxlbmd0aClcblxuICAvLyBDb21waWxlIGFsbCB0aGUgcGF0dGVybnMgYmVmb3JlIGNvbXBpbGF0aW9uLlxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0eXBlb2YgdG9rZW5zW2ldID09PSAnb2JqZWN0Jykge1xuICAgICAgbWF0Y2hlc1tpXSA9IG5ldyBSZWdFeHAoJ14nICsgdG9rZW5zW2ldLnBhdHRlcm4gKyAnJCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIgcGF0aCA9ICcnXG4gICAgdmFyIGRhdGEgPSBvYmogfHwge31cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdG9rZW4gPSB0b2tlbnNbaV1cblxuICAgICAgaWYgKHR5cGVvZiB0b2tlbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcGF0aCArPSB0b2tlblxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIHZhciB2YWx1ZSA9IGRhdGFbdG9rZW4ubmFtZV1cbiAgICAgIHZhciBzZWdtZW50XG5cbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgIGlmICh0b2tlbi5vcHRpb25hbCkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgXCInICsgdG9rZW4ubmFtZSArICdcIiB0byBiZSBkZWZpbmVkJylcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoaXNhcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgaWYgKCF0b2tlbi5yZXBlYXQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBcIicgKyB0b2tlbi5uYW1lICsgJ1wiIHRvIG5vdCByZXBlYXQsIGJ1dCByZWNlaXZlZCBcIicgKyB2YWx1ZSArICdcIicpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgaWYgKHRva2VuLm9wdGlvbmFsKSB7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBcIicgKyB0b2tlbi5uYW1lICsgJ1wiIHRvIG5vdCBiZSBlbXB0eScpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWx1ZS5sZW5ndGg7IGorKykge1xuICAgICAgICAgIHNlZ21lbnQgPSBlbmNvZGVVUklDb21wb25lbnQodmFsdWVbal0pXG5cbiAgICAgICAgICBpZiAoIW1hdGNoZXNbaV0udGVzdChzZWdtZW50KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYWxsIFwiJyArIHRva2VuLm5hbWUgKyAnXCIgdG8gbWF0Y2ggXCInICsgdG9rZW4ucGF0dGVybiArICdcIiwgYnV0IHJlY2VpdmVkIFwiJyArIHNlZ21lbnQgKyAnXCInKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHBhdGggKz0gKGogPT09IDAgPyB0b2tlbi5wcmVmaXggOiB0b2tlbi5kZWxpbWl0ZXIpICsgc2VnbWVudFxuICAgICAgICB9XG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgc2VnbWVudCA9IGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSlcblxuICAgICAgaWYgKCFtYXRjaGVzW2ldLnRlc3Qoc2VnbWVudCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgXCInICsgdG9rZW4ubmFtZSArICdcIiB0byBtYXRjaCBcIicgKyB0b2tlbi5wYXR0ZXJuICsgJ1wiLCBidXQgcmVjZWl2ZWQgXCInICsgc2VnbWVudCArICdcIicpXG4gICAgICB9XG5cbiAgICAgIHBhdGggKz0gdG9rZW4ucHJlZml4ICsgc2VnbWVudFxuICAgIH1cblxuICAgIHJldHVybiBwYXRoXG4gIH1cbn1cblxuLyoqXG4gKiBFc2NhcGUgYSByZWd1bGFyIGV4cHJlc3Npb24gc3RyaW5nLlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGVzY2FwZVN0cmluZyAoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFsuKyo/PV4hOiR7fSgpW1xcXXxcXC9dKS9nLCAnXFxcXCQxJylcbn1cblxuLyoqXG4gKiBFc2NhcGUgdGhlIGNhcHR1cmluZyBncm91cCBieSBlc2NhcGluZyBzcGVjaWFsIGNoYXJhY3RlcnMgYW5kIG1lYW5pbmcuXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBncm91cFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBlc2NhcGVHcm91cCAoZ3JvdXApIHtcbiAgcmV0dXJuIGdyb3VwLnJlcGxhY2UoLyhbPSE6JFxcLygpXSkvZywgJ1xcXFwkMScpXG59XG5cbi8qKlxuICogQXR0YWNoIHRoZSBrZXlzIGFzIGEgcHJvcGVydHkgb2YgdGhlIHJlZ2V4cC5cbiAqXG4gKiBAcGFyYW0gIHtSZWdFeHB9IHJlXG4gKiBAcGFyYW0gIHtBcnJheX0gIGtleXNcbiAqIEByZXR1cm4ge1JlZ0V4cH1cbiAqL1xuZnVuY3Rpb24gYXR0YWNoS2V5cyAocmUsIGtleXMpIHtcbiAgcmUua2V5cyA9IGtleXNcbiAgcmV0dXJuIHJlXG59XG5cbi8qKlxuICogR2V0IHRoZSBmbGFncyBmb3IgYSByZWdleHAgZnJvbSB0aGUgb3B0aW9ucy5cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZmxhZ3MgKG9wdGlvbnMpIHtcbiAgcmV0dXJuIG9wdGlvbnMuc2Vuc2l0aXZlID8gJycgOiAnaSdcbn1cblxuLyoqXG4gKiBQdWxsIG91dCBrZXlzIGZyb20gYSByZWdleHAuXG4gKlxuICogQHBhcmFtICB7UmVnRXhwfSBwYXRoXG4gKiBAcGFyYW0gIHtBcnJheX0gIGtleXNcbiAqIEByZXR1cm4ge1JlZ0V4cH1cbiAqL1xuZnVuY3Rpb24gcmVnZXhwVG9SZWdleHAgKHBhdGgsIGtleXMpIHtcbiAgLy8gVXNlIGEgbmVnYXRpdmUgbG9va2FoZWFkIHRvIG1hdGNoIG9ubHkgY2FwdHVyaW5nIGdyb3Vwcy5cbiAgdmFyIGdyb3VwcyA9IHBhdGguc291cmNlLm1hdGNoKC9cXCgoPyFcXD8pL2cpXG5cbiAgaWYgKGdyb3Vwcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXlzLnB1c2goe1xuICAgICAgICBuYW1lOiBpLFxuICAgICAgICBwcmVmaXg6IG51bGwsXG4gICAgICAgIGRlbGltaXRlcjogbnVsbCxcbiAgICAgICAgb3B0aW9uYWw6IGZhbHNlLFxuICAgICAgICByZXBlYXQ6IGZhbHNlLFxuICAgICAgICBwYXR0ZXJuOiBudWxsXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhdHRhY2hLZXlzKHBhdGgsIGtleXMpXG59XG5cbi8qKlxuICogVHJhbnNmb3JtIGFuIGFycmF5IGludG8gYSByZWdleHAuXG4gKlxuICogQHBhcmFtICB7QXJyYXl9ICBwYXRoXG4gKiBAcGFyYW0gIHtBcnJheX0gIGtleXNcbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5mdW5jdGlvbiBhcnJheVRvUmVnZXhwIChwYXRoLCBrZXlzLCBvcHRpb25zKSB7XG4gIHZhciBwYXJ0cyA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgcGFydHMucHVzaChwYXRoVG9SZWdleHAocGF0aFtpXSwga2V5cywgb3B0aW9ucykuc291cmNlKVxuICB9XG5cbiAgdmFyIHJlZ2V4cCA9IG5ldyBSZWdFeHAoJyg/OicgKyBwYXJ0cy5qb2luKCd8JykgKyAnKScsIGZsYWdzKG9wdGlvbnMpKVxuXG4gIHJldHVybiBhdHRhY2hLZXlzKHJlZ2V4cCwga2V5cylcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBwYXRoIHJlZ2V4cCBmcm9tIHN0cmluZyBpbnB1dC5cbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSAge0FycmF5fSAga2V5c1xuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKi9cbmZ1bmN0aW9uIHN0cmluZ1RvUmVnZXhwIChwYXRoLCBrZXlzLCBvcHRpb25zKSB7XG4gIHZhciB0b2tlbnMgPSBwYXJzZShwYXRoKVxuICB2YXIgcmUgPSB0b2tlbnNUb1JlZ0V4cCh0b2tlbnMsIG9wdGlvbnMpXG5cbiAgLy8gQXR0YWNoIGtleXMgYmFjayB0byB0aGUgcmVnZXhwLlxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0eXBlb2YgdG9rZW5zW2ldICE9PSAnc3RyaW5nJykge1xuICAgICAga2V5cy5wdXNoKHRva2Vuc1tpXSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXR0YWNoS2V5cyhyZSwga2V5cylcbn1cblxuLyoqXG4gKiBFeHBvc2UgYSBmdW5jdGlvbiBmb3IgdGFraW5nIHRva2VucyBhbmQgcmV0dXJuaW5nIGEgUmVnRXhwLlxuICpcbiAqIEBwYXJhbSAge0FycmF5fSAgdG9rZW5zXG4gKiBAcGFyYW0gIHtBcnJheX0gIGtleXNcbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5mdW5jdGlvbiB0b2tlbnNUb1JlZ0V4cCAodG9rZW5zLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG5cbiAgdmFyIHN0cmljdCA9IG9wdGlvbnMuc3RyaWN0XG4gIHZhciBlbmQgPSBvcHRpb25zLmVuZCAhPT0gZmFsc2VcbiAgdmFyIHJvdXRlID0gJydcbiAgdmFyIGxhc3RUb2tlbiA9IHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV1cbiAgdmFyIGVuZHNXaXRoU2xhc2ggPSB0eXBlb2YgbGFzdFRva2VuID09PSAnc3RyaW5nJyAmJiAvXFwvJC8udGVzdChsYXN0VG9rZW4pXG5cbiAgLy8gSXRlcmF0ZSBvdmVyIHRoZSB0b2tlbnMgYW5kIGNyZWF0ZSBvdXIgcmVnZXhwIHN0cmluZy5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdG9rZW4gPSB0b2tlbnNbaV1cblxuICAgIGlmICh0eXBlb2YgdG9rZW4gPT09ICdzdHJpbmcnKSB7XG4gICAgICByb3V0ZSArPSBlc2NhcGVTdHJpbmcodG9rZW4pXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBwcmVmaXggPSBlc2NhcGVTdHJpbmcodG9rZW4ucHJlZml4KVxuICAgICAgdmFyIGNhcHR1cmUgPSB0b2tlbi5wYXR0ZXJuXG5cbiAgICAgIGlmICh0b2tlbi5yZXBlYXQpIHtcbiAgICAgICAgY2FwdHVyZSArPSAnKD86JyArIHByZWZpeCArIGNhcHR1cmUgKyAnKSonXG4gICAgICB9XG5cbiAgICAgIGlmICh0b2tlbi5vcHRpb25hbCkge1xuICAgICAgICBpZiAocHJlZml4KSB7XG4gICAgICAgICAgY2FwdHVyZSA9ICcoPzonICsgcHJlZml4ICsgJygnICsgY2FwdHVyZSArICcpKT8nXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FwdHVyZSA9ICcoJyArIGNhcHR1cmUgKyAnKT8nXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhcHR1cmUgPSBwcmVmaXggKyAnKCcgKyBjYXB0dXJlICsgJyknXG4gICAgICB9XG5cbiAgICAgIHJvdXRlICs9IGNhcHR1cmVcbiAgICB9XG4gIH1cblxuICAvLyBJbiBub24tc3RyaWN0IG1vZGUgd2UgYWxsb3cgYSBzbGFzaCBhdCB0aGUgZW5kIG9mIG1hdGNoLiBJZiB0aGUgcGF0aCB0b1xuICAvLyBtYXRjaCBhbHJlYWR5IGVuZHMgd2l0aCBhIHNsYXNoLCB3ZSByZW1vdmUgaXQgZm9yIGNvbnNpc3RlbmN5LiBUaGUgc2xhc2hcbiAgLy8gaXMgdmFsaWQgYXQgdGhlIGVuZCBvZiBhIHBhdGggbWF0Y2gsIG5vdCBpbiB0aGUgbWlkZGxlLiBUaGlzIGlzIGltcG9ydGFudFxuICAvLyBpbiBub24tZW5kaW5nIG1vZGUsIHdoZXJlIFwiL3Rlc3QvXCIgc2hvdWxkbid0IG1hdGNoIFwiL3Rlc3QvL3JvdXRlXCIuXG4gIGlmICghc3RyaWN0KSB7XG4gICAgcm91dGUgPSAoZW5kc1dpdGhTbGFzaCA/IHJvdXRlLnNsaWNlKDAsIC0yKSA6IHJvdXRlKSArICcoPzpcXFxcLyg/PSQpKT8nXG4gIH1cblxuICBpZiAoZW5kKSB7XG4gICAgcm91dGUgKz0gJyQnXG4gIH0gZWxzZSB7XG4gICAgLy8gSW4gbm9uLWVuZGluZyBtb2RlLCB3ZSBuZWVkIHRoZSBjYXB0dXJpbmcgZ3JvdXBzIHRvIG1hdGNoIGFzIG11Y2ggYXNcbiAgICAvLyBwb3NzaWJsZSBieSB1c2luZyBhIHBvc2l0aXZlIGxvb2thaGVhZCB0byB0aGUgZW5kIG9yIG5leHQgcGF0aCBzZWdtZW50LlxuICAgIHJvdXRlICs9IHN0cmljdCAmJiBlbmRzV2l0aFNsYXNoID8gJycgOiAnKD89XFxcXC98JCknXG4gIH1cblxuICByZXR1cm4gbmV3IFJlZ0V4cCgnXicgKyByb3V0ZSwgZmxhZ3Mob3B0aW9ucykpXG59XG5cbi8qKlxuICogTm9ybWFsaXplIHRoZSBnaXZlbiBwYXRoIHN0cmluZywgcmV0dXJuaW5nIGEgcmVndWxhciBleHByZXNzaW9uLlxuICpcbiAqIEFuIGVtcHR5IGFycmF5IGNhbiBiZSBwYXNzZWQgaW4gZm9yIHRoZSBrZXlzLCB3aGljaCB3aWxsIGhvbGQgdGhlXG4gKiBwbGFjZWhvbGRlciBrZXkgZGVzY3JpcHRpb25zLiBGb3IgZXhhbXBsZSwgdXNpbmcgYC91c2VyLzppZGAsIGBrZXlzYCB3aWxsXG4gKiBjb250YWluIGBbeyBuYW1lOiAnaWQnLCBkZWxpbWl0ZXI6ICcvJywgb3B0aW9uYWw6IGZhbHNlLCByZXBlYXQ6IGZhbHNlIH1dYC5cbiAqXG4gKiBAcGFyYW0gIHsoU3RyaW5nfFJlZ0V4cHxBcnJheSl9IHBhdGhcbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICAgICAgICAgICAgW2tleXNdXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgICAgICAgIFtvcHRpb25zXVxuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5mdW5jdGlvbiBwYXRoVG9SZWdleHAgKHBhdGgsIGtleXMsIG9wdGlvbnMpIHtcbiAga2V5cyA9IGtleXMgfHwgW11cblxuICBpZiAoIWlzYXJyYXkoa2V5cykpIHtcbiAgICBvcHRpb25zID0ga2V5c1xuICAgIGtleXMgPSBbXVxuICB9IGVsc2UgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9XG4gIH1cblxuICBpZiAocGF0aCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgIHJldHVybiByZWdleHBUb1JlZ2V4cChwYXRoLCBrZXlzLCBvcHRpb25zKVxuICB9XG5cbiAgaWYgKGlzYXJyYXkocGF0aCkpIHtcbiAgICByZXR1cm4gYXJyYXlUb1JlZ2V4cChwYXRoLCBrZXlzLCBvcHRpb25zKVxuICB9XG5cbiAgcmV0dXJuIHN0cmluZ1RvUmVnZXhwKHBhdGgsIGtleXMsIG9wdGlvbnMpXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKGFycikge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgPT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCJcbnZhciBvcmlnID0gZG9jdW1lbnQudGl0bGU7XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHNldDtcblxuZnVuY3Rpb24gc2V0KHN0cikge1xuICB2YXIgaSA9IDE7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICBkb2N1bWVudC50aXRsZSA9IHN0ci5yZXBsYWNlKC8lW29zXS9nLCBmdW5jdGlvbihfKXtcbiAgICBzd2l0Y2ggKF8pIHtcbiAgICAgIGNhc2UgJyVvJzpcbiAgICAgICAgcmV0dXJuIG9yaWc7XG4gICAgICBjYXNlICclcyc6XG4gICAgICAgIHJldHVybiBhcmdzW2krK107XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0cy5yZXNldCA9IGZ1bmN0aW9uKCl7XG4gIHNldChvcmlnKTtcbn07XG4iLCJ2YXIgYmVsID0gcmVxdWlyZSgnYmVsJykgLy8gdHVybnMgdGVtcGxhdGUgdGFnIGludG8gRE9NIGVsZW1lbnRzXG52YXIgbW9ycGhkb20gPSByZXF1aXJlKCdtb3JwaGRvbScpIC8vIGVmZmljaWVudGx5IGRpZmZzICsgbW9ycGhzIHR3byBET00gZWxlbWVudHNcbnZhciBkZWZhdWx0RXZlbnRzID0gcmVxdWlyZSgnLi91cGRhdGUtZXZlbnRzLmpzJykgLy8gZGVmYXVsdCBldmVudHMgdG8gYmUgY29waWVkIHdoZW4gZG9tIGVsZW1lbnRzIHVwZGF0ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJlbFxuXG4vLyBUT0RPIG1vdmUgdGhpcyArIGRlZmF1bHRFdmVudHMgdG8gYSBuZXcgbW9kdWxlIG9uY2Ugd2UgcmVjZWl2ZSBtb3JlIGZlZWRiYWNrXG5tb2R1bGUuZXhwb3J0cy51cGRhdGUgPSBmdW5jdGlvbiAoZnJvbU5vZGUsIHRvTm9kZSwgb3B0cykge1xuICBpZiAoIW9wdHMpIG9wdHMgPSB7fVxuICBpZiAob3B0cy5ldmVudHMgIT09IGZhbHNlKSB7XG4gICAgaWYgKCFvcHRzLm9uQmVmb3JlTW9ycGhFbCkgb3B0cy5vbkJlZm9yZU1vcnBoRWwgPSBjb3BpZXJcbiAgfVxuXG4gIHJldHVybiBtb3JwaGRvbShmcm9tTm9kZSwgdG9Ob2RlLCBvcHRzKVxuXG4gIC8vIG1vcnBoZG9tIG9ubHkgY29waWVzIGF0dHJpYnV0ZXMuIHdlIGRlY2lkZWQgd2UgYWxzbyB3YW50ZWQgdG8gY29weSBldmVudHNcbiAgLy8gdGhhdCBjYW4gYmUgc2V0IHZpYSBhdHRyaWJ1dGVzXG4gIGZ1bmN0aW9uIGNvcGllciAoZiwgdCkge1xuICAgIC8vIGNvcHkgZXZlbnRzOlxuICAgIHZhciBldmVudHMgPSBvcHRzLmV2ZW50cyB8fCBkZWZhdWx0RXZlbnRzXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBldiA9IGV2ZW50c1tpXVxuICAgICAgaWYgKHRbZXZdKSB7IC8vIGlmIG5ldyBlbGVtZW50IGhhcyBhIHdoaXRlbGlzdGVkIGF0dHJpYnV0ZVxuICAgICAgICBmW2V2XSA9IHRbZXZdIC8vIHVwZGF0ZSBleGlzdGluZyBlbGVtZW50XG4gICAgICB9IGVsc2UgaWYgKGZbZXZdKSB7IC8vIGlmIGV4aXN0aW5nIGVsZW1lbnQgaGFzIGl0IGFuZCBuZXcgb25lIGRvZXNudFxuICAgICAgICBmW2V2XSA9IHVuZGVmaW5lZCAvLyByZW1vdmUgaXQgZnJvbSBleGlzdGluZyBlbGVtZW50XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGNvcHkgdmFsdWVzIGZvciBmb3JtIGVsZW1lbnRzXG4gICAgaWYgKGYubm9kZU5hbWUgPT09ICdJTlBVVCcgfHwgZi5ub2RlTmFtZSA9PT0gJ1RFWFRBUkVBJyB8fCBmLm5vZGVOQU1FID09PSAnU0VMRUNUJykge1xuICAgICAgaWYgKHQuZ2V0QXR0cmlidXRlKCd2YWx1ZScpID09PSBudWxsKSB0LnZhbHVlID0gZi52YWx1ZVxuICAgIH1cbiAgfVxufVxuIiwidmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnZ2xvYmFsL2RvY3VtZW50JylcbnZhciBoeXBlcnggPSByZXF1aXJlKCdoeXBlcngnKVxuXG52YXIgU1ZHTlMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnXG52YXIgQk9PTF9QUk9QUyA9IHtcbiAgYXV0b2ZvY3VzOiAxLFxuICBjaGVja2VkOiAxLFxuICBkZWZhdWx0Y2hlY2tlZDogMSxcbiAgZGlzYWJsZWQ6IDEsXG4gIGZvcm1ub3ZhbGlkYXRlOiAxLFxuICBpbmRldGVybWluYXRlOiAxLFxuICByZWFkb25seTogMSxcbiAgcmVxdWlyZWQ6IDEsXG4gIHdpbGx2YWxpZGF0ZTogMVxufVxudmFyIFNWR19UQUdTID0gW1xuICAnc3ZnJyxcbiAgJ2FsdEdseXBoJywgJ2FsdEdseXBoRGVmJywgJ2FsdEdseXBoSXRlbScsICdhbmltYXRlJywgJ2FuaW1hdGVDb2xvcicsXG4gICdhbmltYXRlTW90aW9uJywgJ2FuaW1hdGVUcmFuc2Zvcm0nLCAnY2lyY2xlJywgJ2NsaXBQYXRoJywgJ2NvbG9yLXByb2ZpbGUnLFxuICAnY3Vyc29yJywgJ2RlZnMnLCAnZGVzYycsICdlbGxpcHNlJywgJ2ZlQmxlbmQnLCAnZmVDb2xvck1hdHJpeCcsXG4gICdmZUNvbXBvbmVudFRyYW5zZmVyJywgJ2ZlQ29tcG9zaXRlJywgJ2ZlQ29udm9sdmVNYXRyaXgnLCAnZmVEaWZmdXNlTGlnaHRpbmcnLFxuICAnZmVEaXNwbGFjZW1lbnRNYXAnLCAnZmVEaXN0YW50TGlnaHQnLCAnZmVGbG9vZCcsICdmZUZ1bmNBJywgJ2ZlRnVuY0InLFxuICAnZmVGdW5jRycsICdmZUZ1bmNSJywgJ2ZlR2F1c3NpYW5CbHVyJywgJ2ZlSW1hZ2UnLCAnZmVNZXJnZScsICdmZU1lcmdlTm9kZScsXG4gICdmZU1vcnBob2xvZ3knLCAnZmVPZmZzZXQnLCAnZmVQb2ludExpZ2h0JywgJ2ZlU3BlY3VsYXJMaWdodGluZycsXG4gICdmZVNwb3RMaWdodCcsICdmZVRpbGUnLCAnZmVUdXJidWxlbmNlJywgJ2ZpbHRlcicsICdmb250JywgJ2ZvbnQtZmFjZScsXG4gICdmb250LWZhY2UtZm9ybWF0JywgJ2ZvbnQtZmFjZS1uYW1lJywgJ2ZvbnQtZmFjZS1zcmMnLCAnZm9udC1mYWNlLXVyaScsXG4gICdmb3JlaWduT2JqZWN0JywgJ2cnLCAnZ2x5cGgnLCAnZ2x5cGhSZWYnLCAnaGtlcm4nLCAnaW1hZ2UnLCAnbGluZScsXG4gICdsaW5lYXJHcmFkaWVudCcsICdtYXJrZXInLCAnbWFzaycsICdtZXRhZGF0YScsICdtaXNzaW5nLWdseXBoJywgJ21wYXRoJyxcbiAgJ3BhdGgnLCAncGF0dGVybicsICdwb2x5Z29uJywgJ3BvbHlsaW5lJywgJ3JhZGlhbEdyYWRpZW50JywgJ3JlY3QnLFxuICAnc2V0JywgJ3N0b3AnLCAnc3dpdGNoJywgJ3N5bWJvbCcsICd0ZXh0JywgJ3RleHRQYXRoJywgJ3RpdGxlJywgJ3RyZWYnLFxuICAndHNwYW4nLCAndXNlJywgJ3ZpZXcnLCAndmtlcm4nXG5dXG5cbmZ1bmN0aW9uIGJlbENyZWF0ZUVsZW1lbnQgKHRhZywgcHJvcHMsIGNoaWxkcmVuKSB7XG4gIHZhciBlbFxuXG4gIC8vIElmIGFuIHN2ZyB0YWcsIGl0IG5lZWRzIGEgbmFtZXNwYWNlXG4gIGlmIChTVkdfVEFHUy5pbmRleE9mKHRhZykgIT09IC0xKSB7XG4gICAgcHJvcHMubmFtZXNwYWNlID0gU1ZHTlNcbiAgfVxuXG4gIC8vIElmIHdlIGFyZSB1c2luZyBhIG5hbWVzcGFjZVxuICB2YXIgbnMgPSBmYWxzZVxuICBpZiAocHJvcHMubmFtZXNwYWNlKSB7XG4gICAgbnMgPSBwcm9wcy5uYW1lc3BhY2VcbiAgICBkZWxldGUgcHJvcHMubmFtZXNwYWNlXG4gIH1cblxuICAvLyBDcmVhdGUgdGhlIGVsZW1lbnRcbiAgaWYgKG5zKSB7XG4gICAgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIHRhZylcbiAgfSBlbHNlIHtcbiAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKVxuICB9XG5cbiAgLy8gQ3JlYXRlIHRoZSBwcm9wZXJ0aWVzXG4gIGZvciAodmFyIHAgaW4gcHJvcHMpIHtcbiAgICBpZiAocHJvcHMuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgIHZhciBrZXkgPSBwLnRvTG93ZXJDYXNlKClcbiAgICAgIHZhciB2YWwgPSBwcm9wc1twXVxuICAgICAgLy8gTm9ybWFsaXplIGNsYXNzTmFtZVxuICAgICAgaWYgKGtleSA9PT0gJ2NsYXNzbmFtZScpIHtcbiAgICAgICAga2V5ID0gJ2NsYXNzJ1xuICAgICAgICBwID0gJ2NsYXNzJ1xuICAgICAgfVxuICAgICAgLy8gSWYgYSBwcm9wZXJ0eSBpcyBib29sZWFuLCBzZXQgaXRzZWxmIHRvIHRoZSBrZXlcbiAgICAgIGlmIChCT09MX1BST1BTW2tleV0pIHtcbiAgICAgICAgaWYgKHZhbCA9PT0gJ3RydWUnKSB2YWwgPSBrZXlcbiAgICAgICAgZWxzZSBpZiAodmFsID09PSAnZmFsc2UnKSBjb250aW51ZVxuICAgICAgfVxuICAgICAgLy8gSWYgYSBwcm9wZXJ0eSBwcmVmZXJzIGJlaW5nIHNldCBkaXJlY3RseSB2cyBzZXRBdHRyaWJ1dGVcbiAgICAgIGlmIChrZXkuc2xpY2UoMCwgMikgPT09ICdvbicpIHtcbiAgICAgICAgZWxbcF0gPSB2YWxcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChucykge1xuICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsIHAsIHZhbClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUocCwgdmFsKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYXBwZW5kQ2hpbGQgKGNoaWxkcykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShjaGlsZHMpKSByZXR1cm5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5vZGUgPSBjaGlsZHNbaV1cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG5vZGUpKSB7XG4gICAgICAgIGFwcGVuZENoaWxkKG5vZGUpXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgdHlwZW9mIG5vZGUgPT09ICdib29sZWFuJyB8fFxuICAgICAgICBub2RlIGluc3RhbmNlb2YgRGF0ZSB8fFxuICAgICAgICBub2RlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLnRvU3RyaW5nKClcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAoZWwubGFzdENoaWxkICYmIGVsLmxhc3RDaGlsZC5ub2RlTmFtZSA9PT0gJyN0ZXh0Jykge1xuICAgICAgICAgIGVsLmxhc3RDaGlsZC5ub2RlVmFsdWUgKz0gbm9kZVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cbiAgICAgICAgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5vZGUpXG4gICAgICB9XG5cbiAgICAgIGlmIChub2RlICYmIG5vZGUubm9kZVR5cGUpIHtcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQobm9kZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYXBwZW5kQ2hpbGQoY2hpbGRyZW4pXG5cbiAgcmV0dXJuIGVsXG59XG5cbm1vZHVsZS5leHBvcnRzID0gaHlwZXJ4KGJlbENyZWF0ZUVsZW1lbnQpXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVFbGVtZW50ID0gYmVsQ3JlYXRlRWxlbWVudFxuIiwidmFyIHRvcExldmVsID0gdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOlxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDoge31cbnZhciBtaW5Eb2MgPSByZXF1aXJlKCdtaW4tZG9jdW1lbnQnKTtcblxuaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50O1xufSBlbHNlIHtcbiAgICB2YXIgZG9jY3kgPSB0b3BMZXZlbFsnX19HTE9CQUxfRE9DVU1FTlRfQ0FDSEVANCddO1xuXG4gICAgaWYgKCFkb2NjeSkge1xuICAgICAgICBkb2NjeSA9IHRvcExldmVsWydfX0dMT0JBTF9ET0NVTUVOVF9DQUNIRUA0J10gPSBtaW5Eb2M7XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBkb2NjeTtcbn1cbiIsInZhciBhdHRyVG9Qcm9wID0gcmVxdWlyZSgnaHlwZXJzY3JpcHQtYXR0cmlidXRlLXRvLXByb3BlcnR5JylcblxudmFyIFZBUiA9IDAsIFRFWFQgPSAxLCBPUEVOID0gMiwgQ0xPU0UgPSAzLCBBVFRSID0gNFxudmFyIEFUVFJfS0VZID0gNSwgQVRUUl9LRVlfVyA9IDZcbnZhciBBVFRSX1ZBTFVFX1cgPSA3LCBBVFRSX1ZBTFVFID0gOFxudmFyIEFUVFJfVkFMVUVfU1EgPSA5LCBBVFRSX1ZBTFVFX0RRID0gMTBcbnZhciBBVFRSX0VRID0gMTEsIEFUVFJfQlJFQUsgPSAxMlxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChoLCBvcHRzKSB7XG4gIGggPSBhdHRyVG9Qcm9wKGgpXG4gIGlmICghb3B0cykgb3B0cyA9IHt9XG4gIHZhciBjb25jYXQgPSBvcHRzLmNvbmNhdCB8fCBmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiBTdHJpbmcoYSkgKyBTdHJpbmcoYilcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoc3RyaW5ncykge1xuICAgIHZhciBzdGF0ZSA9IFRFWFQsIHJlZyA9ICcnXG4gICAgdmFyIGFyZ2xlbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICB2YXIgcGFydHMgPSBbXVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHJpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaSA8IGFyZ2xlbiAtIDEpIHtcbiAgICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1tpKzFdXG4gICAgICAgIHZhciBwID0gcGFyc2Uoc3RyaW5nc1tpXSlcbiAgICAgICAgdmFyIHhzdGF0ZSA9IHN0YXRlXG4gICAgICAgIGlmICh4c3RhdGUgPT09IEFUVFJfVkFMVUVfRFEpIHhzdGF0ZSA9IEFUVFJfVkFMVUVcbiAgICAgICAgaWYgKHhzdGF0ZSA9PT0gQVRUUl9WQUxVRV9TUSkgeHN0YXRlID0gQVRUUl9WQUxVRVxuICAgICAgICBpZiAoeHN0YXRlID09PSBBVFRSX1ZBTFVFX1cpIHhzdGF0ZSA9IEFUVFJfVkFMVUVcbiAgICAgICAgaWYgKHhzdGF0ZSA9PT0gQVRUUikgeHN0YXRlID0gQVRUUl9LRVlcbiAgICAgICAgcC5wdXNoKFsgVkFSLCB4c3RhdGUsIGFyZyBdKVxuICAgICAgICBwYXJ0cy5wdXNoLmFwcGx5KHBhcnRzLCBwKVxuICAgICAgfSBlbHNlIHBhcnRzLnB1c2guYXBwbHkocGFydHMsIHBhcnNlKHN0cmluZ3NbaV0pKVxuICAgIH1cblxuICAgIHZhciB0cmVlID0gW251bGwse30sW11dXG4gICAgdmFyIHN0YWNrID0gW1t0cmVlLC0xXV1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY3VyID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdWzBdXG4gICAgICB2YXIgcCA9IHBhcnRzW2ldLCBzID0gcFswXVxuICAgICAgaWYgKHMgPT09IE9QRU4gJiYgL15cXC8vLnRlc3QocFsxXSkpIHtcbiAgICAgICAgdmFyIGl4ID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdWzFdXG4gICAgICAgIGlmIChzdGFjay5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgc3RhY2sucG9wKClcbiAgICAgICAgICBzdGFja1tzdGFjay5sZW5ndGgtMV1bMF1bMl1baXhdID0gaChcbiAgICAgICAgICAgIGN1clswXSwgY3VyWzFdLCBjdXJbMl0ubGVuZ3RoID8gY3VyWzJdIDogdW5kZWZpbmVkXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHMgPT09IE9QRU4pIHtcbiAgICAgICAgdmFyIGMgPSBbcFsxXSx7fSxbXV1cbiAgICAgICAgY3VyWzJdLnB1c2goYylcbiAgICAgICAgc3RhY2sucHVzaChbYyxjdXJbMl0ubGVuZ3RoLTFdKVxuICAgICAgfSBlbHNlIGlmIChzID09PSBBVFRSX0tFWSB8fCAocyA9PT0gVkFSICYmIHBbMV0gPT09IEFUVFJfS0VZKSkge1xuICAgICAgICB2YXIga2V5ID0gJydcbiAgICAgICAgdmFyIGNvcHlLZXlcbiAgICAgICAgZm9yICg7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChwYXJ0c1tpXVswXSA9PT0gQVRUUl9LRVkpIHtcbiAgICAgICAgICAgIGtleSA9IGNvbmNhdChrZXksIHBhcnRzW2ldWzFdKVxuICAgICAgICAgIH0gZWxzZSBpZiAocGFydHNbaV1bMF0gPT09IFZBUiAmJiBwYXJ0c1tpXVsxXSA9PT0gQVRUUl9LRVkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcGFydHNbaV1bMl0gPT09ICdvYmplY3QnICYmICFrZXkpIHtcbiAgICAgICAgICAgICAgZm9yIChjb3B5S2V5IGluIHBhcnRzW2ldWzJdKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnRzW2ldWzJdLmhhc093blByb3BlcnR5KGNvcHlLZXkpICYmICFjdXJbMV1bY29weUtleV0pIHtcbiAgICAgICAgICAgICAgICAgIGN1clsxXVtjb3B5S2V5XSA9IHBhcnRzW2ldWzJdW2NvcHlLZXldXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBrZXkgPSBjb25jYXQoa2V5LCBwYXJ0c1tpXVsyXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgYnJlYWtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFydHNbaV1bMF0gPT09IEFUVFJfRVEpIGkrK1xuICAgICAgICB2YXIgaiA9IGlcbiAgICAgICAgZm9yICg7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChwYXJ0c1tpXVswXSA9PT0gQVRUUl9WQUxVRSB8fCBwYXJ0c1tpXVswXSA9PT0gQVRUUl9LRVkpIHtcbiAgICAgICAgICAgIGlmICghY3VyWzFdW2tleV0pIGN1clsxXVtrZXldID0gc3RyZm4ocGFydHNbaV1bMV0pXG4gICAgICAgICAgICBlbHNlIGN1clsxXVtrZXldID0gY29uY2F0KGN1clsxXVtrZXldLCBwYXJ0c1tpXVsxXSlcbiAgICAgICAgICB9IGVsc2UgaWYgKHBhcnRzW2ldWzBdID09PSBWQVJcbiAgICAgICAgICAmJiAocGFydHNbaV1bMV0gPT09IEFUVFJfVkFMVUUgfHwgcGFydHNbaV1bMV0gPT09IEFUVFJfS0VZKSkge1xuICAgICAgICAgICAgaWYgKCFjdXJbMV1ba2V5XSkgY3VyWzFdW2tleV0gPSBzdHJmbihwYXJ0c1tpXVsyXSlcbiAgICAgICAgICAgIGVsc2UgY3VyWzFdW2tleV0gPSBjb25jYXQoY3VyWzFdW2tleV0sIHBhcnRzW2ldWzJdKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoa2V5Lmxlbmd0aCAmJiAhY3VyWzFdW2tleV0gJiYgaSA9PT0galxuICAgICAgICAgICAgJiYgKHBhcnRzW2ldWzBdID09PSBDTE9TRSB8fCBwYXJ0c1tpXVswXSA9PT0gQVRUUl9CUkVBSykpIHtcbiAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvaW5mcmFzdHJ1Y3R1cmUuaHRtbCNib29sZWFuLWF0dHJpYnV0ZXNcbiAgICAgICAgICAgICAgLy8gZW1wdHkgc3RyaW5nIGlzIGZhbHN5LCBub3Qgd2VsbCBiZWhhdmVkIHZhbHVlIGluIGJyb3dzZXJcbiAgICAgICAgICAgICAgY3VyWzFdW2tleV0gPSBrZXkudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocyA9PT0gQVRUUl9LRVkpIHtcbiAgICAgICAgY3VyWzFdW3BbMV1dID0gdHJ1ZVxuICAgICAgfSBlbHNlIGlmIChzID09PSBWQVIgJiYgcFsxXSA9PT0gQVRUUl9LRVkpIHtcbiAgICAgICAgY3VyWzFdW3BbMl1dID0gdHJ1ZVxuICAgICAgfSBlbHNlIGlmIChzID09PSBDTE9TRSkge1xuICAgICAgICBpZiAoc2VsZkNsb3NpbmcoY3VyWzBdKSAmJiBzdGFjay5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgaXggPSBzdGFja1tzdGFjay5sZW5ndGgtMV1bMV1cbiAgICAgICAgICBzdGFjay5wb3AoKVxuICAgICAgICAgIHN0YWNrW3N0YWNrLmxlbmd0aC0xXVswXVsyXVtpeF0gPSBoKFxuICAgICAgICAgICAgY3VyWzBdLCBjdXJbMV0sIGN1clsyXS5sZW5ndGggPyBjdXJbMl0gOiB1bmRlZmluZWRcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocyA9PT0gVkFSICYmIHBbMV0gPT09IFRFWFQpIHtcbiAgICAgICAgaWYgKHBbMl0gPT09IHVuZGVmaW5lZCB8fCBwWzJdID09PSBudWxsKSBwWzJdID0gJydcbiAgICAgICAgZWxzZSBpZiAoIXBbMl0pIHBbMl0gPSBjb25jYXQoJycsIHBbMl0pXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHBbMl1bMF0pKSB7XG4gICAgICAgICAgY3VyWzJdLnB1c2guYXBwbHkoY3VyWzJdLCBwWzJdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN1clsyXS5wdXNoKHBbMl0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocyA9PT0gVEVYVCkge1xuICAgICAgICBjdXJbMl0ucHVzaChwWzFdKVxuICAgICAgfSBlbHNlIGlmIChzID09PSBBVFRSX0VRIHx8IHMgPT09IEFUVFJfQlJFQUspIHtcbiAgICAgICAgLy8gbm8tb3BcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5oYW5kbGVkOiAnICsgcylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHJlZVsyXS5sZW5ndGggPiAxICYmIC9eXFxzKiQvLnRlc3QodHJlZVsyXVswXSkpIHtcbiAgICAgIHRyZWVbMl0uc2hpZnQoKVxuICAgIH1cblxuICAgIGlmICh0cmVlWzJdLmxlbmd0aCA+IDJcbiAgICB8fCAodHJlZVsyXS5sZW5ndGggPT09IDIgJiYgL1xcUy8udGVzdCh0cmVlWzJdWzFdKSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ211bHRpcGxlIHJvb3QgZWxlbWVudHMgbXVzdCBiZSB3cmFwcGVkIGluIGFuIGVuY2xvc2luZyB0YWcnXG4gICAgICApXG4gICAgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KHRyZWVbMl1bMF0pICYmIHR5cGVvZiB0cmVlWzJdWzBdWzBdID09PSAnc3RyaW5nJ1xuICAgICYmIEFycmF5LmlzQXJyYXkodHJlZVsyXVswXVsyXSkpIHtcbiAgICAgIHRyZWVbMl1bMF0gPSBoKHRyZWVbMl1bMF1bMF0sIHRyZWVbMl1bMF1bMV0sIHRyZWVbMl1bMF1bMl0pXG4gICAgfVxuICAgIHJldHVybiB0cmVlWzJdWzBdXG5cbiAgICBmdW5jdGlvbiBwYXJzZSAoc3RyKSB7XG4gICAgICB2YXIgcmVzID0gW11cbiAgICAgIGlmIChzdGF0ZSA9PT0gQVRUUl9WQUxVRV9XKSBzdGF0ZSA9IEFUVFJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjID0gc3RyLmNoYXJBdChpKVxuICAgICAgICBpZiAoc3RhdGUgPT09IFRFWFQgJiYgYyA9PT0gJzwnKSB7XG4gICAgICAgICAgaWYgKHJlZy5sZW5ndGgpIHJlcy5wdXNoKFtURVhULCByZWddKVxuICAgICAgICAgIHJlZyA9ICcnXG4gICAgICAgICAgc3RhdGUgPSBPUEVOXG4gICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJz4nICYmICFxdW90KHN0YXRlKSkge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gT1BFTikge1xuICAgICAgICAgICAgcmVzLnB1c2goW09QRU4scmVnXSlcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX0tFWSkge1xuICAgICAgICAgICAgcmVzLnB1c2goW0FUVFJfS0VZLHJlZ10pXG4gICAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9WQUxVRSAmJiByZWcubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXMucHVzaChbQVRUUl9WQUxVRSxyZWddKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXMucHVzaChbQ0xPU0VdKVxuICAgICAgICAgIHJlZyA9ICcnXG4gICAgICAgICAgc3RhdGUgPSBURVhUXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IFRFWFQpIHtcbiAgICAgICAgICByZWcgKz0gY1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBPUEVOICYmIC9cXHMvLnRlc3QoYykpIHtcbiAgICAgICAgICByZXMucHVzaChbT1BFTiwgcmVnXSlcbiAgICAgICAgICByZWcgPSAnJ1xuICAgICAgICAgIHN0YXRlID0gQVRUUlxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBPUEVOKSB7XG4gICAgICAgICAgcmVnICs9IGNcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUiAmJiAvW1xcdy1dLy50ZXN0KGMpKSB7XG4gICAgICAgICAgc3RhdGUgPSBBVFRSX0tFWVxuICAgICAgICAgIHJlZyA9IGNcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUiAmJiAvXFxzLy50ZXN0KGMpKSB7XG4gICAgICAgICAgaWYgKHJlZy5sZW5ndGgpIHJlcy5wdXNoKFtBVFRSX0tFWSxyZWddKVxuICAgICAgICAgIHJlcy5wdXNoKFtBVFRSX0JSRUFLXSlcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9LRVkgJiYgL1xccy8udGVzdChjKSkge1xuICAgICAgICAgIHJlcy5wdXNoKFtBVFRSX0tFWSxyZWddKVxuICAgICAgICAgIHJlZyA9ICcnXG4gICAgICAgICAgc3RhdGUgPSBBVFRSX0tFWV9XXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfS0VZICYmIGMgPT09ICc9Jykge1xuICAgICAgICAgIHJlcy5wdXNoKFtBVFRSX0tFWSxyZWddLFtBVFRSX0VRXSlcbiAgICAgICAgICByZWcgPSAnJ1xuICAgICAgICAgIHN0YXRlID0gQVRUUl9WQUxVRV9XXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfS0VZKSB7XG4gICAgICAgICAgcmVnICs9IGNcbiAgICAgICAgfSBlbHNlIGlmICgoc3RhdGUgPT09IEFUVFJfS0VZX1cgfHwgc3RhdGUgPT09IEFUVFIpICYmIGMgPT09ICc9Jykge1xuICAgICAgICAgIHJlcy5wdXNoKFtBVFRSX0VRXSlcbiAgICAgICAgICBzdGF0ZSA9IEFUVFJfVkFMVUVfV1xuICAgICAgICB9IGVsc2UgaWYgKChzdGF0ZSA9PT0gQVRUUl9LRVlfVyB8fCBzdGF0ZSA9PT0gQVRUUikgJiYgIS9cXHMvLnRlc3QoYykpIHtcbiAgICAgICAgICByZXMucHVzaChbQVRUUl9CUkVBS10pXG4gICAgICAgICAgaWYgKC9bXFx3LV0vLnRlc3QoYykpIHtcbiAgICAgICAgICAgIHJlZyArPSBjXG4gICAgICAgICAgICBzdGF0ZSA9IEFUVFJfS0VZXG4gICAgICAgICAgfSBlbHNlIHN0YXRlID0gQVRUUlxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFX1cgJiYgYyA9PT0gJ1wiJykge1xuICAgICAgICAgIHN0YXRlID0gQVRUUl9WQUxVRV9EUVxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFX1cgJiYgYyA9PT0gXCInXCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEFUVFJfVkFMVUVfU1FcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9WQUxVRV9EUSAmJiBjID09PSAnXCInKSB7XG4gICAgICAgICAgcmVzLnB1c2goW0FUVFJfVkFMVUUscmVnXSxbQVRUUl9CUkVBS10pXG4gICAgICAgICAgcmVnID0gJydcbiAgICAgICAgICBzdGF0ZSA9IEFUVFJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9WQUxVRV9TUSAmJiBjID09PSBcIidcIikge1xuICAgICAgICAgIHJlcy5wdXNoKFtBVFRSX1ZBTFVFLHJlZ10sW0FUVFJfQlJFQUtdKVxuICAgICAgICAgIHJlZyA9ICcnXG4gICAgICAgICAgc3RhdGUgPSBBVFRSXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUVfVyAmJiAhL1xccy8udGVzdChjKSkge1xuICAgICAgICAgIHN0YXRlID0gQVRUUl9WQUxVRVxuICAgICAgICAgIGktLVxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFICYmIC9cXHMvLnRlc3QoYykpIHtcbiAgICAgICAgICByZXMucHVzaChbQVRUUl9CUkVBS10sW0FUVFJfVkFMVUUscmVnXSlcbiAgICAgICAgICByZWcgPSAnJ1xuICAgICAgICAgIHN0YXRlID0gQVRUUlxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFIHx8IHN0YXRlID09PSBBVFRSX1ZBTFVFX1NRXG4gICAgICAgIHx8IHN0YXRlID09PSBBVFRSX1ZBTFVFX0RRKSB7XG4gICAgICAgICAgcmVnICs9IGNcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN0YXRlID09PSBURVhUICYmIHJlZy5sZW5ndGgpIHtcbiAgICAgICAgcmVzLnB1c2goW1RFWFQscmVnXSlcbiAgICAgICAgcmVnID0gJydcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUUgJiYgcmVnLmxlbmd0aCkge1xuICAgICAgICByZXMucHVzaChbQVRUUl9WQUxVRSxyZWddKVxuICAgICAgICByZWcgPSAnJ1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9WQUxVRV9EUSAmJiByZWcubGVuZ3RoKSB7XG4gICAgICAgIHJlcy5wdXNoKFtBVFRSX1ZBTFVFLHJlZ10pXG4gICAgICAgIHJlZyA9ICcnXG4gICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFX1NRICYmIHJlZy5sZW5ndGgpIHtcbiAgICAgICAgcmVzLnB1c2goW0FUVFJfVkFMVUUscmVnXSlcbiAgICAgICAgcmVnID0gJydcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfS0VZKSB7XG4gICAgICAgIHJlcy5wdXNoKFtBVFRSX0tFWSxyZWddKVxuICAgICAgICByZWcgPSAnJ1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHN0cmZuICh4KSB7XG4gICAgaWYgKHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nKSByZXR1cm4geFxuICAgIGVsc2UgaWYgKHR5cGVvZiB4ID09PSAnc3RyaW5nJykgcmV0dXJuIHhcbiAgICBlbHNlIGlmICh4ICYmIHR5cGVvZiB4ID09PSAnb2JqZWN0JykgcmV0dXJuIHhcbiAgICBlbHNlIHJldHVybiBjb25jYXQoJycsIHgpXG4gIH1cbn1cblxuZnVuY3Rpb24gcXVvdCAoc3RhdGUpIHtcbiAgcmV0dXJuIHN0YXRlID09PSBBVFRSX1ZBTFVFX1NRIHx8IHN0YXRlID09PSBBVFRSX1ZBTFVFX0RRXG59XG5cbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5XG5mdW5jdGlvbiBoYXMgKG9iaiwga2V5KSB7IHJldHVybiBoYXNPd24uY2FsbChvYmosIGtleSkgfVxuXG52YXIgY2xvc2VSRSA9IFJlZ0V4cCgnXignICsgW1xuICAnYXJlYScsICdiYXNlJywgJ2Jhc2Vmb250JywgJ2Jnc291bmQnLCAnYnInLCAnY29sJywgJ2NvbW1hbmQnLCAnZW1iZWQnLFxuICAnZnJhbWUnLCAnaHInLCAnaW1nJywgJ2lucHV0JywgJ2lzaW5kZXgnLCAna2V5Z2VuJywgJ2xpbmsnLCAnbWV0YScsICdwYXJhbScsXG4gICdzb3VyY2UnLCAndHJhY2snLCAnd2JyJyxcbiAgLy8gU1ZHIFRBR1NcbiAgJ2FuaW1hdGUnLCAnYW5pbWF0ZVRyYW5zZm9ybScsICdjaXJjbGUnLCAnY3Vyc29yJywgJ2Rlc2MnLCAnZWxsaXBzZScsXG4gICdmZUJsZW5kJywgJ2ZlQ29sb3JNYXRyaXgnLCAnZmVDb21wb25lbnRUcmFuc2ZlcicsICdmZUNvbXBvc2l0ZScsXG4gICdmZUNvbnZvbHZlTWF0cml4JywgJ2ZlRGlmZnVzZUxpZ2h0aW5nJywgJ2ZlRGlzcGxhY2VtZW50TWFwJyxcbiAgJ2ZlRGlzdGFudExpZ2h0JywgJ2ZlRmxvb2QnLCAnZmVGdW5jQScsICdmZUZ1bmNCJywgJ2ZlRnVuY0cnLCAnZmVGdW5jUicsXG4gICdmZUdhdXNzaWFuQmx1cicsICdmZUltYWdlJywgJ2ZlTWVyZ2VOb2RlJywgJ2ZlTW9ycGhvbG9neScsXG4gICdmZU9mZnNldCcsICdmZVBvaW50TGlnaHQnLCAnZmVTcGVjdWxhckxpZ2h0aW5nJywgJ2ZlU3BvdExpZ2h0JywgJ2ZlVGlsZScsXG4gICdmZVR1cmJ1bGVuY2UnLCAnZm9udC1mYWNlLWZvcm1hdCcsICdmb250LWZhY2UtbmFtZScsICdmb250LWZhY2UtdXJpJyxcbiAgJ2dseXBoJywgJ2dseXBoUmVmJywgJ2hrZXJuJywgJ2ltYWdlJywgJ2xpbmUnLCAnbWlzc2luZy1nbHlwaCcsICdtcGF0aCcsXG4gICdwYXRoJywgJ3BvbHlnb24nLCAncG9seWxpbmUnLCAncmVjdCcsICdzZXQnLCAnc3RvcCcsICd0cmVmJywgJ3VzZScsICd2aWV3JyxcbiAgJ3ZrZXJuJ1xuXS5qb2luKCd8JykgKyAnKSg/OltcXC4jXVthLXpBLVowLTlcXHUwMDdGLVxcdUZGRkZfOi1dKykqJCcpXG5mdW5jdGlvbiBzZWxmQ2xvc2luZyAodGFnKSB7IHJldHVybiBjbG9zZVJFLnRlc3QodGFnKSB9XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGF0dHJpYnV0ZVRvUHJvcGVydHlcblxudmFyIHRyYW5zZm9ybSA9IHtcbiAgJ2NsYXNzJzogJ2NsYXNzTmFtZScsXG4gICdmb3InOiAnaHRtbEZvcicsXG4gICdodHRwLWVxdWl2JzogJ2h0dHBFcXVpdidcbn1cblxuZnVuY3Rpb24gYXR0cmlidXRlVG9Qcm9wZXJ0eSAoaCkge1xuICByZXR1cm4gZnVuY3Rpb24gKHRhZ05hbWUsIGF0dHJzLCBjaGlsZHJlbikge1xuICAgIGZvciAodmFyIGF0dHIgaW4gYXR0cnMpIHtcbiAgICAgIGlmIChhdHRyIGluIHRyYW5zZm9ybSkge1xuICAgICAgICBhdHRyc1t0cmFuc2Zvcm1bYXR0cl1dID0gYXR0cnNbYXR0cl1cbiAgICAgICAgZGVsZXRlIGF0dHJzW2F0dHJdXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoKHRhZ05hbWUsIGF0dHJzLCBjaGlsZHJlbilcbiAgfVxufVxuIiwiLy8gQ3JlYXRlIGEgcmFuZ2Ugb2JqZWN0IGZvciBlZmZpY2VudGx5IHJlbmRlcmluZyBzdHJpbmdzIHRvIGVsZW1lbnRzLlxudmFyIHJhbmdlO1xuXG52YXIgdGVzdEVsID0gdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyA/IGRvY3VtZW50LmJvZHkgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykgOiB7fTtcblxuLy8gRml4ZXMgaHR0cHM6Ly9naXRodWIuY29tL3BhdHJpY2stc3RlZWxlLWlkZW0vbW9ycGhkb20vaXNzdWVzLzMyIChJRTcrIHN1cHBvcnQpXG4vLyA8PUlFNyBkb2VzIG5vdCBzdXBwb3J0IGVsLmhhc0F0dHJpYnV0ZShuYW1lKVxudmFyIGhhc0F0dHJpYnV0ZTtcbmlmICh0ZXN0RWwuaGFzQXR0cmlidXRlKSB7XG4gICAgaGFzQXR0cmlidXRlID0gZnVuY3Rpb24gaGFzQXR0cmlidXRlKGVsLCBuYW1lKSB7XG4gICAgICAgIHJldHVybiBlbC5oYXNBdHRyaWJ1dGUobmFtZSk7XG4gICAgfTtcbn0gZWxzZSB7XG4gICAgaGFzQXR0cmlidXRlID0gZnVuY3Rpb24gaGFzQXR0cmlidXRlKGVsLCBuYW1lKSB7XG4gICAgICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGVOb2RlKG5hbWUpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGVtcHR5KG8pIHtcbiAgICBmb3IgKHZhciBrIGluIG8pIHtcbiAgICAgICAgaWYgKG8uaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gdG9FbGVtZW50KHN0cikge1xuICAgIGlmICghcmFuZ2UgJiYgZG9jdW1lbnQuY3JlYXRlUmFuZ2UpIHtcbiAgICAgICAgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xuICAgICAgICByYW5nZS5zZWxlY3ROb2RlKGRvY3VtZW50LmJvZHkpO1xuICAgIH1cblxuICAgIHZhciBmcmFnbWVudDtcbiAgICBpZiAocmFuZ2UgJiYgcmFuZ2UuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KSB7XG4gICAgICAgIGZyYWdtZW50ID0gcmFuZ2UuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHN0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdib2R5Jyk7XG4gICAgICAgIGZyYWdtZW50LmlubmVySFRNTCA9IHN0cjtcbiAgICB9XG4gICAgcmV0dXJuIGZyYWdtZW50LmNoaWxkTm9kZXNbMF07XG59XG5cbnZhciBzcGVjaWFsRWxIYW5kbGVycyA9IHtcbiAgICAvKipcbiAgICAgKiBOZWVkZWQgZm9yIElFLiBBcHBhcmVudGx5IElFIGRvZXNuJ3QgdGhpbmtcbiAgICAgKiB0aGF0IFwic2VsZWN0ZWRcIiBpcyBhbiBhdHRyaWJ1dGUgd2hlbiByZWFkaW5nXG4gICAgICogb3ZlciB0aGUgYXR0cmlidXRlcyB1c2luZyBzZWxlY3RFbC5hdHRyaWJ1dGVzXG4gICAgICovXG4gICAgT1BUSU9OOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgaWYgKChmcm9tRWwuc2VsZWN0ZWQgPSB0b0VsLnNlbGVjdGVkKSkge1xuICAgICAgICAgICAgZnJvbUVsLnNldEF0dHJpYnV0ZSgnc2VsZWN0ZWQnLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKCdzZWxlY3RlZCcsICcnKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogVGhlIFwidmFsdWVcIiBhdHRyaWJ1dGUgaXMgc3BlY2lhbCBmb3IgdGhlIDxpbnB1dD4gZWxlbWVudFxuICAgICAqIHNpbmNlIGl0IHNldHMgdGhlIGluaXRpYWwgdmFsdWUuIENoYW5naW5nIHRoZSBcInZhbHVlXCJcbiAgICAgKiBhdHRyaWJ1dGUgd2l0aG91dCBjaGFuZ2luZyB0aGUgXCJ2YWx1ZVwiIHByb3BlcnR5IHdpbGwgaGF2ZVxuICAgICAqIG5vIGVmZmVjdCBzaW5jZSBpdCBpcyBvbmx5IHVzZWQgdG8gdGhlIHNldCB0aGUgaW5pdGlhbCB2YWx1ZS5cbiAgICAgKiBTaW1pbGFyIGZvciB0aGUgXCJjaGVja2VkXCIgYXR0cmlidXRlLlxuICAgICAqL1xuICAgIElOUFVUOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgZnJvbUVsLmNoZWNrZWQgPSB0b0VsLmNoZWNrZWQ7XG5cbiAgICAgICAgaWYgKGZyb21FbC52YWx1ZSAhPSB0b0VsLnZhbHVlKSB7XG4gICAgICAgICAgICBmcm9tRWwudmFsdWUgPSB0b0VsLnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFoYXNBdHRyaWJ1dGUodG9FbCwgJ2NoZWNrZWQnKSkge1xuICAgICAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZSgnY2hlY2tlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFoYXNBdHRyaWJ1dGUodG9FbCwgJ3ZhbHVlJykpIHtcbiAgICAgICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgVEVYVEFSRUE6IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICB2YXIgbmV3VmFsdWUgPSB0b0VsLnZhbHVlO1xuICAgICAgICBpZiAoZnJvbUVsLnZhbHVlICE9IG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICBmcm9tRWwudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmcm9tRWwuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgZnJvbUVsLmZpcnN0Q2hpbGQubm9kZVZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxuLyoqXG4gKiBMb29wIG92ZXIgYWxsIG9mIHRoZSBhdHRyaWJ1dGVzIG9uIHRoZSB0YXJnZXQgbm9kZSBhbmQgbWFrZSBzdXJlIHRoZVxuICogb3JpZ2luYWwgRE9NIG5vZGUgaGFzIHRoZSBzYW1lIGF0dHJpYnV0ZXMuIElmIGFuIGF0dHJpYnV0ZVxuICogZm91bmQgb24gdGhlIG9yaWdpbmFsIG5vZGUgaXMgbm90IG9uIHRoZSBuZXcgbm9kZSB0aGVuIHJlbW92ZSBpdCBmcm9tXG4gKiB0aGUgb3JpZ2luYWwgbm9kZVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGZyb21Ob2RlXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gdG9Ob2RlXG4gKi9cbmZ1bmN0aW9uIG1vcnBoQXR0cnMoZnJvbU5vZGUsIHRvTm9kZSkge1xuICAgIHZhciBhdHRycyA9IHRvTm9kZS5hdHRyaWJ1dGVzO1xuICAgIHZhciBpO1xuICAgIHZhciBhdHRyO1xuICAgIHZhciBhdHRyTmFtZTtcbiAgICB2YXIgYXR0clZhbHVlO1xuICAgIHZhciBmb3VuZEF0dHJzID0ge307XG5cbiAgICBmb3IgKGk9YXR0cnMubGVuZ3RoLTE7IGk+PTA7IGktLSkge1xuICAgICAgICBhdHRyID0gYXR0cnNbaV07XG4gICAgICAgIGlmIChhdHRyLnNwZWNpZmllZCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0ci5uYW1lO1xuICAgICAgICAgICAgYXR0clZhbHVlID0gYXR0ci52YWx1ZTtcbiAgICAgICAgICAgIGZvdW5kQXR0cnNbYXR0ck5hbWVdID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKGZyb21Ob2RlLmdldEF0dHJpYnV0ZShhdHRyTmFtZSkgIT09IGF0dHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGZyb21Ob2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIERlbGV0ZSBhbnkgZXh0cmEgYXR0cmlidXRlcyBmb3VuZCBvbiB0aGUgb3JpZ2luYWwgRE9NIGVsZW1lbnQgdGhhdCB3ZXJlbid0XG4gICAgLy8gZm91bmQgb24gdGhlIHRhcmdldCBlbGVtZW50LlxuICAgIGF0dHJzID0gZnJvbU5vZGUuYXR0cmlidXRlcztcblxuICAgIGZvciAoaT1hdHRycy5sZW5ndGgtMTsgaT49MDsgaS0tKSB7XG4gICAgICAgIGF0dHIgPSBhdHRyc1tpXTtcbiAgICAgICAgaWYgKGF0dHIuc3BlY2lmaWVkICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRyLm5hbWU7XG4gICAgICAgICAgICBpZiAoIWZvdW5kQXR0cnMuaGFzT3duUHJvcGVydHkoYXR0ck5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZnJvbU5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBDb3BpZXMgdGhlIGNoaWxkcmVuIG9mIG9uZSBET00gZWxlbWVudCB0byBhbm90aGVyIERPTSBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIG1vdmVDaGlsZHJlbihmcm9tRWwsIHRvRWwpIHtcbiAgICB2YXIgY3VyQ2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICB3aGlsZShjdXJDaGlsZCkge1xuICAgICAgICB2YXIgbmV4dENoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgIHRvRWwuYXBwZW5kQ2hpbGQoY3VyQ2hpbGQpO1xuICAgICAgICBjdXJDaGlsZCA9IG5leHRDaGlsZDtcbiAgICB9XG4gICAgcmV0dXJuIHRvRWw7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRHZXROb2RlS2V5KG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5pZDtcbn1cblxuZnVuY3Rpb24gbW9ycGhkb20oZnJvbU5vZGUsIHRvTm9kZSwgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0b05vZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmIChmcm9tTm9kZS5ub2RlTmFtZSA9PT0gJyNkb2N1bWVudCcgfHwgZnJvbU5vZGUubm9kZU5hbWUgPT09ICdIVE1MJykge1xuICAgICAgICAgICAgdmFyIHRvTm9kZUh0bWwgPSB0b05vZGU7XG4gICAgICAgICAgICB0b05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdodG1sJyk7XG4gICAgICAgICAgICB0b05vZGUuaW5uZXJIVE1MID0gdG9Ob2RlSHRtbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvTm9kZSA9IHRvRWxlbWVudCh0b05vZGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHNhdmVkRWxzID0ge307IC8vIFVzZWQgdG8gc2F2ZSBvZmYgRE9NIGVsZW1lbnRzIHdpdGggSURzXG4gICAgdmFyIHVubWF0Y2hlZEVscyA9IHt9O1xuICAgIHZhciBnZXROb2RlS2V5ID0gb3B0aW9ucy5nZXROb2RlS2V5IHx8IGRlZmF1bHRHZXROb2RlS2V5O1xuICAgIHZhciBvbkJlZm9yZU5vZGVBZGRlZCA9IG9wdGlvbnMub25CZWZvcmVOb2RlQWRkZWQgfHwgbm9vcDtcbiAgICB2YXIgb25Ob2RlQWRkZWQgPSBvcHRpb25zLm9uTm9kZUFkZGVkIHx8IG5vb3A7XG4gICAgdmFyIG9uQmVmb3JlRWxVcGRhdGVkID0gb3B0aW9ucy5vbkJlZm9yZUVsVXBkYXRlZCB8fCBvcHRpb25zLm9uQmVmb3JlTW9ycGhFbCB8fCBub29wO1xuICAgIHZhciBvbkVsVXBkYXRlZCA9IG9wdGlvbnMub25FbFVwZGF0ZWQgfHwgbm9vcDtcbiAgICB2YXIgb25CZWZvcmVOb2RlRGlzY2FyZGVkID0gb3B0aW9ucy5vbkJlZm9yZU5vZGVEaXNjYXJkZWQgfHwgbm9vcDtcbiAgICB2YXIgb25Ob2RlRGlzY2FyZGVkID0gb3B0aW9ucy5vbk5vZGVEaXNjYXJkZWQgfHwgbm9vcDtcbiAgICB2YXIgb25CZWZvcmVFbENoaWxkcmVuVXBkYXRlZCA9IG9wdGlvbnMub25CZWZvcmVFbENoaWxkcmVuVXBkYXRlZCB8fCBvcHRpb25zLm9uQmVmb3JlTW9ycGhFbENoaWxkcmVuIHx8IG5vb3A7XG4gICAgdmFyIGNoaWxkcmVuT25seSA9IG9wdGlvbnMuY2hpbGRyZW5Pbmx5ID09PSB0cnVlO1xuICAgIHZhciBtb3ZlZEVscyA9IFtdO1xuXG4gICAgZnVuY3Rpb24gcmVtb3ZlTm9kZUhlbHBlcihub2RlLCBuZXN0ZWRJblNhdmVkRWwpIHtcbiAgICAgICAgdmFyIGlkID0gZ2V0Tm9kZUtleShub2RlKTtcbiAgICAgICAgLy8gSWYgdGhlIG5vZGUgaGFzIGFuIElEIHRoZW4gc2F2ZSBpdCBvZmYgc2luY2Ugd2Ugd2lsbCB3YW50XG4gICAgICAgIC8vIHRvIHJldXNlIGl0IGluIGNhc2UgdGhlIHRhcmdldCBET00gdHJlZSBoYXMgYSBET00gZWxlbWVudFxuICAgICAgICAvLyB3aXRoIHRoZSBzYW1lIElEXG4gICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgc2F2ZWRFbHNbaWRdID0gbm9kZTtcbiAgICAgICAgfSBlbHNlIGlmICghbmVzdGVkSW5TYXZlZEVsKSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUgbm90IG5lc3RlZCBpbiBhIHNhdmVkIGVsZW1lbnQgdGhlbiB3ZSBrbm93IHRoYXQgdGhpcyBub2RlIGhhcyBiZWVuXG4gICAgICAgICAgICAvLyBjb21wbGV0ZWx5IGRpc2NhcmRlZCBhbmQgd2lsbCBub3QgZXhpc3QgaW4gdGhlIGZpbmFsIERPTS5cbiAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChub2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICB2YXIgY3VyQ2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB3aGlsZShjdXJDaGlsZCkge1xuICAgICAgICAgICAgICAgIHJlbW92ZU5vZGVIZWxwZXIoY3VyQ2hpbGQsIG5lc3RlZEluU2F2ZWRFbCB8fCBpZCk7XG4gICAgICAgICAgICAgICAgY3VyQ2hpbGQgPSBjdXJDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdhbGtEaXNjYXJkZWRDaGlsZE5vZGVzKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgIHZhciBjdXJDaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIHdoaWxlKGN1ckNoaWxkKSB7XG5cblxuICAgICAgICAgICAgICAgIGlmICghZ2V0Tm9kZUtleShjdXJDaGlsZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2Ugb25seSB3YW50IHRvIGhhbmRsZSBub2RlcyB0aGF0IGRvbid0IGhhdmUgYW4gSUQgdG8gYXZvaWQgZG91YmxlXG4gICAgICAgICAgICAgICAgICAgIC8vIHdhbGtpbmcgdGhlIHNhbWUgc2F2ZWQgZWxlbWVudC5cblxuICAgICAgICAgICAgICAgICAgICBvbk5vZGVEaXNjYXJkZWQoY3VyQ2hpbGQpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFdhbGsgcmVjdXJzaXZlbHlcbiAgICAgICAgICAgICAgICAgICAgd2Fsa0Rpc2NhcmRlZENoaWxkTm9kZXMoY3VyQ2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVOb2RlKG5vZGUsIHBhcmVudE5vZGUsIGFscmVhZHlWaXNpdGVkKSB7XG4gICAgICAgIGlmIChvbkJlZm9yZU5vZGVEaXNjYXJkZWQobm9kZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICBpZiAoYWxyZWFkeVZpc2l0ZWQpIHtcbiAgICAgICAgICAgIGlmICghZ2V0Tm9kZUtleShub2RlKSkge1xuICAgICAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChub2RlKTtcbiAgICAgICAgICAgICAgICB3YWxrRGlzY2FyZGVkQ2hpbGROb2Rlcyhub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlbW92ZU5vZGVIZWxwZXIobm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb3JwaEVsKGZyb21FbCwgdG9FbCwgYWxyZWFkeVZpc2l0ZWQsIGNoaWxkcmVuT25seSkge1xuICAgICAgICB2YXIgdG9FbEtleSA9IGdldE5vZGVLZXkodG9FbCk7XG4gICAgICAgIGlmICh0b0VsS2V5KSB7XG4gICAgICAgICAgICAvLyBJZiBhbiBlbGVtZW50IHdpdGggYW4gSUQgaXMgYmVpbmcgbW9ycGhlZCB0aGVuIGl0IGlzIHdpbGwgYmUgaW4gdGhlIGZpbmFsXG4gICAgICAgICAgICAvLyBET00gc28gY2xlYXIgaXQgb3V0IG9mIHRoZSBzYXZlZCBlbGVtZW50cyBjb2xsZWN0aW9uXG4gICAgICAgICAgICBkZWxldGUgc2F2ZWRFbHNbdG9FbEtleV07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNoaWxkcmVuT25seSkge1xuICAgICAgICAgICAgaWYgKG9uQmVmb3JlRWxVcGRhdGVkKGZyb21FbCwgdG9FbCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtb3JwaEF0dHJzKGZyb21FbCwgdG9FbCk7XG4gICAgICAgICAgICBvbkVsVXBkYXRlZChmcm9tRWwpO1xuXG4gICAgICAgICAgICBpZiAob25CZWZvcmVFbENoaWxkcmVuVXBkYXRlZChmcm9tRWwsIHRvRWwpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmcm9tRWwudGFnTmFtZSAhPSAnVEVYVEFSRUEnKSB7XG4gICAgICAgICAgICB2YXIgY3VyVG9Ob2RlQ2hpbGQgPSB0b0VsLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB2YXIgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21FbC5maXJzdENoaWxkO1xuICAgICAgICAgICAgdmFyIGN1clRvTm9kZUlkO1xuXG4gICAgICAgICAgICB2YXIgZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgdmFyIHRvTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB2YXIgc2F2ZWRFbDtcbiAgICAgICAgICAgIHZhciB1bm1hdGNoZWRFbDtcblxuICAgICAgICAgICAgb3V0ZXI6IHdoaWxlKGN1clRvTm9kZUNoaWxkKSB7XG4gICAgICAgICAgICAgICAgdG9OZXh0U2libGluZyA9IGN1clRvTm9kZUNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGN1clRvTm9kZUlkID0gZ2V0Tm9kZUtleShjdXJUb05vZGVDaGlsZCk7XG5cbiAgICAgICAgICAgICAgICB3aGlsZShjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJGcm9tTm9kZUlkID0gZ2V0Tm9kZUtleShjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgZnJvbU5leHRTaWJsaW5nID0gY3VyRnJvbU5vZGVDaGlsZC5uZXh0U2libGluZztcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWFscmVhZHlWaXNpdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVJZCAmJiAodW5tYXRjaGVkRWwgPSB1bm1hdGNoZWRFbHNbY3VyRnJvbU5vZGVJZF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5tYXRjaGVkRWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoY3VyRnJvbU5vZGVDaGlsZCwgdW5tYXRjaGVkRWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vcnBoRWwoY3VyRnJvbU5vZGVDaGlsZCwgdW5tYXRjaGVkRWwsIGFscmVhZHlWaXNpdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1ckZyb21Ob2RlVHlwZSA9IGN1ckZyb21Ob2RlQ2hpbGQubm9kZVR5cGU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlVHlwZSA9PT0gY3VyVG9Ob2RlQ2hpbGQubm9kZVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpc0NvbXBhdGlibGUgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlVHlwZSA9PT0gMSkgeyAvLyBCb3RoIG5vZGVzIGJlaW5nIGNvbXBhcmVkIGFyZSBFbGVtZW50IG5vZGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlQ2hpbGQudGFnTmFtZSA9PT0gY3VyVG9Ob2RlQ2hpbGQudGFnTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIGNvbXBhdGlibGUgRE9NIGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZUlkIHx8IGN1clRvTm9kZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBlaXRoZXIgRE9NIGVsZW1lbnQgaGFzIGFuIElEIHRoZW4gd2UgaGFuZGxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aG9zZSBkaWZmZXJlbnRseSBzaW5jZSB3ZSB3YW50IHRvIG1hdGNoIHVwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBieSBJRFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUlkID09PSBjdXJGcm9tTm9kZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNDb21wYXRpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGZvdW5kIGNvbXBhdGlibGUgRE9NIGVsZW1lbnRzIHNvIHRyYW5zZm9ybSB0aGUgY3VycmVudCBcImZyb21cIiBub2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvIG1hdGNoIHRoZSBjdXJyZW50IHRhcmdldCBET00gbm9kZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9ycGhFbChjdXJGcm9tTm9kZUNoaWxkLCBjdXJUb05vZGVDaGlsZCwgYWxyZWFkeVZpc2l0ZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSAzKSB7IC8vIEJvdGggbm9kZXMgYmVpbmcgY29tcGFyZWQgYXJlIFRleHQgbm9kZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNpbXBseSB1cGRhdGUgbm9kZVZhbHVlIG9uIHRoZSBvcmlnaW5hbCBub2RlIHRvIGNoYW5nZSB0aGUgdGV4dCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQubm9kZVZhbHVlID0gY3VyVG9Ob2RlQ2hpbGQubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNDb21wYXRpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWUgb3V0ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBObyBjb21wYXRpYmxlIG1hdGNoIHNvIHJlbW92ZSB0aGUgb2xkIG5vZGUgZnJvbSB0aGUgRE9NIGFuZCBjb250aW51ZSB0cnlpbmdcbiAgICAgICAgICAgICAgICAgICAgLy8gdG8gZmluZCBhIG1hdGNoIGluIHRoZSBvcmlnaW5hbCBET01cbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tRWwsIGFscmVhZHlWaXNpdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoY3VyVG9Ob2RlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChzYXZlZEVsID0gc2F2ZWRFbHNbY3VyVG9Ob2RlSWRdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9ycGhFbChzYXZlZEVsLCBjdXJUb05vZGVDaGlsZCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHNhdmVkRWw7IC8vIFdlIHdhbnQgdG8gYXBwZW5kIHRoZSBzYXZlZCBlbGVtZW50IGluc3RlYWRcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBjdXJyZW50IERPTSBlbGVtZW50IGluIHRoZSB0YXJnZXQgdHJlZSBoYXMgYW4gSURcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJ1dCB3ZSBkaWQgbm90IGZpbmQgYSBtYXRjaCBpbiBhbnkgb2YgdGhlIGNvcnJlc3BvbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNpYmxpbmdzLiBXZSBqdXN0IHB1dCB0aGUgdGFyZ2V0IGVsZW1lbnQgaW4gdGhlIG9sZCBET00gdHJlZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYnV0IGlmIHdlIGxhdGVyIGZpbmQgYW4gZWxlbWVudCBpbiB0aGUgb2xkIERPTSB0cmVlIHRoYXQgaGFzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhIG1hdGNoaW5nIElEIHRoZW4gd2Ugd2lsbCByZXBsYWNlIHRoZSB0YXJnZXQgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2l0aCB0aGUgY29ycmVzcG9uZGluZyBvbGQgZWxlbWVudCBhbmQgbW9ycGggdGhlIG9sZCBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICB1bm1hdGNoZWRFbHNbY3VyVG9Ob2RlSWRdID0gY3VyVG9Ob2RlQ2hpbGQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSBnb3QgdGhpcyBmYXIgdGhlbiB3ZSBkaWQgbm90IGZpbmQgYSBjYW5kaWRhdGUgbWF0Y2ggZm9yIG91ciBcInRvIG5vZGVcIlxuICAgICAgICAgICAgICAgIC8vIGFuZCB3ZSBleGhhdXN0ZWQgYWxsIG9mIHRoZSBjaGlsZHJlbiBcImZyb21cIiBub2Rlcy4gVGhlcmVmb3JlLCB3ZSB3aWxsIGp1c3RcbiAgICAgICAgICAgICAgICAvLyBhcHBlbmQgdGhlIGN1cnJlbnQgXCJ0byBub2RlXCIgdG8gdGhlIGVuZFxuICAgICAgICAgICAgICAgIGlmIChvbkJlZm9yZU5vZGVBZGRlZChjdXJUb05vZGVDaGlsZCkgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyb21FbC5hcHBlbmRDaGlsZChjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIG9uTm9kZUFkZGVkKGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoY3VyVG9Ob2RlQ2hpbGQubm9kZVR5cGUgPT09IDEgJiYgKGN1clRvTm9kZUlkIHx8IGN1clRvTm9kZUNoaWxkLmZpcnN0Q2hpbGQpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBlbGVtZW50IHRoYXQgd2FzIGp1c3QgYWRkZWQgdG8gdGhlIG9yaWdpbmFsIERPTSBtYXkgaGF2ZVxuICAgICAgICAgICAgICAgICAgICAvLyBzb21lIG5lc3RlZCBlbGVtZW50cyB3aXRoIGEga2V5L0lEIHRoYXQgbmVlZHMgdG8gYmUgbWF0Y2hlZCB1cFxuICAgICAgICAgICAgICAgICAgICAvLyB3aXRoIG90aGVyIGVsZW1lbnRzLiBXZSdsbCBhZGQgdGhlIGVsZW1lbnQgdG8gYSBsaXN0IHNvIHRoYXQgd2VcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FuIGxhdGVyIHByb2Nlc3MgdGhlIG5lc3RlZCBlbGVtZW50cyBpZiB0aGVyZSBhcmUgYW55IHVubWF0Y2hlZFxuICAgICAgICAgICAgICAgICAgICAvLyBrZXllZCBlbGVtZW50cyB0aGF0IHdlcmUgZGlzY2FyZGVkXG4gICAgICAgICAgICAgICAgICAgIG1vdmVkRWxzLnB1c2goY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBXZSBoYXZlIHByb2Nlc3NlZCBhbGwgb2YgdGhlIFwidG8gbm9kZXNcIi4gSWYgY3VyRnJvbU5vZGVDaGlsZCBpcyBub24tbnVsbCB0aGVuXG4gICAgICAgICAgICAvLyB3ZSBzdGlsbCBoYXZlIHNvbWUgZnJvbSBub2RlcyBsZWZ0IG92ZXIgdGhhdCBuZWVkIHRvIGJlIHJlbW92ZWRcbiAgICAgICAgICAgIHdoaWxlKGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIHJlbW92ZU5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbUVsLCBhbHJlYWR5VmlzaXRlZCk7XG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzcGVjaWFsRWxIYW5kbGVyID0gc3BlY2lhbEVsSGFuZGxlcnNbZnJvbUVsLnRhZ05hbWVdO1xuICAgICAgICBpZiAoc3BlY2lhbEVsSGFuZGxlcikge1xuICAgICAgICAgICAgc3BlY2lhbEVsSGFuZGxlcihmcm9tRWwsIHRvRWwpO1xuICAgICAgICB9XG4gICAgfSAvLyBFTkQ6IG1vcnBoRWwoLi4uKVxuXG4gICAgdmFyIG1vcnBoZWROb2RlID0gZnJvbU5vZGU7XG4gICAgdmFyIG1vcnBoZWROb2RlVHlwZSA9IG1vcnBoZWROb2RlLm5vZGVUeXBlO1xuICAgIHZhciB0b05vZGVUeXBlID0gdG9Ob2RlLm5vZGVUeXBlO1xuXG4gICAgaWYgKCFjaGlsZHJlbk9ubHkpIHtcbiAgICAgICAgLy8gSGFuZGxlIHRoZSBjYXNlIHdoZXJlIHdlIGFyZSBnaXZlbiB0d28gRE9NIG5vZGVzIHRoYXQgYXJlIG5vdFxuICAgICAgICAvLyBjb21wYXRpYmxlIChlLmcuIDxkaXY+IC0tPiA8c3Bhbj4gb3IgPGRpdj4gLS0+IFRFWFQpXG4gICAgICAgIGlmIChtb3JwaGVkTm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgIGlmICh0b05vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZyb21Ob2RlLnRhZ05hbWUgIT09IHRvTm9kZS50YWdOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChmcm9tTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIG1vcnBoZWROb2RlID0gbW92ZUNoaWxkcmVuKGZyb21Ob2RlLCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRvTm9kZS50YWdOYW1lKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBHb2luZyBmcm9tIGFuIGVsZW1lbnQgbm9kZSB0byBhIHRleHQgbm9kZVxuICAgICAgICAgICAgICAgIG1vcnBoZWROb2RlID0gdG9Ob2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gMykgeyAvLyBUZXh0IG5vZGVcbiAgICAgICAgICAgIGlmICh0b05vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgbW9ycGhlZE5vZGUubm9kZVZhbHVlID0gdG9Ob2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9ycGhlZE5vZGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFRleHQgbm9kZSB0byBzb21ldGhpbmcgZWxzZVxuICAgICAgICAgICAgICAgIG1vcnBoZWROb2RlID0gdG9Ob2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1vcnBoZWROb2RlID09PSB0b05vZGUpIHtcbiAgICAgICAgLy8gVGhlIFwidG8gbm9kZVwiIHdhcyBub3QgY29tcGF0aWJsZSB3aXRoIHRoZSBcImZyb20gbm9kZVwiXG4gICAgICAgIC8vIHNvIHdlIGhhZCB0byB0b3NzIG91dCB0aGUgXCJmcm9tIG5vZGVcIiBhbmQgdXNlIHRoZSBcInRvIG5vZGVcIlxuICAgICAgICBvbk5vZGVEaXNjYXJkZWQoZnJvbU5vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG1vcnBoRWwobW9ycGhlZE5vZGUsIHRvTm9kZSwgZmFsc2UsIGNoaWxkcmVuT25seSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoYXQgd2Ugd2lsbCBkbyBoZXJlIGlzIHdhbGsgdGhlIHRyZWUgZm9yIHRoZSBET00gZWxlbWVudFxuICAgICAgICAgKiB0aGF0IHdhcyBtb3ZlZCBmcm9tIHRoZSB0YXJnZXQgRE9NIHRyZWUgdG8gdGhlIG9yaWdpbmFsXG4gICAgICAgICAqIERPTSB0cmVlIGFuZCB3ZSB3aWxsIGxvb2sgZm9yIGtleWVkIGVsZW1lbnRzIHRoYXQgY291bGRcbiAgICAgICAgICogYmUgbWF0Y2hlZCB0byBrZXllZCBlbGVtZW50cyB0aGF0IHdlcmUgZWFybGllciBkaXNjYXJkZWQuXG4gICAgICAgICAqIElmIHdlIGZpbmQgYSBtYXRjaCB0aGVuIHdlIHdpbGwgbW92ZSB0aGUgc2F2ZWQgZWxlbWVudFxuICAgICAgICAgKiBpbnRvIHRoZSBmaW5hbCBET00gdHJlZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIGhhbmRsZU1vdmVkRWwgPSBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgdmFyIGN1ckNoaWxkID0gZWwuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIHdoaWxlKGN1ckNoaWxkKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRTaWJsaW5nID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gZ2V0Tm9kZUtleShjdXJDaGlsZCk7XG4gICAgICAgICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2F2ZWRFbCA9IHNhdmVkRWxzW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChzYXZlZEVsICYmIChjdXJDaGlsZC50YWdOYW1lID09PSBzYXZlZEVsLnRhZ05hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChzYXZlZEVsLCBjdXJDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb3JwaEVsKHNhdmVkRWwsIGN1ckNoaWxkLCB0cnVlIC8qIGFscmVhZHkgdmlzaXRlZCB0aGUgc2F2ZWQgZWwgdHJlZSAqLyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IG5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVtcHR5KHNhdmVkRWxzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGN1ckNoaWxkLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZU1vdmVkRWwoY3VyQ2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGN1ckNoaWxkID0gbmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gVGhlIGxvb3AgYmVsb3cgaXMgdXNlZCB0byBwb3NzaWJseSBtYXRjaCB1cCBhbnkgZGlzY2FyZGVkXG4gICAgICAgIC8vIGVsZW1lbnRzIGluIHRoZSBvcmlnaW5hbCBET00gdHJlZSB3aXRoIGVsZW1lbmV0cyBmcm9tIHRoZVxuICAgICAgICAvLyB0YXJnZXQgdHJlZSB0aGF0IHdlcmUgbW92ZWQgb3ZlciB3aXRob3V0IHZpc2l0aW5nIHRoZWlyXG4gICAgICAgIC8vIGNoaWxkcmVuXG4gICAgICAgIGlmICghZW1wdHkoc2F2ZWRFbHMpKSB7XG4gICAgICAgICAgICBoYW5kbGVNb3ZlZEVsc0xvb3A6XG4gICAgICAgICAgICB3aGlsZSAobW92ZWRFbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1vdmVkRWxzVGVtcCA9IG1vdmVkRWxzO1xuICAgICAgICAgICAgICAgIG1vdmVkRWxzID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPG1vdmVkRWxzVGVtcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaGFuZGxlTW92ZWRFbChtb3ZlZEVsc1RlbXBbaV0pID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlcmUgYXJlIG5vIG1vcmUgdW5tYXRjaGVkIGVsZW1lbnRzIHNvIGNvbXBsZXRlbHkgZW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgbG9vcFxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWsgaGFuZGxlTW92ZWRFbHNMb29wO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmlyZSB0aGUgXCJvbk5vZGVEaXNjYXJkZWRcIiBldmVudCBmb3IgYW55IHNhdmVkIGVsZW1lbnRzXG4gICAgICAgIC8vIHRoYXQgbmV2ZXIgZm91bmQgYSBuZXcgaG9tZSBpbiB0aGUgbW9ycGhlZCBET01cbiAgICAgICAgZm9yICh2YXIgc2F2ZWRFbElkIGluIHNhdmVkRWxzKSB7XG4gICAgICAgICAgICBpZiAoc2F2ZWRFbHMuaGFzT3duUHJvcGVydHkoc2F2ZWRFbElkKSkge1xuICAgICAgICAgICAgICAgIHZhciBzYXZlZEVsID0gc2F2ZWRFbHNbc2F2ZWRFbElkXTtcbiAgICAgICAgICAgICAgICBvbk5vZGVEaXNjYXJkZWQoc2F2ZWRFbCk7XG4gICAgICAgICAgICAgICAgd2Fsa0Rpc2NhcmRlZENoaWxkTm9kZXMoc2F2ZWRFbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWNoaWxkcmVuT25seSAmJiBtb3JwaGVkTm9kZSAhPT0gZnJvbU5vZGUgJiYgZnJvbU5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICAvLyBJZiB3ZSBoYWQgdG8gc3dhcCBvdXQgdGhlIGZyb20gbm9kZSB3aXRoIGEgbmV3IG5vZGUgYmVjYXVzZSB0aGUgb2xkXG4gICAgICAgIC8vIG5vZGUgd2FzIG5vdCBjb21wYXRpYmxlIHdpdGggdGhlIHRhcmdldCBub2RlIHRoZW4gd2UgbmVlZCB0b1xuICAgICAgICAvLyByZXBsYWNlIHRoZSBvbGQgRE9NIG5vZGUgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLiBUaGlzIGlzIG9ubHlcbiAgICAgICAgLy8gcG9zc2libGUgaWYgdGhlIG9yaWdpbmFsIERPTSBub2RlIHdhcyBwYXJ0IG9mIGEgRE9NIHRyZWUgd2hpY2hcbiAgICAgICAgLy8gd2Uga25vdyBpcyB0aGUgY2FzZSBpZiBpdCBoYXMgYSBwYXJlbnQgbm9kZS5cbiAgICAgICAgZnJvbU5vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobW9ycGhlZE5vZGUsIGZyb21Ob2RlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbW9ycGhlZE5vZGU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbW9ycGhkb207XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgLy8gYXR0cmlidXRlIGV2ZW50cyAoY2FuIGJlIHNldCB3aXRoIGF0dHJpYnV0ZXMpXG4gICdvbmNsaWNrJyxcbiAgJ29uZGJsY2xpY2snLFxuICAnb25tb3VzZWRvd24nLFxuICAnb25tb3VzZXVwJyxcbiAgJ29ubW91c2VvdmVyJyxcbiAgJ29ubW91c2Vtb3ZlJyxcbiAgJ29ubW91c2VvdXQnLFxuICAnb25kcmFnc3RhcnQnLFxuICAnb25kcmFnJyxcbiAgJ29uZHJhZ2VudGVyJyxcbiAgJ29uZHJhZ2xlYXZlJyxcbiAgJ29uZHJhZ292ZXInLFxuICAnb25kcm9wJyxcbiAgJ29uZHJhZ2VuZCcsXG4gICdvbmtleWRvd24nLFxuICAnb25rZXlwcmVzcycsXG4gICdvbmtleXVwJyxcbiAgJ29udW5sb2FkJyxcbiAgJ29uYWJvcnQnLFxuICAnb25lcnJvcicsXG4gICdvbnJlc2l6ZScsXG4gICdvbnNjcm9sbCcsXG4gICdvbnNlbGVjdCcsXG4gICdvbmNoYW5nZScsXG4gICdvbnN1Ym1pdCcsXG4gICdvbnJlc2V0JyxcbiAgJ29uZm9jdXMnLFxuICAnb25ibHVyJyxcbiAgJ29uaW5wdXQnLFxuICAvLyBvdGhlciBjb21tb24gZXZlbnRzXG4gICdvbmNvbnRleHRtZW51JyxcbiAgJ29uZm9jdXNpbicsXG4gICdvbmZvY3Vzb3V0J1xuXVxuIiwidmFyIHlvID0gcmVxdWlyZSgneW8teW8nKTtcclxudmFyIHRyYW5zbGF0ZSA9IHJlcXVpcmUoJy4uL3RyYW5zbGF0ZScpO1xyXG5cclxudmFyIGVsID0geW9gPGZvb3RlciBjbGFzcz1cInNpdGUtZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sIHMxMiBsMyBjZW50ZXItYWxpZ25cIj48YSBocmVmPVwiI1wiIGRhdGEtYWN0aXZhdGVzPVwiZHJvcGRvd24xXCIgY2xhc3M9XCJkcm9wZG93bi1idXR0b24gYnRuIGJ0bi1mbGF0XCI+JHt0cmFuc2xhdGUubWVzc2FnZSgnbGFuZ3VhZ2UnKX08L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgaWQ9XCJkcm9wZG93bjFcIiBjbGFzcz1cImRyb3Bkb3duLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMhXCI+JHt0cmFuc2xhdGUubWVzc2FnZSgnc3BhbmlzaCcpfTwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIyFcIj4ke3RyYW5zbGF0ZS5tZXNzYWdlKCdlbmdsaXNoJyl9PC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbCBzMTIgbDMgcHVzaC1sNiBjZW50ZXItYWxpZ25cIj7CqSAyMDE2IE15Z3JhbTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZm9vdGVyPmA7XHJcblxyXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsKTsiLCJ2YXIgcGFnZSA9IHJlcXVpcmUoJ3BhZ2UnKTtcbnZhciBlbXB0eSA9IHJlcXVpcmUoJ2VtcHR5LWVsZW1lbnQnKTtcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vdGVtcGxhdGUnKTtcbnZhciB0aXRsZSA9IHJlcXVpcmUoJ3RpdGxlJyk7XG5cblxucGFnZSgnLycsIGZ1bmN0aW9uIChjdHgsIG5leHQpIHtcblx0dGl0bGUoJ015R3JhbScpO1xuXHR2YXIgbWFpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWNvbnRhaW5lcicpO1xuXG5cdHZhciBwaWN0dXJlcyA9IFtcblx0XHR7XG5cdFx0XHR1c2VyOiB7XG5cdFx0XHRcdHVzZXJuYW1lOiAnRGFuaWVsIEgnLFxuXHRcdFx0XHRhdmF0YXI6ICdodHRwczovL3Njb250ZW50LW1pYTEtMS54eC5mYmNkbi5uZXQvdi90MS4wLTkvMTI5NjM4ODlfMTAyMDg5MDE5MDQ2MDMzMzBfNjg3MDM1NDk2MTg0MTIxNDg4N19uLmpwZz9vaD1mODE5YTAyMmU1MmJlMTljYWJhYWJkODlkNmNiMzljZSZvZT01N0U2QjdGNSdcblx0XHRcdH0sXG5cdFx0XHR1cmw6ICdodHRwOi8vbWF0ZXJpYWxpemVjc3MuY29tL2ltYWdlcy9vZmZpY2UuanBnJyxcblx0XHRcdGxpa2VzOiAwLFxuXHRcdFx0bGlrZWQ6IGZhbHNlLFxuXHRcdFx0Y3JlYXRlZEF0OiBuZXcgRGF0ZSgpXG5cdFx0fSxcblx0XHR7XG5cdFx0XHR1c2VyOiB7XG5cdFx0XHRcdHVzZXJuYW1lOiAnRGF2aWQgUHRlJyxcblx0XHRcdFx0YXZhdGFyOiAnaHR0cHM6Ly9zY29udGVudC1taWExLTEueHguZmJjZG4ubmV0L3YvdDEuMC05LzEzMjQwNDc2XzEwMjA3NDY4ODI4OTMyOTgwXzc2NjIwODc1NDU4NjA3Njk3OF9uLmpwZz9vaD1hZTk5N2YwZjEwNDAzZjY1NDk5Njc0ZjVhMjg2OTc1NyZvZT01NzlERTgwNidcblx0XHRcdH0sXG5cdFx0XHR1cmw6ICdodHRwOi8vbWF0ZXJpYWxpemVjc3MuY29tL2ltYWdlcy9vZmZpY2UuanBnJyxcblx0XHRcdGxpa2VzOiAxLFxuXHRcdFx0bGlrZWQ6IHRydWUsXG5cdFx0XHRjcmVhdGVkQXQ6IG5ldyBEYXRlKCkuc2V0RGF0ZShuZXcgRGF0ZSgpLmdldERhdGUoKSAtIDEwKVxuXHRcdH1cblx0XTtcblxuXHRlbXB0eShtYWluKS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZShwaWN0dXJlcykpO1xufSkiLCJ2YXIgeW8gPSByZXF1aXJlKCd5by15bycpO1xudmFyIGxheW91dCA9IHJlcXVpcmUoJy4uL2xheW91dCcpO1xudmFyIHBpY3R1cmUgPSByZXF1aXJlKCcuLi9waWN0dXJlLWNhcmQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocGljdHVyZXMpIHtcblxuXHR2YXIgZWwgPSB5b2A8ZGl2IGNsYXNzPVwiY29uYXRpbmVyIHRpbWVsaW5lXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJvd1wiPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbCBzMTIgbTEwIG9mZnNldC1tMSBsNiBvZmZzZXQtbDNcIj5cblx0XHRcdFx0XHRcdFx0JHtwaWN0dXJlcy5tYXAoZnVuY3Rpb24gKHBpYykge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBwaWN0dXJlKHBpYyk7XG5cdFx0XHRcdFx0XHRcdH0pfVxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PmA7XG5cdHJldHVybiBsYXlvdXQoZWwpO1xufSIsInZhciBwYWdlID0gcmVxdWlyZSgncGFnZScpO1xyXG5cclxucmVxdWlyZSgnLi9ob21lcGFnZScpO1xyXG5yZXF1aXJlKCcuL3NpZ251cCcpO1xyXG5yZXF1aXJlKCcuL3NpZ25pbicpO1xyXG5yZXF1aXJlKCcuL2Zvb3RlcicpO1xyXG5cclxucGFnZSgpOyIsInZhciB5byA9IHJlcXVpcmUoJ3lvLXlvJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGxhbmRpbmcoYm94KSB7XHJcblx0cmV0dXJuICB5b2A8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGxhbmRpbmdcIj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbCBzMTAgcHVzaC1zMVwiPlxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb2wgbTUgaGlkZS1vbi1zbWFsbC1vbmx5XCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDxpbWcgY2xhc3M9XCJpcGhvbmVcIiBzcmM9XCIuL2lwaG9uZS5wbmdcIiBhbHQ9XCJpcGhvbmVcIi8+XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdCR7Ym94fVxyXG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDwvZGl2PmA7XHJcbn0iLCJ2YXIgeW8gPSByZXF1aXJlKCd5by15bycpO1xyXG52YXIgdHJhbnNsYXRlID0gcmVxdWlyZSgnLi4vdHJhbnNsYXRlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGxheW91dChjb250ZW50KSB7XHJcblx0cmV0dXJuIHlvYDxkaXY+XHJcblx0XHRcdFx0XHQ8bmF2IGNsYXNzPVwiaGVhZGVyXCI+XHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJuYXYtd3JhcHBlclwiPlxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbCBzMTIgbTYgb2Zmc2V0LW0xXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PGEgaHJlZj1cIlwiIGNsYXNzPVwiYnJhbmQtbG9nbyBteWdyYW1cIj5NeUdyYW08L2E+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29sIHMyIG02IHB1c2gtczEwIHB1c2gtbTEwXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PGEgaHJlZj1cIiNcIiBjbGFzcz1cImJ0biBidG4tbGFyZ2UgYnRuLWZsYXQgZHJvcGRvd24tYnV0dG9uXCIgZGF0YS1hY3RpdmF0ZXM9XCJkcm9wLXVzZXJcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxpIGNsYXNzPVwiZmEgZmEtdXNlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8L2E+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PHVsIGlkPVwiZHJvcC11c2VyXCIgY2xhc3M9XCJkcm9wZG93bi1jb250ZW50XCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8bGk+PGEgaHJlZj1cIlwiPiR7dHJhbnNsYXRlLm1lc3NhZ2UoJ2xvZ291dCcpfTwvYT48L2xpPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvdWw+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0PC9uYXY+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxyXG5cdFx0XHRcdFx0XHQke2NvbnRlbnR9XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5gO1xyXG59IiwidmFyIHlvID0gcmVxdWlyZSgneW8teW8nKTtcbnZhciB0cmFuc2xhdGUgPSByZXF1aXJlKCcuLi90cmFuc2xhdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwaWN0dXJlQ2FyZChwaWMpIHtcblx0dmFyIGVsO1xuXHQvKmVzdGFtb3MgcGlzYW5kbyBwaWMqL1xuXHRmdW5jdGlvbiByZW5kZXIgKHBpY3R1cmUpIHtcblx0XHRyZXR1cm4geW8gYDxkaXYgY2xhc3M9XCJjYXJkICR7cGljdHVyZS5saWtlZCA/ICdsaWtlZCcgOiAnJ31cIj5cblx0XHRcdFx0XHQgICAgPGRpdiBjbGFzcz1cImNhcmQtaW1hZ2VcIj5cblx0XHRcdFx0XHQgICAgXHQ8aW1nIGNsYXNzPVwiYWN0aXZhdG9yXCIgc3JjPVwiJHtwaWN0dXJlLnVybH1cIj5cblx0XHRcdFx0XHQgICAgPC9kaXY+XG5cdFx0XHRcdFx0ICAgIDxkaXYgY2xhc3M9XCJjYXJkLWNvbnRlbnRcIj5cblx0XHRcdFx0XHQgICAgXHQ8YSBocmVmPVwiL3VzZXIvJHtwaWN0dXJlLnVzZXIudXNlcm5hbWV9XCIgY2xhc3M9XCJjYXJkLXRpdGxlXCI+XG5cdFx0XHRcdFx0ICAgIFx0XHQ8aW1nIHNyYz1cIiR7cGljdHVyZS51c2VyLmF2YXRhcn1cIiBjbGFzcz1cImF2YXRhclwiIGFsdD1cIlwiIC8+XG5cdFx0XHRcdFx0ICAgIFx0XHQ8c3BhbiBjbGFzcz1cInVzZXJuYW1lXCI+JHtwaWN0dXJlLnVzZXIudXNlcm5hbWV9PC9zcGFuPlxuXHRcdFx0XHRcdCAgICBcdDwvYT5cblx0XHRcdFx0XHQgICAgXHQ8c21hbGwgY2xhc3M9XCJyaWdodCB0aW1lXCI+JHt0cmFuc2xhdGUuZGF0ZS5mb3JtYXQocGljdHVyZS5jcmVhdGVkQXQpfTwvc21hbGw+XG5cdFx0XHRcdFx0ICAgIFx0PHA+XG5cdFx0XHRcdFx0ICAgIFx0XHQ8YSBocmVmPVwiI1wiIGNsYXNzPVwibGVmdFwiIG9uY2xpY2s9JHtsaWtlLmJpbmQobnVsbCwgdHJ1ZSl9PlxuXHRcdFx0XHRcdCAgICBcdFx0XHQ8aSBjbGFzcz1cImZhIGZhLWhlYXJ0LW9cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG5cdFx0XHRcdFx0ICAgIFx0XHQ8L2E+XG5cdFx0XHRcdFx0ICAgIFx0XHQ8YSBocmVmPVwiI1wiIGNsYXNzPVwibGVmdFwiIG9uY2xpY2s9JHtsaWtlLmJpbmQobnVsbCwgZmFsc2UpfT5cblx0XHRcdFx0XHQgICAgXHRcdFx0PGkgY2xhc3M9XCJmYSBmYS1oZWFydFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cblx0XHRcdFx0XHQgICAgXHRcdDwvYT5cblx0XHRcdFx0ICAgIFx0XHRcdDxzcGFuIGNsYXNzPVwibGVmdCBsaWtlc1wiPiR7dHJhbnNsYXRlLm1lc3NhZ2UoJ2xpa2VzJywgeyBsaWtlczogcGljdHVyZS5saWtlcyB9KX08L3NwYW4+XG5cdFx0XHRcdFx0ICAgIFx0PC9wPlxuXHRcdFx0XHRcdCAgICA8L2Rpdj5cblx0XHRcdFx0ICAgIDwvZGl2PmBcblx0fVxuXG4gICAgZnVuY3Rpb24gbGlrZSAobGlrZWQpIHtcbiAgICBcdHBpYy5saWtlZCA9IGxpa2VkO1xuICAgIFx0cGljLmxpa2VzICs9IGxpa2VkID8gMSA6IC0xO1xuICAgIFx0dmFyIG5ld0VsID0gcmVuZGVyKHBpYyk7XG4gICAgXHR5by51cGRhdGUoZWwsIG5ld0VsKTtcbiAgICBcdHJldHVybiBmYWxzZTsgLypxdWl0YSBjb21wb3J0YW1pZW50byBkZWZhdWx0IGRlIHRhZyBhKi9cbiAgICB9ICAgIFxuXG4gICAgZWwgPSByZW5kZXIocGljKTtcbiAgICByZXR1cm4gZWw7XG59IFxuXG4vKnRyYW5zbGF0ZS5tZXNzYWdlKCdsaWtlcycscGljdHVyZS5saWtlcykgPT4gbGlrZXMgZXMgZWwgc3RyaW5nIGEgdHJhZHVjaXIqLyIsInZhciBwYWdlID0gcmVxdWlyZSgncGFnZScpO1xudmFyIGVtcHR5ID0gcmVxdWlyZSgnZW1wdHktZWxlbWVudCcpO1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi90ZW1wbGF0ZScpO1xudmFyIHRpdGxlID0gcmVxdWlyZSgndGl0bGUnKTtcblxuXG5wYWdlKCcvc2lnbmluJywgZnVuY3Rpb24gKGN0eCwgbmV4dCkge1xuXHR0aXRsZSgnTXlHcmFtIC0gU2lnbmluJyk7XG5cdHZhciBtYWluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tY29udGFpbmVyJyk7XG5cdGVtcHR5KG1haW4pLmFwcGVuZENoaWxkKHRlbXBsYXRlKTtcbn0pIiwidmFyIHlvID0gcmVxdWlyZSgneW8teW8nKTtcbnZhciBsYW5kaW5nID0gcmVxdWlyZSgnLi4vbGFuZGluZycpO1xudmFyIHRyYW5zbGF0ZSA9IHJlcXVpcmUoJy4uL3RyYW5zbGF0ZScpO1xuXG52YXIgc2lnbmluRm9ybSA9IHlvYDxkaXYgY2xhc3M9XCJjb2wgczEyIG03XCI+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicm93XCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzaWdudXAtYm94XCI+XG5cdFx0XHRcdFx0XHRcdFx0PGgxIGNsYXNzPVwibXlncmFtXCI+TXlHcmFtPC9oMT5cblx0XHRcdFx0XHRcdFx0XHQ8Zm9ybSBjbGFzcz1cInNpZ251cC1mb3JtXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2VjdGlvblwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8YSBocmVmPVwiXCIgY2xhc3M9XCJidG4gYnRuLWZiIGhpZGUtb24tc21hbGwtb25seVwiPiR7dHJhbnNsYXRlLm1lc3NhZ2UoJ3NpZ251cC5mYWNlYm9vaycpfTwvYT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PGEgaHJlZj1cIlwiIGNsYXNzPVwiYnRuIGJ0bi1mYiBoaWRlLW9uLW1lZC1hbmQtdXBcIj48aSBjbGFzcz1cImZhIGZhLWZhY2Vib29rLW9mZmljaWFsXCI+PC9pPiR7dHJhbnNsYXRlLm1lc3NhZ2UoJ3NpZ251cC50ZXh0Jyl9PC9hPlxuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZGl2aWRlclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNlY3Rpb25cIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInVzZXJuYW1lZVwiIHBsYWNlaG9sZGVyPVwiJHt0cmFuc2xhdGUubWVzc2FnZSgndXNlcm5hbWUnKX1cIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIG5hbWU9XCJwYXNzd29yZFwiIHBsYWNlaG9sZGVyPVwiJHt0cmFuc2xhdGUubWVzc2FnZSgncGFzc3dvcmQnKX1cIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG4gd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0bi1zaWdudXBcIj4ke3RyYW5zbGF0ZS5tZXNzYWdlKCdzaWdudXAudGV4dCcpfTwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PC9mb3JtPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3dcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImxvZ2luLWJveFwiPlxuXHRcdFx0XHRcdFx0XHRcdCR7dHJhbnNsYXRlLm1lc3NhZ2UoJ3NpZ25pbi5ub3QtaGF2ZS1hY2NvdW50Jyl9IDxhIGhyZWY9XCIvc2lnbnVwXCI+JHt0cmFuc2xhdGUubWVzc2FnZSgnc2lnbnVwLmNhbGwtdG8tYWN0aW9uJyl9PC9hPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PmA7XG5cbm1vZHVsZS5leHBvcnRzID0gbGFuZGluZyhzaWduaW5Gb3JtKTsiLCJ2YXIgcGFnZSA9IHJlcXVpcmUoJ3BhZ2UnKTtcbnZhciBlbXB0eSA9IHJlcXVpcmUoJ2VtcHR5LWVsZW1lbnQnKTtcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vdGVtcGxhdGUnKTtcbnZhciB0aXRsZSA9IHJlcXVpcmUoJ3RpdGxlJyk7XG5cblxucGFnZSgnL3NpZ251cCcsIGZ1bmN0aW9uIChjdHgsIG5leHQpIHtcblx0dGl0bGUoJ015R3JhbSAtIFNpZ251cCcpO1xuXHR2YXIgbWFpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWNvbnRhaW5lcicpO1xuXHRlbXB0eShtYWluKS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZSk7XG59KSIsInZhciB5byA9IHJlcXVpcmUoJ3lvLXlvJyk7XG52YXIgbGFuZGluZyA9IHJlcXVpcmUoJy4uL2xhbmRpbmcnKTtcbnZhciB0cmFuc2xhdGUgPSByZXF1aXJlKCcuLi90cmFuc2xhdGUnKTtcblxudmFyIHNpZ251cEZvcm0gPSB5b2A8ZGl2IGNsYXNzPVwiY29sIHMxMiBtN1wiPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJvd1wiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2lnbnVwLWJveFwiPlxuXHRcdFx0XHRcdFx0XHRcdDxoMSBjbGFzcz1cIm15Z3JhbVwiPk15R3JhbTwvaDE+XG5cdFx0XHRcdFx0XHRcdFx0PGZvcm0gYWN0aW9uPVwiXCIgY2xhc3M9XCJzaWdudXAtZm9ybVwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGgyPiR7dHJhbnNsYXRlLm1lc3NhZ2UoJ3NpZ251cC5zdWJoZWFkaW5nJyl9PC9oMj5cblx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzZWN0aW9uXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxhIGhyZWY9XCJcIiBjbGFzcz1cImJ0biBidG4tZmIgaGlkZS1vbi1zbWFsbC1vbmx5XCI+JHt0cmFuc2xhdGUubWVzc2FnZSgnc2lnbnVwLmZhY2Vib29rJyl9PC9hPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8YSBocmVmPVwiXCIgY2xhc3M9XCJidG4gYnRuLWZiIGhpZGUtb24tbWVkLWFuZC11cFwiPjxpIGNsYXNzPVwiZmEgZmEtZmFjZWJvb2stb2ZmaWNpYWxcIj48L2k+JHt0cmFuc2xhdGUubWVzc2FnZSgnc2lnbnVwLnRleHQnKX08L2E+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJkaXZpZGVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2VjdGlvblwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cImVtYWlsXCIgcGxhY2Vob2xkZXI9XCIke3RyYW5zbGF0ZS5tZXNzYWdlKCdlbWFpbCcpfVwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibmFtZVwiIHBsYWNlaG9sZGVyPVwiJHt0cmFuc2xhdGUubWVzc2FnZSgndXNlcm5hbWUnKX1cIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInVzZXJuYW1lZVwiIHBsYWNlaG9sZGVyPVwiJHt0cmFuc2xhdGUubWVzc2FnZSgnZnVsbG5hbWUnKX1cIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIG5hbWU9XCJwYXNzd29yZFwiIHBsYWNlaG9sZGVyPVwiJHt0cmFuc2xhdGUubWVzc2FnZSgncGFzc3dvcmQnKX1cIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG4gd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0bi1zaWdudXBcIj4ke3RyYW5zbGF0ZS5tZXNzYWdlKCdzaWdudXAuY2FsbC10by1hY3Rpb24nKX08L2J1dHRvbj5cblx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDwvZm9ybT5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicm93XCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJsb2dpbi1ib3hcIj5cblx0XHRcdFx0XHRcdFx0XHQke3RyYW5zbGF0ZS5tZXNzYWdlKCdzaWdudXAuaGF2ZS1hY2NvdW50Jyl9IDxhIGhyZWY9XCIvc2lnbmluXCI+JHt0cmFuc2xhdGUubWVzc2FnZSgnc2lnbmluJyl9PC9hPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PmA7XG5cbm1vZHVsZS5leHBvcnRzID0gbGFuZGluZyhzaWdudXBGb3JtKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRsaWtlczogJ3sgbGlrZXMsIHBsdXJhbCwgJyArICAgLypwcnVyYWwgZXMgZWwgdGlwbyBkZSBkYXRvKi9cclxuICAgICAgICAgICAgJz0wIHtubyBsaWtlc30nICtcclxuICAgICAgICAgICAgJz0xIHsjIGxpa2V9JyArXHJcbiAgICAgICAgICAgICdvdGhlciB7IyBsaWtlc319JyxcclxuXHRsb2dvdXQ6ICdMb2dvdXQnLFxyXG5cdGVuZ2xpc2g6ICdFbmdsaXNoJyxcclxuXHRzcGFuaXNoOiAnU3BhbmlzaCcsXHJcblx0J3NpZ251cC5zdWJoZWFkaW5nJzogJ1NpZ251cCB0byB3YXRjaCB5b3VyIGZyaWVuZHNcXCcgc3R1ZGVudHMnLFxyXG5cdCdzaWdudXAuZmFjZWJvb2snOiAnU2lnbnVwIHdpdGggRmFjZWJvb2snLFxyXG4gICAgJ3NpZ251cC50ZXh0JzogJ1NpZ251cCcsXHJcbiAgICAnZW1haWwnOiAnRW1haWwnLFxyXG4gICAgJ3VzZXJuYW1lJzogJ1VzZXIgbmFtZScsXHJcbiAgICAnZnVsbG5hbWUnOiAnRnVsbCBuYW1lJyxcclxuICAgICdwYXNzd29yZCc6ICdQYXNzd29yZCcsXHJcbiAgICAnc2lnbnVwLmNhbGwtdG8tYWN0aW9uJzogJ1Npbmd1cCcsXHJcbiAgICAnc2lnbnVwLmhhdmUtYWNjb3VudCc6ICdBbHJlYWR5IGhhdmUgYW4gYWNjb3VudD8nLFxyXG4gICAgJ3NpZ25pbic6ICdTaWduaW4nLFxyXG4gICAgJ3NpZ25pbi5ub3QtaGF2ZS1hY2NvdW50JzogJ0RvblxcJ3QgaGF2ZSBhbiBhY2NvdW50PycsXHJcbiAgICAnbGFuZ3VhZ2UnOiAnTGFuZ3VhZ2UnXHJcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRsaWtlczogJ3sgbGlrZXMsIG51bWJlcn0gbWUgZ3VzdGEnLCAgIC8qbnVtYmVyIGVzIGVsIHRpcG8gZGUgZGF0byovXHJcblx0bG9nb3V0OiAnU2FsaXInLFxyXG5cdGVuZ2xpc2g6ICdJbmdsZXMnLFxyXG5cdFNwYW5pc2g6ICdFc3Bhw7FvbCcsXHJcblx0J3NpZ251cC5zdWJoZWFkaW5nJzogJ1JlZ2lzdHJhdGUgcGFyYSB2ZXIgZm90b3MgZGUgdHVzIGFtaWdvcyBlc3R1ZGlhbnRlcycsXHJcblx0J3NpZ251cC5mYWNlYm9vayc6ICdJbmljaWFyIHNlc2nDs24gY29uIEZhY2Vib29rJyxcclxuICAgICdzaWdudXAudGV4dCc6ICdJbmljaWFyIHNlc2nDs24nLFxyXG4gICAgJ2VtYWlsJzogJ0NvcnJlbyBlbGVjdHLDs25pY28nLFxyXG4gICAgJ3VzZXJuYW1lJzogJ05vbWJyZSBkZSB1c3VhcmlvJyxcclxuICAgICdmdWxsbmFtZSc6ICdOb21icmUgY29tcGxldG8nLFxyXG4gICAgJ3Bhc3N3b3JkJzogJ0NvbnRyYXNlw7FhJyxcclxuICAgICdzaWdudXAuY2FsbC10by1hY3Rpb24nOiAnUmVnw61zdHJhdGUnLFxyXG4gICAgJ3NpZ251cC5oYXZlLWFjY291bnQnOiAnwr9UaWVuZXMgdW5hIGN1ZW50YT8nLFxyXG4gICAgJ3NpZ25pbic6ICdFbnRyYXInLFxyXG4gICAgJ3NpZ25pbi5ub3QtaGF2ZS1hY2NvdW50JzogJ8K/Tm8gdGllbmVzIHVuYSBjdWVudGE/JyxcclxuICAgICdsYW5ndWFnZSc6ICdJZGlvbWEnXHJcbn0iLCIvKnNvcG9ydGUgc2FmYXJpKi9cclxuaWYgKCF3aW5kb3cuSW50bCkge1xyXG4gICAgd2luZG93LkludGwgPSByZXF1aXJlKCdpbnRsJyk7IC8vIHBvbHlmaWxsIGZvciBgSW50bGBcclxuICAgIHJlcXVpcmUoJ2ludGwvbG9jYWxlLWRhdGEvanNvbnAvZW4tVVMuanMnKTtcclxuICAgIHJlcXVpcmUoJ2ludGwvbG9jYWxlLWRhdGEvanNvbnAvZXMuanMnKTtcclxufVxyXG5cclxuLypmZWNoYXMqL1xyXG52YXIgSW50bFJlbGF0aXZlRm9ybWF0ID0gd2luZG93LkludGxSZWxhdGl2ZUZvcm1hdCA9IHJlcXVpcmUoJ2ludGwtcmVsYXRpdmVmb3JtYXQnKTtcclxuXHJcbnJlcXVpcmUoJ2ludGwtcmVsYXRpdmVmb3JtYXQvZGlzdC9sb2NhbGUtZGF0YS9lbi5qcycpO1xyXG5yZXF1aXJlKCdpbnRsLXJlbGF0aXZlZm9ybWF0L2Rpc3QvbG9jYWxlLWRhdGEvZXMuanMnKTtcclxuXHJcblxyXG5cclxuXHJcbi8qdGV4dG9zKi9cclxudmFyIEludGxNZXNzYWdlRm9ybWF0ID0gcmVxdWlyZSgnaW50bC1tZXNzYWdlZm9ybWF0Jyk7XHJcblxyXG4vKmh0dHBzOi8vZ2l0aHViLmNvbS95YWhvby9pbnRsLW1lc3NhZ2Vmb3JtYXQqL1xyXG52YXIgZXMgPSByZXF1aXJlKCcuL2VzJyk7XHJcbnZhciBlbiA9IHJlcXVpcmUoJy4vZW4tVVMnKTtcclxuXHJcbnZhciBNRVNTQUdFUyA9IHt9O1xyXG5NRVNTQUdFUy5lcyA9IGVzO1xyXG5NRVNTQUdFU1snZW4tVVMnXSA9IGVuO1xyXG5cclxuXHJcbnZhciBsb2NhbGUgPSAnZW4tVVMnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0bWVzc2FnZTogZnVuY3Rpb24gKHRleHQsIG9wdHMpIHtcclxuXHRcdG9wdHMgPSBvcHRzIHx8IHt9O1xyXG5cdFx0dmFyIG1zZyA9IG5ldyBJbnRsTWVzc2FnZUZvcm1hdChNRVNTQUdFU1tsb2NhbGVdW3RleHRdLCBsb2NhbGUsIG51bGwpO1xyXG5cdFx0cmV0dXJuIG1zZy5mb3JtYXQob3B0cyk7XHJcblx0fSxcclxuXHRkYXRlOiBuZXcgSW50bFJlbGF0aXZlRm9ybWF0KGxvY2FsZSlcclxufSBcclxuXHJcblxyXG4vKk1FU1NBR0VTW2xvY2FsZV1bdGV4dF0gc2UgZXN0YSByZWZpcmllbmRvIGEgbGEgcHJvcGllZGFkIHF1ZSBub3MgbGxlZ3VlKi8iXX0=
