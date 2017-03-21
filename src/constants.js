module.exports.MODIFIERS = {
  NORMAL: 1,
  END_SENTENCE: 2.2,
  START_PARAGRAPH: 3.0,
  END_PARAGRAPH: 2.8,
  SHORT_SPACE: 1.6
}

module.exports.MATCH = {
  DASHES: /^(\/|-|\.|--|—|–)$/gm,
  WRAPS: /[«»"“”()\[\]]/g,
  SENTENCE_TAIL: /([\s,]+([\d,-]|[a-z])+[.?!…]+[\n\s"])/g,
  SENTENCE_END: /[.?!…]/g,
  CLAUSE_END: /[,;:]/g,
  TOKENS: /["«»“”()/–—]|\s|--+|\n+|[^\s"“«»”()/–—]+/g,
  WRAPS_AND_SPACES: '«»"“”()[] '
  // TODO: handle urls
  // TODO: handle nested quotes - it happens...
  // TODO: handle footnotes (only numbers in brackets or parens)
  // TODO: handle references (Person et al., 20XX)
}

module.exports.WRAPS = {
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
}
