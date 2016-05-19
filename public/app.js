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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./lib/locales":1,"./lib/main":11}],7:[function(require,module,exports){
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


},{"./diff":8,"./es5":10,"intl-messageformat":12}],8:[function(require,module,exports){
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


},{}],9:[function(require,module,exports){
// GENERATED FILE
"use strict";
exports["default"] = {"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"one":"in {0} year","other":"in {0} years"},"past":{"one":"{0} year ago","other":"{0} years ago"}}},"month":{"displayName":"month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"one":"in {0} month","other":"in {0} months"},"past":{"one":"{0} month ago","other":"{0} months ago"}}},"day":{"displayName":"day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"one":"in {0} day","other":"in {0} days"},"past":{"one":"{0} day ago","other":"{0} days ago"}}},"hour":{"displayName":"hour","relativeTime":{"future":{"one":"in {0} hour","other":"in {0} hours"},"past":{"one":"{0} hour ago","other":"{0} hours ago"}}},"minute":{"displayName":"minute","relativeTime":{"future":{"one":"in {0} minute","other":"in {0} minutes"},"past":{"one":"{0} minute ago","other":"{0} minutes ago"}}},"second":{"displayName":"second","relative":{"0":"now"},"relativeTime":{"future":{"one":"in {0} second","other":"in {0} seconds"},"past":{"one":"{0} second ago","other":"{0} seconds ago"}}}}};


},{}],10:[function(require,module,exports){
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


},{}],11:[function(require,module,exports){
/* jslint esnext: true */

"use strict";
var src$core$$ = require("./core"), src$en$$ = require("./en");

src$core$$["default"].__addLocaleData(src$en$$["default"]);
src$core$$["default"].defaultLocale = 'en';

exports["default"] = src$core$$["default"];


},{"./core":7,"./en":9}],12:[function(require,module,exports){
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

},{"./lib/locales":1,"./lib/main":17}],13:[function(require,module,exports){
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


},{}],14:[function(require,module,exports){
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


},{"./compiler":13,"./es5":16,"./utils":18,"intl-messageformat-parser":19}],15:[function(require,module,exports){
// GENERATED FILE
"use strict";
exports["default"] = {"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"}};


},{}],16:[function(require,module,exports){
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


},{"./utils":18}],17:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"./core":14,"./en":15,"dup":11}],18:[function(require,module,exports){
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


},{}],19:[function(require,module,exports){
'use strict';

exports = module.exports = require('./lib/parser')['default'];
exports['default'] = exports;

},{"./lib/parser":20}],20:[function(require,module,exports){
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


},{}],21:[function(require,module,exports){
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

},{"./lib/core.js":22,"./locale-data/complete.js":1}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
IntlPolyfill.__addLocaleData({locale:"en-US",date:{ca:["gregory","buddhist","chinese","coptic","dangi","ethioaa","ethiopic","generic","hebrew","indian","islamic","islamicc","japanese","persian","roc"],hourNo0:true,hour12:true,formats:{short:"{1}, {0}",medium:"{1}, {0}",full:"{1} 'at' {0}",long:"{1} 'at' {0}",availableFormats:{"d":"d","E":"ccc",Ed:"d E",Ehm:"E h:mm a",EHm:"E HH:mm",Ehms:"E h:mm:ss a",EHms:"E HH:mm:ss",Gy:"y G",GyMMM:"MMM y G",GyMMMd:"MMM d, y G",GyMMMEd:"E, MMM d, y G","h":"h a","H":"HH",hm:"h:mm a",Hm:"HH:mm",hms:"h:mm:ss a",Hms:"HH:mm:ss",hmsv:"h:mm:ss a v",Hmsv:"HH:mm:ss v",hmv:"h:mm a v",Hmv:"HH:mm v","M":"L",Md:"M/d",MEd:"E, M/d",MMM:"LLL",MMMd:"MMM d",MMMEd:"E, MMM d",MMMMd:"MMMM d",ms:"mm:ss","y":"y",yM:"M/y",yMd:"M/d/y",yMEd:"E, M/d/y",yMMM:"MMM y",yMMMd:"MMM d, y",yMMMEd:"E, MMM d, y",yMMMM:"MMMM y",yQQQ:"QQQ y",yQQQQ:"QQQQ y"},dateFormats:{yMMMMEEEEd:"EEEE, MMMM d, y",yMMMMd:"MMMM d, y",yMMMd:"MMM d, y",yMd:"M/d/yy"},timeFormats:{hmmsszzzz:"h:mm:ss a zzzz",hmsz:"h:mm:ss a z",hms:"h:mm:ss a",hm:"h:mm a"}},calendars:{buddhist:{months:{narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],short:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],long:["January","February","March","April","May","June","July","August","September","October","November","December"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["BE"],short:["BE"],long:["BE"]},dayPeriods:{am:"AM",pm:"PM"}},chinese:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Mo1","Mo2","Mo3","Mo4","Mo5","Mo6","Mo7","Mo8","Mo9","Mo10","Mo11","Mo12"],long:["Month1","Month2","Month3","Month4","Month5","Month6","Month7","Month8","Month9","Month10","Month11","Month12"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},dayPeriods:{am:"AM",pm:"PM"}},coptic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13"],short:["Tout","Baba","Hator","Kiahk","Toba","Amshir","Baramhat","Baramouda","Bashans","Paona","Epep","Mesra","Nasie"],long:["Tout","Baba","Hator","Kiahk","Toba","Amshir","Baramhat","Baramouda","Bashans","Paona","Epep","Mesra","Nasie"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["ERA0","ERA1"],short:["ERA0","ERA1"],long:["ERA0","ERA1"]},dayPeriods:{am:"AM",pm:"PM"}},dangi:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Mo1","Mo2","Mo3","Mo4","Mo5","Mo6","Mo7","Mo8","Mo9","Mo10","Mo11","Mo12"],long:["Month1","Month2","Month3","Month4","Month5","Month6","Month7","Month8","Month9","Month10","Month11","Month12"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},dayPeriods:{am:"AM",pm:"PM"}},ethiopic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13"],short:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"],long:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["ERA0","ERA1"],short:["ERA0","ERA1"],long:["ERA0","ERA1"]},dayPeriods:{am:"AM",pm:"PM"}},ethioaa:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13"],short:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"],long:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["ERA0"],short:["ERA0"],long:["ERA0"]},dayPeriods:{am:"AM",pm:"PM"}},generic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12"],long:["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["ERA0","ERA1"],short:["ERA0","ERA1"],long:["ERA0","ERA1"]},dayPeriods:{am:"AM",pm:"PM"}},gregory:{months:{narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],short:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],long:["January","February","March","April","May","June","July","August","September","October","November","December"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["B","A","BCE","CE"],short:["BC","AD","BCE","CE"],long:["Before Christ","Anno Domini","Before Common Era","Common Era"]},dayPeriods:{am:"AM",pm:"PM"}},hebrew:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13","7"],short:["Tishri","Heshvan","Kislev","Tevet","Shevat","Adar I","Adar","Nisan","Iyar","Sivan","Tamuz","Av","Elul","Adar II"],long:["Tishri","Heshvan","Kislev","Tevet","Shevat","Adar I","Adar","Nisan","Iyar","Sivan","Tamuz","Av","Elul","Adar II"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["AM"],short:["AM"],long:["AM"]},dayPeriods:{am:"AM",pm:"PM"}},indian:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Chaitra","Vaisakha","Jyaistha","Asadha","Sravana","Bhadra","Asvina","Kartika","Agrahayana","Pausa","Magha","Phalguna"],long:["Chaitra","Vaisakha","Jyaistha","Asadha","Sravana","Bhadra","Asvina","Kartika","Agrahayana","Pausa","Magha","Phalguna"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["Saka"],short:["Saka"],long:["Saka"]},dayPeriods:{am:"AM",pm:"PM"}},islamic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Muh.","Saf.","Rab. I","Rab. II","Jum. I","Jum. II","Raj.","Sha.","Ram.","Shaw.","Dhuʻl-Q.","Dhuʻl-H."],long:["Muharram","Safar","Rabiʻ I","Rabiʻ II","Jumada I","Jumada II","Rajab","Shaʻban","Ramadan","Shawwal","Dhuʻl-Qiʻdah","Dhuʻl-Hijjah"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["AH"],short:["AH"],long:["AH"]},dayPeriods:{am:"AM",pm:"PM"}},islamicc:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Muh.","Saf.","Rab. I","Rab. II","Jum. I","Jum. II","Raj.","Sha.","Ram.","Shaw.","Dhuʻl-Q.","Dhuʻl-H."],long:["Muharram","Safar","Rabiʻ I","Rabiʻ II","Jumada I","Jumada II","Rajab","Shaʻban","Ramadan","Shawwal","Dhuʻl-Qiʻdah","Dhuʻl-Hijjah"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["AH"],short:["AH"],long:["AH"]},dayPeriods:{am:"AM",pm:"PM"}},japanese:{months:{narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],short:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],long:["January","February","March","April","May","June","July","August","September","October","November","December"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["Taika (645–650)","Hakuchi (650–671)","Hakuhō (672–686)","Shuchō (686–701)","Taihō (701–704)","Keiun (704–708)","Wadō (708–715)","Reiki (715–717)","Yōrō (717–724)","Jinki (724–729)","Tenpyō (729–749)","Tenpyō-kampō (749-749)","Tenpyō-shōhō (749-757)","Tenpyō-hōji (757-765)","Tenpyō-jingo (765-767)","Jingo-keiun (767-770)","Hōki (770–780)","Ten-ō (781-782)","Enryaku (782–806)","Daidō (806–810)","Kōnin (810–824)","Tenchō (824–834)","Jōwa (834–848)","Kajō (848–851)","Ninju (851–854)","Saikō (854–857)","Ten-an (857-859)","Jōgan (859–877)","Gangyō (877–885)","Ninna (885–889)","Kanpyō (889–898)","Shōtai (898–901)","Engi (901–923)","Enchō (923–931)","Jōhei (931–938)","Tengyō (938–947)","Tenryaku (947–957)","Tentoku (957–961)","Ōwa (961–964)","Kōhō (964–968)","Anna (968–970)","Tenroku (970–973)","Ten’en (973–976)","Jōgen (976–978)","Tengen (978–983)","Eikan (983–985)","Kanna (985–987)","Eien (987–989)","Eiso (989–990)","Shōryaku (990–995)","Chōtoku (995–999)","Chōhō (999–1004)","Kankō (1004–1012)","Chōwa (1012–1017)","Kannin (1017–1021)","Jian (1021–1024)","Manju (1024–1028)","Chōgen (1028–1037)","Chōryaku (1037–1040)","Chōkyū (1040–1044)","Kantoku (1044–1046)","Eishō (1046–1053)","Tengi (1053–1058)","Kōhei (1058–1065)","Jiryaku (1065–1069)","Enkyū (1069–1074)","Shōho (1074–1077)","Shōryaku (1077–1081)","Eihō (1081–1084)","Ōtoku (1084–1087)","Kanji (1087–1094)","Kahō (1094–1096)","Eichō (1096–1097)","Jōtoku (1097–1099)","Kōwa (1099–1104)","Chōji (1104–1106)","Kashō (1106–1108)","Tennin (1108–1110)","Ten-ei (1110-1113)","Eikyū (1113–1118)","Gen’ei (1118–1120)","Hōan (1120–1124)","Tenji (1124–1126)","Daiji (1126–1131)","Tenshō (1131–1132)","Chōshō (1132–1135)","Hōen (1135–1141)","Eiji (1141–1142)","Kōji (1142–1144)","Ten’yō (1144–1145)","Kyūan (1145–1151)","Ninpei (1151–1154)","Kyūju (1154–1156)","Hōgen (1156–1159)","Heiji (1159–1160)","Eiryaku (1160–1161)","Ōho (1161–1163)","Chōkan (1163–1165)","Eiman (1165–1166)","Nin’an (1166–1169)","Kaō (1169–1171)","Shōan (1171–1175)","Angen (1175–1177)","Jishō (1177–1181)","Yōwa (1181–1182)","Juei (1182–1184)","Genryaku (1184–1185)","Bunji (1185–1190)","Kenkyū (1190–1199)","Shōji (1199–1201)","Kennin (1201–1204)","Genkyū (1204–1206)","Ken’ei (1206–1207)","Jōgen (1207–1211)","Kenryaku (1211–1213)","Kenpō (1213–1219)","Jōkyū (1219–1222)","Jōō (1222–1224)","Gennin (1224–1225)","Karoku (1225–1227)","Antei (1227–1229)","Kanki (1229–1232)","Jōei (1232–1233)","Tenpuku (1233–1234)","Bunryaku (1234–1235)","Katei (1235–1238)","Ryakunin (1238–1239)","En’ō (1239–1240)","Ninji (1240–1243)","Kangen (1243–1247)","Hōji (1247–1249)","Kenchō (1249–1256)","Kōgen (1256–1257)","Shōka (1257–1259)","Shōgen (1259–1260)","Bun’ō (1260–1261)","Kōchō (1261–1264)","Bun’ei (1264–1275)","Kenji (1275–1278)","Kōan (1278–1288)","Shōō (1288–1293)","Einin (1293–1299)","Shōan (1299–1302)","Kengen (1302–1303)","Kagen (1303–1306)","Tokuji (1306–1308)","Enkyō (1308–1311)","Ōchō (1311–1312)","Shōwa (1312–1317)","Bunpō (1317–1319)","Genō (1319–1321)","Genkō (1321–1324)","Shōchū (1324–1326)","Karyaku (1326–1329)","Gentoku (1329–1331)","Genkō (1331–1334)","Kenmu (1334–1336)","Engen (1336–1340)","Kōkoku (1340–1346)","Shōhei (1346–1370)","Kentoku (1370–1372)","Bunchū (1372–1375)","Tenju (1375–1379)","Kōryaku (1379–1381)","Kōwa (1381–1384)","Genchū (1384–1392)","Meitoku (1384–1387)","Kakei (1387–1389)","Kōō (1389–1390)","Meitoku (1390–1394)","Ōei (1394–1428)","Shōchō (1428–1429)","Eikyō (1429–1441)","Kakitsu (1441–1444)","Bun’an (1444–1449)","Hōtoku (1449–1452)","Kyōtoku (1452–1455)","Kōshō (1455–1457)","Chōroku (1457–1460)","Kanshō (1460–1466)","Bunshō (1466–1467)","Ōnin (1467–1469)","Bunmei (1469–1487)","Chōkyō (1487–1489)","Entoku (1489–1492)","Meiō (1492–1501)","Bunki (1501–1504)","Eishō (1504–1521)","Taiei (1521–1528)","Kyōroku (1528–1532)","Tenbun (1532–1555)","Kōji (1555–1558)","Eiroku (1558–1570)","Genki (1570–1573)","Tenshō (1573–1592)","Bunroku (1592–1596)","Keichō (1596–1615)","Genna (1615–1624)","Kan’ei (1624–1644)","Shōho (1644–1648)","Keian (1648–1652)","Jōō (1652–1655)","Meireki (1655–1658)","Manji (1658–1661)","Kanbun (1661–1673)","Enpō (1673–1681)","Tenna (1681–1684)","Jōkyō (1684–1688)","Genroku (1688–1704)","Hōei (1704–1711)","Shōtoku (1711–1716)","Kyōhō (1716–1736)","Genbun (1736–1741)","Kanpō (1741–1744)","Enkyō (1744–1748)","Kan’en (1748–1751)","Hōreki (1751–1764)","Meiwa (1764–1772)","An’ei (1772–1781)","Tenmei (1781–1789)","Kansei (1789–1801)","Kyōwa (1801–1804)","Bunka (1804–1818)","Bunsei (1818–1830)","Tenpō (1830–1844)","Kōka (1844–1848)","Kaei (1848–1854)","Ansei (1854–1860)","Man’en (1860–1861)","Bunkyū (1861–1864)","Genji (1864–1865)","Keiō (1865–1868)","M","T","S","H"],short:["Taika (645–650)","Hakuchi (650–671)","Hakuhō (672–686)","Shuchō (686–701)","Taihō (701–704)","Keiun (704–708)","Wadō (708–715)","Reiki (715–717)","Yōrō (717–724)","Jinki (724–729)","Tenpyō (729–749)","Tenpyō-kampō (749-749)","Tenpyō-shōhō (749-757)","Tenpyō-hōji (757-765)","Tenpyō-jingo (765-767)","Jingo-keiun (767-770)","Hōki (770–780)","Ten-ō (781-782)","Enryaku (782–806)","Daidō (806–810)","Kōnin (810–824)","Tenchō (824–834)","Jōwa (834–848)","Kajō (848–851)","Ninju (851–854)","Saikō (854–857)","Ten-an (857-859)","Jōgan (859–877)","Gangyō (877–885)","Ninna (885–889)","Kanpyō (889–898)","Shōtai (898–901)","Engi (901–923)","Enchō (923–931)","Jōhei (931–938)","Tengyō (938–947)","Tenryaku (947–957)","Tentoku (957–961)","Ōwa (961–964)","Kōhō (964–968)","Anna (968–970)","Tenroku (970–973)","Ten’en (973–976)","Jōgen (976–978)","Tengen (978–983)","Eikan (983–985)","Kanna (985–987)","Eien (987–989)","Eiso (989–990)","Shōryaku (990–995)","Chōtoku (995–999)","Chōhō (999–1004)","Kankō (1004–1012)","Chōwa (1012–1017)","Kannin (1017–1021)","Jian (1021–1024)","Manju (1024–1028)","Chōgen (1028–1037)","Chōryaku (1037–1040)","Chōkyū (1040–1044)","Kantoku (1044–1046)","Eishō (1046–1053)","Tengi (1053–1058)","Kōhei (1058–1065)","Jiryaku (1065–1069)","Enkyū (1069–1074)","Shōho (1074–1077)","Shōryaku (1077–1081)","Eihō (1081–1084)","Ōtoku (1084–1087)","Kanji (1087–1094)","Kahō (1094–1096)","Eichō (1096–1097)","Jōtoku (1097–1099)","Kōwa (1099–1104)","Chōji (1104–1106)","Kashō (1106–1108)","Tennin (1108–1110)","Ten-ei (1110-1113)","Eikyū (1113–1118)","Gen’ei (1118–1120)","Hōan (1120–1124)","Tenji (1124–1126)","Daiji (1126–1131)","Tenshō (1131–1132)","Chōshō (1132–1135)","Hōen (1135–1141)","Eiji (1141–1142)","Kōji (1142–1144)","Ten’yō (1144–1145)","Kyūan (1145–1151)","Ninpei (1151–1154)","Kyūju (1154–1156)","Hōgen (1156–1159)","Heiji (1159–1160)","Eiryaku (1160–1161)","Ōho (1161–1163)","Chōkan (1163–1165)","Eiman (1165–1166)","Nin’an (1166–1169)","Kaō (1169–1171)","Shōan (1171–1175)","Angen (1175–1177)","Jishō (1177–1181)","Yōwa (1181–1182)","Juei (1182–1184)","Genryaku (1184–1185)","Bunji (1185–1190)","Kenkyū (1190–1199)","Shōji (1199–1201)","Kennin (1201–1204)","Genkyū (1204–1206)","Ken’ei (1206–1207)","Jōgen (1207–1211)","Kenryaku (1211–1213)","Kenpō (1213–1219)","Jōkyū (1219–1222)","Jōō (1222–1224)","Gennin (1224–1225)","Karoku (1225–1227)","Antei (1227–1229)","Kanki (1229–1232)","Jōei (1232–1233)","Tenpuku (1233–1234)","Bunryaku (1234–1235)","Katei (1235–1238)","Ryakunin (1238–1239)","En’ō (1239–1240)","Ninji (1240–1243)","Kangen (1243–1247)","Hōji (1247–1249)","Kenchō (1249–1256)","Kōgen (1256–1257)","Shōka (1257–1259)","Shōgen (1259–1260)","Bun’ō (1260–1261)","Kōchō (1261–1264)","Bun’ei (1264–1275)","Kenji (1275–1278)","Kōan (1278–1288)","Shōō (1288–1293)","Einin (1293–1299)","Shōan (1299–1302)","Kengen (1302–1303)","Kagen (1303–1306)","Tokuji (1306–1308)","Enkyō (1308–1311)","Ōchō (1311–1312)","Shōwa (1312–1317)","Bunpō (1317–1319)","Genō (1319–1321)","Genkō (1321–1324)","Shōchū (1324–1326)","Karyaku (1326–1329)","Gentoku (1329–1331)","Genkō (1331–1334)","Kenmu (1334–1336)","Engen (1336–1340)","Kōkoku (1340–1346)","Shōhei (1346–1370)","Kentoku (1370–1372)","Bunchū (1372–1375)","Tenju (1375–1379)","Kōryaku (1379–1381)","Kōwa (1381–1384)","Genchū (1384–1392)","Meitoku (1384–1387)","Kakei (1387–1389)","Kōō (1389–1390)","Meitoku (1390–1394)","Ōei (1394–1428)","Shōchō (1428–1429)","Eikyō (1429–1441)","Kakitsu (1441–1444)","Bun’an (1444–1449)","Hōtoku (1449–1452)","Kyōtoku (1452–1455)","Kōshō (1455–1457)","Chōroku (1457–1460)","Kanshō (1460–1466)","Bunshō (1466–1467)","Ōnin (1467–1469)","Bunmei (1469–1487)","Chōkyō (1487–1489)","Entoku (1489–1492)","Meiō (1492–1501)","Bunki (1501–1504)","Eishō (1504–1521)","Taiei (1521–1528)","Kyōroku (1528–1532)","Tenbun (1532–1555)","Kōji (1555–1558)","Eiroku (1558–1570)","Genki (1570–1573)","Tenshō (1573–1592)","Bunroku (1592–1596)","Keichō (1596–1615)","Genna (1615–1624)","Kan’ei (1624–1644)","Shōho (1644–1648)","Keian (1648–1652)","Jōō (1652–1655)","Meireki (1655–1658)","Manji (1658–1661)","Kanbun (1661–1673)","Enpō (1673–1681)","Tenna (1681–1684)","Jōkyō (1684–1688)","Genroku (1688–1704)","Hōei (1704–1711)","Shōtoku (1711–1716)","Kyōhō (1716–1736)","Genbun (1736–1741)","Kanpō (1741–1744)","Enkyō (1744–1748)","Kan’en (1748–1751)","Hōreki (1751–1764)","Meiwa (1764–1772)","An’ei (1772–1781)","Tenmei (1781–1789)","Kansei (1789–1801)","Kyōwa (1801–1804)","Bunka (1804–1818)","Bunsei (1818–1830)","Tenpō (1830–1844)","Kōka (1844–1848)","Kaei (1848–1854)","Ansei (1854–1860)","Man’en (1860–1861)","Bunkyū (1861–1864)","Genji (1864–1865)","Keiō (1865–1868)","Meiji","Taishō","Shōwa","Heisei"],long:["Taika (645–650)","Hakuchi (650–671)","Hakuhō (672–686)","Shuchō (686–701)","Taihō (701–704)","Keiun (704–708)","Wadō (708–715)","Reiki (715–717)","Yōrō (717–724)","Jinki (724–729)","Tenpyō (729–749)","Tenpyō-kampō (749-749)","Tenpyō-shōhō (749-757)","Tenpyō-hōji (757-765)","Tenpyō-jingo (765-767)","Jingo-keiun (767-770)","Hōki (770–780)","Ten-ō (781-782)","Enryaku (782–806)","Daidō (806–810)","Kōnin (810–824)","Tenchō (824–834)","Jōwa (834–848)","Kajō (848–851)","Ninju (851–854)","Saikō (854–857)","Ten-an (857-859)","Jōgan (859–877)","Gangyō (877–885)","Ninna (885–889)","Kanpyō (889–898)","Shōtai (898–901)","Engi (901–923)","Enchō (923–931)","Jōhei (931–938)","Tengyō (938–947)","Tenryaku (947–957)","Tentoku (957–961)","Ōwa (961–964)","Kōhō (964–968)","Anna (968–970)","Tenroku (970–973)","Ten’en (973–976)","Jōgen (976–978)","Tengen (978–983)","Eikan (983–985)","Kanna (985–987)","Eien (987–989)","Eiso (989–990)","Shōryaku (990–995)","Chōtoku (995–999)","Chōhō (999–1004)","Kankō (1004–1012)","Chōwa (1012–1017)","Kannin (1017–1021)","Jian (1021–1024)","Manju (1024–1028)","Chōgen (1028–1037)","Chōryaku (1037–1040)","Chōkyū (1040–1044)","Kantoku (1044–1046)","Eishō (1046–1053)","Tengi (1053–1058)","Kōhei (1058–1065)","Jiryaku (1065–1069)","Enkyū (1069–1074)","Shōho (1074–1077)","Shōryaku (1077–1081)","Eihō (1081–1084)","Ōtoku (1084–1087)","Kanji (1087–1094)","Kahō (1094–1096)","Eichō (1096–1097)","Jōtoku (1097–1099)","Kōwa (1099–1104)","Chōji (1104–1106)","Kashō (1106–1108)","Tennin (1108–1110)","Ten-ei (1110-1113)","Eikyū (1113–1118)","Gen’ei (1118–1120)","Hōan (1120–1124)","Tenji (1124–1126)","Daiji (1126–1131)","Tenshō (1131–1132)","Chōshō (1132–1135)","Hōen (1135–1141)","Eiji (1141–1142)","Kōji (1142–1144)","Ten’yō (1144–1145)","Kyūan (1145–1151)","Ninpei (1151–1154)","Kyūju (1154–1156)","Hōgen (1156–1159)","Heiji (1159–1160)","Eiryaku (1160–1161)","Ōho (1161–1163)","Chōkan (1163–1165)","Eiman (1165–1166)","Nin’an (1166–1169)","Kaō (1169–1171)","Shōan (1171–1175)","Angen (1175–1177)","Jishō (1177–1181)","Yōwa (1181–1182)","Juei (1182–1184)","Genryaku (1184–1185)","Bunji (1185–1190)","Kenkyū (1190–1199)","Shōji (1199–1201)","Kennin (1201–1204)","Genkyū (1204–1206)","Ken’ei (1206–1207)","Jōgen (1207–1211)","Kenryaku (1211–1213)","Kenpō (1213–1219)","Jōkyū (1219–1222)","Jōō (1222–1224)","Gennin (1224–1225)","Karoku (1225–1227)","Antei (1227–1229)","Kanki (1229–1232)","Jōei (1232–1233)","Tenpuku (1233–1234)","Bunryaku (1234–1235)","Katei (1235–1238)","Ryakunin (1238–1239)","En’ō (1239–1240)","Ninji (1240–1243)","Kangen (1243–1247)","Hōji (1247–1249)","Kenchō (1249–1256)","Kōgen (1256–1257)","Shōka (1257–1259)","Shōgen (1259–1260)","Bun’ō (1260–1261)","Kōchō (1261–1264)","Bun’ei (1264–1275)","Kenji (1275–1278)","Kōan (1278–1288)","Shōō (1288–1293)","Einin (1293–1299)","Shōan (1299–1302)","Kengen (1302–1303)","Kagen (1303–1306)","Tokuji (1306–1308)","Enkyō (1308–1311)","Ōchō (1311–1312)","Shōwa (1312–1317)","Bunpō (1317–1319)","Genō (1319–1321)","Genkō (1321–1324)","Shōchū (1324–1326)","Karyaku (1326–1329)","Gentoku (1329–1331)","Genkō (1331–1334)","Kenmu (1334–1336)","Engen (1336–1340)","Kōkoku (1340–1346)","Shōhei (1346–1370)","Kentoku (1370–1372)","Bunchū (1372–1375)","Tenju (1375–1379)","Kōryaku (1379–1381)","Kōwa (1381–1384)","Genchū (1384–1392)","Meitoku (1384–1387)","Kakei (1387–1389)","Kōō (1389–1390)","Meitoku (1390–1394)","Ōei (1394–1428)","Shōchō (1428–1429)","Eikyō (1429–1441)","Kakitsu (1441–1444)","Bun’an (1444–1449)","Hōtoku (1449–1452)","Kyōtoku (1452–1455)","Kōshō (1455–1457)","Chōroku (1457–1460)","Kanshō (1460–1466)","Bunshō (1466–1467)","Ōnin (1467–1469)","Bunmei (1469–1487)","Chōkyō (1487–1489)","Entoku (1489–1492)","Meiō (1492–1501)","Bunki (1501–1504)","Eishō (1504–1521)","Taiei (1521–1528)","Kyōroku (1528–1532)","Tenbun (1532–1555)","Kōji (1555–1558)","Eiroku (1558–1570)","Genki (1570–1573)","Tenshō (1573–1592)","Bunroku (1592–1596)","Keichō (1596–1615)","Genna (1615–1624)","Kan’ei (1624–1644)","Shōho (1644–1648)","Keian (1648–1652)","Jōō (1652–1655)","Meireki (1655–1658)","Manji (1658–1661)","Kanbun (1661–1673)","Enpō (1673–1681)","Tenna (1681–1684)","Jōkyō (1684–1688)","Genroku (1688–1704)","Hōei (1704–1711)","Shōtoku (1711–1716)","Kyōhō (1716–1736)","Genbun (1736–1741)","Kanpō (1741–1744)","Enkyō (1744–1748)","Kan’en (1748–1751)","Hōreki (1751–1764)","Meiwa (1764–1772)","An’ei (1772–1781)","Tenmei (1781–1789)","Kansei (1789–1801)","Kyōwa (1801–1804)","Bunka (1804–1818)","Bunsei (1818–1830)","Tenpō (1830–1844)","Kōka (1844–1848)","Kaei (1848–1854)","Ansei (1854–1860)","Man’en (1860–1861)","Bunkyū (1861–1864)","Genji (1864–1865)","Keiō (1865–1868)","Meiji","Taishō","Shōwa","Heisei"]},dayPeriods:{am:"AM",pm:"PM"}},persian:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Farvardin","Ordibehesht","Khordad","Tir","Mordad","Shahrivar","Mehr","Aban","Azar","Dey","Bahman","Esfand"],long:["Farvardin","Ordibehesht","Khordad","Tir","Mordad","Shahrivar","Mehr","Aban","Azar","Dey","Bahman","Esfand"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["AP"],short:["AP"],long:["AP"]},dayPeriods:{am:"AM",pm:"PM"}},roc:{months:{narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],short:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],long:["January","February","March","April","May","June","July","August","September","October","November","December"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["Before R.O.C.","Minguo"],short:["Before R.O.C.","Minguo"],long:["Before R.O.C.","Minguo"]},dayPeriods:{am:"AM",pm:"PM"}}}},number:{nu:["latn"],patterns:{decimal:{positivePattern:"{number}",negativePattern:"{minusSign}{number}"},currency:{positivePattern:"{currency}{number}",negativePattern:"{minusSign}{currency}{number}"},percent:{positivePattern:"{number}{percentSign}",negativePattern:"{minusSign}{number}{percentSign}"}},symbols:{latn:{decimal:".",group:",",nan:"NaN",plusSign:"+",minusSign:"-",percentSign:"%",infinity:"∞"}},currencies:{AUD:"A$",BRL:"R$",CAD:"CA$",CNY:"CN¥",EUR:"€",GBP:"£",HKD:"HK$",ILS:"₪",INR:"₹",JPY:"¥",KRW:"₩",MXN:"MX$",NZD:"NZ$",TWD:"NT$",USD:"$",VND:"₫",XAF:"FCFA",XCD:"EC$",XOF:"CFA",XPF:"CFPF"}}});
},{}],24:[function(require,module,exports){
IntlPolyfill.__addLocaleData({locale:"es",date:{ca:["gregory","buddhist","chinese","coptic","dangi","ethioaa","ethiopic","generic","hebrew","indian","islamic","islamicc","japanese","persian","roc"],hourNo0:true,hour12:false,formats:{short:"{1} {0}",medium:"{1} {0}",full:"{1}, {0}",long:"{1}, {0}",availableFormats:{"d":"d","E":"ccc",Ed:"E d",Ehm:"E, h:mm a",EHm:"E, H:mm",Ehms:"E, h:mm:ss a",EHms:"E, H:mm:ss",Gy:"y G",GyMMM:"MMM y G",GyMMMd:"d MMM y G",GyMMMEd:"E, d MMM y G",GyMMMM:"MMMM 'de' y G",GyMMMMd:"d 'de' MMMM 'de' y G",GyMMMMEd:"E, d 'de' MMMM 'de' y G","h":"h a","H":"H",hm:"h:mm a",Hm:"H:mm",hms:"h:mm:ss a",Hms:"H:mm:ss",hmsv:"h:mm:ss a v",Hmsv:"H:mm:ss v",hmsvvvv:"h:mm:ss a (vvvv)",Hmsvvvv:"H:mm:ss (vvvv)",hmv:"h:mm a v",Hmv:"H:mm v","M":"L",Md:"d/M",MEd:"E, d/M",MMd:"d/M",MMdd:"d/M",MMM:"LLL",MMMd:"d MMM",MMMEd:"E, d MMM",MMMMd:"d 'de' MMMM",MMMMEd:"E, d 'de' MMMM",ms:"mm:ss","y":"y",yM:"M/y",yMd:"d/M/y",yMEd:"EEE, d/M/y",yMM:"M/y",yMMM:"MMM y",yMMMd:"d MMM y",yMMMEd:"EEE, d MMM y",yMMMM:"MMMM 'de' y",yMMMMd:"d 'de' MMMM 'de' y",yMMMMEd:"EEE, d 'de' MMMM 'de' y",yQQQ:"QQQ y",yQQQQ:"QQQQ 'de' y"},dateFormats:{yMMMMEEEEd:"EEEE, d 'de' MMMM 'de' y",yMMMMd:"d 'de' MMMM 'de' y",yMMMd:"d MMM y",yMd:"d/M/yy"},timeFormats:{hmmsszzzz:"H:mm:ss (zzzz)",hmsz:"H:mm:ss z",hms:"H:mm:ss",hm:"H:mm"}},calendars:{buddhist:{months:{narrow:["E","F","M","A","M","J","J","A","S","O","N","D"],short:["ene.","feb.","mar.","abr.","may.","jun.","jul.","ago.","sept.","oct.","nov.","dic."],long:["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["BE"],short:["BE"],long:["BE"]},dayPeriods:{am:"a. m.",pm:"p. m."}},chinese:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12"],long:["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},dayPeriods:{am:"a. m.",pm:"p. m."}},coptic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13"],short:["Tout","Baba","Hator","Kiahk","Toba","Amshir","Baramhat","Baramouda","Bashans","Paona","Epep","Mesra","Nasie"],long:["Tout","Baba","Hator","Kiahk","Toba","Amshir","Baramhat","Baramouda","Bashans","Paona","Epep","Mesra","Nasie"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["ERA0","ERA1"],short:["ERA0","ERA1"],long:["ERA0","ERA1"]},dayPeriods:{am:"a. m.",pm:"p. m."}},dangi:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12"],long:["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},dayPeriods:{am:"a. m.",pm:"p. m."}},ethiopic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13"],short:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"],long:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["ERA0","ERA1"],short:["ERA0","ERA1"],long:["ERA0","ERA1"]},dayPeriods:{am:"a. m.",pm:"p. m."}},ethioaa:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13"],short:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"],long:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["ERA0"],short:["ERA0"],long:["ERA0"]},dayPeriods:{am:"a. m.",pm:"p. m."}},generic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12"],long:["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["ERA0","ERA1"],short:["ERA0","ERA1"],long:["ERA0","ERA1"]},dayPeriods:{am:"a. m.",pm:"p. m."}},gregory:{months:{narrow:["E","F","M","A","M","J","J","A","S","O","N","D"],short:["ene.","feb.","mar.","abr.","may.","jun.","jul.","ago.","sept.","oct.","nov.","dic."],long:["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["a. C.","d. C.","a. e. c.","e. c."],short:["a. C.","d. C.","a. e. c.","e. c."],long:["antes de Cristo","después de Cristo","antes de la era común","era común"]},dayPeriods:{am:"a. m.",pm:"p. m."}},hebrew:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13","7"],short:["Tishri","Heshvan","Kislev","Tevet","Shevat","Adar I","Adar","Nisan","Iyar","Sivan","Tamuz","Av","Elul","Adar II"],long:["Tishri","Heshvan","Kislev","Tevet","Shevat","Adar I","Adar","Nisan","Iyar","Sivan","Tamuz","Av","Elul","Adar II"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["AM"],short:["AM"],long:["AM"]},dayPeriods:{am:"a. m.",pm:"p. m."}},indian:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Chaitra","Vaisakha","Jyaistha","Asadha","Sravana","Bhadra","Asvina","Kartika","Agrahayana","Pausa","Magha","Phalguna"],long:["Chaitra","Vaisakha","Jyaistha","Asadha","Sravana","Bhadra","Asvina","Kartika","Agrahayana","Pausa","Magha","Phalguna"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["Saka"],short:["Saka"],long:["Saka"]},dayPeriods:{am:"a. m.",pm:"p. m."}},islamic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Muh.","Saf.","Rab. I","Rab. II","Jum. I","Jum. II","Raj.","Sha.","Ram.","Shaw.","Dhuʻl-Q.","Dhuʻl-H."],long:["Muharram","Safar","Rabiʻ I","Rabiʻ II","Jumada I","Jumada II","Rajab","Shaʻban","Ramadan","Shawwal","Dhuʻl-Qiʻdah","Dhuʻl-Hijjah"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["AH"],short:["AH"],long:["AH"]},dayPeriods:{am:"a. m.",pm:"p. m."}},islamicc:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Muh.","Saf.","Rab. I","Rab. II","Jum. I","Jum. II","Raj.","Sha.","Ram.","Shaw.","Dhuʻl-Q.","Dhuʻl-H."],long:["Muharram","Safar","Rabiʻ I","Rabiʻ II","Jumada I","Jumada II","Rajab","Shaʻban","Ramadan","Shawwal","Dhuʻl-Qiʻdah","Dhuʻl-Hijjah"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["AH"],short:["AH"],long:["AH"]},dayPeriods:{am:"a. m.",pm:"p. m."}},japanese:{months:{narrow:["E","F","M","A","M","J","J","A","S","O","N","D"],short:["ene.","feb.","mar.","abr.","may.","jun.","jul.","ago.","sept.","oct.","nov.","dic."],long:["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["Taika (645–650)","Hakuchi (650–671)","Hakuhō (672–686)","Shuchō (686–701)","Taihō (701–704)","Keiun (704–708)","Wadō (708–715)","Reiki (715–717)","Yōrō (717–724)","Jinki (724–729)","Tenpyō (729–749)","Tenpyō-kampō (749-749)","Tenpyō-shōhō (749-757)","Tenpyō-hōji (757-765)","Tenpyō-jingo (765-767)","Jingo-keiun (767-770)","Hōki (770–780)","Ten-ō (781-782)","Enryaku (782–806)","Daidō (806–810)","Kōnin (810–824)","Tenchō (824–834)","Jōwa (834–848)","Kajō (848–851)","Ninju (851–854)","Saikō (854–857)","Ten-an (857-859)","Jōgan (859–877)","Gangyō (877–885)","Ninna (885–889)","Kanpyō (889–898)","Shōtai (898–901)","Engi (901–923)","Enchō (923–931)","Jōhei (931–938)","Tengyō (938–947)","Tenryaku (947–957)","Tentoku (957–961)","Ōwa (961–964)","Kōhō (964–968)","Anna (968–970)","Tenroku (970–973)","Ten’en (973–976)","Jōgen (976–978)","Tengen (978–983)","Eikan (983–985)","Kanna (985–987)","Eien (987–989)","Eiso (989–990)","Shōryaku (990–995)","Chōtoku (995–999)","Chōhō (999–1004)","Kankō (1004–1012)","Chōwa (1012–1017)","Kannin (1017–1021)","Jian (1021–1024)","Manju (1024–1028)","Chōgen (1028–1037)","Chōryaku (1037–1040)","Chōkyū (1040–1044)","Kantoku (1044–1046)","Eishō (1046–1053)","Tengi (1053–1058)","Kōhei (1058–1065)","Jiryaku (1065–1069)","Enkyū (1069–1074)","Shōho (1074–1077)","Shōryaku (1077–1081)","Eihō (1081–1084)","Ōtoku (1084–1087)","Kanji (1087–1094)","Kahō (1094–1096)","Eichō (1096–1097)","Jōtoku (1097–1099)","Kōwa (1099–1104)","Chōji (1104–1106)","Kashō (1106–1108)","Tennin (1108–1110)","Ten-ei (1110-1113)","Eikyū (1113–1118)","Gen’ei (1118–1120)","Hōan (1120–1124)","Tenji (1124–1126)","Daiji (1126–1131)","Tenshō (1131–1132)","Chōshō (1132–1135)","Hōen (1135–1141)","Eiji (1141–1142)","Kōji (1142–1144)","Ten’yō (1144–1145)","Kyūan (1145–1151)","Ninpei (1151–1154)","Kyūju (1154–1156)","Hōgen (1156–1159)","Heiji (1159–1160)","Eiryaku (1160–1161)","Ōho (1161–1163)","Chōkan (1163–1165)","Eiman (1165–1166)","Nin’an (1166–1169)","Kaō (1169–1171)","Shōan (1171–1175)","Angen (1175–1177)","Jishō (1177–1181)","Yōwa (1181–1182)","Juei (1182–1184)","Genryaku (1184–1185)","Bunji (1185–1190)","Kenkyū (1190–1199)","Shōji (1199–1201)","Kennin (1201–1204)","Genkyū (1204–1206)","Ken’ei (1206–1207)","Jōgen (1207–1211)","Kenryaku (1211–1213)","Kenpō (1213–1219)","Jōkyū (1219–1222)","Jōō (1222–1224)","Gennin (1224–1225)","Karoku (1225–1227)","Antei (1227–1229)","Kanki (1229–1232)","Jōei (1232–1233)","Tenpuku (1233–1234)","Bunryaku (1234–1235)","Katei (1235–1238)","Ryakunin (1238–1239)","En’ō (1239–1240)","Ninji (1240–1243)","Kangen (1243–1247)","Hōji (1247–1249)","Kenchō (1249–1256)","Kōgen (1256–1257)","Shōka (1257–1259)","Shōgen (1259–1260)","Bun’ō (1260–1261)","Kōchō (1261–1264)","Bun’ei (1264–1275)","Kenji (1275–1278)","Kōan (1278–1288)","Shōō (1288–1293)","Einin (1293–1299)","Shōan (1299–1302)","Kengen (1302–1303)","Kagen (1303–1306)","Tokuji (1306–1308)","Enkyō (1308–1311)","Ōchō (1311–1312)","Shōwa (1312–1317)","Bunpō (1317–1319)","Genō (1319–1321)","Genkō (1321–1324)","Shōchū (1324–1326)","Karyaku (1326–1329)","Gentoku (1329–1331)","Genkō (1331–1334)","Kenmu (1334–1336)","Engen (1336–1340)","Kōkoku (1340–1346)","Shōhei (1346–1370)","Kentoku (1370–1372)","Bunchū (1372–1375)","Tenju (1375–1379)","Kōryaku (1379–1381)","Kōwa (1381–1384)","Genchū (1384–1392)","Meitoku (1384–1387)","Kakei (1387–1389)","Kōō (1389–1390)","Meitoku (1390–1394)","Ōei (1394–1428)","Shōchō (1428–1429)","Eikyō (1429–1441)","Kakitsu (1441–1444)","Bun’an (1444–1449)","Hōtoku (1449–1452)","Kyōtoku (1452–1455)","Kōshō (1455–1457)","Chōroku (1457–1460)","Kanshō (1460–1466)","Bunshō (1466–1467)","Ōnin (1467–1469)","Bunmei (1469–1487)","Chōkyō (1487–1489)","Entoku (1489–1492)","Meiō (1492–1501)","Bunki (1501–1504)","Eishō (1504–1521)","Taiei (1521–1528)","Kyōroku (1528–1532)","Tenbun (1532–1555)","Kōji (1555–1558)","Eiroku (1558–1570)","Genki (1570–1573)","Tenshō (1573–1592)","Bunroku (1592–1596)","Keichō (1596–1615)","Genna (1615–1624)","Kan’ei (1624–1644)","Shōho (1644–1648)","Keian (1648–1652)","Jōō (1652–1655)","Meireki (1655–1658)","Manji (1658–1661)","Kanbun (1661–1673)","Enpō (1673–1681)","Tenna (1681–1684)","Jōkyō (1684–1688)","Genroku (1688–1704)","Hōei (1704–1711)","Shōtoku (1711–1716)","Kyōhō (1716–1736)","Genbun (1736–1741)","Kanpō (1741–1744)","Enkyō (1744–1748)","Kan’en (1748–1751)","Hōreki (1751–1764)","Meiwa (1764–1772)","An’ei (1772–1781)","Tenmei (1781–1789)","Kansei (1789–1801)","Kyōwa (1801–1804)","Bunka (1804–1818)","Bunsei (1818–1830)","Tenpō (1830–1844)","Kōka (1844–1848)","Kaei (1848–1854)","Ansei (1854–1860)","Man’en (1860–1861)","Bunkyū (1861–1864)","Genji (1864–1865)","Keiō (1865–1868)","M","T","S","H"],short:["Taika (645–650)","Hakuchi (650–671)","Hakuhō (672–686)","Shuchō (686–701)","Taihō (701–704)","Keiun (704–708)","Wadō (708–715)","Reiki (715–717)","Yōrō (717–724)","Jinki (724–729)","Tenpyō (729–749)","Tenpyō-kampō (749-749)","Tenpyō-shōhō (749-757)","Tenpyō-hōji (757-765)","Tenpyō-jingo (765-767)","Jingo-keiun (767-770)","Hōki (770–780)","Ten-ō (781-782)","Enryaku (782–806)","Daidō (806–810)","Kōnin (810–824)","Tenchō (824–834)","Jōwa (834–848)","Kajō (848–851)","Ninju (851–854)","Saikō (854–857)","Ten-an (857-859)","Jōgan (859–877)","Gangyō (877–885)","Ninna (885–889)","Kanpyō (889–898)","Shōtai (898–901)","Engi (901–923)","Enchō (923–931)","Jōhei (931–938)","Tengyō (938–947)","Tenryaku (947–957)","Tentoku (957–961)","Ōwa (961–964)","Kōhō (964–968)","Anna (968–970)","Tenroku (970–973)","Ten’en (973–976)","Jōgen (976–978)","Tengen (978–983)","Eikan (983–985)","Kanna (985–987)","Eien (987–989)","Eiso (989–990)","Shōryaku (990–995)","Chōtoku (995–999)","Chōhō (999–1004)","Kankō (1004–1012)","Chōwa (1012–1017)","Kannin (1017–1021)","Jian (1021–1024)","Manju (1024–1028)","Chōgen (1028–1037)","Chōryaku (1037–1040)","Chōkyū (1040–1044)","Kantoku (1044–1046)","Eishō (1046–1053)","Tengi (1053–1058)","Kōhei (1058–1065)","Jiryaku (1065–1069)","Enkyū (1069–1074)","Shōho (1074–1077)","Shōryaku (1077–1081)","Eihō (1081–1084)","Ōtoku (1084–1087)","Kanji (1087–1094)","Kahō (1094–1096)","Eichō (1096–1097)","Jōtoku (1097–1099)","Kōwa (1099–1104)","Chōji (1104–1106)","Kashō (1106–1108)","Tennin (1108–1110)","Ten-ei (1110-1113)","Eikyū (1113–1118)","Gen’ei (1118–1120)","Hōan (1120–1124)","Tenji (1124–1126)","Daiji (1126–1131)","Tenshō (1131–1132)","Chōshō (1132–1135)","Hōen (1135–1141)","Eiji (1141–1142)","Kōji (1142–1144)","Ten’yō (1144–1145)","Kyūan (1145–1151)","Ninpei (1151–1154)","Kyūju (1154–1156)","Hōgen (1156–1159)","Heiji (1159–1160)","Eiryaku (1160–1161)","Ōho (1161–1163)","Chōkan (1163–1165)","Eiman (1165–1166)","Nin’an (1166–1169)","Kaō (1169–1171)","Shōan (1171–1175)","Angen (1175–1177)","Jishō (1177–1181)","Yōwa (1181–1182)","Juei (1182–1184)","Genryaku (1184–1185)","Bunji (1185–1190)","Kenkyū (1190–1199)","Shōji (1199–1201)","Kennin (1201–1204)","Genkyū (1204–1206)","Ken’ei (1206–1207)","Jōgen (1207–1211)","Kenryaku (1211–1213)","Kenpō (1213–1219)","Jōkyū (1219–1222)","Jōō (1222–1224)","Gennin (1224–1225)","Karoku (1225–1227)","Antei (1227–1229)","Kanki (1229–1232)","Jōei (1232–1233)","Tenpuku (1233–1234)","Bunryaku (1234–1235)","Katei (1235–1238)","Ryakunin (1238–1239)","En’ō (1239–1240)","Ninji (1240–1243)","Kangen (1243–1247)","Hōji (1247–1249)","Kenchō (1249–1256)","Kōgen (1256–1257)","Shōka (1257–1259)","Shōgen (1259–1260)","Bun’ō (1260–1261)","Kōchō (1261–1264)","Bun’ei (1264–1275)","Kenji (1275–1278)","Kōan (1278–1288)","Shōō (1288–1293)","Einin (1293–1299)","Shōan (1299–1302)","Kengen (1302–1303)","Kagen (1303–1306)","Tokuji (1306–1308)","Enkyō (1308–1311)","Ōchō (1311–1312)","Shōwa (1312–1317)","Bunpō (1317–1319)","Genō (1319–1321)","Genkō (1321–1324)","Shōchū (1324–1326)","Karyaku (1326–1329)","Gentoku (1329–1331)","Genkō (1331–1334)","Kenmu (1334–1336)","Engen (1336–1340)","Kōkoku (1340–1346)","Shōhei (1346–1370)","Kentoku (1370–1372)","Bunchū (1372–1375)","Tenju (1375–1379)","Kōryaku (1379–1381)","Kōwa (1381–1384)","Genchū (1384–1392)","Meitoku (1384–1387)","Kakei (1387–1389)","Kōō (1389–1390)","Meitoku (1390–1394)","Ōei (1394–1428)","Shōchō (1428–1429)","Eikyō (1429–1441)","Kakitsu (1441–1444)","Bun’an (1444–1449)","Hōtoku (1449–1452)","Kyōtoku (1452–1455)","Kōshō (1455–1457)","Chōroku (1457–1460)","Kanshō (1460–1466)","Bunshō (1466–1467)","Ōnin (1467–1469)","Bunmei (1469–1487)","Chōkyō (1487–1489)","Entoku (1489–1492)","Meiō (1492–1501)","Bunki (1501–1504)","Eishō (1504–1521)","Taiei (1521–1528)","Kyōroku (1528–1532)","Tenbun (1532–1555)","Kōji (1555–1558)","Eiroku (1558–1570)","Genki (1570–1573)","Tenshō (1573–1592)","Bunroku (1592–1596)","Keichō (1596–1615)","Genna (1615–1624)","Kan’ei (1624–1644)","Shōho (1644–1648)","Keian (1648–1652)","Jōō (1652–1655)","Meireki (1655–1658)","Manji (1658–1661)","Kanbun (1661–1673)","Enpō (1673–1681)","Tenna (1681–1684)","Jōkyō (1684–1688)","Genroku (1688–1704)","Hōei (1704–1711)","Shōtoku (1711–1716)","Kyōhō (1716–1736)","Genbun (1736–1741)","Kanpō (1741–1744)","Enkyō (1744–1748)","Kan’en (1748–1751)","Hōreki (1751–1764)","Meiwa (1764–1772)","An’ei (1772–1781)","Tenmei (1781–1789)","Kansei (1789–1801)","Kyōwa (1801–1804)","Bunka (1804–1818)","Bunsei (1818–1830)","Tenpō (1830–1844)","Kōka (1844–1848)","Kaei (1848–1854)","Ansei (1854–1860)","Man’en (1860–1861)","Bunkyū (1861–1864)","Genji (1864–1865)","Keiō (1865–1868)","Meiji","Taishō","Shōwa","Heisei"],long:["Taika (645–650)","Hakuchi (650–671)","Hakuhō (672–686)","Shuchō (686–701)","Taihō (701–704)","Keiun (704–708)","Wadō (708–715)","Reiki (715–717)","Yōrō (717–724)","Jinki (724–729)","Tenpyō (729–749)","Tenpyō-kampō (749-749)","Tenpyō-shōhō (749-757)","Tenpyō-hōji (757-765)","Tenpyō-jingo (765-767)","Jingo-keiun (767-770)","Hōki (770–780)","Ten-ō (781-782)","Enryaku (782–806)","Daidō (806–810)","Kōnin (810–824)","Tenchō (824–834)","Jōwa (834–848)","Kajō (848–851)","Ninju (851–854)","Saikō (854–857)","Ten-an (857-859)","Jōgan (859–877)","Gangyō (877–885)","Ninna (885–889)","Kanpyō (889–898)","Shōtai (898–901)","Engi (901–923)","Enchō (923–931)","Jōhei (931–938)","Tengyō (938–947)","Tenryaku (947–957)","Tentoku (957–961)","Ōwa (961–964)","Kōhō (964–968)","Anna (968–970)","Tenroku (970–973)","Ten’en (973–976)","Jōgen (976–978)","Tengen (978–983)","Eikan (983–985)","Kanna (985–987)","Eien (987–989)","Eiso (989–990)","Shōryaku (990–995)","Chōtoku (995–999)","Chōhō (999–1004)","Kankō (1004–1012)","Chōwa (1012–1017)","Kannin (1017–1021)","Jian (1021–1024)","Manju (1024–1028)","Chōgen (1028–1037)","Chōryaku (1037–1040)","Chōkyū (1040–1044)","Kantoku (1044–1046)","Eishō (1046–1053)","Tengi (1053–1058)","Kōhei (1058–1065)","Jiryaku (1065–1069)","Enkyū (1069–1074)","Shōho (1074–1077)","Shōryaku (1077–1081)","Eihō (1081–1084)","Ōtoku (1084–1087)","Kanji (1087–1094)","Kahō (1094–1096)","Eichō (1096–1097)","Jōtoku (1097–1099)","Kōwa (1099–1104)","Chōji (1104–1106)","Kashō (1106–1108)","Tennin (1108–1110)","Ten-ei (1110-1113)","Eikyū (1113–1118)","Gen’ei (1118–1120)","Hōan (1120–1124)","Tenji (1124–1126)","Daiji (1126–1131)","Tenshō (1131–1132)","Chōshō (1132–1135)","Hōen (1135–1141)","Eiji (1141–1142)","Kōji (1142–1144)","Ten’yō (1144–1145)","Kyūan (1145–1151)","Ninpei (1151–1154)","Kyūju (1154–1156)","Hōgen (1156–1159)","Heiji (1159–1160)","Eiryaku (1160–1161)","Ōho (1161–1163)","Chōkan (1163–1165)","Eiman (1165–1166)","Nin’an (1166–1169)","Kaō (1169–1171)","Shōan (1171–1175)","Angen (1175–1177)","Jishō (1177–1181)","Yōwa (1181–1182)","Juei (1182–1184)","Genryaku (1184–1185)","Bunji (1185–1190)","Kenkyū (1190–1199)","Shōji (1199–1201)","Kennin (1201–1204)","Genkyū (1204–1206)","Ken’ei (1206–1207)","Jōgen (1207–1211)","Kenryaku (1211–1213)","Kenpō (1213–1219)","Jōkyū (1219–1222)","Jōō (1222–1224)","Gennin (1224–1225)","Karoku (1225–1227)","Antei (1227–1229)","Kanki (1229–1232)","Jōei (1232–1233)","Tenpuku (1233–1234)","Bunryaku (1234–1235)","Katei (1235–1238)","Ryakunin (1238–1239)","En’ō (1239–1240)","Ninji (1240–1243)","Kangen (1243–1247)","Hōji (1247–1249)","Kenchō (1249–1256)","Kōgen (1256–1257)","Shōka (1257–1259)","Shōgen (1259–1260)","Bun’ō (1260–1261)","Kōchō (1261–1264)","Bun’ei (1264–1275)","Kenji (1275–1278)","Kōan (1278–1288)","Shōō (1288–1293)","Einin (1293–1299)","Shōan (1299–1302)","Kengen (1302–1303)","Kagen (1303–1306)","Tokuji (1306–1308)","Enkyō (1308–1311)","Ōchō (1311–1312)","Shōwa (1312–1317)","Bunpō (1317–1319)","Genō (1319–1321)","Genkō (1321–1324)","Shōchū (1324–1326)","Karyaku (1326–1329)","Gentoku (1329–1331)","Genkō (1331–1334)","Kenmu (1334–1336)","Engen (1336–1340)","Kōkoku (1340–1346)","Shōhei (1346–1370)","Kentoku (1370–1372)","Bunchū (1372–1375)","Tenju (1375–1379)","Kōryaku (1379–1381)","Kōwa (1381–1384)","Genchū (1384–1392)","Meitoku (1384–1387)","Kakei (1387–1389)","Kōō (1389–1390)","Meitoku (1390–1394)","Ōei (1394–1428)","Shōchō (1428–1429)","Eikyō (1429–1441)","Kakitsu (1441–1444)","Bun’an (1444–1449)","Hōtoku (1449–1452)","Kyōtoku (1452–1455)","Kōshō (1455–1457)","Chōroku (1457–1460)","Kanshō (1460–1466)","Bunshō (1466–1467)","Ōnin (1467–1469)","Bunmei (1469–1487)","Chōkyō (1487–1489)","Entoku (1489–1492)","Meiō (1492–1501)","Bunki (1501–1504)","Eishō (1504–1521)","Taiei (1521–1528)","Kyōroku (1528–1532)","Tenbun (1532–1555)","Kōji (1555–1558)","Eiroku (1558–1570)","Genki (1570–1573)","Tenshō (1573–1592)","Bunroku (1592–1596)","Keichō (1596–1615)","Genna (1615–1624)","Kan’ei (1624–1644)","Shōho (1644–1648)","Keian (1648–1652)","Jōō (1652–1655)","Meireki (1655–1658)","Manji (1658–1661)","Kanbun (1661–1673)","Enpō (1673–1681)","Tenna (1681–1684)","Jōkyō (1684–1688)","Genroku (1688–1704)","Hōei (1704–1711)","Shōtoku (1711–1716)","Kyōhō (1716–1736)","Genbun (1736–1741)","Kanpō (1741–1744)","Enkyō (1744–1748)","Kan’en (1748–1751)","Hōreki (1751–1764)","Meiwa (1764–1772)","An’ei (1772–1781)","Tenmei (1781–1789)","Kansei (1789–1801)","Kyōwa (1801–1804)","Bunka (1804–1818)","Bunsei (1818–1830)","Tenpō (1830–1844)","Kōka (1844–1848)","Kaei (1848–1854)","Ansei (1854–1860)","Man’en (1860–1861)","Bunkyū (1861–1864)","Genji (1864–1865)","Keiō (1865–1868)","Meiji","Taishō","Shōwa","Heisei"]},dayPeriods:{am:"a. m.",pm:"p. m."}},persian:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Farvardin","Ordibehesht","Khordad","Tir","Mordad","Shahrivar","Mehr","Aban","Azar","Dey","Bahman","Esfand"],long:["Farvardin","Ordibehesht","Khordad","Tir","Mordad","Shahrivar","Mehr","Aban","Azar","Dey","Bahman","Esfand"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["AP"],short:["AP"],long:["AP"]},dayPeriods:{am:"a. m.",pm:"p. m."}},roc:{months:{narrow:["E","F","M","A","M","J","J","A","S","O","N","D"],short:["ene.","feb.","mar.","abr.","may.","jun.","jul.","ago.","sept.","oct.","nov.","dic."],long:["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]},days:{narrow:["D","L","M","X","J","V","S"],short:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],long:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]},eras:{narrow:["antes de R.O.C.","R.O.C."],short:["antes de R.O.C.","R.O.C."],long:["antes de R.O.C.","R.O.C."]},dayPeriods:{am:"a. m.",pm:"p. m."}}}},number:{nu:["latn"],patterns:{decimal:{positivePattern:"{number}",negativePattern:"{minusSign}{number}"},currency:{positivePattern:"{number} {currency}",negativePattern:"{minusSign}{number} {currency}"},percent:{positivePattern:"{number} {percentSign}",negativePattern:"{minusSign}{number} {percentSign}"}},symbols:{latn:{decimal:",",group:".",nan:"NaN",plusSign:"+",minusSign:"-",percentSign:"%",infinity:"∞"}},currencies:{CAD:"CA$",ESP:"₧",EUR:"€",THB:"฿",USD:"$",VND:"₫",XPF:"CFPF"}}});
},{}],25:[function(require,module,exports){
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

},{"_process":2,"path-to-regexp":26}],26:[function(require,module,exports){
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

},{"isarray":27}],27:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],28:[function(require,module,exports){

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

},{}],29:[function(require,module,exports){
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

},{"./update-events.js":35,"bel":30,"morphdom":34}],30:[function(require,module,exports){
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

},{"global/document":31,"hyperx":32}],31:[function(require,module,exports){
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

},{"min-document":1}],32:[function(require,module,exports){
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

},{"hyperscript-attribute-to-property":33}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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
		likes: 4,
		liked: true,
		createdAt: new Date()
	}, {
		user: {
			username: 'David Pte',
			avatar: 'https://scontent-mia1-1.xx.fbcdn.net/v/t1.0-9/13240476_10207468828932980_766208754586076978_n.jpg?oh=ae997f0f10403f65499674f5a2869757&oe=579DE806'
		},
		url: 'http://materializecss.com/images/office.jpg',
		likes: 10,
		liked: false,
		createdAt: new Date().setDate(new Date().getDate() - 10)
	}];

	empty(main).appendChild(template(pictures));
});

},{"./template":37,"empty-element":3,"page":25,"title":28}],37:[function(require,module,exports){
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

},{"../layout":40,"../picture-card":41,"yo-yo":29}],38:[function(require,module,exports){
var page = require('page');

require('./homepage');
require('./signup');
require('./signin');

page();

},{"./homepage":36,"./signin":42,"./signup":44,"page":25}],39:[function(require,module,exports){
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

},{"yo-yo":29}],40:[function(require,module,exports){
var yo = require('yo-yo');

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
											<li><a href="">Salir</a></li>
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

},{"yo-yo":29}],41:[function(require,module,exports){
var yo = require('yo-yo');

if (!window.Intl) {
				window.Intl = require('intl'); // polyfill for `Intl`
				require('intl/locale-data/jsonp/en-US.js');
				require('intl/locale-data/jsonp/es.js');
}

var IntlRelativeFormat = window.IntlRelativeFormat = require('intl-relativeformat');

require('intl-relativeformat/dist/locale-data/en.js');
require('intl-relativeformat/dist/locale-data/es.js');

var rf = new IntlRelativeFormat('en-US');

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
					    	<small class="right time">${ rf.format(picture.createdAt) }</small>
					    	<p>
					    		<a href="#" class="left" onclick=${ like.bind(null, true) }>
					    			<i class="fa fa-heart-o" aria-hidden="true"></i>
					    		</a>
					    		<a href="#" class="left" onclick=${ like.bind(null, false) }>
					    			<i class="fa fa-heart" aria-hidden="true"></i>
					    		</a>
				    			<span class="left likes">${ picture.likes } me gusta</span>
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

},{"intl":21,"intl-relativeformat":6,"intl-relativeformat/dist/locale-data/en.js":4,"intl-relativeformat/dist/locale-data/es.js":5,"intl/locale-data/jsonp/en-US.js":23,"intl/locale-data/jsonp/es.js":24,"yo-yo":29}],42:[function(require,module,exports){
var page = require('page');
var empty = require('empty-element');
var template = require('./template');
var title = require('title');

page('/signin', function (ctx, next) {
	title('MyGram - Signin');
	var main = document.getElementById('main-container');
	empty(main).appendChild(template);
});

},{"./template":43,"empty-element":3,"page":25,"title":28}],43:[function(require,module,exports){
var yo = require('yo-yo');
var landing = require('../landing');

var signinForm = yo`<div class="col s12 m7">
						<div class="row">
							<div class="signup-box">
								<h1 class="mygram">MyGram</h1>
								<form class="signup-form">
									<div class="section">
										<a href="" class="btn btn-fb hide-on-small-only">Iniciar sesión con Facebook</a>
										<a href="" class="btn btn-fb hide-on-med-and-up"><i class="fa fa-facebook-official"></i> Iniciar sesión</a>
									</div>
									<div class="divider">
										
									</div>
									<div class="section">
										<input type="text" name="usernamee" placeholder="Nombre de usuario">
										<input type="password" name="password" placeholder="Contraseña">
										<button type="submit" class="btn waves-effect waves-light btn-signup">Iniciar Sesion</button>
									</div>
								</form>
							</div>								
						</div>
						<div class="row">
							<div class="login-box">
								¿No Tienes una cuenta? <a href="/signup">Regístrate</a>
							</div>
						</div>
					</div>`;

module.exports = landing(signinForm);

},{"../landing":39,"yo-yo":29}],44:[function(require,module,exports){
var page = require('page');
var empty = require('empty-element');
var template = require('./template');
var title = require('title');

page('/signup', function (ctx, next) {
	title('MyGram - Signup');
	var main = document.getElementById('main-container');
	empty(main).appendChild(template);
});

},{"./template":45,"empty-element":3,"page":25,"title":28}],45:[function(require,module,exports){
var yo = require('yo-yo');
var landing = require('../landing');

var signupForm = yo`<div class="col s12 m7">
						<div class="row">
							<div class="signup-box">
								<h1 class="mygram">MyGram</h1>
								<form action="" class="signup-form">
									<h2>Registrate para ver fotos de tus amigos estudiantes</h2>
									<div class="section">
										<a href="" class="btn btn-fb hide-on-small-only">Iniciar sesión con Facebook</a>
										<a href="" class="btn btn-fb hide-on-med-and-up"><i class="fa fa-facebook-official"></i> Iniciar sesión</a>
									</div>
									<div class="divider">
										
									</div>
									<div class="section">
										<input type="email" name="email" placeholder="Correo electronico">
										<input type="text" name="name" placeholder="Nombre completo">
										<input type="text" name="usernamee" placeholder="Nombre de usuario">
										<input type="password" name="password" placeholder="Contraseña">
										<button type="submit" class="btn waves-effect waves-light btn-signup">Regístrate</button>
									</div>
								</form>
							</div>								
						</div>
						<div class="row">
							<div class="login-box">
								¿Tienes una cuenta? <a href="/signin">Entrar</a>
							</div>
						</div>
					</div>`;

module.exports = landing(signupForm);

},{"../landing":39,"yo-yo":29}]},{},[38])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9lbXB0eS1lbGVtZW50L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ludGwtcmVsYXRpdmVmb3JtYXQvZGlzdC9sb2NhbGUtZGF0YS9lbi5qcyIsIm5vZGVfbW9kdWxlcy9pbnRsLXJlbGF0aXZlZm9ybWF0L2Rpc3QvbG9jYWxlLWRhdGEvZXMuanMiLCJub2RlX21vZHVsZXMvaW50bC1yZWxhdGl2ZWZvcm1hdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbnRsLXJlbGF0aXZlZm9ybWF0L2xpYi9jb3JlLmpzIiwibm9kZV9tb2R1bGVzL2ludGwtcmVsYXRpdmVmb3JtYXQvbGliL2RpZmYuanMiLCJub2RlX21vZHVsZXMvaW50bC1yZWxhdGl2ZWZvcm1hdC9saWIvZW4uanMiLCJub2RlX21vZHVsZXMvaW50bC1yZWxhdGl2ZWZvcm1hdC9saWIvZXM1LmpzIiwibm9kZV9tb2R1bGVzL2ludGwtcmVsYXRpdmVmb3JtYXQvbGliL21haW4uanMiLCJub2RlX21vZHVsZXMvaW50bC1yZWxhdGl2ZWZvcm1hdC9ub2RlX21vZHVsZXMvaW50bC1tZXNzYWdlZm9ybWF0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ludGwtcmVsYXRpdmVmb3JtYXQvbm9kZV9tb2R1bGVzL2ludGwtbWVzc2FnZWZvcm1hdC9saWIvY29tcGlsZXIuanMiLCJub2RlX21vZHVsZXMvaW50bC1yZWxhdGl2ZWZvcm1hdC9ub2RlX21vZHVsZXMvaW50bC1tZXNzYWdlZm9ybWF0L2xpYi9jb3JlLmpzIiwibm9kZV9tb2R1bGVzL2ludGwtcmVsYXRpdmVmb3JtYXQvbm9kZV9tb2R1bGVzL2ludGwtbWVzc2FnZWZvcm1hdC9saWIvZW4uanMiLCJub2RlX21vZHVsZXMvaW50bC1yZWxhdGl2ZWZvcm1hdC9ub2RlX21vZHVsZXMvaW50bC1tZXNzYWdlZm9ybWF0L2xpYi9lczUuanMiLCJub2RlX21vZHVsZXMvaW50bC1yZWxhdGl2ZWZvcm1hdC9ub2RlX21vZHVsZXMvaW50bC1tZXNzYWdlZm9ybWF0L2xpYi91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy9pbnRsLXJlbGF0aXZlZm9ybWF0L25vZGVfbW9kdWxlcy9pbnRsLW1lc3NhZ2Vmb3JtYXQvbm9kZV9tb2R1bGVzL2ludGwtbWVzc2FnZWZvcm1hdC1wYXJzZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaW50bC1yZWxhdGl2ZWZvcm1hdC9ub2RlX21vZHVsZXMvaW50bC1tZXNzYWdlZm9ybWF0L25vZGVfbW9kdWxlcy9pbnRsLW1lc3NhZ2Vmb3JtYXQtcGFyc2VyL2xpYi9wYXJzZXIuanMiLCJub2RlX21vZHVsZXMvaW50bC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbnRsL2xpYi9jb3JlLmpzIiwibm9kZV9tb2R1bGVzL2ludGwvbG9jYWxlLWRhdGEvanNvbnAvZW4tVVMuanMiLCJub2RlX21vZHVsZXMvaW50bC9sb2NhbGUtZGF0YS9qc29ucC9lcy5qcyIsIm5vZGVfbW9kdWxlcy9wYWdlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3BhZ2Uvbm9kZV9tb2R1bGVzL3BhdGgtdG8tcmVnZXhwL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3BhZ2Uvbm9kZV9tb2R1bGVzL3BhdGgtdG8tcmVnZXhwL25vZGVfbW9kdWxlcy9pc2FycmF5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RpdGxlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3lvLXlvL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3lvLXlvL25vZGVfbW9kdWxlcy9iZWwvaW5kZXguanMiLCJub2RlX21vZHVsZXMveW8teW8vbm9kZV9tb2R1bGVzL2JlbC9ub2RlX21vZHVsZXMvZ2xvYmFsL2RvY3VtZW50LmpzIiwibm9kZV9tb2R1bGVzL3lvLXlvL25vZGVfbW9kdWxlcy9iZWwvbm9kZV9tb2R1bGVzL2h5cGVyeC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy95by15by9ub2RlX21vZHVsZXMvYmVsL25vZGVfbW9kdWxlcy9oeXBlcngvbm9kZV9tb2R1bGVzL2h5cGVyc2NyaXB0LWF0dHJpYnV0ZS10by1wcm9wZXJ0eS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy95by15by9ub2RlX21vZHVsZXMvbW9ycGhkb20vbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3lvLXlvL3VwZGF0ZS1ldmVudHMuanMiLCJzcmNcXGhvbWVwYWdlXFxpbmRleC5qcyIsInNyY1xcaG9tZXBhZ2VcXHRlbXBsYXRlLmpzIiwic3JjXFxpbmRleC5qcyIsInNyY1xcbGFuZGluZ1xcaW5kZXguanMiLCJzcmNcXGxheW91dFxcaW5kZXguanMiLCJzcmNcXHBpY3R1cmUtY2FyZFxcaW5kZXguanMiLCJzcmNcXHNpZ25pblxcaW5kZXguanMiLCJzcmNcXHNpZ25pblxcdGVtcGxhdGUuanMiLCJzcmNcXHNpZ251cFxcaW5kZXguanMiLCJzcmNcXHNpZ251cFxcdGVtcGxhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzkwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNudEhBOztBQ0FBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOW1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0WUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDamZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQSxJQUFJLE9BQU8sUUFBWCxBQUFXLEFBQVE7QUFDbkIsSUFBSSxRQUFRLFFBQVosQUFBWSxBQUFRO0FBQ3BCLElBQUksV0FBVyxRQUFmLEFBQWUsQUFBUTtBQUN2QixJQUFJLFFBQVEsUUFBWixBQUFZLEFBQVE7O0FBR3BCLEtBQUEsQUFBSyxLQUFLLFVBQUEsQUFBVSxLQUFWLEFBQWUsTUFBTSxBQUM5QjtPQUFBLEFBQU0sQUFDTjtLQUFJLE9BQU8sU0FBQSxBQUFTLGVBQXBCLEFBQVcsQUFBd0IsQUFFbkM7O0tBQUk7O2FBRUksQUFDSyxBQUNWO1dBSEYsQUFDTyxBQUNMLEFBQ1EsQUFFVDs7T0FMRCxBQUtNLEFBQ0w7U0FORCxBQU1RLEFBQ1A7U0FQRCxBQU9RLEFBQ1A7YUFBVyxJQVRFLEFBQ2QsQUFDQyxBQU9XLEFBQUk7OzthQUdULEFBQ0ssQUFDVjtXQUhGLEFBQ08sQUFDTCxBQUNRLEFBRVQ7O09BTEQsQUFLTSxBQUNMO1NBTkQsQUFNUSxBQUNQO1NBUEQsQUFPUSxBQUNQO2FBQVcsSUFBQSxBQUFJLE9BQUosQUFBVyxRQUFRLElBQUEsQUFBSSxPQUFKLEFBQVcsWUFuQjNDLEFBQWUsQUFXZCxBQUNDLEFBT1csQUFBMEMsQUFJdkQ7OztPQUFBLEFBQU0sTUFBTixBQUFZLFlBQVksU0EzQnpCLEFBMkJDLEFBQXdCLEFBQVMsQUFDakM7Ozs7QUNsQ0QsSUFBSSxLQUFLLFFBQVQsQUFBUyxBQUFRO0FBQ2pCLElBQUksU0FBUyxRQUFiLEFBQWEsQUFBUTtBQUNyQixJQUFJLFVBQVUsUUFBZCxBQUFjLEFBQVE7O0FBRXRCLE9BQUEsQUFBTyxVQUFVLFVBQUEsQUFBVSxVQUFVLEFBRXBDOztLQUFJLEtBQUssR0FBRSxBQUFDOzs7bUJBR0osQUFBUyxJQUFJLFVBQUEsQUFBVSxLQUFLLEFBQzdCO1NBQU8sUUFKZCxBQUFXLEFBR0gsQUFDRCxBQUFPLEFBQVEsQUFDZixBQUlQOzs7OztRQUFPLE9BWFIsQUFXQyxBQUFPLEFBQU8sQUFDZDs7OztBQ2hCRCxJQUFJLE9BQU8sUUFBWCxBQUFXLEFBQVE7O0FBRW5CLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTs7QUFFUjs7O0FDTkEsSUFBSSxLQUFLLFFBQVQsQUFBUyxBQUFROztBQUVqQixPQUFBLEFBQU8sVUFBVSxTQUFBLEFBQVMsUUFBVCxBQUFpQixLQUFLLEFBQ3RDO1FBQVEsR0FBRSxBQUFDOzs7Ozs7O1dBRFosQUFDQyxBQUFVLEFBT0QsQUFLVDs7Ozs7Ozs7QUNmRCxJQUFJLEtBQUssUUFBVCxBQUFTLEFBQVE7O0FBRWpCLE9BQUEsQUFBTyxVQUFVLFNBQUEsQUFBUyxPQUFULEFBQWdCLFNBQVMsQUFDekM7UUFBTyxHQUFFLEFBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQURYLEFBQ0MsQUFBUyxBQXFCRixBQUdQOzs7Ozs7QUMzQkQsSUFBSSxLQUFLLFFBQVQsQUFBUyxBQUFROztBQUVqQixJQUFJLENBQUMsT0FBTCxBQUFZLE1BQU0sQUFDZDtXQUFBLEFBQU8sT0FBTyxRLEFBQWQsQUFBYyxBQUFRLEFBQ3RCO1lBQUEsQUFBUSxBQUNSO1lBQUEsQUFBUSxBQUNYOzs7QUFFRCxJQUFJLHFCQUFxQixPQUFBLEFBQU8scUJBQXFCLFFBQXJELEFBQXFELEFBQVE7O0FBRTdELFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTs7QUFFUixJQUFJLEtBQUssSUFBQSxBQUFJLG1CQUFiLEFBQVMsQUFBdUI7O0FBRWhDLE9BQUEsQUFBTyxVQUFVLFNBQUEsQUFBUyxZQUFULEFBQXFCLEtBQUssQUFDMUM7UUFBQSxBQUFJLEFBRUo7O2FBQUEsQUFBUyxPQUFULEFBQWlCLFNBQVMsQUFDekI7ZUFBTyxHQUFHLEFBQUMsb0JBQW1CLFFBQUEsQUFBUSxRQUFSLEFBQWdCLFVBQXBDLEFBQThDLElBQTlDLEFBQWlEOzt5Q0FFckIsUUFGNUIsQUFFb0MsS0FGcEMsQUFFd0M7Ozs0QkFHekIsUUFBQSxBQUFRLEtBTHZCLEFBSzRCLFVBTDVCLEFBS3FDO3dCQUMxQixRQUFBLEFBQVEsS0FObkIsQUFNd0IsUUFOeEIsQUFNK0I7cUNBQ1AsUUFBQSxBQUFRLEtBUGhDLEFBT3FDLFVBUHJDLEFBTzhDOzt1Q0FFcEIsR0FBQSxBQUFHLE9BQU8sUUFUcEMsQUFTMEIsQUFBa0IsWUFUNUMsQUFTdUQ7OytDQUVyQixLQUFBLEFBQUssS0FBTCxBQUFVLE1BWDVDLEFBV2tDLEFBQWdCLE9BWGxELEFBV3dEOzs7K0NBR3RCLEtBQUEsQUFBSyxLQUFMLEFBQVUsTUFkNUMsQUFja0MsQUFBZ0IsUUFkbEQsQUFjeUQ7Ozt1Q0FHL0IsUUFqQjFCLEFBaUJrQyxPQWpCNUMsQUFBVSxBQWlCd0MsQUFJbEQsQUFFRTs7Ozs7O2FBQUEsQUFBUyxLQUFULEFBQWUsT0FBTyxBQUNyQjtZQUFBLEFBQUksUUFBSixBQUFZLEFBQ1o7WUFBQSxBQUFJLFNBQVMsUUFBQSxBQUFRLElBQUksQ0FBekIsQUFBMEIsQUFDMUI7WUFBSSxRQUFRLE9BQVosQUFBWSxBQUFPLEFBQ25CO1dBQUEsQUFBRyxPQUFILEFBQVUsSUFBVixBQUFjLEFBQ2Q7ZSxBQUFBLEFBQU8sQUFDUCxBQUVEOzs7U0FBSyxPQUFMLEFBQUssQUFBTyxBQUNaO1dBcENKLEFBb0NJLEFBQU8sQUFDVjs7OztBQ3BERCxJQUFJLE9BQU8sUUFBWCxBQUFXLEFBQVE7QUFDbkIsSUFBSSxRQUFRLFFBQVosQUFBWSxBQUFRO0FBQ3BCLElBQUksV0FBVyxRQUFmLEFBQWUsQUFBUTtBQUN2QixJQUFJLFFBQVEsUUFBWixBQUFZLEFBQVE7O0FBR3BCLEtBQUEsQUFBSyxXQUFXLFVBQUEsQUFBVSxLQUFWLEFBQWUsTUFBTSxBQUNwQztPQUFBLEFBQU0sQUFDTjtLQUFJLE9BQU8sU0FBQSxBQUFTLGVBQXBCLEFBQVcsQUFBd0IsQUFDbkM7T0FBQSxBQUFNLE1BQU4sQUFBWSxZQUhiLEFBR0MsQUFBd0IsQUFDeEI7Ozs7QUNWRCxJQUFJLEtBQUssUUFBVCxBQUFTLEFBQVE7QUFDakIsSUFBSSxVQUFVLFFBQWQsQUFBYyxBQUFROztBQUV0QixJQUFJLGFBQWEsR0FBakIsQUFBbUIsQUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJwQixPQUFBLEFBQU8sVUFBVSxRQUFqQixBQUFpQixBQUFROzs7QUM5QnpCLElBQUksT0FBTyxRQUFYLEFBQVcsQUFBUTtBQUNuQixJQUFJLFFBQVEsUUFBWixBQUFZLEFBQVE7QUFDcEIsSUFBSSxXQUFXLFFBQWYsQUFBZSxBQUFRO0FBQ3ZCLElBQUksUUFBUSxRQUFaLEFBQVksQUFBUTs7QUFHcEIsS0FBQSxBQUFLLFdBQVcsVUFBQSxBQUFVLEtBQVYsQUFBZSxNQUFNLEFBQ3BDO09BQUEsQUFBTSxBQUNOO0tBQUksT0FBTyxTQUFBLEFBQVMsZUFBcEIsQUFBVyxBQUF3QixBQUNuQztPQUFBLEFBQU0sTUFBTixBQUFZLFlBSGIsQUFHQyxBQUF3QixBQUN4Qjs7OztBQ1ZELElBQUksS0FBSyxRQUFULEFBQVMsQUFBUTtBQUNqQixJQUFJLFVBQVUsUUFBZCxBQUFjLEFBQVE7O0FBRXRCLElBQUksYUFBYSxHQUFqQixBQUFtQixBQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4QnBCLE9BQUEsQUFBTyxVQUFVLFFBQWpCLEFBQWlCLEFBQVEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKiBnbG9iYWwgSFRNTEVsZW1lbnQgKi9cblxuJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW1wdHlFbGVtZW50IChlbGVtZW50KSB7XG4gIGlmICghKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhbiBlbGVtZW50JylcbiAgfVxuXG4gIHZhciBub2RlXG4gIHdoaWxlICgobm9kZSA9IGVsZW1lbnQubGFzdENoaWxkKSkgZWxlbWVudC5yZW1vdmVDaGlsZChub2RlKVxuICByZXR1cm4gZWxlbWVudFxufVxuIiwiSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuXCIsXCJwbHVyYWxSdWxlRnVuY3Rpb25cIjpmdW5jdGlvbiAobixvcmQpe3ZhciBzPVN0cmluZyhuKS5zcGxpdChcIi5cIiksdjA9IXNbMV0sdDA9TnVtYmVyKHNbMF0pPT1uLG4xMD10MCYmc1swXS5zbGljZSgtMSksbjEwMD10MCYmc1swXS5zbGljZSgtMik7aWYob3JkKXJldHVybiBuMTA9PTEmJm4xMDAhPTExP1wib25lXCI6bjEwPT0yJiZuMTAwIT0xMj9cInR3b1wiOm4xMD09MyYmbjEwMCE9MTM/XCJmZXdcIjpcIm90aGVyXCI7cmV0dXJuIG49PTEmJnYwP1wib25lXCI6XCJvdGhlclwifSxcImZpZWxkc1wiOntcInllYXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwieWVhclwiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJ0aGlzIHllYXJcIixcIjFcIjpcIm5leHQgeWVhclwiLFwiLTFcIjpcImxhc3QgeWVhclwifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiaW4gezB9IHllYXJcIixcIm90aGVyXCI6XCJpbiB7MH0geWVhcnNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJ7MH0geWVhciBhZ29cIixcIm90aGVyXCI6XCJ7MH0geWVhcnMgYWdvXCJ9fX0sXCJtb250aFwiOntcImRpc3BsYXlOYW1lXCI6XCJtb250aFwiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJ0aGlzIG1vbnRoXCIsXCIxXCI6XCJuZXh0IG1vbnRoXCIsXCItMVwiOlwibGFzdCBtb250aFwifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiaW4gezB9IG1vbnRoXCIsXCJvdGhlclwiOlwiaW4gezB9IG1vbnRoc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcInswfSBtb250aCBhZ29cIixcIm90aGVyXCI6XCJ7MH0gbW9udGhzIGFnb1wifX19LFwiZGF5XCI6e1wiZGlzcGxheU5hbWVcIjpcImRheVwiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJ0b2RheVwiLFwiMVwiOlwidG9tb3Jyb3dcIixcIi0xXCI6XCJ5ZXN0ZXJkYXlcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImluIHswfSBkYXlcIixcIm90aGVyXCI6XCJpbiB7MH0gZGF5c1wifSxcInBhc3RcIjp7XCJvbmVcIjpcInswfSBkYXkgYWdvXCIsXCJvdGhlclwiOlwiezB9IGRheXMgYWdvXCJ9fX0sXCJob3VyXCI6e1wiZGlzcGxheU5hbWVcIjpcImhvdXJcIixcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiaW4gezB9IGhvdXJcIixcIm90aGVyXCI6XCJpbiB7MH0gaG91cnNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJ7MH0gaG91ciBhZ29cIixcIm90aGVyXCI6XCJ7MH0gaG91cnMgYWdvXCJ9fX0sXCJtaW51dGVcIjp7XCJkaXNwbGF5TmFtZVwiOlwibWludXRlXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImluIHswfSBtaW51dGVcIixcIm90aGVyXCI6XCJpbiB7MH0gbWludXRlc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcInswfSBtaW51dGUgYWdvXCIsXCJvdGhlclwiOlwiezB9IG1pbnV0ZXMgYWdvXCJ9fX0sXCJzZWNvbmRcIjp7XCJkaXNwbGF5TmFtZVwiOlwic2Vjb25kXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcIm5vd1wifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiaW4gezB9IHNlY29uZFwiLFwib3RoZXJcIjpcImluIHswfSBzZWNvbmRzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiezB9IHNlY29uZCBhZ29cIixcIm90aGVyXCI6XCJ7MH0gc2Vjb25kcyBhZ29cIn19fX19KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi0wMDFcIixcInBhcmVudExvY2FsZVwiOlwiZW5cIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLTE1MFwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUFHXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tQUlcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1BU1wiLFwicGFyZW50TG9jYWxlXCI6XCJlblwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tQVRcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMTUwXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1BVVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUJCXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tQkVcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1CSVwiLFwicGFyZW50TG9jYWxlXCI6XCJlblwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tQk1cIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1CU1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUJXXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tQlpcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1DQVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUNDXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tQ0hcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMTUwXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1DS1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUNNXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tQ1hcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1DWVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLURFXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTE1MFwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tREdcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1ES1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0xNTBcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLURNXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tRHNydFwiLFwicGx1cmFsUnVsZUZ1bmN0aW9uXCI6ZnVuY3Rpb24gKG4sb3JkKXtpZihvcmQpcmV0dXJuXCJvdGhlclwiO3JldHVyblwib3RoZXJcIn0sXCJmaWVsZHNcIjp7XCJ5ZWFyXCI6e1wiZGlzcGxheU5hbWVcIjpcIlllYXJcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwidGhpcyB5ZWFyXCIsXCIxXCI6XCJuZXh0IHllYXJcIixcIi0xXCI6XCJsYXN0IHllYXJcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvdGhlclwiOlwiK3swfSB5XCJ9LFwicGFzdFwiOntcIm90aGVyXCI6XCItezB9IHlcIn19fSxcIm1vbnRoXCI6e1wiZGlzcGxheU5hbWVcIjpcIk1vbnRoXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcInRoaXMgbW9udGhcIixcIjFcIjpcIm5leHQgbW9udGhcIixcIi0xXCI6XCJsYXN0IG1vbnRoXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib3RoZXJcIjpcIit7MH0gbVwifSxcInBhc3RcIjp7XCJvdGhlclwiOlwiLXswfSBtXCJ9fX0sXCJkYXlcIjp7XCJkaXNwbGF5TmFtZVwiOlwiRGF5XCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcInRvZGF5XCIsXCIxXCI6XCJ0b21vcnJvd1wiLFwiLTFcIjpcInllc3RlcmRheVwifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm90aGVyXCI6XCIrezB9IGRcIn0sXCJwYXN0XCI6e1wib3RoZXJcIjpcIi17MH0gZFwifX19LFwiaG91clwiOntcImRpc3BsYXlOYW1lXCI6XCJIb3VyXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvdGhlclwiOlwiK3swfSBoXCJ9LFwicGFzdFwiOntcIm90aGVyXCI6XCItezB9IGhcIn19fSxcIm1pbnV0ZVwiOntcImRpc3BsYXlOYW1lXCI6XCJNaW51dGVcIixcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm90aGVyXCI6XCIrezB9IG1pblwifSxcInBhc3RcIjp7XCJvdGhlclwiOlwiLXswfSBtaW5cIn19fSxcInNlY29uZFwiOntcImRpc3BsYXlOYW1lXCI6XCJTZWNvbmRcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwibm93XCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib3RoZXJcIjpcIit7MH0gc1wifSxcInBhc3RcIjp7XCJvdGhlclwiOlwiLXswfSBzXCJ9fX19fSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tRVJcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1GSVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0xNTBcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUZKXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tRktcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1GTVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUdCXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tR0RcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1HR1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUdIXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tR0lcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1HTVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUdVXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1HWVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUhLXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tSUVcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1JTFwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUlNXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tSU5cIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1JT1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUpFXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tSk1cIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1LRVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUtJXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tS05cIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1LWVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLUxDXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tTFJcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1MU1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLU1HXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tTUhcIixcInBhcmVudExvY2FsZVwiOlwiZW5cIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLU1PXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tTVBcIixcInBhcmVudExvY2FsZVwiOlwiZW5cIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLU1TXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tTVRcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1NVVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLU1XXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tTVlcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1OQVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLU5GXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tTkdcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1OTFwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0xNTBcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLU5SXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tTlVcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1OWlwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVBHXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tUEhcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1QS1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVBOXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tUFJcIixcInBhcmVudExvY2FsZVwiOlwiZW5cIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVBXXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tUldcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1TQlwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVNDXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tU0RcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1TRVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0xNTBcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVNHXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tU0hcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1TSVwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0xNTBcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVNMXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tU1NcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1TWFwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVNaXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tU2hhd1wiLFwicGx1cmFsUnVsZUZ1bmN0aW9uXCI6ZnVuY3Rpb24gKG4sb3JkKXtpZihvcmQpcmV0dXJuXCJvdGhlclwiO3JldHVyblwib3RoZXJcIn0sXCJmaWVsZHNcIjp7XCJ5ZWFyXCI6e1wiZGlzcGxheU5hbWVcIjpcIlllYXJcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwidGhpcyB5ZWFyXCIsXCIxXCI6XCJuZXh0IHllYXJcIixcIi0xXCI6XCJsYXN0IHllYXJcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvdGhlclwiOlwiK3swfSB5XCJ9LFwicGFzdFwiOntcIm90aGVyXCI6XCItezB9IHlcIn19fSxcIm1vbnRoXCI6e1wiZGlzcGxheU5hbWVcIjpcIk1vbnRoXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcInRoaXMgbW9udGhcIixcIjFcIjpcIm5leHQgbW9udGhcIixcIi0xXCI6XCJsYXN0IG1vbnRoXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib3RoZXJcIjpcIit7MH0gbVwifSxcInBhc3RcIjp7XCJvdGhlclwiOlwiLXswfSBtXCJ9fX0sXCJkYXlcIjp7XCJkaXNwbGF5TmFtZVwiOlwiRGF5XCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcInRvZGF5XCIsXCIxXCI6XCJ0b21vcnJvd1wiLFwiLTFcIjpcInllc3RlcmRheVwifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm90aGVyXCI6XCIrezB9IGRcIn0sXCJwYXN0XCI6e1wib3RoZXJcIjpcIi17MH0gZFwifX19LFwiaG91clwiOntcImRpc3BsYXlOYW1lXCI6XCJIb3VyXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvdGhlclwiOlwiK3swfSBoXCJ9LFwicGFzdFwiOntcIm90aGVyXCI6XCItezB9IGhcIn19fSxcIm1pbnV0ZVwiOntcImRpc3BsYXlOYW1lXCI6XCJNaW51dGVcIixcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm90aGVyXCI6XCIrezB9IG1pblwifSxcInBhc3RcIjp7XCJvdGhlclwiOlwiLXswfSBtaW5cIn19fSxcInNlY29uZFwiOntcImRpc3BsYXlOYW1lXCI6XCJTZWNvbmRcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwibm93XCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib3RoZXJcIjpcIit7MH0gc1wifSxcInBhc3RcIjp7XCJvdGhlclwiOlwiLXswfSBzXCJ9fX19fSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tVENcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1US1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVRPXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tVFRcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1UVlwiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVRaXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tVUdcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1VTVwiLFwicGFyZW50TG9jYWxlXCI6XCJlblwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tVVNcIixcInBhcmVudExvY2FsZVwiOlwiZW5cIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVZDXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tVkdcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1WSVwiLFwicGFyZW50TG9jYWxlXCI6XCJlblwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tVlVcIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1XU1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVuLVpBXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVuLTAwMVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZW4tWk1cIixcInBhcmVudExvY2FsZVwiOlwiZW4tMDAxXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlbi1aV1wiLFwicGFyZW50TG9jYWxlXCI6XCJlbi0wMDFcIn0pO1xuIiwiSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVzXCIsXCJwbHVyYWxSdWxlRnVuY3Rpb25cIjpmdW5jdGlvbiAobixvcmQpe2lmKG9yZClyZXR1cm5cIm90aGVyXCI7cmV0dXJuIG49PTE/XCJvbmVcIjpcIm90aGVyXCJ9LFwiZmllbGRzXCI6e1wieWVhclwiOntcImRpc3BsYXlOYW1lXCI6XCJhw7FvXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImVzdGUgYcOxb1wiLFwiMVwiOlwiZWwgcHLDs3hpbW8gYcOxb1wiLFwiLTFcIjpcImVsIGHDsW8gcGFzYWRvXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGHDsW9cIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGHDsW9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gYcOxb1wiLFwib3RoZXJcIjpcImhhY2UgezB9IGHDsW9zXCJ9fX0sXCJtb250aFwiOntcImRpc3BsYXlOYW1lXCI6XCJtZXNcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiZXN0ZSBtZXNcIixcIjFcIjpcImVsIHByw7N4aW1vIG1lc1wiLFwiLTFcIjpcImVsIG1lcyBwYXNhZG9cIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gbWVzXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBtZXNlc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IG1lc1wiLFwib3RoZXJcIjpcImhhY2UgezB9IG1lc2VzXCJ9fX0sXCJkYXlcIjp7XCJkaXNwbGF5TmFtZVwiOlwiZMOtYVwiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJob3lcIixcIjFcIjpcIm1hw7FhbmFcIixcIjJcIjpcInBhc2FkbyBtYcOxYW5hXCIsXCItMlwiOlwiYW50ZWF5ZXJcIixcIi0xXCI6XCJheWVyXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGTDrWFcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGTDrWFzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gZMOtYVwiLFwib3RoZXJcIjpcImhhY2UgezB9IGTDrWFzXCJ9fX0sXCJob3VyXCI6e1wiZGlzcGxheU5hbWVcIjpcImhvcmFcIixcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBob3JhXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBob3Jhc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IGhvcmFcIixcIm90aGVyXCI6XCJoYWNlIHswfSBob3Jhc1wifX19LFwibWludXRlXCI6e1wiZGlzcGxheU5hbWVcIjpcIm1pbnV0b1wiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IG1pbnV0b1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gbWludXRvc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IG1pbnV0b1wiLFwib3RoZXJcIjpcImhhY2UgezB9IG1pbnV0b3NcIn19fSxcInNlY29uZFwiOntcImRpc3BsYXlOYW1lXCI6XCJzZWd1bmRvXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImFob3JhXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IHNlZ3VuZG9cIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IHNlZ3VuZG9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gc2VndW5kb1wiLFwib3RoZXJcIjpcImhhY2UgezB9IHNlZ3VuZG9zXCJ9fX19fSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZXMtNDE5XCIsXCJwYXJlbnRMb2NhbGVcIjpcImVzXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1BUlwiLFwicGFyZW50TG9jYWxlXCI6XCJlcy00MTlcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVzLUJPXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVzLTQxOVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZXMtQ0xcIixcInBhcmVudExvY2FsZVwiOlwiZXMtNDE5XCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1DT1wiLFwicGFyZW50TG9jYWxlXCI6XCJlcy00MTlcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVzLUNSXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVzLTQxOVwiLFwiZmllbGRzXCI6e1wieWVhclwiOntcImRpc3BsYXlOYW1lXCI6XCJhw7FvXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImVzdGUgYcOxb1wiLFwiMVwiOlwiZWwgcHLDs3hpbW8gYcOxb1wiLFwiLTFcIjpcImVsIGHDsW8gcGFzYWRvXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGHDsW9cIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGHDsW9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gYcOxb1wiLFwib3RoZXJcIjpcImhhY2UgezB9IGHDsW9zXCJ9fX0sXCJtb250aFwiOntcImRpc3BsYXlOYW1lXCI6XCJtZXNcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiZXN0ZSBtZXNcIixcIjFcIjpcImVsIHByw7N4aW1vIG1lc1wiLFwiLTFcIjpcImVsIG1lcyBwYXNhZG9cIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gbWVzXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBtZXNlc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IG1lc1wiLFwib3RoZXJcIjpcImhhY2UgezB9IG1lc2VzXCJ9fX0sXCJkYXlcIjp7XCJkaXNwbGF5TmFtZVwiOlwiZMOtYVwiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJob3lcIixcIjFcIjpcIm1hw7FhbmFcIixcIjJcIjpcInBhc2FkbyBtYcOxYW5hXCIsXCItMlwiOlwiYW50aWVyXCIsXCItMVwiOlwiYXllclwifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBkw61hXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBkw61hc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IGTDrWFcIixcIm90aGVyXCI6XCJoYWNlIHswfSBkw61hc1wifX19LFwiaG91clwiOntcImRpc3BsYXlOYW1lXCI6XCJob3JhXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gaG9yYVwiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gaG9yYXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBob3JhXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gaG9yYXNcIn19fSxcIm1pbnV0ZVwiOntcImRpc3BsYXlOYW1lXCI6XCJtaW51dG9cIixcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBtaW51dG9cIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IG1pbnV0b3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBtaW51dG9cIixcIm90aGVyXCI6XCJoYWNlIHswfSBtaW51dG9zXCJ9fX0sXCJzZWNvbmRcIjp7XCJkaXNwbGF5TmFtZVwiOlwic2VndW5kb1wiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJhaG9yYVwifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBzZWd1bmRvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBzZWd1bmRvc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IHNlZ3VuZG9cIixcIm90aGVyXCI6XCJoYWNlIHswfSBzZWd1bmRvc1wifX19fX0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVzLUNVXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVzLTQxOVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZXMtRE9cIixcInBhcmVudExvY2FsZVwiOlwiZXMtNDE5XCIsXCJmaWVsZHNcIjp7XCJ5ZWFyXCI6e1wiZGlzcGxheU5hbWVcIjpcIkHDsW9cIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiZXN0ZSBhw7FvXCIsXCIxXCI6XCJlbCBwcsOzeGltbyBhw7FvXCIsXCItMVwiOlwiZWwgYcOxbyBwYXNhZG9cIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gYcOxb1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gYcOxb3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBhw7FvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gYcOxb3NcIn19fSxcIm1vbnRoXCI6e1wiZGlzcGxheU5hbWVcIjpcIk1lc1wiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJlc3RlIG1lc1wiLFwiMVwiOlwiZWwgcHLDs3hpbW8gbWVzXCIsXCItMVwiOlwiZWwgbWVzIHBhc2Fkb1wifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBtZXNcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IG1lc2VzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gbWVzXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gbWVzZXNcIn19fSxcImRheVwiOntcImRpc3BsYXlOYW1lXCI6XCJEw61hXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImhveVwiLFwiMVwiOlwibWHDsWFuYVwiLFwiMlwiOlwicGFzYWRvIG1hw7FhbmFcIixcIi0yXCI6XCJhbnRlYXllclwiLFwiLTFcIjpcImF5ZXJcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gZMOtYVwiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gZMOtYXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBkw61hXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gZMOtYXNcIn19fSxcImhvdXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiaG9yYVwiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGhvcmFcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGhvcmFzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gaG9yYVwiLFwib3RoZXJcIjpcImhhY2UgezB9IGhvcmFzXCJ9fX0sXCJtaW51dGVcIjp7XCJkaXNwbGF5TmFtZVwiOlwiTWludXRvXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBtaW51dG9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gbWludXRvc1wifX19LFwic2Vjb25kXCI6e1wiZGlzcGxheU5hbWVcIjpcIlNlZ3VuZG9cIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiYWhvcmFcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBzZWd1bmRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gc2VndW5kb3NcIn19fX19KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1FQVwiLFwicGFyZW50TG9jYWxlXCI6XCJlc1wifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZXMtRUNcIixcInBhcmVudExvY2FsZVwiOlwiZXMtNDE5XCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1HUVwiLFwicGFyZW50TG9jYWxlXCI6XCJlc1wifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZXMtR1RcIixcInBhcmVudExvY2FsZVwiOlwiZXMtNDE5XCIsXCJmaWVsZHNcIjp7XCJ5ZWFyXCI6e1wiZGlzcGxheU5hbWVcIjpcImHDsW9cIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiZXN0ZSBhw7FvXCIsXCIxXCI6XCJlbCBwcsOzeGltbyBhw7FvXCIsXCItMVwiOlwiZWwgYcOxbyBwYXNhZG9cIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gYcOxb1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gYcOxb3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBhw7FvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gYcOxb3NcIn19fSxcIm1vbnRoXCI6e1wiZGlzcGxheU5hbWVcIjpcIm1lc1wiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJlc3RlIG1lc1wiLFwiMVwiOlwiZWwgcHLDs3hpbW8gbWVzXCIsXCItMVwiOlwiZWwgbWVzIHBhc2Fkb1wifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBtZXNcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IG1lc2VzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gbWVzXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gbWVzZXNcIn19fSxcImRheVwiOntcImRpc3BsYXlOYW1lXCI6XCJkw61hXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImhveVwiLFwiMVwiOlwibWHDsWFuYVwiLFwiMlwiOlwicGFzYWRvIG1hw7FhbmFcIixcIi0yXCI6XCJhbnRpZXJcIixcIi0xXCI6XCJheWVyXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGTDrWFcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGTDrWFzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gZMOtYVwiLFwib3RoZXJcIjpcImhhY2UgezB9IGTDrWFzXCJ9fX0sXCJob3VyXCI6e1wiZGlzcGxheU5hbWVcIjpcImhvcmFcIixcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBob3JhXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBob3Jhc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IGhvcmFcIixcIm90aGVyXCI6XCJoYWNlIHswfSBob3Jhc1wifX19LFwibWludXRlXCI6e1wiZGlzcGxheU5hbWVcIjpcIm1pbnV0b1wiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IG1pbnV0b1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gbWludXRvc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IG1pbnV0b1wiLFwib3RoZXJcIjpcImhhY2UgezB9IG1pbnV0b3NcIn19fSxcInNlY29uZFwiOntcImRpc3BsYXlOYW1lXCI6XCJzZWd1bmRvXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImFob3JhXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IHNlZ3VuZG9cIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IHNlZ3VuZG9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gc2VndW5kb1wiLFwib3RoZXJcIjpcImhhY2UgezB9IHNlZ3VuZG9zXCJ9fX19fSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZXMtSE5cIixcInBhcmVudExvY2FsZVwiOlwiZXMtNDE5XCIsXCJmaWVsZHNcIjp7XCJ5ZWFyXCI6e1wiZGlzcGxheU5hbWVcIjpcImHDsW9cIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiZXN0ZSBhw7FvXCIsXCIxXCI6XCJlbCBwcsOzeGltbyBhw7FvXCIsXCItMVwiOlwiZWwgYcOxbyBwYXNhZG9cIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gYcOxb1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gYcOxb3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBhw7FvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gYcOxb3NcIn19fSxcIm1vbnRoXCI6e1wiZGlzcGxheU5hbWVcIjpcIm1lc1wiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJlc3RlIG1lc1wiLFwiMVwiOlwiZWwgcHLDs3hpbW8gbWVzXCIsXCItMVwiOlwiZWwgbWVzIHBhc2Fkb1wifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBtZXNcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IG1lc2VzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gbWVzXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gbWVzZXNcIn19fSxcImRheVwiOntcImRpc3BsYXlOYW1lXCI6XCJkw61hXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImhveVwiLFwiMVwiOlwibWHDsWFuYVwiLFwiMlwiOlwicGFzYWRvIG1hw7FhbmFcIixcIi0yXCI6XCJhbnRpZXJcIixcIi0xXCI6XCJheWVyXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGTDrWFcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGTDrWFzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gZMOtYVwiLFwib3RoZXJcIjpcImhhY2UgezB9IGTDrWFzXCJ9fX0sXCJob3VyXCI6e1wiZGlzcGxheU5hbWVcIjpcImhvcmFcIixcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBob3JhXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBob3Jhc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IGhvcmFcIixcIm90aGVyXCI6XCJoYWNlIHswfSBob3Jhc1wifX19LFwibWludXRlXCI6e1wiZGlzcGxheU5hbWVcIjpcIm1pbnV0b1wiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IG1pbnV0b1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gbWludXRvc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IG1pbnV0b1wiLFwib3RoZXJcIjpcImhhY2UgezB9IG1pbnV0b3NcIn19fSxcInNlY29uZFwiOntcImRpc3BsYXlOYW1lXCI6XCJzZWd1bmRvXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImFob3JhXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IHNlZ3VuZG9cIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IHNlZ3VuZG9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gc2VndW5kb1wiLFwib3RoZXJcIjpcImhhY2UgezB9IHNlZ3VuZG9zXCJ9fX19fSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZXMtSUNcIixcInBhcmVudExvY2FsZVwiOlwiZXNcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVzLU1YXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVzLTQxOVwiLFwiZmllbGRzXCI6e1wieWVhclwiOntcImRpc3BsYXlOYW1lXCI6XCJhw7FvXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImVzdGUgYcOxb1wiLFwiMVwiOlwiZWwgYcOxbyBwcsOzeGltb1wiLFwiLTFcIjpcImVsIGHDsW8gcGFzYWRvXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGHDsW9cIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGHDsW9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gYcOxb1wiLFwib3RoZXJcIjpcImhhY2UgezB9IGHDsW9zXCJ9fX0sXCJtb250aFwiOntcImRpc3BsYXlOYW1lXCI6XCJtZXNcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiZXN0ZSBtZXNcIixcIjFcIjpcImVsIG1lcyBwcsOzeGltb1wiLFwiLTFcIjpcImVsIG1lcyBwYXNhZG9cIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImVuIHswfSBtZXNcIixcIm90aGVyXCI6XCJlbiB7MH0gbWVzZXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBtZXNcIixcIm90aGVyXCI6XCJoYWNlIHswfSBtZXNlc1wifX19LFwiZGF5XCI6e1wiZGlzcGxheU5hbWVcIjpcImTDrWFcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiaG95XCIsXCIxXCI6XCJtYcOxYW5hXCIsXCIyXCI6XCJwYXNhZG8gbWHDsWFuYVwiLFwiLTJcIjpcImFudGllclwiLFwiLTFcIjpcImF5ZXJcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gZMOtYVwiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gZMOtYXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBkw61hXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gZMOtYXNcIn19fSxcImhvdXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiaG9yYVwiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGhvcmFcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGhvcmFzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gaG9yYVwiLFwib3RoZXJcIjpcImhhY2UgezB9IGhvcmFzXCJ9fX0sXCJtaW51dGVcIjp7XCJkaXNwbGF5TmFtZVwiOlwibWludXRvXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBtaW51dG9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gbWludXRvc1wifX19LFwic2Vjb25kXCI6e1wiZGlzcGxheU5hbWVcIjpcInNlZ3VuZG9cIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiYWhvcmFcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBzZWd1bmRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gc2VndW5kb3NcIn19fX19KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1OSVwiLFwicGFyZW50TG9jYWxlXCI6XCJlcy00MTlcIixcImZpZWxkc1wiOntcInllYXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiYcOxb1wiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJlc3RlIGHDsW9cIixcIjFcIjpcImVsIHByw7N4aW1vIGHDsW9cIixcIi0xXCI6XCJlbCBhw7FvIHBhc2Fkb1wifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBhw7FvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBhw7Fvc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IGHDsW9cIixcIm90aGVyXCI6XCJoYWNlIHswfSBhw7Fvc1wifX19LFwibW9udGhcIjp7XCJkaXNwbGF5TmFtZVwiOlwibWVzXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImVzdGUgbWVzXCIsXCIxXCI6XCJlbCBwcsOzeGltbyBtZXNcIixcIi0xXCI6XCJlbCBtZXMgcGFzYWRvXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IG1lc1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gbWVzZXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBtZXNcIixcIm90aGVyXCI6XCJoYWNlIHswfSBtZXNlc1wifX19LFwiZGF5XCI6e1wiZGlzcGxheU5hbWVcIjpcImTDrWFcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiaG95XCIsXCIxXCI6XCJtYcOxYW5hXCIsXCIyXCI6XCJwYXNhZG8gbWHDsWFuYVwiLFwiLTJcIjpcImFudGllclwiLFwiLTFcIjpcImF5ZXJcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gZMOtYVwiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gZMOtYXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBkw61hXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gZMOtYXNcIn19fSxcImhvdXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiaG9yYVwiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGhvcmFcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGhvcmFzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gaG9yYVwiLFwib3RoZXJcIjpcImhhY2UgezB9IGhvcmFzXCJ9fX0sXCJtaW51dGVcIjp7XCJkaXNwbGF5TmFtZVwiOlwibWludXRvXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBtaW51dG9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gbWludXRvc1wifX19LFwic2Vjb25kXCI6e1wiZGlzcGxheU5hbWVcIjpcInNlZ3VuZG9cIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiYWhvcmFcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBzZWd1bmRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gc2VndW5kb3NcIn19fX19KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1QQVwiLFwicGFyZW50TG9jYWxlXCI6XCJlcy00MTlcIixcImZpZWxkc1wiOntcInllYXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiYcOxb1wiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJlc3RlIGHDsW9cIixcIjFcIjpcImVsIHByw7N4aW1vIGHDsW9cIixcIi0xXCI6XCJlbCBhw7FvIHBhc2Fkb1wifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBhw7FvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBhw7Fvc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IGHDsW9cIixcIm90aGVyXCI6XCJoYWNlIHswfSBhw7Fvc1wifX19LFwibW9udGhcIjp7XCJkaXNwbGF5TmFtZVwiOlwibWVzXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImVzdGUgbWVzXCIsXCIxXCI6XCJlbCBwcsOzeGltbyBtZXNcIixcIi0xXCI6XCJlbCBtZXMgcGFzYWRvXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IG1lc1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gbWVzZXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBtZXNcIixcIm90aGVyXCI6XCJoYWNlIHswfSBtZXNlc1wifX19LFwiZGF5XCI6e1wiZGlzcGxheU5hbWVcIjpcImTDrWFcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiaG95XCIsXCIxXCI6XCJtYcOxYW5hXCIsXCIyXCI6XCJwYXNhZG8gbWHDsWFuYVwiLFwiLTJcIjpcImFudGllclwiLFwiLTFcIjpcImF5ZXJcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gZMOtYVwiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gZMOtYXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBkw61hXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gZMOtYXNcIn19fSxcImhvdXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiaG9yYVwiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGhvcmFcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGhvcmFzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gaG9yYVwiLFwib3RoZXJcIjpcImhhY2UgezB9IGhvcmFzXCJ9fX0sXCJtaW51dGVcIjp7XCJkaXNwbGF5TmFtZVwiOlwibWludXRvXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBtaW51dG9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gbWludXRvc1wifX19LFwic2Vjb25kXCI6e1wiZGlzcGxheU5hbWVcIjpcInNlZ3VuZG9cIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiYWhvcmFcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBzZWd1bmRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gc2VndW5kb3NcIn19fX19KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1QRVwiLFwicGFyZW50TG9jYWxlXCI6XCJlcy00MTlcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVzLVBIXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVzXCJ9KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1QUlwiLFwicGFyZW50TG9jYWxlXCI6XCJlcy00MTlcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVzLVBZXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVzLTQxOVwiLFwiZmllbGRzXCI6e1wieWVhclwiOntcImRpc3BsYXlOYW1lXCI6XCJhw7FvXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImVzdGUgYcOxb1wiLFwiMVwiOlwiZWwgcHLDs3hpbW8gYcOxb1wiLFwiLTFcIjpcImVsIGHDsW8gcGFzYWRvXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGHDsW9cIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGHDsW9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gYcOxb1wiLFwib3RoZXJcIjpcImhhY2UgezB9IGHDsW9zXCJ9fX0sXCJtb250aFwiOntcImRpc3BsYXlOYW1lXCI6XCJtZXNcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiZXN0ZSBtZXNcIixcIjFcIjpcImVsIHByw7N4aW1vIG1lc1wiLFwiLTFcIjpcImVsIG1lcyBwYXNhZG9cIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gbWVzXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBtZXNlc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IG1lc1wiLFwib3RoZXJcIjpcImhhY2UgezB9IG1lc2VzXCJ9fX0sXCJkYXlcIjp7XCJkaXNwbGF5TmFtZVwiOlwiZMOtYVwiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJob3lcIixcIjFcIjpcIm1hw7FhbmFcIixcIjJcIjpcInBhc2FkbyBtYcOxYW5hXCIsXCItMlwiOlwiYW50ZXMgZGUgYXllclwiLFwiLTFcIjpcImF5ZXJcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gZMOtYVwiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gZMOtYXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBkw61hXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gZMOtYXNcIn19fSxcImhvdXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiaG9yYVwiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGhvcmFcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGhvcmFzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gaG9yYVwiLFwib3RoZXJcIjpcImhhY2UgezB9IGhvcmFzXCJ9fX0sXCJtaW51dGVcIjp7XCJkaXNwbGF5TmFtZVwiOlwibWludXRvXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBtaW51dG9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gbWludXRvc1wifX19LFwic2Vjb25kXCI6e1wiZGlzcGxheU5hbWVcIjpcInNlZ3VuZG9cIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiYWhvcmFcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBzZWd1bmRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gc2VndW5kb3NcIn19fX19KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1TVlwiLFwicGFyZW50TG9jYWxlXCI6XCJlcy00MTlcIixcImZpZWxkc1wiOntcInllYXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiYcOxb1wiLFwicmVsYXRpdmVcIjp7XCIwXCI6XCJlc3RlIGHDsW9cIixcIjFcIjpcImVsIHByw7N4aW1vIGHDsW9cIixcIi0xXCI6XCJlbCBhw7FvIHBhc2Fkb1wifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiZGVudHJvIGRlIHswfSBhw7FvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBhw7Fvc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcImhhY2UgezB9IGHDsW9cIixcIm90aGVyXCI6XCJoYWNlIHswfSBhw7Fvc1wifX19LFwibW9udGhcIjp7XCJkaXNwbGF5TmFtZVwiOlwibWVzXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcImVzdGUgbWVzXCIsXCIxXCI6XCJlbCBwcsOzeGltbyBtZXNcIixcIi0xXCI6XCJlbCBtZXMgcGFzYWRvXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IG1lc1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gbWVzZXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBtZXNcIixcIm90aGVyXCI6XCJoYWNlIHswfSBtZXNlc1wifX19LFwiZGF5XCI6e1wiZGlzcGxheU5hbWVcIjpcImTDrWFcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiaG95XCIsXCIxXCI6XCJtYcOxYW5hXCIsXCIyXCI6XCJwYXNhZG8gbWHDsWFuYVwiLFwiLTJcIjpcImFudGllclwiLFwiLTFcIjpcImF5ZXJcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gZMOtYVwiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gZMOtYXNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBkw61hXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gZMOtYXNcIn19fSxcImhvdXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiaG9yYVwiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJkZW50cm8gZGUgezB9IGhvcmFcIixcIm90aGVyXCI6XCJkZW50cm8gZGUgezB9IGhvcmFzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gaG9yYVwiLFwib3RoZXJcIjpcImhhY2UgezB9IGhvcmFzXCJ9fX0sXCJtaW51dGVcIjp7XCJkaXNwbGF5TmFtZVwiOlwibWludXRvXCIsXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiZGVudHJvIGRlIHswfSBtaW51dG9zXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiaGFjZSB7MH0gbWludXRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gbWludXRvc1wifX19LFwic2Vjb25kXCI6e1wiZGlzcGxheU5hbWVcIjpcInNlZ3VuZG9cIixcInJlbGF0aXZlXCI6e1wiMFwiOlwiYWhvcmFcIn0sXCJyZWxhdGl2ZVRpbWVcIjp7XCJmdXR1cmVcIjp7XCJvbmVcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb1wiLFwib3RoZXJcIjpcImRlbnRybyBkZSB7MH0gc2VndW5kb3NcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJoYWNlIHswfSBzZWd1bmRvXCIsXCJvdGhlclwiOlwiaGFjZSB7MH0gc2VndW5kb3NcIn19fX19KTtcbkludGxSZWxhdGl2ZUZvcm1hdC5fX2FkZExvY2FsZURhdGEoe1wibG9jYWxlXCI6XCJlcy1VU1wiLFwicGFyZW50TG9jYWxlXCI6XCJlcy00MTlcIn0pO1xuSW50bFJlbGF0aXZlRm9ybWF0Ll9fYWRkTG9jYWxlRGF0YSh7XCJsb2NhbGVcIjpcImVzLVVZXCIsXCJwYXJlbnRMb2NhbGVcIjpcImVzLTQxOVwifSk7XG5JbnRsUmVsYXRpdmVGb3JtYXQuX19hZGRMb2NhbGVEYXRhKHtcImxvY2FsZVwiOlwiZXMtVkVcIixcInBhcmVudExvY2FsZVwiOlwiZXMtNDE5XCJ9KTtcbiIsIi8qIGpzaGludCBub2RlOnRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgSW50bFJlbGF0aXZlRm9ybWF0ID0gcmVxdWlyZSgnLi9saWIvbWFpbicpWydkZWZhdWx0J107XG5cbi8vIEFkZCBhbGwgbG9jYWxlIGRhdGEgdG8gYEludGxSZWxhdGl2ZUZvcm1hdGAuIFRoaXMgbW9kdWxlIHdpbGwgYmUgaWdub3JlZCB3aGVuXG4vLyBidW5kbGluZyBmb3IgdGhlIGJyb3dzZXIgd2l0aCBCcm93c2VyaWZ5L1dlYnBhY2suXG5yZXF1aXJlKCcuL2xpYi9sb2NhbGVzJyk7XG5cbi8vIFJlLWV4cG9ydCBgSW50bFJlbGF0aXZlRm9ybWF0YCBhcyB0aGUgQ29tbW9uSlMgZGVmYXVsdCBleHBvcnRzIHdpdGggYWxsIHRoZVxuLy8gbG9jYWxlIGRhdGEgcmVnaXN0ZXJlZCwgYW5kIHdpdGggRW5nbGlzaCBzZXQgYXMgdGhlIGRlZmF1bHQgbG9jYWxlLiBEZWZpbmVcbi8vIHRoZSBgZGVmYXVsdGAgcHJvcCBmb3IgdXNlIHdpdGggb3RoZXIgY29tcGlsZWQgRVM2IE1vZHVsZXMuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBJbnRsUmVsYXRpdmVGb3JtYXQ7XG5leHBvcnRzWydkZWZhdWx0J10gPSBleHBvcnRzO1xuIiwiLypcbkNvcHlyaWdodCAoYykgMjAxNCwgWWFob28hIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbkNvcHlyaWdodHMgbGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgTGljZW5zZS5cblNlZSB0aGUgYWNjb21wYW55aW5nIExJQ0VOU0UgZmlsZSBmb3IgdGVybXMuXG4qL1xuXG4vKiBqc2xpbnQgZXNuZXh0OiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xudmFyIGludGwkbWVzc2FnZWZvcm1hdCQkID0gcmVxdWlyZShcImludGwtbWVzc2FnZWZvcm1hdFwiKSwgc3JjJGRpZmYkJCA9IHJlcXVpcmUoXCIuL2RpZmZcIiksIHNyYyRlczUkJCA9IHJlcXVpcmUoXCIuL2VzNVwiKTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gUmVsYXRpdmVGb3JtYXQ7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBGSUVMRFMgPSBbJ3NlY29uZCcsICdtaW51dGUnLCAnaG91cicsICdkYXknLCAnbW9udGgnLCAneWVhciddO1xudmFyIFNUWUxFUyA9IFsnYmVzdCBmaXQnLCAnbnVtZXJpYyddO1xuXG4vLyAtLSBSZWxhdGl2ZUZvcm1hdCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBSZWxhdGl2ZUZvcm1hdChsb2NhbGVzLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAvLyBNYWtlIGEgY29weSBvZiBgbG9jYWxlc2AgaWYgaXQncyBhbiBhcnJheSwgc28gdGhhdCBpdCBkb2Vzbid0IGNoYW5nZVxuICAgIC8vIHNpbmNlIGl0J3MgdXNlZCBsYXppbHkuXG4gICAgaWYgKHNyYyRlczUkJC5pc0FycmF5KGxvY2FsZXMpKSB7XG4gICAgICAgIGxvY2FsZXMgPSBsb2NhbGVzLmNvbmNhdCgpO1xuICAgIH1cblxuICAgIHNyYyRlczUkJC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX2xvY2FsZScsIHt2YWx1ZTogdGhpcy5fcmVzb2x2ZUxvY2FsZShsb2NhbGVzKX0pO1xuICAgIHNyYyRlczUkJC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX29wdGlvbnMnLCB7dmFsdWU6IHtcbiAgICAgICAgc3R5bGU6IHRoaXMuX3Jlc29sdmVTdHlsZShvcHRpb25zLnN0eWxlKSxcbiAgICAgICAgdW5pdHM6IHRoaXMuX2lzVmFsaWRVbml0cyhvcHRpb25zLnVuaXRzKSAmJiBvcHRpb25zLnVuaXRzXG4gICAgfX0pO1xuXG4gICAgc3JjJGVzNSQkLmRlZmluZVByb3BlcnR5KHRoaXMsICdfbG9jYWxlcycsIHt2YWx1ZTogbG9jYWxlc30pO1xuICAgIHNyYyRlczUkJC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX2ZpZWxkcycsIHt2YWx1ZTogdGhpcy5fZmluZEZpZWxkcyh0aGlzLl9sb2NhbGUpfSk7XG4gICAgc3JjJGVzNSQkLmRlZmluZVByb3BlcnR5KHRoaXMsICdfbWVzc2FnZXMnLCB7dmFsdWU6IHNyYyRlczUkJC5vYmpDcmVhdGUobnVsbCl9KTtcblxuICAgIC8vIFwiQmluZFwiIGBmb3JtYXQoKWAgbWV0aG9kIHRvIGB0aGlzYCBzbyBpdCBjYW4gYmUgcGFzc2VkIGJ5IHJlZmVyZW5jZSBsaWtlXG4gICAgLy8gdGhlIG90aGVyIGBJbnRsYCBBUElzLlxuICAgIHZhciByZWxhdGl2ZUZvcm1hdCA9IHRoaXM7XG4gICAgdGhpcy5mb3JtYXQgPSBmdW5jdGlvbiBmb3JtYXQoZGF0ZSwgb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gcmVsYXRpdmVGb3JtYXQuX2Zvcm1hdChkYXRlLCBvcHRpb25zKTtcbiAgICB9O1xufVxuXG4vLyBEZWZpbmUgaW50ZXJuYWwgcHJpdmF0ZSBwcm9wZXJ0aWVzIGZvciBkZWFsaW5nIHdpdGggbG9jYWxlIGRhdGEuXG5zcmMkZXM1JCQuZGVmaW5lUHJvcGVydHkoUmVsYXRpdmVGb3JtYXQsICdfX2xvY2FsZURhdGFfXycsIHt2YWx1ZTogc3JjJGVzNSQkLm9iakNyZWF0ZShudWxsKX0pO1xuc3JjJGVzNSQkLmRlZmluZVByb3BlcnR5KFJlbGF0aXZlRm9ybWF0LCAnX19hZGRMb2NhbGVEYXRhJywge3ZhbHVlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGlmICghKGRhdGEgJiYgZGF0YS5sb2NhbGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICdMb2NhbGUgZGF0YSBwcm92aWRlZCB0byBJbnRsUmVsYXRpdmVGb3JtYXQgaXMgbWlzc2luZyBhICcgK1xuICAgICAgICAgICAgJ2Bsb2NhbGVgIHByb3BlcnR5IHZhbHVlJ1xuICAgICAgICApO1xuICAgIH1cblxuICAgIFJlbGF0aXZlRm9ybWF0Ll9fbG9jYWxlRGF0YV9fW2RhdGEubG9jYWxlLnRvTG93ZXJDYXNlKCldID0gZGF0YTtcblxuICAgIC8vIEFkZCBkYXRhIHRvIEludGxNZXNzYWdlRm9ybWF0LlxuICAgIGludGwkbWVzc2FnZWZvcm1hdCQkW1wiZGVmYXVsdFwiXS5fX2FkZExvY2FsZURhdGEoZGF0YSk7XG59fSk7XG5cbi8vIERlZmluZSBwdWJsaWMgYGRlZmF1bHRMb2NhbGVgIHByb3BlcnR5IHdoaWNoIGNhbiBiZSBzZXQgYnkgdGhlIGRldmVsb3Blciwgb3Jcbi8vIGl0IHdpbGwgYmUgc2V0IHdoZW4gdGhlIGZpcnN0IFJlbGF0aXZlRm9ybWF0IGluc3RhbmNlIGlzIGNyZWF0ZWQgYnlcbi8vIGxldmVyYWdpbmcgdGhlIHJlc29sdmVkIGxvY2FsZSBmcm9tIGBJbnRsYC5cbnNyYyRlczUkJC5kZWZpbmVQcm9wZXJ0eShSZWxhdGl2ZUZvcm1hdCwgJ2RlZmF1bHRMb2NhbGUnLCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZSAgOiB0cnVlLFxuICAgIHZhbHVlICAgICA6IHVuZGVmaW5lZFxufSk7XG5cbi8vIERlZmluZSBwdWJsaWMgYHRocmVzaG9sZHNgIHByb3BlcnR5IHdoaWNoIGNhbiBiZSBzZXQgYnkgdGhlIGRldmVsb3BlciwgYW5kXG4vLyBkZWZhdWx0cyB0byByZWxhdGl2ZSB0aW1lIHRocmVzaG9sZHMgZnJvbSBtb21lbnQuanMuXG5zcmMkZXM1JCQuZGVmaW5lUHJvcGVydHkoUmVsYXRpdmVGb3JtYXQsICd0aHJlc2hvbGRzJywge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG5cbiAgICB2YWx1ZToge1xuICAgICAgICBzZWNvbmQ6IDQ1LCAgLy8gc2Vjb25kcyB0byBtaW51dGVcbiAgICAgICAgbWludXRlOiA0NSwgIC8vIG1pbnV0ZXMgdG8gaG91clxuICAgICAgICBob3VyICA6IDIyLCAgLy8gaG91cnMgdG8gZGF5XG4gICAgICAgIGRheSAgIDogMjYsICAvLyBkYXlzIHRvIG1vbnRoXG4gICAgICAgIG1vbnRoIDogMTEgICAvLyBtb250aHMgdG8geWVhclxuICAgIH1cbn0pO1xuXG5SZWxhdGl2ZUZvcm1hdC5wcm90b3R5cGUucmVzb2x2ZWRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGxvY2FsZTogdGhpcy5fbG9jYWxlLFxuICAgICAgICBzdHlsZSA6IHRoaXMuX29wdGlvbnMuc3R5bGUsXG4gICAgICAgIHVuaXRzIDogdGhpcy5fb3B0aW9ucy51bml0c1xuICAgIH07XG59O1xuXG5SZWxhdGl2ZUZvcm1hdC5wcm90b3R5cGUuX2NvbXBpbGVNZXNzYWdlID0gZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgLy8gYHRoaXMuX2xvY2FsZXNgIGlzIHRoZSBvcmlnaW5hbCBzZXQgb2YgbG9jYWxlcyB0aGUgdXNlciBzcGVjaWZpZWQgdG8gdGhlXG4gICAgLy8gY29uc3RydWN0b3IsIHdoaWxlIGB0aGlzLl9sb2NhbGVgIGlzIHRoZSByZXNvbHZlZCByb290IGxvY2FsZS5cbiAgICB2YXIgbG9jYWxlcyAgICAgICAgPSB0aGlzLl9sb2NhbGVzO1xuICAgIHZhciByZXNvbHZlZExvY2FsZSA9IHRoaXMuX2xvY2FsZTtcblxuICAgIHZhciBmaWVsZCAgICAgICAgPSB0aGlzLl9maWVsZHNbdW5pdHNdO1xuICAgIHZhciByZWxhdGl2ZVRpbWUgPSBmaWVsZC5yZWxhdGl2ZVRpbWU7XG4gICAgdmFyIGZ1dHVyZSAgICAgICA9ICcnO1xuICAgIHZhciBwYXN0ICAgICAgICAgPSAnJztcbiAgICB2YXIgaTtcblxuICAgIGZvciAoaSBpbiByZWxhdGl2ZVRpbWUuZnV0dXJlKSB7XG4gICAgICAgIGlmIChyZWxhdGl2ZVRpbWUuZnV0dXJlLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICBmdXR1cmUgKz0gJyAnICsgaSArICcgeycgK1xuICAgICAgICAgICAgICAgIHJlbGF0aXZlVGltZS5mdXR1cmVbaV0ucmVwbGFjZSgnezB9JywgJyMnKSArICd9JztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoaSBpbiByZWxhdGl2ZVRpbWUucGFzdCkge1xuICAgICAgICBpZiAocmVsYXRpdmVUaW1lLnBhc3QuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgIHBhc3QgKz0gJyAnICsgaSArICcgeycgK1xuICAgICAgICAgICAgICAgIHJlbGF0aXZlVGltZS5wYXN0W2ldLnJlcGxhY2UoJ3swfScsICcjJykgKyAnfSc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbWVzc2FnZSA9ICd7d2hlbiwgc2VsZWN0LCBmdXR1cmUge3swLCBwbHVyYWwsICcgKyBmdXR1cmUgKyAnfX0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwYXN0IHt7MCwgcGx1cmFsLCAnICsgcGFzdCArICd9fX0nO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSBzeW50aGV0aWMgSW50bE1lc3NhZ2VGb3JtYXQgaW5zdGFuY2UgdXNpbmcgdGhlIG9yaWdpbmFsXG4gICAgLy8gbG9jYWxlcyB2YWx1ZSBzcGVjaWZpZWQgYnkgdGhlIHVzZXIgd2hlbiBjb25zdHJ1Y3RpbmcgdGhlIHRoZSBwYXJlbnRcbiAgICAvLyBJbnRsUmVsYXRpdmVGb3JtYXQgaW5zdGFuY2UuXG4gICAgcmV0dXJuIG5ldyBpbnRsJG1lc3NhZ2Vmb3JtYXQkJFtcImRlZmF1bHRcIl0obWVzc2FnZSwgbG9jYWxlcyk7XG59O1xuXG5SZWxhdGl2ZUZvcm1hdC5wcm90b3R5cGUuX2dldE1lc3NhZ2UgPSBmdW5jdGlvbiAodW5pdHMpIHtcbiAgICB2YXIgbWVzc2FnZXMgPSB0aGlzLl9tZXNzYWdlcztcblxuICAgIC8vIENyZWF0ZSBhIG5ldyBzeW50aGV0aWMgbWVzc2FnZSBiYXNlZCBvbiB0aGUgbG9jYWxlIGRhdGEgZnJvbSBDTERSLlxuICAgIGlmICghbWVzc2FnZXNbdW5pdHNdKSB7XG4gICAgICAgIG1lc3NhZ2VzW3VuaXRzXSA9IHRoaXMuX2NvbXBpbGVNZXNzYWdlKHVuaXRzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVzc2FnZXNbdW5pdHNdO1xufTtcblxuUmVsYXRpdmVGb3JtYXQucHJvdG90eXBlLl9nZXRSZWxhdGl2ZVVuaXRzID0gZnVuY3Rpb24gKGRpZmYsIHVuaXRzKSB7XG4gICAgdmFyIGZpZWxkID0gdGhpcy5fZmllbGRzW3VuaXRzXTtcblxuICAgIGlmIChmaWVsZC5yZWxhdGl2ZSkge1xuICAgICAgICByZXR1cm4gZmllbGQucmVsYXRpdmVbZGlmZl07XG4gICAgfVxufTtcblxuUmVsYXRpdmVGb3JtYXQucHJvdG90eXBlLl9maW5kRmllbGRzID0gZnVuY3Rpb24gKGxvY2FsZSkge1xuICAgIHZhciBsb2NhbGVEYXRhID0gUmVsYXRpdmVGb3JtYXQuX19sb2NhbGVEYXRhX187XG4gICAgdmFyIGRhdGEgICAgICAgPSBsb2NhbGVEYXRhW2xvY2FsZS50b0xvd2VyQ2FzZSgpXTtcblxuICAgIC8vIFRoZSBsb2NhbGUgZGF0YSBpcyBkZS1kdXBsaWNhdGVkLCBzbyB3ZSBoYXZlIHRvIHRyYXZlcnNlIHRoZSBsb2NhbGUnc1xuICAgIC8vIGhpZXJhcmNoeSB1bnRpbCB3ZSBmaW5kIGBmaWVsZHNgIHRvIHJldHVybi5cbiAgICB3aGlsZSAoZGF0YSkge1xuICAgICAgICBpZiAoZGF0YS5maWVsZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLmZpZWxkcztcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGEgPSBkYXRhLnBhcmVudExvY2FsZSAmJiBsb2NhbGVEYXRhW2RhdGEucGFyZW50TG9jYWxlLnRvTG93ZXJDYXNlKCldO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0xvY2FsZSBkYXRhIGFkZGVkIHRvIEludGxSZWxhdGl2ZUZvcm1hdCBpcyBtaXNzaW5nIGBmaWVsZHNgIGZvciA6JyArXG4gICAgICAgIGxvY2FsZVxuICAgICk7XG59O1xuXG5SZWxhdGl2ZUZvcm1hdC5wcm90b3R5cGUuX2Zvcm1hdCA9IGZ1bmN0aW9uIChkYXRlLCBvcHRpb25zKSB7XG4gICAgdmFyIG5vdyA9IG9wdGlvbnMgJiYgb3B0aW9ucy5ub3cgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubm93IDogc3JjJGVzNSQkLmRhdGVOb3coKTtcblxuICAgIGlmIChkYXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZGF0ZSA9IG5vdztcbiAgICB9XG5cbiAgICAvLyBEZXRlcm1pbmUgaWYgdGhlIGBkYXRlYCBhbmQgb3B0aW9uYWwgYG5vd2AgdmFsdWVzIGFyZSB2YWxpZCwgYW5kIHRocm93IGFcbiAgICAvLyBzaW1pbGFyIGVycm9yIHRvIHdoYXQgYEludGwuRGF0ZVRpbWVGb3JtYXQjZm9ybWF0KClgIHdvdWxkIHRocm93LlxuICAgIGlmICghaXNGaW5pdGUobm93KSkge1xuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgICAgICdUaGUgYG5vd2Agb3B0aW9uIHByb3ZpZGVkIHRvIEludGxSZWxhdGl2ZUZvcm1hdCNmb3JtYXQoKSBpcyBub3QgJyArXG4gICAgICAgICAgICAnaW4gdmFsaWQgcmFuZ2UuJ1xuICAgICAgICApO1xuICAgIH1cblxuICAgIGlmICghaXNGaW5pdGUoZGF0ZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXG4gICAgICAgICAgICAnVGhlIGRhdGUgdmFsdWUgcHJvdmlkZWQgdG8gSW50bFJlbGF0aXZlRm9ybWF0I2Zvcm1hdCgpIGlzIG5vdCAnICtcbiAgICAgICAgICAgICdpbiB2YWxpZCByYW5nZS4nXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgdmFyIGRpZmZSZXBvcnQgID0gc3JjJGRpZmYkJFtcImRlZmF1bHRcIl0obm93LCBkYXRlKTtcbiAgICB2YXIgdW5pdHMgICAgICAgPSB0aGlzLl9vcHRpb25zLnVuaXRzIHx8IHRoaXMuX3NlbGVjdFVuaXRzKGRpZmZSZXBvcnQpO1xuICAgIHZhciBkaWZmSW5Vbml0cyA9IGRpZmZSZXBvcnRbdW5pdHNdO1xuXG4gICAgaWYgKHRoaXMuX29wdGlvbnMuc3R5bGUgIT09ICdudW1lcmljJykge1xuICAgICAgICB2YXIgcmVsYXRpdmVVbml0cyA9IHRoaXMuX2dldFJlbGF0aXZlVW5pdHMoZGlmZkluVW5pdHMsIHVuaXRzKTtcbiAgICAgICAgaWYgKHJlbGF0aXZlVW5pdHMpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGl2ZVVuaXRzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2dldE1lc3NhZ2UodW5pdHMpLmZvcm1hdCh7XG4gICAgICAgICcwJyA6IE1hdGguYWJzKGRpZmZJblVuaXRzKSxcbiAgICAgICAgd2hlbjogZGlmZkluVW5pdHMgPCAwID8gJ3Bhc3QnIDogJ2Z1dHVyZSdcbiAgICB9KTtcbn07XG5cblJlbGF0aXZlRm9ybWF0LnByb3RvdHlwZS5faXNWYWxpZFVuaXRzID0gZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgaWYgKCF1bml0cyB8fCBzcmMkZXM1JCQuYXJySW5kZXhPZi5jYWxsKEZJRUxEUywgdW5pdHMpID49IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB1bml0cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFyIHN1Z2dlc3Rpb24gPSAvcyQvLnRlc3QodW5pdHMpICYmIHVuaXRzLnN1YnN0cigwLCB1bml0cy5sZW5ndGggLSAxKTtcbiAgICAgICAgaWYgKHN1Z2dlc3Rpb24gJiYgc3JjJGVzNSQkLmFyckluZGV4T2YuY2FsbChGSUVMRFMsIHN1Z2dlc3Rpb24pID49IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAnXCInICsgdW5pdHMgKyAnXCIgaXMgbm90IGEgdmFsaWQgSW50bFJlbGF0aXZlRm9ybWF0IGB1bml0c2AgJyArXG4gICAgICAgICAgICAgICAgJ3ZhbHVlLCBkaWQgeW91IG1lYW46ICcgKyBzdWdnZXN0aW9uXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnXCInICsgdW5pdHMgKyAnXCIgaXMgbm90IGEgdmFsaWQgSW50bFJlbGF0aXZlRm9ybWF0IGB1bml0c2AgdmFsdWUsIGl0ICcgK1xuICAgICAgICAnbXVzdCBiZSBvbmUgb2Y6IFwiJyArIEZJRUxEUy5qb2luKCdcIiwgXCInKSArICdcIidcbiAgICApO1xufTtcblxuUmVsYXRpdmVGb3JtYXQucHJvdG90eXBlLl9yZXNvbHZlTG9jYWxlID0gZnVuY3Rpb24gKGxvY2FsZXMpIHtcbiAgICBpZiAodHlwZW9mIGxvY2FsZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGxvY2FsZXMgPSBbbG9jYWxlc107XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIGEgY29weSBvZiB0aGUgYXJyYXkgc28gd2UgY2FuIHB1c2ggb24gdGhlIGRlZmF1bHQgbG9jYWxlLlxuICAgIGxvY2FsZXMgPSAobG9jYWxlcyB8fCBbXSkuY29uY2F0KFJlbGF0aXZlRm9ybWF0LmRlZmF1bHRMb2NhbGUpO1xuXG4gICAgdmFyIGxvY2FsZURhdGEgPSBSZWxhdGl2ZUZvcm1hdC5fX2xvY2FsZURhdGFfXztcbiAgICB2YXIgaSwgbGVuLCBsb2NhbGVQYXJ0cywgZGF0YTtcblxuICAgIC8vIFVzaW5nIHRoZSBzZXQgb2YgbG9jYWxlcyArIHRoZSBkZWZhdWx0IGxvY2FsZSwgd2UgbG9vayBmb3IgdGhlIGZpcnN0IG9uZVxuICAgIC8vIHdoaWNoIHRoYXQgaGFzIGJlZW4gcmVnaXN0ZXJlZC4gV2hlbiBkYXRhIGRvZXMgbm90IGV4aXN0IGZvciBhIGxvY2FsZSwgd2VcbiAgICAvLyB0cmF2ZXJzZSBpdHMgYW5jZXN0b3JzIHRvIGZpbmQgc29tZXRoaW5nIHRoYXQncyBiZWVuIHJlZ2lzdGVyZWQgd2l0aGluXG4gICAgLy8gaXRzIGhpZXJhcmNoeSBvZiBsb2NhbGVzLiBTaW5jZSB3ZSBsYWNrIHRoZSBwcm9wZXIgYHBhcmVudExvY2FsZWAgZGF0YVxuICAgIC8vIGhlcmUsIHdlIG11c3QgdGFrZSBhIG5haXZlIGFwcHJvYWNoIHRvIHRyYXZlcnNhbC5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBsb2NhbGVzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgIGxvY2FsZVBhcnRzID0gbG9jYWxlc1tpXS50b0xvd2VyQ2FzZSgpLnNwbGl0KCctJyk7XG5cbiAgICAgICAgd2hpbGUgKGxvY2FsZVBhcnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgZGF0YSA9IGxvY2FsZURhdGFbbG9jYWxlUGFydHMuam9pbignLScpXTtcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gUmV0dXJuIHRoZSBub3JtYWxpemVkIGxvY2FsZSBzdHJpbmc7IGUuZy4sIHdlIHJldHVybiBcImVuLVVTXCIsXG4gICAgICAgICAgICAgICAgLy8gaW5zdGVhZCBvZiBcImVuLXVzXCIuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEubG9jYWxlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsb2NhbGVQYXJ0cy5wb3AoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlID0gbG9jYWxlcy5wb3AoKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdObyBsb2NhbGUgZGF0YSBoYXMgYmVlbiBhZGRlZCB0byBJbnRsUmVsYXRpdmVGb3JtYXQgZm9yOiAnICtcbiAgICAgICAgbG9jYWxlcy5qb2luKCcsICcpICsgJywgb3IgdGhlIGRlZmF1bHQgbG9jYWxlOiAnICsgZGVmYXVsdExvY2FsZVxuICAgICk7XG59O1xuXG5SZWxhdGl2ZUZvcm1hdC5wcm90b3R5cGUuX3Jlc29sdmVTdHlsZSA9IGZ1bmN0aW9uIChzdHlsZSkge1xuICAgIC8vIERlZmF1bHQgdG8gXCJiZXN0IGZpdFwiIHN0eWxlLlxuICAgIGlmICghc3R5bGUpIHtcbiAgICAgICAgcmV0dXJuIFNUWUxFU1swXTtcbiAgICB9XG5cbiAgICBpZiAoc3JjJGVzNSQkLmFyckluZGV4T2YuY2FsbChTVFlMRVMsIHN0eWxlKSA+PSAwKSB7XG4gICAgICAgIHJldHVybiBzdHlsZTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdcIicgKyBzdHlsZSArICdcIiBpcyBub3QgYSB2YWxpZCBJbnRsUmVsYXRpdmVGb3JtYXQgYHN0eWxlYCB2YWx1ZSwgaXQgJyArXG4gICAgICAgICdtdXN0IGJlIG9uZSBvZjogXCInICsgU1RZTEVTLmpvaW4oJ1wiLCBcIicpICsgJ1wiJ1xuICAgICk7XG59O1xuXG5SZWxhdGl2ZUZvcm1hdC5wcm90b3R5cGUuX3NlbGVjdFVuaXRzID0gZnVuY3Rpb24gKGRpZmZSZXBvcnQpIHtcbiAgICB2YXIgaSwgbCwgdW5pdHM7XG5cbiAgICBmb3IgKGkgPSAwLCBsID0gRklFTERTLmxlbmd0aDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICB1bml0cyA9IEZJRUxEU1tpXTtcblxuICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlJlcG9ydFt1bml0c10pIDwgUmVsYXRpdmVGb3JtYXQudGhyZXNob2xkc1t1bml0c10pIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuaXRzO1xufTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29yZS5qcy5tYXAiLCIvKlxuQ29weXJpZ2h0IChjKSAyMDE0LCBZYWhvbyEgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuQ29weXJpZ2h0cyBsaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBMaWNlbnNlLlxuU2VlIHRoZSBhY2NvbXBhbnlpbmcgTElDRU5TRSBmaWxlIGZvciB0ZXJtcy5cbiovXG5cbi8qIGpzbGludCBlc25leHQ6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciByb3VuZCA9IE1hdGgucm91bmQ7XG5cbmZ1bmN0aW9uIGRheXNUb1llYXJzKGRheXMpIHtcbiAgICAvLyA0MDAgeWVhcnMgaGF2ZSAxNDYwOTcgZGF5cyAodGFraW5nIGludG8gYWNjb3VudCBsZWFwIHllYXIgcnVsZXMpXG4gICAgcmV0dXJuIGRheXMgKiA0MDAgLyAxNDYwOTc7XG59XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gICAgLy8gQ29udmVydCB0byBtcyB0aW1lc3RhbXBzLlxuICAgIGZyb20gPSArZnJvbTtcbiAgICB0byAgID0gK3RvO1xuXG4gICAgdmFyIG1pbGxpc2Vjb25kID0gcm91bmQodG8gLSBmcm9tKSxcbiAgICAgICAgc2Vjb25kICAgICAgPSByb3VuZChtaWxsaXNlY29uZCAvIDEwMDApLFxuICAgICAgICBtaW51dGUgICAgICA9IHJvdW5kKHNlY29uZCAvIDYwKSxcbiAgICAgICAgaG91ciAgICAgICAgPSByb3VuZChtaW51dGUgLyA2MCksXG4gICAgICAgIGRheSAgICAgICAgID0gcm91bmQoaG91ciAvIDI0KSxcbiAgICAgICAgd2VlayAgICAgICAgPSByb3VuZChkYXkgLyA3KTtcblxuICAgIHZhciByYXdZZWFycyA9IGRheXNUb1llYXJzKGRheSksXG4gICAgICAgIG1vbnRoICAgID0gcm91bmQocmF3WWVhcnMgKiAxMiksXG4gICAgICAgIHllYXIgICAgID0gcm91bmQocmF3WWVhcnMpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbWlsbGlzZWNvbmQ6IG1pbGxpc2Vjb25kLFxuICAgICAgICBzZWNvbmQgICAgIDogc2Vjb25kLFxuICAgICAgICBtaW51dGUgICAgIDogbWludXRlLFxuICAgICAgICBob3VyICAgICAgIDogaG91cixcbiAgICAgICAgZGF5ICAgICAgICA6IGRheSxcbiAgICAgICAgd2VlayAgICAgICA6IHdlZWssXG4gICAgICAgIG1vbnRoICAgICAgOiBtb250aCxcbiAgICAgICAgeWVhciAgICAgICA6IHllYXJcbiAgICB9O1xufTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGlmZi5qcy5tYXAiLCIvLyBHRU5FUkFURUQgRklMRVxuXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHtcImxvY2FsZVwiOlwiZW5cIixcInBsdXJhbFJ1bGVGdW5jdGlvblwiOmZ1bmN0aW9uIChuLG9yZCl7dmFyIHM9U3RyaW5nKG4pLnNwbGl0KFwiLlwiKSx2MD0hc1sxXSx0MD1OdW1iZXIoc1swXSk9PW4sbjEwPXQwJiZzWzBdLnNsaWNlKC0xKSxuMTAwPXQwJiZzWzBdLnNsaWNlKC0yKTtpZihvcmQpcmV0dXJuIG4xMD09MSYmbjEwMCE9MTE/XCJvbmVcIjpuMTA9PTImJm4xMDAhPTEyP1widHdvXCI6bjEwPT0zJiZuMTAwIT0xMz9cImZld1wiOlwib3RoZXJcIjtyZXR1cm4gbj09MSYmdjA/XCJvbmVcIjpcIm90aGVyXCJ9LFwiZmllbGRzXCI6e1wieWVhclwiOntcImRpc3BsYXlOYW1lXCI6XCJ5ZWFyXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcInRoaXMgeWVhclwiLFwiMVwiOlwibmV4dCB5ZWFyXCIsXCItMVwiOlwibGFzdCB5ZWFyXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJpbiB7MH0geWVhclwiLFwib3RoZXJcIjpcImluIHswfSB5ZWFyc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcInswfSB5ZWFyIGFnb1wiLFwib3RoZXJcIjpcInswfSB5ZWFycyBhZ29cIn19fSxcIm1vbnRoXCI6e1wiZGlzcGxheU5hbWVcIjpcIm1vbnRoXCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcInRoaXMgbW9udGhcIixcIjFcIjpcIm5leHQgbW9udGhcIixcIi0xXCI6XCJsYXN0IG1vbnRoXCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJpbiB7MH0gbW9udGhcIixcIm90aGVyXCI6XCJpbiB7MH0gbW9udGhzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiezB9IG1vbnRoIGFnb1wiLFwib3RoZXJcIjpcInswfSBtb250aHMgYWdvXCJ9fX0sXCJkYXlcIjp7XCJkaXNwbGF5TmFtZVwiOlwiZGF5XCIsXCJyZWxhdGl2ZVwiOntcIjBcIjpcInRvZGF5XCIsXCIxXCI6XCJ0b21vcnJvd1wiLFwiLTFcIjpcInllc3RlcmRheVwifSxcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiaW4gezB9IGRheVwiLFwib3RoZXJcIjpcImluIHswfSBkYXlzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiezB9IGRheSBhZ29cIixcIm90aGVyXCI6XCJ7MH0gZGF5cyBhZ29cIn19fSxcImhvdXJcIjp7XCJkaXNwbGF5TmFtZVwiOlwiaG91clwiLFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJpbiB7MH0gaG91clwiLFwib3RoZXJcIjpcImluIHswfSBob3Vyc1wifSxcInBhc3RcIjp7XCJvbmVcIjpcInswfSBob3VyIGFnb1wiLFwib3RoZXJcIjpcInswfSBob3VycyBhZ29cIn19fSxcIm1pbnV0ZVwiOntcImRpc3BsYXlOYW1lXCI6XCJtaW51dGVcIixcInJlbGF0aXZlVGltZVwiOntcImZ1dHVyZVwiOntcIm9uZVwiOlwiaW4gezB9IG1pbnV0ZVwiLFwib3RoZXJcIjpcImluIHswfSBtaW51dGVzXCJ9LFwicGFzdFwiOntcIm9uZVwiOlwiezB9IG1pbnV0ZSBhZ29cIixcIm90aGVyXCI6XCJ7MH0gbWludXRlcyBhZ29cIn19fSxcInNlY29uZFwiOntcImRpc3BsYXlOYW1lXCI6XCJzZWNvbmRcIixcInJlbGF0aXZlXCI6e1wiMFwiOlwibm93XCJ9LFwicmVsYXRpdmVUaW1lXCI6e1wiZnV0dXJlXCI6e1wib25lXCI6XCJpbiB7MH0gc2Vjb25kXCIsXCJvdGhlclwiOlwiaW4gezB9IHNlY29uZHNcIn0sXCJwYXN0XCI6e1wib25lXCI6XCJ7MH0gc2Vjb25kIGFnb1wiLFwib3RoZXJcIjpcInswfSBzZWNvbmRzIGFnb1wifX19fX07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVuLmpzLm1hcCIsIi8qXG5Db3B5cmlnaHQgKGMpIDIwMTQsIFlhaG9vISBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5Db3B5cmlnaHRzIGxpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIExpY2Vuc2UuXG5TZWUgdGhlIGFjY29tcGFueWluZyBMSUNFTlNFIGZpbGUgZm9yIHRlcm1zLlxuKi9cblxuLyoganNsaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gUHVycG9zZWx5IHVzaW5nIHRoZSBzYW1lIGltcGxlbWVudGF0aW9uIGFzIHRoZSBJbnRsLmpzIGBJbnRsYCBwb2x5ZmlsbC5cbi8vIENvcHlyaWdodCAyMDEzIEFuZHkgRWFybnNoYXcsIE1JVCBMaWNlbnNlXG5cbnZhciBob3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxudmFyIHJlYWxEZWZpbmVQcm9wID0gKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkgeyByZXR1cm4gISFPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge30pOyB9XG4gICAgY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9XG59KSgpO1xuXG52YXIgZXMzID0gIXJlYWxEZWZpbmVQcm9wICYmICFPYmplY3QucHJvdG90eXBlLl9fZGVmaW5lR2V0dGVyX187XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IHJlYWxEZWZpbmVQcm9wID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDpcbiAgICAgICAgZnVuY3Rpb24gKG9iaiwgbmFtZSwgZGVzYykge1xuXG4gICAgaWYgKCdnZXQnIGluIGRlc2MgJiYgb2JqLl9fZGVmaW5lR2V0dGVyX18pIHtcbiAgICAgICAgb2JqLl9fZGVmaW5lR2V0dGVyX18obmFtZSwgZGVzYy5nZXQpO1xuICAgIH0gZWxzZSBpZiAoIWhvcC5jYWxsKG9iaiwgbmFtZSkgfHwgJ3ZhbHVlJyBpbiBkZXNjKSB7XG4gICAgICAgIG9ialtuYW1lXSA9IGRlc2MudmFsdWU7XG4gICAgfVxufTtcblxudmFyIG9iakNyZWF0ZSA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gKHByb3RvLCBwcm9wcykge1xuICAgIHZhciBvYmosIGs7XG5cbiAgICBmdW5jdGlvbiBGKCkge31cbiAgICBGLnByb3RvdHlwZSA9IHByb3RvO1xuICAgIG9iaiA9IG5ldyBGKCk7XG5cbiAgICBmb3IgKGsgaW4gcHJvcHMpIHtcbiAgICAgICAgaWYgKGhvcC5jYWxsKHByb3BzLCBrKSkge1xuICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkob2JqLCBrLCBwcm9wc1trXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxudmFyIGFyckluZGV4T2YgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiB8fCBmdW5jdGlvbiAoc2VhcmNoLCBmcm9tSW5kZXgpIHtcbiAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgIHZhciBhcnIgPSB0aGlzO1xuICAgIGlmICghYXJyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IGZyb21JbmRleCB8fCAwLCBtYXggPSBhcnIubGVuZ3RoOyBpIDwgbWF4OyBpKyspIHtcbiAgICAgICAgaWYgKGFycltpXSA9PT0gc2VhcmNoKSB7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbnZhciBkYXRlTm93ID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbn07XG5leHBvcnRzLmRlZmluZVByb3BlcnR5ID0gZGVmaW5lUHJvcGVydHksIGV4cG9ydHMub2JqQ3JlYXRlID0gb2JqQ3JlYXRlLCBleHBvcnRzLmFyckluZGV4T2YgPSBhcnJJbmRleE9mLCBleHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5LCBleHBvcnRzLmRhdGVOb3cgPSBkYXRlTm93O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1lczUuanMubWFwIiwiLyoganNsaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcbnZhciBzcmMkY29yZSQkID0gcmVxdWlyZShcIi4vY29yZVwiKSwgc3JjJGVuJCQgPSByZXF1aXJlKFwiLi9lblwiKTtcblxuc3JjJGNvcmUkJFtcImRlZmF1bHRcIl0uX19hZGRMb2NhbGVEYXRhKHNyYyRlbiQkW1wiZGVmYXVsdFwiXSk7XG5zcmMkY29yZSQkW1wiZGVmYXVsdFwiXS5kZWZhdWx0TG9jYWxlID0gJ2VuJztcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBzcmMkY29yZSQkW1wiZGVmYXVsdFwiXTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFpbi5qcy5tYXAiLCIvKiBqc2hpbnQgbm9kZTp0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIEludGxNZXNzYWdlRm9ybWF0ID0gcmVxdWlyZSgnLi9saWIvbWFpbicpWydkZWZhdWx0J107XG5cbi8vIEFkZCBhbGwgbG9jYWxlIGRhdGEgdG8gYEludGxNZXNzYWdlRm9ybWF0YC4gVGhpcyBtb2R1bGUgd2lsbCBiZSBpZ25vcmVkIHdoZW5cbi8vIGJ1bmRsaW5nIGZvciB0aGUgYnJvd3NlciB3aXRoIEJyb3dzZXJpZnkvV2VicGFjay5cbnJlcXVpcmUoJy4vbGliL2xvY2FsZXMnKTtcblxuLy8gUmUtZXhwb3J0IGBJbnRsTWVzc2FnZUZvcm1hdGAgYXMgdGhlIENvbW1vbkpTIGRlZmF1bHQgZXhwb3J0cyB3aXRoIGFsbCB0aGVcbi8vIGxvY2FsZSBkYXRhIHJlZ2lzdGVyZWQsIGFuZCB3aXRoIEVuZ2xpc2ggc2V0IGFzIHRoZSBkZWZhdWx0IGxvY2FsZS4gRGVmaW5lXG4vLyB0aGUgYGRlZmF1bHRgIHByb3AgZm9yIHVzZSB3aXRoIG90aGVyIGNvbXBpbGVkIEVTNiBNb2R1bGVzLlxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gSW50bE1lc3NhZ2VGb3JtYXQ7XG5leHBvcnRzWydkZWZhdWx0J10gPSBleHBvcnRzO1xuIiwiLypcbkNvcHlyaWdodCAoYykgMjAxNCwgWWFob28hIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbkNvcHlyaWdodHMgbGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgTGljZW5zZS5cblNlZSB0aGUgYWNjb21wYW55aW5nIExJQ0VOU0UgZmlsZSBmb3IgdGVybXMuXG4qL1xuXG4vKiBqc2xpbnQgZXNuZXh0OiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBDb21waWxlcjtcblxuZnVuY3Rpb24gQ29tcGlsZXIobG9jYWxlcywgZm9ybWF0cywgcGx1cmFsRm4pIHtcbiAgICB0aGlzLmxvY2FsZXMgID0gbG9jYWxlcztcbiAgICB0aGlzLmZvcm1hdHMgID0gZm9ybWF0cztcbiAgICB0aGlzLnBsdXJhbEZuID0gcGx1cmFsRm47XG59XG5cbkNvbXBpbGVyLnByb3RvdHlwZS5jb21waWxlID0gZnVuY3Rpb24gKGFzdCkge1xuICAgIHRoaXMucGx1cmFsU3RhY2sgICAgICAgID0gW107XG4gICAgdGhpcy5jdXJyZW50UGx1cmFsICAgICAgPSBudWxsO1xuICAgIHRoaXMucGx1cmFsTnVtYmVyRm9ybWF0ID0gbnVsbDtcblxuICAgIHJldHVybiB0aGlzLmNvbXBpbGVNZXNzYWdlKGFzdCk7XG59O1xuXG5Db21waWxlci5wcm90b3R5cGUuY29tcGlsZU1lc3NhZ2UgPSBmdW5jdGlvbiAoYXN0KSB7XG4gICAgaWYgKCEoYXN0ICYmIGFzdC50eXBlID09PSAnbWVzc2FnZUZvcm1hdFBhdHRlcm4nKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01lc3NhZ2UgQVNUIGlzIG5vdCBvZiB0eXBlOiBcIm1lc3NhZ2VGb3JtYXRQYXR0ZXJuXCInKTtcbiAgICB9XG5cbiAgICB2YXIgZWxlbWVudHMgPSBhc3QuZWxlbWVudHMsXG4gICAgICAgIHBhdHRlcm4gID0gW107XG5cbiAgICB2YXIgaSwgbGVuLCBlbGVtZW50O1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnRzW2ldO1xuXG4gICAgICAgIHN3aXRjaCAoZWxlbWVudC50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdtZXNzYWdlVGV4dEVsZW1lbnQnOlxuICAgICAgICAgICAgICAgIHBhdHRlcm4ucHVzaCh0aGlzLmNvbXBpbGVNZXNzYWdlVGV4dChlbGVtZW50KSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2FyZ3VtZW50RWxlbWVudCc6XG4gICAgICAgICAgICAgICAgcGF0dGVybi5wdXNoKHRoaXMuY29tcGlsZUFyZ3VtZW50KGVsZW1lbnQpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01lc3NhZ2UgZWxlbWVudCBkb2VzIG5vdCBoYXZlIGEgdmFsaWQgdHlwZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhdHRlcm47XG59O1xuXG5Db21waWxlci5wcm90b3R5cGUuY29tcGlsZU1lc3NhZ2VUZXh0ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAvLyBXaGVuIHRoaXMgYGVsZW1lbnRgIGlzIHBhcnQgb2YgcGx1cmFsIHN1Yi1wYXR0ZXJuIGFuZCBpdHMgdmFsdWUgY29udGFpbnNcbiAgICAvLyBhbiB1bmVzY2FwZWQgJyMnLCB1c2UgYSBgUGx1cmFsT2Zmc2V0U3RyaW5nYCBoZWxwZXIgdG8gcHJvcGVybHkgb3V0cHV0XG4gICAgLy8gdGhlIG51bWJlciB3aXRoIHRoZSBjb3JyZWN0IG9mZnNldCBpbiB0aGUgc3RyaW5nLlxuICAgIGlmICh0aGlzLmN1cnJlbnRQbHVyYWwgJiYgLyhefFteXFxcXF0pIy9nLnRlc3QoZWxlbWVudC52YWx1ZSkpIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgY2FjaGUgYSBOdW1iZXJGb3JtYXQgaW5zdGFuY2UgdGhhdCBjYW4gYmUgcmV1c2VkIGZvciBhbnlcbiAgICAgICAgLy8gUGx1cmFsT2Zmc2V0U3RyaW5nIGluc3RhbmNlIGluIHRoaXMgbWVzc2FnZS5cbiAgICAgICAgaWYgKCF0aGlzLnBsdXJhbE51bWJlckZvcm1hdCkge1xuICAgICAgICAgICAgdGhpcy5wbHVyYWxOdW1iZXJGb3JtYXQgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQodGhpcy5sb2NhbGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUGx1cmFsT2Zmc2V0U3RyaW5nKFxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBsdXJhbC5pZCxcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQbHVyYWwuZm9ybWF0Lm9mZnNldCxcbiAgICAgICAgICAgICAgICB0aGlzLnBsdXJhbE51bWJlckZvcm1hdCxcbiAgICAgICAgICAgICAgICBlbGVtZW50LnZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBVbmVzY2FwZSB0aGUgZXNjYXBlZCAnIydzIGluIHRoZSBtZXNzYWdlIHRleHQuXG4gICAgcmV0dXJuIGVsZW1lbnQudmFsdWUucmVwbGFjZSgvXFxcXCMvZywgJyMnKTtcbn07XG5cbkNvbXBpbGVyLnByb3RvdHlwZS5jb21waWxlQXJndW1lbnQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHZhciBmb3JtYXQgPSBlbGVtZW50LmZvcm1hdDtcblxuICAgIGlmICghZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nRm9ybWF0KGVsZW1lbnQuaWQpO1xuICAgIH1cblxuICAgIHZhciBmb3JtYXRzICA9IHRoaXMuZm9ybWF0cyxcbiAgICAgICAgbG9jYWxlcyAgPSB0aGlzLmxvY2FsZXMsXG4gICAgICAgIHBsdXJhbEZuID0gdGhpcy5wbHVyYWxGbixcbiAgICAgICAgb3B0aW9ucztcblxuICAgIHN3aXRjaCAoZm9ybWF0LnR5cGUpIHtcbiAgICAgICAgY2FzZSAnbnVtYmVyRm9ybWF0JzpcbiAgICAgICAgICAgIG9wdGlvbnMgPSBmb3JtYXRzLm51bWJlcltmb3JtYXQuc3R5bGVdO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpZCAgICA6IGVsZW1lbnQuaWQsXG4gICAgICAgICAgICAgICAgZm9ybWF0OiBuZXcgSW50bC5OdW1iZXJGb3JtYXQobG9jYWxlcywgb3B0aW9ucykuZm9ybWF0XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGNhc2UgJ2RhdGVGb3JtYXQnOlxuICAgICAgICAgICAgb3B0aW9ucyA9IGZvcm1hdHMuZGF0ZVtmb3JtYXQuc3R5bGVdO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpZCAgICA6IGVsZW1lbnQuaWQsXG4gICAgICAgICAgICAgICAgZm9ybWF0OiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGVzLCBvcHRpb25zKS5mb3JtYXRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgY2FzZSAndGltZUZvcm1hdCc6XG4gICAgICAgICAgICBvcHRpb25zID0gZm9ybWF0cy50aW1lW2Zvcm1hdC5zdHlsZV07XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGlkICAgIDogZWxlbWVudC5pZCxcbiAgICAgICAgICAgICAgICBmb3JtYXQ6IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGxvY2FsZXMsIG9wdGlvbnMpLmZvcm1hdFxuICAgICAgICAgICAgfTtcblxuICAgICAgICBjYXNlICdwbHVyYWxGb3JtYXQnOlxuICAgICAgICAgICAgb3B0aW9ucyA9IHRoaXMuY29tcGlsZU9wdGlvbnMoZWxlbWVudCk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBsdXJhbEZvcm1hdChcbiAgICAgICAgICAgICAgICBlbGVtZW50LmlkLCBmb3JtYXQub3JkaW5hbCwgZm9ybWF0Lm9mZnNldCwgb3B0aW9ucywgcGx1cmFsRm5cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgY2FzZSAnc2VsZWN0Rm9ybWF0JzpcbiAgICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLmNvbXBpbGVPcHRpb25zKGVsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTZWxlY3RGb3JtYXQoZWxlbWVudC5pZCwgb3B0aW9ucyk7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWVzc2FnZSBlbGVtZW50IGRvZXMgbm90IGhhdmUgYSB2YWxpZCBmb3JtYXQgdHlwZScpO1xuICAgIH1cbn07XG5cbkNvbXBpbGVyLnByb3RvdHlwZS5jb21waWxlT3B0aW9ucyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgdmFyIGZvcm1hdCAgICAgID0gZWxlbWVudC5mb3JtYXQsXG4gICAgICAgIG9wdGlvbnMgICAgID0gZm9ybWF0Lm9wdGlvbnMsXG4gICAgICAgIG9wdGlvbnNIYXNoID0ge307XG5cbiAgICAvLyBTYXZlIHRoZSBjdXJyZW50IHBsdXJhbCBlbGVtZW50LCBpZiBhbnksIHRoZW4gc2V0IGl0IHRvIGEgbmV3IHZhbHVlIHdoZW5cbiAgICAvLyBjb21waWxpbmcgdGhlIG9wdGlvbnMgc3ViLXBhdHRlcm5zLiBUaGlzIGNvbmZvcm1zIHRoZSBzcGVjJ3MgYWxnb3JpdGhtXG4gICAgLy8gZm9yIGhhbmRsaW5nIGBcIiNcImAgc3ludGF4IGluIG1lc3NhZ2UgdGV4dC5cbiAgICB0aGlzLnBsdXJhbFN0YWNrLnB1c2godGhpcy5jdXJyZW50UGx1cmFsKTtcbiAgICB0aGlzLmN1cnJlbnRQbHVyYWwgPSBmb3JtYXQudHlwZSA9PT0gJ3BsdXJhbEZvcm1hdCcgPyBlbGVtZW50IDogbnVsbDtcblxuICAgIHZhciBpLCBsZW4sIG9wdGlvbjtcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IG9wdGlvbnMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgb3B0aW9uID0gb3B0aW9uc1tpXTtcblxuICAgICAgICAvLyBDb21waWxlIHRoZSBzdWItcGF0dGVybiBhbmQgc2F2ZSBpdCB1bmRlciB0aGUgb3B0aW9ucydzIHNlbGVjdG9yLlxuICAgICAgICBvcHRpb25zSGFzaFtvcHRpb24uc2VsZWN0b3JdID0gdGhpcy5jb21waWxlTWVzc2FnZShvcHRpb24udmFsdWUpO1xuICAgIH1cblxuICAgIC8vIFBvcCB0aGUgcGx1cmFsIHN0YWNrIHRvIHB1dCBiYWNrIHRoZSBvcmlnaW5hbCBjdXJyZW50IHBsdXJhbCB2YWx1ZS5cbiAgICB0aGlzLmN1cnJlbnRQbHVyYWwgPSB0aGlzLnBsdXJhbFN0YWNrLnBvcCgpO1xuXG4gICAgcmV0dXJuIG9wdGlvbnNIYXNoO1xufTtcblxuLy8gLS0gQ29tcGlsZXIgSGVscGVyIENsYXNzZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gU3RyaW5nRm9ybWF0KGlkKSB7XG4gICAgdGhpcy5pZCA9IGlkO1xufVxuXG5TdHJpbmdGb3JtYXQucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUgOiBTdHJpbmcodmFsdWUpO1xufTtcblxuZnVuY3Rpb24gUGx1cmFsRm9ybWF0KGlkLCB1c2VPcmRpbmFsLCBvZmZzZXQsIG9wdGlvbnMsIHBsdXJhbEZuKSB7XG4gICAgdGhpcy5pZCAgICAgICAgID0gaWQ7XG4gICAgdGhpcy51c2VPcmRpbmFsID0gdXNlT3JkaW5hbDtcbiAgICB0aGlzLm9mZnNldCAgICAgPSBvZmZzZXQ7XG4gICAgdGhpcy5vcHRpb25zICAgID0gb3B0aW9ucztcbiAgICB0aGlzLnBsdXJhbEZuICAgPSBwbHVyYWxGbjtcbn1cblxuUGx1cmFsRm9ybWF0LnByb3RvdHlwZS5nZXRPcHRpb24gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgIHZhciBvcHRpb24gPSBvcHRpb25zWyc9JyArIHZhbHVlXSB8fFxuICAgICAgICAgICAgb3B0aW9uc1t0aGlzLnBsdXJhbEZuKHZhbHVlIC0gdGhpcy5vZmZzZXQsIHRoaXMudXNlT3JkaW5hbCldO1xuXG4gICAgcmV0dXJuIG9wdGlvbiB8fCBvcHRpb25zLm90aGVyO1xufTtcblxuZnVuY3Rpb24gUGx1cmFsT2Zmc2V0U3RyaW5nKGlkLCBvZmZzZXQsIG51bWJlckZvcm1hdCwgc3RyaW5nKSB7XG4gICAgdGhpcy5pZCAgICAgICAgICAgPSBpZDtcbiAgICB0aGlzLm9mZnNldCAgICAgICA9IG9mZnNldDtcbiAgICB0aGlzLm51bWJlckZvcm1hdCA9IG51bWJlckZvcm1hdDtcbiAgICB0aGlzLnN0cmluZyAgICAgICA9IHN0cmluZztcbn1cblxuUGx1cmFsT2Zmc2V0U3RyaW5nLnByb3RvdHlwZS5mb3JtYXQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YXIgbnVtYmVyID0gdGhpcy5udW1iZXJGb3JtYXQuZm9ybWF0KHZhbHVlIC0gdGhpcy5vZmZzZXQpO1xuXG4gICAgcmV0dXJuIHRoaXMuc3RyaW5nXG4gICAgICAgICAgICAucmVwbGFjZSgvKF58W15cXFxcXSkjL2csICckMScgKyBudW1iZXIpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxcXCMvZywgJyMnKTtcbn07XG5cbmZ1bmN0aW9uIFNlbGVjdEZvcm1hdChpZCwgb3B0aW9ucykge1xuICAgIHRoaXMuaWQgICAgICA9IGlkO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG59XG5cblNlbGVjdEZvcm1hdC5wcm90b3R5cGUuZ2V0T3B0aW9uID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgcmV0dXJuIG9wdGlvbnNbdmFsdWVdIHx8IG9wdGlvbnMub3RoZXI7XG59O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21waWxlci5qcy5tYXAiLCIvKlxuQ29weXJpZ2h0IChjKSAyMDE0LCBZYWhvbyEgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuQ29weXJpZ2h0cyBsaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBMaWNlbnNlLlxuU2VlIHRoZSBhY2NvbXBhbnlpbmcgTElDRU5TRSBmaWxlIGZvciB0ZXJtcy5cbiovXG5cbi8qIGpzbGludCBlc25leHQ6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgc3JjJHV0aWxzJCQgPSByZXF1aXJlKFwiLi91dGlsc1wiKSwgc3JjJGVzNSQkID0gcmVxdWlyZShcIi4vZXM1XCIpLCBzcmMkY29tcGlsZXIkJCA9IHJlcXVpcmUoXCIuL2NvbXBpbGVyXCIpLCBpbnRsJG1lc3NhZ2Vmb3JtYXQkcGFyc2VyJCQgPSByZXF1aXJlKFwiaW50bC1tZXNzYWdlZm9ybWF0LXBhcnNlclwiKTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gTWVzc2FnZUZvcm1hdDtcblxuLy8gLS0gTWVzc2FnZUZvcm1hdCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBNZXNzYWdlRm9ybWF0KG1lc3NhZ2UsIGxvY2FsZXMsIGZvcm1hdHMpIHtcbiAgICAvLyBQYXJzZSBzdHJpbmcgbWVzc2FnZXMgaW50byBhbiBBU1QuXG4gICAgdmFyIGFzdCA9IHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJyA/XG4gICAgICAgICAgICBNZXNzYWdlRm9ybWF0Ll9fcGFyc2UobWVzc2FnZSkgOiBtZXNzYWdlO1xuXG4gICAgaWYgKCEoYXN0ICYmIGFzdC50eXBlID09PSAnbWVzc2FnZUZvcm1hdFBhdHRlcm4nKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBIG1lc3NhZ2UgbXVzdCBiZSBwcm92aWRlZCBhcyBhIFN0cmluZyBvciBBU1QuJyk7XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlcyBhIG5ldyBvYmplY3Qgd2l0aCB0aGUgc3BlY2lmaWVkIGBmb3JtYXRzYCBtZXJnZWQgd2l0aCB0aGUgZGVmYXVsdFxuICAgIC8vIGZvcm1hdHMuXG4gICAgZm9ybWF0cyA9IHRoaXMuX21lcmdlRm9ybWF0cyhNZXNzYWdlRm9ybWF0LmZvcm1hdHMsIGZvcm1hdHMpO1xuXG4gICAgLy8gRGVmaW5lZCBmaXJzdCBiZWNhdXNlIGl0J3MgdXNlZCB0byBidWlsZCB0aGUgZm9ybWF0IHBhdHRlcm4uXG4gICAgc3JjJGVzNSQkLmRlZmluZVByb3BlcnR5KHRoaXMsICdfbG9jYWxlJywgIHt2YWx1ZTogdGhpcy5fcmVzb2x2ZUxvY2FsZShsb2NhbGVzKX0pO1xuXG4gICAgLy8gQ29tcGlsZSB0aGUgYGFzdGAgdG8gYSBwYXR0ZXJuIHRoYXQgaXMgaGlnaGx5IG9wdGltaXplZCBmb3IgcmVwZWF0ZWRcbiAgICAvLyBgZm9ybWF0KClgIGludm9jYXRpb25zLiAqKk5vdGU6KiogVGhpcyBwYXNzZXMgdGhlIGBsb2NhbGVzYCBzZXQgcHJvdmlkZWRcbiAgICAvLyB0byB0aGUgY29uc3RydWN0b3IgaW5zdGVhZCBvZiBqdXN0IHRoZSByZXNvbHZlZCBsb2NhbGUuXG4gICAgdmFyIHBsdXJhbEZuID0gdGhpcy5fZmluZFBsdXJhbFJ1bGVGdW5jdGlvbih0aGlzLl9sb2NhbGUpO1xuICAgIHZhciBwYXR0ZXJuICA9IHRoaXMuX2NvbXBpbGVQYXR0ZXJuKGFzdCwgbG9jYWxlcywgZm9ybWF0cywgcGx1cmFsRm4pO1xuXG4gICAgLy8gXCJCaW5kXCIgYGZvcm1hdCgpYCBtZXRob2QgdG8gYHRoaXNgIHNvIGl0IGNhbiBiZSBwYXNzZWQgYnkgcmVmZXJlbmNlIGxpa2VcbiAgICAvLyB0aGUgb3RoZXIgYEludGxgIEFQSXMuXG4gICAgdmFyIG1lc3NhZ2VGb3JtYXQgPSB0aGlzO1xuICAgIHRoaXMuZm9ybWF0ID0gZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICByZXR1cm4gbWVzc2FnZUZvcm1hdC5fZm9ybWF0KHBhdHRlcm4sIHZhbHVlcyk7XG4gICAgfTtcbn1cblxuLy8gRGVmYXVsdCBmb3JtYXQgb3B0aW9ucyB1c2VkIGFzIHRoZSBwcm90b3R5cGUgb2YgdGhlIGBmb3JtYXRzYCBwcm92aWRlZCB0byB0aGVcbi8vIGNvbnN0cnVjdG9yLiBUaGVzZSBhcmUgdXNlZCB3aGVuIGNvbnN0cnVjdGluZyB0aGUgaW50ZXJuYWwgSW50bC5OdW1iZXJGb3JtYXRcbi8vIGFuZCBJbnRsLkRhdGVUaW1lRm9ybWF0IGluc3RhbmNlcy5cbnNyYyRlczUkJC5kZWZpbmVQcm9wZXJ0eShNZXNzYWdlRm9ybWF0LCAnZm9ybWF0cycsIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuXG4gICAgdmFsdWU6IHtcbiAgICAgICAgbnVtYmVyOiB7XG4gICAgICAgICAgICAnY3VycmVuY3knOiB7XG4gICAgICAgICAgICAgICAgc3R5bGU6ICdjdXJyZW5jeSdcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICdwZXJjZW50Jzoge1xuICAgICAgICAgICAgICAgIHN0eWxlOiAncGVyY2VudCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBkYXRlOiB7XG4gICAgICAgICAgICAnc2hvcnQnOiB7XG4gICAgICAgICAgICAgICAgbW9udGg6ICdudW1lcmljJyxcbiAgICAgICAgICAgICAgICBkYXkgIDogJ251bWVyaWMnLFxuICAgICAgICAgICAgICAgIHllYXIgOiAnMi1kaWdpdCdcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICdtZWRpdW0nOiB7XG4gICAgICAgICAgICAgICAgbW9udGg6ICdzaG9ydCcsXG4gICAgICAgICAgICAgICAgZGF5ICA6ICdudW1lcmljJyxcbiAgICAgICAgICAgICAgICB5ZWFyIDogJ251bWVyaWMnXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAnbG9uZyc6IHtcbiAgICAgICAgICAgICAgICBtb250aDogJ2xvbmcnLFxuICAgICAgICAgICAgICAgIGRheSAgOiAnbnVtZXJpYycsXG4gICAgICAgICAgICAgICAgeWVhciA6ICdudW1lcmljJ1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgJ2Z1bGwnOiB7XG4gICAgICAgICAgICAgICAgd2Vla2RheTogJ2xvbmcnLFxuICAgICAgICAgICAgICAgIG1vbnRoICA6ICdsb25nJyxcbiAgICAgICAgICAgICAgICBkYXkgICAgOiAnbnVtZXJpYycsXG4gICAgICAgICAgICAgICAgeWVhciAgIDogJ251bWVyaWMnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdGltZToge1xuICAgICAgICAgICAgJ3Nob3J0Jzoge1xuICAgICAgICAgICAgICAgIGhvdXIgIDogJ251bWVyaWMnLFxuICAgICAgICAgICAgICAgIG1pbnV0ZTogJ251bWVyaWMnXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAnbWVkaXVtJzogIHtcbiAgICAgICAgICAgICAgICBob3VyICA6ICdudW1lcmljJyxcbiAgICAgICAgICAgICAgICBtaW51dGU6ICdudW1lcmljJyxcbiAgICAgICAgICAgICAgICBzZWNvbmQ6ICdudW1lcmljJ1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgJ2xvbmcnOiB7XG4gICAgICAgICAgICAgICAgaG91ciAgICAgICAgOiAnbnVtZXJpYycsXG4gICAgICAgICAgICAgICAgbWludXRlICAgICAgOiAnbnVtZXJpYycsXG4gICAgICAgICAgICAgICAgc2Vjb25kICAgICAgOiAnbnVtZXJpYycsXG4gICAgICAgICAgICAgICAgdGltZVpvbmVOYW1lOiAnc2hvcnQnXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAnZnVsbCc6IHtcbiAgICAgICAgICAgICAgICBob3VyICAgICAgICA6ICdudW1lcmljJyxcbiAgICAgICAgICAgICAgICBtaW51dGUgICAgICA6ICdudW1lcmljJyxcbiAgICAgICAgICAgICAgICBzZWNvbmQgICAgICA6ICdudW1lcmljJyxcbiAgICAgICAgICAgICAgICB0aW1lWm9uZU5hbWU6ICdzaG9ydCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG4vLyBEZWZpbmUgaW50ZXJuYWwgcHJpdmF0ZSBwcm9wZXJ0aWVzIGZvciBkZWFsaW5nIHdpdGggbG9jYWxlIGRhdGEuXG5zcmMkZXM1JCQuZGVmaW5lUHJvcGVydHkoTWVzc2FnZUZvcm1hdCwgJ19fbG9jYWxlRGF0YV9fJywge3ZhbHVlOiBzcmMkZXM1JCQub2JqQ3JlYXRlKG51bGwpfSk7XG5zcmMkZXM1JCQuZGVmaW5lUHJvcGVydHkoTWVzc2FnZUZvcm1hdCwgJ19fYWRkTG9jYWxlRGF0YScsIHt2YWx1ZTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBpZiAoIShkYXRhICYmIGRhdGEubG9jYWxlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAnTG9jYWxlIGRhdGEgcHJvdmlkZWQgdG8gSW50bE1lc3NhZ2VGb3JtYXQgaXMgbWlzc2luZyBhICcgK1xuICAgICAgICAgICAgJ2Bsb2NhbGVgIHByb3BlcnR5J1xuICAgICAgICApO1xuICAgIH1cblxuICAgIE1lc3NhZ2VGb3JtYXQuX19sb2NhbGVEYXRhX19bZGF0YS5sb2NhbGUudG9Mb3dlckNhc2UoKV0gPSBkYXRhO1xufX0pO1xuXG4vLyBEZWZpbmVzIGBfX3BhcnNlKClgIHN0YXRpYyBtZXRob2QgYXMgYW4gZXhwb3NlZCBwcml2YXRlLlxuc3JjJGVzNSQkLmRlZmluZVByb3BlcnR5KE1lc3NhZ2VGb3JtYXQsICdfX3BhcnNlJywge3ZhbHVlOiBpbnRsJG1lc3NhZ2Vmb3JtYXQkcGFyc2VyJCRbXCJkZWZhdWx0XCJdLnBhcnNlfSk7XG5cbi8vIERlZmluZSBwdWJsaWMgYGRlZmF1bHRMb2NhbGVgIHByb3BlcnR5IHdoaWNoIGRlZmF1bHRzIHRvIEVuZ2xpc2gsIGJ1dCBjYW4gYmVcbi8vIHNldCBieSB0aGUgZGV2ZWxvcGVyLlxuc3JjJGVzNSQkLmRlZmluZVByb3BlcnR5KE1lc3NhZ2VGb3JtYXQsICdkZWZhdWx0TG9jYWxlJywge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgd3JpdGFibGUgIDogdHJ1ZSxcbiAgICB2YWx1ZSAgICAgOiB1bmRlZmluZWRcbn0pO1xuXG5NZXNzYWdlRm9ybWF0LnByb3RvdHlwZS5yZXNvbHZlZE9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gVE9ETzogUHJvdmlkZSBhbnl0aGluZyBlbHNlP1xuICAgIHJldHVybiB7XG4gICAgICAgIGxvY2FsZTogdGhpcy5fbG9jYWxlXG4gICAgfTtcbn07XG5cbk1lc3NhZ2VGb3JtYXQucHJvdG90eXBlLl9jb21waWxlUGF0dGVybiA9IGZ1bmN0aW9uIChhc3QsIGxvY2FsZXMsIGZvcm1hdHMsIHBsdXJhbEZuKSB7XG4gICAgdmFyIGNvbXBpbGVyID0gbmV3IHNyYyRjb21waWxlciQkW1wiZGVmYXVsdFwiXShsb2NhbGVzLCBmb3JtYXRzLCBwbHVyYWxGbik7XG4gICAgcmV0dXJuIGNvbXBpbGVyLmNvbXBpbGUoYXN0KTtcbn07XG5cbk1lc3NhZ2VGb3JtYXQucHJvdG90eXBlLl9maW5kUGx1cmFsUnVsZUZ1bmN0aW9uID0gZnVuY3Rpb24gKGxvY2FsZSkge1xuICAgIHZhciBsb2NhbGVEYXRhID0gTWVzc2FnZUZvcm1hdC5fX2xvY2FsZURhdGFfXztcbiAgICB2YXIgZGF0YSAgICAgICA9IGxvY2FsZURhdGFbbG9jYWxlLnRvTG93ZXJDYXNlKCldO1xuXG4gICAgLy8gVGhlIGxvY2FsZSBkYXRhIGlzIGRlLWR1cGxpY2F0ZWQsIHNvIHdlIGhhdmUgdG8gdHJhdmVyc2UgdGhlIGxvY2FsZSdzXG4gICAgLy8gaGllcmFyY2h5IHVudGlsIHdlIGZpbmQgYSBgcGx1cmFsUnVsZUZ1bmN0aW9uYCB0byByZXR1cm4uXG4gICAgd2hpbGUgKGRhdGEpIHtcbiAgICAgICAgaWYgKGRhdGEucGx1cmFsUnVsZUZ1bmN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS5wbHVyYWxSdWxlRnVuY3Rpb247XG4gICAgICAgIH1cblxuICAgICAgICBkYXRhID0gZGF0YS5wYXJlbnRMb2NhbGUgJiYgbG9jYWxlRGF0YVtkYXRhLnBhcmVudExvY2FsZS50b0xvd2VyQ2FzZSgpXTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdMb2NhbGUgZGF0YSBhZGRlZCB0byBJbnRsTWVzc2FnZUZvcm1hdCBpcyBtaXNzaW5nIGEgJyArXG4gICAgICAgICdgcGx1cmFsUnVsZUZ1bmN0aW9uYCBmb3IgOicgKyBsb2NhbGVcbiAgICApO1xufTtcblxuTWVzc2FnZUZvcm1hdC5wcm90b3R5cGUuX2Zvcm1hdCA9IGZ1bmN0aW9uIChwYXR0ZXJuLCB2YWx1ZXMpIHtcbiAgICB2YXIgcmVzdWx0ID0gJycsXG4gICAgICAgIGksIGxlbiwgcGFydCwgaWQsIHZhbHVlO1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gcGF0dGVybi5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICBwYXJ0ID0gcGF0dGVybltpXTtcblxuICAgICAgICAvLyBFeGlzdCBlYXJseSBmb3Igc3RyaW5nIHBhcnRzLlxuICAgICAgICBpZiAodHlwZW9mIHBhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gcGFydDtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWQgPSBwYXJ0LmlkO1xuXG4gICAgICAgIC8vIEVuZm9yY2UgdGhhdCBhbGwgcmVxdWlyZWQgdmFsdWVzIGFyZSBwcm92aWRlZCBieSB0aGUgY2FsbGVyLlxuICAgICAgICBpZiAoISh2YWx1ZXMgJiYgc3JjJHV0aWxzJCQuaG9wLmNhbGwodmFsdWVzLCBpZCkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgdmFsdWUgbXVzdCBiZSBwcm92aWRlZCBmb3I6ICcgKyBpZCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZSA9IHZhbHVlc1tpZF07XG5cbiAgICAgICAgLy8gUmVjdXJzaXZlbHkgZm9ybWF0IHBsdXJhbCBhbmQgc2VsZWN0IHBhcnRzJyBvcHRpb24g4oCUIHdoaWNoIGNhbiBiZSBhXG4gICAgICAgIC8vIG5lc3RlZCBwYXR0ZXJuIHN0cnVjdHVyZS4gVGhlIGNob29zaW5nIG9mIHRoZSBvcHRpb24gdG8gdXNlIGlzXG4gICAgICAgIC8vIGFic3RyYWN0ZWQtYnkgYW5kIGRlbGVnYXRlZC10byB0aGUgcGFydCBoZWxwZXIgb2JqZWN0LlxuICAgICAgICBpZiAocGFydC5vcHRpb25zKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gdGhpcy5fZm9ybWF0KHBhcnQuZ2V0T3B0aW9uKHZhbHVlKSwgdmFsdWVzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBwYXJ0LmZvcm1hdCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuTWVzc2FnZUZvcm1hdC5wcm90b3R5cGUuX21lcmdlRm9ybWF0cyA9IGZ1bmN0aW9uIChkZWZhdWx0cywgZm9ybWF0cykge1xuICAgIHZhciBtZXJnZWRGb3JtYXRzID0ge30sXG4gICAgICAgIHR5cGUsIG1lcmdlZFR5cGU7XG5cbiAgICBmb3IgKHR5cGUgaW4gZGVmYXVsdHMpIHtcbiAgICAgICAgaWYgKCFzcmMkdXRpbHMkJC5ob3AuY2FsbChkZWZhdWx0cywgdHlwZSkpIHsgY29udGludWU7IH1cblxuICAgICAgICBtZXJnZWRGb3JtYXRzW3R5cGVdID0gbWVyZ2VkVHlwZSA9IHNyYyRlczUkJC5vYmpDcmVhdGUoZGVmYXVsdHNbdHlwZV0pO1xuXG4gICAgICAgIGlmIChmb3JtYXRzICYmIHNyYyR1dGlscyQkLmhvcC5jYWxsKGZvcm1hdHMsIHR5cGUpKSB7XG4gICAgICAgICAgICBzcmMkdXRpbHMkJC5leHRlbmQobWVyZ2VkVHlwZSwgZm9ybWF0c1t0eXBlXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbWVyZ2VkRm9ybWF0cztcbn07XG5cbk1lc3NhZ2VGb3JtYXQucHJvdG90eXBlLl9yZXNvbHZlTG9jYWxlID0gZnVuY3Rpb24gKGxvY2FsZXMpIHtcbiAgICBpZiAodHlwZW9mIGxvY2FsZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGxvY2FsZXMgPSBbbG9jYWxlc107XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIGEgY29weSBvZiB0aGUgYXJyYXkgc28gd2UgY2FuIHB1c2ggb24gdGhlIGRlZmF1bHQgbG9jYWxlLlxuICAgIGxvY2FsZXMgPSAobG9jYWxlcyB8fCBbXSkuY29uY2F0KE1lc3NhZ2VGb3JtYXQuZGVmYXVsdExvY2FsZSk7XG5cbiAgICB2YXIgbG9jYWxlRGF0YSA9IE1lc3NhZ2VGb3JtYXQuX19sb2NhbGVEYXRhX187XG4gICAgdmFyIGksIGxlbiwgbG9jYWxlUGFydHMsIGRhdGE7XG5cbiAgICAvLyBVc2luZyB0aGUgc2V0IG9mIGxvY2FsZXMgKyB0aGUgZGVmYXVsdCBsb2NhbGUsIHdlIGxvb2sgZm9yIHRoZSBmaXJzdCBvbmVcbiAgICAvLyB3aGljaCB0aGF0IGhhcyBiZWVuIHJlZ2lzdGVyZWQuIFdoZW4gZGF0YSBkb2VzIG5vdCBleGlzdCBmb3IgYSBsb2NhbGUsIHdlXG4gICAgLy8gdHJhdmVyc2UgaXRzIGFuY2VzdG9ycyB0byBmaW5kIHNvbWV0aGluZyB0aGF0J3MgYmVlbiByZWdpc3RlcmVkIHdpdGhpblxuICAgIC8vIGl0cyBoaWVyYXJjaHkgb2YgbG9jYWxlcy4gU2luY2Ugd2UgbGFjayB0aGUgcHJvcGVyIGBwYXJlbnRMb2NhbGVgIGRhdGFcbiAgICAvLyBoZXJlLCB3ZSBtdXN0IHRha2UgYSBuYWl2ZSBhcHByb2FjaCB0byB0cmF2ZXJzYWwuXG4gICAgZm9yIChpID0gMCwgbGVuID0gbG9jYWxlcy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICBsb2NhbGVQYXJ0cyA9IGxvY2FsZXNbaV0udG9Mb3dlckNhc2UoKS5zcGxpdCgnLScpO1xuXG4gICAgICAgIHdoaWxlIChsb2NhbGVQYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGRhdGEgPSBsb2NhbGVEYXRhW2xvY2FsZVBhcnRzLmpvaW4oJy0nKV07XG4gICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vIFJldHVybiB0aGUgbm9ybWFsaXplZCBsb2NhbGUgc3RyaW5nOyBlLmcuLCB3ZSByZXR1cm4gXCJlbi1VU1wiLFxuICAgICAgICAgICAgICAgIC8vIGluc3RlYWQgb2YgXCJlbi11c1wiLlxuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLmxvY2FsZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbG9jYWxlUGFydHMucG9wKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZSA9IGxvY2FsZXMucG9wKCk7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnTm8gbG9jYWxlIGRhdGEgaGFzIGJlZW4gYWRkZWQgdG8gSW50bE1lc3NhZ2VGb3JtYXQgZm9yOiAnICtcbiAgICAgICAgbG9jYWxlcy5qb2luKCcsICcpICsgJywgb3IgdGhlIGRlZmF1bHQgbG9jYWxlOiAnICsgZGVmYXVsdExvY2FsZVxuICAgICk7XG59O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb3JlLmpzLm1hcCIsIi8vIEdFTkVSQVRFRCBGSUxFXG5cInVzZSBzdHJpY3RcIjtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0ge1wibG9jYWxlXCI6XCJlblwiLFwicGx1cmFsUnVsZUZ1bmN0aW9uXCI6ZnVuY3Rpb24gKG4sb3JkKXt2YXIgcz1TdHJpbmcobikuc3BsaXQoXCIuXCIpLHYwPSFzWzFdLHQwPU51bWJlcihzWzBdKT09bixuMTA9dDAmJnNbMF0uc2xpY2UoLTEpLG4xMDA9dDAmJnNbMF0uc2xpY2UoLTIpO2lmKG9yZClyZXR1cm4gbjEwPT0xJiZuMTAwIT0xMT9cIm9uZVwiOm4xMD09MiYmbjEwMCE9MTI/XCJ0d29cIjpuMTA9PTMmJm4xMDAhPTEzP1wiZmV3XCI6XCJvdGhlclwiO3JldHVybiBuPT0xJiZ2MD9cIm9uZVwiOlwib3RoZXJcIn19O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1lbi5qcy5tYXAiLCIvKlxuQ29weXJpZ2h0IChjKSAyMDE0LCBZYWhvbyEgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuQ29weXJpZ2h0cyBsaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBMaWNlbnNlLlxuU2VlIHRoZSBhY2NvbXBhbnlpbmcgTElDRU5TRSBmaWxlIGZvciB0ZXJtcy5cbiovXG5cbi8qIGpzbGludCBlc25leHQ6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgc3JjJHV0aWxzJCQgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcblxuLy8gUHVycG9zZWx5IHVzaW5nIHRoZSBzYW1lIGltcGxlbWVudGF0aW9uIGFzIHRoZSBJbnRsLmpzIGBJbnRsYCBwb2x5ZmlsbC5cbi8vIENvcHlyaWdodCAyMDEzIEFuZHkgRWFybnNoYXcsIE1JVCBMaWNlbnNlXG5cbnZhciByZWFsRGVmaW5lUHJvcCA9IChmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHsgcmV0dXJuICEhT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHt9KTsgfVxuICAgIGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfVxufSkoKTtcblxudmFyIGVzMyA9ICFyZWFsRGVmaW5lUHJvcCAmJiAhT2JqZWN0LnByb3RvdHlwZS5fX2RlZmluZUdldHRlcl9fO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSByZWFsRGVmaW5lUHJvcCA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA6XG4gICAgICAgIGZ1bmN0aW9uIChvYmosIG5hbWUsIGRlc2MpIHtcblxuICAgIGlmICgnZ2V0JyBpbiBkZXNjICYmIG9iai5fX2RlZmluZUdldHRlcl9fKSB7XG4gICAgICAgIG9iai5fX2RlZmluZUdldHRlcl9fKG5hbWUsIGRlc2MuZ2V0KTtcbiAgICB9IGVsc2UgaWYgKCFzcmMkdXRpbHMkJC5ob3AuY2FsbChvYmosIG5hbWUpIHx8ICd2YWx1ZScgaW4gZGVzYykge1xuICAgICAgICBvYmpbbmFtZV0gPSBkZXNjLnZhbHVlO1xuICAgIH1cbn07XG5cbnZhciBvYmpDcmVhdGUgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIChwcm90bywgcHJvcHMpIHtcbiAgICB2YXIgb2JqLCBrO1xuXG4gICAgZnVuY3Rpb24gRigpIHt9XG4gICAgRi5wcm90b3R5cGUgPSBwcm90bztcbiAgICBvYmogPSBuZXcgRigpO1xuXG4gICAgZm9yIChrIGluIHByb3BzKSB7XG4gICAgICAgIGlmIChzcmMkdXRpbHMkJC5ob3AuY2FsbChwcm9wcywgaykpIHtcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnR5KG9iaiwgaywgcHJvcHNba10pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn07XG5leHBvcnRzLmRlZmluZVByb3BlcnR5ID0gZGVmaW5lUHJvcGVydHksIGV4cG9ydHMub2JqQ3JlYXRlID0gb2JqQ3JlYXRlO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1lczUuanMubWFwIiwiLypcbkNvcHlyaWdodCAoYykgMjAxNCwgWWFob28hIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbkNvcHlyaWdodHMgbGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgTGljZW5zZS5cblNlZSB0aGUgYWNjb21wYW55aW5nIExJQ0VOU0UgZmlsZSBmb3IgdGVybXMuXG4qL1xuXG4vKiBqc2xpbnQgZXNuZXh0OiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7XG52YXIgaG9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZnVuY3Rpb24gZXh0ZW5kKG9iaikge1xuICAgIHZhciBzb3VyY2VzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSxcbiAgICAgICAgaSwgbGVuLCBzb3VyY2UsIGtleTtcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IHNvdXJjZXMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgc291cmNlID0gc291cmNlc1tpXTtcbiAgICAgICAgaWYgKCFzb3VyY2UpIHsgY29udGludWU7IH1cblxuICAgICAgICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChob3AuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICAgICAgICBvYmpba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn1cbmV4cG9ydHMuaG9wID0gaG9wO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD11dGlscy5qcy5tYXAiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL3BhcnNlcicpWydkZWZhdWx0J107XG5leHBvcnRzWydkZWZhdWx0J10gPSBleHBvcnRzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gKGZ1bmN0aW9uKCkge1xuICAvKlxuICAgKiBHZW5lcmF0ZWQgYnkgUEVHLmpzIDAuOC4wLlxuICAgKlxuICAgKiBodHRwOi8vcGVnanMubWFqZGEuY3ovXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHBlZyRzdWJjbGFzcyhjaGlsZCwgcGFyZW50KSB7XG4gICAgZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9XG4gICAgY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xuICAgIGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7XG4gIH1cblxuICBmdW5jdGlvbiBTeW50YXhFcnJvcihtZXNzYWdlLCBleHBlY3RlZCwgZm91bmQsIG9mZnNldCwgbGluZSwgY29sdW1uKSB7XG4gICAgdGhpcy5tZXNzYWdlICA9IG1lc3NhZ2U7XG4gICAgdGhpcy5leHBlY3RlZCA9IGV4cGVjdGVkO1xuICAgIHRoaXMuZm91bmQgICAgPSBmb3VuZDtcbiAgICB0aGlzLm9mZnNldCAgID0gb2Zmc2V0O1xuICAgIHRoaXMubGluZSAgICAgPSBsaW5lO1xuICAgIHRoaXMuY29sdW1uICAgPSBjb2x1bW47XG5cbiAgICB0aGlzLm5hbWUgICAgID0gXCJTeW50YXhFcnJvclwiO1xuICB9XG5cbiAgcGVnJHN1YmNsYXNzKFN5bnRheEVycm9yLCBFcnJvcik7XG5cbiAgZnVuY3Rpb24gcGFyc2UoaW5wdXQpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDoge30sXG5cbiAgICAgICAgcGVnJEZBSUxFRCA9IHt9LFxuXG4gICAgICAgIHBlZyRzdGFydFJ1bGVGdW5jdGlvbnMgPSB7IHN0YXJ0OiBwZWckcGFyc2VzdGFydCB9LFxuICAgICAgICBwZWckc3RhcnRSdWxlRnVuY3Rpb24gID0gcGVnJHBhcnNlc3RhcnQsXG5cbiAgICAgICAgcGVnJGMwID0gW10sXG4gICAgICAgIHBlZyRjMSA9IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSAgICA6ICdtZXNzYWdlRm9ybWF0UGF0dGVybicsXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzOiBlbGVtZW50c1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICBwZWckYzIgPSBwZWckRkFJTEVELFxuICAgICAgICBwZWckYzMgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0cmluZyA9ICcnLFxuICAgICAgICAgICAgICAgICAgICBpLCBqLCBvdXRlckxlbiwgaW5uZXIsIGlubmVyTGVuO1xuXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgb3V0ZXJMZW4gPSB0ZXh0Lmxlbmd0aDsgaSA8IG91dGVyTGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5uZXIgPSB0ZXh0W2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDAsIGlubmVyTGVuID0gaW5uZXIubGVuZ3RoOyBqIDwgaW5uZXJMZW47IGogKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IGlubmVyW2pdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICAgICAgICAgIH0sXG4gICAgICAgIHBlZyRjNCA9IGZ1bmN0aW9uKG1lc3NhZ2VUZXh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA6ICdtZXNzYWdlVGV4dEVsZW1lbnQnLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogbWVzc2FnZVRleHRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgcGVnJGM1ID0gL15bXiBcXHRcXG5cXHIsLis9e30jXS8sXG4gICAgICAgIHBlZyRjNiA9IHsgdHlwZTogXCJjbGFzc1wiLCB2YWx1ZTogXCJbXiBcXFxcdFxcXFxuXFxcXHIsLis9e30jXVwiLCBkZXNjcmlwdGlvbjogXCJbXiBcXFxcdFxcXFxuXFxcXHIsLis9e30jXVwiIH0sXG4gICAgICAgIHBlZyRjNyA9IFwie1wiLFxuICAgICAgICBwZWckYzggPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJ7XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJ7XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjOSA9IG51bGwsXG4gICAgICAgIHBlZyRjMTAgPSBcIixcIixcbiAgICAgICAgcGVnJGMxMSA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcIixcIiwgZGVzY3JpcHRpb246IFwiXFxcIixcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMxMiA9IFwifVwiLFxuICAgICAgICBwZWckYzEzID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwifVwiLCBkZXNjcmlwdGlvbjogXCJcXFwifVxcXCJcIiB9LFxuICAgICAgICBwZWckYzE0ID0gZnVuY3Rpb24oaWQsIGZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgIDogJ2FyZ3VtZW50RWxlbWVudCcsXG4gICAgICAgICAgICAgICAgICAgIGlkICAgIDogaWQsXG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdDogZm9ybWF0ICYmIGZvcm1hdFsyXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICBwZWckYzE1ID0gXCJudW1iZXJcIixcbiAgICAgICAgcGVnJGMxNiA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcIm51bWJlclwiLCBkZXNjcmlwdGlvbjogXCJcXFwibnVtYmVyXFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMTcgPSBcImRhdGVcIixcbiAgICAgICAgcGVnJGMxOCA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcImRhdGVcIiwgZGVzY3JpcHRpb246IFwiXFxcImRhdGVcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMxOSA9IFwidGltZVwiLFxuICAgICAgICBwZWckYzIwID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwidGltZVwiLCBkZXNjcmlwdGlvbjogXCJcXFwidGltZVxcXCJcIiB9LFxuICAgICAgICBwZWckYzIxID0gZnVuY3Rpb24odHlwZSwgc3R5bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlIDogdHlwZSArICdGb3JtYXQnLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZTogc3R5bGUgJiYgc3R5bGVbMl1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgcGVnJGMyMiA9IFwicGx1cmFsXCIsXG4gICAgICAgIHBlZyRjMjMgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJwbHVyYWxcIiwgZGVzY3JpcHRpb246IFwiXFxcInBsdXJhbFxcXCJcIiB9LFxuICAgICAgICBwZWckYzI0ID0gZnVuY3Rpb24ocGx1cmFsU3R5bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlICAgOiBwbHVyYWxTdHlsZS50eXBlLFxuICAgICAgICAgICAgICAgICAgICBvcmRpbmFsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0IDogcGx1cmFsU3R5bGUub2Zmc2V0IHx8IDAsXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHBsdXJhbFN0eWxlLm9wdGlvbnNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgcGVnJGMyNSA9IFwic2VsZWN0b3JkaW5hbFwiLFxuICAgICAgICBwZWckYzI2ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwic2VsZWN0b3JkaW5hbFwiLCBkZXNjcmlwdGlvbjogXCJcXFwic2VsZWN0b3JkaW5hbFxcXCJcIiB9LFxuICAgICAgICBwZWckYzI3ID0gZnVuY3Rpb24ocGx1cmFsU3R5bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlICAgOiBwbHVyYWxTdHlsZS50eXBlLFxuICAgICAgICAgICAgICAgICAgICBvcmRpbmFsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgOiBwbHVyYWxTdHlsZS5vZmZzZXQgfHwgMCxcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogcGx1cmFsU3R5bGUub3B0aW9uc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIHBlZyRjMjggPSBcInNlbGVjdFwiLFxuICAgICAgICBwZWckYzI5ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwic2VsZWN0XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJzZWxlY3RcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMzMCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlICAgOiAnc2VsZWN0Rm9ybWF0JyxcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICBwZWckYzMxID0gXCI9XCIsXG4gICAgICAgIHBlZyRjMzIgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCI9XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCI9XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMzMgPSBmdW5jdGlvbihzZWxlY3RvciwgcGF0dGVybikge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgICAgOiAnb3B0aW9uYWxGb3JtYXRQYXR0ZXJuJyxcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSAgIDogcGF0dGVyblxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICBwZWckYzM0ID0gXCJvZmZzZXQ6XCIsXG4gICAgICAgIHBlZyRjMzUgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJvZmZzZXQ6XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJvZmZzZXQ6XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMzYgPSBmdW5jdGlvbihudW1iZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVtYmVyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgcGVnJGMzNyA9IGZ1bmN0aW9uKG9mZnNldCwgb3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgICA6ICdwbHVyYWxGb3JtYXQnLFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgOiBvZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgcGVnJGMzOCA9IHsgdHlwZTogXCJvdGhlclwiLCBkZXNjcmlwdGlvbjogXCJ3aGl0ZXNwYWNlXCIgfSxcbiAgICAgICAgcGVnJGMzOSA9IC9eWyBcXHRcXG5cXHJdLyxcbiAgICAgICAgcGVnJGM0MCA9IHsgdHlwZTogXCJjbGFzc1wiLCB2YWx1ZTogXCJbIFxcXFx0XFxcXG5cXFxccl1cIiwgZGVzY3JpcHRpb246IFwiWyBcXFxcdFxcXFxuXFxcXHJdXCIgfSxcbiAgICAgICAgcGVnJGM0MSA9IHsgdHlwZTogXCJvdGhlclwiLCBkZXNjcmlwdGlvbjogXCJvcHRpb25hbFdoaXRlc3BhY2VcIiB9LFxuICAgICAgICBwZWckYzQyID0gL15bMC05XS8sXG4gICAgICAgIHBlZyRjNDMgPSB7IHR5cGU6IFwiY2xhc3NcIiwgdmFsdWU6IFwiWzAtOV1cIiwgZGVzY3JpcHRpb246IFwiWzAtOV1cIiB9LFxuICAgICAgICBwZWckYzQ0ID0gL15bMC05YS1mXS9pLFxuICAgICAgICBwZWckYzQ1ID0geyB0eXBlOiBcImNsYXNzXCIsIHZhbHVlOiBcIlswLTlhLWZdaVwiLCBkZXNjcmlwdGlvbjogXCJbMC05YS1mXWlcIiB9LFxuICAgICAgICBwZWckYzQ2ID0gXCIwXCIsXG4gICAgICAgIHBlZyRjNDcgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCIwXCIsIGRlc2NyaXB0aW9uOiBcIlxcXCIwXFxcIlwiIH0sXG4gICAgICAgIHBlZyRjNDggPSAvXlsxLTldLyxcbiAgICAgICAgcGVnJGM0OSA9IHsgdHlwZTogXCJjbGFzc1wiLCB2YWx1ZTogXCJbMS05XVwiLCBkZXNjcmlwdGlvbjogXCJbMS05XVwiIH0sXG4gICAgICAgIHBlZyRjNTAgPSBmdW5jdGlvbihkaWdpdHMpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludChkaWdpdHMsIDEwKTtcbiAgICAgICAgfSxcbiAgICAgICAgcGVnJGM1MSA9IC9eW157fVxcXFxcXDAtXFx4MUZ/IFxcdFxcblxccl0vLFxuICAgICAgICBwZWckYzUyID0geyB0eXBlOiBcImNsYXNzXCIsIHZhbHVlOiBcIltee31cXFxcXFxcXFxcXFwwLVxcXFx4MUZ/IFxcXFx0XFxcXG5cXFxccl1cIiwgZGVzY3JpcHRpb246IFwiW157fVxcXFxcXFxcXFxcXDAtXFxcXHgxRn8gXFxcXHRcXFxcblxcXFxyXVwiIH0sXG4gICAgICAgIHBlZyRjNTMgPSBcIlxcXFxcXFxcXCIsXG4gICAgICAgIHBlZyRjNTQgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJcXFxcXFxcXFwiLCBkZXNjcmlwdGlvbjogXCJcXFwiXFxcXFxcXFxcXFxcXFxcXFxcXCJcIiB9LFxuICAgICAgICBwZWckYzU1ID0gZnVuY3Rpb24oKSB7IHJldHVybiAnXFxcXCc7IH0sXG4gICAgICAgIHBlZyRjNTYgPSBcIlxcXFwjXCIsXG4gICAgICAgIHBlZyRjNTcgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJcXFxcI1wiLCBkZXNjcmlwdGlvbjogXCJcXFwiXFxcXFxcXFwjXFxcIlwiIH0sXG4gICAgICAgIHBlZyRjNTggPSBmdW5jdGlvbigpIHsgcmV0dXJuICdcXFxcIyc7IH0sXG4gICAgICAgIHBlZyRjNTkgPSBcIlxcXFx7XCIsXG4gICAgICAgIHBlZyRjNjAgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJcXFxce1wiLCBkZXNjcmlwdGlvbjogXCJcXFwiXFxcXFxcXFx7XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjNjEgPSBmdW5jdGlvbigpIHsgcmV0dXJuICdcXHUwMDdCJzsgfSxcbiAgICAgICAgcGVnJGM2MiA9IFwiXFxcXH1cIixcbiAgICAgICAgcGVnJGM2MyA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcIlxcXFx9XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJcXFxcXFxcXH1cXFwiXCIgfSxcbiAgICAgICAgcGVnJGM2NCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gJ1xcdTAwN0QnOyB9LFxuICAgICAgICBwZWckYzY1ID0gXCJcXFxcdVwiLFxuICAgICAgICBwZWckYzY2ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiXFxcXHVcIiwgZGVzY3JpcHRpb246IFwiXFxcIlxcXFxcXFxcdVxcXCJcIiB9LFxuICAgICAgICBwZWckYzY3ID0gZnVuY3Rpb24oZGlnaXRzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQoZGlnaXRzLCAxNikpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgcGVnJGM2OCA9IGZ1bmN0aW9uKGNoYXJzKSB7IHJldHVybiBjaGFycy5qb2luKCcnKTsgfSxcblxuICAgICAgICBwZWckY3VyclBvcyAgICAgICAgICA9IDAsXG4gICAgICAgIHBlZyRyZXBvcnRlZFBvcyAgICAgID0gMCxcbiAgICAgICAgcGVnJGNhY2hlZFBvcyAgICAgICAgPSAwLFxuICAgICAgICBwZWckY2FjaGVkUG9zRGV0YWlscyA9IHsgbGluZTogMSwgY29sdW1uOiAxLCBzZWVuQ1I6IGZhbHNlIH0sXG4gICAgICAgIHBlZyRtYXhGYWlsUG9zICAgICAgID0gMCxcbiAgICAgICAgcGVnJG1heEZhaWxFeHBlY3RlZCAgPSBbXSxcbiAgICAgICAgcGVnJHNpbGVudEZhaWxzICAgICAgPSAwLFxuXG4gICAgICAgIHBlZyRyZXN1bHQ7XG5cbiAgICBpZiAoXCJzdGFydFJ1bGVcIiBpbiBvcHRpb25zKSB7XG4gICAgICBpZiAoIShvcHRpb25zLnN0YXJ0UnVsZSBpbiBwZWckc3RhcnRSdWxlRnVuY3Rpb25zKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBzdGFydCBwYXJzaW5nIGZyb20gcnVsZSBcXFwiXCIgKyBvcHRpb25zLnN0YXJ0UnVsZSArIFwiXFxcIi5cIik7XG4gICAgICB9XG5cbiAgICAgIHBlZyRzdGFydFJ1bGVGdW5jdGlvbiA9IHBlZyRzdGFydFJ1bGVGdW5jdGlvbnNbb3B0aW9ucy5zdGFydFJ1bGVdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRleHQoKSB7XG4gICAgICByZXR1cm4gaW5wdXQuc3Vic3RyaW5nKHBlZyRyZXBvcnRlZFBvcywgcGVnJGN1cnJQb3MpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9mZnNldCgpIHtcbiAgICAgIHJldHVybiBwZWckcmVwb3J0ZWRQb3M7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGluZSgpIHtcbiAgICAgIHJldHVybiBwZWckY29tcHV0ZVBvc0RldGFpbHMocGVnJHJlcG9ydGVkUG9zKS5saW5lO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbHVtbigpIHtcbiAgICAgIHJldHVybiBwZWckY29tcHV0ZVBvc0RldGFpbHMocGVnJHJlcG9ydGVkUG9zKS5jb2x1bW47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhwZWN0ZWQoZGVzY3JpcHRpb24pIHtcbiAgICAgIHRocm93IHBlZyRidWlsZEV4Y2VwdGlvbihcbiAgICAgICAgbnVsbCxcbiAgICAgICAgW3sgdHlwZTogXCJvdGhlclwiLCBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24gfV0sXG4gICAgICAgIHBlZyRyZXBvcnRlZFBvc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlcnJvcihtZXNzYWdlKSB7XG4gICAgICB0aHJvdyBwZWckYnVpbGRFeGNlcHRpb24obWVzc2FnZSwgbnVsbCwgcGVnJHJlcG9ydGVkUG9zKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckY29tcHV0ZVBvc0RldGFpbHMocG9zKSB7XG4gICAgICBmdW5jdGlvbiBhZHZhbmNlKGRldGFpbHMsIHN0YXJ0UG9zLCBlbmRQb3MpIHtcbiAgICAgICAgdmFyIHAsIGNoO1xuXG4gICAgICAgIGZvciAocCA9IHN0YXJ0UG9zOyBwIDwgZW5kUG9zOyBwKyspIHtcbiAgICAgICAgICBjaCA9IGlucHV0LmNoYXJBdChwKTtcbiAgICAgICAgICBpZiAoY2ggPT09IFwiXFxuXCIpIHtcbiAgICAgICAgICAgIGlmICghZGV0YWlscy5zZWVuQ1IpIHsgZGV0YWlscy5saW5lKys7IH1cbiAgICAgICAgICAgIGRldGFpbHMuY29sdW1uID0gMTtcbiAgICAgICAgICAgIGRldGFpbHMuc2VlbkNSID0gZmFsc2U7XG4gICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gXCJcXHJcIiB8fCBjaCA9PT0gXCJcXHUyMDI4XCIgfHwgY2ggPT09IFwiXFx1MjAyOVwiKSB7XG4gICAgICAgICAgICBkZXRhaWxzLmxpbmUrKztcbiAgICAgICAgICAgIGRldGFpbHMuY29sdW1uID0gMTtcbiAgICAgICAgICAgIGRldGFpbHMuc2VlbkNSID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGV0YWlscy5jb2x1bW4rKztcbiAgICAgICAgICAgIGRldGFpbHMuc2VlbkNSID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwZWckY2FjaGVkUG9zICE9PSBwb3MpIHtcbiAgICAgICAgaWYgKHBlZyRjYWNoZWRQb3MgPiBwb3MpIHtcbiAgICAgICAgICBwZWckY2FjaGVkUG9zID0gMDtcbiAgICAgICAgICBwZWckY2FjaGVkUG9zRGV0YWlscyA9IHsgbGluZTogMSwgY29sdW1uOiAxLCBzZWVuQ1I6IGZhbHNlIH07XG4gICAgICAgIH1cbiAgICAgICAgYWR2YW5jZShwZWckY2FjaGVkUG9zRGV0YWlscywgcGVnJGNhY2hlZFBvcywgcG9zKTtcbiAgICAgICAgcGVnJGNhY2hlZFBvcyA9IHBvcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBlZyRjYWNoZWRQb3NEZXRhaWxzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRmYWlsKGV4cGVjdGVkKSB7XG4gICAgICBpZiAocGVnJGN1cnJQb3MgPCBwZWckbWF4RmFpbFBvcykgeyByZXR1cm47IH1cblxuICAgICAgaWYgKHBlZyRjdXJyUG9zID4gcGVnJG1heEZhaWxQb3MpIHtcbiAgICAgICAgcGVnJG1heEZhaWxQb3MgPSBwZWckY3VyclBvcztcbiAgICAgICAgcGVnJG1heEZhaWxFeHBlY3RlZCA9IFtdO1xuICAgICAgfVxuXG4gICAgICBwZWckbWF4RmFpbEV4cGVjdGVkLnB1c2goZXhwZWN0ZWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRidWlsZEV4Y2VwdGlvbihtZXNzYWdlLCBleHBlY3RlZCwgcG9zKSB7XG4gICAgICBmdW5jdGlvbiBjbGVhbnVwRXhwZWN0ZWQoZXhwZWN0ZWQpIHtcbiAgICAgICAgdmFyIGkgPSAxO1xuXG4gICAgICAgIGV4cGVjdGVkLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgIGlmIChhLmRlc2NyaXB0aW9uIDwgYi5kZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYS5kZXNjcmlwdGlvbiA+IGIuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdoaWxlIChpIDwgZXhwZWN0ZWQubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKGV4cGVjdGVkW2kgLSAxXSA9PT0gZXhwZWN0ZWRbaV0pIHtcbiAgICAgICAgICAgIGV4cGVjdGVkLnNwbGljZShpLCAxKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBidWlsZE1lc3NhZ2UoZXhwZWN0ZWQsIGZvdW5kKSB7XG4gICAgICAgIGZ1bmN0aW9uIHN0cmluZ0VzY2FwZShzKSB7XG4gICAgICAgICAgZnVuY3Rpb24gaGV4KGNoKSB7IHJldHVybiBjaC5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpOyB9XG5cbiAgICAgICAgICByZXR1cm4gc1xuICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFwvZywgICAnXFxcXFxcXFwnKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1wiL2csICAgICdcXFxcXCInKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xceDA4L2csICdcXFxcYicpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFx0L2csICAgJ1xcXFx0JylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgICAnXFxcXG4nKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcZi9nLCAgICdcXFxcZicpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxyL2csICAgJ1xcXFxyJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9bXFx4MDAtXFx4MDdcXHgwQlxceDBFXFx4MEZdL2csIGZ1bmN0aW9uKGNoKSB7IHJldHVybiAnXFxcXHgwJyArIGhleChjaCk7IH0pXG4gICAgICAgICAgICAucmVwbGFjZSgvW1xceDEwLVxceDFGXFx4ODAtXFx4RkZdL2csICAgIGZ1bmN0aW9uKGNoKSB7IHJldHVybiAnXFxcXHgnICArIGhleChjaCk7IH0pXG4gICAgICAgICAgICAucmVwbGFjZSgvW1xcdTAxODAtXFx1MEZGRl0vZywgICAgICAgICBmdW5jdGlvbihjaCkgeyByZXR1cm4gJ1xcXFx1MCcgKyBoZXgoY2gpOyB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoL1tcXHUxMDgwLVxcdUZGRkZdL2csICAgICAgICAgZnVuY3Rpb24oY2gpIHsgcmV0dXJuICdcXFxcdScgICsgaGV4KGNoKTsgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZXhwZWN0ZWREZXNjcyA9IG5ldyBBcnJheShleHBlY3RlZC5sZW5ndGgpLFxuICAgICAgICAgICAgZXhwZWN0ZWREZXNjLCBmb3VuZERlc2MsIGk7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGV4cGVjdGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZXhwZWN0ZWREZXNjc1tpXSA9IGV4cGVjdGVkW2ldLmRlc2NyaXB0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwZWN0ZWREZXNjID0gZXhwZWN0ZWQubGVuZ3RoID4gMVxuICAgICAgICAgID8gZXhwZWN0ZWREZXNjcy5zbGljZSgwLCAtMSkuam9pbihcIiwgXCIpXG4gICAgICAgICAgICAgICsgXCIgb3IgXCJcbiAgICAgICAgICAgICAgKyBleHBlY3RlZERlc2NzW2V4cGVjdGVkLmxlbmd0aCAtIDFdXG4gICAgICAgICAgOiBleHBlY3RlZERlc2NzWzBdO1xuXG4gICAgICAgIGZvdW5kRGVzYyA9IGZvdW5kID8gXCJcXFwiXCIgKyBzdHJpbmdFc2NhcGUoZm91bmQpICsgXCJcXFwiXCIgOiBcImVuZCBvZiBpbnB1dFwiO1xuXG4gICAgICAgIHJldHVybiBcIkV4cGVjdGVkIFwiICsgZXhwZWN0ZWREZXNjICsgXCIgYnV0IFwiICsgZm91bmREZXNjICsgXCIgZm91bmQuXCI7XG4gICAgICB9XG5cbiAgICAgIHZhciBwb3NEZXRhaWxzID0gcGVnJGNvbXB1dGVQb3NEZXRhaWxzKHBvcyksXG4gICAgICAgICAgZm91bmQgICAgICA9IHBvcyA8IGlucHV0Lmxlbmd0aCA/IGlucHV0LmNoYXJBdChwb3MpIDogbnVsbDtcblxuICAgICAgaWYgKGV4cGVjdGVkICE9PSBudWxsKSB7XG4gICAgICAgIGNsZWFudXBFeHBlY3RlZChleHBlY3RlZCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgU3ludGF4RXJyb3IoXG4gICAgICAgIG1lc3NhZ2UgIT09IG51bGwgPyBtZXNzYWdlIDogYnVpbGRNZXNzYWdlKGV4cGVjdGVkLCBmb3VuZCksXG4gICAgICAgIGV4cGVjdGVkLFxuICAgICAgICBmb3VuZCxcbiAgICAgICAgcG9zLFxuICAgICAgICBwb3NEZXRhaWxzLmxpbmUsXG4gICAgICAgIHBvc0RldGFpbHMuY29sdW1uXG4gICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZXN0YXJ0KCkge1xuICAgICAgdmFyIHMwO1xuXG4gICAgICBzMCA9IHBlZyRwYXJzZW1lc3NhZ2VGb3JtYXRQYXR0ZXJuKCk7XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VtZXNzYWdlRm9ybWF0UGF0dGVybigpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyO1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgczEgPSBbXTtcbiAgICAgIHMyID0gcGVnJHBhcnNlbWVzc2FnZUZvcm1hdEVsZW1lbnQoKTtcbiAgICAgIHdoaWxlIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMS5wdXNoKHMyKTtcbiAgICAgICAgczIgPSBwZWckcGFyc2VtZXNzYWdlRm9ybWF0RWxlbWVudCgpO1xuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICBzMSA9IHBlZyRjMShzMSk7XG4gICAgICB9XG4gICAgICBzMCA9IHMxO1xuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlbWVzc2FnZUZvcm1hdEVsZW1lbnQoKSB7XG4gICAgICB2YXIgczA7XG5cbiAgICAgIHMwID0gcGVnJHBhcnNlbWVzc2FnZVRleHRFbGVtZW50KCk7XG4gICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczAgPSBwZWckcGFyc2Vhcmd1bWVudEVsZW1lbnQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZW1lc3NhZ2VUZXh0KCkge1xuICAgICAgdmFyIHMwLCBzMSwgczIsIHMzLCBzNCwgczU7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBzMSA9IFtdO1xuICAgICAgczIgPSBwZWckY3VyclBvcztcbiAgICAgIHMzID0gcGVnJHBhcnNlXygpO1xuICAgICAgaWYgKHMzICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHM0ID0gcGVnJHBhcnNlY2hhcnMoKTtcbiAgICAgICAgaWYgKHM0ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczUgPSBwZWckcGFyc2VfKCk7XG4gICAgICAgICAgaWYgKHM1ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzMyA9IFtzMywgczQsIHM1XTtcbiAgICAgICAgICAgIHMyID0gczM7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczI7XG4gICAgICAgICAgICBzMiA9IHBlZyRjMjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMjtcbiAgICAgICAgICBzMiA9IHBlZyRjMjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVnJGN1cnJQb3MgPSBzMjtcbiAgICAgICAgczIgPSBwZWckYzI7XG4gICAgICB9XG4gICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgd2hpbGUgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczEucHVzaChzMik7XG4gICAgICAgICAgczIgPSBwZWckY3VyclBvcztcbiAgICAgICAgICBzMyA9IHBlZyRwYXJzZV8oKTtcbiAgICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHM0ID0gcGVnJHBhcnNlY2hhcnMoKTtcbiAgICAgICAgICAgIGlmIChzNCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICBzNSA9IHBlZyRwYXJzZV8oKTtcbiAgICAgICAgICAgICAgaWYgKHM1ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgczMgPSBbczMsIHM0LCBzNV07XG4gICAgICAgICAgICAgICAgczIgPSBzMztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMyO1xuICAgICAgICAgICAgICAgIHMyID0gcGVnJGMyO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMyO1xuICAgICAgICAgICAgICBzMiA9IHBlZyRjMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMjtcbiAgICAgICAgICAgIHMyID0gcGVnJGMyO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczEgPSBwZWckYzI7XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgcGVnJHJlcG9ydGVkUG9zID0gczA7XG4gICAgICAgIHMxID0gcGVnJGMzKHMxKTtcbiAgICAgIH1cbiAgICAgIHMwID0gczE7XG4gICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgICAgczEgPSBwZWckcGFyc2V3cygpO1xuICAgICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMSA9IGlucHV0LnN1YnN0cmluZyhzMCwgcGVnJGN1cnJQb3MpO1xuICAgICAgICB9XG4gICAgICAgIHMwID0gczE7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VtZXNzYWdlVGV4dEVsZW1lbnQoKSB7XG4gICAgICB2YXIgczAsIHMxO1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgczEgPSBwZWckcGFyc2VtZXNzYWdlVGV4dCgpO1xuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICBzMSA9IHBlZyRjNChzMSk7XG4gICAgICB9XG4gICAgICBzMCA9IHMxO1xuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlYXJndW1lbnQoKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMjtcblxuICAgICAgczAgPSBwZWckcGFyc2VudW1iZXIoKTtcbiAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgICBzMSA9IFtdO1xuICAgICAgICBpZiAocGVnJGM1LnRlc3QoaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKSkpIHtcbiAgICAgICAgICBzMiA9IGlucHV0LmNoYXJBdChwZWckY3VyclBvcyk7XG4gICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzMiA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzYpOyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgd2hpbGUgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzMS5wdXNoKHMyKTtcbiAgICAgICAgICAgIGlmIChwZWckYzUudGVzdChpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpKSkge1xuICAgICAgICAgICAgICBzMiA9IGlucHV0LmNoYXJBdChwZWckY3VyclBvcyk7XG4gICAgICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzMiA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM2KTsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzMSA9IHBlZyRjMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMSA9IGlucHV0LnN1YnN0cmluZyhzMCwgcGVnJGN1cnJQb3MpO1xuICAgICAgICB9XG4gICAgICAgIHMwID0gczE7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2Vhcmd1bWVudEVsZW1lbnQoKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMiwgczMsIHM0LCBzNSwgczYsIHM3LCBzODtcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBlZyRjdXJyUG9zKSA9PT0gMTIzKSB7XG4gICAgICAgIHMxID0gcGVnJGM3O1xuICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjOCk7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMiA9IHBlZyRwYXJzZV8oKTtcbiAgICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczMgPSBwZWckcGFyc2Vhcmd1bWVudCgpO1xuICAgICAgICAgIGlmIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgczQgPSBwZWckcGFyc2VfKCk7XG4gICAgICAgICAgICBpZiAoczQgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgczUgPSBwZWckY3VyclBvcztcbiAgICAgICAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocGVnJGN1cnJQb3MpID09PSA0NCkge1xuICAgICAgICAgICAgICAgIHM2ID0gcGVnJGMxMDtcbiAgICAgICAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHM2ID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMTEpOyB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHM2ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgczcgPSBwZWckcGFyc2VfKCk7XG4gICAgICAgICAgICAgICAgaWYgKHM3ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgICBzOCA9IHBlZyRwYXJzZWVsZW1lbnRGb3JtYXQoKTtcbiAgICAgICAgICAgICAgICAgIGlmIChzOCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgICAgICBzNiA9IFtzNiwgczcsIHM4XTtcbiAgICAgICAgICAgICAgICAgICAgczUgPSBzNjtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczU7XG4gICAgICAgICAgICAgICAgICAgIHM1ID0gcGVnJGMyO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHM1O1xuICAgICAgICAgICAgICAgICAgczUgPSBwZWckYzI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczU7XG4gICAgICAgICAgICAgICAgczUgPSBwZWckYzI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHM1ID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgczUgPSBwZWckYzk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHM1ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgczYgPSBwZWckcGFyc2VfKCk7XG4gICAgICAgICAgICAgICAgaWYgKHM2ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwZWckY3VyclBvcykgPT09IDEyNSkge1xuICAgICAgICAgICAgICAgICAgICBzNyA9IHBlZyRjMTI7XG4gICAgICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzNyA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMxMyk7IH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChzNyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgICAgICBwZWckcmVwb3J0ZWRQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICAgICAgczEgPSBwZWckYzE0KHMzLCBzNSk7XG4gICAgICAgICAgICAgICAgICAgIHMwID0gczE7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZWVsZW1lbnRGb3JtYXQoKSB7XG4gICAgICB2YXIgczA7XG5cbiAgICAgIHMwID0gcGVnJHBhcnNlc2ltcGxlRm9ybWF0KCk7XG4gICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczAgPSBwZWckcGFyc2VwbHVyYWxGb3JtYXQoKTtcbiAgICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczAgPSBwZWckcGFyc2VzZWxlY3RPcmRpbmFsRm9ybWF0KCk7XG4gICAgICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzMCA9IHBlZyRwYXJzZXNlbGVjdEZvcm1hdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlc2ltcGxlRm9ybWF0KCkge1xuICAgICAgdmFyIHMwLCBzMSwgczIsIHMzLCBzNCwgczUsIHM2O1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgNikgPT09IHBlZyRjMTUpIHtcbiAgICAgICAgczEgPSBwZWckYzE1O1xuICAgICAgICBwZWckY3VyclBvcyArPSA2O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMTYpOyB9XG4gICAgICB9XG4gICAgICBpZiAoczEgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgNCkgPT09IHBlZyRjMTcpIHtcbiAgICAgICAgICBzMSA9IHBlZyRjMTc7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgKz0gNDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzE4KTsgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzMSA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDQpID09PSBwZWckYzE5KSB7XG4gICAgICAgICAgICBzMSA9IHBlZyRjMTk7XG4gICAgICAgICAgICBwZWckY3VyclBvcyArPSA0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMjApOyB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczIgPSBwZWckcGFyc2VfKCk7XG4gICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMzID0gcGVnJGN1cnJQb3M7XG4gICAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocGVnJGN1cnJQb3MpID09PSA0NCkge1xuICAgICAgICAgICAgczQgPSBwZWckYzEwO1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgczQgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzExKTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoczQgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHM1ID0gcGVnJHBhcnNlXygpO1xuICAgICAgICAgICAgaWYgKHM1ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgIHM2ID0gcGVnJHBhcnNlY2hhcnMoKTtcbiAgICAgICAgICAgICAgaWYgKHM2ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgczQgPSBbczQsIHM1LCBzNl07XG4gICAgICAgICAgICAgICAgczMgPSBzNDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMzO1xuICAgICAgICAgICAgICAgIHMzID0gcGVnJGMyO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMzO1xuICAgICAgICAgICAgICBzMyA9IHBlZyRjMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMztcbiAgICAgICAgICAgIHMzID0gcGVnJGMyO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoczMgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHMzID0gcGVnJGM5O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICAgICAgczEgPSBwZWckYzIxKHMxLCBzMyk7XG4gICAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlcGx1cmFsRm9ybWF0KCkge1xuICAgICAgdmFyIHMwLCBzMSwgczIsIHMzLCBzNCwgczU7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCA2KSA9PT0gcGVnJGMyMikge1xuICAgICAgICBzMSA9IHBlZyRjMjI7XG4gICAgICAgIHBlZyRjdXJyUG9zICs9IDY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMyMyk7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMiA9IHBlZyRwYXJzZV8oKTtcbiAgICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocGVnJGN1cnJQb3MpID09PSA0NCkge1xuICAgICAgICAgICAgczMgPSBwZWckYzEwO1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgczMgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzExKTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHM0ID0gcGVnJHBhcnNlXygpO1xuICAgICAgICAgICAgaWYgKHM0ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgIHM1ID0gcGVnJHBhcnNlcGx1cmFsU3R5bGUoKTtcbiAgICAgICAgICAgICAgaWYgKHM1ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgcGVnJHJlcG9ydGVkUG9zID0gczA7XG4gICAgICAgICAgICAgICAgczEgPSBwZWckYzI0KHM1KTtcbiAgICAgICAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlc2VsZWN0T3JkaW5hbEZvcm1hdCgpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyLCBzMywgczQsIHM1O1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgMTMpID09PSBwZWckYzI1KSB7XG4gICAgICAgIHMxID0gcGVnJGMyNTtcbiAgICAgICAgcGVnJGN1cnJQb3MgKz0gMTM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMyNik7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMiA9IHBlZyRwYXJzZV8oKTtcbiAgICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocGVnJGN1cnJQb3MpID09PSA0NCkge1xuICAgICAgICAgICAgczMgPSBwZWckYzEwO1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgczMgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzExKTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHM0ID0gcGVnJHBhcnNlXygpO1xuICAgICAgICAgICAgaWYgKHM0ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgIHM1ID0gcGVnJHBhcnNlcGx1cmFsU3R5bGUoKTtcbiAgICAgICAgICAgICAgaWYgKHM1ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgcGVnJHJlcG9ydGVkUG9zID0gczA7XG4gICAgICAgICAgICAgICAgczEgPSBwZWckYzI3KHM1KTtcbiAgICAgICAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlc2VsZWN0Rm9ybWF0KCkge1xuICAgICAgdmFyIHMwLCBzMSwgczIsIHMzLCBzNCwgczUsIHM2O1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgNikgPT09IHBlZyRjMjgpIHtcbiAgICAgICAgczEgPSBwZWckYzI4O1xuICAgICAgICBwZWckY3VyclBvcyArPSA2O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMjkpOyB9XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczIgPSBwZWckcGFyc2VfKCk7XG4gICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBlZyRjdXJyUG9zKSA9PT0gNDQpIHtcbiAgICAgICAgICAgIHMzID0gcGVnJGMxMDtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHMzID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMxMSk7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHMzICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzNCA9IHBlZyRwYXJzZV8oKTtcbiAgICAgICAgICAgIGlmIChzNCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICBzNSA9IFtdO1xuICAgICAgICAgICAgICBzNiA9IHBlZyRwYXJzZW9wdGlvbmFsRm9ybWF0UGF0dGVybigpO1xuICAgICAgICAgICAgICBpZiAoczYgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAoczYgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICAgIHM1LnB1c2goczYpO1xuICAgICAgICAgICAgICAgICAgczYgPSBwZWckcGFyc2VvcHRpb25hbEZvcm1hdFBhdHRlcm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgczUgPSBwZWckYzI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHM1ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgcGVnJHJlcG9ydGVkUG9zID0gczA7XG4gICAgICAgICAgICAgICAgczEgPSBwZWckYzMwKHM1KTtcbiAgICAgICAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlc2VsZWN0b3IoKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMiwgczM7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBzMSA9IHBlZyRjdXJyUG9zO1xuICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocGVnJGN1cnJQb3MpID09PSA2MSkge1xuICAgICAgICBzMiA9IHBlZyRjMzE7XG4gICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMiA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMzMik7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMyA9IHBlZyRwYXJzZW51bWJlcigpO1xuICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMiA9IFtzMiwgczNdO1xuICAgICAgICAgIHMxID0gczI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMTtcbiAgICAgICAgICBzMSA9IHBlZyRjMjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVnJGN1cnJQb3MgPSBzMTtcbiAgICAgICAgczEgPSBwZWckYzI7XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczEgPSBpbnB1dC5zdWJzdHJpbmcoczAsIHBlZyRjdXJyUG9zKTtcbiAgICAgIH1cbiAgICAgIHMwID0gczE7XG4gICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczAgPSBwZWckcGFyc2VjaGFycygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlb3B0aW9uYWxGb3JtYXRQYXR0ZXJuKCkge1xuICAgICAgdmFyIHMwLCBzMSwgczIsIHMzLCBzNCwgczUsIHM2LCBzNywgczg7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBzMSA9IHBlZyRwYXJzZV8oKTtcbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMiA9IHBlZyRwYXJzZXNlbGVjdG9yKCk7XG4gICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMzID0gcGVnJHBhcnNlXygpO1xuICAgICAgICAgIGlmIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocGVnJGN1cnJQb3MpID09PSAxMjMpIHtcbiAgICAgICAgICAgICAgczQgPSBwZWckYzc7XG4gICAgICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzNCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM4KTsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHM0ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgIHM1ID0gcGVnJHBhcnNlXygpO1xuICAgICAgICAgICAgICBpZiAoczUgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICBzNiA9IHBlZyRwYXJzZW1lc3NhZ2VGb3JtYXRQYXR0ZXJuKCk7XG4gICAgICAgICAgICAgICAgaWYgKHM2ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgICBzNyA9IHBlZyRwYXJzZV8oKTtcbiAgICAgICAgICAgICAgICAgIGlmIChzNyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwZWckY3VyclBvcykgPT09IDEyNSkge1xuICAgICAgICAgICAgICAgICAgICAgIHM4ID0gcGVnJGMxMjtcbiAgICAgICAgICAgICAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIHM4ID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMTMpOyB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHM4ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcGVnJHJlcG9ydGVkUG9zID0gczA7XG4gICAgICAgICAgICAgICAgICAgICAgczEgPSBwZWckYzMzKHMyLCBzNik7XG4gICAgICAgICAgICAgICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZW9mZnNldCgpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyLCBzMztcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDcpID09PSBwZWckYzM0KSB7XG4gICAgICAgIHMxID0gcGVnJGMzNDtcbiAgICAgICAgcGVnJGN1cnJQb3MgKz0gNztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzM1KTsgfVxuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMyID0gcGVnJHBhcnNlXygpO1xuICAgICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMyA9IHBlZyRwYXJzZW51bWJlcigpO1xuICAgICAgICAgIGlmIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgcGVnJHJlcG9ydGVkUG9zID0gczA7XG4gICAgICAgICAgICBzMSA9IHBlZyRjMzYoczMpO1xuICAgICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZXBsdXJhbFN0eWxlKCkge1xuICAgICAgdmFyIHMwLCBzMSwgczIsIHMzLCBzNDtcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIHMxID0gcGVnJHBhcnNlb2Zmc2V0KCk7XG4gICAgICBpZiAoczEgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczEgPSBwZWckYzk7XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczIgPSBwZWckcGFyc2VfKCk7XG4gICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMzID0gW107XG4gICAgICAgICAgczQgPSBwZWckcGFyc2VvcHRpb25hbEZvcm1hdFBhdHRlcm4oKTtcbiAgICAgICAgICBpZiAoczQgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHdoaWxlIChzNCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICBzMy5wdXNoKHM0KTtcbiAgICAgICAgICAgICAgczQgPSBwZWckcGFyc2VvcHRpb25hbEZvcm1hdFBhdHRlcm4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgczMgPSBwZWckYzI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgcGVnJHJlcG9ydGVkUG9zID0gczA7XG4gICAgICAgICAgICBzMSA9IHBlZyRjMzcoczEsIHMzKTtcbiAgICAgICAgICAgIHMwID0gczE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICBzMCA9IHBlZyRjMjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2V3cygpIHtcbiAgICAgIHZhciBzMCwgczE7XG5cbiAgICAgIHBlZyRzaWxlbnRGYWlscysrO1xuICAgICAgczAgPSBbXTtcbiAgICAgIGlmIChwZWckYzM5LnRlc3QoaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKSkpIHtcbiAgICAgICAgczEgPSBpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpO1xuICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNDApOyB9XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgd2hpbGUgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczAucHVzaChzMSk7XG4gICAgICAgICAgaWYgKHBlZyRjMzkudGVzdChpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpKSkge1xuICAgICAgICAgICAgczEgPSBpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpO1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzQwKTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICB9XG4gICAgICBwZWckc2lsZW50RmFpbHMtLTtcbiAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMzOCk7IH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZV8oKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMjtcblxuICAgICAgcGVnJHNpbGVudEZhaWxzKys7XG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgczEgPSBbXTtcbiAgICAgIHMyID0gcGVnJHBhcnNld3MoKTtcbiAgICAgIHdoaWxlIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMS5wdXNoKHMyKTtcbiAgICAgICAgczIgPSBwZWckcGFyc2V3cygpO1xuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMxID0gaW5wdXQuc3Vic3RyaW5nKHMwLCBwZWckY3VyclBvcyk7XG4gICAgICB9XG4gICAgICBzMCA9IHMxO1xuICAgICAgcGVnJHNpbGVudEZhaWxzLS07XG4gICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNDEpOyB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VkaWdpdCgpIHtcbiAgICAgIHZhciBzMDtcblxuICAgICAgaWYgKHBlZyRjNDIudGVzdChpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpKSkge1xuICAgICAgICBzMCA9IGlucHV0LmNoYXJBdChwZWckY3VyclBvcyk7XG4gICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM0Myk7IH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZWhleERpZ2l0KCkge1xuICAgICAgdmFyIHMwO1xuXG4gICAgICBpZiAocGVnJGM0NC50ZXN0KGlucHV0LmNoYXJBdChwZWckY3VyclBvcykpKSB7XG4gICAgICAgIHMwID0gaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKTtcbiAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMwID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzQ1KTsgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlbnVtYmVyKCkge1xuICAgICAgdmFyIHMwLCBzMSwgczIsIHMzLCBzNCwgczU7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwZWckY3VyclBvcykgPT09IDQ4KSB7XG4gICAgICAgIHMxID0gcGVnJGM0NjtcbiAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzQ3KTsgfVxuICAgICAgfVxuICAgICAgaWYgKHMxID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMxID0gcGVnJGN1cnJQb3M7XG4gICAgICAgIHMyID0gcGVnJGN1cnJQb3M7XG4gICAgICAgIGlmIChwZWckYzQ4LnRlc3QoaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKSkpIHtcbiAgICAgICAgICBzMyA9IGlucHV0LmNoYXJBdChwZWckY3VyclBvcyk7XG4gICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzMyA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzQ5KTsgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHM0ID0gW107XG4gICAgICAgICAgczUgPSBwZWckcGFyc2VkaWdpdCgpO1xuICAgICAgICAgIHdoaWxlIChzNSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgczQucHVzaChzNSk7XG4gICAgICAgICAgICBzNSA9IHBlZyRwYXJzZWRpZ2l0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzNCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgczMgPSBbczMsIHM0XTtcbiAgICAgICAgICAgIHMyID0gczM7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczI7XG4gICAgICAgICAgICBzMiA9IHBlZyRjMjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMjtcbiAgICAgICAgICBzMiA9IHBlZyRjMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMiA9IGlucHV0LnN1YnN0cmluZyhzMSwgcGVnJGN1cnJQb3MpO1xuICAgICAgICB9XG4gICAgICAgIHMxID0gczI7XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgcGVnJHJlcG9ydGVkUG9zID0gczA7XG4gICAgICAgIHMxID0gcGVnJGM1MChzMSk7XG4gICAgICB9XG4gICAgICBzMCA9IHMxO1xuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlY2hhcigpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyLCBzMywgczQsIHM1LCBzNiwgczc7XG5cbiAgICAgIGlmIChwZWckYzUxLnRlc3QoaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKSkpIHtcbiAgICAgICAgczAgPSBpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpO1xuICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczAgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNTIpOyB9XG4gICAgICB9XG4gICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgMikgPT09IHBlZyRjNTMpIHtcbiAgICAgICAgICBzMSA9IHBlZyRjNTM7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgKz0gMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzU0KTsgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICAgIHMxID0gcGVnJGM1NSgpO1xuICAgICAgICB9XG4gICAgICAgIHMwID0gczE7XG4gICAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgMikgPT09IHBlZyRjNTYpIHtcbiAgICAgICAgICAgIHMxID0gcGVnJGM1NjtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zICs9IDI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM1Nyk7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBwZWckcmVwb3J0ZWRQb3MgPSBzMDtcbiAgICAgICAgICAgIHMxID0gcGVnJGM1OCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgICAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDIpID09PSBwZWckYzU5KSB7XG4gICAgICAgICAgICAgIHMxID0gcGVnJGM1OTtcbiAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgKz0gMjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzYwKTsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICAgICAgICBzMSA9IHBlZyRjNjEoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHMwID0gczE7XG4gICAgICAgICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgICAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgMikgPT09IHBlZyRjNjIpIHtcbiAgICAgICAgICAgICAgICBzMSA9IHBlZyRjNjI7XG4gICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgKz0gMjtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzYzKTsgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICAgICAgICAgIHMxID0gcGVnJGM2NCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHMwID0gczE7XG4gICAgICAgICAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgMikgPT09IHBlZyRjNjUpIHtcbiAgICAgICAgICAgICAgICAgIHMxID0gcGVnJGM2NTtcbiAgICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zICs9IDI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM2Nik7IH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgICBzMiA9IHBlZyRjdXJyUG9zO1xuICAgICAgICAgICAgICAgICAgczMgPSBwZWckY3VyclBvcztcbiAgICAgICAgICAgICAgICAgIHM0ID0gcGVnJHBhcnNlaGV4RGlnaXQoKTtcbiAgICAgICAgICAgICAgICAgIGlmIChzNCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgICAgICBzNSA9IHBlZyRwYXJzZWhleERpZ2l0KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzNSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgICAgICAgIHM2ID0gcGVnJHBhcnNlaGV4RGlnaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoczYgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHM3ID0gcGVnJHBhcnNlaGV4RGlnaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzNyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBzNCA9IFtzNCwgczUsIHM2LCBzN107XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHMzID0gczQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBzMyA9IHBlZyRjMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMztcbiAgICAgICAgICAgICAgICAgICAgICAgIHMzID0gcGVnJGMyO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMzO1xuICAgICAgICAgICAgICAgICAgICAgIHMzID0gcGVnJGMyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMzO1xuICAgICAgICAgICAgICAgICAgICBzMyA9IHBlZyRjMjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgICAgICBzMyA9IGlucHV0LnN1YnN0cmluZyhzMiwgcGVnJGN1cnJQb3MpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgczIgPSBzMztcbiAgICAgICAgICAgICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgICAgICBwZWckcmVwb3J0ZWRQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICAgICAgczEgPSBwZWckYzY3KHMyKTtcbiAgICAgICAgICAgICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgICAgICAgIHMwID0gcGVnJGMyO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICAgICAgczAgPSBwZWckYzI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VjaGFycygpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyO1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgczEgPSBbXTtcbiAgICAgIHMyID0gcGVnJHBhcnNlY2hhcigpO1xuICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHdoaWxlIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMxLnB1c2goczIpO1xuICAgICAgICAgIHMyID0gcGVnJHBhcnNlY2hhcigpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMSA9IHBlZyRjMjtcbiAgICAgIH1cbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBwZWckcmVwb3J0ZWRQb3MgPSBzMDtcbiAgICAgICAgczEgPSBwZWckYzY4KHMxKTtcbiAgICAgIH1cbiAgICAgIHMwID0gczE7XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBwZWckcmVzdWx0ID0gcGVnJHN0YXJ0UnVsZUZ1bmN0aW9uKCk7XG5cbiAgICBpZiAocGVnJHJlc3VsdCAhPT0gcGVnJEZBSUxFRCAmJiBwZWckY3VyclBvcyA9PT0gaW5wdXQubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gcGVnJHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHBlZyRyZXN1bHQgIT09IHBlZyRGQUlMRUQgJiYgcGVnJGN1cnJQb3MgPCBpbnB1dC5sZW5ndGgpIHtcbiAgICAgICAgcGVnJGZhaWwoeyB0eXBlOiBcImVuZFwiLCBkZXNjcmlwdGlvbjogXCJlbmQgb2YgaW5wdXRcIiB9KTtcbiAgICAgIH1cblxuICAgICAgdGhyb3cgcGVnJGJ1aWxkRXhjZXB0aW9uKG51bGwsIHBlZyRtYXhGYWlsRXhwZWN0ZWQsIHBlZyRtYXhGYWlsUG9zKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIFN5bnRheEVycm9yOiBTeW50YXhFcnJvcixcbiAgICBwYXJzZTogICAgICAgcGFyc2VcbiAgfTtcbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhcnNlci5qcy5tYXAiLCIvLyBFeHBvc2UgYEludGxQb2x5ZmlsbGAgYXMgZ2xvYmFsIHRvIGFkZCBsb2NhbGUgZGF0YSBpbnRvIHJ1bnRpbWUgbGF0ZXIgb24uXG5nbG9iYWwuSW50bFBvbHlmaWxsID0gcmVxdWlyZSgnLi9saWIvY29yZS5qcycpO1xuXG4vLyBSZXF1aXJlIGFsbCBsb2NhbGUgZGF0YSBmb3IgYEludGxgLiBUaGlzIG1vZHVsZSB3aWxsIGJlXG4vLyBpZ25vcmVkIHdoZW4gYnVuZGxpbmcgZm9yIHRoZSBicm93c2VyIHdpdGggQnJvd3NlcmlmeS9XZWJwYWNrLlxucmVxdWlyZSgnLi9sb2NhbGUtZGF0YS9jb21wbGV0ZS5qcycpO1xuXG4vLyBoYWNrIHRvIGV4cG9ydCB0aGUgcG9seWZpbGwgYXMgZ2xvYmFsIEludGwgaWYgbmVlZGVkXG5pZiAoIWdsb2JhbC5JbnRsKSB7XG4gICAgZ2xvYmFsLkludGwgPSBnbG9iYWwuSW50bFBvbHlmaWxsO1xuICAgIGdsb2JhbC5JbnRsUG9seWZpbGwuX19hcHBseUxvY2FsZVNlbnNpdGl2ZVByb3RvdHlwZXMoKTtcbn1cblxuLy8gcHJvdmlkaW5nIGFuIGlkaW9tYXRpYyBhcGkgZm9yIHRoZSBub2RlanMgdmVyc2lvbiBvZiB0aGlzIG1vZHVsZVxubW9kdWxlLmV4cG9ydHMgPSBnbG9iYWwuSW50bFBvbHlmaWxsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFiZWxIZWxwZXJzID0ge307XG5iYWJlbEhlbHBlcnMudHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqO1xufSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbn07XG5iYWJlbEhlbHBlcnM7XG5cbnZhciByZWFsRGVmaW5lUHJvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VudGluZWwgPSB7fTtcbiAgICB0cnkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2VudGluZWwsICdhJywge30pO1xuICAgICAgICByZXR1cm4gJ2EnIGluIHNlbnRpbmVsO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn0oKTtcblxuLy8gTmVlZCBhIHdvcmthcm91bmQgZm9yIGdldHRlcnMgaW4gRVMzXG52YXIgZXMzID0gIXJlYWxEZWZpbmVQcm9wICYmICFPYmplY3QucHJvdG90eXBlLl9fZGVmaW5lR2V0dGVyX187XG5cbi8vIFdlIHVzZSB0aGlzIGEgbG90IChhbmQgbmVlZCBpdCBmb3IgcHJvdG8tbGVzcyBvYmplY3RzKVxudmFyIGhvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8vIE5haXZlIGRlZmluZVByb3BlcnR5IGZvciBjb21wYXRpYmlsaXR5XG52YXIgZGVmaW5lUHJvcGVydHkgPSByZWFsRGVmaW5lUHJvcCA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIChvYmosIG5hbWUsIGRlc2MpIHtcbiAgICBpZiAoJ2dldCcgaW4gZGVzYyAmJiBvYmouX19kZWZpbmVHZXR0ZXJfXykgb2JqLl9fZGVmaW5lR2V0dGVyX18obmFtZSwgZGVzYy5nZXQpO2Vsc2UgaWYgKCFob3AuY2FsbChvYmosIG5hbWUpIHx8ICd2YWx1ZScgaW4gZGVzYykgb2JqW25hbWVdID0gZGVzYy52YWx1ZTtcbn07XG5cbi8vIEFycmF5LnByb3RvdHlwZS5pbmRleE9mLCBhcyBnb29kIGFzIHdlIG5lZWQgaXQgdG8gYmVcbnZhciBhcnJJbmRleE9mID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YgfHwgZnVuY3Rpb24gKHNlYXJjaCkge1xuICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgdmFyIHQgPSB0aGlzO1xuICAgIGlmICghdC5sZW5ndGgpIHJldHVybiAtMTtcblxuICAgIGZvciAodmFyIGkgPSBhcmd1bWVudHNbMV0gfHwgMCwgbWF4ID0gdC5sZW5ndGg7IGkgPCBtYXg7IGkrKykge1xuICAgICAgICBpZiAodFtpXSA9PT0gc2VhcmNoKSByZXR1cm4gaTtcbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG59O1xuXG4vLyBDcmVhdGUgYW4gb2JqZWN0IHdpdGggdGhlIHNwZWNpZmllZCBwcm90b3R5cGUgKDJuZCBhcmcgcmVxdWlyZWQgZm9yIFJlY29yZClcbnZhciBvYmpDcmVhdGUgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIChwcm90bywgcHJvcHMpIHtcbiAgICB2YXIgb2JqID0gdm9pZCAwO1xuXG4gICAgZnVuY3Rpb24gRigpIHt9XG4gICAgRi5wcm90b3R5cGUgPSBwcm90bztcbiAgICBvYmogPSBuZXcgRigpO1xuXG4gICAgZm9yICh2YXIgayBpbiBwcm9wcykge1xuICAgICAgICBpZiAoaG9wLmNhbGwocHJvcHMsIGspKSBkZWZpbmVQcm9wZXJ0eShvYmosIGssIHByb3BzW2tdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxuLy8gU25hcHNob3Qgc29tZSAoaG9wZWZ1bGx5IHN0aWxsKSBuYXRpdmUgYnVpbHQtaW5zXG52YXIgYXJyU2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG52YXIgYXJyQ29uY2F0ID0gQXJyYXkucHJvdG90eXBlLmNvbmNhdDtcbnZhciBhcnJQdXNoID0gQXJyYXkucHJvdG90eXBlLnB1c2g7XG52YXIgYXJySm9pbiA9IEFycmF5LnByb3RvdHlwZS5qb2luO1xudmFyIGFyclNoaWZ0ID0gQXJyYXkucHJvdG90eXBlLnNoaWZ0O1xuXG4vLyBOYWl2ZSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBmb3IgY29tcGF0aWJpbGl0eVxudmFyIGZuQmluZCA9IEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIHx8IGZ1bmN0aW9uICh0aGlzT2JqKSB7XG4gICAgdmFyIGZuID0gdGhpcyxcbiAgICAgICAgYXJncyA9IGFyclNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIC8vIEFsbCBvdXIgKHByZXNlbnRseSkgYm91bmQgZnVuY3Rpb25zIGhhdmUgZWl0aGVyIDEgb3IgMCBhcmd1bWVudHMuIEJ5IHJldHVybmluZ1xuICAgIC8vIGRpZmZlcmVudCBmdW5jdGlvbiBzaWduYXR1cmVzLCB3ZSBjYW4gcGFzcyBzb21lIHRlc3RzIGluIEVTMyBlbnZpcm9ubWVudHNcbiAgICBpZiAoZm4ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpc09iaiwgYXJyQ29uY2F0LmNhbGwoYXJncywgYXJyU2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzT2JqLCBhcnJDb25jYXQuY2FsbChhcmdzLCBhcnJTbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9O1xufTtcblxuLy8gT2JqZWN0IGhvdXNpbmcgaW50ZXJuYWwgcHJvcGVydGllcyBmb3IgY29uc3RydWN0b3JzXG52YXIgaW50ZXJuYWxzID0gb2JqQ3JlYXRlKG51bGwpO1xuXG4vLyBLZWVwIGludGVybmFsIHByb3BlcnRpZXMgaW50ZXJuYWxcbnZhciBzZWNyZXQgPSBNYXRoLnJhbmRvbSgpO1xuXG4vLyBIZWxwZXIgZnVuY3Rpb25zXG4vLyA9PT09PT09PT09PT09PT09XG5cbi8qKlxuICogQSBmdW5jdGlvbiB0byBkZWFsIHdpdGggdGhlIGluYWNjdXJhY3kgb2YgY2FsY3VsYXRpbmcgbG9nMTAgaW4gcHJlLUVTNlxuICogSmF2YVNjcmlwdCBlbnZpcm9ubWVudHMuIE1hdGgubG9nKG51bSkgLyBNYXRoLkxOMTAgd2FzIHJlc3BvbnNpYmxlIGZvclxuICogY2F1c2luZyBpc3N1ZSAjNjIuXG4gKi9cbmZ1bmN0aW9uIGxvZzEwRmxvb3Iobikge1xuICAgIC8vIEVTNiBwcm92aWRlcyB0aGUgbW9yZSBhY2N1cmF0ZSBNYXRoLmxvZzEwXG4gICAgaWYgKHR5cGVvZiBNYXRoLmxvZzEwID09PSAnZnVuY3Rpb24nKSByZXR1cm4gTWF0aC5mbG9vcihNYXRoLmxvZzEwKG4pKTtcblxuICAgIHZhciB4ID0gTWF0aC5yb3VuZChNYXRoLmxvZyhuKSAqIE1hdGguTE9HMTBFKTtcbiAgICByZXR1cm4geCAtIChOdW1iZXIoJzFlJyArIHgpID4gbik7XG59XG5cbi8qKlxuICogQSBtYXAgdGhhdCBkb2Vzbid0IGNvbnRhaW4gT2JqZWN0IGluIGl0cyBwcm90b3R5cGUgY2hhaW5cbiAqL1xuZnVuY3Rpb24gUmVjb3JkKG9iaikge1xuICAgIC8vIENvcHkgb25seSBvd24gcHJvcGVydGllcyBvdmVyIHVubGVzcyB0aGlzIG9iamVjdCBpcyBhbHJlYWR5IGEgUmVjb3JkIGluc3RhbmNlXG4gICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIFJlY29yZCB8fCBob3AuY2FsbChvYmosIGspKSBkZWZpbmVQcm9wZXJ0eSh0aGlzLCBrLCB7IHZhbHVlOiBvYmpba10sIGVudW1lcmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSk7XG4gICAgfVxufVxuUmVjb3JkLnByb3RvdHlwZSA9IG9iakNyZWF0ZShudWxsKTtcblxuLyoqXG4gKiBBbiBvcmRlcmVkIGxpc3RcbiAqL1xuZnVuY3Rpb24gTGlzdCgpIHtcbiAgICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbGVuZ3RoJywgeyB3cml0YWJsZTogdHJ1ZSwgdmFsdWU6IDAgfSk7XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCkgYXJyUHVzaC5hcHBseSh0aGlzLCBhcnJTbGljZS5jYWxsKGFyZ3VtZW50cykpO1xufVxuTGlzdC5wcm90b3R5cGUgPSBvYmpDcmVhdGUobnVsbCk7XG5cbi8qKlxuICogQ29uc3RydWN0cyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byByZXN0b3JlIHRhaW50ZWQgUmVnRXhwIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlUmVnRXhwUmVzdG9yZSgpIHtcbiAgICB2YXIgZXNjID0gL1suPyorXiRbXFxdXFxcXCgpe318LV0vZyxcbiAgICAgICAgbG0gPSBSZWdFeHAubGFzdE1hdGNoIHx8ICcnLFxuICAgICAgICBtbCA9IFJlZ0V4cC5tdWx0aWxpbmUgPyAnbScgOiAnJyxcbiAgICAgICAgcmV0ID0geyBpbnB1dDogUmVnRXhwLmlucHV0IH0sXG4gICAgICAgIHJlZyA9IG5ldyBMaXN0KCksXG4gICAgICAgIGhhcyA9IGZhbHNlLFxuICAgICAgICBjYXAgPSB7fTtcblxuICAgIC8vIENyZWF0ZSBhIHNuYXBzaG90IG9mIGFsbCB0aGUgJ2NhcHR1cmVkJyBwcm9wZXJ0aWVzXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gOTsgaSsrKSB7XG4gICAgICAgIGhhcyA9IChjYXBbJyQnICsgaV0gPSBSZWdFeHBbJyQnICsgaV0pIHx8IGhhcztcbiAgICB9IC8vIE5vdyB3ZSd2ZSBzbmFwc2hvdHRlZCBzb21lIHByb3BlcnRpZXMsIGVzY2FwZSB0aGUgbGFzdE1hdGNoIHN0cmluZ1xuICAgIGxtID0gbG0ucmVwbGFjZShlc2MsICdcXFxcJCYnKTtcblxuICAgIC8vIElmIGFueSBvZiB0aGUgY2FwdHVyZWQgc3RyaW5ncyB3ZXJlIG5vbi1lbXB0eSwgaXRlcmF0ZSBvdmVyIHRoZW0gYWxsXG4gICAgaWYgKGhhcykge1xuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDw9IDk7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBtID0gY2FwWyckJyArIF9pXTtcblxuICAgICAgICAgICAgLy8gSWYgaXQncyBlbXB0eSwgYWRkIGFuIGVtcHR5IGNhcHR1cmluZyBncm91cFxuICAgICAgICAgICAgaWYgKCFtKSBsbSA9ICcoKScgKyBsbTtcblxuICAgICAgICAgICAgLy8gRWxzZSBmaW5kIHRoZSBzdHJpbmcgaW4gbG0gYW5kIGVzY2FwZSAmIHdyYXAgaXQgdG8gY2FwdHVyZSBpdFxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG0gPSBtLnJlcGxhY2UoZXNjLCAnXFxcXCQmJyk7XG4gICAgICAgICAgICAgICAgICAgIGxtID0gbG0ucmVwbGFjZShtLCAnKCcgKyBtICsgJyknKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFB1c2ggaXQgdG8gdGhlIHJlZyBhbmQgY2hvcCBsbSB0byBtYWtlIHN1cmUgZnVydGhlciBncm91cHMgY29tZSBhZnRlclxuICAgICAgICAgICAgYXJyUHVzaC5jYWxsKHJlZywgbG0uc2xpY2UoMCwgbG0uaW5kZXhPZignKCcpICsgMSkpO1xuICAgICAgICAgICAgbG0gPSBsbS5zbGljZShsbS5pbmRleE9mKCcoJykgKyAxKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIENyZWF0ZSB0aGUgcmVndWxhciBleHByZXNzaW9uIHRoYXQgd2lsbCByZWNvbnN0cnVjdCB0aGUgUmVnRXhwIHByb3BlcnRpZXNcbiAgICByZXQuZXhwID0gbmV3IFJlZ0V4cChhcnJKb2luLmNhbGwocmVnLCAnJykgKyBsbSwgbWwpO1xuXG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBNaW1pY3MgRVM1J3MgYWJzdHJhY3QgVG9PYmplY3QoKSBmdW5jdGlvblxuICovXG5mdW5jdGlvbiB0b09iamVjdChhcmcpIHtcbiAgICBpZiAoYXJnID09PSBudWxsKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCBudWxsIG9yIHVuZGVmaW5lZCB0byBvYmplY3QnKTtcblxuICAgIHJldHVybiBPYmplY3QoYXJnKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIFwiaW50ZXJuYWxcIiBwcm9wZXJ0aWVzIGZvciBhbiBvYmplY3RcbiAqL1xuZnVuY3Rpb24gZ2V0SW50ZXJuYWxQcm9wZXJ0aWVzKG9iaikge1xuICAgIGlmIChob3AuY2FsbChvYmosICdfX2dldEludGVybmFsUHJvcGVydGllcycpKSByZXR1cm4gb2JqLl9fZ2V0SW50ZXJuYWxQcm9wZXJ0aWVzKHNlY3JldCk7XG5cbiAgICByZXR1cm4gb2JqQ3JlYXRlKG51bGwpO1xufVxuXG4vKipcbiogRGVmaW5lcyByZWd1bGFyIGV4cHJlc3Npb25zIGZvciB2YXJpb3VzIG9wZXJhdGlvbnMgcmVsYXRlZCB0byB0aGUgQkNQIDQ3IHN5bnRheCxcbiogYXMgZGVmaW5lZCBhdCBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9iY3A0NyNzZWN0aW9uLTIuMVxuKi9cblxuLy8gZXh0bGFuZyAgICAgICA9IDNBTFBIQSAgICAgICAgICAgICAgOyBzZWxlY3RlZCBJU08gNjM5IGNvZGVzXG4vLyAgICAgICAgICAgICAgICAgKjIoXCItXCIgM0FMUEhBKSAgICAgIDsgcGVybWFuZW50bHkgcmVzZXJ2ZWRcbnZhciBleHRsYW5nID0gJ1thLXpdezN9KD86LVthLXpdezN9KXswLDJ9JztcblxuLy8gbGFuZ3VhZ2UgICAgICA9IDIqM0FMUEhBICAgICAgICAgICAgOyBzaG9ydGVzdCBJU08gNjM5IGNvZGVcbi8vICAgICAgICAgICAgICAgICBbXCItXCIgZXh0bGFuZ10gICAgICAgOyBzb21ldGltZXMgZm9sbG93ZWQgYnlcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDsgZXh0ZW5kZWQgbGFuZ3VhZ2Ugc3VidGFnc1xuLy8gICAgICAgICAgICAgICAvIDRBTFBIQSAgICAgICAgICAgICAgOyBvciByZXNlcnZlZCBmb3IgZnV0dXJlIHVzZVxuLy8gICAgICAgICAgICAgICAvIDUqOEFMUEhBICAgICAgICAgICAgOyBvciByZWdpc3RlcmVkIGxhbmd1YWdlIHN1YnRhZ1xudmFyIGxhbmd1YWdlID0gJyg/OlthLXpdezIsM30oPzotJyArIGV4dGxhbmcgKyAnKT98W2Etel17NH18W2Etel17NSw4fSknO1xuXG4vLyBzY3JpcHQgICAgICAgID0gNEFMUEhBICAgICAgICAgICAgICA7IElTTyAxNTkyNCBjb2RlXG52YXIgc2NyaXB0ID0gJ1thLXpdezR9JztcblxuLy8gcmVnaW9uICAgICAgICA9IDJBTFBIQSAgICAgICAgICAgICAgOyBJU08gMzE2Ni0xIGNvZGVcbi8vICAgICAgICAgICAgICAgLyAzRElHSVQgICAgICAgICAgICAgIDsgVU4gTS40OSBjb2RlXG52YXIgcmVnaW9uID0gJyg/OlthLXpdezJ9fFxcXFxkezN9KSc7XG5cbi8vIHZhcmlhbnQgICAgICAgPSA1KjhhbHBoYW51bSAgICAgICAgIDsgcmVnaXN0ZXJlZCB2YXJpYW50c1xuLy8gICAgICAgICAgICAgICAvIChESUdJVCAzYWxwaGFudW0pXG52YXIgdmFyaWFudCA9ICcoPzpbYS16MC05XXs1LDh9fFxcXFxkW2EtejAtOV17M30pJztcblxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOyBTaW5nbGUgYWxwaGFudW1lcmljc1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOyBcInhcIiByZXNlcnZlZCBmb3IgcHJpdmF0ZSB1c2Vcbi8vIHNpbmdsZXRvbiAgICAgPSBESUdJVCAgICAgICAgICAgICAgIDsgMCAtIDlcbi8vICAgICAgICAgICAgICAgLyAleDQxLTU3ICAgICAgICAgICAgIDsgQSAtIFdcbi8vICAgICAgICAgICAgICAgLyAleDU5LTVBICAgICAgICAgICAgIDsgWSAtIFpcbi8vICAgICAgICAgICAgICAgLyAleDYxLTc3ICAgICAgICAgICAgIDsgYSAtIHdcbi8vICAgICAgICAgICAgICAgLyAleDc5LTdBICAgICAgICAgICAgIDsgeSAtIHpcbnZhciBzaW5nbGV0b24gPSAnWzAtOWEtd3ktel0nO1xuXG4vLyBleHRlbnNpb24gICAgID0gc2luZ2xldG9uIDEqKFwiLVwiICgyKjhhbHBoYW51bSkpXG52YXIgZXh0ZW5zaW9uID0gc2luZ2xldG9uICsgJyg/Oi1bYS16MC05XXsyLDh9KSsnO1xuXG4vLyBwcml2YXRldXNlICAgID0gXCJ4XCIgMSooXCItXCIgKDEqOGFscGhhbnVtKSlcbnZhciBwcml2YXRldXNlID0gJ3goPzotW2EtejAtOV17MSw4fSkrJztcblxuLy8gaXJyZWd1bGFyICAgICA9IFwiZW4tR0Itb2VkXCIgICAgICAgICA7IGlycmVndWxhciB0YWdzIGRvIG5vdCBtYXRjaFxuLy8gICAgICAgICAgICAgICAvIFwiaS1hbWlcIiAgICAgICAgICAgICA7IHRoZSAnbGFuZ3RhZycgcHJvZHVjdGlvbiBhbmRcbi8vICAgICAgICAgICAgICAgLyBcImktYm5uXCIgICAgICAgICAgICAgOyB3b3VsZCBub3Qgb3RoZXJ3aXNlIGJlXG4vLyAgICAgICAgICAgICAgIC8gXCJpLWRlZmF1bHRcIiAgICAgICAgIDsgY29uc2lkZXJlZCAnd2VsbC1mb3JtZWQnXG4vLyAgICAgICAgICAgICAgIC8gXCJpLWVub2NoaWFuXCIgICAgICAgIDsgVGhlc2UgdGFncyBhcmUgYWxsIHZhbGlkLFxuLy8gICAgICAgICAgICAgICAvIFwiaS1oYWtcIiAgICAgICAgICAgICA7IGJ1dCBtb3N0IGFyZSBkZXByZWNhdGVkXG4vLyAgICAgICAgICAgICAgIC8gXCJpLWtsaW5nb25cIiAgICAgICAgIDsgaW4gZmF2b3Igb2YgbW9yZSBtb2Rlcm5cbi8vICAgICAgICAgICAgICAgLyBcImktbHV4XCIgICAgICAgICAgICAgOyBzdWJ0YWdzIG9yIHN1YnRhZ1xuLy8gICAgICAgICAgICAgICAvIFwiaS1taW5nb1wiICAgICAgICAgICA7IGNvbWJpbmF0aW9uXG4vLyAgICAgICAgICAgICAgIC8gXCJpLW5hdmFqb1wiXG4vLyAgICAgICAgICAgICAgIC8gXCJpLXB3blwiXG4vLyAgICAgICAgICAgICAgIC8gXCJpLXRhb1wiXG4vLyAgICAgICAgICAgICAgIC8gXCJpLXRheVwiXG4vLyAgICAgICAgICAgICAgIC8gXCJpLXRzdVwiXG4vLyAgICAgICAgICAgICAgIC8gXCJzZ24tQkUtRlJcIlxuLy8gICAgICAgICAgICAgICAvIFwic2duLUJFLU5MXCJcbi8vICAgICAgICAgICAgICAgLyBcInNnbi1DSC1ERVwiXG52YXIgaXJyZWd1bGFyID0gJyg/OmVuLUdCLW9lZCcgKyAnfGktKD86YW1pfGJubnxkZWZhdWx0fGVub2NoaWFufGhha3xrbGluZ29ufGx1eHxtaW5nb3xuYXZham98cHdufHRhb3x0YXl8dHN1KScgKyAnfHNnbi0oPzpCRS1GUnxCRS1OTHxDSC1ERSkpJztcblxuLy8gcmVndWxhciAgICAgICA9IFwiYXJ0LWxvamJhblwiICAgICAgICA7IHRoZXNlIHRhZ3MgbWF0Y2ggdGhlICdsYW5ndGFnJ1xuLy8gICAgICAgICAgICAgICAvIFwiY2VsLWdhdWxpc2hcIiAgICAgICA7IHByb2R1Y3Rpb24sIGJ1dCB0aGVpciBzdWJ0YWdzXG4vLyAgICAgICAgICAgICAgIC8gXCJuby1ib2tcIiAgICAgICAgICAgIDsgYXJlIG5vdCBleHRlbmRlZCBsYW5ndWFnZVxuLy8gICAgICAgICAgICAgICAvIFwibm8tbnluXCIgICAgICAgICAgICA7IG9yIHZhcmlhbnQgc3VidGFnczogdGhlaXIgbWVhbmluZ1xuLy8gICAgICAgICAgICAgICAvIFwiemgtZ3VveXVcIiAgICAgICAgICA7IGlzIGRlZmluZWQgYnkgdGhlaXIgcmVnaXN0cmF0aW9uXG4vLyAgICAgICAgICAgICAgIC8gXCJ6aC1oYWtrYVwiICAgICAgICAgIDsgYW5kIGFsbCBvZiB0aGVzZSBhcmUgZGVwcmVjYXRlZFxuLy8gICAgICAgICAgICAgICAvIFwiemgtbWluXCIgICAgICAgICAgICA7IGluIGZhdm9yIG9mIGEgbW9yZSBtb2Rlcm5cbi8vICAgICAgICAgICAgICAgLyBcInpoLW1pbi1uYW5cIiAgICAgICAgOyBzdWJ0YWcgb3Igc2VxdWVuY2Ugb2Ygc3VidGFnc1xuLy8gICAgICAgICAgICAgICAvIFwiemgteGlhbmdcIlxudmFyIHJlZ3VsYXIgPSAnKD86YXJ0LWxvamJhbnxjZWwtZ2F1bGlzaHxuby1ib2t8bm8tbnluJyArICd8emgtKD86Z3VveXV8aGFra2F8bWlufG1pbi1uYW58eGlhbmcpKSc7XG5cbi8vIGdyYW5kZmF0aGVyZWQgPSBpcnJlZ3VsYXIgICAgICAgICAgIDsgbm9uLXJlZHVuZGFudCB0YWdzIHJlZ2lzdGVyZWRcbi8vICAgICAgICAgICAgICAgLyByZWd1bGFyICAgICAgICAgICAgIDsgZHVyaW5nIHRoZSBSRkMgMzA2NiBlcmFcbnZhciBncmFuZGZhdGhlcmVkID0gJyg/OicgKyBpcnJlZ3VsYXIgKyAnfCcgKyByZWd1bGFyICsgJyknO1xuXG4vLyBsYW5ndGFnICAgICAgID0gbGFuZ3VhZ2Vcbi8vICAgICAgICAgICAgICAgICBbXCItXCIgc2NyaXB0XVxuLy8gICAgICAgICAgICAgICAgIFtcIi1cIiByZWdpb25dXG4vLyAgICAgICAgICAgICAgICAgKihcIi1cIiB2YXJpYW50KVxuLy8gICAgICAgICAgICAgICAgICooXCItXCIgZXh0ZW5zaW9uKVxuLy8gICAgICAgICAgICAgICAgIFtcIi1cIiBwcml2YXRldXNlXVxudmFyIGxhbmd0YWcgPSBsYW5ndWFnZSArICcoPzotJyArIHNjcmlwdCArICcpPyg/Oi0nICsgcmVnaW9uICsgJyk/KD86LScgKyB2YXJpYW50ICsgJykqKD86LScgKyBleHRlbnNpb24gKyAnKSooPzotJyArIHByaXZhdGV1c2UgKyAnKT8nO1xuXG4vLyBMYW5ndWFnZS1UYWcgID0gbGFuZ3RhZyAgICAgICAgICAgICA7IG5vcm1hbCBsYW5ndWFnZSB0YWdzXG4vLyAgICAgICAgICAgICAgIC8gcHJpdmF0ZXVzZSAgICAgICAgICA7IHByaXZhdGUgdXNlIHRhZ1xuLy8gICAgICAgICAgICAgICAvIGdyYW5kZmF0aGVyZWQgICAgICAgOyBncmFuZGZhdGhlcmVkIHRhZ3NcbnZhciBleHBCQ1A0N1N5bnRheCA9IFJlZ0V4cCgnXig/OicgKyBsYW5ndGFnICsgJ3wnICsgcHJpdmF0ZXVzZSArICd8JyArIGdyYW5kZmF0aGVyZWQgKyAnKSQnLCAnaScpO1xuXG4vLyBNYXRjaCBkdXBsaWNhdGUgdmFyaWFudHMgaW4gYSBsYW5ndWFnZSB0YWdcbnZhciBleHBWYXJpYW50RHVwZXMgPSBSZWdFeHAoJ14oPyF4KS4qPy0oJyArIHZhcmlhbnQgKyAnKS0oPzpcXFxcd3s0LDh9LSg/IXgtKSkqXFxcXDFcXFxcYicsICdpJyk7XG5cbi8vIE1hdGNoIGR1cGxpY2F0ZSBzaW5nbGV0b25zIGluIGEgbGFuZ3VhZ2UgdGFnIChleGNlcHQgaW4gcHJpdmF0ZSB1c2UpXG52YXIgZXhwU2luZ2xldG9uRHVwZXMgPSBSZWdFeHAoJ14oPyF4KS4qPy0oJyArIHNpbmdsZXRvbiArICcpLSg/OlxcXFx3Ky0oPyF4LSkpKlxcXFwxXFxcXGInLCAnaScpO1xuXG4vLyBNYXRjaCBhbGwgZXh0ZW5zaW9uIHNlcXVlbmNlc1xudmFyIGV4cEV4dFNlcXVlbmNlcyA9IFJlZ0V4cCgnLScgKyBleHRlbnNpb24sICdpZycpO1xuXG4vLyBEZWZhdWx0IGxvY2FsZSBpcyB0aGUgZmlyc3QtYWRkZWQgbG9jYWxlIGRhdGEgZm9yIHVzXG52YXIgZGVmYXVsdExvY2FsZSA9IHZvaWQgMDtcbmZ1bmN0aW9uIHNldERlZmF1bHRMb2NhbGUobG9jYWxlKSB7XG4gICAgZGVmYXVsdExvY2FsZSA9IGxvY2FsZTtcbn1cblxuLy8gSUFOQSBTdWJ0YWcgUmVnaXN0cnkgcmVkdW5kYW50IHRhZyBhbmQgc3VidGFnIG1hcHNcbnZhciByZWR1bmRhbnRUYWdzID0ge1xuICAgIHRhZ3M6IHtcbiAgICAgICAgXCJhcnQtbG9qYmFuXCI6IFwiamJvXCIsXG4gICAgICAgIFwiaS1hbWlcIjogXCJhbWlcIixcbiAgICAgICAgXCJpLWJublwiOiBcImJublwiLFxuICAgICAgICBcImktaGFrXCI6IFwiaGFrXCIsXG4gICAgICAgIFwiaS1rbGluZ29uXCI6IFwidGxoXCIsXG4gICAgICAgIFwiaS1sdXhcIjogXCJsYlwiLFxuICAgICAgICBcImktbmF2YWpvXCI6IFwibnZcIixcbiAgICAgICAgXCJpLXB3blwiOiBcInB3blwiLFxuICAgICAgICBcImktdGFvXCI6IFwidGFvXCIsXG4gICAgICAgIFwiaS10YXlcIjogXCJ0YXlcIixcbiAgICAgICAgXCJpLXRzdVwiOiBcInRzdVwiLFxuICAgICAgICBcIm5vLWJva1wiOiBcIm5iXCIsXG4gICAgICAgIFwibm8tbnluXCI6IFwibm5cIixcbiAgICAgICAgXCJzZ24tQkUtRlJcIjogXCJzZmJcIixcbiAgICAgICAgXCJzZ24tQkUtTkxcIjogXCJ2Z3RcIixcbiAgICAgICAgXCJzZ24tQ0gtREVcIjogXCJzZ2dcIixcbiAgICAgICAgXCJ6aC1ndW95dVwiOiBcImNtblwiLFxuICAgICAgICBcInpoLWhha2thXCI6IFwiaGFrXCIsXG4gICAgICAgIFwiemgtbWluLW5hblwiOiBcIm5hblwiLFxuICAgICAgICBcInpoLXhpYW5nXCI6IFwiaHNuXCIsXG4gICAgICAgIFwic2duLUJSXCI6IFwiYnpzXCIsXG4gICAgICAgIFwic2duLUNPXCI6IFwiY3NuXCIsXG4gICAgICAgIFwic2duLURFXCI6IFwiZ3NnXCIsXG4gICAgICAgIFwic2duLURLXCI6IFwiZHNsXCIsXG4gICAgICAgIFwic2duLUVTXCI6IFwic3NwXCIsXG4gICAgICAgIFwic2duLUZSXCI6IFwiZnNsXCIsXG4gICAgICAgIFwic2duLUdCXCI6IFwiYmZpXCIsXG4gICAgICAgIFwic2duLUdSXCI6IFwiZ3NzXCIsXG4gICAgICAgIFwic2duLUlFXCI6IFwiaXNnXCIsXG4gICAgICAgIFwic2duLUlUXCI6IFwiaXNlXCIsXG4gICAgICAgIFwic2duLUpQXCI6IFwianNsXCIsXG4gICAgICAgIFwic2duLU1YXCI6IFwibWZzXCIsXG4gICAgICAgIFwic2duLU5JXCI6IFwibmNzXCIsXG4gICAgICAgIFwic2duLU5MXCI6IFwiZHNlXCIsXG4gICAgICAgIFwic2duLU5PXCI6IFwibnNsXCIsXG4gICAgICAgIFwic2duLVBUXCI6IFwicHNyXCIsXG4gICAgICAgIFwic2duLVNFXCI6IFwic3dsXCIsXG4gICAgICAgIFwic2duLVVTXCI6IFwiYXNlXCIsXG4gICAgICAgIFwic2duLVpBXCI6IFwic2ZzXCIsXG4gICAgICAgIFwiemgtY21uXCI6IFwiY21uXCIsXG4gICAgICAgIFwiemgtY21uLUhhbnNcIjogXCJjbW4tSGFuc1wiLFxuICAgICAgICBcInpoLWNtbi1IYW50XCI6IFwiY21uLUhhbnRcIixcbiAgICAgICAgXCJ6aC1nYW5cIjogXCJnYW5cIixcbiAgICAgICAgXCJ6aC13dXVcIjogXCJ3dXVcIixcbiAgICAgICAgXCJ6aC15dWVcIjogXCJ5dWVcIlxuICAgIH0sXG4gICAgc3VidGFnczoge1xuICAgICAgICBCVTogXCJNTVwiLFxuICAgICAgICBERDogXCJERVwiLFxuICAgICAgICBGWDogXCJGUlwiLFxuICAgICAgICBUUDogXCJUTFwiLFxuICAgICAgICBZRDogXCJZRVwiLFxuICAgICAgICBaUjogXCJDRFwiLFxuICAgICAgICBoZXBsb2M6IFwiYWxhbGM5N1wiLFxuICAgICAgICAnaW4nOiBcImlkXCIsXG4gICAgICAgIGl3OiBcImhlXCIsXG4gICAgICAgIGppOiBcInlpXCIsXG4gICAgICAgIGp3OiBcImp2XCIsXG4gICAgICAgIG1vOiBcInJvXCIsXG4gICAgICAgIGF5eDogXCJudW5cIixcbiAgICAgICAgYmpkOiBcImRybFwiLFxuICAgICAgICBjY3E6IFwicmtpXCIsXG4gICAgICAgIGNqcjogXCJtb21cIixcbiAgICAgICAgY2thOiBcImNtclwiLFxuICAgICAgICBjbWs6IFwieGNoXCIsXG4gICAgICAgIGRyaDogXCJraGtcIixcbiAgICAgICAgZHJ3OiBcInByc1wiLFxuICAgICAgICBnYXY6IFwiZGV2XCIsXG4gICAgICAgIGhycjogXCJqYWxcIixcbiAgICAgICAgaWJpOiBcIm9wYVwiLFxuICAgICAgICBrZ2g6IFwia21sXCIsXG4gICAgICAgIGxjcTogXCJwcHJcIixcbiAgICAgICAgbXN0OiBcIm1yeVwiLFxuICAgICAgICBteXQ6IFwibXJ5XCIsXG4gICAgICAgIHNjYTogXCJobGVcIixcbiAgICAgICAgdGllOiBcInJhc1wiLFxuICAgICAgICB0a2s6IFwidHdtXCIsXG4gICAgICAgIHRsdzogXCJ3ZW9cIixcbiAgICAgICAgdG5mOiBcInByc1wiLFxuICAgICAgICB5YmQ6IFwicmtpXCIsXG4gICAgICAgIHltYTogXCJscnJcIlxuICAgIH0sXG4gICAgZXh0TGFuZzoge1xuICAgICAgICBhYW86IFtcImFhb1wiLCBcImFyXCJdLFxuICAgICAgICBhYmg6IFtcImFiaFwiLCBcImFyXCJdLFxuICAgICAgICBhYnY6IFtcImFidlwiLCBcImFyXCJdLFxuICAgICAgICBhY206IFtcImFjbVwiLCBcImFyXCJdLFxuICAgICAgICBhY3E6IFtcImFjcVwiLCBcImFyXCJdLFxuICAgICAgICBhY3c6IFtcImFjd1wiLCBcImFyXCJdLFxuICAgICAgICBhY3g6IFtcImFjeFwiLCBcImFyXCJdLFxuICAgICAgICBhY3k6IFtcImFjeVwiLCBcImFyXCJdLFxuICAgICAgICBhZGY6IFtcImFkZlwiLCBcImFyXCJdLFxuICAgICAgICBhZHM6IFtcImFkc1wiLCBcInNnblwiXSxcbiAgICAgICAgYWViOiBbXCJhZWJcIiwgXCJhclwiXSxcbiAgICAgICAgYWVjOiBbXCJhZWNcIiwgXCJhclwiXSxcbiAgICAgICAgYWVkOiBbXCJhZWRcIiwgXCJzZ25cIl0sXG4gICAgICAgIGFlbjogW1wiYWVuXCIsIFwic2duXCJdLFxuICAgICAgICBhZmI6IFtcImFmYlwiLCBcImFyXCJdLFxuICAgICAgICBhZmc6IFtcImFmZ1wiLCBcInNnblwiXSxcbiAgICAgICAgYWpwOiBbXCJhanBcIiwgXCJhclwiXSxcbiAgICAgICAgYXBjOiBbXCJhcGNcIiwgXCJhclwiXSxcbiAgICAgICAgYXBkOiBbXCJhcGRcIiwgXCJhclwiXSxcbiAgICAgICAgYXJiOiBbXCJhcmJcIiwgXCJhclwiXSxcbiAgICAgICAgYXJxOiBbXCJhcnFcIiwgXCJhclwiXSxcbiAgICAgICAgYXJzOiBbXCJhcnNcIiwgXCJhclwiXSxcbiAgICAgICAgYXJ5OiBbXCJhcnlcIiwgXCJhclwiXSxcbiAgICAgICAgYXJ6OiBbXCJhcnpcIiwgXCJhclwiXSxcbiAgICAgICAgYXNlOiBbXCJhc2VcIiwgXCJzZ25cIl0sXG4gICAgICAgIGFzZjogW1wiYXNmXCIsIFwic2duXCJdLFxuICAgICAgICBhc3A6IFtcImFzcFwiLCBcInNnblwiXSxcbiAgICAgICAgYXNxOiBbXCJhc3FcIiwgXCJzZ25cIl0sXG4gICAgICAgIGFzdzogW1wiYXN3XCIsIFwic2duXCJdLFxuICAgICAgICBhdXo6IFtcImF1elwiLCBcImFyXCJdLFxuICAgICAgICBhdmw6IFtcImF2bFwiLCBcImFyXCJdLFxuICAgICAgICBheWg6IFtcImF5aFwiLCBcImFyXCJdLFxuICAgICAgICBheWw6IFtcImF5bFwiLCBcImFyXCJdLFxuICAgICAgICBheW46IFtcImF5blwiLCBcImFyXCJdLFxuICAgICAgICBheXA6IFtcImF5cFwiLCBcImFyXCJdLFxuICAgICAgICBiYno6IFtcImJielwiLCBcImFyXCJdLFxuICAgICAgICBiZmk6IFtcImJmaVwiLCBcInNnblwiXSxcbiAgICAgICAgYmZrOiBbXCJiZmtcIiwgXCJzZ25cIl0sXG4gICAgICAgIGJqbjogW1wiYmpuXCIsIFwibXNcIl0sXG4gICAgICAgIGJvZzogW1wiYm9nXCIsIFwic2duXCJdLFxuICAgICAgICBicW46IFtcImJxblwiLCBcInNnblwiXSxcbiAgICAgICAgYnF5OiBbXCJicXlcIiwgXCJzZ25cIl0sXG4gICAgICAgIGJ0ajogW1wiYnRqXCIsIFwibXNcIl0sXG4gICAgICAgIGJ2ZTogW1wiYnZlXCIsIFwibXNcIl0sXG4gICAgICAgIGJ2bDogW1wiYnZsXCIsIFwic2duXCJdLFxuICAgICAgICBidnU6IFtcImJ2dVwiLCBcIm1zXCJdLFxuICAgICAgICBienM6IFtcImJ6c1wiLCBcInNnblwiXSxcbiAgICAgICAgY2RvOiBbXCJjZG9cIiwgXCJ6aFwiXSxcbiAgICAgICAgY2RzOiBbXCJjZHNcIiwgXCJzZ25cIl0sXG4gICAgICAgIGNqeTogW1wiY2p5XCIsIFwiemhcIl0sXG4gICAgICAgIGNtbjogW1wiY21uXCIsIFwiemhcIl0sXG4gICAgICAgIGNvYTogW1wiY29hXCIsIFwibXNcIl0sXG4gICAgICAgIGNweDogW1wiY3B4XCIsIFwiemhcIl0sXG4gICAgICAgIGNzYzogW1wiY3NjXCIsIFwic2duXCJdLFxuICAgICAgICBjc2Q6IFtcImNzZFwiLCBcInNnblwiXSxcbiAgICAgICAgY3NlOiBbXCJjc2VcIiwgXCJzZ25cIl0sXG4gICAgICAgIGNzZjogW1wiY3NmXCIsIFwic2duXCJdLFxuICAgICAgICBjc2c6IFtcImNzZ1wiLCBcInNnblwiXSxcbiAgICAgICAgY3NsOiBbXCJjc2xcIiwgXCJzZ25cIl0sXG4gICAgICAgIGNzbjogW1wiY3NuXCIsIFwic2duXCJdLFxuICAgICAgICBjc3E6IFtcImNzcVwiLCBcInNnblwiXSxcbiAgICAgICAgY3NyOiBbXCJjc3JcIiwgXCJzZ25cIl0sXG4gICAgICAgIGN6aDogW1wiY3poXCIsIFwiemhcIl0sXG4gICAgICAgIGN6bzogW1wiY3pvXCIsIFwiemhcIl0sXG4gICAgICAgIGRvcTogW1wiZG9xXCIsIFwic2duXCJdLFxuICAgICAgICBkc2U6IFtcImRzZVwiLCBcInNnblwiXSxcbiAgICAgICAgZHNsOiBbXCJkc2xcIiwgXCJzZ25cIl0sXG4gICAgICAgIGR1cDogW1wiZHVwXCIsIFwibXNcIl0sXG4gICAgICAgIGVjczogW1wiZWNzXCIsIFwic2duXCJdLFxuICAgICAgICBlc2w6IFtcImVzbFwiLCBcInNnblwiXSxcbiAgICAgICAgZXNuOiBbXCJlc25cIiwgXCJzZ25cIl0sXG4gICAgICAgIGVzbzogW1wiZXNvXCIsIFwic2duXCJdLFxuICAgICAgICBldGg6IFtcImV0aFwiLCBcInNnblwiXSxcbiAgICAgICAgZmNzOiBbXCJmY3NcIiwgXCJzZ25cIl0sXG4gICAgICAgIGZzZTogW1wiZnNlXCIsIFwic2duXCJdLFxuICAgICAgICBmc2w6IFtcImZzbFwiLCBcInNnblwiXSxcbiAgICAgICAgZnNzOiBbXCJmc3NcIiwgXCJzZ25cIl0sXG4gICAgICAgIGdhbjogW1wiZ2FuXCIsIFwiemhcIl0sXG4gICAgICAgIGdkczogW1wiZ2RzXCIsIFwic2duXCJdLFxuICAgICAgICBnb206IFtcImdvbVwiLCBcImtva1wiXSxcbiAgICAgICAgZ3NlOiBbXCJnc2VcIiwgXCJzZ25cIl0sXG4gICAgICAgIGdzZzogW1wiZ3NnXCIsIFwic2duXCJdLFxuICAgICAgICBnc206IFtcImdzbVwiLCBcInNnblwiXSxcbiAgICAgICAgZ3NzOiBbXCJnc3NcIiwgXCJzZ25cIl0sXG4gICAgICAgIGd1czogW1wiZ3VzXCIsIFwic2duXCJdLFxuICAgICAgICBoYWI6IFtcImhhYlwiLCBcInNnblwiXSxcbiAgICAgICAgaGFmOiBbXCJoYWZcIiwgXCJzZ25cIl0sXG4gICAgICAgIGhhazogW1wiaGFrXCIsIFwiemhcIl0sXG4gICAgICAgIGhkczogW1wiaGRzXCIsIFwic2duXCJdLFxuICAgICAgICBoamk6IFtcImhqaVwiLCBcIm1zXCJdLFxuICAgICAgICBoa3M6IFtcImhrc1wiLCBcInNnblwiXSxcbiAgICAgICAgaG9zOiBbXCJob3NcIiwgXCJzZ25cIl0sXG4gICAgICAgIGhwczogW1wiaHBzXCIsIFwic2duXCJdLFxuICAgICAgICBoc2g6IFtcImhzaFwiLCBcInNnblwiXSxcbiAgICAgICAgaHNsOiBbXCJoc2xcIiwgXCJzZ25cIl0sXG4gICAgICAgIGhzbjogW1wiaHNuXCIsIFwiemhcIl0sXG4gICAgICAgIGljbDogW1wiaWNsXCIsIFwic2duXCJdLFxuICAgICAgICBpbHM6IFtcImlsc1wiLCBcInNnblwiXSxcbiAgICAgICAgaW5sOiBbXCJpbmxcIiwgXCJzZ25cIl0sXG4gICAgICAgIGluczogW1wiaW5zXCIsIFwic2duXCJdLFxuICAgICAgICBpc2U6IFtcImlzZVwiLCBcInNnblwiXSxcbiAgICAgICAgaXNnOiBbXCJpc2dcIiwgXCJzZ25cIl0sXG4gICAgICAgIGlzcjogW1wiaXNyXCIsIFwic2duXCJdLFxuICAgICAgICBqYWs6IFtcImpha1wiLCBcIm1zXCJdLFxuICAgICAgICBqYXg6IFtcImpheFwiLCBcIm1zXCJdLFxuICAgICAgICBqY3M6IFtcImpjc1wiLCBcInNnblwiXSxcbiAgICAgICAgamhzOiBbXCJqaHNcIiwgXCJzZ25cIl0sXG4gICAgICAgIGpsczogW1wiamxzXCIsIFwic2duXCJdLFxuICAgICAgICBqb3M6IFtcImpvc1wiLCBcInNnblwiXSxcbiAgICAgICAganNsOiBbXCJqc2xcIiwgXCJzZ25cIl0sXG4gICAgICAgIGp1czogW1wianVzXCIsIFwic2duXCJdLFxuICAgICAgICBrZ2k6IFtcImtnaVwiLCBcInNnblwiXSxcbiAgICAgICAga25uOiBbXCJrbm5cIiwgXCJrb2tcIl0sXG4gICAgICAgIGt2YjogW1wia3ZiXCIsIFwibXNcIl0sXG4gICAgICAgIGt2azogW1wia3ZrXCIsIFwic2duXCJdLFxuICAgICAgICBrdnI6IFtcImt2clwiLCBcIm1zXCJdLFxuICAgICAgICBreGQ6IFtcImt4ZFwiLCBcIm1zXCJdLFxuICAgICAgICBsYnM6IFtcImxic1wiLCBcInNnblwiXSxcbiAgICAgICAgbGNlOiBbXCJsY2VcIiwgXCJtc1wiXSxcbiAgICAgICAgbGNmOiBbXCJsY2ZcIiwgXCJtc1wiXSxcbiAgICAgICAgbGl3OiBbXCJsaXdcIiwgXCJtc1wiXSxcbiAgICAgICAgbGxzOiBbXCJsbHNcIiwgXCJzZ25cIl0sXG4gICAgICAgIGxzZzogW1wibHNnXCIsIFwic2duXCJdLFxuICAgICAgICBsc2w6IFtcImxzbFwiLCBcInNnblwiXSxcbiAgICAgICAgbHNvOiBbXCJsc29cIiwgXCJzZ25cIl0sXG4gICAgICAgIGxzcDogW1wibHNwXCIsIFwic2duXCJdLFxuICAgICAgICBsc3Q6IFtcImxzdFwiLCBcInNnblwiXSxcbiAgICAgICAgbHN5OiBbXCJsc3lcIiwgXCJzZ25cIl0sXG4gICAgICAgIGx0ZzogW1wibHRnXCIsIFwibHZcIl0sXG4gICAgICAgIGx2czogW1wibHZzXCIsIFwibHZcIl0sXG4gICAgICAgIGx6aDogW1wibHpoXCIsIFwiemhcIl0sXG4gICAgICAgIG1heDogW1wibWF4XCIsIFwibXNcIl0sXG4gICAgICAgIG1kbDogW1wibWRsXCIsIFwic2duXCJdLFxuICAgICAgICBtZW86IFtcIm1lb1wiLCBcIm1zXCJdLFxuICAgICAgICBtZmE6IFtcIm1mYVwiLCBcIm1zXCJdLFxuICAgICAgICBtZmI6IFtcIm1mYlwiLCBcIm1zXCJdLFxuICAgICAgICBtZnM6IFtcIm1mc1wiLCBcInNnblwiXSxcbiAgICAgICAgbWluOiBbXCJtaW5cIiwgXCJtc1wiXSxcbiAgICAgICAgbW5wOiBbXCJtbnBcIiwgXCJ6aFwiXSxcbiAgICAgICAgbXFnOiBbXCJtcWdcIiwgXCJtc1wiXSxcbiAgICAgICAgbXJlOiBbXCJtcmVcIiwgXCJzZ25cIl0sXG4gICAgICAgIG1zZDogW1wibXNkXCIsIFwic2duXCJdLFxuICAgICAgICBtc2k6IFtcIm1zaVwiLCBcIm1zXCJdLFxuICAgICAgICBtc3I6IFtcIm1zclwiLCBcInNnblwiXSxcbiAgICAgICAgbXVpOiBbXCJtdWlcIiwgXCJtc1wiXSxcbiAgICAgICAgbXpjOiBbXCJtemNcIiwgXCJzZ25cIl0sXG4gICAgICAgIG16ZzogW1wibXpnXCIsIFwic2duXCJdLFxuICAgICAgICBtenk6IFtcIm16eVwiLCBcInNnblwiXSxcbiAgICAgICAgbmFuOiBbXCJuYW5cIiwgXCJ6aFwiXSxcbiAgICAgICAgbmJzOiBbXCJuYnNcIiwgXCJzZ25cIl0sXG4gICAgICAgIG5jczogW1wibmNzXCIsIFwic2duXCJdLFxuICAgICAgICBuc2k6IFtcIm5zaVwiLCBcInNnblwiXSxcbiAgICAgICAgbnNsOiBbXCJuc2xcIiwgXCJzZ25cIl0sXG4gICAgICAgIG5zcDogW1wibnNwXCIsIFwic2duXCJdLFxuICAgICAgICBuc3I6IFtcIm5zclwiLCBcInNnblwiXSxcbiAgICAgICAgbnpzOiBbXCJuenNcIiwgXCJzZ25cIl0sXG4gICAgICAgIG9rbDogW1wib2tsXCIsIFwic2duXCJdLFxuICAgICAgICBvcm46IFtcIm9yblwiLCBcIm1zXCJdLFxuICAgICAgICBvcnM6IFtcIm9yc1wiLCBcIm1zXCJdLFxuICAgICAgICBwZWw6IFtcInBlbFwiLCBcIm1zXCJdLFxuICAgICAgICBwZ2E6IFtcInBnYVwiLCBcImFyXCJdLFxuICAgICAgICBwa3M6IFtcInBrc1wiLCBcInNnblwiXSxcbiAgICAgICAgcHJsOiBbXCJwcmxcIiwgXCJzZ25cIl0sXG4gICAgICAgIHByejogW1wicHJ6XCIsIFwic2duXCJdLFxuICAgICAgICBwc2M6IFtcInBzY1wiLCBcInNnblwiXSxcbiAgICAgICAgcHNkOiBbXCJwc2RcIiwgXCJzZ25cIl0sXG4gICAgICAgIHBzZTogW1wicHNlXCIsIFwibXNcIl0sXG4gICAgICAgIHBzZzogW1wicHNnXCIsIFwic2duXCJdLFxuICAgICAgICBwc2w6IFtcInBzbFwiLCBcInNnblwiXSxcbiAgICAgICAgcHNvOiBbXCJwc29cIiwgXCJzZ25cIl0sXG4gICAgICAgIHBzcDogW1wicHNwXCIsIFwic2duXCJdLFxuICAgICAgICBwc3I6IFtcInBzclwiLCBcInNnblwiXSxcbiAgICAgICAgcHlzOiBbXCJweXNcIiwgXCJzZ25cIl0sXG4gICAgICAgIHJtczogW1wicm1zXCIsIFwic2duXCJdLFxuICAgICAgICByc2k6IFtcInJzaVwiLCBcInNnblwiXSxcbiAgICAgICAgcnNsOiBbXCJyc2xcIiwgXCJzZ25cIl0sXG4gICAgICAgIHNkbDogW1wic2RsXCIsIFwic2duXCJdLFxuICAgICAgICBzZmI6IFtcInNmYlwiLCBcInNnblwiXSxcbiAgICAgICAgc2ZzOiBbXCJzZnNcIiwgXCJzZ25cIl0sXG4gICAgICAgIHNnZzogW1wic2dnXCIsIFwic2duXCJdLFxuICAgICAgICBzZ3g6IFtcInNneFwiLCBcInNnblwiXSxcbiAgICAgICAgc2h1OiBbXCJzaHVcIiwgXCJhclwiXSxcbiAgICAgICAgc2xmOiBbXCJzbGZcIiwgXCJzZ25cIl0sXG4gICAgICAgIHNsczogW1wic2xzXCIsIFwic2duXCJdLFxuICAgICAgICBzcWs6IFtcInNxa1wiLCBcInNnblwiXSxcbiAgICAgICAgc3FzOiBbXCJzcXNcIiwgXCJzZ25cIl0sXG4gICAgICAgIHNzaDogW1wic3NoXCIsIFwiYXJcIl0sXG4gICAgICAgIHNzcDogW1wic3NwXCIsIFwic2duXCJdLFxuICAgICAgICBzc3I6IFtcInNzclwiLCBcInNnblwiXSxcbiAgICAgICAgc3ZrOiBbXCJzdmtcIiwgXCJzZ25cIl0sXG4gICAgICAgIHN3YzogW1wic3djXCIsIFwic3dcIl0sXG4gICAgICAgIHN3aDogW1wic3doXCIsIFwic3dcIl0sXG4gICAgICAgIHN3bDogW1wic3dsXCIsIFwic2duXCJdLFxuICAgICAgICBzeXk6IFtcInN5eVwiLCBcInNnblwiXSxcbiAgICAgICAgdG13OiBbXCJ0bXdcIiwgXCJtc1wiXSxcbiAgICAgICAgdHNlOiBbXCJ0c2VcIiwgXCJzZ25cIl0sXG4gICAgICAgIHRzbTogW1widHNtXCIsIFwic2duXCJdLFxuICAgICAgICB0c3E6IFtcInRzcVwiLCBcInNnblwiXSxcbiAgICAgICAgdHNzOiBbXCJ0c3NcIiwgXCJzZ25cIl0sXG4gICAgICAgIHRzeTogW1widHN5XCIsIFwic2duXCJdLFxuICAgICAgICB0emE6IFtcInR6YVwiLCBcInNnblwiXSxcbiAgICAgICAgdWduOiBbXCJ1Z25cIiwgXCJzZ25cIl0sXG4gICAgICAgIHVneTogW1widWd5XCIsIFwic2duXCJdLFxuICAgICAgICB1a2w6IFtcInVrbFwiLCBcInNnblwiXSxcbiAgICAgICAgdWtzOiBbXCJ1a3NcIiwgXCJzZ25cIl0sXG4gICAgICAgIHVyazogW1widXJrXCIsIFwibXNcIl0sXG4gICAgICAgIHV6bjogW1widXpuXCIsIFwidXpcIl0sXG4gICAgICAgIHV6czogW1widXpzXCIsIFwidXpcIl0sXG4gICAgICAgIHZndDogW1widmd0XCIsIFwic2duXCJdLFxuICAgICAgICB2a2s6IFtcInZra1wiLCBcIm1zXCJdLFxuICAgICAgICB2a3Q6IFtcInZrdFwiLCBcIm1zXCJdLFxuICAgICAgICB2c2k6IFtcInZzaVwiLCBcInNnblwiXSxcbiAgICAgICAgdnNsOiBbXCJ2c2xcIiwgXCJzZ25cIl0sXG4gICAgICAgIHZzdjogW1widnN2XCIsIFwic2duXCJdLFxuICAgICAgICB3dXU6IFtcInd1dVwiLCBcInpoXCJdLFxuICAgICAgICB4a2k6IFtcInhraVwiLCBcInNnblwiXSxcbiAgICAgICAgeG1sOiBbXCJ4bWxcIiwgXCJzZ25cIl0sXG4gICAgICAgIHhtbTogW1wieG1tXCIsIFwibXNcIl0sXG4gICAgICAgIHhtczogW1wieG1zXCIsIFwic2duXCJdLFxuICAgICAgICB5ZHM6IFtcInlkc1wiLCBcInNnblwiXSxcbiAgICAgICAgeXNsOiBbXCJ5c2xcIiwgXCJzZ25cIl0sXG4gICAgICAgIHl1ZTogW1wieXVlXCIsIFwiemhcIl0sXG4gICAgICAgIHppYjogW1wiemliXCIsIFwic2duXCJdLFxuICAgICAgICB6bG06IFtcInpsbVwiLCBcIm1zXCJdLFxuICAgICAgICB6bWk6IFtcInptaVwiLCBcIm1zXCJdLFxuICAgICAgICB6c2w6IFtcInpzbFwiLCBcInNnblwiXSxcbiAgICAgICAgenNtOiBbXCJ6c21cIiwgXCJtc1wiXVxuICAgIH1cbn07XG5cbi8qKlxuICogQ29udmVydCBvbmx5IGEteiB0byB1cHBlcmNhc2UgYXMgcGVyIHNlY3Rpb24gNi4xIG9mIHRoZSBzcGVjXG4gKi9cbmZ1bmN0aW9uIHRvTGF0aW5VcHBlckNhc2Uoc3RyKSB7XG4gICAgdmFyIGkgPSBzdHIubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICB2YXIgY2ggPSBzdHIuY2hhckF0KGkpO1xuXG4gICAgICAgIGlmIChjaCA+PSBcImFcIiAmJiBjaCA8PSBcInpcIikgc3RyID0gc3RyLnNsaWNlKDAsIGkpICsgY2gudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZShpICsgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cjtcbn1cblxuLyoqXG4gKiBUaGUgSXNTdHJ1Y3R1cmFsbHlWYWxpZExhbmd1YWdlVGFnIGFic3RyYWN0IG9wZXJhdGlvbiB2ZXJpZmllcyB0aGF0IHRoZSBsb2NhbGVcbiAqIGFyZ3VtZW50ICh3aGljaCBtdXN0IGJlIGEgU3RyaW5nIHZhbHVlKVxuICpcbiAqIC0gcmVwcmVzZW50cyBhIHdlbGwtZm9ybWVkIEJDUCA0NyBsYW5ndWFnZSB0YWcgYXMgc3BlY2lmaWVkIGluIFJGQyA1NjQ2IHNlY3Rpb25cbiAqICAgMi4xLCBvciBzdWNjZXNzb3IsXG4gKiAtIGRvZXMgbm90IGluY2x1ZGUgZHVwbGljYXRlIHZhcmlhbnQgc3VidGFncywgYW5kXG4gKiAtIGRvZXMgbm90IGluY2x1ZGUgZHVwbGljYXRlIHNpbmdsZXRvbiBzdWJ0YWdzLlxuICpcbiAqIFRoZSBhYnN0cmFjdCBvcGVyYXRpb24gcmV0dXJucyB0cnVlIGlmIGxvY2FsZSBjYW4gYmUgZ2VuZXJhdGVkIGZyb20gdGhlIEFCTkZcbiAqIGdyYW1tYXIgaW4gc2VjdGlvbiAyLjEgb2YgdGhlIFJGQywgc3RhcnRpbmcgd2l0aCBMYW5ndWFnZS1UYWcsIGFuZCBkb2VzIG5vdFxuICogY29udGFpbiBkdXBsaWNhdGUgdmFyaWFudCBvciBzaW5nbGV0b24gc3VidGFncyAob3RoZXIgdGhhbiBhcyBhIHByaXZhdGUgdXNlXG4gKiBzdWJ0YWcpLiBJdCByZXR1cm5zIGZhbHNlIG90aGVyd2lzZS4gVGVybWluYWwgdmFsdWUgY2hhcmFjdGVycyBpbiB0aGUgZ3JhbW1hciBhcmVcbiAqIGludGVycHJldGVkIGFzIHRoZSBVbmljb2RlIGVxdWl2YWxlbnRzIG9mIHRoZSBBU0NJSSBvY3RldCB2YWx1ZXMgZ2l2ZW4uXG4gKi9cbmZ1bmN0aW9uIC8qIDYuMi4yICovSXNTdHJ1Y3R1cmFsbHlWYWxpZExhbmd1YWdlVGFnKGxvY2FsZSkge1xuICAgIC8vIHJlcHJlc2VudHMgYSB3ZWxsLWZvcm1lZCBCQ1AgNDcgbGFuZ3VhZ2UgdGFnIGFzIHNwZWNpZmllZCBpbiBSRkMgNTY0NlxuICAgIGlmICghZXhwQkNQNDdTeW50YXgudGVzdChsb2NhbGUpKSByZXR1cm4gZmFsc2U7XG5cbiAgICAvLyBkb2VzIG5vdCBpbmNsdWRlIGR1cGxpY2F0ZSB2YXJpYW50IHN1YnRhZ3MsIGFuZFxuICAgIGlmIChleHBWYXJpYW50RHVwZXMudGVzdChsb2NhbGUpKSByZXR1cm4gZmFsc2U7XG5cbiAgICAvLyBkb2VzIG5vdCBpbmNsdWRlIGR1cGxpY2F0ZSBzaW5nbGV0b24gc3VidGFncy5cbiAgICBpZiAoZXhwU2luZ2xldG9uRHVwZXMudGVzdChsb2NhbGUpKSByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBUaGUgQ2Fub25pY2FsaXplTGFuZ3VhZ2VUYWcgYWJzdHJhY3Qgb3BlcmF0aW9uIHJldHVybnMgdGhlIGNhbm9uaWNhbCBhbmQgY2FzZS1cbiAqIHJlZ3VsYXJpemVkIGZvcm0gb2YgdGhlIGxvY2FsZSBhcmd1bWVudCAod2hpY2ggbXVzdCBiZSBhIFN0cmluZyB2YWx1ZSB0aGF0IGlzXG4gKiBhIHN0cnVjdHVyYWxseSB2YWxpZCBCQ1AgNDcgbGFuZ3VhZ2UgdGFnIGFzIHZlcmlmaWVkIGJ5IHRoZVxuICogSXNTdHJ1Y3R1cmFsbHlWYWxpZExhbmd1YWdlVGFnIGFic3RyYWN0IG9wZXJhdGlvbikuIEl0IHRha2VzIHRoZSBzdGVwc1xuICogc3BlY2lmaWVkIGluIFJGQyA1NjQ2IHNlY3Rpb24gNC41LCBvciBzdWNjZXNzb3IsIHRvIGJyaW5nIHRoZSBsYW5ndWFnZSB0YWdcbiAqIGludG8gY2Fub25pY2FsIGZvcm0sIGFuZCB0byByZWd1bGFyaXplIHRoZSBjYXNlIG9mIHRoZSBzdWJ0YWdzLCBidXQgZG9lcyBub3RcbiAqIHRha2UgdGhlIHN0ZXBzIHRvIGJyaW5nIGEgbGFuZ3VhZ2UgdGFnIGludG8g4oCcZXh0bGFuZyBmb3Jt4oCdIGFuZCB0byByZW9yZGVyXG4gKiB2YXJpYW50IHN1YnRhZ3MuXG5cbiAqIFRoZSBzcGVjaWZpY2F0aW9ucyBmb3IgZXh0ZW5zaW9ucyB0byBCQ1AgNDcgbGFuZ3VhZ2UgdGFncywgc3VjaCBhcyBSRkMgNjA2NyxcbiAqIG1heSBpbmNsdWRlIGNhbm9uaWNhbGl6YXRpb24gcnVsZXMgZm9yIHRoZSBleHRlbnNpb24gc3VidGFnIHNlcXVlbmNlcyB0aGV5XG4gKiBkZWZpbmUgdGhhdCBnbyBiZXlvbmQgdGhlIGNhbm9uaWNhbGl6YXRpb24gcnVsZXMgb2YgUkZDIDU2NDYgc2VjdGlvbiA0LjUuXG4gKiBJbXBsZW1lbnRhdGlvbnMgYXJlIGFsbG93ZWQsIGJ1dCBub3QgcmVxdWlyZWQsIHRvIGFwcGx5IHRoZXNlIGFkZGl0aW9uYWwgcnVsZXMuXG4gKi9cbmZ1bmN0aW9uIC8qIDYuMi4zICovQ2Fub25pY2FsaXplTGFuZ3VhZ2VUYWcobG9jYWxlKSB7XG4gICAgdmFyIG1hdGNoID0gdm9pZCAwLFxuICAgICAgICBwYXJ0cyA9IHZvaWQgMDtcblxuICAgIC8vIEEgbGFuZ3VhZ2UgdGFnIGlzIGluICdjYW5vbmljYWwgZm9ybScgd2hlbiB0aGUgdGFnIGlzIHdlbGwtZm9ybWVkXG4gICAgLy8gYWNjb3JkaW5nIHRvIHRoZSBydWxlcyBpbiBTZWN0aW9ucyAyLjEgYW5kIDIuMlxuXG4gICAgLy8gU2VjdGlvbiAyLjEgc2F5cyBhbGwgc3VidGFncyB1c2UgbG93ZXJjYXNlLi4uXG4gICAgbG9jYWxlID0gbG9jYWxlLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAvLyAuLi53aXRoIDIgZXhjZXB0aW9uczogJ3R3by1sZXR0ZXIgYW5kIGZvdXItbGV0dGVyIHN1YnRhZ3MgdGhhdCBuZWl0aGVyXG4gICAgLy8gYXBwZWFyIGF0IHRoZSBzdGFydCBvZiB0aGUgdGFnIG5vciBvY2N1ciBhZnRlciBzaW5nbGV0b25zLiAgU3VjaCB0d28tbGV0dGVyXG4gICAgLy8gc3VidGFncyBhcmUgYWxsIHVwcGVyY2FzZSAoYXMgaW4gdGhlIHRhZ3MgXCJlbi1DQS14LWNhXCIgb3IgXCJzZ24tQkUtRlJcIikgYW5kXG4gICAgLy8gZm91ci1sZXR0ZXIgc3VidGFncyBhcmUgdGl0bGVjYXNlIChhcyBpbiB0aGUgdGFnIFwiYXotTGF0bi14LWxhdG5cIikuXG4gICAgcGFydHMgPSBsb2NhbGUuc3BsaXQoJy0nKTtcbiAgICBmb3IgKHZhciBpID0gMSwgbWF4ID0gcGFydHMubGVuZ3RoOyBpIDwgbWF4OyBpKyspIHtcbiAgICAgICAgLy8gVHdvLWxldHRlciBzdWJ0YWdzIGFyZSBhbGwgdXBwZXJjYXNlXG4gICAgICAgIGlmIChwYXJ0c1tpXS5sZW5ndGggPT09IDIpIHBhcnRzW2ldID0gcGFydHNbaV0udG9VcHBlckNhc2UoKTtcblxuICAgICAgICAvLyBGb3VyLWxldHRlciBzdWJ0YWdzIGFyZSB0aXRsZWNhc2VcbiAgICAgICAgZWxzZSBpZiAocGFydHNbaV0ubGVuZ3RoID09PSA0KSBwYXJ0c1tpXSA9IHBhcnRzW2ldLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcGFydHNbaV0uc2xpY2UoMSk7XG5cbiAgICAgICAgICAgIC8vIElzIGl0IGEgc2luZ2xldG9uP1xuICAgICAgICAgICAgZWxzZSBpZiAocGFydHNbaV0ubGVuZ3RoID09PSAxICYmIHBhcnRzW2ldICE9PSAneCcpIGJyZWFrO1xuICAgIH1cbiAgICBsb2NhbGUgPSBhcnJKb2luLmNhbGwocGFydHMsICctJyk7XG5cbiAgICAvLyBUaGUgc3RlcHMgbGFpZCBvdXQgaW4gUkZDIDU2NDYgc2VjdGlvbiA0LjUgYXJlIGFzIGZvbGxvd3M6XG5cbiAgICAvLyAxLiAgRXh0ZW5zaW9uIHNlcXVlbmNlcyBhcmUgb3JkZXJlZCBpbnRvIGNhc2UtaW5zZW5zaXRpdmUgQVNDSUkgb3JkZXJcbiAgICAvLyAgICAgYnkgc2luZ2xldG9uIHN1YnRhZy5cbiAgICBpZiAoKG1hdGNoID0gbG9jYWxlLm1hdGNoKGV4cEV4dFNlcXVlbmNlcykpICYmIG1hdGNoLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgLy8gVGhlIGJ1aWx0LWluIHNvcnQoKSBzb3J0cyBieSBBU0NJSSBvcmRlciwgc28gdXNlIHRoYXRcbiAgICAgICAgbWF0Y2guc29ydCgpO1xuXG4gICAgICAgIC8vIFJlcGxhY2UgYWxsIGV4dGVuc2lvbnMgd2l0aCB0aGUgam9pbmVkLCBzb3J0ZWQgYXJyYXlcbiAgICAgICAgbG9jYWxlID0gbG9jYWxlLnJlcGxhY2UoUmVnRXhwKCcoPzonICsgZXhwRXh0U2VxdWVuY2VzLnNvdXJjZSArICcpKycsICdpJyksIGFyckpvaW4uY2FsbChtYXRjaCwgJycpKTtcbiAgICB9XG5cbiAgICAvLyAyLiAgUmVkdW5kYW50IG9yIGdyYW5kZmF0aGVyZWQgdGFncyBhcmUgcmVwbGFjZWQgYnkgdGhlaXIgJ1ByZWZlcnJlZC1cbiAgICAvLyAgICAgVmFsdWUnLCBpZiB0aGVyZSBpcyBvbmUuXG4gICAgaWYgKGhvcC5jYWxsKHJlZHVuZGFudFRhZ3MudGFncywgbG9jYWxlKSkgbG9jYWxlID0gcmVkdW5kYW50VGFncy50YWdzW2xvY2FsZV07XG5cbiAgICAvLyAzLiAgU3VidGFncyBhcmUgcmVwbGFjZWQgYnkgdGhlaXIgJ1ByZWZlcnJlZC1WYWx1ZScsIGlmIHRoZXJlIGlzIG9uZS5cbiAgICAvLyAgICAgRm9yIGV4dGxhbmdzLCB0aGUgb3JpZ2luYWwgcHJpbWFyeSBsYW5ndWFnZSBzdWJ0YWcgaXMgYWxzb1xuICAgIC8vICAgICByZXBsYWNlZCBpZiB0aGVyZSBpcyBhIHByaW1hcnkgbGFuZ3VhZ2Ugc3VidGFnIGluIHRoZSAnUHJlZmVycmVkLVxuICAgIC8vICAgICBWYWx1ZScuXG4gICAgcGFydHMgPSBsb2NhbGUuc3BsaXQoJy0nKTtcblxuICAgIGZvciAodmFyIF9pID0gMSwgX21heCA9IHBhcnRzLmxlbmd0aDsgX2kgPCBfbWF4OyBfaSsrKSB7XG4gICAgICAgIGlmIChob3AuY2FsbChyZWR1bmRhbnRUYWdzLnN1YnRhZ3MsIHBhcnRzW19pXSkpIHBhcnRzW19pXSA9IHJlZHVuZGFudFRhZ3Muc3VidGFnc1twYXJ0c1tfaV1dO2Vsc2UgaWYgKGhvcC5jYWxsKHJlZHVuZGFudFRhZ3MuZXh0TGFuZywgcGFydHNbX2ldKSkge1xuICAgICAgICAgICAgcGFydHNbX2ldID0gcmVkdW5kYW50VGFncy5leHRMYW5nW3BhcnRzW19pXV1bMF07XG5cbiAgICAgICAgICAgIC8vIEZvciBleHRsYW5nIHRhZ3MsIHRoZSBwcmVmaXggbmVlZHMgdG8gYmUgcmVtb3ZlZCBpZiBpdCBpcyByZWR1bmRhbnRcbiAgICAgICAgICAgIGlmIChfaSA9PT0gMSAmJiByZWR1bmRhbnRUYWdzLmV4dExhbmdbcGFydHNbMV1dWzFdID09PSBwYXJ0c1swXSkge1xuICAgICAgICAgICAgICAgIHBhcnRzID0gYXJyU2xpY2UuY2FsbChwYXJ0cywgX2krKyk7XG4gICAgICAgICAgICAgICAgX21heCAtPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFyckpvaW4uY2FsbChwYXJ0cywgJy0nKTtcbn1cblxuLyoqXG4gKiBUaGUgRGVmYXVsdExvY2FsZSBhYnN0cmFjdCBvcGVyYXRpb24gcmV0dXJucyBhIFN0cmluZyB2YWx1ZSByZXByZXNlbnRpbmcgdGhlXG4gKiBzdHJ1Y3R1cmFsbHkgdmFsaWQgKDYuMi4yKSBhbmQgY2Fub25pY2FsaXplZCAoNi4yLjMpIEJDUCA0NyBsYW5ndWFnZSB0YWcgZm9yIHRoZVxuICogaG9zdCBlbnZpcm9ubWVudOKAmXMgY3VycmVudCBsb2NhbGUuXG4gKi9cbmZ1bmN0aW9uIC8qIDYuMi40ICovRGVmYXVsdExvY2FsZSgpIHtcbiAgICByZXR1cm4gZGVmYXVsdExvY2FsZTtcbn1cblxuLy8gU2VjdCA2LjMgQ3VycmVuY3kgQ29kZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbnZhciBleHBDdXJyZW5jeUNvZGUgPSAvXltBLVpdezN9JC87XG5cbi8qKlxuICogVGhlIElzV2VsbEZvcm1lZEN1cnJlbmN5Q29kZSBhYnN0cmFjdCBvcGVyYXRpb24gdmVyaWZpZXMgdGhhdCB0aGUgY3VycmVuY3kgYXJndW1lbnRcbiAqIChhZnRlciBjb252ZXJzaW9uIHRvIGEgU3RyaW5nIHZhbHVlKSByZXByZXNlbnRzIGEgd2VsbC1mb3JtZWQgMy1sZXR0ZXIgSVNPIGN1cnJlbmN5XG4gKiBjb2RlLiBUaGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAqL1xuZnVuY3Rpb24gLyogNi4zLjEgKi9Jc1dlbGxGb3JtZWRDdXJyZW5jeUNvZGUoY3VycmVuY3kpIHtcbiAgICAvLyAxLiBMZXQgYGNgIGJlIFRvU3RyaW5nKGN1cnJlbmN5KVxuICAgIHZhciBjID0gU3RyaW5nKGN1cnJlbmN5KTtcblxuICAgIC8vIDIuIExldCBgbm9ybWFsaXplZGAgYmUgdGhlIHJlc3VsdCBvZiBtYXBwaW5nIGMgdG8gdXBwZXIgY2FzZSBhcyBkZXNjcmliZWRcbiAgICAvLyAgICBpbiA2LjEuXG4gICAgdmFyIG5vcm1hbGl6ZWQgPSB0b0xhdGluVXBwZXJDYXNlKGMpO1xuXG4gICAgLy8gMy4gSWYgdGhlIHN0cmluZyBsZW5ndGggb2Ygbm9ybWFsaXplZCBpcyBub3QgMywgcmV0dXJuIGZhbHNlLlxuICAgIC8vIDQuIElmIG5vcm1hbGl6ZWQgY29udGFpbnMgYW55IGNoYXJhY3RlciB0aGF0IGlzIG5vdCBpbiB0aGUgcmFuZ2UgXCJBXCIgdG8gXCJaXCJcbiAgICAvLyAgICAoVSswMDQxIHRvIFUrMDA1QSksIHJldHVybiBmYWxzZS5cbiAgICBpZiAoZXhwQ3VycmVuY3lDb2RlLnRlc3Qobm9ybWFsaXplZCkgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG5cbiAgICAvLyA1LiBSZXR1cm4gdHJ1ZVxuICAgIHJldHVybiB0cnVlO1xufVxuXG52YXIgZXhwVW5pY29kZUV4U2VxID0gLy11KD86LVswLTlhLXpdezIsOH0pKy9naTsgLy8gU2VlIGBleHRlbnNpb25gIGJlbG93XG5cbmZ1bmN0aW9uIC8qIDkuMi4xICovQ2Fub25pY2FsaXplTG9jYWxlTGlzdChsb2NhbGVzKSB7XG4gICAgLy8gVGhlIGFic3RyYWN0IG9wZXJhdGlvbiBDYW5vbmljYWxpemVMb2NhbGVMaXN0IHRha2VzIHRoZSBmb2xsb3dpbmcgc3RlcHM6XG5cbiAgICAvLyAxLiBJZiBsb2NhbGVzIGlzIHVuZGVmaW5lZCwgdGhlbiBhLiBSZXR1cm4gYSBuZXcgZW1wdHkgTGlzdFxuICAgIGlmIChsb2NhbGVzID09PSB1bmRlZmluZWQpIHJldHVybiBuZXcgTGlzdCgpO1xuXG4gICAgLy8gMi4gTGV0IHNlZW4gYmUgYSBuZXcgZW1wdHkgTGlzdC5cbiAgICB2YXIgc2VlbiA9IG5ldyBMaXN0KCk7XG5cbiAgICAvLyAzLiBJZiBsb2NhbGVzIGlzIGEgU3RyaW5nIHZhbHVlLCB0aGVuXG4gICAgLy8gICAgYS4gTGV0IGxvY2FsZXMgYmUgYSBuZXcgYXJyYXkgY3JlYXRlZCBhcyBpZiBieSB0aGUgZXhwcmVzc2lvbiBuZXdcbiAgICAvLyAgICBBcnJheShsb2NhbGVzKSB3aGVyZSBBcnJheSBpcyB0aGUgc3RhbmRhcmQgYnVpbHQtaW4gY29uc3RydWN0b3Igd2l0aFxuICAgIC8vICAgIHRoYXQgbmFtZSBhbmQgbG9jYWxlcyBpcyB0aGUgdmFsdWUgb2YgbG9jYWxlcy5cbiAgICBsb2NhbGVzID0gdHlwZW9mIGxvY2FsZXMgPT09ICdzdHJpbmcnID8gW2xvY2FsZXNdIDogbG9jYWxlcztcblxuICAgIC8vIDQuIExldCBPIGJlIFRvT2JqZWN0KGxvY2FsZXMpLlxuICAgIHZhciBPID0gdG9PYmplY3QobG9jYWxlcyk7XG5cbiAgICAvLyA1LiBMZXQgbGVuVmFsdWUgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZlxuICAgIC8vICAgIE8gd2l0aCB0aGUgYXJndW1lbnQgXCJsZW5ndGhcIi5cbiAgICAvLyA2LiBMZXQgbGVuIGJlIFRvVWludDMyKGxlblZhbHVlKS5cbiAgICB2YXIgbGVuID0gTy5sZW5ndGg7XG5cbiAgICAvLyA3LiBMZXQgayBiZSAwLlxuICAgIHZhciBrID0gMDtcblxuICAgIC8vIDguIFJlcGVhdCwgd2hpbGUgayA8IGxlblxuICAgIHdoaWxlIChrIDwgbGVuKSB7XG4gICAgICAgIC8vIGEuIExldCBQayBiZSBUb1N0cmluZyhrKS5cbiAgICAgICAgdmFyIFBrID0gU3RyaW5nKGspO1xuXG4gICAgICAgIC8vIGIuIExldCBrUHJlc2VudCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbSGFzUHJvcGVydHldXSBpbnRlcm5hbFxuICAgICAgICAvLyAgICBtZXRob2Qgb2YgTyB3aXRoIGFyZ3VtZW50IFBrLlxuICAgICAgICB2YXIga1ByZXNlbnQgPSBQayBpbiBPO1xuXG4gICAgICAgIC8vIGMuIElmIGtQcmVzZW50IGlzIHRydWUsIHRoZW5cbiAgICAgICAgaWYgKGtQcmVzZW50KSB7XG4gICAgICAgICAgICAvLyBpLiBMZXQga1ZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbFxuICAgICAgICAgICAgLy8gICAgIG1ldGhvZCBvZiBPIHdpdGggYXJndW1lbnQgUGsuXG4gICAgICAgICAgICB2YXIga1ZhbHVlID0gT1tQa107XG5cbiAgICAgICAgICAgIC8vIGlpLiBJZiB0aGUgdHlwZSBvZiBrVmFsdWUgaXMgbm90IFN0cmluZyBvciBPYmplY3QsIHRoZW4gdGhyb3cgYVxuICAgICAgICAgICAgLy8gICAgIFR5cGVFcnJvciBleGNlcHRpb24uXG4gICAgICAgICAgICBpZiAoa1ZhbHVlID09PSBudWxsIHx8IHR5cGVvZiBrVmFsdWUgIT09ICdzdHJpbmcnICYmICh0eXBlb2Yga1ZhbHVlID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IGJhYmVsSGVscGVyc1tcInR5cGVvZlwiXShrVmFsdWUpKSAhPT0gJ29iamVjdCcpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1N0cmluZyBvciBPYmplY3QgdHlwZSBleHBlY3RlZCcpO1xuXG4gICAgICAgICAgICAvLyBpaWkuIExldCB0YWcgYmUgVG9TdHJpbmcoa1ZhbHVlKS5cbiAgICAgICAgICAgIHZhciB0YWcgPSBTdHJpbmcoa1ZhbHVlKTtcblxuICAgICAgICAgICAgLy8gaXYuIElmIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgYWJzdHJhY3Qgb3BlcmF0aW9uXG4gICAgICAgICAgICAvLyAgICAgSXNTdHJ1Y3R1cmFsbHlWYWxpZExhbmd1YWdlVGFnIChkZWZpbmVkIGluIDYuMi4yKSwgcGFzc2luZyB0YWcgYXNcbiAgICAgICAgICAgIC8vICAgICB0aGUgYXJndW1lbnQsIGlzIGZhbHNlLCB0aGVuIHRocm93IGEgUmFuZ2VFcnJvciBleGNlcHRpb24uXG4gICAgICAgICAgICBpZiAoIUlzU3RydWN0dXJhbGx5VmFsaWRMYW5ndWFnZVRhZyh0YWcpKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIidcIiArIHRhZyArIFwiJyBpcyBub3QgYSBzdHJ1Y3R1cmFsbHkgdmFsaWQgbGFuZ3VhZ2UgdGFnXCIpO1xuXG4gICAgICAgICAgICAvLyB2LiBMZXQgdGFnIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgYWJzdHJhY3Qgb3BlcmF0aW9uXG4gICAgICAgICAgICAvLyAgICBDYW5vbmljYWxpemVMYW5ndWFnZVRhZyAoZGVmaW5lZCBpbiA2LjIuMyksIHBhc3NpbmcgdGFnIGFzIHRoZVxuICAgICAgICAgICAgLy8gICAgYXJndW1lbnQuXG4gICAgICAgICAgICB0YWcgPSBDYW5vbmljYWxpemVMYW5ndWFnZVRhZyh0YWcpO1xuXG4gICAgICAgICAgICAvLyB2aS4gSWYgdGFnIGlzIG5vdCBhbiBlbGVtZW50IG9mIHNlZW4sIHRoZW4gYXBwZW5kIHRhZyBhcyB0aGUgbGFzdFxuICAgICAgICAgICAgLy8gICAgIGVsZW1lbnQgb2Ygc2Vlbi5cbiAgICAgICAgICAgIGlmIChhcnJJbmRleE9mLmNhbGwoc2VlbiwgdGFnKSA9PT0gLTEpIGFyclB1c2guY2FsbChzZWVuLCB0YWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZC4gSW5jcmVhc2UgayBieSAxLlxuICAgICAgICBrKys7XG4gICAgfVxuXG4gICAgLy8gOS4gUmV0dXJuIHNlZW4uXG4gICAgcmV0dXJuIHNlZW47XG59XG5cbi8qKlxuICogVGhlIEJlc3RBdmFpbGFibGVMb2NhbGUgYWJzdHJhY3Qgb3BlcmF0aW9uIGNvbXBhcmVzIHRoZSBwcm92aWRlZCBhcmd1bWVudFxuICogbG9jYWxlLCB3aGljaCBtdXN0IGJlIGEgU3RyaW5nIHZhbHVlIHdpdGggYSBzdHJ1Y3R1cmFsbHkgdmFsaWQgYW5kXG4gKiBjYW5vbmljYWxpemVkIEJDUCA0NyBsYW5ndWFnZSB0YWcsIGFnYWluc3QgdGhlIGxvY2FsZXMgaW4gYXZhaWxhYmxlTG9jYWxlcyBhbmRcbiAqIHJldHVybnMgZWl0aGVyIHRoZSBsb25nZXN0IG5vbi1lbXB0eSBwcmVmaXggb2YgbG9jYWxlIHRoYXQgaXMgYW4gZWxlbWVudCBvZlxuICogYXZhaWxhYmxlTG9jYWxlcywgb3IgdW5kZWZpbmVkIGlmIHRoZXJlIGlzIG5vIHN1Y2ggZWxlbWVudC4gSXQgdXNlcyB0aGVcbiAqIGZhbGxiYWNrIG1lY2hhbmlzbSBvZiBSRkMgNDY0Nywgc2VjdGlvbiAzLjQuIFRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHRha2VuOlxuICovXG5mdW5jdGlvbiAvKiA5LjIuMiAqL0Jlc3RBdmFpbGFibGVMb2NhbGUoYXZhaWxhYmxlTG9jYWxlcywgbG9jYWxlKSB7XG4gICAgLy8gMS4gTGV0IGNhbmRpZGF0ZSBiZSBsb2NhbGVcbiAgICB2YXIgY2FuZGlkYXRlID0gbG9jYWxlO1xuXG4gICAgLy8gMi4gUmVwZWF0XG4gICAgd2hpbGUgKGNhbmRpZGF0ZSkge1xuICAgICAgICAvLyBhLiBJZiBhdmFpbGFibGVMb2NhbGVzIGNvbnRhaW5zIGFuIGVsZW1lbnQgZXF1YWwgdG8gY2FuZGlkYXRlLCB0aGVuIHJldHVyblxuICAgICAgICAvLyBjYW5kaWRhdGUuXG4gICAgICAgIGlmIChhcnJJbmRleE9mLmNhbGwoYXZhaWxhYmxlTG9jYWxlcywgY2FuZGlkYXRlKSA+IC0xKSByZXR1cm4gY2FuZGlkYXRlO1xuXG4gICAgICAgIC8vIGIuIExldCBwb3MgYmUgdGhlIGNoYXJhY3RlciBpbmRleCBvZiB0aGUgbGFzdCBvY2N1cnJlbmNlIG9mIFwiLVwiXG4gICAgICAgIC8vIChVKzAwMkQpIHdpdGhpbiBjYW5kaWRhdGUuIElmIHRoYXQgY2hhcmFjdGVyIGRvZXMgbm90IG9jY3VyLCByZXR1cm5cbiAgICAgICAgLy8gdW5kZWZpbmVkLlxuICAgICAgICB2YXIgcG9zID0gY2FuZGlkYXRlLmxhc3RJbmRleE9mKCctJyk7XG5cbiAgICAgICAgaWYgKHBvcyA8IDApIHJldHVybjtcblxuICAgICAgICAvLyBjLiBJZiBwb3Mg4omlIDIgYW5kIHRoZSBjaGFyYWN0ZXIgXCItXCIgb2NjdXJzIGF0IGluZGV4IHBvcy0yIG9mIGNhbmRpZGF0ZSxcbiAgICAgICAgLy8gICAgdGhlbiBkZWNyZWFzZSBwb3MgYnkgMi5cbiAgICAgICAgaWYgKHBvcyA+PSAyICYmIGNhbmRpZGF0ZS5jaGFyQXQocG9zIC0gMikgPT09ICctJykgcG9zIC09IDI7XG5cbiAgICAgICAgLy8gZC4gTGV0IGNhbmRpZGF0ZSBiZSB0aGUgc3Vic3RyaW5nIG9mIGNhbmRpZGF0ZSBmcm9tIHBvc2l0aW9uIDAsIGluY2x1c2l2ZSxcbiAgICAgICAgLy8gICAgdG8gcG9zaXRpb24gcG9zLCBleGNsdXNpdmUuXG4gICAgICAgIGNhbmRpZGF0ZSA9IGNhbmRpZGF0ZS5zdWJzdHJpbmcoMCwgcG9zKTtcbiAgICB9XG59XG5cbi8qKlxuICogVGhlIExvb2t1cE1hdGNoZXIgYWJzdHJhY3Qgb3BlcmF0aW9uIGNvbXBhcmVzIHJlcXVlc3RlZExvY2FsZXMsIHdoaWNoIG11c3QgYmVcbiAqIGEgTGlzdCBhcyByZXR1cm5lZCBieSBDYW5vbmljYWxpemVMb2NhbGVMaXN0LCBhZ2FpbnN0IHRoZSBsb2NhbGVzIGluXG4gKiBhdmFpbGFibGVMb2NhbGVzIGFuZCBkZXRlcm1pbmVzIHRoZSBiZXN0IGF2YWlsYWJsZSBsYW5ndWFnZSB0byBtZWV0IHRoZVxuICogcmVxdWVzdC4gVGhlIGZvbGxvd2luZyBzdGVwcyBhcmUgdGFrZW46XG4gKi9cbmZ1bmN0aW9uIC8qIDkuMi4zICovTG9va3VwTWF0Y2hlcihhdmFpbGFibGVMb2NhbGVzLCByZXF1ZXN0ZWRMb2NhbGVzKSB7XG4gICAgLy8gMS4gTGV0IGkgYmUgMC5cbiAgICB2YXIgaSA9IDA7XG5cbiAgICAvLyAyLiBMZXQgbGVuIGJlIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gcmVxdWVzdGVkTG9jYWxlcy5cbiAgICB2YXIgbGVuID0gcmVxdWVzdGVkTG9jYWxlcy5sZW5ndGg7XG5cbiAgICAvLyAzLiBMZXQgYXZhaWxhYmxlTG9jYWxlIGJlIHVuZGVmaW5lZC5cbiAgICB2YXIgYXZhaWxhYmxlTG9jYWxlID0gdm9pZCAwO1xuXG4gICAgdmFyIGxvY2FsZSA9IHZvaWQgMCxcbiAgICAgICAgbm9FeHRlbnNpb25zTG9jYWxlID0gdm9pZCAwO1xuXG4gICAgLy8gNC4gUmVwZWF0IHdoaWxlIGkgPCBsZW4gYW5kIGF2YWlsYWJsZUxvY2FsZSBpcyB1bmRlZmluZWQ6XG4gICAgd2hpbGUgKGkgPCBsZW4gJiYgIWF2YWlsYWJsZUxvY2FsZSkge1xuICAgICAgICAvLyBhLiBMZXQgbG9jYWxlIGJlIHRoZSBlbGVtZW50IG9mIHJlcXVlc3RlZExvY2FsZXMgYXQgMC1vcmlnaW5lZCBsaXN0XG4gICAgICAgIC8vICAgIHBvc2l0aW9uIGkuXG4gICAgICAgIGxvY2FsZSA9IHJlcXVlc3RlZExvY2FsZXNbaV07XG5cbiAgICAgICAgLy8gYi4gTGV0IG5vRXh0ZW5zaW9uc0xvY2FsZSBiZSB0aGUgU3RyaW5nIHZhbHVlIHRoYXQgaXMgbG9jYWxlIHdpdGggYWxsXG4gICAgICAgIC8vICAgIFVuaWNvZGUgbG9jYWxlIGV4dGVuc2lvbiBzZXF1ZW5jZXMgcmVtb3ZlZC5cbiAgICAgICAgbm9FeHRlbnNpb25zTG9jYWxlID0gU3RyaW5nKGxvY2FsZSkucmVwbGFjZShleHBVbmljb2RlRXhTZXEsICcnKTtcblxuICAgICAgICAvLyBjLiBMZXQgYXZhaWxhYmxlTG9jYWxlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGVcbiAgICAgICAgLy8gICAgQmVzdEF2YWlsYWJsZUxvY2FsZSBhYnN0cmFjdCBvcGVyYXRpb24gKGRlZmluZWQgaW4gOS4yLjIpIHdpdGhcbiAgICAgICAgLy8gICAgYXJndW1lbnRzIGF2YWlsYWJsZUxvY2FsZXMgYW5kIG5vRXh0ZW5zaW9uc0xvY2FsZS5cbiAgICAgICAgYXZhaWxhYmxlTG9jYWxlID0gQmVzdEF2YWlsYWJsZUxvY2FsZShhdmFpbGFibGVMb2NhbGVzLCBub0V4dGVuc2lvbnNMb2NhbGUpO1xuXG4gICAgICAgIC8vIGQuIEluY3JlYXNlIGkgYnkgMS5cbiAgICAgICAgaSsrO1xuICAgIH1cblxuICAgIC8vIDUuIExldCByZXN1bHQgYmUgYSBuZXcgUmVjb3JkLlxuICAgIHZhciByZXN1bHQgPSBuZXcgUmVjb3JkKCk7XG5cbiAgICAvLyA2LiBJZiBhdmFpbGFibGVMb2NhbGUgaXMgbm90IHVuZGVmaW5lZCwgdGhlblxuICAgIGlmIChhdmFpbGFibGVMb2NhbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBhLiBTZXQgcmVzdWx0LltbbG9jYWxlXV0gdG8gYXZhaWxhYmxlTG9jYWxlLlxuICAgICAgICByZXN1bHRbJ1tbbG9jYWxlXV0nXSA9IGF2YWlsYWJsZUxvY2FsZTtcblxuICAgICAgICAvLyBiLiBJZiBsb2NhbGUgYW5kIG5vRXh0ZW5zaW9uc0xvY2FsZSBhcmUgbm90IHRoZSBzYW1lIFN0cmluZyB2YWx1ZSwgdGhlblxuICAgICAgICBpZiAoU3RyaW5nKGxvY2FsZSkgIT09IFN0cmluZyhub0V4dGVuc2lvbnNMb2NhbGUpKSB7XG4gICAgICAgICAgICAvLyBpLiBMZXQgZXh0ZW5zaW9uIGJlIHRoZSBTdHJpbmcgdmFsdWUgY29uc2lzdGluZyBvZiB0aGUgZmlyc3RcbiAgICAgICAgICAgIC8vICAgIHN1YnN0cmluZyBvZiBsb2NhbGUgdGhhdCBpcyBhIFVuaWNvZGUgbG9jYWxlIGV4dGVuc2lvbiBzZXF1ZW5jZS5cbiAgICAgICAgICAgIHZhciBleHRlbnNpb24gPSBsb2NhbGUubWF0Y2goZXhwVW5pY29kZUV4U2VxKVswXTtcblxuICAgICAgICAgICAgLy8gaWkuIExldCBleHRlbnNpb25JbmRleCBiZSB0aGUgY2hhcmFjdGVyIHBvc2l0aW9uIG9mIHRoZSBpbml0aWFsXG4gICAgICAgICAgICAvLyAgICAgXCItXCIgb2YgdGhlIGZpcnN0IFVuaWNvZGUgbG9jYWxlIGV4dGVuc2lvbiBzZXF1ZW5jZSB3aXRoaW4gbG9jYWxlLlxuICAgICAgICAgICAgdmFyIGV4dGVuc2lvbkluZGV4ID0gbG9jYWxlLmluZGV4T2YoJy11LScpO1xuXG4gICAgICAgICAgICAvLyBpaWkuIFNldCByZXN1bHQuW1tleHRlbnNpb25dXSB0byBleHRlbnNpb24uXG4gICAgICAgICAgICByZXN1bHRbJ1tbZXh0ZW5zaW9uXV0nXSA9IGV4dGVuc2lvbjtcblxuICAgICAgICAgICAgLy8gaXYuIFNldCByZXN1bHQuW1tleHRlbnNpb25JbmRleF1dIHRvIGV4dGVuc2lvbkluZGV4LlxuICAgICAgICAgICAgcmVzdWx0WydbW2V4dGVuc2lvbkluZGV4XV0nXSA9IGV4dGVuc2lvbkluZGV4O1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIDcuIEVsc2VcbiAgICBlbHNlXG4gICAgICAgIC8vIGEuIFNldCByZXN1bHQuW1tsb2NhbGVdXSB0byB0aGUgdmFsdWUgcmV0dXJuZWQgYnkgdGhlIERlZmF1bHRMb2NhbGUgYWJzdHJhY3RcbiAgICAgICAgLy8gICAgb3BlcmF0aW9uIChkZWZpbmVkIGluIDYuMi40KS5cbiAgICAgICAgcmVzdWx0WydbW2xvY2FsZV1dJ10gPSBEZWZhdWx0TG9jYWxlKCk7XG5cbiAgICAvLyA4LiBSZXR1cm4gcmVzdWx0XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGUgQmVzdEZpdE1hdGNoZXIgYWJzdHJhY3Qgb3BlcmF0aW9uIGNvbXBhcmVzIHJlcXVlc3RlZExvY2FsZXMsIHdoaWNoIG11c3QgYmVcbiAqIGEgTGlzdCBhcyByZXR1cm5lZCBieSBDYW5vbmljYWxpemVMb2NhbGVMaXN0LCBhZ2FpbnN0IHRoZSBsb2NhbGVzIGluXG4gKiBhdmFpbGFibGVMb2NhbGVzIGFuZCBkZXRlcm1pbmVzIHRoZSBiZXN0IGF2YWlsYWJsZSBsYW5ndWFnZSB0byBtZWV0IHRoZVxuICogcmVxdWVzdC4gVGhlIGFsZ29yaXRobSBpcyBpbXBsZW1lbnRhdGlvbiBkZXBlbmRlbnQsIGJ1dCBzaG91bGQgcHJvZHVjZSByZXN1bHRzXG4gKiB0aGF0IGEgdHlwaWNhbCB1c2VyIG9mIHRoZSByZXF1ZXN0ZWQgbG9jYWxlcyB3b3VsZCBwZXJjZWl2ZSBhcyBhdCBsZWFzdCBhc1xuICogZ29vZCBhcyB0aG9zZSBwcm9kdWNlZCBieSB0aGUgTG9va3VwTWF0Y2hlciBhYnN0cmFjdCBvcGVyYXRpb24uIE9wdGlvbnNcbiAqIHNwZWNpZmllZCB0aHJvdWdoIFVuaWNvZGUgbG9jYWxlIGV4dGVuc2lvbiBzZXF1ZW5jZXMgbXVzdCBiZSBpZ25vcmVkIGJ5IHRoZVxuICogYWxnb3JpdGhtLiBJbmZvcm1hdGlvbiBhYm91dCBzdWNoIHN1YnNlcXVlbmNlcyBpcyByZXR1cm5lZCBzZXBhcmF0ZWx5LlxuICogVGhlIGFic3RyYWN0IG9wZXJhdGlvbiByZXR1cm5zIGEgcmVjb3JkIHdpdGggYSBbW2xvY2FsZV1dIGZpZWxkLCB3aG9zZSB2YWx1ZVxuICogaXMgdGhlIGxhbmd1YWdlIHRhZyBvZiB0aGUgc2VsZWN0ZWQgbG9jYWxlLCB3aGljaCBtdXN0IGJlIGFuIGVsZW1lbnQgb2ZcbiAqIGF2YWlsYWJsZUxvY2FsZXMuIElmIHRoZSBsYW5ndWFnZSB0YWcgb2YgdGhlIHJlcXVlc3QgbG9jYWxlIHRoYXQgbGVkIHRvIHRoZVxuICogc2VsZWN0ZWQgbG9jYWxlIGNvbnRhaW5lZCBhIFVuaWNvZGUgbG9jYWxlIGV4dGVuc2lvbiBzZXF1ZW5jZSwgdGhlbiB0aGVcbiAqIHJldHVybmVkIHJlY29yZCBhbHNvIGNvbnRhaW5zIGFuIFtbZXh0ZW5zaW9uXV0gZmllbGQgd2hvc2UgdmFsdWUgaXMgdGhlIGZpcnN0XG4gKiBVbmljb2RlIGxvY2FsZSBleHRlbnNpb24gc2VxdWVuY2UsIGFuZCBhbiBbW2V4dGVuc2lvbkluZGV4XV0gZmllbGQgd2hvc2UgdmFsdWVcbiAqIGlzIHRoZSBpbmRleCBvZiB0aGUgZmlyc3QgVW5pY29kZSBsb2NhbGUgZXh0ZW5zaW9uIHNlcXVlbmNlIHdpdGhpbiB0aGUgcmVxdWVzdFxuICogbG9jYWxlIGxhbmd1YWdlIHRhZy5cbiAqL1xuZnVuY3Rpb24gLyogOS4yLjQgKi9CZXN0Rml0TWF0Y2hlcihhdmFpbGFibGVMb2NhbGVzLCByZXF1ZXN0ZWRMb2NhbGVzKSB7XG4gICAgcmV0dXJuIExvb2t1cE1hdGNoZXIoYXZhaWxhYmxlTG9jYWxlcywgcmVxdWVzdGVkTG9jYWxlcyk7XG59XG5cbi8qKlxuICogVGhlIFJlc29sdmVMb2NhbGUgYWJzdHJhY3Qgb3BlcmF0aW9uIGNvbXBhcmVzIGEgQkNQIDQ3IGxhbmd1YWdlIHByaW9yaXR5IGxpc3RcbiAqIHJlcXVlc3RlZExvY2FsZXMgYWdhaW5zdCB0aGUgbG9jYWxlcyBpbiBhdmFpbGFibGVMb2NhbGVzIGFuZCBkZXRlcm1pbmVzIHRoZVxuICogYmVzdCBhdmFpbGFibGUgbGFuZ3VhZ2UgdG8gbWVldCB0aGUgcmVxdWVzdC4gYXZhaWxhYmxlTG9jYWxlcyBhbmRcbiAqIHJlcXVlc3RlZExvY2FsZXMgbXVzdCBiZSBwcm92aWRlZCBhcyBMaXN0IHZhbHVlcywgb3B0aW9ucyBhcyBhIFJlY29yZC5cbiAqL1xuZnVuY3Rpb24gLyogOS4yLjUgKi9SZXNvbHZlTG9jYWxlKGF2YWlsYWJsZUxvY2FsZXMsIHJlcXVlc3RlZExvY2FsZXMsIG9wdGlvbnMsIHJlbGV2YW50RXh0ZW5zaW9uS2V5cywgbG9jYWxlRGF0YSkge1xuICAgIGlmIChhdmFpbGFibGVMb2NhbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ05vIGxvY2FsZSBkYXRhIGhhcyBiZWVuIHByb3ZpZGVkIGZvciB0aGlzIG9iamVjdCB5ZXQuJyk7XG4gICAgfVxuXG4gICAgLy8gVGhlIGZvbGxvd2luZyBzdGVwcyBhcmUgdGFrZW46XG4gICAgLy8gMS4gTGV0IG1hdGNoZXIgYmUgdGhlIHZhbHVlIG9mIG9wdGlvbnMuW1tsb2NhbGVNYXRjaGVyXV0uXG4gICAgdmFyIG1hdGNoZXIgPSBvcHRpb25zWydbW2xvY2FsZU1hdGNoZXJdXSddO1xuXG4gICAgdmFyIHIgPSB2b2lkIDA7XG5cbiAgICAvLyAyLiBJZiBtYXRjaGVyIGlzIFwibG9va3VwXCIsIHRoZW5cbiAgICBpZiAobWF0Y2hlciA9PT0gJ2xvb2t1cCcpXG4gICAgICAgIC8vIGEuIExldCByIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgTG9va3VwTWF0Y2hlciBhYnN0cmFjdCBvcGVyYXRpb25cbiAgICAgICAgLy8gICAgKGRlZmluZWQgaW4gOS4yLjMpIHdpdGggYXJndW1lbnRzIGF2YWlsYWJsZUxvY2FsZXMgYW5kXG4gICAgICAgIC8vICAgIHJlcXVlc3RlZExvY2FsZXMuXG4gICAgICAgIHIgPSBMb29rdXBNYXRjaGVyKGF2YWlsYWJsZUxvY2FsZXMsIHJlcXVlc3RlZExvY2FsZXMpO1xuXG4gICAgICAgIC8vIDMuIEVsc2VcbiAgICBlbHNlXG4gICAgICAgIC8vIGEuIExldCByIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgQmVzdEZpdE1hdGNoZXIgYWJzdHJhY3RcbiAgICAgICAgLy8gICAgb3BlcmF0aW9uIChkZWZpbmVkIGluIDkuMi40KSB3aXRoIGFyZ3VtZW50cyBhdmFpbGFibGVMb2NhbGVzIGFuZFxuICAgICAgICAvLyAgICByZXF1ZXN0ZWRMb2NhbGVzLlxuICAgICAgICByID0gQmVzdEZpdE1hdGNoZXIoYXZhaWxhYmxlTG9jYWxlcywgcmVxdWVzdGVkTG9jYWxlcyk7XG5cbiAgICAvLyA0LiBMZXQgZm91bmRMb2NhbGUgYmUgdGhlIHZhbHVlIG9mIHIuW1tsb2NhbGVdXS5cbiAgICB2YXIgZm91bmRMb2NhbGUgPSByWydbW2xvY2FsZV1dJ107XG5cbiAgICB2YXIgZXh0ZW5zaW9uU3VidGFncyA9IHZvaWQgMCxcbiAgICAgICAgZXh0ZW5zaW9uU3VidGFnc0xlbmd0aCA9IHZvaWQgMDtcblxuICAgIC8vIDUuIElmIHIgaGFzIGFuIFtbZXh0ZW5zaW9uXV0gZmllbGQsIHRoZW5cbiAgICBpZiAoaG9wLmNhbGwociwgJ1tbZXh0ZW5zaW9uXV0nKSkge1xuICAgICAgICAvLyBhLiBMZXQgZXh0ZW5zaW9uIGJlIHRoZSB2YWx1ZSBvZiByLltbZXh0ZW5zaW9uXV0uXG4gICAgICAgIHZhciBleHRlbnNpb24gPSByWydbW2V4dGVuc2lvbl1dJ107XG4gICAgICAgIC8vIGIuIExldCBzcGxpdCBiZSB0aGUgc3RhbmRhcmQgYnVpbHQtaW4gZnVuY3Rpb24gb2JqZWN0IGRlZmluZWQgaW4gRVM1LFxuICAgICAgICAvLyAgICAxNS41LjQuMTQuXG4gICAgICAgIHZhciBzcGxpdCA9IFN0cmluZy5wcm90b3R5cGUuc3BsaXQ7XG4gICAgICAgIC8vIGMuIExldCBleHRlbnNpb25TdWJ0YWdzIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDYWxsXV0gaW50ZXJuYWxcbiAgICAgICAgLy8gICAgbWV0aG9kIG9mIHNwbGl0IHdpdGggZXh0ZW5zaW9uIGFzIHRoZSB0aGlzIHZhbHVlIGFuZCBhbiBhcmd1bWVudFxuICAgICAgICAvLyAgICBsaXN0IGNvbnRhaW5pbmcgdGhlIHNpbmdsZSBpdGVtIFwiLVwiLlxuICAgICAgICBleHRlbnNpb25TdWJ0YWdzID0gc3BsaXQuY2FsbChleHRlbnNpb24sICctJyk7XG4gICAgICAgIC8vIGQuIExldCBleHRlbnNpb25TdWJ0YWdzTGVuZ3RoIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXVxuICAgICAgICAvLyAgICBpbnRlcm5hbCBtZXRob2Qgb2YgZXh0ZW5zaW9uU3VidGFncyB3aXRoIGFyZ3VtZW50IFwibGVuZ3RoXCIuXG4gICAgICAgIGV4dGVuc2lvblN1YnRhZ3NMZW5ndGggPSBleHRlbnNpb25TdWJ0YWdzLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvLyA2LiBMZXQgcmVzdWx0IGJlIGEgbmV3IFJlY29yZC5cbiAgICB2YXIgcmVzdWx0ID0gbmV3IFJlY29yZCgpO1xuXG4gICAgLy8gNy4gU2V0IHJlc3VsdC5bW2RhdGFMb2NhbGVdXSB0byBmb3VuZExvY2FsZS5cbiAgICByZXN1bHRbJ1tbZGF0YUxvY2FsZV1dJ10gPSBmb3VuZExvY2FsZTtcblxuICAgIC8vIDguIExldCBzdXBwb3J0ZWRFeHRlbnNpb24gYmUgXCItdVwiLlxuICAgIHZhciBzdXBwb3J0ZWRFeHRlbnNpb24gPSAnLXUnO1xuICAgIC8vIDkuIExldCBpIGJlIDAuXG4gICAgdmFyIGkgPSAwO1xuICAgIC8vIDEwLiBMZXQgbGVuIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAvLyAgICAgcmVsZXZhbnRFeHRlbnNpb25LZXlzIHdpdGggYXJndW1lbnQgXCJsZW5ndGhcIi5cbiAgICB2YXIgbGVuID0gcmVsZXZhbnRFeHRlbnNpb25LZXlzLmxlbmd0aDtcblxuICAgIC8vIDExIFJlcGVhdCB3aGlsZSBpIDwgbGVuOlxuICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICAgIC8vIGEuIExldCBrZXkgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZlxuICAgICAgICAvLyAgICByZWxldmFudEV4dGVuc2lvbktleXMgd2l0aCBhcmd1bWVudCBUb1N0cmluZyhpKS5cbiAgICAgICAgdmFyIGtleSA9IHJlbGV2YW50RXh0ZW5zaW9uS2V5c1tpXTtcbiAgICAgICAgLy8gYi4gTGV0IGZvdW5kTG9jYWxlRGF0YSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWxcbiAgICAgICAgLy8gICAgbWV0aG9kIG9mIGxvY2FsZURhdGEgd2l0aCB0aGUgYXJndW1lbnQgZm91bmRMb2NhbGUuXG4gICAgICAgIHZhciBmb3VuZExvY2FsZURhdGEgPSBsb2NhbGVEYXRhW2ZvdW5kTG9jYWxlXTtcbiAgICAgICAgLy8gYy4gTGV0IGtleUxvY2FsZURhdGEgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsXG4gICAgICAgIC8vICAgIG1ldGhvZCBvZiBmb3VuZExvY2FsZURhdGEgd2l0aCB0aGUgYXJndW1lbnQga2V5LlxuICAgICAgICB2YXIga2V5TG9jYWxlRGF0YSA9IGZvdW5kTG9jYWxlRGF0YVtrZXldO1xuICAgICAgICAvLyBkLiBMZXQgdmFsdWUgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZlxuICAgICAgICAvLyAgICBrZXlMb2NhbGVEYXRhIHdpdGggYXJndW1lbnQgXCIwXCIuXG4gICAgICAgIHZhciB2YWx1ZSA9IGtleUxvY2FsZURhdGFbJzAnXTtcbiAgICAgICAgLy8gZS4gTGV0IHN1cHBvcnRlZEV4dGVuc2lvbkFkZGl0aW9uIGJlIFwiXCIuXG4gICAgICAgIHZhciBzdXBwb3J0ZWRFeHRlbnNpb25BZGRpdGlvbiA9ICcnO1xuICAgICAgICAvLyBmLiBMZXQgaW5kZXhPZiBiZSB0aGUgc3RhbmRhcmQgYnVpbHQtaW4gZnVuY3Rpb24gb2JqZWN0IGRlZmluZWQgaW5cbiAgICAgICAgLy8gICAgRVM1LCAxNS40LjQuMTQuXG4gICAgICAgIHZhciBpbmRleE9mID0gYXJySW5kZXhPZjtcblxuICAgICAgICAvLyBnLiBJZiBleHRlbnNpb25TdWJ0YWdzIGlzIG5vdCB1bmRlZmluZWQsIHRoZW5cbiAgICAgICAgaWYgKGV4dGVuc2lvblN1YnRhZ3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gaS4gTGV0IGtleVBvcyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbQ2FsbF1dIGludGVybmFsXG4gICAgICAgICAgICAvLyAgICBtZXRob2Qgb2YgaW5kZXhPZiB3aXRoIGV4dGVuc2lvblN1YnRhZ3MgYXMgdGhlIHRoaXMgdmFsdWUgYW5kXG4gICAgICAgICAgICAvLyBhbiBhcmd1bWVudCBsaXN0IGNvbnRhaW5pbmcgdGhlIHNpbmdsZSBpdGVtIGtleS5cbiAgICAgICAgICAgIHZhciBrZXlQb3MgPSBpbmRleE9mLmNhbGwoZXh0ZW5zaW9uU3VidGFncywga2V5KTtcblxuICAgICAgICAgICAgLy8gaWkuIElmIGtleVBvcyDiiaAgLTEsIHRoZW5cbiAgICAgICAgICAgIGlmIChrZXlQb3MgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gMS4gSWYga2V5UG9zICsgMSA8IGV4dGVuc2lvblN1YnRhZ3NMZW5ndGggYW5kIHRoZSBsZW5ndGggb2YgdGhlXG4gICAgICAgICAgICAgICAgLy8gICAgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgICAgICAgICAgICAgLy8gICAgZXh0ZW5zaW9uU3VidGFncyB3aXRoIGFyZ3VtZW50IFRvU3RyaW5nKGtleVBvcyArMSkgaXMgZ3JlYXRlclxuICAgICAgICAgICAgICAgIC8vICAgIHRoYW4gMiwgdGhlblxuICAgICAgICAgICAgICAgIGlmIChrZXlQb3MgKyAxIDwgZXh0ZW5zaW9uU3VidGFnc0xlbmd0aCAmJiBleHRlbnNpb25TdWJ0YWdzW2tleVBvcyArIDFdLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYS4gTGV0IHJlcXVlc3RlZFZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXVxuICAgICAgICAgICAgICAgICAgICAvLyAgICBpbnRlcm5hbCBtZXRob2Qgb2YgZXh0ZW5zaW9uU3VidGFncyB3aXRoIGFyZ3VtZW50XG4gICAgICAgICAgICAgICAgICAgIC8vICAgIFRvU3RyaW5nKGtleVBvcyArIDEpLlxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVxdWVzdGVkVmFsdWUgPSBleHRlbnNpb25TdWJ0YWdzW2tleVBvcyArIDFdO1xuICAgICAgICAgICAgICAgICAgICAvLyBiLiBMZXQgdmFsdWVQb3MgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NhbGxdXVxuICAgICAgICAgICAgICAgICAgICAvLyAgICBpbnRlcm5hbCBtZXRob2Qgb2YgaW5kZXhPZiB3aXRoIGtleUxvY2FsZURhdGEgYXMgdGhlXG4gICAgICAgICAgICAgICAgICAgIC8vICAgIHRoaXMgdmFsdWUgYW5kIGFuIGFyZ3VtZW50IGxpc3QgY29udGFpbmluZyB0aGUgc2luZ2xlXG4gICAgICAgICAgICAgICAgICAgIC8vICAgIGl0ZW0gcmVxdWVzdGVkVmFsdWUuXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZVBvcyA9IGluZGV4T2YuY2FsbChrZXlMb2NhbGVEYXRhLCByZXF1ZXN0ZWRWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gYy4gSWYgdmFsdWVQb3Mg4omgIC0xLCB0aGVuXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZVBvcyAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGkuIExldCB2YWx1ZSBiZSByZXF1ZXN0ZWRWYWx1ZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcmVxdWVzdGVkVmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpaS4gTGV0IHN1cHBvcnRlZEV4dGVuc2lvbkFkZGl0aW9uIGJlIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvbmNhdGVuYXRpb24gb2YgXCItXCIsIGtleSwgXCItXCIsIGFuZCB2YWx1ZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIHN1cHBvcnRlZEV4dGVuc2lvbkFkZGl0aW9uID0gJy0nICsga2V5ICsgJy0nICsgdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gMi4gRWxzZVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYS4gTGV0IHZhbHVlUG9zIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDYWxsXV1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGludGVybmFsIG1ldGhvZCBvZiBpbmRleE9mIHdpdGgga2V5TG9jYWxlRGF0YSBhcyB0aGUgdGhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFsdWUgYW5kIGFuIGFyZ3VtZW50IGxpc3QgY29udGFpbmluZyB0aGUgc2luZ2xlIGl0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwidHJ1ZVwiLlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF92YWx1ZVBvcyA9IGluZGV4T2Yoa2V5TG9jYWxlRGF0YSwgJ3RydWUnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYi4gSWYgdmFsdWVQb3Mg4omgIC0xLCB0aGVuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX3ZhbHVlUG9zICE9PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpLiBMZXQgdmFsdWUgYmUgXCJ0cnVlXCIuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSAndHJ1ZSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBoLiBJZiBvcHRpb25zIGhhcyBhIGZpZWxkIFtbPGtleT5dXSwgdGhlblxuICAgICAgICBpZiAoaG9wLmNhbGwob3B0aW9ucywgJ1tbJyArIGtleSArICddXScpKSB7XG4gICAgICAgICAgICAvLyBpLiBMZXQgb3B0aW9uc1ZhbHVlIGJlIHRoZSB2YWx1ZSBvZiBvcHRpb25zLltbPGtleT5dXS5cbiAgICAgICAgICAgIHZhciBvcHRpb25zVmFsdWUgPSBvcHRpb25zWydbWycgKyBrZXkgKyAnXV0nXTtcblxuICAgICAgICAgICAgLy8gaWkuIElmIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kIG9mIGluZGV4T2ZcbiAgICAgICAgICAgIC8vICAgICB3aXRoIGtleUxvY2FsZURhdGEgYXMgdGhlIHRoaXMgdmFsdWUgYW5kIGFuIGFyZ3VtZW50IGxpc3RcbiAgICAgICAgICAgIC8vICAgICBjb250YWluaW5nIHRoZSBzaW5nbGUgaXRlbSBvcHRpb25zVmFsdWUgaXMgbm90IC0xLCB0aGVuXG4gICAgICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKGtleUxvY2FsZURhdGEsIG9wdGlvbnNWYWx1ZSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gMS4gSWYgb3B0aW9uc1ZhbHVlIGlzIG5vdCBlcXVhbCB0byB2YWx1ZSwgdGhlblxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zVmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGEuIExldCB2YWx1ZSBiZSBvcHRpb25zVmFsdWUuXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gb3B0aW9uc1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAvLyBiLiBMZXQgc3VwcG9ydGVkRXh0ZW5zaW9uQWRkaXRpb24gYmUgXCJcIi5cbiAgICAgICAgICAgICAgICAgICAgc3VwcG9ydGVkRXh0ZW5zaW9uQWRkaXRpb24gPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gaS4gU2V0IHJlc3VsdC5bWzxrZXk+XV0gdG8gdmFsdWUuXG4gICAgICAgIHJlc3VsdFsnW1snICsga2V5ICsgJ11dJ10gPSB2YWx1ZTtcblxuICAgICAgICAvLyBqLiBBcHBlbmQgc3VwcG9ydGVkRXh0ZW5zaW9uQWRkaXRpb24gdG8gc3VwcG9ydGVkRXh0ZW5zaW9uLlxuICAgICAgICBzdXBwb3J0ZWRFeHRlbnNpb24gKz0gc3VwcG9ydGVkRXh0ZW5zaW9uQWRkaXRpb247XG5cbiAgICAgICAgLy8gay4gSW5jcmVhc2UgaSBieSAxLlxuICAgICAgICBpKys7XG4gICAgfVxuICAgIC8vIDEyLiBJZiB0aGUgbGVuZ3RoIG9mIHN1cHBvcnRlZEV4dGVuc2lvbiBpcyBncmVhdGVyIHRoYW4gMiwgdGhlblxuICAgIGlmIChzdXBwb3J0ZWRFeHRlbnNpb24ubGVuZ3RoID4gMikge1xuICAgICAgICAvLyBhLlxuICAgICAgICB2YXIgcHJpdmF0ZUluZGV4ID0gZm91bmRMb2NhbGUuaW5kZXhPZihcIi14LVwiKTtcbiAgICAgICAgLy8gYi5cbiAgICAgICAgaWYgKHByaXZhdGVJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIC8vIGkuXG4gICAgICAgICAgICBmb3VuZExvY2FsZSA9IGZvdW5kTG9jYWxlICsgc3VwcG9ydGVkRXh0ZW5zaW9uO1xuICAgICAgICB9XG4gICAgICAgIC8vIGMuXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGkuXG4gICAgICAgICAgICAgICAgdmFyIHByZUV4dGVuc2lvbiA9IGZvdW5kTG9jYWxlLnN1YnN0cmluZygwLCBwcml2YXRlSW5kZXgpO1xuICAgICAgICAgICAgICAgIC8vIGlpLlxuICAgICAgICAgICAgICAgIHZhciBwb3N0RXh0ZW5zaW9uID0gZm91bmRMb2NhbGUuc3Vic3RyaW5nKHByaXZhdGVJbmRleCk7XG4gICAgICAgICAgICAgICAgLy8gaWlpLlxuICAgICAgICAgICAgICAgIGZvdW5kTG9jYWxlID0gcHJlRXh0ZW5zaW9uICsgc3VwcG9ydGVkRXh0ZW5zaW9uICsgcG9zdEV4dGVuc2lvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgLy8gZC4gYXNzZXJ0aW5nIC0gc2tpcHBpbmdcbiAgICAgICAgLy8gZS5cbiAgICAgICAgZm91bmRMb2NhbGUgPSBDYW5vbmljYWxpemVMYW5ndWFnZVRhZyhmb3VuZExvY2FsZSk7XG4gICAgfVxuICAgIC8vIDEzLiBTZXQgcmVzdWx0LltbbG9jYWxlXV0gdG8gZm91bmRMb2NhbGUuXG4gICAgcmVzdWx0WydbW2xvY2FsZV1dJ10gPSBmb3VuZExvY2FsZTtcblxuICAgIC8vIDE0LiBSZXR1cm4gcmVzdWx0LlxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhlIExvb2t1cFN1cHBvcnRlZExvY2FsZXMgYWJzdHJhY3Qgb3BlcmF0aW9uIHJldHVybnMgdGhlIHN1YnNldCBvZiB0aGVcbiAqIHByb3ZpZGVkIEJDUCA0NyBsYW5ndWFnZSBwcmlvcml0eSBsaXN0IHJlcXVlc3RlZExvY2FsZXMgZm9yIHdoaWNoXG4gKiBhdmFpbGFibGVMb2NhbGVzIGhhcyBhIG1hdGNoaW5nIGxvY2FsZSB3aGVuIHVzaW5nIHRoZSBCQ1AgNDcgTG9va3VwIGFsZ29yaXRobS5cbiAqIExvY2FsZXMgYXBwZWFyIGluIHRoZSBzYW1lIG9yZGVyIGluIHRoZSByZXR1cm5lZCBsaXN0IGFzIGluIHJlcXVlc3RlZExvY2FsZXMuXG4gKiBUaGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAqL1xuZnVuY3Rpb24gLyogOS4yLjYgKi9Mb29rdXBTdXBwb3J0ZWRMb2NhbGVzKGF2YWlsYWJsZUxvY2FsZXMsIHJlcXVlc3RlZExvY2FsZXMpIHtcbiAgICAvLyAxLiBMZXQgbGVuIGJlIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gcmVxdWVzdGVkTG9jYWxlcy5cbiAgICB2YXIgbGVuID0gcmVxdWVzdGVkTG9jYWxlcy5sZW5ndGg7XG4gICAgLy8gMi4gTGV0IHN1YnNldCBiZSBhIG5ldyBlbXB0eSBMaXN0LlxuICAgIHZhciBzdWJzZXQgPSBuZXcgTGlzdCgpO1xuICAgIC8vIDMuIExldCBrIGJlIDAuXG4gICAgdmFyIGsgPSAwO1xuXG4gICAgLy8gNC4gUmVwZWF0IHdoaWxlIGsgPCBsZW5cbiAgICB3aGlsZSAoayA8IGxlbikge1xuICAgICAgICAvLyBhLiBMZXQgbG9jYWxlIGJlIHRoZSBlbGVtZW50IG9mIHJlcXVlc3RlZExvY2FsZXMgYXQgMC1vcmlnaW5lZCBsaXN0XG4gICAgICAgIC8vICAgIHBvc2l0aW9uIGsuXG4gICAgICAgIHZhciBsb2NhbGUgPSByZXF1ZXN0ZWRMb2NhbGVzW2tdO1xuICAgICAgICAvLyBiLiBMZXQgbm9FeHRlbnNpb25zTG9jYWxlIGJlIHRoZSBTdHJpbmcgdmFsdWUgdGhhdCBpcyBsb2NhbGUgd2l0aCBhbGxcbiAgICAgICAgLy8gICAgVW5pY29kZSBsb2NhbGUgZXh0ZW5zaW9uIHNlcXVlbmNlcyByZW1vdmVkLlxuICAgICAgICB2YXIgbm9FeHRlbnNpb25zTG9jYWxlID0gU3RyaW5nKGxvY2FsZSkucmVwbGFjZShleHBVbmljb2RlRXhTZXEsICcnKTtcbiAgICAgICAgLy8gYy4gTGV0IGF2YWlsYWJsZUxvY2FsZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlXG4gICAgICAgIC8vICAgIEJlc3RBdmFpbGFibGVMb2NhbGUgYWJzdHJhY3Qgb3BlcmF0aW9uIChkZWZpbmVkIGluIDkuMi4yKSB3aXRoXG4gICAgICAgIC8vICAgIGFyZ3VtZW50cyBhdmFpbGFibGVMb2NhbGVzIGFuZCBub0V4dGVuc2lvbnNMb2NhbGUuXG4gICAgICAgIHZhciBhdmFpbGFibGVMb2NhbGUgPSBCZXN0QXZhaWxhYmxlTG9jYWxlKGF2YWlsYWJsZUxvY2FsZXMsIG5vRXh0ZW5zaW9uc0xvY2FsZSk7XG5cbiAgICAgICAgLy8gZC4gSWYgYXZhaWxhYmxlTG9jYWxlIGlzIG5vdCB1bmRlZmluZWQsIHRoZW4gYXBwZW5kIGxvY2FsZSB0byB0aGUgZW5kIG9mXG4gICAgICAgIC8vICAgIHN1YnNldC5cbiAgICAgICAgaWYgKGF2YWlsYWJsZUxvY2FsZSAhPT0gdW5kZWZpbmVkKSBhcnJQdXNoLmNhbGwoc3Vic2V0LCBsb2NhbGUpO1xuXG4gICAgICAgIC8vIGUuIEluY3JlbWVudCBrIGJ5IDEuXG4gICAgICAgIGsrKztcbiAgICB9XG5cbiAgICAvLyA1LiBMZXQgc3Vic2V0QXJyYXkgYmUgYSBuZXcgQXJyYXkgb2JqZWN0IHdob3NlIGVsZW1lbnRzIGFyZSB0aGUgc2FtZVxuICAgIC8vICAgIHZhbHVlcyBpbiB0aGUgc2FtZSBvcmRlciBhcyB0aGUgZWxlbWVudHMgb2Ygc3Vic2V0LlxuICAgIHZhciBzdWJzZXRBcnJheSA9IGFyclNsaWNlLmNhbGwoc3Vic2V0KTtcblxuICAgIC8vIDYuIFJldHVybiBzdWJzZXRBcnJheS5cbiAgICByZXR1cm4gc3Vic2V0QXJyYXk7XG59XG5cbi8qKlxuICogVGhlIEJlc3RGaXRTdXBwb3J0ZWRMb2NhbGVzIGFic3RyYWN0IG9wZXJhdGlvbiByZXR1cm5zIHRoZSBzdWJzZXQgb2YgdGhlXG4gKiBwcm92aWRlZCBCQ1AgNDcgbGFuZ3VhZ2UgcHJpb3JpdHkgbGlzdCByZXF1ZXN0ZWRMb2NhbGVzIGZvciB3aGljaFxuICogYXZhaWxhYmxlTG9jYWxlcyBoYXMgYSBtYXRjaGluZyBsb2NhbGUgd2hlbiB1c2luZyB0aGUgQmVzdCBGaXQgTWF0Y2hlclxuICogYWxnb3JpdGhtLiBMb2NhbGVzIGFwcGVhciBpbiB0aGUgc2FtZSBvcmRlciBpbiB0aGUgcmV0dXJuZWQgbGlzdCBhcyBpblxuICogcmVxdWVzdGVkTG9jYWxlcy4gVGhlIHN0ZXBzIHRha2VuIGFyZSBpbXBsZW1lbnRhdGlvbiBkZXBlbmRlbnQuXG4gKi9cbmZ1bmN0aW9uIC8qOS4yLjcgKi9CZXN0Rml0U3VwcG9ydGVkTG9jYWxlcyhhdmFpbGFibGVMb2NhbGVzLCByZXF1ZXN0ZWRMb2NhbGVzKSB7XG4gICAgLy8gIyMjVE9ETzogaW1wbGVtZW50IHRoaXMgZnVuY3Rpb24gYXMgZGVzY3JpYmVkIGJ5IHRoZSBzcGVjaWZpY2F0aW9uIyMjXG4gICAgcmV0dXJuIExvb2t1cFN1cHBvcnRlZExvY2FsZXMoYXZhaWxhYmxlTG9jYWxlcywgcmVxdWVzdGVkTG9jYWxlcyk7XG59XG5cbi8qKlxuICogVGhlIFN1cHBvcnRlZExvY2FsZXMgYWJzdHJhY3Qgb3BlcmF0aW9uIHJldHVybnMgdGhlIHN1YnNldCBvZiB0aGUgcHJvdmlkZWQgQkNQXG4gKiA0NyBsYW5ndWFnZSBwcmlvcml0eSBsaXN0IHJlcXVlc3RlZExvY2FsZXMgZm9yIHdoaWNoIGF2YWlsYWJsZUxvY2FsZXMgaGFzIGFcbiAqIG1hdGNoaW5nIGxvY2FsZS4gVHdvIGFsZ29yaXRobXMgYXJlIGF2YWlsYWJsZSB0byBtYXRjaCB0aGUgbG9jYWxlczogdGhlIExvb2t1cFxuICogYWxnb3JpdGhtIGRlc2NyaWJlZCBpbiBSRkMgNDY0NyBzZWN0aW9uIDMuNCwgYW5kIGFuIGltcGxlbWVudGF0aW9uIGRlcGVuZGVudFxuICogYmVzdC1maXQgYWxnb3JpdGhtLiBMb2NhbGVzIGFwcGVhciBpbiB0aGUgc2FtZSBvcmRlciBpbiB0aGUgcmV0dXJuZWQgbGlzdCBhc1xuICogaW4gcmVxdWVzdGVkTG9jYWxlcy4gVGhlIGZvbGxvd2luZyBzdGVwcyBhcmUgdGFrZW46XG4gKi9cbmZ1bmN0aW9uIC8qOS4yLjggKi9TdXBwb3J0ZWRMb2NhbGVzKGF2YWlsYWJsZUxvY2FsZXMsIHJlcXVlc3RlZExvY2FsZXMsIG9wdGlvbnMpIHtcbiAgICB2YXIgbWF0Y2hlciA9IHZvaWQgMCxcbiAgICAgICAgc3Vic2V0ID0gdm9pZCAwO1xuXG4gICAgLy8gMS4gSWYgb3B0aW9ucyBpcyBub3QgdW5kZWZpbmVkLCB0aGVuXG4gICAgaWYgKG9wdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBhLiBMZXQgb3B0aW9ucyBiZSBUb09iamVjdChvcHRpb25zKS5cbiAgICAgICAgb3B0aW9ucyA9IG5ldyBSZWNvcmQodG9PYmplY3Qob3B0aW9ucykpO1xuICAgICAgICAvLyBiLiBMZXQgbWF0Y2hlciBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgICAgIC8vICAgIG9wdGlvbnMgd2l0aCBhcmd1bWVudCBcImxvY2FsZU1hdGNoZXJcIi5cbiAgICAgICAgbWF0Y2hlciA9IG9wdGlvbnMubG9jYWxlTWF0Y2hlcjtcblxuICAgICAgICAvLyBjLiBJZiBtYXRjaGVyIGlzIG5vdCB1bmRlZmluZWQsIHRoZW5cbiAgICAgICAgaWYgKG1hdGNoZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gaS4gTGV0IG1hdGNoZXIgYmUgVG9TdHJpbmcobWF0Y2hlcikuXG4gICAgICAgICAgICBtYXRjaGVyID0gU3RyaW5nKG1hdGNoZXIpO1xuXG4gICAgICAgICAgICAvLyBpaS4gSWYgbWF0Y2hlciBpcyBub3QgXCJsb29rdXBcIiBvciBcImJlc3QgZml0XCIsIHRoZW4gdGhyb3cgYSBSYW5nZUVycm9yXG4gICAgICAgICAgICAvLyAgICAgZXhjZXB0aW9uLlxuICAgICAgICAgICAgaWYgKG1hdGNoZXIgIT09ICdsb29rdXAnICYmIG1hdGNoZXIgIT09ICdiZXN0IGZpdCcpIHRocm93IG5ldyBSYW5nZUVycm9yKCdtYXRjaGVyIHNob3VsZCBiZSBcImxvb2t1cFwiIG9yIFwiYmVzdCBmaXRcIicpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIDIuIElmIG1hdGNoZXIgaXMgdW5kZWZpbmVkIG9yIFwiYmVzdCBmaXRcIiwgdGhlblxuICAgIGlmIChtYXRjaGVyID09PSB1bmRlZmluZWQgfHwgbWF0Y2hlciA9PT0gJ2Jlc3QgZml0JylcbiAgICAgICAgLy8gYS4gTGV0IHN1YnNldCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEJlc3RGaXRTdXBwb3J0ZWRMb2NhbGVzXG4gICAgICAgIC8vICAgIGFic3RyYWN0IG9wZXJhdGlvbiAoZGVmaW5lZCBpbiA5LjIuNykgd2l0aCBhcmd1bWVudHNcbiAgICAgICAgLy8gICAgYXZhaWxhYmxlTG9jYWxlcyBhbmQgcmVxdWVzdGVkTG9jYWxlcy5cbiAgICAgICAgc3Vic2V0ID0gQmVzdEZpdFN1cHBvcnRlZExvY2FsZXMoYXZhaWxhYmxlTG9jYWxlcywgcmVxdWVzdGVkTG9jYWxlcyk7XG4gICAgICAgIC8vIDMuIEVsc2VcbiAgICBlbHNlXG4gICAgICAgIC8vIGEuIExldCBzdWJzZXQgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBMb29rdXBTdXBwb3J0ZWRMb2NhbGVzXG4gICAgICAgIC8vICAgIGFic3RyYWN0IG9wZXJhdGlvbiAoZGVmaW5lZCBpbiA5LjIuNikgd2l0aCBhcmd1bWVudHNcbiAgICAgICAgLy8gICAgYXZhaWxhYmxlTG9jYWxlcyBhbmQgcmVxdWVzdGVkTG9jYWxlcy5cbiAgICAgICAgc3Vic2V0ID0gTG9va3VwU3VwcG9ydGVkTG9jYWxlcyhhdmFpbGFibGVMb2NhbGVzLCByZXF1ZXN0ZWRMb2NhbGVzKTtcblxuICAgIC8vIDQuIEZvciBlYWNoIG5hbWVkIG93biBwcm9wZXJ0eSBuYW1lIFAgb2Ygc3Vic2V0LFxuICAgIGZvciAodmFyIFAgaW4gc3Vic2V0KSB7XG4gICAgICAgIGlmICghaG9wLmNhbGwoc3Vic2V0LCBQKSkgY29udGludWU7XG5cbiAgICAgICAgLy8gYS4gTGV0IGRlc2MgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldE93blByb3BlcnR5XV0gaW50ZXJuYWxcbiAgICAgICAgLy8gICAgbWV0aG9kIG9mIHN1YnNldCB3aXRoIFAuXG4gICAgICAgIC8vIGIuIFNldCBkZXNjLltbV3JpdGFibGVdXSB0byBmYWxzZS5cbiAgICAgICAgLy8gYy4gU2V0IGRlc2MuW1tDb25maWd1cmFibGVdXSB0byBmYWxzZS5cbiAgICAgICAgLy8gZC4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBzdWJzZXQgd2l0aCBQLCBkZXNjLFxuICAgICAgICAvLyAgICBhbmQgdHJ1ZSBhcyBhcmd1bWVudHMuXG4gICAgICAgIGRlZmluZVByb3BlcnR5KHN1YnNldCwgUCwge1xuICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLCBjb25maWd1cmFibGU6IGZhbHNlLCB2YWx1ZTogc3Vic2V0W1BdXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBcIkZyZWV6ZVwiIHRoZSBhcnJheSBzbyBubyBuZXcgZWxlbWVudHMgY2FuIGJlIGFkZGVkXG4gICAgZGVmaW5lUHJvcGVydHkoc3Vic2V0LCAnbGVuZ3RoJywgeyB3cml0YWJsZTogZmFsc2UgfSk7XG5cbiAgICAvLyA1LiBSZXR1cm4gc3Vic2V0XG4gICAgcmV0dXJuIHN1YnNldDtcbn1cblxuLyoqXG4gKiBUaGUgR2V0T3B0aW9uIGFic3RyYWN0IG9wZXJhdGlvbiBleHRyYWN0cyB0aGUgdmFsdWUgb2YgdGhlIHByb3BlcnR5IG5hbWVkXG4gKiBwcm9wZXJ0eSBmcm9tIHRoZSBwcm92aWRlZCBvcHRpb25zIG9iamVjdCwgY29udmVydHMgaXQgdG8gdGhlIHJlcXVpcmVkIHR5cGUsXG4gKiBjaGVja3Mgd2hldGhlciBpdCBpcyBvbmUgb2YgYSBMaXN0IG9mIGFsbG93ZWQgdmFsdWVzLCBhbmQgZmlsbHMgaW4gYSBmYWxsYmFja1xuICogdmFsdWUgaWYgbmVjZXNzYXJ5LlxuICovXG5mdW5jdGlvbiAvKjkuMi45ICovR2V0T3B0aW9uKG9wdGlvbnMsIHByb3BlcnR5LCB0eXBlLCB2YWx1ZXMsIGZhbGxiYWNrKSB7XG4gICAgLy8gMS4gTGV0IHZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAvLyAgICBvcHRpb25zIHdpdGggYXJndW1lbnQgcHJvcGVydHkuXG4gICAgdmFyIHZhbHVlID0gb3B0aW9uc1twcm9wZXJ0eV07XG5cbiAgICAvLyAyLiBJZiB2YWx1ZSBpcyBub3QgdW5kZWZpbmVkLCB0aGVuXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gYS4gQXNzZXJ0OiB0eXBlIGlzIFwiYm9vbGVhblwiIG9yIFwic3RyaW5nXCIuXG4gICAgICAgIC8vIGIuIElmIHR5cGUgaXMgXCJib29sZWFuXCIsIHRoZW4gbGV0IHZhbHVlIGJlIFRvQm9vbGVhbih2YWx1ZSkuXG4gICAgICAgIC8vIGMuIElmIHR5cGUgaXMgXCJzdHJpbmdcIiwgdGhlbiBsZXQgdmFsdWUgYmUgVG9TdHJpbmcodmFsdWUpLlxuICAgICAgICB2YWx1ZSA9IHR5cGUgPT09ICdib29sZWFuJyA/IEJvb2xlYW4odmFsdWUpIDogdHlwZSA9PT0gJ3N0cmluZycgPyBTdHJpbmcodmFsdWUpIDogdmFsdWU7XG5cbiAgICAgICAgLy8gZC4gSWYgdmFsdWVzIGlzIG5vdCB1bmRlZmluZWQsIHRoZW5cbiAgICAgICAgaWYgKHZhbHVlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBpLiBJZiB2YWx1ZXMgZG9lcyBub3QgY29udGFpbiBhbiBlbGVtZW50IGVxdWFsIHRvIHZhbHVlLCB0aGVuIHRocm93IGFcbiAgICAgICAgICAgIC8vICAgIFJhbmdlRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICAgICAgaWYgKGFyckluZGV4T2YuY2FsbCh2YWx1ZXMsIHZhbHVlKSA9PT0gLTEpIHRocm93IG5ldyBSYW5nZUVycm9yKFwiJ1wiICsgdmFsdWUgKyBcIicgaXMgbm90IGFuIGFsbG93ZWQgdmFsdWUgZm9yIGBcIiArIHByb3BlcnR5ICsgJ2AnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGUuIFJldHVybiB2YWx1ZS5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICAvLyBFbHNlIHJldHVybiBmYWxsYmFjay5cbiAgICByZXR1cm4gZmFsbGJhY2s7XG59XG5cbi8qKlxuICogVGhlIEdldE51bWJlck9wdGlvbiBhYnN0cmFjdCBvcGVyYXRpb24gZXh0cmFjdHMgYSBwcm9wZXJ0eSB2YWx1ZSBmcm9tIHRoZVxuICogcHJvdmlkZWQgb3B0aW9ucyBvYmplY3QsIGNvbnZlcnRzIGl0IHRvIGEgTnVtYmVyIHZhbHVlLCBjaGVja3Mgd2hldGhlciBpdCBpc1xuICogaW4gdGhlIGFsbG93ZWQgcmFuZ2UsIGFuZCBmaWxscyBpbiBhIGZhbGxiYWNrIHZhbHVlIGlmIG5lY2Vzc2FyeS5cbiAqL1xuZnVuY3Rpb24gLyogOS4yLjEwICovR2V0TnVtYmVyT3B0aW9uKG9wdGlvbnMsIHByb3BlcnR5LCBtaW5pbXVtLCBtYXhpbXVtLCBmYWxsYmFjaykge1xuICAgIC8vIDEuIExldCB2YWx1ZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgLy8gICAgb3B0aW9ucyB3aXRoIGFyZ3VtZW50IHByb3BlcnR5LlxuICAgIHZhciB2YWx1ZSA9IG9wdGlvbnNbcHJvcGVydHldO1xuXG4gICAgLy8gMi4gSWYgdmFsdWUgaXMgbm90IHVuZGVmaW5lZCwgdGhlblxuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIGEuIExldCB2YWx1ZSBiZSBUb051bWJlcih2YWx1ZSkuXG4gICAgICAgIHZhbHVlID0gTnVtYmVyKHZhbHVlKTtcblxuICAgICAgICAvLyBiLiBJZiB2YWx1ZSBpcyBOYU4gb3IgbGVzcyB0aGFuIG1pbmltdW0gb3IgZ3JlYXRlciB0aGFuIG1heGltdW0sIHRocm93IGFcbiAgICAgICAgLy8gICAgUmFuZ2VFcnJvciBleGNlcHRpb24uXG4gICAgICAgIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPCBtaW5pbXVtIHx8IHZhbHVlID4gbWF4aW11bSkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1ZhbHVlIGlzIG5vdCBhIG51bWJlciBvciBvdXRzaWRlIGFjY2VwdGVkIHJhbmdlJyk7XG5cbiAgICAgICAgLy8gYy4gUmV0dXJuIGZsb29yKHZhbHVlKS5cbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IodmFsdWUpO1xuICAgIH1cbiAgICAvLyAzLiBFbHNlIHJldHVybiBmYWxsYmFjay5cbiAgICByZXR1cm4gZmFsbGJhY2s7XG59XG5cbi8vIDggVGhlIEludGwgT2JqZWN0XG52YXIgSW50bCA9IHt9O1xuXG4vLyA4LjIgRnVuY3Rpb24gUHJvcGVydGllcyBvZiB0aGUgSW50bCBPYmplY3RcblxuLy8gOC4yLjFcbi8vIEBzcGVjW3RjMzkvZWNtYTQwMi9tYXN0ZXIvc3BlYy9pbnRsLmh0bWxdXG4vLyBAY2xhdXNlW3NlYy1pbnRsLmdldGNhbm9uaWNhbGxvY2FsZXNdXG5JbnRsLmdldENhbm9uaWNhbExvY2FsZXMgPSBmdW5jdGlvbiAobG9jYWxlcykge1xuICAgIC8vIDEuIExldCBsbCBiZSA/IENhbm9uaWNhbGl6ZUxvY2FsZUxpc3QobG9jYWxlcykuXG4gICAgdmFyIGxsID0gQ2Fub25pY2FsaXplTG9jYWxlTGlzdChsb2NhbGVzKTtcbiAgICAvLyAyLiBSZXR1cm4gQ3JlYXRlQXJyYXlGcm9tTGlzdChsbCkuXG4gICAge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAodmFyIGNvZGUgaW4gbGwpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGxsW2NvZGVdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn07XG5cbi8vIEN1cnJlbmN5IG1pbm9yIHVuaXRzIG91dHB1dCBmcm9tIGdldC00MjE3IGdydW50IHRhc2ssIGZvcm1hdHRlZFxudmFyIGN1cnJlbmN5TWlub3JVbml0cyA9IHtcbiAgICBCSEQ6IDMsIEJZUjogMCwgWE9GOiAwLCBCSUY6IDAsIFhBRjogMCwgQ0xGOiA0LCBDTFA6IDAsIEtNRjogMCwgREpGOiAwLFxuICAgIFhQRjogMCwgR05GOiAwLCBJU0s6IDAsIElRRDogMywgSlBZOiAwLCBKT0Q6IDMsIEtSVzogMCwgS1dEOiAzLCBMWUQ6IDMsXG4gICAgT01SOiAzLCBQWUc6IDAsIFJXRjogMCwgVE5EOiAzLCBVR1g6IDAsIFVZSTogMCwgVlVWOiAwLCBWTkQ6IDBcbn07XG5cbi8vIERlZmluZSB0aGUgTnVtYmVyRm9ybWF0IGNvbnN0cnVjdG9yIGludGVybmFsbHkgc28gaXQgY2Fubm90IGJlIHRhaW50ZWRcbmZ1bmN0aW9uIE51bWJlckZvcm1hdENvbnN0cnVjdG9yKCkge1xuICAgIHZhciBsb2NhbGVzID0gYXJndW1lbnRzWzBdO1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzWzFdO1xuXG4gICAgaWYgKCF0aGlzIHx8IHRoaXMgPT09IEludGwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRsLk51bWJlckZvcm1hdChsb2NhbGVzLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gSW5pdGlhbGl6ZU51bWJlckZvcm1hdCh0b09iamVjdCh0aGlzKSwgbG9jYWxlcywgb3B0aW9ucyk7XG59XG5cbmRlZmluZVByb3BlcnR5KEludGwsICdOdW1iZXJGb3JtYXQnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiBOdW1iZXJGb3JtYXRDb25zdHJ1Y3RvclxufSk7XG5cbi8vIE11c3QgZXhwbGljaXRseSBzZXQgcHJvdG90eXBlcyBhcyB1bndyaXRhYmxlXG5kZWZpbmVQcm9wZXJ0eShJbnRsLk51bWJlckZvcm1hdCwgJ3Byb3RvdHlwZScsIHtcbiAgICB3cml0YWJsZTogZmFsc2Vcbn0pO1xuXG4vKipcbiAqIFRoZSBhYnN0cmFjdCBvcGVyYXRpb24gSW5pdGlhbGl6ZU51bWJlckZvcm1hdCBhY2NlcHRzIHRoZSBhcmd1bWVudHNcbiAqIG51bWJlckZvcm1hdCAod2hpY2ggbXVzdCBiZSBhbiBvYmplY3QpLCBsb2NhbGVzLCBhbmQgb3B0aW9ucy4gSXQgaW5pdGlhbGl6ZXNcbiAqIG51bWJlckZvcm1hdCBhcyBhIE51bWJlckZvcm1hdCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIC8qMTEuMS4xLjEgKi9Jbml0aWFsaXplTnVtYmVyRm9ybWF0KG51bWJlckZvcm1hdCwgbG9jYWxlcywgb3B0aW9ucykge1xuICAgIC8vIFRoaXMgd2lsbCBiZSBhIGludGVybmFsIHByb3BlcnRpZXMgb2JqZWN0IGlmIHdlJ3JlIG5vdCBhbHJlYWR5IGluaXRpYWxpemVkXG4gICAgdmFyIGludGVybmFsID0gZ2V0SW50ZXJuYWxQcm9wZXJ0aWVzKG51bWJlckZvcm1hdCk7XG5cbiAgICAvLyBDcmVhdGUgYW4gb2JqZWN0IHdob3NlIHByb3BzIGNhbiBiZSB1c2VkIHRvIHJlc3RvcmUgdGhlIHZhbHVlcyBvZiBSZWdFeHAgcHJvcHNcbiAgICB2YXIgcmVnZXhwU3RhdGUgPSBjcmVhdGVSZWdFeHBSZXN0b3JlKCk7XG5cbiAgICAvLyAxLiBJZiBudW1iZXJGb3JtYXQgaGFzIGFuIFtbaW5pdGlhbGl6ZWRJbnRsT2JqZWN0XV0gaW50ZXJuYWwgcHJvcGVydHkgd2l0aFxuICAgIC8vIHZhbHVlIHRydWUsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICBpZiAoaW50ZXJuYWxbJ1tbaW5pdGlhbGl6ZWRJbnRsT2JqZWN0XV0nXSA9PT0gdHJ1ZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignYHRoaXNgIG9iamVjdCBoYXMgYWxyZWFkeSBiZWVuIGluaXRpYWxpemVkIGFzIGFuIEludGwgb2JqZWN0Jyk7XG5cbiAgICAvLyBOZWVkIHRoaXMgdG8gYWNjZXNzIHRoZSBgaW50ZXJuYWxgIG9iamVjdFxuICAgIGRlZmluZVByb3BlcnR5KG51bWJlckZvcm1hdCwgJ19fZ2V0SW50ZXJuYWxQcm9wZXJ0aWVzJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG4gICAgICAgICAgICAvLyBOT1RFOiBOb24tc3RhbmRhcmQsIGZvciBpbnRlcm5hbCB1c2Ugb25seVxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50c1swXSA9PT0gc2VjcmV0KSByZXR1cm4gaW50ZXJuYWw7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIDIuIFNldCB0aGUgW1tpbml0aWFsaXplZEludGxPYmplY3RdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBudW1iZXJGb3JtYXQgdG8gdHJ1ZS5cbiAgICBpbnRlcm5hbFsnW1tpbml0aWFsaXplZEludGxPYmplY3RdXSddID0gdHJ1ZTtcblxuICAgIC8vIDMuIExldCByZXF1ZXN0ZWRMb2NhbGVzIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgQ2Fub25pY2FsaXplTG9jYWxlTGlzdFxuICAgIC8vICAgIGFic3RyYWN0IG9wZXJhdGlvbiAoZGVmaW5lZCBpbiA5LjIuMSkgd2l0aCBhcmd1bWVudCBsb2NhbGVzLlxuICAgIHZhciByZXF1ZXN0ZWRMb2NhbGVzID0gQ2Fub25pY2FsaXplTG9jYWxlTGlzdChsb2NhbGVzKTtcblxuICAgIC8vIDQuIElmIG9wdGlvbnMgaXMgdW5kZWZpbmVkLCB0aGVuXG4gICAgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgLy8gYS4gTGV0IG9wdGlvbnMgYmUgdGhlIHJlc3VsdCBvZiBjcmVhdGluZyBhIG5ldyBvYmplY3QgYXMgaWYgYnkgdGhlXG4gICAgICAgIC8vIGV4cHJlc3Npb24gbmV3IE9iamVjdCgpIHdoZXJlIE9iamVjdCBpcyB0aGUgc3RhbmRhcmQgYnVpbHQtaW4gY29uc3RydWN0b3JcbiAgICAgICAgLy8gd2l0aCB0aGF0IG5hbWUuXG4gICAgICAgIG9wdGlvbnMgPSB7fTtcblxuICAgICAgICAvLyA1LiBFbHNlXG4gICAgZWxzZVxuICAgICAgICAvLyBhLiBMZXQgb3B0aW9ucyBiZSBUb09iamVjdChvcHRpb25zKS5cbiAgICAgICAgb3B0aW9ucyA9IHRvT2JqZWN0KG9wdGlvbnMpO1xuXG4gICAgLy8gNi4gTGV0IG9wdCBiZSBhIG5ldyBSZWNvcmQuXG4gICAgdmFyIG9wdCA9IG5ldyBSZWNvcmQoKSxcblxuXG4gICAgLy8gNy4gTGV0IG1hdGNoZXIgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXRPcHRpb24gYWJzdHJhY3Qgb3BlcmF0aW9uXG4gICAgLy8gICAgKGRlZmluZWQgaW4gOS4yLjkpIHdpdGggdGhlIGFyZ3VtZW50cyBvcHRpb25zLCBcImxvY2FsZU1hdGNoZXJcIiwgXCJzdHJpbmdcIixcbiAgICAvLyAgICBhIExpc3QgY29udGFpbmluZyB0aGUgdHdvIFN0cmluZyB2YWx1ZXMgXCJsb29rdXBcIiBhbmQgXCJiZXN0IGZpdFwiLCBhbmRcbiAgICAvLyAgICBcImJlc3QgZml0XCIuXG4gICAgbWF0Y2hlciA9IEdldE9wdGlvbihvcHRpb25zLCAnbG9jYWxlTWF0Y2hlcicsICdzdHJpbmcnLCBuZXcgTGlzdCgnbG9va3VwJywgJ2Jlc3QgZml0JyksICdiZXN0IGZpdCcpO1xuXG4gICAgLy8gOC4gU2V0IG9wdC5bW2xvY2FsZU1hdGNoZXJdXSB0byBtYXRjaGVyLlxuICAgIG9wdFsnW1tsb2NhbGVNYXRjaGVyXV0nXSA9IG1hdGNoZXI7XG5cbiAgICAvLyA5LiBMZXQgTnVtYmVyRm9ybWF0IGJlIHRoZSBzdGFuZGFyZCBidWlsdC1pbiBvYmplY3QgdGhhdCBpcyB0aGUgaW5pdGlhbCB2YWx1ZVxuICAgIC8vICAgIG9mIEludGwuTnVtYmVyRm9ybWF0LlxuICAgIC8vIDEwLiBMZXQgbG9jYWxlRGF0YSBiZSB0aGUgdmFsdWUgb2YgdGhlIFtbbG9jYWxlRGF0YV1dIGludGVybmFsIHByb3BlcnR5IG9mXG4gICAgLy8gICAgIE51bWJlckZvcm1hdC5cbiAgICB2YXIgbG9jYWxlRGF0YSA9IGludGVybmFscy5OdW1iZXJGb3JtYXRbJ1tbbG9jYWxlRGF0YV1dJ107XG5cbiAgICAvLyAxMS4gTGV0IHIgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBSZXNvbHZlTG9jYWxlIGFic3RyYWN0IG9wZXJhdGlvblxuICAgIC8vICAgICAoZGVmaW5lZCBpbiA5LjIuNSkgd2l0aCB0aGUgW1thdmFpbGFibGVMb2NhbGVzXV0gaW50ZXJuYWwgcHJvcGVydHkgb2ZcbiAgICAvLyAgICAgTnVtYmVyRm9ybWF0LCByZXF1ZXN0ZWRMb2NhbGVzLCBvcHQsIHRoZSBbW3JlbGV2YW50RXh0ZW5zaW9uS2V5c11dXG4gICAgLy8gICAgIGludGVybmFsIHByb3BlcnR5IG9mIE51bWJlckZvcm1hdCwgYW5kIGxvY2FsZURhdGEuXG4gICAgdmFyIHIgPSBSZXNvbHZlTG9jYWxlKGludGVybmFscy5OdW1iZXJGb3JtYXRbJ1tbYXZhaWxhYmxlTG9jYWxlc11dJ10sIHJlcXVlc3RlZExvY2FsZXMsIG9wdCwgaW50ZXJuYWxzLk51bWJlckZvcm1hdFsnW1tyZWxldmFudEV4dGVuc2lvbktleXNdXSddLCBsb2NhbGVEYXRhKTtcblxuICAgIC8vIDEyLiBTZXQgdGhlIFtbbG9jYWxlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgbnVtYmVyRm9ybWF0IHRvIHRoZSB2YWx1ZSBvZlxuICAgIC8vICAgICByLltbbG9jYWxlXV0uXG4gICAgaW50ZXJuYWxbJ1tbbG9jYWxlXV0nXSA9IHJbJ1tbbG9jYWxlXV0nXTtcblxuICAgIC8vIDEzLiBTZXQgdGhlIFtbbnVtYmVyaW5nU3lzdGVtXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgbnVtYmVyRm9ybWF0IHRvIHRoZSB2YWx1ZVxuICAgIC8vICAgICBvZiByLltbbnVdXS5cbiAgICBpbnRlcm5hbFsnW1tudW1iZXJpbmdTeXN0ZW1dXSddID0gclsnW1tudV1dJ107XG5cbiAgICAvLyBUaGUgc3BlY2lmaWNhdGlvbiBkb2Vzbid0IHRlbGwgdXMgdG8gZG8gdGhpcywgYnV0IGl0J3MgaGVscGZ1bCBsYXRlciBvblxuICAgIGludGVybmFsWydbW2RhdGFMb2NhbGVdXSddID0gclsnW1tkYXRhTG9jYWxlXV0nXTtcblxuICAgIC8vIDE0LiBMZXQgZGF0YUxvY2FsZSBiZSB0aGUgdmFsdWUgb2Ygci5bW2RhdGFMb2NhbGVdXS5cbiAgICB2YXIgZGF0YUxvY2FsZSA9IHJbJ1tbZGF0YUxvY2FsZV1dJ107XG5cbiAgICAvLyAxNS4gTGV0IHMgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXRPcHRpb24gYWJzdHJhY3Qgb3BlcmF0aW9uIHdpdGggdGhlXG4gICAgLy8gICAgIGFyZ3VtZW50cyBvcHRpb25zLCBcInN0eWxlXCIsIFwic3RyaW5nXCIsIGEgTGlzdCBjb250YWluaW5nIHRoZSB0aHJlZSBTdHJpbmdcbiAgICAvLyAgICAgdmFsdWVzIFwiZGVjaW1hbFwiLCBcInBlcmNlbnRcIiwgYW5kIFwiY3VycmVuY3lcIiwgYW5kIFwiZGVjaW1hbFwiLlxuICAgIHZhciBzID0gR2V0T3B0aW9uKG9wdGlvbnMsICdzdHlsZScsICdzdHJpbmcnLCBuZXcgTGlzdCgnZGVjaW1hbCcsICdwZXJjZW50JywgJ2N1cnJlbmN5JyksICdkZWNpbWFsJyk7XG5cbiAgICAvLyAxNi4gU2V0IHRoZSBbW3N0eWxlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgbnVtYmVyRm9ybWF0IHRvIHMuXG4gICAgaW50ZXJuYWxbJ1tbc3R5bGVdXSddID0gcztcblxuICAgIC8vIDE3LiBMZXQgYyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldE9wdGlvbiBhYnN0cmFjdCBvcGVyYXRpb24gd2l0aCB0aGVcbiAgICAvLyAgICAgYXJndW1lbnRzIG9wdGlvbnMsIFwiY3VycmVuY3lcIiwgXCJzdHJpbmdcIiwgdW5kZWZpbmVkLCBhbmQgdW5kZWZpbmVkLlxuICAgIHZhciBjID0gR2V0T3B0aW9uKG9wdGlvbnMsICdjdXJyZW5jeScsICdzdHJpbmcnKTtcblxuICAgIC8vIDE4LiBJZiBjIGlzIG5vdCB1bmRlZmluZWQgYW5kIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGVcbiAgICAvLyAgICAgSXNXZWxsRm9ybWVkQ3VycmVuY3lDb2RlIGFic3RyYWN0IG9wZXJhdGlvbiAoZGVmaW5lZCBpbiA2LjMuMSkgd2l0aFxuICAgIC8vICAgICBhcmd1bWVudCBjIGlzIGZhbHNlLCB0aGVuIHRocm93IGEgUmFuZ2VFcnJvciBleGNlcHRpb24uXG4gICAgaWYgKGMgIT09IHVuZGVmaW5lZCAmJiAhSXNXZWxsRm9ybWVkQ3VycmVuY3lDb2RlKGMpKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIidcIiArIGMgKyBcIicgaXMgbm90IGEgdmFsaWQgY3VycmVuY3kgY29kZVwiKTtcblxuICAgIC8vIDE5LiBJZiBzIGlzIFwiY3VycmVuY3lcIiBhbmQgYyBpcyB1bmRlZmluZWQsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICBpZiAocyA9PT0gJ2N1cnJlbmN5JyAmJiBjID09PSB1bmRlZmluZWQpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0N1cnJlbmN5IGNvZGUgaXMgcmVxdWlyZWQgd2hlbiBzdHlsZSBpcyBjdXJyZW5jeScpO1xuXG4gICAgdmFyIGNEaWdpdHMgPSB2b2lkIDA7XG5cbiAgICAvLyAyMC4gSWYgcyBpcyBcImN1cnJlbmN5XCIsIHRoZW5cbiAgICBpZiAocyA9PT0gJ2N1cnJlbmN5Jykge1xuICAgICAgICAvLyBhLiBMZXQgYyBiZSB0aGUgcmVzdWx0IG9mIGNvbnZlcnRpbmcgYyB0byB1cHBlciBjYXNlIGFzIHNwZWNpZmllZCBpbiA2LjEuXG4gICAgICAgIGMgPSBjLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgLy8gYi4gU2V0IHRoZSBbW2N1cnJlbmN5XV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgbnVtYmVyRm9ybWF0IHRvIGMuXG4gICAgICAgIGludGVybmFsWydbW2N1cnJlbmN5XV0nXSA9IGM7XG5cbiAgICAgICAgLy8gYy4gTGV0IGNEaWdpdHMgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBDdXJyZW5jeURpZ2l0cyBhYnN0cmFjdFxuICAgICAgICAvLyAgICBvcGVyYXRpb24gKGRlZmluZWQgYmVsb3cpIHdpdGggYXJndW1lbnQgYy5cbiAgICAgICAgY0RpZ2l0cyA9IEN1cnJlbmN5RGlnaXRzKGMpO1xuICAgIH1cblxuICAgIC8vIDIxLiBMZXQgY2QgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXRPcHRpb24gYWJzdHJhY3Qgb3BlcmF0aW9uIHdpdGggdGhlXG4gICAgLy8gICAgIGFyZ3VtZW50cyBvcHRpb25zLCBcImN1cnJlbmN5RGlzcGxheVwiLCBcInN0cmluZ1wiLCBhIExpc3QgY29udGFpbmluZyB0aGVcbiAgICAvLyAgICAgdGhyZWUgU3RyaW5nIHZhbHVlcyBcImNvZGVcIiwgXCJzeW1ib2xcIiwgYW5kIFwibmFtZVwiLCBhbmQgXCJzeW1ib2xcIi5cbiAgICB2YXIgY2QgPSBHZXRPcHRpb24ob3B0aW9ucywgJ2N1cnJlbmN5RGlzcGxheScsICdzdHJpbmcnLCBuZXcgTGlzdCgnY29kZScsICdzeW1ib2wnLCAnbmFtZScpLCAnc3ltYm9sJyk7XG5cbiAgICAvLyAyMi4gSWYgcyBpcyBcImN1cnJlbmN5XCIsIHRoZW4gc2V0IHRoZSBbW2N1cnJlbmN5RGlzcGxheV1dIGludGVybmFsIHByb3BlcnR5IG9mXG4gICAgLy8gICAgIG51bWJlckZvcm1hdCB0byBjZC5cbiAgICBpZiAocyA9PT0gJ2N1cnJlbmN5JykgaW50ZXJuYWxbJ1tbY3VycmVuY3lEaXNwbGF5XV0nXSA9IGNkO1xuXG4gICAgLy8gMjMuIExldCBtbmlkIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0TnVtYmVyT3B0aW9uIGFic3RyYWN0IG9wZXJhdGlvblxuICAgIC8vICAgICAoZGVmaW5lZCBpbiA5LjIuMTApIHdpdGggYXJndW1lbnRzIG9wdGlvbnMsIFwibWluaW11bUludGVnZXJEaWdpdHNcIiwgMSwgMjEsXG4gICAgLy8gICAgIGFuZCAxLlxuICAgIHZhciBtbmlkID0gR2V0TnVtYmVyT3B0aW9uKG9wdGlvbnMsICdtaW5pbXVtSW50ZWdlckRpZ2l0cycsIDEsIDIxLCAxKTtcblxuICAgIC8vIDI0LiBTZXQgdGhlIFtbbWluaW11bUludGVnZXJEaWdpdHNdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBudW1iZXJGb3JtYXQgdG8gbW5pZC5cbiAgICBpbnRlcm5hbFsnW1ttaW5pbXVtSW50ZWdlckRpZ2l0c11dJ10gPSBtbmlkO1xuXG4gICAgLy8gMjUuIElmIHMgaXMgXCJjdXJyZW5jeVwiLCB0aGVuIGxldCBtbmZkRGVmYXVsdCBiZSBjRGlnaXRzOyBlbHNlIGxldCBtbmZkRGVmYXVsdFxuICAgIC8vICAgICBiZSAwLlxuICAgIHZhciBtbmZkRGVmYXVsdCA9IHMgPT09ICdjdXJyZW5jeScgPyBjRGlnaXRzIDogMDtcblxuICAgIC8vIDI2LiBMZXQgbW5mZCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldE51bWJlck9wdGlvbiBhYnN0cmFjdCBvcGVyYXRpb25cbiAgICAvLyAgICAgd2l0aCBhcmd1bWVudHMgb3B0aW9ucywgXCJtaW5pbXVtRnJhY3Rpb25EaWdpdHNcIiwgMCwgMjAsIGFuZCBtbmZkRGVmYXVsdC5cbiAgICB2YXIgbW5mZCA9IEdldE51bWJlck9wdGlvbihvcHRpb25zLCAnbWluaW11bUZyYWN0aW9uRGlnaXRzJywgMCwgMjAsIG1uZmREZWZhdWx0KTtcblxuICAgIC8vIDI3LiBTZXQgdGhlIFtbbWluaW11bUZyYWN0aW9uRGlnaXRzXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgbnVtYmVyRm9ybWF0IHRvIG1uZmQuXG4gICAgaW50ZXJuYWxbJ1tbbWluaW11bUZyYWN0aW9uRGlnaXRzXV0nXSA9IG1uZmQ7XG5cbiAgICAvLyAyOC4gSWYgcyBpcyBcImN1cnJlbmN5XCIsIHRoZW4gbGV0IG14ZmREZWZhdWx0IGJlIG1heChtbmZkLCBjRGlnaXRzKTsgZWxzZSBpZiBzXG4gICAgLy8gICAgIGlzIFwicGVyY2VudFwiLCB0aGVuIGxldCBteGZkRGVmYXVsdCBiZSBtYXgobW5mZCwgMCk7IGVsc2UgbGV0IG14ZmREZWZhdWx0XG4gICAgLy8gICAgIGJlIG1heChtbmZkLCAzKS5cbiAgICB2YXIgbXhmZERlZmF1bHQgPSBzID09PSAnY3VycmVuY3knID8gTWF0aC5tYXgobW5mZCwgY0RpZ2l0cykgOiBzID09PSAncGVyY2VudCcgPyBNYXRoLm1heChtbmZkLCAwKSA6IE1hdGgubWF4KG1uZmQsIDMpO1xuXG4gICAgLy8gMjkuIExldCBteGZkIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0TnVtYmVyT3B0aW9uIGFic3RyYWN0IG9wZXJhdGlvblxuICAgIC8vICAgICB3aXRoIGFyZ3VtZW50cyBvcHRpb25zLCBcIm1heGltdW1GcmFjdGlvbkRpZ2l0c1wiLCBtbmZkLCAyMCwgYW5kIG14ZmREZWZhdWx0LlxuICAgIHZhciBteGZkID0gR2V0TnVtYmVyT3B0aW9uKG9wdGlvbnMsICdtYXhpbXVtRnJhY3Rpb25EaWdpdHMnLCBtbmZkLCAyMCwgbXhmZERlZmF1bHQpO1xuXG4gICAgLy8gMzAuIFNldCB0aGUgW1ttYXhpbXVtRnJhY3Rpb25EaWdpdHNdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBudW1iZXJGb3JtYXQgdG8gbXhmZC5cbiAgICBpbnRlcm5hbFsnW1ttYXhpbXVtRnJhY3Rpb25EaWdpdHNdXSddID0gbXhmZDtcblxuICAgIC8vIDMxLiBMZXQgbW5zZCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mIG9wdGlvbnNcbiAgICAvLyAgICAgd2l0aCBhcmd1bWVudCBcIm1pbmltdW1TaWduaWZpY2FudERpZ2l0c1wiLlxuICAgIHZhciBtbnNkID0gb3B0aW9ucy5taW5pbXVtU2lnbmlmaWNhbnREaWdpdHM7XG5cbiAgICAvLyAzMi4gTGV0IG14c2QgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZiBvcHRpb25zXG4gICAgLy8gICAgIHdpdGggYXJndW1lbnQgXCJtYXhpbXVtU2lnbmlmaWNhbnREaWdpdHNcIi5cbiAgICB2YXIgbXhzZCA9IG9wdGlvbnMubWF4aW11bVNpZ25pZmljYW50RGlnaXRzO1xuXG4gICAgLy8gMzMuIElmIG1uc2QgaXMgbm90IHVuZGVmaW5lZCBvciBteHNkIGlzIG5vdCB1bmRlZmluZWQsIHRoZW46XG4gICAgaWYgKG1uc2QgIT09IHVuZGVmaW5lZCB8fCBteHNkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gYS4gTGV0IG1uc2QgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXROdW1iZXJPcHRpb24gYWJzdHJhY3RcbiAgICAgICAgLy8gICAgb3BlcmF0aW9uIHdpdGggYXJndW1lbnRzIG9wdGlvbnMsIFwibWluaW11bVNpZ25pZmljYW50RGlnaXRzXCIsIDEsIDIxLFxuICAgICAgICAvLyAgICBhbmQgMS5cbiAgICAgICAgbW5zZCA9IEdldE51bWJlck9wdGlvbihvcHRpb25zLCAnbWluaW11bVNpZ25pZmljYW50RGlnaXRzJywgMSwgMjEsIDEpO1xuXG4gICAgICAgIC8vIGIuIExldCBteHNkIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0TnVtYmVyT3B0aW9uIGFic3RyYWN0XG4gICAgICAgIC8vICAgICBvcGVyYXRpb24gd2l0aCBhcmd1bWVudHMgb3B0aW9ucywgXCJtYXhpbXVtU2lnbmlmaWNhbnREaWdpdHNcIiwgbW5zZCxcbiAgICAgICAgLy8gICAgIDIxLCBhbmQgMjEuXG4gICAgICAgIG14c2QgPSBHZXROdW1iZXJPcHRpb24ob3B0aW9ucywgJ21heGltdW1TaWduaWZpY2FudERpZ2l0cycsIG1uc2QsIDIxLCAyMSk7XG5cbiAgICAgICAgLy8gYy4gU2V0IHRoZSBbW21pbmltdW1TaWduaWZpY2FudERpZ2l0c11dIGludGVybmFsIHByb3BlcnR5IG9mIG51bWJlckZvcm1hdFxuICAgICAgICAvLyAgICB0byBtbnNkLCBhbmQgdGhlIFtbbWF4aW11bVNpZ25pZmljYW50RGlnaXRzXV0gaW50ZXJuYWwgcHJvcGVydHkgb2ZcbiAgICAgICAgLy8gICAgbnVtYmVyRm9ybWF0IHRvIG14c2QuXG4gICAgICAgIGludGVybmFsWydbW21pbmltdW1TaWduaWZpY2FudERpZ2l0c11dJ10gPSBtbnNkO1xuICAgICAgICBpbnRlcm5hbFsnW1ttYXhpbXVtU2lnbmlmaWNhbnREaWdpdHNdXSddID0gbXhzZDtcbiAgICB9XG4gICAgLy8gMzQuIExldCBnIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0T3B0aW9uIGFic3RyYWN0IG9wZXJhdGlvbiB3aXRoIHRoZVxuICAgIC8vICAgICBhcmd1bWVudHMgb3B0aW9ucywgXCJ1c2VHcm91cGluZ1wiLCBcImJvb2xlYW5cIiwgdW5kZWZpbmVkLCBhbmQgdHJ1ZS5cbiAgICB2YXIgZyA9IEdldE9wdGlvbihvcHRpb25zLCAndXNlR3JvdXBpbmcnLCAnYm9vbGVhbicsIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cbiAgICAvLyAzNS4gU2V0IHRoZSBbW3VzZUdyb3VwaW5nXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgbnVtYmVyRm9ybWF0IHRvIGcuXG4gICAgaW50ZXJuYWxbJ1tbdXNlR3JvdXBpbmddXSddID0gZztcblxuICAgIC8vIDM2LiBMZXQgZGF0YUxvY2FsZURhdGEgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZlxuICAgIC8vICAgICBsb2NhbGVEYXRhIHdpdGggYXJndW1lbnQgZGF0YUxvY2FsZS5cbiAgICB2YXIgZGF0YUxvY2FsZURhdGEgPSBsb2NhbGVEYXRhW2RhdGFMb2NhbGVdO1xuXG4gICAgLy8gMzcuIExldCBwYXR0ZXJucyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgLy8gICAgIGRhdGFMb2NhbGVEYXRhIHdpdGggYXJndW1lbnQgXCJwYXR0ZXJuc1wiLlxuICAgIHZhciBwYXR0ZXJucyA9IGRhdGFMb2NhbGVEYXRhLnBhdHRlcm5zO1xuXG4gICAgLy8gMzguIEFzc2VydDogcGF0dGVybnMgaXMgYW4gb2JqZWN0IChzZWUgMTEuMi4zKVxuXG4gICAgLy8gMzkuIExldCBzdHlsZVBhdHRlcm5zIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAvLyAgICAgcGF0dGVybnMgd2l0aCBhcmd1bWVudCBzLlxuICAgIHZhciBzdHlsZVBhdHRlcm5zID0gcGF0dGVybnNbc107XG5cbiAgICAvLyA0MC4gU2V0IHRoZSBbW3Bvc2l0aXZlUGF0dGVybl1dIGludGVybmFsIHByb3BlcnR5IG9mIG51bWJlckZvcm1hdCB0byB0aGVcbiAgICAvLyAgICAgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mIHN0eWxlUGF0dGVybnMgd2l0aCB0aGVcbiAgICAvLyAgICAgYXJndW1lbnQgXCJwb3NpdGl2ZVBhdHRlcm5cIi5cbiAgICBpbnRlcm5hbFsnW1twb3NpdGl2ZVBhdHRlcm5dXSddID0gc3R5bGVQYXR0ZXJucy5wb3NpdGl2ZVBhdHRlcm47XG5cbiAgICAvLyA0MS4gU2V0IHRoZSBbW25lZ2F0aXZlUGF0dGVybl1dIGludGVybmFsIHByb3BlcnR5IG9mIG51bWJlckZvcm1hdCB0byB0aGVcbiAgICAvLyAgICAgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mIHN0eWxlUGF0dGVybnMgd2l0aCB0aGVcbiAgICAvLyAgICAgYXJndW1lbnQgXCJuZWdhdGl2ZVBhdHRlcm5cIi5cbiAgICBpbnRlcm5hbFsnW1tuZWdhdGl2ZVBhdHRlcm5dXSddID0gc3R5bGVQYXR0ZXJucy5uZWdhdGl2ZVBhdHRlcm47XG5cbiAgICAvLyA0Mi4gU2V0IHRoZSBbW2JvdW5kRm9ybWF0XV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgbnVtYmVyRm9ybWF0IHRvIHVuZGVmaW5lZC5cbiAgICBpbnRlcm5hbFsnW1tib3VuZEZvcm1hdF1dJ10gPSB1bmRlZmluZWQ7XG5cbiAgICAvLyA0My4gU2V0IHRoZSBbW2luaXRpYWxpemVkTnVtYmVyRm9ybWF0XV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgbnVtYmVyRm9ybWF0IHRvXG4gICAgLy8gICAgIHRydWUuXG4gICAgaW50ZXJuYWxbJ1tbaW5pdGlhbGl6ZWROdW1iZXJGb3JtYXRdXSddID0gdHJ1ZTtcblxuICAgIC8vIEluIEVTMywgd2UgbmVlZCB0byBwcmUtYmluZCB0aGUgZm9ybWF0KCkgZnVuY3Rpb25cbiAgICBpZiAoZXMzKSBudW1iZXJGb3JtYXQuZm9ybWF0ID0gR2V0Rm9ybWF0TnVtYmVyLmNhbGwobnVtYmVyRm9ybWF0KTtcblxuICAgIC8vIFJlc3RvcmUgdGhlIFJlZ0V4cCBwcm9wZXJ0aWVzXG4gICAgcmVnZXhwU3RhdGUuZXhwLnRlc3QocmVnZXhwU3RhdGUuaW5wdXQpO1xuXG4gICAgLy8gUmV0dXJuIHRoZSBuZXdseSBpbml0aWFsaXNlZCBvYmplY3RcbiAgICByZXR1cm4gbnVtYmVyRm9ybWF0O1xufVxuXG5mdW5jdGlvbiBDdXJyZW5jeURpZ2l0cyhjdXJyZW5jeSkge1xuICAgIC8vIFdoZW4gdGhlIEN1cnJlbmN5RGlnaXRzIGFic3RyYWN0IG9wZXJhdGlvbiBpcyBjYWxsZWQgd2l0aCBhbiBhcmd1bWVudCBjdXJyZW5jeVxuICAgIC8vICh3aGljaCBtdXN0IGJlIGFuIHVwcGVyIGNhc2UgU3RyaW5nIHZhbHVlKSwgdGhlIGZvbGxvd2luZyBzdGVwcyBhcmUgdGFrZW46XG5cbiAgICAvLyAxLiBJZiB0aGUgSVNPIDQyMTcgY3VycmVuY3kgYW5kIGZ1bmRzIGNvZGUgbGlzdCBjb250YWlucyBjdXJyZW5jeSBhcyBhblxuICAgIC8vIGFscGhhYmV0aWMgY29kZSwgdGhlbiByZXR1cm4gdGhlIG1pbm9yIHVuaXQgdmFsdWUgY29ycmVzcG9uZGluZyB0byB0aGVcbiAgICAvLyBjdXJyZW5jeSBmcm9tIHRoZSBsaXN0OyBlbHNlIHJldHVybiAyLlxuICAgIHJldHVybiBjdXJyZW5jeU1pbm9yVW5pdHNbY3VycmVuY3ldICE9PSB1bmRlZmluZWQgPyBjdXJyZW5jeU1pbm9yVW5pdHNbY3VycmVuY3ldIDogMjtcbn1cblxuLyogMTEuMi4zICovaW50ZXJuYWxzLk51bWJlckZvcm1hdCA9IHtcbiAgICAnW1thdmFpbGFibGVMb2NhbGVzXV0nOiBbXSxcbiAgICAnW1tyZWxldmFudEV4dGVuc2lvbktleXNdXSc6IFsnbnUnXSxcbiAgICAnW1tsb2NhbGVEYXRhXV0nOiB7fVxufTtcblxuLyoqXG4gKiBXaGVuIHRoZSBzdXBwb3J0ZWRMb2NhbGVzT2YgbWV0aG9kIG9mIEludGwuTnVtYmVyRm9ybWF0IGlzIGNhbGxlZCwgdGhlXG4gKiBmb2xsb3dpbmcgc3RlcHMgYXJlIHRha2VuOlxuICovXG4vKiAxMS4yLjIgKi9cbmRlZmluZVByb3BlcnR5KEludGwuTnVtYmVyRm9ybWF0LCAnc3VwcG9ydGVkTG9jYWxlc09mJywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogZm5CaW5kLmNhbGwoZnVuY3Rpb24gKGxvY2FsZXMpIHtcbiAgICAgICAgLy8gQm91bmQgZnVuY3Rpb25zIG9ubHkgaGF2ZSB0aGUgYHRoaXNgIHZhbHVlIGFsdGVyZWQgaWYgYmVpbmcgdXNlZCBhcyBhIGNvbnN0cnVjdG9yLFxuICAgICAgICAvLyB0aGlzIGxldHMgdXMgaW1pdGF0ZSBhIG5hdGl2ZSBmdW5jdGlvbiB0aGF0IGhhcyBubyBjb25zdHJ1Y3RvclxuICAgICAgICBpZiAoIWhvcC5jYWxsKHRoaXMsICdbW2F2YWlsYWJsZUxvY2FsZXNdXScpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdXBwb3J0ZWRMb2NhbGVzT2YoKSBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuXG4gICAgICAgIC8vIENyZWF0ZSBhbiBvYmplY3Qgd2hvc2UgcHJvcHMgY2FuIGJlIHVzZWQgdG8gcmVzdG9yZSB0aGUgdmFsdWVzIG9mIFJlZ0V4cCBwcm9wc1xuICAgICAgICB2YXIgcmVnZXhwU3RhdGUgPSBjcmVhdGVSZWdFeHBSZXN0b3JlKCksXG5cblxuICAgICAgICAvLyAxLiBJZiBvcHRpb25zIGlzIG5vdCBwcm92aWRlZCwgdGhlbiBsZXQgb3B0aW9ucyBiZSB1bmRlZmluZWQuXG4gICAgICAgIG9wdGlvbnMgPSBhcmd1bWVudHNbMV0sXG5cblxuICAgICAgICAvLyAyLiBMZXQgYXZhaWxhYmxlTG9jYWxlcyBiZSB0aGUgdmFsdWUgb2YgdGhlIFtbYXZhaWxhYmxlTG9jYWxlc11dIGludGVybmFsXG4gICAgICAgIC8vICAgIHByb3BlcnR5IG9mIHRoZSBzdGFuZGFyZCBidWlsdC1pbiBvYmplY3QgdGhhdCBpcyB0aGUgaW5pdGlhbCB2YWx1ZSBvZlxuICAgICAgICAvLyAgICBJbnRsLk51bWJlckZvcm1hdC5cblxuICAgICAgICBhdmFpbGFibGVMb2NhbGVzID0gdGhpc1snW1thdmFpbGFibGVMb2NhbGVzXV0nXSxcblxuXG4gICAgICAgIC8vIDMuIExldCByZXF1ZXN0ZWRMb2NhbGVzIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgQ2Fub25pY2FsaXplTG9jYWxlTGlzdFxuICAgICAgICAvLyAgICBhYnN0cmFjdCBvcGVyYXRpb24gKGRlZmluZWQgaW4gOS4yLjEpIHdpdGggYXJndW1lbnQgbG9jYWxlcy5cbiAgICAgICAgcmVxdWVzdGVkTG9jYWxlcyA9IENhbm9uaWNhbGl6ZUxvY2FsZUxpc3QobG9jYWxlcyk7XG5cbiAgICAgICAgLy8gUmVzdG9yZSB0aGUgUmVnRXhwIHByb3BlcnRpZXNcbiAgICAgICAgcmVnZXhwU3RhdGUuZXhwLnRlc3QocmVnZXhwU3RhdGUuaW5wdXQpO1xuXG4gICAgICAgIC8vIDQuIFJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFN1cHBvcnRlZExvY2FsZXMgYWJzdHJhY3Qgb3BlcmF0aW9uXG4gICAgICAgIC8vICAgIChkZWZpbmVkIGluIDkuMi44KSB3aXRoIGFyZ3VtZW50cyBhdmFpbGFibGVMb2NhbGVzLCByZXF1ZXN0ZWRMb2NhbGVzLFxuICAgICAgICAvLyAgICBhbmQgb3B0aW9ucy5cbiAgICAgICAgcmV0dXJuIFN1cHBvcnRlZExvY2FsZXMoYXZhaWxhYmxlTG9jYWxlcywgcmVxdWVzdGVkTG9jYWxlcywgb3B0aW9ucyk7XG4gICAgfSwgaW50ZXJuYWxzLk51bWJlckZvcm1hdClcbn0pO1xuXG4vKipcbiAqIFRoaXMgbmFtZWQgYWNjZXNzb3IgcHJvcGVydHkgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgZm9ybWF0cyBhIG51bWJlclxuICogYWNjb3JkaW5nIHRvIHRoZSBlZmZlY3RpdmUgbG9jYWxlIGFuZCB0aGUgZm9ybWF0dGluZyBvcHRpb25zIG9mIHRoaXNcbiAqIE51bWJlckZvcm1hdCBvYmplY3QuXG4gKi9cbi8qIDExLjMuMiAqL2RlZmluZVByb3BlcnR5KEludGwuTnVtYmVyRm9ybWF0LnByb3RvdHlwZSwgJ2Zvcm1hdCcsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBHZXRGb3JtYXROdW1iZXJcbn0pO1xuXG5mdW5jdGlvbiBHZXRGb3JtYXROdW1iZXIoKSB7XG4gICAgdmFyIGludGVybmFsID0gdGhpcyAhPT0gbnVsbCAmJiBiYWJlbEhlbHBlcnNbXCJ0eXBlb2ZcIl0odGhpcykgPT09ICdvYmplY3QnICYmIGdldEludGVybmFsUHJvcGVydGllcyh0aGlzKTtcblxuICAgIC8vIFNhdGlzZnkgdGVzdCAxMS4zX2JcbiAgICBpZiAoIWludGVybmFsIHx8ICFpbnRlcm5hbFsnW1tpbml0aWFsaXplZE51bWJlckZvcm1hdF1dJ10pIHRocm93IG5ldyBUeXBlRXJyb3IoJ2B0aGlzYCB2YWx1ZSBmb3IgZm9ybWF0KCkgaXMgbm90IGFuIGluaXRpYWxpemVkIEludGwuTnVtYmVyRm9ybWF0IG9iamVjdC4nKTtcblxuICAgIC8vIFRoZSB2YWx1ZSBvZiB0aGUgW1tHZXRdXSBhdHRyaWJ1dGUgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIHRoZSBmb2xsb3dpbmdcbiAgICAvLyBzdGVwczpcblxuICAgIC8vIDEuIElmIHRoZSBbW2JvdW5kRm9ybWF0XV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgdGhpcyBOdW1iZXJGb3JtYXQgb2JqZWN0XG4gICAgLy8gICAgaXMgdW5kZWZpbmVkLCB0aGVuOlxuICAgIGlmIChpbnRlcm5hbFsnW1tib3VuZEZvcm1hdF1dJ10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBhLiBMZXQgRiBiZSBhIEZ1bmN0aW9uIG9iamVjdCwgd2l0aCBpbnRlcm5hbCBwcm9wZXJ0aWVzIHNldCBhc1xuICAgICAgICAvLyAgICBzcGVjaWZpZWQgZm9yIGJ1aWx0LWluIGZ1bmN0aW9ucyBpbiBFUzUsIDE1LCBvciBzdWNjZXNzb3IsIGFuZCB0aGVcbiAgICAgICAgLy8gICAgbGVuZ3RoIHByb3BlcnR5IHNldCB0byAxLCB0aGF0IHRha2VzIHRoZSBhcmd1bWVudCB2YWx1ZSBhbmRcbiAgICAgICAgLy8gICAgcGVyZm9ybXMgdGhlIGZvbGxvd2luZyBzdGVwczpcbiAgICAgICAgdmFyIEYgPSBmdW5jdGlvbiBGKHZhbHVlKSB7XG4gICAgICAgICAgICAvLyBpLiBJZiB2YWx1ZSBpcyBub3QgcHJvdmlkZWQsIHRoZW4gbGV0IHZhbHVlIGJlIHVuZGVmaW5lZC5cbiAgICAgICAgICAgIC8vIGlpLiBMZXQgeCBiZSBUb051bWJlcih2YWx1ZSkuXG4gICAgICAgICAgICAvLyBpaWkuIFJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEZvcm1hdE51bWJlciBhYnN0cmFjdFxuICAgICAgICAgICAgLy8gICAgICBvcGVyYXRpb24gKGRlZmluZWQgYmVsb3cpIHdpdGggYXJndW1lbnRzIHRoaXMgYW5kIHguXG4gICAgICAgICAgICByZXR1cm4gRm9ybWF0TnVtYmVyKHRoaXMsIC8qIHggPSAqL051bWJlcih2YWx1ZSkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGIuIExldCBiaW5kIGJlIHRoZSBzdGFuZGFyZCBidWlsdC1pbiBmdW5jdGlvbiBvYmplY3QgZGVmaW5lZCBpbiBFUzUsXG4gICAgICAgIC8vICAgIDE1LjMuNC41LlxuICAgICAgICAvLyBjLiBMZXQgYmYgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAgICAgLy8gICAgYmluZCB3aXRoIEYgYXMgdGhlIHRoaXMgdmFsdWUgYW5kIGFuIGFyZ3VtZW50IGxpc3QgY29udGFpbmluZ1xuICAgICAgICAvLyAgICB0aGUgc2luZ2xlIGl0ZW0gdGhpcy5cbiAgICAgICAgdmFyIGJmID0gZm5CaW5kLmNhbGwoRiwgdGhpcyk7XG5cbiAgICAgICAgLy8gZC4gU2V0IHRoZSBbW2JvdW5kRm9ybWF0XV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgdGhpcyBOdW1iZXJGb3JtYXRcbiAgICAgICAgLy8gICAgb2JqZWN0IHRvIGJmLlxuICAgICAgICBpbnRlcm5hbFsnW1tib3VuZEZvcm1hdF1dJ10gPSBiZjtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHRoZSB2YWx1ZSBvZiB0aGUgW1tib3VuZEZvcm1hdF1dIGludGVybmFsIHByb3BlcnR5IG9mIHRoaXNcbiAgICAvLyBOdW1iZXJGb3JtYXQgb2JqZWN0LlxuICAgIHJldHVybiBpbnRlcm5hbFsnW1tib3VuZEZvcm1hdF1dJ107XG59XG5cbkludGwuTnVtYmVyRm9ybWF0LnByb3RvdHlwZS5mb3JtYXRUb1BhcnRzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIGludGVybmFsID0gdGhpcyAhPT0gbnVsbCAmJiBiYWJlbEhlbHBlcnNbXCJ0eXBlb2ZcIl0odGhpcykgPT09ICdvYmplY3QnICYmIGdldEludGVybmFsUHJvcGVydGllcyh0aGlzKTtcbiAgICBpZiAoIWludGVybmFsIHx8ICFpbnRlcm5hbFsnW1tpbml0aWFsaXplZE51bWJlckZvcm1hdF1dJ10pIHRocm93IG5ldyBUeXBlRXJyb3IoJ2B0aGlzYCB2YWx1ZSBmb3IgZm9ybWF0VG9QYXJ0cygpIGlzIG5vdCBhbiBpbml0aWFsaXplZCBJbnRsLk51bWJlckZvcm1hdCBvYmplY3QuJyk7XG5cbiAgICB2YXIgeCA9IE51bWJlcih2YWx1ZSk7XG4gICAgcmV0dXJuIEZvcm1hdE51bWJlclRvUGFydHModGhpcywgeCk7XG59O1xuXG4vKlxuICogQHNwZWNbc3Rhc20vZWNtYTQwMi9udW1iZXItZm9ybWF0LXRvLXBhcnRzL3NwZWMvbnVtYmVyZm9ybWF0Lmh0bWxdXG4gKiBAY2xhdXNlW3NlYy1mb3JtYXRudW1iZXJ0b3BhcnRzXVxuICovXG5mdW5jdGlvbiBGb3JtYXROdW1iZXJUb1BhcnRzKG51bWJlckZvcm1hdCwgeCkge1xuICAgIC8vIDEuIExldCBwYXJ0cyBiZSA/IFBhcnRpdGlvbk51bWJlclBhdHRlcm4obnVtYmVyRm9ybWF0LCB4KS5cbiAgICB2YXIgcGFydHMgPSBQYXJ0aXRpb25OdW1iZXJQYXR0ZXJuKG51bWJlckZvcm1hdCwgeCk7XG4gICAgLy8gMi4gTGV0IHJlc3VsdCBiZSBBcnJheUNyZWF0ZSgwKS5cbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgLy8gMy4gTGV0IG4gYmUgMC5cbiAgICB2YXIgbiA9IDA7XG4gICAgLy8gNC4gRm9yIGVhY2ggcGFydCBpbiBwYXJ0cywgZG86XG4gICAgZm9yICh2YXIgaSA9IDA7IHBhcnRzLmxlbmd0aCA+IGk7IGkrKykge1xuICAgICAgICB2YXIgcGFydCA9IHBhcnRzW2ldO1xuICAgICAgICAvLyBhLiBMZXQgTyBiZSBPYmplY3RDcmVhdGUoJU9iamVjdFByb3RvdHlwZSUpLlxuICAgICAgICB2YXIgTyA9IHt9O1xuICAgICAgICAvLyBhLiBQZXJmb3JtID8gQ3JlYXRlRGF0YVByb3BlcnR5T3JUaHJvdyhPLCBcInR5cGVcIiwgcGFydC5bW3R5cGVdXSkuXG4gICAgICAgIE8udHlwZSA9IHBhcnRbJ1tbdHlwZV1dJ107XG4gICAgICAgIC8vIGEuIFBlcmZvcm0gPyBDcmVhdGVEYXRhUHJvcGVydHlPclRocm93KE8sIFwidmFsdWVcIiwgcGFydC5bW3ZhbHVlXV0pLlxuICAgICAgICBPLnZhbHVlID0gcGFydFsnW1t2YWx1ZV1dJ107XG4gICAgICAgIC8vIGEuIFBlcmZvcm0gPyBDcmVhdGVEYXRhUHJvcGVydHlPclRocm93KHJlc3VsdCwgPyBUb1N0cmluZyhuKSwgTykuXG4gICAgICAgIHJlc3VsdFtuXSA9IE87XG4gICAgICAgIC8vIGEuIEluY3JlbWVudCBuIGJ5IDEuXG4gICAgICAgIG4gKz0gMTtcbiAgICB9XG4gICAgLy8gNS4gUmV0dXJuIHJlc3VsdC5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKlxuICogQHNwZWNbc3Rhc20vZWNtYTQwMi9udW1iZXItZm9ybWF0LXRvLXBhcnRzL3NwZWMvbnVtYmVyZm9ybWF0Lmh0bWxdXG4gKiBAY2xhdXNlW3NlYy1wYXJ0aXRpb25udW1iZXJwYXR0ZXJuXVxuICovXG5mdW5jdGlvbiBQYXJ0aXRpb25OdW1iZXJQYXR0ZXJuKG51bWJlckZvcm1hdCwgeCkge1xuXG4gICAgdmFyIGludGVybmFsID0gZ2V0SW50ZXJuYWxQcm9wZXJ0aWVzKG51bWJlckZvcm1hdCksXG4gICAgICAgIGxvY2FsZSA9IGludGVybmFsWydbW2RhdGFMb2NhbGVdXSddLFxuICAgICAgICBudW1zID0gaW50ZXJuYWxbJ1tbbnVtYmVyaW5nU3lzdGVtXV0nXSxcbiAgICAgICAgZGF0YSA9IGludGVybmFscy5OdW1iZXJGb3JtYXRbJ1tbbG9jYWxlRGF0YV1dJ11bbG9jYWxlXSxcbiAgICAgICAgaWxkID0gZGF0YS5zeW1ib2xzW251bXNdIHx8IGRhdGEuc3ltYm9scy5sYXRuLFxuICAgICAgICBwYXR0ZXJuID0gdm9pZCAwO1xuXG4gICAgLy8gMS4gSWYgeCBpcyBub3QgTmFOIGFuZCB4IDwgMCwgdGhlbjpcbiAgICBpZiAoIWlzTmFOKHgpICYmIHggPCAwKSB7XG4gICAgICAgIC8vIGEuIExldCB4IGJlIC14LlxuICAgICAgICB4ID0gLXg7XG4gICAgICAgIC8vIGEuIExldCBwYXR0ZXJuIGJlIHRoZSB2YWx1ZSBvZiBudW1iZXJGb3JtYXQuW1tuZWdhdGl2ZVBhdHRlcm5dXS5cbiAgICAgICAgcGF0dGVybiA9IGludGVybmFsWydbW25lZ2F0aXZlUGF0dGVybl1dJ107XG4gICAgfVxuICAgIC8vIDIuIEVsc2UsXG4gICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBhLiBMZXQgcGF0dGVybiBiZSB0aGUgdmFsdWUgb2YgbnVtYmVyRm9ybWF0LltbcG9zaXRpdmVQYXR0ZXJuXV0uXG4gICAgICAgICAgICBwYXR0ZXJuID0gaW50ZXJuYWxbJ1tbcG9zaXRpdmVQYXR0ZXJuXV0nXTtcbiAgICAgICAgfVxuICAgIC8vIDMuIExldCByZXN1bHQgYmUgYSBuZXcgZW1wdHkgTGlzdC5cbiAgICB2YXIgcmVzdWx0ID0gbmV3IExpc3QoKTtcbiAgICAvLyA0LiBMZXQgYmVnaW5JbmRleCBiZSBDYWxsKCVTdHJpbmdQcm90b19pbmRleE9mJSwgcGF0dGVybiwgXCJ7XCIsIDApLlxuICAgIHZhciBiZWdpbkluZGV4ID0gcGF0dGVybi5pbmRleE9mKCd7JywgMCk7XG4gICAgLy8gNS4gTGV0IGVuZEluZGV4IGJlIDAuXG4gICAgdmFyIGVuZEluZGV4ID0gMDtcbiAgICAvLyA2LiBMZXQgbmV4dEluZGV4IGJlIDAuXG4gICAgdmFyIG5leHRJbmRleCA9IDA7XG4gICAgLy8gNy4gTGV0IGxlbmd0aCBiZSB0aGUgbnVtYmVyIG9mIGNvZGUgdW5pdHMgaW4gcGF0dGVybi5cbiAgICB2YXIgbGVuZ3RoID0gcGF0dGVybi5sZW5ndGg7XG4gICAgLy8gOC4gUmVwZWF0IHdoaWxlIGJlZ2luSW5kZXggaXMgYW4gaW50ZWdlciBpbmRleCBpbnRvIHBhdHRlcm46XG4gICAgd2hpbGUgKGJlZ2luSW5kZXggPiAtMSAmJiBiZWdpbkluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIC8vIGEuIFNldCBlbmRJbmRleCB0byBDYWxsKCVTdHJpbmdQcm90b19pbmRleE9mJSwgcGF0dGVybiwgXCJ9XCIsIGJlZ2luSW5kZXgpXG4gICAgICAgIGVuZEluZGV4ID0gcGF0dGVybi5pbmRleE9mKCd9JywgYmVnaW5JbmRleCk7XG4gICAgICAgIC8vIGEuIElmIGVuZEluZGV4ID0gLTEsIHRocm93IG5ldyBFcnJvciBleGNlcHRpb24uXG4gICAgICAgIGlmIChlbmRJbmRleCA9PT0gLTEpIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAvLyBhLiBJZiBiZWdpbkluZGV4IGlzIGdyZWF0ZXIgdGhhbiBuZXh0SW5kZXgsIHRoZW46XG4gICAgICAgIGlmIChiZWdpbkluZGV4ID4gbmV4dEluZGV4KSB7XG4gICAgICAgICAgICAvLyBpLiBMZXQgbGl0ZXJhbCBiZSBhIHN1YnN0cmluZyBvZiBwYXR0ZXJuIGZyb20gcG9zaXRpb24gbmV4dEluZGV4LCBpbmNsdXNpdmUsIHRvIHBvc2l0aW9uIGJlZ2luSW5kZXgsIGV4Y2x1c2l2ZS5cbiAgICAgICAgICAgIHZhciBsaXRlcmFsID0gcGF0dGVybi5zdWJzdHJpbmcobmV4dEluZGV4LCBiZWdpbkluZGV4KTtcbiAgICAgICAgICAgIC8vIGlpLiBBZGQgbmV3IHBhcnQgcmVjb3JkIHsgW1t0eXBlXV06IFwibGl0ZXJhbFwiLCBbW3ZhbHVlXV06IGxpdGVyYWwgfSBhcyBhIG5ldyBlbGVtZW50IG9mIHRoZSBsaXN0IHJlc3VsdC5cbiAgICAgICAgICAgIGFyclB1c2guY2FsbChyZXN1bHQsIHsgJ1tbdHlwZV1dJzogJ2xpdGVyYWwnLCAnW1t2YWx1ZV1dJzogbGl0ZXJhbCB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBhLiBMZXQgcCBiZSB0aGUgc3Vic3RyaW5nIG9mIHBhdHRlcm4gZnJvbSBwb3NpdGlvbiBiZWdpbkluZGV4LCBleGNsdXNpdmUsIHRvIHBvc2l0aW9uIGVuZEluZGV4LCBleGNsdXNpdmUuXG4gICAgICAgIHZhciBwID0gcGF0dGVybi5zdWJzdHJpbmcoYmVnaW5JbmRleCArIDEsIGVuZEluZGV4KTtcbiAgICAgICAgLy8gYS4gSWYgcCBpcyBlcXVhbCBcIm51bWJlclwiLCB0aGVuOlxuICAgICAgICBpZiAocCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgLy8gaS4gSWYgeCBpcyBOYU4sXG4gICAgICAgICAgICBpZiAoaXNOYU4oeCkpIHtcbiAgICAgICAgICAgICAgICAvLyAxLiBMZXQgbiBiZSBhbiBJTEQgU3RyaW5nIHZhbHVlIGluZGljYXRpbmcgdGhlIE5hTiB2YWx1ZS5cbiAgICAgICAgICAgICAgICB2YXIgbiA9IGlsZC5uYW47XG4gICAgICAgICAgICAgICAgLy8gMi4gQWRkIG5ldyBwYXJ0IHJlY29yZCB7IFtbdHlwZV1dOiBcIm5hblwiLCBbW3ZhbHVlXV06IG4gfSBhcyBhIG5ldyBlbGVtZW50IG9mIHRoZSBsaXN0IHJlc3VsdC5cbiAgICAgICAgICAgICAgICBhcnJQdXNoLmNhbGwocmVzdWx0LCB7ICdbW3R5cGVdXSc6ICduYW4nLCAnW1t2YWx1ZV1dJzogbiB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlpLiBFbHNlIGlmIGlzRmluaXRlKHgpIGlzIGZhbHNlLFxuICAgICAgICAgICAgZWxzZSBpZiAoIWlzRmluaXRlKHgpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIDEuIExldCBuIGJlIGFuIElMRCBTdHJpbmcgdmFsdWUgaW5kaWNhdGluZyBpbmZpbml0eS5cbiAgICAgICAgICAgICAgICAgICAgdmFyIF9uID0gaWxkLmluZmluaXR5O1xuICAgICAgICAgICAgICAgICAgICAvLyAyLiBBZGQgbmV3IHBhcnQgcmVjb3JkIHsgW1t0eXBlXV06IFwiaW5maW5pdHlcIiwgW1t2YWx1ZV1dOiBuIH0gYXMgYSBuZXcgZWxlbWVudCBvZiB0aGUgbGlzdCByZXN1bHQuXG4gICAgICAgICAgICAgICAgICAgIGFyclB1c2guY2FsbChyZXN1bHQsIHsgJ1tbdHlwZV1dJzogJ2luZmluaXR5JywgJ1tbdmFsdWVdXSc6IF9uIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpaWkuIEVsc2UsXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAxLiBJZiB0aGUgdmFsdWUgb2YgbnVtYmVyRm9ybWF0Lltbc3R5bGVdXSBpcyBcInBlcmNlbnRcIiBhbmQgaXNGaW5pdGUoeCksIGxldCB4IGJlIDEwMCDDlyB4LlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGludGVybmFsWydbW3N0eWxlXV0nXSA9PT0gJ3BlcmNlbnQnICYmIGlzRmluaXRlKHgpKSB4ICo9IDEwMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF9uMiA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDIuIElmIHRoZSBudW1iZXJGb3JtYXQuW1ttaW5pbXVtU2lnbmlmaWNhbnREaWdpdHNdXSBhbmQgbnVtYmVyRm9ybWF0LltbbWF4aW11bVNpZ25pZmljYW50RGlnaXRzXV0gYXJlIHByZXNlbnQsIHRoZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChob3AuY2FsbChpbnRlcm5hbCwgJ1tbbWluaW11bVNpZ25pZmljYW50RGlnaXRzXV0nKSAmJiBob3AuY2FsbChpbnRlcm5hbCwgJ1tbbWF4aW11bVNpZ25pZmljYW50RGlnaXRzXV0nKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGEuIExldCBuIGJlIFRvUmF3UHJlY2lzaW9uKHgsIG51bWJlckZvcm1hdC5bW21pbmltdW1TaWduaWZpY2FudERpZ2l0c11dLCBudW1iZXJGb3JtYXQuW1ttYXhpbXVtU2lnbmlmaWNhbnREaWdpdHNdXSkuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX24yID0gVG9SYXdQcmVjaXNpb24oeCwgaW50ZXJuYWxbJ1tbbWluaW11bVNpZ25pZmljYW50RGlnaXRzXV0nXSwgaW50ZXJuYWxbJ1tbbWF4aW11bVNpZ25pZmljYW50RGlnaXRzXV0nXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAzLiBFbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGEuIExldCBuIGJlIFRvUmF3Rml4ZWQoeCwgbnVtYmVyRm9ybWF0LltbbWluaW11bUludGVnZXJEaWdpdHNdXSwgbnVtYmVyRm9ybWF0LltbbWluaW11bUZyYWN0aW9uRGlnaXRzXV0sIG51bWJlckZvcm1hdC5bW21heGltdW1GcmFjdGlvbkRpZ2l0c11dKS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX24yID0gVG9SYXdGaXhlZCh4LCBpbnRlcm5hbFsnW1ttaW5pbXVtSW50ZWdlckRpZ2l0c11dJ10sIGludGVybmFsWydbW21pbmltdW1GcmFjdGlvbkRpZ2l0c11dJ10sIGludGVybmFsWydbW21heGltdW1GcmFjdGlvbkRpZ2l0c11dJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDQuIElmIHRoZSB2YWx1ZSBvZiB0aGUgbnVtYmVyRm9ybWF0LltbbnVtYmVyaW5nU3lzdGVtXV0gbWF0Y2hlcyBvbmUgb2YgdGhlIHZhbHVlcyBpbiB0aGUgXCJOdW1iZXJpbmcgU3lzdGVtXCIgY29sdW1uIG9mIFRhYmxlIDIgYmVsb3csIHRoZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChudW1TeXNbbnVtc10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhLiBMZXQgZGlnaXRzIGJlIGFuIGFycmF5IHdob3NlIDEwIFN0cmluZyB2YWx1ZWQgZWxlbWVudHMgYXJlIHRoZSBVVEYtMTYgc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBvZiB0aGUgMTAgZGlnaXRzIHNwZWNpZmllZCBpbiB0aGUgXCJEaWdpdHNcIiBjb2x1bW4gb2YgdGhlIG1hdGNoaW5nIHJvdyBpbiBUYWJsZSAyLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGlnaXRzID0gbnVtU3lzW251bXNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhLiBSZXBsYWNlIGVhY2ggZGlnaXQgaW4gbiB3aXRoIHRoZSB2YWx1ZSBvZiBkaWdpdHNbZGlnaXRdLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfbjIgPSBTdHJpbmcoX24yKS5yZXBsYWNlKC9cXGQvZywgZnVuY3Rpb24gKGRpZ2l0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGlnaXRzW2RpZ2l0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDUuIEVsc2UgdXNlIGFuIGltcGxlbWVudGF0aW9uIGRlcGVuZGVudCBhbGdvcml0aG0gdG8gbWFwIG4gdG8gdGhlIGFwcHJvcHJpYXRlIHJlcHJlc2VudGF0aW9uIG9mIG4gaW4gdGhlIGdpdmVuIG51bWJlcmluZyBzeXN0ZW0uXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIF9uMiA9IFN0cmluZyhfbjIpOyAvLyAjIyNUT0RPIyMjXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnRlZ2VyID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZyYWN0aW9uID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gNi4gTGV0IGRlY2ltYWxTZXBJbmRleCBiZSBDYWxsKCVTdHJpbmdQcm90b19pbmRleE9mJSwgbiwgXCIuXCIsIDApLlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlY2ltYWxTZXBJbmRleCA9IF9uMi5pbmRleE9mKCcuJywgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyA3LiBJZiBkZWNpbWFsU2VwSW5kZXggPiAwLCB0aGVuOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlY2ltYWxTZXBJbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhLiBMZXQgaW50ZWdlciBiZSB0aGUgc3Vic3RyaW5nIG9mIG4gZnJvbSBwb3NpdGlvbiAwLCBpbmNsdXNpdmUsIHRvIHBvc2l0aW9uIGRlY2ltYWxTZXBJbmRleCwgZXhjbHVzaXZlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVnZXIgPSBfbjIuc3Vic3RyaW5nKDAsIGRlY2ltYWxTZXBJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYS4gTGV0IGZyYWN0aW9uIGJlIHRoZSBzdWJzdHJpbmcgb2YgbiBmcm9tIHBvc2l0aW9uIGRlY2ltYWxTZXBJbmRleCwgZXhjbHVzaXZlLCB0byB0aGUgZW5kIG9mIG4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJhY3Rpb24gPSBfbjIuc3Vic3RyaW5nKGRlY2ltYWxTZXBJbmRleCArIDEsIGRlY2ltYWxTZXBJbmRleC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gOC4gRWxzZTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhLiBMZXQgaW50ZWdlciBiZSBuLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlZ2VyID0gX24yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhLiBMZXQgZnJhY3Rpb24gYmUgdW5kZWZpbmVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcmFjdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyA5LiBJZiB0aGUgdmFsdWUgb2YgdGhlIG51bWJlckZvcm1hdC5bW3VzZUdyb3VwaW5nXV0gaXMgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnRlcm5hbFsnW1t1c2VHcm91cGluZ11dJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhLiBMZXQgZ3JvdXBTZXBTeW1ib2wgYmUgdGhlIElMTkQgU3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZ3JvdXBpbmcgc2VwYXJhdG9yLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBncm91cFNlcFN5bWJvbCA9IGlsZC5ncm91cDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhLiBMZXQgZ3JvdXBzIGJlIGEgTGlzdCB3aG9zZSBlbGVtZW50cyBhcmUsIGluIGxlZnQgdG8gcmlnaHQgb3JkZXIsIHRoZSBzdWJzdHJpbmdzIGRlZmluZWQgYnkgSUxORCBzZXQgb2YgbG9jYXRpb25zIHdpdGhpbiB0aGUgaW50ZWdlci5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXBzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLS0tLT4gaW1wbGVtZW50YXRpb246XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHJpbWFyeSBncm91cCByZXByZXNlbnRzIHRoZSBncm91cCBjbG9zZXN0IHRvIHRoZSBkZWNpbWFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBnU2l6ZSA9IGRhdGEucGF0dGVybnMucHJpbWFyeUdyb3VwU2l6ZSB8fCAzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNlY29uZGFyeSBncm91cCBpcyBldmVyeSBvdGhlciBncm91cFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZ1NpemUgPSBkYXRhLnBhdHRlcm5zLnNlY29uZGFyeUdyb3VwU2l6ZSB8fCBwZ1NpemU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR3JvdXAgb25seSBpZiBuZWNlc3NhcnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW50ZWdlci5sZW5ndGggPiBwZ1NpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW5kZXggb2YgdGhlIHByaW1hcnkgZ3JvdXBpbmcgc2VwYXJhdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbmQgPSBpbnRlZ2VyLmxlbmd0aCAtIHBnU2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3RhcnRpbmcgaW5kZXggZm9yIG91ciBsb29wXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZHggPSBlbmQgJSBzZ1NpemU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGFydCA9IGludGVnZXIuc2xpY2UoMCwgaWR4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0Lmxlbmd0aCkgYXJyUHVzaC5jYWxsKGdyb3Vwcywgc3RhcnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMb29wIHRvIHNlcGFyYXRlIGludG8gc2Vjb25kYXJ5IGdyb3VwaW5nIGRpZ2l0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaWR4IDwgZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJQdXNoLmNhbGwoZ3JvdXBzLCBpbnRlZ2VyLnNsaWNlKGlkeCwgaWR4ICsgc2dTaXplKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZHggKz0gc2dTaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZCB0aGUgcHJpbWFyeSBncm91cGluZyBkaWdpdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyUHVzaC5jYWxsKGdyb3VwcywgaW50ZWdlci5zbGljZShlbmQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJQdXNoLmNhbGwoZ3JvdXBzLCBpbnRlZ2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYS4gQXNzZXJ0OiBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIGdyb3VwcyBMaXN0IGlzIGdyZWF0ZXIgdGhhbiAwLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChncm91cHMubGVuZ3RoID09PSAwKSB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhLiBSZXBlYXQsIHdoaWxlIGdyb3VwcyBMaXN0IGlzIG5vdCBlbXB0eTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoZ3JvdXBzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpLiBSZW1vdmUgdGhlIGZpcnN0IGVsZW1lbnQgZnJvbSBncm91cHMgYW5kIGxldCBpbnRlZ2VyR3JvdXAgYmUgdGhlIHZhbHVlIG9mIHRoYXQgZWxlbWVudC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGludGVnZXJHcm91cCA9IGFyclNoaWZ0LmNhbGwoZ3JvdXBzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWkuIEFkZCBuZXcgcGFydCByZWNvcmQgeyBbW3R5cGVdXTogXCJpbnRlZ2VyXCIsIFtbdmFsdWVdXTogaW50ZWdlckdyb3VwIH0gYXMgYSBuZXcgZWxlbWVudCBvZiB0aGUgbGlzdCByZXN1bHQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyclB1c2guY2FsbChyZXN1bHQsIHsgJ1tbdHlwZV1dJzogJ2ludGVnZXInLCAnW1t2YWx1ZV1dJzogaW50ZWdlckdyb3VwIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpaWkuIElmIGdyb3VwcyBMaXN0IGlzIG5vdCBlbXB0eSwgdGhlbjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdyb3Vwcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDEuIEFkZCBuZXcgcGFydCByZWNvcmQgeyBbW3R5cGVdXTogXCJncm91cFwiLCBbW3ZhbHVlXV06IGdyb3VwU2VwU3ltYm9sIH0gYXMgYSBuZXcgZWxlbWVudCBvZiB0aGUgbGlzdCByZXN1bHQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJQdXNoLmNhbGwocmVzdWx0LCB7ICdbW3R5cGVdXSc6ICdncm91cCcsICdbW3ZhbHVlXV0nOiBncm91cFNlcFN5bWJvbCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDEwLiBFbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGEuIEFkZCBuZXcgcGFydCByZWNvcmQgeyBbW3R5cGVdXTogXCJpbnRlZ2VyXCIsIFtbdmFsdWVdXTogaW50ZWdlciB9IGFzIGEgbmV3IGVsZW1lbnQgb2YgdGhlIGxpc3QgcmVzdWx0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJQdXNoLmNhbGwocmVzdWx0LCB7ICdbW3R5cGVdXSc6ICdpbnRlZ2VyJywgJ1tbdmFsdWVdXSc6IGludGVnZXIgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMTEuIElmIGZyYWN0aW9uIGlzIG5vdCB1bmRlZmluZWQsIHRoZW46XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZnJhY3Rpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGEuIExldCBkZWNpbWFsU2VwU3ltYm9sIGJlIHRoZSBJTE5EIFN0cmluZyByZXByZXNlbnRpbmcgdGhlIGRlY2ltYWwgc2VwYXJhdG9yLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWNpbWFsU2VwU3ltYm9sID0gaWxkLmRlY2ltYWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYS4gQWRkIG5ldyBwYXJ0IHJlY29yZCB7IFtbdHlwZV1dOiBcImRlY2ltYWxcIiwgW1t2YWx1ZV1dOiBkZWNpbWFsU2VwU3ltYm9sIH0gYXMgYSBuZXcgZWxlbWVudCBvZiB0aGUgbGlzdCByZXN1bHQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyUHVzaC5jYWxsKHJlc3VsdCwgeyAnW1t0eXBlXV0nOiAnZGVjaW1hbCcsICdbW3ZhbHVlXV0nOiBkZWNpbWFsU2VwU3ltYm9sIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGEuIEFkZCBuZXcgcGFydCByZWNvcmQgeyBbW3R5cGVdXTogXCJmcmFjdGlvblwiLCBbW3ZhbHVlXV06IGZyYWN0aW9uIH0gYXMgYSBuZXcgZWxlbWVudCBvZiB0aGUgbGlzdCByZXN1bHQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyUHVzaC5jYWxsKHJlc3VsdCwgeyAnW1t0eXBlXV0nOiAnZnJhY3Rpb24nLCAnW1t2YWx1ZV1dJzogZnJhY3Rpb24gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBhLiBFbHNlIGlmIHAgaXMgZXF1YWwgXCJwbHVzU2lnblwiLCB0aGVuOlxuICAgICAgICBlbHNlIGlmIChwID09PSBcInBsdXNTaWduXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBpLiBMZXQgcGx1c1NpZ25TeW1ib2wgYmUgdGhlIElMTkQgU3RyaW5nIHJlcHJlc2VudGluZyB0aGUgcGx1cyBzaWduLlxuICAgICAgICAgICAgICAgIHZhciBwbHVzU2lnblN5bWJvbCA9IGlsZC5wbHVzU2lnbjtcbiAgICAgICAgICAgICAgICAvLyBpaS4gQWRkIG5ldyBwYXJ0IHJlY29yZCB7IFtbdHlwZV1dOiBcInBsdXNTaWduXCIsIFtbdmFsdWVdXTogcGx1c1NpZ25TeW1ib2wgfSBhcyBhIG5ldyBlbGVtZW50IG9mIHRoZSBsaXN0IHJlc3VsdC5cbiAgICAgICAgICAgICAgICBhcnJQdXNoLmNhbGwocmVzdWx0LCB7ICdbW3R5cGVdXSc6ICdwbHVzU2lnbicsICdbW3ZhbHVlXV0nOiBwbHVzU2lnblN5bWJvbCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGEuIEVsc2UgaWYgcCBpcyBlcXVhbCBcIm1pbnVzU2lnblwiLCB0aGVuOlxuICAgICAgICAgICAgZWxzZSBpZiAocCA9PT0gXCJtaW51c1NpZ25cIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBpLiBMZXQgbWludXNTaWduU3ltYm9sIGJlIHRoZSBJTE5EIFN0cmluZyByZXByZXNlbnRpbmcgdGhlIG1pbnVzIHNpZ24uXG4gICAgICAgICAgICAgICAgICAgIHZhciBtaW51c1NpZ25TeW1ib2wgPSBpbGQubWludXNTaWduO1xuICAgICAgICAgICAgICAgICAgICAvLyBpaS4gQWRkIG5ldyBwYXJ0IHJlY29yZCB7IFtbdHlwZV1dOiBcIm1pbnVzU2lnblwiLCBbW3ZhbHVlXV06IG1pbnVzU2lnblN5bWJvbCB9IGFzIGEgbmV3IGVsZW1lbnQgb2YgdGhlIGxpc3QgcmVzdWx0LlxuICAgICAgICAgICAgICAgICAgICBhcnJQdXNoLmNhbGwocmVzdWx0LCB7ICdbW3R5cGVdXSc6ICdtaW51c1NpZ24nLCAnW1t2YWx1ZV1dJzogbWludXNTaWduU3ltYm9sIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBhLiBFbHNlIGlmIHAgaXMgZXF1YWwgXCJwZXJjZW50U2lnblwiIGFuZCBudW1iZXJGb3JtYXQuW1tzdHlsZV1dIGlzIFwicGVyY2VudFwiLCB0aGVuOlxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHAgPT09IFwicGVyY2VudFNpZ25cIiAmJiBpbnRlcm5hbFsnW1tzdHlsZV1dJ10gPT09IFwicGVyY2VudFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpLiBMZXQgcGVyY2VudFNpZ25TeW1ib2wgYmUgdGhlIElMTkQgU3RyaW5nIHJlcHJlc2VudGluZyB0aGUgcGVyY2VudCBzaWduLlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRTaWduU3ltYm9sID0gaWxkLnBlcmNlbnRTaWduO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWkuIEFkZCBuZXcgcGFydCByZWNvcmQgeyBbW3R5cGVdXTogXCJwZXJjZW50U2lnblwiLCBbW3ZhbHVlXV06IHBlcmNlbnRTaWduU3ltYm9sIH0gYXMgYSBuZXcgZWxlbWVudCBvZiB0aGUgbGlzdCByZXN1bHQuXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJQdXNoLmNhbGwocmVzdWx0LCB7ICdbW3R5cGVdXSc6ICdsaXRlcmFsJywgJ1tbdmFsdWVdXSc6IHBlcmNlbnRTaWduU3ltYm9sIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIGEuIEVsc2UgaWYgcCBpcyBlcXVhbCBcImN1cnJlbmN5XCIgYW5kIG51bWJlckZvcm1hdC5bW3N0eWxlXV0gaXMgXCJjdXJyZW5jeVwiLCB0aGVuOlxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChwID09PSBcImN1cnJlbmN5XCIgJiYgaW50ZXJuYWxbJ1tbc3R5bGVdXSddID09PSBcImN1cnJlbmN5XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpLiBMZXQgY3VycmVuY3kgYmUgdGhlIHZhbHVlIG9mIG51bWJlckZvcm1hdC5bW2N1cnJlbmN5XV0uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbmN5ID0gaW50ZXJuYWxbJ1tbY3VycmVuY3ldXSddO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNkID0gdm9pZCAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWkuIElmIG51bWJlckZvcm1hdC5bW2N1cnJlbmN5RGlzcGxheV1dIGlzIFwiY29kZVwiLCB0aGVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGludGVybmFsWydbW2N1cnJlbmN5RGlzcGxheV1dJ10gPT09IFwiY29kZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDEuIExldCBjZCBiZSBjdXJyZW5jeS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2QgPSBjdXJyZW5jeTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWlpLiBFbHNlIGlmIG51bWJlckZvcm1hdC5bW2N1cnJlbmN5RGlzcGxheV1dIGlzIFwic3ltYm9sXCIsIHRoZW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpbnRlcm5hbFsnW1tjdXJyZW5jeURpc3BsYXldXSddID09PSBcInN5bWJvbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAxLiBMZXQgY2QgYmUgYW4gSUxEIHN0cmluZyByZXByZXNlbnRpbmcgY3VycmVuY3kgaW4gc2hvcnQgZm9ybS4gSWYgdGhlIGltcGxlbWVudGF0aW9uIGRvZXMgbm90IGhhdmUgc3VjaCBhIHJlcHJlc2VudGF0aW9uIG9mIGN1cnJlbmN5LCB1c2UgY3VycmVuY3kgaXRzZWxmLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2QgPSBkYXRhLmN1cnJlbmNpZXNbY3VycmVuY3ldIHx8IGN1cnJlbmN5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl2LiBFbHNlIGlmIG51bWJlckZvcm1hdC5bW2N1cnJlbmN5RGlzcGxheV1dIGlzIFwibmFtZVwiLCB0aGVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGludGVybmFsWydbW2N1cnJlbmN5RGlzcGxheV1dJ10gPT09IFwibmFtZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMS4gTGV0IGNkIGJlIGFuIElMRCBzdHJpbmcgcmVwcmVzZW50aW5nIGN1cnJlbmN5IGluIGxvbmcgZm9ybS4gSWYgdGhlIGltcGxlbWVudGF0aW9uIGRvZXMgbm90IGhhdmUgc3VjaCBhIHJlcHJlc2VudGF0aW9uIG9mIGN1cnJlbmN5LCB0aGVuIHVzZSBjdXJyZW5jeSBpdHNlbGYuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2QgPSBjdXJyZW5jeTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB2LiBBZGQgbmV3IHBhcnQgcmVjb3JkIHsgW1t0eXBlXV06IFwiY3VycmVuY3lcIiwgW1t2YWx1ZV1dOiBjZCB9IGFzIGEgbmV3IGVsZW1lbnQgb2YgdGhlIGxpc3QgcmVzdWx0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyclB1c2guY2FsbChyZXN1bHQsIHsgJ1tbdHlwZV1dJzogJ2N1cnJlbmN5JywgJ1tbdmFsdWVdXSc6IGNkIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYS4gRWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpLiBMZXQgbGl0ZXJhbCBiZSB0aGUgc3Vic3RyaW5nIG9mIHBhdHRlcm4gZnJvbSBwb3NpdGlvbiBiZWdpbkluZGV4LCBpbmNsdXNpdmUsIHRvIHBvc2l0aW9uIGVuZEluZGV4LCBpbmNsdXNpdmUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfbGl0ZXJhbCA9IHBhdHRlcm4uc3Vic3RyaW5nKGJlZ2luSW5kZXgsIGVuZEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWkuIEFkZCBuZXcgcGFydCByZWNvcmQgeyBbW3R5cGVdXTogXCJsaXRlcmFsXCIsIFtbdmFsdWVdXTogbGl0ZXJhbCB9IGFzIGEgbmV3IGVsZW1lbnQgb2YgdGhlIGxpc3QgcmVzdWx0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJQdXNoLmNhbGwocmVzdWx0LCB7ICdbW3R5cGVdXSc6ICdsaXRlcmFsJywgJ1tbdmFsdWVdXSc6IF9saXRlcmFsIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgLy8gYS4gU2V0IG5leHRJbmRleCB0byBlbmRJbmRleCArIDEuXG4gICAgICAgIG5leHRJbmRleCA9IGVuZEluZGV4ICsgMTtcbiAgICAgICAgLy8gYS4gU2V0IGJlZ2luSW5kZXggdG8gQ2FsbCglU3RyaW5nUHJvdG9faW5kZXhPZiUsIHBhdHRlcm4sIFwie1wiLCBuZXh0SW5kZXgpXG4gICAgICAgIGJlZ2luSW5kZXggPSBwYXR0ZXJuLmluZGV4T2YoJ3snLCBuZXh0SW5kZXgpO1xuICAgIH1cbiAgICAvLyA5LiBJZiBuZXh0SW5kZXggaXMgbGVzcyB0aGFuIGxlbmd0aCwgdGhlbjpcbiAgICBpZiAobmV4dEluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIC8vIGEuIExldCBsaXRlcmFsIGJlIHRoZSBzdWJzdHJpbmcgb2YgcGF0dGVybiBmcm9tIHBvc2l0aW9uIG5leHRJbmRleCwgaW5jbHVzaXZlLCB0byBwb3NpdGlvbiBsZW5ndGgsIGV4Y2x1c2l2ZS5cbiAgICAgICAgdmFyIF9saXRlcmFsMiA9IHBhdHRlcm4uc3Vic3RyaW5nKG5leHRJbmRleCwgbGVuZ3RoKTtcbiAgICAgICAgLy8gYS4gQWRkIG5ldyBwYXJ0IHJlY29yZCB7IFtbdHlwZV1dOiBcImxpdGVyYWxcIiwgW1t2YWx1ZV1dOiBsaXRlcmFsIH0gYXMgYSBuZXcgZWxlbWVudCBvZiB0aGUgbGlzdCByZXN1bHQuXG4gICAgICAgIGFyclB1c2guY2FsbChyZXN1bHQsIHsgJ1tbdHlwZV1dJzogJ2xpdGVyYWwnLCAnW1t2YWx1ZV1dJzogX2xpdGVyYWwyIH0pO1xuICAgIH1cbiAgICAvLyAxMC4gUmV0dXJuIHJlc3VsdC5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKlxuICogQHNwZWNbc3Rhc20vZWNtYTQwMi9udW1iZXItZm9ybWF0LXRvLXBhcnRzL3NwZWMvbnVtYmVyZm9ybWF0Lmh0bWxdXG4gKiBAY2xhdXNlW3NlYy1mb3JtYXRudW1iZXJdXG4gKi9cbmZ1bmN0aW9uIEZvcm1hdE51bWJlcihudW1iZXJGb3JtYXQsIHgpIHtcbiAgICAvLyAxLiBMZXQgcGFydHMgYmUgPyBQYXJ0aXRpb25OdW1iZXJQYXR0ZXJuKG51bWJlckZvcm1hdCwgeCkuXG4gICAgdmFyIHBhcnRzID0gUGFydGl0aW9uTnVtYmVyUGF0dGVybihudW1iZXJGb3JtYXQsIHgpO1xuICAgIC8vIDIuIExldCByZXN1bHQgYmUgYW4gZW1wdHkgU3RyaW5nLlxuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICAvLyAzLiBGb3IgZWFjaCBwYXJ0IGluIHBhcnRzLCBkbzpcbiAgICBmb3IgKHZhciBpID0gMDsgcGFydHMubGVuZ3RoID4gaTsgaSsrKSB7XG4gICAgICAgIHZhciBwYXJ0ID0gcGFydHNbaV07XG4gICAgICAgIC8vIGEuIFNldCByZXN1bHQgdG8gYSBTdHJpbmcgdmFsdWUgcHJvZHVjZWQgYnkgY29uY2F0ZW5hdGluZyByZXN1bHQgYW5kIHBhcnQuW1t2YWx1ZV1dLlxuICAgICAgICByZXN1bHQgKz0gcGFydFsnW1t2YWx1ZV1dJ107XG4gICAgfVxuICAgIC8vIDQuIFJldHVybiByZXN1bHQuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBXaGVuIHRoZSBUb1Jhd1ByZWNpc2lvbiBhYnN0cmFjdCBvcGVyYXRpb24gaXMgY2FsbGVkIHdpdGggYXJndW1lbnRzIHggKHdoaWNoXG4gKiBtdXN0IGJlIGEgZmluaXRlIG5vbi1uZWdhdGl2ZSBudW1iZXIpLCBtaW5QcmVjaXNpb24sIGFuZCBtYXhQcmVjaXNpb24gKGJvdGhcbiAqIG11c3QgYmUgaW50ZWdlcnMgYmV0d2VlbiAxIGFuZCAyMSkgdGhlIGZvbGxvd2luZyBzdGVwcyBhcmUgdGFrZW46XG4gKi9cbmZ1bmN0aW9uIFRvUmF3UHJlY2lzaW9uKHgsIG1pblByZWNpc2lvbiwgbWF4UHJlY2lzaW9uKSB7XG4gICAgLy8gMS4gTGV0IHAgYmUgbWF4UHJlY2lzaW9uLlxuICAgIHZhciBwID0gbWF4UHJlY2lzaW9uO1xuXG4gICAgdmFyIG0gPSB2b2lkIDAsXG4gICAgICAgIGUgPSB2b2lkIDA7XG5cbiAgICAvLyAyLiBJZiB4ID0gMCwgdGhlblxuICAgIGlmICh4ID09PSAwKSB7XG4gICAgICAgIC8vIGEuIExldCBtIGJlIHRoZSBTdHJpbmcgY29uc2lzdGluZyBvZiBwIG9jY3VycmVuY2VzIG9mIHRoZSBjaGFyYWN0ZXIgXCIwXCIuXG4gICAgICAgIG0gPSBhcnJKb2luLmNhbGwoQXJyYXkocCArIDEpLCAnMCcpO1xuICAgICAgICAvLyBiLiBMZXQgZSBiZSAwLlxuICAgICAgICBlID0gMDtcbiAgICB9XG4gICAgLy8gMy4gRWxzZVxuICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gYS4gTGV0IGUgYW5kIG4gYmUgaW50ZWdlcnMgc3VjaCB0aGF0IDEw4bWW4oG7wrkg4omkIG4gPCAxMOG1liBhbmQgZm9yIHdoaWNoIHRoZVxuICAgICAgICAgICAgLy8gICAgZXhhY3QgbWF0aGVtYXRpY2FsIHZhbHVlIG9mIG4gw5cgMTDhtYnigbvhtZbigbrCuSDigJMgeCBpcyBhcyBjbG9zZSB0byB6ZXJvIGFzXG4gICAgICAgICAgICAvLyAgICBwb3NzaWJsZS4gSWYgdGhlcmUgYXJlIHR3byBzdWNoIHNldHMgb2YgZSBhbmQgbiwgcGljayB0aGUgZSBhbmQgbiBmb3JcbiAgICAgICAgICAgIC8vICAgIHdoaWNoIG4gw5cgMTDhtYnigbvhtZbigbrCuSBpcyBsYXJnZXIuXG4gICAgICAgICAgICBlID0gbG9nMTBGbG9vcihNYXRoLmFicyh4KSk7XG5cbiAgICAgICAgICAgIC8vIEVhc2llciB0byBnZXQgdG8gbSBmcm9tIGhlcmVcbiAgICAgICAgICAgIHZhciBmID0gTWF0aC5yb3VuZChNYXRoLmV4cChNYXRoLmFicyhlIC0gcCArIDEpICogTWF0aC5MTjEwKSk7XG5cbiAgICAgICAgICAgIC8vIGIuIExldCBtIGJlIHRoZSBTdHJpbmcgY29uc2lzdGluZyBvZiB0aGUgZGlnaXRzIG9mIHRoZSBkZWNpbWFsXG4gICAgICAgICAgICAvLyAgICByZXByZXNlbnRhdGlvbiBvZiBuIChpbiBvcmRlciwgd2l0aCBubyBsZWFkaW5nIHplcm9lcylcbiAgICAgICAgICAgIG0gPSBTdHJpbmcoTWF0aC5yb3VuZChlIC0gcCArIDEgPCAwID8geCAqIGYgOiB4IC8gZikpO1xuICAgICAgICB9XG5cbiAgICAvLyA0LiBJZiBlIOKJpSBwLCB0aGVuXG4gICAgaWYgKGUgPj0gcClcbiAgICAgICAgLy8gYS4gUmV0dXJuIHRoZSBjb25jYXRlbmF0aW9uIG9mIG0gYW5kIGUtcCsxIG9jY3VycmVuY2VzIG9mIHRoZSBjaGFyYWN0ZXIgXCIwXCIuXG4gICAgICAgIHJldHVybiBtICsgYXJySm9pbi5jYWxsKEFycmF5KGUgLSBwICsgMSArIDEpLCAnMCcpO1xuXG4gICAgICAgIC8vIDUuIElmIGUgPSBwLTEsIHRoZW5cbiAgICBlbHNlIGlmIChlID09PSBwIC0gMSlcbiAgICAgICAgICAgIC8vIGEuIFJldHVybiBtLlxuICAgICAgICAgICAgcmV0dXJuIG07XG5cbiAgICAgICAgICAgIC8vIDYuIElmIGUg4omlIDAsIHRoZW5cbiAgICAgICAgZWxzZSBpZiAoZSA+PSAwKVxuICAgICAgICAgICAgICAgIC8vIGEuIExldCBtIGJlIHRoZSBjb25jYXRlbmF0aW9uIG9mIHRoZSBmaXJzdCBlKzEgY2hhcmFjdGVycyBvZiBtLCB0aGUgY2hhcmFjdGVyXG4gICAgICAgICAgICAgICAgLy8gICAgXCIuXCIsIGFuZCB0aGUgcmVtYWluaW5nIHDigJMoZSsxKSBjaGFyYWN0ZXJzIG9mIG0uXG4gICAgICAgICAgICAgICAgbSA9IG0uc2xpY2UoMCwgZSArIDEpICsgJy4nICsgbS5zbGljZShlICsgMSk7XG5cbiAgICAgICAgICAgICAgICAvLyA3LiBJZiBlIDwgMCwgdGhlblxuICAgICAgICAgICAgZWxzZSBpZiAoZSA8IDApXG4gICAgICAgICAgICAgICAgICAgIC8vIGEuIExldCBtIGJlIHRoZSBjb25jYXRlbmF0aW9uIG9mIHRoZSBTdHJpbmcgXCIwLlwiLCDigJMoZSsxKSBvY2N1cnJlbmNlcyBvZiB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgY2hhcmFjdGVyIFwiMFwiLCBhbmQgdGhlIHN0cmluZyBtLlxuICAgICAgICAgICAgICAgICAgICBtID0gJzAuJyArIGFyckpvaW4uY2FsbChBcnJheSgtKGUgKyAxKSArIDEpLCAnMCcpICsgbTtcblxuICAgIC8vIDguIElmIG0gY29udGFpbnMgdGhlIGNoYXJhY3RlciBcIi5cIiwgYW5kIG1heFByZWNpc2lvbiA+IG1pblByZWNpc2lvbiwgdGhlblxuICAgIGlmIChtLmluZGV4T2YoXCIuXCIpID49IDAgJiYgbWF4UHJlY2lzaW9uID4gbWluUHJlY2lzaW9uKSB7XG4gICAgICAgIC8vIGEuIExldCBjdXQgYmUgbWF4UHJlY2lzaW9uIOKAkyBtaW5QcmVjaXNpb24uXG4gICAgICAgIHZhciBjdXQgPSBtYXhQcmVjaXNpb24gLSBtaW5QcmVjaXNpb247XG5cbiAgICAgICAgLy8gYi4gUmVwZWF0IHdoaWxlIGN1dCA+IDAgYW5kIHRoZSBsYXN0IGNoYXJhY3RlciBvZiBtIGlzIFwiMFwiOlxuICAgICAgICB3aGlsZSAoY3V0ID4gMCAmJiBtLmNoYXJBdChtLmxlbmd0aCAtIDEpID09PSAnMCcpIHtcbiAgICAgICAgICAgIC8vICBpLiBSZW1vdmUgdGhlIGxhc3QgY2hhcmFjdGVyIGZyb20gbS5cbiAgICAgICAgICAgIG0gPSBtLnNsaWNlKDAsIC0xKTtcblxuICAgICAgICAgICAgLy8gIGlpLiBEZWNyZWFzZSBjdXQgYnkgMS5cbiAgICAgICAgICAgIGN1dC0tO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYy4gSWYgdGhlIGxhc3QgY2hhcmFjdGVyIG9mIG0gaXMgXCIuXCIsIHRoZW5cbiAgICAgICAgaWYgKG0uY2hhckF0KG0ubGVuZ3RoIC0gMSkgPT09ICcuJylcbiAgICAgICAgICAgIC8vICAgIGkuIFJlbW92ZSB0aGUgbGFzdCBjaGFyYWN0ZXIgZnJvbSBtLlxuICAgICAgICAgICAgbSA9IG0uc2xpY2UoMCwgLTEpO1xuICAgIH1cbiAgICAvLyA5LiBSZXR1cm4gbS5cbiAgICByZXR1cm4gbTtcbn1cblxuLyoqXG4gKiBAc3BlY1t0YzM5L2VjbWE0MDIvbWFzdGVyL3NwZWMvbnVtYmVyZm9ybWF0Lmh0bWxdXG4gKiBAY2xhdXNlW3NlYy10b3Jhd2ZpeGVkXVxuICogV2hlbiB0aGUgVG9SYXdGaXhlZCBhYnN0cmFjdCBvcGVyYXRpb24gaXMgY2FsbGVkIHdpdGggYXJndW1lbnRzIHggKHdoaWNoIG11c3RcbiAqIGJlIGEgZmluaXRlIG5vbi1uZWdhdGl2ZSBudW1iZXIpLCBtaW5JbnRlZ2VyICh3aGljaCBtdXN0IGJlIGFuIGludGVnZXIgYmV0d2VlblxuICogMSBhbmQgMjEpLCBtaW5GcmFjdGlvbiwgYW5kIG1heEZyYWN0aW9uICh3aGljaCBtdXN0IGJlIGludGVnZXJzIGJldHdlZW4gMCBhbmRcbiAqIDIwKSB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAqL1xuZnVuY3Rpb24gVG9SYXdGaXhlZCh4LCBtaW5JbnRlZ2VyLCBtaW5GcmFjdGlvbiwgbWF4RnJhY3Rpb24pIHtcbiAgICAvLyAxLiBMZXQgZiBiZSBtYXhGcmFjdGlvbi5cbiAgICB2YXIgZiA9IG1heEZyYWN0aW9uO1xuICAgIC8vIDIuIExldCBuIGJlIGFuIGludGVnZXIgZm9yIHdoaWNoIHRoZSBleGFjdCBtYXRoZW1hdGljYWwgdmFsdWUgb2YgbiDDtyAxMGYg4oCTIHggaXMgYXMgY2xvc2UgdG8gemVybyBhcyBwb3NzaWJsZS4gSWYgdGhlcmUgYXJlIHR3byBzdWNoIG4sIHBpY2sgdGhlIGxhcmdlciBuLlxuICAgIHZhciBuID0gTWF0aC5wb3coMTAsIGYpICogeDsgLy8gZGl2ZXJnaW5nLi4uXG4gICAgLy8gMy4gSWYgbiA9IDAsIGxldCBtIGJlIHRoZSBTdHJpbmcgXCIwXCIuIE90aGVyd2lzZSwgbGV0IG0gYmUgdGhlIFN0cmluZyBjb25zaXN0aW5nIG9mIHRoZSBkaWdpdHMgb2YgdGhlIGRlY2ltYWwgcmVwcmVzZW50YXRpb24gb2YgbiAoaW4gb3JkZXIsIHdpdGggbm8gbGVhZGluZyB6ZXJvZXMpLlxuICAgIHZhciBtID0gbiA9PT0gMCA/IFwiMFwiIDogbi50b0ZpeGVkKDApOyAvLyBkaXZlcmluZy4uLlxuXG4gICAge1xuICAgICAgICAvLyB0aGlzIGRpdmVyc2lvbiBpcyBuZWVkZWQgdG8gdGFrZSBpbnRvIGNvbnNpZGVyYXRpb24gYmlnIG51bWJlcnMsIGUuZy46XG4gICAgICAgIC8vIDEuMjM0NDUwMWUrMzcgLT4gMTIzNDQ1MDEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDBcbiAgICAgICAgdmFyIGlkeCA9IHZvaWQgMDtcbiAgICAgICAgdmFyIGV4cCA9IChpZHggPSBtLmluZGV4T2YoJ2UnKSkgPiAtMSA/IG0uc2xpY2UoaWR4ICsgMSkgOiAwO1xuICAgICAgICBpZiAoZXhwKSB7XG4gICAgICAgICAgICBtID0gbS5zbGljZSgwLCBpZHgpLnJlcGxhY2UoJy4nLCAnJyk7XG4gICAgICAgICAgICBtICs9IGFyckpvaW4uY2FsbChBcnJheShleHAgLSAobS5sZW5ndGggLSAxKSArIDEpLCAnMCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGludCA9IHZvaWQgMDtcbiAgICAvLyA0LiBJZiBmIOKJoCAwLCB0aGVuXG4gICAgaWYgKGYgIT09IDApIHtcbiAgICAgICAgLy8gYS4gTGV0IGsgYmUgdGhlIG51bWJlciBvZiBjaGFyYWN0ZXJzIGluIG0uXG4gICAgICAgIHZhciBrID0gbS5sZW5ndGg7XG4gICAgICAgIC8vIGEuIElmIGsg4omkIGYsIHRoZW5cbiAgICAgICAgaWYgKGsgPD0gZikge1xuICAgICAgICAgICAgLy8gaS4gTGV0IHogYmUgdGhlIFN0cmluZyBjb25zaXN0aW5nIG9mIGYrMeKAk2sgb2NjdXJyZW5jZXMgb2YgdGhlIGNoYXJhY3RlciBcIjBcIi5cbiAgICAgICAgICAgIHZhciB6ID0gYXJySm9pbi5jYWxsKEFycmF5KGYgKyAxIC0gayArIDEpLCAnMCcpO1xuICAgICAgICAgICAgLy8gaWkuIExldCBtIGJlIHRoZSBjb25jYXRlbmF0aW9uIG9mIFN0cmluZ3MgeiBhbmQgbS5cbiAgICAgICAgICAgIG0gPSB6ICsgbTtcbiAgICAgICAgICAgIC8vIGlpaS4gTGV0IGsgYmUgZisxLlxuICAgICAgICAgICAgayA9IGYgKyAxO1xuICAgICAgICB9XG4gICAgICAgIC8vIGEuIExldCBhIGJlIHRoZSBmaXJzdCBr4oCTZiBjaGFyYWN0ZXJzIG9mIG0sIGFuZCBsZXQgYiBiZSB0aGUgcmVtYWluaW5nIGYgY2hhcmFjdGVycyBvZiBtLlxuICAgICAgICB2YXIgYSA9IG0uc3Vic3RyaW5nKDAsIGsgLSBmKSxcbiAgICAgICAgICAgIGIgPSBtLnN1YnN0cmluZyhrIC0gZiwgbS5sZW5ndGgpO1xuICAgICAgICAvLyBhLiBMZXQgbSBiZSB0aGUgY29uY2F0ZW5hdGlvbiBvZiB0aGUgdGhyZWUgU3RyaW5ncyBhLCBcIi5cIiwgYW5kIGIuXG4gICAgICAgIG0gPSBhICsgXCIuXCIgKyBiO1xuICAgICAgICAvLyBhLiBMZXQgaW50IGJlIHRoZSBudW1iZXIgb2YgY2hhcmFjdGVycyBpbiBhLlxuICAgICAgICBpbnQgPSBhLmxlbmd0aDtcbiAgICB9XG4gICAgLy8gNS4gRWxzZSwgbGV0IGludCBiZSB0aGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgaW4gbS5cbiAgICBlbHNlIGludCA9IG0ubGVuZ3RoO1xuICAgIC8vIDYuIExldCBjdXQgYmUgbWF4RnJhY3Rpb24g4oCTIG1pbkZyYWN0aW9uLlxuICAgIHZhciBjdXQgPSBtYXhGcmFjdGlvbiAtIG1pbkZyYWN0aW9uO1xuICAgIC8vIDcuIFJlcGVhdCB3aGlsZSBjdXQgPiAwIGFuZCB0aGUgbGFzdCBjaGFyYWN0ZXIgb2YgbSBpcyBcIjBcIjpcbiAgICB3aGlsZSAoY3V0ID4gMCAmJiBtLnNsaWNlKC0xKSA9PT0gXCIwXCIpIHtcbiAgICAgICAgLy8gYS4gUmVtb3ZlIHRoZSBsYXN0IGNoYXJhY3RlciBmcm9tIG0uXG4gICAgICAgIG0gPSBtLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgLy8gYS4gRGVjcmVhc2UgY3V0IGJ5IDEuXG4gICAgICAgIGN1dC0tO1xuICAgIH1cbiAgICAvLyA4LiBJZiB0aGUgbGFzdCBjaGFyYWN0ZXIgb2YgbSBpcyBcIi5cIiwgdGhlblxuICAgIGlmIChtLnNsaWNlKC0xKSA9PT0gXCIuXCIpIHtcbiAgICAgICAgLy8gYS4gUmVtb3ZlIHRoZSBsYXN0IGNoYXJhY3RlciBmcm9tIG0uXG4gICAgICAgIG0gPSBtLnNsaWNlKDAsIC0xKTtcbiAgICB9XG4gICAgLy8gOS4gSWYgaW50IDwgbWluSW50ZWdlciwgdGhlblxuICAgIGlmIChpbnQgPCBtaW5JbnRlZ2VyKSB7XG4gICAgICAgIC8vIGEuIExldCB6IGJlIHRoZSBTdHJpbmcgY29uc2lzdGluZyBvZiBtaW5JbnRlZ2Vy4oCTaW50IG9jY3VycmVuY2VzIG9mIHRoZSBjaGFyYWN0ZXIgXCIwXCIuXG4gICAgICAgIHZhciBfeiA9IGFyckpvaW4uY2FsbChBcnJheShtaW5JbnRlZ2VyIC0gaW50ICsgMSksICcwJyk7XG4gICAgICAgIC8vIGEuIExldCBtIGJlIHRoZSBjb25jYXRlbmF0aW9uIG9mIFN0cmluZ3MgeiBhbmQgbS5cbiAgICAgICAgbSA9IF96ICsgbTtcbiAgICB9XG4gICAgLy8gMTAuIFJldHVybiBtLlxuICAgIHJldHVybiBtO1xufVxuXG4vLyBTZWN0IDExLjMuMiBUYWJsZSAyLCBOdW1iZXJpbmcgc3lzdGVtc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbnZhciBudW1TeXMgPSB7XG4gICAgYXJhYjogW1wi2aBcIiwgXCLZoVwiLCBcItmiXCIsIFwi2aNcIiwgXCLZpFwiLCBcItmlXCIsIFwi2aZcIiwgXCLZp1wiLCBcItmoXCIsIFwi2alcIl0sXG4gICAgYXJhYmV4dDogW1wi27BcIiwgXCLbsVwiLCBcItuyXCIsIFwi27NcIiwgXCLbtFwiLCBcItu1XCIsIFwi27ZcIiwgXCLbt1wiLCBcItu4XCIsIFwi27lcIl0sXG4gICAgYmFsaTogW1wi4a2QXCIsIFwi4a2RXCIsIFwi4a2SXCIsIFwi4a2TXCIsIFwi4a2UXCIsIFwi4a2VXCIsIFwi4a2WXCIsIFwi4a2XXCIsIFwi4a2YXCIsIFwi4a2ZXCJdLFxuICAgIGJlbmc6IFtcIuCnplwiLCBcIuCnp1wiLCBcIuCnqFwiLCBcIuCnqVwiLCBcIuCnqlwiLCBcIuCnq1wiLCBcIuCnrFwiLCBcIuCnrVwiLCBcIuCnrlwiLCBcIuCnr1wiXSxcbiAgICBkZXZhOiBbXCLgpaZcIiwgXCLgpadcIiwgXCLgpahcIiwgXCLgpalcIiwgXCLgpapcIiwgXCLgpatcIiwgXCLgpaxcIiwgXCLgpa1cIiwgXCLgpa5cIiwgXCLgpa9cIl0sXG4gICAgZnVsbHdpZGU6IFtcIu+8kFwiLCBcIu+8kVwiLCBcIu+8klwiLCBcIu+8k1wiLCBcIu+8lFwiLCBcIu+8lVwiLCBcIu+8llwiLCBcIu+8l1wiLCBcIu+8mFwiLCBcIu+8mVwiXSxcbiAgICBndWpyOiBbXCLgq6ZcIiwgXCLgq6dcIiwgXCLgq6hcIiwgXCLgq6lcIiwgXCLgq6pcIiwgXCLgq6tcIiwgXCLgq6xcIiwgXCLgq61cIiwgXCLgq65cIiwgXCLgq69cIl0sXG4gICAgZ3VydTogW1wi4KmmXCIsIFwi4KmnXCIsIFwi4KmoXCIsIFwi4KmpXCIsIFwi4KmqXCIsIFwi4KmrXCIsIFwi4KmsXCIsIFwi4KmtXCIsIFwi4KmuXCIsIFwi4KmvXCJdLFxuICAgIGhhbmlkZWM6IFtcIuOAh1wiLCBcIuS4gFwiLCBcIuS6jFwiLCBcIuS4iVwiLCBcIuWbm1wiLCBcIuS6lFwiLCBcIuWFrVwiLCBcIuS4g1wiLCBcIuWFq1wiLCBcIuS5nVwiXSxcbiAgICBraG1yOiBbXCLhn6BcIiwgXCLhn6FcIiwgXCLhn6JcIiwgXCLhn6NcIiwgXCLhn6RcIiwgXCLhn6VcIiwgXCLhn6ZcIiwgXCLhn6dcIiwgXCLhn6hcIiwgXCLhn6lcIl0sXG4gICAga25kYTogW1wi4LOmXCIsIFwi4LOnXCIsIFwi4LOoXCIsIFwi4LOpXCIsIFwi4LOqXCIsIFwi4LOrXCIsIFwi4LOsXCIsIFwi4LOtXCIsIFwi4LOuXCIsIFwi4LOvXCJdLFxuICAgIGxhb286IFtcIuC7kFwiLCBcIuC7kVwiLCBcIuC7klwiLCBcIuC7k1wiLCBcIuC7lFwiLCBcIuC7lVwiLCBcIuC7llwiLCBcIuC7l1wiLCBcIuC7mFwiLCBcIuC7mVwiXSxcbiAgICBsYXRuOiBbXCIwXCIsIFwiMVwiLCBcIjJcIiwgXCIzXCIsIFwiNFwiLCBcIjVcIiwgXCI2XCIsIFwiN1wiLCBcIjhcIiwgXCI5XCJdLFxuICAgIGxpbWI6IFtcIuGlhlwiLCBcIuGlh1wiLCBcIuGliFwiLCBcIuGliVwiLCBcIuGlilwiLCBcIuGli1wiLCBcIuGljFwiLCBcIuGljVwiLCBcIuGljlwiLCBcIuGlj1wiXSxcbiAgICBtbHltOiBbXCLgtaZcIiwgXCLgtadcIiwgXCLgtahcIiwgXCLgtalcIiwgXCLgtapcIiwgXCLgtatcIiwgXCLgtaxcIiwgXCLgta1cIiwgXCLgta5cIiwgXCLgta9cIl0sXG4gICAgbW9uZzogW1wi4aCQXCIsIFwi4aCRXCIsIFwi4aCSXCIsIFwi4aCTXCIsIFwi4aCUXCIsIFwi4aCVXCIsIFwi4aCWXCIsIFwi4aCXXCIsIFwi4aCYXCIsIFwi4aCZXCJdLFxuICAgIG15bXI6IFtcIuGBgFwiLCBcIuGBgVwiLCBcIuGBglwiLCBcIuGBg1wiLCBcIuGBhFwiLCBcIuGBhVwiLCBcIuGBhlwiLCBcIuGBh1wiLCBcIuGBiFwiLCBcIuGBiVwiXSxcbiAgICBvcnlhOiBbXCLgraZcIiwgXCLgradcIiwgXCLgrahcIiwgXCLgralcIiwgXCLgrapcIiwgXCLgratcIiwgXCLgraxcIiwgXCLgra1cIiwgXCLgra5cIiwgXCLgra9cIl0sXG4gICAgdGFtbGRlYzogW1wi4K+mXCIsIFwi4K+nXCIsIFwi4K+oXCIsIFwi4K+pXCIsIFwi4K+qXCIsIFwi4K+rXCIsIFwi4K+sXCIsIFwi4K+tXCIsIFwi4K+uXCIsIFwi4K+vXCJdLFxuICAgIHRlbHU6IFtcIuCxplwiLCBcIuCxp1wiLCBcIuCxqFwiLCBcIuCxqVwiLCBcIuCxqlwiLCBcIuCxq1wiLCBcIuCxrFwiLCBcIuCxrVwiLCBcIuCxrlwiLCBcIuCxr1wiXSxcbiAgICB0aGFpOiBbXCLguZBcIiwgXCLguZFcIiwgXCLguZJcIiwgXCLguZNcIiwgXCLguZRcIiwgXCLguZVcIiwgXCLguZZcIiwgXCLguZdcIiwgXCLguZhcIiwgXCLguZlcIl0sXG4gICAgdGlidDogW1wi4LygXCIsIFwi4LyhXCIsIFwi4LyiXCIsIFwi4LyjXCIsIFwi4LykXCIsIFwi4LylXCIsIFwi4LymXCIsIFwi4LynXCIsIFwi4LyoXCIsIFwi4LypXCJdXG59O1xuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gcHJvdmlkZXMgYWNjZXNzIHRvIHRoZSBsb2NhbGUgYW5kIGZvcm1hdHRpbmcgb3B0aW9ucyBjb21wdXRlZFxuICogZHVyaW5nIGluaXRpYWxpemF0aW9uIG9mIHRoZSBvYmplY3QuXG4gKlxuICogVGhlIGZ1bmN0aW9uIHJldHVybnMgYSBuZXcgb2JqZWN0IHdob3NlIHByb3BlcnRpZXMgYW5kIGF0dHJpYnV0ZXMgYXJlIHNldCBhc1xuICogaWYgY29uc3RydWN0ZWQgYnkgYW4gb2JqZWN0IGxpdGVyYWwgYXNzaWduaW5nIHRvIGVhY2ggb2YgdGhlIGZvbGxvd2luZ1xuICogcHJvcGVydGllcyB0aGUgdmFsdWUgb2YgdGhlIGNvcnJlc3BvbmRpbmcgaW50ZXJuYWwgcHJvcGVydHkgb2YgdGhpc1xuICogTnVtYmVyRm9ybWF0IG9iamVjdCAoc2VlIDExLjQpOiBsb2NhbGUsIG51bWJlcmluZ1N5c3RlbSwgc3R5bGUsIGN1cnJlbmN5LFxuICogY3VycmVuY3lEaXNwbGF5LCBtaW5pbXVtSW50ZWdlckRpZ2l0cywgbWluaW11bUZyYWN0aW9uRGlnaXRzLFxuICogbWF4aW11bUZyYWN0aW9uRGlnaXRzLCBtaW5pbXVtU2lnbmlmaWNhbnREaWdpdHMsIG1heGltdW1TaWduaWZpY2FudERpZ2l0cywgYW5kXG4gKiB1c2VHcm91cGluZy4gUHJvcGVydGllcyB3aG9zZSBjb3JyZXNwb25kaW5nIGludGVybmFsIHByb3BlcnRpZXMgYXJlIG5vdCBwcmVzZW50XG4gKiBhcmUgbm90IGFzc2lnbmVkLlxuICovXG4vKiAxMS4zLjMgKi9kZWZpbmVQcm9wZXJ0eShJbnRsLk51bWJlckZvcm1hdC5wcm90b3R5cGUsICdyZXNvbHZlZE9wdGlvbnMnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZSgpIHtcbiAgICAgICAgdmFyIHByb3AgPSB2b2lkIDAsXG4gICAgICAgICAgICBkZXNjcyA9IG5ldyBSZWNvcmQoKSxcbiAgICAgICAgICAgIHByb3BzID0gWydsb2NhbGUnLCAnbnVtYmVyaW5nU3lzdGVtJywgJ3N0eWxlJywgJ2N1cnJlbmN5JywgJ2N1cnJlbmN5RGlzcGxheScsICdtaW5pbXVtSW50ZWdlckRpZ2l0cycsICdtaW5pbXVtRnJhY3Rpb25EaWdpdHMnLCAnbWF4aW11bUZyYWN0aW9uRGlnaXRzJywgJ21pbmltdW1TaWduaWZpY2FudERpZ2l0cycsICdtYXhpbXVtU2lnbmlmaWNhbnREaWdpdHMnLCAndXNlR3JvdXBpbmcnXSxcbiAgICAgICAgICAgIGludGVybmFsID0gdGhpcyAhPT0gbnVsbCAmJiBiYWJlbEhlbHBlcnNbXCJ0eXBlb2ZcIl0odGhpcykgPT09ICdvYmplY3QnICYmIGdldEludGVybmFsUHJvcGVydGllcyh0aGlzKTtcblxuICAgICAgICAvLyBTYXRpc2Z5IHRlc3QgMTEuM19iXG4gICAgICAgIGlmICghaW50ZXJuYWwgfHwgIWludGVybmFsWydbW2luaXRpYWxpemVkTnVtYmVyRm9ybWF0XV0nXSkgdGhyb3cgbmV3IFR5cGVFcnJvcignYHRoaXNgIHZhbHVlIGZvciByZXNvbHZlZE9wdGlvbnMoKSBpcyBub3QgYW4gaW5pdGlhbGl6ZWQgSW50bC5OdW1iZXJGb3JtYXQgb2JqZWN0LicpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBtYXggPSBwcm9wcy5sZW5ndGg7IGkgPCBtYXg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGhvcC5jYWxsKGludGVybmFsLCBwcm9wID0gJ1tbJyArIHByb3BzW2ldICsgJ11dJykpIGRlc2NzW3Byb3BzW2ldXSA9IHsgdmFsdWU6IGludGVybmFsW3Byb3BdLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCBlbnVtZXJhYmxlOiB0cnVlIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2JqQ3JlYXRlKHt9LCBkZXNjcyk7XG4gICAgfVxufSk7XG5cbi8qIGpzbGludCBlc25leHQ6IHRydWUgKi9cblxuLy8gTWF0Y2ggdGhlc2UgZGF0ZXRpbWUgY29tcG9uZW50cyBpbiBhIENMRFIgcGF0dGVybiwgZXhjZXB0IHRob3NlIGluIHNpbmdsZSBxdW90ZXNcbnZhciBleHBEVENvbXBvbmVudHMgPSAvKD86W0VlY117MSw2fXxHezEsNX18W1FxXXsxLDV9fCg/Olt5WXVyXSt8VXsxLDV9KXxbTUxdezEsNX18ZHsxLDJ9fER7MSwzfXxGezF9fFthYkJdezEsNX18W2hrSEtdezEsMn18d3sxLDJ9fFd7MX18bXsxLDJ9fHN7MSwyfXxbelpPdlZ4WF17MSw0fSkoPz0oW14nXSonW14nXSonKSpbXiddKiQpL2c7XG4vLyB0cmltIHBhdHRlcm5zIGFmdGVyIHRyYW5zZm9ybWF0aW9uc1xudmFyIGV4cFBhdHRlcm5UcmltbWVyID0gL15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC9nO1xuLy8gU2tpcCBvdmVyIHBhdHRlcm5zIHdpdGggdGhlc2UgZGF0ZXRpbWUgY29tcG9uZW50cyBiZWNhdXNlIHdlIGRvbid0IGhhdmUgZGF0YVxuLy8gdG8gYmFjayB0aGVtIHVwOlxuLy8gdGltZXpvbmUsIHdlZWtkYXksIGFtb3VuZyBvdGhlcnNcbnZhciB1bndhbnRlZERUQ3MgPSAvW3JxUUFTakpnd1dJUXFdLzsgLy8geFhWTyB3ZXJlIHJlbW92ZWQgZnJvbSB0aGlzIGxpc3QgaW4gZmF2b3Igb2YgY29tcHV0aW5nIG1hdGNoZXMgd2l0aCB0aW1lWm9uZU5hbWUgdmFsdWVzIGJ1dCBwcmludGluZyBhcyBlbXB0eSBzdHJpbmdcblxudmFyIGR0S2V5cyA9IFtcIndlZWtkYXlcIiwgXCJlcmFcIiwgXCJ5ZWFyXCIsIFwibW9udGhcIiwgXCJkYXlcIiwgXCJ3ZWVrZGF5XCIsIFwicXVhcnRlclwiXTtcbnZhciB0bUtleXMgPSBbXCJob3VyXCIsIFwibWludXRlXCIsIFwic2Vjb25kXCIsIFwiaG91cjEyXCIsIFwidGltZVpvbmVOYW1lXCJdO1xuXG5mdW5jdGlvbiBpc0RhdGVGb3JtYXRPbmx5KG9iaikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG1LZXlzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkodG1LZXlzW2ldKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBpc1RpbWVGb3JtYXRPbmx5KG9iaikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZHRLZXlzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoZHRLZXlzW2ldKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBqb2luRGF0ZUFuZFRpbWVGb3JtYXRzKGRhdGVGb3JtYXRPYmosIHRpbWVGb3JtYXRPYmopIHtcbiAgICB2YXIgbyA9IHsgXzoge30gfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGR0S2V5cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoZGF0ZUZvcm1hdE9ialtkdEtleXNbaV1dKSB7XG4gICAgICAgICAgICBvW2R0S2V5c1tpXV0gPSBkYXRlRm9ybWF0T2JqW2R0S2V5c1tpXV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGVGb3JtYXRPYmouX1tkdEtleXNbaV1dKSB7XG4gICAgICAgICAgICBvLl9bZHRLZXlzW2ldXSA9IGRhdGVGb3JtYXRPYmouX1tkdEtleXNbaV1dO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgdG1LZXlzLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgIGlmICh0aW1lRm9ybWF0T2JqW3RtS2V5c1tqXV0pIHtcbiAgICAgICAgICAgIG9bdG1LZXlzW2pdXSA9IHRpbWVGb3JtYXRPYmpbdG1LZXlzW2pdXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGltZUZvcm1hdE9iai5fW3RtS2V5c1tqXV0pIHtcbiAgICAgICAgICAgIG8uX1t0bUtleXNbal1dID0gdGltZUZvcm1hdE9iai5fW3RtS2V5c1tqXV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG87XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVGaW5hbFBhdHRlcm5zKGZvcm1hdE9iaikge1xuICAgIC8vIEZyb20gaHR0cDovL3d3dy51bmljb2RlLm9yZy9yZXBvcnRzL3RyMzUvdHIzNS1kYXRlcy5odG1sI0RhdGVfRm9ybWF0X1BhdHRlcm5zOlxuICAgIC8vICAnSW4gcGF0dGVybnMsIHR3byBzaW5nbGUgcXVvdGVzIHJlcHJlc2VudHMgYSBsaXRlcmFsIHNpbmdsZSBxdW90ZSwgZWl0aGVyXG4gICAgLy8gICBpbnNpZGUgb3Igb3V0c2lkZSBzaW5nbGUgcXVvdGVzLiBUZXh0IHdpdGhpbiBzaW5nbGUgcXVvdGVzIGlzIG5vdFxuICAgIC8vICAgaW50ZXJwcmV0ZWQgaW4gYW55IHdheSAoZXhjZXB0IGZvciB0d28gYWRqYWNlbnQgc2luZ2xlIHF1b3RlcykuJ1xuICAgIGZvcm1hdE9iai5wYXR0ZXJuMTIgPSBmb3JtYXRPYmouZXh0ZW5kZWRQYXR0ZXJuLnJlcGxhY2UoLycoW14nXSopJy9nLCBmdW5jdGlvbiAoJDAsIGxpdGVyYWwpIHtcbiAgICAgICAgcmV0dXJuIGxpdGVyYWwgPyBsaXRlcmFsIDogXCInXCI7XG4gICAgfSk7XG5cbiAgICAvLyBwYXR0ZXJuIDEyIGlzIGFsd2F5cyB0aGUgZGVmYXVsdC4gd2UgY2FuIHByb2R1Y2UgdGhlIDI0IGJ5IHJlbW92aW5nIHthbXBtfVxuICAgIGZvcm1hdE9iai5wYXR0ZXJuID0gZm9ybWF0T2JqLnBhdHRlcm4xMi5yZXBsYWNlKCd7YW1wbX0nLCAnJykucmVwbGFjZShleHBQYXR0ZXJuVHJpbW1lciwgJycpO1xuICAgIHJldHVybiBmb3JtYXRPYmo7XG59XG5cbmZ1bmN0aW9uIGV4cERUQ29tcG9uZW50c01ldGEoJDAsIGZvcm1hdE9iaikge1xuICAgIHN3aXRjaCAoJDAuY2hhckF0KDApKSB7XG4gICAgICAgIC8vIC0tLSBFcmFcbiAgICAgICAgY2FzZSAnRyc6XG4gICAgICAgICAgICBmb3JtYXRPYmouZXJhID0gWydzaG9ydCcsICdzaG9ydCcsICdzaG9ydCcsICdsb25nJywgJ25hcnJvdyddWyQwLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgcmV0dXJuICd7ZXJhfSc7XG5cbiAgICAgICAgLy8gLS0tIFllYXJcbiAgICAgICAgY2FzZSAneSc6XG4gICAgICAgIGNhc2UgJ1knOlxuICAgICAgICBjYXNlICd1JzpcbiAgICAgICAgY2FzZSAnVSc6XG4gICAgICAgIGNhc2UgJ3InOlxuICAgICAgICAgICAgZm9ybWF0T2JqLnllYXIgPSAkMC5sZW5ndGggPT09IDIgPyAnMi1kaWdpdCcgOiAnbnVtZXJpYyc7XG4gICAgICAgICAgICByZXR1cm4gJ3t5ZWFyfSc7XG5cbiAgICAgICAgLy8gLS0tIFF1YXJ0ZXIgKG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBwb2x5ZmlsbClcbiAgICAgICAgY2FzZSAnUSc6XG4gICAgICAgIGNhc2UgJ3EnOlxuICAgICAgICAgICAgZm9ybWF0T2JqLnF1YXJ0ZXIgPSBbJ251bWVyaWMnLCAnMi1kaWdpdCcsICdzaG9ydCcsICdsb25nJywgJ25hcnJvdyddWyQwLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgcmV0dXJuICd7cXVhcnRlcn0nO1xuXG4gICAgICAgIC8vIC0tLSBNb250aFxuICAgICAgICBjYXNlICdNJzpcbiAgICAgICAgY2FzZSAnTCc6XG4gICAgICAgICAgICBmb3JtYXRPYmoubW9udGggPSBbJ251bWVyaWMnLCAnMi1kaWdpdCcsICdzaG9ydCcsICdsb25nJywgJ25hcnJvdyddWyQwLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgcmV0dXJuICd7bW9udGh9JztcblxuICAgICAgICAvLyAtLS0gV2VlayAobm90IHN1cHBvcnRlZCBpbiB0aGlzIHBvbHlmaWxsKVxuICAgICAgICBjYXNlICd3JzpcbiAgICAgICAgICAgIC8vIHdlZWsgb2YgdGhlIHllYXJcbiAgICAgICAgICAgIGZvcm1hdE9iai53ZWVrID0gJDAubGVuZ3RoID09PSAyID8gJzItZGlnaXQnIDogJ251bWVyaWMnO1xuICAgICAgICAgICAgcmV0dXJuICd7d2Vla2RheX0nO1xuICAgICAgICBjYXNlICdXJzpcbiAgICAgICAgICAgIC8vIHdlZWsgb2YgdGhlIG1vbnRoXG4gICAgICAgICAgICBmb3JtYXRPYmoud2VlayA9ICdudW1lcmljJztcbiAgICAgICAgICAgIHJldHVybiAne3dlZWtkYXl9JztcblxuICAgICAgICAvLyAtLS0gRGF5XG4gICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgICAgLy8gZGF5IG9mIHRoZSBtb250aFxuICAgICAgICAgICAgZm9ybWF0T2JqLmRheSA9ICQwLmxlbmd0aCA9PT0gMiA/ICcyLWRpZ2l0JyA6ICdudW1lcmljJztcbiAgICAgICAgICAgIHJldHVybiAne2RheX0nO1xuICAgICAgICBjYXNlICdEJzogLy8gZGF5IG9mIHRoZSB5ZWFyXG4gICAgICAgIGNhc2UgJ0YnOiAvLyBkYXkgb2YgdGhlIHdlZWtcbiAgICAgICAgY2FzZSAnZyc6XG4gICAgICAgICAgICAvLyAxLi5uOiBNb2RpZmllZCBKdWxpYW4gZGF5XG4gICAgICAgICAgICBmb3JtYXRPYmouZGF5ID0gJ251bWVyaWMnO1xuICAgICAgICAgICAgcmV0dXJuICd7ZGF5fSc7XG5cbiAgICAgICAgLy8gLS0tIFdlZWsgRGF5XG4gICAgICAgIGNhc2UgJ0UnOlxuICAgICAgICAgICAgLy8gZGF5IG9mIHRoZSB3ZWVrXG4gICAgICAgICAgICBmb3JtYXRPYmoud2Vla2RheSA9IFsnc2hvcnQnLCAnc2hvcnQnLCAnc2hvcnQnLCAnbG9uZycsICduYXJyb3cnLCAnc2hvcnQnXVskMC5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIHJldHVybiAne3dlZWtkYXl9JztcbiAgICAgICAgY2FzZSAnZSc6XG4gICAgICAgICAgICAvLyBsb2NhbCBkYXkgb2YgdGhlIHdlZWtcbiAgICAgICAgICAgIGZvcm1hdE9iai53ZWVrZGF5ID0gWydudW1lcmljJywgJzItZGlnaXQnLCAnc2hvcnQnLCAnbG9uZycsICduYXJyb3cnLCAnc2hvcnQnXVskMC5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIHJldHVybiAne3dlZWtkYXl9JztcbiAgICAgICAgY2FzZSAnYyc6XG4gICAgICAgICAgICAvLyBzdGFuZCBhbG9uZSBsb2NhbCBkYXkgb2YgdGhlIHdlZWtcbiAgICAgICAgICAgIGZvcm1hdE9iai53ZWVrZGF5ID0gWydudW1lcmljJywgdW5kZWZpbmVkLCAnc2hvcnQnLCAnbG9uZycsICduYXJyb3cnLCAnc2hvcnQnXVskMC5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIHJldHVybiAne3dlZWtkYXl9JztcblxuICAgICAgICAvLyAtLS0gUGVyaW9kXG4gICAgICAgIGNhc2UgJ2EnOiAvLyBBTSwgUE1cbiAgICAgICAgY2FzZSAnYic6IC8vIGFtLCBwbSwgbm9vbiwgbWlkbmlnaHRcbiAgICAgICAgY2FzZSAnQic6XG4gICAgICAgICAgICAvLyBmbGV4aWJsZSBkYXkgcGVyaW9kc1xuICAgICAgICAgICAgZm9ybWF0T2JqLmhvdXIxMiA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gJ3thbXBtfSc7XG5cbiAgICAgICAgLy8gLS0tIEhvdXJcbiAgICAgICAgY2FzZSAnaCc6XG4gICAgICAgIGNhc2UgJ0gnOlxuICAgICAgICAgICAgZm9ybWF0T2JqLmhvdXIgPSAkMC5sZW5ndGggPT09IDIgPyAnMi1kaWdpdCcgOiAnbnVtZXJpYyc7XG4gICAgICAgICAgICByZXR1cm4gJ3tob3VyfSc7XG4gICAgICAgIGNhc2UgJ2snOlxuICAgICAgICBjYXNlICdLJzpcbiAgICAgICAgICAgIGZvcm1hdE9iai5ob3VyMTIgPSB0cnVlOyAvLyAxMi1ob3VyLWN5Y2xlIHRpbWUgZm9ybWF0cyAodXNpbmcgaCBvciBLKVxuICAgICAgICAgICAgZm9ybWF0T2JqLmhvdXIgPSAkMC5sZW5ndGggPT09IDIgPyAnMi1kaWdpdCcgOiAnbnVtZXJpYyc7XG4gICAgICAgICAgICByZXR1cm4gJ3tob3VyfSc7XG5cbiAgICAgICAgLy8gLS0tIE1pbnV0ZVxuICAgICAgICBjYXNlICdtJzpcbiAgICAgICAgICAgIGZvcm1hdE9iai5taW51dGUgPSAkMC5sZW5ndGggPT09IDIgPyAnMi1kaWdpdCcgOiAnbnVtZXJpYyc7XG4gICAgICAgICAgICByZXR1cm4gJ3ttaW51dGV9JztcblxuICAgICAgICAvLyAtLS0gU2Vjb25kXG4gICAgICAgIGNhc2UgJ3MnOlxuICAgICAgICAgICAgZm9ybWF0T2JqLnNlY29uZCA9ICQwLmxlbmd0aCA9PT0gMiA/ICcyLWRpZ2l0JyA6ICdudW1lcmljJztcbiAgICAgICAgICAgIHJldHVybiAne3NlY29uZH0nO1xuICAgICAgICBjYXNlICdTJzpcbiAgICAgICAgY2FzZSAnQSc6XG4gICAgICAgICAgICBmb3JtYXRPYmouc2Vjb25kID0gJ251bWVyaWMnO1xuICAgICAgICAgICAgcmV0dXJuICd7c2Vjb25kfSc7XG5cbiAgICAgICAgLy8gLS0tIFRpbWV6b25lXG4gICAgICAgIGNhc2UgJ3onOiAvLyAxLi4zLCA0OiBzcGVjaWZpYyBub24tbG9jYXRpb24gZm9ybWF0XG4gICAgICAgIGNhc2UgJ1onOiAvLyAxLi4zLCA0LCA1OiBUaGUgSVNPODYwMSB2YXJpb3MgZm9ybWF0c1xuICAgICAgICBjYXNlICdPJzogLy8gMSwgNDogbWlsaXNlY29uZHMgaW4gZGF5IHNob3J0LCBsb25nXG4gICAgICAgIGNhc2UgJ3YnOiAvLyAxLCA0OiBnZW5lcmljIG5vbi1sb2NhdGlvbiBmb3JtYXRcbiAgICAgICAgY2FzZSAnVic6IC8vIDEsIDIsIDMsIDQ6IHRpbWUgem9uZSBJRCBvciBjaXR5XG4gICAgICAgIGNhc2UgJ1gnOiAvLyAxLCAyLCAzLCA0OiBUaGUgSVNPODYwMSB2YXJpb3MgZm9ybWF0c1xuICAgICAgICBjYXNlICd4JzpcbiAgICAgICAgICAgIC8vIDEsIDIsIDMsIDQ6IFRoZSBJU084NjAxIHZhcmlvcyBmb3JtYXRzXG4gICAgICAgICAgICAvLyB0aGlzIHBvbHlmaWxsIG9ubHkgc3VwcG9ydHMgbXVjaCwgZm9yIG5vdywgd2UgYXJlIGp1c3QgZG9pbmcgc29tZXRoaW5nIGR1bW15XG4gICAgICAgICAgICBmb3JtYXRPYmoudGltZVpvbmVOYW1lID0gJDAubGVuZ3RoIDwgNCA/ICdzaG9ydCcgOiAnbG9uZyc7XG4gICAgICAgICAgICByZXR1cm4gJ3t0aW1lWm9uZU5hbWV9JztcbiAgICB9XG59XG5cbi8qKlxuICogQ29udmVydHMgdGhlIENMRFIgYXZhaWxhYmxlRm9ybWF0cyBpbnRvIHRoZSBvYmplY3RzIGFuZCBwYXR0ZXJucyByZXF1aXJlZCBieVxuICogdGhlIEVDTUFTY3JpcHQgSW50ZXJuYXRpb25hbGl6YXRpb24gQVBJIHNwZWNpZmljYXRpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZURhdGVUaW1lRm9ybWF0KHNrZWxldG9uLCBwYXR0ZXJuKSB7XG4gICAgLy8gd2UgaWdub3JlIGNlcnRhaW4gcGF0dGVybnMgdGhhdCBhcmUgdW5zdXBwb3J0ZWQgdG8gYXZvaWQgdGhpcyBleHBlbnNpdmUgb3AuXG4gICAgaWYgKHVud2FudGVkRFRDcy50ZXN0KHBhdHRlcm4pKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgdmFyIGZvcm1hdE9iaiA9IHtcbiAgICAgICAgb3JpZ2luYWxQYXR0ZXJuOiBwYXR0ZXJuLFxuICAgICAgICBfOiB7fVxuICAgIH07XG5cbiAgICAvLyBSZXBsYWNlIHRoZSBwYXR0ZXJuIHN0cmluZyB3aXRoIHRoZSBvbmUgcmVxdWlyZWQgYnkgdGhlIHNwZWNpZmljYXRpb24sIHdoaWxzdFxuICAgIC8vIGF0IHRoZSBzYW1lIHRpbWUgZXZhbHVhdGluZyBpdCBmb3IgdGhlIHN1YnNldHMgYW5kIGZvcm1hdHNcbiAgICBmb3JtYXRPYmouZXh0ZW5kZWRQYXR0ZXJuID0gcGF0dGVybi5yZXBsYWNlKGV4cERUQ29tcG9uZW50cywgZnVuY3Rpb24gKCQwKSB7XG4gICAgICAgIC8vIFNlZSB3aGljaCBzeW1ib2wgd2UncmUgZGVhbGluZyB3aXRoXG4gICAgICAgIHJldHVybiBleHBEVENvbXBvbmVudHNNZXRhKCQwLCBmb3JtYXRPYmouXyk7XG4gICAgfSk7XG5cbiAgICAvLyBNYXRjaCB0aGUgc2tlbGV0b24gc3RyaW5nIHdpdGggdGhlIG9uZSByZXF1aXJlZCBieSB0aGUgc3BlY2lmaWNhdGlvblxuICAgIC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgYmFzZWQgb24gdGhlIERhdGUgRmllbGQgU3ltYm9sIFRhYmxlOlxuICAgIC8vIGh0dHA6Ly91bmljb2RlLm9yZy9yZXBvcnRzL3RyMzUvdHIzNS1kYXRlcy5odG1sI0RhdGVfRmllbGRfU3ltYm9sX1RhYmxlXG4gICAgLy8gTm90ZTogd2UgYXJlIGFkZGluZyBleHRyYSBkYXRhIHRvIHRoZSBmb3JtYXRPYmplY3QgZXZlbiB0aG91Z2ggdGhpcyBwb2x5ZmlsbFxuICAgIC8vICAgICAgIG1pZ2h0IG5vdCBzdXBwb3J0IGl0LlxuICAgIHNrZWxldG9uLnJlcGxhY2UoZXhwRFRDb21wb25lbnRzLCBmdW5jdGlvbiAoJDApIHtcbiAgICAgICAgLy8gU2VlIHdoaWNoIHN5bWJvbCB3ZSdyZSBkZWFsaW5nIHdpdGhcbiAgICAgICAgcmV0dXJuIGV4cERUQ29tcG9uZW50c01ldGEoJDAsIGZvcm1hdE9iaik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29tcHV0ZUZpbmFsUGF0dGVybnMoZm9ybWF0T2JqKTtcbn1cblxuLyoqXG4gKiBQcm9jZXNzZXMgRGF0ZVRpbWUgZm9ybWF0cyBmcm9tIENMRFIgdG8gYW4gZWFzaWVyLXRvLXBhcnNlIGZvcm1hdC5cbiAqIHRoZSByZXN1bHQgb2YgdGhpcyBvcGVyYXRpb24gc2hvdWxkIGJlIGNhY2hlZCB0aGUgZmlyc3QgdGltZSBhIHBhcnRpY3VsYXJcbiAqIGNhbGVuZGFyIGlzIGFuYWx5emVkLlxuICpcbiAqIFRoZSBzcGVjaWZpY2F0aW9uIHJlcXVpcmVzIHdlIHN1cHBvcnQgYXQgbGVhc3QgdGhlIGZvbGxvd2luZyBzdWJzZXRzIG9mXG4gKiBkYXRlL3RpbWUgY29tcG9uZW50czpcbiAqXG4gKiAgIC0gJ3dlZWtkYXknLCAneWVhcicsICdtb250aCcsICdkYXknLCAnaG91cicsICdtaW51dGUnLCAnc2Vjb25kJ1xuICogICAtICd3ZWVrZGF5JywgJ3llYXInLCAnbW9udGgnLCAnZGF5J1xuICogICAtICd5ZWFyJywgJ21vbnRoJywgJ2RheSdcbiAqICAgLSAneWVhcicsICdtb250aCdcbiAqICAgLSAnbW9udGgnLCAnZGF5J1xuICogICAtICdob3VyJywgJ21pbnV0ZScsICdzZWNvbmQnXG4gKiAgIC0gJ2hvdXInLCAnbWludXRlJ1xuICpcbiAqIFdlIG5lZWQgdG8gY2hlcnJ5IHBpY2sgYXQgbGVhc3QgdGhlc2Ugc3Vic2V0cyBmcm9tIHRoZSBDTERSIGRhdGEgYW5kIGNvbnZlcnRcbiAqIHRoZW0gaW50byB0aGUgcGF0dGVybiBvYmplY3RzIHVzZWQgaW4gdGhlIEVDTUEtNDAyIEFQSS5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRGF0ZVRpbWVGb3JtYXRzKGZvcm1hdHMpIHtcbiAgICB2YXIgYXZhaWxhYmxlRm9ybWF0cyA9IGZvcm1hdHMuYXZhaWxhYmxlRm9ybWF0cztcbiAgICB2YXIgdGltZUZvcm1hdHMgPSBmb3JtYXRzLnRpbWVGb3JtYXRzO1xuICAgIHZhciBkYXRlRm9ybWF0cyA9IGZvcm1hdHMuZGF0ZUZvcm1hdHM7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBza2VsZXRvbiA9IHZvaWQgMCxcbiAgICAgICAgcGF0dGVybiA9IHZvaWQgMCxcbiAgICAgICAgY29tcHV0ZWQgPSB2b2lkIDAsXG4gICAgICAgIGkgPSB2b2lkIDAsXG4gICAgICAgIGogPSB2b2lkIDA7XG4gICAgdmFyIHRpbWVSZWxhdGVkRm9ybWF0cyA9IFtdO1xuICAgIHZhciBkYXRlUmVsYXRlZEZvcm1hdHMgPSBbXTtcblxuICAgIC8vIE1hcCBhdmFpbGFibGUgKGN1c3RvbSkgZm9ybWF0cyBpbnRvIGEgcGF0dGVybiBmb3IgY3JlYXRlRGF0ZVRpbWVGb3JtYXRzXG4gICAgZm9yIChza2VsZXRvbiBpbiBhdmFpbGFibGVGb3JtYXRzKSB7XG4gICAgICAgIGlmIChhdmFpbGFibGVGb3JtYXRzLmhhc093blByb3BlcnR5KHNrZWxldG9uKSkge1xuICAgICAgICAgICAgcGF0dGVybiA9IGF2YWlsYWJsZUZvcm1hdHNbc2tlbGV0b25dO1xuICAgICAgICAgICAgY29tcHV0ZWQgPSBjcmVhdGVEYXRlVGltZUZvcm1hdChza2VsZXRvbiwgcGF0dGVybik7XG4gICAgICAgICAgICBpZiAoY29tcHV0ZWQpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjb21wdXRlZCk7XG4gICAgICAgICAgICAgICAgLy8gaW4gc29tZSBjYXNlcywgdGhlIGZvcm1hdCBpcyBvbmx5IGRpc3BsYXlpbmcgZGF0ZSBzcGVjaWZpYyBwcm9wc1xuICAgICAgICAgICAgICAgIC8vIG9yIHRpbWUgc3BlY2lmaWMgcHJvcHMsIGluIHdoaWNoIGNhc2Ugd2UgbmVlZCB0byBhbHNvIHByb2R1Y2UgdGhlXG4gICAgICAgICAgICAgICAgLy8gY29tYmluZWQgZm9ybWF0cy5cbiAgICAgICAgICAgICAgICBpZiAoaXNEYXRlRm9ybWF0T25seShjb21wdXRlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0ZVJlbGF0ZWRGb3JtYXRzLnB1c2goY29tcHV0ZWQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNUaW1lRm9ybWF0T25seShjb21wdXRlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZVJlbGF0ZWRGb3JtYXRzLnB1c2goY29tcHV0ZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1hcCB0aW1lIGZvcm1hdHMgaW50byBhIHBhdHRlcm4gZm9yIGNyZWF0ZURhdGVUaW1lRm9ybWF0c1xuICAgIGZvciAoc2tlbGV0b24gaW4gdGltZUZvcm1hdHMpIHtcbiAgICAgICAgaWYgKHRpbWVGb3JtYXRzLmhhc093blByb3BlcnR5KHNrZWxldG9uKSkge1xuICAgICAgICAgICAgcGF0dGVybiA9IHRpbWVGb3JtYXRzW3NrZWxldG9uXTtcbiAgICAgICAgICAgIGNvbXB1dGVkID0gY3JlYXRlRGF0ZVRpbWVGb3JtYXQoc2tlbGV0b24sIHBhdHRlcm4pO1xuICAgICAgICAgICAgaWYgKGNvbXB1dGVkKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goY29tcHV0ZWQpO1xuICAgICAgICAgICAgICAgIHRpbWVSZWxhdGVkRm9ybWF0cy5wdXNoKGNvbXB1dGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1hcCBkYXRlIGZvcm1hdHMgaW50byBhIHBhdHRlcm4gZm9yIGNyZWF0ZURhdGVUaW1lRm9ybWF0c1xuICAgIGZvciAoc2tlbGV0b24gaW4gZGF0ZUZvcm1hdHMpIHtcbiAgICAgICAgaWYgKGRhdGVGb3JtYXRzLmhhc093blByb3BlcnR5KHNrZWxldG9uKSkge1xuICAgICAgICAgICAgcGF0dGVybiA9IGRhdGVGb3JtYXRzW3NrZWxldG9uXTtcbiAgICAgICAgICAgIGNvbXB1dGVkID0gY3JlYXRlRGF0ZVRpbWVGb3JtYXQoc2tlbGV0b24sIHBhdHRlcm4pO1xuICAgICAgICAgICAgaWYgKGNvbXB1dGVkKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goY29tcHV0ZWQpO1xuICAgICAgICAgICAgICAgIGRhdGVSZWxhdGVkRm9ybWF0cy5wdXNoKGNvbXB1dGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvbWJpbmUgY3VzdG9tIHRpbWUgYW5kIGN1c3RvbSBkYXRlIGZvcm1hdHMgd2hlbiB0aGV5IGFyZSBvcnRob2dvbmFscyB0byBjb21wbGV0ZSB0aGVcbiAgICAvLyBmb3JtYXRzIHN1cHBvcnRlZCBieSBDTERSLlxuICAgIC8vIFRoaXMgQWxnbyBpcyBiYXNlZCBvbiBzZWN0aW9uIFwiTWlzc2luZyBTa2VsZXRvbiBGaWVsZHNcIiBmcm9tOlxuICAgIC8vIGh0dHA6Ly91bmljb2RlLm9yZy9yZXBvcnRzL3RyMzUvdHIzNS1kYXRlcy5odG1sI2F2YWlsYWJsZUZvcm1hdHNfYXBwZW5kSXRlbXNcbiAgICBmb3IgKGkgPSAwOyBpIDwgdGltZVJlbGF0ZWRGb3JtYXRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBkYXRlUmVsYXRlZEZvcm1hdHMubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChkYXRlUmVsYXRlZEZvcm1hdHNbal0ubW9udGggPT09ICdsb25nJykge1xuICAgICAgICAgICAgICAgIHBhdHRlcm4gPSBkYXRlUmVsYXRlZEZvcm1hdHNbal0ud2Vla2RheSA/IGZvcm1hdHMuZnVsbCA6IGZvcm1hdHMubG9uZztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0ZVJlbGF0ZWRGb3JtYXRzW2pdLm1vbnRoID09PSAnc2hvcnQnKSB7XG4gICAgICAgICAgICAgICAgcGF0dGVybiA9IGZvcm1hdHMubWVkaXVtO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXR0ZXJuID0gZm9ybWF0cy5zaG9ydDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbXB1dGVkID0gam9pbkRhdGVBbmRUaW1lRm9ybWF0cyhkYXRlUmVsYXRlZEZvcm1hdHNbal0sIHRpbWVSZWxhdGVkRm9ybWF0c1tpXSk7XG4gICAgICAgICAgICBjb21wdXRlZC5vcmlnaW5hbFBhdHRlcm4gPSBwYXR0ZXJuO1xuICAgICAgICAgICAgY29tcHV0ZWQuZXh0ZW5kZWRQYXR0ZXJuID0gcGF0dGVybi5yZXBsYWNlKCd7MH0nLCB0aW1lUmVsYXRlZEZvcm1hdHNbaV0uZXh0ZW5kZWRQYXR0ZXJuKS5yZXBsYWNlKCd7MX0nLCBkYXRlUmVsYXRlZEZvcm1hdHNbal0uZXh0ZW5kZWRQYXR0ZXJuKS5yZXBsYWNlKC9eWyxcXHNdK3xbLFxcc10rJC9naSwgJycpO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goY29tcHV0ZUZpbmFsUGF0dGVybnMoY29tcHV0ZWQpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIEFuIG9iamVjdCBtYXAgb2YgZGF0ZSBjb21wb25lbnQga2V5cywgc2F2ZXMgdXNpbmcgYSByZWdleCBsYXRlclxudmFyIGRhdGVXaWR0aHMgPSBvYmpDcmVhdGUobnVsbCwgeyBuYXJyb3c6IHt9LCBzaG9ydDoge30sIGxvbmc6IHt9IH0pO1xuXG4vKipcbiAqIFJldHVybnMgYSBzdHJpbmcgZm9yIGEgZGF0ZSBjb21wb25lbnQsIHJlc29sdmVkIHVzaW5nIG11bHRpcGxlIGluaGVyaXRhbmNlIGFzIHNwZWNpZmllZFxuICogYXMgc3BlY2lmaWVkIGluIHRoZSBVbmljb2RlIFRlY2huaWNhbCBTdGFuZGFyZCAzNS5cbiAqL1xuZnVuY3Rpb24gcmVzb2x2ZURhdGVTdHJpbmcoZGF0YSwgY2EsIGNvbXBvbmVudCwgd2lkdGgsIGtleSkge1xuICAgIC8vIEZyb20gaHR0cDovL3d3dy51bmljb2RlLm9yZy9yZXBvcnRzL3RyMzUvdHIzNS5odG1sI011bHRpcGxlX0luaGVyaXRhbmNlOlxuICAgIC8vICdJbiBjbGVhcmx5IHNwZWNpZmllZCBpbnN0YW5jZXMsIHJlc291cmNlcyBtYXkgaW5oZXJpdCBmcm9tIHdpdGhpbiB0aGUgc2FtZSBsb2NhbGUuXG4gICAgLy8gIEZvciBleGFtcGxlLCAuLi4gdGhlIEJ1ZGRoaXN0IGNhbGVuZGFyIGluaGVyaXRzIGZyb20gdGhlIEdyZWdvcmlhbiBjYWxlbmRhci4nXG4gICAgdmFyIG9iaiA9IGRhdGFbY2FdICYmIGRhdGFbY2FdW2NvbXBvbmVudF0gPyBkYXRhW2NhXVtjb21wb25lbnRdIDogZGF0YS5ncmVnb3J5W2NvbXBvbmVudF0sXG5cblxuICAgIC8vIFwic2lkZXdheXNcIiBpbmhlcml0YW5jZSByZXNvbHZlcyBzdHJpbmdzIHdoZW4gYSBrZXkgZG9lc24ndCBleGlzdFxuICAgIGFsdHMgPSB7XG4gICAgICAgIG5hcnJvdzogWydzaG9ydCcsICdsb25nJ10sXG4gICAgICAgIHNob3J0OiBbJ2xvbmcnLCAnbmFycm93J10sXG4gICAgICAgIGxvbmc6IFsnc2hvcnQnLCAnbmFycm93J11cbiAgICB9LFxuXG5cbiAgICAvL1xuICAgIHJlc29sdmVkID0gaG9wLmNhbGwob2JqLCB3aWR0aCkgPyBvYmpbd2lkdGhdIDogaG9wLmNhbGwob2JqLCBhbHRzW3dpZHRoXVswXSkgPyBvYmpbYWx0c1t3aWR0aF1bMF1dIDogb2JqW2FsdHNbd2lkdGhdWzFdXTtcblxuICAgIC8vIGBrZXlgIHdvdWxkbid0IGJlIHNwZWNpZmllZCBmb3IgY29tcG9uZW50cyAnZGF5UGVyaW9kcydcbiAgICByZXR1cm4ga2V5ICE9PSBudWxsID8gcmVzb2x2ZWRba2V5XSA6IHJlc29sdmVkO1xufVxuXG4vLyBEZWZpbmUgdGhlIERhdGVUaW1lRm9ybWF0IGNvbnN0cnVjdG9yIGludGVybmFsbHkgc28gaXQgY2Fubm90IGJlIHRhaW50ZWRcbmZ1bmN0aW9uIERhdGVUaW1lRm9ybWF0Q29uc3RydWN0b3IoKSB7XG4gICAgdmFyIGxvY2FsZXMgPSBhcmd1bWVudHNbMF07XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHNbMV07XG5cbiAgICBpZiAoIXRoaXMgfHwgdGhpcyA9PT0gSW50bCkge1xuICAgICAgICByZXR1cm4gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobG9jYWxlcywgb3B0aW9ucyk7XG4gICAgfVxuICAgIHJldHVybiBJbml0aWFsaXplRGF0ZVRpbWVGb3JtYXQodG9PYmplY3QodGhpcyksIGxvY2FsZXMsIG9wdGlvbnMpO1xufVxuXG5kZWZpbmVQcm9wZXJ0eShJbnRsLCAnRGF0ZVRpbWVGb3JtYXQnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiBEYXRlVGltZUZvcm1hdENvbnN0cnVjdG9yXG59KTtcblxuLy8gTXVzdCBleHBsaWNpdGx5IHNldCBwcm90b3R5cGVzIGFzIHVud3JpdGFibGVcbmRlZmluZVByb3BlcnR5KERhdGVUaW1lRm9ybWF0Q29uc3RydWN0b3IsICdwcm90b3R5cGUnLCB7XG4gICAgd3JpdGFibGU6IGZhbHNlXG59KTtcblxuLyoqXG4gKiBUaGUgYWJzdHJhY3Qgb3BlcmF0aW9uIEluaXRpYWxpemVEYXRlVGltZUZvcm1hdCBhY2NlcHRzIHRoZSBhcmd1bWVudHMgZGF0ZVRpbWVGb3JtYXRcbiAqICh3aGljaCBtdXN0IGJlIGFuIG9iamVjdCksIGxvY2FsZXMsIGFuZCBvcHRpb25zLiBJdCBpbml0aWFsaXplcyBkYXRlVGltZUZvcm1hdCBhcyBhXG4gKiBEYXRlVGltZUZvcm1hdCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIC8qIDEyLjEuMS4xICovSW5pdGlhbGl6ZURhdGVUaW1lRm9ybWF0KGRhdGVUaW1lRm9ybWF0LCBsb2NhbGVzLCBvcHRpb25zKSB7XG4gICAgLy8gVGhpcyB3aWxsIGJlIGEgaW50ZXJuYWwgcHJvcGVydGllcyBvYmplY3QgaWYgd2UncmUgbm90IGFscmVhZHkgaW5pdGlhbGl6ZWRcbiAgICB2YXIgaW50ZXJuYWwgPSBnZXRJbnRlcm5hbFByb3BlcnRpZXMoZGF0ZVRpbWVGb3JtYXQpO1xuXG4gICAgLy8gQ3JlYXRlIGFuIG9iamVjdCB3aG9zZSBwcm9wcyBjYW4gYmUgdXNlZCB0byByZXN0b3JlIHRoZSB2YWx1ZXMgb2YgUmVnRXhwIHByb3BzXG4gICAgdmFyIHJlZ2V4cFN0YXRlID0gY3JlYXRlUmVnRXhwUmVzdG9yZSgpO1xuXG4gICAgLy8gMS4gSWYgZGF0ZVRpbWVGb3JtYXQgaGFzIGFuIFtbaW5pdGlhbGl6ZWRJbnRsT2JqZWN0XV0gaW50ZXJuYWwgcHJvcGVydHkgd2l0aFxuICAgIC8vICAgIHZhbHVlIHRydWUsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICBpZiAoaW50ZXJuYWxbJ1tbaW5pdGlhbGl6ZWRJbnRsT2JqZWN0XV0nXSA9PT0gdHJ1ZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignYHRoaXNgIG9iamVjdCBoYXMgYWxyZWFkeSBiZWVuIGluaXRpYWxpemVkIGFzIGFuIEludGwgb2JqZWN0Jyk7XG5cbiAgICAvLyBOZWVkIHRoaXMgdG8gYWNjZXNzIHRoZSBgaW50ZXJuYWxgIG9iamVjdFxuICAgIGRlZmluZVByb3BlcnR5KGRhdGVUaW1lRm9ybWF0LCAnX19nZXRJbnRlcm5hbFByb3BlcnRpZXMnLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZSgpIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IE5vbi1zdGFuZGFyZCwgZm9yIGludGVybmFsIHVzZSBvbmx5XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzWzBdID09PSBzZWNyZXQpIHJldHVybiBpbnRlcm5hbDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gMi4gU2V0IHRoZSBbW2luaXRpYWxpemVkSW50bE9iamVjdF1dIGludGVybmFsIHByb3BlcnR5IG9mIG51bWJlckZvcm1hdCB0byB0cnVlLlxuICAgIGludGVybmFsWydbW2luaXRpYWxpemVkSW50bE9iamVjdF1dJ10gPSB0cnVlO1xuXG4gICAgLy8gMy4gTGV0IHJlcXVlc3RlZExvY2FsZXMgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBDYW5vbmljYWxpemVMb2NhbGVMaXN0XG4gICAgLy8gICAgYWJzdHJhY3Qgb3BlcmF0aW9uIChkZWZpbmVkIGluIDkuMi4xKSB3aXRoIGFyZ3VtZW50IGxvY2FsZXMuXG4gICAgdmFyIHJlcXVlc3RlZExvY2FsZXMgPSBDYW5vbmljYWxpemVMb2NhbGVMaXN0KGxvY2FsZXMpO1xuXG4gICAgLy8gNC4gTGV0IG9wdGlvbnMgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBUb0RhdGVUaW1lT3B0aW9ucyBhYnN0cmFjdFxuICAgIC8vICAgIG9wZXJhdGlvbiAoZGVmaW5lZCBiZWxvdykgd2l0aCBhcmd1bWVudHMgb3B0aW9ucywgXCJhbnlcIiwgYW5kIFwiZGF0ZVwiLlxuICAgIG9wdGlvbnMgPSBUb0RhdGVUaW1lT3B0aW9ucyhvcHRpb25zLCAnYW55JywgJ2RhdGUnKTtcblxuICAgIC8vIDUuIExldCBvcHQgYmUgYSBuZXcgUmVjb3JkLlxuICAgIHZhciBvcHQgPSBuZXcgUmVjb3JkKCk7XG5cbiAgICAvLyA2LiBMZXQgbWF0Y2hlciBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldE9wdGlvbiBhYnN0cmFjdCBvcGVyYXRpb25cbiAgICAvLyAgICAoZGVmaW5lZCBpbiA5LjIuOSkgd2l0aCBhcmd1bWVudHMgb3B0aW9ucywgXCJsb2NhbGVNYXRjaGVyXCIsIFwic3RyaW5nXCIsIGEgTGlzdFxuICAgIC8vICAgIGNvbnRhaW5pbmcgdGhlIHR3byBTdHJpbmcgdmFsdWVzIFwibG9va3VwXCIgYW5kIFwiYmVzdCBmaXRcIiwgYW5kIFwiYmVzdCBmaXRcIi5cbiAgICB2YXIgbWF0Y2hlciA9IEdldE9wdGlvbihvcHRpb25zLCAnbG9jYWxlTWF0Y2hlcicsICdzdHJpbmcnLCBuZXcgTGlzdCgnbG9va3VwJywgJ2Jlc3QgZml0JyksICdiZXN0IGZpdCcpO1xuXG4gICAgLy8gNy4gU2V0IG9wdC5bW2xvY2FsZU1hdGNoZXJdXSB0byBtYXRjaGVyLlxuICAgIG9wdFsnW1tsb2NhbGVNYXRjaGVyXV0nXSA9IG1hdGNoZXI7XG5cbiAgICAvLyA4LiBMZXQgRGF0ZVRpbWVGb3JtYXQgYmUgdGhlIHN0YW5kYXJkIGJ1aWx0LWluIG9iamVjdCB0aGF0IGlzIHRoZSBpbml0aWFsXG4gICAgLy8gICAgdmFsdWUgb2YgSW50bC5EYXRlVGltZUZvcm1hdC5cbiAgICB2YXIgRGF0ZVRpbWVGb3JtYXQgPSBpbnRlcm5hbHMuRGF0ZVRpbWVGb3JtYXQ7IC8vIFRoaXMgaXMgd2hhdCB3ZSAqcmVhbGx5KiBuZWVkXG5cbiAgICAvLyA5LiBMZXQgbG9jYWxlRGF0YSBiZSB0aGUgdmFsdWUgb2YgdGhlIFtbbG9jYWxlRGF0YV1dIGludGVybmFsIHByb3BlcnR5IG9mXG4gICAgLy8gICAgRGF0ZVRpbWVGb3JtYXQuXG4gICAgdmFyIGxvY2FsZURhdGEgPSBEYXRlVGltZUZvcm1hdFsnW1tsb2NhbGVEYXRhXV0nXTtcblxuICAgIC8vIDEwLiBMZXQgciBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFJlc29sdmVMb2NhbGUgYWJzdHJhY3Qgb3BlcmF0aW9uXG4gICAgLy8gICAgIChkZWZpbmVkIGluIDkuMi41KSB3aXRoIHRoZSBbW2F2YWlsYWJsZUxvY2FsZXNdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZlxuICAgIC8vICAgICAgRGF0ZVRpbWVGb3JtYXQsIHJlcXVlc3RlZExvY2FsZXMsIG9wdCwgdGhlIFtbcmVsZXZhbnRFeHRlbnNpb25LZXlzXV1cbiAgICAvLyAgICAgIGludGVybmFsIHByb3BlcnR5IG9mIERhdGVUaW1lRm9ybWF0LCBhbmQgbG9jYWxlRGF0YS5cbiAgICB2YXIgciA9IFJlc29sdmVMb2NhbGUoRGF0ZVRpbWVGb3JtYXRbJ1tbYXZhaWxhYmxlTG9jYWxlc11dJ10sIHJlcXVlc3RlZExvY2FsZXMsIG9wdCwgRGF0ZVRpbWVGb3JtYXRbJ1tbcmVsZXZhbnRFeHRlbnNpb25LZXlzXV0nXSwgbG9jYWxlRGF0YSk7XG5cbiAgICAvLyAxMS4gU2V0IHRoZSBbW2xvY2FsZV1dIGludGVybmFsIHByb3BlcnR5IG9mIGRhdGVUaW1lRm9ybWF0IHRvIHRoZSB2YWx1ZSBvZlxuICAgIC8vICAgICByLltbbG9jYWxlXV0uXG4gICAgaW50ZXJuYWxbJ1tbbG9jYWxlXV0nXSA9IHJbJ1tbbG9jYWxlXV0nXTtcblxuICAgIC8vIDEyLiBTZXQgdGhlIFtbY2FsZW5kYXJdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBkYXRlVGltZUZvcm1hdCB0byB0aGUgdmFsdWUgb2ZcbiAgICAvLyAgICAgci5bW2NhXV0uXG4gICAgaW50ZXJuYWxbJ1tbY2FsZW5kYXJdXSddID0gclsnW1tjYV1dJ107XG5cbiAgICAvLyAxMy4gU2V0IHRoZSBbW251bWJlcmluZ1N5c3RlbV1dIGludGVybmFsIHByb3BlcnR5IG9mIGRhdGVUaW1lRm9ybWF0IHRvIHRoZSB2YWx1ZSBvZlxuICAgIC8vICAgICByLltbbnVdXS5cbiAgICBpbnRlcm5hbFsnW1tudW1iZXJpbmdTeXN0ZW1dXSddID0gclsnW1tudV1dJ107XG5cbiAgICAvLyBUaGUgc3BlY2lmaWNhdGlvbiBkb2Vzbid0IHRlbGwgdXMgdG8gZG8gdGhpcywgYnV0IGl0J3MgaGVscGZ1bCBsYXRlciBvblxuICAgIGludGVybmFsWydbW2RhdGFMb2NhbGVdXSddID0gclsnW1tkYXRhTG9jYWxlXV0nXTtcblxuICAgIC8vIDE0LiBMZXQgZGF0YUxvY2FsZSBiZSB0aGUgdmFsdWUgb2Ygci5bW2RhdGFMb2NhbGVdXS5cbiAgICB2YXIgZGF0YUxvY2FsZSA9IHJbJ1tbZGF0YUxvY2FsZV1dJ107XG5cbiAgICAvLyAxNS4gTGV0IHR6IGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2Ygb3B0aW9ucyB3aXRoXG4gICAgLy8gICAgIGFyZ3VtZW50IFwidGltZVpvbmVcIi5cbiAgICB2YXIgdHogPSBvcHRpb25zLnRpbWVab25lO1xuXG4gICAgLy8gMTYuIElmIHR6IGlzIG5vdCB1bmRlZmluZWQsIHRoZW5cbiAgICBpZiAodHogIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBhLiBMZXQgdHogYmUgVG9TdHJpbmcodHopLlxuICAgICAgICAvLyBiLiBDb252ZXJ0IHR6IHRvIHVwcGVyIGNhc2UgYXMgZGVzY3JpYmVkIGluIDYuMS5cbiAgICAgICAgLy8gICAgTk9URTogSWYgYW4gaW1wbGVtZW50YXRpb24gYWNjZXB0cyBhZGRpdGlvbmFsIHRpbWUgem9uZSB2YWx1ZXMsIGFzIHBlcm1pdHRlZFxuICAgICAgICAvLyAgICAgICAgICB1bmRlciBjZXJ0YWluIGNvbmRpdGlvbnMgYnkgdGhlIENvbmZvcm1hbmNlIGNsYXVzZSwgZGlmZmVyZW50IGNhc2luZ1xuICAgICAgICAvLyAgICAgICAgICBydWxlcyBhcHBseS5cbiAgICAgICAgdHogPSB0b0xhdGluVXBwZXJDYXNlKHR6KTtcblxuICAgICAgICAvLyBjLiBJZiB0eiBpcyBub3QgXCJVVENcIiwgdGhlbiB0aHJvdyBhIFJhbmdlRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICAvLyAjIyNUT0RPOiBhY2NlcHQgbW9yZSB0aW1lIHpvbmVzIyMjXG4gICAgICAgIGlmICh0eiAhPT0gJ1VUQycpIHRocm93IG5ldyBSYW5nZUVycm9yKCd0aW1lWm9uZSBpcyBub3Qgc3VwcG9ydGVkLicpO1xuICAgIH1cblxuICAgIC8vIDE3LiBTZXQgdGhlIFtbdGltZVpvbmVdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBkYXRlVGltZUZvcm1hdCB0byB0ei5cbiAgICBpbnRlcm5hbFsnW1t0aW1lWm9uZV1dJ10gPSB0ejtcblxuICAgIC8vIDE4LiBMZXQgb3B0IGJlIGEgbmV3IFJlY29yZC5cbiAgICBvcHQgPSBuZXcgUmVjb3JkKCk7XG5cbiAgICAvLyAxOS4gRm9yIGVhY2ggcm93IG9mIFRhYmxlIDMsIGV4Y2VwdCB0aGUgaGVhZGVyIHJvdywgZG86XG4gICAgZm9yICh2YXIgcHJvcCBpbiBkYXRlVGltZUNvbXBvbmVudHMpIHtcbiAgICAgICAgaWYgKCFob3AuY2FsbChkYXRlVGltZUNvbXBvbmVudHMsIHByb3ApKSBjb250aW51ZTtcblxuICAgICAgICAvLyAyMC4gTGV0IHByb3AgYmUgdGhlIG5hbWUgZ2l2ZW4gaW4gdGhlIFByb3BlcnR5IGNvbHVtbiBvZiB0aGUgcm93LlxuICAgICAgICAvLyAyMS4gTGV0IHZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0T3B0aW9uIGFic3RyYWN0IG9wZXJhdGlvbixcbiAgICAgICAgLy8gICAgIHBhc3NpbmcgYXMgYXJndW1lbnQgb3B0aW9ucywgdGhlIG5hbWUgZ2l2ZW4gaW4gdGhlIFByb3BlcnR5IGNvbHVtbiBvZiB0aGVcbiAgICAgICAgLy8gICAgIHJvdywgXCJzdHJpbmdcIiwgYSBMaXN0IGNvbnRhaW5pbmcgdGhlIHN0cmluZ3MgZ2l2ZW4gaW4gdGhlIFZhbHVlcyBjb2x1bW4gb2ZcbiAgICAgICAgLy8gICAgIHRoZSByb3csIGFuZCB1bmRlZmluZWQuXG4gICAgICAgIHZhciB2YWx1ZSA9IEdldE9wdGlvbihvcHRpb25zLCBwcm9wLCAnc3RyaW5nJywgZGF0ZVRpbWVDb21wb25lbnRzW3Byb3BdKTtcblxuICAgICAgICAvLyAyMi4gU2V0IG9wdC5bWzxwcm9wPl1dIHRvIHZhbHVlLlxuICAgICAgICBvcHRbJ1tbJyArIHByb3AgKyAnXV0nXSA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8vIEFzc2lnbmVkIGEgdmFsdWUgYmVsb3dcbiAgICB2YXIgYmVzdEZvcm1hdCA9IHZvaWQgMDtcblxuICAgIC8vIDIzLiBMZXQgZGF0YUxvY2FsZURhdGEgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZlxuICAgIC8vICAgICBsb2NhbGVEYXRhIHdpdGggYXJndW1lbnQgZGF0YUxvY2FsZS5cbiAgICB2YXIgZGF0YUxvY2FsZURhdGEgPSBsb2NhbGVEYXRhW2RhdGFMb2NhbGVdO1xuXG4gICAgLy8gMjQuIExldCBmb3JtYXRzIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAvLyAgICAgZGF0YUxvY2FsZURhdGEgd2l0aCBhcmd1bWVudCBcImZvcm1hdHNcIi5cbiAgICAvLyAgICAgTm90ZTogd2UgcHJvY2VzcyB0aGUgQ0xEUiBmb3JtYXRzIGludG8gdGhlIHNwZWMnZCBzdHJ1Y3R1cmVcbiAgICB2YXIgZm9ybWF0cyA9IFRvRGF0ZVRpbWVGb3JtYXRzKGRhdGFMb2NhbGVEYXRhLmZvcm1hdHMpO1xuXG4gICAgLy8gMjUuIExldCBtYXRjaGVyIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0T3B0aW9uIGFic3RyYWN0IG9wZXJhdGlvbiB3aXRoXG4gICAgLy8gICAgIGFyZ3VtZW50cyBvcHRpb25zLCBcImZvcm1hdE1hdGNoZXJcIiwgXCJzdHJpbmdcIiwgYSBMaXN0IGNvbnRhaW5pbmcgdGhlIHR3byBTdHJpbmdcbiAgICAvLyAgICAgdmFsdWVzIFwiYmFzaWNcIiBhbmQgXCJiZXN0IGZpdFwiLCBhbmQgXCJiZXN0IGZpdFwiLlxuICAgIG1hdGNoZXIgPSBHZXRPcHRpb24ob3B0aW9ucywgJ2Zvcm1hdE1hdGNoZXInLCAnc3RyaW5nJywgbmV3IExpc3QoJ2Jhc2ljJywgJ2Jlc3QgZml0JyksICdiZXN0IGZpdCcpO1xuXG4gICAgLy8gT3B0aW1pemF0aW9uOiBjYWNoaW5nIHRoZSBwcm9jZXNzZWQgZm9ybWF0cyBhcyBhIG9uZSB0aW1lIG9wZXJhdGlvbiBieVxuICAgIC8vIHJlcGxhY2luZyB0aGUgaW5pdGlhbCBzdHJ1Y3R1cmUgZnJvbSBsb2NhbGVEYXRhXG4gICAgZGF0YUxvY2FsZURhdGEuZm9ybWF0cyA9IGZvcm1hdHM7XG5cbiAgICAvLyAyNi4gSWYgbWF0Y2hlciBpcyBcImJhc2ljXCIsIHRoZW5cbiAgICBpZiAobWF0Y2hlciA9PT0gJ2Jhc2ljJykge1xuICAgICAgICAvLyAyNy4gTGV0IGJlc3RGb3JtYXQgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBCYXNpY0Zvcm1hdE1hdGNoZXIgYWJzdHJhY3RcbiAgICAgICAgLy8gICAgIG9wZXJhdGlvbiAoZGVmaW5lZCBiZWxvdykgd2l0aCBvcHQgYW5kIGZvcm1hdHMuXG4gICAgICAgIGJlc3RGb3JtYXQgPSBCYXNpY0Zvcm1hdE1hdGNoZXIob3B0LCBmb3JtYXRzKTtcblxuICAgICAgICAvLyAyOC4gRWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gZGl2ZXJnaW5nXG4gICAgICAgICAgICAgICAgdmFyIF9ociA9IEdldE9wdGlvbihvcHRpb25zLCAnaG91cjEyJywgJ2Jvb2xlYW4nIC8qLCB1bmRlZmluZWQsIHVuZGVmaW5lZCovKTtcbiAgICAgICAgICAgICAgICBvcHQuaG91cjEyID0gX2hyID09PSB1bmRlZmluZWQgPyBkYXRhTG9jYWxlRGF0YS5ob3VyMTIgOiBfaHI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAyOS4gTGV0IGJlc3RGb3JtYXQgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBCZXN0Rml0Rm9ybWF0TWF0Y2hlclxuICAgICAgICAgICAgLy8gICAgIGFic3RyYWN0IG9wZXJhdGlvbiAoZGVmaW5lZCBiZWxvdykgd2l0aCBvcHQgYW5kIGZvcm1hdHMuXG4gICAgICAgICAgICBiZXN0Rm9ybWF0ID0gQmVzdEZpdEZvcm1hdE1hdGNoZXIob3B0LCBmb3JtYXRzKTtcbiAgICAgICAgfVxuXG4gICAgLy8gMzAuIEZvciBlYWNoIHJvdyBpbiBUYWJsZSAzLCBleGNlcHQgdGhlIGhlYWRlciByb3csIGRvXG4gICAgZm9yICh2YXIgX3Byb3AgaW4gZGF0ZVRpbWVDb21wb25lbnRzKSB7XG4gICAgICAgIGlmICghaG9wLmNhbGwoZGF0ZVRpbWVDb21wb25lbnRzLCBfcHJvcCkpIGNvbnRpbnVlO1xuXG4gICAgICAgIC8vIGEuIExldCBwcm9wIGJlIHRoZSBuYW1lIGdpdmVuIGluIHRoZSBQcm9wZXJ0eSBjb2x1bW4gb2YgdGhlIHJvdy5cbiAgICAgICAgLy8gYi4gTGV0IHBEZXNjIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZlxuICAgICAgICAvLyAgICBiZXN0Rm9ybWF0IHdpdGggYXJndW1lbnQgcHJvcC5cbiAgICAgICAgLy8gYy4gSWYgcERlc2MgaXMgbm90IHVuZGVmaW5lZCwgdGhlblxuICAgICAgICBpZiAoaG9wLmNhbGwoYmVzdEZvcm1hdCwgX3Byb3ApKSB7XG4gICAgICAgICAgICAvLyBpLiBMZXQgcCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mIGJlc3RGb3JtYXRcbiAgICAgICAgICAgIC8vICAgIHdpdGggYXJndW1lbnQgcHJvcC5cbiAgICAgICAgICAgIHZhciBwID0gYmVzdEZvcm1hdFtfcHJvcF07XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gZGl2ZXJnaW5nXG4gICAgICAgICAgICAgICAgcCA9IGJlc3RGb3JtYXQuXyAmJiBob3AuY2FsbChiZXN0Rm9ybWF0Ll8sIF9wcm9wKSA/IGJlc3RGb3JtYXQuX1tfcHJvcF0gOiBwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpaS4gU2V0IHRoZSBbWzxwcm9wPl1dIGludGVybmFsIHByb3BlcnR5IG9mIGRhdGVUaW1lRm9ybWF0IHRvIHAuXG4gICAgICAgICAgICBpbnRlcm5hbFsnW1snICsgX3Byb3AgKyAnXV0nXSA9IHA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcGF0dGVybiA9IHZvaWQgMDsgLy8gQXNzaWduZWQgYSB2YWx1ZSBiZWxvd1xuXG4gICAgLy8gMzEuIExldCBocjEyIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0T3B0aW9uIGFic3RyYWN0IG9wZXJhdGlvbiB3aXRoXG4gICAgLy8gICAgIGFyZ3VtZW50cyBvcHRpb25zLCBcImhvdXIxMlwiLCBcImJvb2xlYW5cIiwgdW5kZWZpbmVkLCBhbmQgdW5kZWZpbmVkLlxuICAgIHZhciBocjEyID0gR2V0T3B0aW9uKG9wdGlvbnMsICdob3VyMTInLCAnYm9vbGVhbicgLyosIHVuZGVmaW5lZCwgdW5kZWZpbmVkKi8pO1xuXG4gICAgLy8gMzIuIElmIGRhdGVUaW1lRm9ybWF0IGhhcyBhbiBpbnRlcm5hbCBwcm9wZXJ0eSBbW2hvdXJdXSwgdGhlblxuICAgIGlmIChpbnRlcm5hbFsnW1tob3VyXV0nXSkge1xuICAgICAgICAvLyBhLiBJZiBocjEyIGlzIHVuZGVmaW5lZCwgdGhlbiBsZXQgaHIxMiBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV1cbiAgICAgICAgLy8gICAgaW50ZXJuYWwgbWV0aG9kIG9mIGRhdGFMb2NhbGVEYXRhIHdpdGggYXJndW1lbnQgXCJob3VyMTJcIi5cbiAgICAgICAgaHIxMiA9IGhyMTIgPT09IHVuZGVmaW5lZCA/IGRhdGFMb2NhbGVEYXRhLmhvdXIxMiA6IGhyMTI7XG5cbiAgICAgICAgLy8gYi4gU2V0IHRoZSBbW2hvdXIxMl1dIGludGVybmFsIHByb3BlcnR5IG9mIGRhdGVUaW1lRm9ybWF0IHRvIGhyMTIuXG4gICAgICAgIGludGVybmFsWydbW2hvdXIxMl1dJ10gPSBocjEyO1xuXG4gICAgICAgIC8vIGMuIElmIGhyMTIgaXMgdHJ1ZSwgdGhlblxuICAgICAgICBpZiAoaHIxMiA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy8gaS4gTGV0IGhvdXJObzAgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZlxuICAgICAgICAgICAgLy8gICAgZGF0YUxvY2FsZURhdGEgd2l0aCBhcmd1bWVudCBcImhvdXJObzBcIi5cbiAgICAgICAgICAgIHZhciBob3VyTm8wID0gZGF0YUxvY2FsZURhdGEuaG91ck5vMDtcblxuICAgICAgICAgICAgLy8gaWkuIFNldCB0aGUgW1tob3VyTm8wXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgZGF0ZVRpbWVGb3JtYXQgdG8gaG91ck5vMC5cbiAgICAgICAgICAgIGludGVybmFsWydbW2hvdXJObzBdXSddID0gaG91ck5vMDtcblxuICAgICAgICAgICAgLy8gaWlpLiBMZXQgcGF0dGVybiBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgICAgICAgICAvLyAgICAgIGJlc3RGb3JtYXQgd2l0aCBhcmd1bWVudCBcInBhdHRlcm4xMlwiLlxuICAgICAgICAgICAgcGF0dGVybiA9IGJlc3RGb3JtYXQucGF0dGVybjEyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZC4gRWxzZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICAvLyBpLiBMZXQgcGF0dGVybiBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgICAgICAgICAvLyAgICBiZXN0Rm9ybWF0IHdpdGggYXJndW1lbnQgXCJwYXR0ZXJuXCIuXG4gICAgICAgICAgICBwYXR0ZXJuID0gYmVzdEZvcm1hdC5wYXR0ZXJuO1xuICAgIH1cblxuICAgIC8vIDMzLiBFbHNlXG4gICAgZWxzZVxuICAgICAgICAvLyBhLiBMZXQgcGF0dGVybiBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgICAgIC8vICAgIGJlc3RGb3JtYXQgd2l0aCBhcmd1bWVudCBcInBhdHRlcm5cIi5cbiAgICAgICAgcGF0dGVybiA9IGJlc3RGb3JtYXQucGF0dGVybjtcblxuICAgIC8vIDM0LiBTZXQgdGhlIFtbcGF0dGVybl1dIGludGVybmFsIHByb3BlcnR5IG9mIGRhdGVUaW1lRm9ybWF0IHRvIHBhdHRlcm4uXG4gICAgaW50ZXJuYWxbJ1tbcGF0dGVybl1dJ10gPSBwYXR0ZXJuO1xuXG4gICAgLy8gMzUuIFNldCB0aGUgW1tib3VuZEZvcm1hdF1dIGludGVybmFsIHByb3BlcnR5IG9mIGRhdGVUaW1lRm9ybWF0IHRvIHVuZGVmaW5lZC5cbiAgICBpbnRlcm5hbFsnW1tib3VuZEZvcm1hdF1dJ10gPSB1bmRlZmluZWQ7XG5cbiAgICAvLyAzNi4gU2V0IHRoZSBbW2luaXRpYWxpemVkRGF0ZVRpbWVGb3JtYXRdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBkYXRlVGltZUZvcm1hdCB0b1xuICAgIC8vICAgICB0cnVlLlxuICAgIGludGVybmFsWydbW2luaXRpYWxpemVkRGF0ZVRpbWVGb3JtYXRdXSddID0gdHJ1ZTtcblxuICAgIC8vIEluIEVTMywgd2UgbmVlZCB0byBwcmUtYmluZCB0aGUgZm9ybWF0KCkgZnVuY3Rpb25cbiAgICBpZiAoZXMzKSBkYXRlVGltZUZvcm1hdC5mb3JtYXQgPSBHZXRGb3JtYXREYXRlVGltZS5jYWxsKGRhdGVUaW1lRm9ybWF0KTtcblxuICAgIC8vIFJlc3RvcmUgdGhlIFJlZ0V4cCBwcm9wZXJ0aWVzXG4gICAgcmVnZXhwU3RhdGUuZXhwLnRlc3QocmVnZXhwU3RhdGUuaW5wdXQpO1xuXG4gICAgLy8gUmV0dXJuIHRoZSBuZXdseSBpbml0aWFsaXNlZCBvYmplY3RcbiAgICByZXR1cm4gZGF0ZVRpbWVGb3JtYXQ7XG59XG5cbi8qKlxuICogU2V2ZXJhbCBEYXRlVGltZUZvcm1hdCBhbGdvcml0aG1zIHVzZSB2YWx1ZXMgZnJvbSB0aGUgZm9sbG93aW5nIHRhYmxlLCB3aGljaCBwcm92aWRlc1xuICogcHJvcGVydHkgbmFtZXMgYW5kIGFsbG93YWJsZSB2YWx1ZXMgZm9yIHRoZSBjb21wb25lbnRzIG9mIGRhdGUgYW5kIHRpbWUgZm9ybWF0czpcbiAqL1xudmFyIGRhdGVUaW1lQ29tcG9uZW50cyA9IHtcbiAgICB3ZWVrZGF5OiBbXCJuYXJyb3dcIiwgXCJzaG9ydFwiLCBcImxvbmdcIl0sXG4gICAgZXJhOiBbXCJuYXJyb3dcIiwgXCJzaG9ydFwiLCBcImxvbmdcIl0sXG4gICAgeWVhcjogW1wiMi1kaWdpdFwiLCBcIm51bWVyaWNcIl0sXG4gICAgbW9udGg6IFtcIjItZGlnaXRcIiwgXCJudW1lcmljXCIsIFwibmFycm93XCIsIFwic2hvcnRcIiwgXCJsb25nXCJdLFxuICAgIGRheTogW1wiMi1kaWdpdFwiLCBcIm51bWVyaWNcIl0sXG4gICAgaG91cjogW1wiMi1kaWdpdFwiLCBcIm51bWVyaWNcIl0sXG4gICAgbWludXRlOiBbXCIyLWRpZ2l0XCIsIFwibnVtZXJpY1wiXSxcbiAgICBzZWNvbmQ6IFtcIjItZGlnaXRcIiwgXCJudW1lcmljXCJdLFxuICAgIHRpbWVab25lTmFtZTogW1wic2hvcnRcIiwgXCJsb25nXCJdXG59O1xuXG4vKipcbiAqIFdoZW4gdGhlIFRvRGF0ZVRpbWVPcHRpb25zIGFic3RyYWN0IG9wZXJhdGlvbiBpcyBjYWxsZWQgd2l0aCBhcmd1bWVudHMgb3B0aW9ucyxcbiAqIHJlcXVpcmVkLCBhbmQgZGVmYXVsdHMsIHRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHRha2VuOlxuICovXG5mdW5jdGlvbiBUb0RhdGVUaW1lRm9ybWF0cyhmb3JtYXRzKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChmb3JtYXRzKSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgICByZXR1cm4gZm9ybWF0cztcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZURhdGVUaW1lRm9ybWF0cyhmb3JtYXRzKTtcbn1cblxuLyoqXG4gKiBXaGVuIHRoZSBUb0RhdGVUaW1lT3B0aW9ucyBhYnN0cmFjdCBvcGVyYXRpb24gaXMgY2FsbGVkIHdpdGggYXJndW1lbnRzIG9wdGlvbnMsXG4gKiByZXF1aXJlZCwgYW5kIGRlZmF1bHRzLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAqL1xuZnVuY3Rpb24gVG9EYXRlVGltZU9wdGlvbnMob3B0aW9ucywgcmVxdWlyZWQsIGRlZmF1bHRzKSB7XG4gICAgLy8gMS4gSWYgb3B0aW9ucyBpcyB1bmRlZmluZWQsIHRoZW4gbGV0IG9wdGlvbnMgYmUgbnVsbCwgZWxzZSBsZXQgb3B0aW9ucyBiZVxuICAgIC8vICAgIFRvT2JqZWN0KG9wdGlvbnMpLlxuICAgIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpIG9wdGlvbnMgPSBudWxsO2Vsc2Uge1xuICAgICAgICAvLyAoIzEyKSBvcHRpb25zIG5lZWRzIHRvIGJlIGEgUmVjb3JkLCBidXQgaXQgYWxzbyBuZWVkcyB0byBpbmhlcml0IHByb3BlcnRpZXNcbiAgICAgICAgdmFyIG9wdDIgPSB0b09iamVjdChvcHRpb25zKTtcbiAgICAgICAgb3B0aW9ucyA9IG5ldyBSZWNvcmQoKTtcblxuICAgICAgICBmb3IgKHZhciBrIGluIG9wdDIpIHtcbiAgICAgICAgICAgIG9wdGlvbnNba10gPSBvcHQyW2tdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gMi4gTGV0IGNyZWF0ZSBiZSB0aGUgc3RhbmRhcmQgYnVpbHQtaW4gZnVuY3Rpb24gb2JqZWN0IGRlZmluZWQgaW4gRVM1LCAxNS4yLjMuNS5cbiAgICB2YXIgY3JlYXRlID0gb2JqQ3JlYXRlO1xuXG4gICAgLy8gMy4gTGV0IG9wdGlvbnMgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2Qgb2YgY3JlYXRlIHdpdGhcbiAgICAvLyAgICB1bmRlZmluZWQgYXMgdGhlIHRoaXMgdmFsdWUgYW5kIGFuIGFyZ3VtZW50IGxpc3QgY29udGFpbmluZyB0aGUgc2luZ2xlIGl0ZW1cbiAgICAvLyAgICBvcHRpb25zLlxuICAgIG9wdGlvbnMgPSBjcmVhdGUob3B0aW9ucyk7XG5cbiAgICAvLyA0LiBMZXQgbmVlZERlZmF1bHRzIGJlIHRydWUuXG4gICAgdmFyIG5lZWREZWZhdWx0cyA9IHRydWU7XG5cbiAgICAvLyA1LiBJZiByZXF1aXJlZCBpcyBcImRhdGVcIiBvciBcImFueVwiLCB0aGVuXG4gICAgaWYgKHJlcXVpcmVkID09PSAnZGF0ZScgfHwgcmVxdWlyZWQgPT09ICdhbnknKSB7XG4gICAgICAgIC8vIGEuIEZvciBlYWNoIG9mIHRoZSBwcm9wZXJ0eSBuYW1lcyBcIndlZWtkYXlcIiwgXCJ5ZWFyXCIsIFwibW9udGhcIiwgXCJkYXlcIjpcbiAgICAgICAgLy8gaS4gSWYgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZiBvcHRpb25zIHdpdGggdGhlXG4gICAgICAgIC8vICAgIHByb3BlcnR5IG5hbWUgaXMgbm90IHVuZGVmaW5lZCwgdGhlbiBsZXQgbmVlZERlZmF1bHRzIGJlIGZhbHNlLlxuICAgICAgICBpZiAob3B0aW9ucy53ZWVrZGF5ICE9PSB1bmRlZmluZWQgfHwgb3B0aW9ucy55ZWFyICE9PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5tb250aCAhPT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMuZGF5ICE9PSB1bmRlZmluZWQpIG5lZWREZWZhdWx0cyA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIDYuIElmIHJlcXVpcmVkIGlzIFwidGltZVwiIG9yIFwiYW55XCIsIHRoZW5cbiAgICBpZiAocmVxdWlyZWQgPT09ICd0aW1lJyB8fCByZXF1aXJlZCA9PT0gJ2FueScpIHtcbiAgICAgICAgLy8gYS4gRm9yIGVhY2ggb2YgdGhlIHByb3BlcnR5IG5hbWVzIFwiaG91clwiLCBcIm1pbnV0ZVwiLCBcInNlY29uZFwiOlxuICAgICAgICAvLyBpLiBJZiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mIG9wdGlvbnMgd2l0aCB0aGVcbiAgICAgICAgLy8gICAgcHJvcGVydHkgbmFtZSBpcyBub3QgdW5kZWZpbmVkLCB0aGVuIGxldCBuZWVkRGVmYXVsdHMgYmUgZmFsc2UuXG4gICAgICAgIGlmIChvcHRpb25zLmhvdXIgIT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLm1pbnV0ZSAhPT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMuc2Vjb25kICE9PSB1bmRlZmluZWQpIG5lZWREZWZhdWx0cyA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIDcuIElmIG5lZWREZWZhdWx0cyBpcyB0cnVlIGFuZCBkZWZhdWx0cyBpcyBlaXRoZXIgXCJkYXRlXCIgb3IgXCJhbGxcIiwgdGhlblxuICAgIGlmIChuZWVkRGVmYXVsdHMgJiYgKGRlZmF1bHRzID09PSAnZGF0ZScgfHwgZGVmYXVsdHMgPT09ICdhbGwnKSlcbiAgICAgICAgLy8gYS4gRm9yIGVhY2ggb2YgdGhlIHByb3BlcnR5IG5hbWVzIFwieWVhclwiLCBcIm1vbnRoXCIsIFwiZGF5XCI6XG4gICAgICAgIC8vIGkuIENhbGwgdGhlIFtbRGVmaW5lT3duUHJvcGVydHldXSBpbnRlcm5hbCBtZXRob2Qgb2Ygb3B0aW9ucyB3aXRoIHRoZVxuICAgICAgICAvLyAgICBwcm9wZXJ0eSBuYW1lLCBQcm9wZXJ0eSBEZXNjcmlwdG9yIHtbW1ZhbHVlXV06IFwibnVtZXJpY1wiLCBbW1dyaXRhYmxlXV06XG4gICAgICAgIC8vICAgIHRydWUsIFtbRW51bWVyYWJsZV1dOiB0cnVlLCBbW0NvbmZpZ3VyYWJsZV1dOiB0cnVlfSwgYW5kIGZhbHNlLlxuICAgICAgICBvcHRpb25zLnllYXIgPSBvcHRpb25zLm1vbnRoID0gb3B0aW9ucy5kYXkgPSAnbnVtZXJpYyc7XG5cbiAgICAvLyA4LiBJZiBuZWVkRGVmYXVsdHMgaXMgdHJ1ZSBhbmQgZGVmYXVsdHMgaXMgZWl0aGVyIFwidGltZVwiIG9yIFwiYWxsXCIsIHRoZW5cbiAgICBpZiAobmVlZERlZmF1bHRzICYmIChkZWZhdWx0cyA9PT0gJ3RpbWUnIHx8IGRlZmF1bHRzID09PSAnYWxsJykpXG4gICAgICAgIC8vIGEuIEZvciBlYWNoIG9mIHRoZSBwcm9wZXJ0eSBuYW1lcyBcImhvdXJcIiwgXCJtaW51dGVcIiwgXCJzZWNvbmRcIjpcbiAgICAgICAgLy8gaS4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBvcHRpb25zIHdpdGggdGhlXG4gICAgICAgIC8vICAgIHByb3BlcnR5IG5hbWUsIFByb3BlcnR5IERlc2NyaXB0b3Ige1tbVmFsdWVdXTogXCJudW1lcmljXCIsIFtbV3JpdGFibGVdXTpcbiAgICAgICAgLy8gICAgdHJ1ZSwgW1tFbnVtZXJhYmxlXV06IHRydWUsIFtbQ29uZmlndXJhYmxlXV06IHRydWV9LCBhbmQgZmFsc2UuXG4gICAgICAgIG9wdGlvbnMuaG91ciA9IG9wdGlvbnMubWludXRlID0gb3B0aW9ucy5zZWNvbmQgPSAnbnVtZXJpYyc7XG5cbiAgICAvLyA5LiBSZXR1cm4gb3B0aW9ucy5cbiAgICByZXR1cm4gb3B0aW9ucztcbn1cblxuLyoqXG4gKiBXaGVuIHRoZSBCYXNpY0Zvcm1hdE1hdGNoZXIgYWJzdHJhY3Qgb3BlcmF0aW9uIGlzIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHMgb3B0aW9ucyBhbmRcbiAqIGZvcm1hdHMsIHRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHRha2VuOlxuICovXG5mdW5jdGlvbiBCYXNpY0Zvcm1hdE1hdGNoZXIob3B0aW9ucywgZm9ybWF0cykge1xuICAgIC8vIDEuIExldCByZW1vdmFsUGVuYWx0eSBiZSAxMjAuXG4gICAgdmFyIHJlbW92YWxQZW5hbHR5ID0gMTIwO1xuXG4gICAgLy8gMi4gTGV0IGFkZGl0aW9uUGVuYWx0eSBiZSAyMC5cbiAgICB2YXIgYWRkaXRpb25QZW5hbHR5ID0gMjA7XG5cbiAgICAvLyAzLiBMZXQgbG9uZ0xlc3NQZW5hbHR5IGJlIDguXG4gICAgdmFyIGxvbmdMZXNzUGVuYWx0eSA9IDg7XG5cbiAgICAvLyA0LiBMZXQgbG9uZ01vcmVQZW5hbHR5IGJlIDYuXG4gICAgdmFyIGxvbmdNb3JlUGVuYWx0eSA9IDY7XG5cbiAgICAvLyA1LiBMZXQgc2hvcnRMZXNzUGVuYWx0eSBiZSA2LlxuICAgIHZhciBzaG9ydExlc3NQZW5hbHR5ID0gNjtcblxuICAgIC8vIDYuIExldCBzaG9ydE1vcmVQZW5hbHR5IGJlIDMuXG4gICAgdmFyIHNob3J0TW9yZVBlbmFsdHkgPSAzO1xuXG4gICAgLy8gNy4gTGV0IGJlc3RTY29yZSBiZSAtSW5maW5pdHkuXG4gICAgdmFyIGJlc3RTY29yZSA9IC1JbmZpbml0eTtcblxuICAgIC8vIDguIExldCBiZXN0Rm9ybWF0IGJlIHVuZGVmaW5lZC5cbiAgICB2YXIgYmVzdEZvcm1hdCA9IHZvaWQgMDtcblxuICAgIC8vIDkuIExldCBpIGJlIDAuXG4gICAgdmFyIGkgPSAwO1xuXG4gICAgLy8gMTAuIEFzc2VydDogZm9ybWF0cyBpcyBhbiBBcnJheSBvYmplY3QuXG5cbiAgICAvLyAxMS4gTGV0IGxlbiBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mIGZvcm1hdHMgd2l0aCBhcmd1bWVudCBcImxlbmd0aFwiLlxuICAgIHZhciBsZW4gPSBmb3JtYXRzLmxlbmd0aDtcblxuICAgIC8vIDEyLiBSZXBlYXQgd2hpbGUgaSA8IGxlbjpcbiAgICB3aGlsZSAoaSA8IGxlbikge1xuICAgICAgICAvLyBhLiBMZXQgZm9ybWF0IGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2YgZm9ybWF0cyB3aXRoIGFyZ3VtZW50IFRvU3RyaW5nKGkpLlxuICAgICAgICB2YXIgZm9ybWF0ID0gZm9ybWF0c1tpXTtcblxuICAgICAgICAvLyBiLiBMZXQgc2NvcmUgYmUgMC5cbiAgICAgICAgdmFyIHNjb3JlID0gMDtcblxuICAgICAgICAvLyBjLiBGb3IgZWFjaCBwcm9wZXJ0eSBzaG93biBpbiBUYWJsZSAzOlxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBkYXRlVGltZUNvbXBvbmVudHMpIHtcbiAgICAgICAgICAgIGlmICghaG9wLmNhbGwoZGF0ZVRpbWVDb21wb25lbnRzLCBwcm9wZXJ0eSkpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAvLyBpLiBMZXQgb3B0aW9uc1Byb3AgYmUgb3B0aW9ucy5bWzxwcm9wZXJ0eT5dXS5cbiAgICAgICAgICAgIHZhciBvcHRpb25zUHJvcCA9IG9wdGlvbnNbJ1tbJyArIHByb3BlcnR5ICsgJ11dJ107XG5cbiAgICAgICAgICAgIC8vIGlpLiBMZXQgZm9ybWF0UHJvcERlc2MgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldE93blByb3BlcnR5XV0gaW50ZXJuYWwgbWV0aG9kIG9mIGZvcm1hdFxuICAgICAgICAgICAgLy8gICAgIHdpdGggYXJndW1lbnQgcHJvcGVydHkuXG4gICAgICAgICAgICAvLyBpaWkuIElmIGZvcm1hdFByb3BEZXNjIGlzIG5vdCB1bmRlZmluZWQsIHRoZW5cbiAgICAgICAgICAgIC8vICAgICAxLiBMZXQgZm9ybWF0UHJvcCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mIGZvcm1hdCB3aXRoIGFyZ3VtZW50IHByb3BlcnR5LlxuICAgICAgICAgICAgdmFyIGZvcm1hdFByb3AgPSBob3AuY2FsbChmb3JtYXQsIHByb3BlcnR5KSA/IGZvcm1hdFtwcm9wZXJ0eV0gOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIC8vIGl2LiBJZiBvcHRpb25zUHJvcCBpcyB1bmRlZmluZWQgYW5kIGZvcm1hdFByb3AgaXMgbm90IHVuZGVmaW5lZCwgdGhlbiBkZWNyZWFzZSBzY29yZSBieVxuICAgICAgICAgICAgLy8gICAgIGFkZGl0aW9uUGVuYWx0eS5cbiAgICAgICAgICAgIGlmIChvcHRpb25zUHJvcCA9PT0gdW5kZWZpbmVkICYmIGZvcm1hdFByb3AgIT09IHVuZGVmaW5lZCkgc2NvcmUgLT0gYWRkaXRpb25QZW5hbHR5O1xuXG4gICAgICAgICAgICAvLyB2LiBFbHNlIGlmIG9wdGlvbnNQcm9wIGlzIG5vdCB1bmRlZmluZWQgYW5kIGZvcm1hdFByb3AgaXMgdW5kZWZpbmVkLCB0aGVuIGRlY3JlYXNlIHNjb3JlIGJ5XG4gICAgICAgICAgICAvLyAgICByZW1vdmFsUGVuYWx0eS5cbiAgICAgICAgICAgIGVsc2UgaWYgKG9wdGlvbnNQcm9wICE9PSB1bmRlZmluZWQgJiYgZm9ybWF0UHJvcCA9PT0gdW5kZWZpbmVkKSBzY29yZSAtPSByZW1vdmFsUGVuYWx0eTtcblxuICAgICAgICAgICAgICAgIC8vIHZpLiBFbHNlXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAxLiBMZXQgdmFsdWVzIGJlIHRoZSBhcnJheSBbXCIyLWRpZ2l0XCIsIFwibnVtZXJpY1wiLCBcIm5hcnJvd1wiLCBcInNob3J0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICBcImxvbmdcIl0uXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gWycyLWRpZ2l0JywgJ251bWVyaWMnLCAnbmFycm93JywgJ3Nob3J0JywgJ2xvbmcnXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMi4gTGV0IG9wdGlvbnNQcm9wSW5kZXggYmUgdGhlIGluZGV4IG9mIG9wdGlvbnNQcm9wIHdpdGhpbiB2YWx1ZXMuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9uc1Byb3BJbmRleCA9IGFyckluZGV4T2YuY2FsbCh2YWx1ZXMsIG9wdGlvbnNQcm9wKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMy4gTGV0IGZvcm1hdFByb3BJbmRleCBiZSB0aGUgaW5kZXggb2YgZm9ybWF0UHJvcCB3aXRoaW4gdmFsdWVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZvcm1hdFByb3BJbmRleCA9IGFyckluZGV4T2YuY2FsbCh2YWx1ZXMsIGZvcm1hdFByb3ApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyA0LiBMZXQgZGVsdGEgYmUgbWF4KG1pbihmb3JtYXRQcm9wSW5kZXggLSBvcHRpb25zUHJvcEluZGV4LCAyKSwgLTIpLlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlbHRhID0gTWF0aC5tYXgoTWF0aC5taW4oZm9ybWF0UHJvcEluZGV4IC0gb3B0aW9uc1Byb3BJbmRleCwgMiksIC0yKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gNS4gSWYgZGVsdGEgPSAyLCBkZWNyZWFzZSBzY29yZSBieSBsb25nTW9yZVBlbmFsdHkuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVsdGEgPT09IDIpIHNjb3JlIC09IGxvbmdNb3JlUGVuYWx0eTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gNi4gRWxzZSBpZiBkZWx0YSA9IDEsIGRlY3JlYXNlIHNjb3JlIGJ5IHNob3J0TW9yZVBlbmFsdHkuXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChkZWx0YSA9PT0gMSkgc2NvcmUgLT0gc2hvcnRNb3JlUGVuYWx0eTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDcuIEVsc2UgaWYgZGVsdGEgPSAtMSwgZGVjcmVhc2Ugc2NvcmUgYnkgc2hvcnRMZXNzUGVuYWx0eS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChkZWx0YSA9PT0gLTEpIHNjb3JlIC09IHNob3J0TGVzc1BlbmFsdHk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gOC4gRWxzZSBpZiBkZWx0YSA9IC0yLCBkZWNyZWFzZSBzY29yZSBieSBsb25nTGVzc1BlbmFsdHkuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRlbHRhID09PSAtMikgc2NvcmUgLT0gbG9uZ0xlc3NQZW5hbHR5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkLiBJZiBzY29yZSA+IGJlc3RTY29yZSwgdGhlblxuICAgICAgICBpZiAoc2NvcmUgPiBiZXN0U2NvcmUpIHtcbiAgICAgICAgICAgIC8vIGkuIExldCBiZXN0U2NvcmUgYmUgc2NvcmUuXG4gICAgICAgICAgICBiZXN0U2NvcmUgPSBzY29yZTtcblxuICAgICAgICAgICAgLy8gaWkuIExldCBiZXN0Rm9ybWF0IGJlIGZvcm1hdC5cbiAgICAgICAgICAgIGJlc3RGb3JtYXQgPSBmb3JtYXQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBlLiBJbmNyZWFzZSBpIGJ5IDEuXG4gICAgICAgIGkrKztcbiAgICB9XG5cbiAgICAvLyAxMy4gUmV0dXJuIGJlc3RGb3JtYXQuXG4gICAgcmV0dXJuIGJlc3RGb3JtYXQ7XG59XG5cbi8qKlxuICogV2hlbiB0aGUgQmVzdEZpdEZvcm1hdE1hdGNoZXIgYWJzdHJhY3Qgb3BlcmF0aW9uIGlzIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHMgb3B0aW9uc1xuICogYW5kIGZvcm1hdHMsIGl0IHBlcmZvcm1zIGltcGxlbWVudGF0aW9uIGRlcGVuZGVudCBzdGVwcywgd2hpY2ggc2hvdWxkIHJldHVybiBhIHNldCBvZlxuICogY29tcG9uZW50IHJlcHJlc2VudGF0aW9ucyB0aGF0IGEgdHlwaWNhbCB1c2VyIG9mIHRoZSBzZWxlY3RlZCBsb2NhbGUgd291bGQgcGVyY2VpdmUgYXNcbiAqIGF0IGxlYXN0IGFzIGdvb2QgYXMgdGhlIG9uZSByZXR1cm5lZCBieSBCYXNpY0Zvcm1hdE1hdGNoZXIuXG4gKlxuICogVGhpcyBwb2x5ZmlsbCBkZWZpbmVzIHRoZSBhbGdvcml0aG0gdG8gYmUgdGhlIHNhbWUgYXMgQmFzaWNGb3JtYXRNYXRjaGVyLFxuICogd2l0aCB0aGUgYWRkaXRpb24gb2YgYm9udXMgcG9pbnRzIGF3YXJkZWQgd2hlcmUgdGhlIHJlcXVlc3RlZCBmb3JtYXQgaXMgb2ZcbiAqIHRoZSBzYW1lIGRhdGEgdHlwZSBhcyB0aGUgcG90ZW50aWFsbHkgbWF0Y2hpbmcgZm9ybWF0LlxuICpcbiAqIFRoaXMgYWxnbyByZWxpZXMgb24gdGhlIGNvbmNlcHQgb2YgY2xvc2VzdCBkaXN0YW5jZSBtYXRjaGluZyBkZXNjcmliZWQgaGVyZTpcbiAqIGh0dHA6Ly91bmljb2RlLm9yZy9yZXBvcnRzL3RyMzUvdHIzNS1kYXRlcy5odG1sI01hdGNoaW5nX1NrZWxldG9uc1xuICogVHlwaWNhbGx5IGEg4oCcYmVzdCBtYXRjaOKAnSBpcyBmb3VuZCB1c2luZyBhIGNsb3Nlc3QgZGlzdGFuY2UgbWF0Y2gsIHN1Y2ggYXM6XG4gKlxuICogU3ltYm9scyByZXF1ZXN0aW5nIGEgYmVzdCBjaG9pY2UgZm9yIHRoZSBsb2NhbGUgYXJlIHJlcGxhY2VkLlxuICogICAgICBqIOKGkiBvbmUgb2Yge0gsIGssIGgsIEt9OyBDIOKGkiBvbmUgb2Yge2EsIGIsIEJ9XG4gKiAtPiBDb3ZlcmVkIGJ5IGNsZHIuanMgbWF0Y2hpbmcgcHJvY2Vzc1xuICpcbiAqIEZvciBmaWVsZHMgd2l0aCBzeW1ib2xzIHJlcHJlc2VudGluZyB0aGUgc2FtZSB0eXBlICh5ZWFyLCBtb250aCwgZGF5LCBldGMpOlxuICogICAgIE1vc3Qgc3ltYm9scyBoYXZlIGEgc21hbGwgZGlzdGFuY2UgZnJvbSBlYWNoIG90aGVyLlxuICogICAgICAgICBNIOKJhSBMOyBFIOKJhSBjOyBhIOKJhSBiIOKJhSBCOyBIIOKJhSBrIOKJhSBoIOKJhSBLOyAuLi5cbiAqICAgICAtPiBDb3ZlcmVkIGJ5IGNsZHIuanMgbWF0Y2hpbmcgcHJvY2Vzc1xuICpcbiAqICAgICBXaWR0aCBkaWZmZXJlbmNlcyBhbW9uZyBmaWVsZHMsIG90aGVyIHRoYW4gdGhvc2UgbWFya2luZyB0ZXh0IHZzIG51bWVyaWMsIGFyZSBnaXZlbiBzbWFsbCBkaXN0YW5jZSBmcm9tIGVhY2ggb3RoZXIuXG4gKiAgICAgICAgIE1NTSDiiYUgTU1NTVxuICogICAgICAgICBNTSDiiYUgTVxuICogICAgIE51bWVyaWMgYW5kIHRleHQgZmllbGRzIGFyZSBnaXZlbiBhIGxhcmdlciBkaXN0YW5jZSBmcm9tIGVhY2ggb3RoZXIuXG4gKiAgICAgICAgIE1NTSDiiYggTU1cbiAqICAgICBTeW1ib2xzIHJlcHJlc2VudGluZyBzdWJzdGFudGlhbCBkaWZmZXJlbmNlcyAod2VlayBvZiB5ZWFyIHZzIHdlZWsgb2YgbW9udGgpIGFyZSBnaXZlbiBtdWNoIGxhcmdlciBhIGRpc3RhbmNlcyBmcm9tIGVhY2ggb3RoZXIuXG4gKiAgICAgICAgIGQg4omLIEQ7IC4uLlxuICogICAgIE1pc3Npbmcgb3IgZXh0cmEgZmllbGRzIGNhdXNlIGEgbWF0Y2ggdG8gZmFpbC4gKEJ1dCBzZWUgTWlzc2luZyBTa2VsZXRvbiBGaWVsZHMpLlxuICpcbiAqXG4gKiBGb3IgZXhhbXBsZSxcbiAqXG4gKiAgICAgeyBtb250aDogJ251bWVyaWMnLCBkYXk6ICdudW1lcmljJyB9XG4gKlxuICogc2hvdWxkIG1hdGNoXG4gKlxuICogICAgIHsgbW9udGg6ICcyLWRpZ2l0JywgZGF5OiAnMi1kaWdpdCcgfVxuICpcbiAqIHJhdGhlciB0aGFuXG4gKlxuICogICAgIHsgbW9udGg6ICdzaG9ydCcsIGRheTogJ251bWVyaWMnIH1cbiAqXG4gKiBUaGlzIG1ha2VzIHNlbnNlIGJlY2F1c2UgYSB1c2VyIHJlcXVlc3RpbmcgYSBmb3JtYXR0ZWQgZGF0ZSB3aXRoIG51bWVyaWMgcGFydHMgd291bGRcbiAqIG5vdCBleHBlY3QgdG8gc2VlIHRoZSByZXR1cm5lZCBmb3JtYXQgY29udGFpbmluZyBuYXJyb3csIHNob3J0IG9yIGxvbmcgcGFydCBuYW1lc1xuICovXG5mdW5jdGlvbiBCZXN0Rml0Rm9ybWF0TWF0Y2hlcihvcHRpb25zLCBmb3JtYXRzKSB7XG5cbiAgICAvLyAxLiBMZXQgcmVtb3ZhbFBlbmFsdHkgYmUgMTIwLlxuICAgIHZhciByZW1vdmFsUGVuYWx0eSA9IDEyMDtcblxuICAgIC8vIDIuIExldCBhZGRpdGlvblBlbmFsdHkgYmUgMjAuXG4gICAgdmFyIGFkZGl0aW9uUGVuYWx0eSA9IDIwO1xuXG4gICAgLy8gMy4gTGV0IGxvbmdMZXNzUGVuYWx0eSBiZSA4LlxuICAgIHZhciBsb25nTGVzc1BlbmFsdHkgPSA4O1xuXG4gICAgLy8gNC4gTGV0IGxvbmdNb3JlUGVuYWx0eSBiZSA2LlxuICAgIHZhciBsb25nTW9yZVBlbmFsdHkgPSA2O1xuXG4gICAgLy8gNS4gTGV0IHNob3J0TGVzc1BlbmFsdHkgYmUgNi5cbiAgICB2YXIgc2hvcnRMZXNzUGVuYWx0eSA9IDY7XG5cbiAgICAvLyA2LiBMZXQgc2hvcnRNb3JlUGVuYWx0eSBiZSAzLlxuICAgIHZhciBzaG9ydE1vcmVQZW5hbHR5ID0gMztcblxuICAgIHZhciBob3VyMTJQZW5hbHR5ID0gMTtcblxuICAgIC8vIDcuIExldCBiZXN0U2NvcmUgYmUgLUluZmluaXR5LlxuICAgIHZhciBiZXN0U2NvcmUgPSAtSW5maW5pdHk7XG5cbiAgICAvLyA4LiBMZXQgYmVzdEZvcm1hdCBiZSB1bmRlZmluZWQuXG4gICAgdmFyIGJlc3RGb3JtYXQgPSB2b2lkIDA7XG5cbiAgICAvLyA5LiBMZXQgaSBiZSAwLlxuICAgIHZhciBpID0gMDtcblxuICAgIC8vIDEwLiBBc3NlcnQ6IGZvcm1hdHMgaXMgYW4gQXJyYXkgb2JqZWN0LlxuXG4gICAgLy8gMTEuIExldCBsZW4gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZiBmb3JtYXRzIHdpdGggYXJndW1lbnQgXCJsZW5ndGhcIi5cbiAgICB2YXIgbGVuID0gZm9ybWF0cy5sZW5ndGg7XG5cbiAgICAvLyAxMi4gUmVwZWF0IHdoaWxlIGkgPCBsZW46XG4gICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgICAgLy8gYS4gTGV0IGZvcm1hdCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mIGZvcm1hdHMgd2l0aCBhcmd1bWVudCBUb1N0cmluZyhpKS5cbiAgICAgICAgdmFyIGZvcm1hdCA9IGZvcm1hdHNbaV07XG5cbiAgICAgICAgLy8gYi4gTGV0IHNjb3JlIGJlIDAuXG4gICAgICAgIHZhciBzY29yZSA9IDA7XG5cbiAgICAgICAgLy8gYy4gRm9yIGVhY2ggcHJvcGVydHkgc2hvd24gaW4gVGFibGUgMzpcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0ZVRpbWVDb21wb25lbnRzKSB7XG4gICAgICAgICAgICBpZiAoIWhvcC5jYWxsKGRhdGVUaW1lQ29tcG9uZW50cywgcHJvcGVydHkpKSBjb250aW51ZTtcblxuICAgICAgICAgICAgLy8gaS4gTGV0IG9wdGlvbnNQcm9wIGJlIG9wdGlvbnMuW1s8cHJvcGVydHk+XV0uXG4gICAgICAgICAgICB2YXIgb3B0aW9uc1Byb3AgPSBvcHRpb25zWydbWycgKyBwcm9wZXJ0eSArICddXSddO1xuXG4gICAgICAgICAgICAvLyBpaS4gTGV0IGZvcm1hdFByb3BEZXNjIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBmb3JtYXRcbiAgICAgICAgICAgIC8vICAgICB3aXRoIGFyZ3VtZW50IHByb3BlcnR5LlxuICAgICAgICAgICAgLy8gaWlpLiBJZiBmb3JtYXRQcm9wRGVzYyBpcyBub3QgdW5kZWZpbmVkLCB0aGVuXG4gICAgICAgICAgICAvLyAgICAgMS4gTGV0IGZvcm1hdFByb3AgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZiBmb3JtYXQgd2l0aCBhcmd1bWVudCBwcm9wZXJ0eS5cbiAgICAgICAgICAgIHZhciBmb3JtYXRQcm9wID0gaG9wLmNhbGwoZm9ybWF0LCBwcm9wZXJ0eSkgPyBmb3JtYXRbcHJvcGVydHldIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAvLyBpdi4gSWYgb3B0aW9uc1Byb3AgaXMgdW5kZWZpbmVkIGFuZCBmb3JtYXRQcm9wIGlzIG5vdCB1bmRlZmluZWQsIHRoZW4gZGVjcmVhc2Ugc2NvcmUgYnlcbiAgICAgICAgICAgIC8vICAgICBhZGRpdGlvblBlbmFsdHkuXG4gICAgICAgICAgICBpZiAob3B0aW9uc1Byb3AgPT09IHVuZGVmaW5lZCAmJiBmb3JtYXRQcm9wICE9PSB1bmRlZmluZWQpIHNjb3JlIC09IGFkZGl0aW9uUGVuYWx0eTtcblxuICAgICAgICAgICAgLy8gdi4gRWxzZSBpZiBvcHRpb25zUHJvcCBpcyBub3QgdW5kZWZpbmVkIGFuZCBmb3JtYXRQcm9wIGlzIHVuZGVmaW5lZCwgdGhlbiBkZWNyZWFzZSBzY29yZSBieVxuICAgICAgICAgICAgLy8gICAgcmVtb3ZhbFBlbmFsdHkuXG4gICAgICAgICAgICBlbHNlIGlmIChvcHRpb25zUHJvcCAhPT0gdW5kZWZpbmVkICYmIGZvcm1hdFByb3AgPT09IHVuZGVmaW5lZCkgc2NvcmUgLT0gcmVtb3ZhbFBlbmFsdHk7XG5cbiAgICAgICAgICAgICAgICAvLyB2aS4gRWxzZVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMS4gTGV0IHZhbHVlcyBiZSB0aGUgYXJyYXkgW1wiMi1kaWdpdFwiLCBcIm51bWVyaWNcIiwgXCJuYXJyb3dcIiwgXCJzaG9ydFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgXCJsb25nXCJdLlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9IFsnMi1kaWdpdCcsICdudW1lcmljJywgJ25hcnJvdycsICdzaG9ydCcsICdsb25nJ107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDIuIExldCBvcHRpb25zUHJvcEluZGV4IGJlIHRoZSBpbmRleCBvZiBvcHRpb25zUHJvcCB3aXRoaW4gdmFsdWVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9wdGlvbnNQcm9wSW5kZXggPSBhcnJJbmRleE9mLmNhbGwodmFsdWVzLCBvcHRpb25zUHJvcCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDMuIExldCBmb3JtYXRQcm9wSW5kZXggYmUgdGhlIGluZGV4IG9mIGZvcm1hdFByb3Agd2l0aGluIHZhbHVlcy5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb3JtYXRQcm9wSW5kZXggPSBhcnJJbmRleE9mLmNhbGwodmFsdWVzLCBmb3JtYXRQcm9wKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gNC4gTGV0IGRlbHRhIGJlIG1heChtaW4oZm9ybWF0UHJvcEluZGV4IC0gb3B0aW9uc1Byb3BJbmRleCwgMiksIC0yKS5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWx0YSA9IE1hdGgubWF4KE1hdGgubWluKGZvcm1hdFByb3BJbmRleCAtIG9wdGlvbnNQcm9wSW5kZXgsIDIpLCAtMik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkaXZlcmdpbmcgZnJvbSBzcGVjXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgYmVzdEZpdCBhcmd1bWVudCBpcyB0cnVlLCBzdWJ0cmFjdCBhZGRpdGlvbmFsIHBlbmFsdHkgd2hlcmUgZGF0YSB0eXBlcyBhcmUgbm90IHRoZSBzYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvcm1hdFByb3BJbmRleCA8PSAxICYmIG9wdGlvbnNQcm9wSW5kZXggPj0gMiB8fCBmb3JtYXRQcm9wSW5kZXggPj0gMiAmJiBvcHRpb25zUHJvcEluZGV4IDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gNS4gSWYgZGVsdGEgPSAyLCBkZWNyZWFzZSBzY29yZSBieSBsb25nTW9yZVBlbmFsdHkuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZWx0YSA+IDApIHNjb3JlIC09IGxvbmdNb3JlUGVuYWx0eTtlbHNlIGlmIChkZWx0YSA8IDApIHNjb3JlIC09IGxvbmdMZXNzUGVuYWx0eTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA1LiBJZiBkZWx0YSA9IDIsIGRlY3JlYXNlIHNjb3JlIGJ5IGxvbmdNb3JlUGVuYWx0eS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlbHRhID4gMSkgc2NvcmUgLT0gc2hvcnRNb3JlUGVuYWx0eTtlbHNlIGlmIChkZWx0YSA8IC0xKSBzY29yZSAtPSBzaG9ydExlc3NQZW5hbHR5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAge1xuICAgICAgICAgICAgLy8gZGl2ZXJnaW5nIHRvIGFsc28gdGFrZSBpbnRvIGNvbnNpZGVyYXRpb24gZGlmZmVyZW5jZXMgYmV0d2VlbiAxMiBvciAyNCBob3Vyc1xuICAgICAgICAgICAgLy8gd2hpY2ggaXMgc3BlY2lhbCBmb3IgdGhlIGJlc3QgZml0IG9ubHkuXG4gICAgICAgICAgICBpZiAoZm9ybWF0Ll8uaG91cjEyICE9PSBvcHRpb25zLmhvdXIxMikge1xuICAgICAgICAgICAgICAgIHNjb3JlIC09IGhvdXIxMlBlbmFsdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkLiBJZiBzY29yZSA+IGJlc3RTY29yZSwgdGhlblxuICAgICAgICBpZiAoc2NvcmUgPiBiZXN0U2NvcmUpIHtcbiAgICAgICAgICAgIC8vIGkuIExldCBiZXN0U2NvcmUgYmUgc2NvcmUuXG4gICAgICAgICAgICBiZXN0U2NvcmUgPSBzY29yZTtcbiAgICAgICAgICAgIC8vIGlpLiBMZXQgYmVzdEZvcm1hdCBiZSBmb3JtYXQuXG4gICAgICAgICAgICBiZXN0Rm9ybWF0ID0gZm9ybWF0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZS4gSW5jcmVhc2UgaSBieSAxLlxuICAgICAgICBpKys7XG4gICAgfVxuXG4gICAgLy8gMTMuIFJldHVybiBiZXN0Rm9ybWF0LlxuICAgIHJldHVybiBiZXN0Rm9ybWF0O1xufVxuXG4vKiAxMi4yLjMgKi9pbnRlcm5hbHMuRGF0ZVRpbWVGb3JtYXQgPSB7XG4gICAgJ1tbYXZhaWxhYmxlTG9jYWxlc11dJzogW10sXG4gICAgJ1tbcmVsZXZhbnRFeHRlbnNpb25LZXlzXV0nOiBbJ2NhJywgJ251J10sXG4gICAgJ1tbbG9jYWxlRGF0YV1dJzoge31cbn07XG5cbi8qKlxuICogV2hlbiB0aGUgc3VwcG9ydGVkTG9jYWxlc09mIG1ldGhvZCBvZiBJbnRsLkRhdGVUaW1lRm9ybWF0IGlzIGNhbGxlZCwgdGhlXG4gKiBmb2xsb3dpbmcgc3RlcHMgYXJlIHRha2VuOlxuICovXG4vKiAxMi4yLjIgKi9cbmRlZmluZVByb3BlcnR5KEludGwuRGF0ZVRpbWVGb3JtYXQsICdzdXBwb3J0ZWRMb2NhbGVzT2YnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiBmbkJpbmQuY2FsbChmdW5jdGlvbiAobG9jYWxlcykge1xuICAgICAgICAvLyBCb3VuZCBmdW5jdGlvbnMgb25seSBoYXZlIHRoZSBgdGhpc2AgdmFsdWUgYWx0ZXJlZCBpZiBiZWluZyB1c2VkIGFzIGEgY29uc3RydWN0b3IsXG4gICAgICAgIC8vIHRoaXMgbGV0cyB1cyBpbWl0YXRlIGEgbmF0aXZlIGZ1bmN0aW9uIHRoYXQgaGFzIG5vIGNvbnN0cnVjdG9yXG4gICAgICAgIGlmICghaG9wLmNhbGwodGhpcywgJ1tbYXZhaWxhYmxlTG9jYWxlc11dJykpIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N1cHBvcnRlZExvY2FsZXNPZigpIGlzIG5vdCBhIGNvbnN0cnVjdG9yJyk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGFuIG9iamVjdCB3aG9zZSBwcm9wcyBjYW4gYmUgdXNlZCB0byByZXN0b3JlIHRoZSB2YWx1ZXMgb2YgUmVnRXhwIHByb3BzXG4gICAgICAgIHZhciByZWdleHBTdGF0ZSA9IGNyZWF0ZVJlZ0V4cFJlc3RvcmUoKSxcblxuXG4gICAgICAgIC8vIDEuIElmIG9wdGlvbnMgaXMgbm90IHByb3ZpZGVkLCB0aGVuIGxldCBvcHRpb25zIGJlIHVuZGVmaW5lZC5cbiAgICAgICAgb3B0aW9ucyA9IGFyZ3VtZW50c1sxXSxcblxuXG4gICAgICAgIC8vIDIuIExldCBhdmFpbGFibGVMb2NhbGVzIGJlIHRoZSB2YWx1ZSBvZiB0aGUgW1thdmFpbGFibGVMb2NhbGVzXV0gaW50ZXJuYWxcbiAgICAgICAgLy8gICAgcHJvcGVydHkgb2YgdGhlIHN0YW5kYXJkIGJ1aWx0LWluIG9iamVjdCB0aGF0IGlzIHRoZSBpbml0aWFsIHZhbHVlIG9mXG4gICAgICAgIC8vICAgIEludGwuTnVtYmVyRm9ybWF0LlxuXG4gICAgICAgIGF2YWlsYWJsZUxvY2FsZXMgPSB0aGlzWydbW2F2YWlsYWJsZUxvY2FsZXNdXSddLFxuXG5cbiAgICAgICAgLy8gMy4gTGV0IHJlcXVlc3RlZExvY2FsZXMgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBDYW5vbmljYWxpemVMb2NhbGVMaXN0XG4gICAgICAgIC8vICAgIGFic3RyYWN0IG9wZXJhdGlvbiAoZGVmaW5lZCBpbiA5LjIuMSkgd2l0aCBhcmd1bWVudCBsb2NhbGVzLlxuICAgICAgICByZXF1ZXN0ZWRMb2NhbGVzID0gQ2Fub25pY2FsaXplTG9jYWxlTGlzdChsb2NhbGVzKTtcblxuICAgICAgICAvLyBSZXN0b3JlIHRoZSBSZWdFeHAgcHJvcGVydGllc1xuICAgICAgICByZWdleHBTdGF0ZS5leHAudGVzdChyZWdleHBTdGF0ZS5pbnB1dCk7XG5cbiAgICAgICAgLy8gNC4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgU3VwcG9ydGVkTG9jYWxlcyBhYnN0cmFjdCBvcGVyYXRpb25cbiAgICAgICAgLy8gICAgKGRlZmluZWQgaW4gOS4yLjgpIHdpdGggYXJndW1lbnRzIGF2YWlsYWJsZUxvY2FsZXMsIHJlcXVlc3RlZExvY2FsZXMsXG4gICAgICAgIC8vICAgIGFuZCBvcHRpb25zLlxuICAgICAgICByZXR1cm4gU3VwcG9ydGVkTG9jYWxlcyhhdmFpbGFibGVMb2NhbGVzLCByZXF1ZXN0ZWRMb2NhbGVzLCBvcHRpb25zKTtcbiAgICB9LCBpbnRlcm5hbHMuTnVtYmVyRm9ybWF0KVxufSk7XG5cbi8qKlxuICogVGhpcyBuYW1lZCBhY2Nlc3NvciBwcm9wZXJ0eSByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBmb3JtYXRzIGEgbnVtYmVyXG4gKiBhY2NvcmRpbmcgdG8gdGhlIGVmZmVjdGl2ZSBsb2NhbGUgYW5kIHRoZSBmb3JtYXR0aW5nIG9wdGlvbnMgb2YgdGhpc1xuICogRGF0ZVRpbWVGb3JtYXQgb2JqZWN0LlxuICovXG4vKiAxMi4zLjIgKi9kZWZpbmVQcm9wZXJ0eShJbnRsLkRhdGVUaW1lRm9ybWF0LnByb3RvdHlwZSwgJ2Zvcm1hdCcsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBHZXRGb3JtYXREYXRlVGltZVxufSk7XG5cbmRlZmluZVByb3BlcnR5KEludGwuRGF0ZVRpbWVGb3JtYXQucHJvdG90eXBlLCAnZm9ybWF0VG9QYXJ0cycsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBHZXRGb3JtYXRUb1BhcnRzRGF0ZVRpbWVcbn0pO1xuXG5mdW5jdGlvbiBHZXRGb3JtYXREYXRlVGltZSgpIHtcbiAgICB2YXIgaW50ZXJuYWwgPSB0aGlzICE9PSBudWxsICYmIGJhYmVsSGVscGVyc1tcInR5cGVvZlwiXSh0aGlzKSA9PT0gJ29iamVjdCcgJiYgZ2V0SW50ZXJuYWxQcm9wZXJ0aWVzKHRoaXMpO1xuXG4gICAgLy8gU2F0aXNmeSB0ZXN0IDEyLjNfYlxuICAgIGlmICghaW50ZXJuYWwgfHwgIWludGVybmFsWydbW2luaXRpYWxpemVkRGF0ZVRpbWVGb3JtYXRdXSddKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdgdGhpc2AgdmFsdWUgZm9yIGZvcm1hdCgpIGlzIG5vdCBhbiBpbml0aWFsaXplZCBJbnRsLkRhdGVUaW1lRm9ybWF0IG9iamVjdC4nKTtcblxuICAgIC8vIFRoZSB2YWx1ZSBvZiB0aGUgW1tHZXRdXSBhdHRyaWJ1dGUgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIHRoZSBmb2xsb3dpbmdcbiAgICAvLyBzdGVwczpcblxuICAgIC8vIDEuIElmIHRoZSBbW2JvdW5kRm9ybWF0XV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgdGhpcyBEYXRlVGltZUZvcm1hdCBvYmplY3RcbiAgICAvLyAgICBpcyB1bmRlZmluZWQsIHRoZW46XG4gICAgaWYgKGludGVybmFsWydbW2JvdW5kRm9ybWF0XV0nXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIGEuIExldCBGIGJlIGEgRnVuY3Rpb24gb2JqZWN0LCB3aXRoIGludGVybmFsIHByb3BlcnRpZXMgc2V0IGFzXG4gICAgICAgIC8vICAgIHNwZWNpZmllZCBmb3IgYnVpbHQtaW4gZnVuY3Rpb25zIGluIEVTNSwgMTUsIG9yIHN1Y2Nlc3NvciwgYW5kIHRoZVxuICAgICAgICAvLyAgICBsZW5ndGggcHJvcGVydHkgc2V0IHRvIDAsIHRoYXQgdGFrZXMgdGhlIGFyZ3VtZW50IGRhdGUgYW5kXG4gICAgICAgIC8vICAgIHBlcmZvcm1zIHRoZSBmb2xsb3dpbmcgc3RlcHM6XG4gICAgICAgIHZhciBGID0gZnVuY3Rpb24gRigpIHtcbiAgICAgICAgICAgIC8vICAgaS4gSWYgZGF0ZSBpcyBub3QgcHJvdmlkZWQgb3IgaXMgdW5kZWZpbmVkLCB0aGVuIGxldCB4IGJlIHRoZVxuICAgICAgICAgICAgLy8gICAgICByZXN1bHQgYXMgaWYgYnkgdGhlIGV4cHJlc3Npb24gRGF0ZS5ub3coKSB3aGVyZSBEYXRlLm5vdyBpc1xuICAgICAgICAgICAgLy8gICAgICB0aGUgc3RhbmRhcmQgYnVpbHQtaW4gZnVuY3Rpb24gZGVmaW5lZCBpbiBFUzUsIDE1LjkuNC40LlxuICAgICAgICAgICAgLy8gIGlpLiBFbHNlIGxldCB4IGJlIFRvTnVtYmVyKGRhdGUpLlxuICAgICAgICAgICAgLy8gaWlpLiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBGb3JtYXREYXRlVGltZSBhYnN0cmFjdFxuICAgICAgICAgICAgLy8gICAgICBvcGVyYXRpb24gKGRlZmluZWQgYmVsb3cpIHdpdGggYXJndW1lbnRzIHRoaXMgYW5kIHguXG4gICAgICAgICAgICB2YXIgeCA9IE51bWJlcihhcmd1bWVudHMubGVuZ3RoID09PSAwID8gRGF0ZS5ub3coKSA6IGFyZ3VtZW50c1swXSk7XG4gICAgICAgICAgICByZXR1cm4gRm9ybWF0RGF0ZVRpbWUodGhpcywgeCk7XG4gICAgICAgIH07XG4gICAgICAgIC8vIGIuIExldCBiaW5kIGJlIHRoZSBzdGFuZGFyZCBidWlsdC1pbiBmdW5jdGlvbiBvYmplY3QgZGVmaW5lZCBpbiBFUzUsXG4gICAgICAgIC8vICAgIDE1LjMuNC41LlxuICAgICAgICAvLyBjLiBMZXQgYmYgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAgICAgLy8gICAgYmluZCB3aXRoIEYgYXMgdGhlIHRoaXMgdmFsdWUgYW5kIGFuIGFyZ3VtZW50IGxpc3QgY29udGFpbmluZ1xuICAgICAgICAvLyAgICB0aGUgc2luZ2xlIGl0ZW0gdGhpcy5cbiAgICAgICAgdmFyIGJmID0gZm5CaW5kLmNhbGwoRiwgdGhpcyk7XG4gICAgICAgIC8vIGQuIFNldCB0aGUgW1tib3VuZEZvcm1hdF1dIGludGVybmFsIHByb3BlcnR5IG9mIHRoaXMgTnVtYmVyRm9ybWF0XG4gICAgICAgIC8vICAgIG9iamVjdCB0byBiZi5cbiAgICAgICAgaW50ZXJuYWxbJ1tbYm91bmRGb3JtYXRdXSddID0gYmY7XG4gICAgfVxuICAgIC8vIFJldHVybiB0aGUgdmFsdWUgb2YgdGhlIFtbYm91bmRGb3JtYXRdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiB0aGlzXG4gICAgLy8gTnVtYmVyRm9ybWF0IG9iamVjdC5cbiAgICByZXR1cm4gaW50ZXJuYWxbJ1tbYm91bmRGb3JtYXRdXSddO1xufVxuXG5mdW5jdGlvbiBHZXRGb3JtYXRUb1BhcnRzRGF0ZVRpbWUoKSB7XG4gICAgdmFyIGludGVybmFsID0gdGhpcyAhPT0gbnVsbCAmJiBiYWJlbEhlbHBlcnNbXCJ0eXBlb2ZcIl0odGhpcykgPT09ICdvYmplY3QnICYmIGdldEludGVybmFsUHJvcGVydGllcyh0aGlzKTtcblxuICAgIGlmICghaW50ZXJuYWwgfHwgIWludGVybmFsWydbW2luaXRpYWxpemVkRGF0ZVRpbWVGb3JtYXRdXSddKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdgdGhpc2AgdmFsdWUgZm9yIGZvcm1hdFRvUGFydHMoKSBpcyBub3QgYW4gaW5pdGlhbGl6ZWQgSW50bC5EYXRlVGltZUZvcm1hdCBvYmplY3QuJyk7XG5cbiAgICBpZiAoaW50ZXJuYWxbJ1tbYm91bmRGb3JtYXRUb1BhcnRzXV0nXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciBGID0gZnVuY3Rpb24gRigpIHtcbiAgICAgICAgICAgIHZhciB4ID0gTnVtYmVyKGFyZ3VtZW50cy5sZW5ndGggPT09IDAgPyBEYXRlLm5vdygpIDogYXJndW1lbnRzWzBdKTtcbiAgICAgICAgICAgIHJldHVybiBGb3JtYXRUb1BhcnRzRGF0ZVRpbWUodGhpcywgeCk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBiZiA9IGZuQmluZC5jYWxsKEYsIHRoaXMpO1xuICAgICAgICBpbnRlcm5hbFsnW1tib3VuZEZvcm1hdFRvUGFydHNdXSddID0gYmY7XG4gICAgfVxuICAgIHJldHVybiBpbnRlcm5hbFsnW1tib3VuZEZvcm1hdFRvUGFydHNdXSddO1xufVxuXG5mdW5jdGlvbiBDcmVhdGVEYXRlVGltZVBhcnRzKGRhdGVUaW1lRm9ybWF0LCB4KSB7XG4gICAgLy8gMS4gSWYgeCBpcyBub3QgYSBmaW5pdGUgTnVtYmVyLCB0aGVuIHRocm93IGEgUmFuZ2VFcnJvciBleGNlcHRpb24uXG4gICAgaWYgKCFpc0Zpbml0ZSh4KSkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgdmFsaWQgZGF0ZSBwYXNzZWQgdG8gZm9ybWF0Jyk7XG5cbiAgICB2YXIgaW50ZXJuYWwgPSBkYXRlVGltZUZvcm1hdC5fX2dldEludGVybmFsUHJvcGVydGllcyhzZWNyZXQpO1xuXG4gICAgLy8gQ3JlYXRpbmcgcmVzdG9yZSBwb2ludCBmb3IgcHJvcGVydGllcyBvbiB0aGUgUmVnRXhwIG9iamVjdC4uLiBwbGVhc2Ugd2FpdFxuICAgIC8qIGxldCByZWdleHBTdGF0ZSA9ICovY3JlYXRlUmVnRXhwUmVzdG9yZSgpOyAvLyAjIyNUT0RPOiByZXZpZXcgdGhpc1xuXG4gICAgLy8gMi4gTGV0IGxvY2FsZSBiZSB0aGUgdmFsdWUgb2YgdGhlIFtbbG9jYWxlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgZGF0ZVRpbWVGb3JtYXQuXG4gICAgdmFyIGxvY2FsZSA9IGludGVybmFsWydbW2xvY2FsZV1dJ107XG5cbiAgICAvLyAzLiBMZXQgbmYgYmUgdGhlIHJlc3VsdCBvZiBjcmVhdGluZyBhIG5ldyBOdW1iZXJGb3JtYXQgb2JqZWN0IGFzIGlmIGJ5IHRoZVxuICAgIC8vIGV4cHJlc3Npb24gbmV3IEludGwuTnVtYmVyRm9ybWF0KFtsb2NhbGVdLCB7dXNlR3JvdXBpbmc6IGZhbHNlfSkgd2hlcmVcbiAgICAvLyBJbnRsLk51bWJlckZvcm1hdCBpcyB0aGUgc3RhbmRhcmQgYnVpbHQtaW4gY29uc3RydWN0b3IgZGVmaW5lZCBpbiAxMS4xLjMuXG4gICAgdmFyIG5mID0gbmV3IEludGwuTnVtYmVyRm9ybWF0KFtsb2NhbGVdLCB7IHVzZUdyb3VwaW5nOiBmYWxzZSB9KTtcblxuICAgIC8vIDQuIExldCBuZjIgYmUgdGhlIHJlc3VsdCBvZiBjcmVhdGluZyBhIG5ldyBOdW1iZXJGb3JtYXQgb2JqZWN0IGFzIGlmIGJ5IHRoZVxuICAgIC8vIGV4cHJlc3Npb24gbmV3IEludGwuTnVtYmVyRm9ybWF0KFtsb2NhbGVdLCB7bWluaW11bUludGVnZXJEaWdpdHM6IDIsIHVzZUdyb3VwaW5nOlxuICAgIC8vIGZhbHNlfSkgd2hlcmUgSW50bC5OdW1iZXJGb3JtYXQgaXMgdGhlIHN0YW5kYXJkIGJ1aWx0LWluIGNvbnN0cnVjdG9yIGRlZmluZWQgaW5cbiAgICAvLyAxMS4xLjMuXG4gICAgdmFyIG5mMiA9IG5ldyBJbnRsLk51bWJlckZvcm1hdChbbG9jYWxlXSwgeyBtaW5pbXVtSW50ZWdlckRpZ2l0czogMiwgdXNlR3JvdXBpbmc6IGZhbHNlIH0pO1xuXG4gICAgLy8gNS4gTGV0IHRtIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgVG9Mb2NhbFRpbWUgYWJzdHJhY3Qgb3BlcmF0aW9uIChkZWZpbmVkXG4gICAgLy8gYmVsb3cpIHdpdGggeCwgdGhlIHZhbHVlIG9mIHRoZSBbW2NhbGVuZGFyXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgZGF0ZVRpbWVGb3JtYXQsXG4gICAgLy8gYW5kIHRoZSB2YWx1ZSBvZiB0aGUgW1t0aW1lWm9uZV1dIGludGVybmFsIHByb3BlcnR5IG9mIGRhdGVUaW1lRm9ybWF0LlxuICAgIHZhciB0bSA9IFRvTG9jYWxUaW1lKHgsIGludGVybmFsWydbW2NhbGVuZGFyXV0nXSwgaW50ZXJuYWxbJ1tbdGltZVpvbmVdXSddKTtcblxuICAgIC8vIDYuIExldCByZXN1bHQgYmUgdGhlIHZhbHVlIG9mIHRoZSBbW3BhdHRlcm5dXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBkYXRlVGltZUZvcm1hdC5cbiAgICB2YXIgcGF0dGVybiA9IGludGVybmFsWydbW3BhdHRlcm5dXSddO1xuXG4gICAgLy8gNy5cbiAgICB2YXIgcmVzdWx0ID0gbmV3IExpc3QoKTtcblxuICAgIC8vIDguXG4gICAgdmFyIGluZGV4ID0gMDtcblxuICAgIC8vIDkuXG4gICAgdmFyIGJlZ2luSW5kZXggPSBwYXR0ZXJuLmluZGV4T2YoJ3snKTtcblxuICAgIC8vIDEwLlxuICAgIHZhciBlbmRJbmRleCA9IDA7XG5cbiAgICAvLyBOZWVkIHRoZSBsb2NhbGUgbWludXMgYW55IGV4dGVuc2lvbnNcbiAgICB2YXIgZGF0YUxvY2FsZSA9IGludGVybmFsWydbW2RhdGFMb2NhbGVdXSddO1xuXG4gICAgLy8gTmVlZCB0aGUgY2FsZW5kYXIgZGF0YSBmcm9tIENMRFJcbiAgICB2YXIgbG9jYWxlRGF0YSA9IGludGVybmFscy5EYXRlVGltZUZvcm1hdFsnW1tsb2NhbGVEYXRhXV0nXVtkYXRhTG9jYWxlXS5jYWxlbmRhcnM7XG4gICAgdmFyIGNhID0gaW50ZXJuYWxbJ1tbY2FsZW5kYXJdXSddO1xuXG4gICAgLy8gMTEuXG4gICAgd2hpbGUgKGJlZ2luSW5kZXggIT09IC0xKSB7XG4gICAgICAgIHZhciBmdiA9IHZvaWQgMDtcbiAgICAgICAgLy8gYS5cbiAgICAgICAgZW5kSW5kZXggPSBwYXR0ZXJuLmluZGV4T2YoJ30nLCBiZWdpbkluZGV4KTtcbiAgICAgICAgLy8gYi5cbiAgICAgICAgaWYgKGVuZEluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmNsb3NlZCBwYXR0ZXJuJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYy5cbiAgICAgICAgaWYgKGJlZ2luSW5kZXggPiBpbmRleCkge1xuICAgICAgICAgICAgYXJyUHVzaC5jYWxsKHJlc3VsdCwge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdsaXRlcmFsJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcGF0dGVybi5zdWJzdHJpbmcoaW5kZXgsIGJlZ2luSW5kZXgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBkLlxuICAgICAgICB2YXIgcCA9IHBhdHRlcm4uc3Vic3RyaW5nKGJlZ2luSW5kZXggKyAxLCBlbmRJbmRleCk7XG4gICAgICAgIC8vIGUuXG4gICAgICAgIGlmIChkYXRlVGltZUNvbXBvbmVudHMuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgICAgICAgIC8vICAgaS4gTGV0IGYgYmUgdGhlIHZhbHVlIG9mIHRoZSBbWzxwPl1dIGludGVybmFsIHByb3BlcnR5IG9mIGRhdGVUaW1lRm9ybWF0LlxuICAgICAgICAgICAgdmFyIGYgPSBpbnRlcm5hbFsnW1snICsgcCArICddXSddO1xuICAgICAgICAgICAgLy8gIGlpLiBMZXQgdiBiZSB0aGUgdmFsdWUgb2YgdG0uW1s8cD5dXS5cbiAgICAgICAgICAgIHZhciB2ID0gdG1bJ1tbJyArIHAgKyAnXV0nXTtcbiAgICAgICAgICAgIC8vIGlpaS4gSWYgcCBpcyBcInllYXJcIiBhbmQgdiDiiaQgMCwgdGhlbiBsZXQgdiBiZSAxIC0gdi5cbiAgICAgICAgICAgIGlmIChwID09PSAneWVhcicgJiYgdiA8PSAwKSB7XG4gICAgICAgICAgICAgICAgdiA9IDEgLSB2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gIGl2LiBJZiBwIGlzIFwibW9udGhcIiwgdGhlbiBpbmNyZWFzZSB2IGJ5IDEuXG4gICAgICAgICAgICBlbHNlIGlmIChwID09PSAnbW9udGgnKSB7XG4gICAgICAgICAgICAgICAgICAgIHYrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gICB2LiBJZiBwIGlzIFwiaG91clwiIGFuZCB0aGUgdmFsdWUgb2YgdGhlIFtbaG91cjEyXV0gaW50ZXJuYWwgcHJvcGVydHkgb2ZcbiAgICAgICAgICAgICAgICAvLyAgICAgIGRhdGVUaW1lRm9ybWF0IGlzIHRydWUsIHRoZW5cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwID09PSAnaG91cicgJiYgaW50ZXJuYWxbJ1tbaG91cjEyXV0nXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMS4gTGV0IHYgYmUgdiBtb2R1bG8gMTIuXG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gdiAlIDEyO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMi4gSWYgdiBpcyAwIGFuZCB0aGUgdmFsdWUgb2YgdGhlIFtbaG91ck5vMF1dIGludGVybmFsIHByb3BlcnR5IG9mXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICBkYXRlVGltZUZvcm1hdCBpcyB0cnVlLCB0aGVuIGxldCB2IGJlIDEyLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYgPT09IDAgJiYgaW50ZXJuYWxbJ1tbaG91ck5vMF1dJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ID0gMTI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gIHZpLiBJZiBmIGlzIFwibnVtZXJpY1wiLCB0aGVuXG4gICAgICAgICAgICBpZiAoZiA9PT0gJ251bWVyaWMnKSB7XG4gICAgICAgICAgICAgICAgLy8gMS4gTGV0IGZ2IGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgRm9ybWF0TnVtYmVyIGFic3RyYWN0IG9wZXJhdGlvblxuICAgICAgICAgICAgICAgIC8vICAgIChkZWZpbmVkIGluIDExLjMuMikgd2l0aCBhcmd1bWVudHMgbmYgYW5kIHYuXG4gICAgICAgICAgICAgICAgZnYgPSBGb3JtYXROdW1iZXIobmYsIHYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdmlpLiBFbHNlIGlmIGYgaXMgXCIyLWRpZ2l0XCIsIHRoZW5cbiAgICAgICAgICAgIGVsc2UgaWYgKGYgPT09ICcyLWRpZ2l0Jykge1xuICAgICAgICAgICAgICAgICAgICAvLyAxLiBMZXQgZnYgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBGb3JtYXROdW1iZXIgYWJzdHJhY3Qgb3BlcmF0aW9uXG4gICAgICAgICAgICAgICAgICAgIC8vICAgIHdpdGggYXJndW1lbnRzIG5mMiBhbmQgdi5cbiAgICAgICAgICAgICAgICAgICAgZnYgPSBGb3JtYXROdW1iZXIobmYyLCB2KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gMi4gSWYgdGhlIGxlbmd0aCBvZiBmdiBpcyBncmVhdGVyIHRoYW4gMiwgbGV0IGZ2IGJlIHRoZSBzdWJzdHJpbmcgb2YgZnZcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgY29udGFpbmluZyB0aGUgbGFzdCB0d28gY2hhcmFjdGVycy5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGZ2Lmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ2ID0gZnYuc2xpY2UoLTIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHZpaWkuIEVsc2UgaWYgZiBpcyBcIm5hcnJvd1wiLCBcInNob3J0XCIsIG9yIFwibG9uZ1wiLCB0aGVuIGxldCBmdiBiZSBhIFN0cmluZ1xuICAgICAgICAgICAgICAgIC8vICAgICB2YWx1ZSByZXByZXNlbnRpbmcgZiBpbiB0aGUgZGVzaXJlZCBmb3JtOyB0aGUgU3RyaW5nIHZhbHVlIGRlcGVuZHMgdXBvblxuICAgICAgICAgICAgICAgIC8vICAgICB0aGUgaW1wbGVtZW50YXRpb24gYW5kIHRoZSBlZmZlY3RpdmUgbG9jYWxlIGFuZCBjYWxlbmRhciBvZlxuICAgICAgICAgICAgICAgIC8vICAgICBkYXRlVGltZUZvcm1hdC4gSWYgcCBpcyBcIm1vbnRoXCIsIHRoZW4gdGhlIFN0cmluZyB2YWx1ZSBtYXkgYWxzbyBkZXBlbmRcbiAgICAgICAgICAgICAgICAvLyAgICAgb24gd2hldGhlciBkYXRlVGltZUZvcm1hdCBoYXMgYSBbW2RheV1dIGludGVybmFsIHByb3BlcnR5LiBJZiBwIGlzXG4gICAgICAgICAgICAgICAgLy8gICAgIFwidGltZVpvbmVOYW1lXCIsIHRoZW4gdGhlIFN0cmluZyB2YWx1ZSBtYXkgYWxzbyBkZXBlbmQgb24gdGhlIHZhbHVlIG9mXG4gICAgICAgICAgICAgICAgLy8gICAgIHRoZSBbW2luRFNUXV0gZmllbGQgb2YgdG0uXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZiBpbiBkYXRlV2lkdGhzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdtb250aCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ2ID0gcmVzb2x2ZURhdGVTdHJpbmcobG9jYWxlRGF0YSwgY2EsICdtb250aHMnLCBmLCB0bVsnW1snICsgcCArICddXSddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd3ZWVrZGF5JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ2ID0gcmVzb2x2ZURhdGVTdHJpbmcobG9jYWxlRGF0YSwgY2EsICdkYXlzJywgZiwgdG1bJ1tbJyArIHAgKyAnXV0nXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmdiA9IHJlc29sdmVEYXRlU3RyaW5nKGNhLmRheXMsIGYpW3RtWydbWycrIHAgKyddXSddXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZmluZCB3ZWVrZGF5IGRhdGEgZm9yIGxvY2FsZSAnICsgbG9jYWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3RpbWVab25lTmFtZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ2ID0gJyc7IC8vICMjI1RPRE9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdlcmEnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnYgPSByZXNvbHZlRGF0ZVN0cmluZyhsb2NhbGVEYXRhLCBjYSwgJ2VyYXMnLCBmLCB0bVsnW1snICsgcCArICddXSddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZmluZCBlcmEgZGF0YSBmb3IgbG9jYWxlICcgKyBsb2NhbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnYgPSB0bVsnW1snICsgcCArICddXSddO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpeFxuICAgICAgICAgICAgYXJyUHVzaC5jYWxsKHJlc3VsdCwge1xuICAgICAgICAgICAgICAgIHR5cGU6IHAsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZ2XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGYuXG4gICAgICAgIH0gZWxzZSBpZiAocCA9PT0gJ2FtcG0nKSB7XG4gICAgICAgICAgICAgICAgLy8gaS5cbiAgICAgICAgICAgICAgICB2YXIgX3YgPSB0bVsnW1tob3VyXV0nXTtcbiAgICAgICAgICAgICAgICAvLyBpaS4vaWlpLlxuICAgICAgICAgICAgICAgIGZ2ID0gcmVzb2x2ZURhdGVTdHJpbmcobG9jYWxlRGF0YSwgY2EsICdkYXlQZXJpb2RzJywgX3YgPiAxMSA/ICdwbScgOiAnYW0nLCBudWxsKTtcbiAgICAgICAgICAgICAgICAvLyBpdi5cbiAgICAgICAgICAgICAgICBhcnJQdXNoLmNhbGwocmVzdWx0LCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkYXlQZXJpb2QnLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZnZcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyBnLlxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXJyUHVzaC5jYWxsKHJlc3VsdCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2xpdGVyYWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHBhdHRlcm4uc3Vic3RyaW5nKGJlZ2luSW5kZXgsIGVuZEluZGV4ICsgMSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyBoLlxuICAgICAgICBpbmRleCA9IGVuZEluZGV4ICsgMTtcbiAgICAgICAgLy8gaS5cbiAgICAgICAgYmVnaW5JbmRleCA9IHBhdHRlcm4uaW5kZXhPZigneycsIGluZGV4KTtcbiAgICB9XG4gICAgLy8gMTIuXG4gICAgaWYgKGVuZEluZGV4IDwgcGF0dGVybi5sZW5ndGggLSAxKSB7XG4gICAgICAgIGFyclB1c2guY2FsbChyZXN1bHQsIHtcbiAgICAgICAgICAgIHR5cGU6ICdsaXRlcmFsJyxcbiAgICAgICAgICAgIHZhbHVlOiBwYXR0ZXJuLnN1YnN0cihlbmRJbmRleCArIDEpXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyAxMy5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFdoZW4gdGhlIEZvcm1hdERhdGVUaW1lIGFic3RyYWN0IG9wZXJhdGlvbiBpcyBjYWxsZWQgd2l0aCBhcmd1bWVudHMgZGF0ZVRpbWVGb3JtYXRcbiAqICh3aGljaCBtdXN0IGJlIGFuIG9iamVjdCBpbml0aWFsaXplZCBhcyBhIERhdGVUaW1lRm9ybWF0KSBhbmQgeCAod2hpY2ggbXVzdCBiZSBhIE51bWJlclxuICogdmFsdWUpLCBpdCByZXR1cm5zIGEgU3RyaW5nIHZhbHVlIHJlcHJlc2VudGluZyB4IChpbnRlcnByZXRlZCBhcyBhIHRpbWUgdmFsdWUgYXNcbiAqIHNwZWNpZmllZCBpbiBFUzUsIDE1LjkuMS4xKSBhY2NvcmRpbmcgdG8gdGhlIGVmZmVjdGl2ZSBsb2NhbGUgYW5kIHRoZSBmb3JtYXR0aW5nXG4gKiBvcHRpb25zIG9mIGRhdGVUaW1lRm9ybWF0LlxuICovXG5mdW5jdGlvbiBGb3JtYXREYXRlVGltZShkYXRlVGltZUZvcm1hdCwgeCkge1xuICAgIHZhciBwYXJ0cyA9IENyZWF0ZURhdGVUaW1lUGFydHMoZGF0ZVRpbWVGb3JtYXQsIHgpO1xuICAgIHZhciByZXN1bHQgPSAnJztcblxuICAgIGZvciAodmFyIGkgPSAwOyBwYXJ0cy5sZW5ndGggPiBpOyBpKyspIHtcbiAgICAgICAgdmFyIHBhcnQgPSBwYXJ0c1tpXTtcbiAgICAgICAgcmVzdWx0ICs9IHBhcnQudmFsdWU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIEZvcm1hdFRvUGFydHNEYXRlVGltZShkYXRlVGltZUZvcm1hdCwgeCkge1xuICAgIHZhciBwYXJ0cyA9IENyZWF0ZURhdGVUaW1lUGFydHMoZGF0ZVRpbWVGb3JtYXQsIHgpO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgcGFydHMubGVuZ3RoID4gaTsgaSsrKSB7XG4gICAgICAgIHZhciBwYXJ0ID0gcGFydHNbaV07XG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6IHBhcnQudHlwZSxcbiAgICAgICAgICAgIHZhbHVlOiBwYXJ0LnZhbHVlXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFdoZW4gdGhlIFRvTG9jYWxUaW1lIGFic3RyYWN0IG9wZXJhdGlvbiBpcyBjYWxsZWQgd2l0aCBhcmd1bWVudHMgZGF0ZSwgY2FsZW5kYXIsIGFuZFxuICogdGltZVpvbmUsIHRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHRha2VuOlxuICovXG5mdW5jdGlvbiBUb0xvY2FsVGltZShkYXRlLCBjYWxlbmRhciwgdGltZVpvbmUpIHtcbiAgICAvLyAxLiBBcHBseSBjYWxlbmRyaWNhbCBjYWxjdWxhdGlvbnMgb24gZGF0ZSBmb3IgdGhlIGdpdmVuIGNhbGVuZGFyIGFuZCB0aW1lIHpvbmUgdG9cbiAgICAvLyAgICBwcm9kdWNlIHdlZWtkYXksIGVyYSwgeWVhciwgbW9udGgsIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmQsIGFuZCBpbkRTVCB2YWx1ZXMuXG4gICAgLy8gICAgVGhlIGNhbGN1bGF0aW9ucyBzaG91bGQgdXNlIGJlc3QgYXZhaWxhYmxlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBzcGVjaWZpZWRcbiAgICAvLyAgICBjYWxlbmRhciBhbmQgdGltZSB6b25lLiBJZiB0aGUgY2FsZW5kYXIgaXMgXCJncmVnb3J5XCIsIHRoZW4gdGhlIGNhbGN1bGF0aW9ucyBtdXN0XG4gICAgLy8gICAgbWF0Y2ggdGhlIGFsZ29yaXRobXMgc3BlY2lmaWVkIGluIEVTNSwgMTUuOS4xLCBleGNlcHQgdGhhdCBjYWxjdWxhdGlvbnMgYXJlIG5vdFxuICAgIC8vICAgIGJvdW5kIGJ5IHRoZSByZXN0cmljdGlvbnMgb24gdGhlIHVzZSBvZiBiZXN0IGF2YWlsYWJsZSBpbmZvcm1hdGlvbiBvbiB0aW1lIHpvbmVzXG4gICAgLy8gICAgZm9yIGxvY2FsIHRpbWUgem9uZSBhZGp1c3RtZW50IGFuZCBkYXlsaWdodCBzYXZpbmcgdGltZSBhZGp1c3RtZW50IGltcG9zZWQgYnlcbiAgICAvLyAgICBFUzUsIDE1LjkuMS43IGFuZCAxNS45LjEuOC5cbiAgICAvLyAjIyNUT0RPIyMjXG4gICAgdmFyIGQgPSBuZXcgRGF0ZShkYXRlKSxcbiAgICAgICAgbSA9ICdnZXQnICsgKHRpbWVab25lIHx8ICcnKTtcblxuICAgIC8vIDIuIFJldHVybiBhIFJlY29yZCB3aXRoIGZpZWxkcyBbW3dlZWtkYXldXSwgW1tlcmFdXSwgW1t5ZWFyXV0sIFtbbW9udGhdXSwgW1tkYXldXSxcbiAgICAvLyAgICBbW2hvdXJdXSwgW1ttaW51dGVdXSwgW1tzZWNvbmRdXSwgYW5kIFtbaW5EU1RdXSwgZWFjaCB3aXRoIHRoZSBjb3JyZXNwb25kaW5nXG4gICAgLy8gICAgY2FsY3VsYXRlZCB2YWx1ZS5cbiAgICByZXR1cm4gbmV3IFJlY29yZCh7XG4gICAgICAgICdbW3dlZWtkYXldXSc6IGRbbSArICdEYXknXSgpLFxuICAgICAgICAnW1tlcmFdXSc6ICsoZFttICsgJ0Z1bGxZZWFyJ10oKSA+PSAwKSxcbiAgICAgICAgJ1tbeWVhcl1dJzogZFttICsgJ0Z1bGxZZWFyJ10oKSxcbiAgICAgICAgJ1tbbW9udGhdXSc6IGRbbSArICdNb250aCddKCksXG4gICAgICAgICdbW2RheV1dJzogZFttICsgJ0RhdGUnXSgpLFxuICAgICAgICAnW1tob3VyXV0nOiBkW20gKyAnSG91cnMnXSgpLFxuICAgICAgICAnW1ttaW51dGVdXSc6IGRbbSArICdNaW51dGVzJ10oKSxcbiAgICAgICAgJ1tbc2Vjb25kXV0nOiBkW20gKyAnU2Vjb25kcyddKCksXG4gICAgICAgICdbW2luRFNUXV0nOiBmYWxzZSB9KTtcbn1cblxuLyoqXG4gKiBUaGUgZnVuY3Rpb24gcmV0dXJucyBhIG5ldyBvYmplY3Qgd2hvc2UgcHJvcGVydGllcyBhbmQgYXR0cmlidXRlcyBhcmUgc2V0IGFzIGlmXG4gKiBjb25zdHJ1Y3RlZCBieSBhbiBvYmplY3QgbGl0ZXJhbCBhc3NpZ25pbmcgdG8gZWFjaCBvZiB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXMgdGhlXG4gKiB2YWx1ZSBvZiB0aGUgY29ycmVzcG9uZGluZyBpbnRlcm5hbCBwcm9wZXJ0eSBvZiB0aGlzIERhdGVUaW1lRm9ybWF0IG9iamVjdCAoc2VlIDEyLjQpOlxuICogbG9jYWxlLCBjYWxlbmRhciwgbnVtYmVyaW5nU3lzdGVtLCB0aW1lWm9uZSwgaG91cjEyLCB3ZWVrZGF5LCBlcmEsIHllYXIsIG1vbnRoLCBkYXksXG4gKiBob3VyLCBtaW51dGUsIHNlY29uZCwgYW5kIHRpbWVab25lTmFtZS4gUHJvcGVydGllcyB3aG9zZSBjb3JyZXNwb25kaW5nIGludGVybmFsXG4gKiBwcm9wZXJ0aWVzIGFyZSBub3QgcHJlc2VudCBhcmUgbm90IGFzc2lnbmVkLlxuICovXG4vKiAxMi4zLjMgKi8gLy8gIyMjVE9ETyMjI1xuZGVmaW5lUHJvcGVydHkoSW50bC5EYXRlVGltZUZvcm1hdC5wcm90b3R5cGUsICdyZXNvbHZlZE9wdGlvbnMnLCB7XG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZSgpIHtcbiAgICAgICAgdmFyIHByb3AgPSB2b2lkIDAsXG4gICAgICAgICAgICBkZXNjcyA9IG5ldyBSZWNvcmQoKSxcbiAgICAgICAgICAgIHByb3BzID0gWydsb2NhbGUnLCAnY2FsZW5kYXInLCAnbnVtYmVyaW5nU3lzdGVtJywgJ3RpbWVab25lJywgJ2hvdXIxMicsICd3ZWVrZGF5JywgJ2VyYScsICd5ZWFyJywgJ21vbnRoJywgJ2RheScsICdob3VyJywgJ21pbnV0ZScsICdzZWNvbmQnLCAndGltZVpvbmVOYW1lJ10sXG4gICAgICAgICAgICBpbnRlcm5hbCA9IHRoaXMgIT09IG51bGwgJiYgYmFiZWxIZWxwZXJzW1widHlwZW9mXCJdKHRoaXMpID09PSAnb2JqZWN0JyAmJiBnZXRJbnRlcm5hbFByb3BlcnRpZXModGhpcyk7XG5cbiAgICAgICAgLy8gU2F0aXNmeSB0ZXN0IDEyLjNfYlxuICAgICAgICBpZiAoIWludGVybmFsIHx8ICFpbnRlcm5hbFsnW1tpbml0aWFsaXplZERhdGVUaW1lRm9ybWF0XV0nXSkgdGhyb3cgbmV3IFR5cGVFcnJvcignYHRoaXNgIHZhbHVlIGZvciByZXNvbHZlZE9wdGlvbnMoKSBpcyBub3QgYW4gaW5pdGlhbGl6ZWQgSW50bC5EYXRlVGltZUZvcm1hdCBvYmplY3QuJyk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIG1heCA9IHByb3BzLmxlbmd0aDsgaSA8IG1heDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaG9wLmNhbGwoaW50ZXJuYWwsIHByb3AgPSAnW1snICsgcHJvcHNbaV0gKyAnXV0nKSkgZGVzY3NbcHJvcHNbaV1dID0geyB2YWx1ZTogaW50ZXJuYWxbcHJvcF0sIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIGVudW1lcmFibGU6IHRydWUgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvYmpDcmVhdGUoe30sIGRlc2NzKTtcbiAgICB9XG59KTtcblxudmFyIGxzID0gSW50bC5fX2xvY2FsZVNlbnNpdGl2ZVByb3RvcyA9IHtcbiAgICBOdW1iZXI6IHt9LFxuICAgIERhdGU6IHt9XG59O1xuXG4vKipcbiAqIFdoZW4gdGhlIHRvTG9jYWxlU3RyaW5nIG1ldGhvZCBpcyBjYWxsZWQgd2l0aCBvcHRpb25hbCBhcmd1bWVudHMgbG9jYWxlcyBhbmQgb3B0aW9ucyxcbiAqIHRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHRha2VuOlxuICovXG4vKiAxMy4yLjEgKi9scy5OdW1iZXIudG9Mb2NhbGVTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gU2F0aXNmeSB0ZXN0IDEzLjIuMV8xXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0aGlzKSAhPT0gJ1tvYmplY3QgTnVtYmVyXScpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2B0aGlzYCB2YWx1ZSBtdXN0IGJlIGEgbnVtYmVyIGZvciBOdW1iZXIucHJvdG90eXBlLnRvTG9jYWxlU3RyaW5nKCknKTtcblxuICAgIC8vIDEuIExldCB4IGJlIHRoaXMgTnVtYmVyIHZhbHVlIChhcyBkZWZpbmVkIGluIEVTNSwgMTUuNy40KS5cbiAgICAvLyAyLiBJZiBsb2NhbGVzIGlzIG5vdCBwcm92aWRlZCwgdGhlbiBsZXQgbG9jYWxlcyBiZSB1bmRlZmluZWQuXG4gICAgLy8gMy4gSWYgb3B0aW9ucyBpcyBub3QgcHJvdmlkZWQsIHRoZW4gbGV0IG9wdGlvbnMgYmUgdW5kZWZpbmVkLlxuICAgIC8vIDQuIExldCBudW1iZXJGb3JtYXQgYmUgdGhlIHJlc3VsdCBvZiBjcmVhdGluZyBhIG5ldyBvYmplY3QgYXMgaWYgYnkgdGhlXG4gICAgLy8gICAgZXhwcmVzc2lvbiBuZXcgSW50bC5OdW1iZXJGb3JtYXQobG9jYWxlcywgb3B0aW9ucykgd2hlcmVcbiAgICAvLyAgICBJbnRsLk51bWJlckZvcm1hdCBpcyB0aGUgc3RhbmRhcmQgYnVpbHQtaW4gY29uc3RydWN0b3IgZGVmaW5lZCBpbiAxMS4xLjMuXG4gICAgLy8gNS4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgRm9ybWF0TnVtYmVyIGFic3RyYWN0IG9wZXJhdGlvblxuICAgIC8vICAgIChkZWZpbmVkIGluIDExLjMuMikgd2l0aCBhcmd1bWVudHMgbnVtYmVyRm9ybWF0IGFuZCB4LlxuICAgIHJldHVybiBGb3JtYXROdW1iZXIobmV3IE51bWJlckZvcm1hdENvbnN0cnVjdG9yKGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKSwgdGhpcyk7XG59O1xuXG4vKipcbiAqIFdoZW4gdGhlIHRvTG9jYWxlU3RyaW5nIG1ldGhvZCBpcyBjYWxsZWQgd2l0aCBvcHRpb25hbCBhcmd1bWVudHMgbG9jYWxlcyBhbmQgb3B0aW9ucyxcbiAqIHRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHRha2VuOlxuICovXG4vKiAxMy4zLjEgKi9scy5EYXRlLnRvTG9jYWxlU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFNhdGlzZnkgdGVzdCAxMy4zLjBfMVxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGhpcykgIT09ICdbb2JqZWN0IERhdGVdJykgdGhyb3cgbmV3IFR5cGVFcnJvcignYHRoaXNgIHZhbHVlIG11c3QgYmUgYSBEYXRlIGluc3RhbmNlIGZvciBEYXRlLnByb3RvdHlwZS50b0xvY2FsZVN0cmluZygpJyk7XG5cbiAgICAvLyAxLiBMZXQgeCBiZSB0aGlzIHRpbWUgdmFsdWUgKGFzIGRlZmluZWQgaW4gRVM1LCAxNS45LjUpLlxuICAgIHZhciB4ID0gK3RoaXM7XG5cbiAgICAvLyAyLiBJZiB4IGlzIE5hTiwgdGhlbiByZXR1cm4gXCJJbnZhbGlkIERhdGVcIi5cbiAgICBpZiAoaXNOYU4oeCkpIHJldHVybiAnSW52YWxpZCBEYXRlJztcblxuICAgIC8vIDMuIElmIGxvY2FsZXMgaXMgbm90IHByb3ZpZGVkLCB0aGVuIGxldCBsb2NhbGVzIGJlIHVuZGVmaW5lZC5cbiAgICB2YXIgbG9jYWxlcyA9IGFyZ3VtZW50c1swXTtcblxuICAgIC8vIDQuIElmIG9wdGlvbnMgaXMgbm90IHByb3ZpZGVkLCB0aGVuIGxldCBvcHRpb25zIGJlIHVuZGVmaW5lZC5cbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50c1sxXTtcblxuICAgIC8vIDUuIExldCBvcHRpb25zIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgVG9EYXRlVGltZU9wdGlvbnMgYWJzdHJhY3RcbiAgICAvLyAgICBvcGVyYXRpb24gKGRlZmluZWQgaW4gMTIuMS4xKSB3aXRoIGFyZ3VtZW50cyBvcHRpb25zLCBcImFueVwiLCBhbmQgXCJhbGxcIi5cbiAgICBvcHRpb25zID0gVG9EYXRlVGltZU9wdGlvbnMob3B0aW9ucywgJ2FueScsICdhbGwnKTtcblxuICAgIC8vIDYuIExldCBkYXRlVGltZUZvcm1hdCBiZSB0aGUgcmVzdWx0IG9mIGNyZWF0aW5nIGEgbmV3IG9iamVjdCBhcyBpZiBieSB0aGVcbiAgICAvLyAgICBleHByZXNzaW9uIG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGxvY2FsZXMsIG9wdGlvbnMpIHdoZXJlXG4gICAgLy8gICAgSW50bC5EYXRlVGltZUZvcm1hdCBpcyB0aGUgc3RhbmRhcmQgYnVpbHQtaW4gY29uc3RydWN0b3IgZGVmaW5lZCBpbiAxMi4xLjMuXG4gICAgdmFyIGRhdGVUaW1lRm9ybWF0ID0gbmV3IERhdGVUaW1lRm9ybWF0Q29uc3RydWN0b3IobG9jYWxlcywgb3B0aW9ucyk7XG5cbiAgICAvLyA3LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBGb3JtYXREYXRlVGltZSBhYnN0cmFjdCBvcGVyYXRpb24gKGRlZmluZWRcbiAgICAvLyAgICBpbiAxMi4zLjIpIHdpdGggYXJndW1lbnRzIGRhdGVUaW1lRm9ybWF0IGFuZCB4LlxuICAgIHJldHVybiBGb3JtYXREYXRlVGltZShkYXRlVGltZUZvcm1hdCwgeCk7XG59O1xuXG4vKipcbiAqIFdoZW4gdGhlIHRvTG9jYWxlRGF0ZVN0cmluZyBtZXRob2QgaXMgY2FsbGVkIHdpdGggb3B0aW9uYWwgYXJndW1lbnRzIGxvY2FsZXMgYW5kXG4gKiBvcHRpb25zLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAqL1xuLyogMTMuMy4yICovbHMuRGF0ZS50b0xvY2FsZURhdGVTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gU2F0aXNmeSB0ZXN0IDEzLjMuMF8xXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0aGlzKSAhPT0gJ1tvYmplY3QgRGF0ZV0nKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdgdGhpc2AgdmFsdWUgbXVzdCBiZSBhIERhdGUgaW5zdGFuY2UgZm9yIERhdGUucHJvdG90eXBlLnRvTG9jYWxlRGF0ZVN0cmluZygpJyk7XG5cbiAgICAvLyAxLiBMZXQgeCBiZSB0aGlzIHRpbWUgdmFsdWUgKGFzIGRlZmluZWQgaW4gRVM1LCAxNS45LjUpLlxuICAgIHZhciB4ID0gK3RoaXM7XG5cbiAgICAvLyAyLiBJZiB4IGlzIE5hTiwgdGhlbiByZXR1cm4gXCJJbnZhbGlkIERhdGVcIi5cbiAgICBpZiAoaXNOYU4oeCkpIHJldHVybiAnSW52YWxpZCBEYXRlJztcblxuICAgIC8vIDMuIElmIGxvY2FsZXMgaXMgbm90IHByb3ZpZGVkLCB0aGVuIGxldCBsb2NhbGVzIGJlIHVuZGVmaW5lZC5cbiAgICB2YXIgbG9jYWxlcyA9IGFyZ3VtZW50c1swXSxcblxuXG4gICAgLy8gNC4gSWYgb3B0aW9ucyBpcyBub3QgcHJvdmlkZWQsIHRoZW4gbGV0IG9wdGlvbnMgYmUgdW5kZWZpbmVkLlxuICAgIG9wdGlvbnMgPSBhcmd1bWVudHNbMV07XG5cbiAgICAvLyA1LiBMZXQgb3B0aW9ucyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFRvRGF0ZVRpbWVPcHRpb25zIGFic3RyYWN0XG4gICAgLy8gICAgb3BlcmF0aW9uIChkZWZpbmVkIGluIDEyLjEuMSkgd2l0aCBhcmd1bWVudHMgb3B0aW9ucywgXCJkYXRlXCIsIGFuZCBcImRhdGVcIi5cbiAgICBvcHRpb25zID0gVG9EYXRlVGltZU9wdGlvbnMob3B0aW9ucywgJ2RhdGUnLCAnZGF0ZScpO1xuXG4gICAgLy8gNi4gTGV0IGRhdGVUaW1lRm9ybWF0IGJlIHRoZSByZXN1bHQgb2YgY3JlYXRpbmcgYSBuZXcgb2JqZWN0IGFzIGlmIGJ5IHRoZVxuICAgIC8vICAgIGV4cHJlc3Npb24gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobG9jYWxlcywgb3B0aW9ucykgd2hlcmVcbiAgICAvLyAgICBJbnRsLkRhdGVUaW1lRm9ybWF0IGlzIHRoZSBzdGFuZGFyZCBidWlsdC1pbiBjb25zdHJ1Y3RvciBkZWZpbmVkIGluIDEyLjEuMy5cbiAgICB2YXIgZGF0ZVRpbWVGb3JtYXQgPSBuZXcgRGF0ZVRpbWVGb3JtYXRDb25zdHJ1Y3Rvcihsb2NhbGVzLCBvcHRpb25zKTtcblxuICAgIC8vIDcuIFJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEZvcm1hdERhdGVUaW1lIGFic3RyYWN0IG9wZXJhdGlvbiAoZGVmaW5lZFxuICAgIC8vICAgIGluIDEyLjMuMikgd2l0aCBhcmd1bWVudHMgZGF0ZVRpbWVGb3JtYXQgYW5kIHguXG4gICAgcmV0dXJuIEZvcm1hdERhdGVUaW1lKGRhdGVUaW1lRm9ybWF0LCB4KTtcbn07XG5cbi8qKlxuICogV2hlbiB0aGUgdG9Mb2NhbGVUaW1lU3RyaW5nIG1ldGhvZCBpcyBjYWxsZWQgd2l0aCBvcHRpb25hbCBhcmd1bWVudHMgbG9jYWxlcyBhbmRcbiAqIG9wdGlvbnMsIHRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHRha2VuOlxuICovXG4vKiAxMy4zLjMgKi9scy5EYXRlLnRvTG9jYWxlVGltZVN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBTYXRpc2Z5IHRlc3QgMTMuMy4wXzFcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRoaXMpICE9PSAnW29iamVjdCBEYXRlXScpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2B0aGlzYCB2YWx1ZSBtdXN0IGJlIGEgRGF0ZSBpbnN0YW5jZSBmb3IgRGF0ZS5wcm90b3R5cGUudG9Mb2NhbGVUaW1lU3RyaW5nKCknKTtcblxuICAgIC8vIDEuIExldCB4IGJlIHRoaXMgdGltZSB2YWx1ZSAoYXMgZGVmaW5lZCBpbiBFUzUsIDE1LjkuNSkuXG4gICAgdmFyIHggPSArdGhpcztcblxuICAgIC8vIDIuIElmIHggaXMgTmFOLCB0aGVuIHJldHVybiBcIkludmFsaWQgRGF0ZVwiLlxuICAgIGlmIChpc05hTih4KSkgcmV0dXJuICdJbnZhbGlkIERhdGUnO1xuXG4gICAgLy8gMy4gSWYgbG9jYWxlcyBpcyBub3QgcHJvdmlkZWQsIHRoZW4gbGV0IGxvY2FsZXMgYmUgdW5kZWZpbmVkLlxuICAgIHZhciBsb2NhbGVzID0gYXJndW1lbnRzWzBdO1xuXG4gICAgLy8gNC4gSWYgb3B0aW9ucyBpcyBub3QgcHJvdmlkZWQsIHRoZW4gbGV0IG9wdGlvbnMgYmUgdW5kZWZpbmVkLlxuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzWzFdO1xuXG4gICAgLy8gNS4gTGV0IG9wdGlvbnMgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBUb0RhdGVUaW1lT3B0aW9ucyBhYnN0cmFjdFxuICAgIC8vICAgIG9wZXJhdGlvbiAoZGVmaW5lZCBpbiAxMi4xLjEpIHdpdGggYXJndW1lbnRzIG9wdGlvbnMsIFwidGltZVwiLCBhbmQgXCJ0aW1lXCIuXG4gICAgb3B0aW9ucyA9IFRvRGF0ZVRpbWVPcHRpb25zKG9wdGlvbnMsICd0aW1lJywgJ3RpbWUnKTtcblxuICAgIC8vIDYuIExldCBkYXRlVGltZUZvcm1hdCBiZSB0aGUgcmVzdWx0IG9mIGNyZWF0aW5nIGEgbmV3IG9iamVjdCBhcyBpZiBieSB0aGVcbiAgICAvLyAgICBleHByZXNzaW9uIG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGxvY2FsZXMsIG9wdGlvbnMpIHdoZXJlXG4gICAgLy8gICAgSW50bC5EYXRlVGltZUZvcm1hdCBpcyB0aGUgc3RhbmRhcmQgYnVpbHQtaW4gY29uc3RydWN0b3IgZGVmaW5lZCBpbiAxMi4xLjMuXG4gICAgdmFyIGRhdGVUaW1lRm9ybWF0ID0gbmV3IERhdGVUaW1lRm9ybWF0Q29uc3RydWN0b3IobG9jYWxlcywgb3B0aW9ucyk7XG5cbiAgICAvLyA3LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBGb3JtYXREYXRlVGltZSBhYnN0cmFjdCBvcGVyYXRpb24gKGRlZmluZWRcbiAgICAvLyAgICBpbiAxMi4zLjIpIHdpdGggYXJndW1lbnRzIGRhdGVUaW1lRm9ybWF0IGFuZCB4LlxuICAgIHJldHVybiBGb3JtYXREYXRlVGltZShkYXRlVGltZUZvcm1hdCwgeCk7XG59O1xuXG5kZWZpbmVQcm9wZXJ0eShJbnRsLCAnX19hcHBseUxvY2FsZVNlbnNpdGl2ZVByb3RvdHlwZXMnLCB7XG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZSgpIHtcbiAgICAgICAgZGVmaW5lUHJvcGVydHkoTnVtYmVyLnByb3RvdHlwZSwgJ3RvTG9jYWxlU3RyaW5nJywgeyB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogbHMuTnVtYmVyLnRvTG9jYWxlU3RyaW5nIH0pO1xuICAgICAgICAvLyBOZWVkIHRoaXMgaGVyZSBmb3IgSUUgOCwgdG8gYXZvaWQgdGhlIF9Eb250RW51bV8gYnVnXG4gICAgICAgIGRlZmluZVByb3BlcnR5KERhdGUucHJvdG90eXBlLCAndG9Mb2NhbGVTdHJpbmcnLCB7IHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiBscy5EYXRlLnRvTG9jYWxlU3RyaW5nIH0pO1xuXG4gICAgICAgIGZvciAodmFyIGsgaW4gbHMuRGF0ZSkge1xuICAgICAgICAgICAgaWYgKGhvcC5jYWxsKGxzLkRhdGUsIGspKSBkZWZpbmVQcm9wZXJ0eShEYXRlLnByb3RvdHlwZSwgaywgeyB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogbHMuRGF0ZVtrXSB9KTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG4vKipcbiAqIENhbid0IHJlYWxseSBzaGlwIGEgc2luZ2xlIHNjcmlwdCB3aXRoIGRhdGEgZm9yIGh1bmRyZWRzIG9mIGxvY2FsZXMsIHNvIHdlIHByb3ZpZGVcbiAqIHRoaXMgX19hZGRMb2NhbGVEYXRhIG1ldGhvZCBhcyBhIG1lYW5zIGZvciB0aGUgZGV2ZWxvcGVyIHRvIGFkZCB0aGUgZGF0YSBvbiBhblxuICogYXMtbmVlZGVkIGJhc2lzXG4gKi9cbmRlZmluZVByb3BlcnR5KEludGwsICdfX2FkZExvY2FsZURhdGEnLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKGRhdGEpIHtcbiAgICAgICAgaWYgKCFJc1N0cnVjdHVyYWxseVZhbGlkTGFuZ3VhZ2VUYWcoZGF0YS5sb2NhbGUpKSB0aHJvdyBuZXcgRXJyb3IoXCJPYmplY3QgcGFzc2VkIGRvZXNuJ3QgaWRlbnRpZnkgaXRzZWxmIHdpdGggYSB2YWxpZCBsYW5ndWFnZSB0YWdcIik7XG5cbiAgICAgICAgYWRkTG9jYWxlRGF0YShkYXRhLCBkYXRhLmxvY2FsZSk7XG4gICAgfVxufSk7XG5cbmZ1bmN0aW9uIGFkZExvY2FsZURhdGEoZGF0YSwgdGFnKSB7XG4gICAgLy8gQm90aCBOdW1iZXJGb3JtYXQgYW5kIERhdGVUaW1lRm9ybWF0IHJlcXVpcmUgbnVtYmVyIGRhdGEsIHNvIHRocm93IGlmIGl0IGlzbid0IHByZXNlbnRcbiAgICBpZiAoIWRhdGEubnVtYmVyKSB0aHJvdyBuZXcgRXJyb3IoXCJPYmplY3QgcGFzc2VkIGRvZXNuJ3QgY29udGFpbiBsb2NhbGUgZGF0YSBmb3IgSW50bC5OdW1iZXJGb3JtYXRcIik7XG5cbiAgICB2YXIgbG9jYWxlID0gdm9pZCAwLFxuICAgICAgICBsb2NhbGVzID0gW3RhZ10sXG4gICAgICAgIHBhcnRzID0gdGFnLnNwbGl0KCctJyk7XG5cbiAgICAvLyBDcmVhdGUgZmFsbGJhY2tzIGZvciBsb2NhbGUgZGF0YSB3aXRoIHNjcmlwdHMsIGUuZy4gTGF0biwgSGFucywgVmFpaSwgZXRjXG4gICAgaWYgKHBhcnRzLmxlbmd0aCA+IDIgJiYgcGFydHNbMV0ubGVuZ3RoID09PSA0KSBhcnJQdXNoLmNhbGwobG9jYWxlcywgcGFydHNbMF0gKyAnLScgKyBwYXJ0c1syXSk7XG5cbiAgICB3aGlsZSAobG9jYWxlID0gYXJyU2hpZnQuY2FsbChsb2NhbGVzKSkge1xuICAgICAgICAvLyBBZGQgdG8gTnVtYmVyRm9ybWF0IGludGVybmFsIHByb3BlcnRpZXMgYXMgcGVyIDExLjIuM1xuICAgICAgICBhcnJQdXNoLmNhbGwoaW50ZXJuYWxzLk51bWJlckZvcm1hdFsnW1thdmFpbGFibGVMb2NhbGVzXV0nXSwgbG9jYWxlKTtcbiAgICAgICAgaW50ZXJuYWxzLk51bWJlckZvcm1hdFsnW1tsb2NhbGVEYXRhXV0nXVtsb2NhbGVdID0gZGF0YS5udW1iZXI7XG5cbiAgICAgICAgLy8gLi4uYW5kIERhdGVUaW1lRm9ybWF0IGludGVybmFsIHByb3BlcnRpZXMgYXMgcGVyIDEyLjIuM1xuICAgICAgICBpZiAoZGF0YS5kYXRlKSB7XG4gICAgICAgICAgICBkYXRhLmRhdGUubnUgPSBkYXRhLm51bWJlci5udTtcbiAgICAgICAgICAgIGFyclB1c2guY2FsbChpbnRlcm5hbHMuRGF0ZVRpbWVGb3JtYXRbJ1tbYXZhaWxhYmxlTG9jYWxlc11dJ10sIGxvY2FsZSk7XG4gICAgICAgICAgICBpbnRlcm5hbHMuRGF0ZVRpbWVGb3JtYXRbJ1tbbG9jYWxlRGF0YV1dJ11bbG9jYWxlXSA9IGRhdGEuZGF0ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IHNldCBvZiBsb2NhbGUgZGF0YSBhZGRlZCwgbWFrZSBpdCB0aGUgZGVmYXVsdFxuICAgIGlmIChkZWZhdWx0TG9jYWxlID09PSB1bmRlZmluZWQpIHNldERlZmF1bHRMb2NhbGUodGFnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnRsOyIsIkludGxQb2x5ZmlsbC5fX2FkZExvY2FsZURhdGEoe2xvY2FsZTpcImVuLVVTXCIsZGF0ZTp7Y2E6W1wiZ3JlZ29yeVwiLFwiYnVkZGhpc3RcIixcImNoaW5lc2VcIixcImNvcHRpY1wiLFwiZGFuZ2lcIixcImV0aGlvYWFcIixcImV0aGlvcGljXCIsXCJnZW5lcmljXCIsXCJoZWJyZXdcIixcImluZGlhblwiLFwiaXNsYW1pY1wiLFwiaXNsYW1pY2NcIixcImphcGFuZXNlXCIsXCJwZXJzaWFuXCIsXCJyb2NcIl0saG91ck5vMDp0cnVlLGhvdXIxMjp0cnVlLGZvcm1hdHM6e3Nob3J0OlwiezF9LCB7MH1cIixtZWRpdW06XCJ7MX0sIHswfVwiLGZ1bGw6XCJ7MX0gJ2F0JyB7MH1cIixsb25nOlwiezF9ICdhdCcgezB9XCIsYXZhaWxhYmxlRm9ybWF0czp7XCJkXCI6XCJkXCIsXCJFXCI6XCJjY2NcIixFZDpcImQgRVwiLEVobTpcIkUgaDptbSBhXCIsRUhtOlwiRSBISDptbVwiLEVobXM6XCJFIGg6bW06c3MgYVwiLEVIbXM6XCJFIEhIOm1tOnNzXCIsR3k6XCJ5IEdcIixHeU1NTTpcIk1NTSB5IEdcIixHeU1NTWQ6XCJNTU0gZCwgeSBHXCIsR3lNTU1FZDpcIkUsIE1NTSBkLCB5IEdcIixcImhcIjpcImggYVwiLFwiSFwiOlwiSEhcIixobTpcImg6bW0gYVwiLEhtOlwiSEg6bW1cIixobXM6XCJoOm1tOnNzIGFcIixIbXM6XCJISDptbTpzc1wiLGhtc3Y6XCJoOm1tOnNzIGEgdlwiLEhtc3Y6XCJISDptbTpzcyB2XCIsaG12OlwiaDptbSBhIHZcIixIbXY6XCJISDptbSB2XCIsXCJNXCI6XCJMXCIsTWQ6XCJNL2RcIixNRWQ6XCJFLCBNL2RcIixNTU06XCJMTExcIixNTU1kOlwiTU1NIGRcIixNTU1FZDpcIkUsIE1NTSBkXCIsTU1NTWQ6XCJNTU1NIGRcIixtczpcIm1tOnNzXCIsXCJ5XCI6XCJ5XCIseU06XCJNL3lcIix5TWQ6XCJNL2QveVwiLHlNRWQ6XCJFLCBNL2QveVwiLHlNTU06XCJNTU0geVwiLHlNTU1kOlwiTU1NIGQsIHlcIix5TU1NRWQ6XCJFLCBNTU0gZCwgeVwiLHlNTU1NOlwiTU1NTSB5XCIseVFRUTpcIlFRUSB5XCIseVFRUVE6XCJRUVFRIHlcIn0sZGF0ZUZvcm1hdHM6e3lNTU1NRUVFRWQ6XCJFRUVFLCBNTU1NIGQsIHlcIix5TU1NTWQ6XCJNTU1NIGQsIHlcIix5TU1NZDpcIk1NTSBkLCB5XCIseU1kOlwiTS9kL3l5XCJ9LHRpbWVGb3JtYXRzOntobW1zc3p6eno6XCJoOm1tOnNzIGEgenp6elwiLGhtc3o6XCJoOm1tOnNzIGEgelwiLGhtczpcImg6bW06c3MgYVwiLGhtOlwiaDptbSBhXCJ9fSxjYWxlbmRhcnM6e2J1ZGRoaXN0Onttb250aHM6e25hcnJvdzpbXCJKXCIsXCJGXCIsXCJNXCIsXCJBXCIsXCJNXCIsXCJKXCIsXCJKXCIsXCJBXCIsXCJTXCIsXCJPXCIsXCJOXCIsXCJEXCJdLHNob3J0OltcIkphblwiLFwiRmViXCIsXCJNYXJcIixcIkFwclwiLFwiTWF5XCIsXCJKdW5cIixcIkp1bFwiLFwiQXVnXCIsXCJTZXBcIixcIk9jdFwiLFwiTm92XCIsXCJEZWNcIl0sbG9uZzpbXCJKYW51YXJ5XCIsXCJGZWJydWFyeVwiLFwiTWFyY2hcIixcIkFwcmlsXCIsXCJNYXlcIixcIkp1bmVcIixcIkp1bHlcIixcIkF1Z3VzdFwiLFwiU2VwdGVtYmVyXCIsXCJPY3RvYmVyXCIsXCJOb3ZlbWJlclwiLFwiRGVjZW1iZXJcIl19LGRheXM6e25hcnJvdzpbXCJTXCIsXCJNXCIsXCJUXCIsXCJXXCIsXCJUXCIsXCJGXCIsXCJTXCJdLHNob3J0OltcIlN1blwiLFwiTW9uXCIsXCJUdWVcIixcIldlZFwiLFwiVGh1XCIsXCJGcmlcIixcIlNhdFwiXSxsb25nOltcIlN1bmRheVwiLFwiTW9uZGF5XCIsXCJUdWVzZGF5XCIsXCJXZWRuZXNkYXlcIixcIlRodXJzZGF5XCIsXCJGcmlkYXlcIixcIlNhdHVyZGF5XCJdfSxlcmFzOntuYXJyb3c6W1wiQkVcIl0sc2hvcnQ6W1wiQkVcIl0sbG9uZzpbXCJCRVwiXX0sZGF5UGVyaW9kczp7YW06XCJBTVwiLHBtOlwiUE1cIn19LGNoaW5lc2U6e21vbnRoczp7bmFycm93OltcIjFcIixcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIjEwXCIsXCIxMVwiLFwiMTJcIl0sc2hvcnQ6W1wiTW8xXCIsXCJNbzJcIixcIk1vM1wiLFwiTW80XCIsXCJNbzVcIixcIk1vNlwiLFwiTW83XCIsXCJNbzhcIixcIk1vOVwiLFwiTW8xMFwiLFwiTW8xMVwiLFwiTW8xMlwiXSxsb25nOltcIk1vbnRoMVwiLFwiTW9udGgyXCIsXCJNb250aDNcIixcIk1vbnRoNFwiLFwiTW9udGg1XCIsXCJNb250aDZcIixcIk1vbnRoN1wiLFwiTW9udGg4XCIsXCJNb250aDlcIixcIk1vbnRoMTBcIixcIk1vbnRoMTFcIixcIk1vbnRoMTJcIl19LGRheXM6e25hcnJvdzpbXCJTXCIsXCJNXCIsXCJUXCIsXCJXXCIsXCJUXCIsXCJGXCIsXCJTXCJdLHNob3J0OltcIlN1blwiLFwiTW9uXCIsXCJUdWVcIixcIldlZFwiLFwiVGh1XCIsXCJGcmlcIixcIlNhdFwiXSxsb25nOltcIlN1bmRheVwiLFwiTW9uZGF5XCIsXCJUdWVzZGF5XCIsXCJXZWRuZXNkYXlcIixcIlRodXJzZGF5XCIsXCJGcmlkYXlcIixcIlNhdHVyZGF5XCJdfSxkYXlQZXJpb2RzOnthbTpcIkFNXCIscG06XCJQTVwifX0sY29wdGljOnttb250aHM6e25hcnJvdzpbXCIxXCIsXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCIxMFwiLFwiMTFcIixcIjEyXCIsXCIxM1wiXSxzaG9ydDpbXCJUb3V0XCIsXCJCYWJhXCIsXCJIYXRvclwiLFwiS2lhaGtcIixcIlRvYmFcIixcIkFtc2hpclwiLFwiQmFyYW1oYXRcIixcIkJhcmFtb3VkYVwiLFwiQmFzaGFuc1wiLFwiUGFvbmFcIixcIkVwZXBcIixcIk1lc3JhXCIsXCJOYXNpZVwiXSxsb25nOltcIlRvdXRcIixcIkJhYmFcIixcIkhhdG9yXCIsXCJLaWFoa1wiLFwiVG9iYVwiLFwiQW1zaGlyXCIsXCJCYXJhbWhhdFwiLFwiQmFyYW1vdWRhXCIsXCJCYXNoYW5zXCIsXCJQYW9uYVwiLFwiRXBlcFwiLFwiTWVzcmFcIixcIk5hc2llXCJdfSxkYXlzOntuYXJyb3c6W1wiU1wiLFwiTVwiLFwiVFwiLFwiV1wiLFwiVFwiLFwiRlwiLFwiU1wiXSxzaG9ydDpbXCJTdW5cIixcIk1vblwiLFwiVHVlXCIsXCJXZWRcIixcIlRodVwiLFwiRnJpXCIsXCJTYXRcIl0sbG9uZzpbXCJTdW5kYXlcIixcIk1vbmRheVwiLFwiVHVlc2RheVwiLFwiV2VkbmVzZGF5XCIsXCJUaHVyc2RheVwiLFwiRnJpZGF5XCIsXCJTYXR1cmRheVwiXX0sZXJhczp7bmFycm93OltcIkVSQTBcIixcIkVSQTFcIl0sc2hvcnQ6W1wiRVJBMFwiLFwiRVJBMVwiXSxsb25nOltcIkVSQTBcIixcIkVSQTFcIl19LGRheVBlcmlvZHM6e2FtOlwiQU1cIixwbTpcIlBNXCJ9fSxkYW5naTp7bW9udGhzOntuYXJyb3c6W1wiMVwiLFwiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiMTBcIixcIjExXCIsXCIxMlwiXSxzaG9ydDpbXCJNbzFcIixcIk1vMlwiLFwiTW8zXCIsXCJNbzRcIixcIk1vNVwiLFwiTW82XCIsXCJNbzdcIixcIk1vOFwiLFwiTW85XCIsXCJNbzEwXCIsXCJNbzExXCIsXCJNbzEyXCJdLGxvbmc6W1wiTW9udGgxXCIsXCJNb250aDJcIixcIk1vbnRoM1wiLFwiTW9udGg0XCIsXCJNb250aDVcIixcIk1vbnRoNlwiLFwiTW9udGg3XCIsXCJNb250aDhcIixcIk1vbnRoOVwiLFwiTW9udGgxMFwiLFwiTW9udGgxMVwiLFwiTW9udGgxMlwiXX0sZGF5czp7bmFycm93OltcIlNcIixcIk1cIixcIlRcIixcIldcIixcIlRcIixcIkZcIixcIlNcIl0sc2hvcnQ6W1wiU3VuXCIsXCJNb25cIixcIlR1ZVwiLFwiV2VkXCIsXCJUaHVcIixcIkZyaVwiLFwiU2F0XCJdLGxvbmc6W1wiU3VuZGF5XCIsXCJNb25kYXlcIixcIlR1ZXNkYXlcIixcIldlZG5lc2RheVwiLFwiVGh1cnNkYXlcIixcIkZyaWRheVwiLFwiU2F0dXJkYXlcIl19LGRheVBlcmlvZHM6e2FtOlwiQU1cIixwbTpcIlBNXCJ9fSxldGhpb3BpYzp7bW9udGhzOntuYXJyb3c6W1wiMVwiLFwiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiMTBcIixcIjExXCIsXCIxMlwiLFwiMTNcIl0sc2hvcnQ6W1wiTWVza2VyZW1cIixcIlRla2VtdFwiLFwiSGVkYXJcIixcIlRhaHNhc1wiLFwiVGVyXCIsXCJZZWthdGl0XCIsXCJNZWdhYml0XCIsXCJNaWF6aWFcIixcIkdlbmJvdFwiLFwiU2VuZVwiLFwiSGFtbGVcIixcIk5laGFzc2VcIixcIlBhZ3VtZW5cIl0sbG9uZzpbXCJNZXNrZXJlbVwiLFwiVGVrZW10XCIsXCJIZWRhclwiLFwiVGFoc2FzXCIsXCJUZXJcIixcIllla2F0aXRcIixcIk1lZ2FiaXRcIixcIk1pYXppYVwiLFwiR2VuYm90XCIsXCJTZW5lXCIsXCJIYW1sZVwiLFwiTmVoYXNzZVwiLFwiUGFndW1lblwiXX0sZGF5czp7bmFycm93OltcIlNcIixcIk1cIixcIlRcIixcIldcIixcIlRcIixcIkZcIixcIlNcIl0sc2hvcnQ6W1wiU3VuXCIsXCJNb25cIixcIlR1ZVwiLFwiV2VkXCIsXCJUaHVcIixcIkZyaVwiLFwiU2F0XCJdLGxvbmc6W1wiU3VuZGF5XCIsXCJNb25kYXlcIixcIlR1ZXNkYXlcIixcIldlZG5lc2RheVwiLFwiVGh1cnNkYXlcIixcIkZyaWRheVwiLFwiU2F0dXJkYXlcIl19LGVyYXM6e25hcnJvdzpbXCJFUkEwXCIsXCJFUkExXCJdLHNob3J0OltcIkVSQTBcIixcIkVSQTFcIl0sbG9uZzpbXCJFUkEwXCIsXCJFUkExXCJdfSxkYXlQZXJpb2RzOnthbTpcIkFNXCIscG06XCJQTVwifX0sZXRoaW9hYTp7bW9udGhzOntuYXJyb3c6W1wiMVwiLFwiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiMTBcIixcIjExXCIsXCIxMlwiLFwiMTNcIl0sc2hvcnQ6W1wiTWVza2VyZW1cIixcIlRla2VtdFwiLFwiSGVkYXJcIixcIlRhaHNhc1wiLFwiVGVyXCIsXCJZZWthdGl0XCIsXCJNZWdhYml0XCIsXCJNaWF6aWFcIixcIkdlbmJvdFwiLFwiU2VuZVwiLFwiSGFtbGVcIixcIk5laGFzc2VcIixcIlBhZ3VtZW5cIl0sbG9uZzpbXCJNZXNrZXJlbVwiLFwiVGVrZW10XCIsXCJIZWRhclwiLFwiVGFoc2FzXCIsXCJUZXJcIixcIllla2F0aXRcIixcIk1lZ2FiaXRcIixcIk1pYXppYVwiLFwiR2VuYm90XCIsXCJTZW5lXCIsXCJIYW1sZVwiLFwiTmVoYXNzZVwiLFwiUGFndW1lblwiXX0sZGF5czp7bmFycm93OltcIlNcIixcIk1cIixcIlRcIixcIldcIixcIlRcIixcIkZcIixcIlNcIl0sc2hvcnQ6W1wiU3VuXCIsXCJNb25cIixcIlR1ZVwiLFwiV2VkXCIsXCJUaHVcIixcIkZyaVwiLFwiU2F0XCJdLGxvbmc6W1wiU3VuZGF5XCIsXCJNb25kYXlcIixcIlR1ZXNkYXlcIixcIldlZG5lc2RheVwiLFwiVGh1cnNkYXlcIixcIkZyaWRheVwiLFwiU2F0dXJkYXlcIl19LGVyYXM6e25hcnJvdzpbXCJFUkEwXCJdLHNob3J0OltcIkVSQTBcIl0sbG9uZzpbXCJFUkEwXCJdfSxkYXlQZXJpb2RzOnthbTpcIkFNXCIscG06XCJQTVwifX0sZ2VuZXJpYzp7bW9udGhzOntuYXJyb3c6W1wiMVwiLFwiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiMTBcIixcIjExXCIsXCIxMlwiXSxzaG9ydDpbXCJNMDFcIixcIk0wMlwiLFwiTTAzXCIsXCJNMDRcIixcIk0wNVwiLFwiTTA2XCIsXCJNMDdcIixcIk0wOFwiLFwiTTA5XCIsXCJNMTBcIixcIk0xMVwiLFwiTTEyXCJdLGxvbmc6W1wiTTAxXCIsXCJNMDJcIixcIk0wM1wiLFwiTTA0XCIsXCJNMDVcIixcIk0wNlwiLFwiTTA3XCIsXCJNMDhcIixcIk0wOVwiLFwiTTEwXCIsXCJNMTFcIixcIk0xMlwiXX0sZGF5czp7bmFycm93OltcIlNcIixcIk1cIixcIlRcIixcIldcIixcIlRcIixcIkZcIixcIlNcIl0sc2hvcnQ6W1wiU3VuXCIsXCJNb25cIixcIlR1ZVwiLFwiV2VkXCIsXCJUaHVcIixcIkZyaVwiLFwiU2F0XCJdLGxvbmc6W1wiU3VuZGF5XCIsXCJNb25kYXlcIixcIlR1ZXNkYXlcIixcIldlZG5lc2RheVwiLFwiVGh1cnNkYXlcIixcIkZyaWRheVwiLFwiU2F0dXJkYXlcIl19LGVyYXM6e25hcnJvdzpbXCJFUkEwXCIsXCJFUkExXCJdLHNob3J0OltcIkVSQTBcIixcIkVSQTFcIl0sbG9uZzpbXCJFUkEwXCIsXCJFUkExXCJdfSxkYXlQZXJpb2RzOnthbTpcIkFNXCIscG06XCJQTVwifX0sZ3JlZ29yeTp7bW9udGhzOntuYXJyb3c6W1wiSlwiLFwiRlwiLFwiTVwiLFwiQVwiLFwiTVwiLFwiSlwiLFwiSlwiLFwiQVwiLFwiU1wiLFwiT1wiLFwiTlwiLFwiRFwiXSxzaG9ydDpbXCJKYW5cIixcIkZlYlwiLFwiTWFyXCIsXCJBcHJcIixcIk1heVwiLFwiSnVuXCIsXCJKdWxcIixcIkF1Z1wiLFwiU2VwXCIsXCJPY3RcIixcIk5vdlwiLFwiRGVjXCJdLGxvbmc6W1wiSmFudWFyeVwiLFwiRmVicnVhcnlcIixcIk1hcmNoXCIsXCJBcHJpbFwiLFwiTWF5XCIsXCJKdW5lXCIsXCJKdWx5XCIsXCJBdWd1c3RcIixcIlNlcHRlbWJlclwiLFwiT2N0b2JlclwiLFwiTm92ZW1iZXJcIixcIkRlY2VtYmVyXCJdfSxkYXlzOntuYXJyb3c6W1wiU1wiLFwiTVwiLFwiVFwiLFwiV1wiLFwiVFwiLFwiRlwiLFwiU1wiXSxzaG9ydDpbXCJTdW5cIixcIk1vblwiLFwiVHVlXCIsXCJXZWRcIixcIlRodVwiLFwiRnJpXCIsXCJTYXRcIl0sbG9uZzpbXCJTdW5kYXlcIixcIk1vbmRheVwiLFwiVHVlc2RheVwiLFwiV2VkbmVzZGF5XCIsXCJUaHVyc2RheVwiLFwiRnJpZGF5XCIsXCJTYXR1cmRheVwiXX0sZXJhczp7bmFycm93OltcIkJcIixcIkFcIixcIkJDRVwiLFwiQ0VcIl0sc2hvcnQ6W1wiQkNcIixcIkFEXCIsXCJCQ0VcIixcIkNFXCJdLGxvbmc6W1wiQmVmb3JlIENocmlzdFwiLFwiQW5ubyBEb21pbmlcIixcIkJlZm9yZSBDb21tb24gRXJhXCIsXCJDb21tb24gRXJhXCJdfSxkYXlQZXJpb2RzOnthbTpcIkFNXCIscG06XCJQTVwifX0saGVicmV3Onttb250aHM6e25hcnJvdzpbXCIxXCIsXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCIxMFwiLFwiMTFcIixcIjEyXCIsXCIxM1wiLFwiN1wiXSxzaG9ydDpbXCJUaXNocmlcIixcIkhlc2h2YW5cIixcIktpc2xldlwiLFwiVGV2ZXRcIixcIlNoZXZhdFwiLFwiQWRhciBJXCIsXCJBZGFyXCIsXCJOaXNhblwiLFwiSXlhclwiLFwiU2l2YW5cIixcIlRhbXV6XCIsXCJBdlwiLFwiRWx1bFwiLFwiQWRhciBJSVwiXSxsb25nOltcIlRpc2hyaVwiLFwiSGVzaHZhblwiLFwiS2lzbGV2XCIsXCJUZXZldFwiLFwiU2hldmF0XCIsXCJBZGFyIElcIixcIkFkYXJcIixcIk5pc2FuXCIsXCJJeWFyXCIsXCJTaXZhblwiLFwiVGFtdXpcIixcIkF2XCIsXCJFbHVsXCIsXCJBZGFyIElJXCJdfSxkYXlzOntuYXJyb3c6W1wiU1wiLFwiTVwiLFwiVFwiLFwiV1wiLFwiVFwiLFwiRlwiLFwiU1wiXSxzaG9ydDpbXCJTdW5cIixcIk1vblwiLFwiVHVlXCIsXCJXZWRcIixcIlRodVwiLFwiRnJpXCIsXCJTYXRcIl0sbG9uZzpbXCJTdW5kYXlcIixcIk1vbmRheVwiLFwiVHVlc2RheVwiLFwiV2VkbmVzZGF5XCIsXCJUaHVyc2RheVwiLFwiRnJpZGF5XCIsXCJTYXR1cmRheVwiXX0sZXJhczp7bmFycm93OltcIkFNXCJdLHNob3J0OltcIkFNXCJdLGxvbmc6W1wiQU1cIl19LGRheVBlcmlvZHM6e2FtOlwiQU1cIixwbTpcIlBNXCJ9fSxpbmRpYW46e21vbnRoczp7bmFycm93OltcIjFcIixcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIjEwXCIsXCIxMVwiLFwiMTJcIl0sc2hvcnQ6W1wiQ2hhaXRyYVwiLFwiVmFpc2FraGFcIixcIkp5YWlzdGhhXCIsXCJBc2FkaGFcIixcIlNyYXZhbmFcIixcIkJoYWRyYVwiLFwiQXN2aW5hXCIsXCJLYXJ0aWthXCIsXCJBZ3JhaGF5YW5hXCIsXCJQYXVzYVwiLFwiTWFnaGFcIixcIlBoYWxndW5hXCJdLGxvbmc6W1wiQ2hhaXRyYVwiLFwiVmFpc2FraGFcIixcIkp5YWlzdGhhXCIsXCJBc2FkaGFcIixcIlNyYXZhbmFcIixcIkJoYWRyYVwiLFwiQXN2aW5hXCIsXCJLYXJ0aWthXCIsXCJBZ3JhaGF5YW5hXCIsXCJQYXVzYVwiLFwiTWFnaGFcIixcIlBoYWxndW5hXCJdfSxkYXlzOntuYXJyb3c6W1wiU1wiLFwiTVwiLFwiVFwiLFwiV1wiLFwiVFwiLFwiRlwiLFwiU1wiXSxzaG9ydDpbXCJTdW5cIixcIk1vblwiLFwiVHVlXCIsXCJXZWRcIixcIlRodVwiLFwiRnJpXCIsXCJTYXRcIl0sbG9uZzpbXCJTdW5kYXlcIixcIk1vbmRheVwiLFwiVHVlc2RheVwiLFwiV2VkbmVzZGF5XCIsXCJUaHVyc2RheVwiLFwiRnJpZGF5XCIsXCJTYXR1cmRheVwiXX0sZXJhczp7bmFycm93OltcIlNha2FcIl0sc2hvcnQ6W1wiU2FrYVwiXSxsb25nOltcIlNha2FcIl19LGRheVBlcmlvZHM6e2FtOlwiQU1cIixwbTpcIlBNXCJ9fSxpc2xhbWljOnttb250aHM6e25hcnJvdzpbXCIxXCIsXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCIxMFwiLFwiMTFcIixcIjEyXCJdLHNob3J0OltcIk11aC5cIixcIlNhZi5cIixcIlJhYi4gSVwiLFwiUmFiLiBJSVwiLFwiSnVtLiBJXCIsXCJKdW0uIElJXCIsXCJSYWouXCIsXCJTaGEuXCIsXCJSYW0uXCIsXCJTaGF3LlwiLFwiRGh1yrtsLVEuXCIsXCJEaHXKu2wtSC5cIl0sbG9uZzpbXCJNdWhhcnJhbVwiLFwiU2FmYXJcIixcIlJhYmnKuyBJXCIsXCJSYWJpyrsgSUlcIixcIkp1bWFkYSBJXCIsXCJKdW1hZGEgSUlcIixcIlJhamFiXCIsXCJTaGHKu2JhblwiLFwiUmFtYWRhblwiLFwiU2hhd3dhbFwiLFwiRGh1yrtsLVFpyrtkYWhcIixcIkRodcq7bC1IaWpqYWhcIl19LGRheXM6e25hcnJvdzpbXCJTXCIsXCJNXCIsXCJUXCIsXCJXXCIsXCJUXCIsXCJGXCIsXCJTXCJdLHNob3J0OltcIlN1blwiLFwiTW9uXCIsXCJUdWVcIixcIldlZFwiLFwiVGh1XCIsXCJGcmlcIixcIlNhdFwiXSxsb25nOltcIlN1bmRheVwiLFwiTW9uZGF5XCIsXCJUdWVzZGF5XCIsXCJXZWRuZXNkYXlcIixcIlRodXJzZGF5XCIsXCJGcmlkYXlcIixcIlNhdHVyZGF5XCJdfSxlcmFzOntuYXJyb3c6W1wiQUhcIl0sc2hvcnQ6W1wiQUhcIl0sbG9uZzpbXCJBSFwiXX0sZGF5UGVyaW9kczp7YW06XCJBTVwiLHBtOlwiUE1cIn19LGlzbGFtaWNjOnttb250aHM6e25hcnJvdzpbXCIxXCIsXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCIxMFwiLFwiMTFcIixcIjEyXCJdLHNob3J0OltcIk11aC5cIixcIlNhZi5cIixcIlJhYi4gSVwiLFwiUmFiLiBJSVwiLFwiSnVtLiBJXCIsXCJKdW0uIElJXCIsXCJSYWouXCIsXCJTaGEuXCIsXCJSYW0uXCIsXCJTaGF3LlwiLFwiRGh1yrtsLVEuXCIsXCJEaHXKu2wtSC5cIl0sbG9uZzpbXCJNdWhhcnJhbVwiLFwiU2FmYXJcIixcIlJhYmnKuyBJXCIsXCJSYWJpyrsgSUlcIixcIkp1bWFkYSBJXCIsXCJKdW1hZGEgSUlcIixcIlJhamFiXCIsXCJTaGHKu2JhblwiLFwiUmFtYWRhblwiLFwiU2hhd3dhbFwiLFwiRGh1yrtsLVFpyrtkYWhcIixcIkRodcq7bC1IaWpqYWhcIl19LGRheXM6e25hcnJvdzpbXCJTXCIsXCJNXCIsXCJUXCIsXCJXXCIsXCJUXCIsXCJGXCIsXCJTXCJdLHNob3J0OltcIlN1blwiLFwiTW9uXCIsXCJUdWVcIixcIldlZFwiLFwiVGh1XCIsXCJGcmlcIixcIlNhdFwiXSxsb25nOltcIlN1bmRheVwiLFwiTW9uZGF5XCIsXCJUdWVzZGF5XCIsXCJXZWRuZXNkYXlcIixcIlRodXJzZGF5XCIsXCJGcmlkYXlcIixcIlNhdHVyZGF5XCJdfSxlcmFzOntuYXJyb3c6W1wiQUhcIl0sc2hvcnQ6W1wiQUhcIl0sbG9uZzpbXCJBSFwiXX0sZGF5UGVyaW9kczp7YW06XCJBTVwiLHBtOlwiUE1cIn19LGphcGFuZXNlOnttb250aHM6e25hcnJvdzpbXCJKXCIsXCJGXCIsXCJNXCIsXCJBXCIsXCJNXCIsXCJKXCIsXCJKXCIsXCJBXCIsXCJTXCIsXCJPXCIsXCJOXCIsXCJEXCJdLHNob3J0OltcIkphblwiLFwiRmViXCIsXCJNYXJcIixcIkFwclwiLFwiTWF5XCIsXCJKdW5cIixcIkp1bFwiLFwiQXVnXCIsXCJTZXBcIixcIk9jdFwiLFwiTm92XCIsXCJEZWNcIl0sbG9uZzpbXCJKYW51YXJ5XCIsXCJGZWJydWFyeVwiLFwiTWFyY2hcIixcIkFwcmlsXCIsXCJNYXlcIixcIkp1bmVcIixcIkp1bHlcIixcIkF1Z3VzdFwiLFwiU2VwdGVtYmVyXCIsXCJPY3RvYmVyXCIsXCJOb3ZlbWJlclwiLFwiRGVjZW1iZXJcIl19LGRheXM6e25hcnJvdzpbXCJTXCIsXCJNXCIsXCJUXCIsXCJXXCIsXCJUXCIsXCJGXCIsXCJTXCJdLHNob3J0OltcIlN1blwiLFwiTW9uXCIsXCJUdWVcIixcIldlZFwiLFwiVGh1XCIsXCJGcmlcIixcIlNhdFwiXSxsb25nOltcIlN1bmRheVwiLFwiTW9uZGF5XCIsXCJUdWVzZGF5XCIsXCJXZWRuZXNkYXlcIixcIlRodXJzZGF5XCIsXCJGcmlkYXlcIixcIlNhdHVyZGF5XCJdfSxlcmFzOntuYXJyb3c6W1wiVGFpa2EgKDY0NeKAkzY1MClcIixcIkhha3VjaGkgKDY1MOKAkzY3MSlcIixcIkhha3VoxY0gKDY3MuKAkzY4NilcIixcIlNodWNoxY0gKDY4NuKAkzcwMSlcIixcIlRhaWjFjSAoNzAx4oCTNzA0KVwiLFwiS2VpdW4gKDcwNOKAkzcwOClcIixcIldhZMWNICg3MDjigJM3MTUpXCIsXCJSZWlraSAoNzE14oCTNzE3KVwiLFwiWcWNcsWNICg3MTfigJM3MjQpXCIsXCJKaW5raSAoNzI04oCTNzI5KVwiLFwiVGVucHnFjSAoNzI54oCTNzQ5KVwiLFwiVGVucHnFjS1rYW1wxY0gKDc0OS03NDkpXCIsXCJUZW5wecWNLXNoxY1oxY0gKDc0OS03NTcpXCIsXCJUZW5wecWNLWjFjWppICg3NTctNzY1KVwiLFwiVGVucHnFjS1qaW5nbyAoNzY1LTc2NylcIixcIkppbmdvLWtlaXVuICg3NjctNzcwKVwiLFwiSMWNa2kgKDc3MOKAkzc4MClcIixcIlRlbi3FjSAoNzgxLTc4MilcIixcIkVucnlha3UgKDc4MuKAkzgwNilcIixcIkRhaWTFjSAoODA24oCTODEwKVwiLFwiS8WNbmluICg4MTDigJM4MjQpXCIsXCJUZW5jaMWNICg4MjTigJM4MzQpXCIsXCJKxY13YSAoODM04oCTODQ4KVwiLFwiS2FqxY0gKDg0OOKAkzg1MSlcIixcIk5pbmp1ICg4NTHigJM4NTQpXCIsXCJTYWlrxY0gKDg1NOKAkzg1NylcIixcIlRlbi1hbiAoODU3LTg1OSlcIixcIkrFjWdhbiAoODU54oCTODc3KVwiLFwiR2FuZ3nFjSAoODc34oCTODg1KVwiLFwiTmlubmEgKDg4NeKAkzg4OSlcIixcIkthbnB5xY0gKDg4OeKAkzg5OClcIixcIlNoxY10YWkgKDg5OOKAkzkwMSlcIixcIkVuZ2kgKDkwMeKAkzkyMylcIixcIkVuY2jFjSAoOTIz4oCTOTMxKVwiLFwiSsWNaGVpICg5MzHigJM5MzgpXCIsXCJUZW5necWNICg5MzjigJM5NDcpXCIsXCJUZW5yeWFrdSAoOTQ34oCTOTU3KVwiLFwiVGVudG9rdSAoOTU34oCTOTYxKVwiLFwixYx3YSAoOTYx4oCTOTY0KVwiLFwiS8WNaMWNICg5NjTigJM5NjgpXCIsXCJBbm5hICg5NjjigJM5NzApXCIsXCJUZW5yb2t1ICg5NzDigJM5NzMpXCIsXCJUZW7igJllbiAoOTcz4oCTOTc2KVwiLFwiSsWNZ2VuICg5NzbigJM5NzgpXCIsXCJUZW5nZW4gKDk3OOKAkzk4MylcIixcIkVpa2FuICg5ODPigJM5ODUpXCIsXCJLYW5uYSAoOTg14oCTOTg3KVwiLFwiRWllbiAoOTg34oCTOTg5KVwiLFwiRWlzbyAoOTg54oCTOTkwKVwiLFwiU2jFjXJ5YWt1ICg5OTDigJM5OTUpXCIsXCJDaMWNdG9rdSAoOTk14oCTOTk5KVwiLFwiQ2jFjWjFjSAoOTk54oCTMTAwNClcIixcIkthbmvFjSAoMTAwNOKAkzEwMTIpXCIsXCJDaMWNd2EgKDEwMTLigJMxMDE3KVwiLFwiS2FubmluICgxMDE34oCTMTAyMSlcIixcIkppYW4gKDEwMjHigJMxMDI0KVwiLFwiTWFuanUgKDEwMjTigJMxMDI4KVwiLFwiQ2jFjWdlbiAoMTAyOOKAkzEwMzcpXCIsXCJDaMWNcnlha3UgKDEwMzfigJMxMDQwKVwiLFwiQ2jFjWt5xasgKDEwNDDigJMxMDQ0KVwiLFwiS2FudG9rdSAoMTA0NOKAkzEwNDYpXCIsXCJFaXNoxY0gKDEwNDbigJMxMDUzKVwiLFwiVGVuZ2kgKDEwNTPigJMxMDU4KVwiLFwiS8WNaGVpICgxMDU44oCTMTA2NSlcIixcIkppcnlha3UgKDEwNjXigJMxMDY5KVwiLFwiRW5recWrICgxMDY54oCTMTA3NClcIixcIlNoxY1obyAoMTA3NOKAkzEwNzcpXCIsXCJTaMWNcnlha3UgKDEwNzfigJMxMDgxKVwiLFwiRWloxY0gKDEwODHigJMxMDg0KVwiLFwixYx0b2t1ICgxMDg04oCTMTA4NylcIixcIkthbmppICgxMDg34oCTMTA5NClcIixcIkthaMWNICgxMDk04oCTMTA5NilcIixcIkVpY2jFjSAoMTA5NuKAkzEwOTcpXCIsXCJKxY10b2t1ICgxMDk34oCTMTA5OSlcIixcIkvFjXdhICgxMDk54oCTMTEwNClcIixcIkNoxY1qaSAoMTEwNOKAkzExMDYpXCIsXCJLYXNoxY0gKDExMDbigJMxMTA4KVwiLFwiVGVubmluICgxMTA44oCTMTExMClcIixcIlRlbi1laSAoMTExMC0xMTEzKVwiLFwiRWlrecWrICgxMTEz4oCTMTExOClcIixcIkdlbuKAmWVpICgxMTE44oCTMTEyMClcIixcIkjFjWFuICgxMTIw4oCTMTEyNClcIixcIlRlbmppICgxMTI04oCTMTEyNilcIixcIkRhaWppICgxMTI24oCTMTEzMSlcIixcIlRlbnNoxY0gKDExMzHigJMxMTMyKVwiLFwiQ2jFjXNoxY0gKDExMzLigJMxMTM1KVwiLFwiSMWNZW4gKDExMzXigJMxMTQxKVwiLFwiRWlqaSAoMTE0MeKAkzExNDIpXCIsXCJLxY1qaSAoMTE0MuKAkzExNDQpXCIsXCJUZW7igJl5xY0gKDExNDTigJMxMTQ1KVwiLFwiS3nFq2FuICgxMTQ14oCTMTE1MSlcIixcIk5pbnBlaSAoMTE1MeKAkzExNTQpXCIsXCJLecWranUgKDExNTTigJMxMTU2KVwiLFwiSMWNZ2VuICgxMTU24oCTMTE1OSlcIixcIkhlaWppICgxMTU54oCTMTE2MClcIixcIkVpcnlha3UgKDExNjDigJMxMTYxKVwiLFwixYxobyAoMTE2MeKAkzExNjMpXCIsXCJDaMWNa2FuICgxMTYz4oCTMTE2NSlcIixcIkVpbWFuICgxMTY14oCTMTE2NilcIixcIk5pbuKAmWFuICgxMTY24oCTMTE2OSlcIixcIkthxY0gKDExNjnigJMxMTcxKVwiLFwiU2jFjWFuICgxMTcx4oCTMTE3NSlcIixcIkFuZ2VuICgxMTc14oCTMTE3NylcIixcIkppc2jFjSAoMTE3N+KAkzExODEpXCIsXCJZxY13YSAoMTE4MeKAkzExODIpXCIsXCJKdWVpICgxMTgy4oCTMTE4NClcIixcIkdlbnJ5YWt1ICgxMTg04oCTMTE4NSlcIixcIkJ1bmppICgxMTg14oCTMTE5MClcIixcIktlbmt5xasgKDExOTDigJMxMTk5KVwiLFwiU2jFjWppICgxMTk54oCTMTIwMSlcIixcIktlbm5pbiAoMTIwMeKAkzEyMDQpXCIsXCJHZW5recWrICgxMjA04oCTMTIwNilcIixcIktlbuKAmWVpICgxMjA24oCTMTIwNylcIixcIkrFjWdlbiAoMTIwN+KAkzEyMTEpXCIsXCJLZW5yeWFrdSAoMTIxMeKAkzEyMTMpXCIsXCJLZW5wxY0gKDEyMTPigJMxMjE5KVwiLFwiSsWNa3nFqyAoMTIxOeKAkzEyMjIpXCIsXCJKxY3FjSAoMTIyMuKAkzEyMjQpXCIsXCJHZW5uaW4gKDEyMjTigJMxMjI1KVwiLFwiS2Fyb2t1ICgxMjI14oCTMTIyNylcIixcIkFudGVpICgxMjI34oCTMTIyOSlcIixcIkthbmtpICgxMjI54oCTMTIzMilcIixcIkrFjWVpICgxMjMy4oCTMTIzMylcIixcIlRlbnB1a3UgKDEyMzPigJMxMjM0KVwiLFwiQnVucnlha3UgKDEyMzTigJMxMjM1KVwiLFwiS2F0ZWkgKDEyMzXigJMxMjM4KVwiLFwiUnlha3VuaW4gKDEyMzjigJMxMjM5KVwiLFwiRW7igJnFjSAoMTIzOeKAkzEyNDApXCIsXCJOaW5qaSAoMTI0MOKAkzEyNDMpXCIsXCJLYW5nZW4gKDEyNDPigJMxMjQ3KVwiLFwiSMWNamkgKDEyNDfigJMxMjQ5KVwiLFwiS2VuY2jFjSAoMTI0OeKAkzEyNTYpXCIsXCJLxY1nZW4gKDEyNTbigJMxMjU3KVwiLFwiU2jFjWthICgxMjU34oCTMTI1OSlcIixcIlNoxY1nZW4gKDEyNTnigJMxMjYwKVwiLFwiQnVu4oCZxY0gKDEyNjDigJMxMjYxKVwiLFwiS8WNY2jFjSAoMTI2MeKAkzEyNjQpXCIsXCJCdW7igJllaSAoMTI2NOKAkzEyNzUpXCIsXCJLZW5qaSAoMTI3NeKAkzEyNzgpXCIsXCJLxY1hbiAoMTI3OOKAkzEyODgpXCIsXCJTaMWNxY0gKDEyODjigJMxMjkzKVwiLFwiRWluaW4gKDEyOTPigJMxMjk5KVwiLFwiU2jFjWFuICgxMjk54oCTMTMwMilcIixcIktlbmdlbiAoMTMwMuKAkzEzMDMpXCIsXCJLYWdlbiAoMTMwM+KAkzEzMDYpXCIsXCJUb2t1amkgKDEzMDbigJMxMzA4KVwiLFwiRW5recWNICgxMzA44oCTMTMxMSlcIixcIsWMY2jFjSAoMTMxMeKAkzEzMTIpXCIsXCJTaMWNd2EgKDEzMTLigJMxMzE3KVwiLFwiQnVucMWNICgxMzE34oCTMTMxOSlcIixcIkdlbsWNICgxMzE54oCTMTMyMSlcIixcIkdlbmvFjSAoMTMyMeKAkzEzMjQpXCIsXCJTaMWNY2jFqyAoMTMyNOKAkzEzMjYpXCIsXCJLYXJ5YWt1ICgxMzI24oCTMTMyOSlcIixcIkdlbnRva3UgKDEzMjnigJMxMzMxKVwiLFwiR2Vua8WNICgxMzMx4oCTMTMzNClcIixcIktlbm11ICgxMzM04oCTMTMzNilcIixcIkVuZ2VuICgxMzM24oCTMTM0MClcIixcIkvFjWtva3UgKDEzNDDigJMxMzQ2KVwiLFwiU2jFjWhlaSAoMTM0NuKAkzEzNzApXCIsXCJLZW50b2t1ICgxMzcw4oCTMTM3MilcIixcIkJ1bmNoxasgKDEzNzLigJMxMzc1KVwiLFwiVGVuanUgKDEzNzXigJMxMzc5KVwiLFwiS8WNcnlha3UgKDEzNznigJMxMzgxKVwiLFwiS8WNd2EgKDEzODHigJMxMzg0KVwiLFwiR2VuY2jFqyAoMTM4NOKAkzEzOTIpXCIsXCJNZWl0b2t1ICgxMzg04oCTMTM4NylcIixcIktha2VpICgxMzg34oCTMTM4OSlcIixcIkvFjcWNICgxMzg54oCTMTM5MClcIixcIk1laXRva3UgKDEzOTDigJMxMzk0KVwiLFwixYxlaSAoMTM5NOKAkzE0MjgpXCIsXCJTaMWNY2jFjSAoMTQyOOKAkzE0MjkpXCIsXCJFaWt5xY0gKDE0MjnigJMxNDQxKVwiLFwiS2FraXRzdSAoMTQ0MeKAkzE0NDQpXCIsXCJCdW7igJlhbiAoMTQ0NOKAkzE0NDkpXCIsXCJIxY10b2t1ICgxNDQ54oCTMTQ1MilcIixcIkt5xY10b2t1ICgxNDUy4oCTMTQ1NSlcIixcIkvFjXNoxY0gKDE0NTXigJMxNDU3KVwiLFwiQ2jFjXJva3UgKDE0NTfigJMxNDYwKVwiLFwiS2Fuc2jFjSAoMTQ2MOKAkzE0NjYpXCIsXCJCdW5zaMWNICgxNDY24oCTMTQ2NylcIixcIsWMbmluICgxNDY34oCTMTQ2OSlcIixcIkJ1bm1laSAoMTQ2OeKAkzE0ODcpXCIsXCJDaMWNa3nFjSAoMTQ4N+KAkzE0ODkpXCIsXCJFbnRva3UgKDE0ODnigJMxNDkyKVwiLFwiTWVpxY0gKDE0OTLigJMxNTAxKVwiLFwiQnVua2kgKDE1MDHigJMxNTA0KVwiLFwiRWlzaMWNICgxNTA04oCTMTUyMSlcIixcIlRhaWVpICgxNTIx4oCTMTUyOClcIixcIkt5xY1yb2t1ICgxNTI44oCTMTUzMilcIixcIlRlbmJ1biAoMTUzMuKAkzE1NTUpXCIsXCJLxY1qaSAoMTU1NeKAkzE1NTgpXCIsXCJFaXJva3UgKDE1NTjigJMxNTcwKVwiLFwiR2Vua2kgKDE1NzDigJMxNTczKVwiLFwiVGVuc2jFjSAoMTU3M+KAkzE1OTIpXCIsXCJCdW5yb2t1ICgxNTky4oCTMTU5NilcIixcIktlaWNoxY0gKDE1OTbigJMxNjE1KVwiLFwiR2VubmEgKDE2MTXigJMxNjI0KVwiLFwiS2Fu4oCZZWkgKDE2MjTigJMxNjQ0KVwiLFwiU2jFjWhvICgxNjQ04oCTMTY0OClcIixcIktlaWFuICgxNjQ44oCTMTY1MilcIixcIkrFjcWNICgxNjUy4oCTMTY1NSlcIixcIk1laXJla2kgKDE2NTXigJMxNjU4KVwiLFwiTWFuamkgKDE2NTjigJMxNjYxKVwiLFwiS2FuYnVuICgxNjYx4oCTMTY3MylcIixcIkVucMWNICgxNjcz4oCTMTY4MSlcIixcIlRlbm5hICgxNjgx4oCTMTY4NClcIixcIkrFjWt5xY0gKDE2ODTigJMxNjg4KVwiLFwiR2Vucm9rdSAoMTY4OOKAkzE3MDQpXCIsXCJIxY1laSAoMTcwNOKAkzE3MTEpXCIsXCJTaMWNdG9rdSAoMTcxMeKAkzE3MTYpXCIsXCJLecWNaMWNICgxNzE24oCTMTczNilcIixcIkdlbmJ1biAoMTczNuKAkzE3NDEpXCIsXCJLYW5wxY0gKDE3NDHigJMxNzQ0KVwiLFwiRW5recWNICgxNzQ04oCTMTc0OClcIixcIkthbuKAmWVuICgxNzQ44oCTMTc1MSlcIixcIkjFjXJla2kgKDE3NTHigJMxNzY0KVwiLFwiTWVpd2EgKDE3NjTigJMxNzcyKVwiLFwiQW7igJllaSAoMTc3MuKAkzE3ODEpXCIsXCJUZW5tZWkgKDE3ODHigJMxNzg5KVwiLFwiS2Fuc2VpICgxNzg54oCTMTgwMSlcIixcIkt5xY13YSAoMTgwMeKAkzE4MDQpXCIsXCJCdW5rYSAoMTgwNOKAkzE4MTgpXCIsXCJCdW5zZWkgKDE4MTjigJMxODMwKVwiLFwiVGVucMWNICgxODMw4oCTMTg0NClcIixcIkvFjWthICgxODQ04oCTMTg0OClcIixcIkthZWkgKDE4NDjigJMxODU0KVwiLFwiQW5zZWkgKDE4NTTigJMxODYwKVwiLFwiTWFu4oCZZW4gKDE4NjDigJMxODYxKVwiLFwiQnVua3nFqyAoMTg2MeKAkzE4NjQpXCIsXCJHZW5qaSAoMTg2NOKAkzE4NjUpXCIsXCJLZWnFjSAoMTg2NeKAkzE4NjgpXCIsXCJNXCIsXCJUXCIsXCJTXCIsXCJIXCJdLHNob3J0OltcIlRhaWthICg2NDXigJM2NTApXCIsXCJIYWt1Y2hpICg2NTDigJM2NzEpXCIsXCJIYWt1aMWNICg2NzLigJM2ODYpXCIsXCJTaHVjaMWNICg2ODbigJM3MDEpXCIsXCJUYWloxY0gKDcwMeKAkzcwNClcIixcIktlaXVuICg3MDTigJM3MDgpXCIsXCJXYWTFjSAoNzA44oCTNzE1KVwiLFwiUmVpa2kgKDcxNeKAkzcxNylcIixcIlnFjXLFjSAoNzE34oCTNzI0KVwiLFwiSmlua2kgKDcyNOKAkzcyOSlcIixcIlRlbnB5xY0gKDcyOeKAkzc0OSlcIixcIlRlbnB5xY0ta2FtcMWNICg3NDktNzQ5KVwiLFwiVGVucHnFjS1zaMWNaMWNICg3NDktNzU3KVwiLFwiVGVucHnFjS1oxY1qaSAoNzU3LTc2NSlcIixcIlRlbnB5xY0tamluZ28gKDc2NS03NjcpXCIsXCJKaW5nby1rZWl1biAoNzY3LTc3MClcIixcIkjFjWtpICg3NzDigJM3ODApXCIsXCJUZW4txY0gKDc4MS03ODIpXCIsXCJFbnJ5YWt1ICg3ODLigJM4MDYpXCIsXCJEYWlkxY0gKDgwNuKAkzgxMClcIixcIkvFjW5pbiAoODEw4oCTODI0KVwiLFwiVGVuY2jFjSAoODI04oCTODM0KVwiLFwiSsWNd2EgKDgzNOKAkzg0OClcIixcIkthasWNICg4NDjigJM4NTEpXCIsXCJOaW5qdSAoODUx4oCTODU0KVwiLFwiU2Fpa8WNICg4NTTigJM4NTcpXCIsXCJUZW4tYW4gKDg1Ny04NTkpXCIsXCJKxY1nYW4gKDg1OeKAkzg3NylcIixcIkdhbmd5xY0gKDg3N+KAkzg4NSlcIixcIk5pbm5hICg4ODXigJM4ODkpXCIsXCJLYW5wecWNICg4ODnigJM4OTgpXCIsXCJTaMWNdGFpICg4OTjigJM5MDEpXCIsXCJFbmdpICg5MDHigJM5MjMpXCIsXCJFbmNoxY0gKDkyM+KAkzkzMSlcIixcIkrFjWhlaSAoOTMx4oCTOTM4KVwiLFwiVGVuZ3nFjSAoOTM44oCTOTQ3KVwiLFwiVGVucnlha3UgKDk0N+KAkzk1NylcIixcIlRlbnRva3UgKDk1N+KAkzk2MSlcIixcIsWMd2EgKDk2MeKAkzk2NClcIixcIkvFjWjFjSAoOTY04oCTOTY4KVwiLFwiQW5uYSAoOTY44oCTOTcwKVwiLFwiVGVucm9rdSAoOTcw4oCTOTczKVwiLFwiVGVu4oCZZW4gKDk3M+KAkzk3NilcIixcIkrFjWdlbiAoOTc24oCTOTc4KVwiLFwiVGVuZ2VuICg5NzjigJM5ODMpXCIsXCJFaWthbiAoOTgz4oCTOTg1KVwiLFwiS2FubmEgKDk4NeKAkzk4NylcIixcIkVpZW4gKDk4N+KAkzk4OSlcIixcIkVpc28gKDk4OeKAkzk5MClcIixcIlNoxY1yeWFrdSAoOTkw4oCTOTk1KVwiLFwiQ2jFjXRva3UgKDk5NeKAkzk5OSlcIixcIkNoxY1oxY0gKDk5OeKAkzEwMDQpXCIsXCJLYW5rxY0gKDEwMDTigJMxMDEyKVwiLFwiQ2jFjXdhICgxMDEy4oCTMTAxNylcIixcIkthbm5pbiAoMTAxN+KAkzEwMjEpXCIsXCJKaWFuICgxMDIx4oCTMTAyNClcIixcIk1hbmp1ICgxMDI04oCTMTAyOClcIixcIkNoxY1nZW4gKDEwMjjigJMxMDM3KVwiLFwiQ2jFjXJ5YWt1ICgxMDM34oCTMTA0MClcIixcIkNoxY1recWrICgxMDQw4oCTMTA0NClcIixcIkthbnRva3UgKDEwNDTigJMxMDQ2KVwiLFwiRWlzaMWNICgxMDQ24oCTMTA1MylcIixcIlRlbmdpICgxMDUz4oCTMTA1OClcIixcIkvFjWhlaSAoMTA1OOKAkzEwNjUpXCIsXCJKaXJ5YWt1ICgxMDY14oCTMTA2OSlcIixcIkVua3nFqyAoMTA2OeKAkzEwNzQpXCIsXCJTaMWNaG8gKDEwNzTigJMxMDc3KVwiLFwiU2jFjXJ5YWt1ICgxMDc34oCTMTA4MSlcIixcIkVpaMWNICgxMDgx4oCTMTA4NClcIixcIsWMdG9rdSAoMTA4NOKAkzEwODcpXCIsXCJLYW5qaSAoMTA4N+KAkzEwOTQpXCIsXCJLYWjFjSAoMTA5NOKAkzEwOTYpXCIsXCJFaWNoxY0gKDEwOTbigJMxMDk3KVwiLFwiSsWNdG9rdSAoMTA5N+KAkzEwOTkpXCIsXCJLxY13YSAoMTA5OeKAkzExMDQpXCIsXCJDaMWNamkgKDExMDTigJMxMTA2KVwiLFwiS2FzaMWNICgxMTA24oCTMTEwOClcIixcIlRlbm5pbiAoMTEwOOKAkzExMTApXCIsXCJUZW4tZWkgKDExMTAtMTExMylcIixcIkVpa3nFqyAoMTExM+KAkzExMTgpXCIsXCJHZW7igJllaSAoMTExOOKAkzExMjApXCIsXCJIxY1hbiAoMTEyMOKAkzExMjQpXCIsXCJUZW5qaSAoMTEyNOKAkzExMjYpXCIsXCJEYWlqaSAoMTEyNuKAkzExMzEpXCIsXCJUZW5zaMWNICgxMTMx4oCTMTEzMilcIixcIkNoxY1zaMWNICgxMTMy4oCTMTEzNSlcIixcIkjFjWVuICgxMTM14oCTMTE0MSlcIixcIkVpamkgKDExNDHigJMxMTQyKVwiLFwiS8WNamkgKDExNDLigJMxMTQ0KVwiLFwiVGVu4oCZecWNICgxMTQ04oCTMTE0NSlcIixcIkt5xathbiAoMTE0NeKAkzExNTEpXCIsXCJOaW5wZWkgKDExNTHigJMxMTU0KVwiLFwiS3nFq2p1ICgxMTU04oCTMTE1NilcIixcIkjFjWdlbiAoMTE1NuKAkzExNTkpXCIsXCJIZWlqaSAoMTE1OeKAkzExNjApXCIsXCJFaXJ5YWt1ICgxMTYw4oCTMTE2MSlcIixcIsWMaG8gKDExNjHigJMxMTYzKVwiLFwiQ2jFjWthbiAoMTE2M+KAkzExNjUpXCIsXCJFaW1hbiAoMTE2NeKAkzExNjYpXCIsXCJOaW7igJlhbiAoMTE2NuKAkzExNjkpXCIsXCJLYcWNICgxMTY54oCTMTE3MSlcIixcIlNoxY1hbiAoMTE3MeKAkzExNzUpXCIsXCJBbmdlbiAoMTE3NeKAkzExNzcpXCIsXCJKaXNoxY0gKDExNzfigJMxMTgxKVwiLFwiWcWNd2EgKDExODHigJMxMTgyKVwiLFwiSnVlaSAoMTE4MuKAkzExODQpXCIsXCJHZW5yeWFrdSAoMTE4NOKAkzExODUpXCIsXCJCdW5qaSAoMTE4NeKAkzExOTApXCIsXCJLZW5recWrICgxMTkw4oCTMTE5OSlcIixcIlNoxY1qaSAoMTE5OeKAkzEyMDEpXCIsXCJLZW5uaW4gKDEyMDHigJMxMjA0KVwiLFwiR2Vua3nFqyAoMTIwNOKAkzEyMDYpXCIsXCJLZW7igJllaSAoMTIwNuKAkzEyMDcpXCIsXCJKxY1nZW4gKDEyMDfigJMxMjExKVwiLFwiS2Vucnlha3UgKDEyMTHigJMxMjEzKVwiLFwiS2VucMWNICgxMjEz4oCTMTIxOSlcIixcIkrFjWt5xasgKDEyMTnigJMxMjIyKVwiLFwiSsWNxY0gKDEyMjLigJMxMjI0KVwiLFwiR2VubmluICgxMjI04oCTMTIyNSlcIixcIkthcm9rdSAoMTIyNeKAkzEyMjcpXCIsXCJBbnRlaSAoMTIyN+KAkzEyMjkpXCIsXCJLYW5raSAoMTIyOeKAkzEyMzIpXCIsXCJKxY1laSAoMTIzMuKAkzEyMzMpXCIsXCJUZW5wdWt1ICgxMjMz4oCTMTIzNClcIixcIkJ1bnJ5YWt1ICgxMjM04oCTMTIzNSlcIixcIkthdGVpICgxMjM14oCTMTIzOClcIixcIlJ5YWt1bmluICgxMjM44oCTMTIzOSlcIixcIkVu4oCZxY0gKDEyMznigJMxMjQwKVwiLFwiTmluamkgKDEyNDDigJMxMjQzKVwiLFwiS2FuZ2VuICgxMjQz4oCTMTI0NylcIixcIkjFjWppICgxMjQ34oCTMTI0OSlcIixcIktlbmNoxY0gKDEyNDnigJMxMjU2KVwiLFwiS8WNZ2VuICgxMjU24oCTMTI1NylcIixcIlNoxY1rYSAoMTI1N+KAkzEyNTkpXCIsXCJTaMWNZ2VuICgxMjU54oCTMTI2MClcIixcIkJ1buKAmcWNICgxMjYw4oCTMTI2MSlcIixcIkvFjWNoxY0gKDEyNjHigJMxMjY0KVwiLFwiQnVu4oCZZWkgKDEyNjTigJMxMjc1KVwiLFwiS2VuamkgKDEyNzXigJMxMjc4KVwiLFwiS8WNYW4gKDEyNzjigJMxMjg4KVwiLFwiU2jFjcWNICgxMjg44oCTMTI5MylcIixcIkVpbmluICgxMjkz4oCTMTI5OSlcIixcIlNoxY1hbiAoMTI5OeKAkzEzMDIpXCIsXCJLZW5nZW4gKDEzMDLigJMxMzAzKVwiLFwiS2FnZW4gKDEzMDPigJMxMzA2KVwiLFwiVG9rdWppICgxMzA24oCTMTMwOClcIixcIkVua3nFjSAoMTMwOOKAkzEzMTEpXCIsXCLFjGNoxY0gKDEzMTHigJMxMzEyKVwiLFwiU2jFjXdhICgxMzEy4oCTMTMxNylcIixcIkJ1bnDFjSAoMTMxN+KAkzEzMTkpXCIsXCJHZW7FjSAoMTMxOeKAkzEzMjEpXCIsXCJHZW5rxY0gKDEzMjHigJMxMzI0KVwiLFwiU2jFjWNoxasgKDEzMjTigJMxMzI2KVwiLFwiS2FyeWFrdSAoMTMyNuKAkzEzMjkpXCIsXCJHZW50b2t1ICgxMzI54oCTMTMzMSlcIixcIkdlbmvFjSAoMTMzMeKAkzEzMzQpXCIsXCJLZW5tdSAoMTMzNOKAkzEzMzYpXCIsXCJFbmdlbiAoMTMzNuKAkzEzNDApXCIsXCJLxY1rb2t1ICgxMzQw4oCTMTM0NilcIixcIlNoxY1oZWkgKDEzNDbigJMxMzcwKVwiLFwiS2VudG9rdSAoMTM3MOKAkzEzNzIpXCIsXCJCdW5jaMWrICgxMzcy4oCTMTM3NSlcIixcIlRlbmp1ICgxMzc14oCTMTM3OSlcIixcIkvFjXJ5YWt1ICgxMzc54oCTMTM4MSlcIixcIkvFjXdhICgxMzgx4oCTMTM4NClcIixcIkdlbmNoxasgKDEzODTigJMxMzkyKVwiLFwiTWVpdG9rdSAoMTM4NOKAkzEzODcpXCIsXCJLYWtlaSAoMTM4N+KAkzEzODkpXCIsXCJLxY3FjSAoMTM4OeKAkzEzOTApXCIsXCJNZWl0b2t1ICgxMzkw4oCTMTM5NClcIixcIsWMZWkgKDEzOTTigJMxNDI4KVwiLFwiU2jFjWNoxY0gKDE0MjjigJMxNDI5KVwiLFwiRWlrecWNICgxNDI54oCTMTQ0MSlcIixcIktha2l0c3UgKDE0NDHigJMxNDQ0KVwiLFwiQnVu4oCZYW4gKDE0NDTigJMxNDQ5KVwiLFwiSMWNdG9rdSAoMTQ0OeKAkzE0NTIpXCIsXCJLecWNdG9rdSAoMTQ1MuKAkzE0NTUpXCIsXCJLxY1zaMWNICgxNDU14oCTMTQ1NylcIixcIkNoxY1yb2t1ICgxNDU34oCTMTQ2MClcIixcIkthbnNoxY0gKDE0NjDigJMxNDY2KVwiLFwiQnVuc2jFjSAoMTQ2NuKAkzE0NjcpXCIsXCLFjG5pbiAoMTQ2N+KAkzE0NjkpXCIsXCJCdW5tZWkgKDE0NjnigJMxNDg3KVwiLFwiQ2jFjWt5xY0gKDE0ODfigJMxNDg5KVwiLFwiRW50b2t1ICgxNDg54oCTMTQ5MilcIixcIk1lacWNICgxNDky4oCTMTUwMSlcIixcIkJ1bmtpICgxNTAx4oCTMTUwNClcIixcIkVpc2jFjSAoMTUwNOKAkzE1MjEpXCIsXCJUYWllaSAoMTUyMeKAkzE1MjgpXCIsXCJLecWNcm9rdSAoMTUyOOKAkzE1MzIpXCIsXCJUZW5idW4gKDE1MzLigJMxNTU1KVwiLFwiS8WNamkgKDE1NTXigJMxNTU4KVwiLFwiRWlyb2t1ICgxNTU44oCTMTU3MClcIixcIkdlbmtpICgxNTcw4oCTMTU3MylcIixcIlRlbnNoxY0gKDE1NzPigJMxNTkyKVwiLFwiQnVucm9rdSAoMTU5MuKAkzE1OTYpXCIsXCJLZWljaMWNICgxNTk24oCTMTYxNSlcIixcIkdlbm5hICgxNjE14oCTMTYyNClcIixcIkthbuKAmWVpICgxNjI04oCTMTY0NClcIixcIlNoxY1obyAoMTY0NOKAkzE2NDgpXCIsXCJLZWlhbiAoMTY0OOKAkzE2NTIpXCIsXCJKxY3FjSAoMTY1MuKAkzE2NTUpXCIsXCJNZWlyZWtpICgxNjU14oCTMTY1OClcIixcIk1hbmppICgxNjU44oCTMTY2MSlcIixcIkthbmJ1biAoMTY2MeKAkzE2NzMpXCIsXCJFbnDFjSAoMTY3M+KAkzE2ODEpXCIsXCJUZW5uYSAoMTY4MeKAkzE2ODQpXCIsXCJKxY1recWNICgxNjg04oCTMTY4OClcIixcIkdlbnJva3UgKDE2ODjigJMxNzA0KVwiLFwiSMWNZWkgKDE3MDTigJMxNzExKVwiLFwiU2jFjXRva3UgKDE3MTHigJMxNzE2KVwiLFwiS3nFjWjFjSAoMTcxNuKAkzE3MzYpXCIsXCJHZW5idW4gKDE3MzbigJMxNzQxKVwiLFwiS2FucMWNICgxNzQx4oCTMTc0NClcIixcIkVua3nFjSAoMTc0NOKAkzE3NDgpXCIsXCJLYW7igJllbiAoMTc0OOKAkzE3NTEpXCIsXCJIxY1yZWtpICgxNzUx4oCTMTc2NClcIixcIk1laXdhICgxNzY04oCTMTc3MilcIixcIkFu4oCZZWkgKDE3NzLigJMxNzgxKVwiLFwiVGVubWVpICgxNzgx4oCTMTc4OSlcIixcIkthbnNlaSAoMTc4OeKAkzE4MDEpXCIsXCJLecWNd2EgKDE4MDHigJMxODA0KVwiLFwiQnVua2EgKDE4MDTigJMxODE4KVwiLFwiQnVuc2VpICgxODE44oCTMTgzMClcIixcIlRlbnDFjSAoMTgzMOKAkzE4NDQpXCIsXCJLxY1rYSAoMTg0NOKAkzE4NDgpXCIsXCJLYWVpICgxODQ44oCTMTg1NClcIixcIkFuc2VpICgxODU04oCTMTg2MClcIixcIk1hbuKAmWVuICgxODYw4oCTMTg2MSlcIixcIkJ1bmt5xasgKDE4NjHigJMxODY0KVwiLFwiR2VuamkgKDE4NjTigJMxODY1KVwiLFwiS2VpxY0gKDE4NjXigJMxODY4KVwiLFwiTWVpamlcIixcIlRhaXNoxY1cIixcIlNoxY13YVwiLFwiSGVpc2VpXCJdLGxvbmc6W1wiVGFpa2EgKDY0NeKAkzY1MClcIixcIkhha3VjaGkgKDY1MOKAkzY3MSlcIixcIkhha3VoxY0gKDY3MuKAkzY4NilcIixcIlNodWNoxY0gKDY4NuKAkzcwMSlcIixcIlRhaWjFjSAoNzAx4oCTNzA0KVwiLFwiS2VpdW4gKDcwNOKAkzcwOClcIixcIldhZMWNICg3MDjigJM3MTUpXCIsXCJSZWlraSAoNzE14oCTNzE3KVwiLFwiWcWNcsWNICg3MTfigJM3MjQpXCIsXCJKaW5raSAoNzI04oCTNzI5KVwiLFwiVGVucHnFjSAoNzI54oCTNzQ5KVwiLFwiVGVucHnFjS1rYW1wxY0gKDc0OS03NDkpXCIsXCJUZW5wecWNLXNoxY1oxY0gKDc0OS03NTcpXCIsXCJUZW5wecWNLWjFjWppICg3NTctNzY1KVwiLFwiVGVucHnFjS1qaW5nbyAoNzY1LTc2NylcIixcIkppbmdvLWtlaXVuICg3NjctNzcwKVwiLFwiSMWNa2kgKDc3MOKAkzc4MClcIixcIlRlbi3FjSAoNzgxLTc4MilcIixcIkVucnlha3UgKDc4MuKAkzgwNilcIixcIkRhaWTFjSAoODA24oCTODEwKVwiLFwiS8WNbmluICg4MTDigJM4MjQpXCIsXCJUZW5jaMWNICg4MjTigJM4MzQpXCIsXCJKxY13YSAoODM04oCTODQ4KVwiLFwiS2FqxY0gKDg0OOKAkzg1MSlcIixcIk5pbmp1ICg4NTHigJM4NTQpXCIsXCJTYWlrxY0gKDg1NOKAkzg1NylcIixcIlRlbi1hbiAoODU3LTg1OSlcIixcIkrFjWdhbiAoODU54oCTODc3KVwiLFwiR2FuZ3nFjSAoODc34oCTODg1KVwiLFwiTmlubmEgKDg4NeKAkzg4OSlcIixcIkthbnB5xY0gKDg4OeKAkzg5OClcIixcIlNoxY10YWkgKDg5OOKAkzkwMSlcIixcIkVuZ2kgKDkwMeKAkzkyMylcIixcIkVuY2jFjSAoOTIz4oCTOTMxKVwiLFwiSsWNaGVpICg5MzHigJM5MzgpXCIsXCJUZW5necWNICg5MzjigJM5NDcpXCIsXCJUZW5yeWFrdSAoOTQ34oCTOTU3KVwiLFwiVGVudG9rdSAoOTU34oCTOTYxKVwiLFwixYx3YSAoOTYx4oCTOTY0KVwiLFwiS8WNaMWNICg5NjTigJM5NjgpXCIsXCJBbm5hICg5NjjigJM5NzApXCIsXCJUZW5yb2t1ICg5NzDigJM5NzMpXCIsXCJUZW7igJllbiAoOTcz4oCTOTc2KVwiLFwiSsWNZ2VuICg5NzbigJM5NzgpXCIsXCJUZW5nZW4gKDk3OOKAkzk4MylcIixcIkVpa2FuICg5ODPigJM5ODUpXCIsXCJLYW5uYSAoOTg14oCTOTg3KVwiLFwiRWllbiAoOTg34oCTOTg5KVwiLFwiRWlzbyAoOTg54oCTOTkwKVwiLFwiU2jFjXJ5YWt1ICg5OTDigJM5OTUpXCIsXCJDaMWNdG9rdSAoOTk14oCTOTk5KVwiLFwiQ2jFjWjFjSAoOTk54oCTMTAwNClcIixcIkthbmvFjSAoMTAwNOKAkzEwMTIpXCIsXCJDaMWNd2EgKDEwMTLigJMxMDE3KVwiLFwiS2FubmluICgxMDE34oCTMTAyMSlcIixcIkppYW4gKDEwMjHigJMxMDI0KVwiLFwiTWFuanUgKDEwMjTigJMxMDI4KVwiLFwiQ2jFjWdlbiAoMTAyOOKAkzEwMzcpXCIsXCJDaMWNcnlha3UgKDEwMzfigJMxMDQwKVwiLFwiQ2jFjWt5xasgKDEwNDDigJMxMDQ0KVwiLFwiS2FudG9rdSAoMTA0NOKAkzEwNDYpXCIsXCJFaXNoxY0gKDEwNDbigJMxMDUzKVwiLFwiVGVuZ2kgKDEwNTPigJMxMDU4KVwiLFwiS8WNaGVpICgxMDU44oCTMTA2NSlcIixcIkppcnlha3UgKDEwNjXigJMxMDY5KVwiLFwiRW5recWrICgxMDY54oCTMTA3NClcIixcIlNoxY1obyAoMTA3NOKAkzEwNzcpXCIsXCJTaMWNcnlha3UgKDEwNzfigJMxMDgxKVwiLFwiRWloxY0gKDEwODHigJMxMDg0KVwiLFwixYx0b2t1ICgxMDg04oCTMTA4NylcIixcIkthbmppICgxMDg34oCTMTA5NClcIixcIkthaMWNICgxMDk04oCTMTA5NilcIixcIkVpY2jFjSAoMTA5NuKAkzEwOTcpXCIsXCJKxY10b2t1ICgxMDk34oCTMTA5OSlcIixcIkvFjXdhICgxMDk54oCTMTEwNClcIixcIkNoxY1qaSAoMTEwNOKAkzExMDYpXCIsXCJLYXNoxY0gKDExMDbigJMxMTA4KVwiLFwiVGVubmluICgxMTA44oCTMTExMClcIixcIlRlbi1laSAoMTExMC0xMTEzKVwiLFwiRWlrecWrICgxMTEz4oCTMTExOClcIixcIkdlbuKAmWVpICgxMTE44oCTMTEyMClcIixcIkjFjWFuICgxMTIw4oCTMTEyNClcIixcIlRlbmppICgxMTI04oCTMTEyNilcIixcIkRhaWppICgxMTI24oCTMTEzMSlcIixcIlRlbnNoxY0gKDExMzHigJMxMTMyKVwiLFwiQ2jFjXNoxY0gKDExMzLigJMxMTM1KVwiLFwiSMWNZW4gKDExMzXigJMxMTQxKVwiLFwiRWlqaSAoMTE0MeKAkzExNDIpXCIsXCJLxY1qaSAoMTE0MuKAkzExNDQpXCIsXCJUZW7igJl5xY0gKDExNDTigJMxMTQ1KVwiLFwiS3nFq2FuICgxMTQ14oCTMTE1MSlcIixcIk5pbnBlaSAoMTE1MeKAkzExNTQpXCIsXCJLecWranUgKDExNTTigJMxMTU2KVwiLFwiSMWNZ2VuICgxMTU24oCTMTE1OSlcIixcIkhlaWppICgxMTU54oCTMTE2MClcIixcIkVpcnlha3UgKDExNjDigJMxMTYxKVwiLFwixYxobyAoMTE2MeKAkzExNjMpXCIsXCJDaMWNa2FuICgxMTYz4oCTMTE2NSlcIixcIkVpbWFuICgxMTY14oCTMTE2NilcIixcIk5pbuKAmWFuICgxMTY24oCTMTE2OSlcIixcIkthxY0gKDExNjnigJMxMTcxKVwiLFwiU2jFjWFuICgxMTcx4oCTMTE3NSlcIixcIkFuZ2VuICgxMTc14oCTMTE3NylcIixcIkppc2jFjSAoMTE3N+KAkzExODEpXCIsXCJZxY13YSAoMTE4MeKAkzExODIpXCIsXCJKdWVpICgxMTgy4oCTMTE4NClcIixcIkdlbnJ5YWt1ICgxMTg04oCTMTE4NSlcIixcIkJ1bmppICgxMTg14oCTMTE5MClcIixcIktlbmt5xasgKDExOTDigJMxMTk5KVwiLFwiU2jFjWppICgxMTk54oCTMTIwMSlcIixcIktlbm5pbiAoMTIwMeKAkzEyMDQpXCIsXCJHZW5recWrICgxMjA04oCTMTIwNilcIixcIktlbuKAmWVpICgxMjA24oCTMTIwNylcIixcIkrFjWdlbiAoMTIwN+KAkzEyMTEpXCIsXCJLZW5yeWFrdSAoMTIxMeKAkzEyMTMpXCIsXCJLZW5wxY0gKDEyMTPigJMxMjE5KVwiLFwiSsWNa3nFqyAoMTIxOeKAkzEyMjIpXCIsXCJKxY3FjSAoMTIyMuKAkzEyMjQpXCIsXCJHZW5uaW4gKDEyMjTigJMxMjI1KVwiLFwiS2Fyb2t1ICgxMjI14oCTMTIyNylcIixcIkFudGVpICgxMjI34oCTMTIyOSlcIixcIkthbmtpICgxMjI54oCTMTIzMilcIixcIkrFjWVpICgxMjMy4oCTMTIzMylcIixcIlRlbnB1a3UgKDEyMzPigJMxMjM0KVwiLFwiQnVucnlha3UgKDEyMzTigJMxMjM1KVwiLFwiS2F0ZWkgKDEyMzXigJMxMjM4KVwiLFwiUnlha3VuaW4gKDEyMzjigJMxMjM5KVwiLFwiRW7igJnFjSAoMTIzOeKAkzEyNDApXCIsXCJOaW5qaSAoMTI0MOKAkzEyNDMpXCIsXCJLYW5nZW4gKDEyNDPigJMxMjQ3KVwiLFwiSMWNamkgKDEyNDfigJMxMjQ5KVwiLFwiS2VuY2jFjSAoMTI0OeKAkzEyNTYpXCIsXCJLxY1nZW4gKDEyNTbigJMxMjU3KVwiLFwiU2jFjWthICgxMjU34oCTMTI1OSlcIixcIlNoxY1nZW4gKDEyNTnigJMxMjYwKVwiLFwiQnVu4oCZxY0gKDEyNjDigJMxMjYxKVwiLFwiS8WNY2jFjSAoMTI2MeKAkzEyNjQpXCIsXCJCdW7igJllaSAoMTI2NOKAkzEyNzUpXCIsXCJLZW5qaSAoMTI3NeKAkzEyNzgpXCIsXCJLxY1hbiAoMTI3OOKAkzEyODgpXCIsXCJTaMWNxY0gKDEyODjigJMxMjkzKVwiLFwiRWluaW4gKDEyOTPigJMxMjk5KVwiLFwiU2jFjWFuICgxMjk54oCTMTMwMilcIixcIktlbmdlbiAoMTMwMuKAkzEzMDMpXCIsXCJLYWdlbiAoMTMwM+KAkzEzMDYpXCIsXCJUb2t1amkgKDEzMDbigJMxMzA4KVwiLFwiRW5recWNICgxMzA44oCTMTMxMSlcIixcIsWMY2jFjSAoMTMxMeKAkzEzMTIpXCIsXCJTaMWNd2EgKDEzMTLigJMxMzE3KVwiLFwiQnVucMWNICgxMzE34oCTMTMxOSlcIixcIkdlbsWNICgxMzE54oCTMTMyMSlcIixcIkdlbmvFjSAoMTMyMeKAkzEzMjQpXCIsXCJTaMWNY2jFqyAoMTMyNOKAkzEzMjYpXCIsXCJLYXJ5YWt1ICgxMzI24oCTMTMyOSlcIixcIkdlbnRva3UgKDEzMjnigJMxMzMxKVwiLFwiR2Vua8WNICgxMzMx4oCTMTMzNClcIixcIktlbm11ICgxMzM04oCTMTMzNilcIixcIkVuZ2VuICgxMzM24oCTMTM0MClcIixcIkvFjWtva3UgKDEzNDDigJMxMzQ2KVwiLFwiU2jFjWhlaSAoMTM0NuKAkzEzNzApXCIsXCJLZW50b2t1ICgxMzcw4oCTMTM3MilcIixcIkJ1bmNoxasgKDEzNzLigJMxMzc1KVwiLFwiVGVuanUgKDEzNzXigJMxMzc5KVwiLFwiS8WNcnlha3UgKDEzNznigJMxMzgxKVwiLFwiS8WNd2EgKDEzODHigJMxMzg0KVwiLFwiR2VuY2jFqyAoMTM4NOKAkzEzOTIpXCIsXCJNZWl0b2t1ICgxMzg04oCTMTM4NylcIixcIktha2VpICgxMzg34oCTMTM4OSlcIixcIkvFjcWNICgxMzg54oCTMTM5MClcIixcIk1laXRva3UgKDEzOTDigJMxMzk0KVwiLFwixYxlaSAoMTM5NOKAkzE0MjgpXCIsXCJTaMWNY2jFjSAoMTQyOOKAkzE0MjkpXCIsXCJFaWt5xY0gKDE0MjnigJMxNDQxKVwiLFwiS2FraXRzdSAoMTQ0MeKAkzE0NDQpXCIsXCJCdW7igJlhbiAoMTQ0NOKAkzE0NDkpXCIsXCJIxY10b2t1ICgxNDQ54oCTMTQ1MilcIixcIkt5xY10b2t1ICgxNDUy4oCTMTQ1NSlcIixcIkvFjXNoxY0gKDE0NTXigJMxNDU3KVwiLFwiQ2jFjXJva3UgKDE0NTfigJMxNDYwKVwiLFwiS2Fuc2jFjSAoMTQ2MOKAkzE0NjYpXCIsXCJCdW5zaMWNICgxNDY24oCTMTQ2NylcIixcIsWMbmluICgxNDY34oCTMTQ2OSlcIixcIkJ1bm1laSAoMTQ2OeKAkzE0ODcpXCIsXCJDaMWNa3nFjSAoMTQ4N+KAkzE0ODkpXCIsXCJFbnRva3UgKDE0ODnigJMxNDkyKVwiLFwiTWVpxY0gKDE0OTLigJMxNTAxKVwiLFwiQnVua2kgKDE1MDHigJMxNTA0KVwiLFwiRWlzaMWNICgxNTA04oCTMTUyMSlcIixcIlRhaWVpICgxNTIx4oCTMTUyOClcIixcIkt5xY1yb2t1ICgxNTI44oCTMTUzMilcIixcIlRlbmJ1biAoMTUzMuKAkzE1NTUpXCIsXCJLxY1qaSAoMTU1NeKAkzE1NTgpXCIsXCJFaXJva3UgKDE1NTjigJMxNTcwKVwiLFwiR2Vua2kgKDE1NzDigJMxNTczKVwiLFwiVGVuc2jFjSAoMTU3M+KAkzE1OTIpXCIsXCJCdW5yb2t1ICgxNTky4oCTMTU5NilcIixcIktlaWNoxY0gKDE1OTbigJMxNjE1KVwiLFwiR2VubmEgKDE2MTXigJMxNjI0KVwiLFwiS2Fu4oCZZWkgKDE2MjTigJMxNjQ0KVwiLFwiU2jFjWhvICgxNjQ04oCTMTY0OClcIixcIktlaWFuICgxNjQ44oCTMTY1MilcIixcIkrFjcWNICgxNjUy4oCTMTY1NSlcIixcIk1laXJla2kgKDE2NTXigJMxNjU4KVwiLFwiTWFuamkgKDE2NTjigJMxNjYxKVwiLFwiS2FuYnVuICgxNjYx4oCTMTY3MylcIixcIkVucMWNICgxNjcz4oCTMTY4MSlcIixcIlRlbm5hICgxNjgx4oCTMTY4NClcIixcIkrFjWt5xY0gKDE2ODTigJMxNjg4KVwiLFwiR2Vucm9rdSAoMTY4OOKAkzE3MDQpXCIsXCJIxY1laSAoMTcwNOKAkzE3MTEpXCIsXCJTaMWNdG9rdSAoMTcxMeKAkzE3MTYpXCIsXCJLecWNaMWNICgxNzE24oCTMTczNilcIixcIkdlbmJ1biAoMTczNuKAkzE3NDEpXCIsXCJLYW5wxY0gKDE3NDHigJMxNzQ0KVwiLFwiRW5recWNICgxNzQ04oCTMTc0OClcIixcIkthbuKAmWVuICgxNzQ44oCTMTc1MSlcIixcIkjFjXJla2kgKDE3NTHigJMxNzY0KVwiLFwiTWVpd2EgKDE3NjTigJMxNzcyKVwiLFwiQW7igJllaSAoMTc3MuKAkzE3ODEpXCIsXCJUZW5tZWkgKDE3ODHigJMxNzg5KVwiLFwiS2Fuc2VpICgxNzg54oCTMTgwMSlcIixcIkt5xY13YSAoMTgwMeKAkzE4MDQpXCIsXCJCdW5rYSAoMTgwNOKAkzE4MTgpXCIsXCJCdW5zZWkgKDE4MTjigJMxODMwKVwiLFwiVGVucMWNICgxODMw4oCTMTg0NClcIixcIkvFjWthICgxODQ04oCTMTg0OClcIixcIkthZWkgKDE4NDjigJMxODU0KVwiLFwiQW5zZWkgKDE4NTTigJMxODYwKVwiLFwiTWFu4oCZZW4gKDE4NjDigJMxODYxKVwiLFwiQnVua3nFqyAoMTg2MeKAkzE4NjQpXCIsXCJHZW5qaSAoMTg2NOKAkzE4NjUpXCIsXCJLZWnFjSAoMTg2NeKAkzE4NjgpXCIsXCJNZWlqaVwiLFwiVGFpc2jFjVwiLFwiU2jFjXdhXCIsXCJIZWlzZWlcIl19LGRheVBlcmlvZHM6e2FtOlwiQU1cIixwbTpcIlBNXCJ9fSxwZXJzaWFuOnttb250aHM6e25hcnJvdzpbXCIxXCIsXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCIxMFwiLFwiMTFcIixcIjEyXCJdLHNob3J0OltcIkZhcnZhcmRpblwiLFwiT3JkaWJlaGVzaHRcIixcIktob3JkYWRcIixcIlRpclwiLFwiTW9yZGFkXCIsXCJTaGFocml2YXJcIixcIk1laHJcIixcIkFiYW5cIixcIkF6YXJcIixcIkRleVwiLFwiQmFobWFuXCIsXCJFc2ZhbmRcIl0sbG9uZzpbXCJGYXJ2YXJkaW5cIixcIk9yZGliZWhlc2h0XCIsXCJLaG9yZGFkXCIsXCJUaXJcIixcIk1vcmRhZFwiLFwiU2hhaHJpdmFyXCIsXCJNZWhyXCIsXCJBYmFuXCIsXCJBemFyXCIsXCJEZXlcIixcIkJhaG1hblwiLFwiRXNmYW5kXCJdfSxkYXlzOntuYXJyb3c6W1wiU1wiLFwiTVwiLFwiVFwiLFwiV1wiLFwiVFwiLFwiRlwiLFwiU1wiXSxzaG9ydDpbXCJTdW5cIixcIk1vblwiLFwiVHVlXCIsXCJXZWRcIixcIlRodVwiLFwiRnJpXCIsXCJTYXRcIl0sbG9uZzpbXCJTdW5kYXlcIixcIk1vbmRheVwiLFwiVHVlc2RheVwiLFwiV2VkbmVzZGF5XCIsXCJUaHVyc2RheVwiLFwiRnJpZGF5XCIsXCJTYXR1cmRheVwiXX0sZXJhczp7bmFycm93OltcIkFQXCJdLHNob3J0OltcIkFQXCJdLGxvbmc6W1wiQVBcIl19LGRheVBlcmlvZHM6e2FtOlwiQU1cIixwbTpcIlBNXCJ9fSxyb2M6e21vbnRoczp7bmFycm93OltcIkpcIixcIkZcIixcIk1cIixcIkFcIixcIk1cIixcIkpcIixcIkpcIixcIkFcIixcIlNcIixcIk9cIixcIk5cIixcIkRcIl0sc2hvcnQ6W1wiSmFuXCIsXCJGZWJcIixcIk1hclwiLFwiQXByXCIsXCJNYXlcIixcIkp1blwiLFwiSnVsXCIsXCJBdWdcIixcIlNlcFwiLFwiT2N0XCIsXCJOb3ZcIixcIkRlY1wiXSxsb25nOltcIkphbnVhcnlcIixcIkZlYnJ1YXJ5XCIsXCJNYXJjaFwiLFwiQXByaWxcIixcIk1heVwiLFwiSnVuZVwiLFwiSnVseVwiLFwiQXVndXN0XCIsXCJTZXB0ZW1iZXJcIixcIk9jdG9iZXJcIixcIk5vdmVtYmVyXCIsXCJEZWNlbWJlclwiXX0sZGF5czp7bmFycm93OltcIlNcIixcIk1cIixcIlRcIixcIldcIixcIlRcIixcIkZcIixcIlNcIl0sc2hvcnQ6W1wiU3VuXCIsXCJNb25cIixcIlR1ZVwiLFwiV2VkXCIsXCJUaHVcIixcIkZyaVwiLFwiU2F0XCJdLGxvbmc6W1wiU3VuZGF5XCIsXCJNb25kYXlcIixcIlR1ZXNkYXlcIixcIldlZG5lc2RheVwiLFwiVGh1cnNkYXlcIixcIkZyaWRheVwiLFwiU2F0dXJkYXlcIl19LGVyYXM6e25hcnJvdzpbXCJCZWZvcmUgUi5PLkMuXCIsXCJNaW5ndW9cIl0sc2hvcnQ6W1wiQmVmb3JlIFIuTy5DLlwiLFwiTWluZ3VvXCJdLGxvbmc6W1wiQmVmb3JlIFIuTy5DLlwiLFwiTWluZ3VvXCJdfSxkYXlQZXJpb2RzOnthbTpcIkFNXCIscG06XCJQTVwifX19fSxudW1iZXI6e251OltcImxhdG5cIl0scGF0dGVybnM6e2RlY2ltYWw6e3Bvc2l0aXZlUGF0dGVybjpcIntudW1iZXJ9XCIsbmVnYXRpdmVQYXR0ZXJuOlwie21pbnVzU2lnbn17bnVtYmVyfVwifSxjdXJyZW5jeTp7cG9zaXRpdmVQYXR0ZXJuOlwie2N1cnJlbmN5fXtudW1iZXJ9XCIsbmVnYXRpdmVQYXR0ZXJuOlwie21pbnVzU2lnbn17Y3VycmVuY3l9e251bWJlcn1cIn0scGVyY2VudDp7cG9zaXRpdmVQYXR0ZXJuOlwie251bWJlcn17cGVyY2VudFNpZ259XCIsbmVnYXRpdmVQYXR0ZXJuOlwie21pbnVzU2lnbn17bnVtYmVyfXtwZXJjZW50U2lnbn1cIn19LHN5bWJvbHM6e2xhdG46e2RlY2ltYWw6XCIuXCIsZ3JvdXA6XCIsXCIsbmFuOlwiTmFOXCIscGx1c1NpZ246XCIrXCIsbWludXNTaWduOlwiLVwiLHBlcmNlbnRTaWduOlwiJVwiLGluZmluaXR5Olwi4oieXCJ9fSxjdXJyZW5jaWVzOntBVUQ6XCJBJFwiLEJSTDpcIlIkXCIsQ0FEOlwiQ0EkXCIsQ05ZOlwiQ07CpVwiLEVVUjpcIuKCrFwiLEdCUDpcIsKjXCIsSEtEOlwiSEskXCIsSUxTOlwi4oKqXCIsSU5SOlwi4oK5XCIsSlBZOlwiwqVcIixLUlc6XCLigqlcIixNWE46XCJNWCRcIixOWkQ6XCJOWiRcIixUV0Q6XCJOVCRcIixVU0Q6XCIkXCIsVk5EOlwi4oKrXCIsWEFGOlwiRkNGQVwiLFhDRDpcIkVDJFwiLFhPRjpcIkNGQVwiLFhQRjpcIkNGUEZcIn19fSk7IiwiSW50bFBvbHlmaWxsLl9fYWRkTG9jYWxlRGF0YSh7bG9jYWxlOlwiZXNcIixkYXRlOntjYTpbXCJncmVnb3J5XCIsXCJidWRkaGlzdFwiLFwiY2hpbmVzZVwiLFwiY29wdGljXCIsXCJkYW5naVwiLFwiZXRoaW9hYVwiLFwiZXRoaW9waWNcIixcImdlbmVyaWNcIixcImhlYnJld1wiLFwiaW5kaWFuXCIsXCJpc2xhbWljXCIsXCJpc2xhbWljY1wiLFwiamFwYW5lc2VcIixcInBlcnNpYW5cIixcInJvY1wiXSxob3VyTm8wOnRydWUsaG91cjEyOmZhbHNlLGZvcm1hdHM6e3Nob3J0OlwiezF9IHswfVwiLG1lZGl1bTpcInsxfSB7MH1cIixmdWxsOlwiezF9LCB7MH1cIixsb25nOlwiezF9LCB7MH1cIixhdmFpbGFibGVGb3JtYXRzOntcImRcIjpcImRcIixcIkVcIjpcImNjY1wiLEVkOlwiRSBkXCIsRWhtOlwiRSwgaDptbSBhXCIsRUhtOlwiRSwgSDptbVwiLEVobXM6XCJFLCBoOm1tOnNzIGFcIixFSG1zOlwiRSwgSDptbTpzc1wiLEd5OlwieSBHXCIsR3lNTU06XCJNTU0geSBHXCIsR3lNTU1kOlwiZCBNTU0geSBHXCIsR3lNTU1FZDpcIkUsIGQgTU1NIHkgR1wiLEd5TU1NTTpcIk1NTU0gJ2RlJyB5IEdcIixHeU1NTU1kOlwiZCAnZGUnIE1NTU0gJ2RlJyB5IEdcIixHeU1NTU1FZDpcIkUsIGQgJ2RlJyBNTU1NICdkZScgeSBHXCIsXCJoXCI6XCJoIGFcIixcIkhcIjpcIkhcIixobTpcImg6bW0gYVwiLEhtOlwiSDptbVwiLGhtczpcImg6bW06c3MgYVwiLEhtczpcIkg6bW06c3NcIixobXN2OlwiaDptbTpzcyBhIHZcIixIbXN2OlwiSDptbTpzcyB2XCIsaG1zdnZ2djpcImg6bW06c3MgYSAodnZ2dilcIixIbXN2dnZ2OlwiSDptbTpzcyAodnZ2dilcIixobXY6XCJoOm1tIGEgdlwiLEhtdjpcIkg6bW0gdlwiLFwiTVwiOlwiTFwiLE1kOlwiZC9NXCIsTUVkOlwiRSwgZC9NXCIsTU1kOlwiZC9NXCIsTU1kZDpcImQvTVwiLE1NTTpcIkxMTFwiLE1NTWQ6XCJkIE1NTVwiLE1NTUVkOlwiRSwgZCBNTU1cIixNTU1NZDpcImQgJ2RlJyBNTU1NXCIsTU1NTUVkOlwiRSwgZCAnZGUnIE1NTU1cIixtczpcIm1tOnNzXCIsXCJ5XCI6XCJ5XCIseU06XCJNL3lcIix5TWQ6XCJkL00veVwiLHlNRWQ6XCJFRUUsIGQvTS95XCIseU1NOlwiTS95XCIseU1NTTpcIk1NTSB5XCIseU1NTWQ6XCJkIE1NTSB5XCIseU1NTUVkOlwiRUVFLCBkIE1NTSB5XCIseU1NTU06XCJNTU1NICdkZScgeVwiLHlNTU1NZDpcImQgJ2RlJyBNTU1NICdkZScgeVwiLHlNTU1NRWQ6XCJFRUUsIGQgJ2RlJyBNTU1NICdkZScgeVwiLHlRUVE6XCJRUVEgeVwiLHlRUVFROlwiUVFRUSAnZGUnIHlcIn0sZGF0ZUZvcm1hdHM6e3lNTU1NRUVFRWQ6XCJFRUVFLCBkICdkZScgTU1NTSAnZGUnIHlcIix5TU1NTWQ6XCJkICdkZScgTU1NTSAnZGUnIHlcIix5TU1NZDpcImQgTU1NIHlcIix5TWQ6XCJkL00veXlcIn0sdGltZUZvcm1hdHM6e2htbXNzenp6ejpcIkg6bW06c3MgKHp6enopXCIsaG1zejpcIkg6bW06c3MgelwiLGhtczpcIkg6bW06c3NcIixobTpcIkg6bW1cIn19LGNhbGVuZGFyczp7YnVkZGhpc3Q6e21vbnRoczp7bmFycm93OltcIkVcIixcIkZcIixcIk1cIixcIkFcIixcIk1cIixcIkpcIixcIkpcIixcIkFcIixcIlNcIixcIk9cIixcIk5cIixcIkRcIl0sc2hvcnQ6W1wiZW5lLlwiLFwiZmViLlwiLFwibWFyLlwiLFwiYWJyLlwiLFwibWF5LlwiLFwianVuLlwiLFwianVsLlwiLFwiYWdvLlwiLFwic2VwdC5cIixcIm9jdC5cIixcIm5vdi5cIixcImRpYy5cIl0sbG9uZzpbXCJlbmVyb1wiLFwiZmVicmVyb1wiLFwibWFyem9cIixcImFicmlsXCIsXCJtYXlvXCIsXCJqdW5pb1wiLFwianVsaW9cIixcImFnb3N0b1wiLFwic2VwdGllbWJyZVwiLFwib2N0dWJyZVwiLFwibm92aWVtYnJlXCIsXCJkaWNpZW1icmVcIl19LGRheXM6e25hcnJvdzpbXCJEXCIsXCJMXCIsXCJNXCIsXCJYXCIsXCJKXCIsXCJWXCIsXCJTXCJdLHNob3J0OltcImRvbS5cIixcImx1bi5cIixcIm1hci5cIixcIm1pw6kuXCIsXCJqdWUuXCIsXCJ2aWUuXCIsXCJzw6FiLlwiXSxsb25nOltcImRvbWluZ29cIixcImx1bmVzXCIsXCJtYXJ0ZXNcIixcIm1pw6lyY29sZXNcIixcImp1ZXZlc1wiLFwidmllcm5lc1wiLFwic8OhYmFkb1wiXX0sZXJhczp7bmFycm93OltcIkJFXCJdLHNob3J0OltcIkJFXCJdLGxvbmc6W1wiQkVcIl19LGRheVBlcmlvZHM6e2FtOlwiYS4gbS5cIixwbTpcInAuIG0uXCJ9fSxjaGluZXNlOnttb250aHM6e25hcnJvdzpbXCIxXCIsXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCIxMFwiLFwiMTFcIixcIjEyXCJdLHNob3J0OltcIk0wMVwiLFwiTTAyXCIsXCJNMDNcIixcIk0wNFwiLFwiTTA1XCIsXCJNMDZcIixcIk0wN1wiLFwiTTA4XCIsXCJNMDlcIixcIk0xMFwiLFwiTTExXCIsXCJNMTJcIl0sbG9uZzpbXCJNMDFcIixcIk0wMlwiLFwiTTAzXCIsXCJNMDRcIixcIk0wNVwiLFwiTTA2XCIsXCJNMDdcIixcIk0wOFwiLFwiTTA5XCIsXCJNMTBcIixcIk0xMVwiLFwiTTEyXCJdfSxkYXlzOntuYXJyb3c6W1wiRFwiLFwiTFwiLFwiTVwiLFwiWFwiLFwiSlwiLFwiVlwiLFwiU1wiXSxzaG9ydDpbXCJkb20uXCIsXCJsdW4uXCIsXCJtYXIuXCIsXCJtacOpLlwiLFwianVlLlwiLFwidmllLlwiLFwic8OhYi5cIl0sbG9uZzpbXCJkb21pbmdvXCIsXCJsdW5lc1wiLFwibWFydGVzXCIsXCJtacOpcmNvbGVzXCIsXCJqdWV2ZXNcIixcInZpZXJuZXNcIixcInPDoWJhZG9cIl19LGRheVBlcmlvZHM6e2FtOlwiYS4gbS5cIixwbTpcInAuIG0uXCJ9fSxjb3B0aWM6e21vbnRoczp7bmFycm93OltcIjFcIixcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIjEwXCIsXCIxMVwiLFwiMTJcIixcIjEzXCJdLHNob3J0OltcIlRvdXRcIixcIkJhYmFcIixcIkhhdG9yXCIsXCJLaWFoa1wiLFwiVG9iYVwiLFwiQW1zaGlyXCIsXCJCYXJhbWhhdFwiLFwiQmFyYW1vdWRhXCIsXCJCYXNoYW5zXCIsXCJQYW9uYVwiLFwiRXBlcFwiLFwiTWVzcmFcIixcIk5hc2llXCJdLGxvbmc6W1wiVG91dFwiLFwiQmFiYVwiLFwiSGF0b3JcIixcIktpYWhrXCIsXCJUb2JhXCIsXCJBbXNoaXJcIixcIkJhcmFtaGF0XCIsXCJCYXJhbW91ZGFcIixcIkJhc2hhbnNcIixcIlBhb25hXCIsXCJFcGVwXCIsXCJNZXNyYVwiLFwiTmFzaWVcIl19LGRheXM6e25hcnJvdzpbXCJEXCIsXCJMXCIsXCJNXCIsXCJYXCIsXCJKXCIsXCJWXCIsXCJTXCJdLHNob3J0OltcImRvbS5cIixcImx1bi5cIixcIm1hci5cIixcIm1pw6kuXCIsXCJqdWUuXCIsXCJ2aWUuXCIsXCJzw6FiLlwiXSxsb25nOltcImRvbWluZ29cIixcImx1bmVzXCIsXCJtYXJ0ZXNcIixcIm1pw6lyY29sZXNcIixcImp1ZXZlc1wiLFwidmllcm5lc1wiLFwic8OhYmFkb1wiXX0sZXJhczp7bmFycm93OltcIkVSQTBcIixcIkVSQTFcIl0sc2hvcnQ6W1wiRVJBMFwiLFwiRVJBMVwiXSxsb25nOltcIkVSQTBcIixcIkVSQTFcIl19LGRheVBlcmlvZHM6e2FtOlwiYS4gbS5cIixwbTpcInAuIG0uXCJ9fSxkYW5naTp7bW9udGhzOntuYXJyb3c6W1wiMVwiLFwiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiMTBcIixcIjExXCIsXCIxMlwiXSxzaG9ydDpbXCJNMDFcIixcIk0wMlwiLFwiTTAzXCIsXCJNMDRcIixcIk0wNVwiLFwiTTA2XCIsXCJNMDdcIixcIk0wOFwiLFwiTTA5XCIsXCJNMTBcIixcIk0xMVwiLFwiTTEyXCJdLGxvbmc6W1wiTTAxXCIsXCJNMDJcIixcIk0wM1wiLFwiTTA0XCIsXCJNMDVcIixcIk0wNlwiLFwiTTA3XCIsXCJNMDhcIixcIk0wOVwiLFwiTTEwXCIsXCJNMTFcIixcIk0xMlwiXX0sZGF5czp7bmFycm93OltcIkRcIixcIkxcIixcIk1cIixcIlhcIixcIkpcIixcIlZcIixcIlNcIl0sc2hvcnQ6W1wiZG9tLlwiLFwibHVuLlwiLFwibWFyLlwiLFwibWnDqS5cIixcImp1ZS5cIixcInZpZS5cIixcInPDoWIuXCJdLGxvbmc6W1wiZG9taW5nb1wiLFwibHVuZXNcIixcIm1hcnRlc1wiLFwibWnDqXJjb2xlc1wiLFwianVldmVzXCIsXCJ2aWVybmVzXCIsXCJzw6FiYWRvXCJdfSxkYXlQZXJpb2RzOnthbTpcImEuIG0uXCIscG06XCJwLiBtLlwifX0sZXRoaW9waWM6e21vbnRoczp7bmFycm93OltcIjFcIixcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIjEwXCIsXCIxMVwiLFwiMTJcIixcIjEzXCJdLHNob3J0OltcIk1lc2tlcmVtXCIsXCJUZWtlbXRcIixcIkhlZGFyXCIsXCJUYWhzYXNcIixcIlRlclwiLFwiWWVrYXRpdFwiLFwiTWVnYWJpdFwiLFwiTWlhemlhXCIsXCJHZW5ib3RcIixcIlNlbmVcIixcIkhhbWxlXCIsXCJOZWhhc3NlXCIsXCJQYWd1bWVuXCJdLGxvbmc6W1wiTWVza2VyZW1cIixcIlRla2VtdFwiLFwiSGVkYXJcIixcIlRhaHNhc1wiLFwiVGVyXCIsXCJZZWthdGl0XCIsXCJNZWdhYml0XCIsXCJNaWF6aWFcIixcIkdlbmJvdFwiLFwiU2VuZVwiLFwiSGFtbGVcIixcIk5laGFzc2VcIixcIlBhZ3VtZW5cIl19LGRheXM6e25hcnJvdzpbXCJEXCIsXCJMXCIsXCJNXCIsXCJYXCIsXCJKXCIsXCJWXCIsXCJTXCJdLHNob3J0OltcImRvbS5cIixcImx1bi5cIixcIm1hci5cIixcIm1pw6kuXCIsXCJqdWUuXCIsXCJ2aWUuXCIsXCJzw6FiLlwiXSxsb25nOltcImRvbWluZ29cIixcImx1bmVzXCIsXCJtYXJ0ZXNcIixcIm1pw6lyY29sZXNcIixcImp1ZXZlc1wiLFwidmllcm5lc1wiLFwic8OhYmFkb1wiXX0sZXJhczp7bmFycm93OltcIkVSQTBcIixcIkVSQTFcIl0sc2hvcnQ6W1wiRVJBMFwiLFwiRVJBMVwiXSxsb25nOltcIkVSQTBcIixcIkVSQTFcIl19LGRheVBlcmlvZHM6e2FtOlwiYS4gbS5cIixwbTpcInAuIG0uXCJ9fSxldGhpb2FhOnttb250aHM6e25hcnJvdzpbXCIxXCIsXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCIxMFwiLFwiMTFcIixcIjEyXCIsXCIxM1wiXSxzaG9ydDpbXCJNZXNrZXJlbVwiLFwiVGVrZW10XCIsXCJIZWRhclwiLFwiVGFoc2FzXCIsXCJUZXJcIixcIllla2F0aXRcIixcIk1lZ2FiaXRcIixcIk1pYXppYVwiLFwiR2VuYm90XCIsXCJTZW5lXCIsXCJIYW1sZVwiLFwiTmVoYXNzZVwiLFwiUGFndW1lblwiXSxsb25nOltcIk1lc2tlcmVtXCIsXCJUZWtlbXRcIixcIkhlZGFyXCIsXCJUYWhzYXNcIixcIlRlclwiLFwiWWVrYXRpdFwiLFwiTWVnYWJpdFwiLFwiTWlhemlhXCIsXCJHZW5ib3RcIixcIlNlbmVcIixcIkhhbWxlXCIsXCJOZWhhc3NlXCIsXCJQYWd1bWVuXCJdfSxkYXlzOntuYXJyb3c6W1wiRFwiLFwiTFwiLFwiTVwiLFwiWFwiLFwiSlwiLFwiVlwiLFwiU1wiXSxzaG9ydDpbXCJkb20uXCIsXCJsdW4uXCIsXCJtYXIuXCIsXCJtacOpLlwiLFwianVlLlwiLFwidmllLlwiLFwic8OhYi5cIl0sbG9uZzpbXCJkb21pbmdvXCIsXCJsdW5lc1wiLFwibWFydGVzXCIsXCJtacOpcmNvbGVzXCIsXCJqdWV2ZXNcIixcInZpZXJuZXNcIixcInPDoWJhZG9cIl19LGVyYXM6e25hcnJvdzpbXCJFUkEwXCJdLHNob3J0OltcIkVSQTBcIl0sbG9uZzpbXCJFUkEwXCJdfSxkYXlQZXJpb2RzOnthbTpcImEuIG0uXCIscG06XCJwLiBtLlwifX0sZ2VuZXJpYzp7bW9udGhzOntuYXJyb3c6W1wiMVwiLFwiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiMTBcIixcIjExXCIsXCIxMlwiXSxzaG9ydDpbXCJNMDFcIixcIk0wMlwiLFwiTTAzXCIsXCJNMDRcIixcIk0wNVwiLFwiTTA2XCIsXCJNMDdcIixcIk0wOFwiLFwiTTA5XCIsXCJNMTBcIixcIk0xMVwiLFwiTTEyXCJdLGxvbmc6W1wiTTAxXCIsXCJNMDJcIixcIk0wM1wiLFwiTTA0XCIsXCJNMDVcIixcIk0wNlwiLFwiTTA3XCIsXCJNMDhcIixcIk0wOVwiLFwiTTEwXCIsXCJNMTFcIixcIk0xMlwiXX0sZGF5czp7bmFycm93OltcIkRcIixcIkxcIixcIk1cIixcIlhcIixcIkpcIixcIlZcIixcIlNcIl0sc2hvcnQ6W1wiZG9tLlwiLFwibHVuLlwiLFwibWFyLlwiLFwibWnDqS5cIixcImp1ZS5cIixcInZpZS5cIixcInPDoWIuXCJdLGxvbmc6W1wiZG9taW5nb1wiLFwibHVuZXNcIixcIm1hcnRlc1wiLFwibWnDqXJjb2xlc1wiLFwianVldmVzXCIsXCJ2aWVybmVzXCIsXCJzw6FiYWRvXCJdfSxlcmFzOntuYXJyb3c6W1wiRVJBMFwiLFwiRVJBMVwiXSxzaG9ydDpbXCJFUkEwXCIsXCJFUkExXCJdLGxvbmc6W1wiRVJBMFwiLFwiRVJBMVwiXX0sZGF5UGVyaW9kczp7YW06XCJhLiBtLlwiLHBtOlwicC4gbS5cIn19LGdyZWdvcnk6e21vbnRoczp7bmFycm93OltcIkVcIixcIkZcIixcIk1cIixcIkFcIixcIk1cIixcIkpcIixcIkpcIixcIkFcIixcIlNcIixcIk9cIixcIk5cIixcIkRcIl0sc2hvcnQ6W1wiZW5lLlwiLFwiZmViLlwiLFwibWFyLlwiLFwiYWJyLlwiLFwibWF5LlwiLFwianVuLlwiLFwianVsLlwiLFwiYWdvLlwiLFwic2VwdC5cIixcIm9jdC5cIixcIm5vdi5cIixcImRpYy5cIl0sbG9uZzpbXCJlbmVyb1wiLFwiZmVicmVyb1wiLFwibWFyem9cIixcImFicmlsXCIsXCJtYXlvXCIsXCJqdW5pb1wiLFwianVsaW9cIixcImFnb3N0b1wiLFwic2VwdGllbWJyZVwiLFwib2N0dWJyZVwiLFwibm92aWVtYnJlXCIsXCJkaWNpZW1icmVcIl19LGRheXM6e25hcnJvdzpbXCJEXCIsXCJMXCIsXCJNXCIsXCJYXCIsXCJKXCIsXCJWXCIsXCJTXCJdLHNob3J0OltcImRvbS5cIixcImx1bi5cIixcIm1hci5cIixcIm1pw6kuXCIsXCJqdWUuXCIsXCJ2aWUuXCIsXCJzw6FiLlwiXSxsb25nOltcImRvbWluZ29cIixcImx1bmVzXCIsXCJtYXJ0ZXNcIixcIm1pw6lyY29sZXNcIixcImp1ZXZlc1wiLFwidmllcm5lc1wiLFwic8OhYmFkb1wiXX0sZXJhczp7bmFycm93OltcImEuIEMuXCIsXCJkLiBDLlwiLFwiYS4gZS4gYy5cIixcImUuIGMuXCJdLHNob3J0OltcImEuIEMuXCIsXCJkLiBDLlwiLFwiYS4gZS4gYy5cIixcImUuIGMuXCJdLGxvbmc6W1wiYW50ZXMgZGUgQ3Jpc3RvXCIsXCJkZXNwdcOpcyBkZSBDcmlzdG9cIixcImFudGVzIGRlIGxhIGVyYSBjb23Dum5cIixcImVyYSBjb23Dum5cIl19LGRheVBlcmlvZHM6e2FtOlwiYS4gbS5cIixwbTpcInAuIG0uXCJ9fSxoZWJyZXc6e21vbnRoczp7bmFycm93OltcIjFcIixcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIjEwXCIsXCIxMVwiLFwiMTJcIixcIjEzXCIsXCI3XCJdLHNob3J0OltcIlRpc2hyaVwiLFwiSGVzaHZhblwiLFwiS2lzbGV2XCIsXCJUZXZldFwiLFwiU2hldmF0XCIsXCJBZGFyIElcIixcIkFkYXJcIixcIk5pc2FuXCIsXCJJeWFyXCIsXCJTaXZhblwiLFwiVGFtdXpcIixcIkF2XCIsXCJFbHVsXCIsXCJBZGFyIElJXCJdLGxvbmc6W1wiVGlzaHJpXCIsXCJIZXNodmFuXCIsXCJLaXNsZXZcIixcIlRldmV0XCIsXCJTaGV2YXRcIixcIkFkYXIgSVwiLFwiQWRhclwiLFwiTmlzYW5cIixcIkl5YXJcIixcIlNpdmFuXCIsXCJUYW11elwiLFwiQXZcIixcIkVsdWxcIixcIkFkYXIgSUlcIl19LGRheXM6e25hcnJvdzpbXCJEXCIsXCJMXCIsXCJNXCIsXCJYXCIsXCJKXCIsXCJWXCIsXCJTXCJdLHNob3J0OltcImRvbS5cIixcImx1bi5cIixcIm1hci5cIixcIm1pw6kuXCIsXCJqdWUuXCIsXCJ2aWUuXCIsXCJzw6FiLlwiXSxsb25nOltcImRvbWluZ29cIixcImx1bmVzXCIsXCJtYXJ0ZXNcIixcIm1pw6lyY29sZXNcIixcImp1ZXZlc1wiLFwidmllcm5lc1wiLFwic8OhYmFkb1wiXX0sZXJhczp7bmFycm93OltcIkFNXCJdLHNob3J0OltcIkFNXCJdLGxvbmc6W1wiQU1cIl19LGRheVBlcmlvZHM6e2FtOlwiYS4gbS5cIixwbTpcInAuIG0uXCJ9fSxpbmRpYW46e21vbnRoczp7bmFycm93OltcIjFcIixcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIjEwXCIsXCIxMVwiLFwiMTJcIl0sc2hvcnQ6W1wiQ2hhaXRyYVwiLFwiVmFpc2FraGFcIixcIkp5YWlzdGhhXCIsXCJBc2FkaGFcIixcIlNyYXZhbmFcIixcIkJoYWRyYVwiLFwiQXN2aW5hXCIsXCJLYXJ0aWthXCIsXCJBZ3JhaGF5YW5hXCIsXCJQYXVzYVwiLFwiTWFnaGFcIixcIlBoYWxndW5hXCJdLGxvbmc6W1wiQ2hhaXRyYVwiLFwiVmFpc2FraGFcIixcIkp5YWlzdGhhXCIsXCJBc2FkaGFcIixcIlNyYXZhbmFcIixcIkJoYWRyYVwiLFwiQXN2aW5hXCIsXCJLYXJ0aWthXCIsXCJBZ3JhaGF5YW5hXCIsXCJQYXVzYVwiLFwiTWFnaGFcIixcIlBoYWxndW5hXCJdfSxkYXlzOntuYXJyb3c6W1wiRFwiLFwiTFwiLFwiTVwiLFwiWFwiLFwiSlwiLFwiVlwiLFwiU1wiXSxzaG9ydDpbXCJkb20uXCIsXCJsdW4uXCIsXCJtYXIuXCIsXCJtacOpLlwiLFwianVlLlwiLFwidmllLlwiLFwic8OhYi5cIl0sbG9uZzpbXCJkb21pbmdvXCIsXCJsdW5lc1wiLFwibWFydGVzXCIsXCJtacOpcmNvbGVzXCIsXCJqdWV2ZXNcIixcInZpZXJuZXNcIixcInPDoWJhZG9cIl19LGVyYXM6e25hcnJvdzpbXCJTYWthXCJdLHNob3J0OltcIlNha2FcIl0sbG9uZzpbXCJTYWthXCJdfSxkYXlQZXJpb2RzOnthbTpcImEuIG0uXCIscG06XCJwLiBtLlwifX0saXNsYW1pYzp7bW9udGhzOntuYXJyb3c6W1wiMVwiLFwiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiMTBcIixcIjExXCIsXCIxMlwiXSxzaG9ydDpbXCJNdWguXCIsXCJTYWYuXCIsXCJSYWIuIElcIixcIlJhYi4gSUlcIixcIkp1bS4gSVwiLFwiSnVtLiBJSVwiLFwiUmFqLlwiLFwiU2hhLlwiLFwiUmFtLlwiLFwiU2hhdy5cIixcIkRodcq7bC1RLlwiLFwiRGh1yrtsLUguXCJdLGxvbmc6W1wiTXVoYXJyYW1cIixcIlNhZmFyXCIsXCJSYWJpyrsgSVwiLFwiUmFiacq7IElJXCIsXCJKdW1hZGEgSVwiLFwiSnVtYWRhIElJXCIsXCJSYWphYlwiLFwiU2hhyrtiYW5cIixcIlJhbWFkYW5cIixcIlNoYXd3YWxcIixcIkRodcq7bC1Racq7ZGFoXCIsXCJEaHXKu2wtSGlqamFoXCJdfSxkYXlzOntuYXJyb3c6W1wiRFwiLFwiTFwiLFwiTVwiLFwiWFwiLFwiSlwiLFwiVlwiLFwiU1wiXSxzaG9ydDpbXCJkb20uXCIsXCJsdW4uXCIsXCJtYXIuXCIsXCJtacOpLlwiLFwianVlLlwiLFwidmllLlwiLFwic8OhYi5cIl0sbG9uZzpbXCJkb21pbmdvXCIsXCJsdW5lc1wiLFwibWFydGVzXCIsXCJtacOpcmNvbGVzXCIsXCJqdWV2ZXNcIixcInZpZXJuZXNcIixcInPDoWJhZG9cIl19LGVyYXM6e25hcnJvdzpbXCJBSFwiXSxzaG9ydDpbXCJBSFwiXSxsb25nOltcIkFIXCJdfSxkYXlQZXJpb2RzOnthbTpcImEuIG0uXCIscG06XCJwLiBtLlwifX0saXNsYW1pY2M6e21vbnRoczp7bmFycm93OltcIjFcIixcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIjEwXCIsXCIxMVwiLFwiMTJcIl0sc2hvcnQ6W1wiTXVoLlwiLFwiU2FmLlwiLFwiUmFiLiBJXCIsXCJSYWIuIElJXCIsXCJKdW0uIElcIixcIkp1bS4gSUlcIixcIlJhai5cIixcIlNoYS5cIixcIlJhbS5cIixcIlNoYXcuXCIsXCJEaHXKu2wtUS5cIixcIkRodcq7bC1ILlwiXSxsb25nOltcIk11aGFycmFtXCIsXCJTYWZhclwiLFwiUmFiacq7IElcIixcIlJhYmnKuyBJSVwiLFwiSnVtYWRhIElcIixcIkp1bWFkYSBJSVwiLFwiUmFqYWJcIixcIlNoYcq7YmFuXCIsXCJSYW1hZGFuXCIsXCJTaGF3d2FsXCIsXCJEaHXKu2wtUWnKu2RhaFwiLFwiRGh1yrtsLUhpamphaFwiXX0sZGF5czp7bmFycm93OltcIkRcIixcIkxcIixcIk1cIixcIlhcIixcIkpcIixcIlZcIixcIlNcIl0sc2hvcnQ6W1wiZG9tLlwiLFwibHVuLlwiLFwibWFyLlwiLFwibWnDqS5cIixcImp1ZS5cIixcInZpZS5cIixcInPDoWIuXCJdLGxvbmc6W1wiZG9taW5nb1wiLFwibHVuZXNcIixcIm1hcnRlc1wiLFwibWnDqXJjb2xlc1wiLFwianVldmVzXCIsXCJ2aWVybmVzXCIsXCJzw6FiYWRvXCJdfSxlcmFzOntuYXJyb3c6W1wiQUhcIl0sc2hvcnQ6W1wiQUhcIl0sbG9uZzpbXCJBSFwiXX0sZGF5UGVyaW9kczp7YW06XCJhLiBtLlwiLHBtOlwicC4gbS5cIn19LGphcGFuZXNlOnttb250aHM6e25hcnJvdzpbXCJFXCIsXCJGXCIsXCJNXCIsXCJBXCIsXCJNXCIsXCJKXCIsXCJKXCIsXCJBXCIsXCJTXCIsXCJPXCIsXCJOXCIsXCJEXCJdLHNob3J0OltcImVuZS5cIixcImZlYi5cIixcIm1hci5cIixcImFici5cIixcIm1heS5cIixcImp1bi5cIixcImp1bC5cIixcImFnby5cIixcInNlcHQuXCIsXCJvY3QuXCIsXCJub3YuXCIsXCJkaWMuXCJdLGxvbmc6W1wiZW5lcm9cIixcImZlYnJlcm9cIixcIm1hcnpvXCIsXCJhYnJpbFwiLFwibWF5b1wiLFwianVuaW9cIixcImp1bGlvXCIsXCJhZ29zdG9cIixcInNlcHRpZW1icmVcIixcIm9jdHVicmVcIixcIm5vdmllbWJyZVwiLFwiZGljaWVtYnJlXCJdfSxkYXlzOntuYXJyb3c6W1wiRFwiLFwiTFwiLFwiTVwiLFwiWFwiLFwiSlwiLFwiVlwiLFwiU1wiXSxzaG9ydDpbXCJkb20uXCIsXCJsdW4uXCIsXCJtYXIuXCIsXCJtacOpLlwiLFwianVlLlwiLFwidmllLlwiLFwic8OhYi5cIl0sbG9uZzpbXCJkb21pbmdvXCIsXCJsdW5lc1wiLFwibWFydGVzXCIsXCJtacOpcmNvbGVzXCIsXCJqdWV2ZXNcIixcInZpZXJuZXNcIixcInPDoWJhZG9cIl19LGVyYXM6e25hcnJvdzpbXCJUYWlrYSAoNjQ14oCTNjUwKVwiLFwiSGFrdWNoaSAoNjUw4oCTNjcxKVwiLFwiSGFrdWjFjSAoNjcy4oCTNjg2KVwiLFwiU2h1Y2jFjSAoNjg24oCTNzAxKVwiLFwiVGFpaMWNICg3MDHigJM3MDQpXCIsXCJLZWl1biAoNzA04oCTNzA4KVwiLFwiV2FkxY0gKDcwOOKAkzcxNSlcIixcIlJlaWtpICg3MTXigJM3MTcpXCIsXCJZxY1yxY0gKDcxN+KAkzcyNClcIixcIkppbmtpICg3MjTigJM3MjkpXCIsXCJUZW5wecWNICg3MjnigJM3NDkpXCIsXCJUZW5wecWNLWthbXDFjSAoNzQ5LTc0OSlcIixcIlRlbnB5xY0tc2jFjWjFjSAoNzQ5LTc1NylcIixcIlRlbnB5xY0taMWNamkgKDc1Ny03NjUpXCIsXCJUZW5wecWNLWppbmdvICg3NjUtNzY3KVwiLFwiSmluZ28ta2VpdW4gKDc2Ny03NzApXCIsXCJIxY1raSAoNzcw4oCTNzgwKVwiLFwiVGVuLcWNICg3ODEtNzgyKVwiLFwiRW5yeWFrdSAoNzgy4oCTODA2KVwiLFwiRGFpZMWNICg4MDbigJM4MTApXCIsXCJLxY1uaW4gKDgxMOKAkzgyNClcIixcIlRlbmNoxY0gKDgyNOKAkzgzNClcIixcIkrFjXdhICg4MzTigJM4NDgpXCIsXCJLYWrFjSAoODQ44oCTODUxKVwiLFwiTmluanUgKDg1MeKAkzg1NClcIixcIlNhaWvFjSAoODU04oCTODU3KVwiLFwiVGVuLWFuICg4NTctODU5KVwiLFwiSsWNZ2FuICg4NTnigJM4NzcpXCIsXCJHYW5necWNICg4NzfigJM4ODUpXCIsXCJOaW5uYSAoODg14oCTODg5KVwiLFwiS2FucHnFjSAoODg54oCTODk4KVwiLFwiU2jFjXRhaSAoODk44oCTOTAxKVwiLFwiRW5naSAoOTAx4oCTOTIzKVwiLFwiRW5jaMWNICg5MjPigJM5MzEpXCIsXCJKxY1oZWkgKDkzMeKAkzkzOClcIixcIlRlbmd5xY0gKDkzOOKAkzk0NylcIixcIlRlbnJ5YWt1ICg5NDfigJM5NTcpXCIsXCJUZW50b2t1ICg5NTfigJM5NjEpXCIsXCLFjHdhICg5NjHigJM5NjQpXCIsXCJLxY1oxY0gKDk2NOKAkzk2OClcIixcIkFubmEgKDk2OOKAkzk3MClcIixcIlRlbnJva3UgKDk3MOKAkzk3MylcIixcIlRlbuKAmWVuICg5NzPigJM5NzYpXCIsXCJKxY1nZW4gKDk3NuKAkzk3OClcIixcIlRlbmdlbiAoOTc44oCTOTgzKVwiLFwiRWlrYW4gKDk4M+KAkzk4NSlcIixcIkthbm5hICg5ODXigJM5ODcpXCIsXCJFaWVuICg5ODfigJM5ODkpXCIsXCJFaXNvICg5ODnigJM5OTApXCIsXCJTaMWNcnlha3UgKDk5MOKAkzk5NSlcIixcIkNoxY10b2t1ICg5OTXigJM5OTkpXCIsXCJDaMWNaMWNICg5OTnigJMxMDA0KVwiLFwiS2Fua8WNICgxMDA04oCTMTAxMilcIixcIkNoxY13YSAoMTAxMuKAkzEwMTcpXCIsXCJLYW5uaW4gKDEwMTfigJMxMDIxKVwiLFwiSmlhbiAoMTAyMeKAkzEwMjQpXCIsXCJNYW5qdSAoMTAyNOKAkzEwMjgpXCIsXCJDaMWNZ2VuICgxMDI44oCTMTAzNylcIixcIkNoxY1yeWFrdSAoMTAzN+KAkzEwNDApXCIsXCJDaMWNa3nFqyAoMTA0MOKAkzEwNDQpXCIsXCJLYW50b2t1ICgxMDQ04oCTMTA0NilcIixcIkVpc2jFjSAoMTA0NuKAkzEwNTMpXCIsXCJUZW5naSAoMTA1M+KAkzEwNTgpXCIsXCJLxY1oZWkgKDEwNTjigJMxMDY1KVwiLFwiSmlyeWFrdSAoMTA2NeKAkzEwNjkpXCIsXCJFbmt5xasgKDEwNjnigJMxMDc0KVwiLFwiU2jFjWhvICgxMDc04oCTMTA3NylcIixcIlNoxY1yeWFrdSAoMTA3N+KAkzEwODEpXCIsXCJFaWjFjSAoMTA4MeKAkzEwODQpXCIsXCLFjHRva3UgKDEwODTigJMxMDg3KVwiLFwiS2FuamkgKDEwODfigJMxMDk0KVwiLFwiS2FoxY0gKDEwOTTigJMxMDk2KVwiLFwiRWljaMWNICgxMDk24oCTMTA5NylcIixcIkrFjXRva3UgKDEwOTfigJMxMDk5KVwiLFwiS8WNd2EgKDEwOTnigJMxMTA0KVwiLFwiQ2jFjWppICgxMTA04oCTMTEwNilcIixcIkthc2jFjSAoMTEwNuKAkzExMDgpXCIsXCJUZW5uaW4gKDExMDjigJMxMTEwKVwiLFwiVGVuLWVpICgxMTEwLTExMTMpXCIsXCJFaWt5xasgKDExMTPigJMxMTE4KVwiLFwiR2Vu4oCZZWkgKDExMTjigJMxMTIwKVwiLFwiSMWNYW4gKDExMjDigJMxMTI0KVwiLFwiVGVuamkgKDExMjTigJMxMTI2KVwiLFwiRGFpamkgKDExMjbigJMxMTMxKVwiLFwiVGVuc2jFjSAoMTEzMeKAkzExMzIpXCIsXCJDaMWNc2jFjSAoMTEzMuKAkzExMzUpXCIsXCJIxY1lbiAoMTEzNeKAkzExNDEpXCIsXCJFaWppICgxMTQx4oCTMTE0MilcIixcIkvFjWppICgxMTQy4oCTMTE0NClcIixcIlRlbuKAmXnFjSAoMTE0NOKAkzExNDUpXCIsXCJLecWrYW4gKDExNDXigJMxMTUxKVwiLFwiTmlucGVpICgxMTUx4oCTMTE1NClcIixcIkt5xatqdSAoMTE1NOKAkzExNTYpXCIsXCJIxY1nZW4gKDExNTbigJMxMTU5KVwiLFwiSGVpamkgKDExNTnigJMxMTYwKVwiLFwiRWlyeWFrdSAoMTE2MOKAkzExNjEpXCIsXCLFjGhvICgxMTYx4oCTMTE2MylcIixcIkNoxY1rYW4gKDExNjPigJMxMTY1KVwiLFwiRWltYW4gKDExNjXigJMxMTY2KVwiLFwiTmlu4oCZYW4gKDExNjbigJMxMTY5KVwiLFwiS2HFjSAoMTE2OeKAkzExNzEpXCIsXCJTaMWNYW4gKDExNzHigJMxMTc1KVwiLFwiQW5nZW4gKDExNzXigJMxMTc3KVwiLFwiSmlzaMWNICgxMTc34oCTMTE4MSlcIixcIlnFjXdhICgxMTgx4oCTMTE4MilcIixcIkp1ZWkgKDExODLigJMxMTg0KVwiLFwiR2Vucnlha3UgKDExODTigJMxMTg1KVwiLFwiQnVuamkgKDExODXigJMxMTkwKVwiLFwiS2Vua3nFqyAoMTE5MOKAkzExOTkpXCIsXCJTaMWNamkgKDExOTnigJMxMjAxKVwiLFwiS2VubmluICgxMjAx4oCTMTIwNClcIixcIkdlbmt5xasgKDEyMDTigJMxMjA2KVwiLFwiS2Vu4oCZZWkgKDEyMDbigJMxMjA3KVwiLFwiSsWNZ2VuICgxMjA34oCTMTIxMSlcIixcIktlbnJ5YWt1ICgxMjEx4oCTMTIxMylcIixcIktlbnDFjSAoMTIxM+KAkzEyMTkpXCIsXCJKxY1recWrICgxMjE54oCTMTIyMilcIixcIkrFjcWNICgxMjIy4oCTMTIyNClcIixcIkdlbm5pbiAoMTIyNOKAkzEyMjUpXCIsXCJLYXJva3UgKDEyMjXigJMxMjI3KVwiLFwiQW50ZWkgKDEyMjfigJMxMjI5KVwiLFwiS2Fua2kgKDEyMjnigJMxMjMyKVwiLFwiSsWNZWkgKDEyMzLigJMxMjMzKVwiLFwiVGVucHVrdSAoMTIzM+KAkzEyMzQpXCIsXCJCdW5yeWFrdSAoMTIzNOKAkzEyMzUpXCIsXCJLYXRlaSAoMTIzNeKAkzEyMzgpXCIsXCJSeWFrdW5pbiAoMTIzOOKAkzEyMzkpXCIsXCJFbuKAmcWNICgxMjM54oCTMTI0MClcIixcIk5pbmppICgxMjQw4oCTMTI0MylcIixcIkthbmdlbiAoMTI0M+KAkzEyNDcpXCIsXCJIxY1qaSAoMTI0N+KAkzEyNDkpXCIsXCJLZW5jaMWNICgxMjQ54oCTMTI1NilcIixcIkvFjWdlbiAoMTI1NuKAkzEyNTcpXCIsXCJTaMWNa2EgKDEyNTfigJMxMjU5KVwiLFwiU2jFjWdlbiAoMTI1OeKAkzEyNjApXCIsXCJCdW7igJnFjSAoMTI2MOKAkzEyNjEpXCIsXCJLxY1jaMWNICgxMjYx4oCTMTI2NClcIixcIkJ1buKAmWVpICgxMjY04oCTMTI3NSlcIixcIktlbmppICgxMjc14oCTMTI3OClcIixcIkvFjWFuICgxMjc44oCTMTI4OClcIixcIlNoxY3FjSAoMTI4OOKAkzEyOTMpXCIsXCJFaW5pbiAoMTI5M+KAkzEyOTkpXCIsXCJTaMWNYW4gKDEyOTnigJMxMzAyKVwiLFwiS2VuZ2VuICgxMzAy4oCTMTMwMylcIixcIkthZ2VuICgxMzAz4oCTMTMwNilcIixcIlRva3VqaSAoMTMwNuKAkzEzMDgpXCIsXCJFbmt5xY0gKDEzMDjigJMxMzExKVwiLFwixYxjaMWNICgxMzEx4oCTMTMxMilcIixcIlNoxY13YSAoMTMxMuKAkzEzMTcpXCIsXCJCdW5wxY0gKDEzMTfigJMxMzE5KVwiLFwiR2VuxY0gKDEzMTnigJMxMzIxKVwiLFwiR2Vua8WNICgxMzIx4oCTMTMyNClcIixcIlNoxY1jaMWrICgxMzI04oCTMTMyNilcIixcIkthcnlha3UgKDEzMjbigJMxMzI5KVwiLFwiR2VudG9rdSAoMTMyOeKAkzEzMzEpXCIsXCJHZW5rxY0gKDEzMzHigJMxMzM0KVwiLFwiS2VubXUgKDEzMzTigJMxMzM2KVwiLFwiRW5nZW4gKDEzMzbigJMxMzQwKVwiLFwiS8WNa29rdSAoMTM0MOKAkzEzNDYpXCIsXCJTaMWNaGVpICgxMzQ24oCTMTM3MClcIixcIktlbnRva3UgKDEzNzDigJMxMzcyKVwiLFwiQnVuY2jFqyAoMTM3MuKAkzEzNzUpXCIsXCJUZW5qdSAoMTM3NeKAkzEzNzkpXCIsXCJLxY1yeWFrdSAoMTM3OeKAkzEzODEpXCIsXCJLxY13YSAoMTM4MeKAkzEzODQpXCIsXCJHZW5jaMWrICgxMzg04oCTMTM5MilcIixcIk1laXRva3UgKDEzODTigJMxMzg3KVwiLFwiS2FrZWkgKDEzODfigJMxMzg5KVwiLFwiS8WNxY0gKDEzODnigJMxMzkwKVwiLFwiTWVpdG9rdSAoMTM5MOKAkzEzOTQpXCIsXCLFjGVpICgxMzk04oCTMTQyOClcIixcIlNoxY1jaMWNICgxNDI44oCTMTQyOSlcIixcIkVpa3nFjSAoMTQyOeKAkzE0NDEpXCIsXCJLYWtpdHN1ICgxNDQx4oCTMTQ0NClcIixcIkJ1buKAmWFuICgxNDQ04oCTMTQ0OSlcIixcIkjFjXRva3UgKDE0NDnigJMxNDUyKVwiLFwiS3nFjXRva3UgKDE0NTLigJMxNDU1KVwiLFwiS8WNc2jFjSAoMTQ1NeKAkzE0NTcpXCIsXCJDaMWNcm9rdSAoMTQ1N+KAkzE0NjApXCIsXCJLYW5zaMWNICgxNDYw4oCTMTQ2NilcIixcIkJ1bnNoxY0gKDE0NjbigJMxNDY3KVwiLFwixYxuaW4gKDE0NjfigJMxNDY5KVwiLFwiQnVubWVpICgxNDY54oCTMTQ4NylcIixcIkNoxY1recWNICgxNDg34oCTMTQ4OSlcIixcIkVudG9rdSAoMTQ4OeKAkzE0OTIpXCIsXCJNZWnFjSAoMTQ5MuKAkzE1MDEpXCIsXCJCdW5raSAoMTUwMeKAkzE1MDQpXCIsXCJFaXNoxY0gKDE1MDTigJMxNTIxKVwiLFwiVGFpZWkgKDE1MjHigJMxNTI4KVwiLFwiS3nFjXJva3UgKDE1MjjigJMxNTMyKVwiLFwiVGVuYnVuICgxNTMy4oCTMTU1NSlcIixcIkvFjWppICgxNTU14oCTMTU1OClcIixcIkVpcm9rdSAoMTU1OOKAkzE1NzApXCIsXCJHZW5raSAoMTU3MOKAkzE1NzMpXCIsXCJUZW5zaMWNICgxNTcz4oCTMTU5MilcIixcIkJ1bnJva3UgKDE1OTLigJMxNTk2KVwiLFwiS2VpY2jFjSAoMTU5NuKAkzE2MTUpXCIsXCJHZW5uYSAoMTYxNeKAkzE2MjQpXCIsXCJLYW7igJllaSAoMTYyNOKAkzE2NDQpXCIsXCJTaMWNaG8gKDE2NDTigJMxNjQ4KVwiLFwiS2VpYW4gKDE2NDjigJMxNjUyKVwiLFwiSsWNxY0gKDE2NTLigJMxNjU1KVwiLFwiTWVpcmVraSAoMTY1NeKAkzE2NTgpXCIsXCJNYW5qaSAoMTY1OOKAkzE2NjEpXCIsXCJLYW5idW4gKDE2NjHigJMxNjczKVwiLFwiRW5wxY0gKDE2NzPigJMxNjgxKVwiLFwiVGVubmEgKDE2ODHigJMxNjg0KVwiLFwiSsWNa3nFjSAoMTY4NOKAkzE2ODgpXCIsXCJHZW5yb2t1ICgxNjg44oCTMTcwNClcIixcIkjFjWVpICgxNzA04oCTMTcxMSlcIixcIlNoxY10b2t1ICgxNzEx4oCTMTcxNilcIixcIkt5xY1oxY0gKDE3MTbigJMxNzM2KVwiLFwiR2VuYnVuICgxNzM24oCTMTc0MSlcIixcIkthbnDFjSAoMTc0MeKAkzE3NDQpXCIsXCJFbmt5xY0gKDE3NDTigJMxNzQ4KVwiLFwiS2Fu4oCZZW4gKDE3NDjigJMxNzUxKVwiLFwiSMWNcmVraSAoMTc1MeKAkzE3NjQpXCIsXCJNZWl3YSAoMTc2NOKAkzE3NzIpXCIsXCJBbuKAmWVpICgxNzcy4oCTMTc4MSlcIixcIlRlbm1laSAoMTc4MeKAkzE3ODkpXCIsXCJLYW5zZWkgKDE3ODnigJMxODAxKVwiLFwiS3nFjXdhICgxODAx4oCTMTgwNClcIixcIkJ1bmthICgxODA04oCTMTgxOClcIixcIkJ1bnNlaSAoMTgxOOKAkzE4MzApXCIsXCJUZW5wxY0gKDE4MzDigJMxODQ0KVwiLFwiS8WNa2EgKDE4NDTigJMxODQ4KVwiLFwiS2FlaSAoMTg0OOKAkzE4NTQpXCIsXCJBbnNlaSAoMTg1NOKAkzE4NjApXCIsXCJNYW7igJllbiAoMTg2MOKAkzE4NjEpXCIsXCJCdW5recWrICgxODYx4oCTMTg2NClcIixcIkdlbmppICgxODY04oCTMTg2NSlcIixcIktlacWNICgxODY14oCTMTg2OClcIixcIk1cIixcIlRcIixcIlNcIixcIkhcIl0sc2hvcnQ6W1wiVGFpa2EgKDY0NeKAkzY1MClcIixcIkhha3VjaGkgKDY1MOKAkzY3MSlcIixcIkhha3VoxY0gKDY3MuKAkzY4NilcIixcIlNodWNoxY0gKDY4NuKAkzcwMSlcIixcIlRhaWjFjSAoNzAx4oCTNzA0KVwiLFwiS2VpdW4gKDcwNOKAkzcwOClcIixcIldhZMWNICg3MDjigJM3MTUpXCIsXCJSZWlraSAoNzE14oCTNzE3KVwiLFwiWcWNcsWNICg3MTfigJM3MjQpXCIsXCJKaW5raSAoNzI04oCTNzI5KVwiLFwiVGVucHnFjSAoNzI54oCTNzQ5KVwiLFwiVGVucHnFjS1rYW1wxY0gKDc0OS03NDkpXCIsXCJUZW5wecWNLXNoxY1oxY0gKDc0OS03NTcpXCIsXCJUZW5wecWNLWjFjWppICg3NTctNzY1KVwiLFwiVGVucHnFjS1qaW5nbyAoNzY1LTc2NylcIixcIkppbmdvLWtlaXVuICg3NjctNzcwKVwiLFwiSMWNa2kgKDc3MOKAkzc4MClcIixcIlRlbi3FjSAoNzgxLTc4MilcIixcIkVucnlha3UgKDc4MuKAkzgwNilcIixcIkRhaWTFjSAoODA24oCTODEwKVwiLFwiS8WNbmluICg4MTDigJM4MjQpXCIsXCJUZW5jaMWNICg4MjTigJM4MzQpXCIsXCJKxY13YSAoODM04oCTODQ4KVwiLFwiS2FqxY0gKDg0OOKAkzg1MSlcIixcIk5pbmp1ICg4NTHigJM4NTQpXCIsXCJTYWlrxY0gKDg1NOKAkzg1NylcIixcIlRlbi1hbiAoODU3LTg1OSlcIixcIkrFjWdhbiAoODU54oCTODc3KVwiLFwiR2FuZ3nFjSAoODc34oCTODg1KVwiLFwiTmlubmEgKDg4NeKAkzg4OSlcIixcIkthbnB5xY0gKDg4OeKAkzg5OClcIixcIlNoxY10YWkgKDg5OOKAkzkwMSlcIixcIkVuZ2kgKDkwMeKAkzkyMylcIixcIkVuY2jFjSAoOTIz4oCTOTMxKVwiLFwiSsWNaGVpICg5MzHigJM5MzgpXCIsXCJUZW5necWNICg5MzjigJM5NDcpXCIsXCJUZW5yeWFrdSAoOTQ34oCTOTU3KVwiLFwiVGVudG9rdSAoOTU34oCTOTYxKVwiLFwixYx3YSAoOTYx4oCTOTY0KVwiLFwiS8WNaMWNICg5NjTigJM5NjgpXCIsXCJBbm5hICg5NjjigJM5NzApXCIsXCJUZW5yb2t1ICg5NzDigJM5NzMpXCIsXCJUZW7igJllbiAoOTcz4oCTOTc2KVwiLFwiSsWNZ2VuICg5NzbigJM5NzgpXCIsXCJUZW5nZW4gKDk3OOKAkzk4MylcIixcIkVpa2FuICg5ODPigJM5ODUpXCIsXCJLYW5uYSAoOTg14oCTOTg3KVwiLFwiRWllbiAoOTg34oCTOTg5KVwiLFwiRWlzbyAoOTg54oCTOTkwKVwiLFwiU2jFjXJ5YWt1ICg5OTDigJM5OTUpXCIsXCJDaMWNdG9rdSAoOTk14oCTOTk5KVwiLFwiQ2jFjWjFjSAoOTk54oCTMTAwNClcIixcIkthbmvFjSAoMTAwNOKAkzEwMTIpXCIsXCJDaMWNd2EgKDEwMTLigJMxMDE3KVwiLFwiS2FubmluICgxMDE34oCTMTAyMSlcIixcIkppYW4gKDEwMjHigJMxMDI0KVwiLFwiTWFuanUgKDEwMjTigJMxMDI4KVwiLFwiQ2jFjWdlbiAoMTAyOOKAkzEwMzcpXCIsXCJDaMWNcnlha3UgKDEwMzfigJMxMDQwKVwiLFwiQ2jFjWt5xasgKDEwNDDigJMxMDQ0KVwiLFwiS2FudG9rdSAoMTA0NOKAkzEwNDYpXCIsXCJFaXNoxY0gKDEwNDbigJMxMDUzKVwiLFwiVGVuZ2kgKDEwNTPigJMxMDU4KVwiLFwiS8WNaGVpICgxMDU44oCTMTA2NSlcIixcIkppcnlha3UgKDEwNjXigJMxMDY5KVwiLFwiRW5recWrICgxMDY54oCTMTA3NClcIixcIlNoxY1obyAoMTA3NOKAkzEwNzcpXCIsXCJTaMWNcnlha3UgKDEwNzfigJMxMDgxKVwiLFwiRWloxY0gKDEwODHigJMxMDg0KVwiLFwixYx0b2t1ICgxMDg04oCTMTA4NylcIixcIkthbmppICgxMDg34oCTMTA5NClcIixcIkthaMWNICgxMDk04oCTMTA5NilcIixcIkVpY2jFjSAoMTA5NuKAkzEwOTcpXCIsXCJKxY10b2t1ICgxMDk34oCTMTA5OSlcIixcIkvFjXdhICgxMDk54oCTMTEwNClcIixcIkNoxY1qaSAoMTEwNOKAkzExMDYpXCIsXCJLYXNoxY0gKDExMDbigJMxMTA4KVwiLFwiVGVubmluICgxMTA44oCTMTExMClcIixcIlRlbi1laSAoMTExMC0xMTEzKVwiLFwiRWlrecWrICgxMTEz4oCTMTExOClcIixcIkdlbuKAmWVpICgxMTE44oCTMTEyMClcIixcIkjFjWFuICgxMTIw4oCTMTEyNClcIixcIlRlbmppICgxMTI04oCTMTEyNilcIixcIkRhaWppICgxMTI24oCTMTEzMSlcIixcIlRlbnNoxY0gKDExMzHigJMxMTMyKVwiLFwiQ2jFjXNoxY0gKDExMzLigJMxMTM1KVwiLFwiSMWNZW4gKDExMzXigJMxMTQxKVwiLFwiRWlqaSAoMTE0MeKAkzExNDIpXCIsXCJLxY1qaSAoMTE0MuKAkzExNDQpXCIsXCJUZW7igJl5xY0gKDExNDTigJMxMTQ1KVwiLFwiS3nFq2FuICgxMTQ14oCTMTE1MSlcIixcIk5pbnBlaSAoMTE1MeKAkzExNTQpXCIsXCJLecWranUgKDExNTTigJMxMTU2KVwiLFwiSMWNZ2VuICgxMTU24oCTMTE1OSlcIixcIkhlaWppICgxMTU54oCTMTE2MClcIixcIkVpcnlha3UgKDExNjDigJMxMTYxKVwiLFwixYxobyAoMTE2MeKAkzExNjMpXCIsXCJDaMWNa2FuICgxMTYz4oCTMTE2NSlcIixcIkVpbWFuICgxMTY14oCTMTE2NilcIixcIk5pbuKAmWFuICgxMTY24oCTMTE2OSlcIixcIkthxY0gKDExNjnigJMxMTcxKVwiLFwiU2jFjWFuICgxMTcx4oCTMTE3NSlcIixcIkFuZ2VuICgxMTc14oCTMTE3NylcIixcIkppc2jFjSAoMTE3N+KAkzExODEpXCIsXCJZxY13YSAoMTE4MeKAkzExODIpXCIsXCJKdWVpICgxMTgy4oCTMTE4NClcIixcIkdlbnJ5YWt1ICgxMTg04oCTMTE4NSlcIixcIkJ1bmppICgxMTg14oCTMTE5MClcIixcIktlbmt5xasgKDExOTDigJMxMTk5KVwiLFwiU2jFjWppICgxMTk54oCTMTIwMSlcIixcIktlbm5pbiAoMTIwMeKAkzEyMDQpXCIsXCJHZW5recWrICgxMjA04oCTMTIwNilcIixcIktlbuKAmWVpICgxMjA24oCTMTIwNylcIixcIkrFjWdlbiAoMTIwN+KAkzEyMTEpXCIsXCJLZW5yeWFrdSAoMTIxMeKAkzEyMTMpXCIsXCJLZW5wxY0gKDEyMTPigJMxMjE5KVwiLFwiSsWNa3nFqyAoMTIxOeKAkzEyMjIpXCIsXCJKxY3FjSAoMTIyMuKAkzEyMjQpXCIsXCJHZW5uaW4gKDEyMjTigJMxMjI1KVwiLFwiS2Fyb2t1ICgxMjI14oCTMTIyNylcIixcIkFudGVpICgxMjI34oCTMTIyOSlcIixcIkthbmtpICgxMjI54oCTMTIzMilcIixcIkrFjWVpICgxMjMy4oCTMTIzMylcIixcIlRlbnB1a3UgKDEyMzPigJMxMjM0KVwiLFwiQnVucnlha3UgKDEyMzTigJMxMjM1KVwiLFwiS2F0ZWkgKDEyMzXigJMxMjM4KVwiLFwiUnlha3VuaW4gKDEyMzjigJMxMjM5KVwiLFwiRW7igJnFjSAoMTIzOeKAkzEyNDApXCIsXCJOaW5qaSAoMTI0MOKAkzEyNDMpXCIsXCJLYW5nZW4gKDEyNDPigJMxMjQ3KVwiLFwiSMWNamkgKDEyNDfigJMxMjQ5KVwiLFwiS2VuY2jFjSAoMTI0OeKAkzEyNTYpXCIsXCJLxY1nZW4gKDEyNTbigJMxMjU3KVwiLFwiU2jFjWthICgxMjU34oCTMTI1OSlcIixcIlNoxY1nZW4gKDEyNTnigJMxMjYwKVwiLFwiQnVu4oCZxY0gKDEyNjDigJMxMjYxKVwiLFwiS8WNY2jFjSAoMTI2MeKAkzEyNjQpXCIsXCJCdW7igJllaSAoMTI2NOKAkzEyNzUpXCIsXCJLZW5qaSAoMTI3NeKAkzEyNzgpXCIsXCJLxY1hbiAoMTI3OOKAkzEyODgpXCIsXCJTaMWNxY0gKDEyODjigJMxMjkzKVwiLFwiRWluaW4gKDEyOTPigJMxMjk5KVwiLFwiU2jFjWFuICgxMjk54oCTMTMwMilcIixcIktlbmdlbiAoMTMwMuKAkzEzMDMpXCIsXCJLYWdlbiAoMTMwM+KAkzEzMDYpXCIsXCJUb2t1amkgKDEzMDbigJMxMzA4KVwiLFwiRW5recWNICgxMzA44oCTMTMxMSlcIixcIsWMY2jFjSAoMTMxMeKAkzEzMTIpXCIsXCJTaMWNd2EgKDEzMTLigJMxMzE3KVwiLFwiQnVucMWNICgxMzE34oCTMTMxOSlcIixcIkdlbsWNICgxMzE54oCTMTMyMSlcIixcIkdlbmvFjSAoMTMyMeKAkzEzMjQpXCIsXCJTaMWNY2jFqyAoMTMyNOKAkzEzMjYpXCIsXCJLYXJ5YWt1ICgxMzI24oCTMTMyOSlcIixcIkdlbnRva3UgKDEzMjnigJMxMzMxKVwiLFwiR2Vua8WNICgxMzMx4oCTMTMzNClcIixcIktlbm11ICgxMzM04oCTMTMzNilcIixcIkVuZ2VuICgxMzM24oCTMTM0MClcIixcIkvFjWtva3UgKDEzNDDigJMxMzQ2KVwiLFwiU2jFjWhlaSAoMTM0NuKAkzEzNzApXCIsXCJLZW50b2t1ICgxMzcw4oCTMTM3MilcIixcIkJ1bmNoxasgKDEzNzLigJMxMzc1KVwiLFwiVGVuanUgKDEzNzXigJMxMzc5KVwiLFwiS8WNcnlha3UgKDEzNznigJMxMzgxKVwiLFwiS8WNd2EgKDEzODHigJMxMzg0KVwiLFwiR2VuY2jFqyAoMTM4NOKAkzEzOTIpXCIsXCJNZWl0b2t1ICgxMzg04oCTMTM4NylcIixcIktha2VpICgxMzg34oCTMTM4OSlcIixcIkvFjcWNICgxMzg54oCTMTM5MClcIixcIk1laXRva3UgKDEzOTDigJMxMzk0KVwiLFwixYxlaSAoMTM5NOKAkzE0MjgpXCIsXCJTaMWNY2jFjSAoMTQyOOKAkzE0MjkpXCIsXCJFaWt5xY0gKDE0MjnigJMxNDQxKVwiLFwiS2FraXRzdSAoMTQ0MeKAkzE0NDQpXCIsXCJCdW7igJlhbiAoMTQ0NOKAkzE0NDkpXCIsXCJIxY10b2t1ICgxNDQ54oCTMTQ1MilcIixcIkt5xY10b2t1ICgxNDUy4oCTMTQ1NSlcIixcIkvFjXNoxY0gKDE0NTXigJMxNDU3KVwiLFwiQ2jFjXJva3UgKDE0NTfigJMxNDYwKVwiLFwiS2Fuc2jFjSAoMTQ2MOKAkzE0NjYpXCIsXCJCdW5zaMWNICgxNDY24oCTMTQ2NylcIixcIsWMbmluICgxNDY34oCTMTQ2OSlcIixcIkJ1bm1laSAoMTQ2OeKAkzE0ODcpXCIsXCJDaMWNa3nFjSAoMTQ4N+KAkzE0ODkpXCIsXCJFbnRva3UgKDE0ODnigJMxNDkyKVwiLFwiTWVpxY0gKDE0OTLigJMxNTAxKVwiLFwiQnVua2kgKDE1MDHigJMxNTA0KVwiLFwiRWlzaMWNICgxNTA04oCTMTUyMSlcIixcIlRhaWVpICgxNTIx4oCTMTUyOClcIixcIkt5xY1yb2t1ICgxNTI44oCTMTUzMilcIixcIlRlbmJ1biAoMTUzMuKAkzE1NTUpXCIsXCJLxY1qaSAoMTU1NeKAkzE1NTgpXCIsXCJFaXJva3UgKDE1NTjigJMxNTcwKVwiLFwiR2Vua2kgKDE1NzDigJMxNTczKVwiLFwiVGVuc2jFjSAoMTU3M+KAkzE1OTIpXCIsXCJCdW5yb2t1ICgxNTky4oCTMTU5NilcIixcIktlaWNoxY0gKDE1OTbigJMxNjE1KVwiLFwiR2VubmEgKDE2MTXigJMxNjI0KVwiLFwiS2Fu4oCZZWkgKDE2MjTigJMxNjQ0KVwiLFwiU2jFjWhvICgxNjQ04oCTMTY0OClcIixcIktlaWFuICgxNjQ44oCTMTY1MilcIixcIkrFjcWNICgxNjUy4oCTMTY1NSlcIixcIk1laXJla2kgKDE2NTXigJMxNjU4KVwiLFwiTWFuamkgKDE2NTjigJMxNjYxKVwiLFwiS2FuYnVuICgxNjYx4oCTMTY3MylcIixcIkVucMWNICgxNjcz4oCTMTY4MSlcIixcIlRlbm5hICgxNjgx4oCTMTY4NClcIixcIkrFjWt5xY0gKDE2ODTigJMxNjg4KVwiLFwiR2Vucm9rdSAoMTY4OOKAkzE3MDQpXCIsXCJIxY1laSAoMTcwNOKAkzE3MTEpXCIsXCJTaMWNdG9rdSAoMTcxMeKAkzE3MTYpXCIsXCJLecWNaMWNICgxNzE24oCTMTczNilcIixcIkdlbmJ1biAoMTczNuKAkzE3NDEpXCIsXCJLYW5wxY0gKDE3NDHigJMxNzQ0KVwiLFwiRW5recWNICgxNzQ04oCTMTc0OClcIixcIkthbuKAmWVuICgxNzQ44oCTMTc1MSlcIixcIkjFjXJla2kgKDE3NTHigJMxNzY0KVwiLFwiTWVpd2EgKDE3NjTigJMxNzcyKVwiLFwiQW7igJllaSAoMTc3MuKAkzE3ODEpXCIsXCJUZW5tZWkgKDE3ODHigJMxNzg5KVwiLFwiS2Fuc2VpICgxNzg54oCTMTgwMSlcIixcIkt5xY13YSAoMTgwMeKAkzE4MDQpXCIsXCJCdW5rYSAoMTgwNOKAkzE4MTgpXCIsXCJCdW5zZWkgKDE4MTjigJMxODMwKVwiLFwiVGVucMWNICgxODMw4oCTMTg0NClcIixcIkvFjWthICgxODQ04oCTMTg0OClcIixcIkthZWkgKDE4NDjigJMxODU0KVwiLFwiQW5zZWkgKDE4NTTigJMxODYwKVwiLFwiTWFu4oCZZW4gKDE4NjDigJMxODYxKVwiLFwiQnVua3nFqyAoMTg2MeKAkzE4NjQpXCIsXCJHZW5qaSAoMTg2NOKAkzE4NjUpXCIsXCJLZWnFjSAoMTg2NeKAkzE4NjgpXCIsXCJNZWlqaVwiLFwiVGFpc2jFjVwiLFwiU2jFjXdhXCIsXCJIZWlzZWlcIl0sbG9uZzpbXCJUYWlrYSAoNjQ14oCTNjUwKVwiLFwiSGFrdWNoaSAoNjUw4oCTNjcxKVwiLFwiSGFrdWjFjSAoNjcy4oCTNjg2KVwiLFwiU2h1Y2jFjSAoNjg24oCTNzAxKVwiLFwiVGFpaMWNICg3MDHigJM3MDQpXCIsXCJLZWl1biAoNzA04oCTNzA4KVwiLFwiV2FkxY0gKDcwOOKAkzcxNSlcIixcIlJlaWtpICg3MTXigJM3MTcpXCIsXCJZxY1yxY0gKDcxN+KAkzcyNClcIixcIkppbmtpICg3MjTigJM3MjkpXCIsXCJUZW5wecWNICg3MjnigJM3NDkpXCIsXCJUZW5wecWNLWthbXDFjSAoNzQ5LTc0OSlcIixcIlRlbnB5xY0tc2jFjWjFjSAoNzQ5LTc1NylcIixcIlRlbnB5xY0taMWNamkgKDc1Ny03NjUpXCIsXCJUZW5wecWNLWppbmdvICg3NjUtNzY3KVwiLFwiSmluZ28ta2VpdW4gKDc2Ny03NzApXCIsXCJIxY1raSAoNzcw4oCTNzgwKVwiLFwiVGVuLcWNICg3ODEtNzgyKVwiLFwiRW5yeWFrdSAoNzgy4oCTODA2KVwiLFwiRGFpZMWNICg4MDbigJM4MTApXCIsXCJLxY1uaW4gKDgxMOKAkzgyNClcIixcIlRlbmNoxY0gKDgyNOKAkzgzNClcIixcIkrFjXdhICg4MzTigJM4NDgpXCIsXCJLYWrFjSAoODQ44oCTODUxKVwiLFwiTmluanUgKDg1MeKAkzg1NClcIixcIlNhaWvFjSAoODU04oCTODU3KVwiLFwiVGVuLWFuICg4NTctODU5KVwiLFwiSsWNZ2FuICg4NTnigJM4NzcpXCIsXCJHYW5necWNICg4NzfigJM4ODUpXCIsXCJOaW5uYSAoODg14oCTODg5KVwiLFwiS2FucHnFjSAoODg54oCTODk4KVwiLFwiU2jFjXRhaSAoODk44oCTOTAxKVwiLFwiRW5naSAoOTAx4oCTOTIzKVwiLFwiRW5jaMWNICg5MjPigJM5MzEpXCIsXCJKxY1oZWkgKDkzMeKAkzkzOClcIixcIlRlbmd5xY0gKDkzOOKAkzk0NylcIixcIlRlbnJ5YWt1ICg5NDfigJM5NTcpXCIsXCJUZW50b2t1ICg5NTfigJM5NjEpXCIsXCLFjHdhICg5NjHigJM5NjQpXCIsXCJLxY1oxY0gKDk2NOKAkzk2OClcIixcIkFubmEgKDk2OOKAkzk3MClcIixcIlRlbnJva3UgKDk3MOKAkzk3MylcIixcIlRlbuKAmWVuICg5NzPigJM5NzYpXCIsXCJKxY1nZW4gKDk3NuKAkzk3OClcIixcIlRlbmdlbiAoOTc44oCTOTgzKVwiLFwiRWlrYW4gKDk4M+KAkzk4NSlcIixcIkthbm5hICg5ODXigJM5ODcpXCIsXCJFaWVuICg5ODfigJM5ODkpXCIsXCJFaXNvICg5ODnigJM5OTApXCIsXCJTaMWNcnlha3UgKDk5MOKAkzk5NSlcIixcIkNoxY10b2t1ICg5OTXigJM5OTkpXCIsXCJDaMWNaMWNICg5OTnigJMxMDA0KVwiLFwiS2Fua8WNICgxMDA04oCTMTAxMilcIixcIkNoxY13YSAoMTAxMuKAkzEwMTcpXCIsXCJLYW5uaW4gKDEwMTfigJMxMDIxKVwiLFwiSmlhbiAoMTAyMeKAkzEwMjQpXCIsXCJNYW5qdSAoMTAyNOKAkzEwMjgpXCIsXCJDaMWNZ2VuICgxMDI44oCTMTAzNylcIixcIkNoxY1yeWFrdSAoMTAzN+KAkzEwNDApXCIsXCJDaMWNa3nFqyAoMTA0MOKAkzEwNDQpXCIsXCJLYW50b2t1ICgxMDQ04oCTMTA0NilcIixcIkVpc2jFjSAoMTA0NuKAkzEwNTMpXCIsXCJUZW5naSAoMTA1M+KAkzEwNTgpXCIsXCJLxY1oZWkgKDEwNTjigJMxMDY1KVwiLFwiSmlyeWFrdSAoMTA2NeKAkzEwNjkpXCIsXCJFbmt5xasgKDEwNjnigJMxMDc0KVwiLFwiU2jFjWhvICgxMDc04oCTMTA3NylcIixcIlNoxY1yeWFrdSAoMTA3N+KAkzEwODEpXCIsXCJFaWjFjSAoMTA4MeKAkzEwODQpXCIsXCLFjHRva3UgKDEwODTigJMxMDg3KVwiLFwiS2FuamkgKDEwODfigJMxMDk0KVwiLFwiS2FoxY0gKDEwOTTigJMxMDk2KVwiLFwiRWljaMWNICgxMDk24oCTMTA5NylcIixcIkrFjXRva3UgKDEwOTfigJMxMDk5KVwiLFwiS8WNd2EgKDEwOTnigJMxMTA0KVwiLFwiQ2jFjWppICgxMTA04oCTMTEwNilcIixcIkthc2jFjSAoMTEwNuKAkzExMDgpXCIsXCJUZW5uaW4gKDExMDjigJMxMTEwKVwiLFwiVGVuLWVpICgxMTEwLTExMTMpXCIsXCJFaWt5xasgKDExMTPigJMxMTE4KVwiLFwiR2Vu4oCZZWkgKDExMTjigJMxMTIwKVwiLFwiSMWNYW4gKDExMjDigJMxMTI0KVwiLFwiVGVuamkgKDExMjTigJMxMTI2KVwiLFwiRGFpamkgKDExMjbigJMxMTMxKVwiLFwiVGVuc2jFjSAoMTEzMeKAkzExMzIpXCIsXCJDaMWNc2jFjSAoMTEzMuKAkzExMzUpXCIsXCJIxY1lbiAoMTEzNeKAkzExNDEpXCIsXCJFaWppICgxMTQx4oCTMTE0MilcIixcIkvFjWppICgxMTQy4oCTMTE0NClcIixcIlRlbuKAmXnFjSAoMTE0NOKAkzExNDUpXCIsXCJLecWrYW4gKDExNDXigJMxMTUxKVwiLFwiTmlucGVpICgxMTUx4oCTMTE1NClcIixcIkt5xatqdSAoMTE1NOKAkzExNTYpXCIsXCJIxY1nZW4gKDExNTbigJMxMTU5KVwiLFwiSGVpamkgKDExNTnigJMxMTYwKVwiLFwiRWlyeWFrdSAoMTE2MOKAkzExNjEpXCIsXCLFjGhvICgxMTYx4oCTMTE2MylcIixcIkNoxY1rYW4gKDExNjPigJMxMTY1KVwiLFwiRWltYW4gKDExNjXigJMxMTY2KVwiLFwiTmlu4oCZYW4gKDExNjbigJMxMTY5KVwiLFwiS2HFjSAoMTE2OeKAkzExNzEpXCIsXCJTaMWNYW4gKDExNzHigJMxMTc1KVwiLFwiQW5nZW4gKDExNzXigJMxMTc3KVwiLFwiSmlzaMWNICgxMTc34oCTMTE4MSlcIixcIlnFjXdhICgxMTgx4oCTMTE4MilcIixcIkp1ZWkgKDExODLigJMxMTg0KVwiLFwiR2Vucnlha3UgKDExODTigJMxMTg1KVwiLFwiQnVuamkgKDExODXigJMxMTkwKVwiLFwiS2Vua3nFqyAoMTE5MOKAkzExOTkpXCIsXCJTaMWNamkgKDExOTnigJMxMjAxKVwiLFwiS2VubmluICgxMjAx4oCTMTIwNClcIixcIkdlbmt5xasgKDEyMDTigJMxMjA2KVwiLFwiS2Vu4oCZZWkgKDEyMDbigJMxMjA3KVwiLFwiSsWNZ2VuICgxMjA34oCTMTIxMSlcIixcIktlbnJ5YWt1ICgxMjEx4oCTMTIxMylcIixcIktlbnDFjSAoMTIxM+KAkzEyMTkpXCIsXCJKxY1recWrICgxMjE54oCTMTIyMilcIixcIkrFjcWNICgxMjIy4oCTMTIyNClcIixcIkdlbm5pbiAoMTIyNOKAkzEyMjUpXCIsXCJLYXJva3UgKDEyMjXigJMxMjI3KVwiLFwiQW50ZWkgKDEyMjfigJMxMjI5KVwiLFwiS2Fua2kgKDEyMjnigJMxMjMyKVwiLFwiSsWNZWkgKDEyMzLigJMxMjMzKVwiLFwiVGVucHVrdSAoMTIzM+KAkzEyMzQpXCIsXCJCdW5yeWFrdSAoMTIzNOKAkzEyMzUpXCIsXCJLYXRlaSAoMTIzNeKAkzEyMzgpXCIsXCJSeWFrdW5pbiAoMTIzOOKAkzEyMzkpXCIsXCJFbuKAmcWNICgxMjM54oCTMTI0MClcIixcIk5pbmppICgxMjQw4oCTMTI0MylcIixcIkthbmdlbiAoMTI0M+KAkzEyNDcpXCIsXCJIxY1qaSAoMTI0N+KAkzEyNDkpXCIsXCJLZW5jaMWNICgxMjQ54oCTMTI1NilcIixcIkvFjWdlbiAoMTI1NuKAkzEyNTcpXCIsXCJTaMWNa2EgKDEyNTfigJMxMjU5KVwiLFwiU2jFjWdlbiAoMTI1OeKAkzEyNjApXCIsXCJCdW7igJnFjSAoMTI2MOKAkzEyNjEpXCIsXCJLxY1jaMWNICgxMjYx4oCTMTI2NClcIixcIkJ1buKAmWVpICgxMjY04oCTMTI3NSlcIixcIktlbmppICgxMjc14oCTMTI3OClcIixcIkvFjWFuICgxMjc44oCTMTI4OClcIixcIlNoxY3FjSAoMTI4OOKAkzEyOTMpXCIsXCJFaW5pbiAoMTI5M+KAkzEyOTkpXCIsXCJTaMWNYW4gKDEyOTnigJMxMzAyKVwiLFwiS2VuZ2VuICgxMzAy4oCTMTMwMylcIixcIkthZ2VuICgxMzAz4oCTMTMwNilcIixcIlRva3VqaSAoMTMwNuKAkzEzMDgpXCIsXCJFbmt5xY0gKDEzMDjigJMxMzExKVwiLFwixYxjaMWNICgxMzEx4oCTMTMxMilcIixcIlNoxY13YSAoMTMxMuKAkzEzMTcpXCIsXCJCdW5wxY0gKDEzMTfigJMxMzE5KVwiLFwiR2VuxY0gKDEzMTnigJMxMzIxKVwiLFwiR2Vua8WNICgxMzIx4oCTMTMyNClcIixcIlNoxY1jaMWrICgxMzI04oCTMTMyNilcIixcIkthcnlha3UgKDEzMjbigJMxMzI5KVwiLFwiR2VudG9rdSAoMTMyOeKAkzEzMzEpXCIsXCJHZW5rxY0gKDEzMzHigJMxMzM0KVwiLFwiS2VubXUgKDEzMzTigJMxMzM2KVwiLFwiRW5nZW4gKDEzMzbigJMxMzQwKVwiLFwiS8WNa29rdSAoMTM0MOKAkzEzNDYpXCIsXCJTaMWNaGVpICgxMzQ24oCTMTM3MClcIixcIktlbnRva3UgKDEzNzDigJMxMzcyKVwiLFwiQnVuY2jFqyAoMTM3MuKAkzEzNzUpXCIsXCJUZW5qdSAoMTM3NeKAkzEzNzkpXCIsXCJLxY1yeWFrdSAoMTM3OeKAkzEzODEpXCIsXCJLxY13YSAoMTM4MeKAkzEzODQpXCIsXCJHZW5jaMWrICgxMzg04oCTMTM5MilcIixcIk1laXRva3UgKDEzODTigJMxMzg3KVwiLFwiS2FrZWkgKDEzODfigJMxMzg5KVwiLFwiS8WNxY0gKDEzODnigJMxMzkwKVwiLFwiTWVpdG9rdSAoMTM5MOKAkzEzOTQpXCIsXCLFjGVpICgxMzk04oCTMTQyOClcIixcIlNoxY1jaMWNICgxNDI44oCTMTQyOSlcIixcIkVpa3nFjSAoMTQyOeKAkzE0NDEpXCIsXCJLYWtpdHN1ICgxNDQx4oCTMTQ0NClcIixcIkJ1buKAmWFuICgxNDQ04oCTMTQ0OSlcIixcIkjFjXRva3UgKDE0NDnigJMxNDUyKVwiLFwiS3nFjXRva3UgKDE0NTLigJMxNDU1KVwiLFwiS8WNc2jFjSAoMTQ1NeKAkzE0NTcpXCIsXCJDaMWNcm9rdSAoMTQ1N+KAkzE0NjApXCIsXCJLYW5zaMWNICgxNDYw4oCTMTQ2NilcIixcIkJ1bnNoxY0gKDE0NjbigJMxNDY3KVwiLFwixYxuaW4gKDE0NjfigJMxNDY5KVwiLFwiQnVubWVpICgxNDY54oCTMTQ4NylcIixcIkNoxY1recWNICgxNDg34oCTMTQ4OSlcIixcIkVudG9rdSAoMTQ4OeKAkzE0OTIpXCIsXCJNZWnFjSAoMTQ5MuKAkzE1MDEpXCIsXCJCdW5raSAoMTUwMeKAkzE1MDQpXCIsXCJFaXNoxY0gKDE1MDTigJMxNTIxKVwiLFwiVGFpZWkgKDE1MjHigJMxNTI4KVwiLFwiS3nFjXJva3UgKDE1MjjigJMxNTMyKVwiLFwiVGVuYnVuICgxNTMy4oCTMTU1NSlcIixcIkvFjWppICgxNTU14oCTMTU1OClcIixcIkVpcm9rdSAoMTU1OOKAkzE1NzApXCIsXCJHZW5raSAoMTU3MOKAkzE1NzMpXCIsXCJUZW5zaMWNICgxNTcz4oCTMTU5MilcIixcIkJ1bnJva3UgKDE1OTLigJMxNTk2KVwiLFwiS2VpY2jFjSAoMTU5NuKAkzE2MTUpXCIsXCJHZW5uYSAoMTYxNeKAkzE2MjQpXCIsXCJLYW7igJllaSAoMTYyNOKAkzE2NDQpXCIsXCJTaMWNaG8gKDE2NDTigJMxNjQ4KVwiLFwiS2VpYW4gKDE2NDjigJMxNjUyKVwiLFwiSsWNxY0gKDE2NTLigJMxNjU1KVwiLFwiTWVpcmVraSAoMTY1NeKAkzE2NTgpXCIsXCJNYW5qaSAoMTY1OOKAkzE2NjEpXCIsXCJLYW5idW4gKDE2NjHigJMxNjczKVwiLFwiRW5wxY0gKDE2NzPigJMxNjgxKVwiLFwiVGVubmEgKDE2ODHigJMxNjg0KVwiLFwiSsWNa3nFjSAoMTY4NOKAkzE2ODgpXCIsXCJHZW5yb2t1ICgxNjg44oCTMTcwNClcIixcIkjFjWVpICgxNzA04oCTMTcxMSlcIixcIlNoxY10b2t1ICgxNzEx4oCTMTcxNilcIixcIkt5xY1oxY0gKDE3MTbigJMxNzM2KVwiLFwiR2VuYnVuICgxNzM24oCTMTc0MSlcIixcIkthbnDFjSAoMTc0MeKAkzE3NDQpXCIsXCJFbmt5xY0gKDE3NDTigJMxNzQ4KVwiLFwiS2Fu4oCZZW4gKDE3NDjigJMxNzUxKVwiLFwiSMWNcmVraSAoMTc1MeKAkzE3NjQpXCIsXCJNZWl3YSAoMTc2NOKAkzE3NzIpXCIsXCJBbuKAmWVpICgxNzcy4oCTMTc4MSlcIixcIlRlbm1laSAoMTc4MeKAkzE3ODkpXCIsXCJLYW5zZWkgKDE3ODnigJMxODAxKVwiLFwiS3nFjXdhICgxODAx4oCTMTgwNClcIixcIkJ1bmthICgxODA04oCTMTgxOClcIixcIkJ1bnNlaSAoMTgxOOKAkzE4MzApXCIsXCJUZW5wxY0gKDE4MzDigJMxODQ0KVwiLFwiS8WNa2EgKDE4NDTigJMxODQ4KVwiLFwiS2FlaSAoMTg0OOKAkzE4NTQpXCIsXCJBbnNlaSAoMTg1NOKAkzE4NjApXCIsXCJNYW7igJllbiAoMTg2MOKAkzE4NjEpXCIsXCJCdW5recWrICgxODYx4oCTMTg2NClcIixcIkdlbmppICgxODY04oCTMTg2NSlcIixcIktlacWNICgxODY14oCTMTg2OClcIixcIk1laWppXCIsXCJUYWlzaMWNXCIsXCJTaMWNd2FcIixcIkhlaXNlaVwiXX0sZGF5UGVyaW9kczp7YW06XCJhLiBtLlwiLHBtOlwicC4gbS5cIn19LHBlcnNpYW46e21vbnRoczp7bmFycm93OltcIjFcIixcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIjEwXCIsXCIxMVwiLFwiMTJcIl0sc2hvcnQ6W1wiRmFydmFyZGluXCIsXCJPcmRpYmVoZXNodFwiLFwiS2hvcmRhZFwiLFwiVGlyXCIsXCJNb3JkYWRcIixcIlNoYWhyaXZhclwiLFwiTWVoclwiLFwiQWJhblwiLFwiQXphclwiLFwiRGV5XCIsXCJCYWhtYW5cIixcIkVzZmFuZFwiXSxsb25nOltcIkZhcnZhcmRpblwiLFwiT3JkaWJlaGVzaHRcIixcIktob3JkYWRcIixcIlRpclwiLFwiTW9yZGFkXCIsXCJTaGFocml2YXJcIixcIk1laHJcIixcIkFiYW5cIixcIkF6YXJcIixcIkRleVwiLFwiQmFobWFuXCIsXCJFc2ZhbmRcIl19LGRheXM6e25hcnJvdzpbXCJEXCIsXCJMXCIsXCJNXCIsXCJYXCIsXCJKXCIsXCJWXCIsXCJTXCJdLHNob3J0OltcImRvbS5cIixcImx1bi5cIixcIm1hci5cIixcIm1pw6kuXCIsXCJqdWUuXCIsXCJ2aWUuXCIsXCJzw6FiLlwiXSxsb25nOltcImRvbWluZ29cIixcImx1bmVzXCIsXCJtYXJ0ZXNcIixcIm1pw6lyY29sZXNcIixcImp1ZXZlc1wiLFwidmllcm5lc1wiLFwic8OhYmFkb1wiXX0sZXJhczp7bmFycm93OltcIkFQXCJdLHNob3J0OltcIkFQXCJdLGxvbmc6W1wiQVBcIl19LGRheVBlcmlvZHM6e2FtOlwiYS4gbS5cIixwbTpcInAuIG0uXCJ9fSxyb2M6e21vbnRoczp7bmFycm93OltcIkVcIixcIkZcIixcIk1cIixcIkFcIixcIk1cIixcIkpcIixcIkpcIixcIkFcIixcIlNcIixcIk9cIixcIk5cIixcIkRcIl0sc2hvcnQ6W1wiZW5lLlwiLFwiZmViLlwiLFwibWFyLlwiLFwiYWJyLlwiLFwibWF5LlwiLFwianVuLlwiLFwianVsLlwiLFwiYWdvLlwiLFwic2VwdC5cIixcIm9jdC5cIixcIm5vdi5cIixcImRpYy5cIl0sbG9uZzpbXCJlbmVyb1wiLFwiZmVicmVyb1wiLFwibWFyem9cIixcImFicmlsXCIsXCJtYXlvXCIsXCJqdW5pb1wiLFwianVsaW9cIixcImFnb3N0b1wiLFwic2VwdGllbWJyZVwiLFwib2N0dWJyZVwiLFwibm92aWVtYnJlXCIsXCJkaWNpZW1icmVcIl19LGRheXM6e25hcnJvdzpbXCJEXCIsXCJMXCIsXCJNXCIsXCJYXCIsXCJKXCIsXCJWXCIsXCJTXCJdLHNob3J0OltcImRvbS5cIixcImx1bi5cIixcIm1hci5cIixcIm1pw6kuXCIsXCJqdWUuXCIsXCJ2aWUuXCIsXCJzw6FiLlwiXSxsb25nOltcImRvbWluZ29cIixcImx1bmVzXCIsXCJtYXJ0ZXNcIixcIm1pw6lyY29sZXNcIixcImp1ZXZlc1wiLFwidmllcm5lc1wiLFwic8OhYmFkb1wiXX0sZXJhczp7bmFycm93OltcImFudGVzIGRlIFIuTy5DLlwiLFwiUi5PLkMuXCJdLHNob3J0OltcImFudGVzIGRlIFIuTy5DLlwiLFwiUi5PLkMuXCJdLGxvbmc6W1wiYW50ZXMgZGUgUi5PLkMuXCIsXCJSLk8uQy5cIl19LGRheVBlcmlvZHM6e2FtOlwiYS4gbS5cIixwbTpcInAuIG0uXCJ9fX19LG51bWJlcjp7bnU6W1wibGF0blwiXSxwYXR0ZXJuczp7ZGVjaW1hbDp7cG9zaXRpdmVQYXR0ZXJuOlwie251bWJlcn1cIixuZWdhdGl2ZVBhdHRlcm46XCJ7bWludXNTaWdufXtudW1iZXJ9XCJ9LGN1cnJlbmN5Ontwb3NpdGl2ZVBhdHRlcm46XCJ7bnVtYmVyfcKge2N1cnJlbmN5fVwiLG5lZ2F0aXZlUGF0dGVybjpcInttaW51c1NpZ259e251bWJlcn3CoHtjdXJyZW5jeX1cIn0scGVyY2VudDp7cG9zaXRpdmVQYXR0ZXJuOlwie251bWJlcn3CoHtwZXJjZW50U2lnbn1cIixuZWdhdGl2ZVBhdHRlcm46XCJ7bWludXNTaWdufXtudW1iZXJ9wqB7cGVyY2VudFNpZ259XCJ9fSxzeW1ib2xzOntsYXRuOntkZWNpbWFsOlwiLFwiLGdyb3VwOlwiLlwiLG5hbjpcIk5hTlwiLHBsdXNTaWduOlwiK1wiLG1pbnVzU2lnbjpcIi1cIixwZXJjZW50U2lnbjpcIiVcIixpbmZpbml0eTpcIuKInlwifX0sY3VycmVuY2llczp7Q0FEOlwiQ0EkXCIsRVNQOlwi4oKnXCIsRVVSOlwi4oKsXCIsVEhCOlwi4Li/XCIsVVNEOlwiJFwiLFZORDpcIuKCq1wiLFhQRjpcIkNGUEZcIn19fSk7IiwiICAvKiBnbG9iYWxzIHJlcXVpcmUsIG1vZHVsZSAqL1xuXG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAgICovXG5cbiAgdmFyIHBhdGh0b1JlZ2V4cCA9IHJlcXVpcmUoJ3BhdGgtdG8tcmVnZXhwJyk7XG5cbiAgLyoqXG4gICAqIE1vZHVsZSBleHBvcnRzLlxuICAgKi9cblxuICBtb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG5cbiAgLyoqXG4gICAqIERldGVjdCBjbGljayBldmVudFxuICAgKi9cbiAgdmFyIGNsaWNrRXZlbnQgPSAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBkb2N1bWVudCkgJiYgZG9jdW1lbnQub250b3VjaHN0YXJ0ID8gJ3RvdWNoc3RhcnQnIDogJ2NsaWNrJztcblxuICAvKipcbiAgICogVG8gd29yayBwcm9wZXJseSB3aXRoIHRoZSBVUkxcbiAgICogaGlzdG9yeS5sb2NhdGlvbiBnZW5lcmF0ZWQgcG9seWZpbGwgaW4gaHR0cHM6Ly9naXRodWIuY29tL2Rldm90ZS9IVE1MNS1IaXN0b3J5LUFQSVxuICAgKi9cblxuICB2YXIgbG9jYXRpb24gPSAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiB3aW5kb3cpICYmICh3aW5kb3cuaGlzdG9yeS5sb2NhdGlvbiB8fCB3aW5kb3cubG9jYXRpb24pO1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtIGluaXRpYWwgZGlzcGF0Y2guXG4gICAqL1xuXG4gIHZhciBkaXNwYXRjaCA9IHRydWU7XG5cblxuICAvKipcbiAgICogRGVjb2RlIFVSTCBjb21wb25lbnRzIChxdWVyeSBzdHJpbmcsIHBhdGhuYW1lLCBoYXNoKS5cbiAgICogQWNjb21tb2RhdGVzIGJvdGggcmVndWxhciBwZXJjZW50IGVuY29kaW5nIGFuZCB4LXd3dy1mb3JtLXVybGVuY29kZWQgZm9ybWF0LlxuICAgKi9cbiAgdmFyIGRlY29kZVVSTENvbXBvbmVudHMgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBCYXNlIHBhdGguXG4gICAqL1xuXG4gIHZhciBiYXNlID0gJyc7XG5cbiAgLyoqXG4gICAqIFJ1bm5pbmcgZmxhZy5cbiAgICovXG5cbiAgdmFyIHJ1bm5pbmc7XG5cbiAgLyoqXG4gICAqIEhhc2hCYW5nIG9wdGlvblxuICAgKi9cblxuICB2YXIgaGFzaGJhbmcgPSBmYWxzZTtcblxuICAvKipcbiAgICogUHJldmlvdXMgY29udGV4dCwgZm9yIGNhcHR1cmluZ1xuICAgKiBwYWdlIGV4aXQgZXZlbnRzLlxuICAgKi9cblxuICB2YXIgcHJldkNvbnRleHQ7XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGBwYXRoYCB3aXRoIGNhbGxiYWNrIGBmbigpYCxcbiAgICogb3Igcm91dGUgYHBhdGhgLCBvciByZWRpcmVjdGlvbixcbiAgICogb3IgYHBhZ2Uuc3RhcnQoKWAuXG4gICAqXG4gICAqICAgcGFnZShmbik7XG4gICAqICAgcGFnZSgnKicsIGZuKTtcbiAgICogICBwYWdlKCcvdXNlci86aWQnLCBsb2FkLCB1c2VyKTtcbiAgICogICBwYWdlKCcvdXNlci8nICsgdXNlci5pZCwgeyBzb21lOiAndGhpbmcnIH0pO1xuICAgKiAgIHBhZ2UoJy91c2VyLycgKyB1c2VyLmlkKTtcbiAgICogICBwYWdlKCcvZnJvbScsICcvdG8nKVxuICAgKiAgIHBhZ2UoKTtcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8IUZ1bmN0aW9ufCFPYmplY3R9IHBhdGhcbiAgICogQHBhcmFtIHtGdW5jdGlvbj19IGZuXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHBhZ2UocGF0aCwgZm4pIHtcbiAgICAvLyA8Y2FsbGJhY2s+XG4gICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBwYXRoKSB7XG4gICAgICByZXR1cm4gcGFnZSgnKicsIHBhdGgpO1xuICAgIH1cblxuICAgIC8vIHJvdXRlIDxwYXRoPiB0byA8Y2FsbGJhY2sgLi4uPlxuICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZm4pIHtcbiAgICAgIHZhciByb3V0ZSA9IG5ldyBSb3V0ZSgvKiogQHR5cGUge3N0cmluZ30gKi8gKHBhdGgpKTtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHBhZ2UuY2FsbGJhY2tzLnB1c2gocm91dGUubWlkZGxld2FyZShhcmd1bWVudHNbaV0pKTtcbiAgICAgIH1cbiAgICAgIC8vIHNob3cgPHBhdGg+IHdpdGggW3N0YXRlXVxuICAgIH0gZWxzZSBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBwYXRoKSB7XG4gICAgICBwYWdlWydzdHJpbmcnID09PSB0eXBlb2YgZm4gPyAncmVkaXJlY3QnIDogJ3Nob3cnXShwYXRoLCBmbik7XG4gICAgICAvLyBzdGFydCBbb3B0aW9uc11cbiAgICB9IGVsc2Uge1xuICAgICAgcGFnZS5zdGFydChwYXRoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZnVuY3Rpb25zLlxuICAgKi9cblxuICBwYWdlLmNhbGxiYWNrcyA9IFtdO1xuICBwYWdlLmV4aXRzID0gW107XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgcGF0aCBiZWluZyBwcm9jZXNzZWRcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHBhZ2UuY3VycmVudCA9ICcnO1xuXG4gIC8qKlxuICAgKiBOdW1iZXIgb2YgcGFnZXMgbmF2aWdhdGVkIHRvLlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKlxuICAgKiAgICAgcGFnZS5sZW4gPT0gMDtcbiAgICogICAgIHBhZ2UoJy9sb2dpbicpO1xuICAgKiAgICAgcGFnZS5sZW4gPT0gMTtcbiAgICovXG5cbiAgcGFnZS5sZW4gPSAwO1xuXG4gIC8qKlxuICAgKiBHZXQgb3Igc2V0IGJhc2VwYXRoIHRvIGBwYXRoYC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5iYXNlID0gZnVuY3Rpb24ocGF0aCkge1xuICAgIGlmICgwID09PSBhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gYmFzZTtcbiAgICBiYXNlID0gcGF0aDtcbiAgfTtcblxuICAvKipcbiAgICogQmluZCB3aXRoIHRoZSBnaXZlbiBgb3B0aW9uc2AuXG4gICAqXG4gICAqIE9wdGlvbnM6XG4gICAqXG4gICAqICAgIC0gYGNsaWNrYCBiaW5kIHRvIGNsaWNrIGV2ZW50cyBbdHJ1ZV1cbiAgICogICAgLSBgcG9wc3RhdGVgIGJpbmQgdG8gcG9wc3RhdGUgW3RydWVdXG4gICAqICAgIC0gYGRpc3BhdGNoYCBwZXJmb3JtIGluaXRpYWwgZGlzcGF0Y2ggW3RydWVdXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2Uuc3RhcnQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKHJ1bm5pbmcpIHJldHVybjtcbiAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICBpZiAoZmFsc2UgPT09IG9wdGlvbnMuZGlzcGF0Y2gpIGRpc3BhdGNoID0gZmFsc2U7XG4gICAgaWYgKGZhbHNlID09PSBvcHRpb25zLmRlY29kZVVSTENvbXBvbmVudHMpIGRlY29kZVVSTENvbXBvbmVudHMgPSBmYWxzZTtcbiAgICBpZiAoZmFsc2UgIT09IG9wdGlvbnMucG9wc3RhdGUpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIG9ucG9wc3RhdGUsIGZhbHNlKTtcbiAgICBpZiAoZmFsc2UgIT09IG9wdGlvbnMuY2xpY2spIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoY2xpY2tFdmVudCwgb25jbGljaywgZmFsc2UpO1xuICAgIH1cbiAgICBpZiAodHJ1ZSA9PT0gb3B0aW9ucy5oYXNoYmFuZykgaGFzaGJhbmcgPSB0cnVlO1xuICAgIGlmICghZGlzcGF0Y2gpIHJldHVybjtcbiAgICB2YXIgdXJsID0gKGhhc2hiYW5nICYmIH5sb2NhdGlvbi5oYXNoLmluZGV4T2YoJyMhJykpID8gbG9jYXRpb24uaGFzaC5zdWJzdHIoMikgKyBsb2NhdGlvbi5zZWFyY2ggOiBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCArIGxvY2F0aW9uLmhhc2g7XG4gICAgcGFnZS5yZXBsYWNlKHVybCwgbnVsbCwgdHJ1ZSwgZGlzcGF0Y2gpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBVbmJpbmQgY2xpY2sgYW5kIHBvcHN0YXRlIGV2ZW50IGhhbmRsZXJzLlxuICAgKlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLnN0b3AgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXJ1bm5pbmcpIHJldHVybjtcbiAgICBwYWdlLmN1cnJlbnQgPSAnJztcbiAgICBwYWdlLmxlbiA9IDA7XG4gICAgcnVubmluZyA9IGZhbHNlO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoY2xpY2tFdmVudCwgb25jbGljaywgZmFsc2UpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIG9ucG9wc3RhdGUsIGZhbHNlKTtcbiAgfTtcblxuICAvKipcbiAgICogU2hvdyBgcGF0aGAgd2l0aCBvcHRpb25hbCBgc3RhdGVgIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3Q9fSBzdGF0ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBkaXNwYXRjaFxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBwdXNoXG4gICAqIEByZXR1cm4geyFDb250ZXh0fVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLnNob3cgPSBmdW5jdGlvbihwYXRoLCBzdGF0ZSwgZGlzcGF0Y2gsIHB1c2gpIHtcbiAgICB2YXIgY3R4ID0gbmV3IENvbnRleHQocGF0aCwgc3RhdGUpO1xuICAgIHBhZ2UuY3VycmVudCA9IGN0eC5wYXRoO1xuICAgIGlmIChmYWxzZSAhPT0gZGlzcGF0Y2gpIHBhZ2UuZGlzcGF0Y2goY3R4KTtcbiAgICBpZiAoZmFsc2UgIT09IGN0eC5oYW5kbGVkICYmIGZhbHNlICE9PSBwdXNoKSBjdHgucHVzaFN0YXRlKCk7XG4gICAgcmV0dXJuIGN0eDtcbiAgfTtcblxuICAvKipcbiAgICogR29lcyBiYWNrIGluIHRoZSBoaXN0b3J5XG4gICAqIEJhY2sgc2hvdWxkIGFsd2F5cyBsZXQgdGhlIGN1cnJlbnQgcm91dGUgcHVzaCBzdGF0ZSBhbmQgdGhlbiBnbyBiYWNrLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIGZhbGxiYWNrIHBhdGggdG8gZ28gYmFjayBpZiBubyBtb3JlIGhpc3RvcnkgZXhpc3RzLCBpZiB1bmRlZmluZWQgZGVmYXVsdHMgdG8gcGFnZS5iYXNlXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gc3RhdGVcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5iYWNrID0gZnVuY3Rpb24ocGF0aCwgc3RhdGUpIHtcbiAgICBpZiAocGFnZS5sZW4gPiAwKSB7XG4gICAgICAvLyB0aGlzIG1heSBuZWVkIG1vcmUgdGVzdGluZyB0byBzZWUgaWYgYWxsIGJyb3dzZXJzXG4gICAgICAvLyB3YWl0IGZvciB0aGUgbmV4dCB0aWNrIHRvIGdvIGJhY2sgaW4gaGlzdG9yeVxuICAgICAgaGlzdG9yeS5iYWNrKCk7XG4gICAgICBwYWdlLmxlbi0tO1xuICAgIH0gZWxzZSBpZiAocGF0aCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcGFnZS5zaG93KHBhdGgsIHN0YXRlKTtcbiAgICAgIH0pO1xuICAgIH1lbHNle1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcGFnZS5zaG93KGJhc2UsIHN0YXRlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciByb3V0ZSB0byByZWRpcmVjdCBmcm9tIG9uZSBwYXRoIHRvIG90aGVyXG4gICAqIG9yIGp1c3QgcmVkaXJlY3QgdG8gYW5vdGhlciByb3V0ZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZnJvbSAtIGlmIHBhcmFtICd0bycgaXMgdW5kZWZpbmVkIHJlZGlyZWN0cyB0byAnZnJvbSdcbiAgICogQHBhcmFtIHtzdHJpbmc9fSB0b1xuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cbiAgcGFnZS5yZWRpcmVjdCA9IGZ1bmN0aW9uKGZyb20sIHRvKSB7XG4gICAgLy8gRGVmaW5lIHJvdXRlIGZyb20gYSBwYXRoIHRvIGFub3RoZXJcbiAgICBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBmcm9tICYmICdzdHJpbmcnID09PSB0eXBlb2YgdG8pIHtcbiAgICAgIHBhZ2UoZnJvbSwgZnVuY3Rpb24oZSkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHBhZ2UucmVwbGFjZSgvKiogQHR5cGUgeyFzdHJpbmd9ICovICh0bykpO1xuICAgICAgICB9LCAwKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFdhaXQgZm9yIHRoZSBwdXNoIHN0YXRlIGFuZCByZXBsYWNlIGl0IHdpdGggYW5vdGhlclxuICAgIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIGZyb20gJiYgJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiB0bykge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcGFnZS5yZXBsYWNlKGZyb20pO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGBwYXRoYCB3aXRoIG9wdGlvbmFsIGBzdGF0ZWAgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdD19IHN0YXRlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IGluaXRcbiAgICogQHBhcmFtIHtib29sZWFuPX0gZGlzcGF0Y2hcbiAgICogQHJldHVybiB7IUNvbnRleHR9XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG5cbiAgcGFnZS5yZXBsYWNlID0gZnVuY3Rpb24ocGF0aCwgc3RhdGUsIGluaXQsIGRpc3BhdGNoKSB7XG4gICAgdmFyIGN0eCA9IG5ldyBDb250ZXh0KHBhdGgsIHN0YXRlKTtcbiAgICBwYWdlLmN1cnJlbnQgPSBjdHgucGF0aDtcbiAgICBjdHguaW5pdCA9IGluaXQ7XG4gICAgY3R4LnNhdmUoKTsgLy8gc2F2ZSBiZWZvcmUgZGlzcGF0Y2hpbmcsIHdoaWNoIG1heSByZWRpcmVjdFxuICAgIGlmIChmYWxzZSAhPT0gZGlzcGF0Y2gpIHBhZ2UuZGlzcGF0Y2goY3R4KTtcbiAgICByZXR1cm4gY3R4O1xuICB9O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCB0aGUgZ2l2ZW4gYGN0eGAuXG4gICAqXG4gICAqIEBwYXJhbSB7Q29udGV4dH0gY3R4XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cbiAgcGFnZS5kaXNwYXRjaCA9IGZ1bmN0aW9uKGN0eCkge1xuICAgIHZhciBwcmV2ID0gcHJldkNvbnRleHQsXG4gICAgICBpID0gMCxcbiAgICAgIGogPSAwO1xuXG4gICAgcHJldkNvbnRleHQgPSBjdHg7XG5cbiAgICBmdW5jdGlvbiBuZXh0RXhpdCgpIHtcbiAgICAgIHZhciBmbiA9IHBhZ2UuZXhpdHNbaisrXTtcbiAgICAgIGlmICghZm4pIHJldHVybiBuZXh0RW50ZXIoKTtcbiAgICAgIGZuKHByZXYsIG5leHRFeGl0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBuZXh0RW50ZXIoKSB7XG4gICAgICB2YXIgZm4gPSBwYWdlLmNhbGxiYWNrc1tpKytdO1xuXG4gICAgICBpZiAoY3R4LnBhdGggIT09IHBhZ2UuY3VycmVudCkge1xuICAgICAgICBjdHguaGFuZGxlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWZuKSByZXR1cm4gdW5oYW5kbGVkKGN0eCk7XG4gICAgICBmbihjdHgsIG5leHRFbnRlcik7XG4gICAgfVxuXG4gICAgaWYgKHByZXYpIHtcbiAgICAgIG5leHRFeGl0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHRFbnRlcigpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogVW5oYW5kbGVkIGBjdHhgLiBXaGVuIGl0J3Mgbm90IHRoZSBpbml0aWFsXG4gICAqIHBvcHN0YXRlIHRoZW4gcmVkaXJlY3QuIElmIHlvdSB3aXNoIHRvIGhhbmRsZVxuICAgKiA0MDRzIG9uIHlvdXIgb3duIHVzZSBgcGFnZSgnKicsIGNhbGxiYWNrKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7Q29udGV4dH0gY3R4XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gdW5oYW5kbGVkKGN0eCkge1xuICAgIGlmIChjdHguaGFuZGxlZCkgcmV0dXJuO1xuICAgIHZhciBjdXJyZW50O1xuXG4gICAgaWYgKGhhc2hiYW5nKSB7XG4gICAgICBjdXJyZW50ID0gYmFzZSArIGxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIyEnLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnQgPSBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaDtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudCA9PT0gY3R4LmNhbm9uaWNhbFBhdGgpIHJldHVybjtcbiAgICBwYWdlLnN0b3AoKTtcbiAgICBjdHguaGFuZGxlZCA9IGZhbHNlO1xuICAgIGxvY2F0aW9uLmhyZWYgPSBjdHguY2Fub25pY2FsUGF0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbiBleGl0IHJvdXRlIG9uIGBwYXRoYCB3aXRoXG4gICAqIGNhbGxiYWNrIGBmbigpYCwgd2hpY2ggd2lsbCBiZSBjYWxsZWRcbiAgICogb24gdGhlIHByZXZpb3VzIGNvbnRleHQgd2hlbiBhIG5ld1xuICAgKiBwYWdlIGlzIHZpc2l0ZWQuXG4gICAqL1xuICBwYWdlLmV4aXQgPSBmdW5jdGlvbihwYXRoLCBmbikge1xuICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHBhZ2UuZXhpdCgnKicsIHBhdGgpO1xuICAgIH1cblxuICAgIHZhciByb3V0ZSA9IG5ldyBSb3V0ZShwYXRoKTtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgcGFnZS5leGl0cy5wdXNoKHJvdXRlLm1pZGRsZXdhcmUoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgVVJMIGVuY29kaW5nIGZyb20gdGhlIGdpdmVuIGBzdHJgLlxuICAgKiBBY2NvbW1vZGF0ZXMgd2hpdGVzcGFjZSBpbiBib3RoIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICAgKiBhbmQgcmVndWxhciBwZXJjZW50LWVuY29kZWQgZm9ybS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbCAtIFVSTCBjb21wb25lbnQgdG8gZGVjb2RlXG4gICAqL1xuICBmdW5jdGlvbiBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KHZhbCkge1xuICAgIGlmICh0eXBlb2YgdmFsICE9PSAnc3RyaW5nJykgeyByZXR1cm4gdmFsOyB9XG4gICAgcmV0dXJuIGRlY29kZVVSTENvbXBvbmVudHMgPyBkZWNvZGVVUklDb21wb25lbnQodmFsLnJlcGxhY2UoL1xcKy9nLCAnICcpKSA6IHZhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGEgbmV3IFwicmVxdWVzdFwiIGBDb250ZXh0YFxuICAgKiB3aXRoIHRoZSBnaXZlbiBgcGF0aGAgYW5kIG9wdGlvbmFsIGluaXRpYWwgYHN0YXRlYC5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gc3RhdGVcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgZnVuY3Rpb24gQ29udGV4dChwYXRoLCBzdGF0ZSkge1xuICAgIGlmICgnLycgPT09IHBhdGhbMF0gJiYgMCAhPT0gcGF0aC5pbmRleE9mKGJhc2UpKSBwYXRoID0gYmFzZSArIChoYXNoYmFuZyA/ICcjIScgOiAnJykgKyBwYXRoO1xuICAgIHZhciBpID0gcGF0aC5pbmRleE9mKCc/Jyk7XG5cbiAgICB0aGlzLmNhbm9uaWNhbFBhdGggPSBwYXRoO1xuICAgIHRoaXMucGF0aCA9IHBhdGgucmVwbGFjZShiYXNlLCAnJykgfHwgJy8nO1xuICAgIGlmIChoYXNoYmFuZykgdGhpcy5wYXRoID0gdGhpcy5wYXRoLnJlcGxhY2UoJyMhJywgJycpIHx8ICcvJztcblxuICAgIHRoaXMudGl0bGUgPSBkb2N1bWVudC50aXRsZTtcbiAgICB0aGlzLnN0YXRlID0gc3RhdGUgfHwge307XG4gICAgdGhpcy5zdGF0ZS5wYXRoID0gcGF0aDtcbiAgICB0aGlzLnF1ZXJ5c3RyaW5nID0gfmkgPyBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KHBhdGguc2xpY2UoaSArIDEpKSA6ICcnO1xuICAgIHRoaXMucGF0aG5hbWUgPSBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KH5pID8gcGF0aC5zbGljZSgwLCBpKSA6IHBhdGgpO1xuICAgIHRoaXMucGFyYW1zID0ge307XG5cbiAgICAvLyBmcmFnbWVudFxuICAgIHRoaXMuaGFzaCA9ICcnO1xuICAgIGlmICghaGFzaGJhbmcpIHtcbiAgICAgIGlmICghfnRoaXMucGF0aC5pbmRleE9mKCcjJykpIHJldHVybjtcbiAgICAgIHZhciBwYXJ0cyA9IHRoaXMucGF0aC5zcGxpdCgnIycpO1xuICAgICAgdGhpcy5wYXRoID0gcGFydHNbMF07XG4gICAgICB0aGlzLmhhc2ggPSBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KHBhcnRzWzFdKSB8fCAnJztcbiAgICAgIHRoaXMucXVlcnlzdHJpbmcgPSB0aGlzLnF1ZXJ5c3RyaW5nLnNwbGl0KCcjJylbMF07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBgQ29udGV4dGAuXG4gICAqL1xuXG4gIHBhZ2UuQ29udGV4dCA9IENvbnRleHQ7XG5cbiAgLyoqXG4gICAqIFB1c2ggc3RhdGUuXG4gICAqXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBDb250ZXh0LnByb3RvdHlwZS5wdXNoU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBwYWdlLmxlbisrO1xuICAgIGhpc3RvcnkucHVzaFN0YXRlKHRoaXMuc3RhdGUsIHRoaXMudGl0bGUsIGhhc2hiYW5nICYmIHRoaXMucGF0aCAhPT0gJy8nID8gJyMhJyArIHRoaXMucGF0aCA6IHRoaXMuY2Fub25pY2FsUGF0aCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNhdmUgdGhlIGNvbnRleHQgc3RhdGUuXG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIENvbnRleHQucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSh0aGlzLnN0YXRlLCB0aGlzLnRpdGxlLCBoYXNoYmFuZyAmJiB0aGlzLnBhdGggIT09ICcvJyA/ICcjIScgKyB0aGlzLnBhdGggOiB0aGlzLmNhbm9uaWNhbFBhdGgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGBSb3V0ZWAgd2l0aCB0aGUgZ2l2ZW4gSFRUUCBgcGF0aGAsXG4gICAqIGFuZCBhbiBhcnJheSBvZiBgY2FsbGJhY2tzYCBhbmQgYG9wdGlvbnNgLlxuICAgKlxuICAgKiBPcHRpb25zOlxuICAgKlxuICAgKiAgIC0gYHNlbnNpdGl2ZWAgICAgZW5hYmxlIGNhc2Utc2Vuc2l0aXZlIHJvdXRlc1xuICAgKiAgIC0gYHN0cmljdGAgICAgICAgZW5hYmxlIHN0cmljdCBtYXRjaGluZyBmb3IgdHJhaWxpbmcgc2xhc2hlc1xuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRpb25zXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBmdW5jdGlvbiBSb3V0ZShwYXRoLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5wYXRoID0gKHBhdGggPT09ICcqJykgPyAnKC4qKScgOiBwYXRoO1xuICAgIHRoaXMubWV0aG9kID0gJ0dFVCc7XG4gICAgdGhpcy5yZWdleHAgPSBwYXRodG9SZWdleHAodGhpcy5wYXRoLFxuICAgICAgdGhpcy5rZXlzID0gW10sXG4gICAgICBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvc2UgYFJvdXRlYC5cbiAgICovXG5cbiAgcGFnZS5Sb3V0ZSA9IFJvdXRlO1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gcm91dGUgbWlkZGxld2FyZSB3aXRoXG4gICAqIHRoZSBnaXZlbiBjYWxsYmFjayBgZm4oKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUubWlkZGxld2FyZSA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBmdW5jdGlvbihjdHgsIG5leHQpIHtcbiAgICAgIGlmIChzZWxmLm1hdGNoKGN0eC5wYXRoLCBjdHgucGFyYW1zKSkgcmV0dXJuIGZuKGN0eCwgbmV4dCk7XG4gICAgICBuZXh0KCk7XG4gICAgfTtcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhpcyByb3V0ZSBtYXRjaGVzIGBwYXRoYCwgaWYgc29cbiAgICogcG9wdWxhdGUgYHBhcmFtc2AuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uKHBhdGgsIHBhcmFtcykge1xuICAgIHZhciBrZXlzID0gdGhpcy5rZXlzLFxuICAgICAgcXNJbmRleCA9IHBhdGguaW5kZXhPZignPycpLFxuICAgICAgcGF0aG5hbWUgPSB+cXNJbmRleCA/IHBhdGguc2xpY2UoMCwgcXNJbmRleCkgOiBwYXRoLFxuICAgICAgbSA9IHRoaXMucmVnZXhwLmV4ZWMoZGVjb2RlVVJJQ29tcG9uZW50KHBhdGhuYW1lKSk7XG5cbiAgICBpZiAoIW0pIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAodmFyIGkgPSAxLCBsZW4gPSBtLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpIC0gMV07XG4gICAgICB2YXIgdmFsID0gZGVjb2RlVVJMRW5jb2RlZFVSSUNvbXBvbmVudChtW2ldKTtcbiAgICAgIGlmICh2YWwgIT09IHVuZGVmaW5lZCB8fCAhKGhhc093blByb3BlcnR5LmNhbGwocGFyYW1zLCBrZXkubmFtZSkpKSB7XG4gICAgICAgIHBhcmFtc1trZXkubmFtZV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvKipcbiAgICogSGFuZGxlIFwicG9wdWxhdGVcIiBldmVudHMuXG4gICAqL1xuXG4gIHZhciBvbnBvcHN0YXRlID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbG9hZGVkID0gZmFsc2U7XG4gICAgaWYgKCd1bmRlZmluZWQnID09PSB0eXBlb2Ygd2luZG93KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG4gICAgICBsb2FkZWQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGxvYWRlZCA9IHRydWU7XG4gICAgICAgIH0sIDApO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiBvbnBvcHN0YXRlKGUpIHtcbiAgICAgIGlmICghbG9hZGVkKSByZXR1cm47XG4gICAgICBpZiAoZS5zdGF0ZSkge1xuICAgICAgICB2YXIgcGF0aCA9IGUuc3RhdGUucGF0aDtcbiAgICAgICAgcGFnZS5yZXBsYWNlKHBhdGgsIGUuc3RhdGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFnZS5zaG93KGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uaGFzaCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KSgpO1xuICAvKipcbiAgICogSGFuZGxlIFwiY2xpY2tcIiBldmVudHMuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uY2xpY2soZSkge1xuXG4gICAgaWYgKDEgIT09IHdoaWNoKGUpKSByZXR1cm47XG5cbiAgICBpZiAoZS5tZXRhS2V5IHx8IGUuY3RybEtleSB8fCBlLnNoaWZ0S2V5KSByZXR1cm47XG4gICAgaWYgKGUuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xuXG5cblxuICAgIC8vIGVuc3VyZSBsaW5rXG4gICAgLy8gdXNlIHNoYWRvdyBkb20gd2hlbiBhdmFpbGFibGVcbiAgICB2YXIgZWwgPSBlLnBhdGggPyBlLnBhdGhbMF0gOiBlLnRhcmdldDtcbiAgICB3aGlsZSAoZWwgJiYgJ0EnICE9PSBlbC5ub2RlTmFtZSkgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgIGlmICghZWwgfHwgJ0EnICE9PSBlbC5ub2RlTmFtZSkgcmV0dXJuO1xuXG5cblxuICAgIC8vIElnbm9yZSBpZiB0YWcgaGFzXG4gICAgLy8gMS4gXCJkb3dubG9hZFwiIGF0dHJpYnV0ZVxuICAgIC8vIDIuIHJlbD1cImV4dGVybmFsXCIgYXR0cmlidXRlXG4gICAgaWYgKGVsLmhhc0F0dHJpYnV0ZSgnZG93bmxvYWQnKSB8fCBlbC5nZXRBdHRyaWJ1dGUoJ3JlbCcpID09PSAnZXh0ZXJuYWwnKSByZXR1cm47XG5cbiAgICAvLyBlbnN1cmUgbm9uLWhhc2ggZm9yIHRoZSBzYW1lIHBhdGhcbiAgICB2YXIgbGluayA9IGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuICAgIGlmICghaGFzaGJhbmcgJiYgZWwucGF0aG5hbWUgPT09IGxvY2F0aW9uLnBhdGhuYW1lICYmIChlbC5oYXNoIHx8ICcjJyA9PT0gbGluaykpIHJldHVybjtcblxuXG5cbiAgICAvLyBDaGVjayBmb3IgbWFpbHRvOiBpbiB0aGUgaHJlZlxuICAgIGlmIChsaW5rICYmIGxpbmsuaW5kZXhPZignbWFpbHRvOicpID4gLTEpIHJldHVybjtcblxuICAgIC8vIGNoZWNrIHRhcmdldFxuICAgIGlmIChlbC50YXJnZXQpIHJldHVybjtcblxuICAgIC8vIHgtb3JpZ2luXG4gICAgaWYgKCFzYW1lT3JpZ2luKGVsLmhyZWYpKSByZXR1cm47XG5cblxuXG4gICAgLy8gcmVidWlsZCBwYXRoXG4gICAgdmFyIHBhdGggPSBlbC5wYXRobmFtZSArIGVsLnNlYXJjaCArIChlbC5oYXNoIHx8ICcnKTtcblxuICAgIC8vIHN0cmlwIGxlYWRpbmcgXCIvW2RyaXZlIGxldHRlcl06XCIgb24gTlcuanMgb24gV2luZG93c1xuICAgIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcGF0aC5tYXRjaCgvXlxcL1thLXpBLVpdOlxcLy8pKSB7XG4gICAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9eXFwvW2EtekEtWl06XFwvLywgJy8nKTtcbiAgICB9XG5cbiAgICAvLyBzYW1lIHBhZ2VcbiAgICB2YXIgb3JpZyA9IHBhdGg7XG5cbiAgICBpZiAocGF0aC5pbmRleE9mKGJhc2UpID09PSAwKSB7XG4gICAgICBwYXRoID0gcGF0aC5zdWJzdHIoYmFzZS5sZW5ndGgpO1xuICAgIH1cblxuICAgIGlmIChoYXNoYmFuZykgcGF0aCA9IHBhdGgucmVwbGFjZSgnIyEnLCAnJyk7XG5cbiAgICBpZiAoYmFzZSAmJiBvcmlnID09PSBwYXRoKSByZXR1cm47XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgcGFnZS5zaG93KG9yaWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV2ZW50IGJ1dHRvbi5cbiAgICovXG5cbiAgZnVuY3Rpb24gd2hpY2goZSkge1xuICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgICByZXR1cm4gbnVsbCA9PT0gZS53aGljaCA/IGUuYnV0dG9uIDogZS53aGljaDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBgaHJlZmAgaXMgdGhlIHNhbWUgb3JpZ2luLlxuICAgKi9cblxuICBmdW5jdGlvbiBzYW1lT3JpZ2luKGhyZWYpIHtcbiAgICB2YXIgb3JpZ2luID0gbG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgbG9jYXRpb24uaG9zdG5hbWU7XG4gICAgaWYgKGxvY2F0aW9uLnBvcnQpIG9yaWdpbiArPSAnOicgKyBsb2NhdGlvbi5wb3J0O1xuICAgIHJldHVybiAoaHJlZiAmJiAoMCA9PT0gaHJlZi5pbmRleE9mKG9yaWdpbikpKTtcbiAgfVxuXG4gIHBhZ2Uuc2FtZU9yaWdpbiA9IHNhbWVPcmlnaW47XG4iLCJ2YXIgaXNhcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKVxuXG4vKipcbiAqIEV4cG9zZSBgcGF0aFRvUmVnZXhwYC5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBwYXRoVG9SZWdleHBcbm1vZHVsZS5leHBvcnRzLnBhcnNlID0gcGFyc2Vcbm1vZHVsZS5leHBvcnRzLmNvbXBpbGUgPSBjb21waWxlXG5tb2R1bGUuZXhwb3J0cy50b2tlbnNUb0Z1bmN0aW9uID0gdG9rZW5zVG9GdW5jdGlvblxubW9kdWxlLmV4cG9ydHMudG9rZW5zVG9SZWdFeHAgPSB0b2tlbnNUb1JlZ0V4cFxuXG4vKipcbiAqIFRoZSBtYWluIHBhdGggbWF0Y2hpbmcgcmVnZXhwIHV0aWxpdHkuXG4gKlxuICogQHR5cGUge1JlZ0V4cH1cbiAqL1xudmFyIFBBVEhfUkVHRVhQID0gbmV3IFJlZ0V4cChbXG4gIC8vIE1hdGNoIGVzY2FwZWQgY2hhcmFjdGVycyB0aGF0IHdvdWxkIG90aGVyd2lzZSBhcHBlYXIgaW4gZnV0dXJlIG1hdGNoZXMuXG4gIC8vIFRoaXMgYWxsb3dzIHRoZSB1c2VyIHRvIGVzY2FwZSBzcGVjaWFsIGNoYXJhY3RlcnMgdGhhdCB3b24ndCB0cmFuc2Zvcm0uXG4gICcoXFxcXFxcXFwuKScsXG4gIC8vIE1hdGNoIEV4cHJlc3Mtc3R5bGUgcGFyYW1ldGVycyBhbmQgdW4tbmFtZWQgcGFyYW1ldGVycyB3aXRoIGEgcHJlZml4XG4gIC8vIGFuZCBvcHRpb25hbCBzdWZmaXhlcy4gTWF0Y2hlcyBhcHBlYXIgYXM6XG4gIC8vXG4gIC8vIFwiLzp0ZXN0KFxcXFxkKyk/XCIgPT4gW1wiL1wiLCBcInRlc3RcIiwgXCJcXGQrXCIsIHVuZGVmaW5lZCwgXCI/XCIsIHVuZGVmaW5lZF1cbiAgLy8gXCIvcm91dGUoXFxcXGQrKVwiICA9PiBbdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgXCJcXGQrXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxuICAvLyBcIi8qXCIgICAgICAgICAgICA9PiBbXCIvXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgXCIqXCJdXG4gICcoW1xcXFwvLl0pPyg/Oig/OlxcXFw6KFxcXFx3KykoPzpcXFxcKCgoPzpcXFxcXFxcXC58W14oKV0pKylcXFxcKSk/fFxcXFwoKCg/OlxcXFxcXFxcLnxbXigpXSkrKVxcXFwpKShbKyo/XSk/fChcXFxcKikpJ1xuXS5qb2luKCd8JyksICdnJylcblxuLyoqXG4gKiBQYXJzZSBhIHN0cmluZyBmb3IgdGhlIHJhdyB0b2tlbnMuXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5mdW5jdGlvbiBwYXJzZSAoc3RyKSB7XG4gIHZhciB0b2tlbnMgPSBbXVxuICB2YXIga2V5ID0gMFxuICB2YXIgaW5kZXggPSAwXG4gIHZhciBwYXRoID0gJydcbiAgdmFyIHJlc1xuXG4gIHdoaWxlICgocmVzID0gUEFUSF9SRUdFWFAuZXhlYyhzdHIpKSAhPSBudWxsKSB7XG4gICAgdmFyIG0gPSByZXNbMF1cbiAgICB2YXIgZXNjYXBlZCA9IHJlc1sxXVxuICAgIHZhciBvZmZzZXQgPSByZXMuaW5kZXhcbiAgICBwYXRoICs9IHN0ci5zbGljZShpbmRleCwgb2Zmc2V0KVxuICAgIGluZGV4ID0gb2Zmc2V0ICsgbS5sZW5ndGhcblxuICAgIC8vIElnbm9yZSBhbHJlYWR5IGVzY2FwZWQgc2VxdWVuY2VzLlxuICAgIGlmIChlc2NhcGVkKSB7XG4gICAgICBwYXRoICs9IGVzY2FwZWRbMV1cbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgLy8gUHVzaCB0aGUgY3VycmVudCBwYXRoIG9udG8gdGhlIHRva2Vucy5cbiAgICBpZiAocGF0aCkge1xuICAgICAgdG9rZW5zLnB1c2gocGF0aClcbiAgICAgIHBhdGggPSAnJ1xuICAgIH1cblxuICAgIHZhciBwcmVmaXggPSByZXNbMl1cbiAgICB2YXIgbmFtZSA9IHJlc1szXVxuICAgIHZhciBjYXB0dXJlID0gcmVzWzRdXG4gICAgdmFyIGdyb3VwID0gcmVzWzVdXG4gICAgdmFyIHN1ZmZpeCA9IHJlc1s2XVxuICAgIHZhciBhc3RlcmlzayA9IHJlc1s3XVxuXG4gICAgdmFyIHJlcGVhdCA9IHN1ZmZpeCA9PT0gJysnIHx8IHN1ZmZpeCA9PT0gJyonXG4gICAgdmFyIG9wdGlvbmFsID0gc3VmZml4ID09PSAnPycgfHwgc3VmZml4ID09PSAnKidcbiAgICB2YXIgZGVsaW1pdGVyID0gcHJlZml4IHx8ICcvJ1xuICAgIHZhciBwYXR0ZXJuID0gY2FwdHVyZSB8fCBncm91cCB8fCAoYXN0ZXJpc2sgPyAnLionIDogJ1teJyArIGRlbGltaXRlciArICddKz8nKVxuXG4gICAgdG9rZW5zLnB1c2goe1xuICAgICAgbmFtZTogbmFtZSB8fCBrZXkrKyxcbiAgICAgIHByZWZpeDogcHJlZml4IHx8ICcnLFxuICAgICAgZGVsaW1pdGVyOiBkZWxpbWl0ZXIsXG4gICAgICBvcHRpb25hbDogb3B0aW9uYWwsXG4gICAgICByZXBlYXQ6IHJlcGVhdCxcbiAgICAgIHBhdHRlcm46IGVzY2FwZUdyb3VwKHBhdHRlcm4pXG4gICAgfSlcbiAgfVxuXG4gIC8vIE1hdGNoIGFueSBjaGFyYWN0ZXJzIHN0aWxsIHJlbWFpbmluZy5cbiAgaWYgKGluZGV4IDwgc3RyLmxlbmd0aCkge1xuICAgIHBhdGggKz0gc3RyLnN1YnN0cihpbmRleClcbiAgfVxuXG4gIC8vIElmIHRoZSBwYXRoIGV4aXN0cywgcHVzaCBpdCBvbnRvIHRoZSBlbmQuXG4gIGlmIChwYXRoKSB7XG4gICAgdG9rZW5zLnB1c2gocGF0aClcbiAgfVxuXG4gIHJldHVybiB0b2tlbnNcbn1cblxuLyoqXG4gKiBDb21waWxlIGEgc3RyaW5nIHRvIGEgdGVtcGxhdGUgZnVuY3Rpb24gZm9yIHRoZSBwYXRoLlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gICBzdHJcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBjb21waWxlIChzdHIpIHtcbiAgcmV0dXJuIHRva2Vuc1RvRnVuY3Rpb24ocGFyc2Uoc3RyKSlcbn1cblxuLyoqXG4gKiBFeHBvc2UgYSBtZXRob2QgZm9yIHRyYW5zZm9ybWluZyB0b2tlbnMgaW50byB0aGUgcGF0aCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gdG9rZW5zVG9GdW5jdGlvbiAodG9rZW5zKSB7XG4gIC8vIENvbXBpbGUgYWxsIHRoZSB0b2tlbnMgaW50byByZWdleHBzLlxuICB2YXIgbWF0Y2hlcyA9IG5ldyBBcnJheSh0b2tlbnMubGVuZ3RoKVxuXG4gIC8vIENvbXBpbGUgYWxsIHRoZSBwYXR0ZXJucyBiZWZvcmUgY29tcGlsYXRpb24uXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHR5cGVvZiB0b2tlbnNbaV0gPT09ICdvYmplY3QnKSB7XG4gICAgICBtYXRjaGVzW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0b2tlbnNbaV0ucGF0dGVybiArICckJylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciBwYXRoID0gJydcbiAgICB2YXIgZGF0YSA9IG9iaiB8fCB7fVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0b2tlbiA9IHRva2Vuc1tpXVxuXG4gICAgICBpZiAodHlwZW9mIHRva2VuID09PSAnc3RyaW5nJykge1xuICAgICAgICBwYXRoICs9IHRva2VuXG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgdmFyIHZhbHVlID0gZGF0YVt0b2tlbi5uYW1lXVxuICAgICAgdmFyIHNlZ21lbnRcblxuICAgICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgICAgaWYgKHRva2VuLm9wdGlvbmFsKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBcIicgKyB0b2tlbi5uYW1lICsgJ1wiIHRvIGJlIGRlZmluZWQnKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChpc2FycmF5KHZhbHVlKSkge1xuICAgICAgICBpZiAoIXRva2VuLnJlcGVhdCkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIFwiJyArIHRva2VuLm5hbWUgKyAnXCIgdG8gbm90IHJlcGVhdCwgYnV0IHJlY2VpdmVkIFwiJyArIHZhbHVlICsgJ1wiJylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBpZiAodG9rZW4ub3B0aW9uYWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIFwiJyArIHRva2VuLm5hbWUgKyAnXCIgdG8gbm90IGJlIGVtcHR5JylcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZhbHVlLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgc2VnbWVudCA9IGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZVtqXSlcblxuICAgICAgICAgIGlmICghbWF0Y2hlc1tpXS50ZXN0KHNlZ21lbnQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhbGwgXCInICsgdG9rZW4ubmFtZSArICdcIiB0byBtYXRjaCBcIicgKyB0b2tlbi5wYXR0ZXJuICsgJ1wiLCBidXQgcmVjZWl2ZWQgXCInICsgc2VnbWVudCArICdcIicpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcGF0aCArPSAoaiA9PT0gMCA/IHRva2VuLnByZWZpeCA6IHRva2VuLmRlbGltaXRlcikgKyBzZWdtZW50XG4gICAgICAgIH1cblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBzZWdtZW50ID0gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKVxuXG4gICAgICBpZiAoIW1hdGNoZXNbaV0udGVzdChzZWdtZW50KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBcIicgKyB0b2tlbi5uYW1lICsgJ1wiIHRvIG1hdGNoIFwiJyArIHRva2VuLnBhdHRlcm4gKyAnXCIsIGJ1dCByZWNlaXZlZCBcIicgKyBzZWdtZW50ICsgJ1wiJylcbiAgICAgIH1cblxuICAgICAgcGF0aCArPSB0b2tlbi5wcmVmaXggKyBzZWdtZW50XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhdGhcbiAgfVxufVxuXG4vKipcbiAqIEVzY2FwZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBzdHJpbmcuXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZXNjYXBlU3RyaW5nIChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oWy4rKj89XiE6JHt9KClbXFxdfFxcL10pL2csICdcXFxcJDEnKVxufVxuXG4vKipcbiAqIEVzY2FwZSB0aGUgY2FwdHVyaW5nIGdyb3VwIGJ5IGVzY2FwaW5nIHNwZWNpYWwgY2hhcmFjdGVycyBhbmQgbWVhbmluZy5cbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGdyb3VwXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGVzY2FwZUdyb3VwIChncm91cCkge1xuICByZXR1cm4gZ3JvdXAucmVwbGFjZSgvKFs9ITokXFwvKCldKS9nLCAnXFxcXCQxJylcbn1cblxuLyoqXG4gKiBBdHRhY2ggdGhlIGtleXMgYXMgYSBwcm9wZXJ0eSBvZiB0aGUgcmVnZXhwLlxuICpcbiAqIEBwYXJhbSAge1JlZ0V4cH0gcmVcbiAqIEBwYXJhbSAge0FycmF5fSAga2V5c1xuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5mdW5jdGlvbiBhdHRhY2hLZXlzIChyZSwga2V5cykge1xuICByZS5rZXlzID0ga2V5c1xuICByZXR1cm4gcmVcbn1cblxuLyoqXG4gKiBHZXQgdGhlIGZsYWdzIGZvciBhIHJlZ2V4cCBmcm9tIHRoZSBvcHRpb25zLlxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBmbGFncyAob3B0aW9ucykge1xuICByZXR1cm4gb3B0aW9ucy5zZW5zaXRpdmUgPyAnJyA6ICdpJ1xufVxuXG4vKipcbiAqIFB1bGwgb3V0IGtleXMgZnJvbSBhIHJlZ2V4cC5cbiAqXG4gKiBAcGFyYW0gIHtSZWdFeHB9IHBhdGhcbiAqIEBwYXJhbSAge0FycmF5fSAga2V5c1xuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5mdW5jdGlvbiByZWdleHBUb1JlZ2V4cCAocGF0aCwga2V5cykge1xuICAvLyBVc2UgYSBuZWdhdGl2ZSBsb29rYWhlYWQgdG8gbWF0Y2ggb25seSBjYXB0dXJpbmcgZ3JvdXBzLlxuICB2YXIgZ3JvdXBzID0gcGF0aC5zb3VyY2UubWF0Y2goL1xcKCg/IVxcPykvZylcblxuICBpZiAoZ3JvdXBzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBncm91cHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleXMucHVzaCh7XG4gICAgICAgIG5hbWU6IGksXG4gICAgICAgIHByZWZpeDogbnVsbCxcbiAgICAgICAgZGVsaW1pdGVyOiBudWxsLFxuICAgICAgICBvcHRpb25hbDogZmFsc2UsXG4gICAgICAgIHJlcGVhdDogZmFsc2UsXG4gICAgICAgIHBhdHRlcm46IG51bGxcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGF0dGFjaEtleXMocGF0aCwga2V5cylcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm0gYW4gYXJyYXkgaW50byBhIHJlZ2V4cC5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gIHBhdGhcbiAqIEBwYXJhbSAge0FycmF5fSAga2V5c1xuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKi9cbmZ1bmN0aW9uIGFycmF5VG9SZWdleHAgKHBhdGgsIGtleXMsIG9wdGlvbnMpIHtcbiAgdmFyIHBhcnRzID0gW11cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICBwYXJ0cy5wdXNoKHBhdGhUb1JlZ2V4cChwYXRoW2ldLCBrZXlzLCBvcHRpb25zKS5zb3VyY2UpXG4gIH1cblxuICB2YXIgcmVnZXhwID0gbmV3IFJlZ0V4cCgnKD86JyArIHBhcnRzLmpvaW4oJ3wnKSArICcpJywgZmxhZ3Mob3B0aW9ucykpXG5cbiAgcmV0dXJuIGF0dGFjaEtleXMocmVnZXhwLCBrZXlzKVxufVxuXG4vKipcbiAqIENyZWF0ZSBhIHBhdGggcmVnZXhwIGZyb20gc3RyaW5nIGlucHV0LlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gcGF0aFxuICogQHBhcmFtICB7QXJyYXl9ICBrZXlzXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge1JlZ0V4cH1cbiAqL1xuZnVuY3Rpb24gc3RyaW5nVG9SZWdleHAgKHBhdGgsIGtleXMsIG9wdGlvbnMpIHtcbiAgdmFyIHRva2VucyA9IHBhcnNlKHBhdGgpXG4gIHZhciByZSA9IHRva2Vuc1RvUmVnRXhwKHRva2Vucywgb3B0aW9ucylcblxuICAvLyBBdHRhY2gga2V5cyBiYWNrIHRvIHRoZSByZWdleHAuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHR5cGVvZiB0b2tlbnNbaV0gIT09ICdzdHJpbmcnKSB7XG4gICAgICBrZXlzLnB1c2godG9rZW5zW2ldKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhdHRhY2hLZXlzKHJlLCBrZXlzKVxufVxuXG4vKipcbiAqIEV4cG9zZSBhIGZ1bmN0aW9uIGZvciB0YWtpbmcgdG9rZW5zIGFuZCByZXR1cm5pbmcgYSBSZWdFeHAuXG4gKlxuICogQHBhcmFtICB7QXJyYXl9ICB0b2tlbnNcbiAqIEBwYXJhbSAge0FycmF5fSAga2V5c1xuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKi9cbmZ1bmN0aW9uIHRva2Vuc1RvUmVnRXhwICh0b2tlbnMsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cblxuICB2YXIgc3RyaWN0ID0gb3B0aW9ucy5zdHJpY3RcbiAgdmFyIGVuZCA9IG9wdGlvbnMuZW5kICE9PSBmYWxzZVxuICB2YXIgcm91dGUgPSAnJ1xuICB2YXIgbGFzdFRva2VuID0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXVxuICB2YXIgZW5kc1dpdGhTbGFzaCA9IHR5cGVvZiBsYXN0VG9rZW4gPT09ICdzdHJpbmcnICYmIC9cXC8kLy50ZXN0KGxhc3RUb2tlbilcblxuICAvLyBJdGVyYXRlIG92ZXIgdGhlIHRva2VucyBhbmQgY3JlYXRlIG91ciByZWdleHAgc3RyaW5nLlxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB0b2tlbiA9IHRva2Vuc1tpXVxuXG4gICAgaWYgKHR5cGVvZiB0b2tlbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJvdXRlICs9IGVzY2FwZVN0cmluZyh0b2tlbilcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHByZWZpeCA9IGVzY2FwZVN0cmluZyh0b2tlbi5wcmVmaXgpXG4gICAgICB2YXIgY2FwdHVyZSA9IHRva2VuLnBhdHRlcm5cblxuICAgICAgaWYgKHRva2VuLnJlcGVhdCkge1xuICAgICAgICBjYXB0dXJlICs9ICcoPzonICsgcHJlZml4ICsgY2FwdHVyZSArICcpKidcbiAgICAgIH1cblxuICAgICAgaWYgKHRva2VuLm9wdGlvbmFsKSB7XG4gICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICBjYXB0dXJlID0gJyg/OicgKyBwcmVmaXggKyAnKCcgKyBjYXB0dXJlICsgJykpPydcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYXB0dXJlID0gJygnICsgY2FwdHVyZSArICcpPydcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FwdHVyZSA9IHByZWZpeCArICcoJyArIGNhcHR1cmUgKyAnKSdcbiAgICAgIH1cblxuICAgICAgcm91dGUgKz0gY2FwdHVyZVxuICAgIH1cbiAgfVxuXG4gIC8vIEluIG5vbi1zdHJpY3QgbW9kZSB3ZSBhbGxvdyBhIHNsYXNoIGF0IHRoZSBlbmQgb2YgbWF0Y2guIElmIHRoZSBwYXRoIHRvXG4gIC8vIG1hdGNoIGFscmVhZHkgZW5kcyB3aXRoIGEgc2xhc2gsIHdlIHJlbW92ZSBpdCBmb3IgY29uc2lzdGVuY3kuIFRoZSBzbGFzaFxuICAvLyBpcyB2YWxpZCBhdCB0aGUgZW5kIG9mIGEgcGF0aCBtYXRjaCwgbm90IGluIHRoZSBtaWRkbGUuIFRoaXMgaXMgaW1wb3J0YW50XG4gIC8vIGluIG5vbi1lbmRpbmcgbW9kZSwgd2hlcmUgXCIvdGVzdC9cIiBzaG91bGRuJ3QgbWF0Y2ggXCIvdGVzdC8vcm91dGVcIi5cbiAgaWYgKCFzdHJpY3QpIHtcbiAgICByb3V0ZSA9IChlbmRzV2l0aFNsYXNoID8gcm91dGUuc2xpY2UoMCwgLTIpIDogcm91dGUpICsgJyg/OlxcXFwvKD89JCkpPydcbiAgfVxuXG4gIGlmIChlbmQpIHtcbiAgICByb3V0ZSArPSAnJCdcbiAgfSBlbHNlIHtcbiAgICAvLyBJbiBub24tZW5kaW5nIG1vZGUsIHdlIG5lZWQgdGhlIGNhcHR1cmluZyBncm91cHMgdG8gbWF0Y2ggYXMgbXVjaCBhc1xuICAgIC8vIHBvc3NpYmxlIGJ5IHVzaW5nIGEgcG9zaXRpdmUgbG9va2FoZWFkIHRvIHRoZSBlbmQgb3IgbmV4dCBwYXRoIHNlZ21lbnQuXG4gICAgcm91dGUgKz0gc3RyaWN0ICYmIGVuZHNXaXRoU2xhc2ggPyAnJyA6ICcoPz1cXFxcL3wkKSdcbiAgfVxuXG4gIHJldHVybiBuZXcgUmVnRXhwKCdeJyArIHJvdXRlLCBmbGFncyhvcHRpb25zKSlcbn1cblxuLyoqXG4gKiBOb3JtYWxpemUgdGhlIGdpdmVuIHBhdGggc3RyaW5nLCByZXR1cm5pbmcgYSByZWd1bGFyIGV4cHJlc3Npb24uXG4gKlxuICogQW4gZW1wdHkgYXJyYXkgY2FuIGJlIHBhc3NlZCBpbiBmb3IgdGhlIGtleXMsIHdoaWNoIHdpbGwgaG9sZCB0aGVcbiAqIHBsYWNlaG9sZGVyIGtleSBkZXNjcmlwdGlvbnMuIEZvciBleGFtcGxlLCB1c2luZyBgL3VzZXIvOmlkYCwgYGtleXNgIHdpbGxcbiAqIGNvbnRhaW4gYFt7IG5hbWU6ICdpZCcsIGRlbGltaXRlcjogJy8nLCBvcHRpb25hbDogZmFsc2UsIHJlcGVhdDogZmFsc2UgfV1gLlxuICpcbiAqIEBwYXJhbSAgeyhTdHJpbmd8UmVnRXhwfEFycmF5KX0gcGF0aFxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgICAgICAgICAgICBba2V5c11cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICAgICAgICAgW29wdGlvbnNdXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKi9cbmZ1bmN0aW9uIHBhdGhUb1JlZ2V4cCAocGF0aCwga2V5cywgb3B0aW9ucykge1xuICBrZXlzID0ga2V5cyB8fCBbXVxuXG4gIGlmICghaXNhcnJheShrZXlzKSkge1xuICAgIG9wdGlvbnMgPSBrZXlzXG4gICAga2V5cyA9IFtdXG4gIH0gZWxzZSBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge31cbiAgfVxuXG4gIGlmIChwYXRoIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgcmV0dXJuIHJlZ2V4cFRvUmVnZXhwKHBhdGgsIGtleXMsIG9wdGlvbnMpXG4gIH1cblxuICBpZiAoaXNhcnJheShwYXRoKSkge1xuICAgIHJldHVybiBhcnJheVRvUmVnZXhwKHBhdGgsIGtleXMsIG9wdGlvbnMpXG4gIH1cblxuICByZXR1cm4gc3RyaW5nVG9SZWdleHAocGF0aCwga2V5cywgb3B0aW9ucylcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoYXJyKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIlxudmFyIG9yaWcgPSBkb2N1bWVudC50aXRsZTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gc2V0O1xuXG5mdW5jdGlvbiBzZXQoc3RyKSB7XG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIGRvY3VtZW50LnRpdGxlID0gc3RyLnJlcGxhY2UoLyVbb3NdL2csIGZ1bmN0aW9uKF8pe1xuICAgIHN3aXRjaCAoXykge1xuICAgICAgY2FzZSAnJW8nOlxuICAgICAgICByZXR1cm4gb3JpZztcbiAgICAgIGNhc2UgJyVzJzpcbiAgICAgICAgcmV0dXJuIGFyZ3NbaSsrXTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnRzLnJlc2V0ID0gZnVuY3Rpb24oKXtcbiAgc2V0KG9yaWcpO1xufTtcbiIsInZhciBiZWwgPSByZXF1aXJlKCdiZWwnKSAvLyB0dXJucyB0ZW1wbGF0ZSB0YWcgaW50byBET00gZWxlbWVudHNcbnZhciBtb3JwaGRvbSA9IHJlcXVpcmUoJ21vcnBoZG9tJykgLy8gZWZmaWNpZW50bHkgZGlmZnMgKyBtb3JwaHMgdHdvIERPTSBlbGVtZW50c1xudmFyIGRlZmF1bHRFdmVudHMgPSByZXF1aXJlKCcuL3VwZGF0ZS1ldmVudHMuanMnKSAvLyBkZWZhdWx0IGV2ZW50cyB0byBiZSBjb3BpZWQgd2hlbiBkb20gZWxlbWVudHMgdXBkYXRlXG5cbm1vZHVsZS5leHBvcnRzID0gYmVsXG5cbi8vIFRPRE8gbW92ZSB0aGlzICsgZGVmYXVsdEV2ZW50cyB0byBhIG5ldyBtb2R1bGUgb25jZSB3ZSByZWNlaXZlIG1vcmUgZmVlZGJhY2tcbm1vZHVsZS5leHBvcnRzLnVwZGF0ZSA9IGZ1bmN0aW9uIChmcm9tTm9kZSwgdG9Ob2RlLCBvcHRzKSB7XG4gIGlmICghb3B0cykgb3B0cyA9IHt9XG4gIGlmIChvcHRzLmV2ZW50cyAhPT0gZmFsc2UpIHtcbiAgICBpZiAoIW9wdHMub25CZWZvcmVNb3JwaEVsKSBvcHRzLm9uQmVmb3JlTW9ycGhFbCA9IGNvcGllclxuICB9XG5cbiAgcmV0dXJuIG1vcnBoZG9tKGZyb21Ob2RlLCB0b05vZGUsIG9wdHMpXG5cbiAgLy8gbW9ycGhkb20gb25seSBjb3BpZXMgYXR0cmlidXRlcy4gd2UgZGVjaWRlZCB3ZSBhbHNvIHdhbnRlZCB0byBjb3B5IGV2ZW50c1xuICAvLyB0aGF0IGNhbiBiZSBzZXQgdmlhIGF0dHJpYnV0ZXNcbiAgZnVuY3Rpb24gY29waWVyIChmLCB0KSB7XG4gICAgLy8gY29weSBldmVudHM6XG4gICAgdmFyIGV2ZW50cyA9IG9wdHMuZXZlbnRzIHx8IGRlZmF1bHRFdmVudHNcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV2ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGV2ID0gZXZlbnRzW2ldXG4gICAgICBpZiAodFtldl0pIHsgLy8gaWYgbmV3IGVsZW1lbnQgaGFzIGEgd2hpdGVsaXN0ZWQgYXR0cmlidXRlXG4gICAgICAgIGZbZXZdID0gdFtldl0gLy8gdXBkYXRlIGV4aXN0aW5nIGVsZW1lbnRcbiAgICAgIH0gZWxzZSBpZiAoZltldl0pIHsgLy8gaWYgZXhpc3RpbmcgZWxlbWVudCBoYXMgaXQgYW5kIG5ldyBvbmUgZG9lc250XG4gICAgICAgIGZbZXZdID0gdW5kZWZpbmVkIC8vIHJlbW92ZSBpdCBmcm9tIGV4aXN0aW5nIGVsZW1lbnRcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gY29weSB2YWx1ZXMgZm9yIGZvcm0gZWxlbWVudHNcbiAgICBpZiAoZi5ub2RlTmFtZSA9PT0gJ0lOUFVUJyB8fCBmLm5vZGVOYW1lID09PSAnVEVYVEFSRUEnIHx8IGYubm9kZU5BTUUgPT09ICdTRUxFQ1QnKSB7XG4gICAgICBpZiAodC5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykgPT09IG51bGwpIHQudmFsdWUgPSBmLnZhbHVlXG4gICAgfVxuICB9XG59XG4iLCJ2YXIgZG9jdW1lbnQgPSByZXF1aXJlKCdnbG9iYWwvZG9jdW1lbnQnKVxudmFyIGh5cGVyeCA9IHJlcXVpcmUoJ2h5cGVyeCcpXG5cbnZhciBTVkdOUyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZydcbnZhciBCT09MX1BST1BTID0ge1xuICBhdXRvZm9jdXM6IDEsXG4gIGNoZWNrZWQ6IDEsXG4gIGRlZmF1bHRjaGVja2VkOiAxLFxuICBkaXNhYmxlZDogMSxcbiAgZm9ybW5vdmFsaWRhdGU6IDEsXG4gIGluZGV0ZXJtaW5hdGU6IDEsXG4gIHJlYWRvbmx5OiAxLFxuICByZXF1aXJlZDogMSxcbiAgd2lsbHZhbGlkYXRlOiAxXG59XG52YXIgU1ZHX1RBR1MgPSBbXG4gICdzdmcnLFxuICAnYWx0R2x5cGgnLCAnYWx0R2x5cGhEZWYnLCAnYWx0R2x5cGhJdGVtJywgJ2FuaW1hdGUnLCAnYW5pbWF0ZUNvbG9yJyxcbiAgJ2FuaW1hdGVNb3Rpb24nLCAnYW5pbWF0ZVRyYW5zZm9ybScsICdjaXJjbGUnLCAnY2xpcFBhdGgnLCAnY29sb3ItcHJvZmlsZScsXG4gICdjdXJzb3InLCAnZGVmcycsICdkZXNjJywgJ2VsbGlwc2UnLCAnZmVCbGVuZCcsICdmZUNvbG9yTWF0cml4JyxcbiAgJ2ZlQ29tcG9uZW50VHJhbnNmZXInLCAnZmVDb21wb3NpdGUnLCAnZmVDb252b2x2ZU1hdHJpeCcsICdmZURpZmZ1c2VMaWdodGluZycsXG4gICdmZURpc3BsYWNlbWVudE1hcCcsICdmZURpc3RhbnRMaWdodCcsICdmZUZsb29kJywgJ2ZlRnVuY0EnLCAnZmVGdW5jQicsXG4gICdmZUZ1bmNHJywgJ2ZlRnVuY1InLCAnZmVHYXVzc2lhbkJsdXInLCAnZmVJbWFnZScsICdmZU1lcmdlJywgJ2ZlTWVyZ2VOb2RlJyxcbiAgJ2ZlTW9ycGhvbG9neScsICdmZU9mZnNldCcsICdmZVBvaW50TGlnaHQnLCAnZmVTcGVjdWxhckxpZ2h0aW5nJyxcbiAgJ2ZlU3BvdExpZ2h0JywgJ2ZlVGlsZScsICdmZVR1cmJ1bGVuY2UnLCAnZmlsdGVyJywgJ2ZvbnQnLCAnZm9udC1mYWNlJyxcbiAgJ2ZvbnQtZmFjZS1mb3JtYXQnLCAnZm9udC1mYWNlLW5hbWUnLCAnZm9udC1mYWNlLXNyYycsICdmb250LWZhY2UtdXJpJyxcbiAgJ2ZvcmVpZ25PYmplY3QnLCAnZycsICdnbHlwaCcsICdnbHlwaFJlZicsICdoa2VybicsICdpbWFnZScsICdsaW5lJyxcbiAgJ2xpbmVhckdyYWRpZW50JywgJ21hcmtlcicsICdtYXNrJywgJ21ldGFkYXRhJywgJ21pc3NpbmctZ2x5cGgnLCAnbXBhdGgnLFxuICAncGF0aCcsICdwYXR0ZXJuJywgJ3BvbHlnb24nLCAncG9seWxpbmUnLCAncmFkaWFsR3JhZGllbnQnLCAncmVjdCcsXG4gICdzZXQnLCAnc3RvcCcsICdzd2l0Y2gnLCAnc3ltYm9sJywgJ3RleHQnLCAndGV4dFBhdGgnLCAndGl0bGUnLCAndHJlZicsXG4gICd0c3BhbicsICd1c2UnLCAndmlldycsICd2a2Vybidcbl1cblxuZnVuY3Rpb24gYmVsQ3JlYXRlRWxlbWVudCAodGFnLCBwcm9wcywgY2hpbGRyZW4pIHtcbiAgdmFyIGVsXG5cbiAgLy8gSWYgYW4gc3ZnIHRhZywgaXQgbmVlZHMgYSBuYW1lc3BhY2VcbiAgaWYgKFNWR19UQUdTLmluZGV4T2YodGFnKSAhPT0gLTEpIHtcbiAgICBwcm9wcy5uYW1lc3BhY2UgPSBTVkdOU1xuICB9XG5cbiAgLy8gSWYgd2UgYXJlIHVzaW5nIGEgbmFtZXNwYWNlXG4gIHZhciBucyA9IGZhbHNlXG4gIGlmIChwcm9wcy5uYW1lc3BhY2UpIHtcbiAgICBucyA9IHByb3BzLm5hbWVzcGFjZVxuICAgIGRlbGV0ZSBwcm9wcy5uYW1lc3BhY2VcbiAgfVxuXG4gIC8vIENyZWF0ZSB0aGUgZWxlbWVudFxuICBpZiAobnMpIHtcbiAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgdGFnKVxuICB9IGVsc2Uge1xuICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpXG4gIH1cblxuICAvLyBDcmVhdGUgdGhlIHByb3BlcnRpZXNcbiAgZm9yICh2YXIgcCBpbiBwcm9wcykge1xuICAgIGlmIChwcm9wcy5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgdmFyIGtleSA9IHAudG9Mb3dlckNhc2UoKVxuICAgICAgdmFyIHZhbCA9IHByb3BzW3BdXG4gICAgICAvLyBOb3JtYWxpemUgY2xhc3NOYW1lXG4gICAgICBpZiAoa2V5ID09PSAnY2xhc3NuYW1lJykge1xuICAgICAgICBrZXkgPSAnY2xhc3MnXG4gICAgICAgIHAgPSAnY2xhc3MnXG4gICAgICB9XG4gICAgICAvLyBJZiBhIHByb3BlcnR5IGlzIGJvb2xlYW4sIHNldCBpdHNlbGYgdG8gdGhlIGtleVxuICAgICAgaWYgKEJPT0xfUFJPUFNba2V5XSkge1xuICAgICAgICBpZiAodmFsID09PSAndHJ1ZScpIHZhbCA9IGtleVxuICAgICAgICBlbHNlIGlmICh2YWwgPT09ICdmYWxzZScpIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICAvLyBJZiBhIHByb3BlcnR5IHByZWZlcnMgYmVpbmcgc2V0IGRpcmVjdGx5IHZzIHNldEF0dHJpYnV0ZVxuICAgICAgaWYgKGtleS5zbGljZSgwLCAyKSA9PT0gJ29uJykge1xuICAgICAgICBlbFtwXSA9IHZhbFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG5zKSB7XG4gICAgICAgICAgZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgcCwgdmFsKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShwLCB2YWwpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhcHBlbmRDaGlsZCAoY2hpbGRzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGNoaWxkcykpIHJldHVyblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbm9kZSA9IGNoaWxkc1tpXVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkobm9kZSkpIHtcbiAgICAgICAgYXBwZW5kQ2hpbGQobm9kZSlcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnbnVtYmVyJyB8fFxuICAgICAgICB0eXBlb2Ygbm9kZSA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgIG5vZGUgaW5zdGFuY2VvZiBEYXRlIHx8XG4gICAgICAgIG5vZGUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgbm9kZSA9IG5vZGUudG9TdHJpbmcoKVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmIChlbC5sYXN0Q2hpbGQgJiYgZWwubGFzdENoaWxkLm5vZGVOYW1lID09PSAnI3RleHQnKSB7XG4gICAgICAgICAgZWwubGFzdENoaWxkLm5vZGVWYWx1ZSArPSBub2RlXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgICBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobm9kZSlcbiAgICAgIH1cblxuICAgICAgaWYgKG5vZGUgJiYgbm9kZS5ub2RlVHlwZSkge1xuICAgICAgICBlbC5hcHBlbmRDaGlsZChub2RlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBhcHBlbmRDaGlsZChjaGlsZHJlbilcblxuICByZXR1cm4gZWxcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoeXBlcngoYmVsQ3JlYXRlRWxlbWVudClcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZUVsZW1lbnQgPSBiZWxDcmVhdGVFbGVtZW50XG4iLCJ2YXIgdG9wTGV2ZWwgPSB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6XG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB7fVxudmFyIG1pbkRvYyA9IHJlcXVpcmUoJ21pbi1kb2N1bWVudCcpO1xuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQ7XG59IGVsc2Uge1xuICAgIHZhciBkb2NjeSA9IHRvcExldmVsWydfX0dMT0JBTF9ET0NVTUVOVF9DQUNIRUA0J107XG5cbiAgICBpZiAoIWRvY2N5KSB7XG4gICAgICAgIGRvY2N5ID0gdG9wTGV2ZWxbJ19fR0xPQkFMX0RPQ1VNRU5UX0NBQ0hFQDQnXSA9IG1pbkRvYztcbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGRvY2N5O1xufVxuIiwidmFyIGF0dHJUb1Byb3AgPSByZXF1aXJlKCdoeXBlcnNjcmlwdC1hdHRyaWJ1dGUtdG8tcHJvcGVydHknKVxuXG52YXIgVkFSID0gMCwgVEVYVCA9IDEsIE9QRU4gPSAyLCBDTE9TRSA9IDMsIEFUVFIgPSA0XG52YXIgQVRUUl9LRVkgPSA1LCBBVFRSX0tFWV9XID0gNlxudmFyIEFUVFJfVkFMVUVfVyA9IDcsIEFUVFJfVkFMVUUgPSA4XG52YXIgQVRUUl9WQUxVRV9TUSA9IDksIEFUVFJfVkFMVUVfRFEgPSAxMFxudmFyIEFUVFJfRVEgPSAxMSwgQVRUUl9CUkVBSyA9IDEyXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGgsIG9wdHMpIHtcbiAgaCA9IGF0dHJUb1Byb3AoaClcbiAgaWYgKCFvcHRzKSBvcHRzID0ge31cbiAgdmFyIGNvbmNhdCA9IG9wdHMuY29uY2F0IHx8IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIFN0cmluZyhhKSArIFN0cmluZyhiKVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChzdHJpbmdzKSB7XG4gICAgdmFyIHN0YXRlID0gVEVYVCwgcmVnID0gJydcbiAgICB2YXIgYXJnbGVuID0gYXJndW1lbnRzLmxlbmd0aFxuICAgIHZhciBwYXJ0cyA9IFtdXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0cmluZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChpIDwgYXJnbGVuIC0gMSkge1xuICAgICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2krMV1cbiAgICAgICAgdmFyIHAgPSBwYXJzZShzdHJpbmdzW2ldKVxuICAgICAgICB2YXIgeHN0YXRlID0gc3RhdGVcbiAgICAgICAgaWYgKHhzdGF0ZSA9PT0gQVRUUl9WQUxVRV9EUSkgeHN0YXRlID0gQVRUUl9WQUxVRVxuICAgICAgICBpZiAoeHN0YXRlID09PSBBVFRSX1ZBTFVFX1NRKSB4c3RhdGUgPSBBVFRSX1ZBTFVFXG4gICAgICAgIGlmICh4c3RhdGUgPT09IEFUVFJfVkFMVUVfVykgeHN0YXRlID0gQVRUUl9WQUxVRVxuICAgICAgICBpZiAoeHN0YXRlID09PSBBVFRSKSB4c3RhdGUgPSBBVFRSX0tFWVxuICAgICAgICBwLnB1c2goWyBWQVIsIHhzdGF0ZSwgYXJnIF0pXG4gICAgICAgIHBhcnRzLnB1c2guYXBwbHkocGFydHMsIHApXG4gICAgICB9IGVsc2UgcGFydHMucHVzaC5hcHBseShwYXJ0cywgcGFyc2Uoc3RyaW5nc1tpXSkpXG4gICAgfVxuXG4gICAgdmFyIHRyZWUgPSBbbnVsbCx7fSxbXV1cbiAgICB2YXIgc3RhY2sgPSBbW3RyZWUsLTFdXVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjdXIgPSBzdGFja1tzdGFjay5sZW5ndGgtMV1bMF1cbiAgICAgIHZhciBwID0gcGFydHNbaV0sIHMgPSBwWzBdXG4gICAgICBpZiAocyA9PT0gT1BFTiAmJiAvXlxcLy8udGVzdChwWzFdKSkge1xuICAgICAgICB2YXIgaXggPSBzdGFja1tzdGFjay5sZW5ndGgtMV1bMV1cbiAgICAgICAgaWYgKHN0YWNrLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBzdGFjay5wb3AoKVxuICAgICAgICAgIHN0YWNrW3N0YWNrLmxlbmd0aC0xXVswXVsyXVtpeF0gPSBoKFxuICAgICAgICAgICAgY3VyWzBdLCBjdXJbMV0sIGN1clsyXS5sZW5ndGggPyBjdXJbMl0gOiB1bmRlZmluZWRcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocyA9PT0gT1BFTikge1xuICAgICAgICB2YXIgYyA9IFtwWzFdLHt9LFtdXVxuICAgICAgICBjdXJbMl0ucHVzaChjKVxuICAgICAgICBzdGFjay5wdXNoKFtjLGN1clsyXS5sZW5ndGgtMV0pXG4gICAgICB9IGVsc2UgaWYgKHMgPT09IEFUVFJfS0VZIHx8IChzID09PSBWQVIgJiYgcFsxXSA9PT0gQVRUUl9LRVkpKSB7XG4gICAgICAgIHZhciBrZXkgPSAnJ1xuICAgICAgICB2YXIgY29weUtleVxuICAgICAgICBmb3IgKDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHBhcnRzW2ldWzBdID09PSBBVFRSX0tFWSkge1xuICAgICAgICAgICAga2V5ID0gY29uY2F0KGtleSwgcGFydHNbaV1bMV0pXG4gICAgICAgICAgfSBlbHNlIGlmIChwYXJ0c1tpXVswXSA9PT0gVkFSICYmIHBhcnRzW2ldWzFdID09PSBBVFRSX0tFWSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXJ0c1tpXVsyXSA9PT0gJ29iamVjdCcgJiYgIWtleSkge1xuICAgICAgICAgICAgICBmb3IgKGNvcHlLZXkgaW4gcGFydHNbaV1bMl0pIHtcbiAgICAgICAgICAgICAgICBpZiAocGFydHNbaV1bMl0uaGFzT3duUHJvcGVydHkoY29weUtleSkgJiYgIWN1clsxXVtjb3B5S2V5XSkge1xuICAgICAgICAgICAgICAgICAgY3VyWzFdW2NvcHlLZXldID0gcGFydHNbaV1bMl1bY29weUtleV1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGtleSA9IGNvbmNhdChrZXksIHBhcnRzW2ldWzJdKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBicmVha1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJ0c1tpXVswXSA9PT0gQVRUUl9FUSkgaSsrXG4gICAgICAgIHZhciBqID0gaVxuICAgICAgICBmb3IgKDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHBhcnRzW2ldWzBdID09PSBBVFRSX1ZBTFVFIHx8IHBhcnRzW2ldWzBdID09PSBBVFRSX0tFWSkge1xuICAgICAgICAgICAgaWYgKCFjdXJbMV1ba2V5XSkgY3VyWzFdW2tleV0gPSBzdHJmbihwYXJ0c1tpXVsxXSlcbiAgICAgICAgICAgIGVsc2UgY3VyWzFdW2tleV0gPSBjb25jYXQoY3VyWzFdW2tleV0sIHBhcnRzW2ldWzFdKVxuICAgICAgICAgIH0gZWxzZSBpZiAocGFydHNbaV1bMF0gPT09IFZBUlxuICAgICAgICAgICYmIChwYXJ0c1tpXVsxXSA9PT0gQVRUUl9WQUxVRSB8fCBwYXJ0c1tpXVsxXSA9PT0gQVRUUl9LRVkpKSB7XG4gICAgICAgICAgICBpZiAoIWN1clsxXVtrZXldKSBjdXJbMV1ba2V5XSA9IHN0cmZuKHBhcnRzW2ldWzJdKVxuICAgICAgICAgICAgZWxzZSBjdXJbMV1ba2V5XSA9IGNvbmNhdChjdXJbMV1ba2V5XSwgcGFydHNbaV1bMl0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChrZXkubGVuZ3RoICYmICFjdXJbMV1ba2V5XSAmJiBpID09PSBqXG4gICAgICAgICAgICAmJiAocGFydHNbaV1bMF0gPT09IENMT1NFIHx8IHBhcnRzW2ldWzBdID09PSBBVFRSX0JSRUFLKSkge1xuICAgICAgICAgICAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9pbmZyYXN0cnVjdHVyZS5odG1sI2Jvb2xlYW4tYXR0cmlidXRlc1xuICAgICAgICAgICAgICAvLyBlbXB0eSBzdHJpbmcgaXMgZmFsc3ksIG5vdCB3ZWxsIGJlaGF2ZWQgdmFsdWUgaW4gYnJvd3NlclxuICAgICAgICAgICAgICBjdXJbMV1ba2V5XSA9IGtleS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzID09PSBBVFRSX0tFWSkge1xuICAgICAgICBjdXJbMV1bcFsxXV0gPSB0cnVlXG4gICAgICB9IGVsc2UgaWYgKHMgPT09IFZBUiAmJiBwWzFdID09PSBBVFRSX0tFWSkge1xuICAgICAgICBjdXJbMV1bcFsyXV0gPSB0cnVlXG4gICAgICB9IGVsc2UgaWYgKHMgPT09IENMT1NFKSB7XG4gICAgICAgIGlmIChzZWxmQ2xvc2luZyhjdXJbMF0pICYmIHN0YWNrLmxlbmd0aCkge1xuICAgICAgICAgIHZhciBpeCA9IHN0YWNrW3N0YWNrLmxlbmd0aC0xXVsxXVxuICAgICAgICAgIHN0YWNrLnBvcCgpXG4gICAgICAgICAgc3RhY2tbc3RhY2subGVuZ3RoLTFdWzBdWzJdW2l4XSA9IGgoXG4gICAgICAgICAgICBjdXJbMF0sIGN1clsxXSwgY3VyWzJdLmxlbmd0aCA/IGN1clsyXSA6IHVuZGVmaW5lZFxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzID09PSBWQVIgJiYgcFsxXSA9PT0gVEVYVCkge1xuICAgICAgICBpZiAocFsyXSA9PT0gdW5kZWZpbmVkIHx8IHBbMl0gPT09IG51bGwpIHBbMl0gPSAnJ1xuICAgICAgICBlbHNlIGlmICghcFsyXSkgcFsyXSA9IGNvbmNhdCgnJywgcFsyXSlcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocFsyXVswXSkpIHtcbiAgICAgICAgICBjdXJbMl0ucHVzaC5hcHBseShjdXJbMl0sIHBbMl0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3VyWzJdLnB1c2gocFsyXSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzID09PSBURVhUKSB7XG4gICAgICAgIGN1clsyXS5wdXNoKHBbMV0pXG4gICAgICB9IGVsc2UgaWYgKHMgPT09IEFUVFJfRVEgfHwgcyA9PT0gQVRUUl9CUkVBSykge1xuICAgICAgICAvLyBuby1vcFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmhhbmRsZWQ6ICcgKyBzKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0cmVlWzJdLmxlbmd0aCA+IDEgJiYgL15cXHMqJC8udGVzdCh0cmVlWzJdWzBdKSkge1xuICAgICAgdHJlZVsyXS5zaGlmdCgpXG4gICAgfVxuXG4gICAgaWYgKHRyZWVbMl0ubGVuZ3RoID4gMlxuICAgIHx8ICh0cmVlWzJdLmxlbmd0aCA9PT0gMiAmJiAvXFxTLy50ZXN0KHRyZWVbMl1bMV0pKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnbXVsdGlwbGUgcm9vdCBlbGVtZW50cyBtdXN0IGJlIHdyYXBwZWQgaW4gYW4gZW5jbG9zaW5nIHRhZydcbiAgICAgIClcbiAgICB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodHJlZVsyXVswXSkgJiYgdHlwZW9mIHRyZWVbMl1bMF1bMF0gPT09ICdzdHJpbmcnXG4gICAgJiYgQXJyYXkuaXNBcnJheSh0cmVlWzJdWzBdWzJdKSkge1xuICAgICAgdHJlZVsyXVswXSA9IGgodHJlZVsyXVswXVswXSwgdHJlZVsyXVswXVsxXSwgdHJlZVsyXVswXVsyXSlcbiAgICB9XG4gICAgcmV0dXJuIHRyZWVbMl1bMF1cblxuICAgIGZ1bmN0aW9uIHBhcnNlIChzdHIpIHtcbiAgICAgIHZhciByZXMgPSBbXVxuICAgICAgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFX1cpIHN0YXRlID0gQVRUUlxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGMgPSBzdHIuY2hhckF0KGkpXG4gICAgICAgIGlmIChzdGF0ZSA9PT0gVEVYVCAmJiBjID09PSAnPCcpIHtcbiAgICAgICAgICBpZiAocmVnLmxlbmd0aCkgcmVzLnB1c2goW1RFWFQsIHJlZ10pXG4gICAgICAgICAgcmVnID0gJydcbiAgICAgICAgICBzdGF0ZSA9IE9QRU5cbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAnPicgJiYgIXF1b3Qoc3RhdGUpKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBPUEVOKSB7XG4gICAgICAgICAgICByZXMucHVzaChbT1BFTixyZWddKVxuICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfS0VZKSB7XG4gICAgICAgICAgICByZXMucHVzaChbQVRUUl9LRVkscmVnXSlcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFICYmIHJlZy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKFtBVFRSX1ZBTFVFLHJlZ10pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJlcy5wdXNoKFtDTE9TRV0pXG4gICAgICAgICAgcmVnID0gJydcbiAgICAgICAgICBzdGF0ZSA9IFRFWFRcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gVEVYVCkge1xuICAgICAgICAgIHJlZyArPSBjXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IE9QRU4gJiYgL1xccy8udGVzdChjKSkge1xuICAgICAgICAgIHJlcy5wdXNoKFtPUEVOLCByZWddKVxuICAgICAgICAgIHJlZyA9ICcnXG4gICAgICAgICAgc3RhdGUgPSBBVFRSXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IE9QRU4pIHtcbiAgICAgICAgICByZWcgKz0gY1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSICYmIC9bXFx3LV0vLnRlc3QoYykpIHtcbiAgICAgICAgICBzdGF0ZSA9IEFUVFJfS0VZXG4gICAgICAgICAgcmVnID0gY1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSICYmIC9cXHMvLnRlc3QoYykpIHtcbiAgICAgICAgICBpZiAocmVnLmxlbmd0aCkgcmVzLnB1c2goW0FUVFJfS0VZLHJlZ10pXG4gICAgICAgICAgcmVzLnB1c2goW0FUVFJfQlJFQUtdKVxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX0tFWSAmJiAvXFxzLy50ZXN0KGMpKSB7XG4gICAgICAgICAgcmVzLnB1c2goW0FUVFJfS0VZLHJlZ10pXG4gICAgICAgICAgcmVnID0gJydcbiAgICAgICAgICBzdGF0ZSA9IEFUVFJfS0VZX1dcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9LRVkgJiYgYyA9PT0gJz0nKSB7XG4gICAgICAgICAgcmVzLnB1c2goW0FUVFJfS0VZLHJlZ10sW0FUVFJfRVFdKVxuICAgICAgICAgIHJlZyA9ICcnXG4gICAgICAgICAgc3RhdGUgPSBBVFRSX1ZBTFVFX1dcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9LRVkpIHtcbiAgICAgICAgICByZWcgKz0gY1xuICAgICAgICB9IGVsc2UgaWYgKChzdGF0ZSA9PT0gQVRUUl9LRVlfVyB8fCBzdGF0ZSA9PT0gQVRUUikgJiYgYyA9PT0gJz0nKSB7XG4gICAgICAgICAgcmVzLnB1c2goW0FUVFJfRVFdKVxuICAgICAgICAgIHN0YXRlID0gQVRUUl9WQUxVRV9XXG4gICAgICAgIH0gZWxzZSBpZiAoKHN0YXRlID09PSBBVFRSX0tFWV9XIHx8IHN0YXRlID09PSBBVFRSKSAmJiAhL1xccy8udGVzdChjKSkge1xuICAgICAgICAgIHJlcy5wdXNoKFtBVFRSX0JSRUFLXSlcbiAgICAgICAgICBpZiAoL1tcXHctXS8udGVzdChjKSkge1xuICAgICAgICAgICAgcmVnICs9IGNcbiAgICAgICAgICAgIHN0YXRlID0gQVRUUl9LRVlcbiAgICAgICAgICB9IGVsc2Ugc3RhdGUgPSBBVFRSXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUVfVyAmJiBjID09PSAnXCInKSB7XG4gICAgICAgICAgc3RhdGUgPSBBVFRSX1ZBTFVFX0RRXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUVfVyAmJiBjID09PSBcIidcIikge1xuICAgICAgICAgIHN0YXRlID0gQVRUUl9WQUxVRV9TUVxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFX0RRICYmIGMgPT09ICdcIicpIHtcbiAgICAgICAgICByZXMucHVzaChbQVRUUl9WQUxVRSxyZWddLFtBVFRSX0JSRUFLXSlcbiAgICAgICAgICByZWcgPSAnJ1xuICAgICAgICAgIHN0YXRlID0gQVRUUlxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFX1NRICYmIGMgPT09IFwiJ1wiKSB7XG4gICAgICAgICAgcmVzLnB1c2goW0FUVFJfVkFMVUUscmVnXSxbQVRUUl9CUkVBS10pXG4gICAgICAgICAgcmVnID0gJydcbiAgICAgICAgICBzdGF0ZSA9IEFUVFJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9WQUxVRV9XICYmICEvXFxzLy50ZXN0KGMpKSB7XG4gICAgICAgICAgc3RhdGUgPSBBVFRSX1ZBTFVFXG4gICAgICAgICAgaS0tXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUUgJiYgL1xccy8udGVzdChjKSkge1xuICAgICAgICAgIHJlcy5wdXNoKFtBVFRSX0JSRUFLXSxbQVRUUl9WQUxVRSxyZWddKVxuICAgICAgICAgIHJlZyA9ICcnXG4gICAgICAgICAgc3RhdGUgPSBBVFRSXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUUgfHwgc3RhdGUgPT09IEFUVFJfVkFMVUVfU1FcbiAgICAgICAgfHwgc3RhdGUgPT09IEFUVFJfVkFMVUVfRFEpIHtcbiAgICAgICAgICByZWcgKz0gY1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3RhdGUgPT09IFRFWFQgJiYgcmVnLmxlbmd0aCkge1xuICAgICAgICByZXMucHVzaChbVEVYVCxyZWddKVxuICAgICAgICByZWcgPSAnJ1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9WQUxVRSAmJiByZWcubGVuZ3RoKSB7XG4gICAgICAgIHJlcy5wdXNoKFtBVFRSX1ZBTFVFLHJlZ10pXG4gICAgICAgIHJlZyA9ICcnXG4gICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFX0RRICYmIHJlZy5sZW5ndGgpIHtcbiAgICAgICAgcmVzLnB1c2goW0FUVFJfVkFMVUUscmVnXSlcbiAgICAgICAgcmVnID0gJydcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUVfU1EgJiYgcmVnLmxlbmd0aCkge1xuICAgICAgICByZXMucHVzaChbQVRUUl9WQUxVRSxyZWddKVxuICAgICAgICByZWcgPSAnJ1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9LRVkpIHtcbiAgICAgICAgcmVzLnB1c2goW0FUVFJfS0VZLHJlZ10pXG4gICAgICAgIHJlZyA9ICcnXG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc3RyZm4gKHgpIHtcbiAgICBpZiAodHlwZW9mIHggPT09ICdmdW5jdGlvbicpIHJldHVybiB4XG4gICAgZWxzZSBpZiAodHlwZW9mIHggPT09ICdzdHJpbmcnKSByZXR1cm4geFxuICAgIGVsc2UgaWYgKHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnKSByZXR1cm4geFxuICAgIGVsc2UgcmV0dXJuIGNvbmNhdCgnJywgeClcbiAgfVxufVxuXG5mdW5jdGlvbiBxdW90IChzdGF0ZSkge1xuICByZXR1cm4gc3RhdGUgPT09IEFUVFJfVkFMVUVfU1EgfHwgc3RhdGUgPT09IEFUVFJfVkFMVUVfRFFcbn1cblxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHlcbmZ1bmN0aW9uIGhhcyAob2JqLCBrZXkpIHsgcmV0dXJuIGhhc093bi5jYWxsKG9iaiwga2V5KSB9XG5cbnZhciBjbG9zZVJFID0gUmVnRXhwKCdeKCcgKyBbXG4gICdhcmVhJywgJ2Jhc2UnLCAnYmFzZWZvbnQnLCAnYmdzb3VuZCcsICdicicsICdjb2wnLCAnY29tbWFuZCcsICdlbWJlZCcsXG4gICdmcmFtZScsICdocicsICdpbWcnLCAnaW5wdXQnLCAnaXNpbmRleCcsICdrZXlnZW4nLCAnbGluaycsICdtZXRhJywgJ3BhcmFtJyxcbiAgJ3NvdXJjZScsICd0cmFjaycsICd3YnInLFxuICAvLyBTVkcgVEFHU1xuICAnYW5pbWF0ZScsICdhbmltYXRlVHJhbnNmb3JtJywgJ2NpcmNsZScsICdjdXJzb3InLCAnZGVzYycsICdlbGxpcHNlJyxcbiAgJ2ZlQmxlbmQnLCAnZmVDb2xvck1hdHJpeCcsICdmZUNvbXBvbmVudFRyYW5zZmVyJywgJ2ZlQ29tcG9zaXRlJyxcbiAgJ2ZlQ29udm9sdmVNYXRyaXgnLCAnZmVEaWZmdXNlTGlnaHRpbmcnLCAnZmVEaXNwbGFjZW1lbnRNYXAnLFxuICAnZmVEaXN0YW50TGlnaHQnLCAnZmVGbG9vZCcsICdmZUZ1bmNBJywgJ2ZlRnVuY0InLCAnZmVGdW5jRycsICdmZUZ1bmNSJyxcbiAgJ2ZlR2F1c3NpYW5CbHVyJywgJ2ZlSW1hZ2UnLCAnZmVNZXJnZU5vZGUnLCAnZmVNb3JwaG9sb2d5JyxcbiAgJ2ZlT2Zmc2V0JywgJ2ZlUG9pbnRMaWdodCcsICdmZVNwZWN1bGFyTGlnaHRpbmcnLCAnZmVTcG90TGlnaHQnLCAnZmVUaWxlJyxcbiAgJ2ZlVHVyYnVsZW5jZScsICdmb250LWZhY2UtZm9ybWF0JywgJ2ZvbnQtZmFjZS1uYW1lJywgJ2ZvbnQtZmFjZS11cmknLFxuICAnZ2x5cGgnLCAnZ2x5cGhSZWYnLCAnaGtlcm4nLCAnaW1hZ2UnLCAnbGluZScsICdtaXNzaW5nLWdseXBoJywgJ21wYXRoJyxcbiAgJ3BhdGgnLCAncG9seWdvbicsICdwb2x5bGluZScsICdyZWN0JywgJ3NldCcsICdzdG9wJywgJ3RyZWYnLCAndXNlJywgJ3ZpZXcnLFxuICAndmtlcm4nXG5dLmpvaW4oJ3wnKSArICcpKD86W1xcLiNdW2EtekEtWjAtOVxcdTAwN0YtXFx1RkZGRl86LV0rKSokJylcbmZ1bmN0aW9uIHNlbGZDbG9zaW5nICh0YWcpIHsgcmV0dXJuIGNsb3NlUkUudGVzdCh0YWcpIH1cbiIsIm1vZHVsZS5leHBvcnRzID0gYXR0cmlidXRlVG9Qcm9wZXJ0eVxuXG52YXIgdHJhbnNmb3JtID0ge1xuICAnY2xhc3MnOiAnY2xhc3NOYW1lJyxcbiAgJ2Zvcic6ICdodG1sRm9yJyxcbiAgJ2h0dHAtZXF1aXYnOiAnaHR0cEVxdWl2J1xufVxuXG5mdW5jdGlvbiBhdHRyaWJ1dGVUb1Byb3BlcnR5IChoKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGFnTmFtZSwgYXR0cnMsIGNoaWxkcmVuKSB7XG4gICAgZm9yICh2YXIgYXR0ciBpbiBhdHRycykge1xuICAgICAgaWYgKGF0dHIgaW4gdHJhbnNmb3JtKSB7XG4gICAgICAgIGF0dHJzW3RyYW5zZm9ybVthdHRyXV0gPSBhdHRyc1thdHRyXVxuICAgICAgICBkZWxldGUgYXR0cnNbYXR0cl1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGgodGFnTmFtZSwgYXR0cnMsIGNoaWxkcmVuKVxuICB9XG59XG4iLCIvLyBDcmVhdGUgYSByYW5nZSBvYmplY3QgZm9yIGVmZmljZW50bHkgcmVuZGVyaW5nIHN0cmluZ3MgdG8gZWxlbWVudHMuXG52YXIgcmFuZ2U7XG5cbnZhciB0ZXN0RWwgPSB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnID8gZG9jdW1lbnQuYm9keSB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSA6IHt9O1xuXG4vLyBGaXhlcyBodHRwczovL2dpdGh1Yi5jb20vcGF0cmljay1zdGVlbGUtaWRlbS9tb3JwaGRvbS9pc3N1ZXMvMzIgKElFNysgc3VwcG9ydClcbi8vIDw9SUU3IGRvZXMgbm90IHN1cHBvcnQgZWwuaGFzQXR0cmlidXRlKG5hbWUpXG52YXIgaGFzQXR0cmlidXRlO1xuaWYgKHRlc3RFbC5oYXNBdHRyaWJ1dGUpIHtcbiAgICBoYXNBdHRyaWJ1dGUgPSBmdW5jdGlvbiBoYXNBdHRyaWJ1dGUoZWwsIG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGVsLmhhc0F0dHJpYnV0ZShuYW1lKTtcbiAgICB9O1xufSBlbHNlIHtcbiAgICBoYXNBdHRyaWJ1dGUgPSBmdW5jdGlvbiBoYXNBdHRyaWJ1dGUoZWwsIG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZU5vZGUobmFtZSk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gZW1wdHkobykge1xuICAgIGZvciAodmFyIGsgaW4gbykge1xuICAgICAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiB0b0VsZW1lbnQoc3RyKSB7XG4gICAgaWYgKCFyYW5nZSAmJiBkb2N1bWVudC5jcmVhdGVSYW5nZSkge1xuICAgICAgICByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgIHJhbmdlLnNlbGVjdE5vZGUoZG9jdW1lbnQuYm9keSk7XG4gICAgfVxuXG4gICAgdmFyIGZyYWdtZW50O1xuICAgIGlmIChyYW5nZSAmJiByYW5nZS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQpIHtcbiAgICAgICAgZnJhZ21lbnQgPSByYW5nZS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc3RyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JvZHknKTtcbiAgICAgICAgZnJhZ21lbnQuaW5uZXJIVE1MID0gc3RyO1xuICAgIH1cbiAgICByZXR1cm4gZnJhZ21lbnQuY2hpbGROb2Rlc1swXTtcbn1cblxudmFyIHNwZWNpYWxFbEhhbmRsZXJzID0ge1xuICAgIC8qKlxuICAgICAqIE5lZWRlZCBmb3IgSUUuIEFwcGFyZW50bHkgSUUgZG9lc24ndCB0aGlua1xuICAgICAqIHRoYXQgXCJzZWxlY3RlZFwiIGlzIGFuIGF0dHJpYnV0ZSB3aGVuIHJlYWRpbmdcbiAgICAgKiBvdmVyIHRoZSBhdHRyaWJ1dGVzIHVzaW5nIHNlbGVjdEVsLmF0dHJpYnV0ZXNcbiAgICAgKi9cbiAgICBPUFRJT046IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICBpZiAoKGZyb21FbC5zZWxlY3RlZCA9IHRvRWwuc2VsZWN0ZWQpKSB7XG4gICAgICAgICAgICBmcm9tRWwuc2V0QXR0cmlidXRlKCdzZWxlY3RlZCcsICcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgJycpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBUaGUgXCJ2YWx1ZVwiIGF0dHJpYnV0ZSBpcyBzcGVjaWFsIGZvciB0aGUgPGlucHV0PiBlbGVtZW50XG4gICAgICogc2luY2UgaXQgc2V0cyB0aGUgaW5pdGlhbCB2YWx1ZS4gQ2hhbmdpbmcgdGhlIFwidmFsdWVcIlxuICAgICAqIGF0dHJpYnV0ZSB3aXRob3V0IGNoYW5naW5nIHRoZSBcInZhbHVlXCIgcHJvcGVydHkgd2lsbCBoYXZlXG4gICAgICogbm8gZWZmZWN0IHNpbmNlIGl0IGlzIG9ubHkgdXNlZCB0byB0aGUgc2V0IHRoZSBpbml0aWFsIHZhbHVlLlxuICAgICAqIFNpbWlsYXIgZm9yIHRoZSBcImNoZWNrZWRcIiBhdHRyaWJ1dGUuXG4gICAgICovXG4gICAgSU5QVVQ6IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICBmcm9tRWwuY2hlY2tlZCA9IHRvRWwuY2hlY2tlZDtcblxuICAgICAgICBpZiAoZnJvbUVsLnZhbHVlICE9IHRvRWwudmFsdWUpIHtcbiAgICAgICAgICAgIGZyb21FbC52YWx1ZSA9IHRvRWwudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhhc0F0dHJpYnV0ZSh0b0VsLCAnY2hlY2tlZCcpKSB7XG4gICAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKCdjaGVja2VkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhhc0F0dHJpYnV0ZSh0b0VsLCAndmFsdWUnKSkge1xuICAgICAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZSgndmFsdWUnKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBURVhUQVJFQTogZnVuY3Rpb24oZnJvbUVsLCB0b0VsKSB7XG4gICAgICAgIHZhciBuZXdWYWx1ZSA9IHRvRWwudmFsdWU7XG4gICAgICAgIGlmIChmcm9tRWwudmFsdWUgIT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgIGZyb21FbC52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZyb21FbC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICBmcm9tRWwuZmlyc3RDaGlsZC5ub2RlVmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG4vKipcbiAqIExvb3Agb3ZlciBhbGwgb2YgdGhlIGF0dHJpYnV0ZXMgb24gdGhlIHRhcmdldCBub2RlIGFuZCBtYWtlIHN1cmUgdGhlXG4gKiBvcmlnaW5hbCBET00gbm9kZSBoYXMgdGhlIHNhbWUgYXR0cmlidXRlcy4gSWYgYW4gYXR0cmlidXRlXG4gKiBmb3VuZCBvbiB0aGUgb3JpZ2luYWwgbm9kZSBpcyBub3Qgb24gdGhlIG5ldyBub2RlIHRoZW4gcmVtb3ZlIGl0IGZyb21cbiAqIHRoZSBvcmlnaW5hbCBub2RlXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZnJvbU5vZGVcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSB0b05vZGVcbiAqL1xuZnVuY3Rpb24gbW9ycGhBdHRycyhmcm9tTm9kZSwgdG9Ob2RlKSB7XG4gICAgdmFyIGF0dHJzID0gdG9Ob2RlLmF0dHJpYnV0ZXM7XG4gICAgdmFyIGk7XG4gICAgdmFyIGF0dHI7XG4gICAgdmFyIGF0dHJOYW1lO1xuICAgIHZhciBhdHRyVmFsdWU7XG4gICAgdmFyIGZvdW5kQXR0cnMgPSB7fTtcblxuICAgIGZvciAoaT1hdHRycy5sZW5ndGgtMTsgaT49MDsgaS0tKSB7XG4gICAgICAgIGF0dHIgPSBhdHRyc1tpXTtcbiAgICAgICAgaWYgKGF0dHIuc3BlY2lmaWVkICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRyLm5hbWU7XG4gICAgICAgICAgICBhdHRyVmFsdWUgPSBhdHRyLnZhbHVlO1xuICAgICAgICAgICAgZm91bmRBdHRyc1thdHRyTmFtZV0gPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAoZnJvbU5vZGUuZ2V0QXR0cmlidXRlKGF0dHJOYW1lKSAhPT0gYXR0clZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZnJvbU5vZGUuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBhdHRyVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gRGVsZXRlIGFueSBleHRyYSBhdHRyaWJ1dGVzIGZvdW5kIG9uIHRoZSBvcmlnaW5hbCBET00gZWxlbWVudCB0aGF0IHdlcmVuJ3RcbiAgICAvLyBmb3VuZCBvbiB0aGUgdGFyZ2V0IGVsZW1lbnQuXG4gICAgYXR0cnMgPSBmcm9tTm9kZS5hdHRyaWJ1dGVzO1xuXG4gICAgZm9yIChpPWF0dHJzLmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcbiAgICAgICAgYXR0ciA9IGF0dHJzW2ldO1xuICAgICAgICBpZiAoYXR0ci5zcGVjaWZpZWQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBhdHRyTmFtZSA9IGF0dHIubmFtZTtcbiAgICAgICAgICAgIGlmICghZm91bmRBdHRycy5oYXNPd25Qcm9wZXJ0eShhdHRyTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmcm9tTm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIENvcGllcyB0aGUgY2hpbGRyZW4gb2Ygb25lIERPTSBlbGVtZW50IHRvIGFub3RoZXIgRE9NIGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gbW92ZUNoaWxkcmVuKGZyb21FbCwgdG9FbCkge1xuICAgIHZhciBjdXJDaGlsZCA9IGZyb21FbC5maXJzdENoaWxkO1xuICAgIHdoaWxlKGN1ckNoaWxkKSB7XG4gICAgICAgIHZhciBuZXh0Q2hpbGQgPSBjdXJDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgdG9FbC5hcHBlbmRDaGlsZChjdXJDaGlsZCk7XG4gICAgICAgIGN1ckNoaWxkID0gbmV4dENoaWxkO1xuICAgIH1cbiAgICByZXR1cm4gdG9FbDtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdEdldE5vZGVLZXkobm9kZSkge1xuICAgIHJldHVybiBub2RlLmlkO1xufVxuXG5mdW5jdGlvbiBtb3JwaGRvbShmcm9tTm9kZSwgdG9Ob2RlLCBvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRvTm9kZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKGZyb21Ob2RlLm5vZGVOYW1lID09PSAnI2RvY3VtZW50JyB8fCBmcm9tTm9kZS5ub2RlTmFtZSA9PT0gJ0hUTUwnKSB7XG4gICAgICAgICAgICB2YXIgdG9Ob2RlSHRtbCA9IHRvTm9kZTtcbiAgICAgICAgICAgIHRvTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2h0bWwnKTtcbiAgICAgICAgICAgIHRvTm9kZS5pbm5lckhUTUwgPSB0b05vZGVIdG1sO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9Ob2RlID0gdG9FbGVtZW50KHRvTm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc2F2ZWRFbHMgPSB7fTsgLy8gVXNlZCB0byBzYXZlIG9mZiBET00gZWxlbWVudHMgd2l0aCBJRHNcbiAgICB2YXIgdW5tYXRjaGVkRWxzID0ge307XG4gICAgdmFyIGdldE5vZGVLZXkgPSBvcHRpb25zLmdldE5vZGVLZXkgfHwgZGVmYXVsdEdldE5vZGVLZXk7XG4gICAgdmFyIG9uQmVmb3JlTm9kZUFkZGVkID0gb3B0aW9ucy5vbkJlZm9yZU5vZGVBZGRlZCB8fCBub29wO1xuICAgIHZhciBvbk5vZGVBZGRlZCA9IG9wdGlvbnMub25Ob2RlQWRkZWQgfHwgbm9vcDtcbiAgICB2YXIgb25CZWZvcmVFbFVwZGF0ZWQgPSBvcHRpb25zLm9uQmVmb3JlRWxVcGRhdGVkIHx8IG9wdGlvbnMub25CZWZvcmVNb3JwaEVsIHx8IG5vb3A7XG4gICAgdmFyIG9uRWxVcGRhdGVkID0gb3B0aW9ucy5vbkVsVXBkYXRlZCB8fCBub29wO1xuICAgIHZhciBvbkJlZm9yZU5vZGVEaXNjYXJkZWQgPSBvcHRpb25zLm9uQmVmb3JlTm9kZURpc2NhcmRlZCB8fCBub29wO1xuICAgIHZhciBvbk5vZGVEaXNjYXJkZWQgPSBvcHRpb25zLm9uTm9kZURpc2NhcmRlZCB8fCBub29wO1xuICAgIHZhciBvbkJlZm9yZUVsQ2hpbGRyZW5VcGRhdGVkID0gb3B0aW9ucy5vbkJlZm9yZUVsQ2hpbGRyZW5VcGRhdGVkIHx8IG9wdGlvbnMub25CZWZvcmVNb3JwaEVsQ2hpbGRyZW4gfHwgbm9vcDtcbiAgICB2YXIgY2hpbGRyZW5Pbmx5ID0gb3B0aW9ucy5jaGlsZHJlbk9ubHkgPT09IHRydWU7XG4gICAgdmFyIG1vdmVkRWxzID0gW107XG5cbiAgICBmdW5jdGlvbiByZW1vdmVOb2RlSGVscGVyKG5vZGUsIG5lc3RlZEluU2F2ZWRFbCkge1xuICAgICAgICB2YXIgaWQgPSBnZXROb2RlS2V5KG5vZGUpO1xuICAgICAgICAvLyBJZiB0aGUgbm9kZSBoYXMgYW4gSUQgdGhlbiBzYXZlIGl0IG9mZiBzaW5jZSB3ZSB3aWxsIHdhbnRcbiAgICAgICAgLy8gdG8gcmV1c2UgaXQgaW4gY2FzZSB0aGUgdGFyZ2V0IERPTSB0cmVlIGhhcyBhIERPTSBlbGVtZW50XG4gICAgICAgIC8vIHdpdGggdGhlIHNhbWUgSURcbiAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICBzYXZlZEVsc1tpZF0gPSBub2RlO1xuICAgICAgICB9IGVsc2UgaWYgKCFuZXN0ZWRJblNhdmVkRWwpIHtcbiAgICAgICAgICAgIC8vIElmIHdlIGFyZSBub3QgbmVzdGVkIGluIGEgc2F2ZWQgZWxlbWVudCB0aGVuIHdlIGtub3cgdGhhdCB0aGlzIG5vZGUgaGFzIGJlZW5cbiAgICAgICAgICAgIC8vIGNvbXBsZXRlbHkgZGlzY2FyZGVkIGFuZCB3aWxsIG5vdCBleGlzdCBpbiB0aGUgZmluYWwgRE9NLlxuICAgICAgICAgICAgb25Ob2RlRGlzY2FyZGVkKG5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgIHZhciBjdXJDaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIHdoaWxlKGN1ckNoaWxkKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlTm9kZUhlbHBlcihjdXJDaGlsZCwgbmVzdGVkSW5TYXZlZEVsIHx8IGlkKTtcbiAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2Fsa0Rpc2NhcmRlZENoaWxkTm9kZXMobm9kZSkge1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgdmFyIGN1ckNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuICAgICAgICAgICAgd2hpbGUoY3VyQ2hpbGQpIHtcblxuXG4gICAgICAgICAgICAgICAgaWYgKCFnZXROb2RlS2V5KGN1ckNoaWxkKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSBvbmx5IHdhbnQgdG8gaGFuZGxlIG5vZGVzIHRoYXQgZG9uJ3QgaGF2ZSBhbiBJRCB0byBhdm9pZCBkb3VibGVcbiAgICAgICAgICAgICAgICAgICAgLy8gd2Fsa2luZyB0aGUgc2FtZSBzYXZlZCBlbGVtZW50LlxuXG4gICAgICAgICAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChjdXJDaGlsZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gV2FsayByZWN1cnNpdmVseVxuICAgICAgICAgICAgICAgICAgICB3YWxrRGlzY2FyZGVkQ2hpbGROb2RlcyhjdXJDaGlsZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY3VyQ2hpbGQgPSBjdXJDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZU5vZGUobm9kZSwgcGFyZW50Tm9kZSwgYWxyZWFkeVZpc2l0ZWQpIHtcbiAgICAgICAgaWYgKG9uQmVmb3JlTm9kZURpc2NhcmRlZChub2RlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgIGlmIChhbHJlYWR5VmlzaXRlZCkge1xuICAgICAgICAgICAgaWYgKCFnZXROb2RlS2V5KG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgb25Ob2RlRGlzY2FyZGVkKG5vZGUpO1xuICAgICAgICAgICAgICAgIHdhbGtEaXNjYXJkZWRDaGlsZE5vZGVzKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVtb3ZlTm9kZUhlbHBlcihub2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vcnBoRWwoZnJvbUVsLCB0b0VsLCBhbHJlYWR5VmlzaXRlZCwgY2hpbGRyZW5Pbmx5KSB7XG4gICAgICAgIHZhciB0b0VsS2V5ID0gZ2V0Tm9kZUtleSh0b0VsKTtcbiAgICAgICAgaWYgKHRvRWxLZXkpIHtcbiAgICAgICAgICAgIC8vIElmIGFuIGVsZW1lbnQgd2l0aCBhbiBJRCBpcyBiZWluZyBtb3JwaGVkIHRoZW4gaXQgaXMgd2lsbCBiZSBpbiB0aGUgZmluYWxcbiAgICAgICAgICAgIC8vIERPTSBzbyBjbGVhciBpdCBvdXQgb2YgdGhlIHNhdmVkIGVsZW1lbnRzIGNvbGxlY3Rpb25cbiAgICAgICAgICAgIGRlbGV0ZSBzYXZlZEVsc1t0b0VsS2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY2hpbGRyZW5Pbmx5KSB7XG4gICAgICAgICAgICBpZiAob25CZWZvcmVFbFVwZGF0ZWQoZnJvbUVsLCB0b0VsKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1vcnBoQXR0cnMoZnJvbUVsLCB0b0VsKTtcbiAgICAgICAgICAgIG9uRWxVcGRhdGVkKGZyb21FbCk7XG5cbiAgICAgICAgICAgIGlmIChvbkJlZm9yZUVsQ2hpbGRyZW5VcGRhdGVkKGZyb21FbCwgdG9FbCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZyb21FbC50YWdOYW1lICE9ICdURVhUQVJFQScpIHtcbiAgICAgICAgICAgIHZhciBjdXJUb05vZGVDaGlsZCA9IHRvRWwuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIHZhciBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbUVsLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB2YXIgY3VyVG9Ob2RlSWQ7XG5cbiAgICAgICAgICAgIHZhciBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB2YXIgdG9OZXh0U2libGluZztcbiAgICAgICAgICAgIHZhciBzYXZlZEVsO1xuICAgICAgICAgICAgdmFyIHVubWF0Y2hlZEVsO1xuXG4gICAgICAgICAgICBvdXRlcjogd2hpbGUoY3VyVG9Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICB0b05leHRTaWJsaW5nID0gY3VyVG9Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlSWQgPSBnZXROb2RlS2V5KGN1clRvTm9kZUNoaWxkKTtcblxuICAgICAgICAgICAgICAgIHdoaWxlKGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1ckZyb21Ob2RlSWQgPSBnZXROb2RlS2V5KGN1ckZyb21Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkLm5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghYWxyZWFkeVZpc2l0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZUlkICYmICh1bm1hdGNoZWRFbCA9IHVubWF0Y2hlZEVsc1tjdXJGcm9tTm9kZUlkXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bm1hdGNoZWRFbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChjdXJGcm9tTm9kZUNoaWxkLCB1bm1hdGNoZWRFbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9ycGhFbChjdXJGcm9tTm9kZUNoaWxkLCB1bm1hdGNoZWRFbCwgYWxyZWFkeVZpc2l0ZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgY3VyRnJvbU5vZGVUeXBlID0gY3VyRnJvbU5vZGVDaGlsZC5ub2RlVHlwZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBjdXJUb05vZGVDaGlsZC5ub2RlVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzQ29tcGF0aWJsZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSAxKSB7IC8vIEJvdGggbm9kZXMgYmVpbmcgY29tcGFyZWQgYXJlIEVsZW1lbnQgbm9kZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVDaGlsZC50YWdOYW1lID09PSBjdXJUb05vZGVDaGlsZC50YWdOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgY29tcGF0aWJsZSBET00gZWxlbWVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlSWQgfHwgY3VyVG9Ob2RlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGVpdGhlciBET00gZWxlbWVudCBoYXMgYW4gSUQgdGhlbiB3ZSBoYW5kbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRob3NlIGRpZmZlcmVudGx5IHNpbmNlIHdlIHdhbnQgdG8gbWF0Y2ggdXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJ5IElEXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyVG9Ob2RlSWQgPT09IGN1ckZyb21Ob2RlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0NvbXBhdGlibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgZm91bmQgY29tcGF0aWJsZSBET00gZWxlbWVudHMgc28gdHJhbnNmb3JtIHRoZSBjdXJyZW50IFwiZnJvbVwiIG5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG8gbWF0Y2ggdGhlIGN1cnJlbnQgdGFyZ2V0IERPTSBub2RlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3JwaEVsKGN1ckZyb21Ob2RlQ2hpbGQsIGN1clRvTm9kZUNoaWxkLCBhbHJlYWR5VmlzaXRlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJGcm9tTm9kZVR5cGUgPT09IDMpIHsgLy8gQm90aCBub2RlcyBiZWluZyBjb21wYXJlZCBhcmUgVGV4dCBub2Rlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2ltcGx5IHVwZGF0ZSBub2RlVmFsdWUgb24gdGhlIG9yaWdpbmFsIG5vZGUgdG8gY2hhbmdlIHRoZSB0ZXh0IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZC5ub2RlVmFsdWUgPSBjdXJUb05vZGVDaGlsZC5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0NvbXBhdGlibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIE5vIGNvbXBhdGlibGUgbWF0Y2ggc28gcmVtb3ZlIHRoZSBvbGQgbm9kZSBmcm9tIHRoZSBET00gYW5kIGNvbnRpbnVlIHRyeWluZ1xuICAgICAgICAgICAgICAgICAgICAvLyB0byBmaW5kIGEgbWF0Y2ggaW4gdGhlIG9yaWdpbmFsIERPTVxuICAgICAgICAgICAgICAgICAgICByZW1vdmVOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21FbCwgYWxyZWFkeVZpc2l0ZWQpO1xuICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjdXJUb05vZGVJZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKHNhdmVkRWwgPSBzYXZlZEVsc1tjdXJUb05vZGVJZF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb3JwaEVsKHNhdmVkRWwsIGN1clRvTm9kZUNoaWxkLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gc2F2ZWRFbDsgLy8gV2Ugd2FudCB0byBhcHBlbmQgdGhlIHNhdmVkIGVsZW1lbnQgaW5zdGVhZFxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGN1cnJlbnQgRE9NIGVsZW1lbnQgaW4gdGhlIHRhcmdldCB0cmVlIGhhcyBhbiBJRFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYnV0IHdlIGRpZCBub3QgZmluZCBhIG1hdGNoIGluIGFueSBvZiB0aGUgY29ycmVzcG9uZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2libGluZ3MuIFdlIGp1c3QgcHV0IHRoZSB0YXJnZXQgZWxlbWVudCBpbiB0aGUgb2xkIERPTSB0cmVlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBidXQgaWYgd2UgbGF0ZXIgZmluZCBhbiBlbGVtZW50IGluIHRoZSBvbGQgRE9NIHRyZWUgdGhhdCBoYXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGEgbWF0Y2hpbmcgSUQgdGhlbiB3ZSB3aWxsIHJlcGxhY2UgdGhlIHRhcmdldCBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIG9sZCBlbGVtZW50IGFuZCBtb3JwaCB0aGUgb2xkIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHVubWF0Y2hlZEVsc1tjdXJUb05vZGVJZF0gPSBjdXJUb05vZGVDaGlsZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIElmIHdlIGdvdCB0aGlzIGZhciB0aGVuIHdlIGRpZCBub3QgZmluZCBhIGNhbmRpZGF0ZSBtYXRjaCBmb3Igb3VyIFwidG8gbm9kZVwiXG4gICAgICAgICAgICAgICAgLy8gYW5kIHdlIGV4aGF1c3RlZCBhbGwgb2YgdGhlIGNoaWxkcmVuIFwiZnJvbVwiIG5vZGVzLiBUaGVyZWZvcmUsIHdlIHdpbGwganVzdFxuICAgICAgICAgICAgICAgIC8vIGFwcGVuZCB0aGUgY3VycmVudCBcInRvIG5vZGVcIiB0byB0aGUgZW5kXG4gICAgICAgICAgICAgICAgaWYgKG9uQmVmb3JlTm9kZUFkZGVkKGN1clRvTm9kZUNoaWxkKSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbUVsLmFwcGVuZENoaWxkKGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgb25Ob2RlQWRkZWQoY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjdXJUb05vZGVDaGlsZC5ub2RlVHlwZSA9PT0gMSAmJiAoY3VyVG9Ob2RlSWQgfHwgY3VyVG9Ob2RlQ2hpbGQuZmlyc3RDaGlsZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGVsZW1lbnQgdGhhdCB3YXMganVzdCBhZGRlZCB0byB0aGUgb3JpZ2luYWwgRE9NIG1heSBoYXZlXG4gICAgICAgICAgICAgICAgICAgIC8vIHNvbWUgbmVzdGVkIGVsZW1lbnRzIHdpdGggYSBrZXkvSUQgdGhhdCBuZWVkcyB0byBiZSBtYXRjaGVkIHVwXG4gICAgICAgICAgICAgICAgICAgIC8vIHdpdGggb3RoZXIgZWxlbWVudHMuIFdlJ2xsIGFkZCB0aGUgZWxlbWVudCB0byBhIGxpc3Qgc28gdGhhdCB3ZVxuICAgICAgICAgICAgICAgICAgICAvLyBjYW4gbGF0ZXIgcHJvY2VzcyB0aGUgbmVzdGVkIGVsZW1lbnRzIGlmIHRoZXJlIGFyZSBhbnkgdW5tYXRjaGVkXG4gICAgICAgICAgICAgICAgICAgIC8vIGtleWVkIGVsZW1lbnRzIHRoYXQgd2VyZSBkaXNjYXJkZWRcbiAgICAgICAgICAgICAgICAgICAgbW92ZWRFbHMucHVzaChjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFdlIGhhdmUgcHJvY2Vzc2VkIGFsbCBvZiB0aGUgXCJ0byBub2Rlc1wiLiBJZiBjdXJGcm9tTm9kZUNoaWxkIGlzIG5vbi1udWxsIHRoZW5cbiAgICAgICAgICAgIC8vIHdlIHN0aWxsIGhhdmUgc29tZSBmcm9tIG5vZGVzIGxlZnQgb3ZlciB0aGF0IG5lZWQgdG8gYmUgcmVtb3ZlZFxuICAgICAgICAgICAgd2hpbGUoY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICAgICAgICAgIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgcmVtb3ZlTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tRWwsIGFscmVhZHlWaXNpdGVkKTtcbiAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNwZWNpYWxFbEhhbmRsZXIgPSBzcGVjaWFsRWxIYW5kbGVyc1tmcm9tRWwudGFnTmFtZV07XG4gICAgICAgIGlmIChzcGVjaWFsRWxIYW5kbGVyKSB7XG4gICAgICAgICAgICBzcGVjaWFsRWxIYW5kbGVyKGZyb21FbCwgdG9FbCk7XG4gICAgICAgIH1cbiAgICB9IC8vIEVORDogbW9ycGhFbCguLi4pXG5cbiAgICB2YXIgbW9ycGhlZE5vZGUgPSBmcm9tTm9kZTtcbiAgICB2YXIgbW9ycGhlZE5vZGVUeXBlID0gbW9ycGhlZE5vZGUubm9kZVR5cGU7XG4gICAgdmFyIHRvTm9kZVR5cGUgPSB0b05vZGUubm9kZVR5cGU7XG5cbiAgICBpZiAoIWNoaWxkcmVuT25seSkge1xuICAgICAgICAvLyBIYW5kbGUgdGhlIGNhc2Ugd2hlcmUgd2UgYXJlIGdpdmVuIHR3byBET00gbm9kZXMgdGhhdCBhcmUgbm90XG4gICAgICAgIC8vIGNvbXBhdGlibGUgKGUuZy4gPGRpdj4gLS0+IDxzcGFuPiBvciA8ZGl2PiAtLT4gVEVYVClcbiAgICAgICAgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgaWYgKHRvTm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZnJvbU5vZGUudGFnTmFtZSAhPT0gdG9Ob2RlLnRhZ05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgb25Ob2RlRGlzY2FyZGVkKGZyb21Ob2RlKTtcbiAgICAgICAgICAgICAgICAgICAgbW9ycGhlZE5vZGUgPSBtb3ZlQ2hpbGRyZW4oZnJvbU5vZGUsIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodG9Ob2RlLnRhZ05hbWUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEdvaW5nIGZyb20gYW4gZWxlbWVudCBub2RlIHRvIGEgdGV4dCBub2RlXG4gICAgICAgICAgICAgICAgbW9ycGhlZE5vZGUgPSB0b05vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobW9ycGhlZE5vZGVUeXBlID09PSAzKSB7IC8vIFRleHQgbm9kZVxuICAgICAgICAgICAgaWYgKHRvTm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBtb3JwaGVkTm9kZS5ub2RlVmFsdWUgPSB0b05vZGUubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBtb3JwaGVkTm9kZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGV4dCBub2RlIHRvIHNvbWV0aGluZyBlbHNlXG4gICAgICAgICAgICAgICAgbW9ycGhlZE5vZGUgPSB0b05vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobW9ycGhlZE5vZGUgPT09IHRvTm9kZSkge1xuICAgICAgICAvLyBUaGUgXCJ0byBub2RlXCIgd2FzIG5vdCBjb21wYXRpYmxlIHdpdGggdGhlIFwiZnJvbSBub2RlXCJcbiAgICAgICAgLy8gc28gd2UgaGFkIHRvIHRvc3Mgb3V0IHRoZSBcImZyb20gbm9kZVwiIGFuZCB1c2UgdGhlIFwidG8gbm9kZVwiXG4gICAgICAgIG9uTm9kZURpc2NhcmRlZChmcm9tTm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbW9ycGhFbChtb3JwaGVkTm9kZSwgdG9Ob2RlLCBmYWxzZSwgY2hpbGRyZW5Pbmx5KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogV2hhdCB3ZSB3aWxsIGRvIGhlcmUgaXMgd2FsayB0aGUgdHJlZSBmb3IgdGhlIERPTSBlbGVtZW50XG4gICAgICAgICAqIHRoYXQgd2FzIG1vdmVkIGZyb20gdGhlIHRhcmdldCBET00gdHJlZSB0byB0aGUgb3JpZ2luYWxcbiAgICAgICAgICogRE9NIHRyZWUgYW5kIHdlIHdpbGwgbG9vayBmb3Iga2V5ZWQgZWxlbWVudHMgdGhhdCBjb3VsZFxuICAgICAgICAgKiBiZSBtYXRjaGVkIHRvIGtleWVkIGVsZW1lbnRzIHRoYXQgd2VyZSBlYXJsaWVyIGRpc2NhcmRlZC5cbiAgICAgICAgICogSWYgd2UgZmluZCBhIG1hdGNoIHRoZW4gd2Ugd2lsbCBtb3ZlIHRoZSBzYXZlZCBlbGVtZW50XG4gICAgICAgICAqIGludG8gdGhlIGZpbmFsIERPTSB0cmVlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgaGFuZGxlTW92ZWRFbCA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICB2YXIgY3VyQ2hpbGQgPSBlbC5maXJzdENoaWxkO1xuICAgICAgICAgICAgd2hpbGUoY3VyQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFNpYmxpbmcgPSBjdXJDaGlsZC5uZXh0U2libGluZztcblxuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzYXZlZEVsID0gc2F2ZWRFbHNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNhdmVkRWwgJiYgKGN1ckNoaWxkLnRhZ05hbWUgPT09IHNhdmVkRWwudGFnTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1ckNoaWxkLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHNhdmVkRWwsIGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vcnBoRWwoc2F2ZWRFbCwgY3VyQ2hpbGQsIHRydWUgLyogYWxyZWFkeSB2aXNpdGVkIHRoZSBzYXZlZCBlbCB0cmVlICovKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1ckNoaWxkID0gbmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1wdHkoc2F2ZWRFbHMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoY3VyQ2hpbGQubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlTW92ZWRFbChjdXJDaGlsZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY3VyQ2hpbGQgPSBuZXh0U2libGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBUaGUgbG9vcCBiZWxvdyBpcyB1c2VkIHRvIHBvc3NpYmx5IG1hdGNoIHVwIGFueSBkaXNjYXJkZWRcbiAgICAgICAgLy8gZWxlbWVudHMgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlIHdpdGggZWxlbWVuZXRzIGZyb20gdGhlXG4gICAgICAgIC8vIHRhcmdldCB0cmVlIHRoYXQgd2VyZSBtb3ZlZCBvdmVyIHdpdGhvdXQgdmlzaXRpbmcgdGhlaXJcbiAgICAgICAgLy8gY2hpbGRyZW5cbiAgICAgICAgaWYgKCFlbXB0eShzYXZlZEVscykpIHtcbiAgICAgICAgICAgIGhhbmRsZU1vdmVkRWxzTG9vcDpcbiAgICAgICAgICAgIHdoaWxlIChtb3ZlZEVscy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgbW92ZWRFbHNUZW1wID0gbW92ZWRFbHM7XG4gICAgICAgICAgICAgICAgbW92ZWRFbHMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8bW92ZWRFbHNUZW1wLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChoYW5kbGVNb3ZlZEVsKG1vdmVkRWxzVGVtcFtpXSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGVyZSBhcmUgbm8gbW9yZSB1bm1hdGNoZWQgZWxlbWVudHMgc28gY29tcGxldGVseSBlbmRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBsb29wXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhayBoYW5kbGVNb3ZlZEVsc0xvb3A7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGaXJlIHRoZSBcIm9uTm9kZURpc2NhcmRlZFwiIGV2ZW50IGZvciBhbnkgc2F2ZWQgZWxlbWVudHNcbiAgICAgICAgLy8gdGhhdCBuZXZlciBmb3VuZCBhIG5ldyBob21lIGluIHRoZSBtb3JwaGVkIERPTVxuICAgICAgICBmb3IgKHZhciBzYXZlZEVsSWQgaW4gc2F2ZWRFbHMpIHtcbiAgICAgICAgICAgIGlmIChzYXZlZEVscy5oYXNPd25Qcm9wZXJ0eShzYXZlZEVsSWQpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNhdmVkRWwgPSBzYXZlZEVsc1tzYXZlZEVsSWRdO1xuICAgICAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChzYXZlZEVsKTtcbiAgICAgICAgICAgICAgICB3YWxrRGlzY2FyZGVkQ2hpbGROb2RlcyhzYXZlZEVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghY2hpbGRyZW5Pbmx5ICYmIG1vcnBoZWROb2RlICE9PSBmcm9tTm9kZSAmJiBmcm9tTm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgIC8vIElmIHdlIGhhZCB0byBzd2FwIG91dCB0aGUgZnJvbSBub2RlIHdpdGggYSBuZXcgbm9kZSBiZWNhdXNlIHRoZSBvbGRcbiAgICAgICAgLy8gbm9kZSB3YXMgbm90IGNvbXBhdGlibGUgd2l0aCB0aGUgdGFyZ2V0IG5vZGUgdGhlbiB3ZSBuZWVkIHRvXG4gICAgICAgIC8vIHJlcGxhY2UgdGhlIG9sZCBET00gbm9kZSBpbiB0aGUgb3JpZ2luYWwgRE9NIHRyZWUuIFRoaXMgaXMgb25seVxuICAgICAgICAvLyBwb3NzaWJsZSBpZiB0aGUgb3JpZ2luYWwgRE9NIG5vZGUgd2FzIHBhcnQgb2YgYSBET00gdHJlZSB3aGljaFxuICAgICAgICAvLyB3ZSBrbm93IGlzIHRoZSBjYXNlIGlmIGl0IGhhcyBhIHBhcmVudCBub2RlLlxuICAgICAgICBmcm9tTm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChtb3JwaGVkTm9kZSwgZnJvbU5vZGUpO1xuICAgIH1cblxuICAgIHJldHVybiBtb3JwaGVkTm9kZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtb3JwaGRvbTtcbiIsIm1vZHVsZS5leHBvcnRzID0gW1xuICAvLyBhdHRyaWJ1dGUgZXZlbnRzIChjYW4gYmUgc2V0IHdpdGggYXR0cmlidXRlcylcbiAgJ29uY2xpY2snLFxuICAnb25kYmxjbGljaycsXG4gICdvbm1vdXNlZG93bicsXG4gICdvbm1vdXNldXAnLFxuICAnb25tb3VzZW92ZXInLFxuICAnb25tb3VzZW1vdmUnLFxuICAnb25tb3VzZW91dCcsXG4gICdvbmRyYWdzdGFydCcsXG4gICdvbmRyYWcnLFxuICAnb25kcmFnZW50ZXInLFxuICAnb25kcmFnbGVhdmUnLFxuICAnb25kcmFnb3ZlcicsXG4gICdvbmRyb3AnLFxuICAnb25kcmFnZW5kJyxcbiAgJ29ua2V5ZG93bicsXG4gICdvbmtleXByZXNzJyxcbiAgJ29ua2V5dXAnLFxuICAnb251bmxvYWQnLFxuICAnb25hYm9ydCcsXG4gICdvbmVycm9yJyxcbiAgJ29ucmVzaXplJyxcbiAgJ29uc2Nyb2xsJyxcbiAgJ29uc2VsZWN0JyxcbiAgJ29uY2hhbmdlJyxcbiAgJ29uc3VibWl0JyxcbiAgJ29ucmVzZXQnLFxuICAnb25mb2N1cycsXG4gICdvbmJsdXInLFxuICAnb25pbnB1dCcsXG4gIC8vIG90aGVyIGNvbW1vbiBldmVudHNcbiAgJ29uY29udGV4dG1lbnUnLFxuICAnb25mb2N1c2luJyxcbiAgJ29uZm9jdXNvdXQnXG5dXG4iLCJ2YXIgcGFnZSA9IHJlcXVpcmUoJ3BhZ2UnKTtcbnZhciBlbXB0eSA9IHJlcXVpcmUoJ2VtcHR5LWVsZW1lbnQnKTtcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vdGVtcGxhdGUnKTtcbnZhciB0aXRsZSA9IHJlcXVpcmUoJ3RpdGxlJyk7XG5cblxucGFnZSgnLycsIGZ1bmN0aW9uIChjdHgsIG5leHQpIHtcblx0dGl0bGUoJ015R3JhbScpO1xuXHR2YXIgbWFpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWNvbnRhaW5lcicpO1xuXG5cdHZhciBwaWN0dXJlcyA9IFtcblx0XHR7XG5cdFx0XHR1c2VyOiB7XG5cdFx0XHRcdHVzZXJuYW1lOiAnRGFuaWVsIEgnLFxuXHRcdFx0XHRhdmF0YXI6ICdodHRwczovL3Njb250ZW50LW1pYTEtMS54eC5mYmNkbi5uZXQvdi90MS4wLTkvMTI5NjM4ODlfMTAyMDg5MDE5MDQ2MDMzMzBfNjg3MDM1NDk2MTg0MTIxNDg4N19uLmpwZz9vaD1mODE5YTAyMmU1MmJlMTljYWJhYWJkODlkNmNiMzljZSZvZT01N0U2QjdGNSdcblx0XHRcdH0sXG5cdFx0XHR1cmw6ICdodHRwOi8vbWF0ZXJpYWxpemVjc3MuY29tL2ltYWdlcy9vZmZpY2UuanBnJyxcblx0XHRcdGxpa2VzOiA0LFxuXHRcdFx0bGlrZWQ6IHRydWUsXG5cdFx0XHRjcmVhdGVkQXQ6IG5ldyBEYXRlKClcblx0XHR9LFxuXHRcdHtcblx0XHRcdHVzZXI6IHtcblx0XHRcdFx0dXNlcm5hbWU6ICdEYXZpZCBQdGUnLFxuXHRcdFx0XHRhdmF0YXI6ICdodHRwczovL3Njb250ZW50LW1pYTEtMS54eC5mYmNkbi5uZXQvdi90MS4wLTkvMTMyNDA0NzZfMTAyMDc0Njg4Mjg5MzI5ODBfNzY2MjA4NzU0NTg2MDc2OTc4X24uanBnP29oPWFlOTk3ZjBmMTA0MDNmNjU0OTk2NzRmNWEyODY5NzU3Jm9lPTU3OURFODA2J1xuXHRcdFx0fSxcblx0XHRcdHVybDogJ2h0dHA6Ly9tYXRlcmlhbGl6ZWNzcy5jb20vaW1hZ2VzL29mZmljZS5qcGcnLFxuXHRcdFx0bGlrZXM6IDEwLFxuXHRcdFx0bGlrZWQ6IGZhbHNlLFxuXHRcdFx0Y3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnNldERhdGUobmV3IERhdGUoKS5nZXREYXRlKCkgLSAxMClcblx0XHR9XG5cdF07XG5cblx0ZW1wdHkobWFpbikuYXBwZW5kQ2hpbGQodGVtcGxhdGUocGljdHVyZXMpKTtcbn0pIiwidmFyIHlvID0gcmVxdWlyZSgneW8teW8nKTtcbnZhciBsYXlvdXQgPSByZXF1aXJlKCcuLi9sYXlvdXQnKTtcbnZhciBwaWN0dXJlID0gcmVxdWlyZSgnLi4vcGljdHVyZS1jYXJkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHBpY3R1cmVzKSB7XG5cblx0dmFyIGVsID0geW9gPGRpdiBjbGFzcz1cImNvbmF0aW5lciB0aW1lbGluZVwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3dcIj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb2wgczEyIG0xMCBvZmZzZXQtbTEgbDYgb2Zmc2V0LWwzXCI+XG5cdFx0XHRcdFx0XHRcdCR7cGljdHVyZXMubWFwKGZ1bmN0aW9uIChwaWMpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcGljdHVyZShwaWMpO1xuXHRcdFx0XHRcdFx0XHR9KX1cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5gO1xuXHRyZXR1cm4gbGF5b3V0KGVsKTtcbn0iLCJ2YXIgcGFnZSA9IHJlcXVpcmUoJ3BhZ2UnKTtcclxuXHJcbnJlcXVpcmUoJy4vaG9tZXBhZ2UnKTtcclxucmVxdWlyZSgnLi9zaWdudXAnKTtcclxucmVxdWlyZSgnLi9zaWduaW4nKTtcclxuXHJcbnBhZ2UoKTsiLCJ2YXIgeW8gPSByZXF1aXJlKCd5by15bycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBsYW5kaW5nKGJveCkge1xyXG5cdHJldHVybiAgeW9gPGRpdiBjbGFzcz1cImNvbnRhaW5lciBsYW5kaW5nXCI+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicm93XCI+XHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb2wgczEwIHB1c2gtczFcIj5cclxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicm93XCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29sIG01IGhpZGUtb24tc21hbGwtb25seVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8aW1nIGNsYXNzPVwiaXBob25lXCIgc3JjPVwiLi9pcGhvbmUucG5nXCIgYWx0PVwiaXBob25lXCIvPlxyXG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHQke2JveH1cclxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5gO1xyXG59IiwidmFyIHlvID0gcmVxdWlyZSgneW8teW8nKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbGF5b3V0KGNvbnRlbnQpIHtcclxuXHRyZXR1cm4geW9gPGRpdj5cclxuXHRcdFx0XHRcdDxuYXYgY2xhc3M9XCJoZWFkZXJcIj5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm5hdi13cmFwcGVyXCI+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJvd1wiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29sIHMxMiBtNiBvZmZzZXQtbTFcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8YSBocmVmPVwiXCIgY2xhc3M9XCJicmFuZC1sb2dvIG15Z3JhbVwiPk15R3JhbTwvYT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb2wgczIgbTYgcHVzaC1zMTAgcHVzaC1tMTBcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8YSBocmVmPVwiI1wiIGNsYXNzPVwiYnRuIGJ0bi1sYXJnZSBidG4tZmxhdCBkcm9wZG93bi1idXR0b25cIiBkYXRhLWFjdGl2YXRlcz1cImRyb3AtdXNlclwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGkgY2xhc3M9XCJmYSBmYS11c2VyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvYT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8dWwgaWQ9XCJkcm9wLXVzZXJcIiBjbGFzcz1cImRyb3Bkb3duLWNvbnRlbnRcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxsaT48YSBocmVmPVwiXCI+U2FsaXI8L2E+PC9saT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8L3VsPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDwvbmF2PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cclxuXHRcdFx0XHRcdFx0JHtjb250ZW50fVxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PC9kaXY+YDtcclxufSIsInZhciB5byA9IHJlcXVpcmUoJ3lvLXlvJyk7XHJcblxyXG5pZiAoIXdpbmRvdy5JbnRsKSB7XHJcbiAgICB3aW5kb3cuSW50bCA9IHJlcXVpcmUoJ2ludGwnKTsgLy8gcG9seWZpbGwgZm9yIGBJbnRsYFxyXG4gICAgcmVxdWlyZSgnaW50bC9sb2NhbGUtZGF0YS9qc29ucC9lbi1VUy5qcycpO1xyXG4gICAgcmVxdWlyZSgnaW50bC9sb2NhbGUtZGF0YS9qc29ucC9lcy5qcycpO1xyXG59XHJcblxyXG52YXIgSW50bFJlbGF0aXZlRm9ybWF0ID0gd2luZG93LkludGxSZWxhdGl2ZUZvcm1hdCA9IHJlcXVpcmUoJ2ludGwtcmVsYXRpdmVmb3JtYXQnKTtcclxuXHJcbnJlcXVpcmUoJ2ludGwtcmVsYXRpdmVmb3JtYXQvZGlzdC9sb2NhbGUtZGF0YS9lbi5qcycpO1xyXG5yZXF1aXJlKCdpbnRsLXJlbGF0aXZlZm9ybWF0L2Rpc3QvbG9jYWxlLWRhdGEvZXMuanMnKTtcclxuXHJcbnZhciByZiA9IG5ldyBJbnRsUmVsYXRpdmVGb3JtYXQoJ2VuLVVTJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBpY3R1cmVDYXJkKHBpYykge1xyXG5cdHZhciBlbDtcclxuXHQvKmVzdGFtb3MgcGlzYW5kbyBwaWMqL1xyXG5cdGZ1bmN0aW9uIHJlbmRlciAocGljdHVyZSkge1xyXG5cdFx0cmV0dXJuIHlvIGA8ZGl2IGNsYXNzPVwiY2FyZCAke3BpY3R1cmUubGlrZWQgPyAnbGlrZWQnIDogJyd9XCI+XHJcblx0XHRcdFx0XHQgICAgPGRpdiBjbGFzcz1cImNhcmQtaW1hZ2VcIj5cclxuXHRcdFx0XHRcdCAgICBcdDxpbWcgY2xhc3M9XCJhY3RpdmF0b3JcIiBzcmM9XCIke3BpY3R1cmUudXJsfVwiPlxyXG5cdFx0XHRcdFx0ICAgIDwvZGl2PlxyXG5cdFx0XHRcdFx0ICAgIDxkaXYgY2xhc3M9XCJjYXJkLWNvbnRlbnRcIj5cclxuXHRcdFx0XHRcdCAgICBcdDxhIGhyZWY9XCIvdXNlci8ke3BpY3R1cmUudXNlci51c2VybmFtZX1cIiBjbGFzcz1cImNhcmQtdGl0bGVcIj5cclxuXHRcdFx0XHRcdCAgICBcdFx0PGltZyBzcmM9XCIke3BpY3R1cmUudXNlci5hdmF0YXJ9XCIgY2xhc3M9XCJhdmF0YXJcIiBhbHQ9XCJcIiAvPlxyXG5cdFx0XHRcdFx0ICAgIFx0XHQ8c3BhbiBjbGFzcz1cInVzZXJuYW1lXCI+JHtwaWN0dXJlLnVzZXIudXNlcm5hbWV9PC9zcGFuPlxyXG5cdFx0XHRcdFx0ICAgIFx0PC9hPlxyXG5cdFx0XHRcdFx0ICAgIFx0PHNtYWxsIGNsYXNzPVwicmlnaHQgdGltZVwiPiR7cmYuZm9ybWF0KHBpY3R1cmUuY3JlYXRlZEF0KX08L3NtYWxsPlxyXG5cdFx0XHRcdFx0ICAgIFx0PHA+XHJcblx0XHRcdFx0XHQgICAgXHRcdDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJsZWZ0XCIgb25jbGljaz0ke2xpa2UuYmluZChudWxsLCB0cnVlKX0+XHJcblx0XHRcdFx0XHQgICAgXHRcdFx0PGkgY2xhc3M9XCJmYSBmYS1oZWFydC1vXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG5cdFx0XHRcdFx0ICAgIFx0XHQ8L2E+XHJcblx0XHRcdFx0XHQgICAgXHRcdDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJsZWZ0XCIgb25jbGljaz0ke2xpa2UuYmluZChudWxsLCBmYWxzZSl9PlxyXG5cdFx0XHRcdFx0ICAgIFx0XHRcdDxpIGNsYXNzPVwiZmEgZmEtaGVhcnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcblx0XHRcdFx0XHQgICAgXHRcdDwvYT5cclxuXHRcdFx0XHQgICAgXHRcdFx0PHNwYW4gY2xhc3M9XCJsZWZ0IGxpa2VzXCI+JHtwaWN0dXJlLmxpa2VzfSBtZSBndXN0YTwvc3Bhbj5cclxuXHRcdFx0XHRcdCAgICBcdDwvcD5cclxuXHRcdFx0XHRcdCAgICA8L2Rpdj5cclxuXHRcdFx0XHQgICAgPC9kaXY+YFxyXG5cdH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWtlIChsaWtlZCkge1xyXG4gICAgXHRwaWMubGlrZWQgPSBsaWtlZDtcclxuICAgIFx0cGljLmxpa2VzICs9IGxpa2VkID8gMSA6IC0xO1xyXG4gICAgXHR2YXIgbmV3RWwgPSByZW5kZXIocGljKTtcclxuICAgIFx0eW8udXBkYXRlKGVsLCBuZXdFbCk7XHJcbiAgICBcdHJldHVybiBmYWxzZTsgLypxdWl0YSBjb21wb3J0YW1pZW50byBkZWZhdWx0IGRlIHRhZyBhKi9cclxuICAgIH0gICAgXHJcblxyXG4gICAgZWwgPSByZW5kZXIocGljKTtcclxuICAgIHJldHVybiBlbDtcclxufSAiLCJ2YXIgcGFnZSA9IHJlcXVpcmUoJ3BhZ2UnKTtcbnZhciBlbXB0eSA9IHJlcXVpcmUoJ2VtcHR5LWVsZW1lbnQnKTtcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vdGVtcGxhdGUnKTtcbnZhciB0aXRsZSA9IHJlcXVpcmUoJ3RpdGxlJyk7XG5cblxucGFnZSgnL3NpZ25pbicsIGZ1bmN0aW9uIChjdHgsIG5leHQpIHtcblx0dGl0bGUoJ015R3JhbSAtIFNpZ25pbicpO1xuXHR2YXIgbWFpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWNvbnRhaW5lcicpO1xuXHRlbXB0eShtYWluKS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZSk7XG59KSIsInZhciB5byA9IHJlcXVpcmUoJ3lvLXlvJyk7XG52YXIgbGFuZGluZyA9IHJlcXVpcmUoJy4uL2xhbmRpbmcnKTtcblxudmFyIHNpZ25pbkZvcm0gPSB5b2A8ZGl2IGNsYXNzPVwiY29sIHMxMiBtN1wiPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJvd1wiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2lnbnVwLWJveFwiPlxuXHRcdFx0XHRcdFx0XHRcdDxoMSBjbGFzcz1cIm15Z3JhbVwiPk15R3JhbTwvaDE+XG5cdFx0XHRcdFx0XHRcdFx0PGZvcm0gY2xhc3M9XCJzaWdudXAtZm9ybVwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNlY3Rpb25cIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PGEgaHJlZj1cIlwiIGNsYXNzPVwiYnRuIGJ0bi1mYiBoaWRlLW9uLXNtYWxsLW9ubHlcIj5JbmljaWFyIHNlc2nDs24gY29uIEZhY2Vib29rPC9hPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8YSBocmVmPVwiXCIgY2xhc3M9XCJidG4gYnRuLWZiIGhpZGUtb24tbWVkLWFuZC11cFwiPjxpIGNsYXNzPVwiZmEgZmEtZmFjZWJvb2stb2ZmaWNpYWxcIj48L2k+IEluaWNpYXIgc2VzacOzbjwvYT5cblx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImRpdmlkZXJcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzZWN0aW9uXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJ1c2VybmFtZWVcIiBwbGFjZWhvbGRlcj1cIk5vbWJyZSBkZSB1c3VhcmlvXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBuYW1lPVwicGFzc3dvcmRcIiBwbGFjZWhvbGRlcj1cIkNvbnRyYXNlw7FhXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIHdhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG4tc2lnbnVwXCI+SW5pY2lhciBTZXNpb248L2J1dHRvbj5cblx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDwvZm9ybT5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicm93XCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJsb2dpbi1ib3hcIj5cblx0XHRcdFx0XHRcdFx0XHTCv05vIFRpZW5lcyB1bmEgY3VlbnRhPyA8YSBocmVmPVwiL3NpZ251cFwiPlJlZ8Otc3RyYXRlPC9hPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PmA7XG5cbm1vZHVsZS5leHBvcnRzID0gbGFuZGluZyhzaWduaW5Gb3JtKTsiLCJ2YXIgcGFnZSA9IHJlcXVpcmUoJ3BhZ2UnKTtcbnZhciBlbXB0eSA9IHJlcXVpcmUoJ2VtcHR5LWVsZW1lbnQnKTtcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vdGVtcGxhdGUnKTtcbnZhciB0aXRsZSA9IHJlcXVpcmUoJ3RpdGxlJyk7XG5cblxucGFnZSgnL3NpZ251cCcsIGZ1bmN0aW9uIChjdHgsIG5leHQpIHtcblx0dGl0bGUoJ015R3JhbSAtIFNpZ251cCcpO1xuXHR2YXIgbWFpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWNvbnRhaW5lcicpO1xuXHRlbXB0eShtYWluKS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZSk7XG59KSIsInZhciB5byA9IHJlcXVpcmUoJ3lvLXlvJyk7XG52YXIgbGFuZGluZyA9IHJlcXVpcmUoJy4uL2xhbmRpbmcnKTtcblxudmFyIHNpZ251cEZvcm0gPSB5b2A8ZGl2IGNsYXNzPVwiY29sIHMxMiBtN1wiPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJvd1wiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2lnbnVwLWJveFwiPlxuXHRcdFx0XHRcdFx0XHRcdDxoMSBjbGFzcz1cIm15Z3JhbVwiPk15R3JhbTwvaDE+XG5cdFx0XHRcdFx0XHRcdFx0PGZvcm0gYWN0aW9uPVwiXCIgY2xhc3M9XCJzaWdudXAtZm9ybVwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGgyPlJlZ2lzdHJhdGUgcGFyYSB2ZXIgZm90b3MgZGUgdHVzIGFtaWdvcyBlc3R1ZGlhbnRlczwvaDI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2VjdGlvblwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8YSBocmVmPVwiXCIgY2xhc3M9XCJidG4gYnRuLWZiIGhpZGUtb24tc21hbGwtb25seVwiPkluaWNpYXIgc2VzacOzbiBjb24gRmFjZWJvb2s8L2E+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxhIGhyZWY9XCJcIiBjbGFzcz1cImJ0biBidG4tZmIgaGlkZS1vbi1tZWQtYW5kLXVwXCI+PGkgY2xhc3M9XCJmYSBmYS1mYWNlYm9vay1vZmZpY2lhbFwiPjwvaT4gSW5pY2lhciBzZXNpw7NuPC9hPlxuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZGl2aWRlclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNlY3Rpb25cIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJlbWFpbFwiIHBsYWNlaG9sZGVyPVwiQ29ycmVvIGVsZWN0cm9uaWNvXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJuYW1lXCIgcGxhY2Vob2xkZXI9XCJOb21icmUgY29tcGxldG9cIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInVzZXJuYW1lZVwiIHBsYWNlaG9sZGVyPVwiTm9tYnJlIGRlIHVzdWFyaW9cIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIG5hbWU9XCJwYXNzd29yZFwiIHBsYWNlaG9sZGVyPVwiQ29udHJhc2XDsWFcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG4gd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0bi1zaWdudXBcIj5SZWfDrXN0cmF0ZTwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PC9mb3JtPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3dcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImxvZ2luLWJveFwiPlxuXHRcdFx0XHRcdFx0XHRcdMK/VGllbmVzIHVuYSBjdWVudGE/IDxhIGhyZWY9XCIvc2lnbmluXCI+RW50cmFyPC9hPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PmA7XG5cbm1vZHVsZS5leHBvcnRzID0gbGFuZGluZyhzaWdudXBGb3JtKTsiXX0=
