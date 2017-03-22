'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var cov_dkzl4i3c6 = function () {
  var path = 'C:\\Users\\GORAN\\Dev\\reading-instructions\\src\\constants.js',
      hash = '212370147f1995ca81c8bf7ca3a1c4b362ea32ac',
      global = new Function('return this')(),
      gcv = '__coverage__',
      coverageData = {
    path: 'C:\\Users\\GORAN\\Dev\\reading-instructions\\src\\constants.js',
    statementMap: {
      '0': {
        start: {
          line: 1,
          column: 25
        },
        end: {
          line: 7,
          column: 1
        }
      },
      '1': {
        start: {
          line: 9,
          column: 21
        },
        end: {
          line: 21,
          column: 1
        }
      },
      '2': {
        start: {
          line: 23,
          column: 21
        },
        end: {
          line: 40,
          column: 1
        }
      }
    },
    fnMap: {},
    branchMap: {},
    s: {
      '0': 0,
      '1': 0,
      '2': 0
    },
    f: {},
    b: {},
    _coverageSchema: '332fd63041d2c1bcb487cc26dd0d5f7d97098a6c'
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

var MODIFIERS = exports.MODIFIERS = (++cov_dkzl4i3c6.s[0], {
  NORMAL: 1,
  END_SENTENCE: 2.2,
  START_PARAGRAPH: 3.0,
  END_PARAGRAPH: 2.8,
  SHORT_SPACE: 1.6
});

var MATCH = exports.MATCH = (++cov_dkzl4i3c6.s[1], {
  DASHES: /^(\/|-|\.|--|—|–)$/gm,
  WRAPS: /[«»"“”()[\]]/g,
  SENTENCE_TAIL: /([\s,]+([\d,-]|[a-z])+[.?!…]+[\n\s"])/g,
  SENTENCE_END: /[.?!…]/g,
  CLAUSE_END: /[,;:]/g,
  TOKENS: /["«»“”()/–—]|\s|--+|\n+|[^\s"“«»”()/–—]+/g,
  WRAPS_AND_SPACES: '«»"“”()[] '
  // TODO: handle urls
  // TODO: handle nested quotes - it happens...
  // TODO: handle footnotes (only numbers in brackets or parens)
  // TODO: handle references (Person et al., 20XX)
});

var WRAPS = exports.WRAPS = (++cov_dkzl4i3c6.s[2], {
  GUILLEMOT: {
    LEFT: '«',
    RIGHT: '»'
  },
  STANDARD_QUOTE: {
    LEFT: '"',
    RIGHT: '"'
  },
  DOUBLE_QUOTE: {
    LEFT: '“',
    RIGHT: '”'
  },
  PARENS: {
    LEFT: '(',
    RIGHT: ')'
  }
});