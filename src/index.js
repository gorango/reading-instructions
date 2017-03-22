import { instructions, tokensArray } from './instructions'

/**
 * Generate instructions for displaying a given string of text in an automated reader
 * NOTE: This function doesn't split text into sentences or paragraphs. The onus is on the user.
 *
 * @param  {String} sentence    any old string
 * @return {Array}              array of Token objects
 *
 * Token = {
 *   text: String,       // Plain text for the token - words, space, punctuation, quote, etc.
 *   index: Number,      // Location within the text
 *   modifier: Number,   // Adjust display duration based on word length and position
 *   wraps: {
 *     LEFT: String,     // Quoted or parentheses string of length 1
 *     RIGHT: String     // Quoted or parentheses string of length 1
 *   },
 *   offset: Number      // Offset x characters from left - for optimal alignment
 *   ignore: Boolean,    // A speed reader should ignore spaces, quotes and parens
 * }
 */
const getInstructions = sentence => {
  // keet track of the word wraps in order to update words nested in parens or quotes.
  let wraps = {}
  // keet track of additional word delay modifiers to update later words (following ignored tokens)
  let modifier = 0
  let usedModifier = false
  // split text into an array of tokens (words, spaces, quotes, ...)
  return tokensArray(sentence).map((token, index) => {
    const { text, offset, ignore, modifier: _modifier, wraps: _wraps } = instructions(token, index)

    // If wraps are declared, assign appropriate value to our local variable
    if (Object.keys(_wraps).length) {
      // Because standard quotes (") are the same on both ends, we need to toggle them.
      // This approach is applied to all wraps for consistency (even though we can detect for others)
      // Simply check if they've already been initialized and close them.
      // BUG: runs into issues with nested quotes -- rare occurence but it happens
      if (!Object.keys(wraps).length) {
        wraps = _wraps
      } else {
        wraps = {}
      }
    }

    // transfer modifiers nested in quotes and parentheses
    // if a modifier was passed to a paren or quote token, update our local varaible
    if (ignore) {
      if (modifier + 1 < _modifier) {
        modifier = _modifier - 1
      }
    } else {
      // we are on a word with its own modifier
      modifier = modifier + _modifier
      usedModifier = true
    }

    // Result objects based on the type of token:
    const result = ignore
      // - if the token is a space, paren, puntuation or quotation:
      ? { text, ignore, index }
      // - if the token is a word:
      : { text, modifier, wraps, offset, index }

    // reset our local values for tracking delay modifiers
    if (usedModifier) { modifier = 0; usedModifier = false }

    return result
  })
}

export default getInstructions
