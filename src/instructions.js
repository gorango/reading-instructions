
export const { MODIFIERS, MATCH, WRAPS } = require('./constants')

// split text into an array of words
export const tokensArray = text => (text && text.match(MATCH.TOKENS)) || []

// check if the word consists of a space or wrap elements
export const shouldIgnoreToken = token => MATCH.WRAPS_AND_SPACES.includes(token)

// calculate word delay modifier based on word length and index
export const tokenWordModifier = (word, index) => {
  let modifier = index === 0 ? 0.5 : 0
  switch (word.length) {
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
      break
    default:
      // BUG: split words longer than 13 characters
      modifier = word.length > 13 ? 2 : modifier
  }
  return modifier
}

// return a wraps object and a modifier value based on token string
// TODO: filter out urls, citations, super/sub script references, ...
export const tokenWrapsModifier = text => {
  let modifier = MODIFIERS.NORMAL
  let wraps = {}
  switch (text) {
    // match double quotes: “ ”
    case WRAPS.DOUBLE_QUOTE.LEFT:
      wraps = WRAPS.DOUBLE_QUOTE
      modifier = MODIFIERS.SHORT_SPACE
      break
    case WRAPS.DOUBLE_QUOTE.RIGHT:
      modifier = MODIFIERS.SHORT_SPACE
      wraps = WRAPS.DOUBLE_QUOTE
      break
    // match guillemot quotes: « »
    case WRAPS.GUILLEMOT.LEFT:
      wraps = WRAPS.GUILLEMOT
      modifier = MODIFIERS.SHORT_SPACE
      break
    case WRAPS.GUILLEMOT.RIGHT:
      modifier = MODIFIERS.SHORT_SPACE
      wraps = WRAPS.GUILLEMOT
      break
    // match parentheses: ( )
    case WRAPS.PARENS.LEFT:
      wraps = WRAPS.PARENS
      modifier = MODIFIERS.SHORT_SPACE
      break
    case WRAPS.PARENS.RIGHT:
      modifier = MODIFIERS.SHORT_SPACE
      wraps = WRAPS.PARENS
      break
    // STANDARD_QUOTE (") is the same on both left and right
    case WRAPS.STANDARD_QUOTE.RIGHT:
      // NOTE: wraps are closed in main fn loop since we can't know which end it's on here
      // eslint-disable-next-line
    case WRAPS.STANDARD_QUOTE.LEFT:
      wraps = WRAPS.STANDARD_QUOTE
      modifier = MODIFIERS.SHORT_SPACE
      break
    // default case catches all words, spaces, dashes, etc.
    default:
      // adjust modifier based on contents and position of the text
      if (text.match(MATCH.DASHES)) modifier = MODIFIERS.SHORT_SPACE
      if (text.match(MATCH.SENTENCE_END)) modifier = MODIFIERS.END_SENTENCE
      if (text.match(MATCH.CLAUSE_END)) modifier = MODIFIERS.SHORT_SPACE
  }
  return { wraps, modifier }
}

// return optimal offset for word's center alignment
export const wordOffset = word => {
  const len = word.length
  if (len < 3) return 4
  else if (len < 6) return 3
  else if (len < 10) return 2
  else if (len < 14) return 1
  else return 0
}

// initialize an instructions object for a given string
export const getTokenMeta = (text, index) => {
  // get optimal center alignment
  const offset = wordOffset(text)
  // get wraps object if a word is nested within quotes or parentheses
  // modify word's display duration based on different factors
  let { wraps, modifier } = tokenWrapsModifier(text)
  // calculate word delay modifier based on word length and index
  modifier += tokenWordModifier(text, index)

  return { modifier, wraps, offset }
}

// generate instructions for a text string at a given index
export const instructions = (text, index) => {
  // create an instructions object for a given string
  const { modifier, wraps, offset } = getTokenMeta(text, index)
  // return one of two objects, depending on the type of token is in `text`
  return (
      shouldIgnoreToken(text) && { text, wraps, modifier, ignore: true }
    ) ||
    { text, modifier, wraps, offset }
}
