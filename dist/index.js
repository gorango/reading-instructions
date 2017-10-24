;(function (root, factory) {
  const NODE = typeof exports === 'object' && typeof module === 'object'
  const AMD = typeof define === 'function' && define.amd
  const ES6 = typeof exports === 'object'
  if (NODE) module.exports = factory()
  else if (AMD) define(factory.bind(root))
  else if (ES6) exports = factory()
  else root = factory()
})(this, function () {
  const MODIFIERS = {
    NORMAL: 1,
    END_SENTENCE: 2.2,
    START_PARAGRAPH: 3.0,
    END_PARAGRAPH: 2.8,
    SHORT_SPACE: 1.6
  }
  const MATCH = {
    DASHES: /^(\/|-|\.|--|—|–)$/gm,
    WRAPS: /[«»"“”()[\]]/g,
    SENTENCE_TAIL: /([\s,]+([\d,-]|[a-z])+[.?!…]+[\n\s"])/g,
    SENTENCE_END: /[.?!…]/g,
    CLAUSE_END: /[,;:]/g,
    TOKENS: /["«»“”()/–—]|\s|--+|\n+|[^\s"“«»”()/–—]+/g,
    WRAPS_AND_SPACES: '«»"“”()[] '
  }
  const WRAPS = {
    GUILLEMOT: { LEFT: '«', RIGHT: '»' },
    STANDARD_QUOTE: { LEFT: '"', RIGHT: '"' },
    DOUBLE_QUOTE: { LEFT: '“', RIGHT: '”' },
    PARENS: { LEFT: '(', RIGHT: ')' }
  }
  const tokensArray = text => (text && text.match(MATCH.TOKENS)) || []
  const _shouldIgnoreToken = token => MATCH.WRAPS_AND_SPACES.includes(token)
  const _tokenWordModifier = word => {
    let modifier = 0
    switch (word.length) {
      case 1:
      case 2:
      case 3:
        break
      case 4:
      case 5:
        modifier = modifier + 0.2
        break
      case 6:
      case 7:
        modifier = modifier + 0.4
        break
      case 8:
      case 9:
        modifier = modifier + 0.6
        break
      case 10:
      case 11:
        modifier = modifier + 0.8
        break
      case 12:
      case 13:
        modifier = modifier + 1
    }
    return modifier
  }
  const _tokenWrapsModifier = text => {
    let modifier = MODIFIERS.NORMAL
    let wraps = {}
    switch (text) {
      case WRAPS.DOUBLE_QUOTE.LEFT:
        wraps = WRAPS.DOUBLE_QUOTE
        modifier = MODIFIERS.SHORT_SPACE
        break
      case WRAPS.DOUBLE_QUOTE.RIGHT:
        modifier = MODIFIERS.SHORT_SPACE
        wraps = WRAPS.DOUBLE_QUOTE
        break
      case WRAPS.GUILLEMOT.LEFT:
        wraps = WRAPS.GUILLEMOT
        modifier = MODIFIERS.SHORT_SPACE
        break
      case WRAPS.GUILLEMOT.RIGHT:
        modifier = MODIFIERS.SHORT_SPACE
        wraps = WRAPS.GUILLEMOT
        break
      case WRAPS.PARENS.LEFT:
        wraps = WRAPS.PARENS
        modifier = MODIFIERS.SHORT_SPACE
        break
      case WRAPS.PARENS.RIGHT:
        modifier = MODIFIERS.SHORT_SPACE
        wraps = WRAPS.PARENS
        break
      case WRAPS.STANDARD_QUOTE.RIGHT:
      case WRAPS.STANDARD_QUOTE.LEFT:
        wraps = WRAPS.STANDARD_QUOTE
        modifier = MODIFIERS.SHORT_SPACE
        break
      default:
        if (text.match(MATCH.DASHES)) modifier = MODIFIERS.SHORT_SPACE
        if (text.match(MATCH.SENTENCE_END)) modifier = MODIFIERS.END_SENTENCE
        if (text.match(MATCH.CLAUSE_END)) modifier = MODIFIERS.SHORT_SPACE
    }
    return { wraps, modifier }
  }
  const _wordOffset = word => {
    const len = word.length
    if (len < 3) return 4
    else if (len < 6) return 3
    else if (len < 10) return 2
    else if (len < 14) return 1
    else return 0
  }
  const _getTokenMeta = text => {
    const offset = _wordOffset(text)
    let { wraps, modifier } = _tokenWrapsModifier(text)
    modifier += _tokenWordModifier(text)
    return { modifier, wraps, offset }
  }
  const instructions = text => {
    const { modifier, wraps, offset } = _getTokenMeta(text)
    return _shouldIgnoreToken(text)
      ? { text, wraps, modifier, ignore: true }
      : { text, wraps, modifier, offset }
  }
  return sentence => {
    let wraps = {}
    let modifier = 0.5
    let usedModifier = false
    return tokensArray(sentence)
      .map((token, index) => {
        if (token.length > 13) {
          const result = []
          const dashIdx = token.indexOf('-')
          if (dashIdx > 0 && dashIdx < token.length - 1) {
            result.push(token.substr(0, dashIdx))
            result.push(token.substr(dashIdx + 1))
            return getInstructions(result.join('- '))
          }
          let partitions = Math.ceil(token.length / 8)
          const partitionLength = Math.ceil(token.length / partitions)
          while (partitions--) {
            result.push(token.substr(0, partitionLength))
            token = token.substr(partitionLength)
          }
          return getInstructions(result.join('- ')).filter(({ignore}) => !ignore)
        }
        const { text, offset, ignore, modifier: _modifier, wraps: _wraps } = instructions(token, index)
        if (Object.keys(_wraps).length) {
          if (!Object.keys(wraps).length) {
            wraps = _wraps
          } else {
            wraps = {}
          }
        }
        if (ignore) {
          if (modifier + 1 < _modifier) {
            modifier = _modifier - 1
          }
        } else {
          modifier = modifier + _modifier
          usedModifier = true
        }
        const result = ignore
          ? { text, ignore, index }
          : { text, modifier, wraps, offset, index }
        if (usedModifier) { modifier = 0; usedModifier = false }
        return result
      })
      .reduce((arr, token) => Array.isArray(token)
        ? [...arr, ...token]
        : [...arr, token], [])
      .map((token, i) => Object.assign({}, token, {index: i}))
  }
})
